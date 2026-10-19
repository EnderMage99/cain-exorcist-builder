// Agendas, as in CAIN 1.4.5 (pages 46-51). note: a special rule printed with
// the agenda. requires: { sinMarks: n } or { dead: true } gates picking it.
// look: the agenda's card in the book: paper (grey, beige, dark, gold, tag or
// stamp), accent colour, tape colour for its note. Emblems are img/agenda/<id>.png.
window.CAIN = window.CAIN || {};

CAIN.agendas = [
	{
		id: "beast",
		name: "Beast",
		look: { paper: "grey", accent: "#d61f1f", splatter: true },
		requires: null,
		items: [
			{ text: "Get into a fight", bold: false },
			{ text: "Hold back", bold: true }
		],
		abilities: [
			{ id: "insects", name: "Insects!!!",
				text: "You have +1D when inflicting harm or violence against human opponents." },
			{ id: "take-you-down", name: "I'll take you down with me",
				text: "Regain 1 psyche burst when you take an injury, fill out a hook, or take an affliction." },
			{ id: "rule-of-nature", name: "Rule of Nature",
				text: "When you inflict violence with an action, if you roll two or more 6s, the action inflicts 1 more slash on any talismans and you regain 1 psyche burst." },
			{ id: "red-muscle", name: "Red Muscle",
				text: "You can take 2 nonlethal stress to gain +1D on any violent or forceful roll." },
			{ id: "bare-teeth", name: "Bare Teeth",
				text: "While you have two or more injuries or afflictions, it is no longer hard to use mundane capabilities against supernatural forces and your human physical abilities are at 1/2 CAT instead of CAT 0." }
		]
	},
	{
		id: "demon",
		name: "Demon",
		look: { paper: "gold", accent: "#3a2e14", tape: "#f4f1ea" },
		requires: null,
		note: "You can spend scrip as kit points.",
		items: [
			{ text: "Enrich yourself", bold: false },
			{ text: "Give something valuable away", bold: true }
		],
		abilities: [
			{ id: "black-market-stims", name: "Black Market Stims",
				text: "You can spend up to 2 scrip a mission as psyche burst." },
			{ id: "supplier-connections", name: "Supplier Connections",
				text: "You gain a 1 scrip discount on all kit and aesthetic items, to a minimum of 1. This discount applies to all items at CAT 4+." },
			{ id: "shady-lender", name: "Shady Lender",
				text: "Between missions, you can choose to gain 1d3 scrip, but start the next mission with 1 injury." },
			{ id: "heartless", name: "Heartless",
				text: "You gain +1 scrip for executing sins." },
			{ id: "spotless", name: "Spotless",
				text: "Once a mission, you can destroy an aesthetic kit expansion you own worth 3 or more scrip instead of suffering an injury." }
		]
	},
	{
		id: "departed",
		name: "Departed",
		look: { paper: "tag", accent: "#7aa3d6", tape: "#e8423a" },
		requires: { dead: true },
		note: "A character can only take this agenda if they are well and truly dead. You get its ability for free.",
		items: [],
		abilities: [
			{ id: "that-terrible-weight", name: "That Terrible Weight",
				text: "Once a session, the dead character can chip in when an ally makes a roll to let them re-roll the entire roll after they see the result, taking the second result as final." }
		]
	},
	{
		id: "doomed",
		name: "Doomed",
		look: { paper: "grey", accent: "#141414", tape: "#f2b318" },
		requires: { sinMarks: 1 },
		note: "You may only pick this agenda if you have a sin mark. If it's your first agenda, you may start with a sin mark of your choice (only choose location, still roll 1d6 for ability).",
		items: [
			{ text: "Demonstrate your humanity", bold: false },
			{ text: "Demonstrate your distance from humanity", bold: true }
		],
		abilities: [
			{ id: "xenoflesh", name: "Xenoflesh",
				text: "Ignore '1's rolled for gaining Sin." },
			{ id: "humanitys-last-breath", name: "Humanity's Last Breath",
				text: "Pick a sin mark you have. Evolve that Sin mark. It no longer modifies resistance rolls." },
			{ id: "quickening", name: "Quickening",
				text: "When you gain 2 or more Sin as part of an action, your action also gains +1D." },
			{ id: "sympathetic-mutation", name: "Sympathetic Mutation",
				text: "You may take 1d3 sin to grant an ally the benefits of any sin mark ability you have for one scene. Their body is infected by a lesser version of it that dissipates when the scene is over." },
			{ id: "metamorphosis", name: "Metamorphosis",
				text: "Between missions or when resting, you can gain 1 sin to re-roll the ability of one of your sin marks. If you roll an ability you already have, choose one instead." }
		]
	},
	{
		id: "firebug",
		name: "Firebug",
		look: { paper: "beige", accent: "#5a3d22" },
		requires: null,
		items: [
			{ text: "Solve problems creatively", bold: false },
			{ text: "Take the simple solution", bold: true }
		],
		abilities: [
			{ id: "jack", name: "Jack!",
				text: "At the start of a mission, choose a skill you have at 0. You can improve it to 1 for the duration of this mission only.",
				missionChoice: { kind: "skillAtZero", raiseTo: 1 } },
			{ id: "always-a-way", name: "Always a way",
				text: "If there isn't an entrance or exit into a place, you can find one. You can always get through, but (Admin picks one): it's dangerous or risky, it'll only fit one person, you'll have to leave something or someone behind." },
			{ id: "oilfinger", name: "Oilfinger",
				text: "You start a mission with 1d3+1 extra Kit Points.",
				missionRoll: { stat: "kitPoints", dice: "1d3", plus: 1 } },
			{ id: "extra-parts", name: "Extra Parts",
				text: "You can mark 1 KP for +1D on any roll that involves fixing, crafting, breaking, or modifying devices or machines." },
			{ id: "weak-spot", name: "Weak Spot",
				text: "When an ally performs violent or forceful action, you can grant them +1D on their action, and +1 slash on any talismans on success. You have one use of this ability, which resets when you rest, and a roll can only benefit from this once." }
		]
	},
	{
		id: "guardian",
		name: "Guardian",
		look: { paper: "grey", accent: "#141414", tape: "#ef8ff0" },
		requires: null,
		items: [
			{ text: "Protect your people", bold: false },
			{ text: "Leave nobody behind", bold: true }
		],
		abilities: [
			{ id: "iron-wall", name: "Iron Wall",
				text: "When you defend someone close to you in a conflict scene, you can choose to divert any consequences taken by your target on to you instead of its usual effects. The second time or more you use this in the same scene, you take 1d3 nonlethal stress first." },
			{ id: "excessive-agony", name: "The Excessive Agony of Moving Forward",
				text: "Erase 1 stress when pressure increases if you have more than 3." },
			{ id: "castle", name: "Castle",
				text: "When any ally takes an injury, you erase 1 stress and gain +1D on your next action." },
			{ id: "centerweight", name: "Centerweight",
				text: "When resting, allies that spend resting dice can set the results of their dice to yours instead." },
			{ id: "painkiller", name: "Painkiller",
				text: "Your first injury taken does not reduce maximum stress.",
				flags: ["firstInjuryKeepsStress"] }
		]
	},
	{
		id: "hardline",
		name: "Hardline",
		look: { paper: "grey", accent: "#141414" },
		requires: null,
		items: [
			{ text: "Follow orders", bold: false },
			{ text: "Disobey orders", bold: true }
		],
		abilities: [
			{ id: "black-suit", name: "Black Suit",
				text: "Gain +1D on actions to lead, intimidate, or give orders to mundane humans." },
			{ id: "mea-culpa", name: "Mea Culpa",
				text: "The first time in a hunt you take an injury or an affliction, relieve 1d3+1 sin." },
			{ id: "eliminate-the-stain", name: "Eliminate the Stain",
				text: "Gain +1D and inflict +1 slash on talismans the first time you roll against sins that have half or less of their execution talisman remaining." },
			{ id: "single-minded", name: "Single Minded",
				text: "You can only be affected by one affliction maximum (you can choose which to discard and keep)." },
			{ id: "by-the-book", name: "By the Book",
				text: "Once a hunt, when you witness or find evidence of a sin's Domain, you can force the Admin to show you the exact rules text of that Domain." }
		]
	},
	{
		id: "loner",
		name: "Loner",
		look: { paper: "grey", accent: "#141414" },
		requires: null,
		items: [
			{ text: "Demonstrate your superior skill", bold: false },
			{ text: "Let the mask slip", bold: true }
		],
		abilities: [
			{ id: "dust-to-dust", name: "Dust to Dust",
				text: "Stress no longer rolls over when you take an injury (excess is lost)." },
			{ id: "silent-strike", name: "Silent Strike",
				text: "Gain +1D on forceful actions taken against targets who are unaware of your presence." },
			{ id: "do-it-myself", name: "I'll do it myself",
				text: "Once a scene, when someone fails a roll, you can step in to help them, as long as you are able. You gain 1d3+1 nonlethal stress, but roll 1D and add it to the total roll, which could cause it to succeed." },
			{ id: "rook", name: "Rook",
				text: "When you successfully set up an ally, you can take 2 nonlethal stress to set up another ally of your choice with the same action." },
			{ id: "its-nothing", name: "It's Nothing",
				text: "You can ignore taking an injury by saying 'It's Nothing'. Erase half your stress (instead of all from gaining an injury), then gain a hook 'It's Nothing'. This hook fills up any time you say 'It's Nothing' as well as the normal ways (taking this hook again, pressure increasing, rolling a '1' on risk). Segments on the hook can't be erased in any way. When the hook fills out, you collapse and suffer instant death, which you cannot ignore. If you end a mission with this hook, you gain a permanent cosmetic scar." }
		]
	},
	{
		id: "machine",
		name: "Machine",
		look: { paper: "beige", accent: "#3a3a3a", tape: "#f2b318" },
		requires: null,
		note: "If your group rests, you can choose to exclude yourself from resting.",
		items: [
			{ text: "Put the work before your own needs", bold: false },
			{ text: "Take a break", bold: true }
		],
		abilities: [
			{ id: "the-work", name: "The Work",
				text: "You can choose to gain +1D on any roll. If you do, take 1 stress for each time you've used this ability this mission (including this one). You can't use this ability for the remainder of the hunt if you rest." },
			{ id: "brain-burst", name: "Brain Burst",
				text: "When investigating or researching something, you can take 1 nonlethal stress to re-roll one die on your action roll. The re-roll is final." },
			{ id: "second-wind", name: "Second Wind",
				text: "When pressure hits 4, erase all stress or remove an affliction." },
			{ id: "overtime", name: "Overtime",
				text: "You can gain +1D on all actions to investigate, analyze, or gather information for the duration of a scene, but you lose the use of this ability and all other activities are hard until you rest." },
			{ id: "neat-little-universe", name: "Neat Little Universe",
				text: "Twice a hunt, outside conflict, you can adjust any talisman on your sheet or an ally's up or down by 1." }
		]
	},
	{
		id: "moth",
		name: "Moth",
		look: { paper: "beige", accent: "#4a3320" },
		requires: null,
		items: [
			{ text: "Uncover hidden or uncomfortable truths about the world", bold: false },
			{ text: "Uncover hidden or uncomfortable truths about yourself", bold: true }
		],
		abilities: [
			{ id: "psyche-jewel", name: "Psyche Jewel",
				text: "The first time a hunt you or an ally answers a Sin's trauma question, regain 1 psyche burst, recover 1 sin, and erase 1 stress." },
			{ id: "alienation", name: "Alienation",
				text: "Your sin overflow cap increases by +2.",
				modifiers: [{ stat: "sinCap", add: 2 }] },
			{ id: "rapture", name: "Rapture",
				text: "You erase 1 stress when you gain an affliction, injury, or hook." },
			{ id: "larval", name: "Larval",
				text: "If you end a mission at 7 or higher sin, gain 1 xp. If you suffer sin overflow, gain 1 xp." },
			{ id: "unveil", name: "Unveil",
				text: "You can ask the Admin about a character present 'What is this person afraid of?'. Gain +1D when you act on the answers for the rest of the scene, then lose the use of this ability until you rest." }
		]
	},
	{
		id: "shadow",
		name: "Shadow",
		look: { paper: "dark", accent: "#d9d9d9", tape: "#c9c9c9" },
		requires: null,
		note: "When you pick this agenda, pick another character to be your rival (the feeling doesn't have to be mutual) at the start of a mission. As long as you have rival abilities from this agenda, you must choose who your rival is.",
		items: [
			{ text: "Outshine your rival", bold: false },
			{ text: "Let your rival outshine you", bold: true }
		],
		abilities: [
			{ id: "catch-up", name: "Catch Up",
				text: "If your rival has less stress than you when pressure increases, erase 1 stress. If they have more psyche bursts, regain 1 psyche burst." },
			{ id: "synchronize", name: "Synchronize",
				text: "When you set up your rival, you take 1 nonlethal stress and +1D on the action to set up." },
			{ id: "you-cant-die-now", name: "You Can't Die Now",
				text: "Once a hunt, if your rival would take an injury or suffer instant death, you can take 2d3 stress to allow them to ignore it. They go to 1 stress under maximum." },
			{ id: "shadow-seed", name: "Shadow Seed",
				text: "Choose a blasphemy power your rival has. You can use that power this hunt, but only at max CAT 0." },
			{ id: "pincer-technique", name: "Pincer Technique",
				text: "When you participate in teamwork with your rival, you take 1 nonlethal stress, but can also re-roll one of the dice once, taking the second result as final." }
		]
	},
	{
		id: "songbird",
		name: "Songbird",
		look: { paper: "grey", accent: "#a020f0", tape: "#c77dff" },
		requires: null,
		items: [
			{ text: "Get someone to do your bidding", bold: false },
			{ text: "Do something selfless", bold: true }
		],
		abilities: [
			{ id: "codependency", name: "Codependency",
				text: "When someone sets you up, you can trade 1 stress around (from you to them, or vice versa)." },
			{ id: "spiral", name: "Spiral",
				text: "You can always tell if someone is lying to you, though not the nature of the lie." },
			{ id: "strings", name: "Strings",
				text: "When you rest with a consenting partner, you can spend quality time with them (the nature of which is up to them). If they choose to do so, they add +1 to all your resting results. However, until you next rest, you can force them to participate in teamwork with you or set you up once." },
			{ id: "white-fiber", name: "White Fiber",
				text: "You can take 2 nonlethal stress to gain +1D on any roll to lie or manipulate someone." },
			{ id: "fascination", name: "Fascination",
				text: "You can declare your fascination with another character in the group at the start of any hunt. When that character rolls a 6 on risk, you lose 1 stress. When they roll a 1, you gain 1 nonlethal stress." }
		]
	},
	{
		id: "sorcerer",
		name: "Sorcerer",
		look: { paper: "dark", accent: "#ff4fd8", tape: "#ff4fd8" },
		requires: null,
		items: [
			{ text: "Demonstrate flashy displays of power", bold: false },
			{ text: "Invite catastrophe", bold: true }
		],
		abilities: [
			{ id: "perfect-technique", name: "Perfect Technique",
				text: "Pick a blasphemy power. Once a hunt, you can increase the CAT of that power by +1 temporarily for an entire scene, or for two rounds if it's a conflict scene." },
			{ id: "cantrip", name: "Cantrip",
				text: "Pick a blasphemy power. You can use it twice a hunt without spending a psyche burst, but all parameters are at a max of CAT 0 if used this way." },
			{ id: "finishing-move", name: "Finishing Move",
				text: "Pick a blasphemy power. You can increase the dice and CAT of that power by +1 the next time you use it, but you then cannot use any blasphemies again and all actions are hard. Both these effects end when you rest." },
			{ id: "mimic-technique", name: "Mimic Technique",
				text: "Pick a power from any Blasphemy, without having taken that blasphemy. It doesn't change your xp or sin overflow caps." },
			{ id: "weave", name: "Weave",
				text: "When you use a blasphemy, you may increase the CAT of the next blasphemy used by an ally against the same target by +1, and grant it +1D on any rolls. Then lose the use of this ability until you rest." }
		]
	},
	{
		id: "survivor",
		name: "Survivor",
		look: { paper: "stamp", accent: "#d8343a", tape: "#f4f1ea" },
		requires: null,
		note: "Once taken, a character can only swap out of this agenda by spending two advances. Get its ability for free.",
		items: [
			{ text: "Survive", bold: false }
		],
		abilities: [
			{ id: "will-to-live", name: "Will to Live",
				text: "+1 max stress. 1 in 6 chance of ignoring instant death (roll 1d6).",
				modifiers: [{ stat: "maxStress", add: 1 }] }
		]
	},
	{
		id: "temperance",
		name: "Temperance",
		look: { paper: "grey", accent: "#141414" },
		requires: null,
		items: [
			{ text: "Put people before the mission", bold: false },
			{ text: "Harm someone intentionally", bold: true }
		],
		abilities: [
			{ id: "healer", name: "Healer",
				text: "The first time you rest in a hunt, gain an extra resting die." },
			{ id: "focused", name: "Focused",
				text: "Once a hunt, you may use a blasphemy power that affects only you or your allies without spending a psyche burst, and it gains +1 CAT." },
			{ id: "savior-complex", name: "Savior Complex",
				text: "Gain +1D on actions to directly prevent or avoid harm to humans." },
			{ id: "care", name: "Care",
				text: "Once a hunt, outside of a conflict scene, you can roll and apply a resting die to yourself or another nearby ally without resting." },
			{ id: "gentleness", name: "Gentleness",
				text: "For one scene, you may take 1 less stress when you take stress. This ability breaks if you take any forceful or harmful action. Then lose the use of this ability until you rest." }
		]
	},
	{
		id: "torch",
		name: "Torch",
		look: { paper: "grey", accent: "#141414" },
		requires: null,
		items: [
			{ text: "Lead from the front", bold: false },
			{ text: "Let another take the lead", bold: true }
		],
		abilities: [
			{ id: "joy-luck-wind-thrower", name: "Joy Luck Wind Thrower",
				text: "When you roll 0d for any action, it's never hard." },
			{ id: "hot-blooded", name: "Hot Blooded",
				text: "Your first action in a conflict scene gains +1D and inflicts +1 more slash on any talismans." },
			{ id: "font-of-power", name: "Font of Power",
				text: "Once a hunt, you may gain 1d3 psyche bursts, which could put you over your maximum. Until you rest, you can no longer spend psyche bursts, but allies can spend your psyche bursts as their own." },
			{ id: "recollect", name: "Recollect",
				text: "At the end of a session, you can describe something another character did that impressed you during that session, and give that character 1 xp. Characters can only gain this xp once if targeted by this ability multiple times." },
			{ id: "strive", name: "Strive",
				text: "Once a hunt, you can make a complete re-roll of any action you or an ally just took, taking the second result as final." }
		]
	}
];
