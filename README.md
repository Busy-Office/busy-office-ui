# busy-office-ui

CSS-first UI framework for ERP and back-office applications. Semantic components —
not utility soup — built on modern CSS: `@layer` cascade contract, `:has()`, named
container queries, native `<dialog>` and `popover`.
**<!-- stat:size -->61 kB minified (9.9 kB gzipped)<!-- /stat -->** for the whole
framework; tree-shakable per-component files if you want less.

```sh
npm i @busy-office/ui
```

```js
// all-in-one
import "@busy-office/ui/css";

// or à la carte — order matters: tokens, then reset, then components
import "@busy-office/ui/css/tokens";
import "@busy-office/ui/css/reset";
import "@busy-office/ui/css/components/data-table";

// optional call-once JS behaviors (delegation — swap-proof, no re-init)
import { initDialogs, initDataTables } from "@busy-office/ui/js";
initDialogs(); initDataTables();
```

## Why

- **Density is a first-class dimension.** `data-density="compact|comfortable|spacious"`
  on `<html>` or any wrapper remaps a token tier — 30/40/48px rows, cascading,
  overridable per-region. ERP users live in dense grids.
- **Semantic HTML + one class.** `.bo-data-table`, `.bo-form-field`, `.bo-timeline`.
  State via ARIA (`aria-invalid`, `aria-sort`, `aria-current`) and `data-*` — styled
  directly, no invented state classes.
- **The cascade is the API.** All framework CSS lives in `@layer`; anything you write
  unlayered wins. Re-brand by remapping the semantic token tier only.
- **CSS-only visuals, honest semantics.** `:has()` drives error states and bulk-action
  reveals with zero JS — and every such pattern documents its mandatory programmatic
  counterpart. Never-color-alone, for both colorblind users *and* screen readers.
- **HTMX-ready, not HTMX-coupled.** An opt-in stylesheet styles HTMX's own lifecycle
  classes; core never references it.

## What's in the box

Tokens (light/dark, 3 densities) · layout primitives · buttons · badges · forms
(fields, sections, inline edit) · dense data tables (selection, sticky header/column,
pagination, filters, saved views) · tabs · dropdowns (popover) · alerts/toasts ·
navigation (sidebar, off-canvas) · dialogs · dashboards (widget grid, stat tiles) ·
approval timelines · audit trails · wizard stepper · print/report layer.

Browser floor: **Chrome/Edge 119 · Firefox 128 · Safari 17.4**.

## Docs

**Live site:** https://busy-office.github.io/busy-office-ui/ — component gallery
with live demos, canonical markup for every component, a theming guide, and
composed ERP patterns (dense invoice list, approval workflow, goods receipt).
Local: `npm install && npm run docs:dev`.

## Design reviews

Every slice was reviewed by an adversarial multi-seat panel before sign-off —
findings, gates, and fix outcomes are in [`.roundtable/`](.roundtable/). Two rules
that came out of it are build-enforced: every `@container` query is named, and every
state signal ships both a visible non-color cue and a programmatic channel.

## Project docs

[DESIGN.md](DESIGN.md) — architecture and contracts · [ROADMAP.md](ROADMAP.md) —
the living slice backlog · [CHANGELOG.md](CHANGELOG.md) — including pre-1.0
breaking changes.

MIT
