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
at hand-off. Two commits this wake, both pushed: Slice 280 (the Objective
grill) and this hand-off. One iteration recorded — `Objective · grill`, with
one `--also-refused`.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## The counters, read right after this wake's recording

This is the comparison `LOOPS.md` rule 3 asks for. **It came back clean this
wake, and that is worth one line rather than a re-derivation** — last wake the
same comparison was the whole of `279.4`.

- **Rule 2 (Standardize)** `3 / 4 … ok` at dispatch → **unchanged**. Correct: an
  `Objective` row is not a `Continue` round. One more Continue round and
  Standardize preempts the queued build item.
- **Rule 3 (Objective)** `5 / 3 … OVERDUE [274, 276, 277, 278, 279]` at dispatch
  → **`0 / 3 … ok`** after recording. Correct: an Objective row resets it.
- **Rule 5 (Optimize)** read **STALE** (`2 wake-date(s) newer`) at Step 0b, and
  is reported as *could not be evaluated*, never clear.
- **Rules 4, 6, 7, 8 were NOT EVALUATED**, because rule 3 matched. A rule below
  a match is unreached, not clear.

## ⚠ NEXT WAKE: rule 3 has reset, so expect rule 4 → rule 6 (Polish)

Rule 3 is spent. Rule 2 is one Continue round short. Rule 4's open set is
unchanged at **12** and none of it is cloud-takeable (below), so a cloud wake
falls through to **rule 6, Polish** — run `polish_requeue.py --apply` first,
per §3b step 0, and note it needs `npm run build -w @busy-office/ui` before it
can read `api.json`.

## The open set is 12, and none of it is cloud-takeable

