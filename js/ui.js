// Shared UI helpers: DOM builder, rules text rendering, never-throwing storage.
window.CAIN = window.CAIN || {};

(function () {
	// Storage that never throws (private windows, blocked site data).
	CAIN.safeStore = {
		get: function (key, fallback) {
			try {
				var v = localStorage.getItem(key);
				return v === null ? fallback : JSON.parse(v);
			} catch (e) {
				return fallback;
			}
		},
		set: function (key, value) {
			try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (e) { return false; }
		},
		remove: function (key) {
			try { localStorage.removeItem(key); } catch (e) { /* ignore */ }
		}
	};

	// Small DOM builder: h("div", { class: "x", onclick: fn }, child, "text", [more]).
	function h(tag, attrs) {
		var el = document.createElement(tag);
		if (attrs) {
			Object.keys(attrs).forEach(function (k) {
				var v = attrs[k];
				if (v === null || v === undefined || v === false) return;
				if (k === "class") el.className = v;
				else if (k === "value") el.value = v;
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

	// Inline rules text with CAT tokens highlighted.
	function inlineText(text, cat) {
		return CAIN.rules.resolveSegments(text, cat).map(function (seg) {
			if (!seg.token) return seg.text;
			var title = seg.dim ? "CAT " + seg.level + " " + seg.dim + " (from " + seg.token + ")" : seg.token + " = " + seg.text;
			return h("span", { class: "cat-token", title: title }, seg.text);
		});
	}

	// Rules text block. Lines starting "- " become lists.
	function richText(text, cat) {
		var wrap = h("div", { class: "entry-text" });
		var list = null;
		text.split("\n").forEach(function (line) {
			var bullet = /^- /.test(line);
			var body = inlineText(bullet ? line.slice(2) : line, cat);
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

	// A rules term that explains itself on hover or tap, from CAIN.core.glossary.
	function term(label, key) {
		var k = (key || label).toLowerCase();
		if (!CAIN.core.glossary[k]) return label;
		return h("button", { class: "term", type: "button", "data-term": k, "aria-label": label + ": what is this?" }, label);
	}

	var popover = null;

	function closePopover() {
		if (popover) { popover.remove(); popover = null; }
	}

	function openPopover(btn) {
		closePopover();
		var key = btn.getAttribute("data-term");
		popover = h("div", { class: "popover", role: "tooltip" },
			h("div", { class: "popover-title" }, key),
			h("p", null, CAIN.core.glossary[key]));
		document.body.appendChild(popover);
		var r = btn.getBoundingClientRect();
		var width = Math.min(320, window.innerWidth - 32);
		popover.style.width = width + "px";
		var left = Math.min(Math.max(16, r.left + window.scrollX), window.scrollX + window.innerWidth - width - 16);
		popover.style.left = left + "px";
		popover.style.top = (r.bottom + window.scrollY + 6) + "px";
	}

	document.addEventListener("click", function (e) {
		var btn = e.target.closest && e.target.closest(".term");
		if (btn) {
			e.preventDefault();
			if (popover && popover.getAttribute("data-for") === btn.getAttribute("data-term")) { closePopover(); return; }
			openPopover(btn);
			popover.setAttribute("data-for", btn.getAttribute("data-term"));
			return;
		}
		if (popover && !popover.contains(e.target)) closePopover();
	});
	document.addEventListener("keydown", function (e) { if (e.key === "Escape") closePopover(); });
	window.addEventListener("hashchange", closePopover);

	// Copies text to the clipboard. Calls done(ok).
	function copyText(text, done) {
		function fallback() {
			var area = h("textarea", { style: "position:fixed;top:-1000px;opacity:0" });
			area.value = text;
			document.body.appendChild(area);
			area.select();
			var ok = false;
			try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
			area.remove();
			done(ok);
		}
		if (navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard.writeText(text).then(function () { done(true); }, fallback);
		} else {
			fallback();
		}
	}

	// Downloads text as a JSON file.
	function downloadText(filename, text) {
		var blob = new Blob([text], { type: "application/json" });
		var url = URL.createObjectURL(blob);
		var a = h("a", { href: url, download: filename });
		document.body.appendChild(a);
		a.click();
		a.remove();
		setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
	}

	// - value + control. onSet(newValue) is called with the clamped value.
	// opts: { suffix, title, small }. max may be Infinity.
	function stepper(label, value, min, max, onSet, opts) {
		opts = opts || {};
		function set(v) { onSet(Math.max(min, Math.min(max, v))); }
		var name = label || opts.aria || "value";
		return h("span", { class: "stepper" + (opts.small ? " small" : ""), title: opts.title || null },
			label ? h("span", { class: "field-label" }, label) : null,
			h("span", { class: "stepper-controls" },
				h("button", { class: "step-btn", type: "button", "aria-label": "Lower " + name, disabled: value <= min, onclick: function () { set(value - 1); } }, "-"),
				h("span", { class: "stepper-value", "aria-live": "polite" }, (opts.format ? opts.format(value) : String(value)) + (opts.suffix || "")),
				h("button", { class: "step-btn", type: "button", "aria-label": "Raise " + name, disabled: value >= max, onclick: function () { set(value + 1); } }, "+")));
	}

	// Dropdown. options: [{ value, label }] or [{ group, options: [...] }].
	function select(label, value, options, onSet, opts) {
		opts = opts || {};
		var el = h("select", { class: "input select", "aria-label": label || opts.aria || null });
		if (opts.placeholder) el.appendChild(h("option", { value: "" }, opts.placeholder));
		function add(parent, o) {
			var opt = h("option", { value: o.value, disabled: o.disabled || null }, o.label);
			if (o.value === value) opt.selected = true;
			parent.appendChild(opt);
		}
		options.forEach(function (o) {
			if (o.group) {
				var g = h("optgroup", { label: o.group });
				o.options.forEach(function (x) { add(g, x); });
				el.appendChild(g);
			} else add(el, o);
		});
		if (!value && opts.placeholder) el.value = "";
		el.addEventListener("change", function () { onSet(el.value); });
		return label ? h("label", { class: "select-field" }, h("span", { class: "field-label" }, label), el) : el;
	}

	// The book's power symbol: a curved four-point star when the power spends a
	// psyche burst (with a + for one or more), outlined with an X when it needs none.
	var SVG_NS = "http://www.w3.org/2000/svg";
	function burstIcon(burst) {
		var kind = (CAIN.core.burstKinds.filter(function (k) { return k.id === burst; })[0]) || CAIN.core.burstKinds[0];
		var filled = burst !== "none";
		var svg = document.createElementNS(SVG_NS, "svg");
		svg.setAttribute("viewBox", "0 0 24 24");
		svg.setAttribute("class", "burst-star" + (filled ? " filled" : ""));
		svg.setAttribute("aria-hidden", "true");
		var path = document.createElementNS(SVG_NS, "path");
		path.setAttribute("d", "M12 1.5C12.9 8.6 15.4 11.1 22.5 12C15.4 12.9 12.9 15.4 12 22.5C11.1 15.4 8.6 12.9 1.5 12C8.6 11.1 11.1 8.6 12 1.5Z");
		svg.appendChild(path);
		if (!filled) {
			var cross = document.createElementNS(SVG_NS, "path");
			cross.setAttribute("class", "burst-cross");
			cross.setAttribute("d", "M8.5 8.5L15.5 15.5M15.5 8.5L8.5 15.5");
			svg.appendChild(cross);
		}
		return h("span", { class: "burst-mark", title: kind.label, role: "img", "aria-label": kind.label },
			svg, burst === "multiple" ? h("span", { class: "burst-plus", "aria-hidden": "true" }, "+") : burst === "all" ? h("span", { class: "burst-plus burst-all", "aria-hidden": "true" }, "ALL") : null);
	}

	// A power's heading (burst star + name, plus any extra controls) and its tag
	// line ("Until rest, Charm, Adjacent"), as the book prints them.
	function powerHead(p, extra) {
		return h("div", { class: "entry-name power-name" }, burstIcon(p.burst), h("span", null, p.name), extra || null);
	}

	function powerTags(p, cat) {
		var tags = p.tags ? [p.tags.duration, p.tags.effect, p.tags.range].filter(Boolean) : [];
		if (!tags.length) return null;
		var parts = [];
		tags.forEach(function (t, i) {
			if (i) parts.push(", ");
			parts.push(inlineText(t, cat));
		});
		return h("div", { class: "power-tags" }, parts);
	}

	function luminance(hex) {
		var m = /^#?([0-9a-f]{6})$/i.exec(hex || "");
		if (!m) return 0;
		var n = parseInt(m[1], 16);
		return 0.2126 * (n >> 16) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255);
	}

	// A blasphemy's book colours as attributes for its container: --blas (accent),
	// --blas-2 (second colour) and --blas-title (the brighter one, for the name
	// plate on black). Custom blasphemies without a theme get grey.
	function blasTheme(b) {
		var t = (b && b.theme) || {};
		var c = /^#[0-9a-f]{6}$/i.test(t.color || "") ? t.color : "#8a8a8a";
		var c2 = /^#[0-9a-f]{6}$/i.test(t.color2 || "") ? t.color2 : c;
		var title = luminance(c2) > luminance(c) ? c2 : c;
		if (luminance(title) < 45) title = "#c9c4b8";
		// Very light accents (white, pale grey) can't be read on paper; text uses the
		// darker second colour for those.
		var text = luminance(c) > 180 && luminance(c2) < luminance(c) ? c2 : c;
		return { class: "blas-themed" + (t.dark ? " blas-dark" : "") + sourceClass(b), style: "--blas:" + c + ";--blas-2:" + c2 + ";--blas-title:" + title + ";--blas-text:" + text };
	}

	// An agenda drawn like its card in the rulebook: the paper it's printed on,
	// the round emblem, the name in marker pen and "Registered Agenda".
	var PAPERS = ["grey", "beige", "dark", "gold", "tag", "stamp", "pink"];

	function agendaLook(a) {
		var l = (a && a.look) || {};
		var hex = /^#[0-9a-f]{6}$/i;
		var paper = PAPERS.indexOf(l.paper) >= 0 ? l.paper : "grey";
		return {
			class: "agenda-look paper-" + paper + (l.splatter ? " splatter" : "") + sourceClass(a),
			style: "--ag-accent:" + (hex.test(l.accent || "") ? l.accent : "#141414") + ";--ag-tape:" + (hex.test(l.tape || "") ? l.tape : "#f2b318")
		};
	}

	function agendaHead(a, extra) {
		var src = agendaIcon(a);
		var emblem = src
			? h("img", { class: "ag-emblem" + (src.indexOf("img/blasphemy/") === 0 ? " ag-emblem-photo" : ""), src: src, alt: "", draggable: "false" })
			: h("span", { class: "ag-emblem ag-emblem-blank", "aria-hidden": "true" });
		return h("div", { class: "ag-head" }, emblem,
			h("div", { class: "ag-titles" },
				h("h2", { class: "ag-name" }, a.name),
				h("span", { class: "ag-reg" }, a.custom ? "Custom Agenda" : "Registered Agenda"),
				sourceBadge(a)),
			extra || null);
	}

	function agendaFoot() {
		return h("div", { class: "ag-foot", "aria-hidden": "true" },
			h("span", { class: "ag-tris" }, h("span", null), h("span", null)),
			h("span", { class: "ag-hole" }));
	}

	// Pictures: every book agenda has a round emblem, every book blasphemy a
	// portrait. Custom ones borrow either by id ("agenda:beast", "blasphemy:gate").
	function iconSrc(icon) { return CAIN.rules.iconSrc(icon); }

	function agendaIcon(a) { return a.custom ? iconSrc(a.icon) : (a.image || "img/agenda/" + a.id + ".png"); }

	function blasphemyIcon(b) {
		if (b.custom) return iconSrc(b.icon);
		if (b.image) return b.image;
		return CAIN.blasphemies.some(function (x) { return x.id === b.id; }) ? "img/blasphemy/" + b.id + ".jpg" : null;
	}

	function blasPortrait(b, cls) {
		var src = blasphemyIcon(b);
		return src ? h("img", { class: "blas-portrait" + (cls ? " " + cls : ""), src: src, alt: "", draggable: "false" }) : null;
	}

	// Every picture a custom agenda or blasphemy can use, as { value, label, src }.
	function iconChoices() {
		return CAIN.agendas.map(function (a) { return { value: "agenda:" + a.id, label: a.name + " emblem", src: agendaIcon(a) }; })
			.concat(CAIN.blasphemies.map(function (b) { return { value: "blasphemy:" + b.id, label: b.name + " portrait", src: blasphemyIcon(b) }; }));
	}

	// A row of picture buttons for an editor; onSet gets the value or "".
	function iconPicker(current, onSet) {
		var none = h("button", { class: "icon-choice icon-none", type: "button", "aria-pressed": String(!current), "aria-label": "No picture", onclick: function () { onSet(""); } }, "None");
		return h("div", { class: "icon-picker", role: "group", "aria-label": "Picture" }, none,
			iconChoices().map(function (c) {
				return h("button", { class: "icon-choice" + (c.value.indexOf("blasphemy:") === 0 ? " icon-tall" : ""), type: "button", "aria-pressed": String(current === c.value),
					"aria-label": c.label, title: c.label, onclick: function () { onSet(c.value); } },
					h("img", { src: c.src, alt: "" }));
			}));
	}

	// A kit item's drawing from the book, as black ink that follows the theme.
	function kitPicture(item, cls) {
		if (!item || !/^img\/(kit\/|ishmael\/kit-)[a-z0-9-]+\.png$/.test(item.image || "")) return null;
		// Fan supplement pictures are in colour, so they skip the ink treatment.
		var color = item.image.indexOf("img/kit/") !== 0;
		return h("span", { class: "art kit-pic" + (color ? " kit-pic-color" : "") + (cls ? " " + cls : ""), "aria-hidden": "true" }, h("img", { src: item.image, alt: "", draggable: "false" }));
	}

	// Virtues: portrait, the bond track (ranks 0-III, ones not reached dimmed when
	// a rank is given) and the high blasphemy powers.
	var RANKS = ["0", "I", "II", "III"];

	function virtuePortrait(v, cls) {
		return h("img", { class: "blas-portrait" + (cls ? " " + cls : ""), src: v.image || "img/virtue/" + v.id + ".jpg", alt: "", draggable: "false" });
	}

	function virtueBondList(v, cat, rank) {
		return h("ol", { class: "virtue-bonds" }, v.bonds.map(function (b) {
			var locked = rank !== undefined && b.rank > rank;
			return h("li", { class: "virtue-bond" + (locked ? " locked" : "") },
				h("span", { class: "virtue-rank", "aria-label": "Rank " + RANKS[b.rank] }, RANKS[b.rank]),
				h("div", { class: "virtue-bond-text" }, richText(b.text, cat)));
		}));
	}

	function virtuePowers(v, cat, rank, extra) {
		return h("ul", { class: "entries virtue-powers" }, v.powers.map(function (p) {
			var locked = rank !== undefined && p.rank > rank;
			return h("li", { class: "entry" + (locked ? " locked" : "") },
				powerHead(p, h("span", { class: "tag" }, "Bond " + RANKS[p.rank] + (p.choice ? ", by choice" : ""))),
				powerTags(p, cat),
				richText(p.text, cat),
				extra ? extra(p) : null);
		}));
	}

	CAIN.virtueRanks = RANKS;
	CAIN.virtuePortrait = virtuePortrait;
	CAIN.virtueBondList = virtueBondList;
	CAIN.virtuePowers = virtuePowers;
	// Supporting rules that come with a blasphemy (building the Buddy, drifters,
	// weapon mods...), folded away until opened.
	function blasExtras(b, cat) {
		if (!b || !b.extras || !b.extras.length) return null;
		return h("div", { class: "blas-extras" }, b.extras.map(function (x) {
			return h("details", { class: "blas-extra" }, h("summary", null, x.title), richText(x.text, cat));
		}));
	}

	// Fan-made content: a badge naming the supplement, and the class that gives
	// its cards their own border. Core-book entries get neither.
	function sourceOf(entry) {
		var id = entry && entry.source;
		return id && CAIN.sources && CAIN.sources[id] ? Object.assign({ id: id }, CAIN.sources[id]) : null;
	}

	function sourceClass(entry) {
		var src = sourceOf(entry);
		return src && src.fan ? " fan-made src-" + src.id : "";
	}

	function sourceBadge(entry, short) {
		var src = sourceOf(entry);
		if (!src || !src.fan) return null;
		// Inside a card that already has the fan-made border and tab, CSS hides the
		// short badge and the "Fan-made:" prefix, leaving just the credit.
		return h("span", { class: "fan-badge src-" + src.id + (short ? " short" : " full"), title: "Fan-made content from " + src.name + " by " + src.author + ". Not official CAIN material." },
			h("span", { class: "fan-prefix" }, "Fan-made: "), short ? (src.short || src.name) : src.name + ", by " + src.author);
	}

	CAIN.kitPicture = kitPicture;
	// Some fan blasphemies need the Admin's say-so before an exorcist takes them.
	function approvalTag(entry) {
		return entry && entry.requiresApproval ? h("span", { class: "approval-tag", title: "This book asks you to agree it with your Admin before taking it." }, "Admin approval needed") : null;
	}
	CAIN.approvalTag = approvalTag;
	CAIN.sourceOf = sourceOf;
	CAIN.blasExtras = blasExtras;
	CAIN.sourceClass = sourceClass;
	CAIN.sourceBadge = sourceBadge;
	CAIN.powerHead = powerHead;
	CAIN.agendaIcon = agendaIcon;
	CAIN.blasphemyIcon = blasphemyIcon;
	CAIN.blasPortrait = blasPortrait;
	CAIN.iconPicker = iconPicker;
	CAIN.agendaLook = agendaLook;
	CAIN.agendaHead = agendaHead;
	CAIN.agendaFoot = agendaFoot;
	CAIN.powerTags = powerTags;
	CAIN.blasTheme = blasTheme;
	CAIN.burstIcon = burstIcon;
	CAIN.stepper = stepper;
	CAIN.select = select;
	CAIN.term = term;
	CAIN.closePopover = closePopover;
	CAIN.downloadText = downloadText;
	CAIN.copyText = copyText;
	CAIN.h = h;
	CAIN.append = append;
	CAIN.inlineText = inlineText;
	CAIN.richText = richText;
	CAIN.screens = CAIN.screens || {};
})();
