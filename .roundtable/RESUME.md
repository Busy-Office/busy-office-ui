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
at hand-off. Two commits this wake, both pushed: the `278.3`/`278.4`/`278.6`
slice and this hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ THE LAST HAND-OFF NAMED THE WRONG OLDEST ITEM — check rule 4's ordering yourself

The previous hand-off said *"the oldest item rule 4 can actually take is
`278.4`"*. It is not: **`278.3` precedes it** in `ROADMAP.md`, was filed in the
same commit, and was cloud-takeable — the hand-off had picked the one it judged
most worth taking, which is not what rule 4 says. This wake dispatched `278.3`
on file order and stated that as its discriminator. **Rule 4's ordering is a
property of the file, not a judgement**; when two items are filed in one commit,
their order in `ROADMAP.md` is the tiebreak.

That correction is not academic — `278.3`'s Accept is what pulled in the other
two items this wake closed.

## The counters, read right after this wake's recording

Read immediately after `record_iteration.py`, so it is a snapshot — and this is
the comparison `LOOPS.md` rule 3 asks for.

**Both counters MOVED, and that is the agreement, not drift**: this wake's row
is a `Continue` row, and 161.4's list says `Continue` closes a slice. A counter
that had stayed put here would have been the finding.

- **Rule 2 (Standardize)** `1 / 4 … ok` at dispatch → **`2 / 4 … ok`**. Two more
  Continue rounds and Standardize preempts the queued build item.
- **Rule 3 (Objective)** `1 / 3 … ok [274]` at dispatch → **`2 / 3 … ok
  [274, 278]`**. One more closed slice and rule 3 fires — so the wake after next
  is likely an Objective grill, not a build.
- **Rule 5 (Optimize)** read **STALE** (`2 wake-date(s) newer`) at Step 0b.
  Report it *could not be evaluated*, never clear.
- **Rules 6-8 were NOT EVALUATED**, because rule 4 matched. A rule below a match
  is unreached, not clear. Polish did NOT run this wake.

## The open set is 13, and ONE of it is cloud-takeable-with-a-caveat

Re-read from `ROADMAP.md` after this wake's commit, and **every line
re-classified from the item's own text** rather than carried over, per
`LOOPS.md` 186.2:

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md      # 13  (was 16 at dispatch)
python3 scripts/loops/roadmap_scope.py        # OPEN: [15, 112, 249, 273, 278]
```

- **owner-blocked (9):** Slice 15 (AT runtime evidence, owner hardware), `112.3`
  (owner briefs) and `112.4` (blocked on 112.3's verdict), `249.7` (its own text
  holds the cost question until the owner answers `249.10`), `249.10`, `249.11`,
  `249.12`, `249.13` (each says **OWNER CALL** in its own line), and `273.2`.
- **browser-blocked in the SCREENSHOT sense** (`ENVIRONMENT.md`'s FIRST list — a
  LOCAL wake can take these, a cloud wake cannot): `249.6`, `249.9`, `249.15`.
- **agent-blocked:** none.
- **partly takeable (1):** **`278.5`** — the Columns demo never calls
  `initDropdowns()`, so the menu renders at the viewport corner instead of under
  its invoker. The *geometry* is `ENVIRONMENT.md`'s SECOND list and a cloud wake
  can measure it; the *fix moves a menu on screen*, which is the first list. Its
  own item text says so. A local wake should take it; a cloud wake taking it must
  say which half it verified.

So the next cloud wake most likely falls through rule 4 to rule 5 (STALE, cannot
be evaluated) and then rule 6 (Polish). Run `polish_requeue.py --apply` first —
it needs `behaviors.json` as well as `api.json`, so
`npm run build -w @busy-office/ui` comes first or it exits naming the command.

## What landed this wake

**Dispatched by rule 4 (Continue, build mode).** Rule 1 clear — `list_issues` on
`Busy-Office/busy-office-ui` returns `totalCount: 0`, and no open `N. [ ]` item
is a P0. Step 1 triaged and committed nothing: no new input.

**Step 0 hit trap 1 for the thirteenth wake running** (detached HEAD at
`16a95a0`, `git branch --show-current` empty), fixed with
`git checkout -B main origin/main` before any commit; `origin/main` arrived as a
**forced update** (`26447ba...16a95a0`), Step 0c's collision mechanic visible.
Trap 2 clean in one `--unshallow` (**1,895** commits, no `shallow.lock`);
`git fetch --tags origin` brought all seven. The Step 0c re-fetch before the
first commit reported no movement — no second dispatcher.

**Three items closed on one surface: `278.3`, `278.4`, `278.6`.** They are one
item's worth of work because `278.3`'s Accept is written over *every runtime
sentence on the page*, and two of those sentences disagreed with the shipped
module. The Accept was satisfied rather than narrowed; the scope trap is
recorded in the item.

- **`278.3`** — a `check:claims` case CAN assert the hidden-column/grid
  composition without wiring the demos together: the gate composes the markup
  itself on the page's own already-initialised modules (tags `#grid-nav-demo`'s
  cells with `data-col`, prepends a `[data-col-toggle]` box to its container).
  278.1's refusal stands; nothing the reader sees changed.
