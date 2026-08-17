# Grill — owner wishlist (2026-08-18)

Four requests, tested against the Objective (simplicity / less-for-more /
reusability) and, more importantly, against **what already ships**. Every
verdict below is measured on the built artefact, not recalled.

Headline: **two of the four are already built and unproven rather than missing,
and the fourth was already decided against in writing — but the alternative that
decision promised was never written.**

---

## W1 — Scrollable slider tabs → **RETHINK** (accept a smaller version)

`.bo-tabs__list` already sets `overflow-x: auto` with a thin scrollbar, and the
CSS carries the comment *"8-10 tabs in a narrow container scroll rather than
clip."*

So the mechanism ships. What does not:

- **It is never demonstrated.** The docs demo has **3 tabs**; measured at 390px,
  `scrollWidth === clientWidth === 342` — it cannot scroll, so no reader has
  ever seen the behaviour the comment claims.
- **It has no affordance.** No edge fade, no scroll buttons, no
  `scroll-snap-type`, and nothing scrolls the *selected* tab into view. A tab
  bar that overflows with no visual hint reads as a tab bar with fewer tabs.

**Refuse:** a new "slider tabs" component. The scroll container is one
declaration that already exists; wrapping it in a component would add public
surface for nothing.

**Accept:** prove and afford the existing one — a demo with enough tabs to
overflow, an edge fade so the overflow is visible, and scroll-selected-into-view
so keyboard arrow navigation cannot move focus off-screen. Target cost: **0 new
components, ≤1 new selector.**

Open question for the owner: were you asking for *arrow buttons* specifically?
Buttons are a real accessibility improvement on desktop (a trackpad user can
swipe; a mouse user often cannot) and would push this past 1 selector. Worth
saying yes to deliberately rather than by accident.

---

## W2 — Typed field editor (`description | value`) → **ACCEPT as a pattern, REFUSE as a component**

The sample — Name / DOB / Age / Amount / Qty down the rows — is not a table of
records. It is a **field list**: one row per field, each with a different input
type. That is the SM30 master-data case, and it is the single best screen for
showing every typed input at once.

Every piece already ships: `.bo-kv` (key-value facts), M1 row-swap inline edit
(`initRowEdit()`, `/components/inline-editing`), and the typed inputs
`.bo-amount`, `.bo-date`, `.bo-quantity`, `.bo-input`.

**Refuse:** a new "advanced editable table" component. **Accept:** a documented
pattern composing what exists, with **cost line 0 new selectors** as the pass
condition — if it cannot be built from existing primitives, that failure is
itself the finding and the item comes back for rethink.

Genuine value beyond the demo: putting five input types in one narrow column is
the most likely place for real alignment, baseline and density bugs to surface.
I expect this to find defects, which is a reason to do it.

---

## W3 — Many columns (10 × 50) → **ACCEPT as a stress case, with a caveat**

`.bo-data-table` already ships horizontal scroll, a sticky header, **and** a
sticky first column. 50 columns is therefore not a feature request; it is a
**stress test of a claim already made**, and this project's own history says
untested claims are where the bugs are.

Concrete things a 50-column table is likely to break, none of which are covered
today: the sticky-column boundary under horizontal scroll, keyboard reachability
of the far columns, SC 2.5.8 target sizes in dense header cells, and the layout
gate's 150%-zoom pass.

**Caveat worth stating plainly:** in ERP practice, 50 visible columns is usually
a *symptom*, not a requirement — the real answer is a column chooser plus saved
views, so each user sees the twelve columns they need. If we ship a beautiful
50-column demo without saying that, we quietly endorse the anti-pattern. The
item should therefore carry the column-chooser guidance as part of its Accept,
not as a follow-up.

---

## W4 — 50,000 records with client-side buffering → **REFUSE the engine, ACCEPT the recipe that was already promised**

This one already has a written decision. `DESIGN.md`, "Data maintenance: four
patterns, no grid" (2026-08-17):

> Residual grid cases are real but rare… Those get a **token-themed AG Grid
> recipe** in the docs, never a grid engine of our own: owning virtual scroll and
> cell editing would double the maintenance surface for a solved problem.

Building client-side row buffering *is* owning virtual scroll. It is the exact
thing that decision refused, and the reasoning has not changed: it is a solved
problem with mature implementations, and a hand-rolled virtualizer also breaks
the accessibility story (a windowed table needs `aria-rowcount`/`aria-rowindex`
handled correctly or screen readers report the wrong size, silently).

**But the grill found the real gap: that promised recipe does not exist.**
Verified — no page in `apps/docs/src/pages/` mentions AG Grid at all. The
framework declined to build virtualization and then never wrote down what to do
instead, so a consumer hitting 50k rows today gets no answer from us.

What *does* ship for large lists, and is the right answer for most of them:
server-side pagination, and load-more batching with an `IntersectionObserver`
(documented on `/components/pagination`). Fixed row heights are already
maintained deliberately to keep rows "virtualization-friendly" (`DESIGN.md:56`),
so a third-party virtualizer drops in cleanly.

**Accept:** write the recipe — when to page, when to load-more, when to reach
for a real grid, and a token-themed AG Grid setup so it inherits the design
system. **Refuse:** a `.bo-*` virtual scroller.

Question back to the owner, because it changes the answer: are the 50,000 rows
something a user **reads/scrolls**, or something they **search and act on**? If
it is the latter — which it almost always is in ERP — the honest fix is better
filtering and server paging, and no virtualization is needed at all.

---

## Summary

| | Request | Verdict | Why |
|---|---|---|---|
| W1 | Scrollable tabs | **Rethink** | Mechanism ships; undemonstrated (3-tab demo never overflows) and unaffordanced |
| W2 | Typed field editor | **Accept as pattern** | Composes `.bo-kv` + row-edit + typed inputs; 0 new selectors is the pass condition |
| W3 | 10 × 50 columns | **Accept as stress case** | Tests sticky-column/zoom/keyboard claims; must carry column-chooser guidance |
| W4 | 50,000 rows | **Refuse engine / accept recipe** | Already decided in DESIGN.md; the promised AG Grid recipe was never written |

Two of four are "prove what we claim" rather than "build something new", which
is the healthiest possible outcome of a wishlist grill — and W4's gap (a
documented decision with no documented alternative) is the kind of thing only a
grill against the artefact finds.
