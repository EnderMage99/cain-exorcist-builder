# CAIN Exorcist Registry

A character builder and play sheet for the CAIN tabletop RPG (1.4.5), in the
spirit of D&D Beyond and COMP/CON. Made for one group's campaign.

**Live site:** https://endermage99.github.io/cain-exorcist-builder/

## Using it

No accounts. Characters are kept in your own browser. Sharing between players
(export files and share links) arrives in milestone M6.

## Status

Test build: two agendas (Guardian, Firebug), two blasphemies (Tension, Gate),
two sin marks (Eyes, Arms or Hands) and two kit items, used to prove every
system before the rest of the book's content goes in. See
[BUILD_PLAN.md](BUILD_PLAN.md) for the milestones.

- **Registry** - the home screen; your exorcists will be listed here.
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
js/rules.js       rules engine (no DOM)
js/app.js         routing and screens
data/*.js         rules content: core, agendas, blasphemies, sin marks, kit
tests/            rules checks page
```

Content entries can carry `modifiers` (`{ stat, add }`) and `flags`, so
derived numbers like kit points or max stress update without special cases.
Text can hold CAT tokens: `{cat}`, `{cat+2}`, `{2+cat}`, `{halfcat}`, and
table lookups like `{cat:area}` or `{halfcat:size}`.

CAIN is by Tom Bloom / CHASM. This is an unofficial fan tool.
