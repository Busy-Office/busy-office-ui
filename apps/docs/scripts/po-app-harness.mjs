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
import { rmSync, renameSync } from 'node:fs';
import { createServer } from 'node:http';
import { join } from 'node:path';
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
