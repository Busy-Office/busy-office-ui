/**
 * Dismiss behavior for alerts and toasts: any .bo-alert__dismiss button
 * removes its enclosing .bo-alert. Document-level delegation — call
 * initAlerts() once; injected toasts are covered automatically.
 *
 * A .bo-toast leaves through the exit animation alert.css declares (roadmap
 * 200.5); every other .bo-alert is removed synchronously, exactly as before.
 * An inline alert sits in the document flow, so animating it out would move
 * the page under the reader's cursor — the toast region is fixed, which is
 * what makes a collapse there free.
 *
 * The hold is a TIMER read from the animation's own computed duration, never
 * `animationend`: dialog's exit (200.1) states the reason, that a dismissal
 * gated on an event which can fail to arrive is a toast that never leaves.
 * Reading the duration back off the computed style rather than hard-coding it
 * is what keeps the two in step — change the token or the rule and the timer
 * follows.
 *
 * When that duration is 0 the removal is SYNCHRONOUS, which covers two cases
 * with one branch: prefers-reduced-motion (tokens/motion.css zeroes the
 * duration tokens) and a consumer who loaded the JS without the CSS. Neither
 * gains a frame of delay, and the dismiss contract stays synchronous wherever
 * there is no animation to wait for.
 *
 * @serves alert
 */
let installed = false;

/**
 * Longest entry of a computed `animation-duration` list, in ms. A list
 * because the property is comma-separated per animation, and a consumer may
 * have added one of their own; the toast may not be removed before the last
 * of them has run. Anything unparseable — jsdom returns '' — reads as 0,
 * which is the synchronous path.
 */
function longestDurationMs(value: string): number {
  let max = 0;
  for (const part of value.split(',')) {
    const raw = part.trim();
    const n = Number.parseFloat(raw);
    if (!Number.isFinite(n)) continue;
    const ms = raw.endsWith('ms') ? n : n * 1000;
    if (ms > max) max = ms;
  }
  return max;
}

function dismiss(alert: HTMLElement): void {
  if (!alert.classList.contains('bo-toast')) {
    alert.remove();
    return;
  }
  if (alert.dataset.state === 'closing') return;
  // Measured BEFORE the state is set: block-size interpolates only from a
  // definite length, and that collapse is what bounds the stack's shift.
  alert.style.blockSize = `${alert.getBoundingClientRect().height}px`;
  alert.dataset.state = 'closing';
  const ms = longestDurationMs(getComputedStyle(alert).animationDuration);
  if (ms <= 0) {
    alert.remove();
    return;
  }
  setTimeout(() => alert.remove(), ms);
}

export function initAlerts(): void {
  if (installed) return;
  installed = true;
  document.addEventListener('click', (e) => {
    const btn = (e.target as Element | null)?.closest('.bo-alert__dismiss');
    if (!btn) return;
    const alert = btn.closest<HTMLElement>('.bo-alert');
    if (alert) dismiss(alert);
  });
}
