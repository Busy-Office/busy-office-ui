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
import { CORE_DIST, REPO_ROOT } from './paths.mjs';

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
 * (roadmap 352.1, widened by the Slice 384 grill). Without this, an unbuilt or
 * stale `packages/core` gives po-app a behaviour bundle that is missing or
 * out of date, and the first gate to notice says "select-all on /pos checks
 * every row" failed (or measure:stress: "the select-all did not select the
 * rows") — the words of a real defect this repo has had, pointing at the wrong
 * half of the system. It cost a wake a false P0 once.
 *
 * Everything is DERIVED, never written out: every `/assets/<path>` server.mjs
 * serves, every module `js/index.js` imports (transitively), and every name
 * server.mjs imports from `/assets/js/index.js`, which the installed
 * `index.js` must export. That last check is what catches a STALE dist — built,
 * but before a behaviour was added. And it reconciles against the source: if
 * server.mjs mentions `/assets/` somewhere the pattern cannot read as a literal
 * path, it refuses rather than check a shorter list.
 *
 * The paths are options so the check can be red-proved on scratch copies.
 */
const stripJsComments = (src) => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:\\])\/\/.*$/gm, '$1');

const exportedNames = (src) => {
  const names = new Set();
  for (const m of src.matchAll(/export\s*\{([^}]*)\}/g)) {
    for (const part of m[1].split(',')) {
      const bits = part.trim().split(/\s+as\s+/);
      const name = (bits[1] ?? bits[0]).trim();
      if (name) names.add(name);
    }
  }
  for (const m of src.matchAll(/export\s+(?:async\s+)?(?:function\*?|const|let|var|class)\s+([\w$]+)/g)) names.add(m[1]);
  return names;
};

export function missingUiAssets({
  appDir = poAppDir,
  coreDist = CORE_DIST,
} = {}) {
  const uiDist = join(appDir, 'node_modules', '@busy-office', 'ui', 'dist');
  const server = readFileSync(join(appDir, 'server.mjs'), 'utf8');
  const literal = [...server.matchAll(/\/assets\/([\w./-]+\.(?:js|css))/g)];
  const wanted = [...new Set(literal.map((m) => m[1]))];
  // Reconcile: every `/assets/` mention is a literal path, except the route
  // handler that serves them (`path.startsWith('/assets/')`).
  const mentions = server.split('/assets/').length - 1;
  const handler = server.split("startsWith('/assets/')").length - 1;
  const unparsed = mentions - handler - literal.length;

  const missing = [];
  const seen = new Set();
  const visit = (rel) => {
    if (seen.has(rel)) return;
    seen.add(rel);
    const file = join(uiDist, rel);
    if (!existsSync(file)) {
      missing.push(rel);
      return;
    }
    if (!rel.endsWith('.js')) return;
    const src = stripJsComments(readFileSync(file, 'utf8'));
    for (const m of src.matchAll(/(?:from|import)\s*\(?\s*['"](\.{1,2}\/[^'"]+)['"]/g)) {
      visit(normalize(join(dirname(rel), m[1])));
    }
  };
  wanted.forEach(visit);

  const imported = new Set();
  for (const m of stripJsComments(server).matchAll(/import\s*\{([^}]*)\}\s*from\s*['"]\/assets\/js\/index\.js['"]/g)) {
    for (const part of m[1].split(',')) {
      const name = part.trim().split(/\s+as\s+/)[0].trim();
      if (name) imported.add(name);
    }
  }
  const installedIndex = join(uiDist, 'js', 'index.js');
  const exported = existsSync(installedIndex) ? exportedNames(readFileSync(installedIndex, 'utf8')) : null;
  const missingExports = exported ? [...imported].filter((n) => !exported.has(n)) : [];

  // Name the cause from what can be observed, not from a guess.
  let cause = null;
  if (missing.length || missingExports.length) {
    const coreIndex = join(coreDist, 'js', 'index.js');
    const coreHasFiles = missing.every((rel) => existsSync(join(coreDist, rel)));
    const coreHasExports = !missingExports.length ||
      (existsSync(coreIndex) && missingExports.every((n) => exportedNames(readFileSync(coreIndex, 'utf8')).has(n)));
    if (!existsSync(coreDist)) cause = 'not-built';
    else if (coreHasFiles && coreHasExports) cause = 'stale-install';
    else cause = 'stale-dist';
  }
  return { wanted, missing: missing.map((r) => `dist/${r}`), missingExports, unparsed, cause };
}

const CAUSE_TEXT = {
  'not-built': 'packages/core/dist is not built (npm pack ships whatever dist holds). Run\n' +
    '  `npm run build -w @busy-office/ui` first.',
  'stale-install': "packages/core/dist has what po-app needs, but po-app's installed copy does not —\n" +
    '  it is stale or missing. Drop `--no-install`, or let the harness reinstall.',
  'stale-dist': 'packages/core/dist is partial or older than the source. Rebuild it with\n' +
    '  `npm run build -w @busy-office/ui`.',
};

export function assertUiAssets(opts) {
  const { wanted, missing, missingExports, unparsed, cause } = missingUiAssets(opts);
  if (wanted.length === 0) {
    throw new Error('po-app-harness: found no /assets/ paths in examples/po-app/server.mjs — the asset check cannot run.');
  }
  if (unparsed !== 0) {
    throw new Error(
      `po-app-harness: server.mjs mentions /assets/ ${unparsed} time(s) more than it names a literal .js/.css path,\n` +
        '  so the asset check cannot see every asset. Make the path literal, or teach missingUiAssets() to read it.',
    );
  }
  if (missing.length || missingExports.length) {
    const lines = [
      ...missing.map((f) => `    missing file: ${f}`),
      ...missingExports.map((n) => `    js/index.js does not export: ${n}`),
    ];
    throw new Error(
      `po-app-harness: the installed @busy-office/ui cannot serve what po-app asks for:\n${lines.join('\n')}\n  ` +
        CAUSE_TEXT[cause] +
        '\n  This is a BUILD-STATE problem, not an app defect — do not read the gate failure\n' +
        '  that would follow as one (roadmap 352.1).',
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
