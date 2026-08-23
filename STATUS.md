# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-08-23 10:52

## Open items by slice

- **Slice 99** (1 open)
  - 99.4 — missing components discovered along the way go through the front door.
- **Slice 102** (1 open)
  - 102.4 — reconcile the standing wake prompt with reality. OWNER CALL.
- **Slice 104** (1 open)
  - 104.2 — preview images on the tiles. OWNER CALL after 104.1.
- **Slice 112** (3 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS.
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
  - 112.5 — "Which Pattern Should I Use?" docs page, after the 112.3 verdict.
- **Slice 119** (1 open)
  - 119.3 — App-frame pattern. BLOCKED ON OWNER GRILL.
- **Slice 121** (3 open)
  - 121.1 — Reconciliation / matching screen. BLOCKED ON GRILL.
  - 121.2 — Timesheet / time entry. BLOCKED ON GRILL.
  - 121.3 — Comparison / evaluation matrix. BLOCKED ON GRILL.
- **Slice 122** (1 open)
  - 122.1 — BLOCKED ON GRILL.
- **Slice 123** (3 open)
  - 123.3a — Reconciliation pattern, decided: Xero-style two-column with suggested matches.
  - 123.3b — Timesheet pattern, decided: inline-editable grid
  - 123.3c — Comparison matrix pattern, decided: select-one award.

## Dispatch counters

```
dispatch status — counter-triggered rules (737 iterations logged)
  Standardize   6 / 4 Continue rounds since 2026-08-23 00:32   OVERDUE
  Objective     1 / 3 slice           since 2026-08-23 00:10   ok  [52]
  -> a counter is at or past its threshold; the dispatcher should pick it
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 123.3a — Reconciliation pattern, decided: Xero-style two-column with suggested matches.
- 122.1 — BLOCKED ON GRILL.
- 121.3 — Comparison / evaluation matrix. BLOCKED ON GRILL.
- 119.3 — App-frame pattern. BLOCKED ON OWNER GRILL.
- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS.
- 104.2 — preview images on the tiles. OWNER CALL after 104.1.
- 99.4 — missing components discovered along the way go through the front door.
- 102.4 — reconcile the standing wake prompt with reality. OWNER CALL.

## Last 10 iterations

- 2026-08-23 09:20 · Continue · bug · output-form 390px table overflow (caught by CI's first layout sweep in 2 days) · landed · 0eec725
- 2026-08-23 09:34 · Continue · bug · axe: schedule/full landmarks+heading-order, command-bar placeholder-only name · landed · c862d39
- 2026-08-23 10:25 · Roadmap · plan · 123.1-123.3c: nine recommendations signed off, Accept criteria written · triaged · a08ec58
- 2026-08-23 10:25 · Meta · refusal · live as-you-type masking (on-blur decided per ERP evidence) · refused · a08ec58
- 2026-08-23 10:25 · Meta · refusal · mobile bottom-nav frame tier (icon-rail collapse suffices for now) · refused · a08ec58
- 2026-08-23 10:25 · Meta · refusal · QBO single-checklist and BC journal-drawer reconciliation layouts · refused · a08ec58
- 2026-08-23 10:25 · Meta · refusal · Workday day-click-modal timesheet entry · refused · a08ec58
- 2026-08-23 10:25 · Meta · refusal · split-award comparison action (select-one for v1) · refused · a08ec58
- 2026-08-23 10:40 · Continue · build · 123.1: initGroupedNumber shipped — one grouped-display behavior for Money/Quantity/numeric · landed · 341ea7f
- 2026-08-23 10:52 · Continue · build · 123.2: app-frame + suite-home patterns shipped; 30.0 closed · landed · 8c17141

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
