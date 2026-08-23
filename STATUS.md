# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-08-23 22:51

## Open items by slice

- **Slice 99** (1 open)
  - 99.4 — missing components discovered along the way go through the front door.
- **Slice 112** (3 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
  - 112.5 — "Which Pattern Should I Use?" docs page, after the 112.3 verdict.
- **Slice 130** (4 open)
  - 130.2b — the P2P document flow, grilled 2026-08-23 (owner: "as per your recommendation").
  - 130.3 — module two, on the settled answers.
  - 130.4 — the remaining four modules.
  - 130.5 — wire the suite into CI
- **Slice 132** (5 open)
  - 132.1 — date entry has no home, and the deprecated one holds the seat.
  - 132.2 — "Search Help": check `/patterns/value-help` first.
  - 132.3 — calendar selection across 1/2/3 months.
  - 132.4 — file open/save panel.
  - 132.5 — list-to-list drag & drop. Read `.roundtable/grill-drag-drop-2026-08-21.md` BEFORE anything else.
- **Slice 133** (3 open)
  - 133.1 — a scroll sweep, red-proved.
  - 133.2 — object-page, scrolled for real.
  - 133.3 — whatever 133.1/133.2 find is a P0, not a note.
- **Slice 134** (3 open)
  - 134.1 — fix the key, and prove the dark half is dark.
  - 134.2 — re-baseline deliberately, never blind.
  - 134.3 — CI, or delete it.

## Dispatch counters

```
dispatch status — counter-triggered rules (793 iterations logged)
  Standardize   2 / 4 Continue rounds since 2026-08-23 22:29   ok
  Objective     0 / 3 slices          since 2026-08-23 18:32   ok
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 130.2b — the P2P document flow, grilled 2026-08-23 (owner: "as per your recommendation").
- 130.5 — wire the suite into CI
- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.
- 99.4 — missing components discovered along the way go through the front door.

## Last 10 iterations

- 2026-08-23 21:35 · Meta · refusal · goods-receipt screens in the ERP example — already covered by the goods-receipt pattern and the three RF screens · refused · 04b06e2
- 2026-08-23 21:35 · Meta · refusal · payment-run screens in the ERP example — select-and-run is bulk-actions, the unattended run is job-monitor · refused · 04b06e2
- 2026-08-23 22:21 · Standardize · dry · 131.1 — one RF screen per page; the mirror now follows the docs theme; components-used reads the embed · landed · 5a0b511
- 2026-08-23 22:23 · Roadmap · plan · 132 — owner wishlist triaged: date entry, search help, calendar months, file panel, list-to-list · triaged · 55c89da
- 2026-08-23 22:29 · Standardize · dry · 131.2 — RfDevice component: one call site for six embeds, chrome only where there is room · landed · 15f9bbc
- 2026-08-23 22:31 · Roadmap · plan · 133 — owner ask: prove table + object-page scrolling works; the scroll containers are exempt from every gate · triaged · 06ac2e8
- 2026-08-23 22:32 · Continue · build · 131.3 — icons on RF buttons, decided · refused · 75de725
- 2026-08-23 22:32 · Meta · refusal · growing the icon set for the RF exception bar: no glyph exists for Back/Skip/Report short, and the task-menu case was already refused on profile-size grounds · refused · 75de725
- 2026-08-23 22:33 · Roadmap · plan · 134 — test:visual: wrong theme key, stale baselines, runs in no workflow · triaged · 71a8f17
- 2026-08-23 22:51 · Continue · build · 130.2 GAP-2 — document flow decided as a bo-timeline composition, proved on two screens, GAP-14 found · landed · 0001553

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
