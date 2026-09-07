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
at hand-off. **One iteration recorded** — `Standardize · sweep` (outcome
`landed`, no refusals) — **and one metric**, `dispatch-region-words=7298`, which
starts a series rather than moving anything today. The work landed as
**`f9e0f17d`**, followed by this hand-off's own commit.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

Every figure below was taken at **`f9e0f17d`**, the slice commit — **not** the
working tree and **not** `HEAD` once this hand-off commits, which is
`ENVIRONMENT.md`'s figure rule.

## THE COUNTERS, READ AFTER RECORDING — rule 2 is SPENT, rule 3 is one slice away

```
Standardize   0 / 4 Continue rounds   since 2026-09-07 21:52   ok
Objective     2 / 3 slices            since 2026-09-08 03:15   ok   [316, 339]
Optimize      0 wake-date(s) newer    since 2026-09-07 19:53   SKEW
```

**This wake spent rule 2** — it dispatched at `4 / 4 OVERDUE` and the counter
reset. **Rule 3 moved 1 → 2 in the same recording**, because Standardize closes
a slice (279.4's amendment) and 339 is one. **One more closed slice arms the
Objective grill**, which sits above rule 4.

**Read `dispatch_status.py` rather than trusting this block.** It is read AFTER
recording, which is `LOOPS.md`'s own instruction, and doing so this wake is what
confirmed rule 3 saw the Standardize slice — the comparison that has caught two
of the five parser recurrences, agreeing this time.

## Rule 5 evaluated, and it does not fire

The line reads **`SKEW, 0 wake-date(s) newer`** — 306.1's third flag, so the
remaining newer date sits inside the two dispatchers' 8h clock envelope and the
rule IS evaluable. **No name in the comparable set regresses on two consecutive
runs**: `gates` `27 → 55` and `claims` `169 → 170` are growth in the healthy
direction, `axe-violations` reads `NEVER MOVED` and is pinned by its own gate,
and `bundle-gz-kb`'s `+3.4` is a single old pair (2026-08-17 → 2026-09-03), not
two consecutive runs. **No size budget breached** — `check:size` re-run this
wake, not carried forward: 139 files, 382.7 kB gz, **tightest headroom 110
bytes** on `css/brand-navy.min.css`, green.

Note the line's own warning: recording another metric will not move `SKEW`.
`dispatch-region-words` is a single-day name and is **not** an input to rule 5
yet; it becomes one on its second distinct day.

## What landed: Slice 339 — the Standardize sweep, 4 of 4 lanes

**Lanes 1-3 clean.** Lane 1 **0 dead of 1,365** inline style attributes (1,854
declarations). Lane 2 `74 files · 242 rules · 230 bodies · 8 repeats` — the
**fifth** consecutive identical reading, and the finding is the delta, so there
is none. Lane 3 `119 pages · median 798 · total 113,787`, flagged union **15**
(10 over 2x the corpus median, 11 over a family median), all inside the pinned
16-set; `/patterns/output-form/` is the member that is not flagged. Membership
was checked **against the enumeration**, never the grep `326.1` red-proved dead.

**Lane 4 is the finding, and the premise it started from is FALSE.** The
dispatch region grew faster than the file, so it was attributed per section as
`308.1` requires. Every changed section grew since the last cut, the largest
being **the very section 274.2 cut** — which reads as 308.1's first branch,
*the fold did not hold*.

**The per-revision series refutes that.** Step 0c held **flat at 936 across 15
consecutive commits**, then moved twice on 2026-09-07 — `534b097a` +364
(collision 3's forensics) and `86f034ce` +200 (collision 4's) — reaching
**1,500**, past the **1,378** it was cut from. So **the cut held perfectly and
the charter behind it was never executed**: `LOOPS-archive.md`'s Step 0c charter
says forensics move and instruction stays, and nothing applies it when the next
incident is written up.

**That is a third case, and both existing branches send a wake the wrong way on
it.** It is now the third branch of the lane-4 clause, with the general form:
**check whether the section has a GENERATOR** — a recurring event each instance
of which writes a narrative there — because no cut can hold against one.

**Fixed by applying the charter, not by cutting again.** Collisions 3 and 4 keep
a one-line record inline in the shape 274.2 left 1 and 2 in; their forensics,
the decision-time fixed-string re-check and the "it has happened once"
stale-snapshot incident moved to `LOOPS-archive.md`. Everything that changes
what a wake DOES stayed inline and was re-read to confirm it: the pre-commit
`git fetch origin main`, the renumber mechanic, keep-both-rows, "check the
loser's output before discarding", and the guaranteed-conflict refutation.

**The first attempt did not work, and that is in the slice rather than smoothed
over.** It moved Step 0c **1,500 → 1,487** — 13 words — because the narrative
removed was replaced by a paragraph explaining its removal, which is the same
accretion by another name. Tightened to the instruction, it reads **1,322**:
178 below where this wake found it, 56 below pre-cut, and **still 386 above the
936 the cut achieved**, which is stated rather than rounded off because the
residual is instruction that landed after the cut, not narrative.

**Two instruments, reconciled before being quoted.** Lane 4's region figure
(7,532) counts heading lines; the per-section splitter (7,476) does not. They
differ by the constant **56** the playbook names, so the deltas agree and the
totals do not — the slice says which figure came from which.

**Two stale counts fixed in passing**, same defect class as lane 3's "Verdicts
to date" list: a pointer naming "the first two collisions" and an archive
heading reading "The two collisions", both written when two was right and both
stale from the moment a third landed. Both now name the subject.

## NOT VERIFIED, said plainly — and this wake adds NO visual debt

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.**
**None are owed by this slice**, and that is structural rather than a judgement
call: the diff is **three markdown files** (`LOOPS.md`, `LOOPS-archive.md`,
`ROADMAP.md`). No CSS rule, no docs page and no script changed, so no rendering
can move. `git diff --stat` was read to confirm that, not assumed.

**The visual debts carried forward are unchanged and unspent** — a local wake
should glance at all six: `292.4/292.5`'s screenshot lane on `/components/icon`;
the withdrawn-claim paragraph and Slice 325's performance paragraph on
`/components/data-table`; Slice 319's paragraph on `/patterns/kanban` at 390px;
`320.3`'s `ApiTable.astro` `0.5rem` against `ClassRef.astro` `.4rem`; and Slice
`310.1`'s three `prod/` Refresh buttons.

**Gates green:** all **17** CI-runnable entry points were run on the pre-commit
tree — core `build`, core `test`, `lint:css`, `docs:build`, `check:claims`
(**170** live · 3 NOT VERIFIED, which is `ENVIRONMENT.md` §6b's container fact,
not a regression), `check:formatting`, `check:scroll` (914 containers / 118
pages × 2), `check:layout` (**128** pages), `check:forced-colors`, `test:axe`
(**128 × 2**, zero violations), `check:target-size`, `check:search`,
`check:pseudo`, `check:quickstart`, `check:po-app` (**20** behaviours), `check -w
create-ui`, `npm run suite` (28 screens × 2). **`docs:build` was re-run after
this file was written**, per `ENVIRONMENT.md` §3b.

**The `verifier` agent is not available in this session**, so `LOOPS.md` §2 step
6's verifier pass was done by hand — the staged diff re-read adversarially. What
it caught: the two-instrument comparison above (7,532 against 7,476, which would
have invented a 56-word delta); a grep for stale references to the moved text,
which returned only the slice's own description of the fix; and a re-read of the
whole of Step 0c to confirm no sentence was left pointing at text that had moved.

## The open set is 31 — no P0, and 20 are cloud-takeable

`roadmap_scope.py` at `f9e0f17d` reports **31 open / 69 closed**, OPEN slices
`[15, 112, 249, 273, 296, 319, 320, 322, 323, 324, 325, 326, 327, 328, 330,
331, 332, 333, 334, 335, 336, 337, 338]`. **Slice 339 opened and closed inside
this wake**, so it never joins the OPEN list. The raw counts reconcile: `grep -c`
reads 31 open / **71** closed, and 71 = 69 attributed + the 2 `[x]` under the
non-slice `## STATE` heading.

- **cloud-takeable: 20** — `319.3`, `320.2`, `322.3`, `323.1`, `324.1`,
  `324.2`, `325.1`, `325.2`, `326.3`, `327.3`, `328.1`, `330.1`, `331.1`,
  `332.1`, `333.1`, `334.1`, `335.1`, `336.2`, `337.1`, `338.1`.
  **`319.3` is the oldest of these** and is what rule 4 reaches for now that
  rule 2 is spent — a gate question about docs pages asserting a target size,
  no browser needed, and its Accept makes refusing a satisfying outcome.
  **`335.1` still carries its caveat**: settling it may mean filing a throwaway
  Q&A discussion, an outward-facing write to a public repo whose permission has
  **not been tested**.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware —
  *"needs a human listening to a screen reader"*), `112.3` (**BLOCKED ON OWNER
  BRIEFS**), `112.4` (blocked on 112.3's verdict), `249.7` (its own text holds
  it for `249.10`, owner vocabulary), `249.10`, `249.11`, `249.12`, `249.13`,
  `273.2` (**OWNER CALL** in its own heading), `296.3` (**OWNER CALL**).
  **Re-derived from each item's own text this wake**, not carried forward.
