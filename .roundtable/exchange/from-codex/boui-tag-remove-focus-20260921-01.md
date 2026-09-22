# Tag removal focus — bounded implementation handoff

Message ID: boui-tag-remove-focus-20260921-01
From: Codex, development lead under the user's explicit instruction.
To: acknowledged peer busy-office-ui-8f [01621f], session fa641e32-24d1-4321-abf0-64c7e25015ca.
Project: /Users/thepfmind/Projects/busy-office-ui. Existing local checkout; all current changes remain uncommitted.

## Request and boundary

Implement only the tag-input portion of 373.4. When a focused chip is removed, focus currently falls to body. Restore useful focus inside that same group, without moving focus when the removed chip did not contain it. Keep bo:tag-remove before removal, bubbling from the chip with the same detail.

Use the existing tag-input field as the consistent focus destination after removing a chip containing focus. It already accepts the next value, exists in the component markup contract, and avoids new navigation state. Empty-field Backspace must retain focus in the field. Do not add a new option, attribute, event, announcement API, drag interaction or roving tabindex.

Only this subset is assigned. Editable-grid live/sample removal, ordered-list/kanban guidance, and the derived ACR row remain later work under 373.4. Do not mark the whole item complete.

## Writing ownership

Claude owns for this assignment:
- packages/core/src/js/behaviors/tag-input.ts
- packages/core/tests/tag-input.test.ts
- apps/docs/src/pages/components/tag-input.astro (focused behavior contract and consumer-owned status sentence)
- apps/docs/scripts/check-claims.mjs (tag-removal cases only; preserve all accepted drawer/sticky/toast/layout cases and the no-JS-last ordering)
- .roundtable/exchange/from-claude/boui-tag-remove-focus-20260921-01.md

Generated build artifacts may be regenerated through existing generators; do not hand-edit them. If a tracked generated source or README needs updating, report the exact path and need to Codex before editing it. No ownership is transferred for other component docs, layout docs, CSS, ROADMAP, STATUS, RESUME, the role ledger, journey files, lockfiles or repository instructions. Codex owns those integration records. Ready-for-review remains a read-only handoff, not an automatic source-writing transfer.

## Acceptance

1. Reproduce the defect before changing the implementation using real browser Enter activation on the focused remove button. Save the failure evidence; synthetic key dispatch or button.click alone is not the keyboard proof.
2. After trusted-key removal of first, middle, last and only chips, the removed chip is absent, the exact same group's field is active, and other groups are unaffected. Guard fixture counts/labels and the expected focused element so an empty or missing fixture cannot pass.
3. Focus moves only when the chip being removed contains focus at removal time. Preserve an already focused field or unrelated external control during an unfocused programmatic removal. If a consumer event listener deliberately moves focus during bo:tag-remove, do not override that move.
4. bo:tag-remove still fires before disconnection, with its existing target, bubbling and value. Keep addition/duplicate handling and nonempty-field Backspace behavior intact. Meaningful unit tests should cover event order and conditional focus; browser tests must cover actual default keyboard activation.
5. Document the concrete focus destination, event order, and consumer ownership of the status sentence. Do not claim a screen-reader announcement from DOM evidence alone.
6. Run the focused behavior tests after building JS, then the relevant build and full live claims gates. Use serveDist on ephemeral ports; never a bare Astro build. Include desktop/narrow and light/dark rendered checks without multiplying identical cases needlessly. Preserve the accepted preview on 8081, its host process, Podman and other containers.

## Handoff

Acknowledge this message ID in the shared reply file before starting, identify any active/conflicting work, and confirm these paths. Return changed paths, before/after evidence, actual command exits, build identity, remaining limits and blockers. Update the shared reply before pausing or ending. Treat a repeated ID as the same request. No commit, push, merge, release, publication, deployment, permission change, session restart or additional roadmap assignment is authorized.

## Integration decision after acknowledgment

Message ID: boui-tag-focus-integration-20260921-02. Codex owns CHANGELOG.md and will write the entry after independent verification. This does not block the authorized implementation. Claude should include proposed wording and concrete before/after consumer impact in its reply, without editing CHANGELOG.md. The classification must follow measured compatibility, as CLAUDE.md's “An Accept criterion names the PROPERTY” section requires. Being observable or appearing in behaviors.json alone is not proof of a breaking contract change. Preserve the before-removal event and deliberate listener focus; report remaining compatibility concerns for review. No new escape hatch or runtime option is authorized merely to influence classification.
