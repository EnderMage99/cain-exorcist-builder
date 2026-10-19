# CAIN Exorcist Builder - Build Plan

A character builder and play sheet for CAIN (1.4.5, Tom Bloom / CHASM), in the
spirit of D&D Beyond and COMP/CON. Built for one group of friends.

## Ground rules

- **Hosting:** GitHub Pages under `EnderMage99`, same as
  `konrad-underlings-database`. Anyone with the link can use it. No accounts.
- **No backend.** No Supabase, no database. Characters live in the
  browser's `localStorage` and move between people as files or links.
- **No build step.** Plain HTML, CSS and JavaScript. No Node is installed on
  this machine, so nothing needs compiling: push the files and Pages serves
  them. Scripts load as classic `<script>` tags (not ES modules), so
  `index.html` also works when opened by double-click from disk.
- **Mobile first.** People will have it open on their phone at the table.
- **Rules source:** the 1.4.5 rulebook. Where the official sheet disagrees
  with the book, the book wins (see "Rules decisions").
- **Note:** a GitHub Pages site on a free account needs a public repo, so the
  rules text in `data/` is publicly readable. Agreed acceptable for a
  personal group site; add `noindex` so search engines skip it.

## Test content (this plan)

The test build carries just enough content to exercise every system.
Everything else is added after the systems are proven.

| Kind | Included | Why these |
|---|---|---|
| Agendas | **Guardian**, **Firebug** | Guardian's Painkiller changes the stress/injury math; Firebug's Oilfinger rolls extra KP each mission and Jack! raises a skill temporarily |
| Blasphemies | **Tension**, **Gate** | Tension has CAT-scaled text and a durability talisman (Fortress, 2+CAT); Gate's Pocket passive adds +1 KP, testing modifiers from passives |
| Sin marks | **Eyes**, **Arms or Hands** (all 6 abilities each) | Tests rolling location then ability, evolving a mark, and the "+1D to a skill, up to 4D" bonuses |
| Kit shop | **Red Herb** (consumable), **Improved Meal Plan** (+1 max KP), service weapon CAT upgrade | Tests consumables, permanent modifiers and the weapon upgrade |
| Everything else | Full core rules: skills, CAT table, stress, injuries, hooks, afflictions, bursts, sin, pathos, XP, advances, scrip, Blast | These are small and needed by every character |

With only two sin-mark locations loaded, the sin-mark roller picks among the
loaded locations; the full d6 table applies once all six are in.

## File layout

```
cain-exorcist-builder/
  index.html            app shell, loads everything below
  .nojekyll
  css/
    main.css            colour tokens, light/dark, layout
  js/
    rules.js            derived stats, validation, dice helpers (no DOM)
    store.js            localStorage, export/import, share links
    registration.js     character creation steps (Registration)
    sheet.js            edit mode sheet
    play.js             play mode trackers, roller, rest, end of session/mission
    glossary.js         tooltip terms
    app.js              routing between screens
  data/
    core.js             skills, CAT table, kit defaults, glossary terms
    agendas.js          Guardian, Firebug
    blasphemies.js      Tension, Gate (+ Blast)
    sinmarks.js         Eyes, Arms or Hands
    kit.js              shop items
  tests/
    rules-test.html     open in a browser, runs the rules.js checks
  BUILD_PLAN.md
  README.md
```

Data files assign to one global, e.g. `window.CAIN.agendas = [...]`, so they
work without modules.

## Data model

### Content entries

```js
{
	id: "guardian",
	name: "Guardian",
	items: [
		{ text: "Protect your people", bold: false },
		{ text: "Leave nobody behind", bold: true }
	],
	abilities: [
		{
			id: "painkiller",
			name: "Painkiller",
			text: "Your first injury taken does not reduce maximum stress.",
			modifiers: [{ stat: "injuryStressPenaltyIgnored", add: 1 }]
		}
	],
	requires: null  // e.g. { sinMarks: 1 } for Doomed
}
```

Blasphemy powers also carry `tags` (`duration`, `range`, `effect`) and a
`burst` field (`"required"`, `"onSuccess"`, `"multiple"`, `"none"`).

### CAT-aware text

Power text uses tokens that resolve against the character's CAT using the
book's CAT table (people, size, area, range, speed, magnitude):

- `{cat:area}` -> "a few people" at CAT 1, "entire room" at CAT 2
- `{cat+2:size}` -> size for CAT + 2, capped at 7
- `{halfcat}` -> half CAT rounded up
- `{2+cat}` -> plain number, for talisman lengths

