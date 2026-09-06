# The bar

The gauntlet loop only works against something concrete. Vague bars let the
builder argue its way past the critic. `LOOPS.md` §7 is the playbook; this file
is what a critic grades against.

**Adapted from the owner-supplied contribution (Slice 294), not adopted as
shipped.** Its classes were written for a consuming project and referenced
`ui_kits/`, `explorations/` and an `assets/` screenshot that do not exist in
this tree. The classes below are this repo's, and every reference named is a
path that is actually here — a bar citing a file nobody can open is not a bar.

**The goal these classes serve (owner, 2026-09-06): the next generation of ERP
UI — performant, user-centric, scalable, secure, modern.** Those five words are
not gradeable as written, so each class below turns the ones it can reach into
something measurable. Where a property has no instrument yet, the class says so
rather than inviting the critic to judge it by feel.

## What every class requires

Not repeated per class. A miss here is a FAIL regardless of the class:

1. Every class on every element exists in `packages/core/src/css/components/**`
   — `check:markup` over the built output is the instrument, and it already
   runs in `docs:build`.
2. Semantic tokens only. No `--bo-palette-*` in a component, no raw hex outside
   `@media print`.
3. Two channels on every state signal: a word or glyph **and** an ARIA or
   `data-*` attribute. Colour alone is a defect.
4. Contrast passes `check:contrast` in **both** themes.
5. No console errors; no resource that fails to load.
6. Named `@container` queries; no `!important`.

## Class A — a screen recreated against a reference

**Bar: indistinguishable from the reference at a glance, and exact on
measurement.**

Reference: a rendered artifact in this repo — `packages/core/media/list-report-compact.png`
(the README screenshot, `/patterns/list-report` at `data-density="compact"`,
1440px, light), or a pattern page rebuilt from `apps/docs/scripts/check-po-app.mjs`'s
asserted route contracts.

Pass requires, in addition to the shared list:

1. **Blind A/B**: a critic shown the reference and the render, unlabelled,
   cannot say which is which — or names only differences that are *data*, not
   *design*.
2. **Measured, not eyeballed**: row height, control height, cell padding and
   font size at the declared density match `tokens/density.css` exactly.
   Read them with `getComputedStyle` in a real browser, not from source.
3. **Degrades without JavaScript** to the extent the reference does — filters
   removable by href, forms submit natively.

## Class B — a screen that claims to improve on one

**Bar: a stranger can operate it, and can say what it improves over the
recreation it extends.**

Reference: the Class A recreation it extends, plus `DESIGN.md`'s principles.

1. **Zero new visual values.** Every colour, space and size is a published
   token. New *layout* classes are allowed; new values are not.
2. **A five-minute blind task test**: the critic is given one task — "find out
   why PO-88214 cannot post", "clear everything that is yours" — and completes
   it with no instructions.
3. **The improvement is one sentence**, and the critic agrees it is an
   improvement rather than a restyle.

## Class C — a platform-layer change

**Bar: byte-identical behaviour where the feature is missing; measured
improvement where it is present.**

Reference: the same tree with the change reverted.

1. Every rule sits behind a correct `@supports` / `@media` gate and degrades to
   stock, **verified by disabling the feature** rather than by reading the
   guard.
2. Colour changes: ΔE00 < 1 per palette step against the value replaced, and
   `check:contrast` green in both themes.
3. No author decision is overridden — `data-theme` and `data-density` set
   anywhere still win.
4. **The published floor does not move silently**: `derive-floor.mjs` reports a
   value for any new feature, or the change is guarded so the floor is
   genuinely unchanged. (Roadmap 294.1 is the open gap here — three features
   have no probe.)

## Class D — a claim, in docs or a card

**Bar: nothing stated that the source does not support.**

Every value traceable to a file in this repo; every claim about tone, motion or
behaviour quotable from `DESIGN.md`, a component sheet, or a behaviour header.
"Deliberately absent" is stated, never inferred.

## What this bar does NOT yet measure, said plainly

The owner's five properties are not all reachable today, and pretending
otherwise would let a critic pass an artifact on feel:

- **Performance** — partially. `check:size` gates gzip budgets over all shipped
  artifacts, and `report-reach` exists; there is **no** interaction-latency or
  render instrument, so "performant" is currently a size claim only. A Class A
  or B artifact may not claim runtime performance without one.
- **Scalable** — `/components/data-table`'s own page documents measured
  behaviour at scale, and the wide-table and 50-column demos exist. A claim
  beyond what those measure needs a new instrument first.
- **Secure** — **no instrument in this repo at all.** This framework ships CSS
  and optional behaviours; it holds no credentials, makes no requests and owns
  no data layer. A gauntlet artifact must not claim "secure" — the honest
  scope is that a *pattern page* may document the server-side contract it
  assumes (`check-po-app.mjs`'s route contracts), which is documentation, not
  a security property of the framework.
- **Modern** — gradeable only as "uses a platform feature the reference did
  not, guarded, with the floor unmoved". That is Class C. It is not a synonym
  for "looks current".

**Adding a property to a class means adding the instrument first.** This is the
repo's own base-rate rule: a criterion nothing can measure is one the builder
argues past, which is exactly what a bar exists to prevent.

## Budget

**Three rounds per artifact.** If it has not passed by round three, stop and
report the gap rather than lowering the bar.
