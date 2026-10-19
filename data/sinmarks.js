// Sin marks, as in CAIN 1.4.5 (pages 86-87).
// roll is the d6 face for the location table; abilities are indexed 1-6 by their own d6.
// short is a few words for dropdowns; text is the full rule.
window.CAIN = window.CAIN || {};

CAIN.sinMarks = [
	{
		id: "eyes",
		roll: 1,
		name: "Eyes",
		appearance: "Black or altered sclera, white iris, split, slit, or duplicate pupil.",
		abilities: [
			{ roll: 1, short: "Far sight", text: "You can see clearly up to extreme distance, as if you could 'zoom in' your vision." },
			{ roll: 2, short: "See through walls", text: "You can see through walls and nonliving matter in short distance." },
			{ roll: 3, short: "Sense emotions", text: "When closed, you can sense the ambient emotional state of nearby humans or exorcists. Once a hunt, gain +1D when acting on this." },
			{ roll: 4, short: "Paralyzing gaze", text: "Once a hunt, you can momentarily paralyze a human by merely looking at them. The effect lasts until you break eye contact, a minute passes, or either of you suffer harm." },
			{ roll: 5, short: "See in the dark", text: "You can see clearly in the dark and are unaffected by darkness, weather, or obscurement." },
			{ roll: 6, short: "+1D Surveillance or Investigation", text: "Gain +1D to Surveillance or Investigation. This could put you up to 4D base.",
				skillBonus: { choose: ["surveillance", "investigation"], add: 1 } }
		]
	},
	{
		id: "jaw",
		roll: 2,
		name: "Jaw",
		appearance: "Split or extended jaw, pharyngeal jaw, fangs, black tongue, viscous saliva.",
		abilities: [
			{ roll: 1, short: "Spit black venom", text: "You can spit black venom up to short distance. It's a mundane ranged weapon with about the same effectiveness as a pistol." },
			{ roll: 2, short: "Re-roll speech for sin", text: "You can gain 1d3 sin to re-roll any roll requiring speech, taking the second result as final." },
			{ roll: 3, short: "Whisper on the wind", text: "You can whisper short messages into the wind of 6 words or less that a target of your choice can hear in their ear within long distance. The target cannot reply." },
			{ roll: 4, short: "+1D with humans", text: "You gain +1D when negotiating with, commanding, or convincing humans." },
			{ roll: 5, short: "One word command", text: "Once a hunt, you can give a short, one word command to a human, who then immediately attempts to follow it to the best of their ability. Humans will not obey obviously harmful commands." },
			{ roll: 6, short: "+1D Authority, Connection, Negot.", text: "Gain +1D to Authority, Connection, or Negotiation. This could put you up to 4D base.",
				skillBonus: { choose: ["authority", "connection", "negotiation"], add: 1 } }
		]
	},
	{
		id: "back",
		roll: 3,
		name: "Back or Chest",
		appearance: "Spines, lesions, skin discoloration or warping, rapid regeneration, hardened or loose skin or scales, vestigial wings, extra ribs.",
		abilities: [
			{ roll: 1, short: "Extra resting die for sin", text: "You can roll an extra resting die while resting. If you do, gain the same amount of sin." },
			{ roll: 2, short: "No need to breathe", text: "You no longer need to breathe. You are no longer affected by mundane toxin or poison. You cannot become intoxicated by alcohol." },
			{ roll: 3, short: "Rest off an affliction", text: "When you rest, you can gain 1 sin to remove an affliction." },
			{ roll: 4, short: "Ignore injury on a 6", text: "You have a chance of ignoring any injury (roll a d6, ignore on a 6)." },
			{ roll: 5, short: "Erase stress on pressure", text: "Automatically erase 1 stress when pressure increases." },
			{ roll: 6, short: "+1D Conditioning", text: "Gain +1D to Conditioning. This could put you up to 4D base.",
				skillBonus: { choose: ["conditioning"], add: 1 } }
		]
	},
	{
		id: "arms",
		roll: 4,
		name: "Arms or Hands",
		appearance: "Claws, split hand or arm, extra arm, twisting skin or muscles, discoloration, extra fingers.",
		abilities: [
			{ roll: 1, short: "Feat of strength +2 CAT", text: "You can gain 1d3 sin when performing a feat of physical strength to increase the CAT of that feat by +2." },
			{ roll: 2, short: "Merge an item into flesh", text: "Once a hunt, you may merge any single mundane weapon or item you could hold into your flesh, able to conceal or produce it at will." },
			{ roll: 3, short: "Dissolve matter", text: "Once a hunt, you can dissolve all non-living matter in a cube about 1/2 CAT size ({halfcat:size}) into a black sludge with a touch of your third (ring) finger." },
			{ roll: 4, short: "Arm becomes a weapon", text: "Once a hunt, you can gain 1d3 sin to morph your arm or hand into a melee weapon for a scene. It is a supernatural melee weapon of 1/2 CAT ({halfcat}) potency." },
			{ roll: 5, short: "Re-roll Force or Interfacing", text: "You can re-roll any force or interfacing roll, taking the second result as final. If you do, gain 1d3 sin." },
			{ roll: 6, short: "+1D Force or Coordination", text: "Gain +1D to Force or Coordination. This could put you up to 4D base.",
				skillBonus: { choose: ["force", "coordination"], add: 1 } }
		]
	},
	{
		id: "skin",
		roll: 5,
		name: "Skin, Hair, or Legs",
		appearance: "Major discoloration or bleaching, transparent skin, warping of gait, digitigrade or multiple legs, patchiness, change in hair color.",
		abilities: [
			{ roll: 1, short: "Leap CAT height", text: "You can gain 1d3 sin to leap up to an object CAT size ({cat:size}) in height without rolling. You can do this as part of an action roll." },
			{ roll: 2, short: "Walk on walls", text: "While touching them with your bare flesh, you can climb or walk on walls as though they were flat surfaces." },
			{ roll: 3, short: "+1D running", text: "You have +1D when running or sprinting on open ground, such as a road." },
			{ roll: 4, short: "Glide for sin", text: "You can gain 1 sin during an action roll to glide a long distance through the air as part of the action. You have to start at height to gain this benefit." },
			{ roll: 5, short: "Invisible for sin", text: "You can gain 1d3 sin to go completely invisible to mundane perception for the duration of an action roll." },
			{ roll: 6, short: "+1D Covert or Interfacing", text: "Gain +1D to Covert or Interfacing. This could put you up to 4D base.",
				skillBonus: { choose: ["covert", "interfacing"], add: 1 } }
		]
	}
];

// Location face 6 on the d6 means "choose any location".
CAIN.sinMarkChooseFace = 6;

// Names for every location face.
CAIN.core.sinMarkLocations = ["Eyes", "Jaw", "Back or chest", "Arms or hands", "Skin, hair, or legs", "Choose"];
