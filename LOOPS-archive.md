# LOOPS archive — incident narratives, moved verbatim

Moved from `LOOPS.md` by roadmap item 167.2 (2026-08-28). Same doctrine as
`ROADMAP-archive.md`: still markdown, still reviewed, still diffed — this is
a split, not a database.

**What belongs here.** History a wake needs when it TOUCHES a mechanism, not
when it READS the rule. `LOOPS.md` keeps every rule's decision content — the
threshold, why it sits where it does, and the standing lesson — readable
without following a link. What moves is the incident narrative behind it.

**What does NOT belong here.** A lesson that changes what the next wake
does. `LOOPS.md`'s own note on rule 3 says why: a pointer is read less than
a paragraph, so the behaviour-changing sentence stays inline and only the
archaeology moves.

---

## Dispatcher rule 3 — the Objective counter's five blind spots

Cited from `LOOPS.md` rule 3. Five recurrences of one shape: a parser that
silently matched nothing while printing a confident number.

   **THE COUNTER WAS BLIND FOR FIVE DAYS, and this is the third recurrence.**
   `dispatch_status.py` parsed slice numbers with `^(\d{2})\.` — exactly two
   digits. The day slice numbers passed 99 (2026-08-21) it read "14" out of
   "145.3", wanted a dot, found "5", and matched nothing. Objective then
   reported **0 slices while 70 Continue rounds and ~17 slices went past it**,
   flagged "ok" the whole time. Found 2026-08-26, not by the rule failing but by
   a human noticing the number looked wrong.

   Two fixes, and the second is the important one. The regex now takes any slice
   number. And a **zero is now treated as a defect**: if Continue rounds have
   happened since the last Objective and not one of them names a slice, that is
   a parse failure and the script exits rather than printing "ok". This file has
   now recorded the same shape of bug three times about Objective specifically,
   which is enough to stop trusting careful wording and make the silence
   impossible instead.

   **And the bigger half was not the loop filter at all — it was a FOURTH
   instance of the regex going quietly blind.** The log uses THREE conventions
   — `164.1 …`, `Slice 84: …`, and a bare top-level `166 — …` / `119: …` — and
   at this point the counter could see only the first:

   ```
   # 996 rows: 302 bare · 141 prose · 553 naming no slice
   # distinct slices seen — bare 99 · prose 60 · union 144, of 146 in ROADMAP.md
   python3 scripts/loops/dispatch_status.py --self-test
   ```

   Replayed over the whole log, the count crosses 3 **18** times as the rule
   stood, **22** with the prose form alone, **23** with Standardize as well — so
   the format bug was four times the size of the question the item asked. Of the
   45 Objective rounds that actually ran, the number where the counter was
   already past 3 goes **6 → 15**: the rule was firing late more often than
   anyone knew. It is not trigger-happy either — 23 crossings against 45 real
   Objective rounds still signals about half as often as the loop ran, which is
   the direction this rule worries about. `slice_of` now ships `--self-test`,
   red-proved both ways (disable the prose branch → 3 cases fail; restore the
   two-digit regex → 3 different cases fail).

   **A FIFTH instance, found the next wake (roadmap 166.5).** The third
   convention above — a bare top-level number, `166 — …` or `119: …` — was
   still invisible, and what exposed it was the Standardize wake's own row:
   `dispatch_status.py` read `Objective 1 / 3 [161]` immediately after
   recording an iteration that named Slice 166. **The number disagreed with
   what had just been written**, which is the only thing that ever catches
   this. 21 rows and 6 distinct slices were being missed; rows naming a slice
   went 444 → 465, distinct slices 144 → 150, and the live counter moved to
   `2 / 3 [161, 166]`.

   **The widening's first draft invented slices**, which is the part to carry
   forward. A loose `^(\d+)\s*[—–:-]` reads **`4-tick sweep: …`** and
   **`4-seat adversarial grill …`** as slice 4 — 18 such rows exist, all of
   them Standardize and Objective rows, so it would have made this counter
   fire EARLY. A parser change that reports more is not self-evidently a fix.
   The shipped rule lets a colon sit flush and requires a dash to be
   surrounded by whitespace; `--self-test` now carries a case for each
   convention and for both traps, and fails when the fix is reverted (2 cases)
   and when the separator is loosened (2 different cases).

   **The 61-vs-23 is settled, and the figures above are a SNAPSHOT.** 166.5
   refused to quote its replay harness's 61 against this section's 23, on the
   grounds that 23 was "published, red-proved" — which `--self-test` is not: it
   proves `slice_of`'s classification, not the crossing replay, and no command
   was ever recorded for 18/22/23. A third, independent replay (Objective
   grill, 2026-08-28) reproduces all five published figures exactly at the 996
   rows they were taken on — 18 · 22 · 23 · 23, and 6 → 15 — so **the harness
   was wrong and 166.5's verdict holds**. It also shows the cost of the missing
   command: ten rows later the `+ Standardize` figure is **24**. Re-run, do not
   quote; the command is in
   `.roundtable/grill-objective-161-162-166-2026-08-28.md`.

