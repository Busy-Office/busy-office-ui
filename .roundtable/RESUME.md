# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and two advisory checks run from `record_iteration.py` — the charter
> check and `check:resume-slice-ids`. Both REPORT on stderr; neither fails a
> build (roadmap 175.3).

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

---

## In flight: nothing

Last updated 2026-08-29 (cloud wake, scheduled routine). Dispatched **rule 4**,
landed **200.4**, and filed **205.1** from inside that dispatch. Working tree
clean at hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md                # 8 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs       # names the closed ids
```

## ⚠ THE THING THE NEXT WAKE MOST NEEDS: THE NEXT DISPATCH IS **RULE 2**, NOT RULE 4

`dispatch_status.py` reads **Standardize 4 / 4 Continue rounds — OVERDUE**
after this wake's row. Rule 2 sits above rule 4, so the next wake dispatches
**Standardize**, not the next build item. Re-run it rather than trusting this
line — and note *why* it is trustworthy this time: this wake's own row is what
moved it 3 → 4, and reading the counter immediately after recording is exactly
the comparison LOOPS.md says has caught two of that counter's five failures.

Standardize's playbook has four sweeps that are the whole point of the lane —
`scan:dead-style`, `report:css-repeats`, `report:prose`, and
`report_loop_prose.py` (read the **`ratchet` block first**, never the delta).

## CI IS GREEN AGAIN — RUN 648, AND 647 IS NOT A DATA POINT

The previous hand-off made this the first thing to check. Both dispatchers
answered it and agree:

| run | sha | conclusion |
|---|---|---|
| 641 | `93b17a6` | success — the last green before the break |
| 642–646 | `36a95d4` … `56b85a2` | **failure** ×5, including `645` = `Release 0.6.0` |
| 647 | `7610b52` | **cancelled** — superseded under the workflow's concurrency group |
| 648 | `3d35a79` | **success**, all 6 jobs |

**647's `cancelled` is not a verdict either way**, and it sits directly above
five real `failure`s in the run list where it is easy to miscount. A second push
inside one wake cancels the first run — which gives "one push per wake" a second
reason beyond the Pages/CDN churn the operating rule already names. 648 is the
run that actually clears `204.1`.

**The durable fact is unchanged and is not the tally: nothing in the loop reads
CI.** No dispatcher rule looks at it, and five wakes — including the one that cut
a release — ran inside that red window. Every wake that found it found it by
running `check:claims` from the cloud prompt's pre-push list. Still not filed as
an item, deliberately: a "check CI every wake" rule would be one
`mcp__github__actions_list` call and the fifth process rule with nothing
mechanical behind it. Stated so the next wake makes its own call with the cost
visible.

## 200.4 landed — and the part worth reusing is the red-proof that FAILED

Full figures are in ROADMAP 200.4; **re-run them, do not re-derive them**. Three
things that reading the CSS would not have given:

1. **The wrap comparator's first red-proof came back GREEN, and it was the
   injection.** `flex-wrap: nowrap` is inert on this demo because the bar
   already occupies ONE row at 390px — forbidding a wrap that is not happening
   changes nothing. `max-inline-size: 120px` against a 177.67px bar moved it
   1 → 2 rows, and the computed value was read (**`none` → `120px`**) to confirm
   the injection landed *before* the red was believed. CLAUDE.md's rule,
   executed rather than read.
2. **"Entrance only" is structural, not a zeroed duration.** The `transition` is
   on the visible rule and not on the hidden base rule, so the hide direction's
   after-change style declares no transition. Measured: at the clearing click
   `display` is *already* `none` and `getAnimations()` is `[]`. This is the one
   place the recipe departs from `.bo-dialog` / `.bo-dropdown` / `.bo-offcanvas`
   — no `display … allow-discrete`, because what that buys is holding the box
   rendered through a fade-OUT and there is no fade-out.
3. **The zero-JS `:has()` branch was measured, not inherited from the shared
   selector.** Same `0` / `0px -4px` / 150 ms pair with `data-any-selected`
   removed and the checkbox set without a change event.

`check:composited` failed the build on the first attempt, which is the gate
working: `@starting-style { … opacity: 0 }` is a dimming declaration in the
shipped CSS and now carries a registry entry.

## 205.1 filed from inside the dispatch, deliberately not fixed there

This wake shipped the **first** `@starting-style` into `rf-essentials.css`
(`git show HEAD~1:…/data-table.css | grep -c starting-style` → 0), whose target
is **chrome >= 108**, and `@starting-style` is **117**. `check:rf-floor` passed
while printing *"every use of a feature above Chrome 108 is guarded"* — its
`FEATURES` list is six probes and its at-rule arm short-circuits, so an unlisted
at-rule is invisible to it.

**Not a shipped bug** — an unknown at-rule is dropped whole by CSS error
handling, which is exactly the `degrades` tier `derive-floor.mjs` already
records for it, and `translate` is Chrome 104 so the visible rule still renders.
The gap is between the gate's sentence and the gate. 205.1's Accept allows
"narrow the message" as a fully satisfying outcome, so it is not a demand for a
new probe.

## ⚠ THIS WAS A CLOUD WAKE — WHAT WAS NOT LOOKED AT

No Podman, no `localhost:8081`, **no screenshots at 1440px or 390px in light or
dark**. Every figure in 200.4 is a computed-style or geometry reading from
headless Chrome (`browser-harness.mjs` + `serve-dist.mjs`). Nothing is described
as if it were seen.

**Whether the 150 ms lift LOOKS right is unverified** and no claim rests on it.
As with 200.3, a still screenshot could not settle it either — the resting
pixels are unchanged by construction, and that is measured rather than argued
(rects identical to the pre-change rendering at both 390 and 1440). What a local
wake should do is *watch* `/components/data-table/` while ticking a row.

No `verifier` agent is available in this session; the staged diff was read by
hand, said plainly rather than logged as a verifier pass. That read caught one
real imprecision before commit: a CSS comment claimed the RTL measurement
covered "the same settled rect", and it covers the START value only.

Gates on the pushed tree: core `build` + `test` **146**, `docs:build`,
`check:repo` (slice-refs **410** citations / **187** slice numbers),
`check:claims` **151 + 3 NOT VERIFIED**, `check:layout` **127 pages**,
`test:axe` **127 pages × 2 widths, zero violations**.

## ⚠ ONE COLLISION, CAUGHT BY THE MANDATED FETCH BEFORE THE FIRST COMMIT

`3d35a79 → 4d4b0028`, **1 commit** — the other dispatcher's hand-off recording
run 648 green. Caught by Step 0c's `git fetch origin main` immediately before
the first commit; fast-forwarded cleanly, and `200.4` was re-checked as still
open on the merged tree before any box was ticked. Its diff touched `RESUME.md`
only, so there was no overlap with this wake's work. **Cost: nothing.** That is
now four consecutive collisions caught before a commit rather than at push
rejection.

## Counters after this wake

Verified after recording: **1166** rows by the parser against a raw
`grep -c "^- "` of **1166**, and the `loops.db` mirror at **1166**.

```
Standardize   4 / 4 Continue rounds   OVERDUE   <- next wake dispatches this
Objective     2 / 3 slices            ok        [200, 204]
Optimize      0 wake-date(s) newer    ok        [newest pair: axe-violations]
```

**Rule 5's instrument is NOT stale** — `0 wake-date(s) newer`, so rule 5 was
answerable and found nothing. Re-run `dispatch_status.py` rather than trusting
this block.

**No metric recorded**, deliberately: every figure this wake characterises one
declaration or one moment, not a repeatable sample under an existing name, and a
single-sample name pads the store rule 5 reads (184's discipline).

## What the next wake should expect

**Rule 2 fires first** (above). If a Standardize round comes back clean, rule 4
lands on the table below. Re-count rather than copying:

| item | blocked on | which kind (LOOPS.md rule 4) |
|---|---|---|
| `200.5` | nothing structural — but see the `hover` note | **dispatchable, cloud included** |
| `200.6` | nothing — a built-CSS read plus a docs paragraph | **dispatchable, cloud included** |
| `200.7` | nothing — a lint check, and `201.4` constrains it | **dispatchable, cloud included** |
| `201.4` | nothing — a measurement + a decision | **dispatchable, cloud included** |
| `205.1` | nothing — a gate message or a probe, plus a base rate | **dispatchable, cloud included** |
| `112.3` | the owner writing 5 real ERP screen briefs with sealed picks | **owner-blocked** |
| `112.4` | `112.3`'s verdict | **owner-blocked** |
| `15.12` | owner hardware — a human listening to a screen reader | **owner-blocked** |

**The `hover` note on `200.5`, carried forward because it is now twice
relevant:** per `204.1` this container reports `(hover: none)` and
`(pointer: none)`, so a *CSS* `:hover` rule is not exercisable here — but a JS
`mouseenter`/`focusin` handler is, and 200.5's "auto-dismiss timers pause on
hover/focus" is a JS behaviour. Read the Accept and ask which of
ENVIRONMENT.md's two lists it needs, rather than inheriting a label. That
correction has now paid off three times (`173.2`, `200.2`/`200.3`, and `200.4`
this wake).

**One staleness spotted and NOT filed**, because it is narrative rather than an
open checkbox: the `## Sequence` section's "Gated, not sequenced" list (around
line 219) still names **185.2** as waiting on the owner's npm account, and still
carries an "OWNER CALL — direction: awaiting the owner's push + GitHub Release"
line from the 0.3.0 era. Both are done. Rule 4 reads `N. [ ]` checkboxes, so
neither misroutes a dispatch — but a wake reading that list for context will be
misinformed. A Standardize round is the natural place for it.

