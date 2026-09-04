/**
 * The redirect stubs, in ONE place, base-less.
 *
 * `astro.config.mjs` owned this map alone until Slice 261. That was fine while
 * the config was its only reader, and stopped being fine the moment a second
 * consumer needed it: `gen-patterns-index.mjs` has to resolve a pattern page's
 * "Components used" href before it can say which component that href names, and
 * a config-local `const` is reachable only by re-parsing the config with a
 * regex — the "two accounts of one list" shape `pattern-extract.mjs` and
 * `paths.mjs` both exist to prevent.
 *
 * WHY IT MATTERS RATHER THAN BEING TIDINESS: `/components/nav` is a live
 * redirect to `/components/sidebar-nav`, and two pattern pages
 * (`app-frame`, `suite-home`) cite the component by that old href. An
 * inversion that matches hrefs literally therefore reports `sidebar-nav` as
 * used by ZERO patterns, which is false — and a catalogue card built on it
 * would render "no pattern uses this" for a component two patterns do use.
 * Roadmap 249.9's badge audit recorded exactly that false zero (11 zero-reach
 * components; the redirect-aware count is 10).
 *
 * DESTINATIONS ARE BASE-LESS HERE. Astro prefixes only the stub's SOURCE path,
 * so a destination must carry the base itself in production (site-grill S-1:
 * base-blind destinations 404'd). `withBase()` applies it; keeping the raw map
 * base-less is what lets a build-time reader compare against the base-less
 * hrefs it finds in `.astro` source.
 */

export const REDIRECTS = {
  '/htmx': '/getting-started/htmx',
  '/theming': '/concepts/theming',
  '/printing': '/base/print',
  '/tokens': '/reference/tokens',
  '/base/tokens': '/reference/tokens',
  '/patterns/keyboard-help': '/reference/keyboard',
  // 109.2: shape-not-domain rename — the invoice was always sample data
  // on the generic list screen; the industry name is List Report.
  '/patterns/invoice-list': '/patterns/list-report',
  // 109.19: field-editor folded into detail-form's field-per-row variant
  // (109.4's verdict — thin anatomy, one distinction expressible as a
  // paragraph on an existing pattern rather than a standalone page).
  '/patterns/field-editor': '/patterns/detail-form',
  '/components/nav': '/components/sidebar-nav',
  '/primitives': '/base/primitives',
};

/** The map Astro's `redirects` option wants: sources base-less, destinations base-carrying. */
export const withBase = (base) =>
  Object.fromEntries(Object.entries(REDIRECTS).map(([from, to]) => [from, `${base}${to}`]));

/**
 * Resolve one in-repo href to the page it actually lands on: drop any `#anchor`
 * (a pattern cites `/components/dashboard#card`) and follow a redirect if the
 * result is one. Single-hop deliberately — no redirect here points at another,
 * and `check-patterns-index.mjs` asserts that, so a chain added later fails
 * loudly instead of being silently half-followed.
 */
export const resolveHref = (href) => {
  const bare = href.split('#')[0];
  return REDIRECTS[bare] ?? bare;
};