## Rule 4 — the archive-sweep cadence (moved 2026-08-29, roadmap 191.3)

Moved out of `LOOPS.md` rule 4 by the test 167.2 used: does it change what a
wake DOES, or only explain how the rule got here? These explain. The
instruction they support — read `ROADMAP.md`, and if the rule is walking
thousands of lines, run the sweep — stayed behind as a paragraph.

**It is a recurring sweep. Each commit writes MORE, and each cycle regrows
   LESS — both are true, and the second is the one that says what a wake pays.**
   Measured across all 725 commits that have touched `ROADMAP.md`, by the
   line-count drop rather than by grepping subject lines (that grep finds only 2
   of the 3 sweeps it should). Four sweeps have now happened, so three cycles
   are closed:

| cycle | trough | peak | regrowth | commits | per commit |
   |---|---|---|---|---|---|
   | after 110.4 (08-22)   | 5,562 | 9,824 | 4,262 | 141 | +30.2 |
   | after tidy-44 (08-25) | 1,094 | 4,461 | 3,367 |  67 | +50.3 |
   | after 165's 20 (08-28)| 1,508 | 3,872 | 2,364 |  35 | +67.5 |

**The two figures this paragraph used to quote are a ratio and its
   denominator, not two agreeing readings** (roadmap 179.2). Rate × length =
   regrowth exactly, so "per-commit rate rising" and "cycle length halving"
   cannot disagree by construction — the rate rises *because* the length falls
   faster than the total does. The quantity neither of them showed is the third
   column, and it moves the other way: **regrowth per cycle 4,262 → 3,367 →
   2,364, and the peak a wake actually walks 9,824 → 4,461 → 3,872**, both
   falling monotonically. Rule 4's cost is the peak, so on the number that
   matters here the sweep IS converging.

Cycle length is also partly endogenous — a cycle ends when a wake *notices*,
   and the trigger has fallen with it (swept at 9,824, then 4,461, then 3,872),
   so "the gap is halving" measures how soon wakes look as much as how fast the
   file grows. The old paragraph's one prediction held: the fourth sweep came
   **35 commits** after the third, against 67 and 141.

Re-run rather than trusting the table — these are snapshots, and saying so is
   the point. Earlier figures read 140/66/33 and +30.4/+51.0/+67.9; the small
   differences are the cycle-boundary convention plus cycle 3 having been
   measured mid-flight, at 33 commits and 3,750 lines, before its own sweep
   closed it.

## Step 0c — the collision forensics and the three refused alternatives

Moved from `LOOPS.md` Step 0c by roadmap item **274.2 (2026-09-05)**, on the
same charter as the two sections above: the *decision* (accept collisions), the
*cost*, the executed `git fetch origin main` rule, the conflict-resolution
recipe and the reopen condition all stay inline in `LOOPS.md`. What moves is the
forensics of each collision, the refuted "safe by construction" argument,
and the measurements behind the three refused alternatives — history a wake
needs when it ARGUES about the concurrency decision, never when it dispatches.

**The headings below carried the count "two" until roadmap 339.1 (2026-09-08),
by which time there were four** — and the two that landed in between wrote their
forensics into `LOOPS.md` rather than here, because nothing executes this
charter. Collisions 3 and 4 were moved here by that item; a count in a heading
goes stale on the next incident, so these name the subject instead.

