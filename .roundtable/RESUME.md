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
at hand-off. **Two iterations recorded**: `Continue · build` (outcome `landed`,
two additional refusals) and `Roadmap · sweep` (outcome `landed`, one additional
refusal). The work landed as **`25b9fdd3`** and **`3cb2381a`** (Slice 324),
followed by this hand-off's own commit. Read `git log 25b9fdd3~1..` for the
exact set.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

Every figure below was taken `--rev 3cb2381a`, the second slice commit — **not**
the working tree and **not** `HEAD`, which is `ENVIRONMENT.md`'s figure rule.

## This hand-off reports what it measured; it does NOT predict the next dispatch

Counters read **after** recording both of this wake's rows, which is the
comparison `LOOPS.md` mandates:

```
Standardize   3 / 4 Continue rounds    since 2026-09-07 05:14   ok
Objective     2 / 3 slices  [307, 323] since 2026-09-07 06:57   ok
Optimize      1 wake-date newer        since 2026-09-06 16:56   STALE
```

Both counters moved by exactly what this wake did by hand — **one** Continue
round and **one** slice closed, and the `Roadmap · sweep` row moved neither,
which is what `CLOSES_A_SLICE` says it should do. Nothing anomalous.

**The Objective counter names slice `307`, not `324`.** That is correct and
worth knowing before it reads as a parser bug: the closed item is `307.1`, so
the row's item text begins `307.1 …` and `SLICE_BARE` charges it to Slice 307.
Slice 324 is where this wake's *narrative* lives; it closes nothing of its own
except `324.3`, whose row is a `Roadmap` row and is excluded by design.

**Rule 5 reads a genuine STALE, so report it as *could not be evaluated*, not
clear.** The `1` is provable, not a skew residual: today's log rows are more
than 8h naive-later than the newest pair. **This wake changed what that line
reads from** — see below — but did not change today's verdict.

**No metric was recorded this wake**, deliberately, and the refusal is now
better-founded than it was: see the `bundle-gz-kb` paragraph. Adding a one-off
sample to move this line is exactly what the closed item refused to paper over —
and under the new pairing unit a single sample cannot move it at all.

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

## What landed this wake — TWO pieces

**Slice 324**, dispatched by **rule 4** on the oldest still-open item no other
kind of block covers. Rule 1 found no open P0; rule 2 was at `2 / 4`; rule 3 at
`1 / 3`. Every older open item was re-checked **in `ROADMAP.md` itself**, not
carried from the previous hand-off.

### 1. `307.1` — rule 5 re-scoped, and its pairing unit is now DISTINCT DAYS

The Accept's second branch. `44 names → 7 day-paired → 3 alive → 1 actionable`,
with the command recorded in the item so the next wake re-runs rather than
re-derives. Counting samples admitted six single-day bursts, `ci-wall-time`'s 26
among them; the live line's denominator is now honest (`13 of 44 sampled twice`
→ `7 of 44 paired across days`). Under the staleness verdict there is now a
`comparable set` block: every day-paired name, its last two per-day readings and
the delta — **movement, never a verdict**, because no direction is recorded with
a sample.

**The retirement branch was pre-authorised and refused**, on the count: rule 5's
input is not absent, it is one name nobody records, and retiring would delete
184.2's size-budget clause before it has ever fired.

**Base rate before shipping**: replayed at every revision of
`loop-metrics.jsonl` with `loop-log.md` taken AT that commit — 108 revisions,
the flag differs on **9**, the name on 42, the paired-name count on 94, and the
flag differs in **both directions** (on 5 of the 9 the old test read `ok` where
the honest reading is STALE). Red-proved by injection with the injection
confirmed to land.

### 2. `324.3` — the archive sweep, because 249.12's trigger crossed BOTH halves

`8,188 lines / 41.5%` against the standing *"past 5,450 lines / 40.6%"*. The
share half had been the reason for thirteen consecutive declines; with both past,
the AND-vs-OR question `249.12` is open on **no longer decides anything**, so
rule 4's own instruction applies. 15 slices moved, `8,188 → 6,476` lines, share
`41.5% → 24.6%`, and the 4 remaining targets (307, 298, 292, 283) are every one
of them pinned by a still-open item.

