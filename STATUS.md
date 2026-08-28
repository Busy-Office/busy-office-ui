# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-08-28 13:02 UTC

## Open items by slice

- **Slice 112** (2 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- **Slice 170** (1 open)
  - 170.3 — `dispatch_status.py`'s zero-slice guard hard-exits on a legitimate row, and this wake tripped it live.
- **Slice 171** (3 open)
  - 171.1 — decide whether the component rubric gets the screen score's ACCEPT TEST.
  - 171.2 — a recommendation surface for components, or a recorded refusal.
  - 171.3 — layout: decide whether it is scorable at all before scoring it.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1046 iterations logged)
  Standardize   3 / 4 Continue rounds since 2026-08-28 20:08   ok
  Objective     3 / 3 slices          since 2026-08-28 11:42   OVERDUE  [169, 170, 172]
  -> a counter is at or past its threshold; the dispatcher should pick it
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.
- 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- AT runtime evidence

## Last 10 iterations

- 2026-08-28 11:42 · Objective · grill · Objective grill 168/169/170: the gate 169.3 shipped one wake ago was tagged @exact while resting on a parser, and that parser FAILS OPEN — a moved heading pasted back into RESUME.md below one stray fence line goes GREEN, because the open fence makes every heading after it invisible and the checks pass by not looking; base rate 1 of 39 @exact gates does markdown-structure recognition, so the fix is the correct tag plus the --self-test it owes, not a new mechanism, and fixing it exposed the identical substring-vs-declaration bug in check-selftests one line above its own comment about it; and 170's 'the self-arm is a first' is superseded on the very next dispatch (8 of 27), though the 17-to-56% trajectory a first reading produced is confounded by arming-set size and is flat once controlled · logged · a2849e00
- 2026-08-28 11:42 · Meta · refusal · a mechanism over the @exact/@heuristic taxonomy — the predicate is true of 1 of 39 gates, which is 94.11's ceremony test · refused · a2849e00
- 2026-08-28 11:42 · Meta · refusal · acting on the self-arm finding — the accelerating trend that would have justified it does not survive controlling for arming-set size · refused · a2849e00
- 2026-08-28 11:43 · Continue · build · 172.1 — check-resume-charter retagged @heuristic and its fail-open fence hole closed: hasUnterminatedFence is now its own loud g.check and the --self-test the tag owes ships with six cases, red-proved both ways with the injections confirmed off disk; check-selftests now matches the tag at its declaration position, reconciled against the unchanged tree (43/12/31) which is what caught the fix's own first draft reporting eight gates untagged · landed · a2849e00
- 2026-08-28 20:08 · Standardize · tidy · nine gates printed a bare failure count while 26 and the shared gate() helper name the noun; converged them on the house form, each noun taken from that gate's own pass line. Red-proved on the failure branch, since passing gates cannot exercise it · landed · ad0b77a
- 2026-08-28 20:08 · Meta · refusal · a reportFailures() helper — it would need the noun passed in anyway, saving four lines and nothing else, while gate() already serves the assertion-shaped gates · refused · ad0b77a
- 2026-08-28 20:25 · Continue · build · 169.4: check:repo no longer reads a CI-ignored path — the RESUME charter check moved onto record_iteration's path; check:ci-ignores now covers globs and derives which scripts CI runs, and its red-proof failed twice before the workspace-context bug was found · landed · 87e0c7f
- 2026-08-28 12:56 · Continue · build · 170.2 — narrative-row gate refused on base rate: flags 1258 of 1289 lines examined · refused · 99bf809d
- 2026-08-28 12:56 · Meta · refusal · the LOOPS.md cadence bullet for re-reading narrative sections; and the section-shape gate, 45 of 45 sections would flag · refused · 99bf809d
- 2026-08-28 20:58 · Continue · bug · 172.1/172.2 from an owner screenshot of /patterns/command-bar: the copyable CSS shipped overflow:hidden which measures the results listbox at zero height, and the hint strip had zero padding on an 8px-rounded dialog. Both red-proofs failed first time — one tripped on its own explanation, one injected into the wrong of two copies · landed · a060a5a

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
