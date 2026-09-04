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
at hand-off. Two commits this wake, both pushed: Slice 265 and this hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

The live open set is `249.6`, `249.7`, `249.9`, `249.10`-`249.13`, `249.15`,
plus Slice 15 and `112.3`/`112.4` — **11 open, unchanged**, because Slice 265's
three items were all filed already closed, the way 263.1 and 264's item were.

**`check:resume-slice-ids` will report six closed ids named below, and all are
deliberate** — `263.1`, `265.1`, `265.2`, `265.3`, `249.18`, `249.20` appear
here only as history. Nothing here queues or blocks on a closed id.

## ⚠ THE FIRST RULE THAT FIRES NEXT WAKE IS RULE 4 — re-run it, this is a snapshot

`dispatch_status.py` read this immediately after the wake recorded:

- **Rule 2 (Standardize)** `1 / 4 Continue round … ok` — this wake ran
  **Objective**, so it added no Continue round and the counter did not move.
- **Rule 3 (Objective)** `0 / 3 slices … ok` — reset by this wake's own row.
- **Rule 5 (Optimize)** `1 wake-date(s) newer … STALE` — no input, so it is
  *could not be evaluated*, not clear. Do not "fix" that by recording a guessed
  value (see the bottom of this file).

So the next wake reaches **rule 4** — and every open item is blocked, in the
kinds classified below. A cloud wake reaching it should say which kind rather
than reporting "all blocked", per `LOOPS.md` 186.2.

Rule 3's attribution agreed with the slice again, because the `--item` string
began `Slice 265`; that is the third row running where starting with the slice
number made `SLICE_TOP` read correctly.

## ⚠ The correction most likely to be re-broken

**A census of the answers cannot find the question that has none.** 263.1's
Accept counted *entity decoders in `apps/docs/scripts`* and correctly found one
— and could not see `pattern-extract.mjs`, which needed to decode and did not,
publishing a page's SOURCE spelling into `patterns.json`. One label reached a
reader: `/patterns/` showed `Dashboard &amp; widgets` as visible text.

The property that finds that class of gap is **downstream, about the artefact**:
*does any text this directory PUBLISHES still carry the spelling of its source?*
It is now a gate — `check-escaped-entities.mjs`, the 53rd, `@heuristic` — and
it is the surface watch, not a completeness claim.

**Seven entity references still sit in `patterns.json`/`patterns-index.json`**
(`&mdash;` `&rsquo;` `&times;` `&minus;` — names `html-entities.mjs`
deliberately leaves verbatim). None renders anywhere today, and the reason is a
**length, not an assertion**: the one inside an opener is at index 317 of an
855-character string that `gen-llms.mjs` truncates at 220. Reword that opener
and it surfaces. Widening `NAMED` was measured and refused — and note *why the
first argument against widening was wrong*, because a later wake will reach for
it too: code samples carry `&#x26;mdash;` in the built page, which a one-pass
decoder leaves as `&mdash;` either way. The real risk is unescaped live content
like `<span class="bo-amount__unit">&times; EA</span>`.

**And the standing shape, third grill running:** the claim a slice spends its
red-proof on is the one that holds; the claims it ships **alongside** go out on
credibility. Both of this wake's defects were beside the finding — a gate's WHY
header still naming `sidebar-nav initAnchorNav` and "19 components" after the
same slice corrected that declaration to `@serves none`, and a `@serves none`
reason saying `data-anchor-nav` is on one page when the built tree has two.

## Direction

Nothing new from the owner this wake, and nothing owner-facing is newly
blocked. GitHub intake is empty (`list_issues` → `totalCount: 0`). The two
standing owner blocks are unchanged: Slice 15's `AT runtime evidence` (owner
hardware) and `112.3`/`112.4` (owner briefs, then 112.3's verdict).

**Rule 4's open set, classified by WHICH KIND of blocked** (`LOOPS.md` 186.2's
vocabulary), unchanged from the previous hand-off and re-read rather than
copied:

