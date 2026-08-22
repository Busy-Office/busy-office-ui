# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-08-22 13:05

## Open items by slice

- **Slice 30** (2 open)
  - 30.0 — AWAITING OWNER CLARIFICATION (2 wishlist notes, 2026-08-18).
  - 30.4b — Windowed list: server chunks, client releases (W4).
- **Slice 52** (1 open)
  - 52.3 — The name. OWNER CALL, with the trade-off measured.
- **Slice 99** (1 open)
  - 99.4 — missing components discovered along the way go through the front door.
- **Slice 101** (1 open)
  - 101.1 — SUPERSEDED by 102.5, 2026-08-22.
- **Slice 102** (1 open)
  - 102.4 — reconcile the standing wake prompt with reality. OWNER CALL.
- **Slice 104** (1 open)
  - 104.2 — preview images on the tiles. OWNER CALL after 104.1.
- **Slice 109** (2 open)
  - 109.3 — quality bar, sequenced not sprayed
  - 109.4 — `field-editor` membership question.
- **Slice 110** (1 open)
  - 110.4 — archive closed slices out of ROADMAP.md.
- **Slice 112** (5 open)
  - 112.1 — `patterns.json`, extracted not authored.
  - 112.2 — pattern catalogue into `llms.txt`.
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS.
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
  - 112.5 — "Which Pattern Should I Use?" docs page, after the 112.3 verdict.

## Dispatch counters

```
dispatch status — counter-triggered rules (649 iterations logged)
  Standardize   3 / 4 Continue rounds since 2026-08-22 12:14   ok
  Objective     0 / 3 slices          since 2026-08-22 07:59   ok
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS.
- 110.4 — archive closed slices out of ROADMAP.md.
- 109.3 — quality bar, sequenced not sprayed
- 109.4 — `field-editor` membership question.
- 104.2 — preview images on the tiles. OWNER CALL after 104.1.
- 99.4 — missing components discovered along the way go through the front door.
- 102.4 — reconcile the standing wake prompt with reality. OWNER CALL.
- 101.1 — SUPERSEDED by 102.5, 2026-08-22.
- 52.3 — The name. OWNER CALL, with the trade-off measured.
- 30.0 — AWAITING OWNER CLARIFICATION (2 wishlist notes, 2026-08-18).
- 30.4b — Windowed list: server chunks, client releases (W4).

## Last 10 iterations

- 2026-08-22 12:12 · Continue · build · 105.1 - one popover-positioning helper for dropdown/combobox/context-menu, unifying the drifted clamp+flip math; context-menu gains real flip-above behavior, combobox gains RTL alignment; scroll-follow policies deliberately kept separate (two distinct owner bug fixes); stale insetInlineStart red-proved fixed; 5 new tests, verified live via CDP · landed · 4b10d18
- 2026-08-22 12:14 · Standardize · standardize · sweep #4 - checked pattern-groups.mjs single-source-of-truth (gate-verified both directions), popover-position.ts vs sticky-cols.ts/anchor-nav.ts overlap (none, three distinct problems), 104.x demo min-inline-size overrides (matches kanban's pre-existing bare-rem convention), check-dsa-scores/check-wrong-choice redundancy (already share wrong-choice-rule.mjs) - clean pass, nothing to fix · logged · 511e29b
- 2026-08-22 12:34 · Continue · build · 110.5 - generated STATUS.md, human's ten-second now view, wired into record_iteration.py (reconciled from parallel worktree) · landed · d0edfbe
- 2026-08-22 13:05 · Roadmap · triage · 112: external governance/conformance proposal grilled (2-round design tree, owner: checker is for AI agents) — metadata substrate queued unconditionally (patterns.json extraction, llms.txt catalogue), Screen Contract gated behind a 32-style pilot with pre-registered >=2-brief bar; 109.3 grows the 13 wrong-choice clauses · triaged · 04fdf23
- 2026-08-22 13:05 · Meta · refusal · Consumer Quality Index /100 + application benchmarking — human-org machinery, no second consumer exists (proposal's own §16 rule) · refused · 04fdf23
- 2026-08-22 13:05 · Meta · refusal · Waiver system + SARIF output — CI-exception machinery for human orgs; an AI agent needs PASS/FAIL and readable findings · refused · 04fdf23
- 2026-08-22 13:05 · Meta · refusal · A second Surface Fitness rubric — the six-dimension DSA rubric already gated; Removal Cost axis may be absorbed later · refused · 04fdf23
- 2026-08-22 13:05 · Meta · refusal · Six-section docs IA reorg — 80% renames of groups measured into place more recently than the proposal was written · refused · 04fdf23
- 2026-08-22 13:05 · Meta · refusal · Hand-authored pattern metadata YAML — inverts the generated-from-artifact doctrine; superseded by extraction · refused · 04fdf23
- 2026-08-22 13:05 · Meta · refusal · Consumer-facing conformance web tool — downstream of the refused Quality Index · refused · 04fdf23

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
