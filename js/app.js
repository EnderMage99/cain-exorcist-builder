// App shell: theme, hash routing, the Registry home and the Doctrine content browser.
window.CAIN = window.CAIN || {};

(function () {
	var R = CAIN.rules;
	var core = CAIN.core;
	var h = CAIN.h;
	var safeStore = CAIN.safeStore;
	var store = CAIN.store;
	var richText = CAIN.richText;
	var inline = CAIN.inlineText;
	var app = document.getElementById("app");

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

	// Import state for the registry: result messages, characters waiting on a
	// replace / keep both / skip choice, and the paste box.
	var transferUi = { message: "", warnings: [], conflicts: [], pasteOpen: false, pasteText: "" };

	// Saves imported characters. Ones already in this browser wait for a choice.
	function importText(text, source) {
		var result = CAIN.transfer.unpack(text);
		transferUi.warnings = result.warnings;
		if (result.error) {
			transferUi.message = result.error;
			render();
			return;
		}
		var saved = [];
		result.characters.forEach(function (c) {
			if (store.get(c.id)) transferUi.conflicts.push(c);
			else { store.save(c); saved.push(c.name || "an exorcist"); }
		});
		var parts = [];
		if (saved.length) parts.push("Imported " + saved.join(", ") + " from " + source + ".");
		if (transferUi.conflicts.length) parts.push(transferUi.conflicts.length + " already in this browser: choose below.");
		transferUi.message = parts.join(" ");
		transferUi.pasteOpen = false;
		transferUi.pasteText = "";
		render();
	}

	function importFile(file) {
		var reader = new FileReader();
		reader.onload = function () { importText(String(reader.result), file.name); };
		reader.readAsText(file);
	}

	function resolveConflict(c, choice) {
		transferUi.conflicts = transferUi.conflicts.filter(function (x) { return x !== c; });
		if (choice === "replace") {
			store.save(c);
			transferUi.message = "Replaced " + (c.name || "the exorcist") + " with the imported copy.";
		} else if (choice === "both") {
			c.id = R.newCharacter().id;
			c.name = (c.name || "Unnamed") + " (imported)";
			store.save(c);
			transferUi.message = "Kept both: the imported one is " + c.name + ".";
		} else {
			transferUi.message = "Skipped " + (c.name || "the exorcist") + ".";
		}
		render();
	}

	function conflictCard(c) {
		var existing = store.get(c.id);
		var when = existing && existing.updated ? new Date(existing.updated).toLocaleString() : "unknown";
		return h("div", { class: "card conflict" },
			h("p", null, h("strong", null, c.name || "Unnamed"), " is already in this browser (last changed " + when + ")."),
			h("div", { class: "btn-row" },
				h("button", { class: "btn small", type: "button", onclick: function () { resolveConflict(c, "replace"); } }, "Replace mine"),
				h("button", { class: "btn small ghost", type: "button", onclick: function () { resolveConflict(c, "both"); } }, "Keep both"),
				h("button", { class: "btn small ghost", type: "button", onclick: function () { resolveConflict(c, "skip"); } }, "Skip")));
	}

	function transferArea() {
		var out = [];
		if (transferUi.message) out.push(h("p", { class: "transfer-message", role: "status" }, transferUi.message));
		if (transferUi.warnings.length) {
			out.push(h("div", { class: "card warn" },
				h("div", { class: "label" }, "Imported with notes"),
				h("ul", { class: "plain-list" }, transferUi.warnings.map(function (w) { return h("li", null, w); }))));
		}
		transferUi.conflicts.forEach(function (c) { out.push(conflictCard(c)); });
		if (transferUi.pasteOpen) {
			var area = h("textarea", { class: "input paste-box", rows: 6, placeholder: "Paste an exorcist copied with \"Copy as text\"", "aria-label": "Pasted exorcist", value: transferUi.pasteText });
			area.addEventListener("input", function () { transferUi.pasteText = area.value; });
			out.push(h("div", { class: "card" },
				h("div", { class: "card-head" }, h("h2", null, "Paste an exorcist"),
					h("button", { class: "mini-btn", type: "button", onclick: function () { transferUi.pasteOpen = false; render(); } }, "Close")),
				area,
				h("div", { class: "btn-row" }, h("button", { class: "btn small", type: "button", onclick: function () {
					if (area.value.trim()) importText(area.value, "pasted text");
				} }, "Import"))));
		}
		return out;
	}

	// Dropping a file anywhere on the registry imports it.
	function dropZone(el) {
		el.addEventListener("dragover", function (e) {
			if (!e.dataTransfer || [].indexOf.call(e.dataTransfer.types, "Files") < 0) return;
			e.preventDefault();
			el.classList.add("dropping");
		});
		el.addEventListener("dragleave", function (e) {
			if (!el.contains(e.relatedTarget)) el.classList.remove("dropping");
		});
		el.addEventListener("drop", function (e) {
			e.preventDefault();
			el.classList.remove("dropping");
			var file = e.dataTransfer.files && e.dataTransfer.files[0];
			if (file) importFile(file);
		});
		return el;
	}

	function characterCard(c) {
		var d = R.derived(c);
		var a = c.agenda ? R.agenda(c.agenda) : null;
		var blas = c.blasphemies.map(function (b) { var x = R.blasphemy(b.id); return x ? x.name : b.id; }).join(" + ");
		return h("li", null, h("a", { class: "roster-card", href: "#/c/" + c.id },
			h("span", { class: "roster-cat", title: "Category " + d.cat }, h("span", { class: "label" }, "CAT"), String(d.cat)),
			h("span", { class: "roster-body" },
				h("span", { class: "roster-name" }, c.name || "Unnamed"),
				h("span", { class: "roster-meta" }, [c.xid, a ? a.name : null, blas].filter(Boolean).join("  /  "))),
			h("span", { class: "roster-stats" },
				h("span", null, "Sin " + c.sin + "/" + d.sinCap),
				h("span", null, "Scrip " + c.scrip),
				h("span", null, c.missionsSurvived + " missions"))));
	}

	// A big picture tile (home page and Doctrine hub). art: one picture or a strip
	// of several. kind: "photo" (fills the tile), "emblem" (round agenda emblems,
	// whole) or "ink" (line drawings, lightened).
	function bigTile(area, title, sub, art, kind, attrs) {
		var a = Object.assign({ class: "home-tile tile-" + area }, attrs);
		var tag = a.href ? "a" : a["for"] ? "label" : "button";
		if (tag === "button") a.type = "button";
		var pics = h("span", { class: "home-tile-art art-" + kind, "aria-hidden": "true" }, [].concat(art).map(function (src) {
			return h("img", { src: src, alt: "", draggable: "false", loading: "lazy" });
		}));
		return h(tag, a, pics, h("span", { class: "home-tile-title" }, title), sub ? h("span", { class: "home-tile-sub" }, sub) : null);
	}

	function renderRegistry() {
		var characters = store.list().slice().sort(function (a, b) { return (b.updated || 0) - (a.updated || 0); });
		var draft = store.getDraft();
		var fileInput = h("input", { type: "file", accept: ".json,application/json", class: "visually-hidden", id: "import-file",
			onchange: function () { if (fileInput.files[0]) importFile(fileInput.files[0]); fileInput.value = ""; } });

		var transferBar = h("div", { class: "transfer-bar" },
			h("span", { class: "label" }, "Move exorcists between browsers or players"),
			h("label", { class: "btn small ghost", for: "import-file", title: "Import a .cain.json file. You can also drop a file anywhere on this page." }, "Import file"),
			fileInput,
			h("button", { class: "btn small ghost", type: "button", onclick: function () { transferUi.pasteOpen = !transferUi.pasteOpen; render(); } }, "Paste text"),
			characters.length ? h("button", { class: "btn small ghost", type: "button", title: "Download every exorcist in this browser as one backup file", onclick: function () {
				var all = store.list();
				CAIN.downloadText(CAIN.transfer.fileName(all), CAIN.transfer.pack(all));
				transferUi.message = "Exported " + all.length + " exorcist" + (all.length === 1 ? "" : "s") + " to one file.";
				render();
			} }, "Export all") : null,
			h("span", { class: "note drop-hint" }, "or drop a file on this page"));

		var draftNote = draft ? h("div", { class: "card draft-note" },
			h("span", null, "Registration in progress: ", h("strong", null, draft.character.name || "unnamed exorcist"), " (" + draft.step + " step)."),
			h("a", { class: "mini-btn", href: "#/new" }, "Continue")) : null;

		var list = characters.length
			? h("ul", { class: "roster" }, characters.map(characterCard))
			: h("div", { class: "card empty" },
				h("h2", null, "No exorcists on file"),
				h("p", null, "Registered exorcists are kept in this browser. Register one step by step, or roll a Quick exorcist to see how it works."));

		// The big picture tiles in the middle of the home page.
		function toDoctrine(id) { return { href: "#/doctrine/" + id }; }
		var tile = bigTile;
		var tiles = h("nav", { class: "home-tiles", "aria-label": "Start" },
			tile("reg", draft ? "Resume exorcist" : "Register exorcist", draft ? "Unfinished: " + (draft.character.name || "unnamed") + ", at the " + draft.step.charAt(0).toUpperCase() + draft.step.slice(1) + " step" : "Step by step", "img/virtue/justice.jpg", "photo", { href: "#/new" }),
			tile("quick", "Quick exorcist", "A random legal exorcist", "img/blasphemy/gate.jpg", "photo", { onclick: function () { CAIN.registration.quickExorcist(); location.hash = "#/new"; } }),
			tile("imp", "Import", "A .cain.json file", "img/blasphemy/palace.jpg", "photo", { "for": "import-file", tabindex: "0", onkeydown: function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.click(); } } }),
			tile("ag", "Agendas", null, ["img/agenda/beast.png", "img/agenda/guardian.png", "img/agenda/loner.png", "img/agenda/firebug.png"], "emblem", toDoctrine("agendas")),
			tile("blas", "Blasphemies", null, ["img/blasphemy/tension.jpg", "img/blasphemy/ardence.jpg", "img/blasphemy/gate.jpg", "img/blasphemy/edit.jpg", "img/blasphemy/jaunt.jpg"], "photo", toDoctrine("blasphemies")),
			tile("virt", "Virtues", null, ["img/virtue/justice.jpg", "img/virtue/faith.jpg", "img/virtue/charity.jpg", "img/virtue/fortitude.jpg", "img/virtue/hope.jpg", "img/virtue/prudence.jpg"], "photo", toDoctrine("virtues")),
			tile("kit", "Kit", null, ["img/kit/red-herb.png", "img/kit/qlippoth.png", "img/kit/black-body.png"], "ink", toDoctrine("kit")),
			tile("doc", "Doctrine", "Sin marks, CAT scale, glossary", "img/sheet/emblem.png", "ink", { href: "#/doctrine" }));

		return dropZone(h("div", { class: "registry-page" },
			h("h1", { class: "visually-hidden" }, "CAIN Exorcist Registry"),
			tiles,
			h("h2", { class: "home-banner" }, "Exorcists"),
			transferBar,
			transferArea(),
			draftNote,
			list));
	}

	// Doctrine (content browser)

	// Doctrine is a hub of big tiles; each section is its own page with a way
	// back to the hub, but no tabs to jump sideways.
	var doctrineSections = [
		{ id: "agendas", name: "Agendas", blurb: "How your exorcist approaches problems. Following its items earns XP.",
			art: ["img/agenda/beast.png", "img/agenda/guardian.png", "img/agenda/loner.png", "img/agenda/firebug.png"], kind: "emblem" },
		{ id: "blasphemies", name: "Blasphemies", blurb: "Psychic powers: a passive and the powers you pick.",
			art: ["img/blasphemy/tension.jpg", "img/blasphemy/ardence.jpg", "img/blasphemy/gate.jpg", "img/blasphemy/edit.jpg"], kind: "photo" },
		{ id: "virtues", name: "Virtues", blurb: "CAIN's living legends, and the bonds an exorcist can form with them.",
			art: ["img/virtue/justice.jpg", "img/virtue/faith.jpg", "img/virtue/charity.jpg", "img/virtue/hope.jpg"], kind: "photo" },
		{ id: "sinmarks", name: "Sin marks", blurb: "What sin overflow leaves behind, by location and d6.",
			art: ["img/sheet/splat-1.png", "img/sheet/splat-2.png", "img/sheet/splat-3.png"], kind: "ink" },
		{ id: "kit", name: "Kit", blurb: "Everything an exorcist can carry, buy, or steal.",
			art: ["img/kit/red-herb.png", "img/kit/qlippoth.png", "img/kit/black-body.png"], kind: "ink" },
		{ id: "reference", name: "CAT scale & glossary", blurb: "What each category means, and the game's terms.",
			art: ["img/sheet/brain.png"], kind: "ink" }
	];

	var doctrine = safeStore.get("cain.doctrine", { tab: "agendas", cat: 1 });
	if (!(doctrine.cat >= 0 && doctrine.cat <= core.catMax)) doctrine.cat = 1;

	function setDoctrine(change) {
		Object.assign(doctrine, change);
		safeStore.set("cain.doctrine", doctrine);
		render();
	}

	// The CAT picker, drawn with the character sheet's triangles: 0 to 7, the
	// current one in red and lower ones shaded.
	var CAT_ROMAN = ["0", "I", "II", "III", "IV", "V", "VI", "VII"];
	function catPicker() {
		var cat = doctrine.cat;
		var tiers = [];
		for (var v = 0; v <= core.catMax; v++) {
			(function (value) {
				tiers.push(h("li", { class: "cat-tier" + (value === cat ? " current" : "") + "" },
					h("button", { class: "cat-btn", type: "button", "aria-pressed": String(value === cat), title: "Show values at CAT " + value + ": " + core.catNames[value],
						"aria-label": "CAT " + value + ", " + core.catNames[value], onclick: function () { setDoctrine({ cat: value }); } },
						h("span", { class: "cat-tri" }, CAT_ROMAN[value]),
						h("span", { class: "label" }, core.catNames[value]))));
			})(v);
		}
		return h("div", { class: "doc-cat" }, h("span", { class: "label" }, "Show values at CAT"), h("ol", { class: "cat-tiers doc-cat-tiers" }, tiers));
	}

	function renderDoctrineHub() {
		return [
			h("div", { class: "page-head" },
				h("div", null,
					h("div", { class: "kicker" }, "Reference"),
					h("h1", null, "Doctrine"))),
			h("nav", { class: "home-tiles hub-tiles", "aria-label": "Doctrine sections" }, doctrineSections.map(function (s) {
				return bigTile("hub-" + s.id, s.name, s.blurb, s.art, s.kind, { href: "#/doctrine/" + s.id });
			}))
		];
	}

	function renderDoctrine(sectionId) {
		var sec = doctrineSections.filter(function (s) { return s.id === sectionId; })[0];
		if (!sec) return renderDoctrineHub();
		doctrine.tab = sec.id;
		var cat = doctrine.cat;
		var body;
		if (sec.id === "agendas") body = CAIN.tileGrid("agenda", CAIN.agendas);
		else if (sec.id === "blasphemies") body = h("div", null, h("div", { class: "grid" }, blasphemyCard(CAIN.blast, cat)), CAIN.tileGrid("blasphemy", CAIN.blasphemies));
		else if (sec.id === "virtues") body = virtuesView(cat);
		else if (sec.id === "sinmarks") body = h("div", { class: "anatomy" }, h("img", { class: "anatomy-body", src: "img/sheet/body.png", alt: "", "aria-hidden": "true" }), CAIN.tileGrid("sinmark", CAIN.sinMarks));
		else if (sec.id === "kit") body = kitView();
		else body = h("div", { class: "reference-view" }, h("h2", { class: "kit-group-title" }, "CAT scale"), catView(cat), h("h2", { class: "kit-group-title" }, "Glossary"), glossaryView());

		var bodyWrap = h("div", null, body);
		applyDocZoom(bodyWrap, docZoom());
		var i = doctrineSections.indexOf(sec);
		return [
			h("nav", { class: "crumbs", "aria-label": "Breadcrumb" },
				h("a", { href: "#/doctrine" }, "← Doctrine"),
				h("span", { class: "crumbs-count" }, (i + 1) + " / " + doctrineSections.length)),
			h("div", { class: "page-head" },
				h("div", null,
					h("div", { class: "kicker" }, "Doctrine"),
					h("h1", null, sec.name),
					h("p", { class: "lede" }, sec.blurb))),
			h("div", { class: "toolbar doc-toolbar" }, catPicker(), sizePicker(bodyWrap)),
			SEARCH_TABS.indexOf(sec.id) >= 0 ? searchBox(body) : null,
			bodyWrap
		];
	}

	function powerEntry(p, cat) {
		return h("li", { class: "entry" },
			CAIN.powerHead(p),
			CAIN.powerTags(p, cat),
			richText(p.text, cat));
	}

	function blasphemyCard(b, cat) {
		var th = CAIN.blasTheme(b);
		return h("article", { class: "card blas-card " + th.class + (b.powers ? "" : " blas-solo"), style: th.style, "data-view": b.powers ? "blasphemy:" + b.id : null, tabindex: b.powers ? "0" : null, "aria-label": b.powers ? "Open " + b.name : null },
			h("div", { class: "blas-intro" },
				CAIN.blasPortrait(b),
				h("div", { class: "blas-intro-text" },
					h("div", { class: "card-head" },
						h("h2", { class: "blas-title" }, b.name),
						h("span", { class: "label" }, b.numeral ? "Blasphemy " + b.numeral : b.powers ? (b.group || "Blasphemy") : "All exorcists")),
					CAIN.sourceBadge(b),
					CAIN.approvalTag(b),
					b.flavor ? h("p", { class: "note" }, b.flavor) : null)),
			b.passive ? h("div", { class: "passive" },
				h("div", { class: "entry-name" }, b.passive.name, h("span", { class: "tag stamp" }, "Passive")),
				richText(b.passive.text, cat)) : null,
			h("ul", { class: "entries" }, (b.powers || [b]).map(function (p) { return powerEntry(p, cat); })),
			CAIN.blasExtras(b, cat));
	}

	function virtuesView(cat) {
		return h("div", { class: "virtues-view" },
			h("div", { class: "grid" },
				h("article", { class: "card virtue-rules" },
					h("div", { class: "card-head" }, h("h2", null, "Virtue bonds"), h("span", { class: "label" }, "Games for Freaks, issue 1")),
					h("p", null, "Virtues are CAIN's six living weapons of last resort, background mentors your exorcist can study under or emulate between missions. At the start of any mission, pick a virtue to bond with: you gain its rank 0 ability at once. Survive the mission and the bond rises by 1, to III, granting each ability in turn. Bonds are permanent, and you can bond with a different virtue each mission, so you can hold several."),
					h("p", null, CAIN.virtueRules.stricture),
					h("p", null, CAIN.virtueRules.highBlasphemy))),
			CAIN.tileGrid("virtue", CAIN.virtues),
			CAIN.ruleRow("Virtue rules", CAIN.virtueSections));
	}

	function kitView() {
		var blurbs = {
			"Aesthetics": "No mechanical benefit. All are 0 KP. CAIN dress code is tightly regulated.",
			"Comfort / Career": "Personal allowances pursuant to CASTLE doctrine c9880.",
			"Possessions": "Spend 1 KP to pull out anything on a kit list once you have access to it.",
			"Occult / Medical": "Items cultivated by TEMERITY for field use. Approval required. May be cursed."
		};
		return h("div", { class: "kit-view" },
			h("div", { class: "grid" },
				h("article", { class: "card" },
					h("div", { class: "card-head" }, h("h2", null, "Registered kit"), h("span", { class: "label" }, core.base.kitPoints + " KP")),
					h("ul", { class: "entries" }, core.defaultKit.map(function (k) {
						return h("li", { class: "entry" },
							h("div", { class: "entry-name" }, k.name, h("span", { class: "tag" }, k.kp + " KP")),
							h("div", { class: "entry-text" }, h("p", null, k.text)));
					}),
					h("li", { class: "entry" },
						h("div", { class: "entry-name" }, "Service weapon upgrade"),
						h("div", { class: "tags" }, h("span", { class: "tag" }, core.weaponUpgrade.cost + " scrip per CAT")),
						h("div", { class: "entry-text" }, h("p", null, "Upgrade both service weapons by +1 CAT, to a max of CAT " + core.weaponUpgrade.maxCat + ". Weapons start at CAT 0; choose their look freely.")))))),
			CAIN.kitCategories.map(function (cat) {
				var items = CAIN.kit.filter(function (k) { return k.category === cat; });
				var shop = items.length && items.every(function (k) { return CAIN.sourceOf(k) && CAIN.sourceOf(k).fan; });
				return h("section", { class: "kit-group" + (shop ? " fan-shop" + CAIN.sourceClass(items[0]) : ""), "data-group": cat },
					h("h2", { class: "kit-group-title" }, cat, CAIN.sourceBadge(items[0], true)),
					blurbs[cat] ? h("p", { class: "note" }, blurbs[cat]) : null,
					CAIN.tileGrid("kit", items));
			}),
			CAIN.ruleRow("Shop and gear rules", CAIN.kitSections));
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

	// Doctrine search: hides cards and entries that don't match, without a
	// re-render so the search box keeps focus. A card whose name or summary
	// matches shows whole; otherwise only its matching powers or abilities.
	var docQuery = "";
	var SEARCH_TABS = ["agendas", "blasphemies", "virtues", "sinmarks", "kit"];

	function applySearch(body, status) {
		var words = docQuery.toLowerCase().split(/\s+/).filter(Boolean);
		function hit(el) {
			var text = el.textContent.toLowerCase();
			return words.every(function (w) { return text.indexOf(w) >= 0; });
		}
		var shown = 0;
		[].forEach.call(body.querySelectorAll(".grid > .card"), function (card) {
			var fan = card.classList.contains("fan-made");
			var want = doctrine.src || "all";
			var srcOk = want === "all" ? true : want === "fan" ? fan : want === "core" ? !fan : card.classList.contains("src-" + want);
			if (card.classList.contains("compact-tile")) {
				var all = ((card.getAttribute("data-search") || "") + " " + card.textContent).toLowerCase();
				var ok = srcOk && words.every(function (w) { return all.indexOf(w) >= 0; });
				card.classList.toggle("is-hidden", !ok);
				if (ok) shown += 1;
				return;
			}
			var parts = [].slice.call(card.querySelectorAll(".entries > .entry, .passive, .virtue-bonds > li"));
			var head = [].slice.call(card.querySelectorAll(".card-head, .ag-head, :scope > .note, .ag-items"));
			var whole = !words.length || head.some(hit);
			var any = false;
			parts.forEach(function (p) {
				var on = whole || hit(p);
				p.classList.toggle("is-hidden", !on);
				if (on && !p.classList.contains("passive")) any = true;
			});
			var visible = srcOk && (whole || any || parts.some(function (p) { return !p.classList.contains("is-hidden"); }));
			card.classList.toggle("is-hidden", !visible);
			if (visible) shown += 1;
		});
		[].forEach.call(body.querySelectorAll("[data-group]"), function (g) {
			g.classList.toggle("is-hidden", !g.querySelector(".card:not(.is-hidden)"));
		});
		status.textContent = words.length || (doctrine.src && doctrine.src !== "all") ? (shown ? shown + (shown === 1 ? " match" : " matches") : "Nothing matches \"" + docQuery + "\".") : "";
	}

	function searchBox(body) {
		var status = h("span", { class: "doc-search-status", role: "status" });
		var input = h("input", { class: "input doc-search", type: "search", value: docQuery, placeholder: "Search names, powers, rules text...", "aria-label": "Search " + doctrine.tab });
		input.addEventListener("input", function () { docQuery = input.value; applySearch(body, status); });
		input.addEventListener("keydown", function (e) { if (e.key === "Escape") { input.value = ""; docQuery = ""; applySearch(body, status); } });
		applySearch(body, status);
		var sources = h("div", { class: "doc-source", role: "group", "aria-label": "Show content from" },
			h("span", { class: "label" }, "Show"),
			[["all", "All books"], ["core", "Official only"]].concat(Object.keys(CAIN.sources).filter(function (id) { return CAIN.sources[id].fan; }).map(function (id) { return [id, (CAIN.sources[id].short || CAIN.sources[id].name) + " (fan)"]; })).map(function (o) {
				return h("button", { class: "chip", type: "button", "aria-pressed": String((doctrine.src || "all") === o[0]), onclick: function () { setDoctrine({ src: o[0] }); } }, o[1]);
			}));
		return h("div", { class: "doc-search-row" }, input, status, sources);
	}

	// Text size as a percentage, 40-200. Older saves used names; map those over.
	function docZoom() {
		var z = doctrine.zoom;
		if (typeof z !== "number") z = { small: 85, smaller: 70 }[doctrine.size] || 100;
		return Math.max(40, Math.min(200, Math.round(z / 10) * 10));
	}

	// The body gets zoom, plus a class that lets blasphemy powers spread into more
	// columns when the text is small.
	function applyDocZoom(el, z) {
		el.style.zoom = z / 100;
		el.className = "doc-body" + (z <= 70 ? " size-smaller" : z <= 85 ? " size-small" : "");
	}

	function sizePicker(bodyWrap) {
		var z = docZoom();
		var out = h("output", { class: "size-value" }, z + "%");
		var slider = h("input", { class: "size-slider", type: "range", min: "40", max: "200", step: "10", value: String(z), "aria-label": "Text size", "aria-valuetext": z + "%" });
		// Live while dragging; saved without a re-render so the slider keeps focus.
		slider.addEventListener("input", function () {
			var v = +slider.value;
			out.textContent = v + "%";
			slider.setAttribute("aria-valuetext", v + "%");
			applyDocZoom(bodyWrap, v);
		});
		slider.addEventListener("change", function () { doctrine.zoom = +slider.value; safeStore.set("cain.doctrine", doctrine); });
		return h("div", { class: "cat-picker size-picker" },
			h("span", { class: "label" }, "Text size"),
			h("span", { class: "size-end" }, "40%"), slider, h("span", { class: "size-end" }, "200%"), out,
			h("button", { class: "chip", type: "button", onclick: function () { slider.value = "100"; slider.dispatchEvent(new Event("input")); slider.dispatchEvent(new Event("change")); } }, "Reset"));
	}


	// Router

	function currentRoute() {
		var path = location.hash.replace(/^#\/?/, "").split("?")[0];
		var m = /^c\/([^/]+)(?:\/(play|between))?$/.exec(path);
		if (m) return { id: "sheet:" + m[1] + ":" + (m[2] || ""), nav: "registry", render: function () { return CAIN.screens.sheet.render(decodeURIComponent(m[1]), m[2]); } };
		if (path === "gm") return { id: "gm", nav: "gm", render: CAIN.screens.gm.render };
		if (path === "new") return { id: "new", nav: "registry", render: CAIN.screens.registration.render };
		if (path === "doctrine") return { id: "doctrine", nav: "doctrine", render: renderDoctrineHub };
		var d = /^doctrine\/([a-z]+)$/.exec(path);
		if (d) return { id: "doctrine:" + d[1], nav: "doctrine", render: function () { return renderDoctrine(d[1]); } };
		return { id: "registry", nav: "registry", render: renderRegistry };
	}

	var lastRoute = null;

	function render() {
		var route = currentRoute();
		document.body.setAttribute("data-page", route.id);
		var y = window.scrollY;
		var dockHost = document.getElementById("gm-dock-host");
		if (dockHost) dockHost.remove();
		app.textContent = "";
		CAIN.append(app, route.render());
		document.querySelectorAll(".nav a[data-route]").forEach(function (a) {
			if (a.getAttribute("data-route") === route.nav) a.setAttribute("aria-current", "page");
			else a.removeAttribute("aria-current");
		});
		// New screens start at the top; re-renders of the same screen keep their place.
		if (lastRoute !== route.id) {
			window.scrollTo(0, 0);
			app.classList.remove("route-enter");
			void app.offsetWidth;
			app.classList.add("route-enter");
			lastRoute = route.id;
			if (route.id !== "registry") { transferUi.message = ""; transferUi.warnings = []; }
		} else {
			window.scrollTo(0, y);
		}
		// The browser tab names the screen, e.g. "Ines Varga - CAIN Exorcist Registry".
		var heading = app.querySelector("h1");
		var name = heading ? heading.textContent.trim() : "";
		document.title = name && route.id !== "registry" ? name + " - CAIN Exorcist Registry" : "CAIN Exorcist Registry";
		if (CAIN.fx) CAIN.fx.update();
	}

	// Keyboard users can jump past the top bar. It focuses the content rather than
	// following a link, since links here change the screen.
	var skip = h("a", { class: "skip-link", href: "#", onclick: function (e) {
		e.preventDefault();
		app.focus();
		app.scrollIntoView();
	} }, "Skip to content");
	var header = document.querySelector(".masthead");
	header.insertBefore(skip, header.firstChild);

	// Opens a Doctrine section with its search box already filled in.
	function searchDoctrine(sectionId, query) {
		docQuery = query || "";
		if (location.hash === "#/doctrine/" + sectionId) render();
		else location.hash = "#/doctrine/" + sectionId;
	}

	CAIN.app = { render: render, sections: doctrineSections, searchDoctrine: searchDoctrine };
	window.addEventListener("hashchange", render);
	render();
})();
