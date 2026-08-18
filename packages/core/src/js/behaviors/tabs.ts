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

/**
 * @keymap initTabs
 * @key ArrowRight / ArrowLeft — move to the next/previous tab, wrapping; activates immediately
 * @key Home / End — jump to the first/last tab; activates immediately
 */
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

/**
 * Mark which edges a tab strip can still scroll toward, so the CSS can fade
 * exactly those and no others.
 *
 * This exists because the strip had NO overflow affordance on macOS: overlay
 * scrollbars stay hidden until something moves, and neither `scrollbar-color`
 * nor the `::-webkit-scrollbar` pseudo-elements change that — measured, three
 * rounds, offsetHeight - clientHeight stayed 1px every time (roadmap 30.1).
 *
 * A ResizeObserver rather than a media query: the strip overflows by its own
 * CONTAINER width, not the viewport's, so a shell that narrows around it must
 * re-evaluate even when the viewport never changes.
 */
function markOverflow(list: HTMLElement): void {
  const max = list.scrollWidth - list.clientWidth;
  // 1px of slack: fractional layout leaves sub-pixel scrollLeft at the ends,
  // which would otherwise fade an edge the user has already reached.
  const atStart = list.scrollLeft <= 1;
  const atEnd = list.scrollLeft >= max - 1;
  if (max <= 1) list.removeAttribute('data-overflow');
  else if (atStart) list.dataset.overflow = 'end';
  else if (atEnd) list.dataset.overflow = 'start';
  else list.dataset.overflow = 'both';
}

function watchOverflow(list: HTMLElement): void {
  if (list.dataset.boOverflowWatched) return;
  list.dataset.boOverflowWatched = '1';
  markOverflow(list);
  list.addEventListener('scroll', () => markOverflow(list), { passive: true });
  /* Guarded, not polyfilled: the fade is progressive enhancement, and
     `initTabs()` must not throw where ResizeObserver does not exist — which is
     every consumer's jsdom test suite, not just ours. CI caught this as
     "ResizeObserver is not defined" in the behavior tests; without the guard,
     anyone unit-testing a page that calls initTabs() would inherit the crash. */
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(() => markOverflow(list)).observe(list);
  }
}

export function initTabs(): void {
  if (installed) return;
  installed = true;

  document.querySelectorAll<HTMLElement>('.bo-tabs__list').forEach(watchOverflow);
  /* Strips swapped in later (htmx, or any other mechanism) get watched on the
     first interaction that reaches them — same delegation model as the rest of
     this behavior, so there is nothing to re-initialise. */
  document.addEventListener('htmx:afterSwap', () => {
    document.querySelectorAll<HTMLElement>('.bo-tabs__list').forEach(watchOverflow);
  });

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
