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
build mode**, landed as **199.3**). Working tree clean at hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md                # 3 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs       # names the closed ids
```

## ⚠ A COLLISION HAPPENED AGAIN, AND THIS WAKE WAS AGAIN THE LOSER

**Both dispatchers took `199.1`.** The local session pushed first (`d3d76a28`,
then `0182b983`). Step 0c was followed exactly: **its close stands as the record
and none of it was re-done** — this wake's own finished, fully-gated close of
199.1 was discarded with `git reset --hard origin/main` rather than pushed over
it. `git fetch origin main` immediately before the first commit is what caught
it, the working half of Step 0c doing its job for the second consecutive wake.

**The cost this time was the shape Step 0c actually names** — *"up to one wake's
work, discarded"* — rather than last wake's three renumber-and-reverify cycles.
Both costs have now been paid once each; that is an observation, not a proposal,
and 175.4 has the collision policy settled by owner call.

**Filing a follow-on is not re-doing the loser's work, and the distinction is
the close's own words.** `199.1`'s close names one thing it did not do:
*"mobile 390px not captured this wake — a browser-tool viewport-resize
limitation in this session, not a decision to skip"*. That, plus one finding
neither pass carries, is what landed as `199.3`. Same precedent as Slice 199
following on from `193.2`'s close.

## What landed this wake (199.3)

| what `199.1`'s close left open, verbatim | what this wake measured |
|---|---|
| *"mobile 390px **not captured** this wake"* | taken as layout geometry — and its argument **survives**: tallest tile is **326px at both 1440 and 390**, so growth lengthens the page and crowds no card |
| — (carried by neither pass) | **the complexity axis cannot narrow this index**: 21 of 39 tiles share one value, the 11-tile group spans two, `monitor & output` is 7 tiles at one value |

**Why B matters beside a close that already refused.** `199.1` argues the
*problem* is absent (more tiles lengthen, they do not crowd). `199.3` argues the
*remedy* is inert. The second survives if a later wake decides 16.4 screenfuls
at 390px is a problem after all — at which point the fix is still not this
filter.

**A tempting item was refused by measurement.** At 390px the index shows **0**
visible in-page jump links, which looks like a finding. It is shell-wide: the
"On this page" rail is `display:none` below 60rem, **97 of 127 pages** have zero
visible jump links, and `/patterns/` is **rank 5 of 127** by length —
`/components/data-table/` is twice as long at 32.1 screenfuls. Recorded in
199.3 §D with its command; **not filed**, because nothing about it is this
index's.

**Three instrument defects, all caught before a number was used** — §8's
ordering working rather than a clean run. `documentElement.scrollHeight`
returned exactly the viewport height at both widths (the identical-value tell —
the docs shell scrolls an inner `main`); the jump-link count was first taken
from the DOM and reported 7 at 390px where the honest figure is 0 visible / 7 in
DOM; and **the probe's red-proof came back GREEN on its first run**, because
`evaluateOnNewDocument` appended a `<style>` to `document.documentElement`
before that element existed. CLAUDE.md's rule hit exactly as written. Re-done as
`addStyleTag` after navigation with an assertion that the computed value moved.

## ⚠ THIS WAS A CLOUD WAKE — WHAT WAS NOT LOOKED AT

No Podman, no `localhost:8081`, **no screenshots at 1440px/390px in light and
dark**. Nothing was visually verified and nothing is described as if it were.

**The aesthetic reading at 390px is untaken by BOTH dispatchers** — `199.1`
took 1440px in both themes and recorded 390px as not captured; this wake took
390px as *geometry* (`browser-harness.mjs` + `serve-dist.mjs`, the CAN-run list)
and cannot take it as an image. 199.3's §B and §C are constructed so they do not
need one. `git diff --stat` for this wake names `ROADMAP.md` only — no `.css`,
no `.astro`, no rendering change.

Gates green on the committed tree, re-run in full **after** the reset onto
`origin/main` rather than trusted from the pre-collision build: core `build` +
`test` (**146** passed), `docs:build`, `check:repo` (slice-refs **401**
citations / **181** slice numbers, each heading one section), `check:claims`
**144**, `check:layout` **127** pages, `test:axe` **127 pages × 2 widths, zero
violations**.

No `verifier` agent is available in this session, so the staged diff was read by
hand — said plainly rather than logged as a verifier pass.

**Traps exercised for real this wake:** 1 (container started **detached** —
`git branch --show-current` empty; repaired with `git checkout -B main
origin/main` before any commit, and `origin/main` arrived as a **forced
update**), 2 (unshallowed before any history figure: **1,637** commits), and 1c
(`CHROME_PATH` exported in the same command as every browser gate and every
probe).

## Counters after this wake

Verified after recording: **1145** rows by the parser against a raw
`grep -c "^- "` of **1145**, and the `loops.db` mirror at **1145**.

```
Standardize   3 / 4 Continue rounds   ok
Objective     1 / 3 slices            ok   [199]
Optimize      0 wake-date(s) newer    ok   [newest pair: axe-violations]
```

**Rule 5's instrument is NOT stale** — `0 wake-date(s) newer`, so rule 5 was
answerable and found nothing.

**No metric recorded**, deliberately: every figure this wake characterises one
page or one data module at one moment, not a repeatable sample under an existing
name, and a single-sample name pads the store rule 5 reads (184's discipline).

## What the next wake should expect

**Rules 2 and 3 are below threshold, and rule 4 now finds NOTHING
DISPATCHABLE** — this is the change from the last hand-off. Re-count rather
than copying:

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md      # 3
```

