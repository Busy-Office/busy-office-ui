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
Slice 179**). Working tree clean at hand-off; the wake's commits went out as one
push.

No collision. `git branch --show-current` answered EMPTY at Step 0 (detached
container, ENVIRONMENT.md trap 1), fixed with `git checkout -B main origin/main`
**before the first commit**; `origin/main` arrived as a forced update
(`17b3ba6...52a50b5`). The mandated pre-commit `git fetch origin main` found it
unmoved at `52a50b58`, confirmed against `git ls-remote --heads origin`, which is
the authority.

**Reconcile this file against `ROADMAP.md` before trusting its open set** — it
goes stale between wakes. Trust the `N. [ ]` checkboxes, not this section.

## Rule 3 fired this wake, and nothing is armed now

Dispatcher, in the order `LOOPS.md` states them: rule 1 clear (no open P0 —
`grep -niE '\bp0\b' ROADMAP.md` returns only closed slice headings and prose;
GitHub intake **0 open issues**, asked via the API, not assumed); rule 2 read
`Standardize 0 / 4 ok`; **rule 3 fired** at `Objective 4 / 3 OVERDUE
[173, 176, 177, 178]`.

Rules 4-8 were not reached. The six open items are unchanged and all six are
owner-blocked — `112.3`, `112.4`, `173.2`, `175.4`, `176.3`, and `15.12` (AT
runtime evidence, owner hardware). Nothing this wake changed that set; Slice 179
opened no new item.

## What landed this wake (2026-08-28, cloud, rule 3 → Slice 179)

Report: `.roundtable/grill-objective-173-176-177-178-2026-08-28.md`.
**Two findings, one shape: an instrument that was checked on the arm that has
never failed, and a trend read off two figures that cannot disagree.**

- **179.1 — `report_loop_prose.py` reconciled in ONE direction.** It asked, of
  every listed path, *is it on disk?* — a listed file that vanishes, which has
  happened **zero** times. The failure that has happened **twice** is the
  reverse: a durable loop file is created, `LOOPS.md` starts telling every wake
  to read it, and `FILES` is not updated (167.2 caught by hand; 169.3 not, and
  178.1 found it a day later). 178.1's `ENVIRONMENTT.md` red-proof exercises the
  arm that never fires. Base rate measured before shipping: **9 of 15** parsed
  commits red, one episode nine commits wide, opening at `f52f2597` and closing
  at `e409a0fe`. The discriminating red-proof is that the OLD script **passes**
  the same injection (exit 0, silent) where the new one exits 1 naming the file.
  Retagged `@heuristic` with a 7-case `--self-test`, itself red-proved by
  stubbing the classifier.
- **179.2 — Slice 177's "both readings agree" is a ratio and its denominator.**
  Rate × length = regrowth identically, so "per-commit rate rising" and "cycle
  length halving" cannot disagree. The unreported third column **falls**:
  regrowth per cycle **4,262 → 3,367 → 2,364**, peak walked **9,824 → 4,461 →
  3,872**. Rule 4's cost is the peak, so on that number the sweep **is**
  converging. What stands: the per-commit rise is real, 177's figures reproduce,
  and its one forward prediction held (4th sweep at 35 commits vs 67 and 141).
- **179.3 — three re-derived claims, all held**: `css-repeats` 74/237/225/8 on
  every group size; `check:wrong-choice` 37/1/3; `check:slice-refs`' sufficiency
  argument (153 stubs vs 153 distinct archive numbers, set-equal both ways).

**⚠ Two of this wake's own instruments were wrong first, as the base rate
predicts.** A stub detector read 154 stubs and flagged Slice 177 as archived,
because it matched the pointer string anywhere in a body and 177.1's text
*quotes* that string — an assertion tripping on prose about itself. And an
outcome parser scanning in reverse for a vocabulary word picked one out of a
legacy row's prose (57 `triaged` vs the positional parser's 56). Neither reached
a published number; both died to a second instrument. **Re-run, do not quote** —
every figure here is a snapshot and the commands are all in ROADMAP 179.

## ⚠ THIS WAS A CLOUD WAKE — WHAT WAS NOT LOOKED AT

No Podman, no `localhost:8081`, no screenshots at 1440px/390px in light and dark.

**Nothing in this wake renders, so nothing visual went unverified.**
`git diff --stat` names one Python script under `scripts/loops/`, `LOOPS.md`,
`ROADMAP.md` and `.roundtable/` — no `.css`, no `.astro`, nothing under
`packages/core/src`. That is a stronger statement than last wake's, which had one
docs page it could not look at, and it is checkable from the diff.

Gates run, all green: core `build` + `test` (146), `docs:build`, `check:repo`,
`check:claims` (141 behaviours), `check:layout` (127 pages), `test:axe`
(127 × 2 widths).

**The carried-forward visual items have now waited SIX wakes.** None is
dispatchable here; all need a local wake with a browser:

