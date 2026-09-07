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
**`422601c4`**, followed by this hand-off's own commit.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

Every figure below was taken at **`422601c4`**, the slice commit — **not** the
working tree and **not** `HEAD` once this hand-off commits, which is
`ENVIRONMENT.md`'s figure rule.

## THE HAND-OFF THIS WAKE READ WAS TWO COMMITS STALE, AND IT MIS-DIRECTED THE DISPATCH

Not a collision — nothing was lost — but worth the top of the file, because the
previous hand-off's most prominent instruction was **wrong by the time it was
read**:

```
534b097a  the tree the hand-off this wake read describes
8d078221  chore(loops): record the Objective grill's iteration and the hand-off
a7a64595  Slice 332: Standardize sweep — 4 of 4 lanes          ← landed 14:24:44Z
          (this wake's first fetch: ~14:31Z, six minutes later)
```

That hand-off said, in bold, **"the next wake dispatches rule 2, Standardize —
not rule 4"**, on a counter reading `Standardize 4 / 4 OVERDUE`. Slice 332 then
ran exactly that sweep and **did not rewrite this file**, so the counter read
`0 / 4 ok` when this wake looked. Following the instruction would have run a
second Standardize sweep six minutes after the first.

**Nothing caught this except `dispatch_status.py` being re-read rather than
trusted**, which is `LOOPS.md` Step 0b's whole point. It is the third
consecutive occasion a slice has landed without rewriting this file (`623c98d9`,
`8ef9b944`, now `a7a64595`) — recorded, **not filed as a defect**, because the
reconcile-first instruction above is the designed mitigation and it worked.

## What landed: Slice 333, closing 310.2

`174/1` ROADMAP, `12/2` `check-deprecated-icons.mjs`, `32/37` `motion.astro`.

`/base/motion` declared five markup consts the template never rendered. The
Accept allowed either rendering or deleting them; **all five are deleted**, and
the reason is not deadness but **drift**. They were a hand-maintained second
copy of markup the page's "In context" section already renders live — the shape
CLAUDE.md's *"`Demo` renders a preview **and** its copyable code from ONE
string"* exists to prevent — and measured against the built page's own DOM,
**3 of the 5** had already diverged:

| const | verdict |
|---|---|
| `toastMarkup` | MATCHES |
| `menuMarkup` | **DIFFERS** — page adds `bo-alert`, `role="group"`, `<p>` not `<div class="bo-card">` |
| `rowMarkup` | **DIFFERS** — page renders `<tr class="">`; the class is applied by `data-motion-class`, which is that showcase's point |
| `savingMarkup` | MATCHES — inner markup equal after whitespace collapse, driven by a real click |
| `removeMarkup` | **DIFFERS** — source `<tr class="bo-motion-fade-out">`, page `<div class="bo-alert bo-motion-fade-out">` |

So the *render* branch of the Accept would have shipped three copyable samples
contradicting the live showcase beside them.

**The probe was wrong on its first run**, in the way this repo names: v1's claim
table was hand-transcribed and its `removeMarkup` row carried the RENDERED value
in the "const claims" column, so it reported `MATCHES` for a pair that differs —
both columns came from the same side. v2 parses the const out of the source
(a regex whose failure throws) and carries a **control**: `entranceMarkup` IS
rendered and must come back `MATCHES`. It does. 3-of-5 with a passing control
discriminates; 5-of-5 would not have.

**The Accept's own re-run command is the one thing that does NOT apply.** Run
literally it reads **2, 2, 2, 3, 2**, because the comment this edit wrote to
explain the deletion legitimately names all five — CLAUDE.md's
*"verifying a removal: assert on structure, never on raw text"* arriving inside
a criterion rather than inside a script. Comment-stripped identifier counts read
**0** for all five and **2** for each of the four that legitimately remain.

## NOT VERIFIED, said plainly — and this wake adds NO visual debt

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.**
**None are owed for this slice**, and that is measured rather than asserted: the
built page is **byte-identical** before and after — `md5sum`
`f8886e3e9ee20f6464ae9545cd44d7aa`, 87,802 bytes both, from a fresh
`rm -rf apps/docs/dist && npm run docs:build` (all 139 pages rewritten, mtimes
`14:34:21-24Z`). Byte-identical is a suspiciously tidy number, so the comparison
was **red-proved**: the same `diff` against a *different* built page reports a
difference, so the instrument discriminates.

