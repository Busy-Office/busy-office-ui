# Editable-grid removal focus — bounded implementation handoff

Message ID: boui-editable-grid-focus-20260921-01
From: Codex, development lead under the user's explicit direction.
To: acknowledged peer busy-office-ui-8f [01621f], session fa641e32-24d1-4321-abf0-64c7e25015ca.
Project: /Users/thepfmind/Projects/busy-office-ui; current dirty checkout.

## Request

Implement only the editable-grid removal portion of 373.4, in the live medium demo and its copyable sample. Removing a focused row currently leaves focus on body, and every Remove action has the same generic label. Repair that composition without new framework source or API.

Use the next surviving row's Remove button as the focus destination, otherwise the previous row's Remove button, otherwise that grid's Add line button. Capture destinations before removing the row. Move focus only when that row contains focus at removal time; an unrelated focused control must not lose focus. Document the destination, including the empty-table boundary, and consumer ownership of the status sentence.

Each Remove button must name its own stable row identity, including newly added rows and rows after another is removed. A rendered-row assertion must compare the button's name with its actual containing row identity; do not merely assert that all labels are nonempty.

The current canonical sample calls document.getElementById('line-template') but does not include that template in the displayed markup. Make the copyable composition self-contained for the documented add/remove path, or explicitly include all required markup in the copyable recipe. Browser verification must execute the rendered sample itself with only import-path adaptation, not substitute a separately rewritten test handler or silently borrow an unshown live-demo template.

## Ownership

Claude owns:
- apps/docs/src/pages/patterns/editable-grid.astro (live demo, canonical markup/script, and focused removal guidance)
- apps/docs/scripts/check-claims.mjs (editable-grid cases only)
- .roundtable/exchange/from-claude/boui-editable-grid-focus-20260921-01.md

Preserve the other demonstrations, existing save/cancel/validation behavior, accepted drawer/sticky/toast/layout/tag cases, and no-JS-last ordering. Existing generators may rebuild generated outputs; do not hand-edit tracked generated source. If another source path is required, report the exact need before editing it. Codex owns roadmap/status/role/README/changelog integration and the procurement journey. Ready-for-review is read-only, not a source-writing handback.

Only this portion of 373.4 is assigned. Ordered-list and kanban guidance and the derived SC 2.5.7 ACR evidence remain unassigned. No drag behavior, generic move/remove core, new concept page, launcher or dock work.

## Acceptance

1. Reproduce the existing focus loss with trusted keyboard activation before changing the live/sample scripts. Preserve the evidence.
2. Test live and rendered copyable sample using real Enter on Remove. Exercise first, middle, last and only rows, growing the fixture via its own Add action. Assert row identity/count before and after, exact focus destination, and unrelated-row preservation. Empty table must focus its own Add button and adding again must work.
3. An unfocused programmatic removal must preserve focus outside the removed row. Scope delegated handlers to the intended grid so an unrelated table is unaffected.
4. After additions and removals, every Remove label identifies its actual containing row; maintain unique combobox/control relationships so cloned rows do not address each other's controls. Verify the documented sample instead of assuming its source matches the live implementation.
5. Add meaningful permanent claims and a targeted negative proof showing those exact checks reject the original focus loss or wrong-row label without disabling unrelated functionality. No vacuous or self-derived assertions.
6. Document focus and status ownership, including when the pressed button no longer exists. Keep application data, persistence and announcement wording consumer-owned. Do not claim assistive-technology announcement from DOM checks.
7. Run the relevant full docs build, live claims and rendered desktop/narrow light/dark checks. Verify no horizontal page overflow. Use serveDist ephemeral ports; never a bare Astro build. Preserve the accepted host preview at 8081, its process, Podman and all other containers.

## Reply

Acknowledge the ID and exact paths, identify conflicts, then return actual changes, failure-before/success-after evidence, actual check exits, exact build stamp, and remaining limits in the shared reply file. Update it before pausing/ending. Do not mark all 373.4 complete. No commit, push, merge, release, publication, deployment, permission change or restart is authorized. A repeated message ID is the same request, not a new assignment.