- **`278.4`** — a shipped **accessibility defect**, fixed: a select-all left
  every row reporting `aria-selected="false"` while all were checked, on a grid
  the same module marks `aria-multiselectable="true"`. Reproduced on both
  documented routes first, then fixed in `data-grid.ts`.
- **`278.6`** — the opener's cost argument was the OPPOSITE of what ships
  (measured: 12 cells → **1** tab stop; 4 interactive descendants → **0** in the
  Tab sequence). Rewritten to state the real trade, and now executable.

**⚠ THE FIRST FIX FOR `278.4` WAS WRONG AND ITS PROBE SAID IT WAS RIGHT.**
`queueMicrotask` was used to defer past the container listener, and a probe
reported it running last. The probe drove the control with `el.click()`. Under a
**trusted** click the browser drives dispatch from native code, the JS stack
empties *between* listeners, and the microtask runs mid-dispatch on the stale
state; under `el.click()` the whole dispatch is one JS frame and it genuinely
runs last. The mechanism was built, shipped into `dist`, and only caught because
the gate uses `page.click`. Fixed with `setTimeout(…, 0)`. **The general form is
now a durable bullet in `ENVIRONMENT.md`** — it will bite again.

**Four injections red-proved, each confirmed absent from the artifact after the
write, each replacing exactly one match.** The artifact is the chunk the page's
own entry script names (`apps/docs/dist/_astro/table-toolbar.*.js`), never
`dist/js/index.js` — the re-export barrel 278.1 caught being a dead instrument.
**One injection was itself defective and is recorded**: it deleted the whole
false branch of a minified ternary, the module stopped parsing, and **four**
cases went red instead of one. A red-proof that goes red too broadly certifies
nothing, the same as one that stays green.

**Two of this wake's own cited numbers were wrong before commit and are
corrected in place**: `grep -c -F data-col-toggle` reads **1**, not 2 (`-c`
counts lines), and the opener's growth is **6 insertions / 3 deletions**, not
"4 lines to 7". Both were caught by re-running the command instead of quoting
the estimate.

**All 17 cloud-toolchain entry points ran green**, with the list re-derived from
`ci.yml` rather than trusted — it still matches `ENVIRONMENT.md`'s in the two
documented, opposite-direction ways (`check:ci-ignores` is a sub-check of
`check:repo`; `npm run test -w @busy-office/ui` is CI's
`npx vitest run --root packages/core`). `check:claims` reports **166** live, up
from the 163 the last hand-off recorded — the three cases this wake added,
observed one at a time (165 after two, 166 after the third). Its *"3 NOT
VERIFIED"* is `ENVIRONMENT.md` 6b, not a regression.

**One thing in this diff renders, and it is named as UNVERIFIED.** **0** CSS
files changed, but `table-toolbar.astro`'s opener gains three lines of prose, so
the page reflows and **that reflow was NOT checked visually** — a cloud wake has
no 1440/390 light-and-dark lane. What *is* verified: `check:layout` and
`check:scroll` sweep every page at both widths, and `test:axe` reports zero
violations.

**`check:resume-slice-ids` will report closed ids named in this file, and all
are deliberate.** `278.1`, `278.3`, `278.4`, `278.6`, `249.17` and the other
`249.x` ids are named as history or as classification evidence, not as queued
work. The report is partly **self-referential**: an id acquires a mention simply
by being listed in a paragraph like this one.

## Direction

Nothing new from the owner this wake; GitHub intake is empty (`list_issues` →
`totalCount: 0`). The standing owner blocks are unchanged: Slice 15's AT runtime
evidence (owner hardware), `112.3`/`112.4` (owner briefs, then 112.3's verdict),
and `249.7`, `249.10`-`249.13`.

**One thing wants the owner's attention, and it is the same one as the last five
wakes — which is itself the signal:**

1. **`273.2` is still the owner call worth their attention**, untouched for a
   sixth wake. `LOOPS.md` §3b step 5 mandates `dry++` on a Polish round whose
   score does not move; no round has ever done it. **This wake does not change
   the tally** — Polish did not run at all (rule 4 matched), so the count stays
   at **9 NO-OP rounds, 7 of which filed a real defect found elsewhere**.
   Executing the rule as written would retire surfaces and empty a lane
   **176.3 already refused to narrow**.

2. **Not a blocker, but worth the owner knowing: the loop is now generating its
   own cloud-takeable work, and it is finding real shipped defects.** `278.4` is
   the second shipped accessibility defect in two wakes (`278.1` was the first),
   both on the same surface, both found by the same question — *do two behaviors
   documented as a pair actually talk?* Neither was reachable by any gate that
   existed. That question is worth pointing at other documented pairs.

## `bundle-gz-kb` still cannot be sampled — twenty-second wake

259.1's rule-5 finding, re-verified this wake rather than re-derived:

```
grep -rln 'bundle-gz-kb' --include='*.mjs' --include='*.py' --include='*.ts' \
  --include='*.js' --include='*.json' . | grep -v node_modules
```

still returns exactly **one** file — `scripts/loops/record_metric.py` — and the
hit is its **docstring example** at line 6, `--value 7.0`. Nothing derives the
number. Do not "fix" rule 5's staleness by recording a guessed value.
