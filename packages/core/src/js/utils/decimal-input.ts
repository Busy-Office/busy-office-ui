/**
 * Shared by money-field (currency → decimals) and quantity (unit →
 * decimals): set a number input's step to the given precision and
 * reformat its current value — LOSSLESSLY ONLY (Slice 19 grill fix, all
 * three technical seats independently): padding zeros (1250 → 1250.00)
 * or trimming them (1250.00 → 1250) applies; anything that would change
 * the numeric value (2.5 at 0 decimals, a JPY-priced 12.40) leaves the
 * value untouched — the step still updates, so a non-fitting value
 * surfaces through the native stepMismatch channel instead of being
 * silently rewritten. Values beyond MAX_SAFE_INTEGER (JPY/VND-scale)
 * are left entirely alone. A lossless reformat dispatches a real
 * bubbling `input` event so listeners (row-edit dirty tracking) see
 * the programmatic change — the combobox-commit lesson.
 */
export function setInputDecimals(input: HTMLInputElement, decimals: number): void {
  const d = Math.max(0, Math.trunc(decimals));
  input.step = d === 0 ? '1' : (10 ** -d).toFixed(d);
  if (input.value === '') return;
  const n = Number(input.value);
  if (!Number.isFinite(n) || Math.abs(n) > Number.MAX_SAFE_INTEGER) return;
  const next = n.toFixed(d);
  // NEVER lossy: apply only when numerically identical (pad/trim).
  if (Number(next) !== n || next === input.value) return;
  input.value = next;
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

/** App override beats any built-in table: data-decimals on the selected
 *  <option>, else on the container. Returns undefined when not supplied. */
export function decimalsOverride(select: HTMLSelectElement, root: HTMLElement): number | undefined {
  const raw = select.selectedOptions[0]?.dataset.decimals ?? root.dataset.decimals;
  if (raw === undefined || raw === '' || Number.isNaN(Number(raw))) return undefined;
  return Math.max(0, Math.trunc(Number(raw)));
}
