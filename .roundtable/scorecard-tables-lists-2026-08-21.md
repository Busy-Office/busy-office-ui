# DSA batch 1 — Tables & lists (2026-08-21)

First family batch under roadmap 94. Order set by blast radius: this
family leads because `data-table` is the densest surface an ERP user
lives in.

| component | Hier | Typo | Colour | Spacing | Inter | Content | Fit | DSA |
|---|--:|--:|--:|--:|--:|--:|--:|--:|
| `pagination` | 3 | 3 | 3 | 3 | 3 | 3 | 3 | **100%** |
| `tree` | 3 | 3 | 3 | 2 | 3 | 3 | 3 | **95%** |
| `tree-table` | 3 | 3 | 3 | 2 | 3 | 3 | 3 | **95%** |
| `ordered-list` | 3 | 3 | 3 | 2 | n/a | 3 | 3 | **94%** |
| `data-table` | 3 | 2 | 3 | 2 | 3 | 3 | 3 | **90%** |

**No component hit the grill trigger** (total <80% or any dimension ≤1).
The family is on-direction; every deduction is an uncommented literal.

## Two findings the batch surfaced

**1. A naive signal was wrong, and the context cleared it.** The hex grep
flagged 3 raw colours in `data-table.css`. In context they sit inside
`@media print` — where theme tokens would be actively WRONG (printing a
dark-theme token to paper). Not a defect; Colour scored 3. Recorded
because the next sweep will grep the same thing and should not re-raise
it.

**2. `inline-editing` and `table-toolbar` are not components.** Neither
appears in `api.json`; both are docs pages for `data-table`'s opt-in
FEATURES (`data-row-edit` + `initRowEdit`; `data-col-toggle` +
`initTableToolbar`). They correctly have no CSS file of their own. So
the family is **5 components + 2 feature pages**, and they take no DSA
score — a score would imply a design surface that does not exist. The
sidebar counting them alongside components is not a defect either: a
reader looking for row editing looks under Tables & lists.

## Queued

- **94.1** — `data-table`: tokenize or comment the raw `0.9em`
  `__col--code` size and the two `1.75rem` compaction row-heights (the
  only reason it is not 95%+).
- The 2/3 Spacing scores on tree / tree-table / ordered-list are all
  intrinsic em-relative sizes (indents, chevron/disclosure boxes) that
  are correct but uncommented — same shape as 92.5, batched with it.
