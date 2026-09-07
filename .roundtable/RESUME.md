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
two refusals) and **no metric** — see rule 5 below. The work landed as
**`ac4a9a0f`**, followed by this hand-off's own commit.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

Every figure below was taken at **`ac4a9a0f`**, the slice commit — **not** the
working tree and **not** `HEAD` once this hand-off commits, which is
`ENVIRONMENT.md`'s figure rule.

## RULE 3 IS OVERDUE — THE NEXT WAKE IS THE GRILL, NOT RULE 4

```
Standardize   2 / 4 Continue rounds   since 2026-09-07 22:24   ok
Objective     3 / 3 slices            since 2026-09-07 14:01   OVERDUE  [315, 332, 333]
Optimize      0 wake-date(s) newer    since 2026-09-07 12:59   ok
```

Read **after** recording this wake's row. `315` crossed it: 315.3 was that
slice's last open item, so closing it moved 315 out of the OPEN set and into
the arming list.

**Re-read `dispatch_status.py` rather than trusting this block.** The previous
hand-off's most prominent instruction was wrong by the time it was read — a
sibling slice had landed six minutes earlier and reset the counter it named —
and the only thing that caught it was Step 0b being executed instead of
believed. Two dispatchers share this queue, and `LOOPS.md` Step 0c records that
**rule 3 collides harder than rule 4**: it hands both dispatchers the same
arming set, so they duplicate a whole wake rather than one item. If the counter
still reads OVERDUE when you look, the grill of **315, 332 and 333** is the
dispatch.

## What landed: Slice 334, closing 315.3

`160/1` ROADMAP, `131/6` `check-selftests.mjs`, `13/3` `check-rf-floor.mjs`,
`7/2` `check-size.mjs`, `4/1` `check-markup.mjs`.

315.3 asked whether `check:selftests` should EXECUTE each heuristic gate's
`--self-test` rather than grep for the `process.argv` branch. **Decided:
execute, on a case-count marker.** The argument is 315.1's own defect — a real,
correct `--self-test` block sitting BELOW a `ci.yml` read that returned first,
so the gate exited **0 having classified nothing**, which a grep and an exit
code alike read as eighteen passing cases. Reading the source cannot answer
reachability.

**The Accept's re-measurement ran first, and the base rate had moved twice:**

| 315.3 recorded | here, at `1363ffb9` |
|---|---|
| 1 of 20 run zero cases | **0 of 20** — all twenty exit 0, **157** cases between them |
| "4 gates died with no `apps/docs/dist`" | **does not reproduce at all** |

Four contexts, byte-identical output in every one: full tree; `apps/docs/dist`
parked; `CHROME_PATH` unset; and the **docs-image context** (`ROADMAP.md`,
`LOOPS.md`, `CLAUDE.md`, `.roundtable/`, `.github/` and `dist` all absent —
exactly what `apps/docs/Containerfile` does not copy). Twenty identical outputs
is a suspiciously tidy number, so it carries a control: with `dist` parked, the
**plain** runs of `check-escaped-entities`, `check-learning-path`,
`check-components-used` and `check-notes` all exit **1** on ENOENT under `dist`
while those same four gates' `--self-test` exits **0**. The absence was real;
the self-tests are simply independent of it. That is what makes this buildable
at all — `check-selftests` runs first in `check:repo`, which runs first in
`docs:build`, **before** `astro build`.

**A FORMAT, not a shared helper**, and that is forced: three of the twenty live
in `packages/core/scripts`, which must not import from `apps/docs`. Written to
accept both shapes already in the tree, so it moved **3 gates, not 20**.

**Cost:** scan only `69/68/65 ms`, whole gate `1355/1295/1300 ms` — `check:repo`
grows by about **1.23 s**.

**Red-proved three ways**, injection confirmed present by `grep -c -F` first,
control green before and after, each reverted to a `grep -c` of 0. The
discriminating one: with the argv branch made **unreachable**, the new gate is
`rc=1` and the **old grep-only logic PASSES on that identical tree**.

**One thing this cost, and it is worth carrying:** a `git checkout <file>` used
to revert an injection **silently took a real edit of this slice with it** —
the file had been injected *and* legitimately edited. The gate went green again
only because the edit was re-applied by hand; nothing would have reported it.
**Stage before injecting**, so `git checkout` restores the intended state rather
than `HEAD`'s.

## NOT VERIFIED, said plainly — and this wake adds NO visual debt

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.**
**None are owed for this slice**, and that is structural rather than measured:
the diff is four gate scripts and roadmap prose. No `.astro`, no `.css`, no
docs page, no generated artefact under `dist/` is touched by it.

