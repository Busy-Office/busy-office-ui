# busy-office-ui — Roadmap

A CSS-first ERP UI framework: semantic components, density-aware tokens, modern CSS,
generated-and-verified docs. This file is the long-term plan; per-slice detail and the
design-review trail live in `.roundtable/`, and every breaking change is in
`CHANGELOG.md`.

## Done

### Slice 1 — Foundation + core components
Workspace + PostCSS/tsc tooling, `@layer` skeleton; tokens (palette / semantic /
density / dark hooks); reset + layout primitives; button, forms, badge, dense data
table, navbar + sidebar nav, dialog; opt-in `htmx.css`; Astro docs gallery.

### Slice 2 — Interaction & filtering
Tabs, dropdown (popover), alerts/toasts, filter bar + chips + saved views, pagination
+ table footer, form sections, off-canvas drawer, inline edit, dark-theme toggle.
Two design-grill gates worked (delegation rewrite, FF 128 floor, à-la-carte
restructure, contrast fixes).

### Slice 3 — ERP workflows & dashboards
Status timeline, audit trail, dashboard stat tiles + widget grid, wizard stepper,
theming guide + versioning policy, print/report layer. Grilled; container-naming
build rule enforced.

### Slice 4 — Records & approval
Byline, ordered list (mono/`--plain`/editable rows), record-type badge, small &
danger-ghost buttons, widget band footer; composed in the record-detail pattern.
Grilled and decomposed into small general components per the "one component, many
settings" principle.

### Engineering & docs discipline
- 7 build-enforced gates: named `@container`, contrast threshold **+ coverage**,
  behaviors-vs-`.d.ts`, dist link resolution, stylelint naming, 11 behavior tests,
  page-shape (every component page has its opener/`ClassRef`/demo/`ApiTable`/
  `Related`/sidebar entry — `check-page-shape.mjs`, added in Slice 5).
- Generated-from-artifact docs: API tables, contrast tables, class index, `llms.txt`,
  quick-reference cheat sheets, AA-per-component — none hand-maintained, all CI-gated
  against drift.
- CI + GitHub Pages deploy (gated on tests); Docker consumer app; Podman docs image.
- Four adversarial multi-seat design reviews, every gate finding fixed or ledgered.

### Slice 5 — Docs UX polish + ERP data-entry fields
Fixed app chrome (independent-scroll shell) + responsive nav drawer + full-width
landing; the theme-switch-flash P0; ERP Amount field; data-table column alignment
(+ a latent specificity bug fix); Cmd/Ctrl+K command palette; sidebar scroll
persistence; the opt-in Motion module (8 reduced-motion-safe animations); the
Ledger teal brand palette + SVG logo + favicon; a section-by-section docs
simplicity pass; the `new:component` scaffold generator + page-shape build gate
(gate 7); copy buttons + the `Demo` wrapper component (site-wide, satisfying the
"Docs UX cluster 2" ask — full migration of all 17 component pages onto the
`Demo` wrapper specifically is optional polish, not tracked further since
hand-authored demo sections are already gate-compliant and already copyable).
Full detail: `.roundtable/loop-log.md`.

## In progress — Slice 6: Component depth + a11y hardening

Reconciled 2026-08-14 (Roadmap loop, after the ARIA-grid Explore graduation).
Ordered by value × effort; `npm publish` is intentionally last — it's
owner-gated, not something a loop iteration can close.

**Queued (priority order)**
0. [x] **P0 — Navigation flash/flicker in dark theme** (2026-08-14 user report:
       "screen flicking when click on the link, especially on the left sidebar").
       Fixed: a blocking `is:inline` script in `<head>` (before both
       stylesheets, confirmed via the built HTML) sets
       `document.documentElement.dataset.theme` from `localStorage`
       synchronously, before first paint — the standard FOUC-prevention
       pattern. The old body-end script no longer re-applies the theme (that
       was the redundant, late, flash-causing call); it now only syncs the
       `<select>` display and wires the change handler. Verified live
       (bind-mounted Podman): navigated across 3 pages with dark preference
       stored — `data-theme` was already `"dark"` at first check on every
       one, no light-default fallback. Confirmed no regression: a fresh
       visitor with no stored preference still gets light by default, and
       the manual toggle (with its `data-bo-theming` transition guard) still
       works. Landing page (`index.astro`) is unaffected/out of scope — its
       theme control is scoped to the demo widget only, doesn't read the
       global `bo-theme` key.
