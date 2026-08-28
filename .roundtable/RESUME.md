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

Last updated 2026-08-28 (cloud wake, scheduled routine — **rule 4 → Continue,
169.3**). Working tree clean at hand-off; the wake's commits were pushed as one
batch.

**Reconcile this file against `ROADMAP.md` before trusting its open set** — it
goes stale between wakes. Trust the `N. [ ]` checkboxes, not this section.

## Direction — the owner's pick, and whether THIS wake advanced it

**Standing section, added by 168.1 (2026-08-28). Answer all four every wake,
from the sources named — never by copying the answers above you.** Rule 4 always
has an oldest open item, so the loop never stalls and never halts; a *direction*
that nobody can advance is therefore invisible underneath maintenance that looks
healthy. This block is the only place the loop says so out loud. Four answers,
not a rule, not a gate and not a ratio — the three things 168.1 refused.

- **Direction:** (a) adoption/DX — finish it by publishing
  `@busy-office/create-ui`. Source: the `DECISION (owner, 2026-08-28)` block in
  `ROADMAP.md`'s Slice 164.3. **Read it there**; this line is a pointer, and a
  pointer that disagrees with its source loses to the source.
- **Remaining step, and who it waits on:** `npm publish -w
  @busy-office/create-ui` — **owner-only**, by CLAUDE.md's standing policy
  ("Publishing remains owner-triggered"). Do not trust the previous wake's
  answer here; ask the registry, which is the authority and this file is not.
- **Did this wake advance it?** **No.** The remaining step is owner-only, and no
  cloud wake can run it. This wake ran rule 4 → Continue on 169.3.
- **Work rows since the direction was decided that did not advance it:**
  **13 of 14** as of 2026-08-28 (this wake) — the commands below printed `14`
  and `2`. Re-derive rather than increment; a copied number is 169.1's exact
  failure mode.

  **⚠ The `grep -c create-ui` needle over-counts, and it started this wake.** It
  printed `2`, and only ONE of the two advances the direction: 164.3, which
  fixed three publish blockers. The other is **168.1's own row**, which merely
  *narrates* the direction — it says "create-ui is still E404" while advancing
  nothing. So the needle now matches rows that TALK about the direction as well
  as rows that MOVE it, and it acquired that fault one wake after being written,
  because writing the Direction block is itself a thing you write `create-ui`
  into. Read the two matched rows, do not trust the count:

  ```
  git diff fb15cdc..HEAD -- .roundtable/loop-log.md | grep '^+- ' \
    | grep -v ' · Meta · ' | grep create-ui        # print them, don't -c them
  ```

  Left as a two-line read rather than a smarter regex on purpose: any needle
  that tries to separate "advanced" from "mentioned" is guessing at intent from
  prose, which is the semantic-vs-shape line CLAUDE.md draws (94.11).
- **Is that ratio a PROBLEM? No — the owner was shown it and decided otherwise
  (2026-08-28).** Asked directly whether to pause the hourly routine until the
  publish, given a measured 16 machinery : 6 consumer-facing files over twelve
  hours and a direction the loop structurally cannot advance, the owner chose
  **keep it running hourly**. So a wake finding this block's answers unchanged
  is looking at an **accepted state, not a fault**: do not re-triage it, do not
  raise it as a new finding, and do not slow or pause the routine on your own
  judgement. What WOULD be new information: the registry answering something
  other than E404, or the owner picking a different direction.

```
npm view @busy-office/create-ui version     # E404 → unpublished → still blocked
npm view @busy-office/ui version            # 0.5.0 on 2026-08-28

# fb15cdc is the commit carrying the owner's decision. UNSHALLOW FIRST
# (ENVIRONMENT.md trap 2) or these resolve nothing and the rate is silently
# missing, not wrong.
git diff fb15cdc..HEAD -- .roundtable/loop-log.md | grep '^+- ' | grep -vc ' · Meta · '
git diff fb15cdc..HEAD -- .roundtable/loop-log.md | grep '^+- ' | grep -v ' · Meta · ' | grep -c create-ui
```

**When that number climbs and the registry still 404s, say so to the owner** —
that is the whole finding, and on a scheduled routine the push notification is
the only channel it has. No threshold is attached and no gate is proposed:
168.1's Accept names a line in the handover, and a threshold here would be the
ratio that item refused by name.

**`create-ui` is the only name in these commands that will age.** When the owner
picks a direction that is not "publish the front door", the two `npm view` lines
and the `grep -c` needle change with it — and `fb15cdc` becomes whichever commit
carries the new decision. Rewrite them; do not reinterpret them.

## ⚠ THIS WAS A CLOUD WAKE — WHAT WAS NOT LOOKED AT

No Podman, no `localhost:8081`, no screenshots at 1440px/390px in light and dark.

