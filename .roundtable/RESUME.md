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
at hand-off. Two commits this wake, both pushed: Slice 262 and this hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

The live open set is `249.6`, `249.7`, `249.9`, `249.10`-`249.13`, `249.15`,
plus Slice 15 and `112.3`/`112.4` — **11 open, unchanged**, because 249.19 was
filed already closed.

**`check:resume-slice-ids` reports five closed ids, and all five are
deliberate.** Read from the check's own output rather than counted by hand, it
names `249.16`, `249.4`, `249.17`, `249.18` and `249.19` — the whole
per-EVIDENCE split chain the correction block below cites by name, plus this
wake's own. Nothing here queues or blocks on a closed id.

## ⚠ THE FIRST RULE THAT FIRES NEXT WAKE IS RULE 2, NOT RULE 4

`dispatch_status.py` read `Standardize 4 / 4 … OVERDUE` immediately after this
wake recorded — it was `3 / 4 ok` at wake start, and this wake's Continue round
is the fourth. **Rule 2 preempts rule 4**, deliberately (`LOOPS.md`: with it
below, a queued item always won and the counter could only fire once the
backlog emptied). So the next wake dispatches **Standardize**, not the oldest
open item.

Two things that sweep will need, because four consecutive sweeps got them
wrong:

- **There are FOUR lanes and the write-up must say `n of 4`.** Lane 4
  (`python3 scripts/loops/report_loop_prose.py`) is the one that keeps getting
  dropped; read its `ratchet` block first, never the delta.
- **Lane 3 (`report:prose`) names a PROPERTY, not a list of pages.** Verdict
  any flagged page carrying none in `ROADMAP.md` or `ROADMAP-archive.md`. A
  clean round here is the expected result and is worth one line.

Re-run `dispatch_status.py` yourself; the line above is a snapshot.

## ⚠ The correction most likely to be re-broken

**The per-EVIDENCE split rule is now 4 for 4, and this wake's instance came out
of an item nobody had labelled browser-blocked at all.** `249.16` out of
`249.4`, `249.17` out of `249.15`, `249.18` out of `249.9`, and now `249.19`
out of `249.7` — which is not a browser question but an OWNER-blocked cost
question, and still had one clause inside it that was neither.

**So the question at rule 4 is "which clause of this Accept is takeable", and
the answer is not always a browser lane.** 249.7 waits on the owner's 249.10
for its terminology decision; the Related-link measurement banked inside it
waited on nothing and nobody owned it.

**And this wake ran the rule against 249.6 too, and it correctly came back
NO** — recorded so the next wake does not re-open it hopefully. 249.6's Accept
has no separable cloud-takeable half: the gate arm cannot land green until the
three ✗ terminal pages gain something, a `Demo` is a rendered image, and a bare
pattern link would be fitting the page to the gate rather than the reader —
which is 249.6's own open question. The premise was re-run, not trusted: all
three pages still read 0 `Demo` and 0 `/patterns/` hrefs.

**The second lesson, and it is the one that changed this wake's output: measure
the base rate before you fix the thing you were handed.** The gap 249.7 banked
as *"worth keeping either way"* reproduced exactly — and turned out to be **1
of 55 pairs of the same shape**, with reciprocal linking the exception at 29 of
97 pairs (29.9%). Both gates that finding suggests are refused, one on 29.9%
and one on a 100% base rate (37/37 and 39/39 openers already link). The fix
that landed rests on a page-local argument instead. The command is beside the
claim in Slice 262 — run it, do not re-derive it.

