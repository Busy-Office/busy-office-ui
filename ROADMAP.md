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
1. [ ] **Skeleton / empty / error states** — a first-class component set
       (`.bo-skeleton` shimmer blocks, `.bo-empty-state`, `.bo-error-state`),
       token-driven, reduced-motion-safe (reuse the Motion module's guard
       pattern). *Accept:* one docs page, all three states demoed, AA in both
       themes, no new dependency.
2. [ ] **Data-table ARIA grid pattern** — the real fix for keyboard row
       navigation (see the 2026-08-14 Explore spike below `## Done` — mechanics
       work, but it needs the full WAI-ARIA APG "Grid" pattern: `role="grid"`/
       `"row"`/`"gridcell"`, `aria-rowindex`/`aria-colindex`, two-axis roving
       tabindex, `aria-selected` wired to the existing row-select checkboxes.
       *Accept:* VoiceOver-verified (this env can drive it via macOS
       automation), doesn't regress existing selection/sort behavior.
3. [ ] **Slice-4 continuation** — avatar byline, collapsible cards, a real
       `.bo-composer` (comment + action) for approval threads.
4. [ ] **Saved-view persistence**; multi-column detail-form patterns.
5. [ ] **Runtime a11y pass** — VoiceOver verbalization + 200% zoom geometry +
       print preview are checkable from this environment (macOS); NVDA
       (Windows-only) stays a standing NEEDS-RUNTIME ledger entry, not claimed.
6. [ ] **npm publish** `@busy-office/ui@0.1.x` — structurally ready (exports
       audited, tarball-tested via the consumer app); **owner-gated on
       "perfect"** — a loop iteration should not self-approve this.

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
- Each slice is adversarially grilled before sign-off.