**Do not re-raise Slice 179's or 182.2's refusals, 176.3, the retired
product-vs-machinery ratio, Slice 195's finding A, 167.1's retired `CLAUDE.md`
watch, `199.1`/`104.4`'s thrice-refused complexity filter, the seven
fallback-carrying undefined tokens, or forcing a desktop-class pointer in
headless Chrome (six variants measured, none works — `204.1`).** New to this
list: **`display … allow-discrete` on the bulk-actions bar** — refused inside
200.4 with the reason, since it would create the exit flourish that item's
Accept excludes.

**Two blind re-scores are still owed and neither can be done in a cloud wake**
(§3b step 4 needs a second agent): `scan`'s three fixed dimensions, and
`skeleton · colour`. Unchanged. `data-table`'s CSS changed this wake, so it will
re-queue in `polish_requeue` alongside `scan`, `tabs` and `segmented`.

**Adjudicated at hand-off**, which is the step `check:resume-slice-ids` exists
to prompt. Every closed id named in this file is either **this wake's own closed
work** (`200.4`), **a historical reference in the past tense** (`204.1`,
`200.2`, `200.3`, `173.2`, `185.2`, archived), or **a refusal named only to say
it must not be re-raised** (`199.1`, `104.4`, `176.3`, `182.2`). **None is a
claim that any is open.** The genuinely open ids — `200.5`, `200.6`, `200.7`,
`201.4`, `205.1`, `112.3`, `112.4`, `15.12` — are in the table above. Re-run the
check after the next recording; the count moves with every rewrite.

