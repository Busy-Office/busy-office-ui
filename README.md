# busy-office-ui

CSS-first UI framework for ERP and back-office applications. Semantic components —
not utility soup — built on modern CSS: `@layer` cascade contract, `:has()`, named
container queries, native `<dialog>` and `popover`.
**<!-- stat:size -->93 kB minified (15.0 kB gzipped)<!-- /stat -->** for the whole
framework; tree-shakable per-component files if you want less.

![Hand-made screenshot: the list-report pattern at data-density="compact" — a
saved-view bar, a filter row, and a dense invoice table whose status column pairs
colour with the word, captured from the docs site at 1440px in the light
theme.](packages/core/media/list-report-compact.png)

*Above: `/patterns/list-report` at `data-density="compact"`. Hand-made — it is a
screenshot, not a generated artifact, and it is the one image in this README that
no gate keeps current.*

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

Browser floor: **<!-- stat:floor -->Chrome/Edge 119 · Firefox 129 · Safari 17.5<!-- /stat -->**.

## What it is not

Deliberately not shipped, each with its reasoning recorded on the
[scope page](https://busy-office.github.io/busy-office-ui/getting-started/scope)
— a "not in scope" list says the gap was decided, not forgotten:

<!-- stat:notfor -->A charting engine · A rich-text editing engine · A virtualised table · A JS component framework · Kanban boards, page builders, WYSIWYG layout · Icons as a shipped set · State management, routing, i18n runtime<!-- /stat -->

## When something doesn't work

Failure modes here are unusually *silent* — modern CSS degrades by doing nothing
rather than by erroring. [Troubleshooting](https://busy-office.github.io/busy-office-ui/getting-started/troubleshooting)
is symptom → cause: <!-- stat:faq -->11 symptom→cause entries, plus “My markup looks right but nothing happens” and “Using with Tailwind or an existing reset”<!-- /stat -->.

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

The build runs <!-- stat:gates -->52 build gates, 18 of them heuristic detectors that each ship a `--self-test`<!-- /stat -->.
A heuristic gate is one whose verdict rests on *recognising* something, so it can
be fooled — each of those must prove it can fail before it is trusted.

## Project docs

[DESIGN.md](DESIGN.md) — architecture and contracts · [ROADMAP.md](ROADMAP.md) —
the living slice backlog · [CHANGELOG.md](CHANGELOG.md) — including pre-1.0
breaking changes.

MIT
