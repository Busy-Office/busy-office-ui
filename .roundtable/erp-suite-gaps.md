# ERP suite examples — the gap ledger

What building real screens out of the shipped framework could not do cleanly.
One entry per gap, written **when it was hit**, with the screen that hit it.
Promoted into `ROADMAP.md` slices in batches — this file is the raw log, the
roadmap is the decision.

**The rule that produces this file**: the example may not add a single line of
its own CSS (`check-erp-suite.mjs` enforces it). When a screen needs something
the framework has not got, the screen compromises visibly and the need lands
here. Without that rule, every gap becomes a local `<style>` block and the
instrument reads clean while telling us nothing.

**Status of the pilot**: Procure-to-pay, 3 document types, 8 real screens
(suite home, requisition list, requisition entry form, conversion preview, PO
list, PO document, invoice list, invoice document) + 5 honest module stubs. Gates: `check-markup` (every class exists), `check-erp-suite`
(no CSS, every link resolves), `audit` (axe at 1440 and 390, no sideways
scroll, and — added mid-pilot — no element spilling content past its
parent's edge). All green, with ONE allowlisted failure carrying its reason:
GAP-7.

**Read GAP-6 and GAP-7 first if you read nothing else.** They were found by a
SCREENSHOT after all three gates reported the pilot clean, and both are
defects in shipped code rather than missing surface. That is the quality
bar's screenshot step earning its place, again.

---

## GAP-1 — no module rail: the shell has one sidebar, a suite needs two levels

**Hit on**: every screen (`_shell.mjs`).
**Wanted**: the shape every multi-module ERP uses — a narrow always-visible
icon rail of modules, beside a wider column listing the current module's
documents. Switching module is one click from anywhere; the second column
re-populates.
**Have**: `sidebar-layout` gives ONE sidebar slot; `bo-sidebar-nav` gives
`__section` + `__heading`, i.e. one column with grouped links.
**Compromised to**: both levels stacked in the single sidebar — "Modules" as
one group, "Documents" as a second group beneath it. It reads fine at six
modules and two documents. It will not survive twelve modules, and the module
list scrolls away as the document list grows, which is exactly what a rail
exists to prevent.
**Shape of the fix (not yet decided)**: either a `--rail` setting on
`sidebar-layout` that admits a second, narrower slot, or an explicit
two-level `sidebar-nav` variant. Refusing is also a real answer — "compose two
`sidebar-nav`s inside a `bo-cluster`" may be enough, and if so the gap is a
DOCS gap, not a component one. Decide before building module two.

## GAP-2 — DECIDED 2026-08-23 — nothing documents "related documents"

**Verdict: RETHINK → a documented composition. No new component, no new CSS.**
The shape is **`bo-timeline`, ordered by lifecycle, one step per document TYPE
with that type's instances as links inside the step**, `data-state` carrying
done / current / rejected / pending and `aria-current="step"` on the current
one. Proved in `p2p/purchase-order` and `p2p/vendor-invoice` — two independent
compositions, which is the Objective's reusability bar — with the example's
no-CSS rule enforcing the "no new CSS" half rather than my asserting it.

**Why the chain and the related list are ONE surface** (the owner's Q16, tested
rather than assumed): group the related documents by type in lifecycle order
and mark the current one, and you have the chain. Rendered as two blocks, the
same records appear twice on one screen.

**Why not `bo-stepper`**, which is also an ordered chain with a current step:
it is horizontal and its steps share the row equally, so a step holding three
invoice links breaks it — and a PO with several receipts is the normal case,
not the edge. Vertical stacking is the whole reason `bo-timeline` fits.

**Why not the `bo-kv` list it replaces**: a kv row is a fact ABOUT this record;
these are navigable records with their own state. That was the original
complaint and it stands.

**Cost, stated**: the screen now carries two `bo-timeline`s (Document flow,
Approval). They are the same abstraction — an ordered chain with state — so
this is "one component, many settings" working as intended, but a reader could
conflate them at a glance. What separates them is the heading and the fact
that document-flow titles are links. Watch this on module two.

**DOCUMENTED 2026-08-23 (130.2c)**: `/patterns/object-page` carries a
"Document flow" section — in the live screen AND as guidance — with the three
rules the build settled (one step per document TYPE not per document;
instances are links inside the step; the current record gets
`aria-current="step"` and says "you are here"), plus the refusals (kv, table,
stepper) and the stated cost of two timelines on one screen.

**Writing that page found a defect in it**: the Approvals demo's three
`bo-timeline__marker`s were EMPTY, so their state was carried by colour alone
— against the component's own first comment, which says the glyph "is MARKUP
inside .bo-timeline__marker, so state is never color-alone". Fixed, and
`check-markup` now enforces it for every consumer of the published package
(red-proved on those three, with the adjacency case self-tested — two empty
markers in a row must report two, the trap that bit the bare-text rule).

*(original entry below)*

## GAP-2 (original) — nothing documents "related documents"

**Hit on**: `p2p/purchase-order`, `p2p/vendor-invoice`.
**Wanted**: the block every document screen in every ERP has — what this
record is connected to, with each entry's own status, navigable. A PO shows
its requisition, its receipts, its invoices; the invoice shows its PO and its
receipt.
**Have**: nothing. No component, no pattern, no guidance. Grepped the whole
docs tree for "related documents" and got zero hits.
**Compromised to**: a `bo-kv--rows` list with links and badges stuffed into
the value. That is the wrong shape and says so: these are *records with their
own state*, not facts about this one. A kv row cannot carry a status, a
timestamp and an action, and the reader cannot scan a column of them.
**Why it matters more than it looks**: this is the connective tissue of a
document-based suite. Every module needs it, on every document screen. It is
the single most-repeated thing the pilot could not build.
**Shape of the fix**: likely a small composition documented as a pattern
section (badge + link + meta in a `bo-stack`), NOT a new component — but the
composition has to be decided once and documented, or twelve screens will
invent twelve versions of it. Worth grilling against the Objective.

## GAP-3 — a segmented option cannot carry a count

**Hit on**: `p2p/vendor-invoices` (the triage views: All open · 128, Blocked ·
9, Mine · 14).
**Wanted**: the count beside each saved view. The count is the load-bearing
part — "Blocked · 9" is what makes a clerk click it; "Blocked" alone is a
filter nobody knows the size of.
**Have**: `bo-segmented` renders label text only.
**Compromised to**: the count typed into the label string. It works and it
scans, but nothing sets the count apart typographically, it cannot be styled
as secondary, and a consumer re-implementing this will guess at the separator.
**Shape of the fix**: probably a documented convention rather than CSS — the
same "one component, many settings" call the badge/count question got
elsewhere. Cheap either way; the risk is twelve screens each inventing a
different separator.

## GAP-4 — (a) RESOLVED 2026-08-23, (b) still open — three-way match has no
home: no grouped column header, no "this is the cell that disagrees" cue

**GAP-4a RESOLVED.** A grouped (two-row) column header needed no new class,
modifier or component — plain `<th scope="colgroup" colspan>` over
`scope="col"`, which axe accepts as-is. What it needed was a fix to something
already shipped: `.bo-data-table thead th` sets `position: sticky;
inset-block-start: 0`, correct for ONE header row and silently wrong for two —
both rows pin to the same offset. Measured after scrolling: the "Quantity"
cell and the "Ordered" cell beneath it occupied the IDENTICAL box (341-371),
so the group label was not merely overlapped, it was invisible. Header rows 2
and 3 now offset by `--bo-density-row-height`, the same token that sets the
row height, so it is exact at every density rather than a guessed number.
Capped at three rows (the `data-sticky-cols` precedent). Documented on
`/components/data-table` with a demo whose container actually scrolls — a
header sticks to its own scrollport, so on an uncapped docs page nothing pins
and a reader would see a static table. Claim 108 drives the scroll and
red-proved by stripping the rule from the BUILT css (`subOffset` 30px -> 0px,
overlap 0 -> 30).

**GAP-4b still open** — a cell-level "this is the one that disagrees" cue. The
genuinely new idea, and the one that risks becoming "colour the cell", which
the two-channel rule forbids. Grill before module two.

*(original entry below)*

## GAP-4 (original) — three-way match has no home: no grouped column header, no
"this is the cell that disagrees" cue

**Hit on**: `p2p/vendor-invoice`, the three-way match table.
**Wanted**: ordered / received / billed shown as three readings of ONE line,
grouped under spanning headers, with the disagreeing cell marked so the eye
lands on it. This screen is the reason AP exists.
**Have**: `data-table` with flat single-row headers. `data-row-state` marks a
ROW, not a cell. `comparison` is about choosing between options;
`reconciliation` is about two sides of a ledger. Neither is this.
**Compromised to**: a wide flat table with repeated column names ("Qty
ordered / Qty received / Qty billed") and a verdict badge at the end that the
reader must map back to a column by eye — the exact manual step the screen
exists to remove.
**Shape of the fix**: two separable pieces. (a) a grouped (two-row) column
header for `data-table` — mechanical, and useful far beyond this screen;
(b) a cell-level state cue, which is a genuinely new idea and needs grilling:
it risks becoming "colour the cell", which the two-channel rule forbids
outright.

## GAP-5 — RESOLVED 2026-08-23 — the object-page header modelled the record
title as a `<span>`, so a consumer who copied it shipped a page with no `<h1>`

**Hit on**: `p2p/purchase-order`, `p2p/vendor-invoice`. Caught by axe
(`page-has-heading-one`) on the pilot's first audit run — I had copied the
pattern faithfully and the result was inaccessible.
**Have**: `bo-widget__title` is a `<span>` in the component page, in every
pattern page, and in the canonical Markup samples. There is no note anywhere
that on a REAL screen the object page's record title is the page's `<h1>` and
the section widgets' titles are `<h2>`.
**Why the docs cannot see it**: every demo is nested inside the docs page's
own `<h1>`, so the docs' axe sweep is green while the copyable markup is not.
That is the whole argument for building this example.
**Compromised to**: `<h1 class="bo-widget__title">` on the record title,
`<h2>` on section headings — which works and is what the pattern should say.
**FIXED**: object-page's copyable sample now shows `<h1 class="bo-widget__title">`
for the record identity and `<h2>` for each section widget, with the reason
inline; dashboard's canonical sample and its API notes say outright that
`__title` is a CLASS, not an element, and that a `<span>` is only right when
something else on the page already provides the heading.
**No gate added, deliberately**: "the sample shows the right heading LEVEL"
is a semantic property, and a detector for it would have to decide when a
`<span>` is legitimately correct — which it often is. Per the project's own
rule, that stays judgement rather than becoming a gate that cannot fail.

## GAP-6 — `bo-stack` on `bo-app-shell__main` silently clips a scrollable
table

**Hit on**: every document screen, and found by a SCREENSHOT after three
gates had reported the pilot clean.
**What happened**: the reset zeroes margins, so a screen's sections ran
together. The framework's own answer to that is the `stack` primitive, so I
put `bo-stack` on `bo-app-shell__main` — the obvious composition.
`__main` is `overflow: auto`; making it a flex column makes its children
shrinkable, and the table container collapsed to **32px against a 198px
scrollHeight** — header row visible, all four data rows clipped away. Nothing
reported it: not axe, not the page-level overflow check, not check-markup.
**Compromised to**: the stack goes on an inner `<div>`, never on `__main`.
That works and is what the docs should say.
**Shape of the fix**: docs, plus possibly one defensive line. Two shipped
primitives that are each correct compose into silent data loss, and the
composition that breaks is the one a careful reader would try first.

## GAP-7 — RESOLVED 2026-08-23 — `bo-form-actions` did not wrap: a
three-button bar lost a button at 390

**Hit on**: `p2p/vendor-invoice` (Release for payment · Request credit note ·
Send back to vendor).
**Have**: `.bo-form-actions` is `display:flex; justify-content:flex-end` with
no `flex-wrap`. At 390 the row overflows to the LEFT, and because the bar is
`position: sticky` inside a clipping ancestor, the first button is simply
gone — 234px of it, measured.
**Why nothing caught it, here or in the docs**: content overflowing the START
edge does not appear in `scrollWidth`, so a page-level or container-level
overflow check reports clean. The docs' own action bars carry two short
buttons, which fit. The framework's standing lesson applies verbatim —
*measure the box that carries the constraint* — and the pilot's first
clipping probe fell into exactly that trap: it passed with the allowlist
emptied, i.e. it could not fail. Rewritten to compare each CHILD against the
PARENT's client box, it reports the defect immediately.
**Compromised to**: nothing. The example keeps the realistic three-button
bar, and `audit.mjs` allowlists `.bo-form-actions` **with the reason and a
pointer here** rather than trimming the screen to hide it.
**FIXED**: `flex-wrap: wrap` on `.bo-form-actions` (the existing `gap`
already spaces both axes). Claim 106 measures each button against the bar's
own client box at 390 — not its `scrollWidth`, which is the check that
reported this clean while a button was cut in half — and is red-proved by
stripping the wrap from the built CSS. A four-action demo on the Forms page
shows it. The example's audit allowlist is now EMPTY, which is how a debt
marker is supposed to end.

---

# Round 2 — the P2P document flow (2026-08-23)

Owner asked whether P2P should carry PR → PO → GR → invoice → payment.
Decided on shape coverage: **GR and Payment were REFUSED as already covered**
(`goods-receipt` + the RF screens; `bulk-actions` + `job-monitor`), and the
two uncovered shapes were built — PR creation and PR→PO conversion. Six more
gaps, five of them from the conversion screen alone, which is a strong signal
that document conversion is a genuine hole rather than a missing demo.

## GAP-8 — the transform statement has no surface

**Hit on**: `p2p/convert-to-po`.
**Wanted**: "3 requisitions → 2 purchase orders, grouped by vendor" rendered
as a *fact about the operation*, prominent and unmissable. It is the sentence
that tells the reader how many documents they are about to create.
**Have**: nothing. It sits in a `bo-alert` as prose.
**Why it matters**: creating the wrong number of purchase orders is not
undoable — you cancel documents a vendor may already have seen. The count is
DERIVED from a grouping rule the reader did not choose, so it must be stated,
not inferred.

## GAP-9 — "these sources became this result", again

**Hit on**: `p2p/convert-to-po`, each result group.
Same shape as GAP-2 seen from the other end: GAP-2 is "what is this document
connected to", GAP-9 is "what will this document be made from". Rendered as a
`bo-kv` row of links, the same compromise, which is the evidence that these
are ONE need. Merged into GAP-2 for the grill, per the owner's Q16 answer.

## GAP-10 — a derived total has no home and no stated owner

**Hit on**: `p2p/convert-to-po` (the button reads "Create 2 purchase orders ·
$44,560.00" — both numbers derived from which lines are ticked).
**Have**: nothing. Both are hand-typed here because the example ships no JS.
**The real gap is the CONTRACT, not the CSS**: nothing in the docs says who
recomputes a derived total as selection changes, or how the change is
announced to a screen reader. The framework already has this problem solved
next door — `data-table`'s selection count is a live region — but nothing
generalises it to "a number derived from a selection".

## GAP-11 — no row state for "deliberately excluded"

**Hit on**: `p2p/convert-to-po`, the unticked line.
**Have**: `data-row-state` ships `dirty`, `error`, `warning` — every one a
PROBLEM state. A line the reader chose to leave out is not a problem, and it
renders identically to an included line apart from its checkbox. Visible in
the screenshot: on a four-line conversion you can just about track it; on a
forty-line one you cannot see what you are dropping.
**Shape of the fix**: likely one more `data-row-state` value, and the
two-channel rule already forces the answer to be more than a colour — the
existing states pair a tint with a border accent, so an excluded row needs
its own non-colour cue too.

## GAP-12 — "Add a line" has no home

**Hit on**: `p2p/requisition` (PR creation).
**Have**: nothing. It is not part of `data-table`, not mentioned by
`editable-grid`, not in `form-section`. Rendered as a loose button under the
table — which is where every consumer will independently decide to put it,
differently. The most-pressed control on any document entry screen.

## GAP-13 — RESOLVED as a targeted fix, OPEN as a consolidation question

**Hit on**: `p2p/convert-to-po` at 390 — a single button labelled "Create 2
purchase orders · $44,560.00" spilled 15px past the bar even after GAP-7's
`flex-wrap` landed, because there is no line a too-long button fits on.
**Fixed**: `.bo-form-actions > .bo-btn` now wraps its label, with a claims
case (107) red-proved by stripping the rule from the built CSS.
**Still open**: that is the THIRD instance of one rule — `.bo-btn-group--bar`
(RF) and `.bo-state__actions` (119.1) made the same call, each citing WCAG
1.4.12. Three specific rules where one general one might do is exactly the
Objective's less-for-more test. The general form would be dropping
`white-space: nowrap` from `.bo-btn` itself, which changes every button on
every screen and needs its own grill — recorded, not guessed at.

## GAP-14 — a chain step can be PARTIAL, and `data-state` has no word for it

**Hit on**: `p2p/purchase-order` and `p2p/vendor-invoice` — both, which is what
makes it a gap rather than one screen's awkwardness. Found by looking at the
rendered screen, not by a gate: every gate was green with the defect present.
**What happened**: building GAP-2's document flow, the goods-receipt step is
*partially* complete — 1 of 2 lines received. `bo-timeline`'s four states are
`done`, `current`, `pending`, `rejected`. Marking it `done` paints a green tick
over the words "1 of 2", which is the screen contradicting itself; marking it
`pending` says nothing has started, which is also false.
**Compromised to**: `data-state="pending"` with a half-filled marker glyph
(`◐`), so the glyph carries what the state cannot. It reads correctly and it
costs nothing, but the *state* is still wrong underneath — a consumer filtering
on `data-state` sees "not started".
**Why it is not just this screen**: partial completion is everywhere in ERP —
partial receipt, partial payment, partial delivery, partial allocation. Any
chain that models real documents will hit it on its second screen, as this one
did.
**Shape of the fix (not decided)**: a fifth `data-state` value, or the honest
refusal that a chain step is binary and partial belongs in the meta text. The
two-channel rule already forces any new state to bring a non-colour cue, and
the marker glyph is that cue — which is a point in favour of it being cheap.
Grill it before module two, alongside GAP-11's excluded-row state, since both
ask the same question: *does this component need one more state, or is the
state list deliberately short?*

---

## Not gaps (checked, and the framework was right)

- **List screens**: `list-report` covered the PO list end to end — filters,
  toolbar, bulk actions, the priority ladder, pagination. Nothing missing.
- **Approval trail**: `bo-timeline` carried the PO's approval chain with its
  markers, states and meta, unchanged.
- **Money**: `bo-amount` with `--negative` carried the variance. My first
  attempt guessed `--danger`; `check-markup` rejected it and named the real
  one, which is the gate working as designed.
- **Density**: `data-density="compact"` on the containers did what an ERP
  screen needs without a single override.
