# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror — rebuildable from ROADMAP.md and the loop log, so never edit it by hand. Unlike `loops.db` it is COMMITTED: CLAUDE.md's rule is that a queryable binary stays git-ignored while a file a human reads and reviews stays in git, and this one is read.

Generated at: 2026-09-24 21:53 UTC

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
- **Slice 369** (1 open)
  - 369.1 — should printing from the DARK theme force the light palette? OWNER OR ARCHITECTURE CALL.
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
- **Slice 384** (1 open)
  - 384.1 — lane 4's anchor and the rule-text generator.
- **Slice 386** (1 open)
  - 386.1 — nothing keeps the print reset true on a NEW standalone page.
- **Slice 387** (2 open)
  - 387.1 — the message's horizontal overflow loses presses on two more paths.
  - 387.2 — a frozen cell's message still has two covers above it.
- **Slice —** (3 open)
  - OWNER · 377.5 — release the unreleased fixes, or record why not.
  - OWNER · 377.6 — is busy-office-erp the named first user?
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1784 iterations logged)
  Standardize   2 / 4 Continue rounds since 2026-09-24 22:43   ok
  Objective     2 / 3 slices          since 2026-09-25 02:49   ok  [372, 375]
  Optimize      4 wake-date(s) newer   since 2026-09-19 20:16   STALE   [newest pair: claims; 151 sample(s), 8 of 51 name(s) paired across days]
  -> rule 5's newest comparable pair predates 4 wake-date(s) of loop activity. Any regression verdict quoted from it is about the tree as it was on 2026-09-19, not this one — record a metric or say the rule could not be evaluated.
     the unit is DISTINCT LOG DATES after 2026-09-19 (2026-09-22, 2026-09-23, 2026-09-24, 2026-09-25), not wakes: several wakes on one date add nothing, and one wake on a new date adds the whole step.
     rule 5's comparable set — 8 name(s) sampled on 2+ distinct days (43 of 51 name(s) have only one day and are not an input to a rule that compares two runs). Each delta is DAY-CLOSE to DAY-CLOSE (the last sample of each day, roadmap 372.1); `[k same-day]` marks a day whose other samples are folded in, not shown:
       dispatch-region-words       4d  2026-09-09 7484 words -> 2026-09-24 7749 words  +265   [3 same-day]
       claims                      5d  2026-09-07 176 count -> 2026-09-19 203 count  +27   [1 same-day]
       gates                       4d  2026-09-07 55 count -> 2026-09-09 56 count  +1
       axe-violations              8d  2026-09-03 0 count -> 2026-09-06 0 count  +0   NEVER MOVED
       bundle-gz-kb                5d  2026-08-17 11.7 kB -> 2026-09-03 15.1 kB  +3.4   [2 same-day]
       ci-gates                    2d  2026-08-17 14 gates -> 2026-08-18 15 gates  +1   [6 same-day]
       components                  3d  2026-08-15 25 count -> 2026-08-16 30 count  +5   [3 same-day]
       behaviors_frozen            2d  2026-08-15 16 count -> 2026-08-16 18 count  +2   [2 same-day]
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

- 2026-09-24 19:32 · Continue · fix · 353.2 — dispatch-region-words recorded by the instrument with its commit (history mixed body/region figures; rule 5's pair read -8 for a -64 change) · landed · 633ff058
- 2026-09-24 21:22 · Objective · grill · 384 — Objective grill of 352.1, 352.2, 353.2, Slice 383: 44 claims reproduce, 31 of 35 findings survive; flush ratio is Chrome-build-dependent, harness catches stale dist, metric sampling fixed; 384.1 filed · logged · eec86ae2
- 2026-09-24 21:54 · Continue · build · 362.1 — astro check (noUnusedLocals) wired into the docs build: 562 -> 0 errors on 164 files; fixed a stray '))}' live on /reference/tokens/ since 2026-08-16 · landed · 2fc94372
- 2026-09-24 22:01 · Continue · build · 369.2 — print reset reaches the ten standalone docs pages · landed · 6a85e048
- 2026-09-24 22:07 · Standardize · sweep · 385 — Standardize sweep 4 of 4 lanes + archive sweep, 21 slices moved · landed · 6ec0e8da
- 2026-09-24 22:43 · Standardize · audit · prompt-audit of CLAUDE.md: three stale figures removed · landed · 2af651ff
- 2026-09-25 02:49 · Objective · grill · Slice 386 — Objective grill of 362.1, 369.2, Slice 385 · landed · 53ffa54f
- 2026-09-25 03:34 · Continue · build · 372.1 — rule 5 keeps the day unit; day-close reason measured, comparable set labelled · landed · f866ad11
- 2026-09-25 05:53 · Continue · build · 375.11 — three of five grid-message residuals fixed (frozen, loading, classic scrollbar); zoom premise corrected; Slice 387 filed · landed · 0c6f319c
- 2026-09-25 05:53 · Meta · refusal · 400% zoom last-resort @position-try: clips unbreakable tokens and adds a Tab stop at 100% zoom · refused · 0c6f319c

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
