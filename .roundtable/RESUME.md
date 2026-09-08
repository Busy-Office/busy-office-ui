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
at hand-off. **No collision this wake** — the pre-commit `git fetch origin main`
found `origin/main` unmoved at `6d6f5afe`. One iteration recorded
(`Objective · grill · 322/342`, `logged`).

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## What landed: Slice 346 — the Objective grill of 322 and 342

**Rule 3 dispatched this**, at `Objective 4 / 3 OVERDUE [320, 322, 323, 342]`.
**Scope narrowed to two of the four** per §6 step 0: Slices **320** and **323**
are each already the named subject of a 2026-09-07 grill report in
`.roundtable/`, so they were dropped rather than re-grilled. Slice **322** is
itself a grill (of 304, 305, 320) — a grill of a grill. Slice **345** was in
scope only as `342.1`'s closure.

**20 of 22 re-runnable assertions reproduce. Both defects are in Slice 342, and
both are a recurrence of something Slice 322 had just filed** — which is the
finding, not the two defects on their own.

- **Defect A — a correction that missed its third site because the phrase
  wraps.** `161ede68` says **FOUR** in its subject, in Slice 345's heading and
  in its body, and **five** in the closing annotation the same commit wrote on
  `342.1`. `grep 'five source lines'` returns **0** at `6d6f5af` on a phrase
  wrapping as `five source` / `lines`; whitespace-normalised it returns 1. That
  is `322.3`'s mechanism, one wake after Slice 343 refused a normaliser for it.
- **Defect B — Slice 342 said the command was in the script's header; it was
  not.** The header carried the refusal, the number and *"Re-measure before
  assuming it still holds"*. So 342 asserted the fix for 322's **Defect B** in
  the same sentence that committed it.

**Both corrected in place at Slice 342 per 236.2**, originals struck. Defect B
was also *fixed*: the command is now in `scan-dead-style.mjs`'s header.

## The refusal STANDS, and 343 is NOT reopened

342's base rate re-measures to **0 of 30,485** decoded, against the published
0 of 30,483 — so the depth-aware-splitter refusal is correct and only the claim
about where its command lived was wrong. And `346.1` is filed explicitly as *not*
reopening Slice 343: its two measurements (1 of 14 published phrase-counts
changes; zero callers in `scripts/`) both still hold. What `346.1` names is a
population 343's caller census did not measure — a wake's own verification grep.

## Five of this grill's instruments were wrong first, by THREE mechanisms

