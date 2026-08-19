# Explore spike — SAP Object Page floorplan (2026-08-19)

Dispatched by rule 6 (backlog empty: every remaining item is owner-blocked).
Spiked in an isolated worktree; **nothing merged**. Source: owner input, triaged
as Slice 48, which was stalled on a scope question — *whole floorplan, or just
the anchor bar?* This answers it with evidence instead of asking twice.

## Verdict: **graduate**, and the answer is "neither is expensive"

The object page composes from primitives that already ship. **Zero new CSS.**
The only genuinely new thing is one ~20-line behavior.

## Slice 48's own gap table was wrong — corrected here

| region | Slice 48 said | actually |
|---|---|---|
| sections / facets | yes | yes — `.bo-widget` |
| key facts strip | yes | yes — `.bo-kv` + `.bo-badge` + `.bo-amount` |
| **page-level footer action bar** | **no** | **ALREADY SHIPS** — `.bo-form-actions` is `position: sticky`, `inset-block-end: 0`, print-suppressed, and sets `scroll-padding-block-end: 6rem` so focus never lands under it |
| sticky object header | no | `.bo-widget` + one `position: sticky` declaration |
| anchor bar with scroll-spy | no | `.bo-sidebar-nav` **unmodified** — it already styles `[aria-current="page"]`, which is exactly the active marker. Needs a behavior, not CSS |

I wrote "page-level footer action bar: no" into the triage from an impression.
`detail-form`'s own anatomy names it as sticky. Checking the CSS took one grep.

## The predicted "rethink" was right about the shape, wrong about the reason

Slice 48 predicted the anchor bar would turn out to be `.bo-tabs--vertical` plus
scroll-spy. It is a **behavior, not a component** — that half was right. But it
is not tabs: **tabs hide the panels they are not showing**, and an object page is
one continuous scroll where every section stays present. Vertical tabs are the
wrong instrument regardless of scroll-spy.

## What the spike found that reading could not

**1. Two sticky regions collide.** With the header and the anchor bar each
`position: sticky; inset-block-start: 0`, both pinned to the *same* offset —
measured at 77px (1440) and 181px (390), overlapping in all four contexts. The
fix is one sticky WRAPPER around both, not two sticky elements. That is a
documentation point a consumer will hit immediately, and it is invisible until
measured.

**2. `IntersectionObserver` + `rootMargin` is the wrong scroll-spy.** The first
version used `rootMargin: '-30% 0px -60% 0px'`. At 1440 it worked; **at 390 it
marked `#items` after jumping to `#delivery`**, and on load *no* link was
current at any width. Those margins are a guess about viewport shape.

Measuring works and is viewport-independent: the current section is the last one
whose top has passed below the sticky chrome's own bottom edge. After the
change, all four contexts read `#general` on load and `#delivery` after the jump.

**3. The bar is vertical, and the Fiori idiom is horizontal.** `.bo-sidebar-nav`
is a *sidebar*; used as an anchor bar it stacks. It works and looks deliberate
(see screenshot), but a horizontal bar would need `.bo-cluster` + links, which
loses the `[aria-current="page"]` styling sidebar-nav gives for free. **Unresolved
— hand this to the build item, do not guess it now.**

**4. `check-markup` caught me inventing an API.** The spike used
`bo-sidebar-nav__list`, which does not exist (`__section` does). The gate failed
the build. Worth recording as evidence the gate earns its keep on exactly the
mistake a consumer would make.

## Measured, all four contexts (1440/390 × light/dark)

```
start #general · after jump #delivery · bar and header no longer overlap
action bar visible · page overflow 0
```

## Recommendation to the owner

The scope question dissolves: **the cheap version is the whole thing.** Build
`/patterns/object-page` from shipped primitives plus one `initAnchorNav()`
behavior (~20 lines, zero CSS). Do not build a `bo-object-page` component — the
Objective test in Slice 48 refuses it, and the spike shows nothing needs it.

Open sub-question for the build item: horizontal vs vertical anchor bar.
