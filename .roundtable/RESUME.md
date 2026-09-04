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
at hand-off. Two commits this wake, both pushed: Slice 263 and this hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

The live open set is `249.6`, `249.7`, `249.9`, `249.10`-`249.13`, `249.15`,
plus Slice 15 and `112.3`/`112.4` — **11 open, unchanged**, because 263.1 was
filed already closed. This wake dispatched **Standardize**, which closes a
slice without touching the build queue.

**`check:resume-slice-ids` reports five closed ids, and all five are
deliberate.** Read from the check's own output rather than counted by hand, it
names `249.16`, `249.4`, `249.17`, `249.18` and `249.19` — the per-EVIDENCE
split chain of the previous four wakes. They appear in this file **only** in
that quoted list, as history; nothing here queues or blocks on a closed id.

## ⚠ THE FIRST RULE THAT FIRES NEXT WAKE IS RULE 4

`dispatch_status.py` read this immediately after the wake recorded:

- **Rule 2 (Standardize)** `0 / 4 … ok` — this wake discharged it.
- **Rule 3 (Objective)** `2 / 3 … ok`, naming `[249, 263]`. One more closed
  slice arms it.
- **Rule 5 (Optimize)** `STALE, 1 wake-date(s) newer` — no input, so it is
  *could not be evaluated*, not clear.

So the next wake falls through to **rule 4, Continue, the oldest still-open
item**. Re-run `dispatch_status.py` yourself; the lines above are a snapshot.

**Rule 3's attribution agreed with the slice this time, after four hand-offs
of disagreement.** The previous four rows began with a `249.x` id while the
slice they closed was 256/260/261/262, so `SLICE_TOP` read 249. This wake's
row begins `Slice 263.1`, so the parser read **263**, which is the slice
closed. That is not a fix to the parser — it is the row text agreeing with it.
**If you want the counter to attribute correctly, start the `--item` string
with the slice number the row closes.** Recorded as an observation from one
row, not a rule.

## ⚠ The correction most likely to be re-broken

**The Standardize finding has now come from step 1's READING instruction twice
running, not from any of the five lanes** — 257.1 (the default-label rule
hand-copied into the scaffolder) and 263.1 (three HTML-entity decoders). Both
had the same defeating property: the copies carry **different names**, so no
name-collision scan at any width finds them. 257.1 measured lane 5's blind spot
at 69 of 158 definitions and refused to widen it because widening adds exactly
one group and it is a false positive; that refusal is re-affirmed here rather
than re-litigated.

**What actually works is a review habit, and it is worth carrying:** read
everything the newest slices added since the previous sweep
(`git diff --stat <last-sweep-commit>..HEAD -- ':!ROADMAP*.md' ':!.roundtable'
':!STATUS.md'` — 24 files this time), ask what job each new helper does, and
ask whether something already in the tree does that job. It is not a detector
and is not being converted into one: the checkable shape is semantic, which is
roadmap 94.11's standing verdict.

**And the first injection of this wake's red-proof came back GREEN, which was
a defect in the INJECTION.** Prefixing every decoded string with `INJECTED`
left `check:maturity` fully green, because its arms test whether a block
CONTAINS an expected string and a prefix does not disturb containment. A
constant-return injection discriminates (160 of 280 red). If you red-prove a
consumer whose assertions are containment-shaped, prefixing is not an
injection.

**`bundle-gz-kb` still cannot be sampled, and the reason is unchanged for a
fourth wake** (259.1's rule-5 finding, re-verified this wake, not re-derived):

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

What landed needs no owner decision and changes **no shipped byte**: the whole
`dist/` tree is identical before and after apart from `build-id.json`. There is
nothing here for a local wake to look at with its eyes.

**One thing is logged and not fixed, and it is a decision a later wake may
want to revisit:** `stripTags` is defined twice, byte-identically apart from
the `export` keyword — `apps/docs/scripts/pattern-extract.mjs:40` and
`packages/core/scripts/derive-readme-facts.mjs:98`. They sit on opposite sides
of the published-package boundary, and it is one line with no branch to diverge
in. Reopen if either copy grows a case the other lacks; the divergence is the
signal, not the count.

## The archive sweep: not due, do not re-raise

`roadmap_scope.py` reads closed-history share **2,150 / 4,907 = 43.8%** at
hand-off — under the **55.1%** at which 252.1 dispatched the tenth sweep on
2026-09-03. It read 40.9% at wake start; the share rose because Slice 263
closed *fully*, so its whole body is closed history the moment it lands. That
is arithmetic, not a backlog signal — eight wakes running now. Eligible targets
`[263, 262, 261, 260, 259, 258, 257, 256, 255, 254, 253, 252, 237]`, of which
the script names 4 as cited by a still-open item. Re-run the script; snapshots.

## What landed this wake

**One commit of substance, dispatched by rule 2 (Standardize, sweep).** Rule 1
clear (no open P0; GitHub intake `totalCount: 0`); Step 1 triaged and committed
nothing — no new input. Step 0c's pre-commit `git fetch origin main` showed
`origin/main` still at `7691dec3`, so no collision. Step 0 hit **trap 1**
again: the container started DETACHED, fixed with
`git checkout -B main origin/main` before any work. `--unshallow` was clean in
one attempt (**1,857** commits) and brought all seven tags with it, so trap 2
did not bite.

### Slice 263 — three HTML-entity decoders, disagreeing on 8 of 11 inputs

Five things worth carrying:

1. **All five lanes clean**, member for member where that is checkable: lane 1
   `0 dead / 1,433 live`; lane 2 `74 / 242 / 230 / 8` with all eight groups
   matching `LOOPS.md`'s settled table by member; lane 3 flagged-set of 15 with
   an empty `comm -23` against the 16-page verdicted set; lane 4 no accumulate
   class change; lane 5 the same two arity false positives.
2. **The finding is a chain of replaces that cannot be right in both
   directions.** `&#38;amp;` and `&amp;#38;` are mirror cases, and the fix one
   copy credited to a grill is precisely what makes it wrong on the other. One
   pass has neither bug.
3. **Three-consumer red-proof by injection into the shared module**, with the
   injection confirmed on the module before any verdict was believed, and one
   green result correctly diagnosed as a defective injection rather than as
   evidence.
4. **Output-neutrality proved against the RENDERED artefact**, not the diff:
   `dist/` removed and rebuilt, `diff -rq` over the whole tree names exactly
   one differing file (`build-id.json`).
5. **Four refusals recorded**, each with its measured reason — widening lane 5,
   a `--self-test` nothing would run, folding in `check-po-app.mjs`'s single
   `&amp;`, and consolidating the two `stripTags`.

**Not verified, and named rather than implied:** cloud wake, so the 1440/390
light-and-dark screenshot lane could not run. Nothing here rests on a rendered
image — **0** files under `packages/core/src/css/`, no docs page source, and
the whole-tree `dist/` diff is stronger evidence than a screenshot for a change
of this shape. All **17** cloud-toolchain entry points green, re-derived from
`ci.yml` this wake rather than read off the snapshot, plus the
`DOCS_BASE=/busy-office-ui` parity build, whose base branch was **confirmed
exercised** (6 prefixed `/busy-office-ui/components/` hrefs and a
base-carrying `og:url` on the built dropdown page) rather than merely green.
`check:claims` reports `162 verified live · 3 NOT VERIFIED` — ENVIRONMENT 6b's
container property (`pointer: fine` false), not a regression.
