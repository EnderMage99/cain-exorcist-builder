# CAIN Exorcist Registry

A character builder and play sheet for the CAIN tabletop RPG (1.4.5), in the
spirit of D&D Beyond and COMP/CON. Made for one group's campaign.

**Live site:** https://endermage99.github.io/cain-exorcist-builder/

## Using it

No accounts. Characters are kept in your own browser. To move one to another
device or player, use **Export** on its sheet and **Import** on the Registry.
Share links arrive in milestone M6.

## Status

Test build: two agendas (Guardian, Firebug), two blasphemies (Tension, Gate),
two sin marks (Eyes, Arms or Hands) and two kit items, used to prove every
system before the rest of the book's content goes in. See
[BUILD_PLAN.md](BUILD_PLAN.md) for the milestones.

- **Registry** - the home screen: your exorcists, Register exorcist,
  Quick exorcist (a random legal character, straight to review) and Import.
- **Registration** - character creation, step by step: Concept, Skills,
  Agenda, Blasphemy, Kit, Review. Next stays locked until a step is legal,
  and the draft saves itself so you can leave and come back.
- **Exorcist sheet** - laid out like the official sheet, and fully editable:
  text saves as you type, every number has a - / + stepper, and agenda,
  abilities, blasphemies, powers, sin marks and kit can be added or removed
  freely. Rule problems show as warnings, never locks. Tap an underlined
  term for its rule. Duplicate, Export and Delete live at the top.
- **Play** - during a hunt. **The site never rolls dice**: roll at the
  table where the Admin can see, and enter what you rolled. It covers
  starting the hunt (Oilfinger's d3, Jack!), taking stress (roll-over into
  injuries, Painkiller, Iron Soul with your d6, nonlethal, brink of death,
  instant death and defying fate), psyche bursts or the 1d3 sin you rolled,
  the dice pool (tells you how many dice to roll, then records your
  successes and spends the burst or Divine Agony), hooks, afflictions, kit
  points and consumables, resting with your 2d3, and the sin overflow check
  and sin mark with your d6s. Every value can also be set by hand, and those
  changes are logged.
- **Between missions** - end of session (the four XP questions, advances
  when the track fills), spending advances (only legal options, replacing
  one at the cap of 5), closing the mission (pay, halve sin, missions
  survived and CAT, full reset) and the kit shop.
- **Doctrine** - browse all loaded content. Pick a CAT and every CAT-scaled
  value in the text resolves to it (hover a highlighted value to see where
  it came from).
- **Checks** - `tests/rules-test.html` runs the rules engine's checks in the
  browser.

## Working on it

Plain HTML, CSS and JavaScript. No build step and no install: open
`index.html` in a browser, or push to `main` and GitHub Pages serves it.

```
index.html        app shell
css/main.css      styles, light and dark themes
js/rules.js       rules engine: derived stats, validation, dice (no DOM)
js/hunt.js        play and between-mission actions (no DOM)
js/ui.js          DOM helpers, glossary popover
js/store.js       saved characters and the registration draft
js/registration.js character creation steps
js/sheet.js       the exorcist sheet and the character screen's tabs
js/play.js        Play and Between missions views
js/app.js         theme, routing, Registry and Doctrine screens
data/*.js         rules content: core, agendas, blasphemies, sin marks, kit
tests/            rules checks page
```

Content entries can carry `modifiers` (`{ stat, add }`) and `flags`, so
derived numbers like kit points or max stress update without special cases.
Text can hold CAT tokens: `{cat}`, `{cat+2}`, `{2+cat}`, `{halfcat}`, and
table lookups like `{cat:area}` or `{halfcat:size}`.

CAIN is by Tom Bloom / CHASM. This is an unofficial fan tool.
