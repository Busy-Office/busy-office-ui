# Grill: re-open the drag refusal (110.7, re-grilling 100.1) — 2026-08-22

Owner ask, Slice 110: re-open 100.1 as a fresh grill, full accessibility
bill visible, with kanban card-between-lanes (110.6's shipped baseline) as
the driving case. Not a reversal — the question is asked again from
scratch, honestly, against the concrete screen that now exists.

## Verdict: REFUSE (again) for kanban card-between-lanes. Ordered-list
reorder is moot — nothing to extend "for free" when the driving surface
itself is refused. 100.1 stands, now confirmed against a real screen
instead of a hypothetical one.

## What's different from 100.1, and what isn't

100.1 refused because **no screen existed** that would show drag's
benefit. That objection is gone: 110.6 shipped a real kanban board, and
the owner named it as the driving case. So this grill re-runs the same
three questions against that concrete screen, at full cost, rather than
resting on "nothing to point at."

Everything else 100.1 found is unchanged, measured fresh against the
current tree:

| 100.1 finding | Still true today? |
|---|---|
| `aria-grabbed`/`aria-dropeffect` deprecated in ARIA 1.1, no successor standard | Yes — no new W3C guidance since; industry still hand-rolls pick-up/move/drop + live-region narration, confirmed against current WAI-ARIA APG |
| Zero `touch-action` declarations anywhere in shipped CSS | Yes — `grep -rn "touch-action" packages/core/src` → 0 hits, re-checked this grill |
| Zero drag primitives (`draggable`, `dragstart`, sortable libs) anywhere in the framework | Yes — 0 hits, re-checked this grill |
| Two-channel is not waivable | Yes — CLAUDE.md states this as a hard rule, not a per-case judgment call |

## Q1 — does the kanban board (110.6) actually show the friction drag would fix?

**No, not at the scale it shipped.** 110.6's four lanes hold 3 / 1 / 1 / 2
cards. Moving a card today is: open its menu (1 click/tap), pick the
target stage (1 click/tap) — the menu lists *only the legal next stages*,
so it is never more than a 2-action, zero-scroll operation regardless of
board size. Drag, by contrast, gets *harder* as the board grows: 110.6's
lanes sit in a horizontally-scrolling `bo-cluster`, so a drag target can be
off-screen, requiring an edge-scroll gesture that doesn't exist in the
framework either. There is no board size at which drag is strictly faster
than the existing 2-action menu — it only adds a large-motor-movement
option for pointer users who are already one click away from precision.

This is the same shape of finding as 100.1's original ("no row count where
dragging wins"), now confirmed on the actual screen instead of inferred.

## Q2 — what would the keyboard/SR equivalent cost, concretely, for kanban specifically?

Worse than 100.1's ordered-list case, not better. Ordered-list reorder is
one-dimensional (an item moves up/down within one list) — a hand-rolled
keyboard model there is "arrow moves within the list." Kanban is
two-dimensional: a card must move *from a lane* *to a lane*, across a
horizontally-scrolling cluster of columns. The keyboard equivalent is:
Space to pick up, Left/Right to change target lane, a live region
announcing the candidate lane on every step ("targeting Blocked, 1
card"), Enter to drop, Escape to cancel — a strictly bigger hand-rolled
state machine than the ordered-list case 100.1 already declined to build,
verified separately, forever, in parallel with the pointer path.

**And it cannot replace the menu — two-channel is not waivable.** Every
card keeps its `Move to…` menu regardless of whether drag ships, because
the menu is the only channel that also serves screen-reader users, keyboard
users, and anyone whose input device doesn't do drag well (switch access,
voice control). So drag here is not an alternative interaction — it is a
**second, fully parallel one**, maintained forever, that only ever serves
pointer users who already have a 2-action path. This is the crux the
110.7 scope note calls out as "not waivable," and it is the same math
that sank 100.1: the cost is paid whether or not the benefit is real,
because the accessible path must exist and be maintained either way.

## Q3 — touch/scroll conflict, specifically on a horizontally-scrolling board

**Solvable only with a dedicated grab handle** (`touch-action: none`,
scoped to the handle, not the card) — same conclusion as 100.1, but the
kanban board makes the conflict two-dimensional and worse: the lane
cluster itself scrolls horizontally (`overflow-x: auto` on
`.bo-cluster`), and each lane's card list can scroll vertically
(110.6's own States table: "the lane scrolls internally past a height").
A drag gesture on a card is ambiguous against *both* scroll axes at once,
not one. A handle solves the vertical case the way any drag library does;
resolving *cross-lane* dragging without hijacking the board's own
horizontal scroll needs an edge-autoscroll behavior that has no
precedent anywhere in this framework. This is a new, board-specific cost
100.1 never had to price, and it does not shrink the bill — it grows it.

## The owner's demand, weighed honestly

The owner asked twice: once to build kanban over the grouped-list
objection (110.6, correctly overridden — recorded as stated consumer
demand), and now to re-open drag specifically. Both are real signal and
neither is waved away here. But the two requests are not the same kind of
claim. "Build a kanban board" is a claim about what screen exists — the
owner is the authority on that, and 110.6 was built accordingly, no
grill needed to re-litigate it. "Add drag on top of it" is a claim about
whether a specific interaction earns a *permanent, parallel, forever-
maintained accessibility surface* — that is exactly the kind of cost this
framework's own rules (two-channel non-waivable, Objective §
simplicity/less-for-more) exist to hold a line on regardless of who is
asking, the same way 99.3's command-bar refusal and 95.3's touch-fitness
finding held lines against real feature pressure elsewhere in this
project. Taking the owner's ask seriously means re-running the numbers
honestly against the real screen — not skipping the grill, and not
pre-committing to either answer before doing it. The numbers came back
the same as 100.1: the accessible path already exists, is faster at the
board's current scale, and gets no cheaper to duplicate just because a
real screen now demonstrates the ask.

## Q4 (scope) — does ordered-list reorder ride along "for free"?

Moot. The scope note asks this only in case the kanban mechanism ships
and might be reused; since kanban is refused, there is no mechanism to
extend. If ordered-list reorder is separately re-grilled later, it starts
from 100.1's own finding (jump-to-top/bottom controls on the existing
`__actions` are the cheaper first move, not drag) rather than inheriting
anything from this grill.

## What would change this verdict

Not "the owner wants it" a third time — that input is already weighed
above. What would move the needle: **measured usage** showing lanes
routinely holding enough cards that the 2-action menu is the actual
bottleneck (a support complaint, a session recording, a click-count
comparison on a real production board) — the same evidentiary bar 100.1
set and this grill re-applied. Until a board exists at that scale, the
existing baseline is the correct one and the cost of drag is pure
maintenance with no offsetting reduction in friction.

## Verdict

**Refuse**, for kanban card-between-lanes specifically, at full
accessibility cost, on a concrete screen — not a hypothetical one. The
menu-based move (110.6's shipped baseline) is faster than drag at
observed scale, is the sole channel that will ever serve non-pointer
users regardless of whether drag ships (two-channel non-waivable), and
the cost of the keyboard/live-region/touch-handle bill is strictly higher
for kanban's two-dimensional, dual-scroll board than it was for 100.1's
one-dimensional list. Ordered-list reorder rides along with no mechanism
to inherit, since nothing was built. 100.1 stays on record, not
superseded — this grill reaches the same conclusion with the concrete
screen the owner asked to see it weighed against.
