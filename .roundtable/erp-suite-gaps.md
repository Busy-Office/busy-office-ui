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

## GAP-1 — DECIDED 2026-08-24 — no module rail: the shell has one sidebar, a
suite needs two levels

**Verdict: RETHINK → the gap is real and MEASURED, and the rail is deferred
behind a stated trigger rather than guessed at.**

**The defect, measured** on the pilot's own shell (7 module entries, sidebar
224px wide), by growing the document group and scrolling to its end:

| viewport | documents in the module | modules still reachable |
|---|---|---|
| 900px | 3, 7, 11 | yes |
| 900px | 17, 23 | **no** |
| 700px | 3, 7 | yes |
| 700px | 11, 17, 23 | **no** |

So the compromise fails at **11 documents in one module on a 700px laptop**.
The P2P pilot has three, and O2C (130.3) will have two — neither exercises it.

**Why not build the rail now.** A second, narrower slot means changing
`.bo-app-shell`'s grid, which is the most-composed layout in the framework,
on a case no shipped screen has. The reusability rule is explicit — nothing
ships for one screen, and here it would ship for *zero*. The cheap
alternative was considered and rejected on its own measurement: making the
modules group `position: sticky` keeps them reachable but spends 224px of a
652px sidebar permanently — 34% at seven modules, about half at twelve. That
trades the defect for a smaller rail, which is why real suites use an ICON
rail (collapsing horizontally, ~48px) rather than a sticky group.

**What shipped instead**: the limit is documented where a consumer meets it.
`/components/sidebar-nav` now states the measured numbers, and says what to do
at that size — move the long list into the PAGE (a tab strip or an anchor bar
belongs to the screen, not the chrome) or split the module.

**The trigger to revisit**: a real screen with more than ten entries in a
single sidebar group. Not a hypothetical, and not a date.

*(original entry below)*

## GAP-1 (original) — no module rail: the shell has one sidebar, a suite needs two levels

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

## GAP-3 — RESOLVED 2026-08-23 — a segmented option cannot carry a count

**Verdict: one line of CSS, then a documented convention. No part, no
modifier, no component.**

The count is **muted tabular text as a second child of the option** —
`<span class="bo-u-text-muted bo-u-tabular">128</span>` — which is the
treatment the framework already ships for a count under another name:
`.bo-data-table__selection-count` is xs + text-secondary + tabular-nums. A
count is not a status, so it is not a badge.

**Not a badge, and that is measured**: at compact density a `bo-badge` renders
**24px tall inside a 24px segment**, filling the option edge to edge. The
muted span renders 20px in the same 24px slot. Where there IS room and the
number really is a status — a task tile, a nav row — the badge stays right.

**The one real framework gap was a missing `gap`.** `.bo-segmented__option` is
`inline-flex` with no gap, so any second child sat against the label. Adding
`gap: var(--bo-space-2)` changed the width of **zero** existing options across
every page of the docs site — an option with one text run has one flex item,
so there is nothing to space — measured before shipping, not reasoned about.

**Instrument note, in the spirit of the standing rule**: the first probe for
this reported "113 pages have a segmented control", which is nearly every page
— because the docs shell's own density switcher is one. That is the
chrome-counted-as-content trap, third time in this repo. The measurement that
counted was taken on the example's real triage views instead.

*(original entry below)*

## GAP-3 (original) — a segmented option cannot carry a count

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

**GAP-4b RESOLVED 2026-08-24 — and it was already shipped.** The gap said
"`data-row-state` marks a ROW, not a cell". True, and beside the point:
`data-tone="danger|warning|success"` marks a **cell**, ships `data-tone-text`
for the value, and carries a forced-colors block. The gap looked at the row
attribute and missed the cell one.

The two-channel worry was right, though, and Slice 124's guideline had already
answered it: `data-tone` must never be the ONLY channel, because both its tint
and its leading bar are colour. So the disagreeing cell also carries a
visually-hidden word, and the verdict badge still says what KIND of
disagreement it is. Three signals, only one of them colour, and the eye lands
on the cell instead of mapping a badge back to a column.

