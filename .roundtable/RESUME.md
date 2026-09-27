# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md`** — the git/build traps and the
> toolchain that works; this file used to hold that too (roadmap 169.3).
> `LOOPS.md` Step 0 names both. Three advisory checks run from
> `record_iteration.py` (the charter check, `check:resume-slice-ids`,
> `polish_requeue.py --verify-stamps`); all REPORT, none fails a build
> (roadmap 175.3). Run them fresh rather than trusting a stale reading.

The wake prompt says *"don't assume prior-turn state"*; this file is how a wake
picks up mid-flight work across a context clear. **Rewritten wholesale every
wake; clear In flight/Uncommitted the moment a slice lands.** Cite by slice
number, never `ROADMAP.md:NN` — a line number survives no rewrite.

---

## In flight

Nothing. `inflight.py status` reads exit 0.

## Uncommitted

Nothing. Working tree clean at HEAD, main's CI green. The owner's own
uncommitted work of 2026-09-20 is parked on `park/owner-checkpoint-2026-09-20`
(`a9a2d9bb`, decision O2); pushing/merging it is the owner's call.

## Next rule

- **Where this wake is running:** if this is a LOCAL wake, it was restarted —
  **the local `/loop` was stopped 2026-09-27** (owner: "pause the loop and
  schedule"); the cloud routine `⚡ Busy Office UI loop wake`
  (`trig_019aw8tDjiYxC3ejSFd5wYZY`) is `enabled: true` instead, cron
  `27 * * * *` (hourly), cloud-adapted (no Podman there; runs
  `check:claims`/`test:axe`/`check:layout -w docs` via `serve-dist.mjs`,
  pushes once at the end or not at all). That routine's prompt predates the
  Jev CLI, so it skips Jev — UNVERIFIED per `LOOPS.md`, not a failure.
- **Step 0:** `step0_guard.py`, `inflight.py hold`, `dispatch_status.py` (a
  REFUSED milestone line stops the wake). Read CI for main's HEAD first; red
  main is rule 1.
- **No standing GOAL.** M1 stays DRAFT.
- **Rule 2 (Standardize) is OVERDUE — 5/4 rounds, 241 changed lines** (past
  421.3's 50-line gate). **Next wake's pick**: isolated worktree sweep, base
  Slice 424.
- **Rule 3 (Objective) is 2/3**, not due; [389, 421] armed.
- **Rule 4's queue, oldest-first, unblocked:** 389.3, 391.1, 392.2, 392.3,
  393.11, … — re-run `sqlite3 .roundtable/loops.db "select item_id, title
  from roadmap_items where blocked=0 and after_open='' and parked_held=0
  order by cast(slice as int), item_id limit 8"`, never trust a cached list.
- **`387.2` DECIDED, NOT BUILT.** Ladder chose a top-layer `popover="manual"`
  message (Jev `jev-1.13.0` a=1.0 agreeing). A build attempt shipped working
  CSS/JS (verified live) but not the actual frozen-row escape, and was fully
  reverted — nothing shipped. Trap for the next attempt: `editable-grid.astro`'s
  FIRST `<script>` block is a JS template-literal STRING for the "Markup"
  sample and never executes; wire `initCellMessages()` into the SECOND, real
  block instead.
- **RF-essentials budget raised 41→42kb this session** (ladder, Jev a=1.0) to
  ship 389.16+389.19+389.23. Real headroom, **measured on the built file**:
  487 bytes. The next claim must argue and measure its own.
- **Hourly-loop design (Slice 417) mostly unbuilt.** 417.1 (multi-line
  `inflight.py`) landed, limit still 1. 417.2-417.6 open, in order. Design:
  `.roundtable/hourly-loop-design-2026-09-27.md`.
- **421.1-421.3 live**: `record_iteration.py --value shipped|evidence|process`;
  `dispatch_status.py` prints a 10-wake tally + process-streak (N=3 should
  trigger a planner run — reading exists, the run itself is not wired);
  Standardize/Objective need row count AND changed lines to fire OVERDUE.
- **A `Track:` marker's indentation can desync `loops.db` silently** — run
  `generate_status.py` after any manual edit near a marker line, not just
  after `record_iteration.py`; it caught exactly this once this session.
- **Jev via the `jev` CLI only** (never `mcp__jev__*`); exit 0/3/4 only, else
  UNVERIFIED. **Ladder used 3x this session** (413.1, 387.2's design, the RF
  budget), my verdict first each time, Jev agreeing a=1.0 each time; none
  reached the owner. Never delegated: publish, outside replies, keys/`jev
  allow`/plugin config, spend caps, irreversible deletion, the ladder itself.

## Direction — 2026-09-27

Owner decisions still open (O0-O8), the wake-card adoption question, and this
session's full work log are archived verbatim in `.roundtable/resume-history.md`
(2026-09-27 entry) — recommendations with re-measured evidence for the O-items
are in `.roundtable/owner-recs-2026-09-26.md`. Not touched this session; the
ladder's calls were reversible engineering decisions, not these.

History lives in `.roundtable/resume-history.md` (`393.8`), never here.
