# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-09-07 08:56 UTC

## Open items by slice

- **Slice 112** (2 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- **Slice 249** (7 open)
  - 249.6 — "Choose your path" router, corrected from the proposal's own undercount.
  - 249.7 — Terminology table, re-scoped after its own worked example failed verification.
  - 249.9 — Visual component catalogue.
  - 249.10 — SAP/Fiori terminology column for 249.7.
  - 249.11 — "Migrate an existing admin UI" path.
  - 249.12 — Archival trigger for `ROADMAP.md`.
  - 249.13 — Reconsider demo-first/spec-last (the proposal's B1), explicitly, not as a ratification.
- **Slice 273** (1 open)
  - 273.2 — §3b step 5 mandates `dry++` on a round whose score does not move, and no round has ever done it. OWNER CALL.
- **Slice 294** (1 open)
  - 294.2 — rank the six proposals against the Objective; adopt none on arrival.
- **Slice 296** (1 open)
  - 296.3 — OWNER CALL: is "secure" in scope for this framework at all?
- **Slice 297** (1 open)
  - 297.1 — The first real intake run is the test of this, not the config.
- **Slice 309** (1 open)
  - 309.5 — The `/stress` harness is half a harness: the rows are kept, the measurement is not.
- **Slice 310** (2 open)
  - 310.1 — `examples/erp-suite` and `examples/po-app` render deprecated glyphs, and whether that is a defect is undecided.
  - 310.2 — `/base/motion` declares five copyable markup samples the template never renders.
- **Slice 315** (1 open)
  - 315.3 — should `check:selftests` EXECUTE each self-test rather than grep for the branch? Filed with its base rate, deliberately not built inside a grill.
- **Slice 316** (1 open)
  - 316.1 — should a gate forbid a theme token in a `@media print` colour declaration?
- **Slice 319** (1 open)
  - 319.3 — should a docs page be allowed to assert a target size at all without a gate that can see it?
- **Slice 320** (2 open)
  - 320.2 — judge each declaration separately, so a dead one cannot hide behind a live sibling.
  - 320.3 — the same idiom, two values, in two shared components.
- **Slice 322** (1 open)
  - 322.3 — should a phrase-count over `ROADMAP.md` / `ROADMAP-archive.md` be taken whitespace-normalised by default?
- **Slice 323** (1 open)
  - 323.1 — the script's existing base-rate command, the one quoted above `metric_samples`, is an as-of-DATE replay and is now known to be blind to states that live less than a day.
- **Slice 324** (2 open)
  - 324.1 — a sample records no DIRECTION, so even a fresh, well-paired metric cannot yield a verdict.
  - 324.2 — `bundle-gz-kb` is the only metric rule 5 can act on, its generator exists, and its noise floor is wider than three of its four historical moves.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1589 iterations logged)
  Standardize   3 / 4 Continue rounds since 2026-09-07 05:14   ok
  Objective     2 / 3 slices          since 2026-09-07 06:57   ok  [307, 323]
  Optimize      1 wake-date(s) newer   since 2026-09-06 16:56   STALE   [newest pair: axe-violations; 132 sample(s), 7 of 44 name(s) paired across days]
  -> rule 5's newest comparable pair predates 1 wake-date(s) of loop activity. Any regression verdict quoted from it is about the tree as it was on 2026-09-06, not this one — record a metric or say the rule could not be evaluated.
     the unit is DISTINCT LOG DATES after 2026-09-06 (2026-09-07), not wakes: several wakes on one date add nothing, and one wake on a new date adds the whole step.
     rule 5's comparable set — 7 name(s) sampled on 2+ distinct days (37 of 44 name(s) have only one day and are not an input to a rule that compares two runs):
       axe-violations              8d  2026-09-03 0 count -> 2026-09-06 0 count  +0   NEVER MOVED
       claims                      3d  2026-08-19 82 count -> 2026-09-06 169 count  +87
       bundle-gz-kb                5d  2026-08-17 11.7 kB -> 2026-09-03 15.1 kB  +3.4
       gates                       2d  2026-08-18 19 count -> 2026-08-19 27 count  +8
       ci-gates                    2d  2026-08-17 14 gates -> 2026-08-18 15 gates  +1
       components                  3d  2026-08-15 25 count -> 2026-08-16 30 count  +5
       behaviors_frozen            2d  2026-08-15 16 count -> 2026-08-16 18 count  +2
     no direction is recorded with a sample, so the movement above is a reading and the regression verdict is the wake's. A name that has NEVER MOVED is either healthy or pinned by a gate — rule 5 cannot fire on it either way (`axe-violations` is 0 on every day because `test:axe` fails the build above 0).
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 296.3 — OWNER CALL: is "secure" in scope for this framework at all?
- 294.2 — rank the six proposals against the Objective; adopt none on arrival.
- 273.2 — §3b step 5 mandates `dry++` on a round whose score does not move, and no round has ever done it. OWNER CALL.
- 249.10 — SAP/Fiori terminology column for 249.7.
- 249.11 — "Migrate an existing admin UI" path.
- 249.13 — Reconsider demo-first/spec-last (the proposal's B1), explicitly, not as a ratification.
- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
- 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- AT runtime evidence

## Last 10 iterations

- 2026-09-07 06:57 · Meta · refusal · a gate over 'this count was taken correctly' — not a checkable shape; it would have to re-run every count in the corpus against an instrument nobody wrote down (94.11) · refused · ccb7d3ce
- 2026-09-07 06:57 · Meta · refusal · adjudicating 304's '3 of 11 name a revision' half — the verdict depends on how wide a window counts as surrounding text (a ±3-line window returns 4 of 9), so it is reported undecidable rather than scored · refused · ccb7d3ce
- 2026-09-07 07:48 · Continue · build · Slice 323 — 306.1: rule 5's staleness line compared naive stamps from two clocks, so a calendar boundary read as missing input. Takes the Accept's second branch and STATES the skew: skew_split() splits newer log dates into skew-explained and provably-newer, flag is ok/SKEW/STALE, softening is one-directional by construction. The 8h envelope is git-blame-measured (+0000/+0800) and reconciled every run by observed_skew(), red-proved by narrowing it to 1h. Base rate: an as-of-DATE replay said ZERO SKEW verdicts and would have refused this as ceremony; replayed at the granularity a wake actually reads (both files AT each commit) it is 958 revisions -> 581 STALE / 323 ok / 51 SKEW, seven distinct occasions, the last being 306's own. Today's live reading is unchanged and now earned. 323.1 filed open · landed · a6e7fff6
- 2026-09-07 07:48 · Meta · refusal · converting both stamps to a shared UTC basis via git blame per row — a metric's own offset is only recoverable once committed, and 164.2 already refused both %z and a backfill; the envelope states what is knowable without inventing a clock the files do not carry · refused · a6e7fff6
- 2026-09-07 07:48 · Meta · refusal · a gate over 'the right replay granularity was chosen' — not a checkable shape (94.11); it is filed as 323.1 for a human to answer instead · refused · a6e7fff6
- 2026-09-07 08:49 · Continue · build · 307.1 rule 5 re-scoped: the pairing unit is DISTINCT DAYS, not sample count — 44 names, 13 count-paired, 7 day-paired, 1 actionable · landed · 25b9fdd3
- 2026-09-07 08:49 · Meta · refusal · retiring rule 5, which the item pre-authorised — its input is not absent, it is one name nobody records, and retiring would delete 184.2's size-budget clause before it has ever fired · refused · 25b9fdd3
- 2026-09-07 08:49 · Meta · refusal · recording a bundle-gz-kb sample to un-STALE the line — the 2026-09-04 refusal's stated reason is now known false, but the convention and the 0.3 kB cross-environment floor are unwritten, so sampling would still be guessing · refused · 25b9fdd3
- 2026-09-07 08:56 · Roadmap · sweep · 324.3 archive sweep — 249.12's trigger crossed both halves for the first time (8,188 lines / 41.5%); 15 slices moved, 8,188 -> 6,476 lines, share 41.5% -> 24.6% · landed · 3cb2381a
- 2026-09-07 08:56 · Meta · refusal · the sweep's own first attempt — a mover that read any '## ' line as a heading truncated Slice 308 at a fenced '## the loops table' row; reverted whole rather than patched, because its byte-identity check reused the same splitter and could not fail · refused · 3cb2381a

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
