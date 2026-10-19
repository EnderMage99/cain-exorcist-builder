// The exorcist sheet, laid out in the official sheet's sections. Used read-only by
// registration's review step and editable on the character screen.
window.CAIN = window.CAIN || {};

(function () {
	var R = CAIN.rules;
	var core = CAIN.core;
	var h = CAIN.h;
	var term = CAIN.term;

	// Row of bubbles. opts: { crossed: n (last n crossed out), shape: "box" | "circle" | "star" }.
	function bubbles(filled, total, opts) {
		opts = opts || {};
		var out = [];
		for (var i = 0; i < total; i++) {
			var cls = "pip " + (opts.shape || "circle");
			if (i < filled) cls += " filled";
			if (opts.crossed && i >= total - opts.crossed) cls += " crossed";
			if (opts.extraFrom !== undefined && i >= opts.extraFrom) cls += " extra";
			out.push(h("span", { class: cls, "aria-hidden": "true" }));
		}
		return h("span", { class: "pips", role: "img", "aria-label": (opts.label || "") + " " + filled + " of " + total }, out);
	}

	function section(cls, title, label) {
		var head = h("div", { class: "card-head" }, h("h2", { class: title.goth ? "goth" : null }, title.text || title), label ? h("span", { class: "label" }, label) : null);
		var card = h("section", { class: "card sheet-" + cls }, head);
		for (var i = 3; i < arguments.length; i++) CAIN.append(card, arguments[i]);
		return card;
	}

	// Sheet context: the character, whether it can be edited, and how to report changes.
	function Sheet(ch, opts) {
		this.ch = ch;
		this.editable = !!opts.editable;
		this.onChange = opts.onChange || function () {};
		this.d = R.derived(ch);
	}

	// Text field bound to a path like "looks.hair".
	Sheet.prototype.field = function (label, path, opts) {
		opts = opts || {};
		var self = this;
		var parts = path.split(".");
		var obj = this.ch;
		for (var i = 0; i < parts.length - 1; i++) obj = obj[parts[i]];
		var key = parts[parts.length - 1];
		var value = obj[key] || "";
		var id = "f-" + path.replace(/\./g, "-");
		var labelEl = label ? h("label", { class: "field-label", for: this.editable ? id : null }, label) : null;
		if (!this.editable) {
			return h("div", { class: "field" + (opts.wide ? " wide" : "") }, labelEl,
				h("div", { class: "field-value" + (value ? "" : " empty") }, value || opts.empty || "-"));
		}
		var input = opts.multiline
			? h("textarea", { id: id, class: "input", rows: opts.rows || 2, placeholder: opts.placeholder || "", value: value })
			: h("input", { id: id, class: "input", type: "text", placeholder: opts.placeholder || "", value: value, autocomplete: "off" });
		input.addEventListener("input", function () {
			obj[key] = input.value;
			self.onChange(false);
		});
		return h("div", { class: "field" + (opts.wide ? " wide" : "") }, labelEl, input);
	};

	// Number with - and + buttons, bound to a top-level character key.
	Sheet.prototype.stepper = function (label, key, min, max, opts) {
		opts = opts || {};
		var self = this;
		var value = this.ch[key];
		if (!this.editable) return h("div", { class: "stepper" }, h("span", { class: "field-label" }, label), h("span", { class: "stepper-value" }, String(value) + (opts.suffix || "")));
		return CAIN.stepper(label, value, min, max, function (v) { self.ch[key] = v; self.onChange(true); }, opts);
	};

	Sheet.prototype.idCard = function () {
		var ch = this.ch;
		var a = ch.agenda ? R.agenda(ch.agenda) : null;
		var blas = ch.blasphemies.map(function (b) { var x = R.blasphemy(b.id); return x ? x.name : b.id; }).join(", ");
		return h("section", { class: "card sheet-id" },
			h("div", { class: "id-head" },
				h("span", { class: "id-title" }, "Registered exorcist"),
				h("span", { class: "cat-badge", title: "Category " + this.d.cat }, h("span", { class: "label" }, "CAT"), String(this.d.cat))),
			h("div", { class: "id-body" },
				this.field("Name", "name", { placeholder: "Name", wide: true }),
				this.field("XID", "xid", { placeholder: "XX-0000" }),
				h("div", { class: "field" }, h("span", { class: "field-label" }, "Agnd"), h("div", { class: "field-value" }, a ? a.name : "-")),
				h("div", { class: "field wide" }, h("span", { class: "field-label" }, "Blsph"), h("div", { class: "field-value" }, blas || "-")),
				h("div", { class: "looks" },
					this.field("Sx", "looks.sex"),
					this.field("Ht", "looks.height"),
					this.field("Wt", "looks.weight"),
					this.field("Hair", "looks.hair"),
					this.field("Eyes", "looks.eyes"))),
			h("div", { class: "id-foot" }, h("span", null, "CASTLE"), h("span", null, "As above, so below")));
	};

	Sheet.prototype.skills = function () {
		var self = this;
		var ch = this.ch;
		var d = this.d;
		var rows = core.skills.map(function (s) {
			var base = ch.skills[s.id];
			var dice = d.skillDice[s.id];
			var control = self.editable
				? CAIN.stepper(null, base, 0, core.skillMax, function (v) { ch.skills[s.id] = v; self.onChange(true); }, { small: true, aria: s.name })
				: bubbles(dice, Math.max(core.skillMax, dice), { label: s.name, extraFrom: dice > core.skillMax ? core.skillMax : undefined });
			return h("li", { class: "skill-row", title: s.text },
				h("span", { class: "skill-name" }, s.name),
				h("span", { class: "skill-short" }, s.short),
				control,
				h("span", { class: "skill-dice" }, dice + "D", dice !== base ? h("span", { class: "label" }, " +" + (dice - base)) : null));
		});
		return section("skills", "Registered skills", "TM standard 00398",
			h("ul", { class: "skill-list" }, rows),
			h("div", { class: "subrow" },
				this.editable
					? this.stepper("Improvements used", "skillImprovements", 0, 99)
					: [h("span", { class: "field-label" }, "Improvements"), bubbles(ch.skillImprovements, core.skillImprovementLimit, { label: "Improvements" })]),
			h("p", { class: "note" }, "Spend 1 advance to improve a skill. Two skills at 3 max."));
	};

	Sheet.prototype.health = function () {
		var ch = this.ch;
		var d = this.d;
		var hunt = ch.hunt;
		var lost = d.stressCapacity - d.maxStress;
		var hooks = hunt.hooks.length
			? h("ul", { class: "hook-list" }, hunt.hooks.map(function (hk) {
				return h("li", null, h("span", null, hk.name), bubbles(hk.slashes, core.base.hookLength, { shape: "box", label: hk.name }));
			}))
			: h("p", { class: "note" }, "None.");
		var afflictions = hunt.afflictions.length
			? h("ul", { class: "plain-list" }, hunt.afflictions.map(function (a) { return h("li", null, a); }))
			: h("p", { class: "note" }, "None.");
		return section("health", { text: "Execution", goth: true }, "Health evaluation form",
			h("div", { class: "subrow" },
				h("span", { class: "field-label" }, term("Stress"), " " + hunt.stress + " / " + d.maxStress),
				bubbles(hunt.stress, d.stressCapacity, { shape: "box", crossed: lost, label: "Stress" })),
			h("p", { class: "note" }, "Starts at " + d.stressCapacity + ". -1 per injury. If filled, gain an injury and roll over the rest."),
			h("div", { class: "subrow" },
				h("span", { class: "field-label" }, term("Injuries", "injury")),
				bubbles(hunt.injuries, d.maxInjuries, { label: "Injuries" })),
			h("div", { class: "subhead" }, term("Hooks", "hook")), hooks,
			h("div", { class: "subhead" }, term("Afflictions", "affliction")), afflictions,
			h("div", { class: "subrow" },
				h("span", { class: "field-label" }, term("Pathos")),
				bubbles(hunt.pathos, core.base.pathosMax, { shape: "star", label: "Pathos" })),
			h("p", { class: "note" }, "Tracked live on the Play tab."));
	};

	Sheet.prototype.category = function () {
		var d = this.d;
		var tiers = core.catThresholds.map(function (missions, i) {
			var cat = i + 1;
			return h("li", { class: "cat-tier" + (cat === d.cat ? " current" : "") + (cat < d.cat ? " passed" : "") },
				h("span", { class: "cat-tri" }, ["I", "II", "III", "IV", "V"][i]),
				h("span", { class: "label" }, missions + " missions"));
		});
		return section("cat", "Category", "CAT rating system",
			h("ol", { class: "cat-tiers" }, tiers),
			this.stepper("Missions survived", "missionsSurvived", 0, 99),
			h("p", { class: "note" }, d.nextCatAt === null ? "Highest rating." : "Next CAT at " + d.nextCatAt + " missions survived."),
			h("div", { class: "stat-row" },
				h("div", { class: "stat" }, h("span", { class: "stat-num goth" }, String(d.psyche)), h("span", { class: "label" }, term("PSYCHE", "psyche"), " dice")),
				h("div", { class: "stat" }, bubbles(d.psycheBursts, d.psycheBursts, { label: "Psyche bursts" }), h("span", { class: "label" }, term("Psyche burst"), " per hunt"))),
			h("p", { class: "note" }, "Use your powers or gain +1D, then mark one, or gain 1d3 sin instead."));
	};

	// "Add" row for the build editor: a dropdown and a button that adds the choice.
	Sheet.prototype.addRow = function (label, options, onAdd) {
		var picked = "";
		var sel = CAIN.select(null, "", options, function (v) { picked = v; }, { placeholder: label, aria: label });
		return h("div", { class: "add-row" }, sel,
			h("button", { class: "btn small", type: "button", onclick: function () { if (picked) onAdd(picked); } }, "Add"));
	};

	function removeBtn(what, fn) {
		return h("button", { class: "mini-btn", type: "button", "aria-label": "Remove " + what, onclick: fn }, "Remove");
	}

	Sheet.prototype.kit = function () {
		var self = this;
		var ch = this.ch;
		var d = this.d;
		var items = core.defaultKit.map(function (k) {
			var name = k.id === "service-weapons" ? k.name + " (CAT " + ch.weaponCat + ")" : k.name;
			return h("li", null, h("span", null, name), h("span", { class: "label" }, k.kp + " KP"));
		});
		ch.purchases.forEach(function (p, i) {
			var item = R.kitItem(p.item);
			if (!item) return;
			var consumable = item.tags.indexOf("Consumable") >= 0;
			items.push(h("li", null,
				h("span", null, item.name + (!self.editable && p.count > 1 ? " x" + p.count : "")),
				self.editable
					? h("span", { class: "row-tools" },
						consumable ? CAIN.stepper(null, p.count, 1, 99, function (v) { p.count = v; self.onChange(true); }, { small: true, aria: item.name + " count" }) : null,
						removeBtn(item.name, function () { ch.purchases.splice(i, 1); self.onChange(true); }))
					: h("span", { class: "label" }, item.kp === null ? "Permanent" : item.kp + " KP")));
		});
		var addable = CAIN.kit.filter(function (item) {
			return item.tags.indexOf("Consumable") >= 0 || !ch.purchases.some(function (p) { return p.item === item.id; });
		}).map(function (item) { return { value: item.id, label: item.name + " (" + item.scrip + " scrip)" }; });
		return section("kit", "Registered kit", null,
			h("div", { class: "subrow" },
				h("span", { class: "field-label" }, term("Kit points"), " " + d.kitPoints),
				bubbles(d.kitPoints, d.kitPoints, { label: "Kit points" })),
			h("ul", { class: "kit-list" }, items),
			this.editable && addable.length ? this.addRow("Add a kit item (no scrip spent)", addable, function (id) {
				var owned = ch.purchases.filter(function (p) { return p.item === id; })[0];
				if (owned) owned.count += 1; else ch.purchases.push({ item: id, count: 1 });
				self.onChange(true);
			}) : null,
			this.field("Service weapons look", "weaponLook", { multiline: true, placeholder: "Describe your service weapons", wide: true }),
			h("div", { class: "stepper-row" },
				this.stepper("Weapon CAT", "weaponCat", 0, core.catMax),
				this.stepper("Scrip", "scrip", 0, 999)),
			h("p", { class: "note" }, "Paid out per mission (5: success, 3: spare, -1: failure, +3 advance). Buy kit in Between missions."));
	};

	Sheet.prototype.sin = function () {
		var self = this;
		var ch = this.ch;
		var d = this.d;
		var boxes = d.sinCap + (ch.blasphemies.length - 1 > 0 ? ch.blasphemies.length - 1 : 0) + ch.sinBoxesCrossed;
		var crossed = boxes - d.sinCap;
		var marks = ch.sinMarks.length
			? h("ul", { class: "entries" }, ch.sinMarks.map(function (owned, mi) {
				var m = R.sinMark(owned.mark);
				return h("li", { class: "entry" },
					h("div", { class: "entry-name goth-name" }, m ? m.name : owned.mark,
						self.editable ? removeBtn("the whole mark", function () { ch.sinMarks.splice(mi, 1); self.onChange(true); }) : null),
					owned.abilities.map(function (a, ai) {
						var ab = R.sinMarkAbility(owned.mark, a.roll);
						if (!ab) return null;
						if (!self.editable) return CAIN.richText(ab.text + (a.skill ? " (chosen: " + a.skill + ")" : ""), d.cat);
						return h("div", { class: "mark-ability" },
							h("span", { class: "label" }, "d6: " + a.roll),
							CAIN.richText(ab.text, d.cat),
							h("span", { class: "row-tools" },
								ab.skillBonus ? CAIN.select(null, a.skill, ab.skillBonus.choose.map(function (s) { return { value: s, label: s }; }), function (v) { a.skill = v; self.onChange(true); }, { aria: "Skill for this mark" }) : null,
								removeBtn("this ability", function () {
									owned.abilities.splice(ai, 1);
									if (!owned.abilities.length) ch.sinMarks.splice(mi, 1);
									self.onChange(true);
								})));
					}));
			}))
			: h("p", { class: "note" }, "None. Sin marks come from resisting sin overflow.");
		var markAdd = null;
		if (this.editable) {
			var options = [];
			CAIN.sinMarks.forEach(function (m) {
				var have = ch.sinMarks.filter(function (o) { return o.mark === m.id; })[0];
				var faces = have ? have.abilities.map(function (a) { return a.roll; }) : [];
				m.abilities.forEach(function (ab) {
					if (faces.indexOf(ab.roll) < 0) options.push({ value: m.id + ":" + ab.roll, label: m.name + " " + ab.roll + ": " + ab.text.slice(0, 48) + (ab.text.length > 48 ? "..." : "") });
				});
			});
			markAdd = options.length ? this.addRow("Add a sin mark ability", options, function (v) {
				var parts = v.split(":");
				var events = [];
				CAIN.hunt.gainSinMark(ch, parts[0], parseInt(parts[1], 10), events);
				self.onChange(true);
			}) : null;
		}
		return section("sin", { text: "Sin", goth: true }, "Do not let it build up",
			h("div", { class: "subrow" },
				h("span", { class: "field-label" }, term("Sin"), " " + ch.sin + " / " + d.sinCap),
				bubbles(ch.sin, boxes, { shape: "blot", crossed: crossed, label: "Sin" })),
			h("div", { class: "stepper-row" },
				this.stepper("Sin", "sin", 0, 99),
				this.stepper("Boxes crossed", "sinBoxesCrossed", 0, 20)),
			h("p", { class: "note" }, "Reaching the cap means ", term("sin overflow"), " at the end of the scene."),
			h("div", { class: "subhead" }, term("Sin marks", "sin mark")), marks, markAdd);
	};

	Sheet.prototype.advancement = function () {
		var ch = this.ch;
		var d = this.d;
		return section("advancement", "//Advancement", null,
			h("div", { class: "subrow" },
				h("span", { class: "field-label" }, "XP " + ch.xp + " / " + d.xpToAdvance),
				bubbles(ch.xp, d.xpToAdvance, { label: "XP", extraFrom: core.base.xpToAdvance })),
			h("div", { class: "stepper-row" },
				this.stepper("XP", "xp", 0, 99),
				this.stepper("Advances banked", "advances", 0, 99)),
			h("p", { class: "note" }, "At the end of each session, answer each question, then mark XP. Cash an ", term("advance"), " each time this fills."),
			h("ul", { class: "plain-list" }, core.xpQuestions.map(function (q) { return h("li", null, q.text); })));
	};

	Sheet.prototype.agenda = function () {
		var self = this;
		var ch = this.ch;
		var d = this.d;
		var a = ch.agenda ? R.agenda(ch.agenda) : null;
		var abilities = ch.agendaAbilities.map(function (ref, i) {
			var ab = R.agendaAbility(ref);
			if (!ab) return null;
			var from = ref.agenda !== ch.agenda ? " (from " + R.agenda(ref.agenda).name + ")" : "";
			return h("li", { class: "entry" },
				h("div", { class: "entry-name" }, ab.name + from,
					self.editable ? removeBtn(ab.name, function () { ch.agendaAbilities.splice(i, 1); self.onChange(true); }) : null),
				CAIN.richText(ab.text, d.cat));
		});
		var editTools = null;
		if (this.editable) {
			var addOptions = CAIN.agendas.map(function (ag) {
				return { group: ag.name, options: ag.abilities.filter(function (ab) {
					return !ch.agendaAbilities.some(function (r) { return r.agenda === ag.id && r.ability === ab.id; });
				}).map(function (ab) { return { value: ag.id + ":" + ab.id, label: ab.name }; }) };
			}).filter(function (g) { return g.options.length; });
			var boldInput = h("input", { class: "input", type: "text", placeholder: "Bolded item carried from an old agenda" });
			editTools = h("div", { class: "edit-tools" },
				CAIN.select("Current agenda", ch.agenda || "", CAIN.agendas.map(function (ag) { return { value: ag.id, label: ag.name }; }),
					function (v) { ch.agenda = v || null; self.onChange(true); }, { placeholder: "None" }),
				addOptions.length ? this.addRow("Add an agenda ability", addOptions, function (v) {
					var parts = v.split(":");
					ch.agendaAbilities.push({ agenda: parts[0], ability: parts[1] });
					self.onChange(true);
				}) : null,
				h("div", { class: "add-row" }, boldInput, h("button", { class: "btn small", type: "button", onclick: function () {
					var t = boldInput.value.trim();
					if (!t) return;
					ch.boldItems.push(t);
					self.onChange(true);
				} }, "Add")));
		}
		return section("agenda", "Agenda", a ? a.name : "None",
			a ? [h("div", { class: "label" }, "Agenda items"),
				h("ul", { class: "items" }, a.items.map(function (it) { return h("li", { class: it.bold ? "bold" : null }, it.text); }),
					ch.boldItems.map(function (t, i) {
						return h("li", { class: "bold" }, t, self.editable ? removeBtn(t, function () { ch.boldItems.splice(i, 1); self.onChange(true); }) : null);
					}))] : null,
			h("div", { class: "label" }, "Agenda abilities " + ch.agendaAbilities.length + " / 5"),
			h("ul", { class: "entries" }, abilities),
			editTools);
	};

	Sheet.prototype.blasphemies = function () {
		var self = this;
		var ch = this.ch;
		var d = this.d;
		var total = ch.blasphemies.reduce(function (n, b) { return n + b.powers.length; }, 0);
		var blocks = ch.blasphemies.map(function (owned, bi) {
			var b = R.blasphemy(owned.id);
			if (!b) return null;
			var open = b.powers.filter(function (p) { return owned.powers.indexOf(p.id) < 0; });
			return h("div", { class: "blas-block" },
				h("h3", { class: "blas-name" }, b.name, h("span", { class: "label" }, " Blasphemy " + b.numeral),
					self.editable ? removeBtn(b.name, function () { ch.blasphemies.splice(bi, 1); self.onChange(true); }) : null),
				h("div", { class: "passive" },
					h("div", { class: "entry-name" }, b.passive.name, h("span", { class: "tag stamp" }, "Passive")),
					CAIN.richText(b.passive.text, d.cat)),
				h("ul", { class: "entries" }, owned.powers.map(function (pid, pi) {
					var p = R.power(b.id, pid);
					if (!p) return null;
					var tags = [p.tags.duration, p.tags.effect, p.tags.range].filter(Boolean);
					return h("li", { class: "entry" },
						h("div", { class: "entry-name" }, p.name,
							self.editable ? removeBtn(p.name, function () { owned.powers.splice(pi, 1); self.onChange(true); }) : null),
						h("div", { class: "tags" },
							tags.map(function (t) { return h("span", { class: "tag" }, CAIN.inlineText(t, d.cat)); }),
							h("span", { class: "tag burst" }, CAIN.burstLabels[p.burst])),
						CAIN.richText(p.text, d.cat));
				})),
				self.editable && open.length ? self.addRow("Add a " + b.name + " power", open.map(function (p) { return { value: p.id, label: p.name }; }), function (pid) {
					owned.powers.push(pid);
					self.onChange(true);
				}) : null);
		});
		var unowned = CAIN.blasphemies.filter(function (b) { return !ch.blasphemies.some(function (o) { return o.id === b.id; }); });
		var blast = CAIN.blast;
		return section("blasphemy", "Blasphemy", "Observed powers " + total + " / 5",
			blocks,
			this.editable && unowned.length ? h("div", { class: "edit-tools" }, this.addRow("Add a blasphemy (passive only; add powers after)", unowned.map(function (b) { return { value: b.id, label: b.name }; }), function (id) {
				ch.blasphemies.push({ id: id, powers: [] });
				self.onChange(true);
			})) : null,
			h("div", { class: "passive blast" },
				h("div", { class: "entry-name" }, blast.name, h("span", { class: "tag burst" }, CAIN.burstLabels[blast.burst])),
				CAIN.richText(blast.text, d.cat)));
	};

	Sheet.prototype.background = function () {
		var self = this;
		return section("background", "Background", "Character questions",
			core.questions.map(function (q) {
				return self.field(q.text, "questions." + q.id, { multiline: true, rows: 2, wide: true, empty: "Unanswered." });
			}),
			this.field("Notes", "notes", { multiline: true, rows: 4, wide: true, placeholder: "Anything else worth keeping", empty: "No notes." }));
	};

	Sheet.prototype.houseRules = function () {
		var self = this;
		var ch = this.ch;
		var s = ch.settings;
		if (!this.editable) return null;
		function chip(label, active, fn) {
			return h("button", { class: "chip", type: "button", "aria-pressed": String(active), onclick: fn }, label);
		}
		return section("rules", "House rules", "Optional",
			h("p", { class: "note" }, "Tuning the book suggests if sin feels too punishing. Agree these with your Admin."),
			h("div", { class: "subrow" }, h("span", { class: "field-label" }, "Psyche bursts per hunt"),
				h("span", { class: "chips" }, [3, 4].map(function (n) {
					return chip(String(n), s.psycheBursts === n, function () { s.psycheBursts = n; self.onChange(true); });
				}))),
			h("div", { class: "subrow" }, h("span", { class: "field-label" }, "Sin cap bonus"),
				h("span", { class: "chips" }, [0, 1, 2, 3].map(function (n) {
					return chip("+" + n, s.sinCapBonus === n, function () { s.sinCapBonus = n; self.onChange(true); });
				}))),
			h("div", { class: "subrow" }, h("span", { class: "field-label" }, "After a mission, sin is"),
				h("span", { class: "chips" },
					chip("Halved", !s.clearSinAfterMission, function () { s.clearSinAfterMission = false; self.onChange(true); }),
					chip("Cleared", s.clearSinAfterMission, function () { s.clearSinAfterMission = true; self.onChange(true); }))));
	};

	// Builds the full sheet. opts: { editable, onChange(rerender) }.
	CAIN.renderSheet = function (ch, opts) {
		var s = new Sheet(ch, opts || {});
		var problems = R.validateCharacter(ch);
		return h("div", { class: "sheet" },
			problems.length ? h("div", { class: "card warn" },
				h("div", { class: "label" }, "Sheet check"),
				h("ul", { class: "plain-list" }, problems.map(function (p) { return h("li", null, p.message); }))) : null,
			h("div", { class: "sheet-cols" },
				h("div", { class: "sheet-col" }, s.idCard(), s.skills(), s.category(), s.advancement()),
				h("div", { class: "sheet-col" }, s.health(), s.kit(), s.sin())),
			h("div", { class: "sheet-cols" },
				h("div", { class: "sheet-col" }, s.agenda()),
				h("div", { class: "sheet-col" }, s.blasphemies())),
			h("div", { class: "sheet-cols" },
				h("div", { class: "sheet-col" }, s.background()),
				h("div", { class: "sheet-col" }, s.houseRules())));
	};

	CAIN.bubbles = bubbles;

	function fileName(ch) {
		var base = (ch.name || "exorcist").replace(/[^A-Za-z0-9 _-]+/g, "").trim().replace(/\s+/g, "-") || "exorcist";
		return base + ".cain.json";
	}

	function duplicate(ch) {
		var copy = JSON.parse(JSON.stringify(ch));
		copy.id = R.newCharacter().id;
		copy.name = (ch.name || "Unnamed") + " (copy)";
		CAIN.store.save(copy);
		return copy;
	}

	var modes = [
		{ id: "sheet", name: "Sheet" },
		{ id: "play", name: "Play" },
		{ id: "between", name: "Between missions" }
	];

	// Events from the last action, shown once at the top of the next render.
	var flash = null;

	// Character screen: #/c/<id>, #/c/<id>/play, #/c/<id>/between
	CAIN.screens.sheet = {
		id: "registry",
		render: function (id, mode) {
			var ch = CAIN.store.get(id);
			if (!ch) {
				return h("div", { class: "card empty" },
					h("h2", null, "No such file"),
					h("p", null, "That exorcist isn't registered in this browser."),
					h("a", { class: "btn", href: "#/" }, "Back to the registry"));
			}
			CAIN.hunt.normalize(ch);
			if (!modes.some(function (m) { return m.id === mode; })) mode = "sheet";
			var shown = flash && flash.id === ch.id ? flash.events : null;
			flash = null;
			var ctx = {
				save: function (rerender) { CAIN.store.save(ch); if (rerender) CAIN.app.render(); },
				act: function (result) {
					flash = { id: ch.id, events: (result && result.events) || [] };
					CAIN.store.save(ch);
					CAIN.app.render();
				},
				flash: function (events) { flash = { id: ch.id, events: events }; CAIN.app.render(); }
			};
			var tabs = h("nav", { class: "tabs mode-tabs", "aria-label": "Character views" }, modes.map(function (m) {
				return h("a", { class: "tab", href: "#/c/" + encodeURIComponent(ch.id) + (m.id === "sheet" ? "" : "/" + m.id), "aria-current": m.id === mode ? "page" : null }, m.name);
			}));
			var head = h("div", { class: "page-head" },
				h("div", null,
					h("div", { class: "kicker" }, "Exorcist file " + (ch.xid || "") + "  /  CAT " + R.derived(ch).cat),
					h("h1", null, ch.name || "Unnamed")));
			var dead = ch.dead ? h("section", { class: "card alert" },
				h("div", { class: "alert-title" }, "Deceased"),
				h("p", null, ch.dead.cause + ". CAIN pays for the cremation."),
				h("div", { class: "btn-row" }, h("button", { class: "btn ghost small", type: "button", onclick: function () {
					ch.dead = null;
					ch.hunt.pending = null;
					ctx.act({ events: ["Revived (correction)."] });
				} }, "Undo: they're alive"))) : null;
			var flashBox = shown && shown.length ? h("div", { class: "flash", role: "status" }, h("ul", null, shown.map(function (e) { return h("li", null, e); }))) : null;
			if (mode === "play") return [head, tabs, dead, flashBox, CAIN.renderPlay(ch, ctx)];
			if (mode === "between") return [head, tabs, dead, flashBox, CAIN.renderBetween(ch, ctx)];
			var status = h("span", { class: "save-status", role: "status" });
			var timer = null;
			function onChange(rerender) {
				var ok = CAIN.store.save(ch);
				if (rerender) { CAIN.app.render(); return; }
				status.textContent = ok ? "Saved" : "Could not save";
				clearTimeout(timer);
				timer = setTimeout(function () { status.textContent = ""; }, 1500);
			}
			var del = h("button", { class: "btn ghost danger", type: "button", onclick: function () {
				if (!del.classList.contains("confirming")) {
					del.classList.add("confirming");
					del.textContent = "Really delete?";
					return;
				}
				CAIN.store.remove(ch.id);
				location.hash = "#/";
			} }, "Delete");
			head.appendChild(h("div", { class: "head-actions" },
				status,
				h("button", { class: "btn ghost", type: "button", onclick: function () { location.hash = "#/c/" + duplicate(ch).id; } }, "Duplicate"),
				h("button", { class: "btn ghost", type: "button", onclick: function () { CAIN.downloadJson(fileName(ch), ch); } }, "Export"),
				del));
			return [
				head,
				tabs,
				dead,
				h("p", { class: "note sheet-hint" }, "Edit mode: changes save as you type. The steppers are for corrections; Play and Between missions move these numbers for you."),
				CAIN.renderSheet(ch, { editable: true, onChange: onChange })
			];
		}
	};

	CAIN.sheetFileName = fileName;
	CAIN.duplicateCharacter = duplicate;
})();
