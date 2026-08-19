# Design grill — /patterns/detail-form (2026-08-20)

Batch 3 of the /design-grill sweep (roadmap 58.1), alphabetical order.
Measured live, bind-mounted container, both themes.

## Step 1 — the decision

**Already correct.** *"Who uses it: whoever owns the record — a buyer
editing a PO, an admin fixing vendor details; occasional, high-stakes edits
where losing work is unacceptable. What 'done' looks like: every change
saved (or explicitly discarded) with no silent loss."* Not a finding.

## Findings

**Anatomy overclaimed the line-items table's behavior.** Item 3 said: *"the
[editable grid] nested inside the form; its dirty state is per-row and
independent of the header fields."* Checked the live markup: the line-items
table here has no `data-row-edit` attribute at all — it's a plain
`.bo-data-table` with one seamless numeric input per row (Qty), no Save/
Cancel actions, no dirty badge, no `initRowEdit()` call anywhere on the
page. The claimed per-row dirty-state behavior is real, but it belongs to
`/patterns/editable-grid`, not to what this page actually renders.
Reworded to say plainly this is a plain table here (deliberately kept
simple for this page's own scope) and point to `editable-grid` for the
fully-wired version — rather than removing the Qty input (which is a
reasonable, honest "preview" of the line-items shape) or fully wiring
`data-row-edit` into this page (which would duplicate `editable-grid`'s own
job).

**`.bo-form-actions`'s sticky-bar claim, checked against the actual CSS, not
assumed**: `form-section.css` confirms `position: sticky` +
`scroll-padding-block-end: 6rem` on the ancestor, exactly as Anatomy item 5
describes (WCAG 2.4.11 Focus Not Obscured). Credited, not just taken on
faith.

**The delivery-calendar section is the strongest single block found in the
whole sweep so far.** Real generated content (`monthGrid()`, not
hand-typed cells — the page's own comment explains this is deliberate,
citing the exact defect class this repo has produced before: rows labelled
with another row's name). Disabled days carry a real
`<button disabled>` plus a visually-hidden reason ("— dock closed"), not a
greyed-out span a screen reader says nothing about. The prose explains
*why* a native date input can't express this ("a native date input cannot
express... a SET of marked days") rather than just asserting the pattern is
needed.

## Verdict per element

| element | verdict | why |
|---|---|---|
| Opener | **keep** | already states who/what-done with the stakes named |
| Anatomy "Line items" claim | **reword** | claimed editable-grid's dirty-state behavior for a plain table; pointed to editable-grid instead |
| Sticky action bar claim | **keep** | verified against `form-section.css`, accurate |
| Delivery calendar | **keep** | generated from data, two-channel disabled-day reasons, reasoned prose |
| `.bo-form-row` auto-fit collapse | **keep** | stated as the mechanism (auto-fit, not a breakpoint), matches CSS |

## Recommendation

One reword (Anatomy's line-items claim). No removal, no new surface.
