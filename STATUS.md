# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-09-06 02:43 UTC

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
- **Slice 286** (1 open)
  - 286.4 — carried from 279's `fit` rubric observation, which 101.3 sent to a grill and which no grill has yet taken.
- **Slice 287** (1 open)
  - 287.5 — re-attach the orphaned sentence in `LOOPS.md` §3b step 5.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1471 iterations logged)
  Standardize   3 / 4 Continue rounds since 2026-09-05 22:51   ok
  Objective     3 / 3 slices          since 2026-09-06 00:10   OVERDUE  [283, 284, 288]
  -> a counter is at or past its threshold; the dispatcher should pick it
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

- 2026-09-06 00:53 · Meta · refusal · recording 'the advisory check is sufficient' as 283.3's refusal branch — it would be a claim about 0 of 0 rounds · refused · e68ede5f
- 2026-09-06 00:53 · Meta · refusal · healing from record_iteration.py (post-commit): it would edit a tracked file after the wake's slice commit, a new way to hand off a dirty tree · refused · e68ede5f
- 2026-09-06 01:46 · Continue · build · 284.2 — CLAUDE.md accumulation verdict: HONEST; removable surface measured at 181 words (3.1%) by two red-proved instruments · landed · 167a1092
- 2026-09-06 01:46 · Meta · refusal · cutting the 181-word triple-telling of the 39.2 example — it is 3.1% of the file, illustrates three distinct rules, and a pointer is read less than a paragraph · refused · 167a1092
- 2026-09-06 01:46 · Meta · refusal · verdicting INSTRUMENT on the ratchet's blindness to 284.1's fold — 1 of 33 up-steps is not enough; the file has genuinely never been cut by words · refused · 167a1092
- 2026-09-06 01:46 · Meta · refusal · shipping a third scripts/loops report for the 8-gram sweep — the command is recorded in the entry instead; 94.11's ceremony test · refused · 167a1092
- 2026-09-06 02:43 · Continue · build · 288.1/288.2 — 286.3's required base-rate re-run found its own bucket list wrong in 4 of 7 independent-pass entries (176/182/269 never ran one; 242, filed as a decline, is the ledger's FIRST actual run and moved a score); population 20->22; verdict: 171.1 measured that no dimension can RANK surfaces, which is not what step 4 does — 2 of 5 runs moved a score on real defects, so §3b step 4's LABEL and TRIGGER were the defect and the content stays · landed · d257b9b8
- 2026-09-06 02:43 · Meta · refusal · mandating 278's independent-review activity — n=1, recorded as permitted and left Hypothesis exactly as 286.3 filed it · refused · d257b9b8
- 2026-09-06 02:43 · Meta · refusal · the archive sweep — roadmap_scope reports 2 of 4 eligible targets NAMED by still-open items (Slice 283, by 287.5 and 273.2), 236.2's report read before deciding not to move · refused · d257b9b8
- 2026-09-06 02:43 · Meta · refusal · fixing 287.5's orphaned sentence in §3b step 5 while editing §3b — it is a separate open item, not this dispatch · refused · d257b9b8

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
