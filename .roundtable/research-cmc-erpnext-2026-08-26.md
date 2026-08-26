# Research: CoinMarketCap and Frappe/ERPNext — 2026-08-26

Owner wishlist: research `coinmarketcap.com` (+ the Bitcoin detail page) and the
ERPNext demo, *"what is good to bring into this project"*. Triaged into
**Slice 149**.

## Sources, and how much to trust each

| Source | How it was read | Confidence |
| --- | --- | --- |
| `coinmarketcap.com`, `/currencies/bitcoin/` | Both pages fetched directly | High — primary |
| Frappe desk UI | `frappe/public/scss/desk`, 42 SCSS modules, read from source | High — primary, and more precise than clicking a demo |
| `koledigital.erpnext.com/demo` | Landing page only; headless browser stalled at *"Logging In."* for 60s | None — no evidence obtained |
| `demo.erpnext.com` | 404 | None |
| `rbale0831/frappe-erpnext-demo` | Inspected, **not run** — bare fork, 1 commit, 1 star, no demo tooling | n/a |

Standing up MariaDB + Frappe + Redis + workers to obtain evidence available more
precisely from the source stylesheets is 20-60 minutes spent to learn less.

## The finding that mattered was a correction

The first recommendation out of this research was to **build** a
value-against-threshold display. The evidence looked strong: four suite screens
each express one, and each invented its own expression.

| screen | the pair | how it is expressed today |
| --- | --- | --- |
| `prod/capacity` | load vs available | ad-hoc `bucket()` → three tone buckets |
| `inv/stock-on-hand` | on-hand vs reorder point | ad-hoc `short = t < rop` boolean |
| `crm/account` | open exposure vs credit limit | two unrelated `bo-kv` rows |
| `crm/accounts` | the same, as a status | a `Credit hold` badge |

Then the obvious question — *does this already exist?* — found **`bo-progress`**.
It styles the native `<progress>` element, so value/max semantics and the
progressbar role come from the platform. It has `--warning` and `--danger`
variants. Its own source comment says they are for *"threshold states
(approaching / over budget)"* and that it was born from the po-app
budget-consumption dogfood.

It is used on **1 of 27** suite screens (`p2p/purchase-orders`).

**So the gap is adoption, not coverage.** That is a different class of finding
from any of the 21 the suite has produced: every previous one was *"the
framework cannot express this"*. This is the first *"it can, and the screen did
it by hand anyway"* — which the instrument was never built to detect. Recording
that blind spot is worth more than the four conversions it implies.

## The one genuinely uncovered mechanism, and why it is not queued

CMC's strongest numeric idea is the **24h low/high band with the current price
positioned inside it**, plus all-time-high shown as a distance from now.

This is not what `bo-progress` does. Progress runs 0→max, where zero is
meaningful and the fill measures consumption. A range **positions a value
between two bounds** where zero is not on the scale at all.

One plausible ERP use exists (a stock min/max band). One use is not evidence —
the same bar that refused the lot-trace genealogy graph. Condition recorded in
149.2: build when a second, different screen needs it.

## Where this framework already beats the reference

**CoinMarketCap signals gain and loss with colour alone**, on the most important
number on the page — a WCAG 1.4.1 failure on one of the most-visited financial
sites in the world. Frappe's indicator dots do the same thing.

This framework has forbidden that from the start; every state signal is
two-channel. Recorded here as evidence for the owner's *references are floors*
rule, and **deliberately kept out of the docs** (149.3): naming a third party's
accessibility failure on a component page is unkind and perishable — they may
fix it tomorrow — and *"we beat X"* is not what a person reading the badge page
came for.

## Refused, with reasons

- **Sparklines / row trend.** Direct precedent: the `prod/capacity` heatmap was
  refused for the same reason. No `bo-scale` utility ships, and this is data-viz.
- **Column chooser.** `__col--secondary`/`--tertiary` is the better ERP answer —
  the designer ranks importance once, rather than every user configuring a
  personal view.
- **Number abbreviation** (`$1.56T`). CMC can abbreviate because market cap needs
  no precision. An ERP amount is auditable; abbreviating an invoice total is a
  defect dressed as a feature.
- **Gantt charts, onboarding tours, product tours** (Frappe). App concerns, not
  CSS-framework ones.
- **Group-by with counts** (Frappe `list_sidebar`, the last surviving candidate).
  Closes: `/patterns/filter-panel` already has a section headed *"Why the count
  on the trigger matters"* and demos `Cost centre (2)`.

## A probe that was wrong first — third instance today

The initial Frappe sweep searched component class **names** and reported
`workflow`, `comment`, `kanban` and `indicator` as MISSING. All four exist here
under different names: `approval-workflow`, `bo-composer`, `patterns/kanban`,
and `bo-badge` + `data-tone`.

A naming-derived probe over a framework that names things well is a detector
that cannot pass. Had it gone into a summary unchecked it would have produced a
confident list of seven gaps, none of them real — the exact failure mode
CLAUDE.md records under *"a number you report is load-bearing"*.

The same instinct is what caught the `bo-progress` error above, one step later.
