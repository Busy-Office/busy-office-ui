/**
 * ARIA tabs behavior via document-level delegation — call initTabs() once.
 * Roving tabindex, Left/Right/Home/End navigation, automatic activation.
 *
 * Markup contract:
 *   .bo-tabs > .bo-tabs__list[role=tablist] > .bo-tabs__tab[role=tab]
 *   panels: [role=tabpanel][id] referenced by each tab's aria-controls;
 *   inactive panels carry [hidden].
 */
let installed = false;

function activate(tab: HTMLElement): void {
  const list = tab.closest('[role="tablist"]');
  if (!list) return;
  list.querySelectorAll<HTMLElement>('[role="tab"]').forEach((t) => {
    const selected = t === tab;
    t.setAttribute('aria-selected', String(selected));
    t.tabIndex = selected ? 0 : -1;
    const panel = t.getAttribute('aria-controls');
    const el = panel ? document.getElementById(panel) : null;
    if (el) el.hidden = !selected;
  });
  tab.focus();
}

export function initTabs(): void {
  if (installed) return;
  installed = true;

  document.addEventListener('click', (e) => {
    const tab = (e.target as Element | null)?.closest<HTMLElement>(
      '.bo-tabs__tab[role="tab"]',
    );
    if (tab) activate(tab);
  });

  document.addEventListener('keydown', (e) => {
    const tab = (e.target as Element | null)?.closest<HTMLElement>(
      '.bo-tabs__tab[role="tab"]',
    );
    if (!tab) return;
    const list = tab.closest('[role="tablist"]');
    if (!list) return;
    const tabs = Array.from(list.querySelectorAll<HTMLElement>('[role="tab"]'));
    const i = tabs.indexOf(tab);
    // Direction-aware: in RTL, ArrowRight moves to the previous (visually
    // right) tab so spatial arrows match the visual order.
    const rtl = getComputedStyle(list).direction === 'rtl';
    const forward = rtl ? -1 : 1;
    let next: HTMLElement | undefined;
    if (e.key === 'ArrowRight') next = tabs[(i + forward + tabs.length) % tabs.length];
    else if (e.key === 'ArrowLeft') next = tabs[(i - forward + tabs.length) % tabs.length];
    else if (e.key === 'Home') next = tabs[0];
    else if (e.key === 'End') next = tabs[tabs.length - 1];
    if (next) {
      e.preventDefault();
      activate(next);
    }
  });
}
