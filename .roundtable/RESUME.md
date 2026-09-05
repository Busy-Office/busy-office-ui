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
at hand-off. Two commits this wake, both pushed: Slice 273.3 and this hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## Two counters went OVERDUE on this wake's own recording — rule 2 is next

This is the comparison `LOOPS.md` says to make right after recording, and it
moved. Read immediately after `record_iteration.py`, so it is a snapshot:

- **Rule 2 (Standardize)** `4 / 4 … OVERDUE`. It was `3 / 4` when this wake
  dispatched, and the Continue round recorded below is the fourth.
- **Rule 3 (Objective)** `3 / 3 … OVERDUE [271, 272, 273]` — same cause, and
  161.4 executing correctly: 273 crossed because a **Continue** row named it,
  where last wake's Polish row on the same slice could not.
- **Both are above rule 4, and rule 2 is above rule 3.** So the next wake
  dispatches **Standardize**, not Continue — and unlike most of the backlog it
  is cloud-takeable: its four lanes are `scan:dead-style`, `report:css-repeats`,
  `report:prose` and `report_loop_prose.py`, none of which needs a screenshot.
  Say `n of 4` in the write-up; four consecutive sweeps ran three.
- **Rule 5 (Optimize)** read **STALE** (`2 wake-date(s) newer`) — report it
  *could not be evaluated*, never clear. Rules 5-8 were in any case **NOT
  EVALUATED** this wake, because rule 4 matched and Step 2 dispatches the first
  match. A rule below a match is unreached, not clear.

## The open set is 12, and NONE of it is cloud-dispatchable

Re-read from `ROADMAP.md` this wake, classified per `LOOPS.md` 186.2:

- **owner-blocked (9):** Slice 15, `112.3`, `112.4`, `249.7`, `249.10`-`249.13`,
  and `273.2`.
- **browser-blocked in the SCREENSHOT sense** (`ENVIRONMENT.md`'s FIRST list —
  a LOCAL wake can take these): `249.6`, `249.9`, `249.15`.
- **NOT BLOCKED: none.** `273.3` was the one dispatchable item and it landed
  below, so **rule 4 will find nothing next wake** — which costs nothing,
  because rules 2 and 3 both fire above it.
- **agent-blocked:** none.

`roadmap_scope.py` reads **837 / 3,947 = 21.2%** closed history, of which
**673 lines are the four targets 236.2 pins to open Slice 249**, leaving Slice
272 alone. No sweep is due; re-run the script rather than trusting this.

## What landed this wake

**Dispatched by rule 4 (Continue, build).** Rule 1 clear — `list_issues` on
`Busy-Office/busy-office-ui` returns `totalCount: 0`, and no open `N. [ ]` item
is a P0. Step 1 triaged and committed nothing: no new input. Rules 2 and 3 were
`3 / 4` and `2 / 3` **at dispatch time** — both crossed on this wake's own
recording, not before it. Rule 4 then walked the open set oldest-first and
`273.3` was the first item neither owner- nor browser-blocked, exactly as last
wake predicted.

**Step 0 hit both standing traps.** Trap 1 for the sixth wake running (detached
HEAD at `e50ace04`, no branch); trap 2 clean in one `--unshallow` (**1,879**
commits), and `git fetch --tags origin` returned all seven — fetched explicitly
and checked, never assumed.

### Slice 273.3 — the clause changed, not the two screens

Three things worth carrying:

1. **The premise re-measured true, which is the outcome the criterion was
   written to allow.** A jsdom parse of all **137** built pages finds
   `.bo-byline` on **10** and inside a real `td`/`th` on exactly **2** —
   `/components/avatar` (2 cells) and `/patterns/settings-admin` (3), **5**
   cell-borne bylines in all, every one a name plus `__avatar` and nothing else.
2. **It had to be a DOM parse, not a grep, and that is the transferable bit.**
   Both pages carry `&lt;td&gt;` inside copy-paste `<pre>` blocks, so a grep
   counts samples as markup. The probe was red-proved **by discrimination
   before any real count was read**: 1 inside a `<td>`, 0 beside a table, 0 on
   an escaped sample. **If you measure "X inside Y" over `dist`, parse it.**
3. **A quoted clause lives in more than one file.** The old headline was also
   inside `dsa-scores.json`'s `content` cite, which is hand-authored evidence
   and no generator writes it. That is why the built-output assertion reads
   *old string in 0 files* rather than 1 — the cite moved in the same commit
   instead of being left quoting a string the page no longer carries. Grep the
   clause before rewording one.

**Not verified, and named rather than implied:** cloud wake, so the 1440/390
light-and-dark screenshot lane could not run. The rendered change is one bolded
clause plus one added sentence inside a single `<p class="demo-note">` on
`/components/byline`, and the `content` cite `DsaScore.astro` renders on that
same page. `check:layout` (390px and 150% zoom), `check:scroll` and `test:axe`
all pass over it, so nothing overflows and nothing is unreachable — **whether
the longer opener READS well at 390px was seen by nobody.** That is the residue
a LOCAL wake would close.

All **17** cloud-toolchain entry points ran green. `check:claims`' *"3 NOT
VERIFIED"* is `ENVIRONMENT.md` 6b — this container reports
`(hover: hover) and (pointer: fine)` false — not a regression; the count beside
it read **162** live.

**`check:resume-slice-ids` will report closed ids named in this file, and all
are deliberate.** Run against the file as written it reports `273.3` — the slice
that LANDED this wake, named as history, not as queued work — plus `271.1`,
`252.1`, `252.2` as archived rather than open. Note the report is partly
**self-referential**: an id acquires a mention simply by being listed in a
paragraph like this one, which is why earlier hand-offs' lists kept growing.
Nothing here queues or blocks on a closed id.

## Direction

Nothing new from the owner this wake; GitHub intake is empty (`list_issues` →
`totalCount: 0`). The standing owner blocks are unchanged: Slice 15's AT runtime
evidence (owner hardware), `112.3`/`112.4` (owner briefs, then 112.3's verdict),
and `249.7`, `249.10`-`249.13`.

**`273.2` is still the owner call worth their attention, and it is now the only
thing standing between the Polish lane and a written rule nothing executes.**
`LOOPS.md` §3b step 5 mandates `dry++` on a Polish round whose score does not
move; no round has ever done it. The input the owner needs is in the item: of
the 8 rounds recorded NO-OP, **6 filed a real defect found elsewhere and 2 found
nothing**, so "the score did not move" and "the round was busywork" have come
apart 6 times out of 8. Executing the rule as written would retire surfaces and
empty a lane **176.3 already refused to narrow**; leaving it is a rule nothing
runs. Not a re-raise of 176.3 — that closed whether Polish has an exit; this is
whether the bookkeeping under it should exist at all.

## `bundle-gz-kb` still cannot be sampled — fifteenth wake

259.1's rule-5 finding, re-verified this wake rather than re-derived:

```
grep -rln 'bundle-gz-kb' --include='*.mjs' --include='*.py' --include='*.ts' \
  --include='*.js' --include='*.json' . | grep -v node_modules
```

still returns exactly **one** file — `scripts/loops/record_metric.py` — and the
hit is its **docstring example** at line 6, `--value 7.0`. Nothing derives the
number. Do not "fix" rule 5's staleness by recording a guessed value.
