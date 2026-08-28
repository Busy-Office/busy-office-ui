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
build mode on 177.1, the fourth archive sweep**). Working tree clean at hand-off;
the wake's commits were pushed as one push.

No collision. `git branch --show-current` answered EMPTY at Step 0 (detached
container, ENVIRONMENT.md trap 1), fixed with `git checkout -B main origin/main`
**before the first commit**; the mandated pre-commit `git fetch origin main`
found `origin/main` unmoved at `b17aa797`, confirmed against
`git ls-remote --heads origin`, which is the authority.

**Reconcile this file against `ROADMAP.md` before trusting its open set** — it
goes stale between wakes. Trust the `N. [ ]` checkboxes, not this section.

## Rule 4 fired this wake — on an item the wake itself triaged

The previous handover predicted "a wake reaching rule 6 again is the likely
path". It was wrong, and the reason is worth carrying: **rule 4's own text names
the signal that fired it.** The rule says *"if this rule is walking thousands of
lines again, that is the signal"* — and executing rule 4 meant reading a
**3,750-line** `ROADMAP.md`. Slice 165 is the precedent for treating that as
triageable ("not new input", noticed while executing the dispatcher).

So Step 1 triaged Slice **177**, committed it on its own as Step 1.3 requires,
and Step 2 then dispatched rule 4 onto `177.1` — the only dispatchable open item.

**The five older open items were each re-read at their *Accept*, not their
framing**, and all five are still owner-blocked:

| item | its Accept needs | dispatchable in a loop? |
|---|---|---|
| `15.12` | a human listening to NVDA/VoiceOver | no — owner hardware |
| `112.3` | 5–8 owner-authored briefs + sealed picks | no |
| `112.4` | 112.3's verdict | no |
| `173.2` | owner picks (a) row-level error row or (b) float-on-focus | no |
| `175.4` | a recorded decision on the collision scheme | no — OWNER CALL |
| `176.3` | a recorded owner decision; says *do not decide it in a loop* | no |

**"Oldest still-open" was read as "oldest DISPATCHABLE still-open", and that is
stated rather than smuggled.** Taken literally, rule 4 would point at `15.12`
forever, since it is the oldest open item and can never be closed by a loop. The
previous two handovers reached the same reading and reported "rule 4 found
nothing"; this wake makes the reading explicit so the next one can disagree with
it in writing.

## What landed this wake (2026-08-28, cloud, rule 4 → 177.1)

Dispatcher, in the order `LOOPS.md` states them: rule 1 clear (no open P0 —
`grep -niE '\bp0\b' ROADMAP.md` returns only closed slice headings and prose;
GitHub intake **0 open issues**, asked via the API, not assumed); rule 2
`Standardize 3/4 ok`; rule 3 `Objective 2/3 ok [173, 176]`; **rule 4 fired.**

Rule 5 was evaluated and the reason it does not fire is *not* "no regression":
`.roundtable/loop-metrics.jsonl` holds 99 readings across 29 metric names, and
**no metric has two consecutive recent readings at all** — the newest reading of
any metric is `css-repeat-bodies` on 2026-08-27, and `bundle-gz-kb` has not moved
since 2026-08-17. There is nothing for a two-run trend to be computed over.

- **Nine closed slices moved to `ROADMAP-archive.md`** — 172, 174, 171, 170, 169,
  168, 167, 165, 164 — each replaced by the established one-line pointer.
  `ROADMAP.md` 3,872 → **1,956** at move time; the archive 19,285 → **21,237**.
- **Conservation reconciles exactly on both sides**: live lost 1,916 = 1,943 body
  lines moved − 27 pointer stubs (9 × 3); archive gained 1,952 = 1,943 body + 9
  headings. Not "approximately" — exactly.
- **Refusal guards ran before the move**, not after: OPEN re-derived from the
  `N. [ ]` checkboxes and asserted disjoint from the target set, plus a
  per-target assertion that the section is not already a pointer.
- **The trend is the finding, not the sweep.** Sweeps located by the line-count
  **drop** across all 722 ROADMAP-touching commits, because a subject-line grep
  for `archive sweep` finds only 2 of the 3 real ones (2026-08-25's is titled
  *"tidy: sweep 44 closed slices…"*) — a confident absence, CLAUDE.md's
  position-filter shape. Regrowth per ROADMAP-touching commit **+30.4 → +51.0 →
  +67.9** while cycle length halves **140 → 66 → 33 commits**. Both agree.
- **The detector's 4th hit is a false positive and is labelled one** — a 319-line
  net reduction inside a grill commit clears a `>300` threshold. 3 of 4 real.
- **An archive defect was found by the verification and deliberately NOT fixed.**
  Slices 17, 23 and 24 each appear **twice** in `ROADMAP-archive.md`, the second
  copy being a 3-line pointer stub that points at the file it is already in. No
  history lost. Pre-existing: the archive held 144 slice numbers with those same
  three duplicated *before* this wake, 153 after (+9 = exactly this sweep).
  Left alone on the archive's own authority — its header reads *"Nothing here is
  edited"* — so changing that is a direction call, recorded with its measurement.

