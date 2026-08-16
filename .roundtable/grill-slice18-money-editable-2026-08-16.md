# Grill: Slice 18 (money & editable-table depth) — Objective review at slice close

2026-08-16, dispatched by the Roadmap loop's milestone rule (rule 6) after
Slice 18's five items shipped. Four adversarial seats run as parallel
read-only agents against the shipped code: Architect (API/contracts), ERP
domain expert (real-world fit), Skeptic (failure-scenario red-team),
A11y+Docs-UX. Evidence bar per LOOPS.md: a conclusion needs ≥2 independent
sources (seats reaching it separately, or a seat + a code-walk) to be
`Evidence`; single-seat judgments are `Hypothesis`.

## Convergent findings (Evidence — reached independently by ≥2 seats)

**E1 — `setInputDecimals` destructively rounds real data. The slice's most
serious defect.** Architect (strongest objection), ERP (most-valuable
change), and Skeptic (#6) all landed on it from different angles:
- Unknown units fall to 0 decimals (`unitDecimals` `?? 0`), so selecting
  any UOM outside the ~30-entry table — `kgs`, `ltr`, `MT`, `cbm`, real
  master-data codes are almost never these exact strings — silently
  rewrites 2.5 → 3 **and dispatches `input` so it reads as a user edit**,
  propagating into every subtotal.
- Currency-driven rounding is equally destructive where precision is
  legitimate: unit *prices* carry precision independent of amount
  precision in every major ERP (JPY prices quoted at 2-4 dp); the
  composite's price cell uses `.bo-money`, so picking JPY rounds
  12.40 → 12. Plus `toFixed` artifacts: `-0`, `1e+21`, silent mutation
  past `MAX_SAFE_INTEGER` at JPY/VND scale.
- Verdict: reformat must never change the numeric value (pad/trim only);
  when the value doesn't fit the new precision, adjust `step` and leave
  the value (flagging the cell is the consumer's option); unknown units
  leave precision alone.

**E2 — The unit table is not the same kind of exception as the currency
table.** Architect (FLAWED) + ERP (defaults wrong for real conventions:
`t` quotes to 3 dp in bulk trade, pharma needs `kg` at 3). ISO 4217 is a
closed normative registry; the unit table is an invented opinion whose
*miss path is the normal case*. The user's explicit call to embed it
stands — but its unknown-unit behavior must be non-destructive (E1), its
docs must stop implying authority it doesn't have, and `t`/`kg` deserve
convention notes. (Original triage had scoped units as documented-only;
the user overrode; this review's finding is about the miss path, not
about re-litigating the embed.)

**E3 — Live-mode (`data-row-edit="live"`) has two save-integrity bugs.**
Skeptic #1/#2, corroborated by Architect's #2 observation:
- **Cancel becomes Save**: `resetField`'s select-reset `change` re-enters
  the change listener, which calls `saveRow` unconditionally in live
  mode — baselining and persisting exactly the values the user asked to
  discard, and making the remaining fields' restores no-ops. Needs a
  re-entrancy guard.
- **Save-before-reformat**: on a currency/unit pick, row-edit's document
  `change` listener runs before money/quantity's (init order), so
  `bo:row-save` carries the old-precision value and the reformat never
  triggers a second save. Backend persists `1250.00`, UI shows `1250`.
  Deferring live saves a microtask (as tag saves already are) fixes the
  ordering for all same-tick re-derivations at once.

**E4 — Announcement design is inconsistent and silent where it matters.**
A11y seat + Architect's cell-change-per-keystroke observation:
- The money/unit reformat is silent to screen readers (WCAG 4.1.3 —
  value changes programmatically, no announcement path documented).
- `data-line-total` cells (the direct product of the user's edit) have no
  `aria-live` while the grand total and sums do — inverted priority.
- Two-plus polite regions queue per keystroke in the composite
  (announcement overload); numeric live regions should announce on
  committed change, not per keystroke.

## Single-seat findings (Hypothesis unless code-walk confirmed)

**H1 (Skeptic #3, code-confirmed → treat as Evidence):** `data-sum-of`
with `step="any"` or no step sums to 0 decimals (7.50 prints as 8).
**H2 (Skeptic #4, code-confirmed → Evidence):** nested tables break sums
both directions — inner-table inputs double-count into outer totals
(tbody selector not scoped to own table), and inputs in a nested table
never trigger the outer recompute (`closest('table')`).
**H3 (Skeptic #5):** microtask-deferred tag save on a row detached in the
same tick dispatches into nothing — silently lost save.
**H4 (A11y, code-confirmed → Evidence):** Save/Cancel hide themselves on
click → focus drops to `<body>` (WCAG 2.4.3). Keyboard-blocking, in
shipped library code, affects every `data-row-edit` consumer. ~3-line fix.
**H5 (Architect):** `isLive` exact-string compare — `data-row-edit="LIVE"`
degrades silently to batch. Low, document or normalize.
**H6 (Architect):** tag-event allowlist in row-edit is a coupling
precedent; a generic `bo:dirty` seam is the better long-term shape. Defer
— another contract change now isn't justified by one consumer.
**H7 (ERP):** per-line currency is document-level in real ERPs; the demo
teaches it silently. One callout paragraph fixes it. Composite's product
`<select>` regresses from the Medium demo's combobox teaching.
**H8 (A11y):** progression intro names 4 steps but the page has 5
sections ("Money & unit cells" unannounced); money/quantity pages don't
link to the editable-grid composite; composite's repeated
"Cost centers"/"Add cost center" labels aren't per-row distinguishable.
**H9 (ERP):** live-mode per-field commit vs. real ERPs' row-exit commit;
no optimistic/rollback story shown. Document the trade-off, don't build.

## Explicitly examined and held

Orphan money selects, multiple `.bo-money` per cell, thead/tfoot
exclusion in sums, batch-mode Cancel ordering (`setDirty(false)` trailing
all re-derivation) — all verified sound by the Skeptic. The currency
exception sets match ISO 4217 Annex A exactly (ERP seat). row-edit
remains one coherent concern; no split warranted (Architect).

## Outcome → Slice 19 (hardening), queued by this review

1. Non-destructive `setInputDecimals` (E1) + unknown-unit leave-alone
   (E1/E2) + `-0`/overflow guards.
2. Live-mode integrity: cancel re-entrancy guard + microtask-deferred
   live saves + detached-row guard (E3, H3).
3. Focus management on Save/Cancel (H4) + per-row labels (H8).
4. table-sum robustness: step-`any`/missing-step decimals, nested-table
   scoping both directions, checkbox exclusion (H1, H2, Architect #3).
5. Announcement pass: committed-change live regions, line-total parity,
   documented SR story for reformats (E4).
6. Docs batch: currency-per-document callout, 5-step intro map,
   cross-links, composite combobox, price-precision caveat, unit-table
   convention notes, live-mode trade-off note (H7, H8, H9, E2-docs).

Deferred, recorded: `bo:dirty` generic seam (H6), `isLive` normalization
(H5) — revisit at the next contract-shape change, not before.
