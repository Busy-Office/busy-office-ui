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
at hand-off. **No collision this wake** — `origin/main` read `c4a18b67` at Step 0
and `c4a18b67` again immediately before the first commit, and it arrived as a
plain fast-forward (`d876765..c4a18b6`), not a forced update.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

**`check:resume-slice-ids` REPORTED against this file and the report was read,
not deferred.** It named `94.11`, `312.2`, `192.1` as archived (rules cited by
number, not items) and **9** ids recorded `[x]` closed: `330.1` (closed by Slice
358 and named here as filed-and-closed), `359.1`-`359.4` (this wake's own, all
closed, each with its disposition in the table below), `355.3` and `324.3` and
`297.1` (cited as precedent and said to be closed), and `310.1` (named only as an
unspent *visual debt*, not as an open item). **Nothing here claims an open item
that is not.** Re-run the check against this file rather than trusting that
sentence.

## ⚠ RULE 4 IS NEXT, AND ITS CLOUD-TAKEABLE ITEM IS `331.1`

`dispatch_status.py`, read immediately after this wake's recording (LOOPS.md asks
for exactly that comparison; it has found two of the five parser bugs):

```
Standardize   1 / 4 Continue round    ok
Objective     0 / 3 slices            ok
Optimize      0 wake-date(s) newer    ok
```

**Re-run it** — a collision could land a row between this line and your wake.

Rule 1 has no open P0. Rule 2 is 1 of 4 — **an Objective row is not a Continue
round, so this wake's recording did not advance it**. Rule 3 **reset to 0 / 3**
when that row landed. **So rule 4 matches**, and its oldest cloud-takeable item is
`331.1`; the oldest open item overall is Slice 15, owner-blocked (a human
listening to a screen reader).

## What landed: Slice 359 — the Objective grill of 356, 357, 358

**Dispatched by rule 3** at `Objective 3 / 3 OVERDUE [330, 356, 357]`, exactly as
the previous hand-off predicted. **The counter says 330 and the material is 358**:
Slice 330 is itself an Objective grill (of 310, 328, 329) and no Continue row
built it — what armed the counter is Slice 358's row naming the *item* `330.1`
that grill filed. None of 356/357/358 had been covered before.

**60 of 64 published assertions reproduce**, counting **one assertion per row** of
the grill report's three tables (several rows carry more than one figure, so a
figure-level count is higher and depends on how they are split — the rule is
stated because this entry's own first draft published `84 / 80` from a
figure-level tally that did not survive a recount).

**Every figure each slice red-proved reproduces to the digit.** The strongest is
358's: the 153 line numbers in its census report are *exactly* the set its
published filter selects — 0 unverdicted, 0 verdicts for a non-candidate — and
all eight verdict counts, the 32, the 57 (37.3%), the base rate, the 31 open
items and the 1,155 body lines re-run at `ada0f384`. 357's base-rate command
returned `139 windows, span 1,869, 20/7/38/74` and the `a..b` control
`139 / 15 / 2,008`, both as published.

**All four failures are one sentence each, and none is in a measurement** — a
composition summary, an attribution, a per-page range. That is **192.1's shape**,
three slices running, in the window where Slice 354 measured 192.1 as applied in
**1 of 161** slices.

| item | the defect | disposition |
|---|---|---|
| `359.1` | 358's widening summary drops 2 `CENSUS` verdicts: `134 + 5 + 12 = 151` against its own 153 | corrected in place |
| `359.2` | 357's *"nearly 3x the rate `350.1` records"* is `351.1`'s amended 14.4% under `350.1`'s name (against 350.1's own 10.1% it is **4.1x**, i.e. larger) | corrected in place |
| `359.3` | 356's `other=1 … other=99` range names no instrument; re-measured the three pages read **4 / 5 / 103** — the ordinal reproduces, the values do not | amended in place |
| `359.4` | nothing proposed — a fifth loop-mechanics item refused on `355.3`'s precedent, a gate refused on `94.11` | refusal recorded |

All four are `[x]`; the open set does not grow.

