# busy-office-ui — Loop System

Autonomous work runs as **loops**: a loop wakes on a cadence, does focused work
(**try → verify → adjust → commit**, repeated until the goal is actually met, not
just once), then re-arms. Each loop type has a different *job*, and each
orchestrates the skills/agents that job needs. This file is the playbook — what
starts a loop, what it runs, and how it hands off.

**The Roadmap loop is the dispatcher.** It runs first, every wake — not as a
separate "host" consulting a static table, but as the actual decision-maker: it
checks for new input, triages it into `ROADMAP.md` if there is any, then decides
which loop's playbook runs the rest of this wake. Any loop can also be invoked on
demand: `/loop <type> …`.

---

## The six loops

| Loop | Job (one line) | Cadence | Primary skills / agents |
|------|----------------|---------|-------------------------|
| **Roadmap** | Dispatcher: triage new input, decide what runs next | **every wake, first** — 20 min | `Plan`, `domain-modeling` |
| **Continue** | Build the next backlog item — multi-round until its Accept criteria are met | dispatched most wakes | `frontend-design`, `diagnosing-bugs`, `Explore`, `verifier` |
| **Standardize** | DRY + tidy: one pattern, no one-offs — multi-round until a clean pass | dispatched every 4th Continue round, or on drift | `Explore`, `stylelint` gate, `verifier`, `Workflow` fan-out |
| **Optimize** | Smaller, faster, lower-specificity | dispatched on demand / at size regressions | build metrics, `Explore` |
| **Explore** | Find & spike a *new* idea (try/error) | dispatched when backlog empties, or on demand | `frontend-design`, `Plan`, worktree isolation |
| **Objective** | Grill the product *vision* | dispatched at milestones / on demand | `round-table` (rt-*), project panel |

---

## Dispatcher — what the Roadmap loop does every wake

Two steps, in order. **Both run every wake** — this replaces the old model of a
separate "host" consulting a static router table; the Roadmap loop *is* the
router now, and it acts on what it finds instead of just reading it.

### Step 1 — Triage new input

New input = a user-reported issue, a new requirement, direction, or constraint
surfaced since the last wake — in chat, added to `ROADMAP.md`'s backlog by
someone else, or **filed on GitHub**: check
`gh issue list -R Busy-Office/busy-office-ui --state open` every wake (public
intake since 0.1.0 shipped on npm; templates enforce version/browser/theme/
density + minimal repro on bugs, a real ERP scenario on features). An issue
triages like any other input — P0 if it's a bug, ranked into a slice with
Accept criteria otherwise — and gets closed with a comment linking the fixing
commit once its item ships. If there is any:

1. Classify it: a **bug** (something that used to work / should work and
   doesn't) gets flagged **P0** and jumps the queue; a **feature/requirement**
   gets ranked by value × effort into the current slice's queue (or a future
   one if it's not this slice's shape); a **process/direction change** (like
   this file) gets edited directly.
2. Write it into `ROADMAP.md` with *Accept* criteria if it doesn't have any —
   an item without a checkable definition of done can't be dispatched
   correctly in Step 2.
3. Commit the roadmap update itself (small, `Roadmap · plan` in the log) —
   this makes triage visible even on wakes where nothing else ships.

**This step is why new input always reaches the plan before it reaches code** —
a wake that starts with a fresh bug report or a new ask doesn't skip straight to
fixing/building; it's triaged first, so priority (is this a P0? does it bump
something else?) is decided deliberately, not by whichever loop happened to be
running.

### Step 2 — Decide what runs next

Evaluate top-to-bottom against the now-current `ROADMAP.md`; dispatch the first
match to its full playbook below:

1. **Open P0 bug?** → dispatch **Continue**, bug mode.
2. **Build item queued** in the current in-progress slice? → dispatch
   **Continue**, build mode.
3. **4+ Continue rounds since the last Standardize, or drift flagged** (by
   Continue itself, or spotted during triage)? → dispatch **Standardize**.
4. **A tracked metric regressed** (bundle size, gate coverage, a number from
   `record_metric.py` trending the wrong way)? → dispatch **Optimize**.
5. **Backlog empty** (no unchecked item in the current slice)? → dispatch
   **Explore** for one idea, then run Roadmap's own triage again on the
   result (graduate into the plan, or log the discard).
6. **Milestone reached** (a slice just closed) **or user asked**? → dispatch
   **Objective**.

