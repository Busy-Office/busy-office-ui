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
at hand-off. Three commits this wake: `292.8`, Slice 306 (triage), and this
hand-off. Two iterations recorded — `Continue · build` and `Roadmap · triage` —
carrying two refusals.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ THE PREVIOUS HAND-OFF WAS STALE ON ARRIVAL — the local dispatcher landed two slices without rewriting it

It predicted *"rule 3 is OVERDUE — expect an Objective grill of 292, 300, 301"*.
That grill had already run as **Slice 304** (of 300, 301, 303) before this wake
started, and **Slice 305** had landed too, so the Objective counter read `0 / 3`
at Step 0b. Nothing was lost — Step 0b is the instrument and it was read before
Step 2, which is exactly what `LOOPS.md` says to do — but **do not dispatch from
this file's prediction; dispatch from `dispatch_status.py`.**

Counters read after recording this wake's rows, which is the comparison
`LOOPS.md` mandates:

```
Standardize   3 / 4 Continue rounds   since 2026-09-06 23:20   ok
Objective     1 / 3 slice             since 2026-09-07 00:21   ok  [292]
Optimize      1 wake-date(s) newer    since 2026-09-06 16:56   STALE
```

**Rule 5 is reported as *could not be evaluated*, never clear — but its number
means something new this wake, and Slice 306 is that finding.** Two metrics
were recorded (`axe-violations` 0, `claims` 169, both read off gates run on the
pushed tree), which moved the line **4 wake-dates → 1**. The residual 1 is a
clock artefact, not a missing measurement: the newest metric reads
`2026-09-06 16:56` and the newest log rows read `2026-09-07 00:21/00:35` — the
same moment from UTC and from `+0800`. **A cloud wake cannot drive that line to
`ok` by recording more metrics**, so do not try; read `306.1`.

`bundle-gz-kb` still cannot be sampled (259.1's finding, carried forward, not
re-run this wake).

**`polish_requeue.py` did NOT run this wake** in any mode — `LOOPS.md` §3b step
0 is owed only once rule 6 is reached, and rule 4 matched first. No stamp
reading from this wake exists to quote.

## Step 1 — both intakes read, with the controls ENVIRONMENT.md §8 names

`gh` is still absent and the Discussions GraphQL route still refused, so the
REST substitute was used, with both controls in the same run:

```
/discussions        -> HTTP 200, len 0     the reading
/not-a-real-route   -> HTTP 404            an unserved route does NOT answer 200 []
/issues?state=open  -> HTTP 200, len 1     #2, already triaged as 300.2
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input.** The
red-proof ENVIRONMENT.md §8 says is still owed remains owed — nothing has ever
been filed in this repo's Discussions.

## What landed this wake

**`292.8`** (rule 4, Continue/build — the oldest cloud-takeable open item) and
**Slice 306** (triage, above).

`292.8`'s premise re-ran true before anything was built on it: the same command
still returns **1 of 41** component pages. Four sites now read
`var(--bo-font-size-xl)`, which is `1.5rem` exactly — three on
`components/icon.astro`, plus `base/motion.astro`'s spinner glyph, taken because
leaving it would have made the recorded property untrue of the tree while
claiming it of the page. The icon page's three "Sizes" literals stay: there the
absolute size is the demonstration, and an Astro comment at the site says so.

**The no-op was red-proved against being a dead edit**, which is the part worth
carrying. A computed-`font-size` map of every element on both built pages read
identically before and after (**1,565 + 1,337 elements, 0 differences**) — and
that alone proves nothing, because it is also what an edit that never landed
produces. The same probe re-read each page with `--bo-font-size-xl` overridden
to `3.25rem`: **before, 0 elements moved on either page; after, 31 on icon and 1
on motion**, exactly the four edited sites and their inheriting descendants,
every one `24px → 52px`.

**No gate, on three measured grounds** (the full text is in the item): base rate
41 of 41; a text-grep predicate is unsound, since **2 of the 4 tree-wide source
hits carry no style attribute at all in the built page** (a prose mention of
`html { font-size: 62.5% }` inside `<code>`, and a copyable `@page` print sample
using `9pt`); and the one real remaining site sizes a launcher icon at `2rem`,
which no token equals.

The probe is in the scratchpad, not the repo — deliberately, since the item
refuses a gate over this property.

**Gates green on the pushed tree, re-run AFTER the rebase onto Slice 305, not
only before it:** core `build`, `test`, `lint:css`, `docs:build` (`check:repo`
incl. `slice-refs` **895**, `page-shape` **127** pages, `wrong-choice` **156**,
`dsa-scores` **362**), `check:claims` (**169** live), `check:formatting`,
`check:scroll` (**914**), `check:layout` (**127**), `check:forced-colors`,
`test:axe` (**127 x 2**), `check:target-size`, `check:search`, `check:pseudo`,
`check:quickstart`, `check:po-app`, `check -w @busy-office/create-ui`,
`npm run suite`. The *"3 NOT VERIFIED"* in `check:claims` is `ENVIRONMENT.md` 6b
(this container reports `(pointer: fine) = false`), not a regression.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots — a cloud
wake has no Podman. What that would add is *"does it look right"*; what is
claimed instead is that **nothing changed**, asserted over 2,902 elements'
computed font-size plus `check:layout` and `test:axe` across all 127 pages.
**292.4/292.5's screenshot lane on `/components/icon` remains unspent**, and
this wake touched that page — a local wake's glance now closes both cheaply.

## `origin/main` moved ONCE under this wake — and it was not a collision

Caught by the `git fetch origin main` Step 0c mandates before a commit:

```
11503760..8d07a9ed   Slice 305: 296.1 — the Gauntlet ran its budget and FAILED
```

**No item and no number collision** — Slice 305 touches `.roundtable/gauntlet/`,
`ROADMAP.md`, `STATUS.md` and the loop log, and nothing it changed is `292.8`.
Rebased clean, and the full gate set re-run on the combined tree.

**Step 0 traps:** trap 1 bit again (detached HEAD, `git branch --show-current`
empty), fixed with `git checkout -B main origin/main` before any commit, and
`origin/main` again arrived as a **forced update** (`26447ba...1150376`).
Trap 2 clean in one `--unshallow` (**1,964** commits, no `shallow.lock`), and it
again brought the tags — the **twenty-first** consecutive container to do so;
`git tag | wc -l` → **8**. Trap 1c did not bite.

## The open set is 23 — and 10 are cloud-takeable

`roadmap_scope.py` reports **23 open / 34 closed**, OPEN slices
`[15, 112, 249, 273, 292, 294, 296, 297, 298, 300, 304, 305, 306]`. Net from the
last hand-off's 21: `−292.8` (closed here), `−296.1` (closed by Slice 305),
`+304.1`, `+305.1`, `+305.2` (landed by the other dispatcher), `+306.1` (opened
here). `check-resume-slice-ids` reports a different closed count — it also counts
the 2 `[x]` items under the non-slice `## STATE` heading. **Do not quote a bare
closed count.**

