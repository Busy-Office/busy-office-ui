# Changelog

Pre-1.0: minor versions may include breaking changes; each is listed here.
Per the versioning policy (docs → Theming guide): semantic tokens, documented class
names, and `data-*`/ARIA contracts are the public API. **Per-component dist file
placement is explicitly NOT API until v1.0** — import granular files at your own
pin.

## Unreleased

- **Fixed** (docs): four documented form controls had no accessible name of
  their own — three `.bo-tag-input__field` and the combobox value-help input,
  all relying on `placeholder`. Fixed in the copy-paste markup so adopters do
  not inherit it. The accessibility sweep now rejects placeholder-only names, a
  rule axe cannot express because `placeholder` feeds the accessible-name
  computation.

- **Fixed** (docs search): the index covered whole page bodies, so every result
  excerpt began with the app shell ("busy-office-ui Menu Pattern: …") and raw
  HTML from code samples surfaced as prose. `<main>` is now the indexed body,
  the shell and TOC are excluded, and a post-build step excludes 169 code
  samples and 67 demo previews. Demo table cells remain indexed on purpose:
  they share a class with the generated reference tables, and excluding both
  made class names like `bo-data-table` unfindable. Gated by `check:search`.

- Added (gate): `check:vendor-contrast` measures the contrast of RENDERED
  third-party UI, which the token-pair gate structurally cannot see. It was
  `check:contrast` passing on the very page where vendored Pagefind CSS
  rendered at 1.46:1 that motivated it; reinstating that CSS now fails the new
  gate in dark while the token gate still passes.

- **Fixed** (docs site): the landing page ignored BOTH persisted preferences —
  a dark-mode reader clicking the logo got a light page with no way to recover,
  and `bo-density` was ignored too (the static `data-density="compact"` merely
  matched the default). It now runs the same blocking inline theme/density
  script as the docs shell. The hero switchers remain deliberately scoped to
  the demo card, but initialise from the page's resolved values so they no
  longer contradict it.

- **Fixed** (docs site, WCAG 1.4.3): the docs ran TWO Pagefind instances and
  only the Cmd-K one was themed — the sidebar box inherited Pagefind's stock
  `#393939` and rendered result text at **1.46:1 in dark**. Consolidated to a
  single instance reached from a sidebar button, a mobile header button and
  Cmd/Ctrl-K: dark result text is now **14.51:1**. Also fixes search being
  entirely unreachable on mobile (both instances measured 0x0 at 420px), the
  shortcut badge colliding with Pagefind's Clear button, the search box
  scrolling 681px out of view, and two indexes loading per page. The shortcut
  hint is a real element now, so it reads "Ctrl K" off macOS.

- Added (gate): `check:po-app` — the reference app is verified in CI for the
  first time. Boots `examples/po-app` on a free port and asserts seven
  behaviours the docs cite it for (href-only filter removal, unknown token keys
  staying free text, an invalid mass-change target changing nothing, staging's
  disabled Apply, apply-and-keep-errors, bulk partial failure) plus axe over
  six routes at two widths. 11.9s. `examples/po-app` honours a `PORT` env var;
  default unchanged.

- Added (docs + reference app): **mass change** (M3) on
  `/patterns/bulk-actions` — select N rows, set one field, in one validated
  operation. No new component: `formaction` re-points the existing bulk form's
  checked ids at a second endpoint, and the dialog's field joins that form.
  Ships the rule that a bad target value is a document-level 422 changing
  nothing, not N identical row errors. Completes the four data-maintenance
  patterns now named in DESIGN.md.
- **Fixed** (build): `check:rtl`'s DESIGN.md assertion broke the po-app
  container image, which copies only `packages/`. The check now reports
  loudly that it was skipped when the file is absent instead of failing —
  CI has the full checkout and still enforces it.

- Added (docs): the **document frame** — a compact identity line (type badge,
  record number, status, actions) on `/patterns/record-detail` and
  `/patterns/detail-form`, composed from a split `.bo-cluster` with no new
  CSS. Measured at 36px/68px and 24px/53px against an 80px chrome budget that
  is now gated, and Status no longer appears in both the identity line and the
  facts strip (which cost 54px at phone width). `detail-form` previously had
  no identity region at all.

- Added (docs + gate): worked SG/TH formatting examples and an
  "entry precision is not display precision" section on `/concepts/i18n`,
  with every string produced by running `Intl`. A new browser-free gate
  (`check:formatting`) reproduces those strings and watches the ISO-4217
  vs CLDR minor-unit divergence (currently IQD, IDR, HUF, COP, PKR, MMK,
  LAK), so an ICU upgrade cannot silently make the page wrong. No API
  change: `currencyDecimals()` follows ISO minor units by design, which is
  the correct authority for what a user may type.

- Added (docs): the **document-level message strip** on
  `/patterns/validation-summary` — for messages about no field at all
  ("posting period closed"), with the test that keeps them rare and the
  explicit refusal to grow a message centre. No new component: it is
  `.bo-alert` in the document header. The reference app's import screen
  demonstrates one (a batch total exceeding the period budget), enforced
  server-side as well as by the disabled button.

