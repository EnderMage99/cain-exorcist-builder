// Fan-made content from The Harpocrates Dossier 3.1 by SvelteSnorlax (Dillon
// Nguyen), an unofficial CAIN supplement. Every entry carries
// source: "harpocrates", so the site badges it as fan-made and gives it its own
// border. Pictures are in img/harpocrates/.
window.CAIN = window.CAIN || {};

(function () {
	var agendas = [
		{
			id: "pararomantic",
			name: "Pararomantic",
			source: "harpocrates",
			requires: null,
			look: { paper: "dark", accent: "#e01bd8", tape: "#e01bd8" },
			image: "img/harpocrates/agenda-pararomantic.png",
			items: [
				{ text: "Get intimate with the supernatural", bold: false },
				{ text: "Turn away a chance to breach the veil", bold: true }
			],
			abilities: [
				{ id: "6th-sense", name: "6th Sense",
					text: "You always know when someone or something is observing you. When alerted by the Admin of this, you may roll PSYCHE to determine whether or not it is supernatural on a success." },
				{ id: "paramour", name: "Paramour",
					text: "Whenever you take a risky action to observe, examine, or get closer to a supernatural being without attempting to harm it, you take -2 stress from any resulting reaction." },
				{ id: "twisted-psyche", name: "Twisted Psyche",
					text: "Once per rest, after you have encountered the Sin or a drifter, a power you use that targets objects may be used on mundane humans." },
				{ id: "oddity", name: "Oddity",
					text: "Supernatural beings that can perceive you will never target you in the first round of a conflict scene." },
				{ id: "inverted-clarity", name: "Inverted Clarity",
					text: "When you have 2 or more injuries and are in the same scene as the Sin, you may ask the Admin for the answer to one of the trauma questions. The Admin may only connect the dots on information you already possess, but cannot conjure information you have not learned." }
			]
		},
		{
			id: "needle",
			name: "Needle",
			source: "harpocrates",
			requires: null,
			look: { paper: "grey", accent: "#141414" },
			image: "img/harpocrates/agenda-needle.png",
			items: [
				{ text: "Complete a task with finesse and precision", bold: false },
				{ text: "Do something messy out of desperation", bold: true }
			],
			abilities: [
				{ id: "surgical-precision", name: "Surgical Precision",
					text: "You roll +1D on actions that primarily rely on fine motor skills or high mental acuity, at the admin's discretion." },
				{ id: "ockhams-broadsword", name: "Ockham's Broadsword",
					text: "Once per mission, you may ask the admin exactly where to go next to get new or vital information pertaining to the current investigation." },
				{ id: "clean-exit", name: "Clean Exit",
					text: "Pick one to never be impossible when leaving a location. You can leave: without a trace; without being detected; with what you came for." },
				{ id: "crows-eye", name: "Crow's Eye",
					text: "You may take 2 non-lethal stress to gain +1D on any action to suppress or negate an incoming threat." },
				{ id: "the-thread", name: "The Thread",
					text: "At mission start, select an ally. Once during the mission when you succeed on a roll, they may immediately make an action roll and share risks or consequences with you. This does not take up their turn." }
			]
		},
		{
			id: "mentor",
			name: "Mentor",
			source: "harpocrates",
			requires: null,
			note: "When you retire or die without returning, exorcists of your choice gain +1 xp.",
			look: { paper: "beige", accent: "#141414", tape: "#e9d9a8" },
			image: "img/harpocrates/agenda-mentor.png",
			items: [
				{ text: "Guide an ally to success", bold: false },
				{ text: "Pass the torch to someone new", bold: true }
			],
			abilities: [
				{ id: "over-the-shoulder", name: "Over the Shoulder",
					text: "Allied exorcists of your choice gain +1D to lead, intimidate, or give orders to anyone if you are standing adjacent to them." },
				{ id: "experienced", name: "Experienced",
					text: "Once per mission, if you tell someone how to do something and they succeed in doing it, both of you gain 1 xp." },
				{ id: "measured-hand", name: "Measured Hand",
					text: "Once per mission, when you use Set-Up or Teamwork on an ally and they succeed, both of you relieve 1d3 stress." },
				{ id: "the-long-game", name: "The Long Game",
					text: "Once per mission, you may delay an ally's hook from filling up. It becomes fully slashed after you both rest. If the Admin forgets to do this and you remind them, you and your ally gain 1 xp." },
				{ id: "second-opinion", name: "Second Opinion",
					text: "Once per rest, when an ally of your choice fails a roll, they may reroll with +1D but they still suffer any risk or consequences from failing the first roll." }
			]
		},
		{
			id: "maw",
			name: "Maw",
			source: "harpocrates",
			requires: null,
			look: { paper: "grey", accent: "#7a1416", splatter: true },
			image: "img/harpocrates/agenda-maw.png",
			items: [
				{ text: "Act upon your hunger", bold: false },
				{ text: "Turn down a chance to satisfy yourself", bold: true }
			],
			abilities: [
				{ id: "insatiable", name: "Insatiable",
					text: "You may use two consumables at once as a part of the same action. Consuming them this way lowers their overall KP cost by 1." },
				{ id: "long-pig", name: "Long Pig",
					text: "When you consume the flesh of a sentient being for the first time in a mission, regain 1 psyche burst and relieve 1 sin." },
				{ id: "gullet", name: "Gullet",
					text: "You can eat much more than normal, and eat most things without consequence. Poisons and most inedible things do not harm you when eaten. Outright dangerous things (explosives, hostile creatures, etc.) will still hurt you if eaten." },
				{ id: "the-late-worm", name: "The Late Worm",
					text: "Acting last in the round of any conflict scene slashes +1 segment on any complication you choose to deal with." },
				{ id: "that-fleeting-taste", name: "That Fleeting Taste",
					text: "Select a single vice (cigarettes, gambling, alcohol, etc.). Once during a resting scene when you partake in this vice, you may reroll up to 2 of your resting dice and choose the highest results. The Admin then secretly makes a fate roll. On a 1-2, partaking in this vice no longer triggers the reroll effect. On a 6, this vice regains its reroll effect (if it did not have it). The Admin only tells you whether you can reroll after you partake, and doesn't tell you if it changed or not afterwards." }
			]
		},
		{
			id: "persecutor",
			name: "Persecutor",
			source: "harpocrates",
			requires: null,
			note: "You only receive 2 scrip for hazard pay.",
			look: { paper: "dark", accent: "#e8e8e8", tape: "#d9d9d9" },
			image: "img/harpocrates/agenda-persecutor.png",
			items: [
				{ text: "Prosecute with extreme prejudice", bold: false },
				{ text: "Challenge your beliefs", bold: true }
			],
			abilities: [
				{ id: "i-witchfinder", name: "I, Witchfinder",
					text: "You always know when something directly in front of you is supernatural or mundane." },
				{ id: "jury-executioner", name: "Jury, Executioner",
					text: "If you reduce an execution talisman to 1, you can take 2 stress to inflict +1 slash, which cannot be reduced in any way." },
				{ id: "exhibit-a", name: "Exhibit A",
					text: "You gain +2D on rolls to convince another individual of something if you have some form of physical evidence pertaining to your argument." },
				{ id: "broken-clocks", name: "Broken Clocks Twice a Day",
					text: "After briefing at the start of deployment, make 1 specific claim or belief about the mission at hand. 1/scene, gain +1D on actions to prove yourself right. If it is discovered you are correct, you lose this bonus but gain 1 psyche burst." },
				{ id: "weighted-judgment", name: "Weighted Judgment",
					text: "Once per rest, when you publicly accuse or shame another individual of something serious, regain 1 psyche burst." }
			]
		},
		{
			id: "wronged",
			name: "Wronged",
			source: "harpocrates",
			requires: null,
			note: "You may only take this agenda after a close ally has died or imagoed permanently. Once taken, a character can only swap out of this agenda by spending two advances. Get its ability for free.",
			look: { paper: "dark", accent: "#e0362f", tape: "#f4f1ea" },
			image: "img/harpocrates/agenda-wronged.png",
			items: [
				{ text: "Get revenge", bold: false }
			],
			abilities: [
				{ id: "the-fire-that-remains", name: "The Fire That Remains",
					text: "1 in 6 chance of ignoring sin overflow at the end of scene (roll 1d6). Relieve 1d3 sin on a success." }
			]
		},
		{
			id: "scum",
			name: "Scum",
			source: "harpocrates",
			requires: null,
			look: { paper: "dark", accent: "#e8e8e8", tape: "#c9c9c9" },
			image: "img/harpocrates/agenda-scum.png",
			items: [
				{ text: "Demonstrate why you're the worst", bold: false },
				{ text: "Drag someone down to your level", bold: true }
			],
			abilities: [
				{ id: "schadenfreude", name: "Schadenfreude",
					text: "1/rest, when you witness an ally's affliction hook fill out or witness them experience intense suffering, relieve 1d3 stress. Relieve +1 if it was self-inflicted." },
				{ id: "heart-of-copper", name: "Heart of Copper",
					text: "Gain +1D on non-violent actions that have clear negative consequences for an allied exorcist or innocent human." },
				{ id: "swindle", name: "Swindle",
					text: "You roll +1D on actions to deceive or manipulate others for your own purposes. If an allied exorcist would benefit from this action in any way, take 3 non-lethal stress." },
				{ id: "leech", name: "Leech",
					text: "Whenever an ally uses a consumable to relieve sin or stress, you may reduce the amount they relieve by 1 to relieve (1-4): 1, (5+): 2 of the same type (sin or stress) from yourself instead." },
				{ id: "despised", name: "Despised",
					text: "When fighting the Sin and you roll a 1 on the risk die, it must target you with its severe attack if it hasn't used it this mission." }
			]
		},
		{
			id: "mortician",
			name: "Mortician",
			source: "harpocrates",
			requires: null,
			note: "Gain +1 scrip when recovering a dead exorcist's remains.",
			look: { paper: "grey", accent: "#141414" },
			image: "img/harpocrates/agenda-mortician.png",
			items: [
				{ text: "Respect the dead more than the living", bold: false },
				{ text: "Take care of the ones still here", bold: true }
			],
			abilities: [
				{ id: "cold-comfort", name: "Cold Comfort",
					text: "When comforting an ally after death-related trauma, you may relieve 1d3 stress from them (once per ally per mission)." },
				{ id: "quiet-work", name: "Quiet Work",
					text: "You can handle corpses or remains without disturbing their current state. Gain +1D on actions to gain information from a dead body." },
				{ id: "memento-mori", name: "Memento Mori",
					text: "You get the Morgue Kit for free. 1/mission, you may retrieve an item from this kit for 0KP. You lose the kit if you lose this agenda." },
				{ id: "tag-and-bag", name: "Tag & Bag",
					text: "It is never impossible for you to transport, conceal, or secure a body, no matter how damaged or large. Gain +1D on actions to conceal or transport corpses." },
				{ id: "pallor", name: "Pallor",
					text: "When a being near you dies, you may delay any psychic or supernatural consequences of their death for a number of action rolls equal to your 1/2 CAT ({halfcat})." }
			]
		},
		{
			id: "ordained",
			name: "Ordained",
			source: "harpocrates",
			requires: null,
			look: { paper: "beige", accent: "#8a6d1c" },
			image: "img/harpocrates/agenda-ordained.png",
			items: [
				{ text: "Revere a higher power", bold: false },
				{ text: "Show everyone why you were chosen", bold: true }
			],
			abilities: [
				{ id: "angel-numbers", name: "Angel Numbers",
					text: "At mission start, select 3 numbers between 1-6. If you encounter the Sin or main hunt target while the pressure matches any of those numbers, gain 1 pathos and 1 psyche burst." },
				{ id: "deliverance", name: "Deliverance",
					text: "1/mission, when you use the Nail of Abel, you may remove 1 segment on the Sin's execution talisman for every additional requirement you fulfill beyond the first." },
				{ id: "confessional", name: "Confessional",
					text: "During a resting scene, you may answer the question: How have you sinned? If the answer is serious and sincere, the Admin may relieve 1/2/3 (Admin's choice) sin from you." },
				{ id: "destinys-plaything", name: "Destiny's Plaything",
					text: "At mission start, the admin rolls the risk die. A higher power asks you to do something (1-4) difficult or complicated, (5-6) of moderate effort during this mission. Gain 1 psyche burst and gain 1 xp when you complete your task." },
				{ id: "flaming-sword", name: "Flaming Sword of Judgment",
					text: "Select one weapon in your kit when you gain this ability. It gains +1 CAT, and if you lose it, you can find it at the start of the execution scene. However, rolls you make to inflict harm or violence with any other weapon cannot benefit from bonus dice, and are hard by default. These effects end when you lose this ability." }
			]
		},
		{
			id: "zealot",
			name: "Zealot",
			source: "harpocrates",
			requires: null,
			note: "Actively monitored. Exorcists with this agenda are heavily monitored by SEER. Set aside a 6 segment talisman called \"Apotheosis\". The exorcist can work towards filling out the talisman by planning their escape from CAIN, or ignore it entirely. When it fills out, JUSTICE either executes the exorcist or the exorcist defects to U//H. Make a new exorcist.",
			look: { paper: "grey", accent: "#7b2fd6", tape: "#b98cff" },
			image: "img/harpocrates/agenda-zealot.png",
			items: [
				{ text: "Demonstrate exorcists' superiority", bold: false },
				{ text: "Kill all apes", bold: true }
			],
			abilities: [
				{ id: "anthropoid", name: "Anthropoid",
					text: "Gain +1D on actions that involve the life of mundane humans as collateral damage." },
				{ id: "darwinism", name: "Darwinism",
					text: "1/rest, when a human in front of you dies due to the supernatural, you may relieve 1d3 stress." },
				{ id: "iron-veins", name: "Iron Veins",
					text: "1/scene, you may reduce the stress you take from a mundane source by an amount equal to your current number of injuries." },
				{ id: "when-heaven-burns", name: "When Heaven Burns",
					text: "Take -1D on all mundane attack rolls to harm the supernatural. You may take 1 stress to gain +1D when using your psychic powers to inflict harm or violence." },
				{ id: "not-your-savior", name: "Not Your Savior",
					text: "1/rest, when ignoring pleas for help or refusing to help a civilian in need, relieve 1 sin." }
			]
		},
		{
			id: "phantom",
			name: "Phantom",
			source: "harpocrates",
			requires: null,
			note: "You and your admin may give this agenda item to a retired exorcist or exorcist whose body was not recovered during a mission. Your character has defied all odds and come back from the other side of the veil. Once taken, you may not remove this agenda by normal means. At the end of each session, answer the question \"Did you discover who you truly are?\" If the answer is yes, you may swap into another agenda for free.",
			look: { paper: "dark", accent: "#e8e8e8", tape: "#c9c9c9" },
			image: "img/harpocrates/agenda-phantom.png",
			items: [
				{ text: "Show them what they left behind", bold: false }
			],
			abilities: [
				{ id: "lingering-scent-of-death", name: "Lingering Scent of Death",
					text: "You cannot suffer instant death. When you die and do not defy fate, you become unconscious for the rest of the scene. You gain no scrip from missions, and can only gain xp from following this agenda's item. When you lose this agenda, you lose this ability." }
			]
		},
		{
			id: "drudge",
			name: "Drudge",
			source: "harpocrates",
			requires: null,
			look: { paper: "dark", accent: "#3f7fd9", tape: "#9cc0ff" },
			image: "img/harpocrates/agenda-drudge.png",
			items: [
				{ text: "Work unglamorously", bold: false },
				{ text: "Clean up someone else's mess", bold: true }
			],
			abilities: [
				{ id: "clogging-the-drain", name: "Clogging the Drain",
					text: "You gain +1D on all rolls to set up allies with less pathos than you." },
				{ id: "background-character", name: "Background Character",
					text: "Actions you take that aren't hard or risky blend into the background, and you are unnoticeable to others while taking them." },
				{ id: "thankless-job", name: "Thankless Job",
					text: "At the end of a session, you may spend any unspent pathos to relieve 1 stress per pathos spent (Max 3). If you spend any pathos this way, gain 1 sin." },
				{ id: "clock-out", name: "Clock Out",
					text: "When a conflict scene resolves, you may immediately spend any number of psyche bursts to relieve 1d3 sin per burst." },
				{ id: "indifference", name: "Indifference",
					text: "Regardless of whether or not the Sin was spared or executed, gain 4 scrip at the end of a successful mission instead of the standard 5 or 3." }
			]
		},
		{
			id: "pixie",
			name: "Pixie",
			source: "harpocrates",
			requires: null,
			look: { paper: "grey", accent: "#f0609e", tape: "#ffc0dd" },
			image: "img/harpocrates/agenda-pixie.png",
			items: [
				{ text: "Weaponize your innocence", bold: false },
				{ text: "Kill! Kill! Kill!", bold: true }
			],
			abilities: [
				{ id: "kirakira", name: "KiraKira!",
					text: "You can always spend 1 KP to pull out a small or cute bauble or accessory (keychain, hairclip, charm, etc.). If you use 3 KP on this consecutively, the third item has a ring pin and is explosive, similar in strength to a grenade." },
				{ id: "sugarcoat", name: "Sugarcoat",
					text: "You can always pass as harmless or non-threatening to anyone the first time they encounter you." },
				{ id: "whirling-candy", name: "Whirling Candy",
					text: "1/scene, when you make a violent action with flair (i.e. spinning, laughing, showing off), spin 1d6. If you can describe your full course of action before it stops spinning, it gains +1D." },
				{ id: "pastel-smile", name: "Pastel Smile",
					text: "The first time you succeed on a social roll in a scene, you can flash a distracting smile, and grant the effects of set up to the next ally that acts." },
				{ id: "paper-doll", name: "Paper Doll",
					text: "You feel no pain when you take an injury, no matter how severe. Each time you gain an injury, the first roll you make afterward gains +1D." }
			]
		},
		{
			id: "idealist",
			name: "Idealist",
			source: "harpocrates",
			requires: null,
			look: { paper: "grey", accent: "#141414" },
			image: "img/harpocrates/agenda-idealist.png",
			items: [
				{ text: "Overcome a challenge with overwhelming optimism", bold: false },
				{ text: "Get real", bold: true }
			],
			abilities: [
				{ id: "the-stars-between-you-and-i", name: "The Stars Between You and I",
					text: "At mission start, choose one allied exorcist to be your \"inspiration\". Whenever they would take an injury, add +1D to all teamwork rolls you make with them for the rest of the scene." },
				{ id: "glittering-hearts", name: "Glittering Hearts",
					text: "1/scene if you participate in teamwork and it rolls 0 successes, you may choose to reroll it." },
				{ id: "equal-under-heaven", name: "Equal Under Heaven",
					text: "If the mission ends with the host alive and Sin spared, gain +1 xp. Gain +2 if you convinced an ally who wanted to execute the sin to spare it instead." },
				{ id: "pacifist", name: "Pacifist",
					text: "Gain +1D on all rolls to convince another person to stop fighting or avoid getting into a fight." },
				{ id: "i-remember", name: "I Remember, And She's Smiling",
					text: "1/mission, when you first enter the brink of death and have over half your sin boxes filled out, make a hard PSYCHE roll. On a success, you may heal an injury." }
			]
		},
		{
			id: "victim",
			name: "Victim",
			source: "harpocrates",
			requires: null,
			note: "When you end a mission at 3 pathos gain +1 xp.",
			look: { paper: "grey", accent: "#c01818", tape: "#c01818" },
			image: "img/harpocrates/agenda-victim.png",
			items: [
				{ text: "Let something bad happen to you", bold: false },
				{ text: "Be your own savior", bold: true }
			],
			abilities: [
				{ id: "defeatist", name: "Defeatist",
					text: "When the pressure increases, increase your pathos by 1." },
				{ id: "inevitable", name: "Inevitable",
					text: "1/rest when you gain a hook for an affliction, you may choose to fully slash it instead. Gain +1 resting die for your next rest if you gained an affliction this way." },
				{ id: "numb", name: "Numb",
					text: "Once per rest, when a psychic effect would make a roll hard when it normally isn't, you may choose to ignore it." },
				{ id: "damsel", name: "Damsel",
					text: "Allied exorcists always gain +1D on rolls to rescue or save you from danger." },
				{ id: "please-just-this-once", name: "Please, just this once...",
					text: "1/mission, you may add +2D to a hard and risky roll. If you pass you relieve 1d3 stress, 1d3 sin, and lose this ability. If you fail, take 1d3+2 stress." }
			]
		},
		{
			id: "queenbee",
			name: "Queenbee",
			source: "harpocrates",
			requires: null,
			note: "If you start a mission wearing Aesthetics whose total original scrip value is less than your CAT, start the mission with 2d3 stress. Expanded Aesthetics (from Wardrobe): Fancy Shoes (2 scrip), formal footwear for exorcists in the form of heels, oxfords, etc. Fancy Undergarments (3 scrip), underwear or undergarments for off-duty wear: lingerie, briefs, garter belts, etc. Make Up Options (2 scrip), a make up kit that can be applied before mission deployment. Handbag (4 scrip), a high-end designer bag that can carry small objects; can be used when deployed.",
			look: { paper: "gold", accent: "#3a2e14", tape: "#f4f1ea" },
			image: "img/harpocrates/agenda-queenbee.png",
			items: [
				{ text: "Win their attention", bold: false },
				{ text: "Earn their respect", bold: true }
			],
			abilities: [
				{ id: "wardrobe", name: "Wardrobe",
					text: "Aesthetic options cost 1 less scrip for you (min 0). Gain access to the \"Expanded Aesthetics\": Fancy Shoes, Fancy Undergarments, Make Up Options and Handbag." },
				{ id: "backhand", name: "Backhand",
					text: "Once per scene, when someone insults or challenges you, gain +1D on the first action you take to get back at them." },
				{ id: "lackey", name: "Lackey",
					text: "At the start of the mission, assign someone to be your lackey. They gain +1D on all set-up rolls for your actions, but if you fail the subsequent roll, both of you take 1d3 stress." },
				{ id: "mean-girl", name: "Mean Girl",
					text: "Rolls to bully or degrade another person can never be hard or impossible for you." },
				{ id: "flawless", name: "Flawless",
					text: "When you make a roll with 3 or more successes, you may relieve 1 sin. Whenever you fail a roll, you take 1 sin." }
			]
		},
		{
			id: "harbinger",
			name: "Harbinger",
			source: "harpocrates",
			requires: null,
			note: "This agenda may be taken and exist alongside another agenda. This agenda can only be granted by the Admin to an exorcist when that exorcist has witnessed a terrible future that must be stopped at all odds. The Admin determines the clarity of this vision, and the extent to which the exorcists can stop it. At the beginning of each mission that you have this agenda, the vision is added upon, either with more clarity or additional visions. You cannot remove this agenda until this future is prevented or resolves, and you gain its ability for free.",
			look: { paper: "stamp", accent: "#c0302a", tape: "#f4f1ea" },
			image: "img/harpocrates/agenda-harbinger.png",
			items: [
				{ text: "Change the future", bold: false }
			],
			abilities: [
				{ id: "albatross", name: "Albatross",
					text: "Once per mission, when rolling to take an action where someone's life or safety is on the line, you may roll the die pool twice, choosing the final results. If this action would help fulfill your agenda item, remove 1 slash on the XK-talisman." }
			]
		},
		{
			id: "shrew",
			name: "Shrew",
			source: "harpocrates",
			requires: null,
			look: { paper: "grey", accent: "#141414" },
			image: "img/harpocrates/agenda-shrew.png",
			items: [
				{ text: "Get under someone's skin", bold: false },
				{ text: "Agree to disagree", bold: true }
			],
			abilities: [
				{ id: "venomous", name: "Venomous",
					text: "Roll +1D on rolls to intimidate or argue with characters you have already successfully intimidated or argued with in a previous scene." },
				{ id: "critical", name: "Critical",
					text: "Calling out other exorcists' mistakes, hypocrisies, or flaws can count as set-up if the call-out addresses relevant actions." },
				{ id: "blunt", name: "Blunt",
					text: "1/rest, when you would speak plainly or honestly to someone in a way that would hurt their feelings, relieve 1 sin." },
				{ id: "cornered-animal", name: "Cornered Animal",
					text: "Gain +1D on all rolls to attack or lash out against someone or something else when you are the only PC in a scene." },
				{ id: "unsatisfied", name: "Unsatisfied",
					text: "When you make a roll with only 1 success, you may choose to take 2 stress to re-roll the dice pool, and must take the second result." }
			]
		},
		{
			id: "ophelia",
			name: "Ophelia",
			source: "harpocrates",
			requires: null,
			look: { paper: "dark", accent: "#f2b8c6", tape: "#f2b8c6" },
			image: "img/harpocrates/agenda-ophelia.png",
			items: [
				{ text: "Stay unmoored through something awful", bold: false },
				{ text: "Come to your senses", bold: true }
			],
			abilities: [
				{ id: "drifting", name: "Drifting",
					text: "1/rest, whenever your group decides on a course of action, regain 1 burst and relieve 1 stress if you take an alternate course of action that causes new or unexpected complications." },
				{ id: "drowning", name: "Drowning",
					text: "Take -1 stress from supernatural sources of harm that are purely mental." },
				{ id: "magpies-nest", name: "Magpie's Nest",
					text: "You gain +5 KP, but whenever you would retrieve an item from your kit, your Admin decides what is retrieved.",
					modifiers: [{ stat: "kitPoints", add: 5 }] },
				{ id: "pale-garden", name: "Pale Garden",
					text: "1/rest, if an allied exorcist questions or confronts you about your sanity during a resting scene, both of you may re-roll one resting die each, taking the highest results." },
				{ id: "deep-end", name: "Deep End",
					text: "Whenever you gain an affliction, relieve 1 stress. Relieve +1 stress if this would leave you with two or more afflictions." }
			]
		},
		{
			id: "gumshoe",
			name: "Gumshoe",
			source: "harpocrates",
			requires: null,
			note: "1/mission when you tell a person personally connected to the sin host the full truth, gain 2 xp. If this person would attempt to share this info, subsequent cover-up deducts -2 scrip.",
			look: { paper: "grey", accent: "#141414", tape: "#e9d9a8" },
			image: "img/harpocrates/agenda-gumshoe.png",
			items: [
				{ text: "Drag the truth into the light", bold: false },
				{ text: "Protect someone from the truth", bold: true }
			],
			abilities: [
				{ id: "the-big-heat", name: "The Big Heat",
					text: "Complication relating to law enforcement or organized crime that negatively impact the exorcists are reduced by 1 segment." },
				{ id: "just-one-more-thing", name: "Just One More Thing...",
					text: "Whenever you succeed on a roll to interrogate or get information from someone, you may automatically succeed on any roll to interrogate them again, but only right before you exit the scene." },
				{ id: "the-long-goodbye", name: "The Long Goodbye",
					text: "Once, when you suffer instant death and have not fulfilled this agenda's passive, you may ignore dying temporarily and relieve an injury. At the end of the mission, you suffer unavoidable instant death." },
				{ id: "asphalt-jungle", name: "Asphalt Jungle",
					text: "The first time you meet someone that a previous NPC has mentioned to you, gain +1D on the first action to connect with or interrogate them." },
				{ id: "maltese-falcon", name: "Maltese Falcon",
					text: "Actions made to pass yourself off as a private investigator are never hard." }
			]
		},
		{
			id: "puritan",
			name: "Puritan",
			source: "harpocrates",
			requires: null,
			look: { paper: "stamp", accent: "#141414", tape: "#f4f1ea" },
			image: "img/harpocrates/agenda-puritan.png",
			items: [
				{ text: "Be free of sin", bold: false },
				{ text: "Dirty your hand", bold: true }
			],
			abilities: [
				{ id: "unsightly", name: "Unsightly",
					text: "At mission start, any sin marks you currently have are fully covered or concealed, and cannot be revealed against your will." },
				{ id: "punishment-engine", name: "Punishment Engine",
					text: "Whenever you gain exactly 1 sin while you have 0 sin, you may take 2 non-lethal stress to gain no sin instead." },
				{ id: "filth-destroyer", name: "Filth Destroyer",
					text: "Gain +1D to harm traces or drifters that have dealt you an affliction." },
				{ id: "proselytize", name: "Proselytize",
					text: "At the start of each mission, pick one exorcist to temporarily grant your unbolded agenda item to. Every session they fulfill that agenda item, you relieve 1 sin." },
				{ id: "valley-of-the-shadow", name: "Valley of the Shadow of Death",
					text: "You may choose to add a -2 to a resist roll you make before rolling. Each time you do, permanently reduce your stress cap by 1." }
			]
		},
	];

	var blasphemies = [
			{
				id: "hysteria",
				numeral: "",
				source: "harpocrates",
				group: "Untempered",
				theme: { color: "#2fe38a", color2: "#0f6b3f", dark: true },
				image: "img/harpocrates/blas-hysteria.jpg",
				name: "Hysteria",
				summary: "Release the madness that lurks in everything. Take off the mask.",
				flavor: "Release the madness that lurks in everything. Take off the mask.\nCASTLE Policy 782: Responsibility over exorcists with the Hysteria blasphemy may be transferred to TEMERITY subdivision-[redacted] in the event of [redacted]mania manifesting and spreading to other exorcists at any point. Re-transfer to CASTLE is not required.\nCommon in: personality disorders; mass psychogenic illness; mania.",
				passive: {
					id: "delirium", name: "Delirium",
					text: "Your Hysteria powers do not end early when you use a different power with the curse tag. Up to 1+1/2 CAT times per rest, when someone under the effects of one of your Hysteria powers is within short range of another valid target and you can see both of them, you may attempt to roll PSYCHE. On a success, the current effects of that power affect the new target without needing to spend an additional burst or reroll PSYCHE against unwilling targets. Whenever you trigger this successfully, gain 1 sin and the Apostasy hook."
				},
				powers: [
					{ id: "fugue", name: "Fugue",
						tags: { duration: "1 scene, 1/scene", effect: "Curse", range: "Long" }, burst: "onSuccess",
						text: "Reach into a living being's psyche and rip off their inhibition, rolling PSYCHE if a target is unwilling and only spending a psyche burst on a success. They lose control as you take off the mask. That target's current primary emotion causes them to go into a fervent state, and for the rest of the scene they gain up to 1/2 CAT ({halfcat}) of the following effects:\n- They lose the ability to focus on specific or complicated tasks.\n- Any other supernatural effects impacting their free will or decision making are temporarily nullified.\n- They cannot be incapacitated and do not feel pain.\n- They begin to dance fervently and uncontrollably.\nThis power may easily affect the parameters of rolls, such as difficulty and risk." },
					{ id: "delude", name: "Delude",
						tags: { duration: "Entire hunt, 1/rest", effect: "Curse", range: "Short" }, burst: "required",
						text: "You insert a single idea into the target's beliefs that slowly becomes a source of delusion. This sentence must follow the sentence structure below, and you can only add a total of 3 words between both blank areas:\nYour ____ is/are ____.\nEx: Your friends are deceiving you. Your arm is not real. Your house is on fire.\nWhen you first supplant this idea to the target, they may deem the thought as improbable or unlikely. When the pressure rises, this idea may cause the target to act irrationally, as if the idea they were given is a certain truth.\nIf you fully slash the Apostasy hook while someone is under the effect of this power, the target(s) undergo full blown mania, and may harm themselves or others over this idea. Rolls within a short range of the target become risky by default.\nThis power may easily affect the parameters of rolls, such as difficulty and risk." },
					{ id: "harlequin", name: "Harlequin",
						tags: { duration: "1 scene", effect: "Curse", range: "Short" }, burst: "onSuccess",
						text: "You put on a convincing performance or rhetoric and distort your target's sense of reality temporarily. Roll PSYCHE if the target is unwilling, only spending a psyche burst on a success. Select yourself, another living being, or an object within range to be your Red Herring. Select one of the following effects:\n- The target finds the Red Herring deliriously funny or hilarious.\n- The target becomes unreasonably upset or angry at the Red Herring.\n- The target becomes irrationally fearful or scared of the Red Herring.\nGain or grant +1D to the next action that takes advantage of this power. This power may easily affect the parameters of rolls, such as difficulty or risk." },
					{ id: "infect", name: "Infect",
						tags: { duration: "Until rest", effect: "Transmute", range: "Adjacent" }, burst: "multiple",
						text: "Instill a lingering psychic virus into an object or living being that you can detonate at any moment. While the target you have touched is within CAT+2 range ({cat+2:range}) of you, you know where they are and can see what is in its immediate vicinity. If the target touches or is touched by another potential target, you may trigger the Delirium passive and roll PSYCHE with +1D to attempt to spread it.\nTo detonate the virus, select one of your powers with the curse tag and trigger it on every valid infected target regardless of their current range to you. For every target affected beyond the first, spend a psyche burst or gain 1d3 sin. You cannot enhance powers used this way through additional bursts, passives, or other abilities.\nThis power may easily affect the parameters of rolls, such as difficulty and risk." },
					{ id: "outburst", name: "Outburst",
						tags: { duration: "1 scene", effect: "Curse", range: "Short" }, burst: "onSuccess",
						text: "Pick a target within range. Roll PSYCHE if the target is unwilling, only spending a psyche burst on a success. The target bursts into a cry of uncontrollable emotion. They cannot move faster than a slow crawl from their current location and find it difficult to take deliberate actions without struggle. They also become loud and obvious to anything else that can naturally detect them (graceless beings will not hear or see a Sin under this effect).\nThis effect ends early on a hostile target if that target takes 3 or more slashes on its execution talisman.\nGain or grant +1D when you or any ally next acts to take advantage of this power. This power may easily affect the parameters of rolls, such as difficulty and risk." }
				],
				extras: [
					{ title: "Apostasy (hook)", text: "Some of your powers may interact with this hook. When this hook fills up, gain the agenda item \"Do something risky, regardless of the consequences\". If you did not fulfill this agenda at the end of a session, take 1d3 sin. At the end of a mission roll 1d6. On a 4+, you may remove the agenda item and effect.\nIf you fill this hook again after it has been filled once and its agenda item hasn't been removed, you gain the following condition:\nPsychosis: Gain +1D on rolls when they are both risky and hard. When the Admin rolls a 2 or lower on the risk die against your actions, it is always much worse than expected, is treated as a 1, and may trigger severe attacks from the Sin. Participating in teamwork has a 1 in 6 chance of afflicting any of your allies who participated in that teamwork with the Apostasy hook.\nRemove this condition after you rest or at the end of the current mission." }
				]
			},
			{
				id: "guilt",
				numeral: "",
				source: "harpocrates",
				group: "Untempered",
				theme: { color: "#2fe38a", color2: "#0f6b3f", dark: true },
				image: "img/harpocrates/blas-guilt.jpg",
				name: "Guilt",
				summary: "You are used to failure. It is your greatest shame. It is your sharpest blade.",
				flavor: "You are used to failure. It is your greatest shame. It is your sharpest blade.\nRestricted fact: The Guilt blasphemy manifests in only 0.0[redacted]% of exorcists who fail their initial training, making this blasphemy rare and special. This statistic is not made known to Guilt users for risk of nullifying, dampening, or restricting their power.\nAt the admin's discretion, if you would ever take repetitive or pointless actions with the intent to fail, you automatically fail that action without rolling. This prevents that action from generating pathos or triggering any of your abilities. There is no light at the end of the tunnel.\nCommon in: survivor's guilt; abuse victims; severe low self-esteem.",
				passive: {
					id: "burden", name: "Burden",
					text: "Your failure and psyche are inextricably linked. Whenever you attempt to spend a psyche burst on a Guilt power, you may choose to clear all pathos and empower that ability based on the amount of pathos cleared:\n- 1: Gains its burden effect.\n- 2: Gains +1D to roll for PSYCHE.\n- 3: Gains +1 CAT.\nYou no longer clear pathos between sessions, but also lose access to Divine Agony."
				},
				powers: [
					{ id: "heavy", name: "Heavy",
						tags: { duration: "1 scene", effect: "Transmute", range: "Short" }, burst: "required",
						text: "You temporarily increase the weight of an object as if it were +1 CAT larger in size. You may only target objects equal to your CAT size ({cat:size}) or lower. Roll PSYCHE for creative uses of this power.\nGain or grant +1D when you or an ally next acts to take advantage of this power.\nBurden: The weight of the target is treated as if it were an additional +1 CAT larger in size for each pathos spent this way. Gain or grant an additional +1D when you or an ally next acts to take advantage of this power.\nThis power may easily affect the parameters of rolls, such as difficulty and risk." },
					{ id: "collapse", name: "Collapse",
						tags: { duration: "1 scene, 1/scene", effect: "Transmute", range: "CAT area ({cat:area})" }, burst: "none",
						text: "Trigger this power in response to when you take an action with no successes, applying the indicated effect to everything in a CAT area ({cat:area}) around you that moves with you:\n- Fix, use, break into, or handle an object: Every manufactured or man-made object of CAT size ({cat:size}) or smaller falls apart into their individual pieces, and cannot be put back together for the rest of the scene, through supernatural means or otherwise.\n- Escape, inflict harm, move quickly, or fight: Every being including you doubles in density, becoming heavy, and must take great effort to physically move from place to place.\n- Convince, connect, investigate, or intimidate: Every mundane being in range becomes despondent and depressed, unable to gather the effort to take difficult or strenuous actions.\nThis power's CAT cannot be increased above your base CAT. Gain or grant +1D whenever you or an ally act to take advantage of this power while it is active. This may also make certain actions hard by default for you or your allies." },
					{ id: "fizzle", name: "Fizzle",
						tags: { duration: "1 scene, 1/rest", effect: "Curse", range: "CAT area ({cat:area})" }, burst: "required",
						text: "You cause the actions of yourself and humans within a CAT area ({cat:area}) to be prone to failure for the rest of the scene. This area moves with you. Affected individuals find it impossible to win things based on chance, surpass others, or perform at a level above mediocre at any given task. This power may easily change the parameters of rolls, such as difficulty or risk.\nBurden: For every pathos spent on this power, you may target a specific human in the middle of an important action, such as taking aim with a firearm, or making a speech, and cause that action to fail spectacularly. If you would deplete all of your pathos upon activating Burden, all rolls you make for the remainder of the scene are hard by default." },
					{ id: "martyr", name: "Martyr",
						tags: { duration: "Instant, 1/scene", range: "CAT range ({cat:range})" }, burst: "required",
						text: "You attempt to redirect a threat or harmful action about to occur that you can see in CAT range ({cat:range}) that targets another being, suffering all effects the intended target(s) would have suffered. Roll PSYCHE, gaining +1D on this roll for each of the following questions you can answer \"yes\" to:\n- Are you directly atoning for a previous mistake through this action?\n- Can you put yourself between the harm and who you're protecting in time?\nYou suffer -1 stress from the redirected harm for every success on this roll (max -2). You cannot trigger this ability to redirect severe attacks.\nBurden: Any stress dealt to you in this way becomes non-lethal." },
					{ id: "blame", name: "Blame",
						tags: { duration: "Instant, 1/rest", range: "Self" }, burst: "required",
						text: "When something goes wrong due to someone's actions within CAT range ({cat:range}), you may supernaturally change the order of events so that you are somehow at fault. No one except you remembers the original course of events.\nGain or grant +1D when you or an ally next acts to take advantage of this happening. This may easily change the parameters of rolls (such as difficulty or risk), or influence moves taken against the exorcists to disproportionately target you: Send police specifically after you, become a new grudge target, etc.\nBurden: Any complication talisman caused by this action gains +1 segment, but you and you alone gain +1D on all actions to deal with that complication." }
				]
			},
			{
				id: "revulsion",
				numeral: "",
				source: "harpocrates",
				group: "Untempered",
				theme: { color: "#2fe38a", color2: "#0f6b3f", dark: true },
				image: "img/harpocrates/blas-revulsion.jpg",
				name: "Revulsion",
				summary: "An aura of disgust surrounds you. Push away everyone and everything.",
				flavor: "An aura of disgust surrounds you. Push away everyone and everything.\nFact: Users of this blasphemy have a low survival rate, usually dying due to risks or dangers associated with being alone in the field. Body retrieval rate of Revulsion users is extremely low.\nCommon in: anti-social personality disorder; agoraphobia.",
				passive: {
					id: "putrid", name: "Putrid",
					text: "Your psychic presence triggers a deep instinctual avoidance response in all humans, exorcists, and supernatural beings around you. When within arm's reach of you, all other Exorcists may not use Set-Up or Teamwork to assist you. You are immune to effects that would force you to psychically or physically connect with another being.\nIf half or more of your sin boxes are slashed, supernatural beings may avoid actions or movement that puts them within a short distance of you."
				},
				powers: [
					{ id: "contaminate", name: "Contaminate",
						tags: { duration: "1 scene", effect: "Transmute", range: "Long" }, burst: "required",
						text: "You ruin the sanctity of a space for living beings, making it feel agonizingly unclean. Select a CAT+1 area ({cat+1:area}) within range. Living beings of your choice no longer feel comfortable in that space, hesitant to touch anything, including the floors or walls. This may hinder the movement of a supernatural being, or prevent humans from wanting to enter certain locations.\nGain or grant +1D when you or an ally next takes advantage of this power. This power may easily affect the parameters of rolls, such as difficulty and risk." },
					{ id: "repel", name: "Repel",
						tags: { duration: "1 scene, 1/scene", effect: "Charm", range: "Self" }, burst: "required",
						text: "Imbue yourself with an intolerable field of antipathy for the rest of the scene, which pushes away all exorcists, humans, and sins within up to a CAT area ({cat:area}) centered on you. An allied exorcist may attempt to grab onto something nearby as you trigger this power. Other Revulsion users, anomalies, and sins born from a deep sense of isolation are immune to this effect.\nThe force of this push is oppressive, and all beings under the effect of this power find it hard to approach you unless assisted, such as with a car or vehicle, or another source of opposing force. Exorcists, humans, and minor sins (traces) within a 1/2 CAT area ({halfcat:area}) of you find it nearly impossible to approach you, as this force goes from oppressive to unbearable. If the results of this would be risky, unclear, or inflict harm, roll PSYCHE.\nGain or grant +1D to yourself or an ally that can take advantage of this power while it is in effect. This power may easily affect the parameters of rolls, such as difficulty and risk, but also make certain actions hard or impossible as outlined above.\nAttempting to focus on or use other powers becomes hard by default while this power is active. This power ends early if you take an injury." },
					{ id: "isolate", name: "Isolate",
						tags: { duration: "Until rest", effect: "Curse", range: "Short" }, burst: "required",
						text: "Temporarily transfer your psychic antipathy to another target. For the duration of this effect, nullify the effects of the Putrid passive. All other living beings perceive the target as disgusting while within CAT range ({cat:range}) of them, and will not listen to or willingly assist them while within that range.\nThis may cause Cultists to waver in their faith, Myrmidons to attack the wrong targets, or humans to start ostracizing another individual. This easily affects the parameter of rolls, such as difficulty and risk.\nWhenever the tension increases, roll PSYCHE. On a failure, this effect ends early." },
					{ id: "spew", name: "Spew",
						tags: { duration: "Instant, 1/scene", range: "Short" }, burst: "required",
						text: "You curdle the mental state of a being who can perceive you. Force a target within range to forcibly eject things from within them that they cannot stomach, either physically or mentally. For mental attributes, they are said aloud in a forced and frantic way, as if vomiting. Select a number of the following equal to your 1/2 CAT ({halfcat}):\n- The contents of their stomach.\n- A guilty memory or secret.\n- Their worst fear and/or what they find the most disgusting.\nGain or grant +1D when you or any ally next acts to take advantage of each answer." },
					{ id: "overwhelm", name: "Overwhelm",
						tags: { duration: "1 scene", effect: "Curse", range: "CAT range ({cat:range})" }, burst: "required",
						text: "Assault the senses of a target within range on both a physical and mental level. Pick two of the following:\n- Sight\n- Smell\n- Hearing\n- Touch\n- Taste\nUntil the end of the scene, the target cannot rely on the selected senses, overwhelmed by an influx of adverse sensations. This distorts their senses, but does not remove them entirely.\nYou may gain or grant +1D when you or any ally next acts to take advantage of this power." }
				]
			},
			{
				id: "valence",
				numeral: "",
				source: "harpocrates",
				group: "Untempered",
				theme: { color: "#f4ec1c", color2: "#8a8400", dark: true },
				image: "img/harpocrates/blas-valence.jpg",
				name: "Valence",
				summary: "Control the bonds between everything and everyone.",
				flavor: "Control the bonds between everything and everyone.\nValence testing log results VL283: Gold -> Lead. A:8M:2B:4E:5R:7 -> A:1M:9B:0E:1R:2. Sin host: [redacted] -> [redacted].\nCommon in: compulsive need for control; grandiose delusions.",
				passive: {
					id: "adept", name: "Adept",
					text: "When you use a power with the Transmute tag, you may take 2 stress to increase the CAT of that power by 1. If you do, gain the Hubris hook."
				},
				powers: [
					{ id: "catalyze", name: "Catalyze",
						tags: { duration: "Instant, 1/scene", range: "CAT range ({cat:range})" }, burst: "required",
						text: "Psychically remove the space between \"now\" and \"then\", and accelerate the inevitable. You can speed up or begin any \"reaction\" (chemical, kinetic, emotional) within CAT distance ({cat:range}), to various effects. Pick one of the following options and describe your intended course of action, to which your admin determines its final effects:\n- Heat: Jump start a potential reaction that normally requires a trigger or long period of time. This can trigger and potentially combust dormant materials such as gunpowder, fuel, or batteries. It may also remove an individual's hesitation, causing someone on the verge of acting or speaking to follow through immediately, bypassing doubt or fear.\n- Chain: Accelerate the strength and propagation of an active reaction. Explosions, bullets, and chemical reactions are violently accelerated and may increase in force or effect. Mild acids accelerate into active corrosives. When applied to a living being it amplifies a current state of reaction, turning fear into panic, a moment of relief into full relaxation, or a spike of adrenaline into dizzying stress or excitement.\nThis may easily affect the parameters of rolls, such as difficulty or risk, and may be used alongside the actions of you or your other allies if relevant." },
					{ id: "dissolve", name: "Dissolve",
						tags: { duration: "Until rest", effect: "Curse", range: "CAT range ({cat:range})" }, burst: "required",
						text: "Disintegrate the bonds between anybody temporarily. Select two targets that know each other within CAT range ({cat:range}). Other exorcists, binders, humans, sins, and traces are all valid targets, including dead ones.\nUntil you rest, the two targets forget everything they know and remember about each other, as if they had never met. This temporarily pauses psychic hooks afflicted by sins or traces until they are encountered again, severs someone's psychic connection to someone else, and makes the target's faces and voices unfamiliar to one another.\nAfter you rest, both target's memories return to normal and all effects of this power end.\nYou are a valid target for this power. If you choose yourself as a target, you may not end this effect early.\nDissolve optional rule: When used on two allied exorcists, this may temporarily reduce the bond between them to B-rank while this power is in effect (exorcist bonds are a system from Glory Unto Them, a supplement by Rowan A.). If they would fully slash their bond talisman before this power ends, it ends early." },
					{ id: "temper", name: "Temper",
						tags: { duration: "1 scene", effect: "Transmute, Curse" }, burst: "required",
						text: "Alter the strength and rigidity of emotions and objects alike. You may choose to target a CAT amount ({cat}) of people within range or an object equal to your CAT size ({cat:size}) or smaller. Apply one of the following effects:\n- Brittle: A being's current emotion becomes less intense, more prone to change from external influences, and less impact on the decisions of that being. An object becomes extremely brittle, and easier to destroy or break, anything thin with any weight on it may suddenly break or shatter.\n- Harden: A being's current emotion becomes more intense, harder to get rid of or change moods from, and becomes more impactful on the decisions of the target. An object becomes dense and durable, much harder to destroy or break, and can withstand more force than it normally would.\nThis power may easily affect the parameters of rolls, such as difficulty and risk." },
					{ id: "alchemy", name: "Alchemy",
						tags: { duration: "1 scene", effect: "Transmute", range: "Touch" }, burst: "required",
						text: "Change the composition of anything you can touch. Touch an object that is equal to your CAT size ({cat:size}) or smaller. You may choose to change one material of that object [the copper in an electronic device, water in a cup, the metal of a car, etc.] and change it into one of the following at the same temperature of the original material:\n- Gold, Iron, Water, Glass, Oxygen, Mercury, Salt, Aluminum\nThen gain the Hubris hook. This power may easily affect the parameters of rolls such as difficulty or risk. You may choose a material not on this list (which the Admin must approve) by slashing the Hubris hook. Based on the rarity or danger of the material you choose, the Admin may either slash your Hubris hook again, slash it twice, or fill it out completely." },
					{ id: "fuse", name: "Fuse",
						tags: { duration: "1 scene", effect: "Transmute", range: "Short" }, burst: "onSuccess",
						text: "Bond any surface to another on a molecular and psychic level. Select 2 targets, which can be either objects or beings, which must be in contact with each other when you use this power. Roll PSYCHE when targeting one or more unwilling targets, only consuming a psyche burst on a success.\nYou fuse the point of contact between the two targets. While fused, nothing can remove the surfaces from one another until the end of the scene. However, this does not render either target indestructible or immune to harm.\nGain or grant +1D when you or any ally next acts to take advantage of this power." }
				],
				extras: [
					{ title: "Hubris (hook)", text: "When this hook fills up, you gain the Hubris condition. Whenever you use one of your Transmute or Valence powers, it can no longer be dismissed early, and the Admin may:\n- Make it select another valid target within range of you.\n- Select a different Transmute or Valence power you possess on your intended target. (The Admin chooses the effects of the new power.)\n- Reduce its CAT to 0.\nAfter the Admin takes this action, remove this condition." }
				]
			},
			{
				id: "roar",
				numeral: "",
				source: "harpocrates",
				group: "Untempered",
				theme: { color: "#f4ec1c", color2: "#8a8400", dark: true },
				image: "img/harpocrates/blas-roar.jpg",
				name: "Roar",
				summary: "Manipulate the vibrations between the air as a conductor commands an orchestra.",
				flavor: "Manipulate the vibrations between the air as a conductor commands an orchestra.\nCASTLE complaint log T82: Get agent [redacted] to stop making noise past curfew. I woke up with my ears bleeding today despite being stationed over 5000 ft away from them. It's ridiculous. CASTLE response: Earplugs and sleeping kit are available for 1 scrip from our provisions office.\nCommon in: previous Idol hosts; sensory aversions; neglected youth.",
				passive: {
					id: "sensitive", name: "Sensitive",
					text: "You can hear the minute details of everything you focus on up to 1/2 CAT distance ({halfcat:range}) from you, ranging from the pace of a heartbeat to the weight of footsteps. Some of your powers grant you the Tinnitus hook."
				},
				powers: [
					{ id: "concuss", name: "Concuss",
						tags: { duration: "Instant, 1/scene", range: "CAT range ({cat:range})" }, burst: "onSuccess",
						text: "Create an amplified sound that causes a concussive blast in a line equal to your CAT range ({cat:range}) that bounces off flat surfaces. This blast of sound shatters glass or other fragile materials, and deafens beings that it hits for a few seconds. Roll PSYCHE for its effects, only spending a psyche burst on a success. Gain +1D on this roll for every \"yes\" you can answer to the following questions:\n- Are you able to project your voice through an amplifying sound system, such as a speaker or microphone?\n- Are you in an area with good acoustics, such as an amphitheater, stairwell, subway underpass, etc?\nIf you answered \"yes\" to both questions, the area of effect upgrades from a line to affecting everything in CAT+2 area ({cat+2:area}). Allies caught in this enhanced area take 2 non-lethal stress unless covering their ears preemptively or wearing ear protection.\nYou may take the Tinnitus hook if you answer \"no\" to a question, changing that answer to a \"yes\" instead." },
					{ id: "ring", name: "Ring",
						tags: { duration: "1 scene", effect: "Transmute", range: "CAT+1 range ({cat+1:range})" }, burst: "required",
						text: "For the rest of the scene, you can cause anyone in range to hear the voices of you or your allies, even if they would not normally be able to hear them, due to distance, physical obstacles, or otherwise.\nThis does not work on deafened individuals or those in hermetically-sealed locations. You only need to know what a recipient sounds like in order to ring them. You may increase the CAT range of this power by +2 by taking the Tinnitus hook.\nThis may easily change the parameters of rolls, such as difficulty or risk." },
					{ id: "chorus", name: "Chorus",
						tags: { duration: "1 scene", effect: "Curse", range: "Long" }, burst: "required",
						text: "Change the point of origin for the sounds of objects up to CAT size ({cat:size}) or living beings within range. Select one of the following effects:\n- Harmonize: Pick a living being or any object with a sound system (smart device, speaker, etc.) within range. A living being loses the ability to speak freely. Instead, whatever you say is also projected from their mouth using your voice. An object now projects your voice while you're speaking.\n- Swap: Swap the \"sounds\" of any two targets. A gun and a window as targets would make the window produce a gunshot when slammed shut, and the gun make the sound of a window slamming when fired. A dog and a plastic bag may cause the bag to bark when shaken, or the dog to only make light rustling sounds through its mouth.\nGain or grant +1D when you or an ally next acts to take advantage of this power. This may easily affect the parameters of rolls, such as difficulty or risk." },
					{ id: "resonate", name: "Resonate",
						tags: { duration: "1 scene", effect: "Charm" }, burst: "required",
						text: "Temporarily improve your hearing capabilities, and increase the range of your passive to CAT+1 ({cat+1:range}) for the rest of the scene. You may also select certain phrases, sounds, or keywords that when made or spoken within this range, you automatically focus on. You also naturally echolocate, allowing you to perceive shapes, forms, or dimensions within that range while using your passive.\nYou may gain or grant +1D when you or any ally next acts to take advantage of this power. This may easily affect the parameters of rolls, such as difficulty or risk. If you are the target of a particularly powerful sound-based attack, you take the Tinnitus hook and end this power early." },
					{ id: "tune", name: "Tune",
						tags: { duration: "1 scene", effect: "Transmute", range: "CAT area ({cat:area})" }, burst: "required",
						text: "Forcibly alter the vibrations of the world in a CAT area ({cat:area}) centered on yourself. While this effect is active you may apply any of the following effects to a living being or object of CAT size ({cat:size}) or smaller within range:\n- Volume: Completely silence a target for the duration. Alternatively, you can choose to increase the volume of a target to up to three times its original volume.\n- Dissonance: Exert powerful vibrations into the target, causing it to seize up and shake violently. This may disrupt, damage, or hinder targets.\n- Echo: You force a target to repeat the last sound it made within range on a loop (ie. a phrase, a scream, a loud impact, a gunshot, etc.)\nEvery time you trigger an effect beyond the first, gain the Tinnitus hook. Gain or grant +1D when you or an ally next acts to take advantage of an effect each time you trigger one. This may easily change the parameters of rolls, such as difficulty or risk." }
				],
				extras: [
					{ title: "Tinnitus (hook)", text: "When this hook fills up, gain the Tinnitus condition: You become deaf. You immediately end and cannot use any of your Roar powers, and actions that rely on hearing without teamwork or set-up are always hard. Remove this condition at the end of the scene." }
				]
			},
			{
				id: "witness",
				numeral: "",
				source: "harpocrates",
				group: "Untempered",
				theme: { color: "#f4ec1c", color2: "#8a8400", dark: true },
				image: "img/harpocrates/blas-witness.jpg",
				name: "Witness",
				summary: "Bear witness to everything. Even the things not meant to be seen.",
				flavor: "Bear witness to everything. Even the things not meant to be seen.\nActively monitored: Due to the inability to effectively decommission Witness users through amnestics, SEER actively monitors all Witness users. Yellow is most likely the first color that the human eye perceives after birth.\nCommon in: moral OCD, compulsive desire for truth; loved one with degenerative disease.",
				passive: {
					id: "xanthous", name: "Xanthous",
					text: "Your memories cannot be erased or manipulated by effects or powers outside of your own. At any point, you may choose to \"recall\" a previous location or space you were in by gaining the Cognito Hook. You may investigate or ask the Admin for specific details of that scene (at the moment you were last present) as if you were physically there. Some of your powers interact with the Cognito Hook."
				},
				powers: [
					{ id: "sanctify", name: "Sanctify",
						tags: { duration: "Entire hunt, 1/hunt" }, burst: "required",
						text: "You must spend 5 minutes of focused concentration to use this power before it activates. Sanctify a single building or distinct space (park, venue, etc.) of up to a 1/2 CAT + 2 area in size. This effect does not move with you. For the duration of this effect, you now know:\n- Who is within that space, although not their exact location or specific details. (You know the approximate number of humans in the space, but not their names. You may know if a supernatural entity is here, but not if it is the sin or a drifter. Etc.)\n- When something or someone enters or leaves, but not from where within range they enter or leave from.\n- The location of any exits or entrances in that space, and what path to take to return to this space no matter where you are in the investigation area.\n1/scene while this power is active, you may whisper a human or exorcist's real name from anywhere in the investigation zone. If they are within your sanctified area, they turn as if hearing you from behind them, and you immediately see their current immediate surroundings. Then gain the Cognito Hook if you discovered someone's location this way. This power may easily affect the parameters of rolls, such as difficulty or risk." },
					{ id: "glare", name: "Glare",
						tags: { duration: "Instant, 1/scene", range: "Short" }, burst: "required",
						text: "You create a flash of blinding light at any point within range. This is disorienting to living beings that rely on sight within a CAT range ({cat:range}) of the light. Roll PSYCHE for creative uses of this power, and gain or grant +1D to you or an ally that next takes advantage of this power.\nAdditionally, the location that you used this power in can be freely recalled through your passive until rest without slashing the Cognito hook.\nThis power may easily affect the parameters of rolls, such as difficulty and risk." },
					{ id: "confessional", name: "Confessional",
						tags: { duration: "1 scene, 1/scene", range: "Short" }, burst: "required",
						text: "Target a human or exorcist in range who can perceive you in some way. For a few moments, you can both clearly hear and see each other regardless of the environment or other psychic effects. Make a PSYCHE roll. For every success, you may ask the target one of the following questions to which they feel compelled to answer truthfully, but may still answer through lies of omission or other loopholes. For every die that does not result in a success, the target asks you a question of their choice from the list below, to which you feel equally compelled to answer:\n- \"What do you truly care about right now?\"\n- \"How have you hurt someone you love?\"\n- \"When and how did you last sin?\"\nThis power ends as soon as all questions are answered. This may easily change the parameters of rolls, such as difficulty or risk. Gain or grant +1D to any actions you make that can take advantage of each answer that is shared." },
					{ id: "chant", name: "Chant",
						tags: { duration: "1 scene, 1/scene", effect: "Curse", range: "CAT area ({cat:area})" }, burst: "required",
						text: "You begin to mumble and whisper a stream of unnerving knowledge in subtle tone, audible within up to a CAT area ({cat:area}) around you, which only sins and the subconscious of the human mind can perceive. The feeling this invokes is similar to the anxiety one experiences when someone knows something about them that they shouldn't. Attempting to speak coherently or being silenced in any way ends this power early.\nThis cannot inflict harm, but is disorienting and severely distracting, interrupting the stream of coherent thought of anyone affected. Roll PSYCHE for creative uses of this power, gaining +1D for each slash on your Cognito hook for the first time you roll. Alternatively you may gain +1D for each trauma question you've successfully leveraged against the sin if making a PSYCHE roll involving or targeting the sin the first time you roll. This power may easily affect the parameters of rolls, such as difficulty or risk." },
					{ id: "redact", name: "Redact",
						tags: { duration: "Until rest", effect: "Transmute", range: "CAT+1 range ({cat+1:range})" }, burst: "required",
						text: "Temporarily remove one piece of information from the minds of everything and everyone within range. You may redact:\n- A name.\n- A location.\n- A certain individual's action.\n- A death.\n- Any other simple piece of information that can be mentioned in one sentence, at the approval of your Admin.\nBeings under the effect of this power have this information seamlessly blocked in their mind, unable to recall or identify the piece of missing information. Then gain the Cognito hook. Gain or grant +1D to you or an ally that next takes advantage of this power. This may easily affect the parameters of rolls, such as difficulty or risk.\nThis effect ends early if you take an injury. This may temporarily render the answer to trauma question unusable for the duration." }
				],
				extras: [
					{ title: "Cognito (hook)", text: "When this hook fills out, your brain begins to bleed from overexertion. For the rest of the scene, using any of your psychic abilities or performing a complicated mental task is hard by default, and at the end of the scene you suffer an injury. You can suffer 6 non-lethal stress instead by touching a mundane human in adjacent range before the scene ends. This transfers some of your mental strain onto them, causing them to experience cranial hemorrhaging and possible death." }
				]
			},
		{
			id: "physic",
			numeral: "",
			source: "harpocrates",
			group: "Untempered",
			theme: { color: "#ff1fe6", color2: "#8a0f7e", dark: true },
			image: "img/harpocrates/blas-physic.jpg",
			name: "Physic",
			summary: "Remove the pain, the wounds, and even the scars.",
			flavor: "Remove the pain, the wounds, and even the scars.\nFact: The Physic blasphemy was registered into the Harpocrates dossier due to lack of substantial research for reliable field use. See incident: X-87 Smother testing log.\nCommon in: work in the medical field; PTSD; physical illness.",
			passive: {
				id: "bloodhound", name: "Bloodhound",
				text: "Within CAT+2 ({cat+2:range}) distance, you always know where an allied Exorcist is if they have at least 1 injury. You gain +1D on actions to track enemies with half or more of their execution talisman slashed. Some of your powers grant you or the target the Necrosis hook."
			},
			powers: [
				{ id: "mend", name: "Mend",
					tags: { duration: "Instant", effect: "Transmute" }, burst: "required",
					text: "You repair any broken object that is your CAT size ({cat:size}) or smaller. You must know what the object looked like before it was destroyed or broken. Mundane humans that have seen this happen are convinced that the object was never broken in the first place, and will not be suspicious of you.\nYou may gain or grant +1D when you or any ally next acts to take advantage of this power." },
				{ id: "remove", name: "Remove",
					tags: { duration: "Until rest", effect: "Curse", range: "CAT range ({cat:range})" }, burst: "required",
					text: "Remove an aspect of pain or trauma from a human or exorcist of your choice. This seamlessly removes a traumatic or painful memory that you are aware of from your target until rest. This may easily affect the parameters of rolls, such as difficulty or risk.\nAlternatively, once per hunt, you may use this power when both of the following conditions have been met:\n- You meet at least 1 requirement for the Nail of Abel.\n- You know one correct answer to a Trauma question that you have not used to counter a reaction yet. This power fails and refunds a burst if the answer you have is incorrect, and cannot be attempted again until after your next rest.\nYou erase a memory of an intense trauma that the Sin was born from. Remove 2 slashes on the Sin's execution talisman if possible, then the admin selects 1 domain the sin has access to (picking the one that best matches or narratively coincides with the removed trauma if possible). The sin may not use abilities or powers granted to it by that domain until rest.\nYou may no longer use the selected trauma question to counter this sin's reaction until this power ends. The sin ends this power early when you encounter it in its palace, as its memories flood back to it; you may suppress this for a round by slashing the Necrosis hook twice." },
				{ id: "cure", name: "Cure",
					tags: { duration: "Instant", range: "Short" }, burst: "required",
					text: "You rearrange and revert the physical traumas on a CAT group ({cat:people}) of humans, an exorcist, or a supernatural target in range. When targeting an allied exorcist, roll for PSYCHE, adding 1d3 to the total number of successes. Remove that number of stress from the target. If this would overheal (reduce the number of slashes below 0) you may choose to remove an injury from the target and continue removing stress as if the talisman was fully slashed. Removing an injury this way grants the Necrosis hook to your target. You may only use this on an allied exorcist once per rest.\nWhen targeting a CAT group of humans instead, you instantly cure them of any psychic phenomenon affecting them, along with all physical ailments and injuries. These effects return to them at the end of the scene.\nWhen targeting non-player supernatural being or enemy exorcist, add 1/2 CAT ({halfcat}) segments to their execution talisman. The next time that NPC would take a reaction, they falter as their healing comes undone, rolling the risk die twice and choosing the higher result." },
				{ id: "wound", name: "Wound",
					tags: { duration: "Instant, 1/scene", range: "Short" }, burst: "required",
					text: "Reverse the flow of your healing abilities and pull on broken threads, creating devastating entropic wounds. This instantly kills mundane humans, leaving them with lesions, cut marks, or any injuries of your choice. When targeting a supernatural creature, roll PSYCHE for damage as you deteriorate and injure a section of your target's physical form. This power gains +1D for each of the following questions you can answer \"yes\" to (max +3D).\n- Are you able to touch a part of your target that is vital or important to them?\n- Have you previously healed or used healing abilities on the target?\n- Are you willing to rip yourself to pieces to Wipe the Stain? (Gain the Necrosis hook if you answer \"yes\")" },
				{ id: "synchronize", name: "Synchronize",
					tags: { duration: "1 scene, 1/rest", effect: "Curse", range: "Long" }, burst: "onSuccess",
					text: "Select up to two targets in range that you have touched before: which could be yourself, an exorcist, sin, or human, rolling PSYCHE if any target is unwilling and only spending a burst on a success. You connect the physical sensations of both targets to each other for the rest of the scene. This results in the following:\n- If one target feels pain, the other feels pain in the exact same location with the same intensity without being physically harmed.\n- The targets can feel existing wounds, pains, or weak points on each other's bodies, and can accurately identify them through this feeling.\n- Unexpected sensations may catch a target off-guard or stagger them.\nYou may gain or grant +1D when you or any ally next acts to take advantage of this power. This may easily affect the parameters of rolls, such as difficulty or risk." }
			],
			extras: [
				{ title: "Necrosis (hook)", text: "Your psychic abilities reject the natural order. When this hook fills up, things return to how they should have been.\n- Your previous wounds or injuries begin to open up again. Roll the fate die and take (1): 5 stress, (2-3): 4 stress, (4+): 4 non-lethal stress.\n- Roll two dice, taking the lower result for a permanent scar that resembles stitches burst open on your (1d6): 1 Neck, 2 Elbows, 3 Wrists, 4 Knees, 5 Ankles, 6 Spine.\nRolling double 1's will result in instant death, as your tendons snap and your body falls apart from the strain." }
			]
		},
		{
			id: "severed",
			numeral: "",
			source: "harpocrates",
			group: "Untempered",
			theme: { color: "#ff1fe6", color2: "#8a0f7e", dark: true },
			image: "img/harpocrates/blas-severed.jpg",
			name: "Severed",
			summary: "Split anything into two halves of the same whole. Including yourself.",
			flavor: "Split anything into two halves of the same whole. Including yourself.\nFact: High Virtue Charity takes great interest in Severed users, seeing the blasphemy as a quaint homage to the Entwine high blasphemy.\nFact: High Virtue Charity has a deep disdain for Severed users, seeing the power as a egoistic act rather than blissful connection to another.\nCommon in: personality disorders; vanishing twin syndrome.",
			passive: {
				id: "split", name: "Split",
				text: "At any point during a mission, you may spend a psyche burst to Split, creating an exact copy of yourself, with all the clothes you are wearing (but not objects you are holding), originating from your body. You may also split as a reaction to taking stress from physical harm that involves cutting, slicing, or slashing, reducing stress taken by 2.\nWhile split, you may not choose to split again until you become whole. The rules for being split are under While Split."
			},
			powers: [
				{ id: "parade", name: "Parade",
					tags: { duration: "1 scene", effect: "Summon", range: "Short" }, burst: "multiple",
					text: "You can only activate this power when whole. Create up to 1/2 CAT+3 ({halfcat} +3) less powerful copies of yourself which can only move together and follow basic 1 word commands. They cannot use any of your abilities or powers but can pick up mundane objects. Roll PSYCHE for creative uses of this power (damage rolled this way counts as mundane). Your parade has a 1/2 CAT+3 ({halfcat} +3) talisman for their durability, which can take damage and be slashed like an execution talisman by opponents, each copy evaporating in a fine pink mist when destroyed. They all evaporate regardless at the end of the scene.\nYou may consume additional psyche bursts with this power. For every additional burst add 1d3 more members to your parade, and add 1d3 segments to their durability talisman." },
				{ id: "pass", name: "Pass",
					tags: { duration: "Instant, 1/scene" }, burst: "none",
					text: "You must be split to use this power. Once per scene you may immediately transfer any object you are holding and carrying into the hands of your other. This ignores any distance or otherwise impossible obstacles between you and your other.\nGain or grant +1D to the next roll that takes advantage of this power." },
				{ id: "multiply", name: "Multiply",
					tags: { duration: "Instant", range: "Adjacent" }, burst: "required",
					text: "Touch a mundane object in range that you can hold and carry with one hand. Create a number of copies of that object equal to your CAT ({cat}) that spill out from the original. These copies are indistinguishable from the original and maintain all the same properties as the original.\nWhen you rest, all additional versions of the object disappear, and you may decide which version is the original copy if you are holding at least one of them. Otherwise the Admin decides.\nThis power may easily affect the parameters of rolls, such as difficulty and risk." },
				{ id: "cleave", name: "Cleave",
					tags: { duration: "1 scene", effect: "Transmute", range: "Adjacent" }, burst: "onSuccess",
					text: "Harmlessly part an object or creature of CAT size ({cat:size}) or smaller into individual pieces. You may \"cleave\" a specific portion or part of your target OR yourself up to 1d3 times, which cannot separate it into more than 4 pieces. Roll PSYCHE if targeting an unwilling creature, only spending a psyche burst on a success. Objects divided this way may cease to function properly, but supernaturally maintain their integrity and structure. Creatures divided this way do not feel pain and maintain control and function over their individual parts. This control may be difficult for creatures caught unaware by this power.\nCleaved parts of objects and creatures slowly float back together at the end of a scene unless otherwise prevented, through purposeful separation or otherwise.\nThis power may easily affect the parameters of rolls, such as difficulty and risk." },
				{ id: "abel", name: "Abel",
					tags: { duration: "Instant, 1/scene", range: "Self" }, burst: "required",
					text: "When you use this ability while split, instantly kill one version of yourself of choice, leaving the other version alive. You may choose how this death manifests: whether it is passing out, wounds appearing on the body, or instant combustion, which cannot deal physical harm to other creatures.\nIf you use this ability while whole and under the effect of Cleave, Parade, or any other blasphemy power where you produce a copy of yourself, you may choose to regenerate from one copy or portion of yourself, killing the rest of your portions harmlessly.\nGain or grant +1D to the next roll that takes advantage of this power. You may not choose to split until after you rest." }
			],
			extras: [
				{ title: "While Split", text: "While split, each of the following is true:\n- Both copies share the same statistics and exorcist sheet. If one of you suffers instant death or overflow, you both do.\n- You control both bodies, which can act independently of each other, each taking their own action in an investigation or conflict scene, but receiving all consequences as normal (risk die). All stress you receive during a conflict scene while both versions of you are present is increased by +1.\n- You always perceive everything from both bodies at once.\n- Items from KP are shared between both versions of yourself, and it is not a duplicated resource.\n- Both of you must choose to rest at the same time, and become whole after doing so, waking up in the body of the Admin's choice if separated.\nFor all intents and purposes. It is you. You are it. Who can tell the difference anyways?" }
			]
		},
		{
			id: "somnia",
			numeral: "",
			source: "harpocrates",
			group: "Untempered",
			theme: { color: "#ff1fe6", color2: "#8a0f7e", dark: true },
			image: "img/harpocrates/blas-somnia.jpg",
			name: "Somnia",
			summary: "Make your dreams reality. Turn reality into nothing but a dream.",
			flavor: "Make your dreams reality. Turn reality into nothing but a dream.\nWarning: Attempts to keep Somnia users awake for longer than 36 hours will result in [redacted] and personnel loss.\nCommon in: insomnia; dissociative episodes.",
			passive: {
				id: "hypnos", name: "Hypnos",
				text: "You are immune to psychic phenomena while you are asleep, and while resting if you choose to sleep. At the start of each mission or after you sleep during a rest, you may describe a single dream up to 66 seconds in length, and add it to your Dream list. This list can store up to 1/2 CAT ({halfcat}) number of dreams, and if gaining a new dream would exceed this limit, you must remove a previous one. Some of your powers interact with this list."
			},
			powers: [
				{ id: "manifest", name: "Manifest",
					tags: { duration: "1 scene", effect: "Summon", range: "Short" }, burst: "multiple",
					talisman: "{2+cat}",
					text: "Select a dream from your Dream list. You bring forth any number of intangible objects or living beings with a combined size of your CAT+1 ({cat+1:size}) from that dream into reality. You control their movements and actions, although they cannot inflict harm on anything or anyone due to being intangible.\nIf they move out of long range, they disappear, and they cannot intelligently vocalize, only making garbled sounds when attempting to do so. This power may easily affect the parameters of rolls, such difficulty or risk.\nSpend 1 additional psyche burst to manifest these constructs into the waking world, and extend the duration to Until Rest. They become physically tangible even to those without Grace, and may interact with the world around them. They have a combined 2+CAT ({2+cat}) talisman for their durability, which can take damage and be slashed like an execution talisman by opponents. Roll PSYCHE for creative uses of this power." },
				{ id: "lull", name: "Lull",
					tags: { duration: "1/rest", effect: "Curse", range: "CAT area ({cat:area})" }, burst: "required",
					text: "You adjust the levels of waking for all beings of choice within a CAT area ({cat:area}) centered on yourself. Pick 1 of the following effects, which last for the duration:\n- Sleep: Targets become lethargic, sluggish, and tired. Beings on the brink of death, humans, and weakened traces will fall asleep. You may force any being who falls asleep this way to experience one of the dreams on your Dream list while they are asleep.\n- Wake: Beings of your choice become active and energetic, unable to rest. Creatures who are drowsy or fatigued are instantly awakened, and will find it impossible to sleep.\nThis may easily affect the parameters of rolls, such as difficulty or risk." },
				{ id: "surreal", name: "Surreal",
					tags: { duration: "1 scene", effect: "Transmute", range: "CAT area ({cat:area})" }, burst: "multiple",
					text: "You dramatically change the landscape in a CAT area ({cat:area}) around you into visions of your dreams. The features and landscape within that area change into one of the following of your choice:\n- Bliss: Hard surfaces become soft and fluffy to the touch, lights shine brighter, and supernatural beings may appear less threatening than usual.\n- Terror: Objects of your choice become angular, solid, and sharp, the sky and area darken, and supernatural beings may appear more threatening than usual.\n- Incongruence: Hanging objects begin to droop, lights flicker, and visible features of buildings or landscapes warp slightly.\nAt any point during the scene, spend 1 additional psyche burst to make these changes last until rest. These changes do not affect the abilities and statistics of Sins, traces, or other enemies.\nThis may easily affect the parameters of rolls, such as difficulty and risk. If the mood selected matches one of the dreams on your list, additionally gain or grant +1D to the next roll that takes advantage of this happening." },
				{ id: "haze", name: "Haze",
					tags: { duration: "1 scene", effect: "Charm", range: "Self" }, burst: "required",
					text: "Temporarily alter the state of tangibility for yourself and things you are wearing or carrying. For the duration of the scene, you are still visible as normal, but you cannot be harmed or touched through physical means. Objects and beings in motion move through you with ease, but you treat inanimate objects and surfaces normally, unable to move through them, like the floor or walls.\nWhile in this state, you may additionally touch an object or structure that is equal to your CAT size ({cat:size}) or smaller, and cause it to share the same traits as you do, becoming intangible but not invisible.\nGain or grant +1D to the next roll that takes advantage of this power.\nIf you take stress from supernatural phenomena, you may choose to discard a dream on your Dream list to keep this effect active, otherwise this effect ends early." },
				{ id: "daydream", name: "Daydream",
					tags: { duration: "Instant, 1/rest" }, burst: "required",
					text: "You blink rapidly and phase a portion of reality into your subconsciousness as if it was never real in the first place. Select any number of objects you can see at once, whose combined size is equal to or lower than your CAT ({cat:size}). Alternatively, you may also select a single mundane human you can see.\nAs you blink, your selected target(s) disappear from reality. This is not immediately questioned by mundane individuals in the same scene, although the absence of any important missing person or objects may be questioned later.\nThe last 66 seconds are added to your Dream list. Once this dream is removed from the list, any objects or individuals are returned to reality in the same location they were taken. This dream removes itself from your Dream List when you next take a rest or at the end of the mission.\nGain or grant +1D to the next roll that takes advantage of this power." }
			]
		},
		{
			id: "expiration",
			numeral: "",
			source: "harpocrates",
			group: "Untempered",
			theme: { color: "#ff5a3c", color2: "#8f2a1a", dark: true },
			image: "img/harpocrates/blas-expiration.jpg",
			name: "Expiration",
			summary: "Control the natural hunger that rests within the air. Accelerate oxidation to a devastating effect.",
			flavor: "Control the natural hunger that rests within the air. Accelerate oxidation to a devastating effect.\nFun Fact: Expiration users have existed in CASTLE and TEMERITY teams for decades, but have historically taken a custodial role in corpse disposal and organization-wide waste management. Further applications of the power have expanded their usage to the field.\nCommon in: work in hospice or funeral service; custodial workers; terminal illness.",
			passive: {
				id: "exhale", name: "Exhale",
				text: "You maintain minor control over the properties of the air around you in a 1/2 CAT ({halfcat:area}) area. At will you can control:\n- How heavy the air feels, from no resistance to a light pressure.\n- The humidity, from dry to slightly moist.\n- The sound of living things breathing, from silencing it to making it overtly audible.\n- Scents in the air, from negating smells to doubling the strength of existing odors."
			},
			powers: [
				{ id: "incense", name: "Incense",
					tags: { duration: "1 scene, 1/rest", effect: "Summon", range: "CAT range ({cat:range})" }, burst: "none",
					text: "You expel or manifest a visible atmospheric vapor or smoke that floats up to a CAT distance ({cat:range}) away from you. Laced with psychic influence, this substance floats towards one of the following options of your choice, making the nearest 1/2 CAT ({halfcat}) instances of that option clear or obvious:\n- The traces of supernatural beings other than the exorcists, objects they may have touched, footsteps left behind by psychic beings, etc.\n- Points of fragility in physical structures, stress fractures, or architectural weak points.\n- Deceased beings or corpses.\nAfter you follow the smoke to its point(s) of interest, it fades away into the air. This may easily change the parameters of rolls, such as difficulty or risk." },
				{ id: "oxide", name: "Oxide",
					tags: { duration: "Instant", range: "CAT+1 range ({cat+1:range})" }, burst: "required",
					text: "Temporarily sense the location of exposed metals, oxygen, or flammable materials within range through air contact, and rapidly degrade an area of your choice. The oxidation affects an area up to your CAT ({cat:area}), and you may choose one of the following effects:\n- Flake: Things you select begin to rust away and flake into red dust, corrode, or age rapidly, becoming irreparably damaged and unusable.\n- Burn: Rapidly oxidize the selected object or area, causing it to ignite instantaneously. This lasts only for a few moments, but completely incinerates whatever you select.\nIf this would cause damage to a hostile target, roll PSYCHE for it. This may easily affect the parameters of rolls, such as difficulty or risk." },
				{ id: "decompose", name: "Decompose",
					tags: { duration: "1 scene", effect: "Charm", range: "Self" }, burst: "required",
					text: "Rapidly decompose inanimate organic matter (corpses, plants, food, etc.) you touch into its simplest chemical components. For the rest of the scene, any organic matter up to CAT ({cat:size}) in size that you touch breaks down within seconds into gases, water, and carbon compounds, forming a thick, dark, unrecognizable sludge. This substance is highly flammable.\nGain or grant +1D when you or any ally next acts to take advantage of this power." },
				{ id: "repose", name: "Repose",
					tags: { duration: "1 scene", effect: "Summon", range: "CAT area ({cat:area})" }, burst: "required",
					text: "You temporarily halt the processes of decay, poisons, and death in up to a CAT area ({cat:area}) around you. Humans suffering fatal wounds or injuries are sustained temporarily while within this zone. Within this area, matter that is decaying through either mundane or supernatural means also temporarily pauses. This may delay certain hooks or the effects of certain afflictions at admin discretion.\nAdditionally, when an allied exorcist in this area takes stress while on the brink of death, you may burden yourself with their potential death and take all stress inflicted instead.\nThis may easily affect the parameters of rolls, such as difficulty or risk." },
				{ id: "bloat", name: "Bloat",
					tags: { duration: "Special, 1/rest", effect: "Transmute", range: "Touch" }, burst: "multiple",
					text: "By touching a living or dead being, you can make it emanate dangerous fumes within a CAT area ({cat:area}). You may increase the CAT of this power by +1 for every additional burst you spend on it. This effect lasts for 2d3 minutes if the target is alive, or for the rest of the scene if the target is a corpse. When you activate this power, you can choose the opacity of this gas, ranging from transparent to opaque smog.\nThis gas can ignite from any source of combustion, such as fire, a spark, or concentrated heat. The resulting explosion damages structures and kills or injures any unprotected humans in the area. Roll PSYCHE for damage if this would harm a living or supernatural being.\nYou may gain or grant +1D when you or any ally next acts to take advantage of this power." }
			],
			extras: [
				{ title: "Dead Air (talisman)", text: "Whenever you use an Expiration power that is not Repose, slash a 6 segment talisman named [DEAD AIR] and make a fate roll. If that roll is equal to or lower than the current number of slashes on this talisman, the drifter of the same name enters the scene. Then remove all slashes from the talisman." },
				{ title: "\"Dead Air\" (Anomaly drifter)", text: "A drifter microorganism cloud that is birthed from the concentration of grief and emotions surrounding death within the noosphere. Its existence was originally considered to be a side effect of Expiration users' powers, mandating that Expiration users serving custodial roles work solo, so as to prevent loss of life. Further research showed that this drifter also manifests near funeral homes and gathers in the basements of hospice facilities. Rather than manifesting directly from Expiration users, they are instinctively compelled to them.\nExecution: 5 (cloud)\nStress inflicted: (1-3) 2 stress, (4+) 1 stress.\nBehavior (informs complications and threats): Non-hostile and intangible. Prefers to occupy closed spaces, such as rooms or buildings, but entirely fills spaces of up to 2-3 blocks wherever it manifests. Inhaling it is deadly, and prolonged exposure will kill most mundane humans. Any organic matter or porous materials (wood, plaster, concrete) will slowly begin to decay in its presence.\nSpecial: Last Breath. Takes -3 slashes on its talisman from all sources unless harmed through fire, heat, or a strong air flow. Occupies an entire area of the investigation zone when it manifests. Automatically makes every action in that area risky by default, unless wearing breathing protection of some kind, as you inhale harmful vapors. It can take this reaction alongside any other hostile entities in the scene." }
			]
		},
		{
			id: "pugile",
			numeral: "",
			source: "harpocrates",
			group: "Untempered",
			theme: { color: "#ff5a3c", color2: "#8f2a1a", dark: true },
			image: "img/harpocrates/blas-pugile.jpg",
			name: "Pugile",
			summary: "Violently refine your body. Let your hands be stained.",
			flavor: "Violently refine your body. Let your hands be stained.\n\"Lo, violence stains the hand, but to strike sin is righteous toil. Let wrath be just, the hand swift, and the wicked laid low.\" - Exorcist Father Santori, 1719\nMatured sins born from Pugile users often possess an additional domain, aspects from multiple sin types, or may be more belligerent regardless of type.\nCommon in: severe exposure to Sin; sin overflow; irregular vitals.",
			passive: {
				id: "disgraced", name: "Disgraced",
				text: "You are disgraced, and must add +1 to the final result of all rolls made to resist sin overflow. Some of your powers gain additional effects if you use them while your current sin is at half (rounding up) or more of your total sin cap or for the rest of the scene after you experience sin overflow through defying fate. This is considered Metamorphosis.\nAt the end of the scene if you used at least one power and triggered its Metamorphosis effect, you may relieve 1d3 sin by forcibly expelling it into the air (ignore this release if you would enter sin overflow at the end of the scene)."
			},
			powers: [
				{ id: "implode", name: "Implode",
					tags: { duration: "Instant", range: "1/2 CAT area ({halfcat:area})" }, burst: "required",
					text: "Charge a sinmark you possess with psychic energy and detonate it in a 1/2 CAT ({halfcat:area}) area, creating an explosion of psychic energy, flesh, and bone that damages structures and living beings. The selected sinmark area is temporarily mutilated.\nUntil rest, you do not benefit from any of that sinmark's abilities and cannot use it for this ability again. After your next rest, your sin mark remanifests and heals, more inhuman than before.\nIf use of this power would be risky, unclear, or inflict harm, roll PSYCHE, adding +1D if the sinmark you destroyed was evolved. Then gain 1d3 sin after this resolves if you did not trigger this power's Metamorphosis effect.\nMetamorphosis: If you roll for PSYCHE using this power, gain +1D for every ability that sinmark possessed (max +3D)." },
				{ id: "apotheosis", name: "Apotheosis",
					tags: { duration: "1 scene, 1/scene", range: "Self" }, burst: "required",
					text: "Transform the abilities of your cursed flesh. Roll for sin mark location. You select and temporarily gain 1 sin ability that manifests from that mark. It manifests as a spreading infection or uncontrollable growth, and may cause humans to become apprehensive or scared.\nGain or grant +1D on the next roll that takes advantage of this effect. It disappears at the end of the scene, melting back into your flesh. Then gain 1d3 sin after this resolves or ends early if you did not trigger this power's Metamorphosis effect.\nMetamorphosis: Instead gain every sin ability from the rolled mark. The area becomes a mass of writhing flesh, horrific, and violently grotesque. If there is a corpse of a supernatural being nearby, you may absorb it into your sin mark as a part of this ability and gain an additional +1D to the next roll that takes advantage of this effect." },
				{ id: "fusillade", name: "Fusillade",
					tags: { duration: "Permanent" }, burst: "required",
					text: "Passive: Your Blast now only manifests through your limbs and physical strikes, as its range is reduced to adjacent. When you use your Blast this way and roll 2 or more 6's on a violent or harmful action, you may take 1d3 sin to deal +1 slash as your grace coalesces into a finite destructive blow.\nMetamorphosis: Gain Active: 1/rest, target a creature with an immeasurable fury, a flurry of limbs, an unstoppable barrage, rolling PSYCHE to deal harm. This roll cannot receive bonus dice from any other sources except divine agony, but instead gains +1D for each question your target cannot answer yes to:\n- Are you certain you'll survive this encounter?\n- Is there someone or something to block with nearby?\n- Is the exorcist hindered, distracted, or under duress in some way?\nIf you roll a 6 on any of the dice, you severely stagger the target's psychic signature. You may take any number of sin to inflict an equal number of slashes on complication talismans created by or connected to the target." },
				{ id: "accelerate", name: "Accelerate",
					tags: { duration: "1 scene, 1/scene", effect: "Charm", range: "Self" }, burst: "required",
					text: "Enhance your speed to extreme capabilities by dipping into the lingering grace in your body. In addition to any action you take during this scene, you may move up to 1/2 CAT ({halfcat:range}) distance within a second.\nThis may easily affect the parameters of rolls, such as difficulty or risk. Then gain 1d3 sin after this resolves or ends early if you did not trigger this power's Metamorphosis effect.\nMetamorphosis: 1/scene when you take advantage of this speed, you can make an action roll without any hostile creatures taking a reaction. You may trigger this again by taking 1d3 sin, again by lowering your sin cap by 2, and again by imagoing after that action resolves." },
				{ id: "stain", name: "Stain",
					tags: { duration: "Entire hunt, 1/rest", range: "CAT+1 area ({cat+1:area})" }, burst: "none",
					text: "You may trigger this power when you kill or end the existence of another being. The psychic energy of the creature you just killed is mutilated as a warning for other supernatural beings.\nAll beings that can perceive grace within a CAT+1 area ({cat+1:area}) become aware that you have killed the target, become apprehensive, and may devote resources into avoiding conflict with you. Powerful or aggressive supernatural beings may instead see this as a threat, challenge, or territorial dispute, and act accordingly. This may easily affect the parameters of rolls, such as difficulty or risk.\nMetamorphosis: The range of this ability becomes CAT+2 area ({cat+2:area}) instead. Until rest, humans become instinctively fearful of your presence." }
			],
			extras: [
				{ title: "Abhorrent Mutations", text: "Sins born from Pugile users may gain any of the following features, based on the CAT of the exorcist that has imagoed. An admin may collaborate with the imagoed exorcist to select any number of upgrades, which must have a total value equal to the CAT+1 of that exorcist. The execution of this sin grants additional scrip per exorcists on successful execution or hazard pay equal to the total value of mutations on it.\n- (1) Gains +1 Domain option from own list.\n- (1) Gains +3 segments on its execution talisman.\n- (2) Gains +1 Domain from a different sin type.\n- (2) Begins each conflict scene with a 4 slash complication talisman.\n- (3) The hunt for this Sin begins between missions, as it ambushes a CAIN facility by surprise. Pressure begins at 3 for this hunt." }
			]
		},
		{
			id: "wave",
			numeral: "",
			source: "harpocrates",
			group: "Untempered",
			theme: { color: "#ff5a3c", color2: "#8f2a1a", dark: true },
			image: "img/harpocrates/blas-wave.jpg",
			name: "Wave",
			summary: "Control the ebb and flow of the psychic sea itself.",
			flavor: "Control the ebb and flow of the psychic sea itself.\nFun Fact: In recent years, Wave users previously located in [redacted], Bermuda for containment have been distributed for active service in global CASTLE divisions.\nCommon in: manic highs and lows; child of Sin-Seed bearer; born in CAIN facilities.",
			passive: {
				id: "wellspring", name: "Wellspring",
				text: "You have an overflowing reservoir of psychic energy. You raise your psyche burst max by +1. Your psychic signature is easily detectable within 1/2 CAT ({halfcat:range}) distance to other supernatural beings, drifters, traces, and other exorcists. You can suppress your psychic signature for a scene by taking 2 non-lethal stress when the scene begins.\nExercise extreme caution: Drifters or certain sins may be attracted to your grace, and approach you if they detect it."
			},
			powers: [
				{ id: "pressure", name: "Pressure",
					tags: { duration: "1 scene", effect: "Transmute", range: "Short" }, burst: "required",
					text: "Create a zone of overwhelming force by condensing psychic energy on a point you can see within range. The area of this pressure reaches up to a 1/2 CAT ({halfcat:area}) area, but the intensity of the force increases alongside the pressure of the current hunt. The magnitude of this power always has a CAT magnitude equal to 1/2 PRESSURE + 3, as shown below:\n- Pressure (1-2): Massive. Can impede the movement of anyone caught within the zone as it pushes down on them.\n- (3-4): Destructive. Can crush large objects such as cars or vehicles, and lethally injure humans or damage sins.\n- (5+): Overwhelming. Uncontrollably destructive. Leaves craters in the ground where used and flattens mundane humans.\nIf use of this power would be risky, unclear, or inflict harm, roll PSYCHE to determine its effects. Gain or grant +1D to the next ally that takes advantage of this happening." },
				{ id: "breach", name: "Breach",
					tags: { duration: "Instant", effect: "Charm", range: "Self" }, burst: "multiple",
					text: "Part the waves of the psychic sea that others find it hard to move through. This power can be used as a part of another action you or an ally take. You can freely move through and ignore the effects or stress from any of the following phenomena for exactly 33 seconds:\n- Environmental psychic effects such as an ogre's miasma, lord's domain, etc.\n- Lingering psychic effects in the air, or psychically induced weather etc.\n- An ally's psychic power that has an area of effect.\nYou can choose to spend an additional burst to instead breach through normally impenetrable psychic obstacles, such as tension fields or other barriers.\nGain or grant +1D to the next ally that takes advantage of this happening. This may easily affect the parameters of rolls, such as difficulty or risk." },
				{ id: "lighthouse", name: "Lighthouse",
					tags: { duration: "Instant, 1/scene", range: "CAT+1 range ({cat+1:range})" }, burst: "required",
					text: "You burn the grace inside of your body to produce a distinct and highly visible flash of psychic energy, visible only to the graced. Anywhere within a few seconds to a couple minutes, a drifter enters the scene attracted to this light (see Wave Drifters). It may initially be distracted or entranced by your psychic signature, and not be immediately hostile to you for a few moments before taking its usual course of action.\nThis may also be used to create a signal of psychic energy detectable by your allies who can see in your general direction, as the flash reaches up to a CAT+1 ({cat+1:range}) distance away.\nGain or grant +1D to the next action roll that takes advantage of this happening. This power may easily affect the parameters of rolls, such as difficulty or risk." },
				{ id: "drain", name: "Drain",
					tags: { duration: "1 scene, 1/hunt", effect: "Transmute", range: "CAT area ({cat:area})" }, burst: "all",
					text: "Generate a massive sinkhole in the psychic sea centered on you. Every drifter, trace or sin within a CAT area ({cat:area}) temporarily dissipates as they slide into the subconscious layer of the psychic gestalt. Beings with psychic abilities caught in the area, including you and your allies, are drained of their grace. Any action that would expend a psyche burst or roll with PSYCHE is hard by default until the end of the scene. Enemies that rely on psychic abilities may find it hard to generate meaningful damage or effects through them, but can still use mundane capabilities or weaponry as normal.\nWhen this power ends, any supernatural being removed by this ability quickly remanifests, and may be additionally aggressive or hostile to the user of this power. Then regain 1 psyche burst for every burst spent on this power after the first. This power may easily change the parameters of rolls, such as difficulty or risk." },
				{ id: "pattern", name: "Pattern",
					tags: { duration: "Instant, 1/rest" }, burst: "required",
					text: "You may only use this power during a resting scene. The phenomena of grace follows a subtle order which you can perceive in greater detail than most.\nRoll PSYCHE, and ask the admin one of the following questions, plus one more per success, about the sin's next action or tension move it is planning on taking once the pressure rises:\n- Who or what will be targeted?\n- What will happen?\n- Will the sin be there when this happens?\n- Will a supernatural entity other than the sin be there when this happens?\nActions taken by the exorcists to avoid or impede the actions of the sin may break the pattern and render answers unreliable. Gain or grant +1D when you or any ally next acts to take advantage of each answer." }
			],
			extras: [
				{ title: "Wave Drifters", text: "When a Wave user puts their powers on full display or when they use the Lighthouse power, drifters are inevitably drawn to them. An admin may make a fate roll on the chart below and select one option from the result to manifest into the scene when needed. Drifters marked (GFF2) are from Games for Freaks 2, while others can be found in the core book or on this page. Waves attract two unique drifters to their presence, the Angler and Urchin.\n- (1) Titan, Walker (solo) (GFF2) (the scene is covered in a thick fog or storm if it wasn't already).\n- (2-3) Gatherer (horde), Angler, Dog (GFF2), Spindley (GFF2).\n- (4-5) Pale Man, Urchin, Neighbor (solo) (GFF2), Hairy Man (solo) (GFF2), Cracked Man (solo) (GFF2), Twin (solo) (GFF2).\n- (6) Pest (solo), Poltergeist, Gatherer (solo), Skin Light (small group) (GFF2), Worm Body (solo) (GFF2)." },
				{ title: "\"Angler\" (Anomaly drifter)", text: "A massive drifter that manifests when no one is looking, appearing as small single-floor building at the end of streets, or occupying empty lots at night. It leaves a single light on, visible from its windows, to attract unwitting humans into entering.\nExecution: 8 (solo)\nStress inflicted: (1) 5 stress, (2-3) 4 stress, (4+) 3 stress.\nBehavior (informs complications and threats): Does not move, and is indistinguishable from a building until someone physically enters it. Immediately locks all exits once triggered, and attempts to slowly digest prey with acid.\nSpecial: Shut Maw. Any talisman made to escape the Angler gains +4 segments. Deals +1 stress on all reactions to exorcists caught inside of it." },
				{ title: "\"Urchin\" (Anomaly drifter)", text: "A 4 ft tall spiny drifter that manifests in abandoned urban locations that used to be homeless camps or drug dens. Getting cut by one of these spines can result in severe infections or strange growths.\nExecution: 5 (solo)\nStress inflicted: (1) 3 stress and osteophytosis affliction, (2-3) 2 stress and osteophytosis affliction, (4+) 2 stress.\nBehavior (informs complications and threats): Cannot see, but detects vibrations through the ground or air within a short range. Rolls violently towards creatures it can detect.\nSpecial: Osteophytosis. Affliction. Inflict when dealing stress or with a threat. Afflicted exorcist begins to grow painful bony spikes from their skeleton, which deal 2 stress to any allied exorcist that gets within adjacent range of you. Painful, and must be surgically removed post mission." }
			]
		},
		{
			id: "erudition",
			numeral: "",
			source: "harpocrates",
			group: "LVL 4 Clearance",
			requiresApproval: true,
			theme: { color: "#7fe0e0", color2: "#2a8f94", dark: true },
			image: "img/harpocrates/blas-erudition.jpg",
			name: "Erudition",
			summary: "Control the flow of perceived information. All rivers run towards you.",
			flavor: "Control the flow of perceived information. All rivers run towards you.\nFact: A majority of Erudition users are not exorcists, but rather TEMERITY and SEER assets kept onsite to assist in research and data analysis.\nClearance: A LVL 4 Clearance blasphemy, dangerous and experimental in nature. Taking it requires approval and discussion with your Admin, as its existence can impact the narrative of your game.\nErudition and Enigmata are mutually exclusive: if you take powers from one, you cannot gain powers from the other.",
			passive: {
				id: "as-above", name: "As Above",
				text: "You can close your eyes and detect any functional and powered-on security cameras or surveillance devices with the ability to \"see\" within a CAT area ({cat:area}), and see from their perspective while your eyes remain shut. At CAT 4, once per mission you can attempt a hard PSYCHE roll to see from the perspective of a satellite camera focused anywhere within the current investigation zone for a few moments. At CAT 5, you can attempt this once per rest."
			},
			powers: [
				{ id: "deduce", name: "Deduce",
					tags: { duration: "Instant, 1/hunt" }, burst: "none",
					text: "Psychically break down information and objects uncovered in this investigation down to their immutable truths. Select a number of objects you possess or pieces of information (a phrase, a statement, a person, place, or thing) equal to your 1/2 CAT+1. You may ask any of the following by choosing one or more of your subjects and selecting one question, which the admin must answer \"yes\" or \"no\" to as honestly as possible. Questions may be asked more than once, but take 2 stress for every question asked beyond the first:\n- \"Are these subjects connected?\"\n- \"Is this statement accurate?\"\n- \"Would I get useful information about subject A from subject B?\" (choose two targets as A and B).\nGain or grant +1D to the next action that takes advantage of one of these answers." },
				{ id: "confluence", name: "Confluence",
					tags: { duration: "Until rest, 1/scene", range: "CAT area ({cat:area})" }, burst: "required",
					text: "By focusing for a moment, you force individuals of your choice in a CAT area ({cat:area}) centered on yourself to experience a shared overlay of your understanding of a topic, skill, or single subject. This happens instantly but can project the full knowledge of the investigation at hand, months of training in a particular skill set, or any wide breadth of knowledge. You may leave out details to disguise the source of information, but must still share the knowledge in an accurate and precise way.\nAlternatively, you can target one individual in this area that you can maintain eye contact with for a few seconds, and absorb skills or knowledge they possess. This can be trademark skills, specialized knowledge, years of research on a particular subject, or certain practical skills.\nGain or grant +1D to the next action that takes advantage of this power. This power may easily affect the parameters of rolls, such as difficulty or risk. All knowledge transmitted through this power is revoked when this power ends." },
				{ id: "rumor", name: "Rumor",
					tags: { duration: "Entire hunt, 1/rest" }, burst: "required",
					text: "To use this power, you communicate the following phrase to a human in the investigation zone: \"I heard a rumor that ____\". You may fill in the blank with any combination of words, as long as it remains a single sentence.\nAfter this scene ends, whenever you encounter another NPC for the first time after using this power, make a fate roll:\n- (1-2): You are unaware of whether or not this person has heard this rumor.\n- (3-4): This person has heard this rumor, but does not willingly express their feelings on it.\n- (5+): This person has heard this rumor. You gain +1D on any roll made to determine how they feel about it, and rolls made to determine this can never be hard or impossible.\nIf your original target was someone secluded or reserved, roll the fate die twice and pick the lower result for all encounters. If they were well-connected in the community or a talkative individual, roll twice and pick the highest instead." },
				{ id: "mindwalk", name: "Mindwalk",
					tags: { duration: "Instant, 1/scene", range: "Long" }, burst: "required",
					text: "Force your way into the mind of another living being for a fraction of a second. You may only target someone whose real name you know. Their mind becomes a physical space you can traverse with your consciousness as if the target owned a Palace (even on targets without one). Most mundane human minds will resemble a small room or place of comfort for the individual. This power shunts the consciousness of your target within this space as well.\nOnce inside, time slows down, and you gain a number of action rolls equal to your 1/2 CAT ({halfcat}) to investigate, probe, or communicate with your target. Once inside, you cannot see anything that your target would not want you to see normally, but may take actions to convince your target or interrogate them to change this. This power then ends when your actions resolve.\nThe target cannot forget your face or voice after this power resolves. The next time you and the target would get within visual range of each other, you both make eye contact and instinctively recognize each other." },
				{ id: "codex", name: "Codex",
					tags: { duration: "Permanent" }, burst: "none",
					text: "Passive: You possess a codex of blasphemies, supernatural phenomena, individuals, and other various information stored in your mind. 1/rest whenever you encounter a blasphemy power you do not possess (whether upon use from an ally or enemy), you may add it to your codex. You can only have a maximum of 1/2 CAT+2 blasphemy powers recorded this way. When you write down this blasphemy, you may additionally write down, if you know it: the name of the individual that used it, the location, and time of use.\nOnce per rest, by citing as much information as you know about a recorded power, you may use it yourself at a CAT rating equal to yours and expending psyche bursts as indicated by the original power. You then remove it from your codex and gain 1d3 sin." }
			],
			extras: [
				{ title: "Running Erudition & Enigmata", text: "THE PSYCHIC SEA: The true nature of the psychic sea is unknown. The forces behind grace, blasphemies, and sins exist in what some may consider the noosphere, the collective consciousness of humanity. Introducing Erudition and Enigmata requires an Admin and table to come to terms with an explanation, and establish that truth within their setting. At a baseline, tables should determine the answers to the following three questions (the first two may also be useful for any game of CAIN).\nWhat is a consciousness and subconscious? A consciousness is a state of awareness of oneself and one's surroundings. When a Jaunt or Palace user projects themselves somewhere, the experience is often that of a consciousness displaced from its usual position. A subconscious is where information is stored: stimuli processed in the back end, the body's automatic functions, and memories. Psychic powers that target this part of the brain affect memory, ingrained behavior, and connections. Consider simplifying the mind into active thoughts (what a person is thinking, feeling, and saying right now) and inactive thoughts (things seen, remembered, or processed but not currently thought about).\nWhat is a Palace? Palaces are pieces of the mind that can be traversed. For agents of CAIN this takes the form of a Sanctum; the palaces of Sins carve out a pocket dimension in reality. Forcing a human to have a palace (as Mindwalk does) implies every living being has a traversable mind. These palaces are temporary and small, representing the person's thoughts and memories. The owner usually has some control over them; probing, teasing out thoughts, or invoking feelings may bring subconscious material into view, while a defensive or reserved person may obscure it. Consider what is important to the person, what they find comfort or value in, and their current mental state.\nWhat is the Basement? Memories or thoughts repeated amongst more than one individual form the Basement, a shared subconscious. The Admin should NOT populate it with information or objects not discoverable in the investigation zone. To depict a location in the Basement, take your notes on the real place, subtract, then multiply. Example: a sin host's apartment has a messy desk with mail, a fridge and bed, and a window with the curtains down; the host locked themselves in, starving, stressed by overdue rent. Subtract what the host wasn't using or thinking about (the windows, fridge, and bed). Multiply what they were constantly thinking about (the bills): the Basement shows a massive pile of mail. Describe it quickly and loosely and let players fill the space with questions and actions. Touchstones: Mementos (Persona 5), The Backrooms, Exit 8, Vivarium.\nWhen a player builds the Tulpa that lives in the Basement, treat it like a Whisper user's Shadow: it should represent an aspect of the exorcist it hunts down, such as a fear, a distorted view of the self, or a premonition of their fate. It only exists down there because the exorcist has made themselves seen, willingly or otherwise. So it goes." }
			]
		},
		{
			id: "enigmata",
			numeral: "",
			source: "harpocrates",
			group: "LVL 4 Clearance",
			requiresApproval: true,
			theme: { color: "#9b7cf5", color2: "#5a3fb0", dark: true },
			image: "img/harpocrates/blas-enigmata.jpg",
			name: "Enigmata",
			summary: "Become indecipherable. Endlessly descend into the psychic sea.",
			flavor: "Become indecipherable. Endlessly descend into the psychic sea.\nFact: The only way forward is down.\nClearance: A LVL 4 Clearance blasphemy, dangerous and experimental in nature. Taking it requires approval and discussion with your Admin, as its existence can impact the narrative of your game.\nErudition and Enigmata are mutually exclusive: if you take powers from one, you cannot gain powers from the other.",
			passive: {
				id: "so-below", name: "So Below",
				talisman: "6",
				text: "You can access the Basement, a psychic space formed from the collective unconscious. The door to it is in a place deep within your mind that only appears to you in certain moments. Your presence here has birthed a hostile tulpa that lives within the Basement, a physical manifestation of your worst fears or traumas that you cannot escape, not even down here. The rules for it are under Descent. Additionally, gain the Sink power for free."
			},
			powers: [
				{ id: "sink", name: "Sink",
					tags: { duration: "[???], 1/rest" }, burst: "required",
					text: "You may trigger this power when in front of a doorway, causing it to resemble the one deep within your mind. You then turn the handle and walk through it, entering the Basement. The Basement is an unnavigable and distorted reflection of the real world, and mirrors the investigation zone through the lens of collective memory. Frequently seen or densely populated locations appear increasingly detailed and distorted. More obscure locations appear clearer and more accurate, but may lack details that were never observed or remembered by those within that space:\n- Time does not pass normally in the Basement. You cannot rest here, and cannot slash tension or pressure from actions taken while in the Basement.\n- No mundane life exists here. You may bring a number of willing humans or exorcists with you equal to CAT ({cat}), but slash the Descent Talisman once for each person that enters besides yourself.\nWhen this power ends, you resurface from your current location in the Basement to its corresponding space in the real world. You may use this to travel to other places by exiting through their reflections, but navigating the Basement is always hard by default.\nThis may easily affect the parameters of rolls, such as difficulty or risk. Gain or grant +1D when taking advantage of this power, up to a number of times equal to your 1/2 CAT ({halfcat})." },
				{ id: "cipher", name: "Cipher",
					tags: { duration: "Until rest, 1/scene", effect: "Summon", range: "Touch" }, burst: "required",
					text: "You create a cognitively hazardous glyph on any flat surface that is smaller than the size of your palm (which may include your body). Roll 1d3 to determine the effect of this glyph:\n- 1: The glyph lingers in the minds of people who see it. You can know if someone has seen it or not by looking at them, and these people always instinctively know where to go to find this glyph again.\n- 2: All beings subconsciously avoid looking at this glyph, and turn away when facing it if possible.\n- 3: This glyph is harmful to look at for humans. Sustained eye contact with it may cause cranial bleeding, as if they were making direct eye contact with a sin.\nTRISMEGISTUS: You may choose to slash the Descent talisman to decide which effect occurs instead of rolling. If you are already in Descent, take 2d3 sin instead.\nGain or grant +1D to you or an ally that takes advantage of this power. This power may change the parameters of rolls, such as difficulty or risk." },
				{ id: "riddle", name: "Riddle",
					tags: { duration: "Until rest", effect: "Transmute", range: "Touch" }, burst: "required",
					text: "You render recorded information useless, jumbled, and incoherent on a source you can touch until rest. This target can be anything that is written, recorded, or digitally uploaded. This power makes that piece of information impossible to access from the corrupted source until rest.\nALEXANDRIA: 1/rest, you may slash the Descent talisman to affect an entire database, collection, or repository of information, which must be in the same medium as and connected to your target. (I.e., targeting a case file from a police department would corrupt every paper case file in that department's collection, but targeting the internal search database on a police department's computer would corrupt that entire digital database.)\nThis power may easily change the parameters of rolls, such as difficulty or risk, and may make certain actions hard by default." },
				{ id: "leak", name: "Leak",
					tags: { duration: "Until rest, 1/scene", effect: "Curse", range: "Touch" }, burst: "required",
					text: "You puncture the psyche of a mundane human's mind, and suffuse it with false memories. Roll 1d3 to determine the nature of this memory:\n- 1: A tragedy or loss of drastic proportions.\n- 2: A celebration or joyous event.\n- 3: A moment of extreme fear and hostility.\nYou determine the contents of this memory, but the length of the memory cannot exceed 66 seconds, and it must always include you in some way. The target believes these memories to be true.\nLOFTUS: You may choose to slash the Descent talisman to decide which effect occurs instead of rolling. If you are already in Descent, take 2d3 sin instead.\nGain or grant +1D to you or an ally that takes advantage of this power. This power may change the parameters of rolls, such as difficulty or risk, and may make certain actions hard by default. When this power ends, the memory does not leave the target, but they become aware that memory is illogical or impossible in some way." },
				{ id: "mnemosis", name: "Mnemosis",
					tags: { duration: "1/scene", effect: "Transmute", range: "CAT area ({cat:area})" }, burst: "required",
					text: "You cause yourself and all beings within a CAT area ({cat:area}) to temporarily forget one of the following at random: How to; (1): breathe, (2): walk and run, (3): fight, or (4): use or operate technology and machinery, for 33 seconds. OR (5-6): For the next 33 seconds, everything that happens will not be remembered by any targets of this power.\nEBBINGHAUS: You may choose to slash the Descent talisman to decide which effect occurs instead of rolling. If you are already in Descent, take 2d3 sin instead.\nGain or grant +1D to you or an ally any time you can take advantage of this power while it is in effect. This power may change the parameters of rolls, such as difficulty or risk, and may make certain actions hard by default." }
			],
			extras: [
				{ title: "Descent", text: "The tulpa cannot be killed, but is constantly following you. You determine its size and appearance. Create a 6-slash Descent talisman. Slash it whenever you enter the Basement, or when your powers tell you to. When fully slashed, your tulpa catches up to you and you Descend, falling deeper into a truth that only you can understand.\nWhile in Descent, you gain the following conditions:\n- Any attempt you make to explain what you've learned or seen in the Basement becomes unintelligible OR must be spoken in a language that you have not spoken in any previous scene or mission.\n- 1/scene, the Admin may trigger one of your Enigmata powers without spending a psyche burst. It cannot be ended early, and it cannot be a power you have already used 1/rest or 1/scene.\n- During a resting scene while in Descent, you must choose to Sink and go to the Basement on your own after spending your resting dice. This does not spend a burst or 1/rest usage, and you float back in a location of the Admin's choice at the start of the next scene.\n- If you give up or fail to resist during sin overflow, your imago escapes to the Basement instead of the real world.\nThese effects last until the end of the mission. At the end of each mission, the slashes on the Descent talisman are halved (rounding down) and this condition is removed." },
				{ title: "Running Erudition & Enigmata", text: "THE PSYCHIC SEA: The true nature of the psychic sea is unknown. The forces behind grace, blasphemies, and sins exist in what some may consider the noosphere, the collective consciousness of humanity. Introducing Erudition and Enigmata requires an Admin and table to come to terms with an explanation, and establish that truth within their setting. At a baseline, tables should determine the answers to the following three questions (the first two may also be useful for any game of CAIN).\nWhat is a consciousness and subconscious? A consciousness is a state of awareness of oneself and one's surroundings. When a Jaunt or Palace user projects themselves somewhere, the experience is often that of a consciousness displaced from its usual position. A subconscious is where information is stored: stimuli processed in the back end, the body's automatic functions, and memories. Psychic powers that target this part of the brain affect memory, ingrained behavior, and connections. Consider simplifying the mind into active thoughts (what a person is thinking, feeling, and saying right now) and inactive thoughts (things seen, remembered, or processed but not currently thought about).\nWhat is a Palace? Palaces are pieces of the mind that can be traversed. For agents of CAIN this takes the form of a Sanctum; the palaces of Sins carve out a pocket dimension in reality. Forcing a human to have a palace (as Mindwalk does) implies every living being has a traversable mind. These palaces are temporary and small, representing the person's thoughts and memories. The owner usually has some control over them; probing, teasing out thoughts, or invoking feelings may bring subconscious material into view, while a defensive or reserved person may obscure it. Consider what is important to the person, what they find comfort or value in, and their current mental state.\nWhat is the Basement? Memories or thoughts repeated amongst more than one individual form the Basement, a shared subconscious. The Admin should NOT populate it with information or objects not discoverable in the investigation zone. To depict a location in the Basement, take your notes on the real place, subtract, then multiply. Example: a sin host's apartment has a messy desk with mail, a fridge and bed, and a window with the curtains down; the host locked themselves in, starving, stressed by overdue rent. Subtract what the host wasn't using or thinking about (the windows, fridge, and bed). Multiply what they were constantly thinking about (the bills): the Basement shows a massive pile of mail. Describe it quickly and loosely and let players fill the space with questions and actions. Touchstones: Mementos (Persona 5), The Backrooms, Exit 8, Vivarium.\nWhen a player builds the Tulpa that lives in the Basement, treat it like a Whisper user's Shadow: it should represent an aspect of the exorcist it hunts down, such as a fear, a distorted view of the self, or a premonition of their fate. It only exists down there because the exorcist has made themselves seen, willingly or otherwise. So it goes." }
			]
		},
		{
			id: "h-bloom",
			numeral: "",
			source: "harpocrates",
			group: "LVL 4 Clearance",
			requiresApproval: true,
			theme: { color: "#ef6fb5", color2: "#8a2a62", dark: true },
			image: "img/harpocrates/blas-h-bloom.jpg",
			name: "Bloom",
			summary: "Unfold potential and form like petals in spring. Leave change in your wake.",
			flavor: "Unfold potential and form like petals in spring. Leave change in your wake.\nFact: Project XT-271 aims to find a way to preserve the mindstate of imagoed Bloom users before they lose control over their forms. When you imago, you retain full control over your new form and are not hostile to the exos by default until the end of the scene. The admin then takes control when this scene resolves. Research pending. See incident: X-65 Pugile testing log.\nClearance: A LVL 4 Clearance blasphemy, dangerous and experimental in nature. Taking it requires approval and discussion with your Admin, as its existence can impact the narrative of your game.\nBloom and Husk are mutually exclusive: if you take powers from one, you cannot gain powers from the other.",
			passive: {
				id: "as-within", name: "As Within",
				text: "You possess untapped potential. Up to 1/2 CAT ({halfcat}) times per scene, when you gain sin in place of a psyche burst, relieve 1 stress. Whenever you gain a new sin mark, you may choose to evolve it for free. This may stack with other abilities. It is never painful when you sin overflow."
			},
			powers: [
				{ id: "scion", name: "Scion",
					tags: { duration: "1 scene, 1/rest", effect: "Charm", range: "Touch" }, burst: "none",
					text: "This power does NOT cost a psyche burst to use. Imprint your psychic signature onto the soul of another willing exorcist. Select one of your blasphemy powers other than this one, or a sin ability you have on a mark location that the target also has. You grant an ally in range your selected option for the duration of the scene. If granting a blasphemy power, you also temporarily grant any passive required for the power to function to your targets. For palaces and bound sins, you share your own palace or bound sin instead of generating entirely new ones. You may choose to grant an additional choice of blasphemy power or sin ability by gaining 1 sin, up to a max of 2 times." },
				{ id: "pollen", name: "Pollen",
					tags: { duration: "1 scene, 1/scene", effect: "Charm" }, burst: "required",
					text: "Summon scales, petals, particulates, or small flying insects that surround your body in a swarming cloud for the duration.\nThese clouds extend your reach from adjacent to short range, and can manipulate objects as if they were your own hands, using your skill checks when required for rolls.\nIf you would take an action that is risky due to hostile beings, you may use this cloud to obscure your presence and prevent any hostile beings from taking a reaction, dissipating the cloud and ending this power early.\nThis power may easily change the parameters of rolls, such as difficulty or risk." },
				{ id: "bouquet", name: "Bouquet",
					tags: { duration: "1 scene, 1/scene", effect: "Charm" }, burst: "multiple",
					text: "Target a living being and rapidly multiply organs or limbs they possess. Select an organ or body part (i.e. lungs, heart, eyes, arms, legs, skin, etc.) and roll 1d6. You multiply the target organ or body part by the result of the die, as it grows seamlessly and harmlessly within them, on them, or from them. On a 1, the selected part instead rapidly expands and bursts open violently, rolling PSYCHE for damage this would inflict. You may reroll this die by spending an additional psyche burst, up to twice.\nThese additional organs or parts may easily affect the parameters of rolls, such as difficulty or risk (additional livers helping a target process poisons in their body, additional hearts allowing them to perform physical activity for longer, or additional eyes improving their perception). Gain or grant +1D to an ally that can take advantage of this power. Parts grown this way cannot be valid targets for powers or effects that consume limbs or body parts." },
				{ id: "metastasize", name: "Metastasize",
					tags: { duration: "Instant, 1/scene", range: "Touch" }, burst: "multiple",
					text: "Transmute the form of a living being into its next state. When targeting yourself or an exorcist you may select one sin mark they currently have and empower it, causing it to grow in size and pulsate. The next time they would use an ability on that sin mark, they may add +1D to any subsequent rolls that utilize or take advantage of that mark, and may treat their CAT as if it were +1 for any abilities on that mark. It then returns to its usual state.\n1/rest you may target a mundane human instead and make a fate roll. (1): They become a drifter of the Admin's choice. (2-5): They suffer degenerative disorders and internal bleeding, as their body rapidly decays. (6): They become psychically sensitive, as a sinseed emerges within their body. You may reroll this die by spending an additional psyche burst, up to twice.\nThis may easily affect the parameters of rolls, such as difficulty or risk." },
				{ id: "blossom", name: "Blossom",
					tags: { duration: "Instant, 1/rest", range: "CAT area ({cat:area})" }, burst: "multiple",
					text: "Cause organic matter of your choice to violently grow in up to a CAT area ({cat:area}) centered on yourself. Plant life and vegetation may grow to extremely large sizes, which can change the scene drastically. Mundane living beings of your choice inside of this area quickly develop massive tumors that burst open, age a few years, and change in physically traumatic ways. Roll PSYCHE for creative uses of this power. You may increase the CAT of this power by +1 by spending an additional psyche burst, up to twice.\nGain or grant +1D to the next roll that takes advantage of this power. This may easily affect the parameters of rolls, such as difficulty or risk." }
			]
		},
		{
			id: "husk",
			numeral: "",
			source: "harpocrates",
			group: "LVL 4 Clearance",
			requiresApproval: true,
			theme: { color: "#d8d8d8", color2: "#555555", dark: true },
			image: "img/harpocrates/blas-husk.jpg",
			name: "Husk",
			summary: "Shed presence and intent like dead skin. Leave shells in your wake.",
			flavor: "Shed presence and intent like dead skin. Leave shells in your wake.\nFact: Shells birthed from Husk users are a subject of major interest to TEMERITY, as their fragility has made them nigh impossible to transport or conduct further research on. Research pending.\nClearance: A LVL 4 Clearance blasphemy, dangerous and experimental in nature. Taking it requires approval and discussion with your Admin, as its existence can impact the narrative of your game.\nBloom and Husk are mutually exclusive: if you take powers from one, you cannot gain powers from the other.",
			passive: {
				id: "so-without", name: "So Without",
				text: "You are empty. You do not bleed and are resistant to mundane pain. You do not need to breathe. You lack a psychic presence through the perception of other beings, and cannot have your mind read or entered. Whenever you gain sin marks, they are never visible and when you imago you become a Shell instead."
			},
			powers: [
				{ id: "thin", name: "Thin",
					tags: { duration: "1 scene", effect: "Transmute", range: "CAT area ({cat:area})" }, burst: "required",
					text: "You drastically thin the air in a CAT area ({cat:area}) centered on yourself:\n- Humans inside asphyxiate and die in minutes.\n- Supernatural beings, including exorcists, that need to breathe find it hard to function or focus.\n- Fire and other sources of combustion are snuffed out, and cannot be reignited.\n- Exorcists suffer 1 stress after taking an action, if they need to breathe.\nGain or grant +1D to actions that take advantage of this power while it is in effect. This power may easily affect the parameters of rolls, such as difficulty or risk." },
				{ id: "disembowel", name: "Disembowel",
					tags: { duration: "1/scene", effect: "Transmute", range: "Short" }, burst: "required",
					text: "Pull everything meaningful out of something or someone. Select a human being or an object with internal components up to your CAT+1 ({cat+1:size}) in size. For a human target, you may pull out either:\n- A vital organ of choice which teleports into your hand, and causes them to die of injuries (if relevant).\n- One important memory or feeling of the admin's choice, which you can analyze. This leaves the target insensate, motionless, and emotionless until you return it, when they are no longer in range, or if this power ends early. They may return disoriented, confused, and scared.\nFor an object, you pull out a vital component of it (i.e. a car's engine, a phone's SIM card, etc). You may specify what you target when you use this ability, and the Admin determines the final results. Gain or grant +1D to the next roll that takes advantage of this power." },
				{ id: "chaff", name: "Chaff",
					tags: { duration: "Instant", effect: "Summon", range: "Short" }, burst: "required",
					text: "Leave behind psychic husks that are even visible to the mundane. Select yourself or any other sentient being that you can touch. You create a number of near-identical duplicates of your target equal to your 1/2 CAT ({halfcat}). You can place them anywhere within range and move them as you please, but they cannot move on their own and cannot emote or speak. They can, however, be placed in ways that defy gravity (such as on ceilings or walls) without difficulty. When a creature other than you touches them, the duplicate is revealed to be hollow and paper thin before it crinkles away.\nFor the first time in a scene when you would take stress after triggering this power and you have an intact husk of yourself, you may negate that instance of stress and crumple away, having been a husk all along. The husk of your body that is still intact is revealed to be you. You cannot trigger this against severe attacks.\nThis may easily affect the parameter of rolls such as difficulty or risk." },
				{ id: "molt", name: "Molt",
					tags: { duration: "Instant, 1/hunt" }, burst: "none",
					text: "Molt from your own skin, leaving behind everything you once were. When you use this ability, you must do so as a reaction to taking 3 or more stress at once OR by taking 2 stress. Shedding your skin allows you to remove one affliction of choice on yourself and also restores limbs and removes scars that have been afflicted on previous missions (limbs lost or scars afflicted on the current mission will not be removed. Body parts loss due to your powers or psychic abilities cannot be restored this way.)\nRoll PSYCHE. On a failure, you must answer the following question truthfully: What is an important memory you have? The admin removes that memory from you.\nGain or grant +1D on the next action that takes advantage of this power." },
				{ id: "dread", name: "Dread",
					tags: { duration: "1 scene", effect: "Curse", range: "CAT range ({cat:range})" }, burst: "required",
					text: "Select a target within range that you can see. For as long as you can maintain line of sight with the target, both of you become unable to see, perceive, or communicate with any other living beings except for each other. This may cause humans to feel confusion, fear, or a deep sense of dread. In a conflict scene, your target may target you more or create complications and threats focused around you.\nGain or grant +1D to the next roll that takes advantage of this power. This power may easily affect the parameters of rolls, such as difficulty or risk.\nThis effect ends early if you take an injury." }
			],
			extras: [
				{ title: "Shell", text: "Something once alive, now empty.\nShell (sin): Execution Talisman 1.\nShells do not move from the location they were birthed and will crumble at attempts to move them. They take on a form of the exorcist's choice, but are almost always paper thin and empty, regardless of size.\nReactions:\n- Silence (1-6): One exorcist may observe the Shell and relive a memory they had with the exorcist that birthed the Shell. They take 1 non-lethal stress." }
			]
		},
		{
			id: "bonbon",
			numeral: "",
			source: "harpocrates",
			group: "LVL 4 Clearance",
			requiresApproval: true,
			theme: { color: "#ff5ad8", color2: "#b01f8f", dark: true },
			image: "img/harpocrates/blas-bonbon.jpg",
			name: "Bonbon",
			summary: "One for me... and one for you... and one for me!",
			flavor: "One for me... and one for you... and one for me!\nTrigger warning: The Bonbon blasphemy contains depictions of addiction and chemically induced mental control.\nIncident report LVX409, transcript: *A mix of laughter and screaming is audible in the background.* [redacted] No more! Please! [redacted] begins to self mutilate by clawing into his own mouth, attempting to remove it. [redacted] XB01: [XB01 smiles.]\nClearance: A LVL 4 Clearance blasphemy, dangerous and experimental in nature. Taking it requires approval and discussion with your Admin, as its existence can impact the narrative of your game.\nMelt and Bonbon are mutually exclusive: if you take powers from one, you cannot gain powers from the other.",
			passive: {
				id: "as-the-universe", name: "As the Universe",
				text: "You are always able to spend 1 kp to produce a small candy of your choice. Consuming it relieves (1-3): nothing (4+): 1 stress. Some of your powers inflict the Overdose hook."
			},
			powers: [
				{ id: "crunch", name: "Crunch",
					tags: { duration: "1 scene, 1/scene", effect: "Transmute", range: "Short" }, burst: "required",
					text: "You may target an object or living being of up to CAT size ({cat:size}). For the duration of this power, the target becomes metaphysically edible to any living being. The physical composition of the target does not change, but the teeth of other beings pass through it with ease, as if it were made of sugar, and bites of the target taken this way dissolve easily in the mouth. This can easily render objects inoperable or leave injuries on living beings, depending on where they are bitten.\nIf the target was mostly consumed, gain the Overdose hook. If the target was fully consumed, gain the hook twice instead. Mundane beings that eat an affected target are afflicted by high levels of blood sugar and subsequent heart palpitations.\nThis may easily change the parameters of rolls, such as difficulty or risk." },
				{ id: "captivate", name: "Captivate",
					tags: { duration: "1 scene", effect: "Transmute", range: "Short" }, burst: "required",
					text: "Fill a living being or object of up to CAT size ({cat:size}) in range with irresistible psychic energy, forcing all mundane living beings who can perceive the target to become obsessed with it. You can roll PSYCHE to attempt to extend this obsession to a supernatural being the first time one encounters your target. Beings may fight one another over the target, or go to great lengths to claim or obtain it.\nGain or grant +1D to the next action you or your allies make to take advantage of this power. This power may easily affect the parameters of rolls, such as difficulty or risk." },
				{ id: "addiction", name: "Addiction",
					tags: { duration: "1 scene, 1/rest", effect: "Curse", range: "Short" }, burst: "none",
					text: "You may activate this power without spending a psyche burst. You trigger this power when a being in range consumes or imbibes anything ranging from water to food or drugs. Upon activation, the target becomes helplessly addicted to the substance they consumed or imbibed, experiencing intense withdrawal symptoms when not indulging in it after a few minutes. They may become desperate for it to the point of harmful or violent actions towards others or themselves.\nGain or grant +1D to the next action you or your allies make to take advantage of this power. This power may easily affect the parameters of rolls, such as difficulty or risk." },
				{ id: "influence", name: "Influence",
					tags: { duration: "1 scene", effect: "Curse", range: "CAT area ({cat:area})" }, burst: "required",
					text: "Every living being of your choice within a CAT area ({cat:area}) of you becomes immediately inebriated, as if drunk or high. This renders their decision making abilities sporadic or uncontrolled, induces loss of certain motor functions, and sustains any other effects an inebriant such as alcohol or drugs may have on a living being. You may take the Overdose hook up to two times to increase the CAT of this power by +1 per hook taken.\nGain or grant +1D to the next action you or your allies make to take advantage of this power. This power may easily affect the parameters of rolls, such as difficulty or risk." },
				{ id: "spike", name: "Spike",
					tags: { duration: "1 scene, 1/scene", effect: "Charm", range: "Short" }, burst: "required",
					text: "Flood a living being's bloodstream with a cocktail of chemicals and sugars, overloading their nervous system. A mundane being targeted this way feels a warm bliss before experiencing full body convulsions and suffering a fatal heart attack.\nWhen you target yourself or an allied exorcist this way, their synapses and body go into overload, enhancing their physical abilities and reactions. They gain +1 CAT to their base physical capabilities for the rest of the scene. This may easily affect the parameters of rolls, such as difficulty or risk.\nFor the rest of the scene, before your target would make a risky action using their body or physical force, they make take the Overdose hook to roll 1d3 and gain one of the following effects for the duration of that action. (1): The action gains +1D, (2): Physical capabilities gain another +1 CAT, (3): rolls the risk die twice and take the lower result." }
			],
			extras: [
				{ title: "Overdose (hook)", text: "When this hook fills up, gain the following condition:\nOverdose: Your body is overfilled with psychic chemicals, which abuse your dopamine receptors and impair your sense of reality. Actions that require concentrated or focused thinking are always hard by default unless assisted by set-up or teamwork. You may choose to take 1d3 stress to ignore the difficulty penalty on any single roll.\nIf you take a hook for this condition while already in Overdose, you take 1d3 stress instead per slash inflicted. Remove this condition after you rest." }
			]
		},
		{
			id: "melt",
			numeral: "",
			source: "harpocrates",
			group: "LVL 4 Clearance",
			requiresApproval: true,
			theme: { color: "#9eff2e", color2: "#4f8f10", dark: true },
			image: "img/harpocrates/blas-melt.jpg",
			name: "Melt",
			summary: "Weaken the world around you through corrosive psychic influence.",
			flavor: "Weaken the world around you through corrosive psychic influence.\nCASTLE Policy LV4X06: Melt users are to be kept on a full isolation cycle when not deployed. Containment policies include: a minimum of 3 scramble units on containment site per guard shift; PTFE coated walls and locks for any facility housing a Melt user.\nClearance: A LVL 4 Clearance blasphemy, dangerous and experimental in nature. Taking it requires approval and discussion with your Admin, as its existence can impact the narrative of your game.\nMelt and Bonbon are mutually exclusive: if you take powers from one, you cannot gain powers from the other.",
			passive: {
				id: "so-the-soul", name: "So the Soul",
				text: "Your psychic influence is highly corrosive, both mentally and physically. When using PSYCHE for minor effects, they may also:\n- Melt or corrode small bindings touching you, such as ropes or handcuffs.\n- Chemically burn the surface of someone else's skin upon touch.\n- Once per scene, make a mundane human feel weak or dizzy adjacent to you."
			},
			powers: [
				{ id: "soften", name: "Soften",
					tags: { duration: "Until you stop touching", effect: "Curse", range: "Touch" }, burst: "required",
					text: "Mold someone's mind in your hands like putty. A mundane human being in your touch immediately becomes unable to focus on anything except for the sensation of your skin while you are speaking to them. While touching them, you can suggest any course of actions that are not outright harmful to themselves (i.e. \"drive the car down this street\" or \"unlock the password on this computer\") and they will willingly do so to their best ability. When you stop touching them, this power ends.\nThis may easily affect the parameters of rolls, such as difficulty or risk." },
				{ id: "cloud", name: "Cloud",
					tags: { duration: "1 scene", effect: "Transmute", range: "CAT area ({cat:area})" }, burst: "required",
					text: "Subtly spread your psychic influence through the air in up to a CAT area ({cat:area}) centered on yourself. All mundane objects of your choice within this range begin to degrade and slough off as if exposed to a strong acid, including buildings, weapons, gear, or clothing. Breathing in the air may be painful to mundane living beings.\nGain or grant +1D to the next action you or your allies make to take advantage of this power. This power may easily affect the parameters of rolls, such as difficulty or risk." },
				{ id: "caustic", name: "Caustic",
					tags: { duration: "Permanent" }, burst: "none",
					text: "Passive: Your blood is highly corrosive to everything other than your own body, and is capable of melting most things. Mundane harmful or violent actions that pierce your skin deal -1 stress (taking a minimum of 1 stress) as your blood melts and singes the resulting attack. Blades corrode, bullets dissolve, and unprotected fists against your blood may recoil back in pain.\nActive: You may take 1d3+1 stress at any time to bite a part of your mouth, drawing caustic blood and spraying it forth, which may dissolve or burn living beings or objects it touches. While injured, you may reduce the stress cost for this action by a number equal to your current number of injuries, as you pool blood from your damaged body.\nRoll PSYCHE for effects that would be risky, unclear, or inflict harm. Gain or grant +1D on the next action that takes advantage of this power's active ability." },
				{ id: "slip", name: "Slip",
					tags: { duration: "1 scene, 1/scene", effect: "Charm", range: "Self" }, burst: "required",
					text: "Dissolve your presence, making you harder to perceive or physically restrain. A thin psychic membrane forms over your skin, making you physically slippery and near impossible to grab or restrain. Additionally, your words and presence slide off the consciousness, reducing the difficulty of actions to hide from, escape, or avoid others. Mundane beings may get mild headaches or lose their train of thought when attempting to focus on you or the words you say.\nGain or grant +1D to the next action you or your allies make to take advantage of this power. This power may easily affect the parameters of rolls, such as difficulty or risk." },
				{ id: "toxin", name: "Toxin",
					tags: { duration: "Instant", effect: "Summon", range: "Touch" }, burst: "required",
					text: "Produce a small dose of potent neurotoxin from any area of skin on your (i.e. body, palm, fingers, lips, etc). You may choose to release this toxin into a container or different medium such as food or a syringe, or allow it to linger on your skin. This neurotoxin affects mundane beings instantly upon contact or consumption. Choose one of the following effects for the toxin:\n- Paralytic: The victim is paralyzed completely, unable to take any physical actions or movements.\n- Hallucinogen: The victim experiences vivid and realistic hallucinations, which may hinder or stagger them.\n- Lethal: The victim dies, as the toxin shuts down their primary bodily functions.\nYou may roll PSYCHE to attempt to affect a psychic being with your toxin, spending a burst regardless of success. Upon success, the toxin only has half the normal effects it would on a mundane being: partially paralyzing them, causing mild hallucinations, or injuring them as opposed to killing them outright.\nThis may easily affect the parameters of rolls, such as difficulty or risk." }
			]
		},
		{
			id: "conquest",
			source: "harpocrates",
			numeral: "",
			group: "XK",
			requiresApproval: true,
			theme: { color: "#e8e8e8", color2: "#7a7a7a", dark: true },
			image: "img/harpocrates/blas-conquest.jpg",
			name: "Conquest",
			summary: "Take control. It's what your kind does.",
			flavor: "Take control. It's what your kind does.\nFact: Conquest appears to be an archaic version of the Bind blasphemy, predating the act of binding itself with something much older and unknown.\nXK: Once an XK blasphemy has been gained, that person is the only user of it in the world, and cannot gain any of the other XK abilities. If all of the XK blasphemies exist in the world at once, the Admin may begin an XK-Scenario.\nXK-Class: Taking this blasphemy requires admin approval and cannot be taken on character creation. 1/mission the admin may use one of the powers you have from this blasphemy without spending a psyche burst and ignoring usage limits. The 1st power you take from this blasphemy costs 2 advances instead of one.",
			trackers: [
				{ id: "xk-scenario", name: "XK-Scenario", segments: 66, start: 0,
					text: "Optional, kept by the Admin once an XK blasphemy has manifested in the world. Slash it once whenever a player character uses a power from an XK blasphemy, and again if the power causes widespread damage, harm, or panic. At the end of each mission roll 1d3 and slash that many times. If a character completes a mission without using any XK power and answers 'yes' to 'Are you attempting to suppress the unsettling power within you?' or 'Do you believe that fate can be changed?', remove a slash per yes (this cannot undo flagged events). 11: a disaster destroys a city or town and a sin is born. 22: a second XK blasphemy manifests. 33: a major political leader dies. 44: a third XK blasphemy manifests, belonging to someone opposed to CAIN. 55: AUTHORITY calls for the execution of all XK wielders. 66: the last of the horsemen arrive. The End Begins." }
			],
			passive: {
				id: "white-horse", name: "White Horse",
				text: "During a mission, small objects you have ownership over or things you are holding in your hand cannot be taken away from you by any means."
			},
			powers: [
				{ id: "command", name: "Command",
					tags: { duration: "1 scene", effect: "Curse", range: "Long" }, burst: "required",
					text: "Issue a command to a CAT sized group ({cat:people}) of humans or a single supernatural being. Your target(s) must be able to hear you. If this being has a higher CAT than you, take 1d3+1 stress for each category of difference. Choose one of the following commands:\n- Freeze: They stop what they are doing completely, and become unable to move for a few moments, until moved or harmed by another living being.\n- Drop: They abruptly drop everything they are holding.\n- Approach: They approach you as quickly as possible.\n- Flee: They attempt to escape from you as quickly as possible.\nGain or grant +1D to the next action that takes advantage of this power. This may easily affect the parameters of rolls, such as difficulty and risk." },
				{ id: "anchor", name: "Anchor",
					tags: { duration: "1 scene", effect: "Transmute", range: "Short" }, burst: "required",
					text: "Create a zone of overwhelming pressure equal to CAT area ({cat:area}) centered on a point within range. Within this area, your willpower manifests as a great weight within the air, pushing down on living beings within it:\n- Targets of your choice find it difficult to move freely in the area.\n- No one, including yourself, can leave the area without immediately taking 1d3+1 stress, or 1+1/2 CAT slashes as a cost.\nGain or grant +1D to the next roll that takes advantage of this power. This effect ends early if you use another blasphemy power." },
				{ id: "tame", name: "Tame",
					tags: { duration: "1 scene", effect: "Curse", range: "Short" }, burst: "required",
					text: "You may select any number of traces whose combined execution talisman is less than or equal to your CAT+1 ({cat+1}), a drifter whose CAT (determined by the admin) is lower than or equal to yours, or any number of mundane animals within range. They now treat you as if you were an ally or friend, and may follow or listen to simple commands. This control breaks if you or an ally directly harm the tamed creature(s).\nThis may easily affect the parameters of rolls, such as difficulty and risk." },
				{ id: "pestilence", name: "Pestilence",
					tags: { duration: "1/hunt", effect: "Curse", range: "CAT+2 area ({cat+2:area})" }, burst: "required",
					text: "Control the duplication of harmful pathogens on the surface of the target's skin, giving them a severe disease which rapidly spreads to all mundane humans within a CAT+2 area ({cat+2:area}) by the end of the scene. When the scene transpires, the diseases granted are considered mundane. While sickened these humans may grow weak, desperate, or potentially die if not treated within an appropriate time frame.\nGain or grant +1D to the next action that takes advantage of this power. This may easily affect the parameters of rolls, such as difficulty and risk." },
				{ id: "territory", name: "Territory",
					tags: { duration: "1 scene, 1/rest", range: "CAT+1 area ({cat+1:area})" }, burst: "required",
					text: "Designate an area equal to your CAT+1 ({cat+1:area}) centered on yourself as your \"territory\" for the rest of the scene. Supernatural creatures instinctively know that this area \"belongs\" to you for the duration. Mundane humans may instinctively act in deference to you, or intuitively believe you possess ownership of buildings or structures within this area, unless they outright know otherwise.\nGain or grant +1D to the next roll that takes advantage of this power. This may easily affect the parameters of rolls, such as difficulty and risk." }
			],
			extras: [
				{ title: "XK-Scenarios", text: "Once an XK blasphemy has been gained, that person is the only user of it in the world, and cannot gain any of the other XK abilities. If all of the XK blasphemies exist in the world at any given moment (players, NPCs, or otherwise), the Admin may choose at any time to begin an XK-Scenario, a potentially apocalyptic series of events that not only threaten the structure of CAIN, but the state of the world as we know it. The Admin decides how or why this manifests, along with the extent to which the exorcists have to deal with it.\n- XK-Grandfather Clock: The Spindle is missing. No living being can die, no matter what.\n- XK-London Bridge: The seraph has been destroyed. Something has killed the virtues. Fortitude is dead.\n- XK-Freudian Slip: The entity known as Mother has infected multiple members of AUTHORITY. Her plan is already set in motion.\n- XK-All Tomorrows: Something has come from space. It can manipulate grace better than we can.\nThe XK designation is assigned to the four exceedingly rare and powerful blasphemies known as Conquest, War, Famine, and Death, named after the Four Horsemen of the Apocalypse. There has never been a point in human history where all four of them have come into existence at the same time. Not yet." }
			]
		},
		{
			id: "war",
			source: "harpocrates",
			numeral: "",
			group: "XK",
			requiresApproval: true,
			theme: { color: "#e8141c", color2: "#7a0b0f", dark: true },
			image: "img/harpocrates/blas-war.jpg",
			name: "War",
			summary: "Wage war with overwhelming violence. It's what your kind does.",
			flavor: "Wage war with overwhelming violence. It's what your kind does.\n\"War, the red rider, comes not with prayer but with steel, an exorcist of destruction, casting out peace like a demon, declaring that sins be laid bare in blood.\" - Exorcist Father Santori\nXK: Once an XK blasphemy has been gained, that person is the only user of it in the world, and cannot gain any of the other XK abilities. If all of the XK blasphemies exist in the world at once, the Admin may begin an XK-Scenario.\nXK-Class: Taking this blasphemy requires admin approval and cannot be taken on character creation. 1/mission the admin may use one of the powers you have from this blasphemy without spending a psyche burst and ignoring usage limits. The 1st power you take from this blasphemy costs 2 advances instead of one.",
			trackers: [
				{ id: "xk-scenario", name: "XK-Scenario", segments: 66, start: 0,
					text: "Optional Admin talisman (see Conquest's XK-Scenarios). Slash once per XK power used, again if it causes widespread damage, harm, or panic, and 1d3 at the end of each mission. At 66, the End Begins." }
			],
			passive: {
				id: "red-horse", name: "Red Horse",
				text: "All weapons you are wielding are considered to have a +1 bonus to their current CAT. You can telekinetically pull loose weapons not being stored, held, or affixed to a surface within a short distance to your hands."
			},
			powers: [
				{ id: "spear", name: "Spear",
					tags: { duration: "Instant, 1/scene" }, burst: "multiple",
					text: "Become a weapon of mass destruction and propel yourself at mach speed up to a CAT range ({cat:range}). You break through walls, objects, and structures, and damage all creatures you launch yourself into or through this way. You do not take any physical damage while using this power. Roll PSYCHE to determine damage, and you may damage multiple creatures at once this way.\nYou may spend additional psyche bursts on this power to increase the CAT distance you travel by +1 per additional burst spent.\nGain or grant +1D to the next roll that takes advantage of this power." },
				{ id: "weapon", name: "Weapon",
					tags: { duration: "1 scene", effect: "Transmute", range: "Touch" }, burst: "required",
					talisman: "1/2 CAT+2",
					text: "Turn any mundane object into a weapon of your choice. You decide its shape, form, and size, but it always has a CAT equal to yours. It has an execution talisman of your 1/2 CAT+2 before it is destroyed, may be targeted by enemies separately, and it takes 1 stress every time it is used for an attack. It is considered supernatural, but cannot gain bonus dice from set up, teamwork, or outside abilities other than divine agony. Roll PSYCHE when choosing to attack with it. This roll always gains +1D for each of the following questions you can answer yes to:\n- Is this object important to someone else?\n- Is this object important to you?\n- Is this object traditionally dangerous, powerful, or of note?\nThe object is gone forever once the weapon is destroyed." },
				{ id: "detonate", name: "Detonate",
					tags: { duration: "Instant, 1/scene", range: "CAT range ({cat:range})" }, burst: "required",
					text: "Select any point within CAT distance ({cat:range}) that you can see. You create an explosion in an area up to your CAT+1 ({cat+1:area}), at a minimum of CAT 2. This blast will always reach its maximum area size by default. Roll PSYCHE to successfully contain the blast to any area smaller than CAT 3, spending a psyche burst regardless of success or failure. Deal a number of slashes equal to your 1/2 CAT + 1. If you or another Exorcist are caught in this blast, they take slashes dealt as stress.\nThe explosion is powerful, bright, and loud. It evaporates most structures and mundane objects, and is instantly fatal to humans. If this causes considerable and substantial damage, your Admin may dock any amount of scrip for clean up." },
				{ id: "tacticus", name: "Tacticus",
					tags: { duration: "1/rest", effect: "Charm", range: "Self" }, burst: "none",
					text: "This power does not cost a psyche burst to use. Wage a simulacrum of war within your mind of the current battle, that allows you to predict your opponent's next move. Select a number of combatants in the same scene as you, then ask your Admin the following question which they must answer truthfully:\n- Can I win this fight?\nIf the answer is a yes, gain +1D on the first action you take this scene to inflict violence or harm against the selected combatants. Regardless of the answer, up to 1/2 CAT ({halfcat}) times during this scene you can roll the risk die twice on your turn and take the higher number, having seen all possibilities." },
				{ id: "bellum", name: "Bellum",
					tags: { duration: "1 scene, 1/rest", range: "CAT+1 area ({cat+1:area})" }, burst: "required",
					text: "Fill living beings around you within a CAT+1 area ({cat+1:area}) with extreme anger and the urge to commit violence. All beings of your choice within range are filled with this roiling emotion, which may influence them to attack each other as they struggle to differentiate friend from foe. For the duration, all creatures under the effect of this rage also have their physical CAT increased by 1, even if they are mundane in nature.\nThis may easily affect the parameters of rolls, such as difficulty or risk." }
			]
		},
		{
			id: "famine",
			source: "harpocrates",
			numeral: "",
			group: "XK",
			requiresApproval: true,
			theme: { color: "#d9d9d9", color2: "#5a5a5a", dark: true },
			image: "img/harpocrates/blas-famine.jpg",
			name: "Famine",
			summary: "Starve the world of everything meaningful. It's what your kind does.",
			flavor: "Starve the world of everything meaningful. It's what your kind does.\nWARNING: Spared Toad hosts manifesting due to food or housing insecurity are to be heavily monitored by SEER program EOD for possible Famine manifestation...\nXK: Once an XK blasphemy has been gained, that person is the only user of it in the world, and cannot gain any of the other XK abilities. If all of the XK blasphemies exist in the world at once, the Admin may begin an XK-Scenario.\nXK-Class: Taking this blasphemy requires admin approval and cannot be taken on character creation. 1/mission the admin may use one of the powers you have from this blasphemy without spending a psyche burst and ignoring usage limits. The 1st power you take from this blasphemy costs 2 advances instead of one.",
			trackers: [
				{ id: "xk-scenario", name: "XK-Scenario", segments: 66, start: 0,
					text: "Optional Admin talisman (see Conquest's XK-Scenarios). Slash once per XK power used, again if it causes widespread damage, harm, or panic, and 1d3 at the end of each mission. At 66, the End Begins." }
			],
			passive: {
				id: "black-horse", name: "Black Horse",
				text: "By maintaining eye contact with someone for a few moments, you may instinctively know what it is they desire most. Gain +1D on your next roll to take advantage of this knowledge."
			},
			powers: [
				{ id: "scarcity", name: "Scarcity",
					tags: { duration: "Entire hunt, 1/hunt", effect: "Transmute", range: "CAT+2 area ({cat+2:area})" }, burst: "none",
					text: "This power does not cost a psyche burst to use. Completely drain the world around you of resources. Arsenals of weapons will be left scarce, guns empty of ammunition. Shelves of supplies grow emptier, commonplace items mysteriously under stocked. Basic necessities such as food, water, and electricity slowly disappear and become difficult to find, with only meager amounts left for those within the area.\nWhenever pressure increases, the impact of this power becomes more noticeable and drastic, which may cause unrest or panic among the mundane population within the area of effect. As the effect moves with you, parts of the investigation zone that are not within the area of effect slowly recover their resources over time.\nThis may easily affect the parameters of rolls, such as difficulty or risk." },
				{ id: "desiccate", name: "Desiccate",
					tags: { duration: "Instant", range: "CAT+1 area ({cat+1:area})" }, burst: "required",
					text: "Completely dry out an area equal to CAT+1 ({cat+1:area}) around you of its moisture. This does not affect supernatural beings, but this may kill plant life, remove almost all traces of water, or turn mundane beings into dried out husks. This will leave humans barely alive.\nGain or grant +1D to the next action that takes advantage of this power. This may easily affect the parameters of rolls, such as difficulty and risk." },
				{ id: "empty", name: "Empty",
					tags: { duration: "Until rest", effect: "Curse", range: "Short" }, burst: "required",
					text: "Choose up to a CAT number ({cat}) of individual living beings within range, causing them to experience extreme anhedonia, a lack of ability to experience pleasure, joy, or satisfaction. This easily alters their state of mind, and may cause individuals to overexert, overindulge, or give up on actions they would have otherwise taken. While emptied, living beings become more susceptible to the influence of others. This may also break or render ineffective abilities and supernatural phenomena that manipulate emotions.\nGain or grant +1D to the next action that takes advantage of this power." },
				{ id: "amicide", name: "Amicide",
					tags: { duration: "1 scene, 1/rest", effect: "Curse", range: "Long" }, burst: "required",
					text: "Induce uncontrollable cannibalism and starvation on up to a CAT+1 sized group ({cat+1:people}) of beings within range, causing them to devour each other almost immediately after this power is used. Traces may turn on one another, and mundane humans may be driven to consume each other. This may help neutralize a conflict scene groups of minor enemies, or provide a flashy and violent distraction.\nGain or grant +1D to the next action that takes advantage of this power. This may easily affect the parameters of rolls, such as difficulty and risk." },
				{ id: "flock", name: "Flock",
					tags: { duration: "Instant", effect: "Summon", range: "CAT range ({cat:range})" }, burst: "onSuccess",
					text: "Call upon mundane living beings within range that travel together, such as pests, crows, rats, foxes, insects, or other creatures of your choice. Then, select a target in range.\nThese animals will attempt to devour your target, ripping off flesh, skin, or other pieces of consumable organic material until they have reached bone. They flee shortly after. When you use this power, roll PSYCHE and answer the following questions, gaining +1D for each 'yes' answer (only spending a Psyche Burst on success):\n- Are you outside and near nature?\n- Is your target wounded or bleeding?\nThis may easily affect the parameters of rolls, such as difficulty and risk. This power cannot be used if your flock cannot reach the target, such as if they are in an enclosed or sealed space." }
			]
		},
		{
			id: "death",
			source: "harpocrates",
			numeral: "",
			group: "XK",
			requiresApproval: true,
			theme: { color: "#c8e89a", color2: "#6f8f3a", dark: true },
			image: "img/harpocrates/blas-death.jpg",
			name: "Death",
			summary: "Drag everything towards its rightful end. It's what your kind does.",
			flavor: "Drag everything towards its rightful end. It's what your kind does.\nTheory EOD6: The existence of a Death user in the current world would explain the mysterious phenomena that allows exorcists to defy fate.\nXK: Once an XK blasphemy has been gained, that person is the only user of it in the world, and cannot gain any of the other XK abilities. If all of the XK blasphemies exist in the world at once, the Admin may begin an XK-Scenario.\nXK-Class: Taking this blasphemy requires admin approval and cannot be taken on character creation. 1/mission the admin may use one of the powers you have from this blasphemy without spending a psyche burst and ignoring usage limits. The 1st power you take from this blasphemy costs 2 advances instead of one.",
			trackers: [
				{ id: "xk-scenario", name: "XK-Scenario", segments: 66, start: 0,
					text: "Optional Admin talisman (see Conquest's XK-Scenarios). Slash once per XK power used, again if it causes widespread damage, harm, or panic, and 1d3 at the end of each mission. At 66, the End Begins." }
			],
			passive: {
				id: "pale-horse", name: "Pale Horse",
				text: "You can mildly control the life force of a mundane human within short range. You can allow a human on the brink of death to survive for much longer than normal. Once per rest, you may instantly kill a human that you can touch."
			},
			powers: [
				{ id: "sap", name: "Sap",
					tags: { duration: "Instant", range: "Short" }, burst: "required",
					text: "Siphon the psychic life force of another living being into yourself or others. Roll PSYCHE to deal slashes to a target's execution talisman, removing a combined total amount of stress from yourself or allies equal to 1+ the amount of slashes dealt. Gain +1D for each question you can answer 'yes' to (max of +3D):\n- Is your target severely injured?\n- Is the target scared, apprehensive, or fearful?\n- Are you severely injured?\nIf a human receives life force through this power, they can be easily healed of injuries and afflictions. This may easily affect the parameters of rolls, such as difficulty and risk." },
				{ id: "obliteration", name: "Obliteration",
					tags: { duration: "Instant, 1/scene", range: "CAT range ({cat:range})" }, burst: "required",
					text: "Remove a chunk of the living world within range from existence, which can be up to CAT size ({cat:size}). This completely erases light, heat, and organic matter, as if it had never existed in the first place. Roll PSYCHE for creative uses of this power. This may automatically kill mundane living beings if they are caught within its area of effect.\nGain or grant +1D to the next roll that takes advantage of this power." },
				{ id: "fate", name: "Fate",
					tags: { duration: "Instant, 1/hunt", range: "Long" }, burst: "all",
					text: "You may trigger this power as a reaction whenever you or an ally in range fails their resist roll or suffers instant death. Spend all of your remaining psyche bursts (min 1). The Admin must offer a deal that would allow the target to succeed their resist roll or avoid suffering instant death. If your target agrees to the deal, it cannot be broken. If they reject the deal, refund all psyche bursts spent and gain +1D to your next roll.\nSome examples of deals that could be made are: (Your name and face becomes known and unforgettable to the wrong people. You are beset with a permanent and debilitating affliction. Your body becomes weak and frail. The next time you die will be brutal, painful, and unavoidable, regardless of this power.)\nIf the deal is taken, you allow the scene to play out as if the target succeeded their resist roll or did not take their last source of stress, remove 1 injury from them and clear all stress on their current talisman, and gain 1d3 sin." },
				{ id: "entropy", name: "Entropy",
					tags: { duration: "1 scene", effect: "Transmute", range: "CAT area ({cat:area})" }, burst: "required",
					text: "You accelerate the flow of time for all mundane beings and objects within a CAT area ({cat:area}) around you. They rapidly age and decay, altering them accordingly:\n- Small animals quickly die, as their lifespan plays out in seconds.\n- Humans reach old age or expire.\n- Objects deteriorate, rust, or malfunction.\n- Injuries may heal quickly or fester, depending on their circumstances.\nGain or grant +1D to the next action that takes advantage of this power." },
				{ id: "empathy", name: "Empathy",
					tags: { duration: "Instant, 1/rest", range: "CAT area ({cat:area})" }, burst: "multiple",
					text: "You may trigger this power in response to a living being dying within close range of you, making them the primary target of this ability. Every mundane human within a CAT area ({cat:area}) dies in the same way your original target died. A decapitation results in everyone's heads falling off as if sliced. A lethal car accident would not manifest additional cars, but crush and mangle the bodies of other humans.\nIf a supernatural being with 2 or less segments remaining on its talisman is in this area, you may make a PSYCHE roll. On a success, they die the same way your target did.\nYou may spend up to 2 additional psyche bursts to increase the CAT of this power by +1 per burst spent." }
			]
		},
	];

	var virtues = [
		{
			id: "chastity",
			name: "Chastity",
			epithet: "The Restraint",
			source: "harpocrates",
			image: "img/harpocrates/virtue-chastity.jpg",
			theme: { color: "#ffc8e6", color2: "#b8678f", dark: true },
			flavor: "A mystery to even their fellow virtues, Chastity is CAIN's most reclusive yet vital asset. Born with an exorbitantly high amount of Grace, their physical body caved in against the pressure of the psychic sea. When in contact with other beings with Grace or Sin, Chastity becomes sick and nauseous. Chastity's high blasphemy Iron Maiden creates a nigh-impenetrable suit of psychokinetic armor with the sole purpose of preventing anything and everything from reaching its user, and they can control it from thousands of miles away. Exorcists who bond with Chastity project it over CAIN sanctioned technology deployed to the field via Orbital SERAPH Delivery systems.\nThere is a sect of exorcists bonded with Chastity who are designated the \"Battle Maiden\" Division of CASTLE. They are often deployed when a SIN event is unavoidable, and complete such missions with ease.",
			likes: ["Phone Calls", "Online Games", "Horror Movies", "Faith"],
			dislikes: ["Charity", "Velvet", "Parties", "Skin Contact"],
			food: "White Rice, Potato Chips",
			stricture: "You cannot engage in immodest or indecent acts. You always roll 0d on actions that would cause you to touch skin with another exorcist or human.",
			bonds: [
				{ rank: 0, text: "You can force humans to be unable to make skin contact with you, always hovering at least 2 inches away. You may do this once a mission and it lasts until rest." },
				{ rank: 1, text: "Gain the Iron Maiden blasphemy." },
				{ rank: 2, text: "Gain +1 customization for free at the start of each mission for your Iron Maiden." },
				{ rank: 3, text: "When using Iron Maiden and answering \"yes\" on all three questions, you summon it exactly where you want it. If using this offensively, it deals a number of slashes equal to your 1/2 CAT ({halfcat})." }
			],
			powers: [
				{ id: "iron-maiden", name: "Iron Maiden", rank: 1, burst: "all",
					tags: { duration: "Special", effect: "Summon" },
					text: "You summon an Iron Maiden to your general location via SERAPH Orbital Delivery, granting numerous enhancements when donned. It enters a state of stasis when it lands, where it cannot be harmed and only you may enter it. The Exorcist may don the Iron Maiden while adjacent to it as a free action. Spend all your remaining psyche bursts (min 1) and all of your remaining KP. Then answer yes or no to the following questions:\n- Did you spend at least 2 Psyche bursts?\n- Did you spend at least 3 KP?\n- Are you in an open area visible from the sky?\nFor every yes you may pick one of the following:\n- The Iron Maiden arrives somewhere in a close distance.\n- The Iron Maiden arrives within a few seconds.\n- The Iron Maiden arrives without complications.\nThe Admin decides the conditions of the delivery, having to abide by your selections. The Iron Maiden cannot take longer than 4 minutes to arrive and must land somewhere within a far distance from you. The Iron Maiden returns to orbit at the end of the scene you don it in.\nOnce donned, the Iron Maiden can take 4+1/2 CAT stress before it breaks, and has the following effects:\n- Anything that would affect you affects your Iron Maiden instead (stress, severe attacks, psychic abilities). Stress that exceeds the Iron Maiden's maximum stress is taken by you.\n- It cannot gain hooks or afflictions.\n- You can still use any powers from blasphemies you have while wearing the Iron Maiden.\n- By default your Iron Maiden only has access to martial attacks (punching, kicking, etc) which are mundane by default and use your force OR interfacing score.\nYour Iron Maiden gains access to new passives and abilities based on the Customizations table. Pick a number at the start of mission equal to your 1/2 CAT ({halfcat}). Use of these powers do not cost a psyche burst.\nCustomizations:\n- ATLAS Enhancement Suite: Passive: Iron Maiden counts as CAT+1 for size, strength, and attacks.\n- BISHAMONTEN Defense Matrix: Passive: Reduce all incoming stress by 2 (taking a minimum of 1 stress). Reduce talisman of your Iron Maiden by 2.\n- SLEIPNIR Propulsion System: Instant: Once during this scene you may act without the Admin rolling a risk die. Spend 2 Psyche Burst to use this effect again.\n- HEPHAESTUS Death Match Protocol: Curse, Short: Pick a target and roll PSYCHE. On a success you are chained to each other and cannot move further than a short distance apart. This may easily affect the parameters of rolls such as difficulty or risk.\n- HOU YI 28mm Rifle: Instant, CAT Range, Supernatural: Roll PSYCHE to deal damage. Roll +1d if the target is distracted or hindered in some way. Roll +1d if the target does not see you. Deal +1 slash if getting 2 or more 6's. Cannot use this power again without taking an action to reload.\n- CERBERUS 3 Track Chainsaw: Instant, Short, Supernatural: Roll PSYCHE for damage. On 2+ successes, the target cannot regain segments on its execution talismans until it has taken 3 reactions.\n- ESHU Pneumatic Pile Bunker: Instant, Short, Supernatural: Roll PSYCHE for damage. Instantly destroy any structure in range that is your CAT+1 ({cat+1:size}) or smaller." }
			]
		},
		{
			id: "sobriety",
			name: "Sobriety",
			epithet: "The Resolute",
			source: "harpocrates",
			image: "img/harpocrates/virtue-sobriety.jpg",
			theme: { color: "#ffa51a", color2: "#a8650a", dark: true },
			flavor: "A pessimistic exorcist with the most failed missions in CAIN history, Sobriety's status as a Virtue is constantly under question from CASTLE and SEER admin, but is kept on a freezing schedule at AUTHORITY's behest. Sobriety's grace wraps itself around their nerves, forcing a \"muscle memory\" like structure against them in response to strong stimuli. Their high blasphemy Clarity kicks the brain's synapses into a supernaturally enhanced fight-or-flight response, but also forces the user to remember sensations like pain vividly and frequently. Despite this, Sobriety has survived more missions than any exorcist in the modern day, and is deployed to guarantee the survival of high profile assets. Sobriety's \"danger-sense\" while sober and injured is unparalleled.",
			likes: ["Alcohol", "Recreational Drugs", "Film Noir", "Prudence (cleared Sobriety's 98 scrip debt to CASTLE)"],
			dislikes: ["CAIN Orbital Lasers (the only known exorcist to have survived a CAIN orbital laser strike post mission failure)", "Carpet Bombing", "Staying Sober", "Pain", "Losing Bets", "Faith"],
			food: "Rare Steak (not available due to meal budget plan LX921)",
			stricture: "You cannot consume substances such as cigarettes, alcohol, or other inebriants. You always roll 0d on actions done out of avoiding immediate pain.",
			bonds: [
				{ rank: 0, text: "You never upset another individual when turning them down: offers, substances, advances, or otherwise." },
				{ rank: 1, text: "Gain the Clarity power. You may use it once per mission." },
				{ rank: 2, text: "You gain the ability to borrow scrip from other exorcists. Once per mission, breaking your first stricture relieves 1 sin." },
				{ rank: 3, text: "You gain access to Lucidity of the Broken Mind. You may only activate it when you are on the brink of death and it persists afterwards as a permanent passive." }
			],
			powers: [
				{ id: "clarity", name: "Clarity", rank: 1, burst: "all",
					tags: { duration: "1 scene", effect: "Charm", range: "Self" },
					text: "You may only use this power if you have 2 or more injuries. The pain jolts your synapses awake and allows your mind and body to move in intuitive ways. You sear every available sensation into the framework of your grace and your body speeds up in response. Use ALL of your remaining psyche bursts (min 1). For the rest of the scene your body instinctively reacts to and avoids danger. You gain the following benefits:\n- Roll an additional risk die against your actions, only taking the highest result.\n- Roll +1D on any action to avoid, defend against, or react to danger. This can also apply to rolls to negate threats, resolve complications, or the defend action. This breaks your second stricture.\n- Automatically succeed in any roll required for you to flee the current conflict scene. This breaks your second stricture.\nWhen this power ends you suffer severe full-body pain and all actions you take become hard by default unless assisted by set-up or teamwork until your next rest. When you rest after using this ability gain +1D resting die.\nWhile inebriated you cannot activate this power. Breaking your first stricture will always end this power early." },
				{ id: "lucidity-of-the-broken-mind", name: "Lucidity of the Broken Mind", rank: 3, burst: "none",
					tags: { duration: "Permanent" },
					text: "Your brain opens up infinite pathways and possibilities when you experience your pain in full, allowing you to perceive all paths in which you die, and find the one where you don't.\nWhen you are on the brink of death, you take -3 stress from all sources. You cannot increase this reduction in any way. Whenever you would reduce damage from a hostile being this way, gain 1 sin. Suffering instant death while on the brink of death is unavoidable. All attempts to revive you fail. Clarity also gains the following effect:\n- Gain a \"Foresight\" talisman whose segment length is equal to the number of injuries you have when you activate Clarity. While the power is active, you may slash this talisman once to have you or an ally you can reach avoid any source of external harm, reducing that instance of stress by 3. When you fully slash this talisman, Clarity ends early." }
			]
		},
		{
			id: "absolution",
			name: "Absolution",
			epithet: "The Mourner",
			source: "harpocrates",
			image: "img/harpocrates/virtue-absolution.jpg",
			theme: { color: "#ff5a0a", color2: "#a83300", dark: true },
			flavor: "Absolution is considered one of the most powerful binders in the history of CAIN, wielding control over a CAT 5 Hound codenamed Guillotine that manifested upon the brutal and untimely death of their ex-spouse. Their strange and empathetic attitude towards sins has notably earned them the wariness of AUTHORITY, but their usefulness to CAIN shines in their near 0 civilian casualty rate and an execution record second only to Justice. Absolution mourns the fate of sin hosts and their subsequent sins, and believes that the fastest route to peace for them is swift and severe execution.\nThe high blasphemy Guillotine is a shared contract with the sin of the same name, allowing users to summon a fraction of its power, becoming more lethal if they mirror Absolution in their actions and motives.",
			likes: ["Guillotine", "Firearm discipline", "Small Talk", "Photography", "Death Metal"],
			dislikes: ["Non-committal relationships", "Hope", "Justice", "Thunderstorms"],
			food: "Youtiao Dough Sticks, Beef Stew",
			stricture: "You cannot commit acts of cruelty or prolong suffering. You always roll 0d on actions that put civilians or innocents in harm's way.",
			bonds: [
				{ rank: 0, text: "When someone tries to confess the truth to you, you can always hear it, regardless of distance, physical, or psychic barriers." },
				{ rank: 1, text: "Gain the Guillotine power. You may use it once per mission." },
				{ rank: 2, text: "You may take 2 non-lethal stress to gain +2D on any roll to connect to, empathize with, or get closer to any other individual." },
				{ rank: 3, text: "You may use Guillotine multiple times in a mission. For every time after the first you must sacrifice an existing limb of choice. If you have no more limbs to sacrifice, your body disappears after the blasphemy resolves. Make a new exorcist." }
			],
			powers: [
				{ id: "guillotine", name: "Guillotine", rank: 1, burst: "all",
					tags: { duration: "Instant", range: "CAT range ({cat:range})" },
					text: "You summon the CAT 5 sin Guillotine to a point within range that you can see. It immediately destroys an area of space equal to your 1/2 CAT ({halfcat:area}) within range with ripping buzzsaws, jutting blades, and utter destructive force. Use ALL of your remaining psyche bursts (min 1). This instantly eviscerates mundane objects, structures, and humans caught within the area. Allied exorcists caught in this area take 2d3 stress, and every foe caught in the area takes 1 slash. Roll PSYCHE to deal severe damage to one foe in the area, adding a die for each of the following questions you can answer yes to [up to a max of 1/2 CAT+3 bonus dice]:\n- Is this area devoid of humans and exorcists other than yourself?\n- Do you feel empathy for the target?\n- Is half or more of the target's execution talisman slashed?\n- Is your target grieving, mourning, or experiencing loss of some kind?\n- Have all 3 trauma questions been answered? (Sins only).\n- Do you plan on executing the sin? (Sins only).\nThis roll can never be hard or impossible. For every question you can answer \"yes\" to, take 1 stress. You may choose to take 3 stress instead for a question you can answer \"yes\" to for the bonus die it grants to automatically succeed. For every question you cannot answer \"yes\" to (ignoring sin only questions for non-sin targets), take 2 stress. Any stress taken from this blasphemy cannot kill you or inflict instant death, but can inflict injuries.\nFor every injury this would inflict, lose a digit (finger or toe) of your choice on your body. Actions taken with that hand or foot are hard for the rest of the mission unless assisted through set-up or teamwork. If you have no more existing digits you must choose a limb instead to lose, suffering the same consequences. Digits or limbs lost this way cannot be restored by any means. After the mission is over, they can adjust to their disability and this no longer has an effect on them (determine with Admin how your character heals).\nThe blind hound Guillotine detects your scent after the blasphemy resolves, realizing you are not Absolution, and quickly demanifests." }
			]
		},
	];

	var kit = [
			// Bound Weapons (book p80-81): kit options, not bought with scrip.
			{ id: "bound-weapon", name: "Bound Weapon", category: "Bound Weapons", source: "harpocrates", scrip: null, kp: 1, tags: [],
				text: "Every tool a weapon, every weapon a promise. A piece of you born into the world with the intent to kill. Not bought with scrip: created through the Bound Weapon experiment (CAT 2+, see Bound Weapons rules). Upon drawing this weapon for the first time on a mission, gain 2d3 irreducible sin, to a maximum of R. Here, R is the total rating value of your bound weapon. The first attack you make with this weapon on a mission is supernatural, and uses your PSYCHE to roll. Any subsequent attacks made with this weapon are considered mundane by default for the purposes of difficulty versus the supernatural." },
			{ id: "auxiliary-weapon", name: "Auxiliary Weapon", category: "Bound Weapons", source: "harpocrates", scrip: null, kp: 1, tags: [],
				text: "A flex option to retrieve your service weapons. Adaptability in the field means everything to an exorcist's rate of survival. Not bought with scrip: a kit option. Retrieve either your melee service weapon OR your ranged service weapon from your kit. Cannot be used if you have already retrieved both your [Service Weapons (2 KP)]. Lose access to kit option [Service Weapons (2 KP)] for the rest of this mission upon retrieving an Auxiliary Weapon." },
	
			// Post-Mortem Services (book p79): only for those who have curried favor with facilities management.
			{ id: "cremation", name: "Cremation", category: "Post-Mortem Services", source: "harpocrates", scrip: 0, kp: null, tags: [],
				text: "Paid out for by CAIN. Unceremonious and sudden. It's like they were never there." },
			{ id: "flowers", name: "Flowers", category: "Post-Mortem Services", source: "harpocrates", scrip: 1, kp: null, tags: [],
				text: "A bundle of flowers. Often used to honor the dead." },
			{ id: "cremation-viewing", name: "Cremation Viewing", category: "Post-Mortem Services", source: "harpocrates", scrip: 1, kp: null, tags: [],
				text: "10-minute viewing session of a departed exorcist's cremation. See it with your own eyes." },
			{ id: "burial", name: "Burial", category: "Post-Mortem Services", source: "harpocrates", scrip: 2, kp: null, tags: [],
				text: "A small plot of land on an off-site facility where a departed exorcist can be buried. Exorcists are allowed to purchase their own preemptively." },
			{ id: "notarized-will", name: "Notarized Will", category: "Post-Mortem Services", source: "harpocrates", scrip: 3, kp: null, tags: [],
				text: "Allows you to write your will and have it officially notarized within CAIN. Upon purchase, designate one other individual within CAIN to be executor of your will. Assign any items, expansions, or rights you have purchased to be granted upon death. Effects will not stack." },
			{ id: "travel-1-hour-pass", name: "Travel & 1-Hour Pass", category: "Post-Mortem Services", source: "harpocrates", scrip: 5, kp: null, tags: ["Consumable"],
				text: "Special permissions and paid travel to any CAIN-sanctioned location to spread the ashes of a fallen exorcist. Time spent at locale not to exceed 1 hour." },
	
			// Mnemosyne Auxiliary Items (book p117).
			{ id: "anti-meme-3x", name: "Anti-Meme 3X", category: "Auxiliary Items", source: "harpocrates", scrip: 2, kp: 1, tags: ["Consumable"],
				text: "A concoction made specifically to combat BOOGEYMAN's abilities. Contains anti-memetic drugs attached to a small syringe which can be carried and concealed. Upon injection, consume this item. Until you rest you take -1 stress from BOOGEYMAN's reactions and are immune to her memory wiping effects until the end of the mission." },
			{ id: "anti-meme-weapon-abutment", name: "Anti-Meme Weapon Abutment", category: "Auxiliary Items", source: "harpocrates", scrip: 4, kp: null, tags: [],
				text: "A thin piece of glass-like substance which can be permanently added to ammunition of a service weapon or a service weapon of your choice. Made from the bones of HOPE 3X. Grants the weapon +2 CAT against threats flagged by the Mnemosyne division." },
			{ id: "timeline-anchored-note", name: "Timeline-Anchored Note & Pencil", category: "Auxiliary Items", source: "harpocrates", scrip: 2, kp: 1, tags: ["Consumable"],
				text: "A sheet of paper and corresponding pencil that resists reality and memory altering effects. Information written on this note with the given pencil cannot be changed or removed in any way. Can only fit a few sentences. Eraser not included." },
			{ id: "physic-assisted-surgery", name: "Physic-Assisted Surgery & Neuroplasticity Therapy", category: "Auxiliary Items", source: "harpocrates", scrip: 3, kp: null, tags: [],
				text: "Temerity and Castle approved surgery and physical therapy to repair permanent damage done to the nervous system or brain. Allows you to remove the affliction Severed Nervous System. Also increases your stress cap by +1 but only once." },
	
			// Blind Eye Terminals (book p154-155): prices are the scrip value of occult items you trade in.
			{ id: "lappel-du-vide", name: "\"Lappel du Vide\"", category: "Blind Eye Terminals", source: "harpocrates", scrip: 4, kp: 2, tags: ["Conspicuous"],
				image: "img/harpocrates/kit-lappel-du-vide.png",
				text: "A painting of an ogre. 1/rest will give a mundane human that looks at it intense depression, self loathing, or lethargy. May also be used to give an exorcist of choice the sunken affliction. Loses its effects if damaged or destroyed." },
			{ id: "purple-herb", name: "Purple Herb", category: "Blind Eye Terminals", source: "harpocrates", scrip: 1, kp: 1, tags: ["Consumable"],
				image: "img/harpocrates/kit-purple-herb.png",
				text: "A highly dangerous poisonous herb which upon ingestion causes nausea, hallucinations, and vomiting. Lethal to mundane humans. Has a 1 in 3 chance of turning a mundane human into an infested." },
			{ id: "bloodhound-pill", name: "Bloodhound Brand Male Enhancement Pill", category: "Blind Eye Terminals", source: "harpocrates", scrip: 2, kp: 1, tags: ["Consumable"],
				image: "img/harpocrates/kit-bloodhound-pill.png",
				text: "Consume to gain a Hound affliction of your choice. 1 in 3 chance of being the admin's choice instead. Can be used while under duress." },
			{ id: "toad-depot-sticky-gloves", name: "Toad Depot Sticky Gloves", category: "Blind Eye Terminals", source: "harpocrates", scrip: 4, kp: 1, tags: [],
				image: "img/harpocrates/kit-toad-depot-sticky-gloves.png",
				text: "Grant +1D on rolls to steal objects, hold onto something, or other actions that can take advantage of the gloves' sticky properties. Has a 1 in 3 chance upon use to inflict you with a toad affliction of the admin's choice after use." },
			{ id: "super-kawaii-face-mask", name: "Super Kawaii Face Mask for Sensitive Skin", category: "Blind Eye Terminals", source: "harpocrates", scrip: 3, kp: 1, tags: ["Consumable"],
				image: "img/harpocrates/kit-super-kawaii-face-mask.png",
				text: "The chemically treated skin of an idol. Allows you to transform your face into the face of anyone you have seen before. Wears off after you rest. Has a 1 in 3 chance of permanently altering your face to the face you choose." },
			{ id: "digital-kingdom-exe", name: "Digital Kingdom.exe", category: "Blind Eye Terminals", source: "harpocrates", scrip: 4, kp: 1, tags: ["Focus"],
				image: "img/harpocrates/kit-digital-kingdom-exe.png",
				text: "A small flashdrive. Once per rest allows full control over the software of any electronic device it plugs into, bypassing passwords and other barriers. Can be killed by advanced anti-hacker software or power electronic surges. Has a 1 in 3 chance of developing sentience after a usage." },
			{ id: "white-bile-medicine", name: "White Bile Medicine", category: "Blind Eye Terminals", source: "harpocrates", scrip: 3, kp: 2, tags: ["Consumable"],
				image: "img/harpocrates/kit-white-bile-medicine.png",
				text: "Consume on a dead human who has died in the same scene with a (relatively) intact body. They return in perfect health. If they would die again or at the end of the scene, they rot and melt into an indiscernible puddle." },
			{ id: "schrodingers-nuclear-football", name: "Schrodinger's Nuclear Football", category: "Blind Eye Terminals", source: "harpocrates", scrip: 4, kp: 2, tags: [],
				image: "img/harpocrates/kit-schrodingers-nuclear-football.png",
				text: "After handcuffing this suitcase to your wrist, convincing someone that it is the United States Nuclear Football can never be hard until it is opened. Upon opening, it is filled with (1-2): nothing, (3-4): candies, (5-6): a gun." },
			{ id: "blackwell-blender-mod", name: "Blackwell Kitchen Portable Blender Mod.", category: "Blind Eye Terminals", source: "harpocrates", scrip: 3, kp: 2, tags: ["Consumable"],
				image: "img/harpocrates/kit-blackwell-blender-mod.png",
				text: "A label that converts any CAT 3 or smaller sized object with a receptacle and opening (ie. dumpster, trash can, drop box, porta potty, etc) into a giant blender. For the rest of the scene, anything that enters the object is eviscerated by invisible psychic blades, akin to a wood-chipper." },
			{ id: "the-last-supper", name: "The Last Supper", category: "Blind Eye Terminals", source: "harpocrates", scrip: 6, kp: 1, tags: ["Consumable"],
				image: "img/harpocrates/kit-the-last-supper.png",
				text: "You suffer instant death without the ability to defy fate. Every living being forgets your existence, including those in CAIN administration. This has DRASTIC narrative consequences as determined by your admin." },
			{ id: "decorative-coaster", name: "Decorative Coaster", category: "Blind Eye Terminals", source: "harpocrates", scrip: 2, kp: 1, tags: ["Consumable"],
				image: "img/harpocrates/kit-decorative-coaster.png",
				text: "A sliced wooden disc from a branch of the Ymir Tree. Consume during a rest to gain an additional resting die, and for every resting die result that is 2 or less this scene, you gain 1 pathos. Can be alternatively used as a coaster, which does not consume it." },
			{ id: "psychic-girls-mag-clipping", name: "Psychic Girls Sleepover Mag Clipping: #BoyzStayOUT!!", category: "Blind Eye Terminals", source: "harpocrates", scrip: 2, kp: 1, tags: ["Consumable"],
				image: "img/harpocrates/kit-psychic-girls-mag-clipping.png",
				text: "Consume when a person is within visual range. You open it and receive one piece of information at random about them (1-2): An embarrassing moment they've had. (3-4): Their current crush. (5-6): Whether or not they're guilty of a violent crime." },
			{ id: "tsumigatchi", name: "Tsumigatchi", category: "Blind Eye Terminals", source: "harpocrates", scrip: null, kp: null, tags: [],
				text: "Not bought with scrip: costs 3 favors from the Blind Eye benefactor SOUNDBITE, spent at any BLINDEYE Terminal during a mission. It is cute, trendy, and contains the digital consciousness of a real sin. Once per mission when you take time to play with or take care of your Tsumigatchi you relieve 1 stress." },
		{ id: "fancy-shoes", name: "Fancy Shoes", category: "Expanded Aesthetics", scrip: 2, kp: null, tags: [],
			text: "Expanded aesthetic from the Queenbee agenda. No mechanical benefit." },
		{ id: "fancy-undergarments", name: "Fancy Undergarments", category: "Expanded Aesthetics", scrip: 3, kp: null, tags: [],
			text: "Expanded aesthetic from the Queenbee agenda. No mechanical benefit." },
		{ id: "make-up-options", name: "Make Up Options", category: "Expanded Aesthetics", scrip: 2, kp: null, tags: [],
			text: "Expanded aesthetic from the Queenbee agenda. No mechanical benefit." },
		{ id: "handbag", name: "Handbag", category: "Expanded Aesthetics", scrip: 4, kp: null, tags: [],
			text: "Expanded aesthetic from the Queenbee agenda. No mechanical benefit." }
	];

	var kitSections =
	[
		{ "name": "Death & Curses: Last Words", "text": "When an exorcist has died and chosen not to defy their fate, they can use their Last Words to curse a living being. In the moments before death, the exorcist must answer the following questions as truthfully as possible, and may expand upon their answers in any way of their choosing:\n- Can you blame someone for your death?\n- Do you have any regrets?\n- Can you describe a memory that flashes before your eyes?\nIf the answers are sufficient, the admin may allow them to curse someone in a way relating to one or more of their answers.\nA curse does not need to be negative or harmful: what makes last words a curse is that they continue to haunt another individual long after the exorcist is gone. Examples: \"One day, you'll find someone who will love you more than I ever could.\" \"May every mirror show you exactly what you've become.\" \"I leave you to a lifetime of lukewarm coffees.\" \"Don't forget me. No matter what.\"\nThe admin treats these last words as a bargain of sorts, and fulfills them in a way of their choosing as the remaining exorcists' story progresses. A curse could accomplish some nearly impossible things, such as an exorcist having faint memories of someone who has mass memory ruptured, or a sin's lethal blow impossibly missing a vital organ. They could introduce a new NPC, come true naturally through the story, or simply serve as a small inconvenience for those who still remain." },
		{ "name": "Death & Curses: Post-Mortem Service Options", "text": "CAIN pays out for cremation for exorcists retrieved from the field. The expanded options (Flowers, Cremation Viewing, Burial, Notarized Will, Travel & 1-Hour Pass) are only available to those who have curried favor with facilities management within CAIN. They are listed as kit items under Post-Mortem Services." },
		{ "name": "Bound Weapons: Creating One", "text": "Grace-Binding transplants a piece of one's own psychic signature into an object, which grows as it is used, feeding off the emotions and grace of its user.\nA CAT 2 or higher exorcist may sign a contract to undergo the BOUND WEAPON experiment with TEMERITY. Select a single melee or ranged weapon separate from your service weapons, and infuse it with your psychic energy:\n- Select a type of Sin (Ogre, Hound, Lord, etc.)\n- Answer a single trauma question for that sin classification as truthfully as possible. This answer is kept secret from the other exorcists.\n- Select a single option from the Enhancement Board.\nBinding ritual: the player writes their answer to the trauma question on a small piece of paper in real life, shows no one, then burns, drowns, shreds, eats or otherwise destroys it. The pact is sealed.\nThose who have acquired Immaculate Defiance of Heaven cannot effectively wield bound weapons, as contact temporarily nullifies a bound weapon's supernatural effects." },
		{ "name": "Bound Weapons: Using One", "text": "A bound weapon can only be effectively wielded by the person who bound it; in anyone else's hands it lashes out or acts uncontrollably. It is a separate item from your service weapon pair and needs its own KP to retrieve (Bound Weapon, 1 KP, rating 1).\nUpon drawing this weapon for the first time on a mission, gain 2d3 irreducible sin, to a maximum of R (the total rating of your bound weapon). If you would suffer sin overflow and imago due to this, the bound weapon becomes part of your new form.\nThe first attack you make with it on a mission is supernatural and uses your PSYCHE to roll. Subsequent attacks are mundane by default for the purposes of difficulty versus the supernatural.\nAdvancing: whenever you survive a mission in which you successfully used your bound weapon at least once, you may spend an advance to answer a remaining trauma question from your original sin, select an additional Enhancement Board option, and repeat the destruction ritual." },
		{ "name": "Bound Weapons: Enhancement Board", "text": "For every enhancement a bound weapon has, its CAT increases by +1, to a maximum base CAT of 3. As there are at most 3 trauma questions, a bound weapon traditionally has at most 3 enhancements. A bound weapon with no enhancements has a rating (R) of 1; each enhancement adds its R. EVOLVED enhancements require the previous corresponding enhancement first. Effects are only active while the weapon is retrieved and wielded by its owner. Bonus dice from enhancements cannot exceed the +3D cap unless stated otherwise.\n- Ignition (R:1): Attacks or violent actions with this weapon always release a spray of sparks and heat. This may easily ignite or combust flammable objects or substances.\n- Explosive (R:1, evolves Ignition): You may take 1d3+1 stress when attacking with this weapon to trigger an explosive blast. Gain or grant +1D to the next action that takes advantage of this happening.\n- Menacing (R:1): Actions made to intimidate, invoke fear in, or order living beings gain +1D while this weapon is drawn (max +4D).\n- Above Heaven (R:2, evolves Menacing): You gain +2D on all psyche clashes or other direct psychic contests against other beings with psychic capabilities.\n- Nullification Ritual (R:1): Killing a mundane being with this weapon prevents their body from being controlled or psychically tampered with post-mortem.\n- Beautiful Facade (R:1): This weapon becomes conspicuous if it wasn't already. When you draw it you may spend up to 3 additional KP in the form of accessories or custom designs on it. 1/mission when you take stress after taking out this weapon, reduce it by the number of additional KP spent.\n- Heavy Soul (R:2): This weapon is hard to use by default while its CAT is higher than your 1/2 CAT. It gains +1D on all actions made with it to bludgeon, concuss, or create heavy impact.\n- Gentle Silence (R:1): Rolls to avoid detection or conceal your presence are never impossible, even in plain sight.\n- Moon in the Winter (R:1, evolves Gentle Silence): 1/scene gain +1D on harmful or violent actions against targets you have caught unaware.\n- Kin By Another Name (R:1): This weapon is stored within your body and physically grafted to you. It costs 1 less KP to retrieve as it exits your body. Once retrieved it cannot be removed from your body without removing the limb it is attached to. It can be withdrawn during a rest or at the end of the mission, but refuses to be retrieved until the next hunt.\n- Last Words (R:0): If you roll exactly a 7 to resist sin overflow, you may choose to reject imagoing and die as yourself instead by plunging or firing this weapon into yourself.\n- Deadweight (R:1): 1/mission, gain 3 pathos when you draw this weapon.\n- Nihility (R:2, evolves Deadweight): Gain +1D on all violent or harmful actions while your Pathos cap is full. Lose 1 pathos after getting 2+ successes on a roll.\n- Amorphous (R:1): This weapon may freely switch between a melee and ranged form. The first time you transform it in a mission, gain +1D to your next roll to deal harm with it.\n- Grave Bearer (R:1): Gain +1D to attack enemies with 2 or less segments remaining on their talisman.\n- Execution (R:0, evolves Grave Bearer): You may permanently reduce your sin cap by 1 to add +2D to an attack with this weapon and make that attack supernatural.\n- Sharpness (R:1): This weapon may easily part steel or other objects with little to no resistance. This may easily affect the parameter of rolls.\n- World Dividing (R:2, evolves Sharpness): This weapon ignores reductions to slashes it deals due to resistance to mundane weaponry.\n- Heaven's Touch (R:3): This weapon gains +1D to attack binders or those who have defied the ethos of CAIN. It glows when a binder is nearby.\n- Defender (R:1): Gain +1D on all rolls made to defend another individual using this weapon.\n- Perfect Parry (R:1, evolves Defender): Once per round, rolling a 5+ as the final result of a Defend action allows you to deal 1 slash to the source of harm you are defending against.\n- Bloodletter (R:1): Any being you attack with this weapon takes 1 slash on its talisman if the conflict scene ends without it being slain.\n- Relentless (R:1, evolves Bloodletter): Gain +1D to track or find any being you've harmed with this weapon.\n- Soaring Chariot (R:2): You may take 2 non-lethal stress to be psychically launched up to a 1/2 CAT ({halfcat:range}) distance while wielding this weapon." },
		{ "name": "Bound Weapons: Gestation", "text": "After successfully resisting sin overflow with a modifier of +2 or higher on the final result, you may select one of the following enhancements for free. It does not count towards the max of 3 enhancements, but once taken the bound weapon can gain no further enhancements and has reached its final state.\n- Slaughterhouse Instinct (R:0): Gain the bolded agenda item: Kill. 1/mission after you fulfill this agenda item, this weapon gains +1 CAT, grows slightly in size, and radiates palpable bloodlust. While in this state, when a scene ends without you fulfilling this agenda item, gain 1 sin and 1d3 non-lethal stress. It returns to normal after the mission is over.\n- Endless Grief (R:0): Gain the bolded agenda item: Die. If you would fulfill this agenda item, you may take 1 action before doing so, and trigger divine agony on that action even if you could not do so normally. This weapon gains +1 CAT for the rest of the mission. This can stack. If you would fulfill this agenda item again in the same mission, gain 1d3+X irreducible sin. This weapon returns to normal at the end of the mission.\n- Resplendent Egosplitter (R:0): Gain the bolded agenda item: show someone you are worthy of their attention. Once per mission when you fulfill it, this weapon gains +1 CAT and becomes conspicuous if it wasn't already. Whenever a scene passes without you fulfilling it again while in this state, temporarily swap one of your bolded agenda items with your unbolded one (you cannot select an item that has been your unbolded agenda this mission; if you can't, take 1d3+X irreducible sin instead). The weapon and your agenda items return to normal at the end of the mission.\n- Merciless Justicar (R:0): Gain the bolded agenda item: punish wickedness. This weapon gains +1 CAT and +1D on attacks made with it to the sin during the execution scene. If you or your group would ever spare a host, take 6d6 irreducible sin.\n- Black Vein Detestation Requiem (R:0): Gain the bolded agenda item: kill needlessly. When you fulfill it for the first time in a mission, gain the Centipede Bite Hook. 1/rest when you would fulfill it again you may remove a slash on it. While you have the Centipede Bite Hook, all your actions to inflict harm or violence on another being gain +1D. You may gain an additional +1D on any action to inflict harm or violence by slashing this hook once or triggering the centipede bite affliction as if pressure has increased while you have it.\n- Gluttons Innumerable Mass (R:0): Gain the bolded agenda item: take more than you need. Once per scene when you fulfill this agenda by taking weapons, ammunition, explosives, or another dangerous item, this weapon may absorb that item into itself. This adds +1D to a temporary dice pool known as your \"pot\" (max +3D). While attacking with this weapon you may choose to cash in every die in your pot as bonus dice, but take 2 irreducible sin for each unsuccessful result on the final roll. This weapon returns to normal at the end of the mission." },
		{ "name": "Bound Weapons: Tools of the Trade (Admin)", "text": "Renegade (Exorcist: CAT 0-6; Execution Talisman 2+CAT amateur, 5+CAT skilled, 8+CAT expert): a binder that has created and wields a bound weapon. Possesses the capabilities of a regular binder (CAIN core p153) and inherits their special reactions Psy Clash (1) and Fuse (1-2). Its CAT counts as +1 for a Psy Clash if the target exorcist isn't wielding a bound weapon. Reactions: inflict stress with supernatural weaponry, homing ammunition, hyper-sharp blades, oppressive strikes ((1): 5 stress, (2+): 3 stress). Or create a complication or threat: cut down a whole building, bludgeon an exorcist, strike your sinseed, fire excessive ammunition, aim to kill in a single strike, reveal a hidden attribute or ability of their weapon.\nWretched Host (Exorcist/Sin: CAT 0-6; Execution Talisman 3+CAT, 6+CAT, 9+CAT): a binder who has become one with a gestated bound weapon. Same capabilities as a Renegade, plus Complication (1-2) Symbiosis, once per scene: the host lets its weapon think on its own. Set a complication talisman of 2+CAT; while active the host rolls twice on the risk die and takes the lower result. Successful actions that target or disrupt the bound weapon may inflict +1 slash on this complication talisman." },
		{ "name": "Bound Weapons: Unsevered Bond (Admin)", "text": "An exorcist who imagoes through sin overflow while wielding a bound weapon fuses with it. If such an imago survives, the sin gains a Birthed Weapon: a separate entity with its own execution talisman of 4+CAT that recovers 1d3 slashes between scenes, or 1d3+3 after the exorcists rest. It must be targeted separately, grants the sin 1 additional domain from the list below (+1 more if it is a perfect sin), and while its talisman is fully slashed all domains it granted are negated.\n- 1X. Dead Angels in Heaven: the Birthed Weapon can sever connections to the psychic sea; while drawn the sin may immediately end ongoing psychic effects on it caused by the exorcists (text partly illegible in the book).\n- 2X. As Sure As The Sky: the Birthed Weapon retains a piece of its host's humanity and grief; 1/mission it asks the exorcists whether they wish to be freed from CAIN, granting a 'yes' at a cost and punishing a 'no' (text partly illegible in the book).\n- 3X. Execution of The Guilty: 1/scene as a complication, the sin may overcharge its Birthed Weapon. All exorcists in the same scene gain 1 sin, and a complication talisman is set at (1): 5, (2-3): 4, (4+): 3. While it is active, stress the sin deals is increased by +1 and becomes irreducible. Action rolls that take advantage of an exorcist's own bound weapon automatically deal +1 slash to this complication talisman on a success.\n- 4X. The Cruelest Promise: the sin's attack range grows with pressure: extreme range at pressure 1-3, any exorcist within visual range at 4+. The sin deals +1 stress to exorcists in exposed outdoor areas such as a field, open road or town square." },
		{ "name": "Mnemosyne Auxiliary Items", "text": "Regulated and monitored objects for purchase relating to the MNEMOSYNE program. You may only learn of these objects' existence after being recruited or rescued by a MNEMOSYNE agent in the field. Mnemosyne agents are deployed to assist exorcists if contact with the division's current foci has been identified within the investigation zone." },
		{ "name": "Blind Eye Terminals", "text": "Blind Eye Terminals are discreet hubs of commerce and communication with members of the Blind Eye Syndicate. Mundane humans subconsciously avoid or ignore them; they usually look like vending machines, ATMs or other self-service machines perpetually showing \"OUT OF SERVICE\". On any mission after you have encountered the Blind Eye Syndicate, the admin may place 1-3 terminals in the investigation zone.\nTo buy from a terminal, insert any number of occult items you possess and add up their scrip value. Remains of drifters or traces count as 1 scrip per corpse (groups with a shared execution talisman count as 1). You may then take any number of items whose total scrip value is equal to or less than what you inserted. Leftover scrip is not returned. All sales are final.\nYou may keep unused items between missions, but they need KP to retrieve in future missions.\nBenefactors: the syndicate's notable members (Artemis, Soundbite, Castelli; Peeping Angel and Gnosis from Glory Unto Them) can act as favour-system benefactors. Soundbite: 3 favours buy a Tsumigatchi at any terminal. Castelli: on a hunt for Castelli, a recording or photo of a mundane human at their most vulnerable or in supernatural distress can be inserted as a 5-scrip occult object; 4 favours commission an artwork about your trauma that lets you adjust one intake answer between missions. Artemis: Mercenaries are helpful on hunts for Artemis (twice a hunt +1D when employing their aid), and returns an extra favour if you help them collect an executed sin's remains." }
	]
	;

	var virtueSections =
	[
		{ "name": "Cardinal Virtuoso", "text": "An optional alternate bond advancement system that replaces the traditional virtue bond structure. Bonds no longer increase automatically upon surviving a mission with a virtue. To rank up your bond with a virtue, you must complete a mission while your affinity with that virtue meets the minimum requirement for the next bond rank.\nAfter completing your first mission, you may select 1 virtue to begin bonding with and start at Bond 0 with them. From there, there are 4 main ways to increase (or decrease) affinity: Conversation, Contraband, Reflection, and Quirks. Some options let you bond with more than one virtue, but not all virtues are friendly with one another." },
		{ "name": "Affinity and Heart Break", "text": "Affinity is the strength of your bond with a virtue and always starts at 0. You cannot increase affinity with virtues you are not bonded with. After completing a mission, your bond with a virtue goes up if your current affinity with them meets the minimum requirement.\nConversations can increase affinity to a maximum of 6 at any given moment.\nHeart Break: if affinity with a virtue drops to -5 or lower, your bond with that virtue is broken and must be started again after the completion of your current or the next mission. A virtue you have had a broken bond with has all of their minimum affinity requirements increased by +3. Breaking a bond does not remove any strictures, high blasphemies, or bond bonuses you currently have." },
		{ "name": "Minimum affinity for each bond rank", "text": "Affinity needed to reach Bond I / II / III:\n- Justice: 7 / 17 / 27\n- Faith: 5 / 18 / 30\n- Charity: 4 / 14 / 24\n- Fortitude: 10 / 20 / 40\n- Hope: 7 / 16 / 26 (your bond to Hope persists past death; the mind may forget, but the soul does not)\n- Prudence: 5 / 17 / 29\n- Chastity: 9 / 19 / 33 (Chastity turns on their camera during virtual calls at Bond III)\n- Sobriety: 8 / 16 / 28\n- Absolution: 9 / 18 / 35 (at Bond III you may pet the CAT V hound Guillotine)" },
		{ "name": "Conversation (Meet-Ups)", "text": "Once per virtue between missions, you may arrange a Meet-Up with a virtue you are currently bonded with: a conference meeting, a private room in CASTLE HQ, a video call, or any location that fits your table. CAIN sanctioned meet-up locations include the Training Room, Cafeteria, Interrogation Room 3B, Post-Hunt Clean Up, Remote Video Call, Confessional Booth, Empty Warehouse, Tasty Burger, Catacombs, Conference Room, TME Mass Disposal and Empty Field.\nChoose a conversation topic. At the end of the conversation, gain +2 affinity for each of the following:\n- The topic is related to the virtue's Likes.\n- The conversation went well (Admin's discretion).\n- You make a flat connection roll at the end of the conversation with at least 1 success.\nLose 2 affinity after the Meet-Up if the topic is related to the virtue's Dislikes." },
		{ "name": "Reflection", "text": "Instead of a Meet-Up, you may reflect on your bond with a virtue by answering these questions (expand on each answer to convince yourself and your Admin):\n- Do my morals and goals continue to genuinely align with this virtue's? (Yes: +2, No: -1)\n- Are the costs of the ideals this bond asks me to live by still worth it? (Yes: +2, No: -2)\n- Is the bond to this virtue the only one I wish to seek? (Yes: +1. No: +0, and you may select one other virtue to begin a bond with.)\nThe Admin may allow additional questions for +1 or -1 affinity each, such as: Do I want this bond to define me? When this virtue says nothing, what do I imagine they would tell me? Do I think I truly understand this virtue, or just an idea of them?" },
		{ "name": "Contraband", "text": "You may stow away objects to give or send to your bonded virtues. At the end of a mission when hiding contraband, you may keep a number of small objects equal to your Covert score + 1/2 CAT (minimum 2). These items can only be used to increase a bond with a virtue, and you may not take them on missions. You may store up to 6 contraband items at a time in HQ (Gate users: 7); discard any excess.\nYou may give contraband to each virtue up to twice between missions:\n- A gift related to the virtue's Favorite Food or Likes: +3 affinity.\n- A gift related to the virtue's Dislikes: -3 affinity.\n- Any other gift is neutral: +1 affinity.\nYou may nurture a bond with a virtue you do not personally know yet by sincerely enjoying a contraband item that would have been meant for them, changing affinity as if you had gifted it (same twice-between-missions limit)." },
		{ "name": "Quirks", "text": "Each virtue has conditions that change affinity as soon as they are met. The Admin may add more, and may keep them secret or share them.\n- Justice: beating them in a debate (+3); completing a mission without breaking any strictures (+2); coming to a meeting late (-1); breaking a stricture during a mission (-2); bonding or upgrading a bond with Charity (-10).\n- Faith: completing a mission without any civilian or exorcist casualties (+8); capturing a binder (+5); beating them in a fighting game (+3); beating a claw game (+2, once per mission); undergoing sin overflow (-1); bonding or upgrading a bond with Fortitude (-10).\n- Charity: targeted by a severe attack: marriage with an exorcist you are Entwined with (+10); using Entwine before pressure 2 (+3); winning an online debate (+3); losing an online debate (-1); a Meet-Up that lasts longer than 12 minutes (-2); choosing a boring conversation topic (-2); meeting them while looking unfashionable (-2); bonding or upgrading a bond with Justice or Faith (-10).\n- Fortitude: killing a member of CAIN leadership or another virtue (+40); beating them in hand to hand combat (+30); completing a mission as the only survivor in the investigation zone, including allies (+15); winning a brawl on your own (+2); gifting them a hot dog (+1); killing a human (+1, twice per mission); gifting them something neutral (-1, for a total of 0); losing a fight (-4); bonding or upgrading a bond with another virtue (-10).\n- Hope: celebrating Christmas with them (+10); saying something heartfelt about them at their funeral (+10); remembering something from the last Meet-Up conversation in your current one (+2, once per Meet-Up); making a loud noise (-1); forgetting a major holiday (-2); bonding or upgrading a bond with Justice or Fortitude (-10).\n- Prudence: completing a mission without breaking any promises or agreements you have made (+3); taking a long walk with them (+2); making a deal with Prudence (+2); breaking a promise or agreement you have made (-5); bonding or upgrading a bond with Charity or Justice (-10).\n- Chastity: completing a mission without touching anyone (+4); bonding or upgrading a bond with Faith (+3); doing a Meet-Up over call (+1); committing an indecent or immodest act (-2); breaking your Iron Maiden (-2); mistreating the physically ill (-3); bonding or upgrading a bond with Charity (-10).\n- Sobriety: taking them to a bar (+5); bonding or upgrading a bond with Prudence (+3); sharing a drink with them (+2); stopping them from excessive drinking (+1); completing a mission without breaking any strictures (+1); being insensitive (-1); giving them a headache (-2); missing a meeting with them (-4); bonding or upgrading a bond with Faith (-10).\n- Absolution: spending a Deployment Pass and convincing AUTHORITY to take Guillotine on a walk with them (+10); executing the sin before pressure reaches 3 (+5); having the sin host consider you a friend (+3, once per mission); gifting them something meant for Guillotine (+1); letting pressure reach 6 (-3); hurting a civilian (-3); hurting a mundane animal (-5); bonding or upgrading a bond with Hope or Justice (-10)." },
		{ "name": "Additional Gifts and Guides", "text": "Regulated objects for purchase relating to the Cardinal Virtuoso program, bought with scrip. They may be kept separately from contraband.\n- Heartfelt Note (2 scrip, consumable): give it to a virtue to automatically increase your bond with them if your current affinity meets the minimum. If this would not increase your bond, increase affinity by +1 instead.\n- Page of One-liners (1 scrip, consumable): a page from \"101-Liners for Suave Conversationalists\". Gain +1D on the connection roll for 1 Meet-Up, and ignore losing affinity for discussing a disliked topic. Usable once per purchase.\n- Apology Note (2 scrip, consumable): when you would lose affinity in any way, reduce the loss by 2. Further uses before the end of your current or next mission only reduce the loss by 1.\n- Well-Organized Journal (2 scrip): the first time in a mission you would take an action that would lower affinity with a bonded virtue, the Admin must tell you before it resolves, letting you rethink it. Does not stack.\n- Heated Blanket (2 scrip, consumable): give or send it to a virtue for +2 affinity, +1 more if given within 12 hours of the virtue being dethawed and deployed from SERAPH. Giftable once.\n- 5-Hour Deployment Pass (16 scrip, consumable): lets a heavily monitored virtue be deployed for non-mission purposes for 5 hours, with you as the sanctioned chaperone. Usable once per purchase for +12 affinity with the virtue of your choice." },
		{ "name": "Faster bonding (X2 text speed mod)", "text": "For shorter campaigns, use any combination of:\n- Conversation/Reflection limit between missions goes from 1 to 2 per virtue.\n- Contraband gifting limit goes from 2 to 3 per virtue.\n- The Admin and exorcists may take time off during between-mission downtime, which increases all current bonds that meet the minimum affinity and resets Conversation, Contraband and Reflection limits as if you had completed a mission." },
		{ "name": "Good Ending achievements", "text": "Each achievement completed adds 1 point to the party's Good Ending total (no repeats). Rewards go to every exorcist in the party:\n- 4 points: 5 scrip, and a congratulations from TEMERITY and SEER.\n- 8 points: gain 2 advances.\n- 10 points: gain the Formalwear aesthetic for free; wearing it to a Meet-Up for the first time grants +2 affinity.\n- 12 points: once per game, an exorcist on the brink of death may summon a virtue they have a Bond III with, who appears in the current mission before the scene ends.\n- 16+ points: every exorcist gets a free 6 Hour Deployment Pass. Remove 5 slashes from the XK-Talisman.\nAchievements:\n- Judge, Jury, Sexecutioner: reach Bond 3 with Justice.\n- Claw Machine Pro: reach Bond 3 with Faith.\n- At the Same Damn Time: reach Bond 3 with Charity.\n- Shattered Pelvis: reach Bond 3 with Fortitude.\n- Remember the Date: reach Bond 3 with Hope.\n- Prenup Please: reach Bond 3 with Prudence.\n- No Touch Please!: reach Bond 3 with Chastity.\n- Glass Half Full: reach Bond 3 with Sobriety.\n- Walk in the Park: reach Bond 3 with Absolution.\n- This ISN'T You!: get Justice to falter in their dogma.\n- Pro Gamer: beat Faith in a video game.\n- Spoils of War: kill an upper member of CAIN leadership while bonding to Fortitude.\n- Last Christmas: use a Deployment Pass to spend Christmas with Hope.\n- Bad Ending: reach Bond 3 with Sobriety by only talking about or gifting them alcohol.\n- Heart Breaker: break bonds with 4 or more virtues.\n- The Fumbler: lose 15 or more affinity with a virtue in a single mission.\n- Nothing Loves the Hunter: complete 5 missions without bonding to any virtue.\n- Beso de Tres: reach Bond 3 with Sobriety and Prudence, or with Chastity and Faith.\n- Matchmaker: somehow set up two virtues to get with each other.\n- Wipe the Stain: end all communication with a virtue for 3 consecutive missions after breaking their bond.\n- Smell the Roses: successfully use a 5-Hour Deployment Pass.\n- Hardmode++: reach Bond 3 with a virtue while playing with Glory Unto Them's Black Coat pillar system." },
		{ "name": "Designing your own virtue (quick start)", "text": "Bond ranks mark checkpoints in the relationship: Bond I, a simple understanding of the virtue and their significance; Bond II, you understand why this bond should be part of you; Bond III, the bond is an immutable part of you and the virtue may recognize you. Place each rank's minimum affinity on a 0-35 scale by the effort it should take: Casual (minimal consistent effort), Intentional Pursuit (deliberate, sustained effort), Personal Cost (high investment, sacrifices made), Life-Changing Commitment (deep devotion).\nQuirks: reward high-effort or low-chance acts with more affinity and egregious acts against the virtue's beliefs with larger losses. Keep quirks achievable and true to the virtue's characterization at your table." }
	]
	;

	// The XK-Class talisman (book p60-61): one 66-segment talisman, named after an
	// XK-Scenario, slashed when the exorcist uses an XK power. Every XK
	// blasphemy shows it on the sheet; an exorcist can only ever hold one.
	var xkTalisman = {
		id: "xk-scenario",
		name: "XK-Class Talisman",
		segments: 66,
		start: 0,
		names: ["XK-Grandfather Clock", "XK-London Bridge", "XK-Freudian Slip", "XK-All Tomorrows"],
		milestones: [
			{ at: 11, text: "A disaster destroys a city or town. A sin is born in the process." },
			{ at: 22, text: "A second XK blasphemy manifests if it hasn't already. It may belong to a PC or NPC. A major conflict arises within CAIN." },
			{ at: 33, text: "A major political leader in the world dies, leading to international conflict and strife." },
			{ at: 44, text: "A third XK blasphemy manifests if it hasn't already. It belongs to someone opposed to CAIN. An organization involved in the supernatural outside of CAIN reveals itself." },
			{ at: 55, text: "A member of AUTHORITY has called for the execution of any and all XK blasphemy wielders." },
			{ at: 66, text: "The last of the horsemen arrive. The End Begins: the XK-Scenario the talisman is named after begins." }
		],
		text: "Optional, set aside by the Admin once an XK blasphemy has manifested. Name it after an XK-Scenario.\n- Slash it once whenever you choose to use a power from an XK blasphemy, and again if the power causes widespread damage, harm, or panic.\n- At the end of each mission the exorcists complete, roll 1d3 and slash the talisman that many times.\n- At different intervals certain events WILL come into existence; the final slash begins the XK-Scenario.\n- If you complete a mission without using ANY XK power, answer truthfully: Are you attempting to suppress the unsettling power within you? Do you believe that fate can be changed? Remove one slash for each \"yes\". This cannot undo flagged events, but can delay the inevitable.\nXK-Scenarios: Grandfather Clock (the Spindle is missing; no living being can die), London Bridge (the Seraph has been destroyed; something has killed the virtues), Freudian Slip (the entity Mother has infected members of AUTHORITY), All Tomorrows (something has come from space and manipulates grace better than we can)."
	};
	blasphemies.forEach(function (b) { if (b.group === "XK") b.trackers = [xkTalisman]; });

	function tag(list) { list.forEach(function (x) { x.source = "harpocrates"; }); return list; }

	CAIN.agendas = CAIN.agendas.concat(tag(agendas));
	CAIN.blasphemies = CAIN.blasphemies.concat(tag(blasphemies));
	CAIN.virtues = (CAIN.virtues || []).concat(tag(virtues));
	CAIN.kit = CAIN.kit.concat(tag(kit));
	kit.forEach(function (k) { if (CAIN.kitCategories.indexOf(k.category) < 0) CAIN.kitCategories.push(k.category); });
	CAIN.kitSections = (CAIN.kitSections || []).concat(tag(kitSections));
	CAIN.virtueSections = (CAIN.virtueSections || []).concat(tag(virtueSections));
})();
