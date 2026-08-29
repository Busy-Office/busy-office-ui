# busy-office-ui — Loop System

Autonomous work runs as **loops**: a loop wakes on a cadence, does focused work
(**try → verify → adjust → commit**, repeated until the goal is actually met, not
just once), then re-arms. Each loop type has a different *job*, and each
orchestrates the skills/agents that job needs. This file is the playbook — what
starts a loop, what it runs, and how it hands off.

**The Roadmap loop is the dispatcher.** It runs first, every wake — not as a
separate "host" consulting a static table, but as the actual decision-maker: it
checks for new input, triages it into `ROADMAP.md` if there is any, then decides
which loop's playbook runs the rest of this wake. Any loop can also be invoked on
demand: `/loop <type> …`.

---

## The eight loops

| Loop | Job (one line) | Cadence | Primary skills / agents |
|------|----------------|---------|-------------------------|
| **Roadmap** | Dispatcher: triage new input, decide what runs next | **every wake, first** — 20 min | `Plan`, `domain-modeling` |
| **Continue** | Build the next backlog item — multi-round until its Accept criteria are met | dispatched most wakes | `frontend-design`, `diagnosing-bugs`, `Explore`, `verifier` |
| **Standardize** | DRY + tidy: one pattern, no one-offs — multi-round until a clean pass | dispatched every 4th Continue round, or on drift | `Explore`, `stylelint` gate, `verifier`, `Workflow` fan-out |
| **Polish** | Raise ONE scored surface per round — components 3 rounds, patterns 10 | dispatched when the backlog is clear (owner, 2026-08-23) | blind re-scorer agent, existing rubrics |
| **Research** | Answer what we don't know from trusted sources; queue, never build | dispatched when Polish is exhausted | web research agents, `grilling` |
| **Optimize** | Smaller, faster, lower-specificity | on demand / size-budget breach | build metrics, `Explore` |
| **Explore** | Find & spike a *new* idea (try/error) | on demand (seed list exhausted 2026-08-14) | `frontend-design`, `Plan`, worktree isolation |
| **Objective** | Grill the product *vision* | dispatched at milestones / on demand | `round-table` (rt-*), project panel |

---

## Dispatcher — what the Roadmap loop does every wake

Two steps, in order. **Both run every wake** — this replaces the old model of a
separate "host" consulting a static router table; the Roadmap loop *is* the
router now, and it acts on what it finds instead of just reading it.

### Step 0 — Read the handover

`.roundtable/RESUME.md` **and `.roundtable/ENVIRONMENT.md`**, then `git status`.
The wake prompt says *don't assume prior-turn state*, which only works if state a
wake needs is written down rather than remembered. `RESUME.md` carries the two
things `ROADMAP.md` and the loop log cannot: **work left uncommitted**, and
decisions taken but not yet recorded.

`ENVIRONMENT.md` carries what none of the three can: **the git/build traps and
the toolchain that works** — the detached HEAD, the shallow clone, the
`CHROME_PATH` export, the background task whose empty output file is not a
completion signal. It was split out of `RESUME.md` by 169.3 (2026-08-28) because
the handover is rewritten wholesale every wake — mean 111 lines added+removed
over the last 20 commits — and durable content there had grown to **214 of 372
lines (57%)**, growing 3.2x faster than the per-wake half the file exists for.

**Naming it HERE is what makes the split safe, and it is the reason the refusal
argument lost.** 167.2's "a pointer is read less than a paragraph" is true of a
cross-reference into an archive nobody is told to open; it is not true of a file
Step 0 instructs the wake to read. `check:resume-charter` holds both ends —
`RESUME.md` must keep its pointer, and the moved sections must not grow back
there.

**It reports both ends; it no longer FAILS a build on either** (measured by the
Objective grill of 169/170/172, roadmap 175.3). 169.4 removed it from
`check:repo` — correctly, because `.roundtable/**` is in CI's `paths-ignore` and
a CI gate reading it was the contradiction — and re-homed it in
`record_iteration.py`, where it is deliberately advisory: it prints
`(RESUME.md charter check FAILED — see below)` on stderr and must not fail the
recording. So it runs every wake, and nothing rejects a commit that breaks the
charter. That is a real trade, not an oversight, and it is written here because
two documents claimed the opposite from the moment it became true: the gate was
hardened at **11:42:09Z** (`18791d5`, 172.1) and demoted at **12:26:17Z**
(`33fb89e`, 169.4) — **44 minutes, two consecutive wakes, neither naming the
other.**

A dirty tree is a finding, not a starting point — the previous wake was
interrupted. Finish and land that slice before dispatching anything new, and
empty `RESUME.md` when it lands.

`RESUME.md`'s `## Direction` block is answered at hand-off, not read and left
(168.1). It is the only place the loop can say the owner's chosen direction is
blocked: rule 4 always has an oldest open item and rule 8 halts only when
nothing matches, so a direction nobody can advance stays invisible under
maintenance that looks healthy. **Not a rule here** — deliberately; the item
refused a dispatcher rule, a gate and a ratio alike.

### Step 0b — Read the counters

```
python3 scripts/loops/dispatch_status.py
```

One line per counter-triggered rule: how far it has accumulated toward its
threshold, and how long since it last fired. **Run it before Step 2**, because
the rules it covers are the ones that have starved — a counter below an
always-true condition is dead, and the failure is silent: nothing breaks, a loop
simply never runs. Three rules starved that way and each was found by hand, the
last after ten slices (roadmap 41.1).

**It now covers rule 5 as well, and rule 5 is not a counter** (roadmap 184.1).
It reads a different file — `loop-metrics.jsonl` — so it cannot be overdue, only
STALE: the line reports how many wake-dates of loop activity are newer than the
newest metric pair rule 5 could compare. That is a **fourth** instance of the
same silent failure, found the same way as the others — by hand, after ten days
— and it is the one this instrument was blind to while existing to catch exactly
it. Rule 5's own text carries what to do when the line says STALE.

Not a gate, deliberately. A stale counter is information for whoever is
dispatching; failing a build over it would block the very work the loop exists
to do.

### Step 0c — Two dispatchers share this queue, and collisions are ACCEPTED

Decided 2026-08-28 (roadmap 162.1). Until then this file said nothing about
concurrency at all — re-checked before deciding, with plain fixed strings:
`concurrency`, `concurrent`, `parallel`, `simultane`, `collision`, `race`,
`two wakes` and `two dispatchers` all returned **0**, and the 12 hits for
`lock` were `block`/`blocked`/`blocks`/`blocking`/`unblock`/`lockfile`. That
silence was correct when loops were session-scoped; promoting the routine to
`/schedule` made a second dispatcher real without a rule changing, and rule 4
is deterministic, so two dispatchers reading one `ROADMAP.md` always pick the
same item.

**The decision: accept collisions.** Two dispatchers may take the same item; the
one that pushes second loses its work and re-dispatches. Nothing partitions the
queue and nothing claims an item.

**What it costs, named:** up to one wake's work, discarded. It has happened once
— the cloud routine and the local session both built 157.3 within an hour
(Slice 162). Nothing was corrupted, because `git push` rejected the loser rather
than merging it.

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

**The one thing that changes, and it costs no push:** `git fetch origin main` at
Step 0 **and again immediately before the wake's first commit**. If
`origin/main` has moved since the wake started, the other dispatcher has landed
something — re-read `ROADMAP.md` before continuing, because the item may now be
closed. That moves detection from after the push to before the first commit and
adds no deploy. It is a process rule with nothing mechanical behind it, and that
is stated rather than dressed up: a pre-commit hook would need the network on
every commit and would block a wake that has legitimately already reconciled.

**Which dispatcher wrote a row is recoverable exactly — by `git blame`, not by
the sha the row carries.** This section used to name the sha and call it exact;
164.2 measured the two and it is not. Blame resolves **1014 of 1014** rows (974
`+0800`, 40 `+0000`); the sha resolves **1004**, agreeing on all of them and
disagreeing on none, but missing ten — five 2026-08-13 rows carrying a literal
`-`, and **five whose sha no longer exists**, rebased away. That is what the
LOSING dispatcher does after a collision, so the weaker mechanism is weakest
exactly where the record is for. Blame survives a rebase; the author offset does
not change.

```
git blame --line-porcelain -- .roundtable/loop-log.md | grep -c '^author-tz +0000'
grep -cE '^- .* · [0-9a-f]{7,40}$' .roundtable/loop-log.md   # rows carrying a sha
```

**Keep the `{7,40}`; never `{7}`** — git's abbreviation grows with the repo (7, 8
and 40 all occur), and an anchored seven silently drops the newest rows, which is
how an earlier count here published wrong. Figures are snapshots; re-run them.

