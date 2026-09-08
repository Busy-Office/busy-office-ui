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
found `origin/main` unmoved at `c369b054`, run twice (before the first commit and
again after the ROADMAP entry was written). One iteration recorded
(`Standardize · sweep · 342.1`, `landed`, with one `--also-refused`).

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## What landed: Slice 345 — the Standardize sweep, and `342.1` closed on it

**Rule 2 dispatched this**, at `Standardize 4 / 4 OVERDUE` — the counter the
previous hand-off predicted, re-read rather than trusted. All **4 of 4** lanes
were run. Lanes 2, 3 and 4 found nothing (figures in ROADMAP 345). Lane 1 IS
`342.1`, which had been filed precisely as "a lane-1 finding, not that item's to
spend".

```
scan:dead-style   before  52 dead declaration(s) on 13 page(s)
                          1,365 attrs · 1,854 decls · 357 multi
                  after   11 dead declaration(s) on  9 page(s)
                          1,365 attrs · 1,813 decls · 345 multi
```

**41 converted, 11 refused, and the re-run names the refusal set item for item**
— which is the check that matters, because `52 − 41 = 11` would also be
satisfied by a miscount. Two independent totals move with it: `−41` declarations
(one per conversion) and `−12` multi-declaration attributes (exactly the
conversions that left a single declaration behind). Attribute count is
**unchanged**, so nothing became an empty `style=""`.

**38 of the 41 came from FOUR source lines** — `AppTile.astro`'s `MARK` (14
sites), `reference/events.astro`'s payload `<ul>` (10), `reference/tokens.astro`'s
spacing swatch (10), `RfTaskMenu.astro`'s task label (4) — plus three one-off
lines on `/patterns/output-form`. The 13-page spread was four idioms multiplied
by their generators, not thirteen pages of drift.

## The per-site view had to be BUILT, and the instrument check came first

The shipped scan aggregates by declaration text and by page and never says which
element carries one, so a throwaway probe (deleted) copied its verdict logic
verbatim and emitted one row per site. **It reconciled at 52 rows against the
scan's 52 before a single verdict was written.** The eleven refusals each rest on
a measurement, not a judgement call — the colour-inheritance chain was walked in
**both themes**, `combobox.css`'s listbox margin was read inside its
`@supports (anchor-name: --a)` block, and the `inline-size: 100%` refusal is
discriminated by the identical idiom on `/patterns/login` NOT being reported
dead.

## One cost, and it is a sibling of a trap `ENVIRONMENT.md` already carries

The first `events.astro` comment was a `{/* … */}` block placed **inside a
ternary expression**, which is not a children position. `astro build` failed with
`Expected "}" but found "$$render"` pointing **11 lines below** the edit — the
same shape as the hoisted-import trap: an Astro compile error whose location is
in the COMPILED output. Caught by the build, not by review. Not proposed for
`ENVIRONMENT.md` — one observation, and the existing bullet already names the
mechanism.

## NOT VERIFIED, said plainly — and this wake DOES add visual debt

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.** Unlike
the previous two wakes, whose diffs could not move a pixel, **this commit changes
rendered pages**: `AppTile.astro`, `RfTaskMenu.astro`, `reference/events.astro`,
`reference/tokens.astro`, `patterns/output-form.astro`, and
`patterns/app-launch.astro`'s copyable sample.

Every removal is *proven* computed-style-neutral by the instrument that found it
— in screen and print, and in light and dark for the accent colour — and
`check:layout` (128 pages), `check:scroll` (914 containers) and `test:axe`
(128 × 2) all pass on the edited tree. What a cloud wake cannot do is LOOK.

**A local wake should glance at two things from this commit:**
`/patterns/output-form` **in print** (the figure, the barcode quiet zone), and
the RF tile grid on `/patterns/rf/rf-landing-rf/` at both widths.

**The six older visual debts are unchanged and unspent:** `292.4/292.5`'s
screenshot lane on `/components/icon`; the withdrawn-claim paragraph and Slice
325's performance paragraph on `/components/data-table`; Slice 319's paragraph on
`/patterns/kanban` at 390px; `320.3`'s `ApiTable.astro` `0.5rem` against
`ClassRef.astro` `.4rem`; and Slice `310.1`'s three `prod/` Refresh buttons.

**Gates green:** all **17** CI-runnable entry points on the pre-commit tree —
core `build`, core `test` (29 files, 165 tests), `lint:css`, `docs:build`,
`check:claims` (**176** live · 3 NOT VERIFIED, which is `ENVIRONMENT.md` §6b's
container fact), `check:formatting`, `check:scroll`, `check:layout`,
`check:forced-colors`, `test:axe` (zero violations), `check:target-size`,
`check:search`, `check:pseudo`, `check:quickstart`, `check:po-app` (20
behaviours), `check -w create-ui`, `npm run suite` (28 screens × 2). Plus
`check:selftests` (55 gates: 21 heuristic, 34 exact), `check:viewport-forks`, and
`check:vendor-names` run **directly at its real path**
(`apps/docs/scripts/check-vendor-names.mjs`, **614** files — a passing gate, not
a census of the source tree). **`docs:build` was re-run after this file was
written**, per `ENVIRONMENT.md` §3b.

**The `verifier` agent is not available in this session**, so `LOOPS.md` §2 step
6's verifier pass was done by hand — the staged diff re-read adversarially. What
it caught: the heading and body both said *"five source lines"* where the honest
count is four lines plus three one-offs. Corrected before the commit.

