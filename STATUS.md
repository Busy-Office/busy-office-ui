# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-09-01 12:05 UTC

## Open items by slice

- **Slice 112** (2 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1272 iterations logged)
  Standardize   0 / 4 Continue rounds since 2026-09-01 12:05   ok
  Objective     4 / 3 slices          since 2026-09-01 06:45   OVERDUE  [232, 234, 236, 237]
  -> a counter is at or past its threshold; the dispatcher should pick it
  Optimize      0 wake-date(s) newer   since 2026-09-01 10:48   ok   [newest pair: axe-violations; 111 sample(s), 13 of 33 name(s) sampled twice]
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
- 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- AT runtime evidence

## Last 10 iterations

- 2026-09-01 06:45 · Meta · refusal · a gate over 'an open item's Accept names a section this sweep will move' — the discriminating predicate is semantic, and the checkable shape fires on 232.3 where the behaviour is correct, so it would be red on a healthy state (94.11's test) · refused · a5f5007a
- 2026-09-01 07:48 · Continue · build · 232.3 — check:parse-asserts, the parse-without-assert gate: red-proved against the real pre-fix tree ff2b623d^ (exactly 1 flag, zero false positives), self-test red-proved by removing comment-stripping (3 of 11 cases go WRONG), stripComments moved to source-files.mjs · landed · fd9affed
- 2026-09-01 10:47 · Continue · build · 234.1 — dispatched by rule 4 as the oldest still-open dispatchable item; both premises re-run on an unshallowed clone (1,780 commits) and both reproduce exactly. Accept (a): 229.3's RECURRENCE HISTORY was ALREADY amended by 258856b4, this item's own filing commit, while 229.3 was live, and 574a8634's sweep carried the correction across verbatim — so only 232.2's closing text was this wake's to write, and it is now corrected in place with the aggregate (one entry, zero recurrences, regrowth 0 of 8 and 0 of 24) stated in its own paragraph per (b). 229.3's refusal is not reopened. (c) the per-file command sits beside the claim. · landed · ede706af
- 2026-09-01 10:48 · Continue · build · 236.1 — the corroborating count now carries its exclusion. The five files read any=1, not 0, and that 1 is line 15's 'OWES a --self-test (roadmap 42.3)' — the sentence being adjudicated, so the assertion tripped on its own explanation. 234.1's paragraph now prints any and excl side by side and names which column carries the claim. Arm (d)'s 'imprecise but right' close was available and declined: third instance of the shape (232.1, this, 192.1's general form). 234.1's central claim and aggregate re-run and left standing. · landed · ede706af
- 2026-09-01 10:48 · Meta · refusal · arm (d) — closing 236.1 as 'the sentence is imprecise and the conclusion is right' without editing it; refused because the shape has now recurred three times and the edit cost one paragraph · refused · ede706af
- 2026-09-01 10:48 · Continue · build · 236.2 — arm (d) fired: the premise is FALSE as stated. Editing archived text was already established practice — d3d76a28 (199.1) appended a RE-VERIFIED block into an archived slice with no move, dc861a25 (235.3) deleted 12 lines, every other commit on ROADMAP-archive.md is a sweep. Standing answer recorded in LOOPS.md beside rule 4, not in a per-wake file (169.3). (b) 234.1's Accept (a) was reachable all along — the archived half was satisfied BEFORE the move. (c) base rate re-measured and moved: 1 of 2 -> 0 of 3 dispatchable items needing an archive edit. (a) roadmap_scope.py gains recognition 3, a dependency report, red-proved by injection as --self-test case E and reconciled against an independent parser: 4 of 46 whole-file citations charged, 3 of 6 open items naming a target. · landed · ede706af
- 2026-09-01 10:48 · Meta · refusal · a GATE over the dependency predicate — refused on 236.2's own measurement: the checkable shape fires on healthy states too, so it would be red on a correct tree (94.11) · refused · ede706af
- 2026-09-01 12:04 · Standardize · sweep · 237.1 — Standardize sweep 4 of 4 lanes; lanes 1-3 clean an eleventh time with no delta (0 dead of 1,433; 74/242/230/8 with the repeat set unchanged member for member; 14 flagged prose pages all inside 158.1's twelve + 161.1's three + 178.3's scale), lane 4 carried the finding a second consecutive wake. Ninth archive sweep: slices 236 (381 lines), 235 (368), 234 (161), 232 (500) moved verbatim, ROADMAP.md 2,907 -> 1,509 at move time (48.5% was closed history) and 1,659 committed. Verified by a second independently written parser reading the pre-move source out of git show HEAD:ROADMAP.md rather than the mover's memory — 4/4 present once in the archive, absent from the live file — red-proved by injection (that slice's archive count 1 -> 0, failed 1 of 4, exit 1). check:slice-refs 680 -> 684 -> 685 reconciled against a git worktree at HEAD: archive headings 212 -> 216, live 218 flat, uniqueness arm 430 -> 434, citation arm flat at 250 · landed · 7e861867
- 2026-09-01 12:05 · Standardize · tidy · 237.2 — ROADMAP-archive.md's header instructed the opposite of the rule LOOPS.md gained beside dispatcher rule 4 the day before: 'Nothing here is edited — corrections to history go in new slices, never here' against 236.2's 'amending the archive is allowed and expected' and 'verbatim is a property of the MOVE'. Premise re-run rather than quoted — of the ten commits touching the archive, eight are sweeps and two are edits with no move (d3d76a28/199.1 +27/-0 appending a RE-VERIFIED block inside an archived slice; dc861a25/235.3 -12). Measured cost: 177.1 named slices 17, 23, 24 as self-referential stubs on 2026-08-28 and left them 'on the archive's own authority' quoting this header; dc861a25 deleted exactly those three four days and four archive commits later. Header now carries the correction, the cost and a pointer, 5 lines to 22 · landed · 7e861867
- 2026-09-01 12:05 · Meta · refusal · restating rule 4's paragraph in the archive header — 236.2 put the standing answer beside the rule, and lane 4 of this same sweep is the instrument that measures this file growing · refused · 7e861867

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
