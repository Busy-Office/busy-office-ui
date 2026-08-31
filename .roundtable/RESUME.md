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

## ⚠ READ THIS FIRST: BOTH COUNTERS ARE OVERDUE, AND RULE 2 WINS

```
Standardize   6 / 4 Continue rounds  since 2026-08-31 13:03   OVERDUE
Objective     3 / 3 slices           since 2026-08-31 14:58   OVERDUE  [232, 233, 234]
Optimize      0 wake-date(s) newer   since 2026-08-31 16:15   ok  [newest pair: axe-violations]
```

Read immediately after recording, per Step 0b. **Rule 2 sits above rule 3, so
the next wake dispatches Standardize**, not the grill — and rule 4 is not
reached at all. Re-run `dispatch_status.py` rather than trusting this snapshot:
several dispatchers are landing work hourly and it moves fast.

**Rule 5 is `ok`, not STALE, and the pair is real**: `test:axe` ran green here
(127 pages × 2 widths, zero violations), so `axe-violations = 0` was recorded
from a gate that actually executed, pairing with the prior `0`. **No regression:
0 → 0.** Note the shape — the way to keep rule 5 alive is to record a name
**already sampled**; a name sampled once can never satisfy "two consecutive
runs", which is 184.1's defect exactly. **Do not read `bundle-gz-kb`** — it and
eleven other names are 12+ days stale, and its `10.8 → 11.6 → 11.7` *looks*
exactly like a rule-5 trigger. Not evaluable.

## What landed this wake

**Slice 233.2 — LANDED** (`efab3c13`), Continue/build. The diff is
`apps/docs/scripts/check-claims.mjs` (one case) + `ROADMAP.md`. **No markup, no
CSS, no prose.**

`/components/alerts` asserts that `.bo-toast` *"adds an entrance animation,
which says this just arrived"* while an elevated alert is for entries already on
the page at load. That sentence is why `.bo-alert--elevated` exists as a
separate modifier, and 231.2's keep-decision rests on it. Nothing executed it —
verified at `0c546516` before adding anything, plain fixed string first:
`grep -n animationName` → 7 hits, none an alert; `grep -n bo-toast-in` → 1, in a
comment.

**The red-proof is the argument for the case existing, not just evidence that it
works.** Injecting `animation: bo-toast-in …` into `.bo-alert--elevated`, with
the injection confirmed in the BUILT comment-stripped rule body first:

```
claims check FAILED — 1 of 162
{"elevAnimation":"bo-toast-in","toastAnimation":"bo-toast-in", …}
```

**1 of 162 — 233.1's three cases stayed GREEN.** They pin the two apart on
shadow / background / accent, and an entrance animation landing on `--elevated`
reads clean through all three while collapsing the variant's whole reason to
exist.

`check:claims` **161 → 162** verified live. **`NOT VERIFIED` is 3** —
ENVIRONMENT §6b, `(pointer: fine) = false` in this container. **Not a
regression; do not "restore" the zero.**

**All 16 CI entry points green, exit 0 each**, against the final tree: core
`build`, core `test` (152 in 27 files), `lint:css`, `docs:build`,
`check:claims`, `check:formatting`, `check:scroll`, `check:layout` (127 pages),
`check:forced-colors`, `test:axe` (127 × 2, zero violations),
`check:target-size`, `check:search`, `check:pseudo`, `check:quickstart`,
`check:repo`, `check:po-app`, `create-ui check`, `suite`.

## ⚠ FOUR Step 0c collisions in ONE wake — and the fetch caught every one

This wake lost the same dispatch four times and **committed nothing until the
fifth attempt**, so the cost was rework and never a bad merge. Recorded because
it is now the day's dominant cost, not a curiosity:

| # | detected at | `origin/main` moved | what was discarded |
|---|---|---|---|
| 1 | Step 0, during `--unshallow` | `3b3f143 → 014741ce` | nothing — no work yet; 229.5 / 230.1 / 231 had landed |
| 2 | pre-commit fetch | `014741ce → dbc41ae2` | a full independent build of **231.2** |
| 3 | pre-commit fetch | `dbc41ae2 → 8746604e` | the demo-section half of the delta |
| 4 | pre-commit fetch | `8746604e → 0c546516` | two of the three `check:claims` cases |

