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
two additional refusals). The work landed as **`ac0fc752`** (Slice 327),
followed by this hand-off's own commit.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

Every figure below was taken at **`ac0fc752`**, the slice commit — **not** the
working tree and **not** `HEAD` once this hand-off commits, which is
`ENVIRONMENT.md`'s figure rule.

## Rule 3 is SPENT; rule 4 is what the next wake reaches

Counters read **after** recording this wake's row, which is the comparison
`LOOPS.md` mandates:

```
Standardize   0 / 4 Continue rounds    since 2026-09-07 10:47   ok
Objective     0 / 3 slices             since 2026-09-07 11:48   ok
Optimize      1 wake-date newer        since 2026-09-06 16:56   STALE
```

Both moved by exactly what this wake did by hand — Objective **reset** by this
wake's own grill row, Standardize untouched (no Continue round ran). Nothing
anomalous. **Rules 2 and 3 no longer match**, so the next wake falls to **rule
4** unless a P0 or new input preempts it. Its oldest cloud-takeable item is
still **`310.1`**.

**Rule 5 reads a genuine STALE, so report it as *could not be evaluated*, not
clear.** Unchanged from the last hand-off and not re-derived here beyond the
line itself. **No metric was recorded this wake**, deliberately: `324.2` is
still open on the `GZIP_TOLERANCE_KB = 0.3` convention, and this wake produced
no new measurable the series would accept — its numbers are reproductions of
other slices' figures, not a tracked metric.

**`polish_requeue.py` did NOT run this wake** in any mode — `LOOPS.md` §3b step
0 is owed only once rule 6 is reached, and rule 3 matched first. No stamp
reading from this wake exists to quote.

Of the three advisory checks, only `check:resume-slice-ids` printed, and it ran
against the **previous** revision of this file (33 ids, 4 archived, 2 closed).
Everything it named there was historical. The charter check and
`--verify-stamps` were silent. **The standing note still applies: saying that an
id is being dropped keeps it named**, because the check reads backticked ids and
cannot tell a historical reference from a live claim — it says so itself.

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

## What landed this wake — Slice 327, an Objective grill of 309, 323 and 326

Dispatched by **rule 3** at `Objective 4 / 3 OVERDUE [307, 309, 323, 326]`.
Rule 1 found no open P0 (**0**); rule 2 read `0 / 4 ok`. **307 was dropped** per
§6 step 0 — Slice 309 grilled it in full, and 309 is itself in the arming set.

**75 assertions re-derived by running the command, not by reading the slice:
49 in Slice 326, 9 in Slice 323, 17 in Slice 309. 74 reproduce.** Slices 326 and
323 are clean end to end — including 326's whole per-section region table
(`Step 0c` flat at **936**, the row its "not regrowth" verdict rests on) and
323's two replays, both the one it shipped (`958 revisions -> 581 STALE, 323 ok,
51 SKEW`, seven occasions) and the one it refused (`26 wake-dates, 13 ok / 13
STALE, zero SKEW`). The full command list is in
`.roundtable/grill-objective-309-323-326-2026-09-07.md`.

**`327.1` — the one false assertion.** Slice 309 published *"/movements, /inbox
and /receive were unaffected: each runs its own inline `initDataTables()`"*.
Only `/movements` does (`server.mjs:1006`, the file's only inline call);
`/receive` and `/inbox` run none and each renders one
`.bo-data-table-container`, the element `initDataTables` binds, so both were
**unbound for the same 15 days**. They were unaffected regardless — neither
carries a select-all or a row-select, so `bindContainer`'s listeners had no
surface. Corrected in Slice 309's own text under 236.2.

**`327.2` — the negative control that named its own subject.** All seven of
`326.1`'s controls reproduce at `7c6f7ecd` and **none** at `e1f5a12f`:
`/components/tooltip` read 0, and its only occurrence in the two roadmap files
is now the line recording that zero, so the published command reads **7 of 7**
from its own commit onward. `LOOPS.md`'s lane 3 now pins the revision and
carries the rule. Ten lines, added **below `## Playbooks`**, so the dispatch
region `326.3` is open about does not move — verified, not assumed.

