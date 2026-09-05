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
at hand-off. Three commits this wake, all pushed: Slice 279 (the Polish round),
`279.4` (the dispatcher correction, found by reading the counter after
recording the first), and this hand-off. Two iterations recorded —
`Polish · round` and `Meta · dispatcher`.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ NEXT WAKE: RULE 3 IS OVERDUE. DISPATCH **OBJECTIVE**, NOT POLISH.

This is the one thing that must survive into the next wake, and it is new.

```
python3 scripts/loops/dispatch_status.py
#  Objective   5 / 3 slices   OVERDUE   [274, 276, 277, 278, 279]
```

Rule 3 sits **above** rule 4 and rule 6, so it matches before either. `279.4`
this wake found `Polish` had been excluded from `CLOSES_A_SLICE` on a fact that
died — Polish names a slice on 18 rows / 17 slices, **12 of them named by no
Continue/Standardize row at all** — so the counter had been blind for the whole
Polish-dispatched era. Adding Polish took the current window from `2 / 3 … ok`
to `5 / 3 … OVERDUE`.

**It was NOT re-dispatched this wake, deliberately**: Step 2 was evaluated at
dispatch when the counter read `ok`, and the correction is a finding OF the
dispatched round, not a re-entry into Step 2. The next wake reads the corrected
counter and dispatches Objective. Run §6 step 0 first — **narrow the arming set
before grilling it**, and check `.roundtable/INDEX.md` for repeated subjects;
274 and 278 were already in the set last wake, so the genuinely new material is
**276, 277, 279**.

## The counters, read right after this wake's recording

This is the comparison `LOOPS.md` rule 3 asks for, and **this wake is what
happens when you actually make it**: the counter did not move for a slice that
had just been closed by hand, and that disagreement is the whole of `279.4`.

- **Rule 2 (Standardize)** `3 / 4 … ok` at dispatch → **unchanged**. Correct: a
  `Polish` row is not a `Continue` round. One more Continue round and
  Standardize preempts the queued build item.
- **Rule 3 (Objective)** `2 / 3 … ok [274, 278]` at dispatch → **`5 / 3 …
  OVERDUE [274, 276, 277, 278, 279]`** after `279.4`'s correction. See above.
- **Rule 5 (Optimize)** read **STALE** (`2 wake-date(s) newer`) at Step 0b.
  Report it *could not be evaluated*, never clear.
- **Rules 7-8 were NOT EVALUATED**, because rule 6 matched. A rule below a match
  is unreached, not clear.

## The open set is 12, and none of it is cloud-takeable

