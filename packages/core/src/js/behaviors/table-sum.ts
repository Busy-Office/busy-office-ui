/**
 * Declarative realtime column totals — the auto-sum half of Slice 18's
 * subtotal contract (a deliberate, named exception to "you do the data";
 * the other half is listening to `bo:cell-change` yourself for custom
 * math like qty × price). Mark any element inside a <table> with
 * `data-sum-of="<field>"`: it live-updates to the sum of every tbody
 * field (input/select) whose `name` is `<field>`, on any input/change in
 * that table.
 *
 *   <tfoot><tr>
 *     <td>Total</td>
 *     <td class="bo-data-table__col--numeric" data-sum-of="qty">7.50</td>
 *   </tr></tfoot>
 *
 * Decimals: `data-decimals` on the sum element wins; otherwise the widest
 * step among the summed inputs decides (step="0.01" → 2). Non-numeric
 * values count as 0. Render the correct initial total server-side — this
 * only updates on change, it never does an eager first pass (swap-proof,
 * not scan-proof, like every other behavior here).
 *
 * Put `aria-live="polite"` on the sum element — a screen-reader user
 * editing a quantity gets no confirmation the total moved otherwise
 * (same live-region need as the data-table selection count and the
 * file-upload list).
 *
 * Boundaries (documented, not silent): only THIS table's own rows sum —
 * a nested table's same-named fields never leak into the outer total,
 * and edits inside a nested table don't retrigger the outer sum (put
 * the sum in the table that owns the fields). Checkboxes/radios sharing
 * the name are excluded. Steps with no precision info ("any", missing)
 * fall back to the values' own decimal places.
 */
let installed = false;

/* Inside a QUOTED attribute selector only quotes/backslashes need
   escaping — used as the fallback where CSS.escape is missing (jsdom). */
function escapeAttr(s: string): string {
  return typeof CSS !== 'undefined' && CSS.escape
    ? CSS.escape(s)
    : s.replace(/["\\]/g, '\\$&');
}

/* Decimals of a numeric step ("0.01" → 2); null when the step carries no
   precision information ("any", missing) — grill H1: treating those as 0
   collapsed 7.50 to 8. */
function stepDecimals(input: Element): number | null {
  const step = input instanceof HTMLInputElement ? input.step : '';
  if (step === '' || step === 'any' || Number.isNaN(Number(step))) return null;
  return (step.split('.')[1] ?? '').length;
}

function valueDecimals(value: string): number {
  return (value.split('.')[1] ?? '').length;
}

function isSummable(el: HTMLInputElement): boolean {
  // grill find: a checkbox/radio sharing the summed name contributed its
  // value attr whether checked or not.
  return !(el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio'));
}

function recompute(table: HTMLElement): void {
  for (const out of table.querySelectorAll<HTMLElement>('[data-sum-of]')) {
    const field = out.dataset.sumOf;
    if (!field) continue;
    let decimals = 0;
    let sum = 0;
    for (const el of table.querySelectorAll<HTMLInputElement>(
      `tbody [name="${escapeAttr(field)}"]`,
    )) {
      // grill H2: a nested table's same-named fields double-counted into
      // the outer total — only THIS table's own rows participate.
      if (el.closest('table') !== table) continue;
      if (!isSummable(el)) continue;
      sum += Number(el.value) || 0;
      // Widest known step decides; steps with no precision info ("any",
      // missing) fall back to the value's own decimal places.
      decimals = Math.max(decimals, stepDecimals(el) ?? valueDecimals(el.value));
    }
    const override = out.dataset.decimals;
    if (override !== undefined && !Number.isNaN(Number(override)))
      decimals = Math.max(0, Math.trunc(Number(override)));
    out.textContent = sum.toFixed(Math.min(decimals, 6));
  }
}

export function initTableSum(): void {
  if (installed) return;
  installed = true;

  for (const type of ['input', 'change'] as const) {
    document.addEventListener(type, (e) => {
      const table = (e.target as Element | null)?.closest<HTMLElement>('table');
      if (table && table.querySelector('[data-sum-of]')) recompute(table);
    });
  }
}
