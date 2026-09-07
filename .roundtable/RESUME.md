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
two additional refusals). The work landed as **`8beee329`** (Slice 304.1),
followed by this hand-off's own commit. Read `git log 8beee329~1..` for the
exact set.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

**That third command's output now names the tree it read** — this wake's own
item. A clean run prints `at HEAD <sha>`, so every figure quoted below is
reproducible without trusting this file.

## This hand-off reports what it measured; it does NOT predict the next dispatch

Counters read **after** recording this wake's row, which is the comparison
`LOOPS.md` mandates:

```
Standardize   4 / 4 Continue rounds        since 2026-09-06 22:53   OVERDUE
Objective     1 / 3 slices          [304]  since 2026-09-07 03:02   ok
Optimize      STALE  (1 wake-date newer)
```

**Rule 2 crossed on this wake's own row and is now OVERDUE at 4/4** — a
`Continue` row is exactly what that counter counts, and it sat at 3/4 at Step
0b. Rule 3 moved 0 → 1, armed by Slice 304. Reported, not acted on: rule 2 sits
above rule 4, so the next wake evaluating Step 2 top-to-bottom reaches it before
any build item. That agrees with what was written by hand, which is the
comparison that has found two of the five parser recurrences.

**Rule 5 is reported as *could not be evaluated*, never clear.** No metric was
recorded this wake. `306.1` explains why a cloud wake cannot drive that line to
`ok` by recording more; do not try. `bundle-gz-kb` still cannot be sampled
(`259.1`, carried forward, not re-run).

**`polish_requeue.py` did NOT run this wake** in any mode — `LOOPS.md` §3b step
0 is owed only once rule 6 is reached, and rule 4 matched first. No stamp
reading from this wake exists to quote.

Of the three advisory checks, only `check:resume-slice-ids` printed. It named
`312.2`, `300.2`, `298.1`, `315.2`, `317.1`, `319.1`, `319.2` and `304.1` as
closed — **every one is a historical reference in this hand-off or the previous
one, none is claimed open**, which is the distinction the check says outright it
cannot make. The charter check and `--verify-stamps` were silent.

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
Step 1 committed nothing. The red-proof ENVIRONMENT.md §8 says is still owed
remains owed — nothing has ever been filed in this repo's Discussions.

**Issue #2 is still open on GitHub and still unanswered by any wake**, now
across four wakes. See Direction.

## What landed this wake

**Slice 304.1**, dispatched by **rule 4** — the oldest still-open item that is
not owner-, browser- or input-blocked. Rules 1-3 did not match (no open P0;
Standardize at 3/4 at Step 0b; Objective at 0/3).

**The Accept demanded the base rate BEFORE building, and named refusing as a
satisfying outcome. It refused the refusal.** Of the **11** published
full-ratio figures (`N / M = P%`) across `ROADMAP.md`, `ROADMAP-archive.md` and
this file, **7 reproduce at the PARENT of the commit carrying them and 4 at the
commit itself**; only **3 of the 11** name a revision anywhere in their
surrounding text. The 7 are the ordinary case — run at dispatch on a clean tree,
then write the slice and commit — but they print **identically** to a mid-edit
reading, which is precisely what makes them unquotable. Slice 301's post-move
`4,676 / 335 / 7.2%` is the other kind, and reproduces at **neither**
`384e6a8b` (which reads 4,738 / 396 / 8.4%) nor its parent.

So the header now always names the tree: `--rev X` → `at X`; a clean default run
→ `at HEAD <sha>`, the quotable form all 7 were entitled to; a run over modified
sources says outright that no revision carries the figure. **Scoped to the
script's two inputs**, not the whole repo — this wake's own tree exercised that
branch, with `roadmap_scope.py` modified and the header correctly reading `at
HEAD 9e08040e`.

**Two candidate instruments were built, measured and REFUSED**, both recorded
with `--also-refused` and named in the script's header so a later wake does not
rebuild them: attributing a bare `P%` with `git log -S'9.5%'` collides with the
tail of `+79.5%`; and an `N lines` match cannot tell the denominator from the
numerator (`2,493 lines across 13 closed slices`), from a subset (`673 lines are
the four targets`), or from the trigger threshold (`past 5,450 lines`).