**Collision 5 is the first written up under the charter contemporaneously** —
by the wake that lost it, in the same commit as its `LOOPS.md` line, rather
than reconstructed later by a sweep. That is the charter working as intended
once, not evidence that it now executes itself: nothing enforces it, and the
next incident is written up by whoever notices.

### The collision forensics, and the argument they refuted

**⚠ THE "SAFE BY CONSTRUCTION" ARGUMENT BELOW IS FALSE, AND THE SECOND
COLLISION IS WHAT SHOWED IT** (Objective grill of 169/170/172, 2026-08-28;
roadmap 175.4, which leaves the *decision* open). On 2026-08-28 the cloud
routine and a local session both took the same rule-3 dispatch, and **the
loser's rebase resolved with no conflict at all**. Stated exactly, because the
reopen condition below is worded more narrowly than what happened: it anticipated
an overlap on `loop-log.md`'s append point ALONE, and this collision overlapped
on `ROADMAP.md` and `LOOPS.md` and merged clean anyway, with `loop-log.md` not in
the loser's diff at all. The same failure through a wider door. Both guaranteed
collision points failed:

- **`loop-log.md` was not in the loser's diff.** `record_iteration.py` runs
  *after* the commit, once per wake, so for nearly all of a wake the append
  point is untouched. The guarantee holds only for a wake that has already
  recorded when the other pushes, which is the minority of the wake.
- **`ROADMAP.md` was in both diffs and merged cleanly.** Two wakes ticking boxes
  in *different* slices produce disjoint hunks — 170.3 against a heading
  renumber and a new slice ~400 lines away.

What actually caught it was the `git fetch origin main` before the first commit,
mandated below. That is the working half, and it is a process rule with nothing
mechanical behind it: a wake that skips it gets no second signal.

**The window is the tail of a wake, not the wake — and the same wake proved it
both ways.** After the other dispatcher pushed a second time, the loser rebased
again, this time *after* `record_iteration.py` had appended its rows: that rebase
**conflicted**, on `loop-log.md` and `STATUS.md`, exactly as promised. One
variable differs between the two — whether the log row existed yet. So read the
paragraph below as an argument that holds only once a wake has recorded, which
is the last thing it does. Resolving such a conflict: **keep BOTH row sets**,
then regenerate the mirrors (`rebuild_from_log.py`, `generate_status.py`,
`generate_roundtable_index.py`) rather than hand-merging them, and check the
parser against a raw `grep -c "^- "` before committing.

**Why that was believed safe by construction and not by luck.** Every wake ends with
`record_iteration.py`, which appends to `.roundtable/loop-log.md`, and every
dispatched item ticks a box in `ROADMAP.md`. Two concurrent wakes therefore
collide in those two files even when their code changes are disjoint: the
loser's rebase conflicts, so it cannot land silently on top of work it never
read. Measured over the whole cloud era — every commit since the routine's first
one, `c073c36`, 2026-08-27 17:57:55Z — **5 of 5 same-clock commit runs touched
both files**. n is five, and the 100% is expected by construction rather than
surprising: at COMMIT level only **705 of 1,464 (48%)** touch the log, because a
wake commits several times and records once. The claim is about wakes.

**What the concurrency decision was checked against, 2026-08-28 (roadmap
162.1).** Until then `LOOPS.md` said nothing about concurrency at all — re-checked
before deciding, with plain fixed strings: `concurrency`, `concurrent`,
`parallel`, `simultane`, `collision`, `race`, `two wakes` and `two dispatchers`
all returned **0**, and the 12 hits for `lock` were
`block`/`blocked`/`blocks`/`blocking`/`unblock`/`lockfile`. That silence was
correct when loops were session-scoped; promoting the routine to `/schedule` made
a second dispatcher real without a rule changing.

**The stale-snapshot incident in the cost paragraph.** The words "it has happened
once" entered `LOOPS.md` at `15ab347b` on 2026-08-28 and stood **unedited for ten
days**, across a second collision the same section went on to describe
(`git log -S'It has happened once' -- LOOPS.md` returns exactly that one commit).
It is why the inline paragraph now says to count from the list rather than from
prose.

