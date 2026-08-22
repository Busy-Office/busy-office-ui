# 104.3 — complexity scale defined, badges re-read, ladder audited (2026-08-22)

Owner add-on to Slice 104: "ensure comprehensive patterns (simple to
complex)", following the owner's own grill of the badge distribution, which
found the 1-4 scale defined nowhere and anti-correlating with every
extractable measure (component count, behavior-init count). This report is
part (a)+(b)+(c) of 104.3's Accept, in order.

## (a) The definition

The scale measures **how many independently-live loci of state the screen
must track at once**, not implementation size (component count, JS init
count). Measured this way because the roadmap's own anti-correlation
examples are exactly what a size-based reading gets backwards: `approval`
(3) has the surface's *minimum* component count (2, zero behavior inits)
because a permission-gated state machine costs almost nothing to render;
`login` (1) ships three behavior inits (autofill, validation, submit
guard) for a single binary outcome; `record-detail` (1) has eight
component badges because it *displays* a lot, while none of it is ever
"in progress" at once.

- **Level 1 — no committed state of its own.** Nothing is ever "unsaved"
  or "in progress" when the reader leaves: a read-only view, a static
  launcher, a search-and-navigate, a single binary sign-in attempt.
  Anchor: `record-detail` — every field renders, none is ever dirty.
- **Level 2 — exactly one committed locus is ever live at a time.** One
  record, one query, one picked value — even across many fields, there is
  a single clean/dirty flag, not several tracked independently. Anchor:
  `detail-form` — one whole-record `Pristine → Dirty → Saving` state; all
  fields commit together, so there is only ever one flag to track,
  regardless of the field count.
- **Level 3 — one of: (i) a state that outlives the visit and changes by
  another actor's decision (a permission-gated workflow, a multi-step
  sequence gated on completing the prior step); (ii) a one-shot batch of
  N items that resolve together and are not re-editable on the same
  screen; or (iii) N sub-units *within one record* that can independently
  be dirty/saving/error at the same time.** Anchor: `approval` for (i) —
  the record's state (pending/approved/rejected) persists across visits
  and only an approver's action moves it. Anchor: `bulk-actions` for (ii)
  — select many, act once, each row's outcome is terminal. Anchor:
  `field-editor` for (iii) — its own States table: *"Saving a row:
  `aria-busy` on that row only; every other row stays editable"* — that is
  multiple independently-live units, just bounded to one record's fields
  rather than many records.
- **Level 4 — N independently-live, continuously-editable units *across
  records*, each able to be in a different transient state from its
  neighbors at the same time, ongoing rather than resolved in one batch
  submit.** Uniquely `editable-grid` — N rows × M cells, each cell's own
  dirty/valid/saving state, live concurrently, no "submit once" moment.
  This is what keeps level 4 distinct from level 3(iii): multiplicity
  *within* one record (field-editor) is a lesser degree of the same shape
  than multiplicity *across* many records (editable-grid).

**A property this definition deliberately does NOT use: whether the
States table names a "permission" row.** CLAUDE.md's pattern recipe
requires every pattern page to document a permission state and a conflict
state (item 5 of "How to document a PATTERN") — so presence of a
permission row is baseline compliance, true of all 27 pages, and would
have been exactly the "reads uniformly across everything" failure mode
94.7/101.3's stop rule names. The discriminating property is *concurrent
multiplicity*, which is genuinely absent from most pages.

## (b) The 27 badges re-read

