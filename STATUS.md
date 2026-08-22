# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-08-22 15:56

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
- **Slice 112** (3 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS.
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
  - 112.5 — "Which Pattern Should I Use?" docs page, after the 112.3 verdict.

## Dispatch counters

```
dispatch status — counter-triggered rules (671 iterations logged)
  Standardize   1 / 4 Continue round  since 2026-08-22 15:53   ok
  Objective     0 / 3 slices          since 2026-08-22 07:59   ok
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS.
- 104.2 — preview images on the tiles. OWNER CALL after 104.1.
- 99.4 — missing components discovered along the way go through the front door.
- 102.4 — reconcile the standing wake prompt with reality. OWNER CALL.
- 52.3 — The name. OWNER CALL, with the trade-off measured.
- 30.0 — AWAITING OWNER CLARIFICATION (2 wishlist notes, 2026-08-18).
- 30.4b — Windowed list: server chunks, client releases (W4).

## Last 10 iterations

- 2026-08-22 14:58 · Continue · build · 109.14 - No-JS States row added to all 26 pages lacking one (precise recount found 26, not the sweep's original 25); 4 parallel agents each required to read real script imports + behavior source before writing a claim; 2 spot-verified independently (master-detail dialog, command-bar no-native-affordance) before trusting; full suite green incl. check:claims 88/88 · landed · cc33407
- 2026-08-22 15:03 · Continue · build · 109.15 - human-monitoring-signal sentence resolved across all 8 pages: 4 relocated to Anatomy (job-monitor/notification/role-home tied to a real region; output-form handled honestly - its own prose already points monitoring elsewhere, sentence says so rather than force-fitting), 2 authored where a real signal exists (reporting-dashboard's stat delta+staleness, record-detail's audit actor column), 2 declined with a stated reason where genuinely absent (schedule, master-detail) · landed · b7424c5
- 2026-08-22 15:08 · Continue · build · 109.16 - Data-contract 4xx/error rows fixed on 9 pages (bulk-actions/list-report/staging got a deliberate-no-4xx design note; app-launch/notification/output-form/record-detail/reporting-dashboard/role-home got a real 404/5xx row grounded in each page's own established failure pattern); the sweep's original 4-page list was wrong (master-detail already had it), caught by manual re-verification against a fresh whole-catalogue scan; my own verification regex itself was wrong twice before landing on an accurate count · landed · e7cf62a
- 2026-08-22 15:09 · Standardize · standardize · sweep #7 after 4 Continue rounds (109.19 field-editor fold/109.14 No-JS/109.15 monitoring-signal/109.16 4xx rows, ~40 pattern-page edits total): full suite green (core build, docs build 13 gates, 116 vitest, stylelint, check:claims 88/88); full-repo field-editor reference scan clean (only 3 expected hits: historical comment, redirect config, claims-check origin comment); no duplicate boilerplate found across the 26 No-JS rows (each genuinely distinct, uniq-checked); 11 pages legitimately share the identical 'no JS dependency' phrase for the same true fact, not drift · logged · 2531b59
- 2026-08-22 15:19 · Continue · build · 109.17 - check-claims coverage added for inbox (arrow-key radio nav) and kanban (Move menu open/auto-close); job-monitor confirmed to have nothing live to check (inert buttons, hx-trigger never wired), no case forced. Found+fixed a real shipped bug: kanban's live script used type=module while every other page uses bare <script>, so initDropdowns() silently never ran in production - Move menu positioning/auto-close broken since ship, caught only by adding the live check this item asked for. Diagnosed with a pageerror listener, root-caused by comparing script tags across the whole catalogue, fix verified live (check:claims went from failing to passing on the exact case) · landed · 3bb089f
- 2026-08-22 15:36 · Continue · build · 109.18 - kanban lane cluster gained tabindex=0 (verified in built output); record-detail's 4 Anatomy items linked to their real components (breadcrumb/kv/dashboard-card/approval-workflow, the last found by grepping which docs page actually uses .bo-timeline/.bo-audit rather than guessing); Opener gained How-often clause; closes Slice 109's build queue (109.19/14/15/16/17/18 all landed) · landed · a45b047
- 2026-08-22 15:42 · Continue · build · 112.2 - llms.txt gained a generated Patterns section from patterns.json (name/opener/complexity/components/wrong-choice per pattern, kept lean vs full States/Data-contract detail); same anti-drift throw-if-too-small guard as the 32.3 precedent, red-proved by truncating patterns.json and confirming the build actually threw before restoring it; 22.9kB->36.7kB, 53->81 URLs verified · landed · d1cdf06
- 2026-08-22 15:50 · Continue · build · 113.1 - Advanced rich-text demo built (no pre-existing section existed despite the item assuming one); 7 execCommand button groups, wiring extended for value-taking commands + mutually-exclusive align group; 3 real surprises found testing live (strikethrough->deprecated <strike> tag, formatBlock->correct semantic headings, removeFormat->inline-only scope leaving headings/links intact); 2 promoted to permanent check-claims cases (92/92, up from 90); check-data-hooks caught the new data-richtext-value hook correctly on first build · landed · 92de5e6
- 2026-08-22 15:53 · Standardize · standardize · sweep #8 after 4 Continue rounds (109.19-checkbox-fix/112.2/113.1): full suite green; one real finding - list-report/approval were hardcoded into llms.txt's Key docs section before 112.2's full generated Patterns section existed, now duplicated with less detail than the generated version; removed the hardcoded pair · logged · b609009
- 2026-08-22 15:56 · Continue · build · 113.2 - rung-4 recipe extension written naming all four refused rich-text buttons (image/table/checklist/color) and what each needs; 2 claims verified live before shipping (insertImage URL-only, foreColor's real support + deprecated <font> output) rather than assumed; closes Slice 113 · landed · 542fc65

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
