# ERP suite example — a gap-finding instrument

Static screens for a six-module ERP suite, built only from what
`@busy-office/ui` ships. Its job is not to look impressive: it is to find out
what the framework is missing by making someone build real screens with it.

```sh
node build.mjs          # render the screens to dist/
node serve.mjs          # browse them
node check-erp-suite.mjs        # no CSS of its own, every link resolves
node audit.mjs                  # axe at 1440 and 390, no sideways scroll
node ../../packages/core/scripts/check-markup.mjs dist   # every class is real
```

## The rule

**This example may not add a single line of its own CSS.** No `.css` file, no
`<style>` block, no inline style except a documented framework custom property.
`check-erp-suite.mjs` fails the build otherwise.

When a screen needs something the framework has not got, it compromises
*visibly* — with a comment in the source saying what was wanted and what was
settled for — and the need goes in `.roundtable/erp-suite-gaps.md`. Without
that rule every gap becomes a local style block, and the example reads clean
while telling us nothing.

## What is here

Procure-to-pay is built (purchase orders, vendor invoices: a list and a
document screen each, plus the suite home). The other five modules are honest
stubs so that every entry on the rail lands somewhere — greying them out would
misrepresent a real deployment where all six exist.

Screen **bodies** are hand-authored, one file each, on purpose: a generated
grid of identical screens would hide exactly what this exists to expose. Only
the chrome — rail, breadcrumbs, navbar — is rendered once, in `_shell.mjs`,
because hand-copying it into twenty files is the bulk-edit hazard CLAUDE.md
warns about.

## Scope

Static and UI-only, per the owner's framing: cross-module references are
**links**, never data. Whether an invoice really posts to the GL is an API
question and explicitly out of scope — what this example tests is whether the
UI framework can express the connection at all. (It could not: see GAP-2.)
