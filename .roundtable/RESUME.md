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

Last updated 2026-09-05 (**cloud** wake, scheduled routine). Working tree clean
at hand-off. Two commits this wake, both pushed: Slice 271 and this hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ THE ARCHIVE SWEEP IS DUE — this is the one number to act on

`roadmap_scope.py`, read **after** Slice 271 landed:
**3,668 / 6,468 = 56.7%** closed-history share. That is **above the 55.1% at
which 252.1 dispatched the tenth sweep on 2026-09-03**, and it is the first
reading over the line since. Last wake read 53.4% and said the sweep was "closer
but not due"; this wake closed two slices' worth of items and it crossed.

Re-run the script rather than quoting that figure — fifteen wakes running now.
**Before moving anything, read the script's own `⚠ named by a still-open item`
line** (236.2): it reported **4** targets named by open Slice 249 items — 253,
262, 237, 260 — which stay put. The sweep is hand-checked one slice at a time
(177.1 and CLAUDE.md's bulk-edit rule); it is not a regex over the file.

## Rule 4 is EMPTY again, and the kind of blocked is named

`270.1` was the one dispatchable item and this wake took it. The live open set is
back to **11**: `249.6`, `249.7`, `249.9`, `249.10`-`249.13`, `249.15`, Slice 15,
`112.3`, `112.4`. Classified per `LOOPS.md` 186.2, re-read from `ROADMAP.md` this
wake rather than copied:

- **owner-blocked:** Slice 15 (AT runtime evidence, owner hardware), `112.3`,
  `112.4` (owner briefs, then 112.3's verdict), `249.10`-`249.13`, and `249.7`
  (its own text says not to settle it before the owner answers `249.10`).
- **browser-blocked in the SCREENSHOT sense** (`ENVIRONMENT.md`'s FIRST list — a
  LOCAL wake can take these): `249.6`, `249.9`, `249.15`.
- **agent-blocked:** none. **NOT BLOCKED:** none.

So the next cloud wake should expect rule 4 to find nothing and fall through —
**unless it triages the archive sweep above**, which is takeable in a cloud
container and is the precedent Slices 165, 177 and 252 set from inside a
dispatch.

**`check:resume-slice-ids` will report the closed ids named in this file, and
all are deliberate** — `270.1`, `271.1`, `269.1`, `267.1`, `249.18`, `249.20`,
`252.1`, `240.1`, `231.2` appear as history or as precedent. Nothing here queues
or blocks on a closed id.

## The counters, read immediately after recording — re-run them, this is a snapshot

- **Rule 2 (Standardize)** `2 / 4 Continue rounds … ok` — it moved, because this
  wake ran **Continue**. Two more Continue rounds arm it.
- **Rule 3 (Objective)** `1 / 3 slice … ok [271]` — **it moved off 0 for the
  first time in seven wakes**, and that is 161.4 behaving correctly rather than a
  change: only `Continue` and `Standardize` rows close a slice, and the six
  preceding wakes were all `Polish`.
- **Rule 5 (Optimize)** — read the line, do not assume. Its TREND clause was
  STALE again (now `2 wake-date(s) newer`), so it must be reported *could not be
  evaluated*, never clear. Do not "fix" that by recording a guessed value (see
  the bottom of this file). Its SECOND clause (184.2's "a size budget breached
  outright") is separately evaluable and was clear at build time:
  `check-size.mjs` passed at *139 shipped payload files in 11 buckets, 376.2 kB
  gz, tightest headroom 110 bytes* (`css/brand-navy.min.css`) — the identical
  reading for a fifth wake.
- **Rules 5 and 6 were NOT EVALUATED this wake**, because rule 4 matched and Step
  2 dispatches the first match. The figures above are from the build, not from
  answering the rule. Six consecutive hand-offs answered rule 5 out of habit; a
  rule below a match is unreached, not clear.

## What landed this wake

**Dispatched by rule 4 (Continue, build mode)** — first time in seven wakes.
Rule 1 clear (`list_issues` → `totalCount: 0`, no open item is a P0); Step 1
triaged and committed nothing. Step 0 hit **trap 1** for the third wake running
(detached HEAD, local `main` stale at `26447ba` against a pushed `ceca258`), and
**trap 2's second half bit as written**: `--unshallow` was clean in one attempt
(**1,873** commits) but brought **no tags** — `git tag` read 0 until
`git fetch --tags origin`, which returned all seven. Last wake's hand-off said
the unshallow "brought all seven tags unprompted"; that is environment-dependent,
so fetch them explicitly rather than expecting it.

### Slice 271 — `check:slice-refs` now reaches the whole tracked tree

Closes `270.1`. Four things worth carrying:

1. **Fixed one notch wider than filed, with the numbers to justify it.** The
   item asked for `.ts` and `.json`; what shipped is a **denylist** — everything
   tracked minus binaries and `apps/docs/versions/**`. An allowlist that omitted
   the language the shipped behaviours are authored in is the failure mode, not
   the typo. Measured before choosing: allowlist+`ts,json` = 848 files / 295
   refs; denylist = **698 files / 295 refs**, i.e. **fewer files than the filter
   it replaces, identical reach**, and the set-difference is empty in both
   directions.
2. **The frozen-snapshot exclusion is a REDUCTION in reach and is named as one.**
   The old filter was already scanning frozen `.css`/`.js` under `versions/`. A
   dangling citation there is unrepairable, so it would pin the archive forever
   with the baseline as the only remedy. It costs **zero** refs — every ref the
   frozen tree carries is also cited from a live file.
3. **The reconciliation the Accept demanded found a second defect.** The gate's
   headline read *"774 slice citation(s) checked"* while 295 refs are cited:
   481 heading-uniqueness checks (252 live + 229 archived) + 293 resolve checks.
   The noun was wrong, and is `assertion(s)` now; the run line also names its own
   reach. **The probe's own first output was the thing that was wrong** — its
   third row assumed the headline meant citation occurrences (703) and
   disagreed; the gate was right. Base rate holding, again.
4. **Red-proved two-sidedly AND once per newly-reached type.** Injected together,
   a `.ts` and a `.json` citation collapse into ONE failing assertion (same ref,
   two citers), which proves one file type and does not say which. Separately:
   old gate on the injected tree exit 0 at a byte-identical run line; new gate
   exit 1 on each injection alone, its detail naming the file; exit 0 reverted.
   The previous gate was extracted with `git show HEAD:<path>` into a sibling
   probe, never `git stash` (ENVIRONMENT's rule).

**The injected slice number is deliberately not written down anywhere in
`ROADMAP.md` or this file.** Both are the corpus the gate resolves against, so
writing it would make it *resolve* and silently disarm the next re-proof. Pick
one by the property: `grep -o '\b<n>\b' ROADMAP.md ROADMAP-archive.md | wc -l`
must read 0 before injecting.

**Not verified, and named rather than implied:** cloud wake, so the 1440/390
light-and-dark screenshot lane could not run. It is not needed here and that is
measurable rather than asserted — **0** files under `packages/core/src/`, **0**
docs pages and **0** CSS changed; the whole diff is one docs *script* plus
markdown, and nothing in it renders. All **17** CI entry points were re-derived
from `ci.yml` and run green. `check:claims` read *162 live · 3 NOT VERIFIED* —
ENVIRONMENT 6b's container property, and 158 → 162 is prose landing.

## Direction

Nothing new from the owner this wake, and nothing owner-facing is newly blocked.
GitHub intake is empty (`list_issues` → `totalCount: 0`). The two standing owner
blocks are unchanged: Slice 15's AT runtime evidence (owner hardware) and
`112.3`/`112.4` (owner briefs, then 112.3's verdict). `249.10`-`249.13` remain
the owner-decision cluster inside Slice 249.

## `bundle-gz-kb` still cannot be sampled — twelfth wake

259.1's rule-5 finding, re-verified this wake rather than re-derived:

```
grep -rln 'bundle-gz-kb' --include='*.mjs' --include='*.py' --include='*.ts' \
  --include='*.js' --include='*.json' . | grep -v node_modules
```

still returns exactly **one** file — `scripts/loops/record_metric.py` — and the
hit is its **docstring example**, `--value 7.0`. Nothing derives the number. Do
not "fix" rule 5's staleness by recording a guessed value.
