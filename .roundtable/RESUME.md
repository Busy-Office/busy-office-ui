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
at hand-off. **No collision this wake** — `origin/main` read `81f6281` at Step 0
and `81f6281` again immediately before the first commit.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ READ THIS FIRST: RULE 3 IS THE NEXT DISPATCH, AND RULE 2 IS SPENT

`dispatch_status.py`, read immediately after this wake's recording:

```
Standardize   0 / 4 Continue rounds   ok        ← this wake spent it
Objective     4 / 3 slices            OVERDUE   [324, 325, 347, 350]
```

Rule 1 (P0) and rule 2 are both clear, so **rule 3 matches and the Objective
grill of 324 / 325 / 347 / 350 is what runs next**. Two of the four armed slices
are still open — **325** (`325.2`) and **350** (`350.1`) — which is not a reason
to skip the grill; it is `349.1` (see below). **Re-run the script**; a collision
could land a row between this line and your wake.

If rule 3 is somehow already spent when you read this, rule 4's oldest
cloud-takeable item is unchanged at **`325.2`** — *the published `Initial
render` column has no recoverable method*; its Accept accepts withdrawal as
readily as a definition.

## What landed: Slice 350 — a Standardize sweep whose own DISPATCH is the finding

**Rule 2 dispatched this** at `Standardize 4 / 4 OVERDUE`, exactly as the
previous hand-off's ⚠ block predicted. All four lanes came back clean, and
asking *why they were all clean* is what produced the item.

**The four lanes, measured rather than cited:**

- **Lane 1** — 0 dead attributes of **1,365** live (1,813 declarations, 345
  multi); per declaration **11 dead on 9 pages**. That is Slice 345's refusal
  set **item for item and page for page** — a distribution 345 did not publish,
  so this is a stronger reconciliation than its arithmetic. Nothing converted.
- **Lane 2** — `74 / 242 / 230 / 8`, a **sixth** consecutive identical reading,
  checked against `LOOPS.md`'s settled table member for member.
- **Lane 3** — 119 pages, median 798, total 113,787 words; the **15** flagged
  pages are all members of the pinned **16**-verdict enumeration (158.1's twelve
  read out of the archive, 161.1's three, 178.3's `/concepts/scale/`).
  `/patterns/output-form/` is the unflagged sixteenth.
- **Lane 4** — no file changed accumulate class; dispatch region **flat** at
  7,548 (no commit since 345 touched `LOOPS.md` — verified, not assumed).
  `CLAUDE.md`'s `33 up / 0 down, never cut` is the one row with a **stated
  reopen condition**, so it was executed: **7 of 16** `##` sections are the
  "can this detector fail" subject, **no eighth**. The watch was already retired
  by **193.1** and re-verdicted HONEST by **284.2** (removable surface 181 words,
  3.1%). Settled; do not re-raise.

**The finding.** No commit in the window `161ede68..HEAD` touched
`packages/core/src/css/**` or `apps/docs/src/**`, so lanes 1-3 could not report
anything new. **The obvious objection is real and has a live example one window
back**: a lane's reading also moves when its *instrument* changes —
`cdfcb129`/320.2 rewrote `scan-dead-style.mjs`'s verdict and Slice 345's lane 1
opened at **52 dead on unchanged inputs**. This window touches that same file, so
the file-level test could not classify it and the diff was read: **24 added
lines, 0 outside the header comment, 0 deleted.**

Base rate (command is in the slice, figures are snapshots): 156 Standardize rows
→ **139** distinct first-parent commits (1,660 of 1,660 rows parsed, 0
unresolvable) → **138 windows**; **14 no-input (10.1%)**, **13 also
no-instrument (9.4%)**. Reconciled — window sizes sum to **1,994** against
`git rev-list --first-parent` **1,994**; discriminating — **124 of 138** windows
do carry an input change. Cost measured: lane 1 alone is **123s** here.

`350.1` is **filed, not decided**, and explicitly **proposes no gate** —
classifying this very window needed the diff read, so the property is semantic
(94.11). Lane 4 is unaffected and that is what keeps it a question: it reads the
loop-machinery markdown, which all 13 commits changed.

## `349.1` REPRODUCED UNPROMPTED, on this wake's own recording

Recording the sweep took rule 3 to `Objective 4 / 3 OVERDUE [324, 325, 347,
**350**]`. Slice 350's only item, `350.1`, is **open** — so a row that filed an
open question armed the counter that rule 3's text says counts slices *closed*.
The arming set is now **2 of 4** open (325, 350) where `349.1` measured 1 of 3.

Nothing was staged to produce it: the sweep was dispatched by rule 2 and the
counter read afterwards, which is `LOOPS.md`'s standing instruction for this
counter. **It does not decide `349.1`** — a *touched* reading would count 350
too, and correctly — but it shows the divergence is live and growing rather than
a historical artefact. Amended into `349.1` in the same commit, per 236.2.

## `348.1` reproduced again on this wake's recording

