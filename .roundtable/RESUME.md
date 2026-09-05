# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and **three** advisory checks now run from `record_iteration.py` — the
> charter check, `check:resume-slice-ids`, and (new this wake, 283.2)
> `polish_requeue.py --verify-stamps`. All three REPORT; none fails a build
> (roadmap 175.3). Run them against the file as it now stands rather than
> trusting a stale reading.

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
at hand-off. Two commits this wake, both pushed: Slice 283.2 and this hand-off.
One iteration recorded — `Continue · build`, with two `--also-refused`.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ NEXT WAKE: rule 2 (Standardize) is OVERDUE and pre-empts

`dispatch_status.py` read `3 / 4 Continue rounds … ok` at dispatch and
**`4 / 4 … OVERDUE`** immediately after recording — this wake's `Continue` row
is the fourth. Rule 2 sits above the queued build item deliberately, so **the
next wake dispatches Standardize**, not another Continue.

Run its four lanes and **say `n of 4`** — four consecutive sweeps ran three and
none named lane 4 (`report_loop_prose.py`, the roadmap-regrowth signal). For
`LOOPS.md` read the `by region` block, not the file row: this wake added ~27
lines to it, and the dispatch region is the half that matters.

**Rule 3 (Objective) did NOT move: `2 / 3 … ok [281, 283]` before and after.**
The last hand-off predicted *"one more counted slice and rule 3 dispatches"*.
That prediction was about a **new** slice; this wake's Continue row closed
`283.2`, an item **inside Slice 283**, which the arming set already held. A row
that closes an item in an already-counted slice does not advance this counter —
worth knowing before predicting the crossing again.

Rule 5 (Optimize) read **STALE** (`2 wake-date(s) newer`) and is reported as
*could not be evaluated* — never clear. `259.1`'s finding stands and was
re-verified this wake: `grep -rln 'bundle-gz-kb'` over `*.mjs *.py *.ts *.js
*.json` excluding `node_modules` still returns exactly **one** file,
`scripts/loops/record_metric.py`, and the hit is its **docstring example**
(`--value 7.0`). Nothing derives the number. Do not "fix" rule 5's staleness by
recording a guessed value.

## What landed this wake

**Dispatched by rule 4, and the last hand-off said rule 4 could not reach this
item.** It claimed *"rule 4 takes the oldest, and the nine older ones are all
owner-blocked, so a cloud wake still falls through to rule 6"*. **Measured and
refuted:** across all **917** revisions of `ROADMAP.md`, the oldest open item —
Slice 15's *AT runtime evidence*, permanently owner-blocked on a human listening
to a screen reader — has **never** been ticked `[x]`, while the log carries
**573** `Continue` rows. If a blocked oldest item stopped rule 4, rule 4 could
not have dispatched once in this repo's life. It skips blocked items and takes
the oldest **dispatchable** one, exactly as its own 173.2 bullet describes.
Rule 1 clear: `list_issues` → `totalCount: 0`, `P0` grep **0**. Step 1 triaged
and committed nothing. Rule 4's sweep clause did not fire — `roadmap_scope.py`
read **218 / 3,601 = 6.1%** at dispatch, **5.9%** after this wake's own text.

**Slice 283.2 — the revision is an OPTIONAL suffix, and the item's premise was
half wrong.** The `src` cell is now `<digest>` or `<digest>@<revision>`.

- **It cannot be mandatory.** `--stamp` digests the working tree at the END of a
  round, which is BEFORE that round's commit, so the revision does not exist
  yet. Measured: every stamp that reproduces anywhere reproduces at the commit
  that **carries** it, **18 of 18**, and at that commit's parent — HEAD as
  `--stamp` saw it — **0 of 18**.
- **The asymmetry is what makes migration possible.** 283.1 refused re-stamping
  because a migrated stamp is introduced by the migration commit and would
  re-read `orphan` forever. Confirmed: lookup vs search, row for row, **6 agree
  / 5 disagree, lookup right on every disagreement**.
- **The two `orphan` rows are a DIFFERENT BUG, not a formula casualty.**
  `--stamp` ran mid-round and the round then edited the surface's source again
  before committing. Proved exhaustively — every committed blob combination
  enumerated, **2** candidate trees for `data-table`, **4** for `pagination`,
  none reproduces the stamp. So `--verify-stamps` ships too (advisory, from
  `record_iteration.py`), because that evidence only exists after the commit.
- **The five were four before the work started** — `table-toolbar` cleared
  itself through the documented mechanism between 283.1's measurement and this
  one. Re-derived, not carried over.
- `--check` **12 re-queues / 6 uninformative → 10 / 0**; `--verify-stamps`
  **7 → 0**; `--audit-stamps` **2 DEAD → 0**. All four migrated
  formula-orphans **still re-queue** — their source genuinely moved — so
  276.1's orphaning cost *false confidence, not a missed round*, which is the
  item's own hypothesis now measured.

**Red-proved by injection, and the verdicts discriminate.** Widening
`source_paths` by one file (asserted present in the path set the gate reads
before believing anything) takes `--verify-stamps` to 21 of 21: all **7**
suffixed rows report `path-set`, all **14** bare rows an undiagnosed `orphan` —
276.1's silent failure reproduced on demand. Injection reverted and re-confirmed
absent. The advisory wiring was red-proved separately by discrimination.

**One dead detector was caught and killed inside the item.** The first
self-explaining `orphan` message asked whether the introducing commit touched
the surface's own source with `git log -1 <rev> -- <paths>` — which walks
**back** from rev and is non-empty almost always. It claimed `f57570f4` touched
`component/date`'s source (it touched none of it) and answered `a098cf85` for
`6cb26268`. Replaced with `git diff-tree`. Caught only because the message
disagreed with a probe taken minutes earlier.