The raw CAT wording stays visible on hover, so the book text is never lost.

### Modifiers

Anything that changes a number declares it instead of being special-cased:

| Stat | Base | Example sources |
|---|---|---|
| `maxStress` | 6 | Will to Live +1, Private Room +1 |
| `maxInjuries` | 3 | Visitation Rights +1 |
| `kitPoints` | 5 | Gate Pocket +1, Improved Meal Plan +1 |
| `sinCap` | 10 | Alienation +2, each extra blasphemy -1, each resisted overflow -2 |
| `xpToAdvance` | 4 | each extra blasphemy +1 |
| `psycheBursts` | 3 | campaign setting |
| `restDice` | 2 | Healer, Sanctioned Indulgences |

Firebug's Oilfinger (1d3+1 KP, rolled per mission) is a per-mission roll
stored on the mission, not a static modifier.

### Character

```js
{
	schema: 1,
	id, name, xid, looks: { sex, height, weight, hair, eyes },
	questions: { manifest, seedLocation, hidden, hand, mother },
	skills: { force: 1, conditioning: 1, ... },
	skillImprovements: 0,               // max 6
	agenda: "guardian",                 // current agenda
	agendaAbilities: [{ agenda, ability }],  // refs, so swapped agendas keep theirs
	boldItems: [],                      // bolded items carried from old agendas
	blasphemies: [{ id, powers: [] }],  // first one is the primary
	sinMarks: [{ mark, abilities: [{ roll, skill }] }],
	purchases: [{ item, count }],
	weaponCat: 0,
	missionsSurvived: 0,
	xp: 0, advances: 0, scrip: 0,
	sin: 0, sinBoxesCrossed: 0,
	settings: { psycheBursts, sinCapBonus, clearSinAfterMission },
	hunt: {                             // reset each mission
		stress, injuries, hooks: [{ name, slashes }], afflictions: [],
		bursts, kpSpent, kpBonus, pathos, divineAgonyUsed, jackSkill, notes
	},
	log: []                             // XP gains, purchases, overflow results
}
```

CAT, PSYCHE, max stress, KP, sin cap and XP needed are always computed,
never stored.

## Rules decisions

- **No dice are rolled on the site.** Every roll happens at the table (or a
  dice bot) where the Admin can see and check it. The site works out the
  pool ("roll 4d6, 4+ succeeds") and records what was rolled: successes, the
  d3 for sin, Oilfinger, Red Herb and resting, the d6 for Iron Soul, the
  overflow check and sin marks. The risk die is the Admin's and isn't
  tracked.
- **Full manual control.** Every tracked number has a - / + stepper, and the
  Sheet tab can add or remove abilities, powers, blasphemies, sin marks and
  kit freely. Rule problems show as warnings, never as locks. Changes made
  by hand during play are written to the log as "set by hand".

- **Sin overflow resist:** book version. No sin marks = automatic pass.
  Otherwise roll d6 + sin marks: 6 or less passes, 7+ fails, a natural 1
  always passes. No sin boxes left = automatic fail. (The official sheet and
  the Google Sheet say "7 or lower".)
- **Default sin cap is 10**, from the boxes on the official sheet; the book
  never states the number.
- **XP checklist:** the book's four questions. The Google Sheet's extra
  "two or more bolded items" question is not used.