1. [x] **Skeleton / empty / error states** — shipped as two components (not
       three classes): `.bo-skeleton` (`--circle`/`--block` shimmer
       placeholders, `aria-busy` is the programmatic channel) and `.bo-state`
       with an `--error` modifier for empty/error — one component, two
       settings, per the standing "one component, many settings" principle,
       rather than the literal `.bo-empty-state`/`.bo-error-state` split
       first sketched. Icon *shape* differs per state, not just color. Both
       continuous-loop shimmer, guarded by an explicit reduced-motion
       override (not duration-token-driven, same reasoning as
       `.bo-motion-spin`). Docs: `/components/state-patterns` (one page, all
       three states, via a shared `PAGE_SLUG` alias — which turned out to be
       tracked in **three** separate places: `extract-api.mjs`,
       `check-page-shape.mjs`, `gen-llms.mjs`; updated all three, worth
       consolidating in a future Standardize pass). Verified live via Podman
       (`bo-docs-run`): light + dark at 1440px, and narrow-viewport reflow
       confirmed (no overflow/clipping). All 7 gates green, 11 tests pass.
2. [x] **Data-table ARIA grid pattern** — shipped as a new opt-in behavior,
       `initDataGrid()` + `data-grid-nav` (packages/core/src/js/behaviors/
       data-grid.ts), separate from `initDataTables()` so selection/sort are
       untouched for every existing consumer. Sets `role="grid"` on the
       table — `td`/`th` get their `gridcell`/`columnheader` roles
       *implicitly* from the HTML-AAM mapping once the table has that role,
       so no per-cell markup is needed. `aria-multiselectable` (when the
       table has row-select checkboxes), 1-based `aria-rowindex`/
       `aria-colindex` (supplementary — this table is never virtualized, so
       they're not load-bearing the way they are for a virtualized grid, but
       included per the accept criteria). Two-level roving tabindex per the
       APG "Data Grid" (interactive-widgets) example: one Tab stop for the
       whole grid, arrow keys move the cell cursor (clamped, no wrap, incl.
       Home/End and Ctrl+Home/Ctrl+End), Enter focuses a cell's one
       interactive descendant (checkbox/button/input), Escape hands focus
       back to the cell. `aria-selected` synced on the row from the
       checkbox's `change` event. Docs: a new "Keyboard grid navigation"
       demo section on `/components/data-table`. 5 new behavior tests (16
       total, all pass) plus live verification in a real Chromium DOM via
       Podman — role/multiselectable/rowindex, focus mechanics (ArrowRight
       moves the cursor, Enter/Escape into-and-out-of the checkbox,
       aria-selected on check) all confirmed against the actual browser, not
       just jsdom. **Not done this tick:** an actual VoiceOver verbalization
       pass — that's Slice 6 item 5 (Runtime a11y pass); this item shipped
       the correct ARIA semantics and keyboard mechanics but hasn't been
       listened to yet, so "AA outright" isn't claimed until that pass runs.
