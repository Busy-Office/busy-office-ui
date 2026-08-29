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
landed **200.3**, and **rule 1 preempted mid-dispatch** on a P0 the wake found
by running the gates — landed as **204.1**. Working tree clean at hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md                # 8 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs       # names the closed ids
```

## ⚠ THE THING THE NEXT WAKE MOST NEEDS: CI WAS RED ON `main` FOR THREE COMMITS

Runs **642, 643, 644** all failed; run **641** (`93b17a6`) was the last green.
The break landed with `36a95d4`, and **v0.6.0 was released off that red main**
by the other dispatcher while this wake was diagnosing it. Fixed here (`204.1`),
but the operating fact is worth carrying: **nothing in the loop notices a red
`main`.** No dispatcher rule reads CI, `RESUME.md` had no place to say it, and
four wakes ran in that window without looking. This wake only found it because
`check:claims` is in the pre-push list the cloud prompt mandates.

**Not filed as an item, deliberately** — a "check CI every wake" rule is one
`mcp__github__actions_list` call and would be the fifth process rule with
nothing mechanical behind it. Stated here so the next wake makes its own call
with the cost visible.

## What 204.1 was, because the shape recurs

`check:claims` reported *"a documented behaviour does not hold"* about **CSS
that is correct**. 200.2 wraps the button press nudge in
`@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion:
no-preference)`, deliberately. Headless Chrome 141 reports **`(pointer: none)`
— not coarse, none** — so the rule is never live and the assertion could not
come out any other way. It passed for its author on a machine with a mouse.

| what was measured | verdict |
|---|---|
| `(hover: hover) and (pointer: fine)` in this container | **false**; `coarse` false, `none` **true** |
| the same failure in CI's log | **byte-identical** — same case, same `{"transform":"none","left":283,…}` |
| reproduced on an untouched `origin/main` (stash + clean rebuild) | **1 of 149 failing** — established before anything was fixed |
| six launch variants to force a desktop pointer | **none moves it** (see below) |
| `@media` blocks in shipped CSS keyed on hover/pointer capability | **exactly 1** — this rule |

**The refusal, so nobody retries it:** `--blink-settings=` with
`primaryHoverType`/`availableHoverTypes`/`primaryPointerType`/
`availablePointerTypes` at desktop values (2/2/4/4) **and** at touch values
(1/1/2/2), `--touch-events=disabled`, both together, and the old headless
shell. All six read identically to passing no flags at all.

**The fix is a third answer, not a skip.** `gate()` gained
`notVerified(claim, why)`: printed on every run, and **the count rides in the
PASS line** — `claims check passed — 151 documented behaviours verified live ·
3 NOT VERIFIED in this environment`. Same shape `check:rtl` already uses for
its absent `DESIGN.md`. The press contract is still asserted everywhere by a
**postcss walk of the built CSS**, red-proved by injection with the injection
confirmed first (`translateY(1px)` → `(3px)`, verified **1 → 0** occurrences
before the red was believed).

**The non-obvious half, and the part worth reusing:** the keyboard and
reduced-motion cases were marked un-evaluable *too*. Both assert
`transform: none`, so both look robust — but with the rule inert they assert
`none` against a rule that could not have produced anything else. **They would
have passed here while discriminating nothing.** When a gate's premise is
absent, its *negative* assertions go green, not red, and that is the direction
that hides.

## 200.3 landed — three things the measurement caught that reading the CSS would not

Full table of before/after figures is in ROADMAP 200.3; do not re-derive it,
re-run it. The three worth knowing:

1. **The first forced-colors override shipped and did nothing.** It went into
   `tabs.css`'s existing `@media (forced-colors: active)` block, which sits
   **above** `.bo-tabs__tab`. Same specificity, so source order decided and the
   base rule won — the computed `transition-duration` under emulated
   forced-colors still read `0.1s, 0.1s, 0.1s` *with the override present in
   the built CSS*. Moved below the rule it overrides. `check:motion` could
   never have seen it: that gate asks about `prefers-reduced-motion`.
2. **`border-color` (shorthand) does animate `border-inline-end-color`**
   (logical longhand) — which is why ONE declaration covers the horizontal
   strip, the vertical rail and the narrow-container fallback.
3. **`box-shadow` is NOT dropped by the UA in forced colors here.** The comment
   first written asserted it was; `forced-color-adjust: none` opts the checked
   option out of that too.

**A red-proof that came back green, resolved as a defect in the injection**
(CLAUDE.md's rule, executed rather than read): the strip-block-size case would
not go red on an injected `padding-block` for the selected tab — because **one
tab is always selected**, so the padding merely moves between tabs and the
delta stays zero. An *asymmetric* injection (`:nth-child(2)[aria-selected]`)
took it 39 → 71. The detector was fine both times.

## ⚠ THIS WAS A CLOUD WAKE — WHAT WAS NOT LOOKED AT

No Podman, no `localhost:8081`, **no screenshots at 1440px/390px in light or
dark**. Every figure in both slices is a computed-style, geometry or
accessibility reading from headless Chrome (`browser-harness.mjs` +
`serve-dist.mjs`). Nothing is described as if it were seen.

**This matters for 200.3, and the honest framing is narrower than usual:**
whether a 100 ms colour settle *looks* right — the entire design argument for
the change — is **unverified**. But note a still screenshot could not settle it
either: **the resting pixels are unchanged by construction**, so what a local
wake should do is *watch* `/components/tabs/` and `/components/segmented/`,
not screenshot them.

No `verifier` agent is available in this session; the staged diff was read by
hand, said plainly rather than logged as a verifier pass.

Gates on the pushed tree, **re-run in full after the rebase** rather than
trusted from the pre-collision build: core `build` + `test` **146**,
`docs:build`, `check:repo` (slice-refs **408** citations / **186** slice
numbers), `check:claims` **151 + 3 NOT VERIFIED**, `check:layout` **127
pages**, `test:axe` **127 pages × 2 widths, zero violations**,
`check:selftests` **46 gates / 30 exact**.

## ⚠ ONE COLLISION, CAUGHT BY THE MANDATED FETCH BEFORE THE FIRST COMMIT

`36a95d4 → 56b85a2`, **5 commits** — including **`fffae6c` Release 0.6.0** and
`185.2` closing. Caught by Step 0c's `git fetch origin main` immediately before
the first commit; fast-forwarded cleanly, no file overlap with this wake's
work, and the full gate suite was re-run on the rebased tree rather than
carried over. **Cost: nothing.** That is now three consecutive collisions
caught before a commit rather than at push rejection — the fetch is doing the
work Step 0c says it does.

## Counters after this wake

Verified after recording: **1163** rows by the parser against a raw
`grep -c "^- "` of **1163**, and the `loops.db` mirror at **1163**.

```
Standardize   3 / 4 Continue rounds   ok
Objective     2 / 3 slices            ok   [200, 204]
Optimize      0 wake-date(s) newer    ok   [newest pair: axe-violations]
```

**Rule 5's instrument is NOT stale** — `0 wake-date(s) newer`, so rule 5 was
answerable and found nothing. Re-run `dispatch_status.py` rather than trusting
this block; two of this wake's own rows moved it.

**No metric recorded**, deliberately: every figure this wake characterises one
declaration, one media query or one moment, not a repeatable sample under an
existing name, and a single-sample name pads the store rule 5 reads (184's
discipline).

## What the next wake should expect

Rules 2 and 3 are both one short of firing, so **rule 4 fires again**. Re-count
rather than copying:

| item | blocked on | which kind (LOOPS.md rule 4) |
|---|---|---|
| `200.4`, `200.5`, `200.6` | shipped-CSS rendering changes | **see the note below — less browser-blocked than the last hand-off claimed** |
| `200.7` | nothing — a lint check, and `201.4` constrains it | **dispatchable, cloud included** |
| `201.4` | nothing — a measurement + a decision | **dispatchable, cloud included** |
| `112.3` | the owner writing 5 real ERP screen briefs with sealed picks | **owner-blocked** |
| `112.4` | `112.3`'s verdict | **owner-blocked** |
| `15.12` | owner hardware — a human listening to a screen reader | **owner-blocked** |

**The last hand-off classified `200.2`–`200.6` as browser-blocked "needing
1440/390 × light/dark screenshots". That was too broad, and this wake is the
second data point after `173.2`.** A local wake took `200.2` with computed-style
and CDP input measurements — not screenshots — and this cloud wake took `200.3`
the same way. Both items' Accept criteria are DOM, geometry and computed-style
assertions, which is exactly ENVIRONMENT.md's "can run" list. **Read each
remaining item's Accept and ask which of the two lists it needs**, rather than
inheriting the label: `200.5`'s "auto-dismiss timers pause on hover/focus" is
measurable; `200.4`'s "RTL entrance direction verified, not assumed mirrored"
is measurable. Note `hover` specifically: per `204.1`, this container reports
`(hover: none)`, so a *CSS* `:hover` rule may not be exercisable — a JS
`mouseenter` handler still is.

**Do not re-raise Slice 179's or 182.2's refusals, 176.3, the retired
product-vs-machinery ratio, Slice 195's finding A, 167.1's retired `CLAUDE.md`
watch, `199.1`/`104.4`'s thrice-refused complexity filter, or the seven
fallback-carrying undefined tokens.** New to this list: **forcing a
desktop-class pointer in headless Chrome** — six variants measured, none works
(`204.1`).

**Two blind re-scores are still owed and neither can be done in a cloud wake**
(§3b step 4 needs a second agent): `scan`'s three fixed dimensions, and
`skeleton · colour`. Unchanged. `scan`'s CSS changed in 201, and `tabs`/
`segmented` changed this wake, so all three will re-queue in `polish_requeue`.

**Adjudicated at hand-off**, which is the step `check:resume-slice-ids` exists
to prompt. Run against this rewrite it reports **17 ids named: 7 closed and 2
archived**. Every one is adjudicated: **this wake's own closed work**
(`200.3`, `204.1`); **a historical reference in the past tense** (`200.2` and
`173.2`, the two items that show the browser-blocked label was too broad;
`185.2`, archived, named only to record that the release closing it is what
completed direction (a)); or **a refusal named only to say it must not be
re-raised** (`199.1`, `104.4`, `176.3`, `182.2`). **None is a claim that any is
open.** The genuinely open ids
— `200.4`, `200.5`, `200.6`, `200.7`, `201.4`, `112.3`, `112.4`, `15.12` — are
in the table above. Re-run the check after the next recording; the count moves
with every rewrite.

## Direction — the owner's pick, and whether THIS wake advanced it

**Standing section, added by 168.1 (2026-08-28). Answer all four every wake,
from the sources named — never by copying the answers above you.**

- **Direction:** (a) adoption/DX — finish it by publishing
  `@busy-office/create-ui`. Source: the `DECISION (owner, 2026-08-28)` block in
  Slice 164.3, which lives in **`ROADMAP-archive.md`**, not `ROADMAP.md`.
- **Remaining step, and who it waits on. THIS IS THE ANSWER THAT CHANGED —
  the direction is DONE.** The last hand-off's one open unknown was whether
  `@busy-office/create-ui` had a Trusted Publisher configured. It does, and the
  proof is a shipped release rather than a form: the other dispatcher published
  **v0.6.0** this hour (`fffae6c`), closing `185.2`, and the registry now
  answers **`create-ui` `0.1.1`** (was `0.1.0`) against **`ui` `0.6.0`** (was
  `0.5.0`). The scaffolder is no longer stranded and carries SLSA provenance.
  **Nothing in direction (a) is now waiting on anyone.**
- **Did this wake advance it?** **No.** Rule 4 dispatched a component CSS item
  and rule 1 preempted with a gate fix; nothing in either diff touches
  `create-ui`. The direction was completed *beside* this wake, not by it.
- **Work rows since the direction was decided that did not advance it:**
  **83 of 90** (derived this wake, not incremented). Re-derive rather than
  copying — and read it as a **rate, not a state**: the owner was shown this
  ratio and decided to keep the routine running hourly anyway (2026-08-28).
  *(Last honest reads: 83 of 90, 78 of 84, 74 of 80, 69 of 72, 68 of 71, 65 of
  68, 61 of 64, 56 of 59, 55 of 58, 52 of 55, 49 of 52, 46 of 47, 43 of 44, 41
  of 42, 38 of 39.)*
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

  **But the question it was built to answer now needs a new object.** This
  section exists so a direction nobody can advance cannot hide under healthy-
  looking maintenance. Direction (a) is finished, so the ratio is measuring
  distance from a completed goal, which is not the same question.
  **`ROADMAP.md` has no owner-set direction after (a)** — checked, not assumed:
  the only owner decision blocks open in it are `112.3`'s briefs and `176.3`.
  That is an owner call, not this loop's, and it is stated here rather than
  filed because the whole point of this section is that it is where the loop
  says what it cannot decide.

```
npm view @busy-office/ui version            # 0.6.0   (asked 2026-08-29)
npm view @busy-office/create-ui version     # 0.1.1   (asked 2026-08-29)

# fb15cdc is the commit carrying the owner's decision. UNSHALLOW FIRST
# (ENVIRONMENT.md trap 2) or these resolve nothing and the rate is silently
# missing, not wrong.
```

**The CHANGELOG's `Unreleased` block is no longer empty**: 200.3 is a `Changed`
entry against the just-shipped 0.6.0, recorded **not breaking** with the
reasoning rather than the assertion — it adds a `transition` to two rules and
changes no resting value, selector, custom property or markup contract.
Publishing remains owner-triggered.
