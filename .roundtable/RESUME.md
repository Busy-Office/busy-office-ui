# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and two advisory checks run from `record_iteration.py` — the charter
> check and `check:resume-slice-ids`. Both REPORT on stderr; neither fails a
> build (roadmap 175.3). **Neither fired this wake.**

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

---

## In flight: nothing

Last updated 2026-09-01 (**cloud** wake). Working tree clean at hand-off; two
commits — `e784bbfd` (the Polish round) and the bookkeeping commit carrying this
file — pushed.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 3 at hand-off, across 2 slices
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope + 236.2's lane
```

## ⚠ READ THIS FIRST: the next wake reaches rule 6 again — 7 surfaces still re-queued

```
Standardize   1 / 4 Continue round   since 2026-09-01 12:05   ok
Objective     1 / 3 slice            since 2026-09-01 15:42   ok  [238]
Optimize      0 wake-date(s) newer   since 2026-09-01 17:45   ok  [newest pair: axe-violations]
```

Read immediately after recording, per Step 0b. Rules 1-5 are all clear and rule
4 is still empty, so **the next wake reaches rule 6 (Polish)**, not rule 8.
`polish_requeue.py --apply` re-queued **8** surfaces this wake; stepper took its
round and was stamped, so **7 remain queued** — alerts, calendar, dashboard,
icon, inline-editing, scan, tree-table. Run `--apply` again first regardless,
per rule 6. Re-run `dispatch_status.py` rather than trusting this snapshot.

**Rule 5 is `ok`, not STALE.** Two metrics recorded this wake, both measured
here: `axe-violations 0` (from `test:axe`) and a new `dsa-cite-literals-resolved
81`. **Do not read `bundle-gz-kb`** — it and eleven other names are 13+ days
stale and its `10.8 → 11.6 → 11.7` *looks* exactly like a rule-5 trigger. Not
evaluable.

**Polish rows do not advance the Standardize or Objective counters**, which is
correct — LOOPS.md rule 3 counts Continue and Standardize only. Two wakes of
Polish will not arm a grill.

## The archive sweep signal: still Standardize's lane, at 1 / 4

`roadmap_scope.py` reads closed-history share **393 / 1,904 = 20.6%** with
targets `[238, 237]` and **no target named by a still-open item**, so 236.2's
lane is clear. Real lane-4 signal, and it belongs to Standardize, whose counter
reads **1 / 4**. Do not self-dispatch it from rule 6; it arms on its own.

## What landed this wake

**Polish, reconcile mode, dispatched by rule 6. One commit; the round is a
NO-OP, which §3b names as a valid outcome.**

- **The pick was measured, not alphabetical.** §3b breaks ties by fewest rounds
  used, which left five re-queued surfaces level at `1/3`. `component/stepper`
  won on two further readings: most recently changed source (2026-08-27
  18:55:14, against inline-editing's 17:57:55) and the only one of the five
  with a full `dsa-scores.json` entry, so every arm is falsifiable on it.
- **Arms 1-3 clean and re-read rather than trusted** — the corpus's only
  line-number citation (`badge · spacing -> badge.css:42`) was opened at the
  line, not assumed.
- **Arm 4 re-measured 20/20**, which 176.1 explicitly asked a later wake to do;
  it read 18/18 then, the corpus having gained two quotes since.
- **Arm 5 is new — 81/81.** Every CSS dimension literal quoted in ANY cite,
  against the shipped CSS. It exists because **all four defects this ledger has
  ever recorded were numbers in dimensions arm 4 does not read.**
- **Both arms red-proved three times, each injection confirmed present before
  the run**: a cite literal mutated, the CSS mutated instead, a content clause
  reworded. The probe source is embedded in the ledger so the next wake re-runs
  it instead of re-deriving it.
- **No gate proposed, on the base rate rather than on preference** — 20/20 and
  81/81 are uniformly-true predicates, 94.11's own test for ceremony, and
  101.3's stop rule forbids Polish adding gates independently.

**Two instrument defects caught before either became a finding, both textbook.**

- Arm 5's first run reported `form · spacing :: 1rem` UNRESOLVED. A resolver
  failure: `form/` is the **only** component dir with no canonical `form.css`,
  so it fell through to a junk block match. The fix reports *fewer* unresolved
  — the ledger's own "a parser change that reports MORE is not self-evidently a
  fix", inverted — which is why the css-side red-proof is load-bearing.
- `grep -nP 'font-size\s*:\s*(?!var\()'` read **2** on a clean file and **2**
  on one with `font-size: 13px` injected: `\s*` backtracks to zero width and
  the lookahead then succeeds one space before `var(`. Possessive `\s*+` gives
  **0** and **1**. It was *also* sitting in a `|| echo "none"` pipeline, so its
  own error message printed as a reassuring pass.

**One thing recorded and deliberately NOT called a defect.** `dashboard ·
spacing` claims zero uncommented dimension literals while `dashboard.css:16`
carries a live `20rem`. `git blame` dates that line to 2026-08-12, **eleven days
before** the score, and it is the fallback of a documented consumer-override
hook. Calling it a defect needs a "scan" the cite names and this repo does not
ship. Recorded so a later wake does not re-derive it.

## Gates

**Seven entry points run green against the committed tree, exit 0 each** —
`build`, `test` (**27 files / 152 tests**), `docs:build`, `check:repo`
(slice-refs **686 / 220**, ci-ignores **130 / 128**, paths **260**,
vendor-names **559**), `check:claims`, `check:layout` (**127 pages**),
`test:axe` (**127 × 2, zero violations**).

**Said plainly: that is 7 of the 17 entry points `ENVIRONMENT.md` derives from
`ci.yml`, and the other 10 were NOT run this wake** — `lint:css`,
`check:formatting`, `check:scroll`, `check:forced-colors`, `check:target-size`,
`check:search`, `check:pseudo`, `check:quickstart`, `check:po-app`,
`check -w @busy-office/create-ui` and `suite`. The diff is one markdown file
under `.roundtable/**`, which is in CI's `paths-ignore` and which no gate in
that set reads. **Do not carry "all seventeen green" forward from any hand-off**
— that described a different tree.

`check:claims` reads **162 verified live · 3 NOT VERIFIED** — ENVIRONMENT §6b,
`(pointer: fine) = false` in this container, and the gate names that cause
itself on each of the three. **Not a regression; do not "restore" the zero.**

Two gates outside that seven were also run, as arms 1 and 2 of the round:
`check:wrong-choice` (**156 assertions / 80 pages / 1 outstanding**, the skipped
`date`) and `check:dsa-scores` (**360 assertions / 40 scored / 40 requested by a
page**).

## Step 0c: ZERO collisions this wake

`origin/main` stayed at `e4aae573` across both `git fetch origin main` calls —
Step 0 and once immediately before the first commit.

**ENVIRONMENT traps 1 and 2 both bit at Step 0, as usual.** The container
started **DETACHED** (`git branch --show-current` empty — the check that file
names as the actual answer), and `origin/main` arrived as a **forced update**
(`+ 17b3ba6...e4aae57`) with the local `main` ref stale at `17b3ba6`.
`git checkout -B main origin/main` fixed it before any commit existed. Trap 2's
`--unshallow` ran clean in one attempt, no `.git/shallow.lock`,
`is-shallow-repository` → `false`, **1,788** commits.

## Direction

**No new input arrived**: GitHub intake `list_issues` OPEN → `totalCount: 0`,
and no owner message. Step 1 had nothing to triage, so this wake recorded no
`Roadmap · plan` row.

**The open set is 3 items across 2 slices, and NONE is dispatchable:**

| item | kind of blocked |
|---|---|
| `112.3` pattern-fit pilot | owner-blocked — 5 briefs; `.roundtable/pilot-112/briefs.md` is still the 16-line scaffold, its only commit `e58ea3ca` on **2026-08-23** and never modified since (read from `git log`, not from mtime — mtime here is clone time) |
| `112.4` Screen Contract layer | owner-blocked — on 112.3's verdict |
| AT runtime evidence (Slice 15) | hardware-blocked — owner hardware |

Say the *kind* of blocked, per rule 4's own instruction. **Not one of the three
is browser-blocked or agent-blocked** — a local wake with Podman gains nothing
here, and neither does a second agent. Two need an owner decision; one needs
owner hardware.

**What is owed to the owner:** unchanged, and now five wakes old. Slice 112's
pilot has been waiting on five briefs since 2026-08-22, and Slice 15's AT
evidence on owner hardware. **Nothing this loop can do closes either.** The
honest shape of the last five wakes is unchanged too: everything built has been
the loop's own bookkeeping and self-measurement. This wake's round is real work
— it added an arm that would have caught four of the four defects the ledger has
recorded, where the existing arm would have caught none — but **it is still not
product work; only the owner can make it be.**

**Not verified, said plainly:** no Podman and no `localhost:8081` here, so the
1440/390 light-and-dark screenshot lane could not run. This wake changed **no
CSS and no page markup** — the diff is `.roundtable/polish-state.md` plus the
bookkeeping files, and the docs site renders none of them — so nothing in it
rests on a rendered image. Every browser-driven reading quoted (`check:claims`
162/3, `check:layout` 127, `test:axe` 127 × 2, and arm 4's 20/20 against the
built pages) came from a gate or probe executing in this container.
