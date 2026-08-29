# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-08-29 03:27 UTC

## Open items by slice

- **Slice 112** (2 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- **Slice 186** (1 open)
  - 186.1 — `RESUME.md`'s slice-id claims are reconciled against `ROADMAP.md`'s checkboxes, and the disagreement is reported.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1104 iterations logged)
  Standardize   3 / 4 Continue rounds since 2026-08-29 10:21   ok
  Objective     4 / 3 slices          since 2026-08-29 01:46   OVERDUE  [173, 185, 186, 187]
  -> a counter is at or past its threshold; the dispatcher should pick it
  Optimize      0 wake-date(s) newer   since 2026-08-29 01:46   ok   [newest pair: axe-violations; 101 sample(s), 13 of 30 name(s) sampled twice]
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
- 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- AT runtime evidence

## Last 10 iterations

- 2026-08-29 01:46 · Meta · refusal · a general 'gate every self-description' programme — 176.2's predicate was true of 19 of 19 and 94.11's of 155 of 155; one reconciliation with a 3% base rate measured first is the whole proposal · refused · f7fa464b
- 2026-08-29 09:53 · Continue · release · @busy-office/create-ui 0.1.0 live and verified as a consumer (npm create @busy-office/ui scaffolds and pins the published core); direction (a) achieved after eight wakes. Two diagnoses in the slice were wrong and are recorded: the 404 was new-package propagation not an unpublish, and npm normalised the bin rather than dropping it · released · 043c741
- 2026-08-29 10:21 · Standardize · tidy · 187 — sweep: all three standing lanes clean (dead-style 0, css-repeats delta 0, prose 15/15 adjudicated); 187.1 hoisted stripTags into pattern-extract.mjs from two homes, generated JSON byte-identical and red-proved · landed · ee461b8
- 2026-08-29 10:21 · Meta · refusal · folding wrong-choice-rule.mjs's tag strip into the shared helper — it needs the original leading whitespace for its /^\s*(Not|Never)/ test, so it is the same idiom but not the same operation · refused · ee461b8
- 2026-08-29 02:44 · Continue · build · 185.1 — publish.yml ships create-ui with core; new check-publishable release gate, red-proved on six branches · landed · 990cd2c
- 2026-08-29 02:44 · Meta · refusal · lockstep versions and a separate create-ui-v* trigger — the latter leaves a core release able to strand the scaffolder · refused · 990cd2c
- 2026-08-29 10:57 · Continue · build · 173.2(b) — cell error message out of flow, revealed on focus: row 75->53px and siblings stop shifting; row gains data-row-state=error because the criterion's premise that the tint/edge were already there was false; last-row clip measured and resolved by reserving room while shown · landed · 1f115ec
- 2026-08-29 10:57 · Meta · refusal · a top-layer popover for the error message — it escapes the container clip but this demo already has five popovers on its combobox cells, and an error sharing an anchor with an open listbox is worse than a container that grows while focused · refused · 1f115ec
- 2026-08-29 11:24 · Roadmap · grill · 112.3 grilled at owner request — every self-imposed precondition is met (substrate 39/39, llms.txt 83 refs, wrong-choice debt 1), so the block is now briefs plus four decisions; part of the superstructure shipped without the verdict, and 'briefs are burn-once' is unestablished · logged · 06a0ec1
- 2026-08-29 11:27 · Continue · build · 186.2 closed — the owner/browser/agent-blocked distinction moved from RESUME.md (where it vanished within a day) into LOOPS.md rule 4; thesis confirmed by 173.2 landing in the first local wake after four wakes called it owner-blocked · landed · ef1df95

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
