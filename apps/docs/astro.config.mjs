import { defineConfig } from 'astro/config';

// DOCS_BASE is set by the Pages workflow (/busy-office-ui); local dev serves at /.
export default defineConfig({
  base: process.env.DOCS_BASE ?? '/',
});
