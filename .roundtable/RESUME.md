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
at hand-off. Two commits this wake, both pushed: Slice 249.2 and this hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## Dispatch counters at hand-off

Read `dispatch_status.py` yourself — the sets below are snapshots.

- **Rule 2 (Standardize)** read `1 / 4` at wake start and **`2 / 4` after**
  this wake's Continue round.
- **Rule 3 (Objective)** read `0 / 3` at wake start and **`1 / 3` after**
  (`[249]`).
- **Rule 5 (Optimize)** read `ok`, not STALE, both before and after. **The
  trend the last two hand-offs asked about is now BROKEN, not completed.** The
  pair was one regression (11.7 kB 2026-08-17 → 15.1 kB 2026-09-03) needing a
  second consecutive one to fire; this wake took the sample and it is
  **15.1 kB — flat, not a regression**, so rule 5 does not fire and the
  question is settled rather than carried forward again.

  **The identical value is expected here, and that was checked rather than
  assumed** — CLAUDE.md treats an identical value across inputs as a defect
  until proven otherwise. The commit touches **0** files under
  `packages/core/src/css/` (`git show --name-only --format='' HEAD | grep -c
  'packages/core/src/css/'`), and the only core file in it is
  `scripts/new-component.mjs`, so `index.min.css` had no input that could move
  it. A wake that changes framework CSS and still reads 15.1 has a broken
  instrument, not a flat trend.

## Next wake

**Rule 4's open set is `OPEN: [15, 112, 249]`, unchanged.** Inside Slice 249
the oldest open sub-item is now **`249.3`** (maturity labels with a real
source: DSA-scored date, introduced-version, floor, AT evidence).

- Slice 15's `AT runtime evidence` and `112.3`/`112.4` are **owner-blocked**
  (LOOPS.md 186.2's vocabulary — 15 and 112.3 need owner hardware and owner
  briefs; 112.4 waits on 112.3's verdict).
- `249.3`-`249.9` are dispatchable. `249.10`-`249.13` are owner calls sent back
  explicitly — read Slice 249's own text before building any of them.
- **`249.3` looks cloud-dispatchable**: its Accept is that every label on the
  built page traces to a key in `dist/` or `src/data/`, and that a component
  with no score renders the stated-absence string. That is a `dist/` grep and a
  DOM assertion — ENVIRONMENT's "no screenshots is not no browser" second list.
- **`249.15` is NEW and is browser-blocked in the screenshot sense — a cloud
  wake should NOT pick it up.** It is the one static OG image 249.2 named and
  did not build; whether a social card looks right is a rendered image a human
  compares.
- **`249.6`'s text was corrected by Slice 253** (the `index.astro:118` citation
  resolves; only its count was wrong). A wake building it should read the
  corrected version.

## The archive sweep: unchanged, do not re-raise

`roadmap_scope.py` reads closed-history share **539 / 2,484 = 21.7%** at
hand-off (22.9% at wake start — the share FELL because this wake added 127
lines of live text to 249.2, not because anything was archived). The three
eligible targets are `[253, 252, 237]`, and **2 of 3 are named by a still-open
item**: 253 by `249.6`, 237 by `249.12` (236.2's rule — leave both). Slice 252
is eligible and unnamed, as it was last wake. Re-run the script; these are
snapshots.

## What landed this wake

**Slice 249.2 — per-page metadata**, dispatched by rule 4 (rules 1-3 all clear:
no open P0, GitHub intake `totalCount: 0`, Standardize 1/4, Objective 0/3).
Step 1 triaged and committed nothing — there was no new input.

`grep -rl 'name="description"' dist --include='*.html' | wc -l` read **1 of
165** before (the landing page, which has always hand-written its own `<head>`)
and **127 of 127 built docs pages** after. Shipped: a required `description`
prop on `Gallery.astro` that throws without one, a `check-page-shape` arm over
all 127 source pages, a new `check-metadata.mjs` (`@exact`) asserting the
shipped result, `@astrojs/sitemap`, and a static `robots.txt`.

**Three things a later wake should not have to re-derive:**

1. **The Accept's `dist/**/*.html` glob is 165 files and its subject is 127.**
   The other 38 are the 10 redirect stubs and the 28 `suite/` pages, and
   neither should carry a description. Both exclusions were already this
   repo's, in `dist-pages.mjs`; the sitemap filter now reaches the same ten
   from `astro.config.mjs`'s own `redirects` object. The suite half is filed as
   **249.14** rather than absorbed.
2. **The sitemap arm reconciles two INDEPENDENT derivations** — Astro's route
   table against a walk of `dist/`. Generating the sitemap from `distPages()`
   was the cheaper design and was refused for exactly the reason CLAUDE.md
   gives: the gate would have compared a list against itself and been green
   whatever broke. They agree at 127 = 127.
3. **Six arms red-proved, each with the injection confirmed first** — a grep
   count, a DOM read, or the thrown message. The duplicate-description arm
   exists because the presence arm passes in full on 127 identical
   descriptions, which is the failure a 127-file bulk edit actually has.

**One instrument failure, this wake's own, recorded rather than buried:** the
probe that pairs each rendered page with its intended description reported
**104 of 116 and eleven mismatches** on its first run. Every one was the
probe's own entity handling (`&` renders as `&amp;`) plus an `index.astro` path
built as `patterns/index/index.html`. Corrected, it reads **116 of 116**. The
descriptions were never wrong — an instrument's first output is not evidence,
and this one was believed for about a minute.

**Not verified, and named rather than implied:** this was a cloud wake, so the
1440/390 light-and-dark screenshot lane could not run. Nothing in the diff has
a visual surface — a `<meta>` tag, two XML files and a `robots.txt` — and
`check:layout`, `check:scroll` and `test:axe` swept all 127 pages at both
widths green. All **17** CI entry points, re-derived from `ci.yml` rather than
read off `ENVIRONMENT.md`'s snapshot, ran green in this container.
