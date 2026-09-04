# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and two advisory checks run from `record_iteration.py` — the charter
> check and `check:resume-slice-ids`. Both REPORT on stderr; neither fails a
> build (roadmap 175.3). Run both against the file as it now stands rather
> than trusting a stale reading.

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

**Citation practice for this file: cite by slice number only, never by raw
`ROADMAP.md:NN`.** A slice number survives every rewrite; a line number
survives none.

---

## In flight: nothing

Last updated 2026-09-04 (**cloud** wake, scheduled routine). Working tree clean
at hand-off. Two commits this wake, both pushed: Slice 258 and this hand-off.

**`check:resume-slice-ids` names five closed ids, and all five are deliberate.**
It reported `258.1, 249.1, 249.2, 249.3, 249.4` when this file was written.
`258.1` appears below only as *what this wake closed*; `249.1`-`249.4` appear
only inside the sentence explaining why Slice 249 was dropped from this wake's
grill scope — *which earlier grills already covered it* — which is a historical
reference, not a claim that any of them is open. Nothing below queues or blocks
on any of the five. The check says outright it cannot tell the two apart; this
paragraph is the answer so the next wake does not re-derive it.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## Direction

Nothing new from the owner this wake, and nothing owner-facing is newly
blocked. The two standing owner blocks are unchanged: Slice 15's `AT runtime
evidence` (owner hardware) and `112.3`/`112.4` (owner briefs, then 112.3's
verdict).

Nothing this wake needs an owner decision. The item closed was an Objective
grill; its four corrections are all to prose or to an advisory line, none
changes a shipped behaviour, and none is a judgement call anyone else has to
make.

## ⚠ The correction most likely to be re-broken

**Rule 5's staleness counter counts DISTINCT LOG DATES, not wakes** (258.1
finding D). The hand-off you are replacing said *"every decline ages the rule by
one wake-date"*, and that is false: Slices 255 and 256 both sat on 2026-09-03,
the same date as the newest comparable pair, and aged the rule by **zero**;
only Slice 257 moved it, by falling on 2026-09-04. Several wakes on one date add
nothing; one wake on a new date adds the whole step.

**Do not re-derive this from here** — `dispatch_status.py` now prints it under
the rule-5 advisory, which is the point of reading, and its `stale` line carries
the comment. That placement is deliberate: a correction written only into this
file dies in the next wholesale rewrite (169.3).

## Dispatch counters at hand-off

Read `dispatch_status.py` yourself — the sets below are snapshots.

- **Rule 2 (Standardize)** reads `0 / 4` and is unmoved: this wake ran
  Objective, and rule 2 counts Continue rounds.
- **Rule 3 (Objective)** read `3 / 3 OVERDUE [249, 256, 257]` at wake start and
  was **discharged** by this wake's grill. It resets to `0 / 3`.
- **Rule 5 (Optimize) reads STALE, `1 wake-date(s) newer`** — unchanged from
  wake start, because this wake's rows land on 2026-09-04, a date already
  counted. `LOOPS.md` rule 5 is explicit that a STALE line means the rule has no
  input and must be reported as *could not be evaluated*; it was reported that
  way this wake and should be again until a sample lands.

  **No sample was recorded this wake, deliberately.** The diff is two build
  script comments, one loop script's output text and markdown, and changes **0**
  files under `packages/core/src/css/` — a `bundle-gz-kb` reading could only
  reproduce the existing value.

  **The previous hand-off's watch on this stands, with its arithmetic
  corrected.** It said 255, 256 and 257 had each declined a sample and that each
  decline aged the rule. Two of those three claims are wrong (256 declined
  nothing — rule 3 fired and rules 4-8 were never reached), and the aging is by
  date. So the honest form of the watch: **the counter will keep climbing one
  step per calendar date of loop activity until a wake genuinely changes the
  bundle**, whatever any wake decides about sampling. If it reaches ~5 with no
  CSS change in sight, the rule is dead again and that is the finding.

## Next wake

**Rule 4 (Continue, build mode) is the first rule that can fire** — rules 1-3
are clear and rule 5 is not a dispatch rule. Re-run `dispatch_status.py`; this
is a snapshot.

Rule 4's open set is `OPEN: [15, 112, 249]`, **11** open items. The
classifications below were each re-read against `ROADMAP.md` this wake, not
inherited, and are unchanged from the last hand-off:

- Slice 15's `AT runtime evidence` and `112.3`/`112.4` are **owner-blocked**.
- **`249.6` is browser-blocked in the SCREENSHOT sense** (`LOOPS.md` 186.2's
  vocabulary) — a LOCAL wake can take it; a cloud wake should not.
- **`249.7` is open as a COST question, not as unstarted work.** Its Accept's
  first clause has been executed: 4 of the 5 seed rows do not reproduce. Do not
  re-run that grep — the table is in the item. Settling it before the owner
  answers `249.10` would decide it on the thinnest possible input.
- **`249.9` is browser-blocked in the screenshot sense** — it builds a
  `/components/` catalogue whose point is rendered miniature previews. Its
  Accept's second half — *"the miniature-rendering build-time cost is measured
  and stated before this closes"* — is measurable anywhere, so a cloud wake
  could usefully measure and record that number without building the page.
  **This is still the best remaining cloud-takeable item on rule 4**, and it is
  now two hand-offs old without being taken.
- `249.10`, `249.11`, `249.13` are owner calls; `249.12` is owner-or-
  architecture, low urgency.
- **`249.15` is browser-blocked in the screenshot sense** (a static OG image).

## The archive sweep: not due, do not re-raise

`roadmap_scope.py` reads closed-history share **1,351 / 3,814 = 35.4%** at
hand-off — still well under the **55.1%** at which 252.1 dispatched the tenth
sweep on 2026-09-03. It read 32.0% at wake start; the share rose because Slice
258 closed *fully*, so its whole body is closed history the moment it lands.
That is arithmetic, not a backlog signal — the same mechanism the last two
hand-offs recorded for Slices 256 and 257, now three wakes running, which is
worth knowing before anyone reads the trend as regrowth. Eligible targets
`[258, 257, 256, 255, 254, 253, 252, 237]`, of which 253 and 237 are named by
the still-open Slice 249 and stay per 236.2. Re-run the script; these are
snapshots.

## What landed this wake

**One commit of substance, dispatched by rule 3 (Objective).** Rule 1 clear (no
open P0; GitHub intake `totalCount: 0`); Step 1 triaged and committed nothing —
no new input. Full report:
`.roundtable/grill-objective-256-257-2026-09-04.md`.

### Slice 258 — 58 of 62 assertions reproduce, and two failures are the grilled slices' own recorded defect

Scope narrowed per §6 step 0: the armed set was `[249, 256, 257]` and 249 was
dropped — Slice 253 grilled `249.1`/`249.6` and Slice 256 grilled
`249.2`/`249.3`/`249.4`, and what remains open in it is unbuilt. Four things
worth carrying:

1. **Two of the four failures are "a real count of a set the sentence does not
   name" — which is 256.1 finding A's own headline defect, appearing inside
   256.2 one item later and inside 257.1 one wake later.** 256.2's *"would miss
   75"* is **65** across the seven prefixes it enumerates (85 and 96 are the
   neighbouring sets; none is 75), and 257.1's *"`compatOf` appears twice"* is
   **three** definitions — the two bound aliases plus the canonical
   `export function` they point at. Both conclusions are unaffected; both were
   corrected in place.
2. **A citation that no longer resolves, in the header of the module built to
   stop that.** `pascal` derives `"ProbeWidget"`; the value `"Probe Widget"`
   came from `pascal.replace(/([a-z])([A-Z])/g, '$1 $2')`, the pre-249.8
   expression. `pascal` is still live for `init${pascal}`, so a reader who
   evaluates the identifier the comment names contradicts the comment. Both code
   comments corrected.
3. **The rule-5 date correction above**, fixed in `dispatch_status.py`'s output
   rather than in prose, and red-proved by discrimination with the injection
   confirmed first (`grep -cF` → 1, line moved 1 → 2 and listed both dates;
   restored → 0, `git status` clean).
4. **This wake's own probe was wrong on first output**, caught before use: the
   live width probe read `clientWidth`/`clientHeight` and counted rows
   document-wide (**896 × 382, 36 rows**) and would have reported 256 finding C
   as not reproducing. The container's own 15px scrollbar and 2px border, and
   three `.bo-data-table-container` elements on the page, account for all three
   numbers. The tell was `rowsFullyInside` coming back **9**, matching 256
   exactly, while the others did not.

**Not verified, and named rather than implied:** cloud wake, so the 1440/390
light-and-dark screenshot lane could not run. The diff is two build-script
comments, one loop script's output text and markdown — **0** files under
`packages/core/src/css/`, no page markup, built page count unchanged at **138**
— so there is nothing a screenshot could have shown. Every CI entry point that
runs in this container was run green here after the edits, including the ones
`docs:build` covers; `docs:build` and `check:floor` were re-run *after* the
`ROADMAP.md` edit.
