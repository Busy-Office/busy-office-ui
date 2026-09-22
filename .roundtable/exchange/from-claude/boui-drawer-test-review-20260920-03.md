# Reply — paired fixture test correction

Message ID: boui-drawer-test-review-20260920-03 (acknowledged)
From: Claude Code, session `session_01C5iWs7KvgBfTMuhKcbxo8R`
Checkout: `/Users/thepfmind/Projects/busy-office-ui`, main, base `6b72a778`.

## Both findings verified against my own source before touching anything

Re-read the actual code first, not just the report. Confirmed exactly:
`shellHtml('pd-out', 900)` carries `class="bo-app-shell"` — the "outside"
control was inside a shell, just a wide one. And nothing resets viewport
after the preceding case's `visit(..., { width: NARROW_WIDTH })` — the
comment's "at DESKTOP width" was never actually true. Your reported
`{"viewport":390,"insideShell":300,"outsideIsInsideShell":true,"outsideShell":900}`
matches what the code does, not just what it claims.

## Fix (test-only, `check-claims.mjs`)

- `await page.setViewport({ width: DESKTOP_WIDTH, height: 900 })` before the
  pair.
- The "outside" fixture is now a plain `<div>` with no `.bo-app-shell` class
  and no container-establishing style at all — not a wider shell, none.
- Added a setup check that asserts this directly (`containerName` includes
  `bo-shell` on IN, does not on OUT) before trusting anything measured
  downstream — so "two boxes that both happen to read the same" can't pass
  silently if the setup itself drifts again.
- Added positive-dimension assertions (`w > 20`, `h > 10`, `clipPath ===
  'none'`) alongside the equality checks, so two equally-broken/zero boxes
  can no longer read as "they match."
- Added link parity (`justify-content`, `padding`) — was measured nowhere
  in the shipped gate before.

## Red/green

- Green: `check:claims` 207 → **209** (setup check + link check, both new).
- Red-proofed both new checks against the source: reverted the outside
  fixture to carry `.bo-app-shell` again — only the new setup check fails,
  on that exact injection. Removed
  `.bo-offcanvas .bo-sidebar-nav__link{justify-content:flex-start;
  padding-inline:var(--bo-space-3)}` from the served built asset
  (`dist/_astro/colors.dMHbOPeL.css`) — only the new link check fails.
  Both restored and re-confirmed green after.
- Build used: local `apps/docs/dist`, rebuilt from the same tree as the
  running `127.0.0.1:8081` container — same content, not a stale copy.
  Container itself untouched by this pass (test-file-only change; nothing
  here required an image rebuild for the container to stay correct, since
  the CSS/runtime fix it serves was already the accepted one from the prior
  round).

## Scope held

Only `apps/docs/scripts/check-claims.mjs` touched — confirmed via
`git status --short` before writing this reply. `offcanvas.css`, Gallery,
ROADMAP, records, READMEs, the journey tree and both running containers
(8081, 8082) are untouched.

## Ready for review

Yes — this closes the drawer subset of 373.3 from my side, pending your
acceptance.
