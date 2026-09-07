# Open threads

Written at the end of the first working session so a new conversation can pick
up without re-deriving anything. Everything else — architecture, foundations,
component inventory, the HTMX correction — is in `readme.md`.

## Decided

- **Track upstream, don't fork.** All modernization lives in `modern/` as an
  opt-in `bo-modern` cascade layer, removable by deleting one `@import` from
  `styles.css`. `modern/PR.md` drafts it as a seven-PR series against
  `Busy-Office/busy-office-ui`.
- **HTML is the canonical API; React is gallery scaffolding.** See
  `react/README.md`. Every component `prompt.md` leads with the HTML form.
- **`ui_kits/erp-app-htmx/` is the accurate kit.** Route contracts come from
  `apps/docs/scripts/check-po-app.mjs`, which boots `examples/po-app` and
  asserts them.

## Next, in priority order

1. **Command palette** — agreed as the next build, not started. Keyboard-first
   action layer over every screen, reusing the product's existing query-token
   grammar (`status:Pending vendor:Stark`) rather than inventing a syntax.
   Accepts document numbers and jump-to-screen. This is the throughput
   counterpart to the readiness panel.
2. **Work queue as home** — extend the reference app's `/inbox` threshold
   routing (under-threshold expands in place, over-threshold links out).
   Documents ordered by what is blocked and what is time-boxed by period close.
   Explicitly *not* a chart dashboard: a chart says a number moved without
   saying which document to touch.
3. **Decomposable numbers** — a total should open into the rows that produced
   it; a derived field should show its lineage. `table-sum.ts` computes totals
   and nothing explains them, which is why users export to Excel.
4. **Saved vs posted** — "saved" currently covers draft, submitted, posted and
   period-closed. Only the last is irreversible and users need to know which
   state they are in before clicking. A document-state strip naming the state
   and what it still allows.
5. **Concurrency resolution, not refusal** — the 409-already-decided response is
   correct but terminal. Show what changed and by whom, then offer merge or
   discard.
6. **Mass change with before/after preview** — apply `/import`'s
   validate-then-apply staging to in-place mass change.
7. **Offline queueing on RF** — a warehouse loses signal and a silently failed
   scan is inventory loss. Local queue, visible sync state, conflict path.

Deprioritized on purpose: charts (reporting-tool territory, same logic as the
framework declining to own a data grid) and AI features, until 3 and 4 exist —
an assistant that cannot explain a number inherits the trust problem rather
than solving it.

## Explorations live apart from recreations

`ui_kits/` is for recreations of what exists; `explorations/future-erp/` is for
what might. The home screen and readiness panel were moved there. The
AI-suggested-resolution layer and voice stubs were removed from the home screen
at the user's request — the queue, palette and explain drawer stand on their own.

## Position on chat-based / agentic ERP

Chat is strong at retrieval, weak at irreversible mutation. Scope it to
**explaining and proposing, never committing**: answer "why is this at
Finance?", and *draft* a staged change a human commits through the normal
readiness gate. Reasons it fails as a primary surface: the audit trail needs
structured actions anyway; coded references (`INV-10234`, `CC-4021`) exist
because natural language cannot disambiguate at volume; power users processing
hundreds of documents a day are slower typing sentences than driving a grid.

Governing principle: **AI proposes into existing structure rather than replacing
it**, so authorization, the audit trail and two-channel state signalling still
apply. The framework's refusals (no data grid, no rich-text engine) keep a
semantic substrate an agent can actually drive.

Non-interface prediction: the binding constraint becomes **master data
quality**. Humans silently compensate for a duplicated vendor; agents amplify it.

## Unbuilt screens with contracts already read

Documented in `apps/docs/scripts/check-po-app.mjs` but not recreated:

- `POST /pos/new` — create form; 422 preserves values, marks only bad fields.
- `/import` — staging: `action=validate|apply`, Apply lands valid rows and
  leaves un-appliable ones listed, Apply disabled when nothing is applicable.
- `/movements` — the 50,001-row **windowed list**. The most interesting one:
  it is the framework's answer for *scanning* workflows, distinct from paging
  for *searching*, and exercises chunk eviction with height-true spacers,
  selection surviving eviction via `[data-windowed-selection-host]`, and
  `aria-rowcount` / `aria-rowindex`.

## Known caveats

- **The source repository has no logo.** "Tall BO" (direction 5a) was designed
  here and lives in `assets/`; it is a project proposal, not an upstream asset.
  All explored directions remain in `brand/logo-directions.html`.
- **The OKLCH values in `modern/color-oklch.css` are not measured** — they are
  published equivalents of the current hexes, round-tripping to ~1%. This repo's
  standard is measured-not-rounded. `modern/PR.md` carries the verification
  checklist; two contrast pairs have no headroom (`text-muted` on `bg-muted`,
  `border-control` on `bg-surface`).
- **The 26 JS behaviours are not ported.** Three are transcribed to plain JS in
  `ui_kits/erp-app-htmx/behaviors.js` for the demo; production installs
  `@busy-office/ui` and calls the real `init*()`.
- **`check_design_system` reports two items permanently**, both correct as-is:
  `Cascadia Mono` is a system fallback name with no font file to upload, and the
  ~121 component-scoped custom properties are the framework's fourth token tier
  plus `modern/`'s `:not([data-theme])` guards. Do not "fix" either.
- **I generated a fake SRI hash** for the HTMX script tag early on, which
  silently blocked it from loading. Removed. Don't trust an integrity attribute
  I produce without verifying it.
