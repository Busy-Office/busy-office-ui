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
at hand-off. Two commits this wake, both pushed: Slice 281 (the Polish round)
and this hand-off. One iteration recorded — `Polish · round`, with one
`--also-refused`.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## The counters, read right after this wake's recording

This is the comparison `LOOPS.md` rule 3 asks for, and **this wake it earned
its keep** — it is the first direct observation of `279.4`'s correction
working, rather than a re-derivation of it.

- **Rule 2 (Standardize)** `3 / 4 … ok` at dispatch → **unchanged**. Correct: a
  `Polish` row is not a `Continue` round. Still one Continue round short, so a
  wake that runs one dispatches Standardize next.
- **Rule 3 (Objective)** `0 / 3 … ok` at dispatch → **`1 / 3 … ok [281]`** after
  recording. **This is the amendment landing:** before `279.4`, a Polish row
  closing its own slice was invisible to this counter, and Slice 281 is exactly
  that shape — filed and closed inside its own slice by a Polish round, with no
  `Continue` row anywhere. Two more and rule 3 preempts.
- **Rule 5 (Optimize)** read **STALE** (`2 wake-date(s) newer`) at Step 0b, and
  is reported as *could not be evaluated*, never clear.
- **Rules 6, 7, 8**: rule 6 matched and dispatched, so 7 and 8 were **NOT
  EVALUATED**. A rule below a match is unreached, not clear.

## ⚠ NEXT WAKE: expect rule 4 → rule 6 (Polish) again

Rule 4's open set is unchanged at **12** and still none of it is
cloud-takeable, so a cloud wake falls through to **rule 6** again. Run
`polish_requeue.py --apply` first per §3b step 0, and note it needs
`npm run build -w @busy-office/ui` before it can read `api.json`.

**The pick is a live question, not a lookup.** §3b step 1's ranking is
degenerate — every eligible surface is `content: 3` at `2/3 rounds, dry 0`,
which is `171.1` reaching the pick step. This wake broke the tie by asking
which surface's SOURCE had moved furthest from the tree its score was taken
against (`data-table`, **23** commits since the seed, against 9 for the next).
**That is a method, not a queue**: re-run it, do not reuse this ordering.
`data-table` is now **3/3** and out; `icon` at 9 and `table-toolbar` at 7 were
next on that measure.

## The open set is 12, and none of it is cloud-takeable

Unchanged — Slice 281 filed and closed its one item inside its own slice, so
the open count did not move. Re-read from `ROADMAP.md` after this wake's
commit, **each line re-classified from the item's own text** per `LOOPS.md`
186.2 rather than carried over:

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

**Dispatched by rule 6 (Polish), round 3 on `component/data-table`.** Rule 1
clear: `list_issues` on `Busy-Office/busy-office-ui` returns `totalCount: 0`,
and `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` reads **0**. Step 1 triaged
and committed nothing: no new input.

**All six cites reconcile; a new arm 16 found the defect.** The arm re-takes
the one claim on this surface that asserts **runtime layout** rather than file
content — which is `ENVIRONMENT.md`'s SECOND list, so a cloud wake can take it.
Measured at 390px against the built site on `a24ed45`, over all **138** built
pages (**115** carry a `.bo-data-table-container`):

| mutation | reached | rows moved | `68 -> 87` | `28 -> 30` |
|---|---|---|---|---|
| cell-padding-x only | 101 | 25 | 2 | **0** |
| full auto → compact | 101 | 65 | 2 | **67** |

**Two defects, neither in the physics.** (1) On `/patterns/detail-form` — the
page the cite names — **0 of 4 containers move under either mutation**; three
declare `data-density="compact"` and the fourth's rows read 87px → 87px.
`79f7fec9` measured it 2026-08-21 10:50 +0800; `69a53364` (109.19) added the
density **28 hours later**. (2) `28 -> 30` is the row-height floor, produced by
padding **0 of 101** times — archived 94.3 names it separately and **all three
live copies dropped that sentence**, so each read as one mutation producing
both figures. Corrected in all three; the archive keeps its verbatim text and
gains a `RE-MEASURED` block per 236.2 / 199.1.

**Instrument discipline, both ways round.** The probe's first version checked
only the custom property on the table and would have reported these numbers for
the wrong reason — the injection is now confirmed **at the cell**
(`padding-inline` 4px → 8px). And the `spacing` height claim was base-rated
before being believed: the detector reads 0 here and fires on **15 of 44**
component stylesheets, so it discriminates. Two earlier instrument errors this
wake, both recorded rather than quietly fixed: `pr.rows()` needs its `text`
argument, and `serveDist` returns `{server, port, base}` and no `.origin`.

