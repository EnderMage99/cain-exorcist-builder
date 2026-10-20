// The search box in the top bar. It finds Doctrine sections, agendas,
// blasphemies, virtues, sin marks, kit, rules, glossary terms and your saved
// exorcists. Picking a section opens it; picking an entry opens its section
// and shows the entry in the focus viewer; the last row searches Doctrine.
window.CAIN = window.CAIN || {};

(function () {
	var h = CAIN.h;
	var MAX = 9;

	function sectionOf(kind) {
		return { agenda: "agendas", blasphemy: "blasphemies", virtue: "virtues", sinmark: "sinmarks", kit: "kit" }[kind];
	}

	// Everything searchable, built fresh each time the box opens (so new custom
	// content and exorcists show up).
	function index() {
		var out = [];
		(CAIN.app.sections || []).forEach(function (s) {
			out.push({ name: s.name, kind: "Doctrine section", icon: [].concat(s.art)[0], ink: s.kind === "ink", go: function () { location.hash = "#/doctrine/" + s.id; } });
		});
		out.push({ name: "Doctrine", kind: "Every section", icon: "img/sheet/emblem.png", ink: true, go: function () { location.hash = "#/doctrine"; } });
		function entry(kind, x, label, icon, ink) {
			var src = CAIN.sourceOf(x);
			out.push({ name: x.name, kind: label + (src ? " · " + (src.short || src.name) : ""), icon: icon, ink: ink, view: kind + ":" + x.id, section: sectionOf(kind) });
		}
		CAIN.agendas.forEach(function (a) { entry("agenda", a, "Agenda", CAIN.agendaIcon(a)); });
		CAIN.blasphemies.forEach(function (b) { entry("blasphemy", b, "Blasphemy", CAIN.blasphemyIcon(b)); });
		(CAIN.virtues || []).forEach(function (v) { entry("virtue", v, "Virtue", v.image || "img/virtue/" + v.id + ".jpg"); });
		CAIN.sinMarks.forEach(function (m) { entry("sinmark", m, "Sin mark", null); });
		CAIN.kit.forEach(function (k) { entry("kit", k, "Kit · " + k.category, k.image || null, !!k.image && k.image.indexOf("img/kit/") === 0); });
		(CAIN.ruleSections ? CAIN.ruleSections() : []).forEach(function (r) {
			var virtue = (CAIN.virtueSections || []).indexOf(r) >= 0;
			var src = CAIN.sourceOf(r);
			out.push({ name: r.name, kind: (virtue ? "Virtue rules" : "Shop and gear rules") + (src ? " · " + (src.short || src.name) : ""), view: "rules:" + CAIN.ruleSlug(r.name), section: virtue ? "virtues" : "kit" });
		});
		Object.keys(CAIN.core.glossary || {}).forEach(function (t) {
			out.push({ name: t, kind: "Glossary", detail: CAIN.core.glossary[t], go: function () { location.hash = "#/doctrine/reference"; } });
		});
		CAIN.store.list().forEach(function (c) {
			out.push({ name: c.name || "Unnamed exorcist", kind: "Your exorcist", icon: c.portrait || null, go: function () { location.hash = "#/c/" + c.id; } });
		});
		return out;
	}

	// Best matches first: whole name, then name start, then a word start, then anywhere.
	function find(q) {
		var s = q.trim().toLowerCase();
		if (!s) return [];
		return index().map(function (e) {
			var n = e.name.toLowerCase();
			var score = n === s ? 0 : n.indexOf(s) === 0 ? 1 : n.split(/[\s\-/(]+/).some(function (w) { return w.indexOf(s) === 0; }) ? 2 : n.indexOf(s) >= 0 ? 3 : 9;
			return { e: e, score: score };
		}).filter(function (r) { return r.score < 9; }).sort(function (a, b) {
			return a.score - b.score || (a.e.kind === "Doctrine section" ? -1 : 0) - (b.e.kind === "Doctrine section" ? -1 : 0) || a.e.name.localeCompare(b.e.name);
		}).slice(0, MAX).map(function (r) { return r.e; });
	}

	// The matching part of a name, highlighted.
	function marked(name, q) {
		var i = name.toLowerCase().indexOf(q.trim().toLowerCase());
		if (i < 0 || !q.trim()) return name;
		var n = q.trim().length;
		return [name.slice(0, i), h("mark", null, name.slice(i, i + n)), name.slice(i + n)];
	}

	function go(e) {
		if (e.go) { e.go(); return; }
		var open = function () { if (CAIN.viewer) CAIN.viewer.open(e.view); };
		if (location.hash === "#/doctrine/" + e.section) open();
		else {
			location.hash = "#/doctrine/" + e.section;
			setTimeout(open, 60);
		}
	}

	// The section with the most hits, for "search Doctrine for ...".
	function bestSection(q) {
		var counts = {};
		find(q).concat(index().filter(function (e) { return e.section && e.name.toLowerCase().indexOf(q.trim().toLowerCase()) >= 0; }))
			.forEach(function (e) { if (e.section) counts[e.section] = (counts[e.section] || 0) + 1; });
		var best = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; })[0];
		return best || "blasphemies";
	}

	function build(slot) {
		var listId = "site-search-list";
		var input = h("input", { class: "site-search-input", type: "search", placeholder: "Search CAIN...", autocomplete: "off", spellcheck: "false",
			role: "combobox", "aria-expanded": "false", "aria-controls": listId, "aria-autocomplete": "list", "aria-label": "Search agendas, blasphemies, virtues, kit and more" });
		var list = h("ul", { class: "site-search-list", id: listId, role: "listbox", hidden: true });
		var icon = h("span", { class: "site-search-icon", "aria-hidden": "true" });
		var rows = [];
		var active = -1;

		function setActive(i) {
			active = i;
			rows.forEach(function (r, j) { r.el.classList.toggle("active", j === i); r.el.setAttribute("aria-selected", String(j === i)); });
			if (i >= 0) { input.setAttribute("aria-activedescendant", rows[i].el.id); rows[i].el.scrollIntoView({ block: "nearest" }); }
			else input.removeAttribute("aria-activedescendant");
		}

		function close() {
			list.hidden = true;
			input.setAttribute("aria-expanded", "false");
			setActive(-1);
		}

		function pick(r) {
			close();
			input.value = "";
			input.blur();
			r.run();
		}

		function refresh() {
			var q = input.value;
			list.textContent = "";
			rows = [];
			if (!q.trim()) { close(); return; }
			find(q).forEach(function (e, i) {
				var pic = e.icon
					? h("span", { class: "ss-pic" + (e.ink ? " ink" : "") }, h("img", { src: e.icon, alt: "" }))
					: h("span", { class: "ss-pic ss-pic-text" }, e.kind === "Sin mark" ? "✷" : e.kind === "Glossary" ? "Aa" : "§");
				var el = h("li", { class: "ss-row", id: "ss-opt-" + i, role: "option", "aria-selected": "false" },
					pic, h("span", { class: "ss-text" }, h("span", { class: "ss-name" }, marked(e.name, q)), h("span", { class: "ss-kind" }, e.kind)));
				rows.push({ el: el, run: function () { go(e); } });
			});
			var all = h("li", { class: "ss-row ss-all", id: "ss-opt-all", role: "option", "aria-selected": "false" },
				h("span", { class: "ss-pic ss-pic-text" }, "⌕"), h("span", { class: "ss-text" }, h("span", { class: "ss-name" }, "Search Doctrine for ", h("strong", null, q.trim()))));
			rows.push({ el: all, run: function () { CAIN.app.searchDoctrine(bestSection(q), q.trim()); } });
			rows.forEach(function (r, i) {
				r.el.addEventListener("mousedown", function (ev) { ev.preventDefault(); pick(r); });
				r.el.addEventListener("mousemove", function () { if (active !== i) setActive(i); });
				list.appendChild(r.el);
			});
			list.hidden = false;
			input.setAttribute("aria-expanded", "true");
			setActive(0);
		}

		input.addEventListener("input", refresh);
		input.addEventListener("focus", function () { if (input.value.trim()) refresh(); });
		input.addEventListener("blur", function () { setTimeout(close, 120); });
		input.addEventListener("keydown", function (ev) {
			if (ev.key === "ArrowDown") { ev.preventDefault(); if (rows.length) setActive((active + 1) % rows.length); }
			else if (ev.key === "ArrowUp") { ev.preventDefault(); if (rows.length) setActive((active - 1 + rows.length) % rows.length); }
			else if (ev.key === "Enter") { ev.preventDefault(); if (rows[active]) pick(rows[active]); }
			else if (ev.key === "Escape") { if (!list.hidden) { ev.preventDefault(); close(); } else input.blur(); }
		});
		// "/" anywhere focuses the box, like most sites.
		document.addEventListener("keydown", function (ev) {
			var t = ev.target;
			if (ev.key !== "/" || ev.ctrlKey || ev.metaKey || (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable))) return;
			if (document.querySelector(".viewer")) return;
			ev.preventDefault();
			input.focus();
		});

		slot.appendChild(icon);
		slot.appendChild(input);
		slot.appendChild(list);
	}

	var slot = document.getElementById("site-search");
	if (slot) build(slot);
})();