**Carry this forward, it is the transferable half.** The first attempt read *any*
line starting with `## ` as a section boundary. `report_loop_prose.py`'s output
contains a row spelled `## the loops table  214  214`, quoted **inside a code
fence** by Slices 309 and 308 — so the mover cut Slice 308 in half and left the
remainder under a heading that is not one. Its own byte-identity check passed,
because it used the same splitter: **a reconciliation that re-uses the parser it
is checking cannot fail.** What caught it was `roadmap_scope.py` — an
independent, fence-aware instrument — reading `17 slice sections, 12 open`
against a raw `306 / 26`. Reverted whole, re-run fence-aware, re-verified by
that same independent instrument.

`roadmap_scope.py` now asserts the **section count** against the raw
`## Slice ` lines in both files, which the checkbox reconciliation structurally
cannot see (a truncated slice loses no markers — its items move from attributed
to stray and both lanes still sum to raw). Self-test **case H**, red-proved by
discrimination and again live by injection.

### The `bundle-gz-kb` correction, which outlives both

**2026-09-04 refused a sample because "the name has no generator anywhere". That
premise is false and it is re-runnable in two commands.** `check:size` prints
`css/index.min.css … 15.10 kB gz` and `stamp-readme.mjs` computes
`gzipSync(minCss).length / 1024` and stamps it into both READMEs — matching the
newest hand-recorded sample of 15.1 on 2026-09-03. **A grep for a metric NAME
cannot find a generator that computes the VALUE.**

What *does* block a series is narrower and is `324.2`: `GZIP_TOLERANCE_KB = 0.3`
exists because zlib backends differ across Node builds, the two dispatchers run
different containers, and **three of the four historical rises sit inside that
floor**. Do not record a sample until the convention is written down.

## `origin/main` did NOT move under this wake

`git fetch origin main` at Step 0 and again immediately before the first commit,
as Step 0c mandates: `97a3137d` both times. No collision.

**Step 0 traps:** trap 1 bit again (detached HEAD, `git branch --show-current`
empty), fixed with `git checkout -B main origin/main` before any commit, and
`origin/main` again arrived as a **forced update** (`26447ba...97a3137`). Trap 2
clean in one `--unshallow` (**2,006** commits, no `shallow.lock`), and it again
brought the tags — the **thirty-seventh** consecutive container to do so;
`git tag | wc -l` → **8**. Trap 1c did not bite. No `git stash` was used at any
point this wake.

## The open set is 26 — no P0, and 11 are cloud-takeable

`roadmap_scope.py --rev 3cb2381a` reports **26 open / 50 closed**, OPEN slices
`[15, 112, 249, 273, 294, 296, 297, 309, 310, 315, 316, 319, 320, 322, 323,
324]`. Net from the last hand-off's 25: one closed (`307.1`) and three filed
(`324.1`, `324.2`, and `324.3` which closed in the same wake), so **Slice 307
has left the open set and Slice 324 has entered it**. The raw counts reconcile
exactly: `grep -c` reads 26 open / **52** closed, and 52 = 50 attributed + the 2
`[x]` under the non-slice `## STATE` heading.

- **cloud-takeable: 11** — `309.5`, `310.1`, `310.2`, `315.3`, `316.1`,
  `319.3`, `320.2`, `322.3`, `323.1`, `324.1`, `324.2`. (`297.1` is takeable
  here too but is counted once, under input-blocked, because that is what
  actually gates it.) **`309.5` is now the oldest of these** and is what rule 4
  reaches next. The cheapest are unchanged: `310.2`, `315.3`, `316.1`, `319.3`,
  `320.2`, `322.3`, `323.1`, and **`324.2` joins them** — its Accept names a
  measurement over `git blame` that could shrink it to one sentence.
  **Everything in this bullet below the count except the `309.5`, `324.1` and
  `324.2` sentences is carried from the previous hand-off**; only the OPEN set,
  the count and the new entries were re-measured.