**Carry this forward, it is the transferable half.** Both defects, and those of
the three previous grills (`322`, `319`, `291`), are the same shape: a correct
measured number with an unmeasured sentence beside it, shipped under the
number's credibility. CLAUDE.md's 192.1 already states the rule that catches it
and did not fire in any of the four. That is filed as **`327.3`**.

## This wake's own two errors, recorded rather than quietly fixed

- **It first wrote that trap 1 had NOT bitten this container**, on the strength
  of `git rev-parse HEAD origin/main` agreeing at Step 0. `git branch
  --show-current` was **empty** and local `main` was stale at the pre-rebase
  `26447ba9` — `ENVIRONMENT.md` §1's named false comfort, published for a moment
  inside a grill about unmeasured sentences. Fixed with `git checkout -B main
  origin/main` before any commit.
- **It nearly filed Slice 308's and Slice 326's identical `was` columns as an
  identical-value-across-inputs tell.** `git log -1 8848ed55` settles it — the
  two tables share a base commit, because `8848ed55` **is** 274.2's cut. A
  suspicion is not a finding until the cheaper explanation is excluded.

## `origin/main` did NOT move under this wake

`git fetch origin main` at Step 0 and again immediately before the first commit,
as Step 0c mandates: `48e181a3` both times. No collision.

**Step 0 traps:** trap 1 bit again (see above). Trap 2 clean in one
`--unshallow` (**2,013** commits, no `shallow.lock`), and it again brought the
tags — the **fortieth** consecutive container to do so; `git tag | wc -l` → **8**.
No `git stash` was used at any point this wake.

## The open set is 29 — no P0, and 14 are cloud-takeable

`roadmap_scope.py` at `ac0fc752` reports **29 open / 55 closed**, OPEN slices
`[15, 112, 249, 273, 294, 296, 297, 310, 315, 316, 319, 320, 322, 323, 324, 325,
326, 327]`. Net from the last hand-off's 28: two closed (`327.1`, `327.2`) and
three filed (`327.1`, `327.2`, `327.3`), so **Slice 327 has entered the open set**
and nothing left it. The raw counts reconcile exactly: `grep -c` reads 29 open /
**57** closed, and 57 = 55 attributed + the 2 `[x]` under the non-slice
`## STATE` heading.

