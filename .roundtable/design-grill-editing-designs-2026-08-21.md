# Design grill — the editing designs: standalone field / data table / editable table (2026-08-21)

Owner ask: "grill the editable design. standalone field, data table,
editable table — simplicity, choose suitable design." A cross-cutting
grill of the framework's THREE editing designs, judged for simplicity and
context-fit.

## The three designs, and the verdict on the split itself: KEEP

| Design | Context it serves | Page |
|---|---|---|
| Bordered fields | Entry is the job — a form, or a grid of line items | detail-form, editable-grid |
| Seamless cells + row Save/Cancel | Reading is the job, corrections occasional | inline-editing, field-editor |
| WYSIWYG grid (every control seamless) | Entry that must LOOK like the read view | editable-grid's WYSIWYG section |

The three-way split is sound — each design's reason is the AFFORDANCE
rule the design-language page already states (bordered = "you can type
here"; plain = "this is a fact"). The failures were in execution, not in
the taxonomy.

## Finding 1 — editable-grid mixed all three designs in single demos (fix)

The entry-grid's demos put SEAMLESS inputs (read-mostly affordance)
beside BORDERED selects inside one joined control — the boxed-USD-plus-
naked-number oddity the owner's earlier screenshot surfaced — and the
product comboboxes were seamless while their neighbors were chromed. An
entry grid that hides half its affordances answers "what can I edit
here?" with "guess." **Fixed: every non-WYSIWYG section's inputs are now
bordered** (combobox cells, money amounts, quantity inputs, text/date/
numeric cells in Advanced and the full-picture PO editor, and the
canonical Markup const). The WYSIWYG section keeps seamless everywhere —
that IS its design, and its prose already argues it.

## Finding 2 — steppers in dense entry rows, against the page's own sibling doctrine (fix)

Six stepper buttons remained in editable-grid's dense rows — directly
contradicting the caption Slice 88 had just shipped on the Quantity page
("steppers belong on touch screens, not dense line grids"). All removed;
the qty cells collapse to the joined ( qty | unit ) form from Slice 81 —
one control, coherent with the rest of the family.

## Finding 3 — no chooser existed (fix)

Four pages carried the three designs and nothing told a consumer which
to pick. Added "Choosing the editing design" to `/components/inline-
editing` (the mechanics page): a three-row table — the screen's job →
the design → why — with the save-timing axis (batched row Save/Cancel
vs `data-row-edit="live"`) stated as the second, independent choice.

## Checked and cleared

- detail-form and field-editor already sit correctly on their sides of
  the split (bordered whole-record form; seamless SM30 correction).
- The row-edit machinery is design-agnostic (dirty tracking listens to
  inputs, not to their chrome) — no JS changed.

All verified live: zero steppers on the served page; entry-section
inputs compute the token border while WYSIWYG's compute transparent
(same page, same load); the money joint shows both halves boxed; the
chooser renders with working links.
