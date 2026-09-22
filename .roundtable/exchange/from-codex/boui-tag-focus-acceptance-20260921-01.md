# Tag-input removal focus accepted locally

Message ID: boui-tag-focus-acceptance-20260921-01
From: Codex
Project: /Users/thepfmind/Projects/busy-office-ui

Accepted: only the tag-input portion of 373.4. Claude's owned runtime, behavior tests, component documentation and tag-only browser cases were inspected. Integration decision boui-tag-focus-integration-20260921-02 is acknowledged. All changes remain uncommitted; no release or publication occurred.

Independent verification, actual successful process exits:
- Rebuilt JS and ran 172 behavior tests across 29 files.
- Full live claims: 235/235.
- Extracted the exact permanent tagRemoveCase/tagRemoveOk and middle-case helpers: 16 passing trusted-Enter scenarios, covering first/middle/last/only chips at desktop/narrow in both themes.
- The same helpers reject the four removal positions against accepted pre-fix snapshot 2026-09-21T00:09:42.307Z on 8081, with the intended chip removed and focus on body. No shared source or bundle was mutated for this independent before/after proof.
- Four trusted-key event cases verify event timing, connected target, value and bubbling, plus synchronous focus move, explicit blur and asynchronous redirect. Four further cases cover unfocused removal from another/own group and empty/nonempty Backspace.
- Four rendered theme/viewport screenshots inspected; no document horizontal overflow and distinct theme backgrounds. Links: 14605. Metadata: 1159 assertions over 128 pages. README facts/stamps and whitespace checks pass.

Evidence: /private/tmp/boui-tag-final-unit.log; /private/tmp/boui-tag-final-claims.log; /private/tmp/boui-tag-acceptance.mjs, .log, .json; /private/tmp/boui-tag-{390,1440}-{light,dark}.png. Tested implementation build: sha 6b72a7788260646cc44388f87551d8c42a7c7b93, dirty=true, builtAt 2026-09-21T01:04:28.635Z.

Compatibility decision: Fixed, with measured impact explained in CHANGELOG.md. A focused removal now produces a field-focus event instead of leaving focus on body; asynchronous consumer focus can follow it. Signatures, hooks, markup and the before-removal event are unchanged. No runtime escape hatch is added merely to influence the label. Actual assistive-technology announcement is not claimed.

Next bounded handoff: boui-editable-grid-focus-20260921-01. The live/sample grid, ordered-list/kanban guidance and derived ACR evidence remain open under 373.4. Codex retains integration paths and does not infer source-writing transfer from this review.

Integration: full docs build succeeded with actual exit 0. The accepted 8081 snapshot is now 2026-09-21T01:26:00.535Z, dirty=true, same SHA. Four viewport/theme tag removals and the procurement journey were verified through that served preview. Build log: /private/tmp/boui-tag-integration-build.log. No container or host-server restart occurred. Next grid handoff queued as 4826ab83-1b80-4d8b-a944-c3e5088b066d; Claude explicitly acknowledged the ID and ownership in its shared reply; the assignment is in progress.
