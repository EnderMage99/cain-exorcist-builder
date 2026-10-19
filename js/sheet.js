// The exorcist sheet, laid out like the official editable PDF (CAINsheets 1.4).
// On the character screen it is the one place everything is changed: click a
// bubble or box to fill up to it (click the last filled one to clear it), type
// into any field. Registration's review step shows it read-only.
window.CAIN = window.CAIN || {};

(function () {
	var R = CAIN.rules;
	var core = CAIN.core;
	var h = CAIN.h;
	var term = CAIN.term;

	// Row of bubbles. With onSet, each one is a button: clicking the n-th sets the
	// value to n, or to n - 1 if it was already the last one filled.
	// opts: { shape: "circle" | "box" | "star" | "blot" | "brain", crossed: n (last n
	// crossed out, not clickable), extraFrom: index where dashed extras start, label }.
	function bubbles(filled, total, opts, onSet) {
		opts = opts || {};
		var out = [];
		var usable = total - (opts.crossed || 0);
		for (var i = 0; i < total; i++) {
			var cls = "pip " + (opts.shape || "circle");
			if (i < filled) cls += " filled";
			if (opts.crossed && i >= usable) cls += " crossed";
			if (opts.extraFrom !== undefined && i >= opts.extraFrom) cls += " extra";
			if (onSet && i < usable) {
				(function (n) {
					out.push(h("button", { class: cls, type: "button", "aria-label": (opts.label || "Value") + " " + n,
						onclick: function () { onSet(filled === n ? n - 1 : n); } }));
				})(i + 1);
			} else {
				out.push(h("span", { class: cls, "aria-hidden": "true" }));
			}
		}
		return h("span", { class: "pips" + (onSet ? " clickable" : ""), role: onSet ? "group" : "img", "aria-label": (opts.label || "") + " " + filled + " of " + total }, out);
	}

	function section(cls, title, label) {
		var head = h("div", { class: "card-head" }, h("h2", { class: title.goth ? "goth" : null }, title.text || title), label ? h("span", { class: "label" }, label) : null);
		var card = h("section", { class: "card sheet-" + cls }, head);
		for (var i = 3; i < arguments.length; i++) CAIN.append(card, arguments[i]);
		return card;
	}

	function removeBtn(what, fn) {
		return h("button", { class: "mini-btn", type: "button", "aria-label": "Remove " + what, onclick: fn }, "Remove");
	}

	// opts: { editable, onChange(rerender), change(label, before, after), openPanel(id) }.
	function Sheet(ch, opts) {
		this.ch = ch;
		this.editable = !!opts.editable;
		this.onChange = opts.onChange || function () {};
		this.change = opts.change || function () { this.onChange(true); };
		this.openPanel = opts.openPanel || null;
		this.d = R.derived(ch);
	}

	// Setter for a tracked number: stores it and logs "label: before -> after".
	Sheet.prototype.tracked = function (label, get, set) {
		var self = this;
		if (!this.editable) return null;
		return function (v) {
			var before = get();
			if (before === v) return;
			set(v);
			self.change(label, before, v);
		};
	};

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

	// Number with - and + buttons for a top-level key.
	Sheet.prototype.stepper = function (label, key, min, max, opts) {
		var self = this;
		var value = this.ch[key];
		if (!this.editable) return h("div", { class: "stepper" }, h("span", { class: "field-label" }, label), h("span", { class: "stepper-value" }, String(value)));
		return CAIN.stepper(label, value, min, max, this.tracked(label, function () { return self.ch[key]; }, function (v) { self.ch[key] = v; }), opts);
	};

	Sheet.prototype.openButton = function (label, panel) {
		var self = this;
		if (!this.editable || !this.openPanel) return null;
		return h("button", { class: "mini-btn", type: "button", onclick: function () { self.openPanel(panel); } }, label);
	};

	// Page 1

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
			h("div", { class: "id-foot" }, h("span", null, "CID: XXX" + (ch.xid ? " " + ch.xid : "")), h("span", null, "CASTLE")));
	};

	Sheet.prototype.execution = function () {
		var hu = this.ch.hunt;
		var d = this.d;
		var lost = d.stressCapacity - d.maxStress;
		return h("section", { class: "card sheet-execution" },
			h("div", { class: "exec-row" },
				h("span", { class: "exec-stress" }, String(hu.stress)),
				bubbles(hu.stress, d.stressCapacity, { shape: "box", crossed: lost, label: "Stress" },
					this.tracked("Stress", function () { return hu.stress; }, function (v) { hu.stress = v; })),
				h("span", { class: "exec-title goth" }, "Execution")),
			h("div", { class: "exec-notes" },
				h("span", null, "Starts at " + d.stressCapacity + ". -1 per injury."),
				h("span", null, "If filled, gain an injury and roll over the rest. ", this.openButton("Take stress...", "stress"))),
			hu.injuries >= d.maxInjuries ? h("p", { class: "brink" }, "!! Brink of death !! Any more stress is instant death.") : null);
	};

	Sheet.prototype.health = function () {
		var self = this;
		var ch = this.ch;
		var hu = ch.hunt;
		var d = this.d;
		var hooks = hu.hooks.map(function (hk, i) {
			var name = self.editable
				? h("input", { class: "input hook-input", type: "text", value: hk.name, "aria-label": "Hook name", placeholder: "Name the hook" })
				: h("div", { class: "hook-label" }, hk.name);
			if (self.editable) name.addEventListener("input", function () { hk.name = name.value; self.onChange(false); });
			return h("div", { class: "hook-col" },
				name,
				bubbles(hk.slashes, core.base.hookLength, { shape: "box", label: "Hook " + (hk.name || i + 1) },
					self.tracked("Hook " + (hk.name || i + 1), function () { return hk.slashes; }, function (v) { hk.slashes = v; })),
				self.editable ? removeBtn("hook", function () { hu.hooks.splice(i, 1); self.onChange(true); }) : null);
		});
		var afflictions;
		if (this.editable) {
			afflictions = h("textarea", { class: "input afflictions", rows: 4, placeholder: "Record afflictions here, one per line.", value: hu.afflictions.join("\n"), "aria-label": "Afflictions" });
			afflictions.addEventListener("input", function () {
				hu.afflictions = afflictions.value.split("\n").map(function (s) { return s.trim(); }).filter(Boolean);
				self.onChange(false);
			});
		} else {
			afflictions = hu.afflictions.length ? h("ul", { class: "plain-list" }, hu.afflictions.map(function (a) { return h("li", null, a); })) : h("p", { class: "note" }, "None.");
		}
		return section("health", "Health evaluation form", null,
			h("div", { class: "health-block" },
				h("div", null,
					h("div", { class: "big-label" }, term("Injuries:", "injury")),
					h("p", { class: "tiny" }, "Each gives -1 stress. Suffer an injury when execution fills up. Clear all stress, then the remainder rolls over. When suffering instant death, you may suffer sin overflow instead and erase 1 injury.")),
				h("div", { class: "injury-box" },
					bubbles(hu.injuries, d.maxInjuries, { label: "Injuries", extraFrom: core.base.maxInjuries },
						this.tracked("Injuries", function () { return hu.injuries; }, function (v) { hu.injuries = v; })),
					h("span", { class: "tiny" }, d.maxInjuries > core.base.maxInjuries ? "Includes the visitation rights box." : "4th box with visitation rights."))),
			h("div", { class: "health-block" },
				h("div", null,
					h("div", { class: "big-label" }, term("Hooks:", "hook")),
					h("p", { class: "tiny" }, "Slash once when gaining the same hook again, when pressure increases, or on a 1 on the risk die. When it fills up, the Admin resolves it.")),
				h("div", { class: "hook-cols" }, hooks,
					this.editable ? h("button", { class: "hook-add", type: "button", onclick: function () { hu.hooks.push({ name: "", slashes: 0 }); self.onChange(true); } }, "+ Hook") : null)),
			h("div", { class: "big-label" }, term("Afflictions:", "affliction")),
			h("p", { class: "tiny" }, "Debrief after mission for decontamination."),
			afflictions);
	};

	Sheet.prototype.skills = function () {
		var self = this;
		var ch = this.ch;
		var d = this.d;
		var rows = core.skills.map(function (s) {
			var base = ch.skills[s.id];
			var dice = d.skillDice[s.id];
			var bonus = dice - base;
			return h("li", { class: "skill-row", title: s.text },
				h("span", { class: "skill-name" }, s.name),
				h("span", { class: "skill-short" }, s.short),
				h("span", { class: "skill-pips" },
					bubbles(base, core.skillMax, { label: s.name }, self.tracked(s.name, function () { return ch.skills[s.id]; }, function (v) { ch.skills[s.id] = v; })),
					h("span", { class: "pip circle extra" + (bonus > 0 ? " filled" : ""), title: bonus > 0 ? "+" + bonus + "D from a sin mark or Jack!" : "Bonus die slot (sin marks)" })),
				h("span", { class: "skill-dice" }, dice + "D"));
		});
		return section("skills", "Registered skills", null,
			h("ul", { class: "skill-list" }, rows),
			h("p", { class: "note" }, "Spend 1 advance to improve, then tick a box below. Two skills at 3 max."),
			h("div", { class: "subrow" },
				h("span", { class: "field-label" }, "Improvements"),
				bubbles(ch.skillImprovements, core.skillImprovementLimit, { label: "Improvements" },
					this.tracked("Improvements", function () { return ch.skillImprovements; }, function (v) { ch.skillImprovements = v; }))),
			h("div", { class: "id-foot inset" }, h("span", null, "TM standard 00398")));
	};

	Sheet.prototype.metric = function () {
		return section("metric", "Action assessment metric", null,
			h("div", { class: "metric-row" },
				h("div", { class: "metric" }, h("strong", null, "4+"), h("span", null, "Success")),
				h("div", { class: "metric" }, h("strong", null, term("Risky", "risky")), h("span", null, "Admin rolls the risk die.")),
				h("div", { class: "metric" }, h("strong", null, term("Hard", "hard")), h("span", null, "Successes on a 6."))),
			h("p", { class: "tiny" }, h("strong", null, "Gain bonus dice:"), " teamwork (combine highest bonuses); ", term("setup", "setup"), " yourself or another (+1D, -risk or -hard); spend 1 ", term("psyche burst"), " to use your powers (+1D); use your abilities; bargain with the Admin (gain a hook or tradeoff). ", h("strong", null, "+3 dice maximum."), " 0 dice: roll 2, keep the lowest."),
			this.openButton("Work out a dice pool...", "pool"));
	};

	Sheet.prototype.agony = function () {
		var hu = this.ch.hunt;
		var self = this;
		return section("agony", { text: "Divine Agony", goth: true }, null,
			h("div", { class: "agony-row" },
				h("ul", { class: "tiny-list" },
					h("li", null, "When you take no successes on a roll, gain an affliction, fill out a hook, gain an injury, or an exorcist dies or suffers sin overflow, store a pathos."),
					h("li", null, "Once a session, and once a scene for the whole group, you may burn away all pathos to add one extra die to a roll per pathos burned, stacking with all bonuses.")),
				h("div", { class: "pathos" },
					bubbles(hu.pathos, core.base.pathosMax, { shape: "star", label: "Pathos" },
						this.tracked("Pathos", function () { return hu.pathos; }, function (v) { hu.pathos = v; })),
					h("span", { class: "label" }, term("Pathos")),
					h("span", { class: "tiny" }, "Clear after session end"),
					this.editable ? h("button", { class: "chip", type: "button", "aria-pressed": String(hu.divineAgonyUsed), onclick: function () {
						hu.divineAgonyUsed = !hu.divineAgonyUsed;
						self.change("Divine Agony used", !hu.divineAgonyUsed, hu.divineAgonyUsed);
					} }, "Used this session") : (hu.divineAgonyUsed ? h("span", { class: "tag" }, "Used this session") : null))));
	};

	Sheet.prototype.advancement = function () {
		var ch = this.ch;
		var d = this.d;
		var advSlots = Math.max(3, ch.advances + 1);
		return section("advancement", "//Advancement", "TM standard 067",
			h("div", { class: "subrow" },
				h("span", { class: "big-label small" }, "XP:"),
				bubbles(ch.xp, d.xpToAdvance, { label: "XP", extraFrom: core.base.xpToAdvance },
					this.tracked("XP", function () { return ch.xp; }, function (v) { ch.xp = v; }))),
			h("div", { class: "subrow" },
				h("span", { class: "big-label small" }, term("Advances:", "advance")),
				bubbles(ch.advances, advSlots, { label: "Advances" },
					this.tracked("Advances", function () { return ch.advances; }, function (v) { ch.advances = v; }))),
			h("p", { class: "note" }, "At the end of each session, answer each question, then mark XP. Cash an advance each time this fills."),
			h("ul", { class: "plain-list" }, core.xpQuestions.map(function (q) { return h("li", null, q.text); })),
			h("div", { class: "btn-row" }, this.openButton("End of session...", "xp"), ch.advances > 0 ? this.openButton("Spend an advance...", "advance") : null));
	};

	// Page 2

	Sheet.prototype.category = function () {
		var self = this;
		var ch = this.ch;
		var d = this.d;
		var tiers = core.catThresholds.map(function (missions, i) {
			var cat = i + 1;
			var tri = h("span", { class: "cat-tri" }, ["I", "II", "III", "IV", "V"][i]);
			var inner = [tri, h("span", { class: "label" }, String(missions))];
			return h("li", { class: "cat-tier" + (cat === d.cat ? " current" : "") + (cat < d.cat ? " passed" : "") },
				self.editable
					? h("button", { class: "cat-btn", type: "button", "aria-label": "Set CAT " + cat + " (" + missions + " missions)", onclick: function () {
						var before = ch.missionsSurvived;
						ch.missionsSurvived = missions;
						self.change("Missions survived", before, missions);
					} }, inner)
					: inner);
		});
		return section("cat", "CAT", "Category rating system",
			h("ol", { class: "cat-tiers" }, tiers),
			h("div", { class: "subrow" },
				this.stepper("Missions survived", "missionsSurvived", 0, 99),
				h("span", { class: "note" }, d.nextCatAt === null ? "Highest rating." : "Next CAT at " + d.nextCatAt + ".")),
			h("p", { class: "tiny" }, "Category affects the parameters and effectiveness of powers. Click a triangle to set missions survived to its threshold."));
	};

	Sheet.prototype.psyche = function () {
		var hu = this.ch.hunt;
		var d = this.d;
		return h("section", { class: "card sheet-psyche" },
			h("div", { class: "psyche-row" },
				h("div", { class: "psyche-main" },
					h("span", { class: "psyche-title goth" }, "Psyche"),
					h("span", { class: "pips" }, (function () {
						var out = [];
						for (var i = 0; i < 3; i++) out.push(h("span", { class: "pip circle big" + (i < d.psyche ? " filled" : ""), "aria-hidden": "true" }));
						return out;
					})()),
					h("span", { class: "tiny" }, term("PSYCHE", "psyche"), " = half CAT, rounded up. Use for your powers.")),
				h("div", { class: "burst-box" },
					h("span", { class: "burst-title" }, "Burst"),
					bubbles(hu.bursts, d.psycheBursts, { shape: "brain", label: "Psyche bursts" },
						this.tracked("Psyche bursts", function () { return hu.bursts; }, function (v) { hu.bursts = v; })),
					h("span", { class: "tiny" }, "Use your powers or gain +1D, then mark one, or gain 1d3 ", term("sin"), " instead."))));
	};

	Sheet.prototype.kit = function () {
		var self = this;
		var ch = this.ch;
		var hu = ch.hunt;
		var d = this.d;
		var left = d.kitPoints - hu.kpSpent;
		var items = core.defaultKit.map(function (k) {
			var name = k.id === "service-weapons" ? "Service weapons (" + k.kp + " KP) (CAT " + ch.weaponCat + ", upgrade +1 for 3 scrip to max CAT 3)" : k.name + " (" + k.kp + " KP)";
			return h("li", null, name.toUpperCase());
		});
		ch.purchases.forEach(function (p, i) {
			var item = R.kitItem(p.item);
			if (!item) return;
			var consumable = item.tags.indexOf("Consumable") >= 0;
			items.push(h("li", { class: "kit-bought" },
				h("span", null, (item.name + (item.kp === null ? " (permanent)" : " (" + item.kp + " KP)") + (!self.editable && p.count > 1 ? " x" + p.count : "")).toUpperCase()),
				self.editable ? h("span", { class: "row-tools" },
					consumable ? CAIN.stepper(null, p.count, 1, 99, function (v) { p.count = v; self.onChange(true); }, { small: true, aria: item.name + " count" }) : null,
					removeBtn(item.name, function () { ch.purchases.splice(i, 1); self.onChange(true); })) : null));
		});
		return section("kit", "Registered kit", null,
			h("div", { class: "subrow" },
				h("span", { class: "big-label small" }, term("Kit points:", "kit points")),
				bubbles(left, d.kitPoints, { label: "Kit points left", extraFrom: core.base.kitPoints },
					this.tracked("KP left", function () { return d.kitPoints - hu.kpSpent; }, function (v) { hu.kpSpent = d.kitPoints - v; }))),
			h("p", { class: "tiny" }, "Spend KP to pull out the following items any time:"),
			h("div", { class: "kit-box" },
				h("ul", { class: "kit-typed" }, items),
				this.field(null, "kitNotes", { multiline: true, rows: 3, placeholder: "Description: anything else on your kit list", empty: "" })),
			h("div", { class: "btn-row" }, this.openButton("Kit shop...", "shop")),
			this.field("Service weapons look", "weaponLook", { multiline: true, placeholder: "What your service weapons look like", wide: true }),
			h("div", { class: "stepper-row" },
				this.stepper("Weapon CAT", "weaponCat", 0, core.catMax),
				this.stepper("Scrip", "scrip", 0, 999)),
			h("p", { class: "tiny" }, "Scrip paid out per mission (5: success, 3: spare, -1: failure, +3 advance)."));
	};

	Sheet.prototype.sin = function () {
		var self = this;
		var ch = this.ch;
		var d = this.d;
		var extra = Math.max(0, ch.blasphemies.length - 1);
		var boxes = d.sinCap + extra + ch.sinBoxesCrossed;
		var crossed = boxes - d.sinCap;
		var marks = ch.sinMarks.map(function (owned, mi) {
			var m = R.sinMark(owned.mark);
			return h("div", { class: "mark-box" },
				h("div", { class: "entry-name goth-name" }, m ? m.name : owned.mark,
					self.editable ? removeBtn("the whole mark", function () { ch.sinMarks.splice(mi, 1); self.onChange(true); }) : null),
				m ? h("p", { class: "tiny" }, m.appearance) : null,
				owned.abilities.map(function (a, ai) {
					var ab = R.sinMarkAbility(owned.mark, a.roll);
					if (!ab) return null;
					return h("div", { class: "mark-ability" },
						h("span", { class: "label" }, "d6: " + a.roll),
						CAIN.richText(ab.text, d.cat),
						self.editable ? h("span", { class: "row-tools" },
							ab.skillBonus ? CAIN.select(null, a.skill, ab.skillBonus.choose.map(function (s) { return { value: s, label: s }; }), function (v) { a.skill = v; self.onChange(true); }, { aria: "Skill for this mark" }) : null,
							removeBtn("this ability", function () {
								owned.abilities.splice(ai, 1);
								if (!owned.abilities.length) ch.sinMarks.splice(mi, 1);
								self.onChange(true);
							})) : (a.skill ? h("span", { class: "tag" }, a.skill) : null));
				}),
				h("div", { class: "tiny right" }, "Evolve with an advance"));
		});
		var markAdd = null;
		if (this.editable) {
			// Grouped by mark with short names, so the list stays narrow and readable.
			var options = CAIN.sinMarks.map(function (m) {
				var have = ch.sinMarks.filter(function (o) { return o.mark === m.id; })[0];
				var faces = have ? have.abilities.map(function (a) { return a.roll; }) : [];
				return { group: m.name, options: m.abilities.filter(function (ab) { return faces.indexOf(ab.roll) < 0; }).map(function (ab) {
					return { value: m.id + ":" + ab.roll, label: ab.roll + ": " + (ab.short || ab.text) };
				}) };
			}).filter(function (g) { return g.options.length; });
			var picked = "";
			markAdd = options.length ? h("div", { class: "add-row" },
				CAIN.select(null, "", options, function (v) { picked = v; }, { placeholder: "Add a sin mark ability by hand", aria: "Add a sin mark ability" }),
				h("button", { class: "btn small", type: "button", onclick: function () {
					if (!picked) return;
					var parts = picked.split(":");
					CAIN.hunt.gainSinMark(ch, parts[0], parseInt(parts[1], 10));
					self.onChange(true);
				} }, "Add")) : null;
		}
		return section("sin", { text: "Sin", goth: true }, ch.sin + " / " + d.sinCap,
			h("div", { class: "sin-web" },
				bubbles(ch.sin, boxes, { shape: "blot", crossed: crossed, label: "Sin" },
					this.tracked("Sin", function () { return ch.sin; }, function (v) { ch.sin = v; }))),
			h("div", { class: "stepper-row" },
				this.stepper("Boxes crossed out", "sinBoxesCrossed", 0, 20)),
			h("div", { class: "overflow-box" },
				h("div", { class: "overflow-title" }, "!! Sin overflow !!"),
				h("p", null, h("strong", null, "Give up"), " or make a ", h("strong", null, "resistance check"), ": roll 1d6 and add 1 for each sin mark. 6 or less keeps control (a 1 always does; with no marks you pass). On success, clear all sin, gain a ", h("strong", null, "sin mark"), ", then ", h("strong", null, "permanently cross out two boxes"), ".")),
			h("div", { class: "subhead" }, term("Sin marks", "sin mark")),
			marks.length ? marks : h("p", { class: "note" }, "None."),
			markAdd);
	};

	// Page 3

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
		var boldAdd = null;
		if (this.editable) {
			var boldInput = h("input", { class: "input", type: "text", placeholder: "Bolded item carried from an old agenda", "aria-label": "Carried bolded item" });
			boldAdd = h("div", { class: "add-row" }, boldInput, h("button", { class: "btn small", type: "button", onclick: function () {
				var t = boldInput.value.trim();
				if (!t) return;
				ch.boldItems.push(t);
				self.onChange(true);
			} }, "Add"));
		}
		return h("div", { class: "agenda-page" },
			h("section", { class: "card sheet-agenda" },
				h("div", { class: "card-head" },
					h("h2", null, "Agenda"),
					this.editable
						? CAIN.select(null, ch.agenda || "", CAIN.agendas.map(function (ag) { return { value: ag.id, label: ag.name }; }),
							function (v) { var before = ch.agenda; ch.agenda = v || null; self.change("Agenda", before, ch.agenda); }, { placeholder: "None", aria: "Agenda" })
						: h("span", { class: "sticker" }, a ? a.name : "None")),
				h("p", { class: "tiny" }, "Swap agendas between missions. Keep any bolded items. Spend an advance to gain a new ability. 5 abilities max."),
				h("div", { class: "label" }, "Agenda items"),
				a ? h("ul", { class: "items" }, a.items.map(function (it) { return h("li", { class: it.bold ? "bold" : null }, it.text); }),
					ch.boldItems.map(function (t, i) {
						return h("li", { class: "bold" }, t, self.editable ? removeBtn(t, function () { ch.boldItems.splice(i, 1); self.onChange(true); }) : null);
					})) : h("p", { class: "note" }, "No agenda."),
				boldAdd),
			h("section", { class: "card sheet-abilities" },
				h("div", { class: "card-head" }, h("h2", null, "Agenda abilities"), h("span", { class: "label" }, ch.agendaAbilities.length + " / 5")),
				abilities.length ? h("ul", { class: "entries" }, abilities) : h("p", { class: "note" }, "None."),
				h("div", { class: "btn-row" }, this.openButton("Add an ability...", "ability"))));
	};

	Sheet.prototype.blasphemies = function () {
		var self = this;
		var ch = this.ch;
		var d = this.d;
		var total = ch.blasphemies.reduce(function (n, b) { return n + b.powers.length; }, 0);
		var blocks = ch.blasphemies.map(function (owned, bi) {
			var b = R.blasphemy(owned.id);
			if (!b) return null;
			return h("div", { class: "blas-block" },
				h("div", { class: "blas-head" },
					h("span", { class: "sticker" }, b.name),
					h("span", { class: "label" }, "Blasphemy " + b.numeral),
					self.editable ? removeBtn(b.name, function () { ch.blasphemies.splice(bi, 1); self.onChange(true); }) : null),
				h("div", { class: "passive" },
					h("div", { class: "entry-name" }, b.passive.name, h("span", { class: "tag stamp" }, "Passive")),
					CAIN.richText(b.passive.text, d.cat)),
				h("div", { class: "power-grid" }, owned.powers.map(function (pid, pi) {
					var p = R.power(b.id, pid);
					if (!p) return null;
					var tags = [p.tags.duration, p.tags.effect, p.tags.range].filter(Boolean);
					return h("div", { class: "power-box" },
						h("span", { class: "power-side" }, "Observed power"),
						h("div", { class: "power-body" },
							h("div", { class: "entry-name" }, p.name,
								self.editable ? removeBtn(p.name, function () { owned.powers.splice(pi, 1); self.onChange(true); }) : null),
							h("div", { class: "tags" },
								tags.map(function (t) { return h("span", { class: "tag" }, CAIN.inlineText(t, d.cat)); }),
								h("span", { class: "tag burst" }, CAIN.burstLabels[p.burst])),
							CAIN.richText(p.text, d.cat)));
				})));
		});
		var blast = CAIN.blast;
		return section("blasphemy", "Blasphemy", "Observed powers " + total + " / 5",
			h("p", { class: "tiny" }, "Keep sticker attached at all times. Spend an advance to gain a new power, or a new blasphemy: gain its passive, cross out a sin box, and increase XP to advance by +1."),
			blocks.length ? blocks : h("p", { class: "note" }, "No blasphemy."),
			h("div", { class: "btn-row" }, this.openButton("Add a power...", "power")),
			h("div", { class: "passive blast" },
				h("div", { class: "entry-name" }, blast.name + ":", h("span", { class: "tag burst" }, CAIN.burstLabels[blast.burst])),
				CAIN.richText(blast.text, d.cat)));
	};

	// Last page

	Sheet.prototype.background = function () {
		var self = this;
		return section("background", "Character questions", "Give the answers to your Admin",
			core.questions.map(function (q) {
				return self.field(q.text, "questions." + q.id, { multiline: true, rows: 2, wide: true, empty: "Unanswered." });
			}),
			this.field("Notes", "notes", { multiline: true, rows: 4, wide: true, placeholder: "Anything else worth keeping", empty: "No notes." }));
	};

	Sheet.prototype.houseRules = function () {
		var self = this;
		var s = this.ch.settings;
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

	function page(n, title) {
		var el = h("div", { class: "sheet-page" }, h("div", { class: "page-tag" }, h("span", null, title), h("span", null, n)));
		for (var i = 2; i < arguments.length; i++) CAIN.append(el, arguments[i]);
		return el;
	}

	// Builds the full sheet. opts: { editable, onChange(rerender), change, openPanel }.
	CAIN.renderSheet = function (ch, opts) {
		var s = new Sheet(ch, opts || {});
		var problems = R.validateCharacter(ch);
		return h("div", { class: "sheet" },
			problems.length ? h("div", { class: "card warn" },
				h("div", { class: "label" }, "Sheet check (warnings only)"),
				h("ul", { class: "plain-list" }, problems.map(function (p) { return h("li", null, p.message); }))) : null,
			page("1", "Exorcist",
				h("div", { class: "sheet-cols" },
					h("div", { class: "sheet-col" }, s.idCard(), s.execution(), s.health()),
					h("div", { class: "sheet-col" }, s.skills(), s.metric(), s.agony(), s.advancement()))),
			page("2", "Category, kit and sin",
				s.category(),
				s.psyche(),
				h("div", { class: "sheet-cols" },
					h("div", { class: "sheet-col" }, s.kit()),
					h("div", { class: "sheet-col" }, s.sin()))),
			page("3", "Registered abilities",
				h("div", { class: "sheet-cols" },
					h("div", { class: "sheet-col" }, s.agenda()),
					h("div", { class: "sheet-col" }, s.blasphemies()))),
			page("4", "Background",
				h("div", { class: "sheet-cols" },
					h("div", { class: "sheet-col" }, s.background()),
					h("div", { class: "sheet-col" }, s.houseRules()))));
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

	// Events from the last action, shown once at the top of the next render.
	var flash = null;
	// Which action panel is open, per character.
	var openPanels = {};

	// Character screen: #/c/<id>. Old /play and /between links land here too.
	CAIN.screens.sheet = {
		id: "registry",
		render: function (id) {
			var ch = CAIN.store.get(id);
			if (!ch) {
				return h("div", { class: "card empty" },
					h("h2", null, "No such file"),
					h("p", null, "That exorcist isn't registered in this browser."),
					h("a", { class: "btn", href: "#/" }, "Back to the registry"));
			}
			// Save when filling in missing fields changed anything (e.g. bursts after a mission).
			var before = JSON.stringify(ch);
			CAIN.hunt.normalize(ch);
			if (JSON.stringify(ch) !== before) CAIN.store.save(ch);
			var shown = flash && flash.id === ch.id ? flash.events : null;
			flash = null;
			var status = h("span", { class: "save-status", role: "status" });
			var timer = null;
			var ctx = {
				panel: openPanels[ch.id] || null,
				save: function (rerender) {
					var ok = CAIN.store.save(ch);
					if (rerender) { CAIN.app.render(); return; }
					status.textContent = ok ? "Saved" : "Could not save";
					clearTimeout(timer);
					timer = setTimeout(function () { status.textContent = ""; }, 1500);
				},
				act: function (result) {
					flash = { id: ch.id, events: (result && result.events) || [] };
					CAIN.store.save(ch);
					CAIN.app.render();
				},
				flash: function (events) { flash = { id: ch.id, events: events }; CAIN.app.render(); },
				open: function (panel) {
					openPanels[ch.id] = openPanels[ch.id] === panel ? null : panel;
					CAIN.app.render();
					if (openPanels[ch.id]) window.scrollTo({ top: 0, behavior: "smooth" });
				},
				close: function () { openPanels[ch.id] = null; CAIN.app.render(); }
			};
			var del = h("button", { class: "btn ghost small danger", type: "button", onclick: function () {
				if (!del.classList.contains("confirming")) {
					del.classList.add("confirming");
					del.textContent = "Really delete?";
					return;
				}
				CAIN.store.remove(ch.id);
				location.hash = "#/";
			} }, "Delete");
			var head = h("div", { class: "page-head" },
				h("div", null,
					h("div", { class: "kicker" }, "Exorcist file " + (ch.xid || "") + "  /  CAT " + R.derived(ch).cat),
					h("h1", null, ch.name || "Unnamed")),
				h("div", { class: "head-actions" },
					status,
					h("button", { class: "btn ghost small", type: "button", onclick: function () { location.hash = "#/c/" + duplicate(ch).id; } }, "Duplicate"),
					h("button", { class: "btn ghost small", type: "button", onclick: function () { CAIN.downloadJson(fileName(ch), ch); } }, "Export"),
					del));
			var dead = ch.dead ? h("section", { class: "card alert" },
				h("div", { class: "alert-title" }, "Deceased"),
				h("p", null, ch.dead.cause + ". CAIN pays for the cremation."),
				h("div", { class: "btn-row" }, h("button", { class: "btn ghost small", type: "button", onclick: function () {
					ch.dead = null;
					ch.hunt.pending = null;
					ctx.act(CAIN.hunt.note(ch, "Revived (correction)."));
				} }, "Undo: they're alive"))) : null;
			var flashBox = shown && shown.length ? h("div", { class: "flash", role: "status" }, h("ul", null, shown.map(function (e) { return h("li", null, e); }))) : null;
			var sheet = CAIN.renderSheet(ch, {
				editable: true,
				onChange: function (rerender) { ctx.save(rerender); },
				change: function (label, before, after) { ctx.act(CAIN.hunt.note(ch, label + ": " + before + " -> " + after + ".")); },
				openPanel: function (panel) { ctx.open(panel); }
			});
			return [head, dead, CAIN.renderActions(ch, ctx), flashBox, sheet];
		}
	};

	CAIN.sheetFileName = fileName;
	CAIN.duplicateCharacter = duplicate;
})();
