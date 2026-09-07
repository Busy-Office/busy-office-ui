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
two additional refusals). The work landed as **`cbd8419d`** (Slice 321),
followed by this hand-off's own commit. Read `git log cbd8419d~1..` for the
exact set.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

Every figure below was taken `--rev cbd8419d`, the slice commit — **not** the
working tree and **not** `HEAD`, which is `ENVIRONMENT.md`'s figure rule and
the one two consecutive wakes broke from the `HEAD` side.

## This hand-off reports what it measured; it does NOT predict the next dispatch

Counters read **after** recording this wake's row, which is the comparison
`LOOPS.md` mandates:

```
Standardize   1 / 4 Continue rounds        since 2026-09-07 05:14   ok
Objective     3 / 3 slices  [304, 305, 320] since 2026-09-07 03:02  OVERDUE
Optimize      STALE  (1 wake-date newer)
```

**Rule 3 crossed on this wake's own row and now reads OVERDUE.** The mandated
hand-check lands with one thing worth naming: the counter attributes the
closure to **305**, not 321, because the row's `--item` text leads with
`305.1`. Both slices genuinely closed items this wake, so the *count* is right
and the *attribution* is the row's own wording, not a parser fault. This is the
fifth-recurrence shape the file warns about arriving in a benign form — worth
one line so a later wake reading `[304, 305, 320]` does not go hunting for a
Slice 321 that the counter simply did not name.

**Rule 5 is reported as *could not be evaluated*, never clear.** No metric was
recorded this wake. `306.1` explains why a cloud wake cannot drive that line to
`ok` by recording more; do not try. `bundle-gz-kb` still cannot be sampled
(`259.1`, carried forward, not re-run).

**`polish_requeue.py` did NOT run this wake** in any mode — `LOOPS.md` §3b step
0 is owed only once rule 6 is reached, and rule 4 matched first. No stamp
reading from this wake exists to quote.

Of the three advisory checks, only `check:resume-slice-ids` printed. **Re-run
against this file as it now stands**, per the header's own instruction. It
names **9** closed ids — `305.1`, `305.2`, `320.1`, `304.1`, `298.1`, `315.2`,
`312.2`, `300.2`, `321.1` — plus `259.1`, archived. **Every one is a historical
reference; none is claimed open**, which is the distinction the check says
outright it cannot make.

**The prediction written here before the run was 6, and how it was wrong is the
part worth keeping.** Two errors in opposite directions. It listed `320.2` and
`320.3`, which are OPEN and which the check therefore correctly does not
report — a reminder that this check names *closed* ids, not every id. And it
missed four, because the draft tried to execute the previous hand-off's
anti-ratchet warning by writing a sentence saying those four were *not* being
carried forward — **and that sentence named them in backticks, which is what
the check reads.** Announcing that an id is dropped keeps it named. The
warning's own remedy, applied literally, re-created the state it warns about.
So the remedy is to say nothing about ids that are gone: they are gone, and an
empty space is the only spelling of that this instrument can read. The charter
check (14 rules) and `--verify-stamps` were silent.

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

**Issue #2 carries the owner's own triage comment** (2026-09-06, linking
`300.2`) and is still open. See Direction.

## What landed this wake

**Slice 321**, dispatched by **rule 4**. Rule 1 found no open P0; rule 2 was at
`0 / 4`; rule 3 at `2 / 3`. The oldest still-open item no other rule blocked was
**`305.1`**, and working it killed its own premise.

**The artifact three fresh blind critics graded across three rounds is in no
commit, on any branch.** `305.1` asked a later wake to close four defects *"by
re-measuring the ink extents and inter-block gaps the round-3 critic named"* —
geometry, in `ENVIRONMENT.md`'s *can* list, which is exactly why it sat two
hand-offs at the head of the cloud-takeable queue. It is takeable by nobody:

```
git log --all --oneline -- '*gauntlet-a*'            # (empty)
git show --stat 8d07a9ed                             # 4 files, all markdown
grep -rn 'gauntlet-a' --exclude-dir=node_modules .   # 1 hit: the round-1 cell
```

It lived in the building session's scratchpad and went with it. The 4px stack
offset, the 61→66px and 47→53px ink extents and the 126×36 button are
**unreproducible**. This is a fifth kind of blocked — **artifact-lost** — and it
mis-sorted as browser-blocked for two hand-offs.

**The base rate said ship a clause, not a gate, and the first instrument was
wrong.** A probe over path citations in open items said **10 of 12** resolve to
nothing — the tidy-number tell. It read the slice-id pair `292.4/292.5` as a
path and demanded repo-relative *fragments* resolve from the root. Corrected to
suffix-match against `git ls-files`, red-proved on three controls with known
answers: **2 of 10** unresolvable, both legitimate — a git-ignored build output
(`310.2`) and a file an item proposes to create (`249.7`). So **0 of 24 open
items cite a lost artifact**, and the probe cannot see this one at all, because
`305.1`'s body names no path. A gate over "cited paths resolve" would be red on
a healthy tree (94.11) and would not have caught it anyway.

