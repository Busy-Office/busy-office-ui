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
`landed`, two additional refusals). The work landed as **`e1f5a12f`** (Slice
326), followed by this hand-off's own commit.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

Every figure below was taken `--rev e1f5a12f`, the slice commit — **not** the
working tree and **not** `HEAD`, which is `ENVIRONMENT.md`'s figure rule.

## Rule 3 is OVERDUE for the next wake — read this before dispatching

Counters read **after** recording this wake's row, which is the comparison
`LOOPS.md` mandates:

```
Standardize   0 / 4 Continue rounds    since 2026-09-07 10:47   ok
Objective     4 / 3 slices [307,309,323,326] since 2026-09-07 06:57  OVERDUE
Optimize      1 wake-date newer        since 2026-09-06 16:56   STALE
```

Both moved by exactly what this wake did by hand — the Standardize counter
**reset** (this wake's own Standardize row) and Objective **+1** (Slice 326
closed two items). Nothing anomalous. **Rule 2 no longer matches; rule 3 does**,
so the next wake dispatches **Objective** unless a P0 or new input preempts it.
The grill's material is slices **307, 309, 323, 326**.

**Standardize closing a slice is correct, not a parser artefact** — 279.4
amended 161.4 to include `Polish`, and `Standardize` was already in the set
(12 slices have a Standardize row and no Continue row). Slice 326 is a
Standardize sweep that closed `326.1` and `326.2`, so it counts.

**Rule 5 reads a genuine STALE, so report it as *could not be evaluated*, not
clear.** Unchanged from the last hand-off and not re-derived here beyond the
line itself. **No metric was recorded this wake**, deliberately: `324.2` is
still open on the `GZIP_TOLERANCE_KB = 0.3` convention, and this wake produced
no new measurable the series would accept — its numbers are word counts and
grep hit-counts, not a tracked metric.

**`polish_requeue.py` did NOT run this wake** in any mode — `LOOPS.md` §3b step
0 is owed only once rule 6 is reached, and rule 2 matched first. No stamp
reading from this wake exists to quote.

Of the three advisory checks, only `check:resume-slice-ids` printed. It ran
first from `record_iteration.py` against the **previous** revision of this file,
and was then **re-run against this file as it now stands** — that second reading
is the one below, and it is clean:

```
RESUME.md names 33 id(s)
  4 not in ROADMAP.md at all — archived: 312.2, 158.1, 161.1, 178.3
  2 recorded [x] CLOSED:                 326.1, 326.2
```

**All six are historical references and none is a live claim.** The four
archived ids are cited as the provenance of the verdict list; `326.1`/`326.2`
are what this wake closed and are described as landed, not as queued. The
standing note still applies: **saying that an id is being dropped keeps it
named**, because the check reads backticked ids and cannot tell a historical
reference from a live claim — it says so itself. The charter check and
`--verify-stamps` were silent.

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
/issues?state=open  -> HTTP 200, len 1     #2, updated 2026-09-06T15:10:34Z
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so
Step 1 committed nothing. The red-proof `ENVIRONMENT.md` §8 says is still owed
remains owed — nothing has ever been filed in this repo's Discussions.

**Issue #2's `updated_at` has not moved since the last hand-off**, so it carries
the same single owner triage comment. See Direction.

## What landed this wake — Slice 326, a Standardize sweep, 4 of 4 lanes

Dispatched by **rule 2** at `4 / 4 OVERDUE`. Rule 1 found no open P0
(`grep -cE '^\s*[0-9]+\. \[ \].*P0'` → **0**).

**The finding is in the playbook, not the code.** Lane 3's own *"Verdicts to
date"* line named `158.1` and `161.1` — fifteen pages. `178.3` added a
sixteenth, `/concepts/scale/`, and did not amend it. The two commits are
**twelve hours apart on the same day** and neither names the other:

```
87bf0f54  2026-08-28 07:42:07Z   the clause is written (Slice 169)
e5edf61f  2026-08-28 19:46:14Z   178.3 verdicts /concepts/scale/
git log -S'Verdicts to date' -- LOOPS.md    # ONE commit, never amended since
```

It then read fifteen for **ten days**. Following it literally this wake produced
a **false finding** — `/concepts/scale/` reported as "flagged, carrying no
verdict" — which survived only because the absence was grepped before being
believed.

**Carry this forward, it is the transferable half.** The counts *agreed* — 15
verdicted, 15 flagged — and the sets did not: `/patterns/output-form/` swapped
out as `/concepts/scale/` swapped in. A matching count read as a matching set.
158.1's own entry warns of exactly this (*"the sets are printed, not the counts,
for that reason"*) and it still got through.

**The refused fix matters more than the applied one.** The paragraph directly
above the list says *"name the PROPERTY, not a list of page names"*, which
points a wake at a grep. That grep is a dead detector, re-measured here with the
negative controls no record carries: **15 of 15** flagged pages hit, and **6 of
7** pages carrying no prose verdict hit too — `/patterns/kanban` 13,
`/components/badge` 8, `/getting-started/install` 6, only `/components/tooltip`
reading 0. A mention is not a verdict. So the enumeration stays, `LOOPS.md` now
names all sixteen with their three sources, and **a round recording a new
verdict must amend the list in the same commit**.

