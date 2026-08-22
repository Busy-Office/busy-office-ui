# Design grill — `/patterns/editable-grid`, comprehensive (roadmap 102.3)

Owner ask, flagged twice (97.2's validation-UX screenshot named this page).
Grilled as the hardest data screen the framework ships: in-cell validation
and row shift while typing (measured live, not assumed), keyboard traversal
across a row, partial save, no-JS degradation. Measured live — fresh build,
nginx bind-mount of `apps/docs/dist`, puppeteer-core via the project's
`browser-harness.mjs`, 1440px + 390px, source-reviewed for colour (theme
toggle could not be forced live via script in this environment — same class
of harness limitation `.roundtable/RESUME.md` already notes for viewport
resize; colour was verified by reading the CSS for hex/rgb literals instead,
which is sufficient for the `colour` dimension's own definition).

`97.2` already measured the in-cell error message's own shift (+22px per
line, before-first-blur vs after). This grill supplies **fresh** measurement
against the current build and finds a **different, previously unmeasured**
shift mechanism (below) — 97.2 remains the cross-surface verdict for the
message shift itself.

## DSA dimensions (rubric.definitions in `dsa-scores.json`)

Same report-only scoring as 102.2 — patterns aren't in `check:dsa-scores`'
scanned set, so no `<DsaScore>` badge, no JSON entry.

| dimension | score | citation |
|---|---|---|
| typography | 3 | Zero raw font-size literals in the page; text sizing comes entirely from `.bo-input`/`.bo-data-table`/`.bo-badge` etc. |
| colour | 3 | Zero hex/rgb in the file. State badges (`Unsaved`, dirty tint) reuse existing two-channel `bo-badge`/`data-row-state` classes. |
| spacing | 3 | Only two inline `style` uses in the file, both intrinsic and tokenized: `style="margin-block-end: 0"` (cancels the field wrapper's stacking gap in a dense cell — commented why) and `style="max-inline-size: 14rem"` / `13rem` (bo-quantity/bo-money width caps, same pattern used site-wide for demo-sizing). No un-explained literal. |
| interaction | 3 | States the platform/behavior line explicitly in "What composes, and what doesn't": `data-grid-nav` is named as deliberately NOT used, with the reason (fights rapid sequential entry); add/remove line is named as "plain app code, not a behavior." |
| content | **was 2, now 3 — fixed this grill.** | Page was on `check:wrong-choice`'s `PATTERN_TODO` (confirmed: no `<strong>Not …</strong>` clause existed). Added: *"Not for a table that's read far more often than edited — a plain data table costs nothing and doesn't ship Save/Cancel machinery nobody triggers,"* linking `/components/data-table`. Removed from `PATTERN_TODO` in `check-wrong-choice.mjs`; gate re-verified green, ratchet 14 → 13. |
| fit | n/a | Same as 102.2 — the rubric's `fit` is field-type × context, not defined for a whole-screen pattern. |

## Screen-as-a-whole grill

**In-cell validation — row shift, freshly measured.** The pre-existing
invalid cell (Qty, "Exceeds on-hand") renders its message on load, no shift
to measure there. Typing a *fresh* invalid value into a clean cell
(Advanced demo, Qty) never sets `aria-invalid` — confirmed by reading
`row-edit.ts`: *"`aria-invalid` is never set by this behavior — it's
server/app-rendered content."* This is correct per the page's own Data
contract (client never invents validation state), but it means the
"in-cell validation" grill target has **no client-side shift to observe
before a server round-trip** — the framework doesn't perform it, by design.

**A different, real shift found instead: going dirty can reflow OTHER
columns.** Revealing the row-actions cell (Unsaved badge + Save + Cancel,
normally `hidden`) widens that cell from 32px → 227px. In a table with
enough columns that width is tight (the Advanced demo: 6 real ERP columns
+ actions), that reallocation compresses the neighboring `Cost centers`
tag-input cell from 252px → 211px, below its content's fit width, wrapping
the "Add…" field onto a second line and growing the WHOLE ROW 54px → 80px
(+26px) — confirmed by an unrelated cell (`Line`) *also* shrinking
139px → 75px in the same measurement, isolating the cause to column
reallocation, not the tag-input's own state changing.

**Confirmed demo-specific, not a framework-wide defect**: the same
measurement on the Medium (74.5px), WYSIWYG (54px), and Composite
(80px) tables shows **zero** height change on going dirty — those tables
have either fewer columns or a fixed-width remove icon instead of
Save/Cancel text, so the actions-cell width delta never exceeds their
slack. Only the Advanced demo's specific column mix reproduces it.

**Verdict: real, live-measured, genuinely useful for a consumer building
a wide ERP grid — but a demo-content interaction, not a `.bo-data-table`
or `.bo-data-table__row-edit-actions` contract bug**, so not something the
framework should patch blindly (e.g. reserving the actions cell's expanded
width unconditionally would waste space on every clean row, everywhere,
to fix one narrow demo). Queued as **roadmap 102.9** rather than guessed
at here, per the same discipline 102.8 used — see that item for why
patching a table-layout interaction without live-verifying every table
this pattern demos risks trading one defect for another.

**Keyboard traversal across a row** — confirmed live via a real DOM query on
the rendered page: `Item → Qty → Unit price → Save (hidden) → Cancel
(hidden) → Remove`, all with `tabIndex 0`, no `data-grid-nav` roving
tabindex anywhere on this page (the page's own prose already says so; this
re-verifies it against the built DOM rather than trusting the prose).
Matches the doc's claim exactly.

**Partial save** — read `row-edit.ts` directly rather than guessing: each
row's dirty/clean state and `bo:row-save` dispatch are fully independent
per `<tr>` (`setDirty`/`saveRow` always operate on one row's element).
Saving row 2 while row 1 is still dirty touches nothing on row 1 — matches
the page's own States table ("Saving (live mode): saves are coalesced per
row per tick") exactly. No gap found; the doc already states this
correctly.

**No-JS degradation — genuinely undocumented until this grill.** Verified
live with `page.setJavaScriptEnabled(false)`: every input stays real,
focusable, and typable (the markup is plain `<input>`/`<select>`, not a
JS-only widget), but `initRowEdit()` is what un-hides Save/Cancel — without
JS, `hidden` never clears, so a row can be *edited* but never *submitted*.
No other pattern page in this repo documents a "No JS" state row, so there
was no existing convention to follow; added one to this page's States
table stating exactly the measured behavior (a native per-row `<form>` +
submit button is the correct no-JS-capable alternative, left for the
consumer since the framework has no opinion on transport).

**Stale label found and fixed while checking Related links**: `editable-
grid`'s `Related` footer linked `/patterns/list-report` labelled "Invoice
list" — the pre-109 name, left behind when Slice 109 renamed the pattern
(loop-log says "4 labels" updated; grep found 4 MORE still stale:
`editable-grid`, `record-detail`, `filter-panel`, `reporting-dashboard`).
Fixed all four to "List report" — same class of drift CLAUDE.md's
"verify a bulk edit against the rendered artefact" section warns about;
this one wasn't caught because the original bulk edit's own verification
didn't enumerate every `Related` array, only the pages it touched.

## Verdict per element

| element | verdict | why |
|---|---|---|
| DSA: typography/colour/spacing/interaction | keep | all cite real evidence |
| DSA: content | **fixed** | wrong-choice clause added, `PATTERN_TODO` ratchet 14 → 13 |
| DSA: fit | not scored | rubric doesn't extend to whole-screen patterns |
| In-cell validation shift | **not a defect** | framework never sets `aria-invalid` client-side by design; 97.2 already covers the message-present case |
| Advanced-table dirty-reflow | **fix (queued, 102.9)** | real, measured, demo-specific — not rushed, same discipline as 102.8 |
| Keyboard traversal | keep | re-verified live against the built DOM |
| Partial save | keep | verified against source; States table already correct |
| No-JS state | **fixed** | new States-table row, live-verified with JS disabled |
| Stale "Invoice list" labels (4 pages) | **fixed** | relabelled to match the Slice 109 rename |

## Gates

Core build (`npm run build -w @busy-office/ui`), docs build (13 chained
gates incl. page-shape/wrong-choice/dsa-scores — wrong-choice ratchet now
14 → 13 patterns outstanding), `check:claims` (86 behaviours, still green),
stylelint, and all 111 `packages/core` vitest behavior tests — all green on
this exact build.
