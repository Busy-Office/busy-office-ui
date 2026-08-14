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
 *   <input class="bo-input bo-input--code" data-scan-input autofocus />
 *   document.addEventListener('bo:scan', (e) => e.detail.value)
 */
let installed = false;

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
    input.dispatchEvent(new CustomEvent('bo:scan', { bubbles: true, detail: { value } }));
    input.focus();
  });

  document.querySelectorAll<HTMLInputElement>('[data-scan-input][autofocus]').forEach((el) => el.focus());
}
