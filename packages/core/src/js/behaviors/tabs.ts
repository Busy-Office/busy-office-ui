/**
 * ARIA tabs behavior via document-level delegation — call initTabs() once.
 * Roving tabindex, Home/End plus the arrow keys of whichever axis the strip is
 * laid out on, automatic activation.
 *
 * Markup contract:
 *   .bo-tabs > .bo-tabs__list[role=tablist] > .bo-tabs__tab[role=tab]
 *   panels: [role=tabpanel][id] referenced by each tab's aria-controls;
 *   inactive panels carry [hidden].
 *
 * Add `.bo-tabs--vertical` for a left rail. Nothing else changes: the behavior
 * reads the rendered direction, sets `aria-orientation` itself, and swaps the
 * arrow keys and the fade axis to match — including when a narrow container
 * collapses the rail back into a horizontal strip.
 *
 * @serves tabs
 */
let installed = false;

/**
 * @keymap initTabs
 * @key ArrowRight / ArrowLeft — move to the next/previous tab in a horizontal strip, wrapping; activates immediately
 * @key ArrowDown / ArrowUp — the same, in a vertical rail (`.bo-tabs--vertical`)
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
 * Is this strip laid out as a column right now?
 *
 * Read from the RENDERED flex-direction rather than from the `--vertical`
 * class, and that difference is the whole point: `.bo-tabs--vertical` collapses
 * back to a row in a narrow container, where a left rail has nowhere to sit. A
 * class check would still call that vertical and leave a keyboard user pressing
 * Up/Down on a horizontal strip. The computed style is what the user is
 * actually looking at, so orientation, the arrow keys and the fade axis all
 * follow the collapse for free.
 */
function isVertical(list: HTMLElement): boolean {
  return getComputedStyle(list).flexDirection.startsWith('column');
}

/**
 * Mark which edges a tab strip can still scroll toward, so the CSS can fade
 * exactly those and no others — and keep `aria-orientation` in step with the
 * axis it is scrolling on.
 *
 * This exists because the strip had NO overflow affordance on macOS: overlay
 * scrollbars stay hidden until something moves, and neither `scrollbar-color`
 * nor the `::-webkit-scrollbar` pseudo-elements change that — measured, three
 * rounds, offsetHeight - clientHeight stayed 1px every time (roadmap 30.1).
 *
 * A ResizeObserver rather than a media query: the strip overflows by its own
 * CONTAINER width, not the viewport's, so a shell that narrows around it must
 * re-evaluate even when the viewport never changes. That observer is also what
 * makes the vertical rail's collapse work — the same callback re-reads the
 * direction, so orientation follows the container query with nothing extra.
 */
function markOverflow(list: HTMLElement): void {
  const vertical = isVertical(list);
  /* `aria-orientation` is set here, not asked of the consumer. It has to agree
     with the layout at all times, and the layout changes on container width —
     no consumer can keep an attribute in sync with a container query. */
  list.setAttribute('aria-orientation', vertical ? 'vertical' : 'horizontal');

  const max = vertical
    ? list.scrollHeight - list.clientHeight
    : list.scrollWidth - list.clientWidth;
  const pos = vertical ? list.scrollTop : list.scrollLeft;
  // 1px of slack: fractional layout leaves sub-pixel scroll offsets at the
  // ends, which would otherwise fade an edge the user has already reached.
  const atStart = pos <= 1;
  const atEnd = pos >= max - 1;
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
  document.addEventListener('htmx:after:swap', () => {
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
    /* Which arrows drive this strip depends on which way it is pointing. The
       APG requires Up/Down for a vertical tablist, and a rail that only answers
       Left/Right cannot be driven in the direction it visibly runs. Vertical is
       read from the rendered layout, so a `--vertical` set that has collapsed
       to a row in a narrow container goes back to Left/Right by itself. */
    const vertical = isVertical(list as HTMLElement);
    const prevKey = vertical ? 'ArrowUp' : 'ArrowLeft';
    const nextKey = vertical ? 'ArrowDown' : 'ArrowRight';
    // Direction-aware: in RTL, ArrowRight moves to the previous (visually
    // right) tab so spatial arrows match the visual order. Block-axis arrows
    // are unaffected — RTL mirrors the inline axis only.
    const rtl = !vertical && getComputedStyle(list).direction === 'rtl';
    const forward = rtl ? -1 : 1;
    let next: HTMLElement | undefined;
    if (e.key === nextKey) next = tabs[(i + forward + tabs.length) % tabs.length];
    else if (e.key === prevKey) next = tabs[(i - forward + tabs.length) % tabs.length];
    else if (e.key === 'Home') next = tabs[0];
    else if (e.key === 'End') next = tabs[tabs.length - 1];
    if (next) {
      e.preventDefault();
      activate(next);
    }
  });
}
