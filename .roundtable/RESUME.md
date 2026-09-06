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

Last updated 2026-09-07 (**cloud** wake, scheduled routine). Working tree clean
at hand-off. **Two commits this wake** — the Slice 313 build and this rewrite —
and **one iteration recorded**, `Continue · bug`, with two refusals.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ THE ONE THING THAT CHANGED FOR EVERY FUTURE WAKE: CI HAS NO `paths-ignore`

`312.2` removed it entirely. **A push that touches only `.roundtable/**` now
runs the full suite**, where before it ran nothing. Two consequences a wake
feels directly:

1. `ENVIRONMENT.md` §3b — *re-run `npm run docs:build` after writing this file,
   before pushing* — stops being a subtlety about pushes that happen to carry a
   ROADMAP change. It is now the ordinary case, every wake, no exceptions.
2. A hand-off that hand-types a browser floor, spells a denied vendor name, or
   cites a slice that does not resolve turns `main` red **on its own commit**
   rather than on somebody else's. That is the improvement; it is also a
   sharper edge.

## This hand-off reports what it measured; it does NOT predict the next dispatch

Counters read **after** recording this wake's row, which is the comparison
`LOOPS.md` mandates:

```
Standardize   4 / 4 Continue rounds  since 2026-09-06 17:49   OVERDUE
Objective     3 / 3 slices [292, 294, 312]  since 2026-09-06 18:56   OVERDUE
Optimize      1 wake-date(s) newer   since 2026-09-06 16:56   STALE
```

**Both counters crossed on this wake's rows**, which is the comparison
`LOOPS.md` mandates and the one that has found two of the five parser
recurrences: this `Continue` row took Standardize from 3/4 to 4/4, and closing
Slice 312 took Objective from 2/3 to 3/3. **Re-run the command rather than
trusting these three lines** — they are a reading, and the file's charter is
that it reports what it measured and does not predict the next dispatch.

`grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` now reads **0**, where the last
hand-off recorded 1, so rule 1 no longer matches.

Of the three advisory checks that run from `record_iteration.py`, only
`check:resume-slice-ids` printed, against the *previous* revision of this file:
**2** named ids recorded closed. **They are deliberately not quoted** — naming
them makes the check fire on *this* revision for ids it holds only because it
is quoting the check, a report sustaining itself forever. The previous revision
is one `git show` away. Against **this** file the check reports the two this
wake closed, both named throughout below as the work that closed them, plus one
archived id. The charter check and `--verify-stamps` were silent.

**Rule 5 is reported as *could not be evaluated*, never clear.** No metric was
recorded this wake. `306.1` explains why a cloud wake cannot drive that line to
`ok` by recording more; do not try. `bundle-gz-kb` still cannot be sampled
(`259.1`, carried forward, not re-run).

**`polish_requeue.py` did NOT run this wake** in any mode — `LOOPS.md` §3b step
0 is owed only once rule 6 is reached, and rule 1 matched first. No stamp
reading from this wake exists to quote.

## Step 1 — both intakes read, with the controls ENVIRONMENT.md §8 names

`gh` is still absent and the Discussions GraphQL route still refused, so the
REST substitute was used, with both controls in the same run:

