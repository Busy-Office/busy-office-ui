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

## Done — Slice 6: Component depth + a11y hardening (published as 0.1.x on 2026-08-15)

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
6. [x] **npm publish** `@busy-office/ui@0.1.x` — DONE 2026-08-15: `0.1.0`
       published by the owner (busy-office org, 2FA), verified via clean-room
       registry install. Follow-up shipped same day: Trusted Publishing
       pipeline (`.github/workflows/publish.yml`, OIDC + provenance) and a
       staged `0.1.1` metadata patch (repository-URL fix). **0.1.1 released
       2026-08-15** via the pipeline's first run: owner registered the
       Trusted Publisher, release v0.1.1 cut, publish.yml green — npm now
       serves 0.1.1 with SLSA provenance and the corrected repository URL.
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
   - [x] **9c. High-contrast warehouse-floor mode** — genuinely NOT
         addressed by this spike, and turned out to be broader than
         RF-scanner: the codebase has **no `forced-colors: active` /
         Windows High Contrast Mode handling anywhere** (checked — zero
         matches across all component CSS). That's a pre-existing gap
         across the whole library, not something specific to warehouse
         screens, so scoping it as an RF-scanner sub-item would have been
         wrong — split out as its own item (18), done there. This
         checkbox was left stale after item 18 shipped — fixed while
         doing Roadmap hygiene, not a re-open.
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

## Done — Slice 7: docs IA, device coverage, component tiers, pattern gallery

