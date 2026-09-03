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
at hand-off. Three commits this wake, all pushed: the 249.6/249.7 re-scope,
Slice 249.14, and this hand-off.

**`check:resume-slice-ids` will name `249.1`, `249.5` and `249.14` as closed —
all three are deliberate.** None appears below as open, blocked or queued:
`249.1` and `249.5` only as history, `249.14` only as *what this wake closed*.

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

**Last wake's open question is answered.** It asked whether `ubuntu-latest`
carries pnpm/yarn/bun for the new `check:quickstart` step 3b. This container
ran all four green — `package managers — 4 documented import(s) resolve after
each of: npm, pnpm, yarn, bun` — so nothing is being skipped here. That is a
statement about **this container**, not about CI; the first CI run after the
previous push is what answers `ubuntu-latest`, and its summary line names
exactly which package managers ran. No code change is needed either way.

**One thing the owner may want to weigh, not blocking:** `249.7`'s seed is
nearly empty (see below). Whether a terminology table is worth three consumers
turns on `249.10`, which is the owner's vocabulary column.

## Dispatch counters at hand-off

Read `dispatch_status.py` yourself — the sets below are snapshots.

- **Rule 2 (Standardize)** read `1 / 4` at wake start; **`2 / 4`** after this
  wake's Continue row.
- **Rule 3 (Objective)** read `1 / 3 [249]` at wake start and **unchanged** —
  249.14 closed an ITEM, and 249 was already counted; the counter is per slice.
- **Rule 5 (Optimize)** read `ok` (not STALE) — `0 wake-date(s) newer`, newest
  pair `bundle-gz-kb`, 128 samples. **No sample was recorded this wake,
  deliberately:** the diff changes 0 files under `packages/core/`, so a
  `bundle-gz-kb` reading could only reproduce the existing value. The suite's
  28 descriptions are a count, not a trend, and a once-sampled name cannot
  serve rule 5's "two consecutive runs".

## Next wake

Rules 1-3 are clear, so expect **rule 4** again. Open set `OPEN: [15, 112, 249,
256]`, 13 open items.

The oldest open sub-items are `249.6` and `249.7`, and **both were worked this
wake and left open on purpose** — read their ROADMAP entries before
re-dispatching either, because both now carry a measurement that changes what
they cost:

- **`249.6` is browser-blocked in the SCREENSHOT sense** (`LOOPS.md` 186.2's
  vocabulary) — a LOCAL wake can take it, a cloud wake should not. Measured
  here: **three** of the six adoption-scenario rows have no qualifying terminal
  page, not the one the item claimed, so it costs three rendered screens plus a
  new block on the landing page.
- **`249.7` is open as a COST question, not as unstarted work.** Its Accept's
  first clause has been executed: 4 of the 5 seed rows do not reproduce. Do not
  re-run that grep — the table is in the item. Settling it before the owner
  answers `249.10` would decide it on the thinnest possible input.

**So the oldest genuinely dispatchable item is `249.8`** — component tagline +
category generated from the CSS header. It was passed over this wake for a
stated reason, not a hidden one: it rewrites `Gallery.astro`'s sidebar array
and `index.astro`'s task-tile prose, which is visible text on all 127 docs
pages, and the screenshot lane that would confirm no visible regression cannot
run in a cloud container. A local wake should take it. A cloud wake that takes
it anyway should land the generated strings **identical to the hand-written
ones** and say so.

- Slice 15's `AT runtime evidence` and `112.3`/`112.4` are **owner-blocked**.
- `249.10`, `249.11`, `249.13` are owner calls; `249.12` is owner-or-
  architecture, low urgency; `249.9` depends on `249.8`.
- **`249.15` is browser-blocked in the screenshot sense** (a static OG image) —
  a cloud wake should NOT pick it up.
- **`256.2` is the cheap one** if a wake wants a small item: a five-line
  allow-list decision on `check:floor`'s stated exemption, plus a two-sided
  red-proof, no browser.

## The archive sweep: not due, do not re-raise

