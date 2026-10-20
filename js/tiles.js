// Compact tiles for browsing agendas, blasphemies, virtues, sin marks and kit:
// a picture taking 35% of the tile and a few key facts. The whole entry is kept
// in data-search so Doctrine's search still finds anything in it, and clicking a
// tile opens the full entry in the focus viewer (data-view).
window.CAIN = window.CAIN || {};

(function () {
	var h = CAIN.h;
	var SKIP = { id: 1, image: 1, theme: 1, look: 1, source: 1, burst: 1, rank: 1, roll: 1, modifiers: 1, flags: 1, use: 1 };

	// Every bit of text in an entry, for search.
	function searchText(x) {
		var out = [];
		(function walk(v, key) {
			if (SKIP[key] || v === null || v === undefined) return;
			if (typeof v === "string") out.push(v);
			else if (typeof v === "number") return;
			else if (Array.isArray(v)) v.forEach(function (y) { walk(y); });
			else if (typeof v === "object") Object.keys(v).forEach(function (k) { walk(v[k], k); });
		})(x);
		return out.join(" ").replace(/\{[^}]*\}/g, "CAT");
	}

	function clamp(text, lines) {
		return text ? h("p", { class: "ct-clamp", style: "-webkit-line-clamp:" + (lines || 2) }, String(text).replace(/\{([^}:]*)(:[^}]*)?\}/g, "CAT")) : null;
	}

	function chips(list) {
		list = list.filter(Boolean);
		return list.length ? h("div", { class: "ct-chips" }, list.map(function (t) { return h("span", { class: "ct-chip" }, t); })) : null;
	}

	function img(src, cls) {
		return src ? h("img", { class: cls || "", src: src, alt: "", draggable: "false", loading: "lazy" }) : null;
	}

	// kind: agenda, blasphemy, virtue, sinmark, kit. opts: { selected, locked,
	// actions: element(s) shown at the bottom (buttons don't open the viewer) }.
	function tile(kind, x, opts) {
		opts = opts || {};
		var cls = "card compact-tile ct-" + kind + CAIN.sourceClass(x);
		var style = null;
		var pic, name, sub, body = [];
		if (kind === "blasphemy" || kind === "virtue") {
			var th = CAIN.blasTheme(x);
			cls += " " + th.class;
			style = th.style;
		}
		if (kind === "agenda") {
			var look = CAIN.agendaLook(x);
			style = look.style;
			pic = h("div", { class: "ct-pic ct-emblem " + look.class.replace(/fan-made|src-\S+/g, "") }, img(CAIN.agendaIcon(x)) || h("span", { class: "ag-emblem ag-emblem-blank" }));
			var book = x.source && CAIN.sources[x.source] && !CAIN.sources[x.source].fan ? CAIN.sources[x.source].name : null;
			sub = x.custom ? "Custom agenda" : book || "Registered agenda";
			body.push(h("ul", { class: "ct-items" }, x.items.map(function (it) { return h("li", { class: it.bold ? "bold" : null }, it.text); })));
			body.push(clamp(x.abilities.length + (x.abilities.length === 1 ? " ability: " : " abilities: ") + x.abilities.map(function (a) { return a.name; }).join(", "), 2));
		} else if (kind === "blasphemy") {
			pic = h("div", { class: "ct-pic" }, img(CAIN.blasphemyIcon(x)));
			sub = x.numeral ? "Blasphemy " + x.numeral : x.group || (x.custom ? "Custom blasphemy" : "Blasphemy");
			body.push(clamp(x.summary, 2));
			if (x.passive) body.push(h("p", { class: "ct-line" }, h("strong", null, "Passive: "), x.passive.name));
			body.push(chips((x.powers || []).map(function (p) { return p.name; })));
		} else if (kind === "virtue") {
			pic = h("div", { class: "ct-pic" }, img(x.image || "img/virtue/" + x.id + ".jpg"));
			sub = x.epithet;
			body.push(clamp("Stricture: " + x.stricture, 2));
			body.push(h("p", { class: "ct-line" }, h("strong", null, "High blasphemy: "), (x.powers || []).map(function (p) { return p.name; }).join(", ")));
		} else if (kind === "sinmark") {
			pic = h("div", { class: "ct-pic ct-pic-text" }, h("span", { class: "ct-big" }, String(x.roll)), h("span", null, "Location d6"));
			sub = "Sin mark";
			body.push(clamp(x.appearance, 2));
			body.push(chips(x.abilities.map(function (a) { return a.roll + ". " + (a.short || ""); })));
		} else if (kind === "kit") {
			var picEl = CAIN.kitPicture(x);
			pic = picEl ? h("div", { class: "ct-pic ct-kitpic" }, picEl) : h("div", { class: "ct-pic ct-pic-text" }, h("span", { class: "ct-big" }, x.scrip === null ? "?" : String(x.scrip)), h("span", null, x.scrip === null ? "Auction" : "Scrip"));
			sub = x.category;
			body.push(chips([x.scrip === null ? "Auction" : x.scrip + " scrip", x.kp !== null ? x.kp + " KP" : null].concat(x.tags || [])));
			body.push(clamp(x.text, 2));
		}
		name = x.name;
		// A steady per-card tilt (from the id), so the table and wall look scattered.
		var hash = 0;
		String(x.id).split("").forEach(function (ch) { hash = (hash * 31 + ch.charCodeAt(0)) % 997; });
		var tilt = ((hash % 7) - 3) * 0.6;
		style = (style ? style + ";" : "") + "--tilt:" + tilt.toFixed(1) + "deg;--lift:" + (hash % 5) + "px";
		return h("article", { class: cls + (opts.selected ? " selected" : "") + (opts.locked ? " locked" : ""), style: style,
			"data-fx": kind === "blasphemy" ? x.id : null, "data-view": kind + ":" + x.id, "data-search": searchText(x), tabindex: "0", "aria-label": "Open " + name },
			pic,
			h("div", { class: "ct-body" },
				h("h2", { class: "ct-name" }, name),
				h("p", { class: "ct-sub" }, sub, opts.selected ? h("span", { class: "tag stamp" }, opts.selectedLabel || "Selected") : null),
				opts.locked ? h("p", { class: "ct-locked" }, opts.locked) : null,
				body,
				opts.actions ? h("div", { class: "ct-actions" }, opts.actions) : null),
			kind === "blasphemy" ? h("span", { class: "ct-fx", "aria-hidden": "true" }) : null);
	}

	// A grid of tiles. items: the entries; opts(x) gives each tile's options.
	function tileGrid(kind, items, opts) {
		return h("div", { class: "grid tile-grid tg-" + kind }, items.map(function (x) { return tile(kind, x, opts ? opts(x) : null); }));
	}

	// Rules sections (virtue affinity, shop rules...) as one row of buttons; each
	// opens its full text in the viewer.
	function ruleSlug(name) { return String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
	function ruleSections() { return (CAIN.virtueSections || []).concat(CAIN.kitSections || []); }
	function ruleRow(title, sections) {
		if (!sections || !sections.length) return null;
		return h("section", { class: "rule-row", "aria-label": title },
			h("span", { class: "label" }, title),
			h("div", { class: "rule-row-chips" }, sections.map(function (sec) {
				var src = CAIN.sourceOf(sec);
				return h("button", { class: "rule-chip" + CAIN.sourceClass(sec), type: "button", "data-view": "rules:" + ruleSlug(sec.name),
					title: "Read " + sec.name + (src && src.fan ? " (fan-made: " + src.name + ")" : "") }, sec.name,
					src && src.fan ? h("span", { class: "rule-chip-src" }, src.short || src.name) : null);
			})));
	}
	CAIN.ruleSlug = ruleSlug;
	CAIN.ruleSections = ruleSections;
	CAIN.ruleRow = ruleRow;
	CAIN.compactTile = tile;
	CAIN.tileGrid = tileGrid;
})();
