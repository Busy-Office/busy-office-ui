# Explore spike — PO creation dogfooded in po-app (2026-08-20)

**Backlog still genuinely empty** of anything not owner-blocked (same state
as the previous wake's Explore dispatch). Continuing the dogfood-loop
fallback: extended `examples/po-app` again, in a fresh isolated worktree
(`explore/po-create-detail-form`).

## The brief

Reading `emptyHtml()` while orienting for this wake surfaced something
concrete: the first-run empty state's own primary action links to
`/pos/new`, and no such route existed — a genuine **dead link, shipped in
the reference app**, confirmed with a live `curl` (404). Because `pos`
always has 30 seeded records, this empty state — and therefore the dead
link — was structurally unreachable through ordinary use. Nobody had ever
actually clicked it.

`/patterns/detail-form` had never been dogfooded either, and its own docs
framing ("a full purchase-order edit form") is a near-exact match for what
"New purchase order" needs.

## What shipped

- `GET /pos/new` / `POST /pos/new` — a real creation screen (Vendor, Cost
  centre, Amount — the fields `po-app`'s actual data model has; no line
  items, because the `pos` records never modeled them, and inventing that
  scope now would be a second spike, not this one).
- Server-side validation matching `detail-form`'s own documented contract:
  422 re-renders the SAME form with values preserved and `aria-invalid` +
  a message on only the bad field(s) — never a blank form. Success
  redirects to the new record (`/patterns/detail-form`'s own "POST /po/:id
  → redirect to the record on success").
- A **persistent** "New purchase order" button in the list header — the
  empty-state link was the ONLY way to reach this route before, and empty
  states are rare; a real list screen has a standing create action.
- The cost-centre picker (last wake's spike) **refactored into a shared
  helper** (`costCenterPickerTrigger`/`costCenterPickerHtml`,
  parameterized by target field id via `data-cc-target`) so the new
  creation form and the existing mass-change dialog both use ONE dialog +
  one wiring script, not two copies. The mass-change dialog's own inline
  duplicate was removed as part of this — the kind of drift a Standardize
  sweep would otherwise come back for.

## Findings

**The shared picker composes cleanly across two independent forms on two
different pages** — verified live, both consuming the same
`/cost-centers?q=` endpoint, same dialog markup, same fill/close/refocus
script, distinguished only by which field each page's trigger names.

**Automated coverage added, not just manual verification** — `apps/docs/
scripts/check-po-app.mjs` (the existing "reference app is tested for real"
gate, Slice 26.1) gained three new checks: the 422 field-preservation
path, the success-and-redirect path, and the picker's server-side search
narrowing. `/pos/new` was added to the gate's own axe sweep.

**A real bug in my OWN first version of the new gate check, caught before
trusting it.** The success-path check initially compared `/pos`'s row
COUNT before and after creating a record — and `/pos` only ever renders
page 1 (`PAGE_SIZE = 10`), so with 30+ records already seeded the count
was 10 both times regardless of whether anything was actually added. Ran
it once, watched it report a false failure on genuinely-working code,
diagnosed the cap, and switched to checking that the new record's own row
id appears on page 1 (it's `unshift()`ed to the front, so it must) — the
same base-rate discipline ("an instrument's first output is not evidence")
applied to a brand-new test, not just to app code.

## Verdict: **graduate**

Landed directly, same as last wake's spike. `examples/po-app/server.mjs`
and `apps/docs/scripts/check-po-app.mjs` both changed; no `packages/core`
changes, so no framework CHANGELOG entry.

Verified live: `node server.mjs` against the real packed tarball, full
create/reject/success flow, both themes, the shared picker exercised from
both pages. `check:po-app` passes 10/10 (7 pre-existing + 3 new), axe-clean
across the new route.
