/**
 * Increment/decrement buttons for .bo-quantity — document-level
 * delegation, call initQuantity() once. The input itself is a real
 * type="number" (keyboard ArrowUp/Down and typing already work without
 * this); the buttons are an additional, clamped way to change it. Button
 * disabled state at the min/max boundary is kept in sync reactively (on
 * click and on input) — render the correct initial `disabled` server-side
 * if the starting value is already at a boundary.
 *
 * Markup contract:
 *   <div class="bo-quantity">
 *     <button class="bo-quantity__step" type="button" tabindex="-1" data-quantity-step="-1">−</button>
 *     <input class="bo-quantity__input" type="number" min max step />
 *     <button class="bo-quantity__step" type="button" tabindex="-1" data-quantity-step="1">+</button>
 *   </div>
 */
import { setInputDecimals, decimalsOverride, stepDecimals, valueDecimals } from '../utils/decimal-input.js';
import { numericInputValue, isGrouped, setGroupedValue, setGroupedDecimals } from './grouped-number.js';

let installed = false;

/* Embedded unit→default-decimals table (Slice 18, user's explicit call:
   built-in but overridable — the same deliberate exception as the money
   field's currency table). Unlike ISO 4217 there is NO closed list of
   units, so this is a pragmatic common-ERP set, case-insensitive, and an
   app's `step`/`data-decimals` always wins. Units not listed return
   undefined and the field's precision is left ENTIRELY alone (Slice 19
   grill fix — real master-data UOM codes are almost never these exact
   strings, so unknown is the normal case; the old `?? 0` default
   silently rewrote fractional quantities). */
const UNIT_DECIMALS: Record<string, number> = {
  // whole counts
  ea: 0, each: 0, pc: 0, pcs: 0, unit: 0, item: 0,
  box: 0, carton: 0, pallet: 0, min: 0,
  // weight
  kg: 2, g: 2, mg: 3, t: 2, lb: 2, oz: 2,
  // volume
  l: 2, ml: 2, gal: 2,
  // length / area / cubic
  m: 2, cm: 2, mm: 2, ft: 2, in: 2, 'm2': 2, 'm3': 2, 'm²': 2, 'm³': 2,
  // time (labor/machine)
  hr: 2, hrs: 2, h: 2,
};

export function unitDecimals(unit: string): number | undefined {
  return UNIT_DECIMALS[unit.trim().toLowerCase()];
}

function syncButtons(root: Element): void {
  const input = root.querySelector<HTMLInputElement>('.bo-quantity__input');
  if (!input) return;
  // Grouped-aware read (123.1): a data-grouped input's visible value is
  // the display string; the machine value lives behind numericInputValue.
  const value = numericInputValue(input) ?? 0;
  const min = input.min !== '' ? Number(input.min) : -Infinity;
  const max = input.max !== '' ? Number(input.max) : Infinity;
  root.querySelectorAll<HTMLButtonElement>('[data-quantity-step]').forEach((btn) => {
    const step = Number(btn.dataset.quantityStep) || 1;
    btn.disabled = step < 0 ? value <= min : value >= max;
  });
}

export function initQuantity(): void {
  if (installed) return;
  installed = true;

  document.addEventListener('click', (e) => {
    const btn = (e.target as Element | null)?.closest<HTMLElement>('[data-quantity-step]');
    if (!btn) return;
    const root = btn.closest('.bo-quantity');
    const input = root?.querySelector<HTMLInputElement>('.bo-quantity__input');
    if (!root || !input || input.disabled) return;

    const step = Number(btn.dataset.quantityStep) || 1;
    const inputStep = Number(input.step) || 1;
    const min = input.min !== '' ? Number(input.min) : -Infinity;
    const max = input.max !== '' ? Number(input.max) : Infinity;
    const current = numericInputValue(input) ?? 0;
    // Quantize to the step's own decimal places — binary floats make
    // 0.28 + 0.01 print as 0.29000000000000004 otherwise (the docs
    // recommend step="0.01" for weight/volume, so this path is real).
    // Shared hardened parse: step="any"/missing has no precision info,
    // so fall back to the value's own places instead of quantizing a
    // fractional value to an integer (2026-08-21 sweep).
    const decimals = stepDecimals(input) ?? valueDecimals(input.value);
    const raw = Math.min(max, Math.max(min, current + step * inputStep));
    const next = Number(raw.toFixed(decimals));

    if (next !== current) {
      if (isGrouped(input)) setGroupedValue(input, String(next));
      else input.value = String(next);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
    syncButtons(root);
  });

  document.addEventListener('input', (e) => {
    const input = (e.target as Element | null)?.closest<HTMLElement>('.bo-quantity__input');
    const root = input?.closest('.bo-quantity');
    if (root) syncButtons(root);
  });

  // Interactive unit select (`select.bo-quantity__unit-select`): changing
  // unit re-derives the input's step/decimals from the embedded table
  // (data-decimals override wins — same contract as .bo-money__currency).
  document.addEventListener('change', (e) => {
    const select = (e.target as Element | null)?.closest<HTMLSelectElement>(
      '.bo-quantity__unit-select',
    );
    if (!select) return;
    const root = select.closest<HTMLElement>('.bo-quantity');
    const input = root?.querySelector<HTMLInputElement>('.bo-quantity__input');
    if (!root || !input) return;
    const decimals = decimalsOverride(select, root) ?? unitDecimals(select.value);
    if (decimals === undefined) return; // unknown unit: no opinion, leave the field alone
    if (isGrouped(input)) setGroupedDecimals(input, decimals);
    else setInputDecimals(input, decimals);
    syncButtons(root);
  });
}