Recorded because *"all of them the same way"* was written first and is false.
**Two by the wrap** (the greps that found Defect A and located Defect B's text —
the finding's own mechanism inside the tool used to find it). **One by a token
boundary** (`\bdocs-list\b` matches inside `docs-list-bare`, the exact bug 322's
report names). **One by HTML entities** (a raw-text base-rate scan reads 1 of
30,485 on the `;` closing a `&quot;` inside a `url()`, which the browser never
sees). **One merely scoped differently** — a hand-written re-derivation of the
`1,433` blast radius returned 11 against the published 17, and what settled it in
one run was that Slice 322 *had recorded its command*. That is the counterfactual
Defect B destroys.

## A regress worth knowing about before you write a correction here

Stating the current value of a phrase-count **inside the file being counted**
cannot converge: the correction, and the slice entry describing it, both contain
the phrases they count. Three values were written and each was stale before its
own edit finished (`3 4` → `5 5` → `6 5`). **No this-commit figure is published**;
the reading is pinned to `6d6f5af` and the durable statement is the property —
line-based misses exactly the wrapped occurrence. `327.2`'s effect in its
strongest form.

## NOT VERIFIED, said plainly — and this wake adds NO visual debt

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.** **None
are owed**, and that is structural rather than a judgement call: the diff is
`ROADMAP.md`, the grill report, this file, and a **comment-only** change to
`apps/docs/scripts/scan-dead-style.mjs`. That script is not a build step, not a
gate and not imported anywhere — re-verified this wake with the same command
Slice 342 used (`grep -rln scan-dead-style` → its own `package.json` entry, plus
header **prose** in `check-viewport-forks.mjs` and `viewports.mjs`). No CSS rule,
no docs page and no component changed, so nothing rendered can move. The edited
script was run end to end after the edit and prints an identical scan.

**Slice 345's two visual debts are still owed and unspent:**
`/patterns/output-form` **in print** (the figure, the barcode quiet zone), and
the RF tile grid on `/patterns/rf/rf-landing-rf/` at both widths. **The six older
ones are unchanged:** `292.4/292.5`'s screenshot lane on `/components/icon`; the
withdrawn-claim paragraph and Slice 325's performance paragraph on
`/components/data-table`; Slice 319's paragraph on `/patterns/kanban` at 390px;
`320.3`'s `ApiTable.astro` `0.5rem` against `ClassRef.astro` `.4rem`; and Slice
`310.1`'s three `prod/` Refresh buttons.

**Gates green:** all **17** CI-runnable entry points on the pre-commit tree —
core `build`, core `test`, `lint:css`, `docs:build`, `check:claims` (**176**
live · 3 NOT VERIFIED, which is `ENVIRONMENT.md` §6b's container fact),
`check:formatting`, `check:scroll` (914 containers), `check:layout` (128 pages),
`check:forced-colors`, `test:axe` (128 × 2, zero violations), `check:target-size`,
`check:search`, `check:pseudo`, `check:quickstart`, `check:po-app` (20
behaviours), `check -w create-ui`, `npm run suite` (28 screens × 2). Plus
`check:selftests` (55 gates: 21 heuristic, 34 exact), `check:viewport-forks` (76
docs scripts), and `check:vendor-names` run **directly at its real path**
(**615** files — a passing gate, not a census of the source tree).
**`docs:build` was re-run after this file was written**, per `ENVIRONMENT.md` §3b.

**The `verifier` agent is not available in this session**, so `LOOPS.md` §2 step
6's verifier pass was done by hand — the staged diff re-read adversarially. What
it caught: the published self-contamination figure was already stale (above), and
the report's claim that all its wrong instruments failed *the same way* was false
— three mechanisms, not one. Both corrected before the commit.

## The open set is 31 — no P0, and 20 are cloud-takeable

`roadmap_scope.py` reports **31 open**, and the raw checkbox count agrees. This
commit opened `346.1` and closed nothing, so the total moved 30 → 31.
**Re-run the script** rather than quoting this.

- **cloud-takeable: 20** — `324.1`, `324.2`, `325.1`, `325.2`, `326.3`,
  `327.3`, `328.1`, `330.1`, `331.1`, `332.1`, `333.1`, `334.1`, `335.1`,
  `336.2`, `337.1`, `338.1`, `339.2`, `341.1`, `345.1`, `346.1`.
  **`324.1` is still the oldest of these**, and is what rule 4 reaches for.
  `335.1` still carries its caveat: settling it may mean filing a throwaway Q&A
  discussion, an outward-facing write to a public repo whose permission has
  **not** been tested.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3` (**BLOCKED ON OWNER BRIEFS**), `112.4` (blocked on 112.3's verdict),
  `249.7`, `249.10`, `249.11`, `249.12`, `249.13`, `273.2` (**OWNER CALL**),
  `296.3` (**OWNER CALL**).
- **browser-blocked in the SCREENSHOT sense (1):** `320.3`.

20 + 10 + 1 = 31, asserted rather than left to the reader. **The fifth kind,
`artifact-lost`, is empty.**

## Step 1 — both intakes read, with the controls ENVIRONMENT.md §8 names

```
/issues?state=open  -> HTTP 200, len 1     #2, updated 2026-09-06T15:10:34Z
/discussions        -> HTTP 200, len 0     the reading
/not-a-real-route   -> HTTP 404            an unserved route does NOT answer 200 []
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so
Step 1 committed nothing. **Issue #2's `updated_at` has not moved for a
TWELFTH consecutive hand-off.** See Direction.

## Rule-by-rule dispatch trace

Rule 1: no open P0 — `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**.
Rule 2 `Standardize 0 / 4 ok` did not match. **Rule 3 matched** at
`Objective 4 / 3 OVERDUE [320, 322, 323, 342]`. Rules 4-8 not reached.

**Rule 5 was not reached and would not have fired.** Its line read `ok` — not
STALE, not SKEW — and the comparable set's movers are `claims` (+7, rising is
the goal) and `dispatch-region-words` (+194, one day-pair). No metric was
recorded this wake: this grill measured nothing that is a tracked series, and
recording a name sampled once cannot create a day-pair.

## What the next wake should reach for: rule 4 on `324.1`

Measured immediately after `record_iteration.py`, which is the comparison
`LOOPS.md` says finds the counter bugs — not predicted:

```
Standardize   1 / 4 Continue rounds  since 2026-09-08 04:59   ok
Objective     0 / 3 slices           since 2026-09-08 06:0x   ok
```

This grill reset rule 3. Rule 2 is at 1 of 4. So **rule 4 is the first match**,
on `324.1`, the oldest still-open cloud-takeable item. Re-run it — a collision
could land a row between this line and your wake.

## The archive sweep was evaluated this wake and declined on the measured trigger

`roadmap_scope.py`: closed-history share **38.5%** at `6d6f5af`, and this
commit adds ~200 lines of open-slice text, so it moves *down*. The trigger the
last sweeps actually used: 252.1 dispatched the tenth at **55.1%**, 272.1 the
eleventh at **56.7%**, and 279.3 declined the twelfth at **40.6%**. Below all
three. Re-run the script; this commit moves the numbers.

**`249.12` is named for a SIXTH consecutive wake.** Six consecutive wakes have
now declined an archive sweep on the absence of a stated trigger (279.3 at
40.6%, then 33.1%, 32.4%, 35.6%, 38.5%, and this one). The item is filed as low
urgency because *"the sweep keeps happening regardless"*; that sentence has now
been false six times running. **Nothing is proposed here.**

## The standing environment fact: CI HAS NO `paths-ignore`

`312.2` removed it entirely. **A push that touches only `.roundtable/**` runs
the full suite.** The consequence a wake feels directly is `ENVIRONMENT.md` §3b
— *re-run `npm run docs:build` after writing this file, before pushing* — and it
was executed this wake, after this file was written, before the push.

## CHECK CI AFTER PUSHING

Read the runs after your push; one `actions/runs?branch=main` read costs nothing
and is the only thing standing between a red `main` and the next wake.

## Step 0 traps

Trap 1 bit again — the fetch reported a forced update `26447ba...6d6f5af` and
the container started **detached** (`git branch --show-current` empty); fixed
with `git checkout -B main origin/main` before any commit. Trap 2 was clean in
one `--unshallow` (no `shallow.lock`) and again brought the tags; `git tag | wc
-l` → **8**, run rather than assumed. Trap 1c was respected: `CHROME_PATH` was
exported **in the same command** as every browser gate, `scan:dead-style`
included. No `git stash` at any point. **Trap 6 was exercised for real** — a
`scan:dead-style` run's output file read empty and was correctly treated as
still-running, not as complete; the `[exited with code 0]` marker is the signal.

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
   score does not move should increment `dry`. Not touched this wake; rule 6 was
   never reached, so `polish_requeue.py --apply` was correctly not run.
