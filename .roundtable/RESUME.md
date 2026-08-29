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

---

## In flight: nothing

Last updated 2026-08-29 (cloud wake, scheduled routine — **rule 4 → Continue,
build, Slice 186.1**). Working tree clean at hand-off; the wake's commits went
out as one push. No collision this wake: `git fetch origin main` at Step 0 and
again immediately before the first commit both showed `origin/main` unmoved at
`ad65d58`.

**A SECOND advisory check now runs from `record_iteration.py`, so expect two
stderr blocks.** `check:resume-slice-ids` landed this wake and is described in
`LOOPS.md` Step 0 beside the charter check. **Its verb is REPORTED, not
FAILED** — a non-zero exit means it found slice ids worth re-reading, not that a
rule broke.

**Reconcile this file against `ROADMAP.md` before trusting its open set** — that
is now mechanical rather than a habit, which is the whole of 186.1:

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md                # 7 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs       # names the closed ids
```

**Adjudicated at hand-off, which is the step the check exists to prompt.** It
reports **6** closed ids named here — `186.1`, `29.1`, `29.2`, `15.11`, `173.2`,
`185.1` — and **all six are historical references, none a claim that any is
open.** `186.1` is this wake's landed item; `29.1`/`29.2`/`15.11` are quoted
below only as the items whose ids come from position rather than bold text;
`173.2` and `185.1` are prior findings. The one id in the open table that is
genuinely open, `15.12`, is not in that list — which is the check agreeing with
the table. **Six is high for this file** (the measured distribution is
`{0: 78, 1: 3, 2: 3, 3: 2}` across 86 revisions) and it is high because this
hand-off narrates the check itself; do not read the number as a trend.

## What landed this wake (2026-08-29, cloud, rule 4 → Slice 186.1)

**`apps/docs/scripts/check-resume-slice-ids.mjs`** — every slice id this file
names in backticks, checked against what `ROADMAP.md`'s checkboxes say about it,
plus its own open/closed counts reconciled against a raw count of that file.
Wired as `check:resume-slice-ids` and run advisory from `record_iteration.py`;
that script's single charter invocation became a loop over the two.

**It caught the live defect on its first real run, unprompted.** Recording this
wake's iteration printed *"4 named id(s) are recorded [x] CLOSED: 186.2, 186.1,
185.1, 173.2"* — and `186.1` was in the previous hand-off's table as an OPEN,
cloud-takeable item, which had stopped being true forty minutes earlier. That is
the failure 184 diagnosed and 186.1 was written for, reproduced by the thing
built to see it.

**Measured before it was written, with the commands, in ROADMAP 186.1:**

- **Base rate 8 of 86 revisions of this file fire (9%)**, distribution
  `{0: 78, 1: 3, 2: 3, 3: 2}`. Neither dead nor always-on, so a report is a
  signal. 186.1's premise said *2 of 58 wake-ends*; that is a different unit
  measured with a parser that could not derive an id for the unnumbered items,
  and the two are recorded side by side rather than restated as each other.
- **Id derivation: the bold id wins, position is the fallback.** On `ROADMAP.md`
  the two agree **36 of 36**; the four items with no bold id (`29.1`, `29.2`,
  `15.11`, `15.12`) derive correctly. In `ROADMAP-archive.md` the same
  derivation disagrees **30 times** — merged and renumbered slices — which is
  the measured reason the check reads `ROADMAP.md` only.
- **Fences are deliberately NOT skipped**, unlike the sibling charter gate: the
  reconciliation is against the raw `grep` the Accept names, which knows nothing
  about fences. Same scope, same answer, or a loud refusal.

**Red-proved by injection in both directions, each injection confirmed by
grepping the file and the file restored byte-identical** (`md5sum` unchanged,
`git status` clean on the path): appending a backticked closed id took the
report 3 → 4; stripping `173.2`'s backticks took it to 2; stripping all three
made it quiet at rc=0. Both refusals were red-proved by **stubbing a probe copy
in the same directory** — never `git stash`, which moves the data with the
script: a narrowed `CHECKBOX` gives parsed 7 open against raw 8 and prints no
verdict, and a never-matching `SLICE_HEADING` reports the 4 id-less items by
line number. Inverting the id precedence makes the `--self-test` go FAIL on
exactly the discriminating case.

## ⚠ THIS WAS A CLOUD WAKE — WHAT WAS NOT LOOKED AT

No Podman, no `localhost:8081`, no screenshots at 1440px/390px in light and dark.

**Nothing this wake needed one.** `git diff --stat` names one new `.mjs`, one
`package.json` script line, one `record_iteration.py` block, `ROADMAP.md` and one
paragraph of `LOOPS.md` — no `.css`, no `.astro`. That is an argument from the
diff, **not a visual check, and it is not claimed as one.** No browser
measurement was taken either; nothing here is a layout or computed-style claim.

Gates run green after the change: core `build` + `test` (**146**), `docs:build`,
`check:repo` (selftests **45 gates, 16 heuristic all self-tested**; slice-refs
**383** citations, **172** slice numbers), `check:claims` (**141**),
`check:layout` and `test:axe` (**127 pages × 2 widths**). No `verifier` agent is
available in this session, so the staged diff was reviewed by hand instead —
said plainly rather than logged as a verifier pass.

**Traps exercised for real this wake:** 1 (started detached — `git branch
--show-current` empty, `main` stale at `17b3ba6` while HEAD sat at `ad65d58`;
fixed with `git checkout -B main origin/main`, and `origin/main` again arrived as
a **forced update**, `17b3ba6...ad65d58`), 1b (`cd apps/docs/scripts` for the
probe runs leaked into the next command and broke a `sed` on `apps/docs/package.json`
— absolute paths after that), 1c (`CHROME_PATH` exported in the same command as
every browser gate), 2 (unshallowed before the base-rate measurement: **1,594**
commits), 3 (`rm -rf apps/docs/dist` before the build).

## Counters after this wake

**Prediction, written before recording.** At Step 0b: **1108** iterations,
`Standardize 3 / 4`, `Objective 0 / 3 since 03:48`, `Optimize … ok`. One
`Continue` row with no `--also-refused` → **1109**, `Standardize` **4 / 4
OVERDUE**, `Objective` **1 / 3** (this closes Slice 186).

**Verified after recording: the prediction held exactly.** `1109` by the parser
against a raw `grep -c "^- "` of `1109`; `Standardize 4 / 4 OVERDUE`;
`Objective 1 / 3 [186]`.

**No metric was recorded**, deliberately. The base rate is a one-off
characterisation of one file's history, not a repeatable sample under an
existing name, and inventing a single-sample name pads the store rule 5 reads
(184's discipline).

**`LOOPS.md` grew +112 words this wake and is still `0 down`** — 167.1's
signature, unchanged, recorded rather than acted on.

## What the next wake should expect

**Rule 2 fires before rule 4: `Standardize` is 4 / 4 OVERDUE.** Run §3's
playbook — `scan:dead-style`, `report:css-repeats`, `report:prose`,
`report_loop_prose.py` — and record a verdict for anything flagged that carries
none. It is all cloud-takeable.

Checkboxes at hand-off — re-count rather than copying:

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md      # 7
```