**Decision (164.2, 2026-08-28): the log row keeps its naive local timestamp.**
Cost, named: a row is ambiguous by eight hours on its face and **3 of 1013
adjacent pairs read backwards**. It costs no ordering — read each stamp through
its blame offset and the file's own line order is chronological at **1014 of
1014**, so an offset would add an ordering the file already has, and no consumer
parses the stamp as a time. Refused: appending `%z`, which
`dispatch_status.py`'s `ROW` rejects outright (verified by injection, not by
reading); and backfilling the 1014 existing rows, which `record_iteration.py`'s
standing rule forbids. Fixed instead, being smaller than explaining: `STATUS.md`'s
`Generated at:` stamp, the one naive `now()` that is not latent — it ran
**backwards** 13:15 → 05:31 on this wake, and now says UTC. Every command and
figure is in ROADMAP 164.2.

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

**What would reopen this:** a collision that LANDS rather than being rejected —
two wakes whose only overlap was the append point of `loop-log.md` and whose
rebase resolved cleanly. Resolve such a conflict by keeping BOTH rows; never by
dropping one.

### Step 1 — Triage new input

New input = a user-reported issue, a new requirement, direction, or constraint
surfaced since the last wake — in chat, added to `ROADMAP.md`'s backlog by
someone else, or **filed on GitHub**: check
`gh issue list -R Busy-Office/busy-office-ui --state open` every wake (public
intake since 0.1.0 shipped on npm; templates enforce version/browser/theme/
density + minimal repro on bugs, a real ERP scenario on features). An issue
triages like any other input — P0 if it's a bug, ranked into a slice with
Accept criteria otherwise — and gets closed with a comment linking the fixing
commit once its item ships. If there is any:

1. Classify it: a **bug** (something that used to work / should work and
   doesn't) gets flagged **P0** and jumps the queue; a **feature/requirement**
   is first tested against the **Objective** (ROADMAP.md top — simplicity /
   less-for-more / reusability, each with accept/refuse/rethink tests;
   refuse and rethink are valid triage outcomes, recorded with the reason)
   and only then ranked by value × effort into the current slice's queue
   (or a future one if it's not this slice's shape); a **process/direction
   change** (like this file) gets edited directly.
2. Write it into `ROADMAP.md` with *Accept* criteria if it doesn't have any —
   an item without a checkable definition of done can't be dispatched
   correctly in Step 2.
3. Commit the roadmap update itself (small, `Roadmap · plan` in the log) —
   this makes triage visible even on wakes where nothing else ships.

**This step is why new input always reaches the plan before it reaches code** —
a wake that starts with a fresh bug report or a new ask doesn't skip straight to
fixing/building; it's triaged first, so priority (is this a P0? does it bump
something else?) is decided deliberately, not by whichever loop happened to be
running.

### Step 2 — Decide what runs next

Evaluate top-to-bottom against the now-current `ROADMAP.md`; dispatch the first
match to its full playbook below:

1. **Open P0 bug?** → dispatch **Continue**, bug mode.
2. **4+ Continue rounds since the last Standardize, or drift flagged** (by
   Continue itself, or spotted during triage)? → dispatch **Standardize**.

   Above the queued build item deliberately, and for the same reason the
   Objective rule sits above backlog-empty: with this below it, a queued item
   always won, so the counter could only ever fire once the backlog emptied —
   which is precisely when the codebase is largest and accumulated drift is
   worst. It was also the only ordering that contradicted the rest of this
   file: Continue's own **Exit** line says the dispatcher may pick "every 4th
   round — Standardize", and the loop table says Standardize is "dispatched
   every 4th Continue round". Two statements against one; the counter
   preempts (2026-08-18).
