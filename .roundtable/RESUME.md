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
at hand-off. Two commits this wake, both pushed: Slice 256 and this hand-off.

**`check:resume-slice-ids` will name `249.1` as closed — that is deliberate.**
It appears below only as *what Slice 253's grill already covered*, i.e. why this
wake dropped it from scope. Nothing here claims it is open, blocked or queued.

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

- **Rule 2 (Standardize)** read `0 / 4` at wake start and is unchanged: an
  Objective round is not a Continue round, so nothing accumulated.
- **Rule 3 (Objective)** read `3 / 3 OVERDUE [249, 254, 255]` and **fired**. It
  resets to `0 / 3` once this wake's Objective row is recorded, so **rule 4 is
  the likely dispatch next wake.**
- **Rule 5 (Optimize)** read `ok` (not STALE) — `0 wake-date(s) newer`, newest
  pair `bundle-gz-kb`, 128 samples. **No sample was recorded this wake,
  deliberately:** Slice 256 changes 0 files under `packages/core/`, so a
  `bundle-gz-kb` reading could only reproduce the existing value.

## Next wake

Rule 3 has just discharged, so expect **rule 4**. Its open set is
`OPEN: [15, 112, 249, 256]` and the oldest open sub-item is **`249.5`** — install
commands for pnpm/yarn/bun in `getting-started/installation.astro`, or a
one-line recorded refusal. Fully cloud-dispatchable and the cheapest next thing.

- Slice 15's `AT runtime evidence` and `112.3`/`112.4` are **owner-blocked**
  (LOOPS.md 186.2's vocabulary).
- `249.5`–`249.8`, `249.11`, `249.14` are dispatchable; `249.10`, `249.13` are
  owner calls; `249.9` depends on 249.8 (tagline) + 249.3 (shipped).
- **`249.15` is browser-blocked in the screenshot sense** (a static OG image) —
  a cloud wake should NOT pick it up; a LOCAL wake can. `249.12` names Slice 237,
  which is why the archive sweep leaves 237 in place (236.2).

## The archive sweep: not due, do not re-raise

`roadmap_scope.py` reads closed-history share **714 / 3,021 = 23.6%** at
hand-off — well under the **55.1%** at which 252.1 dispatched the tenth sweep on
2026-09-03. It read 22.1% at Slice 255's hand-off and 24.7% before this wake's
own slice landed; the whole movement is Slice 255's body arriving in the closed
set and Slice 256's arriving in the live denominator, not drift. The tenth sweep
moved 13 slices three days ago, so this is normal regrowth, not a trigger.
Eligible targets `[255, 254, 253, 252, 237]`, of which 253 and 237 are named by
the open Slice 249 (249.6, 249.12) and stay per 236.2. Re-run the script; these
are snapshots.

## What landed this wake

**Slice 256 — Objective grill of Slices 249 (.2/.3/.4), 254 and 255**, dispatched
by rule 3. Rule 1 clear (no open P0, GitHub intake `totalCount: 0`); Step 1
triaged and committed nothing — no new input.

Scope was narrowed first (§6 step 0): 249 re-arms after every round and Slice 253
already grilled `249.1` and `249.6`, so both were dropped and the scope is what
landed since that grill.

**60 published assertions re-derived; 57 reproduce exactly**, two do not
reproduce as stated and one only within a documented gzip tolerance. Both
failures are the same error — a real count of a set the sentence does not name.
(One assertion = one figure or statement a command was re-run against; the
per-slice totals are 23 + 12 + 7 + 9 + 9.) Full report with every command:
`.roundtable/grill-objective-249-254-255-2026-09-03.md`.

1. **Finding A, corrected in ROADMAP 249.3:** "20 components floor at Chrome 99"
   is false — **25** do. The 20 is the largest full-label group. The error
   flattered the item (63% at the oldest floor, not 50%).
2. **Finding B, corrected in Slice 255 and by an appended CORRECTION block in
   `ROADMAP-archive.md`:** the enumeration lane 3 resolves against labels a
   **fifteen**-name list as "158.1's twelve", absorbing 161.1's three and
   dropping `/patterns/output-form/`. Lane 3's conclusion is unaffected — the
   union is 16 pages and covers all 15 flagged.
3. **Finding C, filed as `ENVIRONMENT.md` §6c:** Slice 254's `928 × 384`
   container reads **913** × 384 here. Not a change — a 15px classic scrollbar
   reserved inside `main.bo-app-shell__main` (`overflow-y: auto`), where macOS
   overlay scrollbars reserve 0. **Every cloud-wake docs width reading is 15px
   under the owner's**, and the usual page-scrollbar check reads 0 because the
   shell scrolls `main`, not the document.

4. **Finding D, left OPEN as `256.2`:** `check:floor` fired on this grill report
   — correctly; the report was rewritten to print the deriving command instead
   of three floor labels, and **the gate was not widened**. The finding is that
   the gate's own header comment exempts *"the .roundtable grills"* while its
   `ALLOW` list does not contain `.roundtable/**`. Left as a decision because
   `.roundtable/` also holds living ledgers read as current. 256.2 carries both
   readings and an accept test that treats *"the comment is wrong"* as a
   satisfying outcome.

A second `ENVIRONMENT.md` line landed beside it: **`--unshallow` does not fetch
tags**, and `git tag` then answers EMPTY rather than erroring — the silent kind
of wrong, hit while re-deriving 249.3's tag claim. `git fetch --tags origin`
first.

**`256.2` is the one item this wake leaves open**, and it is cloud-dispatchable
— it is a five-line allow-list decision plus a two-sided red-proof, no browser.

**Not verified, and named rather than implied:** this was a cloud wake, so the
1440/390 light-and-dark screenshot lane could not run. Slice 256's diff is
markdown only (the slice, two corrections, the grill report, `ENVIRONMENT.md`) —
no CSS, no docs page, no component — so there is nothing a screenshot could show.
Every claim in the grill is a count, a byte size, a computed style or a layout
geometry, which is the second of `ENVIRONMENT.md`'s two lists. `build`, `test`
and `docs:build` (with `check:repo`, `check:slice-refs`, page-shape and the
readme-claims gate) ran green in this container, plus `check:claims`,
`check:layout` and `test:axe`.
