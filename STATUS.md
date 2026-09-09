# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-09-09 06:54 UTC

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
- **Slice 335** (1 open)
  - 335.1 — The Discussions intake has never returned a non-empty list, in either environment.
- **Slice 338** (1 open)
  - 338.1 — the gap `check:print-tokens` cannot see: a theme token that reaches paper through the ORDINARY CASCADE.
- **Slice 339** (1 open)
  - 339.2 — the sweep's re-scan found a SECOND section with the same unexecuted charter, and this item is deliberately not the fix.
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
- **Slice 362** (1 open)
  - 362.1 — adopt `astro check` with `noUnusedLocals` for `apps/docs`.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1702 iterations logged)
  Standardize   3 / 4 Continue rounds since 2026-09-09 00:54   ok
  Objective     0 / 3 slices          since 2026-09-09 06:54   ok
  Optimize      0 wake-date(s) newer   since 2026-09-09 02:50   ok   [newest pair: gates; 142 sample(s), 8 of 47 name(s) paired across days]
     rule 5's comparable set — 8 name(s) sampled on 2+ distinct days (39 of 47 name(s) have only one day and are not an input to a rule that compares two runs):
       gates                       4d  2026-09-07 55 count -> 2026-09-09 56 count  +1
       dispatch-region-words       3d  2026-09-08 7492 words -> 2026-09-09 7552 words  +60
       claims                      4d  2026-09-06 169 count -> 2026-09-07 176 count  +7
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

- 335.1 — The Discussions intake has never returned a non-empty list, in either environment.
- 296.3 — OWNER CALL: is "secure" in scope for this framework at all?
- 273.2 — §3b step 5 mandates `dry++` on a round whose score does not move, and no round has ever done it. OWNER CALL.
- 249.10 — SAP/Fiori terminology column for 249.7.
- 249.11 — "Migrate an existing admin UI" path.
- 249.13 — Reconsider demo-first/spec-last (the proposal's B1), explicitly, not as a ratification.
- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
- 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- AT runtime evidence

## Last 10 iterations

- 2026-09-09 02:00 · Meta · refusal · extending the characterisation-defect run back through the grills of 351 and 355 — not measured, and Slice 355's own row names a defect of a different shape · refused · fed40de9
- 2026-09-09 02:49 · Continue · build · 334.1 — retag check-selftests.mjs @heuristic; premise recorded false; both READMEs re-stamped 55/21/34 -> 56/22/34 · landed · ae10db97
- 2026-09-09 04:43 · Continue · build · 336.2 decided: report:prose prints the flagged union (count + inclusion-exclusion + family-only additions); base rate re-measured at 1 of 7 sweeps (332 alone), 0 of last 5, and 336.2's '2 of the last 2' premise refuted — Slice 326 printed union=15 and failed on the stale ENUMERATION; red-proved by three threshold injections (11/10/27 vs 15) · landed · 9a5faeca
- 2026-09-09 04:43 · Meta · refusal · amending LOOPS.md §3 lane 3 — its two-clause text was already correct; the tool was the half-answer, so LOOPS.md is byte-for-byte unchanged · refused · 9a5faeca
- 2026-09-09 04:43 · Meta · refusal · filing a throwaway discussion to settle 335.1 — GraphQL is 403 for this session on all three probes, and a REST POST is untested BY CHOICE because it would create a real public item with no live owner to authorise it · refused · 9a5faeca
- 2026-09-09 05:54 · Continue · build · 337.1 — Standardize lanes: a wrapper that refuses to report a lane clean when it printed no figure · landed · e128804d
- 2026-09-09 06:54 · Objective · grill · Slice 368 — Objective grill of Slices 365, 366, 367: 45 of 50 published assertions reproduce (366 is 16 of 16, nothing failed). The one substantive defect is Slice 367's 'the Lane K of 4 marker appears in 4 of the 15 4-of-4-lanes sections' — it appears in 5; Slice 274 carries all four with figures. Red-proved by injection with a positive control (stripping 274's markers returns the published 4 and its published set verbatim), and the mechanism reproduced rather than hypothesised: 7 of the 15 sections are closed, so ROADMAP.md holds a one-line pointer and an enumeration deduping on first hit reads the stub. Its own red-proof landed inside the population and structurally could not reach this. Over all 47 sweeps the convention starts at 208, has 7 full write-ups, and lapsed 10 sweeps between 274 and 345 — which argues FOR the wrapper. Arming set resolved first: all three counter labels are item ids (SLICE_BARE, not SLICE_TOP) and the hand-off resolved one of three. Trap bullet to ENVIRONMENT.md, one paragraph to LOOPS.md §6 step 0 · landed · 5ce62916
- 2026-09-09 06:54 · Meta · refusal · a gate over 'this enumeration opened the body, not the pointer' — the checkable shape is true of 7 of 15 sections on a correct tree, so it is red on a healthy repo (94.11's base rate) · refused · 5ce62916
- 2026-09-09 06:54 · Meta · refusal · a fifth loop-mechanics/parser item for the arming-set labels — refused on 355.3, 359.4 and LOOPS.md's own conclusion that widening the regex is not the lesson · refused · 5ce62916
- 2026-09-09 06:54 · Meta · refusal · re-grilling Slices 334 and 336 as the hand-off's instruction named — both closed, and 336 is itself a grill · refused · 5ce62916

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
