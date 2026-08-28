# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and `check:resume-charter` fails the build if this pointer goes missing
> or if the durable sections grow back here.

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

Last updated 2026-08-28 (cloud wake, scheduled routine — **rule 3 → Objective,
grill of Slices 168/169/170**). Working tree clean at hand-off; the wake's
commits were pushed as one batch.

**Reconcile this file against `ROADMAP.md` before trusting its open set** — it
goes stale between wakes. Trust the `N. [ ]` checkboxes, not this section.

## Direction — the owner's pick, and whether THIS wake advanced it

**Standing section, added by 168.1 (2026-08-28). Answer all four every wake,
from the sources named — never by copying the answers above you.**

- **Direction:** (a) adoption/DX — finish it by publishing
  `@busy-office/create-ui`. Source: the `DECISION (owner, 2026-08-28)` block in
  `ROADMAP.md`'s Slice 164.3. **Read it there**; this line is a pointer, and a
  pointer that disagrees with its source loses to the source.
- **Remaining step, and who it waits on:** `npm publish -w
  @busy-office/create-ui` — **owner-only**, by CLAUDE.md's standing policy
  ("Publishing remains owner-triggered"). Asked the registry this wake, which is
  the authority: **still E404**.
- **Did this wake advance it?** **No.** The remaining step is owner-only, and no
  cloud wake can run it. This wake ran rule 3 → Objective.
- **Work rows since the direction was decided that did not advance it:**
  **15 of 16** as of this wake (was 13 of 14). Re-derive rather than increment;
  a copied number is 169.1's exact failure mode.

  **⚠ The `grep -c create-ui` needle over-counts.** It prints `2`, and only ONE
  of the two advances the direction: 164.3, which fixed three publish blockers.
  The other is 168.1's own row, which merely *narrates* the direction. Read the
  two matched rows; do not trust the count:

  ```
  git diff fb15cdc..HEAD -- .roundtable/loop-log.md | grep '^+- ' \
    | grep -v ' · Meta · ' | grep create-ui        # print them, don't -c them
  ```

  Left as a two-line read rather than a smarter regex on purpose: any needle
  that tries to separate "advanced" from "mentioned" is guessing at intent from
  prose, which is the semantic-vs-shape line CLAUDE.md draws (94.11).
- **Is that ratio a PROBLEM? No — the owner was shown it and decided otherwise
  (2026-08-28).** Asked directly whether to pause the hourly routine until the
  publish, the owner chose **keep it running hourly**. So a wake finding this
  block's answers unchanged is looking at an **accepted state, not a fault**: do
  not re-triage it, do not raise it as a new finding, and do not slow or pause
  the routine on your own judgement. What WOULD be new information: the registry
  answering something other than E404, or the owner picking a different
  direction.

```
npm view @busy-office/create-ui version     # E404 → unpublished → still blocked
npm view @busy-office/ui version            # 0.5.0 on 2026-08-28

# fb15cdc is the commit carrying the owner's decision. UNSHALLOW FIRST
# (ENVIRONMENT.md trap 2) or these resolve nothing and the rate is silently
# missing, not wrong.
git diff fb15cdc..HEAD -- .roundtable/loop-log.md | grep '^+- ' | grep -vc ' · Meta · '
```

**`create-ui` is the only name in these commands that will age.** When the owner
picks a direction that is not "publish the front door", the two `npm view` lines
and the needle change with it — and `fb15cdc` becomes whichever commit carries
the new decision. Rewrite them; do not reinterpret them.

## ⚠ THIS WAS A CLOUD WAKE — WHAT WAS NOT LOOKED AT

No Podman, no `localhost:8081`, no screenshots at 1440px/390px in light and dark.

**Nothing visual exists to look at from this wake.** The changed files are
`apps/docs/scripts/check-resume-charter.mjs`,
`apps/docs/scripts/check-selftests.mjs`, `ROADMAP.md`, this file and the grill
report. **No CSS, no Astro page and no rendered surface was touched** — nothing
under `apps/docs/src` or `packages/core/src` — which is a stronger statement
than a screenshot. `check:layout` and `test:axe` swept every page at both widths
anyway and were green. **No visual debt was added; nothing visual was looked
at.**

**The two carried-forward visual items have waited another wake** — both need a
local wake with a browser, and neither is dispatchable here:

- `DsaScore.astro` and `concepts/which-pattern.astro` each gained
  `<span class="bo-badge">generated</span>` inside an existing `<h2>`.
  `DsaScore` renders on 38 pages, so if the badge wraps badly it wraps in 38
  places. First local wake: glance at one component page's "Design-system
  alignment" heading at 390px.