**The composition failed on its first measurement, and that is the finding
worth keeping.** With `data-row-state="warning"` still on the row, the toned
cell's computed fill was `rgb(255,251,235)` — **byte-identical to its untoned
neighbours**, because the row tint IS the warning tint. A cell cue inside a
toned row marks nothing at all. Removing the row state was not tidying, it was
the fix. That is Slice 124's rule arriving from a new direction: tone stops
working the moment it is applied to everything in view.

**No new framework surface. Zero new CSS.**

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

## GAP-6 — FIXED 2026-08-24 — `bo-stack` on `bo-app-shell__main` silently
clips a scrollable table

**Reproduced precisely before fixing, and the first two attempts did NOT
reproduce it** — which is why the precondition is now written down rather than
described loosely. Adding `bo-stack` to `__main` on a docs demo changes
nothing (that shell is not height-constrained), and adding it on the suite's
own PO screen changes nothing either (the container sits inside an inner
`bo-stack` div, which is the compromise this gap recorded). The collapse needs
**a scroll container that is a DIRECT flex item of a height-constrained flex
column**: constructed that way, `clientHeight 0` against `scrollHeight 200`.

**Fixed at the primitive**: `.bo-stack > * { flex-shrink: 0 }`. A stack
distributes RHYTHM, not space, so a stack that does not fit should overflow
its scroller visibly rather than squeeze its children away — and the squeeze
is silent precisely because a flex item that is itself a scroll container has
an automatic minimum size of zero. Re-run against the reproduction: 200/200,
nothing hidden.

**Blast radius measured before shipping, not after**: applied to every
`.bo-stack` child on the docs site — 3346 of them at two widths — **zero**
heights changed. It only bites where a stack was being squeezed, which is the
bug.

`/concepts/layouts` documents the composition anyway, because the advice is
about which element owns the spacing, not only about the collapse.

*(original entry below)*

## GAP-6 (original) — `bo-stack` on `bo-app-shell__main` silently clips a scrollable
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

## GAP-8 — DECIDED 2026-08-23 (with GAP-10) — the transform statement

**GAP-8 and GAP-10 are ONE need, and the merge was tested rather than
assumed**: GAP-8 is a COUNT of documents derived from a grouping rule, GAP-10
a TOTAL derived from a selection. Both are *a fact about what this operation
will do, derived from what is currently ticked, that must be restated when it
changes*. Same shape, same answer.

**Verdict: no new surface. Placement, wording, and a contract that already
exists.**

- The statement belongs **next to the primary action**, not only at the top of
  the screen: the reader decides at the button, and the count goes IN the
  button's label — "Create 2 purchase orders · $44,560.00". The example
  already did this half correctly.
- The grouping RULE ("one PO per vendor") is stated in prose beside it,
  because it is the thing the reader did not choose and cannot infer.
- Changes are announced through the live-region recipe the framework already
  documents — see GAP-10 below.

*(original entry below)*

## GAP-8 (original) — the transform statement has no surface

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

## GAP-10 — MOSTLY NOT A GAP, 2026-08-23 — a derived total has no home and no
stated owner

**The premise was wrong on both counts, and the source says so.** The claim was
that "nothing in the docs says who recomputes a derived total as selection
changes, or how the change is announced". `initTableSum` ships the recompute
(`data-sum-of`) and its documented contract states the announcement rule
outright: *announce on COMMITTED change, not per keystroke — `aria-live` on
the cell itself speaks on every keystroke, since sums recompute on input;
leave the visible cell plain, add a visually-hidden `aria-live="polite"`
status near the table, write one summary into it from a `change` listener*.
There is a working implementation on `/patterns/editable-grid`, and the
contract reaches `/concepts/js-behaviors`, which is generated from that
docstring.

