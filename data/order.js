// Loaded after all content: groups blasphemies by colour family, the way the
// core book runs red (I-III), orange (IV-VI), blue (VII-IX), purple (X-XII).
// Supplement blasphemies land beside the core ones of their colour; within a
// family the load order holds (core, then Games for Freaks, then fan books).
window.CAIN = window.CAIN || {};

(function () {
	function family(hex) {
		var m = /^#?([0-9a-f]{6})$/i.exec(hex || "");
		if (!m) return 6;
		var n = parseInt(m[1], 16);
		var r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
		var max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
		if (d < 0.15) return 6; // greys and whites last
		var hue = max === r ? 60 * (((g - b) / d) % 6) : max === g ? 60 * ((b - r) / d + 2) : 60 * ((r - g) / d + 4);
		if (hue < 0) hue += 360;
		if (hue < 20 || hue >= 330) return 0; // red
		if (hue < 65) return 1; // orange and yellow
		if (hue < 170) return 2; // green
		if (hue < 255) return 3; // blue
		return 4; // purple and pink
	}

	var order = { 0: 0, 1: 1, 3: 2, 4: 3, 2: 4, 6: 5 };
	CAIN.blasphemies = CAIN.blasphemies.map(function (b, i) { return { b: b, i: i, f: order[family(b.theme && b.theme.color)] }; })
		.sort(function (x, y) { return x.f - y.f || x.i - y.i; })
		.map(function (x) { return x.b; });
})();
