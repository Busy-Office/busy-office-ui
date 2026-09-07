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
at hand-off. **One iteration recorded**: `Continue · build` (outcome `landed`,
one additional refusal). The work landed as **`82dc60e6`** (Slice 325), followed
by this hand-off's own commit.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

Every figure below was taken `--rev 82dc60e6`, the slice commit — **not** the
working tree and **not** `HEAD`, which is `ENVIRONMENT.md`'s figure rule.

## BOTH counters are OVERDUE for the next wake — read this before dispatching

Counters read **after** recording this wake's row, which is the comparison
`LOOPS.md` mandates:

```
Standardize   4 / 4 Continue rounds    since 2026-09-07 05:14   OVERDUE
Objective     3 / 3 slices [307,309,323] since 2026-09-07 06:57 OVERDUE
Optimize      1 wake-date newer        since 2026-09-06 16:56   STALE
```

Both moved by exactly what this wake did by hand — **one** Continue round and
**one** slice closed. Nothing anomalous. **Rule 2 now matches before rule 4**,
so the next wake dispatches **Standardize** unless a P0 or new input preempts
it; rule 3 is right behind it.

**The Objective counter names slice `309`, not `325`.** Correct, and worth
knowing before it reads as a parser bug: the closed item is `309.5`, so the
row's item text begins `309.5 …` and `SLICE_BARE` charges it to Slice 309.
Slice 325 is where this wake's *narrative* lives; it closes nothing of its own.
This is the same mechanism the previous hand-off explained for `307`.

**Rule 5 reads a genuine STALE, so report it as *could not be evaluated*, not
clear.** Unchanged from the last hand-off and not re-derived here beyond the
line itself. **No metric was recorded this wake**, deliberately: `324.2` is
still open on the `GZIP_TOLERANCE_KB = 0.3` convention, and the two timing
numbers this wake produced are explicitly machine-bound (see below), so
recording one would create a series whose two points are two containers.

**`polish_requeue.py` did NOT run this wake** in any mode — `LOOPS.md` §3b step
0 is owed only once rule 6 is reached, and rule 4 matched first. No stamp
reading from this wake exists to quote.

Of the three advisory checks, only `check:resume-slice-ids` printed, against the
**previous** revision of this file. **Re-run it against this file as it now
stands.** The standing note still applies: **saying that an id is being dropped
keeps it named**, because the check reads backticked ids and cannot tell a
historical reference from a live claim. The charter check and `--verify-stamps`
were silent.

## The standing environment fact: CI HAS NO `paths-ignore`

`312.2` removed it entirely. **A push that touches only `.roundtable/**` runs
the full suite.** The consequence a wake feels directly is `ENVIRONMENT.md` §3b
— *re-run `npm run docs:build` after writing this file, before pushing* — and it
was executed this wake, after this file was written, before the push.

## CHECK CI AFTER PUSHING

`main` was **green** at the start of this wake. Read the runs after your push;
one `actions/runs?branch=main` read costs nothing and is the only thing standing
between a red `main` and the next wake.

## Step 1 — both intakes read, with the controls ENVIRONMENT.md §8 names

`gh` is still absent and the Discussions GraphQL route still refused, so the
REST substitute was used, with both controls in the same run:

