# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-08-28 11:43 UTC

## Open items by slice

- **Slice 112** (2 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- **Slice 169** (1 open)
  - 169.4 — `check:repo` now reads a path CI ignores, and the gate that exists to catch that cannot see it.
- **Slice 170** (2 open)
  - 170.2 — the generalized form of 170.1: nothing re-reads the narrative sections of `ROADMAP.md`, and refusing this is a satisfying outcome.
  - 170.3 — `dispatch_status.py`'s zero-slice guard hard-exits on a legitimate row, and this wake tripped it live.
- **Slice 171** (3 open)
  - 171.1 — decide whether the component rubric gets the screen score's ACCEPT TEST.
  - 171.2 — a recommendation surface for components, or a recorded refusal.
  - 171.3 — layout: decide whether it is scorable at all before scoring it.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1040 iterations logged)
  Standardize   4 / 4 Continue rounds since 2026-08-28 07:45   OVERDUE
  Objective     1 / 3 slice           since 2026-08-28 11:42   ok  [172]
  -> a counter is at or past its threshold; the dispatcher should pick it
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.
- 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- AT runtime evidence

## Last 10 iterations

- 2026-08-28 09:40 · Continue · build · 168.1 — RESUME.md gains a standing ## Direction block: four answers a wake fills from named sources, two backed by recorded commands. Implemented not refused, because the item's refusal argument ('the owner sees it in conversation') assumes a conversation and this is the scheduled cloud routine. Premise re-checked and half wrong: fb15cdc IS 164.3 advancing it, so the figure is 12 of 13 work rows did not advance it, a rate not a state; registry asked directly and create-ui is still E404 · landed · f2506dfb
- 2026-08-28 09:40 · Meta · refusal · generating the block into STATUS.md — 'is the direction blocked' is not derivable from the log without classifying rows by subject, the sixth regex LOOPS.md rule 3 refuses by name and the one 170.3 is open about · refused · f2506dfb
- 2026-08-28 09:40 · Meta · refusal · a threshold on the 12-of-13 rate — that is the ratio 168.1's own Accept refuses, and it cannot tell maintenance that unblocks product from maintenance that displaces it · refused · f2506dfb
- 2026-08-28 18:41 · Roadmap · plan · 171.1-171.3 triaged from the owner's scoring wishlist: performance and the recommendation surface already exist for screens, usability died by its own accept test at 5/5 on all 28, layout is unscored — and 4 of 6 DSA dimensions have exactly one value across 39 components, so the instrument driving Polish cannot rank · triaged · 1f7a2ee
- 2026-08-28 18:41 · Meta · refusal · a new usability score — it died once on measurement and re-proposing it without answering the 5/5 result re-raises a settled refusal · refused · 1f7a2ee
- 2026-08-28 10:42 · Continue · build · 169.3 — the durable traps and toolchain move out of RESUME.md into .roundtable/ENVIRONMENT.md; LOOPS.md Step 0 names both files and check:resume-charter holds both ends. Implemented not refused: the premise re-check found the item's own risk half false (9 trap probes over 53 revisions, ZERO dropped-then-restored, so the manual re-copy never lost anything) and the real cost is visibility, not survival — durable content was 214 of 372 lines and grew 3.2x faster than the per-wake half, inside a file rewritten at mean 111 lines per commit. Gate red-proved on the REAL pre-move tree, 6 of 6 rules, before either injection · landed · f95793e1
- 2026-08-28 11:42 · Objective · grill · Objective grill 168/169/170: the gate 169.3 shipped one wake ago was tagged @exact while resting on a parser, and that parser FAILS OPEN — a moved heading pasted back into RESUME.md below one stray fence line goes GREEN, because the open fence makes every heading after it invisible and the checks pass by not looking; base rate 1 of 39 @exact gates does markdown-structure recognition, so the fix is the correct tag plus the --self-test it owes, not a new mechanism, and fixing it exposed the identical substring-vs-declaration bug in check-selftests one line above its own comment about it; and 170's 'the self-arm is a first' is superseded on the very next dispatch (8 of 27), though the 17-to-56% trajectory a first reading produced is confounded by arming-set size and is flat once controlled · logged · a2849e00
- 2026-08-28 11:42 · Meta · refusal · a mechanism over the @exact/@heuristic taxonomy — the predicate is true of 1 of 39 gates, which is 94.11's ceremony test · refused · a2849e00
- 2026-08-28 11:42 · Meta · refusal · acting on the self-arm finding — the accelerating trend that would have justified it does not survive controlling for arming-set size · refused · a2849e00
- 2026-08-28 11:43 · Continue · build · 172.1 — check-resume-charter retagged @heuristic and its fail-open fence hole closed: hasUnterminatedFence is now its own loud g.check and the --self-test the tag owes ships with six cases, red-proved both ways with the injections confirmed off disk; check-selftests now matches the tag at its declaration position, reconciled against the unchanged tree (43/12/31) which is what caught the fix's own first draft reporting eight gates untagged · landed · a2849e00

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
