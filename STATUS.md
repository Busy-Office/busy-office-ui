# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-09-05 05:47 UTC

## Open items by slice

- **Slice 112** (2 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- **Slice 249** (8 open)
  - 249.6 — "Choose your path" router, corrected from the proposal's own undercount.
  - 249.7 — Terminology table, re-scoped after its own worked example failed verification.
  - 249.9 — Visual component catalogue.
  - 249.10 — SAP/Fiori terminology column for 249.7.
  - 249.11 — "Migrate an existing admin UI" path.
  - 249.12 — Archival trigger for `ROADMAP.md`.
  - 249.13 — Reconsider demo-first/spec-last (the proposal's B1), explicitly, not as a ratification.
  - 249.15 — The one static OG image 249.2 named and did not build.
- **Slice 273** (1 open)
  - 273.2 — §3b step 5 mandates `dry++` on a round whose score does not move, and no round has ever done it. OWNER CALL.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1411 iterations logged)
  Standardize   4 / 4 Continue rounds since 2026-09-04 09:57   OVERDUE
  Objective     3 / 3 slices          since 2026-09-04 13:02   OVERDUE  [271, 272, 273]
  -> a counter is at or past its threshold; the dispatcher should pick it
  Optimize      2 wake-date(s) newer   since 2026-09-03 09:54   STALE   [newest pair: bundle-gz-kb; 128 sample(s), 13 of 42 name(s) sampled twice]
  -> rule 5's newest comparable pair predates 2 wake-date(s) of loop activity. Any regression verdict quoted from it is about the tree as it was on 2026-09-03, not this one — record a metric or say the rule could not be evaluated.
     the unit is DISTINCT LOG DATES after 2026-09-03 (2026-09-04, 2026-09-05), not wakes: several wakes on one date add nothing, and one wake on a new date adds the whole step.
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 273.2 — §3b step 5 mandates `dry++` on a round whose score does not move, and no round has ever done it. OWNER CALL.
- 249.10 — SAP/Fiori terminology column for 249.7.
- 249.11 — "Migrate an existing admin UI" path.
- 249.13 — Reconsider demo-first/spec-last (the proposal's B1), explicitly, not as a ratification.
- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
- 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- AT runtime evidence

## Last 10 iterations

- 2026-09-05 01:45 · Continue · build · Slice 271 / 270.1 — check:slice-refs file filter widened from a six-extension allowlist to a denylist (698 files, 295 refs), run-line noun corrected to assertion(s), red-proved per newly-reached type · landed · 51244205
- 2026-09-05 01:45 · Meta · refusal · adding .yml to the scan: measured, it rescues 0 zero-coverage refs today — subsumed by the denylist rather than declined · refused · 51244205
- 2026-09-05 02:45 · Continue · build · Slice 272 — eleventh archive sweep: 17 closed slices moved verbatim, share 56.7% -> 19.1% · landed · d33c1efe
- 2026-09-05 02:45 · Meta · refusal · moving the four targets 236.2 flags (253, 262, 260, 237) — none carries an amend clause, but a sweep is the wrong place to re-litigate a caution rule · refused · d33c1efe
- 2026-09-05 03:52 · Polish · reconcile · Slice 273 — Polish round on byline: LOOPS.md's reason for dry=0 was false in the commit that wrote it (16 of 20 rows have a second round, dry never incremented); blind re-score found --compact's rationale recommending the context the opener forbids · landed · d8c9b5d1
- 2026-09-05 03:52 · Meta · refusal · retroactively incrementing dry on the 8 NO-OP rows — it would retire surfaces and empty the Polish lane, which 176.3 refused on measured grounds; filed as 273.2, an owner call, instead · refused · d8c9b5d1
- 2026-09-05 03:52 · Meta · refusal · shipping arm 13 as a gate — 17/17 on the clean tree, so the existence check distinguishes nothing today (94.11's refused shape), though it red-proves by injection · refused · d8c9b5d1
- 2026-09-05 05:47 · Continue · build · 273.3 — byline's wrong-choice headline re-cut from the POSITION to the PRACTICE; the 2 cell-borne bylines (5 cells) are name+avatar only and stay · landed · 6011c94c
- 2026-09-05 05:47 · Meta · refusal · changing /components/avatar and /patterns/settings-admin instead of the clause — it would drop .bo-byline__avatar's prescribed composition or add a second spelling of it, more API for the same thing · refused · 6011c94c
- 2026-09-05 05:47 · Meta · refusal · shipping the td-containing-bo-byline probe as a gate — the two remaining uses are legitimate, so the gate would be red on a correct tree (94.11's shape) · refused · 6011c94c

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
