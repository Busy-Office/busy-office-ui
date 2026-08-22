# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-08-22 22:32

## Open items by slice

- **Slice 30** (1 open)
  - 30.0 — AWAITING OWNER CLARIFICATION (2 wishlist notes, 2026-08-18).
- **Slice 52** (1 open)
  - 52.3 — The name. OWNER CALL, with the trade-off measured.
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
- **Slice 119** (3 open)
  - 119.1 — Error pages: 404 / 403 / 500 as ONE pattern.
  - 119.2 — ERP layout overview, as a CONCEPTS page.
  - 119.3 — App-frame pattern. BLOCKED ON OWNER GRILL.

## Dispatch counters

```
dispatch status — counter-triggered rules (702 iterations logged)
  Standardize   4 / 4 Continue rounds since 2026-08-22 17:12   OVERDUE
  Objective     1 / 3 slice           since 2026-08-22 07:59   ok  [30]
  -> a counter is at or past its threshold; the dispatcher should pick it
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 119.2 — ERP layout overview, as a CONCEPTS page.
- 119.3 — App-frame pattern. BLOCKED ON OWNER GRILL.
- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS.
- 104.2 — preview images on the tiles. OWNER CALL after 104.1.
- 99.4 — missing components discovered along the way go through the front door.
- 102.4 — reconcile the standing wake prompt with reality. OWNER CALL.
- 52.3 — The name. OWNER CALL, with the trade-off measured.
- 30.0 — AWAITING OWNER CLARIFICATION (2 wishlist notes, 2026-08-18).

## Last 10 iterations

- 2026-08-22 20:23 · Explore · build · 116.2: /inbox dogfooded into po-app, closes role-home's documented gap, real dialog-id collision bug found and fixed by the gate's own first run · landed · ba08035
- 2026-08-22 20:46 · Roadmap · triage · 117: form label position grilled and triaged (top/start accepted as section modifier) · triaged · e9ffce5
- 2026-08-22 20:46 · Meta · refusal · label-right for input/dropdown (inverts reading order; no design-system precedent) · refused · e9ffce5
- 2026-08-22 20:46 · Meta · refusal · per-control-type value sets (dissolved once right fell out) · refused · e9ffce5
- 2026-08-22 20:46 · Meta · refusal · per-field position override (speculative) · refused · e9ffce5
- 2026-08-22 20:46 · Meta · refusal · new CSS for checkbox/radio label side (markup order already solves it) · refused · e9ffce5
- 2026-08-22 20:57 · Continue · build · 117.1: form-section --label-start modifier, reusing bo-kv--rows's subgrid alignment; RTL-flip claim red-proved · landed · d397de6
- 2026-08-22 21:04 · Explore · build · --label-start dogfood into po-app: no natural target, discarded before spiking (form-row incompatibility found by reading) · refused · 59f9084
- 2026-08-22 21:50 · Continue · build · 30.4b: initWindowedList behavior + /concepts/scale rewrite landed (red-proof dogfood still open) · landed · a1239e0
- 2026-08-22 22:23 · Continue · build · 30.4b closed: /movements dogfood + permanent red-proof in check-po-app; four real bugs found by the instrument before it ever passed · landed · 82c7a49

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
