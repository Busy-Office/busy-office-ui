# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and two advisory checks run from `record_iteration.py` — the charter
> check and `check:resume-slice-ids`. Both REPORT on stderr; neither fails a
> build (roadmap 175.3).

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

---

## In flight: nothing

Last updated 2026-08-31 (**cloud** wake). Working tree clean at hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 5 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
```

## What landed this wake

**Slice 232 — Objective grill of Slices 229, 230, 231**, dispatcher rule 3
(`Objective 3 / 3 slices OVERDUE`). Full report:
`.roundtable/grill-objective-229-230-231-2026-08-31.md`.

**Arming set NOT narrowed.** **40** prior grill reports, read **from the HEAD
blobs**; none names 229, 230 or 231. Read from the blob rather than the tree for
229's own stated reason — the working-tree form matches this grill's own heading.

**230 and 231 survive entirely. Both findings are against how 229.3 RECORDED its
numbers, not against the refusal, which stands.**

### ⚠ READ THIS BEFORE DISPATCHING — 229.3 was independently built THREE times today

This wake lost **two** Step 0c collisions before reaching rule 3. It dispatched
rule 4 onto **229.3**; built it, gates green; the mandated pre-commit
`git fetch origin main` found **origin/main 10 commits ahead** with 229.3, 229.4,
229.5, 230 and 231 all landed. It re-dispatched onto **231.2**; built that, gates
green; the next pre-commit fetch found **2 more commits** with 231.2 taken.

**And the PREVIOUS hand-off records that it, too, lost a collision on 229.3** —
it "did the whole item … built both candidate predicates as a throwaway probe,
red-proved them by injection" before discovering the same thing. So on
2026-08-31, **229.3 was built to completion three times by three wakes, and
landed once.** That is not an inference from the log; it is written in the two
hand-offs plus this one.

**The mandated pre-commit fetch caught all of them.** It is a process rule with
nothing mechanical behind it — a wake that skips it gets no second signal and
learns at push rejection instead.

**All three independent derivations agreed on the substance** — refuse on 229.3;
keep-and-document on 231.2, with identical numbers (`2 → 5`, low set `17 → 16`)
and the same 89-vs-88 denominator correction. **Redundant coverage paid once and
cost at least three times over.** Not filed as an item: Step 0c's decision is
*accept collisions*, taken with the cost named, and the decision is the owner's.
Flagged under Direction instead.

### The two findings (both OPEN as 232.1 / 232.2, both dispatchable)

**232.1 — 229.3's BROAD base rate of 2 excludes the past tense; it is 7.** Its
published reproduction command is `grep -rniE 'owes?\b'`, and that regex cannot
match `owed` — the word boundary fails against the `d` (`printf 'was owed' |
grep -cE 'owes?\b'` → **0**; `owe[sd]?\b` → **1**). Past tense is the wording
229.2's own fix used, so all five corrected headers say *"used to say it was
owed"*. Whole-word count is **7**, and BROAD as 229.3 defines it fires on all
five corrected files — an **18-character** gap on adjacent lines, which is why a
line-based grep reports nothing and a multiline test reports five. **The five it
gains are exactly the set 229.3's Accept forbids it firing on.** The refusal is
strengthened, not overturned — its decisive reworded-injection row is untouched.

**232.2 — the recurrence history 229.3 never measured.** `git log -S'OWES a
--self-test'` returns exactly **3** commits; a second instrument (sentence AND
branch together) adds `443348e2`, which the pickaxe structurally cannot see
because it changed only the branch. At 42.1 the sentence was **TRUE**; 42.3 —
*"all seven heuristic gates now prove they can fail"* — added the branches and
left the sentences. **The defect was introduced by the commit that PAID the
debt**: one introduction, zero recurrences in twelve days.

### 230 and 231, verified rather than assumed

- **230 survives, including its red-proof re-run by this grill.** Population from
  the blobs: 8 readers, 6 parsers, `cascade` threw **0** before `ff2b623d` and
  **1** after, so 5 of 6 asserted. `tokens.min.css` carries **0** comments. Built
  table still renders **5** rows. Case C re-run independently — injecting
  `--bo-z-toast: 1600 → 1700` in the source only, injection confirmed present
  first — fails at **exit 1** with **count 5 on BOTH sides**, so a `length < 5`
  floor would have passed. Injection reverted, `git status` confirmed empty.
- **It also reconciles a figure that reads like a contradiction**: the earlier
  hand-off's *"6 of 8 throw"* against 230's *"5 of 6"*. Different denominators,
  both correct — 6 of the 8 readers throw, 5 of the 6 *parsers* threw before the
  fix. Do not re-derive this as a discrepancy.
- **231 survives**, corroborated by this wake's independent 231.2 build.

**Instrument defect recorded, per the standing base rate.** The predicate probe's
first run read 4 of the 5 corrected files, because its `header()` broke out of
the `//` loop on `check-markup.mjs`'s `#!/usr/bin/env node` shebang and returned
an empty header. Every figure quoted is the second run, and the load-bearing ones
were re-derived with one-liners needing no probe at all.

## Gates run this wake

Core `build`, `test` (152 in 27 files), `lint:css`, `docs:build`, `check:repo`
(slice-refs **461** citations / **214** slice numbers), `check:claims`,
`check:formatting`, `check:scroll`, `check:layout` (127 pages), `test:axe` (127 ×
2 widths, zero violations), `check:target-size`, `check:forced-colors`. All exit
0. **Not the full 17, and that is said plainly rather than implied** —
`check:pseudo`, `check:search`, `check:quickstart`, `check:po-app`, `create-ui`
and `suite` were not run, because the final commit ships **no code**:
`ROADMAP.md` plus one new `.roundtable/` report.

