# CAIN Exorcist Registry

A character builder and play sheet for the CAIN tabletop RPG (1.4.5), in the
spirit of D&D Beyond and COMP/CON. Made for one group's campaign.

**Live site:** https://endermage99.github.io/cain-exorcist-builder/

## Using it

No accounts. Characters are kept in your own browser, so back them up and
move them as files or text:

- **On a sheet:** **Export file** downloads that exorcist as a `.cain.json`
  file; **Copy as text** copies it to paste into Discord or a message;
  **Print** prints the sheet on four pages in the official sheet's order
  (or choose "Save as PDF" in the print window).
- **On the Registry:** **Import file**, or drop a file anywhere on the
  page, or **Paste text**. **Export all** saves every exorcist in this
  browser as one dated backup file.
- Importing an exorcist that's already in your browser asks whether to
  replace yours, keep both, or skip.

## Status

All of CAIN 1.4.5's player content: 16 agendas, 12 blasphemies (each in the
colours of its pages in the book), all 5 sin mark locations, and the full kit
expansion (Aesthetics, Comfort / Career, Possessions, Occult / Medical). See [BUILD_PLAN.md](BUILD_PLAN.md) for the
milestones.

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
  Styled after the paper sheet and using its artwork: the CAIN hand
  emblem in the ID photo slot (**Add photo** stores a small portrait with
  the exorcist instead), the halftone brain, brain bursts, the inkblot
  brain, the execution seal, daggers, skull, the sin splats over the
  nerve-system body, and grub, fly and beetle for sin marks, on its
  crumpled plastic texture with typewriter and blackletter type.
- **Action bar** above the sheet, for things a website does better than a
  PDF. **The site never rolls dice**: roll at the table where the Admin can
  see, and enter what you rolled.
  - **+ XP**: the end-of-session questions, or +1 XP.
  - **Spend advance**: only the options the rules allow, replacing one at
    the cap of 5.
  - **Add ability / Add power**: pick from the cards, optionally using up
    an advance. Both have **Create your own**: build a whole agenda (items,
    bold items, abilities) or blasphemy (summary, passive, powers) from
    scratch, tick which parts your exorcist has, give each power the book's
    tags (duration, effect, range) and burst symbol, and drop CAT values
    into the text ("Insert CAT value") that fill in for your CAT. Custom
    ones are saved with the exorcist, export with them, and can be edited
    or deleted from the sheet.
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
js/art.js         sheet illustrations and portrait resizing
img/sheet/        artwork from the official character sheet
js/store.js       saved characters and the registration draft
js/transfer.js    export and import: the .cain.json format and its checks
js/registration.js character creation steps
js/sheet.js       the one-page exorcist sheet and the character screen
js/actions.js     the action bar, its panels, and alerts
js/custom.js      editors for custom agendas and blasphemies
js/app.js         theme, routing, Registry and Doctrine screens
data/*.js         rules content: core, agendas, blasphemies, sin marks, kit
tests/            rules checks page
```

Content entries can carry `modifiers` (`{ stat, add }`) and `flags`, so
derived numbers like kit points or max stress update without special cases.
Text can hold CAT tokens: `{cat}`, `{cat+2}`, `{2+cat}`, `{halfcat}`, and
table lookups like `{cat:area}` or `{halfcat:size}`.

The Ishmael Protocol is a fan supplement by Sib_PHI, included here unofficially;
its art is in `img/ishmael/`. The Harpocrates Dossier is a fan
supplement by SvelteSnorlax (Dillon Nguyen); its art is in `img/harpocrates/`.
CAIN and Games for Freaks are by Tom Bloom / CHASM. This is an unofficial fan tool; the sheet
artwork in `img/sheet/` is from the official CAIN character sheet.
