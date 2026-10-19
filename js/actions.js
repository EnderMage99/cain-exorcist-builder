// The action bar above the sheet and the panels it opens: end of session, advances,
// adding abilities and powers, taking stress, the dice pool, resting, missions, the
// kit shop and the log. Alerts for instant death, sin overflow and new sin marks
// appear above the sheet on their own.
// Dice are rolled at the table where the Admin can see them; players enter results.
window.CAIN = window.CAIN || {};

(function () {
	var R = CAIN.rules;
	var H = CAIN.hunt;
	var core = CAIN.core;
	var h = CAIN.h;
	var stepper = CAIN.stepper;

	// Per-character UI state that doesn't need saving.
	var ui = {};
	function uiFor(ch) {
		if (!ui[ch.id]) {
			ui[ch.id] = {
				pool: freshPool("force"),
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
				addFrom: "",
				useAdvance: false,
				swap: { what: "agenda", lastArg: null, target: "", ability: "", useAdvance: false, keepBold: true, powers: [] }
			};
		}
		return ui[ch.id];
	}

	function freshPool(skill) {
		return { skill: skill, setup: false, ability: 0, circumstance: 0, burst: false, burstSin: false, burstSinRoll: 2, agony: false, hard: false, successes: 0 };
	}

	function btn(label, onclick, opts) {
		opts = opts || {};
		return h("button", { class: "btn" + (opts.ghost ? " ghost" : "") + (opts.small ? " small" : "") + (opts.danger ? " danger" : ""), type: "button", disabled: !!opts.disabled, title: opts.title || null, onclick: onclick }, label);
	}

	function chip(label, pressed, onclick, opts) {
		opts = opts || {};
		return h("button", { class: "chip", type: "button", "aria-pressed": String(!!pressed), disabled: !!opts.disabled, title: opts.title || null, onclick: onclick }, label);
	}

	function row() {
		var el = h("div", { class: "subrow" });
		for (var i = 0; i < arguments.length; i++) CAIN.append(el, arguments[i]);
		return el;
	}

	function dieEntry(label, sides, value, onSet) {
		return stepper(label, value, 1, sides, onSet, { small: true, title: "Enter the die you rolled at the table" });
	}

	function panel(ctx, title, note) {
		var el = h("section", { class: "card action-panel" },
			h("div", { class: "card-head" }, h("h2", null, title),
				h("button", { class: "mini-btn", type: "button", onclick: ctx.close }, "Close")),
			note ? h("p", { class: "note" }, note) : null);
		for (var i = 3; i < arguments.length; i++) CAIN.append(el, arguments[i]);
		return el;
	}

	// Alerts: instant death, sin overflow, a sin mark to roll, a mark skill to pick.

	function alerts(ch, ctx) {
		var out = [];
		var p = ch.hunt.pending;
		var st = uiFor(ch);
		if (ch.dead) return out;
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
					btn("Give up", function () { ctx.act(H.resolveOverflow(ch, "giveUp")); }, { ghost: true, danger: true }),
					btn("Not yet (end of scene)", function () { ctx.flash(["Sin overflow happens at the end of the scene. This stays here until it's resolved or sin drops below the cap."]); }, { ghost: true, small: true }))));
			return out;
		}
		if (p && p.type === "sinMark") out.push(sinMarkCard(ch, ctx, st, null));
		if (st.markSkill) out.push(markSkillChooser(ch, ctx, st));
		return out;
	}

	// Location d6 (a 6 lets you choose), then the ability d6. Duplicates: roll again.
	// With fixedMark (evolving by advance) only the ability die is entered.
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
			if (r.choose && r.choose.length > 1) st.markSkill = { mark: r.mark, ability: r.ability, choices: r.choose };
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

	// Panels

	function xpPanel(ch, ctx) {
		var st = uiFor(ch).session;
		var d = R.derived(ch);
		return panel(ctx, "End of session", "Every yes is 1 XP; a full track becomes an advance. Recording also clears pathos and Divine Agony.",
			h("ul", { class: "options" }, core.xpQuestions.map(function (q) {
				return h("li", null, h("button", { class: "option multi", type: "button", "aria-pressed": String(!!st[q.id]),
					onclick: function () { st[q.id] = !st[q.id]; ctx.save(true); } },
					h("span", { class: "option-mark", "aria-hidden": "true" }), h("span", { class: "option-body" }, q.text)));
			})),
			h("div", { class: "btn-row" },
				btn("Record the session", function () {
					var r = H.endSession(ch, st);
					uiFor(ch).session = {};
					ctx.act(r);
				}),
				btn("+1 XP only", function () { ctx.act(H.addXpOnly(ch, 1)); }, { ghost: true, title: "Add one XP without ending the session" })),
			h("p", { class: "note" }, "XP " + ch.xp + " / " + d.xpToAdvance + ", " + ch.advances + " advance" + (ch.advances === 1 ? "" : "s") + " banked."));
	}

	function advancePanel(ch, ctx) {
		var st = uiFor(ch);
		if (ch.advances <= 0) {
			return panel(ctx, "Spend an advance", "No advances banked. Fill the XP track to earn one, or click an advance bubble on the sheet to set it by hand.");
		}
		var options = R.legalAdvances(ch);
		var a = st.advance;
		var body = [];
		function apply(choice) {
			var r = H.spendAdvance(ch, choice);
			if (!r.ok) { ctx.flash([r.reason]); return; }
			st.advance = null;
			if (r.choose && r.choose.length > 1) st.markSkill = { mark: r.mark, ability: r.ability, choices: r.choose };
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
		return panel(ctx, "Spend an advance (" + ch.advances + " banked)", "Only options the rules allow right now. To add anything freely, use Add ability or Add power.", body);
	}

	// Free add, optionally using up an advance. Sorted with the current agenda first.
	function abilityPanel(ch, ctx) {
		var st = uiFor(ch);
		var cat = R.derived(ch).cat;
		var agendas = CAIN.agendas.concat(ch.custom.agendas).sort(function (a, b) { return (b.id === ch.agenda) - (a.id === ch.agenda); });
		var from = st.addFrom && R.agenda(st.addFrom) ? st.addFrom : (ch.agenda && R.agenda(ch.agenda) ? ch.agenda : agendas[0].id);
		var ag = R.agenda(from);
		var open = ag.abilities.filter(function (ab) { return !ch.agendaAbilities.some(function (r) { return r.agenda === ag.id && r.ability === ab.id; }); });
		return panel(ctx, "Add an agenda ability", ch.agendaAbilities.length >= 5 ? "You already have 5. The rules cap it at 5, so remove one on the sheet, or add anyway." : null,
			row(CAIN.select("From agenda", from, agendas.map(function (x) { return { value: x.id, label: x.name + (x.custom ? " (yours)" : "") + (x.id === ch.agenda ? " (current)" : "") }; }),
				function (v) { st.addFrom = v; ctx.save(true); }),
				ch.advances > 0 ? chip("Use up 1 advance (" + ch.advances + ")", st.useAdvance, function () { st.useAdvance = !st.useAdvance; ctx.save(true); }) : null,
				btn("Create your own agenda", function () { ctx.open("customAgenda"); }, { small: true, ghost: true })),
			open.length ? h("ul", { class: "options" }, open.map(function (ab) {
				return h("li", null, h("button", { class: "option", type: "button", onclick: function () {
					ch.agendaAbilities.push({ agenda: ag.id, ability: ab.id });
					var used = st.useAdvance && ch.advances > 0;
					if (used) ch.advances -= 1;
					st.useAdvance = false;
					ctx.act(H.note(ch, "Added agenda ability " + ab.name + (used ? " (used an advance)" : "") + "."));
				} }, h("span", { class: "option-mark" }), h("span", { class: "option-body" }, h("span", { class: "entry-name" }, ab.name), CAIN.richText(ab.text, cat))));
			})) : h("p", { class: "note" }, "You have every ability from " + ag.name + "."));
	}

	function powerPanel(ch, ctx) {
		var st = uiFor(ch);
		var cat = R.derived(ch).cat;
		var owned = ch.blasphemies.map(function (b) { return b.id; });
		var list = CAIN.blasphemies.concat(ch.custom.blasphemies).sort(function (a, b) { return (owned.indexOf(b.id) >= 0) - (owned.indexOf(a.id) >= 0); });
		var from = st.addFrom && R.blasphemy(st.addFrom) ? st.addFrom : (owned.filter(function (o) { return R.blasphemy(o); })[0] || list[0].id);
		var b = R.blasphemy(from);
		var mine = ch.blasphemies.filter(function (x) { return x.id === b.id; })[0];
		var open = b.powers.filter(function (p) { return !mine || mine.powers.indexOf(p.id) < 0; });
		var total = ch.blasphemies.reduce(function (n, x) { return n + x.powers.length; }, 0);
		var th = CAIN.blasTheme(b);
		return panel(ctx, "Add a power", total >= 5 ? "You already have 5 powers. The rules cap it at 5, so remove one on the sheet, or add anyway." : null,
			row(CAIN.select("From blasphemy", from, list.map(function (x) { return { value: x.id, label: x.name + (x.custom ? " (yours)" : "") + (owned.indexOf(x.id) >= 0 ? "" : " (new blasphemy)") }; }),
				function (v) { st.addFrom = v; ctx.save(true); }),
				ch.advances > 0 ? chip("Use up 1 advance (" + ch.advances + ")", st.useAdvance, function () { st.useAdvance = !st.useAdvance; ctx.save(true); }) : null,
				btn("Create your own blasphemy", function () { ctx.open("customBlasphemy"); }, { small: true, ghost: true })),
			h("div", { class: "blas-pick " + th.class, style: th.style },
			!mine ? h("div", { class: "passive" },
				h("div", { class: "entry-name" }, b.passive.name, h("span", { class: "tag stamp" }, "Passive")),
				h("p", { class: "note" }, "A new blasphemy brings its passive, crosses out a sin box and adds 1 to XP to advance."),
				CAIN.richText(b.passive.text, cat)) : null,
			open.length ? h("ul", { class: "options" }, open.map(function (p) {
				return h("li", null, h("button", { class: "option", type: "button", onclick: function () {
					if (!mine) { mine = { id: b.id, powers: [] }; ch.blasphemies.push(mine); }
					mine.powers.push(p.id);
					var used = st.useAdvance && ch.advances > 0;
					if (used) ch.advances -= 1;
					st.useAdvance = false;
					ctx.act(H.note(ch, "Added power " + p.name + " (" + b.name + ")" + (used ? " (used an advance)" : "") + "."));
				} }, h("span", { class: "option-mark" }), h("span", { class: "option-body" },
					CAIN.powerHead(p),
					CAIN.powerTags(p, cat),
					CAIN.richText(p.text, cat))));
			})) : h("p", { class: "note" }, "You have every " + b.name + " power.")));
	}

	// Swap the agenda or one blasphemy. Opened from the bar, or from the sheet
	// with "agenda" or a blasphemy's index as the argument.
	function swapPanel(ch, ctx) {
		var st = uiFor(ch).swap;
		var arg = ctx.panelArg === undefined ? null : String(ctx.panelArg);
		if (arg !== null && arg !== st.lastArg) { st.what = arg; st.target = ""; st.powers = []; st.ability = ""; }
		st.lastArg = arg;
		if (st.what !== "agenda" && !ch.blasphemies[+st.what]) st.what = "agenda";
		var cat = R.derived(ch).cat;
		var cur = ch.agenda ? R.agenda(ch.agenda) : null;
		function pickWhat(v) { st.what = v; st.target = ""; st.powers = []; st.ability = ""; ctx.save(true); }
		var whatRow = h("div", { class: "chips swap-what", role: "group", "aria-label": "What to swap" },
			chip("Agenda" + (cur ? ": " + cur.name : ""), st.what === "agenda", function () { pickWhat("agenda"); }),
			ch.blasphemies.map(function (b, i) {
				var def = R.blasphemy(b.id);
				return chip("Blasphemy: " + (def ? def.name : b.id), st.what === String(i), function () { pickWhat(String(i)); });
			}));
		var body = st.what === "agenda" ? swapAgendaBody(ch, ctx, st, cat, cur) : swapBlasphemyBody(ch, ctx, st, cat, +st.what);
		return panel(ctx, "Swap", "Pick something new to replace it with. Everything is logged so the Admin can follow along.", whatRow, body);
	}

	function swapAgendaBody(ch, ctx, st, cat, cur) {
		var list = CAIN.agendas.concat(ch.custom.agendas).filter(function (a) { return !cur || a.id !== cur.id; });
		var target = st.target ? R.agenda(st.target) : null;
		var picks = h("div", { class: "swap-grid" }, list.map(function (a) {
			var look = CAIN.agendaLook(a);
			var allowed = R.agendaAllowed(ch, a);
			return h("button", { class: "swap-pick swap-agenda " + look.class, style: look.style, type: "button", "aria-pressed": String(st.target === a.id),
				onclick: function () { st.target = a.id; st.ability = ""; ctx.save(true); } },
				CAIN.agendaIcon(a) ? h("img", { class: "ag-emblem", src: CAIN.agendaIcon(a), alt: "" }) : h("span", { class: "ag-emblem ag-emblem-blank" }),
				h("span", { class: "swap-pick-name" }, a.name),
				allowed.ok ? null : h("span", { class: "swap-pick-warn" }, allowed.reason));
		}));
		if (!target) return [h("div", { class: "label" }, "Swap to"), picks];
		var bolds = cur ? cur.items.filter(function (it) { return it.bold; }) : [];
		var open = target.abilities.filter(function (ab) { return !ch.agendaAbilities.some(function (r) { return r.agenda === target.id && r.ability === ab.id; }); });
		return [
			h("div", { class: "label" }, "Swap to"), picks,
			h("div", { class: "swap-detail" },
				h("ul", { class: "items" }, target.items.map(function (it) { return h("li", { class: it.bold ? "bold" : null }, it.text); })),
				target.note ? h("p", { class: "agenda-note" }, target.note) : null,
				bolds.length ? row(chip("Keep bolded item: " + bolds.map(function (b) { return b.text; }).join("; "), st.keepBold, function () { st.keepBold = !st.keepBold; ctx.save(true); },
					{ title: "The rules carry bolded items over when you swap" })) : null,
				ch.agendaAbilities.length ? h("p", { class: "note" }, "Your abilities stay, as the rules say. Remove any on the sheet if you're changing them.") : null,
				open.length ? [h("div", { class: "label" }, "Take an ability from " + target.name + " now (optional)"),
					h("ul", { class: "options" }, open.map(function (ab) {
						var on = st.ability === ab.id;
						return h("li", null, h("button", { class: "option", type: "button", "aria-pressed": String(on),
							onclick: function () { st.ability = on ? "" : ab.id; ctx.save(true); } },
							h("span", { class: "option-mark", "aria-hidden": "true" }),
							h("span", { class: "option-body" }, h("span", { class: "entry-name" }, ab.name), CAIN.richText(ab.text, cat))));
					}))] : null,
				st.ability && ch.advances > 0 ? row(chip("Use up 1 advance (" + ch.advances + ")", st.useAdvance, function () { st.useAdvance = !st.useAdvance; ctx.save(true); })) : null,
				h("div", { class: "btn-row" },
					btn("Swap to " + target.name, function () {
						var r = H.swapAgenda(ch, target.id, { keepBold: st.keepBold, ability: st.ability, useAdvance: st.useAdvance });
						st.target = ""; st.ability = ""; st.useAdvance = false;
						ctx.done(r);
					}),
					btn("Cancel", function () { st.target = ""; ctx.save(true); }, { ghost: true })))
		];
	}

	function swapBlasphemyBody(ch, ctx, st, cat, index) {
		var owned = ch.blasphemies[index];
		var list = CAIN.blasphemies.concat(ch.custom.blasphemies).filter(function (b) {
			return !ch.blasphemies.some(function (o) { return o.id === b.id; });
		});
		var target = st.target ? R.blasphemy(st.target) : null;
		var picks = h("div", { class: "swap-grid" }, list.map(function (b) {
			var th = CAIN.blasTheme(b);
			return h("button", { class: "swap-pick swap-blas " + th.class, style: th.style, type: "button", "aria-pressed": String(st.target === b.id),
				onclick: function () { st.target = b.id; st.powers = []; ctx.save(true); } },
				CAIN.blasPortrait(b, "blas-portrait-pick"),
				h("span", { class: "sticker blas-plate" }, b.name),
				h("span", { class: "swap-pick-sub" }, b.summary || ""));
		}));
		if (!target) return [h("div", { class: "label" }, "Swap to"), picks];
		var want = Math.max(1, owned.powers.length);
		var th = CAIN.blasTheme(target);
		return [
			h("div", { class: "label" }, "Swap to"), picks,
			h("div", { class: "swap-detail blas-pick " + th.class, style: th.style },
				h("div", { class: "passive" },
					h("div", { class: "entry-name" }, target.passive.name, h("span", { class: "tag stamp" }, "Passive")),
					CAIN.richText(target.passive.text, cat)),
				h("div", { class: "label" }, "Pick powers: " + st.powers.length + " chosen (you had " + owned.powers.length + ")"),
				h("ul", { class: "options" }, target.powers.map(function (p) {
					var on = st.powers.indexOf(p.id) >= 0;
					return h("li", null, h("button", { class: "option multi", type: "button", "aria-pressed": String(on),
						onclick: function () {
							if (on) st.powers = st.powers.filter(function (x) { return x !== p.id; }); else st.powers.push(p.id);
							ctx.save(true);
						} },
						h("span", { class: "option-mark", "aria-hidden": "true" }),
						h("span", { class: "option-body" }, CAIN.powerHead(p), CAIN.powerTags(p, cat), CAIN.richText(p.text, cat))));
				})),
				st.powers.length !== want ? h("p", { class: "note" }, "You had " + owned.powers.length + " power" + (owned.powers.length === 1 ? "" : "s") + " from it. Any number is allowed; the sheet warns if you go over 5 in total.") : null,
				h("div", { class: "btn-row" },
					btn("Swap " + (R.blasphemy(owned.id) ? R.blasphemy(owned.id).name : "it") + " for " + target.name, function () {
						var r = H.swapBlasphemy(ch, index, target.id, st.powers);
						st.target = ""; st.powers = [];
						ctx.done(r);
					}),
					btn("Cancel", function () { st.target = ""; st.powers = []; ctx.save(true); }, { ghost: true })))
		];
	}

	function stressPanel(ch, ctx) {
		var st = uiFor(ch).stress;
		var iron = H.hasPassive(ch, "iron-soul");
		function take(ironRoll) {
			var opts = { nonlethal: st.nonlethal };
			if (ironRoll !== undefined) opts.ironSoulRoll = ironRoll;
			var r = H.takeStress(ch, st.amount, opts);
			if (r.ask === "ironSoul") { st.ironAsk = true; ctx.save(true); return; }
			st.ironAsk = false;
			ctx.act(r);
		}
		return panel(ctx, "Take stress", "Fills the execution talisman with the rules applied: roll-over into injuries, max stress shrinking, brink of death and instant death. To just set the boxes, click them on the sheet.",
			st.ironAsk ? h("div", { class: "inline-ask" },
				h("p", null, h("strong", null, "This fills your talisman. "), "Use Iron Soul? Roll 1d6 at the table: on 4+ you stay at 1 under max instead of taking an injury. Then it's gone until you rest."),
				row(dieEntry("Iron Soul d6", 6, st.ironRoll, function (v) { st.ironRoll = v; ctx.save(true); })),
				h("div", { class: "btn-row" },
					btn("Use Iron Soul", function () { take(st.ironRoll); }, { small: true }),
					btn("Don't use it", function () { take(null); }, { small: true, ghost: true }),
					btn("Cancel", function () { st.ironAsk = false; ctx.save(true); }, { small: true, ghost: true }))) :
				h("div", null,
					row(stepper("Take", st.amount, 1, 20, function (v) { st.amount = v; ctx.save(true); }, { suffix: " stress" }),
						chip("Nonlethal", st.nonlethal, function () { st.nonlethal = !st.nonlethal; ctx.save(true); }, { title: "Can't fill the talisman" }),
						iron && ch.hunt.ironSoulUsed ? h("span", { class: "tag" }, "Iron Soul used until rest") : null),
					h("div", { class: "btn-row" },
						btn("Take " + st.amount + " stress", function () { take(); }),
						btn("Erase 1", function () { ctx.act(H.healStress(ch, 1)); }, { ghost: true, disabled: ch.hunt.stress === 0 }))),
			h("p", { class: "note" }, "1: pain, strain. 2-3: crippling for a human. 4+: messily fatal for a human. 7+ in one hit is instant death."));
	}

	// Works out the dice pool, then records the successes rolled at the table.
	function poolPanel(ch, ctx) {
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
		return panel(ctx, "Dice pool", "Roll at the table so the Admin sees it. Recording spends the burst or Divine Agony and stores pathos on 0 successes. On a talisman, each success is a slash.",
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
					uiFor(ch).pool = freshPool(st.skill);
					ctx.act(r);
				}, { disabled: st.burst && !st.burstSin && hu.bursts <= 0 })),
			hu.rolls.length ? h("ol", { class: "roll-history" }, hu.rolls.slice(0, 5).map(function (r) {
				return h("li", null, r.skillName + " " + r.pool + "D" + (r.extras && r.extras.length ? " (" + r.extras.join(", ") + ")" : "") + ": " + r.successes);
			})) : null,
			h("div", { class: "subrow" },
				h("span", { class: "field-label" }, "Or spend a burst outside a roll"),
				btn("Spend a burst", function () { var r = H.spendBurst(ch); if (!r.ok) ctx.flash([r.reason]); else ctx.act(r); }, { small: true, disabled: hu.bursts <= 0 }),
				dieEntry("or 1d3 sin rolled", 3, uiFor(ch).sinRoll, function (v) { uiFor(ch).sinRoll = v; ctx.save(true); }),
				btn("Take " + uiFor(ch).sinRoll + " sin", function () { ctx.act(H.spendBurst(ch, uiFor(ch).sinRoll)); }, { small: true, ghost: true })));
	}

	function restPanel(ch, ctx) {
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
						hu.hooks.map(function (hk, hi) { return chip(hk.name || "Hook " + (hi + 1), false, function () { ctx.act(H.assignRest(ch, i, { hook: hi })); }); })));
			}));
		} else {
			if (!st.restRolls || st.restRolls.length !== count) {
				st.restRolls = [];
				for (var i = 0; i < count; i++) st.restRolls.push(2);
			}
			body = h("div", null,
				h("div", { class: "stepper-row" }, st.restRolls.map(function (v, i) {
					return dieEntry("Resting d3 #" + (i + 1), 3, v, function (nv) { st.restRolls[i] = nv; ctx.save(true); });
				})),
				h("div", { class: "btn-row" }, btn("Rest with these dice", function () {
					var r = H.rest(ch, st.restRolls);
					if (!r.ok) { ctx.flash([r.reason]); return; }
					st.restRolls = null;
					ctx.act(r);
				})));
		}
		return panel(ctx, "Rest", "Resting is done as a group and raises pressure by 1. Roll " + count + "d3 at the table, enter them, then put each die on psyche bursts, stress, or a hook (the same choice twice is fine). Iron Soul and 'until rest' effects reset.", body);
	}

	function missionPanel(ch, ctx) {
		var st = uiFor(ch);
		var ms = st.mission;
		var pay = core.missionPay;
		var dep = st.deploy;
		var zeroSkills = core.skills.filter(function (s) { return ch.skills[s.id] === 0; });
		var needs = H.missionRollsNeeded(ch);
		needs.forEach(function (n) { if (!dep.rolls[n.id]) dep.rolls[n.id] = 2; });
		return panel(ctx, "Mission", null,
			h("div", { class: "subhead" }, "Mission over"),
			h("p", { class: "note" }, "Pays scrip, halves sin" + (ch.settings.clearSinAfterMission ? " (house rule: clears it)" : "") + ", adds a mission survived, and clears stress, injuries, hooks and afflictions."),
			row(h("span", { class: "chips" },
				chip("Executed +" + pay.execute, ms.outcome === "execute" && !ms.died, function () { ms.outcome = "execute"; ms.died = false; ctx.save(true); }),
				chip("Spared +" + pay.spare, ms.outcome === "spare" && !ms.died, function () { ms.outcome = "spare"; ms.died = false; ctx.save(true); }),
				chip("Failed " + pay.fail, ms.outcome === "fail" && !ms.died, function () { ms.outcome = "fail"; ms.died = false; ctx.save(true); }),
				chip("This exorcist died", ms.died, function () { ms.died = !ms.died; ctx.save(true); }))),
			row(stepper("Fallen exorcists' remains recovered", ms.bodies, 0, 20, function (v) { ms.bodies = v; ctx.save(true); }, { title: "+1 XP and +1 scrip each", small: true })),
			h("div", { class: "btn-row" }, btn(ms.died ? "Record the death" : "Close the mission", function () {
				var r = H.endMission(ch, { outcome: ms.outcome, bodies: ms.bodies, died: ms.died });
				st.mission = { outcome: "execute", bodies: 0, died: false };
				ctx.act(r);
			}, { danger: ms.died })),
			h("div", { class: "subhead" }, "New mission"),
			h("p", { class: "note" }, "Arrive fresh: no stress, injuries or hooks, " + R.derived(ch).psycheBursts + " psyche bursts and full kit points."),
			needs.map(function (n) {
				return row(dieEntry(n.name + ": " + n.dice + " rolled", 3, dep.rolls[n.id], function (v) { dep.rolls[n.id] = v; ctx.save(true); }),
					h("span", { class: "note" }, "+" + (dep.rolls[n.id] + n.plus) + " KP this mission"));
			}),
			H.hasAgendaAbility(ch, "jack") && zeroSkills.length ? row(CAIN.select("Jack!: a 0 skill counts as 1 this mission", dep.jack,
				zeroSkills.map(function (s) { return { value: s.id, label: s.name }; }), function (v) { dep.jack = v; ctx.save(true); }, { placeholder: "None" })) : null,
			h("div", { class: "btn-row" }, btn("Start a new mission", function () {
				var r = H.startMission(ch, { jackSkill: dep.jack || null, missionRolls: dep.rolls });
				if (!r.ok) { ctx.flash(["Enter the dice first."]); return; }
				st.deploy = { jack: "", rolls: {} };
				ctx.act(r);
			}, { ghost: true })));
	}

	// Kit: pull out and use what's on your list, add catalog items for free, or make
	// your own. Scrip is just a number you set.
	function kitPanel(ch, ctx) {
		var st = uiFor(ch);
		if (!st.custom) st.custom = { name: "", kp: 1, text: "", consumable: false };
		var cu = st.custom;
		var left = H.kpLeft(ch);

		var pullRows = core.defaultKit.filter(function (k) { return k.kp > 0; }).map(function (k) {
			return h("li", null, h("span", null, k.name),
				chip("Pull " + k.kp + " KP", false, function () { ctx.act(H.spendKp(ch, k.kp, k.name)); }, { disabled: left < k.kp }));
		});
		ch.purchases.forEach(function (p) {
			var item = R.purchaseItem(p);
			if (!item || item.kp === null) return;
			var consumable = item.tags.indexOf("Consumable") >= 0;
			if (consumable && st.useItem && st.useItem.id === p.item) {
				pullRows.push(h("li", { class: "use-row" }, h("span", null, item.name + ": " + item.text),
					h("span", { class: "row-tools" },
						stepper(item.use.healStress.dice + " rolled", st.useItem.roll, H.diceRange(item.use.healStress.dice).min, H.diceRange(item.use.healStress.dice).max, function (v) { st.useItem.roll = v; ctx.save(true); }, { small: true, title: "Enter the total you rolled at the table" }),
						btn("Use", function () {
							var r = H.useConsumable(ch, p.item, st.useItem.roll);
							if (!r.ok) { ctx.flash([r.reason || "Can't use that."]); return; }
							st.useItem = null;
							ctx.act(r);
						}, { small: true }),
						btn("Cancel", function () { st.useItem = null; ctx.save(true); }, { small: true, ghost: true }))));
				return;
			}
			pullRows.push(h("li", null,
				h("span", null, item.name + (p.count > 1 ? " x" + p.count : ""), item.custom ? h("span", { class: "tag" }, "Custom") : null),
				consumable
					? chip("Use " + item.kp + " KP", false, function () {
						if (item.use && item.use.healStress) { st.useItem = { id: p.item, roll: H.diceRange(item.use.healStress.dice).min }; ctx.save(true); return; }
						var r = H.useConsumable(ch, p.item);
						if (!r.ok) ctx.flash([r.reason || "Can't use that."]); else ctx.act(r);
					}, { disabled: left < item.kp })
					: chip("Pull " + item.kp + " KP", false, function () { ctx.act(H.spendKp(ch, item.kp, item.name)); }, { disabled: left < item.kp })));
		});

		var kitCat = CAIN.kitCategories.indexOf(st.kitCat) >= 0 ? st.kitCat : "Occult / Medical";
		var catChips = h("div", { class: "chips", role: "group", "aria-label": "Kit category" }, CAIN.kitCategories.map(function (c) {
			return chip(c + " (" + CAIN.kit.filter(function (k) { return k.category === c; }).length + ")", c === kitCat, function () { st.kitCat = c; ctx.save(true); });
		}));
		var catalog = CAIN.kit.filter(function (item) { return item.category === kitCat; }).map(function (item) {
			var owned = ch.purchases.filter(function (p) { return p.item === item.id; })[0];
			var consumable = item.tags.indexOf("Consumable") >= 0;
			var listed = owned && !consumable;
			return h("li", { class: "entry" },
				h("div", { class: "entry-name" }, item.name, owned ? h("span", { class: "tag" }, owned.count > 1 ? "Have x" + owned.count : "Have it") : null),
				h("div", { class: "tags" },
					item.kp !== null ? h("span", { class: "tag" }, item.kp + " KP") : h("span", { class: "tag" }, "Permanent"),
					item.tags.map(function (t) { return h("span", { class: "tag" }, t); }),
					h("span", { class: "tag" }, "Book price " + item.scrip + " scrip")),
				h("div", { class: "entry-text" }, h("p", null, item.text)),
				h("div", { class: "btn-row" }, btn(listed ? "On your list" : "Add", function () {
					var r = H.addItem(ch, item.id);
					if (!r.ok) ctx.flash([r.reason]); else ctx.act(r);
				}, { small: true, disabled: listed })));
		});

		var nameInput = h("input", { class: "input", type: "text", placeholder: "Item name", value: cu.name, "aria-label": "Custom item name" });
		nameInput.addEventListener("input", function () { cu.name = nameInput.value; });
		var textInput = h("textarea", { class: "input", rows: 2, placeholder: "What it is and what it does", value: cu.text, "aria-label": "Custom item description" });
		textInput.addEventListener("input", function () { cu.text = textInput.value; });

		return panel(ctx, "Kit (" + left + " KP left)", "Add items for free and track scrip by hand.",
			h("div", { class: "subhead" }, "Pull out or use"),
			h("ul", { class: "kit-list" }, pullRows),
			h("div", { class: "subhead" }, "Scrip"),
			row(stepper(null, ch.scrip, 0, 9999, function (v) {
				var before = ch.scrip;
				ch.scrip = v;
				ctx.act(H.note(ch, "Scrip: " + before + " -> " + v + "."));
			}, { aria: "Scrip", suffix: " scrip" })),
			h("div", { class: "subhead" }, "Create an item"),
			h("div", { class: "custom-item" },
				nameInput,
				textInput,
				row(stepper("KP to pull out", cu.kp, 0, 5, function (v) { cu.kp = v; ctx.save(true); }, { small: true }),
					chip("Consumable", cu.consumable, function () { cu.consumable = !cu.consumable; ctx.save(true); }, { title: "Used up when used; can stack" }),
					btn("Add to kit", function () {
						var r = H.addCustomItem(ch, { name: cu.name, kp: cu.kp, text: cu.text, consumable: cu.consumable });
						if (!r.ok) { ctx.flash([r.reason]); return; }
						st.custom = { name: "", kp: 1, text: "", consumable: false };
						ctx.act(r);
					}, { small: true }))),
			h("div", { class: "subhead" }, "Add from the book"),
			catChips,
			h("ul", { class: "entries kit-catalog" }, catalog));
	}

	function logPanel(ch, ctx) {
		return panel(ctx, "Log", "Everything recorded on this exorcist, newest first. Changes made by clicking the sheet are logged too, so the Admin can follow along.",
			ch.log.length ? h("ol", { class: "log-list" }, ch.log.slice(0, 40).map(function (e) {
				var d = new Date(e.t);
				var time = d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
				return h("li", null, h("span", { class: "log-time" }, time), h("span", null, e.text));
			})) : h("p", { class: "note" }, "Nothing yet."));
	}

	var actions = [
		{ id: "xp", label: "+ XP", title: "End of session: the four questions", render: xpPanel },
		{ id: "advance", label: "Spend advance", title: "Spend a banked advance", render: advancePanel, badge: function (ch) { return ch.advances || null; } },
		{ id: "ability", label: "Add ability", title: "Add an agenda ability", render: abilityPanel },
		{ id: "power", label: "Add power", title: "Add a blasphemy power", render: powerPanel },
		{ id: "swap", label: "Swap", title: "Swap your agenda or a blasphemy", render: swapPanel },
		{ id: "stress", label: "Take stress", title: "Take stress with the rules applied", render: stressPanel },
		{ id: "pool", label: "Dice pool", title: "How many dice to roll, and record the result", render: poolPanel },
		{ id: "rest", label: "Rest", title: "Rest and assign the resting dice", render: restPanel, badge: function (ch) { return ch.hunt.restDice ? "!" : null; } },
		{ id: "mission", label: "Mission", title: "Close a mission or start a new one", render: missionPanel },
		{ id: "shop", label: "Kit", title: "Pull out and use kit, add or create items, set scrip", render: kitPanel },
		{ id: "log", label: "Log", title: "Everything recorded", render: logPanel },
		// Opened from Add ability / Add power and the sheet, not shown on the bar.
		{ id: "customAgenda", hidden: true, render: function (ch, ctx) { return CAIN.customPanels.agenda(ch, ctx); } },
		{ id: "customBlasphemy", hidden: true, render: function (ch, ctx) { return CAIN.customPanels.blasphemy(ch, ctx); } }
	];

	CAIN.renderActions = function (ch, ctx) {
		var current = ch.dead ? null : actions.filter(function (a) { return a.id === ctx.panel; })[0];
		var bar = ch.dead ? null : h("nav", { class: "action-bar", "aria-label": "Sheet actions" }, actions.filter(function (a) { return !a.hidden; }).map(function (a) {
			var badge = a.badge ? a.badge(ch) : null;
			return h("button", { class: "action-btn", type: "button", title: a.title, "aria-pressed": String(ctx.panel === a.id), onclick: function () { ctx.open(a.id); } },
				a.label, badge ? h("span", { class: "badge" }, String(badge)) : null);
		}));
		return [bar, alerts(ch, ctx), current ? current.render(ch, ctx) : null];
	};
})();
