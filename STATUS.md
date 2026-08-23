# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-08-23 14:23

## Open items by slice

- **Slice 99** (1 open)
  - 99.4 — missing components discovered along the way go through the front door.
- **Slice 112** (3 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
  - 112.5 — "Which Pattern Should I Use?" docs page, after the 112.3 verdict.

## Dispatch counters

```
dispatch status — counter-triggered rules (754 iterations logged)
  Standardize   4 / 4 Continue rounds since 2026-08-23 11:11   OVERDUE
  Objective     0 / 3 slices          since 2026-08-23 13:38   ok
  -> a counter is at or past its threshold; the dispatcher should pick it
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.
- 99.4 — missing components discovered along the way go through the front door.

## Last 10 iterations

- 2026-08-23 12:00 · Meta · refusal · split/allocated award across multiple winners (select-one for v1, re-open condition documented on the page) · refused · b833474
- 2026-08-23 12:15 · Continue · bug · 124: RTL flip for the tone bar (gate was blind to inset box-shadow) + when-to-use guidelines + comparison matrix re-marked by weight · landed · 098d026
- 2026-08-23 12:33 · Polish · tidy · Polish rounds 2-5: avatar/badge/byline/calendar wrong-choice clauses, blind-scored 2->3 · landed · bd8f9f0
- 2026-08-23 12:45 · Polish · tidy · Polish rounds 6-9: dashboard/data-table/icon/inline-editing wrong-choice clauses, blind-scored · landed · 8287236
- 2026-08-23 13:00 · Polish · tidy · Polish rounds 10-13: navbar/pagination/progress/sidebar-nav wrong-choice clauses, blind-scored · landed · d9dfa5e
- 2026-08-23 13:33 · Polish · tidy · Polish rounds 14-18: queue dry — 36/37 pages carry the wrong-choice clause · landed · 2a47d4e
- 2026-08-23 13:38 · Objective · grill · Research rounds 1-2: DsaScore false gap closed with evidence; tile-preview evidence brief for 104.2 · logged · 637eb0b
- 2026-08-23 14:09 · Continue · build · 102.4 wake prompt adopted; 104.2 c-scoped tile miniatures built (10 previews, inert, gate 1.4.12 principled exclusion red-proved) · landed · f17089c
- 2026-08-23 14:15 · Roadmap · plan · 112.3: protocol owner-confirmed, pilot scaffold created (briefs remain owner-authored) · triaged · e58ea3c
- 2026-08-23 14:23 · Continue · build · 0.4.0 released (grouped numbers + RTL fix); 0.3.0 docs snapshot cut from the tag, switcher offers three versions · released · 4669b23

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
