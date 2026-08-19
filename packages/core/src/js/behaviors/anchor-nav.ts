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
  const line = nav.getBoundingClientRect().bottom + 1;
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