| item | blocked on | which list does it need? |
|---|---|---|
| `15.12` | **owner-blocked** (owner hardware, AT runtime) | neither; no wake can take it |
| `112.3`, `112.4` | **owner-blocked** (briefs; `112.4` waits on `112.3`) | neither |
| `189.1` | nothing | cloud-takeable — CLAUDE.md wording |
| `190.2` | nothing | cloud-takeable — `check-claims.mjs` cases |
| `190.3` | nothing | cloud-takeable — a specificity comment |
| `190.1` | nothing, but it **re-opens an owner-settled trade** | measurable in a cloud wake; the CHOICE is a design call for the owner |

Rule 4 takes the **oldest still-open** item — `15.12`, then `112.3`/`112.4`, all
owner-blocked — so the oldest *dispatchable* one is **`189.1`**. Say **which
kind** of blocked when reporting rule 4 as finding nothing (`LOOPS.md` rule 4:
owner-blocked / browser-blocked / agent-blocked), and for a browser-blocked one
name which of `ENVIRONMENT.md`'s two lists it needs.

**On `190.1`:** its Accept is expressed as measurements a cloud wake can take,
but choosing *which* of the three options to implement re-opens what the owner
settled in 173.2. Bring the options and the table to the owner rather than
picking one autonomously.

**Two blind re-scores are still owed and neither can be done in a cloud wake**
(§3b step 4 needs a second agent): `scan`'s three fixed dimensions, and
`skeleton · colour`. Unchanged by this wake.

**Do not re-raise Slice 179's or 182.2's refusals, or 176.3**, which the owner
closed as no-change. Re-measure before reopening anything.

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
- **Did this wake advance it?** **No.** Rule 4 dispatched loop hygiene; nothing
  in the diff touches either package.
- **Work rows since the direction was decided that did not advance it:** derive
  it, do not increment. Re-run the command and READ the matched rows rather than
  `-c`-ing them; the needle over-counts, because a row can mention `create-ui`
  while merely narrating the blockage. **Derived this wake, after this wake's row
  was committed: 58 non-Meta work rows since `fb15cdc`; the needle matches 6;
  reading them, `164.3`, the `0.1.0` release and `185.1` advance the direction,
  while `168.1`, the `173.2`/`185` triage and `186` narrate or detect it — so
  55 of 58 did not.** *(Last honest reads: 52 of 55, 49 of 52, 46 of 47, 43 of
  44, 41 of 42, 38 of 39.)*

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