3. Slice-4 continuation:
   - [x] **Avatar byline** — `.bo-byline__avatar` (optional part): initials or an
         `<img>`, em-sized so it scales with `--compact` automatically instead of
         its own size modifier. Scoped via `:has(.bo-byline__avatar)` so a
         plain-text byline (the common case) gets zero layout change. Always
         `aria-hidden` — decoration, the name is already text in the byline.
         Verified live (Podman, light + dark).
   - [x] **Collapsible cards** — extends `.bo-widget` (not a new component):
         `.bo-widget__collapse` wraps `__body` using the same
         grid-template-rows 0fr/1fr technique as the Motion module's
         `.bo-motion-collapse` (duplicated locally — a component shouldn't
         have to import the opt-in Motion module for this; the tokens are
         core). New opt-in behavior `initCollapsibleCards()` +
         `data-collapse-trigger`: toggles the trigger's `aria-expanded` and
         the panel's `data-state`, the two-channel contract (chevron
         rotation is decoration). No `data-state` at all defaults to open —
         degrades to a plain widget without the behavior wired up. Docs: new
         "Collapsible" demo on `/components/dashboard`. 2 new tests (18
         total, pass). Verified live: light + dark, toggle confirmed via
         screenshot (chevron rotates, panel visibly collapses).
   - [x] **`.bo-composer`** — how a new `.bo-audit` entry gets *written*, not
         just read. Layout-only, composing existing primitives rather than
         inventing controls: `.bo-byline__avatar` for the "who", a plain
         `.bo-input` textarea (already styles `textarea.bo-input`), an
         actions row. Lives in `approval-workflow.css` next to
         `.bo-timeline`/`.bo-audit` (the thematic file, not a new component
         dir). Docs: new demo section on `/components/approval-workflow`,
         inserted sample-before-code per the ordering audit two ticks ago.
         Verified live: typed into the textarea, confirmed it persists
         through a theme switch, both themes render correctly.

Slice-4 continuation is now fully done (avatar byline, collapsible cards,
`.bo-composer` — all three shipped and verified).
4. Filters/detail-forms:
   - [x] **Saved-view persistence** — the Slice 2 saved-views markup was
         static (hardcoded active chip, hardcoded field values); the real
         gap was that nothing DERIVED either from the URL. New opt-in
         behavior `initSavedViews()`: populates `.bo-filter-bar` fields from
         `location.search`, and marks whichever `[data-saved-views]` link's
         own querystring matches the current URL `aria-current="page"`
         (clearing it from the others). Doesn't invent a storage backend —
         views stay server-rendered links, this only keeps the UI honest
         about which one is active. 2 new tests (20 total, pass). Verified
         live: navigated with `?status=pending` in the URL, the select
         showed "Pending" and the matching chip was active — clicked
         "Overdue", URL/select/active-chip all updated together, both
         themes.
   - [ ] Multi-column detail-form patterns.
5. [ ] **Runtime a11y pass** — VoiceOver verbalization + 200% zoom geometry +
       print preview are checkable from this environment (macOS); NVDA
       (Windows-only) stays a standing NEEDS-RUNTIME ledger entry, not claimed.
6. [ ] **npm publish** `@busy-office/ui@0.1.x` — structurally ready (exports
       audited, tarball-tested via the consumer app); **owner-gated on
       "perfect"** — a loop iteration should not self-approve this.
7. [ ] **Breadcrumb** — a new component. Record-detail and deep ERP hierarchies
       (nested cost centers, PO → line item) need a path trail; nothing in the
       library covers it today. `<nav aria-label="Breadcrumb"><ol>…` per the
       standard pattern, current page non-interactive + `aria-current="page"`.
8. [ ] **More patterns** (`apps/docs/src/pages/patterns/`) — only 3 exist
       (invoice-list, approval, record-detail). Add professional ERP-shaped
       compositions: a dashboard/reporting layout, a multi-step data-entry
       form, a settings/admin screen — each composing existing components,
       not new CSS.
9. [ ] **RF-scanner / warehouse-scan components** — a real ERP gap: goods
       receipt (GR) / goods issue (GI) screens driven by a handheld RF
       scanner, not a mouse. Large-target scan-input field (auto-focus,
       auto-advance on a terminator character), a big-number quantity
       stepper, high-contrast/high-density variants for warehouse-floor
       screens. Seed it as an **Explore** spike first (see `LOOPS.md` Ideas
       backlog) — the interaction model is different enough from the rest of
       the library that it needs a try/error pass before committing to an
       API.
10. [x] **Demo-section ordering audit** (Standardize) — scripted a check
        across all 16 hand-authored pages (13 components + 3 patterns):
        found exactly one real violation, `alerts.astro`'s "Toast recipe"
        section — code-only, no live example at all (toasts are ephemeral,
        so the original author skipped rendering one). Fixed: a "Show
        toast" trigger button + `.bo-toast-region` now render a REAL toast
        above the code, matching what the code shows. Verified live: click
        renders the toast (bottom-end, both themes), dismiss removes it via
        the existing `initAlerts()` delegation — no regression. Every other
        flagged page was a false positive: either the sanctioned trailing
        "Markup" reference section (matches the recipe exactly) or a case
        where the live example lives in an earlier section on the same
        page. Clean pass otherwise — most of the codebase already follows
        the convention.