## The open set is 30 — no P0, and 19 are cloud-takeable

`roadmap_scope.py` at `161ede68` reports **30 open / 79 closed**, and the raw
checkbox count agrees. This commit closed `342.1` and opened `345.1`, so the
total is unchanged. **Re-run the script** rather than quoting this.

- **cloud-takeable: 19** — `324.1`, `324.2`, `325.1`, `325.2`, `326.3`,
  `327.3`, `328.1`, `330.1`, `331.1`, `332.1`, `333.1`, `334.1`, `335.1`,
  `336.2`, `337.1`, `338.1`, `339.2`, `341.1`, `345.1`.
  **`324.1` is still the oldest of these.** `335.1` still carries its caveat:
  settling it may mean filing a throwaway Q&A discussion, an outward-facing
  write to a public repo whose permission has **not** been tested.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3` (**BLOCKED ON OWNER BRIEFS**), `112.4` (blocked on 112.3's verdict),
  `249.7`, `249.10`, `249.11`, `249.12`, `249.13`, `273.2` (**OWNER CALL**),
  `296.3` (**OWNER CALL**).
- **browser-blocked in the SCREENSHOT sense (1):** `320.3`.

19 + 10 + 1 = 30, asserted rather than left to the reader. **The fifth kind,
`artifact-lost`, is empty.**

## Step 1 — both intakes read, with the controls ENVIRONMENT.md §8 names

```
/issues?state=open  -> HTTP 200, len 1     #2, updated 2026-09-06T15:10:34Z
/discussions        -> HTTP 200, len 0     the reading
/not-a-real-route   -> HTTP 404            an unserved route does NOT answer 200 []
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so
Step 1 committed nothing. **Issue #2's `updated_at` has not moved for an
ELEVENTH consecutive hand-off.** See Direction.

## Rule-by-rule dispatch trace

Rule 1: no open P0 — `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**
across the 30 open items. **Rule 2 matched** at `Standardize 4 / 4 OVERDUE`.
Rule 3 was ALSO overdue (`3 / 3 [320, 322, 323]`) and is evaluated below rule 2,
so it waited. Rules 4-8 not reached.

**Rule 5 was not reached and would not have fired.** Its line read `ok` — not
STALE, not SKEW — and the comparable set's movers are `claims` (+7, rising is the
goal) and `dispatch-region-words` (+194, one day-pair). One metric was recorded
this wake (`dead-declarations` 11, against the 52 recorded at 00:53 the same
day), which adds a sample but **no new day-pair**, because
`dispatch_status.py` pairs by DISTINCT DAY.

## What the next wake should reach for: rule 3, the Objective grill

Measured immediately after `record_iteration.py`, which is the comparison
`LOOPS.md` says finds the counter bugs — not predicted:

```
Standardize   0 / 4 Continue rounds  since 2026-09-08 04:59   ok
Objective     4 / 3 slices           since 2026-09-08 00:17   OVERDUE  [320, 322, 323, 342]
-> a counter is at or past its threshold; the dispatcher should pick it
```

Rule 2 reset on this wake's own row, so **rule 3 is the first match** and the
grill's arming set is `[320, 322, 323, 342]`. Rule 4 on `324.1` is not reached.
Re-run it — a collision could land a row between this line and your wake.

## The archive sweep was evaluated this wake and declined on the measured trigger

`roadmap_scope.py` at `161ede68`: closed-history share **3,650 / 9,486 =
38.5%**, 18 eligible targets, **10 of them named by a still-open item** (236.2 —
read each before moving it). The trigger the last sweeps actually used: 252.1
dispatched the tenth at **55.1%**, 272.1 the eleventh at **56.7%**, and 279.3
declined the twelfth at **40.6%**. 38.5% is below all three. Re-run the script;
this commit moves the numbers.

## The standing environment fact: CI HAS NO `paths-ignore`

`312.2` removed it entirely. **A push that touches only `.roundtable/**` runs
the full suite.** The consequence a wake feels directly is `ENVIRONMENT.md` §3b
— *re-run `npm run docs:build` after writing this file, before pushing* — and it
was executed this wake, after this file was written, before the push.

## CHECK CI AFTER PUSHING

Read the runs after your push; one `actions/runs?branch=main` read costs nothing
and is the only thing standing between a red `main` and the next wake.

## Step 0 traps

Trap 1 bit again — the fetch reported a forced update `26447ba...c369b05` and the
container started **detached** (`git branch --show-current` empty); fixed with
`git checkout -B main origin/main` before any commit. Trap 2 was clean in one
`--unshallow` (no `shallow.lock`) and again brought the tags; `git tag | wc -l`
→ **8**, run rather than assumed. Trap 1c was respected: `CHROME_PATH` was
exported **in the same command** as every browser gate — including
`scan:dead-style` and both throwaway probes, which `ENVIRONMENT.md` §1c names as
the case that bit a previous sweep. No `git stash` at any point. **The previous
hand-off's background-wait finding was not re-tested**: every long gate was run
in the FOREGROUND with the tool's own timeout, and none exceeded it.

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

**`249.12` is named for a FIFTH consecutive wake.** Five consecutive wakes have
now declined an archive sweep on the absence of a stated trigger (279.3 at 40.6%,
then 33.1%, 32.4%, 35.6%, and this one at 38.5%). The item is filed as low
urgency because *"the sweep keeps happening regardless"*; that sentence has now
been false five times running. **Nothing is proposed here** — the point is only
that the item's own urgency note has drifted further from the practice.
