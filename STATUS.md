# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-08-29 05:46 UTC

## Open items by slice

- **Slice 112** (2 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- **Slice 189** (1 open)
  - 189.1 — CLAUDE.md's "verify against the rendered artefact" needs to name WHICH artefact when a third party renders it.
- **Slice 190** (3 open)
  - 190.1 — a grid cell's validation message is clipped for any message longer than about two lines, because a constant reserves room for a variable-height box.
  - 190.2 — `/patterns/editable-grid`'s three new runtime claims are executable.
  - 190.3 — `data-table.css`'s specificity comment states two wrong numbers, one of which belongs to a different rule.
- **Slice 191** (1 open)
  - 191.3 — decide whether rule 4's archaeology belongs in `LOOPS-archive.md`, on the evidence 191.2 measured.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1110 iterations logged)
  Standardize   0 / 4 Continue rounds since 2026-08-29 05:46   ok
  Objective     2 / 3 slices          since 2026-08-29 03:48   ok  [186, 191]
  Optimize      0 wake-date(s) newer   since 2026-08-29 01:46   ok   [newest pair: axe-violations; 101 sample(s), 13 of 30 name(s) sampled twice]
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
- 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- AT runtime evidence

## Last 10 iterations

- 2026-08-29 10:57 · Continue · build · 173.2(b) — cell error message out of flow, revealed on focus: row 75->53px and siblings stop shifting; row gains data-row-state=error because the criterion's premise that the tint/edge were already there was false; last-row clip measured and resolved by reserving room while shown · landed · 1f115ec
- 2026-08-29 10:57 · Meta · refusal · a top-layer popover for the error message — it escapes the container clip but this demo already has five popovers on its combobox cells, and an error sharing an anchor with an open listbox is worse than a container that grows while focused · refused · 1f115ec
- 2026-08-29 11:24 · Roadmap · grill · 112.3 grilled at owner request — every self-imposed precondition is met (substrate 39/39, llms.txt 83 refs, wrong-choice debt 1), so the block is now briefs plus four decisions; part of the superstructure shipped without the verdict, and 'briefs are burn-once' is unestablished · logged · 06a0ec1
- 2026-08-29 11:27 · Continue · build · 186.2 closed — the owner/browser/agent-blocked distinction moved from RESUME.md (where it vanished within a day) into LOOPS.md rule 4; thesis confirmed by 173.2 landing in the first local wake after four wakes called it owner-blocked · landed · ef1df95
- 2026-08-29 11:29 · Objective · grill · 189 — Objective grill of 173/185/186/187: the authority is what a transforming system SERVES not what you hand it (185 read the tarball twice while npm view was the answer); premise re-checks changed the work in 3 of 4 slices; four wakes called browser-blocked work owner-blocked · logged · 5eafae9
- 2026-08-29 11:29 · Meta · refusal · a gate for the durable-vs-ephemeral rule (corrections written into RESUME.md) — two instances is not a base rate and 'is this sentence a rule?' is the semantic judgement 94.11 refuses · refused · 5eafae9
- 2026-08-29 03:48 · Objective · grill · 190 — grill of 173/185/187: every assertion checked against its own mechanism reproduced (4 of 4, 3 of 3, 3 of 3), every one reasoned beside it did not — 173.2's specificity comment measures (0,4,0) vs (0,3,1) against a stated (0,3,0) vs (0,2,0), the latter being a different rule's, and its 3.5rem reserve is a constant for a text-dependent box (101-char message clipped 53px, scrollable so not a P0, 1 of 138 pages affected). 185 and 187 are clean controls, re-verified from this container. Filed 190.1/190.2/190.3; corrected ENVIRONMENT.md trap 1 (rev-parse --short takes one revision, so the documented missing-main test fails on every container) and the no-screenshots-is-not-no-browser clause in both ENVIRONMENT.md and Slice 189's new LOOPS.md bullet. Collided with the local dispatcher on the same rule-3 dispatch; caught by Step 0c's pre-commit fetch, renumbered 189 -> 190, both grills kept · logged · 1a808d2e
- 2026-08-29 03:48 · Meta · refusal · a gate for 'every constant in shipped CSS names what it is sized against' — 94.11's exact shape: the checkable predicate is true of 155 of 155 and the useful one is semantic · refused · 1a808d2e
- 2026-08-29 04:40 · Continue · build · 186.1 — check:resume-slice-ids reconciles RESUME.md's backticked slice ids against ROADMAP.md's checkboxes · landed · cfb53521
- 2026-08-29 05:46 · Standardize · sweep · 191 — three lanes clean (dead-style 0, css-repeats delta 0 by group membership, prose 14/14 verdicted); the fourth read a value its own command cannot print — LOOPS.md "still 0 down after 167.2" is invisible in a window that contains 167.2's split, so report_loop_prose.py now prints a full-history ratchet block, red-proved three ways · landed · 3ea80243

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
