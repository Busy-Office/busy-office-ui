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
two additional refusals). The work landed as **`ccb7d3ce`** (Slice 322),
followed by this hand-off's own commit. Read `git log ccb7d3ce~1..` for the
exact set.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

Every figure below was taken `--rev ccb7d3ce`, the slice commit — **not** the
working tree and **not** `HEAD`, which is `ENVIRONMENT.md`'s figure rule and the
one two consecutive wakes broke from the `HEAD` side.

## This hand-off reports what it measured; it does NOT predict the next dispatch

Counters read **after** recording this wake's row, which is the comparison
`LOOPS.md` mandates:

```
Standardize   1 / 4 Continue rounds     since 2026-09-07 05:14   ok
Objective     0 / 3 slices              since 2026-09-07 06:57   ok
Optimize      STALE  (1 wake-date newer)
```

**Rule 3 fired on this wake and its counter reset to `0 / 3`**, which is the
expected behaviour — an Objective row resets it. The mandated hand-check turns
up nothing anomalous this time: the reset is attributable to this wake's own row
and to nothing else.

**Rule 5 is reported as *could not be evaluated*, never clear.** No metric was
recorded this wake. `306.1` explains why a cloud wake cannot drive that line to
`ok` by recording more; do not try. `bundle-gz-kb` still cannot be sampled
(`259.1`, carried forward, not re-run).

**`polish_requeue.py` did NOT run this wake** in any mode — `LOOPS.md` §3b step
0 is owed only once rule 6 is reached, and rule 3 matched first. No stamp
reading from this wake exists to quote.

Of the three advisory checks, only `check:resume-slice-ids` printed, and it ran
against the **previous** revision of this file. **Re-run it against this file as
it now stands**, per the header's own instruction. The previous hand-off's note
still applies and is the one thing worth carrying: **saying that an id is being
dropped keeps it named**, because the check reads backticked ids and cannot tell
a historical reference from a live claim. The remedy is silence, not an
announcement. The charter check and `--verify-stamps` were silent.

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

**Issue #2 carries the owner's own triage comment** (2026-09-06) and is still
open. See Direction.

## What landed this wake

**Slice 322**, an Objective grill of **304, 305, 320**, dispatched by **rule 3**
at `3 / 3 OVERDUE`. Rule 1 found no open P0; rule 2 was at `1 / 4`. §6 step 0's
narrowing check found no prior grill naming any of the three, so the armed set
was taken **whole**.

**26 of 29 re-run assertions reproduce. Two fail, and one is not adjudicable.
Both failures are a COUNT published beside a fix that was red-proved
correctly** — CLAUDE.md's 192.1 landing twice in one armed set.

- **Slice 320's blast radius is 17, not five.** It published the wrong-noun
  quote as *"five consecutive sweep write-ups"*; whitespace-normalised and
  attributed to the containing slice heading, **17 slices** quote it at the
  value 1,433 and **all 17 are Standardize sweeps**, with ten of them between
  the two the list names — so *consecutive* is false as well as low. The
  corrected statement is stronger: **no sweep has ever quoted it correctly.**
  **This grill's own first scan was line-based and made the identical mistake**,
  returning 16 and missing exactly the one slice whose phrase wraps a newline.
  That is the mechanism, not a lapse, and it is why `322.3` is filed.
- **Slice 304's base rate cannot be re-run.** Its `11 / 7 / 4` split carries no
  command — the exact omission it diagnoses in Slice 301 two paragraphs earlier
  — and an independent re-derivation from its stated form gives corpus **10**,
  split **8 parent / 0 commit / 2 neither**. This shows the figure cannot be
  checked, **not** that it is wrong, and the conclusion it supports is untouched
  and if anything strengthened. Marked NOT REPRODUCIBLE in place rather than
  replaced.