**What is genuinely uncovered**, and deliberately: a total over the SELECTION
rather than over all rows. `data-sum-of` sums every tbody field of that name,
checked or not — because which rows count is a business rule, and the
framework's own line is "framework does visuals, you do the data".
`initTableSum` is the named exception for the universal case; a grouping rule
is not universal.

**So the real defect was DISCOVERABILITY**, and that is fixed: someone
building a conversion screen has no reason to read the editable-grid pattern.
`/components/data-table` — the page that owns selection — now says that a
number derived from the selection is yours to compute, points at the
live-region contract, and says why `data-sum-of` deliberately ignores the
checkboxes.

*(original entry below)*

## GAP-10 (original) — a derived total has no home and no stated owner

**Hit on**: `p2p/convert-to-po` (the button reads "Create 2 purchase orders ·
$44,560.00" — both numbers derived from which lines are ticked).
**Have**: nothing. Both are hand-typed here because the example ships no JS.
**The real gap is the CONTRACT, not the CSS**: nothing in the docs says who
recomputes a derived total as selection changes, or how the change is
announced to a screen reader. The framework already has this problem solved
next door — `data-table`'s selection count is a live region — but nothing
generalises it to "a number derived from a selection".

## GAP-11 — NOT A GAP, 2026-08-23 — my bug, not the framework's

**Verdict: REFUSE a new `data-row-state` value.** The complaint was that an
excluded line renders identically to an included one. It did — because the
conversion screen wrote `class="bo-checkbox"` and left off
`bo-data-table__row-select`, the class the framework's own rule keys on:
`tbody tr:has(.bo-data-table__row-select:checked)` fills the row with
`--bo-color-bg-selected`. The docs' canonical markup carries both classes; I
copied one.

Measured after fixing it, in both themes: included rows
`rgb(240,253,250)` / `rgb(11,59,55)`, the excluded row transparent —
**distinct, with the checkbox as the non-colour channel**. Nothing to add.

**What this says about the gates**, and it is the useful part: `check-markup`
verifies every `bo-*` class EXISTS, so a row that uses a real class and omits
the one that does the work passes clean. That failure mode is invisible to it
by construction, and it is the second time this pilot has produced one (the
first was `bo-amount--danger`, which check-markup DID catch because the name
was invented). Copying a canonical sample partially is the risk; the gate
covers wrong names, not missing ones.

*(original entry below)*

## GAP-11 (original) — no row state for "deliberately excluded"

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

## GAP-12 — RESOLVED 2026-08-23 — "Add a line" has no home

**Verdict: it has one now, stated once. No new part, no new CSS.**

**Below the table, in a cluster — never in `.bo-data-table__toolbar`.** The
rule, and the reason it is decidable rather than a matter of taste: the
toolbar acts on rows that ALREADY EXIST (bulk actions, filter, the selection
count), while this creates one that does not — and the new row is appended at
the END, so a control at the top produces a result the reader cannot see. The
section's own gap does the spacing; the cluster primitive holds the button.

**The gap's own prediction came true inside this repo.** It said "every
consumer will independently decide where to put it — differently", and two
already had: `/patterns/editable-grid` used
`<p style="margin-block-start: var(--bo-space-3)">` with the label "+ Add
line", and the requisition screen a bare `<p>` labelled "Add a line". Same
control, two spellings, one hand-typed margin. Both now agree, and
editable-grid documents the rule.

*(original entry below)*

## GAP-12 (original) — "Add a line" has no home

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
**Consolidation question ANSWERED 2026-08-23 (Standardize): REFUSE the
general form.** Two corrections came out of measuring it rather than
reasoning about it.

**The premise was wrong.** This is the SECOND instance, not the third:
`.bo-state__actions` is `flex-wrap` on the CONTAINER — the bar wrapping onto
another line — while `.bo-btn-group--bar > .bo-btn` and
`.bo-form-actions > .bo-btn` wrap the LABEL inside the button. Different
declarations solving different problems; only two of them are the same rule.

**The general form fixes nothing.** Removing `.bo-btn`'s global
`white-space: nowrap` and re-measuring every docs page: at 1440px **zero**
buttons change. At 390px exactly **four** do — "Open log", "View result",
"Open result", "Create / find…" — and all four ALREADY FIT: each sits inside
its parent with 4px to spare, zero parent overflow, full text visible. So the
change would turn four correct one-line buttons into two-line buttons inside
table cells, moving row heights, and buy no accessibility at all.

**What was consolidated is the KNOWLEDGE, not the CSS.** The rule of thumb —
nowrap by default because a button is a target and a target whose height
depends on its label makes rows jump; a label wraps only where the button is
forced into a slot it cannot escape — is now stated once in
`form-section.css`, referenced from `button.css`, and given to consumers on
`/components/button`. Merging the two selectors into one cross-component rule
was considered and refused: `api.json` is extracted per directory, so a rule
in `button.css` naming `.bo-form-actions` would misattribute that class to
the button component and corrupt generated docs.

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
**DECIDED 2026-08-23: REFUSE the fifth state.** Grilled with GAP-11, since
both asked whether the component needs one more state. Both answers are no,
for different reasons.

The marker is the CONSUMER's markup, so `◐` already carries partial-ness on
the channel that matters — the non-colour one. A `partial` state would add a
value to learn and a colour pairing to gate, and would buy only two things:
an un-greyed title and a distinct marker tint. The greying is not actually a
lie: `pending` renders a step as *not complete*, and a partial step is not
complete. The only thing it misstates is "nothing has started", and the glyph
and the meta line both say otherwise, explicitly.

**What the grill DID surface, and it is a docs fix rather than CSS**: in a
document flow `current` means *the record you are looking at*; in an approval
timeline it means *the step in progress*. One value, two meanings, on two
timelines that can sit on the same screen. `/patterns/object-page` now states
which meaning applies in a flow, and that a flow has exactly one `current`.

## GAP-15 — FIXED 2026-08-24 — a grouped column header landed over its last
column, not its span

**Hit on**: `o2c/sales-order` (module two), and present in the docs demo that
shipped with GAP-4a — so it was introduced by the fix for GAP-4a and found by
the next module, which is exactly what module two is for.
**What happened**: a `th[colspan]` heading three numeric columns inherits
their alignment (`end`), so the word "Quantity" sat over "Confirmed" alone.
Measured: **229px off the centre** of the span it heads.
**Fixed**: `.bo-data-table thead th[colspan] { text-align: center }` — a group
header owns its span. `thead` only, because a `th[colspan]` in the BODY is a
row-group heading ("CC-4021 — Warehouse"), which labels the rows beneath it
and belongs at the start. Re-measured after: 0px off centre.

## GAP-16 — FIXED 2026-08-24 — a totals row looked like another record

**Hit on**: `o2c/customer-invoices` (module two), a receivables ageing screen.
**What happened**: a `<tfoot>` cell was **byte-identical** to a body cell —
same background, same font weight, no border, measured — so "Total
outstanding · 136,310.00" sat in the same visual register as a customer's row.
On a screen whose whole job is "who do I chase", that is a misread waiting to
happen.
**Fixed**: `.bo-data-table tfoot :is(th, td)` gains a 2px rule above and
semibold figures. Two channels, neither colour alone. All six `<tfoot>` uses
in the docs are totals or sums and every one of them wants this — measured
before shipping, not after.
**Found by screenshot**, again, after all three gates were green.

---

## Module two's count (roadmap 130.3, in progress)

The pilot found **13** gaps. Module two, both document types built, found
**two**: GAP-15, a defect in the pilot's own fix (a group header landing over
its last column), and GAP-16, a totals row indistinguishable from a data row.
Neither is missing surface for a NEW kind of screen — one is a regression and
one is a treatment nobody had needed until a screen with totals existed. Everything
130.2 settled was spent rather than re-decided: the grouped header, the
cell-level tone on the disagreeing cell, "+ Add line" below the table, the
document flow as a timeline, the cell-link on list rows, and muted tabular
counts in the segmented views. Zero new CSS was needed to build the screens;
the one line added was to correct GAP-15.