Triaged 2026-08-14 (user direction, wishlist — five distinct asks, logged
together since they're related but NOT all equally ready to build); item 6
added 2026-08-15 via the Explore fallback (backlog + Ideas seed list both
empty — generated from the Long-term backlog's own "Localization/RTL
audit" note, same shape as the other five).

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
2. [x] **Device/platform coverage** — closed via the 2026-08-15 Objective
       review (project design panel, see `.roundtable/grill-slice7-
       scoping-2026-08-15.md`); superseded by Slice 9 items 1 and 3 below
       (device/platform audit doc + `bo:scan` live-region fix). Panel
       verdict was unanimous: option (a), document existing density +
       container-query coverage, not device-specific component variants.
3. [x] **Simple -> Advanced component tiers** — closed via the 2026-08-15
       Objective review; split into four independently-scoped items,
       superseded by Slice 9 items 2 and 4 below (table-tiering docs,
       Card discoverability fix — both ready now) plus two parked items
       (Filter Control "advanced", Process Bar — both need a real cited
       ERP scenario before design starts, not scoped as of this review).
4. [x] **Demo layout: side-by-side vs. stacked — prototyped, NOT rolled
       out further yet** (pending a decision, not blocked). Shipped an
       opt-in `layout="row"` prop on `Demo.astro`: unset stays the
       original stacked layout untouched everywhere; `layout="row"` adds
       a `.demo-pair--row` class that only activates inside a new
       `@container bo-demo (min-width: 34rem)` rule (`section.demo` is
       now a named container) — narrower than that, or the default case,
       renders exactly as before. Tried on 4 real demos across 2 pages
       (`/components/badge` both sections, `/components/amount`'s
       "Money" and "Precision" sections) — deliberately picked one short
       single-line case and one taller multi-example case to see both
       ends. Verified live: wide (1440px, both themes) shows a clean
       two-panel layout, code panel gets its own border/background/
       padding (previously bare/unstyled — a real gap in the original
       stacked design, now fixed for the `--row` variant) with
       `overflow-x: auto` for lines wider than the panel; forced-narrow
       (isolated 320px container, this session's usual workaround)
       collapses back to the exact original stacked appearance,
       confirmed pixel-for-pixel comparable.
       **Real trade-off found live, not assumed — this is why the Accept
       criteria asked for a prototype before a rollout decision:**
       side-by-side reads well when the preview and code are similar
       heights ("Money", "Tones"), but when code is much taller than the
       preview (Amount's "Precision" section — 3 commented examples vs.
       one line of visual output), `align-items: stretch` stretches the
       short preview panel to match the tall code panel's height,
       leaving visible dead space on the left. Not a bug — a genuine
       per-demo judgment call (some demos suit side-by-side, some don't),
       which argues AGAINST a blanket site-wide rollout and FOR keeping
       this as a per-`<Demo>` opt-in exactly as built, used selectively
       where the two panels are naturally similar heights.
       **Decision on further rollout deliberately left open** — the
       prototype answers "does the mechanism work," not "which of the
       ~90 existing `<Demo>` call sites should use it," which is a
       page-by-page editorial call, not something to blitz through
       mechanically. 33 tests pass (unchanged, no JS), gates green.
5. [x] **Patterns gallery expansion across device archetypes** — closed
       via the 2026-08-15 Objective review; superseded by Slice 9 items 5
       and 6 below (Login pattern, App Launch pattern — both scoped and
       ready now). Panel cross-checked all ~10 proposed archetypes against
       the 9 already-shipped pattern pages: Dashboard/Report overlaps
       `/patterns/reporting-dashboard`, App Style overlaps `/patterns/
       settings-admin`, Output Form overlaps `/patterns/invoice-list` —
       marked satisfied, not rebuilt as new. Boardroom and undifferentiated
       "App Style 1/2" cut — no testable Accept criterion, vague labels
       rather than scoped work; can be re-opened if a concrete shape like
       App Launch's reference screenshots ever grounds one of them.
6. [x] **Localization/RTL audit** (dispatched via the Explore fallback —
       backlog and Ideas seed list both empty, generated from this
       Long-term backlog's own note, same pattern as item 21's date-field)
       — verification-only round, zero code changes needed. Mechanical
       scan first: `grep` for physical CSS properties (`margin-left`,
       `padding-right`, bare `left:`/`right:`, `text-align: left/right`)
       across every component AND the docs shell (`Gallery.astro`) —
       **zero matches**, confirming the "logical properties throughout"
       claim was actually true, not just asserted. Live verification
       (`dir="rtl"` toggled on real pages, not assumed from the grep
       alone): the **entire app shell mirrors correctly** — sidebar
       flips to the right, TOC to the left, navbar brand/hamburger swap
       sides, breadcrumb reads right-to-left — with **zero shell-specific
       RTL CSS**, purely from consistent logical-property use throughout
       the shipped package. Confirmed the two places that already HAD
       deliberate `[dir="rtl"]` overrides actually work: `.bo-select`'s
       chevron (background-position has no logical keyword, needs an
       explicit physical flip — computed style confirmed it resolves
       correctly under RTL) and `.bo-offcanvas`'s slide-in animation
       direction.
       **One genuine open question surfaced, documented rather than
       silently "fixed":** `.bo-data-table__col--numeric` uses
       `text-align: end`, so numeric/currency columns visually flip to
       LEFT-aligned under RTL — technically correct logical-property
       behavior, but real-world RTL accounting/ERP UIs often keep
       monetary columns visually right-aligned as a numeral convention
       distinct from prose direction. This is a genuine market/product
       decision this session can't authoritatively make (varies by
       target market), not a bug — flagging for whoever has real RTL-market
       requirements, not changing behavior speculatively.
       No CSS/JS changed; 33 tests unchanged, gates unaffected (nothing
       to rebuild).

**All six items now closed.** Items 1, 4, and 6 (data section, demo
layout, RTL audit) were concrete enough to Continue/Explore-dispatch
without further review. Items 2, 3, and 5 (device coverage, component
tiers, patterns gallery) needed the Objective review before scoping
further — got it 2026-08-15 (see `.roundtable/grill-slice7-
scoping-2026-08-15.md`), and their outcome is the six scoped items in
Slice 9 immediately below.

## Done — Slice 8: editable table, multi-select dropdown, searchable dropdown

Triaged 2026-08-15 (user direction, wishlist — three concrete component
asks). Unlike Slice 7 items 2/3/5, these describe specific buildable UI
controls rather than open-ended device/pattern-gallery questions — checked
the current codebase for each before scoping rather than assuming a gap,
per dispatcher discipline. All three shipped same-day across three Continue
rounds, smallest-scoped first, each verified live before moving to the next.

1. [x] **Editable table (inline change)** — shipped. New "Multi-row inline
       edit — dirty state + save/cancel" section on `/components/data-table`,
       composed from existing primitives (`.bo-input--seamless`, badge,
       button) plus one small opt-in behavior: `data-row-edit` +
       `initRowEdit()` (`packages/core/src/js/behaviors/row-edit.ts`).
       Typing in a row sets `data-row-state="dirty"` on the `<tr>` — reuses
       the SAME visual channel the existing error-row state uses (amber
       tint + start border instead of red, `--bo-color-warning-subtle`,
       already contrast-checked) — and reveals that row's "Unsaved" badge +
       Save/Cancel. Cancel resets inputs to `defaultValue`; Save dispatches
       `bo:row-save` (bubbling, `{row, rowId}`) and clears dirty state —
       persistence is the consumer's code, this behavior only tracks state.
       3 new behavior tests (36 total, all pass); contrast/stylelint/build
       gates green; verified live via Podman (`--no-cache` rebuild, 48
       pages / 2417 links) in both themes — light and dark both render the
       dirty tint/badge/buttons correctly — and at a narrow (390px) isolated
       container width (table reflows without overflow or clipped buttons).
       **Real bug found and fixed along the way, not pre-existing scope**:
       inline `<script type="module">` blocks embedded mid-page silently
       fail in the built site (bare npm specifiers aren't browser-resolvable
       without an import map; Astro only bundles untyped `<script>` tags,
       not `type="module"` ones) — the adjacent `initDataGrid()` demo had
       the same latent bug. Fixed by consolidating all three demo behaviors
       (`initDataTables`, `initDataGrid`, `initRowEdit`) into the one
       untyped `<script>` block that Astro actually bundles, rather than
       one broken inline script per demo section.
2. [x] **Multiple-selections dropdown** — shipped. `data-multiselect` on
       `.bo-dropdown__menu` + real `<input type="checkbox">` items (each
       wrapped in a `<label class="bo-dropdown__item">`, not a button) —
       deliberately **not** a `.bo-dropdown--multiselect` CSS modifier or a
       hand-rolled ARIA listbox, since native checkboxes already carry full
       keyboard (Tab + Space) and screen-reader semantics for free.
       `initDropdowns()` (no new init function) now: skips close-on-select
       when the menu has `data-multiselect`, and updates the trigger's
       label from `data-multiselect-label` + a live checked count ("Cost
       center" → "Cost center (2)") on `change`. Checked items get the
       same `--bo-color-bg-selected` tint the data-table uses for selected
       rows — already a checked contrast pair, no new one needed.
       **Deviated from the Accept text on one point, deliberately**: no
       custom arrow-key roving-tabindex — re-checked the existing dropdown
       behavior while building this and it never had that (menu items are
       plain Tab stops, no keydown handler in `dropdown.ts`), so there was
       no existing "roving-focus shape" to match; native checkbox Tab+Space
       is simpler and equally accessible, so left it at that rather than
       building new keyboard-nav machinery no other menu on the page has.
       37 behavior tests total (33 baseline, +3 for row-edit, +1 here),
       all pass; contrast/stylelint/build gates green; verified live via
       Podman (`--no-cache`) in both themes.
3. [x] **Searchable dropdown** — shipped as a new `.bo-combobox` component +
       opt-in `initCombobox()` behavior
       (`packages/core/src/js/behaviors/combobox.ts`), implementing the
       WAI-ARIA APG combobox pattern (single-select, list autocomplete):
       `role="combobox"` input + `role="listbox"` popup, type-ahead
       (case-insensitive substring match) narrows the visible options,
       ArrowDown/Up move `aria-activedescendant` across the filtered set
       only, Enter commits and dispatches `bo:combobox-select`
       (`{value, text}`). The listbox is a real `[popover]` — same top-layer
       reasoning as `.bo-dropdown__menu` — so Escape and click-outside close
       it without touching the field's value **at no extra cost**: verified
       live that a direct `hidePopover()` call (simulating native Esc/
       light-dismiss) fires the `toggle` event asynchronously, which the
       behavior's `toggle` listener catches to resync `aria-expanded` and
       clear the active option — no code needed beyond that one listener.
       New docs page `/components/combobox`, linked from the sidebar and
       from Dropdown's demo-note (this vs. multi-select — different job).
       No new contrast pairs needed — the active-option highlight reuses
       `--bo-color-bg-selected`, already checked.
       **One implementation note for future maintainers**: initially wrote
       state checks against the `:popover-open` CSS pseudo-class (matching
       a natural read of the Popover API), but that pseudo-class isn't
       implemented in jsdom (the test runtime) and threw on `.matches()` —
       switched to tracking open/closed via a plain `data-bo-open` attribute
       set by our own `open()`/`close()` helpers instead, which is both
       testable and avoids a dependency on the runtime's CSS selector
       support for a value the code already knows internally.
       42 behavior tests total (37 + 5 here), all pass; contrast/stylelint/
       build gates green; verified live via Podman (`--no-cache`) in both
       themes and at a 390px isolated container width (filtering, arrow-key
       nav, and Esc/light-dismiss resync all confirmed working against the
       real, non-cloned demo widget — a `cloneNode`-based narrow-width test
       harness hit a one-off `showPopover()` hiccup specific to cloned
       popover nodes, not a real usage pattern, so not treated as a
       product bug).

**Slice 8 is now complete — all three items shipped, verified live,
committed.** No further Continue rounds queued for this slice.

## Done — Slice 9: from the Slice 7 Objective review (all 11 items)

Direct output of the 2026-08-15 design-panel review (`.roundtable/grill-
slice7-scoping-2026-08-15.md`) — originally six independently-scoped items
replacing Slice 7's three blocked entries; items 7-10 added same-day from
a follow-up user wishlist ("advance table": search, filter, columns,
export, settings, pagination, grouping, subtotal/total) plus its reference
screenshot. Checked every sub-ask against what's already shipped before
scoping anything new — search/filter/sort were already covered, item 7
(columns + export) was the genuinely new, concretely-scoped part and is
now shipped. Items 1-4 and 7 shipped (see below); item 5-6 are ready to
Continue-dispatch (no open design questions); items 8-10 (grouping,
subtotal/total, load-more pagination) are drafted but need either a
concrete scenario or further scoping before building; "Settings" is
flagged as ambiguous, not guessed at. **Process Bar** stays
parked pending a real cited ERP scenario, per the panel's explicit
recommendation not to build speculatively.

1. [x] **Device/platform coverage audit** — shipped, verification-only
       (zero CSS/JS, 44 tests unchanged, same shape as Slice 7 item 6's
       RTL audit). New "Device/platform coverage" section on `/concepts/
       density`: a table mapping each archetype (Web, Mobile app, Tablet/
       Bento UI, RF/warehouse) to the existing mechanism that already
       covers it, with a live-example link per row (`/components/
       data-table`, `/components/dashboard`, `/patterns/goods-receipt`).
       Confirms the Objective review's finding live rather than just
       asserting it: Tablet-Bento is explicitly framed as the SAME
       `bo-widget-grid` container-query mechanism as Dashboard, not a
       separate component, and cross-referenced forward to the queued App
       Launch pattern (item 6) rather than treated as independent. RF is
       the one archetype confirmed to have genuinely needed new work
       (`initScanInput()`, not just a density setting). **[HUMAN CALL]
       carried forward, not resolved by this audit**: whether RF/Mobile/
       Tablet are real target markets worth more investment — noted
       explicitly on the page itself, not silently dropped. Verified live
       via Podman (`--no-cache`) in both themes; all four cited links
       resolve (confirmed both by the build's link checker and by reading
       their `href`s live).
2. [x] **Table tiering docs framing** — shipped, docs-only (zero CSS/JS
       changed, 44 tests unchanged). `/components/data-table`'s demo-note
       now names the two tiers up front ("Simple... covers selection/sort/
       filter for free; reach for Advanced... only when a screen genuinely
       needs full two-axis keyboard navigation — most tables don't"); the
       previously-unlabeled first demo section got an explicit "Simple —
       select, sort, filter" heading; "Keyboard grid navigation" retitled
       to "Advanced — keyboard grid navigation" with its intro paragraph
       naming the tier and the "when to reach for it" guidance. Verified
       live via Podman (`--no-cache`) in both themes.
3. [x] **`bo:scan` live-region announcement** — shipped. Opt-in markup
       contract: link the scan input's `aria-describedby` to a
       `data-scan-status` element (`aria-live="polite"`, visually hidden
       via the existing `.bo-visually-hidden` primitive) — `initScanInput()`
       (`packages/core/src/js/behaviors/scan-input.ts`) writes "Scanned
       {value}" to it on every successful scan. Fully backward compatible:
       an input without `aria-describedby` behaves exactly as before
       (verified with a dedicated test). Wired into `/patterns/
       goods-receipt`'s live demo. 2 new behavior tests (44 total, all
       pass); contrast/stylelint/build gates green (no new CSS — reused
       the existing visually-hidden primitive); verified live via Podman
       (`--no-cache`) in both themes: dispatched real scan events,
       confirmed the status text updates and re-announces on a second
       scan, confirmed zero visual change (region is invisible by design).
4. [x] **Card discoverability fix** — shipped, docs-only (no class rename
       — `.bo-widget`'s shipped contract is untouched). Went with the
       cross-link + alias option rather than a whole new page (a real
       second page would either duplicate `.bo-widget`'s `ClassRef`/
       `ApiTable` entries against the same CSS component — a drift risk
       — or need a `PAGE_SLUG` alias hack for something that isn't
       actually a distinct concept). New sidebar entry "Card" → `/components/
       dashboard#card` (Gallery.astro); demo-note now leads with
       *"Looking for a 'Card'? `.bo-widget` is it"* linking straight to
       the existing "Widget parts" section, which is now titled with an
       `id="card"` anchor and opens with *"`.bo-widget` is the framework's
       card primitive."* Verified live via Podman (`--no-cache`) in both
       themes: sidebar link present with the correct href, direct
       navigation to the anchored URL lands exactly on the reframed
       section (confirmed via a fresh navigation, not a JS reload —
       reload() doesn't reliably re-trigger native anchor-scroll, a test
       artifact rather than a site bug). Link checker confirmed fine with
       the `#card` fragment (strips fragments before validating). 44
       tests unchanged, page count unchanged (49 — no new page), 2564
       links (+48, one new sidebar entry × pages).
5. [x] **Login pattern** — shipped (`/patterns/login`, zero new CSS).
       A centered `.bo-widget` card (the Card primitive, cross-linked to
       the Slice 9 item 4 alias) with email/username + password fields
       carrying the correct `autocomplete="username"`/`"current-password"`
       tokens, the existing validation-summary pattern for errors
       (`initValidationSummary()` — verified live: empty submit lists
       both fields and moves focus to the summary first), and a "details
       that matter" section covering server-error recovery (say which
       ACTION failed, never which field — credential enumeration),
       lockout messaging, and never blocking paste. Sidebar entry added
       (top of Patterns group); `Related` links added on `/components/
       form` and `/patterns/validation-summary`.
       **Real component finding surfaced by building this** (exactly what
       the pattern-page bar is for): `.bo-widget` is a size container
       (`container-type: inline-size`), so used standalone outside a
       `.bo-widget-grid` it needs an explicit `inline-size` — with only a
       `max-inline-size` it collapses to ~1px (size containment means
       width can't come from content). Found live on first render, fixed
       with `inline-size: 100%`, and documented as a comment in the
       pattern's markup block so the next consumer doesn't rediscover it.
       Worth considering a docs note on the Card/dashboard page too if it
       bites again. Verified live via Podman (`--no-cache`) in both
       themes and at a 390px isolated container width; 48 tests
       unchanged.
6. [x] **App Launch pattern** — shipped (`/patterns/app-launch`, zero new
       CSS — the "genuinely new grid-tile primitive" contingency was NOT
       needed). Matches the reference screenshots' shape: a "Favourites"
       icon-tile grid (tiles are plain `<a class="bo-widget">` links —
       initials-as-icon, `aria-hidden` on the decorative initial so the
       accessible name is the label), a category tab row (the ordinary
       tabs pattern, one `.bo-widget-grid` per panel — verified live that
       switching tabs swaps grids correctly), and "folder" tiles (a
       widget whose face previews members as `aria-hidden` badges — one
       link, one navigation; deliberately NOT a hover-expanding stack).
       Also closes item 1's Tablet-Bento precedent gap as planned:
       verified live at a 390px isolated container that the SAME
       `bo-widget-grid` container query reflows the tile grid to two
       columns — no launcher-specific responsive code. Sidebar entry
       added; `Related` links to Card/tabs/container-queries/density.
       Verified live via Podman (`--no-cache`) in both themes; 48 tests
       unchanged.

7. [x] **Advanced table toolbar — column visibility + export** — shipped.
       Triaged 2026-08-15 (user wishlist "advance table / search" + a real
       screenshot of an ERP case-management list view). Checked the
       screenshot against what's already shipped rather than assuming a
       gap: the search input, removable filter chips (`Assignee:
       Unassigned ×`), sortable column headers (`aria-sort`), and status
       badges were **already covered** by `.bo-filter-bar`/`.bo-chip`
       (`/components/filters`) and `.bo-data-table`'s existing sort
       contract — not rebuilt. Two things in the reference genuinely
       didn't exist yet, now shipped: new opt-in `initTableToolbar()`
       behavior (`packages/core/src/js/behaviors/table-toolbar.ts`) —
       **Columns** (`data-col-toggle` on a checkbox inside the existing
       multi-select dropdown pattern from Slice 8 item 2, `data-col` on
       matching `<th>`/`<td>`; toggling shows/hides every cell with that
       value, scoped to its `.bo-data-table-container`) and **Export**
       (`data-table-export` button dispatches `bo:table-export`
       `{format}` — this behavior only tracks intent, generating/
       downloading the file is the consumer's code, same split as
       `bo:row-save`/`bo:scan`). Zero new CSS — fully composed from
       existing dropdown/checkbox/button primitives. New "Toolbar —
       column visibility & export" section on `/components/data-table`.
       4 new behavior tests (48 total, all pass); verified live via
       Podman (`--no-cache`) in both themes — unchecking a column hides
       it cleanly (header + every row), Export fires with the configured
       format, trigger label reflects the live count.

8. [x] **Table row grouping** — closed, together with item 9, via the
       dogfood loop rather than new code. The "needs a real cited ERP
       scenario" gate was satisfied the honest way: built the canonical
       grouped view ("Spend by cost center" — POs grouped by CC with
       per-group subtotals and a grand total) as a real screen in
       `examples/po-app` (`/spend`), using ONLY documented markup, to
       find out whether it composes or fights. **It composes** — better
       than the CSS audit predicted: one `<tbody>` per group, group
       header as `<th scope="colgroup" colspan>` (bold by default,
       correct group-header semantics for AT), subtotal/grand-total as
       ordinary rows with `__col--right`/`__col--numeric`. Verified live
       in both themes. The premature-ARIA-treegrid risk the Objective
       review flagged never materialized because no widget was needed at
       all. Zero new CSS/JS; the deliverable is the new "Grouped rows +
       subtotals" docs section on `/components/data-table` (with the
       real caveats found while building: don't combine with `--striped`,
       regroup server-side rather than sorting across grouped bodies).
       Collapsible groups remain unbuilt — nothing in the scenario needed
       them; if a future screen does, that's the next concrete ask.
9. [x] **Table subtotal / total rows** — closed with item 8 above (the
       two turned out to be one composition, not two components): subtotal
       rows are per-group ordinary rows, the grand total is a final
       single-row `<tbody>`. Documented in the same data-table section;
       proven in po-app's `/spend` screen, both themes, zero new CSS.
10. [x] **Pagination — "pull up to see more" (load-more)** — shipped.
       New opt-in `initLoadMore()` behavior (`packages/core/src/js/
       behaviors/load-more.ts`): a `[data-table-load-more]` button
       dispatches `bo:table-load-more` on click; adding
       `data-load-more-auto` arms an `IntersectionObserver` that fires
       the same event when the button scrolls into view — once per
       approach, so a consumer that fails to append rows doesn't get an
       infinite loop. A disabled button (fetch in flight) neither clicks
       nor auto-fires; guarded for environments without
       IntersectionObserver (jsdom). Behavior tracks intent only —
       fetching/appending is the consumer's code, same split as
       `bo:table-export`/`bo:row-save`/`bo:scan`. Zero new CSS (composes
       with the existing `.bo-data-table__footer`). New "Load more"
       section on `/components/pagination` with a working append demo
       plus a "load-more vs page-numbers: when to use which" note.
       3 new behavior tests (55 total, all pass); verified live via
       Podman (`--no-cache`) in both themes and at a 390px isolated
       container width — two clicks appended four rows live.

**"Settings" — resolved, no new build needed.** Asked the user directly
what the reference screenshot's gear-icon button should open; the answer
was that the screenshot was just a sample to react to, not a spec to
replicate, and the real ask is "general purpose & configurable for
different purposes." That's already this framework's standing answer —
declarative attributes (`data-density`, `data-multiselect`, opt-in
behaviors) ARE the configurability mechanism, not a runtime settings
popup layered on top. A dedicated per-table "Settings" UI would be a
second, redundant way to do what `data-density` already does. No item
added; if a genuinely new *kind* of per-table configuration surfaces
later (something `data-*` attributes can't express), scope it then with
its own real use case, same discipline as every other item here.

11. [x] **Process Bar → `.bo-progress`** — the last parked item,
       graduated and shipped via the same dogfood method that closed
       items 8-9. The named scenario turned out to be one of the two the
       parking note itself hypothesized: **budget consumption** — added
       per-CC budget bars to po-app's `/spend` group headers using bare
       native `<progress>` first, and the evidence was decisive: platform-
       blue chrome ignoring every theme token, both light and dark.
       Shipped `.bo-progress` (`packages/core/src/css/components/
       progress/progress.css`) as CSS-first styling of the NATIVE
       `<progress>` element — value/max semantics and the implicit
       `progressbar` role come from the platform, zero JS/ARIA. Base +
       `--warning`/`--danger` threshold tones, documented as decoration
       on top of required visible text ("93% consumed"), never a
       substitute. Forced-colors reverts to `appearance: auto` (platform
       rendering) rather than losing the fills. Three new non-text 3:1
       contrast pairs added to the gate (WCAG 1.4.11) — which immediately
       caught two real failures: amber-500 on the track was 1.95:1 in
       light (fixed by using `warning-strong`), and dark mode had NEVER
       remapped `--bo-color-warning-strong` (a latent token-tier
       oversight — amber-700 at 2.86:1 on dark muted; fixed with a dark
       remap to amber-500, zero other consumers affected). New
       `/components/progress` docs page (page-shape gate: 23 pages);
       po-app `/spend` upgraded to the shipped class with threshold
       tones. Verified live via Podman in both themes, docs + po-app
       both; 27 contrast pairs × 2 themes + brand presets all pass; 55
       tests unchanged.

**Nothing parked remains.** Every item from every wishlist this project
has received is now shipped, closed as a documented composition, or
explicitly resolved.

## Done — Slice 10: showcase depth grill

Triaged 2026-08-15 (user direction): "grill each component & its doc page
to give enough sample & variation for showcase." Two layers:

1. [x] **Mechanical gap scan** — every class in the generated `api.json`
       diffed against actual usage on its own docs page. Undemoed
       variants found on 6 pages: dialog `--wide`; amount `--block`;
       data-table `--sticky-col` + `__footer` (demoed elsewhere, never
       on its own page); form `--required` + `--seamless` (seamless
       lives on the data-table page only); nav `__spacer`, offcanvas
       `--end`, sidebar `__heading`/`__section`. (dashboard's
       `bo-badge--type` is extraction noise — badge's class.)
2. [x] **Judgment-layer grill** (panel, Consumer seat) — per page: are
       the demos enough to SHOWCASE the component's range (states,
       density behavior, realistic ERP compositions, not just the happy
       path)? Accept: a per-page gap list ranked by showcase value.
       **Done** (commit `fe5c3d8`): per-page gap list produced and
       closed the same round.
**Component gap surfaced by the grill, parked with a scenario**: the
stepper has no rejected/error step state in CSS (only `done`/`current`/
`pending` via `data-state`) — ERP wizards fail steps. The timeline
component HAS a rejected state; whether stepper should mirror it needs a
real failed-wizard scenario before building (same gate as every parked
item). Meanwhile the docs show the supported answer: a returned-for-rework
flow re-marks the step `current`.

3. [x] **Fix rounds** — close the ranked gaps: every documented variant
       demoed on its own page, plus the highest-value state/composition
       samples the grill names. Accept: mechanical scan returns zero
       undemoed classes; each touched page verified live both themes;
       gates + visual baselines updated.
       **Done** (commit `fe5c3d8`): 16 pages, ~20 demos, 2 real defects
       fixed (date `__value` drift; docs drawer hiding embedded demo
       sidebars); mechanical scan returns zero undemoed classes; gates +
       32 visual baselines green.

## Done — Slice 11: CSS icon set

Triaged 2026-08-15 (user, while reviewing App Launch: "can CSS render
icons? for better display"). Answer: yes — `mask-image` with inline-SVG
data URIs painted by `background-color: currentColor` gives real,
THEMABLE icons with zero JS, zero font files, `em` sizing that tracks
density. Initials/emoji were the weak point of the launcher tiles (emoji
don't take `color`; initials read as placeholders).

1. [x] **`.bo-icon`** — SHIPPED. Base class (1em square, currentColor fill via
       mask) + a SMALL curated set (~12 ERP glyphs: document, invoice,
       cart, check-circle, truck, box, chart, settings, grid, barcode,
       building, user), each an original simple geometric SVG authored
       in-repo. Accept: new component + docs page per the recipe
       (mechanism documented as extensible — "add your own glyph in one
       CSS line, or paste inline SVG with fill=currentColor"); a11y note
       (decorative icons aria-hidden, the LABEL carries meaning);
       forced-colors handled explicitly (mask icons vanish under forced
       colors without `forced-color-adjust: none` + a system color —
       verify via CDP forced-colors emulation, not assumption); App
       Launch tiles upgraded from initials to icons; gates + baselines.
       NOT a general icon library — 12 glyphs prove the mechanism;
       more graduate per real need, same gate as everything else.
       **Done**: 12 original geometric glyphs (doc, invoice, cart,
       check-circle, truck, box, chart, settings, grid, barcode,
       building, user) as mask-image data URIs, 1em/currentColor;
       forced-colors opt-out VERIFIED via CDP emulation (adjust:none +
       CanvasText paint, mask intact — not assumed); new `/components/
       icon` page (25 pages, 3094 links, page-shape green); App Launch
       tiles upgraded from initials to icons (demo-note + markup block
       synced); composes with the existing `.bo-sidebar-nav__icon` slot
       and `.bo-btn--icon`. No new contrast pairs (currentColor inherits
       gated text colors). 55 tests unchanged; 32 visual baselines
       regenerated, green twice.

## Done — Slice 12: public feedback intake

Triaged 2026-08-15 (user: "shall we start using linear or github to feedback
the issue?"). Decision: **GitHub Issues** — the package is public on npm and
the npm page links the repo; strangers need a public intake, and issues are
`gh`-triageable by the dispatcher (issue → ROADMAP with Accept criteria →
close with commit link). Linear stays a non-goal: no public intake, and a
second backlog would drift from this file (storage doctrine). Issues are
already enabled on `Busy-Office/busy-office-ui` (verified via API).

1. [x] **Issue templates + docs pointer** — `.github/ISSUE_TEMPLATE/`:
       bug report form (version, browser, light/dark theme, density,
       minimal HTML repro) + feature request form (ERP scenario required —
       matches the "real scenario before building" gate) + `config.yml`
       (blank issues on, docs link). Docs site gets a visible "Report an
       issue" link. Accept: templates render on GitHub's "New issue"
       chooser; docs link verified live at 1440px + 390px, both themes;
       gates green.
2. [x] **Dispatcher intake wiring** — LOOPS.md Step 1 names `gh issue list`
       as a triage input source, so wakes see new issues without being told.
       Accept: LOOPS.md updated; one dry-run triage of the (currently empty)
       issue list recorded in the loop log.
       **Done 2026-08-15** (commits `17f796f`, `52420ce`): forms schema-
       validated (js-yaml) and pushed; `gh issue list` dry run: 0 open.
       Residual: the /issues/new/choose chooser renders client-side and
       github.com is blocked for this session's browser — owner should
       glance at it once (GraphQL `issueTemplates` only reflects legacy
       .md templates, so it can't confirm YAML forms).
3. [x] **npm README** (Explore find, 2026-08-15 post-0.1.1 wake): the npm
       page showed "No README data found!" — npm packs README from
       `packages/core/`, which had none (the root README is repo-facing).
       Consumer-facing `packages/core/README.md` written (install, no-npm
       path, behaviors quickstart, live docs URL, issue link); root README
       de-staled (live Pages URL, slice count). Pack verified: 3.3 kB
       README in the tarball. **Shows on npm at the next release** — no
       0.1.2 cut for it alone; it rides along with whatever ships next.

## Done — Slice 13: axe-core engine audit

Triaged 2026-08-15 (Explore find): first full axe-core scan of all 54 built
docs pages. The hand-built gates (contrast, page-shape, two-channel) held —
but an engine scan caught 7 pages with violations the gates don't model.
Accept for every item: fix applied, axe re-scan of the page returns zero
violations, no visual change (harness green).

1. [x] **scrollable-region-focusable (serious)** — landing `pre` samples ×4
       and colors-page `.bo-data-table-container` ×2 scroll without being
       keyboard-reachable → `tabindex="0"`; document the container rule in
       the data-table canonical markup (keyboard users must be able to
       scroll the table region).
2. [x] **aria-prohibited-attr (serious)** — state-patterns skeleton rows:
       `aria-label` on a plain `div` is prohibited → `role="status"`
       (semantically correct for a loading region anyway).
3. [x] **empty-table-header (minor)** — data-table + dropdown pages: the
       row-actions `th` is empty → `.bo-visually-hidden` label ("Actions").
4. [x] **landmark violations (moderate)** — nav page: the embedded demo
       shell nests a real `<main>` inside `#main-content` (duplicate main
       landmark) → `div.bo-app-shell__main` in demos; filters page: two
       same-label `role="search"` landmarks → unique labels.
5. [x] **Gate candidate — decided: advisory script, not a build gate.**
       `apps/docs/scripts/axe-audit.mjs` (`npm run test:axe -w docs`),
       same class as the visual harness: needs a running :8081 container
       + headless Chrome, so it can't be a hermetic build gate; it runs
       in Standardize sweeps instead. Exits 1 on any violation; 54 pages
       green on adoption day.
**Bonus find while fixing:** the landing hero still said "Not on npm
yet — pre-publish hardening" — post-publish staleness the earlier sweep
missed (it grepped installation.astro, not the landing). Fixed.

## Done — Slice 14: public-contract hardening

From the 2026-08-15 Objective review (`.roundtable/grill-objective-next-arc-
2026-08-15.md`). All four seats voted **Harden**: the public contract lags the
internal discipline. Ordered by severity; confirmed defects first.

1. [x] **Generated README claims + drift gate** (Rex; the "37 kB" claim is
       FALSE — shipped min CSS is 57.4 kB). Size, behavior count, and the
       event list in `packages/core/README.md` stamped from dist at build,
       with a check that fails on drift (same doctrine as every other
       generated surface). Accept: README numbers regenerate; gate red when
       hand-edited; npm copy corrected at next release.
       **Done 2026-08-15**: `stamp-readme.mjs` stamps size/behaviors/events
       into BOTH READMEs from dist (56 kB min / 9.3 kB gz / 16 / 5 events);
       `--check` is now the core build's 8th step, proven red on a
       hand-edit; corrected claim ships to npm with the next release.
2. [x] **JS contract becomes semver surface** (Devi BLOCKER + Rex). The five
       `bo:*` intent events' payload shapes + the 19 exports documented in a
       GENERATED events/API table on the js-behaviors page, and the
       versioning policy amended to name them API (matching the internal
       freeze-audit Breaking rule that CLAUDE.md already carries). Accept:
       table generated from source (like the `.d.ts` gate), versioning page
       lists JS events, `bo:row-save` payload documented beyond a code
       comment.
       **Done 2026-08-15**: structured `@event` JSDoc at every dispatch site;
       `extract-events.mjs` emits `dist/events.json` behind a two-way parity
       gate (dispatched-but-undocumented AND documented-but-not-dispatched
       both red — proven) wired into the core build; exported as
       `@busy-office/ui/events`; js-behaviors page renders the generated
       Intent-events table (payload fields typed + a listener recipe);
       versioning policy amends API to include init/refresh signatures and
       `bo:*` payload shapes with the Breaking rule; palette vars explicitly
       declared not-API (HUMAN CALL #2's recommended default applied in
       docs — owner may veto). En route: fixed an HTML-injection bug where
       `<tr>`/`<input>` in event docs broke the rendered table.
3. [x] **form-field `:has()` source fix** (Kofi; latent). Split the comma
       list into the two separate rules the comment already mandates; correct
       the comment. Accept: dist output equivalent-or-better; a source-level
       note explains why the split is load-bearing.
       **Done 2026-08-15**: explicit forgiving `:is()` wrapper in source
       (better than the split: one block, same guarantee), comment rewritten
       to say the :is() is load-bearing; dist byte-equivalent semantics,
       55 tests + 32 baselines green untouched.
4. [x] **Combobox `aria-controls` collision test** (Rex). Two comboboxes +
       partial swap; fix the reverse lookup if the test reds. Accept: test in
       the behaviors suite either passing against current code or with a fix.
       **Done 2026-08-15**: test went RED against current code (widget #2
       silently drove widget #1 under duplicated ids) — Rex's bug was real.
       Fix: resolution prefers the shared `.bo-combobox` container, with the
       documented id-based lookup kept as fallback; 56/56 tests green;
       CHANGELOG Unreleased Fixed entry per the freeze rules. Live-verified
       by driving the DIST page markup + DIST JS in jsdom (the browser
       extension's CDP session degraded to 45s timeouts mid-wake — noted,
       not retried).
5. [x] **Unlayered-CSS interop recipe** (Kofi HIGH). Tailwind-v3-preflight /
       normalize coexistence: documented recipe (wrap resets in a layer,
       stated layer order for mixed stacks) + a demoed interop page or
       troubleshooting section. Accept: a Tailwind-preflight-style unlayered
       reset demonstrably not nuking `.bo-btn` in the documented setup.
       **Done 2026-08-15**: Troubleshooting gains the recipe (order statement
       first, reset into `layer(app-reset)`, v4-coexists/v3-preflight-off
       notes) + a two-iframe LIVE proof running the identical hostile reset
       — raw frame strips `.bo-btn` (computed bg transparent/0 padding),
       recipe frame renders it fully (accent bg, 16px padding); iframes are
       isolated documents because on the docs page itself a late-declared
       `app-reset` would OUTRANK the framework (the very trap being taught).
       Framework CSS now copied to `public/assets/` at docs build for plain
       linking; symptom row added; cascade page cross-links the sharp edge.
       Verified live 1440 both themes; 32 baselines untouched-green.
6. [x] **No-JS dark decision** (Kofi M-H). `color-scheme: light dark` on
       `:root` ships a docs-app assumption: CSS-only consumers under dark OS
       get light page + dark native chrome. Fix (`:root:not([data-theme])
       { color-scheme: light }` or a real auto tier) + boot-snippet doc in
       installation. Accept: no-JS link-the-CSS page renders coherently under
       dark OS emulation.
       **Done 2026-08-15**: library default is now `color-scheme: light`
       (`light dark` was the docs-MPA gap fix leaking into the library — an
       app-level decision via `<meta name="color-scheme">`, which the docs
       already carry); `[data-theme]` rules unchanged. CDP-verified: dark-OS
       no-JS page computes colorScheme `light` (coherent); opting in via
       data-theme=dark computes `dark` + dark tokens. Installation skeleton
       gains the pre-paint boot snippet. BONUS: this closed the 1.0-list
       item-9 "solid square checkbox" mystery — our own visual baselines had
       the mixed-mode bug on camera (headless prefers dark); baselines now
       show correct checkboxes.
7. [x] **Forced-colors sweep** (Rex M). 7/25 components have forced-colors
       rules; sweep the remaining 18 (or publicly scope the claim). Accept:
       every component either covered or named in a documented scope list;
       CDP forced-colors spot-verification on the worst three.
       **Done 2026-08-15**: evidence-first — CDP screenshots of the 6
       highest-risk components. Tabs (border indicator) and timeline
       (per-state glyphs) survive with no rules; three real breaks fixed
       (skeleton vanished entirely; combobox active option
       indistinguishable; stepper current-vs-pending color-only) and
       re-verified fixed under emulation. Accessibility page documents the
       strategy + the explicit-rules list (10 components) — the honest scope
       statement instead of a blanket claim. README size gate self-triggered
       on the CSS growth and was re-stamped (9.4 kB gz).
8. [x] **Generated keyboard map + docs skip link** (Ines M). Per-behavior
       Arrow/Esc/Home/End table extracted from source onto js-behaviors +
       component pages; skip link targeting the existing `#main-content`.
       Accept: map generated not hand-written; skip link first-focusable.
       **Done 2026-08-15**: `@keymap`/`@key` JSDoc on the 4 behaviors that
       own real key handling (combobox, data-grid, tabs, dialog — Esc +
       focus-trap); `extract-keymap.mjs` -> `dist/keymap.json`
       (`@busy-office/ui/keymap`), gated (a `@keymap` naming a non-existent
       init fails the build — proven). js-behaviors page renders the
       generated table (11 rows), scoping honestly to "everything else is
       native or has no keyboard surface" rather than padding the list.
       Skip link added to the docs shell: DOM-verified first-focusable,
       hidden off-screen unfocused / visible on focus, targets the real
       `#main-content`; screenshotted live. 56 tests, both link checks,
       32 baselines untouched.
9. [x] **Editable-grid recipe** (Devi HIGH). The screen-#40 page: combobox
       in a cell, cell-level error pattern, add/remove line, what
       `data-grid-nav` does and doesn't compose with. Accept: one recipe page
       with a working demo + honest limits, linked from data-table.
10. [x] **po-app reachability** (Devi M). Link `examples/po-app` wherever the
       docs cite it. Accept: every textual mention is a link.
       **Done 2026-08-15**: all 3 textual mentions on data-table now link
       the GitHub tree (200 verified).

**[HUMAN CALL]s from the review** (owner, whenever ready — defaults proposed
in the grill doc): keep `data-theme`/`data-density` unprefixed and commit, or
prefix now; declare `--bo-palette-*` internal in the versioning policy; run
the AT hardware pass (VoiceOver/NVDA) that Slice 15's ACR blocks on.

## Slice 15 (in progress — item 12 owner-gated) — conformance artifacts

11. [x] **Generated ACR** (Ines). VPAT-2.5-shaped page: WCAG 2.2 AA criterion
       × component, verdicts Supports / Conditional-on-adopter / Not
       Evaluated, generated from api.json + contrast.json + behaviors.json +
       the guarantees split. Accept: page generated, gated, linked from the
       accessibility concept; Not-Evaluated rows cite the AT gate.
12. [ ] **AT runtime evidence** — NEEDS-RUNTIME (owner hardware): combobox
       activedescendant, data-grid implicit roles, selection live-region on
       VoiceOver + NVDA; results recorded in `.roundtable/` and cited by the
       ACR.

## Slice 16 — docs IA, compared against 5 CSS frameworks (user wishlist)

Triaged 2026-08-16 (user: "well structure framework document - pls compare
with other CSS framework... make the user like to use it, easy to
navigate"). Full comparison: `.roundtable/docs-ia-comparison-2026-08-16.md`.
Fetched Tailwind, shadcn/ui, Bootstrap, Pico CSS, DaisyUI live; found 6 of 8
well-regarded patterns already in place (search, quantified landing pitch,
live interactive hero, ≤2-level nesting, philosophy/how split, install-to-
result flow) and two real gaps.

1. [x] **Demo-first, spec-last on every component page** — `ClassRef` moved
       from right after the opener to immediately before `ApiTable`, across
       all 24 pages (mechanical, content untouched); CLAUDE.md skeleton,
       `check-page-shape.mjs`, and `new-component.mjs` updated so new pages
       follow the corrected order by default. Zero exceptions across the 4
       frameworks studied that have a component catalog — this was the
       single highest-ranked finding.
2. [x] **Sidebar regrouped by task** (DaisyUI-style: Actions / Data input /
       Data display / Feedback / Navigation & layout) — replaces one flat
       22-item "Components" list plus an inconsistent 3-item "Data display"
       side-group.
3. [x] **Found + fixed while verifying**: button loading state's whole-
       element `opacity: 0.7` dropped white-on-accent text to ~3.24:1
       (axe color-contrast, serious). Removed — the documented contract
       already relies on the consumer's text change ("Saving…") as the
       visible signal, so the dimming was decorative, not load-bearing.

**Verified**: both link checks, axe zero (56 pages × 2 widths), 32 visual
baselines, 57 tests, stylelint, live both themes.

## Slice 17 — ERP component gaps, compared against 4 enterprise design systems

Triaged 2026-08-16 (user: "after research anything to triage the docs or add
to components that may need for ERP"). Researched SAP Fiori, IBM Carbon, Ant
Design/Pro, Salesforce Lightning (dedicated enterprise/ERP systems, distinct
comparison set from Slice 16's marketing-framework pass). Full findings +
one correction to the research agent's claims:
`.roundtable/erp-gaps-2026-08-16.md`.

1. [x] **Segmented control** (`.bo-segmented`) — appears in Carbon (Content
       Switcher), Ant (Segmented), Fiori (Segmented Button); real scenario:
       My Approvals / Team Approvals toggle, report-range switcher. Built:
       native radio-group under the hood (visually-hidden but focusable
       inputs, `:checked`/`:focus-visible` moved onto the label sibling so
       the ring traces the visible segment) — zero JS, keyboard arrow-nav
       and "n of m" free from the platform. Scaffolded via `new-component.mjs`,
       which needed a real fix first: it still searched for the pre-Slice-16
       flat `'Components'` sidebar section (silent drift since that slice) —
       added a required `--group=` flag naming one of the 5 task groups.
       **Bug found by actually clicking it, not just reading the code**:
       demo markup gave inputs `.bo-visually-hidden` but forgot
       `.bo-segmented__input`, so the state-selector CSS never matched —
       fixed across all 9 markup instances (3 demos + canonical + template).
2. [x] **File upload** — Carbon/Ant/Salesforce; scenario: attach a signed
       goods-receipt PDF or vendor contract to a record.
       **Done 2026-08-16**: `.bo-file-input` styles the native
       `&lt;input type="file"&gt;` (only `::file-selector-button` is
       CSS-restylable — the rest stays honest UA rendering, not fought).
       `.bo-file-dropzone` composes a bigger label-wrapped drag target;
       `.bo-file-list` styles consumer-rendered selected-file rows. One
       small opt-in behavior, `initFileDropzone()` — drag-over highlight +
       forwarding a drop anywhere in the box (not just the tiny native
       input) into `input.files`, dispatching a real `change` event so
       existing listeners see it exactly like a dialog pick. No custom file
       list, upload, or progress shipped — same "framework does visuals,
       you do the data" split as every other field component; pairs with
       the existing Progress component for an in-flight upload.
       Verified live: synthetic dragover/drop cycle confirmed
       `data-dragover` sets/clears correctly, `input.files` populates with
       the real dropped File, and `change` fires — not just read from the
       code. Both link checks, axe zero (58 pages), 32 baselines (verified
       stable across 2 independent re-runs after last wake's harness-race
       lesson), 57 tests, stylelint, live both themes.
3. [x] **Tag/chip (token) input** — Fiori Token/MultiInput, Ant, Carbon;
       scenario: multi-tag cost centers on a record, multiple approval-
       routing recipients.
       **Done 2026-08-16**: `.bo-tag-input` (real JS, same class as
       Combobox — no native element covers this). `initTagInput()`: Enter
       dispatches `bo:tag-add` with the typed text and clears the field
       (you validate/dedupe and append the actual chip); a remove-button
       click or Backspace-on-empty deletes the framework's OWN rendered
       chip and dispatches `bo:tag-remove` — deterministic, so the
       framework can own it, unlike addition. Keyboard access to remove
       buttons is plain Tab order (real `&lt;button&gt;`s), no reimplemented
       roving-tabindex.
       **Real bug caught by the test I wrote, not by reading the code**:
       `removeTag()` read `tag.textContent` for the removed value, which
       also picked up the remove button's own "×" label
       (`"CC-4021\n  ×"` instead of `"CC-4021"`) — fixed by cloning the
       tag and stripping the button before reading text. **Second bug
       caught live** (not by the code): `outline: none` on the field,
       intended to defer to the container's `:focus-within` border tint,
       actually removed the ONLY visible focus indicator from the
       focused element itself — a border-color change on a container is
       not a substitute for the element's own ring. Removed the override
       before it ever shipped; the plain global `:focus-visible` rule
       (same as every other input) is what actually renders now.
       Verified live: typed-and-Enter add, duplicate rejection, Backspace
       removal, and remove-button click all confirmed via real
       interaction in the browser, not just DOM assertions. 61 tests (was
       57), both link checks, axe zero (59 pages), 32 baselines (one
       harness capture flake — the same documented class as before —
       resolved by 5 consecutive clean re-runs), live both themes.
4. [ ] **Standalone Avatar** — Fiori/Ant/Salesforce; scenario: approval-chain
       "who's next" stack, assignee identification. Partially covered
       already — `.bo-byline__avatar` exists but is scoped inside Byline.
       **[HUMAN CALL]**: promote to a reusable `.bo-avatar` primitive (Byline
       composes it), or leave it byline-scoped and accept the gap? Not built
       pending the owner's call — a promoted primitive's class name becomes
       semver surface immediately, not worth guessing at.

**Not queued** (weak evidence or already covered, see the roundtable doc for
detail): tooltip/popover, comment/activity feed, master-detail split view,
signature capture, permission matrices, org-chart, kanban, calendar/
scheduling, audit-diff viewer, rating, notification center. **Saved views /
variant management** was flagged by the research as a gap but is already
shipped (`initSavedViews()`, documented on Filters) — corrected before
queuing, not taken on faith. **Date input** was also flagged and also
already fully covered (live-demoed on `/components/date`) — same correction.

**Verified** (item 1): both link checks, axe zero (57 pages), 32 visual
baselines, 57 tests, stylelint, live in both themes — click-toggle, real
keyboard arrow-navigation between radios, focus ring on the correct element,
disabled-segment state.

## Explore log

- [x] **2026-08-15 — po-app consumer image broken by the README-stamp gate**
      (Explore find, triaged and fixed same wake). `stamp-readme.mjs`
      required the repo-root README.md, but `examples/po-app`'s Dockerfile
      build stage deliberately copies only `packages/core` — the minimal
      context that exists specifically to prove the real npm package
      boundary. That context legitimately has no root README (it never
      ships to npm anyway). Fixed: the root README participates only if
      present; its absence in an isolated build is not an error, only
      `packages/core/README.md` (`requireAll: true`) still gates. Verified
      both ways: full-repo `--check` still stamps/verifies both files;
      `podman build` of the po-app image now succeeds end-to-end (built,
      ran, served `/pos` 200 with real content). This had been silently
      broken since Slice 14 item 1 shipped — po-app isn't in CI, so nothing
      caught it until this Explore wake actually ran the build.

- [x] **2026-08-16 — `npm audit`'s 7 vulnerabilities (1 critical, 3 high, 3
      moderate) audited per-advisory; confirmed inert, deliberately deferred**
      (Explore find). All 7 land in devDependencies only — confirmed
      `packages/core/package.json` has zero runtime `dependencies`, so npm
      never installs any of them for a consumer of `@busy-office/ui`. Went
      past that blanket fact to check each advisory's actual exploit
      precondition against how this repo really uses the tool:
      - **vitest (critical, GHSA-5xrq-8626-4rwp)** — "arbitrary file read/
        execute when the Vitest UI server is listening." This repo only ever
        invokes `vitest run` (headless); the `--ui` server is never started
        anywhere in scripts or CI.
      - **astro (high ×2 + moderate/low)** — Host-header SSRF in prerendered
        error-page fetch, reflected XSS via unescaped slot name, plus several
        dev-feature XSS advisories. `apps/docs` builds `output: 'static'`
        and ships via nginx — no Astro server/SSR runtime in production, and
        the affected dev-only features aren't used.
      - **vite (high + moderate ×2)** — `server.fs.deny` bypass, NTLMv2 hash
        disclosure via UNC path (Windows-only), optimized-deps path
        traversal — all three are `vite dev`-server-only. CI and local both
        only ever run `astro build` / `vite build`; no dev server is ever
        exposed to a network.
      - **esbuild (moderate + low)** — "dev server accepts any-origin
        requests," Windows-only dev-server file read — same shape, dev-
        server-only, never invoked here.
      - **sharp (high, inherited libvips CVEs)** — the one advisory with a
        genuinely different risk shape (native-library CVE reachable via
        *build-time* image processing, not a dev server). Checked whether
        it's actually exercised: no `astro:assets`/`<Image>` usage anywhere
        in `apps/docs/src`, and no raster (`.jpg`/`.png`/`.webp`) source
        assets in the repo — only visual-regression *test output* PNGs,
        which aren't inputs to any build step. `sharp` is a dormant
        transitive dependency of Astro's optional image service, never
        actually invoked by this build.
      Verdict: every one of the 7 advisories' exploit preconditions (a
      listening Vitest UI server, a network-exposed Vite/esbuild dev server,
      Astro SSR runtime, image processing via astro:assets) is absent from
      how this repo builds and ships. All `fixAvailable` require semver-MAJOR
      bumps (vitest, astro, vite chains) — upgrading now would trade a real
      risk of breaking the build/test toolchain for zero realized risk
      reduction. Deliberately deferred, not fixed: re-check each advisory
      the next time its package needs a major bump for an unrelated reason,
      or if any of the newly-absent preconditions (dev server exposed to a
      network, `astro:assets` adopted, `vitest --ui` used) becomes true.

- [x] **2026-08-16 — Dogfood: File upload on the po-app PO detail screen —
      graduated** (Explore, dogfood-loop fallback). The Ideas seed list and
      Long-term backlog are both exhausted of ready items, and the sanctioned
      fallback is "extend `examples/po-app` and feel where it fights." The
      three Slice 17 components (Segmented, File upload, Tag input, shipped
      earlier the same day) had only ever been exercised in isolated docs
      demos — never in the real tarball-consumer app. Added a "Documents"
      `<fieldset>` to the PO detail screen (`.bo-file-dropzone` +
      `initFileDropzone()`, client JS rendering `.bo-file-list` rows on
      `change`, exactly the documented recipe) — the real scenario Slice 17
      item 2 was scoped for ("attach a signed goods-receipt PDF, vendor
      contract to a record"), not a contrived one; no new data model needed.
      **Verified against the real npm package boundary**, not the docs
      container: rebuilt `@busy-office/ui`, `podman build`'d the po-app
      image fresh from a packed tarball, ran it, and drove the live page —
      a synthetic `DataTransfer`-based file add through the real `input`
      dispatched `change` correctly, rendered the file row, the remove
      button removed it (zero console errors); confirmed the section
      composes cleanly on both a Pending PO (next to the Approve dialog) and
      an Approved one (no dialog) — no layout conflict either way. Zero new
      CSS/JS — pure consumption of already-shipped, already-tested surface.
      **Graduated directly** (no worktree spike needed — same precedent as
      the icon-sizing fix: a small, unambiguous consumption of an existing
      primitive, not an open interaction-model question).

- [x] **2026-08-16 — Dogfood: Tag input on the po-app Approve dialog —
      graduated** (Explore, dogfood-loop fallback continued — Segmented and
      Tag input, Slice 17's other two new components, still had never been
      used outside isolated docs demos). Added a "Notify additional
      approvers" `.bo-tag-input` to the Approve dialog's `<form
      method="dialog">` — the exact scenario the roadmap cites for Tag input
      ("multiple approval-routing recipients"), a real ERP need (route the
      approval notification to more people than the default approver) with
      no invented data model. **Verified against the real npm tarball
      boundary**, same as the File-upload round: rebuilt core, packed a
      fresh tarball, `podman build`'d po-app, ran it, drove it live.
      Add-tag (Enter), add-second, Backspace-removes-last, and
      click-to-remove all confirmed via real DOM interaction, zero console
      errors, and — the actual risk this scenario tests — the tag field's
      Enter keydown does NOT trigger the surrounding `<form method="dialog">`'s
      native submit-on-Enter (confirmed `defaultPrevented: true` on the
      keydown, dialog stays open); Approve still correctly fires the
      existing `hx-post` and swaps the timeline. **One tooling artifact
      caught and correctly not misattributed to the framework**: an early
      click aimed at the remove button landed on the dialog backdrop instead
      (viewport-size drift between an earlier screenshot's coordinates and
      the live click, a known class of automation-tool imprecision, not
      anything programmatic) and closed the dialog — resolved by clicking
      via the element's live bounding-rect / accessibility-tree ref instead
      of stale screenshot pixel coordinates, not by changing any shipped
      code. Zero new CSS/JS — pure consumption of already-shipped surface.
      Graduated directly, same precedent as the File-upload round.

- [x] **2026-08-16 — Dogfood: Segmented control as a real density switcher in
      po-app — graduated** (Explore, dogfood-loop fallback, closes out all
      three Slice 17 components). The obvious literal scenario ("My
      Approvals / Team Approvals") needed a multi-user concept po-app
      doesn't model — rather than force that, found a genuinely uncontrived
      fit already latent in the codebase: po-app hardcoded `data-density=
      "compact"` and never let a user switch it, even though the framework's
      own warehouse-floor precedent (RF-scanner's `data-density="spacious"`
      quantity stepper) is exactly the back-office-vs-warehouse-floor
      density split a real ERP needs switchable at runtime — something
      neither po-app nor even the docs site had ever actually wired live
      (docs only ever demos density statically per example). Built: a
      3-option `.bo-segmented` ("Compact / Comfortable / Spacious") in the
      app-shell header, server-rendered from a `density` cookie
      (`densityFromCookie()`, default `compact`, unchanged from before),
      client JS setting `document.documentElement.dataset.density` on
      `change` for instant reflow **and** writing the cookie so it survives
      a real full-page navigation (po-app has no htmx-boost — every nav is
      a genuine reload, so this only works if the server actually reads the
      cookie back, not just client-side state).
      **Verified against the real npm tarball boundary**: rebuilt, packed,
      `podman build`'d, ran, drove it live — clicking Spacious visibly
      reflowed the data table (taller rows, larger checkboxes/buttons),
      correctly persisted across a real navigation to `/spend` (confirmed
      `document.documentElement.dataset.density` still `spacious` after a
      fresh page load, not just in-memory), and the header wraps cleanly at
      390px (isolated-clone technique, on-screen this time to confirm it
      *looks* intentional, not just doesn't overflow) — brand row on top,
      switcher on its own row below.
      **Real automation-tooling lesson, correctly isolated from the
      component under test before concluding anything**: a stale/corrupted
      browser tab silently no-op'd every synthetic click on the hidden
      radio input AND on its visible label — confirmed NOT a framework bug
      by reproducing the exact same click in a **freshly created tab**,
      where it worked correctly first try (same class of tab-corruption
      previously noted this session for a different bug; the fix is a new
      tab, not code). Also reconfirmed (independently, this round) that
      `.bo-segmented__input`'s hidden `<input>` itself is never a valid
      click target — real interaction always goes through the visible
      `<label>`, consistent with the component's own design and the
      Slice 17 item 1 bug it already caught once. `resize_window` was
      re-confirmed unreliable in this session (didn't change the reported
      viewport) — narrow-width verification used the established
      off-screen/on-screen clone-measurement technique instead, same as
      every other narrow-width check this session.
      Zero new CSS/JS surface shipped — pure consumption plus one small,
      genuinely useful po-app server addition (the cookie helper). No
      dark-theme check: po-app has never had a theme toggle (confirmed in
      an earlier dogfood round), so this is consistent with that existing,
      already-noted scope boundary, not a gap introduced here.

- [x] **2026-08-16 — Code blocks bled into the right-rail TOC on long
      lines — fixed** (user-requested click-through sweep: "can you use AI
      Agents to run thru the web?" — 4 parallel Explore agents, one per
      ~14-page batch, covering all 58 docs pages with screenshots + console
      checks). 57/58 pages came back clean; one real, verified finding on
      `/components/quantity`'s "With a unit" section — a long attribute-
      laden line in a `<pre><code>` block had no horizontal scroll and
      bled past its own column into "ON THIS PAGE", confirmed via
      `elementFromPoint`/bounding-rect inspection, not just eyeballing the
      screenshot. Root cause: `has-copy` (the copy-button class) is applied
      to EVERY `<pre><code>` in `.docs-content` via JS — both `Demo.astro`'s
      paired blocks and hand-authored "Markup" sections — but
      `overflow-x: auto` had only ever been added to the opt-in
      `.demo-pair--row` layout variant; the default stacked layout and
      every hand-authored Markup block never got it. This is a latent gap
      that could resurface on any page with a long enough code line, not
      just Quantity — fixed on the general `.docs-content pre.has-copy`
      selector so it's closed everywhere at once, not re-patched per call
      site. Verified live: 1440px light + dark (clean boundary, correct
      internal scroll, confirmed via `getComputedStyle`), 390px (off-screen
      clone technique, clips cleanly, no bleed). Zero console errors. Full
      gate suite green (61 tests, build, page-shape, link check).

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
- [x] **1.0 exit checklist** — written, with real verified numbers (not
      aspirational placeholders), via the Explore fallback (backlog +
      Ideas seed list both empty). While writing it, actually re-ran the
      `examples/po-app` tarball consumer end-to-end for the first time
      this session (see below) rather than trusting the CHANGELOG's
      description of it. The checklist itself:

      | # | Item | Status | Evidence |
      |---|------|--------|----------|
      | 1 | Component surface | ✅ 28 component pages, 12 pattern pages, 2 reference pages (re-synced 2026-08-16 after Slice 17: Segmented control, File upload, Tag input) | `check-page-shape.mjs`: 28 component pages |
      | 2 | JS behaviors | ✅ 18 opt-in behaviors total (`dist/behaviors.json`), generated docs table. **All 18 now stable against internal usage** (re-synced 2026-08-16 — each survived ≥2 in-repo compositions; freeze PROVISIONAL until the item-12 independent adopter — per the decisions grill, contract-shape changes before then are CHANGELOG-Breaking entries). `initFileDropzone`/`initTagInput` graduated into that audited set this round: each had only the docs demo as its one context until the po-app dogfood rounds (Documents section, Approve-dialog "notify additional approvers") gave both a second, independent in-repo composition — the same bar the other 16 originally used | `dist/behaviors.json`: `initCount: 18`; CHANGELOG freeze addenda + correction |
      | 3 | Test coverage | ✅ 61 behavior tests, all passing (re-synced 2026-08-16 — was 55 as of 2026-08-15, Slice 17 item 3 added 4) | `npm test` |
      | 4 | Build gates | ✅ 7 gates, all green + 2 advisory harnesses (`test:visual` 32 shots, `test:axe` 54 pages) | named `@container`, contrast+coverage, behaviors-vs-`.d.ts`, dist links, stylelint, tests, page-shape |
      | 5 | Contrast | ✅ 27 pairs × 2 themes + 1 brand preset, all AA (incl. three non-text 3:1 fill pairs) | `check-contrast.mjs` |
      | 6 | Zero runtime deps (shipped pkg) | ✅ confirmed, `htmx.org` is a **docs-app-only** dep | `packages/core/package.json` |
      | 7 | Dark mode / density / print / forced-colors | ✅ shipped, live-verified this session | Slices 5-6, item 18 |
      | 8 | RTL | ✅ audited — logical properties genuinely hold; 1 open product question flagged (numeric column alignment), not a bug | Slice 7 item 6 |
      | 9 | ≥1 real consumer | ✅ `examples/po-app` — **re-verified live THIS round**: `podman build` from current source, ran the container, clicked through dashboard → PO list → filter → select-all/bulk-approve → detail page → approval timeline. Everything worked. One visual anomaly investigated (an unchecked `.bo-checkbox` rendered as a solid square in this session's automated-Chrome screenshot) — **root cause found 2026-08-15 by Slice 14 item 6**: NOT an environment quirk after all, but the library's `color-scheme: light dark` + headless-Chrome dark preference + no `data-theme` = dark native checkboxes on a light page (the exact mixed-mode bug the Platform seat later named). Fixed by the library defaulting `color-scheme: light`. | `examples/po-app`, this round |
      | 10 | a11y ledger | 🟡 2 items genuinely NEEDS-RUNTIME (VoiceOver, NVDA — no tool in this environment can drive either); everything else closed, and the first full axe-core engine scan (2026-08-15, Slice 13) is zero violations across all 54 docs pages | Slice 6 item 5, item 18; `test:axe` |
      | 11 | API frozen | 🟡 **Provisional** (downgraded by the 2026-08-15 decisions grill): all 18 behaviors now stable against internal usage (item 2, re-synced 2026-08-16) — the audits are per-item and dated — but the terminal "frozen" claim required the *external* usage pressure the audit itself named, and po-app is not external (the same reasoning item 12 uses to refuse po-app as an adopter — the two items now agree: 12 = market validation, 11 = contract robustness, and 11's final grade waits on 12's adopter) | `CHANGELOG.md` freeze addenda + correction; `.roundtable/grill-decisions-2026-08-15.md` |
      | 12 | Real independent adopter | 🔴 **Not met, and `po-app` does NOT count** — it's a reference app built by this project's own team to test packaging, not an external team choosing to adopt it. This is the one item on the list that can't be closed by more loop iterations; it needs an actual second party. |

      **Net: 10 of 12 done, 2 genuinely NOT closeable by more loop
      iterations** — the a11y NEEDS-RUNTIME items need real assistive-tech
      hardware, and the independent-adopter item needs an actual second
      party. This is NOT "hit the list, ship" — it's an honest snapshot
      for whoever (the owner) decides when "good enough" is reached; a
      loop iteration should not self-approve publish
      regardless of how this list reads.
- [x] **Real ERP pilot (dogfood)** — already substantially satisfied by
      `examples/po-app` (item 9 above) — a real 3-screen ERP slice
      (dashboard, PO list with filter/bulk-select, detail + approval
      timeline) built with the framework, not synthetic docs demos.
      **Worth being honest about the distinction from item 12 above**:
      this WAS built by the framework's own team dogfooding it (exactly
      what this bullet asked for — "feel where it fights"), which is
      different from and does not substitute for an independent adopter.
      No fresh "where it fights" friction found this round (the
      checkbox-render investigation was an environment quirk, not a
      framework gap) — but this hadn't been re-run against the CURRENT
      component set (post Slice 6/7) until this round confirmed it still
      builds and works end-to-end.
      **Extended 2026-08-16** (three Explore dogfood rounds, post Slice 17):
      po-app grew a real "Documents" section (File upload on the PO detail
      screen), a "Notify additional approvers" field (Tag input inside the
      Approve dialog's `<form method="dialog">`), and a real density
      switcher (Segmented control, cookie-persisted across full-page
      navigation — po-app has no htmx-boost, so this only works if the
      server genuinely honors it back). Genuine friction found and
      resolved this round, not just re-verification: the Tag input's Enter
      keydown inside a native `<form method="dialog">` needed confirming
      it doesn't trigger the form's submit-on-Enter (it doesn't —
      `initTagInput()` already calls `preventDefault()`), which is exactly
      the kind of composition risk a synthetic docs demo (no surrounding
      `<form>`) can't surface. See the Explore log entries below for full
      verification detail.

- [x] **Framework adapters — resolved by splitting (2026-08-15)**: the
      Rails/Django asset recipe turned out to already exist — the
      installation page's skeleton IS the no-Node story (vendor the dist
      into any static/asset pipeline; now says so explicitly, naming
      Rails/Django/PHP/Go, and — per the decisions grill — recommending a
      VERSIONED vendor path (`/vendor/busy-office-ui@0.1.0/`) so copied
      assets have an explicit upgrade step and a tell-which-version
      story; the fuller update-path answer folds into the versioned-docs
      item at 1.0). The Vite plugin and React/Vue wrapper set
      stay **parked as speculative**: zero consumer demand to date, and
      the framework's plain-class + `data-*` contract already works
      unwrapped in every framework (po-app proves the no-framework path;
      JSX consumers use the classes directly). Either graduates the
      moment a real consumer asks — same gate as every parked item.
- [ ] **Versioned docs** — the CHANGELOG covers pre-1.0 churn; at 1.0, snapshot docs
      per major so pinned users read their version.
- [x] **Theme presets** — shipped one real preset (not the whole "small
      set" — see below), generated via the Explore fallback (backlog +
      Ideas seed list both empty, same pattern as items 21/6).
      `packages/core/src/css/brand/brand-indigo.css`: a genuinely
      importable file (`@busy-office/ui/css/brand-indigo`, resolved by
      the existing `./css/*` wildcard export — no new export entry
      needed), following the exact recipe already documented in
      `/concepts/theming` (accent family + focus-ring + bg-selected,
      both light/dark blocks, deliberately unlayered so the cascade
      contract lets it win). **Genuinely validated, not asserted:**
      extended `scripts/check-contrast.mjs` to discover and check every
      file in `src/css/brand/` the same way it checks the base theme —
      all 24 pairs pass in both light and dark for the indigo values.
      Wired into `build-component-css.mjs` (mirrors the existing
      htmx.css/motion.css opt-in-module pattern). Live demo added to
      `/concepts/theming` — a scoped `.brand-preview` box (same token
      values, targeted at a class instead of `:root` so it doesn't
      re-skin the whole live docs site) showing a real button/badge/link
      re-skinned correctly in both themes, verified live via Podman.
      **Deliberately scoped to one preset, not "a small set"** — the
      mechanism (file format, build wiring, contrast validation, docs
      demo) is now proven and reusable; a second/third preset is a
      cheap follow-up once wanted, not something to speculate additional
      hues for right now. 33 tests unchanged (no JS touched), gates
      green including the new brand-contrast check.
- [x] **Visual-regression harness** — shipped 2026-08-15 (advisory, not
      yet a hard build gate). `apps/docs/scripts/visual-regression.mjs`
      (`npm run test:visual` / `test:visual:update`): 8 key pages ×
      light/dark × 1440/390px = 32 full-page shots, diffed against
      committed baselines (`apps/docs/visual-baselines/`, 3.2MB) with
      pixelmatch at a 0.1%-changed-pixels threshold; failing shots write
      diff images to the git-ignored `visual-diffs/`. Tooling call:
      puppeteer-core driving the SYSTEM Chrome (no browser download;
      `CHROME_PATH` env for CI runners) + pixelmatch/pngjs (pure JS).
      Validated both directions before committing: deterministic (32/32
      green on immediate re-run) AND red-capable (swapping the accent
      teal to red in the built CSS failed exactly the 6 shots where the
      accent is visible; restoring returned all green). Deliberately
      advisory for now — cross-machine antialiasing variance needs a
      baseline-per-environment policy before it can hard-fail CI; that
      wiring is the follow-up, not the harness. **Hardened same day**:
      the first baseline run silently captured 404 pages from a stale
      dist (the "96% changed" failures on the next run exposed it) —
      the script now refuses any non-200 response, and baselines were
      regenerated from a verified-fresh build.
- [ ] **Turbo** — adopt if the workspace grows past ~2 packages (build caching).
- [x] **Data-grid virtualization hooks — investigated with measurements,
      closed as WON'T BUILD (2026-08-15; evidence extended same day after
      the decisions grill challenged the single-machine data — 4× CPU
      throttling approximating older corporate hardware: interactions
      stay <700ms even at 20k rows, initial render is the real pain at
      ~3.8s/20k throttled, reinforcing "paginate beyond a few thousand";
      re-open condition published in the docs section).** The "needs a perf scenario"
      gate was satisfied by a stress harness added to po-app
      (`/stress?n=…`, kept for future re-measurement): N unvirtualized
      rows through the full table stack. Measured — 1k: 85ms render /
      4ms select-all; 5k: 174ms / 18ms / 231ms post-bulk-check style
      flush; 20k: 558ms / 49ms / 610ms. Render and scroll scale linearly
      with NO cliff; the only visible cost is the bulk-select row-tint
      recalc, linear and per-toggle. Verdict: virtualization's complexity
      (breaks Ctrl-F, select-all semantics, SR row counts) is not
      justified — server-side pagination (already shipped: page numbers +
      load-more) is the answer at the scale where tables stop being
      scannable anyway. Published as a "Performance at scale — measured,
      not guessed" section on `/components/data-table` with the real
      numbers. **Diagnostic honesty note**: the first measurement pass
      misread a 45s "renderer freeze" at 5k rows — it was a hidden-tab
      artifact (background tabs never fire rAF and don't run layout),
      not the page; re-measured with synchronous forced-layout reads.
- Component depth (remaining note): (Amount field and
      command palette pulled forward into Slice 5; date-field graduated
      into Slice 6 item 21; RTL audit graduated into Slice 7 item 6;
      **tree/nav shipped 2026-08-15 via the Explore fallback** — `.bo-tree`,
      `packages/core/src/css/components/tree/tree.css`, built on native
      `<details>/<summary>` so open/closed state, Enter/Space toggling and
      Tab stops are platform semantics, zero JS/ARIA — the same
      native-element-first call as `.bo-progress`. Explicitly navigation,
      not an APG TreeView; the docs page states when the heavier
      single-tab-stop selection-tree pattern would be needed instead and
      that it's deliberately not shipped. `aria-current` active-node
      convention shared with the sidebar; em-based logical-property
      indentation verified mirroring under RTL live; chevron uses the
      `content` alt-text idiom; reduced-motion honored. New
      `/components/tree` docs page (page-shape: 24 pages, 2984 links);
      verified live via Podman `--no-cache`, both themes, 390px, RTL,
      and a real branch toggle. No new contrast pairs needed — reuses
      already-gated sidebar pairings. Virtualization hooks remain open:
      genuinely needs a perf scenario + design decision, not buildable
      from composition.)

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
