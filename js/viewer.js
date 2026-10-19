// The focus viewer: click an agenda, blasphemy or virtue card (anything marked
// data-view="kind:id") to open it in the middle of a darkened screen, laid out
// like its pages in the book. Zoom with the buttons, Ctrl + mouse wheel, or the
// + / - / 0 keys; arrow keys step through the cards on screen; Esc closes.
window.CAIN = window.CAIN || {};

(function () {
	var h = CAIN.h;
	var R = CAIN.rules;
	var ZOOMS = [0.6, 0.7, 0.8, 0.9, 1, 1.15, 1.3, 1.5, 1.75, 2];
	var state = { overlay: null, wrap: null, zoom: 4, list: [], index: 0, returnTo: null };

	function currentCat() {
		var d = CAIN.safeStore.get("cain.doctrine", { cat: 1 });
		return d && d.cat >= 0 ? d.cat : 1;
	}

	function lookup(ref) {
		var p = String(ref || "").split(":");
		var kind = p[0], id = p.slice(1).join(":");
		if (kind === "agenda") return { kind: kind, item: R.agenda(id) };
		if (kind === "blasphemy") return { kind: kind, item: R.blasphemy(id) };
		if (kind === "virtue") return { kind: kind, item: R.virtue(id) };
		if (kind === "rules") return { kind: kind, item: CAIN.ruleSections().filter(function (r) { return CAIN.ruleSlug(r.name) === id; })[0] || null };
		if (kind === "sinmark") return { kind: kind, item: R.sinMark(id) };
		if (kind === "kit") return { kind: kind, item: CAIN.kit.filter(function (k) { return k.id === id; })[0] || null };
		return { kind: kind, item: null };
	}

	function credit(x) {
		var src = CAIN.sourceOf(x);
		return src && src.fan ? h("p", { class: "spread-credit" }, "Fan-made: " + src.name + ", by " + src.author) : null;
	}

	// Blasphemy: portrait, name and flavor on the left, passive beneath, then the
	// powers as boxes in three alternating styles, like the book's spreads.
	function blasphemySpread(b, cat) {
		var th = CAIN.blasTheme(b);
		var lines = String(b.flavor || b.summary || "").split("\n");
		var lead = b.summary || lines[0];
		var facts = (b.summary ? lines : lines.slice(1)).filter(function (l) { return l && l.trim() !== String(lead).trim(); });
		return h("article", { class: "spread blas-spread " + th.class, style: th.style },
			h("div", { class: "spread-top" },
				CAIN.blasPortrait(b, "spread-portrait"),
				h("div", { class: "spread-head" },
					h("h2", { class: "spread-title" }, b.name),
					h("p", { class: "spread-lead" }, lead),
					credit(b),
					CAIN.approvalTag(b),
					facts.length ? h("div", { class: "spread-fact" }, facts.map(function (f) { return h("p", null, f); })) : null,
					b.passive ? h("div", { class: "spread-passive" },
						h("h3", { class: "spread-subtitle" }, b.passive.name),
						h("div", { class: "spread-passive-body" }, h("em", null, "Passive: "), CAIN.richText(b.passive.text, cat))) : null)),
			h("div", { class: "spread-powers" }, (b.powers || []).map(function (p, i) {
				return h("section", { class: "spread-power style-" + (i % 3) },
					h("h3", { class: "spread-power-name" }, CAIN.burstIcon(p.burst), h("span", null, p.name)),
					CAIN.powerTags(p, cat),
					CAIN.richText(p.text, cat));
			})),
			b.trackers || b.extras ? h("div", { class: "spread-extras" },
				(b.trackers || []).map(function (t) {
					return h("details", { class: "blas-extra" }, h("summary", null, t.name + " (" + R.resolveText(String(t.segments), cat) + " segments)"), CAIN.richText(t.text || "", cat));
				}),
				CAIN.blasExtras(b, cat)) : null);
	}

	// Virtue: portrait, bond track and stricture on the left; name, story and the
	// likes card in the middle; the high blasphemy boxed on the right.
	function virtueSpread(v, cat) {
		var th = CAIN.blasTheme(v);
		return h("article", { class: "spread virtue-spread " + th.class, style: th.style },
			h("div", { class: "vs-left" },
				CAIN.virtuePortrait(v, "spread-portrait"),
				h("h3", { class: "vs-bond" }, "Bond"),
				h("h4", { class: "vs-label" }, "Strictures"),
				h("p", { class: "vs-ignore" }, v.strictureCost || "Ignore for one roll by taking 2 nonlethal stress"),
				h("p", null, v.stricture),
				h("h4", { class: "vs-label" }, "Bond abilities"),
				CAIN.virtueBondList(v, cat)),
			h("div", { class: "vs-mid" },
				h("h2", { class: "vs-name" }, v.name),
				h("p", { class: "vs-epithet" }, v.epithet),
				credit(v),
				String(v.flavor || "").split("\n").map(function (p) { return h("p", { class: "vs-flavor" }, p); }),
				h("div", { class: "vs-seal" },
					h("div", { class: "vs-seal-box" }, h("span", null, "Likes"), (v.likes || []).map(function (x) { return h("div", null, x); })),
					h("div", { class: "vs-seal-box" }, h("span", null, "Dislikes"), (v.dislikes || []).map(function (x) { return h("div", null, x); })),
					v.food ? h("div", { class: "vs-seal-box wide" }, h("span", null, "Favorite food"), h("div", null, v.food)) : null)),
			h("div", { class: "vs-right" },
				h("h3", { class: "vs-high" }, "High blasphemy:"),
				(v.powers || []).map(function (p) {
					return h("section", { class: "vs-power" },
						h("h3", { class: "vs-power-name" }, CAIN.burstIcon(p.burst), h("span", null, p.name)),
						h("p", { class: "vs-power-rank" }, "Bond " + CAIN.virtueRanks[p.rank] + (p.choice ? ", by choice" : "")),
						CAIN.powerTags(p, cat),
						CAIN.richText(p.text, cat));
				})));
	}

	// A rules section (virtue affinity rules, shop rules...): title and text.
	function rulesSpread(r, cat) {
		return h("article", { class: "spread rules-spread" },
			h("h2", { class: "kit-spread-name" }, r.name),
			credit(r),
			h("div", { class: "rules-spread-text" }, CAIN.richText(r.text, cat)));
	}

	// Sin mark: the location, its look, and the six abilities by d6.
	function sinMarkSpread(m, cat) {
		return h("article", { class: "spread mark-spread" },
			h("div", { class: "mark-spread-head" },
				h("span", { class: "mark-spread-roll" }, String(m.roll)),
				h("div", null,
					h("h2", { class: "spread-title" }, m.name),
					h("p", { class: "spread-lead" }, "Sin mark, location " + m.roll + " on the d6"),
					h("div", { class: "spread-fact" }, h("p", null, h("strong", null, "Appearance or manifestation: "), m.appearance)))),
			h("ol", { class: "mark-spread-list" }, m.abilities.map(function (a) {
				return h("li", null, h("span", { class: "mark-spread-num" }, String(a.roll)),
					h("div", null, a.short ? h("h3", null, a.short) : null, CAIN.richText(a.text, cat)));
			})));
	}

	// Kit item: its picture, prices and tags, and the full text.
	function kitSpread(k) {
		var pic = CAIN.kitPicture(k, "kit-spread-pic");
		return h("article", { class: "spread kit-spread" + (pic ? "" : " no-pic") },
			pic,
			h("div", null,
				h("h2", { class: "kit-spread-name" }, k.name),
				h("p", { class: "spread-lead" }, k.category),
				credit(k),
				h("div", { class: "tags" },
					h("span", { class: "tag" }, k.scrip === null ? "Auction" : k.scrip + " scrip"),
					k.kp !== null ? h("span", { class: "tag" }, k.kp + " KP") : h("span", { class: "tag" }, "Not pulled out"),
					(k.tags || []).map(function (t) { return h("span", { class: "tag" }, t); })),
				h("div", { class: "kit-spread-text" }, CAIN.richText(k.text, 1)),
				k.quote ? h("p", { class: "kit-quote" }, "“" + k.quote + "”") : null,
				k.credit ? h("p", { class: "tiny" }, k.credit) : null,
				k.stock ? h("p", { class: "tiny" }, k.stock >= 99 ? "Stock: plenty" : "Stock: " + k.stock) : null));
	}

	// Agenda: the card itself, larger.
	function agendaSpread(a, cat) {
		var look = CAIN.agendaLook(a);
		return h("article", { class: "card agenda-spread " + look.class, style: look.style },
			CAIN.agendaHead(a),
			a.items.length ? h("div", { class: "ag-items" }, h("span", { class: "ag-label" }, "Items:"),
				h("ul", { class: "items" }, a.items.map(function (it) { return h("li", { class: it.bold ? "bold" : null }, it.text); }))) : null,
			h("div", { class: "ag-label" }, "Abilities:"),
			h("ul", { class: "entries ag-abilities" }, a.abilities.map(function (ab) {
				return h("li", { class: "entry" }, h("div", { class: "entry-name" }, ab.name), CAIN.richText(ab.text, cat));
			})),
			a.note ? h("p", { class: "agenda-note" }, a.note) : null,
			CAIN.agendaFoot());
	}

	function build(ref) {
		var found = lookup(ref);
		if (!found.item) return null;
		var cat = currentCat();
		if (found.kind === "blasphemy") return blasphemySpread(found.item, cat);
		if (found.kind === "virtue") return virtueSpread(found.item, cat);
		if (found.kind === "rules") return rulesSpread(found.item, cat);
		if (found.kind === "sinmark") return sinMarkSpread(found.item, cat);
		if (found.kind === "kit") return kitSpread(found.item);
		return agendaSpread(found.item, cat);
	}

	function applyZoom() {
		if (!state.wrap) return;
		state.wrap.style.zoom = ZOOMS[state.zoom];
		var label = state.overlay.querySelector(".viewer-zoom");
		if (label) label.textContent = Math.round(ZOOMS[state.zoom] * 100) + "%";
	}

	function zoomBy(step) {
		state.zoom = Math.max(0, Math.min(ZOOMS.length - 1, state.zoom + step));
		applyZoom();
	}

	function show(i) {
		state.index = (i + state.list.length) % state.list.length;
		var ref = state.list[state.index];
		var spread = build(ref);
		if (!spread) return;
		state.wrap.textContent = "";
		state.wrap.appendChild(spread);
		state.overlay.setAttribute("aria-label", lookup(ref).item.name);
		state.overlay.scrollTop = 0;
		var count = state.overlay.querySelector(".viewer-count");
		if (count) count.textContent = state.list.length > 1 ? (state.index + 1) + " / " + state.list.length : "";
	}

	function btn(label, aria, fn) {
		return h("button", { class: "viewer-btn", type: "button", "aria-label": aria, title: aria, onclick: fn }, label);
	}

	function open(ref, list) {
		if (!build(ref)) return;
		close();
		state.list = list && list.length ? list : [ref];
		state.returnTo = document.activeElement;
		state.wrap = h("div", { class: "viewer-stage" });
		var bar = h("div", { class: "viewer-bar" },
			state.list.length > 1 ? btn("‹", "Previous", function () { show(state.index - 1); }) : null,
			h("span", { class: "viewer-count" }),
			state.list.length > 1 ? btn("›", "Next", function () { show(state.index + 1); }) : null,
			h("span", { class: "viewer-sep" }),
			btn("−", "Zoom out (-)", function () { zoomBy(-1); }),
			h("span", { class: "viewer-zoom" }),
			btn("+", "Zoom in (+)", function () { zoomBy(1); }),
			btn("Fit", "Reset zoom (0)", function () { state.zoom = 4; applyZoom(); }),
			btn("×", "Close (Esc)", close));
		state.overlay = h("div", { class: "viewer", role: "dialog", "aria-modal": "true",
			onclick: function (e) { if (e.target === state.overlay || e.target === state.wrap) close(); } }, bar, state.wrap);
		state.overlay.addEventListener("wheel", function (e) {
			if (!e.ctrlKey) return;
			e.preventDefault();
			zoomBy(e.deltaY < 0 ? 1 : -1);
		}, { passive: false });
		document.body.appendChild(state.overlay);
		document.body.classList.add("viewer-open");
		var idx = state.list.indexOf(ref);
		show(idx < 0 ? 0 : idx);
		applyZoom();
		bar.querySelector('[aria-label="Close (Esc)"]').focus();
	}

	function close() {
		if (!state.overlay) return;
		state.overlay.remove();
		state.overlay = null;
		state.wrap = null;
		document.body.classList.remove("viewer-open");
		if (state.returnTo && state.returnTo.focus) state.returnTo.focus();
	}

	document.addEventListener("keydown", function (e) {
		if (!state.overlay) {
			// Enter or Space on a focused card opens it.
			var card = e.target && e.target.matches && e.target.matches("[data-view]") ? e.target : null;
			if (card && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openFrom(card); }
			return;
		}
		if (e.key === "Escape") { e.preventDefault(); close(); }
		else if (e.key === "+" || e.key === "=") { e.preventDefault(); zoomBy(1); }
		else if (e.key === "-" || e.key === "_") { e.preventDefault(); zoomBy(-1); }
		else if (e.key === "0") { e.preventDefault(); state.zoom = 4; applyZoom(); }
		else if (e.key === "ArrowRight" && state.list.length > 1) { e.preventDefault(); show(state.index + 1); }
		else if (e.key === "ArrowLeft" && state.list.length > 1) { e.preventDefault(); show(state.index - 1); }
		else if (e.key === "Tab") {
			// Keep focus inside the viewer.
			var f = [].slice.call(state.overlay.querySelectorAll("button, summary, a[href]"));
			if (!f.length) return;
			var first = f[0], last = f[f.length - 1];
			if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
			else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
		}
	});

	// The cards on screen (skipping ones hidden by search) are the set to step through.
	function openFrom(card) {
		var list = [].slice.call(document.querySelectorAll("[data-view]")).filter(function (c) {
			return !c.closest(".is-hidden") && c.offsetParent !== null;
		}).map(function (c) { return c.getAttribute("data-view"); });
		open(card.getAttribute("data-view"), list);
	}

	document.addEventListener("click", function (e) {
		if (state.overlay) return;
		var card = e.target.closest && e.target.closest("[data-view]");
		if (!card) return;
		// Buttons, links, fields and fold-outs inside a card keep doing their own thing.
		var inner = e.target.closest("button, a, input, select, textarea, label, summary, details");
		if (inner && inner !== card) return;
		if (window.getSelection && String(window.getSelection()).length > 2) return;
		openFrom(card);
	});

	CAIN.viewer = { open: open, close: close };
})();
