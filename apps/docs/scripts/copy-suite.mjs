#!/usr/bin/env node
/**
 * Build the ERP suite at the docs' base path and copy it under `dist/suite/`.
 *
 * WHY. The suite is the most complete artefact this project owns — 28 screens
 * across six modules, built from shipped CSS with zero of their own, axe-clean
 * at two widths and safe at 390px — and until 2026-08-26 **nothing in the docs
 * linked to it**. It existed only on a developer's disk. A person evaluating
 * the framework could read 39 pattern pages and never see a finished screen
 * (roadmap 147.1).
 *
 * RUNS IN THE DOCS BUILD, not only in the Pages workflow, because a step that
 * only runs in CI is not known to work — this repo has the scars: `check:rtl`
 * broke the po-app image, and the axe sweep drifted red for a week because it
 * needed a hand-started container. Building it here means `npm run build -w docs`
 * produces exactly what deploys.
 *
 * THE BASE PATH IS THE WHOLE DIFFICULTY. The suite writes absolute links
 * (`/p2p/purchase-orders.html`, `/bo/index.css`) because that is what an app
 * does. Served under `/suite/` — and under `/busy-office-ui/` on Pages — every
 * one of them would 404. `SUITE_BASE` rewrites them at build time. Getting this
 * wrong produces a kit whose links are all dead, which is worse than no kit,
 * so `check:links` covers the result rather than trust covering it.
 */
import { cp, rm, mkdir, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const SUITE = join(ROOT, 'examples', 'erp-suite');
const DEST = join(ROOT, 'apps', 'docs', 'dist', 'suite');

const docsBase = (process.env.DOCS_BASE ?? '').replace(/\/$/, '');
const suiteBase = `${docsBase}/suite`;

execFileSync(process.execPath, [join(SUITE, 'build.mjs')], {
  cwd: SUITE,
  env: { ...process.env, SUITE_BASE: suiteBase },
  stdio: 'pipe',
});

await rm(DEST, { recursive: true, force: true });
await mkdir(DEST, { recursive: true });
await cp(join(SUITE, 'dist'), DEST, { recursive: true });

/* THE STYLESHEET IS NOT IN THE BUILD OUTPUT. Every screen links `/bo/index.css`,
   and `serve.mjs` mounts that VIRTUALLY from packages/core/dist/css when a
   developer runs the suite locally — so `dist/` has no `bo/` directory at all.
   Copying only `dist/` would have deployed 28 perfectly-gated screens with no
   CSS whatsoever, and every one of them would have looked broken to the first
   person who opened the kit.
   Caught by checking that the links actually SERVE rather than that the files
   were copied, which is the difference between a green step and a working
   page. */
await cp(join(ROOT, 'packages', 'core', 'dist', 'css'), join(DEST, 'bo'), { recursive: true });

const count = (await readdir(DEST, { recursive: true })).filter((f) => f.endsWith('.html')).length;
if (count === 0) {
  console.error('copy-suite: nothing copied — the suite did not build?');
  process.exit(1);
}

/* Leave the developer's own dist unprefixed. `npm run suite` serves it at the
   root, and a stray base would 404 every link on the next local run — the kind
   of state that is invisible until someone opens it. */
execFileSync(process.execPath, [join(SUITE, 'build.mjs')], { cwd: SUITE, stdio: 'pipe' });

console.log(`copy-suite: ${count} screen(s) copied to dist/suite (base ${suiteBase || '/suite'})`);
