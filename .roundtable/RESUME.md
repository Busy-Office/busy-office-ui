# Resume state — read this at Step 0 of every wake

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

Ordinary state — what is queued, what is done — lives in `ROADMAP.md` and
`.roundtable/loop-log.md`. Only put things here that those two cannot say:
uncommitted work, and a decision made but not yet written down.

---

## In flight: nothing

Last updated 2026-08-19 after the Slice 56-61 Objective grill. This file had
gone stale since 2026-08-18 — Slice 48's "open question" below had already
been resolved and shipped (48.4, then the whole object-page pattern) without
this file being told. Found by the same grill that found the LIFO dispatch
bug; both are the same root cause (stale state trusted instead of checked).
**If this file's "last updated" is more than a few wakes old, verify its
claims against ROADMAP.md before trusting them.**

## Owner-blocked (re-stated each grill, not re-queued)

- **`npm publish -w @busy-office/ui`** — 0.2.0 is tagged, `npm pack`-verified and
  CI-green; the registry still serves **0.1.1**. npm in this environment is
  unauthenticated (E401), so publishing is owner-triggered and cannot be done
  from a wake. Everything from Slice 24 onward is in the repo and in nobody's
  `node_modules`. Restated in 10 consecutive Objective grills now.
- **30.4b** — windowed list (the 50,000-record ask). Scope/Accept criteria are
  fully written (`ROADMAP.md:4274`); owner explicitly **deferred to the next
  publish cycle** (2026-08-20) rather than building now — not a build-now item
  until that cycle starts, don't re-surface as ready in the meantime.
- **52.3 — Object Page naming.** Recommendation given (keep the `object-page`
  slug, retitle to name the interaction); genuinely the owner's call on taste,
  not something the loop can decide for itself.

## Open questions awaiting the owner

- **30.0** — the "advanced editable table with different data types" half is
  still ambiguous. (The "horizontal tabs" half was answered 2026-08-18: it meant
  **vertical** tabs, shipped as 36.1.)
- **37.1/37.2 rubric — superseded, not answered.** The original
  Demand/Composition/Contracts/Evidence rubric never got owner sign-off; before
  it did, the owner's own wishlist (Slice 53) produced a different, symmetric
  NEED/COST rubric that has since been used for real decisions (`.bo-date`,
  `.bo-quantity--display`). Treat 37.1's sign-off question as moot unless the
  owner wants the original rubric run anyway.

## Resolved, kept here only as a pointer (not re-litigated)

- **Slice 48 — SAP Object Page scope.** Was "whole floorplan vs anchor bar
  only" — resolved by an Explore spike (2026-08-19): composes from primitives
  with zero new CSS, so the cheap answer was the whole thing. Shipped as
  `/patterns/object-page`, 48.1-48.4 and 52.1-52.2. Not open.