Unchanged from last wake — Slice 280 filed and closed its one item inside its
own slice, so the open count did not move. Re-read from `ROADMAP.md` after this
wake's commit, **each line re-classified from the item's own text** per
`LOOPS.md` 186.2 rather than carried over:

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md      # 12  (12 at dispatch too)
python3 scripts/loops/roadmap_scope.py        # OPEN: [15, 112, 249, 273]
```

- **owner-blocked (9):** Slice 15 (AT runtime evidence, owner hardware), `112.3`
  (owner briefs) and `112.4` (blocked on 112.3's verdict), `249.7` (its own text
  holds the cost question until the owner answers `249.10`), `249.10`,
  `249.11`, `249.12`, `249.13` (each says **OWNER CALL** in its own line), and
  `273.2`.
- **browser-blocked in the SCREENSHOT sense** (`ENVIRONMENT.md`'s FIRST list — a
  LOCAL wake can take these, a cloud wake cannot): `249.6`, `249.9`, `249.15`.
  `249.6`'s own text banks its clause-level decline twice over; do not
  re-derive it a fifth time.
- **agent-blocked:** none. **partly takeable:** none.

**A LOCAL wake still has three items a cloud wake cannot take**: `249.6`,
`249.9`, `249.15`. Each has its cloud-takeable half already measured and banked
in its own item text.

## What landed this wake

**Dispatched by rule 3 (Objective)** — the first dispatch under `279.4`'s
correction to `CLOSES_A_SLICE`, exactly as the last hand-off predicted. Rule 1
clear: `list_issues` on `Busy-Office/busy-office-ui` returns `totalCount: 0`,
and `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` reads **0**. Step 1 triaged
and committed nothing: no new input.

**§6 step 0 dropped one of the five armed slices, which is what that step is
for.** Slice **275** is the newest grill and covered `271, 272, 273, 274` in
full one wake ago, so `274`'s presence in the armed set is a re-arm, not new
material. Honest scope: **276, 277, 278, 279**. `.roundtable/INDEX.md` reports
**4** repeated subjects (`object-page`, `external-review`, `site-proposal`,
`unit-doctrine`) — none of them this set.

**Score: 52 of 54 assertions reproduce** — 276 · 15 checked / 13 hold;
277 · 13 / 13; 278 · 11 / 11; 279 · 15 / 15. Both failures are two sentences
of one table, and both are `280.1`.

**The defect: `276.1`'s blind-commit table measured the tree its own fix had
not reached.** It published *"31 blind commits across 7 surfaces … the other
fourteen ledger surfaces have no serving module"*. Re-derived at `29a9062b`,
its own commit, from `polish_requeue.py`'s own source map: **51 across 9,
twelve unserved**. All seven published rows reproduce exactly — the two missing
ones are `inline-editing` **10/11** and `table-toolbar` **10/10**, precisely the
two `PAGE_ONLY_BEHAVIORS` surfaces 276.1 itself added. So the summary sentence
denies the map named in the same item's Accept, and the dropped
`inline-editing` row is the **10 of 11** that item's own opening paragraph
quotes two paragraphs earlier. Corrected in **three of the four** places it had
spread; the `loop-log.md` row is left alone, because backfilling rows is
forbidden.

**Two of this grill's own instruments were wrong first, both recorded in the
report rather than quietly fixed.** A probe against `polish_requeue.py`'s
functions returned **0 surfaces with a serving module** — `pr.rows()` yields
`(line_no, surface, rest)`, not `(kind, name, rest)`. And a crossings replay
returned **76 → 80** where the published figure is 51 → 52, because it reset the
distinct-slice set every time it reached 3; the counter resets **only at an
Objective row**. The published figures were right and the instruments were not,
twice — CLAUDE.md's base rate landing on the grill instead of on the slice.

**Step 0 hit trap 1 for the sixteenth wake running** (detached HEAD, `git branch
--show-current` empty), fixed with `git checkout -B main origin/main` before any
commit; `origin/main` again arrived as a **forced update**
(`26447ba...77e475c`). Trap 2 clean in one `--unshallow` (**1,902** commits, no
`shallow.lock`), and **it again brought the tags** — **third** wake running that
`ENVIRONMENT.md` §2's *"does NOT bring the tags"* did not hold, so keep
verifying with `git tag | wc -l` (**7**) rather than trusting either reading.
The Step 0c re-fetch before the first commit reported **no movement** — no
second dispatcher.

**Gates, all green in this container:** `build -w @busy-office/ui`,
`test -w @busy-office/ui` (29 files, 165 tests), `lint:css`, `docs:build`,
`check:repo` (**re-run after every source edit**, twice), `check:formatting`,
`check:claims` (**167** live — 278.5's figure, unchanged; its *3 NOT VERIFIED*
is `ENVIRONMENT.md` 6b, not a regression), `test:axe` (127 pages x 2 widths,
zero violations), `check:layout` (127 pages), `check:scroll` (914 containers x
2 widths), `check:wrong-choice` (156 assertions, 1 outstanding).

**Nothing in this diff renders, and that is an absence of subject rather than
an unverified claim.** `git diff --numstat` covers `ROADMAP.md`,
`.roundtable/polish-state.md`, `.roundtable/grill-objective-276-277-278-279-2026-09-05.md`
and `scripts/loops/polish_requeue.py` — **0** files under `packages/core/src/`,
**0** docs pages, **0** CSS. The 1440/390 light-and-dark screenshot lane a cloud
wake cannot run has nothing to look at here.

**`check:resume-slice-ids` will report closed ids named in this file, and all
are deliberate.** `280.1`, `279.1`-`279.4`, `276.1`, `275`, `278.5`, `272.1`,
`249.17` and the rest are named as history, as counter evidence, or as
classification evidence — never as queued work. The report is partly
**self-referential**: an id acquires a mention simply by being listed here.

## Direction

Nothing new from the owner this wake; GitHub intake is empty (`list_issues` →
`totalCount: 0`). The standing owner blocks are unchanged: Slice 15's AT runtime
evidence (owner hardware), `112.3`/`112.4`, and `249.7`, `249.10`-`249.13`.

**Three things want the owner's attention, and the first is the same one for
the third wake running:**

1. **The cloud lane is dry, third wake running.** No cloud-takeable open item
   exists. The loop is not stuck — it keeps finding real defects — but **every
   shipped defect of the last five wakes came from items the loop filed for
   itself**, not from the queue. Unblocking any one of `249.10`-`249.13` would
   refill it; `249.12` says *"OWNER OR ARCHITECTURE CALL"*, so it may not need
   the owner at all, and `279.3` gave it a concrete cost by declining a sweep
   for want of a stated threshold.

2. **`273.2` is still the owner call worth their attention**, a ninth wake
   untouched. Its tally is **unchanged** by this wake — an Objective grill is
   not a Polish round and files no NO-OP. Measured after writing:
   `grep -cE '^## Round .*NO-OP' .roundtable/polish-state.md` → **9**,
   `grep -cE '^## Round .*NOT a no-op'` → **5**.

3. **The class `280.1` names is worth a rule and did not get one.** *A
   measurement taken to justify a change must be taken under the change, or say
   which side of it it is on.* It is Slice 275's family — a figure the wake's
   own commit moved — one level up: not a figure the commit moved, but a **set**
   the commit widened, which `ENVIRONMENT.md`'s "read it from THAT COMMIT"
   bullet does not cover, because reading 276.1's table at its own commit is
   exactly what produces the wrong number. Left as a finding rather than
   written into `ENVIRONMENT.md` this wake: `274.1` has the loop's prose growth
   open and a fourth paragraph restating a neighbouring idea is what that item
   is about. Worth deciding deliberately.

## `bundle-gz-kb` still cannot be sampled — twenty-fifth wake

`259.1`'s rule-5 finding, re-verified this wake rather than re-derived:

```
grep -rln 'bundle-gz-kb' --include='*.mjs' --include='*.py' --include='*.ts' \
  --include='*.js' --include='*.json' . | grep -v node_modules
```

still returns exactly **one** file — `scripts/loops/record_metric.py` — and the
hit is its **docstring example** at line 6, `--value 7.0`. Nothing derives the
number. Do not "fix" rule 5's staleness by recording a guessed value.
