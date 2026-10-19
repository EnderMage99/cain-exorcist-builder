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

	var milestones = [
		{ id: "M0", text: "Site skeleton and GitHub Pages", done: true },
		{ id: "M1", text: "Rules engine and test content", done: true },
		{ id: "M2", text: "Registration (character creation)", done: true },
		{ id: "M3", text: "Sheet, edit mode", done: true },
		{ id: "M4", text: "Play mode", done: true },
		{ id: "M5", text: "Sessions, missions, advances", done: true },
		{ id: "M6", text: "Export and import", done: true },
		{ id: "M7", text: "Print view and polish", done: true },
		{ id: "M8", text: "All agendas and blasphemies, book colours", done: true },
		{ id: "M9", text: "All sin marks and kit", done: true },
		{ id: "M10", text: "Virtues (Games for Freaks)", done: true }
	];

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

	function renderRegistry() {
		var characters = store.list().slice().sort(function (a, b) { return (b.updated || 0) - (a.updated || 0); });
		var draft = store.getDraft();
		var fileInput = h("input", { type: "file", accept: ".json,application/json", class: "visually-hidden", id: "import-file",
			onchange: function () { if (fileInput.files[0]) importFile(fileInput.files[0]); fileInput.value = ""; } });

		var actions = h("div", { class: "head-actions" },
			h("a", { class: "btn", href: "#/new" }, draft ? "Continue registration" : "Register exorcist"),
			h("button", { class: "btn ghost", type: "button", title: "Roll a random legal exorcist and review it", onclick: function () {
				CAIN.registration.quickExorcist();
				location.hash = "#/new";
			} }, "Quick exorcist"));

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

		var powers = CAIN.blasphemies.reduce(function (n, b) { return n + b.powers.length; }, 0);
		var abilities = CAIN.agendas.reduce(function (n, a) { return n + a.abilities.length; }, 0);

		return dropZone(h("div", { class: "registry-page" },
			h("div", { class: "page-head" },
				h("div", null,
					h("div", { class: "kicker" }, "CASTLE personnel files"),
					h("h1", null, "Registered exorcists")),
				actions),
			transferBar,
			transferArea(),
			draftNote,
			list,
			h("div", { class: "grid", style: "margin-top:24px" },
				h("section", { class: "card" },
					h("div", { class: "card-head" }, h("h2", null, "Build status"), h("span", { class: "label" }, "In progress")),
					h("ul", { class: "status-list" }, milestones.map(function (m) {
						return h("li", null, h("span", { class: m.done ? "done" : "todo" }, m.id + "  " + m.text), h("span", { class: "label" }, m.done ? "Done" : "Planned"));
					}))),
				h("section", { class: "card" },
					h("div", { class: "card-head" }, h("h2", null, "Loaded doctrine"), h("span", { class: "label" }, "CAIN 1.4.5")),
					h("ul", { class: "status-list" },
						h("li", null, "Agendas", h("span", null, CAIN.agendas.map(function (a) { return a.name; }).join(", "))),
						h("li", null, "Agenda abilities", h("span", null, String(abilities))),
						h("li", null, "Blasphemies", h("span", null, CAIN.blasphemies.map(function (b) { return b.name; }).join(", "))),
						h("li", null, "Blasphemy powers", h("span", null, String(powers) + " + Blast")),
						h("li", null, "Sin marks", h("span", null, CAIN.sinMarks.map(function (m) { return m.name; }).join(", "))),
						h("li", null, "Kit items", h("span", null, String(CAIN.kit.length)))),
					h("p", { class: "note", style: "margin-top:10px" }, "Browse it all under Doctrine. ",
						h("a", { href: "tests/rules-test.html" }, "Run the rules checks"), ".")))));
	}

	// Doctrine (content browser)

	var doctrineTabs = [
		{ id: "agendas", name: "Agendas" },
		{ id: "blasphemies", name: "Blasphemies" },
		{ id: "virtues", name: "Virtues" },
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
		var look = CAIN.agendaLook(a);
		return h("article", { class: "card " + look.class, style: look.style },
			CAIN.agendaHead(a),
			a.items.length === 0 ? null : h("div", { class: "ag-items" }, h("span", { class: "ag-label" }, "Items:"),
				h("ul", { class: "items" }, a.items.map(function (it) {
					return h("li", { class: it.bold ? "bold" : null }, it.text);
				}))),
			h("div", { class: "ag-label" }, "Abilities:"),
			h("ul", { class: "entries ag-abilities" }, a.abilities.map(function (ab) {
				return h("li", { class: "entry" }, h("div", { class: "entry-name" }, ab.name), richText(ab.text, cat));
			})),
			a.note ? h("p", { class: "agenda-note" }, a.note) : null,
			CAIN.agendaFoot());
	}

	function powerEntry(p, cat) {
		return h("li", { class: "entry" },
			CAIN.powerHead(p),
			CAIN.powerTags(p, cat),
			richText(p.text, cat));
	}

	function blasphemyCard(b, cat) {
		var th = CAIN.blasTheme(b);
		return h("article", { class: "card blas-card " + th.class + (b.powers ? "" : " blas-solo"), style: th.style },
			h("div", { class: "blas-intro" },
				CAIN.blasPortrait(b),
				h("div", { class: "blas-intro-text" },
					h("div", { class: "card-head" },
						h("h2", { class: "blas-title" }, b.name),
						h("span", { class: "label" }, b.numeral ? "Blasphemy " + b.numeral : "All exorcists")),
					b.flavor ? h("p", { class: "note" }, b.flavor) : null)),
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

	function virtueCard(v, cat) {
		var th = CAIN.blasTheme(v);
		return h("article", { class: "card blas-card virtue-card " + th.class, style: th.style },
			h("div", { class: "blas-intro" },
				CAIN.virtuePortrait(v),
				h("div", { class: "blas-intro-text" },
					h("div", { class: "card-head" },
						h("h2", { class: "blas-title" }, v.name),
						h("span", { class: "label" }, v.epithet)),
					h("p", { class: "note" }, v.flavor),
					h("dl", { class: "virtue-facts" },
						h("dt", null, "Likes"), h("dd", null, v.likes.join(", ")),
						h("dt", null, "Dislikes"), h("dd", null, v.dislikes.join(", ")),
						h("dt", null, "Favorite food"), h("dd", null, v.food)))),
			h("div", { class: "virtue-cols" },
				h("div", null,
					h("div", { class: "passive virtue-stricture" },
						h("div", { class: "entry-name" }, "Stricture", h("span", { class: "tag stamp" }, "While bonding")),
						h("p", null, v.stricture)),
					h("div", { class: "subhead" }, "Bond abilities"),
					CAIN.virtueBondList(v, cat)),
				h("div", null,
					h("div", { class: "subhead" }, "High blasphemy"),
					CAIN.virtuePowers(v, cat))));
	}

	function virtuesView(cat) {
		return h("div", { class: "grid" },
			h("article", { class: "card virtue-rules" },
				h("div", { class: "card-head" }, h("h2", null, "Virtue bonds"), h("span", { class: "label" }, "Games for Freaks, issue 1")),
				h("p", null, "Virtues are CAIN's six living weapons of last resort, background mentors your exorcist can study under or emulate between missions. At the start of any mission, pick a virtue to bond with: you gain its rank 0 ability at once. Survive the mission and the bond rises by 1, to III, granting each ability in turn. Bonds are permanent, and you can bond with a different virtue each mission, so you can hold several."),
				h("p", null, CAIN.virtueRules.stricture),
				h("p", null, CAIN.virtueRules.highBlasphemy)),
			CAIN.virtues.map(function (v) { return virtueCard(v, cat); }));
	}

	function kitEntry(k) {
		return h("li", { class: "entry" + (k.image ? " has-pic" : "") },
			CAIN.kitPicture(k),
			h("div", { class: "entry-name" }, k.name),
			h("div", { class: "tags" },
				h("span", { class: "tag" }, k.scrip + " scrip"),
				k.kp !== null ? h("span", { class: "tag" }, k.kp + " KP") : null,
				k.tags.map(function (t) { return h("span", { class: "tag" }, t); })),
			h("div", { class: "entry-text" }, h("p", null, k.text)));
	}

	function kitView() {
		var blurbs = {
			"Aesthetics": "No mechanical benefit. All are 0 KP. CAIN dress code is tightly regulated.",
			"Comfort / Career": "Personal allowances pursuant to CASTLE doctrine c9880.",
			"Possessions": "Spend 1 KP to pull out anything on a kit list once you have access to it.",
			"Occult / Medical": "Items cultivated by TEMERITY for field use. Approval required. May be cursed."
		};
		return h("div", { class: "grid" },
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
					h("div", { class: "entry-text" }, h("p", null, "Upgrade both service weapons by +1 CAT, to a max of CAT " + core.weaponUpgrade.maxCat + ". Weapons start at CAT 0; choose their look freely."))))),
			CAIN.kitCategories.map(function (cat) {
				return h("article", { class: "card" },
					h("div", { class: "card-head" }, h("h2", null, cat), h("span", { class: "label" }, "Kit expansion")),
					h("p", { class: "note" }, blurbs[cat]),
					h("ul", { class: "entries" }, CAIN.kit.filter(function (k) { return k.category === cat; }).map(kitEntry)));
			}));
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
	var DOC_SIZES = [{ id: "normal", label: "100%" }, { id: "small", label: "85%" }, { id: "smaller", label: "70%" }];

	function applySearch(body, status) {
		var words = docQuery.toLowerCase().split(/\s+/).filter(Boolean);
		function hit(el) {
			var text = el.textContent.toLowerCase();
			return words.every(function (w) { return text.indexOf(w) >= 0; });
		}
		var shown = 0;
		[].forEach.call(body.querySelectorAll(".grid > .card"), function (card) {
			var parts = [].slice.call(card.querySelectorAll(".entries > .entry, .passive, .virtue-bonds > li"));
			var head = [].slice.call(card.querySelectorAll(".card-head, .ag-head, :scope > .note, .ag-items"));
			var whole = !words.length || head.some(hit);
			var any = false;
			parts.forEach(function (p) {
				var on = whole || hit(p);
				p.classList.toggle("is-hidden", !on);
				if (on && !p.classList.contains("passive")) any = true;
			});
			var visible = whole || any || parts.some(function (p) { return !p.classList.contains("is-hidden"); });
			card.classList.toggle("is-hidden", !visible);
			if (visible) shown += 1;
		});
		status.textContent = words.length ? (shown ? shown + (shown === 1 ? " match" : " matches") : "Nothing matches \"" + docQuery + "\".") : "";
	}

	function searchBox(body) {
		var status = h("span", { class: "doc-search-status", role: "status" });
		var input = h("input", { class: "input doc-search", type: "search", value: docQuery, placeholder: "Search names, powers, rules text...", "aria-label": "Search " + doctrine.tab });
		input.addEventListener("input", function () { docQuery = input.value; applySearch(body, status); });
		input.addEventListener("keydown", function (e) { if (e.key === "Escape") { input.value = ""; docQuery = ""; applySearch(body, status); } });
		applySearch(body, status);
		return h("div", { class: "doc-search-row" }, input, status);
	}

	function sizePicker() {
		return h("div", { class: "cat-picker", role: "group", "aria-label": "Text size" },
			h("span", { class: "label" }, "Text size"),
			DOC_SIZES.map(function (s) {
				return h("button", { class: "chip", type: "button", "aria-pressed": String((doctrine.size || "normal") === s.id),
					onclick: function () { setDoctrine({ size: s.id }); } }, s.label);
			}));
	}

	function renderDoctrine() {
		var cat = doctrine.cat;
		var body;
		if (doctrine.tab === "agendas") body = h("div", { class: "grid" }, CAIN.agendas.map(function (a) { return agendaCard(a, cat); }));
		else if (doctrine.tab === "blasphemies") body = h("div", { class: "grid" }, blasphemyCard(CAIN.blast, cat), CAIN.blasphemies.map(function (b) { return blasphemyCard(b, cat); }));
		else if (doctrine.tab === "virtues") body = virtuesView(cat);
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
					catChips),
				sizePicker()),
			SEARCH_TABS.indexOf(doctrine.tab) >= 0 ? searchBox(body) : null,
			h("div", { class: "doc-body size-" + (doctrine.size || "normal") }, body)
		];
	}

	// Router

	function currentRoute() {
		var path = location.hash.replace(/^#\/?/, "").split("?")[0];
		var m = /^c\/([^/]+)(?:\/(play|between))?$/.exec(path);
		if (m) return { id: "sheet:" + m[1] + ":" + (m[2] || ""), nav: "registry", render: function () { return CAIN.screens.sheet.render(decodeURIComponent(m[1]), m[2]); } };
		if (path === "new") return { id: "new", nav: "registry", render: CAIN.screens.registration.render };
		if (path === "doctrine") return { id: "doctrine", nav: "doctrine", render: renderDoctrine };
		return { id: "registry", nav: "registry", render: renderRegistry };
	}

	var lastRoute = null;

	function render() {
		var route = currentRoute();
		var y = window.scrollY;
		app.textContent = "";
		CAIN.append(app, route.render());
		document.querySelectorAll(".nav a[data-route]").forEach(function (a) {
			if (a.getAttribute("data-route") === route.nav) a.setAttribute("aria-current", "page");
			else a.removeAttribute("aria-current");
		});
		// New screens start at the top; re-renders of the same screen keep their place.
		if (lastRoute !== route.id) {
			window.scrollTo(0, 0);
			lastRoute = route.id;
			if (route.id !== "registry") { transferUi.message = ""; transferUi.warnings = []; }
		} else {
			window.scrollTo(0, y);
		}
		// The browser tab names the screen, e.g. "Ines Varga - CAIN Exorcist Registry".
		var heading = app.querySelector("h1");
		var name = heading ? heading.textContent.trim() : "";
		document.title = name && route.id !== "registry" ? name + " - CAIN Exorcist Registry" : "CAIN Exorcist Registry";
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

	CAIN.app = { render: render };
	window.addEventListener("hashchange", render);
	render();
})();
