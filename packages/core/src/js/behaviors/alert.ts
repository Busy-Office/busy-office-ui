/**
 * Dismiss behavior for alerts and toasts: any .bo-alert__dismiss button
 * removes its enclosing .bo-alert. Document-level delegation — call
 * initAlerts() once; injected toasts are covered automatically.
 */
let installed = false;

export function initAlerts(): void {
  if (installed) return;
  installed = true;
  document.addEventListener('click', (e) => {
    const btn = (e.target as Element | null)?.closest('.bo-alert__dismiss');
    if (!btn) return;
    btn.closest('.bo-alert')?.remove();
  });
}
