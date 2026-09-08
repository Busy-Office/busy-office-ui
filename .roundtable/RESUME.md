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

Last updated 2026-09-08 (**cloud** wake, scheduled routine). Working tree clean
at hand-off. **This wake dispatched TWICE**, because the first dispatch was lost
to a collision. Two iterations recorded — `Meta · collision` (`logged`, one
refusal) and `Objective · grill` (`landed`) — and one metric,
`dispatch-region-words=7492`, which **joins rule 5's comparable set** as its
second distinct day. Two commits: **`7e2c61c0`** (the collision record) and
**`aac39366`** (Slice 341).

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ COLLISION 5 — THIS WAKE LOST A FULL RULE-4 DISPATCH, AND THAT IS WHAT ARMED THE GRILL

**Read `LOOPS.md` Step 0c; the line is item 5 and the forensics are in
`LOOPS-archive.md`.** The short version, because it changes how the next wake
reads the queue:

- This wake dispatched **rule 4 on `319.3`**, ran it to a verdict (**refuse**),
  wrote the slice, and ran all 17 gates green. The **pre-commit
  `git fetch origin main`** then saw `273c7ae3..1a973395` — the other dispatcher
  had run **the same rule on the same item**, reached **the same verdict**, and
  independently numbered it **`## Slice 340`**.
- Nothing was committed. The tree was reset and rebased. **The winner's analysis
  strictly dominated** and is what shipped: it red-proved that the 4-page
  "overlap" was never coverage either (**0 of 18, not 4 of 18**), via a claim on
  the *swept* `/components/button` page, and it moved **six** claims into
  `check:claims` (**170 → 176** live).
- **"Check the loser's output before discarding" ran and returned NOTHING** —
  the loser's one distinctive finding (two of the 18 are grep artefacts) was
  already `340.3`. Recorded as a negative result for that instruction, not a
  reason to drop it.
- **Closing `319.3` moved rule 3 from `2 / 3` to `3 / 3`**, so the collision is
  what armed the Objective grill this wake then ran.

**The charter was applied contemporaneously** — a first. `LOOPS.md` gained the
one mandated line; `LOOPS-archive.md` took the 40 lines of forensics. 339.1 had
to apply it retroactively for collisions 3 and 4.

## THE COUNTERS, READ AFTER RECORDING — rule 3 is SPENT, rule 5 is live again

```
Standardize   1 / 4 Continue rounds   since 2026-09-07 21:52   ok
Objective     0 / 3 slices            since 2026-09-08 00:17   ok
Optimize      0 wake-date(s) newer    since 2026-09-08 00:17   ok
```

**This wake spent rule 3** — it dispatched at `3 / 3 OVERDUE [316, 319, 339]`
and the counter reset to `0 / 3`. Rule 2 sits at `1 / 4`.

**Rule 5's line is no longer `SKEW` — it reads `ok`**, because
`dispatch-region-words` now has two distinct days and is the newest pair.
**Read `dispatch_status.py` rather than trusting this block**; it is read AFTER
recording, which is `LOOPS.md`'s own instruction, and doing so this wake is what
confirmed rule 3 saw the grill row.

## Rule 5 evaluated, and it does not fire — but ONE NAME NOW NEEDS WATCHING

**No name regresses on two consecutive runs**, so the rule does not fire:
`claims` `169 → 176` and `gates` `27 → 55` are growth in the healthy direction,
`axe-violations` reads `NEVER MOVED` (pinned by its own gate), and
`bundle-gz-kb`'s `+3.4` is a single old pair (2026-08-17 → 2026-09-03).

**`dispatch-region-words` `7298 → 7492` (+194) is the one to watch, and its
direction is the UNHEALTHY one** — it measures the prose a wake must read in
order to dispatch, so rising is the regression. **One pair cannot fire rule 5**,
which needs two consecutive. If the next reading rises again, rule 5 fires and
Optimize is the dispatch. The cause is not mysterious and is filed as `341.1`.

**Convention warning, or the series will be corrupted:** `7492` is measured
**heading-line-excluded**, which is the convention 339's `7298` used.
`report_loop_prose.py` prints the heading-INCLUDED figure (**7548** at
`aac39366`); the constant between them is **56**, and 339 named it. Subtract 56
before recording, or the next sample jumps 56 for no reason.

**No size budget breached** — not carried forward; the core build's own
`check:size` ran green inside `npm run build -w @busy-office/ui` this wake.

## What landed: Slice 341 — the Objective grill of 316, 319, 339

**17 of 17 re-runnable published assertions reproduce. No defect found.** That
is unusual here, and the report distrusts it first: the scope is **narrow by
selection** (mechanically re-runnable assertions only), and what was *not*
re-run is named there rather than left implied. **The 17 is enumerated in the
report**, not asserted — a bare count is what this loop keeps catching
elsewhere. Report:
`.roundtable/grill-objective-316-319-339-2026-09-08.md`.

