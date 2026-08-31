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

**The open set is 5 and it did NOT fall, which is worth stating because the
obvious sentence is wrong.** This wake closed `233.1` and filed nothing, but the
other dispatcher opened `232.1`/`232.2`/`232.3` and closed `232.1` while this
wake was working — so the count went 5 → 5 by two independent movements, not by
standing still. The first draft of this line said "5 → 4" from arithmetic on a
stale reading and `check:resume-slice-ids` caught it; **re-run the grep, do not
subtract.**

| open item | kind of blocked |
|---|---|
| `232.2` recurrence history behind 229.3 | **NOT blocked — and largely already measured, see below** |
| `232.3` does 230.1's refusal misapply 94.11 | **NOT blocked** |
| `112.3` pattern-fit pilot | owner-blocked — briefs + four answers |
| `112.4` Screen Contract layer | owner-blocked — on 112.3's verdict |
| AT runtime evidence | hardware-blocked — owner hardware |

**Two are dispatchable, not one.** And `232.2` has a head start: this wake
measured exactly its question independently (below), so a wake taking it should
read that first rather than re-deriving a 316-commit walk.

## What landed this wake

**`233.1` only — and it took four dispatches to land one item.** Read the
collision section below before anything else here: **three of this wake's four
dispatches were discarded.** That is context, not an excuse — the one item that
landed is a direct product of having kept measuring after the third loss.

**233.1 — making two prose claims executable proved one of them FALSE.** The
Elevated section on `/components/alerts` said the elevated and toast surfaces
*match*. Executed in both themes, on the built page:

| | `--elevated` | `.bo-toast` |
|---|---|---|
| background | `255,255,255` / `34,38,46` | **identical** |
| box-shadow | `0 4px 6px -1px` (md) | `0 10px 15px -3px` (**lg**) |
| border-radius | `6px` | `4px` (never set; inherits `.bo-alert`) |

The divergence is **correct** — a toast floats over the page, an elevated alert
sits in it — so the page was corrected rather than the CSS, and the case asserts
*same raised background, deliberately different height*, which is the property
231.2's keep-decision actually rests on. `alert.css` carried the same
overstatement (*"already carries this exact look"*) and was corrected too.

The second claim — *"the card look and the accent colour are independent"* — is
**true as written and incomplete where it matters**. The accent colour is
independent; the **fill** is not, because `.bo-alert--elevated` sets
`background` directly and beats `--bo-alert-bg` on source order. The page gained
a clause; **it was written from the measurement, and a first draft read off the
stylesheet got the direction wrong.**

**Three cases, each red-proved by a targeted injection hitting a different
subset** — which is what shows they discriminate rather than moving together:
`border-inline-start-color` reddens **case 2 only**; deleting the `background`
reddens **1 and 3**; the transparency injection reddens **1 and 3**. Case 1 had
already gone red on the real defect before any injection existed. The equality
hole 233.1's Accept named is closed with an `opaque()` predicate and red-proved
by appending `.bo-alert--elevated,.bo-toast{background:transparent}` to the built
stylesheet: the gate goes red and prints `"elev":{"bg":"rgba(0, 0, 0, 0)"` —
**the injection confirmed in the DOM via the computed reading, not in the file.**

`check:claims` reads **161 live · 3 NOT VERIFIED** (was 158 · 3). The +3 is
exactly the cases added. **The 3 is ENVIRONMENT.md §6b — this container reports
`(pointer: fine) = false` — not a regression. Do not "restore" the zero.**

**All 17 cloud-toolchain entry points run green here, exit 0 each**, list taken
from `ENVIRONMENT.md` rather than curated: core `build`, `test` (152 in 27
files), `lint:css`, `docs:build` (`check:slice-refs` 462 / 249 / 2),
`check:claims`, `check:formatting`, `check:scroll`, `check:layout`,
`check:forced-colors`, `test:axe` (127 × 2, zero violations),
`check:target-size`, `check:search`, `check:pseudo`, `check:quickstart`,
`check:po-app` (**19/19**), `check -w @busy-office/create-ui`, and `suite`
(28 screens × 2). Re-run after the rebase: `docs:build` and `check:claims` both
still green.

**Not verified, said plainly:** no Podman and no `localhost:8081` here, so the
1440/390 light-and-dark screenshot lane could not run. **Nothing in this wake
rests on a rendered image** — every claim is a computed-style reading taken in
headless Chrome and red-proved by injection, which is exactly `ENVIRONMENT.md`'s
"can run" list.

## ⚠ THIS WAKE LOST THREE Step 0c COLLISIONS

Recorded in full because the next cloud wake will hit the same thing, and because
the roadmap's own ledger (Slices 232, 232.3, 233) was written by the **other**
dispatcher and does not contain this wake's three.

| # | dispatch | built to completion | found at the pre-commit fetch |
|---|---|---|---|
| 1 | rule 4 → **229.3** | refusal + 316-commit history walk, gates green | `origin/main` **10 commits ahead**; 229.3/4/5, 230, 231 all landed |
| 2 | rule 4 → **231.2** | KEEP verdict + browser measurement, gates green | **2 more commits**; 231.2 landed |
| 3 | rule 3 → **Objective grill of 229/230/231** | full grill + report written | **Slice 232** landed, same arming set |
| 4 | rule 4 → **233.1** | this one | **pushed** |

