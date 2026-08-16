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
 */
let installed = false;

/* Inside a QUOTED attribute selector only quotes/backslashes need
   escaping — used as the fallback where CSS.escape is missing (jsdom). */
function escapeAttr(s: string): string {
  return typeof CSS !== 'undefined' && CSS.escape
    ? CSS.escape(s)
    : s.replace(/["\\]/g, '\\$&');
}

function decimalsOf(input: Element): number {
  const step = input instanceof HTMLInputElement ? input.step : '';
  return (step.split('.')[1] ?? '').length;
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
      sum += Number(el.value) || 0;
      decimals = Math.max(decimals, decimalsOf(el));
    }
    const override = out.dataset.decimals;
    if (override !== undefined && !Number.isNaN(Number(override)))
      decimals = Math.max(0, Math.trunc(Number(override)));
    out.textContent = sum.toFixed(decimals);
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
