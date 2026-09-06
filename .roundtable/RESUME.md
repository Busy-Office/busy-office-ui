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
at hand-off. **Two commits this wake** — the Slice 315 grill and this rewrite —
and **one iteration recorded**, `Objective · grill`, with one refusal.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## The standing environment fact: CI HAS NO `paths-ignore`

`312.2` removed it entirely. **A push that touches only `.roundtable/**` runs
the full suite.** The consequence a wake feels directly is `ENVIRONMENT.md` §3b
— *re-run `npm run docs:build` after writing this file, before pushing* — and it
was executed this wake, after this file was written, before the push.

**This wake found what that removal also did, and it had been true for two
days:** `check-ci-ignores.mjs` correctly no-ops when there is no `paths-ignore`,
and its `--self-test` sat **below** that early return. See Slice 315.

## This hand-off reports what it measured; it does NOT predict the next dispatch

Counters read **after** recording this wake's row, which is the comparison
`LOOPS.md` mandates:

```
Standardize   0 / 4 Continue rounds  since 2026-09-06 22:53   ok
Objective     0 / 3 slices           since 2026-09-06 23:47   ok
Optimize      STALE
```

**This wake's row RESET Objective's counter (4 / 3 → 0 / 3) and did NOT move
Standardize's**, which is the comparison that has found two of the five parser
recurrences, and both readings are the expected ones: an `Objective` row resets
rule 3 by construction, and rule 2 counts **Continue** rounds, which an
`Objective` row is not. **Re-run `dispatch_status.py` rather than trusting these
three lines** — they are a reading taken at hand-off, and the file's charter is
that it reports what it measured and does not predict.

`grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` reads **0**, so rule 1 does not
match.

**Rule 5 is reported as *could not be evaluated*, never clear.** No metric was
recorded this wake. `306.1` explains why a cloud wake cannot drive that line to
`ok` by recording more; do not try. `bundle-gz-kb` still cannot be sampled
(`259.1`, carried forward, not re-run).

**`polish_requeue.py` did NOT run this wake** in any mode — `LOOPS.md` §3b step
0 is owed only once rule 6 is reached, and rule 3 matched first. No stamp
reading from this wake exists to quote.

Of the three advisory checks that run from `record_iteration.py`, only
`check:resume-slice-ids` printed, against the *previous* revision of this file.
**The ids it named are deliberately not quoted** — naming them makes the check
fire on *this* revision for ids it holds only because it is quoting the check, a
report sustaining itself forever. The previous revision is one `git show` away.
The charter check and `--verify-stamps` were silent.

## Step 1 — both intakes read, with the controls ENVIRONMENT.md §8 names

`gh` is still absent and the Discussions GraphQL route still refused, so the
REST substitute was used, with both controls in the same run:

```
/discussions        -> HTTP 200, len 0     the reading
/not-a-real-route   -> HTTP 404            an unserved route does NOT answer 200 []
/issues?state=open  -> HTTP 200, len 1     #2, already triaged as 300.2
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so
Step 1 committed nothing. The red-proof ENVIRONMENT.md §8 says is still owed
remains owed — nothing has ever been filed in this repo's Discussions.

## What landed this wake

**Slice 315**, dispatched by **rule 3** (Objective `4 / 3`, OVERDUE, un-reached
for two consecutive wakes). Rules 4-8 were not reached.

**Scope narrowed per §6 step 0.** Armed set `[292, 294, 312, 314]`; **292
dropped** — Slice 298 grilled it in full and a *second* pass over it exists
(`grill-objective-292-293-295-second-pass-2026-09-06.md`). 294, 312 and 314 are
named by no grill in either roadmap file or in `.roundtable/`. 312's items were
built by Slice 313, so 313 was read inside 312's scope.

**21 of 23 re-run assertions reproduce exactly**, including every one of 314's
token and scope claims and every structural claim in 312/313. Report:
`.roundtable/grill-objective-294-312-314-2026-09-07.md`.

**`315.1` landed — the live defect.** 312.2 emptied `paths-ignore`, so
`check-ci-ignores.mjs` exits 0 at *"nothing to verify"* (line 219), **above** its
`--self-test` branch (line 293). For two days `--self-test` ran **0 of 18 cases**
and exited 0 with a deliberately wrong fixture present; the docs-image SKIP path
was a second route to the same silence. `check:selftests` went on reporting
`20 heuristic (all self-tested)` because it asserts the argv branch **exists**,
not that anything reaches it — its own header records closing *mention →
implementation*; this is *implementation → reachable*.

Fixed by moving the block above the `ci.yml` read (all five detector helpers are
hoisted `function` declarations above it, so nothing else reordered).
**Red-proved in both directions and in both dead contexts**, injection confirmed
by a `ZZINJECTED` marker + `grep -c -F` before every run:

| tree state | wrong fixture | before | after |
|---|---|---|---|
| shipped (no `paths-ignore`) | yes | rc=0, **0 cases** | rc=1, **18** |
| shipped | no | rc=0, 0 cases | rc=0, **18** |
| `ci.yml` absent (docs image) | yes | rc=0 | **rc=1** |
| `paths-ignore` restored + control | yes | rc=1, 18 | rc=1, 18 |

**The first red-proof attempt was discarded**, per CLAUDE.md: its `grep -c`
control carried nested quotes and returned 0, so that run proved nothing about
the injection.

**`315.2` landed — an audit-trail defect, verdict unchanged.** 294's *"139 hex
literals"* carries no command and is unreproducible: six spellings at 294's own
commit `c6643153` return 142, 142, 123, 141, 114, 134, identical at `HEAD`, so it
is not snapshot drift. 294 amended in place with the command and both readings.

**`315.3` filed, not built — and it is this wake's refusal.** Whether
`check:selftests` should EXECUTE each self-test rather than grep for the branch.
**Base rate 1 of 20, and it took two wrong readings to get there** — 8 of 20
(measured with **no `dist`**; four gates died before their own branch) and 4 of
20 (counted `^self-test: `, one output format, missing three gates that report in
their own). There is no single parseable output shape today, so executing them
means either a marker contract across 20 gates or asserting on exit code alone —
which cannot tell *"ran 18, all passed"* from *"ran none"*, i.e. would not have
caught `315.1`.

**Gates green on the committed tree:** all **17** cloud-runnable entry points
(`ENVIRONMENT.md`'s derived list), plus the §3b re-run of `docs:build` after this
file was written.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots — a cloud
wake has no Podman. Nothing in this slice renders: the diff is one gate script's
statement order, roadmap prose and a `.roundtable/` report.
**`292.4/292.5`'s screenshot lane on `/components/icon` remains unspent**, now
from seven wakes back, and the withdrawn-claim paragraph on
`/components/data-table` is still unlooked-at.

## `origin/main` did NOT move under this wake

`git fetch origin main` at Step 0 and again immediately before the first commit,
as Step 0c mandates: `35c1da7` both times. No collision.

**Step 0 traps:** trap 1 bit again (detached HEAD, `git branch --show-current`
empty), fixed with `git checkout -B main origin/main` before any commit, and
`origin/main` again arrived as a **forced update** (`26447ba...35c1da7`). Trap 2
clean in one `--unshallow` (**1,983** commits, no `shallow.lock`), and it again
brought the tags — the **twenty-eighth** consecutive container to do so;
`git tag | wc -l` → **8**. Trap 1c did not bite. No `git stash` was used.

## The open set is 26 — no P0, and 13 are cloud-takeable

`roadmap_scope.py` reports **26 open / 49 closed**, OPEN slices
`[15, 112, 249, 273, 294, 296, 297, 298, 300, 304, 305, 306, 307, 309, 310, 314,
315]`. Net from the last hand-off's 25: **+3 filed (`315.1`, `315.2`, `315.3`),
2 of them closed in the same wake**, so **+1 open**. **The raw counts reconcile
exactly**: `grep -c` reads 26 open / **51** closed, and 51 = 49 attributed + the
2 `[x]` under the non-slice `## STATE` heading.

