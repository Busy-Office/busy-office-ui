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
at hand-off. **Two commits this wake** — the Slice 314 build and this rewrite —
and **one iteration recorded**, `Standardize · sweep`, with one refusal.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## The standing environment fact: CI HAS NO `paths-ignore`

`312.2` removed it entirely (last wake). **A push that touches only
`.roundtable/**` runs the full suite.** The consequence a wake feels directly is
`ENVIRONMENT.md` §3b — *re-run `npm run docs:build` after writing this file,
before pushing* — and it was executed this wake, after this file was written,
before the push. Not a subtlety about pushes that happen to carry a ROADMAP
change: the ordinary case, every wake.

## This hand-off reports what it measured; it does NOT predict the next dispatch

Counters read **after** recording this wake's row, which is the comparison
`LOOPS.md` mandates:

```
Standardize   0 / 4 Continue rounds  since 2026-09-07 (this wake)   ok
Objective     3 / 3 slices [292, 294, 312]  since 2026-09-06 18:56  OVERDUE
Optimize      STALE
```

**This wake's row RESET the Standardize counter and did NOT move Objective's**,
which is the comparison `LOOPS.md` mandates and the one that has found two of
the five parser recurrences. A `Standardize` row closing Slice 314 *should* move
Objective's counter — `Standardize` is in `CLOSES_A_SLICE` (279.4 added
`Polish`; `Standardize` was already there for the 12 slices with a Standardize
row and no Continue row). **Re-run `dispatch_status.py` rather than trusting
these three lines** — they are a reading taken at hand-off, and the file's
charter is that it reports what it measured and does not predict.

**Rule 3 is the live one for the next wake.** It read `3 / 3 … OVERDUE
[292, 294, 312]` at Step 0b this wake and was **not reached**, because rule 2
sits above it and matched. It has now been un-reached for two consecutive
wakes. A next wake with no P0 and a reset Standardize counter reaches it first.

`grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` reads **0**, so rule 1 does not
match.

**Rule 5 is reported as *could not be evaluated*, never clear.** No metric was
recorded this wake. `306.1` explains why a cloud wake cannot drive that line to
`ok` by recording more; do not try. `bundle-gz-kb` still cannot be sampled
(`259.1`, carried forward, not re-run).

**`polish_requeue.py` did NOT run this wake** in any mode — `LOOPS.md` §3b step
0 is owed only once rule 6 is reached, and rule 2 matched first. No stamp
reading from this wake exists to quote.

Of the three advisory checks that run from `record_iteration.py`, only
`check:resume-slice-ids` printed, against the *previous* revision of this file.
**The ids it named are deliberately not quoted** — naming them makes the check
fire on *this* revision for ids it holds only because it is quoting the check, a
report sustaining itself forever. The previous revision is one `git show` away.
The charter check and `--verify-stamps` were silent.

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

**Slice 314**, dispatched by **rule 2** (Standardize `4 / 4`, OVERDUE). Rules
3-8 were not reached. **All four lanes ran — say `n of 4`; this was 4 of 4**,
and all four came back clean.

| lane | reading |
|---|---|
| 1 dead-style | 0 dead of **1,433** live inline declarations, 0 pages |
| 2 css-repeats | **8** repeated bodies, `LOOPS.md`'s table exactly; 74 files · 242 rules · 230 distinct |
| 3 report:prose | **0 unverdicted**; 118 pages · median 792 · **111,907** words; union of flagged = 15 |
| 4 loop-prose | no finding — Slice 308 already attributed the region and `LOOPS.md` is byte-identical since |

**Three of the four readings are byte-identical to Slice 293's while every
lane's input moved**, so they were treated as a defect until proven otherwise
and both were *explained*, not merely observed: lane 1's 1,433 because the
8 `style="` lines in the docs diff are `4 +` / `4 −`, four in-place
substitutions (declaration-count-neutral, neither side dead); lane 2's 242/230
because the whole of `icon.css`'s +14/−1 sits inside a CSS **comment**.

**Lane 3's clean reading nearly went the other way, and the archive is what
stopped it.** `/concepts/scale/` is in the flagged union and is absent from both
158.1's twelve and 161.1's three — it carries **178.3**'s verdict, which the
archive itself flags as *"the one a naive check misses"*. Verdicted set is 16;
today's flagged union of 15 is a subset of it (`/patterns/output-form/` has
dropped out).

