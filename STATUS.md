# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-09-09 09:48 UTC

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
- **Slice 352** (2 open)
  - 352.1 — a missing `packages/core/dist` is reported as an application defect, in the exact words of a defect this repo has actually had.
  - 352.2 — the two KEPT columns have no recorded method either, and the machine gap they imply is not one machine gap.
- **Slice 353** (1 open)
  - 353.2 — `dispatch-region-words` is sampled by hand, under a convention the instrument does not use, and no sample records the commit it describes.
- **Slice 362** (1 open)
  - 362.1 — adopt `astro check` with `noUnusedLocals` for `apps/docs`.
- **Slice 369** (2 open)
  - 369.1 — should printing from the DARK theme force the light palette? OWNER OR ARCHITECTURE CALL.
  - 369.2 — 10 of 128 pages never get the print reset on `body`.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1710 iterations logged)
  Standardize   1 / 4 Continue round  since 2026-09-09 08:54   ok
  Objective     3 / 3 slices          since 2026-09-09 06:54   OVERDUE  [338, 370, 371]
  -> a counter is at or past its threshold; the dispatcher should pick it
  Optimize      0 wake-date(s) newer   since 2026-09-09 09:44   ok   [newest pair: dispatch-region-words; 143 sample(s), 8 of 47 name(s) paired across days]
     rule 5's comparable set — 8 name(s) sampled on 2+ distinct days (39 of 47 name(s) have only one day and are not an input to a rule that compares two runs):
       gates                       4d  2026-09-07 55 count -> 2026-09-09 56 count  +1
       dispatch-region-words       3d  2026-09-08 7492 words -> 2026-09-09 7484 words  -8
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

- 2026-09-09 06:54 · Meta · refusal · a fifth loop-mechanics/parser item for the arming-set labels — refused on 355.3, 359.4 and LOOPS.md's own conclusion that widening the regex is not the lesson · refused · 5ce62916
- 2026-09-09 06:54 · Meta · refusal · re-grilling Slices 334 and 336 as the hand-off's instruction named — both closed, and 336 is itself a grill · refused · 5ce62916
- 2026-09-09 08:06 · Continue · build · 338.1 — refused on its named instance with the measurement; the gap is framework-wide and the Accept's instrument is wrong · refused · c5780113
- 2026-09-09 08:06 · Meta · refusal · widening check:print-tokens on the source trace alone — the marker is rescued by print-color-adjust: exact, measured 5.66:1 at worst · refused · c5780113
- 2026-09-09 08:06 · Meta · refusal · publishing any printed contrast ratio from computed style — Chrome's economy mode rewrites light text on the way to paper · refused · c5780113
- 2026-09-09 08:54 · Standardize · sweep · Slice 370 — Standardize sweep 4 of 4 lanes, lanes 1-3 clean (0 dead attrs of 1,365; css-repeats 74/242/230/8 matching the standing table body-for-body; 15 flagged prose pages all inside the mandated 16-set). Lane 4's +198 fully attributed by the per-revision series: +194 is collision 5, +4 is 341.1's own net, and Step 0c is flat at 1,520 across three revisions — no new material, no cut. 351.1 DECIDED and ACCEPTED: 350.1's base-rate command now windows a..b^, settled by evidence 350.1 already carried in prose (f9e0f17d..161ede68 is 16 commits, 15 touching no lane input, the 16th being the sweep). Both predicates re-measured at 141 windows — a..b 15/10.6%/span 2037, a..b^ 20/14.2%/span 1896 — reconciled twice and verified by executing the block back out of ROADMAP.md. 350.1 left OPEN on purpose · landed · 3d985b83
- 2026-09-09 08:54 · Meta · refusal · a comment-only-diff refinement to lane 2's window guard — 'this change could move a lane's reading' is semantic (94.11), and both 350.1 and 351.1 already refuse a gate on exactly it · refused · 3d985b83
- 2026-09-09 09:43 · Continue · build · Slice 371 — 339.2 decided: rule 3's +303 is three kinds; the cost narrative moves to LOOPS-archive.md, 279.4's loop-SET argument stays uncut (975 -> 907 words) · landed · 4e6b83c1
- 2026-09-09 09:43 · Meta · refusal · filing P5's restatement of P8's lesson as a defect — the text labels itself a forward-reference, and filing it would inflate the backlog · refused · 4e6b83c1
- 2026-09-09 09:43 · Meta · refusal · amending P7's charter sentence — 'the five recurrence narratives are in LOOPS-archive.md' is still true, and its scoping to five IS this slice's finding · refused · 4e6b83c1

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