3. **THREE OR MORE slices closed since the last Objective**, **or user
   asked**? → dispatch **Objective**.

   Moved above the queued build item on 2026-08-19, for exactly the reason
   Standardize was moved there: a *counter* can never fire while a rule that is
   always true sits above it. There is always a queued build item, so Objective
   could only ever run when the backlog emptied — and the backlog has not
   emptied once. It starved for **ten slices** (27, 30, 32-34, 36-40) before
   this was noticed, which is the third time this file has recorded the same
   shape of bug and the second time it has been recorded about Objective
   specifically.

   **Three, not one.** The old wording — "a slice closed" — would fire almost
   every wake from up here and starve the build instead, which is the same
   mistake pointing the other way. Three is enough material for a grill to find
   a pattern rather than restate one slice, and the last useful grill covered
   two. The number is a judgement and is written down so it can be argued with.

   **Which loops close a slice — decided 2026-08-28 (roadmap 161.4).**
   `Continue` **and `Standardize`**. Excluded: `Roadmap` (a triage row plans a
   slice, it does not close one — Slice 162 is the live illustration, Roadmap-only
   and open), `Explore` (a spike graduates INTO the plan; the build that follows
   is a Continue row), `Objective` (circular — an Objective row resets this
   counter), and `Meta`/`Polish`/`Optimize`, which have never named a slice at
   all. Standardize was added because 12 slices — 47, 49, 50, 55, 60, 63, 65, 69,
   103, 111, 155, 161 — have a Standardize row and **no Continue row**; Slice 49's
   own heading is "Standardize sweep". Explore and Objective were measured before
   being refused rather than waved off, since being obviously-not is how the
   Standardize exclusion survived unexamined: adding both changes the number of
   times the counter reaches 3 over the whole log from **23 to 23**.

   **The `Objective` exclusion does NOT close the circle, and saying it does is
   wrong** (measured 2026-08-28, roadmap 170 finding B). A grill files its items
   **in its own slice number**, and those items are built by `Continue` rows —
   which count. So a grill arms the next grill, one hop removed: **7 of 26**
   rule-3 dispatches would not have crossed without a grill-derived slice, and
   on 2026-08-28 two of the three armed slices were themselves grills (164,
   167), leaving 1 of 3 without them. **Recorded, not fixed** — rule 3 sits
   above rule 4 exactly so it cannot starve, and classifying slices by heading
   inside the dispatcher would be the sixth regex this rule's own history
   refuses (170's first attempt missed the older "from the Objective grill,
   Slices 45-50" convention and reported 4 of 26). The command is in
   `.roundtable/grill-objective-164-167-169-2026-08-28.md` §B; re-run it, the
   figures are snapshots.

   The five recurrence narratives — what each parser did, the replay figures,
   the counts that were snapshots — are in **`LOOPS-archive.md`**. They are
   history a wake needs when it TOUCHES the parser, not when it reads the
   counter, and `dispatch_status.py`'s own header already carries most of it.
   The lesson below is deliberately NOT a pointer: a pointer is read less than
   a paragraph, and this is the part that changes behaviour.

   So: five recurrences, all the same shape. **The lesson is no longer "widen
   the regex" — it is that this counter is only ever caught by a number
   disagreeing with something a human just wrote down.** Read its output right
   after recording an iteration, every wake; that comparison has now found two
   of the five.

   **That sentence was tested and held.** A FOURTH log convention exists — 30
   Continue/Standardize rows name their slice mid-text, after an em-dash, and
   all three patterns miss it. It is refused, measured: the convention died on
   2026-08-21, and parsing it moves the whole-log crossing count by **one, ever**.
   The counts, the commands and the reopen condition are in `dispatch_status.py`
   beside `SLICE_TOP`, so a sixth discovery is not re-reported as a new bug.



4. **Build item queued anywhere in the backlog** — the OLDEST still-open item
   across all slices, not the newest? → dispatch **Continue**, build mode.

   **When you report this rule as finding nothing, say WHICH KIND of blocked**
   (roadmap 186.2, and the reason it lives here rather than in `RESUME.md`).
   "All open items are blocked" is three different situations and only one of
   them is the owner's:

   - **owner-blocked** — needs a decision, a brief, or a publish only the owner
     can trigger. Nothing any wake can do.
   - **browser-blocked** — needs Podman and **screenshots** at 1440 and 390 in
     both themes: evidence that is a *rendered image* a human compares.
     **A cloud wake cannot take it; a LOCAL wake can.**

     **Not "needs a real browser" — a cloud wake has one** (measured the same
     day this bullet landed, roadmap 190 §D2). It drives the same headless
     Chrome `check:claims`, `check:layout` and `test:axe` use, via
     `browser-harness.mjs` + `serve-dist.mjs`, so element heights, overflow past
     a container, computed styles, accessibility-tree readings and a red-proof
     by injection are all takeable there. `ENVIRONMENT.md` carries the two
     lists. **Name which one a declined item needs**, or this distinction
     mis-sorts work the same way the undifferentiated "blocked" did.
   - **agent-blocked** — needs a second agent, which §3b step 4's blind
     re-score requires and some sessions are not permitted to spawn.

   **This distinction was written into `RESUME.md` and did not survive the next
   rewrite** — grep found it gone within a day, which is 169.3's lesson landing
   again: that file is rewritten wholesale every wake and is where corrections
   go to die. So it is stated here, in the durable playbook, next to the rule it
   governs.

   It is not pedantry: four consecutive wakes reported rule 4 as "all open items
   owner-blocked" while **173.2 was merely browser-blocked**, and the first
   local wake to look at it built and landed it the same day. A cloud wake
   reporting "nothing dispatchable" was telling the truth about itself and a
   falsehood about the backlog.

   **Read `ROADMAP.md` only.** A closed slice leaves a one-line pointer here and
   its text moves to `ROADMAP-archive.md`. **If this rule is walking thousands of
   lines, that is the signal** — triage the sweep and run it; Slices 165 and 177
   are the precedent for doing exactly that from inside a dispatch.

   **This paragraph used to pin the sweep history in numbers, and by 2026-08-28
   every one of them was stale** — it named two sweeps when there had been four,
   and "148 citations" when `check:slice-refs` was reporting 355. That is this
   file's own lesson from the Standardize playbook, arriving in the rule that
   dispatches most wakes: **a snapshot in a playbook goes stale silently and is
   read as current; the property does not.** So the numbers now live where they
   are re-measured — ROADMAP 177 carries the scope command and the trend, and
   `check:slice-refs` reports its own citation count on every run.

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

   The archive is for looking a reason UP (`check:slice-refs` keeps its
   citations resolvable — it reports the count itself, so read it there); a
   dispatch decision never comes from it, because nothing in it is open.

   **Oldest, not "current in-progress slice," as of 2026-08-19.** The old
   wording never defined "current," and in practice it meant "whichever
   slice a triage step just created" — because triage inserts near the top
   of `ROADMAP.md` and every wake reads top-to-bottom, that made the queue a
   LIFO stack. Nine consecutive Continue dispatches (19:10-23:01, 2026-08-19)
   each picked a just-triaged item while five older items — one with a
   self-documented time cost (roadmap 53.2: a free removal window that
   closes at the 0.2.0 publish) — sat untouched despite being open the whole
   time. Found by the Objective grill built to catch exactly this shape of
   bug (roadmap 56-61 grill). `RESUME.md`'s "In flight" section is the one
   legitimate override — a slice genuinely mid-build wins even if it isn't
   oldest — but check whether it is actually current before trusting it; it
   has gone stale before.
5. **A tracked metric regressed on TWO CONSECUTIVE runs** (bundle size, gate
   coverage, a number from `record_metric.py` trending the wrong way), **or a
   size budget breached outright**? → dispatch **Optimize**.

   **The second clause was missing here for six days, and it is the one added to
   revive this rule** (roadmap 184.2). §4 Optimize's Trigger has carried it since
   2026-08-23, added because the trend-only trigger was "effectively dead" —
   Optimize fired 3 times in 740 iterations. Step 2 is the text a dispatcher
   actually evaluates, and it kept only the dead half. Same shape as
   `check:resume-charter` being hardened and demoted 44 minutes apart with
   neither document naming the other: the fix landed in the playbook and never
   reached the rule. **Restated rather than silently patched**, so the next wake
   can see that the rule changed and why.

   **Read `dispatch_status.py`'s rule-5 line before answering this rule at all**
   (roadmap 184.1). It reports how many wake-dates of loop activity are newer
   than the newest metric pair rule 5 could compare. On 2026-08-29 that read
   **10**, and had read stale on every one of the previous ten wake-dates: 96 of
   99 samples predate 2026-08-20, and the 3 recorded since are each a name
   sampled once, which can never be "two consecutive runs". Wakes went on
   answering this rule from 2026-08-18 readings, and one of those answers —
   `ci-wall-time` "flat at 275s" — was published into ROADMAP as current
   evidence. **If the line says STALE, this rule has no input: say it could not
   be evaluated rather than reporting it clear.** A rule answered from a dead
   instrument reports "nothing to do" exactly as convincingly as a healthy one.

   Two, not one, and the wording is deliberate. CI wall time was declared
   regressed on a single 290s reading against a 288s budget, an Optimize item
   was raised, and the next two runs came in at 267s and 265s — the 290 was
   noise on a shared runner. Three ascending samples were also read as a trend
   and were not (282 -> 261 -> 257). A metric that moves on its own between
   identical commits needs more than one point before it can spend a wake
   (2026-08-18).
6. **Any scored surface below its round budget and not marked dry?** →
   dispatch **Polish** (owner decision, 2026-08-23; full playbook below).
   Components get 3 rounds, patterns 10 — as CEILINGS, not quotas. The
   ledger is `.roundtable/polish-state.md`.

   **This predicate is not a queue test, and reading it as one is what made
   176.2 look like a contradiction** (measured 2026-08-28, roadmap 176.2).
   Parsed across **all 11 revisions** of `.roundtable/polish-state.md`,
   `budget_spent = 0` and `marked_dry = 0` in **11 of 11** — every row, every
   revision. So the predicate is true of **19 of 19** non-skipped surfaces and
   always has been. That 100% is structural rather than an instrument bug:
   the dry exit needs **two consecutive** rounds that fail to move a blind
   re-score, and every seeded surface landed its clause in **one** round, so
   nothing ever got a second round to be dry in.

   Two consequences, both measured rather than argued:

   - **Neither `polish_requeue.py` nor §3b's TODO is an input here.** `--apply`
     writes a `RE-QUEUED` marker into the ledger's `status` column; rule 6 reads
     only `rounds` and `dry`. §3b's TODO narrows which surface a round **picks**
     (step 1), not whether rule 6 **fires**. The one round rule 6 has actually
     dispatched — 176.1 on `component/scan` — was authorised by neither: scan is
     absent from `polish_requeue.py --check`'s ten and off
     `check:wrong-choice`'s TODO (which is `{ date }`, and the ledger SKIPS
     `date`). It qualified on `2/3 rounds, dry 0` and nothing else.
   - **What governs the firing rate is rule 4 emptying**, not the queue
     definition. `grep -c ' · Polish · ' .roundtable/loop-log.md` reads **10 of
     1065 rows (0.94%)** over five wake-dates, and ROADMAP records rule 4
     finding nothing dispatchable exactly once.

   **§3b's Exit has never been satisfiable, and the owner CLOSED that as
   no-change (2026-08-29, roadmap 176.3).** "Every surface dry or budget-spent"
   has never been true of anything, so Polish has no exit and rule 7 has never
   been dispatched (**0** `Research` rows). **That is accepted, not a defect** —
   the owner had already chosen to keep the routine running hourly while the
   backlog is owner-blocked, and the halt's real job (telling the owner what is
   blocked) is done by `RESUME.md`'s Direction block instead. **Do not re-raise
   it and do not "fix" rule 6 by narrowing it**: that was proposed and refused,
   because the redundant-looking second rounds are 2-of-3 for finding real
   defects and narrowing the rule would delete the lane that caught them.

   **Run `python3 scripts/loops/polish_requeue.py --apply` BEFORE evaluating
   this rule.** The ledger has always said a surface re-enters "only when its
   SOURCE changes — never on a timer", and until 2026-08-25 nothing executed
   that sentence: it was a rule a human had to notice. It was not noticed.
   `component/sidebar-nav` sat at 1/3 rounds while its docs page changed twice
   in one day and the ledger still read QUEUE DRY — so this rule would have
   reported dry, the loop would have fallen through to Research, and an
   unattended run would have stopped finding work while seven surfaces were
   genuinely eligible. The script compares git blob SHAs, so it is exact rather
   than heuristic, and it honours SKIPPED and dry rows rather than dragging a
   deprecated component back into the queue.

7. **Every surface dry or budget-spent?** → dispatch **Research**: answer
   an open question from trusted sources, grill it, queue it in
   `ROADMAP.md` with Accept criteria. **It never builds** — findings wait
   for the owner.

   **This condition has never been true, so this rule has never fired** —
   `budget_spent = 0` and `marked_dry = 0` in 11 of 11 ledger revisions, and
   `grep -c ' · Research · ' .roundtable/loop-log.md` reads **0** of 1067.
   Six `research-*.md` reports exist, so the work has happened; what has never
   happened is a row carrying this loop's name. **Stated no more strongly than
   that on purpose** — the obvious next claim, "each was recorded under some
   other loop", was tried and the instrument is too weak to support it: grepping
   each report's topic out of its filename finds rows for only **2 of 6**, which
   says the needle misses rows that name a slice instead of a topic, not that
   four reports went unrecorded.

   **Two things were bundled here; only one is closed.** That this rule never
   FIRES is roadmap **176.3**, **closed as no-change by the owner 2026-08-29** —
   accepted, not a defect, and not to be re-raised. That six `research-*.md`
   reports exist while **zero** rows carry this loop's name is a **separate,
   still-unexplained logging gap**, and closing 176.3 does not answer it. Do not
   fix either by rewording this rule.

