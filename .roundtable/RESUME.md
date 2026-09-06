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
at hand-off. Two commits this wake, both pushed: Slice 287 and this hand-off.
One iteration recorded — `Continue · build`, with two refusals.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ NEXT WAKE: read the counter, do not act on this paragraph

After this wake's row, rule 2 reads `1 / 4` and rule 3 `1 / 3 [283]` — **no
counter is armed**. Rule 4 takes the oldest dispatchable item; if it finds none,
rule 6 (Polish) does. Rule 5 read **STALE** (`3 wake-date(s) newer`) and is
reported as *could not be evaluated* — never clear.

`284.2`, `286.3`, `286.4` and the new `287.5` are all cloud-takeable, so a cloud
wake reaching rule 4 has work. Re-run `dispatch_status.py` anyway: the standing
carried-forward finding is that **a hand-off's claim about a dispatcher rule is
a forecast, not a measurement.**

**No collision this wake.** Step 0c's mandated `git fetch origin main` before
the first commit read `0 0` against `origin/main` — the first wake in three
with nothing to reconcile. It still cost nothing to run. **Do not skip it.**

## What landed this wake

**Slice 287 — 283.3, dispatched by rule 4 as the oldest cloud-takeable item.**
The item asked whether "ordering plus an advisory check" is enough, and offered
a refusal branch conditioned on one number: how many rounds since 283.2 stamped
early.

- **287.1 — the number is a denominator, not a rate: `0`.** No Polish round has
  run since 283.2 landed (`fc79ea85`, 2026-09-05T20:54:30+00:00). Four
  iterations have been recorded since — `Continue · build`, `Standardize ·
  sweep`, two `Objective · grill` — and none is Polish. So `--verify-stamps`
  reading **21 of 21 green** is not evidence of sufficiency; it is evidence
  that the two known-bad rows were repaired by hand and nothing has been able
  to break since. **The refusal branch was therefore refused**: "the advisory
  check is sufficient" would be a claim about 0 of 0 rounds. Counted twice,
  with `awk` and with an independent Python parse, which agree: 34 Polish rows
  ever, 0 after the cut, 12 rows after it.
- **287.2 — what was measurable is that the repair was already computed and
  printed, and nothing ran it.** `stamp_provenance` already separated the
  mid-round fault from every other non-reproducing stamp and already emitted
  `--restamp <surface> --at <rev>`. Shipped: the verdict is split
  (`orphan-midround`), the function returns the revision, and `heal_midround`
  applies the repair as `digest@rev`. **It runs from `--apply` at Polish step 0,
  not from the post-commit report** — step 0 already writes this ledger, so a
  healed row is committed by the round about to happen, where healing from
  `record_iteration.py` would edit a tracked file *after* the slice commit and
  invent a new way to hand off a dirty tree. Healing happens *before* the
  re-queue set is computed, or the repair would manufacture a false
  `RE-QUEUED` on the row it just fixed.
- **287.3 — red-proved by injection with a control**, in a worktree removed
  afterwards; `main` carries none of it. Both rows injected in ONE commit and
  the injection confirmed **in the commit** (`git show --stat`, `git show
  HEAD:.roundtable/polish-state.md`), never in the file: `component/tree`
  (source touched in the same commit) → `orphan-midround` → healed;
  `component/icon` (source untouched) → `orphan` → left alone. Then three more
  readings: the healed row drops out of `--check`'s re-queue set, which is
  computed by `digest()` over the working tree — **a different function** from
  the `digest_paths(…, rev)` that produced the heal, so two code paths agree on
  the value; a second `--apply` printed `ledger UNCHANGED`; and with a further
  commit touching the same CSS the heal still restamped at the introducing
  commit and the row **still re-queued**, so the repair does not erase a real
  signal.

**Gates green in this container, all eight, zero failures:** `build`, `test`,
`lint:css`, `docs:build` (runs `check:repo`), `check:claims` **167** live (the
*"3 NOT VERIFIED"* is `ENVIRONMENT.md` 6b — this container reports
`(pointer: fine) = false` — not a regression), `check:formatting`,
`check:layout` **127** pages, `test:axe` **127** pages x 2 widths zero
violations.