- Added: `data-row-state="warning"` on data-table rows — a row that is valid
  but qualified, for staging and batch-result views. It shares the `dirty`
  state's declarations (same amber treatment, different meaning) rather than
  duplicating them. There is deliberately no `ok` state: a row with nothing
  wrong is a normal row, and its confirmation is a success badge.
- Added: **staging / batch-result pattern** (`/patterns/staging`) — the
  landing place for bulk data before it becomes records: validate every row,
  show all three outcomes, then apply only what can be applied and leave the
  rest on screen. What the Excel round-trip needs from the web side.

- **Fixed**: `.bo-widget` did not reset `text-decoration`, so a launchpad
  tile — a widget on an `<a>` — wore the browser's link underline. Same gap
  already fixed on `.bo-btn`/`.bo-badge`/`.bo-chip`; found because the
  app-launch pattern carried six hand-written `text-decoration: none`
  workarounds, and a repeated workaround is the missing framework rule. The
  underline gate now covers `bo-widget` too.

- Added (combobox value help): rich result rows —
  `.bo-combobox__option-code` / `__option-label` / `__option-meta` — plus
  `.bo-combobox__group` headings and `data-open-on-focus`, which shows
  server-supplied recents before any keystroke. The LABEL part is what
  commits to the field; plain-text options behave exactly as before. All
  three parts are inside the option, so the existing filter matches on code,
  name or context alike.
- **Fixed** (combobox): scrolling now REPOSITIONS an open list under its
  focused field instead of closing it, closing only once the field leaves
  the viewport. Closing on any scroll made focus-to-open impossible —
  focusing an off-screen field scrolls it, and that scroll closed the list
  focus had just opened.
- **Fixed** (combobox): the scroll handler called `Node.contains()` on an
  event target that is not always a Node, which throws and silently aborted
  the handler.

- **Fixed** (docs correctness): /concepts/density claimed "No density tier
  takes an interactive target below 1.5rem (24px)" and called spacious
  "44px targets". Both were false — `.bo-checkbox`, `.bo-radio` and
  `.bo-tag-input__remove` are a hard-coded 1rem in ALL three tiers and the
  data-table sort button is 18px tall. No accessibility failure: WCAG 2.5.8
  is met through its spacing exception, which is now what the docs say, plus
  the consequence for adopters (crowd controls closer than 24px between
  centres and you break it).
- Added: `check:target-size` runs the real SC 2.5.8 test in CI — a 24px
  circle centred on every undersized control must reach no other target —
  across seven control-dense pages in all three densities.
- Added (ACR): four criteria the project had CI evidence for but never
  reported — 1.4.10 Reflow, 1.4.12 Text Spacing, 2.4.11 Focus Not Obscured,
  2.5.8 Target Size. The report was understating verified conformance.

- Added (gates, no behaviour change): `check:motion` refuses any shipped
  animation that uses a literal duration without a
  `prefers-reduced-motion` override, and the documented-claims gate now
  executes the reduced-motion promise under emulation. The claim
  ("reduced-motion zeroing on all animations") was verified TRUE when
  executed — this keeps the next animation added from becoming the first
  exception.

- **Fixed**: `.bo-btn`, `.bo-badge` and `.bo-chip` never reset
  `text-decoration`, so any of them used on an `<a>` wore the browser's link
  underline inside the pill. This hit every page of the docs site — the
  Related footer is chips — plus the landing page's own two CTAs. Six other
  components that expect to be anchors (navbar, sidebar-nav, pagination,
  breadcrumb, dropdown, tree) already did this; the three that are only
  SOMETIMES a link were the ones that slipped. Content links are unaffected
  and still underline. The layout sweep now gates it.

- Added (reference app): the PO list's filter bar actually filters. It
  submitted `q`/`status` and the server read neither, so Apply was a silent
  no-op — which also meant the "filters exclude everything" empty state
  could never occur and had never been built. Both empties now ship and are
  deliberately different: first-run offers "New purchase order", filtered
  offers "Clear filters" and says how many records are hidden.

- Added (generated docs surface): `api.json` now records `forcedColors` per
  component, and /concepts/accessibility renders its Windows High Contrast
  component list from it. The hand-written list had drifted to 10 of 15
  while still claiming to be exhaustive. A new gate
  (`check:forced-colors`) verifies every shipped `@media (forced-colors:
  active)` rule still matches real markup and still changes something under
  CDP emulation, measured against a control run.

- **Fixed** (RTL): `.bo-motion-slide-in-inline-start` had a logical NAME and
  a physical implementation (`transform: translateX(-0.5rem)`), so in a
  right-to-left document it slid in from the wrong edge — the opposite of
  what its own name promises. `.bo-tree-table`'s disclosure chevron was
  missing the `[dir="rtl"]` glyph flip that `.bo-tree` already carried, so
  it pointed the wrong way in RTL. Both fixed, and a new build gate
  (`check:rtl`) now refuses any physical box property in the shipped CSS
  and any new direction-sensitive construct — transform, background-position
  keyword, or a chevron glyph in `content` — that lacks a flip.

