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
at hand-off. Two commits this wake: the Slice 311 build, and this hand-off.
One iteration recorded — `Continue · build` — with **two** refusals.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## This hand-off reports what it measured; it does NOT predict the next dispatch

Counters read **after** recording this wake's row, which is the comparison
`LOOPS.md` mandates:

```
Standardize   2 / 4 Continue rounds   since 2026-09-06 17:49   ok
Objective     2 / 3 slices  [292, 294] since 2026-09-06 18:56  ok
Optimize      1 wake-date(s) newer     since 2026-09-06 16:56  STALE
```

Both counters moved on this wake's row, which is the counter agreeing with
something just written down — the comparison `LOOPS.md` says has found two of
the five parser recurrences. **One more closed slice arms rule 3.**

**Rule 5 is reported as *could not be evaluated*, never clear.** The residual
`1` is `306.1`'s clock artefact and **a cloud wake cannot drive it to `ok` by
recording more metrics** — do not try; read `306.1`. No metric was recorded this
wake. `bundle-gz-kb` still cannot be sampled (259.1, carried forward, not
re-run).

**`polish_requeue.py` did NOT run this wake** in any mode — `LOOPS.md` §3b step
0 is owed only once rule 6 is reached, and rule 4 matched first. No stamp
reading from this wake exists to quote. Of the three advisory checks, only
`check:resume-slice-ids` printed, against the *previous* revision of this file:
**2** named ids recorded closed, both historical references there. **They are
deliberately not quoted** — the previous hand-off established that naming them
makes the check fire on *this* revision for ids it holds only because it is
quoting the check, a report sustaining itself forever. The previous revision is
one `git show` away. Against **this** file the check reports **1**: `294.1`,
named throughout below as the work that closed it. The charter check and
`--verify-stamps` were silent.

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

**Slice 311** — dispatched by rule 4 as the oldest *dispatchable* open item
(`294.1`; everything older is owner- or screenshot-blocked, each re-classified
from its own body). Three probes added to `derive-floor.mjs`, plus the hole the
third one turned out to open.

**The premise reproduces, with the command beside it.** `light-dark(`, `oklch(`
and `scroll-state(` each read **0** in `packages/core/dist/css/index.css` and
**0** files across all of `dist/css/`. So the headline floor does not move —
`Chrome/Edge 119 · Firefox 129 · Safari 17.5`, 19 detected, reach 80.09% —
which 294.1's Accept names as a satisfying outcome, and it is the outcome.

**The item's own reason for calling the gap harmless is false about the
mechanism.** *"They arrive `@supports`-guarded"* does not protect the floor,
because this script cannot see a guard: all **3** `color-mix(` uses in
`packages/core/src/css` sit inside badge.css's `@supports` and `color-mix()` is
**detected anyway**. What keeps it off the published floor is `tier: 'polish'`.
Tier is where a guard is recorded, and the file now says so.

**Two corrections found by doing it, not by reading:** `scroll-state` is not a
BCD key (`scroll-state_queries` is), and that third probe opens the **first**
`version_added: false` case this script has ever had — Firefox and Safari both
read `false`, which `earliestUsableVersion` turned into `null`, which `floorFor`
skips, so *"no version will ever support this"* and *"we did not detect this"*
produced identical output. Base rate measured **before** adding the guard:
**0 of 80** probe/browser pairs across the 20 pre-existing probes.

**Four red-proofs, each red on exactly its own case, plus two controls.** Every
injection confirmed to land (`grep -c -F` 0 → 1) in the file `derive-floor.mjs`
reads, and every reported version set checked against an independent BCD read
taken before the code was written. The table is in ROADMAP 311; the fourth is
the fatal guard (`rc=1`, naming firefox and safari), and its controls are the
same re-tier with no injection (`rc=0`) and the un-injected tree (`rc=0`,
`neverSupported: []`).

**Two refusals, both recorded on the row:** failing on a `polish`-tier
never-supported feature (it would forbid any progressive enhancement one engine
lacks), and adding `@supports` parsing (a second instrument that would disagree
with the tier field).

**Gates green on the committed tree:** all 17 cloud-runnable entry points —
core `build`, `test`, `lint:css`, `docs:build` (`slice-refs` **903**,
`page-shape` **127** pages, `wrong-choice` **156**, `dsa-scores` **362**,
`deprecated-icon` **33**), `check:claims` (**169** live), `check:formatting`,
`check:scroll` (**914**), `check:layout` (**127**), `check:forced-colors`,
`test:axe` (**127 x 2**, zero violations), `check:target-size`, `check:search`,
`check:pseudo`, `check:quickstart`, `check:po-app` (**20**),
`check -w @busy-office/create-ui`, `npm run suite` (**28** screens x 2), and
`check:floor` (**580** source files) which is the second half of 294.1's
Accept. The *"3 NOT VERIFIED"* in `check:claims` is `ENVIRONMENT.md` 6b.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots — a cloud
wake has no Podman. **Nothing visual is claimed, and that is a measurement
rather than a hope**: the generated `floor.json` differs from the previous one
by exactly one added key (`diff` → `27a28 > "neverSupported": [],`), so the
three docs pages that print `floor.label` render byte-identical text.
**`292.4/292.5`'s screenshot lane on `/components/icon` remains unspent**, now
from four wakes back, and the withdrawn-claim paragraph on
`/components/data-table` is still unlooked-at.

