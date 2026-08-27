# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-08-27 18:57

## Open items by slice

- **Slice 112** (2 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- **Slice 158** (2 open)
  - 158.1 — decide, per outlier, whether the PROSE or the THING is wrong.
  - 158.2 — the loop's own prose discipline.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (962 iterations logged)
  Standardize   0 / 4 Continue rounds since 2026-08-27 18:57   ok
  Objective     3 / 3 slices          since 2026-08-28 00:13   OVERDUE  [151, 153, 157]
  -> a counter is at or past its threshold; the dispatcher should pick it
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.
- 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- AT runtime evidence

## Last 10 iterations

- 2026-08-27 18:47 · Standardize · tidy · viewport-width forks: 29 literals in 4 gate scripts back to viewports.mjs + check:viewport-forks to hold the line · landed · 728d8aa
- 2026-08-27 18:55 · Standardize · tidy · gate-report bypass: check-versions zero-guard (8 of 9 non-users were fine); visually-hidden triple settled + cross-referenced · landed · 0768f09
- 2026-08-27 18:57 · Standardize · tidy · skip-list fork: source-files.mjs re-exports paths.mjs SOURCE_SKIP_DIRS; clean pass across all chokepoints · landed · dd482f3
- 2026-08-27 18:57 · Meta · refusal · a gate for skip-list forks — base rate is 1 true signal vs 2 exceptions, ceremony not a gate · refused · dd482f3

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
