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
at hand-off. Two commits this wake, both pushed: Slice 282 (the twelfth archive
sweep) and this hand-off. One iteration recorded — `Roadmap · sweep`, with one
`--also-refused`.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ THIS WAKE TOOK A CALL ANOTHER WAKE REFUSED 3.5 HOURS EARLIER

Read this before dispatching, because it is the one thing here a next wake
might reasonably reverse. Log row `5abdce3c` (15:51) refused a twelfth archive
sweep at **40.6%** closed-history share; this wake ran it at **46.5%**. The
gap is 420 lines and 5.9 points, and the honest difference is the **criterion**
— that wake weighed share, this one weighed lines, and rule 4's clause is
written in lines. Slice 282's first paragraph says so in full rather than
burying it.

**The finding that came out of it is 282.2's table**, and it is the input
`249.12` (the open **OWNER OR ARCHITECTURE CALL** on a sweep trigger) has been
missing. Five recorded decisions, each read from the commit it names:

| when | commit | live lines | share | decision |
|---|---|---|---|---|
| 2026-09-04 00:56 | `49d2c901` | 3,620 | 32.0% | refused |
| 2026-09-05 02:45 | `d33c1ef~1` | 6,468 | 56.7% | dispatched (11th) |
| 2026-09-05 15:51 | `5abdce3c` | 5,450 | 40.6% | refused |
| 2026-09-05 19:13 | `4567bed` | 5,870 | 46.5% | dispatched (12th) |
| *(tenth, per 252.1)* | — | 3,790 | 55.1% | dispatched |

No single share separates them and no single line count does either, and the
two units disagree in direction: the tenth ran at 3,790 lines / 55.1% while
today's refusal came at 5,450 lines / 40.6% — a file **1,660 lines longer**,
refused for being a smaller fraction closed. **`249.12`'s own "low urgency" no
longer holds** and that is this wake's one thing for the owner.

## The counters, read right after this wake's recording

- **Rule 2 (Standardize)** `3 / 4 … ok` at dispatch → **unchanged** after
  recording. Correct: a `Roadmap` row is not a `Continue` round. Still one
  Continue round short, so a wake that runs one dispatches Standardize next.
- **Rule 3 (Objective)** `1 / 3 … ok [281]` at dispatch → **unchanged** after
  recording, and **that is the blind spot `282.3` records**: this wake closed
  Slice 282 by hand and the counter did not move, because `Roadmap` is outside
  `CLOSES_A_SLICE`. **Refused, on base rate** — `grep -c ' · Roadmap · sweep · '`
  reads **1** of 1,445 rows, and it is this wake's own; 279.4's Polish
  amendment had 18 rows over 17 slices behind it. Reopen condition is in the
  item. Two more counted slices and rule 3 preempts.
- **Rule 5 (Optimize)** read **STALE** (`2 wake-date(s) newer`) at Step 0b and
  is reported as *could not be evaluated*, never clear.
- **Rules 6, 7, 8**: rule 4 matched on its sweep clause, so 6-8 were **NOT
  EVALUATED**. A rule below a match is unreached, not clear.

## ⚠ NEXT WAKE: rule 4 has nothing again, so expect rule 6 (Polish)

The sweep clause will **not** fire again — `roadmap_scope.py` now reads
**0.0%** share with Slice 282 itself the only eligible target (117 lines, under
no threshold worth spending a wake on). The open set is unchanged at **12** and
still none of it is cloud-takeable, so a cloud wake falls through to rule 6.

Run `polish_requeue.py --apply` first per §3b step 0, and note it needs
`npm run build -w @busy-office/ui` before it can read `api.json`.

**The pick is a live question, not a lookup.** §3b step 1's ranking is
degenerate — every eligible surface is `content: 3` at `2/3 rounds, dry 0`,
which is `171.1` reaching the pick step. The last wake broke the tie by asking
which surface's SOURCE had moved furthest from the tree its score was taken
against. **That is a method, not a queue**: re-run it, do not reuse the
ordering. `data-table` is now `3/3` and out; `icon` and `table-toolbar` were
next on that measure when it was last run.

## The open set is 12, and none of it is cloud-takeable

Unchanged — Slice 282 filed and closed all three of its items inside its own
slice, so the open count did not move (**12 at dispatch, 12 after**). Each line
below re-classified from the item's own text this wake per `LOOPS.md` 186.2,
not carried over:

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

