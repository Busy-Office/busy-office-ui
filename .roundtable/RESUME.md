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

Last updated 2026-08-28 (cloud wake, scheduled routine — **rule 6 → Polish,
round 2 on `component/badge`, NO-OP**). Working tree clean at hand-off; the
wake's one commit was pushed. No collision: `git branch --show-current` answered
EMPTY at Step 0 (detached container, ENVIRONMENT.md trap 1), fixed with
`git checkout -B main origin/main` **before the first commit**, and the mandated
pre-commit `git fetch origin main` found `origin/main` unmoved at `03d2dfb6` —
confirmed against `git ls-remote --heads origin`, which is the authority.

**Reconcile this file against `ROADMAP.md` before trusting its open set** — it
goes stale between wakes. Trust the `N. [ ]` checkboxes, not this section.

## ⚠ RULE 4 FOUND NOTHING — the first time since 176.2

The previous handover expected rule 2 or rule 3 to fire. **Neither did**, and
rule 4 found nothing either. Read each open item's *Accept* rather than its
framing — that is the lesson 176.2 taught and it still holds; it simply came
back negative this time. All six open items:

| item | its Accept needs | dispatchable in a loop? |
|---|---|---|
| `15.12` | a human listening to NVDA/VoiceOver | no — owner hardware |
| `112.3` | 5–8 owner-authored briefs + sealed picks | no |
| `112.4` | 112.3's verdict | no |
| `173.2` | owner picks (a) row-level error row or (b) float-on-focus | no |
| `175.4` | a recorded decision on the collision scheme | no — OWNER CALL |
| `176.3` | a recorded owner decision; says *do not decide it in a loop* | no |

**175.4 is the one worth re-examining next wake**, and this wake deliberately
did not take it: its arm (a) merely restates an argument `LOOPS.md` already
annotates as false, which looks loop-satisfiable — but picking (a) over (b) *is*
the concurrency decision, and that has been the owner's in every slice.

## What landed this wake (2026-08-28, cloud, rule 6 → Polish on badge)

Dispatcher, in the order `LOOPS.md` states them: rule 1 clear (no open P0 —
`grep -niE '\bp0\b' ROADMAP.md` returns only closed slice headings; GitHub
intake **0 open issues**, asked via the API, not assumed); rule 2
`Standardize 3/4 ok`; rule 3 `Objective 2/3 ok [173, 176]`; rule 4 nothing (table
above); **rule 5 nothing — and the reason is not "no regression"**: the tracked
metrics have no two consecutive *recent* readings at all, the last `bundle-gz-kb`
being 2026-08-17. Rule 6 fired.

- **Round 2 on `component/badge` — NO-OP, recorded as §3b requires.** Ten
  surfaces re-queued, every one `content: 3` at `1/3`, so §3b's "lowest score,
  then fewest rounds" tie-break has no discriminator. Picked `badge` on the only
  one that exists: it carries the rubric's **sole line-number citation**, the
  most staleness-prone kind, and its source had moved.
- **All four reconciliation arms clean.** (1) clause present on 10 of 10 —
  redundant, the gate ratchets. (2) score entry rendered per page — gated by
  assertion 7 since 176.1. (3) line-number cites are **1 of 40 components**;
  `badge.css:42` still reads `measured 373px wide against a 390px`, bare numbers
  inside a comment, exactly as cited. (4) `content` cites quoting a clause
  verbatim: **18 of 40, and 18 of 18 still present**.
