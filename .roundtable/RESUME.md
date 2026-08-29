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

Last updated 2026-08-29 (cloud wake, scheduled routine — **rule 4 → Continue,
build mode, `193.1`**). Working tree clean at hand-off; the wake's commits went
out as one push.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md                # 5 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs       # names the closed ids
```

**No collision this wake.** `git fetch origin main` at Step 0 and again
immediately before the first commit both read `a7c65f7c` unchanged.

## What landed this wake (2026-08-29, cloud, rule 4 → `193.1`)

**167.1's reopen watch on `CLAUDE.md` was executed — the first thing to act on
it since it was written. Outcome: fold nothing, and RETIRE the watch rather than
re-arm it.**

| what was asked | what the measurement returned |
|---|---|
| does the premise reproduce? | `seven = 1893` at `e3844c49`, **to the word** |
| the eighth section | `0131ebc5` adds "A green red-proof …" (290 w) as a new `##`, unfolded |
| the group at `a7c65f7c` | 8 of 17 sections, **2,385 of 5,248 body words = 45.4%** (the item said 43%; two of the eight grew after it was written) |
| `grep -rn 'without folding'` | **5 lines**, not the item's 1 — Slice 195's grill report added two |
| does each section change what a wake DOES? | **8 of 8 yes**; none is pure provenance |
| does a wake reading one get a pointer to the others? | **7 of 56 ordered pairs**, and **6 of the 7 land on one section**; three of the eight point at nothing |

**The decision, and why it is not obedience to the checkbox.** 167.1's wording —
*"a wake reading one gets no pointer to the other six"* — is a **traversal**
concern. It is correct for `ROADMAP.md` and `ROADMAP-archive.md`, the files it
was written beside, which a wake walks. `CLAUDE.md` is not walked: it is
delivered **whole** in every wake's instructions (17 of 17 `##` headings
present, measured on this wake's own delivered text). The traversal the watch
describes does not occur, so the watch is retired instead of re-armed.

**Three things this wake refused**, each with the measurement recorded rather
than acted on: folding sections 8 and 10, which share **7 of 7** probed worked
examples and point at each other **zero** times (re-narration in a different
grammar is this repo's recorded WORKING mechanism — section 7 exists for that
reason and says so, and `LOOPS.md` has twice refused turning a paragraph into a
pointer); restructuring on section 14's looser fit with the group's stated
subject; and any gate, per the Accept and 94.11.