- **owner-blocked:** Slice 15, `112.3`, `112.4`, `249.10`, `249.11`, `249.12`,
  `249.13` — and `249.7`, a cost question its own text says should not be
  settled before the owner answers `249.10`.
- **browser-blocked in the SCREENSHOT sense** (`ENVIRONMENT.md`'s FIRST list —
  a LOCAL wake can take these): `249.6`, `249.9`, `249.15`.
- **agent-blocked:** none.

`249.9`'s remaining clause is the catalogue PAGE, whose point is rendered
miniatures; its two data halves landed as `249.18` and `249.20`.

**What landed needs no owner decision.** One badge's text on one docs page, two
source comments, and one new gate.

## The archive sweep: not due, do not re-raise

`roadmap_scope.py` reads closed-history share **2,535 / 5,329 = 47.6%** at
hand-off (45.3% at wake start), under the **55.1%** at which 252.1 dispatched
the tenth sweep on 2026-09-03. The rise is arithmetic, not a backlog signal:
Slice 265 closed fully, so its whole body is closed history the moment it lands
— the same mechanic 264 recorded. **Re-run the script rather than quoting this
line**; nine wakes running now. Note `roadmap_scope.py` also reports **4
targets NAMED by the still-open Slice 249** (253, 262, 237, 260) which stay put
per 236.2.

## What landed this wake

**Dispatched by rule 3 (Objective).** Rule 1 clear (no open P0; GitHub intake
`totalCount: 0`); Step 1 triaged and committed nothing — no new input. Rule 2
read `1 / 4 … ok`; rule 3 read `3 / 3 … OVERDUE [249, 263, 264]`, exactly as the
previous hand-off predicted. Step 0 hit **trap 1** again — the container started
DETACHED on `fbca625` with no local branch — fixed with
`git checkout -B main origin/main` before any work. `--unshallow` was clean in
one attempt (**1,861** commits) and brought all seven tags, so trap 2 did not
bite.

### Slice 265 — Objective grill of 263 and 264

Report: `.roundtable/grill-objective-263-264-2026-09-04.md`. Five things worth
carrying:

1. **Scope was narrowed, not inherited.** The armed set named `249` for the
   sixth wake running; it is an open umbrella already grilled whole and again
   per item, so it was dropped except as the parent of what 264 built.
2. **16 of 17 re-derived numbers held**, across both slices — 264's whole
   derivation table, its 40 cells / 39 pages / 19 non-default rows / 52
   whole-page reading, 263's `check-*` walk scope and its 40-blocks-0-entities
   base rate.
3. **My own first instrument was wrong**, as the base rate predicts: reading
   hooks off `behaviors.json.exports` (an array of strings) reported **0**
   distinct hooks and `0/40` for both intersections. A plain zero is a defect
   in the instrument until proven otherwise; corrected, it matched to the unit.
4. **Both defects were beside the finding**, not in it — see the correction
   block above.
5. **The new gate was base-rated before being written** (false of one real page
   an hour earlier) and red-proved twice, the stronger proof being against the
   **kept pre-fix artefact** rather than a synthetic injection.

**Not verified, and named rather than implied:** cloud wake, so the 1440/390
light-and-dark screenshot lane could not run. **0** files under
`packages/core/src/css/` changed; the one visual change is a single badge's text
on `/patterns/`, established by a whole-tree `dist/` diff (9 paths differ:
`build-id.json`, six pagefind index files, and that page — all **138** other
built `index.html` byte-identical) and by a DOM read of all 127 pages. Both
cover more than a screenshot of one viewport would.

**`bundle-gz-kb` still cannot be sampled, unchanged for a sixth wake**
(259.1's rule-5 finding, re-verified rather than re-derived):

```
grep -rln 'bundle-gz-kb' --include='*.mjs' --include='*.py' --include='*.ts' \
  --include='*.js' --include='*.json' . | grep -v node_modules
```

still returns exactly **one** file — `scripts/loops/record_metric.py` — and the
hit is its **docstring example**, `--value 7.0`. Nothing derives the number. Do
not "fix" rule 5's staleness by recording a guessed value.