`check:resume-slice-ids` printed `15.0`, `15.10`, `312.2` as "named ids not in
`ROADMAP.md`" a third consecutive time. **The discrimination test the previous
hand-off proposed and then refuted is still unrunnable from here** for the same
reason: naming the figures in backticks to describe them is the same match. This
file no longer carries them in backticks, so the next recording is the first
chance to see whether the ABSENT bucket shrinks to `312.2` alone — **that is a
prediction, not a result**, and it is only clean if the next hand-off also
avoids discussing `348.1` in backticks.

## No metric was recorded this wake, and that is deliberate

One number was measured that no tracked name covers — lane 1's **123s** wall
clock. Adding a 48th name with a single sample would join the 39 names that
already have only one day and cannot be an input to rule 5, so it was not
recorded. `324.2`'s `bundle-gz-kb` convention (read the left-hand number off
`check:size`, never off a README) remains unspent; nothing this wake touched the
bundle.

## NOT VERIFIED, said plainly — and this wake adds NO visual debt

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.** **None
are owed**, structurally rather than by judgement: the diff is `ROADMAP.md` and
this file. No CSS, no docs page, no component and no script changed, so nothing
rendered can move.

**Slice 345's two visual debts are still owed and unspent:**
`/patterns/output-form` **in print** (the figure, the barcode quiet zone), and
the RF tile grid on `/patterns/rf/rf-landing-rf/` at both widths. **The six older
ones are unchanged:** `292.4/292.5`'s screenshot lane on `/components/icon`; the
withdrawn-claim paragraph and Slice 325's performance paragraph on
`/components/data-table`; Slice 319's paragraph on `/patterns/kanban` at 390px;
`320.3`'s `ApiTable.astro` `0.5rem` against `ClassRef.astro` `.4rem`; and Slice
`310.1`'s three `prod/` Refresh buttons.

