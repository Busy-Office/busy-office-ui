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
at hand-off. Two commits this wake, both pushed: Slice 249.4 and this hand-off.

**`check:resume-slice-ids` will name `249.4` as closed — that is deliberate.**
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

**One thing the owner may want to see:** both READMEs — the GitHub front door
and the npm front page — grew three new sections this wake, and their content
is generated. Nothing about them was screenshot-verified, because nothing
rendered changed; but they are the surface a first-time visitor reads, so the
prose framing around the generated spans is worth an owner's eye.

## Dispatch counters at hand-off

Read `dispatch_status.py` yourself — the sets below are snapshots.

- **Rule 2 (Standardize)** read `3 / 4` at wake start and is **`4 / 4` after**
  this wake's Continue round — **so rule 2 fires on the next wake, ahead of any
  queued build item.** That is the ordering Step 2 states and the reason it was
  moved above rule 4; do not skip it for 249.5 because 249.5 looks cheaper.
- **Rule 3 (Objective)** read `1 / 3` before and after, still `[249]` — 249.4 is
  a sub-item of a slice already counted, so it does not advance the counter.
- **Rule 5 (Optimize)** read `ok`, not STALE. **No `bundle-gz-kb` sample was
  taken this wake, deliberately.** The commit changes **0** files under
  `packages/core/src/css/`, so a sample could only have reproduced the existing
  reading, and a third identical value is a data point about the instrument
  rather than the bundle. One metric was recorded instead:
  `readme-generated-facts=3`.

## Next wake

**Rule 4's open set is `OPEN: [15, 112, 249]`, unchanged.** But **rule 2 is
armed and sits above rule 4** — read the counters before assuming a build item.

Inside Slice 249 the oldest open sub-item is now **`249.5`**.

- Slice 15's `AT runtime evidence` and `112.3`/`112.4` are **owner-blocked**
  (LOOPS.md 186.2's vocabulary).
- **`249.5` is fully cloud-dispatchable** and is the cheapest next thing: add
  pnpm/yarn/bun install commands to `getting-started/installation.astro`, or
  file the one-line refusal. Either closes it.
- `249.6`–`249.9` are dispatchable; `249.10`–`249.13` are owner calls sent back
  explicitly — read Slice 249's own text first.
- **`249.15` and the new `249.16` are BOTH browser-blocked in the screenshot
  sense — a cloud wake should NOT pick either up.** `249.16` is this wake's
  split: the one hand-made README screenshot that 249.4 carried. Its other
  three halves shipped, so the screenshot is no longer holding them back, and a
  LOCAL wake can close it on its own.
- **`249.9` still has one of its two dependencies** (249.3's maturity labels);
  it also needs 249.8's tagline.

## The archive sweep: unchanged, do not re-raise

`roadmap_scope.py` reads closed-history share **539 / 2,684 = 20.1%** at
hand-off (20.8% at wake start — the share FELL because this wake added live
text to 249.4, not because anything was archived). The three eligible targets
are still `[253, 252, 237]`, and **2 of 3 are named by a still-open item**: 253
by `249.6`, 237 by `249.12` (236.2's rule — leave both). Slice 252 is eligible
and unnamed, as it has been for four wakes. Re-run the script; these are
snapshots.

## What landed this wake

**Slice 249.4 — README facts, generated**, dispatched by rule 4 (rules 1–3 all
clear: no open P0, GitHub intake `totalCount: 0`, Standardize 3/4, Objective
1/3). Step 1 triaged and committed nothing — there was no new input.

`derive-readme-facts.mjs` derives three repo facts into the committed record
`packages/core/src/data/readme-facts.json`; `stamp-readme.mjs` stamps them into
both READMEs as `stat:gates`, `stat:notfor`, `stat:faq`. Both halves are gated
in `build` (`check:readme-facts`, then `stamp-readme --check`).

**Five things a later wake should not have to re-derive:**

1. **TWO of the item's three stated premises were false**, and the commands are
   in ROADMAP 249.4 so they are re-runnable rather than re-derivable. The
   headline one: *"count of `check-*.mjs` carrying `--self-test`"* is the
   detector CLAUDE.md already records as unable to fail — **48** gate files
   contain the literal string, **18** contain the argv branch that runs one.
   Nothing here re-counts; `check-selftests.mjs` now exports `scanGates()` and
   the deriver imports it.
2. **The refactor of `check-selftests.mjs` is 19 pure insertions**, measured:
   `git diff -w --stat` shows zero deletions and zero logic edits, and the gate
   reads an identical `51 gates / 18 heuristic / 33 exact` before and after.
   That is the evidence the extraction is behaviour-preserving — not the fact
   that it still passes.
3. **The deriver reads the SOURCE pages, not the built ones, and that is
   load-bearing.** The built troubleshooting page carries **3** `<h2>`; the
   third is `Related`, the layout's own footer heading. Parsing the built page
   would have counted layout chrome as an authored question. The same command
   shows **no heading carries an `id`** — raw `<h2>` in `.astro` gets no
   auto-slug — so the READMEs link to pages, not anchors.
4. **The packages-only build context was tested for real**, not reasoned about:
   `packages/core` was copied to a tree with no `apps/`, and both deriver modes
   were run in it. It names each missing input on stderr, says the record was
   NOT rewritten and NOT verified there, leaves the record untouched, exits 0.
   This is the trap `check:rtl` already paid for once. The record lives in
   `src/data/`, not `dist/` — `check:package` reads **183 tarball files** both
   before and after.
5. **`stamp-readme`'s success line was hard-coding its own stat list** —
   *"size/behaviors/events"* while checking five. It now names them from the
   object. Small, but it is the same drift class the whole item is about.

**Not verified, and named rather than implied:** this was a cloud wake, so the
1440/390 light-and-dark screenshot lane could not run. **Unlike 249.3, this
change has no rendered surface at all** — the diff is two scripts, one JSON
record, `package.json` and two markdown READMEs; no CSS, no docs page, no
component. There is nothing a screenshot could have shown. The whole-tree
browser gates were run anyway and are reported with the commit.
