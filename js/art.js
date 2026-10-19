// Illustrations for the sheet, drawn for this site in the spirit of the official
// CAIN sheet (not copied from it): CAIN emblem, brain, dagger, skull, inkblot,
// nerve web, grub and fly. All are inline SVG in currentColor so they follow the
// theme and print in black.
window.CAIN = window.CAIN || {};

(function () {
	var h = CAIN.h;
	var uid = 0;

	var svgs = {
		brain: '<svg viewBox="0 0 120 92" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">' +
			'<path stroke-width="2.6" d="M20 55c-10-4-12-18-3-25 0-12 13-19 24-15 6-9 22-10 30-2 10-5 24 1 26 12 10 3 14 15 8 23 4 10-4 20-15 19-4 8-16 10-24 4-8 5-20 3-24-4-12 2-22-4-22-12z"/>' +
			'<path stroke-width="1.7" d="M60 14c-4 8 2 14-2 22s4 14 0 22 2 12 0 18"/>' +
			'<path stroke-width="1.5" d="M28 31c8 2 10 8 18 6M24 44c6 1 9-3 14 0M30 51c6-4 14 0 18-4M36 22c4 4 10 3 13 8M77 25c-6 4-4 10-12 12M86 34c-6-2-9 3-14 1M84 46c-8-2-12 6-18 4M91 60c-6 0-8 6-14 6M34 66c6-2 10 2 14 0M70 70c4-3 9-1 12-4"/>' +
			'<path stroke-width="3.2" d="M58 77c2 6 0 9-2 12"/></g></svg>',
		dagger: '<svg viewBox="0 0 40 160" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round">' +
			'<path d="M20 3 L26 18 L24.5 98 L15.5 98 L14 18 Z"/><path stroke-width="1" d="M20 9 L20 96"/>' +
			'<path fill="currentColor" stroke="none" d="M5 100 Q20 94 35 100 L35 107 Q20 102 5 107 Z"/>' +
			'<rect x="15.5" y="107" width="9" height="34" rx="2"/><path stroke-width="1.4" d="M15.5 114h9M15.5 121h9M15.5 128h9M15.5 135h9"/>' +
			'<circle cx="20" cy="148" r="6"/></g></svg>',
		skull: '<svg viewBox="0 0 64 64" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round" d="M32 6c-14 0-24 9-24 22 0 7 3 12 7 15v8c0 2 2 3 4 3h4v-5h4v5h10v-5h4v5h4c2 0 4-1 4-3v-8c4-3 7-8 7-15 0-13-10-22-24-22z"/>' +
			'<ellipse cx="22" cy="30" rx="6" ry="7" fill="currentColor"/><ellipse cx="42" cy="30" rx="6" ry="7" fill="currentColor"/><path d="M32 37l-4 7h8z" fill="currentColor"/></svg>',
		inkblot: '<svg viewBox="0 0 100 84" aria-hidden="true"><g fill="currentColor">' +
			'<path d="M50 6c-6 3-9 9-15 7-8-3-17 2-19 10-3 8 4 13 2 19-3 6-11 8-9 15 2 9 13 9 19 6 5-2 6 4 12 6 4 1 8-2 10-5z"/>' +
			'<path transform="translate(100 0) scale(-1 1)" d="M50 6c-6 3-9 9-15 7-8-3-17 2-19 10-3 8 4 13 2 19-3 6-11 8-9 15 2 9 13 9 19 6 5-2 6 4 12 6 4 1 8-2 10-5z"/>' +
			'<path d="M18 70c-3 4-8 4-10 1M82 70c3 4 8 4 10 1M50 64v14"/></g>' +
			'<g fill="var(--paper)"><ellipse cx="36" cy="30" rx="5" ry="7"/><ellipse cx="64" cy="30" rx="5" ry="7"/><path d="M44 48c3 3 9 3 12 0-2 6-10 6-12 0z"/></g></svg>',
		web: '<svg viewBox="0 0 400 160" preserveAspectRatio="none" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-linecap="round">' +
			'<path stroke-width="3" d="M-4 90 C40 80 60 30 100 40 S160 110 200 86 S262 18 300 48 S360 120 404 96"/>' +
			'<path stroke-width="2" d="M100 40 C112 16 132 4 152 8 M200 86 C212 118 232 138 262 150 M300 48 C320 24 352 18 384 24 M52 74 C40 104 28 128 8 150 M150 70 C160 90 150 120 130 140 M250 40 C240 20 222 8 200 2 M340 90 C350 110 368 130 396 140"/>' +
			'<path stroke-width="1.2" d="M152 8 C160 0 172 -2 180 2 M262 150 C276 152 290 158 300 164 M8 150 C0 156 -4 160 -8 164 M130 140 C120 150 112 156 104 164 M384 24 C392 20 400 14 406 8"/></g></svg>',
		grub: '<svg viewBox="0 0 64 48" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-linecap="round"><path stroke-width="3" d="M10 34c0-14 12-26 28-26 10 0 18 6 18 14 0 6-5 10-11 10-6 0-9-4-9-8"/>' +
			'<path stroke-width="2" d="M16 22l6 4M24 14l3 7M34 10v8M44 11l-3 7M52 16l-5 5"/></g><circle cx="11" cy="36" r="3" fill="currentColor"/></svg>',
		fly: '<svg viewBox="0 0 64 64" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-linecap="round"><ellipse stroke-width="2.5" cx="32" cy="38" rx="7" ry="13"/>' +
			'<path stroke-width="2" d="M26 28C12 18 6 26 10 34s14 2 16-2M38 28c14-10 20-2 16 6s-14 2-16-2M25 36l-10 4M25 42l-10 8M39 36l10 4M39 42l10 8M28 15l-4-6M36 15l4-6"/>' +
			'<path stroke-width="1.5" d="M27 36h10M27 42h10M28 48h8"/></g><circle cx="32" cy="20" r="6" fill="currentColor"/></svg>'
	};

	// The CAIN emblem for an empty photo frame: the triangle mark, the name, and
	// "as above, so below" around it. Needs a fresh id per copy for its text path.
	function emblem() {
		uid += 1;
		var id = "cain-arc-" + uid;
		return '<svg viewBox="0 0 120 150" aria-hidden="true"><defs><path id="' + id + '" d="M22 88 A38 38 0 0 0 98 88"/></defs>' +
			'<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round">' +
			'<path d="M60 30 L84 66 H36 Z"/><path d="M36 72 H84 L60 108 Z" fill="currentColor"/>' +
			'<path d="M50 30 C46 18 50 8 60 6 C70 8 74 18 70 30" /><path d="M54 22 C56 16 64 16 66 22"/></g>' +
			'<text x="60" y="84" text-anchor="middle" font-family="UnifrakturCook, serif" font-size="22" fill="currentColor" stroke="var(--paper)" stroke-width="4" paint-order="stroke">CAIN</text>' +
			'<text font-family="Courier Prime, monospace" font-size="7" letter-spacing="2" fill="currentColor"><textPath href="#' + id + '" startOffset="50%" text-anchor="middle">as above, so below</textPath></text></svg>';
	}

	// An illustration as an element. name: one of the drawings above, or "emblem".
	function art(name, cls) {
		var el = h("span", { class: "art art-" + name + (cls ? " " + cls : ""), "aria-hidden": "true" });
		el.innerHTML = name === "emblem" ? emblem() : svgs[name];
		return el;
	}

	// A black censor bar, as on the sheet's "AFFIX [bar] FIRMLY" and DOCREF lines.
	function censor(width) {
		return h("span", { class: "censor", style: "width:" + (width || 3) + "em", "aria-hidden": "true" });
	}

	// Shrinks a picked image to a small JPEG data URL, so portraits stay light in
	// browser storage and exports. Calls done(dataUrl) or done(null) on failure.
	function readPortrait(file, done) {
		if (!file || !/^image\//.test(file.type)) { done(null); return; }
		var reader = new FileReader();
		reader.onload = function () {
			var img = new Image();
			img.onload = function () {
				var max = 260;
				var scale = Math.min(1, max / Math.max(img.width, img.height));
				var canvas = document.createElement("canvas");
				canvas.width = Math.round(img.width * scale);
				canvas.height = Math.round(img.height * scale);
				canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
				try { done(canvas.toDataURL("image/jpeg", 0.82)); } catch (e) { done(null); }
			};
			img.onerror = function () { done(null); };
			img.src = reader.result;
		};
		reader.onerror = function () { done(null); };
		reader.readAsDataURL(file);
	}

	CAIN.art = art;
	CAIN.censor = censor;
	CAIN.readPortrait = readPortrait;
})();