**`305.2` closed as refused on its own stated test, with the real gap fixed
instead.** 1 of 12 recorded findings across three rounds is one a repo gate
would have caught, and round 1 is the only round — its own "one instance is not
a pattern" condition. The reason is structural rather than an accident of three
rounds: the gates validate what IS present; a Class A recreation fails on what
is ABSENT, and no gate can demand a class you did not use. Second, independent
ground: §7 step 1 already reads *"the repo's gates green"*, so the defect was
compliance and a second copy of an instruction is not a fix. **This
classification is of recorded text, not a live gate run** — the artifact is
gone, so no gate can be run against it now, and that is said rather than
implied.

**`321.1` is the whole build:** §7 step 0 requires a committed path under
`.roundtable/gauntlet/`; step 3 requires the `ROUNDS.md` artifact cell to carry
it; `ROUNDS.md` gains an **appended** correction section with its three rows
left exactly as written, per its own never-rewritten rule. **The edit is in the
Playbooks region, not the dispatch region lane 4 tracks** (274.1) — everything a
dispatcher reads to DECIDE is above `## Playbooks` and is untouched.

**Gates green on the committed tree:** all **17** cloud-runnable entry points,
re-derived from `ci.yml` rather than read off a list (`check:ci-ignores` is in
`ci.yml` and covered by `check:repo` inside `docs:build`; `npm run test -w
@busy-office/ui` is here and spelled `npx vitest run --root packages/core`
there — the two documented set differences still hold), plus the §3b re-run of
`docs:build` after this file was written.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots — a cloud
wake has no Podman. Nothing rendered changed and no claim rests on rendering:
the diff is **three markdown files**, no CSS, no `.astro`, no script.
**The visual debts carried forward are unchanged and unspent**: `292.4/292.5`'s
screenshot lane on `/components/icon`, now thirteen wakes back; the
withdrawn-claim paragraph on `/components/data-table`; Slice 319's paragraph on
`/patterns/kanban` at 390px; and `320.3`'s `ApiTable.astro` `0.5rem` against
`ClassRef.astro` `.4rem`. **A local wake should glance at all four** — the fifth
in the last hand-off's list was `305.1`, which is closed here and is no longer a
visual debt at all.

## `origin/main` did NOT move under this wake

`git fetch origin main` at Step 0 and again immediately before the first commit,
as Step 0c mandates: `84f6ae2b` both times. No collision.

**Step 0 traps:** trap 1 bit again (detached HEAD, `git branch --show-current`
empty), fixed with `git checkout -B main origin/main` before any commit, and
`origin/main` again arrived as a **forced update** (`26447ba...84f6ae2`). Trap 2
clean in one `--unshallow` (**2,000** commits, no `shallow.lock`), and it again
brought the tags — the **thirty-fourth** consecutive container to do so;
`git tag | wc -l` → **8**. Trap 1c did not bite. No `git stash` was used at any
point this wake.

## The open set is 24 — no P0, and 9 are cloud-takeable

`roadmap_scope.py --rev cbd8419d` reports **24 open / 61 closed**, OPEN slices
`[15, 112, 249, 273, 294, 296, 297, 306, 307, 309, 310, 315, 316, 319, 320]`.
Net from the last hand-off's 26: **`305.1` and `305.2` closed, nothing filed
open** — `321.1` landed closed. **The raw counts reconcile exactly**: `grep -c`
reads 24 open / **63** closed, and 63 = 61 attributed + the 2 `[x]` under the
non-slice `## STATE` heading. **Slice 305 leaves the OPEN set entirely.**

- **cloud-takeable: 9** — `306.1`, `307.1`, `309.5`, `310.1`, `310.2`,
  `315.3`, `316.1`, `319.3`, `320.2`. (`297.1` is takeable here too but is
  counted once, under input-blocked, because that is what actually gates it.)
  **`306.1` is now the oldest of these**, having inherited the head of the queue
  from `305.1`. **`309.5`, `310.2`, `315.3`, `316.1`, `319.3` and `320.2` are
  the cheapest**: `309.5` is a script plus a start command and its Accept lets
  *refusing to commit a probe* close it; `310.2` closes by deleting five unused
  consts; `315.3` and `316.1` each name refusal as a satisfying outcome and
  carry their own base-rate commands; `319.3`'s two counts are one `grep -rl`
  and one read of `check-target-size.mjs`'s `PAGES`; and `320.2` is filed with
  its base rate, its red-proof and its self-test gap already measured, so the
  round is the fix rather than the investigation. **Everything in this bullet
  below the count is carried from the previous hand-off**; only the OPEN set,
  the count and the new head of queue were re-measured.
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

