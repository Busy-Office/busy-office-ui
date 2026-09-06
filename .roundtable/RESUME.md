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
at hand-off. Two commits this wake: Slice 308, and this hand-off. One iteration
recorded — `Standardize · sweep` — carrying one refusal.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## This hand-off reports what it measured; it does NOT predict the next dispatch

The previous hand-off predicted a dispatch and was wrong within hours, and said
so. That correction is honoured here: what follows are readings, and the next
wake dispatches from `dispatch_status.py`, not from this file.

Counters read **after** recording this wake's row, which is the comparison
`LOOPS.md` mandates:

```
Standardize   0 / 4 Continue rounds   since 2026-09-06 17:49   ok
Objective     3 / 3 slices            since 2026-09-07 00:21   OVERDUE  [292, 307, 308]
Optimize      1 wake-date(s) newer    since 2026-09-06 16:56   STALE
```

The Standardize counter went `4 / 4 OVERDUE → 0 / 4` on this wake's row, which
is the counter agreeing with something just written down.

**Rule 5 is reported as *could not be evaluated*, never clear.** The residual
`1` is `306.1`'s clock artefact and **a cloud wake cannot drive it to `ok` by
recording more metrics** — do not try; read `306.1`. No metric was recorded
this wake. `bundle-gz-kb` still cannot be sampled (259.1, carried forward, not
re-run).

**`polish_requeue.py` did NOT run this wake** in any mode — `LOOPS.md` §3b step
0 is owed only once rule 6 is reached, and rule 2 matched first. No stamp
reading from this wake exists to quote. `check:resume-slice-ids` reported 2
named ids closed (`292.8`, `296.2`) against the *previous* revision of this
file; both are historical references there and neither appears below.

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

**Slice 308** — a Standardize sweep, dispatched by rule 2 at `4 / 4 OVERDUE`.
**4 of 4 lanes run**, said as the playbook asks.

Lanes 1-3 clean, and lane 3 is the one that shows the sweep is not reading a
frozen tree: its corpus moved `111,622 → 111,798` words while the flagged union
stayed the same **15** pages Slice 290 checked against 158.1's twelve, 161.1's
three and 178.3's `/concepts/scale/`. No page entered the set unverdicted, which
is that lane's actual question. Lane 1 read `0 dead / 1,433` and lane 2
`74 · 242 · 230 · 8` with membership unchanged — the fifth consecutive sweep at
both.