---

## Module three — CRM (2026-08-24)

The first module that is NOT a document. An account is master data: no
posting date, no approval, no document flow, never "done". That was the point
of building CRM third — 130.3's checkpoint said the rest were mechanical, and
a claim like that is only worth testing against a shape the suite has never
built.

**One framework gap, one gap of my own.**

- **GAP-18 (framework, FIXED).** *Logged as GAP-17 on 2026-08-24 and
  renumbered the same day: a second, unrelated GAP-17 — the list-screen
  create action — was written into the ledger independently, and my
  `git add -A` swept it into commit 622a5cc under an unrelated message. Two
  gaps briefly shared a number. The create-action entry keeps 17 because it
  is the one carrying a `## GAP-N` heading and the one external notes refer
  to; this one moves. The build-loop's own rule — add named files, never
  `-A` — is what would have prevented it.*

  `bo-stepper` overlaps its own markers at
  five steps. The opportunity screen is the first thing in the suite with a
  five-stage chain, and at 390px each marker sat **10px past its own step's
  right edge** — measured, then explained by arithmetic rather than guessed: a
  non-first step needs connector 16 + its 16px margins + the 8px gap + a 28px
  marker = **68px minimum**, and `min-inline-size: 0` lets the step collapse
  to 58px, so a `flex: none` marker spills. **Four steps fit at 72.5px each;
  five do not**, which is why three modules of four-step flows never surfaced
  it.
  Fixed at the component: below 30rem the labels are already hidden, so the
  connector's spacing buys nothing and tightening it drops the per-step
  minimum to 52px (six steps fit); `min-inline-size: auto` stops the step
  collapsing under its own marker; and `flex-wrap` on the stepper catches
  anything beyond that. A stepper that wraps still says which step you are
  on — one whose markers overlap does not.