- **Changed** (guidance): a bulk-action list should wrap its rows AND its
  bulk buttons in one `<form>` rather than putting `hx-include` on the
  button. Both POST the same ids, but only the form gets native implicit
  submission, so <kbd>Enter</kbd> from any row checkbox runs the bulk
  action — measured against the alternative at 32 keypresses from row 30.
  Two contracts ship with it, both gated: make only the SAFE action
  `type="submit"` (implicit submission fires the first submit button, and
  it must never be a destructive one), and give each row checkbox an `id`
  so htmx restores focus after the swap instead of dropping the user on
  `<body>`. Docs and the reference app updated; no API change.

- Added: **bulk actions pattern** (`/patterns/bulk-actions`) — selection
  → toolbar action → per-row result, with the data contract (rows plus an
  out-of-band summary in one response), all six states including partial
  failure, and the rule that per-row failure reasons are TRANSIENT and
  must be cleared before each action or the list starts lying about the
  record. No new components.

- **Fixed**: `.bo-badge` had no boundary of its own, so a badge whose
  subtle fill matched the surface behind it disappeared as a shape and
  left only its word — measurably so for a danger badge on an
  `[data-row-state="error"]` row, where fill and row tint were the same
  colour in both themes. Every badge now carries a 1px border derived
  from its own foreground (`--bo-badge-border`, overridable per
  variant; the solid `--type` chip opts out). Print and forced-colors
  already added a border for the same reason — this makes it
  unconditional. Badges grow 2px in each axis.

- **Fixed** (WCAG 1.4.12 Text Spacing): `.bo-chip` and
  `.bo-file-list__name` truncated with an ellipsis and lost text under a
  user spacing override — both now wrap instead; `.bo-avatar` clips
  only when it contains a photo, so initials are never cut. Verified on
  every page at two widths by a new CI gate.

- Removed: a dead `print-color-adjust: exact` rule targeting
  `.bo-badge` — badges deliberately print as black text in a black
  border with no background, so the rule forced a colour that had
  already been removed. Timeline and stepper markers keep it, where the
  fill is the signal. No visual change.

- **Fixed**: `.bo-segmented` options now wrap instead of pushing the
  page sideways — 2-5 translated labels ("Meine Genehmigungen")
  overflowed a phone-width shell. Normal-length labels still render on
  one row; the fix only engages when the group would not fit.

- **Fixed**: `.bo-cluster` children could refuse to shrink (flex items
  default to `min-width: auto`), so a child with nowrap content — a
  `.bo-chip` carrying a long or translated label — pushed the page
  sideways at narrow widths instead of wrapping. Cluster children may
  now shrink, and `.bo-chip` caps at 100% with an ellipsis. Found by a
  new CI gate that expands every string ~35% and forces compact
  density.

- Changed (dist placement — explicitly NOT API until v1.0): the `nav`
  component directory split into four real components —
  `breadcrumb`, `navbar`, `sidebar-nav`, `offcanvas`. Class names are
  unchanged; granular importers of `dist/css/components/nav/*` must
  update their paths, and each now has its own docs page and generated
  API table. `/components/nav` redirects to `/components/sidebar-nav`.

- Added (combobox): `data-name` on the widget root mirrors each
  committed option's `data-value` into a generated hidden input, so a
  plain form POST carries the machine value rather than the display
  label; focusing a committed field selects its text so typing browses
  the full list again; a visually-hidden `role="status"` region
  announces result counts and "No results"; pointer movement syncs the
  active option with the keyboard's.

- **Fixed** (combobox, from an owner test report): Enter with the list
  open but no active option no longer submits the surrounding form (it
  commits the sole match, or does nothing); focus leaving the widget
  now closes the list and clears `aria-activedescendant`; the list
  closes on scroll instead of drifting away from its field; clicking an
  option keeps focus on the input (was dropping to `<body>`);
  `aria-disabled` options are skipped by the arrows and rejected by
  Enter/click; options without an `id` get one minted so
  `aria-activedescendant` is never an empty string.

- Added: Keyboard key (`.bo-kbd`) — a keycap chip for the native
  `<kbd>` element (weighted bottom edge, mono, case-preserving even
  under uppercasing containers) + the "Keyboard help" pattern: the "?"
  shortcuts dialog composed from Dialog + Key-value facts + the chip,
  with the four-line app wiring (and its don't-steal-"?"-from-inputs
  guard) shown, deliberately not shipped as a behavior.

- Added: the 24-range scale system — `--bo-palette-<range>-<step>` raw
  tokens, 11 steps (50–950) per range, generated in OKLCH on a shared
  lightness ladder (generator drift-gated). Two tiers: 9 core ranges in
  the default bundle (semantic five + slate/indigo/violet), 15 extended
  ranges via the opt-in `@busy-office/ui/css/scales` module; manifest
  exported as `@busy-office/ui/scales`. The raw tier is explicitly NOT
  semver API (values may retune in any release); the semantic tier is
  the stable contract. Docs: /base/colors grid (click-to-copy,
  derived-honest role bands, per-swatch consumer tooltips), /base/tokens
  (per-theme resolution, step cross-links), /base/palettes (ERP-first
  preset cards).

