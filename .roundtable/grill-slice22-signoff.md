# Grill — Slice 22 sign-off (items 2+3, shipped ungrilled)

2026-08-16, three parallel adversarial seats: accessibility/AT,
consumer/API contract, Objective/design coherence. 24 findings, 6 P1.
All P1s and most P2/P3s closed same-wake; deferred items listed with
reasons. This closes Slice 22's sign-off obligation (item 1 had its own
presentation grill earlier).

## P1s found and closed

1. **The editing surface had no focus indication in forced-colors**
   (a11y+consumer, Evidence): `.bo-richtext__content:focus-visible {
   outline: none }` was the only outline suppression in the framework;
   its substitute (container border tint) is flattened in HCM. Fix: the
   rule is deleted — the content area keeps the reset ring like every
   other field (the "doubling" it feared is the framework's normal
   border+ring pattern).
2. **Seamless hover border ~1.13:1 — the only affordance, ungated**
   (a11y, Evidence): hover revealed `border-default` (gray-200) on a
   hovered row (gray-100). Fix: all three seamless variants
   (input/select/tag-input) reveal `border-control`; two new gate pairs
   (`border-control` on `bg-hover`/`bg-muted` at 3:1) — which
   immediately caught a REAL pre-existing defect: dark-mode
   border-control (gray-500) sat at 2.97:1; dark remap moved to
   gray-400 (5.6:1). Gate now 35 pairs × 2 themes.
3. **`--disabled` blocked the toolbar for mouse only** (a11y,
   Evidence): `pointer-events: none` doesn't touch Tab/Enter. Fix:
   docs now state plainly that disabled toolbars need `disabled` on the
   buttons themselves (the demo already did it; the note was the gap).
4. **Tag-input seamless leaked edit chrome at rest** (consumer,
   Evidence): × buttons and the Add… placeholder stayed visible,
   falsifying "no field chrome". Fix: both hide at rest, reveal on
   hover/focus-within (visibility, so no layout shift; they re-enter
   the tab order with the field). Live-verified.
5. **The execCommand snippet lacked the mousedown guard** (consumer,
   Evidence): button press blurs the field and can collapse the
   selection before the command runs. Fix: `mousedown →
   preventDefault()` in both the consumer snippet and the live wiring;
   verified live — a 101-char selection survives the click and italic
   applies.
6. **Accept-drift on item 3** (objective, process): the Accept was
   rewritten in the shipping commit; "tests" and "pixel-comparable"
   shipped unmeasured. Fix: /patterns/editable-grid/ and
   /components/richtext/ added to the visual-regression matrix (40
   shots now — the pixel harness is the right seam for a CSS-only
   item); the struck clauses are now recorded WITH reasons in a
   dedicated ROADMAP note; process rule adopted: strike Accept clauses
   with a reason, never overwrite with narrative.

## P2/P3 closed

- `role="toolbar"` promised APG arrow-key navigation nobody shipped →
  demos/canonical use `role="group"` (contract-free), and the toolbar
  now composes `.bo-cluster` (it was the third hand-rolled toolbar
  row — objective seat).
- Bold/italic toggles were stateless in both channels → `aria-pressed`
  in markup + `queryCommandState` sync in the wiring +
  `.bo-btn[aria-pressed="true"]` pressed style (bg-selected/
  accent-text, new gated pair). Live-verified.
- Read-only was a visual no-op and keyboard-unreachable → muted
  background on `--readonly` content; `tabindex="0"` in demo + notes.
- execCommand deprecation + per-engine output variance now stated
  ("Know its two caveats"), sanitizer advice updated accordingly.
- ProseMirror recipe made runnable (EditorState import, state.create)
  + `removeAttribute("role")` with the AT reasoning.
- `role="textbox"` guidance rewritten: fine for plain notes, drop it
  for structured prose or a mounted engine (it flattens structure).
- `.bo-prose`: first/last-child margin resets (trailing-gap defect was
  visible on the live page); h5/h6 coverage; print rules (header
  repetition + row-split guard for prose tables).
- `__content` padding switched from table-cell tokens to field tokens
  (space-2/3) so richtext text aligns with adjacent inputs; vertical
  resize added (parity with textarea); docs sizing claim corrected.
- `__divider` paints via border (backgrounds vanish in forced-colors —
  the catalogued Slice 14 gap class).
- Seamless HCM story: `border-color: ButtonText` at rest for
  select/tag-input under forced-colors (control boundaries win over
  display-identity there, by HCM's purpose).
- Seamless focus color unified on border-control across all three
  variants (tag-input was on focus-ring — one setting, one indicator).
- WYSIWYG scope honesty: compound cells (money/quantity, steppers)
  stay chromed BY DESIGN and the section says why; combobox = 
  input--seamless (stated).
- Owner-decision flag ("table inside the editor?") moved from the
  closed item's body to the discoverable OWNER DECISION WANTED block.

## Deferred / accepted (with reasons)

- **`.bo-prose` lives in the richtext component file** (objective #5):
  real packaging smell (importing editor chrome to get prose), but
  moving it is a dist-file reorganization — per the versioning policy
  dist placement is explicitly not API until v1.0, so this waits for a
  deliberate file-layout pass rather than a grill hotfix. Queued.
- **No stylelint naming gate exists** (objective #6): CLAUDE.md
  references one; reality is review-convention. Queued as a Standardize
  item (adopt stylelint + the BEM pattern rule) rather than built here.
- **Roving-tabindex toolbar behavior**: refused for now — role=group +
  Tab-through is honest and conformant; a composite toolbar widget is
  Objective-heavy for two buttons. Reopens if a real adopter's toolbar
  grows.
- **Redundant tight line-height in prose headings** (reset already sets
  it for h1-h4): kept — h5/h6 aren't covered by the reset, and one
  shared declaration beats two scoped ones.
- Chevron URI visibility in HCM hover (mid-gray on forced Canvas):
  boundary cue is the border; noted, not fixed.

## Meta

Second grill in a row where the highest-severity findings were in the
10% that can't be seen in a screenshot: focus/forced-colors behavior,
event-order traps (mousedown vs click), and a gate hole that had been
green forever because the pair was never listed. The new-pair discipline
(add the pair BEFORE trusting the claim) caught a real shipped defect
(dark border-control) within minutes of being written.

## Correction — 2026-08-16, next wake

The Objective seat's finding "no stylelint naming gate exists / no
.stylelintrc anywhere" was **wrong**: `packages/core/.stylelintrc.json`
exists (selector-class-pattern enforcing bo-BEM + custom-property-pattern
--bo-*, with htmx/reset overrides) and CI runs `lint:css` in both
ci.yml and publish.yml. The seat's `find -name "stylelint*"` cannot
match a dotfile named `.stylelintrc.json` — a search-tool artifact
presented as Evidence. Lesson for future grills: verify a NEGATIVE
claim with a second method before grading it Evidence. The only real
sliver: the local `npm run build` chain didn't run lint:css (CI-only)
— now it does, so local = CI. ROADMAP follow-up 4 closed accordingly.
