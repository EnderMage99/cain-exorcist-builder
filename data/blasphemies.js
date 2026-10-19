// Blasphemies. Test build: Tension and Gate, plus Blast which every exorcist has.
// Text tokens resolve against CAT: {cat}, {cat+2}, {2+cat}, {halfcat}, and
// {cat:area} style lookups into CAIN.core.catTable. See CAIN.rules.resolveText.
// burst: "required" spend one, "onSuccess" roll first and spend only on success,
// "multiple" may spend several, "none" no burst needed.
window.CAIN = window.CAIN || {};

CAIN.blast = {
	id: "blast",
	name: "Blast",
	tags: { duration: "Instant", range: "Short" },
	burst: "required",
	text: "Spend a psyche burst and roll PSYCHE to produce a weaponized form of concentrated psychic energy in melee or short range. The specific look and feel of this basic exorcist skill varies between exorcists. The strength of this blast scales with CAT ({cat:magnitude}). Unlike your mundane service weapons, blast is a supernatural weapon and doesn't become hard by default when used against sins."
};

CAIN.blasphemies = [
	{
		id: "tension",
		numeral: "I",
		name: "Tension",
		summary: "Project powerful fields of force to block, cut, or entrap.",
		flavor: "Project a spot psychic field of incredible density and durability. This often takes the form of a metallic shimmering surface, visible only to the psychically sensitive.",
		passive: {
			id: "iron-soul", name: "Iron Soul",
			text: "When you would fill up your execution talisman, you may roll 1d6. On a 4+, go to 1 stress under maximum instead and ignore any excess, then lose the use of this passive until you rest."
		},
		powers: [
			{ id: "aegis", name: "Aegis",
				tags: { duration: "Instant", range: "Short" }, burst: "required",
				text: "When you or a visible ally in short range of you would mark stress from external harm, you can intervene by answering the following questions:\n- Can you reach your target in time?\n- Is there any part of the environment you can use to shield your target?\n- Is your heart in this?\nYou create a flash tension field of incredible strength, blocking damage. For each 'yes' answer, roll 1d6. For every 2+ rolled reduce stress suffered by 1, and for every 6 rolled reduce it by 2. This could reduce stress suffered to 0.\nAfter using this power, lose its use until you rest." },
			{ id: "stasis", name: "Stasis",
				tags: { duration: "1 scene", effect: "Curse", range: "Short" }, burst: "onSuccess",
				text: "With a gesture, you can lock yourself or a CAT sized group ({cat:people}) of humans or exorcists in a tension cage that covers them like a second skin, paralyzing them. If a human is hostile or unwilling, roll PSYCHE, and only spend the burst on success.\nOnce trapped, your target is locked in, unable to move or act for the scene, and is immune to all harm and effects from the outside. The effect only ends once the scene passes and you cannot end it earlier. They can be moved around like a (very stiff) object and are fully sensate while inside, though they can see as though looking through a thick pane of glass and don't need to breathe." },
			{ id: "severance", name: "Severance",
				tags: { duration: "Instant", range: "Short" }, burst: "onSuccess",
				text: "You can project a tension field of incredible strength over any edge, as obvious as a blade and as subtle as a fingernail, and use it as a cutting implement. Roll PSYCHE to cut an object or opponent with a clean and decisive blow, only spending a psyche burst on success.\n- Gain +1D if you are striking to protect another person\n- Gain +1D against immobile objects or opponents" },
			{ id: "malleate", name: "Malleate",
				tags: { duration: "Until rest", effect: "Transmute", range: "Adjacent" }, burst: "required",
				text: "You can invert and infuse a tension field to make an area of nonliving matter incredibly pliable and soft. The size of this block of matter you can affect is affected by CAT ({cat:size}). Choose one of the following effects, then you may gain or grant +1D when you or any ally next acts to take advantage of this power:\n- Rubber: The matter becomes bouncy and springy\n- Mud: The matter melts into a thick mud. It becomes pliable and sticky and difficult to move through\n- Liquid: The matter melts into liquid\nThis power may easily affect the parameters of rolls, such as difficulty and risk. When the effect expires, the matter slowly reverts to its original state and form." },
			{ id: "fortress", name: "Fortress",
				tags: { duration: "Until rest", effect: "Summon", range: "Short" }, burst: "required",
				talisman: "{2+cat}",
				text: "Once a scene, you can create a spot tension field with a size determined by up to CAT ({cat:size}) that appears as a large plane of shimmering force, invisible to humans. It can only exist as a flat plane (no bends or curves), and intersect or overlap any nonliving material, but otherwise is as hard as a solid object and prevents all living and nonliving matter and energy from crossing it. It has a 2+CAT ({2+cat}) talisman for its durability, which can take damage and be slashed like an execution talisman by opponents. The field lasts until destroyed, until used again, or until rest." }
		]
	},
	{
		id: "gate",
		numeral: "V",
		name: "Gate",
		summary: "Manipulate space as a sculptor works with clay.",
		flavor: "Manipulate space as a sculptor works with clay. ALERT: Abuse can lead to extreme personnel loss. Use with caution.",
		passive: {
			id: "pocket", name: "Pocket",
			text: "You can fit a compressed tear in space into a piece of clothing that you are wearing.\n- You gain +1 KP\n- You can stow or retrieve items inside your pocket, which can hold a combined total of items worth up to 3 KP. Once inside, the items are stored in an extra dimensional space and hidden and safe, no matter their size. The pocket is attached to your clothes and if they are destroyed, items inside pop out.",
			modifiers: [{ stat: "kitPoints", add: 1 }]
		},
		powers: [
			{ id: "tear", name: "Tear",
				tags: { duration: "Until rest", effect: "Summon", range: "CAT range ({cat:range})" }, burst: "required",
				text: "You create a point in CAT range ({cat:range}), and another point within the same range, though you have to be able to see both points when you use this ability. The two points are connected by a slash in the fabric of reality, a portal that can be moved through and connects the two points as though they were right next to each other. Objects, beings, and forces up to 1/2 CAT in size ({halfcat:size}) can freely move through the tear for the duration, and momentum is preserved.\nYou may gain or grant +1D when you or any ally next acts to take advantage of this power." },
			{ id: "pinch", name: "Pinch",
				tags: { duration: "Instant", range: "Special" }, burst: "onSuccess",
				text: "You can choose a single living being or object you can see. The combined size of the object or being and the distance you attempt to move them must be CAT+2 ({cat+2}) or less. Roll PSYCHE if your target is unwilling, only spending a psyche burst on success. As long as you can see your target, on at least one success, you can pinch space between the two of you to move your target right next to you. From the target's perspective, they don't appear to move at all, but the world smears around them. They ignore all physical obstructions between them and you - as long as you can see your target, they simply appear next to you.\nYou may gain or grant +1D when you or any ally next acts to take advantage of this power." },
			{ id: "bloom", name: "Bloom",
				tags: { duration: "1 scene", effect: "Summon", range: "Short" }, burst: "required",
				text: "By splitting space in creative ways, you create a number of controllable duplicates of any of your limbs or hands equal to CAT+1 ({cat+1}) on any surfaces in short range from you, emerging from a tear in space. They are stuck in place and cannot move. Gain or grant +1D when you or any ally next acts to take advantage of this power:\n- You can control them like your normal limbs, making action rolls through them and you have normal sensation with them.\n- They can be placed on any surface, including moving surfaces or living beings.\n- You take any stress they would take from your actions made through them." },
			{ id: "transmission", name: "Transmission",
				tags: { duration: "Instant", range: "CAT+2 range ({cat+2:range})" }, burst: "required",
				text: "Instantly move to any other area in CAT+2 range ({cat+2:range}). However, the Admin asks you the following questions and rolls 1d6 per 'no' answer.\n- Are you familiar with your destination?\n- Can you see where you are going?\n- Are you calm and concentrated?\nOn at least one '1', you end up in a different location nearby your destination, but the Admin chooses where. On a double 1, you end up somewhere else briefly before arriving at your final destination. Not only are you off target, but you also take 2d3 stress." },
			{ id: "maze", name: "Maze",
				tags: { duration: "Entire hunt", effect: "Transmute", range: "Adjacent, CAT area ({cat:area})" }, burst: "required",
				text: "You rearrange an area equal to CAT ({cat:area}) around you, causing the rearrangement of human built structures in the area. Gain or grant +1D when you or any ally next acts to take advantage of this power. You may:\n- create or remove doors and windows, or change the existing arrangement of doors and windows\n- add corridors, or rearrange the floor plan of rooms\n- change the direction of gravity inside of a room. For example, you could make a wall the 'floor'\n- make a room larger or smaller\n- arrange or remove the furniture inside a room any way you like\nYou cannot remove rooms entirely, make any room smaller than a closet or larger than a ballroom, or add anything that does not already exist in a building other than corridors. This could cause a structure to be bigger on the inside than outside.\nFor each choice, the Admin rolls 1d6. If they roll at least one '1' the Admin gains one use of this power against you at your current CAT and can activate it any time they like." }
		]
	}
];