**The finding is not a defect in the slices grilled — it is that Slice 339's
central conclusion was confirmed by the very next commit.** 339.1 said Step 0c
has a **generator** and *"no cut can hold against one"*:

```
f9e0f17d  1322  -178   Slice 339's fix
7e2c61c0  1516  +194   collision 5, this wake
```

**16 words above the 1,500 that made 339 diagnose the problem, 138 above the
1,378 it was cut from — one wake later, with the charter followed exactly.**
Every figure 339 published reproduces to the word once its stated convention is
applied (heading excluded; the heading is exactly 13 words).

**`341.1` is the contribution: the generator has TWO outputs and the charter
throttles only one.** The +194 splits **115** (the mandated inline list entry)
and **79** (correcting the counts the incident falsified — *"Four as of
2026-09-07"*, *"Three of the four…"*). **The 79 is mandated by nothing and is
not slack that discipline removes**: correcting a falsified count is required by
the standing rule against stale prose counts. Filed, not fixed, because Step 0c
**already refuses** the obvious alternative — a count plus a pointer — in its
own words.

## NOT VERIFIED, said plainly — and this wake adds NO visual debt

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.**
**None are owed by either commit**, and that is structural rather than a
judgement call: the two diffs are **`ROADMAP.md`, `LOOPS.md`,
`LOOPS-archive.md` and one new `.roundtable/` report**. No CSS rule, no docs
page and no script changed, so no rendering can move. `git diff --stat` was read
to confirm that, not assumed.

**The wake's throwaway probes were reverted before any commit and confirmed
gone**: a 21-page copy of `check-target-size.mjs` in `apps/docs/scripts/`
(deleted) and two `<style>` injections into built pages under `apps/docs/dist/`
(restored; `grep -c 'probe-319-3'` → **0**). `git status` was clean at commit
time.

**The visual debts carried forward are unchanged and unspent** — a local wake
should glance at all six: `292.4/292.5`'s screenshot lane on `/components/icon`;
the withdrawn-claim paragraph and Slice 325's performance paragraph on
`/components/data-table`; Slice 319's paragraph on `/patterns/kanban` at 390px;
`320.3`'s `ApiTable.astro` `0.5rem` against `ClassRef.astro` `.4rem`; and Slice
`310.1`'s three `prod/` Refresh buttons.

**Gates green:** all **17** CI-runnable entry points were run on the pre-commit
tree for Slice 341 — core `build`, core `test`, `lint:css`, `docs:build`,
`check:claims` (**176** live · 3 NOT VERIFIED, which is `ENVIRONMENT.md` §6b's
container fact, not a regression), `check:formatting`, `check:scroll`,
`check:layout`, `check:forced-colors`, `test:axe` (128 × 2, zero violations),
`check:target-size`, `check:search`, `check:pseudo`, `check:quickstart`,
`check:po-app`, `check -w create-ui`, `npm run suite`. The collision-record
commit was gated by the four that read these files (`check:loop-vocab`,
`check:slice-refs`, `check:floor`, `check:vendor-names`), per `ENVIRONMENT.md`
§3b. **`docs:build` was re-run after this file was written**, per §3b.

**The `verifier` agent is not available in this session**, so `LOOPS.md` §2 step
6's verifier pass was done by hand — the staged diff re-read adversarially. What
it caught, both in this wake's own output: a **"six failures"** count taken from
a `tail -6` (the position-filter mistake CLAUDE.md records under *"a
context-window regex is secretly a POSITION filter"*) — removed, with `rc=1`
kept as the exact reading; and a bare **"17 of 17"** with no enumeration — the
enumeration was added so the count can be counted back.

## The open set is 32 — no P0, and 21 are cloud-takeable

`roadmap_scope.py` reports **32 open**, and the raw checkbox count agrees.
**Slice 341 joins the OPEN list** on `341.1`. Re-run the script rather than
quoting this — it **refuses to print figures for an uncommitted tree**.

- **cloud-takeable: 21** — `320.2`, `322.3`, `323.1`, `324.1`, `324.2`,
  `325.1`, `325.2`, `326.3`, `327.3`, `328.1`, `330.1`, `331.1`, `332.1`,
  `333.1`, `334.1`, `335.1`, `336.2`, `337.1`, `338.1`, `339.2`, `341.1`.
  **`320.2` is the oldest of these** and is what rule 4 reaches for next —
  judging each declaration separately so a dead one cannot hide behind a live
  one. **`335.1` still carries its caveat**: settling it may mean filing a
  throwaway Q&A discussion, an outward-facing write to a public repo whose
  permission has **not been tested**.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware —
  *"needs a human listening to a screen reader"*), `112.3` (**BLOCKED ON OWNER
  BRIEFS**), `112.4` (blocked on 112.3's verdict), `249.7` (its own text holds
  it for `249.10`, owner vocabulary), `249.10`, `249.11`, `249.12`, `249.13`,
  `273.2` (**OWNER CALL**), `296.3` (**OWNER CALL**). **Re-derived from each
  item's own text this wake**, not carried forward — `249.7` was re-read in
  full before being classified.
- **browser-blocked in the SCREENSHOT sense (1):** `320.3`.

21 + 10 + 1 = 32, asserted rather than left to the reader. **The fifth kind,
`artifact-lost`, is empty — checked rather than assumed.**

## Step 1 — both intakes read, with the controls ENVIRONMENT.md §8 names

```
/discussions        -> HTTP 200, len 0     the reading
/not-a-real-route   -> HTTP 404            an unserved route does NOT answer 200 []
/issues?state=open  -> HTTP 200, len 1     #2, updated 2026-09-06T15:10:34Z
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so
Step 1 committed nothing. **Issue #2's `updated_at` has not moved for a seventh
consecutive hand-off.** See Direction.

## The archive sweep was NOT evaluated this wake — read it fresh

`roadmap_scope.py` was run for the open set only. Rule 3 matched before rule 4,
so no sweep was dispatched and **no sweep-trigger figures were taken**. **Do not
carry the previous hand-off's numbers** — they were read at `f9e0f17d`, two
slices back, and two slices have closed into the numerator since. `249.12`
(whether the trigger's two halves are AND or OR) stays a live owner question and
is untouched.

## The standing environment fact: CI HAS NO `paths-ignore`

`312.2` removed it entirely. **A push that touches only `.roundtable/**` runs
the full suite.** The consequence a wake feels directly is `ENVIRONMENT.md` §3b
— *re-run `npm run docs:build` after writing this file, before pushing* — and it
was executed this wake, after this file was written, before the push.

## CHECK CI AFTER PUSHING

Read the runs after your push; one `actions/runs?branch=main` read costs nothing
and is the only thing standing between a red `main` and the next wake.

## Step 0 traps

Trap 1 bit again — the fetch reported a forced update `26447ba...273c7ae` and
the container started **detached** (`git branch --show-current` empty); fixed
with `git checkout -B main origin/main` before any commit, and re-read as `main`
immediately before committing. Trap 2 was clean in one `--unshallow` (no
`shallow.lock`) and again brought the tags (`v0.1.1`..`v0.8.0`), the follow-up
`git fetch --tags origin` adding nothing: `git tag | wc -l` → **8**, §2's
mandated count. **No ordinal is claimed for that streak** — two incompatible
counters for it are in circulation (Slice 319's trace says "thirty-first", the
hand-off series says "sixth"), and running the count is the check §2 asks for.

Trap 1c was respected rather than met: `CHROME_PATH` was exported **in the same
command** as every browser gate, and lane commands were spelled `-w docs`
(`337.1`'s live trap). No `git stash` was used at any point.

**The pre-commit `git fetch origin main` FOUND A COLLISION** on the first
dispatch (see above) and found none on the second — `origin/main` unmoved at
`1a973395`, `rev-list --left-right --count` reading `0 1`.

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were
read** (issues **1** open, discussions **0** open).

**Two things want the owner's attention, both unchanged and both thirty-second
actions:**

1. **Issue #2 is open and carries only the triage comment.** Slice 317 refuses
   the component with the measurement; Slice 319 corrected a second false claim
   on the same page the reporter was pointing at, which strengthens their
   report rather than weakening it. **Replying and closing the issue is an
   owner action.** Whether a *wake* should post that comment was `297.1`, closed
   by Slice 335 — read it before re-raising.
2. **`273.2` is still worth their attention** — whether a Polish round whose
   score does not move should increment `dry`. Not touched this wake; rule 6 was
   never reached, so `polish_requeue.py --apply` was correctly not run (§3b
   step 0 is owed only once rule 6 is reached, and rules 3 and 4 matched first).

**A third thing is now worth naming, because it cost a wake's work today.**
Collision 5 is the **second** collision to spend a full wake (collision 1 was
the first) and the most expensive of the five: a complete measurement, a
red-proof, a discrimination control and all 17 gates, discarded. Step 0c's
decision to **accept** collisions is the owner's to revisit or leave; the
measured cost model now reads *three of five cheap, two expensive*, and the
cheap ones are the ones caught EARLY — which argues for the pre-commit fetch,
not for partitioning (already refused on starvation). **Nothing is proposed
here**; the point is only that the sample is no longer one.

**What the next wake should reach for: rule 4 on `320.2`**, unless rule 2
(`1 / 4`) or rule 5 has moved. Rule 3 is spent at `0 / 3`, so a grill is three
closed slices away. **Watch `dispatch-region-words`** — a second consecutive
rise fires rule 5 and dispatches Optimize, and `341.1` is the item that explains
the first one.
