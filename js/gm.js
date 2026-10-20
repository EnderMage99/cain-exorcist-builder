// The GM desk (#/gm), laid out like a mission runner: the chosen exorcist fills
// the page, a dock along the bottom holds a card per exorcist at the table, and
// the hunt's tension and pressure talismans sit at the dock's right end.
// Table, talismans and notes are kept in this browser under cain.gm.
window.CAIN = window.CAIN || {};

(function () {
	var R = CAIN.rules;
	var H = CAIN.hunt;
	var core = CAIN.core;
	var h = CAIN.h;
	var store = CAIN.store;
	var safeStore = CAIN.safeStore;

	var PRESSURE_MAX = 6;
	var TENSION_MAX = 3;

	var gm = null;
	var flash = "";
	var adding = false;

	// Read fresh on each render, so a desk changed in another tab isn't overwritten.
	function load() {
		gm = safeStore.get("cain.gm", null) || {};
		if (!Array.isArray(gm.party)) gm.party = [];
		if (!(gm.pressure >= 0)) gm.pressure = 0;
		if (!(gm.tension >= 0)) gm.tension = 0;
		if (typeof gm.notes !== "string") gm.notes = "";
	}

	function save() { safeStore.set("cain.gm", gm); }
	function rerender() { save(); CAIN.app.render(); }

	// Exorcists at the table that are still saved in this browser.
	function party() {
		gm.party = gm.party.filter(function (id) { return store.get(id); });
		return gm.party.map(function (id) { var c = store.get(id); H.normalize(c); return c; });
	}

	function stats(c) {
		var d = R.derived(c);
		var hu = c.hunt;
		return {
			d: d,
			stress: hu.stress, maxStress: d.maxStress,
			injuries: hu.injuries, maxInjuries: d.maxInjuries,
			bursts: hu.bursts === null ? d.psycheBursts : hu.bursts, maxBursts: d.psycheBursts,
			kp: d.kitPoints - hu.kpSpent, maxKp: d.kitPoints,
			sin: c.sin, sinCap: d.sinCap
		};
	}

	// Saves a change to an exorcist and logs it as the GM's doing.
	function commit(c, text) {
		if (text) H.note(c, "GM: " + text);
		store.save(c);
		CAIN.app.render();
	}

	// Pips: click one to set the value there (click the last filled one to lower it).
	function track(label, value, max, onSet, opts) {
		opts = opts || {};
		var pips = [];
		var shown = Math.max(max, value);
		for (var i = 1; i <= shown; i++) {
			(function (n) {
				pips.push(h("button", { class: "gm-pip" + (n <= value ? " on" : "") + (n > max ? " over" : ""), type: "button",
					"aria-label": label + " " + n, "aria-pressed": String(n <= value), onclick: function () { onSet(n === value ? n - 1 : n); } }));
			})(i);
		}
		return h("div", { class: "gm-track " + (opts.cls || "") },
			h("div", { class: "gm-track-head" },
				h("span", { class: "gm-track-label" }, label + ":"),
				h("span", { class: "gm-track-value" }, value + "/" + max)),
			h("div", { class: "gm-track-row" },
				h("button", { class: "gm-step", type: "button", "aria-label": "Lower " + label, disabled: value <= 0, onclick: function () { onSet(value - 1); } }, "-"),
				h("span", { class: "gm-pips", role: "group", "aria-label": label }, pips),
				h("button", { class: "gm-step", type: "button", "aria-label": "Raise " + label, disabled: !opts.overMax && value >= max, onclick: function () { onSet(value + 1); } }, "+")));
	}

	// The hunt: tension and pressure

	function setPressure(v) {
		gm.pressure = Math.max(0, Math.min(PRESSURE_MAX, v));
		flash = gm.pressure >= PRESSURE_MAX ? "Pressure is out of control: the sin gains +1 CAT." : "";
	}

	// Pressure goes up by 1 and every hook at the table takes a slash.
	function raisePressure() {
		setPressure(gm.pressure + 1);
		party().forEach(function (c) {
			if (c.dead) return;
			H.pressureRises(c);
			store.save(c);
		});
	}

	// A scene passes: slash tension. At 3 it empties and pressure rises by 1.
	function slashTension() {
		if (gm.tension + 1 >= TENSION_MAX) {
			gm.tension = 0;
			raisePressure();
			flash = "Tension filled: pressure " + gm.pressure + ", pick a tension move. Hooks took a slash." + (gm.pressure >= PRESSURE_MAX ? " Out of control: the sin gains +1 CAT." : "");
		} else {
			gm.tension += 1;
			flash = "";
		}
		rerender();
	}

	function segs(label, value, max, onSet, cls) {
		var out = [];
		for (var i = 1; i <= max; i++) {
			(function (n) {
				out.push(h("button", { class: "gm-seg" + (n <= value ? " on" : ""), type: "button", "aria-label": label + " " + n, "aria-pressed": String(n <= value),
					onclick: function () { onSet(n === value ? n - 1 : n); } }));
			})(i);
		}
		return h("div", { class: "gm-talisman " + cls },
			h("span", { class: "gm-talisman-name" }, label, h("span", { class: "gm-talisman-value" }, " " + value + "/" + max)),
			h("span", { class: "gm-segs", role: "group", "aria-label": label }, out));
	}

	function huntBox() {
		return h("div", { class: "gm-hunt", role: "group", "aria-label": "The hunt" },
			segs("Tension", gm.tension, TENSION_MAX, function (v) { gm.tension = v; flash = ""; rerender(); }, "gm-tension"),
			segs("Pressure", gm.pressure, PRESSURE_MAX, function (v) { setPressure(v); rerender(); }, "gm-pressure"),
			h("div", { class: "gm-hunt-btns" },
				h("button", { class: "gm-hunt-btn primary", type: "button", title: "Slash tension. At 3 it empties, pressure rises and hooks take a slash.", onclick: slashTension }, "Scene passes"),
				h("button", { class: "gm-hunt-btn", type: "button", title: "Resting raises pressure by 1; hooks take a slash.", onclick: function () {
					raisePressure();
					if (!flash) flash = "The exorcists rested: pressure " + gm.pressure + ". Hooks took a slash.";
					rerender();
				} }, "Rest"),
				h("button", { class: "gm-hunt-btn", type: "button", title: "Clear tension and pressure for a new hunt", onclick: function () { gm.tension = 0; gm.pressure = 0; flash = "New hunt: tension and pressure cleared."; rerender(); } }, "New hunt")));
	}

	// The dock

	function dockCard(c, on) {
		var s = stats(c);
		var a = c.agenda ? R.agenda(c.agenda) : null;
		var look = a ? CAIN.agendaLook(a) : null;
		var accent = look ? /--ag-accent:([^;]+)/.exec(look.style)[1] : null;
		function stat(abbr, title, value, max, warn) {
			return h("span", { class: "gm-dstat" + (warn ? " warn" : ""), title: title }, h("span", { class: "gm-dabbr" }, abbr), value + (max !== undefined ? "/" + max : ""));
		}
		return h("div", { class: "gm-dcard" + (on ? " on" : "") + (c.dead ? " dead" : ""), style: accent ? "--dc:" + accent : null },
			h("a", { class: "gm-dsheet", href: "#/c/" + c.id, title: "Open " + (c.name || "this exorcist") + "'s sheet", "aria-label": "Open " + (c.name || "this exorcist") + "'s sheet" }, "Sheet"),
			h("button", { class: "gm-dpick", type: "button", "aria-pressed": String(on), onclick: function () { gm.active = c.id; adding = false; rerender(); } },
			h("span", { class: "gm-dname" }, c.name || "Unnamed"),
			h("span", { class: "gm-dstats" },
				stat("STR", "Stress", s.stress, s.maxStress, s.stress >= s.maxStress),
				stat("INJ", "Injuries", s.injuries, s.maxInjuries, s.injuries >= s.maxInjuries),
				stat("PB", "Psyche bursts", s.bursts, s.maxBursts, s.bursts === 0),
				stat("KP", "Kit points left", s.kp, s.maxKp),
				stat("SIN", "Sin", s.sin, s.sinCap, s.sin >= s.sinCap),
				stat("HK", "Hooks", c.hunt.hooks.length))));
	}

	function dock(members, current) {
		return h("div", { class: "gm-dock", role: "region", "aria-label": "Table and hunt" },
			h("div", { class: "gm-dock-inner" },
				h("div", { class: "gm-dock-party" },
					members.map(function (c) { return dockCard(c, !adding && current && c.id === current.id); }),
					h("button", { class: "gm-dcard gm-dadd" + (adding || !members.length ? " on" : ""), type: "button", "aria-label": "Add an exorcist to the table",
						onclick: function () { adding = true; CAIN.app.render(); } }, h("span", { class: "gm-dplus", "aria-hidden": "true" }, "+"), h("span", null, "Add"))),
				huntBox()),
			flash ? h("div", { class: "gm-flash", role: "status" }, flash) : null);
	}

	// Adding exorcists: any saved in this browser, or a player's exported file.
	function addPanel(members) {
		var others = store.list().filter(function (c) { return gm.party.indexOf(c.id) < 0; });
		var fileInput = h("input", { type: "file", accept: ".json,application/json", class: "visually-hidden", id: "gm-import",
			onchange: function () {
				var file = fileInput.files[0];
				if (!file) return;
				var reader = new FileReader();
				reader.onload = function () {
					var result = CAIN.transfer.unpack(String(reader.result));
					if (result.error) { flash = result.error; rerender(); return; }
					result.characters.forEach(function (c) {
						store.save(c);
						if (gm.party.indexOf(c.id) < 0) gm.party.push(c.id);
						gm.active = c.id;
					});
					adding = false;
					flash = "Added " + result.characters.map(function (c) { return c.name || "an exorcist"; }).join(", ") + " from " + file.name + ".";
					rerender();
				};
				reader.readAsText(file);
				fileInput.value = "";
			} });
		return h("section", { class: "card gm-add" },
			h("div", { class: "card-head" }, h("h2", null, "Add to the table"), members.length ? h("button", { class: "mini-btn", type: "button", onclick: function () { adding = false; CAIN.app.render(); } }, "Close") : null),
			h("p", { class: "note" }, "Pick exorcists saved in this browser, or import the files your players export from their sheets (Export file). Importing again replaces the older copy."),
			others.length ? h("ul", { class: "gm-add-list" }, others.map(function (c) {
				var d = R.derived(c);
				return h("li", null, h("button", { class: "option", type: "button", onclick: function () { gm.party.push(c.id); gm.active = c.id; adding = false; rerender(); } },
					h("span", { class: "option-body" }, h("span", { class: "entry-name" }, c.name || "Unnamed"), h("span", { class: "note" }, (c.xid || "") + "  /  CAT " + d.cat))));
			})) : h("p", { class: "note" }, "Everyone saved in this browser is already at the table."),
			h("div", { class: "btn-row" },
				h("label", { class: "btn small", for: "gm-import", title: "A player's .cain.json file" }, "Import a player's file"),
				fileInput,
				others.length > 1 ? h("button", { class: "btn small ghost", type: "button", onclick: function () {
					others.forEach(function (c) { gm.party.push(c.id); });
					gm.active = others[0].id;
					adding = false;
					rerender();
				} }, "Add everyone") : null));
	}

	// The chosen exorcist

	function infoBtn(view, name) {
		return view ? h("button", { class: "gm-info", type: "button", "aria-label": "Read " + name, title: "Read in full", onclick: function () { CAIN.viewer.open(view); } }, "i") : null;
	}

	function loadoutItem(name, meta, view) {
		return h("li", { class: "gm-item" }, h("span", { class: "gm-item-name" }, name), meta ? h("span", { class: "gm-item-meta" }, meta) : null, infoBtn(view, name));
	}

	function loadout(c) {
		var items = [];
		c.agendaAbilities.forEach(function (ref) {
			var ab = R.agendaAbility(ref);
			if (ab) items.push(loadoutItem(ab.name, "Agenda ability", ref.agenda && R.agenda(ref.agenda) && !R.agenda(ref.agenda).custom ? "agenda:" + ref.agenda : null));
		});
		c.blasphemies.forEach(function (owned) {
			var b = R.blasphemy(owned.id);
			if (!b) return;
			var view = b.custom ? null : "blasphemy:" + b.id;
			var quirk = owned.quirk && CAIN.quirkById ? CAIN.quirkById(owned.quirk) : null;
			items.push(loadoutItem(quirk ? quirk.name : b.passive.name, (quirk ? "Quirk" : "Passive") + ", " + b.name, view));
			owned.powers.forEach(function (pid) {
				var p = R.power(b.id, pid);
				if (p) items.push(loadoutItem(p.name, b.name + " power", view));
			});
		});
		c.purchases.forEach(function (p) {
			var item = R.purchaseItem(p);
			if (!item) return;
			var cost = item.kp === null ? "Permanent" : item.kp + " KP";
			items.push(loadoutItem(item.name + (p.count > 1 ? " x" + p.count : ""), "Kit, " + cost, item.custom ? null : "kit:" + item.id));
		});
		c.sinMarks.forEach(function (owned) {
			var m = R.sinMark(owned.mark);
			if (m) items.push(loadoutItem(m.name, "Sin mark, " + owned.abilities.length + " abilit" + (owned.abilities.length === 1 ? "y" : "ies"), "sinmark:" + m.id));
		});
		return items.length ? h("ul", { class: "gm-loadout" }, items) : h("p", { class: "note" }, "Nothing registered.");
	}

	function hookRow(c, hk, i) {
		var len = core.base.hookLength;
		var boxes = [];
		for (var n = 1; n <= len; n++) {
			(function (k) {
				boxes.push(h("button", { class: "gm-seg small" + (k <= hk.slashes ? " on" : ""), type: "button", "aria-label": hk.name + " slash " + k, "aria-pressed": String(k <= hk.slashes),
					onclick: function () { H.slashHook(c, i, (k === hk.slashes ? k - 1 : k) - hk.slashes); commit(c); } }));
			})(n);
		}
		return h("li", { class: "gm-hook" + (hk.slashes >= len ? " full" : "") },
			h("span", { class: "gm-hook-name" }, hk.name),
			h("span", { class: "gm-segs" }, boxes),
			hk.slashes >= len ? h("span", { class: "tag stamp" }, "Full: cash it in") : null,
			h("button", { class: "mini-btn", type: "button", "aria-label": "Resolve " + hk.name, onclick: function () { H.removeHook(c, i); commit(c); } }, "Resolve"));
	}

	function detail(c) {
		var s = stats(c);
		var hu = c.hunt;
		var a = c.agenda ? R.agenda(c.agenda) : null;
		var blas = c.blasphemies.map(function (b) { var x = R.blasphemy(b.id); return x ? x.name : b.id; }).join(" + ");
		function set(label, before, after, apply) {
			if (before === after) return;
			apply(after);
			commit(c, label + " " + before + " -> " + after + ".");
		}
		var newHook = h("input", { class: "input", type: "text", placeholder: "New hook", "aria-label": "New hook for " + (c.name || "this exorcist") });
		var newAff = h("input", { class: "input", type: "text", placeholder: "New affliction", "aria-label": "New affliction for " + (c.name || "this exorcist") });
		return h("section", { class: "gm-sheet" },
			h("div", { class: "gm-sheet-head" },
				h("div", null,
					h("div", { class: "kicker" }, [c.xid, "CAT " + s.d.cat, a ? a.name : null, blas].filter(Boolean).join("  /  ")),
					h("h2", { class: "gm-sheet-name" }, h("a", { href: "#/c/" + c.id, title: "Open the full sheet" }, c.name || "Unnamed"), c.dead ? h("span", { class: "tag stamp" }, "Dead") : null,
						!c.dead && s.injuries >= s.maxInjuries ? h("span", { class: "tag stamp" }, "At the brink") : null)),
				h("div", { class: "head-actions" },
					h("a", { class: "btn small", href: "#/c/" + c.id }, "Open full sheet"),
					h("button", { class: "btn small ghost", type: "button", title: "Take off the table (the exorcist stays saved)", onclick: function () {
						gm.party = gm.party.filter(function (id) { return id !== c.id; });
						gm.active = null;
						rerender();
					} }, "Off the table"))),
			h("div", { class: "gm-tracks" },
				track("Stress", s.stress, s.maxStress, function (v) { set("Stress", s.stress, v, function (x) { hu.stress = x; }); }, { cls: "t-stress" }),
				track("Injuries", s.injuries, s.maxInjuries, function (v) { set("Injuries", s.injuries, v, function (x) { hu.injuries = x; }); }, { cls: "t-injury" }),
				track("Psyche bursts", s.bursts, s.maxBursts, function (v) { set("Psyche bursts", s.bursts, v, function (x) { hu.bursts = x; }); }, { cls: "t-burst" }),
				track("Kit points", s.kp, s.maxKp, function (v) { set("KP left", s.kp, v, function (x) { hu.kpSpent = s.maxKp - x; }); }, { cls: "t-kp" }),
				track("Sin", s.sin, s.sinCap, function (v) { set("Sin", s.sin, v, function (x) { c.sin = Math.max(0, x); }); }, { cls: "t-sin", overMax: true })),
			s.sin > s.sinCap ? h("p", { class: "gm-flash" }, "Sin overflow: at the end of the scene, they give up or make a resistance check.") : null,
			h("div", { class: "gm-cols" },
				h("div", null,
					h("div", { class: "gm-label" }, "Hooks"),
					hu.hooks.length ? h("ul", { class: "gm-hooks" }, hu.hooks.map(function (hk, i) { return hookRow(c, hk, i); })) : h("p", { class: "note" }, "No hooks."),
					h("div", { class: "add-row" }, newHook, h("button", { class: "btn small", type: "button", onclick: function () {
						var name = newHook.value.trim();
						if (name) { H.addHook(c, name); commit(c); }
					} }, "Add hook")),
					h("div", { class: "gm-label" }, "Afflictions"),
					hu.afflictions.length ? h("ul", { class: "gm-hooks" }, hu.afflictions.map(function (af, i) {
						return h("li", null, h("span", { class: "gm-hook-name" }, typeof af === "string" ? af : af.name),
							h("button", { class: "mini-btn", type: "button", onclick: function () { H.removeAffliction(c, i); commit(c); } }, "Remove"));
					})) : h("p", { class: "note" }, "No afflictions."),
					h("div", { class: "add-row" }, newAff, h("button", { class: "btn small", type: "button", onclick: function () {
						var t = newAff.value.trim();
						if (t) { H.addAffliction(c, t); commit(c); }
					} }, "Add affliction"))),
				h("div", null,
					h("div", { class: "gm-label" }, "Loadout"),
					loadout(c))));
	}

	function notes() {
		var area = h("textarea", { class: "input", rows: 4, placeholder: "Clues found, NPCs met, the sin's tells...", "aria-label": "GM's notes", value: gm.notes });
		area.addEventListener("input", function () { gm.notes = area.value; save(); });
		return h("details", { class: "gm-notes", open: gm.notesOpen ? true : null,
			ontoggle: function (e) { gm.notesOpen = e.target.open; save(); } },
			h("summary", null, "GM's notes"),
			area);
	}

	function render() {
		load();
		var members = party();
		var current = members.filter(function (c) { return c.id === gm.active; })[0] || members[0] || null;
		var main = adding || !members.length ? addPanel(members) : detail(current);
		// The dock lives on <body>: the page's entrance animation would trap a
		// fixed element inside #app. The router removes it on other screens.
		var host = h("div", { id: "gm-dock-host" }, dock(members, current));
		document.body.appendChild(host);
		return h("div", { class: "gm-page" },
			h("div", { class: "page-head" },
				h("div", null,
					h("div", { class: "kicker" }, "Admin (GM)  /  " + members.length + " at the table"),
					h("h1", null, "GM desk"))),
			main,
			notes());
	}

	CAIN.screens.gm = { render: render };
})();