```
/discussions        -> HTTP 200, len 0     the reading
/not-a-real-route   -> HTTP 404            an unserved route does NOT answer 200 []
/issues?state=open  -> HTTP 200, len 1     #2, updated 2026-09-06T15:10:34Z
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so
Step 1 committed nothing. The red-proof `ENVIRONMENT.md` §8 says is still owed
remains owed — nothing has ever been filed in this repo's Discussions.

**Issue #2's `updated_at` has not moved since the last hand-off**, so it carries
the same single owner triage comment. See Direction.

## What landed this wake — Slice 325, closing `309.5`

Dispatched by **rule 4** on the oldest still-open item no other kind of block
covers. Rule 1 found no open P0 (`grep -cE '^\s*[0-9]+\. \[ \].*P0'` → **0**);
rule 2 was at `3 / 4`; rule 3 at `2 / 3`. Every older open item was re-checked
**in `ROADMAP.md` itself**, not carried from the previous hand-off.

`apps/docs/scripts/measure-stress.mjs` — `npm run measure:stress -w docs`. The
`/stress` harness kept the rows and not the measurement, so both re-runs to date
invented a method. It is **not a gate**: CI runs nothing here and it asserts no
budget, which keeps Slice 307's refused-latency-gate finding standing.

**Carry this forward, it is the transferable half.** The probe's own
`style-flush` column shipped **dead** and was caught by the tidy-number rule,
not by review. It timed a forced `offsetHeight` inside a `setTimeout(…, 0)`
after the `change` dispatch and read **0.0 / 0.1 / 0.0 ms at 1k / 5k / 20k** —
an identical value across inputs differing 20-fold, against a published column
of 231 ms at 5k. The event loop takes a rendering opportunity *between* tasks,
so a flush measured from a later task always finds the recalculation already
paid. Moved into the same task, at the end of the dispatch, it reads **90.1 /
342.8 / 2415.2 ms** and scales monotonically. **A probe measuring the cost of a
mutation must take its forced read before the browser gets a rendering
opportunity, or it measures nothing** — and the two forms are indistinguishable
except by their scaling.

The control is red-proved by injection with the injection confirmed to land
(1 live line → 0 live, 1 commented): re-applying `1f75dab4`'s exact break, the
probe exits **1** with `0/1000 checked` and **no timing row at all**. It went
red narrowly. `check:po-app` was separately re-run green at **20 behaviours**,
unchanged by the boot refactor into `apps/docs/scripts/po-app-harness.mjs`.

**The readings are in ROADMAP 309.5 with their machine and must not be read
against the docs page's 2026-08-15 table** — that is `325.2`.

## `origin/main` did NOT move under this wake

`git fetch origin main` at Step 0 and again immediately before the first commit,
as Step 0c mandates: `14a0dbda` both times. No collision.

**Step 0 traps:** trap 1 bit again (detached HEAD, `git branch --show-current`
empty), fixed with `git checkout -B main origin/main` before any commit, and
`origin/main` again arrived as a **forced update** (`26447ba...14a0dbd`). Trap 2
clean in one `--unshallow` (**2,009** commits, no `shallow.lock`), and it again
brought the tags — the **thirty-eighth** consecutive container to do so;
`git tag | wc -l` → **8**. Trap 1c bit for real: `check:viewport-forks` also
caught a literal `1440` in the new script, which is a different gate doing its
job. No `git stash` was used at any point this wake.

## The open set is 27 — no P0, and 12 are cloud-takeable

`roadmap_scope.py --rev 82dc60e6` reports **27 open / 51 closed**, OPEN slices
`[15, 112, 249, 273, 294, 296, 297, 310, 315, 316, 319, 320, 322, 323, 324,
325]`. Net from the last hand-off's 26: one closed (`309.5`) and two filed
(`325.1`, `325.2`), so **Slice 309 has left the open set and Slice 325 has
entered it**. The raw counts reconcile exactly: `grep -c` reads 27 open / **53**
closed, and 53 = 51 attributed + the 2 `[x]` under the non-slice `## STATE`
heading.

- **cloud-takeable: 12** — `310.1`, `310.2`, `315.3`, `316.1`, `319.3`,
  `320.2`, `322.3`, `323.1`, `324.1`, `324.2`, `325.1`, `325.2`. (`297.1` is
  takeable here too but is counted once, under input-blocked, because that is
  what actually gates it.) **`310.1` is now the oldest of these** and is what
  rule 4 reaches next — *if* a counter does not preempt it, and this wake
  leaves two that do. The cheapest are `310.2`, `315.3`, `316.1`, `319.3`,
  `320.2`, `322.3`, `323.1`, `324.2` and **`325.1`**, whose Accept is a
  decision over a base rate that re-measures in one command.
- **owner-blocked (11):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3`, `112.4`, `249.7`, `249.10`, `249.11`, `249.12`, `249.13`, `273.2`,
  `296.3`, and **`294.2`'s brand-mark half** — but `294.2` is counted below,
  under input-blocked, because the folder's absence gates it first. `249.7` was
  re-read in full this wake rather than carried: its Accept's first clause is
  DONE (the seed spot-check ran 2026-09-03) and it waits on `249.10`, an owner
  vocabulary call.
- **browser-blocked in the SCREENSHOT sense** (a LOCAL wake can take these):
  `249.6`, `249.9`, `320.3`. **`249.6` was declined at the clause level four
  times. Do not re-derive it.**
- **input-blocked (2): `297.1` and `294.2`** — the **fourth kind** `LOOPS.md`
  186.2's three do not cover.

  **`297.1` now reads as takeable and is NOT, and this wake measured why
  rather than repeating the previous hand-off's claim.** Its Accept fires when
  an intake is non-empty, and one is — but the question it asks is whether the
  **template or the contact link** routed the filer. `/issues?state=all`
  reports `#1` and `#2` with `user.login` **`ThePFMind`** on both: the owner,
  who passes through neither. It waits on an **external** filer.

  **`294.2`** needs the owner to land the `upstream-contribution/` folder on a
  branch before any wake can rank the six proposals — re-checked this wake, not
  carried: `ls` and `git ls-files` both find nothing.

12 + 10 + 3 + 2 = 27, asserted rather than left to the reader, and reconciled
against `grep -nE '^\s*[0-9]+\. \[ \]' ROADMAP.md`. (The owner-blocked bullet
names 11 ids; `294.2` is one of them and is counted under input-blocked, so the
arithmetic uses 10.)

**The fifth kind of blocked, `artifact-lost`, is still worth carrying** — an
item whose Accept says *re-measure* names an artifact, and the artifact either
resolves or it does not. Nothing in the current open set is of that kind,
checked rather than assumed.

## The archive sweep is NOT due, and only ONE half of the trigger has crossed

