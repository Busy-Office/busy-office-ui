# Loop log

Source of truth for loop iterations. `loops.db` is a **derived mirror** — rebuild
it any time with `python3 scripts/loops/rebuild_from_log.py`. New lines are written
by `scripts/loops/record_iteration.py`. See `LOOPS.md` for the playbooks and router.

**Line format:** `- <YYYY-MM-DD HH:MM> · <loop> · <mode> · <item> · <outcome> · <commit>`

- 2026-08-13 00:00 · Continue · build · responsive nav drawer (mobile) · shipped · -
- 2026-08-13 00:00 · Continue · build · fixed header + independent panes + full-width landing · shipped · -
- 2026-08-13 00:00 · Roadmap · plan · folded backlog into Slice 5 · committed · -
- 2026-08-13 00:00 · Meta · meta · designed the six-loop system (LOOPS.md) · committed · -
- 2026-08-13 00:00 · Meta · meta · loops.db telemetry mirror + record/rebuild scripts · committed · -
- 2026-08-13 22:39 · Continue · bug · dark-theme text flash on theme switch (P0) · fixed; push pending (GitHub 500) · d18f756
