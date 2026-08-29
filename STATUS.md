# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-08-29 12:56 UTC

## Open items by slice

- **Slice 112** (2 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- **Slice 200** (6 open)
  - 200.2 — restrained button press feedback, pointer-only.
  - 200.3 — tab and segmented-control selection get a style transition, no slide/pill.
  - 200.4 — data-table bulk-actions get an entrance transition instead of an instant `display` flip.
  - 200.5 — toast gets an exit animation and a bounded stack-reflow, matching the entrance it already has.
  - 200.6 — row insert/delete and inline-validation entrance, composed from existing motion-module utilities, plus the usage guidance the already-shipped pulse/settle mechanisms are missing.
  - 200.7 — a lint check that a raw ms duration or literal easing function isn't hand-written in component CSS where a `--bo-motion-` prefixed token exists.
- **Slice 201** (1 open)
  - 201.4 — 200.7's gate is largely already shipped as `check:motion`, and a naive version would fail the build on two right answers.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1155 iterations logged)
  Standardize   5 / 4 Continue rounds since 2026-08-29 18:49   OVERDUE
  Objective     3 / 3 slices          since 2026-08-29 18:54   OVERDUE  [199, 200, 201]
  -> a counter is at or past its threshold; the dispatcher should pick it
  Optimize      0 wake-date(s) newer   since 2026-08-29 01:46   ok   [newest pair: axe-violations; 101 sample(s), 13 of 30 name(s) sampled twice]
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
- 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- AT runtime evidence

## Last 10 iterations

- 2026-08-29 20:27 · Roadmap · plan · Slice 200 — triaged the external micro-motion UX proposal: 5 accepted, 1 gate candidate, 4 refused/rethought · triaged · 7036bfc
- 2026-08-29 20:27 · Meta · refusal · live-table-pulse and pagination-transition items as new work — bo-motion-pulse-once and the htmx settle/swap fade already ship this · refused · 7036bfc
- 2026-08-29 20:27 · Meta · refusal · save/submit four-state sequence as a component CSS slice — rerouted to a docs pattern page, it composes existing primitives across behavior+markup · refused · 7036bfc
- 2026-08-29 20:27 · Meta · refusal · hand-authored motion spec matrix — must be generated from tokens/motion.css, never transcribed · refused · 7036bfc
- 2026-08-29 20:27 · Meta · refusal · tree disclosure content-continuity work — chevron rotation and bo-motion-collapse already exist and already compose the proposed behavior · refused · 7036bfc
- 2026-08-29 20:36 · Explore · research · royui.dibbayajyoti.com component docs researched — one real gap (Known Limits section), filed to Ideas backlog for a spike; distribution model doesn't transfer · logged · ccb2e54
- 2026-08-29 20:36 · Meta · refusal · a per-component Theming section — ApiTable already generates the custom-property surface RoyUI hand-authors · refused · ccb2e54
- 2026-08-29 20:46 · Continue · build · 200.1 — dialog gets exit motion, reusing offcanvas's allow-discrete recipe verbatim; caught and fixed a test-harness focus artifact along the way · landed · f0d7324
- 2026-08-29 12:56 · Continue · bug · 201 — P0: two undefined var(--bo-*) references silently dropped their declarations (scan flash invisible, combobox code not monospace); fixed both, added check:token-refs · landed · 0026066a
- 2026-08-29 12:56 · Meta · refusal · a naive 200.7 literal-duration gate — its only two reds are scan's 600ms and skeleton's 1.8s, both deliberate and both already adjudicated by check:motion (filed as 201.4, left OPEN) · refused · 0026066a

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
