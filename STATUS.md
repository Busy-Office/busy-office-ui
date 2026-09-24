# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror — rebuildable from ROADMAP.md and the loop log, so never edit it by hand. Unlike `loops.db` it is COMMITTED: CLAUDE.md's rule is that a queryable binary stays git-ignored while a file a human reads and reviews stays in git, and this one is read.

Generated at: 2026-09-24 02:38 UTC

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
- **Slice 372** (1 open)
  - 372.1 — rule 5's pairing keeps the last sample of each calendar day on a recorded reason that is false at 72 of 73 pairs, and the case cited for it is mislabelled.
- **Slice 373** (2 open)
  - 373.6 — App dock: hide on UPWARD scroll. OWNER CALL — two refusals stand on the record and the reversal is not written down.
  - 373.8 — docs IA: collapse 17 sidebar groups into the prompt's seven (Start here / Foundations / Components / Patterns and layouts / Integration / Reference / Contributor and decision history). OWNER CALL.
- **Slice 374** (1 open)
  - 374.4 — `.bo-btn--secondary` standing alone is identified almost entirely by a 1.47:1 border, the contrast gate structurally cannot see it, and the published ACR says it can.
- **Slice 375** (1 open)
  - 375.11 — what 375.9 measured and did not fix.
- **Slice 376** (2 open)
  - 376.5 — the app-launch launcher hand-rolls a dialog header.
  - 376.7 — the lane-4 ratchet counts any net shrink as a cut.
- **Slice 377** (10 open)
  - 377.3 — the completion gate cannot see a revision.
  - 377.4 — pointer coverage, named per behaviour.
  - 377.7 — an adoption reading at every Objective grill, and §6's exit requires the thesis section.
  - 377.8 — the ACR's 1.4.11 and 2.4.7 remarks derive from source.
  - 377.9 — re-decide 375.6 on real CI timings.
  - 377.10 — the Jev band, re-measured with the question form Rubric 2 prescribes, and the set recorded.
  - 377.11 — 375.10's "holds the option" half must be able to fail.
  - 377.12 — the preview's provenance is truthful.
  - 377.13 — 375.9's corpus figure is re-runnable.
  - 377.14 — the low items, one bundle.
- **Slice 381** (2 open)
  - 381.1 — the correction-site check: precision, coverage, or unwire it.
  - 381.2 — rule 3 arms on slices that shipped nothing.
- **Slice —** (3 open)
  - OWNER · 377.5 — release the unreleased fixes, or record why not.
  - OWNER · 377.6 — is busy-office-erp the named first user?
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1766 iterations logged)
  Standardize   0 / 4 Continue rounds since 2026-09-24 09:16   ok
  Objective     0 / 3 slices          since 2026-09-24 10:38   ok
  Optimize      3 wake-date(s) newer   since 2026-09-19 20:16   STALE   [newest pair: claims; 148 sample(s), 8 of 51 name(s) paired across days]
  -> rule 5's newest comparable pair predates 3 wake-date(s) of loop activity. Any regression verdict quoted from it is about the tree as it was on 2026-09-19, not this one — record a metric or say the rule could not be evaluated.
     the unit is DISTINCT LOG DATES after 2026-09-19 (2026-09-22, 2026-09-23, 2026-09-24), not wakes: several wakes on one date add nothing, and one wake on a new date adds the whole step.
     rule 5's comparable set — 8 name(s) sampled on 2+ distinct days (43 of 51 name(s) have only one day and are not an input to a rule that compares two runs):
       claims                      5d  2026-09-07 176 count -> 2026-09-19 203 count  +27
       gates                       4d  2026-09-07 55 count -> 2026-09-09 56 count  +1
       dispatch-region-words       3d  2026-09-08 7492 words -> 2026-09-09 7484 words  -8
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

- 373.6 — App dock: hide on UPWARD scroll. OWNER CALL — two refusals stand on the record and the reversal is not written down.
- 296.3 — OWNER CALL: is "secure" in scope for this framework at all?
- 273.2 — §3b step 5 mandates `dry++` on a round whose score does not move, and no round has ever done it. OWNER CALL.
- 249.10 — SAP/Fiori terminology column for 249.7.
- 249.11 — "Migrate an existing admin UI" path.
- 249.13 — Reconsider demo-first/spec-last (the proposal's B1), explicitly, not as a ratification.
- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
- 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- AT runtime evidence

## Last 10 iterations

- 2026-09-24 04:40 · Continue · build · 320.3 — ClassRef chip spacing uses var(--bo-space-2) like ApiTable (6.4px -> 8px) · landed · 880c2b2b
- 2026-09-24 05:23 · Continue · build · 345.1 — .bo-motion-spin owns display:inline-block; recipe spins in flow; demo glyph no longer orbits · landed · b29e4179
- 2026-09-24 06:38 · Objective · grill · 379 — Objective grill of Slices 345, 378: 26 claims reproduce, 12 of 12 findings survive; hidden-spinner and ACR-grammar fixes, 345.1 migration note, four records corrected · logged · 2fad3cc7
- 2026-09-24 06:38 · Meta · refusal · reverting 345.1 or narrowing it to inline elements — the block shapes it breaks are unused here and one declaration fixes them · refused · 2fad3cc7
- 2026-09-24 08:04 · Continue · build · 346.1 — correction base rate: 13 of 59 superseding commits left a stale copy (17 sites, 2 wrap-only); check_correction_sites.py lists the copies (11/17 from the diff, 16 with --old), wired as a REPORTED advisory · landed · f8856986
- 2026-09-24 08:04 · Meta · refusal · a whitespace normaliser as the fix — the wrap hid 2 of the 17 stale copies · refused · f8856986
- 2026-09-24 08:32 · Continue · build · 335.1 — Discussions intake proved end to end: owner-authorised throwaway discussion #3 appeared as 200 len 1, then deleted (200 len 0, 404, NOT_FOUND) · landed · 0756cafb
- 2026-09-24 09:16 · Standardize · sweep · 380 — Standardize sweep 4/4 on a clean HEAD worktree: lanes 1-3 no delta; DESIGN.md HONEST re-decided (the control retired); 346.1's rule moved out of the dispatch region (7,643 -> 7,521 words) · landed · 741c9bea
- 2026-09-24 10:38 · Objective · grill · 381 — Objective grill of 335.1, 346.1, Slice 380: 45 claims reproduce, 27 of 33 findings survive; record_iteration/check bugs fixed, lane-4 cut rule fixed, intake command fixed, 381.1-381.2 filed · logged · 60235d9c
- 2026-09-24 10:38 · Meta · refusal · unwiring the correction-site check inside the grill — 381.1 states a precision floor first, then measures · refused · 60235d9c

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
