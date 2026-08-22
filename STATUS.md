# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-08-22 12:34

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

## Dispatch counters

```
dispatch status — counter-triggered rules (642 iterations logged)
  Standardize   3 / 4 Continue rounds since 2026-08-22 12:14   ok
  Objective     0 / 3 slices          since 2026-08-22 07:59   ok
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

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

- 2026-08-22 11:19 · Continue · build · 102.9 editable-grid dirty-row reflow: tried global min-inline-size reservation first, measured it made two tables wrap permanently even clean (worse than the bug), reverted; fixed as demo-authoring debt instead (Cost centers column floor on the Advanced table) · landed · 55db531
- 2026-08-22 11:24 · Continue · build · 102.10 - wrong-choice clause for combobox/money/quantity, all three added to the FIRST demo-note paragraph (opener() only reads that one), content re-scored 2->3, TODO shrank by 3 · landed · 39785a9
- 2026-08-22 11:28 · Continue · build · 102.11 - CHANGELOG entries for 8 undocumented packages/core/src commits (grew past the originally-named 6) · landed · 8e8950f
- 2026-08-22 11:29 · Standardize · standardize · 3rd sweep post-102.2-102.11: min-inline-size 15rem consistent w/ kanban precedent, anchor-nav.ts/sticky-cols.ts custom-property patterns consistent (single live anchor-nav instance per page, no clobber risk today), no other stale amount-vs-money links, CHANGELOG entries format-consistent · logged · e886bb2
- 2026-08-22 11:41 · Continue · build · 104.1 - /patterns/ tile index, generated from the pages themselves; pattern-groups.mjs unified as sidebar+index source · landed · 7aec783
- 2026-08-22 11:51 · Continue · grill · 104.3 - defined the complexity scale on concurrent-live-state (not component count), corrected 3 badges (value-help/detail-form 3->2, field-editor 2->3) with evidence from each page's own States table, fixed a stale pre-109 tier label found on 2 of them, ran the per-group ladder audit and refused every gap through the 99.4 front door - no new items queued · landed · 4d6fbf3
- 2026-08-22 11:59 · Continue · build · 104.4 - complexity filter chips on the patterns index · refused · 52b5c86
- 2026-08-22 12:12 · Continue · build · 105.1 - one popover-positioning helper for dropdown/combobox/context-menu, unifying the drifted clamp+flip math; context-menu gains real flip-above behavior, combobox gains RTL alignment; scroll-follow policies deliberately kept separate (two distinct owner bug fixes); stale insetInlineStart red-proved fixed; 5 new tests, verified live via CDP · landed · 4b10d18
- 2026-08-22 12:14 · Standardize · standardize · sweep #4 - checked pattern-groups.mjs single-source-of-truth (gate-verified both directions), popover-position.ts vs sticky-cols.ts/anchor-nav.ts overlap (none, three distinct problems), 104.x demo min-inline-size overrides (matches kanban's pre-existing bare-rem convention), check-dsa-scores/check-wrong-choice redundancy (already share wrong-choice-rule.mjs) - clean pass, nothing to fix · logged · 511e29b
- 2026-08-22 12:34 · Continue · build · 110.5 - generated STATUS.md, human's ten-second now view, wired into record_iteration.py (reconciled from parallel worktree) · landed · d0edfbe

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
