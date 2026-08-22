# 109.6 sweep — batch 2, and full-catalogue tally (2026-08-22)

Scope: the 13 non-TODO pattern pages (already carried a wrong-choice clause
from prior work), bar-scored in 3 parallel agents against
`.roundtable/pattern-quality-bar-2026-08-22.md`. Combined with batch 1, this
closes 109.6: **all 26 non-RF, non-already-grilled pattern pages** now have
a recorded per-page verdict (RF variants exempt, covered by 109.7;
object-page/editable-grid exempt, covered by their own 102.2/102.3 grills).

## One more real defect found and independently verified before fixing

`schedule.astro` claimed the narrow-screen stack was "the calendar
component's own container breakpoint." Verified false against
`packages/core/src/css/components/calendar/calendar.css` directly — it
carries no `@container`/width `@media` query at all, only a
`forced-colors` one (`grep`-confirmed, single match, line 146). Corrected:
the stack is `.sched-split`'s own auto-fit grid, not the calendar's.
Verified the fix landed (line 171 now reads correctly) before counting it.
This is the second sweep in a row where a batch's flagged claim turned out
to be genuinely wrong on inspection — both caught only because the
instrument-first-output-not-evidence discipline was applied to the
sub-agents' own findings, not just to their extractions.

No other batch found a false claim; all runtime claims on the remaining 11
pages were checked against `check-claims.mjs` and matched, or the page had
no such case to check.

## Full-catalogue tally (26 pages scored)

**No-JS States row** — missing on **25 of 26** pages. The lone exception is
`wizard`, fixed in batch 1. This is now the single largest, most uniform gap
the sweep found — large enough that fixing it page-by-page inside this sweep
would have been "silently rewrite 25 pages," which the sweep was explicitly
told not to do. **Queued as 109.8.**

**Human-monitoring signals named (in Anatomy specifically)** — of the pages
where it's applicable (excludes single-actor/non-monitoring screens like
login, detail-form, record-detail's non-monitoring reading, staging, etc.):
- **Done right** (explicit sentence, correctly placed in Anatomy): `inbox`,
  `kanban`.
- **Stated, but in Data contract instead of Anatomy** (the bar names
  Anatomy specifically): `job-monitor`, `notification`, `output-form`,
  `role-home` (partially — prose exists but not tied to named regions).
- **Missing entirely** despite being monitoring-adjacent: `schedule`,
  `master-detail`, `reporting-dashboard` (batch 1), `record-detail`.
Two different defects bundled in one bar line: placement (fixable by
relocating/duplicating one sentence, cheap) and absence (needs real
authoring). **Queued as 109.9**, split into the two classes.

**Data contract 4xx/error row missing** — `master-detail`, `notification`,
`output-form`, `record-detail` (batch F); likely more in batch 1's set,
not independently re-tallied here (batch 1's own report doesn't break this
out per-page). **Queued as 109.10**, batch F's four confirmed, batch-1 set
to be re-checked when picked up.

**check-claims.mjs has zero cases** — `inbox`, `job-monitor`, `kanban` (all
three, confirmed by grep in batch E). This is the most serious finding: it
means these three pages carry runtime-behavior prose (polling, arrow-key
nav, move-menu, retry/cancel) that CLAUDE.md's executable-claims rule
requires be checked, and isn't. **Queued as 109.11**, P0-adjacent — this is
the exact doctrine the schedule.astro/wizard.astro fixes exist to enforce,
just not yet wired for these three.

**Small, page-specific, mechanical** (each a one-line fix once picked up):
- `kanban` — horizontally-scrolling lane cluster lacks `tabindex="0"` on
  its own scroll container (the lane cluster, not the Move-menu popover).
- `record-detail` — Anatomy list items aren't linked to their components
  (only page in the catalogue missing this); Opener lacks a "how often"
  clause; no Data-contract 4xx row (see above).
**Queued as 109.12.**

## What passed cleanly, worth noting

`kanban`'s deliberately-not-used reasoning (drag explicitly rejected with
an ARIA-deprecation citation) and `bulk-actions`'/`staging`'s (batch 1) are
the strongest examples of that bar line in the catalogue — worth using as
the model when 109.9-109.12 add the missing ones elsewhere. `command-bar`
and `validation-summary` were flagged as possibly not fitting the six-
section shape; both checked out as full patterns with the complete shape
plus bonus sections — not a finding, the concern didn't survive contact.

## 109.6 Accept, re-checked

"Per-page verdict recorded for every pattern page" — met: 26/26 (2 exempt
via prior grills, 3 RF exempt via 109.7). "Wrong-choice clauses done" — met
in batch 1 (30/30, gate green). **109.6 closes here.** The findings above
are not fixed by this item — they're queued as 109.8-109.12, per the
sweep's own scope (score and find, don't silently rewrite the catalogue).
