# Design grill — the Object Page (2026-08-19)

Owner wishlist: *is there a better name? · can we have a scrolling effect? ·
grill the design.* Everything below is measured against the shipped page, not
argued from taste. Counter-evidence attached to each finding.

---

## D1 — A third of a phone screen is permanently chrome
**Severity: HIGH · Evidence (measured, both widths)**

Measured while scrolled into the second section:

| viewport | sticky header + anchor bar | action bar | total chrome | % of viewport | content left |
|---|--:|--:|--:|--:|--:|
| 1440 × 900 | 198px | 61px | **259px** | **29%** | 641px |
| 390 × 844 | 213px | 61px | **274px** | **33%** | 570px |

The screen exists to show a record, and on a phone a third of it is permanently occupied
by navigation. **This is the strongest argument for the owner's scroll-effect
ask, and it is not a decorative one**: Fiori collapses its object header on
scroll for exactly this reason.

**Counter-evidence:** the chrome earns some of that. Status-without-scrolling is
the stated job of the header, and the action bar is what makes the screen
actionable from anywhere. The fix is to *shrink it after the reader has seen
it*, not to remove it.

---

## D2 — The demo is a skeleton where every other pattern shows a screen
**Severity: HIGH · Evidence (2 independent counts)**

| page | placeholder phrases in the demo |
|---|--:|
| `/patterns/record-detail` | **0** |
| `/patterns/object-page` | **9** |

Every section reads *"Facet content for delivery — in a real screen this is a
form section, a table, or a timeline."* That is a wireframe. The pattern recipe
in CLAUDE.md says a pattern page documents **a SCREEN**, and the learning-path
rule says show the result first. `record-detail` shows real cards, a real
timeline, a real audit trail; this shows four grey boxes.

It also undercuts D1's own evidence: with real content the sections would be
taller and the chrome ratio would look better — the page is currently flattering
itself by being empty.

**Counter-evidence:** the page's job is to demonstrate *navigation between*
sections, and filling four sections with real ERP content would bury that. But
"less content than record-detail" is not the same as "no content".

---

## D3 — Two patterns, one screen, and the distinction is thin
**Severity: MEDIUM · Evidence (block-level overlap)**

Rendered blocks, code samples excluded:

```
record-detail: 18 blocks   object-page: 13 blocks   shared: 10
only in object-page: bo-amount, bo-form-actions, bo-pagination
```

Ten of thirteen blocks are shared, and one of the three that are not
(`bo-amount`) is incidental. **The entire difference is two regions: an anchor
bar and an action bar.** Both pages open by describing the detail screen for *a
purchase order* — the same example object.

The page tries to draw the line at length ("too tall to take in at once"). Length
is not a pattern. A screen becomes a different pattern when the *interaction*
changes, and here it genuinely does — you navigate between sections instead of
scrolling one feed — but the page names the symptom (tall) rather than the
interaction (sectioned, navigable).

**Counter-evidence:** SAP does treat this as its own floorplan, and it is the
canonical ERP screen; collapsing it into `record-detail` would hide the thing
most ERP users are looking for. The two-region difference is small in markup and
large in behaviour.

---

## D4 — The name
**Severity: MEDIUM · Hypothesis (taste + audience; one measurable input)**

The measurable part: this project's own bar is *"write for a first-time user:
plain verbs"*. "Object page" is SAP vocabulary — precise for someone who has used
Fiori, opaque otherwise, and it names **the thing shown** (an object) rather than
**what makes the screen different** (it has sections you navigate).

Options, with the trade-off stated rather than hidden:

| name | for | against |
|---|---|---|
| `object-page` (keep) | exactly what an ERP audience searches for; matches Fiori | jargon; names the object, not the interaction; sits oddly beside plain-English `record-detail` |
| **`sectioned-record`** | names the interaction; plain; sorts beside `record-detail` | invented term, nobody searches it |
| `record-sections` | plain, descriptive | reads like a component, not a screen |
| merge into `record-detail` | one screen, one page — "less for more" | buries the canonical ERP floorplan inside another page |

**Recommendation: keep the slug `object-page`, change the human title** to
name the interaction — e.g. *"Object page — a long record, in sections"* — and
make D3's distinction explicit in the opener. That keeps the search term an ERP
user will actually type while fixing the "names the symptom" problem. **This is
the owner's call; it is taste with one measurable input, not a defect.**

---

## D5 — The scroll effect: justified, but the modern CSS for it is off our floor
**Severity: MEDIUM · Evidence (compat data, same source as the floor gate)**

`animation-timeline` (scroll-driven CSS animation) support vs our floor
(`chrome 119 · edge 119 · firefox 128 · safari 17.4`):

```
chrome 115 ✓   edge 115 ✓   firefox preview ✗   safari 26 ✗
```

**Chrome-only.** A CSS scroll-timeline implementation would silently do nothing
for Safari and Firefox users, which is the "cosmetic enhancement that quietly
opts out" failure the floor exists to prevent.

The on-floor implementation is the one the framework already uses everywhere
else: the behavior that is *already listening to scroll* (`initAnchorNav`)
toggles a state attribute past a threshold, and CSS transitions the header using
a `--bo-motion-duration-*` token — which zeroes under `prefers-reduced-motion`
for free, satisfying `check:motion` by construction.

**Risks to design against, not discover later:** a single threshold makes the
header flip-flop when the reader hovers the boundary (needs hysteresis — collapse
at one offset, expand at a smaller one); and collapsing must not move the anchor
bar out from under the reader's finger mid-tap.

---

## Recommendation, in priority order

1. **D2 first** — put a real screen in the demo. It is the cheapest, it is
   required by our own recipe, and it changes the evidence for everything else.
2. **D5** — collapsing header on scroll, JS-toggled + token transition, with
   hysteresis. Measure the chrome ratio again afterwards; the target is that a
   scrolled phone screen spends **under 20%** on chrome, down from 33%.
3. **D4** — retitle to name the interaction; keep the slug. Owner's call.
4. **D3** — no merge. Sharpen the opener instead so the distinction is the
   interaction, not the height.