Measured at **`82dc60e6`**: **6,634 lines**, closed-history share **28.2%**
(1,870 lines across 5 closed slices). The standing trigger is *past 5,450 lines
**and/or** 40.6%*: lines are past, **share is not**. That is precisely the
AND-vs-OR case `249.12` is open on, and unlike the last wake — where both halves
crossed and the question stopped mattering — **it decides something here**.
Under AND, no sweep. A wake that reaches for one anyway should read
`roadmap_scope.py`'s pin line first: the newest target, **Slice 309, is pinned
by both of this wake's new items** (`325.1`, `325.2`), so it is not eligible
regardless.

Trend across thirty-three readings: 27.5% → 32.0% → 34.2% → 38.0% → 39.4% →
37.5% → 36.9% → 36.2% → 35.5% → 37.3% → 36.9% → 38.3% → 37.6% → 9.4% → 10.3% →
10.9% → 11.8% → 26.0% → 26.9% → 30.5% → 29.5% → 28.9% → 31.2% → 35.3% → 34.7%
→ 36.4% → 38.1% → 40.3% → 39.4% → 39.9% → 41.5% → 24.6% → **28.2%**.

## NOT VERIFIED, said plainly

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.** One
change this wake would normally get them: **a new `<p class="bo-u-text-muted">`
on `/components/data-table`**, in the performance section, beside three existing
siblings of the same class. `check:layout` (127 pages, 390 and 150% zoom),
`check:scroll`, `test:axe` (127 × 2) and `check:pseudo` all passed on the built
page, so nothing overflows and nothing is inaccessible — but **nobody looked at
it**, and none of those gates would notice a paragraph that reads badly or sits
wrong in the flow. **A local wake should glance at it.**

Everything else in the diff is two `.mjs` scripts, one npm script and
`ROADMAP.md` — no CSS, no layout.

**Gates green on the committed tree:** all **17** cloud-runnable entry points,
re-derived from `ci.yml` rather than read off a list (the two documented set
differences still hold — `check:ci-ignores` is covered by `check:repo` inside
`docs:build`, and `npm run test -w @busy-office/ui` is CI's `npx vitest run
--root packages/core`), plus a second `check:repo` after the flag-validation
edits and the §3b `docs:build` re-run after this file was written.
`check:claims` reports **170 live · 3 NOT VERIFIED**, which is
`ENVIRONMENT.md` §6b's container fact, not a regression.

**The `verifier` agent is not available in this session**, so `LOOPS.md` §2 step
6's verifier pass was done by hand — each staged diff re-read adversarially,
which is what found the defect fixed before commit: every numeric flag on the
new probe coerced silently, so `--repeat` with no value produced `NaN`, an empty
table, zero control failures and **exit 0** — a silently-wrong reading, which is
the one output this probe exists to make impossible. All four flags now exit 2
naming the flag.

**The visual debts carried forward are unchanged and unspent**: `292.4/292.5`'s
screenshot lane on `/components/icon`, now seventeen wakes back; the
withdrawn-claim paragraph on `/components/data-table` — **which this wake added
a fourth paragraph beside**; Slice 319's paragraph on `/patterns/kanban` at
390px; and `320.3`'s `ApiTable.astro` `0.5rem` against `ClassRef.astro` `.4rem`.
**A local wake should glance at all four.**

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were
read** (issues **1** open, discussions **0** open).

**Three things want the owner's attention, and one of them has hardened from a
guess into a measurement.**

1. **Issue #2 is open and carries only the triage comment.** Slice 317 refuses
   the component with the measurement; Slice 319 corrected a second false claim
   on the same page the reporter was pointing at, which strengthens their report
   rather than weakening it. **Replying and closing the issue is a thirty-second
   owner action**, and `LOOPS.md` Step 1 says an issue "gets closed with a
   comment linking the fixing commit once its item ships". Whether a *wake*
   should post that comment is `297.1`, still open.

   **And `297.1` will stay open until someone who is not the owner files
   something.** This wake measured it rather than asserting it: both issues ever
   filed carry `user.login` `ThePFMind`. The item exists to test whether the
   issue template or the contact link routes a stranger correctly, and no
   stranger has arrived. **Nothing a wake can do unblocks this**; it is a
   function of the package having adopters.
2. **`294.2` still cannot be advanced by anyone but the owner.** The six
   proposals it ranks live in an owner-supplied zip that never reached the repo.
   **Landing `upstream-contribution/` on a branch is a one-command unblock.**
   Re-checked this wake — `ls` and `git ls-files` both find nothing.
3. **`273.2` is still worth their attention**, a thirty-second call untouched —
   whether a Polish round whose score does not move should increment `dry`. Not
   touched this wake; rule 6 was never reached.

**`249.12` is back on the list as a live question, having come off it last
wake.** The previous hand-off retired it because both halves of the archival
trigger had crossed, so AND and OR agreed and no decision was needed. After this
wake's sweep-free growth **only the line half is past** (6,634 lines, 28.2%
share), which is exactly the state the item is open on. It is not urgent — under
either reading no target is eligible, because the newest is pinned — but the
next wake that grows the file past 40.6% share will need the answer.