**Re-run, do not quote** — every figure here is a snapshot; the commands are all
in ROADMAP 177.

## ⚠ THIS WAS A CLOUD WAKE — WHAT WAS NOT LOOKED AT

No Podman, no `localhost:8081`, no screenshots at 1440px/390px in light and dark.

**Nothing in this wake's commits renders.** `git diff --stat` names `ROADMAP.md`,
`ROADMAP-archive.md`, `.roundtable/RESUME.md` and the recording commit's
generated files — **no file under `packages/core/src` or `apps/docs/src`**. That
is a stronger statement than a screenshot would be. `check:layout` (127 pages)
and `test:axe` (127 × 2 widths) swept everything anyway and were green. **No
visual debt was added; nothing visual was looked at.**

**The carried-forward visual items have now waited FOUR wakes.** Neither is
dispatchable here; both need a local wake with a browser:

- `DsaScore.astro` and `concepts/which-pattern.astro` each gained
  `<span class="bo-badge">generated</span>` inside an existing `<h2>`.
  `DsaScore` renders on **39** pages, so if the badge wraps badly it wraps in 39
  places. First local wake: glance at one component page's "Design-system
  alignment" heading at 390px — make it `/components/scan`.

  **⚠ Do NOT "correct" that 39 to 40 from `check:dsa-scores`.** The gate reports
  *"40 requested by a page"*, which counts component ENTRIES, not pages:
  `state-patterns.astro` renders `<DsaScore` twice (`skeleton` at :91 and
  `state` at :183). 39 pages request 40 entries. A `grep -rlE "<DsaScore|DsaScore "`
  also reads 40, and that second alternative is the same trap one level down — it
  matches a *comment* in `concepts/which-pattern.astro:16`, an assertion tripping
  on prose about itself. Count `<DsaScore` files, or count built pages carrying
  "Design-system alignment": both read **39**.
- The `#markers` table on `/components/data-table` at 390px, both themes.

**Traps exercised for real this wake:** 1 (detached HEAD — `git branch
--show-current` EMPTY, caught before the first commit), 1b, 1c, 2 (unshallowed:
`--is-shallow-repository` read `true`, now 1,547 commits — and this wake's whole
finding is a history measurement, so the unshallow was load-bearing, not
routine), 3. Not exercised: 4, 5, 6, 7.

## Direction — the owner's pick, and whether THIS wake advanced it

**Standing section, added by 168.1 (2026-08-28). Answer all four every wake,
from the sources named — never by copying the answers above you.**

- **Direction:** (a) adoption/DX — finish it by publishing
  `@busy-office/create-ui`. Source: the `DECISION (owner, 2026-08-28)` block in
  Slice 164.3. **⚠ THAT BLOCK MOVED THIS WAKE.** Slice 164 was one of the nine
  swept, so it now lives in **`ROADMAP-archive.md`**, not `ROADMAP.md` — the
  previous handover's "read it there" pointed at the live file and would now
  find nothing. Read it in the archive; this line is a pointer, and a pointer
  that disagrees with its source loses to the source.
- **Remaining step, and who it waits on:** `npm publish -w
  @busy-office/create-ui` — **owner-only**, by CLAUDE.md's standing policy
  ("Publishing remains owner-triggered"). Asked the registry this wake, which is
  the authority: **still E404**.
- **Did this wake advance it?** **No.** The remaining step is owner-only, and no
  cloud wake can run it. This wake ran rule 4 → Continue on 177.1.
- **Work rows since the direction was decided that did not advance it:** derive
  it, do not increment — a copied number is 169.1's exact failure mode. Run the
  command below unshallowed, print the matched rows and read them. This wake:
  **35** non-Meta work rows since `fb15cdc`, of which the needle matches **2**;
  reading them, only **164.3** advances the direction and **168.1** merely
  narrates it. So **34 of 35** did not.

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
exercise.** Before recording: `Standardize 3/4 ok, Objective 2/3 ok [173, 176]`,
parser 1,070 against a raw `grep -c "^- "` of 1,070. A `Continue` row **should**
move rule 2 to `4/4` and arm Standardize; rule 3 counts slices *closed* by
Continue or Standardize (161.4), and Slice 177 closes with this wake, so it
should reach **3/3** and arm Objective too.

*(Filled in below immediately after recording — if either counter disagrees with
that prediction, the parser is the first suspect, not the prediction.)*

## What the next wake should expect

**Rules 2 and 3 are both expected to be armed.** Rule 2 sits above rule 3, so a
Standardize sweep is the likely dispatch, with Objective next. Neither needs a
browser, so both are cloud-dispatchable — the first wake in four where that is
true.

**Rule 4 has nothing to give either of them**: all six open items are the
owner-blocked set in the table above, unchanged by this wake.

**Do not re-raise Slice 177's observations as new findings.** Two were recorded
deliberately without opening items — the archive's three duplicate pointer stubs
(refused on the archive's own "nothing here is edited" charter) and the fact that
61% of the swept lines were Objective-grill slices that each also have a full
report in `.roundtable/` (a direction call about how the loop records its own
work). Both are measured and written down; neither is a loop's to decide.