Unchanged from last wake — all four `279.x` items closed within their own slice,
so the open count did not move. Re-read from `ROADMAP.md` after this wake's
commit, **each line re-classified from the item's own text** per `LOOPS.md`
186.2 rather than carried over:

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md      # 12  (12 at dispatch too)
python3 scripts/loops/roadmap_scope.py        # OPEN: [15, 112, 249, 273]
```

- **owner-blocked (9):** Slice 15 (AT runtime evidence, owner hardware), `112.3`
  (owner briefs) and `112.4` (blocked on 112.3's verdict), `249.7` (its own text
  holds the cost question until the owner answers `249.10`), `249.10`, `249.11`,
  `249.12`, `249.13` (each says **OWNER CALL** in its own line), and `273.2`.
- **browser-blocked in the SCREENSHOT sense** (`ENVIRONMENT.md`'s FIRST list — a
  LOCAL wake can take these, a cloud wake cannot): `249.6`, `249.9`, `249.15`.
  `249.6` was re-read at the CLAUSE level again this wake and it still has no
  separable cloud half; its own text banks that reasoning twice over. Do not
  re-derive it a fourth time.
- **agent-blocked:** none.
- **partly takeable:** none.

**A LOCAL wake still has three items a cloud wake cannot take**: `249.6`,
`249.9`, `249.15`. Each has its cloud-takeable half already measured and banked
in its own item text.

## What landed this wake

**Dispatched by rule 6 (Polish).** Rule 1 clear — `list_issues` on
`Busy-Office/busy-office-ui` returns `totalCount: 0`, and no open `N. [ ]` item
is a P0. Step 1 triaged and committed nothing: no new input. Rule 4 found
nothing takeable, **and its sweep clause was evaluated and refused** — see
`279.3`: closed-history share read **2,146 / 5,283 = 40.6%** at `4c3d635`,
below both measured triggers (**55.1%** at 252.1, **56.7%** at 272.1), and
`249.12` is the open **OWNER OR ARCHITECTURE CALL** on setting a threshold, so
a wake lowering it unilaterally would pre-empt that item.

**Step 0 hit trap 1 for the fifteenth wake running** (detached HEAD, `git branch
--show-current` empty), fixed with `git checkout -B main origin/main` before any
commit; `origin/main` again arrived as a **forced update**
(`26447ba...4c3d635`). Trap 2 clean in one `--unshallow` (**1,899** commits, no
`shallow.lock`), and **it brought all seven tags again** — second wake running
that `ENVIRONMENT.md` §2's "does NOT bring the tags" did not hold, so keep
verifying with `git tag | wc -l` rather than trusting either reading. The Step 0c
re-fetch before the first commit reported no movement — no second dispatcher.

**Polish round 3 on `scan`** — the first round 3 in this ledger. All 20
non-skipped rows tied at `content: 3`, `2/3`, `dry 0`, so the pick came from the
tie-break: `badge`, `scan`, `state-patterns` all last ran 2026-08-28, and within
that three-way tie `scan` is the only one with a behavior module.

**The pair arm was clean and the finding was one page down.** The question that
found the last three shipped defects — *does the behavior this page documents
actually run here?* — was asked of `/components/scan` with real input
(`page.click`/`page.type`/`page.keyboard.press`, never `el.click()`) and
answered **yes** end to end. Five of six cites hold. The sixth, `fit`, had
published `scan.astro`'s own **outbound** `Related` list as an **inbound** fact:
at `4c3d635`, `grep -c -F 'components/scan'` reads goods-receipt **0**,
rf-landing **0**, rf-count/rf-pick/rf-putaway **3** each. Chasing it found
`/patterns/goods-receipt` — whose opener says the screen is *"composed from
`data-scan-input`"* — running the component live and listing nothing for it,
**1 of 4**.

**`check-components-used.mjs` gained the converse arm it never had** (`279.2`),
narrowed to attribute-only components because the blanket form measures **357
misses across 39 of 39 pages**. Red-proved by deleting the one `<li>` from the
BUILT page with the match count asserted at exactly 1 first: **exactly 1** page
red, the other three RF screens green, green again on restore.

**The first instrument was wrong and INVERTED** — splitting built HTML on
`<pre>` reported goods-receipt live 1 and the other three live 0. An inline
`<code>data-scan-input</code>` in prose is not a `<pre>`, and the RF screens
render in a same-origin iframe. Count DOM elements across `page.frames()`.

**A blind re-score ran** (§3b step 4) and returned `fit = 3`, agreeing — logged
as the **weak** direction per 268.2, since the built page publishes the prior
verdict. It filed one observation, not acted on: `fit`'s rubric definition
scores against *"the field matrix"*, which has four rows and no `scan` row.
101.3 forbids a Polish round editing a rubric definition, so it waits for a
grill or the owner.

**All 17 cloud-toolchain entry points ran green**, with the list re-derived from
`ci.yml` rather than trusted — the two documented, opposite-direction
differences still hold. `check:claims` reports **167** live, unchanged; its
*"3 NOT VERIFIED"* is `ENVIRONMENT.md` 6b, not a regression. `check:repo` was
re-run after the post-build source edits.

**One thing in this diff renders, and it is named as UNVERIFIED.** **0** CSS
files changed, and `/patterns/goods-receipt` gains one `<li>` in an existing
badge cluster plus one `Related` entry, both byte-identical in shape to the
siblings already on that page. Whether it *looks* right in either theme at 1440
and 390 is the half a LOCAL wake owns. What **is** verified: `check:layout`
(127 pages), `check:scroll` (914 containers x 2 widths) and `test:axe`
(127 pages x 2 widths, zero violations).

**`check:resume-slice-ids` will report closed ids named in this file, and all
are deliberate.** `279.1`-`279.4`, `278`, `276`, `277`, `274`, `272.1`, `252.1`,
`268.2`, `249.17` and the rest are named as history, as counter evidence, or as
classification evidence — never as queued work. The report is partly
**self-referential**: an id acquires a mention simply by being listed here.

## Direction

Nothing new from the owner this wake; GitHub intake is empty (`list_issues` →
`totalCount: 0`). The standing owner blocks are unchanged: Slice 15's AT runtime
evidence (owner hardware), `112.3`/`112.4`, and `249.7`, `249.10`-`249.13`.

**Three things want the owner's attention:**

1. **The cloud lane is still dry, second wake running.** No cloud-takeable open
   item exists. The loop is not stuck — rule 3 fires next, then rule 6 — but
   every real shipped defect of the last four wakes came from items **the loop
   filed for itself**, not from the queue. Unblocking any one of
   `249.10`-`249.13` would refill it; `249.12` says *"OWNER OR ARCHITECTURE
   CALL"*, so it may not need the owner at all — and `279.3` this wake gave it
   a concrete cost, having declined a sweep for want of a stated threshold.

2. **`273.2` is still the owner call worth their attention**, an eighth wake
   untouched. Its tally is **unchanged** by this wake and that is deliberate:
   round 3 on `scan` is recorded **NOT a no-op** (the `fit` cite is a defect on
   the surface and was corrected), so it does not join the NO-OP set. Measured
   after writing: `grep -cE '^## Round .*NO-OP' .roundtable/polish-state.md` →
   **9**, `grep -cE '^## Round .*NOT a no-op'` → **5**.

3. **`279.4` changed a dispatcher rule, and the owner should know.** It is a
   correction, not a new judgement — 161.4's sole stated ground for excluding
   Polish was *"0 rows ever named a slice"*, which is now measurably false — but
   it does change what the loop does next wake (Objective instead of Polish),
   and it adds ~25 lines to `LOOPS.md`'s dispatch region, the half 274.1 flagged
   as the real burden. Both costs are named in the item rather than left for
   lane 4 to find. Reopen it by measuring, not by arguing: the replay method and
   its figures are in `dispatch_status.py` beside `CLOSES_A_SLICE`.

**Worth pointing at:** the *"do two things documented as a pair actually talk?"*
question went **four for four** and then broke its streak in a useful way — on
`scan` the pair arm came back clean, and the defect was one document down, in
the pattern screen the component's page points at. The generalisation is
**follow the link**: when a component page names a screen, check that the screen
names it back.

## `bundle-gz-kb` still cannot be sampled — twenty-fourth wake

259.1's rule-5 finding, re-verified this wake rather than re-derived:

```
grep -rln 'bundle-gz-kb' --include='*.mjs' --include='*.py' --include='*.ts' \
  --include='*.js' --include='*.json' . | grep -v node_modules
```

still returns exactly **one** file — `scripts/loops/record_metric.py` — and the
hit is its **docstring example** at line 6, `--value 7.0`. Nothing derives the
number. Do not "fix" rule 5's staleness by recording a guessed value.
