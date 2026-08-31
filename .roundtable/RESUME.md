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

**The open set is 5.** This wake closed nothing and filed **`234.1`**; the item
it dispatched (`232.2`) was closed by the other dispatcher mid-wake. `112.3`,
`112.4` and the AT item are the same three as always.

| open item | kind of blocked |
|---|---|
| `234.1` the 42.1-vs-42.3 attribution (filed this wake) | **NOT blocked** — history measurement; needs an unshallowed clone, nothing else |
| `232.3` does 230.1's refusal misapply 94.11 | **NOT blocked** — a script + a `--self-test` |
| `112.3` pattern-fit pilot | owner-blocked — 5 briefs + four answers; `.roundtable/pilot-112/` has README + SEALED-PICKS.md and **no `briefs.md`** |
| `112.4` Screen Contract layer | owner-blocked — on 112.3's verdict |
| AT runtime evidence | hardware-blocked — owner hardware |

**None of the blocked three is browser-blocked**, so this is not the mis-sort
`LOOPS.md` rule 4 warns about: a local wake has nothing here a cloud wake lacks.
**Do not report the backlog as blocked** — two items are dispatchable by anyone.

## ⚠ READ THIS FIRST: RULE 4 IS NOT WHAT FIRES NEXT

```
Standardize   5 / 4 Continue rounds  OVERDUE
Objective     3 / 3 slices           OVERDUE  [232, 233, 234]
Optimize      0 wake-date(s) newer   ok       [newest pair: axe-violations]
```

**This is the Step 0b comparison, read immediately after recording, and BOTH
counters crossed during this wake.** Rule 2 went `2 / 4` → `4 / 4` → **`5 / 4`**;
rule 3 went `0 / 3` → `2 / 3` → **`3 / 3`**. Three Continue rounds landed on
2026-08-31 between the two dispatchers, and this wake's row was the fifth.

**Rule 2 sits above rule 3, which sits above rule 4**, so the next wake
dispatches **Standardize** — not `234.1`, not `232.3`, however tempting the open
set looks. Both of those wait. That ordering is deliberate (`LOOPS.md` Step 2):
a counter below an always-true rule can only fire once the backlog empties, which
is exactly when drift is worst.

**Re-run `dispatch_status.py` rather than trusting this snapshot.** That
comparison has found two of the five starved-counter bugs, and it is the single
thing in this hand-off that reasoning from the open set would have got wrong.

**Standardize's four lanes — say `n of 4` in the write-up.** Four consecutive
sweeps ran three and none named lane 4:
`npm run scan:dead-style -w docs`, `npm run report:css-repeats -w @busy-office/ui`,
`npm run report:prose -w docs`, `python3 scripts/loops/report_loop_prose.py`
(read its `ratchet` block first, never the delta).

## ⚠ THIS WAKE LOST ITS DISPATCH, AND THE FINDING SURVIVED THE LOSS

**The whole contribution of this wake is what its losing diff held that the
winner's did not.**

Rule 4 dispatched `232.2` — the oldest dispatchable item, the three older ones
being owner- or hardware-blocked. The work was done, gates run green, committed.
The mandated pre-push `git fetch origin main` then showed
`0c3fd9ea..84aa5b93`: **the other dispatcher had taken `232.2` too and pushed
first.** Reset to their tip; the item is closed and **is not reopened**.

**But their closure CONFIRMS a premise that is measurably false, and so did
mine's first draft** — which is the finding, now filed as **`234.1`**.

232.2 claimed *"the defect was introduced BY the commit that paid the debt"*
(`443348e2`, 42.3). Both dispatchers re-derived it on an unshallowed clone and
both confirmed it. **It is right for 5 of 6 files.** `84eb14ca` (42.1) gave
`check-notes.mjs` its `--self-test` branch **in the same commit** as the header
claiming it owed one, so 1 of 6 files was defective two commits and twenty
minutes before 42.3 existed.

**Why both confirmations agreed and were both wrong: they ran the same
single-file probe.** The landed text publishes exactly two commands, both against
**`check-floor.mjs`** — which is one of the five files that behave as described.
Run per file, `84eb14ca` gives five files `sentence=1 branch=0` and
`check-notes.mjs` `sentence=1 branch=1`. The command is in `234.1`, beside the
claim.

**What does NOT change, stated first so the correction is not over-read:** the
aggregate is untouched. All **1,749** first-parent commits of `main`, counting
files in the defective state: `0 → 1` (42.1) `→ 6` (42.3) `→ 5` (220, by
deletion) `→ 0` (229.2) — **one entry, zero recurrences**, exactly as 232.2
reported. Regrowth reads zero at both scopes measured: **0 of 8** heuristic gates
(the sibling walk) and **0 of 24** `check-*.mjs` created between 42.3 and 229.2
(this wake). **229.3's refusal stands and is not reopened** — recorded as an
`--also-refused` row, as is reopening 232.2 itself.

**The entry counter was red-proved by discrimination, not assumed** — a counter
that can only ever read 1 would report "zero recurrences" about any history at
all. The same aggregate code path on a predicate that really toggles (`In flight:
nothing` in this file, same 1,749 commits) returns **2**. Probes kept out of the
tree per 134.3. The published per-file command's blind spot is stated in `234.1`:
an **absent** file prints `0 0`, indistinguishable from clean.

**This correction has now been reached three times and died twice.** The `233.1`
hand-off already said 42.1 was where *"5 of 6 instances were true when written"*,
hours earlier, from a 316-commit walk. `grep -n '5 of 6' ROADMAP.md` finds
nothing about this defect — it lived only in **this file**, which is rewritten
wholesale every wake, while the durable record asserted the opposite and then
had that assertion *confirmed* by a fresh clone. **169.3's lesson on live data**,
and the reason `234.1` puts it in `ROADMAP.md` instead.

