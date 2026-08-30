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

Last updated 2026-08-30 (**local** wake). Working tree clean at hand-off; two
pushes (`086c73d` a merge, `f1be248` the slice itself).

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 4 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
```

Ids named below that are **closed or archived** — `211.1`, `213`, `218.1`,
`219.1`, `220.1`, `220.2`, `221.1`, `221.2`, `221.3` — are historical
references to what landed and to what this hand-off cites, not claims they are
open. The four genuinely open are **`222.1`, `112.3`, `112.4`, AT runtime**.

## A Step 0c collision, resolved rather than either side winning by force

**A cloud wake reached the identical owner direction ("pin htmx to 4") this
session was executing, independently and concurrently.** It triaged the
instruction into a plan — Slice 221, all three sub-items `[ ]` — because it
had no browser in its container to verify with; it filed Slice 220 for an
unrelated Polish round on `breadcrumb`, and Slice 222 for a po-app
measurement. This session had the owner directly in chat and built the whole
thing, including resolving 221.3's head-merge blocker.

`git fetch` before the first commit found origin **had already moved**
(`d857a51`). Rather than force-push over it or discard either side: renumbered
this session's slice from the number it was drafted under (which collided) to
**223** — the next free number after the cloud's 220/221/222 — merged with
`git merge origin/main`, resolved the one real conflict (both sides inserted
at the same point in `ROADMAP.md`), and cross-referenced in both directions:
221's own text now says it is closed and points to 223; 221.1/221.2/221.3 are
marked `[x]`; 222.1's still-open residual (`chunk0Reloaded: false`) gained a
third-environment data point (clean 19/19) without being closed, since a
different environment reading doesn't resolve which of its own two Accept
options applies. Full detail: ROADMAP 223's own preamble and 221's closure
note.

## What landed this wake

**Slice 223 — htmx.org 2.x → 4.0.0, repo-wide, plus dropping `apps/docs`'s
`hx-boost`.** Full reasoning, every command, and the verification block are
in ROADMAP 223.

- Renamed every shipped behavior's htmx event listener (`data-grid.ts`,
  `tabs.ts`, `windowed-list.ts`, `data-table.ts`, both their tests):
  `htmx:afterSwap` → `htmx:after:swap`, confirmed against htmx 4.0.0's real
  dist (no `defineExtension`/`hx-ext` at all; `noSwap: [204, 304]` default).
- Rewrote every "htmx discards non-2xx" doc claim for v4's flipped default —
  `grep -rl discards --include=*.astro apps/docs/src` now returns 0 htmx hits.
- `apps/docs`'s own `hx-boost` navigation is **removed, not migrated**: htmx
  4 dropped its extension API, `htmx-ext-head-support` (which merged
  boosted-swap `<head>` content) has no v4 release. `check-boost.mjs`
  (156 lines) deleted as a result. `hx-boost` itself is untouched as a
  documented consumer-facing feature.
- `@busy-office/ui` 0.6.0 → 0.7.0 (Breaking); `create-ui`'s framework pin
  regenerated to `^0.7.0`.
- **A real regression caught by the container step, not any gate**:
  `rm -f package-lock.json && npm install` on macOS silently dropped the
  lockfile's `@rollup/rollup-linux-x64-gnu` optional-platform entry. Fixed
  by restoring the original lockfile and doing a normal merge-install
  instead of delete-then-regenerate — diff went from ~11,660 lines to 34.
- Verified: `vitest` 152/152, `check:claims` 161/161 (158 before),
  `check:po-app` 19/19, `test:axe` 127×2 zero violations, full `docs:build`
  exit 0, `podman build --no-cache` clean on Linux, and a real browser
  session against the rebuilt container — zero console errors on load and
  on an internal navigation, `<body>` confirmed boost-free.

## Dispatcher state at hand-off

```
python3 scripts/loops/dispatch_status.py
```

```
Standardize   4 / 4 Continue rounds   OVERDUE
Objective     4 / 3 slices            OVERDUE  [211, 218, 219, 223]
Optimize      0 wake-date(s) newer    ok
```

**Both counter-triggered rules are now overdue simultaneously.** Rule order
(`LOOPS.md`: P0 > Standardize > Objective > rule 4 > …) means next wake fires
**Standardize** first, not Objective — even though Objective's arming set is
larger and includes this wake's own slice.

**Rule 4's remaining, still blocked:**

| item | kind of blocked |
|---|---|
| `112.3` pattern-fit pilot (oldest open) | owner-blocked — briefs + four answers |
| `112.4` Screen Contract layer | owner-blocked — on 112.3's verdict |
| AT runtime evidence | hardware-blocked — owner hardware |

**Not owner-blocked, but not rule 4 either — a genuine open measurement:**
`222.1` (the `chunk0Reloaded: false` residual on `check:po-app`, environment
still undetermined between (a) app defect / (b) environmental). Worth a
Continue round if Standardize/Objective don't absorb it first.

## Direction

**Nothing else queued from this wake.** The owner direction that drove this
session (htmx v4) is fully executed, not partially — no follow-up item filed
for "finish the migration," because there is nothing left un-migrated.

**Standing three unchanged** (112.3, 112.4, AT runtime).

**Still unacted, now seven wakes older:** 177's observation that a grill's
roadmap slice pays for its text twice.
