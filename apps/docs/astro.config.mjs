import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE_ORIGIN } from './scripts/paths.mjs';

// DOCS_BASE is set by the Pages workflow (/busy-office-ui); local dev serves at /.
// Redirect DESTINATIONS must carry the base themselves — Astro prefixes only
// the stub's source path (site-grill S-1: base-blind destinations 404'd in
// production).
const base = (process.env.DOCS_BASE ?? '').replace(/\/$/, '');

const redirects = {
  '/htmx': `${base}/getting-started/htmx`,
  '/theming': `${base}/concepts/theming`,
  '/printing': `${base}/base/print`,
  '/tokens': `${base}/reference/tokens`,
  '/base/tokens': `${base}/reference/tokens`,
  '/patterns/keyboard-help': `${base}/reference/keyboard`,
  // 109.2: shape-not-domain rename — the invoice was always sample data
  // on the generic list screen; the industry name is List Report.
  '/patterns/invoice-list': `${base}/patterns/list-report`,
  // 109.19: field-editor folded into detail-form's field-per-row variant
  // (109.4's verdict — thin anatomy, one distinction expressible as a
  // paragraph on an existing pattern rather than a standalone page).
  '/patterns/field-editor': `${base}/patterns/detail-form`,
  '/components/nav': `${base}/components/sidebar-nav`,
  '/primitives': `${base}/base/primitives`,
};

/* The redirect stubs, as PATHNAMES, for the sitemap's exclusion set (249.2).
   Derived from the `redirects` object above rather than re-listed, so the two
   cannot drift — a hand-copy here is exactly the shape dist-pages.mjs and
   paths.mjs both exist to prevent. A stub is a `<meta http-equiv="refresh">`
   with no content of its own, so listing one for indexing points a crawler at
   a page whose only job is to bounce it; `distPages()` excludes them for the
   same reason, which is what makes the two page sets comparable in
   check-metadata.mjs. Astro builds a stub as a real route, so the sitemap
   carries it unless told otherwise. */
const REDIRECT_PATHNAMES = new Set(Object.keys(redirects).map((p) => `${base}${p}/`));

export default defineConfig({
  // The ORIGIN only. Astro joins `base` onto this itself, so handing it the
  // full published root would emit /busy-office-ui/busy-office-ui/ URLs.
  site: SITE_ORIGIN,
  base: process.env.DOCS_BASE ?? '/',
  build: {
    // NEVER inline page styles (owner root-cause doc, 2026-08-16, kept as
    // history after hx-boost was removed 2026-08-30 alongside the move to
    // htmx 4): the original reason was boosted navigation losing an inlined
    // page <style> when the head-merge silently didn't run. The shell now
    // navigates with plain full-page loads, so that failure mode is gone —
    // this setting is left as-is rather than revisited in the same change.
    inlineStylesheets: 'never',
  },
  integrations: [
    sitemap({
      filter: (page) => !REDIRECT_PATHNAMES.has(new URL(page).pathname),
    }),
  ],
  redirects,
});