**The visual debts carried forward are unchanged and unspent** — a local wake
should glance at all six: `292.4/292.5`'s screenshot lane on `/components/icon`;
the withdrawn-claim paragraph and Slice 325's performance paragraph on
`/components/data-table`; Slice 319's paragraph on `/patterns/kanban` at 390px;
`320.3`'s `ApiTable.astro` `0.5rem` against `ClassRef.astro` `.4rem`; and Slice
`310.1`'s three `prod/` Refresh buttons (`/prod/production-orders`,
`/prod/capacity`, `/prod/bom`).

**Gates green on the committed tree:** all **17** CI-runnable entry points,
re-derived from `ci.yml` rather than read off a snapshot — core `build`, core
`test` (165 passed), `lint:css`, `docs:build` (`check:repo`), `check:claims`
(**170** live · 3 NOT VERIFIED, which is `ENVIRONMENT.md` §6b's container fact,
not a regression), `check:formatting`, `check:scroll` (914 containers / 118
pages × 2), `check:layout` (**128** pages), `check:forced-colors`, `test:axe`
(**128 × 2**, zero violations), `check:target-size`, `check:search`,
`check:pseudo`, `check:quickstart`, `check:po-app` (**20** behaviours),
`check -w create-ui`, `npm run suite` (**28** screens) — plus `check:selftests`
(54 gates: 20 heuristic, 34 exact) and the §3b `docs:build` re-run after this
file was written.

**The `verifier` agent is not available in this session**, so `LOOPS.md` §2 step
6's verifier pass was done by hand — the staged diff re-read adversarially.
**It caught two unmeasured sentences in this wake's own ROADMAP entry before
they landed**: *"this repo has no `tsconfig.json` at all"* (false —
`tsconfig.base.json` and `packages/core/tsconfig.json` both exist; what is true,
and is what the argument needed, is that the core one's `include` is
`src/js/**/*.ts` and `apps/docs/` has none, so no TS config here has ever looked
at a docs `.astro` file), and *"Slice 332 reset the counter an hour earlier"*
when the gap was **six minutes**. A third data point for `327.3`: the practice
works when it is executed.

## Counters read AFTER recording this wake's row — rule 4 again next wake

```
Standardize   1 / 4 Continue rounds   since 2026-09-07 22:24   ok
Objective     2 / 3 slices            since 2026-09-07 14:01   ok   [332, 333]
Optimize      0 wake-date(s) newer    since 2026-09-07 12:59   ok
```

**Objective is at `2 / 3`. One more closed slice arms rule 3**, so the wake
after next is the likelier grill. Nothing preempts rule 4 right now.

**Rule 5 is `ok`, not STALE, and no metric was recorded this wake on purpose.**
The comparable set's only mover is `claims`, whose day-pair is already
`2026-09-06 169 -> 2026-09-07 170 +1`. This wake's `check:claims` read **170**
again, on the *same day* as the existing sample, so a second `claims=170` is not
a second run and would move nothing. `axe-violations` reads `NEVER MOVED` and
cannot fire the rule either way. **Rule 5 was EVALUATED and does not fire.**

**`polish_requeue.py` was not run in `--apply` mode** — §3b step 0 is owed only
once rule 6 is reached, and rule 4 matched first.

## The open set is 29 — no P0, and 17 are cloud-takeable

`roadmap_scope.py` at `422601c4` reports **29 open / 63 closed**, OPEN slices
`[15, 112, 249, 273, 296, 297, 315, 316, 319, 320, 322, 323, 324, 325, 326, 327,
328, 330, 331, 332, 333]`. **Slice 310 left the OPEN list entirely** (310.2 was
its last open item); 333 entered. The raw counts reconcile: `grep -c` reads 29
open / **65** closed, and 65 = 63 attributed + the 2 `[x]` under the non-slice
`## STATE` heading.

**Enumerated, not carried from the last hand-off** — every entry was re-derived
from its own item text this wake:

- **cloud-takeable: 17** — `315.3`, `316.1`, `319.3`, `320.2`, `322.3`,
  `323.1`, `324.1`, `324.2`, `325.1`, `325.2`, `326.3`, `327.3`, `328.1`,
  `330.1`, `331.1`, `332.1`, `333.1`. **`315.3` is now the oldest of these**,
  `310.2` having closed.
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

