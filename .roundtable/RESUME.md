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
at hand-off. Two commits this wake: the Slice 292.9 build, and this hand-off.
One iteration recorded — `Continue · build` — no refusal.

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
Standardize   1 / 4 Continue rounds   since 2026-09-06 17:49   ok
Objective     1 / 3 slices  [292]     since 2026-09-06 18:56   ok
Optimize      1 wake-date(s) newer    since 2026-09-06 16:56   STALE
```

Both counters moved on this wake's row — the Continue round incremented
Standardize, and closing the last open item of Slice 292 armed Objective by one.
That is the counter agreeing with something just written down, which is the
comparison `LOOPS.md` says has found two of the five parser recurrences.

**Rule 5 is reported as *could not be evaluated*, never clear.** The residual
`1` is `306.1`'s clock artefact and **a cloud wake cannot drive it to `ok` by
recording more metrics** — do not try; read `306.1`. No metric was recorded this
wake. `bundle-gz-kb` still cannot be sampled (259.1, carried forward, not
re-run).

**`polish_requeue.py` did NOT run this wake** in any mode — `LOOPS.md` §3b step
0 is owed only once rule 6 is reached, and rule 4 matched first. No stamp
reading from this wake exists to quote. Of the three advisory checks, only
`check:resume-slice-ids` printed: it reported **5** named ids closed against the
*previous* revision of this file, all historical references. The charter check
and `--verify-stamps` were silent.

**The five are deliberately not re-listed here, and that is not tidying.** The
first draft of this hand-off quoted them by id, and the check then fired on
*this* revision for ids it names only because it is quoting the check — a report
sustaining itself forever, which is CLAUDE.md's
assertion-trips-on-its-own-explanation one level up. The previous revision's
list is in git, one `git show` away. Against **this** file the check reports
**1**: `292.9`, closed by this wake and named below as the work that closed it.

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

`297.1` was **not** re-read this wake; the previous hand-off discharged it
against issue #2 and nothing has changed on that intake since.

## What landed this wake

**Slice 292.9** — dispatched by rule 4 as the oldest *dispatchable* open item
(everything older is owner- or screenshot-blocked). A tree-wide
`check:deprecated-icons`, plus the six sites it turned out to be about.

**The premise reproduces to the site.** The same command returns the same five
hand-written sites across four files, and `--barcode`/`--user` still reach 0 as
hand-written classes. All five were resolved by choosing a shipped glyph, so
`KEEPS_ITS_GLYPH` is empty — the Accept allows an exception and none was true.

**The five were not all of it, and the sixth is the finding.** The source phase
went green while `/components/demos/sidebar-nav-narrow` and `-wide` were both
still rendering `bo-icon--user`: `SidebarNavShellDemo.astro` hand-writes the
glyph NAME in a tuple and interpolates it into the class, so no scan for a
literal class can see it. **Found by grepping the BUILT pages after the gate was
already green** — CLAUDE.md's rendered-artefact rule doing its job.

**The blind spot had been named in the gate header WITH a measurement, and the
measurement was wrong.** The needle was `icon: '<name>'`, an object-property
spelling; the live site is a tuple. A needle that assumes one syntax reports a
confident absence about the other. The gate therefore gained a second phase
that traces no values at all and reads the artefact, and moved out of
`check:repo` into the docs `build` chain rather than skipping half of itself
when `dist/` is absent.

**Three red-proofs, each red on exactly the case under test:** `1 of 34` (glyph
arm), `1 of 33` (reconciliation arm), and the real one — reverting
`SidebarNavShellDemo` and rebuilding — `2 of 35`, those two pages and no
others. `--self-test` covers 8 classification cases.

**Two exemptions, one kept and one deleted, both by measurement:** the
`icon.astro` frontmatter exemption is load-bearing (dropping it fails `1 of 34`
at `2 named + 2 interpolated against 9 bare`), and a `/suite/` entry was
**removed as dead** — `dist-pages.mjs` skips `suite` by name, so it could never
have matched.

**Slice 310 filed, not fixed:** `310.1` the two reference apps' 4 literal + 2
interpolated deprecated-glyph sites, which neither phase reaches; `310.2`
`/base/motion` declaring five copyable markup consts the template never
renders — one of them is the very site 292.9 called "a copyable markup string",
and it teaches nobody because it ships nowhere.

**Gates green on the committed tree:** core `build`, `test` (29 files / 165),
`lint:css`, `docs:build` (`slice-refs` **902**, `page-shape` **127** pages,
`wrong-choice` **156**, `dsa-scores` **362**, `deprecated-icon` **33**),
`check:claims` (**169** live), `check:formatting`, `check:scroll` (**914**),
`check:layout` (**127**), `check:forced-colors`, `test:axe` (**127 x 2**, zero
violations), `check:target-size`, `check:search`, `check:pseudo`,
`check:quickstart`, `check:po-app` (**20**),
`check -w @busy-office/create-ui`, `npm run suite` (**28** screens x 2). The
*"3 NOT VERIFIED"* in `check:claims` is `ENVIRONMENT.md` 6b, not a regression.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots — a cloud
wake has no Podman. Five demo-rail labels and two glyphs changed on four docs
pages. The whole-tree gates swept them and the mask box is `1em` either way, so
no geometry moves; **nobody has looked at them**, and a local wake's glance
closes that cheaply. **`292.4/292.5`'s screenshot lane on `/components/icon`
remains unspent**, now from three wakes back, and the withdrawn-claim paragraph
on `/components/data-table` from the last wake is still unlooked-at too.

## `origin/main` did NOT move under this wake

`git fetch origin main` at Step 0 and again immediately before the first commit,
as Step 0c mandates: `1f1e2fb` both times. No collision.

**Step 0 traps:** trap 1 bit again (detached HEAD, `git branch --show-current`
empty), fixed with `git checkout -B main origin/main` before any commit, and
`origin/main` again arrived as a **forced update** (`26447ba...1f1e2fb`). Trap 2
clean in one `--unshallow` (**1,973** commits, no `shallow.lock`), and it again
brought the tags — the **twenty-fourth** consecutive container to do so;
`git tag | wc -l` → **8**. Trap 1b bit mildly and harmlessly: a `git diff --stat`
run from `packages/core` printed workspace-relative paths and read as one
changed file where the tree had three.

## The open set is 25 — and 12 are cloud-takeable

`roadmap_scope.py` reports **25 open / 43 closed**, OPEN slices
`[15, 112, 249, 273, 294, 296, 297, 298, 300, 304, 305, 306, 307, 309, 310]`.
Net from the last hand-off's 24: **−1 closed (`292.9`) +2 filed (`310.1`,
`310.2`)**. **The raw counts reconcile exactly**: `grep -c` reads 25 open /
**45** closed, and 45 = 43 attributed + the 2 `[x]` under the non-slice
`## STATE` heading.

