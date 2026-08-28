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

Last updated 2026-08-28 (cloud wake, scheduled routine — **rule 4 → Continue,
173.3**). Working tree clean at hand-off; the wake's one commit was pushed.

**Reconcile this file against `ROADMAP.md` before trusting its open set** — it
goes stale between wakes. Trust the `N. [ ]` checkboxes, not this section.

## ⚠ THIS WAKE LOST A COLLISION — AND THE LOSING WORK WAS THE WORSE ONE

Third recorded exercise of Step 0c, and the first where **the loser was
demonstrably wrong**, which is the part worth carrying forward.

This wake dispatched rule 4 → **173.1** (the only item that looked
cloud-dispatchable at Step 0b), built it, measured it green, and then found at
the mandated pre-commit `git fetch origin main` that a local wake had landed
173.1 four minutes earlier (`3c9964f`, `e4d3e7f`). Work discarded per Step 0c,
no push attempted.

**The discard was correct on the merits, not just on the rule.** This wake's fix
shrank the demo's chunks to four rows and claimed *"the arithmetic is the real
one"* — `4 × 40px` from `--bo-density-row-height`. That is the **reverted
design**: `windowed-list.ts` measures a real row instead, because real rows
render taller than the token. The landed fix caught that and corrected the page;
this one would have shipped a fresh statement of the bug the behavior's own
header comment records. Redundant coverage found a defect again — this time in
its own work.

Two measurements from the discarded round are worth keeping, both re-runnable:

- **The Accept's first candidate does not satisfy the Accept.** "A bounded
  scroll container on the demo" was measured, with the injection asserted in the
  DOM: at `max-block-size: 400px` the reader sees **0 of 4** data rows at rest
  and must scroll **2,041px inside the box** to reach the first one. It
  relocates the blank, it does not remove it. The landed fix took the other
  candidate.
- Baseline reproduced exactly at 1440px and 390px: `2000/160/2000`, table
  4200px, first data row **2000px** below the header — agreeing with the figure
  173.1 recorded from a different instrument, which is what made the probe
  trustworthy.

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
  cloud wake can run it. This wake ran rule 4 → Continue on 173.3.
- **Work rows since the direction was decided that did not advance it:**
  **30 of 31** as of this wake (was 23 of 24). Derived this wake, unshallowed
  first; re-derive rather than increment — a copied number is 169.1's exact
  failure mode. The needle matched **2** rows and only **164.3** advances the
  direction; **168.1** merely narrates it, which is why the count below is a
  read, not a `-c`.

  **⚠ The `grep -c create-ui` needle over-counts.** Only ONE of its matches
  advances the direction (164.3, which fixed three publish blockers); the other
  merely *narrates* it (168.1's own row). Read the matched rows; do not `-c`
  them:

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

**The commit's only rendered change is two prose corrections on
`/concepts/scale`** — a comment inside the copied markup, and one clause in the
caption below the demo. `git show --stat 8d51e8b` names one new test file, one
behavior source file (a comment block), `ROADMAP.md` and that one `.astro` page:
**no CSS, no component markup, no layout**. `check:layout` and `test:axe` swept
127 pages at both widths and were green, and the unit suite is 146/146.
**No visual debt was added; nothing visual was looked at.**

**The two carried-forward visual items have waited another wake** — both need a
local wake with a browser, and neither is dispatchable here:

- `DsaScore.astro` and `concepts/which-pattern.astro` each gained
  `<span class="bo-badge">generated</span>` inside an existing `<h2>`.
  `DsaScore` renders on 38 pages, so if the badge wraps badly it wraps in 38
  places. First local wake: glance at one component page's "Design-system
  alignment" heading at 390px.
- The `#markers` table on `/components/data-table` at 390px, both themes.

**Traps exercised for real this wake:** 1 (detached HEAD at container start;
`origin/main` arrived as a forced update `17b3ba6...b0d4a86`), 1b, 1c, 6 (a
background gate's empty output file read as "still running", correctly). Not
exercised: 2, 3, 4, 5, 7.

## What landed this wake (2026-08-28, cloud, rule 4 → Continue on 173.3)

Dispatcher: rule 1 clear (no open P0; GitHub intake **0 open issues**, asked via
the API, not assumed), rule 2 `Standardize 0/4 ok`, rule 3 `Objective 0/3 ok`,
so rule 4 fired. First dispatch was 173.1 and was lost to a collision (above);
re-dispatched to **173.3**, which the winning wake had queued in the meantime.

- **173.3 — `initWindowedList` had ZERO tests.** Nine now, in
  `packages/core/tests/windowed-list.test.ts`, red-proved with **five**
  injections into the built `dist/js/behaviors/windowed-list.js`, each verified
  by grep before the result was believed.
- **Its Accept's premise was FALSE, and that is the finding.** The Accept asked
  for the page's claim *"measured once at bind and cached"*. Measured:
  **0 rect reads on `tr[data-row-id]` at bind, 1 at the first eviction** —
  `chunkRowHeightPx` is called from `makeSpacer`, lazily, on the scroll path.
  Two documents said otherwise; both corrected in the same commit. The intent
  (one read per table, never per eviction) holds; the wording never did.
- **jsdom cannot give real row heights, as the Accept anticipated.** Stubbed
  32.5px, deliberately unequal to the 40px token fallback, so every height
  assertion discriminates. The property a stub cannot hold — real rows render
  taller than the token — was **already** in a browser gate
  (`check-po-app.mjs`'s `spacerMatchesReal`); nothing new was written for it,
  and that is stated rather than implied.

**Re-run, do not quote** — every figure above is a snapshot and the ROADMAP
entry carries its commands.

## Counters after this wake

Run `python3 scripts/loops/dispatch_status.py` and read it **immediately after
`record_iteration.py`**, per 166.5's lesson — that comparison has found two of
the parser's five blindings and nothing else ever has.

Read at Step 0b against tip `b0d4a86`: **Standardize 0/4 ok, Objective 0/3 ok**,
parser 1,059 against a raw `grep -c "^- "` of 1,059. Read again after the
mid-wake fast-forward onto the winning wake's two commits: **Standardize 1/4 ok,
Objective 1/3 ok [173]**, parser 1,060 against a raw 1,060.
Read again immediately after `record_iteration.py`: **Standardize 2/4 ok,
Objective 1/3 ok [173]**, parser **1,062 against a raw 1,062** (this wake's
Continue row plus its `--also-refused` Meta row).

**NEXT WAKE: expect rule 4 → Continue again**, but re-read `dispatch_status.py`
at Step 0b rather than trusting this line.

**When rule 4 is next reached, re-derive its oldest dispatchable item from
`ROADMAP.md`'s `N. [ ]` checkboxes.** At hand-off the open set is **5**, and
**every one is owner-blocked or needs hardware**:

- `112.3` / `112.4` — blocked on owner briefs, and on 112.3's verdict.
- `173.2` — explicitly *owner to pick* between two candidates (a row-level error
  row, or a message that floats on focus).
- `175.4` — OWNER CALL, Step 0c's reopen condition.
- `AT runtime evidence` (Slice 15) — NEEDS-RUNTIME, owner hardware.

**So the next wake may well reach rule 8 and halt.** That is the correct
outcome if it does — report the blocking set once and stop, per rule 8. Do not
manufacture work, and do not re-dispatch Explore. Check first whether the local
dispatcher has triaged anything since; it has been producing items faster than
the cloud routine closes them all day.
