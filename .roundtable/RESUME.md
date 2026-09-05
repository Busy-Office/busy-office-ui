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
at hand-off. Two commits this wake, both pushed: the `278.5` slice and this
hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ RULE 4 HAS NOTHING LEFT FOR A CLOUD WAKE — Slice 278 closed completely

This is the first hand-off in six wakes that cannot name a cloud-takeable item.
`278.5` was the last one, and it landed. **Every one of the 12 remaining open
items is owner-blocked or browser-blocked in the screenshot sense** — see the
classification below, re-derived this wake from each item's own text.

So the next cloud wake most likely falls through rule 4 to rule 5 (**STALE**,
report as *could not be evaluated*, never clear) and then rule 6 (Polish). Run
`python3 scripts/loops/polish_requeue.py --apply` first — it needs
`behaviors.json` as well as `api.json`, so `npm run build -w @busy-office/ui`
comes first or it exits naming the command.

**A LOCAL wake has three items waiting that a cloud wake cannot take**:
`249.6`, `249.9`, `249.15`. Each has had its cloud-takeable half already
measured and banked in its own item text, so a local wake picking one up should
not re-derive it.

## The counters, read right after this wake's recording

Read immediately after `record_iteration.py`, so it is a snapshot — and this is
the comparison `LOOPS.md` rule 3 asks for.

**Rule 2 moved and rule 3 did not, and THAT is the agreement.** Rule 3 counts
**slices**, not items: `278` was already in its list from last wake, and this
wake closed an item *inside* that same slice. A rule-3 move here would have been
the finding.

- **Rule 2 (Standardize)** `2 / 4 … ok` at dispatch → **`3 / 4 … ok`**. One more
  Continue round and Standardize preempts the queued build item.
- **Rule 3 (Objective)** `2 / 3 … ok [274, 278]` at dispatch → **unchanged**.
  One newly-closed slice and rule 3 fires.
- **Rule 5 (Optimize)** read **STALE** (`2 wake-date(s) newer`) at Step 0b.
  Report it *could not be evaluated*, never clear.
- **Rules 6-8 were NOT EVALUATED**, because rule 4 matched. A rule below a match
  is unreached, not clear. Polish did NOT run this wake.

## The open set is 12, and NONE of it is cloud-takeable

Re-read from `ROADMAP.md` after this wake's commit, and **every line
re-classified from the item's own text** rather than carried over, per
`LOOPS.md` 186.2:

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md      # 12  (was 13 at dispatch)
python3 scripts/loops/roadmap_scope.py        # OPEN: [15, 112, 249, 273]
```

- **owner-blocked (9):** Slice 15 (AT runtime evidence, owner hardware), `112.3`
  (owner briefs) and `112.4` (blocked on 112.3's verdict), `249.7` (its own text
  holds the cost question until the owner answers `249.10`), `249.10`, `249.11`,
  `249.12`, `249.13` (each says **OWNER CALL** in its own line), and `273.2`.
- **browser-blocked in the SCREENSHOT sense** (`ENVIRONMENT.md`'s FIRST list — a
  LOCAL wake can take these, a cloud wake cannot): `249.6`, `249.9`, `249.15`.
- **agent-blocked:** none.
- **partly takeable:** none — `278.5` was the last, and it landed this wake.

## What landed this wake

**Dispatched by rule 4 (Continue, build mode).** Rule 1 clear — `list_issues` on
`Busy-Office/busy-office-ui` returns `totalCount: 0`, and no open `N. [ ]` item
is a P0. Step 1 triaged and committed nothing: no new input.

**Step 0 hit trap 1 for the fourteenth wake running** (detached HEAD at
`097abe9`, `git branch --show-current` empty), fixed with
`git checkout -B main origin/main` before any commit; `origin/main` arrived as a
**forced update** (`26447ba...097abe9`), Step 0c's collision mechanic visible.
Trap 2 clean in one `--unshallow` (**1,897** commits, no `shallow.lock`) — and
**this time `--unshallow` brought all seven tags with it**, so the separate
`git fetch --tags origin` was not needed. `ENVIRONMENT.md` §2 says it does NOT
bring them; that held on 2026-09-03 and did not here, so **verify with
`git tag | wc -l` rather than trusting either reading**. The Step 0c re-fetch
before the first commit reported no movement — no second dispatcher.

**`278.5` closed by its Accept's first branch.** The Columns demo shipped the
multi-select dropdown's markup without the behavior that makes it one:
`initDataTables(); initTableToolbar(); initDataGrid();` and no `initDropdowns()`.

**The reported measurement was re-taken before building and reproduced
exactly** — menu at `(0,0)`, invoker at `left 265, top 369-405`, so **−404px**
vertically and **−265px** horizontally from where it belongs, and the trigger
read `"Columns"` with two of three boxes checked. After: **dTop 4, dLeft 0**,
trigger `"Columns (2)"`. The toolbar behavior's own half worked before and
after (unchecking `vendor` hides its 4 cells either way) — the two behaviors
are genuinely separate, as `table-toolbar.ts`'s header says.

**The gate carries no pixel literal, deliberately.** *"The same multi-select
dropdown pattern as elsewhere"* is taken literally: the reference is
`/components/dropdown`'s own plain multi-select (`#demo-cc`) measured live in
the same browser, and this menu must reproduce its offset from its own invoker.
**The reference has its own absolute control** (below its invoker, on screen) —
without it, "both at `(0,0)`" would agree with itself and pass. A gap constant
lifted out of `popover-position.ts` was refused as a substring assertion on
source.

