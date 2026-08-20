# Design grill — the "Data input" and "Values" sidebar groups (2026-08-21)

Owner-requested group-level grill: after the Slice 76.2 taxonomy fix
(Quantity moved into "Data input" next to Money), judge both groups as
wholes — does every member match its group's identity, and does each
entry earn its place?

## The census

**Data input (8):** Forms, Combobox, Filters, Money, Quantity, Tag input,
File upload, Rich text — every member is an editable control; Forms leads
as the anatomy page; the editable pair Money/Quantity sit adjacent. All
match the group identity. **Keep, all.**

**Values (3):** Amount, Date, Key-value facts. Amount is display ✓.
Key-value facts checked, not assumed: its only `input` mentions are
anti-pattern warnings ("not readonly inputs", "a fact that is secretly an
input misleads assistive tech") — genuinely display-only ✓.

## Finding — Date sat undifferentiated as a current peer; it's deprecated (fix)

`/components/date` is a deprecation page: `.bo-date` scored 1 of 12 in
the surface review (the framework's lowest), ships no forced-colors rule,
is not density-aware, no screen uses it, and its one worthwhile decision
(overdue is two-channel) moved to Amount. The page itself is honest — a
prominent warning, the replacement recipe, "still works this major."

The sidebar wasn't: "Date" sat mid-list in Values with nothing marking
it, indistinguishable from current members. A reader scanning for "how do
I show a date" clicks a peer-looking entry and lands on a deprecation
notice. Removing the entry isn't the answer — the page-shape gate
requires every component page to have a sidebar entry, and hiding a
deprecation kills the discoverability that IS the page's purpose.

**Fixed with the precedented parenthetical label style** ("Goods receipt
(RF scanner)" already exists in the sidebar): **"Date (deprecated)"**,
and moved to LAST in the Values group — a deprecated surface shouldn't
sit between two current members as their peer. The reader now knows
before clicking.

**Checked for the same defect elsewhere:** `icon.astro` also matches a
"Deprecated" grep, but that's a section about deprecated *glyphs* inside
a live component — not a deprecated page. Date was the only instance.

## Considered, not done

- **A date-entry demo in "Data input"** — the group has no editable-date
  member, and forms.astro shows no `type="date"` input. But the answer
  ("a plain native `<input type="date">` — nothing to add") already lives
  on date.astro's editable section, one click from the annotated entry.
  Adding a demo elsewhere would be a second home for one sentence.

## Verdict summary

| Element | Verdict | Why |
|---|---|---|
| All 8 Data-input members | keep | each is an editable control; anatomy-first ordering; the editable pair adjacent |
| Amount, Key-value facts | keep | display-only, verified not assumed |
| "Date" sidebar label + position | **reword + move** | deprecated surface presented as a current peer; now "Date (deprecated)", last in group |
| Removing Date's entry | refuse | page-shape gate requires the entry; hiding a deprecation defeats its purpose |
| A date-entry demo in Data input | refuse | the one-sentence answer already has a home one click away |
