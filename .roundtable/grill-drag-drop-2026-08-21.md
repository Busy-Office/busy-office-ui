# Grill: drag & drop list (100.1) — 2026-08-21

Owner ask, Slice 100: *"drag & drop list."* Triaged grill-first per the
owner's own Slice 99 instruction. Every claim below is a repo measurement,
not a guess about what "probably" exists.

## Verdict: REFUSE. No screen in the framework needs it, the existing path
already works, and the accessible substitute for drag has never converged
on a stable standard.

## Q1 — which ERP task is actually slow with the existing ↑↓ buttons?

**None measurable — nothing in the framework reorders more than 3 items,
and the plausible candidates named in the triage don't actually reorder at
all.** Checked every place a real ERP would plausibly reorder something:

| Candidate | What actually ships | Reorderable? |
|---|---|---|
| Line items (editable-grid, po-app) | add/remove only (`data-line-remove`) | **No** — no ↑↓, no drag, order is add-order |
| Approval route (record-detail, approval) | `bo-timeline` — a fixed history of what happened | **No** — it's a record, not a route being configured |
| Saved views / column order (filter-panel, settings-admin) | filters and toggles only | **No such screen exists** |
| `bo-ordered-list__actions` demo | ↑↓✕ buttons, inert markup | **Yes — the only one**, demoed at exactly 3 items |

So the honest answer to "name the screen and row count where dragging
wins" is: **there isn't one**. The framework has never shipped a list a
user would actually reorder at a size where ↑↓ becomes painful. Proposing
drag now would be building a mechanism for a friction case that hasn't been
observed, the inverse of the composition-first discipline this project
already applies (99.3's command-bar refusal, 95.3's touch-fitness finding).

## Q2 — what would the keyboard and screen-reader equivalents have to be?

Checked whether ARIA has a converged answer: **it doesn't.**
`aria-grabbed`/`aria-dropeffect` — the properties WAI-ARIA specified for
exactly this — were **deprecated in ARIA 1.1** for being unreliably
implemented; zero hits for either in this codebase or any dependency,
confirming the framework has never needed to reach for them. What ships
instead, industry-wide, is a hand-rolled pattern: Space "picks up" the row,
Arrow Up/Down move it, Space again "drops" it, with a live region
announcing "moved to position 3 of 7" on every step. That is not a small
addition — it is a second, parallel interaction model that must stay in
lockstep with the pointer one, verified separately, forever. The existing
↑↓ buttons already deliver the end state (a reachable, announced move) with
none of that duplication.

## Q3 — is the touch/scroll conflict solvable without a drag handle?

**Solvable, but only by adding one.** A whole-row drag zone captures every
vertical touch gesture, so scrolling a reorderable list longer than the
viewport becomes impossible without a hold-to-distinguish gesture (adds a
timing/discoverability cost) or a dedicated grab handle scoped with
`touch-action: none` — a new element, in every row, that doesn't exist
today. Confirmed: zero `touch-action` declarations anywhere in the shipped
CSS: this problem has never been solved here even once.

## The pain point, if it's real, has a cheaper fix than drag

If "moving an item far down a long list" ever does become a measured
problem, the fix is not drag — for a KEYBOARD user, drag adds nothing (the
two-channel rule means a keyboard path must exist regardless, and that path
is what actually bounds how fast a far move can be). The cheaper answer is
extending `__actions` with jump controls ("move to top" / "move to
bottom"), which is a straightforward generalization of the existing
mechanism — same buttons, same accessibility contract, zero new
interaction model. **Not proposed as a build item here** — no screen has
shown this pain either, and inventing the fix before the problem is
measured is the same mistake as building drag itself. Recorded so a future
grill doesn't have to re-derive it if the question comes back.

## Verdict

**Refuse.** A working, keyboard-accessible, two-channel reorder mechanism
already ships (`bo-ordered-list__actions`). No screen in the framework or
its dogfood app reorders anything large enough for that mechanism's cost to
show. The accessible substitute for drag has no stable ARIA pattern to
build on — it would mean hand-rolling and permanently maintaining a second
interaction model for a cost nobody has paid yet. If real demand surfaces
later (a specific screen, a specific row count, a user complaint about
click count), re-open with that evidence — the jump-controls extension
above is the cheaper first move to grill, not drag.
