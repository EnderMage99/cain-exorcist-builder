// Registration (character creation): Concept -> Skills -> Agenda -> Blasphemy -> Kit -> Review.
// The draft autosaves to this browser on every change.
window.CAIN = window.CAIN || {};

(function () {
	var R = CAIN.rules;
	var core = CAIN.core;
	var store = CAIN.store;
	var h = CAIN.h;

	var steps = [
		{ id: "concept", name: "Concept" },
		{ id: "skills", name: "Skills" },
		{ id: "agenda", name: "Agenda" },
		{ id: "blasphemy", name: "Blasphemy" },
		{ id: "kit", name: "Kit" },
		{ id: "review", name: "Review" }
	];

	var draft = null;
	var chrome = null;

	function loadDraft() {
		draft = store.getDraft();
		if (!draft) {
			var ch = R.newCharacter();
			ch.xid = R.generateXid();
			draft = { character: ch, step: "concept" };
			store.saveDraft(draft);
		}
		if (!steps.some(function (s) { return s.id === draft.step; })) draft.step = "concept";
		return draft;
	}

	function ch() { return draft.character; }

	function problemsFor(stepId) {
		return R.validateCreation(ch()).filter(function (p) { return p.step === stepId; });
	}

	// Saves and either rebuilds the page or just refreshes the step bar and buttons.
	function changed(rerender) {
		store.saveDraft(draft);
		if (rerender) CAIN.app.render();
		else refreshChrome();
	}

	function goStep(id) {
		draft.step = id;
		store.saveDraft(draft);
		CAIN.app.render();
		window.scrollTo(0, 0);
	}

	function stepIndex() {
		return steps.findIndex(function (s) { return s.id === draft.step; });
	}

	function refreshChrome() {
		if (!chrome) return;
		steps.forEach(function (s, i) {
			var btn = chrome.stepButtons[i];
			var bad = s.id !== "review" && problemsFor(s.id).length > 0;
			btn.classList.toggle("complete", !bad && s.id !== "review");
			btn.classList.toggle("problem", bad);
		});
		if (chrome.next) chrome.next.disabled = problemsFor(draft.step).length > 0;
		if (chrome.status) {
			var p = problemsFor(draft.step);
			chrome.status.textContent = p.length ? p[0].message : "";
		}
	}

	function stepBar() {
		var buttons = steps.map(function (s, i) {
			return h("button", {
				class: "step-btn-bar", type: "button",
				"aria-current": s.id === draft.step ? "step" : null,
				onclick: function () { goStep(s.id); }
			}, h("span", { class: "step-num" }, String(i + 1)), h("span", { class: "step-name" }, s.name));
		});
		chrome.stepButtons = buttons;
		return h("nav", { class: "stepbar", "aria-label": "Creation steps" }, buttons);
	}

	function footer() {
		var i = stepIndex();
		var back = i > 0 ? h("button", { class: "btn ghost", type: "button", onclick: function () { goStep(steps[i - 1].id); } }, "Back") : h("span");
		chrome.status = h("p", { class: "step-status", role: "status" });
		chrome.next = null;
		var next;
		if (steps[i].id === "review") {
			var problems = R.validateCreation(ch());
			next = h("button", { class: "btn", type: "button", disabled: problems.length > 0, onclick: register }, "Register exorcist");
		} else {
			next = h("button", { class: "btn", type: "button", onclick: function () { goStep(steps[i + 1].id); } }, "Next: " + steps[i + 1].name);
			chrome.next = next;
		}
		return h("div", { class: "reg-foot" }, back, chrome.status, next);
	}

	function register() {
		var c = ch();
		if (R.validateCreation(c).length) return;
		c.created = Date.now();
		if (!store.save(c)) {
			chrome.status.textContent = "This browser refused to save. Check that site data is allowed.";
			return;
		}
		store.clearDraft();
		draft = null;
		location.hash = "#/c/" + c.id;
	}

	function quickExorcist() {
		CAIN.registration.quickExorcist();
		CAIN.app.render();
		window.scrollTo(0, 0);
	}

	// Steps

	function conceptStep() {
		var c = ch();
		function text(label, path, opts) {
			opts = opts || {};
			var parts = path.split(".");
			var obj = parts.length > 1 ? c[parts[0]] : c;
			var key = parts[parts.length - 1];
			var id = "w-" + path.replace(/\./g, "-");
			var input = opts.multiline
				? h("textarea", { id: id, class: "input", rows: 2, placeholder: opts.placeholder || "", value: obj[key] })
				: h("input", { id: id, class: "input", type: "text", placeholder: opts.placeholder || "", value: obj[key], autocomplete: "off" });
			input.addEventListener("input", function () { obj[key] = input.value; changed(false); });
			var reroll = opts.reroll ? h("button", { class: "mini-btn", type: "button", onclick: function () { obj[key] = opts.reroll(); input.value = obj[key]; changed(false); } }, "New") : null;
			return h("div", { class: "field" + (opts.wide ? " wide" : "") },
				h("label", { class: "field-label", for: id }, label, reroll), input);
		}
		return [
			h("section", { class: "card" },
				h("div", { class: "card-head" }, h("h2", null, "Identity"), h("span", { class: "label" }, "Affix photo firmly")),
				h("div", { class: "form-grid" },
					text("Name", "name", { placeholder: "Who are you?", wide: true }),
					text("XID", "xid", { reroll: function () { return R.generateXid(); } }),
					text("Sex", "looks.sex"),
					text("Height", "looks.height"),
					text("Weight", "looks.weight"),
					text("Hair", "looks.hair"),
					text("Eyes", "looks.eyes"))),
			h("section", { class: "card" },
				h("div", { class: "card-head" }, h("h2", null, "Questions"), h("span", { class: "label" }, "Give the answers to your Admin")),
				h("p", { class: "note" }, "Answer now or later. You can share them with the group if you like."),
				h("div", { class: "form-grid" }, core.questions.map(function (q) {
					return text(q.text, "questions." + q.id, { multiline: true, wide: true });
				})))
		];
	}

	function skillsStep() {
		var c = ch();
		var counts = R.creationCounts(c);
		var rows = core.skills.map(function (s) {
			var v = c.skills[s.id];
			var options = [0, 1, 2].map(function (n) {
				var blocked = (n === 2 && v !== 2 && counts.raised >= core.creation.raise) ||
					(n === 0 && v !== 0 && counts.lowered >= core.creation.lower);
				return h("button", {
					class: "seg", type: "button", "aria-pressed": String(v === n), disabled: blocked,
					"aria-label": s.name + " " + n,
					onclick: function () { c.skills[s.id] = n; changed(true); }
				}, String(n));
			});
			return h("li", { class: "skill-pick" },
				h("div", { class: "skill-pick-text" },
					h("div", { class: "entry-name" }, s.name),
					h("div", { class: "note skill-long" }, s.text),
					h("div", { class: "note skill-brief" }, s.short)),
				h("div", { class: "segs", role: "group", "aria-label": s.name }, options));
		});
		return h("section", { class: "card" },
			h("div", { class: "card-head" }, h("h2", null, "Skills"), h("span", { class: "label" }, "All start at 1")),
			h("div", { class: "counters" },
				h("span", { class: "counter" + (counts.raised === core.creation.raise ? " done" : "") }, "Raised to 2: " + counts.raised + " / " + core.creation.raise),
				h("span", { class: "counter" + (counts.lowered === core.creation.lower ? " done" : "") }, "Lowered to 0: " + counts.lowered + " / " + core.creation.lower),
				h("button", { class: "mini-btn", type: "button", onclick: function () {
					core.skills.forEach(function (s) { c.skills[s.id] = core.creation.start; });
					changed(true);
				} }, "Reset")),
			h("p", { class: "note" }, "Each point is a die you roll when the skill fits your action. Pick what your exorcist is good and bad at."),
			h("ul", { class: "skill-picks" }, rows));
	}

	function agendaStep() {
		var c = ch();
		var cat = R.derived(c).cat;
		var chosen = c.agendaAbilities[0];
		return h("div", null,
			h("p", { class: "lede" }, "Your agenda is how your exorcist approaches problems. Following its items earns XP. Pick one ability to start."),
			h("div", { class: "grid" }, CAIN.agendas.map(function (a) {
				var allowed = R.agendaAllowed(c, a);
				var selected = c.agenda === a.id;
				var look = CAIN.agendaLook(a);
				return h("article", { class: "card pick-card " + look.class + (selected ? " selected" : "") + (allowed.ok ? "" : " locked"), style: look.style },
					CAIN.agendaHead(a, selected ? h("span", { class: "tag stamp ag-picked" }, "Selected") : null),
					allowed.ok ? null : h("p", { class: "tag stamp" }, allowed.reason),
					a.items.length === 0 ? null : h("div", { class: "ag-items" }, h("span", { class: "ag-label" }, "Items:"),
						h("ul", { class: "items" }, a.items.map(function (it) { return h("li", { class: it.bold ? "bold" : null }, it.text); }))),
					h("div", { class: "ag-label" }, "Choose 1 ability:"),
					h("ul", { class: "options" }, a.abilities.map(function (ab) {
						var on = !!chosen && chosen.agenda === a.id && chosen.ability === ab.id;
						return h("li", null, h("button", {
							class: "option", type: "button", "aria-pressed": String(on), disabled: !allowed.ok,
							onclick: function () {
								c.agenda = a.id;
								c.agendaAbilities = [{ agenda: a.id, ability: ab.id }];
								changed(true);
							}
						}, h("span", { class: "option-mark", "aria-hidden": "true" }),
							h("span", { class: "option-body" }, h("span", { class: "entry-name" }, ab.name), CAIN.richText(ab.text, cat))));
					})),
					a.note ? h("p", { class: "agenda-note" }, a.note) : null,
					CAIN.agendaFoot());
			})));
	}

	function blasphemyStep() {
		var c = ch();
		var cat = R.derived(c).cat;
		var owned = c.blasphemies[0];
		return h("div", null,
			h("p", { class: "lede" }, "Your blasphemy is your psychic power. You get its passive and pick two powers. Values in purple are worked out for your CAT (" + cat + ")."),
			h("div", { class: "grid" }, CAIN.blasphemies.map(function (b) {
				var selected = !!owned && owned.id === b.id;
				var count = selected ? owned.powers.length : 0;
				var th = CAIN.blasTheme(b);
				return h("article", { class: "card pick-card blas-card " + th.class + (selected ? " selected" : ""), style: th.style },
					h("div", { class: "card-head" }, h("h2", { class: "blas-title" }, b.name), h("span", { class: "label" }, selected ? count + " / 2 powers" : "Blasphemy " + b.numeral)),
					h("p", { class: "note" }, b.summary),
					h("div", { class: "passive" },
						h("div", { class: "entry-name" }, b.passive.name, h("span", { class: "tag stamp" }, "Passive")),
						CAIN.richText(b.passive.text, cat)),
					h("div", { class: "label" }, "Choose 2 powers"),
					h("ul", { class: "options" }, b.powers.map(function (p) {
						var on = selected && owned.powers.indexOf(p.id) >= 0;
						var full = selected && count >= 2 && !on;
						return h("li", null, h("button", {
							class: "option multi", type: "button", "aria-pressed": String(on), disabled: full,
							title: full ? "Two powers chosen. Untick one first." : null,
							onclick: function () {
								if (!selected) c.blasphemies = [{ id: b.id, powers: [p.id] }];
								else if (on) owned.powers = owned.powers.filter(function (x) { return x !== p.id; });
								else owned.powers.push(p.id);
								changed(true);
							}
						}, h("span", { class: "option-mark", "aria-hidden": "true" }),
							h("span", { class: "option-body" },
								CAIN.powerHead(p),
								CAIN.powerTags(p, cat),
								CAIN.richText(p.text, cat))));
					})));
			})),
			h("section", { class: "card", style: "margin-top:16px" },
				h("div", { class: "card-head" }, h("h2", null, "Blast"), h("span", { class: "label" }, "Every exorcist has this")),
				CAIN.richText(CAIN.blast.text, cat)));
	}

	function kitStep() {
		var c = ch();
		var d = R.derived(c);
		var input = h("textarea", { id: "w-weapons", class: "input", rows: 3, placeholder: "A revolver and a hatchet, a sword cane, brass knuckles...", value: c.weaponLook });
		input.addEventListener("input", function () { c.weaponLook = input.value; changed(false); });
		var bonus = d.kitPoints - core.base.kitPoints;
		return h("section", { class: "card" },
			h("div", { class: "card-head" }, h("h2", null, "Registered kit"), h("span", { class: "label" }, d.kitPoints + " kit points")),
			h("p", { class: "note" }, "You don't pack in advance. During a mission, spend kit points to pull out anything on your list." +
				(bonus > 0 ? " Your blasphemy gives you +" + bonus + " KP." : "")),
			h("ul", { class: "kit-list" }, core.defaultKit.map(function (k) {
				return h("li", null, h("span", null, k.name), h("span", { class: "label" }, k.kp + " KP"));
			})),
			h("div", { class: "field wide" },
				h("label", { class: "field-label", for: "w-weapons" }, "What do your service weapons look like?"),
				input),
			h("p", { class: "note" }, "Service weapons start at CAT 0. Scrip earned on missions buys upgrades and more kit."));
	}

	function reviewStep() {
		var c = ch();
		var problems = R.validateCreation(c);
		return h("div", null,
			problems.length ? h("div", { class: "card warn" },
				h("div", { class: "label" }, "Not ready yet"),
				h("ul", { class: "plain-list" }, problems.map(function (p) {
					return h("li", null, h("button", { class: "link-btn", type: "button", onclick: function () { goStep(p.step); } }, p.message));
				})))
				: h("p", { class: "lede" }, "Everything checks out. Register your exorcist to save them to this browser."),
			CAIN.renderSheet(c, { editable: false }));
	}

	var renderers = {
		concept: conceptStep,
		skills: skillsStep,
		agenda: agendaStep,
		blasphemy: blasphemyStep,
		kit: kitStep,
		review: reviewStep
	};

	CAIN.screens.registration = {
		id: "registry",
		render: function () {
			loadDraft();
			chrome = {};
			var step = steps[stepIndex()];
			var out = [
				h("div", { class: "page-head" },
					h("div", null,
						h("div", { class: "kicker" }, "New registration, step " + (stepIndex() + 1) + " of " + steps.length),
						h("h1", null, step.name)),
					h("div", { class: "head-actions" },
						h("button", { class: "btn ghost", type: "button", onclick: quickExorcist, title: "Roll a random legal exorcist and jump to review" }, "Quick exorcist"),
						h("button", { class: "btn ghost", type: "button", onclick: function (e) {
							var btn = e.currentTarget;
							if (!btn.classList.contains("confirming")) {
								btn.classList.add("confirming");
								btn.textContent = "Really start over?";
								return;
							}
							store.clearDraft();
							draft = null;
							CAIN.app.render();
						} }, "Start over"))),
				stepBar(),
				h("div", { class: "reg-body" }, renderers[step.id]()),
				footer()
			];
			refreshChrome();
			return out;
		}
	};

	// Used by the registry's Quick exorcist button.
	CAIN.registration = {
		quickExorcist: function () {
			store.saveDraft({ character: R.randomCharacter(), step: "review" });
		}
	};
})();
