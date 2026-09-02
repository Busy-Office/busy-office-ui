# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and two advisory checks run from `record_iteration.py` — the charter
> check and `check:resume-slice-ids`. Both REPORT on stderr; neither fails a
> build (roadmap 175.3). **`check:resume-slice-ids` fired this wake, correctly**
> — it named `240.1` and `241.2`, both of which the file still called open at
> the moment of the rewrite. That is the check doing its job.

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

---

## In flight: nothing

Last updated 2026-09-02 (**cloud** wake). Working tree clean at hand-off; two
commits — `597bb288` (the 241.2 closure) and the bookkeeping commit carrying
this file — pushed.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 3 at hand-off, across 2 slices
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope + 236.2's lane
```

## ⚠ Rule 4 has NOTHING dispatchable next wake — fall through to rule 6

The last hand-off's headline was the reverse, and it was right at the time:
`241.2` was dispatchable by any wake and this wake took it. With it closed, the
open set is back to the two long-standing blocked slices.

- **Rule 4 finds nothing.** OPEN is `[15, 112]` — three items, all blocked, and
  **none of them browser-blocked**, so a *local* wake gains nothing on them
  either. See the Direction table for which kind each is.
- **Expect rule 6 (Polish).** Run `polish_requeue.py --apply` first, per §3b
  step 0. `--check` at hand-off re-queues **4**: `component/dashboard`,
  `component/icon`, `component/inline-editing`, `component/scan` (`date` stays
  SKIPPED). §3b's own note applies — every one of them scores `content: 3` with
  no rankable weakness, so the round is a reconciliation of the published
  artefact against the ledger, and **a no-op is a valid, recordable outcome**.
- **Objective is one slice away at 2 / 3.** It arms the moment a Continue or
  Standardize row names a slice that is not 238 or 241, and it preempts rule 4.

## Dispatcher counters, read immediately after recording (Step 0b)

```
Standardize   3 / 4 Continue rounds  since 2026-09-01 12:05   ok
Objective     2 / 3 slices           since 2026-09-01 15:42   ok  [238, 241]
Optimize      0 wake-date(s) newer   since 2026-09-02 01:46   ok  [newest pair: axe-violations]
```

**Standardize advanced 2 → 3** on this wake's Continue row and is now one round
from firing. **Objective did not move**: Slice 241 was already in its list, so
closing a second item inside the same slice adds nothing — worth knowing before
reading `2 / 3` as stalled.

**Rule 5 is `ok`, not STALE, and was genuinely evaluated**: `axe-violations`
reads `0.0 → 0.0 → 0.0` across three consecutive runs. **Do not read
`bundle-gz-kb`** — it and eleven other names are 13+ days stale and its
`10.8 → 11.6 → 11.7` *looks* exactly like a rule-5 trigger. Not evaluable. The
one absolute size budget that IS live (`RF_BUDGET_KB = 40`) is asserted inside
`npm run build -w @busy-office/ui`, which passed.

## The archive sweep signal: still Standardize's lane, now at 3 / 4

`roadmap_scope.py` read closed-history share **926 / 2,440 = 38.0%** with targets
`[241, 240, 239, 238, 237]` and **no target named by a still-open item**, so
236.2's lane is clear. Re-run it — the denominator moves every wake.

**The share jumped 30.7% → 38.0% and that is this wake's own doing, not drift**:
closing `241.2` moved all of Slice 241 from OPEN to closed history, and the
closure entry itself added ~112 lines to that side. Read it from the tool, never
by subtracting. Real lane-4 signal, and it belongs to Standardize at **3 / 4**.
Do not self-dispatch it; it arms on its own next round.

## What landed this wake

**Continue, build mode, dispatched by rule 4** on the oldest *dispatchable*
item. One commit. `241.2` closed on its Accept's second branch.

- **The pairing stays ungated**, and the base rate was re-measured with a
  *different* instrument from 241.1's grep — a postcss walk over every
  colour-bearing declaration — which agrees at **46** non-token colour
  declarations: 26 `icon.css` glyph URIs (masked), 9 `tabs.css` mask gradients,
  9 `@media print` ink, and **2 painted** (the chevron). The probes' one
  apparent disagreement reconciles exactly: `grep -c "%23" icon.css` reads 27 to
  postcss's 26 because one is in a *comment*.
- **Churn is what actually decided it, and nothing had measured it.** Both
  literals and both surface values are unchanged since the initial commit
  `4ef554fa`, across **1,796** commits. A ratchet would defend a regression path
  with no history on either end.
- **The premise was re-checked, not inherited**: 4.83 / 11.46 recomputed from
  `wcag.mjs`, reproducing 241.1 to the digit, control matching `contrast.json`.
- **The real defect was the gate's own claim.** `check-contrast.mjs` printed
  *"coverage verified against component CSS"* while its coverage guard keys every
  branch off `var(--bo-color-*)` and therefore skips all 46 raw-literal
  declarations in silence — asserting a clean result about a set it never
  enumerated. It now says `TOKEN-PAIR coverage` and reports the count and
  per-file breakdown it cannot see, as `check:rtl` already does.
- **Report, not gate, measured**: 26 of the 46 are icon glyphs, so a ratchet
  would go red on a correct tree (236.2's reasoning). It does not touch the exit
  code, so the `@exact` tag holds — `check:selftests` re-classified green.
- **Red-proved both directions, injection confirmed in the PARSED tree**:
  `color:#abc123` → 46→47 and `primitives/cluster.css` appears (an arm of the
  walk that had never fired); `color:var(--bo-color-text-primary)` → stays 46,
  the discrimination check; revert → 46, empty diff.

