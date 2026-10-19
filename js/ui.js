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
				h("span", { class: "stepper-value", "aria-live": "polite" }, String(value) + (opts.suffix || "")),
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
	CAIN.burstLabels = {
		required: "Psyche burst",
		onSuccess: "Burst on success",
		multiple: "Burst +",
		none: "No burst"
	};
	CAIN.screens = CAIN.screens || {};
})();
