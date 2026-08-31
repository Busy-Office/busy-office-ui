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
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 6 at hand-off, was 5
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
```

The open set went **5 → 6**: this wake filed `232.3` and closed nothing.
`112.3`, `112.4` and the AT item are the same three as always.

## ⚠ Read this first: THIS WAKE LOST TWO COLLISIONS, and one finding survived anyway

**The whole contribution of this wake comes from its second loss.** Both losses
were caught by the pre-commit `git fetch origin main` that Step 0c mandates, and
neither by a push rejection.

1. From `e995891`, it dispatched **rule 2** on the flagged `cascade.astro` drift,
   built its own fix, red-proved both clauses, ran every gate green — then the
   fetch showed `e995891..d32b758c`: **230.1 and all of 231** already landed.
   Discarded.
2. Re-dispatching, `dispatch_status.py` read
   `Objective 3 / 3 OVERDUE [229, 230, 231]` → **rule 3**. It grilled the armed
   set independently; the next fetch showed `d32b758c..dbc41ae2` — **Slice 232,
   the same grill, the same filename**, already landed. Then a third fetch, before
   the final commit, showed `dbc41ae2..8a3ee7e5` (232.1 + the 233.1 triage);
   rebased onto it, cleanly.

**So the day's collision ledger grows again.** The previous hand-off recorded
**four** discarded wakes' work (229.3 built 3×, 231.2 built 3×). This wake adds
its fully-discarded **230.1** build, and a grill that was largely duplicated. A
fair count for 2026-08-31 is **at least five wakes' work discarded**, against
Step 0c's stated accepted cost of *"up to one wake's work"*.

**Do not read that as a reason to reopen Step 0c.** The decision is *accept
collisions*, taken with the cost named, and the mechanism paid a **third** time
today: `232.3` exists only because a third derivation looked at Slice 230 after
two others had signed it off — the landed grill's §B had already written *"no
finding against 230"*. Slice 162's postscript again. The day's ledger is now
**three** such catches (232.1, 233.1, 232.3) against ≥5 discarded wakes.

**The discarded 230.1 build was NOT recorded as a log row, deliberately** — same
choice the two previous losers made. It closed no slice and produced no commit,
and a `Continue` row would feed rule 2's counter for work that never landed.

## What landed this wake

**`232.3` — FILED (Objective, grill mode), outcome `logged`.** The diff is
`ROADMAP.md` and an addendum (§E) to
`.roundtable/grill-objective-229-230-231-2026-08-31.md`. **No code changed and no
gate was added** — this is a finding, filed for a later Continue round to build.

**The finding.** 230.1 fixed `cascade.astro`'s unasserted parse and then *declined
a gate* over the pattern, on the grounds that *"the population is now 6 of 6, so a
gate would be uniformly true — ceremony, not a detector (94.11)"*.

**94.11's test is about DISCRIMINATION, not today's headcount.** Its predicate was
refused because it stayed true *under injection* — `letter-spacing: 7px` was
injected and the detector still reported 0 unexplained. Applied properly the same
test **passes** here, and needs no synthetic injection because the defect is in the
history: `parses > 0 && throws == 0` over the frontmatter of every page matching
`readFileSync|import\.meta\.glob` flags **exactly 1** file at `ff2b623d^`
(`concepts/cascade.astro`) and **0** at `HEAD`. **Zero false positives, no
exemption map** — `scale.astro` and `index.astro`, the two pages 230.1 excluded
*by hand* as byte-length-only, exclude themselves at `parses=0`.

**The counter-evidence is carried in the item rather than omitted**, and it is what
keeps 232.3 off the P0 lane: the loop found this defect *without* a gate (227.1
spotted it, 230.1 fixed it), and the population has been **static at 8 for 9 days**
after growing 1 → 8 in ten. The gate's value is about the **9th page**. What it is
not, is ceremony — `cascade.astro` gained its parse on 2026-08-22 and shipped
unasserted for those same 9 days, read past by three wakes.

**A second finding was DROPPED as a duplicate**, recorded as `--also-refused`: the
89-vs-88 variant denominator (`bo-badge--type` declared by both `badge` and
`dashboard`, collapsing a name-keyed dict). The landed grill's §C already carries
it from two dispatchers.

**Where this wake's own build was WEAKER than what landed, said plainly:** its
independently-built `cascade.astro` guard checked source declarations ⊆ `var()`
usages in the shipped bundle, which would have **missed the value-drift case** the
landed version catches by comparing name *and* value against `tokens.min`. The
landed guard is the better of the two. 232.3 is against the refusal recorded
beside it, not against the guard.

## Gates run this wake

**All green, exit 0 each**, re-run in full **after** the rebase onto `8a3ee7e5`
(the figures below are the post-rebase run, not carried forward): core `build`,
core `test` (**152** in 27 files), `docs:build` (which runs `check:repo`;
`check:slice-refs` **462** citations / **215** slice numbers), `check:claims`,
`check:formatting`, `check:layout` (**127** pages), `test:axe` (**127** × 2
widths, zero violations), `lint:css`. `check:scroll` was green pre-rebase and the
rebase touched no page source.

`check:claims` reads **158 verified live · 3 NOT VERIFIED**. That is
`ENVIRONMENT.md` §6b — this container reports `(pointer: fine) = false`, so the
three `.bo-btn` press claims cannot discriminate — **not** a regression. Do not
"restore" the zero.

## Dispatcher state at hand-off

```
python3 scripts/loops/dispatch_status.py
```

```
Standardize   2 / 4 Continue rounds  since 2026-08-31 13:03   ok
Objective     0 / 3 slices           since 2026-08-31 14:58   ok
Optimize      0 wake-date(s) newer   since 2026-08-31 08:41   ok  [newest pair: axe-violations]
```

**This is the Step 0b comparison — read immediately after recording — and rule 3
moved as predicted**, `1 / 3 [232]` → **0 / 3**, because an `Objective` row resets
it. Rule 2 did not move: an `Objective` row is not a Continue round. Re-run it
rather than trusting this snapshot.

**How rules 1-6 were answered, so the next wake need not re-derive them:**

| rule | reading |
|---|---|
| 1 P0 | none open; GitHub intake `list_issues` OPEN → `totalCount: 0` |
| 2 Standardize | **2 / 4**, and **no drift flagged** — 230 spent that trigger |
| 3 Objective | **3 / 3 OVERDUE `[229, 230, 231]` → DISPATCHED**; now 0 / 3 |
| 4 build item | not reached — rule 3 preempted |
| 5 Optimize | not reached; see the standing warning below |
| 6 Polish | not reached |

**The open set is 6, and THREE are dispatchable** (rule 4's kind-of-blocked
distinction, which `LOOPS.md` keeps in the durable playbook precisely because it
did not survive a rewrite of this file):

| item | kind of blocked |
|---|---|
| `112.3` pattern-fit pilot (oldest open) | owner-blocked — 5 briefs; `.roundtable/pilot-112/` holds README + SEALED-PICKS.md and **no `briefs.md`** |
| `112.4` Screen Contract layer | owner-blocked — on 112.3's verdict |
| AT runtime evidence | hardware-blocked — owner hardware |
| `232.2` the recurrence history 229.3 never measured | **dispatchable** — needs an unshallowed clone, nothing else |
| `232.3` the gate refusal misapplying 94.11 | **dispatchable** — a script + a `--self-test`; no browser, no owner |
| `233.1` two `/components/alerts` claims nothing executes | **dispatchable** — ENVIRONMENT.md's SECOND list (computed style + injection), which a cloud wake takes |

**None is browser-blocked**, so this is not the mis-sort `LOOPS.md` rule 4 warns
about: a local wake has nothing here a cloud wake lacks. **Rule 4's next pick by
"oldest still-open" is `112.3`, which is owner-blocked** — walk past the three
blocked items to `232.2`, and do not report the backlog as blocked.

## ⚠ Rule 5 has one live metric and twelve stale ones — do not read `bundle-gz-kb`

Carried forward from the previous hand-off, unchanged and still true. 13 of 33
metric names have more than one sample; **12 of those 13 have their newest sample
in 2026-08-16→19**. Only `axe-violations` is current — `0.0, 0.0, 0.0`, flat —
which is why `dispatch_status.py`'s rule-5 line says `ok` rather than STALE, and
that `ok` is correct but narrow.

`bundle-gz-kb` reads `10.8 → 11.6 → 11.7`, which *looks* exactly like rule 5's
"regressed on two consecutive runs" trigger and is **14 days stale**. Recorded as
**not evaluable**; do not quote it as current.

## Direction

**No new input arrived from outside the loop** — no open GitHub issues
(`list_issues` OPEN → `totalCount: 0`), no owner message. Step 1 had nothing to
triage, so this wake carries no `Roadmap · plan` row.

**The loop is not out of work.** Three items are dispatchable by any wake, cloud
or local. The three standing items remain the owner's: `112.3` needs 5
owner-authored briefs plus four answers, `112.4` waits on its verdict, and AT
runtime evidence needs the owner's hardware. Publishing remains owner-triggered.

**`ROADMAP.md` is at 3,014 lines** (`wc -l`, measured at hand-off, up from 2,944).
No sweep was triggered and **the closed-history share was NOT re-measured** —
fifth consecutive deferral. Rule 4 was not even reached this wake, so the sweep's
own trigger ("if this rule is walking thousands of lines") did not fire; say
"deferred", not a percentage. Measure the cycle from the blob, never from a
sweep's prose (ENVIRONMENT.md):

```
git show d701e61:ROADMAP.md | wc -l                 # 1626, the seventh sweep
git rev-list --count d701e61..HEAD -- ROADMAP.md
```

**Not verified, said plainly:** no Podman and no `localhost:8081` here, so the
1440/390 light-and-dark screenshot lane could not run. **This wake's commit is not
a code change** — the diff is `ROADMAP.md`, the grill report and the loop-log
files; no shipped artefact, CSS, markup or rendered output moved, so nothing in it
rests on a rendered image.

**One visual gap is inherited, not created here, and a local wake should glance at
it:** 231.2 landed a new demo section on `/components/alerts` in the same
cloud-only conditions. Its properties are gated (`check:layout` at 390 and 150%
zoom, `test:axe` at both widths, `check:pseudo`), but nobody has looked at it at
1440 and 390 in both themes.
