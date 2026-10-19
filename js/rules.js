// Rules engine: derived stats, CAT text, validation, advances and dice. No DOM access.
window.CAIN = window.CAIN || {};

(function () {
	var core = CAIN.core;

	// Lookups

	function byId(list, id) {
		for (var i = 0; i < list.length; i++) {
			if (list[i].id === id) return list[i];
		}
		return null;
	}

	function agenda(id) { return byId(CAIN.agendas, id); }
	function blasphemy(id) { return byId(CAIN.blasphemies, id); }
	function sinMark(id) { return byId(CAIN.sinMarks, id); }
	function kitItem(id) { return byId(CAIN.kit, id); }

	function agendaAbility(ref) {
		var a = agenda(ref.agenda);
		return a ? byId(a.abilities, ref.ability) : null;
	}

	function power(blasphemyId, powerId) {
		var b = blasphemy(blasphemyId);
		return b ? byId(b.powers, powerId) : null;
	}

	function sinMarkAbility(markId, roll) {
		var m = sinMark(markId);
		if (!m) return null;
		for (var i = 0; i < m.abilities.length; i++) {
			if (m.abilities[i].roll === roll) return m.abilities[i];
		}
		return null;
	}

	// A blank character, before registration fills it in.
	function newCharacter() {
		var skills = {};
		core.skills.forEach(function (s) { skills[s.id] = core.creation.start; });
		var questions = {};
		core.questions.forEach(function (q) { questions[q.id] = ""; });
		return {
			schema: 1,
			id: "c" + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36),
			name: "",
			xid: "",
			looks: { sex: "", height: "", weight: "", hair: "", eyes: "" },
			questions: questions,
			weaponLook: "",
			kitNotes: "",
			notes: "",
			skills: skills,
			skillImprovements: 0,
			agenda: null,
			agendaAbilities: [],
			boldItems: [],
			blasphemies: [],
			sinMarks: [],
			purchases: [],
			weaponCat: 0,
			missionsSurvived: 0,
			xp: 0,
			advances: 0,
			scrip: 0,
			sin: 0,
			sinBoxesCrossed: 0,
			settings: Object.assign({}, core.defaultSettings),
			hunt: newHunt(),
			log: []
		};
	}

	// Per-mission state. Reset at the start of every hunt.
	function newHunt() {
		return {
			stress: 0,
			injuries: 0,
			hooks: [],
			afflictions: [],
			bursts: null,
			kpSpent: 0,
			kpBonus: 0,
			pathos: 0,
			divineAgonyUsed: false,
			jackSkill: null,
			notes: "",
			started: false,
			ironSoulUsed: false,
			restDice: null,
			rests: 0,
			rolls: [],
			pulled: [],
			pending: null
		};
	}

	// CAT and PSYCHE

	function catFromMissions(missions) {
		var cat = 0;
		for (var i = 0; i < core.catThresholds.length; i++) {
			if (missions >= core.catThresholds[i]) cat = i + 1;
		}
		return cat;
	}

	function psycheFromCat(cat) {
		return Math.ceil(cat / 2);
	}

	// Missions survived needed for the next CAT, or null at CAT 5.
	function nextCatAt(missions) {
		var cat = catFromMissions(missions);
		return cat < core.catThresholds.length ? core.catThresholds[cat] : null;
	}

	// Modifiers

	// Everything the character owns that can carry modifiers or flags.
	function modifierSources(ch) {
		var sources = [];
		ch.agendaAbilities.forEach(function (ref) {
			var ab = agendaAbility(ref);
			if (ab) sources.push({ name: ab.name, entry: ab, count: 1 });
		});
		ch.blasphemies.forEach(function (owned) {
			var b = blasphemy(owned.id);
			if (!b) return;
			sources.push({ name: b.passive.name, entry: b.passive, count: 1 });
			owned.powers.forEach(function (pid) {
				var p = byId(b.powers, pid);
				if (p) sources.push({ name: p.name, entry: p, count: 1 });
			});
		});
		ch.purchases.forEach(function (pur) {
			var item = kitItem(pur.item);
			// Consumables never carry modifiers; permanent items are bought once.
			if (item) sources.push({ name: item.name, entry: item, count: 1 });
		});
		ch.sinMarks.forEach(function (owned) {
			owned.abilities.forEach(function (a) {
				var ab = sinMarkAbility(owned.mark, a.roll);
				if (ab) sources.push({ name: sinMark(owned.mark).name + " " + a.roll, entry: ab, count: 1 });
			});
		});
		return sources;
	}

	function modifierTotal(ch, stat) {
		var total = 0;
		modifierSources(ch).forEach(function (src) {
			(src.entry.modifiers || []).forEach(function (m) {
				if (m.stat === stat) total += m.add * src.count;
			});
		});
		return total;
	}

	function hasFlag(ch, flag) {
		return modifierSources(ch).some(function (src) {
			return (src.entry.flags || []).indexOf(flag) >= 0;
		});
	}

	function extraBlasphemies(ch) {
		return Math.max(0, ch.blasphemies.length - 1);
	}

	// Max stress before injuries.
	function stressCapacity(ch) {
		return core.base.maxStress + modifierTotal(ch, "maxStress");
	}

	// Max stress right now, after injuries.
	function maxStress(ch) {
		var lost = ch.hunt.injuries;
		if (lost > 0 && hasFlag(ch, "firstInjuryKeepsStress")) lost -= 1;
		return Math.max(0, stressCapacity(ch) - lost);
	}

	function sinCap(ch) {
		return core.base.sinCap + ch.settings.sinCapBonus + modifierTotal(ch, "sinCap")
			- extraBlasphemies(ch) - ch.sinBoxesCrossed;
	}

	function kitPoints(ch) {
		return core.base.kitPoints + modifierTotal(ch, "kitPoints") + ch.hunt.kpBonus;
	}

	// Skill dice including sin mark bonuses and Jack!, at most 4.
	function skillDice(ch, skillId) {
		var dice = ch.skills[skillId];
		if (ch.hunt.jackSkill === skillId && dice === 0) dice = 1;
		ch.sinMarks.forEach(function (owned) {
			owned.abilities.forEach(function (a) {
				var ab = sinMarkAbility(owned.mark, a.roll);
				if (ab && ab.skillBonus && a.skill === skillId) dice += ab.skillBonus.add;
			});
		});
		return Math.min(dice, core.skillMax + 1);
	}

	function derived(ch) {
		var cat = catFromMissions(ch.missionsSurvived);
		var dice = {};
		core.skills.forEach(function (s) { dice[s.id] = skillDice(ch, s.id); });
		return {
			cat: cat,
			psyche: psycheFromCat(cat),
			nextCatAt: nextCatAt(ch.missionsSurvived),
			stressCapacity: stressCapacity(ch),
			maxStress: maxStress(ch),
			maxInjuries: core.base.maxInjuries + modifierTotal(ch, "maxInjuries"),
			kitPoints: kitPoints(ch),
			sinCap: sinCap(ch),
			xpToAdvance: core.base.xpToAdvance + modifierTotal(ch, "xpToAdvance") + extraBlasphemies(ch),
			psycheBursts: ch.settings.psycheBursts + modifierTotal(ch, "psycheBursts"),
			restDice: core.base.restDice + modifierTotal(ch, "restDice"),
			skillDice: dice
		};
	}

	// CAT-aware text

	// Value of a token expression like "cat", "cat+2", "2+cat", "halfcat".
	function tokenValue(expr, cat) {
		var e = expr.replace(/\s+/g, "").toLowerCase();
		if (e === "halfcat") return Math.ceil(cat / 2);
		var m = /^(?:(\d+)\+)?cat(?:([+-])(\d+))?$/.exec(e);
		if (!m) return null;
		var v = cat + (m[1] ? parseInt(m[1], 10) : 0);
		if (m[2]) v += (m[2] === "+" ? 1 : -1) * parseInt(m[3], 10);
		return v;
	}

	// Splits text into plain strings and resolved tokens for the UI to style.
	function resolveSegments(text, cat) {
		var out = [];
		var re = /\{([^}:]+)(?::([a-z]+))?\}/g;
		var last = 0;
		var m;
		while ((m = re.exec(text)) !== null) {
			if (m.index > last) out.push({ text: text.slice(last, m.index) });
			var value = tokenValue(m[1], cat);
			if (value === null) {
				out.push({ text: m[0] });
			} else if (m[2]) {
				var row = core.catTable[m[2]];
				var level = Math.max(0, Math.min(core.catMax, value));
				out.push({ token: m[1], dim: m[2], level: level, text: row ? row[level] : m[0] });
			} else {
				out.push({ token: m[1], level: value, text: String(Math.max(0, value)) });
			}
			last = re.lastIndex;
		}
		if (last < text.length) out.push({ text: text.slice(last) });
		return out;
	}

	function resolveText(text, cat) {
		return resolveSegments(text, cat).map(function (s) { return s.text; }).join("");
	}

	// Validation

	function countBy(values, value) {
		return values.filter(function (v) { return v === value; }).length;
	}

	function skillValues(ch) {
		return core.skills.map(function (s) { return ch.skills[s.id]; });
	}

	function agendaAllowed(ch, a) {
		if (!a.requires) return { ok: true };
		if (a.requires.sinMarks && ch.sinMarks.length < a.requires.sinMarks) {
			return { ok: false, reason: "Requires a sin mark." };
		}
		return { ok: true };
	}

	// Problems with a newly created character, as { step, message }.
	function validateCreation(ch) {
		var problems = [];
		var values = skillValues(ch);
		var twos = countBy(values, 2);
		var zeros = countBy(values, 0);
		var ones = countBy(values, 1);
		if (twos !== core.creation.raise || zeros !== core.creation.lower || ones !== values.length - core.creation.raise - core.creation.lower) {
			problems.push({ step: "skills", message: "Raise exactly " + core.creation.raise + " skills to 2 and lower exactly " + core.creation.lower + " to 0." });
		}
		var a = ch.agenda ? agenda(ch.agenda) : null;
		if (!a) {
			problems.push({ step: "agenda", message: "Pick an agenda." });
		} else {
			var allowed = agendaAllowed(ch, a);
			if (!allowed.ok) problems.push({ step: "agenda", message: a.name + ": " + allowed.reason });
			var own = ch.agendaAbilities.filter(function (r) { return r.agenda === a.id && agendaAbility(r); });
			if (own.length !== 1 || ch.agendaAbilities.length !== 1) {
				problems.push({ step: "agenda", message: "Pick exactly 1 ability from your agenda." });
			}
		}
		if (ch.blasphemies.length !== 1 || !blasphemy(ch.blasphemies[0].id)) {
			problems.push({ step: "blasphemy", message: "Pick a blasphemy." });
		} else {
			var powers = ch.blasphemies[0].powers.filter(function (p) { return power(ch.blasphemies[0].id, p); });
			if (powers.length !== 2 || ch.blasphemies[0].powers.length !== 2) {
				problems.push({ step: "blasphemy", message: "Pick exactly 2 powers from your blasphemy." });
			}
		}
		if (!ch.name.trim()) problems.push({ step: "concept", message: "Give your exorcist a name." });
		return problems;
	}

	function totalPowers(ch) {
		return ch.blasphemies.reduce(function (n, b) { return n + b.powers.length; }, 0);
	}

	// Problems with an existing character at any point in its career.
	function validateCharacter(ch) {
		var problems = [];
		var values = skillValues(ch);
		var creationSum = values.length - core.creation.lower + core.creation.raise;
		values.forEach(function (v) {
			if (v < 0 || v > core.skillMax) problems.push({ step: "skills", message: "Skills go from 0 to " + core.skillMax + "." });
		});
		if (countBy(values, core.skillMax) > core.skillsAtMaxLimit) {
			problems.push({ step: "skills", message: "Only " + core.skillsAtMaxLimit + " skills can be at " + core.skillMax + "." });
		}
		if (ch.skillImprovements > core.skillImprovementLimit) {
			problems.push({ step: "skills", message: "Skills can be improved " + core.skillImprovementLimit + " times in total." });
		}
		var sum = values.reduce(function (a, b) { return a + b; }, 0);
		if (sum !== creationSum + ch.skillImprovements) {
			problems.push({ step: "skills", message: "Skill total doesn't match creation plus improvements." });
		}
		if (ch.agendaAbilities.length > 5) problems.push({ step: "agenda", message: "At most 5 agenda abilities." });
		if (totalPowers(ch) > 5) problems.push({ step: "blasphemy", message: "At most 5 blasphemy powers in total." });
		if (ch.weaponCat > core.weaponUpgrade.maxCat) problems.push({ step: "kit", message: "Service weapons max out at CAT " + core.weaponUpgrade.maxCat + "." });
		return problems;
	}

	// Advances

	// Every way the character could spend an advance right now.
	function legalAdvances(ch) {
		var options = [];
		var a = ch.agenda ? agenda(ch.agenda) : null;
		if (a) {
			var openAbilities = a.abilities.filter(function (ab) {
				return !ch.agendaAbilities.some(function (r) { return r.agenda === a.id && r.ability === ab.id; });
			});
			if (openAbilities.length) {
				options.push({ kind: "agendaAbility", choices: openAbilities.map(function (ab) { return ab.id; }), mustReplace: ch.agendaAbilities.length >= 5 });
			}
		}
		var powersFull = totalPowers(ch) >= 5;
		ch.blasphemies.forEach(function (owned) {
			var b = blasphemy(owned.id);
			if (!b) return;
			var open = b.powers.filter(function (p) { return owned.powers.indexOf(p.id) < 0; });
			if (open.length) {
				options.push({ kind: "blasphemyPower", blasphemy: b.id, choices: open.map(function (p) { return p.id; }), mustReplace: powersFull });
			}
		});
		var newOnes = CAIN.blasphemies.filter(function (b) {
			return !ch.blasphemies.some(function (o) { return o.id === b.id; });
		});
		if (newOnes.length) {
			options.push({ kind: "newBlasphemy", choices: newOnes.map(function (b) { return b.id; }), mustReplace: powersFull });
		}
		var evolvable = ch.sinMarks.filter(function (owned) {
			var m = sinMark(owned.mark);
			return m && owned.abilities.length < m.abilities.length;
		});
		if (evolvable.length) {
			options.push({ kind: "evolveSinMark", choices: evolvable.map(function (o) { return o.mark; }) });
		}
		options.push({ kind: "scrip", amount: core.advanceScrip });
		if (ch.skillImprovements < core.skillImprovementLimit) {
			var atMax = countBy(skillValues(ch), core.skillMax);
			var raisable = core.skills.filter(function (s) {
				var v = ch.skills[s.id];
				if (v >= core.skillMax) return false;
				return v + 1 < core.skillMax || atMax < core.skillsAtMaxLimit;
			});
			if (raisable.length) options.push({ kind: "skill", choices: raisable.map(function (s) { return s.id; }) });
		}
		return options;
	}

	// Dice. The site never rolls game dice: players roll at the table where the
	// Admin can see, and enter the results. These helpers only do the arithmetic.

	// Seeded generator (mulberry32), only for Quick exorcist and the tests.
	function makeRng(seed) {
		var t = seed >>> 0;
		return function () {
			t += 0x6D2B79F5;
			var r = Math.imul(t ^ (t >>> 15), 1 | t);
			r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
			return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
		};
	}

	// How many dice to roll. opts: { skill, bonus, agony, hard }. Bonus dice cap
	// at +3, Divine Agony dice ignore the cap, a pool of 0 means roll 2 keep lowest.
	function dicePool(opts) {
		var bonus = Math.min(opts.bonus || 0, core.base.bonusDiceCap);
		var pool = Math.max(0, (opts.skill || 0) + bonus + (opts.agony || 0));
		return {
			pool: pool,
			bonusUsed: bonus,
			bonusCapped: (opts.bonus || 0) > core.base.bonusDiceCap,
			zeroPool: pool === 0,
			hard: !!opts.hard,
			target: opts.hard ? 6 : 4,
			maxSuccesses: pool === 0 ? 1 : pool
		};
	}

	// Sin overflow resistance check (book 1.4.5 wording) with the player's d6.
	// Returns needsRoll when a die is required and none was given.
	function resistOverflow(ch, roll) {
		var marks = ch.sinMarks.length;
		if (sinCap(ch) <= 0) return { roll: null, total: null, pass: false, reason: "No sin boxes left." };
		if (marks === 0) return { roll: null, total: null, pass: true, reason: "No sin marks: automatic pass." };
		if (!(roll >= 1 && roll <= 6)) return { needsRoll: true };
		var total = roll + marks;
		if (roll === 1) return { roll: roll, total: total, pass: true, reason: "A 1 always passes." };
		return { roll: roll, total: total, pass: total <= 6, reason: total <= 6 ? "6 or less: keep control." : "7 or more: give up." };
	}

	// Sin mark location for a d6 face: { choose } on a 6, { mark } when loaded,
	// { missing } when that location isn't in this build.
	function markForFace(face) {
		if (face === CAIN.sinMarkChooseFace) return { face: face, choose: true };
		var found = CAIN.sinMarks.filter(function (m) { return m.roll === face; })[0];
		return found ? { face: face, mark: found.id } : { face: face, missing: true, name: core.sinMarkLocations[face - 1] };
	}

	function halveSin(sin) {
		return Math.ceil(sin / 2);
	}

	// Creation

	// How far the creation skill spread has got: skills at 2, at 0, at 3.
	function creationCounts(ch) {
		var values = skillValues(ch);
		return { raised: countBy(values, 2), lowered: countBy(values, 0), maxed: countBy(values, core.skillMax) };
	}

	function pick(list, rng) {
		return list[Math.floor((rng || Math.random)() * list.length)];
	}

	function shuffled(list, rng) {
		var out = list.slice();
		for (var i = out.length - 1; i > 0; i--) {
			var j = Math.floor((rng || Math.random)() * (i + 1));
			var t = out[i]; out[i] = out[j]; out[j] = t;
		}
		return out;
	}

	// Exorcist internal id, e.g. "KT-4471".
	function generateXid(rng) {
		var letters = "ABCDEFGHJKLMNPRSTVWXZ";
		var num = String(Math.floor((rng || Math.random)() * 10000));
		while (num.length < 4) num = "0" + num;
		return pick(letters, rng) + pick(letters, rng) + "-" + num;
	}

	// A random legal new exorcist (Quick Exorcist). Flavour comes from CAIN.prompts when loaded.
	function randomCharacter(rng) {
		var ch = newCharacter();
		var ids = shuffled(core.skills.map(function (s) { return s.id; }), rng);
		ids.slice(0, core.creation.raise).forEach(function (id) { ch.skills[id] = 2; });
		ids.slice(core.creation.raise, core.creation.raise + core.creation.lower).forEach(function (id) { ch.skills[id] = 0; });
		var agendas = CAIN.agendas.filter(function (a) { return agendaAllowed(ch, a).ok; });
		var a = pick(agendas, rng);
		ch.agenda = a.id;
		ch.agendaAbilities = [{ agenda: a.id, ability: pick(a.abilities, rng).id }];
		var b = pick(CAIN.blasphemies, rng);
		ch.blasphemies = [{ id: b.id, powers: shuffled(b.powers, rng).slice(0, 2).map(function (p) { return p.id; }) }];
		ch.xid = generateXid(rng);
		var p = CAIN.prompts;
		if (p) {
			ch.name = pick(p.names, rng);
			Object.keys(ch.looks).forEach(function (k) { if (p.looks[k]) ch.looks[k] = pick(p.looks[k], rng); });
			Object.keys(ch.questions).forEach(function (k) { if (p.questions[k]) ch.questions[k] = pick(p.questions[k], rng); });
			ch.weaponLook = pick(p.weapons, rng);
		} else {
			ch.name = "Exorcist " + ch.xid;
		}
		return ch;
	}

	CAIN.rules = {
		agenda: agenda,
		blasphemy: blasphemy,
		sinMark: sinMark,
		kitItem: kitItem,
		agendaAbility: agendaAbility,
		power: power,
		sinMarkAbility: sinMarkAbility,
		newCharacter: newCharacter,
		newHunt: newHunt,
		catFromMissions: catFromMissions,
		psycheFromCat: psycheFromCat,
		nextCatAt: nextCatAt,
		modifierTotal: modifierTotal,
		hasFlag: hasFlag,
		derived: derived,
		skillDice: skillDice,
		tokenValue: tokenValue,
		resolveSegments: resolveSegments,
		resolveText: resolveText,
		agendaAllowed: agendaAllowed,
		validateCreation: validateCreation,
		validateCharacter: validateCharacter,
		legalAdvances: legalAdvances,
		makeRng: makeRng,
		dicePool: dicePool,
		resistOverflow: resistOverflow,
		markForFace: markForFace,
		halveSin: halveSin,
		creationCounts: creationCounts,
		pick: pick,
		shuffled: shuffled,
		generateXid: generateXid,
		randomCharacter: randomCharacter
	};
})();
