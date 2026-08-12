import { defineConfig } from 'astro/config';

// DOCS_BASE is set by the Pages workflow (/busy-office-ui); local dev serves at /.
export default defineConfig({
  base: process.env.DOCS_BASE ?? '/',
  // Old flat-gallery URLs live on: meta-refresh stubs on static output.
  redirects: {
    '/htmx': '/getting-started/htmx',
    '/theming': '/concepts/theming',
    '/printing': '/base/print',
    '/tokens': '/base/colors',
    '/primitives': '/base/primitives',
  },
});