## The probe was red-proved BEFORE its 100% reading was quoted

356's refusal rests on *"renders `bo-*` outside a `<pre>`"* being true of **24 of
24**, and a 100% reading is a defect until shown otherwise. Two synthetic pages
were written into the git-ignored `apps/docs/dist`, each asserted to carry what it
was supposed to carry *before* the probe ran, and both deleted in the same
command:

| control | contains | probe reads |
|---|---|---|
| negative | `bo-*` markup **only inside `<pre>`** | **0** |
| positive | one visible `bo-*` outside any `<pre>` | **1** |
| a real page (`/concepts/container-queries/`) | — | 4 |

So the probe can report zero. **Slice 356's refusal stands.**

## This wake's own output was wrong first, and it was caught before the push

**The headline read `84 / 80`.** It was a figure-level tally — individual numbers,
counted once by hand — and a recount of the same tables gave a different total,
because rows like lane 2's `74 / 242 / 230 / 8` are one assertion and four
figures. Caught by the by-hand verifier pass, corrected to `60 / 64` with the
counting rule stated in the entry rather than quietly fixed. It is the grill's own
subject arriving in the grill: a sentence characterising a measurement, shipped
beside measurements that were all correct.

## ⚠ The archive sweep: 49.6%, the highest reading on record

```
python3 scripts/loops/roadmap_scope.py --rev <sha>
  ada0f384  5,531 / 11,808 = 46.8%     (previous wake's Step 0 tip)
  c4a18b67  5,858 / 11,990 = 48.9%     (this wake's Step 0 tip)
  2bb15e7d  6,033 / 12,166 = 49.6%     (this wake's slice commit — see the caveat)
```

**Read the caveat before quoting the third row.** Slice 359 closes all four of its
items in the same commit, so every one of its **182** new `ROADMAP.md` lines
(`git show --numstat --format='' 2bb15e7d -- ROADMAP.md` → `182 / 6`) lands as
*closed history* and pushes the ratio up by construction. That is the same
mechanic Slice 357 recorded after its own forecast went the wrong way — re-run the
script at the commit rather than quoting a number from prose.

**The empirical record, re-read rather than carried:** 252.1 dispatched the tenth
sweep at **55.1%**, 272.1 the eleventh at **56.7%**, 279.3 *declined* the twelfth
at **40.6%**, `324.3` *took* the thirteenth at **41.5%**. The current reading is
**~8pp above the last taken sweep** and above every declined reading on record.

**Not dispatched by this wake, and the reason is scope, not the number**: a sweep
is a hand-checked bulk edit one slice at a time (CLAUDE.md), and this wake was
rule 3's grill end to end. **`249.12` is named for a NINETEENTH consecutive
wake** — it is the open **OWNER OR ARCHITECTURE CALL** on the archival trigger,
and it is a live candidate for rule 4 whenever that rule is reached.

## NOT VERIFIED, said plainly — and this wake adds NO visual debt

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.** This wake
owes none, structurally: the diff is `ROADMAP.md`, one new `.roundtable/` report,
this hand-off and the recorder's own files. No `.astro`, no CSS, no script and no
generated artefact changed — `git diff --stat` was read to confirm that rather
than assumed. The two synthetic control pages above were written into
`apps/docs/dist`, which is a build output and git-ignored, and deleted in the same
command that ran the probe (`ls apps/docs/dist/concepts | grep -c __probe` → 0).

**The eight older debts are unchanged and unspent**, and nothing since has touched
their surfaces: Slice 352's two (`/components/data-table`'s performance table and
`/concepts/scale`'s scaling table, both at 1440 and 390 in both themes); Slice
345's two (`/patterns/output-form` **in print** — the figure, the barcode quiet
zone — and the RF tile grid on `/patterns/rf/rf-landing-rf/` at both widths); and
the four older ones — `292.4/292.5`'s screenshot lane on `/components/icon`; Slice
319's paragraph on `/patterns/kanban` at 390px; `320.3`'s `ApiTable.astro`
`0.5rem` against `ClassRef.astro` `.4rem`; and Slice `310.1`'s three `prod/`
Refresh buttons.