**Nothing visual exists to look at from this wake.** The changed files are
`.roundtable/ENVIRONMENT.md` (new), `.roundtable/RESUME.md`, `LOOPS.md`,
`ROADMAP.md`, `apps/docs/scripts/check-resume-charter.mjs` (new) and
`apps/docs/package.json`. **No CSS, no Astro page and no rendered surface was
touched** — nothing under `apps/docs/src` or `packages/core/src` — which is a
stronger statement than a screenshot. `check:layout` (127 pages) and `test:axe`
(127 × 2) swept every page at both widths anyway and were green. **No visual
debt was added; nothing visual was looked at.**

**The two carried-forward visual items have waited another wake** — both need a
local wake with a browser, and neither is dispatchable here:

- `DsaScore.astro` and `concepts/which-pattern.astro` each gained
  `<span class="bo-badge">generated</span>` inside an existing `<h2>`.
  `DsaScore` renders on 38 pages, so if the badge wraps badly it wraps in 38
  places. First local wake: glance at one component page's "Design-system
  alignment" heading at 390px.
- The `#markers` table on `/components/data-table` at 390px, both themes.

**Traps exercised for real this wake:** 1 (detached HEAD *and* no local `main` —
`git branch --show-current` came back empty, fixed before the first commit), 2
(shallow; `--unshallow` brought it to 1,497 commits, needed because this wake's
finding is a history measurement), 1c and 3. Not exercised: 1b, 4, 5, 6, 7.

## What landed this wake (2026-08-28, cloud, rule 4 → Continue 169.3)

Dispatcher: rule 1 clear (no open P0; GitHub intake **0 open issues**, asked via
the API, not assumed), rule 2 read `Standardize 2 / 4 ok`, rule 3 read
`Objective 2 / 3 ok [168, 170]` — neither fired. Rule 4 took the oldest still-open
item: 112.3/112.4 are owner-blocked and the AT-runtime item needs hardware, so
**169.3**, exactly as the previous handover predicted.

- **169.3 closed — implemented, not refused.** The traps, the toolchain, the
  carried-forward measurement discipline and the standing owner instruction now
  live in `.roundtable/ENVIRONMENT.md`. This file keeps a pointer and only what
  its own header allows.
- **The premise was re-checked and one of its halves did not survive.** 169.3's
  supporting evidence was "content that has survived sixteen manual re-copies is
  durable by demonstration". True, and the continuity probe strengthens it — **9
  probes across 53 revisions, 0 ever dropped and restored**. But that same
  number is counter-evidence for the *stated* risk: the re-copy has never lost
  anything, so loss was never the cost. The real cost is the one 169.1 paid, and
  it is about **visibility, not survival**.
- **Measured this wake, all commands in ROADMAP 169.3:** durable content was
  **214 of 372 lines (57%)** — 169.3 read 63% of 261, and the fraction fell only
  because 168.1 added per-wake answers. Over the 27 revisions since durable
  content first appeared, durable went **9 → 214 lines** and per-wake **93 →
  158**: the half this file is not for grew **3.2x faster** than the half it is
  for. Mean churn over the last 20 commits: **111 lines added+removed per
  commit**, in a file that was 57% content the wake did not change.
- **The refusal argument was weighed and does not transfer.** "A pointer is read
  less than a paragraph" is 167.2's line about splitting *narrative* into an
  archive nobody is instructed to open. `LOOPS.md` Step 0 now names both files,
  which makes this a step the dispatcher executes.
- **`check:resume-charter` is the ratchet**, and it was red on the real tree
  before the move rather than on an injection — the honest way round. Both
  halves red-proved after: drop the pointer → red; paste a durable heading back
  → red.

**Re-run, do not quote** — every figure above has its command in ROADMAP 169.3.

## Counters after this wake

Run `python3 scripts/loops/dispatch_status.py` and read it **immediately after
`record_iteration.py`**, per 166.5's lesson — that comparison has found two of
the parser's five blindings and nothing else ever has.

Read at Step 0b, before any commit: **Standardize 2/4 ok, Objective 2/3 ok
[168, 170]**, parser at 1,033. Read again immediately after
`record_iteration.py`: **Standardize 3/4 ok, Objective 3/3 OVERDUE
[168, 169, 170]**, parser at **1,034 against a raw `grep -c "^- "` of 1,034** —
the agreement that check exists for.

**NEXT WAKE: rule 3 fires — dispatch Objective, a grill of Slices 168, 169 and
170.** It crossed on this wake's own row, which is why Step 0b is read again
after recording. Rule 3 sits above rule 4, so it preempts the build queue; do
not skip it for 170.2. Check `.roundtable/INDEX.md` first — no prior grill
should cover these three, but that is the instruction, not an assumption.

**A grill has material here.** Three candidates, offered as leads, not verdicts:
this wake's `grep -c create-ui` needle acquiring a fault one wake after being
written (168 wrote it, 169's wake tripped it); `check:resume-charter`'s own
first version asserting the wrong headings against the destination, which is the
same shape 168's grill already found 3-of-3 times; and whether moving durable
content out of a rewritten file is a pattern with other instances, or one.

**After the grill, rule 4's oldest dispatchable items are 170.2, then 170.3.**
112.3/112.4 and the AT-runtime item are older but blocked on the owner or on
hardware. Both need no browser and are dispatchable in a cloud wake.