- **cloud-takeable: 12** — `294.1`, `294.2`, `298.1`, `300.2`, `304.1`,
  `305.1`, `305.2`, `306.1`, `307.1`, `309.5`, `310.1`, `310.2`. (`297.1` is
  takeable here too but is counted once, under input-blocked, because that is
  what actually gates it.) **`294.1`/`294.2` have now gone seven hand-offs
  classified from Slice 294's triage text rather than from their own bodies** —
  said plainly; `294.2` says the brand mark inside it is an owner call, so read
  it before dispatching. **`305.1` carries a caveat, from its own Accept**: the
  four defects close by re-measuring ink extents and inter-block gaps, which is
  geometry and squarely in `ENVIRONMENT.md`'s *can* list — but it sits inside a
  Gauntlet whose scoring wants a blind critic, so a wake without one closes the
  measurement half and must say so rather than claiming the round. **`309.5`
  and `310.2` are the cheapest**: `309.5` is a script plus a start command,
  needs no browser image, and its Accept lets *refusing to commit a probe*
  close it; `310.2` closes by deleting five unused consts, and deleting them is
  a satisfying outcome its Accept names.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3`, `112.4`, `249.7`, `249.10`, `249.11`, `249.12`, `249.13`, `273.2`,
  `296.3`.
- **browser-blocked in the SCREENSHOT sense** (a LOCAL wake can take these):
  `249.6`, `249.9`. **`249.6` was declined at the clause level four times. Do
  not re-derive it.**
- **input-blocked (1): `297.1`** — the **fourth kind** `LOOPS.md` 186.2's three
  do not cover. It stays open because both filed issues came from the owner's
  own agent, so the router was never tested.

12 + 10 + 2 + 1 = 25, asserted rather than left to the reader, and reconciled
against `grep -nE '^\s*[0-9]+\. \[ \]' ROADMAP.md` rather than against this
list — the 25 ids it prints are exactly the ones named above.

## No archive sweep — but the reason the last two hand-offs gave has EXPIRED

Measured on the **committed** tree (`roadmap_scope.py`, run after the slice
commit): **5,818 lines**, closed-history share **26.0%** (1,510 lines across 6
closed slices). The standing trigger the hand-offs carry is *"past 5,450 lines /
40.6%"*.

Trend across nineteen readings: 27.5% → 32.0% → 34.2% → 38.0% → 39.4% → 37.5% →
36.9% → 36.2% → 35.5% → 37.3% → 36.9% → 38.3% → 37.6% → 9.4% → 10.3% → 10.9% →
11.8% → **26.0%**.

**The jump is not growth — it is Slice 292 closing.** Its last open item was
`292.9`, built this wake, so the whole slice became eligible at once: 664 lines
of closed history became 1,510. The previous two hand-offs declined a sweep on
the ground that *"only 664 lines of closed history exist to move"*, and that
sentence is now false. **No sweep was run this wake anyway**, for a different
and narrower reason: `roadmap_scope.py` reports Slice 292 as **NAMED by two
still-open items** (`310.1`, `310.2`, both filed this wake), and 236.2 says a
sweep must read what an open item names before moving it. That reading is a
judgement the next wake should make deliberately, not a step to skip — the
other five targets (308, 303, 302, 301, 283) are unaffected, and 283 is named
by `273.2`.

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were
read** (issues **1** open, already triaged; discussions **0** open).

**Three things want the owner's attention:**

1. **A gate went green while the defect it was written for was still on two
   built pages**, and only the rendered-artefact check found it. The loop's
   red-proof doctrine is strong and it held here — three injections, each red on
   exactly its own case. What it does not cover is a detector whose *scope* is
   wrong: every injection landed where the scan already looked. The cheap
   general lesson, and the one worth carrying: **when a gate asserts an ABSENCE,
   check the artefact once by hand before believing the pass.** It cost one
   grep and caught a real site.

2. **`249.12` — the archival trigger — now has its clearest reading yet**, and
   in the opposite direction from the last two wakes: the line half is past
   (5,818), the share half has jumped to 26.0% on one slice closing, and the
   material a sweep would move is partly pinned by 236.2. A policy question
   about how much a wake should read, not a measurement a sweep can take.

3. **`273.2` is the owner call still worth their attention**, a twenty-eighth
   wake untouched — whether a Polish round whose score does not move should
   increment `dry`. Not touched this wake; rule 6 was never reached.
