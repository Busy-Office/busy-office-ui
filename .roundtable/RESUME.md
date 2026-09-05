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
at hand-off. Two commits this wake, both pushed: Slice 274 and this hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## The counters, read right after this wake's recording

Read immediately after `record_iteration.py`, so it is a snapshot:

- **Rule 2 (Standardize)** read `4 / 4 … OVERDUE` at dispatch and this wake's
  row discharged it: **`0 / 4 … ok`**.
- **Rule 3 (Objective)** was `3 / 3 … OVERDUE [271, 272, 273]` at dispatch and
  rule 2 sits above it, so it did not fire. After this wake's recording it reads
  **`4 / 3 … OVERDUE [271, 272, 273, 274]`** — 274 crossed because a
  **Standardize** row names it, which is 161.4 executing correctly. **So the
  next wake dispatches Objective**, rule 2 now being clear. Read
  `dispatch_status.py` rather than trusting this sentence; it is a snapshot.
- **Rules 4-8 were NOT EVALUATED**, because rule 2 matched and Step 2 dispatches
  the first match. A rule below a match is unreached, not clear.
- **Rule 5 (Optimize)** read **STALE** (`2 wake-date(s) newer`) at Step 0b —
  report it *could not be evaluated*, never clear.

## The open set is 13, and ONE of it is now cloud-dispatchable

Re-read from `ROADMAP.md` this wake, classified per `LOOPS.md` 186.2:

- **owner-blocked (9):** Slice 15, `112.3`, `112.4`, `249.7`, `249.10`-`249.13`,
  and `273.2`.
- **browser-blocked in the SCREENSHOT sense** (`ENVIRONMENT.md`'s FIRST list —
  a LOCAL wake can take these): `249.6`, `249.9`, `249.15`.
- **NOT BLOCKED: `274.2`** — filed by this wake, markdown-only, and the item
  that rule 4 would reach next. Read its own text before taking it: it is a cut
  to the file that governs every wake, and this wake deliberately did not take
  it unattended.
- **agent-blocked:** none.

`roadmap_scope.py` reads **837 / 4,127 = 20.3%** closed history. No sweep is
due; re-run the script rather than trusting this.

## What landed this wake

**Dispatched by rule 2 (Standardize), which is above rule 3 and above rule 4.**
Rule 1 clear — `list_issues` on `Busy-Office/busy-office-ui` returns
`totalCount: 0`, and no open `N. [ ]` item is a P0. Step 1 triaged and committed
nothing: no new input. Both counters were exactly as the previous hand-off
predicted, which is the comparison `LOOPS.md` asks for right after recording.

**Step 0 hit trap 1 for the seventh wake running** (detached HEAD at `c32491a`,
no branch). Trap 2 clean in one `--unshallow` (**1,881** commits); it brought the
tags this time, and `git fetch --tags origin` was run explicitly anyway and
returned all seven.

### Slice 274 — the sweep ran 4 of 4 lanes, and lane 4's finding is about lane 4

Three things worth carrying:

1. **Lanes 1-3 clean, and lane 3 was checked by SET MEMBERSHIP, not by
   grepping.** 0 dead declarations of 1,433; the css-repeat set unchanged
   member-for-member; the prose report's flagged union is 15 pages, all inside
   the 16 verdicted (158.1's twelve, 161.1's three, 178.3's `/concepts/scale/`).
   228.1's record stands: grepping each page path out of `ROADMAP.md` + the
   archive returns hits whatever the truth is.
2. **The transferable finding: `report_loop_prose.py` measured the FILE where
   the burden is a REGION.** Every other row there is a file a wake opens end to
   end; `LOOPS.md` is not. Split at `## Playbooks`, the dispatch region went
   **+300.0%** over 158.2's window against the file's +220.4%, share 34.8% →
   43.5%. The whole-file row understates the very thing lane 4 exists to catch —
   the same error shape the script's header already recorded for summing
   `ROADMAP.md` with its archive. **If a row in a report covers more than what
   anyone reads, it is answering a question nobody asked.**
3. **A refusal that only became legible because of the fix.** Archiving the
   1,421-word Ideas backlog is the obvious cut and was refused: it sits below
   the anchor, so it moves the file 14,032 → 12,611 and leaves the dispatch
   region at **6,100 either way**. Round 2 confirmed this from the other
   direction — this wake's own `LOOPS.md` edit moved `playbooks + reference`
   7,932 → 8,062 and the dispatch region **not at all**.

**274.2 is filed OPEN and is the unresolved half**: the instrument now reports
the finding, and nothing has cut the region. Its Accept is written so that
finding nothing cuttable satisfies it.

**Nothing in this slice renders** — one Python instrument and two markdown
files, no CSS, no docs page, no built surface. So the 1440/390 light-and-dark
screenshot lane a cloud wake cannot run has nothing to say about this diff; that
is an absence of subject, not an unverified claim. All **17** cloud-toolchain
entry points ran green. `check:claims`' *"3 NOT VERIFIED"* is `ENVIRONMENT.md`
6b — this container reports `(hover: hover) and (pointer: fine)` false — not a
regression.

**`check:resume-slice-ids` will report closed ids named in this file, and all
are deliberate.** `274.1` LANDED this wake and is named as history, not as
queued work; `273.2` is named as an owner block and is genuinely open. Note the
report is partly **self-referential**: an id acquires a mention simply by being
listed in a paragraph like this one.

## Direction

Nothing new from the owner this wake; GitHub intake is empty (`list_issues` →
`totalCount: 0`). The standing owner blocks are unchanged: Slice 15's AT runtime
evidence (owner hardware), `112.3`/`112.4` (owner briefs, then 112.3's verdict),
and `249.7`, `249.10`-`249.13`.

**`273.2` is still the owner call worth their attention.** `LOOPS.md` §3b step 5
mandates `dry++` on a Polish round whose score does not move; no round has ever
done it. Of the 8 rounds recorded NO-OP, **6 filed a real defect found elsewhere
and 2 found nothing**, so "the score did not move" and "the round was busywork"
have come apart 6 times out of 8. Executing the rule as written would retire
surfaces and empty a lane **176.3 already refused to narrow**; leaving it is a
rule nothing runs.

## `bundle-gz-kb` still cannot be sampled — sixteenth wake

259.1's rule-5 finding, re-verified this wake rather than re-derived:

```
grep -rln 'bundle-gz-kb' --include='*.mjs' --include='*.py' --include='*.ts' \
  --include='*.js' --include='*.json' . | grep -v node_modules
```

still returns exactly **one** file — `scripts/loops/record_metric.py` — and the
hit is its **docstring example** at line 6, `--value 7.0`. Nothing derives the
number. Do not "fix" rule 5's staleness by recording a guessed value.
