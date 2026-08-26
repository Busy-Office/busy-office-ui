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
| screen/prod/capacity | functionality | **3** | 0/3 | 0 | ddc3152e | owes 4/4; markup -9 vs the line |
| screen/fin/trial-balance | functionality | **3** | 0/3 | 0 | f13aaffa | owes 4/4; markup -34 vs the line |
| screen/prod/production-orders | functionality | **3** | 0/3 | 0 | 1cd0779e | owes 5/5; markup -15 vs the line |
| screen/crm/accounts | functionality | **3** | 0/3 | 0 | 18607160 | owes 5/5; markup +10 vs the line |
| screen/crm/opportunities | functionality | **3** | 0/3 | 0 | 9df4fe48 | owes 5/5; markup +5 vs the line |
| screen/inv/stock-on-hand | functionality | **3** | 0/3 | 0 | bd2d8d46 | owes 4/4; markup -16 vs the line |
| screen/o2c/customer-invoices | functionality | **3** | 0/3 | 0 | 63084c2b | owes 4/4; markup 0 vs the line |
| screen/o2c/sales-orders | functionality | **3** | 0/3 | 0 | 2631ee9c | owes 5/5; markup +15 vs the line |
| screen/p2p/vendor-invoices | performance | 2 | 0/3 | 0 | d88b63d9 | owes 5/5; markup +18 vs the line |
| screen/crm/account | performance | 2 | 0/3 | 0 | e2d25639 | owes 4/4; markup +21 vs the line |
| screen/fin/journal-entry | functionality | **3** | 0/3 | 0 | 201a7c47 | owes 4/4; markup -17 vs the line |
| screen/fin/period-close | functionality | **3** | 0/3 | 0 | eed43768 | owes 4/4; markup -17 vs the line |
| screen/inv/lot-trace | functionality | **3** | 0/3 | 0 | 7583ed94 | owes 4/4; markup -20 vs the line |
| screen/p2p/convert-to-po | functionality | **3** | 0/3 | 0 | 5de7975d | owes 4/4; markup +11 vs the line |
| screen/p2p/purchase-order | performance | 1 | 1/3 | 1 | d8dd743e | round 1 — **explained, not a defect. Do not "fix" by removing content.** +35 over the line is a discussion thread (35 nodes / 12 facts), a second timeline and a composer, which no other screen carries. The fit is one straight line and structurally rich content sits above it by arithmetic. Three Polish rounds flagged the screens doing MORE, never ones wasting markup. |
| screen/p2p/purchase-orders | performance | 2 | 1/3 | 1 | 5bb2ae0c | round 1 — **dry, no bloat.** The only list with a footer and pagination, which 312 records need and no other list has. |
| screen/prod/bom | functionality | **3** | 0/3 | 0 | cb0c2df8 | owes 4/4; markup -17 vs the line |
| screen/crm/opportunity | functionality | **3** | 0/3 | 0 | c212e936 | owes 4/4; markup +10 vs the line |
| screen/fin/ar-aging | functionality | **3** | 0/3 | 0 | e1b8cdb7 | owes 4/4; markup +1 vs the line |
| screen/index | functionality | **3** | 0/3 | 0 | b5a7489c | owes 4/4; markup +2 vs the line |
| screen/inv/cycle-count | functionality | **3** | 0/3 | 0 | ed8e5e6f | owes 4/4; markup -13 vs the line |
| screen/inv/stock-movement | functionality | **3** | 0/3 | 0 | e4ab572d | owes 4/4; markup -12 vs the line |
| screen/o2c/customer-invoice | functionality | **3** | 0/3 | 0 | e88ece18 | owes 4/4; markup +4 vs the line |
| screen/o2c/sales-order | functionality | **3** | 0/3 | 0 | e3bf9572 | owes 4/4; markup +6 vs the line |
| screen/p2p/requisition | functionality | **3** | 0/3 | 0 | aa391520 | owes 4/4; markup -16 vs the line |
| screen/p2p/requisitions | functionality | **3** | 0/3 | 0 | 48091bf9 | owes 5/5; markup 0 vs the line |
| screen/p2p/vendor-invoice | performance | 2 | 0/3 | 0 | ab90a32c | owes 4/4; markup +17 vs the line |
| screen/prod/production-order | functionality | **3** | 0/3 | 0 | 2f93a9db | owes 4/4; markup +13 vs the line |
