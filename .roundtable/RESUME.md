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
at hand-off. Two commits this wake, both pushed: Slice 249.3 and this hand-off.

**`check:resume-slice-ids` will name `249.3` as closed — that is deliberate.**
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
verdict). 249.3 shipped the AT block's *rendering* — every component page now
says "None recorded" and names why — so when that item does close, the register
to fill is `apps/docs/src/data/at-evidence.json` and the page picks it up with
no further work.

## Dispatch counters at hand-off

Read `dispatch_status.py` yourself — the sets below are snapshots.

- **Rule 2 (Standardize)** read `2 / 4` at wake start and **`3 / 4` after** this
  wake's Continue round. One more Continue round arms it.
- **Rule 3 (Objective)** read `1 / 3` before and after, still `[249]` — 249.3 is
  a sub-item of a slice already counted, so it does not advance the counter.
- **Rule 5 (Optimize)** read `ok`, not STALE, both before and after. **No
  `bundle-gz-kb` sample was taken this wake, deliberately.** The commit changes
  **0** files under `packages/core/src/css/` — the only core sources in it are
  `scripts/derive-floor.mjs`, `scripts/derive-introduced.mjs` and
  `src/data/introduced.json` — so a sample could only have reproduced 15.1 kB,
  and a third identical reading is a data point about the instrument, not the
  bundle. Two new metrics were recorded instead: `maturity-assertions=280` and
  `per-component-floors-distinct=9`.

## Next wake

**Rule 4's open set is `OPEN: [15, 112, 249]`, unchanged.** Inside Slice 249 the
oldest open sub-item is now **`249.4`** (README: stamped gate count, one
screenshot, who-for/not-for, FAQ).

- Slice 15's `AT runtime evidence` and `112.3`/`112.4` are **owner-blocked**
  (LOOPS.md 186.2's vocabulary).
- **`249.4` is PART browser-blocked in the screenshot sense.** Its Accept is
  "`stamp-readme --check` still exits 0; both READMEs carry ≥1 image", and the
  image it names is *one hand-made screenshot of `patterns/list-report` at
  `data-density="compact"`, labelled as hand-made in alt text*. A cloud wake
  cannot author that honestly — it is a rendered image a human compares. The
  other three halves (gate-count marker, for/not-for line from `scope.astro`,
  FAQ from `troubleshooting.astro`'s five headings) are plain generation and
  are dispatchable here. A cloud wake taking this should either split the
  screenshot out as its own item or move to `249.5`.
- **`249.5` is fully cloud-dispatchable** and is the cheapest next thing: add
  pnpm/yarn/bun install commands to `getting-started/installation.astro`, or
  file the one-line refusal. Either closes it.
- `249.6`–`249.9` are dispatchable; `249.10`–`249.13` are owner calls sent back
  explicitly — read Slice 249's own text first.
- **`249.15` is browser-blocked in the screenshot sense — a cloud wake should
  NOT pick it up.** Unchanged from last wake.
- **`249.9` now has one of its two dependencies.** It needs 249.8 (tagline) and
  249.3 (maturity labels); the second is done, and `dist/introduced.json` +
  `floor.json`'s `perComponent` are the JSON keys its "every badge traces to a
  JSON key" Accept can point at.

## The archive sweep: unchanged, do not re-raise

`roadmap_scope.py` reads closed-history share **539 / 2,587 = 20.8%** at
hand-off (21.7% at wake start — the share FELL because this wake added 103 lines
of live text to 249.3, not because anything was archived). The three eligible
targets are still `[253, 252, 237]`, and **2 of 3 are named by a still-open
item**: 253 by `249.6`, 237 by `249.12` (236.2's rule — leave both). Slice 252
is eligible and unnamed, as it has been for three wakes. Re-run the script;
these are snapshots.

## What landed this wake

**Slice 249.3 — maturity labels**, dispatched by rule 4 (rules 1–3 all clear: no
open P0, GitHub intake `totalCount: 0`, Standardize 2/4, Objective 1/3). Step 1
triaged and committed nothing — there was no new input.

Every component page now carries a `Maturity` section with four facts, each read
from a key: introduced version (`dist/introduced.json`), that component's own
CSS floor (`floor.json` → `perComponent`), the DSA scoring date, and AT runtime
evidence. `check:maturity` (`@exact`, 280 assertions) asserts all of it from the
BUILT pages.

**Four things a later wake should not have to re-derive:**

1. **The item's stated mechanism was refuted, not implemented.** "First tag
   containing the component's CSS file" is wrong for **38 of 40** components:
   0.1.0 was published and never tagged, `v0.2.0` is a tag with no release
   behind it, and a source-path scan misses `form` (its directory has never held
   a `form.css`). The registry's tarballs are the source instead. Commands are
   in ROADMAP 249.3; the record is `packages/core/src/data/introduced.json` and
   `npm run refresh:introduced -w @busy-office/ui` rebuilds it after a publish.
   **That refresh is the one manual step this adds** — miss it and newly added
   components read "Not published yet", which is conservative rather than wrong.
2. **The "Not yet scored" branch is unreachable by construction.**
   `check:dsa-scores` already fails the build if a page renders a score it does
   not have, so neither `Maturity` nor `DsaScore` can reach its own fallback.
   Injecting it turned the build red and the probe then read a STALE page and
   reported the string absent — the rc=1 is the only reason that was not filed
   as a rendering bug.
3. **`check:pseudo` is the gate that found the real defect, twice.**
   `check:layout` and `test:axe` were green through every round. Round 1 (prose
   in the `<dd>`s) and round 2 (short values, still `.bo-kv--rows`) each failed
   the same 9 of 14 sampled pages at 390px; the second cause was the `<dt>`
   sizing a `max-content` track, not the value. Plain `.bo-kv` passes. **If a
   round adds a key-value list, run `check:pseudo` before believing it.**
4. **The framework floor did not move.** `floor.json`'s existing keys are
   byte-identical to the pre-change file — asserted by `JSON.stringify` equality
   against a saved baseline, not by reading the numbers.

**Not verified, and named rather than implied:** this was a cloud wake, so the
1440/390 light-and-dark screenshot lane could not run. **Unlike 249.2, this
change DOES have a visual surface**, and the honest statement is that its
properties were swept and its appearance was not. No new CSS rule ships — the
block is `.bo-kv` + `.bo-u-text-muted` + `.bo-badge`, all existing — and
`check:layout`, `check:scroll`, `check:pseudo`, `test:axe`,
`check:forced-colors` and `check:target-size` all passed across the tree at 1440
and 390. All **17** CI entry points, re-derived from `ci.yml` rather than read
off `ENVIRONMENT.md`'s snapshot, ran green in this container, plus a
`DOCS_BASE=/busy-office-ui` build (both new links carry the prefix).
