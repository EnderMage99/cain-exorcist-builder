// Export and import: packs characters into a labelled file and reads them back,
// checking what came in. No DOM access.
window.CAIN = window.CAIN || {};

(function () {
	var R = CAIN.rules;
	var core = CAIN.core;
	var FORMAT = "cain-exorcist-builder";
	var VERSION = 1;

	// One or more characters as the text of a .cain.json file.
	function pack(characters) {
		return JSON.stringify({
			format: FORMAT,
			version: VERSION,
			exported: new Date().toISOString(),
			characters: characters
		}, null, "\t");
	}

	// Problems that make a character unusable.
	function structureErrors(c) {
		var errors = [];
		if (!c || typeof c !== "object" || Array.isArray(c)) return ["not a character"];
		if (c.schema !== 1) errors.push("unknown character version");
		if (!c.skills || typeof c.skills !== "object") errors.push("no skills");
		else core.skills.forEach(function (s) {
			if (typeof c.skills[s.id] !== "number") errors.push("skill " + s.id + " missing");
		});
		["agendaAbilities", "blasphemies", "sinMarks", "purchases"].forEach(function (k) {
			if (c[k] !== undefined && !Array.isArray(c[k])) errors.push(k + " is not a list");
		});
		return errors;
	}

	// Content this build doesn't know about. The character still loads; those
	// entries just don't show until the content is added.
	function contentWarnings(c) {
		var name = c.name || "An exorcist";
		var out = [];
		// The character's own custom agendas and blasphemies count as known.
		function findIn(list, id) { return (list || []).filter(function (x) { return x.id === id; })[0] || null; }
		function agendaOf(id) { return R.agenda(id) || findIn(c.custom.agendas, id); }
		function blasOf(id) { return R.blasphemy(id) || findIn(c.custom.blasphemies, id); }
		if (c.agenda && !agendaOf(c.agenda)) out.push(name + ": agenda \"" + c.agenda + "\" isn't in this build.");
		c.agendaAbilities.forEach(function (r) {
			var a = agendaOf(r.agenda);
			if (!a || !findIn(a.abilities, r.ability)) out.push(name + ": agenda ability \"" + r.ability + "\" isn't in this build.");
		});
		c.blasphemies.forEach(function (b) {
			var def = blasOf(b.id);
			if (!def) out.push(name + ": blasphemy \"" + b.id + "\" isn't in this build.");
			else b.powers.forEach(function (p) {
				if (!findIn(def.powers, p)) out.push(name + ": power \"" + p + "\" isn't in this build.");
			});
		});
		c.sinMarks.forEach(function (m) {
			if (!R.sinMark(m.mark)) out.push(name + ": sin mark \"" + m.mark + "\" isn't in this build.");
		});
		c.purchases.forEach(function (p) {
			if (!R.purchaseItem(p)) out.push(name + ": kit item \"" + p.item + "\" isn't in this build.");
		});
		(c.virtues || []).forEach(function (v) {
			if (!R.virtue(v.id)) out.push(name + ": virtue \"" + v.id + "\" isn't in this build.");
		});
		return out;
	}

	// Fills anything an older or hand-edited file left out.
	function complete(c) {
		var blank = R.newCharacter();
		Object.keys(blank).forEach(function (k) {
			if (c[k] === undefined) c[k] = blank[k];
		});
		Object.keys(blank.looks).forEach(function (k) { if (c.looks[k] === undefined) c.looks[k] = ""; });
		Object.keys(blank.questions).forEach(function (k) { if (c.questions[k] === undefined) c.questions[k] = ""; });
		Object.keys(blank.settings).forEach(function (k) { if (c.settings[k] === undefined) c.settings[k] = blank.settings[k]; });
		if (typeof c.id !== "string" || !c.id) c.id = blank.id;
		CAIN.hunt.normalize(c);
		return c;
	}

	// Reads file or pasted text. Accepts this format, a bare character (exports
	// from before M6), or a list of characters.
	// Returns { characters, warnings, error }.
	function unpack(text) {
		var data;
		try {
			data = JSON.parse(text);
		} catch (e) {
			return { characters: [], warnings: [], error: "That isn't a CAIN export: it couldn't be read as a file of characters." };
		}
		var list;
		if (data && data.format === FORMAT) {
			if (typeof data.version !== "number" || data.version > VERSION) {
				return { characters: [], warnings: [], error: "That file was made by a newer version of this site. Refresh the page (Ctrl+F5) and try again." };
			}
			list = Array.isArray(data.characters) ? data.characters : [];
		} else if (Array.isArray(data)) {
			list = data;
		} else {
			list = [data];
		}
		var characters = [];
		var warnings = [];
		list.forEach(function (c, i) {
			var errors = structureErrors(c);
			if (errors.length) {
				warnings.push("Skipped entry " + (i + 1) + ": " + errors[0] + ".");
				return;
			}
			complete(c);
			warnings = warnings.concat(contentWarnings(c));
			characters.push(c);
		});
		if (!characters.length) {
			return { characters: [], warnings: warnings, error: "No exorcists found in that file." };
		}
		return { characters: characters, warnings: warnings, error: null };
	}

	// File name for an export: one character's name, or a dated backup.
	function fileName(characters) {
		if (characters.length === 1) {
			var base = (characters[0].name || "exorcist").replace(/[^A-Za-z0-9 _-]+/g, "").trim().replace(/\s+/g, "-") || "exorcist";
			return base + ".cain.json";
		}
		var d = new Date();
		var stamp = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
		return "cain-exorcists-" + stamp + ".cain.json";
	}

	CAIN.transfer = {
		FORMAT: FORMAT,
		VERSION: VERSION,
		pack: pack,
		unpack: unpack,
		fileName: fileName
	};
})();
