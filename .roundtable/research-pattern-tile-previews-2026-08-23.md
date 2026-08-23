# Research: preview images on the pattern tiles (evidence for 104.2)

Research loop round 2, 2026-08-23 (LOOPS.md §3c). Prepares the owner call
on ROADMAP 104.2 — it decides nothing. Every claim carries its source;
≥2 independent sites per shape, so the shape-level findings grade
**Evidence**; the final recommendation is a judgement and grades
**Hypothesis** until the owner rules.

## What the reference catalogues actually do

| Site | Tiles carry | Kind |
|---|---|---|
| namethatui.com (the owner's original reference) | YES | **live inline miniatures** — the Steps tile renders real numbered circles, Pagination renders "123…8" |
| Tailwind Plus (Tailwind UI) | YES | real rendered screenshots, paired light+dark PNGs |
| shadcn/ui blocks | YES | static light/dark PNG thumbnails, live iframes on detail |
| Mobbin | YES | screenshots ARE the product |
| SAP Fiori floorplan overview | NO | text-first; two abstract schematics for the whole page |
| IBM Carbon patterns index | NO | plain linked table (verified in site source) |

**The split is by genre, not quality**: inspiration/marketplace catalogues
(Tailwind, shadcn, Mobbin, namethatui) treat the preview as the browsing
mechanism; enterprise guideline indexes (Carbon, Fiori) are comfortable
text-only because their reader arrives knowing which pattern they need.
busy-office-ui's `/patterns/` tile index is closer to the first genre —
it sells the screens — and the owner's own reference sits in the visual
camp, via live miniatures rather than images.

## The three implementation shapes

1. **Real screenshots** (Tailwind, shadcn, Mobbin). Credible, zero render
   cost — but binary artifacts that go stale on every CSS change. For a
   repo that rebuilds from source and gates drift, each PNG is a new
   un-gated surface unless capture is automated into the build.
2. **Abstract wireframe illustrations** (Fiori's schematics). Stable and
   tiny — but hand-drawn: the ONLY shape that is hand-written rather than
   generated, so no gate can red-prove a drawing. **Ruled out by this
   project's own doctrine** ("every documented surface is generated from
   the shipped artifact").
3. **Live rendered miniatures** (namethatui; shadcn's iframes are the
   full-size cousin). Zero drift by construction — the tile renders the
   same shipped CSS the pattern page uses, and inherits theme/density
   switching free. Costs: 35 scaled screens of layout/paint on one index
   page; legibility at tile size needs a deliberate crop or
   `transform: scale()`; previews must be inert (no tab-traps, no
   clickable controls inside a tile that is itself a link).

## Recommendation put to the owner (Hypothesis)

**Live miniatures first; auto-captured screenshots as the fallback.**
Miniatures ARE the artifact, so the doctrine is satisfied by
construction and the existing DOM-asserting gates can cover them. If
layout cost or tile-size legibility kills them, shadcn provides the
proven fallback: a Puppeteer capture step in the build
(`apps/v4/scripts/capture-registry.mts` captures each block's live page
in both themes) — screenshots stay generated-not-hand-made, at the cost
of a headless-browser build step plus a staleness gate ("screenshot
older than the pattern's CSS" must fail loudly). This project already
runs Podman + Puppeteer screenshot verification, so that machinery is
half-built.

A scoped middle path worth considering: miniatures for the ~10 patterns
whose screens compress legibly (calendar, kanban, dashboard-ish), text
tiles for the rest — namethatui itself only previews patterns that read
at small size.

## Sources

- https://namethatui.com
- https://tailwindcss.com/plus/ui-blocks
- https://ui.shadcn.com/blocks
- https://github.com/shadcn-ui/ui/blob/main/apps/v4/scripts/capture-registry.mts
- https://www.sap.com/design-system/fiori-design-web/v1-96/page-types/floorplan-overview
- https://carbondesignsystem.com/patterns/overview/
- https://mobbin.com
