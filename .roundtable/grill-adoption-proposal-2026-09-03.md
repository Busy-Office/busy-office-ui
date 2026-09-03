# Triage — docs adoption surface proposal (2026-09-03)

Input: `.roundtable/`-style proposal delivered in chat (not a file at receipt),
sourced against `Busy-Office/busy-office-ui@5b3ab697` and
`DibbayajyotiRoy/RoyUI@0e29468`, plus eight reviewer notes. 16 items across
four lanes (A dispatchable, B needs ratification, C open questions, D
refused).

**Method.** Per this repo's own rule (`CLAUDE.md` — *a number you report is
load-bearing, red-prove it like a gate*), citations were re-run against the
live tree before any verdict below, not read off the proposal's own text.
Not every citation was re-run — the ones a verdict actually depends on were.

## Verification results

| Item | Citation | Reproduces? |
|---|---|---|
| A1 | No size-budget gate in `packages/core/package.json`'s `build` script | ✓ confirmed |
| A2 | `Gallery.astro` takes no `description` prop; most component pages lack one | ✓ confirmed (rough grep, not exhaustive) |
| A3 | `patterns/master-detail.astro:84` says "drawer"; `components/offcanvas.astro` lacks the term | **✗ REFUTED** — `offcanvas.astro` uses "drawer" as its *dominant* vocabulary: 15+ occurrences across headings ("Open the drawer", "Start-side drawer", "End-side drawer"), IDs (`drawer-nav`, `drawer-title`), prose, and its own wrong-choice clause ("A drawer is modal…"). The cited gap does not exist between these two pages. |
| A4 | `dsa-scores.json.scored` field exists and is stated as source-of-truth; `derive-floor.mjs` is BCD-driven; AT evidence is owner-blocked per `STATUS.md` | ✓ confirmed, all three |
| A5 | `index.astro:118` "one CTA" | **partially wrong citation** — line 118 is the `npm i` install snippet, not a CTA. The real CTA block (lines 117-119) has 2 buttons ("Build your first screen" / "Components"), plus top nav (4 links) and 6 task-tiles further down. Undercounts what exists. The underlying idea — routing by *adoption scenario* (existing app / new app / CSS-only / htmx / theming) rather than by *component category* — is genuinely different from what ships and has some merit independent of the flawed citation. |
| A6 | Both READMEs: 0 images, no FAQ heading, no badges | ✓ confirmed exactly |
| A7 | `installation.astro` shows only `npm i`, no pnpm/yarn/bun | ✓ confirmed (file path in the proposal was wrong — `getting-started/installation.astro`, not `installation.astro` — but the claim itself holds) |
| B1 | `CLAUDE.md`'s recipe puts Markup last; `data-table.astro`'s Markup section is its 18th (last) `<h2>`; `check-page-shape.mjs` gates demo-first/spec-last | ✓ confirmed exactly, including the gate's own test cases |
| B2 | `Gallery.astro`'s sidebar is a hand-written array; `index.astro`'s task tiles are hand-written prose; no tagline/category field in generated `api.json` | ✓ confirmed |
| B4 | `DESIGN.md` is 412 lines, 20 dated-parenthetical instances, no `CONTRIBUTING.md` at root | ✓ confirmed |
| B5 | No `stability` field anywhere in the generated API surface | ✓ confirmed |
| §8 incidental | `derive-floor.mjs` (Firefox 129/Safari 17.5) vs `browserslist` (firefox≥128/safari≥17.4) | **Not a defect.** `derive-floor.mjs`'s own header states it is deliberately independent of browserslist — computed from shipped CSS via BCD, precisely because a hand-typed floor was once wrong (`derive-floor.mjs:5-8`). A derived floor one minor version above the declared target is the expected relationship, not drift. A gate here checks a near-permanently-true predicate — this repo's own 94.11 refusal shape. |
| §8 incidental | `ClassRef.astro`'s docblock says the table renders "at the TOP" | ✓ confirmed stale — comment predates the 2026-08-16 demo-first/spec-last decision; harmless, folds into B1's header rewrite if B1 ships. |

## Verdicts

**Lane A (mechanical, red-provable) — concur with 6 of 7, as scoped:**
A1, A2, A4, A6, A7 have solid evidence and clear falsifiers; dispatchable as
written. **A5 needs its citation and its claim corrected** before dispatch —
not "one CTA exists" (false) but "no adoption-scenario router exists"
(true, different, and the actual gap worth closing). **A3 needs re-scoping**:
drop the offcanvas/drawer example (it's wrong), and scope the terminology
table to terms that genuinely have no page at all today — SAP/Fiori
vocabulary (C3) is exactly that, and the seed list's other rows (select →
dropdown/combobox, grid → data-table, etc.) should each be spot-checked the
same way before landing, since A3's own worked example failed this check.

**Lane B (needs ratification) — B1 is the one that needs an explicit human
call, not a synthesized one.** The facts check out completely, but the
proposal's own justification for reversing a dated, gated, cross-referenced
decision — "N=1 reviewer > N=0 readers" — misstates the original decision.
The 2026-08-16 call wasn't made from zero evidence; it was a comparison
against four established framework docs sites with "zero exceptions" found
for demo-first/spec-last (`CLAUDE.md:31-33`). Reversing it on one reviewer's
preference, framed as beating an evidence-free baseline, understates what's
being overturned. The proposal's actual design (frame fixed at Markup-second,
middle stays free-form, spec tables still generated-only at the end) is
reasonable **on its merits** — but it should be brought to the owner as "here
is a real tradeoff, reconsider the 08-16 call," not waved through as a
one-block move.

B2, B4, B5, B6 concur — mechanical, generated-not-hand-maintained, matches
the repo's own storage doctrine (data lives in source, docs are derived).
B3 concurs but is correctly sequenced behind B2/A4 in the proposal's own
dependency graph — nothing to add.

**Lane C — no verdict needed, they're already correctly framed as owner
questions.** C3 should resolve before A3 re-ships (the SAP/Fiori column is
exactly the terminology gap that's real, unlike the offcanvas example).

**Lane D (refused) — spot-checked, no objection.** The "publish on every
push" and "registry.ts" refusals both cite real, correct mechanisms
(`check-publishable`, and this repo's own drift history at Slice 244). No
further verification needed for a refusal that isn't being acted on.

## Recommendation

1. Dispatch **A1, A2, A4, A6, A7** as scoped.
2. Fix **A5**'s citation/framing (adoption-scenario router, not "one CTA"),
   then dispatch.
3. Re-scope **A3**: drop the offcanvas/drawer example, spot-check every
   remaining seed row the same way before committing the table, and hold the
   SAP/Fiori rows for C3.
4. Take **B1 to the owner explicitly** as a reconsideration of the 08-16
   decision, not a ratification — the tradeoff is real, but it isn't the
   proposal's to decide by itself.
5. **B2, B4, B5, B6** concur as written.
6. **Incidental §8's browserslist item is refused** — not a defect, no gate
   warranted (94.11 shape). The `ClassRef.astro` stale comment is real but
   trivial; folds into B1 if/when B1 ships, otherwise a one-line fix anytime.