- **Campaign settings** (from the book's own tuning advice): psyche bursts
  per hunt (3 or 4), sin cap bonus, and "clear all sin after a mission"
  instead of halving. Stored per character for now, since there is no
  shared campaign object without a backend.

## Milestones

Each milestone ends with its test checklist passing and a push to Pages.

### M0 - Skeleton and deploy
- Create the repo `EnderMage99/cain-exorcist-builder` (public), `.nojekyll`,
  `index.html` with the CAIN look (black, off-white paper, the CASTLE stamp
  feel), light and dark themes.
- Enable Pages from `main` / root.
- **Test:** the live URL loads on a phone and a desktop.

### M1 - Rules engine and data
- `data/*.js` with the test content above.
- `rules.js`: CAT from missions survived (0/1/2/4/7), PSYCHE = ceil(CAT/2),
  modifier totals, CAT token resolver, creation validation, advance
  validation, dice helpers (d6, d3, pools).
- `tests/rules-test.html` with assertions.
- **Test:** all checks green, including: 0 missions -> CAT 1, PSYCHE 1;
  4 missions -> CAT 4, PSYCHE 2; Gate + Meal Plan -> 7 KP; Fortress at CAT 3
  -> talisman 5.

### M2 - Registration (character creation)
- Steps: Concept -> Skills -> Agenda -> Blasphemy -> Kit -> Review. Step bar
  at the top, every step revisitable.
- Skills: all at 1, "raise 2 / lower 3" counter, Next disabled until valid.
- Agenda and blasphemy as card galleries with full text; pick 1 ability /
  2 powers.
- XID generator, "give me a prompt" for the five questions.
- "Quick Exorcist" button builds a random legal character.
- Drafts autosave.
- **Test:** build one character of each agenda/blasphemy pairing (4 total)
  by hand and two with Quick Exorcist; every one passes validation.

### M3 - Sheet, edit mode
- Character list (home screen): new, open, duplicate, delete, export.
- Sheet laid out in the official sheet's sections: ID card, skills,
  health, CAT/PSYCHE/burst, kit, sin and marks, agenda, blasphemy, Blast.
- Glossary tooltips on rules terms.
- **Test:** every computed number on the sheet matches a hand calculation
  for the 4 test characters.

### M4 - Play mode
- Tap trackers: stress (overflow -> injury, max shrinks per injury, Brink of
  Death warning, 7+ in one hit = instant death prompt), injuries, hooks
  (name + 3 slashes), afflictions, bursts, KP, pathos.
- Dice roller: pick a skill or PSYCHE, add bonus dice (setup, burst,
  ability, circumstance) capped at +3, Divine Agony on top of the cap,
  0 dice -> 2d6 keep lowest, Hard = only 6s, optional risk die with the
  book's outcome table, talisman mode counts all successes.
- Spending a burst asks "burst or 1d3 sin?" and rolls the d3.
- Rest: roll 2d3 (plus extra rest dice), assign each to bursts, stress or a
  hook.
- **Test:** play a scripted hunt: take 2 stress five times, rest, spend
  bursts down to 0 and take sin, fill a hook. Guardian with Painkiller keeps
  max stress at 6 after the first injury.

### M5 - Between sessions and missions
- End of session: the four XP questions, auto-advance when XP fills,
  clear pathos and Divine Agony.
- Spend advance: only legal options shown (agenda ability, blasphemy power
  or new blasphemy, evolve sin mark, 3 scrip, skill +1 with the 6-total and
  two-at-3 caps).
- End of mission: outcome (execute 5 / spare 3 / fail -1 scrip), recovered
  bodies, halve sin (round up), +1 mission survived with CAT-up notice,
  reset the hunt block, roll Oilfinger KP.
- Kit shop: buy items with scrip, weapon CAT upgrade (3 scrip, max 3).
- Sin overflow: give up or resist, roll the check, roll a sin mark
  (location then ability, duplicate location evolves), cross out 2 boxes.
- **Test:** take a character from creation to CAT 3 through scripted
  sessions; buy Meal Plan and see KP rise; force an overflow and gain a mark.

### M6 - Export and import (done)
- A labelled, versioned `.cain.json` format holding one or more
  characters (`js/transfer.js`). Older bare-character exports still import.
- Sheet: **Export file** and **Copy as text** (for Discord). Registry:
  **Import file**, drop a file anywhere on the page, **Paste text**, and
  **Export all** as one dated backup.
- Imports are checked: broken entries are skipped with a note, missing
  fields are filled in, content not in this build loads with a warning.
- A character already in the browser asks: Replace mine, Keep both, Skip.
- **Tested:** round trips are identical; the click-through exports, copies,
  pastes back, resolves conflicts, drops a file and refuses junk.
- Not built: share links and an Admin party page. Possible later; files
  and pasted text cover moving characters between players for now.

### M7 - Polish
- Print view that follows the official sheet's page order.
- Keyboard and screen reader pass, reduced motion.
- **Test:** print preview of a test character fits on 3 pages.

## After the test build

1. Remaining content: 14 agendas (including Doomed's sin-mark gate and the
   Departed / Survivor special cases), 10 blasphemies (with Whisper's
   Shadow, Bind's Sin, Flux's Temporal Instability table, Smother's
   Absentia table, Sympathy's resonance table), the other 4 sin-mark
   locations, the full kit shop (Aesthetics, Comfort/Career, Possessions,
   Occult/Medical).
2. Optional Admin tools: tension and pressure talismans, a hunt tracker.
