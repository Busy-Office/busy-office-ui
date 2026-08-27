# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-08-28 00:22

## Open items by slice

- **Slice 112** (2 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- **Slice 153** (1 open)
  - 153.2 — `bo-date` is the one real miss.
- **Slice 157** (1 open)
  - 157.3 — write the guideline: when does a row show a marker at all?
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (954 iterations logged)
  Standardize   2 / 4 Continue rounds since 2026-08-28 00:09   ok
  Objective     2 / 3 slices          since 2026-08-28 00:13   ok  [151, 153]
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.
- 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- AT runtime evidence

## Last 10 iterations

- 2026-08-27 21:43 · Roadmap · plan · 155.1/155.2 triaged from the owner's create-ui question: the scaffold's ^0.5.0 pin is unchecked and check:quickstart bypasses it with --no-save, and create-ui/NOTICE is a byte-identical hand copy of core's · triaged · 758ca1a
- 2026-08-27 21:57 · Roadmap · plan · 156.1/156.2 triaged: owner wants a device layout guide; the framework is container-query responsive so Desktop/Tablet/Mobile are one shell at different widths — deliverable is a measured shell x device support matrix, RF the one genuine exception · triaged · c53bfaf
- 2026-08-27 22:24 · Continue · build · 156.1/156.2: a measured shell x device support matrix on /concepts/layouts with device entry points; found that crossing the 896px band gives main 171px MORE room, and that split master-detail's fixed 22rem list pane leaves a 36px detail pane at 390px · landed · ca5a34b
- 2026-08-27 23:33 · Continue · build · 157.1: icon-only row actions, Unsaved badge removed, dirty state moved onto the Save button's accessible name; new save/close glyphs; save-timing guide on inline-editing · landed · 9d1ecbe
- 2026-08-27 23:44 · Continue · build · 157.2: dropped the inset leading edge from td[data-tone] so the edge means only the ROW; cells keep their tint. RTL count did not move as predicted — six stays six, but DESIGN.md's prose named the removed bar · landed · 3a995d1
- 2026-08-28 00:09 · Standardize · tidy · 155.1/155.2 consolidated: create-ui's three derived artefacts (template screen, framework pin, NOTICE) get one --check freshness gate wired into CI; found that CI never ran create-ui's build at all, so the generated template screen had no verification · landed · e321aa2
- 2026-08-28 00:13 · Objective · grill · Objective grill 151/154/156/157: Accept criteria were embedding predictions and 2 of ~12 were falsified (Breaking-that-wasn't, a flip-site count that did not move); six instrument errors in one session, three of them name-derivation against a rule that already exists — assertions caught all six, recall caught none · logged · b2c556a
- 2026-08-28 00:13 · Meta · refusal · a gate that every var(--bo-*) resolves — base rate is 65 refs, 0 genuinely unresolved, and the measuring instrument was 6-for-6 false · refused · b2c556a
- 2026-08-28 00:19 · Continue · build · 151.3: ordinal values REFUSED — 168 suite badges, zero ranked; the rank word IS the ordinal channel and the two-channel rule makes it mandatory anyway, so a glyph would encode the same fact twice. Reopen test written on the badge page · refused · 6088cbb
- 2026-08-28 00:22 · Continue · build · 153.1: report-reach separates 'cannot appear' (bo-toast-region, a runtime container) from 'never composed' (7->6); the hand-kept exemption reconciles against measurement both ways so it cannot rot, red-proved on both paths · landed · c2c7d59

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