## The archive sweep is NOT due, and the two halves disagree for the SIXTH wake

Measured at **`422601c4`**: **7,817 lines**, closed-history share **29.5%**
(2,305 lines across 8 closed slices). The standing trigger is *past 5,450 lines
**and/or** 40.6%*: lines are past, **share is not**. That is precisely the
AND-vs-OR case `249.12` is open on, and it decides something here — under AND,
no sweep. **Sixth consecutive wake where the two halves disagree.**

The share ROSE again (27.8% → 29.5%), for the same mechanism as last wake: the
numerator moved 2,102 → 2,305 because **Slice 310 closed and entered it**, while
the denominator grew by this wake's own entry. A wake reaching for a sweep
should read `roadmap_scope.py`'s pin line first — **10 targets are named by a
still-open item**, and `310` is now among the eligible targets.

Trend across thirty-eight readings: 27.5% → 32.0% → 34.2% → 38.0% → 39.4% →
37.5% → 36.9% → 36.2% → 35.5% → 37.3% → 36.9% → 38.3% → 37.6% → 9.4% → 10.3% →
10.9% → 11.8% → 26.0% → 26.9% → 30.5% → 29.5% → 28.9% → 31.2% → 35.3% → 34.7%
→ 36.4% → 38.1% → 40.3% → 39.4% → 39.9% → 41.5% → 24.6% → 28.2% → 27.4% →
26.9% → 26.4% → 27.8% → **29.5%**.

## Step 1 — both intakes read, with the controls ENVIRONMENT.md §8 names

**`LOOPS.md` Step 1 now mandates the REST form** (Slice 332 replaced the `gh`
commands six minutes before this wake started), and it ran clean here:

```
/discussions        -> HTTP 200, len 0     the reading
/not-a-real-route   -> HTTP 404            an unserved route does NOT answer 200 []
/issues?state=open  -> HTTP 200, len 1     #2, updated 2026-09-06T15:10:34Z
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so
Step 1 committed nothing. The red-proof `ENVIRONMENT.md` §8 still owes remains
owed — nothing has ever been filed in this repo's Discussions.

**Issue #2's `updated_at` has not moved for a second consecutive hand-off.**
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

Trap 1 bit — `git branch --show-current` was **empty** and the fetch reported a
forced update `26447ba...a7a6459`, so the local ref was both detached and stale.
Fixed with `git checkout -B main origin/main` before any commit. `git rev-parse
--short main HEAD` also produced its documented `fatal: Needed a single
revision` mid-wake — §1's trap, not a state problem. Trap 2 clean in one
`--unshallow` (no `shallow.lock`), and it again brought the tags — `git fetch
--unshallow origin` printed `* [new tag] v0.6.0 / v0.7.0 / v0.8.0` and
`git tag | wc -l` → **8**, which is §2's mandated check rather than an
assumption either way. (The previous hand-off's running "Nth consecutive
container" tally is deliberately not incremented here: this wake measured the
count, not the streak.) No `git stash` was used at any point.

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were
read** (issues **1** open, discussions **0** open).

**Two things want the owner's attention, unchanged from the last hand-off:**

1. **Issue #2 is open and carries only the triage comment.** Slice 317 refuses
   the component with the measurement; Slice 319 corrected a second false claim
   on the same page the reporter was pointing at, which strengthens their report
   rather than weakening it. **Replying and closing the issue is a thirty-second
   owner action.** Whether a *wake* should post that comment is `297.1`, which
   stays open until someone who is not the owner files something.
2. **`273.2` is still worth their attention**, a thirty-second call untouched —
   whether a Polish round whose score does not move should increment `dry`. Not
   touched this wake; rule 6 was never reached.

**`249.12` stays a live question and is sharper for the sixth time** — a sixth
consecutive wake where the two halves of the archival trigger DISAGREE, and the
share has now moved *toward* the threshold two wakes running (26.4 → 27.8 →
29.5%). Still not urgent, but the trend is no longer flat.

**`333.1` is new and is a cheap owner-free decision** — whether a gate, a
`tsconfig` that would actually see docs `.astro` files, or neither should forbid
a never-used frontmatter const. Its Accept explicitly makes *"build nothing"* a
satisfying outcome. `315.3` is the oldest cloud-takeable item and is what rule 4
reaches next.
