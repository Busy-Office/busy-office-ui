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

**Citation practice for this file, restated after 251 found a live one drift**
(`ROADMAP.md:351` no longer resolved by the time a later wake read it — the
file grows above any raw line number cited into it): **cite by slice number
only, never by raw `ROADMAP.md:NN`.** A slice number survives every rewrite;
a line number survives none.

---

## In flight: nothing

Last updated 2026-09-03 (**local** wake, interactive session). Working tree
clean at hand-off. Four commits this wake, all pushed: `7813b1d` (Roadmap 249
triage), `e3c8c57` (Slice 250 Objective grill), and the two carrying Slice
251 (247.1) and this hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## Dispatch counters at hand-off

```
Standardize   3 / 4 Continue rounds   since 2026-09-02 16:54   ok
Objective     0 / 3 slices            since 2026-09-03 08:11   ok
Optimize      1 wake-date(s) newer    since 2026-09-02 01:46   STALE   [newest pair: axe-violations]
```

- **Rules 1-3 clear.** Rule 3 just fired (Slice 250) and reset — do not
  re-dispatch Objective for at least 3 more closed slices.
- **Rule 5 is STALE, not clear** — say it could not be evaluated rather than
  reporting no regression; do not read a metric older than the newest loop
  activity as current.
- **Rule 4's open set is `OPEN: [15, 112, 249]`.** Slice 15's AT evidence and
  112.3/112.4 are owner-hardware-blocked, unchanged for many wakes (name
  which kind of blocked if reporting rule 4 as stuck — LOOPS.md 186.2). The
  next dispatchable item is **the oldest open sub-item inside Slice 249**
  (`249.1` through `249.9` are dispatchable now; `249.10`-`249.13` are owner
  calls, sent back explicitly rather than built — see Slice 249's own text
  for why before building any of them).

## ⚠ The archive sweep is a real signal, not yet acted on

`roadmap_scope.py` reads closed-history share **55.1%** (2,087 of 3,790
lines), up from 51.9% two commits ago in this same wake — this session's own
work (Slices 250, 251) is closed-on-arrival, which is why the share keeps
climbing without anything going stale. **14 eligible targets**, none flagged
by a still-open item's Accept **except Slice 237** (named by `249.12`'s
archival-trigger question — leave it until `249.12` resolves, same 236.2
reasoning Slice 247 applied to Slice 244 last time).

**Not run this wake.** Reason: this wake's dispatch was `247.1` (a citation
audit) and `249.x` triage/build, neither of which needed the sweep, and
running it mid-audit would have moved the very lines `247.1` was reading. The
next wake that dispatches a Standardize round is the natural place for it —
13 of 14 targets are unflagged and safe to move in one sweep.

## What landed this wake

Four pieces of work, in order:

1. **Roadmap 249** — triaged a 16-item external docs-adoption proposal
   (RoyUI comparison). Every load-bearing citation re-run against the live
   tree before trusting it; two of the proposal's own claims were refuted
   (a terminology-table worked example that was backwards, and a
   browserslist/floor "mismatch" that isn't one). 9 dispatchable items filed
   (`249.1`-`249.9`), 3 sent to the owner as-is (`249.10`-`249.12`), one sent
   back for explicit reconsideration rather than ratified (`249.13`, a
   proposed reversal of the 2026-08-16 demo-first/spec-last decision — the
   facts check out but the proposal's own justification misstates the
   original decision). Full triage: `.roundtable/grill-adoption-proposal-2026-09-03.md`.
2. **Slice 250** — Objective grill, dispatched by rule 3 (OVERDUE 3/3
   `[244, 245, 248]`). 28 of 28 checked claims reproduce; both of 244.4's
   red-proofs were executed live (not read off the write-up) and hold
   exactly, including the cited line number. No item filed — nothing to
   correct. Full report: `.roundtable/grill-objective-244-245-248-2026-09-03.md`.
3. **Slice 251** — `247.1` built. Audited every live `file:line` citation
   into a rewritten/regenerated file (`STATUS.md`, self-`ROADMAP.md`); all
   were already in the durable idiom except one, which was in THIS file
   (`RESUME.md:73`'s `ROADMAP.md:351`, drifted by this wake's own edits).
   Fixed by this rewrite rather than a patch — see the citation-practice note
   above.
4. **This hand-off.**

Earlier in this session (previous conversation turns, same working copy):
component-by-component design-grill (Slice 248, all 40 components, one real
`.bo-alert` reflow bug fixed, one framework-level `text-overflow: ellipsis`
fix), and a rebase of three local commits onto ~90 upstream commits that had
landed while this session worked (renumbered a local "Slice 226" to 248 —
origin had already used 226 for unrelated work).

## Next wake

Rule 4 dispatches Continue, build mode, on the oldest open item in Slice 249
— read that slice's own text for each item's Accept criteria before building.
