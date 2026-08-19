/**
 * Anchor navigation for long detail screens (the "object page" floorplan).
 * Marks whichever section the reader is currently in with aria-current="page"
 * on its link — the same signal .bo-sidebar-nav and .bo-pagination already
 * style, so this behavior ships no CSS of its own.
 *
 * Markup contract:
 *   <nav data-anchor-nav>
 *     <a href="#general" aria-current="page">General</a>
 *     <a href="#items">Line items</a>
 *   </nav>
 *   <section id="general">…</section>
 *   <section id="items">…</section>
 *
 * WHY IT MEASURES INSTEAD OF USING IntersectionObserver. The obvious version
 * observes each section with a rootMargin like '-30% 0px -60% 0px'. That was
 * built and rejected on evidence (roadmap 48.3): at 1440 it was correct, at
 * 390 it marked the WRONG section after a jump, and at every width it left
 * NOTHING current on load. Those margins are a guess about viewport shape, and
 * an object page's sticky chrome changes height with the viewport.
 *
 * The rule here has no such guess: the current section is the last one whose
 * top has passed below the nav's own bottom edge. That edge is measured, so it
 * follows the chrome automatically at any width.
 */
let installed = false;

function syncOne(nav: HTMLElement): void {
  const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
  if (!links.length) return;
  /* +TOLERANCE, not +1. A hash jump lands the section at `scroll-margin` below
     the scrollport top, and that lands within a few pixels of the nav's bottom
     edge rather than exactly on it — measured at 1440 the clicked section came
     to rest 2px BELOW the line, so the spy marked the section ABOVE the one the
     reader had just clicked. The tolerance is small next to any real section,
     so it cannot make the next section current early. */
  const line = nav.getBoundingClientRect().bottom + SPY_TOLERANCE;
  let active = links[0].getAttribute('href');
  for (const link of links) {
    const id = link.getAttribute('href')?.slice(1);
    const section = id ? document.getElementById(id) : null;
    if (section && section.getBoundingClientRect().top <= line) {
      active = link.getAttribute('href');
    }
  }
  for (const link of links) {
    if (link.getAttribute('href') === active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
  syncCollapse(nav);
}

/* Scroll-collapse, opt-in via [data-anchor-collapse] on the element to collapse
   (it must share a parent with the nav). No CSS ships for this: the target is a
   `.bo-widget__collapse`, whose grid-template-rows transition already runs on
   --bo-motion-duration-slow and therefore zeroes under prefers-reduced-motion.

   THE DECISION IS MADE ON SCROLL OFFSET, NOT ON GEOMETRY, and that is the whole
   design. The first version compared the nav's bottom edge against the first
   section's top — both of which the collapse itself MOVES, by about 111px. So
   collapsing changed the input that caused it: the reader parked at the
   boundary and the header flipped closed/open/closed forever. A 40px dead band
   could not save it, because the feedback is three times larger than the band.

   Scroll offset is the input, not the output: collapsing does not change it.
   Hysteresis on top of that is a genuine dead band rather than a race. */
/* +TOLERANCE on the spy line, not +1: a hash jump lands the section a few
   pixels off the nav's bottom edge, and at 1440 the clicked section came to
   rest 2px BELOW it, so the spy marked the section ABOVE the one just clicked. */
const SPY_TOLERANCE = 12;
const COLLAPSE_PAST = 120;
const EXPAND_UNDER = 56;

function scrollerFor(el: Element): Element {
  let node: Element | null = el.parentElement;
  while (node) {
    const cs = getComputedStyle(node);
    if (node.scrollHeight > node.clientHeight + 40 && /auto|scroll/.test(cs.overflowY)) return node;
    node = node.parentElement;
  }
  return document.scrollingElement ?? document.documentElement;
}

function syncCollapse(nav: HTMLElement): void {
  const target = nav.parentElement?.querySelector<HTMLElement>('[data-anchor-collapse]');
  if (!target) return;
  const top = scrollerFor(nav).scrollTop;
  if (top > COLLAPSE_PAST) target.dataset.state = 'closed';
  else if (top < EXPAND_UNDER) target.dataset.state = 'open';
}

function syncAll(): void {
  for (const nav of document.querySelectorAll<HTMLElement>('[data-anchor-nav]')) {
    syncOne(nav);
  }
}

export function initAnchorNav(): void {
  if (installed) return;
  installed = true;
  syncAll();
  /* CAPTURE, not a named container. The first version listened on
     `.bo-app-shell__main` plus the window, which is the shell this framework
     ships — and therefore silently stopped updating for an object page that
     scrolls inside anything else (a dialog, an offcanvas, a consumer's own
     layout). `initDropdowns` had already solved the same problem the general
     way in 0.2.0: scroll does not bubble, but it DOES reach a capture-phase
     listener on document from any scrolling ancestor. This behavior was the
     only one in the package that knew a shell class name (Standardize sweep,
     2026-08-19). */
  document.addEventListener('scroll', syncAll, true);
  window.addEventListener('resize', syncAll, { passive: true });
}