## `origin/main` did NOT move under this wake

`git fetch origin main` at Step 0 and again immediately before the first commit,
as Step 0c mandates: `af1618a` both times. No collision.

**Step 0 traps:** trap 1 bit again (detached HEAD, `git branch --show-current`
empty), fixed with `git checkout -B main origin/main` before any commit, and
`origin/main` again arrived as a **forced update** (`26447ba...af1618a`). Trap 2
clean in one `--unshallow` (**1,975** commits, no `shallow.lock`), and it again
brought the tags — the **twenty-fifth** consecutive container to do so;
`git tag | wc -l` → **8**.

**One `git stash` was used deliberately, against ENVIRONMENT.md's warning, and
it is safe here for a stated reason**: the A/B was of the SCRIPT against a
`dist/` that is git-ignored, so the stash could not revert the data alongside
it — both runs read the identical `dist/css/index.css`. `git stash list` is
empty at hand-off.

## The open set is 24 — and 11 are cloud-takeable

`roadmap_scope.py` reports **24 open / 44 closed**, OPEN slices
`[15, 112, 249, 273, 294, 296, 297, 298, 300, 304, 305, 306, 307, 309, 310]`.
Net from the last hand-off's 25: **−1 closed (`294.1`)**, nothing filed. **The
raw counts reconcile exactly**: `grep -c` reads 24 open / **46** closed, and
46 = 44 attributed + the 2 `[x]` under the non-slice `## STATE` heading.

- **cloud-takeable: 11** — `294.2`, `298.1`, `300.2`, `304.1`, `305.1`,
  `305.2`, `306.1`, `307.1`, `309.5`, `310.1`, `310.2`. (`297.1` is takeable
  here too but is counted once, under input-blocked, because that is what
  actually gates it.) **`294.2` is now the oldest of these and has gone eight
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

## No archive sweep — declined on the SHARE half, and the reason is stated

Measured on the **committed** tree (`roadmap_scope.py`, run after the slice
commit): **5,946 lines**, closed-history share **27.4%** (1,632 lines across 7
closed slices). The standing trigger the hand-offs carry is *"past 5,450 lines
/ 40.6%"*: the line half is past, the share half is not, and that is the same
judgement the last wake made on 26.0% — recorded as a repeat rather than
re-derived as new.

Trend across twenty readings: 27.5% → 32.0% → 34.2% → 38.0% → 39.4% → 37.5% →
36.9% → 36.2% → 35.5% → 37.3% → 36.9% → 38.3% → 37.6% → 9.4% → 10.3% → 10.9% →
11.8% → 26.0% → **27.4%**.

**What a sweep would take, so the next wake need not re-derive it:** of the
seven eligible targets, **292 is pinned by `310.1`/`310.2` and 283 by `273.2`**
(236.2 — a sweep must read what an open item NAMES before moving it), and 311
is this wake's own. That leaves **308, 303, 302, 301** — four slices, a bulk
edit, and CLAUDE.md's rule says it is verified against the rendered artefact
one slice at a time. It is a wake's work, not a tail-end tidy, which is why it
was not bolted onto this one.

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were
read** (issues **1** open, already triaged; discussions **0** open).

**Three things want the owner's attention:**

1. **A "one line each" item cost a slice, and the interesting part is why.**
   294.1 said adding a probe is one line — the script's own header says so, and
   it is true of the two colour functions. The third probe's BCD key does not
   exist under the obvious spelling, and once found it turned out to be the
   first feature in this script's history that a browser will **never** support,
   which the floor derivation was silently blind to. **The general lesson:
   the estimate was right about the edit and wrong about the artefact** — the
   cost was in what the new input made the existing code do, which nothing in
   the item could have predicted and which one red-proof exposed immediately.

2. **`249.12` — the archival trigger — is the same owner call as last wake**,
   now with a second reading against it: 5,946 lines at 27.4%. The two halves
   of the standing trigger disagree, and nothing states whether it is an AND or
   an OR. A wake declining a sweep on that ambiguity twice is the signal that
   the trigger needs deciding, not that the sweep needs doing.

3. **`273.2` is the owner call still worth their attention**, a twenty-ninth
   wake untouched — whether a Polish round whose score does not move should
   increment `dry`. Not touched this wake; rule 6 was never reached.
