// Play and between-mission actions. Every function changes the character in place
// and returns { events: [text] } plus any extra result. No DOM access.
// The site never rolls game dice: every die is rolled at the table, where the
// Admin can see it, and passed in here as a number.
window.CAIN = window.CAIN || {};

(function () {
	var R = CAIN.rules;
	var core = CAIN.core;

	// Fills fields added after a character was first saved.
	function normalize(ch) {
		var fresh = R.newHunt();
		ch.hunt = ch.hunt || fresh;
		Object.keys(fresh).forEach(function (k) {
			if (ch.hunt[k] === undefined) ch.hunt[k] = fresh[k];
		});
		if (ch.dead === undefined) ch.dead = null;
		if (!Array.isArray(ch.log)) ch.log = [];
		if (ch.weaponLook === undefined) ch.weaponLook = "";
		if (ch.notes === undefined) ch.notes = "";
		if (ch.kitNotes === undefined) ch.kitNotes = "";
		if (!ch.custom) ch.custom = { agendas: [], blasphemies: [] };
		if (!ch.custom.agendas) ch.custom.agendas = [];
		if (!ch.custom.blasphemies) ch.custom.blasphemies = [];
		// Bursts start full: a fresh hunt holds null until first shown.
		if (ch.hunt.bursts === null) ch.hunt.bursts = R.derived(ch).psycheBursts;
		return ch;
	}

	function log(ch, events, text) {
		events.push(text);
		ch.log.unshift({ t: Date.now(), text: text });
		if (ch.log.length > 60) ch.log.length = 60;
	}

	// Logs a manual change so the Admin can see what was set by hand.
	function note(ch, text) {
		var events = [];
		log(ch, events, text);
		return { events: events };
	}

	function validDie(value, sides) {
		return typeof value === "number" && value >= 1 && value <= sides && Math.floor(value) === value;
	}

	function hasAgendaAbility(ch, id) {
		return ch.agendaAbilities.some(function (r) { return r.ability === id; });
	}

	function hasPassive(ch, id) {
		return ch.blasphemies.some(function (b) { var x = R.blasphemy(b.id); return x && x.passive.id === id; });
	}

	function gainPathos(ch, events, why) {
		var h = ch.hunt;
		if (h.pathos >= core.base.pathosMax) return;
		h.pathos += 1;
		log(ch, events, "Pathos +1 (" + why + ").");
	}

	function burstsMax(ch) { return R.derived(ch).psycheBursts; }
	function kpLeft(ch) { return R.derived(ch).kitPoints - ch.hunt.kpSpent; }
	function atBrink(ch) { return ch.hunt.injuries >= R.derived(ch).maxInjuries; }

	// Missions

	// Abilities that need a die rolled when a hunt starts, e.g. Oilfinger's 1d3+1 KP.
	function missionRollsNeeded(ch) {
		var out = [];
		ch.agendaAbilities.forEach(function (ref) {
			var ab = R.agendaAbility(ref);
			if (ab && ab.missionRoll) out.push({ id: ab.id, name: ab.name, dice: ab.missionRoll.dice, plus: ab.missionRoll.plus, stat: ab.missionRoll.stat });
		});
		return out;
	}

	// Fresh hunt: full bursts and KP. opts: { jackSkill, missionRolls: { abilityId: die } }.
	function startMission(ch, opts) {
		opts = opts || {};
		var events = [];
		var rolls = opts.missionRolls || {};
		var needed = missionRollsNeeded(ch);
		var missing = needed.filter(function (n) { return !validDie(rolls[n.id], 3); });
		if (missing.length) return { events: events, ok: false, needs: missing };
		ch.hunt = R.newHunt();
		ch.hunt.started = true;
		ch.hunt.bursts = burstsMax(ch);
		needed.forEach(function (n) {
			var total = rolls[n.id] + n.plus;
			if (n.stat === "kitPoints") ch.hunt.kpBonus += total;
			log(ch, events, n.name + ": rolled " + rolls[n.id] + "+" + n.plus + " = +" + total + " KP this mission.");
		});
		if (opts.jackSkill && hasAgendaAbility(ch, "jack") && ch.skills[opts.jackSkill] === 0) {
			ch.hunt.jackSkill = opts.jackSkill;
			log(ch, events, "Jack!: " + opts.jackSkill + " counts as 1 this mission.");
		}
		log(ch, events, "Deployed on a new hunt with " + ch.hunt.bursts + " psyche bursts and " + kpLeft(ch) + " KP.");
		return { events: events, ok: true };
	}

	// Closes the mission. opts: { outcome: "execute" | "spare" | "fail", bodies, died }.
	function endMission(ch, opts) {
		var events = [];
		if (opts.died) {
			ch.dead = { cause: "Died on a hunt", t: Date.now() };
			log(ch, events, "Did not survive the mission.");
			return { events: events };
		}
		var catBefore = R.derived(ch).cat;
		var pay = core.missionPay[opts.outcome] || 0;
		var bodies = Math.max(0, opts.bodies || 0);
		ch.scrip = Math.max(0, ch.scrip + pay + bodies * core.missionPay.perBodyRecovered);
		log(ch, events, "Mission " + (opts.outcome === "execute" ? "success" : opts.outcome === "spare" ? "spared" : "failed") + ": " + (pay >= 0 ? "+" : "") + pay + " scrip" + (bodies ? ", +" + bodies + " scrip and XP for remains recovered" : "") + ".");
		if (bodies) addXp(ch, bodies, events);
		var sinBefore = ch.sin;
		ch.sin = ch.settings.clearSinAfterMission ? 0 : R.halveSin(ch.sin);
		if (sinBefore) log(ch, events, "Sin " + sinBefore + " -> " + ch.sin + ".");
		ch.missionsSurvived += 1;
		var catAfter = R.derived(ch).cat;
		log(ch, events, "Missions survived: " + ch.missionsSurvived + ".");
		if (catAfter > catBefore) log(ch, events, "Category rating raised to CAT " + catAfter + ".");
		ch.hunt = R.newHunt();
		return { events: events, catUp: catAfter > catBefore };
	}

	// Stress and harm

	// Would this hit fill the talisman with Iron Soul still available?
	function ironSoulApplies(ch, amount, nonlethal) {
		var h = ch.hunt;
		return !nonlethal && hasPassive(ch, "iron-soul") && !h.ironSoulUsed && !atBrink(ch) &&
			amount < core.base.instantDeathStress && h.stress + amount >= R.derived(ch).maxStress;
	}

	// opts: { nonlethal, ironSoulRoll }. ironSoulRoll is the player's d6 for Iron Soul,
	// or null to decline it. If Iron Soul applies and neither is given, nothing changes
	// and the result asks for it. Returns { death } when the hit kills.
	function takeStress(ch, amount, opts) {
		opts = opts || {};
		var events = [];
		var h = ch.hunt;
		if (amount <= 0) return { events: events };
		// Marking any stress on the brink of death is fatal, nonlethal included.
		if (atBrink(ch)) return instantDeath(ch, events, "Took stress on the brink of death.");
		if (!opts.nonlethal && amount >= core.base.instantDeathStress) return instantDeath(ch, events, "Took " + amount + " stress in one hit.");
		var max = R.derived(ch).maxStress;
		if (opts.nonlethal) {
			var before = h.stress;
			h.stress = Math.max(h.stress, Math.min(h.stress + amount, max - 1));
			log(ch, events, "Took " + (h.stress - before) + " nonlethal stress" + (h.stress - before < amount ? " (rest ignored)" : "") + ".");
			return { events: events };
		}
		var useIron = ironSoulApplies(ch, amount, false);
		if (useIron && opts.ironSoulRoll === undefined) return { events: events, ask: "ironSoul" };
		h.stress += amount;
		log(ch, events, "Took " + amount + " stress.");
		while (h.stress >= (max = R.derived(ch).maxStress)) {
			if (useIron && validDie(opts.ironSoulRoll, 6)) {
				useIron = false;
				h.ironSoulUsed = true;
				if (opts.ironSoulRoll >= 4) {
					h.stress = max - 1;
					log(ch, events, "Iron Soul: rolled " + opts.ironSoulRoll + ". Held at " + h.stress + " stress, excess ignored.");
					break;
				}
				log(ch, events, "Iron Soul: rolled " + opts.ironSoulRoll + ". It fails.");
			}
			var over = h.stress - max;
			h.injuries += 1;
			log(ch, events, "Execution talisman filled: injury " + h.injuries + ".");
			gainPathos(ch, events, "injury");
			if (atBrink(ch)) {
				h.stress = 0;
				log(ch, events, "On the brink of death. Any more stress is instant death.");
				break;
			}
			h.stress = over;
			if (over) log(ch, events, over + " stress rolls over.");
		}
		return { events: events };
	}

	function instantDeath(ch, events, reason) {
		ch.hunt.pending = { type: "instantDeath", reason: reason };
		log(ch, events, "Instant death: " + reason);
		return { events: events, death: true };
	}

	// After instant death: "die", or "defy" fate and suffer sin overflow at one injury below max.
	function resolveDeath(ch, choice) {
		var events = [];
		var h = ch.hunt;
		if (choice === "die") {
			ch.dead = { cause: h.pending ? h.pending.reason : "Instant death", t: Date.now() };
			h.pending = null;
			log(ch, events, "Died.");
		} else {
			h.injuries = Math.max(0, R.derived(ch).maxInjuries - 1);
			h.stress = 0;
			h.pending = { type: "overflow", forced: true };
			log(ch, events, "Defied fate: down to " + h.injuries + " injuries, and sin overflow takes hold.");
		}
		return { events: events };
	}

	function healStress(ch, amount) {
		var events = [];
		var before = ch.hunt.stress;
		ch.hunt.stress = Math.max(0, before - amount);
		if (before !== ch.hunt.stress) log(ch, events, "Erased " + (before - ch.hunt.stress) + " stress.");
		return { events: events };
	}

	function changeInjuries(ch, delta) {
		var events = [];
		var h = ch.hunt;
		var max = R.derived(ch).maxInjuries;
		var next = Math.max(0, Math.min(max, h.injuries + delta));
		if (next === h.injuries) return { events: events };
		h.injuries = next;
		if (delta > 0) gainPathos(ch, events, "injury");
		log(ch, events, delta > 0 ? "Marked an injury (" + next + ")." : "Healed an injury (" + next + ").");
		h.stress = Math.min(h.stress, Math.max(0, R.derived(ch).maxStress - 1));
		return { events: events };
	}

	// Hooks and afflictions

	function addHook(ch, name) {
		var events = [];
		var existing = ch.hunt.hooks.filter(function (k) { return k.name.toLowerCase() === name.toLowerCase(); })[0];
		if (existing) {
			log(ch, events, "Gained hook \"" + name + "\" again.");
			return slashHook(ch, ch.hunt.hooks.indexOf(existing), 1, events);
		}
		ch.hunt.hooks.push({ name: name, slashes: 0 });
		log(ch, events, "New hook: " + name + ".");
		return { events: events };
	}

	function slashHook(ch, index, n, events) {
		events = events || [];
		var hk = ch.hunt.hooks[index];
		if (!hk) return { events: events };
		var before = hk.slashes;
		hk.slashes = Math.max(0, Math.min(core.base.hookLength, hk.slashes + n));
		if (hk.slashes > before) log(ch, events, "Hook \"" + hk.name + "\" slashed (" + hk.slashes + "/" + core.base.hookLength + ").");
		else if (hk.slashes < before) log(ch, events, "Erased " + (before - hk.slashes) + " slash on hook \"" + hk.name + "\".");
		if (before < core.base.hookLength && hk.slashes === core.base.hookLength) {
			gainPathos(ch, events, "hook filled");
			log(ch, events, "Hook \"" + hk.name + "\" is full. The Admin can cash it in.");
		}
		return { events: events };
	}

	function removeHook(ch, index) {
		var events = [];
		var hk = ch.hunt.hooks.splice(index, 1)[0];
		if (hk) log(ch, events, "Hook \"" + hk.name + "\" resolved.");
		return { events: events };
	}

	// Pressure going up slashes every hook.
	function pressureRises(ch) {
		var events = [];
		log(ch, events, "Pressure increased.");
		ch.hunt.hooks.forEach(function (hk, i) { slashHook(ch, i, 1, events); });
		return { events: events };
	}

	function addAffliction(ch, text) {
		var events = [];
		ch.hunt.afflictions.push(text);
		log(ch, events, "Affliction: " + text + ".");
		gainPathos(ch, events, "affliction");
		return { events: events };
	}

	function removeAffliction(ch, index) {
		var events = [];
		var a = ch.hunt.afflictions.splice(index, 1)[0];
		if (a !== undefined) log(ch, events, "Affliction removed: " + a + ".");
		return { events: events };
	}

	function changePathos(ch, delta) {
		var events = [];
		var h = ch.hunt;
		h.pathos = Math.max(0, Math.min(core.base.pathosMax, h.pathos + delta));
		log(ch, events, "Pathos " + h.pathos + ".");
		return { events: events };
	}

	// Psyche bursts, sin and kit

	// Spend one burst, or pass sinRoll (the 1d3 rolled) to take that much sin instead.
	function spendBurst(ch, sinRoll, why) {
		var events = [];
		var h = ch.hunt;
		var label = why ? " (" + why + ")" : "";
		if (sinRoll !== undefined && sinRoll !== null) {
			if (!validDie(sinRoll, 3)) return { events: events, ok: false, reason: "Enter the 1d3 you rolled." };
			ch.sin += sinRoll;
			log(ch, events, "Took " + sinRoll + " sin instead of a psyche burst" + label + ". Sin " + ch.sin + ".");
			return { events: events, ok: true, sinGained: sinRoll };
		}
		if (h.bursts <= 0) return { events: events, ok: false, reason: "No psyche bursts left." };
		h.bursts -= 1;
		log(ch, events, "Spent a psyche burst" + label + ". " + h.bursts + " left.");
		return { events: events, ok: true, sinGained: 0 };
	}

	function regainBursts(ch, n) {
		var events = [];
		var before = ch.hunt.bursts;
		ch.hunt.bursts = Math.min(burstsMax(ch), before + n);
		if (ch.hunt.bursts !== before) log(ch, events, "Regained " + (ch.hunt.bursts - before) + " psyche burst. " + ch.hunt.bursts + " now.");
		return { events: events };
	}

	function changeSin(ch, delta) {
		var events = [];
		ch.sin = Math.max(0, ch.sin + delta);
		log(ch, events, "Sin " + ch.sin + ".");
		return { events: events };
	}

	function spendKp(ch, n, what) {
		var events = [];
		if (kpLeft(ch) < n) return { events: events, ok: false };
		ch.hunt.kpSpent += n;
		if (what) ch.hunt.pulled.push(what);
		log(ch, events, (what ? "Pulled out " + what + ": " : "Spent ") + n + " KP. " + kpLeft(ch) + " left.");
		return { events: events, ok: true };
	}

	// Uses a consumable: pays its KP, applies its effect with the die rolled, uses one up.
	function useConsumable(ch, itemId, roll) {
		var events = [];
		var owned = ch.purchases.filter(function (p) { return p.item === itemId; })[0];
		var item = owned ? R.purchaseItem(owned) : null;
		if (!item || !owned || owned.count <= 0) return { events: events, ok: false };
		if (kpLeft(ch) < item.kp) return { events: events, ok: false, reason: "Not enough KP." };
		var heal = item.use && item.use.healStress;
		if (heal && !validDie(roll, 3)) return { events: events, ok: false, needsRoll: heal.dice };
		ch.hunt.kpSpent += item.kp;
		owned.count -= 1;
		if (owned.count <= 0) ch.purchases.splice(ch.purchases.indexOf(owned), 1);
		log(ch, events, "Used " + item.name + " (" + item.kp + " KP).");
		if (heal) {
			log(ch, events, item.name + ": rolled " + roll + "+" + heal.plus + " = " + (roll + heal.plus) + ".");
			healStress(ch, roll + heal.plus).events.forEach(function (e) { events.push(e); });
		}
		return { events: events, ok: true };
	}

	// Rolls

	// Works out the dice pool for a roll the player is about to make.
	// opts: { skill (id or "psyche"), setup, ability, circumstance, burst, agony, hard }.
	function poolFor(ch, opts) {
		var d = R.derived(ch);
		var base = opts.skill === "psyche" ? d.psyche : d.skillDice[opts.skill];
		var bonus = (opts.setup ? 1 : 0) + (opts.ability || 0) + (opts.circumstance || 0) + (opts.burst ? 1 : 0);
		var agony = opts.agony && !ch.hunt.divineAgonyUsed ? ch.hunt.pathos : 0;
		var p = R.dicePool({ skill: base, bonus: bonus, agony: agony, hard: opts.hard });
		p.skillName = opts.skill === "psyche" ? "PSYCHE" : core.skills.filter(function (s) { return s.id === opts.skill; })[0].name;
		p.base = base;
		p.agony = agony;
		return p;
	}

	// Records a roll made at the table: spends the burst (or the sin rolled for it) and
	// Divine Agony's pathos, and stores pathos on 0 successes.
	// opts as poolFor, plus burstSinRoll (the 1d3 when paying the burst with sin).
	function recordRoll(ch, opts, successes) {
		var events = [];
		var h = ch.hunt;
		var p = poolFor(ch, opts);
		if (!(successes >= 0 && successes <= p.maxSuccesses)) return { events: events, ok: false, reason: "Enter how many successes you rolled (0-" + p.maxSuccesses + ")." };
		if (opts.agony && (h.divineAgonyUsed || h.pathos <= 0)) return { events: events, ok: false, reason: "Divine Agony isn't available." };
		if (opts.burst) {
			var b = spendBurst(ch, opts.burstSinRoll, "for +1D");
			if (!b.ok) return { events: events, ok: false, reason: b.reason };
			b.events.forEach(function (e) { events.push(e); });
		}
		if (opts.agony) {
			h.pathos = 0;
			h.divineAgonyUsed = true;
			log(ch, events, "Divine Agony: burned " + p.agony + " pathos for +" + p.agony + "D.");
		}
		var extras = [opts.setup ? "setup" : null, opts.burst ? "burst" : null, opts.ability ? "ability +" + opts.ability : null,
			opts.circumstance ? "circumstance +" + opts.circumstance : null, opts.agony ? "Divine Agony" : null, opts.hard ? "hard" : null].filter(Boolean);
		var entry = { t: Date.now(), skillName: p.skillName, pool: p.pool, zeroPool: p.zeroPool, hard: p.hard, successes: successes, extras: extras };
		log(ch, events, p.skillName + " " + p.pool + "D" + (extras.length ? " (" + extras.join(", ") + ")" : "") + ": " + successes + " success" + (successes === 1 ? "" : "es") + ".");
		if (successes === 0) gainPathos(ch, events, "no successes");
		h.rolls.unshift(entry);
		if (h.rolls.length > 8) h.rolls.length = 8;
		return { events: events, ok: true, roll: entry };
	}

	// Rest

	// Records a rest with the resting dice rolled (each 1-3). Assign each with assignRest.
	function rest(ch, values) {
		var events = [];
		var h = ch.hunt;
		var count = R.derived(ch).restDice;
		if (!Array.isArray(values) || values.length !== count || !values.every(function (v) { return validDie(v, 3); })) {
			return { events: events, ok: false, reason: "Enter all " + count + " resting dice (1-3 each)." };
		}
		h.restDice = values.map(function (v) { return { value: v, used: false }; });
		h.rests += 1;
		h.ironSoulUsed = false;
		log(ch, events, "Rested: resting dice " + values.join(" and ") + ". Pressure +1 (tell the Admin).");
		return { events: events, ok: true };
	}

	// target: "bursts", "stress", or { hook: index }.
	function assignRest(ch, dieIndex, target) {
		var events = [];
		var h = ch.hunt;
		var die = h.restDice && h.restDice[dieIndex];
		if (!die || die.used) return { events: events, ok: false };
		var sub;
		if (target === "bursts") sub = regainBursts(ch, die.value);
		else if (target === "stress") sub = healStress(ch, die.value);
		else sub = slashHook(ch, target.hook, -die.value);
		sub.events.forEach(function (e) { events.push(e); });
		die.used = true;
		if (h.restDice.every(function (x) { return x.used; })) h.restDice = null;
		return { events: events, ok: true };
	}

	// Sin overflow and sin marks

	function overflowDue(ch) {
		return !ch.dead && (ch.sin >= R.derived(ch).sinCap || !!(ch.hunt.pending && ch.hunt.pending.type === "overflow"));
	}

	// choice: "giveUp" or "resist" (with the player's d6 when they have sin marks).
	function resolveOverflow(ch, choice, roll) {
		var events = [];
		if (choice === "giveUp") {
			ch.dead = { cause: "Gave in to sin overflow and became a sin", t: Date.now() };
			ch.hunt.pending = null;
			log(ch, events, "Gave up. The exorcist becomes a sin.");
			return { events: events };
		}
		var r = R.resistOverflow(ch, roll);
		if (r.needsRoll) return { events: events, ok: false, needsRoll: true };
		log(ch, events, "Resistance check: " + (r.roll === null ? "" : "rolled " + r.roll + " + " + ch.sinMarks.length + " marks = " + r.total + ". ") + r.reason);
		if (!r.pass) {
			ch.dead = { cause: "Lost control in sin overflow and became a sin", t: Date.now() };
			ch.hunt.pending = null;
			return { events: events, ok: true, pass: false };
		}
		ch.sin = 0;
		ch.sinBoxesCrossed += 2;
		ch.hunt.pending = { type: "sinMark" };
		log(ch, events, "Kept control. Sin cleared, two sin boxes crossed out. A sin mark manifests.");
		return { events: events, ok: true, pass: true };
	}

	// Ability faces a mark already has (so the player knows to reroll them).
	function ownedMarkFaces(ch, markId) {
		var owned = ch.sinMarks.filter(function (x) { return x.mark === markId; })[0];
		return owned ? owned.abilities.map(function (a) { return a.roll; }) : [];
	}

	// Adds a mark (new) or evolves it (owned) with the ability die rolled.
	// A face the mark already has is refused: the player rerolls duplicates.
	function gainSinMark(ch, markId, face, events) {
		events = events || [];
		var m = R.sinMark(markId);
		if (!m) return { events: events, ok: false, reason: "Unknown sin mark." };
		if (!validDie(face, 6)) return { events: events, ok: false, reason: "Enter the d6 for the ability." };
		if (ownedMarkFaces(ch, markId).indexOf(face) >= 0) return { events: events, ok: false, duplicate: true, reason: "You already have that ability. Roll again." };
		var owned = ch.sinMarks.filter(function (x) { return x.mark === markId; })[0];
		var isNew = !owned;
		if (isNew) { owned = { mark: markId, abilities: [] }; ch.sinMarks.push(owned); }
		var ab = R.sinMarkAbility(markId, face);
		var entry = { roll: face };
		if (ab.skillBonus) entry.skill = ab.skillBonus.choose[0];
		owned.abilities.push(entry);
		if (ch.hunt.pending && ch.hunt.pending.type === "sinMark") ch.hunt.pending = null;
		log(ch, events, (isNew ? "Sin mark: " : "Sin mark evolves: ") + m.name + ", ability " + face + ".");
		return { events: events, ok: true, mark: markId, ability: face, choose: ab.skillBonus ? ab.skillBonus.choose : null };
	}

	function setMarkSkill(ch, markId, face, skill) {
		var owned = ch.sinMarks.filter(function (x) { return x.mark === markId; })[0];
		var entry = owned && owned.abilities.filter(function (a) { return a.roll === face; })[0];
		if (entry) entry.skill = skill;
	}

	// Sessions and advances

	function addXp(ch, n, events) {
		var need = R.derived(ch).xpToAdvance;
		ch.xp += n;
		while (ch.xp >= need) {
			ch.xp -= need;
			ch.advances += 1;
			log(ch, events, "XP track filled: +1 advance (" + ch.advances + " banked).");
		}
	}

	// Adds XP outside the end-of-session questions.
	function addXpOnly(ch, n) {
		var events = [];
		log(ch, events, "+" + n + " XP.");
		addXp(ch, n, events);
		return { events: events };
	}

	// answers: { survived, firstItem, boldItem, harmed } booleans.
	function endSession(ch, answers) {
		var events = [];
		var yes = core.xpQuestions.filter(function (q) { return answers[q.id]; }).length;
		log(ch, events, "Session over: +" + yes + " XP.");
		addXp(ch, yes, events);
		ch.hunt.pathos = 0;
		ch.hunt.divineAgonyUsed = false;
		return { events: events, xp: yes };
	}

	// choice: { kind, ... } as listed by rules.legalAdvances, with the pick filled in:
	// agendaAbility { ability, replace }, blasphemyPower { blasphemy, power, replace },
	// newBlasphemy { blasphemy, power, replace }, evolveSinMark { mark, ability (d6) },
	// scrip, skill { skill }. replace is { agenda, ability } or { blasphemy, power }.
	function spendAdvance(ch, choice) {
		var events = [];
		if (ch.advances <= 0) return { events: events, ok: false, reason: "No advances banked." };
		var options = R.legalAdvances(ch);
		var allowed = options.filter(function (o) { return o.kind === choice.kind && (!o.blasphemy || o.blasphemy === choice.blasphemy); })[0];
		if (!allowed) return { events: events, ok: false, reason: "That advance isn't available." };
		var pickId = {
			agendaAbility: choice.ability,
			blasphemyPower: choice.power,
			newBlasphemy: choice.blasphemy,
			evolveSinMark: choice.mark,
			skill: choice.skill
		}[choice.kind];
		if (allowed.choices && allowed.choices.indexOf(pickId) < 0) return { events: events, ok: false, reason: "That pick isn't available." };
		if (allowed.mustReplace && !choice.replace) return { events: events, ok: false, reason: "At the cap: choose one to replace." };
		var result = { events: events, ok: true };
		if (choice.kind === "agendaAbility") {
			if (choice.replace) ch.agendaAbilities = ch.agendaAbilities.filter(function (r) { return !(r.agenda === choice.replace.agenda && r.ability === choice.replace.ability); });
			ch.agendaAbilities.push({ agenda: ch.agenda, ability: choice.ability });
			log(ch, events, "Advance: agenda ability " + R.agendaAbility({ agenda: ch.agenda, ability: choice.ability }).name + ".");
		} else if (choice.kind === "blasphemyPower" || choice.kind === "newBlasphemy") {
			if (choice.kind === "newBlasphemy" && !R.power(choice.blasphemy, choice.power)) return { events: events, ok: false, reason: "Pick a power from the new blasphemy." };
			if (choice.replace) {
				ch.blasphemies.forEach(function (b) {
					if (b.id === choice.replace.blasphemy) b.powers = b.powers.filter(function (p) { return p !== choice.replace.power; });
				});
			}
			if (choice.kind === "newBlasphemy") {
				var nb = R.blasphemy(choice.blasphemy);
				ch.blasphemies.push({ id: nb.id, powers: [choice.power] });
				log(ch, events, "Advance: new blasphemy " + nb.name + " with " + R.power(nb.id, choice.power).name + ". Sin cap -1, XP to advance +1.");
			} else {
				ch.blasphemies.filter(function (b) { return b.id === choice.blasphemy; })[0].powers.push(choice.power);
				log(ch, events, "Advance: power " + R.power(choice.blasphemy, choice.power).name + ".");
			}
		} else if (choice.kind === "evolveSinMark") {
			var res = gainSinMark(ch, choice.mark, choice.ability, events);
			if (!res.ok) return res;
			result.mark = res.mark;
			result.ability = res.ability;
			result.choose = res.choose;
		} else if (choice.kind === "scrip") {
			ch.scrip += core.advanceScrip;
			log(ch, events, "Advance: +" + core.advanceScrip + " scrip.");
		} else if (choice.kind === "skill") {
			ch.skills[choice.skill] += 1;
			ch.skillImprovements += 1;
			log(ch, events, "Advance: " + choice.skill + " raised to " + ch.skills[choice.skill] + ".");
		}
		ch.advances -= 1;
		return result;
	}

	// Kit list. Items are added for free; scrip is tracked by hand on the sheet.

	// Adds a catalog item. Consumables stack; anything else is listed once.
	function addItem(ch, itemId) {
		var events = [];
		var item = R.kitItem(itemId);
		if (!item) return { events: events, ok: false, reason: "Unknown item." };
		var owned = ch.purchases.filter(function (p) { return p.item === itemId; })[0];
		var consumable = item.tags.indexOf("Consumable") >= 0;
		if (owned && !consumable) return { events: events, ok: false, reason: item.name + " is already on your kit list." };
		if (owned) owned.count += 1; else ch.purchases.push({ item: itemId, count: 1 });
		log(ch, events, "Added " + item.name + " to the kit list.");
		return { events: events, ok: true };
	}

	// Creates a custom item. def: { name, kp, text, consumable }.
	function addCustomItem(ch, def) {
		var events = [];
		var name = (def.name || "").trim();
		if (!name) return { events: events, ok: false, reason: "Give the item a name." };
		var id = "custom-" + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36);
		ch.purchases.push({
			item: id,
			count: 1,
			custom: { name: name, kp: Math.max(0, def.kp || 0), text: (def.text || "").trim(), consumable: !!def.consumable }
		});
		log(ch, events, "Added custom item " + name + " (" + Math.max(0, def.kp || 0) + " KP) to the kit list.");
		return { events: events, ok: true, id: id };
	}

	// Custom agendas and blasphemies

	function uid(prefix) {
		return prefix + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36);
	}

	// Creates or updates a player-made agenda on this character.
	// def: { id?, name, items: [{ text, bold }], abilities: [{ id?, name, text }] }.
	// opts: { owned: [ability ids the character has], makeCurrent }.
	function saveCustomAgenda(ch, def, opts) {
		opts = opts || {};
		var events = [];
		var name = (def.name || "").trim();
		if (!name) return { events: events, ok: false, reason: "Give the agenda a name." };
		var isNew = !def.id;
		var agendaDef = {
			id: def.id || uid("ca-"),
			name: name,
			custom: true,
			requires: null,
			icon: R.iconSrc(def.icon) ? def.icon : "",
			items: (def.items || []).filter(function (it) { return (it.text || "").trim(); })
				.map(function (it) { return { text: it.text.trim(), bold: !!it.bold }; }),
			abilities: (def.abilities || []).filter(function (ab) { return (ab.name || "").trim(); })
				.map(function (ab) { return { id: ab.id || uid("a-"), name: ab.name.trim(), text: (ab.text || "").trim(), key: ab.key }; })
		};
		// key ties an unsaved ability to its "I have this" tick before it has an id.
		var owned = (opts.owned || []).map(function (k) {
			var hit = agendaDef.abilities.filter(function (ab) { return ab.id === k || ab.key === k; })[0];
			return hit ? hit.id : null;
		}).filter(Boolean);
		agendaDef.abilities.forEach(function (ab) { delete ab.key; });
		var list = ch.custom.agendas;
		var i = list.findIndex(function (a) { return a.id === agendaDef.id; });
		if (i >= 0) list[i] = agendaDef; else list.push(agendaDef);
		ch.agendaAbilities = ch.agendaAbilities.filter(function (r) { return r.agenda !== agendaDef.id || owned.indexOf(r.ability) >= 0; });
		owned.forEach(function (aid) {
			if (!ch.agendaAbilities.some(function (r) { return r.agenda === agendaDef.id && r.ability === aid; })) ch.agendaAbilities.push({ agenda: agendaDef.id, ability: aid });
		});
		if (opts.makeCurrent) ch.agenda = agendaDef.id;
		log(ch, events, (isNew ? "Created custom agenda " : "Updated custom agenda ") + name + ".");
		return { events: events, ok: true, id: agendaDef.id };
	}

	// A custom blasphemy's colours: two hex colours and the black-page switch.
	function cleanTheme(t) {
		t = t || {};
		var hex = /^#[0-9a-f]{6}$/i;
		return {
			color: hex.test(t.color || "") ? t.color.toLowerCase() : "#8a8a8a",
			color2: hex.test(t.color2 || "") ? t.color2.toLowerCase() : "#4a4a4a",
			dark: !!t.dark
		};
	}

	// Creates or updates a player-made blasphemy on this character.
	// def: { id?, name, summary, passive: { name, text }, powers: [{ id?, key?, name, text,
	// burst, tags: { duration, effect, range } }] }.
	// opts: { owned: [power ids or keys the character has], have: true to hold the blasphemy }.
	function saveCustomBlasphemy(ch, def, opts) {
		opts = opts || {};
		var events = [];
		var name = (def.name || "").trim();
		if (!name) return { events: events, ok: false, reason: "Give the blasphemy a name." };
		var bursts = core.burstKinds.map(function (k) { return k.id; });
		var isNew = !def.id;
		var passive = def.passive || {};
		var blasDef = {
			id: def.id || uid("cb-"),
			numeral: "",
			name: name,
			custom: true,
			summary: (def.summary || "").trim(),
			flavor: "",
			theme: cleanTheme(def.theme),
			icon: R.iconSrc(def.icon) ? def.icon : "",
			passive: { id: "passive", name: (passive.name || "").trim() || "Passive", text: (passive.text || "").trim() },
			powers: (def.powers || []).filter(function (p) { return (p.name || "").trim(); }).map(function (p) {
				var tags = p.tags || {};
				return {
					id: p.id || uid("p-"),
					key: p.key,
					name: p.name.trim(),
					text: (p.text || "").trim(),
					burst: bursts.indexOf(p.burst) >= 0 ? p.burst : "required",
					tags: { duration: tags.duration || "", effect: tags.effect || "", range: tags.range || "" }
				};
			})
		};
		var owned = (opts.owned || []).map(function (k) {
			var hit = blasDef.powers.filter(function (p) { return p.id === k || p.key === k; })[0];
			return hit ? hit.id : null;
		}).filter(Boolean);
		blasDef.powers.forEach(function (p) { delete p.key; });
		var list = ch.custom.blasphemies;
		var i = list.findIndex(function (b) { return b.id === blasDef.id; });
		if (i >= 0) list[i] = blasDef; else list.push(blasDef);
		var entry = ch.blasphemies.filter(function (b) { return b.id === blasDef.id; })[0];
		if (opts.have || owned.length) {
			if (!entry) { entry = { id: blasDef.id, powers: [] }; ch.blasphemies.push(entry); }
			entry.powers = owned;
		} else if (entry) {
			ch.blasphemies.splice(ch.blasphemies.indexOf(entry), 1);
		}
		log(ch, events, (isNew ? "Created custom blasphemy " : "Updated custom blasphemy ") + name + ".");
		return { events: events, ok: true, id: blasDef.id };
	}

	// Deletes a custom agenda or blasphemy and everything that referred to it.
	function deleteCustom(ch, kind, id) {
		var events = [];
		if (kind === "agenda") {
			var a = ch.custom.agendas.filter(function (x) { return x.id === id; })[0];
			ch.custom.agendas = ch.custom.agendas.filter(function (x) { return x.id !== id; });
			ch.agendaAbilities = ch.agendaAbilities.filter(function (r) { return r.agenda !== id; });
			if (ch.agenda === id) ch.agenda = null;
			if (a) log(ch, events, "Deleted custom agenda " + a.name + ".");
		} else {
			var b = ch.custom.blasphemies.filter(function (x) { return x.id === id; })[0];
			ch.custom.blasphemies = ch.custom.blasphemies.filter(function (x) { return x.id !== id; });
			ch.blasphemies = ch.blasphemies.filter(function (x) { return x.id !== id; });
			if (b) log(ch, events, "Deleted custom blasphemy " + b.name + ".");
		}
		return { events: events, ok: true };
	}

	// Swaps the current agenda, following the book: bolded items from the old
	// agenda carry over and its abilities stay. opts: { keepBold (default true),
	// ability: id from the new agenda to take now, useAdvance }.
	function swapAgenda(ch, agendaId, opts) {
		opts = opts || {};
		var events = [];
		var next = agendaId ? R.agenda(agendaId) : null;
		if (agendaId && !next) return { events: events, ok: false, reason: "Unknown agenda." };
		var old = ch.agenda ? R.agenda(ch.agenda) : null;
		if (old && next && old.id === next.id) return { events: events, ok: false, reason: "That is already your agenda." };
		var kept = [];
		if (old && opts.keepBold !== false) {
			old.items.forEach(function (it) {
				if (it.bold && ch.boldItems.indexOf(it.text) < 0 && !(next && next.items.some(function (n) { return n.text === it.text; }))) {
					ch.boldItems.push(it.text);
					kept.push(it.text);
				}
			});
		}
		ch.agenda = next ? next.id : null;
		var took = null;
		if (next && opts.ability) {
			var ab = next.abilities.filter(function (a) { return a.id === opts.ability; })[0];
			var have = ch.agendaAbilities.some(function (r) { return r.agenda === next.id && r.ability === opts.ability; });
			if (ab && !have) {
				ch.agendaAbilities.push({ agenda: next.id, ability: ab.id });
				took = ab.name;
				if (opts.useAdvance && ch.advances > 0) ch.advances -= 1; else opts.useAdvance = false;
			}
		}
		log(ch, events, "Swapped agenda" + (old ? " from " + old.name : "") + " to " + (next ? next.name : "none") + "."
			+ (kept.length ? " Kept bolded: " + kept.join("; ") + "." : "")
			+ (took ? " Took " + took + (opts.useAdvance ? " (used an advance)" : "") + "." : ""));
		return { events: events, ok: true, kept: kept };
	}

	// Replaces one of the character's blasphemies with another, with the powers
	// picked from it. The rules don't cover this; it's for Admin rulings and fixes.
	function swapBlasphemy(ch, index, blasphemyId, powerIds) {
		var events = [];
		var old = ch.blasphemies[index];
		var next = R.blasphemy(blasphemyId);
		if (!old || !next) return { events: events, ok: false, reason: "Pick a blasphemy to swap to." };
		if (ch.blasphemies.some(function (b, i) { return i !== index && b.id === next.id; })) return { events: events, ok: false, reason: "You already have " + next.name + "." };
		var powers = (powerIds || []).filter(function (pid, i, all) {
			return all.indexOf(pid) === i && next.powers.some(function (p) { return p.id === pid; });
		});
		var oldDef = R.blasphemy(old.id);
		ch.blasphemies[index] = { id: next.id, powers: powers };
		log(ch, events, "Swapped blasphemy " + (oldDef ? oldDef.name : old.id) + " for " + next.name
			+ (powers.length ? " (" + powers.map(function (pid) { return R.power(next.id, pid).name; }).join(", ") + ")" : "") + ".");
		return { events: events, ok: true };
	}

	CAIN.hunt = {
		normalize: normalize,
		saveCustomAgenda: saveCustomAgenda,
		saveCustomBlasphemy: saveCustomBlasphemy,
		deleteCustom: deleteCustom,
		note: note,
		kpLeft: kpLeft,
		burstsMax: burstsMax,
		atBrink: atBrink,
		hasAgendaAbility: hasAgendaAbility,
		hasPassive: hasPassive,
		missionRollsNeeded: missionRollsNeeded,
		startMission: startMission,
		endMission: endMission,
		ironSoulApplies: ironSoulApplies,
		takeStress: takeStress,
		resolveDeath: resolveDeath,
		healStress: healStress,
		changeInjuries: changeInjuries,
		addHook: addHook,
		slashHook: function (ch, i, n) { return slashHook(ch, i, n); },
		removeHook: removeHook,
		pressureRises: pressureRises,
		addAffliction: addAffliction,
		removeAffliction: removeAffliction,
		changePathos: changePathos,
		spendBurst: spendBurst,
		regainBursts: regainBursts,
		changeSin: changeSin,
		spendKp: spendKp,
		useConsumable: useConsumable,
		poolFor: poolFor,
		recordRoll: recordRoll,
		rest: rest,
		assignRest: assignRest,
		overflowDue: overflowDue,
		resolveOverflow: resolveOverflow,
		ownedMarkFaces: ownedMarkFaces,
		gainSinMark: gainSinMark,
		setMarkSkill: setMarkSkill,
		endSession: endSession,
		addXpOnly: addXpOnly,
		spendAdvance: spendAdvance,
		addItem: addItem,
		addCustomItem: addCustomItem,
		swapAgenda: swapAgenda,
		swapBlasphemy: swapBlasphemy
	};
})();