- **cloud-takeable: 14** — `310.1`, `310.2`, `315.3`, `316.1`, `319.3`,
  `320.2`, `322.3`, `323.1`, `324.1`, `324.2`, `325.1`, `325.2`, `326.3` and the
  new **`327.3`**. (`297.1` is takeable here too but is counted once, under
  input-blocked, because that is what actually gates it.) **`310.1` is still the
  oldest of these** and is what rule 4 reaches next, with no counter left to
  preempt it.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3`, `112.4`, `249.7`, `249.10`, `249.11`, `249.12`, `249.13`, `273.2`,
  `296.3` — and **`294.2`'s brand-mark half**, counted below under input-blocked
  because the folder's absence gates it first.
- **browser-blocked in the SCREENSHOT sense** (a LOCAL wake can take these):
  `249.6`, `249.9`, `320.3`. **`249.6` was declined at the clause level four
  times. Do not re-derive it.**
- **input-blocked (2): `297.1` and `294.2`** — the **fourth kind** `LOOPS.md`
  186.2's three do not cover. Neither was re-measured this wake; the previous
  hand-off's measurements stand and are cited as its, not as this wake's:
  `297.1` waits on a filer who is not the owner, `294.2` on the
  `upstream-contribution/` folder reaching a branch.

14 + 10 + 3 + 2 = 29, asserted rather than left to the reader.

**The fifth kind of blocked, `artifact-lost`, is still worth carrying** — an
item whose Accept says *re-measure* names an artifact, and the artifact either
resolves or it does not. Nothing in the current open set is of that kind,
checked rather than assumed.

## The archive sweep is NOT due, and the share moved AWAY from its trigger again

Measured at **`ac0fc752`**: **7,001 lines**, closed-history share **26.9%**
(1,880 lines across 5 closed slices). The standing trigger is *past 5,450 lines
**and/or** 40.6%*: lines are past, **share is not**. That is precisely the
AND-vs-OR case `249.12` is open on, and it decides something here — under AND,
no sweep. **Third consecutive wake where the two halves disagree.**

**The share FELL again, 27.4% → 26.9%, while the file grew by 178 lines** — same
mechanism as last wake and worth naming so it is not read as a contradiction:
this wake's Slice 327 is OPEN (it carries `327.3`), so none of its 178 lines
enter the numerator. The numerator's **+10** (1,870 → 1,880) is entirely
`327.1`'s amendment to Slice 309 — a closed slice, and one of the five the
figure counts. Checked against the edit rather than attributed to the new slice,
which was this note's first, wrong reading. A wake
that reaches for a sweep anyway should read `roadmap_scope.py`'s pin line first
— the newest target, **Slice 309, is pinned by `325.1` and `325.2`**, and Slice
309 is now also amended by `327.1`, so it is not eligible under any reading.

Trend across thirty-five readings: 27.5% → 32.0% → 34.2% → 38.0% → 39.4% →
37.5% → 36.9% → 36.2% → 35.5% → 37.3% → 36.9% → 38.3% → 37.6% → 9.4% → 10.3% →
10.9% → 11.8% → 26.0% → 26.9% → 30.5% → 29.5% → 28.9% → 31.2% → 35.3% → 34.7%
→ 36.4% → 38.1% → 40.3% → 39.4% → 39.9% → 41.5% → 24.6% → 28.2% → 27.4% →
**26.9%**.

## NOT VERIFIED, said plainly

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.**
**This wake has no visual debt of its own**: the diff is three markdown files
(`ROADMAP.md`, `LOOPS.md`, the grill report) and touches no CSS, no page source
and no built layout, so there is nothing in it a screenshot could check. That is
a statement about this diff, not a claim that screenshots were unnecessary in
general.

**Gates green on the committed tree:** core `build`, core `test` (**165** in 29
files), `lint:css`, `docs:build` (`check:repo` — `slice-refs` **953**
assertions / 360 citations / **309** slice numbers each heading one section,
`floor` 587 files, `vendor-names` 610 files), `check:claims`,
`check:formatting`, `check:layout` (**127** pages), `test:axe` (**127 × 2**,
zero violations), `check:po-app` (**20** behaviours), plus the §3b `docs:build`
re-run after this file was written. `check:claims` reports **170 live · 3 NOT
VERIFIED**, which is `ENVIRONMENT.md` §6b's container fact, not a regression.

**The `verifier` agent is not available in this session**, so `LOOPS.md` §2 step
6's verifier pass was done by hand — each staged diff re-read adversarially.
That is what caught the trap-1 claim above, before it landed.

**The visual debts carried forward are unchanged and unspent** — this wake added
none: `292.4/292.5`'s screenshot lane on `/components/icon`, now nineteen wakes
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
   stays open until someone who is not the owner files something.
2. **`294.2` still cannot be advanced by anyone but the owner.** The six
   proposals it ranks live in an owner-supplied zip that never reached the repo.
   **Landing `upstream-contribution/` on a branch is a one-command unblock.**
   Not re-checked this wake.
3. **`273.2` is still worth their attention**, a thirty-second call untouched —
   whether a Polish round whose score does not move should increment `dry`. Not
   touched this wake; rule 6 was never reached.

**`249.12` stays a live question and is now sharper still** — a third
consecutive wake where the two halves of the archival trigger DISAGREE (lines
past, share not), so AND and OR give different answers. Still not urgent,
because the newest target is pinned either way.

**`326.3` and `327.3` are the two a wake could take next without the owner**,
and they are related: `326.3` asks what to do when the dispatch region grows
because the RULES grew; `327.3` asks why an existing rule (192.1's per-claim
instrument line) is not being executed, and refuses a gate in advance. Answering
`327.3` with *"the rule is fine, the practice is the gap, build nothing"* is an
explicitly satisfying outcome — which is the one shape of answer that would
close an item without adding a word to any rule file.
