/**
 * Shared by money-field (currency → decimals) and quantity (unit →
 * decimals): set a number input's step to the given precision and
 * reformat its current value to match. Reformatting dispatches a real
 * bubbling `input` event so listeners (row-edit dirty tracking) see the
 * programmatic change — the combobox-commit lesson.
 */
export function setInputDecimals(input: HTMLInputElement, decimals: number): void {
  const d = Math.max(0, Math.trunc(decimals));
  input.step = d === 0 ? '1' : (10 ** -d).toFixed(d);
  if (input.value === '') return;
  const n = Number(input.value);
  if (Number.isNaN(n)) return;
  const next = n.toFixed(d);
  if (next !== input.value) {
    input.value = next;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

/** App override beats any built-in table: data-decimals on the selected
 *  <option>, else on the container. Returns undefined when not supplied. */
export function decimalsOverride(select: HTMLSelectElement, root: HTMLElement): number | undefined {
  const raw = select.selectedOptions[0]?.dataset.decimals ?? root.dataset.decimals;
  if (raw === undefined || raw === '' || Number.isNaN(Number(raw))) return undefined;
  return Math.max(0, Math.trunc(Number(raw)));
}
