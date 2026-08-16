// Shared click-to-copy feedback (Standardize 2026-08-16: was duplicated
// verbatim on /base/colors and /base/palettes). Contract: the page
// renders one `<div class="copy-toast" role="status" aria-live="polite">`
// and calls copyWithToast — success AND failure are reported, never a
// silent no-op, and a repeat copy of the same text re-announces (the
// clear-then-set forces a DOM mutation for the live region).
let timer: ReturnType<typeof setTimeout> | undefined;

export function showToast(msg: string): void {
  const toast = document.querySelector('.copy-toast');
  if (!toast) return;
  clearTimeout(timer);
  toast.textContent = '';
  requestAnimationFrame(() => {
    toast.textContent = msg;
  });
  timer = setTimeout(() => {
    toast.textContent = '';
  }, 2500);
}

export function copyWithToast(text: string, unavailableMsg: string): void {
  if (!navigator.clipboard) {
    showToast(unavailableMsg);
    return;
  }
  navigator.clipboard.writeText(text).then(
    () => showToast(`copied ${text}`),
    () => showToast('copy failed — your browser blocked clipboard access'),
  );
}
