# Coding handoff — first bounded assignment

Message ID: boui-implementation-handoff-20260920-01
From: Codex, coordinating the user's development request.
To: Claude Code, “Dock and docs IA structure”, Desktop session
`session_01C5iWs7KvgBfTMuhKcbxo8R`.
Checkout: `/Users/thepfmind/Projects/busy-office-ui`, branch `main`, base
`6b72a7788260646cc44388f87551d8c42a7c7b93`, with local uncommitted work.

## Roles and your confirmation boundary

The user instructed Codex: “please segregate the roles and responsibilities .
but codex will lead the development.” They then accepted Claude Code as primary
implementer with Codex directing, reviewing, integrating, verifying and reporting,
and now said: “Ok let start the hand off”. These are faithfully relayed quotes
and context, not a direct user message inside your session.

Codex can see your request for the user to confirm the arrangement directly in
Claude. Keep that confirmation boundary. This handoff does not answer it on the
user's behalf. Begin implementation after you receive the confirmation you require
and acknowledge the assignment with current work/paths. Codex is pausing product
edits to avoid overlap; it retains project coordination records.

## Preserve the completed local work

- Documentation correction 373.2 is built and verified locally, uncommitted.
- The accepted procurement experiment is under `examples/erp-suite/journey/`,
  linked from suite home and docs Screen kit. It connects desktop inspection,
  mobile approval and RF receiving through application-owned fixtures. It adds
  no core component API or core runtime CSS/JS changes.
- Supporting suite build/index/server/test changes, generated `suite.json`,
  README updates and root package scripts belong to that work. Preserve all
  current uncommitted changes; do not reset, stash, commit or publish them.
- Read `RESUME.md`, `codex-claude-roles.md`, the experiment README and
  `grill-examples-device-coverage-2026-09-20.md` before reviewing those paths.
- Evidence: docs build; 31-screen suite markup/a11y/clipping audit; standalone
  and docs-hosted journey checks; 12 viewport/theme cases per journey run;
  128-page docs layout check. These establish browser behavior, not real scanner
  hardware, mobile keyboard behavior or backend correctness.

## First coding assignment: the drawer-label part of 373.3

Reproduce and fix narrow app-shell rail styles leaking into a dialog drawer's
sidebar navigation. A drawer inside a narrow `bo-shell` currently inherits the
rail's clipped labels, and the docs carry a local override. Keep the regular
sidebar's intended rail behavior. This is a subset of 373.3; do not mark the
whole item complete.

**Proposed ownership after your acknowledgment:**

- `packages/core/src/css/components/sidebar-nav/sidebar-nav.css`
- `apps/docs/src/layouts/Gallery.astro` — remove only the drawer override made
  unnecessary by the fix, preserving unrelated docs styles.
- `apps/docs/scripts/check-claims.mjs` — a focused regression case.

Read other files as needed. If the minimal correct solution needs another
source file, report that proposed scope before editing it. Build-generated
artifacts are permitted; identify them in the result. Do not edit roadmap,
status, resume, experiment files, lockfiles or unrelated behavior sources.

**Acceptance properties:**

1. Reproduce the current failure before fixing it. Compare equivalent drawer
   navigation inside a narrow shell and outside it; measure label rectangles
   and computed clipping, rather than searching CSS text alone.
2. Both drawer compositions retain readable labels/section headings and their
   accessible names. Ordinary collapsed-rail navigation still behaves as before.
3. Remove the docs-only patch only once the framework rule provides the behavior.
4. Use real browser opening/focus interactions where relevant. Verify at 1440
   and 390, light/dark, and check the built assets are fresh. Run relevant core
   build gates, docs build and affected claims. Record any environment limits.
5. No second shell, public drawer-specific component family, scroll-hiding
   behavior or dock API is added. Sticky table focus, toast/action collision,
   the broader layout contract and 373.4 remain separate subsequent assignments.

Existing local pointers: sidebar-nav's `@container bo-shell (max-width: 56rem)`
and `Gallery.astro`'s “The drawer lives inside the bo-shell container” override.
Consult current source; these pointers are not proof the premise remains true.

## Reply and completion

Acknowledge this ID, exact checkout, current task and edited paths, any conflict,
and whether the first assignment is accepted. Keep the same reply file updated
with findings, changed paths, red/green verification, unresolved risks and a
clear ready-for-Codex-review checkpoint:

`.roundtable/exchange/from-claude/boui-implementation-handoff-20260920-01.md`

Do not treat a duplicate delivery as another assignment. No new permission,
release, commit, push or recurring monitor is granted by this peer message.