**The probe was wrong before it was right, twice.** The first cross-pointer scan
gave two spurious HITs because a needle for one section was that section's
neighbour's own vocabulary (`base rate`) — a detector reporting a pointer where
there was only shared subject matter. The second, exact-substring, undercounted
the shared examples at **5 of 7** until the two near-misses were read (*"the
**docs** shell's own menu button"*, *"16-of-16 pages flagged"*). Both were caught
before the number was used, which is the ordering section 8 asks for.

## ⚠ THIS WAS A CLOUD WAKE — WHAT WAS NOT LOOKED AT

No Podman, no `localhost:8081`, **no screenshots at 1440px/390px in light and
dark**. Nothing was visually verified and nothing is described as if it were.

**Nothing this wake needed one.** `git diff --stat` names `ROADMAP.md` alone —
no `.css`, no `.astro`, no rendering change. The item is a recorded decision
about prose; every figure in it is a git/word-count reading or a read of the
file, none of which is on `ENVIRONMENT.md`'s cannot-run list.

Gates green on the committed tree: core `build` + `test` (**146** passed),
`docs:build`, `check:repo` (selftests **45 gates, 16 heuristic all
self-tested**; slice-refs **396** citations / **178** slice numbers),
`check:claims` **144**, `check:layout` **127** pages, `test:axe` **127 pages ×
2 widths, zero violations**. The whole chain was re-run after the final edit
rather than trusted from the earlier build, because `check:slice-refs` reads
`ROADMAP.md`.

No `verifier` agent is available in this session, so the staged diff was read by
hand — said plainly rather than logged as a verifier pass.

**Traps exercised for real this wake:** 1 (the container started **detached** —
`git branch --show-current` empty; repaired with `git checkout -B main
origin/main` before any commit), 2 (unshallowed before any history figure:
**1,622** commits), 1c (`CHROME_PATH` exported in the same command as every
browser gate), 7 (word counts taken with Python `str.split()`, never bare
`wc -w`).

## Counters after this wake

Verified after recording: **1133** rows by the parser against a raw
`grep -c "^- "` of **1133**.

```
Standardize   2 / 4 Continue rounds   ok
Objective     1 / 3 slices            ok   [193]
Optimize      0 wake-date(s) newer    ok   [newest pair: axe-violations]
```

**Rule 5's instrument is NOT stale** — `0 wake-date(s) newer`, so rule 5 was
answerable and found nothing.

**No metric recorded**, deliberately: every figure this wake characterises one
prior claim about one file, not a repeatable sample under an existing name, and
a single-sample name pads the store rule 5 reads (184's discipline).

## What the next wake should expect

**Rule 2 reads 2/4 and rule 3 reads 1/3, so rule 4 is where the next wake
lands.** Checkboxes at hand-off — re-count rather than copying:

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md      # 5
```

| item | blocked on | which list does it need? |
|---|---|---|
| `15.12` | **owner-blocked** (owner hardware, AT runtime) | neither; no wake can take it |
| `112.3`, `112.4` | **owner-blocked** (briefs; `112.4` waits on `112.3`) | neither |
| `193.2` | nothing | cloud-takeable — one measurement and a decision; **refusing a mechanism is the expected outcome** |
| `196.1` | nothing | **split by branch** — see below |

Oldest still-open is `15.12`, then `112.3`/`112.4`, all owner-blocked — so the
oldest *dispatchable* one is **`193.2`**. Say **which kind** of blocked when
reporting rule 4 as finding nothing (`LOOPS.md` rule 4: owner-blocked /
browser-blocked / agent-blocked), and for a browser-blocked one name which of
`ENVIRONMENT.md`'s two lists it needs.

**`193.2` inherits a live input from this wake, which is the point of doing it
next.** It is about the 42 reopen conditions sitting in item bodies where
nothing re-reads them. This wake executed one of the 42 — 167.1's — and the
answer was that the condition had fired, gone unread for a day, and then turned
out to rest on a premise that does not hold for the file it governs. That is a
**second data point for 193.2's own hypothesis** (execution is predicted by
whether a playbook step names the thing), and it cuts against a mechanism: what
this one needed was not a register but a wake reading it. Record it; do not let
it decide the item on its own.

**`196.1` is split by branch, and the split is the honest part.** Its Accept
allows either bounding the right edge (changes rendering) or correcting the
comment (does not). **Branch (b) is fully cloud-takeable** — it is prose about
code, and every measurement it needs is in §B of
`.roundtable/grill-objective-186-189-190-191-2026-08-29-b.md`. **Branch (a)
changes what a user sees**, so a cloud wake taking it must name the screenshots
as not taken; a local wake can close it outright.

**Two blind re-scores are still owed and neither can be done in a cloud wake**
(§3b step 4 needs a second agent): `scan`'s three fixed dimensions, and
`skeleton · colour`. Unchanged by this wake.

**Do not re-raise Slice 179's or 182.2's refusals, 176.3, the retired
product-vs-machinery ratio, or Slice 195's finding A.** And **do not re-arm
167.1's watch on `CLAUDE.md`** — it was executed and retired this wake, with the
reason recorded in `ROADMAP.md`'s 193.1 decision block; reopening it needs new
evidence that `CLAUDE.md` is navigated rather than delivered whole. Re-measure
before reopening anything.

**Adjudicated at hand-off, which is the step `check:resume-slice-ids` exists to
prompt.** The ids this file names in backticks that `ROADMAP.md` records `[x]`
closed are **three** — `193.1`, `185.1`, `173.2` — and every one is a
**historical reference**, none a claim that any is open: `193.1` is the item
this wake closed and is described throughout in the past tense; `185.1` is named
in the Direction read as one of the rows that *advanced* the direction; `173.2`
is named there as one that narrates it. (`167.1`, `164.3` and `168.1` are
archived, which the check reports separately and does not treat as a finding —
167.1 is named only to say its watch is retired.) **This paragraph first named
two and was corrected by running the check**, which is the second consecutive
hand-off where the ids it missed were the ones outside its own summary table —
the shape the check exists to catch. The genuinely open ids —
`15.12`, `112.3`, `112.4`, `193.2`, `196.1` — are in the table above and are
**not** among the closed set, which is the check agreeing with the table.

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
- **Did this wake advance it?** **No.** Rule 4 dispatched a recorded decision
  about `CLAUDE.md`'s structure; nothing in the diff touches either package.
- **Work rows since the direction was decided that did not advance it:** derive
  it, do not increment. **Derived this wake, after this wake's row was
  committed: 72 non-Meta work rows since `fb15cdc`; the needle matches 6;
  reading them, `164.3`, the `0.1.0` release and `185.1` advance the direction,
  while `168.1`, the `173.2`/`185` triage and `186` narrate or detect it — so
  69 of 72 did not.** *(Last honest reads: 68 of 71, 65 of 68, 61 of 64, 56 of
  59, 55 of 58, 52 of 55, 49 of 52, 46 of 47, 43 of 44, 41 of 42, 38 of 39.)*

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
