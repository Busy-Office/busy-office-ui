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
at hand-off. Two commits this wake, both pushed: Slice 288 and this hand-off.
One iteration recorded — `Continue · build`, with three refusals.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ NEXT WAKE: rule 3 is ARMED — but read the counter, do not act on this line

After this wake's row, `dispatch_status.py` reads rule 2 `3 / 4 … ok` and
**rule 3 `3 / 3 slices … OVERDUE [283, 284, 288]`**, so an Objective grill is
what rules 1-2 fall through to. Rule 5 read **STALE** (`3 wake-date(s) newer`)
and is reported as *could not be evaluated* — never clear.

Re-run `dispatch_status.py` anyway. The standing carried-forward finding is
that **a hand-off's claim about a dispatcher rule is a forecast, not a
measurement** — and this wake is a live example of why that discipline pays,
below.

**The counter credited `288` correctly.** `SLICE_TOP` reads the leading number
of the row's item text, which begins `288.1/288.2 — …`; item and record
coincide. Read immediately after recording, which is `LOOPS.md`'s own
instruction and the thing that has found two of that parser's five bugs.

**No collision this wake.** Step 0c's mandated `git fetch origin main` before
the first commit read `0 0` against `origin/main`; a second fetch before the
amend read `1 0` (this wake's own commit). **Do not skip it.**

## What landed this wake

**Slice 288 — 286.3, dispatched by rule 4 as the oldest cloud-takeable item.**
The item asked for a recorded decision on `LOOPS.md` §3b step 4 and required
its own base rate be re-run first. **Re-running it is what produced the
finding**, which is the Accept clause earning its keep.

- **The population moved, 20 → 22.** Slices 281 and 283 are Polish rounds filed
  after 286.3 was written. Red-proved by injection (a `## Slice 999 — Polish
  round` heading moved the count 22 → 23 and the parsed section count
  268 → 269, confirmed in the parser's output, then reverted and re-checked).
- **286.3's own bucket list is wrong in 4 of its 7 independent-pass entries**,
  each read from the slice's own words: **176** ran a *cited* re-score and says
  it "is not counted as §3b's independent second opinion"; **182** "could not
  run one"; **269** audited the two that had run without running one; and
  **242 — filed as a decline — is the round the ledger itself calls "the first
  this ledger has actually run"**, and it moved a score.
- **The diagnosis inverts.** *"171.1 measured this mechanism dead"* is a
  conflation: 171.1 measured that no dimension can **rank surfaces** (re-verified
  at 40 components), and step 4 does not rank — it asks whether ONE dimension is
  right on ONE surface. It found exactly that twice (`interaction: na` on a
  component that ships a behaviour, moved to 3 in 242 and 268), and Slice 269's
  arm 11 names those two independently as the only score-moving re-scores the
  ledger has run. **2 of 5 runs, both real defects: under-run, not dead.**
- **What was missing is the TRIGGER**, and §3b now states it. All nine declines
  give one reason — the round changed nothing on the scored surface, so there is
  no score to re-take. "*The load-bearing step*" is gone; the content is
  unchanged. 278's independent review is recorded as **permitted and NOT
  mandated** (n = 1, left Hypothesis exactly as 286.3 filed it).
- **The cost objection was answered by measurement, and the forecast was then
  corrected to a reading.** §3b is in the playbooks region. After the commit:
  dispatch **UNCHANGED** at `6,112 (+300.8%)`, playbooks `8,383 → 8,846`. The
  every-wake region did not move.

**Gates green in this container:** `build`, `test` **165**, `lint:css`,
`docs:build`, `check:repo` (`slice-refs` **849** assertions / **270** slice
numbers, `vendor-names`, `self-test` 53 gates), `check:claims` **167** live,
`check:formatting`, `check:layout` **127** pages, `test:axe` **127** pages x 2
widths zero violations. The *"3 NOT VERIFIED"* in `check:claims` is
`ENVIRONMENT.md` 6b — this container reports `(pointer: fine) = false` — not a
regression.

**Step 0 traps:** trap 1 bit again (detached HEAD, `git branch --show-current`
empty), fixed with `git checkout -B main origin/main` before any commit;
`origin/main` again arrived as a **forced update** (`26447ba...1de9717`). Trap 2
clean in one `--unshallow` (**1,922** commits, no `shallow.lock`) and it again
brought the tags (`git tag | wc -l` → **7**) — the **eighth** consecutive
container to do so, which is why that section states the count as the check.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots were
taken — a cloud wake has no Podman and no `:8081`. **None were needed and that
is checkable, not asserted:** the slice commit changes **0** CSS files and **0**
docs pages; both its files are markdown. Nothing in that diff renders.

## The open set is 14, and TWO are cloud-takeable

Each line re-classified from the item's own text per `LOOPS.md` 186.2.

- **cloud-takeable (2):** `286.4` (`fit`'s definition scores against a four-row
  field matrix that cannot reach every component it carries scores for) and
  `287.5` (re-attach the orphaned sentence in `LOOPS.md` §3b step 5 — **it is
  still orphaned; this wake edited §3b step 4 and deliberately did not touch
  it**, since it is a separate open item). Each has an Accept where a recorded
  refusal is a satisfying outcome.
- **owner-blocked (9):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3` and `112.4` (blocked on 112.3's verdict), `249.7` (its own text defers
  to 249.10, the owner's vocabulary column), `249.10`, `249.11`, `249.12`,
  `249.13`, `273.2`.
- **browser-blocked in the SCREENSHOT sense** (`ENVIRONMENT.md`'s FIRST list —
  a LOCAL wake can take these, a cloud wake cannot): `249.6`, `249.9`, `249.15`.
  Each has its cloud-takeable half already banked in its own text.
  **`249.6` has been declined at the clause level four times. Do not re-derive
  it a fifth.**

**Note for whoever dispatches rule 4 next:** with rule 3 armed, rule 4 is not
reached this coming wake. When it is, the cloud lane is down to two items.

## No archive sweep this wake, and the reason is 236.2's report

`roadmap_scope.py` reads **25.3%** closed-history share with 5 eligible targets
(288, 285, 284, 283, 282) — but **2 of them are NAMED by still-open items**:
Slice 283, by both `287.5` and `273.2`. 236.2's rule is that a sweep must check
what still-open items name before moving anything, and that report is what was
read before deciding not to move. Recorded as a refusal, not an omission.

## Direction

Nothing new from the owner this wake; GitHub intake is empty (`list_issues` →
`totalCount: 0`). The standing owner blocks are unchanged.

**Two things want the owner's attention:**

1. **`273.2` is the owner call worth their attention**, a twelfth wake
   untouched — whether a Polish round whose score does not move should
   increment `dry`. It is load-bearing in two further places now: 287.2's heal
   skips dry rows on `--apply`'s own rule, and **this wake's §3b edit makes the
   question sharper**, because the trigger clause now says outright that a cite
   repair or a NO-OP owes no re-score — which is precisely the round type
   `dry++` would otherwise retire a surface for. Re-measure before quoting:
   `grep -cE '^## Round .*NO-OP' .roundtable/polish-state.md` and
   `grep -cE '^## Round .*NOT a no-op'`; these are snapshots.

2. **286.3 is CLOSED and its conclusion was reversed by its own Accept.** The
   item was filed *for the owner* on the reading that step 4's mechanism is
   dead. It is not — it has moved a score twice on real shipped defects. The
   owner may still want to weigh whether the *independent-review* activity 278
   ran should become part of §3b; this wake deliberately left that at n = 1 and
   unmandated rather than deciding it. That is the one half of 286.3 a wake
   should not settle alone.

## `bundle-gz-kb` still cannot be sampled — twenty-eighth wake

259.1's rule-5 finding, re-verified this wake rather than re-derived:

```
grep -rln 'bundle-gz-kb' --include='*.mjs' --include='*.py' --include='*.ts' \
  --include='*.js' --include='*.json' . | grep -v node_modules
```

still returns exactly **one** file — `scripts/loops/record_metric.py` — and the
hit is its **docstring example** at line 6, `--value 7.0`. Nothing derives the
number. Do not "fix" rule 5's staleness by recording a guessed value.