**Lanes 1, 2, 4 (`326.2`).** dead-style **0 dead** of 1,272 live inline
attributes; css-repeats **the standing eight exactly**, no delta (totals moved
237→242 rules and 225→230 bodies; the repeat count did not, and the
joined-control x4 group is still two components). Lane 4 read the `ratchet`
block first: no file changed accumulate class.

**Lane 4's region signal was attributed per section, which is 308.1's first
execution since it landed** — and the attribution reversed the reading.
`LOOPS.md` is 13 up since its last cut (`8848ed55`) with the dispatch region
growing faster than the file, but the **section that was cut did not regrow**
(that cut is the loop-table rename, the smallest mover). The four real risers
are sections nothing cut, each a rule that changed: `Step 1` **+371** (302.1),
rule 3 **+303** (279.4), rule 5 **+224** (307.1/306.1), `Step 0` **+151**
(283.2). That is 308.1's second branch verbatim — *do not reach for a cut* — so
none was taken, and the structural question is filed as **`326.3`**.

## `origin/main` did NOT move under this wake

`git fetch origin main` at Step 0 and again immediately before the first commit,
as Step 0c mandates: `7c6f7ecd` both times. No collision.

**Step 0 traps:** trap 1 bit again (detached HEAD, `git branch --show-current`
empty), fixed with `git checkout -B main origin/main` before any commit, and
`origin/main` again arrived as a **forced update** (`26447ba...7c6f7ec`). Trap 2
clean in one `--unshallow` (**2,011** commits, no `shallow.lock`), and it again
brought the tags — the **thirty-ninth** consecutive container to do so;
`git tag | wc -l` → **8**. No `git stash` was used at any point this wake.

## The open set is 28 — no P0, and 13 are cloud-takeable

`roadmap_scope.py --rev e1f5a12f` reports **28 open / 53 closed**, OPEN slices
`[15, 112, 249, 273, 294, 296, 297, 310, 315, 316, 319, 320, 322, 323, 324, 325,
326]`. Net from the last hand-off's 27: two closed (`326.1`, `326.2`) and three
filed (`326.1`, `326.2`, `326.3`), so **Slice 326 has entered the open set** and
nothing left it. The raw counts reconcile exactly: `grep -c` reads 28 open /
**55** closed, and 55 = 53 attributed + the 2 `[x]` under the non-slice
`## STATE` heading.

The 28 were enumerated from the commit rather than carried:
`326.3 325.1 325.2 324.1 324.2 323.1 322.3 320.2 320.3 319.3 316.1 315.3 310.1
310.2 297.1 296.3 294.2 273.2 249.6 249.7 249.9 249.10 249.11 249.12 249.13
112.3 112.4` — 27 numbered, plus Slice 15's unnumbered **AT runtime evidence**.