Record the dispatch decision itself as part of the iteration log — the outcome
line already names which loop ran; that's the audit trail for *why*.

---

## Playbooks

### 1. Roadmap (dispatcher) — runs first, every wake
**Trigger:** every wake, always — 20 min, or immediately on new input arriving
out of band (a user message with an issue/requirement mid-cycle doesn't wait for
the next tick if the session is live to receive it).
1. Triage (Step 1 above) — commit if anything changed.
2. Decide (Step 2 above) — dispatch to the matching loop's playbook.
3. Also, independent of new input, ~daily or after an Explore graduation: do a
   fuller reconciliation pass — done vs pending, re-rank by value × effort,
   split oversized items, merge dupes, record real architecture decisions via
   `domain-modeling` (ADR).
**Exit:** a loop has been dispatched, or (fuller pass) the plan reflects reality
and the top item is unambiguous.

### 2. Continue (build or fix) — multi-round until done
**Trigger:** dispatched by Roadmap. **Input:** the P0 bug, or the top of the
current in-progress slice's queue in `ROADMAP.md`.
Run **try → verify → adjust** as many rounds as it takes to satisfy the item's
*Accept* criteria — this is not "one attempt, ship whatever happened":
1. Pick the item. If it's a bug → `diagnosing-bugs` (build a red-capable repro
   loop before touching code — see that skill for the full discipline); if
   UI/visual → `frontend-design`.
2. `Explore` (or read directly) to locate the code and precedents.
3. Make a change aimed at the item's *Accept* criteria.
4. **Verify live**: rebuild core + docs container, screenshot at 1440px **and**
   390px, check dark + light. If the round touched docs pages, ALSO run
   `DOCS_BASE=/busy-office-ui npm run build -w docs` — the local container
   serves base-less URLs, so a raw `<a href="/x">` (instead of
   `{base + '/x'}`) passes every local check and still 404s on Pages; only
   the base-path build catches it (learned 2026-08-15: 31 such links, 8
   straight red CI runs). Then rebuild plain before the container check.
   Full production parity (interactive layer under the prefix — boost swaps,
   aria-current sync, search, history): copy the DOCS_BASE dist into
   `<scratch>/base-root/busy-office-ui/` and serve base-root on :8082 with
   the same nginx.conf mount; browse `localhost:8082/busy-office-ui/…`
   (github.io itself is browser-blocked in this session). Audited green
   2026-08-15 post-0.1.1.
   If a round adds a new `build:*` step to `packages/core/package.json`,
   verify it against a TRULY clean `dist/` (`rm -rf packages/core/dist &&
   npm run build -w @busy-office/ui`) before trusting it — a local run
   reusing a stale `dist/` from earlier in the session can mask an
   ordering bug that only CI's clean checkout catches (learned 2026-08-15:
   `build:acr` shipped reading `dist/contrast.json` one step before the
   script that writes it, passed locally on stale artifacts, broke CI and
   the Pages deploy the very next wake).
5. **Round check** — does it satisfy *Accept* AND pass the standing gates
   (contrast, named `@container`, links, behaviors, stylelint, tests)? If
   not, adjust and go back to step 3. If a round reveals the item was
   mis-scoped (too big, wrong approach), that's a finding for Roadmap, not a
   reason to ship something that doesn't meet Accept.
6. Once a round passes: `verifier` on the staged diff → commit → tick the
   roadmap box → **record the iteration** (see below).
**Exit:** Accept criteria met and committed. Hands back to the dispatcher for
the next wake (which may pick the next item, or — every 4th round — Standardize).

**Recording an iteration (every loop, after the commit):**
```
python3 scripts/loops/record_iteration.py \
  --loop <Loop> --mode <mode> --item "<what>" --outcome <outcome>
```
This appends the human line to `.roundtable/loop-log.md` **and** inserts the row
into the derived `.roundtable/loops.db`. Capture any measured number too, e.g.
`python3 scripts/loops/record_metric.py --name bundle-gz-kb --value 7.0 --unit kB`.
The markdown/jsonl files are the source of truth; rebuild the DB any time with
`python3 scripts/loops/rebuild_from_log.py`. Query it for prioritization
(`sqlite3 .roundtable/loops.db "select item,count(*) from iterations group by item"`).

