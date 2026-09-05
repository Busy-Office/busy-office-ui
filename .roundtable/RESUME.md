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
at hand-off. Two commits this wake, both pushed: Slice 273 and this hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## Rule 6 (Polish) is the live lane, and rule 4 stays blocked

Rule 4 found **nothing dispatchable** and this time had no escape hatch: its
sweep clause did not fire either, because `roadmap_scope.py` reads
**837 / 3,902 = 21.5%** closed history of which **673 lines are the four
targets 236.2 pins to open Slice 249**, leaving Slice 272 alone. Re-run the
script; last wake's floor argument still holds and it is why the share will
keep drifting up without a sweep being due.

The open set is now **13** (was 11 — Slice 273 added two). Classified per
`LOOPS.md` 186.2, re-read from `ROADMAP.md` this wake:

- **owner-blocked (9):** Slice 15, `112.3`, `112.4`, `249.7`, `249.10`-`249.13`,
  and new `273.2`.
- **browser-blocked in the SCREENSHOT sense** (`ENVIRONMENT.md`'s FIRST list —
  a LOCAL wake can take these): `249.6`, `249.9`, `249.15`.
- **NOT BLOCKED (1): `273.3`** — a cloud wake can take it. It is the only
  dispatchable item in the backlog, so **expect rule 4 to match on it next
  wake** rather than falling through to Polish again.
- **agent-blocked:** none. Spawning a second agent for §3b step 4's blind
  re-score worked in this container.

## The counters, read immediately after recording — re-run them, this is a snapshot

- **Rule 2 (Standardize)** `3 / 4 … ok` — unmoved. A Polish row is not a
  Continue round, so this wake did not advance it.
- **Rule 3 (Objective)** `2 / 3 … ok [271, 272]` — also unmoved, and that is
  161.4 executing correctly rather than a miss: only `Continue` and
  `Standardize` rows close a slice, and 273 is a `Polish` row. **One Continue
  or Standardize round arms an Objective grill**, which is cloud-takeable
  unlike most of the open set.
- **Rule 5 (Optimize)** — trend clause read **STALE** (`2 wake-date(s) newer`),
  so report it *could not be evaluated*, never clear. Its SECOND clause was
  evaluable and is clear: `check:size` at *139 files / 11 buckets / 376.2 kB gz
  / tightest headroom 110 bytes*. Do not "fix" the staleness by recording a
  guessed value (see the bottom of this file).
- **Rules 7-8 were NOT EVALUATED**, because rule 6 matched and Step 2
  dispatches the first match. A rule below a match is unreached, not clear.

## What landed this wake

**Dispatched by rule 6 (Polish).** Rule 1 clear (`list_issues` →
`totalCount: 0`); Step 1 triaged and committed nothing. Step 0 hit **trap 1**
for the fifth wake running (detached HEAD at `14947d1`, no local `main`).
**Trap 2 did not bite:** `--unshallow` clean in one attempt (**1,877** commits)
and `git fetch --tags origin` returned all seven — fetched explicitly and
checked, per last wake's instruction, rather than expected either way.

### Slice 273 — Polish round on `byline`

Three things worth carrying:

1. **The pick discriminated on `1/3` rounds**, four rows tied, `inline-editing`
   and `table-toolbar` dropped for 268's stated reason (no `dsa-scores.json`
   entry, so no arm can disagree with them).
2. **Arm 9's first implementation returned `served = 0` for all 40** — it keyed
   `behaviors.json`'s `byComponent` by CSS class where the file is keyed by
   **component name**. Caught by the identical-value rule before any verdict
   rested on it. The corrected arm reproduces 268's table with only the two
   cells breadcrumb's fix had to move. **If you write an arm over
   `behaviors.json`, key it by component name.**
3. **§3b step 4 earned its place this round**, and it is the first to run under
   268.2's correction (tell the scorer the page publishes a prior verdict and
   that it is not evidence). It returned 3 — agreeing with the published value,
   so weak evidence for the score, which is stated as a direction rather than
   hedged — and then found, unprompted, the defect no arm looks at: the
   `--compact` rationale recommending the context the opener's own clause
   forbids, in the **shipped CSS comment** as well as the docs heading.

**Not verified, and named rather than implied:** cloud wake, so the 1440/390
light-and-dark screenshot lane could not run. The rendered change is one `<h2>`
on one built page (asserted: old string 0 files in `dist`, new string exactly 1)
plus a CSS comment postcss strips (0 hits in both `.min.css`). **Whether the
shortened heading looks right at 390px was seen by nobody** — `check:layout`
and `check:scroll` cover overflow, not appearance.

**`check:resume-slice-ids` will report the closed ids named in this file, and
all are deliberate** — `273.1`, `272.1`, `271.1`, `252.1`, `252.2`, `237.1`,
`249.17`, `249.19` appear as history or precedent. Nothing here queues or
blocks on a closed id.

## Direction

Nothing new from the owner this wake; GitHub intake is empty (`list_issues` →
`totalCount: 0`). The standing owner blocks are unchanged: Slice 15's AT runtime
evidence (owner hardware), `112.3`/`112.4` (owner briefs, then 112.3's verdict),
and `249.10`-`249.13`.

**One new owner call, and it is the one worth their attention: `273.2`.**
`LOOPS.md` §3b step 5 mandates `dry++` on a Polish round whose score does not
move, and **no round has ever done it** — `dry` reads 0 on all 16 second-round
rows across 30 of 30 ledger revisions. Executing the rule as written would
retire surfaces and empty the Polish lane, which **176.3 already refused on
measured grounds**; leaving it is a written rule nothing runs. The input the
owner needs is in the item: of the 8 rounds recorded NO-OP, **6 filed a real
defect found elsewhere and 2 found nothing**, so "the score did not move" and
"the round was busywork" have come apart 6 times out of 8. This is not a
re-raise of 176.3 — that closed whether Polish has an exit; this is whether the
bookkeeping under it should exist at all.

## `bundle-gz-kb` still cannot be sampled — fourteenth wake

259.1's rule-5 finding, re-verified this wake rather than re-derived:

```
grep -rln 'bundle-gz-kb' --include='*.mjs' --include='*.py' --include='*.ts' \
  --include='*.js' --include='*.json' . | grep -v node_modules
```

still returns exactly **one** file — `scripts/loops/record_metric.py` — and the
hit is its **docstring example**, `--value 7.0`. Nothing derives the number. Do
not "fix" rule 5's staleness by recording a guessed value.
