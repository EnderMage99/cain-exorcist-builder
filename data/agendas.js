// Agendas. Test build: Guardian and Firebug.
window.CAIN = window.CAIN || {};

CAIN.agendas = [
	{
		id: "guardian",
		name: "Guardian",
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
		id: "firebug",
		name: "Firebug",
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
	}
];
