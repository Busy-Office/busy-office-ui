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
at hand-off. Two commits this wake, both pushed: Slice 275 and this hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## The counters, read right after this wake's recording

Read immediately after `record_iteration.py`, so it is a snapshot:

- **Rule 2 (Standardize)** read `0 / 4 … ok` at dispatch and still does.
- **Rule 3 (Objective)** was `4 / 3 … OVERDUE [271, 272, 273, 274]` at dispatch
  and fired; this wake's Objective row **discharged it to `0 / 3 … ok`**.
- **So the next wake reaches rule 4 for the first time in three wakes** — rules
  2 and 3 are both clear, and rule 4 is the first rule below them that can
  match. Read `dispatch_status.py` rather than trusting this sentence; it is a
  snapshot.
- **Rules 4-8 were NOT EVALUATED this wake**, because rule 3 matched and Step 2
  dispatches the first match. A rule below a match is unreached, not clear.
- **Rule 5 (Optimize)** read **STALE** (`2 wake-date(s) newer`) at Step 0b —
  report it *could not be evaluated*, never clear.

## The open set is 13, and ONE of it is cloud-dispatchable

Re-read from `ROADMAP.md` this wake, classified per `LOOPS.md` 186.2:

- **owner-blocked (9):** Slice 15, `112.3`, `112.4`, `249.7`, `249.10`-`249.13`,
  and `273.2`.
- **browser-blocked in the SCREENSHOT sense** (`ENVIRONMENT.md`'s FIRST list —
  a LOCAL wake can take these): `249.6`, `249.9`, `249.15`.
- **NOT BLOCKED: `274.2`** — markdown-only, and the item rule 4 reaches next.
  **Its Accept was AMENDED by 275.4 this wake; read the amended text, not the
  original.** The no-cut branch used to say each rule *"carries"* its reason,
  which puts the words inside Step 2 — eight rules at Step 2's own median of 12
  words per line is **+96 words above `## Playbooks`**, against the **+100** the
  dispatch region grew in the four days since 2026-09-01. It now says the reason
  is recorded in `ROADMAP.md` under the item, and that the commit adds **0 words
  above the anchor**.
- **agent-blocked:** none.

`roadmap_scope.py` reads **1,006 / 4,335 = 23.2%** closed history. No sweep is
due (272's eleventh sweep dispatched at 56.7%); re-run the script rather than
trusting this. Note its `29 closed` and the slice-id check's `31 closed` differ
by exactly the **2 items under a non-slice heading** it reports separately —
that is agreement, not a discrepancy.

## What landed this wake

**Dispatched by rule 3 (Objective).** Rule 1 clear — `list_issues` on
`Busy-Office/busy-office-ui` returns `totalCount: 0`, and no open `N. [ ]` item
is a P0. Step 1 triaged and committed nothing: no new input. Both counters were
exactly as the previous hand-off predicted, which is the comparison `LOOPS.md`
asks for right after recording.

**Step 0 hit trap 1 for the eighth wake running** (detached HEAD at `e322501`,
no branch). Trap 2 clean in one `--unshallow` (**1,883** commits); it brought the
tags, and `git fetch --tags origin` was run explicitly anyway and returned all
seven.

### Slice 275 — the grill's three defects are one shape

Scope was all four armed slices: the most recent grill is **Slice 265 (263,
264)** and no grill in either file names 271-274, so §6 step 0's re-arming case
did not apply. Full report:
`.roundtable/grill-objective-271-272-273-274-2026-09-05.md`.

**The one thing worth carrying: a figure the wake's own commit moves, read from
`HEAD`, is exactly as wrong as one read from the working tree — and
ENVIRONMENT's bullet named only the tree.** Two consecutive wakes broke it from
that side, in the two newest slices of the arming set:

1. **274.1's Accept** enumerates four `--since` verdicts; at `aa550d2c`, the
   commit that carries them, `--since 2026-09-04` prints **SLOWER** where the
   Accept says FASTER. That commit's own `LOOPS.md` edit (+130 words to
   playbooks, 0 to dispatch) is what flipped it. **The criterion's property half
   holds** — both branches still print on real data — so the defect is that the
   Accept names values at all, which is CLAUDE.md's criterion rule. 274.2, one
   item below, states that rule correctly: the same commit obeys and breaks it.
