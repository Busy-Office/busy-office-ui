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

Last updated 2026-09-04 (**cloud** wake, scheduled routine). Working tree clean
at hand-off. Two commits this wake, both pushed: Slice 259 and this hand-off.

**`check:resume-slice-ids` names closed ids, and they are deliberate.** `259.1`
appears below only as *what this wake closed*. The `249.x` ids below are the
live open set and are the point of the section. Nothing here queues or blocks
on a closed id.

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

Nothing this wake needs an owner decision. What landed is measurement banked
into an already-open item; every judgement it forces is a design call the wake
that builds the page makes, not one only the owner can make.

## ⚠ The correction most likely to be re-broken

**`bundle-gz-kb` cannot be sampled, and "the CSS did not change" is not why**
(259.1's rule-5 finding). Three consecutive hand-offs declined a sample on the
grounds that the reading *"could only reproduce the existing value"*. That is
true and it is not the constraint. Measured this wake:

```
grep -rln 'bundle-gz-kb' --include='*.mjs' --include='*.py' --include='*.ts' \
  --include='*.js' --include='*.json' . | grep -v node_modules
```

returns exactly **one** file — `scripts/loops/record_metric.py` — and the hit is
its **docstring example**, `--value 7.0`. Nothing derives the number and no
document records how it is computed. The last recorded value is `15.1 kB`; the
core build prints `14.05 / 15.5 kB gz` for `css/*.css` and `375.8 kB gz total`,
none of which is 15.1. **So a wake that DID change the CSS still could not reproduce
this metric.** Do not "fix" rule 5's staleness by recording a guessed value —
that is the convention-guessing CLAUDE.md forbids. The fix is to write the
derivation command next to the name, which is a loop-script change and wants its
own dispatch.

## Dispatch counters at hand-off

Read `dispatch_status.py` yourself — the sets below are snapshots.

- **Rule 2 (Standardize)** reads `1 / 4` — this wake ran one Continue round.
- **Rule 3 (Objective)** reads `1 / 3`, and **the slice it names is `[249]`,
  not 259.** Read after recording, per `LOOPS.md`'s instruction that this
  counter is only ever caught by a number disagreeing with something a human
  just wrote down — this hand-off's draft said "259" and the instrument says
  "249". Both are defensible and the COUNT is unaffected: `SLICE_TOP` takes the
  leading id from the row's item text, which begins `249.9` because that is the
  item the round built, while the slice the round *closed* is 259. **Recorded,
  not fixed** — `LOOPS.md` rule 3 already refuses a sixth regex over this
  parser, and nothing downstream reads the attribution.
- **Rule 5 (Optimize) reads STALE, `1 wake-date(s) newer`** — unchanged from
  wake start, because this wake's rows land on 2026-09-04, a date already
  counted. `LOOPS.md` rule 5 is explicit that STALE means the rule has no input
  and must be reported as *could not be evaluated*; it was reported that way and
  should be again. See the correction block above for why no sample was taken —
  the reason is now stronger than the one the last three hand-offs carried.

## Next wake

**Rule 4 (Continue, build mode) is again the first rule that can fire** — rules
1-3 are clear at hand-off and rule 5 is not a dispatch rule. Re-run
`dispatch_status.py`; this is a snapshot.

Rule 4's open set is `OPEN: [15, 112, 249]`, **11** open items, unchanged in
count: 259 closed fully and 249.9 stayed open by design. Classifications
re-read against `ROADMAP.md` this wake:

- Slice 15's `AT runtime evidence` and `112.3`/`112.4` are **owner-blocked**.
- **`249.6`, `249.15` are browser-blocked in the SCREENSHOT sense** — a LOCAL
  wake can take them; a cloud wake should not.
- **`249.7` is open as a COST question, not unstarted work.** Its Accept's first
  clause is executed — 4 of 5 seed rows do not reproduce, table is in the item.
  Do not re-run that grep. Settling it before the owner answers `249.10` decides
  it on the thinnest input.
- **`249.9` is no longer the best cloud-takeable item — this wake took it.**
  Both Accept clauses are now measured and banked *inside the item*: the
  mechanism premise is refuted, both cost routes are stated, and the badge audit
  is a table. What remains is the `/components/` catalogue **page**, which is
  browser-blocked in the screenshot sense. **A local wake should pick this up
  next**; it now has every number it needs and should not re-derive them.
- `249.10`, `249.11`, `249.13` are owner calls; `249.12` is owner-or-
  architecture, low urgency.

**So a cloud wake reaching rule 4 next has no clearly cloud-takeable item left
in the 249 set.** Say that in the shape `LOOPS.md` 186.2 requires — name WHICH
kind of blocked, per item — rather than reporting the backlog blocked as a
whole, which is the mis-sort that cost four wakes on 173.2.

## The archive sweep: not due, do not re-raise

`roadmap_scope.py` reads closed-history share **1,440 / 4,032 = 35.7%** at
hand-off — well under the **55.1%** at which 252.1 dispatched the tenth sweep on
2026-09-03. It read 35.5% at wake start; the share rose because Slice 259 closed
*fully*, so its whole body is closed history the moment it lands. That is
arithmetic, not a backlog signal — the same mechanism the last three hand-offs
recorded for Slices 256, 257 and 258, now four wakes running. Eligible targets
`[259, 258, 257, 256, 255, 254, 253, 252, 237]`, of which 253 and 237 are named
by the still-open Slice 249 and stay per 236.2. Re-run the script; snapshots.

## What landed this wake

**One commit of substance, dispatched by rule 4 (Continue, build mode).** Rule 1
clear (no open P0; GitHub intake `totalCount: 0`); Step 1 triaged and committed
nothing — no new input.

### Slice 259 — 249.9's two Accept clauses answered before the page exists

Three things worth carrying:

1. **The item's mechanism premise was false, and re-checking it is what the
   round was for.** 249.9 said the miniature comes "via `browser-harness.mjs`
   (already exists, used today for patterns via `PatternPreview.astro`)".
   `browser-harness.mjs` has **13** consumers and **0** run at build time — all
   are gates invoked after `astro build` against `dist/`. `PatternPreview.astro`
   launches no browser at all: **10** hand-authored HTML fragments (of **39**
   patterns), scaled by a CSS custom property. "Already exists" named a
   different mechanism than the one that ships.
2. **Both cost routes measured, so the Accept's second clause is satisfied
   whichever the build takes.** Browser route: ~**8.0 s** warm / **11.6 s** cold
   for 39 component pages, **+1.23 MB** in `dist/` (**8.8%** of 14,549,590
   bytes). Shipped route: zero build time, authoring paid 10 times in 39.
3. **The badge audit found two badges with no JSON key and one with an empty
   one** — `pattern links` (mapping exists only in built HTML, and `astro build`
   runs before every dist-walker, so a generator must emit from source),
   `JS-required` (the stated derivation is binary for a ternary label and
   mis-classifies both ways), and `AT line` (`at-evidence.json.components` is
   `{}` for all 40, blocked by Slice 15).

**The probe was wrong on its first draft, caught before commit:** the cost table
first claimed the PNG byte total was *byte-identical* across all three runs. Only
run 3's per-page bytes were kept; runs 1 and 2 were the probe's rounded kB print
(1254 / 1255 / 1255 kB). The table now states the precision it was taken at and
the reconciliation is "agree to within 0.1% while wall times move 45%".

**Not verified, and named rather than implied:** cloud wake, so the 1440/390
light-and-dark screenshot lane could not run. The diff is `ROADMAP.md` and
`.roundtable/` only — **0** files under `packages/core/src/css/`, no page
markup, no script — so there is nothing a screenshot could have shown. Built
page count unchanged at **138**.