**Lane 4 carried the finding, and it contradicts how three sweeps have described
this region.** The `by region` block reads `+328.5%` dispatch against `+268.0%`
file, which from that number alone reads as *274.2's cut is being undone*. Split
per section across the eight revisions since that cut, **Step 0c — the only
section 274.2 touched — reads 936 at every one of them. Not one word came
back.** The `+877` landed in four other sections, each a rule a wake executes:
rule 3 `+303` (279.4's loop set), Step 0 `+151` (283.2's third advisory check),
Step 1 `+371` (297's intake split, 302's reading rule), the loops table `+52`
(296's Gauntlet row).

So a second cut would have to come out of instruction. `308.1` records the
refusal, and `LOOPS.md` §3 lane 4 now carries the discrimination as a
**property** — *the cut section regrew* (cut again) versus *other sections grew*
(say so, file the structural question) — with the per-revision command beside
it.

**The two instruments were reconciled before either was quoted:**
`report_loop_prose.py`'s row reads **6,535** at HEAD and a per-section body
split reads **6,479**; the difference is heading lines and it is **exactly 56 at
all eight revisions**, so their deltas agree to the word and their totals never
will. A sweep comparing Slice 290's quoted `6,112` against a report row would
read a `+56` step that does not exist.

**The playbook edit was red-proved against being the thing it warns about**: it
lands below `## Playbooks`, so the dispatch region reads **6,535 before and
6,535 after** while the file goes `16,118 → 16,371`. Measured from the index,
not the tree.

**Step 1's un-instrumented lane was scanned.** Five scripts changed since 290's
scan; `gen-og-card.mjs` is the only new file and holds no hand-copied lookup
table (it reads `--bo-*` out of `packages/core/dist/css/index.css` at run time).
Its display-size literals are already open as **`298.1`**, so re-filing them
would be the duplicate that lane exists to avoid.

**Gates green on the committed tree:** core `build`, `test`, `lint:css`,
`docs:build` (`check:repo` incl. `slice-refs` **898** / **290** headings,
`page-shape` **127** pages, `wrong-choice` **156**, `dsa-scores` **362**),
`check:claims` (**169** live), `check:formatting`, `check:scroll` (**914**),
`check:layout` (**127**), `check:forced-colors`, `test:axe` (**127 x 2**, zero
violations), `check:target-size`, `check:search`, `check:pseudo`,
`check:quickstart`, `check:po-app`, `check -w @busy-office/create-ui`,
`npm run suite` (**28** screens x 2). The *"3 NOT VERIFIED"* in `check:claims`
is `ENVIRONMENT.md` 6b, not a regression.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots — a cloud
wake has no Podman. Nothing in this slice renders: the diff is two markdown
files, no CSS, no page, no script. **292.4/292.5's screenshot lane on
`/components/icon` remains unspent** from the previous wake, and a local wake's
glance still closes it cheaply.

## `origin/main` did NOT move under this wake

`git fetch origin main` at Step 0 and again immediately before the first commit,
as Step 0c mandates: `ecf1c343` both times. No collision.

**Step 0 traps:** trap 1 bit again (detached HEAD, `git branch --show-current`
empty), fixed with `git checkout -B main origin/main` before any commit, and
`origin/main` again arrived as a **forced update** (`26447ba...ecf1c34`) — the
tip the previous hand-off named (`29457ba`) was no longer the tip, because the
local dispatcher landed Slice 307 after writing it. Trap 2 clean in one
`--unshallow` (**1,969** commits, no `shallow.lock`), and it again brought the
tags — the **twenty-second** consecutive container to do so; `git tag | wc -l` →
**8**. Trap 1c did not bite.

## The open set is 23 — and 10 are cloud-takeable

`roadmap_scope.py` reports **23 open / 36 closed**, OPEN slices
`[15, 112, 249, 273, 292, 294, 296, 297, 298, 300, 304, 305, 306, 307]`. **Net
from the last hand-off's 23: zero** — `308.1` was filed and closed inside its
own slice, so it never joined the open set. `check-resume-slice-ids` reports a
different closed count (**39**) — it also counts the 2 `[x]` items under the
non-slice `## STATE` heading and `308.1`. **Do not quote a bare closed count.**

- **cloud-takeable: 10** — `292.9`, `294.1`, `294.2`, `298.1`, `300.2`,
  `304.1`, `305.1`, `305.2`, `306.1`, `307.1`. (`296.2` was on the previous
  hand-off's list and closed in Slice 307; `307.1` replaces it, classified from
  its own Accept.) (`297.1` is takeable here too but
  is counted once, under input-blocked below, because that is what actually
  gates it.) **`294.1`/`294.2` have now gone five hand-offs classified from Slice
  294's triage text rather than from their own bodies** — said plainly; `294.2`
  says the brand mark inside it is an owner call, so read it before dispatching.
  **`305.1` carries a caveat, from its own Accept**: the four defects close by
  *re-measuring ink extents and inter-block gaps*, which is geometry and squarely
  in `ENVIRONMENT.md`'s *can* list — but it sits inside a Gauntlet whose scoring
  wants a blind critic, so a wake without one closes the measurement half and
  must say so rather than claiming the round.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3`, `112.4`, `249.7`, `249.10`, `249.11`, `249.12`, `249.13`, `273.2`,
  `296.3`.
- **browser-blocked in the SCREENSHOT sense** (a LOCAL wake can take these):
  `249.6`, `249.9`. **`249.6` was declined at the clause level four times. Do
  not re-derive it.**
- **input-blocked (1): `297.1`** — the **fourth kind** `LOOPS.md` 186.2's three
  do not cover. Its Accept requires *"one wake reports on a real filed item"*.
  Issue #2 is a real filed item that reached triage, so **the next wake should
  re-read `297.1` against it** rather than carrying this classification forward
  — this hand-off did not, for the third time, because rule 2 matched first.

10 + 10 + 2 + 1 = 23, asserted rather than left to the reader, and reconciled
against `grep -nE '^\s*[0-9]+\. \[ \]' ROADMAP.md` rather than against this list
— the 23 ids it prints are exactly the ones named above.

## No archive sweep — and for the first time ONE HALF of the standing trigger is past

Measured on the **committed** tree (`roadmap_scope.py`, run after the slice
commit): **5,455 lines**, closed-history share **10.9%** (597 lines across 5
closed slices). The standing trigger the hand-offs carry is *"past 5,450 lines /
40.6%"*, and this is the first reading where the **line half is past** while the
share half is nowhere near it.

Trend across seventeen readings: 25.4% → 27.5% → 32.0% → 34.2% → 38.0% → 39.4% →
37.5% → 36.9% → 36.2% → 35.5% → 37.3% → 36.9% → 38.3% → 37.6% → 9.4% → 10.3% →
**10.9%**.

**No sweep run, and the reason is that a sweep would not help.** Only 597 lines
of closed history exist to move, one of the 5 targets is Slice 308 itself
(landed this wake), and the growth taking the file past 5,450 is *new open
slices*, which no archive sweep touches. The two halves of the trigger
disagreeing — and disagreeing in this direction, where the cheap remedy is
already spent — is exactly the state `249.12` exists to be decided about, and it
is now visible in the numbers rather than argued.

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were
read** (issues **1** open, already triaged; discussions **0** open).

**Three things want the owner's attention:**

1. **`249.12` — the archival trigger — now has the case its earlier readings
   could not make.** Eleven sweeps have run on judgement. This is the first wake
   where the line half of the carried trigger is past and the share half is at
   10.9%, i.e. where the sweep is no longer the instrument for the growth. That
   is a policy question about how much a wake should read, not a measurement a
   sweep can take.

2. **The same shape one level over, and it is new: `LOOPS.md`'s dispatch region
   has no budget.** Slice 308 measured five legitimate rules adding **877 words
   in 32 hours** to the region every wake reads end to end before it decides
   anything, while the section that was cut held perfectly. Nothing in the loop
   bounds that, and `308.1` deliberately refused to invent a bound. Same
   owner-shaped question as `249.12`, one file over.

3. **`273.2` is the owner call still worth their attention**, a twenty-sixth
   wake untouched — whether a Polish round whose score does not move should
   increment `dry`. Not touched this wake; rule 6 was never reached.
