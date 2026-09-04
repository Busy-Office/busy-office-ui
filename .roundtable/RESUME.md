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
at hand-off. Two commits this wake, both pushed: Slice 260 and this hand-off.

**`check:resume-slice-ids` reports three closed ids, and all three are
deliberate.** It names `249.17`, `249.16` and `249.4`: the first is *what this
wake closed*, the other two are the 2026-09-03 split this wake took as its
precedent. The live open set is `249.6`, `249.7`, `249.9`, `249.10`-`249.13`,
`249.15`, plus Slice 15 and `112.3`/`112.4`. Nothing here queues or blocks on a
closed id.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## Direction

Nothing new from the owner this wake, and nothing owner-facing is newly
blocked. GitHub intake is empty (`list_issues` → `totalCount: 0`). The two
standing owner blocks are unchanged: Slice 15's `AT runtime evidence` (owner
hardware) and `112.3`/`112.4` (owner briefs, then 112.3's verdict).

What landed needs no owner decision. It does, however, make a user-facing
change to what the published site emits — every page now carries `og:`/
`twitter:` tags — which the owner may want to eyeball once Pages redeploys.

## ⚠ The correction most likely to be re-broken

**A "browser-blocked" classification is per-EVIDENCE, not per-item, and this
wake found one item where the two halves differ.** `249.15` was carried by
three consecutive hand-offs as browser-blocked in the screenshot sense — true of
its card IMAGE, false of its `og:`/`twitter:` TAGS, which are `<head>` content
in the built artifact and squarely on `ENVIRONMENT.md`'s SECOND list. Split as
`249.17` and landed in a single cloud wake.

This is 186.2's own lesson arriving one level down. That rule fixed
*"all open items are blocked"* by making a wake say WHICH KIND. The next
mis-sort is a wake saying which kind **for the item as a whole**, when the item
bundles two kinds of evidence. `249.16` out of `249.4` (2026-09-03) was the same
split; this is the second in two days, so treat it as a shape rather than a
coincidence.

**Before declining an item as browser-blocked, ask what each CLAUSE of its
Accept needs.** `249.15`'s Accept named six things and exactly two of them —
the image existing, and whether the card looks right — needed a human's eyes.

**`bundle-gz-kb` still cannot be sampled, and the reason is unchanged from last
wake** (259.1's rule-5 finding, re-verified this wake, not re-derived):

```
grep -rln 'bundle-gz-kb' --include='*.mjs' --include='*.py' --include='*.ts' \
  --include='*.js' --include='*.json' . | grep -v node_modules
```

still returns exactly **one** file — `scripts/loops/record_metric.py` — and the
hit is its **docstring example**, `--value 7.0`. Nothing derives the number.
Do not "fix" rule 5's staleness by recording a guessed value. The fix is to
write the derivation command next to the name, which is a loop-script change
and wants its own dispatch.

## Dispatch counters at hand-off

Read `dispatch_status.py` yourself — the sets below are snapshots.

- **Rule 2 (Standardize)** reads `2 / 4` — this wake ran one Continue round.
- **Rule 3 (Objective)** reads `1 / 3`, naming `[249]`. Read after recording,
  per `LOOPS.md`'s instruction that this counter is only ever caught by a
  number disagreeing with something a human just wrote down: this wake's row
  begins `249.17`, so `SLICE_TOP` attributes it to 249 while the slice it
  closed is 260. **Same disagreement the last hand-off recorded, same verdict —
  recorded, not fixed**; `LOOPS.md` rule 3 refuses a sixth regex over that
  parser and nothing downstream reads the attribution.
- **Rule 5 (Optimize) reads STALE, `1 wake-date(s) newer`** — unchanged from
  wake start, because this wake's rows land on 2026-09-04, a date already
  counted. `LOOPS.md` rule 5 is explicit that STALE means the rule has no input
  and must be reported as *could not be evaluated*; it was reported that way.

## Next wake

**Rule 4 (Continue, build mode) is again the first rule that can fire** — rules
1-3 are clear at hand-off and rule 5 is not a dispatch rule. Re-run
`dispatch_status.py`; this is a snapshot.

Rule 4's open set is `OPEN: [15, 112, 249]`, **11** open items, unchanged in
count: 249.17 was filed already closed. Classifications re-read against
`ROADMAP.md` this wake, in the shape `LOOPS.md` 186.2 requires — per item, not
for the backlog as a whole:

- Slice 15's `AT runtime evidence` and `112.3`/`112.4` are **owner-blocked**.
- **`249.6`, `249.9`, `249.15` are browser-blocked in the SCREENSHOT sense** —
  a LOCAL wake can take them; a cloud wake should not. Each now has its cloud-
  takeable measurement already banked in the item, so none should be
  re-derived: 249.6 has the six-row terminal-page table, 249.9 has both cost
  routes and the badge audit, 249.15 has the before/after tag counts and the
  gate arm that will hold its `og:image` clause.
- **`249.7` is open as a COST question, not unstarted work.** Its Accept's
  first clause is executed — 4 of 5 seed rows do not reproduce, table is in the
  item. Do not re-run that grep. Settling it before the owner answers `249.10`
  decides it on the thinnest input.
- `249.10`, `249.11`, `249.13` are owner calls; `249.12` is owner-or-
  architecture, low urgency and carries **no Accept criteria**, so it cannot be
  dispatched as written — giving it one is itself a triage-sized task.

**So a cloud wake reaching rule 4 next again has no clearly cloud-takeable item
in the 249 set** — but read that against the correction block above before
believing it, because that is exactly what the last three hand-offs said about
`249.15`. Ask what each CLAUSE of an Accept needs, not what the item is labelled.

## The archive sweep: not due, do not re-raise

`roadmap_scope.py` reads closed-history share **1,624 / 4,257 = 38.1%** at
hand-off — well under the **55.1%** at which 252.1 dispatched the tenth sweep on
2026-09-03. It read 35.7% at wake start; the share rose because Slice 260 closed
*fully*, so its whole body is closed history the moment it lands. That is
arithmetic, not a backlog signal — the same mechanism the last four hand-offs
recorded, now five wakes running. Eligible targets
`[260, 259, 258, 257, 256, 255, 254, 253, 252, 237]`, of which 253, 237 and now
260 are named by the still-open Slice 249 and stay per 236.2. Re-run the script;
snapshots.

## What landed this wake

**One commit of substance, dispatched by rule 4 (Continue, build mode).** Rule 1
clear (no open P0; GitHub intake `totalCount: 0`); Step 1 triaged and committed
nothing — no new input.

### Slice 260 — 249.15's tag half split out as 249.17 and landed

Four things worth carrying:

1. **The split is the finding.** See the correction block above.
2. **The three EQUALITIES are what make arm 5 able to fail**, not its eight
   presence checks: `og:title === <title>`, `og:description ===` the page's own
   description, and `og:url ===` the URL `dist-pages.mjs` derives by walking
   `dist/`. A presence check over eight tag names passes in full on a site
   where every page claims to be the home page — arm 2's failure mode exactly.
   133 → **1,022** assertions across 127 pages; 0 → **127** of 138 built
   `index.html` carry the tags, the 11 uncovered being the 10 redirect stubs
   and `suite/`.
3. **Red-proved four ways, and the FIFTH came back green because the injection
   was wrong** — a guessed page title (`Buttons ·` for `Button ·`). It cost
   nothing only because the probe asserted its match count before replacing and
   raised on `0`. Assert before replacing; never let a replace silently match
   nothing.
4. **An `import` after a non-import statement in Astro frontmatter corrupts the
   file**, and esbuild reports it at a line inside an unrelated CSS comment.
   Added to `ENVIRONMENT.md` with the diagnosis command, along with its sibling:
   the re-placement then landed an import inside `index.astro`'s copy-paste
   template literal, the third time that has happened here.

**Not verified, and named rather than implied:** cloud wake, so the 1440/390
light-and-dark screenshot lane could not run. The diff adds `<head>` content and
touches **0** files under `packages/core/src/css/`, no visible markup and no
layout; `check:layout`, `check:scroll` and `test:axe` swept all 127 pages at
both widths green. All 15 cloud-toolchain gates green, plus the
`DOCS_BASE=/busy-office-ui` parity build this change specifically needed —
`og:url` carries the base there, which is what `pages.yml` ships. Built page
count unchanged at **138**.
