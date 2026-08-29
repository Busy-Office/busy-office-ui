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
Slice 193**). Working tree clean at hand-off; the wake's commits went out as one
push.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md                # 8 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs       # names the closed ids
```

## ⚠ TWO COLLISIONS THIS WAKE, AND THE SECOND WAS A TRUE DUPLICATE DISPATCH

Both caught by the `git fetch origin main` Step 0c mandates before the first
commit — the working half, twice in one wake.

1. `44611ba1..a9470314` — the other dispatcher took **rule 4** and closed
   **190.2**. Different rule, different item; both wakes' work stands.
2. `a9470314..44f8bb37` — **the same rule-3 grill of the same four slices**,
   filed as **Slice 192**, pushed first, **with the same report filename**.

This wake rebased and renumbered **192 → 193** (Slice 190's precedent), and its
report ships as
`.roundtable/grill-objective-186-189-190-191-2026-08-29-b.md`. **Fourth recorded
collision, second caught before any commit, and the first where both dispatchers
chose the same output filename** — which is the new fact for Step 0c, since its
list of guaranteed collision points does not include "the artefact both wakes
write". Nothing was lost; `git status` showing the file as **added, not
modified**, was checked before writing (CLAUDE.md's case-collision rule).

**Both grills are kept and they share NO finding.** 192 reads the window for how
each claim was *established*; 193 for what the window *left behind*. Where they
touch — 190.1's *"1 of 138"* — **192 has priority and is credited.**

## What landed this wake (2026-08-29, cloud, rule 3 → Slice 193)

**A — the Objective counter is at its most self-armed reading on record.** Rule
3's own re-run command: **32 dispatches crossed, 10 (31%) would not have without
a grill-derived slice**, up from 7 of 26. This wake's arming set is
`['186','189','190','191']` and **3 of the 4 are grills**; excluding them it
reads **1 of 4**. The previous maximum in any arming set was 2 of 3. Reconciled
(1115 rows against a raw `grep -c '^- '` of 1115) and red-proved by injection
(`G` emptied → `(32, 0)`; `-41` → `(32, 9)`). **Recorded, not gated** — 175
already refused a heading classifier inside the dispatcher. **Not the retired
product-vs-machinery ratio**, which 192 checked for and correctly declined.

**B — 167.1 wrote a reopen condition; it fired 6h49m later and has never been
read.** *"Reopen if an eighth is added without folding"*, about `CLAUDE.md`'s
seven `##` sections on whether a detector can fail. `0131ebc5` — the very next
Objective grill — added an eighth as a new `##`. **1,893 words across the seven
reproduces exactly** at 167.1's closing commit. `grep -rn 'without folding'`
across the whole corpus returns **exactly one line, 167.1's own**; five grills
(175, 179, 186, 189, 190) have run since. Filed as **193.1**.

**C — 186's "1 of 275" measured the Accept-criterion corpus, not the loop's
obligations.** Its robustness check widened needles 11 → 21 for zero new hits;
the binding limit was **corpus scope**, not needle width. **42 of 558** items
carry a reopen condition in the item BODY, outside the Accept block 186 parsed.
Counter-evidence kept: the population is not uniformly rotting — the css-repeats
"third component" trigger has been executed four times because `LOOPS.md` §3
names it. Filed as **193.2**, with refusing a mechanism named as the expected
outcome.

**D — controls, 3 of 3 hold.** 191.1's `ratchet` predictions held exactly.
190.1's DOM walk reproduces (**1** page, red-proved by injection) and its weaker
`grep` reproduces (**9**) — but **no enumeration of the built site returns its
stated 138** (127 / 137 / 165), and the report printed the output without the
command. 190.3's specificity comment re-measures **correct, 2 of 2**, after two
dead instruments of this repo's own documented kinds (a reference ladder that
did not match the node, so every rung "won"; then racing ROADMAP's *ellipsed*
quotation of the selector, one specificity step below the shipped one).