`roadmap_scope.py` reads closed-history share **714 / 3,238 = 22.1%** at
hand-off — well under the **55.1%** at which 252.1 dispatched the tenth sweep on
2026-09-03. It read 23.0% at wake start; the share FELL again for the same
arithmetic reason as last wake: this wake's ~130 new ROADMAP lines went into the
live denominator while Slice 249 stays open, so none of them counts as closed
history. That is arithmetic, not progress. Eligible targets `[255, 254, 253,
252, 237]`, of which 253 and 237 are named by the open Slice 249 and stay per
236.2. Re-run the script; these are snapshots.

## What landed this wake

**Two commits of substance, both dispatched by rule 4.** Rule 1 clear (no open
P0; GitHub intake `totalCount: 0`); Step 1 triaged and committed nothing — no
new input.

### 1. `249.6` and `249.7` re-scoped by measurement, both left open

Rule 4's oldest item was `249.6`. Its premise was a wake-old measurement, so it
was re-run before dispatching, per CLAUDE.md — and it was wrong. Both items'
full tables are in `ROADMAP.md`; the two findings worth carrying:

**The predicate `249.6`'s gate was going to use could not fail.** Read
whole-page, *"the terminal page contains a pattern link"* is **78–81 on all 31
learning-path pages** — the docs sidebar lists every pattern page, so it is
uniformly true. Anchored to `<section class="demo"`, the anchor
`check-learning-path` already uses, the same predicate reads **17 of 31 (55%)**.
The Accept now names the anchor. **And the anchor cuts the opener off** — `<h1>`
sits ~1,000 characters before the first demo section — so every absence it
reports was re-confirmed whole-page before being believed. That mattered:
`notification` on `/components/alerts` reads 1 anchored and 3 whole-page.

**`249.7`'s seed is nearly empty.** Three of five rows are refuted exactly as
the offcanvas row was — the page already carries the alias as live vocabulary
(`combobox` reads `dropdown` 3 / `select` 44 / `autocomplete` 11; `data-table`
reads `grid` 10; `stepper` reads `wizard` 1). Surviving: one full row (master
data / CRUD / maintain, all three at 0 on both named pages) and one term
(`snackbar`), plus `typeahead`, which no seed row named.

### 2. Slice 249.14 — a distinct description on all 28 erp-suite screens

Dispatched as the oldest item this wake could finish to its Accept with the
verification available here. `page()` now takes a `description`, emits the tag,
and **throws** below `DESCRIPTION_MIN = 40` or on a `"` in the prose; the audit
gained two arms reading the BUILT file, reported before the browser starts.
Measured: 28 descriptions, **105–123 characters**, 28 distinct.

**The finding worth carrying: the fail-fast claim in the comment was false when
written.** It said a missing description fails in milliseconds instead of after
28 screens × 2 widths of axe — but `failures` was only reported at the very end,
so it did not. The choice was to make the claim true (report and exit before
Chrome starts) rather than soften it. A comment asserting runtime behaviour is
the same kind of claim CLAUDE.md makes executable for pages; there is no gate
behind this one, so it is written down here instead.

**Four red-proofs, each with the injection confirmed before the red was
believed:** tag stripped (1 → 0 tags in the file, red naming the page);
description duplicated (identical `content` on both files, red naming both); a
13-character description (red naming the page and the count); and source side, a
missing and an 8-character description (the build throws, naming the page both
times). `copy-suite.mjs` re-runs `build.mjs`, so `npm run build -w docs`
enforces the render-side throw too — not only `npm run suite`.

**Verified against what it RENDERS.** 31 files changed in one pass, so the
assertion was the row-label pairing: every built page carries the description
authored for *that* source file, **28 of 28**, compared value-for-value. The
copy that actually ships — `apps/docs/dist/suite/` — carries 28 of 28 as well,
which is the "verify at the last point the artefact passes through" rule.

**Not verified, and named rather than implied:** cloud wake, so the 1440/390
light-and-dark screenshot lane could not run. This change has **no rendered
surface** — a meta description is invisible, no CSS or body markup changed, and
`check-erp-suite` confirms the suite still ships zero CSS of its own. All **17**
CI entry points, re-derived from `ci.yml`, ran green in this container.
