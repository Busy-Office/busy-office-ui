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
at hand-off. Two commits this wake: Slice 309, and this hand-off. One iteration
recorded — `Objective · grill` — carrying one refusal.

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
Standardize   0 / 4 Continue rounds   since 2026-09-06 17:49   ok
Objective     0 / 3 slices            since 2026-09-06 18:56   ok
Optimize      1 wake-date(s) newer    since 2026-09-06 16:56   STALE
```

The Objective counter went `3 / 3 OVERDUE → 0 / 3` on this wake's row — the
counter agreeing with something just written down, which is the comparison that
has now found two of the five parser recurrences.

**Rule 5 is reported as *could not be evaluated*, never clear.** The residual
`1` is `306.1`'s clock artefact and **a cloud wake cannot drive it to `ok` by
recording more metrics** — do not try; read `306.1`. No metric was recorded this
wake. `bundle-gz-kb` still cannot be sampled (259.1, carried forward, not
re-run).

**`polish_requeue.py` did NOT run this wake** in any mode — `LOOPS.md` §3b step
0 is owed only once rule 6 is reached, and rule 3 matched first. No stamp
reading from this wake exists to quote. `check:resume-slice-ids` reported 3
named ids closed (`292.8`, `296.2`, `308.1`) against the *previous* revision of
this file. `308.1` appears below **as a historical reference only** — it is the
item Slice 309 found had been silently mis-attributed by the parser bug, and it
is closed.

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

**`297.1` was re-read against issue #2 this wake**, discharging a carry-forward
three hand-offs old. It stays open and correctly classified: Slice 300 already
answered it — both #1 and #2 were filed by the owner's own agent, so the router
was never actually tested. It waits on a filing by someone who had to choose a
door.

## What landed this wake

**Slice 309** — an Objective grill dispatched by rule 3 at `3 / 3 OVERDUE
[292, 307, 308]`. **292 dropped** from the arming set per §6 step 0: already
grilled in full, twice. Grilled: **307 and 308**.

**Slice 308 reproduces to the word — nothing corrected.** A third, independently
written per-section splitter reads Step 0c at **936** from 274.2's cut through
HEAD (not one word came back), the +877 spread across the four other sections,
and the **56**-word heading-line gap between the report row and the body split,
constant at all eight revisions. A third variant that also strips numbered rule
lines sits a constant **93** below 308's table at all eight — three splitters,
three constants, identical deltas.

**Under Slice 307 was a P0, and it is the wake's finding.** `/stress` takes its
behaviours from the reference app's shared `page()` template. On **2026-08-23**,
`1f75dab4` appended a comment to that template's init line and swallowed
`initDataTables(); initAlerts(); initDropdowns();` into it. Select-all on `/pos`
and `/stress` did nothing for **15 days**, so 307's published *"3 ms / 7 ms, not
slower"* timed a no-op.

**Found by a control, not by reading the code** — the probe re-running 307's
measurement counted how many checkboxes ended up checked and read
`checkedAfterLast=0` beside its timings.

Blast radius, measured over all 10 GET routes: `initDataTables` **DEAD** on both
routes carrying a select-all (`/pos` 0/10, `/stress` 0/200); `initDropdowns` not
initialised on load on the 5 routes with a dropdown surface and no own init;
`initAlerts` **inert** — `grep -c 'bo-alert__dismiss'` reads **0**. A first
dropdown reading of `0` in this grill was itself wrong (bad selector) and was
corrected before it was quoted.

`check:po-app` reported **19 behaviours green** throughout and was not lying —
every browser assertion it makes runs on a page that self-inits or on
htmx-swapped content, which the template re-inits on a separate line. A real
gate, structurally blind to one line. Now 20.

**Also fixed, and found by this slice breaking it:** `roadmap_scope.py` read a
`## ` row inside a ``` fence as a real heading, so items below it were charged
to "no slice" and **dropped out of the OPEN set dispatcher rule 4 reads**.
Writing Slice 309's per-section table made it report 23 open against a raw 24.
Fence guard + self-test case F, red-proved by removing the guard.

**Everything red-proved by discrimination, not by inspection:** `/pos`
`DEAD(0/10)` → `LIVE(10/10)` and `/stress` `DEAD(0/200)` → `LIVE(200/200)`
across the one-line change; the gate re-injected with the exact broken line
(occurrence count asserted at 1) exits 1 with **`1 of 20`** — the case under
test and no other; case F fails and names the item that would be invisible to
rule 4 when its guard is removed.

**One refusal recorded:** publishing a replacement select-all figure. Today's
fixed-tree readings (median **122 ms / 1k**, **586 ms / 5k**) include a forced
style+layout flush that the published table scores as its own separate column,
so quoting them would repeat the exact error being corrected. They are in
ROADMAP 309, where the incomparability can be stated.

**Gates green on the committed tree:** core `build`, `test`, `lint:css`,
`docs:build` (`slice-refs` **899**, `page-shape` **127** pages, `wrong-choice`
**156**, `dsa-scores` **362**), `check:claims` (**169** live), `check:formatting`,
`check:scroll` (**914**), `check:layout` (**127**), `check:forced-colors`,
`test:axe` (**127 x 2**, zero violations), `check:target-size`, `check:search`,
`check:pseudo`, `check:quickstart`, `check:po-app` (**20**),
`check -w @busy-office/create-ui`, `npm run suite` (**28** screens x 2). The
*"3 NOT VERIFIED"* in `check:claims` is `ENVIRONMENT.md` 6b, not a regression.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots — a cloud
wake has no Podman. The one rendering change is the withdrawn-claim paragraph on
`/components/data-table`: two `<p class="bo-u-text-muted">` in a section that
already contains one, no new class, no CSS. The whole-tree gates swept it;
**nobody has looked at it**, and a local wake's glance closes that cheaply.
**292.4/292.5's screenshot lane on `/components/icon` remains unspent**, now
from two wakes back.