## ⚠ THIS WAS A CLOUD WAKE — WHAT WAS NOT LOOKED AT

No Podman, no `localhost:8081`, **no screenshots at 1440px/390px in light and
dark**.

**Nothing this wake needed one.** `git diff --stat` names one new `.md` and one
`ROADMAP.md` slice — no `.css`, no `.astro`. Every measurement above is a DOM,
computed-style or history assertion, which is `ENVIRONMENT.md`'s second list.
That is an argument from the diff and the method, **not a visual check, and it
is not claimed as one.**

Gates green on `44f8bb37`: core `build` + `test`, `docs:build`, `check:repo`
(selftests **45 gates, 16 heuristic all self-tested**; slice-refs **391**
citations, **175** slice numbers), `check:claims` **144**, `check:layout` **127**
pages, `test:axe` **127 pages × 2 widths**. `check:claims` moving 141 → 144 is
an independent confirmation of the colliding wake's 190.2.

No `verifier` agent is available in this session, so the staged diff was read by
hand — said plainly rather than logged as a verifier pass.

**Traps exercised for real this wake:** 1 (the post-collision fast-forward left
`git branch --show-current` **empty**; repaired with `git checkout -B main
origin/main`, and `--short main HEAD` again returned `fatal: Needed a single
revision` on a container where `main` demonstrably exists), 1b (a `cd apps/docs`
left the next command in the wrong directory — two `sed`s failed on relative
paths), 1c (`CHROME_PATH` exported in the same command as every browser gate),
2 (unshallowed before any history figure: **1,602** commits).

## Counters after this wake

`Objective` was **reset by the colliding wake's own row** at `2026-08-29 14:41`,
so this wake's row is the second Objective row in the same arming window.
Verified after recording: **1115** iterations by the parser against a raw
`grep -c "^- "` of **1115**; `Standardize 3 / 4`; `Objective 0 / 3`.