- Added: Key-value facts (`.bo-kv` + `--rows`) — record-header facts as
  a native description list: responsive auto-fit grid, density-aware
  values, tabular-numeric alignment, badges/times compose in `dd`.
  Replaces the readonly-input-as-display-data anti-pattern (the docs
  page states why).

- Changed (not breaking — dist placement is not API pre-1.0):
  `.bo-prose` extracted from the richtext component into its own
  `prose` component (own docs page, own granular dist file) — display-
  only consumers import prose without the editor chrome. Class names
  and behavior unchanged.

- **Breaking** + Added: `.bo-avatar` promoted from Byline's `__avatar`
  part (owner call) — a standalone initials/photo disc plus
  `.bo-avatar-stack` for approval chains, em-sized, forced-colors
  border. Byline now COMPOSES it: markup that carried only
  `.bo-byline__avatar` must add `.bo-avatar`
  (`class="bo-avatar bo-byline__avatar"`) — the old class remains as
  the byline's flex-layout marker but no longer paints the disc.

- Changed: dark-mode `--bo-color-border-control` steps gray-500 →
  gray-400 — on dark muted/hover fills the control border can be the
  ONLY affordance (seamless cells) and gray-500 measured 2.97:1;
  surfaced by two new contrast-gate pairs (border-control on
  bg-hover/bg-muted at 3:1). Dark inputs/selects get slightly lighter
  borders.

- Added: `.bo-btn[aria-pressed="true"]` pressed style (bg-selected +
  accent-text, contrast-gated) — toggle buttons (formatting toolbars)
  now have a visible + programmatic ON state.

- Added: WYSIWYG (display-identical) editable-grid mode — the
  `--seamless` setting now covers every cell type:
  `.bo-select--seamless` (chevron/border appear on hover/focus) and
  `.bo-tag-input--seamless` join `.bo-input--seamless`. Controls stay
  real in both "modes", so keyboard/AT semantics never change; all
  row-edit machinery composes unchanged.

- Added: Rich text chrome (`.bo-richtext` — container, toolbar,
  content area, `--readonly`/`--disabled`) and `.bo-prose` (rendered
  rich content: headings, lists, blockquote, code, lite tables).
  Deliberately NO editing engine — the docs show the native
  contenteditable light case (six consumer lines) and the
  mount-a-real-editor recipe; sanitize stored HTML server-side.

- Added: Tree table (`.bo-tree-table` on a `.bo-data-table` +
  `initTreeTable()`) — hierarchical rows (BOM explosion, account
  rollups): expand/collapse via disclosure buttons on a PLAIN table,
  deliberately not `role="treegrid"` (ADR in `.roundtable/` — native
  SR table browse mode wins for read-mostly hierarchy). 12 indent
  levels; collapse spans tbody boundaries; a toggle with no deeper
  rows is inert (the chevron never lies); nested collapsed state
  preserved on re-expand; `bo:tree-toggle` dispatched
  (row/level/expanded — the fetch-on-expand and expand-all hook).

- Added: six ERP brand palettes — `@busy-office/ui/css/brand-graphite`
  (monochrome slate), `brand-cobalt` (enterprise blue), `brand-navy`
  (deep conservative blue), `brand-forest` (green), `brand-indigo`,
  `brand-violet` — each gated through the full 32-pair AA contrast
  check in both themes; a generated Palettes reference page documents
  every swatch/token/hex from the shipped CSS. (The muted quartet —
  mauve/olive/mist/taupe — briefly existed as presets within this
  unreleased cycle; they remain available as extended scale RANGES,
  owner lineup decision 2026-08-16.)

- Docs/meta: build-time syntax highlighting on every docs code block
  (token-mapped to gated core pairs, none-left-behind build gate);
  versioned docs snapshots with a header version switcher, frozen-docs
  banner, and a release-flow gate (a versions.json entry without a
  committed snapshot fails the build); docs sidebar regrouped
  (learning-path order, workflow-grouped patterns, adjacency pairs).

- **Breaking** (contract shape of a stable behavior, per the freeze
  policy): `initRowEdit()` now tracks, resets, and baselines `<select>`
  elements in editable rows, not just inputs/textareas. If your
  `data-row-edit` rows already contain selects, Cancel now restores them
  to their default selection (previously untouched) and re-fires
  `change` on a genuinely-reset select so dependent behaviors re-derive;
  Save now baselines their selection. A select `change` also marks the
  row dirty. Needed so money (currency) and quantity (unit) selects
  compose into editable rows with correct Cancel/Save semantics.
  Extended in the same release: checkboxes/radios reset to
  `defaultChecked` and baseline symmetrically; Cancel announces every
  genuinely-restored field with a real bubbling `input` event (realtime
  listeners — auto-sum, custom subtotal math — must see values revert,
  or a cancelled edit leaves totals stale). Save/Cancel now move focus
  to the row's first usable field before hiding themselves when the
  activated button held focus — previously keyboard focus silently
  dropped to `<body>` mid-table on every save/cancel (WCAG 2.4.3,
  grill find).