- **Mine, not the framework's.** An empty `<th>` on the contacts table.
  `audit.mjs` caught it (`empty-table-header`) before it was committed, which
  is the gate doing its job.

**What the master-data shape did NOT need.** No new component. The account
record is `bo-widget` header + `bo-kv` + two `bo-data-table`s, and the
interesting judgement was what to leave OUT: **open items are not a document
flow**. They are unrelated transactions that happen to share a customer, so a
timeline would imply an order that does not exist. The opportunity screen does
use a stepper, but for a FORECAST — a deal can move back a stage, which no
document flow in this suite can do.

Running count: pilot 13, module two 2, module three 1. The trend 130.3
predicted is holding.

---

## GAP-17 — 2026-08-24 — a list screen has no standing way to CREATE a
record; `list-report` only offers the action inside the empty state

**Screen**: `p2p/purchase-orders.screen.mjs`, corrected by two independent
external ERP screenshots (a Frappe purchase-order list, a Frappe stock
ledger) — both put a primary "create" action, a refresh, and an overflow
menu in a header row above the table. Neither reference was copied (the
project rule is references are a floor, not a target — both also do things
worse: color-only progress bars, an ID column truncated to unreadability,
row-level social icons out of scope for this framework); the pattern they
agree on independently is what's worth checking against.

**Screenshotted at `localhost:65072/p2p/purchase-orders.html`**: breadcrumb,
`<h1>Purchase orders</h1>`, then straight into the filter form and table.
There is no control anywhere on the page that creates a new purchase order.

**Why this is a real gap and not a screen mistake**: `apps/docs/src/pages/
patterns/list-report.astro`'s own states table (line 244) names the pattern —
`.bo-state--empty` "with the primary action (Create invoice)" — but only for
the EMPTY state. Every screen in this suite has rows, so that state never
renders, and the pattern page never shows a primary action that stands
whether the table is empty or full. The primitives needed already exist
(`bo-btn--icon`, `dropdown`) — this is a documentation/composition gap, not a
missing component.