- **Arm 4 is UN-GATED and was deliberately left so.** `check:wrong-choice`
  requires only that *a* clause exists, so a reword would leave the rubric
  quoting wording the page no longer carries. Not gated because roadmap 101.3
  forbids Polish adding gates, and **18/18 is a base rate to re-measure before
  anyone decides it earns one** (94.11's lesson).
- **Two instrument defects caught before either became a finding.** A
  single-line `<strong>Not …</strong>` grep reported `icon` as clauseless — the
  clause wraps across lines, so the regex was a position filter. And a
  slug-guess reported 3 mismatches that were `alert`→`alerts` and
  `skeleton`/`state`→`state-patterns`; the second run reads `api.pageSlug` off
  the generated `api.json`.
- **No fix manufactured.** §3b and the previous handover both say a
  reconciliation that finds nothing is a one-line no-op, and it was.

**Re-run, do not quote** — every figure here is a snapshot; the commands are in
`.roundtable/polish-state.md`'s round-2 section.

## ⚠ THIS WAS A CLOUD WAKE — WHAT WAS NOT LOOKED AT

No Podman, no `localhost:8081`, no screenshots at 1440px/390px in light and dark.

**Nothing in this wake's commit renders.** `git diff --stat` names one file,
`.roundtable/polish-state.md`, plus the recording commit — no file under
`packages/core/src` or `apps/docs/src`. That is a stronger statement than a
screenshot. `check:layout` (127 pages) and `test:axe` (127 × 2 widths) swept
everything anyway and were green. **No visual debt was added; nothing visual was
looked at.**

**The carried-forward visual items have now waited THREE wakes.** Neither is
dispatchable here; both need a local wake with a browser:

- `DsaScore.astro` and `concepts/which-pattern.astro` each gained
  `<span class="bo-badge">generated</span>` inside an existing `<h2>`.
  `DsaScore` renders on **39** pages, so if the badge wraps badly it wraps in 39
  places. First local wake: glance at one component page's "Design-system
  alignment" heading at 390px — make it `/components/scan`.

  **⚠ Do NOT "correct" that 39 to 40 from `check:dsa-scores` — this wake did,
  and was wrong.** The gate reports *"40 requested by a page"*, which counts
  component ENTRIES, not pages: `state-patterns.astro` renders `<DsaScore` twice
  (`skeleton` at :91 and `state` at :183). 39 pages request 40 entries. A
  `grep -rlE "<DsaScore|DsaScore "` also reads 40, and that second alternative
  is the same trap one level down — it matches a *comment* in
  `concepts/which-pattern.astro:16`, an assertion tripping on prose about
  itself. Count `<DsaScore` files, or count built pages carrying
  "Design-system alignment": both read **39**, and the two sets are identical
  (`comm` finds no member on either side alone).
- The `#markers` table on `/components/data-table` at 390px, both themes.

**Traps exercised for real this wake:** 1 (detached HEAD — `git branch
--show-current` EMPTY, caught before the first commit), 1c, 2 (unshallowed:
`--is-shallow-repository` read `true`, now 1,545 commits), 3, 5
(`polish_requeue.py --check` needs the core build first — built before touching
it). Not exercised: 1b, 4, 6, 7.

**One quirk worth knowing, NOT a new trap:** `git rev-parse --short origin/main
HEAD` exited `fatal: Needed a single revision` while each ref resolved fine
alone and `ls-remote` agreed. Resolve them one at a time before concluding
anything about a collision.

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
  cloud wake can run it. This wake ran rule 6 → Polish on `badge`.
- **Work rows since the direction was decided that did not advance it:** derive
  it, do not increment — a copied number is 169.1's exact failure mode. Run the
  command below unshallowed, print the matched rows and read them; only **164.3**
  advances the direction, while **168.1** merely narrates it.

  **⚠ The `grep create-ui` needle over-counts.** Read the matched rows; do not
  `-c` them:

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

## Counters after this wake

Run `python3 scripts/loops/dispatch_status.py` and read it **immediately after
`record_iteration.py`**, per 166.5's lesson — that comparison has found two of
the parser's five blindings and nothing else ever has.

**The prediction was written down first and then checked, which is the point of
the exercise.** Before recording: `Standardize 3/4 ok, Objective 2/3 ok
[173, 176]`, parser 1,067 against a raw `grep -c "^- "` of 1,067. Neither
counter *should* move on a `Polish` row — rule 2 counts Continue rounds, rule 3
counts slices closed by Continue or Standardize (161.4), and Polish is neither.

After recording: **Standardize 3/4 ok, Objective 2/3 ok [173, 176]**, parser
**1,070** against a raw 1,070. Both counters held and the row count rose by
exactly 3 — one iteration row plus two `--also-refused` rows. Prediction
confirmed on all three numbers.

**So rule 2 is still one Continue round from firing and rule 3 still one slice
from firing — and rule 4 has nothing to give either of them.** That is the
shape to expect next wake: with all six open items owner-blocked, a wake
reaching rule 6 again is the likely path.

**If the next wake does reach rule 6:** `polish_requeue.py --check` now reports
**9**, not 10 — `badge` was stamped at `1f69e677` this wake and left the queue,
verified by re-running `--check` rather than by reading the ledger. Pick from
the nine; the tie is still unbroken, so say what discriminator you used.
`LOOPS.md` §3b says what such a round is for, and **a no-op recorded in one line
is a satisfying outcome**. Do not manufacture a fix, and do not re-raise 176.2
or 176.3.