- Added: `initRowEdit()` advanced-table surface (Slice 18): a
  `bo:cell-change` event on every committed cell edit (rowId / field /
  value — the realtime feed for custom subtotal math), a
  `bo:row-cancel` event after native fields restore (the hook for
  restoring consumer-rendered cell content like tag-input chips), tag
  events (`bo:tag-add`/`bo:tag-remove`) marking their row dirty, and a
  second save model: `data-row-edit="live"` dispatches `bo:row-save` on
  every committed change and re-baselines — no Save/Cancel buttons
  (batch mode unchanged, still the default). Hardened by the Slice 18
  close-out grill: live saves are microtask-deferred and coalesced per
  row per tick (so same-tick money/unit reformats land before the save
  reads the row, and a row removed in the same tick is never saved or
  mutated), and a mid-Cancel restore can never trigger a save or dirty
  state (the select-reset change previously turned Cancel into a Save
  of the abandoned values).

- Added: `initTableSum()` — declarative realtime column totals: any
  element with `data-sum-of="<field>"` inside a table live-updates to
  the sum of tbody fields with that `name`; decimals from the widest
  step among summed inputs, `data-decimals` overriding. The auto-sum
  half of Slice 18's subtotal contract (a deliberate, documented
  exception to "you do the data"; the custom-math half is
  `bo:cell-change`).

- Added: Money field (`.bo-money` + `initMoneyField()`) — a currency
  select linked to an amount input; changing currency re-derives the
  input's `step`/decimals from a built-in ISO 4217 minor-units table
  (exceptions only, everything else 2) and reformats the value
  **losslessly only** (pads/trims zeros, never rounds — hardened by the
  Slice 18 close-out grill: a value that doesn't fit the new precision
  keeps its digits and surfaces via native step mismatch; values beyond
  MAX_SAFE_INTEGER are left alone), dispatching a real `input` event on
  an applied reformat. `data-decimals` on the selected
  option or container overrides the table. `currencyDecimals()` exported.
  A deliberate, documented exception to "your app owns the data" —
  built-in but always overridable.

- Added: Quantity read-only display (`.bo-quantity--display` with
  `__value` + `__unit`) and an interactive unit select
  (`select.bo-quantity__unit-select`): changing unit re-derives
  `step`/decimals from a built-in common-ERP unit table with the same
  `data-decimals` override contract and the same lossless-only
  reformat. **Unknown units leave the field's precision entirely
  alone** (hardened by the grill — real master-data UOM codes are
  rarely the table's exact strings, and an unknown unit must never
  rewrite a value; `unitDecimals()` returns `undefined` for them).

- Added: Tag input (`.bo-tag-input`) — multi-value entry for cost centers,
  approval-routing recipients. Real JS (no native element covers this,
  same class as Combobox): `initTagInput()` dispatches `bo:tag-add` on
  Enter (you validate/dedupe and render the chip) and owns removal
  directly (`bo:tag-remove` + deletes its own rendered chip) on a
  remove-button click or Backspace-in-an-empty-field.

- Added: File upload (`.bo-file-input`, `.bo-file-dropzone`, `.bo-file-list`)
  — styled native `<input type="file">` via `::file-selector-button`, a
  bigger drag-target composition, and consumer-rendered selected-file row
  styling. Optional `initFileDropzone()` behavior adds drag-over
  highlighting and forwards a drop anywhere in the zone into the input's
  FileList (dispatching a real `change` event).

- Added: Segmented control (`.bo-segmented`) — a toggle between 2-5
  mutually exclusive views (My approvals / Team approvals, report-range
  switcher), built on real radio inputs (zero JS, native keyboard
  arrow-navigation and group semantics).

- Added: a generated Accessibility Conformance Report (`dist/acr.json`,
  `@busy-office/ui/acr`, rendered at `/reference/acr`) -- 16 WCAG 2.2 A/AA
  criteria with verdicts and remarks assembled from the same evidence the
  other build gates already produce (contrast, keyboard map, event/ARIA
  coverage, a forced-colors source scan). Gated: a remark citing a
  nonexistent component fails the build.

- Fixed: combobox `commit()` now dispatches a real `input` event (in
  addition to `bo:combobox-select`), so committing an option composes with
  any generic form-field listener — e.g. `data-row-edit`'s dirty tracking,
  which previously never saw a combobox-in-a-cell commit. Guarded against
  re-triggering the combobox's own filter listener.

- Docs/meta: per-behavior keyboard support is now generated, gated API
  documentation (`dist/keymap.json`, `@busy-office/ui/keymap`) rendered as a
  table on the JS behaviors page; the docs site gained a skip-to-content link.

- Fixed (forced-colors): three states whose only visible channel was a
  background now survive Windows High Contrast — skeleton bars render as
  outlined boxes instead of vanishing, the combobox active option repaints
  with `SelectedItem`/`SelectedItemText`, and the stepper's current marker
  gains a `CanvasText` ring (done/pending already differed by glyph).
  CDP-emulation verified.

- Fixed: the library no longer ships `color-scheme: light dark` on `:root` —
  a CSS-only page with no `data-theme` under a dark OS got a light page with
  dark native scrollbars/form chrome/date pickers (mixed mode). Default is
  now `light`; `[data-theme="dark"]` still switches to `dark`. Apps that
  want the pre-paint gap to honor a dark preference add
  `<meta name="color-scheme" content="light dark">` themselves (the docs
  site does). This was also the root cause of the long-mystified "solid
  square checkbox" in automated screenshots.

