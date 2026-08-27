# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-08-27 23:33

## Open items by slice

- **Slice 112** (2 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- **Slice 151** (1 open)
  - 151.3 — ordinal values: RETHINK, do not add a priority modifier.
- **Slice 153** (2 open)
  - 153.1 — teach `report-reach` the fourth meaning.
  - 153.2 — `bo-date` is the one real miss.
- **Slice 155** (2 open)
  - 155.1 — the scaffold's framework pin is unchecked, and the gate that looks like it covers it steps around it.
  - 155.2 — `packages/create-ui/NOTICE` is a byte-identical hand copy of `packages/core/NOTICE`.
- **Slice 157** (2 open)
  - 157.2 — the leading edge is a ROW marker; drop it at cell level.
  - 157.3 — write the guideline: when does a row show a marker at all?
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (948 iterations logged)
  Standardize   6 / 4 Continue rounds since 2026-08-27 01:40   OVERDUE
  Objective     4 / 3 slices          since 2026-08-27 05:39   OVERDUE  [151, 154, 156, 157]
  -> a counter is at or past its threshold; the dispatcher should pick it
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.
- 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- AT runtime evidence

## Last 10 iterations

- 2026-08-27 08:30 · Continue · build · 151.2: a column can explain itself (real button + popover, keyboard/touch, gated by 2 claims cases); uncovered and fixed a top-layer panel inheriting its DOM parent's uppercase/nowrap typography · landed · 8532466
- 2026-08-27 08:30 · Meta · refusal · forcing the framework's 34ch prose measure over the docs' own unlayered 46rem — the cascade contract says a consumer override wins · refused · 8532466
- 2026-08-27 15:04 · Roadmap · plan · triaged a reference form-layout engine: 154.1/154.2 queued as P0 (validation-summary hands a dead link into a hidden tab panel or closed details; canonical markup omits novalidate so the behavior never runs), five mechanisms refused with reasons · triaged · fca43f7
- 2026-08-27 15:04 · Meta · refusal · Tab-key takeover, alt+hover fieldnames, colour-named message block, auto-hiding empty sections, scroll-direction tab strip · refused · fca43f7
- 2026-08-27 15:44 · Continue · bug · 154.1/154.2: validation-summary handed a dead link into a hidden container — reveal(el) opens a closed <details>, an inactive tab panel or a collapsed widget by pressing its own control and verifying the press; a THIRD container found mid-build fails worse (focus succeeds into a 0px overflow:hidden box); canonical markup now carries the novalidate without which the behavior never runs · landed · 6e25b0e
- 2026-08-27 15:57 · Continue · bug · 154.1 verifier pass: the collapsed-card reveal was claimed on the page but proven only in jsdom — now demoed and checked live (transition settled, non-zero height on the box carrying the constraint), red-proved in isolation; the tabpanel path is an explicit EXEMPT with a reason; the tabpanel fallback no longer leaves two tabs aria-selected · landed · 0ae6141
- 2026-08-27 21:43 · Roadmap · plan · 155.1/155.2 triaged from the owner's create-ui question: the scaffold's ^0.5.0 pin is unchecked and check:quickstart bypasses it with --no-save, and create-ui/NOTICE is a byte-identical hand copy of core's · triaged · 758ca1a
- 2026-08-27 21:57 · Roadmap · plan · 156.1/156.2 triaged: owner wants a device layout guide; the framework is container-query responsive so Desktop/Tablet/Mobile are one shell at different widths — deliverable is a measured shell x device support matrix, RF the one genuine exception · triaged · c53bfaf
- 2026-08-27 22:24 · Continue · build · 156.1/156.2: a measured shell x device support matrix on /concepts/layouts with device entry points; found that crossing the 896px band gives main 171px MORE room, and that split master-detail's fixed 22rem list pane leaves a 36px detail pane at 390px · landed · ca5a34b
- 2026-08-27 23:33 · Continue · build · 157.1: icon-only row actions, Unsaved badge removed, dirty state moved onto the Save button's accessible name; new save/close glyphs; save-timing guide on inline-editing · landed · 9d1ecbe

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