**Corrects the "Not gaps" verdict below**, which had checked `list-report`
against filters/toolbar/bulk-actions/pagination and missed that none of those
cover record creation.

**Fix**: add a header-actions row to the pattern (primary "+ New" button,
optionally refresh/overflow) that renders regardless of row count, then apply
it to `purchase-orders.screen.mjs` and any other suite list screen missing it.

**PROMOTED 2026-08-24 → ROADMAP Slice 139.** The number that decided it:
**6 of 7 suite list screens have no create action** — only `purchase-orders`,
where the gap was found. The other six span three modules and were each built
by following the pattern page, so this is one missing line copied six times
rather than six oversights. Objective test passes on all three arms; GAP-2's
resolution (which updated `object-page.astro`) is the precedent for fixing a
documentation gap in the documentation. The generalisation to detail/report/
form shapes was **refused for now**: those screens carry `bo-form-actions` at
the foot, so they have a placement, not an absence — and the only evidence for
moving it is external, which this ledger's own rule does not act on.

**Corroborated 2026-08-24** by three more external screenshots (a document
detail screen, a report/dashboard screen, a journal-entry form) — all three
put the same header-action row (refresh, overflow, a primary action) above
the content, on screen SHAPES beyond just the list. Everything else in those
three screenshots checked out as already covered or already beaten: `tree
-table`'s docs already hand bulk expand/collapse to app code over the
existing per-row event (so "Set Level"/"Collapse All" needed nothing new);
`filters` already renders one removable chip per active value, which is more
legible than a collapsed "5 values selected" label; a right-rail
Assign/Attachments/Tags/Share panel is Frappe collaboration chrome, out of
this framework's scope same as the row-level heart/comment icons rejected
above.

---

## Predictions for the remaining modules (recorded 2026-08-24, BEFORE building)

The instrument grill found that all seventeen gaps came from a new **shape**
(9) or from **stress** on an existing one (4), or were my own bugs and doc
defects (4) — and **none** from a new domain. If that is right, the remaining
modules are worth exactly the shapes they force, and their yields are
predictable. Written down here, before any of them is built, so that being
wrong is informative rather than deniable.

| Module | Shapes it forces | Predicted gaps | Actual |
|---|---|---|---|
| **Production** | multi-level BOM hierarchy with rolled-up quantities; capacity/utilisation over time; the MRP derived-action panel | **2-4 (highest)** | **0 — prediction wrong** |
| **Inventory** | stock by item × warehouse (cross-tab) | **0-1** | _to fill_ |
| **Finance** | journal entry that must balance to zero before posting; payment list + detail | **0** | _to fill_ |

**Three named predictions**, each falsifiable:

1. **Intensity over a long date grid is a real gap.** Capacity/utilisation
   across a quarter has no home: `schedule` is a month grid for discrete
   bookings, `timesheet` is numeric entry for one period, and the colour ramp
   in `scales.json` ships **no `bo-scale` utilities**, so markup cannot apply
   it. Two-channel makes it harder still — colour-only intensity is already
   refused here. *Falsified if a capacity screen can be built from existing
   surface without new CSS.*

2. **The MRP panel is NOT a gap.** GAP-8's settled answer — restate the
   action's effect in the primary button label — carries "Get Raw Materials
   For Production" without new surface. *Falsified if the checkboxes-configure
   -a-derived-action shape needs something GAP-8 does not give.*

3. **The cross-tab is NOT a gap.** `comparison` documents a candidates ×
   criteria grid, and `data-table` ships `--sticky-col` / `data-sticky-cols`
   beside its sticky header, so the hard part — holding the row header still
   while both axes scroll — is solved. *Falsified if a data cross-tab (many ×
   many, scanned for a number) needs what a decision grid (few × few, pick
   one) does not.*

