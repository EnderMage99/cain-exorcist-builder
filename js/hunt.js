// Play and between-mission actions. Every function changes the character in place
// and returns { events: [text] } plus any extra result. No DOM access.
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
		return ch;
	}

	function log(ch, events, text) {
		events.push(text);
		ch.log.unshift({ t: Date.now(), text: text });
		if (ch.log.length > 60) ch.log.length = 60;
	}

	function hasAgendaAbility(ch, id) {
		return ch.agendaAbilities.some(function (r) { return r.ability === id; });
	}

	function hasPassive(ch, id) {
		return ch.blasphemies.some(function (b) { var x = R.blasphemy(b.id); return x && x.passive.id === id; });
	}

	// Rolls "NdM" (d3 or d6) plus a flat amount.
	function rollExpr(dice, plus, rng) {
		var m = /^(\d+)d(\d+)$/.exec(dice);
		var rolls = R.rollDice(parseInt(m[1], 10), parseInt(m[2], 10), rng);
		return { rolls: rolls, total: rolls.reduce(function (a, b) { return a + b; }, 0) + (plus || 0) };
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

	// Fresh hunt: full bursts and KP, mission rolls (Oilfinger), Jack! choice.
	function startMission(ch, opts, rng) {
		opts = opts || {};
		var events = [];
		ch.hunt = R.newHunt();
		ch.hunt.started = true;
		ch.hunt.bursts = burstsMax(ch);
		ch.agendaAbilities.forEach(function (ref) {
			var ab = R.agendaAbility(ref);
			if (ab && ab.missionRoll) {
				var r = rollExpr(ab.missionRoll.dice, ab.missionRoll.plus, rng);
				if (ab.missionRoll.stat === "kitPoints") ch.hunt.kpBonus += r.total;
				log(ch, events, ab.name + ": rolled " + r.rolls.join("+") + "+" + ab.missionRoll.plus + " = +" + r.total + " KP this mission.");
			}
		});
		if (opts.jackSkill && hasAgendaAbility(ch, "jack") && ch.skills[opts.jackSkill] === 0) {
			ch.hunt.jackSkill = opts.jackSkill;
			log(ch, events, "Jack!: " + opts.jackSkill + " counts as 1 this mission.");
		}
		log(ch, events, "Deployed on a new hunt with " + ch.hunt.bursts + " psyche bursts and " + kpLeft(ch) + " KP.");
		return { events: events };
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

	// opts: { nonlethal, ironSoul }. Returns { death } when the hit kills.
	function takeStress(ch, amount, opts, rng) {
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
		h.stress += amount;
		log(ch, events, "Took " + amount + " stress.");
		while (h.stress >= (max = R.derived(ch).maxStress)) {
			if (opts.ironSoul && !h.ironSoulUsed && hasPassive(ch, "iron-soul")) {
				h.ironSoulUsed = true;
				var roll = R.d6(rng);
				if (roll >= 4) {
					h.stress = max - 1;
					log(ch, events, "Iron Soul: rolled " + roll + ". Held at " + h.stress + " stress, excess ignored.");
					break;
				}
				log(ch, events, "Iron Soul: rolled " + roll + ". It fails.");
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

	// Spend one burst, or take 1d3 sin instead. Returns { ok, sinGained }.
	function spendBurst(ch, useSin, rng, why) {
		var events = [];
		var h = ch.hunt;
		var label = why ? " (" + why + ")" : "";
		if (useSin) {
			var gain = R.d3(rng);
			ch.sin += gain;
			log(ch, events, "Took " + gain + " sin instead of a psyche burst" + label + ". Sin " + ch.sin + ".");
			return { events: events, ok: true, sinGained: gain };
		}
		if (h.bursts <= 0) return { events: events, ok: false };
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

	// Uses a consumable from the kit: pays its KP, applies its effect, uses one up.
	function useConsumable(ch, itemId, rng) {
		var events = [];
		var item = R.kitItem(itemId);
		var owned = ch.purchases.filter(function (p) { return p.item === itemId; })[0];
		if (!item || !owned || owned.count <= 0) return { events: events, ok: false };
		if (kpLeft(ch) < item.kp) return { events: events, ok: false, reason: "Not enough KP." };
		ch.hunt.kpSpent += item.kp;
		owned.count -= 1;
		if (owned.count <= 0) ch.purchases.splice(ch.purchases.indexOf(owned), 1);
		log(ch, events, "Used " + item.name + " (" + item.kp + " KP).");
		if (item.use && item.use.healStress) {
			var r = rollExpr(item.use.healStress.dice, item.use.healStress.plus, rng);
			healStress(ch, r.total).events.forEach(function (e) { events.push(e); });
			log(ch, events, item.name + " rolled " + r.rolls.join("+") + "+" + item.use.healStress.plus + " = " + r.total + ".");
		}
		return { events: events, ok: true };
	}

	// Rolls

	// opts: { skill (id or "psyche"), setup, ability, circumstance, burst, burstSin,
	// agony, hard, risky }. Spends what it needs to and records the roll.
	function roll(ch, opts, rng) {
		var events = [];
		var h = ch.hunt;
		var d = R.derived(ch);
		var base = opts.skill === "psyche" ? d.psyche : d.skillDice[opts.skill];
		var skillName = opts.skill === "psyche" ? "PSYCHE" : core.skills.filter(function (s) { return s.id === opts.skill; })[0].name;
		var bonus = (opts.setup ? 1 : 0) + (opts.ability || 0) + (opts.circumstance || 0);
		if (opts.burst) {
			var b = spendBurst(ch, !!opts.burstSin, rng, "for +1D");
			if (!b.ok) return { events: events, ok: false, reason: "No psyche bursts left. Take 1d3 sin instead?" };
			b.events.forEach(function (e) { events.push(e); });
			bonus += 1;
		}
		var agony = 0;
		if (opts.agony) {
			if (h.divineAgonyUsed || h.pathos <= 0) return { events: events, ok: false, reason: "Divine Agony isn't available." };
			agony = h.pathos;
			h.pathos = 0;
			h.divineAgonyUsed = true;
			log(ch, events, "Divine Agony: burned " + agony + " pathos for +" + agony + "D.");
		}
		var result = R.actionRoll({ skill: base, bonus: bonus, agony: agony, hard: !!opts.hard }, rng);
		result.skillName = skillName;
		result.risk = opts.risky ? R.d6(rng) : null;
		result.riskOutcome = result.risk ? R.riskOutcome(result.risk) : null;
		result.bonusAsked = bonus;
		result.t = Date.now();
		var text = skillName + " " + result.pool + "D" + (result.hard ? " hard" : "") + ": [" + result.dice.join(" ") + "]" +
			(result.zeroPool ? " keep lowest" : "") + " = " + result.successes + " success" + (result.successes === 1 ? "" : "es") +
			(result.risk ? ", risk die " + result.risk + " (" + result.riskOutcome.label + ")" : "");
		log(ch, events, text);
		if (!result.success) gainPathos(ch, events, "no successes");
		if (result.risk === 1 && h.hooks.length) log(ch, events, "Risk die 1: slash a hook.");
		h.rolls.unshift(result);
		if (h.rolls.length > 8) h.rolls.length = 8;
		return { events: events, ok: true, result: result };
	}

	// Rest

	// Rolls the resting dice. Assign each with assignRest.
	function rest(ch, rng) {
		var events = [];
		var h = ch.hunt;
		var dice = R.rollDice(R.derived(ch).restDice, 3, rng);
		h.restDice = dice.map(function (v) { return { value: v, used: false }; });
		h.rests += 1;
		h.ironSoulUsed = false;
		log(ch, events, "Rested: rolled " + dice.join(" and ") + " on the resting dice. Pressure +1 (tell the Admin).");
		return { events: events, dice: dice };
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

	// choice: "giveUp" or "resist".
	function resolveOverflow(ch, choice, rng) {
		var events = [];
		if (choice === "giveUp") {
			ch.dead = { cause: "Gave in to sin overflow and became a sin", t: Date.now() };
			ch.hunt.pending = null;
			log(ch, events, "Gave up. The exorcist becomes a sin.");
			return { events: events };
		}
		var r = R.resistOverflow(ch, rng);
		log(ch, events, "Resistance check: " + (r.roll === null ? "" : "rolled " + r.roll + " + " + ch.sinMarks.length + " marks = " + r.total + ". ") + r.reason);
		if (!r.pass) {
			ch.dead = { cause: "Lost control in sin overflow and became a sin", t: Date.now() };
			ch.hunt.pending = null;
			return { events: events, pass: false };
		}
		ch.sin = 0;
		ch.sinBoxesCrossed += 2;
		ch.hunt.pending = { type: "sinMark" };
		log(ch, events, "Kept control. Sin cleared, two sin boxes crossed out. A sin mark manifests.");
		return { events: events, pass: true };
	}

	function rollNewAbility(owned, rng) {
		var have = owned.abilities.map(function (a) { return a.roll; });
		if (have.length >= 6) return null;
		var face;
		do { face = R.d6(rng); } while (have.indexOf(face) >= 0);
		return face;
	}

	// Adds a mark at a location (new) or evolves it (owned). Returns the ability gained.
	function addSinMark(ch, markId, rng, events) {
		events = events || [];
		var m = R.sinMark(markId);
		var owned = ch.sinMarks.filter(function (x) { return x.mark === markId; })[0];
		var isNew = !owned;
		if (isNew) { owned = { mark: markId, abilities: [] }; ch.sinMarks.push(owned); }
		var face = rollNewAbility(owned, rng);
		if (face === null) {
			log(ch, events, m.name + " has every ability already.");
			return { events: events, ability: null };
		}
		var ab = R.sinMarkAbility(markId, face);
		var entry = { roll: face };
		if (ab.skillBonus) entry.skill = ab.skillBonus.choose[0];
		owned.abilities.push(entry);
		log(ch, events, (isNew ? "Sin mark: " : "Sin mark evolves: ") + m.name + ", ability " + face + ".");
		return { events: events, mark: markId, ability: face, choose: ab.skillBonus ? ab.skillBonus.choose : null };
	}

	// Rolls the location (a 6 means the player chooses) after a resisted overflow.
	function rollSinMark(ch, rng, chosenMark) {
		var events = [];
		var markId = chosenMark;
		if (!markId) {
			var loc = R.rollSinMarkLocation(rng);
			log(ch, events, "Sin mark location roll: " + loc.face + (loc.choose ? " (choose)" : "") + (loc.substituted ? " (not in this build, rerolled)" : "") + ".");
			if (loc.choose) return { events: events, choose: true };
			markId = loc.mark;
		}
		var res = addSinMark(ch, markId, rng, events);
		ch.hunt.pending = null;
		res.events = events;
		return res;
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
	// newBlasphemy { blasphemy, power, replace }, evolveSinMark { mark }, scrip, skill { skill }.
	// replace is { agenda, ability } or { blasphemy, power } when at the cap.
	function spendAdvance(ch, choice, rng) {
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
			if (choice.replace) {
				ch.blasphemies.forEach(function (b) {
					if (b.id === choice.replace.blasphemy) b.powers = b.powers.filter(function (p) { return p !== choice.replace.power; });
				});
			}
			if (choice.kind === "newBlasphemy") {
				var nb = R.blasphemy(choice.blasphemy);
				if (!nb || !R.power(nb.id, choice.power)) return { events: events, ok: false, reason: "Pick a power from the new blasphemy." };
				ch.blasphemies.push({ id: nb.id, powers: [choice.power] });
				log(ch, events, "Advance: new blasphemy " + nb.name + " with " + R.power(nb.id, choice.power).name + ". Sin cap -1, XP to advance +1.");
			} else {
				ch.blasphemies.filter(function (b) { return b.id === choice.blasphemy; })[0].powers.push(choice.power);
				log(ch, events, "Advance: power " + R.power(choice.blasphemy, choice.power).name + ".");
			}
		} else if (choice.kind === "evolveSinMark") {
			var res = addSinMark(ch, choice.mark, rng, events);
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

	// Kit shop

	function canBuy(ch, itemId) {
		var item = R.kitItem(itemId);
		if (!item) return { ok: false, reason: "Unknown item." };
		if (item.minCat && R.derived(ch).cat < item.minCat) return { ok: false, reason: "CAT " + item.minCat + "+ only." };
		var consumable = item.tags.indexOf("Consumable") >= 0;
		if (!consumable && ch.purchases.some(function (p) { return p.item === itemId; })) return { ok: false, reason: "Owned." };
		if (ch.scrip < item.scrip) return { ok: false, reason: "Need " + item.scrip + " scrip." };
		return { ok: true };
	}

	function buy(ch, itemId) {
		var events = [];
		var check = canBuy(ch, itemId);
		if (!check.ok) return { events: events, ok: false, reason: check.reason };
		var item = R.kitItem(itemId);
		ch.scrip -= item.scrip;
		var owned = ch.purchases.filter(function (p) { return p.item === itemId; })[0];
		if (owned) owned.count += 1; else ch.purchases.push({ item: itemId, count: 1 });
		log(ch, events, "Bought " + item.name + " for " + item.scrip + " scrip. " + ch.scrip + " left.");
		return { events: events, ok: true };
	}

	function upgradeWeapons(ch) {
		var events = [];
		var u = core.weaponUpgrade;
		if (ch.weaponCat >= u.maxCat) return { events: events, ok: false, reason: "Already CAT " + u.maxCat + "." };
		if (ch.scrip < u.cost) return { events: events, ok: false, reason: "Need " + u.cost + " scrip." };
		ch.scrip -= u.cost;
		ch.weaponCat += 1;
		log(ch, events, "Service weapons upgraded to CAT " + ch.weaponCat + " for " + u.cost + " scrip.");
		return { events: events, ok: true };
	}

	CAIN.hunt = {
		normalize: normalize,
		kpLeft: kpLeft,
		burstsMax: burstsMax,
		atBrink: atBrink,
		hasAgendaAbility: hasAgendaAbility,
		hasPassive: hasPassive,
		startMission: startMission,
		endMission: endMission,
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
		roll: roll,
		rest: rest,
		assignRest: assignRest,
		overflowDue: overflowDue,
		resolveOverflow: resolveOverflow,
		rollSinMark: rollSinMark,
		setMarkSkill: setMarkSkill,
		endSession: endSession,
		spendAdvance: spendAdvance,
		canBuy: canBuy,
		buy: buy,
		upgradeWeapons: upgradeWeapons
	};
})();