**Collision 3 — the Objective grill of 310/328/329 (2026-09-07).** Both
dispatchers were armed by the same `Objective 3 / 3 OVERDUE`, ran the same grill,
and reached the **same primary finding** (Slice 329's miniature cost resting on
an unstable five-page sample). The loser was stopped by the pre-commit fetch
**before it had made any commit at all** — the mandated mechanism working exactly
as specified. Whether that is a first is NOT claimed: collision 2's record above
credits the same fetch while also describing a rebase, so its loser may well have
committed, and nothing here settles it.

It cost a fraction of a wake rather than the whole one `LOOPS.md` budgets for:
the loser did not re-dispatch to a different loop; it discarded the duplicated
95%, kept the one finding the winner had not made, and amended it into the
winner's slice (roadmap 330). **And its output was not uniformly the worse
one** — the losing wake's census enumerated `readdir(dist/components)` and
swallowed two non-component directories, and it scored a heading count as a
category count. Both are recorded in Slice 330, which is why `LOOPS.md` says to
check a loser's output before discarding it.

**Collision 4 — `297.1` (rule 4) against the Objective grill of 315/332/333
(rule 3), 2026-09-07.** The first collision in which the two dispatchers ran
DIFFERENT rules, so nothing was duplicated and nothing was discarded. What they
collided on is the one shared resource the section had never named: **the slice
NUMBER.** Both wrote `## Slice 335`. The loser's pre-commit fetch saw
`6a009a4b..9c7bac19`, read the winner's commit, renumbered its own slice to 336,
rebased — one conflict, both hunks kept, `ROADMAP.md` ordered 336 / 335 / 334 —
and landed intact. The renumber mechanic that makes this cheap stays inline in
`LOOPS.md`, because it is what a wake in this position DOES.

**Collision 5 — `319.3` (rule 4) against `319.3` (rule 4), 2026-09-08.** Both
dispatchers ran the same rule on the same item, as rule 4's determinism
predicts. What is new is that **both carried it to a verdict and the verdicts
AGREED** — refuse the sweep growth — reached through different instruments, and
both independently wrote `## Slice 340`. Collision 1 duplicated an item;
collision 3 duplicated a wake; this one duplicated a *conclusion*, which is the
first evidence the section holds that the queue's determinism extends past the
pick into the answer.

The loser's pre-commit `git fetch origin main` saw `273c7ae3..1a973395` and
three commits. It had by then re-run the item's two counts, measured five
numeric claims live, timed a 21-page copy of the gate (10.25s → 28.05s,
**+173.7%**), red-proved the gate's blindness by injection with a
discrimination control, written the slice, and run all 17 CI-runnable gates
green. Nothing was committed; the tree was reset and rebased.

**"Check the loser's output before discarding" ran and returned nothing**, and
that is worth recording precisely because the instruction exists on the
strength of collision 3, where it returned something. The winner's analysis
**strictly dominated** on the one axis that mattered: the loser measured the 14
unswept pages and implicitly accepted the 4-page overlap as coverage, while the
winner red-proved that the overlap was never coverage either — a claim on the
*swept* `/components/button` page (*"`--sm` is a 24px control"*) is equally
invisible to the gate, making the real figure **0 of 18, not 4 of 18**. The
loser's one distinctive finding — that two of the 18 are grep artefacts
(`/patterns/inbox`'s "nitrile gloves" is demo data, `/patterns/record-detail`'s
`124px`/`277px` are column widths) — the winner had already recorded, better,
as `340.3`'s 7-of-14 split. Two independent measurements of the same subject
agreeing is a reconciliation the section can bank; it cost a wake to get.

The two cost figures differ and do not conflict: the loser costed 7 → **21**
pages (every unswept vocabulary page, +173.7%), the winner 7 → **14** (only the
claim-making ones, +86%). Different proposals, same refusal.

### The three refused alternatives, with the measurement behind each

**Three options refused, each for a measured reason:**

- **A claim marker committed before working (a lock in git).** To be visible it
  must be *pushed*, and `pages.yml` triggers on every push to `main` with **no
  `paths-ignore`** — so it doubles the Pages deploys per wake and reopens the CDN
  skew window that the "one push per wake" operating rule exists to close
  (owner-reported unstyled first paint, 2026-08-16). It still races: two wakes
  that both read before either pushed both claim, and the loser learns at push
  rejection — the same moment it learns today. And a wake that dies mid-flight
  (`RESUME.md` carries one killed by an unset `CHROME_PATH`) leaves a claim that
  nothing releases, with nobody watching. Trading a self-healing failure for a
  silent one is the wrong direction.
