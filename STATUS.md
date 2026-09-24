# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror — rebuildable from ROADMAP.md and the loop log, so never edit it by hand. Unlike `loops.db` it is COMMITTED: CLAUDE.md's rule is that a queryable binary stays git-ignored while a file a human reads and reviews stays in git, and this one is read.

Generated at: 2026-09-24 11:32 UTC

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
dispatch status — counter-triggered rules (1775 iterations logged)
  Standardize   2 / 4 Continue rounds since 2026-09-24 18:04   ok
  Objective     3 / 3 slices          since 2026-09-24 17:08   OVERDUE  [352, 353, 383]
  -> a counter is at or past its threshold; the dispatcher should pick it
  Optimize      0 wake-date(s) newer   since 2026-09-24 19:31   ok   [newest pair: dispatch-region-words; 149 sample(s), 8 of 51 name(s) paired across days]
     rule 5's comparable set — 8 name(s) sampled on 2+ distinct days (43 of 51 name(s) have only one day and are not an input to a rule that compares two runs):
       dispatch-region-words       4d  2026-09-09 7484 words -> 2026-09-24 7723 words  +239
       claims                      5d  2026-09-07 176 count -> 2026-09-19 203 count  +27
       gates                       4d  2026-09-07 55 count -> 2026-09-09 56 count  +1
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

- 2026-09-24 10:38 · Meta · refusal · unwiring the correction-site check inside the grill — 381.1 states a precision floor first, then measures · refused · 60235d9c
- 2026-09-24 11:07 · Continue · build · 348.1 — slice-id check's ABSENT line hedged: 7 of 127 firings held a figure (15.0/15.10/0.0); 216 of 244 revisions fire, so LOOPS.md now calls a report the normal state · landed · bc79e235
- 2026-09-24 11:33 · Continue · build · 349.1 — rule 3's text now says slices with work landed (the counter's reading): of 72 touched-armed grills only 42 had three closed; live count unchanged · landed · 03485ac9
- 2026-09-24 11:33 · Meta · refusal · making dispatch_status count CLOSED slices — it would have delayed 30 of 72 grills, and §6 step 0 already refuses the regex · refused · 03485ac9
- 2026-09-24 12:01 · Continue · build · 350.1 — refused: rule 2 keeps counting Continue rounds (lane 4 had material on every multi-commit window); a no-input lane is written 'unchanged by construction' · refused · 661bc668
- 2026-09-24 17:08 · Objective · grill · 382 — Objective grill of 348.1, 349.1, 350.1: 29 claims reproduce, 19 of 22 findings survive; slice-id hedge, rule-3 wording and §3 shortcut corrected · logged · 0ed584cd
- 2026-09-24 17:36 · Continue · fix · 352.1 — po-app harness names an unbuilt packages/core/dist (4 missing files, build-state) instead of a select-all failure; red-proved by moving dist aside · landed · 135fb21b
- 2026-09-24 18:04 · Standardize · sweep · 383 — Standardize sweep 4/4 on an isolated clean build: lane 2 unchanged by construction, lanes 1/3 match base, lane 4 cut 101 words of narrative (7,824 -> 7,723) · landed · 330051e0
- 2026-09-24 19:03 · Continue · build · 352.2 — style-flush column kept: on a recorded M4 it reconciles like select-all (0.20/0.30 vs 0.18/0.28 of published; ~1x throttled); page says so with the command · landed · 37a704a2
- 2026-09-24 19:32 · Continue · fix · 353.2 — dispatch-region-words recorded by the instrument with its commit (history mixed body/region figures; rule 5's pair read -8 for a -64 change) · landed · 633ff058

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