- **browser-blocked in the SCREENSHOT sense (1):** `320.3`.

20 + 10 + 1 = 31, asserted rather than left to the reader. **The fifth kind,
`artifact-lost`, is empty — checked rather than assumed.**

## The archive sweep is NOT due, and the two halves disagree for the TENTH wake

Measured at **`f9e0f17d`**: **8,592 lines**, closed-history share **32.1%**
(2,754 lines across 12 closed slices). The standing trigger is *past 5,450 lines
**and/or** 40.6%*: lines are past, **share is not**. That is precisely the
AND-vs-OR case `249.12` is open on, and it decides it here — under AND, no
sweep. **Tenth consecutive wake where the two halves disagree.**

The share rose 31.1% → 32.1% as Slice 339 closed into the numerator — the
largest single-wake rise in the run below, and it is this slice's own doing.
A wake reaching for a sweep should read `roadmap_scope.py`'s pin line first —
**9 targets are named by a still-open item**, and `339` has joined the eligible
target list.

Trend, **eight** readings (the previous hand-off called the same list "ten" and
carried seven values — a count in prose beside the values it counts, which is
the defect this wake's own slice is about): 26.4% → 27.8% → 29.5% → 30.7% →
30.7% → 30.5% → 31.1% → **32.1%**.

## Step 1 — both intakes read, with the controls ENVIRONMENT.md §8 names

```
/discussions        -> HTTP 200, len 0     the reading
/not-a-real-route   -> HTTP 404            an unserved route does NOT answer 200 []
/issues?state=open  -> HTTP 200, len 1     #2, updated 2026-09-06T15:10:34Z
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so
Step 1 committed nothing. **Issue #2's `updated_at` has not moved for a sixth
consecutive hand-off.** See Direction.

## The standing environment fact: CI HAS NO `paths-ignore`

`312.2` removed it entirely. **A push that touches only `.roundtable/**` runs
the full suite.** The consequence a wake feels directly is `ENVIRONMENT.md` §3b
— *re-run `npm run docs:build` after writing this file, before pushing* — and it
was executed this wake, after this file was written, before the push.

## CHECK CI AFTER PUSHING

`main` was green at the start of this wake (`c87fc524`). Read the runs after
your push; one `actions/runs?branch=main` read costs nothing and is the only
thing standing between a red `main` and the next wake.

## Step 0 traps

Trap 1 bit again — the fetch reported a forced update `26447ba...c87fc52` and
the container started **detached**; fixed with `git checkout -B main
origin/main` before any commit, and `git branch --show-current` was re-read as
`main` immediately before committing. The forced update carried nothing the
previous hand-off did not already name. Trap 2 was clean in one `--unshallow`
(no `shallow.lock`) and again brought the tags: `git tag | wc -l` → **8**,
§2's mandated count — the **sixth** consecutive container to contradict the
value that section used to assert, which is why the count is the check.

Trap 1c was respected rather than met: `CHROME_PATH` was exported **in the same
command** as every browser gate, and lane 1 was spelled `-w docs` — `337.1`'s
live trap, which is that `-w @busy-office/docs` prints nothing and does not
visibly fail. No `git stash` was used at any point.

**The pre-commit `git fetch origin main` found NO collision** — `origin/main`
unmoved at `c87fc524`, `rev-list --left-right --count` reading `0 0`.

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
   step 0 is owed only once rule 6 is reached, and rule 2 matched first).

**`249.12` stays a live question and is sharper for the tenth time** — a tenth
consecutive wake where the two halves of the archival trigger DISAGREE, and the
share took its largest single-wake step of the run (31.1 → 32.1) because this
slice is itself a large closed one. Still two readings from the threshold.

**What the next wake should reach for: rule 4 on `319.3`.** Rule 2 is spent at
`0 / 4` and rule 3 sits at `2 / 3` — **one more closed slice arms the Objective
grill**, which outranks rule 4, so a wake that closes anything should expect to
grill on the wake after. `319.3` is cloud-takeable, needs no browser, and its
Accept makes refusing a satisfying outcome.
