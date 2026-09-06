# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and **three** advisory checks run from `record_iteration.py` — the
> charter check, `check:resume-slice-ids`, and `polish_requeue.py
> --verify-stamps`. All three REPORT; none fails a build (roadmap 175.3). Run
> them against the file as it now stands rather than trusting a stale reading.

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

**Citation practice for this file: cite by slice number only, never by raw
`ROADMAP.md:NN`.** A slice number survives every rewrite; a line number
survives none.

---

## In flight: nothing

Last updated 2026-09-06 (**cloud** wake, scheduled routine). Working tree clean
at hand-off. Two commits this wake, both pushed: Slice 286.4 and this hand-off.
One iteration recorded — `Continue · build`, with two refusals.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ NEXT WAKE: rule 2 reads OVERDUE — but read the counter, do not act on this line

After this wake's row, `dispatch_status.py` reads **rule 2 `4 / 4 Continue
rounds … OVERDUE`** and rule 3 `1 / 3 slices … ok [286]`. So on the ordering
`LOOPS.md` states, a wake that finds no P0 reaches **rule 2 and dispatches
Standardize**, not rule 4. Rule 5 read **STALE** (`3 wake-date(s) newer`) and is
reported as *could not be evaluated* — never clear.

Re-run `dispatch_status.py` anyway. The standing carried-forward finding is
that **a hand-off's claim about a dispatcher rule is a forecast, not a
measurement.**

**Both counters were read immediately after recording** — `LOOPS.md`'s own
instruction, and the comparison that has found two of that parser's five bugs.
Both moved exactly as this wake's round predicts by hand: rule 2 `3/4 → 4/4`
(this Continue round), rule 3 `0/3 → 1/3 [286]` (Slice 286 closed by a Continue
row). No disagreement to chase.

**Standardize's four lanes are all cloud-runnable**, so the next wake is not
blocked on a local machine for that dispatch: `scan:dead-style`,
`report:css-repeats`, `report:prose`, and `report_loop_prose.py`. Note lane 4's
own rule — read the `ratchet` block and, for `LOOPS.md`, the `by region` block,
never the file delta.

**No collision this wake:** Step 0c's mandated `git fetch origin main`
immediately before the first commit read `0 0` against `origin/main`.

## What landed this wake

**Slice 286.4 — dispatched by rule 4** (rules 1-3 all read clear at dispatch
time: no P0, rule 2 `3 / 4 … ok`, rule 3 `0 / 3 … ok`). It was the **oldest
cloud-takeable open item**, which is the classification the previous hand-off
left and which re-derived correctly from each item's own text.

**The item's premise re-checks as stated, and the wording was NOT defensible.**

- **Premise holds.** The field matrix on `/concepts/design-language` has
  exactly **4** field-type rows; **40** components carry a `fit` score,
  distribution `{3: 39, 0: 1}`; `scan` is one of the 39.
- **Reach measured by an EXACT predicate, not a word count.** Counting a
  component's name on the page over-counts (`form` matches the column header
  "Standalone form (entry)", `date` matches `type="date"`), so reach is *does
  the matrix section link `/components/<name>`*. It links five, four of them
  scored — amount, form, money, quantity. **The stated reference set reaches 4
  of 40 and cannot assign a context to the other 36.** Whole-page control adds
  only `button` and `data-table`, so the gap is not an artefact of scoping to
  the section.
- **What settles it is that the cost was already paid.** Six `fit` cites invoke
  the matrix; five name a component the page mentions, and **`scan` appears 0
  times anywhere on it** while its own cite read *"prescribed where the field
  matrix puts it and nowhere else"*. That cite renders on `/components/scan` via
  `DsaScore.astro`, so a claim its stated authority does not contain was
  shipping. **Second correction to that one cite** — 279.1 fixed it for
  publishing an outbound Related list as an inbound fact.
- **Both ends fixed in one commit.** Two refusals recorded: widening the matrix
  with a `scan` row (that makes the definition true by editing the artefact it
  points at), and a gate — 94.11's base-rate test first, and the checkable shape
  is true of 5 of the 6 cites that mention the matrix and vacuously true of the
  34 that do not, so it would fire on a healthy tree.

**The removal trap in `CLAUDE.md` reproduced live, and is worth carrying.** A
naive `grep` for the removed phrase in `dist` still reports **1** hit — because
the new cite legitimately quotes the phrase it corrects. Asserted structurally
instead (what the cite *opens with*), which is the section's own instruction.

**Gates green in this container** (all 17 cloud entry points): `build`, `test`
**165**, `lint:css`, `docs:build` (`check:repo`), `check:claims` **167** live,
`check:formatting`, `check:scroll` **914** containers, `check:layout` **127**
pages, `check:forced-colors`, `test:axe` **127** pages x 2 widths zero
violations, `check:target-size`, `check:search`, `check:pseudo`,
`check:quickstart`, `check:po-app` **19** behaviours, `create-ui`, `suite` **28**
screens. The *"3 NOT VERIFIED"* in `check:claims` is `ENVIRONMENT.md` 6b — this
container reports `(pointer: fine) = false` — not a regression.

**Step 0 traps:** trap 1 bit again (detached HEAD, `git branch --show-current`
empty), fixed with `git checkout -B main origin/main` before any commit;
`origin/main` again arrived as a **forced update** (`26447ba...5b8917e`). Trap 2
clean in one `--unshallow` (**1,926** commits, no `shallow.lock`) and it again
brought the tags (`git tag | wc -l` → **7**) — the **tenth** consecutive
container to do so, which is why that section states the count as the check.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots were
taken — a cloud wake has no Podman and no `:8081`. **Unlike the previous three
wakes, this one is not a markdown-only diff, so this matters here:** the `scan`
cite is longer than the text it replaces and **does render** on
`/components/scan`, so its table cell grows. `check:layout` (no overflow at 390
or 150% zoom) and `test:axe` swept it green, but *"does it look right"* in the
two themes was NOT checked. The `fit` **definition** half renders nothing —
checkable, and checked: `rubric.definitions` has no consumer and the new text
appears **0** times in `dist`.

**Also NOT re-verified:** the preserved half of `scan`'s cite (4 of 39 pattern
screens running a live `[data-scan-input]`) is 279.1's measurement carried
forward unchanged. Its own method requires counting elements in the DOM across
frames; this wake did not re-take it and does not claim to have.

## The open set is 13, and ONE is cloud-takeable

Down one from 14 — this wake closed `286.4` and filed no new open item. Each
line re-classified from the item's own text per `LOOPS.md` 186.2.

- **cloud-takeable (1):** `287.5` (re-attach the orphaned sentence in `LOOPS.md`
  §3b step 5). The previous wake made it **actually executable** by correcting
  an Accept that named a commit which never touched `LOOPS.md` (`fc79ea85`,
  0 bytes) to `9c1bacbe`. The sentence **is still orphaned**, with the earlier
  bullet's 5-space indent mid-paragraph.
- **owner-blocked (9):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3` and `112.4` (blocked on 112.3's verdict), `249.7` (its own text defers
  to 249.10, the owner's vocabulary column), `249.10`, `249.11`, `249.12`,
  `249.13`, `273.2`.
- **browser-blocked in the SCREENSHOT sense** (`ENVIRONMENT.md`'s FIRST list —
  a LOCAL wake can take these, a cloud wake cannot): `249.6`, `249.9`, `249.15`.
  Each has its cloud-takeable half already banked in its own text.
  **`249.6` has been declined at the clause level four times. Do not re-derive
  it a fifth.**

**Note for whoever reaches rule 4 next:** it is **not** reached next wake if
rule 2 is still OVERDUE. When it is reached, the cloud lane holds exactly one
item, `287.5`.

## No archive sweep this wake, and the reason is 236.2's report

`roadmap_scope.py`, **re-run after this wake's commit**, reads **32.0%**
closed-history share (1578/4927) with **7** eligible targets (289, 288, **286**,
285, 284, 283, 282) — but **2 of them are NAMED by still-open items**: Slice
283, by both `287.5` and `273.2`; and Slice 289, by `287.5`. 236.2's rule is
that a sweep must check what still-open items name before moving anything, and
that report is what was read before deciding not to move. Recorded as a refusal,
not an omission.

**Read post-commit deliberately, and the first reading was wrong.** Taken before
the commit this same wake it read **27.5%** with **6** targets; closing 286.4
moved Slice 286 into closed history and into the target list. That is
`ENVIRONMENT.md`'s trap — *when your own commit changes the file, `HEAD` is the
pre-change state and is exactly as wrong as the tree* — which 273.1 and 274.1
each published from. The share has moved **25.4% → 27.5% → 32.0%** across three
wakes, so the sweep is getting close to worth doing; the next wake should weigh
it against whatever rule 2 dispatches.

## Direction

Nothing new from the owner this wake; GitHub intake is empty (`list_issues` →
`totalCount: 0`). The standing owner blocks are unchanged.

**Two things want the owner's attention:**

1. **`273.2` is still the owner call worth their attention**, a fourteenth wake
   untouched — whether a Polish round whose score does not move should
   increment `dry`. Re-measure before quoting:
   `grep -cE '^## Round .*NO-OP' .roundtable/polish-state.md` and
   `grep -cE '^## Round .*NOT a no-op'`; these are snapshots.

2. **Carried forward unchanged from the previous wake, because it is the
   owner's call and no wake should answer it for them:** whether *"a criterion
   may not embed a citation any more than a forecast"* earns a line in
   `CLAUDE.md`. It was deliberately not written there, since 284.2 has that
   file's accumulation open as a live question and adding a section to answer a
   finding about prose growth is the shape 274.1 refused. **This wake is a data
   point for the rule rather than against it:** 286.4's own Accept embedded no
   citation and was executable as written, which is what let a cloud wake close
   it in one round.

## `bundle-gz-kb` still cannot be sampled — thirtieth wake

259.1's rule-5 finding, re-verified this wake rather than re-derived:

```
grep -rln 'bundle-gz-kb' --include='*.mjs' --include='*.py' --include='*.ts' \
  --include='*.js' --include='*.json' . | grep -v node_modules
```

still returns exactly **one** file — `scripts/loops/record_metric.py` — and the
hit is its **docstring example** at line 6, `--value 7.0`. Nothing derives the
number. Do not "fix" rule 5's staleness by recording a guessed value.
