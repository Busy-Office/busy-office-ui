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
at hand-off. **One iteration recorded**: `Objective · grill` (outcome `landed`,
one additional refusal). The work landed as **`6e5724bb`** (Slice 319), followed
by this hand-off's own commit and a correction to the grill report — **the count
is deliberately not stated**, because a commit total written inside a commit is
wrong the moment a follow-up lands, which is this wake's own Finding A pointing
at the hand-off. Read `git log 6e5724bb~1..` instead.

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
Standardize   3 / 4 Continue rounds          since 2026-09-06 22:53   ok
Objective     0 / 3 slices                   since 2026-09-07 03:02   ok   ← reset by this wake
Optimize      STALE  (1 wake-date newer)
```

**Rule 3 fired this wake and is now at zero**, which is the expected reading for
an `Objective` row: it resets its own counter. Rule 2 did **not** move — an
`Objective` row is not a Continue round — so `Standardize` sits at 3/4 with one
Continue round to go, which is the nearest counter to firing. That agrees with
what was written by hand, which is the comparison that has found two of the five
parser recurrences.

**Rule 5 is reported as *could not be evaluated*, never clear.** No metric was
recorded this wake. `306.1` explains why a cloud wake cannot drive that line to
`ok` by recording more; do not try. `bundle-gz-kb` still cannot be sampled
(`259.1`, carried forward, not re-run).

**`polish_requeue.py` did NOT run this wake** in any mode — `LOOPS.md` §3b step
0 is owed only once rule 6 is reached, and rule 3 matched first. No stamp
reading from this wake exists to quote.

Of the three advisory checks, only `check:resume-slice-ids` printed. It named
`312.2`, `300.2`, `298.1`, `315.2` and `317.1` as closed — **every one is a
historical reference in the previous hand-off, none was claimed open**, which is
the distinction the check says outright it cannot make. The charter check and
`--verify-stamps` were silent.

## The standing environment fact: CI HAS NO `paths-ignore`

`312.2` removed it entirely. **A push that touches only `.roundtable/**` runs
the full suite.** The consequence a wake feels directly is `ENVIRONMENT.md` §3b
— *re-run `npm run docs:build` after writing this file, before pushing* — and it
was executed this wake, after this file was written, before the push.

## CHECK CI AFTER PUSHING — the habit the last wake started, kept

`main` was **green** at the start of this wake: run **809** (`d6a6f607`, the
previous hand-off commit) passed. Read the runs after your push; one
`actions/runs?branch=main` read costs nothing and is the only thing standing
between a red `main` and the next wake. The last wake found `main` red for an
hour exactly because the wake before it did not look.

## Step 1 — both intakes read, with the controls ENVIRONMENT.md §8 names

`gh` is still absent and the Discussions GraphQL route still refused, so the
REST substitute was used, with both controls in the same run:

```
/discussions        -> HTTP 200, len 0     the reading
/not-a-real-route   -> HTTP 404            an unserved route does NOT answer 200 []
/issues?state=open  -> HTTP 200, len 1     #2, triaged as 300.2, which Slice 317 closed
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so
Step 1 committed nothing. The red-proof ENVIRONMENT.md §8 says is still owed
remains owed — nothing has ever been filed in this repo's Discussions.

**Issue #2 is still open on GitHub and still unanswered by any wake.** Slice 317
is the answer and Slice 319 hardened one of its own corrections; nobody has told
the reporter. See Direction.

## What landed this wake

**Slice 319**, dispatched by **rule 3** (`Objective 3 / 3 … OVERDUE
[298, 300, 318]`). Rules 1-2 did not match; rules 4-8 were not reached.

**Scope check first, per `LOOPS.md` §6 step 0**, because a slice re-arms after
each grill: 298 and 300 are armed by the **builds** of `298.1` and `300.2`
(Slices 316 and 317), not by material an earlier grill covered — Slice 304
grilled 300's P0 half, which is different work — and 318 is named by no grill.
Nothing was dropped.

**25 of 27 re-run assertions reproduce exactly** (10/10 on Slice 316, 9/10 on
317, 6/7 on 318). Slice 316 carries **no
defect**: the 6-file image enumeration, the single `screenshot(` renderer, the
25-day gap, the 274-byte favicon, DESIGN.md rule 7, all three contrast ratios
recomputed from the token hexes (7.56 / 2.54 / 7.46 on white), and the
`@media print` base rate re-derived with an **independent** brace-matching
parser — same **11 literal / 0 token across 6 files**, per-file counts included.

**Two defects, and both are in what shipped BESIDE the number the slice was
about** — 192.1's shape, for the fourth recorded time:

1. **Slice 318's "the 99 other fixed waits" is 98.** The slice removed one real
   `setTimeout` wait and its own comment then names `setTimeout(400)`, so a raw
   grep reads **99 before and 99 after** — an identical value across two inputs
   that must differ. Two independent instruments agree on 98. Amended in place
   at the end of Slice 318 with both commands. The conclusion is unchanged; the
   audit trail was not.
2. **`/patterns/kanban`'s audited sentence made THREE runtime claims and Slice
   317 measured one.** It removed the false middle claim (the announcement) and
   re-published the other two unmeasured. Measured here: the keyboard path
   **holds** (Enter opens the popover, Tab lands on a menu item; the control run
   drives nothing and reports closed), and the glove target **does not** — every
   per-card trigger is `bo-btn--sm` at **60x24**, at 1440px and 390px, against a
   scale measured on the same build (`bo-btn` = 28/36/44 across the three
   densities, reproducing `/concepts/density`). `bo-btn--sm` reads **24 at
   `spacious` too**, because `--bo-btn-height` is a fixed `1.5rem`, so no
   density setting reaches the glove tier.

`319.1` corrects the clause in prose, naming the **tier** rather than a bare
pixel count so it stays true if the scale moves. `319.2` makes the keyboard
claim executable — a second `check:claims` case driven with real key events,
**red-proved twice, once per half**, each injection turning exactly **1 of 170**
red while the sibling mouse-driven case stays green. `319.3` is filed, not
built.

**One refusal beside the item, recorded with `--also-refused`:** adding
`/patterns/kanban` to `check:target-size`'s 7-page sweep. The menu items measure
**0x0** while the popover is closed, which is the state a sweep finds them in,
so the gate could not see the claim it would exist to check. Base rate measured
and filed as `319.3` instead (18 vocabulary pages / 7 swept / 4 overlap).

**Gates green on the committed tree:** all **17** cloud-runnable entry points,
re-derived from `ci.yml` rather than read off a list (the two documented set
differences still hold), plus the §3b re-run of `docs:build` after this file was
written.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots — a cloud
wake has no Podman. `319.1` adds one `<p>`, two `<kbd>`, three `<code>` and one
link inside an existing `<section>`. Verified against the **rendered artefact**
rather than the diff: `check:layout`, `check:scroll` and `test:axe` sweep the
page at both widths and are green, which asserts *no overflow, nothing
unreachable, no axe violation*, not that it looks right. **A local wake should
glance at `/patterns/kanban` at 390px**, where the new paragraph is the only
plausible place for a wrap to look wrong — and the same page's two table rows
from Slice 317 are still unlooked-at.
**`292.4/292.5`'s screenshot lane on `/components/icon` remains unspent**, now
ten wakes back, and the withdrawn-claim paragraph on `/components/data-table` is
still unlooked-at.

**Not re-measured, said rather than left silent:** Slice 318's *"42-70ms across
6 runs"* headroom figure is a property of the container that took it. Re-running
it here would produce a different number in a different container and could not
falsify the original, so it is carried, not confirmed.

## `origin/main` did NOT move under this wake

`git fetch origin main` at Step 0 and again immediately before the first commit,
as Step 0c mandates: `d6a6f607` both times. No collision.

**Step 0 traps:** trap 1 bit again (detached HEAD, `git branch --show-current`
empty), fixed with `git checkout -B main origin/main` before any commit, and
`origin/main` again arrived as a **forced update** (`26447ba...d6a6f60`). Trap 2
clean in one `--unshallow` (**1,991** commits, no `shallow.lock`), and it again
brought the tags — the **thirty-first** consecutive container to do so;
`git tag | wc -l` → **8**. Trap 1c did not bite. No `git stash` was used.

## The open set is 26 — no P0, and 12 are cloud-takeable

`roadmap_scope.py` reports **26 open / 55 closed**, OPEN slices
`[15, 112, 249, 273, 294, 296, 297, 304, 305, 306, 307, 309, 310, 314, 315,
316, 319]`. Net from the last hand-off's 25: **319.3 filed and left open**;
`319.1` and `319.2` were filed and closed in their own slice. **The raw counts
reconcile exactly**: `grep -c` reads 26 open / **57** closed, and 57 = 55
attributed + the 2 `[x]` under the non-slice `## STATE` heading.

- **cloud-takeable: 12** — `304.1`, `305.1`, `305.2`, `306.1`, `307.1`,
  `309.5`, `310.1`, `310.2`, `314.2`, `315.3`, `316.1`, **`319.3`**. (`297.1`
  is takeable here too but is counted once, under input-blocked, because that
  is what actually gates it.) **`304.1` is still the oldest of these.**
  **`305.1` carries a caveat, from its own Accept**: the four defects close by
  re-measuring ink extents and inter-block gaps, which is geometry and squarely
  in `ENVIRONMENT.md`'s *can* list — but it sits inside a Gauntlet whose scoring
  wants a blind critic, so a wake without one closes the measurement half and
  must say so rather than claiming the round. **`309.5`, `310.2`, `314.2`,
  `315.3`, `316.1` and `319.3` are the cheapest**: `309.5` is a script plus a
  start command and its Accept lets *refusing to commit a probe* close it;
  `310.2` closes by deleting five unused consts; `314.2` is filed with its base
  rates already measured; `315.3` and `316.1` each name refusal as a satisfying
  outcome and carry their own base-rate commands; `319.3` does the same, and its
  two counts are one `grep -rl` and one read of `check-target-size.mjs`'s
  `PAGES`.
  **Everything in this bullet below the count is carried from the previous
  hand-off, not re-derived this wake** — only the OPEN set itself was
  re-measured.
- **owner-blocked (11):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3`, `112.4`, `249.7`, `249.10`, `249.11`, `249.12`, `249.13`, `273.2`,
  `296.3`, and **`294.2`'s brand-mark half** — but `294.2` is counted below,
  under input-blocked, because the folder's absence gates it first.
- **browser-blocked in the SCREENSHOT sense** (a LOCAL wake can take these):
  `249.6`, `249.9`. **`249.6` was declined at the clause level four times. Do not
  re-derive it.**
- **input-blocked (2): `297.1` and `294.2`** — the **fourth kind** `LOOPS.md`
  186.2's three do not cover. `297.1` stays open because both filed issues came
  from the owner's own agent, so the router was never tested. **`294.2`** needs
  the owner to land the `upstream-contribution/` folder on a branch before any
  wake can rank the six proposals.

12 + 10 + 2 + 2 = 26, asserted rather than left to the reader, and reconciled
against `grep -nE '^\s*[0-9]+\. \[ \]' ROADMAP.md`. (The owner-blocked bullet
names 11 ids; `294.2` is one of them and is counted under input-blocked, so the
arithmetic uses 10.)

## No archive sweep — declined on the SHARE half, eighth wake running

Measured on the working tree after Slice 319 was written (`roadmap_scope.py`):
**7,181 lines**, closed-history share **34.7%** (2,493 lines across 13 closed
slices). The standing trigger the hand-offs carry is *"past 5,450 lines /
40.6%"*: the line half is past, the share half is not — the same judgement the
last seven wakes made, at 30.5%, 29.5%, 28.9%, 31.2%, 35.3% and now this.

**It went DOWN this wake, and the mechanism is the mirror image of last
wake's.** 35.3% → 34.7% with nothing archived: Slice 319 added ~194 lines to the
OPEN side of the ratio, so the denominator grew while the numerator barely
moved. Two consecutive rises caused by slices closing, now a fall caused by a
slice opening — **the trigger's share half is moved by the loop's ordinary work
in both directions**, which is the argument `249.12` needs and which no amount of
waiting resolves.

Trend across twenty-six readings: 27.5% → 32.0% → 34.2% → 38.0% → 39.4% →
37.5% → 36.9% → 36.2% → 35.5% → 37.3% → 36.9% → 38.3% → 37.6% → 9.4% → 10.3% →
10.9% → 11.8% → 26.0% → 26.9% → 30.5% → 29.5% → 28.9% → 31.2% → 35.3% →
**34.7%**.

**What a sweep would take, so the next wake need not re-derive it:**
`roadmap_scope.py` reports the pins itself — **8 targets are named by a
still-open item** now, one more than last wake because `319` names `318` and
`317`. That leaves **313, 311, 308, 303, 302, 301** and **300** — a bulk edit,
and CLAUDE.md's rule says it is verified against the rendered artefact one slice
at a time. It is a wake's work, not a tail-end tidy.

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were
read** (issues **1** open, discussions **0** open).

**Four things want the owner's attention, and the first has now been open across
three wakes:**

1. **Issue #2 has an answer and nobody has told the reporter.** Slice 317
   refuses the component with the measurement; Slice 319 has since corrected a
   second false claim on the same page the reporter was pointing at, which
   strengthens their report rather than weakening it — they found one real
   defect by reasoning from an absence, and the page turned out to carry two.
   **Replying and closing the issue is a thirty-second owner action**, and
   `LOOPS.md` Step 1 says an issue "gets closed with a comment linking the
   fixing commit once its item ships". Whether a *wake* should post that comment
   is `297.1`, still open.
2. **`249.12` — the archival trigger — is the same owner call as the last seven
   wakes, and this wake completes the demonstration.** The share half has now
   moved **down three times** and **up twice** with nothing ever archived, and
   this wake shows both directions in consecutive readings from ordinary work
   (a slice closing raises it, a slice opening lowers it). Nothing states whether
   the trigger is an AND or an OR. A wake declining a sweep on that ambiguity
   eight times is the signal that the trigger needs deciding, not that the sweep
   needs doing.
3. **`294.2` still cannot be advanced by anyone but the owner.** The six
   proposals it ranks live in an owner-supplied zip that never reached the repo.
   **Landing `upstream-contribution/` on a branch is a one-command unblock.**
   Unchanged from the last hand-off, not re-measured here.
4. **`273.2` is still worth their attention**, a thirty-second call untouched —
   whether a Polish round whose score does not move should increment `dry`. Not
   touched this wake; rule 6 was never reached.
