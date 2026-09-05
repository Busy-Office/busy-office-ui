# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-09-05 15:57 UTC

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
dispatch status — counter-triggered rules (1439 iterations logged)
  Standardize   3 / 4 Continue rounds since 2026-09-05 06:54   ok
  Objective     5 / 3 slices          since 2026-09-05 07:40   OVERDUE  [274, 276, 277, 278, 279]
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

- 2026-09-05 12:10 · Meta · refusal · the agent's htmx:after:swap finding — htmx 4.0.0 emits exactly that namespaced form; the reading came from the root node_modules, which this repo documents as never hoisted · refused · 0272ed30
- 2026-09-05 14:25 · Continue · build · 278.3/278.4/278.6 — gate-built composition case, select-all aria-selected fix, corrected cost claim on /components/table-toolbar · landed · aa7d433d
- 2026-09-05 14:25 · Meta · refusal · a new public event from data-table.ts to publish selection changes — widens the contract to fix a sync data-grid.ts can do on its own · refused · aa7d433d
- 2026-09-05 14:25 · Meta · refusal · queueMicrotask as the deferral mechanism — measured wrong under a trusted click; setTimeout(...,0) instead · refused · aa7d433d
- 2026-09-05 14:54 · Continue · build · 278.5 — Columns demo shipped multi-select markup without initDropdowns; menu opened at viewport corner, 404px above its invoker. Fixed, gated in check:claims, red-proved twice · landed · a098cf85
- 2026-09-05 15:51 · Polish · round · Slice 279 — Polish round 3 on scan: goods-receipt ran the component live and listed nothing for it; fit cite corrected; check-components-used gains its converse arm · landed · 5abdce3c
- 2026-09-05 15:51 · Meta · refusal · a twelfth archive sweep at 40.6% closed-history share, below both measured triggers (55.1%, 56.7%) — 249.12 is the open owner call on the threshold · refused · 5abdce3c
- 2026-09-05 15:51 · Meta · refusal · the BLANKET converse arm in check-components-used: 357 misses across 39 of 39 pages, a predicate uniformly true · refused · 5abdce3c
- 2026-09-05 15:57 · Meta · dispatcher · 279.4 — Polish added to CLOSES_A_SLICE: rule 3 was blind to 12 closed slices for the whole Polish-dispatched era · landed · 632bfc46
- 2026-09-05 15:57 · Meta · refusal · adding Meta to CLOSES_A_SLICE — its 3 rows record machinery about the loop, which is the Roadmap exclusion's reason · refused · 632bfc46

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