2. **273.1's "16 of the 20 non-skipped rows"** is **17** at `d8c9b5d1`, its own
   commit; the seventeenth is the `byline` row that round wrote. Its conclusion
   is unaffected — `dry > 0` and `budget_spent` read 0 at all three revisions.
3. **274.2's no-cut branch** grew the region it exists to shrink (275.4, above).

**275.3 is the durable half**: `ENVIRONMENT.md`'s figure bullet now names `HEAD`
alongside the working tree, and carries the case the bullet could not cover —
when a **script** produces the figure, `git show :<file>` is not available at
all, so name the revision the reading describes or re-run after committing.

**Controls reproduced exactly**, stated because an audit that only reports
defects has not shown its instrument can agree: 274's Step 2 split member for
member against an independently written parser (3,211 = 3,188 + a 23-word
preamble), `--self-test` at 12 cases, the anchor in **87 of 87** revisions;
273's **21** `bo-byline--compact` markup uses and 273.3 to the cell (jsdom over
138 built pages — `.bo-byline` on 10, inside a real `td`/`th` on exactly **2** =
**5** cells, old headline **0** in `dist`, new **1**); 272's **17/17** stubs and
**17/17** archived with 0 open checkboxes stranded; 271's corrected noun, the
gate reading **800** assertions / 299 cited / 699 files / 257 sections.

**Nothing in this slice renders** — `ROADMAP.md`, `ENVIRONMENT.md` and one
`.roundtable/` report; no CSS, no docs page, no script, no built surface. So the
1440/390 light-and-dark screenshot lane a cloud wake cannot run has nothing to
say about this diff; that is an absence of subject, not an unverified claim.
`LOOPS.md` is **not in the diff at all**, so the dispatch region is unmoved at
**6,100**. `check:claims`' *"3 NOT VERIFIED"* is `ENVIRONMENT.md` 6b — this
container reports `(hover: hover) and (pointer: fine)` false — not a regression.

**`check:resume-slice-ids` will report closed ids named in this file, and all
are deliberate.** `274.1`, `273.1` and `275.1`-`275.4` are named as history —
what was corrected and why — not as queued work; `274.2` and `273.2` are
genuinely open. The report is partly **self-referential**: an id acquires a
mention simply by being listed in a paragraph like this one.

## Direction

Nothing new from the owner this wake; GitHub intake is empty (`list_issues` →
`totalCount: 0`). The standing owner blocks are unchanged: Slice 15's AT runtime
evidence (owner hardware), `112.3`/`112.4` (owner briefs, then 112.3's verdict),
and `249.7`, `249.10`-`249.13`.

**`273.2` is still the owner call worth their attention**, and this wake did not
touch it. `LOOPS.md` §3b step 5 mandates `dry++` on a Polish round whose score
does not move; no round has ever done it. Of the 8 rounds recorded NO-OP, **6
filed a real defect found elsewhere and 2 found nothing**, so "the score did not
move" and "the round was busywork" have come apart 6 times out of 8. Executing
the rule as written would retire surfaces and empty a lane **176.3 already
refused to narrow**; leaving it is a rule nothing runs.

## `bundle-gz-kb` still cannot be sampled — seventeenth wake

259.1's rule-5 finding, re-verified this wake rather than re-derived:

```
grep -rln 'bundle-gz-kb' --include='*.mjs' --include='*.py' --include='*.ts' \
  --include='*.js' --include='*.json' . | grep -v node_modules
```

still returns exactly **one** file — `scripts/loops/record_metric.py` — and the
hit is its **docstring example** at line 6, `--value 7.0`. Nothing derives the
number. Do not "fix" rule 5's staleness by recording a guessed value.