8. **Nothing above matched** → **say why, ONCE, and stop the loop.**

   This rule exists because of measured behaviour, not theory: on
   2026-08-15 the dispatcher logged **28 idle wakes inside one 12-hour
   window** (03:04→15:49), fifteen of them consecutive at 20-minute
   intervals, each re-deriving "backlog still empty". Eleven items were
   open the whole time — every one owner- or environment-blocked. The
   streak ended only when the owner arrived to publish 0.1.0; the loop had
   no way to restart itself and no way to *conclude*.

   So: a wake that reaches this rule reports the blocking set (what is
   open, who each item waits on) and **stops**, rather than idling. A
   dispatcher that can halt and hand back a reason beats one that idles
   politely forever. Do NOT re-dispatch Explore here — its seed list has
   been exhausted since 2026-08-14 and re-running it is how the idle
   spiral started.

   *(Explore remains available on demand, and as the graduation path for a
   spike the owner asks for.)*

Record the dispatch decision itself as part of the iteration log — the outcome
line already names which loop ran; that's the audit trail for *why*.

---

## Playbooks

### 1. Roadmap (dispatcher) — runs first, every wake
**Trigger:** every wake, always — 20 min, or immediately on new input arriving
out of band (a user message with an issue/requirement mid-cycle doesn't wait for
the next tick if the session is live to receive it).
1. Triage (Step 1 above) — commit if anything changed.
2. Decide (Step 2 above) — dispatch to the matching loop's playbook.
3. Also, independent of new input, ~daily or after an Explore graduation: do a
   fuller reconciliation pass — done vs pending, re-rank by value × effort,
   split oversized items, merge dupes, record real architecture decisions via
   `domain-modeling` (ADR).
**Exit:** a loop has been dispatched, or (fuller pass) the plan reflects reality
and the top item is unambiguous.

### 2. Continue (build or fix) — multi-round until done
**Trigger:** dispatched by Roadmap. **Input:** the P0 bug, or the OLDEST
still-open item anywhere in `ROADMAP.md`'s backlog — unless `RESUME.md`
names a genuinely in-progress slice, verified current, not merely present.
Run **try → verify → adjust** as many rounds as it takes to satisfy the item's
*Accept* criteria — this is not "one attempt, ship whatever happened":
1. Pick the item. If it's a bug → `diagnosing-bugs` (build a red-capable repro
   loop before touching code — see that skill for the full discipline); if
   UI/visual → `frontend-design`.
