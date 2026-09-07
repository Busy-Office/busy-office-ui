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
at hand-off. **One iteration recorded**: `Objective · grill` (outcome `logged`,
two refusals) and **no metric** — see rule 5 below for why recording one would
have moved nothing. The work landed as **`534b097a`**, followed by this
hand-off's own commit.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

Every figure below was taken at **`534b097a`**, the slice commit — **not** the
working tree and **not** `HEAD` once this hand-off commits, which is
`ENVIRONMENT.md`'s figure rule.

## ⚠ THIS WAKE LOST A COLLISION. READ THIS BEFORE THE COUNTERS

**Collision #3** (Step 0c), and the first one to be recorded from the loser's
side while it was still recoverable. Both dispatchers were armed by the same
`Objective 3 / 3 OVERDUE [310, 328, 329]`, ran the same grill, and reached the
**same primary finding**. The other landed first:

```
git fetch origin main   (Step 0)                        8ef9b944
git fetch origin main   (immediately before 1st commit) 8ef9b944..5ccdea93
  19fc0045  Slice 330: grill of 310, 328, 329 — a refusal rested on an unstable sample
  5ccdea93  Slice 331: 294.2 — fix the input block, then rank all six proposals
```

**The mandated pre-commit fetch caught it before this wake had made any
commit**, so nothing was pushed and nothing was rejected. The duplicated work —
a full grill report and a page-header correction — was **discarded**, and the
winner's version is the record. `LOOPS.md` Step 0c now carries the collision as
an enumeration rather than the snapshot *"it has happened once"*, which entered
at `15ab347b` and stood unedited for ten days.

**The durable lesson, written into Step 0c: rule 3 collides harder than rule 4.**
Rule 4 hands two dispatchers the same *item*; rule 3 hands them the same *arming
set*, so they duplicate a whole wake. Recorded, not fixed.

**Two of this wake's own instrument errors are recorded in Slice 330 rather
than buried**, because the winner got both right:

- its census read **42 components** against the winner's 39, because it
  enumerated `readdir(dist/components)` and swallowed **`demos/` and `nav/`** —
  a population taken from a directory listing instead of from `api.nav`.
- it scored **8 `<h2>` as 8 groups**; `COMPONENT_GROUPS` is **7** and the eighth
  heading is the `Related` footer.

## What landed — the one finding the winner did not make

Slice 328 re-publishes a figure banked from `249.6` — *"the anchored predicate
the item banked (17 of 31)"* — with **no command beside it**, and *"31
learning-path pages"* names a corpus that does not exist:

| reading | count |
|---|---|
| source `.astro` under gs+concepts+base | 18 of **30** |
| `check-learning-path`'s OWN `ON_PATH` (`getting-started\|concepts`) | 16 of **24** |
| built pages, gs+concepts+base | 18 of **30** |
| built pages, gs+concepts+base, **`skipRedirects: false`** | 18 of **31** ✓ |

Only the fourth resolves it, needing two undisclosed choices at once. The **+1
is drift** (30 of the 31 pages changed since `856ede33`; the corpus size did
not move), and `17/31` is the `55%` printed beside it — so review could not
catch it and only re-running could. **The conclusion is untouched**: 18/31,
18/30 and 16/24 all discriminate. Amended into the landed Slice 330 per 236.2,
with **no new item** — the remedy is already that slice's own, and the gate over
it is already refused there.

## Rule 2 is what the next wake reaches — NOT rule 4

Counters read **after** recording this wake's row, which is the comparison
`LOOPS.md` mandates:

```
Standardize   4 / 4 Continue rounds    since 2026-09-07 10:47   OVERDUE
Objective     0 / 3 slices             since 2026-09-07 14:01   ok
Optimize      0 wake-date(s) newer     since 2026-09-07 12:59   ok
```

Objective reset `3 -> 0` by this wake's own row, which is exactly what it should
do. **Standardize crossed to `4 / 4` OVERDUE**, so unless a P0 or new input
preempts it, **the next wake dispatches rule 2, Standardize — not rule 4.** Run
its four lanes and say `n of 4` in the write-up; four consecutive sweeps ran
three and never named lane 4.

**Rule 5 is `ok`, not STALE, and no metric was recorded this wake on purpose.**
The comparable set's only mover is `claims`, whose day-pair is already
`2026-09-06 169 -> 2026-09-07 170 +1`. This wake's `check:claims` read **170**
again — the *same day* as the existing sample, so a second `claims=170` is not a
second run and would move nothing. `axe-violations` reads `NEVER MOVED` and
cannot fire the rule either way. **Rule 5 was therefore EVALUATED and does not
fire.**

**`polish_requeue.py` was not run in `--apply` mode** — §3b step 0 is owed only
once rule 6 is reached, and rule 3 matched first.