- `DsaScore.astro` and `concepts/which-pattern.astro` each gained
  `<span class="bo-badge">generated</span>` inside an existing `<h2>`.
  `DsaScore` renders on **39** pages, so if the badge wraps badly it wraps in 39
  places. First local wake: glance at one component page's "Design-system
  alignment" heading at 390px — make it `/components/scan`, which also settles
  the next item.

  **⚠ Do NOT "correct" that 39 to 40 from `check:dsa-scores`.** The gate reports
  *"40 requested by a page"*, which counts component ENTRIES, not pages:
  `state-patterns.astro` renders `<DsaScore` twice. 39 pages request 40 entries.
  A `grep -rlE "<DsaScore|DsaScore "` also reads 40, and that second alternative
  matches a *comment* in `concepts/which-pattern.astro:16` — an assertion
  tripping on prose about itself. Count `<DsaScore` files, or count built pages
  carrying "Design-system alignment": both read **39**.
- `/components/scan`'s DSA table at 390px — new in 176.1, never seen.
- The `#markers` table on `/components/data-table` at 390px, both themes.
- `/concepts/scale`'s first decision table — 178.3 changed one `<td>`'s text and
  could not look at it.

**Traps exercised for real this wake:** 1 (detached HEAD — `git branch
--show-current` EMPTY, caught before the first commit), 1b, 1c, 2 (unshallowed:
`--is-shallow-repository` read `true`, now 1,554 commits — load-bearing, since
179.2 is entirely a history measurement), 3. Not exercised: 4, 5, 6, 7.

## Direction — the owner's pick, and whether THIS wake advanced it

**Standing section, added by 168.1 (2026-08-28). Answer all four every wake,
from the sources named — never by copying the answers above you.**

- **Direction:** (a) adoption/DX — finish it by publishing
  `@busy-office/create-ui`. Source: the `DECISION (owner, 2026-08-28)` block in
  Slice 164.3, which lives in **`ROADMAP-archive.md`**, not `ROADMAP.md` — 164
  was swept by 177.1. Read it there; this line is a pointer, and a pointer that
  disagrees with its source loses to the source.
- **Remaining step, and who it waits on:** `npm publish -w
  @busy-office/create-ui` — **owner-only**, by CLAUDE.md's standing policy
  ("Publishing remains owner-triggered"). Asked the registry this wake, which is
  the authority: **still E404**.
- **Did this wake advance it?** **No.** The remaining step is owner-only, and no
  cloud wake can run it. This wake ran rule 3 → Objective on Slice 179.
- **Work rows since the direction was decided that did not advance it:** derive
  it, do not increment — a copied number is 169.1's exact failure mode. This
  wake: **38** non-Meta work rows since `fb15cdc`, of which the needle matches
  **2**; reading them, only **164.3** advances the direction and **168.1** merely
  narrates it. So **37 of 38** did not. *(Measured at `74d8c2b8`, before this
  wake's own log rows were committed — re-running it after this commit reads one
  higher. The point of the derivation is that it is re-run, not that the number
  matches the line above it: last wake's honest read was 36 of 37, and guessing
  "+1" here would have produced 39, which is wrong.)*

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

**Prediction written down first, then checked, which is the point of the
exercise.** Before recording: `Standardize 0/4 ok`, `Objective 4/3 OVERDUE
[173, 176, 177, 178]`, parser 1,076 against a raw `grep -c "^- "` of 1,076. One
Objective row plus one `--also-refused` row should read **1,078**; rule 3 should
RESET to `0/3`; and rule 2 should stay `0/4`, because an Objective row is not a
Continue round.

After recording: **`Standardize 0/4 ok`, `Objective 0/3 ok`**, parser **1,078**
against a raw `grep -c "^- "` of **1,078**. **Prediction confirmed on all four
numbers.**

## What the next wake should expect

**No counter is armed** — rule 2 at 0/4, rule 3 at 0/3, both discharged. So the
next wake falls to **rule 4**, and rule 4 still has nothing to give: all six open
items are the owner-blocked set above.

That routes the wake to **rule 5** (no metric with two consecutive readings; the
`rf-essentials` budget is 36.4 kB against a 40 kB gate) and then **rule 6 →
Polish**, which is where the last clear-backlog wake landed (176.1). Run
`polish_requeue.py --apply` first, per rule 6's own text. Read §3b's guidance on
what a round on a `content: 3` surface is for — it reconciles the published
artefact against the ledger, and **a round that finds nothing is a no-op recorded
in one line, not a manufactured fix**.

**Do not re-raise Slice 179's refusal as a new finding.** A gate for
`check:selftests`' blind spot over `scripts/loops/*.py` was refused, measured:
2 of 9 scripts carry a tag, both are honest, and zero defects sit behind the gap,
so a gate would be ceremony on a predicate nothing has broken.
