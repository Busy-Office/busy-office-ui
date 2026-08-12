const FOCUSABLE =
  'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

function isVisible(el: HTMLElement): boolean {
  if (typeof el.checkVisibility === 'function') return el.checkVisibility();
  // Fallback: offsetParent is null for display:none subtrees (and for
  // position:fixed elements, which are rare inside dialogs).
  return el.offsetParent !== null;
}

/**
 * Loop Tab / Shift+Tab within a container. Native <dialog> restores focus on
 * close but does not loop Tab at the edges — this fills that gap. Hidden
 * elements ([hidden], display:none panels) are excluded so the wrap targets
 * are always actually focusable.
 */
export function trapFocus(e: KeyboardEvent): void {
  if (e.key !== 'Tab') return;
  const container = e.currentTarget as HTMLElement;
  const focusable = Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE),
  ).filter(isVisible);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}
