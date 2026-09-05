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
at hand-off. Two commits this wake, both pushed: Slice 283 (Polish round 3 on
`table-toolbar`) and this hand-off. One iteration recorded — `Polish · round`,
with two `--also-refused`.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ NEXT WAKE: rule 3 (Objective) is ONE slice from pre-empting

`dispatch_status.py` read `1 / 3 … ok [281]` at dispatch and **`2 / 3 …
ok [281, 283]`** immediately after recording. That is the counter behaving as
279.4 amended it — a `Polish` row now closes a slice — and it is the direct
contrast with last wake's `282.3`, where a `Roadmap` row correctly moved
nothing. **One more counted slice (Continue, Standardize or Polish) and rule 3
dispatches an Objective grill instead of another Polish round.** A wake that
reaches rule 6 again should expect that grill next, and its arming set will be
`[281, 283, <the third>]`.

Rule 2 (Standardize) read `3 / 4 … ok` at dispatch and **unchanged** after
recording — correct, a Polish row is not a Continue round. Still one Continue
round short, and no Continue round is available to a cloud wake (see the open
set below), so this counter cannot move on a cloud wake at all.

Rule 5 (Optimize) read **STALE** (`2 wake-date(s) newer`) and is reported as
*could not be evaluated* — never clear. `259.1`'s finding stands: re-verified
this wake, `grep -rln 'bundle-gz-kb'` over `*.mjs *.py *.ts *.js *.json`
excluding `node_modules` still returns exactly **one** file,
`scripts/loops/record_metric.py`, and the hit is its **docstring example**
(`--value 7.0`). Nothing derives the number. Do not "fix" rule 5's staleness by
recording a guessed value.

## What landed this wake

**Dispatched by rule 6 (Polish).** Rule 1 clear: `list_issues` on
`Busy-Office/busy-office-ui` returns `totalCount: 0` and
`grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` reads **0**. Step 1 triaged and
committed nothing: no new input. **Rule 4's sweep clause did not fire** —
`roadmap_scope.py` read **218 / 3,398 = 6.4%** closed-history share at dispatch
(`7079c94`) with Slice 282 the only eligible target; at the commit carrying this
hand-off the same command reads **218 / 3,601 = 6.1%**, the denominator having
grown by this wake's own slice. *(The last hand-off predicted `0.0%` and 117
lines. It was written before Slice 282's own text existed, which is the whole
difference. Read the number, not the forecast — and note this is the second
consecutive wake where a hand-off's prediction about the next wake's instrument
reading was wrong in the same direction.)*

**Slice 283 — Polish round 3 on `table-toolbar`, NO-OP on the surface; the
defect is in step 0's own re-queue signal.** `polish_requeue.py` reports a
surface as "SOURCE moved" by comparing a recorded digest with today's, and that
comparison only means something while both were computed the same way.
**276.1 widened the path set to include behavior modules and did not re-stamp
the rows computed without them.** Over the 21-row ledger at `7079c94`, via the
new `--audit-stamps`: 7 rows equal today's digest, 7 reproduce under the current
path set, **5 reproduce ONLY under the pre-276.1 set**, and **2 reproduce at no
revision of their own paths**. So **7 of the 13 re-queues carried no information
about source movement**, permanently.

The attribution is a clean split rather than a date inference: **all 7 affected
rows are among the 9 behavior-serving surfaces and none is among the other 12.**

**The pick was re-derived, not inherited**, exactly as the last hand-off
instructed: source drift since each surface's own stamp gave `table-toolbar`
(2026-08-25, 7 commits, +122/−17), then `alerts` (5), then `icon` (4). The last
hand-off guessed `icon` and `table-toolbar`; re-running the method put
`table-toolbar` first.

**Red-proved, and both directions matter.** The detector returns all four of its
verdicts on real input before any injection. Then `badge`'s stamp was replaced
with a fabricated digest — asserted at exactly 1 occurrence before and after, so
the injection is known to have landed — and the row flipped to `unknown`; and
`--stamp component/alerts` took the report **13 → 12** with warnings **7 → 6**,
proving the condition is clearable by the documented mechanism rather than only
by a hand edit.

**One overclaim was caught before it shipped, and it is worth carrying.** The
cheap check tests two revisions, so its `orphan` verdict means *"not the digest
at the commit that recorded it"* — a **superset** of "reproducible nowhere". The
tell was `component/date`: `orphan` to the cheap test, reproducible at
`3909b80a` to the exhaustive one, because `--backfill` seeds rows from a
historical tree. The first draft of the wording said "not reproducible from any
commit" and would have been wrong on that row. `--audit-stamps` exists because
of it, and the two implementations were reconciled **row for row on all 21
rows**, not compared as totals.

**Refused, with reasons in the item:** re-stamping the five (exact, and it
breaks its own detector — a migrated stamp is introduced by the migration
commit and would re-read `orphan`; filed as **283.2** instead); and incrementing
`dry` on this no-op round (`273.2` is the open owner call).

**`273.2`'s tally moved this wake and was amended in place: 9 and 7 → 10 and 8.**
Unlike the last two wakes, this one DID run a Polish round, so the ratio
changed. Re-run before quoting:
`grep -cE '^## Round .*NO-OP' .roundtable/polish-state.md` → **10**,
`grep -cE '^## Round .*NOT a no-op'` → **6**.

