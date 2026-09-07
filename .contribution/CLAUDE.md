# Upstream contribution — instructions for Claude Code

You are integrating a set of design proposals into **Busy-Office/busy-office-ui**.
This folder is already arranged in the repository's layout: every path here maps
to the same path in the repo. Read this file fully before touching anything.

## What this repository is

A CSS-first ERP UI framework: `packages/core/src/css` (44 component sheets,
4 token tiers, an `@layer` cascade) plus 26 optional vanilla-TypeScript
behaviours in `packages/core/src/js/behaviors`. Server-rendered HTML + HTMX.
**No React, no Tailwind, no client framework.** Read `DESIGN.md` and the header
comment of any component sheet before editing it — nearly every value carries
the measurement or review that produced it, and the repo's standard is
"measured, not rounded".

## Step 0 — one branch per proposal, not one big PR

```bash
git checkout -b proposal/brand-mark
```

Do the proposals in this order. Each is independently revertable. Do not
combine them.

1. **Brand mark** — `packages/core/media/brand/`. Pure asset drop; taste call for
   the maintainers, so it goes first and alone. Add a one-line pointer in
   `README.md`. The mark is drawn in the icon set's grammar (24-grid, stroke 2,
   round caps); do not restyle it.
2. **Registry + install prompts** — `registry.json`, `install-prompts.md` at root.
   Verify every `files[].path` in `registry.json` exists after your copy; the
   paths assume `styles.css` = `packages/core/src/css/index.css` — rewrite them
   to the repo's real paths.
3. **Gauntlet bar** — `.roundtable/gauntlet/`. Docs only. Fits the existing
   `.roundtable/` review-record convention.
4. **Static reference consumer** — `examples/static-list-report/`. A no-server
   HTML+HTMX list report against `examples/po-app`'s route contracts. Its
   `behaviors.js` is a plain-JS transcription of three real behaviours; replace
   it with the built package if `examples/` has a build step, otherwise keep and
   say so in its README. Run `apps/docs/scripts/check-po-app.mjs` — nothing here
   should change its result.
5. **Modern CSS layer** — `packages/core/src/css/modern/`. **Do not land these
   as a new folder.** They were written as an appended cascade layer for a
   consuming project; upstream they must become edits to the named files
   (`tokens/scales.css` via `scripts/generate-scales.mjs`, `tokens/color.css`,
   `tokens/border.css`, `tokens/density.css`, `components/dropdown/dropdown.css`,
   `components/combobox/combobox.css`, `components/form/input.css`,
   `components/data-table/data-table.css`, `components/dashboard/dashboard.css`).
   `modern/PR.md` is the seven-PR split with rationale and a verification
   checklist — follow it, one branch per PR. **The OKLCH PR is blocked** until
   you run the ΔE00 round-trip and the contrast grill; the values are published
   equivalents, not measured. Do not merge it on the promise of measuring later.
   `surface.css` (radii 4/6/8 → 6/8/12, tonal separation) is explicitly **not**
   proposed upstream — it changes shipped visuals for every consumer. Leave it in
   the folder for discussion or drop it.
6. **Proposals** — `proposals/`. Not product. `future-erp/` is two exploration
   screens; `ROADMAP.md` is the design position; `DESIGN-md-additions.md` is
   prose distilled from the repo's own docs — merge what DESIGN.md does not
   already say, drop the rest.

## Rules that apply to every step

- Consume the semantic token tier only. Never `--bo-palette-*` in a component,
  never a raw hex outside `@media print`.
- Every state signal needs a word or glyph **and** an ARIA/data attribute.
  Colour alone is a defect.
- Exact values. If a sheet says 5px, write 5px. Do not snap to 4/8.
- Overrides go outside the cascade layers or into the correct layer; never
  `!important`.
- Name every container query.
- Run the repo's gates after each step: `npm test`, and the `apps/docs/scripts/`
  checks the touched area cites.

## What was deliberately left out of this folder

React wrappers (the design tool needed them; the product does not), generated
manifests, screenshots, design-tool templates and skill files. If you find a
reference to `react/` or `_ds_bundle.js` anywhere in here, it is a leftover —
remove the reference, do not port the thing.

## Provenance

Every route contract in `examples/static-list-report/` comes from
`apps/docs/scripts/check-po-app.mjs`. Every visual value comes from
`packages/core/src/css`. The one design decision made without a source is the
brand mark; everything else can be traced.