**Dispatched by rule 4 on its own sweep clause**, all 12 open items being
owner- or browser-blocked. Rule 1 clear: `list_issues` on
`Busy-Office/busy-office-ui` returns `totalCount: 0`, and
`grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` reads **0**. Step 1 triaged and
committed nothing: no new input.

**Slice 282 — the twelfth archive sweep.** 13 closed slices moved verbatim
(281, 280, 279, 278, 277, 276, 275, 274, 272, 262, 260, 253, 237 — 2,730 body
lines), each leaving heading + one pointer line. `ROADMAP.md` 5,870 → **3,179
at the move** and 5,870 → **3,398** at the commit, because writing the slice
back is the rest; `ROADMAP-archive.md` 37,459 → **40,201**. The **+2,742**
reconciles as 2,730 body + 13 headings **− 1**, that one being the old file's
trailing blank line, which the append consumed as the separator before Slice
281's heading. Live loss at the move **−2,691** = 2,730 removed + 13 × 3 stub
lines added. Every figure read from `HEAD` and the index, never the working
tree, per `ENVIRONMENT.md`'s bullet.

**The move's identity was red-proved, not asserted.** 13/13 headings+bodies
byte-identical against `HEAD:ROADMAP.md` with no line-count difference on any
slice — then one body line of the archived Slice 260 was mutated in memory and
the same checker read **12/13**, with the injection printing the line it
changed before the re-run. All four 236.2 pins (253, 262, 237, 260) were read
one at a time; **none carries an amend clause**, all four are provenance
citations, re-derived rather than carried over from the eleventh sweep.

**282.2's second half — the stub floor, and what it does NOT explain.** 208.1's
share puts prior sweeps' pointer stubs in the denominator where they can never
enter the numerator: **246 stubs = 985 lines**, byte-identical at both ends of
this regrowth window, 26% of the file right after a sweep and 16% now, growing
4 lines per slice archived forever — so shares from different eras are not
comparable. **It is explicitly not this window's cause**: identical at both
revisions, so what moved the 10.2 points is the numerator (3,668 closed body
lines then, 2,730 now) against an open set whose text is larger — Slice 249
alone carries **1,218** lines, the four open slices **1,748** of 5,870.

**One number was measured and deliberately NOT published**, which is the part
worth carrying forward. 282.3's case would have been much stronger with a
whole-log replay, and a probe written for it returned **80** crossings for the
current `Continue + Standardize + Polish` set where `dispatch_status.py`'s own
header records **52** for that same set over 1,437 rows. A 28-crossing
disagreement means the probe is wrong until reconciled against `report()`'s
live output the way 279.4 reconciled its own — so the replay is absent from the
item and the refusal rests on the exact counts instead.

**`ENVIRONMENT.md` §2 corrected, on this wake's own measurement.** The bullet
asserted flatly that `--unshallow` does **not** bring the tags; it has now been
contradicted on **five consecutive wakes** — the hand-offs at `e914399`,
`77e475c`, `a24ed45` and `4567bed`, plus this one, where
`git fetch --unshallow origin` printed `* [new tag] v0.5.0 / v0.6.0 / v0.7.0`
and the follow-up `git fetch --tags origin` added **nothing**,
`git tag | wc -l` reading **7**. Rewritten as the property — *run the count* —
rather than as the new value, per CLAUDE.md's criterion rule. Four hand-offs
had said "keep verifying" while the durable file went on stating the value;
that is exactly the 169.3 split, so the correction belongs there and not here.

**Step 0 hit trap 1 again** (detached HEAD, `git branch --show-current` empty),
fixed with `git checkout -B main origin/main` before any commit; `origin/main`
again arrived as a **forced update** (`26447ba...4567bed`). Trap 2 clean in one
`--unshallow` (**1,906** commits, no `shallow.lock`). The Step 0c re-fetch
before the first commit reported **no movement** — no second dispatcher.