**Every discard was caught by the mandated `git fetch origin main` immediately
before the first commit.** That step is the working half of Step 0c and it earned
its place three times in one wake — **do not skip it, and do not "fix" it.** No
wrong push happened and no rebase was needed for any of the three.

**Two things this wake independently reproduced without having seen the winner**,
which is Step 0c's credited compensation actually firing:

- **229.3's refusal**, by a different instrument — a 316-commit walk measuring
  **regrowth at 0 of 8** (eight new heuristic gates were written while six
  sibling headers carried the stale sentence; none copied it). The other
  dispatcher filed the same finding independently as `232.2`.
- **231.2's KEEP verdict and the 89-pairs / 88-distinct denominator
  correction**, reached identically and separately.

**What nobody else reproduced is what became 233.1**, and it only surfaced
because this wake kept measuring after losing. Worth stating for the next wake
tempted to stop after a loss: **the losing diff carried a `check:claims` case the
winner's did not**, and that case caught a false sentence on a shipped page.

**One instrument trap, new, worth carrying:** `git cat-file --batch` sizes are
**bytes**, and this repo's prose is full of em dashes, so a text-mode parser
desyncs the blob stream. It crashed loudly here; a quieter one would have
attributed bodies to neighbouring files. `ENVIRONMENT.md` §7 already records the
em dash breaking `wc -w` — same character, different instrument, so the trap
belongs to the character rather than to `wc`.

## Dispatcher state at hand-off

```
python3 scripts/loops/dispatch_status.py
```

**Read it fresh — it moved four times during this wake**, and rule 3 both fired
and reset inside it. Run it rather than trusting any paragraph here; the Step 0b
comparison — the counter read immediately after recording — is what has found two
of the five starved-counter bugs.

**How the rules were answered, each time this wake re-dispatched:**

| rule | reading |
|---|---|
| 1 P0 | none open; GitHub intake **0 open issues** (`list_issues` OPEN → `totalCount: 0`) |
| 2 Standardize | `0 / 4` then `1 / 4` — ok, no drift flagged |
| 3 Objective | fired mid-wake at `3 / 3 [229, 230, 231]`; **lost to Slice 232** |
| 4 build item | took the oldest **dispatchable** item each time |

**Rule 4's kind-of-blocked distinction, restated because it is what makes this
wake legible:** the oldest *open* item is not the oldest *actionable* one.
`112.3` and `112.4` are **owner-blocked**, the AT item is **hardware-blocked**,
and every item this wake took was the oldest genuinely dispatchable one. Say
which kind when reporting rule 4 as finding nothing.

## Direction

**No new input**: no open GitHub issues, and no owner message since the last
wake. Step 1 had nothing to triage, so no `Roadmap · plan` row exists.

**The standing three are unchanged** (112.3, 112.4, AT runtime) and still need
the owner; no wake of any kind can advance them.

**The one thing genuinely worth the owner's attention is the collision rate, and
it is reported rather than acted on.** Slice 232 records the day's ledger and
explicitly declines to file it as an item, on the grounds that Step 0c already
accepted collisions with the cost named. **That decision is not reopened here.**
What this wake adds is the measured shape: on 2026-08-31 the two dispatchers
between them built **229.3 three times, 231.2 three times, and the 229/230/231
grill twice**, landing one of each. Step 0c's stated cost is *"up to one wake's
work, discarded"*; the day's figure is **five-plus wakes**.

**The counter-evidence is equally real, which is why this is a direction question
and not a defect report.** The duplication paid three times in one day — `232.1`,
`232.2` and `233.1` each came from a *losing* dispatcher re-deriving something
independently, and `233.1` caught a false sentence that had shipped through
review with every gate green. A wake that stopped at its first loss would have
produced none of them.

**`232.2` is answerable from this wake's own measurement.** Its question is *"how
often has the defect actually appeared?"* — measured here as **one introduction,
zero recurrences**: the sentence entered in `84eb14ca` (42.1, the commit that
introduced the tagging scheme, where 5 of 6 instances were **true when written**),
went false the next commit the same day in `443348e2` (42.3, which paid the debt),
and **regrowth is 0 of 8** — eight new heuristic gate files were written during
the twelve stale days and none copied it. `check-boost.mjs` leaving the set on
2026-08-30 was a **file deletion** in the htmx-4 migration, not a fix; the 6→5
step reads like a correction and is not one. Commands:

```
grep -rl 'OWES a --self-test' apps/docs/scripts packages/core/scripts | wc -l   # 0
git log --format='%h %ad' --date=short -S'OWES a --self-test' \
    -- apps/docs/scripts packages/core/scripts                    # 3 commits, ever
```

**`232.3` is the other dispatchable item**, and it is a live disagreement
between the two dispatchers about whether 230.1's gate refusal misapplies 94.11.
Worth reading before taking, because this wake independently red-proved 230.1's
assertion from the other direction: renaming `--bo-z-toast` → `--bo-z-toastzz` in
the source tokens, with `tokens.min.css` still carrying the old name, makes
`astro build` exit **1** — and it fires on a **rename at equal count, 5 vs 5**,
precisely the failure mode 229.1 found in 227.3's count-based guard.
