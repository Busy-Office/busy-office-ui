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
survives none. Slice 253 found the same rule needed one wake later in
`.roundtable/polish-state.md`, which nobody had scoped — see below.

---

## In flight: nothing

Last updated 2026-09-03 (**cloud** wake, scheduled routine). Working tree clean
at hand-off. Two commits this wake, both pushed: Slice 253 and this hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## Dispatch counters at hand-off

Read `dispatch_status.py` yourself — the sets below are snapshots.

- **Rule 2 (Standardize)** was `1 / 4 Continue rounds` at wake start; this wake
  ran no Continue round, so it is unchanged.
- **Rule 3 (Objective)** fired this wake and is **reset** — the grill of 247,
  249 and 252 landed as Slice 253.
- **Rule 5 (Optimize)** read **`ok`, not STALE** (`0 wake-date(s) newer`,
  newest pair `bundle-gz-kb`) and does **not** fire: the newest comparable
  pair is ONE regression (11.7 kB 2026-08-17 → 15.1 kB 2026-09-03) and the rule
  needs two consecutive. **The next `bundle-gz-kb` sample completes or breaks
  that trend — take one**, as the previous hand-off also asked and this wake
  did not (it ran no build whose size was worth recording as a new sample; the
  gate's own figure is unchanged at 371.7 kB gz total).

## Next wake

**Rule 4 returns to Slice 249 at `249.2`** (per-page metadata: description,
sitemap, robots). Rule 4's open set is `OPEN: [15, 112, 249]`:

- Slice 15's `AT runtime evidence` and `112.3`/`112.4` are **owner-blocked**
  (LOOPS.md 186.2's vocabulary — 15 and 112.3 need owner hardware and owner
  briefs; 112.4 waits on 112.3's verdict).
- Inside Slice 249 the oldest open sub-item is **`249.2`**. `249.2`-`249.9` are
  dispatchable; `249.10`-`249.13` are owner calls sent back explicitly — read
  Slice 249's own text before building any of them.
- **`249.2` is partly browser-blocked in the cloud sense and partly not.** Its
  Accept is three greppable assertions over `dist/` (`name="description"` on
  every page, `sitemap-index.xml` lists every built page, `check-links` green)
  — all of that is a cloud wake's first list per ENVIRONMENT's "no screenshots
  is not no browser". The one static OG image it asks for is a *rendered
  image*, which a cloud wake cannot author honestly.

**`249.6`'s text changed this wake** (253.2). A wake building it should read
the corrected version: the proposal's `index.astro:118` citation **resolved**
and only its count was wrong, which is the opposite of what the item used to
say.

## The archive sweep: unchanged, do not re-raise

`roadmap_scope.py` reads closed-history share **374 / 2,178 = 17.2%** at wake
start. The two eligible targets are the same two the last hand-off named:
**Slice 252** (nothing to do — last wake's own slice) and **Slice 237**, still
refused because `roadmap_scope.py`'s dependency line names it as the target of
open item `249.12`'s Accept (236.2's rule). Leave 237 until `249.12` resolves.
Re-run the script — this wake added Slice 253, so the share has moved.

## What landed this wake

**Slice 253 — Objective grill of Slices 247, 249, 252**, dispatched by rule 3
(`3 / 3 slices OVERDUE`). Rule 1 clear: no open P0, GitHub intake
`totalCount: 0`; Step 1 triaged and committed nothing. **31 of 34 checked
claims reproduce**; full report in
`.roundtable/grill-objective-247-249-252-2026-09-03.md`.

All three defects are *citations about citations*:

1. **247.1's base rate is wrong by 4x** — it refuses a blanket `file:line`
   gate on "45 sites across all tracked markdown, ~39 in the archive and grill
   reports". Re-run with 247.1's own regex at the revision 247.1 names, it is
   **188 sites across 24 files, 91 in `ROADMAP-archive.md` alone** — the
   archive by itself is double the stated total, so the figure is internally
   impossible against 247.1's own correct "17 in `ROADMAP.md`". **The refusal
   stands and is strengthened**; only the number was corrected (in the archive,
   struck rather than deleted, per 236.2).
2. **247.1's scoped "live subset, 6 sites" omitted `.roundtable/polish-state.md`**,
   which rule 6 and §3b step 1 read every wake and which carries **12**
   `file:line` sites — and one had drifted (`server.mjs:105` → **106**, after
   two commits inserted above it). Restated there in the durable idiom.
3. **249.6 says `index.astro:118` "is the install snippet".** It is not, at any
   revision — line 118 is the first CTA button, 119 the second, and the install
   snippet is line **121**; `index.astro` has not changed since `f1be2485`.
   The item's conclusion (2 CTAs, 4 nav links, 6 task-tiles) reproduces in
   full.

**Slice 252 reproduced 15 of 15** and Slice 249 12 of 13, including a live
re-execution of 249.1's per-file red-proof.

**Two instrument failures, this wake's own, recorded in 253.3 rather than
buried:**

- **A green red-proof was a defect in the injection, twice.** Repetitive probe
  CSS gzips to nothing against a *gzip* budget; a bigger random probe never
  reached `check:size` because `build:rf-essentials`' 40 kB **minified**
  ceiling breaks sixteen steps earlier. The two size gates are not
  independent, and that ordering is inherent — `check:size` measures
  rf-essentials' output.
- **A whole-tree gate cannot be re-read by swapping two files.** Checking out
  `ROADMAP.md` + the archive at older revisions into the live tree made
  `check:slice-refs` read one low at *every* anchor, which looked like an
  off-by-one defect in Slice 252 and was nearly published as one. Real
  `git worktree` checkouts reproduce 252's numbers exactly. **A uniform
  off-by-one across three independently derived numbers is a defect in the
  instrument, not three coincident defects in the subject.**

**Not verified, and named rather than implied:** this was a cloud wake, so the
1440/390 light-and-dark screenshot lane could not run. Nothing in the diff
rests on a rendered image — four markdown files, no shipped artifact, and the
`data-table.css` probe was reverted and `dist/` rebuilt clean before any gate
reading. All **17** CI entry points, re-derived from `ci.yml` rather than read
off `ENVIRONMENT.md`'s snapshot, ran green in this container.