*The running-ordinal this paragraph used to carry ("the seventeenth wake
running") is dropped rather than incremented.* It was inherited across
hand-offs with nothing re-deriving it, which is the shape 169.1's wrong
sentence had. What is measurable is the base rate, and it is high enough to
make the point without a serial number: **26 of the last 40 `RESUME.md`
revisions** mention trap 1 or a detached HEAD
(`for sha in $(git log --format=%H -40 -- .roundtable/RESUME.md); do …`).

**Gates, all 17 CI entry points green in this container** (re-derived from
`ci.yml` rather than trusted; the derivation returned the same 17):
`build`/`test` (29 files, 165 tests)/`lint:css -w @busy-office/ui`,
`docs:build` (**138** built pages), `check:repo` (**re-run after every source
edit**, three times), `check:claims` (**167** live; its *3 NOT VERIFIED* is
`ENVIRONMENT.md` 6b, not a regression), `check:formatting`, `check:scroll`
(914 containers x 2 widths), `check:layout` (127 pages), `check:forced-colors`,
`test:axe` (127 pages x 2 widths, zero violations), `check:target-size`,
`check:search`, `check:pseudo`, `check:quickstart`, `check:po-app`,
`check -w @busy-office/create-ui`, `suite` (28 screens x 2 widths).
`check:slice-refs`: **835** assertions, 314 cited across 702 files, 264 slice
numbers each heading one section.

**NOT VERIFIED, said plainly:** this wake's diff is markdown only and renders
nothing, so the 1440/390 light-and-dark screenshot lane a cloud wake cannot run
had **no subject**. That is an absence of subject, not a skipped check, and it
is written the same way in the commit message.

**`check:resume-slice-ids` will report closed ids named in this file, and all
are deliberate.** `282.3`, `279.4`, `273.2`, `249.17`, `171.1`, `252.1` and the
rest are named as history, as counter evidence, or as classification evidence —
never as queued work. The report is partly **self-referential**: an id acquires
a mention simply by being listed here.

## Direction

Nothing new from the owner this wake; GitHub intake is empty (`list_issues` →
`totalCount: 0`). The standing owner blocks are unchanged: Slice 15's AT runtime
evidence (owner hardware), `112.3`/`112.4`, and `249.7`, `249.10`-`249.13`.

**Two things want the owner's attention, and the first one is new.**

1. **`249.12` is no longer low urgency, and 282.2's table is the evidence.**
   Two wakes reached opposite conclusions on the same instrument **3.5 hours
   apart** on one day, and across five recorded decisions no threshold exists
   in either unit — a file 1,660 lines longer was refused for being a smaller
   fraction closed. `249.12` is marked **OWNER OR ARCHITECTURE CALL**, so it
   may not need the owner at all; either way it now has the input it lacked.

2. **The cloud lane is dry, and has been for several consecutive wakes.** No
   cloud-takeable open item exists. The loop is not stuck — it keeps finding
   real defects — but they come from items the loop files for itself, not from
   the queue. Unblocking any one of `249.10`-`249.13` would refill it.

   *The running counts this item used to carry ("fifth wake running", "the
   last seven wakes") are dropped rather than incremented, for the same reason
   as trap 1's ordinal above: nothing re-derived them.* The claim that matters
   needs no serial number — it is re-checkable in one command, and it is the
   classification block above, which was re-read from each item's own text this
   wake.

`273.2` remains the other owner call, an eleventh wake untouched. Its tally is
**unchanged** by this wake and that is correct rather than incidental: 273.2's
ratio counts Polish rounds recorded NO-OP, and this wake ran no Polish round.
Measured, not assumed: `grep -cE '^## Round .*NO-OP' .roundtable/polish-state.md`
→ **9**, `grep -cE '^## Round .*NOT a no-op'` → **6**, both unchanged.

**Two findings are carried forward rather than acted on**, same as the last two
wakes and for the same reason (`274.1` has the loop's prose growth open):
*a measurement taken to justify a change must be taken under the change, or say
which side of it it is on*, and *a citation should name its example by the
PROPERTY that makes it an example, not by the page that currently has that
property*. This wake adds a third, from 282.3: **a rule fitted to one row is
ceremony, and the wake that wrote the row is the worst-placed to judge it.**
All three are one-line rules; none has a home yet.

## `bundle-gz-kb` still cannot be sampled

`259.1`'s rule-5 finding, re-verified this wake rather than re-derived:

```
grep -rln 'bundle-gz-kb' --include='*.mjs' --include='*.py' --include='*.ts' \
  --include='*.js' --include='*.json' . | grep -v node_modules
```

still returns exactly **one** file — `scripts/loops/record_metric.py` — and the
hit is its **docstring example** at line 6, `--value 7.0`. Nothing derives the
number. Do not "fix" rule 5's staleness by recording a guessed value.
