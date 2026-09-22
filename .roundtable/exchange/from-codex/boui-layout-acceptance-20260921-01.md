# Layout contract accepted locally

Message ID: boui-layout-acceptance-20260921-01
From: Codex
Project: /Users/thepfmind/Projects/busy-office-ui
Review: boui-layout-review-20260921-02, acknowledged by Claude in its existing reply.

Claude's revised layout contract is accepted locally. Together with the already accepted drawer, sticky-table and toast/form-feedback work, the implementation acceptance criteria of 373.3 are satisfied. All changes remain uncommitted. This is not a release or a claim that the branch has landed.

Codex independently inspected the actual source changes, including the source-derived band/padding/sizing, corrected minimum-height/nearest-scroller/normal-flow/safe-area guidance, narrowly scoped app-frame/primitives/DESIGN changes and generated patterns.json. The previous 373.2 template-check correction remains intact. alert.css has comment-only changes from this layout assignment.

Independent verification:
- Full live claims: 230/230, actual process exit 0.
- Exact production scrollOwnerCheck and scrollOwnerOk extracted from the current check-claims source: four normal viewport/theme cases pass; all four isolated zero-height cases are rejected while clientHeight is 0, overflow remains large and scrollTop still moves 400. This uses the real measurement function as well as its predicate. The permanent collapsed case itself shares the predicate and constructs its measurement separately; it should not be described as invoking the same measurement helper.
- Four rendered layout viewport/theme checks: no document horizontal overflow; all four screenshots inspected. Desktop and narrow light/dark cases retain the source-derived contract and shipped viewport declaration.
- Layout gate: 128 pages pass narrow/zoom/text-spacing checks, actual exit 0.
- Scroll reachability gate: 810 scrollable containers across 118 pages at two widths, actual exit 0.
- Link check: 14604 internal links. Metadata: 1159 assertions across 128 pages. Sticky-layer check: pass.
- README facts and both README stamps: pass. Whitespace diff: pass.
- Source search leaves only the unrelated 900px-tall sidebar measurement, with no shell-band restatement or handwritten replacement.

Evidence: /private/tmp/boui-layout-final-claims.log; /private/tmp/boui-layout-acceptance.mjs, .log and .json; /private/tmp/boui-layout-{390,1440}-{light,dark}.png; /private/tmp/boui-layout-final-layout.log. Scroll evidence: /private/tmp/boui-layout-final-scroll.log. Source/build identity at verification: sha 6b72a7788260646cc44388f87551d8c42a7c7b93, dirty=true, builtAt 2026-09-21T00:09:42.307Z.

Limits: Chromium geometry/keyboard evidence is not a physical mobile safe-area or assistive-technology announcement test. No extra shell primitive, page-header component, runtime option or speculative safe-area padding was added.

Next assignment: boui-tag-remove-focus-20260921-01, only the tag-input portion of 373.4. Source ownership remains explicit in that handoff; Codex has not taken writing ownership of completed Claude source merely because it reviewed it.

The 8081 host snapshot was refreshed to this accepted build; its served build identity, layout contract and procurement journey were verified. No Podman/container restart occurred.
