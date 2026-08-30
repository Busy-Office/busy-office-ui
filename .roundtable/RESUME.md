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

Last updated 2026-08-30 (**cloud** wake). Working tree clean at hand-off; one
push, two commits (`96bd852a` the round, plus the loop-log row).

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 3 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
```

`227.1`, `227.2` and `227.3` are named below as **what landed**, not as open
work. **The open set is 3, and every one of them is blocked** — the backlog
carries nothing any wake can build. That is a change from the last hand-off,
which had exactly one dispatchable item; this wake took it.

## What landed this wake

**Slice 227.2 / 227.3 — Continue, build mode, dispatcher rule 4.** Rules 1-3
were each answered by measurement; the readings are in "Dispatcher state" below.

- **227.2 REFUSED, and the refusal is the item being satisfied.** The item asked
  for a gate on the "hand-typed literal in arithmetic with a live read" class
  **and named its own refusal condition**: measure the base rate first, and if
  the class is 1-of-1 it is 94.11 ceremony. So this is the criterion rule
  working — the entry was written so that finding the premise thin was a
  satisfying outcome rather than an off-plan one.
- **The base rate: 0 live instances.** 30 files perform a live read of a
  generated or shipped artifact; restricted to build-time code they hold **50**
  numeric literals in an arithmetic or comparison context. All 50 are unit
  conversions, loud floor assertions, scoring bands, stated hypotheses, or a
  scale with no live counterpart. The probe deliberately over-reports — the
  unrestricted form returns **308**, mostly CSS values and prose — because the
  question being asked is *is this signal present in things I am not counting?*
- **The predicate cannot be written.** It would have to separate a hand-typed
  fact that mirrors a live source from a unit constant, a hypothesis and a
  scoring band, all sitting in identical syntax. 94.11 one level up: *"a literal
  is an operand" is checkable; "a literal duplicates a fact something else can
  read" is not.* Fourth refusal in the 216.2/217.2/220.2 family.
- **The largest kind is the one that already works.** 12 sites hand-type a
  literal against a live read **as an assertion that fails loudly** —
  `primitives.astro:24`, `tokens.astro:81`, `ai-assistants.astro:30`,
  `palettes.astro`, `semantic-css.ts`. A gate would have to not-fire on all of
  them.
- **227.3 — the sweep found a real defect, and it is 227.1's own shape one step
  on.** 227.1 changed the divisor from a hand-typed `12` to a live read and left
  it **unasserted**: `iconCss.match(...) ?? []` yields an empty Set if the glyph
  selectors are ever renamed, so `iconBytes / 0` publishes **"Infinity kB"** to
  `/components/icon` with nothing failing. 227.1's own text names the pattern it
  then repeated — the earlier fix "made the numerator live and left the
  denominator hand-typed".
- **Measured, not reasoned.** The expression was run against a stylesheet
  carrying no modifiers: `glyphCount 0`, `catalogueKb Infinity`, and `iconShare`
  stays plausible at 3.3% — so the page looks half-right.
- **`icon.astro` was the only such site.** 5 of 8 build-time parse pages throw
  on a bad parse; of the three that do not, `scale.astro` divides *into* a live
  value (a zero is impossible) and `cascade.astro` renders an empty table rather
  than a wrong number.
- **The guard introduces no hand-typed count, deliberately** — a literal floor
  would be the very decaying constant 227.1 removed. It reconciles against
  `api.json`, which `extract-api.mjs` derives from the **source** CSS where this
  regex reads the **shipped min** CSS: two independent derivations of one fact,
  so a partial parse is caught as well as an empty one. They agree exactly today
  — 26 and 26, identical sets.
- **Red-proved by injection, injection confirmed BEFORE the build.** The regex
  was edited to `\.bo-iconZZZ--`, its presence confirmed (**1** occurrence), and
  `docs:build` exited **1** on `/components/icon/index.html` naming *"parsed 0
  glyph modifiers … but api.json declares 26"*. Reverted; `ZZZ` appears **0**
  times in the source and **0** in either dist.
- **Verified against the RENDERED artefact, not the diff.** The built
  `/components/icon/index.html` is **byte-identical** before and after — 96,462
  bytes both, empty diff — which is the claim a render-neutral change owes. The
  page still publishes **68 kB** and **26 glyphs**.

**All 17 CI entry points were run green in this container**, plus a
`DOCS_BASE=/busy-office-ui` build. `check:claims` reported **3 NOT VERIFIED** —
that is `ENVIRONMENT.md` §6b, this container's pointer capability, **not** a
regression; do not "restore" the zero. Read the count beside it: 158 verified
live.

**Not verified, said plainly:** no Podman and no `localhost:8081` here, so the
1440/390 light-and-dark screenshot lane could not run. **Nothing in this wake
rests on a rendered image** — the change is a build-time assertion plus a
comment, and the rendered page is byte-unchanged. `check:layout` (127 pages,
390 + 150% zoom) and `test:axe` (127 × 2 widths) are the whole-tree evidence
that nothing broke.

## Dispatcher state at hand-off

```
python3 scripts/loops/dispatch_status.py
```

```
Standardize   4 / 4 Continue rounds   OVERDUE
Objective     3 / 3 slices            OVERDUE   [222, 226, 227]
Optimize      0 wake-date(s) newer    ok
```

**BOTH counters crossed on this wake's row, and that is the expected result of a
Continue round, not a surprise.** This was the Step 0b comparison — read the
counter right after recording — and it moved as predicted: rule 2 counts
Continue rounds (3 → 4) and rule 3 counts slices closed by Continue/Standardize
(2 → 3).

**The next wake dispatches `Standardize`, not `Objective`** — rule 2 sits above
rule 3 in `LOOPS.md` Step 2, and both are now OVERDUE. Objective stays armed
behind it. Do not read `[222, 226, 227]` as a reason to jump to the grill.

**Standardize has FOUR lanes and the playbook says to say `n of 4`** — four
consecutive sweeps (194, 197, 202, 206) each ran three and none named lane 4,
which is the one carrying the roadmap-regrowth signal. Lane 4 is
`python3 scripts/loops/report_loop_prose.py`; read its **`ratchet` block first**,
never the delta. Worth knowing before that sweep starts: **`ROADMAP.md` grew
this wake** — 227.2's refusal and 227.3 together add ~110 lines to the live
file, and 177's standing observation about a grill paying for its text twice is
still unacted (below).

**How rules 1-3 were answered, so the next wake need not re-derive them:**

| rule | reading |
|---|---|
| 1 P0 | none open; no open GitHub issues (`list_issues` OPEN → `totalCount: 0`) |
| 2 Standardize | 3/4 at dispatch time, not met — **4/4 now** |
| 3 Objective | 2/3 at dispatch time, not met — **3/3 now** |
| 4 build item | took `227.2`, the one dispatchable item; the other three are blocked (below) |

**The open set is now 3, and NOTHING in it is dispatchable** (rule 4's
kind-of-blocked distinction, which `LOOPS.md` keeps in the durable playbook
precisely because it did not survive a rewrite of this file):

| item | kind of blocked |
|---|---|
| `112.3` pattern-fit pilot (oldest open) | owner-blocked — briefs + four answers |
| `112.4` Screen Contract layer | owner-blocked — on 112.3's verdict |
| AT runtime evidence | hardware-blocked — owner hardware |

**So rule 4 will find nothing next wake.** That is not a halt: rules 2 and 3 are
both OVERDUE and sit above it, so the dispatcher has work regardless. Rule 8's
idle spiral is not in play.

## Direction

**This block is genuinely empty of new asks.** No new input arrived: no open
GitHub issues, and no owner message since the last wake.

**Standing three unchanged** (112.3, 112.4, AT runtime). All three need the
owner; no wake of any kind can advance them. With 227.2 decided, these are the
*entire* open backlog — the loop is now running on counters alone.

**Still unacted, now thirteen wakes older:** 177's observation that a grill's
roadmap slice pays for its text twice — 1,192 of 1,943 swept lines were five
Objective-grill slices that each also have a full report in `.roundtable/`.
**Deliberately not filed as an item**, and re-checked this wake rather than
repeated: 177's own text calls it *"a direction call about how the loop records
its own work, and this loop does not take those"*, recorded so the owner can
decide it. It is a standing owner question, not a dropped follow-up. It is
newly relevant: Objective is armed, so the next grill will add another such
slice.

**One measured observation this wake, named rather than filed.**
`cascade.astro` parses `Z_TOKENS` from the shipped z-index tokens and renders
them as a table with **no parse assertion** — a zero-parse would render an empty
stacking section rather than a wrong number. That is the same doctrine
(*a mirror must fail loudly when it cannot see its source*) in a strictly
milder form: silence, not a false figure. Left unfixed on purpose — 227.3's
scope was the divisor that publishes a number, and widening a slice to every
adjacent site is what this loop's own operating rule refuses. A Standardize
sweep is the right home for it if anyone wants it.
