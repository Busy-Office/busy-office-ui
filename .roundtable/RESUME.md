# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and two advisory checks run from `record_iteration.py` — the charter
> check and `check:resume-slice-ids`. Both REPORT on stderr; neither fails a
> build (roadmap 175.3). Run both against the file as it now stands rather
> than trusting a stale reading.

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

**Citation practice for this file, restated after 251 found a live one drift**
(`ROADMAP.md:351` no longer resolved by the time a later wake read it — the
file grows above any raw line number cited into it): **cite by slice number
only, never by raw `ROADMAP.md:NN`.** A slice number survives every rewrite;
a line number survives none.

---

## In flight: nothing

Last updated 2026-09-03 (**cloud** wake, scheduled routine). Working tree clean
at hand-off. Two commits this wake, both pushed: `25e24745` (Slice 252) and this
hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## Dispatch counters at hand-off

```
Standardize   0 / 4 Continue rounds   since 2026-09-03 05:50   ok
Objective     2 / 3 slices            since 2026-09-03 08:11   ok   [247, 252]
Optimize      0 wake-date(s) newer    since 2026-09-03 05:50   ok   [newest pair: axe-violations]
```

- **Rule 2 just fired (Slice 252) and reset** — 4/4 OVERDUE at wake start,
  0/4 now. Do not re-dispatch Standardize for 4 more Continue rounds.
- **Rule 3 is at 2/3.** One more closed slice arms an Objective grill. The two
  armed are `247` and `252`.
- **Rule 5 is CLEAR again, and that is new.** It read STALE at wake start and
  this wake recorded a fresh `axe-violations` sample (0), which gives it a live
  comparable pair. It was reported as **NOT EVALUABLE** for this wake's dispatch
  rather than clear, per LOOPS.md's own instruction — the fix landed after the
  decision, not before it.
- **Rule 4's open set is `OPEN: [15, 112, 249]`**, unchanged. Slice 15's AT
  evidence and 112.3/112.4 are **owner-hardware-blocked** (LOOPS.md 186.2's
  vocabulary — name which kind when reporting rule 4 as stuck). The next
  dispatchable item is **the oldest open sub-item inside Slice 249**;
  `249.1`-`249.9` are dispatchable now, `249.10`-`249.13` are owner calls sent
  back explicitly rather than built — read Slice 249's own text for why before
  building any of them.

## The archive sweep is DONE — do not re-raise it

The signal the previous hand-off flagged as "a real signal, not yet acted on"
was acted on this wake. `roadmap_scope.py` now reads closed-history share
**374 / 2,117 = 17.7%**, down from 55.1%, and the two remaining targets are:

- **Slice 252** — this wake's own slice, closed-on-arrival. Same shape the last
  hand-off recorded: a wake's own work is eligible the moment it lands, which is
  why the share climbs without anything going stale. Nothing to do now.
- **Slice 237** — still **refused**, and it is the same refusal as last time,
  not a fresh judgement: `roadmap_scope.py`'s dependency line names it as the
  target of open item `249.12`'s Accept (236.2's rule). **Leave it until
  `249.12` resolves.**

## What landed this wake

**Slice 252 — Standardize sweep**, dispatched by rule 2. Rule 1 was clear (no
open P0; GitHub intake `totalCount: 0`), so Step 1 triaged and committed
nothing.

1. **252.1 — all four standing lanes clean, a twelfth time.** Lane 1 `0 dead of
   1,433 live`; lane 2 `74 / 242 / 230 / 8` unchanged member for member (the x4
   joined-control group is still two components, so its reopen trigger is
   unmet); lane 3 `118 pages, median 748`, 14 flagged pages all inside the
   verdicted set; lane 4 no accumulate-class change. Lane 4 carried the finding.
2. **252.2 — the tenth archive sweep.** 13 slices moved verbatim (251, 250, 248,
   247, 246, 245, 244, 243, 242, 241, 240, 239, 238). `ROADMAP.md` 3,790 → 1,917
   at the move, 3,790 → 2,117 at the commit. Verified by a second, independently
   written parser reading the pre-move source, with **both** arms red-proved by
   injection and each injection confirmed to have landed first.
3. **252.3 — lane 5**, the divergence scan no instrument covers. `compatOf` was
   hand-copied into `derive-floor.mjs` and `check-rf-floor.mjs`; consolidated
   into `packages/core/scripts/bcd-compat.mjs`. Behaviour-neutral on a clean
   `dist/` — `dist/floor.json` byte-identical, 4,843 bytes.

**Not verified, and named rather than implied:** this was a cloud wake, so the
1440/390 light-and-dark screenshot lane could not run. Nothing in the diff rests
on a rendered image (two markdown files the docs site does not render, plus
three build-time Node scripts). All **17** CI entry points, re-derived from
`ci.yml` rather than read off `ENVIRONMENT.md`'s snapshot, ran green here.
`check:claims` read **162 live / 3 NOT VERIFIED**, which is ENVIRONMENT 6b's
container property and not a regression.

*One trap re-hit, worth carrying:* lane 1 (`scan:dead-style`) needs
`CHROME_PATH` exported in the same command (ENVIRONMENT 1c). Its first run died
with "No Chrome/Chromium found" — a loud failure, which is what that rule wants.

## Next wake

Rule 4 dispatches Continue, build mode, on the oldest open sub-item in Slice 249
— read that slice's own text for each item's Accept criteria before building.
Rule 3 is one closed slice away from firing, so expect an Objective grill soon
after.