**The day's collision ledger.** The previous hand-off counted at least five
discarded wakes on 2026-08-31; this wake's lost `232.2` dispatch makes **six**,
against Step 0c's stated accepted cost of *"up to one wake's work"*. **Step 0c is
NOT reopened** — accepting collisions is the owner's decision, taken with the cost
named, and it paid again here: `234.1` exists only because a fourth derivation
looked at the same question after two others had signed it off. The day's ledger
of such catches is now **four** (232.1, 233.1, 232.3, 234.1).

**The salvage rule the other dispatcher wrote down is what this wake executed,
and it is worth keeping:** *a losing dispatcher should diff its patch against the
winner's before discarding it.* Here the diff was not in the conclusion but in
one confirmed premise.

## Gates run this wake

**All green, exit 0 each.** Run in full on the post-rebase tree **before** the
race was lost: core `build`, core `test` (**152** in 27 files), `lint:css`,
`docs:build` (`check:slice-refs` **462** citations / **249** cited / **215**
slice numbers — **463 / 249 / 216** on the final re-run, the +1 being Slice 234), `check:claims`, `check:formatting`, `check:layout` (**127**
pages), `test:axe` (**127** × 2 widths, zero violations), `check:scroll` (**910**
scrollable containers across 118 pages × 2 widths).

**Re-run after resetting onto `84aa5b93`:** `docs:build`, which is the gate the
final diff can actually move (`check:slice-refs` validates the new `234.1`
citations). Everything else has an unchanged input — **the final diff is
`ROADMAP.md` plus the loop-log files, markdown only.**

`check:claims` reads **161 verified live · 3 NOT VERIFIED**. The 3 is
`ENVIRONMENT.md` §6b — this container reports `(pointer: fine) = false`, so the
three `.bo-btn` press claims cannot discriminate. **Not a regression; do not
"restore" the zero.**

**Not run, and named rather than skipped quietly:** `check:forced-colors`,
`check:target-size`, `check:search`, `check:pseudo`, `check:quickstart`,
`check:po-app`, `check -w @busy-office/create-ui`, `suite`. The diff moves no
CSS, markup, script or built output, so none has a changed input; the previous
wake ran all 17 green on the tree this one sits on.

## ⚠ Rule 5 has one live metric and twelve stale ones — do not read `bundle-gz-kb`

Carried forward unchanged and still true. 13 of 33 metric names have more than
one sample; **12 of those 13 have their newest sample in 2026-08-16→19**. Only
`axe-violations` is current — flat at `0.0` — which is why
`dispatch_status.py`'s rule-5 line says `ok` rather than STALE, and that `ok` is
correct but narrow.

`bundle-gz-kb` reads `10.8 → 11.6 → 11.7`, which *looks* exactly like rule 5's
"regressed on two consecutive runs" trigger and is **14 days stale**. Recorded as
**not evaluable**; do not quote it as current.

## Direction

**No new input arrived from outside the loop** — no open GitHub issues
(`list_issues` OPEN → `totalCount: 0`), no owner message. Step 1 had nothing to
triage, so this wake carries no `Roadmap · plan` row.

**The loop is not out of work**, but neither open build item runs next: rules 2
and 3 are both OVERDUE and sit above rule 4. Expect **Standardize**, then likely
an **Objective** grill, before `234.1` or `232.3` is reached.

**The three standing items remain the owner's**: `112.3` needs 5 owner-authored
briefs plus four answers, `112.4` waits on its verdict, and AT runtime evidence
needs the owner's hardware. Publishing remains owner-triggered.

**The one thing genuinely worth the owner's attention is unchanged from the
previous hand-off and is reported, not re-filed:** the collision rate. Six
discarded wakes on one day against a stated cost of one. The counter-evidence is
equally real — four findings today came from a *losing* dispatcher re-deriving
independently, and `234.1` is the sharpest of them, because it caught a false
premise that two separate wakes had confirmed with fresh clones. That is a
direction question for the owner, not a defect report, and Slice 232 already
declined to file it as an item.

**`ROADMAP.md` is at 3,258 lines** (`wc -l`, measured at hand-off, up from 3,014
three wakes ago — **+244 across today's wakes**). No sweep was triggered and **the
closed-history share was NOT re-measured** — sixth consecutive deferral. Rule 4
dispatched off a 5-item open set rather than by walking thousands of lines, so
the sweep's own trigger did not fire; say "deferred", not a percentage. **The
growth rate is worth a look from the next Standardize**, whose lane 4 carries
exactly this signal. Measure the cycle from the blob, never from a sweep's prose
(ENVIRONMENT.md):

```
git show d701e61:ROADMAP.md | wc -l                 # 1626, the seventh sweep
git rev-list --count d701e61..HEAD -- ROADMAP.md    # 14 at hand-off
```

**Not verified, said plainly:** no Podman and no `localhost:8081` here, so the
1440/390 light-and-dark screenshot lane could not run. **This wake's diff is not
a code change** — `ROADMAP.md` plus the loop-log files; no shipped artefact, CSS,
markup or rendered output moved, so nothing in it rests on a rendered image.

**Two visual gaps are inherited, not created here, and a local wake should glance
at both:** 231.2 landed a new demo section on `/components/alerts` in cloud-only
conditions, and 233.1 then changed `alert.css` and `alerts.astro` in the same
conditions. Their properties are gated (`check:layout` at 390 and 150% zoom,
`test:axe` at both widths, `check:pseudo`, and 233.1 added three executable
`check:claims` cases red-proved by injection), but **nobody has looked at either
at 1440 and 390 in both themes.**
