# busy-office-ui — Loop System

Autonomous work runs as **loops**: a loop wakes on a cadence, does one focused
iteration (**try → verify → adjust → commit**), then re-arms. Each loop type has a
different *job*, and each orchestrates the skills/agents that job needs. This file
is the playbook — what starts a loop, what it runs, and how it hands off.

One loop is the **host** at a time (default: Continue). The host follows the
**router** below to decide which loop's playbook this iteration actually runs, so a
P0 bug or an empty backlog automatically switches mode without a human. Any loop can
also be invoked on demand: `/loop <type> …`.

---

## The six loops

| Loop | Job (one line) | Cadence | Primary skills / agents |
|------|----------------|---------|-------------------------|
| **Continue** | Build the next backlog item, verified | every 20 min | `frontend-design`, `diagnosing-bugs`, `Explore`, `verifier` |
| **Standardize** | DRY + tidy: one pattern, no one-offs | every 4th iteration, or on drift | `Explore`, `stylelint` gate, `verifier`, `Workflow` fan-out |
| **Optimize** | Smaller, faster, lower-specificity | on demand / at size regressions | build metrics, `Explore` |
| **Explore** | Find & spike a *new* idea (try/error) | when backlog empties, or on demand | `frontend-design`, `Plan`, worktree isolation |
| **Roadmap** | Re-prioritize & groom the plan | daily-ish / after Explore | `Plan`, `domain-modeling` |
| **Objective** | Grill the product *vision* | at milestones / on demand | `round-table` (rt-*), project panel |

---

## Router — what the host runs each wake

Evaluate top-to-bottom; run the first that matches.

1. **Open P0 bug?** → **Continue** in *bug mode* — invoke `diagnosing-bugs`, fix,
   add a regression gate, commit. (Broken state always wins.)
2. **Build item queued?** → **Continue** in *build mode* — see its playbook.
3. **4+ build iterations since last tidy, or drift flagged?** → one **Standardize**
   mini-pass before the next build.
4. **Backlog empty?** → **Explore** one idea, then **Roadmap** to triage the result
   into the plan.
5. **Milestone reached / user asked?** → **Objective** grill.

The host records each iteration with `scripts/loops/record_iteration.py`, which
writes both the human line in `.roundtable/loop-log.md` and a row in the derived
`.roundtable/loops.db` mirror — so the trail is both readable and queryable.

---

## Playbooks

### 1. Continue (improvement) — the default host
**Trigger:** every 20 min. **Input:** top of the current in-progress slice's queue
in `ROADMAP.md` (whichever slice is under "## In progress" — Slice 6 as of
2026-08-14; the Roadmap loop opens the next slice when one completes).
1. Pick the top item. If it's a bug → `diagnosing-bugs`; if UI/visual → `frontend-design`.
2. `Explore` (or read directly) to locate the code and precedents.
3. Make the smallest change that satisfies the item's *Accept* criteria.
4. **Verify live**: rebuild core + docs container, screenshot at 1440px **and** 390px,
   check dark + light.
5. Adjust until it passes the standing gates (contrast, named `@container`, links,
   behaviors, stylelint, tests).
6. `verifier` on the staged diff → commit → tick the roadmap box → **record the
   iteration** (see below).
**Exit:** queue empty → hand to Explore.

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

### 2. Standardize (DRY, tidy)
**Trigger:** every 4th Continue iteration, or when a one-off/duplication is spotted.
1. Scan for divergence: inline styles that should be tokens/classes, duplicated token
   values, component pages that break the one-page skeleton, repeated CSS.
2. For a wide sweep, `Workflow` fan-out — one agent per component, report drift.
3. Consolidate to the shared pattern; never widen public API to do it.
4. Gates must stay green (stylelint naming is the enforcer); `verifier`; commit.
**Exit:** a clean pass finds nothing to consolidate.

### 3. Optimize
**Trigger:** on demand, or when a size/perf metric regresses.
1. Measure first: gzip/min bundle size, selector count, specificity hot-spots,
   unused CSS, docs page weight.
2. Pick the biggest win; trim (merge selectors, drop dead rules, lighten the demo).
3. Re-measure — keep only if it moved the number without breaking a gate. Commit with
   before/after in the message.
**Exit:** no win above a set threshold remains.

### 4. Explore (new idea, try & error)
**Trigger:** backlog empty, or on demand. **Isolated** — never dirties main.
1. Pull one idea from the *Ideas* list below (or generate one from ERP gaps).
2. Spike it in a **git worktree** (`isolation: worktree`) with `frontend-design`.
3. Evaluate honestly against the brief: does it earn a place? Screenshot it.
4. **Graduate** → write it up for the Roadmap loop; or **discard** → one-line note in
   the log on *why*, so it isn't re-tried blindly.
**Exit:** one idea resolved (kept or killed) per iteration.

### 5. Roadmap (review & plan)
**Trigger:** after an Explore graduation, or ~daily.
1. Reconcile `ROADMAP.md`: done vs pending, re-rank by value × effort.
2. Split oversized items, merge dupes, write *Accept* criteria for anything missing.
3. Record any real architecture decision via `domain-modeling` (ADR). Commit.
**Exit:** the plan reflects reality and the top item is unambiguous.

### 6. Objective (grill the vision)
**Trigger:** at a milestone (e.g. pre-1.0), or on demand. **Heavy — not every wake.**
1. Run `round-table` on the product thesis: *is a CSS-first ERP framework the right
   bet, for whom, versus what?*
2. Evidence gate: a conclusion needs ≥2 independent sources to be `Evidence`, else
   `Hypothesis`; every claim carries counter-evidence.
3. Feed findings back into the Roadmap loop as re-prioritization, not as vibes.
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
- Inline validation summary that scrolls to the first bad field.
- Density-aware icon set sizing.
- **RF-scanner / warehouse-scan components** (2026-08-14 user direction) — GR/GI
  screens driven by a handheld scanner: large-target scan-input (auto-focus,
  auto-advance on a terminator char), big-number quantity stepper,
  high-contrast/high-density warehouse-floor variants. Different enough
  interaction model to need a try/error pass before committing to an API —
  see ROADMAP.md Slice 6 item 9.

---

## Operating rules (every loop obeys)

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
