// Core rules data from CAIN 1.4.5: skills, the CAT table, base values and glossary.
window.CAIN = window.CAIN || {};

CAIN.core = {
	skills: [
		{ id: "force", name: "Force", short: "Smash, fight, cut, grapple.",
			text: "Apply direct and close force or violence. Used when deploying strength: melee combat, breaking or smashing something, tackling, violent intimidation." },
		{ id: "conditioning", name: "Conditioning", short: "Sprint, climb, swim, balance.",
			text: "Get around on foot. Used for movement and athleticism: jumping a fence, climbing a building, outrunning the police." },
		{ id: "coordination", name: "Coordination", short: "Shoot, throw, catch.",
			text: "Use your hand-eye coordination. Mainly firearms, but also throwing, catching and other tasks of manual accuracy." },
		{ id: "covert", name: "Covert", short: "Sneak, lock pick, steal.",
			text: "Move with stealth and act with sleight of hand. Doing things silently or unseen: pickpocketing, picking locks. Not fast, can't be rushed." },
		{ id: "interfacing", name: "Interfacing", short: "Drive, hack, repair.",
			text: "Use, understand, build, or fix technology, vehicles, or devices. Driving, hot-wiring, modifying a firearm, searching a computer." },
		{ id: "investigation", name: "Investigation", short: "Research, study, sleuth.",
			text: "Examine something in detail, or uncover information about it. Decoding occult symbols, analysing a substance, reconstructing a scene." },
		{ id: "surveillance", name: "Surveillance", short: "Survey, track, spot.",
			text: "Use your power of observation. Taking stock of a situation, tracking or tailing a target, looking for hidden clues." },
		{ id: "negotiation", name: "Negotiation", short: "Sway, lie, bargain.",
			text: "Rely on your words to influence others who are at least partly receptive. Talking down a hostage taker, bribing, posing as someone else." },
		{ id: "authority", name: "Authority", short: "Lead, organize, order, intimidate.",
			text: "Wield your leadership and force of will. Leading a squad, ordering humans to avert their gaze, intimidating a suspect." },
		{ id: "connection", name: "Connection", short: "Intuit, empathize, network.",
			text: "Connect to others, and draw on those connections. Calling in favors, reading someone's emotional state, finding someone's contacts." }
	],

	// Skill creation: all at 1, then two raised to 2 and three lowered to 0.
	creation: { start: 1, raise: 2, lower: 3 },
	skillMax: 3,
	skillsAtMaxLimit: 2,
	skillImprovementLimit: 6,

	// Missions survived needed for each CAT rating (index 0 = CAT 1).
	catThresholds: [0, 1, 2, 4, 7],
	catMax: 7,

	// The CAT scale table, CAT 0-7.
	catNames: ["Human", "Imp", "Geist", "Revenant", "Wraith", "Demon", "God", "Demon God"],
	catTable: {
		people: ["one", "a few", "a small group", "a large group", "a crowd", "a large crowd", "thousands of people", "many thousands of people"],
		size: ["human size", "heavy furniture", "a large animal", "a vehicle", "a large vehicle", "a building", "a large building", "a skyscraper"],
		area: ["personal", "a few people", "an entire room", "a few rooms", "a whole building", "a city block", "a whole neighborhood", "a whole town"],
		range: ["touch", "the same room", "across the street", "down the block", "a few blocks away", "across town", "visual range", "over the horizon"],
		speed: ["an average human", "a fast human", "a fast animal", "a car", "a train", "a maglev", "an airliner", "a jet fighter"],
		magnitude: ["small", "noticeable", "large", "very large", "massive", "destructive", "overwhelming", "cataclysmic"]
	},
	catDimensions: ["people", "size", "area", "range", "speed", "magnitude"],

	// Power tags used in the book (CAIN 1.4.5, "Tags"). Range values that scale
	// with CAT carry a token so they resolve to the character's CAT.
	powerTags: {
		duration: ["Instant", "Until rest", "1 scene", "Entire hunt"],
		effect: ["Curse", "Charm", "Transmute", "Summon"],
		range: [
			{ label: "Self", value: "Self" },
			{ label: "Adjacent", value: "Adjacent" },
			{ label: "Short", value: "Short" },
			{ label: "Long", value: "Long" },
			{ label: "Extreme", value: "Extreme" },
			{ label: "CAT range", value: "CAT range ({cat:range})" },
			{ label: "CAT+1 range", value: "CAT+1 range ({cat+1:range})" },
			{ label: "CAT+2 range", value: "CAT+2 range ({cat+2:range})" },
			{ label: "CAT area", value: "CAT area ({cat:area})" },
			{ label: "Special", value: "Special" },
			{ label: "Investigation area", value: "Investigation area" },
			{ label: "Infinite", value: "Infinite range" }
		]
	},

	// Burst symbols, as in the book: a black four-point star needs a psyche burst
	// (with + for one or more); an outline star needs none, or only on success.
	burstKinds: [
		{ id: "required", label: "Needs a psyche burst" },
		{ id: "multiple", label: "One or more psyche bursts" },
		{ id: "onSuccess", label: "Burst only on success" },
		{ id: "none", label: "No psyche burst" }
	],

	// CAT values a player can drop into custom text. Each fills in for the
	// character's CAT, like the book's "a CAT sized group" or "up to 1/2 CAT".
	catInserts: [
		{ group: "Numbers", options: [
			{ label: "CAT", token: "{cat}" },
			{ label: "CAT+1", token: "{cat+1}" },
			{ label: "CAT+2", token: "{cat+2}" },
			{ label: "half CAT (rounded up)", token: "{halfcat}" },
			{ label: "2+CAT (talisman length)", token: "{2+cat}" }
		] },
		{ group: "At CAT", options: [
			{ label: "CAT people (a group of...)", token: "{cat:people}" },
			{ label: "CAT size", token: "{cat:size}" },
			{ label: "CAT area", token: "{cat:area}" },
			{ label: "CAT range", token: "{cat:range}" },
			{ label: "CAT speed", token: "{cat:speed}" },
			{ label: "CAT magnitude", token: "{cat:magnitude}" }
		] },
		{ group: "At CAT+1 / CAT+2", options: [
			{ label: "CAT+1 size", token: "{cat+1:size}" },
			{ label: "CAT+1 range", token: "{cat+1:range}" },
			{ label: "CAT+2 size", token: "{cat+2:size}" },
			{ label: "CAT+2 range", token: "{cat+2:range}" },
			{ label: "CAT+2 area", token: "{cat+2:area}" }
		] },
		{ group: "At half CAT", options: [
			{ label: "half CAT people", token: "{halfcat:people}" },
			{ label: "half CAT size", token: "{halfcat:size}" },
			{ label: "half CAT area", token: "{halfcat:area}" },
			{ label: "half CAT range", token: "{halfcat:range}" }
		] }
	],

	// Base values before modifiers. Sin cap 10 is the box count on the official sheet.
	base: {
		maxStress: 6,
		maxInjuries: 3,
		kitPoints: 5,
		sinCap: 10,
		xpToAdvance: 4,
		psycheBursts: 3,
		restDice: 2,
		pathosMax: 3,
		hookLength: 3,
		bonusDiceCap: 3,
		instantDeathStress: 7
	},

	// Campaign house rules the book suggests for tuning.
	defaultSettings: {
		psycheBursts: 3,
		sinCapBonus: 0,
		clearSinAfterMission: false
	},

	questions: [
		{ id: "manifest", text: "How did you first manifest your powers?" },
		{ id: "seed", text: "Is your sin-seed in your brain or in your heart?" },
		{ id: "hidden", text: "What do you hide in the deepest parts of you?" },
		{ id: "hand", text: "Is your hand your hand?" },
		{ id: "mother", text: "Do you remember the face of your mother?" }
	],

	xpQuestions: [
		{ id: "survived", text: "Did you survive?" },
		{ id: "firstItem", text: "Did you follow your first agenda item?" },
		{ id: "boldItem", text: "Did you follow at least one bolded agenda item?" },
		{ id: "harmed", text: "Did you take an injury or affliction?" }
	],

	missionPay: { execute: 5, spare: 3, fail: -1, perBodyRecovered: 1 },
	advanceScrip: 3,
	weaponUpgrade: { cost: 3, maxCat: 3 },


	defaultKit: [
		{ id: "uniform", name: "Issue uniform", kp: 0, text: "Standard issue uniform, collar, shoes, button pin." },
		{ id: "notebook", name: "Notebook, pen", kp: 1, text: "Notebook and pen." },
		{ id: "matchbook", name: "Matchbook (20 matches), clean handkerchief", kp: 1, text: "Matchbook (20 matches). Clean handkerchief." },
		{ id: "service-weapons", name: "Service weapons", kp: 2, text: "A firearm, ammunition, and melee weapon, at your weapon CAT. Upgrade +1 CAT for 3 scrip, to a max of CAT 3." }
	],

	glossary: {
		"psyche burst": "A limited resource for using powers. Spend one to activate a blasphemy power, or for +1D on any roll by using your powers creatively. Start each hunt with 3; regain by resting. You may gain 1d3 sin instead of spending one.",
		"psyche": "Special skill equal to half your CAT, rounded up. Rolled when using blasphemies.",
		"cat": "Category. Rates the scale and strength of exorcists, sins and effects, from 0 (human) to 7. Exorcists are CAT 1-5 and rise by surviving missions.",
		"stress": "Harm slashes the execution talisman instead of hurting you directly. When it fills, clear it, take an injury, and the rest rolls over.",
		"nonlethal": "Nonlethal stress can never fill your talisman; it always leaves one slash open.",
		"injury": "Each injury reduces max stress by 1. At 3 injuries any more stress means instant death. All injuries heal after a mission.",
		"hook": "A 3-slash talisman for a delayed consequence. Slashed when you gain it again, when pressure increases, or when the risk die rolls a 1. When full, the Admin cashes it in.",
		"affliction": "An ongoing, usually negative effect from a sin. Lasts the rest of the hunt.",
		"sin": "Gained instead of spending psyche bursts. Reaching your sin cap causes sin overflow at the end of the scene. Halved after each mission.",
		"sin overflow": "Give up and become a sin, or resist: roll d6 + sin marks. 6 or less keeps control (a 1 always does): clear all sin, gain a sin mark, cross out two sin boxes.",
		"sin mark": "A permanent mutation from resisting sin overflow. Grants an ability and adds 1 to future resistance rolls.",
		"pathos": "Stored from failed rolls, injuries, afflictions, filled hooks, and fallen allies, up to 3. Burned by Divine Agony. Cleared each session.",
		"divine agony": "Once a session per exorcist and once a scene per group: burn all pathos for +1D each on a roll, ignoring the +3D cap.",
		"talisman": "A tracker that fills with slashes. When rolling on one, every success is a slash.",
		"hard": "Only 6s count as successes.",
		"risky": "The Admin also rolls the risk die: 1 much worse, 2-3 worse, 4-5 as expected, 6 better.",
		"setup": "An action to give another (or yourself) +1D, less hard, or less risky on their next action.",
		"kit points": "Spend KP during a mission to pull out items from your kit list. Start each mission with full KP.",
		"scrip": "CAIN money. Paid per mission, spent between missions on kit.",
		"advance": "Earned each time the XP track fills. Spend on abilities, powers, skills, sin marks or scrip."
	}
};