- **Partition by loop type** (cloud takes Continue, local takes grills). It
  partitions the *loops* but not the *counters*: rules 2 and 3 count Continue
  rounds and closed slices out of one shared log, so whichever dispatcher is
  allowed to run Continue would drive a Standardize counter only the other one
  may discharge. Step 0b already records that three rules starved exactly that
  way and each was found by hand; a scheme that makes starvation a design
  property is worse than the collision it prevents.
- **The local session stops dispatching once a routine exists.** Slice 162's own
  postscript is the counter-evidence: the cloud wake found a real defect the
  local session had shipped — 157.2's surviving RTL twin for
  `td[data-tone="success"]` — precisely by re-deriving the same claim
  independently. Redundant coverage is the mechanism that caught it. Rule 1 also
  has to run wherever owner input lands, which is the local session.

## Standardize lane 3 — the first three recurrences of the stale verdict list

Moved from `LOOPS.md` §3 lane 3 by roadmap item **326.1 (2026-09-07)**, on this
file's charter: the operative content — the sixteen-page enumeration, the
maintenance obligation, and the measurement showing the list cannot become a
command — all stay inline. What moves is the archaeology of the first three
recurrences, which a wake needs when it ARGUES about the clause, never when it
runs the lane.

The clause used to name `/base/motion/`, `/concepts/js-behaviors/` and
`/concepts/design-language/` as "the three the family split adds and nobody has
read". **161.1 verdicted all three**, in the very run that wrote that sentence.
166.1 then re-derived them, found the verdicts already existed, and corrected
`.roundtable/RESUME.md` — the file that is rewritten every wake — leaving the
durable playbook saying the wrong thing. Slice 169 re-derived them a third time,
throwaway probe and all, before finding 161.1's entry.

The lesson drawn at the time was CLAUDE.md's criterion rule ("name the property,
never the value it will have") applied one level up, to an instruction rather
than an Accept. **The fourth recurrence, 326.1, is what qualified it**: for this
particular list the property is not checkable, so the names are unavoidable and
the obligation to amend them is the mechanism. The general lesson survives; what
died is the assumption that every stale list has a command behind it.

---

## `ENVIRONMENT.md` §3 — "`astro build` does not clear `dist`" (moved 2026-09-08, roadmap 332.1)

The superseded text, verbatim, as it stood from the 169.3 split (`f52f2597`,
2026-08-28) until `332.1` measured it:

> ## 3. `astro build` does not clear `dist`
>
> `rm -rf apps/docs/dist` first. Skipping it has produced a real failure rather
> than a stale number once — `report:prose` died with `ENOENT … apps/docs/dist`
> before the build — but that is luck, not a guard.

**Why it moved.** `332.1` asked whether every section of `ENVIRONMENT.md` still
describes a trap that can bite today, and named "a section whose trap is fixed in
the toolchain" as the only safe cut. This was the one — **17 of 18 sections were
live, this one was not**. A sentinel file *and* a sentinel directory planted in
`apps/docs/dist` were both removed by a bare `npx astro build` (v5.18.2),
isolated from the 30-step docs chain: no `rm -rf`/`rimraf` exists in any docs
script and `astro.config.mjs` sets no `outDir` or clean option.

**What is not established, deliberately:** whether the claim was true when
written. `apps/docs/package.json` declares `^5.1.0` and that value never moved
across all 40 commits touching the file, so any change came through a floating
minor with no commit to point at; proving the old behaviour would need an old
astro installed, which is not what the Accept asked for.

**It did not become an empty slot.** The live hazard in the same territory is
the inverse — a bare `astro build` silently discards everything the chain adds
after it (`copy-suite`, `highlight-code`, `scope-search-index`, `pagefind`,
`gen-llms`, `stamp-build-id`), leaving 224 files where a full build leaves 529,
with zero pagefind artefacts and no `llms.txt`. A dist-reading gate then measures
an incomplete site that looks built. §3 now describes that instead, which is why
this is an archived *correction* rather than a deletion.
