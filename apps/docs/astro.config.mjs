import { defineConfig } from 'astro/config';

// DOCS_BASE is set by the Pages workflow (/busy-office-ui); local dev serves at /.
// Redirect DESTINATIONS must carry the base themselves — Astro prefixes only
// the stub's source path (site-grill S-1: base-blind destinations 404'd in
// production).
const base = (process.env.DOCS_BASE ?? '').replace(/\/$/, '');

export default defineConfig({
  base: process.env.DOCS_BASE ?? '/',
  build: {
    // NEVER inline page styles (owner root-cause doc, 2026-08-16): the
    // shell navigates with hx-boost, which swaps #main-content and
    // leaves <head> alone — an inlined page <style> only arrives when
    // the head-support merge RUNS, and the owner captured a broken
    // state where it silently didn't (registration race). Linked
    // stylesheets in the shared bundles survive boosted swaps by
    // construction; check-boost.mjs guards the whole class.
    inlineStylesheets: 'never',
  },
  redirects: {
    '/htmx': `${base}/getting-started/htmx`,
    '/theming': `${base}/concepts/theming`,
    '/printing': `${base}/base/print`,
    '/tokens': `${base}/reference/tokens`,
    '/base/tokens': `${base}/reference/tokens`,
    '/patterns/keyboard-help': `${base}/reference/keyboard`,
    '/primitives': `${base}/base/primitives`,
  },
});