**The live red-proof found a bug the self-test had certified.** Appending a line
to `ROADMAP.md` correctly flipped the header to `UNCOMMITTED WORKING TREE` — and
printed the filename as **`OADMAP.md`**. `git()` strips the whole of stdout,
de-indenting the *first* porcelain line only, so ` M ROADMAP.md` arrives as `M
ROADMAP.md` and a `line[3:]` slice eats one character too many. Case G's
original fixture fed an **unstripped** single line — the one shape the real
caller never produces. The fixture now feeds the stripped form `git()` actually
returns and discriminates: restoring `line[3:]` turns G red naming `OADMAP.md`.
**CLAUDE.md's rule one level up — a green red-proof is a defect in the
injection.**

**Gates green on the committed tree:** all **17** cloud-runnable entry points,
re-derived from `ci.yml` rather than read off a list (the two documented set
differences still hold), plus the §3b re-run of `docs:build` after this file was
written.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots — a cloud
wake has no Podman. **None is owed for this slice**: `roadmap_scope.py` is a
hand-run reporting script with **no machine consumers** (`grep -rn roadmap_scope`
over `*.py *.mjs *.js *.json *.yml` finds only its own header and a docstring
mention in `_common.py`), and no rendered artefact changed.
**The visual debts carried forward are unchanged and unspent**: `292.4/292.5`'s
screenshot lane on `/components/icon`, now eleven wakes back; the
withdrawn-claim paragraph on `/components/data-table`; Slice 319's new
paragraph on `/patterns/kanban` at 390px, together with that page's two table
rows from Slice 317. **A local wake should glance at all four.**

## `origin/main` did NOT move under this wake

`git fetch origin main` at Step 0 and again immediately before the first commit,
as Step 0c mandates: `9e08040e` both times. No collision.

**Step 0 traps:** trap 1 bit again (detached HEAD, `git branch --show-current`
empty), fixed with `git checkout -B main origin/main` before any commit, and
`origin/main` again arrived as a **forced update** (`26447ba...9e08040`). Trap 2
clean in one `--unshallow` (**1,996** commits, no `shallow.lock`), and it again
brought the tags — the **thirty-second** consecutive container to do so;
`git tag | wc -l` → **8**. Trap 1c did not bite. No `git stash` was used.

## The open set is 25 — no P0, and 11 are cloud-takeable

`roadmap_scope.py` reports **25 open / 56 closed at `8beee329`**, OPEN slices
`[15, 112, 249, 273, 294, 296, 297, 305, 306, 307, 309, 310, 314, 315, 316,
319]`. Net from the last hand-off's 26: **`304.1` closed**, nothing filed.
**The raw counts reconcile exactly**: `grep -c` reads 25 open / **58** closed,
and 58 = 56 attributed + the 2 `[x]` under the non-slice `## STATE` heading.

- **cloud-takeable: 11** — `305.1`, `305.2`, `306.1`, `307.1`, `309.5`,
  `310.1`, `310.2`, `314.2`, `315.3`, `316.1`, `319.3`. (`297.1` is takeable
  here too but is counted once, under input-blocked, because that is what
  actually gates it.) **`305.1` is now the oldest of these** — `304.1` was, and
  this wake took it. **`305.1` carries a caveat, from its own Accept**: the four
  defects close by re-measuring ink extents and inter-block gaps, which is
  geometry and squarely in `ENVIRONMENT.md`'s *can* list — but it sits inside a
  Gauntlet whose scoring wants a blind critic, so a wake without one closes the
  measurement half and must say so rather than claiming the round. **`309.5`,
  `310.2`, `314.2`, `315.3`, `316.1` and `319.3` are the cheapest**: `309.5` is
  a script plus a start command and its Accept lets *refusing to commit a probe*
  close it; `310.2` closes by deleting five unused consts; `314.2` is filed with
  its base rates already measured; `315.3` and `316.1` each name refusal as a
  satisfying outcome and carry their own base-rate commands; `319.3` does the
  same, and its two counts are one `grep -rl` and one read of
  `check-target-size.mjs`'s `PAGES`.
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