## The standing environment fact: CI HAS NO `paths-ignore`

`312.2` removed it entirely. **A push that touches only `.roundtable/**` runs
the full suite.** The consequence a wake feels directly is `ENVIRONMENT.md` §3b
— *re-run `npm run docs:build` after writing this file, before pushing* — and it
was executed this wake, after this file was written, before the push.

## CHECK CI AFTER PUSHING

`main` was green at the start of this wake. Read the runs after your push; one
`actions/runs?branch=main` read costs nothing and is the only thing standing
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
Step 1 committed nothing. The red-proof `ENVIRONMENT.md` §8 still owes remains
owed — nothing has ever been filed in this repo's Discussions.

**Issue #2's `updated_at` has not moved since the last hand-off.** See Direction.

## `RESUME.md` went two slices stale under the previous wakes, and that is worth knowing

`623c98d9` (Slice 328) and `8ef9b944` (Slice 329) both landed **without
rewriting this file**, so the handover this wake read described the tree at
`74ee3860`. Its *"In flight: nothing"* was still true and its open-set figures
were two slices out. That is survivable exactly because this file tells the next
wake to reconcile against `ROADMAP.md` first — which is what happened. **Not
filed as a defect**; recorded so a wake seeing the same gap does not treat a
stale open set as a finding.

## Step 0 traps

Trap 1 bit — `git branch --show-current` was **empty** and the fetch reported a
forced update `26447ba...8ef9b94`, so the local ref was both detached and stale.
Fixed with `git checkout -B main origin/main` before any commit. Trap 2 clean in
one `--unshallow` (**2,019** commits, no `shallow.lock`), and it again brought
the tags — the **forty-second** consecutive container to do so; `git tag | wc -l`
→ **8**. No `git stash` was used at any point.

## The open set is 28 — no P0, and 16 are cloud-takeable

`roadmap_scope.py` at `534b097a` reports **28 open / 62 closed**, OPEN slices
`[15, 112, 249, 273, 296, 297, 310, 315, 316, 319, 320, 322, 323, 324, 325, 326,
327, 328, 330, 331]`. Slice 294 left the OPEN list (`294.2` closed by Slice
331); 330 and 331 entered. The raw counts reconcile: `grep -c` reads 28 open /
**64** closed, and 64 = 62 attributed + the 2 `[x]` under the non-slice
`## STATE` heading.

**Enumerated, not carried from the last hand-off** — the previous classification
was re-derived item by item because three of its entries have since closed:

