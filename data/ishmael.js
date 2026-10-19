// Fan-made content from The Ishmael Protocol 1.2.2 by Sib_PHI (an unofficial CAIN
// supplement). Every entry carries source: "ishmael", so the site badges it as
// fan-made and gives it its own border. Pictures are in img/ishmael/.
window.CAIN = window.CAIN || {};

(function () {
	var agendas = [
		{
			id: "cheater",
			name: "Cheater",
			source: "ishmael",
			requires: null,
			look: { paper: "dark", accent: "#1fb6ff", tape: "#1fb6ff" },
			image: "img/ishmael/agenda-cheater.png",
			items: [
				{ text: "Lie", bold: false },
				{ text: "Keep it above the table", bold: true }
			],
			abilities: [
				{ id: "blend-in", name: "Blend in",
					text: "While you are surrounded by a crowd or darkness, you are impossible to detect until you make an aggressive action." },
				{ id: "show-off", name: "Show off",
					text: "You can perform any acrobatic maneuver that would not require a hard roll with astounding success, and you never suffer stress from landing after falling." },
				{ id: "your-next-line-is", name: "Your next line is...",
					text: "Once per rest, when conversing with another being, you may induce them to say a specific phrase you have in mind for them. The admin must interpret them as actually having meant to say it, as long as it is not harmful or detrimental for the speaker." },
				{ id: "will-of-rebellion", name: "Will of Rebellion",
					text: "Once a hunt, if you would suffer sin that would bring you to surpass your sin cap, you may use your divine agony in order to erase sin equal to the amount of Pathos released. You are unable to gain pathos for the remainder of the hunt." },
				{ id: "brer-patch", name: "Brer patch",
					text: "Once a hunt, during a conflict scene, if you would be targeted by an attack roll of 1, you may beg them to NOT do something that would TOTALLY SUCK. If you do so, they create a complication you are not affected by instead of dealing stress. This cannot stop severe attacks." }
			]
		},
		{
			id: "dreamer",
			name: "Dreamer",
			source: "ishmael",
			requires: null,
			look: { paper: "stamp", accent: "#141414", tape: "#f4f1ea" },
			image: "img/ishmael/agenda-dreamer.png",
			items: [
				{ text: "Take it easy", bold: false },
				{ text: "Work through the pain", bold: true }
			],
			abilities: [
				{ id: "honk-shooo", name: "Honk shooo",
					text: "Once per scene, you may yawn during a non hostile interaction with a human to make them feel drowsy." },
				{ id: "just-5-more-minutes", name: "Just 5 more minutes...",
					text: "Once per rest, after suffering stress, you may immediately pass out and start sleeping on the floor. If you do so, you may spend a single rest dice as if you were resting." },
				{ id: "mr-cuddles", name: "Mr Cuddles",
					text: "At the start of the hunt, choose an object or a person to be your teddy bear. If you are able to rest alongside them, erase 1 sin." },
				{ id: "overtime-dreamer", name: "Overtime",
					text: "When you roll a 1 on an action, you may spend one rest dice to instead turn that into a success. You may use this as long as you still have rest dice." },
				{ id: "beauty-nap", name: "Beauty nap",
					text: "Every rest scene, you may reroll your rest die by clearing one pathos, and pick the highest result." }
			]
		},
		{
			id: "jester",
			name: "Jester",
			source: "ishmael",
			requires: null,
			look: { paper: "dark", accent: "#e8202a", tape: "#e8202a" },
			image: "img/ishmael/agenda-jester.png",
			items: [
				{ text: "Make light of a dark situation", bold: false },
				{ text: "Give in to despair", bold: true }
			],
			abilities: [
				{ id: "unpredictable", name: "Unpredictable",
					text: "Humans can never understand your intentions fully. Gain +1D to impress, surprise or scare a human." },
				{ id: "laugh-track", name: "Laugh track",
					text: "Whenever you get a resulting roll of 1, all your allies within CAT range ({cat:range}) erase 1 Stress." },
				{ id: "i-still-got-it", name: "I still got it!",
					text: "Whenever you have 0 psyche bursts and would spend one, you say you \"still got it\", and spend a psyche burst that does not exist. If anyone calls you out, they erase 2 sin, and you suffer 3 Sin. If they call you out and you actually have it, gain one psyche burst and inflict 2 sin on them instead. If you benefit from any of these effects, lose this ability until your next rest." },
				{ id: "chaos-chaos", name: "Chaos, Chaos!",
					text: "When rolling a skill you have 0 in, you may suffer 1 sin to roll 1D3-1. You use the result of that roll as your amount in that skill instead of 0, still triggering effects that depend on having a 0 on that skill." },
				{ id: "glad-i-wasnt-that-guy", name: "Glad I wasn't THAT guy",
					text: "Once a hunt, if you would suffer instant death, you may ignore it. Your body explodes into blood and viscera, but you then reappear behind the being who killed you. You may not defy fate until you rest after killing your body double." }
			]
		},
		{
			id: "ace",
			name: "Ace",
			source: "ishmael",
			requires: null,
			note: "Gain this agenda ability as soon as you gain the Ace agenda for free. There can only be one Ace in an exorcist group. Gain this agenda only in approval by your Handler. If you fall on deaths door or fail a mission, you lose this agenda, agenda ability and permanently lose 3 sin boxes.",
			look: { paper: "gold", accent: "#5a4410", tape: "#f4f1ea" },
			image: "img/ishmael/agenda-ace.png",
			items: [
				{ text: "Display utter perfection", bold: false }
			],
			abilities: [
				{ id: "i-am-better-than-you", name: "I am better than you",
					text: "You may gain +1 CAT when using a blasphemy power that would set someone up by making it so it can only benefit you. Choose a skill to gain +1d in that may surpass the limits of 3D." }
			]
		},
		{
			id: "newborn",
			name: "Newborn",
			source: "ishmael",
			requires: null,
			look: { paper: "dark", accent: "#f4f1ea", tape: "#f4f1ea" },
			image: "img/ishmael/agenda-newborn.png",
			items: [
				{ text: "Break through the limitations of your powers", bold: false },
				{ text: "Make the sea grow further", bold: true }
			],
			abilities: [
				{ id: "predisposition", name: "Predisposition",
					text: "When defying fate, clear two injuries instead of only one. If you sin overflow through other means, clear an injury. All rolls you perform are hard until you rest." },
				{ id: "cradle-of-stygian-waters", name: "Cradle of Stygian waters",
					text: "During a rest scene, you may spend a rest dice to grant +1 Psyche burst to an ally that may go up to 4. Once used this burst cannot be recovered." },
				{ id: "swimming-instincts", name: "Swimming instincts",
					text: "Gain +1D on PSYCHE on rolls related to investigating paranormal phenomena. During sin overflow, you gain this bonus die in all usages of your blasphemy." },
				{ id: "purple-blooded", name: "Purple blooded",
					text: "Once per rest, when you have 0 psyche bursts and are affected by a psychic power or effect that is negative to you, recover 1 psyche burst and take 1 sin." },
				{ id: "stare-into-the-abyss", name: "Stare into the abyss",
					text: "When you gain a new sin mark through sin overflow, you also permanently gain a +1D on a skill of your choice, to a limit of 3D. You cannot gain any of the sixth sin mark abilities anymore, and instead chose the ability you would gain if rolling a 6." }
			]
		},
		{
			id: "macabre",
			name: "Macabre",
			source: "ishmael",
			requires: null,
			note: "Passive: If asked, you must lie to other exorcists about the agenda you've picked. If someone discovers your lie, suffer 1d3 nonlethal stress. Players may know the truth.",
			look: { paper: "stamp", accent: "#d61f1f", splatter: true, tape: "#e8202a" },
			image: "img/ishmael/agenda-macabre.png",
			items: [
				{ text: "Feign innocence", bold: false },
				{ text: "KILL ALL OF THEM", bold: true }
			],
			abilities: [
				{ id: "nocturnal-mutilator", name: "Nocturnal mutilator",
					text: "During a rest scene, you may silently leave your group and brutally murder a nameless human as your resting activity. If you do so, you may use one rest dice to clear sin." },
				{ id: "i-hold-my-knife-in-my-back", name: "I hold my knife in my back",
					text: "When interacting with another human, you may opt to hide your true nature as best as you can. Gain +1D in actions to lie, manipulate or trick this person, but for every pressure increase they remain alive for, suffer 1 sin." },
				{ id: "harbor-butcher", name: "Harbor butcher",
					text: "Once per rest, you may force a human to abide by a single request that doesn't go against their morals by turning them slightly more hostile towards you. After pressure increases, they will start hunting you down for answers." },
				{ id: "natural-born-predator", name: "Natural born predator",
					text: "You may memorize the smell of a single human or exorcist, gaining +1D in actions to track them down in future scenes." },
				{ id: "blood-bath", name: "Blood Bath",
					text: "Once per conflict scene, you may lick someone's wounds for the blood. If you are successful, for the remainder of conflict inflict +1 slash against them in mundane attacks." }
			]
		},
		{
			id: "commander",
			name: "Commander",
			source: "ishmael",
			requires: null,
			look: { paper: "grey", accent: "#141414", tape: "#f2b318" },
			image: "img/ishmael/agenda-commander.png",
			items: [
				{ text: "Abuse your power", bold: false },
				{ text: "Treat your allies like humans", bold: true }
			],
			abilities: [
				{ id: "the-boss", name: "The Boss",
					text: "You are famous in the human world for a reason you may workshop with your admin. Once per hunt, you may reveal to a human who you are. All humans in that same scene, for the remainder of the hunt, treat you and your allies as VIP's." },
				{ id: "the-bloodying-of-innocent-hands", name: "The bloodying of innocent hands",
					text: "If there is a friendly human near you, you can take 2 nonlethal stress to have that human set you up to any action, as long as it does not harm them." },
				{ id: "unwavering-devotion", name: "Unwavering devotion",
					text: "At the start of a hunt, you may declare another exorcist to be your right hand man (only if they consent). They erase 1 stress any time they partake in teamwork with you, and may choose to take a blow for you once per scene." },
				{ id: "ringleader", name: "Ringleader",
					text: "Hostile mundane threats will often prioritize dealing with you first, and the other exorcists afterwards. Additionally, once per scene when facing mundane threats, you may perform the protect action for any other allied exorcist in addition to your other action." },
				{ id: "hunt-the-white-whale", name: "Hunt the white whale",
					text: "During a rest scene, you may gather around other available exorcists for an uplifting speech, erasing 1 sin from any that are able to hear you speak." }
			]
		},
		{
			id: "traitor",
			name: "Traitor",
			source: "ishmael",
			requires: null,
			note: "Gain this agenda ability as soon as you gain the Traitor agenda for free.",
			look: { paper: "stamp", accent: "#141414", tape: "#e8202a" },
			image: "img/ishmael/agenda-traitor.png",
			items: [
				{ text: "Take fate into your own hands", bold: false }
			],
			abilities: [
				{ id: "my-new-beginning", name: "My new beginning",
					text: "At a climatic moment during the hunt, reveal your agenda and betray your allies, using the sheet for a rogue binder. If you escape, see the page for the Bounty hunts, your character now becomes a bounty target. You may control them during the hunt, and your agenda items now become your archetype items." }
			]
		},
		{
			id: "shark",
			name: "Shark",
			source: "ishmael",
			requires: null,
			note: "Passive: Your standard issue uniform is customized by yourself with little things that make you stand out. Some examples of accessories that can be used are spike bands, black lipsticks, exaggerated amounts of belts, big boots, chains or barbed wire, etc.",
			look: { paper: "dark", accent: "#e8202a", tape: "#f4f1ea" },
			image: "img/ishmael/agenda-shark.png",
			items: [
				{ text: "Defy authority", bold: false },
				{ text: "Promote meaningful change", bold: true }
			],
			abilities: [
				{ id: "artisan-of-bloodied-noses", name: "Artisan of bloodied noses",
					text: "Humans that you fight and knock out with your bare hands get a concussion and don't remember what happened." },
				{ id: "psycholera", name: "Psycholera",
					text: "During conflict, your exorcist may start playing a song. Once per round, you may hype someone up and accelerate the music, setting them up for free (this cannot alter the parameters of rolls.)" },
				{ id: "brat", name: "Brat",
					text: "During conflict, you may once per round taunt your opponents. If they get pissed off, you split the consequences of the next action with whoever is currently performing it." },
				{ id: "rebel-brotherhood", name: "Rebel brotherhood",
					text: "Humans in alternative styles (goth, punk, emo, etc.) are amicable towards you, and police are suspicious of you." },
				{ id: "bite-the-hand-that-feeds", name: "Bite the hand that feeds",
					text: "Clothes you have stolen stay with you between hunts. But (admin chooses one) they look beaten up, they are dirty, there's a huge tear. They cost 1 KP." }
			]
		},
	];

	var blasphemies = [
		{
			id: "pandora",
			image: "img/ishmael/blas-pandora.jpg",
			numeral: "",
			source: "ishmael",
			group: "Subservience",
			theme: { color: "#e8141c", color2: "#7a0b0f", dark: true },
			name: "Pandora",
			summary: "A bond built by shackles and mistrust.",
			flavor: "A bond built by shackles and mistrust.\nNEVER ALLOW A HUMAN TO INTERACT WITH THE BUDDY.",
			passive: {
				id: "buddy", name: "Buddy",
				text: "You own an object with your buddy, a sentient being with CAT defined by the admin. You can only use Pandora blasphemy abilities if you are physically carrying said object.\nOccasionally, your buddy may interject while you are doing something and say what you should do. If you abide, you gain +1D in that action. Some examples of interjections may be \"You should kill him, you know.\", \"You should bite him.\" and \"She is lying. Make her fear you.\""
			},
			powers: [
				{ id: "sensorial", name: "Sensorial",
					tags: { duration: "Instant", range: "CAT range ({cat:range})" }, burst: "required",
					text: "Your Buddy helps you find a specific entity with a specific psychic energy. You may answer an amount of the following questions up to your liking, asked by the Buddy.\n- What is their grace's color?\n- What is their physiognomy?\n- What are they afraid of?\nThe Buddy will give any relevant information you ask regarding their current state. Depending on how many answers you give, the results will be more detailed, to the admin's discretion." },
				{ id: "realm", name: "Realm",
					tags: { duration: "Scene, once per rest", effect: "Curse" }, burst: "onSuccess",
					text: "You access a world of shadowy instability, your realm, sending yourself or a CAT amount ({cat}) of humans or exorcists into this world. The realm does not physically exist, and is completely separate from reality. If a human or exorcist is hostile or unwilling, roll psyche and only spend a PSYCHE BURST on success.\nAlternatively, you may propose a game to them. This game can be anything as long as it has a 50/50 chance of victory for both parties. If you lose this game, you are sent to the shadow realm. If they lose, they are sent instead. If you opt to play the game, you do not need to roll psyche.\nAt the end of the scene, they are freed from the shadow realm, scarred mentally." },
				{ id: "hex", name: "Hex",
					tags: { duration: "1 scene, once a scene", effect: "Curse" }, burst: "onSuccess",
					text: "You utter a phrase in a language your buddy is fluent in. Your target must be able to hear the hex, and they will understand it no matter the language. The hex requires focus, therefore, it cannot be used under an extreme amount of stress, and requires complete concentration from the exorcist. Every hex must be worded as follows:\n\"By word of Fiend, When you (action), God will make your (noun) (verb).\"\nFor example: When you open that door, your face will boil like tar. When you hurt one of my allies, your arms will fall off. When you tell this to someone else, your lips will be sewn shut.\nIf the target of the hex performs the chosen action, roll PSYCHE, only spending a psyche burst in success, and inflict the curse onto your target, who is always affected to at least a small level. Your curse may either inflict slashes or become more potent with each success.\n- Gain +1D if the action was something they could avoid\n- Gain +1D if the action and curse were specific enough (up to the admin's discretion)\n- Gain +1D if the action and curse were cohesive between each other." },
				{ id: "transform", name: "Transform",
					tags: { duration: "1 scene, once per rest", effect: "Transmute", range: "Self" }, burst: "all",
					text: "Spend all your remaining Psyche bursts (minimum of 1). Your artifact fuses to your clothes, shaping it to your liking, in a magical transformation. Your transformed self may have any clothing you desire whatsoever, and your artifact becomes a weapon of your choice that fits your outfit.\n- While transformed, your artifact becomes a mundane weapon of your choice with potency equal to your CAT ({cat}). Attacks using this weapon roll with PSYCHE. You may spend a psyche burst to gain 1D on an attack and make it count as supernatural.\n- During sin overflow, instead of the buddy taking control immediately, you are able to control yourself for a CAT amount ({cat}) of actions.\n- Humans that attempt to look at you suffer from the same effects as looking at a form II sin: seizures, unconsciousness and potential death.\n- Your buddy's interjections become more frequent." },
				{ id: "shed", name: "Shed",
					tags: { duration: "Entire hunt, once a hunt", effect: "Curse" }, burst: "required",
					text: "The artifact sheds its will onto a CAT amount ({cat}) of corpses you can see, weakening itself and giving life to the dead.\n- The dead are completely brainwashed by the Buddy, and have their memory superimposed to see them as their savior.\n- The Buddy may use the corpse to speak in its behalf.\n- The corpses swear loyalty to you, and they are always going to attempt helping you as long as the buddy is not physically present. If it is, their loyalty changes to the buddy.\n- You may ask the buddy to bring the corpses back into the artifact, making them disappear. You may ask it to bring them back, but the buddy may then ask you a favor.\nThe dead remain alive until the hunt ends, or if they are killed. Treat them as mundane humans for the purpose of killing them." }
			],
			extras: [
				{ title: "Building the Buddy",
					text: "The Pandora blasphemy artifact is indestructible, you always know its location and you start every hunt with it. It costs 0 KP to summon your Artifact.\nIf you ever suffer sin overflow, roll a risky Psyche check. If you fail, the buddy inside your artifact takes control over your body, and locks you inside it. If the artifact makes physical contact with the buddy again, you recover your body automatically.\nThe Buddy needs a sheet to interact with the world. With your admin, build the sheet for your buddy. When the buddy gains control of your body, you may choose to either attempt to control your buddy, or give it up to your admin. The person who would potentially cause the most destruction when in control of the buddy gains control.\nMotivation: Firstly, write their motivation. The motivation of a Buddy defines what they are willing or unwilling to do, many times the motivation of a buddy is what makes them viable for use by TEMERITY at all. Some examples: \"I want to protect my exorcist friend from harm.\", \"I want to help those who need me, and punish those who don't.\", \"I WILL END ALL LIFE ON EARTH.\"" },
				{ title: "Buddy type",
					text: "A buddy can be potentially anything, from an anomaly, Sin or Exorcist. They gain additional characteristics to their sheet depending on the type they are. A Buddy gains one complication from the perfect sin list in GFF3.\n- Anomaly: choose a drifter type to add their complications, threats and inflict stress actions. The buddy is able to, as a complication, lunge into the psychic sea to recover slashes to its execution talisman. The admin may write a unique SPECIAL ability for a buddy of the anomaly type.\n- Exorcist: choose an amount of blasphemy abilities up to you and the admin. The buddy has access to these blasphemies in their purest form, and can use them as they wish. Add the rogue binder's complications, threats and inflict stress actions to the buddy's sheet.\n- Sin: choose the type of sin and then their three domains. Add the sin type's complications, threats and inflict stress actions to the buddy's sheet. You or the admin may choose the trauma questions of the sin." },
				{ title: "Buddy sheet",
					text: "Buddy, CAT from 1 - 7. Anomaly/Sin/Exorcist. Execution talisman: your CAT + 7.\nBuddy is a bound drifter, sin or exorcist locked inside of an artifact, unable to be freed by normal humans. Fortunately for them, they have found a suitable host: You. The buddy can only interact with the physical world if allowed by you, or if they are able to rob your body.\n- May create a pocket dimension where you and them are the only existing beings\n- May float for a CAT amount of minutes.\nReactions: Inflict stress. Attacks with: body parts, Curses, Psychic blasts of energy. (1) 5 stress, (2/3) 3 stress, (4+) 2 stress. Or: Create a complication or Threat: Summon a powerful curse, create an illusion, shapeshift, create zombified humans, use a psychic ability in a creative way.\nSpecial: Secrecy. As the admin, while building the buddy, choose between the two following specials and don't tell your player which of them their buddy has.\n- Anthropophagy: The Buddy, after a sin is executed, may devour its psychic powers whole. The Buddy gains permanently +1 to its execution talisman, and adds one of its domains, complications and threats to its sheet. If their CAT was lower than the sin, their CAT is permanently raised by 1.\n- Pact: The buddy may propose a pact to an exorcist that is not their owner, to help them somehow, in exchange of becoming a new host for the buddy. If they agree, the buddy can now take their body if it would be beneficial to them, and in exchange, they abide by their request." }
			]
		},
		{
			id: "rot",
			image: "img/ishmael/blas-rot.jpg",
			numeral: "",
			source: "ishmael",
			group: "Subservience",
			theme: { color: "#e8141c", color2: "#7a0b0f", dark: true },
			name: "Rot",
			summary: "It doesn't matter where you would have gone, Heaven or Hell. Your grace stopped you from having freedom.",
			flavor: "It doesn't matter where you would have gone, Heaven or Hell. Your grace stopped you from having freedom.",
			passive: {
				id: "slasher", name: "Slasher",
				talisman: "{cat}",
				text: "You may only take this blasphemy as your first one or if you did not survive a hunt. You come back as a stumbling corpse, holding an incredibly sober consciousness, but slowly rotting away. Mundane humans are naturally repulsed by your cadaveric look, and you always smell like rotting flesh. This may negatively affect the parameters of rolls such as difficulty or risk.\nCreate a DEATH DEFIANCE talisman with a CAT amount ({cat}) of segments. Slash it once every time you die, coming back to life instead with a cosmetic open wound when you next rest, clearing one injury, or instead coming back at the start of the next hunt.\nEvery time a segment from the DEATH DEFIANCE talisman is slashed, you permanently lose one stress cap, or lose 2 sin cap, whichever you prefer.\nDeath defiance may not be ticked down in any way whatsoever. Suffering instant death from an unavoidable source ticks death defiance twice. If you would slash it again when already fully slashed, you suffer a painful and excruciating gory death which scars anyone who witnesses it for life, as your flesh and organs melt on your corpse.\nAfter you fill the death defiance talisman, your body fully rots, leaving only your skeleton, some few small organs and blood. Suffer instant unavoidable death. You cannot come back to life. Create a new character."
			},
			powers: [
				{ id: "dislocate", name: "Dislocate",
					tags: { duration: "1 scene", effect: "Transmute", range: "Self" }, burst: "required",
					text: "You loosen up your tendons, bones and muscles, allowing you to grow freakishly tall, long or big. You may grow more flesh at certain chosen parts of your body while this is active, becoming up to a maximum CAT size ({cat:size}).\n- If you have the Costume ability, you are able to keep parts of the costume that are not loosened.\n- You may use your loosened limb to quickly travel with your whole body to where your limb ends\n- You may alternatively grow roots from your limb onto physical surfaces, your flesh and veins locking you to a certain surface.\nGain or grant +1D when you or an ally takes advantage of this power. This may easily affect the parameters of rolls such as difficulty or risk." },
				{ id: "costume", name: "Costume",
					tags: { duration: "Entire hunt", effect: "Transmute", range: "Self" }, burst: "required",
					text: "You have created a fleshy suit for yourself that contains your full form and allows you to hide your true nature. Your smell and looks are now chosen by you, but the suit is always slightly uncomfortable. Choose one of the following to affect you while wearing the suit\n- It may be a bit too small for your own good.\n- It may hinder your sight, speech or other sense.\n- It may prevent you from performing certain actions completely.\nThe costume does not need to look human. Suffering stress while inside the suit makes it rot instantly and frees your true form.\nGain or grant +1D when you or an ally takes advantage of this power. This may easily affect the parameters of rolls such as difficulty or risk." },
				{ id: "mesh", name: "Mesh",
					tags: { duration: "Instant", effect: "Transmute", range: "Self" }, burst: "required",
					text: "You wither away into blood and sinew in an instant, creating a massive puddle of blood, and rebuilding yourself at a point you believe your blood is currently present within a CAT range ({cat:range}).\n- Your organs magically reappear at this new spot, where your body grows out of.\n- If you are wrong and there is no blood there, or if it has been cleaned, you do not spend a psyche burst. Your body reconstructs itself where you originally were.\n- You may use this in any single point where there is some of your own blood." },
				{ id: "feast", name: "Feast",
					tags: { duration: "Until rest, once per hunt", effect: "Charm", range: "Self" }, burst: "onSuccess",
					text: "Roll PSYCHE and only spend a psyche burst in a success. You shed your own skin and muscles in order to bleed a sweet blood from your own body, an addicting taste that is able to close off wounds by growing flesh where they once were. Answer the following questions, gaining +1D for every \"Yes\" answer, that may surpass the limits of rolls.\n- Has this part of your body still not been taken by Rot? If so, take 2 nonlethal stress.\n- Are they willing to devour your flesh for no reason other than thirst? If so, take 2 nonlethal stress.\n- Are you currently not significantly hurt?\nFor every success, clear 1 stress from whoever feasts on your blood. This may apply to every exorcist or human that feeds on your blood. Someone may not feast twice to clear stress. You may feed an amount of people equal to your CAT ({cat})." },
				{ id: "remnants", name: "Remnants",
					tags: { duration: "1 scene", effect: "Summon", range: "CAT targets ({cat})" }, burst: "required",
					text: "You dig back the souls of a CAT amount ({cat}) of targets and bring them back as ghostly apparitions that do whatever they wish to. These ghosts are sentient but are incapable of speaking to you (since they don't have vocal chords).\nYou may attempt to speak to them through other means such as ghost boards or asking them to write. These ghostly apparitions may choose to reveal themselves to humans, and are capable of controlling objects by possessing them.\nAt the end of the scene, they go back to the other side of the veil." }
			]
		},
		{
			id: "angler",
			image: "img/ishmael/blas-angler.jpg",
			numeral: "",
			source: "ishmael",
			group: "Freedom",
			theme: { color: "#ff9a10", color2: "#a85a00", dark: true },
			name: "Angler",
			summary: "Hunters work for glory. Anglers work for sustenance.",
			flavor: "Hunters work for glory. Anglers work for sustenance.\nCOLOSSUS: Anglers often make creative uses of power by summoning hostile drifters. This process often completely drains them of psyche bursts.",
			passive: {
				id: "silver-lining", name: "Silver Lining",
				text: "You may keep as many summon blasphemy effects active at once as you wish by reducing the CAT of each ability by 1 for each active summon effect (this may not bring an effect below CAT 0). You may ignore this penalty for one ability when using it, but if you do, roll 1d6. In a 4 or less, you also summon an uninvited drifter (see Angler Drifters)."
			},
			powers: [
				{ id: "fountain", name: "Fountain",
					tags: { duration: "1 scene, once per rest", range: "Touch" }, burst: "required",
					text: "You carve, with immense psychic energy, a rift between the tangible and the intangible, between reality and the psychic sea, creating a pillar of dark water that seems to infinitely stretch upwards, and only psychics can see and enter.\n- You can only enter the fountain at its base, but the pillar of darkness goes up to a CAT +2 size ({cat+2:size}).\n- A being inside the fountain is able to see psychic constructs in the distance, such as a Gate's pocket dimension, a Flux lost in time or a Palace from a sin or exorcist. Each psychic construct is randomly spaced out.\n- A being inside the fountain can freely float and move at CAT speed ({cat:speed}) in any direction.\n- Beings that access the fountain are able to harm each other. If a being directly accessed a psychic construct through a natural means (i.e. physically entered their palace), they cannot be harmed by someone using the fountain.\n- The fountain automatically closes and kicks anyone within it out if the angler responsible for its creation chooses to close it or suffers an injury." },
				{ id: "shoal", name: "Shoal",
					tags: { duration: "Until rest", effect: "Summon", range: "Short" }, burst: "required",
					talisman: "{halfcat}",
					text: "You summon a shoal of indistinct small drifters that completely cover up the face or any other identifiable features from your body and of another CAT amount ({cat}) of individuals.\nThe Shoal has an execution talisman of 1/2 CAT ({halfcat}). Psychic beings that are able to perceive you can very clearly see the shoal covering up your features, while humans cannot and instead picture your features as blurry messes they cannot properly remember.\nThis may easily affect the parameters of rolls such as difficulty or risk.\nD-191 - The Shoal: The shoal tends to manifest mainly for humans that have suffered a great amount of trauma, but are otherwise incapable of birthing a sin. The shoal covers up memories of their trauma, erasing from the psyche of that human their sources of pain. This may include pictures, body parts, and even people. Dealing with a shoal usually causes the birth of sins, and therefore requires angler deployment in over 78.51% of cases." },
				{ id: "bubbles", name: "Bubbles",
					tags: { duration: "Until rest", effect: "Summon", range: "Short" }, burst: "required",
					talisman: "1",
					text: "You summon a CAT amount ({cat}) of \"bubbles\" from the sea that float and have an execution talisman of 1. The bubbles consume any mundane object of 1/2 CAT in size ({halfcat:size}) that comes in contact with it, which starts to float inside it.\n- You may choose to summon only one Bubble that can consume any object or being of up to CAT size ({cat:size}).\n- If something inside a bubble suffers stress or slashes, the bubble pops and dies.\n- The bubble always moves in a direction you set and it is able to float, carrying the object it has consumed regardless of weight.\nThis may easily affect the parameters of rolls such as difficulty or risk.\nD-101 - Bubbles: Many times confused for another spherical fleshy drifter, Bubbles are different in that they don't outwardly appear to be made of flesh. It's up to questioning if they are even conscious in the slightest. Bubbles create a space of non gravity inside them, while being extremely fragile on the outside. When popped, they release light amounts of psychic energy." },
				{ id: "vessel", name: "Vessel",
					tags: { duration: "Once a hunt", effect: "Summon", range: "Touch" }, burst: "required",
					text: "You mold the will of the sea into a tangible form, creating an empty human vessel made of a material similar to clay, indistinguishable from a normal human, but without a mind of its own.\n- You can command the vessel to perform simple mindless tasks, such as pulling a lever, walking somewhere or following someone.\n- You are able to imbue knowledge you carry onto the vessel, that will now, when prompted, repeat coldly what it knows.\n- If the vessel suffers slashes or stress, it retreats into the psychic sea by instinct, and comes back in the following scene as if nothing happened\n- Once per scene, you may summon the vessel from wherever it is to stand directly in front of you. During conflict, you may do this as a reaction, treating it as if the vessel used the protect action.\nGain or grant +1D when you or an ally take advantage of this power.\nD-548 - The Goner: The goner is a drifter that often goes completely unnoticed by most exorcists, they are an empty husk pretending to be a human that only spits information and pretends to be able to understand what he's told. The goner when questioned further becomes completely greyscale, and will very often cease to exist altogether after saying something cryptic that does not seem to make sense." },
				{ id: "bait", name: "Bait",
					tags: { duration: "Until rest", effect: "Curse", range: "Touch" }, burst: "onSuccess",
					text: "You can see through other peoples' graces, perceiving reality as they would as long as you can concentrate. Select a CAT amount ({cat}) of people and Roll PSYCHE, and only spend a Psyche burst in success.\n- You can toggle between your own vision and that of one of your targets used as bait.\n- You can feel any sensation your currently viewed target feels, but you cannot suffer stress they take\n- If there is more than one person targeted through bait, you instinctively know when one of them is in danger and you aren't looking.\n- You can use Angler abilities through the target as if you were physically in their place.\nIf your bait is human, you can see the presence of psychic beings that they cannot perceive." }
			],
			extras: [
				{ title: "Angler Drifters",
					text: "When you fail your silver lining roll, send this spread to your admin. They may choose one of the following drifters to haunt you for the remainder of the hunt. Only use the stat block of each drifter if the conditions outlined for the chosen drifter are met. The Angler shares consequences of any actions that are made during conflict against one of these drifters. These drifters will always prioritize killing the angler first, and doing so makes them fizzle out of existence. The angler knows the mechanics of all drifters." },
				{ title: "D-391 - Roaches",
					text: "Anomaly. Execution talisman: 3 (group), 5 (large group), 7 (horde). A minuscule and incomprehensible form made entirely of small roaches.\nManifests: The roaches manifest inside the angler's kit. Occasionally, an item they summon with kit points might be covered in roaches. If they clean them off, the roaches manifest.\nReactions: Inflict stress. Attacks with: Bites, destroying objects, spitting acid enzymes. (1) 3 stress, (2/3) 3 stress, (4+) 1 stress. Or: create a complication or threat: Steal an item, enter an exorcist's clothing, bite with disease infested fangs, devour flesh (heal 1 to 2 slashes from their execution talisman).\nSpecial: Scarab. The roaches can rapidly cover a consumable completely, devouring it in instants. If the consumable chosen is not used immediately, it gets devoured by the roaches and they heal 1 slash from their execution talisman." },
				{ title: "D-958 - Child",
					text: "Anomaly. Execution talisman: 1. The child is an innocent being with good intentions, only seeking to have fun with their parents. They want to feel loved.\nManifests: The child is enchanted by the human world, and wants to feel like it's a real child. The angler must treat them as if it were their own child. If the child feels neglected, they manifest into reality.\nReactions: Inflict stress. Attacks with: Psychic waves of sadness, loud inhuman screeches, claws and teeth. (1) 1 stress, 4 sin. (2/3) 1 stress, 2 sin. (4+) 1 stress. Or: Create a complication or threat: create mass hysteria, cause a scene in public, involve civilians, summon wild animals, search for an object that can hurt them.\nSpecial: Waaaaaaaaaah! If the Child dies due to a complication they created or due to another exorcist, the Angler suffers instant death instead and the Child remains alive.\nSpecial: Parental Bond. The only way to defeat the child is by calming it down with a lullaby. To do so, the angler must catch the child, and attempt a PSYCHE roll. Any other exorcist may attempt to sing the lullaby, but it will be considered Hard. In success, the child falls asleep in their arms, and remains manifested for the remainder of the scene. If it wakes up, conflict resumes. If it is still asleep at the end of the scene, it ceases to exist." },
				{ title: "D-761 - Tall Man",
					text: "Anomaly. Execution talisman: 6 + the Angler's CAT. Alternatively, 11. The tall man is an intelligent stalker, only appearing to those it deems would fall for their tricks. They always look from afar, and will never attack if not threatened.\nManifests: The tall man appears after a switch is turned, standing in the corner of the room. If the angler, or any being that can see the tall man, looks at the tall man for more than 10 seconds, the tall man manifests into reality.\nReactions: Inflict stress. Attacks with: extremely long limbs, black tentacles, causing internal bleeding. (1) 6 stress, (2/3) 4 stress, (4+) 3 stress. Or: create a complication or threat: Teleport behind someone, disappear completely, break a camera, crack someone's neck, control someone's mind.\nSpecial: Sightseeing. At the start of a hunt, choose a human npc that can also see the Tall man other than the angler. Any other being who discovers the existence of the tall man can now also see it, including other exorcists. This may affect the Tall man's manifestation requirement." },
				{ title: "D-076 - Stalker",
					text: "Anomaly. Execution talisman: 2 + the Angler's CAT. Alternatively, 5. A humanoid with average height, always dressed in common clothes. Always appears at the worst possible time. A sadist and strategist, their presence is macabre, only working alone. There might seem to be many, but it's only one. They wish to be seen as real.\nManifests: The stalker follows the group endlessly and specifically the angler, closely, whispering disgusting truths into their ears. If the angler recognizes they exist, the stalker manifests into reality.\nReactions: Inflict stress. Attacks with: Screeches, vicious bashes. (1) 5 stress, (2/3) 3 stress, (4+) 2 stress. Or: create a complication or threat: speak something into someone's ear, share hazardous information, blend in with a crowd, create an illusion.\nSpecial: Emotional leech. The Stalker perfectly comprehends human culture, language and can read the minds of other humans or psychic entities. The stalker heals 1 to 3 slashes from its execution talisman anytime a sentient being has a strong reaction against something the stalker says." }
			]
		},
		{
			id: "cycle",
			image: "img/ishmael/blas-cycle.jpg",
			numeral: "",
			source: "ishmael",
			group: "Freedom",
			theme: { color: "#ff9a10", color2: "#a85a00", dark: true },
			name: "Cycle",
			summary: "Earth moves in cycles around the sun. You move in circles around the dead.",
			flavor: "Earth moves in cycles around the sun. You move in circles around the dead.\nALERT: Exorcists without a drivers license are not allowed to start the learning process of the Cycle blasphemy. Sorry. International law forced our hands.",
			passive: {
				id: "valkyrie", name: "Valkyrie",
				text: "You have a motorized psychic vehicle called a Chariot, that only you know the controls of and are able to operate, and may summon at any point during a scene. Your Chariot may be any single land bound tool of transportation that exists. Your Chariot may go up to CAT speed ({cat:speed}) with enough time ramping up, but is naturally equal to your speed when starting movement. Your vehicle has a CAT ({cat}) slashes talisman, and to fix it you must spend all your remaining psyche bursts, or use a rest dice during a rest scene to do so.",
				talisman: "{cat}"
			},
			powers: [
				{ id: "radar", name: "Radar",
					tags: { duration: "Until rest", effect: "Transmute", range: "Extreme" }, burst: "none",
					text: "Passive: By leaving an item of at 1 KP or lower with a person, you are able to see the holder of that current item in your Chariot's GPS.\nActive: You make your Chariot move automatically, seeking a target you can see on your radar. Your chariot will always seek the fastest route possible, even going through walls or going outside the beaten path to find them. It may use your psychic powers in small ways on its own to move faster, such as creating portals with GATE. This does not spend Psyche Bursts." },
				{ id: "overwhelm", name: "Overwhelm",
					tags: { duration: "Once a scene", effect: "Charm", range: "Self and Chariot" }, burst: "none",
					text: "Without spending a psyche burst, you may summon a future version of yourself driving at top speed, tires burning, to briefly help you out on a single action, acting twice, and being able to use two chariots at once.\nNote every resource of your future self that you spend on a separate piece of paper, and save it for later.\nLater, at a calmer moment in the same hunt, when you are in your chariot, spend a psyche burst to travel back in time to that moment. You spend all resources you used back on that moment.\nIf you are unable to perform the travel back, suffer 2d3 sin and perform it forcibly if you sin overflow, without spending any resource." },
				{ id: "grip", name: "Grip",
					tags: { duration: "Instant", effect: "Charm", range: "Chariot" }, burst: "required",
					text: "Passive: you are able to defy gravity and physics while your Chariot is in movement, being able to drive on walls and ceilings without falling as long as it is in constant movement. You may also use this power to drive through deep liquid surfaces such as rivers.\nActive: you may spend a psyche burst to make it so your Chariot is able to use thinner or more unstable surfaces to drive, such as people, thick gases, etc.\nThis may easily affect the parameters of rolls such as difficulty or risk." },
				{ id: "gear", name: "Gear",
					tags: { duration: "1 scene", effect: "Charm", range: "Chariot" }, burst: "required",
					text: "You have an additional gear in your chariot that allows you to hit insanely high velocities. You do not spend psyche bursts by changing from this gear to any other, and may switch back while in the same scene you used this power.\nThis special Gear allows you to reach a velocity of CAT + PSYCHE. If you would surpass CAT 7 speed, you instead gain 1 additional MACH of velocity. Crashing at a Velocity higher than CAT 7 inflicts instant unavoidable death, as your body and chariot explode in fire and blood.\nGain or grant +1d when you or an ally takes advantage of this power." },
				{ id: "sign", name: "Sign",
					tags: { duration: "1 scene, once per rest", effect: "Summon", range: "Short" }, burst: "required",
					text: "You are able to summon a psychic traffic sign that forces any that see it, including you, to abide by the warning it poses. Anytime someone attempts to break the rule imposed by the sign, roll PSYCHE, and in failure, they are able to break that rule.\n- Signs like \"Stop\" or \"No Parking\" require a line to be drawn where it immediately takes effect after being crossed.\n- Setting a speed limit also forces any inside the area to move at half that speed. If they are unable to, their speed is psychically raised to match it.\n- Signs like \"Warning: landslide\" or \"dead end\" directly affect reality, making the warned circumstances actually exist and take place.\nAfter a sign is defied successfully or its effect ends, you may change it to another one you have not used this scene by spending another psyche burst.\nThis may easily affect the parameters of rolls such as difficulty or risk." }
			]
		},
		{
			id: "lens",
			image: "img/ishmael/blas-lens.jpg",
			numeral: "",
			source: "ishmael",
			group: "Precision",
			theme: { color: "#1e8fff", color2: "#0b4f99", dark: true },
			name: "Lens",
			summary: "Blast after blast until it is done.",
			flavor: "Blast after blast until it is done.\nALERT: Rail cannon jumping is prohibited inside CASTLE premises.",
			passive: {
				id: "gun", name: "Gun",
				text: "Replace your Blast blasphemy with GUN. Spend a psyche burst to summon a spectral firearm you and only you are capable of touching, wielding and shooting perfectly well. Your guns' shot distance and strength scales with CAT ({cat:magnitude}).\n- Your gun does not need to be held by you at all times and can float alongside you.\n- You can have a number of different guns summoned equal to your PSYCHE, and can only shoot one at a time.\n- Your GUN performs supernatural attacks. To shoot your GUN at a target, roll PSYCHE. The gunshot is always naturally hard to aim.\n- You may choose to use an action to aim at a specific target, setting yourself up for your next action. Your next attack with any of your guns is no longer hard.\n- Every GUN has an Ammo shortage talisman, that is slashed when shooting the respective GUN. After fully slashing the ammo shortage talisman, immediately suffer the Ammo shortage effect.\nThe ammo Shortage talisman of each GUN is individual, and is not considered a hook nor affliction.\nAmmo Shortage: Your gun has no bullets left in it. You cannot perform attacks with your gun until you spend a psyche burst to refuel your gun. If you do so, erase all slashes on this talisman, and start blasting again."
			},
			powers: [
				{ id: "predator-eyes", name: "Predator Eyes",
					tags: { duration: "Once per rest", range: "GUN range" }, burst: "required",
					text: "Your eyes are accelerated by your overwhelming psychic energy, freezing the image of those around you for yourself. Aim at a 1/2 CAT amount ({halfcat}) of objects or beings you can see, and after choosing your targets, you fire instantly, always hitting your shots on inanimate objects.\n- Gain +1d if you are able to clearly see your target.\n- Gain +1d if your target is standing still." },
				{ id: "sentry", name: "Sentry",
					tags: { duration: "1 scene", effect: "Transmute", range: "Short" }, burst: "required", talisman: "{halfcat}",
					text: "You lay down one of your summoned guns in the ground, which quickly transforms itself into an automatic psychic turret with the capacity to detect movement.\n- Any mods that gun originally had are ported over to the sentry, altering its capabilities.\n- The sentry will automatically seek out and shoot at any being that enters its range until it has killed them. You may choose a CAT amount ({cat}) of people to not be targeted by the sentry.\n- The sentry has an execution talisman of 1/2 CAT ({halfcat}) slashes.\nYou always know when the sentry is destroyed or when it fires a shot. When it fires, roll an attack with PSYCHE for it." },
				{ id: "eliminate", name: "Eliminate",
					tags: { duration: "Instant", range: "GUN range" }, burst: "required",
					text: "You channel a psyche burst through your gun, and by hitting a target with it, you instantly erase any trace of their existence from reality. Choose a target of a CAT equal to or lower than yours, and answer the following questions, gaining +1D for every question you answer \"No\" to.\n- Are they any threat to you?\n- Will anyone notice they're gone?\nIf your attack would finish their execution talisman, they are completely erased from reality and leave no body behind. If this attack does not kill them, you suffer half the slashes you dealt them as stress." },
				{ id: "signal", name: "Signal",
					tags: { duration: "Instant", effect: "Summon", range: "GUN range" }, burst: "onSuccess",
					text: "You are able to link the psychic presence of yourself or one of a willing target to one of the bullets you fire through your gun, who, as soon as said bullet hits a physical surface, are teleported to the point the bullet hit. If the target is unwilling, roll PSYCHE and only spend a psyche burst in success." },
				{ id: "marked", name: "Marked",
					tags: { duration: "Instant", range: "GUN range" }, burst: "none",
					text: "Passive: You are capable of controlling the exact trajectory of the bullets you fire from your gun or any other projectile you may shoot or throw, controlling them remotely. By doing so, the bullet slows down to CAT speed ({cat:speed}) instead of the usual speed of a bullet. You may increase this speed again by letting go of controlling the bullet.\nThis may easily affect the parameters of rolls such as difficulty or risk." }
			],
			extras: [
				{ title: "Weapon Mods (Passive 2)",
					text: "You can modify each of your individual guns with different psychic weapon parts. Each gun you have may have different weapon mods. You cannot put two mods of the same area on a gun. When picking a Lens Blasphemy ability, you gain a new spot you can modify in your gun.\nAny mods that don't seem to work together do not work. Narratively, these parts do not fit in the same gun at all, or would make it nearly impossible to carry.\nEach area is unlocked by the matching power." },
				{ title: "Sights (Signal)",
					text: "- High precision sight: You can see perfectly along the range of your GUN while looking at the sights. The range of the GUN is considered to be CAT+2 ({cat+2:range}).\n- Thermic sensor: You can see beings behind walls and other types of cover through your gun sights and the predator eyes.\n- Simple sights: You can no longer aim with this gun, but it can never be naturally hard to hit this gun's shots against mundane threats." },
				{ title: "Muzzles (Eliminate)",
					text: "- Bayonet: You have a 1/2 CAT ({halfcat}) melee weapon at the tip of your barrel.\n- Muzzle brake: Your aim action sets you up for all future shots you fire from this gun, as long as you are able to stay in the same place as your first shot.\n- Suppressor: Your GUN makes no sound when it fires, and no psychics can see your gun or the bullets from the gun. The suppressor does not work with the rail cannon." },
				{ title: "Barrels (Sentry)",
					text: "- Double Barrel: You attack twice with this GUN, but immediately suffer ammo shortage after doing so. This GUN cannot surpass Short range in effectiveness.\n- Long Barrel: The range of your gun is CAT+2 ({cat+2:range}). If it would surpass 7, you roll +1d.\n- Rail Cannon: The Rail Cannon is heavy and makes an explosive obvious sound. Your shots have 1/2 CAT ({halfcat:magnitude}) magnitude, and you may shoot at your feet to throw yourself in CAT distance ({cat:range}), suffering 1/2 slashes in the process." },
				{ title: "Magazines (Predator Eyes)",
					text: "- Mundane Clip: Your clip is mundane in nature. If you are able to find bullets that fit this weapon, you may use them instead of psyche bursts. They are always mundane shots and are always hard no matter what.\n- Hand fed: After clearing Ammo shortage, roll +1D in your next shot. Your next shot is also already considered to be aimed.\n- Extended Mag: You ignore the ammo shortage talisman. At the end of every conflict scene, spend a psyche burst to refuel your gun. The extended mag does not work with Double barrel." },
				{ title: "Bullets (Marked)",
					text: "- Reinforced bullet: Bullets you shoot can pass straight through the first target you shot, and potentially hit other targets.\n- Psychic bullet: When controlling your bullet with Marked, you are able to make your bullets pass straight through solid surfaces.\n- Flamer fuel: You cause only half the slashes you would normally inflict, but in a 1/2 CAT area ({halfcat:area}). Every being hit by the gun suffers 1 slash at the end of their action. This effect ends after 1/2 CAT ({halfcat}) rounds." }
			]
		},
		{
			id: "data",
			image: "img/ishmael/blas-data.jpg",
			numeral: "",
			source: "ishmael",
			group: "Precision",
			theme: { color: "#1e8fff", color2: "#0b4f99", dark: true },
			name: "Data",
			summary: "The internet was not invented, it was discovered.",
			flavor: "The internet was not invented, it was discovered.\nIf you call a support agent, give them this info: Stop code: CRITICAL_PROCESS_DIED. As within, so without.",
			passive: {
				id: "uh-oh", name: "Uh Oh! :(",
				text: "While using a Data blasphemy ability, you may choose to suffer 2 stress to increase the CAT of the ability up to CAT+1 ({cat+1}). If you ever suffer an injury due to the Data blasphemy, you suffer a fatal system failure, and are rendered unconscious for the remainder of the scene."
			},
			powers: [
				{ id: "memetics", name: "Memetics",
					tags: { duration: "Once a scene", effect: "Curse" }, burst: "onSuccess",
					text: "Roll psyche. In a failure, you do not spend a psyche burst and cannot use this power.\nYou force a series of pop-ups to appear inside a CAT amount ({cat}) of target's minds, starting out with simple catch phrases that they are immediately forced to deal with, that are immediately followed up with more and more complex information in the form of advertisements, completely overloading them with undesired information.\nAfter a 1/2 CAT amount ({halfcat}) of minutes, or after the target suffers any stress, the effect ends. Choose one of the following to enable in your targeted beings:\n- Sight: their eyes are completely overwhelmed by real ads for products they have no interest in, taking the form of popups.\n- Hearing: any sound they can hear is completely replaced by ads from streaming platforms.\n- Voice: anything they say is completely replaced with company slogans and or popular phrases from random ads.\nGain or grant +1D when you or an ally act to take advantage of this power. It may also easily affect the parameters of rolls like difficulty or risk." },
				{ id: "record", name: "Record",
					tags: { duration: "Instant", effect: "Transmute", range: "Self" }, burst: "none",
					text: "Passive: Your eyes can record every single piece of information that you witness as if it were film, permanently engraving inside your mind what you witness.\nActive: During a scene, you may decide to share what you have seen at a specific moment of the hunt, creating a video tape or CD that is ejected from your forehead or any other part of your face.\n- The video portrays only your point of view of the scene and ends abruptly after a CAT amount ({cat}) of minutes.\n- You may suffer 1 stress in order to lightly edit the video, zooming in, slowing it down, pausing, etc.\n- To reproduce the video you need a media player of the type of tape / cd you produced. You may optionally insert the tape or cd into someone's face, to make only them see the video.\nAllies may redo any failed test involving perceiving things you did during said scene." },
				{ id: "calculus", name: "Calculus",
					tags: { duration: "1 scene", effect: "Charm", range: "Self" }, burst: "required",
					text: "You greatly alter your brain's processing of information, turning everything you witness into data strings, and turning complex calculations into instinctual processes for a brief period of time, instantly knowing the direction of the vectors on every single moving object currently or that enters movement, and being able to calculate absolutely anything involving this data you were given with one hundred percent accuracy.\n- You are able to measure the exact velocity, angle and position an incoming attack is coming from.\n- You are able to quickly calculate the needed force to alter object trajectories.\n- You perceive information and are able to process it at CAT speed ({cat:speed}). You may suffer 1 stress to be able to instantly physically react to it.\nThis may easily affect the parameters of rolls such as difficulty and risk." },
				{ id: "spyware", name: "Spyware",
					tags: { duration: "1 scene", range: "CAT range ({cat:range})" }, burst: "required",
					text: "You can, by making physical contact with a technological object, submerge your consciousness into it and explore other objects connected to it, be it through WiFi, physical wiring or Bluetooth. Your body is left senseless if you do so, and suffering stress from outside the use of Spyware brings you out of the connection.\nYou may jump consciousness from an object you're inside of to another object in that connection indefinitely inside a CAT range ({cat:range}). When inside a technological object, you perceive any information it is currently outputting, but are otherwise unable to operate it.\nYou may opt to suffer 1 stress to control the object you are currently inside of.\nThis may easily affect the parameters of rolls such as difficulty and risk." },
				{ id: "firewall", name: "Firewall",
					tags: { duration: "1 scene, once per rest", effect: "Summon", range: "Short" }, burst: "required",
					text: "Once per rest, you set up a powerful blockade of precisely calculated attacks to protect one of your allies. You create a globe of 1/2 CAT range ({halfcat:range}) centered on yourself, protecting a CAT number ({cat}) of individuals. If one of the selected beings suffers stress, you may choose to roll PSYCHE and answer the following questions:\n- Do you consider yourself a tool to the people around you?\n- Have you left no one behind?\nFor every \"Yes\" answer, suffer 1 stress and add +1d to your PSYCHE roll. You overwhelm the being who would inflict said stress with a barrage of cybernetic attacks and electricity, inflicting half the rolled slashes to them and reducing the inflicted stress on your ally by the other half. The Firewall is deactivated after doing so." }
			]
		},
		{
			id: "carnage",
			image: "img/ishmael/blas-carnage.jpg",
			numeral: "",
			source: "ishmael",
			group: "Impulsivity",
			theme: { color: "#a326ff", color2: "#5c0f9e", dark: true },
			name: "Carnage",
			summary: "Bark and snarl at the sirens song.",
			flavor: "Bark and snarl at the sirens song.\nFact: TEMERITY is currently studying hate as an alternate fuel source for oil.",
			passive: {
				id: "bloodlust", name: "Bloodlust",
				text: "After performing an aggressive action, gain the Berserk hook. You clear all berserk hooks if you rest.\nAny Carnage blasphemy power that mentions Service weapons can be used with natural body implements, bonded items, and in general any conceivable implement for violence.\nYou gain the berserk affliction after suffering three berserk hooks."
			},
			powers: [
				{ id: "engulf", name: "Engulf",
					tags: { duration: "Instant", range: "Short" }, burst: "required",
					text: "Your hateful stare is able to turn anything to ash, igniting it into a blaze of burning fury. Choose a single object you can perceive and that is currently in the same scene as you to ignite. The object cannot be larger than 1/2 CAT size ({halfcat:size}), although you can attempt to burn a higher CAT object.\n- An object below the CAT restriction is engulfed instantly and is completely destroyed, leaving nothing behind.\n- An object over the CAT restriction, up to the admin's discretion, is either unfazed or slowly starts to fade out, being completely destroyed at the end of the scene." },
				{ id: "bloody-mess", name: "Bloody Mess",
					tags: { duration: "Instant", effect: "Charm", range: "Self" }, burst: "none",
					text: "The violent pulse of hatred pumping in your veins coalesces in a single, brutal moment of relief: when you finish the execution talisman of a mundane human or trace, you may describe how you eviscerate that body in gorey detail.\nThis triggers the Fight or flight instinct of every single human, exorcist or sin present, seeing you as an immediate threat to their life. The next time you perform an attack with your service weapon against a being that is afraid of you, you deal 1 additional slash." },
				{ id: "eviscerate", name: "Eviscerate",
					tags: { duration: "Instant, once per rest", range: "1/2 CAT area ({halfcat:area})" }, burst: "required",
					text: "Your hate is so powerful that it razes the planes you walk. When attacking with a service weapon, you may spend a psyche burst to perform a powerful mundane strike. Answer the following questions.\n- Are there more threats around you than there are allies?\n- Are you currently going Berserk?\n- Do you admit that you are nothing more than a monster?\nThen, for every \"yes\" answer, gain +1D bonus die (max. 3). For every \"yes\" answer you give, inflict 1 stress to all allies in a 1/2 CAT area ({halfcat:area}).\nYou also cause a CAT magnitude ({cat:magnitude}) shockwave of destruction, cracking the floor and breaking any object in a 1/2 CAT area ({halfcat:area}), which is engulfed by your fiery rage and left in pieces.\nThis may easily affect the parameters of future rolls such as difficulty and Risk." },
				{ id: "devour", name: "Devour",
					tags: { duration: "Instant, once per rest", effect: "Curse" }, burst: "required",
					text: "Your words are dripping with venomous hate that intimidates any living being into obeying. You may roll Psyche to attempt to psychically impose your consciousness into another's, forcing them to perform a simple task you demand of them, such as \"leave this room\" or \"drop your gun\".\n- The devoured target acts with hostility towards you for the scene after performing your wish.\n- You cannot command someone to perform an act that would put them in harm's way.\n- Attempting to devour Psychically sensitive entities is always considered to be hard and risky." },
				{ id: "seethe", name: "Seethe",
					tags: { duration: "1 scene", effect: "Summon", range: "Short" }, burst: "required",
					text: "Your hatred spreads like a disease at will to those around you. You may choose to start irradiating that ire, which infects the mind of the psychically weak.\n- In a short range, you create a cloud of purple fiery rage that only psychically sensitive entities may see. It cannot be moved after being placed.\n- In the scene you are currently in, any humans or otherwise psychically sensitive beings present inside that cloud get a sudden and almost uncontrollable urge to hurt another being. Beings that surpass your CAT only feel a slight urge.\n- While in a cloud, the afflicted will always act in bloodlusted rage, leaving any plans behind in favor of killing.\nGain or grant +1D to any roll when you or an ally take advantage of this power." }
			],
			extras: [
				{ title: "Berserk (affliction)",
					text: "Add to your agenda until the end of the hunt: LET YOUR ANGER FLOW LIKE A RIVER.\nYou lose control of your own thoughts and actions. While berserk, you inflict an additional slash when slashing a sentient being's execution talisman using your service weapon. While berserk, you cannot perform teamwork, do the protect action or set up allies, and must always seek a violent solution.\nYour thirst for blood does not end at the end of the conflict scene. An ally must help you (either through violence or dialogue) to free yourself from the Berserk affliction." }
			]
		},
		{
			id: "leech",
			image: "img/ishmael/blas-leech.jpg",
			numeral: "",
			source: "ishmael",
			group: "Impulsivity",
			theme: { color: "#a326ff", color2: "#5c0f9e", dark: true },
			name: "Leech",
			summary: "The one talisman you need is that which consumes all.",
			flavor: "The one talisman you need is that which consumes all.\nFact: Leech was used by UNDER // HEAVEN to leech off of the relic of control of the Administrator.",
			passive: {
				id: "chameleon", name: "Chameleon",
				text: "At the start of the hunt, create your mimic Talisman. The mimic talisman can be slashed up to a CAT number ({cat}) of times. You may spend a psyche burst to slash it once, using any blasphemy ability you have seen in this hunt.",
				talisman: "{cat}"
			},
			powers: [
				{ id: "unseen", name: "Unseen",
					tags: { duration: "1 scene", effect: "Charm", range: "Self" }, burst: "required",
					text: "You coat yourself in psychic energy that lets you blend in with the scenery of any location, like a chameleon changing colors. When hiding from mundane humans, they are never able to detect you if you are still. Fooling psychically sensitive beings or humans while moving, however, may require rolling PSYCHE or covert, whichever is higher.\nGain +1D when you take advantage of this power. This may easily affect the parameters of rolls such as difficulty or risk." },
				{ id: "mold", name: "Mold",
					tags: { duration: "1 scene", effect: "Transmute", range: "Self" }, burst: "required",
					text: "You are able to reshape your own face like clay into the visage of any person or entity you have ever seen, being able to recreate the body, face and sound of any human or exorcist you have seen in this hunt.\nGain or grant +1D when you or an ally take advantage of this power." },
				{ id: "starve", name: "Starve",
					tags: { duration: "Once per rest", effect: "Curse", range: "Short" }, burst: "required",
					text: "You starve mundane humans or psychic beings of the fuel of grace: emotion. Turning them completely numb in the process.\nSelect up to a CAT number ({cat}) of beings to attempt to starve and roll PSYCHE. In success, they become completely numb and rational, losing all emotion they had. They recover emotion at the end of the scene.\nThis may easily affect the parameters of rolls such as difficulty or risk." },
				{ id: "pickpocket", name: "Pickpocket",
					tags: { duration: "Once per rest", effect: "Curse", range: "Touch" }, burst: "multiple",
					text: "You rob a single object, organ or generally any tangible thing from a human or psychic being (roll PSYCHE and only spend bursts in success) you are able to touch with your bare hand.\n- When doing so, your hand glows with a bright purple aura. Any being that is able to see your hand is fearful of it and attempts to avoid being touched.\n- You may spend additional psyche bursts to steal additional things from your target.\nAfter stealing an object, if it would be essential for someone to live, it continues working as if it was inside them, it cannot be destroyed by any mundane means and psychic attacks towards it are considered Hard. At the end of the scene, the things you stole come back to their owner in their current state." },
				{ id: "mirage", name: "Mirage",
					tags: { duration: "1 scene", effect: "Curse", range: "CAT range ({cat:range})" }, burst: "onSuccess",
					text: "Roll PSYCHE and only spend a burst in a success. In failure, your target knows you attempted to do something, just not necessarily what. You immerse a CAT amount ({cat}) of people inside a shared Hallucination you created and are able to view alongside your perceived reality.\nAny time someone questions this hallucination (i.e. thinking this might be a dream, not buying into what is happening), roll psyche again.\nAnyone affected by a hallucination falls insensate on the floor, while imagining the scenario you chose for them.\nThis may easily affect the parameters of rolls such as difficulty or risk." }
			]
		},
	];

	var virtues = [
		{
			id: "patience",
			name: "Patience",
			epithet: "The Cynic",
			source: "ishmael",
			image: "img/ishmael/virtue-patience.jpg",
			theme: { color: "#14d36a", color2: "#0a7a3c", dark: true },
			flavor: "Patience is a recent addition to the virtue roster, only recently found lost in the stream of consciousness, lost over 200 years ago in a fight against a CAT 6 sin who had successfully erased them from reality. While searching for conscious life within the layer of the sea we have access to, SEER found an exorcist wandering about, and retrieved them into a CAIN blacksite. After an interview, they were almost instantly added to the virtue program, due to the blasphemy they presented control over. Patience seems completely apathetic towards CAIN's objectives as an organization, seeing it as a tool to achieve their goal: enjoying every facet of life that they were denied of for so long.\nThe first exorcist to manifest the Leech blasphemy, Patience was lost for centuries during the first hunt for the Spindle and found by COLOSSUS after the issuing of the Ishmael Protocol: the mage lost in the sea. Their high blasphemy, a powerful mutation of the Leech blasphemy, allows them to have access to any single psychic power they have ever witnessed at least once.",
			likes: ["Jazz music", "Punk rock", "Walking around on rainy days", "Feeling the sun on my skin", "Postmodernism", "Classic literature", "Starting long scoped projects", "Doom Scrolling", "Charity", "Contradictory statements"],
			dislikes: ["Boredom", "The sea"],
			food: "\"The usual.\" (It is completely unknown what \"the usual\" is.)",
			strictureCost: "Ignore for one roll by taking 1d3 nonlethal stress.",
			stricture: "Never lose your cool, keep it level headed. Roll 0d when taking something seriously.",
			bonds: [
				{ rank: 0, text: "Once a scene, you may replace any skill you have 0 points in with PSYCHE. If you do so, suffer 1 sin, and if the action wasn't risky before, it is now." },
				{ rank: 1, text: "Gain the Tome blasphemy. You can create an engraving for it once a mission." },
				{ rank: 2, text: "You can create two engravings for your tome per mission." },
				{ rank: 3, text: "When you enter sin overflow, you are able to use any engraving on your tome once more, regardless if they have been chosen for this hunt or have been already used once." }
			],
			powers: [
				{ id: "tome", name: "Tome", rank: 1, burst: "none",
					tags: { duration: "Instant", effect: "Summon" },
					text: "Without spending a psyche burst, you summon your Tome, a psychic artifact full of incomprehensible and otherworldly markings upon it, that draws in psychic energy like a sponge.\nYour tome can gain Engravings. Engravings are the psychic mark a blasphemy ability leaves within reality, that normally fades away in seconds, but can be permanently marked within your Tome.\n- Engravings allow you to use that same blasphemy ability as a \"once per hunt\" tag ability. You do not spend psyche bursts when using an engraving.\n- You can only take a CAT amount ({cat}) of engravings to a hunt. They do not count to your blasphemy ability limit.\n- When gaining this High blasphemy, you gain an engraving of your choice of a blasphemy ability you, nor any other exorcist in your group, has.\n- You may attempt to engrave a High blasphemy. If you do so, roll PSYCHE. In failure, the excess psychic energy explodes on your hands, inflicting 2d3 sin. High blasphemies consume 3 engraving slots.\nEngravings are permanent, and you do not have a limit as to how many engravings you can have in total. Once per mission, after witnessing the usage of a psychic power, spend all your remaining psyche bursts (min 1). You gain an engraving of that same ability." }
			]
		},
	];

	var kit = [
		// Set 1: The Usual Slop
		{ id: "qlippith", name: "Qlippith", category: "The Usual Slop", source: "ishmael", scrip: 1, kp: 2, tags: ["Consumable"], stock: 99,
			image: "img/ishmael/kit-qlippith.png",
			text: "Indistinguishable from a normal Qlippoth. Laced fruit of the Ymir tree. Crush to suffer 1d3 sin and have a reeeeeally bad trip. ADMIN, DO NOT SHOW THIS ITEM DESCRIPTION TO YOUR PLAYERS. IF ASKED WHY, JUST SAY ITS A QLIPPITH AND THEY KNOW WHAT IT DOES.",
			quote: "Just a normal Qlippoth! I sell at better prices than CAIN, so buy from me!" },
		{ id: "joyful-coin", name: "Joyful Coin", category: "The Usual Slop", source: "ishmael", scrip: 2, kp: 1, tags: ["Consumable"], stock: 4,
			image: "img/ishmael/kit-joyful-coin.png",
			text: "Once per rest, you may, instead of performing a roll or rolling for risk, flip a Coin and call it: Heads or Tails. If you are right, it is as if you rolled a 6, and if you are wrong, it's as if you rolled a 1. This may trigger a severe attack. You may spend two coins instead to flip two, and only need to call one right.",
			quote: "Faith loves these coins because they let her pull the gacha twice in a single pull. Also makes the chance of pulling an UR Pretty XO better. My favorite is The Lord that Smiles!" },
		{ id: "entropic-muzzle", name: "Entropic Muzzle", category: "The Usual Slop", source: "ishmael", scrip: 6, kp: 2, tags: ["Conspicuous"], stock: 2,
			image: "img/ishmael/kit-entropic-muzzle.png",
			text: "Create the entropic talisman, which has two segments that may be slashed. The entropic Muzzle is able to consume sin and psychic energy, draining the power of psychics. Every time you open the muzzle to consume grace, slash the entropic talisman once.",
			quote: "The Jaw of a drifter that used to eat large quantities of grace just by keeping its mouth open! I made some modifications, so, when the jaw is closed, it looks like a muzzle!" },
		{ id: "crystalized-eyeglasses", name: "Crystalized Eyeglasses", category: "The Usual Slop", source: "ishmael", scrip: 4, kp: 0, tags: ["Conspicuous", "Extreme"], stock: 5,
			image: "img/ishmael/kit-crystalized-eyeglasses.png",
			text: "The eyeglasses help psychics and even mundane humans perceive the paranormal better, being able to see the latent grace in the air clearly, and allowing mundane humans to see psychic phenomena.",
			quote: "These eyeglasses were developed by TEMERITY in order for the researchers to better analyze sins without needing a sin seed, so, naturally, I immediately stole them when they were created to have a monopoly!" },
	
		// Set 2: CAIN's Secret
		{ id: "ad-dajjals-phone-number", name: "Ad Dajjal's Phone Number", category: "CAIN's Secret", source: "ishmael", scrip: 0, kp: null, tags: ["Consumable"], stock: 1,
			image: "img/ishmael/kit-ad-dajjals-phone-number.png",
			credit: "The Harpocrates Dossier by Sveltesnorlax",
			text: "Attempting to call this strange cellphone number results in: (1) the phone exploding on your face, start the next hunt with 3 stress. (2-3) your phone permanently bricking. (4-5) No one picking up. (6) voicemail.",
			quote: "I dare you to call this number on your own phone! I will pay you one scrip if you do. Simple enough, right?" },
		{ id: "diary-of-god", name: "Diary of God", category: "CAIN's Secret", source: "ishmael", scrip: 8, kp: 2, tags: ["Conspicuous", "Consumable", "Focus"], stock: 2,
			image: "img/ishmael/kit-diary-of-god.png",
			credit: "Glory Unto Them by Rowan Amon",
			text: "When used, the wielder of the diary is brought into a state of transcendence, understanding perfectly the psychic sea, and forgetting it all immediately after. Roll resistance against sin overflow, suffering instant death that cannot be ignored if you fail. In a success, fill the following phrase. It becomes an objective truth of reality until the end of the hunt. \"[OBJECT/PERSON] NOW IS [THING, CHARACTERISTIC OR ADJECTIVE].\"",
			quote: "Cornerstone of most of the research done on the nature of sins, this book right here was written by one Doctor Caligari! Wouldn't blame you for not knowing the name!" },
		{ id: "ro-severed-head", name: "RO Severed Head", category: "CAIN's Secret", source: "ishmael", scrip: 5, kp: 2, tags: ["Conspicuous", "Consumable"], stock: 4,
			image: "img/ishmael/kit-ro-severed-head.png",
			credit: "Glory Unto Them by Rowan Amon",
			text: "The RO head when consumed, mutters a weak LAW statement that you must define with PATIENCE beforehand when buying the head. You must pick words from the terms of law. The Court has a 1/2 CAT range ({halfcat:range}) and remains affecting the scene for a CAT amount of seconds.",
			quote: "This is the head of Remote operator 1! Don't ask how I got it! The fun part about this one is that part of the High blasphemy imbued to RO1 is still in this severed head, it also scared Justice shitless once!" },
		{ id: "griefworms-guitar-pick", name: "Griefworm's Guitar Pick", category: "CAIN's Secret", source: "ishmael", scrip: 5, kp: 1, tags: [], stock: 6,
			image: "img/ishmael/kit-griefworms-guitar-pick.png",
			credit: "Glory Unto Them by Rowan Amon",
			text: "Once per hunt, you may strike your service weapon with a sudden powerful slash with the guitar pick, producing a deafening sound that makes mundane humans and exorcists alike go into a frenzy. For this scene, activate the hound domain \"Rile against heaven\". Returning the guitar pick grants you one loyalty to griefworm. This may only be done once.",
			quote: "Stolen from a certain Black coat during their Tour! They had to shred their fingertips that night!! They didn't like the prank!" },
		{ id: "guillotines-loose-tooth", name: "Guillotine's Loose Tooth", category: "CAIN's Secret", source: "ishmael", scrip: 4, kp: 2, tags: ["Conspicuous", "Focus"], stock: 2,
			image: "img/ishmael/kit-guillotines-loose-tooth.png",
			credit: "The Harpocrates Dossier by Sveltesnorlax",
			text: "Mindless psychic entities such as traces or minor sins are terrified of Guillotine. You may threaten to attack them with the teeth during one of your actions in conflict, to make them terrified and attempt to run away. If the tooth suffers any kind of stress, it breaks down into pieces.",
			quote: "During the first few years of its development, the bound HOUND Guillotine would lose some teeth anytime they bit a sin. Tooth that look like saws!" },
		{ id: "ice-familiar", name: "Ice Familiar", category: "CAIN's Secret", source: "ishmael", scrip: 2, kp: 1, tags: ["Consumable"], stock: 2,
			image: "img/ishmael/kit-ice-familiar.png",
			credit: "The Harpocrates Dossier by Sveltesnorlax",
			text: "You summon an ice familiar, a creature made of snow and ice completely immune to melting due to non psychic heat. The ice Familiar is reassuring and helps boost morale. The first time you or another exorcist would suffer sin, reduce it by 1.",
			quote: "Ice familiars! summon three at the cost of a psychic burst of power! They reproduce when you get hurt! Isn't this what you wanted?" },
		{ id: "jades-mask", name: "Jade's Mask", category: "CAIN's Secret", source: "ishmael", scrip: 6, kp: 1, tags: ["Conspicuous"], stock: 1,
			image: "img/ishmael/kit-jades-mask.png",
			credit: "The Icarus Doctrine by MyconidSovereign",
			text: "Once a hunt, Jade's mask, when worn, turns the wearer into an emotionless husk of omnicidal intent. Enter a state of sin overflow, where, if you do not fall on death's door or have the mask ripped off your face at the end of conflict, you become a threat against your own group, using the inter-character conflict rules until your mask is ripped off.",
			quote: "During the Fourth Psychic war, Under Heaven was completely eradicated, and as a prize, we stole each of the leader's masks and split them between ourselves! I ended up with Jade's. I'm still pissed at that!" },
	
		// Set 3: Executioner's Collection
		{ id: "pockets-leash", name: "Pocket's Leash", category: "Executioner's Collection", source: "ishmael", scrip: 4, kp: 2, tags: ["Conspicuous", "Short"], stock: 3,
			image: "img/ishmael/kit-pockets-leash.png",
			text: "Once per hunt, you are able to summon a powerful TOAD sin called Pockets. If you do so, target an object of up to CAT 3 size. Pockets consumes the object, which is added to its treasury. Pockets then leaves the scene.",
			quote: "Pockets is a toad sin that was spared by a group of CAT ones! I really like the guy! He's not a bound sin technically, but I have an engraving that summons him! Pet 'em anytime you have the Chance, and I take a scrip off of the leash!" },
		{ id: "blue-ogres-leash", name: "Blue Ogre's Leash", category: "Executioner's Collection", source: "ishmael", scrip: 4, kp: 2, tags: ["Conspicuous", "Short"], stock: 2,
			image: "img/ishmael/kit-blue-ogres-leash.png",
			text: "Once per hunt, you are able to summon a powerful OGRE sin called Blue Ogre. The Blue ogre is a CAT 2 sized ogre that starts wandering inside the area you are in. Any humans or binders that are in that same scene get trapped inside their hostile door patterns. At the end of the scene, the Blue Ogre dissipates in a cloud of miasma.",
			quote: "The Blue ogre is a really standup guy once you get to know 'em, just... and not get into arguments with them! They don't have a cool trauma response!" },
		{ id: "dullahans-memorial-leash", name: "Dullahan's Memorial Leash", category: "Executioner's Collection", source: "ishmael", scrip: 6, kp: 2, tags: ["Consumable", "Conspicuous", "Short"], stock: 2,
			image: "img/ishmael/kit-dullahans-memorial-leash.png",
			text: "Once per hunt, you may strain the red Leash of Dullahan to briefly summon a single leg of the hound, which viciously stomps at a single target you can see. The Leg has a CAT 5 size, and performs a paranormal attack using 3D. After performing this single stomp, Dullahan immediately dissipates.",
			quote: "Dullahan was quickly executed after manifesting, but that doesn't prevent me from leashing them beyond the grave! Of course, they are weak due to the whole death thing!!! but it's still fucking Dullahan!" },
		{ id: "justices-sweaty-gym-clothes", name: "Justice's Sweaty Gym Clothes", category: "Executioner's Collection", source: "ishmael", scrip: 1, kp: 1, tags: ["Consumable", "Conspicuous"], stock: 5,
			image: "img/ishmael/kit-justices-sweaty-gym-clothes.png",
			text: "Once per hunt, during a rest scene, if you have a justice bond, you may consume the Sweaty shirt to gain +1D to your rest. This item raises in price by 1 for every Rox Adam loyalty token you have.",
			quote: "... Why would you want this?" },
		{ id: "charitys-hormones", name: "Charity's Hormones", category: "Executioner's Collection", source: "ishmael", scrip: 3, kp: 1, tags: ["Consumable"], stock: 8,
			image: "img/ishmael/kit-charitys-hormones.png",
			text: "Take one of these to permanently change your biological gender. You may take another one of these to recover your old one, or further transition into your gender subclass, or multiclass your gender. Patience gives a 2 scrip discount on the hormones to exorcists with gender dysphoria.",
			quote: "Took about three of these when I found them, now I am GENDER INFINITUS. I am every single gender that has ever existed." },
		{ id: "fortitudes-armband", name: "Fortitude's Armband", category: "Executioner's Collection", source: "ishmael", scrip: 6, kp: 2, tags: [], stock: 3,
			image: "img/ishmael/kit-fortitudes-armband.png",
			text: "Once per rest, when performing a physical action (such as feats of strength or dexterity), you may take 2d3+1 stress to increase your mundane physical capabilities to CAT and make fighting a supernatural enemy with mundane means not hard.",
			quote: "I would usually take 4 for this one but this is a special occasion, because fortitude once came to this shop and tried to take it by force from me. I gave them a copy, and they tried crushing my skull with their bare hands." },
	
		// Auction House: one item per visit, rolled on 1d6; price set by bidding.
		{ id: "miasma-covered-locket", name: "Miasma Covered Locket", category: "Auction House", source: "ishmael", scrip: null, kp: 1, tags: ["Focus"], auction: 1,
			image: "img/ishmael/kit-miasma-covered-locket.png",
			text: "Auction only (1 on the d6): the price is whatever you win the bid at. Once per rest, The Locket may be spent in a scene in order to paralyze time for all those within a CAT 1 range. Anyone inside said range is able to act in the stopped time, which goes back to running after a full minute passes. The time passing is something that is extremely visible to the one spending the locket." },
		{ id: "marriage-certificate-and-rings", name: "Marriage Certificate and Rings", category: "Auction House", source: "ishmael", scrip: null, kp: null, tags: ["Conspicuous"], auction: 2,
			image: "img/ishmael/kit-marriage-certificate-and-rings.png",
			text: "Auction only (2 on the d6): the price is whatever you win the bid at. There are two rings, and one marriage certificate. You become legally married to another exorcist. When one of the engaged exorcists takes sin, if the other is able to take sin, they may instead take it in their stead." },
		{ id: "claws-of-the-crimson-grudge", name: "Claws of the Crimson Grudge", category: "Auction House", source: "ishmael", scrip: null, kp: 2, tags: ["Conspicuous"], auction: 3,
			image: "img/ishmael/kit-claws-of-the-crimson-grudge.png",
			text: "Auction only (3 on the d6): the price is whatever you win the bid at. The Hound Claws may be used as a CAT 2 Service weapon that may be upgraded. The Hound claws allow the wielder to crawl on walls and ceilings as long as they are on all fours, wielding the claws." },
		{ id: "flask-of-coalescent-sewage-venom", name: "Flask of Coalescent Sewage Venom", category: "Auction House", source: "ishmael", scrip: null, kp: 1, tags: ["Conspicuous", "Consumable"], auction: 4,
			image: "img/ishmael/kit-flask-of-coalescent-sewage-venom.png",
			text: "Auction only (4 on the d6): the price is whatever you win the bid at. The flask may be spent on a service weapon in order to turn its strikes venomous. This guarantees death to mundane humans at the end of scenes, and guarantees a single slash to psychically sensitive beings when rolling a 6 in risk." },
		{ id: "piercings-of-the-midan-curse", name: "Piercings of the Midan Curse", category: "Auction House", source: "ishmael", scrip: null, kp: 0, tags: ["Conspicuous"], auction: 5,
			image: "img/ishmael/kit-piercings-of-the-midan-curse.png",
			text: "Auction only (5 on the d6): the price is whatever you win the bid at. The piercings must be surgically implanted in order to function, wherever the wielder wishes. The wielder may, once a scene, turn anything they touch, or themselves, into a solid gold statue temporarily. At the end of the scene, the statue turns back to normal." },
		{ id: "glorious-crown-of-gold", name: "Glorious Crown of Gold", category: "Auction House", source: "ishmael", scrip: null, kp: 1, tags: ["Conspicuous", "Short"], auction: 6,
			image: "img/ishmael/kit-glorious-crown-of-gold.png",
			text: "Auction only (6 on the d6): the price is whatever you win the bid at. Once per hunt, When worn, the crown makes any mundane humans assume you are a VIP in any areas you go to. This may affect the citizens of a LORD's Kingdom. At the end of the scene, take 1d3+2 sin." },
	];

	var kitSections =
	[
		{ "name": "Patience's Collection of Stolen Paranormal Goods", "text": "PATIENCE sells whatever they find in hunts as special luxurious items for exorcists they find interesting through The Collection of stolen paranormal goods. If your group has a Sorcerer, Moth, Beast, Newborn or Macabre exorcist, your group is able to access the collection. Additionally, if an exorcist has two sin marks, Patience welcomes them in.\nAll items are limited, and at the end of a hunt, during downtime, the admin rolls 1d6 for each set to determine what items have been replenished in PATIENCE's Shop. If an item is at their last copy, their price rises by 2 scrip.\nAll items in the store are wacky and wild in nature, and vastly differ from usual items sold by CAIN.\nFact: Patience is capable of duplicating any item in their possession with a secret Tome edit instance. They have a secret stash with at least one of every single item they sell, usually the original." },
		{ "name": "Selling Relics", "text": "During your hunts, you may retrieve a paranormal artifact that you may want to sell to PATIENCE. If you do so, start bargaining in character with the virtue, who will try their damndest to rip you off." },
		{ "name": "The Usual Slop", "text": "Set 1. For the \"Usual slop\" set, instead roll 1d3 to define what gets replenished. The Qlippith is always at 99 stock." },
		{ "name": "CAIN's Secret", "text": "Set 2. Ad Dajjal's Phone Number is not considered when restocking. It can never raise in price. Items in this set reference other homebrew books: items 0, 4 and 5 (Ad Dajjal's Phone Number, Guillotine's Loose Tooth, Ice Familiar) The Harpocrates Dossier by Sveltesnorlax; items 1, 2 and 3 (Diary of God, RO Severed Head, Griefworm's Guitar Pick) Glory Unto Them by Rowan Amon; item 6 (Jade's Mask) The Icarus Doctrine by MyconidSovereign." },
		{ "name": "Executioner's Collection", "text": "Set 3. Relics of sins executed (or spared) by CAIN, and of the virtues themselves." },
		{ "name": "Auction House", "text": "Auction only items take a very special role in Patience's Shop. Every time an exorcist accesses the Collection of Stolen Paranormal Goods, roll 1d6. The result of the d6 defines the item in auction.\nDuring auction, up to three other non player characters from other groups may appear to attempt and buy the item for themselves. An example of other auction competitors: Minerva, CAT 5 Black coat, interested in scythes and Hound goods. Maximum spending capacity of 12 scrip; will always start at 3." },
		{ "name": "Ritual Additions", "text": "Marked WIP in the book (\"Coming in 2.0\"); only partly readable. When using a blasphemy ability, you may instead draw it on the ground as a Ritual, and add one of a multitude of different effects to it. Ritual Circles may be profaned, destroying its power and ending its effect. Doing so is easily done by forceful actions without spending a reaction. An exorcist whose Circle is profaned takes 2 sin. Ritual circles must be drawn and shown to the admin.\nTags: Signal (sent under specific circumstances; makes the ritual activate, or sent to other circles through external rituals). Focus (requires concentration to be kept; when you suffer an injury, the ritual is profaned; you may keep a PSYCHE amount of Focus rituals active at the same time). Instant (instant activation).\nRitual learning: at the end of the hunt, if you have performed a ritual with new additions you haven't used before, you gain access to the next level of the Ritual technique.\nRitual Borders (draw the sigil of your chosen blasphemy ability on the center): Obliterate (Instant: if the ritual circle is profaned, it also profanes anything it has affected; roll PSYCHE for the slashes dealt, and destroy objects that were affected instantly in up to a 1/2 CAT range). Expectancy (Signal, Instant: set a prerequisite for the activation of this ritual circle). Containment (Focus: reduce the area of effect to a range of your choice that may be as precise as you wish, creating a psychic barrier at the border that contains your chosen psychic power).\nRitual edges: Hide (Focus: your ritual circle is invisible to mundane humans and psychic creatures of up to the CAT of your circle; after it is used, the circle is revealed). Select (Signal: an amount of circles across the circle that affect specifically the people or objects standing atop them; each circle sends a signal when activated).\nInner Ritual (place on the center of the ritual, without damaging the sigil): Rupture (surpass the restrictions another psychic may have placed, rupturing through psychic or physical surfaces like they don't exist; this may ignore a tension barrier, a psychic shield or even a penumbra). Segmentate (draw a slash across the ritual; cuts the ritual circle in two segments that cannot communicate with each other, but may give or receive signals on their own; additions that are cut off only activate on their respective segment).\nOuter Ritual (Chain, Wall, and others) is not readable under the WIP banner." }
	]
	;

	function tag(list) { list.forEach(function (x) { x.source = "ishmael"; }); return list; }

	CAIN.agendas = CAIN.agendas.concat(tag(agendas));
	CAIN.blasphemies = CAIN.blasphemies.concat(tag(blasphemies));
	CAIN.virtues = (CAIN.virtues || []).concat(tag(virtues));
	CAIN.kit = CAIN.kit.concat(tag(kit));
	kit.forEach(function (k) { if (CAIN.kitCategories.indexOf(k.category) < 0) CAIN.kitCategories.push(k.category); });
	CAIN.kitSections = (CAIN.kitSections || []).concat(kitSections.map(function (s) { s.source = "ishmael"; return s; }));
})();