11 + 10 + 2 + 2 = 25, asserted rather than left to the reader, and reconciled
against `grep -nE '^\s*[0-9]+\. \[ \]' ROADMAP.md`. (The owner-blocked bullet
names 11 ids; `294.2` is one of them and is counted under input-blocked, so the
arithmetic uses 10.)

## No archive sweep — declined on the SHARE half, ninth wake running

Measured at **`8beee329`**, which the new header names rather than leaving to be
inferred: **7,232 lines**, closed-history share **36.4%** (2,635 lines across 14
closed slices). The standing trigger the hand-offs carry is *"past 5,450 lines /
40.6%"*: the line half is past, the share half is not — the same judgement the
last eight wakes made, at 30.5%, 29.5%, 28.9%, 31.2%, 35.3%, 34.7% and now this.

**It went UP this wake, by the mechanism the last hand-off named.** 34.7% →
36.4% with nothing archived: closing `304.1` moved Slice 304's body from the
OPEN side of the ratio to the closed side. The attribution is exact rather than
inferred — the slice's body measures **142** lines at `8beee329` (94 at its
parent, plus this slice's 48-line net edit) and the carried total moved
2,493 → 2,635, **+142 to the line** — so the numerator grew while the
denominator grew by only the 48. That is the third rise against three falls, all
from
ordinary work — **the trigger's share half is moved in both directions by the
loop simply doing its job**, which is the argument `249.12` needs and which no
amount of waiting resolves.

Trend across twenty-seven readings: 27.5% → 32.0% → 34.2% → 38.0% → 39.4% →
37.5% → 36.9% → 36.2% → 35.5% → 37.3% → 36.9% → 38.3% → 37.6% → 9.4% → 10.3% →
10.9% → 11.8% → 26.0% → 26.9% → 30.5% → 29.5% → 28.9% → 31.2% → 35.3% → 34.7%
→ **36.4%**.

**What a sweep would take, so the next wake need not re-derive it:**
`roadmap_scope.py` reports the pins itself — **8 targets are named by a
still-open item** now, unchanged in count from last wake. That leaves **318,
317, 313, 311, 308, 304, 303, 302, 301** and **300** — a bulk edit, and
CLAUDE.md's rule says it is verified against the rendered artefact one slice at
a time. It is a wake's work, not a tail-end tidy.

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were
read** (issues **1** open, discussions **0** open).

**Four things want the owner's attention, and the first has now been open across
four wakes:**

1. **Issue #2 has an answer and nobody has told the reporter.** Slice 317
   refuses the component with the measurement; Slice 319 corrected a second
   false claim on the same page the reporter was pointing at, which strengthens
   their report rather than weakening it. **Replying and closing the issue is a
   thirty-second owner action**, and `LOOPS.md` Step 1 says an issue "gets
   closed with a comment linking the fixing commit once its item ships".
   Whether a *wake* should post that comment is `297.1`, still open.
2. **`249.12` — the archival trigger — is the same owner call as the last eight
   wakes.** The share half has now moved **down three times and up three times**
   with nothing ever archived, from ordinary work in both directions. Nothing
   states whether the trigger is an AND or an OR. A wake declining a sweep on
   that ambiguity nine times is the signal that the trigger needs deciding, not
   that the sweep needs doing.
3. **`294.2` still cannot be advanced by anyone but the owner.** The six
   proposals it ranks live in an owner-supplied zip that never reached the repo.
   **Landing `upstream-contribution/` on a branch is a one-command unblock.**
   Unchanged from the last hand-off, not re-measured here.
4. **`273.2` is still worth their attention**, a thirty-second call untouched —
   whether a Polish round whose score does not move should increment `dry`. Not
   touched this wake; rule 6 was never reached.