**The finding came from step 4's re-scan, not from a lane.** 292.8's premise
re-runs exactly (**4 of 127**), and what it calls *"the whole page tree"* is
`apps/docs/src/pages/`. The **24 `.astro` files in `apps/docs/src/components/`
and `apps/docs/src/layouts/`** — rendered INTO all 127 of those pages — were
outside every count it took; the same command over them returns **2 of 24**.
Same shape as 292.9, one directory over.

**`314.1` landed.** `PatternPreview.astro` `1.5rem` → `var(--bo-font-size-xl)`
and `AppTile.astro` `1rem` → `var(--bo-font-size-md)`, both exact against
`tokens/typography.css`. `AppTile`'s `2rem` **stays** — no token equals 2rem
(`xl` is the largest at 1.5rem) and `BOX` pairs it with `block-size: 2rem` — and
the reason is recorded **at the site**, where a reader meets the question, as
well as in the roadmap. Accept clause 1 re-runs to **1 of 24**, which is that
one site.

**Red-proved in BOTH directions, which is what makes the no-op mean something.**
4,276 elements over the three pages that render these components: 0 key-set
diffs and **0** computed `font-size` differences before/after. Overriding
`--bo-font-size-xl` moves the before tree 4 and the after tree **7** (+3 = the
three `PatternPreview` tiles); overriding `--bo-font-size-md` moves the before
tree **0** and the after tree **2** (the two `AppTile` badges), every transition
to 52px. A no-op diff alone is also what an edit that never landed produces.

**`314.2` filed, not built, and it is the refusal recorded on this wake's row.**
The same scope gap exists for spacing and `font-weight` literals — a different
property nothing has adjudicated. Base rates, with the property↔token-family
filter a bare value match lacks (that one proposes `font-size: 2rem →
--bo-space-8`): **18 of 210 raw in `pages/` (8.6%)**, **7 of 32 in
`components/`+`layouts/` (21.9%)**. Half the spacing hits are a **zero**, and
`--bo-space-0` for a reset is the wrong direction. **No gate added** — the
base rate is the reason, per 94.11.

