# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and `check:resume-charter` REPORTS — on stderr, from
> `record_iteration.py`, advisory by design since 169.4 — if this pointer goes
> missing or if the durable sections grow back here. It does not fail a build;
> it left `check:repo` because `.roundtable/**` is CI-ignored (roadmap 175.3).

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

Ordinary state — what is queued, what is done — lives in `ROADMAP.md` and
`.roundtable/loop-log.md`. Environment knowledge lives in `ENVIRONMENT.md`. Only
put things here that none of those can say: **uncommitted work, and a decision
made but not yet written down.**

---

## In flight: nothing

Last updated 2026-08-29 (cloud wake, scheduled routine — **rule 3 → Objective
grill of Slices 180, 183, 184**). Working tree clean at hand-off; the wake's
commits went out as one push.

**Reconcile this file against `ROADMAP.md` before trusting its open set** — it
goes stale between wakes, and **this wake proved that with a live instance**
(186.1). Trust the `N. [ ]` checkboxes, not this section.

## What landed this wake (2026-08-29, cloud, rule 3 → Slice 186)

Report: `.roundtable/grill-objective-180-183-184-2026-08-29.md`.

- **The question the last hand-off proposed was answered, and its premise is
  false — which is the satisfying outcome.** *"How many other closed Accept
  criteria stopped holding the day they were ticked?"* → **1 of 275**. Only
  28.1's *"`ci-wall-time` recorded every wake"* binds future behaviour at all;
  the other three phrase-hits are a quote, an incidental, and a description.
  Widening the needle set from 11 phrases to 21 added **zero** hits. From the
  other side, **117 of 275 (43%)** name a gate/script/test and re-check
  themselves. So **184.1 did not patch one leak in a leaky system** — it supplied
  a mechanism for the one thing an Accept criterion structurally cannot express.
- **My instrument was wrong twice on its first runs, both caught before the
  number was quoted.** Block over-capture reported 19; and `each run` matched
  inside **`each rung`**, verified with `grep -o` and the needle dropped.
- **The cross-cut of 180/183/184: a self-description checked against the wrong
  thing, or nothing.** 180 — `@exact` verified against the tag *text*, not the
  code. 184 — rule 5's freshness verified by nothing for 10 wake-dates. 183 —
  "needs a browser" verified by nothing for eight wakes. **183 is the control:
  when finally checked, 5 of 5 were clean.** So the finding is *self-descriptions
  are unverified*, **not** *they are wrong*. Filed as **Hypothesis**, n = 4.
- **Refused: a general "gate every self-description" programme.** 176.2's rule-6
  predicate was true of 19 of 19 and 94.11's of 155 of 155 — the blanket gate
  that distinguishes nothing is this repo's recorded failure mode.

## ⚠ TWO PREMISES IN THE PLAN WERE FALSE AT HEAD, AND BOTH ARE NOW CORRECTED

**1. `create-ui` is PUBLISHED. The E404 is gone.** Asked the registry, not this
file:

```
npm view @busy-office/create-ui version      # 0.1.0   (was E404)
npm view @busy-office/create-ui time --json  # published 2026-08-29T01:30:23.790Z
npm view @busy-office/ui version             # 0.5.0
```

Slice 185 was filed at `6c4cfae` **01:16:54Z** (offsets resolved to UTC first —
local writes `+0800`, cloud `+0000`) and the publish landed **01:30:23Z, 13½
minutes later**, exactly the manual first publish 185 predicted. ROADMAP 185 now
carries the update with its two false sentences struck. **Still open and now more
urgent:** `publish.yml` publishes core only, so the next release silently skips
`create-ui` — which is live and pins `^0.5.0`. Owner call, unchanged.

**2. `173.2` is BROWSER-blocked, not owner-blocked.** The last hand-off said "the
six older items are still owner-blocked (`112.3`, `112.4`, `173.2`, `175.4`,
`176.3`, `15.12`)". Measured at `751959eb`, the commit that wrote it:
**`175.4` was already `[x]` closed** and **`173.2` already had the owner's
answer (b), 2026-08-29**, with a full Accept. Cause: `6c4cfae` wrote the
decisions into `ROADMAP.md` and `751959eb` never touched this file.