**Step 0 hit trap 1 again** (detached HEAD, `git branch --show-current` empty),
fixed with `git checkout -B main origin/main` before any commit; `origin/main`
again arrived as a **forced update** (`26447ba...7079c94`). Trap 2 clean in one
`--unshallow` (**1,908** commits, no `shallow.lock`), and it again brought the
tags — `git tag | wc -l` reads **7**, a sixth consecutive container, which is
why `ENVIRONMENT.md` §2 now states the count as the check rather than a value.
The Step 0c re-fetch before the first commit reported **no movement** — no
second dispatcher. *(Note for the next wake: `git rev-parse --short origin/main
HEAD` exits 128 here as `ENVIRONMENT.md` §1 documents. Use the two-argument form
without `--short`.)*

**Gates, all 17 CI entry points green in this container:** `build` /
`test` (29 files, 165 tests) / `lint:css`, `docs:build` (**138** built pages),
`check:repo` (re-run after the markdown edits; `slice-refs` **838** assertions,
316 cited across 702 files, 265 slice numbers), `check:claims` (**167** live;
its *3 NOT VERIFIED* is `ENVIRONMENT.md` 6b, not a regression),
`check:formatting`, `check:scroll`, `check:layout`, `check:forced-colors`,
`test:axe`, `check:target-size`, `check:search`, `check:pseudo`,
`check:quickstart`, `check:po-app`, `check -w @busy-office/create-ui`, `suite`.

**NOT VERIFIED, said plainly:** this wake's diff is one Python script and two
markdown files and renders nothing, so the 1440/390 light-and-dark screenshot
lane a cloud wake cannot run had **no subject**. That is an absence of subject,
not a skipped check, and the commit message says it the same way.

## The open set is 13, and none of it is cloud-takeable

It was 12 at dispatch and is **13** after — Slice 283 filed `283.2` open and
closed `283.1` inside its own slice. Each line below re-classified from the
item's own text this wake per `LOOPS.md` 186.2, not carried over:

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md      # 13  (12 at dispatch)
python3 scripts/loops/roadmap_scope.py        # OPEN: [15, 112, 249, 273, 283]
```

- **owner-blocked (9):** Slice 15 (AT runtime evidence, owner hardware), `112.3`
  (owner briefs) and `112.4` (blocked on 112.3's verdict), `249.7` (its own text
  holds the cost question until the owner answers `249.10`), `249.10`,
  `249.11`, `249.12`, `249.13` (each says **OWNER CALL** in its own line), and
  `273.2`.
- **browser-blocked in the SCREENSHOT sense** (`ENVIRONMENT.md`'s FIRST list — a
  LOCAL wake can take these, a cloud wake cannot): `249.6`, `249.9`, `249.15`.
  `249.6`'s own text banks its clause-level decline; do not re-derive it again.
- **agent-blocked:** none. **partly takeable:** none.

**`283.2` IS CLOUD-TAKEABLE, and it is the first such item in several wakes.**
It is a script + ledger-format change with no rendered subject: record the
revision a stamp was taken against beside the digest, so `--audit-stamps`
becomes a lookup and the five pre-276.1 rows can be migrated mechanically. It is
also the NEWEST open item, so **rule 4 will not reach it** — rule 4 takes the
oldest, and the nine older ones are all owner-blocked, so a cloud wake still
falls through to rule 6 (or, once the counter crosses, rule 3). Taking `283.2`
needs a wake to pick it deliberately, or the owner to rank it.

## Direction

Nothing new from the owner this wake; GitHub intake is empty (`list_issues` →
`totalCount: 0`). The standing owner blocks are unchanged: Slice 15's AT runtime
evidence (owner hardware), `112.3`/`112.4`, `249.7`, `249.10`-`249.13`, and
`273.2`.

**Three things want the owner's attention.**

1. **`249.12` is no longer low urgency** — carried forward unchanged from last
   wake, because nothing this wake touched it and the evidence still stands:
   282.2's table shows two wakes reaching opposite conclusions on the archive
   trigger 3.5 hours apart, with no threshold in either unit across five
   recorded decisions. It is marked **OWNER OR ARCHITECTURE CALL**, so it may
   not need the owner at all.

2. **`273.2`'s empirical input has now been amended in place on two consecutive
   rounds** (6/8 → 7/9 → 8/10). That is itself an argument about the item: a
   tally hard-coded into the question being asked goes stale faster than the
   question gets answered. The decision is unchanged and still the owner's.

3. **The cloud lane is no longer bone dry, but only because the loop filed its
   own work.** `283.2` is cloud-takeable; every one of the nine items older than
   it is owner-blocked. Unblocking any one of `249.10`-`249.13` would refill the
   lane with work the owner actually wants, rather than work the loop found
   while maintaining itself.

**Findings carried forward rather than acted on** (`274.1` has the loop's prose
growth open, so new one-line rules are not being given sections): *a measurement
taken to justify a change must be taken under the change, or say which side of
it it is on*; *a citation should name its example by the PROPERTY that makes it
an example, not by the page that currently has that property*; *a rule fitted to
one row is ceremony, and the wake that wrote the row is the worst-placed to
judge it.* This wake adds a fourth, from 283.1: **when a derived value's FORMULA
changes, every value already recorded under the old formula becomes a constant,
not a stale reading — and a constant reported as a measurement is invisible.**
None of the four has a home yet.

**`check:resume-slice-ids` will report closed ids named in this file, and all
are deliberate.** `283.1`, `279.4`, `273.1`, `282.3`, `259.1`, `171.1` and the
rest are named as history, as counter evidence, or as classification evidence —
never as queued work. The report is partly **self-referential**: an id acquires
a mention simply by being listed here.