- **cloud-takeable: 13** — `310.1`, `310.2`, `315.3`, `316.1`, `319.3`,
  `320.2`, `322.3`, `323.1`, `324.1`, `324.2`, `325.1`, `325.2` and the new
  **`326.3`**. (`297.1` is takeable here too but is counted once, under
  input-blocked, because that is what actually gates it.) **`310.1` is still
  the oldest of these** and is what rule 4 reaches — *if* a counter does not
  preempt it, and this wake leaves one that does.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3`, `112.4`, `249.7`, `249.10`, `249.11`, `249.12`, `249.13`, `273.2`,
  `296.3` — and **`294.2`'s brand-mark half**, counted below under
  input-blocked because the folder's absence gates it first.
- **browser-blocked in the SCREENSHOT sense** (a LOCAL wake can take these):
  `249.6`, `249.9`, `320.3`. **`249.6` was declined at the clause level four
  times. Do not re-derive it.**
- **input-blocked (2): `297.1` and `294.2`** — the **fourth kind** `LOOPS.md`
  186.2's three do not cover. Neither was re-measured this wake; the previous
  hand-off's measurements stand and are cited as its, not as this wake's:
  `297.1` waits on a filer who is not the owner, `294.2` on the
  `upstream-contribution/` folder reaching a branch.

13 + 10 + 3 + 2 = 28, asserted rather than left to the reader.

**The fifth kind of blocked, `artifact-lost`, is still worth carrying** — an
item whose Accept says *re-measure* names an artifact, and the artifact either
resolves or it does not. Nothing in the current open set is of that kind,
checked rather than assumed.

## The archive sweep is NOT due, and the share moved AWAY from its trigger

Measured at **`e1f5a12f`**: **6,823 lines**, closed-history share **27.4%**
(1,870 lines across 5 closed slices). The standing trigger is *past 5,450 lines
**and/or** 40.6%*: lines are past, **share is not**. That is precisely the
AND-vs-OR case `249.12` is open on, and it decides something here — under AND,
no sweep.

**The share FELL, 28.2% → 27.4%, while the file grew by 189 lines.** Not a
contradiction and worth naming so it is not read as one: this wake added open
content only, so the denominator grew while the closed-slice numerator did not.
A wake that reaches for a sweep anyway should read `roadmap_scope.py`'s pin line
first — the newest target, **Slice 309, is pinned by `325.1` and `325.2`**, so
it is not eligible under either reading.

Trend across thirty-four readings: 27.5% → 32.0% → 34.2% → 38.0% → 39.4% →
37.5% → 36.9% → 36.2% → 35.5% → 37.3% → 36.9% → 38.3% → 37.6% → 9.4% → 10.3% →
10.9% → 11.8% → 26.0% → 26.9% → 30.5% → 29.5% → 28.9% → 31.2% → 35.3% → 34.7%
→ 36.4% → 38.1% → 40.3% → 39.4% → 39.9% → 41.5% → 24.6% → 28.2% → **27.4%**.

## NOT VERIFIED, said plainly

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.**
**This wake has no visual debt of its own**: the diff is three markdown files
(`LOOPS.md`, `LOOPS-archive.md`, `ROADMAP.md`) and touches no CSS, no page
source and no built layout, so there is nothing in it a screenshot could check.
That is a statement about this diff, not a claim that screenshots were
unnecessary in general.

**Gates green on the committed tree:** core `build`, core `test` (**165** in 29
files), `docs:build`, `check:repo` (run twice — once before the adversarial
re-read and once after; `slice-refs` **952** assertions, 360 citations, **308**
slice numbers each heading one section), `check:claims`, `check:formatting`,
`check:layout` (**127** pages), `test:axe` (**127 × 2**, zero violations), plus
the §3b `docs:build` re-run after this file was written. `check:claims` reports
**170 live · 3 NOT VERIFIED**, which is `ENVIRONMENT.md` §6b's container fact,
not a regression.

**The `verifier` agent is not available in this session**, so `LOOPS.md` §2 step
6's verifier pass was done by hand — each staged diff re-read adversarially.
That is what caught **two errors before they landed**, and both are the kind
this repo's doctrine predicts:

- a **date read from prose rather than from the commit**: the entry said 178.3
  landed on 2026-08-29, "nine days" earlier. `git log` puts it at 2026-08-28
  19:46:14Z — *twelve hours* after the clause, and ten days before this wake.
  The corrected fact is sharper than the wrong one.
- an **unsupported claim about another wake's work**: the draft said the
  controls were ones "228.1's reading lacked". The record shows only that no
  control is recorded, which is what both files now say.

**The visual debts carried forward are unchanged and unspent** — this wake added
none: `292.4/292.5`'s screenshot lane on `/components/icon`, now eighteen wakes
back; the withdrawn-claim paragraph and Slice 325's performance paragraph on
`/components/data-table`; Slice 319's paragraph on `/patterns/kanban` at 390px;
and `320.3`'s `ApiTable.astro` `0.5rem` against `ClassRef.astro` `.4rem`.
**A local wake should glance at all four.**

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were
read** (issues **1** open, discussions **0** open).

**Three things want the owner's attention; all three are carried from the last
hand-off unchanged, and none was re-measured this wake.**

1. **Issue #2 is open and carries only the triage comment.** Slice 317 refuses
   the component with the measurement; Slice 319 corrected a second false claim
   on the same page the reporter was pointing at, which strengthens their report
   rather than weakening it. **Replying and closing the issue is a thirty-second
   owner action.** Whether a *wake* should post that comment is `297.1`, which
   stays open until someone who is not the owner files something — a function of
   the package having adopters, not of anything a wake can do.
2. **`294.2` still cannot be advanced by anyone but the owner.** The six
   proposals it ranks live in an owner-supplied zip that never reached the repo.
   **Landing `upstream-contribution/` on a branch is a one-command unblock.**
   Not re-checked this wake; the previous hand-off found nothing under `ls` or
   `git ls-files`.
3. **`273.2` is still worth their attention**, a thirty-second call untouched —
   whether a Polish round whose score does not move should increment `dry`. Not
   touched this wake; rule 6 was never reached.

**`249.12` stays a live question and is now sharper.** This wake is the second
consecutive one where the two halves of the archival trigger DISAGREE — lines
past, share not — so AND and OR give different answers and the item decides
something. It is still not urgent, because the newest target is pinned either
way.

**`326.3` is new and is the one a wake could take next without the owner.** The
dispatch region of `LOOPS.md` — everything a wake reads before deciding
anything — is **6,759 words** and grew **+1,101 in two days**, entirely in
sections carrying rules that changed. There is no narrative left in it to cut,
so the usual answer does not apply. The item asks what the answer is when the
region grows because the *rules* grew, and records that "accept it and say so"
is a legitimate outcome that would retire lane 4's recurring `by region`
finding.
