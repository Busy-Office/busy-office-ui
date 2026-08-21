# Proposal: a patterns front door, tiled (owner ask, 2026-08-21)

The ask: *"should patterns be in separate section and arrange the tile like
namethatui.com? pls review and propose."*

## What namethatui.com actually does (fetched and characterized)

Tile cards — each carries a **name**, a **visual preview**, a **one-line
plain-words description** ("The numbered circles across the top of a checkout
or wizard"), and a **platform tag** — under a command-palette search whose
pitch is "describe the thing in your own sloppy words." Two top-level
sections (Web / macOS), filter + sort, ~76 tiles. The essence: you find a
thing you can't name by *recognising* it.

## Current state, measured

- **Patterns already ARE a separate section in the sidebar** — three
  collapsible groups since the 2026-08-16 docs-IA pass: *capture & edit* (8),
  *review & approve* (7), *overview & shell* (5). 20 pattern pages total.
- **But the section has no front door.** There is no `/patterns/` index page;
  the homepage's "Patterns" link deep-links to `/patterns/invoice-list` — an
  arbitrary first item standing in for the section (3 places on index.astro).
  A reader deciding *which screen they need* has to open pages one by one.
- **Every tile's copy already exists, guaranteed by a gate.** The page-shape
  gate requires each pattern page to carry a `demo-note` opener (who uses it /
  what done looks like), a complexity badge (1–4), and a Components-used list;
  6 of 20 now also carry a wrong-choice clause. That is precisely a
  namethatui tile minus the image.
- **The framework already ships the tile.** `/patterns/app-launch` is a
  launchpad of `bo-widget` cards in a `bo-widget-grid` — the exact shape this
  index needs. The patterns index can *be* an instance of the app-launch
  pattern, dogfooding it. Zero new CSS (Objective §2).

## Proposal

**Yes to the tile index; the "separate section" half is already true and
needs only a front door.** Concretely:

1. **`/patterns/` index page** — tiles in a `bo-widget-grid`, grouped under
   the three existing workflow headings (so sidebar and index tell one
   story). Each tile: pattern name, the opener's who-uses-it line, complexity
   badge, count-plus-badges of components used. **Generated, not
   hand-written**: tile copy is extracted at build time from the pattern
   pages themselves, and a gate asserts the index lists exactly the pattern
   pages that exist — a new pattern cannot be forgotten and stale copy cannot
   drift (red-provable both directions, same shape as check-components-used).
2. **Point the homepage's three "Patterns" links at the index** instead of at
   invoice-list.
3. **No new search.** The ⌘K palette (pagefind) already answers "describe the
   thing"; tiles are for recognition-browsing, search is for naming — the two
   namethatui jobs, both covered.
4. **Keep one sidebar.** A namethatui-style separate top-level nav
   (Elements | Styles) is IA surgery the 20-item count doesn't justify; the
   labeled groups + a front door give the separation at a fraction of the
   cost. Reversible later if patterns outgrow it.

## The honest fork the owner should decide: preview images

namethatui's tiles work because the **image is the content** (you're naming
what you see). Our tiles' job is different — *choosing a screen* — and the
who-uses-it line + complexity does most of that. Options:

- **(a) Text + badges only** — recommended first step. Zero drift risk,
  ships this week, and we learn whether the index gets used.
- **(b) Build-time screenshots** — feasible (the build already drives
  headless Chrome for five gates; `browser-harness.mjs` is the chokepoint),
  but 20 pages × 2 themes of images regenerated per build adds real minutes
  and ~MBs, and a thumbnail of a dense ERP screen at tile size is mostly
  grey noise — the anti-recognition case. Only worth it if (a) proves people
  want to browse visually.
- **(c) Hand-drawn CSS miniatures** — refused: hand-written artefacts
  describing generated surfaces are exactly what the docs doctrine forbids
  (they drift, and nothing gates them).

## Not proposed (and why)

- A separate top-level Patterns nav — cost without evidence (above).
- The same index for components — the mechanism generalizes, but the ask is
  patterns; components' 40 pages have `llms.txt` + the class index as their
  overview today. Queue only if wanted.
