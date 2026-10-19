// Sin marks. Test build: Eyes and Arms or Hands.
// roll is the d6 face for the location table; abilities are indexed 1-6 by their own d6.
window.CAIN = window.CAIN || {};

CAIN.sinMarks = [
	{
		id: "eyes",
		roll: 1,
		name: "Eyes",
		appearance: "Black or altered sclera, white iris, split, slit, or duplicate pupil.",
		abilities: [
			{ roll: 1, text: "You can see clearly up to extreme distance, as if you could 'zoom in' your vision." },
			{ roll: 2, text: "You can see through walls and nonliving matter in short distance." },
			{ roll: 3, text: "When closed, you can sense the ambient emotional state of nearby humans or exorcists. Once a hunt, gain +1D when acting on this." },
			{ roll: 4, text: "Once a hunt, you can momentarily paralyze a human by merely looking at them. The effect lasts until you break eye contact, a minute passes, or either of you suffer harm." },
			{ roll: 5, text: "You can see clearly in the dark and are unaffected by darkness, weather, or obscurement." },
			{ roll: 6, text: "Gain +1D to Surveillance or Investigation. This could put you up to 4D base.",
				skillBonus: { choose: ["surveillance", "investigation"], add: 1 } }
		]
	},
	{
		id: "arms",
		roll: 4,
		name: "Arms or Hands",
		appearance: "Claws, split hand or arm, extra arm, twisting skin or muscles, discoloration, extra fingers.",
		abilities: [
			{ roll: 1, text: "You can gain 1d3 sin when performing a feat of physical strength to increase the CAT of that feat by +2." },
			{ roll: 2, text: "Once a hunt, you may merge any single mundane weapon or item you could hold into your flesh, able to conceal or produce it at will." },
			{ roll: 3, text: "Once a hunt, you can dissolve all non-living matter in a cube about 1/2 CAT size ({halfcat:size}) into a black sludge with a touch of your third (ring) finger." },
			{ roll: 4, text: "Once a hunt, you can gain 1d3 sin to morph your arm or hand into a melee weapon for a scene. It is a supernatural melee weapon of 1/2 CAT ({halfcat}) potency." },
			{ roll: 5, text: "You can re-roll any force or interfacing roll, taking the second result as final. If you do, gain 1d3 sin." },
			{ roll: 6, text: "Gain +1D to Force or Coordination. This could put you up to 4D base.",
				skillBonus: { choose: ["force", "coordination"], add: 1 } }
		]
	}
];

// Location face 6 on the d6 means "choose any location".
CAIN.sinMarkChooseFace = 6;

// Names for every location face, including ones not loaded in this build.
CAIN.core.sinMarkLocations = ["Eyes", "Jaw", "Back or chest", "Arms or hands", "Skin, hair, or legs", "Choose"];
