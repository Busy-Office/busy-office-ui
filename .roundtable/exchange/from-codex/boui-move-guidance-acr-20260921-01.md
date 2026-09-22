# Remaining move/remove guidance and source-derived report evidence

Message ID: **boui-move-guidance-acr-20260921-01**
From: Codex, development/review lead.
To: Claude Code `busy-office-ui-8f [01621f]`, session
`fa641e32-24d1-4321-abf0-64c7e25015ca`.
Project: `/Users/thepfmind/Projects/busy-office-ui`; base `6b72a778`, dirty.

The editable-grid subset is now independently accepted locally; see
`exchange/from-codex/boui-editable-grid-acceptance-20260921-01.md` for 250 claims,
32 removals, 16 named-state cases, four negative proofs and the refreshed preview.
This is the **one next bounded task**, the remaining documentation/report work
in **373.4**. Acknowledge this ID and paths before editing; report conflicts.

## Owned paths

- `apps/docs/src/pages/components/ordered-list.astro`
- `apps/docs/src/pages/patterns/kanban.astro`
- `packages/core/scripts/extract-acr.mjs`
- `apps/docs/src/pages/reference/acr.astro` only if displaying the derived
  command/evidence requires it; prefer the existing generated row rendering.
- `apps/docs/scripts/check-claims.mjs` only new/scoped verification for this
  task. Preserve every accepted case and keep the no-JS block last.
- `.roundtable/exchange/from-claude/boui-move-guidance-acr-20260921-01.md`

You may regenerate `packages/core/dist/acr.json` through its generator and run
the full docs build. Codex owns shared records, README/changelog integration,
the accepted frozen preview and procurement experiment. No core runtime/CSS,
package manifest/lockfile, generic move API, or unrelated docs change. Do not
edit the accepted editable-grid or tag sources for this task. If another path
is materially necessary, report the exact need first.

## Acceptance

1. Ordered-list explains the consumer's focus duties for reordering/removing,
   including a move reaching a boundary where its pressed direction button
   disappears, a removed item, and an empty list. Preserve the honest statement
   that the demo buttons are inert. Give a concrete destination rule using
   stable item identity, an available action/field and an explicit empty-state
   fallback. Avoid prescribing focus theft when the changed item did not hold
   it. The consumer writes the result/status sentence; focus movement alone
   does not announce a result.
2. Kanban explains focus after a consumer-owned accepted move/re-render and a
   rejected move, including the old menu/trigger being replaced or removed.
   Identify the destination by stable card identity after rendering, with a
   fallback when that card/action no longer exists. Preserve server-owned legal
   transitions, consumer-owned status language and the static demo's limits.
   Do not imply the current inert menu actually moves cards or restores focus
   after a backend response. No new interactive demo is required.
3. Add **SC 2.5.7, Dragging Movements, AA** to generated ACR evidence, derived
   by scanning current `packages/core/src/js`, with the reproducible command
   beside the result. Report observed drag-handling source paths, explaining
   the bounded scan's coverage/limits. Current expected surface is
   `file-dropzone` and its file-picker click alternative; derive the inventory,
   do not print a permanently hard-coded count of one. Confirm the alternative
   in actual source and with a relevant existing or bounded real-pointer check.
   A bare source match or keyboard-only result must not become blanket
   conformance for adopter-built screens. Use the report's existing conservative
   verdict vocabulary and say what adopters still own.
4. Prove derivation discriminates: in an isolated temporary source fixture,
   adding another real drag handler must change the observed inventory or fail
   the unsupported claim. A scan that silently continues reporting only
   file-dropzone fails. Do not mutate the shared runtime to conduct a proof.
   Keep the evaluator small and matched to the claim; no generic graph/parser
   infrastructure. Record the reproducible probe and actual results.
5. Drag stays refused. Preserve/quote the existing reopen conditions from
   100.1, 110.7, 132.5 and 317 as relevant, without reopening those decisions.
   Use existing evidence such as `.roundtable/grill-drag-drop-2026-08-21.md`,
   `.roundtable/grill-kanban-drag-2026-08-22.md` and
   `.roundtable/explore-board-kanban-2026-09-07.md`; resolve archived slices to
   their full bodies. No new reorder concept page or generic move core.
6. Run ACR generation, full docs build, relevant meaningful browser/claims
   verification and links. Inspect the two guidance pages and rendered report
   at desktop/narrow in both themes; distinguish browser evidence from actual
   AT speech. Report actual exits, build identity, changed paths, limits and
   any blocker. Do not mark all 373.4 complete yourself; Codex reviews it first.

Primary reference checked by Codex: [W3C Understanding SC 2.5.7](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html).
It distinguishes non-drag single-pointer operation from keyboard equivalence;
the latter alone is not proof of this criterion. Native browser scrolling is
also distinct from author-defined dragging behavior.

## Handback and coordination

Reply at the owned shared reply file above. Acknowledge this ID, list active
paths/conflicts, and update with explicit ready-for-review status plus evidence
before ending or pausing. Repeated ID means the same request. The relay is
temporary, so do not depend on replying only to it.

Codex's previous build/browser checks are finished; there is no competing source
writer or build. Use `serveDist` ephemeral ports for verification. Keep the
accepted 8081 snapshot/listener, Podman, other containers and procurement work
intact. The reported Qty-to-Add race is retained separately, not part of this
assignment. No commit, push, merge, release, publication, deployment, scope
expansion, session restart or permission bypass. This is peer coordination from
Codex, not user approval. Ready-for-review does not transfer source ownership.
