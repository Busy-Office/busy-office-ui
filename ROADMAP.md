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
- 6 build-enforced gates: named `@container`, contrast threshold **+ coverage**,
  behaviors-vs-`.d.ts`, dist link resolution, stylelint naming, 11 behavior tests.
- Generated-from-artifact docs: API tables, contrast tables, class index, `llms.txt`,
  quick-reference cheat sheets, AA-per-component — none hand-maintained, all CI-gated
  against drift.
- CI + GitHub Pages deploy (gated on tests); Docker consumer app; Podman docs image.
- Four adversarial multi-seat design reviews, every gate finding fixed or ledgered.

## In progress — Slice 5: Docs UX polish + ERP data-entry fields

The current focus, driven autonomously by the build loop (see `.roundtable/` for
the running log). Ordered by priority — a broken state outranks any enhancement.
Each item lands with its docs page and passes the standing gates before the next
starts.

**Done this slice**
- [x] **Fixed app chrome** — `.bo-app-shell` fills the viewport; header stays put,
      sidebar and main scroll independently (correct back-office behavior for every
      consumer, not just the docs). Print resets height/overflow. *Pending a grill —
      it's a behavior change to a shipped primitive.*
- [x] **Responsive docs nav** — Menu button → off-canvas drawer on narrow screens
      (replaces the empty icon-rail the app-shell collapse produced for a
      labels-only nav).
- [x] **Full-width landing** — dropped the centered 74rem column; hero + live table
      align to the header edges.

**Queued (priority order)**
1. [x] **P0 — Dark-theme text visibility bug.** Diagnosed (browser contrast sweep,
       37 pages): **no** persistent invisible text — steady-state dark is clean and
       the contrast gate already guards `text-primary`/`bg-surface` in both themes.
       The real defect was the **theme-switch transition flash**: `background-color`
       animates on the flip while `color` snaps, so text sits on a still-light bg for
       ~150ms (near-invisible → dark). Fixed with a `data-bo-theming` transition-freeze
       utility (core) applied by the docs toggles; recipe documented in the theming
       guide. Verified: guarded flip has `transition:none`, bg jumps to final, ratio 16.
2. [x] **ERP Amount field** — `.bo-amount` with parts (`__currency`, `__value`,
       `__fraction`, `__unit`) and modifiers (`--negative`, `--positive`, `--strong`,
       `--muted`, `--block`). CSS-first: the app formats the number, the component
       styles + aligns it with tabular figures. Negative/credit is two-channel (sign
       or parentheses in the markup; colour second). Verified AA in both themes — added
       4 gate pairs (danger/success text on surface + canvas, all ≥4.8); tabular
       alignment holds down a table column. Docs page shipped (0.9 kB min).
3. [x] **Data-table column alignment** — `__col--left` / `--center` / `--right`
       (+ `--numeric` = right + tabular). **Also fixed a latent bug**: the base
       `th, td` rule (0,1,1) outranked `--numeric` (0,1,0), so amounts silently never
       right-aligned — moved the default to `:where(th, td)` (0,1,0) so one class per
       cell reliably wins. Verified live: numeric column now `text-align:end`; all
       four modifiers correct; documented on the data-table page.
4. [x] **Cmd/Ctrl+K command palette** — a native `<dialog>` mounting a second Pagefind
       instance; Cmd/Ctrl+K toggles (preventDefault beats the browser omnibox), ↑/↓
       move focus through results, Enter follows, ESC/backdrop close (showModal gives
       focus containment free). Pagefind's variables mapped to our tokens so it's
       theme-aware (verified dark: `#22262e` bg / `#f9fafb` text). Reduced-motion-guarded
       entrance; a `⌘K` hint chip on the sidebar search. Verified live: opens, "dialog"
       → 13 results, arrow-nav Dialog→Navigation. Graduates the long-term palette item.
5. [ ] **Sidebar scroll position** (UX bug) — the left index jumps back to the top on
       every navigation; the active item and scroll position aren't preserved. *Accept:*
       sidebar keeps its scroll across page loads (persist scrollTop, or scroll the
       active link into view) so deep nav items stay reachable without re-scrolling.
6. [ ] **Motion module** (opt-in, split — see the combine/split decision) — ship
       `@busy-office/ui/css/motion`: a curated ~8–10 *functional* animations (fade,
       slide, collapse, pulse-once) driven by the existing motion tokens and
       reduced-motion-guarded, NOT a decorative Animate.css clone. Core keeps the
       mechanics (tokens + state transitions) it already has.
7. [ ] **Visual identity cluster** — (a) **favicon**; (b) **busy-office-ui logo** as an
       inline SVG (currency/back-office motif, mono-friendly, works at 16px and in the
       navbar, theme-aware via `currentColor`); (c) **brand palette** — a distinctive
       accent family beyond the default neutral+blue, every step validated through the
       contrast gate, shipped as a `brand-*.css` preset demonstrating the semantic
       re-skin. Do the palette first; logo + favicon derive from it.
8. [ ] **Section-by-section docs simplicity pass** (ongoing) — walk each doc section,
       cut anything more complex than a first-time user needs, verify in the container.

## Near term (pre-1.0)

- [ ] **Docs UX cluster 2** — pair each demo with its own copyable code block
      (a `Demo` wrapper), enforce one component-page skeleton, copy buttons.
- [ ] **npm publish** `@busy-office/ui@0.1.x` — the package is structurally ready
      (exports audited, tarball-tested via the consumer app); owner-gated on "perfect".
- [ ] **Runtime a11y pass** — VoiceOver/NVDA verbalization, 200% zoom geometry,
      print preview: clear the standing NEEDS-RUNTIME ledger, then claim AA outright.
- [ ] Slice-4 continuation — avatar byline, collapsible cards, a real `.bo-composer`,
      skeleton/empty/loading states.
- [ ] Saved-view persistence; multi-column detail-form patterns.

## Long term (post-1.0)

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
