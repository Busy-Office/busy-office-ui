/**
 * One canonical "bring up examples/po-app" for everything that needs it.
 *
 * This is the `browser-harness.mjs` argument applied one layer out. That module
 * exists because ten gates each had their own `puppeteer.launch({...})` and the
 * copies had drifted; this one exists because the po-app boot is about to have
 * a second caller (`measure-stress.mjs`, roadmap 309.5) and the boot is the
 * part with the traps in it — the tarball install, the stale-artifact wipe, the
 * free port, and waiting for the listener rather than sleeping a guess.
 *
 * **The recipe here IS the answer to 309.4's second finding.** Slice 307
 * recorded its re-run command as `node examples/po-app/server.mjs`, and that
 * exits `MODULE_NOT_FOUND` on `htmx.org/dist/htmx.min.js` from a clean clone,
 * because `examples/po-app/node_modules` does not exist until something
 * performs the tarball install below. Anything that wants a running po-app
 * calls `startPoApp()` and gets one; nobody has to know that.
 */
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync, renameSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, join, normalize } from 'node:path';
import { REPO_ROOT } from './paths.mjs';

const poAppDir = join(REPO_ROOT, 'examples/po-app');

/**
 * Do the REAL tarball-consumer install, matching examples/po-app/Dockerfile.
 *
 * po-app is not an npm workspace (its own package.json calls it a "reference
 * consumer … installs @busy-office/ui FROM THE TARBALL"), so a root `npm ci`
 * never installs its dependencies. The older approach just spawned server.mjs
 * and trusted that @busy-office/ui and htmx.org would BOTH happen to be
 * reachable via require.resolve walking up into root node_modules (the
 * workspace symlink). That held for @busy-office/ui by luck; it never held for
 * htmx.org, which npm leaves nested under apps/docs/node_modules with a single
 * declaring workspace — confirmed on a genuinely fresh `npm ci`, and confirmed
 * as the exact cause of a real CI break (2026-08-30, htmx 4 migration, roadmap
 * 222.1). Doing the install removes the dependency on hoisting entirely, which
 * is also the more honest test: this is what a real consumer experiences.
 *
 * A stale local busy-office-ui.tgz/package-lock.json/node_modules from a
 * previous manual run can pin an OLD tarball's resolution even after a fresh
 * `npm pack` — wiping all three first is what makes this install actually
 * fresh rather than merely re-run.
 */
export function installPoApp() {
  for (const p of ['node_modules', 'package-lock.json', 'busy-office-ui.tgz']) {
    rmSync(join(poAppDir, p), { recursive: true, force: true });
  }
  const pack = spawnSync(
    'npm',
    ['pack', '-w', '@busy-office/ui', '--pack-destination', poAppDir],
    { cwd: REPO_ROOT, encoding: 'utf8' },
  );
  if (pack.status !== 0) throw new Error(`npm pack -w @busy-office/ui failed:\n${pack.stderr}`);
  const tgzName = pack.stdout.trim().split('\n').filter(Boolean).pop();
  renameSync(join(poAppDir, tgzName), join(poAppDir, 'busy-office-ui.tgz'));
  const install = spawnSync('npm', ['install', '--omit=dev', '--no-audit', '--no-fund'], {
    cwd: poAppDir,
    encoding: 'utf8',
  });
  if (install.status !== 0) throw new Error(`npm install (examples/po-app) failed:\n${install.stderr}`);
}

/**
 * The files po-app will serve from the INSTALLED package, checked before boot
 * (roadmap 352.1). Without this, an unbuilt `packages/core` packs a tarball with
 * no `dist`, po-app 404s its own behaviour bundle, and the first gate to notice
 * says "the select-all did not select the rows" — the exact words of a real
 * defect this repo has had, pointing at the wrong half of the system. It cost
 * a wake a false P0 once.
 *
 * The list is DERIVED, never written out: every `/assets/<path>` server.mjs
 * serves, plus every module `js/index.js` imports, transitively. So a new asset
 * or behaviour is covered without editing this.
 */
export function missingUiAssets() {
  const uiDist = join(poAppDir, 'node_modules', '@busy-office', 'ui', 'dist');
  const server = readFileSync(join(poAppDir, 'server.mjs'), 'utf8');
  const wanted = [...new Set([...server.matchAll(/\/assets\/([\w./-]+\.(?:js|css))/g)].map((m) => m[1]))];
  const missing = [];
  const seen = new Set();
  const visit = (rel) => {
    if (seen.has(rel)) return;
    seen.add(rel);
    const file = join(uiDist, rel);
    if (!existsSync(file)) {
      missing.push(`dist/${rel}`);
      return;
    }
    if (!rel.endsWith('.js')) return;
    for (const m of readFileSync(file, 'utf8').matchAll(/(?:from|import)\s*['"](\.{1,2}\/[^'"]+)['"]/g)) {
      visit(normalize(join(dirname(rel), m[1])));
    }
  };
  wanted.forEach(visit);
  return { wanted, missing };
}

export function assertUiAssets() {
  const { wanted, missing } = missingUiAssets();
  if (wanted.length === 0) {
    throw new Error('po-app-harness: found no /assets/ paths in examples/po-app/server.mjs — the asset check cannot run.');
  }
  if (missing.length) {
    throw new Error(
      `po-app-harness: the installed @busy-office/ui is missing ${missing.length} file(s) po-app serves:\n` +
        missing.map((f) => `    ${f}`).join('\n') +
        '\n  packages/core/dist is not built (npm pack ships whatever dist holds). Run\n' +
        '  `npm run build -w @busy-office/ui` first. This is a BUILD-STATE problem, not an\n' +
        '  app defect — do not read the gate failure that would follow as one (roadmap 352.1).',
    );
  }
}

const freePort = () =>
  new Promise((res) => {
    const s = createServer();
    s.listen(0, () => {
      const { port } = s.address();
      s.close(() => res(port));
    });
  });

/**
 * Install (unless `install: false`) and boot po-app on a free port.
 *
 * Returns `{ base, app, stop }`. The caller owns `stop()`; it collides with
 * nothing and needs no container, which is why every gate and probe can run it
 * concurrently with anything else.
 */
export async function startPoApp({ install = true } = {}) {
  if (install) installPoApp();
  assertUiAssets();

  const port = await freePort();
  const app = spawn(process.execPath, [join(poAppDir, 'server.mjs')], {
    env: { ...process.env, PORT: String(port) },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let appErr = '';
  app.stderr.on('data', (d) => { appErr += d; });

  // Wait for the listener rather than sleeping a guessed amount.
  await new Promise((res, rej) => {
    const t = setTimeout(() => rej(new Error(`po-app did not start in 20s\n${appErr}`)), 20000);
    app.stdout.on('data', (d) => { if (String(d).includes('po-app on')) { clearTimeout(t); res(); } });
    app.on('exit', (code) => { clearTimeout(t); rej(new Error(`po-app exited (${code})\n${appErr}`)); });
  });

  return { base: `http://localhost:${port}`, app, stop: () => app.kill() };
}
