/**
 * Dismiss behavior for alerts and toasts: any .eof-alert__dismiss button
 * removes its enclosing .eof-alert. Document-level delegation — call
 * initAlerts() once; injected toasts are covered automatically.
 */
let installed = false;

export function initAlerts(): void {
  if (installed) return;
  installed = true;
  document.addEventListener('click', (e) => {
    const btn = (e.target as Element | null)?.closest('.eof-alert__dismiss');
    if (!btn) return;
    btn.closest('.eof-alert')?.remove();
  });
}
