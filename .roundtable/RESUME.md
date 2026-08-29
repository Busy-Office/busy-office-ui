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

Last updated 2026-08-29 (local session — **rule 4 → Continue, build mode,
`196.1`**). Working tree clean at hand-off; the wake's commits went out as one
push.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md                # 3 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs       # names the closed ids
```

**No collision this wake.** `git fetch origin main` at Step 0 and again
immediately before each commit all read clean fast-forwards; HEAD matched
origin/main after every push.

## What landed this wake (2026-08-29, local session, rule 4 → `193.2` then `196.1`)

**193.2 — re-measured the 42 body-level reopen conditions found by Slice 193.**
Classified all 42: 23 semantic, 11 mechanically checkable, 4 advisory-not-a-
trigger, 1 needle false positive (137.8's "reopen closed tab" is a browser
shortcut, not a repo condition). Of the 11 checkable: css-repeats'
joined-control-x4 condition (178.4/166.1/169.1) re-checked, still hasn't fired
(still 2 components). 5 more had already fired and are closed records. 5 left
unchecked for lack of the right corpus on hand, rather than guessed at. The
n=2 "playbook-names-it predicts execution" hypothesis held on a wider n=6 —
not falsified. No mechanism proposed: a 42-row register is 94.11 ceremony, and
the fix the hypothesis argues for (name the condition in a `LOOPS.md` playbook
step) already exists as the working pattern. The 558-item denominator did
**not** reproduce under the parser at any point tried — recorded as an open,
unexplained 3-item gap rather than forced to match, since the 42-hit count
(not the denominator) is what the item's actions hang on.

**196.1 — `data-table.css`'s claim that the cell error message "can never
introduce horizontal overflow" was false, and the CSS comment was corrected
rather than the geometry.** The message is `position: absolute;
inset-inline-start: 0` inside `.bo-form-field`, so its right edge is *cell
offset + width* — no width-only cap (`cqi`, `%`, fixed) can bound that without
knowing the offset, and there is no container-query primitive for an
absolutely-positioned descendant's own position. Branch A (close the gap to
zero) was rejected: the two real fixes — relocate the containing block
(breaks the below-field anchor) or hand-compute a per-column offset (drifts on
any column change) — both cost more than a bug affecting **zero shipped
pages** (only `/patterns/editable-grid/` nests this pattern, and its demo
message is 21 characters). Diff is comment-only — no declaration value
changed, so 190.1's vertical-visibility/row-height contract holds by
construction; re-running the six-combination browser harness would reproduce
the same already-recorded numbers, so it was skipped and stated as such rather
than silently assumed. No `check:claims` case added, per the item's own Accept
(Branch B leaves no new measurable runtime property).

## ⚠ THIS WAS A LOCAL SESSION WAKE — WHAT WAS AND WASN'T LOOKED AT

No Podman, no `localhost:8081`, **no screenshots at 1440px/390px in light and
dark**. Nothing was visually verified and nothing is described as if it were.

**Nothing this wake needed one.** Both slices are prose/comment-only —
`git diff --stat` on each commit names `ROADMAP.md` plus, for 196.1,
`data-table.css`'s **comment block only** (confirmed: no declaration line
changed). `check:slice-refs` and `check:repo` both ran green (9/9 sub-checks)
after 196.1, including the new `roadmap 196.1` citation resolving.

## Dispatcher state at hand-off

```
Standardize   4 / 4 Continue rounds   OVERDUE  <- next dispatch
Objective     2 / 3 slices            ok       [193, 196]
Optimize      0 wake-date(s) newer    ok
```

**Next wake: rule 2, Standardize sweep is overdue** (4/4). Rule 4's open items
are all owner-blocked (112.3, 112.4, AT runtime evidence) — none is
dispatchable without the owner.

## Owner-blocked, unchanged this wake

- **112.3** — the pattern-fit pilot. Blocked on 5-8 sealed briefs plus four
  roundtable answers (`.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
- **112.4** — Screen Contract layer. Blocked on 112.3's verdict.
- **AT runtime evidence** — needs owner hardware + screen reader.
- Two blind re-scores owed (§3b step 4) — need a second agent this session
  has not been authorized to spawn.
- **185.1** — wire `create-ui` into the release workflow; needs an owner call
  on the version-match gate (core and create-ui can't share one release-tag
  assertion).