**No metric recorded**, deliberately: every figure here is a one-off
characterisation (a corpus count, a section-word split), not a repeatable sample
under an existing name, and a single-sample name pads the store rule 5 reads
(184's discipline).

## What the next wake should expect

Rules 2 and 3 are both `ok` after the reset, so **rule 4 fires**: the OLDEST
still-open item.

Checkboxes at hand-off — re-count rather than copying:

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md      # 8
```

| item | blocked on | which list does it need? |
|---|---|---|
| `15.12` | **owner-blocked** (owner hardware, AT runtime) | neither; no wake can take it |
| `112.3`, `112.4` | **owner-blocked** (briefs; `112.4` waits on `112.3`) | neither |
| `190.1` | nothing mechanical, but it **re-opens an owner-settled trade** (173.2) | measurable in a cloud wake — `ENVIRONMENT.md`'s SECOND list; the CHOICE among its three options is a design call for the owner |
| `191.3` | nothing | cloud-takeable — a judgement about `LOOPS.md` rule 4 |
| `192.1` | nothing | cloud-takeable — a CLAUDE.md paragraph, or a recorded finding that the wording already covers it |
| `193.1` | nothing | cloud-takeable — execute 167.1's reopen on `CLAUDE.md`; **folding nothing closes it** |
| `193.2` | nothing | cloud-takeable — one measurement and a decision; **refusing a mechanism is the expected outcome** |

Oldest still-open is `15.12`, then `112.3`/`112.4`, all owner-blocked — so the
oldest *dispatchable* one is **`190.1`**. Say **which kind** of blocked when
reporting rule 4 as finding nothing (`LOOPS.md` rule 4: owner-blocked /
browser-blocked / agent-blocked), and for a browser-blocked one name which of
`ENVIRONMENT.md`'s two lists it needs.

**On `190.1`:** its Accept is expressed as measurements a cloud wake can take,
but choosing *which* of the three options to implement re-opens what the owner
settled in 173.2. Bring the options and the table to the owner rather than
picking one autonomously.

**Three of the eight open items are now "decide whether accumulated prose
folds"** — `191.3` (rule 4's archaeology), `192.1` (a placement rule) and
`193.1` (CLAUDE.md's eight detector sections). That is worth noticing before a
fourth is filed; it is not itself filed as an item, because filing an item about
too many filed items is the shape this loop refuses.

**Two blind re-scores are still owed and neither can be done in a cloud wake**
(§3b step 4 needs a second agent): `scan`'s three fixed dimensions, and
`skeleton · colour`. Unchanged by this wake.

**Do not re-raise Slice 179's or 182.2's refusals, 176.3, or the retired
product-vs-machinery ratio**, which the owner or a prior grill closed. Re-measure
before reopening anything.

**Adjudicated at hand-off, which is the step `check:resume-slice-ids` exists to
prompt.** It reports **10** closed ids named here — `189.1`, `190.2`, `190.3`,
`191.1`, `191.2`, `173.2`, `175.3`, `176.3`, `182.2`, `185.1` — and **all ten
are historical references, none a claim that any is open.** `190.2`/`190.3` are
the colliding wake's and the previous wake's landed items, named because
`check:claims` 141 → 144 is this wake's independent confirmation of one of them;
`189.1`, `191.1`, `191.2` are prior landed items whose measurements this grill
re-ran as controls; `173.2` is named only as the owner call `190.1` would
re-open; `175.3`, `176.3`, `182.2` are prior decisions this file says not to
re-raise; `185.1` is quoted in the Direction read. The genuinely open ids —
`15.12`, `112.3`, `112.4`, `190.1`, `191.3`, `192.1`, `193.1`, `193.2` — are in
the table above and are **not** in that list, which is the check agreeing with
the table. **Ten is the highest this file has recorded** (yesterday's was 7, and
the measured distribution over 86 revisions was `{0: 78, 1: 3, 2: 3, 3: 2}`); it
is high because a grill wake's hand-off necessarily names the closed items whose
claims it re-measured. **Do not read the number as a trend** — and note that a
grill wake will always score high on this check by construction, which is a
property of the check worth knowing rather than a defect in either file.

## Direction — the owner's pick, and whether THIS wake advanced it

**Standing section, added by 168.1 (2026-08-28). Answer all four every wake,
from the sources named — never by copying the answers above you.**

- **Direction:** (a) adoption/DX — finish it by publishing
  `@busy-office/create-ui`. Source: the `DECISION (owner, 2026-08-28)` block in
  Slice 164.3, which lives in **`ROADMAP-archive.md`**, not `ROADMAP.md`. Read it
  there; a pointer that disagrees with its source loses.
- **Remaining step, and who it waits on.** The publish is done (`npm view
  @busy-office/create-ui version` → `0.1.0`, re-asked this wake) and the release
  workflow ships it. What is left is **one thing this loop cannot check from
  here: whether `@busy-office/create-ui` has a Trusted Publisher configured on
  npmjs.com.** **Stated as unknown, not as done.** If it is not set, the first
  release publishes core and then fails on create-ui's publish step; the
  workflow's comments carry the recovery. A release cannot even be *attempted*
  today without a version bump — `check-publishable.mjs` exits 1 on both
  packages, by design.
- **Did this wake advance it?** **No.** Rule 3 dispatched a grill of the loop's
  own recent window; nothing in the diff touches either package.
- **Work rows since the direction was decided that did not advance it:** derive
  it, do not increment. **Derived this wake, after this wake's row was
  committed: 64 non-Meta work rows since `fb15cdc`; the needle matches 6;
  reading them, `164.3`, the `0.1.0` release and `185.1` advance the direction,
  while `168.1`, the `173.2`/`185` triage and `186` narrate or detect it — so
  61 of 64 did not.** *(Last honest reads: 56 of 59, 55 of 58, 52 of 55, 49 of
  52, 46 of 47, 43 of 44, 41 of 42, 38 of 39.)*

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
