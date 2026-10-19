// Play mode (during a hunt) and Between missions (sessions, advances, mission end, kit shop).
// Dice are rolled at the table where the Admin can see them; players enter the results here.
// Every tracked number also has a - / + stepper so the sheet can always be put right by hand.
window.CAIN = window.CAIN || {};

(function () {
	var R = CAIN.rules;
	var H = CAIN.hunt;
	var core = CAIN.core;
	var h = CAIN.h;
	var term = CAIN.term;
	var bubbles = CAIN.bubbles;
	var stepper = CAIN.stepper;

	// Per-character UI state that doesn't need saving: pool toggles, pending die entries.
	var ui = {};
	function uiFor(ch) {
		if (!ui[ch.id]) {
			ui[ch.id] = {
				pool: { skill: "force", setup: false, ability: 0, circumstance: 0, burst: false, burstSin: false, burstSinRoll: 2, agony: false, hard: false, successes: 0 },
				stress: { amount: 1, nonlethal: false, ironAsk: false, ironRoll: 4 },
				sinRoll: 2,
				useItem: null,
				restRolls: null,
				deploy: { jack: "", rolls: {} },
				resistRoll: 3,
				mark: { face: 1, chosen: "", ability: 1 },
				markSkill: null,
				advance: null,
				mission: { outcome: "execute", bodies: 0, died: false },
				session: {},
				hookName: "",
				affliction: ""
			};
		}
		return ui[ch.id];
	}

	function btn(label, onclick, opts) {
		opts = opts || {};
		return h("button", { class: "btn" + (opts.ghost ? " ghost" : "") + (opts.small ? " small" : "") + (opts.danger ? " danger" : ""), type: "button", disabled: !!opts.disabled, title: opts.title || null, onclick: onclick }, label);
	}

	function chip(label, pressed, onclick, opts) {
		opts = opts || {};
		return h("button", { class: "chip", type: "button", "aria-pressed": String(!!pressed), disabled: !!opts.disabled, title: opts.title || null, onclick: onclick }, label);
	}

	function card(cls, title, label) {
		var el = h("section", { class: "card play-" + cls },
			h("div", { class: "card-head" }, h("h2", { class: title.goth ? "goth" : null }, title.text || title), label ? h("span", { class: "label" }, label) : null));
		for (var i = 3; i < arguments.length; i++) CAIN.append(el, arguments[i]);
		return el;
	}

	function row() {
		var el = h("div", { class: "subrow" });
		for (var i = 0; i < arguments.length; i++) CAIN.append(el, arguments[i]);
		return el;
	}

	// "d6 rolled" entry, a stepper limited to the die's faces.
	function dieEntry(label, sides, value, onSet) {
		return stepper(label, value, 1, sides, onSet, { small: true, title: "Enter the die you rolled at the table" });
	}

	function logList(ch, n) {
		if (!ch.log.length) return h("p", { class: "note" }, "Nothing yet.");
		return h("ol", { class: "log-list" }, ch.log.slice(0, n).map(function (e) {
			var d = new Date(e.t);
			var time = ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
			return h("li", null, h("span", { class: "log-time" }, time), h("span", null, e.text));
		}));
	}

	// Manual change, logged so the Admin can follow what was adjusted by hand.
	function manual(ch, ctx, label, apply) {
		return function (v) {
			var before = apply(v);
			ctx.act(H.note(ch, label + ": " + before + " -> " + v + " (set by hand)."));
		};
	}

	function manualToggle(ch, ctx, label, get, set) {
		return function () {
			set(!get());
			ctx.act(H.note(ch, label + " marked " + (get() ? "used" : "ready") + " (set by hand)."));
		};
	}

	// Alerts: instant death, sin overflow, a sin mark to roll, a mark skill to pick.

	function alerts(ch, ctx) {
		var out = [];
		var p = ch.hunt.pending;
		var st = uiFor(ch);
		if (p && p.type === "instantDeath") {
			out.push(h("section", { class: "card alert" },
				h("div", { class: "alert-title" }, "Instant death"),
				h("p", null, p.reason + " Describe how it happens, or defy your fate: suffer sin overflow instead and drop to one injury below max."),
				h("div", { class: "btn-row" },
					btn("Defy fate", function () { ctx.act(H.resolveDeath(ch, "defy")); }),
					btn("Die", function () { ctx.act(H.resolveDeath(ch, "die")); }, { ghost: true, danger: true }))));
			return out;
		}
		if (H.overflowDue(ch)) {
			var marks = ch.sinMarks.length;
			out.push(h("section", { class: "card alert" },
				h("div", { class: "alert-title" }, "!! Sin overflow !!"),
				h("p", null, "At the end of the scene your power runs wild. Give up and become a sin, or resist. " +
					(marks ? "Roll 1d6 at the table and add your " + marks + " sin mark" + (marks > 1 ? "s" : "") + ": 6 or less keeps control, and a natural 1 always does." : "With no sin marks you pass automatically.") +
					" On a pass: clear all sin, cross out two sin boxes, gain a sin mark."),
				marks ? row(dieEntry("Your d6", 6, st.resistRoll, function (v) { st.resistRoll = v; ctx.save(true); }),
					h("span", { class: "note" }, "Total " + (st.resistRoll + marks) + (st.resistRoll === 1 ? " (natural 1: pass)" : st.resistRoll + marks <= 6 ? ": pass" : ": fail"))) : null,
				h("div", { class: "btn-row" },
					btn("Resist", function () { ctx.act(H.resolveOverflow(ch, "resist", marks ? st.resistRoll : undefined)); }),
					btn("Give up", function () { ctx.act(H.resolveOverflow(ch, "giveUp")); }, { ghost: true, danger: true }))));
			return out;
		}
		if (p && p.type === "sinMark") out.push(sinMarkCard(ch, ctx, st, false));
		if (st.markSkill) out.push(markSkillChooser(ch, ctx, st));
		return out;
	}

	// Location d6 (a 6 lets you choose), then the ability d6. Duplicates: roll again.
	// For an advance, the mark is already chosen and only the ability die is entered.
	function sinMarkCard(ch, ctx, st, fixedMark, onDone) {
		var m = st.mark;
		var loc = fixedMark ? { mark: fixedMark } : R.markForFace(m.face);
		var markId = fixedMark || (loc.choose ? m.chosen : loc.mark);
		var owned = markId ? H.ownedMarkFaces(ch, markId) : [];
		var dup = owned.indexOf(m.ability) >= 0;
		var ability = markId ? R.sinMarkAbility(markId, m.ability) : null;
		var parts = [];
		if (!fixedMark) {
			parts.push(row(dieEntry("Location d6", 6, m.face, function (v) { m.face = v; m.chosen = ""; ctx.save(true); }),
				h("span", { class: "note" }, loc.choose ? "6: choose a location" : loc.missing ? loc.name + " isn't in this test build yet. Reroll." : R.sinMark(loc.mark).name)));
			if (loc.choose) {
				parts.push(row(CAIN.select("Location", m.chosen, CAIN.sinMarks.map(function (x) { return { value: x.id, label: x.name }; }),
					function (v) { m.chosen = v; ctx.save(true); }, { placeholder: "Choose" })));
			}
		}
		if (markId) {
			parts.push(row(dieEntry("Ability d6", 6, m.ability, function (v) { m.ability = v; ctx.save(true); }),
				h("span", { class: "note" }, dup ? "You have this one already. Roll again." : owned.length ? "Already have: " + owned.join(", ") : "")));
			if (ability && !dup) parts.push(CAIN.richText(ability.text, R.derived(ch).cat));
		}
		parts.push(h("div", { class: "btn-row" }, btn("Gain this mark", function () {
			var r = onDone ? onDone(markId, m.ability) : H.gainSinMark(ch, markId, m.ability);
			if (!r.ok) { ctx.flash([r.reason]); return; }
			if (r.choose && r.choose.length) st.markSkill = { mark: r.mark, ability: r.ability, choices: r.choose };
			st.mark = { face: 1, chosen: "", ability: 1 };
			ctx.act(r);
		}, { disabled: !markId || dup || !ability })));
		return h("section", { class: "card alert soft" },
			h("div", { class: "alert-title" }, fixedMark ? "Evolve " + R.sinMark(fixedMark).name : "A sin mark manifests"),
			h("p", { class: "note" }, "Roll at the table and enter the dice."),
			parts);
	}

	function markSkillChooser(ch, ctx, st) {
		var m = st.markSkill;
		var owned = ch.sinMarks.filter(function (x) { return x.mark === m.mark; })[0];
		var entry = owned && owned.abilities.filter(function (a) { return a.roll === m.ability; })[0];
		return h("section", { class: "card alert soft" },
			h("div", { class: "alert-title" }, "Pick the skill for your new mark"),
			row(CAIN.select(null, entry ? entry.skill : "", m.choices.map(function (s) { return { value: s, label: s }; }),
				function (v) { H.setMarkSkill(ch, m.mark, m.ability, v); ctx.save(true); }, { aria: "Skill" }),
				btn("Done", function () { st.markSkill = null; ctx.save(true); }, { small: true })));
	}

	// Play mode

	function deployCard(ch, ctx) {
		var st = uiFor(ch).deploy;
		var zeroSkills = core.skills.filter(function (s) { return ch.skills[s.id] === 0; });
		var needs = H.missionRollsNeeded(ch);
		needs.forEach(function (n) { if (!st.rolls[n.id]) st.rolls[n.id] = 2; });
		return card("deploy", "Deploy", "New hunt",
			h("p", null, "Every hunt starts fresh: no stress, injuries or hooks, " + R.derived(ch).psycheBursts + " psyche bursts and full kit points. Only sin, sin marks, your abilities, XP and scrip carry over."),
			needs.map(function (n) {
				return row(dieEntry(n.name + ": " + n.dice + " rolled", 3, st.rolls[n.id], function (v) { st.rolls[n.id] = v; ctx.save(true); }),
					h("span", { class: "note" }, "+" + (st.rolls[n.id] + n.plus) + " KP this mission"));
			}),
			H.hasAgendaAbility(ch, "jack") && zeroSkills.length ? row(CAIN.select("Jack!: a 0 skill counts as 1 this mission", st.jack,
				zeroSkills.map(function (s) { return { value: s.id, label: s.name }; }), function (v) { st.jack = v; ctx.save(true); }, { placeholder: "None" })) : null,
			h("div", { class: "btn-row" }, btn("Start the hunt", function () {
				var r = H.startMission(ch, { jackSkill: st.jack || null, missionRolls: st.rolls });
				if (!r.ok) { ctx.flash(["Enter the dice first."]); return; }
				uiFor(ch).deploy = { jack: "", rolls: {} };
				ctx.act(r);
			})));
	}

	function stressCard(ch, ctx) {
		var d = R.derived(ch);
		var hu = ch.hunt;
		var st = uiFor(ch).stress;
		var lost = d.stressCapacity - d.maxStress;
		var iron = H.hasPassive(ch, "iron-soul");
		function take(ironRoll) {
			var opts = { nonlethal: st.nonlethal };
			if (ironRoll !== undefined) opts.ironSoulRoll = ironRoll;
			var r = H.takeStress(ch, st.amount, opts);
			if (r.ask === "ironSoul") { st.ironAsk = true; ctx.save(true); return; }
			st.ironAsk = false;
			ctx.act(r);
		}
		return card("stress", { text: "Execution", goth: true }, hu.stress + " / " + d.maxStress + " stress",
			H.atBrink(ch) ? h("p", { class: "brink" }, "!! Brink of death !! Any more stress is instant death.") : null,
			h("div", { class: "big-pips" }, bubbles(hu.stress, d.stressCapacity, { shape: "box", crossed: lost, label: "Stress" })),
			st.ironAsk ? h("div", { class: "inline-ask" },
				h("p", null, h("strong", null, "This fills your talisman. "), "Use Iron Soul? Roll 1d6 at the table: on 4+ you stay at 1 under max instead of taking an injury. Then it's gone until you rest."),
				row(dieEntry("Iron Soul d6", 6, st.ironRoll, function (v) { st.ironRoll = v; ctx.save(true); })),
				h("div", { class: "btn-row" },
					btn("Use Iron Soul", function () { take(st.ironRoll); }, { small: true }),
					btn("Don't use it", function () { take(null); }, { small: true, ghost: true }),
					btn("Cancel", function () { st.ironAsk = false; ctx.save(true); }, { small: true, ghost: true }))) :
				h("div", null,
					row(stepper("Take", st.amount, 1, 20, function (v) { st.amount = v; ctx.save(true); }, { suffix: " stress" }),
						chip("Nonlethal", st.nonlethal, function () { st.nonlethal = !st.nonlethal; ctx.save(true); }, { title: "Can't fill the talisman" })),
					h("div", { class: "btn-row" }, btn("Take " + st.amount + " stress", function () { take(); }))),
			h("p", { class: "note" }, "1: pain, strain. 2-3: crippling for a human. 4+: messily fatal for a human. 7+ in one hit is instant death."),
			h("div", { class: "manual" },
				h("div", { class: "label" }, "Set by hand"),
				h("div", { class: "stepper-row" },
					stepper("Stress", hu.stress, 0, Math.max(0, d.maxStress), manual(ch, ctx, "Stress", function (v) { var b = hu.stress; hu.stress = v; return b; })),
					stepper("Injuries", hu.injuries, 0, d.maxInjuries, manual(ch, ctx, "Injuries", function (v) { var b = hu.injuries; hu.injuries = v; return b; })),
					iron ? chip("Iron Soul used", hu.ironSoulUsed, manualToggle(ch, ctx, "Iron Soul", function () { return hu.ironSoulUsed; }, function (v) { hu.ironSoulUsed = v; })) : null)));
	}

	function psycheCard(ch, ctx) {
		var d = R.derived(ch);
		var hu = ch.hunt;
		var st = uiFor(ch);
		return card("psyche", "Psyche", "PSYCHE " + d.psyche + "D  /  CAT " + d.cat,
			row(h("span", { class: "field-label" }, term("Psyche bursts", "psyche burst"), " " + hu.bursts + " / " + d.psycheBursts),
				bubbles(hu.bursts, d.psycheBursts, { label: "Psyche bursts" })),
			h("div", { class: "btn-row" },
				btn("Spend a burst", function () { var r = H.spendBurst(ch); if (!r.ok) ctx.flash([r.reason]); else ctx.act(r); }, { disabled: hu.bursts <= 0 })),
			row(dieEntry("Or take 1d3 sin: rolled", 3, st.sinRoll, function (v) { st.sinRoll = v; ctx.save(true); }),
				btn("Take " + st.sinRoll + " sin", function () { ctx.act(H.spendBurst(ch, st.sinRoll)); }, { small: true, ghost: true })),
			h("div", { class: "manual" },
				h("div", { class: "label" }, "Set by hand"),
				h("div", { class: "stepper-row" },
					stepper("Bursts", hu.bursts, 0, 99, manual(ch, ctx, "Psyche bursts", function (v) { var b = hu.bursts; hu.bursts = v; return b; })),
					stepper("Sin (cap " + d.sinCap + ")", ch.sin, 0, 99, manual(ch, ctx, "Sin", function (v) { var b = ch.sin; ch.sin = v; return b; })),
					stepper("Pathos", hu.pathos, 0, core.base.pathosMax, manual(ch, ctx, "Pathos", function (v) { var b = hu.pathos; hu.pathos = v; return b; })),
					chip("Divine Agony used", hu.divineAgonyUsed, manualToggle(ch, ctx, "Divine Agony", function () { return hu.divineAgonyUsed; }, function (v) { hu.divineAgonyUsed = v; })))),
			h("p", { class: "note" }, term("Pathos"), " " + hu.pathos + "/3: stored on a roll with no successes, an injury, an affliction, a filled hook, or an ally's death or overflow."));
	}

	// Works out the dice pool, then records the successes rolled at the table.
	function poolCard(ch, ctx) {
		var d = R.derived(ch);
		var hu = ch.hunt;
		var st = uiFor(ch).pool;
		var p = H.poolFor(ch, st);
		if (st.successes > p.maxSuccesses) st.successes = p.maxSuccesses;
		var options = core.skills.map(function (s) { return { value: s.id, label: s.name + " (" + d.skillDice[s.id] + "D)" }; });
		options.push({ value: "psyche", label: "PSYCHE (" + d.psyche + "D)" });
		var instruction = p.zeroPool
			? "Roll 2d6 and keep the lowest. " + (p.hard ? "A 6" : "4+") + " succeeds."
			: "Roll " + p.pool + "d6. Each " + (p.hard ? "6" : "4+") + " is a success.";
		return card("roller", "Dice pool", p.zeroPool ? "0D" : p.pool + "D",
			row(CAIN.select("Skill", st.skill, options, function (v) { st.skill = v; ctx.save(true); })),
			h("div", { class: "chips pool-toggles" },
				chip("Setup +1", st.setup, function () { st.setup = !st.setup; ctx.save(true); }),
				chip("Burst +1", st.burst, function () { st.burst = !st.burst; ctx.save(true); }, { title: "Spend a psyche burst to use your powers" }),
				chip("Hard", st.hard, function () { st.hard = !st.hard; ctx.save(true); }, { title: "Only 6s succeed" }),
				chip("Divine Agony +" + hu.pathos, st.agony && !hu.divineAgonyUsed, function () { st.agony = !st.agony; ctx.save(true); }, { disabled: hu.divineAgonyUsed || hu.pathos === 0, title: "Burn all pathos for +1D each, past the cap. Once a session." })),
			h("div", { class: "stepper-row" },
				stepper("Ability", st.ability, 0, 3, function (v) { st.ability = v; ctx.save(true); }, { suffix: "D", small: true }),
				stepper("Circumstance", st.circumstance, 0, 3, function (v) { st.circumstance = v; ctx.save(true); }, { suffix: "D", small: true })),
			st.burst ? row(chip("Pay the burst with 1d3 sin", st.burstSin, function () { st.burstSin = !st.burstSin; ctx.save(true); }),
				st.burstSin ? dieEntry("d3 rolled", 3, st.burstSinRoll, function (v) { st.burstSinRoll = v; ctx.save(true); }) : null) : null,
			h("div", { class: "pool-instruction" }, instruction,
				p.bonusCapped ? h("span", { class: "note" }, " Bonus dice cap at +3.") : null),
			row(stepper("Successes rolled", st.successes, 0, p.maxSuccesses, function (v) { st.successes = v; ctx.save(true); }),
				btn("Record", function () {
					var r = H.recordRoll(ch, { skill: st.skill, setup: st.setup, ability: st.ability, circumstance: st.circumstance, burst: st.burst,
						burstSinRoll: st.burst && st.burstSin ? st.burstSinRoll : undefined, agony: st.agony, hard: st.hard }, st.successes);
					if (!r.ok) { ctx.flash([r.reason]); return; }
					uiFor(ch).pool = { skill: st.skill, setup: false, ability: 0, circumstance: 0, burst: false, burstSin: false, burstSinRoll: 2, agony: false, hard: false, successes: 0 };
					ctx.act(r);
				}, { disabled: st.burst && !st.burstSin && hu.bursts <= 0 })),
			h("p", { class: "note" }, "Roll at the table so the Admin sees it. Recording spends the burst or Divine Agony and stores pathos on 0 successes. On a talisman, each success is a slash."),
			hu.rolls.length ? h("ol", { class: "roll-history" }, hu.rolls.slice(0, 5).map(function (r) {
				return h("li", null, r.skillName + " " + r.pool + "D" + (r.extras && r.extras.length ? " (" + r.extras.join(", ") + ")" : "") + ": " + r.successes);
			})) : null);
	}

	function hooksCard(ch, ctx) {
		var hu = ch.hunt;
		var st = uiFor(ch);
		var input = h("input", { class: "input", type: "text", placeholder: "Name it by its consequence: festering wound", value: st.hookName });
		input.addEventListener("input", function () { st.hookName = input.value; });
		function add() {
			var name = input.value.trim();
			if (!name) return;
			st.hookName = "";
			ctx.act(H.addHook(ch, name));
		}
		input.addEventListener("keydown", function (e) { if (e.key === "Enter") add(); });
		return card("hooks", "Hooks", hu.hooks.length + " active",
			hu.hooks.length ? h("ul", { class: "hook-list play" }, hu.hooks.map(function (hk, i) {
				return h("li", null,
					h("span", { class: "hook-name" }, hk.name),
					stepper(null, hk.slashes, 0, core.base.hookLength, function (v) { ctx.act(H.slashHook(ch, i, v - hk.slashes)); }, { suffix: " / " + core.base.hookLength, small: true, aria: hk.name + " slashes" }),
					h("span", { class: "chips" }, chip("Resolve", false, function () { ctx.act(H.removeHook(ch, i)); }, { title: "Cashed in or cleared" })));
			})) : h("p", { class: "note" }, "None."),
			h("div", { class: "add-row" }, input, btn("Add", add, { small: true })),
			h("div", { class: "btn-row" }, btn("Pressure rose", function () { ctx.act(H.pressureRises(ch)); }, { ghost: true, small: true, title: "Slashes every hook" })),
			h("p", { class: "note" }, "Slash when you gain it again, when pressure rises, or when the risk die rolls a 1. When full, the Admin cashes it in."));
	}

	function afflictionsCard(ch, ctx) {
		var hu = ch.hunt;
		var st = uiFor(ch);
		var input = h("input", { class: "input", type: "text", placeholder: "Black veins, whispering...", value: st.affliction });
		input.addEventListener("input", function () { st.affliction = input.value; });
		function add() {
			var text = input.value.trim();
			if (!text) return;
			st.affliction = "";
			ctx.act(H.addAffliction(ch, text));
		}
		input.addEventListener("keydown", function (e) { if (e.key === "Enter") add(); });
		return card("afflictions", "Afflictions", "Until the hunt ends",
			hu.afflictions.length ? h("ul", { class: "kit-list" }, hu.afflictions.map(function (a, i) {
				return h("li", null, h("span", null, a), chip("Remove", false, function () { ctx.act(H.removeAffliction(ch, i)); }));
			})) : h("p", { class: "note" }, "None."),
			h("div", { class: "add-row" }, input, btn("Add", add, { small: true })));
	}

	function kitCard(ch, ctx) {
		var d = R.derived(ch);
		var hu = ch.hunt;
		var st = uiFor(ch);
		var left = H.kpLeft(ch);
		var rows = core.defaultKit.filter(function (k) { return k.kp > 0; }).map(function (k) {
			return h("li", null, h("span", null, k.name + (k.id === "service-weapons" ? " (CAT " + ch.weaponCat + ")" : "")),
				chip("Pull " + k.kp + " KP", false, function () { ctx.act(H.spendKp(ch, k.kp, k.name)); }, { disabled: left < k.kp }));
		});
		ch.purchases.forEach(function (p) {
			var item = R.kitItem(p.item);
			if (!item || item.kp === null) return;
			var consumable = item.tags.indexOf("Consumable") >= 0;
			if (consumable && st.useItem && st.useItem.id === item.id) {
				rows.push(h("li", { class: "use-row" }, h("span", null, item.name + ": " + item.text),
					h("span", { class: "row-tools" },
						dieEntry(item.use.healStress.dice + " rolled", 3, st.useItem.roll, function (v) { st.useItem.roll = v; ctx.save(true); }),
						btn("Use", function () {
							var r = H.useConsumable(ch, item.id, st.useItem.roll);
							if (!r.ok) { ctx.flash([r.reason || "Can't use that."]); return; }
							st.useItem = null;
							ctx.act(r);
						}, { small: true }),
						btn("Cancel", function () { st.useItem = null; ctx.save(true); }, { small: true, ghost: true }))));
				return;
			}
			rows.push(h("li", null, h("span", null, item.name + (p.count > 1 ? " x" + p.count : "")),
				consumable
					? chip("Use " + item.kp + " KP", false, function () {
						if (item.use && item.use.healStress) { st.useItem = { id: item.id, roll: 2 }; ctx.save(true); return; }
						var r = H.useConsumable(ch, item.id);
						if (!r.ok) ctx.flash([r.reason || "Can't use that."]); else ctx.act(r);
					}, { disabled: left < item.kp })
					: chip("Pull " + item.kp + " KP", false, function () { ctx.act(H.spendKp(ch, item.kp, item.name)); }, { disabled: left < item.kp })));
		});
		return card("kit", "Kit", left + " / " + d.kitPoints + " KP left",
			h("div", { class: "big-pips" }, bubbles(left, d.kitPoints, { label: "Kit points left" })),
			h("ul", { class: "kit-list" }, rows),
			hu.pulled.length ? h("p", { class: "note" }, "Pulled out: " + hu.pulled.join(", ") + ".") : null,
			h("div", { class: "manual" },
				h("div", { class: "label" }, "Set by hand"),
				h("div", { class: "stepper-row" },
					stepper("KP left", left, 0, d.kitPoints, manual(ch, ctx, "KP left", function (v) { var b = left; hu.kpSpent = d.kitPoints - v; return b; })))));
	}

	function restCard(ch, ctx) {
		var hu = ch.hunt;
		var st = uiFor(ch);
		var count = R.derived(ch).restDice;
		var body;
		if (hu.restDice) {
			body = h("ul", { class: "rest-dice" }, hu.restDice.map(function (die, i) {
				if (die.used) return h("li", { class: "used" }, h("span", { class: "die" }, String(die.value)), h("span", { class: "note" }, "Assigned."));
				return h("li", null, h("span", { class: "die hit" }, String(die.value)),
					h("span", { class: "chips" },
						chip("Bursts", false, function () { ctx.act(H.assignRest(ch, i, "bursts")); }),
						chip("Stress", false, function () { ctx.act(H.assignRest(ch, i, "stress")); }),
						hu.hooks.map(function (hk, hi) { return chip(hk.name, false, function () { ctx.act(H.assignRest(ch, i, { hook: hi })); }); })));
			}));
		} else if (st.restRolls) {
			body = h("div", null,
				h("div", { class: "stepper-row" }, st.restRolls.map(function (v, i) {
					return dieEntry("Resting d3 #" + (i + 1), 3, v, function (nv) { st.restRolls[i] = nv; ctx.save(true); });
				})),
				h("div", { class: "btn-row" },
					btn("Confirm the dice", function () {
						var r = H.rest(ch, st.restRolls);
						if (!r.ok) { ctx.flash([r.reason]); return; }
						st.restRolls = null;
						ctx.act(r);
					}, { small: true }),
					btn("Cancel", function () { st.restRolls = null; ctx.save(true); }, { small: true, ghost: true })));
		} else {
			body = h("div", { class: "btn-row" }, btn("Rest", function () {
				st.restRolls = [];
				for (var i = 0; i < count; i++) st.restRolls.push(2);
				ctx.save(true);
			}));
		}
		return card("rest", "Rest", hu.rests ? "Rested " + hu.rests + "x" : "As a group",
			h("p", { class: "note" }, "Resting raises pressure by 1. Roll " + count + "d3 at the table, enter them, then put each die on psyche bursts, stress, or a hook (the same choice twice is fine)."),
			body);
	}

	CAIN.renderPlay = function (ch, ctx) {
		if (ch.dead) return [];
		var out = [alerts(ch, ctx)];
		if (!ch.hunt.started) {
			out.push(deployCard(ch, ctx));
			return out;
		}
		out.push(h("div", { class: "play-grid" },
			h("div", { class: "play-col" }, stressCard(ch, ctx), psycheCard(ch, ctx), kitCard(ch, ctx), restCard(ch, ctx)),
			h("div", { class: "play-col" }, poolCard(ch, ctx), hooksCard(ch, ctx), afflictionsCard(ch, ctx),
				card("log", "Log", "Recent", logList(ch, 14)))));
		return out;
	};

	// Between missions

	function sessionCard(ch, ctx) {
		var st = uiFor(ch).session;
		var d = R.derived(ch);
		return card("session", "End of session", "XP " + ch.xp + " / " + d.xpToAdvance,
			h("div", { class: "big-pips" }, bubbles(ch.xp, d.xpToAdvance, { label: "XP" })),
			h("p", { class: "note" }, "Answer each question. Every yes is 1 XP. Pathos and Divine Agony reset."),
			h("ul", { class: "options" }, core.xpQuestions.map(function (q) {
				return h("li", null, h("button", { class: "option multi", type: "button", "aria-pressed": String(!!st[q.id]),
					onclick: function () { st[q.id] = !st[q.id]; ctx.save(true); } },
					h("span", { class: "option-mark", "aria-hidden": "true" }), h("span", { class: "option-body" }, q.text)));
			})),
			h("div", { class: "btn-row" }, btn("Record the session", function () {
				var r = H.endSession(ch, st);
				uiFor(ch).session = {};
				ctx.act(r);
			})),
			h("div", { class: "manual" },
				h("div", { class: "label" }, "Set by hand"),
				h("div", { class: "stepper-row" },
					stepper("XP", ch.xp, 0, 99, manual(ch, ctx, "XP", function (v) { var b = ch.xp; ch.xp = v; return b; })),
					stepper("Advances", ch.advances, 0, 99, manual(ch, ctx, "Advances banked", function (v) { var b = ch.advances; ch.advances = v; return b; })))));
	}

	function advanceCard(ch, ctx) {
		var st = uiFor(ch);
		var options = R.legalAdvances(ch);
		if (ch.advances <= 0) {
			return card("advance", "Advances", "0 banked", h("p", { class: "note" }, "Fill the XP track to earn an advance."));
		}
		var a = st.advance;
		var body = [];
		function apply(choice) {
			var r = H.spendAdvance(ch, choice);
			if (!r.ok) { ctx.flash([r.reason]); return; }
			st.advance = null;
			if (r.choose && r.choose.length) st.markSkill = { mark: r.mark, ability: r.ability, choices: r.choose };
			ctx.act(r);
		}
		function replaceStep(choice, kind) {
			var list = kind === "agenda"
				? ch.agendaAbilities.map(function (r) { return { label: R.agendaAbility(r).name, value: JSON.stringify({ agenda: r.agenda, ability: r.ability }) }; })
				: [].concat.apply([], ch.blasphemies.map(function (b) { return b.powers.map(function (p) { return { label: R.power(b.id, p).name, value: JSON.stringify({ blasphemy: b.id, power: p }) }; }); }));
			return h("div", null, h("p", { class: "note" }, "You're at the cap of 5. Pick one to replace:"),
				row(CAIN.select(null, "", list, function (v) { if (v) { choice.replace = JSON.parse(v); apply(choice); } }, { placeholder: "Replace...", aria: "Replace" })));
		}
		if (!a) {
			body.push(h("ul", { class: "options" }, options.map(function (opt) {
				var label = {
					agendaAbility: "New agenda ability",
					blasphemyPower: "New " + (opt.blasphemy ? R.blasphemy(opt.blasphemy).name : "") + " power",
					newBlasphemy: "Unlock a new blasphemy (sin cap -1, XP to advance +1)",
					evolveSinMark: "Evolve a sin mark",
					scrip: "Gain " + core.advanceScrip + " scrip",
					skill: "Improve a skill by 1 (" + ch.skillImprovements + " / " + core.skillImprovementLimit + " used)"
				}[opt.kind];
				return h("li", null, h("button", { class: "option", type: "button", onclick: function () {
					if (opt.kind === "scrip") { apply({ kind: "scrip" }); return; }
					st.advance = { kind: opt.kind, blasphemy: opt.blasphemy, opt: opt };
					ctx.save(true);
				} }, h("span", { class: "option-mark", "aria-hidden": "true" }), h("span", { class: "option-body" }, label)));
			})));
		} else {
			var opt = a.opt;
			var cat = R.derived(ch).cat;
			if (a.kind === "agendaAbility") {
				body.push(h("ul", { class: "options" }, opt.choices.map(function (id) {
					var ab = R.agendaAbility({ agenda: ch.agenda, ability: id });
					return h("li", null, h("button", { class: "option", type: "button", "aria-pressed": String(a.pick === id), onclick: function () {
						if (opt.mustReplace) { a.pick = id; ctx.save(true); } else apply({ kind: "agendaAbility", ability: id });
					} }, h("span", { class: "option-mark" }), h("span", { class: "option-body" }, h("span", { class: "entry-name" }, ab.name), CAIN.richText(ab.text, cat))));
				})));
				if (a.pick) body.push(replaceStep({ kind: "agendaAbility", ability: a.pick }, "agenda"));
			} else if (a.kind === "blasphemyPower" || (a.kind === "newBlasphemy" && a.pickBlasphemy)) {
				var bid = a.kind === "newBlasphemy" ? a.pickBlasphemy : a.blasphemy;
				var b = R.blasphemy(bid);
				var powers = a.kind === "newBlasphemy" ? b.powers.map(function (p) { return p.id; }) : opt.choices;
				if (a.kind === "newBlasphemy") body.push(h("div", { class: "passive" }, h("div", { class: "entry-name" }, b.passive.name, h("span", { class: "tag stamp" }, "Passive")), CAIN.richText(b.passive.text, cat)));
				body.push(h("ul", { class: "options" }, powers.map(function (pid) {
					var p = R.power(bid, pid);
					return h("li", null, h("button", { class: "option", type: "button", "aria-pressed": String(a.pick === pid), onclick: function () {
						var choice = a.kind === "newBlasphemy" ? { kind: "newBlasphemy", blasphemy: bid, power: pid } : { kind: "blasphemyPower", blasphemy: bid, power: pid };
						if (opt.mustReplace) { a.pick = pid; ctx.save(true); } else apply(choice);
					} }, h("span", { class: "option-mark" }), h("span", { class: "option-body" }, h("span", { class: "entry-name" }, p.name), CAIN.richText(p.text, cat))));
				})));
				if (a.pick) body.push(replaceStep(a.kind === "newBlasphemy" ? { kind: "newBlasphemy", blasphemy: bid, power: a.pick } : { kind: "blasphemyPower", blasphemy: bid, power: a.pick }, "power"));
			} else if (a.kind === "newBlasphemy") {
				body.push(row(CAIN.select("Blasphemy", "", opt.choices.map(function (id) { return { value: id, label: R.blasphemy(id).name }; }),
					function (v) { if (v) { a.pickBlasphemy = v; ctx.save(true); } }, { placeholder: "Choose" })));
			} else if (a.kind === "evolveSinMark") {
				if (!a.mark) {
					body.push(row(CAIN.select("Mark", "", opt.choices.map(function (id) { return { value: id, label: R.sinMark(id).name }; }),
						function (v) { if (v) { a.mark = v; ctx.save(true); } }, { placeholder: "Choose" })));
				} else {
					body.push(sinMarkCard(ch, ctx, st, a.mark, function (markId, face) {
						var r = H.spendAdvance(ch, { kind: "evolveSinMark", mark: markId, ability: face });
						if (r.ok) st.advance = null;
						return r;
					}));
				}
			} else if (a.kind === "skill") {
				body.push(row(CAIN.select("Skill", "", opt.choices.map(function (id) {
					var s = core.skills.filter(function (x) { return x.id === id; })[0];
					return { value: id, label: s.name + " " + ch.skills[id] + " -> " + (ch.skills[id] + 1) };
				}), function (v) { if (v) apply({ kind: "skill", skill: v }); }, { placeholder: "Choose" })));
			}
			body.push(h("div", { class: "btn-row" }, btn("Back", function () { st.advance = null; ctx.save(true); }, { ghost: true, small: true })));
		}
		return card("advance", "Spend an advance", ch.advances + " banked", body);
	}

	function missionCard(ch, ctx) {
		var st = uiFor(ch).mission;
		var pay = core.missionPay;
		return card("mission", "End of mission", "Exfiltration",
			h("p", { class: "note" }, "Closes the hunt: pays scrip, halves sin" + (ch.settings.clearSinAfterMission ? " (house rule: clears it)" : "") + ", adds a mission survived, and resets stress, injuries, hooks, afflictions, bursts and KP."),
			row(h("span", { class: "field-label" }, "Outcome"),
				h("span", { class: "chips" },
					chip("Executed +" + pay.execute, st.outcome === "execute" && !st.died, function () { st.outcome = "execute"; st.died = false; ctx.save(true); }),
					chip("Spared +" + pay.spare, st.outcome === "spare" && !st.died, function () { st.outcome = "spare"; st.died = false; ctx.save(true); }),
					chip("Failed " + pay.fail, st.outcome === "fail" && !st.died, function () { st.outcome = "fail"; st.died = false; ctx.save(true); }))),
			row(stepper("Fallen exorcists' remains recovered", st.bodies, 0, 20, function (v) { st.bodies = v; ctx.save(true); }, { title: "+1 XP and +1 scrip each" })),
			row(chip("This exorcist died", st.died, function () { st.died = !st.died; ctx.save(true); })),
			h("div", { class: "btn-row" }, btn(st.died ? "Record the death" : "Close the mission", function () {
				var r = H.endMission(ch, { outcome: st.outcome, bodies: st.bodies, died: st.died });
				uiFor(ch).mission = { outcome: "execute", bodies: 0, died: false };
				ctx.act(r);
			}, { danger: st.died })));
	}

	function shopCard(ch, ctx) {
		var u = core.weaponUpgrade;
		var rows = CAIN.kit.map(function (item) {
			var can = H.canBuy(ch, item.id);
			var owned = ch.purchases.filter(function (p) { return p.item === item.id; })[0];
			return h("li", { class: "entry" },
				h("div", { class: "entry-name" }, item.name, owned ? h("span", { class: "tag" }, owned.count > 1 ? "Owned x" + owned.count : "Owned") : null),
				h("div", { class: "tags" },
					h("span", { class: "tag" }, item.scrip + " scrip"),
					item.kp !== null ? h("span", { class: "tag" }, item.kp + " KP") : null,
					item.tags.map(function (t) { return h("span", { class: "tag" }, t); })),
				h("div", { class: "entry-text" }, h("p", null, item.text)),
				h("div", { class: "btn-row" }, btn(can.ok ? "Buy" : can.reason, function () { ctx.act(H.buy(ch, item.id)); }, { small: true, disabled: !can.ok })));
		});
		rows.push(h("li", { class: "entry" },
			h("div", { class: "entry-name" }, "Service weapon upgrade", h("span", { class: "tag" }, "CAT " + ch.weaponCat)),
			h("div", { class: "entry-text" }, h("p", null, "Both service weapons +1 CAT, to a max of CAT " + u.maxCat + ".")),
			h("div", { class: "btn-row" }, btn(ch.weaponCat >= u.maxCat ? "Maxed" : ch.scrip < u.cost ? "Need " + u.cost + " scrip" : "Upgrade for " + u.cost, function () { ctx.act(H.upgradeWeapons(ch)); }, { small: true, disabled: ch.weaponCat >= u.maxCat || ch.scrip < u.cost }))));
		return card("shop", "Kit shop", ch.scrip + " scrip",
			h("p", { class: "note" }, "Scrip is spent between missions. Bought items are always on your kit list; pull them out with KP. To add or remove items without paying, use the Sheet tab."),
			h("div", { class: "manual" },
				h("div", { class: "stepper-row" },
					stepper("Scrip", ch.scrip, 0, 999, manual(ch, ctx, "Scrip", function (v) { var b = ch.scrip; ch.scrip = v; return b; })))),
			h("ul", { class: "entries" }, rows));
	}

	CAIN.renderBetween = function (ch, ctx) {
		if (ch.dead) return [];
		var st = uiFor(ch);
		return [
			st.markSkill ? markSkillChooser(ch, ctx, st) : null,
			ch.hunt.started ? h("p", { class: "note" }, "A hunt is in progress. Record sessions as you go; close the mission when it's over.") : null,
			h("div", { class: "play-grid" },
				h("div", { class: "play-col" }, sessionCard(ch, ctx), advanceCard(ch, ctx), ch.hunt.started ? missionCard(ch, ctx) : null),
				h("div", { class: "play-col" }, shopCard(ch, ctx), card("log", "Log", "Recent", logList(ch, 14))))
		];
	};
})();