**Step 0 traps:** trap 1 bit again (detached HEAD, `git branch --show-current`
empty), fixed with `git checkout -B main origin/main` before any commit;
`origin/main` again arrived as a **forced update** (`26447ba...299ee22`). Trap 2
clean in one `--unshallow` (**1,918** commits, no `shallow.lock`) and it again
brought the tags (`git tag | wc -l` → **7**) — the sixth consecutive container
to contradict the value that section used to state, which is why it now states
the count as the check.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots were
taken — a cloud wake has no Podman and no `:8081`. **None were needed and that
is checkable, not asserted:** the commit changes **0** CSS files and **0** docs
pages; its three files are one Python script and two markdown documents the
loop reads. Nothing in this diff renders.

## The open set is 16, and FOUR are cloud-takeable

Each line re-classified from the item's own text per `LOOPS.md` 186.2:

- **cloud-takeable (4):** `284.2` (a verdict for `CLAUDE.md`'s accumulation on
  158.1's three-way split), `286.3` (is §3b step 4's real value a different
  activity from the dead dimension re-score?), `286.4` (`fit`'s definition
  scores against a four-row field matrix), and the new **`287.5`** below. Each
  has an Accept where a recorded refusal is a satisfying outcome.
- **owner-blocked (9):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3` and `112.4` (blocked on 112.3's verdict), `249.7` (its own text
  defers to 249.10, the owner's vocabulary column), `249.10`, `249.11`,
  `249.12`, `249.13`, `273.2`.
- **browser-blocked in the SCREENSHOT sense** (`ENVIRONMENT.md`'s FIRST list —
  a LOCAL wake can take these, a cloud wake cannot): `249.6`, `249.9`,
  `249.15`. Each has its cloud-takeable half already banked in its own text.
  **`249.6` has been declined at the clause level four times. Do not re-derive
  it a fifth.**

**`287.5` is the new one and it is deliberately small:** `LOOPS.md` §3b step 5
carries a run-on paragraph left by 283.2's own edit — the sentence beginning
*"This is what reconciles the budgets…"* belongs to the `dry++` bullet above it
and now trails the `--stamp` ordering paragraph, keeping that bullet's 5-space
indent mid-paragraph. Not fixed here on purpose: this wake's diff is already
inside that paragraph, and repairing prose you are editing around is how a bulk
edit gets verified against its own diff. Its Accept admits *"283.2 meant it"* as
a satisfying no-change outcome.

## Direction

Nothing new from the owner this wake; GitHub intake is empty (`list_issues` →
`totalCount: 0`). The standing owner blocks are unchanged.

**Two things want the owner's attention:**

1. **`273.2` is the owner call worth their attention**, a tenth wake untouched
   — whether a Polish round whose score does not move should increment `dry`.
   It is now load-bearing in a second place: 287.2's heal skips dry rows on
   `--apply`'s own rule, so whichever way 273.2 is decided changes which rows
   the repair can reach. Re-measure before quoting:
   `grep -cE '^## Round .*NO-OP' .roundtable/polish-state.md` and
   `grep -cE '^## Round .*NOT a no-op'`; these are snapshots.

2. **`286.3` is still the one that changes how the loop works** — §3b step 4,
   the *load-bearing step*, absent from 13 of 20 Polish rounds because its
   stated mechanism is one 171.1 already measured as dead. Carried forward
   unchanged from the last hand-off; base rate is Evidence, the yield claim is
   **n = 1** and is Hypothesis.

**Worth pointing at, and it is an observation rather than a finding:** the rule-3
counter credited this wake's row to **Slice 283**, not 287, because the item text
begins `283.3 — …` and `SLICE_TOP` reads the leading number. Both readings are
defensible — 283.3 is the item, 287 is the record — and `dispatch_status.py`'s
own header already refuses a sixth parser widening on measured grounds. Recorded
so the next wake reading `[283]` is not surprised by it, **not** re-reported as
a new bug.

## `bundle-gz-kb` still cannot be sampled — twenty-sixth wake

259.1's rule-5 finding, re-verified this wake rather than re-derived:

```
grep -rln 'bundle-gz-kb' --include='*.mjs' --include='*.py' --include='*.ts' \
  --include='*.js' --include='*.json' . | grep -v node_modules
```

still returns exactly **one** file — `scripts/loops/record_metric.py` — and the
hit is its **docstring example** at line 6, `--value 7.0`. Nothing derives the
number. Do not "fix" rule 5's staleness by recording a guessed value.
