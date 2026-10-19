// Play mode (during a hunt) and Between missions (sessions, advances, mission end, kit shop).
window.CAIN = window.CAIN || {};

(function () {
	var R = CAIN.rules;
	var H = CAIN.hunt;
	var core = CAIN.core;
	var h = CAIN.h;
	var term = CAIN.term;
	var bubbles = CAIN.bubbles;

	// Per-character UI state that doesn't need saving: roller toggles, multi-step picks.
	var ui = {};
	function uiFor(ch) {
		if (!ui[ch.id]) ui[ch.id] = { roll: { skill: "force", setup: false, ability: 0, circumstance: 0, burst: false, burstSin: false, hard: false, risky: true, agony: false }, stress: { amount: 1, nonlethal: false, ironSoul: true }, advance: null, mission: { outcome: "execute", bodies: 0, died: false }, session: {}, markSkill: null, hookName: "", affliction: "", jack: null };
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

	function logList(ch, n) {
		if (!ch.log.length) return h("p", { class: "note" }, "Nothing yet.");
		return h("ol", { class: "log-list" }, ch.log.slice(0, n).map(function (e) {
			var d = new Date(e.t);
			var time = ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
			return h("li", null, h("span", { class: "log-time" }, time), h("span", null, e.text));
		}));
	}

	// Alerts that take over the top of play mode: death, overflow, sin marks.

	function alerts(ch, ctx) {
		var out = [];
		var p = ch.hunt.pending;
		var st = uiFor(ch);
		if (p && p.type === "instantDeath") {
			out.push(h("section", { class: "card alert" },
				h("div", { class: "alert-title" }, "Instant death"),
				h("p", null, p.reason + " You may describe how it happens, or defy your fate: suffer sin overflow instead and drop to one injury below max."),
				h("div", { class: "btn-row" },
					btn("Defy fate", function () { ctx.act(H.resolveDeath(ch, "defy")); }),
					btn("Die", function () { ctx.act(H.resolveDeath(ch, "die")); }, { ghost: true, danger: true }))));
			return out;
		}
		if (H.overflowDue(ch)) {
			var marks = ch.sinMarks.length;
			out.push(h("section", { class: "card alert" },
				h("div", { class: "alert-title" }, "!! Sin overflow !!"),
				h("p", null, "At the end of the scene your power runs wild. Give up and become a sin, or resist: roll 1d6 + " + marks + " (sin marks). " +
					(marks ? "6 or less keeps control; a 1 always does." : "With no sin marks you pass automatically.") +
					" On a pass, clear all sin, cross out two sin boxes and gain a sin mark."),
				h("div", { class: "btn-row" },
					btn("Resist", function () { ctx.act(H.resolveOverflow(ch, "resist")); }),
					btn("Give up", function () { ctx.act(H.resolveOverflow(ch, "giveUp")); }, { ghost: true, danger: true }))));
			return out;
		}
		if (p && p.type === "sinMark") {
			out.push(h("section", { class: "card alert" },
				h("div", { class: "alert-title" }, "A sin mark manifests"),
				h("p", null, "Roll 1d6 for the location (a 6 lets you choose), then 1d6 for its ability."),
				st.chooseMark ? h("div", { class: "btn-row" }, CAIN.sinMarks.map(function (m) {
					return btn(m.name, function () {
						st.chooseMark = false;
						var r = H.rollSinMark(ch, null, m.id);
						if (r.choose && r.choose.length) st.markSkill = { mark: r.mark, ability: r.ability, choices: r.choose };
						ctx.act(r);
					});
				})) : h("div", { class: "btn-row" }, btn("Roll the sin mark", function () {
					var r = H.rollSinMark(ch);
					if (r.choose === true) st.chooseMark = true;
					else if (r.choose && r.choose.length) st.markSkill = { mark: r.mark, ability: r.ability, choices: r.choose };
					ctx.act(r);
				}))));
		}
		if (st.markSkill) out.push(markSkillChooser(ch, ctx, st));
		return out;
	}

	function markSkillChooser(ch, ctx, st) {
		var m = st.markSkill;
		var owned = ch.sinMarks.filter(function (x) { return x.mark === m.mark; })[0];
		var entry = owned && owned.abilities.filter(function (a) { return a.roll === m.ability; })[0];
		return h("section", { class: "card alert soft" },
			h("div", { class: "alert-title" }, "Pick the skill for your new mark"),
			h("div", { class: "btn-row" }, m.choices.map(function (s) {
				return chip(s, entry && entry.skill === s, function () { H.setMarkSkill(ch, m.mark, m.ability, s); ctx.save(true); });
			}), btn("Done", function () { st.markSkill = null; ctx.save(true); }, { small: true })));
	}

	// Play mode

	function deployCard(ch, ctx) {
		var st = uiFor(ch);
		var zeroSkills = core.skills.filter(function (s) { return ch.skills[s.id] === 0; });
		var jack = H.hasAgendaAbility(ch, "jack");
		return card("deploy", "Deploy", "New hunt",
			h("p", null, "Every hunt starts fresh: no stress, injuries or hooks, " + R.derived(ch).psycheBursts + " psyche bursts and full kit points. Only sin, sin marks, your abilities, XP and scrip carry over."),
			H.hasAgendaAbility(ch, "oilfinger") ? h("p", { class: "note" }, "Oilfinger will roll 1d3+1 extra KP.") : null,
			jack ? h("div", { class: "subrow" }, h("span", { class: "field-label" }, "Jack!: a 0 skill counts as 1 this mission"),
				h("span", { class: "chips" }, zeroSkills.map(function (s) {
					return chip(s.name, st.jack === s.id, function () { st.jack = st.jack === s.id ? null : s.id; ctx.save(true); });
				}))) : null,
			h("div", { class: "btn-row" }, btn("Start the hunt", function () { ctx.act(H.startMission(ch, { jackSkill: st.jack })); })));
	}

	function stressCard(ch, ctx) {
		var d = R.derived(ch);
		var hu = ch.hunt;
		var st = uiFor(ch).stress;
		var lost = d.stressCapacity - d.maxStress;
		var iron = H.hasPassive(ch, "iron-soul");
		var amounts = [1, 2, 3, 4, 5, 6, 7].map(function (n) {
			return chip(String(n), st.amount === n, function () { st.amount = n; ctx.save(true); });
		});
		return card("stress", { text: "Execution", goth: true }, hu.stress + " / " + d.maxStress + " stress",
			H.atBrink(ch) ? h("p", { class: "brink" }, "!! Brink of death !! Any more stress is instant death.") : null,
			h("div", { class: "big-pips" }, bubbles(hu.stress, d.stressCapacity, { shape: "box", crossed: lost, label: "Stress" })),
			h("div", { class: "subrow" },
				h("span", { class: "field-label" }, "Take"),
				h("span", { class: "chips" }, amounts)),
			h("div", { class: "subrow" },
				h("span", { class: "chips" },
					chip("Nonlethal", st.nonlethal, function () { st.nonlethal = !st.nonlethal; ctx.save(true); }, { title: "Can't fill the talisman" }),
					iron ? chip("Iron Soul" + (hu.ironSoulUsed ? " (used)" : ""), st.ironSoul && !hu.ironSoulUsed, function () { st.ironSoul = !st.ironSoul; ctx.save(true); }, { disabled: hu.ironSoulUsed, title: "If this fills the talisman, roll 1d6: on 4+ stay 1 under max" }) : null)),
			h("div", { class: "btn-row" },
				btn("Take " + st.amount + " stress", function () { ctx.act(H.takeStress(ch, st.amount, { nonlethal: st.nonlethal, ironSoul: iron && st.ironSoul })); }),
				btn("Erase 1", function () { ctx.act(H.healStress(ch, 1)); }, { ghost: true, disabled: hu.stress === 0 })),
			h("p", { class: "note" }, "1: pain, strain. 2-3: crippling for a human. 4+: messily fatal for a human. 7+ in one hit is instant death."),
			h("div", { class: "subrow" },
				h("span", { class: "field-label" }, term("Injuries", "injury"), " " + hu.injuries + " / " + d.maxInjuries),
				bubbles(hu.injuries, d.maxInjuries, { label: "Injuries" }),
				h("span", { class: "chips" },
					chip("-", false, function () { ctx.act(H.changeInjuries(ch, -1)); }, { disabled: hu.injuries === 0, title: "Heal an injury" }),
					chip("+", false, function () { ctx.act(H.changeInjuries(ch, 1)); }, { disabled: hu.injuries >= d.maxInjuries, title: "Mark an injury" }))));
	}

	function psycheCard(ch, ctx) {
		var d = R.derived(ch);
		var hu = ch.hunt;
		return card("psyche", "Psyche", "PSYCHE " + d.psyche + "D  /  CAT " + d.cat,
			h("div", { class: "subrow" },
				h("span", { class: "field-label" }, term("Psyche bursts", "psyche burst"), " " + hu.bursts + " / " + d.psycheBursts),
				bubbles(hu.bursts, d.psycheBursts, { label: "Psyche bursts" })),
			h("div", { class: "btn-row" },
				btn("Spend a burst", function () { ctx.act(H.spendBurst(ch, false)); }, { disabled: hu.bursts <= 0 }),
				btn("Take 1d3 sin instead", function () { ctx.act(H.spendBurst(ch, true)); }, { ghost: true })),
			h("div", { class: "subrow" },
				h("span", { class: "field-label" }, term("Sin"), " " + ch.sin + " / " + d.sinCap),
				h("span", { class: "chips" },
					chip("-", false, function () { ctx.act(H.changeSin(ch, -1)); }, { disabled: ch.sin === 0 }),
					chip("+", false, function () { ctx.act(H.changeSin(ch, 1)); }))),
			h("div", { class: "subrow" },
				h("span", { class: "field-label" }, term("Pathos"), " " + hu.pathos + " / " + core.base.pathosMax),
				bubbles(hu.pathos, core.base.pathosMax, { shape: "star", label: "Pathos" }),
				h("span", { class: "chips" },
					chip("-", false, function () { ctx.act(H.changePathos(ch, -1)); }, { disabled: hu.pathos === 0 }),
					chip("+", false, function () { ctx.act(H.changePathos(ch, 1)); }, { disabled: hu.pathos >= core.base.pathosMax }))),
			h("p", { class: "note" }, term("Divine Agony", "divine agony"), hu.divineAgonyUsed ? ": used this session." : ": ready (toggle it in the roller)."));
	}

	function rollerCard(ch, ctx) {
		var d = R.derived(ch);
		var hu = ch.hunt;
		var st = uiFor(ch).roll;
		var base = st.skill === "psyche" ? d.psyche : d.skillDice[st.skill];
		var bonus = Math.min(core.base.bonusDiceCap, (st.setup ? 1 : 0) + st.ability + st.circumstance + (st.burst ? 1 : 0));
		var agony = st.agony && !hu.divineAgonyUsed ? hu.pathos : 0;
		var pool = base + bonus + agony;
		var skillChips = core.skills.map(function (s) {
			return chip(s.name + " " + d.skillDice[s.id], st.skill === s.id, function () { st.skill = s.id; ctx.save(true); });
		});
		skillChips.push(chip("PSYCHE " + d.psyche, st.skill === "psyche", function () { st.skill = "psyche"; ctx.save(true); }));
		function counter(label, key) {
			return h("span", { class: "counter-chip" }, label + " +" + st[key],
				chip("-", false, function () { st[key] = Math.max(0, st[key] - 1); ctx.save(true); }, { disabled: st[key] === 0 }),
				chip("+", false, function () { st[key] = Math.min(3, st[key] + 1); ctx.save(true); }, { disabled: st[key] >= 3 }));
		}
		var last = hu.rolls[0];
		return card("roller", "Action roll", pool === 0 ? "0D: roll 2, keep lowest" : "Rolling " + pool + "D",
			h("div", { class: "chips skill-chips" }, skillChips),
			h("div", { class: "subrow" }, h("span", { class: "chips" },
				chip("Setup +1", st.setup, function () { st.setup = !st.setup; ctx.save(true); }),
				chip("Burst +1", st.burst, function () { st.burst = !st.burst; ctx.save(true); }, { title: "Spend a psyche burst to use your powers" }),
				st.burst ? chip("Pay with 1d3 sin", st.burstSin, function () { st.burstSin = !st.burstSin; ctx.save(true); }) : null,
				counter("Ability", "ability"),
				counter("Circumstance", "circumstance"))),
			h("div", { class: "subrow" }, h("span", { class: "chips" },
				chip("Hard", st.hard, function () { st.hard = !st.hard; ctx.save(true); }, { title: "Only 6s succeed" }),
				chip("Risky", st.risky, function () { st.risky = !st.risky; ctx.save(true); }, { title: "Also roll the risk die" }),
				chip("Divine Agony (" + hu.pathos + ")", st.agony && !hu.divineAgonyUsed, function () { st.agony = !st.agony; ctx.save(true); }, { disabled: hu.divineAgonyUsed || hu.pathos === 0 }))),
			(st.setup ? 1 : 0) + st.ability + st.circumstance + (st.burst ? 1 : 0) > core.base.bonusDiceCap ? h("p", { class: "note" }, "Bonus dice cap at +3.") : null,
			h("div", { class: "btn-row" }, btn("Roll", function () {
				var r = H.roll(ch, st, null);
				if (!r.ok) { ctx.flash([r.reason]); return; }
				st.setup = false; st.burst = false; st.burstSin = false; st.agony = false; st.ability = 0; st.circumstance = 0;
				ctx.act(r);
			}, { disabled: st.burst && !st.burstSin && hu.bursts <= 0 })),
			last ? rollResult(last) : null,
			hu.rolls.length > 1 ? h("ol", { class: "roll-history" }, hu.rolls.slice(1, 6).map(function (r) {
				return h("li", null, r.skillName + " " + r.pool + "D [" + r.dice.join(" ") + "] " + r.successes + (r.risk ? ", risk " + r.risk : ""));
			})) : null);
	}

	function rollResult(r) {
		var target = r.hard ? 6 : 4;
		var lowest = r.zeroPool ? Math.min(r.dice[0], r.dice[1]) : null;
		var keptUsed = false;
		var faces = r.dice.map(function (v) {
			var kept = !r.zeroPool || (v === lowest && !keptUsed && (keptUsed = true));
			return h("span", { class: "die" + (kept && v >= target ? " hit" : "") + (kept ? "" : " dropped") }, String(v));
		});
		var verdict = r.success ? (r.successes > 1 ? r.successes + " successes" : "Success") : "Failure";
		return h("div", { class: "roll-result" + (r.success ? " ok" : " bad") },
			h("div", { class: "dice-row" }, faces),
			h("div", { class: "verdict" }, verdict, h("span", { class: "label" }, " " + r.skillName + " " + r.pool + "D" + (r.hard ? ", hard" : "") + (r.zeroPool ? ", keep lowest" : ""))),
			h("p", { class: "note" }, "On a talisman, each success is a slash" + (r.success ? ": " + r.successes + "." : ".")),
			r.risk ? h("div", { class: "risk" }, h("span", { class: "die risk-die" }, String(r.risk)),
				h("span", null, h("strong", null, r.riskOutcome.label + ". "), r.riskOutcome.text)) : null);
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
					bubbles(hk.slashes, core.base.hookLength, { shape: "box", label: hk.name }),
					h("span", { class: "chips" },
						chip("-", false, function () { ctx.act(H.slashHook(ch, i, -1)); }, { disabled: hk.slashes === 0, title: "Erase a slash" }),
						chip("+", false, function () { ctx.act(H.slashHook(ch, i, 1)); }, { disabled: hk.slashes >= core.base.hookLength, title: "Slash" }),
						chip("Resolve", false, function () { ctx.act(H.removeHook(ch, i)); }, { title: "Cashed in or cleared" })));
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
		var left = H.kpLeft(ch);
		var rows = core.defaultKit.filter(function (k) { return k.kp > 0; }).map(function (k) {
			return h("li", null, h("span", null, k.name + (k.id === "service-weapons" ? " (CAT " + ch.weaponCat + ")" : "")),
				chip("Pull " + k.kp + " KP", false, function () { ctx.act(H.spendKp(ch, k.kp, k.name)); }, { disabled: left < k.kp }));
		});
		ch.purchases.forEach(function (p) {
			var item = R.kitItem(p.item);
			if (!item || item.kp === null) return;
			var consumable = item.tags.indexOf("Consumable") >= 0;
			rows.push(h("li", null, h("span", null, item.name + (p.count > 1 ? " x" + p.count : "")),
				consumable
					? chip("Use " + item.kp + " KP", false, function () { var r = H.useConsumable(ch, item.id); if (!r.ok) ctx.flash([r.reason || "Can't use that."]); else ctx.act(r); }, { disabled: left < item.kp })
					: chip("Pull " + item.kp + " KP", false, function () { ctx.act(H.spendKp(ch, item.kp, item.name)); }, { disabled: left < item.kp })));
		});
		return card("kit", "Kit", left + " / " + d.kitPoints + " KP left",
			h("div", { class: "big-pips" }, bubbles(left, d.kitPoints, { label: "Kit points left" })),
			h("ul", { class: "kit-list" }, rows),
			h("div", { class: "btn-row" },
				btn("Spend 1 KP", function () { ctx.act(H.spendKp(ch, 1)); }, { ghost: true, small: true, disabled: left < 1, title: "Something found or improvised, or Extra Parts" })),
			ch.hunt.pulled.length ? h("p", { class: "note" }, "Pulled out: " + ch.hunt.pulled.join(", ") + ".") : null);
	}

	function restCard(ch, ctx) {
		var hu = ch.hunt;
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
		} else {
			body = h("div", { class: "btn-row" }, btn("Rest", function () { ctx.act(H.rest(ch)); }));
		}
		return card("rest", "Rest", hu.rests ? "Rested " + hu.rests + "x" : "As a group",
			h("p", { class: "note" }, "Resting raises pressure by 1. Roll " + R.derived(ch).restDice + "d3 and put each die on psyche bursts, stress, or a hook (the same choice twice is fine). Ends or resets 'until rest' effects."),
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
			h("div", { class: "play-col" }, rollerCard(ch, ctx), hooksCard(ch, ctx), afflictionsCard(ch, ctx),
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
			})));
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
		function needsReplace(opt) { return !!opt.mustReplace; }
		function replaceStep(choice, kind) {
			var list = kind === "agenda"
				? ch.agendaAbilities.map(function (r) { return { label: R.agendaAbility(r).name, value: { agenda: r.agenda, ability: r.ability } }; })
				: [].concat.apply([], ch.blasphemies.map(function (b) { return b.powers.map(function (p) { return { label: R.power(b.id, p).name, value: { blasphemy: b.id, power: p } }; }); }));
			return h("div", null, h("p", { class: "note" }, "You're at the cap of 5. Pick one to replace:"),
				h("div", { class: "chips" }, list.map(function (it) {
					return chip(it.label, false, function () { choice.replace = it.value; apply(choice); });
				})));
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
						if (needsReplace(opt)) { a.pick = id; ctx.save(true); } else apply({ kind: "agendaAbility", ability: id });
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
						if (needsReplace(opt)) { a.pick = pid; ctx.save(true); } else apply(choice);
					} }, h("span", { class: "option-mark" }), h("span", { class: "option-body" }, h("span", { class: "entry-name" }, p.name), CAIN.richText(p.text, cat))));
				})));
				if (a.pick) body.push(replaceStep(a.kind === "newBlasphemy" ? { kind: "newBlasphemy", blasphemy: bid, power: a.pick } : { kind: "blasphemyPower", blasphemy: bid, power: a.pick }, "power"));
			} else if (a.kind === "newBlasphemy") {
				body.push(h("div", { class: "chips" }, opt.choices.map(function (id) {
					return chip(R.blasphemy(id).name, false, function () { a.pickBlasphemy = id; ctx.save(true); });
				})));
			} else if (a.kind === "evolveSinMark") {
				body.push(h("div", { class: "chips" }, opt.choices.map(function (id) {
					return chip(R.sinMark(id).name, false, function () { apply({ kind: "evolveSinMark", mark: id }); });
				})), h("p", { class: "note" }, "Rolls a new ability for that mark; duplicates are rerolled."));
			} else if (a.kind === "skill") {
				body.push(h("div", { class: "chips" }, opt.choices.map(function (id) {
					var s = core.skills.filter(function (x) { return x.id === id; })[0];
					return chip(s.name + " " + ch.skills[id] + " -> " + (ch.skills[id] + 1), false, function () { apply({ kind: "skill", skill: id }); });
				})));
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
			h("div", { class: "subrow" }, h("span", { class: "field-label" }, "Outcome"),
				h("span", { class: "chips" },
					chip("Executed +" + pay.execute, st.outcome === "execute" && !st.died, function () { st.outcome = "execute"; st.died = false; ctx.save(true); }),
					chip("Spared +" + pay.spare, st.outcome === "spare" && !st.died, function () { st.outcome = "spare"; st.died = false; ctx.save(true); }),
					chip("Failed " + pay.fail, st.outcome === "fail" && !st.died, function () { st.outcome = "fail"; st.died = false; ctx.save(true); }))),
			h("div", { class: "subrow" }, h("span", { class: "field-label" }, "Remains of fallen exorcists recovered (+1 XP, +1 scrip each)"),
				h("span", { class: "chips" },
					chip("-", false, function () { st.bodies = Math.max(0, st.bodies - 1); ctx.save(true); }, { disabled: st.bodies === 0 }),
					h("span", { class: "stepper-value" }, String(st.bodies)),
					chip("+", false, function () { st.bodies += 1; ctx.save(true); }))),
			h("div", { class: "subrow" }, chip("This exorcist died", st.died, function () { st.died = !st.died; ctx.save(true); })),
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
			h("p", { class: "note" }, "Scrip is spent between missions. Bought items are always on your kit list; pull them out with KP."),
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