**Refused, and the distinction is the point:** the gate is refused on **weight,
not undiscriminability**. 94.11's gate could not fail at all; this one would.
Borrowing 94.11's wording would have overstated the argument, and a later wake
reading "94.11 applies" would inherit a claim that is false.

## Gates

**All 17 CI entry points ran green against the committed tree, exit 0 each** —
`build`, `test` (**27 files / 152 tests**), `lint:css`, `docs:build`,
`check:repo` (slice-refs **693 / 223**), `check:claims`, `check:formatting`,
`check:scroll` (**910 containers / 118 pages**), `check:layout` (**127 pages**),
`check:forced-colors`, `test:axe` (**127 × 2, zero violations**),
`check:target-size`, `check:search`, `check:pseudo`, `check:quickstart`,
`check:po-app` (**19 behaviours**), `check -w @busy-office/create-ui`, and
`suite` (**28 screens × 2 widths**).

`check:slice-refs` moving **692 → 693** citations at an unchanged **223**
headings is the reconciliation for this wake's added citations with no new
slice, not a coincidence.

`check:claims` reads **162 verified live · 3 NOT VERIFIED** — ENVIRONMENT §6b,
`(pointer: fine) = false` in this container, and the gate names that cause itself
on each of the three. **Not a regression; do not "restore" the zero.**

## Step 0c: ZERO collisions this wake

`origin/main` stayed at `46b4a8d3` across both `git fetch origin main` calls —
Step 0 and once immediately before the first commit.

**ENVIRONMENT traps 1 and 2 both bit at Step 0, as usual.** The container started
**DETACHED** (`git branch --show-current` empty — the check that file names as
the actual answer), and `origin/main` arrived as a **forced update**
(`+ 17b3ba6...46b4a8d`) with the local `main` ref stale at `17b3ba6` — the same
stale sha as the last three wakes. `git checkout -B main origin/main` fixed it
before any commit existed. Trap 2's `--unshallow` ran clean in one attempt, no
`.git/shallow.lock`, `is-shallow-repository` → `false`, **1,796** commits.

## Direction

**No new input arrived**: GitHub intake `list_issues` OPEN → `totalCount: 0`, and
no owner message. Step 1 had nothing to triage, so this wake recorded no
`Roadmap · plan` row.

**The open set is 3 items across 2 slices, and none is dispatchable:**

| item | kind of blocked |
|---|---|
| AT runtime evidence (Slice 15) | **hardware-blocked** — owner hardware; needs a human listening to a screen reader |
| `112.3` pattern-fit pilot | **owner-blocked** — 5 briefs; `.roundtable/pilot-112/briefs.md` is still the 16-line scaffold, its only commit `e58ea3ca` on **2026-08-23**, never modified since (read from `git log`, not mtime — mtime here is clone time) |
| `112.4` Screen Contract layer | **owner-blocked** — on 112.3's verdict |

**None is browser-blocked or agent-blocked**, so a local wake gains nothing on
them that this one could not do.

**What is owed to the owner:** unchanged, and now **nine wakes old**. Slice 112's
pilot has been waiting on five briefs since 2026-08-22, and Slice 15's AT
evidence on owner hardware. **Nothing this loop can do closes either.**

What did change: this wake reached a *shipped build gate's claim* rather than
its own bookkeeping. The item as filed was a question about adding a gate; the
answer was no, and the thing worth fixing turned out to be an existing gate
quietly overstating what it had checked. That is the second wake running where
the recorded refusal is the deliverable.

**Not verified, said plainly:** no Podman and no `localhost:8081` here, so the
1440/390 light-and-dark screenshot lane could not run. This wake changed **no
rendering at all** — the diff is one build script's console output and one
markdown file, and ships no CSS — so nothing in it rests on a rendered image.
`check:layout` (127 pages) and `test:axe` (127 × 2) executed in this container
regardless and are green.
