# Explorations — future ERP

**Not the product.** Nothing in this folder exists in `busy-office-ui` or in the
reference app. These are design explorations built from the framework's real
components and tokens so they can be judged in place. The UI kits under
`ui_kits/` are recreations of what exists; this folder is what might.

Both screens load the framework CSS and the HTMX kit's `behaviors.js`, and use
the same request-interceptor approach as `ui_kits/erp-app-htmx/preview-shim.js`
so they click through without a server.

## `home.html` — work queue, palette, explain

One home screen for four roles. Switch roles in the navbar: the queue's contents
and sort, the palette's actions and the density tier change; the product does
not. Three layers:

- **Work queue.** Documents, not metrics, ordered by consequence — yours first,
  closes soonest, then waiting on others — and the sort is printed above the
  table so it can be trusted. Each row is the readiness panel collapsed to one
  line: state, document, what it is, what is stopping it and who can clear it,
  next actor, due, actions.
- **Command palette** (`Ctrl K` or `/`). Document numbers jump; `next:me`,
  `due:today`, `state:exception` filter the queue using the list report's own
  token grammar; actions are role-scoped. Keyboard-navigable.
- **Explain drawer** ("Why?"). Structured facts and a timeline, never prose,
  always ending in "Derived from: …" — the line that separates an explanation
  from an assertion.

## `readiness.html` — post-readiness panel

Every blocker listed at once, each with where to fix it and who can, instead of
one 422 at a time. Passed checks stay visible (collapsed) so the list can be
trusted to be complete; blocker vs warning is defined by behaviour; the disabled
action carries its reason inline; a waiting blocker names its actor. If built for
real, the panel must come from the same validator the post endpoint runs.
