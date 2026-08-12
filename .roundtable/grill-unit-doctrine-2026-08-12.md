# Grill: CSS unit doctrine · 2026-08-12

Seats: Platform (Kofi), Auditor (Ines), Practitioner (Priya). Artifact:
`.roundtable/unit-doctrine-2026-08-12.md` (v1 doctrine). All verdicts: adopt with
required amendments.

## The verdict on the core question

**Density stays rem — unanimous, and now closed.** The arithmetic: at a 20px root,
compact text (16.25px × 1.5 line-height + padding ≈ 34.4px) still fits the scaled
37.5px row; a px-anchored 30px row would CLIP — and clipping is the failure ERP users
escalate with screenshots, while "fewer rows" is a settings conversation. The
`data-density` toggle is the decoupling mechanism an admin wants: a low-vision user
runs 20px root + compact and gets their density back at a readable size — something a
px anchor can never offer. **px overrides of density tokens are declared unsupported.**

## Corrections the grill forced on the doctrine

1. **The WCAG rationale was wrong (Ines F1 + Kofi F2).** Full-page zoom scales px and
   rem identically; rem thresholds only help the ~3% who raise the browser default
   font size (Internet Archive telemetry). That population is disproportionately the
   8h/day low-vision ERP user, so the migration stands — but as *beyond-conformance
   support for text-only scaling*, never as "a 1.4.4 fix". Corollary added: never
   suppress zoom (`user-scalable=no`) — that IS the 1.4.4 kill switch.
2. **The flagship ch example was broken as proposed (Kofi F1, HIGH).** An
   `--eof-audit-time-width: 11ch` token is consumed by TWO font contexts (mono time,
   proportional detail indent) — ch resolves per consuming element, so the indent
   never aligns. Fix applied: the audit entry becomes a grid (`max-content 1fr`),
   which deletes the magic number entirely. Doctrine rule: **never store ch in a
   custom property consumed across font contexts; ch widths are minimums, never
   clipping widths; mono contexts only, +1ch slack** (fleet mono fonts differ).
3. **New conformance exposure found — unit-agnostic (Ines F2, HIGH)**: the table
   compaction `display:none`s secondary columns with no recovery — probable 1.4.10
   Reflow failure at 400% zoom, and the rem migration makes it fire *earlier* for
   text-scaling users. Rule adopted: **container compaction may compact (padding,
   density) but may not delete data columns unless an in-page reveal exists.** Interim:
   the docs now state the consumer requirement (hidden columns must be reachable, e.g.
   via the row's detail view); a disclosure pattern is on the ledger.
4. **Heights are minimums (Ines F3)**: table-cell `height` is a minimum by spec
   (safe); `.eof-btn` fixed height was one consumer change from 1.4.12 clipping —
   migrated to `min-height`.
5. **Root-font-override constraint (Kofi F2 + Priya F2)**: rem thresholds resolve
   against the root's COMPUTED font-size in @container (unlike @media) — a host page's
   `html { font-size: 62.5% }` turns 30rem into 300px. Documented hard constraint:
   the framework assumes an unmodified root font-size; portal/SharePoint injection
   into a rescaled host requires an iframe (iframes are safe — own root). Email out
   of scope.
6. **Print clause (Priya F3 + Kofi F5)**: `pt` permitted only inside `@media print`
   (already shipped: 10pt body); no ch widths in print (font substitution wraps
   amounts on wet-signature approvals) — print uses nowrap on numeric/time columns.
7. **Also codified (Kofi F5, Priya F5/F6, Ines F5)**: unitless line-height only;
   `9999px` radius is an allowed sentinel; `100dvh` accepted with the svh trade-off
   recorded; px hairlines confirmed (0.0625rem borders would smear at 125% scaling —
   single-edge borders + integer px IS the fleet-scaling mitigation); interactive
   target floor 1.5rem in every density tier — bare checkboxes need a padded
   label/cell restoring 24px; the 70ch prose measure is docs-typography only, never
   application screens.

## Changes applied to the framework (this commit)

- Container thresholds unified: 480px→30rem (table, stepper), 900px→56rem (shell).
- `.eof-btn` height → min-height.
- Audit trail: grid alignment replaces the `--eof-audit-time-width` token + calc
  indent (magic number deleted; time column self-sizes, mono + tabular-nums keep
  digit alignment).
- The full doctrine added to DESIGN.md (feeds V2's "Core concepts → Design tokens").
- Docs: compaction caveat (1.4.10 consumer requirement) on the data-table page.

## Open ledger additions

- Disclosure pattern for compacted columns (design work, slice 4 candidate).
- Visual verification of rem thresholds on Windows classic scrollbars
  (scrollbar-gutter reserves ~17px — thresholds fire later in content terms).
