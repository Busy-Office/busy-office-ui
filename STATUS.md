# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-09-08 14:52 UTC

## Open items by slice

- **Slice 112** (2 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- **Slice 249** (5 open)
  - 249.7 — Terminology table, re-scoped after its own worked example failed verification.
  - 249.10 — SAP/Fiori terminology column for 249.7.
  - 249.11 — "Migrate an existing admin UI" path.
  - 249.12 — Archival trigger for `ROADMAP.md`.
  - 249.13 — Reconsider demo-first/spec-last (the proposal's B1), explicitly, not as a ratification.
- **Slice 273** (1 open)
  - 273.2 — §3b step 5 mandates `dry++` on a round whose score does not move, and no round has ever done it. OWNER CALL.
- **Slice 296** (1 open)
  - 296.3 — OWNER CALL: is "secure" in scope for this framework at all?
- **Slice 320** (1 open)
  - 320.3 — the same idiom, two values, in two shared components.
- **Slice 328** (1 open)
  - 328.1 — The `Demo`-component detector has now produced a wrong count twice, a month apart, and nothing stops a third.
- **Slice 330** (1 open)
  - 330.1 — Sampling is now a named failure mode here, twice.
- **Slice 331** (1 open)
  - 331.1 — `install-prompts.md`, generated from `api.json`.
- **Slice 332** (1 open)
  - 332.1 — `ENVIRONMENT.md` doubled in 8 days and every wake reads all of it.
- **Slice 333** (1 open)
  - 333.1 — should a gate forbid a never-used frontmatter `const` in an `.astro` page?
- **Slice 334** (1 open)
  - 334.1 — should `check-selftests.mjs` itself be `@heuristic` now?
- **Slice 335** (1 open)
  - 335.1 — The Discussions intake has never returned a non-empty list, in either environment.
- **Slice 336** (1 open)
  - 336.2 — should `report:prose` print the flagged UNION, since that is what its lane is defined on?
- **Slice 337** (1 open)
  - 337.1 — A Standardize lane that never RAN is recorded as clean, and nothing in the sweep can tell the two apart.
- **Slice 338** (1 open)
  - 338.1 — the gap `check:print-tokens` cannot see: a theme token that reaches paper through the ORDINARY CASCADE.
- **Slice 339** (1 open)
  - 339.2 — the sweep's re-scan found a SECOND section with the same unexecuted charter, and this item is deliberately not the fix.
- **Slice 341** (1 open)
  - 341.1 — Step 0c's generator has TWO outputs and its charter throttles only one. The cut lasted exactly one commit.
- **Slice 345** (1 open)
  - 345.1 — should `.bo-motion-spin` own its `display: inline-block`?
- **Slice 346** (1 open)
  - 346.1 — Slice 343 refused a whitespace normaliser on a caller census of counting INSTRUMENTS. The failure recurred the next wake in a population that census did not measure: a wake's own grep checking that a correction it just made landed everywhere.
- **Slice 348** (1 open)
  - 348.1 — a kB figure in backticks is indistinguishable from a slice id by shape, and the "absent" bucket claims otherwise.
- **Slice 349** (1 open)
  - 349.1 — rule 3 counts slices a building loop TOUCHED, not slices that closed, and the two have never been reconciled.
- **Slice 350** (1 open)
  - 350.1 — should rule 2's counter know whether its first three lanes have anything to read?
- **Slice 351** (1 open)
  - 351.1 — the base-rate command `350.1` hands forward should window on what the sweep could SEE, or say why it does not.
- **Slice 352** (2 open)
  - 352.1 — a missing `packages/core/dist` is reported as an application defect, in the exact words of a defect this repo has actually had.
  - 352.2 — the two KEPT columns have no recorded method either, and the machine gap they imply is not one machine gap.
- **Slice 353** (1 open)
  - 353.2 — `dispatch-region-words` is sampled by hand, under a convention the instrument does not use, and no sample records the commit it describes.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1673 iterations logged)
  Standardize   3 / 4 Continue rounds since 2026-09-08 09:54   ok
  Objective     0 / 3 slices          since 2026-09-08 14:52   ok
  Optimize      0 wake-date(s) newer   since 2026-09-08 00:17   ok   [newest pair: dispatch-region-words; 140 sample(s), 8 of 47 name(s) paired across days]
     rule 5's comparable set — 8 name(s) sampled on 2+ distinct days (39 of 47 name(s) have only one day and are not an input to a rule that compares two runs):
       dispatch-region-words       2d  2026-09-07 7298 words -> 2026-09-08 7492 words  +194
       claims                      4d  2026-09-06 169 count -> 2026-09-07 176 count  +7
       gates                       3d  2026-08-19 27 count -> 2026-09-07 55 count  +28
       axe-violations              8d  2026-09-03 0 count -> 2026-09-06 0 count  +0   NEVER MOVED
       bundle-gz-kb                5d  2026-08-17 11.7 kB -> 2026-09-03 15.1 kB  +3.4
       ci-gates                    2d  2026-08-17 14 gates -> 2026-08-18 15 gates  +1
       components                  3d  2026-08-15 25 count -> 2026-08-16 30 count  +5
       behaviors_frozen            2d  2026-08-15 16 count -> 2026-08-16 18 count  +2
     no direction is recorded with a sample, so the movement above is a reading and the regression verdict is the wake's. A name that has NEVER MOVED is either healthy or pinned by a gate — rule 5 cannot fire on it either way (`axe-violations` is 0 on every day because `test:axe` fails the build above 0).
     a direction is NOT recorded on purpose (roadmap 324.1): adding one makes rule 5 fire on `bundle-gz-kb`'s four consecutive rises, which the log's own same-timestamp `components` samples refute (0.400 -> 0.355 kB per component over that window). A rise with no denominator is growth. Where a name has a real threshold, use it — `check:size` gates the bundle at 16.7 kB gz, which is rule 5's budget clause, not its trend one.
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 296.3 — OWNER CALL: is "secure" in scope for this framework at all?
- 273.2 — §3b step 5 mandates `dry++` on a round whose score does not move, and no round has ever done it. OWNER CALL.
- 249.10 — SAP/Fiori terminology column for 249.7.
- 249.11 — "Migrate an existing admin UI" path.
- 249.13 — Reconsider demo-first/spec-last (the proposal's B1), explicitly, not as a ratification.
- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
- 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- AT runtime evidence

## Last 10 iterations

- 2026-09-08 12:02 · Meta · refusal · the Accept's third branch — a shape-only column kept undefined — refused, because the shape is not checkable without the window and the one probe the page points at produces a different one · refused · 3d2816a2
- 2026-09-08 12:52 · Continue · build · 353.1 — 326.3 answered: the dispatch region has two kinds of growth (a rule changing vs a GENERATOR section) and the whole-region ratio cannot tell them apart; report_loop_prose.py now prints per-section body deltas since the last commit that REDUCED the region, red-proved by injection after the first draft's residual reconciliation passed it, and reproducing 339.1's published series 3 of 3 and its deltas 5 of 5 · landed · 1310b81a
- 2026-09-08 12:52 · Meta · refusal · a per-rule word ceiling for the dispatch region — a ceiling low enough to bind fails the sections 326.2 attributed to rules that changed, one above 980 binds nothing, and 'the decision content is short' is semantic (94.11) · refused · 1310b81a
- 2026-09-08 12:52 · Meta · refusal · a rules-file/rationale-file split of Step 2 — the repo's one precedent (169.3) moved RESUME.md's Step-0 read 3,150 -> 3,349 the same day and 9,310 at HEAD, 2.96x, because Step 0 names both files · refused · 1310b81a
- 2026-09-08 12:52 · Meta · refusal · cutting the dispatch region this wake — 274.2's and 339.1's cuts between them measure that a cut without a mechanism holds about 15 commits · refused · 1310b81a
- 2026-09-08 13:46 · Continue · build · 327.3 — 192.1 is cited as a name for a defect, not executed: 1 of 161 slices carries the inventory it prescribes; rule fine, practice is the gap, nothing built · logged · 95d4aca9
- 2026-09-08 13:46 · Meta · refusal · a gate over 'this claim names its instrument' — base rate 65.2% of the population and 31.6% of pre-rule slices, so the checkable shape distinguishes nothing (94.11) · refused · 95d4aca9
- 2026-09-08 13:46 · Meta · refusal · moving or re-bolding 192.1's paragraph in CLAUDE.md — a prose change this slice has no instrument for, with 158.2's prose growth open · refused · 95d4aca9
- 2026-09-08 14:52 · Objective · grill · 355 — Objective grill of Slices 353, 354: 103 of 107 figures reproduce; 354's halves table mixes two conventions (11 -> 12 of 21), 353's verdict series reads the pre-commit tip · logged · b1da20c7
- 2026-09-08 14:52 · Meta · refusal · a gate or prose change on the unanchored 'at HEAD' shape — base rate is 14/161 population and the string is correct wherever the commit does not move the figure (94.11) · refused · b1da20c7

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