- The `#markers` table on `/components/data-table` at 390px, both themes.

**Traps exercised for real this wake:** 1 (no local `main` at all —
`git branch --show-current` came back empty, fixed before the first commit), 1b
(a persisted `cd apps/docs` made a restore-from-scratchpad `cp` fail with "No
such file or directory" mid-red-proof; the injected file was left on disk for
one command), 1c and 2. Not exercised: 3, 4, 5, 6, 7.

## What landed this wake (2026-08-28, cloud, rule 3 → Objective 168/169/170)

Dispatcher: rule 1 clear (no open P0; GitHub intake **0 open issues**, asked via
the API, not assumed), rule 2 read `Standardize 3 / 4 ok`, rule 3 read
`Objective 3 / 3 OVERDUE [168, 169, 170]` and fired. Full report:
`.roundtable/grill-objective-168-169-170-2026-08-28.md`; slice entry is 172.

- **172.1 — a gate shipped one wake ago was tagged `@exact` while resting on a
  parser, and that parser FAILED OPEN.** `check-resume-charter.mjs`: pasting a
  moved heading back into `RESUME.md` goes red as it should, but the identical
  paste preceded by one stray fence line went **GREEN** — the open fence makes
  every heading below it invisible and the checks pass by not looking. Tag
  corrected to `@heuristic`, the fail-open condition asserted as its own loud
  failure, and the `--self-test` the tag owes now ships. Base rate decided the
  scope: **1 of 39** `@exact` gates does markdown-structure recognition, so no
  new mechanism — `check:selftests` already enforces the pairing.
- **172.1b — the meta-gate had the same bug one line above its own comment about
  it.** `check-selftests.mjs` matched `@exact` as a substring, so a header
  explaining a retag read as claiming both tags. Now matched at the declaration
  position. Reconciled against the unchanged tree (`43: 12 heuristic, 31 exact`)
  and the new one (`43: 13 / 30`).
- **Two findings recorded, not itemised.** A: 170's "the self-arm is a first" is
  superseded — it repeated on the very next dispatch, and Slice 170's entry is
  annotated in place. The verdict does not change, and the reason is that the
  17% → 56% trajectory a first reading produced is confounded by arming-set
  size; controlled, it is flat. C: the window's figures re-verify, and this wake
  produced **three** instrument defects of its own, all caught by reconciliation.

**Re-run, do not quote** — every figure above has its command in the report.

## Counters after this wake

Run `python3 scripts/loops/dispatch_status.py` and read it **immediately after
`record_iteration.py`**, per 166.5's lesson — that comparison has found two of
the parser's five blindings and nothing else ever has.

Read at Step 0b, before any commit: **Standardize 3/4 ok, Objective 3/3 OVERDUE
[168, 169, 170]**, parser at 1,036 against a raw `grep -c "^- "` of 1,036.
Read again immediately after `record_iteration.py`: **Standardize 4/4 OVERDUE,
Objective 1/3 ok [172]**, parser at **1,040 against a raw 1,040**.

**That second read earned its place, and it caught a wrong sentence this file
had already been given.** The paragraph below said *"expect rule 4 → Continue"*,
reasoning that an `Objective` row resets rule 3. True, and irrelevant: the same
wake's `Continue` row for 172.1 pushed **Standardize** over its own threshold,
and rule 2 sits above rule 4. This is 166.5's lesson working exactly as written —
the counter is only ever caught by a number disagreeing with something a human
just wrote down.

**NEXT WAKE: rule 2 fires → dispatch Standardize** (`Standardize 4/4 OVERDUE`).
Rule 3 will not: an `Objective` row reset it to 1/3, and the `[172]` it already
holds is this grill's own follow-up row — finding A happening again, one wake
after being measured. Re-read `dispatch_status.py` at Step 0b rather than
trusting this line.

**When rule 4 is reached, its oldest dispatchable item is 169.4**, then
**170.2**, **170.3**, then 171.1-171.3 — re-derive from `ROADMAP.md`'s `N. [ ]`
checkboxes, do not carry this forward. 112.3/112.4 and the AT-runtime item are
older but blocked on the owner or on hardware. 169.4, 170.2 and 170.3 need no
browser and are dispatchable in a cloud wake.

**169.4 remains the one thing worth an owner's eye**, unchanged from last wake:
`check:repo` reads `.roundtable/RESUME.md` while `.roundtable/**` is in CI's
`paths-ignore`, so a commit touching only that path can break `check:repo`
without being built. **This wake made that item strictly more valuable**: the
charter gate now carries a `--self-test` and one more assertion, so there is
more of it to break unbuilt.
