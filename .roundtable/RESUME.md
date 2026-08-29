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

Last updated 2026-08-29 (cloud wake, scheduled routine — **rule 4 → 185.1,
Slice 188**). Working tree clean at hand-off; the wake's commits went out as one
push.

**Reconcile this file against `ROADMAP.md` before trusting its open set** — it
goes stale between wakes, and it did again this wake: the previous hand-off's
"corrected open set" listed **six** checkboxes and `grep -cE '^\s*[0-9]+\. \[ \]'
ROADMAP.md` read **seven** at Step 0, because `185.1` was filed by the local
dispatcher after that table was written. Trust the checkboxes, not this section.

## What landed this wake (2026-08-29, cloud, rule 4 → Slice 188)

**`185.1` closed: a GitHub Release now publishes both packages.** The scaffolder
has been live since `01:30:23Z` pinning `^0.5.0`, and `publish.yml` would never
have republished it — quieter and worse than the E404 it replaced.

- **The version question is answered in the workflow's own comments, as its
  Accept required.** One tag cannot assert two versions, so create-ui ships on
  core's release without a TAG assertion but with two others: its derived-pin
  check (`framework.json` is `^<core version>`, so the tag's own assertion
  reaches create-ui transitively) and a new `check-publishable.mjs` that refuses
  a release whose versions are already on the registry — which makes a core
  release impossible without a create-ui bump.
- **Refused, with the reason in the workflow:** lockstep versions, and a
  separate `create-ui-v*` trigger (it leaves a core release able to strand the
  scaffolder — the defect being fixed). **Known limit, stated rather than
  hidden:** there is now no path to release create-ui alone.
- **Six branches red-proved against the real registry**, including the one that
  matters — an unreachable registry exits 1 saying nothing was verified, rather
  than reading as "nothing is already published". The `@exact` tag was
  red-proved too (removing it turns `check:selftests` red naming the file;
  `grep -c` confirmed the removal landed before believing the red).
- **Placed in `packages/core/scripts/` on purpose.** `apps/docs`' `build` runs
  `check:repo` → `check-selftests.mjs`, and the docs Containerfile does not copy
  root `scripts/`; teaching that meta-gate a new directory would have broken the
  container build the way `check:rtl`'s DESIGN.md assertion once broke po-app.

## ⚠ THIS WAS A CLOUD WAKE — WHAT WAS NOT LOOKED AT

No Podman, no `localhost:8081`, no screenshots at 1440px/390px in light and dark.

**Nothing this wake needed one** — `git diff --stat` names `.github/workflows/`,
`ROADMAP.md` and one new `packages/core/scripts/*.mjs`; no `.css`, no `.astro`.
That is an argument from the diff, **not a visual check, and it is not claimed
as one.**

**The workflow itself was never executed, and must not be read as verified.** A
release is owner-triggered and a cloud wake cannot cut one. What WAS verified:
the YAML parses with its 13 steps in the intended order; `npm run check -w
@busy-office/create-ui` passes, and fails for the *right reason* when core is
bumped to 0.6.0 (`✗ framework pin (^0.6.0 …) — differs from its source`); and
the new gate's six branches. **The first real release is the first execution of
this workflow — expect to read its log.**

Gates run after the change, all green: core `build` + `test` (146),
`docs:build`, `check:repo` (slice-refs **377** citations, **170** slice numbers
— up one heading and one citation, exactly what Slice 188 adds), `check:claims`
(141), `check:layout` (127), `test:axe` (127 × 2, zero violations).

**Traps exercised for real this wake:** 1 (**no local `main` at all** — `git
rev-parse --short main HEAD` exited 128 with `fatal: Needed a single revision`,
the harder variant `ENVIRONMENT.md` names; fixed with `git checkout -B main
origin/main` before any commit), 1c (`CHROME_PATH` exported in the same command
as every browser gate), 2 (unshallowed before the Direction measurement: 1,583
commits), 3 (`rm -rf apps/docs/dist` before the build). 1b was obeyed rather
than exercised — every command was anchored absolutely and none tripped.

## Counters after this wake

**No prediction was written before recording this wake, so say that rather than
dress the readings up as one** — the previous two hand-offs wrote one first, and
that is the stronger practice; this wake read the counters at Step 0b and again
immediately after `record_iteration.py`, which is the comparison 166.5 requires,
but the arithmetic in between was not committed to paper in advance.

