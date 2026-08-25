# Suite score — the screen ledger

Source of truth for scoring the ERP-suite screens (roadmap 145). Same shape as
`polish-state.md`, so `polish_requeue.py --check/--apply/--stamp` works on it
unchanged — a screen re-enters the queue when its `.screen.mjs` moves, never on
a timer.

**Two dimensions, not three.** `ux` was dropped by its own Accept test: it read
5/5 on all 28 screens, one distinct value. Its five checks were BINARY — a
caption is present or it is not — and a binary property belongs in a gate,
enforced once, not in a rubric re-confirming it 28 times. They moved into
`audit.mjs` (roadmap 145.1).

- **functionality** — the fraction of what a screen's KIND owes that is
  present. Scored against the kind, never across kinds: a list screen has zero
  form fields and that is not a deficiency.
- **performance** — distance from the suite's own markup line
  (`own ≈ 68.7 + 1.26 × facts`, residual sd
  17.9). Within one sd is ordinary; beyond two is an outlier. Not a
  budget: an absolute budget cannot tell a RICH screen from a BLOATED one
  (roadmap 145.2).

**Scores are computed, rounds are earned.** `node examples/erp-suite/score.mjs`
recomputes the two numbers from the built screens; the `rounds`, `dry` and
`status` columns are ledger state a round writes. Seeded 28 screens on
2026-08-26.

**Budgets:** screens get **3 rounds** as a CEILING, not a quota. Two consecutive
rounds that fail to move a score mark a screen `dry` and forfeit the rest.

| surface | dimension | score | rounds | dry | src | status |
|---|---|---|---|---|---|---|
| screen/prod/capacity | functionality | 1 | 0/3 | 0 | ddc3152e | seeded — owes 2/4; a total or a summary row; a way to take it away |
| screen/fin/trial-balance | functionality | 2 | 0/3 | 0 | f13aaffa | seeded — owes 3/4; emphasis on what matters |
| screen/prod/production-orders | functionality | 2 | 0/3 | 0 | 1cd0779e | seeded — owes 3/4; a way to narrow the set |
| screen/crm/accounts | functionality | 2 | 0/3 | 0 | 18607160 | seeded — owes 3/4; a way to narrow the set |
| screen/crm/opportunities | functionality | 2 | 0/3 | 0 | 9df4fe48 | seeded — owes 3/4; a way to narrow the set |
| screen/inv/stock-on-hand | functionality | 2 | 0/3 | 0 | bd2d8d46 | seeded — owes 3/4; a total or a summary row |
| screen/o2c/customer-invoices | functionality | 2 | 0/3 | 0 | 63084c2b | seeded — owes 3/4; a way to narrow the set |
| screen/o2c/sales-orders | functionality | 2 | 0/3 | 0 | 2631ee9c | seeded — owes 3/4; a way to narrow the set |
| screen/p2p/vendor-invoices | functionality | 2 | 0/3 | 0 | b97b03e5 | seeded — owes 3/4; a way to narrow the set |
| screen/crm/account | performance | 2 | 0/3 | 0 | e2d25639 | seeded — owes 4/4; markup +19 vs the line |
| screen/fin/journal-entry | performance | 2 | 0/3 | 0 | 201a7c47 | seeded — owes 4/4; markup -20 vs the line |
| screen/fin/period-close | performance | 2 | 0/3 | 0 | eed43768 | seeded — owes 4/4; markup -19 vs the line |
| screen/inv/lot-trace | performance | 2 | 0/3 | 0 | 7583ed94 | seeded — owes 4/4; markup -22 vs the line |
| screen/p2p/convert-to-po | performance | 2 | 0/3 | 0 | 5de7975d | seeded — owes 4/4; markup +20 vs the line |
| screen/p2p/purchase-order | performance | 2 | 0/3 | 0 | d8dd743e | seeded — owes 4/4; markup +36 vs the line |
| screen/p2p/purchase-orders | performance | 2 | 0/3 | 0 | 5bb2ae0c | seeded — owes 4/4; markup +33 vs the line |
| screen/prod/bom | performance | 2 | 0/3 | 0 | cb0c2df8 | seeded — owes 4/4; markup -19 vs the line |
| screen/crm/opportunity | functionality | **3** | 0/3 | 0 | c212e936 | seeded — owes 4/4; markup +6 vs the line |
| screen/fin/ar-aging | functionality | **3** | 0/3 | 0 | e1b8cdb7 | seeded — owes 4/4; markup -1 vs the line |
| screen/index | functionality | **3** | 0/3 | 0 | b5a7489c | seeded — owes 4/4; markup -3 vs the line |
| screen/inv/cycle-count | functionality | **3** | 0/3 | 0 | ed8e5e6f | seeded — owes 4/4; markup -8 vs the line |
| screen/inv/stock-movement | functionality | **3** | 0/3 | 0 | e4ab572d | seeded — owes 4/4; markup -16 vs the line |
| screen/o2c/customer-invoice | functionality | **3** | 0/3 | 0 | e88ece18 | seeded — owes 4/4; markup +1 vs the line |
| screen/o2c/sales-order | functionality | **3** | 0/3 | 0 | e3bf9572 | seeded — owes 4/4; markup +4 vs the line |
| screen/p2p/requisition | functionality | **3** | 0/3 | 0 | aa391520 | seeded — owes 4/4; markup +3 vs the line |
| screen/p2p/requisitions | functionality | **3** | 0/3 | 0 | 48091bf9 | seeded — owes 4/4; markup +8 vs the line |
| screen/p2p/vendor-invoice | functionality | **3** | 0/3 | 0 | ab90a32c | seeded — owes 4/4; markup +15 vs the line |
| screen/prod/production-order | functionality | **3** | 0/3 | 0 | 2f93a9db | seeded — owes 4/4; markup +15 vs the line |
