// Illustrations from the official CAIN character sheet (CAINsheets 1.4), cut
// out as black ink on transparency in img/sheet/: CAIN emblem, brain, inkblot
// brain, daggers, execution seal, skull, sin splats, body, grub, fly, beetle.
// CSS inverts the ink in dark mode and inside dark boxes.
window.CAIN = window.CAIN || {};

(function () {
	var h = CAIN.h;
	var files = {
		emblem: "emblem.png",
		brain: "brain.png",
		inkblot: "inkblot.png",
		daggers: "daggers.png",
		seal: "seal.png",
		skull: "skull.png",
		body: "body.png",
		grub: "grub.png",
		fly: "fly.png",
		beetle: "beetle.png"
	};

	// An illustration as an element. name: one of the files above.
	function art(name, cls) {
		return h("span", { class: "art art-" + name + (cls ? " " + cls : ""), "aria-hidden": "true" },
			h("img", { src: "img/sheet/" + files[name], alt: "", draggable: "false" }));
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
