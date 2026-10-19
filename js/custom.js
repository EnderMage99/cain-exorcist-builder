// Editors for player-made agendas and blasphemies, opened as action panels.
// Players build the whole thing from scratch (items, abilities, passive, powers
// with the book's tags and burst symbols), tick which parts their character has,
// and can drop CAT values into the text that fill in for the character's CAT.
window.CAIN = window.CAIN || {};

(function () {
	var R = CAIN.rules;
	var H = CAIN.hunt;
	var core = CAIN.core;
	var h = CAIN.h;

	// Unsaved edits, per character and per thing being edited.
	var drafts = {};
	var keySeq = 0;
	function newKey() { keySeq += 1; return "k" + keySeq; }

	function btn(label, onclick, opts) {
		opts = opts || {};
		return h("button", { class: "btn" + (opts.ghost ? " ghost" : "") + (opts.small ? " small" : "") + (opts.danger ? " danger" : ""), type: "button", disabled: !!opts.disabled, title: opts.title || null, onclick: onclick }, label);
	}

	function chip(label, pressed, onclick, opts) {
		opts = opts || {};
		return h("button", { class: "chip", type: "button", "aria-pressed": String(!!pressed), title: opts.title || null, onclick: onclick }, label);
	}

	function textInput(obj, key, placeholder, aria) {
		var el = h("input", { class: "input", type: "text", placeholder: placeholder, value: obj[key] || "", "aria-label": aria || placeholder });
		el.addEventListener("input", function () { obj[key] = el.value; });
		return el;
	}

	// Rules text box with an "Insert CAT value" dropdown and a live preview at the
	// character's CAT. Lines starting "- " become bullets, as in the book.
	function catText(obj, key, cat, label, rows) {
		var area = h("textarea", { class: "input", rows: rows || 4, placeholder: label, value: obj[key] || "", "aria-label": label });
		var preview = h("div", { class: "custom-preview" });
		function refresh() {
			preview.textContent = "";
			if (area.value.trim()) {
				preview.appendChild(h("div", { class: "label" }, "Preview at CAT " + cat));
				preview.appendChild(CAIN.richText(area.value, cat));
			}
		}
		area.addEventListener("input", function () { obj[key] = area.value; refresh(); });
		var insert = h("select", { class: "input select", "aria-label": "Insert a CAT value into " + label });
		insert.appendChild(h("option", { value: "" }, "Insert CAT value..."));
		core.catInserts.forEach(function (g) {
			var og = h("optgroup", { label: g.group });
			g.options.forEach(function (o) { og.appendChild(h("option", { value: o.token }, o.label)); });
			insert.appendChild(og);
		});
		insert.addEventListener("change", function () {
			var token = insert.value;
			if (!token) return;
			var start = area.selectionStart === undefined ? area.value.length : area.selectionStart;
			var end = area.selectionEnd === undefined ? start : area.selectionEnd;
			area.value = area.value.slice(0, start) + token + area.value.slice(end);
			obj[key] = area.value;
			insert.value = "";
			area.focus();
			area.selectionStart = area.selectionEnd = start + token.length;
			refresh();
		});
		refresh();
		return h("div", { class: "cat-text" },
			h("div", { class: "cat-text-tools" }, h("span", { class: "field-label" }, label), insert),
			area,
			h("p", { class: "tiny" }, "CAT values fill in for your CAT. Start a line with \"- \" for a bullet."),
			preview);
	}

	function ownedChip(draft, key, label, ctx) {
		var on = draft.owned.indexOf(key) >= 0;
		return chip(on ? "Have it" : label, on, function () {
			if (on) draft.owned = draft.owned.filter(function (k) { return k !== key; });
			else draft.owned.push(key);
			ctx.save(true);
		}, { title: "Tick if your character has this right now" });
	}

	function deleteButton(onConfirm) {
		var el = btn("Delete", function () {
			if (!el.classList.contains("confirming")) {
				el.classList.add("confirming");
				el.textContent = "Really delete?";
				return;
			}
			onConfirm();
		}, { small: true, ghost: true, danger: true });
		return el;
	}

	function panelShell(ctx, title, note) {
		var el = h("section", { class: "card action-panel custom-editor" },
			h("div", { class: "card-head" }, h("h2", null, title),
				h("button", { class: "mini-btn", type: "button", onclick: ctx.close }, "Close")),
			note ? h("p", { class: "note" }, note) : null);
		for (var i = 3; i < arguments.length; i++) CAIN.append(el, arguments[i]);
		return el;
	}

	// Agenda editor

	function agendaDraft(ch, id) {
		var k = ch.id + ":agenda:" + (id || "new");
		if (drafts[k]) return drafts[k];
		var existing = id ? ch.custom.agendas.filter(function (a) { return a.id === id; })[0] : null;
		var def = existing ? JSON.parse(JSON.stringify(existing)) : {
			name: "",
			items: [{ text: "", bold: false }, { text: "", bold: true }],
			abilities: [{ key: newKey(), name: "", text: "" }]
		};
		var owned = existing
			? ch.agendaAbilities.filter(function (r) { return r.agenda === existing.id; }).map(function (r) { return r.ability; })
			: [def.abilities[0].key];
		drafts[k] = { key: k, def: def, owned: owned, makeCurrent: existing ? ch.agenda === existing.id : !ch.agenda };
		return drafts[k];
	}

	function agendaPanel(ch, ctx) {
		var id = ctx.panelArg;
		var draft = agendaDraft(ch, id);
		var def = draft.def;
		var cat = R.derived(ch).cat;
		var items = def.items.map(function (it, i) {
			return h("li", { class: "custom-row" },
				textInput(it, "text", i === 0 ? "First item, e.g. Protect your people" : "Item", "Agenda item " + (i + 1)),
				chip("Bold", it.bold, function () { it.bold = !it.bold; ctx.save(true); }, { title: "Bolded items are harder, and carry over when you swap agendas" }),
				h("button", { class: "mini-btn", type: "button", "aria-label": "Remove item " + (i + 1), onclick: function () { def.items.splice(i, 1); ctx.save(true); } }, "Remove"));
		});
		var abilities = def.abilities.map(function (ab, i) {
			var key = ab.id || ab.key;
			return h("li", { class: "custom-block" },
				h("div", { class: "custom-row" },
					textInput(ab, "name", "Ability name", "Ability " + (i + 1) + " name"),
					ownedChip(draft, key, "I have this", ctx),
					h("button", { class: "mini-btn", type: "button", "aria-label": "Remove ability " + (i + 1), onclick: function () {
						def.abilities.splice(i, 1);
						draft.owned = draft.owned.filter(function (k) { return k !== key; });
						ctx.save(true);
					} }, "Remove")),
				catText(ab, "text", cat, "What it does", 3));
		});
		return panelShell(ctx, id ? "Edit agenda" : "Create an agenda",
			"An agenda is how your exorcist approaches problems. The book's have two items (the second bolded) and five abilities.",
			h("div", { class: "field" }, h("span", { class: "field-label" }, "Name"), textInput(def, "name", "e.g. Martyr", "Agenda name")),
			h("div", { class: "subhead" }, "Agenda items"),
			h("ul", { class: "custom-list" }, items),
			h("div", { class: "btn-row" }, btn("+ Item", function () { def.items.push({ text: "", bold: false }); ctx.save(true); }, { small: true, ghost: true })),
			h("div", { class: "subhead" }, "Abilities"),
			h("ul", { class: "custom-list" }, abilities),
			h("div", { class: "btn-row" }, btn("+ Ability", function () { def.abilities.push({ key: newKey(), name: "", text: "" }); ctx.save(true); }, { small: true, ghost: true })),
			h("div", { class: "subrow" }, chip("Make this my current agenda", draft.makeCurrent, function () { draft.makeCurrent = !draft.makeCurrent; ctx.save(true); })),
			h("div", { class: "btn-row" },
				btn(id ? "Save changes" : "Create agenda", function () {
					var r = H.saveCustomAgenda(ch, def, { owned: draft.owned, makeCurrent: draft.makeCurrent });
					if (!r.ok) { ctx.flash([r.reason]); return; }
					delete drafts[draft.key];
					ctx.done(r);
				}),
				btn("Cancel", function () { delete drafts[draft.key]; ctx.close(); }, { ghost: true }),
				id ? deleteButton(function () { delete drafts[draft.key]; ctx.done(H.deleteCustom(ch, "agenda", id)); }) : null));
	}

	// Blasphemy editor

	function blankPower() {
		return { key: newKey(), name: "", text: "", burst: "required", tags: { duration: "Instant", effect: "", range: "Short" } };
	}

	function blasphemyDraft(ch, id) {
		var k = ch.id + ":blasphemy:" + (id || "new");
		if (drafts[k]) return drafts[k];
		var existing = id ? ch.custom.blasphemies.filter(function (b) { return b.id === id; })[0] : null;
		var def = existing ? JSON.parse(JSON.stringify(existing)) : {
			name: "",
			summary: "",
			passive: { name: "", text: "" },
			powers: [blankPower(), blankPower()]
		};
		var entry = existing ? ch.blasphemies.filter(function (b) { return b.id === existing.id; })[0] : null;
		var owned = existing ? (entry ? entry.powers.slice() : []) : def.powers.map(function (p) { return p.key; });
		drafts[k] = { key: k, def: def, owned: owned, have: existing ? !!entry : true };
		return drafts[k];
	}

	function tagSelect(label, value, options, onSet) {
		return CAIN.select(label, value, options, onSet, { placeholder: "None" });
	}

	// The blasphemy's colours, like the book's pages: accent, second colour and
	// whether it sits on black. Shows the name plate as it will look.
	function themeField(def, ctx) {
		def.theme = def.theme || { color: "#8a8a8a", color2: "#4a4a4a", dark: false };
		var t = def.theme;
		var plate = h("span", { class: "sticker blas-plate" }, def.name || "Blasphemy");
		var wrap = h("div", { class: "blas-preview" }, plate);
		function paint() {
			var th = CAIN.blasTheme(def);
			wrap.className = "blas-preview " + th.class;
			wrap.setAttribute("style", th.style);
			plate.textContent = def.name || "Blasphemy";
		}
		function picker(key, label) {
			var el = h("input", { class: "color-input", type: "color", value: t[key], "aria-label": label });
			el.addEventListener("input", function () { t[key] = el.value; paint(); });
			el.addEventListener("change", function () { ctx.save(); });
			return h("label", { class: "color-pick" }, el, h("span", null, label));
		}
		paint();
		return h("div", { class: "field" }, h("span", { class: "field-label" }, "Colours"),
			h("div", { class: "color-row" },
				picker("color", "Accent"),
				picker("color2", "Second colour"),
				chip("Black page", !!t.dark, function () { t.dark = !t.dark; ctx.save(true); }),
				wrap));
	}

	function blasphemyPanel(ch, ctx) {
		var id = ctx.panelArg;
		var draft = blasphemyDraft(ch, id);
		var def = draft.def;
		var cat = R.derived(ch).cat;
		var powers = def.powers.map(function (p, i) {
			var key = p.id || p.key;
			var bursts = h("div", { class: "burst-pick", role: "group", "aria-label": "Psyche burst for power " + (i + 1) },
				core.burstKinds.map(function (k) {
					return h("button", { class: "chip burst-choice", type: "button", "aria-pressed": String(p.burst === k.id), title: k.label,
						onclick: function () { p.burst = k.id; ctx.save(true); } }, CAIN.burstIcon(k.id), h("span", null, k.label));
				}));
			return h("li", { class: "custom-block" },
				h("div", { class: "custom-row" },
					h("span", { class: "power-star" }, CAIN.burstIcon(p.burst)),
					textInput(p, "name", "Power name", "Power " + (i + 1) + " name"),
					ownedChip(draft, key, "I have this", ctx),
					h("button", { class: "mini-btn", type: "button", "aria-label": "Remove power " + (i + 1), onclick: function () {
						def.powers.splice(i, 1);
						draft.owned = draft.owned.filter(function (k) { return k !== key; });
						ctx.save(true);
					} }, "Remove")),
				bursts,
				h("div", { class: "tag-pick" },
					tagSelect("Duration", p.tags.duration, core.powerTags.duration.map(function (t) { return { value: t, label: t }; }), function (v) { p.tags.duration = v; ctx.save(true); }),
					tagSelect("Effect", p.tags.effect, core.powerTags.effect.map(function (t) { return { value: t, label: t }; }), function (v) { p.tags.effect = v; ctx.save(true); }),
					tagSelect("Range", p.tags.range, core.powerTags.range, function (v) { p.tags.range = v; ctx.save(true); })),
				CAIN.powerTags(p, cat),
				catText(p, "text", cat, "What it does", 5));
		});
		return panelShell(ctx, id ? "Edit blasphemy" : "Create a blasphemy",
			"A blasphemy is your exorcist's psychic power: a passive everyone with it gets, and powers to pick from. The book's have five powers.",
			h("div", { class: "field" }, h("span", { class: "field-label" }, "Name"), textInput(def, "name", "e.g. Rust", "Blasphemy name")),
			h("div", { class: "field" }, h("span", { class: "field-label" }, "Summary"), textInput(def, "summary", "One line, e.g. Decay anything you touch", "Blasphemy summary")),
			themeField(def, ctx),
			h("div", { class: "subhead" }, "Passive"),
			h("div", { class: "custom-block" },
				textInput(def.passive, "name", "Passive name", "Passive name"),
				catText(def.passive, "text", cat, "What the passive does", 3)),
			h("div", { class: "subhead" }, "Powers"),
			h("p", { class: "tiny burst-legend" },
				CAIN.burstIcon("required"), " needs a psyche burst   ",
				CAIN.burstIcon("multiple"), " one or more   ",
				CAIN.burstIcon("none"), " no burst"),
			h("ul", { class: "custom-list" }, powers),
			h("div", { class: "btn-row" }, btn("+ Power", function () { def.powers.push(blankPower()); ctx.save(true); }, { small: true, ghost: true })),
			h("div", { class: "subrow" }, chip("My exorcist has this blasphemy", draft.have, function () { draft.have = !draft.have; ctx.save(true); }, { title: "Gives you its passive. Untick to keep it only as a saved design." })),
			h("div", { class: "btn-row" },
				btn(id ? "Save changes" : "Create blasphemy", function () {
					var r = H.saveCustomBlasphemy(ch, def, { owned: draft.owned, have: draft.have });
					if (!r.ok) { ctx.flash([r.reason]); return; }
					delete drafts[draft.key];
					ctx.done(r);
				}),
				btn("Cancel", function () { delete drafts[draft.key]; ctx.close(); }, { ghost: true }),
				id ? deleteButton(function () { delete drafts[draft.key]; ctx.done(H.deleteCustom(ch, "blasphemy", id)); }) : null));
	}

	CAIN.customPanels = { agenda: agendaPanel, blasphemy: blasphemyPanel };
})();
