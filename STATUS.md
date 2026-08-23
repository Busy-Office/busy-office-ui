# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-08-24 05:13

## Open items by slice

- **Slice 112** (3 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
  - 112.5 — "Which Pattern Should I Use?" docs page, after the 112.3 verdict.
- **Slice 130** (3 open)
  - 130.3 — module two, on the settled answers.
  - 130.4 — the remaining four modules.
  - 130.5 — wire the suite into CI
- **Slice 132** (1 open)
  - 132.5 — list-to-list drag & drop. Read `.roundtable/grill-drag-drop-2026-08-21.md` BEFORE anything else.

## Dispatch counters

```
dispatch status — counter-triggered rules (834 iterations logged)
  Standardize   3 / 4 Continue rounds since 2026-08-24 05:00   ok
  Objective     0 / 3 slices          since 2026-08-23 18:32   ok
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 130.5 — wire the suite into CI
- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.

## Last 10 iterations

- 2026-08-24 04:48 · Continue · build · 134.1/134.2 — visual gate: theme key fixed and asserted per shot, baselines re-attributed and regenerated; 134.3 is an owner call with three costed options · landed · a25c780
- 2026-08-24 04:56 · Continue · build · 132.1 — date entry documented on /components/form#dates; component refused (native measured identical at 3 densities); deprecated page moved to Reference · landed · 3909b80
- 2026-08-24 04:56 · Meta · refusal · a date-input component or CSS — native brings locale order, picker, keyboard entry and min/max validation, and matches .bo-input's height exactly · refused · 3909b80
- 2026-08-24 05:00 · Standardize · dry · native-date rule: 4 pages mentioned it, none linked to the canonical section; three pointers added · landed · a5db304
- 2026-08-24 05:03 · Continue · build · 132.2 — Search Help = value-help; vocabulary line added, F4's three capabilities compared (2 already covered, 1 correctly absent) · landed · 01e637f
- 2026-08-24 05:03 · Meta · refusal · a second picker pattern for search help — the Objective's rethink test: two surfaces growing toward each other · refused · 01e637f
- 2026-08-24 05:08 · Continue · build · 132.3 — calendar: triage premise was wrong (3 of 4 asks already shipped); range guidance added, drag-select refused · landed · 16ed66d
- 2026-08-24 05:08 · Meta · refusal · a 2-month demo (repeats the 3-month point) and a scripted drag-select range picker · refused · 16ed66d
- 2026-08-24 05:13 · Continue · build · 132.4 — file open/save panel refused as a pattern; mapped to file-upload / value-help / form-in-dialog and documented · refused · 4c5c199
- 2026-08-24 05:13 · Meta · refusal · a file-panel pattern — the OS owns the local picker, value-help is the store picker, and a browser has no save panel · refused · 4c5c199

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