**`bundle-gz-kb` still cannot be sampled, and the reason is unchanged for a
third wake** (259.1's rule-5 finding, re-verified this wake, not re-derived):

```
grep -rln 'bundle-gz-kb' --include='*.mjs' --include='*.py' --include='*.ts' \
  --include='*.js' --include='*.json' . | grep -v node_modules
```

still returns exactly **one** file — `scripts/loops/record_metric.py` — and the
hit is its **docstring example**, `--value 7.0`. Nothing derives the number. Do
not "fix" rule 5's staleness by recording a guessed value. The fix is to write
the derivation command next to the name, which is a loop-script change and
wants its own dispatch.

## Direction

Nothing new from the owner this wake, and nothing owner-facing is newly
blocked. GitHub intake is empty (`list_issues` → `totalCount: 0`). The two
standing owner blocks are unchanged: Slice 15's `AT runtime evidence` (owner
hardware) and `112.3`/`112.4` (owner briefs, then 112.3's verdict).

What landed needs no owner decision. It is the first change this cloud routine
has made to a component docs page's visible prose in several wakes — one
opener clause and one `Related` entry on `/components/dropdown` — so it is the
one thing in this hand-off a local wake might want to look at with its eyes.

## Dispatch counters at hand-off

Read `dispatch_status.py` yourself — the sets below are snapshots.

- **Rule 2 (Standardize)** reads `4 / 4 OVERDUE`. See the block above; this is
  the rule that fires.
- **Rule 3 (Objective)** reads `1 / 3`, naming `[249]`. Read after recording,
  per `LOOPS.md`'s instruction that this counter is only ever caught by a
  number disagreeing with something a human just wrote down: this wake's row
  begins `249.19`, so `SLICE_TOP` attributes it to 249 while the slice it
  closed is 262. **Fourth hand-off running with the same disagreement, same
  verdict — recorded, not fixed**; `LOOPS.md` rule 3 refuses a sixth regex over
  that parser and nothing downstream reads the attribution.
- **Rule 5 (Optimize) reads STALE, `1 wake-date(s) newer`** — unchanged from
  wake start, because this wake's rows land on 2026-09-04, a date already
  counted. `LOOPS.md` rule 5 is explicit that STALE means the rule has no input
  and must be reported as *could not be evaluated*; it was reported that way.

## The archive sweep: not due, do not re-raise

`roadmap_scope.py` reads closed-history share **1,909 / 4,665 = 40.9%** at
hand-off — under the **55.1%** at which 252.1 dispatched the tenth sweep on
2026-09-03. It read 39.4% at wake start; the share rose because Slice 262
closed *fully*, so its whole body is closed history the moment it lands. That
is arithmetic, not a backlog signal — seven wakes running now. Eligible targets
`[262, 261, 260, 259, 258, 257, 256, 255, 254, 253, 252, 237]`, of which the
script names 4 as cited by a still-open item. **262 is named by 249.19, which
is closed, so it does not stay on that ground** — but it IS cited by the open
`249.7` and by `249.6`, both of which this wake amended to point at it, so
check those before moving it. Re-run the script; snapshots.

## What landed this wake

**One commit of substance, dispatched by rule 4 (Continue, build mode).** Rule
1 clear (no open P0; GitHub intake `totalCount: 0`); Step 1 triaged and
committed nothing — no new input. Step 0c's pre-commit `git fetch origin main`
showed `origin/main` still at `681a88e`, so no collision. Step 0 hit **trap 1**
again: the container started DETACHED, fixed with
`git checkout -B main origin/main` before any work.

### Slice 262 — 249.19 split out of 249.7 and landed

Five things worth carrying:

1. **The route to the split is the correction block above**, and the item it
   came out of was owner-blocked, not browser-blocked. That is new.
2. **The banked claim reproduced by a different route.** 249.7 recorded "0
   hrefs; the 2 whole-page hits are shell chrome" from source; the built tree
   agrees exactly — 2 whole-page, 0 in the content region. Reconciling against
   something independent is what made it safe to build on.
3. **Then the base rate refuted the obvious fix, before anything changed.**
   1 of 55 pairs of that shape; symmetry is the exception at 29.9%; hubs
   (in-degree `data-table` 16, `form` 15) make most asymmetry correct. Two
   candidate gates refused, one at 29.9% and one at 100%.
4. **The anchor is what makes the instrument able to fail.** Whole-page, every
   built page links all 43 components from the sidebar — the same uniformly-true
   predicate 249.6's own note records, and the same shape as 249.18's badge-class
   anchor. The one page with no content region is `/components/nav`, the
   registered redirect Slice 261 found; a redirect stub having none is the right
   answer, not a gap.
5. **A committed report script was refused**, with the reason: the repo's
   not-a-gate reports each earn their place by a Standardize lane that runs
   them, and `LOOPS.md` says outright the lane is the only thing keeping one
   from rotting. The durable form is the command written beside the claim.

**Not verified, and named rather than implied:** cloud wake, so the 1440/390
light-and-dark screenshot lane could not run. Unlike the last two wakes this
change IS visible prose — a second `<strong>Not …</strong>` clause in
`/components/dropdown`'s opener plus one `Related` badge. `check:layout` (127
pages at 390 and 150% zoom), `check:scroll` (912 containers × 2 widths) and
`test:axe` (127 pages × 2 widths) are green over it, and those assert
properties, not pixels — **whether the longer opener reads well at 390px is
unverified.** All 17 cloud-toolchain entry points green, re-derived from
`ci.yml`, plus the `DOCS_BASE=/busy-office-ui` parity build, whose
base-stripping branch was **confirmed exercised** (4 prefixed
`/busy-office-ui/components/combobox` hrefs on the built page, no unprefixed
variant) rather than merely green.
