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
at hand-off. Two commits this wake, both pushed: `274.2` and this hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## The counters, read right after this wake's recording

Read immediately after `record_iteration.py`, so it is a snapshot — and this is
the comparison `LOOPS.md` rule 3 asks for. Both moved exactly as the recording
predicts, which is the agreement that has caught two of that rule's five parser
bugs:

- **Rule 2 (Standardize)** `0 / 4 … ok` at dispatch → **`1 / 4 … ok`**.
- **Rule 3 (Objective)** `0 / 3 … ok` at dispatch → **`1 / 3 … ok [274]`** —
  this wake's Continue row closed Slice 274.
- **Rule 5 (Optimize)** read **STALE** (`2 wake-date(s) newer`, unchanged) at
  Step 0b. Report it *could not be evaluated*, never clear.
- **Rules 6-8 were NOT EVALUATED**, because rule 4 matched. A rule below a
  match is unreached, not clear.

## The open set is 12, and NONE of it is cloud-dispatchable

Re-read from `ROADMAP.md` after this wake's commit, classified per `LOOPS.md`
186.2. **`274.2` closed this wake, and it was the one unblocked item** — so the
next wake is the first in a while that reaches **rule 4 with nothing to take**:

- **owner-blocked (9):** Slice 15, `112.3`, `112.4`, `249.7`, `249.10`-`249.13`,
  and `273.2`.
- **browser-blocked in the SCREENSHOT sense** (`ENVIRONMENT.md`'s FIRST list —
  a LOCAL wake can take these, a cloud wake cannot): `249.6`, `249.9`, `249.15`.
  `249.15` says so in its own text.
- **agent-blocked:** none.
- **NOT BLOCKED:** none.

**So a cloud wake falls through rule 4 to rule 5 (STALE — cannot be evaluated)
and then to rule 6, which fires**: per `LOOPS.md`'s own measurement, rule 6's
predicate is true of every non-skipped surface, so the next cloud wake dispatches
**Polish**, not rule 8's halt. Run `polish_requeue.py --apply` first, and note
§3b step 4's warning that withholding `dsa-scores.json` does NOT make a re-score
blind — the page publishes its prior verdict.