- Fixed: combobox input↔listbox resolution now prefers the shared
  `.bo-combobox` container over document-wide id lookup, so two widgets left
  with identical ids by a duplicated partial-swap fragment stay
  self-contained instead of widget #2 silently driving widget #1. The
  documented `aria-controls` contract is unchanged; the document-wide lookup
  remains as fallback. (Objective-review find; regression test added.)

- Docs/meta: `bo:*` intent-event payloads are now generated, versioned API
  (`dist/events.json`, `@busy-office/ui/events`, two-way parity gate);
  README claims (size/behaviors/events) are stamped from dist behind a
  build gate — the hand-written "37 kB" claim is corrected to the generated
  56 kB min / 9.3 kB gz.

## 0.1.1 (2026-08-15)

Metadata-only patch — no CSS/JS changes.

- Fixed: `repository` URL in package metadata pointed at a nonexistent repo
  (`ThePFMind/…`); corrected to `Busy-Office/busy-office-ui`, so the npm
  package page's Repository link resolves.
- Added: `.github/workflows/publish.yml` — releases now publish via npm
  Trusted Publishing (OIDC, provenance attestation). Owner-triggered as
  before: publishing a GitHub Release with tag `v<version>` is the trigger.

## 0.1.0 (2026-08-15)

**First published release** — `@busy-office/ui@0.1.0` on npm (public,
`busy-office` org), published by the owner after the session's freeze
audits, three review passes, and the registry-install smoke test
(93.9 kB tarball, dist-only, 16 behaviors, brand preset, icon set all
verified present from the registry). Pre-1.0 semver: minors may still
break, per the policy above. Everything below was developed unreleased
and ships in this version.

