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
- 2026-08-13 23:06 · Continue · build · ERP Amount component (money/quantity/UOM, two-channel signs) · shipped · e8f2de0
- 2026-08-13 23:25 · Continue · build · data-table column alignment (--left/center/right) + fix latent --numeric specificity bug · shipped · 6afe400
- 2026-08-13 23:52 · Continue · build · Cmd/Ctrl+K command palette (Pagefind dialog, arrow-nav, theme-aware) · shipped · c46b8ea
- 2026-08-13 23:56 · Continue · bug · sidebar scroll-position persistence (active item always visible) · fixed · c21ee5c
- 2026-08-14 00:05 · Continue · build · Brand palette: Ledger teal accent (gate-validated both themes) · shipped · 5bb5c16
- 2026-08-14 00:30 · Continue · build · SVG logo (ledger-record mark, theme-aware teal, 16px navbar) · shipped · 5db529d
- 2026-08-14 00:53 · Continue · build · favicon (ledger-record mark, filled/inverse) + logged top long-term bets · shipped · 9ee1286
