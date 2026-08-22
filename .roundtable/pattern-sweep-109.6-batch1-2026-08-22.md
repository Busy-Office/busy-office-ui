# 109.6 sweep — batch 1 (2026-08-22)

Scope: the 13 `PATTERN_TODO` pages (wrong-choice debt), swept in 4 parallel
agents against `.roundtable/pattern-quality-bar-2026-08-22.md`. Two edits
independently spot-verified against source before trusting them (batch A's
clauses grepped live; the false "every panel would render at once" claim
on `wizard` re-verified against its own markup, found genuinely wrong, and
fixed directly — see below).

## Wrong-choice clauses: 13/13 written, gate green

`node apps/docs/scripts/check-wrong-choice.mjs` → **30 carry / 0 outstanding**
(up from 17 carry / 13 outstanding this morning). `PATTERN_TODO` is now empty.

| page | clause | routes to |
|---|---|---|
| app-launch | not for returning to a record already known | object-page / list-report |
| approval | not for a record with no decision to make | record-detail |
| bulk-actions | not for changing one record | object-page / record-detail |
| field-editor | not for editing many records at once | editable-grid / detail-form |
| filter-panel | not for one obvious narrowing dimension | list-report |
| goods-receipt | not for a desk-based clerk with a packing slip | detail-form |
| list-report | not for a single record's full detail | record-detail / object-page |
| login | not for re-authentication mid-task | dialog |
| reporting-dashboard | not for an actionable worklist | inbox / job-monitor |
| settings-admin | not for one end user's own preferences | detail-form |
| staging | not for a handful of records | detail-form |
| value-help | not when the option set is small | (native select, no link needed) |
| wizard | not for a routine single-step task | detail-form |

## Bar scorecards: 13/13 pages scored, pass/fail per line

Common failures across all 13 (systemic, not per-page defects):
- **Human-monitoring signals named** — FAIL on 12/13 (login is N/A, single-actor).
  No pattern page yet has the AI-manages/human-monitors sentence the 109.3
  owner-quartet requires. This is the largest single gap the sweep found.
- **No-JS row in States table** — FAIL on 12/13 before this batch; **wizard's
  is now fixed** (see below) — 1/13.
- **Print behaviour stated** — FAIL or unaddressed on 10/13.
- **Deliberately-not-used note** — FAIL on 9/13; PASS where present is
  notably strong (bulk-actions, staging both argue against an editable-grid
  alternative with real reasoning).
- **Keyboard walkthrough** — FAIL on 9/13, including wizard despite its
  Back/Next/Submit traversal being exactly the shape the bar wants walked.
- **Shape-not-domain (109.5)** — 2 borderline: field-editor's own framing
  ("Master-data maintenance — the SM30 case") and filter-panel's aria-label
  ("Invoice filters") lean domain-flavored despite generic anatomy.
  Not fixed this pass — flagged for a future item, since 109.5 is closed as
  a stated rule and re-opening it here would be scope creep on 109.6.
- **Intrinsic-dimension literal comments** — mixed: list-report/reporting-
  dashboard/value-help/wizard have uncommented literals; login's is
  correctly commented (the one page that got it right).

## Real defect found and fixed (not just scored): wizard's false claim

`wizard.astro` claimed *"Without [`initWizard()`] every panel would render
at once and Back/Next would be inert."* False as written: panels 2+ already
carry a static `hidden` attribute in markup, so they stay hidden without JS
regardless — only Back/Next/Submit-reveal are actually JS-dependent. Verified
directly against the page's own markup (`grep hidden`) before touching it,
per the instrument-first-output-not-evidence discipline — a sub-agent's
finding is exactly that, a first output. Fixed: corrected the prose and
added the missing "No JS" States row, matching the CLAUDE.md executable-
claims doctrine (a claim about browser behavior that nothing checks is a
claim that can be wrong for a long time).

## 109.4 verdict: field-editor FOLDS

Bar-derived, not taste (per 109.4's own instruction). field-editor:
- Fails shape-not-domain (framed by SM30, not shape).
- Its anatomy is, by the page's own words, "the data table with `data-row-
  edit`... nothing here is a field editor component" — same four elements
  editable-grid already documents, plus ordinary form controls.
- Data contract and States collapse to editable-grid's per-row-save shape
  with a narrower cardinality (fields-of-one-record vs. rows-of-many).
- Fails human-monitoring split, keyboard walkthrough, deliberately-not-used.
The one real, load-bearing distinction — single-Save-at-bottom, one-record
scope — is expressible as a variant paragraph on `editable-grid` or
`detail-form`, not a standalone six-section page. **Verdict: fold into
detail-form/editable-grid, redirect the URL.** Execution (the actual fold +
redirect) is separate follow-up work, not scored here.

## What remains open for 109.6

The other pages needing bar-scoring (not wrong-choice — those already carry
the clause from prior work): `detail-form`, `inbox`, `job-monitor`, `kanban`,
`master-detail`, `notification`, `output-form`, `record-detail`, `report`,
`role-home`, `schedule`, `command-bar`, `validation-summary`, and the three
`patterns/rf/*` variants (already covered by the separate 109.7 RF-family
grill — likely exempt from re-scoring, to be confirmed when this continues).
`object-page` and `editable-grid` are already fully covered by their own
102.2/102.3 grills and don't need re-scoring.
