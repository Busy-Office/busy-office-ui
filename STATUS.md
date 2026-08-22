# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-08-22 15:08

## Open items by slice

- **Slice 30** (2 open)
  - 30.0 — AWAITING OWNER CLARIFICATION (2 wishlist notes, 2026-08-18).
  - 30.4b — Windowed list: server chunks, client releases (W4).
- **Slice 52** (1 open)
  - 52.3 — The name. OWNER CALL, with the trade-off measured.
- **Slice 99** (1 open)
  - 99.4 — missing components discovered along the way go through the front door.
- **Slice 102** (1 open)
  - 102.4 — reconcile the standing wake prompt with reality. OWNER CALL.
- **Slice 104** (1 open)
  - 104.2 — preview images on the tiles. OWNER CALL after 104.1.
- **Slice 109** (3 open)
  - 109.17 — check-claims.mjs has ZERO cases for `inbox`, `job-monitor`, `kanban`.
  - 109.18 — small mechanical fixes, one page each.
  - 109.19 — execute the field-editor fold decided by 109.4.
- **Slice 112** (4 open)
  - 112.2 — pattern catalogue into `llms.txt`.
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS.
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
  - 112.5 — "Which Pattern Should I Use?" docs page, after the 112.3 verdict.
- **Slice 113** (2 open)
  - 113.1 — richer rung-3 demo: the seven achievable buttons above, added to the Advanced demo (not Basic — keep Basic minimal per the grill's own "most ERP free-text should never be rich text" framing).
  - 113.2 — write the rung-4 recipe extension for the refused four

## Dispatch counters

```
dispatch status — counter-triggered rules (663 iterations logged)
  Standardize   3 / 4 Continue rounds since 2026-08-22 14:39   ok
  Objective     0 / 3 slices          since 2026-08-22 07:59   ok
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS.
- 109.19 — execute the field-editor fold decided by 109.4.
- 104.2 — preview images on the tiles. OWNER CALL after 104.1.
- 99.4 — missing components discovered along the way go through the front door.
- 102.4 — reconcile the standing wake prompt with reality. OWNER CALL.
- 52.3 — The name. OWNER CALL, with the trade-off measured.
- 30.0 — AWAITING OWNER CLARIFICATION (2 wishlist notes, 2026-08-18).
- 30.4b — Windowed list: server chunks, client releases (W4).

## Last 10 iterations

- 2026-08-22 14:25 · Continue · build · 109.6/109.13 batch 2 - remaining 13 pattern pages bar-scored (3 parallel agents), closing the 26-page sweep; second false runtime claim found+fixed (schedule.astro's calendar-breakpoint claim, verified against calendar.css before fixing); caught a real item-numbering collision mid-commit (my own 109.6/109.8 duplicated pre-existing items further down Slice 109) via the 101.2 enumeration check and renumbered to 109.13-109.18 before landing; queued 5 systemic findings (No-JS rows 25/26 pages, human-monitoring placement/absence, missing 4xx rows, zero check-claims coverage on inbox/job-monitor/kanban, mechanical fixes) as their own items · landed · b2117e3
- 2026-08-22 14:35 · Roadmap · triage · 113: owner rich-text sample screenshot triaged against 102.1's rung ladder - 7 execCommand buttons accepted as a richer rung-3 Advanced demo (113.1), rung-4 recipe doc for the refused four (113.2) · triaged · caae589
- 2026-08-22 14:35 · Meta · refusal · Image upload, table-insertion UI, checklist list-type, color/highlight pickers as new richtext framework surface - infrastructure/distinct-component territory, same grounds as the 101.7 PDF/barcode refusals; re-open only if a real pattern page demonstrates the need · refused · caae589
- 2026-08-22 14:36 · Continue · build · 112.1 - patterns.json extraction from pattern pages (gen-patterns.mjs: group/opener/complexity/components/States rows/Data-contract rows/wrong-choice clause+link, Anatomy deliberately out of scope per doctrine); self-tested (--self-test, red-proved by breaking the row regex and confirming 2/6 cases went red), reconciled against hand-counts on 9+ pages incl. edge cases (nested <code> tags, no-link wrong-choice clauses); wired into the docs build chain. Landed inside commit 8b60445 (mislabeled - that commit's message only describes 113; caught via git status after the fact, not before - lesson: check git status before a broad git add -A even mid-loop, not just at explicit commit time) · landed · 8b60445
- 2026-08-22 14:39 · Standardize · standardize · sweep #6 after 4 Continue rounds (109.3/109.6-batches/113-triage/112.1): full suite green, one real finding - COMPLEXITY_RE/BADGE_RE byte-identical across gen-patterns-index.mjs and the new gen-patterns.mjs, plus a third independent opener-regex copy; consolidated into pattern-extract.mjs, verified output-neutral (both generated JSONs byte-identical before/after) · logged · 6dfb33b
- 2026-08-22 14:48 · Continue · build · 109.19 - field-editor fold executed (age-order override written down per LOOPS.md, justified by avoiding double-touching detail-form/editable-grid once 109.14/109.16 run); folded as a variant section not full duplication; page deleted, Astro-native redirect added; all internal links updated; caught+fixed a real shipped bug via check:claims (missing <form> wrapper made type=reset inert - diagnosed by reading row-edit.ts's reset handler directly, confirmed it only fires on HTMLFormElement targets); full suite green (88/88 claims, wrong-choice 29/0) · landed · 69a5336
- 2026-08-22 14:49 · Roadmap · triage · 114: owner htmx-4 wishlist verified via WebFetch (real, beta 6) then triaged against the Objective - refused, its swap-everything-except-204/304 default inverts the discards-non-2xx behavior baked into getting-started/htmx.astro and dozens of pattern Data-contract rows · triaged · dfdeb6c
- 2026-08-22 14:49 · Meta · refusal · htmx 4 adoption - beta not stable, inverts documented swap-discard behavior across the pattern catalogue, no demonstrated gap; re-open on stable release + a scoped claim-audit first · refused · dfdeb6c
- 2026-08-22 14:58 · Continue · build · 109.14 - No-JS States row added to all 26 pages lacking one (precise recount found 26, not the sweep's original 25); 4 parallel agents each required to read real script imports + behavior source before writing a claim; 2 spot-verified independently (master-detail dialog, command-bar no-native-affordance) before trusting; full suite green incl. check:claims 88/88 · landed · cc33407
- 2026-08-22 15:03 · Continue · build · 109.15 - human-monitoring-signal sentence resolved across all 8 pages: 4 relocated to Anatomy (job-monitor/notification/role-home tied to a real region; output-form handled honestly - its own prose already points monitoring elsewhere, sentence says so rather than force-fitting), 2 authored where a real signal exists (reporting-dashboard's stat delta+staleness, record-detail's audit actor column), 2 declined with a stated reason where genuinely absent (schedule, master-detail) · landed · b7424c5

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