11. [ ] **Responsive audit (mobile + desktop)** — container queries already
        drive auto-compaction on data-table and a few others; audit that
        EVERY component looks intentional (not just "doesn't overflow") at
        both narrow and wide, not only the ones that happened to get a
        `@container` rule. Note: this session's browser tooling has a
        window-resize floor (~600px) that blocks testing true 390px in the
        live browser — verify affected components some other way (Podman +
        a real device/simulator, or a headless viewport tool) before
        checking this off.

## Long term (post-1.0)

Highest-leverage bets (2026-08-14 review — ranked):

- [x] **Scaffold generator + page-shape gate** *(top pick)* — `npm run new:component
      <name> [--behavior]` (packages/core/scripts/new-component.mjs) stamps the CSS
      file + `@import`, the docs-page skeleton, the sidebar entry, and (with
      `--behavior`) a stub test in one command; `apps/docs/scripts/check-page-shape.mjs`
      is build gate 7, FAILING a component page missing its opener/`ClassRef`/demo/
      `ApiTable`/non-empty `Related`/sidebar entry. Caught two real drifts (button.astro,
      form.astro missing the demo-note opener) on first run — fixed. Turns the CLAUDE.md
      "how to document" prose into something that can't be gotten wrong.
- [x] **Keyboard row navigation — Explore spike (2026-08-14)** — j/k/Enter roving
      focus on a plain `<table>`; mechanics confirmed live, but discarded as unsafe
      (breaks screen-reader table browse mode). Graduated into Slice 6 item 2 above
      as the properly-scoped ARIA grid pattern.
- [ ] **1.0 exit checklist, then ship** — the real risk isn't technical, it's that
      "owner-gated on *perfect*" never resolves. Write a short, checkable list (N
      components, a11y ledger cleared, API frozen, ≥1 real consumer), hit it, publish
      1.0, iterate under semver. Perfection is the enemy of adoption.
- [ ] **Real ERP pilot (dogfood)** — build one real back-office screen (an approval
      queue, a PO form) with the framework and feel where it fights. The only test of
      "good for hundreds of ERP screens" that synthetic demos + grills can't give.

- [ ] **Framework adapters** (`integrations/`) — a Vite plugin for à-la-carte imports,
      a thin React/Vue wrapper set, a Rails/Django asset recipe. Opt-in, never a core
      dependency.
- [ ] **Versioned docs** — the CHANGELOG covers pre-1.0 churn; at 1.0, snapshot docs
      per major so pinned users read their version.
- [ ] **Theme presets** — a small set of validated brand palettes (each passing the
      contrast gate) as `brand-*.css`, demonstrating the semantic-tier re-skin.
- [ ] **Visual-regression harness** — screenshot diffing across density × theme in CI,
      so the "looks right" pass becomes mechanical like the rest.
- [ ] **Turbo** — adopt if the workspace grows past ~2 packages (build caching).
- [ ] Component depth: data-grid virtualization hooks, date-field component,
      tree/nav for deep ERP hierarchies. (Amount field and command palette pulled
      forward into Slice 5.)
- [ ] Localization/RTL audit as a first-class pass (logical properties already
      throughout; verify end-to-end).

## Standing principles (not a phase — the bar every slice meets)

- Every documented surface is generated from the shipped artifact and drift-gated.
- Every state signal is two-channel (visible non-color cue + programmatic).
- Every `@container` is named; heights are minimums; density is rem-only.
- New components compose existing primitives; small and general over specific.
- Before adding a class, ask whether it's a genuinely reusable ERP setting (an
  existing component's new part/modifier) or a one-off — prefer widening what
  exists over shipping a narrow variant (2026-08-14 user direction).
- Every component is responsive by construction (container queries, relative
  units) at both narrow and wide — not verified only at whatever width
  happened to be open when it shipped.
- Each slice is adversarially grilled before sign-off.