2. `Explore` (or read directly) to locate the code and precedents.
3. Make a change aimed at the item's *Accept* criteria.
4. **Verify live**: rebuild core + docs container, screenshot at 1440px **and**
   390px, check dark + light. If the round touched docs pages, ALSO run
   `DOCS_BASE=/busy-office-ui npm run build -w docs` — the local container
   serves base-less URLs, so a raw `<a href="/x">` (instead of
   `{base + '/x'}`) passes every local check and still 404s on Pages; only
   the base-path build catches it (learned 2026-08-15: 31 such links, 8
   straight red CI runs). Then rebuild plain before the container check.
   Full production parity (interactive layer under the prefix — boost swaps,
   aria-current sync, search, history): copy the DOCS_BASE dist into
   `<scratch>/base-root/busy-office-ui/` and serve base-root on :8082 with
   the same nginx.conf mount; browse `localhost:8082/busy-office-ui/…`
   (github.io itself is browser-blocked in this session). Audited green
   2026-08-15 post-0.1.1.
   If a round adds a new `build:*` step to `packages/core/package.json`,
   verify it against a TRULY clean `dist/` (`rm -rf packages/core/dist &&
   npm run build -w @busy-office/ui`) before trusting it — a local run
   reusing a stale `dist/` from earlier in the session can mask an
   ordering bug that only CI's clean checkout catches (learned 2026-08-15:
   `build:acr` shipped reading `dist/contrast.json` one step before the
   script that writes it, passed locally on stale artifacts, broke CI and
   the Pages deploy the very next wake).
   A clean local build passing is still not sufficient proof for any gate
   built on a COMPRESSED byte count: `gzipSync()` output can legitimately
   differ by a few bytes across Node/zlib builds (classic zlib vs
   zlib-ng), so a byte-exact `--check` on a "kB gzipped" figure can pass
   on a clean local Node 26 build and fail on CI's Node 22 with the
   IDENTICAL committed source (learned 2026-08-16 — verified against the
   exact pushed tree before concluding this, not assumed). `stamp-
   readme.mjs`'s size stat now compares within a tolerance for this
   reason; any future stat derived from `gzipSync`/`brotliCompress`
   needs the same treatment, not an exact-string gate.
   A fix scoped to a SHARED selector (anything matching more than the one
   page that surfaced the bug — `.docs-content pre.has-copy`, a reset
   rule, a token) can legitimately change rendering on pages the report
   never mentioned, so the reported page passing is NOT the check
   (learned 2026-08-16 — a code-block overflow fix correctly changed 6 of
   8 sampled pages, most only visible at 390px, which a single-viewport
   click-through hadn't surfaced). Run the whole-tree browser gates —
   `check:layout`, `check:scroll`, `test:axe` — which sweep every page at
   1440px and 390px, then spot-check ONE page the report never named.
   Those gates assert *properties* (nothing overflows, every scroll
   region is reachable, no axe violation), not pixels: a change that is
   merely different rather than broken will pass, so name the pages you
   expect to move and look at one. Pixel comparison was deliberately
   dropped (134.3, owner call 2026-08-24): 33 MB of baselines that could
   not run in CI, in exchange for catching only what those three gates
   miss. If a specific change needs a pixel check, write a throwaway one
   for it and delete it after.
5. **Round check** — does it satisfy *Accept* AND pass the standing gates
   (contrast, named `@container`, links, behaviors, stylelint, tests)? If
   not, adjust and go back to step 3. If a round reveals the item was
   mis-scoped (too big, wrong approach), that's a finding for Roadmap, not a
   reason to ship something that doesn't meet Accept.
6. Once a round passes: `verifier` on the staged diff → commit → tick the
   roadmap box → **record the iteration** (see below).
**Exit:** Accept criteria met and committed. Hands back to the dispatcher for
the next wake (which may pick the next item, or — every 4th round — Standardize).

**Recording an iteration (every loop, after the commit):**
```
python3 scripts/loops/record_iteration.py \
  --loop <Loop> --mode <mode> --item "<what>" --outcome <outcome>
  # outcome: landed | released | logged | triaged | refused | reverted
  # "shipped" is rejected — it hid that nothing had reached npm (41.2)
  # a refusal decided INSIDE this item, whatever the item's own outcome:
  #   --also-refused "<what was refused, one line>"   (repeatable; 51.1/62.1)
```
This appends the human line to `.roundtable/loop-log.md` **and** inserts the row
into the derived `.roundtable/loops.db`. Capture any measured number too, e.g.
`python3 scripts/loops/record_metric.py --name bundle-gz-kb --value 7.0 --unit kB`.
The markdown/jsonl files are the source of truth; rebuild the DB any time with
`python3 scripts/loops/rebuild_from_log.py`. Query it for prioritization
(`sqlite3 .roundtable/loops.db "select item,count(*) from iterations group by item"`).

### 3. Standardize (DRY, tidy) — multi-round until clean
**Trigger:** dispatched every 4th Continue round, or when a one-off/duplication
is spotted (by Continue, by triage, or by a prior Standardize pass that ran out
of time). Run **try → verify → adjust** rounds until a pass finds nothing left
to consolidate — don't stop after fixing the first thing found if the sweep
surfaced more:
1. Scan for divergence: inline styles that should be tokens/classes, duplicated
   token values or logic (e.g. the same lookup table hand-copied into multiple
   scripts), component pages that break the one-page skeleton, repeated CSS.
   **Run `npm run scan:dead-style -w docs`** — inline declarations that change
   no computed value at all. It is not a CI gate on purpose (the walk costs ~2
   min, and folding it into `check:layout` would mean mutating a trusted gate's
   page to catch cosmetic drift), so THIS step is what keeps it from rotting:
   the dispatcher reaches Standardize every 4th Continue round, which is the
   mechanism, not a human remembering. First sweep: 29 dead, 25 of them
   `style="margin: 0"` restating the reset's own `* { margin: 0 }` on the pages
   readers copy from.
   **Before consolidating inline styles, re-read DESIGN.md line 15** — a
   missing spacing utility is NOT the finding, because this framework refuses a
   utility system by design. The finding is either a dead declaration or a
   component that should own the value.
   **Also run `npm run report:css-repeats -w @busy-office/ui`** — rule bodies in
   the shipped CSS that appear more than once, keyed by their sorted declaration
   list. The standing verdicts are in "Settled: the visually-hidden recipe"
   below, with the table of all eight; **the finding is the DELTA**, a new group
   or an existing one that grew, never the count. Same reason as the other two
   sweeps: deliberately not a gate (every current repeat is correct, so a gate
   would fail the build on eight right answers), which makes this step the only
   thing keeping it from rotting.
   **Also run `npm run report:prose -w docs`** and record a verdict for any page
   the report flags — over 2x the CORPUS median, or over 2x its FAMILY median —
   **that carries no verdict yet in `ROADMAP.md` or `ROADMAP-archive.md`**. Same
   reason as `scan:dead-style`: it is deliberately not a gate, so this step is
   the only thing that keeps it from rotting.

   **The instruction names the PROPERTY, not a list of page names, and that is
   a correction this file paid for three times.** It used to name
   `/base/motion/`, `/concepts/js-behaviors/` and `/concepts/design-language/`
   as "the three the family split adds and nobody has read". **161.1 verdicted
   all three**, in the very run that wrote that sentence. 166.1 then re-derived
   them, found the verdicts already existed, and corrected `.roundtable/RESUME.md`
   — the file that is rewritten every wake — leaving the durable playbook
   saying the wrong thing. Slice 169 re-derived them a third time, throwaway
   probe and all, before finding 161.1's entry. A snapshot of names in a
   playbook goes stale silently and is read as current; the property does not.
   This is CLAUDE.md's own criterion rule ("name the property, never the value
   it will have") applied one level up, to an instruction rather than an Accept.

   Verdicts to date: **158.1** the twelve over the corpus median, **161.1** the
   three the family split added. As of Slice 169 every flagged page in both
   lists carries one, so a clean round here is the expected result and is worth
   one line, not a re-derivation.
   **Why a cadence and not a budget** (158.2's decision, and it is measured, not
   asserted): across nine daily builds 2026-08-20→28, on the **89 pages present
   throughout**, prose went **51,051 → 77,080 words (+51%)** and **not one page
   ended shorter than it started** — 71 grew, 18 flat, 0 shrank, and it holds at
   every threshold (65 grew by more than 50 words, minimum delta exactly 0).
   Pages *do* shrink between individual days — 12 did in one window — so the
   comparator can report negative; the net simply never is. A per-page
   justification test cannot produce a shrink, because it is applied while the
   words are being written, when the answer is always yes. Reading the outliers
   on a cadence is the only step that ever asks the other question. ROADMAP
   158.2 carries the commands.
   **And run `python3 scripts/loops/report_loop_prose.py`** — the same question
   asked of the files the LOOP reads, which `report:prose` does not cover. Read
   the `accumulate` column, not the delta: 158.2's cadence rests on docs pages
   never shrinking, and two of these five shrink by design, so a rising count
   means nothing for them. 167.1 carries a verdict per file; the finding is a
   file changing accumulate class, or `LOOPS.md` still at 0 down after 167.2.
2. For a wide sweep, `Workflow` fan-out — one agent per component, report drift.
3. Consolidate to the shared pattern; never widen public API to do it.
4. **Round check** — gates must stay green (stylelint naming is the enforcer);
   `verifier`; commit. Re-scan: did fixing this reveal another instance of the
   same drift, or a different drift? If yes, another round; if the scan comes
   back clean, done.
**Exit:** a clean pass finds nothing to consolidate. Hands back to the
dispatcher.

### 3b. Polish (raise a scored surface) — multi-round, budgeted
**Trigger:** dispatcher rule 6 — the backlog is clear of queued build items.
Added on the owner's decision, 2026-08-23, to close the idle-wake failure
mode rule 8 documents. **Input:** the worst-scoring surface with rounds
remaining, per `.roundtable/polish-state.md`.

**One round = try → verify → adjust, and it must be falsifiable:**

0. **Re-queue first**: `python3 scripts/loops/polish_requeue.py --apply`.
   Nothing else in the loop notices that a surface's source moved.
1. **Pick** the surface with the LOWEST score and rounds remaining. Ties
   break by fewest rounds used. **One round per surface per pass** — never
   the same surface twice running while another sits at the same score.
2. **Try**: fix exactly ONE scored weakness. Not a general tidy — a named
   dimension on a named surface, so the re-score has something to measure.
3. **Verify**: rebuild, all docs gates, plus the browser sweeps CI runs
   that the local build does NOT (`test:axe`, `check:layout`) — the
   2026-08-23 lesson that a CI-only gate is not known to work.
4. **Blind re-score** — *the load-bearing step*. A SECOND agent re-scores
   the surface against the rubric, told the surface and the dimension but
   **never what changed or what the old score was**. The agent that made
   the change may not score it: it would be marking its own homework, and
   this file's own doctrine already says an instrument's first output is
   not evidence. Without this the dry-round exit can never fire and the
   3/10 budgets become a guarantee of self-approved work.
5. **Did the score move?**
   - **Yes** → commit, `round++`, reset that surface's dry counter.
   - **No** → `dry++`. **Two dry rounds in a row mark the surface DRY and
     forfeit its remaining budget.**

   Either way, close the round with
   `python3 scripts/loops/polish_requeue.py --stamp <surface>` — that records
   the source state the score was earned against. Skip it and the surface
   re-queues itself forever on the change the round just made. This is what reconciles the budgets
     with this file's standing "don't manufacture busywork" rule: a
     surface that cannot produce a measurable gain twice running is
     finished, whatever its budget says.

**What "scored" means — existing instruments only, no new ones:**
- **Components** → the queue is `check:wrong-choice`'s `TODO` set, and **only**
  that. The DSA rubric is a per-component EVIDENCE RECORD, not a ranking.
  - **No DSA dimension can rank, measured 2026-08-28 (roadmap 171.1)** — not
    the three this file used to name as Polish's drivers:

    ```
    node -e "const d=require('./apps/docs/src/data/dsa-scores.json').components;
    const a={}; for (const c of Object.values(d))
      for (const [k,v] of Object.entries(c.dimensions||{})) (a[k]=a[k]||{})[v.score]=(a[k][v.score]||0)+1;
    console.log(a)"
    # typography 1 · colour 1 · spacing 1 · interaction 2 · content 2 · fit 2
    #   distinct values, out of 39 components
    ```

    This file used to say "Polish drives on `content`, `fit` and `interaction`
    only". Those have **2, 2 and 2** distinct values — `content` is 3 on 38
    components and 2 on one; `fit` is 3 on 38 and 0 on one. Picking "the
    lowest-scoring surface" from that is picking one page and then guessing.
    The sentence promised a ranking the data cannot support.
  - **The rubric still earns its place, and is deliberately NOT retired.**
    `typography`/`colour`/`spacing` read 3 everywhere because gates already
    enforce them (94.7/94.9; `hierarchy` was retired for exactly this), and
    `spacing`'s own definition says it is "a DEBT MARKER, not a quality signal".
    Uniformity is the gates HOLDING. Applying the ERP-suite score's accept test
    — 3+ distinct values or the dimension is dropped — would retire **all six**,
    deleting 39 components' worth of cited judgement to fix a ranking nobody
    should have been asking it for. Refused: the mismatch was the rule, not the
    rubric.
  - The queue is executable and it RATCHETS: a page that gains a wrong-choice
    clause MUST leave `TODO` or the gate fails. **Down to 1 outstanding**
    (`npm run check:wrong-choice -w docs`, 2026-08-28 — it read 19 when this
    section was written), so this lane is nearly dry; re-run it rather than
    trusting either number.
  - **What a round on a `content: 3` surface is supposed to do** — the question
    roadmap 176.2 was closed on, answered here because a wake reaching rule 6
    today will land on one: `polish_requeue.py` re-queues on source change, and
    every surface it re-queues scores `content: 3` and is off the TODO.

    It has **no scored weakness to fix** — 171.1 measured that no DSA dimension
    can rank one — so do not go looking for a dimension to move. What it can do
    is **reconcile the surface's published artefact against the ledger's own
    record of it**: does `dsa-scores.json` carry the entry this ledger says was
    scored, does the built page render it, do the citations still hold against
    the shipped CSS? That is what 176.1 did, and it found `/components/scan`
    publishing *"Not yet scored"* for five days — a defect no scored dimension
    could see.

    **Stated as n = 1, because that is the whole evidence base.** If the
    reconciliation finds nothing, **the round is a no-op**: record it in one line
    as a no-op and stop. Manufacturing a fix on a surface with no measured
    weakness is the busywork this file's own operating rule refuses, and 176.1's
    wake refused exactly that on all ten re-queued surfaces.
- **Patterns** → the pattern-sweep bar in `.roundtable/pattern-sweep-*`.

**The rubric's own stop rule (roadmap 101.3) binds this loop.** Polish is
"maintenance of the existing ratchet only — fixing entries the rubric
already flags". It may NOT add dimensions, definitions or gates. That rule
fires only when a live grill finds a surface scoring 3 across the board
with a genuine user-facing defect the six dimensions structurally cannot
see. **A dead trigger on another loop is not that trigger** (see Optimize).

**Exit:** every surface dry or budget-spent → hands to Research (rule 7).
**⚠ This has never been true. CLOSED as no-change by the owner, 2026-08-29 —
roadmap 176.3; accepted, not a defect. Do not re-raise.** Measured
across all 11 revisions of `.roundtable/polish-state.md`: `budget_spent = 0`
and `marked_dry = 0` in **11 of 11**, so both halves of the disjunction have
always been false and Polish has no exit. The log agrees — **0** `Research`
rows in 1065, so rule 7 has never been dispatched and rule 8, which sits below
it, is equally unreachable. Structural, not a bug: a surface that lands its fix
in one round never gets the second round the dry exit needs.
**Re-entry:** a surface's budget resets when its SOURCE changes — its CSS,
its docs page, or its rubric definition. Never on a timer: work re-enters
the queue because the thing actually changed.

### 3c. Research (find out what we don't know) — queue, never build
**Trigger:** dispatcher rule 7 — Polish exhausted. **Input:** an open
question in `ROADMAP.md`, or a scored weakness with no known fix.

1. **Check the ledger** (`.roundtable/research-*.md`) — do not re-research
   a question answered recently. Re-open only if the answer has gone stale.
2. **Fan out to TRUSTED sources, 2+ INDEPENDENT per claim, URL-cited**:
   W3C/WAI-ARIA APG, WHATWG, MDN, Baymard, Nielsen Norman, GOV.UK Design
   System, the major design systems (Carbon, Fluent, Material, Fiori,
   Atlassian), and the ERP products themselves. Blogs, vendor marketing and
   AI answers are LEADS TO VERIFY, never sources to cite.
3. **Grill** the finding with the `grilling` skill's design-tree rounds.
4. **Evidence gate** (same bar as Objective): ≥2 independent sources →
   `Evidence`; otherwise `Hypothesis`. Every claim carries its
   counter-evidence.
5. **Write** `.roundtable/research-<topic>-<date>.md` and queue the finding
   in `ROADMAP.md` **with Accept criteria**.
6. **STOP.** Research changes *direction*, and direction is the owner's in
   every slice so far. It may land docs-only corrections; anything touching
   the shipped package waits for sign-off.

**Exit:** one question answered and queued, or the ledger says everything
current is answered — then rule 8 (report and stop).

### 4. Optimize
**Trigger:** on demand, or when a tracked metric regresses on two
consecutive runs, **or when a size budget is breached outright** — the
absolute-threshold trigger added 2026-08-23 because the trend-only one was
effectively dead: `Optimize` fired **3 times in 740 recorded iterations
(0.4%)**, all inside one 48-hour window, because "regressed twice running"
almost never becomes true on a growing library.

Deliberately NOT folded into Polish as a seventh "cost" dimension, though
that was the first proposal: the DSA rubric's stop rule (roadmap 101.3)
forbids new dimensions unless a live grill finds a defect the existing six
structurally cannot see, and a dead trigger on this loop is not that
finding. Fixing the trigger is the smaller, more honest change.
1. Measure first: gzip/min bundle size, selector count, specificity hot-spots,
   unused CSS, docs page weight.
2. Pick the biggest win; trim (merge selectors, drop dead rules, lighten the demo).
3. Re-measure — keep only if it moved the number without breaking a gate. Commit with
   before/after in the message.
**Exit:** no win above a set threshold remains.

### 5. Explore (new idea, try & error)
**Trigger:** dispatched when the backlog is empty, or on demand. **Isolated** —
never dirties main.
1. Pull one idea from the *Ideas* list below (or generate one from ERP gaps).
2. Spike it in a **git worktree** (`isolation: worktree`) with `frontend-design`.
3. Evaluate honestly against the brief: does it earn a place? Screenshot it.
4. **Graduate** → hand the result to the Roadmap loop's triage (Step 1) to
   enter the plan; or **discard** → one-line note in the log on *why*, so it
   isn't re-tried blindly.
**Exit:** one idea resolved (kept or killed) per iteration.

### 6. Objective (grill the vision)
**Trigger:** dispatched at a milestone (e.g. pre-1.0), or on demand.
**Heavy — not every wake.**
1. Run `round-table` on the product thesis: *is a CSS-first ERP framework the right
   bet, for whom, versus what?*
2. Evidence gate: a conclusion needs ≥2 independent sources to be `Evidence`, else
   `Hypothesis`; every claim carries counter-evidence.
3. Feed findings back into the Roadmap loop's triage as re-prioritization, not as vibes.
**Exit:** a scored report lands in `.roundtable/`.

---

## Ideas backlog (for Explore)

Seed list — Explore pulls from here or adds to it:
- ~~Keyboard-driven row actions (j/k navigation on dense tables)~~ — spiked
  2026-08-14, mechanics work but a plain `<table>` can't safely take roving
  tabindex without breaking screen-reader table browse mode. Graduated as a
  real milestone (ARIA grid pattern) in ROADMAP.md — don't re-spike the naive
  version; the next attempt starts from `role="grid"`, not a `<table>` hack.
- ~~Skeleton / empty / error states as a first-class component set~~ — shipped
  Slice 6 item 1 (`.bo-skeleton` + `.bo-state`), `/components/state-patterns`.
- ~~A `.bo-composer` (comment + action) for approval threads~~ — shipped
  Slice 6 item 3, lives in `approval-workflow.css` next to `.bo-audit`.
- ~~Inline validation summary that scrolls to the first bad field~~ —
  spiked 2026-08-14 in an isolated worktree (discarded, nothing merged
  directly). Succeeded cleanly: `initValidationSummary()`, zero new CSS
  (the existing `:user-invalid` field styling + `.bo-alert` cover
  everything). Graduated as ROADMAP.md item 19.
- ~~Density-aware icon set sizing~~ — evaluated 2026-08-14, fixed directly
  (small CSS-only change, no worktree needed). Found and fixed one real
  `rem`-vs-`em` mismatch: `.bo-sidebar-nav__icon` stayed a fixed 18px
  across every density tier while its label scaled 13-16px — measured
  live, not assumed. Graduated as ROADMAP.md item 20. Audited the other
  icon-sizing rules in the codebase; none had the same bug.
- ~~RF-scanner / warehouse-scan components~~ — spiked 2026-08-14 in an
  isolated worktree (discarded, nothing merged directly). Scan-input
  mechanics work well and graduated as a real build item (ROADMAP.md Slice
  6 item 9a: `initScanInput()`, zero new CSS). The quantity-stepper piece
  needed nothing — already solved by `.bo-quantity` + `data-density=
  "spacious"` (item 9b). High-contrast turned out to be a pre-existing
  library-wide gap (no `forced-colors` support anywhere), not RF-scanner-
  specific — split into its own item (9c / item 18), don't re-bundle it
  into a future warehouse-screen item.

- ~~SAP Fiori "object page" floorplan~~ — spiked 2026-08-19 in an isolated
  worktree (removed; nothing merged). **Graduated** as ROADMAP Slice 48.2-48.4.
  Composes from shipped primitives with ZERO new CSS; the only new thing is a
  ~20-line scroll-spy behavior. Do NOT re-spike the naive version: two sticky
  regions at `inset-block-start: 0` collide (one wrapper, not two), and
  `IntersectionObserver` + `rootMargin` marks the wrong section at 390px — spy
  by measuring against the bar's own bottom edge. Full report:
  `.roundtable/explore-object-page-2026-08-19.md`.

**Seed list is now exhausted** (2026-08-14) — every idea above has been
spiked/shipped/discarded. Per this playbook's own fallback ("or generate
one from ERP gaps"), the next Explore dispatch generated one from the
Long-term backlog's own "date-field component" note — ~~Date field
(display)~~ spiked, succeeded, graduated as ROADMAP.md Slice 6 item 21.
The deeper prioritization question was answered 2026-08-15 by the
Objective review — run as the project-local design panel
(`.roundtable/grill-slice7-scoping-2026-08-15.md`), NOT `/round-table`
(wrong instrument: that's market/feasibility, not design scoping). Its
output became Slice 9, fully shipped the same day. The next Explore
fallback source, with the Ideas list AND the Long-term backlog now both
exhausted, is new user input or the dogfood loop (extend
`examples/po-app` and feel where it fights — this produced the grouping,
progress, and freeze-graduation rounds).

- ~~value-help in po-app's mass-change flow~~ — spiked 2026-08-20 in an
  isolated worktree (removed; nothing merged directly, the finished file
  copied over instead). **Graduated.** Nested-dialog composition (a picker
  opened from inside an already-open dialog) works with ZERO framework
  changes — native `<dialog>` stacks correctly and each dialog's own focus
  trap stays scoped to itself. Found and fixed a real, pre-existing bug
  along the way: mass-change's 422 response put its OOB alert block before
  the main swap content, which made `#po-rows` vanish from the DOM
  entirely — confirmed not caused by the spike by reproducing on an
  unmodified checkout FIRST. Full report:
  `.roundtable/explore-value-help-po-app-2026-08-20.md`.

- ~~PO creation (`/pos/new`) in po-app, dogfooding detail-form~~ — spiked
  2026-08-20 in an isolated worktree (removed; finished file copied over).
  **Graduated.** `/pos/new` was a genuine DEAD LINK shipped in the
  reference app — the empty state's own primary action pointed at a route
  that 404'd, unreachable in ordinary use because the empty state itself
  never fires with 30 seeded records. Built the real screen (detail-form's
  shape, scoped to the fields `po-app`'s data model actually has), added a
  persistent create button (the dead link was the ONLY way to reach it
  before), and refactored last wake's cost-centre picker into a shared
  helper two independent forms now both use. Added 3 new checks to
  `check-po-app.mjs` (Slice 26.1's gate) — one of which caught a real bug
  in ITS OWN first version (a row-count assertion that could never detect
  an addition once the list exceeded one page). Full report:
  `.roundtable/explore-po-create-2026-08-20.md`.

- ~~Record editing (field-editor) in po-app~~ — spiked 2026-08-20 in an
  isolated worktree (removed; finished file copied over). **Graduated.**
  po-app had NO way to fix a mistake on a Pending record at all before
  this — only approve/reject/mass-recost existed, and no delete route
  either. field-editor's own shape (one row per field, one Save) applied
  to the PO detail screen's Order fieldset, gated to Pending; the shared
  cost-centre picker reused a third time. Added 3 new checks to
  `check-po-app.mjs` — one caught a real bug in ITS OWN first version
  again: `fetch()`'s default `redirect: 'follow'` silently followed a 302
  and reported the FOLLOWED response's 200, the exact mistake already
  avoided one check earlier in the same file. Full report:
  `.roundtable/explore-po-edit-2026-08-20.md`.

- ~~role-home dogfooded into po-app's Dashboard~~ — spiked 2026-08-22 in
  an isolated worktree (removed; finished file copied over). **Graduated,
  zero framework changes.** `dashScreen()` predated role-home (110.1) —
  same primitives, never its actual anatomy. Two honest adaptations kept:
  "Needs you" links to `/pos?status=Pending` (po-app has no `/inbox`
  route, out of this spike's scope) and "Recent" relabelled "Recently
  added" (no session/view-history, only real insertion order). Found and
  fixed two real, pre-existing bugs along the way, reproduced on an
  unmodified checkout first: `spendScreen()` counted Rejected POs as
  spend, and its budget figures were stale from before a 25-row backfill
  — together pinning every cost centre permanently red, demonstrating
  none of the tone system's three states. Also found an unignored build
  artifact (`busy-office-ui.tgz`), added to `.gitignore`. Full report:
  `.roundtable/explore-role-home-po-app-2026-08-22.md`.

- ~~117.1's `--label-start` modifier, dogfooded into po-app~~ — evaluated
  2026-08-22, **discarded before spiking**: po-app has exactly one
  `.bo-form-section` built from `.bo-form-field`s (`/pos/new`), and it
  already uses `.bo-form-row` — which 117's own ROADMAP entry states is
  not combinable with `--label-start` (the two answer "how do I lay out
  several fields" two different ways). Forcing it in would regress a
  working 3-column form (Vendor/Cost centre/Amount) into a taller,
  sparser single column for three short, unrelated fields that genuinely
  read better side by side. No other po-app form is built from
  `.bo-form-field` at all. Re-open when a genuinely dense, single-column
  detail form exists in the reference app — not before.

- ~~/inbox dogfooded into po-app~~ — spiked 2026-08-22 in an isolated
  worktree (removed; finished files copied over). **Graduated as ROADMAP
  116.2.** Closed the exact gap the role-home spike above named out of
  scope: "Needs you" now links to a real /inbox, not a filtered /pos list.
  Reused po-app's own already-real approve dialog verbatim (extracted to
  `approveDialogHtml(p)`) rather than building a second one. Found a real
  bug on the gate's OWN first run: fixed dialog IDs collided once a second
  routine row existed (an unrelated earlier check pushes PO-88213 under
  the threshold) — fixed with per-PO id suffixes, not by re-running until
  green.

---

## Settled: the 0fr/1fr collapse appears three times, and that is correct

Raised twice as duplication (2026-08-24, 2026-08-25) and refused here so it
stops being re-raised. `display: grid` + `grid-template-rows: 0fr/1fr` +
`overflow: hidden` appears in `motion/motion.css`, `dashboard.css` and
`richtext.css`. It is the same four declarations, and it is **not** removable
duplication, for two reasons that compound:

- **Selector ownership.** `.bo-motion-collapse` is a UTILITY: it works because
  the consumer puts it on their own markup. `.bo-widget__collapse` and
  `.bo-richtext__toolbar-collapse` are component PARTS, styled by the
  component. A component cannot delegate to a class the consumer would have to
  add to markup the component itself defines.
- **The module is opt-in.** `motion.css` is deliberately never imported by
  `index.css`. A component that leaned on it would ship a feature that works
  only for consumers who happened to import an optional stylesheet — which is
  exactly the failure `/base/motion` shipped for its whole life before 137.17.

So the shared thing here is the TECHNIQUE, and plain CSS has no way to share a
technique without also sharing a selector. What IS shared is already shared:
the duration and easing come from the motion tokens, so a change to the feel
lands everywhere at once. Only the four structural declarations repeat, and
each carries a comment pointing at the others.

**What would change this:** a fourth copy, or a divergence between the three
(one gains a fix the others miss). Either is the signal to reopen — not the
count on its own.

## Settled: the visually-hidden recipe also appears three times, same reason

Found by a Standardize sweep (2026-08-27) that keyed every rule in
`packages/core/src/css` by its sorted declaration list. The nine declarations of
the visually-hidden idiom sit in `primitives/visually-hidden.css` (the canonical
`.bo-visually-hidden`), `sidebar-nav.css` and `stepper.css`.

It is the **same shape as the 0fr/1fr case above**, and refused for the same
two reasons: `.bo-visually-hidden` is a UTILITY the consumer puts on their own
markup, while `.bo-sidebar-nav__label` and `.bo-stepper__label` are component
PARTS whose hidden-ness is decided by a **container query**, not by the
consumer. There is no markup a consumer could put the class on. Plain CSS
cannot share a rule body without also sharing a selector.

**What the sweep actually fixed** was the divergence that WAS there — in the
explanation, not the declarations. `sidebar-nav.css` carried five lines saying
why it is spelled out; `stepper.css`, the identical case, carried nothing, so
its copy read as unexplained duplication a future tidy would "fix" into
something that cannot work. All three now carry the reason and point at the
other two.

**No gate.** "A comment explains this literal" is semantic, and roadmap 94.11
paid for that lesson: the shape is checkable, the meaning is not. Every repeat
below is CORRECT, so a gate would fail the build on eight rules that are all
right.

### The count is a command now, and the command disagreed with the paragraph

Standardize, 2026-08-28. This section used to assert *"of 237 rules with 3+
declarations, exactly **three** blocks repeat"*, and then, in the same breath,
that the count was "cheap to re-measure … in one command instead of trusting
this paragraph" — while recording no command. The next sweep re-derived it and
got **eight**, on the identical 237 rules. Roadmap 159's finding exactly: a
measurement without its command gets re-derived, and then two answers exist with
nothing to adjudicate them.

```
npm run report:css-repeats -w @busy-office/ui
  # 74 source files · 237 rules with 3+ declarations · 225 distinct bodies
  # · 8 bodies appearing more than once      (2026-08-28)
```

`report-css-repeats.mjs` is that command. It reconciles with an independent
regex pass on all three totals, and it is red-proved both ways: a novel
duplicated body takes it 8 → 9, and so does making `badge.css`'s print rule
carry `stepper.css`'s `!important`s — which is how its own first-run bug was
caught, since postcss keeps `!important` off `decl.value` and the two rules
merged into a repeat that is not one.

**The five it had not recorded change no verdict.** Every one is the same
ownership argument, which is why the rule below is now stated as a rule rather
than as a list of blessed blocks:

| repeated body | where | why it stays |
|---|---|---|
| `list-style/margin/padding: 0` | `.bo-timeline`, `.bo-sidebar-nav ul`, `.bo-tree`+`ul` | three components each resetting their own list |
| the 9-line visually-hidden idiom | `.bo-visually-hidden`, `.bo-sidebar-nav__label`+`__heading`, `.bo-stepper__label` | the section above |
| header row, 6 declarations | `.bo-widget__header`, `.bo-offcanvas__header` | two headers converging by taste, not one decision stored twice |
| `display:flex / align-items:center / gap:space-1` | `.bo-breadcrumb li`, `.bo-richtext__group` | the cluster idiom on markup the component owns; a consumer cannot class an `<li>` the component generates the rhythm for |
| `flex:1 / min-inline-size:0 / overflow-wrap:anywhere` | `.bo-combobox__option-label`, `.bo-file-list__name` | "a text cell that must shrink and wrap"; both are parts |
| disabled look | `:is(.bo-input, .bo-quantity__input):disabled`, `.bo-richtext--disabled` | sharing would mean `input.css` styling richtext's root |
| `aria-current="page"` link | `.bo-sidebar-nav__link`, `.bo-tree__link` | two nav components, each styling its own link part |
| joined-control radius reset | **x4** — twice each in `money.css`, `quantity.css` | see below |

The last one is the only one worth watching. Four copies is the trigger this
file names for the 0fr/1fr case, and it is met — but it is **two components, not
four**: money and quantity each spell the idiom twice, because the joined child
is either a bare control (`.bo-money > :first-child`; quantity's
`__input:has(+ .bo-quantity__unit-select)`) or a combobox WRAPPER whose real
border is one level down (`> .bo-combobox:first-child > .bo-input`). Same
decision, two child shapes, per component. Reopen if a THIRD component joins the
pair — that is when a shared joined-control part would have somewhere to live
that isn't one component styling another's insides.

**What would change any of this:** a body appearing in a component that is not
already in the table, or an existing group growing. Run the command; the delta
is the finding, never the count on its own.

### Also settled: the BCD feature paths shared by two floor scripts

Raised by the Standardize sweep of 2026-08-28 and refused, recorded here so the
next sweep does not re-raise it. `derive-floor.mjs` (16 features, each with a
`tier` and a whole-stylesheet `test`) and `check-rf-floor.mjs` (6 features, each
with a `kind` and a `pattern`) **share the `path` column for 6 feature ids** —
the browser-compat-data key, which is the fragile part: both scripts' own error
text asks *"has the key moved?"*.

It is refused on the same ground as the regex-escape extraction:
**divergence here is LOUD.** Measured — both scripts throw immediately with the
offending path named when a key is missing, and the six shared paths agree
today. The tables are also not the same table; only one column overlaps, and
each script's other columns exist for different jobs.

**Reopen if** a third consumer of these paths appears, or if the six ever
actually disagree — that is when the shared thing has somewhere to live that is
not one script importing another's internals. Compare them by extracting the
`id:`/`path:` pairs from both files and diffing the shared ids; the sweep that
raised this did exactly that and got "none disagree".

## Operating rules (every loop obeys)

- **Every wake leaves the thing it touched BETTER than the item required**
  (owner, 2026-08-24: *"just take note that build better. where loop will
  also look for the improvement"*). Ticking an Accept criterion is the floor,
  not the wake's output. Before committing, the loop asks the improvement
  question about what it just touched — and it is a *question*, not a licence
  to widen scope:

  - Did this reveal something the item did not name? Log it, and fix it only
    when it is smaller than the explaining.
  - Is the fix in the right layer? Six list screens missing a create action
    was one line missing from a pattern page (Slice 139) — the improvement
    was upstream of every screen that had the symptom.
  - Does the gate that should have caught this exist, and can it fail?
    A fix without one invites the same defect back.
  - Is a NUMBER worth recording? The instrument grill (2026-08-24) only
    produced its finding because seventeen gaps had been logged with what
    triggered them.

  **This does not license scope creep**, which the Objective already refuses.
  An improvement that is bigger than the item becomes a roadmap entry, not an
  extra commit. The rule is: never end a wake having *noticed* nothing.

- **New input always goes through Roadmap triage first** (2026-08-14 redesign) —
  even mid-cycle. A bug report or a new ask doesn't get worked directly by
  whatever loop happens to be running; it's classified and entered into
  `ROADMAP.md` (with Accept criteria) before Step 2 dispatches it.
- **Multi-round, not one-shot** (2026-08-14 redesign) — Continue and Standardize
  keep cycling try → verify → adjust within a wake until their exit condition
  (Accept criteria met / clean pass) is actually true, not just once. A round
  that reveals more work is a reason for another round, not an early exit.
- **Verify before commit** — live in the container, both themes, both breakpoints.
- **A browser gate must be verified against a DOCS_BASE build** (2026-08-16,
  three red CI runs in a row): CI builds with `DOCS_BASE=/busy-office-ui`,
  so a harness that assumes base-less URLs 404s its assets — which broke
  clicks outright and would have let the overflow sweep pass on
  CSS-less pages (fail-open). Run `DOCS_BASE=/busy-office-ui npm run
  build -w docs` and the gate against it before pushing.
- **Watch CI after a push that touches a build gate** (2026-08-16: a
  hardcoded macOS Chrome path in a new gate turned CI red for three
  commits — verified locally, never checked in Actions). `gh run list
  --workflow=ci.yml --limit 1` before ending the wake.
- **Batch pushes: one per wake** (2026-08-16, owner-reported unstyled
  first paint) — every push triggers a Pages deploy, and each deploy
  opens a CDN skew window (max-age=600 on Fastly nodes) where fresh
  HTML can 404 its hashed CSS and cache the 404. Commit per round;
  push once at wake end unless a fix is urgent.
  Routine ticks (2026-08-14 user direction): run a **bind-mounted** nginx serving
  `apps/docs/dist` directly (`podman run -d --name bo-docs-run -p 8081:80 -v
  apps/docs/dist:/usr/share/nginx/html:ro -v apps/docs/nginx.conf:/etc/nginx/
  conf.d/default.conf:ro nginx:alpine`) — `npm run build -w @busy-office/ui &&
  npm run docs:build` on the host, nginx picks it up immediately, no image
  rebuild. Do a full `podman build -f apps/docs/Containerfile` (validates the
  whole build path — clean `npm ci`, the Containerfile itself) only at
  checkpoints: a slice closing, or after touching the Containerfile/deps.
- **Gates are the floor** — a loop that reddens a gate isn't done.
- **Small & general over specific** — new work composes existing primitives.
- **Record every iteration** via `scripts/loops/record_iteration.py` (writes the
  markdown log + the `loops.db` mirror). Files are source of truth; the DB is
  rebuildable telemetry.
- **No longer session-scoped, and that is what made concurrency real** — this
  bullet used to read "these run while this session is open; closing it stops
  them. For durable cloud cadence, promote to `/schedule`." The promotion
  happened (owner call, 2026-08-28), so an hourly cloud routine now dispatches
  whether or not a local session is open, and both read one `ROADMAP.md`.
  **Collisions are accepted — see Step 0c for the decision, its cost, and the
  one fetch that makes the loser find out early.**
- **Recognize steady state; don't manufacture busywork** (2026-08-15) — once
  the Ideas seed list AND the Long-term backlog's directly-actionable items
  are genuinely exhausted (checked, not assumed — re-read `ROADMAP.md` fresh
  every wake per the dispatcher's own instructions), further wakes will
  keep finding smaller and smaller things to justify activity: a stale
  checkbox, an ignored lockfile, a doc-count typo. Fixing a REAL one found
  in passing is legitimate (Roadmap hygiene, a clean-room health check, a
  reconciliation pass are all genuine dispatcher duties, not busywork) —
  but the moment a wake starts *searching* for something to fix rather than
  *noticing* one, that's the signal to stop and say so plainly instead of
  escalating the search. State it in the wake's summary — "no new input,
  same blocked state as last N wakes, here's exactly what's still blocking
  progress and why more loop iterations can't close it" — rather than
  silently keeping busy. This is what happened 2026-08-14→15: after Slice
  6/7's directly-buildable items, the Ideas seed list, and 5 Long-term
  bullets (icon-sizing, RTL, theme presets, the 1.0 checklist, the API
  freeze) were all closed via the Explore fallback, the honest and correct
  move was reporting the backlog as dry and naming `/round-table` as the
  actual unblock — not inventing a 6th, 7th, 8th speculative item.
