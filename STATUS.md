# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-09-07 03:49 UTC

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
- **Slice 305** (2 open)
  - 305.1 — The four defects round 3 left standing.
  - 305.2 — Run the repo's own gates on a gauntlet artifact BEFORE spending a critic round.
- **Slice 306** (1 open)
  - 306.1 — rule 5's staleness comparison must not be able to report "stale" for a reason that is only a timezone.
- **Slice 307** (1 open)
  - 307.1 — Rule 5 starves structurally: 42 metric names, 130 samples, 13 names sampled twice.
- **Slice 309** (1 open)
  - 309.5 — The `/stress` harness is half a harness: the rows are kept, the measurement is not.
- **Slice 310** (2 open)
  - 310.1 — `examples/erp-suite` and `examples/po-app` render deprecated glyphs, and whether that is a defect is undecided.
  - 310.2 — `/base/motion` declares five copyable markup samples the template never renders.
- **Slice 314** (1 open)
  - 314.2 — the same scope gap exists for SPACING and `font-weight` literals, and it is a different property with no verdict — filed, not built.
- **Slice 315** (1 open)
  - 315.3 — should `check:selftests` EXECUTE each self-test rather than grep for the branch? Filed with its base rate, deliberately not built inside a grill.
- **Slice 316** (1 open)
  - 316.1 — should a gate forbid a theme token in a `@media print` colour declaration?
- **Slice 319** (1 open)
  - 319.3 — should a docs page be allowed to assert a target size at all without a gate that can see it?
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1570 iterations logged)
  Standardize   4 / 4 Continue rounds since 2026-09-06 22:53   OVERDUE
  Objective     1 / 3 slice           since 2026-09-07 03:02   ok  [304]
  -> a counter is at or past its threshold; the dispatcher should pick it
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

- 2026-09-07 00:48 · Continue · build · 298.1 — fixed-medium artifact convention: the second precedent predates the first by 25 days; a theme token in @media print prints at 2.54:1 on white paper · landed · 810e37fa
- 2026-09-07 00:48 · Meta · refusal · building the @media-print token gate in the same round — filed as 316.1 with its base rate measured (0 of 11) rather than manufactured alongside the convention · refused · 810e37fa
- 2026-09-07 01:50 · Continue · build · 300.2 — board/kanban spike: refuse the component (4 of 5 params are announcement strings); fix /patterns/kanban's unexecutable screen-reader-announcement claim · refused · 0c24d13e
- 2026-09-07 01:50 · Meta · refusal · lifting data-grid.ts's roving-tabindex navigation out of <table> — one candidate consumer (a board that does not exist); bo-calendar, the only other non-table grid, deliberately refuses the model · refused · 0c24d13e
- 2026-09-07 02:00 · Continue · bug · 318.1 — check:claims's calendar case raced a real form-GET navigation against a fixed 400ms wait (red on CI run 807, green on 808 with no code change); waits for the navigation now, red-proved by an 800ms delay injection · landed · 168269ac
- 2026-09-07 03:02 · Objective · grill · Slice 319 — grill of 298/300/318: 23 of 25 assertions reproduce; 318's "99 other fixed waits" is 98 (a removal counted against raw text its own comment names), and /patterns/kanban's glove-target claim is false at 24px — corrected, and its keyboard claim made executable and red-proved twice · landed · 6e5724bb
- 2026-09-07 03:02 · Meta · refusal · adding /patterns/kanban to check:target-size's 7-page sweep — the menu items measure 0x0 while the popover is closed, so the sweep could not see the claim it would exist to check; filed as 319.3 with its base rate (18 vocabulary pages / 7 swept / 4 overlap) instead · refused · 6e5724bb
- 2026-09-07 03:49 · Continue · build · 304.1 — roadmap_scope.py's header names the tree its figures describe; base rate 7 of 11 published ratios describe the parent, not the commit · landed · 8beee329
- 2026-09-07 03:49 · Meta · refusal · attributing a published bare percentage by git log -S — the needle collides with the tail of a longer percentage (79.5% contains 9.5%) · refused · 8beee329
- 2026-09-07 03:49 · Meta · refusal · matching an 'N lines' figure — it cannot tell the denominator from the numerator, a subset, or the trigger threshold · refused · 8beee329

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
