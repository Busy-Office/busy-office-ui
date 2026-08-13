# Grill: slice 4 — record & approval components · 2026-08-13

Three seats (Consumer/generality, Auditor, Platform) vs shipped CSS + rendered pages.
Context: the owner's requirement was that these be GENERAL — reusable in any ERP, not
domain-locked.

## Verdicts
| Seat | Verdict |
|---|---|
| Consumer | Required, with fixes — meets the general bar; mono-lock + docs narrow it back |
| Auditor | Required — holds the a11y bar except placeholder-as-label |
| Platform | GO conditional — land F1 (band corner) before release |

## Generality verdict (the owner's ask): PASS
Zero PO/domain class names, zero hardcoded copy in CSS, comments name five record
types. The PO is demo content only; the component is neutral. Confirmed by all three
seats independently. Two *content assumptions* leaked into styling (below), fixable.

## Gate (worked this pass)

1. **Unlabeled inputs (Auditor HIGH, must-fix)** — composer + line inputs on both
   pages are placeholder-only (SC 1.3.1/3.3.2/4.1.2) — the classic fail the rest of
   the framework doesn't make. → aria-label on every input.
2. **Band corner bleed (Platform F1, HIGH, visible defect)** — `.bo-widget__band`
   has square corners; `.bo-widget` doesn't clip, so the muted band paints nibs past
   the 6px radius — prominent in dark. The dialog footer already solves this with
   `border-end-*-radius: inherit`. → same fix on the band.
3. **mono-lock (Consumer MEDIUM)** — `.bo-ordered-list li` forces mono+tabular, which
   is wrong for prose ("approval route" names render broken) while the comment claims
   it fits those. → `--plain` modifier to opt out of mono; demo a prose body.
4. **llms.txt wrong URL (Consumer HIGH, AI-legibility)** — record-card heading links
   to `/components/badge/`. Generator uses `c.classes[0]` whose owner is badge (the
   `--type` variant), not record-card. → map by component name, not first class.
5. **reorder-JS contract (Consumer MEDIUM, select-all-trap echo)** — `↑↓×` are inert
   markup; docs don't say "wire these yourself". → note on the page + API table.
6. **heading order (Auditor MEDIUM)** — record-detail is h1→h3 (skipped h2). →
   Status/Audit become h2.
7. **reorder-button labels (Auditor LOW)** — Move up/down generic while Remove is
   row-named. → name the row on all row actions.
8. **cross-component dependency + ownership (Platform F7, MEDIUM)** — record-card.css
   depends on widget/badge/button unstated, and writes `.bo-widget__header` rules
   (dashboard's namespace) without the ownership note the project uses elsewhere. →
   dependency banner + ownership comment.

## Fast-follow / accepted (not this pass)
- Platform F2c: two trailing status badges split (document "one trailing status badge,
  last child" — markup contract note); F4: tokenize `--sm` 1.5rem + fix "above the
  floor" comment (it's AT the floor); F3 trailing letter-spacing nit; F5 inline
  actions aren't right-aligned (contract question, wraps sanely); band live-region for
  the HTMX-swap case (doc note).
- Consumer roadmap: avatar byline, collapsible cards, sticky band, a real
  `.bo-composer` component, skeleton/empty states — slice-4 continuation, not gate.

## Outcome (worked same day) + owner-directed decomposition

The monolithic "record-card" was DISSOLVED into granular general components at the
owner's direction ("too specific — like timeline, one component with different
settings"):
- `.bo-badge--type` → Badge page (variant showcase)
- `.bo-btn--sm`, `.bo-btn--danger-ghost` → Button page (variants)
- `.bo-widget__band` (+ header `:has()` composition) → moved into dashboard.css
  (widget owner — resolves Platform F7 namespace/ownership) + Widget-parts demo
- `.bo-byline` → new standalone component (default / --compact)
- `.bo-ordered-list` → new standalone component, ONE component with settings:
  default (mono/code) · --plain (prose) · __actions (editable rows)
- record-detail stays a Pattern (the PO composition), not a component.

Gate items all landed in the same pass: band corner clip (border-end-*-radius
inherit); unlabeled composer input → aria-label; heading order (Status/Audit → h2);
row-named reorder labels ("Move Monitor arm up"); mono opt-out (--plain); llms.txt
slug fixed to map by component name; dependency/ownership banner on the source.
16 components, all six build gates green, 37 pages, 11 tests.

## Survived falsification
No new primitives — composes widget/badge/button (all three seats confirm). `:has()`
header scoping is specificity- and source-order-correct and leaves dashboard widgets
untouched (Platform F2d — "soundest decision in the slice"). Type-chip inversion
15–18:1 both themes. Ordered-list marker survives (no flex on li); numbers real. 24px
reorder targets meet 2.5.8. Frozen records remove controls (no orphaned disabled).
Two-channel status holds. Layer discipline clean; grid reflow + container-query
interplay clean.
