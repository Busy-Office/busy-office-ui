/**
 * RF/handheld barcode-scanner input. A scanner acts as a keyboard wedge: it
 * "types" the barcode fast, then sends a terminator key (Enter by default,
 * configurable via data-scan-terminator — some scanners send Tab instead).
 * On the terminator: dispatch a bo:scan CustomEvent with the value, clear
 * the field, and refocus it so the next scan is immediate. This refocus
 * happens only POST-terminator (the user's own action), never on blur — a
 * blur-triggered auto-refocus would trap keyboard/AT focus and is
 * deliberately not done here.
 *
 * Markup contract:
 *   <input class="bo-input bo-input--code" data-scan-input autofocus
 *       aria-describedby="scan-status" />
 *   <p id="scan-status" data-scan-status aria-live="polite" class="bo-visually-hidden"></p>
 *   document.addEventListener('bo:scan', (e) => e.detail.value)
 *
 * The status paragraph is optional — link it via the input's own
 * aria-describedby (the same pattern already used for field hints/errors
 * elsewhere) and initScanInput() announces each scan there, so a
 * screen-reader/low-vision RF user gets non-visual confirmation a scan
 * registered. Without it, behavior is unchanged from before this existed.
 *
 * Scan-result flash (126.2, opt-in): add `data-scan-flash` to the input
 * and every capture stamps `data-scan-result="ok"` on <body> for ~700ms —
 * scan.css paints the viewport wash a rack-watching user sees in
 * peripheral vision. Capture is not validity: when YOUR validation
 * rejects a scan, call `flashScanResult('error', 'why')` — the error wash
 * plus the same live region, two channels either way. The framework never
 * decides validity (it cannot); it only paints the moment.
 *
 * @serves scan
 */
let installed = false;
let flashTimer: ReturnType<typeof setTimeout> | undefined;

/**
 * Paint the scan-result flash and (optionally) announce a message through
 * the page's [data-scan-status] live region. Exported for the consumer's
 * validation path — the behavior itself only ever stamps 'ok', because a
 * terminator proves CAPTURE, never validity.
 */
export function flashScanResult(kind: 'ok' | 'error', message?: string): void {
  document.body.dataset.scanResult = kind;
  clearTimeout(flashTimer);
  // Timer, not animationend: reduced-motion swaps the animation for a
  // static wash (scan.css), and a listener that never fires would leave
  // the stamp on forever.
  flashTimer = setTimeout(() => { delete document.body.dataset.scanResult; }, 700);
  if (message) {
    const status = document.querySelector('[data-scan-status]');
    if (status) status.textContent = message;
  }
}

function announceScan(input: HTMLInputElement, value: string): void {
  // aria-describedby is a space-separated ID LIST (WAI-ARIA 6.6.1) — a
  // field routinely carries a hint/error ID alongside the status ID.
  const status = (input.getAttribute('aria-describedby') ?? '')
    .split(/\s+/)
    .map((id) => document.getElementById(id))
    .find((el) => el?.hasAttribute('data-scan-status'));
  if (!status) return;
  status.textContent = `Scanned ${value}`;
}

export function initScanInput(): void {
  if (installed) return;
  installed = true;

  document.addEventListener('keydown', (e) => {
    const input = (e.target as Element | null)?.closest<HTMLInputElement>('[data-scan-input]');
    if (!input) return;
    const terminator = input.dataset.scanTerminator || 'Enter';
    if (e.key !== terminator) return;
    if (!input.value) return;
    e.preventDefault();
    const value = input.value;
    input.value = '';
    /**
     * @event bo:scan
     * @target the `[data-scan-input]` field (bubbles)
     * @when the terminator key arrives (default Enter, `data-scan-terminator`
     *   to override); the field is cleared and refocused for the next scan
     * @detail value {string} the scanned string, exactly as entered
     */
    /* Capture signals FIRST, then dispatch: a consumer's bo:scan handler
       is where validation lives, and its flashScanResult('error', why)
       verdict must land LAST so it wins the stamp and the live region.
       The first ordering announced "Scanned REJECT…" over the consumer's
       rejection — caught by the claims case, not by review. */
    announceScan(input, value);
    if (input.hasAttribute('data-scan-flash')) flashScanResult('ok');
    input.dispatchEvent(new CustomEvent('bo:scan', { bubbles: true, detail: { value } }));
    input.focus();
  });

  document.querySelectorAll<HTMLInputElement>('[data-scan-input][autofocus]').forEach((el) => el.focus());
}
