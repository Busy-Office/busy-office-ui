# Design grill — /patterns/goods-receipt (2026-08-20)

Batch 4 of the /design-grill sweep (roadmap 58.1), alphabetical order.
Measured live, bind-mounted container, both themes; the scan interaction
was operated directly (typed a barcode + Enter), not just read from source.

## Step 1 — the decision

**Was missing.** The opener explained the input modality (RF scanner, not a
mouse) in detail but never who's holding it or what a finished receipt
looks like. Reworded: *"Who uses it: a warehouse floor worker, one-handed
and often gloved, holding a scanner instead of a mouse. What 'done' looks
like: every expected line accounted for — received in full, received
partial, or explicitly not received — before the receipt posts."*

## Findings

**Two Anatomy items describe a screen shape the live demo doesn't build.**
Checked precisely (curl + a full render, not assumed):

- **"Expected vs received list"** claims *"every line with its ordered
  quantity and a running received count."* The live log table has three
  columns — Barcode, Qty, Received(timestamp) — and is a flat append-only
  scan log, not a pre-seeded expected-lines table. There is no "ordered
  quantity" anywhere in the demo, and no per-line running count against an
  expected total; every scan just appends a new row, even for a barcode
  scanned twice.
- **"Confirm bar"** claims a post-the-receipt action, disabled until a line
  has quantity. Checked the full rendered demo section (Scan to receive
  through Markup): the only buttons present are the quantity +/− steppers.
  No confirm/post control exists anywhere on the page.

Both are real anatomy elements a production GR screen needs — this isn't
disputing the claims, it's that this specific demo only builds the
scan-input half (`data-scan-input`, the actual new framework surface this
page exists to introduce) and stops there. Reworded rather than built:
noted the gap in each Anatomy item and, for the expected-list one,
described concretely what the real version looks like (pre-seeded rows
from the PO, updated in place rather than appended) so a reader isn't left
guessing what "the real thing" means.

## What's already strong, verified by operating the demo

- **The scan behavior actually works as documented**: typed a barcode and
  pressed Enter — the field cleared and refocused, a new log row appeared
  with the barcode, current quantity, and a timestamp, exactly matching the
  "Markup" code sample's description.
- **`textContent`, never `innerHTML`, for the scanned barcode** — the JS
  comment states the reason directly ("barcode content is untrusted
  physical-world input — adversary-printed labels exist"), a real security
  consideration named in the page, not left implicit.
- **The visually-hidden live region is linked via `aria-describedby`**,
  giving non-visual scan confirmation without every scan being announced to
  sighted users reading the visible log — checked the markup, both
  attributes present and correctly paired.

## Verdict per element

| element | verdict | why |
|---|---|---|
| Opener | **fixed** | added Who/What-done framing |
| Anatomy "Expected vs received list" | **reword** | live demo is a flat scan log, not an expected-vs-received comparison; described the real shape concretely |
| Anatomy "Confirm bar" | **reword** | no post/confirm control anywhere in the demo |
| Scan-clear-refocus behavior | **keep** | verified by actually typing a barcode and pressing Enter |
| `textContent` for scanned values | **keep** | a real security reason stated, not assumed |
| Visually-hidden live region wiring | **keep** | `aria-describedby` correctly pairs field and status |

## Recommendation

Opener fixed. Two Anatomy items reworded to match what this specific demo
actually builds (the scan-input behavior), rather than expanding the demo
to a full expected-lines receiving screen — that would be a second pattern
page's worth of new markup for a claim this one doesn't need to make.
