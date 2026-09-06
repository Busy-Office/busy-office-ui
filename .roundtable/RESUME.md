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
at hand-off. Two commits this wake, both pushed: Slice 289 and this hand-off.
One iteration recorded — `Objective · grill`, with five refusals.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ NEXT WAKE: rules 1-3 all read clear — but read the counter, do not act on this line

After this wake's row, `dispatch_status.py` reads rule 2 `3 / 4 … ok` and
**rule 3 reset to `0 / 3 slices … ok`**, so rules 1-3 fall through and **rule 4
is what a wake reaches**. Rule 5 read **STALE** (`3 wake-date(s) newer`) and is
reported as *could not be evaluated* — never clear.

Re-run `dispatch_status.py` anyway. The standing carried-forward finding is
that **a hand-off's claim about a dispatcher rule is a forecast, not a
measurement.**

**The counter reset correctly**, read immediately after recording — which is
`LOOPS.md`'s own instruction and the thing that has found two of that parser's
five bugs. No collision this wake: Step 0c's mandated `git fetch origin main`
before the first commit read `0 0` against `origin/main`.

## What landed this wake

**Slice 289 — an Objective grill, dispatched by rule 3 (`3 / 3 OVERDUE
[283, 284, 288]`).** Scope narrowed per the playbook's step 0: **Slices 283 and
284 were already grilled in full by Slice 285**, so the honest subject is the
three *items* built since the last Objective row — `283.3` (`e68ede5f`, filed
under Slice 287), `284.2` (`167a1092`), `288.1`/`288.2` (`d257b9b8`).

**22 of 28 assertions reproduce, and all six failures sit beside no command.**

- **The one that matters is not a wrong number — it is a recorded command
  attached to a claim it does not establish.** 287.1 labels `fc79ea85` as
  where 283.2 landed. The date reproduces; the label does not. `fc79ea85` is
  Slice 283, which **filed** 283.2; 283.2 **landed** at `9c1bacbe`, whose own
  subject says so. 287.1's conclusion is untouched (0 Polish rounds after
  either boundary).
- **It propagated into an item that is still OPEN.** `287.5`'s Accept told the
  next wake to read `git show fc79ea85 -- LOOPS.md` — **0 bytes**. One of two
  Accept branches was satisfiable only by reading an empty diff. **A criterion
  may not embed a citation any more than a forecast**, and this fails more
  quietly: a wrong forecast is contradicted by the measurement, a wrong
  citation returns nothing, and nothing reads as an answer. Corrected at 287.5
  (a live instruction); annotated, not rewritten, at 287.1 (285.2's rule).
- **Two more, both 192.1's shape.** 284.2's concentration paragraph carries
  five figures with no instrument, and the item's own normalization reproduces
  none (2,972 not 2,882; 1,423 not 1,376; 814 not 768, over the same five
  sections) — the HONEST verdict is untouched, resting on four instruments that
  all reproduce. 288's instrument B has no command recorded and the repo's own
  three patterns give 19 / `{216,239,240}` / `{}`, never `179` — A (22) is what
  288 used and A reproduces exactly.
- **No gate proposed**, and 94.11's base-rate test is why: "is this sha the one
  this sentence means" is semantic, and the checkable shape (a sha in a fence
  beside a claim) is close to universally true here. Measured before writing
  one, not after.

**Gates green in this container:** `build`, `test` **165**, `lint:css`,
`docs:build`, `check:repo` (`slice-refs` **850** assertions / **271** slice
numbers, `self-test` 53 gates), `check:claims` **167** live,
`check:formatting`, `check:layout` **127** pages, `test:axe` **127** pages x 2
widths zero violations. The *"3 NOT VERIFIED"* in `check:claims` is
`ENVIRONMENT.md` 6b — this container reports `(pointer: fine) = false` — not a
regression.

