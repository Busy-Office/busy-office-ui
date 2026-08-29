# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-08-29 07:23 UTC

## Open items by slice

- **Slice 112** (2 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- **Slice 192** (1 open)
  - 192.1 — record the PLACEMENT rule finding A names.
- **Slice 193** (2 open)
  - 193.1 — execute 167.1's reopen condition on `CLAUDE.md`. It fired 6h49m after it was written and has never been read.
  - 193.2 — 42 reopen conditions live in item BODIES, where nothing re-reads them, and 186's "1 of 275" could not have seen any of them.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1120 iterations logged)
  Standardize   0 / 4 Continue rounds since 2026-08-29 15:23   ok
  Objective     2 / 3 slices          since 2026-08-29 06:48   ok  [190, 191]
  Optimize      0 wake-date(s) newer   since 2026-08-29 01:46   ok   [newest pair: axe-violations; 101 sample(s), 13 of 30 name(s) sampled twice]
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
- 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- AT runtime evidence

## Last 10 iterations

- 2026-08-29 14:04 · Continue · build · 189.1 — CLAUDE.md now names WHICH artefact when a third party renders it; escape hatch tested first and did not apply (every existing example is our own build), worked example is npm normalising bin and the read-vs-write path confusion · landed · d50c306
- 2026-08-29 14:06 · Continue · build · 190.3 — corrected data-table.css's specificity comment; numbers re-derived by hand and agree with the grill: (0,4,0) and (0,3,1), while (0,2,0) belongs to the no-:has() fallback. Conclusion was right, arithmetic was not · landed · aa723d6
- 2026-08-29 14:35 · Continue · build · 190.2 — editable-grid's three runtime claims now executable (check:claims 141->144), including the counterfactual; two instrument defects caught by assertions: a live getComputedStyle read after style removal, and a red-proof injecting into the wrong built CSS file · landed · 7152cfa
- 2026-08-29 14:41 · Objective · grill · 192 — Objective grill of 186/189/190/191: every defect in 173.2 was in an ASSERTED claim and the one MEASURED claim was correct (3 of 3); two more instrument defects caught by injection assertions; retired product-vs-machinery ratio checked and deliberately not re-raised · logged · 6a426d6
- 2026-08-29 14:41 · Meta · refusal · a gate for either finding — A's discipline is a writing rule with no mechanical form, B is the existing red-proof rule succeeding three times · refused · 6a426d6
- 2026-08-29 06:48 · Objective · grill · 193 Objective grill of 186/189/190/191 — 167.1's reopen condition fired and was never read; rule 3 at 3-of-4 grill-armed · logged · 774558e5
- 2026-08-29 06:48 · Meta · refusal · a reopen-condition register gate or report — the trigger is semantic for most of the 42, and a register nobody can adjudicate is 94.11's ceremony · refused · 774558e5
- 2026-08-29 15:00 · Continue · build · 190.1 — the 18ch cap and 3.5rem reserve were both fits to one demo string; cap now min(48ch,100cqi) and reserve calc(6lh + space-4), so a 250-char message shows 6-7 lines fully visible at all three densities and both widths with the row height unchanged · landed · d61c6dc
- 2026-08-29 15:08 · Standardize · tidy · Standardize sweep — three lanes clean; extracted patternGroups() so both generators share one walk, byte-identical output, duplicate blocks WIN=6 2->0; the signal was 187's own fix lengthening the duplicated run · landed · b02c3ce
- 2026-08-29 15:23 · Standardize · tidy · 191.3 — rule 4 archaeology: the 'oldest' definition stays (it is the rule's predicate), the cycle table + regrowth reading + ratio correction move to LOOPS-archive.md; 1012 -> 752 words, ratchet names the third such cut · landed · 9198e43

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
