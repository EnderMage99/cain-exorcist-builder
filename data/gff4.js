// Games for Freaks issue 4 (Tom Bloom / CHASM, June 2026): blasphemy quirks
// (pages 24-39). A quirk is optional, permanent, and replaces its blasphemy's
// default passive; one quirk per blasphemy. Official, so no fan border.
window.CAIN = window.CAIN || {};

CAIN.quirkRules = "Blasphemies are volatile, ever changing things, twisting and reacting to their host's emotional turmoil. Even the category of 'Blasphemy' assigned to these powers is a human instrument, a label placed by CAIN to categorize the unknowable, to tame and hone chaos into a more precise, but perhaps lesser weapon. Untrained or self-trained psychics, such as Binders, often manifest capabilities more wild and spectacular than anything a Temerity training regimen could produce. Perhaps for the better.\nQuirks are optional changes to Blasphemy powers, usually offering an alternate passive ability.\nTaking a quirk is optional but a character needs to either start with one, or develop it between missions. A quirk is exclusive, permanent and replaces the default passive of a blasphemy. A character can take multiple quirks if they have multiple blasphemies (one for each). Aside from granting alternate abilities to your exorcist, they may also change your power's functioning in the fiction, or reflect your exorcist's relationship with their powers.";

CAIN.quirks = [
	{
		id: "steel-soul",
		name: "Steel Soul",
		blasphemy: "tension",
		replaces: "iron-soul",
		source: "gff4",
		text: "You specialize in projecting tension fields over bladed weapons. You gain the Severance power for free (even past the cap of 5 powers). You always use it at +1 CAT. However, you can only use it while wielding a bladed weapon in one or both hands.\nAdditionally, you can project a psychic cutting force at short range by rolling PSYCHE. This doesn't cost a psyche burst but doesn't have enough force to significantly harm someone - enough to sever a strap, cord, or cause minor cuts."
	},
	{
		id: "silver-soul",
		name: "Silver Soul",
		blasphemy: "tension",
		replaces: "iron-soul",
		source: "gff4",
		text: "Your body is infused with psychic fields that are stronger when you follow your convictions, and weaker when you don't.\nWhen you end a conflict scene, you automatically erase 1 stress if you followed any agenda item in that scene. If you didn't follow any, gain 2 nonlethal stress instead."
	},
	{
		id: "lead-soul",
		name: "Lead Soul",
		blasphemy: "tension",
		replaces: "iron-soul",
		source: "gff4",
		text: "Your body is suffused with tension fields that make you extremely dense, heavy, and tough. Your weight is tripled and only forces 2 categories higher than your current category can move you against your will. Your unarmed strikes count as service weapons (and can be upgraded). In addition, you can only take a maximum of 1 stress from falling or impacts from vehicles or objects, no matter the category.\nIn return, actions that require you to move quickly are hard for you by default."
	},
	{
		id: "clock-stopper",
		name: "Clock Stopper",
		blasphemy: "flux",
		replaces: "steal-time",
		source: "gff4",
		text: "You can use the Stop power without spending any psyche bursts, lasting a full minute, and it does not cause temporal instability. Using the power this way 'steals time' from your future lifespan and supernaturally ages you.\nDraw an actual clock on your sheet, starting at 12:00 noon, then advance time by 1d3 hours. Also advance the clock by 1 hour if you suffer sin overflow, or you may advance it any time you would gain temporal instability (1 hour for 1 temporal instability). This clock cannot be affected in any other way.\nEach hour from 12-5pm ages you 1d3 years. Each hour from 6-9 ages you around 1d6+2 years, and each hour from 10-12 ages you around 2d6+8. This has no effect on your abilities. At midnight, you die of old age (this cannot be ignored)."
	},
	{
		id: "time-splitter",
		name: "Time Splitter",
		blasphemy: "flux",
		replaces: "steal-time",
		source: "gff4",
		text: "Once a hunt, without spending a psyche burst, you may cause a temporal fracture when undertaking any course of action. This fracture ends when an action roll is made, when you would die or suffer sin overflow, or after exactly 777 seconds have expired in the fiction.\nThis activity takes place in an alternate timeline, in which everything is otherwise exactly the same. When the fracture expires, you revert to the main timeline, undoing all outcomes, resources spent, harm taken, or consequences, but keeping any knowledge or memory from the alternate timeline. You or an ally may take +1D on the next roll that takes advantage of this information. Then play forward as normal."
	},
	{
		id: "void-furnace",
		name: "Void Furnace",
		blasphemy: "ardence",
		replaces: "inner-furnace",
		source: "gff4",
		text: "Your powers focus on the cold at the end of the universe, the fathomless emptiness of entropy. This changes the following:\n- Pallor: You are always cold to the touch and can't be warmed up. You can't suffer negative effects or harm due to cold weather or temperature (even extreme cold), but you still feel it. You subtract 1 from all your resting rolls if the area where you are resting isn't warm.\n- Void Affinity: No power you take can ever produce heat.\n- Rise from Abyss: Your powers from this blasphemy increase in potency increase the closer you are to death. They gain +1 CAT in all capabilities if you have an injury, a further +1 CAT if you have two or more, and a further +1 CAT if another exorcist has died this mission.\n- Collapse: If you die, your body snap freezes and begins collapsing into a non-space. Touching it without protection can inflict incredible harm from the cold (around 3-4 stress). It will require special removal by CAIN, therefore it cannot be recovered by your compatriots.",
		powerSwaps: [
			{ replace: "sabre", power: { id: "nihil", name: "Nihil",
				tags: { duration: "Instant", range: "Melee" }, burst: "onSuccess",
				text: "By placing your palms outwards, you release a terrifying annihilative force at hand's reach, affecting a base 1/2 CAT area immediately adjacent to you. Roll PSYCHE for its effects, and only spend a psyche burst on success. This force is tremendous but slow, giving it the following:\n- It gains +2D when rolling to blast through immobile targets (living or nonliving), walls, constructions, or inanimate objects.\n- Unless you are set up by another exorcist, using this power when a roll is risky is always hard." } },
			{ replace: "fury", power: { id: "black-matter", name: "Black Matter",
				tags: { duration: "Instant", range: "Long" }, burst: "onSuccess",
				text: "You instantly disperse heat in an area, creating a killing flash freeze at a location in range with a blast area up to 1/2 CAT. This inflicts harm on anything living in the area and instantly freezes liquids and environments, causing damage. Roll PSYCHE for its effects, and only spend a psyche burst on success.\nWhen you use this power, you may inflict 1 nonlethal but irreducible stress on yourself to gain +1D on the roll as your body partly freezes over. If you do, increase the nonlethal stress suffered the next time you use this power by +1. This effect stacks but resets when you rest." } }
		]
	},
	{
		id: "taboo",
		name: "Taboo",
		blasphemy: "tongue",
		replaces: "the-word",
		source: "gff4",
		text: "Certain words are banned for you. When you, the character or the player, speak those words (even inadvertently) in any voice louder than a whisper, resolve any powers triggered by your speech, then it inflicts a supernatural destructive shockwave on everything other than you in a CAT+1 area centered on you (roll PSYCHE for effects, including harm, etc), and temporarily deafens everyone in that area. Your voice is blown out and your character is unable to speak or use powers from any blasphemy until you rest.",
		extras: [
			{ title: "Banned words", text: "Sin, Cain, the name of any blasphemies or blasphemy powers, including your own, the name of a sin type (ogre, lord, etc)." }
		]
	},
	{
		id: "axis",
		name: "Axis",
		blasphemy: "vector",
		replaces: "brake",
		source: "gff4",
		text: "Your powers rely on rotational velocity.\nInscribe Axis: The Fling and Current powers from this blasphemy moving things either clockwise or counter clockwise around you or a point you choose in hand's reach, instead of in a straight line. The range of these abilities instead becomes the radius of this circular path.\nHoly Chakra: You may roll 1d6 when an object or projectile equal or lower than your CAT would impact you. If you roll a 4+, it instead orbits harmlessly around you and away from you, missing you and inflicting a max of 1 stress. If successful, lose the use of this passive until you rest."
	},
	{
		id: "rail",
		name: "Rail",
		blasphemy: "vector",
		replaces: "brake",
		source: "gff4",
		text: "When moving, you automatically increase your own velocity. All your own movement (not movement granted to others), is +1 CAT higher, including movement without your powers. You can 'skate' on a small bubble of vectorized air underneath your feet, allowing you to move across water or slippery surfaces.\nHowever, none of your powers work if you are unable to move while using them"
	},
	{
		id: "stroll",
		name: "Stroll",
		blasphemy: "gate",
		replaces: "pocket",
		source: "gff4",
		text: "Once a scene, without spending a psyche burst, you can attempt to teleport yourself to a point in short distance you can see (even just partly) with enough space for you to arrive by rolling 1d6. On a 3+, you are successful. On a 1-2, you teleport anyway to a point in range, but the Admin tells you where you end up."
	},
	{
		id: "rummage",
		name: "Rummage",
		blasphemy: "gate",
		replaces: "pocket",
		source: "gff4",
		text: "Once a scene, you can spend 1 kp to pull a random item out of a space that an item could be stored (clothing, suit pocket, in a desk drawer, etc). This only works if you are not looking while you're pulling the item out. The item that comes out may not necessarily logically fit the space, but comes out anyway. Roll 1d6, then the Admin picks something from the rolled list.",
		extras: [
			{ title: "Rummage list (1d6)", text: "1. Fountain pen, Live Grenade, Leather gloves, Lighter (small, plain), Pack of cigarettes (2 missing), Phone charger\n2. Roll of coins, Crowbar, Stapler, Claw hammer, Camcorder (1 hr tape), Chapstick\n3. Handgun (unloaded), two cigarettes, Faded photograph, Instruction manual for building furniture (in Swedish), Map of the area (folded, well used, in Swedish), Large pack of caramel candies.\n4. Cell phone (10% battery), Thick sheathe of printer paper, Large amount of cash, Full bottle of wine, Fire Axe, Huge box of nails\n5. Chewing Gum, Lipstick, Coffee Mug (novelty), Folded Letter, Hat (situation appropriate), Clip of 9mm ammo for a handgun\n6. Useful key, Pocket Knife, Lighter (oversized, novelty), Bicycle (foldable), Dictionary for translating Swedish, six sided die" }
		]
	},
	{
		id: "digit",
		name: "Digit",
		blasphemy: "smother",
		replaces: "absentia",
		source: "gff4",
		text: "You can instantly (and cleanly) lose a finger to gain +1D and +1 CAT to any power when you use it. It disappears as if it had been cut off a long time ago. Roll 1d6 (2-3: left hand, 4-5 right hand).\nIf you run out of fingers on one hand, you automatically lose fingers on the other. If you roll a 1, you lose another finger and roll again (this can keep going!). If you roll a 6, you can choose which hand you lose a finger on.\nGain -1D on any rolls that would require using the affected hand until the next hunt, when you have time to adjust to the disability. If you have no fingers left, you lose your head instead and suffer (gruesome) instant death, which cannot be ignored."
	},
	{
		id: "ban",
		name: "Ban",
		blasphemy: "smother",
		replaces: "absentia",
		source: "gff4",
		text: "Gain the Abstract power from this Blasphemy for free (even the limit of 5 powers). You can now use it once a hunt to affect a single human or exorcist, leaving them an unrecognizable blur and preventing them from taking action. They recover if taking harm or if the scene passes.\nRoll PSYCHE for effects and only spend a psyche burst on success. Take or grant +1D on the next action taking advantage of this as normal."
	},
	{
		id: "catch-vibe",
		name: "Catch Vibe",
		blasphemy: "track",
		replaces: "playlist",
		addsToPassive: true,
		source: "gff4",
		text: "Your starting playlist is smaller (4 tracks). However, you can add or swap in and out any (real life) music track played during the session by you, your GM, or any of the players into your active playlist for the remainder of the hunt, or any music track played diagetically (in the game). This could push it up to 10 tracks."
	},
	{
		id: "the-future-rules",
		name: "The Future Rules!",
		blasphemy: "whisper",
		replaces: "shadow",
		addsToPassive: true,
		source: "gff4",
		text: "You cannot die, except from causes which aren't ignorable. If you would die, you miraculously survive in an improbable way, pass out, and come to consciousness at the start of the next scene with 1 remaining injury and half your stress full.\nHowever, roll 1d6 at the end of each mission you complete. On a 1, foreboding doom sets in, and you become certain that the next mission is the one you die on. Increase the range of this number by +1 for each mission it doesn't trigger (so the next time would be on a roll of 1-2).\nWhile you are affected by foreboding doom, you lose your ability to ignore death and suffer instant death instead any time you suffer an injury. You can defy this fate as normal."
	},
	{
		id: "scenery",
		name: "Scenery",
		blasphemy: "edit",
		replaces: "mimic",
		source: "gff4",
		text: "Once a scene, when using any power from this blasphemy, if you can pull from a work of art nearby, it does not cost a psyche burst. The same work of art does not work twice in the same hunt, and the quality of the end result is dependent on the quality of the artwork."
	},
	{
		id: "alter",
		name: "Alter",
		blasphemy: "edit",
		replaces: "mimic",
		source: "gff4",
		text: "When you rest or go to sleep, you disappear and are replaced by a different version of yourself with similar memories. These versions of yourself rotate in from another reality where this power activated. Your appearance changes as if you used the Mimic passive. Choose one:\n- You are holding something small but useful (a tool, a weapon, a key, a map)\n- You have faint memories of a piece of information pertinent to the current investigation. Ask the GM a yes or no question about the current hunt and get a truthful answer.\n- You are slightly less stressed (-1 stress) than your current version."
	},
	{
		id: "wretched-host",
		name: "Wretched Host",
		blasphemy: "bind",
		replaces: "sin-binding",
		source: "gff4",
		text: "You don't have a bound sin. Instead, you are a former type II sin host, where the sin is fused to your flesh and is part of you.\nYou gain the Surrender blasphemy power for free, it loses the charm tag, and its effects can stack up to three times on you. Instead of costing Psyche burst, it always costs 1 sin to activate.\nAll powers that would apply to your sin instead apply to you, and physically transform you."
	},
	{
		id: "worm",
		name: "Worm",
		blasphemy: "wire",
		replaces: "main-artery",
		source: "gff4",
		text: "You can produce light reading material (novels, magazines, etc) at will, without costing KP, though it dissolves after a few minutes of losing contact with your body.\nIn addition, all wire powers apply to books instead of computers or phones and can be used with books. When you'd produce a computer terminal with Terminal or Deck, you instead produce an appropriate book (almanac, history book, encyclopedia, comic book, etc), including from people's bodies. Surge works with books (you must have read or at least be familiar with the destination book), and Disk turns your target into a book. Call creates a duplicate journal on both you and your target if the target picks up. Writing in the journal causes the writing to supernaturally and instantly appear on the duplicate, regardless of distance."
	},
	{
		id: "recluse",
		name: "Recluse",
		blasphemy: "palace",
		replaces: "sanctum",
		source: "gff4",
		text: "Only you can enter your palace (with the exception of the bar power, and psychic doubles, such as from parlor). It grants no resting benefits, but otherwise functions as the normal Sanctum power. In addition, you can enter it any time you like by concentrating for a few moments.\nWhen you enter your palace, you physically disappear and are replaced by a palace port, which is a small reflective object. Historically, these have been things like gemstones, mirrors, or basins of water, but in modern times have sometimes become things like phone screens, laptops, or portable video game consoles. Outside observers, including mundane humans can see and talk to you inside your palace, though your voice and apperance may seem distant or distorted. While inside your palace, you can use powers from this blasphemy normally to affect the outside world.\nYou remain in the palace until you voluntarily leave. If the object is damaged, you are shunted out, take stress as if you were targeted by that damage, and you cannot re-enter until you rest. The port can be supernaturally repaired during a rest at no cost."
	},
	{
		id: "manifold",
		name: "Manifold",
		blasphemy: "palace",
		replaces: "sanctum",
		source: "gff4",
		text: "Your palace functions as the normal Sanctum power, except:\nOnce a hunt, when you open any door or cross any threshold, you can instead open a door to a single room of your choice in your palace, physically manifesting it. Doing so does not require spending a PSYCHE burst. Opening any door out of this room opens and connects to a random door nearby, determined by the GM. The space inside your palace could be larger than is physically possible from the outside.\nWhen you use any palace power, including its passive, you must physically manifest the corresponding part of your palace as part of that power, as prior, though you can do this any number of times. If you don't have a door on hand to do this with, you can't activate the power, though any door will qualify (car doors, microwave or fridge doors, etc).\nOther beings can enter your manifested palace rooms, even those hostile to you. The rooms stops existing when you are no longer physically inside or are outside and let go of the door handle, and push out anyone or anything from the outside reality when they collapse back into their original form."
	},
	{
		id: "corpus",
		name: "Corpus",
		blasphemy: "jaunt",
		replaces: "ghostwire",
		source: "gff4",
		text: "You specialize in the bodies of the recently deceased. Once a scene, when you touch a corpse, you can tell exactly how long ago it died, and get brief visions of its death, granting you +1D when next you act on the answers in the same scene.\nAdditionally, you can use the possession power on corpses without spending a psyche burst, and you can use the desecrate power on living, but unconscious humans."
	},
	{
		id: "hollow",
		name: "Hollow",
		blasphemy: "jaunt",
		replaces: "ghostwire",
		source: "gff4",
		text: "You specialize in the incorporeal remnants of psyche.\nYou can use the Geist blasphemy power without spending a psyche burst, once between rests.\nIf you have only one passenger from the Passenger power, they can now use psychic powers using your body, and you can use powers normally. When they use a power, you take any effects or consequences as if you used the power, though they spend any resources (sin, bursts, etc). These powers immediately end if your passenger exits."
	},
	{
		id: "silver-sight",
		name: "Silver Sight",
		blasphemy: "jaunt",
		replaces: "ghostwire",
		source: "gff4",
		text: "You are completely blind, but permanently benefit from the Threads power from this blasphemy and gain it for free. It can overlap with other powers. Since you are used to seeing this way, actions against living things are not hard for you, but other actions that require sight are. If you participate in teamwork or gain setup, you can ignore this restriction in addition to the normal benefits of teamwork or setup.\nIn addition, your extreme sensitivity to grace lets you immediately sense (with some imprecision) if anyone in a 1/2 CAT area centered on you has any psychic sensitivity, and how much, or if there are any supernatural beings in a similar area, how close they are, and how strong they are."
	},
	{
		id: "locus",
		name: "Locus",
		blasphemy: "sympathy",
		replaces: "resonance",
		source: "gff4",
		text: "You specialize in a particular object, but have aversion to others. Choose an object on the list of resonances. You are automatically resonant with that object, but find activities that involve any of the other objects on that list hard by default. Actions are also hard when you are touching, wearing, or in hand's reach of those objects. You can swap this focus around at the start of each hunt, or when you rest."
	},
	{
		id: "mothers-love",
		name: "Mother's Love",
		blasphemy: "mother",
		replaces: "mothers-embrace",
		source: "gff4",
		text: "Your strain of mother is less detectable, and you look more human.\nTwice a hunt, you may listen to the whispers of Mother (ask the GM what She is saying) when using a blasphemy from this power.\nIf you follow her advice or direction, you may use that power without spending a psyche burst, it gains +1D on any PSYCHE rolls, +1 CAT, and all sin costs from that power are reduced to 1 for its duration.\nHowever, using the power becomes risky if it wasn't already, and the risk die becomes a '1' automatically."
	}
];

