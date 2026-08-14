/**
 * Collapsible card sections (.bo-widget). Click a [data-collapse-trigger]
 * button — toggles its own aria-expanded and the data-state on the element
 * its aria-controls points at. CSS (.bo-widget__collapse) does the actual
 * grid-template-rows 0fr/1fr transition; this behavior only flips state.
 *
 * Markup contract:
 *   <button data-collapse-trigger aria-expanded="true" aria-controls="ID">…</button>
 *   <div class="bo-widget__collapse" id="ID" data-state="open">…</div>
 */
let installed = false;

export function initCollapsibleCards(): void {
  if (installed) return;
  installed = true;

  document.addEventListener('click', (e) => {
    const trigger = (e.target as Element | null)?.closest<HTMLElement>(
      '[data-collapse-trigger]',
    );
    if (!trigger) return;
    const targetId = trigger.getAttribute('aria-controls');
    const target = targetId ? document.getElementById(targetId) : null;
    if (!target) return;
    const wasOpen = trigger.getAttribute('aria-expanded') !== 'false';
    trigger.setAttribute('aria-expanded', String(!wasOpen));
    target.dataset.state = wasOpen ? 'closed' : 'open';
  });
}
