# Sign-off grill — 2026-08-15 post-ultrareview surface

Scope: everything shipped after the morning's cloud ultrareview —
`.bo-progress`, `.bo-tree`, the visual-regression harness, po-app's
`/spend` progress bars, `/receive`, `/stress`, and the grouped-rows docs
guidance. Two panel seats (Auditor, Skeptic per `PANEL.md`); findings
fixed same-session where noted.

## Auditor (Ines) — findings and outcomes

1. **FUNCTION/HIGH — `scope="colgroup"` non-conforming** (data-table
   docs + po-app `/spend`): per the HTML spec, `scope="colgroup"` is
   only conforming on a `th` inside a `<colgroup>`; a group-header row
   inside a `<tbody>` wants `scope="rowgroup"`. The docs also
   overpromised what screen readers do with it. **FIXED**: both usages
   now `scope="rowgroup"`; docs claim softened to name the association
   honestly and recommend keeping group names in prose when
   load-bearing (SR rowgroup support varies — NEEDS-RUNTIME).
2. **WORKING/MEDIUM — `--warning` band color-only in po-app**: the
   75–89% band had a warning-toned bar with no text saying so,
   violating the component's own two-channel rule. **FIXED**: text now
   appends "— approaching budget" in that band.
3. **WORKING/MEDIUM — no accessible name on shipped `<progress>`**:
   adjacent prose is not programmatically associated. **FIXED**:
   `aria-label` added to shipped usages and to the docs' basic markup;
   ApiTable note now states the requirement — including the pattern of
   carrying the REAL value in the name when the bar is visually capped
   at 100 (resolves finding 4, WORKING/LOW, in the same stroke).
4. **COSMETIC/LOW ×3, accepted as-is, documented here**: `autofocus` on
   `/receive` (defensible for a dedicated scan station); possible
   double-polite announcement on unknown-PO scans (order indeterminate,
   NEEDS-RUNTIME, harmless); chevron absent on Firefox <128 where
   `content` alt-text syntax is unsupported (below the browser floor,
   aging out).

Clean verdicts: `.bo-tree`'s contract holds (chevron alt-text, focus
ring from the reset, native expanded/collapsed state); `/receive`'s
live-region wiring is correct; `.bo-progress`'s `appearance: none` does
not harm AT exposure and the forced-colors fallback is right.

## Skeptic (Rex) — findings and outcomes

1. **FUNCTION/HIGH — harness `fullPage` defeated by the app shell**:
   every baseline was exactly viewport-height (1440/390×1000) — the shell
   is `100dvh/overflow:hidden` with an inner scroller, so ApiTable/Markup/
   Related below the fold were never screenshotted; "32 shots checked"
   overstated coverage. **FIXED**: the harness's injected style now
   unlocks the shell (`block-size:auto/overflow:visible`), baselines
   regenerated — data-table now 1440×6442. The 390px trade-off was then
   closed same-session: the 858px-wide narrow shots were horizontal
   CONTENT overflow escaping the unlocked scroller (wide code blocks),
   not shell layout — `overflow-x: clip` on the main scroller keeps
   narrow baselines at a true 390px while capturing full height.
2. **WORKING/HIGH — ratio threshold scaled with page height**: 0.1% of a
   1.44M-px shot = 1,440px budget; a broken badge (~1,300px) passed
   silently. **FIXED**: absolute 100px changed-pixel budget (same-machine
   runs measured ~0px noise).
3. **FUNCTION/HIGH — po-app bulk-approve approved ALL pending**: row
   checkboxes had no `name`/`value`, `hx-include` posted nothing, and
   the handler blanket-approved — the exact bug class the consumer
   gauntlet once found in the DOCS recipe, fixed there but never in
   po-app itself. **FIXED**: checkboxes carry `name="id" value`, handler
   approves only posted ids; verified live (approving PO-88210 left
   PO-88213 Pending).
4. **FUNCTION/MEDIUM — bulk-approve full-tbody swap desynced load-more**
   (next click duplicated rows 10-20 with duplicate ids). **FIXED**: the
   response removes the load-more button via `hx-swap-oob="delete"`, and
   the layout's `htmx:afterSwap` now also re-applies column visibility.
5. **WORKING/MEDIUM — indeterminate `<progress>` unsupported but
   undocumented**: `appearance:none` suppresses the platform's
   indeterminate animation, so value-less progress renders as a lying
   empty bar. **FIXED (docs)**: ApiTable note now requires `value` and
   points unknown-duration work at Skeleton; styling indeterminate
   remains deliberately out of scope.
6. **COSMETIC/MEDIUM — tree chevron didn't mirror under RTL** (glyphs
   don't flip with logical properties). **FIXED**: explicit
   `[dir="rtl"]` flip (`◂`, open rotates −90deg) — same precedent as
   `.bo-select`'s chevron.
7. **FUNCTION/LOW — harness static server allowed path traversal**
   (localhost/ephemeral, sloppy not dangerous). **FIXED**: resolved-path
   containment check.
8. **Refuted by verification** (recorded so they aren't re-raised):
   `warning-strong` remap has no other consumers; tree leaf/label
   alignment calc is exactly equal; em indentation is linear, not
   compounding; `evaluateOnNewDocument` accumulation is deterministic
   (fragile — noted); pagefind doesn't break `networkidle0`; /receive's
   vendor Map can't go stale (id→vendor only); /stress clamp holds.
   Accepted LOWs: `.bo-progress` fixed 10rem width — its NEEDS-RUNTIME
   was then resolved same-session: verified live at 390px inside the
   /spend group header, the cell wraps to two clean lines with zero
   overflow, and the over-budget path (134%: capped bar, real value in
   text and aria-label) renders as documented; `JSON.stringify`-into-
   script pattern in /receive (safe with current data).

## Outcome

All HIGHs and MEDIUMs fixed and verified same-session (55 tests, 27
contrast pairs, page-shape/link gates, harness green twice on
regenerated full-page baselines, po-app bulk-approve verified live).
Accepted LOWs are recorded above with reasons rather than silently
dropped.
