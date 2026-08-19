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
  /* The app shell scrolls its own main region, not the window, so listen on
     both — the same split initSavedViews and the dropdown re-anchoring hit. */
  const main = document.querySelector('.bo-app-shell__main');
  main?.addEventListener('scroll', syncAll, { passive: true });
  window.addEventListener('scroll', syncAll, { passive: true });
  window.addEventListener('resize', syncAll, { passive: true });
}