- **cloud-takeable: 10** — `292.9`, `294.1`, `294.2`, `296.2`, `298.1`,
  `300.2`, `304.1`, `305.1`, `305.2`, `306.1`. (`297.1` is takeable here too but
  is counted once, under input-blocked below, because that is what actually
  gates it.) **`294.1`/`294.2` have now gone four hand-offs classified from Slice
  294's triage text rather than from their own bodies** — said plainly; `294.2`
  says the brand mark inside it is an owner call, so read it before dispatching.
  **`304.1`, `305.2` and `306.1` are classified from their own Accept this
  wake**: each is a script, a log and a markdown file, no rendered image.
  **`305.1` carries a caveat, also from its own Accept**: the four defects are
  to be closed by *re-measuring ink extents and inter-block gaps*, which is
  geometry and squarely in `ENVIRONMENT.md`'s *can* list — but it sits inside a
  Gauntlet whose scoring wants a blind critic, so a wake without one closes the
  measurement half and must say so rather than claiming the round.
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
  — this hand-off did not, for the second time, because rule 4 had an older item.

10 + 10 + 2 + 1 = 23, asserted rather than left to the reader, and reconciled
against `grep -nE '^\s*[0-9]+\. \[ \]' ROADMAP.md` rather than against this
list — the 23 ids it prints are exactly the ones named above.

Rule 4's oldest cloud-takeable item next wake is **`292.9`** — the four docs
pages handing a reader a deprecated glyph, one of them inside a copy-paste
block. Its own Accept already says which judgements it needs and that the mask
box is `1em` either way, so no geometry moves.

## No archive sweep — and for the second reading, neither half of the trigger is past

Measured on the **committed** tree (`roadmap_scope.py`, run after the triage
commit): **5,238 lines**, closed-history share **10.3%**. The standing trigger
the hand-offs carry is *"past 5,450 lines / 40.6%"* — both still under it, since
Slice 301 ran the eleventh sweep.

Trend across sixteen readings: 25.4% → 27.5% → 32.0% → 34.2% → 38.0% → 39.4% → 37.5% →
36.9% → 36.2% → 35.5% → 37.3% → 36.9% → 38.3% → 37.6% → 9.4% → **10.3%**.

The line count is the half worth watching now: **4,878 → 5,238 in one day**, all
of it new slices rather than regrowth of closed ones. The share is doing what it
should after a sweep; the length is not, and the two disagreeing is the state
`249.12` exists to be decided about.

No sweep run.

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were
read** (issues **1** open, already triaged; discussions **0** open).

**Three things want the owner's attention:**

1. **A hand-off predicted the next dispatch and was wrong within hours, because
   the other dispatcher landed two slices without rewriting it.** No work was
   lost — the counter script is the instrument and it was read first — but this
   is the second distinct way this file has misled a wake (169.3 was the first).
   Worth their eye as a shape: **a hand-off may report what it measured; it may
   not predict what the next wake will dispatch.** Not proposed as a rule here,
   deliberately.

2. **`306.1` is new and is the rule-5 story finally having a cause.** Several
   hand-offs reported rule 5 STALE and read it as "nobody records metrics".
   Recording two this wake moved it most of the way and then stopped on a clock
   difference between the two dispatchers. `LOOPS.md` 164.2 already refused the
   obvious repairs (`%z` on rows, backfilling), so this needs a decision rather
   than a patch.

3. **`273.2` is the owner call still worth their attention**, a twenty-fifth
   wake untouched — whether a Polish round whose score does not move should
   increment `dry`. Not touched this wake; rule 6 was never reached.