**Step 0 traps:** trap 1 bit again (detached HEAD, `git branch --show-current`
empty), fixed with `git checkout -B main origin/main` before any commit;
`origin/main` again arrived as a **forced update** (`26447ba...59bcb04`). Trap 2
clean in one `--unshallow` (**1,924** commits, no `shallow.lock`) and it again
brought the tags (`git tag | wc -l` → **7**) — the **ninth** consecutive
container to do so, which is why that section states the count as the check.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots were
taken — a cloud wake has no Podman and no `:8081`. **None were needed and that
is checkable, not asserted:** the slice commit changes **0** CSS files and **0**
docs pages; both its files are markdown. Nothing in that diff renders.

## The open set is 14, and TWO are cloud-takeable

Unchanged in membership — this wake filed no new open item. Each line
re-classified from the item's own text per `LOOPS.md` 186.2.

- **cloud-takeable (2):** `286.4` (`fit`'s definition scores against a four-row
  field matrix that cannot reach every component it carries scores for) and
  `287.5` (re-attach the orphaned sentence in `LOOPS.md` §3b step 5). **`287.5`
  is now actually executable** — its Accept named a commit that never touched
  `LOOPS.md`; this wake corrected it to `9c1bacbe` and recorded that the
  sentence itself predates both commits (`3ddeb683`), so the live question is
  only whether `9c1bacbe` meant to leave it trailing. The sentence **is still
  orphaned**, with the earlier bullet's 5-space indent mid-paragraph; this wake
  deliberately did not move it, because that is rule 4's dispatch, not this one.
- **owner-blocked (9):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3` and `112.4` (blocked on 112.3's verdict), `249.7` (its own text defers
  to 249.10, the owner's vocabulary column), `249.10`, `249.11`, `249.12`,
  `249.13`, `273.2`.
- **browser-blocked in the SCREENSHOT sense** (`ENVIRONMENT.md`'s FIRST list —
  a LOCAL wake can take these, a cloud wake cannot): `249.6`, `249.9`, `249.15`.
  Each has its cloud-takeable half already banked in its own text.
  **`249.6` has been declined at the clause level four times. Do not re-derive
  it a fifth.**

**Note for whoever dispatches rule 4 next:** rule 4 IS reached this coming wake,
and the cloud lane holds exactly those two items — `286.4` is the older.

## No archive sweep this wake, and the reason is 236.2's report

`roadmap_scope.py` read **25.4%** closed-history share with 5 eligible targets
(288, 285, 284, 283, 282) — but **2 of them are NAMED by still-open items**:
Slice 283, by both `287.5` and `273.2`. 236.2's rule is that a sweep must check
what still-open items name before moving anything, and that report is what was
read before deciding not to move. Recorded as a refusal, not an omission.

## Direction

Nothing new from the owner this wake; GitHub intake is empty (`list_issues` →
`totalCount: 0`). The standing owner blocks are unchanged.

**Two things want the owner's attention:**

1. **`273.2` is still the owner call worth their attention**, a thirteenth wake
   untouched — whether a Polish round whose score does not move should
   increment `dry`. Re-measure before quoting:
   `grep -cE '^## Round .*NO-OP' .roundtable/polish-state.md` and
   `grep -cE '^## Round .*NOT a no-op'`; these are snapshots.

2. **Three consecutive wakes have now shipped a figure with no command beside
   it, and this grill found all three at once.** The rule already exists in
   `CLAUDE.md` (*"write the command next to the claim"*); what is new is the
   sub-case worth a line in it — **a criterion may not embed a citation any
   more than a forecast**. Deliberately NOT written into `CLAUDE.md` by this
   wake: 284.2 has that file's accumulation open as a live question, and adding
   a section to answer a finding about prose growth is the shape 274.1 refused
   (optimising the instrument). It is the owner's call whether it earns one.

## `bundle-gz-kb` still cannot be sampled — twenty-ninth wake

259.1's rule-5 finding, re-verified this wake rather than re-derived:

```
grep -rln 'bundle-gz-kb' --include='*.mjs' --include='*.py' --include='*.ts' \
  --include='*.js' --include='*.json' . | grep -v node_modules
```

still returns exactly **one** file — `scripts/loops/record_metric.py` — and the
hit is its **docstring example** at line 6, `--value 7.0`. Nothing derives the
number. Do not "fix" rule 5's staleness by recording a guessed value.
