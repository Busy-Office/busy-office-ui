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
 *     <button class="bo-quantity__step" type="button" data-quantity-step="-1">−</button>
 *     <input class="bo-quantity__input" type="number" min max step />
 *     <button class="bo-quantity__step" type="button" data-quantity-step="1">+</button>
 *   </div>
 */
let installed = false;

function syncButtons(root: Element): void {
  const input = root.querySelector<HTMLInputElement>('.bo-quantity__input');
  if (!input) return;
  const value = Number(input.value) || 0;
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
    const current = Number(input.value) || 0;
    const next = Math.min(max, Math.max(min, current + step * inputStep));

    if (next !== current) {
      input.value = String(next);
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
}
