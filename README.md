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
- **Exorcist sheet** - one page laid out like the official editable PDF
  (CAINsheets 1.4), changed directly like the PDF: click a bubble or box to
  fill up to it (click the last filled one to clear it), type into any
  field. Stress, injuries, hooks, skills, improvements, pathos, XP,
  advances, CAT (click a triangle), bursts, kit points and sin all work
  that way. Agenda, abilities, powers, sin marks and kit can be changed or
  removed in place. Rule problems show as warnings, never locks. Clicks on
  tracked numbers are logged so the Admin can follow along.
- **Action bar** above the sheet, for things a website does better than a
  PDF. **The site never rolls dice**: roll at the table where the Admin can
  see, and enter what you rolled.
  - **+ XP**: the end-of-session questions, or +1 XP.
  - **Spend advance**: only the options the rules allow, replacing one at
    the cap of 5.
  - **Add ability / Add power**: pick from the cards, optionally using up
    an advance.
  - **Take stress**: roll-over into injuries, Painkiller, Iron Soul with
    your d6, nonlethal, brink of death, instant death and defying fate.
  - **Dice pool**: how many dice to roll; records your successes, spends
    the burst (or the 1d3 sin you rolled) or Divine Agony.
  - **Rest**: enter your 2d3, then put each on bursts, stress or a hook.
  - **Mission**: close one (pay, halve sin, missions survived, CAT, reset)
    or start a new one (Oilfinger's d3, Jack!).
  - **Kit**: pull out kit and use consumables, add book items for free,
    create your own items (name, description, KP, consumable), and set
    scrip by hand. There is no shop: scrip is just a number you track.
  - **Log**: everything recorded.

  Sin overflow, instant death and new sin marks appear as alerts at the top
  when they happen.
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
js/sheet.js       the one-page exorcist sheet and the character screen
js/actions.js     the action bar, its panels, and alerts
js/app.js         theme, routing, Registry and Doctrine screens
data/*.js         rules content: core, agendas, blasphemies, sin marks, kit
tests/            rules checks page
```

Content entries can carry `modifiers` (`{ stat, add }`) and `flags`, so
derived numbers like kit points or max stress update without special cases.
Text can hold CAT tokens: `{cat}`, `{cat+2}`, `{2+cat}`, `{halfcat}`, and
table lookups like `{cat:area}` or `{halfcat:size}`.

CAIN is by Tom Bloom / CHASM. This is an unofficial fan tool.
