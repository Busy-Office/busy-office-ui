# Project panel — how to grill the FRAMEWORK in this repo

The global `/round-table` skill is a MARKET / FEASIBILITY tool. Wrong instrument for
"is this design any good". A design grill uses a LOCAL panel whose personas fit the
artefact: a CSS framework contract (tokens, cascade, component HTML/CSS APIs) plus its
rendered docs gallery.

| Seat | Who they are | What only they can see |
|---|---|---|
| **Consumer** | Devi, ERP app developer building screen #40 under deadline. Reads ONLY `DESIGN.md`, `README`/docs pages, and rendered gallery HTML — never framework source. | Whether the contract is learnable and unsurprising from the outside; where the docs promise something the rendered page doesn't deliver. |
| **Platform** | Kofi, CSS platform engineer. Reads the SHIPPED `dist/` CSS and rendered pages. | Where `:has()`, container queries, `@layer`, sticky positioning actually fail: browser support cliffs, perf traps, specificity/ordering hazards, dark-theme gaps. |
| **Auditor** | Ines, accessibility auditor (WCAG 2.2 AA, enterprise VPAT). Reads rendered HTML + shipped CSS. | What a keyboard/screen-reader user cannot do; contrast and focus failures; ARIA claims the markup doesn't keep. |
| **Skeptic** | Rex, red team. Uses only DOCUMENTED classes/attributes in hostile combinations. | Cascade collisions, token misuse, density/theme interactions, HTML the CSS never anticipated, claims in DESIGN.md that are untrue of the artefact. |

## Rules

1. **Drive the real thing.** Findings are made against the built artefacts — the
   rendered pages in `apps/docs/dist/` and the shipped `packages/core/dist/` CSS —
   never by imagining what source might do. A finding that names no file/page is not
   a finding. Findings that require a live browser to confirm (focus order, sticky
   behavior) are allowed but must be marked **NEEDS-RUNTIME**.
2. **Say the persona and the step.** "As Devi, building a filter form from the form
   docs page…" — a critique with no actor is not actionable.
3. **Three buckets, always labelled**: `FUNCTION` (wrong/nothing), `WORKING` (needed
   information or capability missing/misplaced), `COSMETIC` (correct but looks wrong).
4. **Severity, and be honest**: BLOCKER / HIGH / MEDIUM / LOW.
5. **No inventing scope.** Slice 1 only (tokens, reset, primitives, button, form,
   badge, table, nav, dialog, htmx.css, docs). Tabs/dashboards/approvals are stubs by
   design — notes about them go in a "not this review" list.
6. The chair synthesises and surfaces conflict; it does not vote. Owner decisions are
   marked **[HUMAN CALL]** with a recommended default and its cost.
