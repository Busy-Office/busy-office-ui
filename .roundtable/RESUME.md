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
at hand-off. **One iteration recorded**: `Standardize · sweep` (outcome
`landed`, four additional refusals). The work landed as **`7dacd80b`** (Slice
320), followed by this hand-off's own commit. Read `git log 7dacd80b~1..` for
the exact set.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

That third command's header names the tree it read (roadmap 304.1), so every
figure below is reproducible without trusting this file. All of them were taken
`--rev 7dacd80b`, the slice commit, **not** the working tree and **not** `HEAD`
— `ENVIRONMENT.md`'s figure rule, which two consecutive wakes broke from the
`HEAD` side.

## This hand-off reports what it measured; it does NOT predict the next dispatch

Counters read **after** recording this wake's row, which is the comparison
`LOOPS.md` mandates:

```
Standardize   0 / 4 Continue rounds        since 2026-09-07 05:14   ok
Objective     2 / 3 slices     [304, 320]  since 2026-09-07 03:02   ok
Optimize      STALE  (1 wake-date newer)
```

**Rule 2 fired this wake and is now reset to 0/4.** Rule 3 moved 1 → 2, and
that move is the mandated hand-check landing: a `Standardize` row closes a
slice (279.4's amendment), this wake closed one, and the counter agrees with
what was written by hand. That comparison has now found two of the five parser
recurrences; it agreed this time, which is the outcome that makes it worth
running rather than the one that makes it interesting.

**Rule 5 is reported as *could not be evaluated*, never clear.** No metric was
recorded this wake. `306.1` explains why a cloud wake cannot drive that line to
`ok` by recording more; do not try. `bundle-gz-kb` still cannot be sampled
(`259.1`, carried forward, not re-run).

**`polish_requeue.py` did NOT run this wake** in any mode — `LOOPS.md` §3b step
0 is owed only once rule 6 is reached, and rule 2 matched first. No stamp
reading from this wake exists to quote.

Of the three advisory checks, only `check:resume-slice-ids` printed. Re-run
against **this file as it now stands**, per the header's own instruction, it
names **10** closed ids — `312.2`, `300.2`, `298.1`, `315.2`, `317.1`, `319.1`,
`319.2`, `304.1`, `314.2`, `320.1` — plus `259.1`, archived. **Every one is a
historical reference, none is claimed open**, which is the distinction the check
says outright it cannot make. The charter check and `--verify-stamps` were
silent.

**Two of those ten are named ONLY by this paragraph, which is a shape worth
knowing before the next wake re-reads them.** `298.1` and `315.2` appear
nowhere else in this file — they are here because the previous hand-off's
version of this sentence listed them and it was carried forward, so the report
is partly a report on itself. The check cannot see that either. **Write this
paragraph from the run, not from the last one**, or the list ratchets: every id
it ever names stays named forever.

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
/issues?state=open  -> HTTP 200, len 1     #2, triaged as 300.2, which Slice 317 closed
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so
Step 1 committed nothing. The red-proof `ENVIRONMENT.md` §8 says is still owed
remains owed — nothing has ever been filed in this repo's Discussions.

**Issue #2 is still open on GitHub and still unanswered by any wake**, now
across five wakes. See Direction.

## What landed this wake

**Slice 320**, dispatched by **rule 2** — `Standardize 4 / 4 … OVERDUE`. Rule 1
found no open P0; rule 3 was at 1/3 and sits below rule 2.

**All four lanes ran. The finding came from lane 1, and it is a consolidation
that stopped at a directory boundary.** `Gallery.astro`'s `is:global` block
carries `.docs-list` and `.docs-list-bare`, created by the Standardize sweep of
2026-08-17 to replace an inline `padding-inline-start: 1.25rem` repeated 37
times across 27 pages and a `list-style: none; padding: 0` repeated 14 times.
All 51 copies are gone from `pages/`. **The last two survived in
`ApiTable.astro` and `Related.astro`** — the shared components that render INTO
those pages, and the same scope gap Slice 314 found for `font-size`, one
property over. Both now use the class.

**`314.2` is closed here**, because the sweep reached its sites from lane 1
rather than from the item: four literals converted, two refused with the reason,
and `--bo-space-0` decided on evidence — never, since
`grep -rn -- '--bo-space-0\b'` outside its own definition returns **0**.

**A second class of one-off, which nothing had a name for**: a knob set to
exactly the value its consuming rule already falls back to
(`--bo-cluster-gap: var(--bo-space-2)` on `.bo-cluster`, whose own fallback is
that token). Base rate before acting, per 94.11: **6 of 47 inline
custom-property declarations (12.8%)** — neither 0% nor 100%. After: **0 of
41**.

**The instrument defect is the part worth carrying forward.** `scan:dead-style`
printed *"1,433 live inline **declaration(s)**"* for its whole life while
`live += 1` fires once per **element** carrying `[style]`. Measured on one page
set: **1,272 attributes holding 1,677 declarations**, a **24.2%** under-report,
and that noun has been quoted as a declaration count in five consecutive sweep
write-ups (214, 284, 290, 301, 314). **The unit is also a detection gap**,
red-proved by running the probe's own logic over three injected elements:
`margin: 40px` live, `margin: 0` DEAD, and `margin: 40px; padding: 0` **live** —
the hidden `padding: 0` being the case the script's own header calls canonical.
**273 of 1,272 attributes (21.5%)** are in that blind spot. `320.1` fixed the
label and prints both figures; `320.2` files the detection fix, deliberately not
built, because it moves a headline number five write-ups have quoted.

**What actually caught the unit defect was a disagreement, not a review.** The
re-scan read `1,433 -> 1,272`, a drop of **161**; the hand-derived prediction
said **392**. The instrument was right and its label was wrong, and the honest
prediction — 116 Related renders + 40 ApiTable renders + 5 page-level sites =
**161**, exact — reconciles only in the element unit.

**Gates green on the committed tree:** all **17** cloud-runnable entry points,
re-derived from `ci.yml` rather than read off a list (the two documented set
differences still hold), plus the §3b re-run of `docs:build` after this file was
written.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots — a cloud
wake has no Podman. What IS claimed is that nothing rendered changed, over
**12,593** elements' computed values on eight pages, with three red-proofs
discriminating that no-op from a dead edit (forcing the two classes moves 38
elements in the before tree and **107** in the after; the two token overrides
move 60 and exactly 3). The claim is structural — every converted value is
byte-equal to the literal it replaces.
**The visual debts carried forward are unchanged and unspent**: `292.4/292.5`'s
screenshot lane on `/components/icon`, now twelve wakes back; the
withdrawn-claim paragraph on `/components/data-table`; Slice 319's paragraph on
`/patterns/kanban` at 390px with that page's two table rows from Slice 317; and
**new this wake, `320.3`** — `ApiTable.astro:57`'s `0.5rem` against
`ClassRef.astro:44`'s `.4rem`, one idiom with two spellings, 1.6px apart and
invisible in a diff. **A local wake should glance at all five.**

## `origin/main` did NOT move under this wake

`git fetch origin main` at Step 0 and again immediately before the first commit,
as Step 0c mandates: `e3de6560` both times. No collision.

**Step 0 traps:** trap 1 bit again (detached HEAD, `git branch --show-current`
empty), fixed with `git checkout -B main origin/main` before any commit, and
`origin/main` again arrived as a **forced update** (`26447ba...e3de656`). Trap 2
clean in one `--unshallow` (**1,998** commits, no `shallow.lock`), and it again
brought the tags — the **thirty-third** consecutive container to do so;
`git tag | wc -l` → **8**. Trap 1c did not bite. No `git stash` was used for a
measurement; one WAS used to rebuild the before-tree for the red-proof, and it
was popped and verified (8 files restored) before anything was committed.

## The open set is 26 — no P0, and 11 are cloud-takeable

`roadmap_scope.py --rev 7dacd80b` reports **26 open / 58 closed**, OPEN slices
`[15, 112, 249, 273, 294, 296, 297, 305, 306, 307, 309, 310, 315, 316, 319,
320]`. Net from the last hand-off's 25: **`314.2` closed, `320.2` and `320.3`
filed**. **The raw counts reconcile exactly**: `grep -c` reads 26 open / **60**
closed, and 60 = 58 attributed + the 2 `[x]` under the non-slice `## STATE`
heading.

- **cloud-takeable: 11** — `305.1`, `305.2`, `306.1`, `307.1`, `309.5`,
  `310.1`, `310.2`, `315.3`, `316.1`, `319.3`, `320.2`. (`297.1` is takeable
  here too but is counted once, under input-blocked, because that is what
  actually gates it.) **`305.1` is still the oldest of these**, unchanged from
  the last hand-off — this wake was dispatched by rule 2, so it did not consume
  a rule-4 item. **`305.1` carries a caveat, from its own Accept**: the four
  defects close by re-measuring ink extents and inter-block gaps, which is
  geometry and squarely in `ENVIRONMENT.md`'s *can* list — but it sits inside a
  Gauntlet whose scoring wants a blind critic, so a wake without one closes the
  measurement half and must say so rather than claiming the round. **`309.5`,
  `310.2`, `315.3`, `316.1`, `319.3` and now `320.2` are the cheapest**:
  `309.5` is a script plus a start command and its Accept lets *refusing to
  commit a probe* close it; `310.2` closes by deleting five unused consts;
  `315.3` and `316.1` each name refusal as a satisfying outcome and carry their
  own base-rate commands; `319.3`'s two counts are one `grep -rl` and one read
  of `check-target-size.mjs`'s `PAGES`; and **`320.2` is filed with its base
  rate, its red-proof and its self-test gap already measured**, so the round is
  the fix rather than the investigation.
  **Everything in this bullet below the count is carried from the previous
  hand-off except the `320.2` clauses**, which are this wake's; only the OPEN
  set itself was re-measured.
- **owner-blocked (11):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3`, `112.4`, `249.7`, `249.10`, `249.11`, `249.12`, `249.13`, `273.2`,
  `296.3`, and **`294.2`'s brand-mark half** — but `294.2` is counted below,
  under input-blocked, because the folder's absence gates it first.
- **browser-blocked in the SCREENSHOT sense** (a LOCAL wake can take these):
  `249.6`, `249.9`, and **`320.3`, new this wake**. **`249.6` was declined at
  the clause level four times. Do not re-derive it.**
- **input-blocked (2): `297.1` and `294.2`** — the **fourth kind** `LOOPS.md`
  186.2's three do not cover. `297.1` stays open because both filed issues came
  from the owner's own agent, so the router was never tested. **`294.2`** needs
  the owner to land the `upstream-contribution/` folder on a branch before any
  wake can rank the six proposals.

11 + 10 + 3 + 2 = 26, asserted rather than left to the reader, and reconciled
against `grep -nE '^\s*[0-9]+\. \[ \]' ROADMAP.md`. (The owner-blocked bullet
names 11 ids; `294.2` is one of them and is counted under input-blocked, so the
arithmetic uses 10.)

## No archive sweep — declined on the SHARE half, tenth wake running

Measured at **`7dacd80b`**: **7,442 lines**, closed-history share **38.1%**
(2,839 lines across 15 closed slices). The standing trigger the hand-offs carry
is *"past 5,450 lines / 40.6%"*: the line half is past, the share half is not —
the same judgement the last nine wakes made, at 30.5%, 29.5%, 28.9%, 31.2%,
35.3%, 34.7%, 36.4% and now this.

**It went UP again, by the same mechanism the last two hand-offs named, and the
attribution is exact rather than inferred.** Closing `314.2` moved Slice 314's
body from the OPEN side of the ratio to the closed side. Numerator
2,635 → 2,839 = **+204**, against a Slice 314 body of **205** lines measured
heading-to-heading — the one-line gap being the heading itself, which the
scope script's body definition excludes. Denominator 7,232 → 7,442 = **+210** =
Slice 320's own 196-line body plus the 14-line `DONE` block appended to `314.2`.
Both sides reconcile to the line. That is the fourth rise against three falls,
all from ordinary work — **the trigger's share half is moved in both directions
by the loop simply doing its job**, which is the argument `249.12` needs and
which no amount of waiting resolves.

Trend across twenty-eight readings: 27.5% → 32.0% → 34.2% → 38.0% → 39.4% →
37.5% → 36.9% → 36.2% → 35.5% → 37.3% → 36.9% → 38.3% → 37.6% → 9.4% → 10.3% →
10.9% → 11.8% → 26.0% → 26.9% → 30.5% → 29.5% → 28.9% → 31.2% → 35.3% → 34.7%
→ 36.4% → **38.1%**.

**What a sweep would take, so the next wake need not re-derive it:**
`roadmap_scope.py` reports the pins itself — **7 targets are named by a
still-open item** now, down one from last wake because `314.2` closed. That
leaves **318, 317, 314, 313, 311, 308, 304, 303, 302, 301** and **300** — a bulk
edit, and CLAUDE.md's rule says it is verified against the rendered artefact one
slice at a time. It is a wake's work, not a tail-end tidy.

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were
read** (issues **1** open, discussions **0** open).

**Four things want the owner's attention, and the first has now been open across
five wakes:**

1. **Issue #2 has an answer and nobody has told the reporter.** Slice 317
   refuses the component with the measurement; Slice 319 corrected a second
   false claim on the same page the reporter was pointing at, which strengthens
   their report rather than weakening it. **Replying and closing the issue is a
   thirty-second owner action**, and `LOOPS.md` Step 1 says an issue "gets
   closed with a comment linking the fixing commit once its item ships".
   Whether a *wake* should post that comment is `297.1`, still open.
2. **`249.12` — the archival trigger — is the same owner call as the last nine
   wakes.** The share half has now moved **down three times and up four times**
   with nothing ever archived, from ordinary work in both directions, and this
   wake's move is attributed to the line. Nothing states whether the trigger is
   an AND or an OR. A wake declining a sweep on that ambiguity ten times is the
   signal that the trigger needs deciding, not that the sweep needs doing.
3. **`294.2` still cannot be advanced by anyone but the owner.** The six
   proposals it ranks live in an owner-supplied zip that never reached the repo.
   **Landing `upstream-contribution/` on a branch is a one-command unblock.**
   Unchanged from the last hand-off, not re-measured here.
4. **`273.2` is still worth their attention**, a thirty-second call untouched —
   whether a Polish round whose score does not move should increment `dry`. Not
   touched this wake; rule 6 was never reached.
