# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-09-05 14:25 UTC

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
- **Slice 278** (1 open)
  - 278.5 — the Columns demo never calls `initDropdowns()`, so the menu the page calls "the same multi-select dropdown pattern as elsewhere" is neither positioned nor labelled.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1433 iterations logged)
  Standardize   2 / 4 Continue rounds since 2026-09-05 06:54   ok
  Objective     2 / 3 slices          since 2026-09-05 07:40   ok  [274, 278]
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

- 2026-09-05 11:04 · Polish · round · 277.1 pagination round 2 — data-load-more-auto promised in 5 places, asserted in none; 6 red-proved FakeIO cases + all 5 wordings corrected · landed · e4d7493c
- 2026-09-05 11:04 · Meta · refusal · a check:claims case for the auto path — needs the demo button to carry the attribute, changing what the demo DOES, which needs the screenshot lane a cloud wake cannot run · refused · e4d7493c
- 2026-09-05 11:04 · Meta · refusal · a gate for 'a documented runtime claim with no executable assertion' — the predicate needs a reading of what a sentence promises (94.11 shape-vs-content), and 101.3 forbids Polish adding gates · refused · e4d7493c
- 2026-09-05 11:55 · Polish · round · 278.1 — table-toolbar round 2: hiding a column strands initDataGrid's only tab stop on a [hidden] cell, so Tab skips the grid; fixed and red-proved by four injections · landed · 7f4792e7
- 2026-09-05 11:55 · Meta · refusal · a check:claims case for the hidden-column composition — it needs the grid demo to gain a toggle control, changing what the demo DOES, which needs the screenshot lane a cloud wake cannot run · refused · 7f4792e7
- 2026-09-05 12:10 · Polish · round · 278.3-278.6 — the independent pass on table-toolbar: four more findings filed, one of them in prose 278.1 shipped the same wake (fixed here); the htmx:after:swap finding refuted against the installed htmx 4.0.0 · logged · 0272ed30
- 2026-09-05 12:10 · Meta · refusal · the agent's htmx:after:swap finding — htmx 4.0.0 emits exactly that namespaced form; the reading came from the root node_modules, which this repo documents as never hoisted · refused · 0272ed30
- 2026-09-05 14:25 · Continue · build · 278.3/278.4/278.6 — gate-built composition case, select-all aria-selected fix, corrected cost claim on /components/table-toolbar · landed · aa7d433d
- 2026-09-05 14:25 · Meta · refusal · a new public event from data-table.ts to publish selection changes — widens the contract to fix a sync data-grid.ts can do on its own · refused · aa7d433d
- 2026-09-05 14:25 · Meta · refusal · queueMicrotask as the deferral mechanism — measured wrong under a trusted click; setTimeout(...,0) instead · refused · aa7d433d

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