| item | blocked on | which kind (LOOPS.md rule 4) |
|---|---|---|
| `15.12` | owner hardware — a human listening to a screen reader | **owner-blocked** |
| `112.3` | the owner writing 5 real ERP screen briefs with sealed picks | **owner-blocked** |
| `112.4` | `112.3`'s verdict | **owner-blocked** |

**All three are owner-blocked — none is browser-blocked or agent-blocked**, so
naming a cloud/local split would be wrong here: no wake of either kind can take
them. `112.3`'s four questions were answered by owner decision on 2026-08-29
(`b81131f3`, all four recommendations agreed, pilot is **5 briefs** not 8); what
remains is the one input no wake supplies, and nothing is dispatchable until the
first brief exists in `.roundtable/pilot-112/briefs.md`. **Re-read the items
rather than trusting this table.**

**So the next wake should land on rule 6 (Polish), and rule 6's step 0 is not
optional:** run `python3 scripts/loops/polish_requeue.py --apply` BEFORE
evaluating it. Rule 5 is answerable and clear, so it will not intercept. Read
§3b's *"what a round on a `content: 3` surface is supposed to do"* first — if
the reconciliation finds nothing, **the round is a no-op and says so in one
line**; manufacturing a fix on a surface with no measured weakness is the
busywork the operating rules refuse.

**Two blind re-scores are still owed and neither can be done in a cloud wake**
(§3b step 4 needs a second agent): `scan`'s three fixed dimensions, and
`skeleton · colour`. Unchanged by this wake.

**Do not re-raise Slice 179's or 182.2's refusals, 176.3, the retired
product-vs-machinery ratio, Slice 195's finding A, or 167.1's retired
`CLAUDE.md` watch.** And **do not re-open `199.1` or `104.4`** — the complexity
filter has now been refused three times, twice on measurement, and 199.3 §C
restates the reopen trigger as a *capability* property with its command
(one value holding ≤ a third of the index **and** the largest group spanning 3+
values; today 21 of 39 = 54% and a spread of 2, so neither half is met).
Re-measure before reopening anything.

**Adjudicated at hand-off, which is the step `check:resume-slice-ids` exists to
prompt.** It reported 5 closed ids named here — **`199.1`, `199.3`, `193.2`,
`199.2`, `196.1`** — plus 3 not in `ROADMAP.md` at all (**`104.4`, `167.1`,
`164.3`**, archived). **Every one is a historical reference; none is a claim
that any is open.** `199.3` is this wake's own closed item; `199.1` is the item
the other dispatcher closed, described throughout in the past tense as the thing
this wake lost and then followed on from; `104.4` is
the closed refusal whose trigger fired, now re-refused twice more; `193.2` and
`199.2` are prior closes named as precedent; `196.1`, `167.1` and `164.3` are
named only to say what is retired or where the direction decision lives. The
genuinely open ids — `15.12`, `112.3`, `112.4` — are in the table above and are
**not** among the closed set, which is the check agreeing with the table.

## Direction — the owner's pick, and whether THIS wake advanced it

**Standing section, added by 168.1 (2026-08-28). Answer all four every wake,
from the sources named — never by copying the answers above you.**

- **Direction:** (a) adoption/DX — finish it by publishing
  `@busy-office/create-ui`. Source: the `DECISION (owner, 2026-08-28)` block in
  Slice 164.3, which lives in **`ROADMAP-archive.md`** (line ~21217), not
  `ROADMAP.md`. Read it there; a pointer that disagrees with its source loses.
- **Remaining step, and who it waits on.** The publish is done (`npm view
  @busy-office/create-ui version` → **`0.1.0`**, re-asked this wake) and the
  release workflow ships it. What is left is **one thing this loop cannot check
  from here: whether `@busy-office/create-ui` has a Trusted Publisher configured
  on npmjs.com.** **Stated as unknown, not as done.** If it is not set, the
  first release publishes core and then fails on create-ui's publish step; the
  workflow's comments carry the recovery. A release cannot even be *attempted*
  today without a version bump — `check-publishable.mjs` exits 1 on both
  packages, by design.
- **Did this wake advance it?** **No.** Rule 4 dispatched a docs-index refusal;
  nothing in the diff touches either package.
- **Work rows since the direction was decided that did not advance it:**
  **74 of 80** (derived this wake, not incremented). Re-derive rather than
  copying — and read it as a **rate, not a state**: the owner was shown this
  ratio and decided to keep the routine running hourly anyway (2026-08-28).
  *(Last honest reads: 74 of 80, 69 of 72, 68 of 71, 65 of 68, 61 of 64, 56 of
  59, 55 of 58, 52 of 55, 49 of 52, 46 of 47, 43 of 44, 41 of 42, 38 of 39.)*
  **Snapshot caveat, and it is real:** both dispatchers append to this log, so
  a figure taken mid-wake moves under you. This one includes this wake's own
  row and was taken against the working tree.

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
npm view @busy-office/create-ui version     # 0.1.0   (asked 2026-08-29)
npm view @busy-office/ui version            # 0.5.0   (asked 2026-08-29)
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