**Gates: ALL 17 CI-runnable entry points were run green in this container**, in
`ENVIRONMENT.md`'s own order: core `build` (incl. `lint:css`, `check:size`,
`check:readme-facts`, `check:package` **185** files), core `test`, `lint:css`,
`docs:build` (carrying `check:slice-refs` **1,004** assertions / **379**
citations / **341** slice numbers, `check:floor` **597** files,
`check:vendor-names` **619**, `check:imports`, `check:selftests`,
`check:page-shape`, `check:wrong-choice`, `check:metadata` **1,159**),
`check:claims` (**176** live · 3 NOT VERIFIED, which is `ENVIRONMENT.md` §6b's
container fact, not a regression), `check:formatting`, `check:scroll` (**914**
containers / 118 pages), `check:layout` (**128** pages), `check:forced-colors`,
`test:axe` (128 × 2, zero violations), `check:target-size`, `check:search`,
`check:pseudo`, `check:quickstart`, `check:po-app` (**20** behaviours),
`check -w create-ui`, `npm run suite` (**28** screens × 2 widths).

**Said precisely.** `docs:build` was re-run to exit 0 after the last `ROADMAP.md`
edit, and again after this file was written, per `ENVIRONMENT.md` §3b, before the
push.

**The `verifier` agent is not available in this session**, so `LOOPS.md` §2 step
6's verifier pass was done by hand: the staged diff re-read adversarially, every
number re-checked against the command that produced it. **It earned its keep** —
the `84 / 80` correction above was made by that re-read, before the push.

## No metric was recorded this wake, and here is the reason for each candidate

- **`dispatch-region-words`** — not sampled. `LOOPS.md` is byte-for-byte unchanged
  this wake, so a second sample of the same region moves nothing; `353.2` is open
  about exactly this name and its convention.
- **`claims` = 176** (`check:claims`). **Identical** to the previous four wakes.
- **`bundle-gz-kb`** — nothing this wake touched the bundle.

## The open set is 30 — no P0

`roadmap_scope.py` reports **30 open** at the slice commit; the raw checkbox count
agrees. Slice 359 filed four items and closed all four in the same commit, so the
open set is **unchanged at 30**.

