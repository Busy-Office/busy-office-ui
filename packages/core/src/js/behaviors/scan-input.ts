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
 */
let installed = false;

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
    input.dispatchEvent(new CustomEvent('bo:scan', { bubbles: true, detail: { value } }));
    announceScan(input, value);
    input.focus();
  });

  document.querySelectorAll<HTMLInputElement>('[data-scan-input][autofocus]').forEach((el) => el.focus());
}