### Breaking (pre-release churn)
- **Prefix renamed `eof-` → `bo-`** (classes, custom properties, layer names,
  container names, keyframes). "eof" was a placeholder ("Enterprise/Office
  Framework") that read as End-Of-File; `bo-` matches the busy-office brand and
  is shorter in dense markup. Historical documents (.roundtable/, older CHANGELOG
  entries) intentionally keep the old spelling.
- `.eof-data-table__footer` moved from `pagination.css` to `data-table.css` (its
  namespace owner). Pagination-only importers must also import the data-table file
  to style the footer.
- Dropdown rebuilt from `<details>` disclosure to native `[popover]` (top layer);
  markup contract changed — see the Dropdown docs page.
- `initDialogs()` no longer accepts a root argument (delegation made it a no-op).
- Firefox floor raised 121 → 128 (`content` alt-text syntax).

### Fixed (consumer-gauntlet findings, examples/po-app)
- `./package.json` added to the exports map (`require.resolve` from consumers
  failed with ERR_PACKAGE_PATH_NOT_EXPORTED).
- Canonical table recipe now shows `name`/`value` on row checkboxes so
  selections are actually POSTable via `hx-include` or a form.

### Added
- Behaviors manifest (`dist/behaviors.json`, `./behaviors-manifest` export):
  the JS API surface — exports, contracts, DOM hooks — generated from source and
  asserted against `dist/js/index.d.ts`; drives llms.txt and the landing count
  (closes the CSS-true-but-not-JS-true gap).
- Contrast coverage guard: build fails if a component pairs text on a background
  token (incl. via `--bo-cell-bg` indirection) not in the checked PAIRS list.
- Slices 1–3: tokens/density/dark theme, primitives, button, badge, forms
  (fields/sections/inline edit), dense data table (selection/pagination/filters/
  saved views), tabs, dropdown, alerts/toasts, navigation (sidebar/off-canvas),
  dialog, dashboard (widgets/stat tiles), approval timeline, audit trail, stepper.
- JS behaviors (delegation, call-once): dialogs, data tables (+`refreshDataTable`),
  tabs, dropdowns, alerts.
- Build rule: every `@container` query is named (enforced at build time).
- **Slice 4 — Records & approval**: byline, ordered list (mono/`--plain`/
  editable rows), record-type badge, small & danger-ghost button variants,
  widget band footer; `.bo-composer` for approval-thread comments.
- **Slice 5 — Docs UX + ERP data-entry**: Amount field (`.bo-amount`); Cmd/Ctrl+K
  command palette; opt-in Motion module (8 reduced-motion-safe animations);
  the `new:component` scaffold generator + page-shape build gate (gate 7).
- **Slice 6 — Component depth + a11y hardening**: Skeleton/State (empty/error)
  components; ARIA-grid keyboard nav (opt-in `initDataGrid()`/`refreshDataGrid`
  on `.bo-data-table`); Quantity field (`.bo-quantity`, opt-in `initQuantity()`);
  Breadcrumb (`.bo-breadcrumb`); Multi-step wizard (opt-in `initWizard()`);
  Saved-view URL persistence (opt-in `initSavedViews()`); RF-scanner scan-input
  (opt-in `initScanInput()`, `bo:scan` event); `forced-colors` (Windows High
  Contrast Mode) fallbacks on button/badge/dialog/offcanvas/data-table.
- **Slice 7 — docs IA + polish**: Date field (`.bo-date`, display-only, mirrors
  Amount/Quantity); inline validation summary (opt-in `initValidationSummary()`);
  first real theme preset (`@busy-office/ui/css/brand-indigo`) with its own
  contrast-gate validation; "Data display" docs grouping.

- **Slice 8 — editable table, multi-select dropdown, searchable dropdown**:
  multi-row inline edit (`data-row-edit` + opt-in `initRowEdit()`) —
  per-row dirty state (reuses the error-row visual channel, amber instead
  of red) with Save/Cancel, `bo:row-save` event for the consumer to
  persist. Multi-select dropdown (`data-multiselect` on
  `.bo-dropdown__menu` + real checkbox items) — stays open across
  selections, trigger label reflects a live selection count, no new init
  function (folded into `initDropdowns()`). Combobox (`.bo-combobox` +
  opt-in `initCombobox()`) — WAI-ARIA APG combobox pattern, single-select
  list autocomplete with a top-layer `[popover]` listbox, `bo:combobox-
  select` event on commit.

- **Slice 9 (in progress) — Objective-review scoping follow-ups**: `bo:scan`
  live-region announcement — opt-in `aria-describedby` + `data-scan-status`
  markup contract, `initScanInput()` announces "Scanned {value}" on each
  scan for screen-reader/low-vision RF users; fully backward compatible.
  Data-table toolbar — column visibility + export (`initTableToolbar()`):
  `data-col-toggle` checkboxes (composed with the existing multi-select
  dropdown) show/hide matching `data-col` cells; `data-table-export`
  dispatches `bo:table-export {format}` for the consumer to persist. Zero
  new CSS. Load-more pagination (`initLoadMore()`): `[data-table-load-more]`
  dispatches `bo:table-load-more` on click, or on scroll-into-view with
  `data-load-more-auto` — consumer fetches/appends; zero new CSS. Login
  and App Launch pattern pages (both zero new CSS). Nine ultrareview
  findings fixed in one batch (see that commit for the list). Grouped
  rows + subtotals documented as a composition (no component needed —
  proven in po-app's `/spend`). `.bo-progress` — styled NATIVE
  `<progress>` (platform value/max + progressbar role, zero JS/ARIA),
  base + `--warning`/`--danger` tones, three new 3:1 fill-on-track
  contrast pairs (which caught a latent dark-theme `warning-strong`
  token gap, now remapped). `.bo-tree` — hierarchy navigation on native
  `<details>/<summary>` (zero JS/ARIA), explicitly navigation rather
  than an APG TreeView.

- **Slice 11 — CSS icon set**: `.bo-icon` — mask-image data-URI glyphs
  painted by `currentColor` (themable, zero JS/fonts/requests, `1em`
  density-tracking); 12 original ERP glyphs; explicit forced-colors
  opt-out (mask icons otherwise vanish); App Launch upgraded from
  initials to icons. Deliberately not a library — one-line extension
  documented, inline `fill="currentColor"` SVG equally first-class.

### API freeze audit (2026-08-15)

Prompted by the 1.0 exit checklist's own finding — the public API had never
had a deliberate "diff the surface, decide what's still churning" pass; this
is that pass. Result: 21 components / 165 CSS classes / 56 semantic color
tokens / 12 JS behaviors reviewed. **No renames, no removals — additive
only** since the `eof-`→`bo-` rename above (the one real breaking change
this project has made). Per-item calls on everything added in Slices 6-7
(the newest, least battle-tested surface):

- **Stable, freeze now**: Quantity (`.bo-quantity`, `initQuantity()`) and
  Date (`.bo-date`) — both deliberately mirror Amount's already-stable
  shape, already used in 2+ real docs/pattern pages each, no open design
  questions.
- **Stable, freeze now**: ARIA-grid (`initDataGrid()`), Wizard
  (`initWizard()`), Saved-views (`initSavedViews()`) — each is additive
  (opt-in, doesn't change `initDataTables()`'s existing contract), verified
  against real DOM (not just jsdom) during their own build rounds.
- **Freeze the mechanism, not the specific values**: theme presets
  (`src/css/brand/*.css`) — the FILE FORMAT and build/validation wiring are
  stable (proven this session, reusable for any future hue), but the one
  shipped preset (`brand-indigo`) is a demonstration, not a commitment to
  keep exactly that hue forever — presets are additive opt-in files, so this
  is low-risk regardless.
- **Hold one more cycle before hard-freezing**: `initScanInput()` (`bo:scan`
  event name, `data-scan-terminator` attribute) and `initValidationSummary()`
  (`data-validation-summary`/`data-validation-summary-box` attributes) — both
  are only proven on ONE real pattern page each so far (goods-receipt,
  validation-summary). The *shape* (document-delegation, same as every other
  behavior) is consistent with the frozen set, but the specific attribute/
  event names have had zero real-world usage pressure yet. Recommendation:
  treat as stable-but-not-yet-guaranteed for one more slice; revisit at the
  next freeze pass or before 1.0, whichever comes first.
- **Explicitly NOT API** (per the existing versioning policy, restated here
  for the audit's completeness): per-component dist file paths, the raw
  palette tier (`--bo-palette-*`), component-internal custom properties
  (`--bo-btn-*` etc.).

No code changed by this audit — it's a documentation/decision pass. If a
1.0 push happens before `initScanInput`/`initValidationSummary` get a real
second consumer, that's an acceptable risk to accept explicitly, not a
blocker — noting it here so it's a deliberate choice, not an oversight.

### API freeze audit — addendum (2026-08-15, post-Slices 8-9)

The first audit's own revisit condition fired: it held two items "pending
a second real consumer; revisit at the next freeze pass," and Slices 8-9
shipped both a second consumer for one of them and a batch of new surface
(4 behaviors, 1 component, several attribute contracts) the audit never
covered. Per-item calls, same honesty bar as the original:

- **Graduated to frozen**: `initValidationSummary()` — the condition was
  met exactly as stated: the Login pattern (`/patterns/login`) is now a
  second real consumer of the `data-validation-summary`/
  `data-validation-summary-box` contract, exercised live during its own
  build round. The attribute names survived a second composition without
  needing changes; freeze them.
- **Still held, one more cycle**: `initScanInput()` — goods-receipt
  remains its only real consumer. The contract was *hardened* since the
  first audit (the `data-scan-status` live-region addition, and the
  multi-ID `aria-describedby` fix from the ultrareview) — both additive,
  neither breaking — but hardening under review pressure is not the same
  as a second consumer exercising it. Same recommendation as before,
  unchanged.
- **Stable, freeze now**: multi-select dropdown (`data-multiselect`,
  `data-multiselect-label`, `data-multiselect-count`) — already TWO real
  consumers (the dropdown page's cost-center picker and the data-table
  toolbar's Columns menu), and the contract survived an ultrareview
  finding (icon-children triggers) with an additive fix.
- **Stable, freeze now**: `initRowEdit()` (`data-row-edit`,
  `data-row-state="dirty"`, `bo:row-save`) — deliberately reuses the
  already-frozen error-row-state channel, and the "behavior tracks
  intent, consumer persists" event split is now the established pattern
  across four behaviors; the shape has real precedent pressure even
  where the consumer count is one.
- **Freeze the mechanism, hold the names one cycle**: `initTableToolbar()`
  (`data-col-toggle`/`data-col`, `bo:table-export`) and `initLoadMore()`
  (`data-table-load-more`, `data-load-more-auto`, `bo:table-load-more`)
  — both mirror the frozen intent-event split, but each has exactly one
  docs demo and zero external usage pressure; same "stable-but-not-yet-
  guaranteed" bucket `initScanInput` sits in, same revisit condition.
- **Stable, freeze now**: `.bo-combobox` + `initCombobox()`
  (`bo:combobox-select`, `data-value`, `data-bo-open` is internal) — the
  markup contract is the WAI-ARIA APG combobox pattern, i.e. externally
  specified rather than invented here; the framework-specific surface is
  small and mirrors the dropdown's popover mechanics. `data-bo-open` is
  explicitly INTERNAL state, not API — consumers must not style or read
  it (restated under "Explicitly NOT API").

Net: 16 behaviors, 13 frozen, 3 held (`initScanInput`,
`initTableToolbar`, `initLoadMore`) on the same explicit, dated revisit
condition. No code changed by this addendum.

**Second revisit (2026-08-15, later the same day)**: po-app's PO list
became a real second consumer of BOTH `initTableToolbar` and
`initLoadMore` (columns toggle + export + load-more against a 30-row
paged dataset) — and the usage pressure did exactly what the hold
existed for: it surfaced a contract gap (rows appended after a column
was hidden came back visible) whose fix was already shipped in the
re-runnable init (re-call `initTableToolbar()` after appending, now
documented in the JSDoc and the data-table docs as the same re-call
convention as `initDataTables()`). With the gap found, documented, and
verified live, **both graduate to frozen**. And in the same round,
po-app gained a Receive screen (`/receive` — scan a PO number, receipt
logged, unknown POs toast a warning) as `initScanInput`'s second real
consumer, exercising the full contract including the `data-scan-status`
live region (verified live: "Scanned PO-88210" announced, input cleared,
next scan immediate). **`initScanInput` graduates too.**

**Terminal claim, corrected by the decisions grill (same day)**: 16 of 16
behaviors are **stable against internal usage** — every contract survived
at least two in-repo compositions, with the holds released by real (if
in-house) usage pressure. Calling that "frozen" overreached on two
counts the grill caught: the hold criterion was stated as *external*
usage pressure and po-app is not external; and behaviors frozen by the
morning audit were modified the same afternoon under a "fix" label
(including an observable contract-semantics change: `initWizard()`
install-once → re-runnable). So: **the freeze is provisional until the
1.0-checklist item-12 independent adopter exercises the API. Until
then, any contract-shape change to a stable behavior requires a
CHANGELOG "Breaking" entry — not a fix note.** The per-item audit
machinery stands; only the guarantee language was wrong.

### Design reviews
- `.roundtable/grill-2026-08-11.md` (slice 1), `grill-2026-08-12.md` (slice 2),
  `grill-2026-08-12-slice3.md` (slice 3) — findings, gates, and fix outcomes.
