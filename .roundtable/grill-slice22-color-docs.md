# Grill — Slice 22 item 1, the color/scales/tokens docs (presentation pass)

2026-08-16, three parallel adversarial seats against the LIVE pages
(`/base/colors`, `/base/tokens`, `/base/palettes`) after the wireframe-
approved build: ERP-builder (jobs-to-be-done), presentation standards
(the five adopted research choices + CLAUDE.md recipe), correctness &
a11y (copy scripts, grid semantics, parsers, forced-colors). 24
findings, 6 P1. All P1s and most P2/P3s closed same-wake; the rest are
recorded below with reasons.

## P1s found and closed

1. **Hand-typed role annotations were factually wrong** (standards #1,
   Evidence): 3 of 5 span labels contradicted the shipped semantic tier
   (hover/selected alias 50–100, borders 200/300/500, nothing uses 400
   as a border). Fix: spans re-derived honest against color.css, AND the
   page now build-parses color.css into a step→consumers map — each
   swatch's tooltip/aria-label names the semantic tokens that consume it
   (which also closes the reverse cross-link direction of research
   choice 5). A zero-parse result fails the build.
2. **Forced-colors wiped the entire page** (a11y #1, Evidence): 264
   borderless color-only buttons all paint ButtonFace under
   `forced-colors: active`. Fix: the color-picker exception —
   `forced-color-adjust: none` + a `ButtonText` border (same tool as
   segmented/combobox/icon).
3. **Copy scripts failed completely silently** (a11y #2, Evidence): the
   `navigator.clipboard?.` optional chain turned "no clipboard"
   (insecure context) into a no-op, and rejection had no `.catch` — on
   the exact page whose caption promised the toast "always" reports.
   Fix on both pages: explicit no-clipboard message, rejection handler,
   and the toast race fixed (clear-then-set via rAF + tracked timer, so
   an identical repeat copy re-announces and isn't blanked early).
4. **The one copy-paste snippet silently failed on a default install**
   (ERP #1, Evidence): the tag example used the EXTENDED mist range with
   no import; the default bundle defines no `--bo-palette-mist-*`. Fix:
   snippet now carries the opt-in `@import` inline, a dark-theme
   pairing, and extended swatches say "extended tier" in
   tooltip/aria-label.
5. **"Copy @import" shipped without the placement rule** (ERP #2,
   Evidence): import-after-framework/outside-@layer lived only in the
   "Your own palette" section. Fix: "Placement matters" paragraph
   directly under the cards + installation/cascade links + a Related
   block (palettes was the only page without one).
6. **Raw-steps guidance contradicted itself on dark mode** (ERP #3,
   Evidence): "that pairing is the semantic tier's job, not yours" then
   handed the reader raw-step recipes with no dark story. Fix: "How to
   use a step" now states the three costs plainly — theme-static (with
   a `[data-theme="dark"]` pairing example), outside the contrast gate,
   not semver API — with the versioning wording aligned to the
   authority page ("any release", was "minor versions").

## P2/P3 closed

- Tokens page omitted three component-consumed tokens (`warning`,
  `danger-solid`, `danger-strong`) against its own inclusion rule —
  added (ERP #6 / a11y #4). `success-strong` has zero consumers;
  omitting it is coverage, not a bug.
- Dark cells that merely inherit light now say "— same in both themes"
  (standards #5).
- Tokens→colors step links now target per-swatch anchors
  (`/base/colors#gray-200`); every swatch has an id (standards #3).
- Step headers repeat at the Extended tier break and hue names are
  sticky-left in the horizontal scroll (standards #2, partial — see
  accepted below).
- Skip link past the 264-button grid for keyboard users (a11y #5).
- Hover outline no longer overrides the focus ring
  (`:hover:not(:focus-visible)`) (a11y #7).
- Palettes parser: last-declaration-wins (was first-match — documented
  the value the browser discards); dead `?? p.light[t]` fallback
  removed (a11y #8).
- Default teal card added — the baseline you're comparing against is in
  the comparison (ERP #8).
- Spacing rows show their rem values (parsed from space.css, asserted);
  density caption names the six real aliases (asserted against
  density.css) and says which control to flip (ERP #7).
- Tokens page states it IS the stable tier, links versioning both in
  the intro and Related (ERP #5).
- Shift+Enter documented as the keyboard path to the hex; toast moved
  above the grid (standards #6, partial).

## Accepted deviations / deferred (with reasons)

- **Research choice 4 (paired light/dark rows under step numbers) is
  not in the raw grid** — the raw tier is theme-independent by design;
  the pairing lives in the tokens table's Light/Dark columns, which is
  where theme resolution actually happens. Accepted; the grid caption
  no longer claims otherwise.
- **Vertical sticky step-header** while page-scrolling: the horizontal
  scroll container clips a page-level sticky; the repeated header at
  the tier break covers the practical failure (row ~8 unlabeled).
  Accepted as the simple thing; revisit only on real user feedback.
- **Touch has no hex-copy path** (shift is mouse/keyboard). The hex is
  readable in tooltip/aria-label and one tap copies the var name — the
  information is available, only the alternate copy affordance is
  mouse/keyboard. Accepted; a second per-swatch control for 264 cells
  fails the Objective's simplicity test.
- **Roving tabindex over the grid** — refused (Objective: the skip link
  is the simple fix; a 264-cell composite widget is not).
- **Per-brand contrast numbers on the palettes page** (check-contrast
  already emits `report.brands`) — good idea, queued as a docs
  enhancement, not required for the AA claim (the claim is gated in CI
  either way).
- **Dark-mode `danger-solid`/`danger-strong` never remap** (a11y #4's
  tail): a dark `bo-btn--danger` darkens on hover. Real framework
  question, not a docs fix — logged in ROADMAP (Ideas) for a deliberate
  decision with contrast measurement; naively remapping to red-500
  would fail the white-text AA pair.
- Tokens page has no opening demo (spec-first) — accepted: the token
  table with live swatches IS the demo for a reference page; the
  CLAUDE.md demo-first rule targets component pages.

## Meta

The wireframe round prevented layout-level rework, but 3 of the 6 P1s
were in the 10% that wireframes can't show (hand-typed data drifting
from source, script failure paths, forced-colors). The recurring lesson
holds: anything hand-written next to generated data (the role spans)
drifts — the fix each time is to parse the source and assert.
