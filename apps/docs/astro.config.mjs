import { defineConfig } from 'astro/config';

// DOCS_BASE is set by the Pages workflow (/busy-office-ui); local dev serves at /.
// Redirect DESTINATIONS must carry the base themselves — Astro prefixes only
// the stub's source path (site-grill S-1: base-blind destinations 404'd in
// production).
const base = (process.env.DOCS_BASE ?? '').replace(/\/$/, '');

export default defineConfig({
  base: process.env.DOCS_BASE ?? '/',
  redirects: {
    '/htmx': `${base}/getting-started/htmx`,
    '/theming': `${base}/concepts/theming`,
    '/printing': `${base}/base/print`,
    '/tokens': `${base}/base/colors`,
    '/primitives': `${base}/base/primitives`,
  },
});