**Every detection came from `git fetch origin main`, never from a rebase
conflict** — the half `LOOPS.md` Step 0c already marks as the working one, now
with four more data points. **The rule earns its keep: run the fetch immediately
before the first commit, every time.**

**And redundant coverage paid again, which is Step 0c's stated compensation.**
Each re-derivation found something the previous had not: the winner's 231.2 page
shipped an unexecuted claim (→ 233.1), and 233.1's three cases left the
animation unexecuted (→ 233.2, this wake). What survives a lost collision is the
assertion no earlier derivation had.

## A gate that fails must keep its output — this wake paid to learn it twice

1. One `check:claims` exited 1 inside a 12-gate loop and **never reproduced** —
   five standalone runs, a re-run of the exact command sequence, and a re-run of
   the whole loop, all green at the same live count, with `git diff` on
   `alert.css` clean at the time so it was not a stale injection. **Cause
   unknown, and recorded as unknown**: the loop piped each gate through
   `grep -iE 'check passed|FAILED'`, so the only surviving line was
   `npm error command failed`, which names nothing.
2. A later loop reported **rc=1 on fifteen gates at once**. Nothing had run — an
   unquoted `$L/$(echo $1|tr ':' '-').log` was an ambiguous redirect. *An
   instrument's first output is not evidence*, including the harness you wrote
   to run the instruments.

Same shape as `ENVIRONMENT.md` trap 2b (`| tail -2` cutting off the line naming
the lock file). **Write each gate's full output to its own quoted log path and
tail it only on failure** — the last loop in this session does exactly that.

## Direction

**No new input arrived**: GitHub intake `list_issues` OPEN → `totalCount: 0`,
and no owner message. Step 1 had nothing to triage, so this wake recorded no
`Roadmap · plan` row.

**The open set is 5, and two of them are dispatchable:**

| item | kind of blocked |
|---|---|
| `234.1` introducing commit is 42.1, not 42.3 | **NOT blocked** |
| `232.3` 230.1's refusal misapplies 94.11 | **NOT blocked** |
| `112.3` pattern-fit pilot | owner-blocked — 5 briefs; `.roundtable/pilot-112/` has no `briefs.md` |
| `112.4` Screen Contract layer | owner-blocked — on 112.3's verdict |
| AT runtime evidence (Slice 15) | hardware-blocked — owner hardware |

**Correction for whenever rule 4 is next reached: the oldest open item is Slice
15's AT runtime evidence, NOT `112.3`.** Two consecutive hand-offs have called
`112.3` "oldest open" and it is not — Slice 15 is older. Both are blocked, so no
dispatch was affected, but the label was wrong and is fixed here rather than
carried a third time.

**The archive sweep is now DUE, and the closed-history share was NOT
re-measured** — fourth consecutive deferral. `ROADMAP.md` is at **3,359** lines
(`wc -l < ROADMAP.md`, taken after this wake's own write-up landed — an earlier
draft of this file said 3,271, which was the count *before* it, and that is
`ENVIRONMENT.md`'s "a sweep's stated after-figure predates its own write-up"
trap in miniature), up from 2,448 at the previous hand-off; today's growth is
several dispatchers' write-ups, not one. **Say "deferred", not a percentage** — the last real figure
is two days old. The previous hand-off named the trigger and it has now been
passed: *if a wake needs this share a third time, commit the script.* 177's
scope instrument is in `ROADMAP-archive.md`, Slice 177.

**`cascade.astro`'s missing parse assertion is CLOSED** — 230.1 landed it. Do
not carry it forward again.

**Not verified, said plainly:** no Podman and no `localhost:8081` here, so the
1440/390 light-and-dark screenshot lane could not run. This wake changed one
gate case and markdown — nothing in it rests on a rendered image.
