# UI kit — ERP application, server-rendered (HTMX)

**This is the kit that matches how the product is actually built.** `busy-office-ui`
ships no React: it is CSS plus 26 optional vanilla-TypeScript behaviours, consumed
from server-rendered HTML. Open `index.html`.

The sibling `ui_kits/erp-app/` is the same screens in React. That one exists
because this design system's gallery and Templates picker require `.jsx`; it is
scaffolding, not the product's API. If you are writing production code, copy from
*this* kit.

## What is real and what is not

| | Status |
|---|---|
| The markup, every class, every `hx-*` attribute | **Real.** Inspect it in devtools — it is exactly what a Django, Go or Rails template emits. |
| Route shapes, verbs, status codes, param names | **Real.** Taken from `examples/po-app` via `apps/docs/scripts/check-po-app.mjs`, which boots the app and asserts them. |
| `behaviors.js` | Plain-JS transcription of `data-table.ts`, `saved-views.ts` and `table-toolbar.ts` so this runs without a build. **Use the real package in production.** |
| `preview-shim.js` | **Preview only.** Intercepts HTMX requests and answers from canned data because there is no server here. Delete it, point the same attributes at a real backend, and the kit works unchanged. |
| First paint | The shim renders the list on load. In production the server renders it into the response. |

## Routes

Mirrors `examples/po-app`. Every one of these is asserted by the repository's own gate.

| Verb | Route | Contract |
|---|---|---|
| GET | `/pos?q=…` | List report. One `q` param of space-separated `key:value` tokens. |
| GET | `/pos/:id` | Record page. |
| POST | `/pos/new` | 302 → the new record on success; **422 re-renders the same form** with `aria-invalid` and values preserved. |
| POST | `/pos/:id/edit` | 302 on success; 422 marks **only** the bad field; **409 if already decided.** |
| POST | `/pos/:id/approve` · `/reject` | Resolves the row. Sends `note` via `hx-vals`. |
| POST | `/pos/bulk-approve` | Repeated `id` params. Partial failure reports **both counts** and puts the reason on the row via `data-row-state="error"`. |
| POST | `/pos/mass-change` | 422 on an invalid target, and **changes nothing at all**. |
| GET | `/cost-centers?q=…` | Value help. Narrows **server-side**. |
| POST | `/import` | `action=validate|apply`. Apply lands the valid rows and leaves the rest listed. |

## The query-token grammar

Filters are one `q` param, not a field per filter: `?q=status:Pending vendor:Stark`.
Known keys are `status:`, `vendor:`, `cc:`. **An unknown key stays free text**
rather than becoming a token that matches nothing — try `ref:99`, which returns
text matches and renders no chip.

Each active token renders as a chip whose remove control is **a plain `<a href>`
carrying `q` minus that token**. Removing a filter therefore needs no JavaScript
at all; the repository's gate proves this by following the href with `fetch()` and
counting that more rows come back.

## Things to try

- Type `status:Pending` in the query field — `hx-trigger="input changed delay:250ms, search"`, the debounce the docs specify for type-ahead.
- Remove a chip. Watch the URL: `hx-push-url` keeps it shareable, and the href alone would have worked.
- Select rows. The `n selected` count is a live region and the container gets `data-any-selected="true"` — an O(1) attribute so CSS needn't re-scan every row with `:has()` on a large grid.
- Bulk-approve a mix of Pending and already-decided rows. Both counts are reported; the refusals stay on screen.
- On a record, clear the vendor and Save → **422**, values kept, only that field marked. Set the cost center to `CC-9900` → 422 naming the closed cost center.
- Edit an Approved record → **409**. The client hides the form for decided records, but the server checks anyway, because a request can arrive after someone else decided it.

Design explorations that are **not** part of the product live in
`explorations/future-erp/`, not here.

## Two security settings that are not optional

```js
htmx.config.allowScriptTags = false;  // HTMX evaluates scripts in swapped content by DEFAULT
htmx.config.selfRequestsOnly = true;  // no cross-origin swap targets
```

Any server rendering user-supplied text into a fragment needs the first one, or
stored XSS executes on swap. Template autoescaping is the other half.

The wider argument for this architecture over an SPA is **authorization
locality**: a server-rendered fragment filters rows by permission at render
time, whereas a JSON API plus a client renderer must enforce it in the API and
tends toward over-fetching — returning fields the UI hides but the payload still
carries. That is a classic ERP data-leak shape, and this architecture does not
have it.

## Grounding

- `packages/core/src/js/index.ts` — the 26-behaviour public API.
- `packages/core/src/js/behaviors/{data-table,saved-views,table-toolbar,load-more}.ts` — markup contracts, transcribed here.
- `packages/core/src/css/integrations/htmx.css` — the opt-in HTMX stylesheet, linked by this page.
- `apps/docs/scripts/check-po-app.mjs` — the gate that boots `examples/po-app` and asserts every route contract above.
- `apps/docs/src/data/patterns.json` — pattern specs, including the no-JS fallback notes and the WCAG 2.2.2 rule that any `hx-trigger="every Ns"` poll must be user-stoppable from the first tick.

`examples/po-app` itself ships only a Dockerfile, compose file and
`package.json` in the repository — `server.mjs` and its templates are not
committed, so the route contracts above come from the gate that tests them
rather than from the app's own source.
