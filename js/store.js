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

	// Undo history: every save keeps the version it replaces, per character, so
	// any change (an action, a click on the sheet, typing) can be stepped back.
	// Kept for this browser tab only (sessionStorage), newest last.
	var KEY_HISTORY = "cain.history";
	var HISTORY_MAX = 30;
	var MERGE_MS = 2000;
	var history = loadHistory();

	function loadHistory() {
		try { var h = JSON.parse(sessionStorage.getItem(KEY_HISTORY) || "{}"); return h && typeof h === "object" ? h : {}; } catch (e) { return {}; }
	}

	function keepHistory() {
		try { sessionStorage.setItem(KEY_HISTORY, JSON.stringify(history)); } catch (e) {
			// Too big for the tab's storage: keep the newest few and try again.
			Object.keys(history).forEach(function (id) { history[id].undo = history[id].undo.slice(-5); history[id].redo = []; });
			try { sessionStorage.setItem(KEY_HISTORY, JSON.stringify(history)); } catch (e2) { /* memory only */ }
		}
	}

	function stacks(id) {
		if (!history[id]) history[id] = { undo: [], redo: [] };
		return history[id];
	}

	// What changed between two saves, in words: the oldest new log line, if any.
	function describe(before, after) {
		var seen = {};
		(before.log || []).forEach(function (e) { seen[e.t + "|" + e.text] = 1; });
		var fresh = (after.log || []).filter(function (e) { return !seen[e.t + "|" + e.text]; });
		return fresh.length ? fresh[fresh.length - 1].text : "Edited the sheet";
	}

	function comparable(c) {
		var copy = Object.assign({}, c);
		delete copy.updated;
		return JSON.stringify(copy);
	}

	// Insert or replace by id. Returns false if the browser refused to store it.
	// opts.silent: don't record an undo step (for tidy-ups the player didn't make).
	function save(ch, opts) {
		var all = list();
		var i = all.findIndex(function (c) { return c.id === ch.id; });
		var before = i >= 0 ? all[i] : null;
		if (before && !(opts && opts.silent) && comparable(before) !== comparable(ch)) {
			var st = stacks(ch.id);
			var label = describe(before, ch);
			var last = st.undo[st.undo.length - 1];
			// Typing in a field saves often; fold quick edits into one step.
			if (last && label === "Edited the sheet" && last.label === label && Date.now() - last.t < MERGE_MS) last.t = Date.now();
			else st.undo.push({ label: label, t: Date.now(), state: before });
			if (st.undo.length > HISTORY_MAX) st.undo.shift();
			st.redo = [];
			keepHistory();
		}
		ch.updated = Date.now();
		if (i >= 0) all[i] = ch; else all.push(ch);
		return safe.set(KEY_CHARACTERS, all);
	}

	function write(ch) {
		var all = list();
		var i = all.findIndex(function (c) { return c.id === ch.id; });
		if (i >= 0) all[i] = ch; else all.push(ch);
		safe.set(KEY_CHARACTERS, all);
	}

	// Steps back one change. Returns { label } of what was undone, or null.
	function undo(id) {
		var st = stacks(id);
		var step = st.undo.pop();
		var current = get(id);
		if (!step || !current) return null;
		st.redo.push({ label: step.label, t: Date.now(), state: current });
		write(step.state);
		keepHistory();
		return { label: step.label };
	}

	function redo(id) {
		var st = stacks(id);
		var step = st.redo.pop();
		var current = get(id);
		if (!step || !current) return null;
		st.undo.push({ label: step.label, t: Date.now(), state: current });
		write(step.state);
		keepHistory();
		return { label: step.label };
	}

	// The labels of the next undo and redo, or null.
	function historyFor(id) {
		var st = history[id] || { undo: [], redo: [] };
		var u = st.undo[st.undo.length - 1];
		var r = st.redo[st.redo.length - 1];
		return { undo: u ? u.label : null, redo: r ? r.label : null, undoCount: st.undo.length };
	}

	function remove(id) {
		safe.set(KEY_CHARACTERS, list().filter(function (c) { return c.id !== id; }));
	}

	// Custom agendas and blasphemies from every saved character, for the rules'
	// lookups. Rebuilt only when the saved data changes.
	var customCache = { raw: null, content: { agendas: [], blasphemies: [] } };
	function customContent() {
		var raw = null;
		try { raw = localStorage.getItem(KEY_CHARACTERS); } catch (e) { raw = null; }
		if (raw === customCache.raw) return customCache.content;
		var content = { agendas: [], blasphemies: [] };
		list().forEach(function (c) {
			if (!c.custom) return;
			(c.custom.agendas || []).forEach(function (a) { content.agendas.push(a); });
			(c.custom.blasphemies || []).forEach(function (b) { content.blasphemies.push(b); });
		});
		customCache = { raw: raw, content: content };
		return content;
	}
	CAIN.rules.setCustomProvider(customContent);

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
		undo: undo,
		redo: redo,
		historyFor: historyFor,
		remove: remove,
		getDraft: getDraft,
		saveDraft: saveDraft,
		clearDraft: clearDraft
	};
})();