**Gates green on the committed tree:** all **17** cloud-runnable entry points
(`ENVIRONMENT.md`'s derived list), plus the §3b re-run of `docs:build` after
this file was written.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots — a cloud
wake has no Podman. **Nothing visual is claimed, and that is structural rather
than hopeful**: both swapped values are byte-equal to the literals they replace,
so a visual difference would require a token to differ from its own definition.
**`292.4/292.5`'s screenshot lane on `/components/icon` remains unspent**, now
from six wakes back, and the withdrawn-claim paragraph on
`/components/data-table` is still unlooked-at.

## `origin/main` did NOT move under this wake

`git fetch origin main` at Step 0 and again immediately before the first commit,
as Step 0c mandates: `ba22f5d6` both times. No collision.

**Step 0 traps:** trap 1 bit again (detached HEAD, `git branch --show-current`
empty), fixed with `git checkout -B main origin/main` before any commit, and
`origin/main` again arrived as a **forced update** (`26447ba...ba22f5d`). Trap 2
clean in one `--unshallow` (**1,981** commits, no `shallow.lock`), and it again
brought the tags — the **twenty-seventh** consecutive container to do so;
`git tag | wc -l` → **8**. Trap 1c did not bite. No `git stash` was used.

## The open set is 25 — no P0, and 11 are cloud-takeable

`roadmap_scope.py` reports **25 open / 47 closed**, OPEN slices
`[15, 112, 249, 273, 294, 296, 297, 298, 300, 304, 305, 306, 307, 309, 310, 314]`.
Net from the last hand-off's 24: **+2 filed (`314.1`, `314.2`), 1 of them
(`314.1`) closed in the same wake**, so **+1 open**. **The raw counts reconcile
exactly**: `grep -c` reads 25 open / **49** closed, and 49 = 47 attributed + the
2 `[x]` under the non-slice `## STATE` heading.

- **cloud-takeable: 12** — `294.2`, `298.1`, `300.2`, `304.1`, `305.1`,
  `305.2`, `306.1`, `307.1`, `309.5`, `310.1`, `310.2`, `314.2`. (`297.1` is
  takeable here too but is counted once, under input-blocked, because that is
  what actually gates it.) **`294.2` is the
  oldest of these and has gone ten hand-offs classified from Slice 294's triage
  text rather than from its own body** — its Accept says the brand mark inside
  it is an **owner call**, so read it before dispatching. **`305.1` carries a
  caveat, from its own Accept**: the four defects close by re-measuring ink
  extents and inter-block gaps, which is geometry and squarely in
  `ENVIRONMENT.md`'s *can* list — but it sits inside a Gauntlet whose scoring
  wants a blind critic, so a wake without one closes the measurement half and
  must say so rather than claiming the round. **`309.5`, `310.2` and `314.2` are
  the cheapest**: `309.5` is a script plus a start command and its Accept lets
  *refusing to commit a probe* close it; `310.2` closes by deleting five unused
  consts; `314.2` is filed with its base rates already measured and its Accept
  explicitly says deciding no change is a satisfying outcome.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3`, `112.4`, `249.7`, `249.10`, `249.11`, `249.12`, `249.13`, `273.2`,
  `296.3`.
- **browser-blocked in the SCREENSHOT sense** (a LOCAL wake can take these):
  `249.6`, `249.9`. **`249.6` was declined at the clause level four
  times. Do not re-derive it.**
- **input-blocked (1): `297.1`** — the **fourth kind** `LOOPS.md` 186.2's three
  do not cover. It stays open because both filed issues came from the owner's
  own agent, so the router was never tested.

12 + 10 + 2 + 1 = 25, asserted rather than left to the reader, and reconciled
against `grep -nE '^\s*[0-9]+\. \[ \]' ROADMAP.md` rather than against this
list — the 25 ids it prints are exactly the ones named above.

## No archive sweep — declined on the SHARE half, fourth wake running

Measured on the working tree after Slice 314 was written (`roadmap_scope.py`):
**6,404 lines**, closed-history share **29.5%** (1,892 lines across 9 closed
slices). The standing trigger the hand-offs carry is *"past 5,450 lines /
40.6%"*: the line half is past, the share half is not — the same judgement the
last three wakes made, at 26.0%, 26.9% and 30.5%. **It went DOWN this wake**
(30.5% → 29.5%), and the mechanism is worth naming rather than reading as
progress: the denominator grew by 191 lines of new open slice while the numerator
did not move, so the share fell because the live file got bigger. That is the
opposite of what the trigger is trying to detect.

Trend across twenty-two readings: 27.5% → 32.0% → 34.2% → 38.0% → 39.4% →
37.5% → 36.9% → 36.2% → 35.5% → 37.3% → 36.9% → 38.3% → 37.6% → 9.4% → 10.3% →
10.9% → 11.8% → 26.0% → 26.9% → 30.5% → **29.5%**.

**What a sweep would take, so the next wake need not re-derive it:**
`roadmap_scope.py` reports the pins itself — **292 is pinned by `310.1`/`310.2`
and 283 by `273.2`** (236.2), and 314 is this wake's own. That leaves **313,
312, 311, 308, 303, 302, 301** — seven slices, a bulk edit, and CLAUDE.md's rule
says it is verified against the rendered artefact one slice at a time. It is a
wake's work, not a tail-end tidy.

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were
read** (issues **1** open, already triaged; discussions **0** open).

**Three things want the owner's attention:**

1. **`249.12` — the archival trigger — is the same owner call as the last three
   wakes, and this wake produced the reading that shows why it needs deciding.**
   The share half moved **down** (30.5% → 29.5%) with nothing archived, purely
   because a new open slice enlarged the denominator. A trigger whose two halves
   disagree, and one of which moves the wrong way when the file grows, cannot be
   satisfied by waiting. Nothing states whether the trigger is an AND or an OR.
   A wake declining a sweep on that ambiguity four times is the signal that the
   trigger needs deciding, not that the sweep needs doing.

2. **`273.2` is the owner call still worth their attention**, a thirty-first
   wake untouched — whether a Polish round whose score does not move should
   increment `dry`. Not touched this wake; rule 6 was never reached.

3. **The CI cost `312.2` accepted is unchanged and unmeasured this wake.** The
   last hand-off measured 9 of the last 30 commits and 38 of the last 100
   touching only `.roundtable/**`-shaped paths, at ~14.7 machine-minutes a run,
   and proposed a cheap second workflow — refused there because it needs a
   hand-kept list of which gates are repo-wide. Carried forward as the owner's
   call, **not re-measured here**, so treat those figures as last wake's.
