# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-09-06 18:56 UTC

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
- **Slice 292** (1 open)
  - 292.9 — 292.4's property is tree-wide and the guard it landed is page-local: four other docs pages hand a reader a deprecated glyph.
- **Slice 294** (2 open)
  - 294.1 — `derive-floor.mjs` has no probe for `light-dark()`, `oklch()` or `scroll-state()`.
  - 294.2 — rank the six proposals against the Objective; adopt none on arrival.
- **Slice 296** (1 open)
  - 296.3 — OWNER CALL: is "secure" in scope for this framework at all?
- **Slice 297** (1 open)
  - 297.1 — The first real intake run is the test of this, not the config.
- **Slice 298** (1 open)
  - 298.1 — `gen-og-card.mjs`'s display sizes are literals with a stated reason, and nothing checks that the reason stays true.
- **Slice 300** (1 open)
  - 300.2 — Issue #2: no board/kanban component, triaged, NOT built.
- **Slice 304** (1 open)
  - 304.1 — `roadmap_scope.py`'s figures should be quotable only with a revision.
- **Slice 305** (2 open)
  - 305.1 — The four defects round 3 left standing.
  - 305.2 — Run the repo's own gates on a gauntlet artifact BEFORE spending a critic round.
- **Slice 306** (1 open)
  - 306.1 — rule 5's staleness comparison must not be able to report "stale" for a reason that is only a timezone.
- **Slice 307** (1 open)
  - 307.1 — Rule 5 starves structurally: 42 metric names, 130 samples, 13 names sampled twice.
- **Slice 309** (1 open)
  - 309.5 — The `/stress` harness is half a harness: the rows are kept, the measurement is not.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1547 iterations logged)
  Standardize   0 / 4 Continue rounds since 2026-09-06 17:49   ok
  Objective     0 / 3 slices          since 2026-09-06 18:56   ok
  Optimize      1 wake-date(s) newer   since 2026-09-06 16:56   STALE   [newest pair: axe-violations; 132 sample(s), 13 of 44 name(s) sampled twice]
  -> rule 5's newest comparable pair predates 1 wake-date(s) of loop activity. Any regression verdict quoted from it is about the tree as it was on 2026-09-06, not this one — record a metric or say the rule could not be evaluated.
     the unit is DISTINCT LOG DATES after 2026-09-06 (2026-09-07), not wakes: several wakes on one date add nothing, and one wake on a new date adds the whole step.
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

- 2026-09-06 16:56 · Continue · build · 292.8 — display-sizing font-size literals in docs pages now read --bo-font-size-xl (exact 1.5rem); computed-style no-op red-proved against a dead edit by token override; no gate, on base rate + an unsound text predicate + one site with no equal token · landed · 0879c6c3
- 2026-09-06 16:56 · Meta · refusal · a gate over raw font-size in docs pages — 41 of 41 component pages now satisfy the predicate, and 2 of the 4 tree-wide source hits carry no style attribute at all in the built page (prose, and a copyable @page print sample) · refused · 0879c6c3
- 2026-09-06 16:56 · Meta · refusal · converting patterns/app-launch.astro's 2rem launcher icon — no token equals 2rem, so the swap would shrink the glyph, and that is a rendered-image judgement a cloud wake cannot make · refused · 0879c6c3
- 2026-09-06 16:57 · Roadmap · triage · Slice 306 — rule 5's staleness line floors at 1 from a cloud wake: the newest metric (2026-09-06 16:56 UTC) and the newest log rows (2026-09-07 00:21/00:35, +0800) are the same moment from two clocks · triaged · 40041a74
- 2026-09-07 01:25 · Continue · build · Slice 307 / closes 296.2 — refused the interaction-latency gate on the repo's own precedent (rule 5 already records CI wall time declared regressed on a 290s reading that was noise: next two runs 267s and 265s). The measurement found something better than either branch: /components/data-table already publishes runtime figures from 2026-08-15 that nothing re-runs, and the page names its date, stack and harness but NOT its machine. Re-ran the /stress harness: select-all 3ms/1k and 7ms/5k against a published 4ms/18ms — different hardware, so not comparable in either direction. Fixed the claim to state its own reproducibility limit rather than gating a wall-clock number · landed · 29457bae
- 2026-09-07 01:25 · Meta · refusal · a gate asserting absolute select-all milliseconds — flaky by construction across machines and CI runners, and it would manufacture exactly the wake-spending false positives LOOPS.md rule 5 already documents · refused · 29457bae
- 2026-09-06 17:49 · Standardize · sweep · Slice 308 — Standardize sweep 4 of 4 lanes: 1-3 clean; lane 4's region finding REFUSED by per-section measurement (Step 0c holds at 936; +877 is five new rules) · landed · 4e0248ed
- 2026-09-06 17:49 · Meta · refusal · no second cut to LOOPS.md's dispatch region — the section 274.2 cut has not regrown by one word, so a cut would remove instruction · refused · 4e0248ed
- 2026-09-06 18:56 · Objective · grill · Slice 309 — Objective grill of 307/308: 308 reproduces to the word; under 307 a P0 (the reference app's shared init swallowed by a trailing comment since 2026-08-23, so the published select-all timing was a no-op), fixed + gated; roadmap_scope.py fence bug also fixed · landed · 26d464fe
- 2026-09-06 18:56 · Meta · refusal · publishing a replacement select-all figure — today's fixed-tree readings include a style flush the published table scores as its own column, so quoting them would repeat the exact error being corrected · refused · 26d464fe

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