### 3. Standardize (DRY, tidy) — multi-round until clean
**Trigger:** dispatched every 4th Continue round, or when a one-off/duplication
is spotted (by Continue, by triage, or by a prior Standardize pass that ran out
of time). Run **try → verify → adjust** rounds until a pass finds nothing left
to consolidate — don't stop after fixing the first thing found if the sweep
surfaced more:
1. Scan for divergence: inline styles that should be tokens/classes, duplicated
   token values or logic (e.g. the same lookup table hand-copied into multiple
   scripts), component pages that break the one-page skeleton, repeated CSS.
2. For a wide sweep, `Workflow` fan-out — one agent per component, report drift.
3. Consolidate to the shared pattern; never widen public API to do it.
4. **Round check** — gates must stay green (stylelint naming is the enforcer);
   `verifier`; commit. Re-scan: did fixing this reveal another instance of the
   same drift, or a different drift? If yes, another round; if the scan comes
   back clean, done.
**Exit:** a clean pass finds nothing to consolidate. Hands back to the
dispatcher.

### 4. Optimize
**Trigger:** dispatched on demand, or when a tracked metric regresses.
1. Measure first: gzip/min bundle size, selector count, specificity hot-spots,
   unused CSS, docs page weight.
2. Pick the biggest win; trim (merge selectors, drop dead rules, lighten the demo).
3. Re-measure — keep only if it moved the number without breaking a gate. Commit with
   before/after in the message.
**Exit:** no win above a set threshold remains.

### 5. Explore (new idea, try & error)
**Trigger:** dispatched when the backlog is empty, or on demand. **Isolated** —
never dirties main.
1. Pull one idea from the *Ideas* list below (or generate one from ERP gaps).
2. Spike it in a **git worktree** (`isolation: worktree`) with `frontend-design`.
3. Evaluate honestly against the brief: does it earn a place? Screenshot it.
4. **Graduate** → hand the result to the Roadmap loop's triage (Step 1) to
   enter the plan; or **discard** → one-line note in the log on *why*, so it
   isn't re-tried blindly.
**Exit:** one idea resolved (kept or killed) per iteration.

### 6. Objective (grill the vision)
**Trigger:** dispatched at a milestone (e.g. pre-1.0), or on demand.
**Heavy — not every wake.**
1. Run `round-table` on the product thesis: *is a CSS-first ERP framework the right
   bet, for whom, versus what?*
2. Evidence gate: a conclusion needs ≥2 independent sources to be `Evidence`, else
   `Hypothesis`; every claim carries counter-evidence.
3. Feed findings back into the Roadmap loop's triage as re-prioritization, not as vibes.
**Exit:** a scored report lands in `.roundtable/`.

---

## Ideas backlog (for Explore)

Seed list — Explore pulls from here or adds to it:
- ~~Keyboard-driven row actions (j/k navigation on dense tables)~~ — spiked
  2026-08-14, mechanics work but a plain `<table>` can't safely take roving
  tabindex without breaking screen-reader table browse mode. Graduated as a
  real milestone (ARIA grid pattern) in ROADMAP.md — don't re-spike the naive
  version; the next attempt starts from `role="grid"`, not a `<table>` hack.
- ~~Skeleton / empty / error states as a first-class component set~~ — shipped
  Slice 6 item 1 (`.bo-skeleton` + `.bo-state`), `/components/state-patterns`.
- ~~A `.bo-composer` (comment + action) for approval threads~~ — shipped
  Slice 6 item 3, lives in `approval-workflow.css` next to `.bo-audit`.
- ~~Inline validation summary that scrolls to the first bad field~~ —
  spiked 2026-08-14 in an isolated worktree (discarded, nothing merged
  directly). Succeeded cleanly: `initValidationSummary()`, zero new CSS
  (the existing `:user-invalid` field styling + `.bo-alert` cover
  everything). Graduated as ROADMAP.md item 19.
- ~~Density-aware icon set sizing~~ — evaluated 2026-08-14, fixed directly
  (small CSS-only change, no worktree needed). Found and fixed one real
  `rem`-vs-`em` mismatch: `.bo-sidebar-nav__icon` stayed a fixed 18px
  across every density tier while its label scaled 13-16px — measured
  live, not assumed. Graduated as ROADMAP.md item 20. Audited the other
  icon-sizing rules in the codebase; none had the same bug.