// Free additions that are not quirks: Bind may gain these on top of its base
// abilities (page 30), and may summon the King (page 33).
CAIN.quirkAdditions = [
	{
		id: "sin-strike",
		name: "Sin Strike",
		blasphemy: "bind",
		kind: "power",
		source: "gff4",
		tags: { duration: "Instant", range: "Short" }, burst: "required",
		text: "You can command an active sin to attack by spending a psyche burst as long as both your sin and its target are in range, and you can communicate with it. Roll PSYCHE for its effects. The attack has supernatural potency."
	},
	{
		id: "sin-evolve",
		name: "Sin Evolve",
		blasphemy: "bind",
		kind: "feature",
		source: "gff4",
		text: "Your bound sins increase in ability as you gain category.\n- CAT 2+: Your sins gain the ability to speak and develop a humanlike intelligence. Only psychically sensitive people can hear them.\n- CAT 3+: Your sins can take on a humanlike form, or take on a larger animal-like form, or switch between these forms. Both forms are still only visible to exorcists and other sins, and are purely aesthetic.\n- CAT 4+: Your bound sins can appear visible and audible to humans. Graceless humans typically find this traumatic (roll PSYCHE for any effects).\n- CAT 5+: You can have two active sins out at once. Any action you take with them must apply to one or the other. Failing to absorb stress for an action taken by a sin banishes both of them."
	},
	{
		id: "menagerie",
		name: "Menagerie",
		blasphemy: "bind",
		kind: "feature",
		source: "gff4",
		text: "When you defeat a sin during a hunt, you may bind it as a new bound sin during a rest. This applies even for minor sins or foes with the type 'sin', such as Traces. Doing so typically requires approval from the Temerity Office of Stability (which can sometimes be waived). A captive sin is mechanically identical to your original bound sin but may differ in aesthetics and personality. You can swap your active bound sin in and out, including your original bound sin, and keep up to six. Inactive sins retract into a dormant state inside your sin seed."
	},
	{
		id: "ten-thousand-sword-king",
		name: "Summon the Ten Thousand Sword King",
		blasphemy: "bind",
		kind: "feature",
		source: "gff4",
		text: "If you have the bind blasphemy and are either CAT 5 or on the brink of death, you can beckon the infinite blue. The skies that were denied to us come rushing forth, and do not stop. The stars are falling, each of them a perfect blade.\nSummoning the King immediately initiates an apocalyptic force in an area around the size of a town (around CAT 5), centered on you. The infinite sword field appears, turning the sky a perfect blue.\nSins and exorcists in the area, including you, roll 1d6 and add their category. If the result is 9 or higher, they survive the unending assault, otherwise they are obliterated. Exorcists suffer instant death, sins are reduced to blood soaked ashes. This fate can be defied as normal.\nPerfect Sins (Games for Freaks, volume 3) always survive.\nAnything else that survives takes 5 slashes on its execution talisman. All other humans, creatures, and structures in the area around CAT 5 or under are annihilated with unbelievable force unless protected by supernatural and similarly overwhelming force. Afterwards, the King departs.\nYou can describe, if you wish, the way that your character accepts or avoids their fate. If you are particularly avaricious of victory, you may attempt to fight, or even bind the King, though such matters are best left up to your table to figure out. Few beings exist that are stronger than it, and perhaps there are none at all. Its grief is infinite, after all.\nSummoning the King can only be done once in a game of CAIN."
	}
];

// Bind's free additions (page 30): every bind exorcist has them, so they sit
// with the blasphemy's extra rules rather than among the powers to pick.
(function () {
	var bind = CAIN.blasphemies.filter(function (b) { return b.id === "bind"; })[0];
	if (!bind) return;
	CAIN.quirkAdditions.forEach(function (x) {
		var head = x.kind === "power" ? x.tags.duration + ", " + x.tags.range + ". Free.\n" : "";
		(bind.extras = bind.extras || []).push({ title: x.name + " (Games for Freaks 4, free)", text: head + x.text });
	});
})();