- **cloud-takeable: 16** — `310.2`, `315.3`, `316.1`, `319.3`, `320.2`,
  `322.3`, `323.1`, `324.1`, `324.2`, `325.1`, `325.2`, `326.3`, `327.3`,
  `328.1`, `330.1`, `331.1`. **`310.2` is still the oldest of these**; read its
  Lane line first — it is cloud-takeable **in its delete form** only.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3`, `112.4`, `249.7` (owner-blocked *in substance*, per Slice 329 — its
  first Accept clause is executed and the rest waits on `249.10`), `249.10`,
  `249.11`, `249.12`, `249.13`, `273.2`, `296.3`.
- **browser-blocked in the SCREENSHOT sense (1):** `320.3`. **`249.6` and
  `249.9` are gone from this bucket — both were built and closed by local wakes
  (Slices 328 and 329).** Four consecutive cloud wakes had reported them as
  blocked; the local wakes took them the same day, which is `LOOPS.md` 186.2's
  point landing again.
- **input-blocked (1): `297.1`** — waits on a filer who is not the owner.
  `294.2` has left this bucket: Slice 331 fixed the input block rather than
  reporting it.

16 + 10 + 1 + 1 = 28, asserted rather than left to the reader.

**The fifth kind of blocked, `artifact-lost`, is still worth carrying** — an
item whose Accept says *re-measure* names an artifact, and the artifact either
resolves or it does not. Nothing in the current open set is of that kind,
checked rather than assumed.

## The archive sweep is NOT due, and the two halves disagree for the FIFTH wake

Measured at **`534b097a`**: **7,568 lines**, closed-history share **27.8%**
(2,102 lines across 7 closed slices). The standing trigger is *past 5,450 lines
**and/or** 40.6%*: lines are past, **share is not**. That is precisely the
AND-vs-OR case `249.12` is open on, and it decides something here — under AND,
no sweep. **Fifth consecutive wake where the two halves disagree.**

The share ROSE this time (26.4% → 27.8%) rather than falling, and the mechanism
is worth naming: the numerator moved 1,880 → 2,102 because **Slice 329 closed
and entered it**, while the denominator grew by the three slices landed today.
A wake reaching for a sweep should read `roadmap_scope.py`'s pin line first —
**10 targets are named by a still-open item**.

Trend across thirty-seven readings: 27.5% → 32.0% → 34.2% → 38.0% → 39.4% →
37.5% → 36.9% → 36.2% → 35.5% → 37.3% → 36.9% → 38.3% → 37.6% → 9.4% → 10.3% →
10.9% → 11.8% → 26.0% → 26.9% → 30.5% → 29.5% → 28.9% → 31.2% → 35.3% → 34.7%
→ 36.4% → 38.1% → 40.3% → 39.4% → 39.9% → 41.5% → 24.6% → 28.2% → 27.4% →
26.9% → 26.4% → **27.8%**.

## NOT VERIFIED, said plainly

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.**
**This wake adds NO visual debt of its own**: both files it committed are
markdown, and the one source edit it had drafted (the catalogue page header) was
discarded in favour of the winner's. Nothing rendered changed.

**Gates green on the committed tree:** all **17** CI-runnable entry points,
re-derived from `ci.yml` with the grep `ENVIRONMENT.md` mandates rather than
read off its snapshot — core `build`, core `test`, `lint:css`, `docs:build`
(`check:repo`), `check:claims` (**170** live · 3 NOT VERIFIED, which is
`ENVIRONMENT.md` §6b's container fact, not a regression), `check:formatting`,
`check:scroll` (914 containers / 118 pages × 2), `check:layout` (**128** pages
— up from 127, Slice 329's front door), `check:forced-colors`, `test:axe`
(**128 × 2**, zero violations), `check:target-size`, `check:search`,
`check:pseudo`, `check:quickstart`, `check:po-app` (**20** behaviours),
`check -w create-ui`, `npm run suite` (**28** screens, zero axe violations at
both widths) — plus `check:selftests` (54 gates: 20 heuristic, 34 exact) and the
§3b `docs:build` re-run after this file was written.

**The `verifier` agent is not available in this session**, so `LOOPS.md` §2 step
6's verifier pass was done by hand — the staged diff re-read adversarially.
**It caught two unmeasured sentences in this wake's own `LOOPS.md` edit before
they landed**: an unsupported *"first collision caught before any commit"*
superlative (collision 2's record credits the same fetch while describing a
rebase, and `LOOPS-archive.md` does not settle it — the claim was dropped rather
than softened), and a *"read 'it has happened once' for ten days"* duration that
was asserted before it was measured (`git log -S` now sits beside it). Another
data point for `327.3`: the practice works when it is executed.

**The visual debts carried forward are unchanged and unspent**: `292.4/292.5`'s
screenshot lane on `/components/icon`; the withdrawn-claim paragraph and Slice
325's performance paragraph on `/components/data-table`; Slice 319's paragraph
on `/patterns/kanban` at 390px; `320.3`'s `ApiTable.astro` `0.5rem` against
`ClassRef.astro` `.4rem`; and **Slice 310.1's three `prod/` Refresh buttons**
(`/prod/production-orders`, `/prod/capacity`, `/prod/bom`), whose painted look
changed from a bordered `--secondary` box to a transparent `--ghost` one. **A
local wake should glance at all six.** This wake did re-measure the last one's
*geometry* — 10 buttons, 1 class string, **36x36** across the built suite — but
geometry is not the debt; the rendered image is.

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were
read** (issues **1** open, discussions **0** open).

**Two things want the owner's attention. `294.2` has left this list** — Slice
331 unblocked it rather than reporting it again, which is the third standing
item cleared in two days.

1. **Issue #2 is open and carries only the triage comment.** Slice 317 refuses
   the component with the measurement; Slice 319 corrected a second false claim
   on the same page the reporter was pointing at, which strengthens their report
   rather than weakening it. **Replying and closing the issue is a thirty-second
   owner action.** Whether a *wake* should post that comment is `297.1`, which
   stays open until someone who is not the owner files something.
2. **`273.2` is still worth their attention**, a thirty-second call untouched —
   whether a Polish round whose score does not move should increment `dry`. Not
   touched this wake; rule 6 was never reached.

**`249.12` stays a live question and is now sharper still** — a fifth
consecutive wake where the two halves of the archival trigger DISAGREE, and this
time the share moved *toward* the threshold rather than away. Still not urgent.

**`327.3` gained a second data point this wake** rather than an answer: the
by-hand adversarial re-read it says is not being executed WAS executed here, and
it caught two defects of exactly the shape `327.3` describes, in this wake's own
diff, before they landed. That is evidence for the answer *"the rule is fine,
the practice is the gap, build nothing"* — which `327.3` already names as an
explicitly satisfying outcome. **`326.3`, `330.1` and `331.1` are the others a
wake could take without the owner**, though the next wake is dispatched to
Standardize by rule 2, not to any of them.
