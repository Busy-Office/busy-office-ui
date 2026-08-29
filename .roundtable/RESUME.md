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

Last updated 2026-08-29 (cloud wake, scheduled routine — **rule 3 → Objective,
Slice 190**). Working tree clean at hand-off; the wake's commits went out as one
push.

**⚠ THIS WAKE COLLIDED WITH THE LOCAL DISPATCHER AND BOTH SIDES ARE ON `main`.**
Both took the same rule-3 dispatch. The local one pushed first (**Slice 189**,
`.roundtable/grill-objective-173-185-186-187-2026-08-29.md`); this one was
rebased and renumbered 189 → **190**. **Third recorded collision, and the first
caught before a single commit** — by Step 0c's mandated `git fetch origin main`
immediately before the first commit, which saw `94cc5a3..00023f30`. The "safe by
construction" argument played no part: `loop-log.md` was untouched here at the
time, exactly as its own correction predicts. Both grills are kept per Step 0c;
they are complementary, and where they meet (owner- vs browser-blocked) **189's
finding C has priority**.

**Reconcile this file against `ROADMAP.md` before trusting its open set** — it
goes stale between wakes, which is what 186.1 is open about. Trust the
checkboxes, not this section:

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md      # 8 at hand-off
# 5 at Step 0b, minus 186.2 (closed by the local dispatcher mid-wake),
# plus its 189.1, plus this wake's 190.1-190.3.
```

## What landed this wake (2026-08-29, cloud, rule 3 → Slice 190)

**An Objective grill of Slices 173, 185 and 187**, report in
`.roundtable/grill-objective-173-185-187-2026-08-29.md`. Nothing in the shipped
package changed; three items are filed and three durable-file corrections landed.

**Cross-cut: every assertion checked against its own mechanism reproduced;
every assertion reasoned out beside one did not.** 173.2's row heights, sibling
shift, accessible description and no-clip — 4 of 4. 185/188's registry read,
YAML step order, derived-pin-in-CI — 3 of 3. 187.1's `scan:dead-style` **0 dead
of 1428**, `report:css-repeats` **8 groups**, byte-identical JSON — 3 of 3.
Against that: 173.2's specificity arithmetic (wrong twice) and its
"3.5rem is the message's own box" (false past ~2 lines). Hypothesis, n = 3.

**185 and 187 are the controls and both are clean** — re-verified from this
container rather than from the slices' own accounts. `check-publishable.mjs`
exits 1 against the live registry naming both packages; it imports only `node:`
builtins, so sitting before `npm ci` in `publish.yml` is safe rather than lucky;
and `npm run check -w @busy-office/create-ui` runs in `ci.yml:182`, so the
derived-pin assertion is not release-only.

**Filed, all three with commands in the report:**

- **190.1** — a grid cell's validation message is **clipped past ~2 lines**.
  `padding-block-end: 3.5rem` is a constant reserving room for a box whose
  height is a function of the text, and `max-inline-size: 18ch` is the bigger
  half of the cause (it turns a 1-line message into a 6-line box). 101-char
  message → box 118px, reserve 56px, **clipped 53px**; the shipped 21-char one
  has 19px to spare, which is why nothing shows it.
- **190.2** — 173.2 added **three** runtime claims to `/patterns/editable-grid`
  and **zero** cases to `check-claims.mjs` (141 before and after). The recipe's
  existing step, skipped once.
- **190.3** — `data-table.css:442`'s specificity comment: measured **(0,4,0) vs
  (0,3,1)**, comment says (0,3,0) vs (0,2,0), and **(0,2,0) is the *other*
  rule's** — the no-`:has()` fallback's. Conclusion still correct.

**Severity was corrected by measurement, and that is recorded rather than
tidied away.** 190.1 was drafted as a **P0** on the reasoning that readable
became unreadable. Measuring first: the container is `overflow: auto`,
`scrollable 54` against `53` needed, so the text is reachable by scrolling and
nothing is lost. Filed as an ordinary item. The wake's own cross-cut, applied to
the wake.

**Three corrections landed in durable files rather than being filed** — that is
where a correction survives (169.3):

- **Trap 1's diagnostic was wrong.** `git rev-parse --short main HEAD` exits 128
  with `fatal: Needed a single revision` **whether or not `main` exists**, because
  `--short` takes one revision (git 2.43.0, measured both ways). The file
  attributed that message to a missing branch, and the previous hand-off recorded
  it as trap 1 "exercised for real". `git rev-parse main HEAD` is the command.
- **"No screenshots" is not "no browser".** A cloud wake drives the same headless
  Chrome the docs gates use; what it cannot do is compare rendered images.
  `ENVIRONMENT.md` now splits the two lists and says to name which one a declined
  item needs.
- **`LOOPS.md` rule 4's brand-new browser-blocked bullet carried that same
  over-broad clause**, landed by Slice 189 minutes earlier. Amended from *"needs
  Podman, a real browser, screenshots"* to **"needs Podman and screenshots"**,
  pointing at those two lists. A three-way split that mis-sorts is the failure the
  undifferentiated word had, one level finer.

## ⚠ THIS WAS A CLOUD WAKE — WHAT WAS NOT LOOKED AT

No Podman, no `localhost:8081`, no screenshots at 1440px/390px in light and dark.

**Nothing this wake needed one.** `git diff --stat` names `ROADMAP.md`,
`.roundtable/ENVIRONMENT.md`, `LOOPS.md` (one clause) and one new `.roundtable/*.md`; no `.css`, no
`.astro`, no `.mjs`. That is an argument from the diff, **not a visual check,
and it is not claimed as one.**

**Every number in Slice 190 is a layout-geometry, computed-style or
accessibility-tree reading**, taken through `browser-harness.mjs` +
`serve-dist.mjs` from throwaway probes in the scratchpad (deleted; the commands
are reproduced in the report). None of them is a look at a picture, and 190.1's
eventual fix will need one even though its Accept is measurable.

Gates run after the change, all green: core `test` (**146**), `check:repo`
(slice-refs **383** citations, **172** slice numbers — up two headings from the
170/377 the last hand-off recorded, which is Slices 189 and 190 together),
`check:claims` (**141**),
`check:layout`, `test:axe`. `build -w @busy-office/ui` and `docs:build` ran green
before the edits, which touched no input to either.

**Traps exercised for real this wake:** 1 (started detached — `git branch
--show-current` empty; fixed with `git checkout -B main origin/main`, and
`origin/main` again arrived as a **forced update**, `17b3ba6...94cc5a3`), 1c
(`CHROME_PATH` exported in the same command as every browser run), 2 (unshallowed
before any history measurement: **1,588** commits), 3 (`rm -rf apps/docs/dist`
before the build). 1b was obeyed rather than exercised. **Trap 1's own
diagnostic was found wrong while exercising it** — see above.

## Counters after this wake

**Prediction, written before recording** (166.5's comparison, and the practice
the last hand-off said it had skipped). At Step 0b this wake read **1103
iterations logged**, `Standardize 2 / 4`, `Objective 3 / 3 OVERDUE [173, 185,
187]`, `Optimize 0 wake-date(s) newer … ok`.

**The baseline then moved underneath the prediction, and that is the collision
rather than a parser fault.** After the rebase the same command reads **1106**,
`Standardize 3 / 4`, `Objective 0 / 3 since 11:29` — the local dispatcher's three
rows (its grill, its `186.2` row and a refusal). So **`Objective` was already
discharged by their row before this one was written**, and rule 3 will not
re-fire on this wake's row either.

Predicted for this wake's own recording: one `Objective` row carrying one
`--also-refused` (+1 `Meta · refusal` row) → **1108**, `Objective` still `0 / 3`,
`Standardize` **still 3 / 4** — an Objective row is not a Continue round, so rule
2 must not move. Verify against the run output and against a raw
`grep -c "^- " .roundtable/loop-log.md`; **if the parser and the raw count
disagree, the parser loses** (they agreed at 1106/1106 after the rebase).

**No metric was recorded**, deliberately. Nothing measured here is a repeatable
sample under an existing name — the clip table is a one-off characterisation of
one component, and inventing a single-sample name pads the store rule 5 reads
(184's discipline).

## What the next wake should expect

**Rule 3 has just been discharged, so rule 4 governs**, and it now has
dispatchable work that is *not* owner-blocked for the first time in several
wakes. Checkboxes at hand-off — re-count rather than copying:

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md      # 8
```

| item | blocked on | cloud-wake takeable? |
|---|---|---|
| `15.12` (`12. [ ] AT runtime evidence`) | **owner hardware** | no |
| `112.3`, `112.4` | **owner** (briefs; 112.4 waits on 112.3's verdict) | no |
| `186.1` | nothing | **yes** |
| `189.1` (theirs — CLAUDE.md wording) | nothing | **yes** |
| `190.1` | nothing, but it **re-opens an owner-settled trade** | measurable here; the fix is a design call |
| `190.2`, `190.3` | nothing | **yes** |

Rule 4 takes the **oldest still-open** item, which is `15.12`, then `112.3`/
`112.4` — all owner-blocked — so the oldest *dispatchable* one is **`186.1`**,
unchanged from the last hand-off and now two wakes old. `189.1`, `190.2` and
`190.3` are the cheapest and are fully cloud-takeable.

**On `190.1`:** its Accept is expressed as measurements a cloud wake can take
(see `ENVIRONMENT.md`'s two lists), but choosing *which* of the three options to
implement re-opens what the owner settled in 173.2. Bring the options and the
table to the owner rather than picking one autonomously.

**Two blind re-scores are still owed and neither can be done in a cloud wake**
(§3b step 4 needs a second agent): `scan`'s three fixed dimensions, and
`skeleton · colour`. Unchanged by this wake.

**Do not re-raise Slice 179's or 182.2's refusals, or 176.3**, which the owner
closed as no-change. Do not re-raise this wake's refusal of a
"every CSS constant names what it is sized against" gate — 94.11 and 176.2 are
the measured record of what that costs. Re-measure before reopening anything.

## Direction — the owner's pick, and whether THIS wake advanced it

**Standing section, added by 168.1 (2026-08-28). Answer all four every wake,
from the sources named — never by copying the answers above you.**

- **Direction:** (a) adoption/DX — finish it by publishing
  `@busy-office/create-ui`. Source: the `DECISION (owner, 2026-08-28)` block in
  Slice 164.3, which lives in **`ROADMAP-archive.md`** (verified this wake at
  **line 21190**), not `ROADMAP.md`. Read it there; a pointer that disagrees with
  its source loses.
- **Remaining step, and who it waits on.** The publish is done (`npm view
  @busy-office/create-ui version` → `0.1.0`) and the release workflow ships it.
  What is left is **one thing this loop cannot check from here: whether
  `@busy-office/create-ui` has a Trusted Publisher configured on npmjs.com.**
  **Stated as unknown, not as done.** If it is not set, the first release
  publishes core and then fails on create-ui's publish step; the workflow's
  comments carry the recovery. New this wake, and it sharpens the picture: a
  release cannot even be *attempted* today without a version bump —
  `check-publishable.mjs` exits 1 on both packages, by design.
- **Did this wake advance it?** **No.** Rule 3 dispatched an Objective grill;
  185/188 appear in it only as the control being re-verified. Said plainly rather
  than credited to the re-verification.
- **Work rows since the direction was decided that did not advance it:** derive
  it, do not increment. Re-run the command and READ the matched rows rather than
  `-c`-ing them; the needle over-counts, because a row can mention `create-ui`
  while merely narrating the blockage. **Derived this wake against the working
  tree, before this wake's own row exists: 54 non-Meta work rows since
  `fb15cdc`; the needle matches 6; reading them, `164.3`, the `0.1.0` release
  and `185.1` advance the direction, while `168.1`, the `173.2`/`185` triage and
  `186` narrate or detect it — so 51 of 54 did not. This wake's row makes it 52
  of 55.** *(Last honest reads: 49 of 52, 46 of 47, 43 of 44, 41 of 42, 38 of 39.)*

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