`roadmap_scope.py` reads **1,295 / 4,414 = 29.3%** closed history. No sweep is
due (272's eleventh sweep dispatched at 56.7%); re-run the script rather than
trusting this. Its `30 closed` and the slice-id check's `32 closed` differ by
exactly the **2 items under a non-slice heading** it reports separately — that
is agreement, not a discrepancy.

## What landed this wake

**Dispatched by rule 4 (Continue, build).** Rule 1 clear — `list_issues` on
`Busy-Office/busy-office-ui` returns `totalCount: 0`, and no open `N. [ ]` item
is a P0. Step 1 triaged and committed nothing: no new input. Rules 2 and 3 both
read `ok` at Step 0b, so rule 4 was reached for the first time in three wakes,
exactly as the previous hand-off predicted.

**Step 0 hit trap 1 for the ninth wake running** (detached HEAD at `bf2e7c2`,
`git branch --show-current` empty). Trap 2 clean in one `--unshallow` (**1,885**
commits); it brought the tags, and `git fetch --tags origin` was run explicitly
anyway and returned all seven.

### `274.2` — the remaining slab is in Step 0c, not Step 2

Both branches of the Accept are exercised: Step 0c loses a region of history,
and all eight Step 2 rules record why they keep theirs (in `ROADMAP.md` under
the item, never in the rule — that is 275.4's amendment).

**The one thing worth carrying: after 167.2, Step 2 has no archivable slab
left, and that is a measurement, not a judgement call.** The two precedents
moved slabs — 167.2 took **749** contiguous words out of rule 3, 191.3 took
**414** out of rule 4, and both survive as single archive sections. Step 2's
largest *paragraph* is **206** words, its median ~70, and the largest contiguous
*pure-narrative* block inside any of them is **~106**. Recovering the ~10
scattered fragments nets ~400 words for **ten pointer-follows per wake** — a
worse trade than either precedent, and the one 167.2's own losing argument
(*a pointer is read less than a paragraph*) warns against. Paragraph totals are
mechanical; the executed-versus-narrative split inside a paragraph is a **hand
classification and is named as one**, per CLAUDE.md on properties that depend on
what prose MEANS.

**Measured:** dispatch region **6,100 → 5,658 words (−442, −7.2%)**, Step 0c
**1,391 → 949**, Step 2 **3,211 unchanged**, **0** words added above
`## Playbooks`. The `by region` block reads `HEAD`, so it was **re-run at
`8848ed55`** — the commit carrying the figure — rather than off the working
tree; that is 275.3's bullet being executed rather than restated. The ratchet
now reads `LOOPS.md 0 up, last cut 8848ed55`, against 18 up / 0 cuts since
167.2's split.

**Premise re-checked before dispatching, per CLAUDE.md.** Step 2 reproduces
exactly (3,211 = 3,188 + a 23-word preamble; rule 4 980, rule 3 672, rule 6
631). Step 0c reads **1,391** to this wake's parser against the item's **1,378**
— the difference is exactly the section's **13-word heading**, so that is
agreement, not a disagreement.

**What stayed inline** is everything a wake executes or decides by: the
decision, the named cost, the correction that no guaranteed conflict catches a
collision, the `git fetch origin main` rule that actually does, the
keep-BOTH-row-sets conflict recipe, a one-line reason for each of the three
refusals, and the reopen condition. No other file cites the moved text (checked
with plain fixed strings); the single hit is a historical `loop-log.md` row.

**Nothing in this slice renders** — `LOOPS.md`, `LOOPS-archive.md`,
`ROADMAP.md`. No CSS, no docs page, no script, no built surface, so the
1440/390 light-and-dark screenshot lane a cloud wake cannot run has nothing to
say about this diff; that is an absence of subject, not an unverified claim.
**All 17 cloud-toolchain entry points ran green.** `check:claims`' *"3 NOT
VERIFIED"* is `ENVIRONMENT.md` 6b — this container reports
`(hover: hover) and (pointer: fine)` false — not a regression; its live count
rose **158 → 162** as the corpus grew.

**`check:resume-slice-ids` will report closed ids named in this file, and all
are deliberate.** `274.2`, `274.1`, `275.3`, `275.4` and `167.2`/`191.3` are
named as history — what was decided and why — not as queued work. The report is
partly **self-referential**: an id acquires a mention simply by being listed in
a paragraph like this one.

## Direction

Nothing new from the owner this wake; GitHub intake is empty (`list_issues` →
`totalCount: 0`). The standing owner blocks are unchanged: Slice 15's AT runtime
evidence (owner hardware), `112.3`/`112.4` (owner briefs, then 112.3's verdict),
and `249.7`, `249.10`-`249.13`.

**Two things now want the owner's attention, and the second is new this wake:**

1. **`273.2` is still the owner call worth their attention**, untouched again.
   `LOOPS.md` §3b step 5 mandates `dry++` on a Polish round whose score does not
   move; no round has ever done it. Of the 8 rounds recorded NO-OP, **6 filed a
   real defect found elsewhere and 2 found nothing**, so "the score did not move"
   and "the round was busywork" have come apart 6 times out of 8. Executing the
   rule as written would retire surfaces and empty a lane **176.3 already refused
   to narrow**; leaving it is a rule nothing runs.
2. **The cloud lane has run out of dispatchable build work.** With `274.2`
   closed, all 12 open items are owner-blocked (9) or need a LOCAL wake's
   screenshots (3). A cloud wake will keep finding Polish under rule 6, which is
   working as designed — but no *queued build item* will move until the owner
   answers something or a local wake takes `249.6`/`249.9`/`249.15`.

## `bundle-gz-kb` still cannot be sampled — eighteenth wake

259.1's rule-5 finding, re-verified this wake rather than re-derived:

```
grep -rln 'bundle-gz-kb' --include='*.mjs' --include='*.py' --include='*.ts' \
  --include='*.js' --include='*.json' . | grep -v node_modules
```

still returns exactly **one** file — `scripts/loops/record_metric.py` — and the
hit is its **docstring example** at line 6, `--value 7.0`. Nothing derives the
number. Do not "fix" rule 5's staleness by recording a guessed value.