- **owner-blocked (11):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3`, `112.4`, `249.7`, `249.10`, `249.11`, `249.12`, `249.13`, `273.2`,
  `296.3`, and **`294.2`'s brand-mark half** — but `294.2` is counted below,
  under input-blocked, because the folder's absence gates it first.
- **browser-blocked in the SCREENSHOT sense** (a LOCAL wake can take these):
  `249.6`, `249.9`, `320.3`. **`249.6` was declined at the clause level four
  times. Do not re-derive it.**
- **input-blocked (2): `297.1` and `294.2`** — the **fourth kind** `LOOPS.md`
  186.2's three do not cover. `297.1` stays open because both filed issues came
  from the owner's own agent, so the router was never tested. **`294.2`** needs
  the owner to land the `upstream-contribution/` folder on a branch before any
  wake can rank the six proposals.

11 + 10 + 3 + 2 = 26, asserted rather than left to the reader, and reconciled
against `grep -nE '^\s*[0-9]+\. \[ \]' ROADMAP.md`. (The owner-blocked bullet
names 11 ids; `294.2` is one of them and is counted under input-blocked, so the
arithmetic uses 10.)

**The fifth kind of blocked, `artifact-lost`, is still worth carrying** — an
item whose Accept says *re-measure* names an artifact, and the artifact either
resolves or it does not. Nothing in the current open set is of that kind,
checked rather than assumed.

## The archive sweep RAN this wake — the next one is not due

Measured at **`3cb2381a`**: **6,476 lines**, closed-history share **24.6%**
(1,594 lines across 4 closed slices). Both halves of the standing trigger are
now well clear, and **all 4 remaining targets are pinned by a still-open item**
(236.2), so there is nothing eligible left to move: `307` by `324.2`, `298` by
`316.1` and `294.2`, `292` by four items, `283` by `273.2`.

Trend across thirty-two readings: 27.5% → 32.0% → 34.2% → 38.0% → 39.4% →
37.5% → 36.9% → 36.2% → 35.5% → 37.3% → 36.9% → 38.3% → 37.6% → 9.4% → 10.3% →
10.9% → 11.8% → 26.0% → 26.9% → 30.5% → 29.5% → 28.9% → 31.2% → 35.3% → 34.7%
→ 36.4% → 38.1% → 40.3% → 39.4% → 39.9% → 41.5% → **24.6%**.

**A wake reaching for the next sweep should read `roadmap_scope.py`'s pin line
first and expect to move nothing.** That is the healthy state, not a failure.

## NOT VERIFIED, said plainly

No 1440/390 light-and-dark screenshots — a cloud wake has no Podman. Nothing
rendered changed and no claim here rests on rendering: the two diffs are two
Python scripts and three markdown files, no CSS, no `.astro`.

**Gates green on the committed tree:** all **17** cloud-runnable entry points,
re-derived from `ci.yml` rather than read off a list (the two documented set
differences still hold — `check:ci-ignores` is covered by `check:repo` inside
`docs:build`, and `npm run test -w @busy-office/ui` is CI's `npx vitest run
--root packages/core`), plus a second `docs:build` after the sweep and the §3b
re-run after this file was written. `check:claims` reports **170 live · 3 NOT
VERIFIED**, which is `ENVIRONMENT.md` §6b's container fact, not a regression.

**The `verifier` agent is not available in this session**, so `LOOPS.md` §2 step
6's verifier pass was done by hand — each staged diff re-read adversarially,
which is what found the two defects fixed before commit (a crash on a sample
carrying a non-numeric value, and a self-referential line count that the amend
itself had moved by two).

**The visual debts carried forward are unchanged and unspent**: `292.4/292.5`'s
screenshot lane on `/components/icon`, now sixteen wakes back; the
withdrawn-claim paragraph on `/components/data-table`; Slice 319's paragraph on
`/patterns/kanban` at 390px; and `320.3`'s `ApiTable.astro` `0.5rem` against
`ClassRef.astro` `.4rem`. **A local wake should glance at all four.**

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were
read** (issues **1** open, discussions **0** open).

**Three things want the owner's attention. One has come OFF this list.**

1. **Issue #2 is open and carries only the triage comment.** Slice 317 refuses
   the component with the measurement; Slice 319 corrected a second false claim
   on the same page the reporter was pointing at, which strengthens their report
   rather than weakening it. **Replying and closing the issue is a thirty-second
   owner action**, and `LOOPS.md` Step 1 says an issue "gets closed with a
   comment linking the fixing commit once its item ships". Whether a *wake*
   should post that comment is `297.1`, still open.
2. **`294.2` still cannot be advanced by anyone but the owner.** The six
   proposals it ranks live in an owner-supplied zip that never reached the repo.
   **Landing `upstream-contribution/` on a branch is a one-command unblock.**
   Unchanged from the last hand-off, not re-measured here.
3. **`273.2` is still worth their attention**, a thirty-second call untouched —
   whether a Polish round whose score does not move should increment `dry`. Not
   touched this wake; rule 6 was never reached.

**Off the list: `249.12`'s archival trigger.** Four hand-offs ran on *"the next
wake may be the one that crosses it with no recorded answer"*. It crossed, and
the crossing turned out to answer itself — with **both** halves past, AND and OR
agree, so no owner decision was needed to act. The item stays open for the
general question (what a wake does when only one half crosses), but it is no
longer blocking anything, and it should not be re-raised as urgent.