**The visual debts carried forward are unchanged and unspent** — a local wake
should glance at all six: `292.4/292.5`'s screenshot lane on `/components/icon`;
the withdrawn-claim paragraph and Slice 325's performance paragraph on
`/components/data-table`; Slice 319's paragraph on `/patterns/kanban` at 390px;
`320.3`'s `ApiTable.astro` `0.5rem` against `ClassRef.astro` `.4rem`; and Slice
`310.1`'s three `prod/` Refresh buttons (`/prod/production-orders`,
`/prod/capacity`, `/prod/bom`).

**Gates green on the committed tree:** all **17** CI-runnable entry points, and
the whole list was run **twice** — once before the adversarial re-read of the
staged diff, and again after the four fixes it produced. Core `build`, core
`test` (**165** passed, 29 files), `lint:css`, `docs:build` (`check:repo`, which
now reports `20 heuristic (all self-tested; 160 cases actually run)`),
`check:claims` (**170** live · 3 NOT VERIFIED, which is `ENVIRONMENT.md` §6b's
container fact, not a regression), `check:formatting`, `check:scroll` (914
containers / 118 pages × 2), `check:layout` (**128** pages),
`check:forced-colors`, `test:axe` (**128 × 2**, zero violations),
`check:target-size`, `check:search`, `check:pseudo`, `check:quickstart`,
`check:po-app` (**20** behaviours), `check -w create-ui`, `npm run suite`
(**28** screens) — plus the §3b `docs:build` re-run after this file was written.

**The 160 reconciles against an independent count**: the sweep counted **157**
per-case output *lines*, and `check-rf-floor` prints none while now declaring
**3**. Two instruments, agreeing.

**The `verifier` agent is not available in this session**, so `LOOPS.md` §2 step
6's verifier pass was done by hand — the staged diff re-read adversarially. **It
found four things and all four were fixed before the commit**: `spawnSync`
reporting `exited null` with no cause on a spawn error or timeout (it now names
`r.error`); `indent('')` emitting a lone indented blank line for the most
interesting case of all, a branch that printed nothing (it now says so); an
identifier named `unreachable` that actually held three different failure kinds;
and **two numbers asserted rather than measured** — the retag's `55/21/34`
consequence, and a `1.38 s` cost quoted from the whole gate when the question is
what it *adds*. Both are now measured and both moved. A fourth data point for
`327.3`: the practice works when it is executed.

## Rule 5 was EVALUATED and does not fire; no metric this wake, on purpose

The comparable set's only mover is `claims`, whose day-pair is already
`2026-09-06 169 -> 2026-09-07 170 +1`. This wake's `check:claims` read **170**
again, on the *same day* as the existing sample, so a second `claims=170` is not
a second run and would move nothing. `axe-violations` reads `NEVER MOVED` and
cannot fire the rule either way.

**`polish_requeue.py` was not run in `--apply` mode** — §3b step 0 is owed only
once rule 6 is reached, and rule 4 matched first.

## The open set is still 29 — no P0, and 17 are cloud-takeable

`roadmap_scope.py` at `ac4a9a0f` reports **29 open / 64 closed**, OPEN slices
`[15, 112, 249, 273, 296, 297, 316, 319, 320, 322, 323, 324, 325, 326, 327, 328,
330, 331, 332, 333, 334]`. **Slice 315 left the OPEN list entirely** (315.3 was
its last open item); 334 entered. The raw counts reconcile: `grep -c` reads 29
open / **66** closed, and 66 = 64 attributed + the 2 `[x]` under the non-slice
`## STATE` heading. The count is unchanged at 29 because 315.3 closed and 334.1
opened in the same commit.

**Enumerated, not carried from the last hand-off** — every entry was re-derived
from its own item text this wake:

