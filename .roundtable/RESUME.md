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
at hand-off. Two commits this wake, both pushed: Slice 249.5 and this hand-off.

**`check:resume-slice-ids` will name `249.1` and `249.5` as closed — both are
deliberate.** Neither appears below as open, blocked or queued: `249.1` is
named only as history, and `249.5` only as *what this wake closed*.

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

**One thing the owner may want to decide, not blocking:** whether `ubuntu-latest`
actually carries pnpm/yarn/bun. This wake's new `check:quickstart` step 3b
verifies whichever are installed and prints `NOT VERIFIED here — <pm> …` for the
rest. **It is not knowable from a cloud container**; the first CI run after this
push answers it, and its summary line names exactly which ones ran. If bun is
absent there, the options are a `setup-bun` step or accepting the printed
non-verification — no code change is needed either way.

## Dispatch counters at hand-off

Read `dispatch_status.py` yourself — the sets below are snapshots.

- **Rule 2 (Standardize)** read `0 / 4` at wake start; **`1 / 4`** after this
  wake's Continue row.
- **Rule 3 (Objective)** read `0 / 3` at wake start (it fired and discharged
  last wake); **`1 / 3 [249]`** now.
- **Rule 5 (Optimize)** read `ok` (not STALE) — `0 wake-date(s) newer`, newest
  pair `bundle-gz-kb`, 128 samples. **No sample was recorded this wake,
  deliberately:** the diff changes 0 files under `packages/core/`, so a
  `bundle-gz-kb` reading could only reproduce the existing value. The gate's own
  9.2 s wall time was measured but **not** recorded as a metric — it was not
  measured BEFORE the change, so there is no delta to report and a
  once-sampled name cannot serve rule 5's "two consecutive runs".

## Next wake

Rules 1-3 are clear, so expect **rule 4** again. Open set `OPEN: [15, 112, 249,
256]`; the oldest open sub-item is **`249.6`** — the "Choose your path"
adoption-scenario router on `index.astro`.

**`249.6` is dispatchable but is the largest of the remaining 249 items** — six
rows, each ending in a rendered screen, plus a `check-learning-path`-style arm,
and its Accept says a row ending in prose alone fails. The theming row currently
has no terminal page, so it needs one re-themed screen-kit example **or the row
is cut**; deciding that is part of the item. A cheaper alternative if a wake
wants a small one: **`256.2`** (a five-line allow-list decision on
`check:floor`'s stated exemption, plus a two-sided red-proof, no browser), or
**`249.11`** / **`249.14`**.

- Slice 15's `AT runtime evidence` and `112.3`/`112.4` are **owner-blocked**
  (LOOPS.md 186.2's vocabulary).
- `249.6`–`249.8`, `249.11`, `249.14` and `256.2` are dispatchable; `249.10`,
  `249.13` are owner calls; `249.9` depends on 249.8 (tagline) + 249.3 (shipped).
- **`249.15` is browser-blocked in the screenshot sense** (a static OG image) —
  a cloud wake should NOT pick it up; a LOCAL wake can. `249.12` names Slice 237,
  which is why the archive sweep leaves 237 in place (236.2).

## The archive sweep: not due, do not re-raise

`roadmap_scope.py` reads closed-history share **714 / 3,106 = 23.0%** at
hand-off — well under the **55.1%** at which 252.1 dispatched the tenth sweep on
2026-09-03. It read 23.6% before this wake's item landed; the share FELL because
249.5's 80 new lines went into the live denominator while Slice 249 stays open,
so none of them counts as closed history. That is arithmetic, not progress.
Eligible targets `[255, 254, 253, 252, 237]`, of which 253 and 237 are named by
the open Slice 249 (249.6, 249.12) and stay per 236.2. Re-run the script; these
are snapshots.

## What landed this wake

**Slice 249.5 — install commands for pnpm/yarn/bun**, dispatched by rule 4 as
the oldest open item. Rule 1 clear (no open P0; GitHub intake `totalCount: 0`);
Step 1 triaged and committed nothing — no new input.

The item allowed *"add the three, or file a one-line refusal"*. **The refusal
lost on a measurement:** its stated argument ("the no-bundler audience makes it
noise") is about *bundlers*, while the install line serves the npm-ecosystem
audience, and the page already answers the no-package-manager case two lines
below. Confirmed still true at dispatch — `grep -rniE 'pnpm|yarn|\bbun\b'` over
`apps/docs/src` returned **0 files**.

The three are **executed, not written**, because the page's own opener claims
they are (*"These steps are executed… If anything here stops working, that build
fails"*). `check:quickstart` gained **step 3b**: install the local packed build
with each documented package manager, resolve the same four entry points step 3
resolves for npm. Page and gate read ONE list —
`apps/docs/src/data/package-managers.mjs`, the `MARKUP_RULES` precedent.

Measured here, all four green (Node v22.22.2; npm 10.9.7, pnpm 10.33.0, yarn
1.22.22, bun 1.3.11): 191–561 ms per install, whole gate **9.2 s**.

**The finding worth carrying: the red-proof caught a detector that could not
fail.** Step 3b's first version put each package manager's directory INSIDE the
gate's temp dir — which already holds step 2's npm install — so Node's resolver
walked up into `dir/node_modules` and every documented import resolved whatever
the package manager had done. The injection (yarn installing `is-number@7.0.0`
instead of the package) was **confirmed present in the file** and the gate still
passed. Fixed with a sibling temp root, with the reason in a comment at its
declaration so it cannot be tidied back. This is CLAUDE.md's *"a green red-proof
is a defect in the injection until proven otherwise"* landing the other way
round for once — the injection was fine and the arm was the defect, which is why
confirming the injection landed is what separated the two.

Three red-proofs, each injection asserted to match exactly once before
replacing: (a) yarn pointed at a different package → red, naming the import and
the documented command; (b) bun pointed at a nonexistent tarball → red, naming
the documented command; (c) a package manager that is not installed → **rc=0**
with `NOT VERIFIED here` on stderr and in the summary line.

**Scope limit, stated rather than glossed:** `yarn` here is **1.22.22
(classic)**. **Yarn Berry / PnP is NOT covered** — it resolves through a zip and
no evidence was taken for it. The documented command is right for both; the
verification is classic-only.

**Not verified, and named rather than implied:** this was a cloud wake, so the
1440/390 light-and-dark screenshot lane could not run. This item **does** have a
small visual surface — one new `<p class="bo-u-text-muted">` carrying three
`<code>` spans — so the honest statement is that its *properties* were swept and
its *appearance* was not. No new CSS rule ships (existing classes only), and the
rendered section was read out of the **BUILT** page rather than off the diff.
All **17** CI entry points, re-derived from `ci.yml`, ran green in this
container.