9 + 10 + 3 + 2 = 24, asserted rather than left to the reader, and reconciled
against `grep -nE '^\s*[0-9]+\. \[ \]' ROADMAP.md`. (The owner-blocked bullet
names 11 ids; `294.2` is one of them and is counted under input-blocked, so the
arithmetic uses 10.)

**A fifth kind of blocked now has a name — `artifact-lost`** — and it is worth
carrying because it *mis-sorts as one of the other four*. `305.1` read as
browser-blocked-but-cloud-takeable for two hand-offs on a premise nobody had
checked. `LOOPS.md` rule 4's three kinds plus input-blocked do not cover *"the
thing the item measures is not in the tree"*, and the tell is cheap: an item
whose Accept says **re-measure** names an artifact, and the artifact either
resolves or it does not.

## No archive sweep — declined on the SHARE half, eleventh wake running

Measured at **`cbd8419d`**: **7,584 lines**, closed-history share **40.3%**
(3,057 lines across 17 closed slices). The standing trigger the hand-offs carry
is *"past 5,450 lines / 40.6%"*: the line half is past, the share half is
**0.3 points short** — the closest it has ever come without crossing, and the
same judgement the last ten wakes made, at 29.5%, 28.9%, 31.2%, 35.3%, 34.7%,
36.4%, 38.1% and now this.

**It went UP again by the mechanism the last three hand-offs named, and the
attribution is exact rather than inferred.** Closing `305.1`/`305.2` moved Slice
305's whole body from the OPEN side of the ratio to the closed side. Numerator
2,839 → 3,057 = **+218** = Slice 305's post-edit body (**100**) plus Slice 321's
own body (**118**). Denominator 7,442 → 7,584 = **+142** = Slice 321's heading
and body (**119**) plus the **23** lines the two DONE blocks added to Slice 305.
Both sides reconcile to the line. That is the fifth rise against three falls,
all from ordinary work — **the trigger's share half is moved in both directions
by the loop simply doing its job**, which is the argument `249.12` needs and
which no amount of waiting resolves. **The next wake that closes an open item in
a large slice will cross 40.6% without anything being wrong**, which is the
sharpest form that argument has taken.

Trend across twenty-nine readings: 27.5% → 32.0% → 34.2% → 38.0% → 39.4% →
37.5% → 36.9% → 36.2% → 35.5% → 37.3% → 36.9% → 38.3% → 37.6% → 9.4% → 10.3% →
10.9% → 11.8% → 26.0% → 26.9% → 30.5% → 29.5% → 28.9% → 31.2% → 35.3% → 34.7%
→ 36.4% → 38.1% → **40.3%**.

**What a sweep would take, so the next wake need not re-derive it:**
`roadmap_scope.py` reports the pins itself — **7 targets are named by a
still-open item**. That leaves **321, 318, 317, 314, 313, 311, 308, 305, 304,
303, 302, 301** and **300** — a bulk edit, and CLAUDE.md's rule says it is
verified against the rendered artefact one slice at a time. It is a wake's work,
not a tail-end tidy.

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were
read** (issues **1** open, discussions **0** open).

**Four things want the owner's attention, and the second is now one wake from
answering itself:**

1. **Issue #2 is open and carries only the triage comment.** Slice 317 refuses
   the component with the measurement; Slice 319 corrected a second false claim
   on the same page the reporter was pointing at, which strengthens their report
   rather than weakening it. **Replying and closing the issue is a thirty-second
   owner action**, and `LOOPS.md` Step 1 says an issue "gets closed with a
   comment linking the fixing commit once its item ships". Whether a *wake*
   should post that comment is `297.1`, still open.
2. **`249.12` — the archival trigger — is the same owner call as the last ten
   wakes, and it is about to stop being hypothetical.** The share half sits at
   **40.3%** against a 40.6% trigger, having moved down three times and up five
   times with nothing ever archived, from ordinary work in both directions.
   Nothing states whether the trigger is an AND or an OR. **A wake that closes
   one item in a large slice crosses it**, and there is no recorded answer for
   what a wake should then do.
3. **`294.2` still cannot be advanced by anyone but the owner.** The six
   proposals it ranks live in an owner-supplied zip that never reached the repo.
   **Landing `upstream-contribution/` on a branch is a one-command unblock.**
   Unchanged from the last hand-off, not re-measured here.
4. **`273.2` is still worth their attention**, a thirty-second call untouched —
   whether a Polish round whose score does not move should increment `dry`. Not
   touched this wake; rule 6 was never reached.
