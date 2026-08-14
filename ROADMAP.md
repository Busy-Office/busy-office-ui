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

**Slice 6 is functionally complete** (2026-08-14) — every item below is
`[x]` except the owner-gated publish. Per the dispatcher's own rule, a
slice closing is the trigger for the **Objective** loop (grill the product
vision, decide what Slice 7 should actually be) — attempted this wake, but
`/round-table` is reserved for explicit user invocation and can't be run
autonomously (`disable-model-invocation`); the dispatcher correctly did
NOT attempt to replicate that workflow by other means. **Falling back to
Explore** per the priority order instead (backlog empty of Continue-
sized work). One idea graduated below (item 19) — small, independently
justified, doesn't need the deeper product review to be worth building.
**Objective review itself stays open** — ask the user to run `/round-table`
when they want Slice 7 properly scoped; until then, new items land here
as they're identified, same as Slice 6's own items 12-18 did mid-slice.

**Queued (priority order)**
0. [x] **P0 — navigation flash/flicker, real root cause: whole-page reload,
       not a paint-timing issue.** Two earlier passes fixed real but
       secondary bugs (theme applied too late; no `color-scheme` hint for
       the browser's pre-paint default) without touching the actual
       mechanism. 2026-08-14 user follow-up named the real symptom
       precisely: **"kind of whole screen refresh, instead of replacing
       the main area."** That reframed it correctly — this is a static
       multi-page site, so every sidebar click was a full document
       navigation: header, sidebar, everything tore down and rebuilt on
       every click, independent of whether colors matched.
       - **Fix (confirmed with the user first — new runtime dependency +
         navigation-model change, not a CSS tweak):** `htmx` `hx-boost` on
         `<body>` (Gallery.astro), targeting/selecting `#main-content`
         (the `<main>` element) — only that swaps on an internal link
         click; header, sidebar, and scripts now persist. `htmx.org` added
         as a dependency of the **docs app** (`apps/docs/package.json`)
         only — the shipped `@busy-office/ui` package stays at its
         genuine zero runtime dependencies.
       - Had to hand-rebuild what a full reload used to give for free:
         sidebar `aria-current` (was server-rendered per page; now synced
         from `location.pathname` on every `htmx:afterSwap`), the
         right-rail TOC + copy-button injection (re-run per swap, same
         event), scroll-to-top on the main pane. Component pages' own
         inline `<script>` blocks (`initDataGrid()`, `initCollapsibleCards()`,
         etc.) needed **no changes** — they live inside the swapped
         region and htmx re-executes script tags in swapped content by
         design; document-delegated behaviors (tabs, dropdown, dialog,
         alerts) needed **no changes** either, since `document` itself is
         never touched by a partial swap.
       - Found and fixed a real regression the new model introduced: the
         mobile nav drawer and Cmd/Ctrl+K palette live *outside*
         `#main-content`, so unlike everything else they now persist
         across a swap instead of resetting — without a fix, navigating
         via a link inside the drawer left it hanging open. Both now close
         explicitly on `htmx:afterSwap`.
       - TOC hash-links (`#heading-id`) excluded from boosting
         (`hx-boost="false"` on `#toc-nav`) — same-page anchors must stay
         native scroll-to-anchor, not a navigation.
       - **Verified live**, extensively, via the bind-mounted Podman
         container: tagged the header/sidebar DOM nodes before a boosted
         click and confirmed the SAME nodes (not new ones) after — genuine
         partial swap, not a reload made to look like one. Confirmed
         title/URL/`aria-current` all update correctly. Confirmed
         `initDataTables()` and `initDataGrid()` both re-initialize
         correctly on a swapped-in data-table page (select-all works,
         `role="grid"` present). Confirmed TOC/copy-buttons repopulate.
         Confirmed a hash-link click doesn't trigger a boost. Confirmed
         dark theme survives navigation (trivially now — `<html>` is never
         touched). Confirmed `Tabs` (document-delegated) still works.
         Confirmed the drawer-close fix. Zero console errors across all of
         it. All gates green, 20 tests pass.
       - **Follow-up round (same wake, before moving to a new item):**
         click-tested the previously-flagged Pagefind gap directly instead
         of trusting the "should work" assumption — it didn't. Two real
         bugs found and fixed:
         1. `import 'htmx.org'` (ESM build) only default-exports `htmx`; it
            never sets `window.htmx`. Fixed: `import htmx from 'htmx.org';
            window.htmx = htmx;` — needed so other scripts can call
            `htmx.process()` at all.
         2. Even with that fixed, `htmx.process(container)` does NOT
            retroactively re-derive an ANCESTOR's `hx-boost` for newly-
            added descendants — that inheritance is only computed at the
            initial page-load scan (confirmed empirically by testing both
            ways, not assumed from docs). Fixed: a `MutationObserver` on
            the Pagefind results containers (`#docsearch`, `#cmdk-search`)
            sets `hx-boost="true"` explicitly on each fresh result link
            before calling `htmx.process()`.
         Re-verified after both fixes: tagged the header before a search
         + click and confirmed it persists, URL/title/sidebar
         `aria-current` all update correctly — same standard as every
         other boosted path. Also re-ran the full component-page sweep
         (Dialog, Alerts/toasts trigger+dismiss, Dropdown) after the
         earlier hx-boost commit specifically to broaden coverage beyond
         the 2 pages tested there — all confirmed working, zero console
         errors, gates green, 20 tests pass.
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
   - [x] **Multi-column detail-form patterns** — new pattern page
         `/patterns/detail-form`, the edit-screen counterpart to
         `/patterns/record-detail`. The CSS was already complete and
         already demonstrated on the Forms component page
         (`.bo-form-section`/`.bo-form-row`/`.bo-form-actions`); the actual
         gap was a missing COMPOSED pattern — a full multi-section purchase-
         order edit screen (header + payment/delivery fieldsets, a
         line-items table with seamless inline-edit inputs, a sticky action
         bar), matching the shape of the other 3 pattern pages. Zero new
         CSS. Verified live: 3-column layout at 1440px in both themes;
         forced a 300px container width and confirmed via computed layout
         that all 3 header fields stack into one column each (the
         `auto-fit` grid genuinely collapses, not just claimed to).

Slice 6 item 4 is now fully done (saved-view persistence + multi-column
detail-form patterns).
5. Runtime a11y pass — split into what this environment can and can't
   actually do (corrects an earlier assumption: VoiceOver was thought
   checkable here; it isn't — no AppleScript/System Events/Accessibility
   API access is available to drive it, only browser automation):
   - [x] **200% zoom geometry** — simulated via `document.documentElement.
         style.zoom` (real `Ctrl/Cmd +` shortcuts aren't scriptable through
         this session's browser tool either). Found and fixed a REAL bug:
         `.bo-navbar` had a fixed `height: 3rem` with no wrap, so at 200%
         zoom the Theme select was rendered fully off-screen (`right: 1189px`
         in a `757px` viewport) with no horizontal scrollbar to reach it —
         a genuine WCAG 1.4.10 Reflow failure, not hypothetical. Fixed:
         `flex-wrap: wrap` + `min-block-size` instead of a fixed `height`;
         verified live, re-measured (`right: 692px`, now on-screen), and
         confirmed zero regression at normal 100% zoom (still one line).
   - [x] **Print CSS static audit** — grepped every `@media print` rule
         across the codebase (can't render a literal print-preview
         screenshot without opening the native OS print dialog, which risks
         hanging browser automation the same way a JS `alert()` would).
         Found two real gaps from this session's own additions: a collapsed
         `.bo-widget__collapse` card would have silently vanished from a
         printout (fixed: forced open under `@media print`); an empty
         `.bo-composer` comment form would print as noise (fixed: hidden,
         same treatment as `.bo-filter-bar`/`.bo-form-actions`).
   - [ ] **VoiceOver verbalization** — NOT verified. No tool available in
         this session can drive VoiceOver; this needs a human on real
         hardware. NEEDS-RUNTIME.
   - [ ] **NVDA** — Windows-only, NEEDS-RUNTIME, unchanged from before.
6. [ ] **npm publish** `@busy-office/ui@0.1.x` — structurally ready (exports
       audited, tarball-tested via the consumer app); **owner-gated on
       "perfect"** — a loop iteration should not self-approve this.
7. [x] **Breadcrumb** — `.bo-breadcrumb`, added to `components/nav/` (folded
       into the existing "nav" umbrella component/docs page — navbar,
       sidebar-nav, and offcanvas already share one page there; consistent,
       not a new component dir). `<nav aria-label="Breadcrumb"><ol>` — a
       real landmark, not just styled links, so it's directly reachable by
       screen-reader landmark navigation. Current page is plain text (never
       a link) with `aria-current="page"` as the programmatic channel,
       emphasis ink as the visible one. Wraps rather than truncates on
       narrow screens — simpler, and a reachable ancestor beats an
       ellipsis that hides one. Wired into `/patterns/record-detail`, the
       exact use case this item named. Verified live, both themes.
8. More patterns (`apps/docs/src/pages/patterns/`):
   - [x] **Reporting dashboard** — `/patterns/reporting-dashboard`. Composes
         the breadcrumb (shipped last tick) + filter bar/saved views + a
         stat-tile row + a widget grid mixing a compact data table, an
         audit-style activity feed, and a collapsible notes card — nearly
         every piece built this session, in one realistic screen. Zero new
         CSS. Verified live: collapse toggle and theme switching both work
         correctly on the composed page (state persists through the theme
         change), both themes.
   - [x] **Settings & admin** — `/patterns/settings-admin`. Composes
         `.bo-tabs` (General/Users/Notifications), `.bo-form-section` +
         `.bo-form-row` fieldsets, `.bo-checkbox` for on/off preferences
         (no separate "switch" component invented — a labeled checkbox
         already covers the same setting, per the standing "one component,
         many settings" principle), and the data table + byline avatars
         for the user list. Zero new CSS. Verified live via Podman: all
         three tabs render correctly light + dark at 1440px; forced the
         main pane to 350px and confirmed via computed layout that
         `.bo-form-row` genuinely collapses every field to one column
         (single shared left edge) and the user table scrolls within its
         own container (`overflow-x: auto`) rather than blowing out the
         page — same verification method used for `/patterns/detail-form`,
         since this session's browser-resize floor still won't reach a
         literal 390px viewport. 20 tests pass, gates green.
   - [x] **Multi-step wizard** — `/patterns/wizard`. A real Back/Next flow,
         one panel visible at a time, distinct from `/patterns/detail-form`'s
         multi-*section* single screen. Needed a new opt-in behavior
         (`initWizard()`, `packages/core/src/js/behaviors/wizard.ts`) since
         the existing `.bo-stepper` is presentation-only (no JS): the new
         behavior keeps the stepper (`data-state="done"` / `aria-current`)
         and the visible `[data-wizard-panel]` in sync, disables Back on
         the first step, swaps Next for Submit on the last, and moves
         focus to each new panel (WCAG 4.1.3-style status handling for a
         panel swap that isn't a real navigation). Panels are plain
         `.bo-form-section` fieldsets — no new CSS. 3 new behavior tests
         (23 total, pass). Verified live via Podman: stepped through all 3
         panels in both themes at 1440px, confirmed focus lands on each
         new panel, confirmed Back re-enables/disables correctly at the
         edges, confirmed Submit only appears on the last step; forced the
         main pane to 350px and confirmed via computed layout the form row
         collapses to one column and the page doesn't horizontally
         overflow (this session's browser-resize floor still won't reach a
         literal 390px viewport, same workaround as the other patterns).
         **Not addressed this tick:** the `/concepts/js-behaviors` page's
         "five inits" table is now stale (lists 5, there are 8 —
         initDataGrid/initCollapsibleCards/initSavedViews were already
         missing before this tick, initWizard makes it 4 undocumented);
         flagging for the next Standardize pass rather than scope-creeping
         it into this item.
9. **RF-scanner / warehouse-scan components** — Explore spike run in an
   isolated git worktree (`explore/rf-scanner-scan-input`, discarded after
   evaluation — nothing merged from it directly, per the Explore playbook).
   Findings, split into three now-separate, properly-scoped pieces instead
   of one bundled item:
   - [x] **9a. Scan-input field** — shipped for real (the worktree spike
         itself was discarded, per the Explore playbook — this is a clean
         rebuild in main, not the throwaway code). `initScanInput()`
         (`packages/core/src/js/behaviors/scan-input.ts`): configurable
         terminator key (`data-scan-terminator`, defaults to `Enter`),
         dispatches `bo:scan` with the value, clears the field, refocuses
         it — POST-terminator only, never on `blur` (the anti-pattern
         rejected during the spike). **Zero new CSS**, confirmed again —
         `.bo-input`/`.bo-input--code`/`.bo-form-field` as-is. 4 new
         behavior tests (30 total, pass): scan dispatch + clear + refocus,
         empty-field guard (no accidental empty scans), custom terminator
         key, back-to-back scans. Docs: new pattern page
         `/patterns/goods-receipt` — scan input + `.bo-quantity` at
         `data-density="spacious"` + a REAL receiving log (data-table rows
         appended live on each `bo:scan`, not a static mockup). Verified
         live via Podman: two consecutive scans correctly logged with the
         quantity captured at scan time (3, not stuck at 1), both themes.
         Also confirmed the js-behaviors generated table
         (`/concepts/js-behaviors`, Standardize item 17's fix) picked up
         `initScanInput()` automatically with zero manual doc edit —
         the earlier Standardize round already paying for itself.
   - [x] **9b. Big-number quantity stepper** — already fully solved,
         nothing to build. `.bo-quantity` (Slice 6 item 12) composed with
         `data-density="spacious"` (44px controls, WCAG 2.5.8) already IS
         the large-target quantity control; confirmed working in the
         spike page as-is. No RF-scanner-specific variant needed.
   - [ ] **9c. High-contrast warehouse-floor mode** — genuinely NOT
         addressed by this spike, and turned out to be broader than
         RF-scanner: the codebase has **no `forced-colors: active` /
         Windows High Contrast Mode handling anywhere** (checked — zero
         matches across all component CSS). That's a pre-existing gap
         across the whole library, not something specific to warehouse
         screens, so scoping it as an RF-scanner sub-item would have been
         wrong — split out as its own item, see below.
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
11. [x] **Responsive audit (mobile + desktop)** — worked around the
        session's window-resize floor (still confirmed stuck at ~1600px
        this tick, not just "~600px" as previously noted) with a
        mechanical technique: clone each page's `.demo` section markup
        into an isolated, off-screen 320px container and measure
        `scrollWidth` vs. `clientWidth`, explicitly excluding `<pre>`/code
        blocks and any element with its own `overflow-x: auto/scroll`
        ancestor (both are legitimate internal-scroll cases, not layout
        bugs). Ran this across **all 26** component + pattern pages
        (19 `/components/*`, 7 `/patterns/*`) via real htmx-boosted
        navigation in one continuous script (not full page reloads).
        **Result: zero real overflow findings** — every component that
        looked like it might overflow at 320px (data-table, tabs, forms,
        wizard) genuinely doesn't.
        Mechanical no-overflow is necessary but not sufficient for "looks
        intentional," so also visually spot-checked 3 of the highest-risk
        composite pages by rendering the same isolated 320px clone
        on-screen and screenshotting it: data-table's own "Narrow
        container → auto-compaction" demo, `/patterns/reporting-dashboard`,
        and `/patterns/settings-admin` — all three read as genuinely
        designed for the width (readable stacking, no cramped touch
        targets, tabs/forms/checkboxes all wrap cleanly), not just
        technically non-overflowing.
        **Honest scope note:** the mechanical overflow check is
        exhaustive (26/26 pages); the qualitative "looks intentional"
        visual check is a 3-page spot-check, not full coverage of all 26
        — a future tick could extend the visual pass to the remaining
        23 if a specific page is ever suspected of looking cramped rather
        than broken. No code changed this round (verification only); 26
        tests unchanged, gates green.

12. [x] **Quantity field** (2026-08-14 user direction, wishlist) — shipped as
        `.bo-quantity` (`/components/quantity`), scaffolded via
        `new:component` to keep the docs-page shape gate-honest. Composes
        `.bo-btn`/`.bo-input--numeric` rather than inventing new visual
        primitives — the increment/decrement buttons ARE `.bo-btn
        bo-btn--secondary`, styled for free. A real `type="number"` input
        is the single source of truth for `min`/`max`/`step`; the new
        opt-in behavior `initQuantity()` reads those same attributes to
        clamp the buttons and keeps their `disabled` state in sync
        reactively (author renders the correct initial `disabled` if the
        starting value is already at a boundary — no eager DOM scan, same
        "swap-proof, not scan-proof" shape as the other behaviors). No
        `.bo-stepper` name collision (that's the wizard component).
        Warehouse-floor "large-target" variant is **not a new modifier** —
        `data-density="spacious"` (44px controls) already meets WCAG 2.5.8,
        so item 9's RF-scanner stepper can reuse this directly. Composes
        with `.bo-form-field` for the two-channel validation-error state
        (border + message + `aria-invalid`) — nothing quantity-specific
        needed there. 3 new behavior tests (26 total, pass).
        **Bug found and fixed during live verification, not caught by
        gates:** the docs-page demo markup omitted `.bo-btn` on the step
        buttons — CSS-valid, gates all passed, but the buttons rendered as
        unstyled native `<button>`s at the wrong size (spot-checked
        computed height: 27px vs. the intended ~36px). Caught by measuring
        computed height live rather than trusting the screenshot alone;
        fixed by adding `.bo-btn bo-btn--secondary` to every occurrence.
        Verified live via Podman: comfortable (36px) vs. spacious (44px)
        step-button height confirmed via `getComputedStyle`, light + dark
        both correct, boundary/unit/validation demos all render as
        intended, clicking the buttons live in-browser increments/
        decrements and clamps correctly. Narrow-width check used an
        isolated 320px off-DOM container instead of the usual
        forced-main-width technique (this page's right-rail TOC grid
        didn't shrink under that technique the way patterns pages did —
        a docs-shell quirk, not a component bug — confirmed the component
        itself has no fixed-pixel dependency: `max-inline-size: 12rem`
        plus flex content, same shape already used safely elsewhere).
13. [x] **Standardize: generated-docs drift** (dispatched after 4 Continue
        rounds) — `/concepts/js-behaviors`'s "five inits" table was
        genuinely wrong (hand-typed, actually 9 behaviors, 4 undocumented:
        `initDataGrid`/`initCollapsibleCards`/`initSavedViews`/`initWizard`).
        Rewrote it to generate from `@busy-office/ui/behaviors-manifest`
        (`dist/behaviors.json`), same pattern `ClassRef.astro` already uses
        for `dist/api.json` — marked `generated` so it can't drift again.
        Fixed a real bug surfaced by making the table honest: the
        generator (`extract-behaviors.mjs`) truncated long summaries
        mid-word at a hard 200-char cut; now cuts on a word boundary with
        an explicit `…`. Broader scan (Explore agent) found one more
        instance of the same anti-pattern: `/base/primitives.astro`
        hardcoded "four primitives plus the app shell" in prose — correct
        today but drift-prone (didn't consume the already-available
        `api.primitives`, unlike its sibling generated pages). Fixed the
        same way. Re-scanned the rest of the non-component docs pages
        (index, reference/classes, base/utilities, base/motion,
        base/colors) — all already correctly generated; clean pass, no
        further instances. 23 tests pass (unchanged), gates green.
14. [x] **Amount: currency symbol/ISO code / custom currency, with
        per-currency default (but overridable) decimal precision**
        (2026-08-14 user direction, wishlist) — scoped and resolved: this
        was almost entirely a **documentation gap, not a CSS/JS gap**.
        `/components/amount` already had an ISO-code demo (`__currency`
        holding `EUR`, not just `$`); what was genuinely missing:
        1. A **custom / non-ISO currency** demo — points, credits, an
           app-defined symbol — making explicit that `__currency` has no
           ISO allowlist (it's plain text, always was).
        2. A **decimal-precision reference table**, documented as
           app/domain data (USD/SGD/EUR → 2, JPY/KRW → 0, BHD/KWD/OMR → 3,
           app-defined → "your call"), explicit that there is and should
           be no `--decimals` CSS modifier — precision is an
           `Intl.NumberFormat`/currency-master-table concern, not this
           layer's. Linked out to ISO 4217 for the authoritative table
           rather than trying to embed one.
        Zero new CSS/JS shipped — confirms the scoping question the item
        itself raised (markup-convention vs. new surface) landed on
        "convention," consistent with Amount's existing "your app formats
        the number" contract. `ApiTable` notes updated to state both
        points explicitly. Verified live via Podman, both themes — no
        gate impact (no new classes, no new colour pairing).
15. [x] **Quantity: base-unit symbol / standard &amp; custom units, with
        per-unit default (but overridable) decimal precision**
        (2026-08-14 user direction, wishlist) — resolved the same shape as
        item 14, but with one real difference: Quantity is an **editable**
        input, so unlike Amount's display-only precision, "step IS the
        precision" is a literal, not just documented, mechanism. Shipped:
        1. Clarified `__unit`'s existing text-note to explicitly name the
           ISO/standard-vs-custom-UOM distinction (was already unrestricted
           text — same as `__currency` — just not spelled out).
        2. A new **"Fractional units"** demo: `step="0.25"`/`inputmode=
           "decimal"` on a kg quantity, verified live that clicking `+`
           correctly increments `2.50 -> 2.75` (the decimal `step` flows
           straight through `initQuantity()`'s existing clamping math, no
           behavior change needed).
        3. A per-unit decimal-precision reference table (whole counts -> 0
           / `step=1`, kg-L-m -> 2 / `step=0.01`, hrs -> 2 / `step=0.25`,
           custom -> "your call"), documented as app/domain data with the
           explicit "no `--decimals` modifier" note, mirroring Amount's.
        4. Cross-referenced `.bo-quantity` <-> `.bo-amount` in both
           directions (`Related` links + an inline note on Amount's "Unit
           of measure" section pointing to Quantity as the editable
           counterpart) — the item's own "should these cross-reference"
           question, resolved now rather than left as a future
           Standardize candidate.
        Zero new CSS/JS surface (confirms the scoping hypothesis again).
        Verified live via Podman, both themes; gates unaffected.
16. [x] **Quantity + Amount: input-field and table samples, incl. mixed
        units/currency per row** (2026-08-14 user direction, wishlist) —
        all three parts resolved:
        1. **Amount as an input** — answered explicitly rather than
           built: `.bo-amount` is a `<span>`, read-only display, on
           purpose (its nested `__currency`/`__fraction` parts can't live
           inside a native `<input>` and stay one accessible value). New
           "Editable money" demo shows the actual recommendation: a plain
           `.bo-form-field` + `.bo-input--numeric`, currency named in the
           *label* ("Unit price (USD)"), not invented affix markup —
           explicitly rejected reusing `.bo-quantity`'s parts for this
           (tempting shortcut, but `.bo-quantity__unit` is documented as
           "count, not currency"; would have contradicted that on sight).
        2. **Quantity as a table column** — new demo, a real 2-row
           `__col--numeric` cell (whole-count + fractional-unit rows),
           verified live: buttons increment correctly inside the table
           context, no overflow.
        3. **Mixed currencies in one table** — the genuinely open
           question. Built a real 4-row table ($, SGD, ¥, BHD) and
           measured live (not eyeballed): every row's `__value`
           `getBoundingClientRect().right` lands at the identical pixel
           (1303px in the tested viewport) regardless of affix width —
           `__col--numeric` right-align + tabular figures already solve
           this; **no dedicated fixed-width affix sub-column needed**.
           This closes the question the item raised rather than leaving
           it a guess. Cross-linked from Quantity's table-column demo.
        Zero new CSS/JS surface — three real docs additions, one of them
        (mixed-currency alignment) backed by a live measurement, not an
        assumption. Verified both themes via Podman; gates unaffected.
17. [x] **Standardize: Amount's "In a column" demo wasn't using
        `Demo.astro`** (dispatched after 4 Continue rounds) — an Explore-
        agent scan of the Amount/Quantity docs cluster (items 14-16) found
        one real gap: the pre-existing "In a column" section was raw
        hand-written markup with no copyable code listing at all, unlike
        every sibling section (including "Mixed currencies," added
        directly above it this session, which made the inconsistency
        newly visible sitting right next to it). Converted to
        `<Demo code={...}>` like the rest — zero visual change, preview
        and code can no longer drift apart. Broader scan (demo-ordering,
        duplicated markup between Amount/Quantity's table-column demos,
        page-shape gate, quantity.css/ts vs. sibling components) came back
        clean — one real finding, fixed, no further instances. 26 tests
        pass (unchanged), gates green.
18. [x] **`forced-colors` (Windows High Contrast Mode) support** — real
        audit run, not just the spike's grep. Focus rings were **already
        correct**: the one global `:focus-visible` rule (`reset/index.css`)
        already uses a real `outline`, not `box-shadow` — nothing to fix
        there. The audit found 5 real gaps, all sharing the same shape
        (background/box-shadow is the ONLY boundary, no real border) and
        all fixed the same way (a scoped `@media (forced-colors: active)`
        block adding a real `border`/`border-color` in a CSS System Color
        keyword — `ButtonText`/`CanvasText` — so it adapts to whatever
        palette the user's OS high-contrast theme uses, never hardcoded):
        - `.bo-btn` — solid/ghost/danger variants have `--bo-btn-border:
          transparent`, relying entirely on the fill.
        - `.bo-badge` — no border in any variant, ever (color-only status
          tint) — same problem the existing `@media print` block already
          solved for print; same fix, forced-colors version added
          alongside it.
        - `.bo-dialog` / `.bo-offcanvas` — both `border: none` by design
          (shadow-only edge look); their panel would have NO boundary
          against the page under forced-colors, since `box-shadow` isn't
          rendered in that mode at all.
        - `.bo-data-table tr[data-row-state="error"]` — the existing
          "non-color channel" for error rows is drawn with `box-shadow`,
          which would silently disappear under forced-colors, defeating
          the exact thing that CSS comment says it's for. Swapped to a
          real `border-inline-start` inside the forced-colors block only
          (kept `box-shadow` for normal rendering, unchanged).
        Checked and found ALREADY correct (no fix needed): `.bo-dropdown__menu`
        and `.bo-alert` both already have real borders, not just shadows.
        **Verification method:** this environment's Chrome automation
        cannot literally toggle `forced-colors: active` (no CDP media-
        feature emulation surface, no OS-level Windows HCM available) —
        same class of limitation as VoiceOver/NVDA earlier this session,
        flagged honestly rather than claimed. Verified instead by
        temporarily injecting the exact same rules under an always-true
        selector (not gated behind the media query) and screenshotting
        live: buttons/badges/dialog/data-table error row all render a
        correct, visible boundary. **NEEDS-RUNTIME:** a final pass on
        real Windows High Contrast Mode or a browser capable of true
        `forced-colors` emulation remains open — the CSS is spec-correct
        (`box-shadow` is documented as not rendered under forced-colors;
        borders/outlines are) but hasn't been seen under the real feature.
        Zero visual change to normal rendering (media-gated); contrast
        gate, stylelint, and 30 tests all pass unchanged.
19. [x] **Inline validation summary** — shipped for real (the worktree
        spike itself was discarded, per the Explore playbook). New pattern
        page `/patterns/validation-summary` + `initValidationSummary()`
        (`packages/core/src/js/behaviors/validation-summary.ts`): on a
        `[data-validation-summary]` form submit, if invalid, prevent
        submission, list every invalid field (label text + `#fieldId`
        link) in a `[data-validation-summary-box]` (`.bo-alert
        bo-alert--danger`, zero new CSS), move focus to the summary first
        — WCAG/GOV.UK precedent — and each link click focuses its field.
        3 new tests (33 total, pass).
        **Two real bugs live verification caught that the spike/jsdom
        tests didn't:**
        1. `:invalid` also matches a `<fieldset>` wrapping an invalid
           control in real browsers (not present in jsdom's simpler
           `<div>`-only test markup) — the summary was listing the
           fieldset itself as an unlabeled "Field". Fixed by scoping the
           query to `input:invalid, select:invalid, textarea:invalid`.
        2. This docs site boosts forms via `hx-boost="true"` on `<body>`
           (same as links) — htmx's own submit interception raced this
           behavior's, fetching and swapping `#main-content` with a fresh
           (pristine, summary-hidden) copy of the page right after our
           handler correctly showed the summary, silently wiping the
           validation state. Fixed with `hx-boost="false"` on the demo
           form (same pattern already used for `#toc-nav`); documented as
           a real integration note on the pattern page itself, since any
           htmx-boosted app using this behavior would hit the identical
           bug.
        Re-verified after both fixes: exactly 3 fields listed (no
        fieldset), focus lands on summary, link click focuses the exact
        field, survives the boosted page, both themes correct. Gates
        green, 20 component pages / 47 total pages built.
20. [x] **Density-aware icon sizing** — Explore idea, evaluated and fixed
        directly (small, unambiguous CSS-only change; no worktree
        ceremony needed — no interaction-model uncertainty the way
        RF-scanner/validation-summary had). Audited every icon-sizing
        rule in the codebase for a `rem`-vs-`em` mismatch (the actual bug
        shape this idea was chasing): found and confirmed exactly one,
        `.bo-sidebar-nav__icon`'s `inline-size: 1.125rem` — measured live
        (not assumed) that it stayed a fixed 18px across all three
        density tiers while the sibling label's font-size correctly
        ranged 13px (compact) → 14px (comfortable) → 16px (spacious), a
        real, visible disproportion. Fixed: `1.125rem` → `1.3em`, which
        inherits the link's own `--bo-density-font-size` and now measures
        16.9px → 18.2px → 20.8px across the three tiers — proportional,
        not fixed. Checked and left alone: `.bo-state__icon` (`font-size:
        2rem`, a large centered empty/error-state illustration, not list
        content — deliberately NOT density-scaled, same reasoning a hero
        graphic wouldn't shrink); `.bo-btn--icon` (already fully
        density-aware via `--bo-btn-height`/`--bo-density-font-size`);
        `.bo-widget__toggle-icon` (no explicit size, inherits contextual
        font-size already). Stylelint, contrast gate, page-shape gate,
        and 33 tests all pass unchanged (CSS-only, no new class).
21. [x] **Date field (display)** — shipped for real (the worktree spike
        itself was discarded, per the Explore playbook). `.bo-date`
        (`packages/core/src/css/components/date/date.css`, scaffolded via
        `new:component`) — the Amount/Quantity counterpart for dates:
        `__value` (app-formatted absolute date) + optional `__relative`
        (muted, small — "in 7 days", "Overdue by 4 days"), one modifier
        `--overdue` (two-channel like Amount's `--negative` — "Overdue" is
        in the text, color only adds the hue). Editing stays a plain
        native `<input type="date">` — no `--input` variant, same
        reasoning as Amount. **No `--muted` modifier**, on purpose — the
        spike caught that it would have exactly duplicated the existing
        `.bo-u-text-muted` utility; the docs page demonstrates composing
        the utility directly instead. Zero new colour pairing (reuses
        `--bo-color-danger-text`). New docs page `/components/date` — 7
        demo sections (basic, today, overdue, muted-via-utility, editable
        input, table column, markup), 21 component pages now gate-verified
        (page-shape). Verified live via Podman: all demos render
        correctly in both themes, spacious density carries through
        consistently, overdue red + text both present. 33 tests pass
        (unchanged — no JS), gates green.
22. [x] **Standardize: 4-tick scan across items 9a/18/19/21** (dispatched
        after 4 Continue rounds) — audited the new behaviors
        (`initScanInput`/`initValidationSummary`) against the established
        shape, demo-section ordering on the 3 new pages, consistency of
        the 5 new `forced-colors` blocks, sidebar placement, and the
        page-shape gate. **Clean pass — nothing to fix.** Every new
        behavior matches the existing document-delegation shape exactly;
        every new demo section renders live before its code; the
        `data-table`'s `CanvasText` stripe (vs. the other 4 files'
        `ButtonText` panel border) is a deliberate, correct distinction
        (a status-marker stripe vs. a widget boundary), not drift; sidebar
        entries are positioned consistently with siblings. Gates green,
        33 tests unchanged. A genuinely clean Standardize round is itself
        a useful signal — the last several Continue rounds held the line
        without accumulating debt.

## Slice 7 (candidate) — docs IA, device coverage, component tiers, pattern gallery

Triaged 2026-08-15 (user direction, wishlist — five distinct asks, logged
together since they're related but NOT all equally ready to build). None
of this is scoped enough to dispatch a Continue round yet — several items
are genuine open design questions the still-pending **Objective review
(`/round-table`)** should weigh in on before committing an approach,
flagged per-item below. Where a question was answerable by reading the
current codebase rather than guessing, answered inline.

1. [x] **"Data type" docs section** — shipped. New top-level "Data
       display" sidebar group (`Gallery.astro`, between Components and
       Patterns) containing Amount/Quantity/Date, pulled out of the
       alphabetical Components list. Mechanical change, zero new CSS/JS
       — same `sections` array feeds both the desktop sidebar and the
       mobile off-canvas drawer, so both stay in sync automatically.
       Verified live via Podman: boosted nav to `/components/amount`
       correctly highlights "Amount" under the new "Data display"
       heading (`aria-current` sync unaffected), both themes render
       correctly, page-shape gate still passes (21 pages — the gate
       checks link presence, not which sidebar group it's under). 33
       tests unchanged. **"Any other?" candidates for the same family,
       NOT built** — need a real ERP use case each before scoping:
       Percentage (rate/ratio, distinct from Amount's currency framing),
       Duration (elapsed/remaining time), Boolean/flag display (likely
       just a Badge composition), File size.
2. [ ] **Device/platform coverage — Web / Mobile (app) / RF / Tablet
       (Bento UI / app)** — real open question, needs Objective input:
       does this mean (a) auditing + documenting how EXISTING components
       already respond via density + container queries across these four
       device archetypes (cheap, mostly verification — similar to the
       Slice 6 responsive-audit item), or (b) genuinely separate
       device-specific component variants/demos (expensive, real new
       surface, risks fragmenting "one component, many settings")? RF is
       partially precedented already (scan-input + goods-receipt
       pattern, Slice 6 item 9a) — that's the one device archetype with
       real shipped groundwork. Don't scope the rest until (a) vs (b) is
       decided. Accept: draft only, refine after Objective review.
3. [ ] **Simple -> Advanced component tiers** — Simple Table -> Advanced
       Table, Simple Card -> Advanced Card, Process Bar, Filter Control.
       Checked the current codebase rather than assuming: `.bo-data-table`
       already has a two-tier shape (`initDataTables()` basic selection
       vs. opt-in `initDataGrid()` ARIA-grid keyboard nav) — the "simple
       -> advanced" framing may already exist for tables and just need
       better docs framing, not new code. `.bo-widget` (filed under
       "Dashboard") is functionally the card primitive today but isn't
       discoverable as "Card" — worth a docs/naming pass, NOT a rename
       (would break the shipped class). `.bo-filters`/`.bo-filter-bar`
       already exist — "advanced" filter control (saved views, multi-
       condition builders?) needs a concrete use case before scoping.
       "Process Bar" is new — distinct from the existing `.bo-stepper`
       (discrete named steps) — likely a continuous progress/percentage
       indicator; needs a real ERP scenario (import job progress? budget
       consumption?) before designing. Accept: draft only per sub-item;
       each needs its own Accept criteria once scoped individually — this
       entry is a container, not one buildable unit.
4. [ ] **Demo layout: side-by-side vs. stacked** — real, answerable-now
       question. **Current state (checked, not assumed):** every demo is
       already stacked (`Demo.astro` / `.demo-pair` — preview on top,
       code below, `flex-direction: column`) — the user's "demo on top,
       follow technical" option is what's shipped today. Side-by-side
       (demo left / code right, one row per variant) is NOT implemented.
       Worth a real trade-off note: side-by-side uses the wide desktop
       viewport better (every screenshot this session shows a ~700-900px
       content column in a 1440-1600px window, wasted margin), but
       degrades on narrow/tablet viewports where it would need to
       collapse back to stacked anyway (a container-query candidate, not
       a media-query one — consistent with the rest of the framework).
       Needs a live side-by-side prototype on 2-3 real component pages to
       judge before converting all of them — a good candidate for a
       Continue round once picked up (not a full redesign in one sitting).
       Accept: prototype `Demo.astro` with a container-query-driven
       side-by-side layout on ≥2 pages, verified live at both wide and
       narrow widths before deciding to roll out further.
5. [ ] **Patterns gallery expansion across device archetypes** — Login,
       Landing, App Launch, Bento UI, Boardroom, App Style 1/2, Report,
       Output Form, Dashboard, etc. Large scope, genuinely needs
       Objective-level prioritization (which patterns are highest-value
       for an ERP audience, which device targets matter most) before
       queuing individual Continue rounds — don't build speculatively
       off a bare list. Some overlap with existing patterns worth
       checking first before treating as new: `/patterns/reporting-
       dashboard` (~ Dashboard), `/patterns/settings-admin` (~ App Style),
       `/patterns/invoice-list` (~ Report/Output Form family). Accept:
       draft only, refine after Objective review — do not start building
       from this raw list without re-checking against what already ships.

**This Slice 7 candidate list is exactly what the Objective review
(`/round-table`) is for** — five real directions, different readiness
levels, real trade-offs neither guessed nor ignored. Items 1 and 4 (data
section, demo layout) are concrete enough to Continue-dispatch without
further review; items 2, 3, and 5 need it before scoping further.

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
- [ ] Component depth: data-grid virtualization hooks, tree/nav for deep
      ERP hierarchies. (Amount field and command palette pulled forward
      into Slice 5; date-field graduated into Slice 6 item 21.)
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
