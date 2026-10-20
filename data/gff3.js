// Games for Freaks issue 3 (Tom Bloom / CHASM, update 1.5, November 2025):
// official new agendas and blasphemies (Archive 1998). Entries carry
// source: "gff3"; it isn't fan-made, so they get no fan border.
window.CAIN = window.CAIN || {};

(function () {
	var agendas = [
		{
			id: "doll",
			name: "Doll",
			image: "img/gff3/agenda-doll.png",
			look: { paper: "pink", accent: "#b04aa8", tape: "#f2b318" },
			requires: null,
			items: [
				{ text: "Give up on something", bold: false },
				{ text: "Willingly do something painful", bold: true }
			],
			abilities: [
				{ id: "flop", name: "Flop",
					text: "Once a hunt, you can throw yourself to the ground. While in this state humans, sins, and exorcists will treat you as if you were dead, severely ill, or unconscious. It may distract them, and they won't target you in a conflict scene. You immediately end this effect by doing anything that would require an action roll, or it ends at the end of the scene. It only works once on the same target ever." },
				{ id: "soft", name: "Soft",
					text: "You roll -1d for hard actions (even if they become easier later), but always gain +1d for straight rolls (actions that aren't hard or risky such as gathering information)." },
				{ id: "pincushion", name: "Pincushion",
					text: "Exorcists in short range from you can always take injuries or afflictions in your place. If they do, they gain 1 xp, but no more than once a mission." },
				{ id: "tagalong", name: "Tagalong",
					text: "When you participate in teamwork, the leader of the roll always takes 2 nonlethal stress, but always gains +1D." },
				{ id: "daydream", name: "Daydream",
					text: "At the start of any conflict scene, you can erase up to 4 stress. If you do, roll a max of 1d on actions for the rest of the scene." }
			]
		},
		{
			id: "cradle",
			name: "Cradle",
			image: "img/gff3/agenda-cradle.png",
			look: { paper: "grey", accent: "#141414", tape: "#f1a6e8" },
			requires: null,
			note: "When you choose this agenda, have one of its powers, or have its bolded item, choose another character as your ward. You can switch your ward around between hunts.",
			items: [
				{ text: "Protect your ward from the consequences of their actions", bold: false },
				{ text: "Let your ward suffer", bold: true }
			],
			abilities: [
				{ id: "matriphagy", name: "Matriphagy",
					text: "Your ward can deal 3 nonlethal but irreducible stress to you in place of a psyche burst as long as they are in short range of you." },
				{ id: "coddle", name: "Coddle",
					text: "Once a conflict scene, you may take the defend or aid action for free, targeting only your ward. This doesn't take your action for the round." },
				{ id: "fragile", name: "Fragile",
					text: "You gain +1 max stress, but can no longer clear stress by any means other than taking an injury.",
					modifiers: [{ stat: "maxStress", add: 1 }] },
				{ id: "sin-eater", name: "Sin Eater",
					text: "Once a hunt, when you give your ward a warm gesture (a smile, a hug, a pat on the head), you can transfer any amount of stress and up to one affliction or hook from them to you. This could cause an injury or kill you." },
				{ id: "offering", name: "Offering",
					text: "As long as you are in short range from your ward, you can gain 1d3+1 sin to prevent any injury to your ward, or 1d6+2 to prevent instant death. Each can trigger separately only once a hunt. Your ward instead remains at 1 stress below max. Describe how you avert disaster." }
			]
		},
		{
			id: "broken",
			name: "Broken",
			image: "img/gff3/agenda-broken.png",
			look: { paper: "beige", accent: "#1a1410", tape: "#c9b98f" },
			requires: null,
			note: "A new way to end a character's story. It might not be the best way. Retire your exorcist after the current mission is over. Face execution or exile. There's nothing left for you here.",
			items: [
				{ text: "Kill", bold: false },
				{ text: "Kill", bold: true }
			],
			abilities: [
				{ id: "ripped-at-the-seams", name: "Ripped at the Seams",
					text: "After pressure increases during a mission, mark off 1d3 sin boxes. When you sin overflow, you can always choose between losing and keeping control. Retire your exorcist after the current mission is over. Face execution or exile. There's nothing left for you here." }
			]
		}
	];

	var blasphemies = [
		{
			id: "tongue",
			numeral: "",
			group: "Games for Freaks 3",
			image: "img/gff3/blas-tongue.jpg",
			theme: { color: "#ff2a2a", color2: "#b0103a", dark: true },
			name: "Tongue",
			summary: "Your word is law.",
			flavor: "Your word is law.\nFact: Rooted in the language center of the brain, suggesting connections to recorded manifestations of 'ecstatic speech' and 'divine language'. Manifesting Tongue blasphemies requires special speech therapy conditioning X285 and restraint system 25 in accordance with Castle Code in order to avoid accidental exposure. You may be required to maintain silence for long periods of time. Your tongue may also turn 'pitch' or 'ink' black, or become forked. This is normal.",
			passive: {
				id: "the-word", name: "The Word",
				text: "Your powers have no effect if you can't speak, or if sound is suppressed somehow. Using the same power from this blasphemy more than once before resting has ramping effects, which are not optional.\n- Second time: +1 CAT (min. CAT 2), take 1 irreducible stress.\n- Third time: +2 CAT (min CAT 3, max CAT 7), +1D, take 3 irreducible stress. Anyone in short range from you takes the deafened affliction for the rest of the hunt (hard on rolls that require hearing).\n- Fourth time: Power always resolves at CAT 7 and do not roll (automatic successes per die rolled). Afterwards, suffer instant death as your body is ripped apart by forces beyond comprehension, which cannot be ignored. Anyone in short range of you is permanently deafened."
			},
			powers: [
				{ id: "bang", name: "Bang",
					tags: { duration: "Instant", range: "CAT range" }, burst: "onSuccess",
					text: "You say 'bang'. This causes a massive influx of force affecting up to a 1/2 CAT area ({halfcat:area}) with its center in range that typically manifests as an extreme pressure wave. It affects everything except you. Roll PSYCHE for its effects, and only spend a psyche burst on success.\n- Gain +1D if the environment around you is quiet or subdued.\n- Gain +1D if you are in an area with favorable acoustics, like a canyon, a performance venue, theatre, or a stadium." },
				{ id: "silence", name: "Silence",
					tags: { duration: "1 scene", effect: "Transmute", range: "Long" }, burst: "required",
					text: "You say 'silence' and choose an area up to CAT size ({cat:area}) with its center at a point in range. Everything in the area completely stops producing noise. Anything mundane that would make a loud noise as part of normal part of its operation completely stops functioning, such as vehicle engines, creaky door hinges, guns, explosives, fireworks, etc. Your powers from this blasphemy or any other blasphemy or psychic effect that would create a loud noise do not work inside this area.\n- Gain or grant +1D when next acting on this power.\n- This power can easily affect the parameters of rolls." },
				{ id: "narrate", name: "Narrate",
					tags: { duration: "Instant", range: "Short" }, burst: "onSuccess",
					text: "Pick up to a CAT-sized group ({cat:people}) of humans or exorcists in range (which could include yourself), an object or location in range, and a verb. Then narrate a sentence using the following structure: (He/she/they) was/were (verb)ing the (noun).\nFor example: He was opening the door. She was falling in the air. He was driving the car. They were lying on the floor.\nRoll PSYCHE for its effects, and only spend a PSYCHE burst on a success. After the sentence finishes and if the roll is successful, it becomes true, including moving any affected people where they need to be as if they were always there. This power does not adjust human memory nor can it create anything, change anyone, or directly harm anyone (it could still easily harm someone indirectly, as you can see from the examples)." },
				{ id: "die", name: "Die",
					tags: { duration: "Instant", effect: "Curse" }, burst: "required",
					text: "You say 'die' and instantly kill all humans in an area up to CAT size ({cat:area}), centered on you. This is not optional, you don't get to choose who to kill or spare, and you don't require a roll to do so. If you used this power at least once to kill one person, at the end of a hunt, permanently fill in a sin box. If you used it at least once to kill more than one person, permanently fill in 1d3 sin boxes." },
				{ id: "snap-click-pop", name: "Snap, Click, Pop",
					tags: { duration: "Instant", range: "Short" }, burst: "required",
					text: "You say 'Snap', 'Click', or 'Pop', and produce an effect that would normally produce one of those sounds. For example, you could use 'click' to open a locked door, push a button, or type on a keyboard. You could use 'snap' to break a weapon or an arm. You could use 'pop' to blow a car tire or shoot a gun someone else is holding.\nIf necessary, roll PSYCHE for effects that would be risky, unclear, or inflict harm, and only spend a burst on success. Otherwise, this power is always successful. When you or an ally next acts to gain advantage of this power, they may gain +1D." }
			]
		},
		{
			id: "track",
			numeral: "",
			group: "Games for Freaks 3",
			image: "img/gff3/blas-track.jpg",
			theme: { color: "#f7a21b", color2: "#7a4a00", dark: true },
			name: "Track",
			summary: "Check, one two, one two.",
			flavor: "Check, one two, one two.\nFact: The loose or leftover cursed objects created by this power are curated in Temerity archive 52. The collection is quite extensive and has a fairly rabid following among certain subsections of CAIN staff.",
			passive: {
				id: "playlist", name: "Playlist",
				text: "You have a powerful cursed object, which is the focus of your powers. It's a music player, typically a tape player or a cd player with attached headphones. It doesn't take KP, and you can supernaturally form and reform it in your hands at will. Make a (real) playlist of 6 songs at the start of each hunt. Some of your powers key off this playlist. Any music you play from this playlist can be heard diegetically (in the game) if you so choose. It appears to come from either a visible location in short range, your player, or nowhere in particular (like a soundtrack), and you can turn it on and off at will."
			},
			powers: [
				{ id: "replay", name: "Replay",
					tags: { duration: "Entire hunt", effect: "Charm", range: "Short" }, burst: "onSuccess",
					text: "Passive: Without spending a psyche burst, you or an ally in short range from you performs a course of activity that takes no longer than 10 seconds, which you record on your player. It records you or your ally at the moment of the recording, including dress, speech, and objects held or worn, but nothing else around them. You can keep 3 recordings this way.\nActive: You can playback a recording by spending a psyche burst. This immediately replays a psychic double of the recording. This double is physically tangible, looks and sounds believable, can inflict harm, and can interact with the physical world, though it de-manifests after 10 seconds and cannot interact in any way that was not previously recorded (for example, it can't respond to any speech, move through a wall, or open a door if it was not recorded previously doing so). Roll PSYCHE for its effects if they are unclear, contested, or risky, and only spend a psyche burst on success." },
				{ id: "boost", name: "Boost",
					tags: { duration: "Instant", range: "Short" }, burst: "required",
					text: "You can activate this power once a scene before yourself or any ally in range uses a blasphemy and makes a PSYCHE roll. Pick a track from your playlist. Record the first three digits of the track length (like 3, 3, 5). 0s do not count, so a 10:35 track would record 1, 3, 5. For each die rolled, the action gains +1 additional CAT for every die rolled that matches a number recorded from the track length (min +1 CAT, max +3 CAT, max CAT 7)." },
				{ id: "vibe", name: "Vibe",
					tags: { duration: "1 scene", effect: "Charm", range: "Self" }, burst: "required",
					text: "When a scene starts, you may use this power to play a track from your playlist. Decide if the track is Melancholy, Chill, or Angsty. Gain a bonus based on the tracks' type for the rest of the scene.\n- Melancholy: You or any ally erase 1 stress when they fail a roll.\n- Angst: After you or an ally gains an injury, hook, or affliction, they gain +1D on their next action.\n- Chill: At the end of the scene, everyone in short range of you erases 1 stress if there was no risky or hard rolls made this scene." },
				{ id: "shuffle", name: "Shuffle",
					tags: { duration: "Instant", effect: "Transmute", range: "CAT area" }, burst: "required",
					text: "You may choose any number of objects, vehicles, or people in the affected area. Anything swapped may have a size up to 1/2 CAT ({halfcat:size}) (min 0). You instantly swap their positions and momentum. You must swap things of approximately the same size and mass. If attempting otherwise, or if you need to roll for effects such as harm, roll PSYCHE and only spend a burst on success. When you or an ally next acts to gain advantage of this power, they may gain +1D." },
				{ id: "title", name: "Title",
					tags: { duration: "Instant", effect: "Summon", range: "Short" }, burst: "required",
					text: "You play a track from your playlist. You can manifest in short range from you a psychic manifestation based on any part of the title, up to CAT in size or magnitude ({cat:size}). The effect can create:\n- A psychic copy of any object named in the title\n- A psychic copy of any human or animal in the title\n- A brief burst or energy, weather, or physical force (fire/rain/wind/push/pull/pressure) named in the title\nThe manifestation lasts until you would roll for its effects or actions, until you use this power again, or until the scene passes, then it dissipates. Anything created is tangible but has an aura of unreality or 'wrongness' around it to regular humans, who will catch on under close inspection. It can cause tangible harm or force and interact with the physical world but is in no way obligated to follow your instructions if it can act independently. If the use of this power would cause harm, or be risky or uncertain in some way, roll PSYCHE for its effects when it is used, only manifesting and spending a burst on success. Otherwise, it always takes effect." }
			]
		},
		{
			id: "wire",
			numeral: "",
			group: "Games for Freaks 3",
			image: "img/gff3/blas-wire.jpg",
			theme: { color: "#2a6fe0", color2: "#8db8ff", dark: true },
			name: "Wire",
			summary: "They're like veins, if you really think about it. You can even hear its heartbeat.",
			flavor: "They're like veins, if you really think about it. You can even hear its heartbeat.\nFact: WIRE has only been discovered by CAIN in the last two years, but the organization understands it fairly well. Users may develop the ability to 'hear' phone lines and electric signals. You will eventually be able to ignore this sound. Involuntary body modification through this power is common. Do not be alarmed. It will return to normal in 1-2 hours.",
			passive: {
				id: "main-artery", name: "Main Artery",
				text: "You have a cell phone, with better features such as wireless internet access. It doesn't take KP. You can produce or remove it at will, forming it from psychic energy, even if you lose it."
			},
			powers: [
				{ id: "terminal", name: "Terminal",
					tags: { duration: "Until rest", effect: "Charm", range: "Self" }, burst: "required",
					text: "You manifest a computer terminal that emerges harmlessly (but somewhat disturbingly) from your body, usually from your chest or back. While manifesting this terminal, activities are hard if you are moving or under duress, but you can otherwise act normally, including typing or interfacing from yourself. The terminal has a fast connection to the internet and is powered, regardless of location. Any other character interacting with the terminal can use your relevant skills to gather information using you. The first time in a scene someone gathers information this way, also gain +1D. You end this power with a few moments' concentration, retracting the terminal." },
				{ id: "deck", name: "Deck",
					tags: { duration: "1 scene", effect: "Curse", range: "Adjacent" }, burst: "required",
					text: "You flip a keyboard out from any object, construction, vehicle, human, or exorcist. The keyboard lasts until you produce a new one, or until the end of the scene. While the keyboard is out and you're able to type on it, when gathering information on your subject, you can interact with them as if they were a computer. You may roll either PSYCHE or the interfacing skill, whichever is higher. The first time you do this for each keyboard, gain +1D. You can flip it out from even impossible surfaces, it may be made from unusual materials, and it does not harm a person it is produced from, although it is hard to type on them if they are unwilling or while they are moving." },
				{ id: "disk", name: "Disk",
					tags: { duration: "Instant", range: "Adjacent" }, burst: "required",
					text: "You touch an adjacent willing human or exorcist, or an object, vehicle, or construction of CAT size ({cat:size}) (including anything on or inside that object), and store them as a CD, spending a psyche burst. You can keep a number of CDs equal to your CAT +1 ({cat+1}). They reset between missions, and their contents are freed. A person stored is in a stasis of sort and has no awareness or sensation, and cannot take harm or be affected in any way, though hooks, talismans, and afflictions on exorcists within can continue to build up, affecting them instantly on release if filled. Putting a stored CD into a CD disk drive lets you read information about its captive like a text document. When you activate the CD again, or if it is broken before then, the stored person or object reappears in a space in short range of you, regardless of it there is room for it or not. Roll PSYCHE for any of its effects." },
				{ id: "surge", name: "Surge",
					tags: { duration: "Instant", range: "CAT+2 range ({cat+2:range})" }, burst: "required",
					text: "You instantly transpose your physical form and a group of up to CAT size ({cat:people}) of willing humans or exorcists in short range from you into a psychic electrical charge, then travel rapidly through a phone line or a networked computer, appearing instantly on the other side. However, you must be able to clearly see your destination, or else know the phone # of the target you want to reach, or the network address of the computer on the other side. You can use this power without knowing your destination, but where you end up is entirely up to the Admin." },
				{ id: "call", name: "Call",
					tags: { duration: "Instant" }, burst: "onSuccess",
					text: "You call any human, sin, or exorcist. Only spend a psyche burst if they pick up. If they didn't have a phone on them, this power manifests one when they pick up, and a new number for them (which you don't know unless they tell you). This phone is a little odd and disintegrates into psychic energy when you rest." }
			]
		},
		{
			id: "mother",
			numeral: "",
			group: "Games for Freaks 3",
			image: "img/gff3/blas-mother.jpg",
			theme: { color: "#a31ff0", color2: "#d27cff", dark: true },
			name: "Mother",
			summary: "She won't get out of my head.",
			flavor: "She won't get out of my head.\nFact: 07-04-1998. Request denied. HOP effectiveness of Mother's infected assets outweighs her potential risk, despite the House's increased antipathy towards her. We will continue to collect and train them when possible, and dispatch instant execution when unable to safely recover assets. As above, so below. Castle Director F. Espada.",
			passive: {
				id: "mothers-embrace", name: "Mother's Embrace",
				text: "When you sin overflow, you may gain a Mother's Mark instead of a regular sin mark, and roll 2d6, picking the lowest, if you choose to keep control."
			},
			extras: [
				{ title: "Mother's Marks", text: "A Mother's Mark does not lower sin overflow cap, but still counts as a sin mark in all other aspects. It has no other gameplay effects. Roll 1d6 for its aspect. You can gain the same mark more than once.\n- 1. New eye in center of forehead. Looks around on its own. You cannot see through it. It is not yours.\n- 2. Large patch of skin or hair loses all color, then gains banded stripes.\n- 3. New pupil in eye.\n- 4. New tongue.\n- 5. New limb. Elongated and double jointed.\n- 6. Spiraling patterns, warping the skin and muscle. Patterns change and shift over time.\nIf you lose control and have at least one Mother's Mark, you become subsumed into Mother, becoming a Mother's Favorite instead of an Imago. This is not a kind fate." }
			],
			powers: [
				{ id: "unravel", name: "Unravel",
					tags: { duration: "Until rest", effect: "Charm", range: "Self" }, burst: "required",
					text: "You unravel your skin, muscle, and organs into a pulsing mass. You can reform body parts such as hands, mouths, eyes, or teeth anywhere in this mass at will. While in this form:\n- You cannot use or benefit from your own psychic powers (other than this one), but psychic powers or effects from others can still affect you\n- You can spread through spaces as small as a sink pipe, spread out your total mass over an area equal to CAT ({cat:area}), or compact your mass into a tight shape about the size of a piece of luggage.\n- Roll PSYCHE for any effects you'd use this form for while it's active.\n- Humans are typically terrified by this form, and the next action against a human or group of humans after taking this form takes +1D.\nWhen your party rests, or when you end this power, you reform in any area that has enough space for you that your mass is touching. If there is no room for you, you instead reform when there is space." },
				{ id: "polyp", name: "Polyp",
					tags: { duration: "Entire hunt", effect: "Charm", range: "Adjacent" }, burst: "onSuccess",
					text: "You harmlessly but gruesomely remove and place either or both of your eyes, or your mouth, (or any combination of your eyes and mouth) on a human, exorcist, sin, or flat surface you can touch. For unwilling or unaware targets, roll PSYCHE and only activate this power on success.\nYou can see and speak normally from your eye and mouth, but they disappear on your face for the duration. You take any stress your eye or mouth would take as a consequence of your actions with them, and they return to your face when you end this power, or after they take harm.\nAdditionally, any number of times while active, you can take 1 sin to use a blasphemy power from any eye or mouth in CAT+2 range ({cat+2:range}) as if you were there, spending a psyche burst as normal. Gain +1D if doing so would grant you an advantage." },
				{ id: "knot", name: "Knot",
					tags: { duration: "Entire hunt", range: "Self" }, burst: "none",
					text: "Passive: When you gain any amount of stress, you can capture its negative energy without spending a psyche burst, appearing as a raised knot in your skin. Reduce stress suffered by 2 for each knot gained. You can capture up to 3 knots. At the end of any scene in which you have one or more knots, roll 1d6. When a knot bursts, you take 2 irreducible stress.\n- On a 1, take 1d3 sin and burst a knot.\n- On a 2-5, take 1 sin and burst a knot.\n- On a 6, take no sin and don't burst a knot." },
				{ id: "colony", name: "Colony",
					tags: { duration: "Instant", range: "Self, ally, short" }, burst: "required",
					text: "Gain 1d3 sin, then you or an ally in range gains a fleshy shield that absorbs 2 stress from external harm. If a character already has such a shield, increase it by +2, but they also gain 1d3 sin." },
				{ id: "coil", name: "Coil",
					tags: { duration: "Instant", range: "Short" }, burst: "required",
					text: "Your limb peels apart its flesh and skin, then lashes at a target in short range like a whip, dealing harm or pulling them some distance. Roll PSYCHE for its effects.\n- Gain +1D if you have 3 or fewer sin boxes remaining\n- Gain +2 CAT in range and potency if you have sin overflowed this mission." }
			]
		}
	];

	function tag(list) { list.forEach(function (x) { x.source = "gff3"; }); return list; }

	CAIN.agendas = CAIN.agendas.concat(tag(agendas));
	CAIN.blasphemies = CAIN.blasphemies.concat(tag(blasphemies));
})();
