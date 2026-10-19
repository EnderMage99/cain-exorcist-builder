// The twelve blasphemies of CAIN 1.4.5 (pages 52-79), plus Blast which every
// exorcist has. Text tokens resolve against CAT: {cat}, {cat+2}, {2+cat},
// {halfcat}, and {cat:area} style lookups into CAIN.core.catTable. See
// CAIN.rules.resolveText.
// burst: "required" spend one, "onSuccess" roll first and spend only on success,
// "multiple" may spend several, "none" no burst needed (the X star).
// theme: the colours of the blasphemy's pages in the book. color is the accent,
// color2 the second colour, dark marks the black-page blasphemies.
window.CAIN = window.CAIN || {};

CAIN.blast = {
	id: "blast",
	theme: { color: "#8a8a8a", color2: "#4a4a4a" },
	name: "Blast",
	tags: { duration: "Instant", range: "Short" },
	burst: "required",
	text: "Spend a psyche burst and roll PSYCHE to produce a weaponized form of concentrated psychic energy in melee or short range. The specific look and feel of this basic exorcist skill varies between exorcists. The strength of this blast scales with CAT ({cat:magnitude}). Unlike your mundane service weapons, blast is a supernatural weapon and doesn't become hard by default when used against sins."
};

CAIN.blasphemies = [
	{
		id: "tension",
		numeral: "I",
		theme: { color: "#f23b3b", color2: "#7d7d7d" },
		name: "Tension",
		summary: "Project powerful fields of force to block, cut, or entrap.",
		flavor: "Project a spot psychic field of incredible density and durability. This often takes the form of a metallic shimmering surface, visible only to the psychically sensitive.\nFact: Tension users are highly likely to experience 'locked in' syndrome episodes at least semi-regularly until they are able to master their powers. See field manual.",
		passive: {
			id: "iron-soul", name: "Iron Soul",
			text: "When you would fill up your execution talisman, you may roll 1d6. On a 4+, go to 1 stress under maximum instead and ignore any excess, then lose the use of this passive until you rest."
		},
		powers: [
			{ id: "aegis", name: "Aegis",
				tags: { duration: "Instant", range: "Short" }, burst: "none",
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
		id: "ardence",
		numeral: "II",
		theme: { color: "#f31e1d", color2: "#eb6b46" },
		name: "Ardence",
		summary: "Manipulate potential energy into furious destruction",
		flavor: "Manipulate potential energy to create flashes of extreme heat or cold. The most potent, and most dangerous of blasphemies - to others and its user.\nFact: Ardence use would be considered inhumane against human soldiers.",
		passive: {
			id: "inner-furnace", name: "Inner Furnace",
			text: "You can take an Unstable Power hook as part of using any Ardence power to increase the CAT of the power up to +2. When the hook fills up, you burn up from the inside, gaining an injury and ending the hook. If this injury would kill you, you explode in an area equal to your CAT ({cat:area}), annihilating yourself and everything inside in a massive explosion. Nothing can survive this."
		},
		powers: [
			{ id: "fury", name: "Fury",
				tags: { duration: "Instant", range: "Long" }, burst: "onSuccess",
				text: "You can create a fierce blast of destructive energy at a location in range with a blast area up to CAT ({cat:area}). When you use this power, roll PSYCHE and answer the following questions, gaining +1D for each 'yes' answer, only spending a Psyche Burst on success.\n- Are you willing to cause indiscriminate harm, not caring what you destroy, burn, or incinerate?\n- Are you willing to let your anger control the outcome?\nWhatever question you answer 'yes' on, it affects the outcome of the action - no matter the roll. In addition, if you answered at least one 'yes', the area is ALWAYS equal to max CAT, and allies in the area or in short distance to you take 2 stress, which cannot be ignored." },
			{ id: "void", name: "Void",
				tags: { duration: "Instant", range: "Short" }, burst: "required",
				text: "You create a flash vacuum by burning the air away. The void creates a loud thunderclap, affecting an area up to CAT ({cat:area}), excluding you. Choose one of the following effects, then you may gain or grant +1D when you or any ally next acts to take advantage of this power:\n- Weak: Sucks in loose objects not held, worn, or bolted down.\n- Medium: All humans and exorcists in the area are thrown off their feet and pulled in, excluding you.\n- Strong: Sins and vehicles up to CAT size ({cat:size}) are thrown off balance or pulled depending on their size. Glass is shattered. The thunderclap is momentarily deafening.\nThis power may affect the parameters of rolls, such as difficulty and risk." },
			{ id: "hell", name: "Hell",
				tags: { duration: "Until rest", effect: "Transmute", range: "Adjacent" }, burst: "required",
				text: "You may dump energy into the ground and anything touching the ground in an area determined by CAT+2 ({cat+2:area}), choosing hot or cold. Choose one of the following effects, which lasts until you rest. You may gain or grant +1D when you or any ally next acts to take advantage of this power:\n- Simmer: Discomfort for humans, lowered or raised temperature, hot or cold surfaces, etc.\n- Poach: Major discomfort for humans, who cannot remain in the area, and discomfort for sins and exorcists. Freeze or boil water, pipes, crack glass, etc.\n- Boil: Deadly to humans, sins and exorcists take 2 stress if they remain in the area for longer than a scene. Light fires or freeze the air in rooms, melt windows or burn doors, or freeze objects.\nThis power may affect the parameters of rolls, such as difficulty and risk." },
			{ id: "sabre", name: "Sabre",
				tags: { duration: "Instant", range: "CAT range ({cat:range})" }, burst: "onSuccess",
				text: "Release a blast of energy in a highly destructive beam. The beam goes in a straight line in a range equal to CAT ({cat:range}), piercing through walls, doors, and obstructions effortlessly. It is extremely loud and bright. Roll PSYCHE for its effects, only spending a psyche burst on success.\nYou may optionally lift the limiter on this ability when using it. If you do, for every '6' result you roll when using ability, this ability inflicts 1 extra slash on a talisman, but you also take 2 stress, which could kill you or cause you an injury. This stress cannot be reduced or ignored in any way." },
			{ id: "storm", name: "Storm",
				tags: { duration: "Entire hunt", effect: "Transmute", range: "Extreme" }, burst: "multiple",
				text: "You can spend any number of psyche bursts to send potential energy into the atmosphere, affecting a microclimate in an area equal to CAT+2 ({cat+2:area}), with a maximum of CAT 7. Choose one of the below, plus one more per psyche burst spent. The chosen effects last for the whole mission or until dismissed.\n- Clear: Clear the skies in the area, canceling any weather (including the below).\n- Rain: Rain drenches the area for the duration of an intensity you choose (drizzle, pouring, torrential).\n- Cold: The air freezes, freezing water and icing over roads and paths. Any precipitation becomes snow.\n- Fog: Thick fog rolls in, limiting visibility.\n- Gale: Whipping wind rolls through the area, blowing away fog, smoke, or dust, and making it hard to hear or be outside.\nThis power may easily affect the parameters of rolls, such as difficulty and risk.\nOnce used, lose the use of this power until you rest." }
		]
	},
	{
		id: "flux",
		numeral: "III",
		theme: { color: "#ca0d0d", color2: "#e80708", dark: true },
		name: "Flux",
		summary: "Tap into the ebb and flow of time.",
		flavor: "Manipulate the direction and flow of time itself.\nFact: This power is relatively new and, as it stands, is barely understood. Fortunately temporal events are tightly regulated by TEMERITY through a captive Sin called the Spindle.",
		passive: {
			id: "steal-time", name: "Steal Time",
			text: "For one rest per hunt, anyone in your group may re-roll all their resting dice, taking the second result as final. This may cause them deja vu. Please reassure them.\nTemporal Instability: Many of your powers give you this hook. When the hook resolves, roll 1d6:\n- 1: Permanently add to your agenda 'Prove that you are the real you.' If you gain this result again, you immediately suffer sin overflow.\n- 2: Mysterious injuries open up. You take an injury, which could kill you.\n- 3: You disappear until rest. You return if there's a conflict scene (and right away if one is ongoing). You have no memory of where you were. When you return, you take 2 stress.\n- 4: You find you are wearing someone else's clothes. Erase your entire kit this mission, but regain any spent kit points.\n- 5: Your body is different. For the remainder of this mission, pick a skill you have 1 or more dice in. It now rolls 0d. After the mission, you have time to train and get used to this, reverting this effect, though keeping any physical changes.\n- 6: Your face looks a little different. The changes are permanent."
		},
		powers: [
			{ id: "reversal", name: "Reversal",
				tags: { duration: "Instant", range: "Adjacent" }, burst: "required",
				text: "By touching an object up to CAT size ({cat:size}), you can reverse its passage through time for the last hour.\n- This could physically move the object, revert damage on an object, etc.\n- It can still affect the physical world, so anything in a reversing object's way would get hit, and anything placed on it will move with it.\n- If it would cause damage or impact, roll PSYCHE for it\n- It cannot reverse life on non-living matter, such as corpses, but can temporarily move them and revert damage as if they were alive.\nYou can stop this effect by willing it, but to resume it requires using this power again." },
			{ id: "stop", name: "Stop",
				tags: { duration: "Instant", effect: "Transmute", range: "Self" }, burst: "multiple",
				text: "You spend up to three psyche bursts to stop local time in an area around you equal to CAT ({cat:area}). Roll 1d6 per psyche burst spent and add them together - that is how many seconds you have. Anything that enters this area is immediately affected (including anything put into or out of the area), but time flows normally outside the area. In this stopped time, you are unaffected and:\n- you cannot use psychic powers, but neither can you be affected by them. Any power currently active from you or affecting you other than this one dissipates.\n- you can perform one activity or course of action that fits in the duration. After you would make an action roll for anything, the effect ends no matter what.\nThen, gain temporal instability." },
			{ id: "schism", name: "Schism",
				tags: { duration: "1 scene", effect: "Transmute", range: "Adjacent" }, burst: "required",
				text: "You can create a bubble of altered time equal to CAT area ({cat:area}), opening a window into one day in the past or future from the moment the bubble was created. Gain or grant +1D when you or any ally next acts to take advantage of this power:\n- The state of the area inside the bubble is confined only to the bubble and includes objects or people inside. You and allies can enter or exit the bubble at will.\n- Supernatural beings, including exorcists, in the present timeline caught in the bubble when it is created are unaffected. Humans and the 'present' timeline world caught in the bubble are 'paused', cease existing for its duration, and have no memory of the incident.\n- Things removed from the bubble from the past or future timeline, including living beings, simply disappear until they move back into the bubble.\nThe bubble represents an 'alternate' timeline, so anything altered inside of it will not show up in the present or future timeline (i.e. leaving an object in a past timeline will not have it show up in the present)." },
			{ id: "quickening", name: "Quickening",
				tags: { duration: "Instant", range: "Adjacent" }, burst: "required",
				text: "You can accelerate the natural healing of your body or those of others, giving you the following benefits:\n- Immediately heal 1d3 stress on yourself or another target. If your target is injured, increase this by +1.\n- You may heal a CAT sized group ({cat:people}) of dying or injured humans in short range. Dying humans are stabilized and are no longer in danger of expiring, but fall unconscious. Otherwise, badly injured humans are healed to the point of being able to (slowly) move by themselves. Minor injuries are fully healed.\nThen, gain temporal instability." },
			{ id: "stutter", name: "Stutter",
				tags: { duration: "Instant", range: "CAT range ({cat:range})" }, burst: "required",
				text: "You can briefly reverse time in order to alter causality for any event that happened as a result of an action roll made by you or a visible ally in CAT range ({cat:range}), instantly after you see the result. Re-roll the action roll completely, taking the second result as final.\nWhen you use this power, gain temporal instability. If you use it again before you rest, gain 1d3 temporal instability instead." }
		]
	},
	{
		id: "vector",
		numeral: "IV",
		theme: { color: "#f89918", color2: "#ef6232" },
		name: "Vector",
		summary: "Imbue anything you touch with a strong burst of velocity",
		flavor: "Imbue objects or living beings with sudden and sharp bursts of velocity.\nFact: Has the highest fatality rate of untrained users, who usually die from falling.",
		passive: {
			id: "brake", name: "Brake",
			text: "Automatically remove velocity from all projectiles that would hit you, taking -1 stress from them."
		},
		powers: [
			{ id: "fling", name: "Fling",
				tags: { duration: "Instant", range: "Adjacent" }, burst: "onSuccess",
				text: "With a touch, you can imbue velocity into yourself or another object or living being and send it flying. The combined size of the object or being and the range you send them must equal your CAT+2 ({cat+2}) or less. Once sent flying, the direction of your target cannot be changed.\nYou can alternately remove all velocity by touching an object or person of CAT+2 size ({cat+2:size}), bringing it to a complete stop.\nRoll PSYCHE for this power's effects, including any harm inflicted, and only spend a psyche burst on at least one success." },
			{ id: "lift", name: "Lift",
				tags: { duration: "1 scene", effect: "Charm", range: "Self" }, burst: "required",
				text: "You reverse gravity's effect on yourself and a CAT sized group ({cat:people}) of other exorcists or humans with a low but constant Vector effect. For this scene, any affected gain the following benefits:\n- you can run, walk, or climb up vertical surfaces\n- you can slow your fall at will, and you cannot take harm from falling\n- you can glide a distance equal to CAT range ({cat:range}). You must start at height to gain this benefit\nThis power may easily affect the parameters of rolls, such as difficulty and risk." },
			{ id: "current", name: "Current",
				tags: { duration: "Until rest", effect: "Transmute", range: "CAT+2 range ({cat+2:range})" }, burst: "required",
				text: "You create a weaker, but persistent Vector force in an area that lasts until you rest. It creates a line that goes about CAT+2 range ({cat+2:range}) in length and covers about the width of a street. It pushes constantly in one direction (including up or down) like a strong wind. Allies moving in that direction gain +1D on actions to move with the current. Anything moving against that direction struggles, and anything falling falls slowly. It becomes hard for allies to move against the current, and actions taken against anyone trying to struggle against the current gain +1D. You can dismiss this effect at will." },
			{ id: "bullet", name: "Bullet",
				tags: { duration: "Instant", range: "CAT+1 range ({cat+1:range})" }, burst: "onSuccess",
				text: "You can imbue strong bursts of velocity into the air at your fingertips, creating pressurized air bullets that hit with extreme force. Roll PSYCHE for its effects, only spending a psyche burst on success.\n- Gain +1D when making shots from an elevated position.\n- Gain +1D when making shots to disarm, distract, or disable instead of harm." },
			{ id: "finesse", name: "Finesse",
				tags: { duration: "Instant", range: "CAT range ({cat:range})" }, burst: "none",
				text: "Passive: You may finely manipulate threads of force to perform fine motor skills you could perform with your hands at 1/2 CAT range ({halfcat:range}), such as opening doors, picking up objects, or even skills like typing on a keyboard, etc. Roll a relevant skill such as interfacing for this.\n- You have to be able to see your target, even if it's far away. However, you can perform this manipulation even if your path to the target is blocked, such as if you could see it through a window, etc.\n- You can pick up objects and move them around through the air but they cannot be any bigger or heavier than a laptop or a full briefcase." }
		]
	},
	{
		id: "gate",
		numeral: "V",
		theme: { color: "#fd9a0e", color2: "#1a1a1a" },
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
	},
	{
		id: "smother",
		numeral: "VI",
		theme: { color: "#e68e11", color2: "#8a5a10", dark: true },
		name: "Smother",
		summary: "Suppress innate properties of things, like friction, sound, or light.",
		flavor: "Suppress the innate properties of the universe. Lie to God.\n...long term survival prospects are poor but are outweighed by utility, therefore users of this blasphemy are good candidates for organ transplantation (see TM ref 4456).",
		passive: {
			id: "absentia", name: "Absentia",
			text: "You can improve the CAT of any of your Smother powers by +2 when you use them, to a max CAT of 7. However, when you do, gain the Absentia hook.\nAbsentia hook: If this hook fills up, you take an injury and black out for a few moments. When you wake up, you are missing a body part (roll 1d6). It simply disappears (cleanly) as though it had never existed, leaving a stump or hole. It doesn't come back, even if you heal the injury. If you have no body part left to lose (when you roll), reduce the result by 1. If the result is 0, you lose your head and suffer (gruesome) instant death instead. Missing body parts might make some rolls hard or risky, dependent on the situation. You adjust to any disability after the mission, and it has no further effect.\n- 1: Eye\n- 2: Nose\n- 3: Ear\n- 4: Finger\n- 5: Toe\n- 6: Nothing"
		},
		powers: [
			{ id: "hollow", name: "Hollow",
				tags: { duration: "Until rest", effect: "Charm", range: "Adjacent" }, burst: "required",
				text: "You temporarily remove weight from a single object, human, or exorcist, giving them the total weight of 1 lb if heavier. The size of the object must be CAT ({cat:size}) or lower, and you can end this modification any time, though you must use this power again to regain its effects. Roll PSYCHE for any creative uses of this power, only spending a burst on at least one success.\n- Gain or grant +1D when you or any ally next acts to take advantage of this power\n- This power ends on its previous target if used again.\nThis power may easily affect the parameters of rolls, such as difficulty and risk." },
			{ id: "abstract", name: "Abstract",
				tags: { duration: "1 scene", effect: "Transmute", range: "Short" }, burst: "required",
				text: "With a gesture, you remove recognizable properties of CAT+1 ({cat+1}) number of distinct tools, vehicles, windows, doors, or any other objects that can be held or worn. The chosen objects can no longer be used for their intended purpose and no human, sin, or exorcist (including you!) can recognize them - staring at them for too long causes extreme discomfort, even for exorcists. For example, weapons can no longer fire, doors can no longer open, or windows can no longer be looked through.\nGain or grant +1D when you or any ally next acts to take advantage of this power. It may also affect the parameters of rolls while active." },
			{ id: "smooth", name: "Smooth",
				tags: { duration: "1 scene", effect: "Transmute", range: "Short" }, burst: "onSuccess",
				text: "You temporarily remove almost all friction from a CAT sized group ({cat:people}) of human or exorcists, or an area up to CAT ({cat:area}). The area or target(s) become incredibly slippery. If targeting an area, it becomes hard for anyone to stand, climb, or move normally in the area, though people are able to slide around.\n- Roll PSYCHE to affect hostile targets with this power, only spending a psyche burst on success.\n- You can sculpt this area if you wish to affect just part of it, or sculpt a path.\nGain or grant +1D when you or any ally next acts to take advantage of this power. This power may also easily affect the parameters of rolls, such as difficulty and risk." },
			{ id: "dark-age", name: "Dark Age",
				tags: { duration: "Until rest", effect: "Charm", range: "Short" }, burst: "required",
				text: "You produce a strong field from your body disabling even the simplest human advancements from working in CAT area ({cat:area}). The effect moves with you. You can choose up to three of the following to suppress, ceasing their operation, then gain or grant +1D when you or any ally next acts to take advantage of this power:\n- Electricity\n- Internet\n- Combustion engines\n- Running water\n- Door handles, window latches, zippers, catches\n- Open fires\nThese things stop working even if it would not make sense, i.e. suppressing running water would mean water pressure simply stops working. You can end this effect willingly, but must end all effects at once." },
			{ id: "blind", name: "Blind",
				tags: { duration: "1 scene", effect: "Transmute", range: "Adjacent" }, burst: "required",
				text: "A number of objects or living beings equal to CAT ({cat}), or location of a size up to CAT ({cat:size}) you touch ceases producing sound, reflecting light, or both for the scene. Gain or grant +1D when you or any ally next acts to take advantage of this power:\n- Targeting a person allows the effect to move with them for the scene\n- Targeting a location affects an area, removing all sound and/or light. You can 'filter' this effect by allowing light or sound inside the location to operate normally, but not enter or exit the area.\nThis power may easily affect the parameters of rolls, such as difficulty and risk." }
		]
	},
	{
		id: "whisper",
		numeral: "VII",
		theme: { color: "#6f9fe0", color2: "#a0c3ec", dark: true },
		name: "Whisper",
		summary: "Your shadow talks to you. It knows the future.",
		flavor: "Your shadow is animate and hungry. It knows the future.\nThis alter self usually manifests in puberty and only you can see it, remaining invisible even to other exorcists. Common belief holds the 'shadow' seen is a component of your own future death.",
		passive: {
			id: "shadow", name: "Shadow",
			text: "You harbor a separate being that follows you everywhere, even when you sleep.\nThe shadow is intangible and invisible to everyone, even the psychically sensitive. It can only weakly interact with the physical world and has its own mind and senses. It can move in about short range from you. It can pass through walls and surfaces easily but retreats into your body in bright light, preventing it from doing anything.\nYou can talk to it telepathically, but talking to it is dangerous and causes 1 stress after any interaction ends. It has no obligation to tell you the truth unless you use your powers.\nYou may talk to it safely using your abilities, and it knows the future. The Admin will answer for it."
		},
		powers: [
			{ id: "omen", name: "Omen",
				tags: { duration: "Instant", range: "Self" }, burst: "required",
				text: "Ask your shadow 'What will happen if I X', where X is a simple course of activity you plan to take in the next hour or so (open this door, attend the meeting, attack this person, go down this street). The shadow gives you a brief impression of the future:\n- Gain +1D when you or an ally next acts on the answer.\n- Pre-roll the risk die before you take the action. You can decide to back out of the action if you like, but if you follow the same course of activity in the future, use the pre-rolled risk die." },
			{ id: "shiver", name: "Shiver",
				tags: { duration: "1 scene", effect: "Charm", range: "Self" }, burst: "required",
				text: "When you are looking for a human, sin, exorcist, location, or object, you can declare 'I feel a shiver.' You send a psychic pulse out to CAT range ({cat:range}) in a radius around you, which remains active for this scene. While your target is close enough to be in range, you feel a strong sense of cold and discomfort. You can home in on this feeling easily. It's never hard to track your target while this power is active. If your target is in short range of you, you also gain +1D on any rolls to track or locate them." },
			{ id: "precognition", name: "Precognition",
				tags: { duration: "Instant", range: "Self" }, burst: "required",
				text: "When the Admin is describing a scene or you are about to take a course of action, you can 'flash back.' Make an action roll or play a scene out in the past, where you had a vision of the present moment. This cannot completely alter the established facts of the present (you can't have knocked someone out in the past if you just finished having a conversation with them in the present, for example), but could change the situation or alter present details, or it could set up yourself or any ally. For example you could have made preparations for the current moment (locked or unlocked a door, stowed some gear, made a phone call, etc). If you use this power for gear, mark KP for it as normal.\nIf the situation is complicated, also take 1 nonlethal stress. If it's convoluted or far fetched, take 3 nonlethal stress." },
			{ id: "dissect", name: "Dissect",
				tags: { duration: "Instant", range: "CAT range ({cat:range})" }, burst: "required",
				text: "Examine a human or exorcist you can see in CAT range ({cat:range}), roll PSYCHE, and ask your shadow one of the following questions, plus one more per success. They answer truthfully, but can use a maximum of three words to answer each.\n- Is this person lying?\n- What is the main emotion this person is feeling?\n- Where has this person just come from?\n- Where are they planning to go next?\nGain or grant +1D when you or any ally next acts to take advantage of each answer." },
			{ id: "omnipresence", name: "Omnipresence",
				tags: { duration: "Instant", range: "CAT+2 range ({cat+2:range})" }, burst: "none",
				text: "When an ally is in a scene, and you are not present in that scene, and your ally is in CAT+2 range ({cat+2:range}), you can use this power to walk in on the scene, having already predicted that this course of events would happen. Roll PSYCHE, and choose one of the following per success:\n- nobody is following you\n- you are hidden\n- you are able to enter your ally's location without distraction or harm\n- you have a useful tool or object on you for the present situation (a key, a weapon, a wrench, etc)\nAfter using this power, lose its use until you rest." }
		]
	},
	{
		id: "edit",
		numeral: "VIII",
		theme: { color: "#2180eb", color2: "#97c2dd" },
		name: "Edit",
		summary: "Change yourself, the world, or others by pulling from different possible realities.",
		flavor: "The way things are is not the way they had to be. You can choose, filtering the threads of possibilities and inviting them to meld with the real world.\nFact: CAIN doctrine clearly states the existence of 'alternate' realities is currently unproven.",
		passive: {
			id: "mimic", name: "Mimic",
			text: "You can alter minor things about your appearance. You can change any of the following about yourself when resting, within a variation of your original body:\n- body features such as height and weight\n- aesthetics such as facial features, skin color, hair, gender presentation\n- age, down to 13 and up to 88\nYou always look faintly similar, like a distant relative of yourself. Your clothes always change to fit you, though you cannot alter them. This doesn't change anything about your skills or general ability, and also cannot restore missing body parts or hide sin marks or scars."
		},
		powers: [
			{ id: "uniform", name: "Uniform",
				tags: { duration: "Until rest", effect: "Charm", range: "Self" }, burst: "required",
				text: "You make a brief edit of yourself. You can't do this in public (you need privacy, no matter how tenuous). This power makes you officially part of any profession or group with more than 5 members, with any necessary uniform, equipment, id cards, memberships, etc, and alters reality to make it so.\nEven if people don't particularly remember you being part of a group, they may get a vague sense that you were a member.\nYou don't actually gain any particular skills and any changes you make have to be to your own person and must include things you could wear or carry in one or both hands.\nGain or grant +1D when you or any ally next acts to take advantage of this power." },
			{ id: "absurd", name: "Absurd",
				tags: { duration: "1 scene", effect: "Curse", range: "Short" }, burst: "onSuccess",
				text: "You swap up to a CAT group ({cat:people}) of humans or exorcists with a different version of themselves from an alternate timeline. You must roll PSYCHE for this power to take effect on hostile targets, only spending a psyche burst on success. This can change:\n- what the target is wearing, but not holding (so anything held in hand remains the same)\n- physical appearances of the targets, as your MIMIC power.\nTargets retain their memories, and this does not alter reality to accommodate the change, so it can easily disorient unprepared humans. The change is otherwise perfect.\nGain or grant +1D when you or any ally next acts to take advantage of this power." },
			{ id: "utility", name: "Utility",
				tags: { duration: "Until rest", range: "Short" }, burst: "required",
				text: "When you need any mundane object, tool, or vehicle that could fit in a small room, you can cause it to appear on a surface in range as though it was always there, without spending KP. However, the admin chooses one, or two if the item is dangerous or rare:\n- The item is used, dented, scuffed, or poor quality\n- The item is a real item that someone nearby owned and has now disappeared, and they will come looking for it\n- The item is 'off' somehow and appears as a cheap knockoff made of odd materials that feel spongey or organic\n- The item is missing some parts and doesn't work as well as it could with them\nThe item cannot be a unique item, etc you cannot create a particular car, key, book, etc, but is rather a generic representative of a category. It disappears after a rest." },
			{ id: "filter", name: "Filter",
				tags: { duration: "1 scene", effect: "Transmute", range: "Adjacent" }, burst: "required",
				text: "You produce a strong field affecting all matter in an area about the size of a small room, which must contain you. In this area you gain +1D to examine its contents and:\n- you can cause any matter to become transparent or opaque\n- you can change the lighting in the room as though lit by an invisible light source, or snuff out any light sources in the room\n- you can move around any objects in the area without touching them and 'pin' them to any point in space in the area, causing them to float\n- you can safely dissect any loose inanimate object or furniture into its constituent parts or reassemble any broken object, providing any parts are present\nThis effect expires when the scene ends, or if you leave the area for any reason." },
			{ id: "copy", name: "Copy",
				tags: { duration: "1 scene", effect: "Summon", range: "Adjacent" }, burst: "required",
				text: "You create a temporary, exact copy of a human or exorcist.\n- This creates a doppelganger: a simple, obedient clone, without much intelligence or ability to speak.\n- You may give it simple instructions of one or two sentences, which it follows to the best of its ability.\n- It dissolves into a pale sludge when the scene ends, when touched by anyone except you, or if it takes any harm.\nThis ability creates a copy of the target in its present state, including anything mundane a person is carrying or wearing. A doppelganger cannot gain, use, or benefit from psychic powers and rolls just 1d6 to do anything." }
		]
	},
	{
		id: "bind",
		numeral: "IX",
		theme: { color: "#1b4fbf", color2: "#3880d2" },
		name: "Bind",
		summary: "Bind weak sins to your service and use them as servants or weapons.",
		flavor: "With the will of a wielder, even Sins can be controlled, bound to specially prepared talismans in spirit form. Code 864: Binding is an old but heretical art punishable by instant execution. Fortunately, CAIN provides an indefinite stay for binders that remain under its employ.",
		passive: {
			id: "sin-binding", name: "Sin Binding",
			text: "You have the forbidden ability to bind Sins. You have the obedient essence of a minor sin bound to you, under your control.\nYour Bound Sin is animalistic in form and ability - you can determine what form it takes. It can understand language but cannot speak, and is invisible to humans.\nIt can follow you around at short distance, follow simple orders, and uses your skills to do anything. Its general capabilities are CAT 0.\nIf it takes any stress, it is banished for the remainder of the scene, however you can psychically absorb all stress taken for it instead to prevent this effect.\nIn a conflict scene, you may sacrifice your ability to act on your turn to allow your sin to act instead, giving it commands. Otherwise it doesn't act independently in these scenes."
		},
		powers: [
			{ id: "horde-spirit", name: "Horde Spirit",
				tags: { duration: "1 scene", range: "Self" }, burst: "required",
				text: "You empower your sin for one scene. The next time it takes action for traversal or movement, it gains +1D. As part of this action:\n- You can transform it into the form of a vehicle or rideable creature of up to CAT size ({cat:size}) for the rest of the scene. It can go about CAT speed ({cat:speed}), becomes partly visible to humans and has room for a 1/2 CAT size group ({halfcat:people}) of human or exorcist passengers.\n- It can glide a short distance while in vehicle form, with or without passengers" },
			{ id: "forbidden-spirit", name: "Forbidden Spirit",
				tags: { duration: "Instant", range: "Self" }, burst: "required",
				text: "You can empower your sin for one action. As part of this action:\n- You lift limiters on your spirit. The action gains +1D and causes it to undergo a monstrous transformation similar to its original form. It becomes a size equal to CAT+1 ({cat+1:size}) and can easily move, lift, strike, or throw objects or beings of an equal size. Roll PSYCHE for its effects. After the action, it reverts to its normal size.\n- When absorbing stress for your sin as a consequence of this action, take 1 less." },
			{ id: "surrender", name: "Surrender",
				tags: { duration: "Until rest", effect: "Charm", range: "Self" }, burst: "required",
				text: "You draw on your sin's energy to partially fuse with its essence. Your body mutates slightly to accommodate this change. Immediately manifest a temporary sin mark and roll for the location and ability, which you gain until you end this ability early or rest. You may gain 1 sin to re-roll the mark ability, any number of times, any time while this power is active.\nIf you hit sin overflow while this effect is active and successfully resist, you manifest the chosen sin mark permanently instead of rolling for it." },
			{ id: "hunter-spirit", name: "Hunter Spirit",
				tags: { duration: "1 scene", range: "Self" }, burst: "required",
				text: "You empower your sin for one scene. The next time it takes action for tracking or observation, it gains +1D. As part of this action:\n- It can now separate from you up to extreme range when released\n- You can communicate telepathically with it\n- It gains the ability to fly and see and smell extremely well - it can also see in the dark and in the thermal spectrum, and clearly up to long range.\n- You can concentrate, dissociating from your body, and becoming extremely vulnerable. While concentrating this way, however, you can use your sin's senses instead of your own. You can engage and disengage this effect at will for the scene." },
			{ id: "penumbra", name: "Penumbra",
				tags: { duration: "Until rest", effect: "Summon", range: "Adjacent" }, burst: "required",
				talisman: "{4+cat}",
				text: "You create an area drawn as a large circle, encircling up to a CAT+1 size area ({cat+1:area}), and choosing a type from the below list. The prison takes only a moment to create, but takes a few minutes to activate and for its effects to take place. It lasts until you rest or until used again.\n- A white mantle prevents entrance by Sins, but allows humans and exorcists to pass normally.\n- A black mantle prevents entrance by humans or exorcists. In addition, humans will (generally) be unable to see into the area and will act as if the area doesn't exist.\n- You can invert this effect if you so choose, preventing exit instead of entrance.\nThe prison can be broken by a determined supernatural attacker, but has a 4+CAT ({4+cat}) talisman for durability, taking stress like an execution talisman." }
		]
	},
	{
		id: "jaunt",
		numeral: "X",
		theme: { color: "#6201a4", color2: "#bc12fb", dark: true },
		name: "Jaunt",
		summary: "Separate body and soul, perception and flesh.",
		flavor: "Slice the body and soul with a carving knife. ALERT: Jaunt users are the most likely of all exorcists to 'hollow' during sleep and leave an empty shell. This occurrence is very rare but its cause is unknown and it is 100% fatal.",
		passive: {
			id: "ghostwire", name: "Ghostwire",
			text: "You can join your mind telepathically with a number of other willing people you touch equal to CAT ({cat}). While within long distance of each other, you can talk telepathically, and sense each other's ambient emotional state. This effect lasts until you use it again, until someone becomes unconscious, or until you or another person closes the connection."
		},
		powers: [
			{ id: "possession", name: "Possession",
				tags: { duration: "1 scene", effect: "Curse", range: "Short" }, burst: "required",
				text: "You can shunt your perception out of your body to possess a human, animal, or corpse (in good condition) you can see in range for a scene. Supernatural beings are immune to this effect. Unwilling humans might require rolling PSYCHE to possess successfully.\n- While possessing another your real body is insensate and defenseless\n- For humans and animals, you cannot force a target to harm itself or take action that would indirectly cause it to come to harm\n- Actions that the target takes use your skills, but the target's body or equipment, which might change the circumstances\nYou are kicked out of the body if it takes harm. Gain or grant +1D on the next roll by yourself or an ally taking advantage of this power." },
			{ id: "geist", name: "Geist",
				tags: { duration: "1 scene", range: "Self" }, burst: "required",
				text: "You can shunt your perception out of your body and roam for CAT+2 range ({cat+2:range}), becoming a being made of purely psychic energy.\n- While practicing this power, your real body is insensate and defenseless\n- You can fly at CAT speed ({cat:speed}), are invisible to those not psychically sensitive, and may pass through walls, floors, and objects easily while in this form.\n- You cannot interact with or be affected by the physical world. You cannot use or benefit from your own psychic powers, but psychic powers or effects from others can still affect you.\nIf your form is destroyed somehow (by a supernatural force), you take 1 stress, this power ends, and you can't use this power again until the scene passes.\nThis power may easily affect the parameters of rolls, such as difficulty and risk." },
			{ id: "threads", name: "Threads",
				tags: { duration: "Until rest", effect: "Charm", range: "Self" }, burst: "required",
				text: "You can sense the unseen world of traces of grace. Upon using this power, you close your eyes and can see through your eyelids the patterns the soul leaves in the environment.\n- You gain the ability to see living beings, even through walls, for CAT range ({cat:range})\n- You can see the traces a sin or someone strong in grace such as an exorcist leaves, like a faint trail of light through the air.\n- You gain +1D on actions to track or locate living beings or traces of sins in the area. However, you cannot see any non-living matter (you are effectively blind) while maintaining this power, and find actions that rely on sight hard\nThis power ends when you open your eyes or when you rest." },
			{ id: "passenger", name: "Passenger",
				tags: { duration: "1 scene", effect: "Curse", range: "Extreme" }, burst: "required",
				text: "You choose a group of willing humans or exorcists with a group size equal or less than 1/2 CAT ({halfcat:people}) in extreme range, who must be able to either hear you (even telepathically) or see you. You pull their psychic presence into your body for the duration. Their bodies become limp, vulnerable and insensate. However:\n- they now share control of your body with you, including all senses.\n- You can surrender control of your body to them to allow them to make action rolls using their skills or abilities, but your body (gear, access, etc).\n- You can set them up as normal or aid them on these skills.\nThey cannot use psychic powers while possessing you this way, and you suffer any harm or consequences from their actions." },
			{ id: "desecrate", name: "Desecrate",
				tags: { duration: "Instant", range: "Adjacent" }, burst: "none",
				text: "You can force a semblance of life into the corpses of up to a CAT sized group ({cat:people}) of humans or exorcists by touching them on the eyes. You may ask the corpse(s) three questions total (no matter how many you animate), after which the effect ends and they become dead again. It also expires if pressure increases.\n- You can't use this power on the same corpse(s) more than once\n- The power does not return life to the body, but accesses the body's memories. If the head or brain is missing, or the body lacks a tongue, etc, this power will not work as well.\n- A corpse is obligated to answer truthfully, but can only speak to the realm of its knowledge and memories before it died. It may have only partial knowledge of a situation or may speak according to its own viewpoint.\nThen lose the use of this power until you rest." }
		]
	},
	{
		id: "palace",
		numeral: "XI",
		theme: { color: "#9d3cd7", color2: "#dca9ef" },
		name: "Palace",
		summary: "The contents of your mind are a tangible place you can visit.",
		flavor: "The contents of your mind are as solid to you as plain reality. Corporeal palace manifestation by exorcists is still under investigation by TEMERITY.",
		passive: {
			id: "sanctum", name: "Sanctum",
			text: "You and allies you rest with can enter your psychic palace while resting. This improves the resting rolls of yourself and one ally of your choice resting with you by +1.\n- The palace is a mental projection, a dream space that takes the form of a large home, residence, or mansion in a locale of your choosing. Walking off the premises merely returns you to the locale. As a purely psychic phenomena, you can control its appearance and decor.\n- Taking harm in a palace instantly shunts a person out of it, waking them up, instead of dealing them real harm. Visitors can leave any time.\n- Entering the palace mentally requires only closing your eyes and concentrating, leaving your outside body defenseless and insensate. It can be done by you any time, and by your allies by resting with you, or with your powers"
		},
		powers: [
			{ id: "cellar", name: "Cellar",
				tags: { duration: "Instant", effect: "Charm", range: "Infinite" }, burst: "required",
				text: "You can simulate situations inside your palace before putting them into practice in reality. You can use this power and roll to set up a number of allies equal to 1/2 CAT ({halfcat}) even if you are not physically present. However, you may only set up a target if you can describe the way in which you trained or prepared with them, or a psychic copy of them, for the current situation. This setup can never be risky, but cannot lower risk. If you fail the setup roll, you may take 1d3 nonlethal stress to re-roll it, taking the second result as final." },
			{ id: "library", name: "Library",
				tags: { duration: "Instant", range: "Self" }, burst: "none",
				text: "Your palace has a library of information from the psychic gestalt. When you wish to gather information on or investigate any subject, you can gain +1D on the roll by accessing this library. However, afterwards the Admin rolls 1d6 for each of the following:\n- Is the information rare?\n- Is the information forbidden in some way?\n- Is the information pertinent to a powerful group?\nFor each '1', you take 2 nonlethal stress as you read something disturbing in the library." },
			{ id: "foyer", name: "Foyer",
				tags: { duration: "1 scene", effect: "Summon" }, burst: "required",
				text: "Passive: Your palace has a tulpa, a psychic being that takes the form of a servant or butler. They are loyal to you, and you can determine their personality and appearance when you take this power.\nActive: You summon your tulpa, choosing one:\n- Have your tulpa aid you on a task related to research, crafting, or investigation, granting +1D on your next roll and making an extra slash on a talisman for each '6' you roll.\n- Briefly manifest your tulpa outside your palace in short range as a real person for the scene, a mirror of their appearance inside your palace but dressed any way you like. They have roughly the capabilities of an average person (cat 0) and roll 2d for activities that a typical servant or butler could do and 0d for everything else. Any harm taken by them banishes them back to the palace." },
			{ id: "bar", name: "Bar",
				tags: { duration: "Instant", range: "Self" }, burst: "none",
				text: "Once a scene, you can open any closed door and open it to your (actual, physical) bar instead of the room you would expect. It is a well stocked, typical small bar, including snacks, a couple hot plates, and alcoholic and non-alcoholic drinks. It restocks between missions. The bar only exists while you are inside or hold the door, and outside items or people inside are pushed out before it disappears.\nWhen you rest in your bar, you can roll 1d3+1 and do one of the following, spending charges of the die you have just rolled per option:\n- 1 charge: Erase 1 stress on one person\n- 2 charges: Remove a slash from all hooks for a person\n- 3 charges: Remove an injury\nFor each, describe a drink, snack, meal, or other form of relaxation or healing you are preparing for your guest." },
			{ id: "parlor", name: "Parlor",
				tags: { duration: "1 scene", range: "Investigation area" }, burst: "onSuccess",
				text: "Choose one person or up to a CAT sized group of people ({cat:people}) in the investigation area and speak their (real) name(s) aloud. You can bring yourself and their psychic shadow inside your palace, no matter where they are.\nIf your target(s) are willing, you can choose to bring their actual psychic consciousness inside your palace, making them aware and remember what is going on while inside, as though in a dream. Their real body becomes unconscious and vulnerable. They can leave willingly.\nYou can instead bring a psychic double of a willing or unwilling person into your palace. For an unwilling person, roll PSYCHE and only spend a burst on success. The double is a psychic copy of their mind at the time of summoning. Any memories formed by the double will not transfer over. The double cannot leave until the scene ends, or until they take harm as usual.\nA person or double summoned this way is not obligated in any way to behave differently than their original.\nGain or grant +1D on the next roll by yourself or an ally taking advantage of this power." }
		]
	},
	{
		id: "sympathy",
		numeral: "XII",
		theme: { color: "#9836d8", color2: "#b314e7" },
		name: "Sympathy",
		summary: "Pull on the innate connections to human tools or objects.",
		flavor: "Humans leave impressions on everything they touch. You can do more than touch. ALERT: Psychometry is banned on campus - CASTLE ref 0094.",
		passive: {
			id: "resonance", name: "Resonance",
			text: "At the start of the mission, roll on the resonance table. Roll 1d3, then 1d6, then check the resonance table below. When you are making an action roll and you are using an item you are resonant with, you gain a +1D bonus. You can spend a psyche burst any time to roll an additional resonance. You can keep up to three at a time, and only benefit from one at a time.\nResonances (1d3, then 1d6):\n- 11 Phones, 12 Lights, 13 Knives, 14 Keys, 15 Books, 16 Baseball Bats\n- 21 Balls, 22 Guns, 23 Mugs, 24 Computers, 25 Shoes, 26 Power Tools\n- 31 Ropes, 32 Hammers, 33 Cars, 34 Doors, 35 Bags, 36 Gloves"
		},
		powers: [
			{ id: "amplify", name: "Amplify",
				tags: { duration: "1 scene", effect: "Summon", range: "Adjacent" }, burst: "required",
				text: "You can expand the mundane properties of a regular non-weapon item to extreme levels. You touch a mundane object up to CAT size ({cat:size}). For the scene, you automatically have resonance with it, and its properties are enhanced to extreme levels, as if they were up to your CAT in scale. For example:\n- A car's speed, handling, and resilience\n- A light's brightness and intensity, and the area it illuminates\n- A door's ability to lock and withstand force\nThis can easily affect the difficulty and risk of rolls. The object is still mundane." },
			{ id: "bond", name: "Bond",
				tags: { duration: "1 scene", effect: "Charm" }, burst: "required",
				text: "For the scene, you can bond incredibly tightly with an item you are holding in one or both hands.\n- You are now resonant with that item. It is still mundane\n- You can now use it as a mundane cutting or bludgeoning weapon even if it wouldn't normally be a weapon. It has about the power of a CAT 0 bat or sword\n- The item becomes virtually indestructible, and you can cause the item to recall to your hand, flying through the air, from within short distance\n- You can discharge this power to make a strike with the object, granting it supernatural destructive power equal to CAT ({cat:magnitude}). Roll PSYCHE for its effects (it gains +1D on the roll as normal due to resonance). Then end this effect and destroy the item" },
			{ id: "diplomacy", name: "Diplomacy",
				tags: { duration: "Instant", range: "Short" }, burst: "required",
				text: "You make a simple request of an object as if it was a person, or ask it a simple yes or no question.\nFor example, you can ask a door to open or hold shut (even if it couldn't normally lock, or you don't have the key), a computer to turn off or find information for you, or a car to turn on without a key or drive by itself.\nIf you need to make a roll for this, roll PSYCHE or use a social action, such as negotiation or authority.\nYou can affect objects up to CAT size ({cat:size}) with this. Objects asked questions can answer only with yes or no answers and can't actually vocalize." },
			{ id: "psychometry", name: "Psychometry",
				tags: { duration: "Instant", range: "Adjacent" }, burst: "none",
				text: "You can touch objects to remotely view their memories. You can view back a number of days equal to your CAT ({cat}). Roll PSYCHE, then ask a question plus an additional question per success.\n- Where has this object been?\n- Who has touched this object?\n- What has this object been used for?\n- What else is this object connected to?\nMemories of an object are impressionistic and imprecise, and they are only usually 'aware' of their very immediate surroundings.\nAfter using this power, lose its use until you rest." },
			{ id: "alliance", name: "Alliance",
				tags: { duration: "1 scene", effect: "Summon", range: "Short" }, burst: "required",
				text: "An object up to CAT size ({cat:size}) in short range can now take action to set up an ally, rolling 1d6, or PSYCHE if you are resonant with that object. The object can take or cause consequences as normal from these actions.\nAllies have to be able to interact with it or use the object to gain its benefits. The object doesn't gain the ability to actually move or animate in any way, but fortune simply bends around it." }
		]
	}
];