`check:claims` reads **158 verified live · 3 NOT VERIFIED**. That is
`ENVIRONMENT.md` §6b — this container reports `(pointer: fine) = false` — **not**
a regression. Do not "restore" the zero.

**Not verified, said plainly:** no Podman and no `localhost:8081` here, so the
1440/390 light-and-dark screenshot lane could not run. **Nothing in this wake
rests on a rendered image** — every reading is a grep, a git blob, a build exit
code, or a count taken from built HTML.

## Dispatcher state at hand-off

```
python3 scripts/loops/dispatch_status.py
```

```
Standardize   1 / 4 Continue round   since 2026-08-31 13:03   ok
Objective     0 / 3 slices           since 2026-08-31 14:43   ok
Optimize      0 wake-date(s) newer   since 2026-08-31 08:41   ok
```

**This is the Step 0b comparison — read immediately after recording — and it
moved as predicted.** Rule 3's slice counter **RESET** 3/3 → 0/3 (an `Objective`
row resets it, 161.4's exclusion list) and rule 2's Continue-round counter is
**unchanged at 1/4**, because an Objective row is neither a Continue nor a
Standardize row. That comparison has found two of the five starved-counter bugs;
re-run it rather than trusting this snapshot.

**Rule 5 was evaluable this wake and reads clear — but only on one series.** The
newest comparable pair is `axe-violations`, flat at **0** across 2026-08-29/30/31,
so there is no regression to act on. **No metric was recorded by this wake
deliberately**: a grill produces no tracked quantity, and 184.1's warning is that
a name sampled once can never satisfy "two consecutive runs".

**⚠ Carry forward, re-verified rather than repeated: `bundle-gz-kb` reads
`10.8 → 11.6 → 11.7`, which matches rule 5's trigger literally — and all three
samples are from 2026-08-16/17, so they are FOURTEEN days stale** (the previous
hand-off said "12+"; re-measured here). They describe a tree from two weeks ago.
**Do not quote that rise as a current regression.**

**How rules 1-3 were answered, so the next wake need not re-derive them:**

| rule | reading |
|---|---|
| 1 P0 | none open; no open GitHub issues (`list_issues` OPEN → `totalCount: 0`) |
| 2 Standardize | **1 / 4 — ok**, no drift flagged |
| 3 Objective | **3 / 3 OVERDUE `[229, 230, 231]` — dispatched** (now reset) |
| 4 build item | reached twice earlier in the wake; both dispatches lost to collisions |

**The open set is 5, and TWO of them are dispatchable** (rule 4's kind-of-blocked
distinction, which `LOOPS.md` keeps in the durable playbook precisely because it
did not survive a rewrite of this file):

| item | kind of blocked |
|---|---|
| `112.3` pattern-fit pilot (oldest open) | owner-blocked — briefs + four answers |
| `112.4` Screen Contract layer | owner-blocked — on 112.3's verdict |
| AT runtime evidence | hardware-blocked — owner hardware |
| **232.1** BROAD base rate excludes the past tense | **NOT blocked** — an edit to 229.3's recorded numbers, or a recorded reason not to |
| **232.2** the recurrence history 229.3 never measured | **NOT blocked** — needs `git fetch --unshallow origin` first |

**Read rule 4 carefully:** the rule says *the OLDEST still-open item*, and the
oldest is `112.3`, which is owner-blocked. The oldest **dispatchable** one is
`232.1`. Say which you took and why, rather than reporting rule 4 as finding
nothing — that misreport is exactly what cost four wakes on 173.2.

**Both are written so that REFUSING is a satisfying outcome**, per CLAUDE.md's
criterion rule. 232.1 may be answered by restating the number; 232.2's honest
outcome may be that the loop prefers the today-base-rate framing. Neither should
be built just because it is open. **232.2 requires an unshallowed clone** —
ENVIRONMENT.md §2, and §2b's `shallow.lock` trap bit for real on 2026-08-30.

## Direction

**No new input arrived**: no open GitHub issues, and no owner message since the
last wake. Step 1 had nothing to triage, so no `Roadmap · plan` row exists.

**The standing three are unchanged** (112.3, 112.4, AT runtime) and still need
the owner; no wake of any kind can advance them.

**The one thing worth the owner's attention is the collision rate, which is now
measured rather than anecdotal.** On 2026-08-31 alone, **229.3 was built to
completion three times and landed once**, and 231.2 twice and landed once. Step
0c's accepted cost is *"up to one wake's work, discarded"*; the ledger for one
day is **at least three wakes' work discarded**. The mechanism Step 0c credits in
exchange — redundant coverage catching a real defect — also fired, **once**, and
is the source of 232.1.

**Both halves of that trade are now measured on the same day, which is the first
time they have been.** The decision to accept collisions is the owner's and is
explicitly not reopened here; what has changed is only that the cost is no longer
hypothetical. If the owner wants the rate reduced, Step 0c already records the
three options it refused and the measured reason for each, so that argument does
not need re-deriving — what it lacks is a fourth option, and none is proposed
here.

**`ROADMAP.md` is at 2,704 lines** (measured, not carried). No sweep triggered
this wake, and the figure to compare is the closed-history *share*, re-derived by
177's scope command rather than by arithmetic on a stale percentage. Measure the
cycle from the blob, never from a sweep's own prose (ENVIRONMENT.md):

```
git show d701e61:ROADMAP.md | wc -l                 # 1626, the seventh sweep
git rev-list --count d701e61..HEAD -- ROADMAP.md
```
