# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-08-29 02:44 UTC

## Open items by slice

- **Slice 112** (2 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- **Slice 173** (1 open)
  - 173.2 — editable-grid "Medium": the numeric columns need alignment.
- **Slice 186** (2 open)
  - 186.1 — `RESUME.md`'s slice-id claims are reconciled against `ROADMAP.md`'s checkboxes, and the disagreement is reported.
  - 186.2 — `173.2` is browser-blocked, not owner-blocked, and rule 4's halt reasoning should say which.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1100 iterations logged)
  Standardize   1 / 4 Continue round  since 2026-08-29 10:21   ok
  Objective     2 / 3 slices          since 2026-08-29 01:46   ok  [185, 187]
  Optimize      0 wake-date(s) newer   since 2026-08-29 01:46   ok   [newest pair: axe-violations; 101 sample(s), 13 of 30 name(s) sampled twice]
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.
- 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- AT runtime evidence

## Last 10 iterations

- 2026-08-29 00:43 · Meta · refusal · recording check:claims' 141 under the existing 'claims' metric name, whose earlier samples 65-82 measured something else — a poisoned trend is worse than a missing one · refused · 07afdcd3
- 2026-08-29 09:16 · Roadmap · triage · 173.2 owner picked (b) floats-on-focus and 175.4 owner accepted collisions; 185 filed — create-ui's E404 is publish.yml never wiring it, not an unrun command · logged · 6c4cfae
- 2026-08-29 09:38 · Roadmap · triage · 176.3 closed as no-change — owner challenge upheld by measurement: 12 Polish rounds in 1092 iterations and the 'redundant' second rounds are 2-of-3 for real defects; assistant's narrowing proposal retracted · refused · 0c1fe3d
- 2026-08-29 01:46 · Objective · grill · 186 — grill of 180/183/184: the hand-off's own question refuted, 1 of 275 Accept criteria binds future behaviour (28.1's) while 117 of 275 name a gate and re-check themselves, so 184.1 supplied a mechanism for the one thing a criterion cannot express, not a patch on widespread rot; needle wrong twice first (block over-capture read 19, 'each run' matched inside 'each rung'). Cross-cut: a self-description checked against the wrong thing or nothing (180 @exact vs tag TEXT, 184 rule 5 vs nothing, 183 'needs a browser' vs nothing) — 183 is the control at 5 of 5 clean, so unverified, not wrong. Found two false premises live: create-ui IS published (0.1.0, 01:30:23Z, 13.5 min after 185 predicted the manual publish) and publish.yml still skips it; and 173.2 is browser-blocked not owner-blocked. Filed 186.1/186.2 · logged · f7fa464b
- 2026-08-29 01:46 · Meta · refusal · a general 'gate every self-description' programme — 176.2's predicate was true of 19 of 19 and 94.11's of 155 of 155; one reconciliation with a 3% base rate measured first is the whole proposal · refused · f7fa464b
- 2026-08-29 09:53 · Continue · release · @busy-office/create-ui 0.1.0 live and verified as a consumer (npm create @busy-office/ui scaffolds and pins the published core); direction (a) achieved after eight wakes. Two diagnoses in the slice were wrong and are recorded: the 404 was new-package propagation not an unpublish, and npm normalised the bin rather than dropping it · released · 043c741
- 2026-08-29 10:21 · Standardize · tidy · 187 — sweep: all three standing lanes clean (dead-style 0, css-repeats delta 0, prose 15/15 adjudicated); 187.1 hoisted stripTags into pattern-extract.mjs from two homes, generated JSON byte-identical and red-proved · landed · ee461b8
- 2026-08-29 10:21 · Meta · refusal · folding wrong-choice-rule.mjs's tag strip into the shared helper — it needs the original leading whitespace for its /^\s*(Not|Never)/ test, so it is the same idiom but not the same operation · refused · ee461b8
- 2026-08-29 02:44 · Continue · build · 185.1 — publish.yml ships create-ui with core; new check-publishable release gate, red-proved on six branches · landed · 990cd2c
- 2026-08-29 02:44 · Meta · refusal · lockstep versions and a separate create-ui-v* trigger — the latter leaves a core release able to strand the scaffolder · refused · 990cd2c

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
