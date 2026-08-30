# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and two advisory checks run from `record_iteration.py` — the charter
> check and `check:resume-slice-ids`. Both REPORT on stderr; neither fails a
> build (roadmap 175.3).

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

---

## In flight: nothing

Last updated 2026-08-30 (**cloud** wake — rule 2 → **Standardize**, the dispatch
the previous hand-off predicted). Working tree clean at hand-off; one push.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md                # 4 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs       # names the closed ids
```

`check:resume-slice-ids` will report `214.1` as a closed id named here — a
**historical reference** to this wake's own work, not a claim it is open. The
only ids named here that genuinely ARE open are `211.1`, `112.3`, `112.4`.

**No collision on this wake.** `origin/main` was at `dd76ee8` at Step 0, still
`dd76ee8` at the mandated re-fetch before the first commit, and still `dd76ee8`
at the second commit.

**Trap 1 fired for real again, eighth wake running.** Container started detached
(`git branch --show-current` empty) with `origin/main` arriving as a forced
update (`+ 17b3ba6...dd76ee8`). Recovered at Step 0 with
`git checkout -B main origin/main`, before any commit. The clone was
**unshallowed** (1,700 commits) because lane 4's finding is a history
measurement and `report_loop_prose.py` refuses to report on a shallow clone.

## What landed this wake

**Slice 214 — the Standardize sweep ran 4 of 4 lanes.** Said as `n of 4`
because that is what 208 asked for: 194, 197, 202 and 206 each ran three.

- **Lane 1** `scan:dead-style` — 0 dead of **1,433** live inline declarations.
- **Lane 2** `report:css-repeats` — **8** repeated bodies, `LOOPS.md`'s table
  exactly, **zero delta**. 237→242 rules and 225→230 distinct bodies produced no
  new repeat; the joined-control `x4` group is still **two** components, so its
  reopen trigger (a THIRD) is unmet.
- **Lane 3** `report:prose` — **0 unverdicted pages** of the 14 flagged (9 over
  corpus, 12 over a family median). The one a naive check misses is
  `/concepts/scale/`: flagged on the FAMILY axis only, absent from 158.1's
  twelve, and verdicted by **178.3**.
- **Lane 4** `report_loop_prose.py` — **the finding.**

**`214.1` — the sixth archive sweep, one day after the fifth.** The live file
was **50.8% closed history** (7 slices, 1,568 body lines of 3,085). Moved 213,
212, 210, 209, 208, 201, 200. Conservation reconciles exactly on both sides:
`ROADMAP.md` 3,197 → 1,650 (−1,547 = 1,568 body − 21 stubs) and
`ROADMAP-archive.md` 25,633 → 27,208 (+1,575 = 1,568 body + 7 headings).
`git status` **M / M, never A** — the case-collision guard that once cost 7,307
lines.

**The result worth carrying: `check:slice-refs` did NOT move, and that is
correct rather than a missing signal.** 427 citations / 233 cited / 196 slice
numbers / 2 known-dangling, identical before and after. The gate resolves
against `live + archived` as ONE corpus and excludes `ROADMAP*` from citation
extraction, so a sweep moves text *within* what it reads. 177 saw +1s only
because it filed a new slice in the same commit; here those same +1s appeared in
the **preceding** commit, and were reconciled there — both are Slice 214's own
heading, because the gate's "citations checked" tally counts one uniqueness
check per heading.

**Two instrument defects caught before use, per CLAUDE.md's base rate.** The
span-classifier's first run reconciled to 3,086 against a 3,085-line file
(off-by-one on the trailing newline), and classified **Slice 210 as doctrine**
because it carries no `N. [x]` checkbox at all — a narrative slice recording a
refusal. The second under-reported closed history by 101 lines and would have
left a closed slice out of scope.

**One refusal recorded:** sweeping Slice 214 itself. It is now closed and
resident at 182 lines and is next round's only target; 177.1 and 208.1 left
theirs the same way.

**NOT VERIFIED and named as such:** no Podman, no `localhost:8081`, **no
screenshots at 1440px or 390px in either theme**. Nothing this wake claims rests
on a rendered image — the change is markdown-only in two files no page renders,
and every figure is a line count, a byte comparison or a gate's own output.

Green in this container: core build, `npm run test` **152/152** (27 files),
`lint:css`, `docs:build` rc=0, `check:repo`, `check:claims` 158 live + 3 NOT
VERIFIED (ENVIRONMENT §6b — a container property, not a regression),
`check:formatting`, `check:layout` 127 pages, `test:axe` 127 pages × 2 widths
zero violations, `check:slice-refs`.

## Dispatcher state at hand-off

Read **after** recording, which is the comparison `LOOPS.md` says has caught two
of that counter's five historical failures — and it changed the answer again:

```
python3 scripts/loops/dispatch_status.py
```

At hand-off: `Standardize 0 / 4` (reset by this wake's row), **`Objective 3 / 3`
OVERDUE `[211, 213, 214]`**, `Optimize` **STALE**. So the **next wake dispatches
rule 3, Objective — not rule 4.** Slice 214 is what armed it: rule 3 counts
slices closed by Continue **and Standardize** (161.4). Log reconciles: parser
1198 against a raw `grep -c "^- "` of 1198.

**Rule 5 still reads STALE.** The metric recorded this wake
(`roadmap-closed-history-pct`) is a name sampled once, which can never be "two
consecutive runs". Per rule 5's own text, say it could not be evaluated rather
than reporting it clear. A second sample of that name on any later wake makes it
comparable for the first time.

If a later wake reaches rule 4, every remaining item is blocked; the KIND, per
rule 4's own instruction:

| item | what | kind of blocked |
|---|---|---|
| `112.3` | pattern-fit pilot (oldest open) | owner-blocked (briefs) |
| `112.4` | Screen Contract layer | owner-blocked (on 112.3) |
| `211.1` | vendor htmx into `examples/po-app`? | owner-blocked — a product call about what the example teaches |
| AT runtime evidence | combobox behaviour on real AT | owner-blocked (owner hardware) |

## Direction

**A measured correction the owner may want, and it is not an item.** 179.2
corrected 177's "the sweep is not converging" by observing that regrowth-per-
cycle and the peak a wake walks were both falling monotonically. Re-measured
this wake over all **799** `ROADMAP.md`-touching commits, both terms reversed on
the very next cycle: regrowth **4,262 → 3,367 → 2,364 → 4,394** and peak walked
**9,824 → 4,461 → 3,872 → 6,424**. The open cycle ran at **98.0 lines/commit**,
the highest rate in the record — over **8 commits only**, so that rate is
reported with its n and nothing is concluded from it alone. On the closed cycles
the conclusion is safe: 179.2's monotone claim described three cycles and does
not survive the fourth. Full table and commands in ROADMAP Slice 214.

What this does NOT decide is 177's own observation, still unacted: **61% of one
sweep's moved lines were Objective-grill slices that ALSO have a full report in
`.roundtable/`**. Whether a grill's roadmap slice should be a pointer rather than
a second copy is a direction call about how the loop records its own work, and
this loop does not take those. With rule 3 now OVERDUE and the next wake
dispatching a grill, it is about to become load-bearing again.

**`211.1` unchanged and still the owner's call** — the previous hand-off's
framing stands: the example runs correctly offline the moment htmx is served
locally, and the trade is that vendoring stops it demonstrating the CDN wiring
`/getting-started/htmx` documents, against a maintenance cost that has now paid
for two investigations.

**Standing three unchanged** (112.3, 112.4, AT runtime).
