# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-09-06 00:53 UTC

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
- **Slice 284** (1 open)
  - 284.2 — `CLAUDE.md` accumulates and has never been cut; the fold did not change that.
- **Slice 286** (2 open)
  - 286.3 — `LOOPS.md` §3b step 4 is called "the load-bearing step" and is absent from 13 of 20 Polish rounds, because its stated mechanism is one 171.1 already measured as dead.
  - 286.4 — carried from 279's `fit` rubric observation, which 101.3 sent to a grill and which no grill has yet taken.
- **Slice 287** (1 open)
  - 287.5 — re-attach the orphaned sentence in `LOOPS.md` §3b step 5.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1463 iterations logged)
  Standardize   1 / 4 Continue round  since 2026-09-05 22:51   ok
  Objective     1 / 3 slice           since 2026-09-06 00:10   ok  [283]
  Optimize      3 wake-date(s) newer   since 2026-09-03 09:54   STALE   [newest pair: bundle-gz-kb; 128 sample(s), 13 of 42 name(s) sampled twice]
  -> rule 5's newest comparable pair predates 3 wake-date(s) of loop activity. Any regression verdict quoted from it is about the tree as it was on 2026-09-03, not this one — record a metric or say the rule could not be evaluated.
     the unit is DISTINCT LOG DATES after 2026-09-03 (2026-09-04, 2026-09-05, 2026-09-06), not wakes: several wakes on one date add nothing, and one wake on a new date adds the whole step.
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

- 2026-09-05 22:51 · Meta · refusal · filing a second item on LOOPS.md's dispatch region: 274.2's cut today DID touch that region (6,100 -> 5,658), and the +454 regrowth since is one day, not a trend · refused · 6eab896f
- 2026-09-05 23:55 · Objective · grill · Slice 285 — Objective grill of Slices 281, 283, 284: 31 of 33 assertions reproduce; 283.2's '0 of 18 stamps reproduce at the carrier's parent' is 16 of 18 — 16 carrier commits never touched their surface's source, so a mandatory @HEAD would have been right on 16 of 18, not wrong on all 18; the decision survives on construction, the evidence did not; corrected in 4 live places including polish_requeue.py's own docstring · landed · 89455547
- 2026-09-05 23:55 · Meta · refusal · a gate over 'a figure in an item matches the same figure recomputed at that commit' — knowing which numbers in prose are instrument readings is semantic (94.11), the same ground 281 refused its density-cite gate on · refused · 89455547
- 2026-09-05 23:55 · Meta · refusal · filing Slice 282's invisibility to rule 3 (closed by a Roadmap sweep row, which CLOSES_A_SLICE excludes) — same shape as 279.4's Polish fix but n = 1, and a rule fitted to one row is this loop's own carried-forward ceremony finding · refused · 89455547
- 2026-09-06 00:10 · Objective · grill · Slice 286 — 281's decay cause is false and Slice 285 passed it under 'what reproduced': 69a53364 is a pure addition that never touched the table, the table is still reached, and the claim was shipped in the data-table spacing cite; ENVIRONMENT 6c corrected (15px at 390 too) · landed · 0b9e5601
- 2026-09-06 00:10 · Meta · refusal · acting on 286.3 (LOOPS.md 3b step 4's dead re-score mechanism) inside this wake — rewriting the playbook is an owner judgement · refused · 0b9e5601
- 2026-09-06 00:10 · Meta · refusal · acting on Step 0c's reopen condition after losing TWO collisions in one wake — the concurrency model is an owner call, recorded not changed · refused · 0b9e5601
- 2026-09-06 00:53 · Continue · build · 283.3 — the advisory stamp check's sufficiency has an empty denominator (0 Polish rounds since 283.2); closed by healing orphan-midround stamps from --apply at Polish step 0, red-proved by injection with a control · landed · e68ede5f
- 2026-09-06 00:53 · Meta · refusal · recording 'the advisory check is sufficient' as 283.3's refusal branch — it would be a claim about 0 of 0 rounds · refused · e68ede5f
- 2026-09-06 00:53 · Meta · refusal · healing from record_iteration.py (post-commit): it would edit a tracked file after the wake's slice commit, a new way to hand off a dirty tree · refused · e68ede5f

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
