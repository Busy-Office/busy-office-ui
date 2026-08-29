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

Last updated 2026-08-29 (cloud wake, scheduled routine — **rule 3 → Objective,
grill of [190, 191, 192], landed as Slice 196**). Working tree clean at
hand-off; the wake's commits went out as one push.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md                # 6 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs       # names the closed ids
```

## ⚠ A COLLISION — and this time the other dispatcher's report landed at the SAME FILENAME

**Fourth recorded collision, second caught before any commit.** `git fetch
origin main` immediately before the first commit read `05809097..50d73b07`: the
local dispatcher had taken **the same rule-3 dispatch**, grilled the same
window, and pushed first as **Slice 195**, with its report at
`.roundtable/grill-objective-190-191-192-2026-08-29.md` — the exact path this
wake had already written.

Resolved per Step 0c (keep BOTH, neither is a duplicate) and the 189/190
precedent: this work was rebased onto `50d73b07`, renumbered **195 → 196**, and
its report renamed to the **`-b`** suffix. 195's findings have priority and are
credited in the report.

**Worth carrying forward as a mechanic, not just an incident.** Step 0c's
guaranteed collision points are `loop-log.md`'s append point and a ticked
`ROADMAP.md` box, and it already records that both can fail. **A third point
exists that it does not name: two grills of one window derive the same report
filename from the window itself**, so a `git mv`-shaped conflict is available on
a wake that has committed nothing. Here the fetch caught it first, so nothing
was lost; had this wake committed before fetching, the file would have collided
on content rather than on path. Not filed as an item — Step 0c's decision is
that collisions are accepted and its working half is the fetch, which worked.

## What landed this wake (2026-08-29, cloud, rule 3 → Slice 196)

**Thirteen claims from the window re-measured from the ARTEFACTS rather than
from the prose about them. Twelve reproduce; the thirteenth is not a number.**

| claim | verdict |
|---|---|
| `190.1`'s six-combination Accept | 6 of 6, −47/−51/−55 @1440, −29/−33/−37 @390 |
| `190.1`'s corpus instrument | 1 page of 137 nests the message |
| `190.2`'s `check:claims` | 144 |
| `190.3`'s three specificities | (0,4,0) (0,3,1) (0,2,0), 3 of 3 |
| `191.1`'s ratchet block | names `191.3`'s own cut at `9198e43f` |
| `191.3`'s rule 4 after the move | 752 words |
| `192.1`'s `CLAUDE.md` figures | 5,450 total, +202 on the section |

**The one that fails is `data-table.css`'s sentence that the cell error message
is "bounded so it can never introduce horizontal overflow".** At 390px it
introduces **83px** of it in a container that had none, in all three densities.
The cap bounds the message's WIDTH, not its RIGHT EDGE. Filed as **196.1**, open.

**n = 3 for `192.1`'s placement rule**, and instance 3 sits inside the fix for
instance 1. `191` and `192` are clean controls — recorded, so the rule is not
read as "every change rots".

**Two things this wake refused**, both recorded rather than done: a gate for
196.1 (94.11 — the base rate over the corpus is one candidate element), and an
item for the 13-word difference in `192.1`'s section word count (it is the
heading line; `191.2` recorded the same cause for its own 12).

**The probe that checked `190.3` was wrong twice before it was right** — three
reference selectors matched nothing, and the subject selector was *paraphrased*
(`:has(:user-invalid)` for the shipped `:has(input:user-invalid, …)`), which
differs by exactly the (0,0,1) that decides the question. **Copy a selector from
the sheet; never retype it from memory of what it says.**

## ⚠ THIS WAS A CLOUD WAKE — WHAT WAS NOT LOOKED AT

No Podman, no `localhost:8081`, **no screenshots at 1440px/390px in light and
dark**. Nothing was visually verified and nothing is described as if it were.

**Nothing this wake needed one.** `git diff --stat` names `ROADMAP.md` and one
`.roundtable` report — no `.css`, no `.astro`. Every figure above is a DOM,
computed-style or layout-geometry reading, which `ENVIRONMENT.md`'s cloud-wake
section lists as takeable here. `ROADMAP.md` **is** read by the docs build
(`gen-llms.mjs`), which is why the whole chain was re-run after the edit rather
than trusted from the pre-edit build.

Gates green on the merged tree (`a07d5830`): core `build` + `test` (**146**
passed), `docs:build`, `check:repo` (selftests **45 gates, 16 heuristic all
self-tested**; slice-refs **396** citations / **178** slice numbers; dist-walkers
63 scripts), `check:claims` **144**, `check:layout` **127** pages, `test:axe`
**127 pages × 2 widths, zero violations**.

No `verifier` agent is available in this session, so the staged diff was read by
hand — said plainly rather than logged as a verifier pass.

**Traps exercised for real this wake:** 1 (the container started **detached** —
`git branch --show-current` empty, local `main` stale at the pre-rebase
`17b3ba67`; repaired with `git checkout -B main origin/main` before any commit),
2 (unshallowed before any history figure: **1,618** commits), 1c (`CHROME_PATH`
exported in the same command as every browser gate).

## Counters after this wake

Verified after recording: **1129** iterations by the parser against a raw
`grep -c "^- "` of **1129**.

```
Standardize   1 / 4 Continue round   ok
Objective     0 / 3 slices           ok   (reset by this wake's row)
Optimize      0 wake-date(s) newer   ok   [newest pair: axe-violations]
```

**Rule 5's instrument is NOT stale** — `0 wake-date(s) newer`, so rule 5 was
answerable and found nothing.

**No metric recorded**, deliberately: every figure this wake is a one-off
characterisation of someone else's claim, not a repeatable sample under an
existing name, and a single-sample name pads the store rule 5 reads (184's
discipline).

## What the next wake should expect

**Rule 3 is discharged (0/3), rule 2 reads 1/4, so rule 4 is where the next wake
lands.** Checkboxes at hand-off — re-count rather than copying:

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md      # 6
```

| item | blocked on | which list does it need? |
|---|---|---|
| `15.12` | **owner-blocked** (owner hardware, AT runtime) | neither; no wake can take it |
| `112.3`, `112.4` | **owner-blocked** (briefs; `112.4` waits on `112.3`) | neither |
| `193.1` | nothing | cloud-takeable — execute 167.1's reopen on `CLAUDE.md`; **folding nothing closes it** |
| `193.2` | nothing | cloud-takeable — one measurement and a decision; **refusing a mechanism is the expected outcome** |
| `196.1` | nothing | **split by branch** — see below |

Oldest still-open is `15.12`, then `112.3`/`112.4`, all owner-blocked — so the
oldest *dispatchable* one is still **`193.1`**. Say **which kind** of blocked
when reporting rule 4 as finding nothing (`LOOPS.md` rule 4: owner-blocked /
browser-blocked / agent-blocked), and for a browser-blocked one name which of
`ENVIRONMENT.md`'s two lists it needs.

**`196.1` is split by branch, and the split is the honest part.** Its Accept
allows either bounding the right edge (changes rendering) or correcting the
comment (does not). **Branch (b) is fully cloud-takeable** — it is prose about
code, and every measurement it needs is in §B of the report. **Branch (a)
changes what a user sees**, so a cloud wake taking it must name the screenshots
as not taken; a local wake can close it outright. The geometry evidence itself
is *not* the blocker: this wake took all of it here.

**Two blind re-scores are still owed and neither can be done in a cloud wake**
(§3b step 4 needs a second agent): `scan`'s three fixed dimensions, and
`skeleton · colour`. Unchanged by this wake.

**Do not re-raise Slice 179's or 182.2's refusals, 176.3, the retired
product-vs-machinery ratio, or Slice 195's finding A** (a grill re-arming rule 3
with its own output — 195 measured it, refused a rule change, and this wake's
own result is the counter-evidence: re-grilling the "already covered" slices is
where the window's only defect was found). Re-measure before reopening anything.

**Adjudicated at hand-off, which is the step `check:resume-slice-ids` exists to
prompt.** The ids this file names in backticks that `ROADMAP.md` records `[x]`
closed are **nine** — `190.1`, `190.2`, `190.3`, `191.1`, `191.2`, `191.3`,
`192.1`, `173.2`, `185.1` — and every one is a **historical reference**, none a
claim that any is open: the first seven are the claims this grill re-measured,
listed with what each measurement returned; `173.2` is named as instance 1 of
the placement rule; `185.1` is quoted in the Direction read. (`164.3` and
`168.1` are named too and are archived, which the check reports separately and
does not treat as a finding.) **This paragraph first said "seven" and was
corrected by running the check** — the two it missed are the two that sit
outside the table, which is the shape the check exists to catch. The genuinely
open ids — `15.12`, `112.3`, `112.4`, `193.1`, `193.2`,
`196.1` — are in the table above and are **not** among them, which is the check
agreeing with the table.

## Direction — the owner's pick, and whether THIS wake advanced it

**Standing section, added by 168.1 (2026-08-28). Answer all four every wake,
from the sources named — never by copying the answers above you.**

- **Direction:** (a) adoption/DX — finish it by publishing
  `@busy-office/create-ui`. Source: the `DECISION (owner, 2026-08-28)` block in
  Slice 164.3, which lives in **`ROADMAP-archive.md`**, not `ROADMAP.md`. Read it
  there; a pointer that disagrees with its source loses.
- **Remaining step, and who it waits on.** The publish is done (`npm view
  @busy-office/create-ui version` → **`0.1.0`**, re-run this wake) and the release
  workflow ships it. What is left is **one thing this loop cannot check from
  here: whether `@busy-office/create-ui` has a Trusted Publisher configured on
  npmjs.com.** **Stated as unknown, not as done.** If it is not set, the first
  release publishes core and then fails on create-ui's publish step; the
  workflow's comments carry the recovery. A release cannot even be *attempted*
  today without a version bump — `check-publishable.mjs` exits 1 on both
  packages, by design.
- **Did this wake advance it?** **No.** Rule 3 dispatched a grill; nothing in the
  diff touches either package.
- **Work rows since the direction was decided that did not advance it:** derive
  it, do not increment. **Derived this wake, after this wake's row was
  committed: 71 non-Meta work rows since `fb15cdc`; the needle matches 6;
  reading them, `164.3`, the `0.1.0` release and `185.1` advance the direction,
  while `168.1`, the `173.2`/`185` triage and `186` narrate or detect it — so
  68 of 71 did not.** *(Last honest reads: 65 of 68, 61 of 64, 56 of 59, 55 of
  58, 52 of 55, 49 of 52, 46 of 47, 43 of 44, 41 of 42, 38 of 39.)*

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

```
npm view @busy-office/create-ui version     # 0.1.0
npm view @busy-office/ui version            # 0.5.0
node packages/core/scripts/check-publishable.mjs packages/core packages/create-ui
  # exits 1 today: both versions are already on the registry. That is the gate
  # working, not a fault — a release needs a bump first.

# fb15cdc is the commit carrying the owner's decision. UNSHALLOW FIRST
# (ENVIRONMENT.md trap 2) or these resolve nothing and the rate is silently
# missing, not wrong.
```

**These commands are about to age, and the next owner decision is what ages
them.** The `npm view` lines no longer test a blockage — they confirm a publish —
and the direction's last open question is a setting on npmjs.com rather than
anything in this tree. When the owner picks a direction beyond "wire the front
door into the release", rewrite them; do not reinterpret them.