```
/discussions        -> HTTP 200, len 0     the reading
/not-a-real-route   -> HTTP 404            an unserved route does NOT answer 200 []
/issues?state=open  -> HTTP 200, len 1     #2, already triaged as 300.2
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so
Step 1 committed nothing. The red-proof ENVIRONMENT.md §8 says is still owed
remains owed — nothing has ever been filed in this repo's Discussions.

## What landed this wake

**Slice 313**, dispatched by **rule 1** on the open P0 `312.1`; `312.2` closed
in the same wake because 312.1's fix turns the gate red on the live tree, and
312.2 is the decision that makes it green again. Rules 2-8 were not reached.

**The honest reader set is four gates, not the two the P0 named** — and three of
the four never spell the path anywhere in their source:

| script | `.roundtable/**` | `STATUS.md` | route |
|---|---|---|---|
| `check-floor.mjs` | red | red | walks `REPO_ROOT`, keeps `.md` |
| `check-vendor-names.mjs` | red | red | bare elements of its `ROOTS` array |
| `check-slice-refs.mjs` | red | red | `git ls-files` |
| `check-imports.mjs` | red | — | same walk, allow-list `.mjs/.js/.ts` |

**Established by two independent instruments, both of which were wrong first.**
An fs spy over all seventeen CI entry points (its first version wrapped
`realpathSync` and dropped `.native`, which vite destructures — `astro build`
died and every later gate failed for a missing `dist`); and a per-gate injection
probe whose **two green results were both injection defects**, per CLAUDE.md's
rule. `check:slice-refs` reads `git ls-files`, which lists **tracked** files only
— the scratch probe was invisible to it, which retires Slice 312's own *"Not
established"* note. `check:imports` is a **case**-sensitivity gate, so a missing
file proves nothing and a case-mismatched import proves it. **7 of 7 (path,
gate) pairs agree with what the widened gate reports**, which is 312.1's Accept.

**Red-proved both ways**, on the committed shape: re-adding `.roundtable/**`
alongside a control entry `visual-baselines/**` (a `SOURCE_SKIP_DIRS` member)
gives `rc=1`, **4 failures for the first and 0 for the control**, from the same
walkers. Self-test 7 → **18** cases. Base rate of the new walk route measured
before shipping: **5** of the scripts CI runs, not 100%.

**Two documents corrected by measurement:** `ENVIRONMENT.md` §3b's gate list
named `check:loop-vocab`, which reads nothing under the path (zero spy accesses,
green under all seven injections) and omitted `check:imports`, which does;
`ci.yml`'s *"STATUS.md is read by nothing"* was wrong in the same direction as
the comment it had replaced.

**Gates green on the committed tree:** all 17 cloud-runnable entry points, run
green **twice** — once on the pre-change tree under the fs spy, once on the
committed tree. Figures are in the run logs rather than pinned here.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots — a cloud
wake has no Podman. **Nothing visual is claimed, and that is structural rather
than hopeful**: the diff is one gate script, `.github/workflows/ci.yml`, and
prose. No CSS, no page, no generated artefact a page renders.
**`292.4/292.5`'s screenshot lane on `/components/icon` remains unspent**, now
from five wakes back, and the withdrawn-claim paragraph on
`/components/data-table` is still unlooked-at.

## `origin/main` did NOT move under this wake

`git fetch origin main` at Step 0 and again immediately before the first commit,
as Step 0c mandates: `0a7521a` both times. No collision.

**Step 0 traps:** trap 1 bit again (detached HEAD, `git branch --show-current`
empty), fixed with `git checkout -B main origin/main` before any commit, and
`origin/main` again arrived as a **forced update** (`26447ba...0a7521a`). Trap 2
clean in one `--unshallow` (**1,979** commits, no `shallow.lock`), and it again
brought the tags — the **twenty-sixth** consecutive container to do so;
`git tag | wc -l` → **8**. No `git stash` was used.

## The open set is 24 — no P0, and 11 are cloud-takeable

`roadmap_scope.py` reports **24 open / 46 closed**, OPEN slices
`[15, 112, 249, 273, 294, 296, 297, 298, 300, 304, 305, 306, 307, 309, 310]`.
Net from the last hand-off's 26: **−2 closed (`312.1`, `312.2`)**, nothing
filed. **The raw counts reconcile exactly**: `grep -c` reads 24 open / **48**
closed, and 48 = 46 attributed + the 2 `[x]` under the non-slice `## STATE`
heading.

- **cloud-takeable: 11** — `294.2`, `298.1`, `300.2`, `304.1`, `305.1`,
  `305.2`, `306.1`, `307.1`, `309.5`, `310.1`, `310.2`. (`297.1` is takeable
  here too but is counted once, under input-blocked, because that is what
  actually gates it.) **`294.2` is the oldest of these and has gone nine
  hand-offs classified from Slice 294's triage text rather than from its own
  body** — its Accept says the brand mark inside it is an **owner call**, so
  read it before dispatching; the other five verdicts are takeable without one.
  **`305.1` carries a caveat, from its own Accept**: the four defects close by
  re-measuring ink extents and inter-block gaps, which is geometry and squarely
  in `ENVIRONMENT.md`'s *can* list — but it sits inside a Gauntlet whose scoring
  wants a blind critic, so a wake without one closes the measurement half and
  must say so rather than claiming the round. **`309.5` and `310.2` are the
  cheapest**: `309.5` is a script plus a start command, needs no browser image,
  and its Accept lets *refusing to commit a probe* close it; `310.2` closes by
  deleting five unused consts, and deleting them is a satisfying outcome its
  Accept names.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3`, `112.4`, `249.7`, `249.10`, `249.11`, `249.12`, `249.13`, `273.2`,
  `296.3`.
- **browser-blocked in the SCREENSHOT sense** (a LOCAL wake can take these):
  `249.6`, `249.9`. **`249.6` was declined at the clause level four times. Do
  not re-derive it.**
- **input-blocked (1): `297.1`** — the **fourth kind** `LOOPS.md` 186.2's three
  do not cover. It stays open because both filed issues came from the owner's
  own agent, so the router was never tested.

11 + 10 + 2 + 1 = 24, asserted rather than left to the reader, and reconciled
against `grep -nE '^\s*[0-9]+\. \[ \]' ROADMAP.md` rather than against this
list — the 24 ids it prints are exactly the ones named above.

## No archive sweep — declined on the SHARE half, third wake running

Measured on the working tree after Slice 313 was written (`roadmap_scope.py`):
**6,213 lines**, closed-history share **30.5%** (1,892 lines across 9 closed
slices). The standing trigger the hand-offs carry is *"past 5,450 lines /
40.6%"*: the line half is past, the share half is not — the same judgement the
last two wakes made, at 26.0% and 26.9%. It is rising now (2 more closed slices
this wake), so the share half may cross on its own within a few wakes.

Trend across twenty-one readings: 27.5% → 32.0% → 34.2% → 38.0% → 39.4% →
37.5% → 36.9% → 36.2% → 35.5% → 37.3% → 36.9% → 38.3% → 37.6% → 9.4% → 10.3% →
10.9% → 11.8% → 26.0% → 26.9% → **30.5%**.

**What a sweep would take, so the next wake need not re-derive it:**
`roadmap_scope.py` reports the pins itself — **292 is pinned by `310.1`/`310.2`
and 283 by `273.2`** (236.2), and 313 is this wake's own. That leaves **312,
311, 308, 303, 302, 301** — six slices, a bulk edit, and CLAUDE.md's rule says
it is verified against the rendered artefact one slice at a time. It is a
wake's work, not a tail-end tidy.

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were
read** (issues **1** open, already triaged; discussions **0** open).

**Three things want the owner's attention:**

1. **CI now runs on every commit, and that is a cost the owner is paying.**
   `312.2` was decided inside the loop because the alternative was reversing
   three of the owner's own recorded decisions (256.2, the standing product-name
   instruction, and `check:slice-refs`'s reason for existing). The cost is real
   and was re-measured rather than carried: **9 of the last 30 commits and 38 of
   the last 100 touched only those paths**, at ~14.7 machine-minutes a run. **A
   cheap second workflow running just the three repo-wide prose gates on those
   paths would recover most of that**, and it was refused here for one reason —
   it needs a hand-kept list of which gates are repo-wide, and hand-kept lists
   rotting is what four separate comments in `ci.yml` already record. If the
   owner would rather pay the maintenance than the minutes, that is their call
   and nothing in this wake forecloses it.

2. **`249.12` — the archival trigger — is the same owner call as the last two
   wakes**, now with a third reading against it: 6,213 lines at 30.5%. The two
   halves of the standing trigger disagree, and nothing states whether it is an
   AND or an OR. A wake declining a sweep on that ambiguity three times is the
   signal that the trigger needs deciding, not that the sweep needs doing.

3. **`273.2` is the owner call still worth their attention**, a thirtieth wake
   untouched — whether a Polish round whose score does not move should
   increment `dry`. Not touched this wake; rule 6 was never reached.