**Filed: `283.3`** — `--stamp` still cannot verify its own output; ordering plus
an advisory check was the affordable fix, not a preventive one. Its Accept
allows *"finding the advisory check sufficient"* as a satisfying outcome, and
`--verify-stamps` now makes the early-stamp rate countable (base rate: 2 of the
21 rows this ledger has ever held, both on one day).

**Step 0 hit trap 1 again** (detached HEAD, `git branch --show-current` empty),
fixed with `git checkout -B main origin/main` before any commit; `origin/main`
again arrived as a **forced update** (`26447ba...21573ef`). Trap 2 clean in one
`--unshallow` (**1,910** commits, no `shallow.lock`), and it again brought the
tags — `git tag | wc -l` reads **7**, a seventh consecutive container, which is
why `ENVIRONMENT.md` §2 states the count as the check rather than a value. The
Step 0c re-fetch before the first commit reported **no movement** — no second
dispatcher.

**Gates, all 17 CI entry points green in this container:** `build` / `test`
(29 files, 165 tests) / `lint:css`, `docs:build` (**127** built pages),
`check:repo` (re-run after the markdown edits; `slice-refs` **839** assertions,
317 cited across 702 files, 265 slice numbers), `check:claims` (**167** live;
its *3 NOT VERIFIED* is `ENVIRONMENT.md` 6b, not a regression),
`check:formatting`, `check:scroll`, `check:layout`, `check:forced-colors`,
`test:axe` (127 pages x 2 widths, zero violations), `check:target-size`,
`check:search`, `check:pseudo`, `check:quickstart`, `check:po-app`,
`check -w @busy-office/create-ui`, `suite`.

**NOT VERIFIED, said plainly:** this wake's diff is two Python scripts and three
markdown files and renders nothing, so the 1440/390 light-and-dark screenshot
lane a cloud wake cannot run had **no subject**. That is an absence of subject,
not a skipped check, and the commit message says it the same way.

## The open set is 13, and none of the remainder is cloud-takeable

It was 13 at dispatch and is **13** after — `283.2` closed and `283.3` filed
inside the same slice. Each line below re-classified from the item's own text
this wake per `LOOPS.md` 186.2, not carried over:

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md      # 13
python3 scripts/loops/roadmap_scope.py        # OPEN: [15, 112, 249, 273, 283]
```

- **owner-blocked (9):** Slice 15 (AT runtime evidence, owner hardware), `112.3`
  (owner briefs) and `112.4` (blocked on 112.3's verdict), `249.7` (its own text
  holds the cost question until the owner answers `249.10`), `249.10`, `249.11`,
  `249.12`, `249.13` (each says **OWNER CALL** in its own line), and `273.2`.
- **browser-blocked in the SCREENSHOT sense** (`ENVIRONMENT.md`'s FIRST list — a
  LOCAL wake can take these, a cloud wake cannot): `249.6`, `249.9`, `249.15`.
  `249.6`'s own text banks its clause-level decline; do not re-derive it again.
- **agent-blocked:** none. **partly takeable:** `283.3` — it is cloud-takeable
  in principle (script + a recorded refusal, no rendered subject), and it is the
  NEWEST open item, so rule 4 reaches it only after the nine older blocked ones
  are skipped. **But rule 2 is OVERDUE and pre-empts rule 4 next wake**, so
  expect Standardize first regardless.

## Direction

Nothing new from the owner this wake; GitHub intake is empty (`list_issues` →
`totalCount: 0`). The standing owner blocks are unchanged: Slice 15's AT runtime
evidence (owner hardware), `112.3`/`112.4`, `249.7`, `249.10`-`249.13`, and
`273.2`.

**Three things want the owner's attention.**

1. **`249.12` is no longer low urgency** — carried forward unchanged, because
   nothing this wake touched it and the evidence still stands: 282.2's table
   shows two wakes reaching opposite conclusions on the archive trigger 3.5
   hours apart, with no threshold in either unit across five recorded decisions.
   It is marked **OWNER OR ARCHITECTURE CALL**, so it may not need the owner.

2. **`273.2` is unchanged this wake** — no Polish round ran, so its tally did
   not move for the first time in three wakes. The decision is still the
   owner's, and the two consecutive in-place amendments recorded before remain
   the argument that a tally hard-coded into a question goes stale faster than
   the question gets answered.

3. **The cloud lane is still fed only by the loop's own maintenance.** `283.2`
   was work the loop found while maintaining itself, and `283.3` is its
   follow-up. Every one of the nine items older than them is owner-blocked.
   Unblocking any one of `249.10`-`249.13` would refill the lane with work the
   owner actually wants.

**Findings carried forward rather than acted on** (`274.1` has the loop's prose
growth open, so new one-line rules are not being given sections): *a measurement
taken to justify a change must be taken under the change, or say which side of
it it is on*; *a citation should name its example by the PROPERTY that makes it
an example, not by the page that currently has that property*; *a rule fitted to
one row is ceremony, and the wake that wrote the row is the worst-placed to
judge it*; *when a derived value's FORMULA changes, every value already recorded
under the old formula becomes a constant, not a stale reading.* This wake adds a
fifth, from 283.2: **a hand-off's claim about what a dispatcher rule will do
next is a forecast, not a measurement — re-derive the rule against its own text
before acting on it.** None of the five has a home yet.

**`check:resume-slice-ids` will report closed ids named in this file, and all
are deliberate.** `283.2`, `283.1`, `282.3`, `273.1`, `276.1`, `280.1`, `259.1`,
`171.1`, `173.2` and the rest are named as history, as counter evidence, or as
classification evidence — never as queued work. The report is partly
**self-referential**: an id acquires a mention simply by being listed here.
