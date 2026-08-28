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

Last updated 2026-08-28 (cloud wake, scheduled routine — **rule 3 → Objective,
grill of 169/170/172**). Working tree clean at hand-off; the wake's commits were
pushed as one batch.

**Reconcile this file against `ROADMAP.md` before trusting its open set** — it
goes stale between wakes. Trust the `N. [ ]` checkboxes, not this section. It was
stale again at this wake's Step 0: it named 170.3 as the next dispatchable item
and knew nothing of Slice 173, which a local wake had triaged since.

**THIS WAKE COLLIDED WITH A LOCAL ONE, AND BOTH GRILLS LANDED.** Step 0c
exercised for real, second recorded time. The local wake ran the SAME rule-3
dispatch and recorded its Objective row at 13:36Z (`0131ebc5`); this wake found
out at the pre-commit re-fetch, four commits behind, and rebased rather than
discarded because the two grills share no finding — checked by reading its
report, not by title. Both reports now sit in `.roundtable/`, and both rows sit
in the log. `LOOPS.md` says to keep both; that is what happened.

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
  **23 of 24** as of this wake (was 19 of 20). Re-derive rather than increment;
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
browser.** `git show --stat` on the wake's commits names two gate scripts under
`apps/docs/scripts/`, `ROADMAP.md`, `LOOPS.md`, this file, `STATUS.md`, the grill
report and `.roundtable/loop-log.md` — **no CSS, no Astro page, no shipped JS**,
nothing under `apps/docs/src` or `packages/core/src`. That is a stronger
statement than a screenshot. `check:layout` and `test:axe` swept every page at
both widths anyway and were green. **No visual debt was added; nothing visual was
looked at.**

**The two carried-forward visual items have waited another wake** — both need a
local wake with a browser, and neither is dispatchable here:

- `DsaScore.astro` and `concepts/which-pattern.astro` each gained
  `<span class="bo-badge">generated</span>` inside an existing `<h2>`.
  `DsaScore` renders on 38 pages, so if the badge wraps badly it wraps in 38
  places. First local wake: glance at one component page's "Design-system
  alignment" heading at 390px.
- The `#markers` table on `/components/data-table` at 390px, both themes.

**Traps exercised for real this wake:** 1 (`origin/main` arrived as a forced
update, `17b3ba6...5f21113`), 2 (shallow clone — unshallowed before the 710-
revision replay in 175.1), 1b, 1c. Not exercised: 3, 4, 5, 6, 7.

## What landed this wake (2026-08-28, cloud, rule 3 → Objective on 169/170/172)

Dispatcher: rule 1 clear (no open P0; GitHub intake **0 open issues**, asked via
the API, not assumed), rule 2 read `Standardize 3 / 4 ok`, rule 3 read
`Objective 3 / 3 OVERDUE [169, 170, 172]`, so rule 3 fired. Report:
`.roundtable/grill-objective-169-170-172-2026-08-28.md`.

- **175.1 — `## Slice 172` headed two slices**, the first collision in 710
  revisions of `ROADMAP.md`. `check:slice-refs` could not see it (it asks
  whether a citation resolves, never whether it resolves *uniquely*); the
  self-arm script silently reclassified an owner bug report as grill-derived;
  and `dispatch_status.py`'s `sorted({...})` subtracted exactly one slice from
  rule 3's arming count — red-proved 3 → 4 on a probe log. Renumbered the later
  slice to **174**; gate gained a uniqueness assertion, red-proved by
  re-introducing the collision.
- **175.2 — the charter gate's pointer assertion could never detect the
  pointer's removal.** `resume.includes('ENVIRONMENT.md')` fired only when all
  three mentions were gone; every revision since 169.3 has 3-5 mentions and one
  blockquote, so the red-proof recorded in its header was over-claimed from its
  first commit. Now a blockquote match, with the discriminating self-test pair.
- **175.3 — that gate can no longer fail anything**, and two documents said
  otherwise. Hardened 11:42:09Z (172.1), demoted to advisory 12:26:17Z (169.4),
  44 minutes apart by consecutive wakes, neither naming the other. Documents
  corrected; the force left advisory, as a recorded refusal.

- **175.4 — LEFT OPEN, OWNER CALL.** `LOOPS.md` Step 0c's own reopen condition
  fired on this wake's collision: the loser's rebase resolved with **no conflict
  at all**, which its "safe by construction" argument says cannot happen.
  `loop-log.md` was not in the loser's diff (recording happens after the commit,
  once per wake) and `ROADMAP.md` merged cleanly (different slices, disjoint
  hunks). The false half is corrected in `LOOPS.md` in place; the *decision* —
  keep accepting collisions, or not — is the owner's.

**Re-run, do not quote** — every rate above is a snapshot and the entries carry
their commands.

## Counters after this wake

Run `python3 scripts/loops/dispatch_status.py` and read it **immediately after
`record_iteration.py`**, per 166.5's lesson — that comparison has found two of
the parser's five blindings and nothing else ever has.

Read at Step 0b, before any commit, against tip `5f21113`: **Standardize 3/4 ok,
Objective 3/3 OVERDUE [169, 170, 172]**, parser at 1,047 against a raw
`grep -c "^- "` of 1,047. After the mid-wake rebase onto the other dispatcher's
four commits, and before this wake's own row: **Standardize 0/4 ok, Objective
1/3 ok [170]** — the other grill discharged rule 3 at 13:36Z. Parser 1,052
against a raw 1,052.
Read again immediately after `record_iteration.py`: **Standardize 0/4 ok,
Objective 0/3 ok**, parser at **1,056 against a raw 1,056**.

**NEXT WAKE: rule 3 was discharged twice over**, so expect rule 4 → Continue.
Re-read `dispatch_status.py` at Step 0b rather than trusting this line.

**When rule 4 is next reached, re-derive its oldest dispatchable item from
`ROADMAP.md`'s `N. [ ]` checkboxes** — 9 open, and 170.3 closed while this wake
ran, so the dispatchable list is 171.1, 171.2, 171.3, then 173.1/173.2. **175.4
is owner-blocked, not dispatchable.** Do not carry this forward.
112.3/112.4 and the `AT runtime evidence` item are older but blocked on the owner
or on hardware. **173.1/173.2 came from the local wake that was live during this
one** — 173.2 is explicitly *owner to pick* between two candidates, and 173.1
changes a demo's rendering, so it wants a browser and is a poor cloud pick.

**171.1-171.3 need no browser and are dispatchable in a cloud wake**: they are
scoring/rubric decisions, and 171.3 asks whether layout is scorable at all before
scoring it.