**Red-proved twice, and the second one is worth carrying forward.** Neutralising
the `initDropdowns` call in the page's own entry chunk (exactly 1 match, call
confirmed absent, module still parsing) turned **exactly 1 of 167** red.
Forcing the checked count to `0` in the SHARED dropdown chunk turned **2** red —
this case and *"filter panel: … counts in text"*. **That is a true positive, not
the too-broad failure mode**: both cases genuinely assert the count, and the
discriminator is that the other three `table-toolbar` cases stayed green. The
too-broad mode is a module that stops PARSING and drags unrelated cases with it.

**All 17 cloud-toolchain entry points ran green**, with the list re-derived from
`ci.yml` rather than trusted — it still matches `ENVIRONMENT.md`'s in the two
documented, opposite-direction ways. `check:claims` reports **167** live, up
from the 166 the last hand-off recorded — the one case this wake added. Its
*"3 NOT VERIFIED"* is `ENVIRONMENT.md` 6b, not a regression.

**One thing in this diff renders, and it is named as UNVERIFIED.** **0** CSS
files changed and the menu now uses the same shipped `positionPopover` path as
nine other docs pages, but the caption gains prose so the page reflows, and a
cloud wake has no 1440/390 light-and-dark lane. Whether the menu *looks* right
against the toolbar in dark theme is the half a LOCAL wake still owns. What
*is* verified: `check:layout` (127 pages), `check:scroll` (914 containers x 2
widths) and `test:axe` (127 pages x 2 widths, zero violations).

**`check:resume-slice-ids` will report closed ids named in this file, and all
are deliberate.** `278.5`, `278.1`, `278.3`, `278.4`, `278.6` and `249.17` are
named as history or as classification evidence, not as queued work. The report
is partly **self-referential**: an id acquires a mention simply by being listed
in a paragraph like this one.

## Direction

Nothing new from the owner this wake; GitHub intake is empty (`list_issues` →
`totalCount: 0`). The standing owner blocks are unchanged: Slice 15's AT runtime
evidence (owner hardware), `112.3`/`112.4` (owner briefs, then 112.3's verdict),
and `249.7`, `249.10`-`249.13`.

**Two things want the owner's attention:**

1. **The cloud lane has run dry, and that is new.** For the first time in six
   wakes there is no cloud-takeable open item — `278.5` was the last one and it
   landed. The loop is not stuck (rule 6 will keep dispatching Polish), but the
   work that has produced this wake's and the last two wakes' real shipped
   defects came from **rule 4 items the loop filed for itself**, not from
   Polish. Unblocking any one of `249.10`-`249.13` (each a short **OWNER CALL**)
   would refill the lane; `249.12` in particular says *"OWNER OR ARCHITECTURE
   CALL"*, so it may not need the owner at all.

2. **`273.2` is still the owner call worth their attention**, untouched for a
   seventh wake. `LOOPS.md` §3b step 5 mandates `dry++` on a Polish round whose
   score does not move; no round has ever done it. **This wake does not change
   the tally** — Polish did not run at all (rule 4 matched) — but it does
   **correct** it: the tally is **9 NO-OP rounds, 7 of which filed a real
   defect found elsewhere**, and `273.2`'s own text still read **8 and 6**,
   one short since `inline-editing` filed 276 on 2026-09-05. Amended in place
   with its instrument
   (`grep -cE '^## Round .*NO-OP' .roundtable/polish-state.md` → 9,
   reconciled against the ledger's table rows), because it is the exact figure
   the owner is being asked to decide on. The ratio moved 6/8 → 7/9 and the
   argument is unchanged. Executing the rule as written would still retire
   surfaces and empty a lane **176.3 already refused to narrow**.

**Worth pointing at, and now three for three:** `278.5` is the third shipped
defect in as many wakes found by the same question — *do two behaviors
documented as a pair actually talk?* (`278.1` and `278.4` were the first two,
all three on this one surface). Every one was invisible to every gate that
existed. Other documented behavior pairs are the obvious next place to ask it.

## `bundle-gz-kb` still cannot be sampled — twenty-third wake

259.1's rule-5 finding, re-verified this wake rather than re-derived:

```
grep -rln 'bundle-gz-kb' --include='*.mjs' --include='*.py' --include='*.ts' \
  --include='*.js' --include='*.json' . | grep -v node_modules
```

still returns exactly **one** file — `scripts/loops/record_metric.py` — and the
hit is its **docstring example** at line 6, `--value 7.0`. Nothing derives the
number. Do not "fix" rule 5's staleness by recording a guessed value.
