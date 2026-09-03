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

**Citation practice for this file: cite by slice number only, never by raw
`ROADMAP.md:NN`.** A slice number survives every rewrite; a line number
survives none.

---

## In flight: nothing

Last updated 2026-09-03 (**cloud** wake, scheduled routine). Working tree clean
at hand-off. Two commits this wake, both pushed: Slice 255 and this hand-off.

**`check:resume-slice-ids` will name `255.1` as closed — that is deliberate.**
It is referenced below as history, not as an open or blocked item. Nothing in
this file claims it is queued.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## Direction

Nothing new from the owner this wake, and nothing owner-facing is newly
blocked. The two standing owner blocks are unchanged: Slice 15's `AT runtime
evidence` (owner hardware) and `112.3`/`112.4` (owner briefs, then 112.3's
verdict).

## Dispatch counters at hand-off

Read `dispatch_status.py` yourself — the sets below are snapshots.

- **Rule 2 (Standardize)** read `5 / 4 OVERDUE` at wake start and **fired**; it
  resets to `0 / 4` after this wake's Standardize round is recorded. It will not
  fire again until four more Continue rounds accumulate.
- **Rule 3 (Objective)** read `2 / 3` `[249, 254]` and is unchanged — a
  Standardize sweep does not close a slice for rule 3's purposes only in the
  sense that 255 is a Standardize slice, which DOES count (161.4). So expect
  `dispatch_status.py` to read `3 / 3 [249, 254, 255]` next wake — **rule 3 is
  armed and sits above rule 4.** Read the counters before assuming a build item.
- **Rule 5 (Optimize)** read `ok` (not STALE) — `0 wake-date(s) newer`, newest
  pair `bundle-gz-kb`, 128 samples. **No sample was recorded this wake,
  deliberately:** Slice 255 changes 0 files under `packages/core/src/css/`, so a
  `bundle-gz-kb` reading could only reproduce the existing value.

## Next wake

**Rule 3 is armed** (2/3 → 3/3 once 255 is counted) and sits above rule 4 — an
Objective grill of Slices 249/254/255 is the likely dispatch, not a build item.
Confirm with `dispatch_status.py` before assuming.

If rule 3 is somehow not yet at 3, **rule 4's open set is `OPEN: [15, 112,
249]`** and the oldest open sub-item is **`249.5`** — install commands for
pnpm/yarn/bun in `getting-started/installation.astro`, or a one-line recorded
refusal. Fully cloud-dispatchable and the cheapest next thing.

- Slice 15's `AT runtime evidence` and `112.3`/`112.4` are **owner-blocked**
  (LOOPS.md 186.2's vocabulary).
- `249.5`–`249.8`, `249.11`, `249.14` are dispatchable; `249.10`, `249.13` are
  owner calls; `249.9` depends on 249.8 (tagline) + 249.3 (shipped).
- **`249.15` is browser-blocked in the screenshot sense** (a static OG image) —
  a cloud wake should NOT pick it up; a LOCAL wake can. `249.12` names Slice 237,
  which is why the archive sweep leaves 237 in place (236.2).

## The archive sweep: not due, do not re-raise

`roadmap_scope.py` reads closed-history share **610 / 2,756 = 22.1%** at
hand-off — well under the **55.1%** at which 252.1 dispatched the tenth sweep on
2026-09-03. The tenth sweep moved 13 slices only three days ago; this is normal
regrowth, not a trigger. Eligible targets `[254, 253, 252, 237]`, of which 253
and 237 are named by the open Slice 249 (249.6, 249.12) and stay per 236.2. The
other two (254, 252) are small and unnamed. Re-run the script; these are
snapshots.

## What landed this wake

**Slice 255 — Standardize sweep, all five lanes clean**, dispatched by rule 2
(`Standardize 5 / 4 OVERDUE`). Rule 1 clear (no open P0, GitHub intake
`totalCount: 0`); Step 1 triaged and committed nothing — no new input.

The five lanes and their measured readings are in ROADMAP 255.1; the short
version, so a later wake need not re-run them to know the state:

1. **Lane 1 `scan:dead-style`** — 0 dead / 0 pages / 1,433 live inline
   declarations. Identical to 252.1/244.1/237.1.
2. **Lane 2 `report:css-repeats`** — 74 files · 242 rules · 230 bodies · 8
   repeated, compared member-for-member against the standing table. Zero delta.
   The x4 joined-control group is still two components (money, quantity), so its
   reopen trigger (a third) is unmet.
3. **Lane 3 `report:prose`** — 118 pages, median 781, total 110,518 words. Union
   of corpus-2x and family-2x outliers is 15 pages; `comm -23 flagged verdicted`
   is **empty** (all in 158.1+161.1+178.3's set). Checked by set difference, not
   by the grep-each-path instrument that 228.1 refused.
4. **Lane 4 `report_loop_prose.py`** — no file changed accumulate class.
   `CLAUDE.md` 31 up / never cut and `DESIGN.md` 22 up / never cut are 167.1's
   standing verdicts (CLAUDE.md's watch retired by 193.1). Regrowth signal is
   22.1% (see the sweep note above) — not actionable.
5. **Lane 5 (252.3's divergence scan)** — no hand-copied logic. The only
   two-count pairs are `function exists` (252.3-adjudicated: different args,
   different workspaces) and `function build` (arity 0 in `derive-introduced.mjs`
   vs arity 3 in `build-component-css.mjs` — unrelated entrypoints). `compatOf`
   is gone, consolidated into `bcd-compat.mjs` last wake.

**Recorded as a no-op sweep rather than manufacturing a fix** — CLAUDE.md's
standing rule against busywork, the same call 176.1 made on ten re-queued Polish
surfaces.

**Not verified, and named rather than implied:** this was a cloud wake, so the
1440/390 light-and-dark screenshot lane could not run. Slice 255 changes only
two markdown files (the slice and this hand-off) — no CSS, no docs page, no
component — so there is nothing a screenshot could show. `build`, `test` and
`docs:build` (with `check:repo`) ran green in this container to produce the
`dist/` the lanes read; `check:slice-refs` passes at 237 sections.
