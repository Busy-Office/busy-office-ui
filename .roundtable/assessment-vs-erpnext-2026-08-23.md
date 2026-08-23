# Where we stand against ERPNext (UX/UI) — 2026-08-23

Owner asked for a score. Written down because the calibration it produced is
load-bearing for Slice 130, and because it is the kind of judgement that
should be reviewable rather than re-derived from memory each time.

**Caveat on sourcing**: this is from model knowledge of ERPNext around
v15/v16, not verified against their current release. Treat any specific
feature claim as needing a check before it is quoted at anyone.

## The comparison is only meaningful on some axes

ERPNext is a complete ERP *product* — data model, business logic, workflow
engine, permissions, thousands of DocTypes. This is a CSS-first UI framework
with no data and no logic. On "is this an ERP" we score zero and always will.
Any single aggregate number across both would be dishonest.

| Axis | Us | ERPNext |
|---|---|---|
| Accessibility rigor | 9 | 3 |
| State signalling (two-channel) | 9 | 4 |
| Density & responsive model | 8 | 5 |
| Docs quality for builders | 9 | 4 |
| No-JS / degradation | 8 | 2 |
| Screen-shape coverage | 6 | 9 |
| Document-flow surfaces | 3 | 9 |
| Field-proven at scale | 2 | 10 |

## The finding that matters

**Every gap the P2P pilot found is something ERPNext has shipped for years.**

- GAP-2 / GAP-9 (related documents, sources→result) — ERPNext's
  Connections/Links tab is on every document, generated. We have nothing.
- GAP-8 / GAP-12 (document conversion, add-a-line) — "Create → Purchase
  Order" from a requisition, and "Get Items From", are everyday ERPNext.
- GAP-10 (derived totals) — their forms recompute live as a matter of course.
- List views — saved filters, group-by sidebar, and one list switchable
  between List / Report / Kanban / Gantt / Calendar. We shipped saved views
  on 2026-08-23; view-type switching we do not have at all.

Seven of thirteen gaps map onto features a mature ERP treats as table stakes.
That convergence is the strongest evidence so far that the example app is a
working instrument rather than a demo.

## Where we are genuinely ahead, and why

Not luck — these are the properties we chose to GATE. axe over 121 pages at
two widths on every build; two-channel state signals; forced-colors and
reduced-motion proven under emulation rather than assumed; WCAG 1.4.12
spacing; RTL flips with their own detector. Add the no-JS floor (our screens
are forms that post; theirs require JavaScript to exist), the density token
system, docs generated from the shipped artifact with 107 executable claims,
and the RF work at a Chrome-108 floor under a byte budget.

## The strategic point, which outlives the score

ERPNext's UI is **generated from metadata**. That is why it covers everything,
and why a purchase order looks like a journal entry looks like a customer.
Our bet is the opposite: hand-shaped screens that fit their job, which is why
list-report and the RF screens are better than their equivalents and why we
have only 38 shapes.

**That bet only pays off if we close the document-flow gaps**, because those
are exactly the shapes generation gives you for free. A hand-shaped catalogue
that cannot express "this document came from those documents" loses to a
generated one that can, on the axis users actually feel.

Score for what we are — a framework someone builds an ERP with: **7/10**.
As something to run a business on: not comparable, and not the goal.
