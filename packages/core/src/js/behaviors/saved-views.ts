/**
 * Saved-view / filter-bar persistence. Views are just links (server-
 * rendered — see the filters docs page), so this behavior doesn't invent a
 * storage backend; it only keeps the UI in sync with whichever view is
 * active, which was previously hardcoded/static:
 *   1. Populates a .bo-filter-bar's fields FROM the current URL
 *      querystring, so following a saved-view link shows the matching
 *      filters in the form, not just in the results.
 *   2. Marks whichever [data-saved-views] link's querystring matches the
 *      current URL as aria-current="page" (and clears it from the others)
 *      — the chip's active-state channel, derived instead of hand-set.
 *
 * Markup contract:
 *   <form class="bo-filter-bar">…named fields…</form>
 *   <nav data-saved-views><a href="?status=pending">…</a>…</nav>
 */
export function initSavedViews(root: ParentNode = document): void {
  const params = new URLSearchParams(location.search);

  root.querySelectorAll<HTMLFormElement>('.bo-filter-bar').forEach((form) => {
    for (const el of Array.from(form.elements)) {
      if (!(el instanceof HTMLInputElement || el instanceof HTMLSelectElement)) continue;
      if (!el.name || !params.has(el.name)) continue;
      el.value = params.get(el.name)!;
    }
  });

  root.querySelectorAll<HTMLAnchorElement>('[data-saved-views] a').forEach((a) => {
    const url = new URL(a.getAttribute('href') || '', location.href);
    const active = url.pathname === location.pathname && url.search === location.search;
    if (active) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}
