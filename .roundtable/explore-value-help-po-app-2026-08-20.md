# Explore spike — value-help dogfooded in po-app (2026-08-20)

**Backlog empty of anything not owner-blocked** (Objective 2/3, Standardize
3/4 — neither counter overdue; every open ROADMAP item is OWNER CALL /
AWAITING CLARIFICATION / NEEDS-RUNTIME). Per LOOPS.md's own fallback once
the Ideas backlog is exhausted: extend `examples/po-app` and feel where it
fights.

## The brief

`/patterns/value-help` had never been dogfooded. `po-app`'s mass-change flow
(`/pos/mass-change`) asks the user to TYPE a cost-centre code from memory
into a plain `<input>` — exactly the free-text-prone-to-typos field the
pattern exists to fix. Spiked in an isolated worktree
(`explore/value-help-po-app`).

## What shipped

- A real `COST_CENTERS` master list (7 entries) — did not exist before this
  spike; every "CC-nnnn" in the app was an ad-hoc string literal.
- A server-side `/cost-centers?q=` search endpoint, debounced client-side
  via `hx-trigger="input changed delay:250ms, search"` — the docs' own
  demo filters client-side and explicitly says a real picker asks the
  server; this dogfoods that half for real.
- The picker embedded as a **second modal dialog opened from inside an
  already-open one** (`mass-cc` → `cc-picker`) — a composition the static
  docs demo never has to handle, since it's the only dialog on its page.
- `mass-change`'s validation upgraded from format-only
  (`/^CC-\d{4}$/`) to real existence-checking against `COST_CENTERS` — a
  well-formed but nonexistent code (`CC-0000`) used to silently "succeed."

## Findings

**Nested-dialog composition works with zero framework changes.** Verified
live: opening `cc-picker` while `mass-cc` is still open stacks correctly
(native `<dialog>` top-layer behavior), each dialog's own focus trap
(`dialog.ts`'s per-dialog `keydown` listener) stays scoped to itself, and
picking a result correctly fills the field, closes only the picker, and
returns focus to the FIELD — matching the docs' own documented reasoning
("closing a modal from a click on a button inside it leaves focus on
`<body>` otherwise") through a real second layer of stacking, not the
single-dialog case the docs demo tests.

**A real, reproducible, PRE-EXISTING bug found and fixed — confirmed not
caused by this spike.** `/pos/mass-change`'s 422 response
(`<div id="bulk-result" hx-swap-oob="innerHTML">...</div>${tbodyHtml(pos)}`)
put the OOB block BEFORE the main swap content. After that response, the
PO list's `<tbody id="po-rows">` vanished from the DOM entirely — checked
directly (`document.querySelectorAll('tbody').length === 0`), not
eyeballed from a screenshot; the table rendered with only its `<thead>`
and no rows. Every OTHER OOB response in the file (the two success paths)
already puts main content first, OOB second. Confirmed this was not
something the spike introduced: reproduced on a completely unmodified
checkout of `server.mjs` running standalone on a scratch port, before
touching anything. Fixed by reordering the 422 response to match the
working shape (main content first); re-verified in the live `node`
process AND in the real containerized (Podman, tarball-installed) build —
30 rows intact after the same 422, in both themes.

Nobody had tried a well-formed-but-wrong cost centre in this flow through
a live browser before — the format-only regex never rejected anything a
person would type by mistake for real (a mis-remembered digit still
matches `CC-\d{4}`), so this 422 branch had never actually fired outside
a deliberate test. This is exactly the value dogfooding a real app is
supposed to produce.

## Verdict: **graduate**

Landed directly (Explore's own playbook: graduate → hand to the Roadmap
loop's triage). Not merged as a framework change — `examples/po-app` is
the dogfood app itself, and every line changed is `examples/po-app/server.mjs`.
No `packages/core` changes, so no framework CHANGELOG entry.

Verified live: `node server.mjs` against the real packed tarball
(matching the Dockerfile's own install path) AND the actual Podman
container build, both themes, the full flow (select → mass-change dialog
→ nested picker → search → pick → submit → reject-unknown-code →
confirm-table-intact).
