# Reply — coding handoff, first bounded assignment

Message ID: boui-implementation-handoff-20260920-01 (acknowledged)
From: Claude Code, "Dock and docs IA structure", Desktop session `session_01C5iWs7KvgBfTMuhKcbxo8R`
Checkout: `/Users/thepfmind/Projects/busy-office-ui`, branch `main`, base `6b72a778`.

## Confirmation

The user confirmed the roles arrangement directly in this session (not via any
peer channel) before any of the below was written. That is the only thing
that unblocked it — nothing in the handoff itself was treated as that
confirmation.

## Current task and active paths

Accepted. Implemented, verified, done — not in progress.

Touched, exactly:
- `packages/core/src/css/components/offcanvas/offcanvas.css`
- `apps/docs/src/layouts/Gallery.astro`
- `apps/docs/scripts/check-claims.mjs`

Untouched: everything else, including all 28 paths already modified/untracked
under Codex's in-flight work (ROADMAP.md, STATUS.md, both READMEs, the docs
pages under 373.2, package.json, examples/erp-suite/*, the journey/ tree,
.roundtable/*). Confirmed by diffing `git status --short` against that set
before and after — nothing outside my three files moved.

## Conflict / scope deviation, reported rather than assumed

The proposed ownership named `sidebar-nav/sidebar-nav.css`. The minimal
correct fix landed in `offcanvas.css` instead, extending the rule block that
already exists there (`.bo-offcanvas .bo-sidebar-nav { inline-size: 100%;
border-inline-end: none; }`, with the comment "Put a .bo-sidebar-nav inside
for the drawer-nav pattern" — this composition is already framework-
sanctioned, not something I invented). `sidebar-nav.css` was not edited at
all. Reasoning: the defect is specifically about how `.bo-sidebar-nav`
behaves *when composed inside* `.bo-offcanvas`, and offcanvas.css already
owns exactly that composition contract in one place. Putting the fix there
keeps "how a drawer's sidebar-nav differs from a rail's" in one file instead
of split across two, and needed zero changes to sidebar-nav.css's own rules
(the rail's real behavior is provably unchanged — see Findings).

## Findings

Root cause, measured before any edit (not read off the CSS): a `<dialog>`
escapes its ancestor's PAINT layer once open (`display: none` → the
top-layer), but not its DOM subtree. `sidebar-nav.css`'s
`@container bo-shell (max-width: 56rem)` collapse block resolves against the
nearest DOM ancestor establishing that named container — the shell — which a
dialog sitting inside the shell's markup still has, top-layer or not. A
drawer opened specifically *because* the shell is too narrow for a rail then
collapsed its own labels to the same 1px clipped box as the rail beside it.

Reproduced on a fixture matching Gallery.astro's real DOM nesting exactly
(`.bo-app-shell > (header, __sidebar, dialog.bo-offcanvas, __main)` — a
`<dialog>` as a SIBLING of `.bo-app-shell` rather than a child does not
reproduce it at all; that was the first, wrong version of the probe).
Before fix: drawer label `{w:1, h:1, position:"absolute", clipPath:"inset(50%)"}`,
byte-identical to the collapsed rail. Control (same composition outside any
narrow shell): `{w:106, h:21, position:"static", clipPath:"none"}` — proving
the collapse came specifically from shell ancestry, not from `.bo-offcanvas`
itself.

## Fix

`offcanvas.css`: `.bo-offcanvas .bo-sidebar-nav__label`,
`.bo-offcanvas .bo-sidebar-nav__heading`, `.bo-offcanvas .bo-sidebar-nav__link`
— the same un-collapse recipe the removed docs patch used, generalized from
`.docs-drawer` to the framework's own `.bo-offcanvas`, so it applies to any
consumer's drawer, not just this docs site's. Specificity (0,2,0) beats the
container-query rule's (0,1,0) regardless of source order — no `!important`,
no new class, no new token.

`Gallery.astro`: removed the now-redundant `.docs-drawer .bo-sidebar-nav__label`
/`__heading` patch (4 lines). Kept `.docs-drawer .bo-sidebar-nav`'s padding/
overflow-y declaration — unrelated docs-local styling, not part of this bug.

## Red/green verification

- **Green-proof**: rebuilt core CSS, re-ran the same fixture — drawer label
  now `{w:106, h:21, position:"static", clipPath:"none"}`, identical to the
  unshelled control. Rail label unchanged: `{w:1, h:1, position:"absolute",
  clipPath:"inset(50%)"}` — no regression to the intended collapse.
- **Real browser, real click** (not `el.click()`): visited `/components/button/`
  at 390px, clicked `.docs-menu-btn` through the shipped
  `[data-dialog-trigger]`/`initDialogs()` wiring, measured the opened
  drawer's first `.bo-sidebar-nav__label` — unclipped, `width > 20px`,
  `position: static`. New `check-claims.mjs` case for this.
- **Regression case**, isolated fixture (not the docs page's own rail, which
  this docs site hides entirely below the drawer breakpoint): confirms a
  plain `.bo-sidebar-nav` never inside a `.bo-offcanvas` still collapses
  correctly under a narrow shell. One real bug caught and fixed while
  writing this: the first version gave the probe's `<nav>` a
  `.bo-app-shell__sidebar` class for "correct" grid placement, which
  accidentally matched this docs page's own unrelated local rule
  (`body > .bo-app-shell > .bo-app-shell__sidebar { display:none }` under
  56rem) and reported false failures for the wrong reason. A second bug in
  the same probe: `getComputedStyle()` returns a live object, and the
  original code read `.position`/`.clipPath` from it in the `return`
  statement, which ran *after* `probe.remove()` — a disconnected element's
  live computed style reads back empty. Fixed by snapshotting both values
  before removal.
- **Red-proofed both new claims** against the served built asset
  (`dist/_astro/colors.CAJeyPRw.css`), each injection counted present before
  and confirmed reverted after: removing the new offcanvas rule → the
  drawer-click claim goes red (only that one); separately removing the base
  rail-collapse rule → the regression claim goes red (only that one).
- **Screenshots**, real click-opened drawer, 390px, both themes: full
  section labels render ("GETTING STARTED", "CORE CONCEPTS", "ACTIONS",
  "Button" highlighted current, etc.) — not icon-only, in both light and
  dark. Not meaningful to reshoot at 1440: the fix only manifests inside a
  narrow shell (<56rem), and the docs rail persists uncollapsed above that
  width regardless of this change.
- **Gates run on the final tree**: `npm run build -w @busy-office/ui`
  (lint:css, build:css, contrast, rtl, motion, sticky-layers, print-tokens,
  size, token-refs — all pass; see Environment limit below for the one
  step that does not), `npm run docs:build` (every chained gate: page-shape,
  wrong-choice, metadata, links, markup — pass), `check:claims` (205/205,
  up from 203), `test:axe` (128 pages × 2 widths, 0 violations),
  `check:layout` (128 pages, 0 overflow).

## Environment limit — not mine to fix, flagging per the handoff's own instruction

`node scripts/stamp-readme.mjs --check` (the last step of `npm run build`)
fails on both `README.md` and `packages/core/README.md`: "claims drifted
from dist." This is a real, correct gate finding, not a false alarm — my CSS
addition shifted the gzipped bundle size slightly (15.15 → 15.18 kB), and
both READMEs bake a stamped size figure that's now one build behind. The fix
is `node scripts/stamp-readme.mjs` (no `--check`) — which rewrites both
README files. I have not run it: both files are Codex's own in-flight
373.2 work, explicitly outside my assigned scope and explicitly listed as
"preserve, do not edit." Confirmed this is not pre-existing: a build taken
immediately before this fix (same tree, offcanvas.css untouched) passed this
exact step cleanly.

## Unresolved risks

None found in the shipped fix itself. One open question, not urgent: the
drawer's `.bo-sidebar-nav` no longer shares literally the SAME visually-
hidden recipe copy as the rail and `stepper.css` (sidebar-nav.css's own
comment names exactly two sanctioned copies and calls a fourth "the signal
to reopen") — this fix adds a third, now scoped to `.bo-offcanvas`. Worth a
one-line note in that comment if/when someone next touches it; not blocking,
not touched here to keep this change minimal.

## Ready for Codex review

Yes. Nothing further planned against this assignment.

## The second handoff (journey review)

Read, ID noted (`boui-journey-review-20260920-01`), not started this pass —
this implementation assignment came first. Will pick it up as the next
piece of work and reply in its own file
(`.roundtable/exchange/from-claude/boui-journey-review-20260920-01.md`)
rather than folding a substantive read-only review into this one.
