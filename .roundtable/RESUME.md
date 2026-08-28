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
build mode, item 170.2**). Working tree clean at hand-off; the wake's commits
were pushed as one batch.

**Reconcile this file against `ROADMAP.md` before trusting its open set** — it
goes stale between wakes. Trust the `N. [ ]` checkboxes, not this section. It
went stale again between the last two wakes: the previous handover named 169.4
as the oldest dispatchable item and a local wake had already closed it (`33fb89e`)
before this one started.

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
  cloud wake can run it. This wake ran rule 4 → Continue on 170.2.
- **Work rows since the direction was decided that did not advance it:**
  **19 of 20** as of this wake (was 15 of 16). Re-derive rather than increment;
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

**Nothing visual exists to look at from this wake, and nothing in it needed a
browser.** `git show --stat` on the wake's commits names `ROADMAP.md`, this
file, `STATUS.md` and `.roundtable/loop-log.md` — **no CSS, no Astro page, no
shipped JS**, nothing under `apps/docs/src` or `packages/core/src`. That is a
stronger statement than a screenshot. `check:layout` and `test:axe` swept 127
pages at both widths anyway and were green. **No visual debt was added; nothing
visual was looked at.**

**The two carried-forward visual items have waited another wake** — both need a
local wake with a browser, and neither is dispatchable here:

- `DsaScore.astro` and `concepts/which-pattern.astro` each gained
  `<span class="bo-badge">generated</span>` inside an existing `<h2>`.
  `DsaScore` renders on 38 pages, so if the badge wraps badly it wraps in 38
  places. First local wake: glance at one component page's "Design-system
  alignment" heading at 390px.
- The `#markers` table on `/components/data-table` at 390px, both themes.

**Traps exercised for real this wake:** 1 (`origin/main` arrived as a forced
update, `17b3ba6...33fb89e`, and the tip the previous handover implied was gone),
2 (shallow clone — unshallowed before any history command). Not exercised:
1b, 1c beyond routine, 3, 4, 5, 6, 7.

## What landed this wake (2026-08-28, cloud, rule 4 → Continue on 170.2)

Dispatcher: rule 1 clear (no open P0; GitHub intake **0 open issues**, asked via
the API, not assumed), rule 2 read `Standardize 1 / 4 ok`, rule 3 read
`Objective 2 / 3 ok [169, 172]`, so rule 4 fired. Its oldest dispatchable item:
112.3/112.4 are owner-blocked and the AT-runtime item needs owner hardware, so
**170.2**.

- **170.2 — REFUSED on the measured base rate, verdict (b).** The predicate ("a
  line naming an item id whose checkbox is `[x]`") examines **1,289** narrative
  lines across 162 tracked `.md` files and flags **1,258 (97.6%)**. Narrowing
  does not rescue it: 95.3% on `ROADMAP.md`'s own narrative, 96.1% on table rows
  repo-wide, **4 of 4** on the one `## Sequence` table the item exists for. The
  shape-gate retreat was measured rather than argued away: **45 of 45** sections
  holding an id-naming table row hold a closed-item row, so its `EXEMPT` map
  would cover all 45.
- **Three findings inside it that are worth more than the verdict**, all in
  ROADMAP 170.2: S4 flags a section 170.1 already fixed (its supersession block
  is prose, so nothing mechanical separates "stale" from "correctly
  superseded"); the predicate is **blind to the two worst rows** of that table,
  because `130.4b`/`130.4c` never got checkboxes; and it flagged row 2 on
  `140.1` cited in the row's *rationale*, not on its subject `130.4a`.

**Re-run, do not quote** — the entry carries the whole measurement as one
heredoc, and the rates are snapshots.

## Counters after this wake

Run `python3 scripts/loops/dispatch_status.py` and read it **immediately after
`record_iteration.py`**, per 166.5's lesson — that comparison has found two of
the parser's five blindings and nothing else ever has.

Read at Step 0b, before any commit: **Standardize 1/4 ok, Objective 2/3 ok
[169, 172]**, parser at 1,043 against a raw `grep -c "^- "` of 1,043.
Read again immediately after `record_iteration.py`: **Standardize 2/4 ok,
Objective 3/3 OVERDUE [169, 170, 172]**, parser at **1,045 against a raw 1,045**.

**NEXT WAKE: rule 3 fires → dispatch Objective**, a grill of **169, 170, 172**.
Re-read `dispatch_status.py` at Step 0b rather than trusting this line.

**Slice 170's own finding B is happening again, for the third time, and it is
already recorded as "recorded, not gated" — do NOT re-file it.** 170 is armed
here by *this wake's* `Continue` row for 170.2, and 170 is itself a grill-derived
slice; 172 is the previous grill's follow-up. Two of the three armed slices are
grill-derived again. ROADMAP Slice 170's finding B carries the command and the
verdict; the next grill should re-run it, not rediscover it.

**When rule 4 is next reached, its oldest dispatchable item is 170.3**, then
171.1, 171.2, 171.3 — re-derive from `ROADMAP.md`'s `N. [ ]` checkboxes (7 open,
plus `AT runtime evidence` which carries no id), do not carry this forward.
112.3/112.4 and the AT-runtime item are older but blocked on the owner or on
hardware. 170.3 and 171.1-171.3 need no browser and are dispatchable in a cloud
wake.

**170.3 is the one worth doing next in a cloud wake**: `dispatch_status.py`'s
zero-slice guard hard-exits on a legitimate slice-less row, and a hard exit
kills the dispatcher's own Step 0b for the following wake.
