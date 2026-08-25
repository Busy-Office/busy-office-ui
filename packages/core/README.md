# @busy-office/ui

CSS-first UI framework for ERP and back-office screens. Semantic components — not
utility soup — built on modern CSS: `@layer` cascade contract, `:has()`, named
container queries, native `<dialog>` and `popover`.
<!-- stat:size -->89 kB minified (14.5 kB gzipped)<!-- /stat --> for the whole
framework, zero runtime dependencies, tree-shakable per-component files.

**Docs & live demos:** https://busy-office.github.io/busy-office-ui/

## Install

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
```

No bundler? Copy `dist/` into your asset pipeline (Rails, Django, PHP, Go — anything)
and link `css/index.min.css` as a plain file. The output is plain CSS and standard
ES modules; Node is never required at runtime.

## Interactive components

Behaviors are opt-in, call-once, and delegation-based — they survive any DOM swap
(HTMX, Turbo, fetch-and-replace) with no re-init:

```js
import { initDialogs, initDataTables, initTabs, initDropdowns, initAlerts }
  from "@busy-office/ui/js";
initDialogs(); initDataTables(); initTabs(); initDropdowns(); initAlerts();
```

Components whose docs page says "JS required" are inert until you call their init.
All <!-- stat:behaviors -->26<!-- /stat --> behaviors communicate through intent
events (<!-- stat:events -->`bo:cell-change`, `bo:combobox-select`, `bo:row-cancel`, `bo:row-save`, `bo:scan`, `bo:table-export`, `bo:table-load-more`, `bo:tag-add`, `bo:tag-remove`, `bo:tree-toggle`<!-- /stat -->) — your app owns the data
layer.

## Why this framework

- **Density is a first-class dimension.** `data-density="compact|comfortable|spacious"`
  on `<html>` or any wrapper remaps the size-token tier — dense grids for back-office,
  touch targets for the warehouse tablet. Cascading, overridable per-region.
- **Semantic HTML + one class.** `.bo-data-table`, `.bo-form-field`, `.bo-timeline`.
  State lives in ARIA (`aria-invalid`, `aria-sort`, `aria-current`) and `data-*` —
  styled directly, no invented state classes.
- **The cascade is the API.** All framework CSS lives in `@layer`; anything you write
  unlayered wins. Re-brand by remapping the semantic token tier only.
- **Two-channel state, always.** Every state signal ships a visible non-color cue and
  a programmatic channel — enforced by a build gate, not a style guide.
- **HTMX-ready, not HTMX-coupled.** An opt-in stylesheet styles HTMX's lifecycle
  classes; core never references it.

## What's in the box

Tokens (light/dark, 3 densities) · layout primitives · buttons · badges · forms ·
dense data tables (selection, sticky header/column, pagination, filters, toolbar,
inline edit) · combobox & multi-select dropdown · tabs · alerts/toasts · navigation
(navbar, sidebar, breadcrumb, off-canvas) · dialogs · dashboards · progress ·
tree · CSS icons (`mask-image`, themable via `currentColor`) · approval timelines ·
audit trails · wizard stepper · print/report layer.

Browser floor: **<!-- stat:floor -->Chrome/Edge 119 · Firefox 129 · Safari 17.5<!-- /stat -->**.

## Links

- [Documentation & component gallery](https://busy-office.github.io/busy-office-ui/)
- [Changelog](https://github.com/Busy-Office/busy-office-ui/blob/main/CHANGELOG.md)
- [Report an issue](https://github.com/Busy-Office/busy-office-ui/issues/new/choose)

MIT