At Step 0b: **1098 iterations logged**, `Standardize 0 / 4`, `Objective 1 / 3
[187]`. After recording one `Continue` row carrying one `--also-refused` (+1
`Meta · refusal` row): **1100** by the parser against a raw `grep -c "^- "` of
**1100**; `Standardize 1 / 4 ok`; `Objective 2 / 3 ok [185, 187]`; `Optimize 0
wake-date(s) newer … ok [101 sample(s)]`. The +2 is what two rows should do, and
the parser and the raw count agree.

**Read `[185, 187]` before assuming rule 3 is one slice from firing.** The row
this wake wrote names **`185.1`**, the item that closed, so `SLICE_TOP` attributes
it to slice **185** — not to Slice 188, which is only the heading the work is
written under. The count is right either way (two slices closed since the last
grill); the *names* are the item's, not the heading's.

**No metric was recorded**, deliberately: nothing this wake measured is a
repeatable sample under an existing name. The gate's branch table is a one-off
verification, and inventing a new single-sample name would pad the store rule 5
reads (184's discipline).

## What the next wake should expect

**Rule 4 has one dispatchable item left, and it is not for a cloud wake.**
Checkboxes at hand-off — re-count rather than copying:

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md      # 6 after 185.1 closed
```

| item | blocked on |
|---|---|
| `15.12` (`12. [ ] AT runtime evidence`) | **owner hardware** |
| `112.3`, `112.4` | **owner** (briefs; 112.4 waits on 112.3's verdict) |
| `173.2` | **a browser** — owner-answered, Accept written, needs live row-height measurement. **A local wake can take this; a cloud wake cannot.** |
| `186.1`, `186.2` | nothing — dispatchable anywhere |

So a **local** wake takes `173.2` (oldest dispatchable there); a **cloud** wake
says so explicitly and takes `186.1`. Rule 2 is at 1/4 and rule 3 at 2/3, so one
more Continue round and one more closed slice change that.

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
  Slice 164.3, which lives in **`ROADMAP-archive.md`** (line ~21190), not
  `ROADMAP.md`. Read it there; a pointer that disagrees with its source loses.
- **Remaining step, and who it waits on.** The publish is done (registry
  answers `0.1.0`), and as of this wake the release workflow ships it too. What
  is left is **one thing this loop cannot check from here: whether
  `@busy-office/create-ui` has a Trusted Publisher configured on npmjs.com.**
  It is configured per package, under that package's own settings, and the
  package page has existed only since `01:30:23Z`. **Stated as unknown, not as
  done** — nothing in this repo can observe it. If it is not set, the first
  release publishes core and then fails on create-ui's publish step; the
  workflow's comments carry the recovery (configure it, then
  `npm publish -w @busy-office/create-ui` by hand — re-running the job would
  fail the publishable check by design).
- **Did this wake advance it?** **Yes** — the direction's own remaining defect
  ("the next release silently skips create-ui") is closed in code, not narrated.
- **Work rows since the direction was decided that did not advance it:** derive
  it, do not increment. Re-run the command and READ the matched rows rather than
  `-c`-ing them; the needle over-counts, because a row can mention `create-ui`
  while merely narrating the blockage. **Derived this wake, against the working
  tree so this wake's own row is included: 52 non-Meta work rows since
  `fb15cdc`; the needle matches 6; reading them, `164.3`, the `0.1.0` release
  and this wake's Slice 188 advance the direction, while `6c4cfae`, `168.1` and
  `186` narrate or detect it — so 49 of 52 did not.** *(Last honest reads: 46 of
  47, 43 of 44, 41 of 42, 38 of 39, 37 of 38.)*

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
npm view @busy-office/create-ui version     # 0.1.0 — published 2026-08-29T01:30:23Z
npm view @busy-office/ui version            # 0.5.0

# fb15cdc is the commit carrying the owner's decision. UNSHALLOW FIRST
# (ENVIRONMENT.md trap 2) or these resolve nothing and the rate is silently
# missing, not wrong.
git diff fb15cdc -- .roundtable/loop-log.md | grep '^+- ' | grep -vc ' · Meta · '
```

**These commands are about to age, and the next owner decision is what ages
them.** The `npm view` lines no longer test a blockage — they confirm a publish
— and the direction's last open question is now a setting on npmjs.com rather
than anything in this tree. When the owner picks a direction beyond "wire the
front door into the release", rewrite them; do not reinterpret them.
