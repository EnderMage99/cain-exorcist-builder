// Virtues, from Games for Freaks issue 1 (CHASM, October 2024): an optional
// progression for CAIN. An exorcist picks a virtue to bond with at the start of
// a mission, gains its rank 0 ability at once, and raises the bond by 1 (to III)
// if they survive. Bonds are permanent, and an exorcist can hold bonds with
// several virtues. While raising a bond they must follow its stricture.
// bonds: the ability gained at each rank (0-3). powers: high blasphemies, with
// rank: the bond rank that grants it. burst "all": spend all remaining psyche
// bursts (min 1); sin can't stand in for them.
window.CAIN = window.CAIN || {};

CAIN.virtueRules = {
	stricture: "While raising a bond, follow the virtue's stricture. Ignore it for one roll by taking 2 nonlethal stress, which can't be reduced but can't cause injuries.",
	highBlasphemy: "A high blasphemy power still counts as a blasphemy, but it doesn't raise your XP cap, lower your sin overflow cap, or count against blasphemies known. Most spend all your remaining psyche bursts (min 1); sin can't be used to pay for them.",
	maxRank: 3
};

CAIN.virtues = [
	{
		id: "justice",
		name: "Justice",
		epithet: "The Executioner",
		theme: { color: "#5ff2d2", color2: "#1a8f7a", dark: true },
		flavor: "Justice is generally regarded as the most powerful exorcist in CAIN's current arsenal, a loner of few words given extreme leeway in engagement and unusual permission to roam. This is because Justice's high blasphemy, Law, will not allow them to disobey orders from a superior in any form, making them the perfect attack dog. They have the most recorded executions in CAIN history and a near-flawless fight record, standing as an object of awe amongst the regular rank and file.",
		likes: ["Religious Debate", "Classical Music", "Cleanliness"],
		dislikes: ["Charity", "Tardiness", "Dogs"],
		food: "Health Food Dates",
		stricture: "You cannot ignore orders from a superior. Roll 0d on any action you think would break the law.",
		bonds: [
			{ rank: 0, text: "Gain an extra xp trigger: Did you uphold the dogma of CAIN?", xpQuestion: "Did you uphold the dogma of CAIN?" },
			{ rank: 1, text: "Gain the Law blasphemy. You can use it once a hunt." },
			{ rank: 2, text: "If you executed a sin rather than sparing it, then lower sin by 1 after halving it. If you spared a sin or failed to execute it, increase sin by 1d3 after halving it instead." },
			{ rank: 3, text: "You always gain the last effect of Law for free (make something specific less hard or risky)." }
		],
		powers: [
			{ id: "law", name: "Law", rank: 1, burst: "all",
				tags: { duration: "1 scene", effect: "Transmute", range: "Adjacent" },
				text: "You set a rule of physical reality that affects everything in a circular area around you, called the Court, with an approximate area of around CAT+1 ({cat+1:area}). You can exclude yourself. Any changes made take place instantly and persist inside the area, but the area itself does not move. This power can always eliminate, destroy, or totally change mundane beings, objects or structures. Strong willed or supernatural beings such as exorcists or sins can partly resist its effects, but humans are always affected instantly. If you exit the area or the scene ends, the effect ends.\nTo use law, spend all your remaining psyche bursts (min 1), then fill in the sentence: In the Court, ____ is/are ____. You can only use words from the Terms of Law.\nThen, choose one effect:\n- Grant up to three advantage die (total) to an ally while the court is active. These can be given out one at a time or all at once.\n- Instantly kill all humans in the area or that enter the area while the court is active.\n- Slash a talisman by rolling PSYCHE. This gains +1D and deals +1 slash on at least one success.\n- Make something specific less hard, or less risky while the court is active.\nThis power may easily affect the parameters of rolls while in the area, and may make it so rolls are not even required for certain tasks. Additional effects are up to the GM and can be improvised depending on the fiction.\nTerms of Law: 1 Fast, 2 Slow, 3 Sticks, 4 Stones, 5 Paper, 6 Cloth, 7 Blood, 8 Nails, 9 Skin, 10 Slings or bullets, 11 Arrows, 12 Blades, 13 Solid, 14 Liquid, 15 Metal, 16 Soft, 17 Sharp, 18 Heavy, 19 Light, 20 Earth, 21 Fire, 22 Water, 23 Air, 24 Forbidden, 25 Pulled, 26 Repulsed." }
		]
	},
	{
		id: "faith",
		name: "Faith",
		epithet: "The Timid",
		theme: { color: "#ffc21a", color2: "#b8860b", dark: true },
		flavor: "Faith was born in a village in eastern Europe in 1672 and never seemed to age past their early 20s, manifesting supernatural strength and constitution. Discovered by an early CAIN, they were determined to be the only purely graceless and sinless individual in the entire world. It is now theorized that they have an 'anti-blasphemy', a blasphemy that absorbs all others, making them completely immune to psychic phenomena and biologically immortal. Faith has the lowest confirmed kills of any virtue; it is rumored that CAIN uses them mostly for capture and control missions of rogue binders.",
		likes: ["Dogs", "Slow Afternoons", "Taking Photos", "Gachapon", "Phone Games", "Fighting Games"],
		dislikes: ["Fortitude", "Rude people", "Work", "Horror Movies"],
		food: "Fast Food, Sweets, Hot Chicken",
		stricture: "You cannot harm anyone or anything. Roll 0d on actions you think would be impolite.",
		bonds: [
			{ rank: 0, text: "Once a hunt, if you are able to eat sweets, you can relieve 1 sin." },
			{ rank: 1, text: "You gain the Null blasphemy. You can use it once a hunt." },
			{ rank: 2, text: "Sin overflow only reduces your sin overflow cap by 1 instead of 2.", flags: ["overflowCrossesOne"] },
			{ rank: 3, text: "When you so choose, your Null blasphemy becomes the Immaculate Defiance of Heaven. This choice is irreversible." }
		],
		powers: [
			{ id: "null", name: "Null", rank: 1, burst: "all",
				tags: { duration: "1 scene", effect: "Charm", range: "Instant" },
				text: "Spend all your remaining psyche bursts (min 1). For the duration of the scene, you become completely immune to psychic phenomena. Anything inflicting physical harm, like the physical attacks of Sins, can affect you normally. For example, you could be harmed by a thrown piece of furniture or a bullet, but not by a blast of purely psychic energy or a form of mind control. You cannot be affected by afflictions (though they still remain on you, their abilities are merely suppressed for the scene). In return, for the duration, you cannot use or be affected by any blasphemy other than this one, including those from your allies, and any currently affecting you end. Unlike other powers, you cannot end this effect early." },
			{ id: "immaculate-defiance", name: "Immaculate Defiance of Heaven", rank: 3, choice: true, burst: "none",
				tags: { duration: "Permanent" },
				modifiers: [{ stat: "maxInjuries", add: 1 }],
				text: "This power has the same function as Null, except it is permanent. It has the following effects:\n- You can no longer use or be affected by blasphemies.\n- You no longer gain, spend, or interact with psyche bursts.\n- Your sin resets to 0. You no longer gain or use sin or can enter sin overflow for any reason.\n- Cosmetic changes from sin marks persist, but they cannot be used for any other effect.\n- You can now gain 1d3 stress instead of a psyche burst to gain +1D on any appropriate action by using your powerful physical abilities.\n- Fighting sins with mundane abilities is no longer hard by default. In addition, your mundane physical abilities are about 1/2 CAT ({halfcat}) in capability. You can push this further for an action by +1 CAT by gaining 1d3 stress.\n- You gain +1 max injury.\n- Your natural lifespan extends by 10d10 years." }
		]
	},
	{
		id: "charity",
		name: "Charity",
		epithet: "The Twins",
		theme: { color: "#ff2bf0", color2: "#9a0f92", dark: true },
		flavor: "A widely feared Virtue, Charity is functionally the same person occupying two bodies - or two separate people with the exact same personality and appearance down to each strand of hair. Charity's high blasphemy, Entwine, forces a merger of its users so that over time they become perfect twins. There have been several generations of Charities since at least 1850; when one dies, CAIN mandates a replacement from a select pool. By bonding with Charity, you have put yourself on this list. Congratulations.",
		likes: ["Fashion", "Arguing online", "Travel", "Rainy days"],
		dislikes: ["Justice", "Faith", "Boring people", "Long conversations"],
		food: "High tea, Pork dumplings",
		stricture: "When possible, you must participate in teamwork or set up. You roll 0d when trying to hide, stealth, or avoid notice.",
		bonds: [
			{ rank: 0, text: "You can engage in telepathy with any single exorcist you have skin to skin contact with." },
			{ rank: 1, text: "Gain the Entwine blasphemy." },
			{ rank: 2, text: "At the start of a mission, you can pick an agenda ability from any other party member. For the rest of the mission, you can use this agenda ability as your own." },
			{ rank: 3, text: "Powers that target 'self' can now target any exorcist you are Entwined with." }
		],
		powers: [
			{ id: "entwine", name: "Entwine", rank: 1, burst: "none",
				tags: { duration: "1 hunt", range: "Instant" },
				text: "You entangle your mind with another's in a loving embrace. Without spending a psyche burst, choose another willing exorcist. For the duration of the hunt, gain the following effects:\n- When one of you gains or loses stress or spends or gains a psyche burst, you may assign the loss or gain to either person, no matter the distance. Harm, stress, etc, supernaturally appears on each other's bodies. Anything transferred like this cannot be reduced in any way.\n- You can telepathically communicate with that person over extreme distance. You also feel any strong emotion they feel reflexively, even involuntarily.\nHowever:\n- When one of you gains an affliction or hook, both of you gain that affliction or hook.\n- When one of you gains sin, you both gain that amount of sin.\n- If either of you suffer sin overflow or instant death, this blasphemy breaks for the rest of the mission. It cannot be ended otherwise.\nAfter the mission, even if this power broke early:\n- Both of your physical appearances change to match the other (your eye or hair color, age, gender, height, body or face shape, etc). Each of you chooses a feature to share with the other. The process takes about three days and is unpleasant.\n- Each of you pick an agenda item from your partner's agenda and take it as a bolded agenda item for your own agenda." }
		]
	},
	{
		id: "fortitude",
		name: "Fortitude",
		epithet: "The Disaster",
		theme: { color: "#ff2020", color2: "#8f0f0f", dark: true },
		flavor: "Deemed 'reserve calamity level elimination weapon', and one of the only exorcists in history deemed close to exceeding category 7, Fortitude is kept on a strict freezing cycle. An extremely volatile and potent fighter, their ability to execute sins is only matched by their thirst for complete, unbridled destruction. Fortitude's high blasphemy, Strength, allows them unparalleled physical abilities, but without proper training, its users can literally tear themselves apart.",
		likes: ["Fighting Strong Opponents"],
		dislikes: ["Humans", "Exorcists", "All other virtues", "Sins", "CAIN leadership"],
		food: "Hot Dogs (per CASTLE addendum 3004, subject is only allowed nutrient paste)",
		stricture: "You cannot pass up the opportunity to get into a fight. Roll 0d on actions where you choose talk over action.",
		bonds: [
			{ rank: 0, text: "You never roll 0d for inflicting harm or violence (always roll at least 1d)." },
			{ rank: 1, text: "Any amount of harm you inflict is instantly fatal to humans." },
			{ rank: 2, text: "You gain the Strength blasphemy. You can use it safely once a hunt. If you use it a second time, when the scene ends, you rip apart from the inside and suffer instant death." },
			{ rank: 3, text: "You can safely use Strength a second time." }
		],
		powers: [
			{ id: "strength", name: "Strength", rank: 2, burst: "all",
				tags: { duration: "1 scene", effect: "Charm" },
				text: "A rare mutation of the Amplify blasphemy, this ability allows the very flesh and blood of its wielder to be infused with grace, pushing them past impossible limits. Without proper training, using this blasphemy will cause internal organs to violently burst from the body.\nSpend all your remaining psyche bursts (min 1). For the remainder of the scene, your mundane physical abilities are now equal to CAT and fighting sins with mundane forces is no longer hard by default.\n- You can push any physical action to CAT+2 ({cat+2}) instead by gaining 2d3 stress. This could inflict an injury.\n- All weapons you use break after use unless specifically tempered. You can temper any weapon between missions by spending 1 scrip per weapon.\n- At the end of the scene, you take an injury and become comatose until your group rests. You recover at the start of the rest period and can otherwise rest normally." }
		]
	},
	{
		id: "hope",
		name: "Hope",
		epithet: "The Dreamer",
		theme: { color: "#9b2cff", color2: "#5a12a8", dark: true },
		flavor: "Hope is among the most valuable assets that CAIN possesses. Typically blessed with strong precognitive and telepathic abilities, their ability to shoulder the Veil high blasphemy has allowed CAIN to operate in secrecy even in the most dire of circumstances. The full power of Veil can be passed on to other wielders; the current Hope is the forty first, and they are typically retired when the stress of Veil proves too much to bear. Hope is never permitted to leave the orbital station SERAPH unless under extreme circumstances, or once a year at Christmas.",
		likes: ["Video Games", "Luxurious Baths", "Holidays"],
		dislikes: ["Loud Noises", "Nosy people", "Justice", "Fortitude"],
		food: "Pre-packed meal 402A",
		stricture: "You cannot take actions that would be loud or attract attention. You roll 0d for set up actions.",
		bonds: [
			{ rank: 0, text: "Once a mission, you can re-roll any action taken in stealth or to avoid notice, taking the second result as final." },
			{ rank: 1, text: "Gain the Veil blasphemy. You can use it once a mission." },
			{ rank: 2, text: "Mundane humans always forget you were there if you are out of sight for 77 seconds or more. You cannot turn this ability off." },
			{ rank: 3, text: "You can use Veil to erase memory for longer periods (Mass Memory Rupture)." }
		],
		powers: [
			{ id: "veil", name: "Veil", rank: 1, burst: "all",
				tags: { duration: "Instant", range: "Long" },
				text: "Spend all your remaining psyche bursts to instantly erase the memory of all humans or exorcists other than you in an up to CAT ({cat:area}) sized area centered on a point in long range you can see. Though you can control the size of this area, you cannot exclude anyone from this effect once the area is set.\nAll affected become completely insensate for exactly 11 seconds. If an ally acts on this opening, they gain +1D on the action.\nThen, they forget everything they saw and heard for the last 77 seconds (including the insensate period). Their brain will work over the damage as if that time never passed (they are effectively 'reset' to 77 seconds ago). They may be confused by the circumstances: for example they might not be standing where they remember, or holding different items, etc." },
			{ id: "mass-memory-rupture", name: "Mass Memory Rupture", rank: 3, burst: "all",
				tags: { duration: "Instant", range: "Long" },
				text: "At bond rank III, you can push Veil for longer periods. If you do, you must pay the associated cost. Costs are cumulative. Good luck out there.\n- Up to ten minutes: 1d3+1 stress\n- Up to one hour: ...and also gain 1d3+1 sin\n- Up to ten hours: ...and also permanently lose an important memory, such as the taste of something, the name of your parents, a childhood treasured memory\n- Up to one day: ...and also lower sin overflow cap by 2\n- Up to ten days: ...and you forget your own name. You cannot use agenda abilities or gain any further xp this mission. You must change agendas before the start of next mission.\n- Full reset: CAIN forgets you exist. You forget you exist. Your allies forget you exist. You become a hollow husk, a walking mindless corpse that nobody remembers. You are not dead but not truly alive. Make a new character." }
		]
	},
	{
		id: "prudence",
		name: "Prudence",
		epithet: "The Negotiator",
		theme: { color: "#2a8cff", color2: "#0f4fa8", dark: true },
		flavor: "The wielder of the powerful Shake blasphemy, Prudence is an amicable and charismatic Virtue with a very busy schedule. Aside from being a powerful combatant, Prudence serves a vital role in CAIN's internal structure and its relationship with mundane governments due to their unique ability to enforce deals. They have multiple cover identities, speak multiple languages, and are always exceptionally well dressed and spoken in public.",
		likes: ["Neat Whiskey", "Romance Novels", "Trains", "Long walks"],
		dislikes: ["Charity", "Justice", "Explaining things to slow people"],
		food: "Nuts",
		stricture: "You must honor all deals and promises. Roll 0d when choosing violence over negotiation.",
		bonds: [
			{ rank: 0, text: "When you shake hands with a willing human on a deal or promise, if someone breaks it, they suffer instant death. This applies to you, and both you and your target are aware of the effects." },
			{ rank: 1, text: "Gain the Shake blasphemy. You can use it once a hunt." },
			{ rank: 2, text: "Your rank 0 ability now applies to exorcists and sins." },
			{ rank: 3, text: "You can use Shake once again during a hunt, but if you do, the GM picks the game." }
		],
		powers: [
			{ id: "shake", name: "Shake", rank: 1, burst: "all",
				tags: { duration: "1 scene", range: "Short" },
				text: "You may spend all your remaining psyche bursts to instantly enforce a game from the list below on yourself and all other humans, sins, or exorcists in range determined by CAT ({cat:range}). Breaking the rules of the game causes excruciating pain, hemorrhaging, and eventually death. As long as the rule applies:\n- for you and allies, actions become harder when you must avoid breaking the rule with your actions\n- If through your actions you or an ally intentionally breaks the rule, you take 2d3 stress, which cannot be reduced in any way and could inflict injuries as normal.\nIn return:\n- If the target, through their actions, breaks a rule intentionally, they take 1d3 slashes on their execution talisman. Humans are killed instantly. They are aware of this effect.\n- You may set up an ally for free, three times, while the rule is active, and without rolling. Describe how you are taking advantage of the rule. Any normal effects of setup apply to these special setup actions, and you can take them without counting as an action in a conflict scene.\nYou cannot end this effect early, and it lasts for the scene.\nGames: The Floor is Lava (Don't Touch the Ground). King of the Hill (Must stay inside a small area). Reverse Tag (Don't touch a sin, human, or exorcist). Look No Hands (Don't Use Your Hands). No Talking Contest (Don't speak or make loud noises). Marco Polo (Don't open eyes. Targets must say 'Polo' when you say 'Marco' and cannot stray from short range from you). Red Light Green Light (Those affected see a phantom red and green light and are forced to stop moving on red light)." }
		]
	}
];