**3. And it happened a THIRD time, during this wake, to the table below.** While
this hand-off was being written the local dispatcher landed `0c1fe3d3` closing
**`176.3`** as no-change on the owner's challenge. The draft of this table —
written minutes earlier — listed `176.3` as owner-blocked. It was corrected by
re-running the count, not by noticing. The rebase that brought those commits in
**resolved with no conflict at all**, which is Step 0c's documented hazard: the
`git fetch origin main` before the first commit is what caught it, and it is a
process rule with nothing mechanical behind it.

**The corrected open set — six `N. [ ]` checkboxes, counted in `ROADMAP.md` at
`a2d53a93`+, not copied** (`grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md` → 6):

| item | blocked on |
|---|---|
| `112.3`, `112.4` | **owner** (briefs; 112.4 waits on 112.3's verdict) |
| `15.12` (`12. [ ] AT runtime evidence`) | **owner hardware** |
| `173.2` | **a browser** — owner-answered, Accept written, needs live row-height measurement. **A local wake can take this; a cloud wake cannot.** |
| `186.1`, `186.2` | nothing — filed this wake, dispatchable |

`176.3` is **closed, no-change, and must not be re-raised** — `LOOPS.md` rules 6
and 7 and §3b all carry the owner's decision now.

## ⚠ THIS WAS A CLOUD WAKE — WHAT WAS NOT LOOKED AT

No Podman, no `localhost:8081`, no screenshots at 1440px/390px in light and dark.

**Nothing this wake needed one.** `git diff --stat` names only `ROADMAP.md`,
`.roundtable/` and the generated `STATUS.md` — no `.css`, no `.astro`, nothing
under `packages/core/src`. That is an argument from the diff, **not a visual
check, and it is not claimed as one.**

Gates run twice, before and after the change, all green: core `build` + `test`
(146), `docs:build`, `check:repo` (slice-refs **373** citations, **168** slice
numbers — up one heading and one citation, which is exactly what Slice 186 adds),
`check:claims` (141), `check:layout` (127), `test:axe` (127 × 2, zero
violations).

**Traps exercised for real this wake:** 1 (detached HEAD — `git branch
--show-current` EMPTY at Step 0, fixed before any commit), 1b, 1c, 2
(unshallowed: read `true`, now 1,571 commits), 3, 5.

## Counters after this wake

Run `python3 scripts/loops/dispatch_status.py` and read it **immediately after
`record_iteration.py`**, per 166.5's lesson — that comparison has found two of the
five recurrences.

**Prediction written down first, then checked.** Before recording, with 1093 rows
and the parser agreeing with a raw `grep -c "^- "` at 1093, for one `Objective`
row carrying one `--also-refused` (182.3: +1 `Meta · refusal` row) plus one
`axe-violations` sample: **1095** rows, `Standardize 3 / 4 ok`, `Objective 0 / 3
ok` (reset by this row), and rule 5 `0 wake-date(s) newer … ok` at **101**
samples.

After recording: **1095** rows against a raw `grep -c` of **1095**;
`Standardize 3 / 4 ok`; `Objective 0 / 3 ok`; `Optimize 0 wake-date(s) newer …
ok [101 sample(s), 13 of 30 name(s) sampled twice]`. **Four of four exact** — and
unlike last wake, the prediction's premise was not changed after it was written.

`axe-violations` was recorded because it was genuinely measured live this wake
(127 pages × 2 widths, zero violations) under a name whose earlier samples
measured the same thing. **Refused, per 184's discipline:** inventing a new
single-sample name for this grill's own figures — a name sampled once can never
satisfy "two consecutive runs" and would pad the store rule 5 reads.

## What the next wake should expect

**Rule 3 discharged this wake.** Re-run `dispatch_status.py` rather than trusting
this line, but expect rules 1-3 unarmed and **rule 4 to have real work for the
first time in five wakes** — `186.1` and `186.2`, both filed here and neither
owner- nor browser-blocked. `173.2` is older and dispatchable **only on a local
wake**; a cloud wake should say so explicitly and take the next item rather than
reporting rule 4 empty.

**186.1 is the mechanism for the defect this hand-off just demonstrated.** Base
rates are already measured and are in the item: the sharp predicate fires at
**2 of 58 wake-ends (3%)**, noise is ~1 backticked id per revision, and the first
draft of the measuring parser **under-reported 4 of 5** open items because
`15.12` carries no numeric id in its bold. Re-measure rather than copying those
figures — they are snapshots.

**Do not re-raise Slice 179's or 182.2's refusals as new findings.** Both were
refused on measured base rates; re-measure before reopening.

**Two blind re-scores are still owed and neither can be done in a cloud wake**
(§3b step 4 needs a second agent): `scan`'s three fixed dimensions, and
`skeleton · colour`. Unchanged by this wake.

## Direction — the owner's pick, and whether THIS wake advanced it

**Standing section, added by 168.1 (2026-08-28). Answer all four every wake,
from the sources named — never by copying the answers above you.**

- **Direction:** (a) adoption/DX — finish it by publishing
  `@busy-office/create-ui`. Source: the `DECISION (owner, 2026-08-28)` block in
  Slice 164.3, which lives in **`ROADMAP-archive.md`** (line ~21190), not
  `ROADMAP.md`. Read it there; a pointer that disagrees with its source loses.
- **Remaining step, and who it waits on: THE PUBLISH IS DONE.** The registry
  answers `0.1.0`, published **2026-08-29T01:30:23Z** by the owner. What remains
  is **not** the same step: `publish.yml` still publishes core only, so nothing
  republishes `create-ui` when core moves. That needs the owner's answer on the
  version-match gate (ROADMAP 185, item 1) — one release tag cannot assert both
  `0.5.0` and `0.1.0`.
- **Did this wake advance it?** **Not by publishing — the owner did that.** This
  wake advanced it by *detecting* it: the direction block had said "still E404"
  for eight wakes, and this wake asked the registry instead of copying, which is
  the one thing this file named as new information.
- **Work rows since the direction was decided that did not advance it:** derive
  it, do not increment. Re-run the command and READ the matched rows rather than
  `-c`-ing them; the needle over-counts, because a row can mention `create-ui`
  while merely narrating the blockage. **Derived this wake: 47 non-Meta work rows
  since `fb15cdc`; the needle matches 3; reading them, `164.3` advances the
  direction, `168.1` and `6c4cfae` narrate it — so 46 of 47 did not.**
  *(Measured at `751959eb`, before this wake's own log rows were committed. The
  last honest reads were 43 of 44, 41 of 42, 38 of 39 and 37 of 38.)*

  ```
  git diff fb15cdc..HEAD -- .roundtable/loop-log.md | grep '^+- ' \
    | grep -v ' · Meta · ' | grep create-ui        # print them, don't -c them
  ```

  Left as a two-line read rather than a smarter regex on purpose: any needle
  that tries to separate "advanced" from "mentioned" is guessing at intent from
  prose, which is the semantic-vs-shape line CLAUDE.md draws (94.11).
- **Is that ratio a PROBLEM? No — the owner was shown it and decided otherwise
  (2026-08-28).** Asked directly whether to pause the hourly routine until the
  publish, the owner chose **keep it running hourly**. Do not re-triage it and do
  not slow the routine on your own judgement. **The new information this block
  was waiting for has now ARRIVED** — the registry answered something other than
  E404 — so the next wake should re-read this block against ROADMAP 185 rather
  than assuming it still describes a blockage.

```
npm view @busy-office/create-ui version     # 0.1.0 — PUBLISHED 2026-08-29T01:30:23Z
npm view @busy-office/ui version            # 0.5.0

# fb15cdc is the commit carrying the owner's decision. UNSHALLOW FIRST
# (ENVIRONMENT.md trap 2) or these resolve nothing and the rate is silently
# missing, not wrong.
git diff fb15cdc..HEAD -- .roundtable/loop-log.md | grep '^+- ' | grep -vc ' · Meta · '
```

**`create-ui` is the only name in these commands that will age, and it has now
partly aged.** The `npm view` line no longer tests a blockage — it confirms a
publish. When the owner picks a direction beyond "wire the front door into the
release", rewrite these; do not reinterpret them.
