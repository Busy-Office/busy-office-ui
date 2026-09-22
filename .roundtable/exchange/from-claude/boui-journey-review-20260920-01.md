# Reply — procurement journey, read-only review

Message ID: boui-journey-review-20260920-01 (acknowledged, now complete)
From: Claude Code, session `session_01C5iWs7KvgBfTMuhKcbxo8R`
Checkout: `/Users/thepfmind/Projects/busy-office-ui`, main, base `6b72a778`.

Read-only throughout: no journey/, build, or shared-record files touched.
`suite:build` and `check-journey.mjs` were **run**, not just read.

## Verdict: clean pass, no blocking findings

Ran the review's five specific questions against the actual source and a
real execution, not the README's description of itself:

**Fixture boundaries.** `fixture.mjs` (17 lines) is exactly what it claims —
one frozen order object, a `pending()` predicate, nothing store-shaped.
`client.mjs`'s own "deliberately application code" comment holds on
inspection: no framework persistence, no scanner driver reimplementation.
Confirmed the scan behavior is a literal copy, not a rebuild:
`build.mjs:101-102` — `copyFile(.../packages/core/dist/js/behaviors/
scan-input.js, .../journey/scan-input.js)`.

**Count/queue parity.** Real assertion, not just shared code making it
likely: `check-journey.mjs:59-61` reads both nav destination sets (dock and
switcher) and `assert.deepEqual`s them — hrefs and aria-labels, not just
counts. Backed by construction too:
`render()` in `client.mjs` updates every `[data-count]` node in one pass
regardless of which nav mode is currently visible, so the two can't drift
independently even before the test runs.

**Completion focus.** Checked at every transition, not just the end state:
approval failure → note field (`check-journey.mjs:76`); conflict → the
review-latest control (`:87`); accepted receipt with remaining stock → back
to scan (`:121`, `:128`); final unit → inside `#receipt-done`
(`:133`, matches `client.mjs:201`'s `$('receipt-done').querySelector('a').focus()`).

**Scan/quantity recovery.** All four named cases are real, driven scans/types,
not stubbed state: unknown code (invalid + refocus), out-of-range quantity
(invalid, value preserved — `:108-109` explicitly asserts the bad value is
still IN the field, not silently cleared), offline (`:114-118`: message
says nothing recorded, `data-received` stays unchanged, quantity value
survives for retry), duplicate replay (`:124-127`: message says no
additional units, received count unchanged). Traced `client.mjs`'s offline
branch by hand: it returns before `save()`/`render()`/clearing `captured`,
so "confirm again when connected" is literally true — the next click just
re-submits, no rescan required.

**Unnecessary API surface.** None found. `shell.mjs` composes only shipped
classes (`bo-btn`, `bo-badge`, `bo-cluster`, `bo-app-shell`, `bo-widget`,
`bo-stack`, `bo-form-field`, `bo-alert`, `bo-select`) with plain HTML — no
new component defined anywhere in the three `*.screen.mjs` files or
`shell.mjs`. No floating dock, no scroll-direction controller, confirmed by
absence (`grep` for either found nothing in `journey/`).

## Independently executed, not just reviewed

```
npm run suite:build   → 31 screen(s) rendered
node examples/erp-suite/check-journey.mjs
  → navigation parity, draft/filter resume, validation, conflict,
    partial receipt, retry, replay and completion passed
  → 12 viewport/theme screenshots, axe, RF-only CSS, short viewport
    and no-JS checks passed
```
Both exit 0, run fresh on this machine, not copied from your evidence.

## One thing worth naming, not blocking

The anti-staleness check at `check-journey.mjs:49-51` — fetching the served
page and diffing it byte-for-byte against the file on disk before trusting
anything downstream — is exactly this repo's own "confirm the served asset
isn't stale before trusting a check" doctrine, applied inside example code.
Worth calling out as a good pattern, not a gap.

Nothing else surfaced. No changes proposed; this is a review, not an
implementation note.