- **cloud-takeable: 13** — `294.2`, `298.1`, `300.2`, `304.1`, `305.1`,
  `305.2`, `306.1`, `307.1`, `309.5`, `310.1`, `310.2`, `314.2`, `315.3`.
  (`297.1` is takeable here too but is counted once, under input-blocked,
  because that is what actually gates it.) **`294.2` is the oldest of these and
  has gone eleven hand-offs classified from Slice 294's triage text rather than
  from its own body** — its Accept says the brand mark inside it is an **owner
  call**, so read it before dispatching. **`305.1` carries a caveat, from its own
  Accept**: the four defects close by re-measuring ink extents and inter-block
  gaps, which is geometry and squarely in `ENVIRONMENT.md`'s *can* list — but it
  sits inside a Gauntlet whose scoring wants a blind critic, so a wake without
  one closes the measurement half and must say so rather than claiming the round.
  **`309.5`, `310.2`, `314.2` and `315.3` are the cheapest**: `309.5` is a script
  plus a start command and its Accept lets *refusing to commit a probe* close it;
  `310.2` closes by deleting five unused consts; `314.2` is filed with its base
  rates already measured; `315.3`'s Accept says outright that **refusing is a
  satisfying outcome** and names the re-measurement that must precede either
  answer (re-run the per-gate `--self-test` sweep **with `dist` built**, reading
  each gate's raw output rather than grepping one format — that is the exact
  mistake this wake made twice).
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3`, `112.4`, `249.7`, `249.10`, `249.11`, `249.12`, `249.13`, `273.2`,
  `296.3`.
- **browser-blocked in the SCREENSHOT sense** (a LOCAL wake can take these):
  `249.6`, `249.9`. **`249.6` was declined at the clause level four times. Do not
  re-derive it.**
- **input-blocked (1): `297.1`** — the **fourth kind** `LOOPS.md` 186.2's three
  do not cover. It stays open because both filed issues came from the owner's
  own agent, so the router was never tested.

13 + 10 + 2 + 1 = 26, asserted rather than left to the reader, and reconciled
against `grep -nE '^\s*[0-9]+\. \[ \]' ROADMAP.md` rather than against this list
— the 26 lines it prints are exactly the ones named above.

## No archive sweep — declined on the SHARE half, fifth wake running

Measured on the working tree after Slice 315 was written (`roadmap_scope.py`):
**6,556 lines**, closed-history share **28.9%** (1,892 lines across 9 closed
slices). The standing trigger the hand-offs carry is *"past 5,450 lines /
40.6%"*: the line half is past, the share half is not — the same judgement the
last four wakes made, at 26.0%, 26.9%, 30.5% and 29.5%. **It went DOWN again**
(29.5% → 28.9%) by the same mechanism the last hand-off named: the numerator did
not move and the denominator grew by 152 lines of new open slice. Two
consecutive readings falling for that reason is the argument `249.12` needs.

Trend across twenty-three readings: 27.5% → 32.0% → 34.2% → 38.0% → 39.4% →
37.5% → 36.9% → 36.2% → 35.5% → 37.3% → 36.9% → 38.3% → 37.6% → 9.4% → 10.3% →
10.9% → 11.8% → 26.0% → 26.9% → 30.5% → 29.5% → **28.9%**.

**What a sweep would take, so the next wake need not re-derive it:**
`roadmap_scope.py` reports the pins itself — **292 is now pinned by four open
items** (`315.3`, `314.2`, `310.1`, `310.2`) and **283 by `273.2`** (236.2), and
315 is this wake's own. That leaves **313, 312, 311, 308, 303, 302, 301** —
seven slices, a bulk edit, and CLAUDE.md's rule says it is verified against the
rendered artefact one slice at a time. It is a wake's work, not a tail-end tidy.

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were
read** (issues **1** open, already triaged; discussions **0** open).

**Three things want the owner's attention:**

1. **`249.12` — the archival trigger — is the same owner call as the last four
   wakes, and this wake produced a SECOND consecutive reading that shows why.**
   The share half moved down again (29.5% → 28.9%) with nothing archived, purely
   because a new open slice enlarged the denominator. A trigger whose two halves
   disagree, and one of which moves the wrong way when the file grows, cannot be
   satisfied by waiting. Nothing states whether the trigger is an AND or an OR.
   A wake declining a sweep on that ambiguity five times is the signal that the
   trigger needs deciding, not that the sweep needs doing.

2. **`273.2` is the owner call still worth their attention**, a thirty-second
   wake untouched — whether a Polish round whose score does not move should
   increment `dry`. Not touched this wake; rule 6 was never reached.

3. **The CI cost `312.2` accepted is unchanged and unmeasured this wake.** Slice
   313 measured 9 of the last 30 commits and 38 of the last 100 touching only
   `.roundtable/**`-shaped paths, at ~14.7 machine-minutes a run, and proposed a
   cheap second workflow — refused there because it needs a hand-kept list of
   which gates are repo-wide. Carried forward as the owner's call, **not
   re-measured here**, so treat those figures as Slice 313's.
