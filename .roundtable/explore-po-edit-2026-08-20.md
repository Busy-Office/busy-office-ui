# Explore spike — record editing dogfooded in po-app (2026-08-20)

**Backlog still genuinely empty** of anything not owner-blocked — same
state as the previous two wakes. Third consecutive dogfood-loop dispatch,
in a fresh isolated worktree (`explore/po-edit-field-editor`).

## The brief

Auditing `po-app`'s routes for the "feel where it fights" fallback turned
up a real gap rather than a dead link this time: **there was no way to fix
a mistake on a record at all.** A Pending PO could be approved, rejected,
or bulk-recosted, but a typo'd vendor name or wrong amount had no path to
correction — not even a delete-and-recreate option (no delete route
exists either). `/patterns/field-editor` had never been dogfooded, and its
own framing (SM30-style single-record field correction) is exactly this
gap.

## What shipped

- The PO detail screen's read-only `<dl class="bo-kv">` Order fieldset
  becomes a real `field-editor`-shaped `<table data-row-edit>` (one row per
  field: Vendor, Cost centre, Amount) when the record is Pending; stays
  read-only for Approved/Rejected — same "already decided needs a
  reversal, not a re-cost" rule `mass-change` already established.
- `POST /pos/:id/edit`, matching field-editor's own documented contract:
  422 re-renders with values preserved and `aria-invalid` on only the bad
  field(s); success redirects to the record. **Server-side re-checks the
  Pending gate too** (409 if the record was decided between page load and
  submit) — the client only hides the form for non-Pending records, which
  doesn't stop a request arriving after a race.
- The cost-centre picker (now used by THREE independent forms across two
  prior spikes) reused again via the same shared helper — zero new picker
  code.

## Findings

**A third real bug caught in my own test code, not the app, before
trusting it.** The new success-path check first read `goodEdit.status` as
200 instead of the actual 302 — `fetch()`'s default `redirect: 'follow'`
silently followed the redirect and reported the FOLLOWED response's
status. The exact same mistake had already been avoided one check earlier
in this same file (the `/pos/new` success check correctly used
`redirect: 'manual'`) — missed here on the very next similar check anyway.
Caught by running it once and getting a real failure against genuinely-
working code, the same base-rate discipline as the last two wakes' spikes.

**The server-side 409 guard is not redundant with the client-side gate.**
Checked deliberately, not assumed: `POST /pos/PO-88211/edit` (an Approved
record) against a server with no client involved returns 409 and changes
nothing — confirming the route doesn't just trust "the form only shows for
Pending records" as its only defense.

## Verdict: **graduate**

Landed directly. `examples/po-app/server.mjs` and `apps/docs/scripts/
check-po-app.mjs` both changed; no `packages/core` changes, no framework
CHANGELOG entry.

Verified live: edit → save → redirect → value persisted; edit on a
still-invalid field → 422, values preserved, only the bad field marked;
edit on an already-decided record → 409, confirmed unchanged via a
separate GET; both themes. `check:po-app` 13/13 (10 pre-existing + 3 new).