## Direction — the owner's pick, and whether THIS wake advanced it

**Standing section, added by 168.1 (2026-08-28). Answer all four every wake,
from the sources named — never by copying the answers above you.**

- **Direction:** (a) adoption/DX — finish it by publishing
  `@busy-office/create-ui`. Source: the `DECISION (owner, 2026-08-28)` block in
  Slice 164.3, which lives in **`ROADMAP-archive.md`**, not `ROADMAP.md`.
- **Remaining step, and who it waits on: NONE — the direction is DONE**, and
  re-checked here rather than copied. The registry answers
  **`create-ui` `0.1.1`** against **`ui` `0.6.0`**, both asked this wake, so the
  scaffolder is no longer stranded and carries SLSA provenance.
- **Did this wake advance it?** **No.** Rule 4 dispatched a component CSS item;
  nothing in the diff touches `create-ui`.
- **Work rows since the direction was decided that did not advance it:**
  **84 of 91** (derived this wake, not incremented). Re-derive rather than
  copying — and read it as a **rate, not a state**: the owner was shown this
  ratio and decided to keep the routine running hourly anyway (2026-08-28).
  *(Last honest reads: 84 of 91, 83 of 90, 78 of 84, 74 of 80, 69 of 72, 68 of
  71, 65 of 68, 61 of 64, 56 of 59, 55 of 58, 52 of 55, 49 of 52, 46 of 47, 43
  of 44, 41 of 42, 38 of 39.)*
  **Snapshot caveat, and it is real:** both dispatchers append to this log, so
  a figure taken mid-wake moves under you.

  ```
  # `git diff fb15cdc..HEAD` MISSES the current wake's rows until they are
  # committed; drop the `..HEAD` to diff the working tree instead.
  git diff fb15cdc -- .roundtable/loop-log.md | grep '^+- ' \
    | grep -v ' · Meta · ' | grep create-ui        # print them, don't -c them
  ```

  Left as a two-line read rather than a smarter regex on purpose: any needle
  that tries to separate "advanced" from "mentioned" is guessing at intent from
  prose, which is the semantic-vs-shape line CLAUDE.md draws (94.11).
- **Is that ratio a PROBLEM? No — the owner was shown it and decided otherwise
  (2026-08-28)**, choosing to keep the routine running hourly. Do not re-triage
  it and do not slow the routine on your own judgement.

  **But the question it was built to answer still needs a new object**, and this
  is the second consecutive wake saying so. Direction (a) is finished, so the
  ratio measures distance from a completed goal. **`ROADMAP.md` has no
  owner-set direction after (a)** — re-checked this wake, not assumed: the only
  owner decision blocks it carries are `112.3`'s briefs and the already-closed
  `176.3`. That is an owner call, not this loop's, and it is stated here rather
  than filed because the whole point of this section is that it is where the
  loop says what it cannot decide.

```
npm view @busy-office/ui version            # 0.6.0   (asked 2026-08-29)
npm view @busy-office/create-ui version     # 0.1.1   (asked 2026-08-29)

# fb15cdc is the commit carrying the owner's decision. UNSHALLOW FIRST
# (ENVIRONMENT.md trap 2) or these resolve nothing and the rate is silently
# missing, not wrong.
```

**The CHANGELOG's `Unreleased` block now carries two `Changed` entries** — 200.3
and 200.4 — both against the shipped 0.6.0 and both recorded **not breaking**
with the reasoning rather than the assertion. 200.4 adds three declarations to
one existing rule whose settled values are the identity values (`opacity: 1`,
`translate: 0 0`), so a consumer's resting rendering is unchanged. Publishing
remains owner-triggered.
