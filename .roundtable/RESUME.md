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
at hand-off. Two commits this wake, both pushed: Slice 290 and this hand-off.
One iteration recorded — `Standardize · sweep`, with one refusal.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ NEXT WAKE: rules 2 and 3 both reset, so rule 4 is reached — but read the counter

After this wake's rows, `dispatch_status.py` reads **rule 2 `0 / 4 Continue
rounds … ok`** (this Standardize round reset it) and **rule 3 `2 / 3 slices …
ok [286, 290]`**. So on the ordering `LOOPS.md` states, a wake that finds no P0
falls through rules 2 and 3 and **reaches rule 4** — the first wake to do so in
several. Rule 5 read **STALE** (`3 wake-date(s) newer`) and is reported as
*could not be evaluated*, never clear.

Re-run `dispatch_status.py` anyway. The standing carried-forward finding is
that **a hand-off's claim about a dispatcher rule is a forecast, not a
measurement.**

**Both counters were read immediately after recording** — `LOOPS.md`'s own
instruction, and the comparison that has found two of that parser's five bugs.
Both moved exactly as this wake's round predicts by hand: rule 2 `4/4 → 0/4`,
rule 3 `1/3 [286] → 2/3 [286, 290]` (Slice 290 closed by a **Standardize** row,
which counts under 279.4's amendment). No disagreement to chase.

**No collision this wake:** Step 0c's mandated `git fetch origin main`
immediately before the first commit read `0 0` against `origin/main`.

## What landed this wake

**Slice 290 — dispatched by rule 2**, which read `4 / 4 Continue rounds …
OVERDUE` exactly as the previous hand-off forecast. Rule 2 sits above the queued
build item deliberately, so `287.5` was NOT taken; it is still the cloud lane's
one item.

**All four lanes ran and all four are clean. The reading worth carrying is why
that is honest rather than dead**, since three sweeps in a row (214, 284, this
one) have now read lane 1 at **1,433** and lane 2 at **242 / 230 / 8**:

- **Lane 1's input has not moved in a week.** Its source surface reads **390
  inline `style=` declarations in 79 files** at Slice 214, at Slice 284 and at
  HEAD, and `git diff --stat 1de97177 HEAD -- packages/core/src/css` is
  **empty**. Quoted as the *source proxy* it is — 1,433 counts rendered
  instances across the built corpus, not the same number.
- **Lane 2 is the control that proves the sweep is not measuring a frozen
  tree.** Its input DID move across the 214 window — **43 CSS files, +282 /
  −23** — and it still reads 8 with the same membership. The joined-control
  `x4` group is still **two** components, so its reopen trigger is unmet.
- **Lane 3:** 15 distinct flagged pages, the same 15 Slice 284 checked, **0
  unverdicted**. Corpus 118 pages · median 792 · 111,555 words.

**Lane 4 retires a worry Slice 284 recorded and deliberately did not file.**
284 measured `LOOPS.md`'s dispatch region at 6,112 — *"+454 in the same day,
more than the cut removed"* — and declined on *"one day is not a trend"*. Two
more `LOOPS.md` commits have landed since and the region is **flat**:

```
8848ed55  dispatch 5,658  file 13,720   ← 274.2's cut
632bfc46  dispatch 5,961  file 14,023
9c1bacbe  dispatch 6,112  file 14,272   ← 284's reading
e68ede5f  dispatch 6,112  file 14,495
d257b9b8  dispatch 6,112  file 14,958
```

**+686 words of file, +0 of dispatch region.** This wake's own `LOOPS.md`
addition also landed below the `## Playbooks` anchor — verified after editing,
the region still reads **6,112**. The cumulative `+300.8%` vs `+241.5%` in the
report is a *window* figure carrying that older history; reading it as a current
trend is the mistake the slice entry exists to prevent.

**290.1 is a REFUSAL, recorded in `LOOPS.md`'s settled region** so the next
sweep does not re-raise it: `_common.parse_log_line` and `dispatch_status.ROW`
both read `loop-log.md` and are not one decision stored twice. They agree
**1,480 / 1,480 / 1,480** against a raw bullet count with **0** rows seen by
only one — so the live file cannot separate them, and the refusal rests on
discrimination against synthetic input instead: a legacy 4-field row parses with
**`mode=None`** under the first and **does not match** the second. The recovery
path must be tolerant; the counter rules 2 and 3 read must not be.

**Gates green in this container** (all 17 cloud entry points): `build`, `test`
**165**, `lint:css`, `docs:build` (`check:repo`, incl. `slice-refs` **853**
assertions and `loop-vocab`), `check:claims` **167** live, `check:formatting`,
`check:scroll` **914** containers, `check:layout` **127** pages,
`check:forced-colors`, `test:axe` **127** pages x 2 widths zero violations,
`check:target-size`, `check:search`, `check:pseudo`, `check:quickstart`,
`check:po-app` **19** behaviours, `create-ui`, `suite` **28** screens. The
*"3 NOT VERIFIED"* in `check:claims` is `ENVIRONMENT.md` 6b — this container
reports `(pointer: fine) = false` — not a regression.

