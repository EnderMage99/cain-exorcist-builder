// Doctrine atmosphere: a large faint piece of the book's art behind each page
// that scrolls slower than the page, a few embers drifting upward, and the
// page title catching like an old bulb. Everything stops for reduced motion.
window.CAIN = window.CAIN || {};

(function () {
	var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
	function still() { return calm && calm.matches; }

	var bg = document.createElement("div");
	bg.className = "fx-bg";
	bg.setAttribute("aria-hidden", "true");
	var canvas = document.createElement("canvas");
	canvas.className = "fx-motes";
	canvas.setAttribute("aria-hidden", "true");
	document.body.insertBefore(canvas, document.body.firstChild);
	document.body.insertBefore(bg, document.body.firstChild);
	// Decorated strips down both edges of wide screens; CSS draws them per page.
	["left", "right"].forEach(function (side) {
		var edge = document.createElement("div");
		edge.className = "edge edge-" + side;
		edge.setAttribute("aria-hidden", "true");
		document.body.insertBefore(edge, document.body.firstChild);
	});

	function onDoctrine() { return /^doctrine/.test(document.body.getAttribute("data-page") || ""); }

	// Background drifts at a third of the scroll speed.
	var ticking = false;
	function parallax() {
		ticking = false;
		bg.style.transform = still() ? "" : "translate3d(0," + (-window.scrollY * 0.3).toFixed(1) + "px,0)";
	}
	window.addEventListener("scroll", function () {
		if (!ticking) { ticking = true; requestAnimationFrame(parallax); }
	}, { passive: true });

	// Embers: a dozen faint specks rising slowly, kept on a single canvas.
	var ctx = canvas.getContext && canvas.getContext("2d");
	var motes = [];
	var running = false;
	function size() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}
	function spawn(anywhere) {
		return {
			x: Math.random() * canvas.width,
			y: anywhere ? Math.random() * canvas.height : canvas.height + 10,
			r: 0.8 + Math.random() * 1.8,
			vy: 0.15 + Math.random() * 0.35,
			drift: Math.random() * Math.PI * 2,
			a: 0.15 + Math.random() * 0.3
		};
	}
	function frame() {
		if (!running) return;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		var ink = getComputedStyle(document.documentElement).getPropertyValue("--stamp").trim() || "#c0262d";
		motes.forEach(function (m, i) {
			m.y -= m.vy;
			m.drift += 0.01;
			var x = m.x + Math.sin(m.drift) * 12;
			ctx.globalAlpha = m.a * Math.min(1, m.y / 200);
			ctx.fillStyle = ink;
			ctx.beginPath();
			ctx.arc(x, m.y, m.r, 0, Math.PI * 2);
			ctx.fill();
			if (m.y < -10) motes[i] = spawn(false);
		});
		ctx.globalAlpha = 1;
		requestAnimationFrame(frame);
	}
	function start() {
		if (!ctx || running || still()) return;
		size();
		motes = [];
		for (var i = 0; i < 14; i++) motes.push(spawn(true));
		running = true;
		requestAnimationFrame(frame);
	}
	function stop() {
		running = false;
		if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
	}
	window.addEventListener("resize", function () { if (running) size(); });

	// Called after each render: turns the effects on for Doctrine pages only and
	// flickers a newly opened page's title.
	var lastPage = null;
	function update() {
		var page = document.body.getAttribute("data-page");
		if (onDoctrine() && !still()) start(); else stop();
		parallax();
		if (page !== lastPage && onDoctrine() && !still()) {
			var h1 = document.querySelector("#app h1");
			if (h1) { h1.classList.remove("flicker"); void h1.offsetWidth; h1.classList.add("flicker"); }
		}
		lastPage = page;
	}

	CAIN.fx = { update: update };
})();
