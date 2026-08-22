# Pattern quality bar — per-section checklist (roadmap 109.3, 2026-08-22)

Extracted from the two comprehensive grills (`grill-object-page-2026-08-22.md`,
102.2; `grill-editable-grid-2026-08-22.md`, 102.3), the Slice 109.3 roadmap
text (including the owner-quartet extension), and CLAUDE.md's pattern recipe.
This bar EXTENDS the recipe; it contradicts nothing in it. Every line is
scoreable pass/fail by a human reading the built page, and every line cites
where it came from. A later sweep scores the other 18 pages against it.

## Opener

- [ ] Names who uses the screen, how often, and what "done" looks like.
      (Recipe step 1, verbatim requirement; both grills scored openers
      against exactly this.)
- [ ] Carries the wrong-choice clause: a bolded `<strong>Not …</strong>`
      naming a context where this pattern is the wrong choice, linking the
      alternative screen. (Recipe/94.10; 102.3 found `editable-grid`
      missing it — DSA `content` scored 2 until the clause was added and
      the `PATTERN_TODO` ratchet moved 14 → 13.)
- [ ] The pattern is named and framed for its SHAPE; the domain appears
      only as realistic demo data — no domain word in the name or the
      framing prose. (Recipe / 109.5 owner rule; `object-page` + PO-88213
      is the exemplar; `invoice-list` was the violation, renamed 109.2.)

## Anatomy

- [ ] Ordered list mapping each region to the component that provides it,
      with each component linked. (Recipe step 3.)
- [ ] Names which regions are the human-monitoring signals — the
      AI-manages/human-monitors split made explicit. (109.3 owner-quartet
      extension, verbatim: the bar "requires each pattern … to name which
      regions are the human-monitoring signals.")
- [ ] Where a region visually resembles a different widget, the prose
      draws the distinction explicitly (e.g. object-page's "Reads like
      tabs, is NOT `role="tab"`"). (102.2 cited this line as what earned
      DSA `interaction` 3.)
- [ ] `Related` footer links carry the CURRENT names of their targets —
      no label left behind by a rename. (102.3 found four pages still
      labelling `list-report` as "Invoice list" after the 109.2 rename.)

## Data contract

- [ ] States the request/response/swap-target boundary: what the server
      must return, and what a 4xx returns. (Recipe step 4.)
- [ ] States the contract in machine-operable terms: what an agent POSTs
      to act, and what returns. (109.3 owner-quartet extension, verbatim:
      "each pattern … state[s] its data contract in machine-operable terms
      (what an agent POSTs to act, what returns).")
- [ ] Says which side owns validation state — if the client never invents
      it (never sets `aria-invalid` itself), the contract says so.
      (102.3: the in-cell-validation grill target had no client-side shift
      to observe BECAUSE `row-edit.ts` never sets `aria-invalid` by
      design, and the page's Data contract already stated it — that
      statement is what made the grill result checkable.)

## States

- [ ] A table covering, at minimum: loading, empty, the DIFFERENT empty
      when filters exclude everything, error, partial failure, permission,
      conflict. (Recipe step 5.)
- [ ] Includes a "No JS" row stating the measured degradation — what
      still works without JS and what can never complete (e.g.
      editable-grid: rows editable but never submittable, because
      `initRowEdit()` un-hides Save/Cancel). (102.3 added the first such
      row after live `setJavaScriptEnabled(false)` verification; no page
      had one before.)
- [ ] Where a row enters a state that reveals or hides chrome, the table
      (or adjacent prose) says what layout does — the dirty-row reflow
      class of defect: revealing row actions reallocated column widths and
      grew the row +26px in the Advanced demo only. (102.3, queued 102.9.)
- [ ] Where per-row/per-item independence is claimed ("saves are coalesced
      per row"), the claim is stated precisely enough to verify against
      source — 102.3 verified editable-grid's partial-save row against
      `row-edit.ts` and found it exactly right; that precision is the bar.
- [ ] Print behaviour is stated where the screen has any (what hides,
      what stays). (Recipe "expected where they have something to say";
      102.2 re-verified object-page's action-bar `display: none` +
      all-sections-visible via the existing `opPrint` probe.)

## Components used

- [ ] Linked badges for every component the screen composes, plus a
      complexity badge (1-4). (Recipe step 6.)
- [ ] Names what is deliberately NOT used and why, where a plausible
      behavior was rejected (e.g. editable-grid: `data-grid-nav` "fights
      rapid sequential entry"; add/remove is "plain app code, not a
      behavior"). (102.3 cited exactly this for DSA `interaction` 3.)

## Keyboard (where the screen has traversal to walk)

- [ ] A keyboard walkthrough whose claimed order matches the built DOM —
      102.3 verified `Item → Qty → Unit price → Save → Cancel → Remove`
      against the rendered page, not the prose. (Recipe "expected where
      they have something to say"; 102.3's traversal check.)
- [ ] Any scrollable navigation region is keyboard-reachable
      (`tabindex="0"` on the scrollable element). (102.2 confirmed this
      on object-page's anchor nav.)

## Runtime claims and literals (cross-section)

- [ ] Every claim that the browser will do something has a case in
      `check-claims.mjs` — and the case measures the user-visible outcome,
      not a proxy: 102.2's probe asserted `aria-current` moved but never
      that the landed section cleared the sticky chrome, which is exactly
      what let a 2.25px overlap at 390px through. (CLAUDE.md executable-
      claims rule; 102.2, queued 102.8.)
- [ ] Any intrinsic dimension literal in the page's scoped styles carries
      a comment saying why it is intrinsic (object-page's `7rem`
      scroll-margin carries a 9-line comment with its regression history —
      that is the bar 102.2 scored `spacing` 3 against). Fixed constants
      tuned at one width are a known defect class: state whether the value
      holds at 390px. (102.2: the `7rem` undershoots at 390 because the
      header wraps.)

## What this bar does NOT cover

Per the measurement doctrine ("say what the number does not cover"): a page
passing every line is not "a good page" — the bar checks the presence and
verifiable shape of required sections, not whether the prose is clear, the
demo data credible, or the screen well designed. It does not score the DSA
dimensions (that is a separate report-only rubric pass, per 102.2/102.3),
does not verify live behavior itself (that is `check-claims.mjs` and the
grills), and does not detect defects only measurement finds (the 2.25px
overlap and the +26px reflow were invisible in screenshots — both grills).
Whether a wrong-choice clause SAYS something true remains a human call
(CLAUDE.md: the gate enforces the clause's presence, not its content).

## Sweep protocol

The sweep is its own roadmap item (109.3 Accept: "the sweep is its own
later item with per-page verdicts") — one pass per page, verdict recorded
per page. The same pass also writes the 13 outstanding wrong-choice
clauses (`PATTERN_TODO` in `apps/docs/scripts/check-wrong-choice.mjs`,
per the Slice 112 grill, settled Q9: "one pass per page beats two"):
app-launch, approval, bulk-actions, field-editor, filter-panel,
goods-receipt, list-report, login, reporting-dashboard, settings-admin,
staging, value-help, wizard. 101.4-101.7 are written against this bar
from day one (109.3).
