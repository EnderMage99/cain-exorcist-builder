// App shell: theme, hash routing, the Registry home and the Doctrine content browser.
window.CAIN = window.CAIN || {};

(function () {
	var R = CAIN.rules;
	var core = CAIN.core;
	var app = document.getElementById("app");

	// Storage that never throws (private windows, blocked site data).
	var safeStore = {
		get: function (key, fallback) {
			try {
				var v = localStorage.getItem(key);
				return v === null ? fallback : JSON.parse(v);
			} catch (e) {
				return fallback;
			}
		},
		set: function (key, value) {
			try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ }
		}
	};
	CAIN.safeStore = safeStore;

	// Small DOM builder: h("div", { class: "x" }, child, "text", [more]).
	function h(tag, attrs) {
		var el = document.createElement(tag);
		if (attrs) {
			Object.keys(attrs).forEach(function (k) {
				var v = attrs[k];
				if (v === null || v === undefined || v === false) return;
				if (k === "class") el.className = v;
				else if (k.slice(0, 2) === "on") el.addEventListener(k.slice(2), v);
				else el.setAttribute(k, v === true ? "" : v);
			});
		}
		for (var i = 2; i < arguments.length; i++) append(el, arguments[i]);
		return el;
	}

	function append(el, child) {
		if (child === null || child === undefined || child === false) return;
		if (Array.isArray(child)) { child.forEach(function (c) { append(el, c); }); return; }
		el.appendChild(typeof child === "string" || typeof child === "number" ? document.createTextNode(String(child)) : child);
	}
	CAIN.h = h;

	// Rules text with CAT tokens highlighted. Lines starting "- " become lists.
	function richText(text, cat) {
		var wrap = h("div", { class: "entry-text" });
		var list = null;
		text.split("\n").forEach(function (line) {
			var bullet = /^- /.test(line);
			var body = inline(bullet ? line.slice(2) : line, cat);
			if (bullet) {
				if (!list) { list = h("ul"); wrap.appendChild(list); }
				list.appendChild(h("li", null, body));
			} else {
				list = null;
				wrap.appendChild(h("p", null, body));
			}
		});
		return wrap;
	}

	function inline(text, cat) {
		return R.resolveSegments(text, cat).map(function (seg) {
			if (!seg.token) return seg.text;
			var title = seg.dim ? "CAT " + seg.level + " " + seg.dim + " (from " + seg.token + ")" : seg.token + " = " + seg.text;
			return h("span", { class: "cat-token", title: title }, seg.text);
		});
	}
	CAIN.richText = richText;
	CAIN.inlineText = inline;

	var burstLabels = {
		required: "Psyche burst",
		onSuccess: "Burst on success",
		multiple: "Burst +",
		none: "No burst"
	};

	// Theme

	var themes = ["auto", "light", "dark"];

	function applyTheme(theme) {
		if (theme === "auto") document.documentElement.removeAttribute("data-theme");
		else document.documentElement.setAttribute("data-theme", theme);
		document.getElementById("theme-label").textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
	}

	var theme = safeStore.get("cain.theme", "auto");
	if (themes.indexOf(theme) < 0) theme = "auto";
	applyTheme(theme);
	document.getElementById("theme-toggle").addEventListener("click", function () {
		theme = themes[(themes.indexOf(theme) + 1) % themes.length];
		safeStore.set("cain.theme", theme);
		applyTheme(theme);
	});

	// Registry (home)

	var milestones = [
		{ id: "M0", text: "Site skeleton and GitHub Pages", done: true },
		{ id: "M1", text: "Rules engine and test content", done: true },
		{ id: "M2", text: "Creation wizard", done: false },
		{ id: "M3", text: "Sheet, edit mode", done: false },
		{ id: "M4", text: "Play mode", done: false },
		{ id: "M5", text: "Sessions, missions, advances", done: false },
		{ id: "M6", text: "Sharing by file and link", done: false },
		{ id: "M7", text: "Print view and polish", done: false }
	];

	function renderRegistry() {
		var characters = safeStore.get("cain.characters", []);
		var list = characters.length
			? h("ul", { class: "status-list" }, characters.map(function (c) { return h("li", null, c.name || "Unnamed", h("span", { class: "label" }, c.xid || "")); }))
			: h("div", { class: "empty" },
				h("h2", null, "No exorcists on file"),
				h("p", null, "Registered exorcists are kept in this browser. The creation wizard arrives in the next build."),
				h("button", { class: "btn", type: "button", disabled: true }, "Register exorcist"));

		var powers = CAIN.blasphemies.reduce(function (n, b) { return n + b.powers.length; }, 0);
		var abilities = CAIN.agendas.reduce(function (n, a) { return n + a.abilities.length; }, 0);

		return [
			h("div", { class: "page-head" },
				h("div", null,
					h("div", { class: "kicker" }, "CASTLE personnel files"),
					h("h1", null, "Registered exorcists"))),
			h("div", { class: "card" }, list),
			h("div", { class: "grid", style: "margin-top:16px" },
				h("section", { class: "card" },
					h("div", { class: "card-head" }, h("h2", null, "Build status"), h("span", { class: "label" }, "Test build")),
					h("ul", { class: "status-list" }, milestones.map(function (m) {
						return h("li", null, h("span", { class: m.done ? "done" : "todo" }, m.id + "  " + m.text), h("span", { class: "label" }, m.done ? "Done" : "Planned"));
					}))),
				h("section", { class: "card" },
					h("div", { class: "card-head" }, h("h2", null, "Loaded doctrine"), h("span", { class: "label" }, "Test content")),
					h("ul", { class: "status-list" },
						h("li", null, "Agendas", h("span", null, CAIN.agendas.map(function (a) { return a.name; }).join(", "))),
						h("li", null, "Agenda abilities", h("span", null, String(abilities))),
						h("li", null, "Blasphemies", h("span", null, CAIN.blasphemies.map(function (b) { return b.name; }).join(", "))),
						h("li", null, "Blasphemy powers", h("span", null, String(powers) + " + Blast")),
						h("li", null, "Sin marks", h("span", null, CAIN.sinMarks.map(function (m) { return m.name; }).join(", "))),
						h("li", null, "Kit shop items", h("span", null, String(CAIN.kit.length)))),
					h("p", { class: "note", style: "margin-top:10px" }, "Browse it all under Doctrine. ",
						h("a", { href: "tests/rules-test.html" }, "Run the rules checks"), ".")))
		];
	}

	// Doctrine (content browser)

	var doctrineTabs = [
		{ id: "agendas", name: "Agendas" },
		{ id: "blasphemies", name: "Blasphemies" },
		{ id: "sinmarks", name: "Sin marks" },
		{ id: "kit", name: "Kit" },
		{ id: "cat", name: "CAT scale" },
		{ id: "glossary", name: "Glossary" }
	];

	var doctrine = safeStore.get("cain.doctrine", { tab: "agendas", cat: 1 });
	if (!doctrineTabs.some(function (t) { return t.id === doctrine.tab; })) doctrine.tab = "agendas";
	if (!(doctrine.cat >= 0 && doctrine.cat <= core.catMax)) doctrine.cat = 1;

	function setDoctrine(change) {
		Object.assign(doctrine, change);
		safeStore.set("cain.doctrine", doctrine);
		render();
	}

	function agendaCard(a, cat) {
		return h("article", { class: "card" },
			h("div", { class: "card-head" }, h("h2", null, a.name), h("span", { class: "label" }, "Registered agenda")),
			h("div", { class: "label" }, "Items"),
			h("ul", { class: "items" }, a.items.map(function (it) {
				return h("li", { class: it.bold ? "bold" : null }, it.text);
			})),
			h("div", { class: "label" }, "Abilities"),
			h("ul", { class: "entries" }, a.abilities.map(function (ab) {
				return h("li", { class: "entry" }, h("div", { class: "entry-name" }, ab.name), richText(ab.text, cat));
			})));
	}

	function powerEntry(p, cat) {
		var tags = [p.tags.duration, p.tags.effect, p.tags.range].filter(Boolean);
		return h("li", { class: "entry" },
			h("div", { class: "entry-name" }, p.name),
			h("div", { class: "tags" },
				tags.map(function (t) { return h("span", { class: "tag" }, inline(t, cat)); }),
				h("span", { class: "tag burst" }, burstLabels[p.burst])),
			richText(p.text, cat));
	}

	function blasphemyCard(b, cat) {
		return h("article", { class: "card" },
			h("div", { class: "card-head" },
				h("h2", null, b.name),
				h("span", { class: "label" }, b.numeral ? "Blasphemy " + b.numeral : "All exorcists")),
			b.flavor ? h("p", { class: "note" }, b.flavor) : null,
			b.passive ? h("div", { class: "passive" },
				h("div", { class: "entry-name" }, b.passive.name, h("span", { class: "tag stamp" }, "Passive")),
				richText(b.passive.text, cat)) : null,
			h("ul", { class: "entries" }, (b.powers || [b]).map(function (p) { return powerEntry(p, cat); })));
	}

	function sinMarkCard(m, cat) {
		return h("article", { class: "card" },
			h("div", { class: "card-head" }, h("h2", { class: "goth" }, m.name), h("span", { class: "label" }, "Location " + m.roll)),
			h("p", { class: "note" }, m.appearance),
			h("ul", { class: "entries" }, m.abilities.map(function (ab) {
				return h("li", { class: "entry" }, h("div", { class: "entry-name" }, "d6: " + ab.roll), richText(ab.text, cat));
			})));
	}

	function kitView() {
		return h("div", { class: "grid" },
			h("article", { class: "card" },
				h("div", { class: "card-head" }, h("h2", null, "Registered kit"), h("span", { class: "label" }, core.base.kitPoints + " KP")),
				h("ul", { class: "entries" }, core.defaultKit.map(function (k) {
					return h("li", { class: "entry" },
						h("div", { class: "entry-name" }, k.name, h("span", { class: "tag" }, k.kp + " KP")),
						h("div", { class: "entry-text" }, h("p", null, k.text)));
				}))),
			h("article", { class: "card" },
				h("div", { class: "card-head" }, h("h2", null, "Kit expansion"), h("span", { class: "label" }, "Scrip")),
				h("ul", { class: "entries" },
					CAIN.kit.map(function (k) {
						return h("li", { class: "entry" },
							h("div", { class: "entry-name" }, k.name),
							h("div", { class: "tags" },
								h("span", { class: "tag" }, k.scrip + " scrip"),
								k.kp !== null ? h("span", { class: "tag" }, k.kp + " KP") : null,
								k.tags.map(function (t) { return h("span", { class: "tag" }, t); }),
								h("span", { class: "tag" }, k.category)),
							h("div", { class: "entry-text" }, h("p", null, k.text)));
					}),
					h("li", { class: "entry" },
						h("div", { class: "entry-name" }, "Service weapon upgrade"),
						h("div", { class: "tags" }, h("span", { class: "tag" }, core.weaponUpgrade.cost + " scrip per CAT")),
						h("div", { class: "entry-text" }, h("p", null, "Upgrade both service weapons by +1 CAT, to a max of CAT " + core.weaponUpgrade.maxCat + "."))))));
	}

	function catView(cat) {
		var cols = [];
		for (var i = 0; i <= core.catMax; i++) cols.push(i);
		return h("div", { class: "card" },
			h("div", { class: "table-wrap" },
				h("table", { class: "cat-table" },
					h("thead", null, h("tr", null, h("th", { scope: "col" }, "CAT"), cols.map(function (c) {
						return h("th", { scope: "col", class: c === cat ? "current" : null }, h("span", { class: "cat-num" }, String(c)), core.catNames[c]);
					}))),
					h("tbody", null, core.catDimensions.map(function (dim) {
						return h("tr", null, h("th", { scope: "row" }, dim), cols.map(function (c) {
							return h("td", { class: c === cat ? "current" : null }, core.catTable[dim][c]);
						}));
					})))),
			h("p", { class: "note", style: "margin-top:12px" },
				"Use CAT 0 for general human or mundane capabilities. Higher CAT effects against lower CAT targets are more effective and may not need a roll if 3 or more lower. Lower against higher is less effective, riskier or harder, and may be impossible if 3 or more higher."));
	}

	function glossaryView() {
		var terms = Object.keys(core.glossary).sort();
		return h("div", { class: "card" }, h("dl", { class: "glossary" }, terms.map(function (t) {
			return [h("dt", null, t), h("dd", null, core.glossary[t])];
		})));
	}

	function renderDoctrine() {
		var cat = doctrine.cat;
		var body;
		if (doctrine.tab === "agendas") body = h("div", { class: "grid" }, CAIN.agendas.map(function (a) { return agendaCard(a, cat); }));
		else if (doctrine.tab === "blasphemies") body = h("div", { class: "grid" }, blasphemyCard(CAIN.blast, cat), CAIN.blasphemies.map(function (b) { return blasphemyCard(b, cat); }));
		else if (doctrine.tab === "sinmarks") body = h("div", { class: "grid" }, CAIN.sinMarks.map(function (m) { return sinMarkCard(m, cat); }));
		else if (doctrine.tab === "kit") body = kitView();
		else if (doctrine.tab === "cat") body = catView(cat);
		else body = glossaryView();

		var catChips = [];
		for (var c = 0; c <= core.catMax; c++) {
			(function (value) {
				catChips.push(h("button", {
					class: "chip", type: "button", "aria-pressed": String(value === cat),
					title: "CAT " + value + ": " + core.catNames[value],
					onclick: function () { setDoctrine({ cat: value }); }
				}, String(value)));
			})(c);
		}

		return [
			h("div", { class: "page-head" },
				h("div", null,
					h("div", { class: "kicker" }, "Reference"),
					h("h1", null, "Doctrine"))),
			h("div", { class: "toolbar" },
				h("div", { class: "tabs", role: "tablist" }, doctrineTabs.map(function (t) {
					return h("button", {
						class: "tab", type: "button", role: "tab", "aria-selected": String(t.id === doctrine.tab),
						onclick: function () { setDoctrine({ tab: t.id }); }
					}, t.name);
				})),
				h("div", { class: "cat-picker" },
					h("span", { class: "label" }, "Show at CAT"),
					catChips)),
			body
		];
	}

	// Router

	var routes = {
		"": { id: "registry", render: renderRegistry },
		"doctrine": { id: "doctrine", render: renderDoctrine }
	};

	function currentRoute() {
		var key = location.hash.replace(/^#\/?/, "").split("?")[0];
		return routes[key] || routes[""];
	}

	var lastRoute = null;

	function render() {
		var route = currentRoute();
		app.textContent = "";
		append(app, route.render());
		document.querySelectorAll(".nav a[data-route]").forEach(function (a) {
			if (a.getAttribute("data-route") === route.id) a.setAttribute("aria-current", "page");
			else a.removeAttribute("aria-current");
		});
		if (lastRoute !== route.id) {
			window.scrollTo(0, 0);
			lastRoute = route.id;
		}
	}

	window.addEventListener("hashchange", render);
	render();
})();
