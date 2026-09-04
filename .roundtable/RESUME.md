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
at hand-off. Two commits this wake, both pushed: Slice 257 and this hand-off.

**`check:resume-slice-ids` will name `257.1` as closed — that is deliberate.**
It appears below only as *what this wake closed*, never as open, blocked or
queued.

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

Nothing this wake needs an owner decision. The item closed was a build-script
duplication found and consolidated inside the dispatched Standardize sweep.

## Dispatch counters at hand-off

Read `dispatch_status.py` yourself — the sets below are snapshots.

- **Rule 2 (Standardize)** read `4 / 4 OVERDUE` at wake start and was
  **discharged** by this wake's sweep. It resets to `0 / 4`.
- **Rule 3 (Objective)** read `2 / 3 [249, 256]` at wake start. Slice 257
  closed fully this wake and is a **Standardize** row, which counts as a slice
  closure per 161.4 — so expect **`3 / 3 OVERDUE`** and **rule 3 to fire next
  wake**, above the queued build item. Re-read the counter rather than
  trusting this sentence.
- **Rule 5 (Optimize)** read `ok` (not STALE), so the rule *could* be evaluated
  and finds nothing. **No sample was recorded this wake, deliberately:** the
  diff is three build scripts plus markdown and changes **0** files under
  `packages/core/src/css/`, so a `bundle-gz-kb` reading could only reproduce the
  existing value — and a repeated identical value is a data point about the
  instrument, not the bundle.

## Next wake

**Expect rule 3 (Objective), not rule 4** — see the counter above. The grill
scope would be the three slices the counter names; re-read them rather than
inheriting this list.

If rule 3 has already been discharged, rule 4's open set is `OPEN: [15, 112,
249]`, **11** open items. The classifications below were each re-read against
`ROADMAP.md` this wake, not inherited, and are unchanged from the last
hand-off:

- Slice 15's `AT runtime evidence` and `112.3`/`112.4` are **owner-blocked**.
- **`249.6` is browser-blocked in the SCREENSHOT sense** (`LOOPS.md` 186.2's
  vocabulary) — a LOCAL wake can take it; a cloud wake should not.
- **`249.7` is open as a COST question, not as unstarted work.** Its Accept's
  first clause has been executed: 4 of the 5 seed rows do not reproduce. Do not
  re-run that grep — the table is in the item. Settling it before the owner
  answers `249.10` would decide it on the thinnest possible input.
- **`249.9` is browser-blocked in the screenshot sense** — it builds a
  `/components/` catalogue whose point is rendered miniature previews. Its
  Accept's second half — *"the miniature-rendering build-time cost is measured
  and stated before this closes"* — is measurable anywhere, so a cloud wake
  could usefully measure and record that number without building the page.
  **This is still the best remaining cloud-takeable item on rule 4.**
- `249.10`, `249.11`, `249.13` are owner calls; `249.12` is owner-or-
  architecture, low urgency.
- **`249.15` is browser-blocked in the screenshot sense** (a static OG image).

## The archive sweep: not due, do not re-raise

`roadmap_scope.py` reads closed-history share **1,158 / 3,620 = 32.0%** at
hand-off — still well under the **55.1%** at which 252.1 dispatched the tenth
sweep on 2026-09-03. It read 27.7% at wake start; the share rose because Slice
257 closed *fully*, moving its own body straight into closed history. That is
arithmetic, not a backlog signal — the same mechanism the last hand-off recorded
for Slice 256. Eligible targets `[257, 256, 255, 254, 253, 252, 237]`, of which
253 and 237 are named by the still-open Slice 249 and stay per 236.2. Re-run the
script; these are snapshots.

## What landed this wake

**One commit of substance, dispatched by rule 2 (Standardize).** Rule 1 clear
(no open P0; GitHub intake `totalCount: 0`); Step 1 triaged and committed
nothing — no new input.

### Slice 257 — five lanes clean, and the finding came from none of them

All five sweep lanes came back clean, member-for-member rather than by count.
The consolidation this sweep landed was found by *reading the newest large
change* (249.8, 49 files) against step 1's lane-1 instruction, not by running an
instrument. Four things worth carrying:

1. **The drift was a rule copied into two files that COMPARE their results at
   runtime.** `new-component.mjs` stamps an `@label` only when the requested
   label differs from the derived default, so a disagreement between the two
   spellings is silently written into a shipped CSS header — and it had already
   happened once, inside 249.8's own wake ("Probe Widget" vs "Probe widget").
   249.8 fixed the symptom by hand-copying the extractor's derivation; 257.1
   removed the copy. Both callers now read `component-label.mjs`.
2. **No name-collision scan would have found it, at any width.** The two copies
   were named `defaultLabel` and `derivedLabel`. Lane 5's blind spot was
   measured anyway (it sees **69 of 158** definitions — blind to 48 arrow
   functions and 41 `export function`s) and **widening it was refused**: the
   only duplicate name in the blind spot is `compatOf`, a deliberate bound
   alias, so the widened predicate is 1-of-1 false positives.
3. **One sentence of 255.1's lane-5 reading is corrected in place.** It said
   *"`compatOf` no longer appears"*; the name appears twice, as a bound alias in
   each caller. The conclusion is unaffected and 252.3's consolidation is
   intact — what was wrong was asserting an absence in the repo from an
   instrument that cannot see the construct.
4. **Two of this wake's own probes were wrong on first output**, both caught
   before use: a `^const NAME = (` pattern that matched `= (await readdir(…))`
   and reported non-functions as duplicates, and a lane-3 path extraction that
   returned `/script/style/` out of the report's own explanatory header — an
   assertion tripping on its own explanation.

Red-proved two-sided with the injection confirmed by `grep -cF` **before**
either verdict was believed, using `cp` backups rather than `git checkout`
(249.8's recorded trap): the injected module put 54 `INJECTED…` labels into
`api.json` and made the scaffolder stamp an `@label`; restored, 0 labels and no
`@label`, on the same command and flags. Both probes deleted, `git status`
verified clean. The consolidation is **output-neutral, proved**: HEAD's
extractor run from a sibling probe path produces a **byte-identical**
`api.json`.

**Not verified, and named rather than implied:** cloud wake, so the 1440/390
light-and-dark screenshot lane could not run. The diff is three build scripts
plus markdown — **0** files under `packages/core/src/css/`, no page markup, the
built page count unchanged at 138, and `api.json` byte-identical — so there is
nothing a screenshot could have shown. All **17** CI entry points, re-derived
from `ci.yml` this wake rather than read off the snapshot, ran green here.
`check:repo` and `check:floor` were re-run *after* the `ROADMAP.md` edit, since
the earlier `docs:build` predated it.