- **cloud-takeable: 19** — `331.1`, `332.1`, `333.1`, `334.1`, `335.1`, `336.2`,
  `337.1`, `338.1`, `339.2`, `341.1`, `345.1`, `346.1`, `348.1`, `349.1`,
  `350.1`, `351.1`, `352.1`, `352.2`, `353.2`.
  **`331.1` is the oldest of these**, so it is rule 4's item whenever rule 4 is
  next reached. `335.1` still carries its caveat — settling it may mean filing a
  throwaway Q&A discussion, an outward-facing write to a public repo whose
  permission has **not** been tested.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware), `112.3`
  (**BLOCKED ON OWNER BRIEFS**), `112.4` (blocked on 112.3's verdict), `249.7`
  (its own text holds it for `249.10`), `249.10`, `249.11`, `249.12`, `249.13`,
  `273.2` (**OWNER CALL**), `296.3` (**OWNER CALL**).
- **browser-blocked in the SCREENSHOT sense (1):** `320.3`.

19 + 10 + 1 = 30, asserted rather than left to the reader. **The fifth kind,
`artifact-lost`, is empty.**

## Step 1 — both intakes read, with the controls ENVIRONMENT.md §8 names

```
/issues?state=open  -> HTTP 200, len 1     #2, updated 2026-09-06T15:10:34Z
/discussions        -> HTTP 200, len 0     the reading
/not-a-real-route   -> HTTP 404            an unserved route does NOT answer 200 []
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so Step 1
committed nothing. **Issue #2's `updated_at` has not moved for a TWENTY-FIFTH
consecutive hand-off.** See Direction.

## Rule-by-rule dispatch trace

Rule 1: no open P0 — `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**
across 30 open items at dispatch. Rule 2 read `Standardize 1 / 4 ok`. **Rule 3
read `Objective 3 / 3 OVERDUE [330, 356, 357]` and matched.** Rules 4-8 not
reached. **Rule 5 would not have fired** — its line read `ok`, not `STALE` and not
`SKEW`: **0** wake-dates newer than the newest pair, 8 of 47 names paired across
days, and no name in the comparable set regresses on two consecutive runs.

## The standing environment fact: CI HAS NO `paths-ignore`

`312.2` removed it entirely. **A push that touches only `.roundtable/**` runs the
full suite.** The consequence a wake feels directly is `ENVIRONMENT.md` §3b —
*re-run `npm run docs:build` after writing this file, before pushing* — and it was
executed this wake, after this file was written, before the push.

## CHECK CI AFTER PUSHING — and filter the run list yourself

Use the plain listing and match the sha in your own code; **never `?head_sha=`
with an abbreviated sha**, and **take the full sha from `git rev-parse HEAD`,
never by extending a short one already on screen** (`ENVIRONMENT.md` §6d):

```
curl -sS -H "Authorization: bearer $GITHUB_TOKEN" \
  "https://api.github.com/repos/Busy-Office/busy-office-ui/actions/runs?branch=main&per_page=6"
```

## Step 0 traps

**Trap 1 bit in its first form.** `git branch --show-current` answered **EMPTY**
at Step 0 — the container arrived detached at `c4a18b67` — and was fixed with
`git fetch origin main && git checkout -B main origin/main` before any commit.

**Trap 2: the clone was shallow (50 commits) and was unshallowed before any figure
was taken** — **2,085** commits at `HEAD`, no `shallow.lock`, and the unshallow
again brought the tags (`git tag | wc -l` → **8**, run rather than assumed).
**It was load-bearing, and not for the reason a wake first reaches for**: the
three revisions this grill's figures name sit **4, 3 and 2** first-parent commits
behind `HEAD`, well inside a shallow clone's reach. What needs the full history is
the base-rate script, whose 139 windows span **1,869** commits — on a truncated
history it would have classified quietly rather than failed.

**No `git worktree` and no `git stash` were used this wake.** Every figure names
either `c4a18b67` (the Step 0 tip), the revision the grilled slice itself named,
or this wake's slice commit.

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were read**
(issues **1** open, discussions **0** open).

**Three things want the owner's attention, all unchanged, all thirty-second
actions:**

1. **Issue #2 is open and carries only the triage comment.** Slice 317 refuses the
   component with the measurement; Slice 319 corrected a second false claim on the
   same page the reporter was pointing at. **Replying and closing the issue is an
   owner action.** Whether a *wake* should post that comment was `297.1`, closed
   by Slice 335 — read it before re-raising.
2. **`273.2`** — whether a Polish round whose score does not move should increment
   `dry`. Not touched this wake; rule 6 was never reached, so `polish_requeue.py
   --apply` was correctly not run. It goes stale every Polish round, which is
   itself an argument for deciding it.
3. **`249.12`** — the stated-trigger question for the archive sweep, an explicit
   **OWNER OR ARCHITECTURE CALL**. The share it governs is now **~8pp above the
   last sweep anyone actually took**, and nineteen consecutive wakes have declined
   a sweep for want of the trigger this item would supply. It is filed *low
   urgency* on the grounds that "the sweep keeps happening regardless" — that
   premise is what has weakened.

**The loop-mechanics question is still FIVE items deep** — `341.1`, `349.1`,
`350.1`, `351.1` plus `353.2`. This wake answered none and **deliberately added
none**: `359.4` records the refusal of a sixth, on `355.3`'s precedent and on
Slice 354's measurement that `192.1` is applied in 1 of 161 slices.

**Nothing this wake did is outward-facing or hard to reverse.** The diff is
`ROADMAP.md`, one new `.roundtable/` report, and `.roundtable/**`. `LOOPS.md`,
`CLAUDE.md` and the dispatch region are **byte-for-byte unchanged** —
deliberately: the grill's own finding is that no mechanism is warranted.