Counted this pass: **27** pattern pages carry exactly one badge (the 21st
file counted in the original roadmap text, `rf/goods-receipt-rf.astro`, is
still the documented gate-exempt iframe fixture; the page count grew from
20 to 27 between 2026-08-21 and today as Slices 108-111's grills queued
and landed new patterns — comprehensiveness work, not re-litigated per
this item's own text).

**Three corrections**, each on the concurrency axis above, not a vibe:

| Page | Was | Now | Why |
|---|---|---|---|
| `value-help` | 3 | 2 | Single locus (one field, one pick session), no permission gating, no batch, no intra-record multiplicity. Matches `master-detail`'s "single record, single actor" shape, just picking a value instead of a whole record. |
| `detail-form` | 3 | 2 | One whole-record dirty flag (`Pristine/Dirty/Saving/Field error/Read-only/Conflict` — all describe the SAME form's state, not independent per-field state). No intra-record multiplicity, no batch, no cross-visit-persisting workflow (the Conflict row is a one-time 409, not a state that outlives the visit). |
| `field-editor` | 2 | 3 | Its own States table documents genuine concurrency: `"aria-busy on that row only; every other row stays editable"` — multiple fields can be independently live/saving/error at once. This is the level-3(iii) property, previously under-scored. |

**Incidental fix, found while editing the badge lines on `detail-form` and
`value-help`:** both carried a stale `"— capture &amp; edit tier."` suffix
next to the badge — leftover from the pre-Slice-109 three-tier taxonomy
(`capture & edit` / `review & approve` / `overview & shell`), which
`pattern-groups.mjs` replaced with six job-family groups. Neither page's
current group is "capture & edit" (`detail-form` is in *work one record*,
`value-help` is in *enter & find*), so the suffix was actively wrong, not
just stale. Removed on both — matches the plain-badge format
`field-editor.astro` already used with no suffix.

**Noted, not touched:** `list-report.astro` ("read-many-records tier.")
and `object-page.astro` ("overview & shell tier.") carry the same
"— … tier." suffix pattern, but their phrases don't cleanly match either
the old three-tier taxonomy or the current six-group taxonomy, so I can't
prove they're wrong the same direct way (unlike the two above, which
named a group that provably isn't their group). Left alone — a genuine
candidate for a future Standardize prose sweep, not this item's scope.

New distribution: `{1: 4, 2: 14, 3: 8, 4: 1}` (previously `{1: 4, 2: 13,
3: 9, 4: 1}` against the stale 20-page count; corrected count is 27 pages
total, net effect of the three corrections is zero change to totals per
level since two moved down and one moved up).

## (c) Per-group ladder audit

Current groups from `pattern-groups.mjs` (six job families, Slice 109),
entry/top rung after the (b) corrections:

| Group | Rungs present | Entry | Top | Gap? |
|---|---|---|---|---|
| enter & find | 1,1,1,2,2,2,2 | 1 | 2 | none |
| work one record | 1,2,2,3 | 1 | 3 | none |
| enter & correct data | 2,3,3,3,4 | 2 | 4 | **no rung-1** |
| decide & clear queues | 2,3,3,3 | 2 | 3 | **no rung-1, no rung-4** |
| monitor & output | 2,2,2,2,2,2 | 2 | 2 | **flat — no 1, 3, or 4** |
| RF / rugged devices | 3 | 3 | 3 | n/a (1-page track, see below) |

This reproduces the roadmap's own provisional reading almost exactly
(it said *"capture & edit spans 2–4 with no rung-1"* — confirmed) and adds
two more real gaps the provisional note didn't cover, since it was written
before the current six-group taxonomy existed.

**Verdicts, each run through the 99.4 front door (grill need first;
refusing is valid):**

- **enter & correct data, missing rung-1 — REFUSE.** A genuinely
  level-1 "enter data" task has no committed state of its own by
  definition (level 1's own anchor), which contradicts the group's whole
  point (data IS being entered/corrected, i.e. committed). A trivial
  single-field edit that never needs a dirty flag is a plain `<input>`
  inside *someone else's* form — the component page's job
  (`/components/form`), not a distinct pattern screen. No fix needed; no
  new item queued.
- **decide & clear queues, missing rung-1 — REFUSE**, same shape: a
  "decide" action that reviews nothing and commits nothing isn't a
  decision. The group's floor is inherently level 2 (review one thing,
  act on it).
- **decide & clear queues, missing rung-4 — REFUSE.** Continuous,
  concurrently-live per-item editing in a decide/clear-queue context is
  exactly what `editable-grid` already covers (linked from
  `bulk-actions`'s "if you need per-cell correction instead of a one-shot
  action, see editable grid" cross-reference — confirmed present). A
  fourth queue pattern duplicating that shape would fail the Objective's
  reusability test (§3, "reuse requires copy-paste-modify — extract the
  reusable core instead").
- **monitor & output, flat at rung 2 — REFUSE, not a gap.** Every page in
  this group is inherently single-locus by its own job: glance at a
  number, drill into one thing, no editable state (`output-form` isn't
  even interactive — "who uses it: nobody, on screen"). Neither a
  level-1 nor a level-3+ monitor pattern is missing; the group's whole
  *j*ob is bounded to level 2. If a genuinely more complex monitoring
  surface is ever needed (a live streaming ops console with
  permission-gated interventions), that would be a new job family, not a
  missing rung in this one.
- **RF / rugged devices, single-item group — DEFERRED to 109.7.** 109.7
  ("the RF pattern family: grill the owner's four candidates") is already
  queued and is the right place to decide whether this track grows beyond
  one pattern; a ladder audit of a one-item group is not meaningful on its
  own.

**No new ROADMAP items queued from this audit** — every gap resolved to a
principled refusal with a cited reason, which this item's own Accept text
names as a valid and expected outcome ("refusing is valid").

## Verification

Rebuilt `apps/docs` clean: `patterns-index check passed: 27 pattern
page(s) match exactly between disk, pattern-groups.mjs, and the built
/patterns/ tile index` — confirms the corrected badges regenerated
`patterns-index.json` and the tile index re-sorted `field-editor` up to
the level-3 row and `detail-form`/`value-help` down to level-2, with no
drift between source, group config, and built output. Full docs build (26
chained gates), core build (23 checks), stylelint, 111 vitest behavior
tests, and `check:claims` (88 live-verified behaviors) all green.