- **cloud-takeable: 17** — `316.1`, `319.3`, `320.2`, `322.3`, `323.1`,
  `324.1`, `324.2`, `325.1`, `325.2`, `326.3`, `327.3`, `328.1`, `330.1`,
  `331.1`, `332.1`, `333.1`, `334.1`. **`316.1` is now the oldest of these**,
  `315.3` having closed.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3` ("BLOCKED ON OWNER BRIEFS"), `112.4` (blocked on 112.3's verdict),
  `249.7` (its first Accept clause is executed; the rest holds for `249.10`,
  owner vocabulary), `249.10`, `249.11`, `249.12`, `249.13`, `273.2`
  (`OWNER CALL` in its own heading), `296.3`.
- **browser-blocked in the SCREENSHOT sense (1):** `320.3`.
- **input-blocked (1): `297.1`** — waits on a filer who is not the owner.

17 + 10 + 1 + 1 = 29, asserted rather than left to the reader.

**The fifth kind of blocked, `artifact-lost`, is still worth carrying** — an
item whose Accept says *re-measure* names an artifact, and the artifact either
resolves or it does not. Nothing in the current open set is of that kind,
checked rather than assumed.

## The archive sweep is NOT due, and the two halves disagree for the SEVENTH wake

Measured at **`ac4a9a0f`**: **7,976 lines**, closed-history share **30.7%**
(2,451 lines across 9 closed slices). The standing trigger is *past 5,450 lines
**and/or** 40.6%*: lines are past, **share is not**. That is precisely the
AND-vs-OR case `249.12` is open on, and it decides something here — under AND,
no sweep. **Seventh consecutive wake where the two halves disagree.**

The share ROSE again (29.5% → 30.7%), for the same mechanism as the last two
wakes: **Slice 315 closed and entered the numerator**, while the denominator
grew by this wake's own entry. A wake reaching for a sweep should read
`roadmap_scope.py`'s pin line first — **10 targets are named by a still-open
item**, and `315` is now among the eligible targets.

Trend across thirty-nine readings: 27.5% → 32.0% → 34.2% → 38.0% → 39.4% →
37.5% → 36.9% → 36.2% → 35.5% → 37.3% → 36.9% → 38.3% → 37.6% → 9.4% → 10.3% →
10.9% → 11.8% → 26.0% → 26.9% → 30.5% → 29.5% → 28.9% → 31.2% → 35.3% → 34.7%
→ 36.4% → 38.1% → 40.3% → 39.4% → 39.9% → 41.5% → 24.6% → 28.2% → 27.4% →
26.9% → 26.4% → 27.8% → 29.5% → **30.7%**.

## Step 1 — both intakes read, with the controls ENVIRONMENT.md §8 names

`LOOPS.md` Step 1's REST form ran clean here:

```
/discussions        -> HTTP 200, len 0     the reading
/not-a-real-route   -> HTTP 404            an unserved route does NOT answer 200 []
/issues?state=open  -> HTTP 200, len 1     #2, updated 2026-09-06T15:10:34Z
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so
Step 1 committed nothing. The red-proof `ENVIRONMENT.md` §8 still owes remains
owed — nothing has ever been filed in this repo's Discussions.

**Issue #2's `updated_at` has not moved for a third consecutive hand-off.**
See Direction.

## The standing environment fact: CI HAS NO `paths-ignore`

`312.2` removed it entirely. **A push that touches only `.roundtable/**` runs
the full suite.** The consequence a wake feels directly is `ENVIRONMENT.md` §3b
— *re-run `npm run docs:build` after writing this file, before pushing* — and it
was executed this wake, after this file was written, before the push.

## CHECK CI AFTER PUSHING

`main` was green at the start of this wake. Read the runs after your push; one
`actions/runs?branch=main` read costs nothing and is the only thing standing
between a red `main` and the next wake.

## Step 0 traps

Trap 1 bit again — the fetch reported a forced update `26447ba...1363ffb` and
`git branch --show-current` was empty, so the local ref was both detached and
stale; fixed with `git checkout -B main origin/main` before any commit. Trap 2
needed the documented patience: `git fetch --unshallow origin` **exceeded the
400 s tool timeout** and had to finish in the background, which is §2b's shape
without its lock — `.git/shallow.lock` was pre-emptively removed and the fetch
completed, `is-shallow-repository` reading `false` at **2,026** commits. It
again brought the tags: `git tag | wc -l` → **8**, which is §2's mandated count
rather than an assumption either way. No `git stash` was used at any point.

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were
read** (issues **1** open, discussions **0** open).

**Two things want the owner's attention, unchanged from the last two hand-offs:**

1. **Issue #2 is open and carries only the triage comment.** Slice 317 refuses
   the component with the measurement; Slice 319 corrected a second false claim
   on the same page the reporter was pointing at, which strengthens their report
   rather than weakening it. **Replying and closing the issue is a thirty-second
   owner action.** Whether a *wake* should post that comment is `297.1`, which
   stays open until someone who is not the owner files something.
2. **`273.2` is still worth their attention**, a thirty-second call untouched —
   whether a Polish round whose score does not move should increment `dry`. Not
   touched this wake; rule 6 was never reached.

**`249.12` stays a live question and is sharper for the seventh time** — a
seventh consecutive wake where the two halves of the archival trigger DISAGREE,
and the share has now moved *toward* the threshold three wakes running (26.4 →
27.8 → 29.5 → 30.7%). Still not urgent, but the trend is no longer flat.

**`334.1` is new and is a cheap owner-free decision** — whether
`check-selftests.mjs` is now `@heuristic` itself, given that part of its verdict
rests on matching a regex against a child process's prose. Its Accept makes a
**refusal** satisfying, and says outright to re-read the tag definitions before
deciding. It is not, however, what the next wake should reach for: **rule 3 is
OVERDUE and preempts rule 4.** `316.1` is the oldest cloud-takeable item for
whenever rule 4 comes round again.