**Step 0 traps:** trap 1 bit again (detached HEAD, `git branch --show-current`
empty), fixed with `git checkout -B main origin/main` before any commit;
`origin/main` again arrived as a **forced update** (`26447ba...1023579`). Trap 2
clean in one `--unshallow` (**1,928** commits, no `shallow.lock`) and it again
brought the tags (`git tag | wc -l` → **7**) — the **eleventh** consecutive
container to do so. Trap 1b bit once mid-wake (a `cd` into
`apps/docs/scripts` left the next command there); absolute paths after that.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots were
taken — a cloud wake has no Podman and no `:8081`. **None is owed here, and
that is checkable rather than asserted:** the diff is two markdown files, it
changes no shipped surface, and nothing in it renders.

## The open set is still 13, and ONE is cloud-takeable

Unchanged — this wake closed `290.1` (filed and closed inside its own slice) and
filed no new open item. Each line re-classified from the item's own text per
`LOOPS.md` 186.2.

- **cloud-takeable (1):** `287.5` (re-attach the orphaned sentence in `LOOPS.md`
  §3b step 5). The sentence **is still orphaned**, with the earlier bullet's
  5-space indent mid-paragraph. Its Accept was made executable two wakes ago by
  correcting a commit id that never touched `LOOPS.md` (`fc79ea85`, 0 bytes) to
  `9c1bacbe`. **This is what rule 4 picks next wake.**
- **owner-blocked (9):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3` and `112.4` (blocked on 112.3's verdict), `249.7` (its own text defers
  to 249.10, the owner's vocabulary column), `249.10`, `249.11`, `249.12`,
  `249.13`, `273.2`.
- **browser-blocked in the SCREENSHOT sense** (`ENVIRONMENT.md`'s FIRST list —
  a LOCAL wake can take these, a cloud wake cannot): `249.6`, `249.9`, `249.15`.
  Each has its cloud-takeable half already banked in its own text.
  **`249.6` has been declined at the clause level four times. Do not re-derive
  it a fifth.**

Note the two counts are both right and have different denominators:
`roadmap_scope.py` reads **13 open / 33 closed** (items under slice headings),
`check-resume-slice-ids` reads **13 / 35** (it also counts the 2 items under the
non-slice `## STATE` heading). Do not quote a bare closed count.

## No archive sweep this wake — but the share is rising and this is now the call

`roadmap_scope.py`, **re-run after this wake's commit** (per `ENVIRONMENT.md`'s
trap — when your own commit changes the file, `HEAD` is the pre-change state):

```
closed-history share  1743/5093 = 34.2%
targets (over 6 lines) [290, 289, 288, 286, 285, 284, 283, 282]
⚠ 2 of them NAMED by still-open items: 283 (by 287.5 and 273.2), 289 (by 287.5)
```

**Trend across five wakes: 25.4% → 27.5% → 32.0% → 34.2%.** Six of the eight
targets are unnamed and therefore movable (290, 288, 286, 285, 284, 282).

**Declined this wake for a stated reason, not omitted:** the wake was dispatched
by rule 2, the Standardize round reached its exit condition (a clean pass), and
the sweep is rule 4's business — rule 4's own text is what says to triage and run
it when the rule is walking thousands of lines. Running a bulk archive move as a
*second* large change in the same wake is what CLAUDE.md's bulk-edit rule warns
about, and Slice 290 is the slice this wake just wrote. **Next wake reaches rule
4: weigh the sweep against `287.5` there.** Note `249.12` — the archival trigger
itself — is an open owner-blocked item, so no threshold has been agreed; 34.2%
is a reading, not a breach.

## Direction

Nothing new from the owner this wake; GitHub intake is empty (`list_issues` →
`totalCount: 0`). The standing owner blocks are unchanged.

**Two things want the owner's attention, both carried forward:**

1. **`273.2` is still the owner call worth their attention**, a fifteenth wake
   untouched — whether a Polish round whose score does not move should
   increment `dry`. Re-measure before quoting:
   `grep -cE '^## Round .*NO-OP' .roundtable/polish-state.md` and
   `grep -cE '^## Round .*NOT a no-op'`; these are snapshots.

2. **Carried forward unchanged, because it is the owner's call and no wake
   should answer it for them:** whether *"a criterion may not embed a citation
   any more than a forecast"* earns a line in `CLAUDE.md`. It was deliberately
   not written there — 284.2 verdicted that file HONEST with its removable
   surface measured at 181 words (3.1%), so adding a section to answer a finding
   about prose growth is the shape 274.1 refused.

## `bundle-gz-kb` still cannot be sampled — carried by 79 revisions of this file

**The ordinal this section used to carry was never measured, and the one
measurement available disagrees with it.** The previous hand-off said
*"thirtieth wake"*; replaying every revision of this file for the finding reads
**79**:

```
for sha in $(git log --format=%H -- .roundtable/RESUME.md); do
  git show $sha:.roundtable/RESUME.md | grep -q 'bundle-gz-kb' && echo x; done | wc -l
```

Those are **revisions, not wakes** — a wake can write this file more than once,
so 79 is an upper bound on the wake count and the two numbers are not
comparable. Stated as the thing that was actually counted, with its command,
rather than incremented on faith; a bare count with no command is the failure
roadmap 159 wrote a rule against.

259.1's rule-5 finding itself, re-verified this wake rather than re-derived:

```
grep -rln 'bundle-gz-kb' --include='*.mjs' --include='*.py' --include='*.ts' \
  --include='*.js' --include='*.json' . | grep -v node_modules
```

still returns exactly **one** file — `scripts/loops/record_metric.py` — and the
hit is its **docstring example** at line 6, `--value 7.0`. Nothing derives the
number. Do not "fix" rule 5's staleness by recording a guessed value.