The behaviour findings are **not** in that category — element state, event
dispatch and DOM counts are squarely in `ENVIRONMENT.md`'s *can* list, and every
one was taken in real headless Chrome with a trusted click.

## `origin/main` did NOT move under this wake

`git fetch origin main` at Step 0 and again immediately before the first commit,
as Step 0c mandates: `c78a9dd` both times. No collision.

**Step 0 traps:** trap 1 bit again (detached HEAD, `git branch --show-current`
empty), fixed with `git checkout -B main origin/main` before any commit, and
`origin/main` again arrived as a **forced update** (`26447ba...c78a9dd`). Trap 2
clean in one `--unshallow` (**1,971** commits, no `shallow.lock`), and it again
brought the tags — the **twenty-third** consecutive container to do so;
`git tag | wc -l` → **8**. Trap 1c did not bite. **A trap this file has not
named bit for real:** `node examples/po-app/server.mjs` exits
`MODULE_NOT_FOUND` on a fresh clone until `check:po-app` performs its own
install — filed as part of `309.5`.

## The open set is 24 — and 11 are cloud-takeable

`roadmap_scope.py` reports **24 open / 42 closed**, OPEN slices
`[15, 112, 249, 273, 292, 294, 296, 297, 298, 300, 304, 305, 306, 307, 309]`.
Net from the last hand-off's 23: **+1**, `309.5`. **The raw counts reconcile
exactly**: `grep -c` reads 24 open / **44** closed, and 44 = 42 attributed + the
2 `[x]` under the non-slice `## STATE` heading. That arithmetic now holds
because of `309.6`; before it, five items were mis-filed and the closed count
could not be reconstructed this way.

- **cloud-takeable: 11** — `292.9`, `294.1`, `294.2`, `298.1`, `300.2`,
  `304.1`, `305.1`, `305.2`, `306.1`, `307.1`, `309.5`. (`297.1` is takeable
  here too but is counted once, under input-blocked, because that is what
  actually gates it.) **`294.1`/`294.2` have now gone six hand-offs classified
  from Slice 294's triage text rather than from their own bodies** — said
  plainly; `294.2` says the brand mark inside it is an owner call, so read it
  before dispatching. **`305.1` carries a caveat, from its own Accept**: the
  four defects close by re-measuring ink extents and inter-block gaps, which is
  geometry and squarely in `ENVIRONMENT.md`'s *can* list — but it sits inside a
  Gauntlet whose scoring wants a blind critic, so a wake without one closes the
  measurement half and must say so rather than claiming the round. **`309.5` is
  the freshest and the cheapest**: it is a script plus a start command, needs no
  browser image, and its Accept lets *refusing to commit a probe* close it.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3`, `112.4`, `249.7`, `249.10`, `249.11`, `249.12`, `249.13`, `273.2`,
  `296.3`.
- **browser-blocked in the SCREENSHOT sense** (a LOCAL wake can take these):
  `249.6`, `249.9`. **`249.6` was declined at the clause level four times. Do
  not re-derive it.**
- **input-blocked (1): `297.1`** — the **fourth kind** `LOOPS.md` 186.2's three
  do not cover. Re-read against issue #2 this wake (see Step 1); it stays open
  because both filed issues came from the owner's own agent, so the router was
  never tested.

11 + 10 + 2 + 1 = 24, asserted rather than left to the reader, and reconciled
against `grep -nE '^\s*[0-9]+\. \[ \]' ROADMAP.md` rather than against this
list — the 24 ids it prints are exactly the ones named above.

## No archive sweep — the line half of the standing trigger is past for a second reading

Measured on the **committed** tree (`roadmap_scope.py`, run after the slice
commit): **5,667 lines**, closed-history share **11.8%** (664 lines across 5
closed slices). The standing trigger the hand-offs carry is *"past 5,450 lines /
40.6%"*.

Trend across eighteen readings: 27.5% → 32.0% → 34.2% → 38.0% → 39.4% → 37.5% →
36.9% → 36.2% → 35.5% → 37.3% → 36.9% → 38.3% → 37.6% → 9.4% → 10.3% → 10.9% →
**11.8%**.

**No sweep run, and the reason is unchanged and now firmer:** only 664 lines of
closed history exist to move, and the growth taking the file past 5,450 is *new
open slices* — this wake added ~200 lines of them itself. No archive sweep
touches that. The two halves of the trigger disagreeing, with the cheap remedy
already spent, is exactly the state `249.12` exists to be decided about.

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were
read** (issues **1** open, already triaged; discussions **0** open).

**Three things want the owner's attention:**

1. **A shipped docs page carried a number derived from a no-op for a day, and
   the only thing that caught it was a control column in a throwaway probe.**
   The loop's doctrine on red-proving injections is strong; what Slice 309
   exposes is the *measurement* side — `/stress` keeps the rows and not the
   measurement, so every re-run invents its own method and none is comparable.
   `309.5` is filed and cheap. Worth knowing that the published performance
   table on `/components/data-table` is the framework's only quantitative
   adoption claim, and it went 15 days with its harness silently dead.

2. **`249.12` — the archival trigger — still has the case its earlier readings
   could not make**, now on a second reading: line half past, share half at
   11.8%, i.e. the sweep is no longer the instrument for the growth. A policy
   question about how much a wake should read, not a measurement a sweep can
   take.

3. **`273.2` is the owner call still worth their attention**, a twenty-seventh
   wake untouched — whether a Polish round whose score does not move should
   increment `dry`. Not touched this wake; rule 6 was never reached.
