/**
 * Currency-aware money field — a currency <select> linked to an amount
 * input: changing currency updates the input's `step` (decimal precision)
 * and reformats the current value to that precision. Document-level
 * delegation, call initMoneyField() once.
 *
 * Decimal source, in priority order:
 *   1. `data-decimals` on the selected <option> (app-supplied override)
 *   2. `data-decimals` on the .bo-money container   (app-supplied override)
 *   3. the embedded ISO 4217 minor-units table below (default 2)
 *
 * The embedded table is a DELIBERATE, NAMED exception to the "framework
 * does visuals, you do the data" split (Slice 18 triage, user's explicit
 * call: built-in but overridable). It stays tiny by storing only the
 * exceptions — every ISO 4217 currency not listed uses 2 decimals.
 *
 * Markup contract:
 *   <div class="bo-money">
 *     <select class="bo-select bo-money__currency" aria-label="Currency">
 *       <option>USD</option> <option>JPY</option> …
 *     </select>
 *     <input class="bo-input bo-input--numeric bo-money__amount"
 *            type="number" step="0.01" aria-label="Amount" />
 *   </div>
 */
import { setInputDecimals, decimalsOverride } from '../utils/decimal-input.js';

let installed = false;

/* ISO 4217 minor-units exceptions (current amendments). Everything not
   listed here — USD, EUR, GBP, SGD, THB, … — is 2. */
const ZERO_DECIMAL = new Set([
  'BIF', 'CLP', 'DJF', 'GNF', 'ISK', 'JPY', 'KMF', 'KRW', 'PYG',
  'RWF', 'UGX', 'UYI', 'VND', 'VUV', 'XAF', 'XOF', 'XPF',
]);
const THREE_DECIMAL = new Set(['BHD', 'IQD', 'JOD', 'KWD', 'LYD', 'OMR', 'TND']);
const FOUR_DECIMAL = new Set(['CLF', 'UYW']);

export function currencyDecimals(code: string): number {
  const c = code.trim().toUpperCase();
  if (ZERO_DECIMAL.has(c)) return 0;
  if (THREE_DECIMAL.has(c)) return 3;
  if (FOUR_DECIMAL.has(c)) return 4;
  return 2;
}

export function initMoneyField(): void {
  if (installed) return;
  installed = true;

  document.addEventListener('change', (e) => {
    const select = (e.target as Element | null)?.closest<HTMLSelectElement>('.bo-money__currency');
    if (!select) return;
    const root = select.closest<HTMLElement>('.bo-money');
    const amount = root?.querySelector<HTMLInputElement>('.bo-money__amount');
    if (!root || !amount) return;
    setInputDecimals(amount, decimalsOverride(select, root) ?? currencyDecimals(select.value));
  });
}