**Gates: all 17 CI-runnable entry points were run green in this container** —
core `build` (incl. `lint:css`, `check:size` 139 payload files / 382.7 kB gz,
`check:readme-facts`, `check:package`), core `test`, `lint:css`, `docs:build`
(carrying `check:slice-refs` **991** assertions / **375** citations / 332 slice
numbers, `check:floor` **593** files, `check:vendor-names` **615** files,
`check:imports`, `check:repo`), `check:claims` (**176** live · 3 NOT VERIFIED,
which is `ENVIRONMENT.md` §6b's container fact, not a regression),
`check:formatting`, `check:scroll` (914 containers), `check:layout` (128 pages),
`check:forced-colors`, `test:axe` (128 × 2, zero violations),
`check:target-size`, `check:search`, `check:pseudo`, `check:quickstart`,
`check:po-app` (20 behaviours), `check -w create-ui`, `npm run suite` (28
screens × 2).

**Said precisely, because the wake landed in two commits.** All 17 were run green
on the tree of the FIRST commit (Slice 350). The second commit adds the `349.1`
amendment and this file — **markdown only**, and nothing in it can reach a
browser gate. What was re-run after it: **`docs:build`**, which is where all four
gates that read `.roundtable/**` and `ROADMAP.md` live, per `ENVIRONMENT.md` §3b.
It was also re-run mid-item, after the archive-share clause was reworded.

**The `verifier` agent is not available in this session**, so `LOOPS.md` §2 step
6's verifier pass was done by hand — the staged diff re-read adversarially, every
number in it re-checked against the command that produced it. **It earned its
keep twice.** It caught that the archive-share clause I had written named a line
count (`198`) that my own next edit would invalidate — the exact figure-from-the-
working-tree trap — and it caught that the `INSTR` tuple in the published probe
would silently under-detect if any of its three paths were wrong, so all three
were confirmed to exist before the number was quoted. **The embedded probe was
run verbatim in its published form**, not in the form it was explored with, and
reproduced `138 / 14 / 13 / 1994` exactly.

## The open set is 31 — no P0

`roadmap_scope.py` reports **31 open / 83 closed** at the working tree, and the
raw checkbox count reads **31 open / 85 closed**. **The two disagree by design,
not by defect**: `roadmap_scope.py` excludes the 2 `[x]` items under the
non-slice `## STATE` headings and says so in its own output.

This wake closed nothing and filed `350.1` (30 → 31). **Re-run the script at the
commit** rather than quoting this.

- **cloud-takeable: 20** — `325.2`, `326.3`, `327.3`, `328.1`, `330.1`,
  `331.1`, `332.1`, `333.1`, `334.1`, `335.1`, `336.2`, `337.1`, `338.1`,
  `339.2`, `341.1`, `345.1`, `346.1`, `348.1`, `349.1`, `350.1`.
  **`325.2` is still the oldest of these.** `335.1` still carries its caveat —
  settling it may mean filing a throwaway Q&A discussion, an outward-facing
  write to a public repo whose permission has **not** been tested.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3` (**BLOCKED ON OWNER BRIEFS**), `112.4` (blocked on 112.3's verdict),
  `249.7`, `249.10`, `249.11`, `249.12`, `249.13`, `273.2` (**OWNER CALL**),
  `296.3` (**OWNER CALL**).
- **browser-blocked in the SCREENSHOT sense (1):** `320.3`.

20 + 10 + 1 = 31, asserted rather than left to the reader. **The fifth kind,
`artifact-lost`, is empty.** Every id above was checked this wake to resolve to
**exactly one open checkbox line** in `ROADMAP.md` (30 decimal ids plus Slice
15's `AT runtime evidence`); the owner-blocked *classification* is carried
forward from the previous hand-off, which re-read each in the file.

## Step 1 — both intakes read, with the controls ENVIRONMENT.md §8 names

```
/issues?state=open  -> HTTP 200, len 1     #2, updated 2026-09-06T15:10:34Z
/discussions        -> HTTP 200, len 0     the reading
/not-a-real-route   -> HTTP 404            an unserved route does NOT answer 200 []
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so
Step 1 committed nothing. **Issue #2's `updated_at` has not moved for a
SIXTEENTH consecutive hand-off.** See Direction.

## Rule-by-rule dispatch trace

Rule 1: no open P0 — `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**.
**Rule 2 matched** at `Standardize 4 / 4 Continue rounds OVERDUE`. Rule 3
`Objective 3 / 3 OVERDUE [324, 325, 347]` was already overdue at dispatch time
but sits **below** rule 2, so the grill waits a wake. Rules 4-8 not reached.

**Rule 5 was not reached and would not have fired.** Its line read `ok`, not
`STALE`: **0** wake-dates newer than the newest pair, 8 of 47 names paired
across days. No sample was recorded this wake, so it is unmoved.

## The archive sweep was evaluated this wake and declined on the measured trigger

`roadmap_scope.py` reported closed-history share **40.4%** at `81f6281c` (Step 0)
with 20 eligible targets, 10 named by a still-open item (236.2's report, read
before concluding). Below every trigger the last sweeps used: 252.1 dispatched
the tenth at **55.1%**, 272.1 the eleventh at **56.7%**, 279.3 declined the
twelfth at **40.6%**, `324.3` took the thirteenth at **41.5%**. This wake's own
commits lower it further (live lines under an open heading) — **re-run the script
at the commit**; no figure here describes your tree.

**`249.12` is named for a TENTH consecutive wake.** Ten consecutive wakes have
now declined a sweep on the absence of a stated trigger. **Nothing is proposed
here.**

## The standing environment fact: CI HAS NO `paths-ignore`

`312.2` removed it entirely. **A push that touches only `.roundtable/**` runs
the full suite.** The consequence a wake feels directly is `ENVIRONMENT.md` §3b
— *re-run `npm run docs:build` after writing this file, before pushing* — and it
was executed this wake, after this file was written, before the push.

## CHECK CI AFTER PUSHING — and filter the run list yourself

Use the plain listing and match the sha in your own code; **never
`?head_sha=` with an abbreviated sha**, which answers `200` with an empty list
and reads as "no runs yet" (`ENVIRONMENT.md` §6d):

```
curl -sS -H "Authorization: bearer $GITHUB_TOKEN" \
  "https://api.github.com/repos/Busy-Office/busy-office-ui/actions/runs?branch=main&per_page=6"
```

## Step 0 traps

**Trap 1 bit, and was observed rather than run blind.** The fetch reported a
forced update `26447ba...81f6281`, and `git branch --show-current` answered
**EMPTY** — the container *was* detached. Fixed with
`git checkout -B main origin/main`; the branch read `main` afterwards. No
`git stash` at any point. **`HEAD` equalled `origin/main` at `81f6281c`, which is
the previous wake's own tip**, so no other dispatcher had landed anything between
the two wakes.

**Trap 2: the clone was shallow and this wake's finding is a history
measurement** (a base rate over 138 commit windows), so it was unshallowed before
any figure was taken — **2,065 commits**, no `shallow.lock`, and the unshallow
again brought the tags (`git tag | wc -l` → **8**, run rather than assumed).
`polish_requeue.py --verify-stamps` therefore had real history and printed
nothing.

**No `git worktree` was used this wake** — every historical reading came from
`git rev-list` / `git show`, which need no checkout. `git status` was clean
before each commit.

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were
read** (issues **1** open, discussions **0** open).

**Two things want the owner's attention, both unchanged and both thirty-second
actions:**

1. **Issue #2 is open and carries only the triage comment.** Slice 317 refuses
   the component with the measurement; Slice 319 corrected a second false claim
   on the same page the reporter was pointing at. **Replying and closing the
   issue is an owner action.** Whether a *wake* should post that comment was
   `297.1`, closed by Slice 335 — read it before re-raising.
2. **`273.2` is still worth their attention** — whether a Polish round whose
   score does not move should increment `dry`. Not touched this wake; rule 6
   was never reached, so `polish_requeue.py --apply` was correctly not run.

**And the loop-mechanics question is now TWO items deep, which is worth the
owner knowing even though neither needs them:** `349.1` (should rule 3 count
slices *closed* or slices *touched*?) and `350.1` (should rule 2's counter know
whether its first three lanes have anything to read?). Both are answerable by
whoever owns `LOOPS.md`'s text. They are independent questions about the same
gap — a dispatcher counter whose unit is *rounds* while the work it dispatches
is measured on *artefacts* — and if a wake takes one, it should say why it is
not taking the other at the same time.
