// Saved characters and the creation draft, kept in this browser's localStorage.
window.CAIN = window.CAIN || {};

(function () {
	var KEY_CHARACTERS = "cain.characters";
	var KEY_DRAFT = "cain.draft";
	var safe = CAIN.safeStore;

	function list() {
		var all = safe.get(KEY_CHARACTERS, []);
		return Array.isArray(all) ? all : [];
	}

	function get(id) {
		return list().filter(function (c) { return c.id === id; })[0] || null;
	}

	// Insert or replace by id. Returns false if the browser refused to store it.
	function save(ch) {
		var all = list();
		ch.updated = Date.now();
		var i = all.findIndex(function (c) { return c.id === ch.id; });
		if (i >= 0) all[i] = ch; else all.push(ch);
		return safe.set(KEY_CHARACTERS, all);
	}

	function remove(id) {
		safe.set(KEY_CHARACTERS, list().filter(function (c) { return c.id !== id; }));
	}

	// The draft is { character, step }.
	function getDraft() {
		var d = safe.get(KEY_DRAFT, null);
		return d && d.character ? d : null;
	}

	function saveDraft(draft) {
		return safe.set(KEY_DRAFT, draft);
	}

	function clearDraft() {
		safe.remove(KEY_DRAFT);
	}

	CAIN.store = {
		list: list,
		get: get,
		save: save,
		remove: remove,
		getDraft: getDraft,
		saveDraft: saveDraft,
		clearDraft: clearDraft
	};
})();
