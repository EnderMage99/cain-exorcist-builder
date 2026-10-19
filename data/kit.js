// Kit shop items bought with scrip. Test build: one consumable, one permanent upgrade.
// The service weapon CAT upgrade lives in CAIN.core.weaponUpgrade.
window.CAIN = window.CAIN || {};

CAIN.kit = [
	{
		id: "red-herb",
		name: "Red Herb",
		category: "Occult / Medical",
		scrip: 4,
		kp: 2,
		tags: ["Consumable", "Focus"],
		text: "Consume to heal 1d3+3 stress.",
		use: { healStress: { dice: "1d3", plus: 3 } }
	},
	{
		id: "improved-meal-plan",
		name: "Improved meal plan",
		category: "Comfort / Career",
		scrip: 4,
		kp: null,
		tags: [],
		text: "Move to the 'B' meal plan. +1 max KP.",
		modifiers: [{ stat: "kitPoints", add: 1 }]
	}
];