- ~~RF-scanner / warehouse-scan components~~ — spiked 2026-08-14 in an
  isolated worktree (discarded, nothing merged directly). Scan-input
  mechanics work well and graduated as a real build item (ROADMAP.md Slice
  6 item 9a: `initScanInput()`, zero new CSS). The quantity-stepper piece
  needed nothing — already solved by `.bo-quantity` + `data-density=
  "spacious"` (item 9b). High-contrast turned out to be a pre-existing
  library-wide gap (no `forced-colors` support anywhere), not RF-scanner-
  specific — split into its own item (9c / item 18), don't re-bundle it
  into a future warehouse-screen item.

**Seed list is now exhausted** (2026-08-14) — every idea above has been
spiked/shipped/discarded. Per this playbook's own fallback ("or generate
one from ERP gaps"), the next Explore dispatch generated one from the
Long-term backlog's own "date-field component" note — ~~Date field
(display)~~ spiked, succeeded, graduated as ROADMAP.md Slice 6 item 21.
The deeper prioritization question was answered 2026-08-15 by the
Objective review — run as the project-local design panel
(`.roundtable/grill-slice7-scoping-2026-08-15.md`), NOT `/round-table`
(wrong instrument: that's market/feasibility, not design scoping). Its
output became Slice 9, fully shipped the same day. The next Explore
fallback source, with the Ideas list AND the Long-term backlog now both
exhausted, is new user input or the dogfood loop (extend
`examples/po-app` and feel where it fights — this produced the grouping,
progress, and freeze-graduation rounds).

---

## Operating rules (every loop obeys)

- **New input always goes through Roadmap triage first** (2026-08-14 redesign) —
  even mid-cycle. A bug report or a new ask doesn't get worked directly by
  whatever loop happens to be running; it's classified and entered into
  `ROADMAP.md` (with Accept criteria) before Step 2 dispatches it.
- **Multi-round, not one-shot** (2026-08-14 redesign) — Continue and Standardize
  keep cycling try → verify → adjust within a wake until their exit condition
  (Accept criteria met / clean pass) is actually true, not just once. A round
  that reveals more work is a reason for another round, not an early exit.
- **Verify before commit** — live in the container, both themes, both breakpoints.
  Routine ticks (2026-08-14 user direction): run a **bind-mounted** nginx serving
  `apps/docs/dist` directly (`podman run -d --name bo-docs-run -p 8081:80 -v
  apps/docs/dist:/usr/share/nginx/html:ro -v apps/docs/nginx.conf:/etc/nginx/
  conf.d/default.conf:ro nginx:alpine`) — `npm run build -w @busy-office/ui &&
  npm run docs:build` on the host, nginx picks it up immediately, no image
  rebuild. Do a full `podman build -f apps/docs/Containerfile` (validates the
  whole build path — clean `npm ci`, the Containerfile itself) only at
  checkpoints: a slice closing, or after touching the Containerfile/deps.
- **Gates are the floor** — a loop that reddens a gate isn't done.
- **Small & general over specific** — new work composes existing primitives.
- **Record every iteration** via `scripts/loops/record_iteration.py` (writes the
  markdown log + the `loops.db` mirror). Files are source of truth; the DB is
  rebuildable telemetry.
- **Session-scoped** — these run while this session is open; closing it stops them.
  For durable cloud cadence, promote to `/schedule`.
- **Recognize steady state; don't manufacture busywork** (2026-08-15) — once
  the Ideas seed list AND the Long-term backlog's directly-actionable items
  are genuinely exhausted (checked, not assumed — re-read `ROADMAP.md` fresh
  every wake per the dispatcher's own instructions), further wakes will
  keep finding smaller and smaller things to justify activity: a stale
  checkbox, an ignored lockfile, a doc-count typo. Fixing a REAL one found
  in passing is legitimate (Roadmap hygiene, a clean-room health check, a
  reconciliation pass are all genuine dispatcher duties, not busywork) —
  but the moment a wake starts *searching* for something to fix rather than
  *noticing* one, that's the signal to stop and say so plainly instead of
  escalating the search. State it in the wake's summary — "no new input,
  same blocked state as last N wakes, here's exactly what's still blocking
  progress and why more loop iterations can't close it" — rather than
  silently keeping busy. This is what happened 2026-08-14→15: after Slice
  6/7's directly-buildable items, the Ideas seed list, and 5 Long-term
  bullets (icon-sizing, RTL, theme presets, the 1.0 checklist, the API
  freeze) were all closed via the Explore fallback, the honest and correct
  move was reporting the backlog as dry and naming `/round-table` as the
  actual unblock — not inventing a 6th, 7th, 8th speculative item.