**The CSS edits are comment-only, asserted rather than assumed:** comments
stripped and whitespace collapsed, both files are byte-identical before and
after (987 → 987 and 9,907 → 9,907 characters). **That is why nothing in this
diff renders**, and it is an absence of subject rather than an unverified
claim — the 1440/390 light-and-dark screenshot lane a cloud wake cannot run has
nothing to look at.

**Step 0 hit trap 1 for the seventeenth wake running** (detached HEAD, `git
branch --show-current` empty), fixed with `git checkout -B main origin/main`
before any commit; `origin/main` again arrived as a **forced update**
(`26447ba...a24ed45`). Trap 2 clean in one `--unshallow` (**1,904** commits, no
`shallow.lock`), and **it again brought the tags** — **fourth** wake running
that `ENVIRONMENT.md` §2's *"does NOT bring the tags"* did not hold, so keep
verifying with `git tag | wc -l` (**7**) rather than trusting either reading.
The Step 0c re-fetch before the first commit reported **no movement** — no
second dispatcher.

**Gates, all green in this container:** `build -w @busy-office/ui`,
`test -w @busy-office/ui` (29 files, 165 tests), `lint:css`, `docs:build`,
`check:repo` (**re-run after every source edit**, twice), `check:formatting`,
`check:claims` (**167** live; its *3 NOT VERIFIED* is `ENVIRONMENT.md` 6b, not
a regression), `test:axe` (127 pages x 2 widths, zero violations),
`check:layout` (127 pages), `check:scroll` (914 containers x 2 widths),
`check:forced-colors`, `check:target-size`, `check:search`, `check:pseudo`,
`check:quickstart`, `check:po-app`, `check -w @busy-office/create-ui`, `suite`
(28 screens x 2 widths). **The browser gates were re-run after a late
correction**, because the rewritten cite renders on the page and is much
longer than the one it replaced.

**`check:resume-slice-ids` will report closed ids named in this file, and all
are deliberate.** `281.1`, `279.4`, `273.2`, `249.17`, `171.1` and the rest are
named as history, as counter evidence, or as classification evidence — never as
queued work. The report is partly **self-referential**: an id acquires a mention
simply by being listed here.

## Direction

Nothing new from the owner this wake; GitHub intake is empty (`list_issues` →
`totalCount: 0`). The standing owner blocks are unchanged: Slice 15's AT runtime
evidence (owner hardware), `112.3`/`112.4`, and `249.7`, `249.10`-`249.13`.

**Two things want the owner's attention.**

1. **The cloud lane is dry, fourth wake running.** No cloud-takeable open item
   exists. The loop is not stuck — it keeps finding real defects — but **every
   shipped defect of the last six wakes came from items the loop filed for
   itself**, not from the queue. Unblocking any one of `249.10`-`249.13` would
   refill it; `249.12` says *"OWNER OR ARCHITECTURE CALL"*, so it may not need
   the owner at all.

2. **`273.2` is still the owner call worth their attention**, a tenth wake
   untouched. Its tally is **unchanged** by this wake, and that is meaningful
   rather than incidental: 273.2's ratio is about rounds recorded NO-OP, and
   this round was NOT a no-op, so it adds to the other column. Measured after
   writing: `grep -cE '^## Round .*NO-OP' .roundtable/polish-state.md` → **9**
   (unchanged), `grep -cE '^## Round .*NOT a no-op'` → **6** (was 5).

**One finding is carried forward rather than acted on**, same as last wake's
third item and for the same reason (`274.1` has the loop's prose growth open):
*a measurement taken to justify a change must be taken under the change, or say
which side of it it is on.* This wake added a sibling worth naming beside it —
**a citation should name its example by the PROPERTY that makes it an example,
not by the page that currently has that property.** 281.1 is the worked case:
the page stopped qualifying 28 hours later and three documents went on citing
it for two weeks. Both are one-line rules; neither has a home yet.

## `bundle-gz-kb` still cannot be sampled — twenty-sixth wake

`259.1`'s rule-5 finding, re-verified this wake rather than re-derived:

```
grep -rln 'bundle-gz-kb' --include='*.mjs' --include='*.py' --include='*.ts' \
  --include='*.js' --include='*.json' . | grep -v node_modules
```

still returns exactly **one** file — `scripts/loops/record_metric.py` — and the
hit is its **docstring example** at line 6, `--value 7.0`. Nothing derives the
number. Do not "fix" rule 5's staleness by recording a guessed value.