Both corrected in place per 236.2 with the originals struck and the commands
recorded. `322.3` is filed **open**: should a phrase-count over the roadmap
files be whitespace-normalised by default? Its Accept says measure the base rate
first and names **refusing with the number as a satisfying outcome**; a gate is
refused in the item itself, because *"this count was taken correctly"* is not a
checkable shape.

**Four of this grill's own instruments were wrong on their first output** and
are recorded in the report rather than tidied away. One was a hair from
publishing a fabricated defect against a correct claim of 320's: a
`grep -rl 'ApiTable[^>]*notes='` cannot span lines and reported 5 where the
built DOM says 40.

**Gates green on the committed tree:** all **17** cloud-runnable entry points,
re-derived from `ci.yml` rather than read off a list (the two documented set
differences still hold — `check:ci-ignores` is covered by `check:repo` inside
`docs:build`, and `npm run test -w @busy-office/ui` is CI's `npx vitest run
--root packages/core`), plus the §3b re-run of `docs:build` after this file was
written.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots — a cloud
wake has no Podman. Nothing rendered changed and no claim rests on rendering:
the diff is **three markdown files**, no CSS, no `.astro`, no script.
**The visual debts carried forward are unchanged and unspent**: `292.4/292.5`'s
screenshot lane on `/components/icon`, now fourteen wakes back; the
withdrawn-claim paragraph on `/components/data-table`; Slice 319's paragraph on
`/patterns/kanban` at 390px; and `320.3`'s `ApiTable.astro` `0.5rem` against
`ClassRef.astro` `.4rem` — whose premise this wake re-confirmed by grep and
still cannot judge, because judging it is the rendered comparison itself. **A
local wake should glance at all four.**

## `origin/main` did NOT move under this wake

`git fetch origin main` at Step 0 and again immediately before the first commit,
as Step 0c mandates: `203f0a64` both times. No collision.

**Step 0 traps:** trap 1 bit again (detached HEAD, `git branch --show-current`
empty), fixed with `git checkout -B main origin/main` before any commit, and
`origin/main` again arrived as a **forced update** (`26447ba...203f0a6`). Trap 2
clean in one `--unshallow` (**2,002** commits, no `shallow.lock`), and it again
brought the tags — the **thirty-fifth** consecutive container to do so;
`git tag | wc -l` → **8**. Trap 1c did not bite. No `git stash` was used at any
point this wake.

## The open set is 25 — no P0, and 10 are cloud-takeable

`roadmap_scope.py --rev ccb7d3ce` reports **25 open / 63 closed**, OPEN slices
`[15, 112, 249, 273, 294, 296, 297, 306, 307, 309, 310, 315, 316, 319, 320,
322]`. Net from the last hand-off's 24: **`322.3` filed open, nothing closed**
— `322.1` and `322.2` landed closed. The raw counts reconcile exactly:
`grep -c` reads 25 open / **65** closed, and 65 = 63 attributed + the 2 `[x]`
under the non-slice `## STATE` heading.

- **cloud-takeable: 10** — `306.1`, `307.1`, `309.5`, `310.1`, `310.2`,
  `315.3`, `316.1`, `319.3`, `320.2`, `322.3`. (`297.1` is takeable here too but
  is counted once, under input-blocked, because that is what actually gates it.)
  **`306.1` remains the oldest of these.** The cheapest are unchanged from the
  last hand-off — `309.5`, `310.2`, `315.3`, `316.1`, `319.3`, `320.2` — and
  **`322.3` joins them**: its Accept is a base-rate measurement over
  re-derivable phrase-counts, it names refusing as a satisfying outcome, and it
  already refuses the gate, so the round is the measurement rather than the
  design. **Everything in this bullet below the count except the `322.3`
  sentence is carried from the previous hand-off**; only the OPEN set, the count
  and the new entry were re-measured.
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

10 + 10 + 3 + 2 = 25, asserted rather than left to the reader, and reconciled
against `grep -nE '^\s*[0-9]+\. \[ \]' ROADMAP.md`. (The owner-blocked bullet
names 11 ids; `294.2` is one of them and is counted under input-blocked, so the
arithmetic uses 10.)

**The fifth kind of blocked, `artifact-lost`, is still worth carrying** — an
item whose Accept says *re-measure* names an artifact, and the artifact either
resolves or it does not. It mis-sorts as one of the other four; it did so for
two hand-offs before Slice 321 caught it. Nothing in the current open set is of
that kind, checked rather than assumed.

## No archive sweep — declined on the SHARE half, twelfth wake running

Measured at **`ccb7d3ce`**: **7,861 lines**, closed-history share **39.4%**
(3,096 lines across 17 closed slices). The standing trigger the hand-offs carry
is *"past 5,450 lines / 40.6%"*: the line half is past, the share half is
**1.2 points short**. Same judgement as the last eleven wakes.

**It went DOWN this wake, and the attribution is exact rather than inferred.**
Numerator 3,057 → 3,096 = **+39**, entirely the correction block written into
Slice **304**, which is closed and so lands on both sides. Denominator 7,584 →
7,861 = **+277** = that same 39, plus Slice **322**'s own body (**208**) and the
correction block written into Slice **320** (**30**) — both of which are OPEN
slices and so land only in the denominator. `39 + 208 + 30 = 277`, and
`3,057 + 39 = 3,096`; both sides reconcile to the line.

That is the fourth fall against five rises, all from ordinary work, and it is
the same argument `249.12` needs: **a wake that corrects an open slice pushes
the share down, and a wake that closes an item in a large slice pushes it up.**
Nothing is wrong in either direction, and no amount of waiting resolves it.

Trend across thirty readings: 27.5% → 32.0% → 34.2% → 38.0% → 39.4% → 37.5% →
36.9% → 36.2% → 35.5% → 37.3% → 36.9% → 38.3% → 37.6% → 9.4% → 10.3% → 10.9% →
11.8% → 26.0% → 26.9% → 30.5% → 29.5% → 28.9% → 31.2% → 35.3% → 34.7% → 36.4%
→ 38.1% → 40.3% → **39.4%**.

**What a sweep would take, so the next wake need not re-derive it:**
`roadmap_scope.py` reports the pins itself — **8 targets are named by a
still-open item** at this commit, up one from the last hand-off's 7 because
`322`'s own text names an archive-bound slice. Read that line before moving
anything. It is a wake's work, not a tail-end tidy.

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were
read** (issues **1** open, discussions **0** open).

**Four things want the owner's attention, unchanged in substance from the last
hand-off:**

1. **Issue #2 is open and carries only the triage comment.** Slice 317 refuses
   the component with the measurement; Slice 319 corrected a second false claim
   on the same page the reporter was pointing at, which strengthens their report
   rather than weakening it. **Replying and closing the issue is a thirty-second
   owner action**, and `LOOPS.md` Step 1 says an issue "gets closed with a
   comment linking the fixing commit once its item ships". Whether a *wake*
   should post that comment is `297.1`, still open.
2. **`249.12` — the archival trigger — is the same owner call as the last eleven
   wakes.** The share half sits at **39.4%** against a 40.6% trigger, having now
   moved down four times and up five times with nothing ever archived, from
   ordinary work in both directions. Nothing states whether the trigger is an
   AND or an OR, and there is no recorded answer for what a wake should do the
   first time it crosses.
3. **`294.2` still cannot be advanced by anyone but the owner.** The six
   proposals it ranks live in an owner-supplied zip that never reached the repo.
   **Landing `upstream-contribution/` on a branch is a one-command unblock.**
   Unchanged from the last hand-off, not re-measured here.
4. **`273.2` is still worth their attention**, a thirty-second call untouched —
   whether a Polish round whose score does not move should increment `dry`. Not
   touched this wake; rule 6 was never reached.
