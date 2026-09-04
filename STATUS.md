# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-09-04 12:07 UTC

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
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1384 iterations logged)
  Standardize   1 / 4 Continue round  since 2026-09-04 09:57   ok
  Objective     3 / 3 slices          since 2026-09-04 02:05   OVERDUE  [249, 263, 264]
  -> a counter is at or past its threshold; the dispatcher should pick it
  Optimize      1 wake-date(s) newer   since 2026-09-03 09:54   STALE   [newest pair: bundle-gz-kb; 128 sample(s), 13 of 42 name(s) sampled twice]
  -> rule 5's newest comparable pair predates 1 wake-date(s) of loop activity. Any regression verdict quoted from it is about the tree as it was on 2026-09-03, not this one — record a metric or say the rule could not be evaluated.
     the unit is DISTINCT LOG DATES after 2026-09-03 (2026-09-04), not wakes: several wakes on one date add nothing, and one wake on a new date adds the whole step.
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 249.10 — SAP/Fiori terminology column for 249.7.
- 249.11 — "Migrate an existing admin UI" path.
- 249.13 — Reconsider demo-first/spec-last (the proposal's B1), explicitly, not as a ratification.
- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
- 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- AT runtime evidence

## Last 10 iterations

- 2026-09-04 09:57 · Standardize · sweep · Slice 263.1 — three HTML-entity decoders consolidated into html-entities.mjs; all five lanes clean, finding from step 1's reading habit · landed · bdb73d8f
- 2026-09-04 09:57 · Meta · refusal · widening lane 5's function-name scan — 257.1's base rate stands and no name scan finds three differently-named copies · refused · bdb73d8f
- 2026-09-04 09:57 · Meta · refusal · a --self-test on the new module — check-selftests walks check-* only, so nothing would run it · refused · bdb73d8f
- 2026-09-04 09:57 · Meta · refusal · folding check-po-app.mjs's single &amp; replace into the shared module · refused · bdb73d8f
- 2026-09-04 09:57 · Meta · refusal · consolidating the two byte-identical stripTags — opposite sides of the published-package boundary; logged instead · refused · bdb73d8f
- 2026-09-04 12:07 · Continue · build · Slice 264.1 — 249.20: which component a behavior serves is DECLARED (@serves in 26 behavior headers -> behaviors.json byComponent), not intersected; new check-js-serves gate red on 6 real pages first · landed · 1b4c3365
- 2026-09-04 12:07 · Meta · refusal · a required/enhanced/optional JS tier — the only source in the repo is the hand-written page prose this key exists to check, so sourcing it would be circular; stays 249.9's open question · refused · 1b4c3365
- 2026-09-04 12:07 · Meta · refusal · blanking comments in extract-behaviors' hook scan — measured: it deletes real published hooks on 25 of 33 exports, one of them 12 · refused · 1b4c3365
- 2026-09-04 12:07 · Meta · refusal · publishing byComponent into llms.txt — behaviors.json is already an export and llms.txt already lists all 26 inits with their hooks; a fourth spelling of one relation · refused · 1b4c3365
- 2026-09-04 12:07 · Meta · refusal · gating gen-llms' hand-written paste-in block — it names 5 of 26 inits deliberately, and all 5 were checked to agree with byComponent · refused · 1b4c3365

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