**A module that finds zero is a success.** It is the evidence for stopping at
shape coverage instead of grinding through six domains, which is the only
outcome that would let this roadmap DELETE work rather than add it.

---

## Module four — Production (2026-08-24): the predictions scored

Four screens — production orders, production order (with the MRP panel), BOM,
capacity. **Zero framework gaps. Predicted 2-4. The prediction was wrong**, and
the way it was wrong is the useful part.

**Prediction 1 — "intensity over a long date grid IS a gap" — FALSIFIED.**
The claim was that a capacity screen could not be built from shipped surface
without new CSS. It could. `--sticky-col` pins the work-centre names while the
weeks scroll, `data-tone` carries three buckets, `bo-u-tabular` aligns the
figures, and the audit passes at both widths with zero local CSS.

What survives is much narrower than what was claimed: there is **no continuous
ramp** — `scales.json` has eleven steps and ships no `bo-scale` utility — so
the screen is three buckets, not a heatmap. **And that is arguably better, not
worse.** The two-channel rule forces the number into every cell regardless;
once "126%" is written there, a continuous shade is decoration that would also
need a legend and still could not be read precisely. The reference screenshot
that started this — uniform gray GitHub squares — has no number in any cell
and cannot answer "by how much".

This is the *references are floors* rule paying out in an unexpected
direction: the framework's constraint produced the better screen. Logged as
**not a gap**, and the watch item from 140.1 is closed rather than left open.

**Prediction 2 — "the MRP panel is NOT a gap" — CONFIRMED.** The
checkboxes-configure-a-derived-action shape is a plain `fieldset` of
`bo-choice` rows, and GAP-8's answer carried it exactly: the button says
**"Create 2 purchase requisitions"** rather than naming a feature, so no
separate "this will do X" statement was needed — which is the surface GAP-8
refused. Nothing new.

**Prediction 3 — "the cross-tab is NOT a gap" — CONFIRMED EARLY.** The
capacity screen *is* a cross-tab (work centre × week), so this was answered
before Inventory was built. `--sticky-col` holds the row header while the
columns scroll, which was the hard part.

**BOM needed nothing either.** `tree-table` carried a three-level hierarchy
with `data-tree-level` and its toggle/spacer parts. Rolled-up quantities are
two numeric columns — per-parent and total-required — which `data-table`
already does.

**One gap of my own, caught before it shipped**: I guessed a class name
`bo-checkbox-row`. It does not exist; the real one is `bo-choice`. Found by
checking `api.json` rather than by the gate, but the gate would have caught
it — the same shape as the `--danger` guess in the pilot.

### What this does to the plan

The Sequence's own clause said it: *"If Production finds zero, the thesis is
wrong in an interesting way — the remaining modules would be re-argued rather
than ground through."* Production was the **highest**-predicted module and it
found nothing. Inventory was predicted 0-1 and its distinctive shape has
already been proven covered; Finance was predicted 0.

So the honest reading is that **the instrument has stopped paying for itself
on new modules**. Running count: pilot 13, module two 2, module three 1,
module four **0**. That is not a reason to distrust the suite — it is the
suite reporting that the framework now covers the shapes an ERP needs, which
is the outcome the whole exercise was for.

---

## Not gaps (checked, and the framework was right)

- **List screens**: `list-report` covered the PO list end to end — filters,
  toolbar, bulk actions, the priority ladder, pagination. **Correction,
  GAP-17**: it does not cover record creation outside the empty state.
- **Approval trail**: `bo-timeline` carried the PO's approval chain with its
  markers, states and meta, unchanged.
- **Money**: `bo-amount` with `--negative` carried the variance. My first
  attempt guessed `--danger`; `check-markup` rejected it and named the real
  one, which is the gate working as designed.
- **Density**: `data-density="compact"` on the containers did what an ERP
  screen needs without a single override.
