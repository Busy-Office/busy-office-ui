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

Last updated 2026-08-31 (**cloud** wake). Working tree clean at hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 5 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
```

**The open set went 6 → 5.** Two of the three dispatchable items remain
(`229.4`, `229.5`); the third (`229.3`) closed this wake as a refusal.

## What landed this wake

**Slice 229.3 — REFUSED**, dispatcher rule 4 (Continue, build mode). Rules 1-3
were answered by measurement; the readings are in "Dispatcher state" below.
The diff is **`ROADMAP.md` alone** — no code changed.

**Rule 4 was reported the way `LOOPS.md` demands, naming which kind of
blocked.** The OLDEST open item is `112.3` and it is **owner-blocked**; `112.4`
is owner-blocked on 112.3's verdict and AT runtime evidence is
**hardware-blocked**. The oldest **dispatchable** item was `229.3`. Saying which
one was taken and why is the thing that cost four wakes on 173.2.

**229.3 asked whether `check:selftests` should reject a header claiming to owe a
`--self-test` it has. The item framed this as ceremony (94.11, base rate 0)
versus a ratchet (`check:wrong-choice`). Building both candidates answers a
question neither horn asks: can the predicate go red on the defect at all?**

Measured over the **15** heuristic gates carrying a `--self-test` branch, with a
throwaway probe kept out of the tree:

```
baseline                              NARROW 0   BROAD 2
verbatim 229.2 sentence injected      NARROW 1   BROAD 3   <- both live
a REWORDED stale claim injected       NARROW 0   BROAD 0   <- both blind
```

- **Every injection was confirmed present in the file before the run**
  (`grep -n` on the injected line, which landed at line 16 of
  `check-floor.mjs` both times), and the denominator stayed **15** throughout,
  so nothing was silently reclassified. Middle row proves the probe is not dead.
- **The third row is the refusal.** The reworded sentence — *"This gate still
  needs a --self-test (roadmap 42.3) before it can be trusted."* — is a genuine
  instance of the defect on a gate that has the branch, and **both detectors
  report clean**. One synonym from the wording they were written against, the
  gate is green on exactly what it exists to catch.
- **BROAD is strictly worse than NARROW**: its base rate of 2 is two **false
  positives** (`check-resume-charter.mjs`, `check-resume-slice-ids.mjs`), both
  correct prose explaining what the `@heuristic` tag obliges — and it is blind
  to the same rewording.
- **The ratchet precedent was checked, not waved off, and does not transfer.**
  `check:wrong-choice` walks every page and asserts a `<strong>Not …</strong>`
  clause is **PRESENT**, so each new page fires it. This would forbid **one
  phrasing** that now appears nowhere. Presence-over-a-corpus and
  absence-of-one-string are not the same instrument.

**Base rate 0 was NOT what decided it**, and the write-up says so — that reading
is the weakest of the three, and quoting it alone would have made this the sixth
refusal argued from precedent rather than measured.

**Nothing here rests on a rendered image, and nothing is a code change.** The
probe was deleted and both injections reverted; `git status` was confirmed clean
before the commit.

**All required gates green, exit 0 each**, run against the final tree: core
`build`, core `test` (152 in 27 files), `docs:build` (which runs `check:repo` →
`check:selftests` **46 gates / 15 heuristic all self-tested**, `check:slice-refs`
**456** citations, `check-markup`), `check:claims`, `check:formatting`,
`check:layout` (**127** pages), `test:axe` (**127** pages × 2 widths, zero
violations), `check:repo`. Both advisory resume checks pass — charter **14 rules
hold**, and `check:resume-slice-ids` reports **no** named id closed.

`check:claims` reads **158 verified live · 3 NOT VERIFIED**. That is
`ENVIRONMENT.md` §6b — this container reports `(pointer: fine) = false`, so the
three `.bo-btn` press claims cannot discriminate — **not** a regression. Do not
"restore" the zero.

**Not verified, said plainly:** no Podman and no `localhost:8081` here, so the
1440/390 light-and-dark screenshot lane could not run. The item needed neither
list — it is a decision, and the evidence is a build-time injection measurement.

## Dispatcher state at hand-off

```
python3 scripts/loops/dispatch_status.py
```

```
Standardize   1 / 4 Continue round   since 2026-08-30 18:45   ok
Objective     1 / 3 slice            since 2026-08-31 02:50   ok  [229]
Optimize      1 wake-date(s) newer   since 2026-08-30 03:45   STALE
```

**This is the Step 0b comparison — the counter read immediately after recording
— and both moved as predicted.** Rule 2 went **0 → 1** because a `Continue` row
is a Continue round, and rule 3 went **0 → 1 slice `[229]`** because 161.4 counts
`Continue` and `Standardize` rows as closing a slice. No starved counter;
re-run it rather than trusting this snapshot.

**Rule 5 is STALE and therefore COULD NOT BE EVALUATED — do not report it
clear.** Per rule 5's own text. No metric was recorded, deliberately: a refusal
produces no tracked quantity, and inventing one would be a name sampled once,
which can never satisfy "two consecutive runs" — precisely the defect 184.1
describes. This is the second consecutive wake in that position.

**How rules 1-4 were answered, so the next wake need not re-derive them:**

| rule | reading |
|---|---|
| 1 P0 | none open — `grep -n 'P0' ROADMAP.md` returns only closed slice headings; GitHub intake `list_issues` OPEN → `totalCount: 0` |
| 2 Standardize | **0 / 4 — ok** at Step 0b; no drift flagged |
| 3 Objective | **0 / 3 — ok** at Step 0b |
| 4 build item | **dispatched — `229.3`**, the oldest *dispatchable* item |

**The open set is 5, and TWO are dispatchable** (rule 4's kind-of-blocked
distinction, which `LOOPS.md` keeps in the durable playbook precisely because it
did not survive a rewrite of this file):

| item | kind of blocked |
|---|---|
| `112.3` pattern-fit pilot (oldest open) | owner-blocked — briefs + four answers |
| `112.4` Screen Contract layer | owner-blocked — on 112.3's verdict |
| AT runtime evidence | hardware-blocked — owner hardware |
| **229.4** 227.2's base rate is unreproducible | **NOT blocked** — a paragraph and three greps; a cloud wake can take it in full |
| **229.5** the diff-stat form of the git-blob rule | **NOT blocked** — one `ENVIRONMENT.md` edit, or a recorded refusal |

**Next wake's rule 4 target is `229.4`**, unless a counter fires above it. Both
remaining items are written so that **refusing is a satisfying outcome** — 229.4's
honest first result may be that the number cannot be recovered, and 229.5 may be
refused as prose growth on 158.2's argument. Neither should be built just
because it is open.

**229.3 is a live data point for how those two should be taken**: its stated
decision procedure (weigh base rate 0 against the ratchet precedent) would have
produced a *worse-argued* refusal than building the thing and measuring it. If
229.4 or 229.5 can be settled by construction rather than by argument, build the
throwaway and measure.

## Direction

**No new input arrived**: no open GitHub issues, and no owner message since the
last wake. Step 1 had nothing to triage, so no `Roadmap · plan` row exists.

**The standing three are unchanged** (112.3, 112.4, AT runtime) and still need
the owner; no wake of any kind can advance them. The loop is still not running
on counters alone — 229.4 and 229.5 are ordinary buildable items.

**No sweep is due, and this was measured rather than inferred from the line
count.** `ROADMAP.md` is at **1,964** lines, up from 1,880 at the last hand-off,
but the figure that decides a sweep is the **closed-history share**, which the
seventh sweep triggered on at **62.4%**. 177's scope instrument, run verbatim
this wake:

```
# 177's scope instrument — verbatim in ROADMAP-archive.md, Slice 177
# OPEN: [15, 112, 229]
# 1 closed slice carrying 152 lines here; 0 already archived
# closed-history share of sliced lines: 11.2%   (1,358 sliced of 1,964 file lines)
```

**11.2% against 62.4%** — nowhere near. Re-run the instrument rather than
carrying this number forward; it is a snapshot, and 228's post-sweep 9.3% was
already stale by the wake that quoted it.

**177's observation about grill cost does not apply to this wake, which is worth
recording because it is the counter-example.** A grill's slice pays for its text
twice — Slice 229's grill was 254 roadmap lines plus a 313-line standalone
report. This wake's Continue dispatch added **84 lines** to `ROADMAP.md`
(1,880 → 1,964) and no report, while closing an item. The cost 177 names is a
property of the *grill*, not of the loop.

**`cascade.astro`'s missing parse assertion is still open as an observation**
(carried unchanged, not re-derived this wake): it parses `Z_TOKENS` from the
shipped z-index tokens with no assertion, so a zero-parse renders an empty
stacking section rather than a wrong number. Milder than 227.3's — silence, not
a false figure. A Standardize sweep is the right home for it, and rule 2 is at
1/4.
