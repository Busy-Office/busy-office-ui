#!/usr/bin/env node
/**
 * Gate: a person with an empty directory reaches a RENDERED screen by
 * following the documented steps (roadmap 147.3).
 *
 * @exact — it runs the commands and measures the result in a real browser.
 * Nothing is recognised or inferred.
 *
 * WHY. `check:package` already proves the tarball CONTAINS the right files,
 * and `getting-started/installation` documents what to do with them. Neither
 * proves the two meet: that `npm i` then one import produces a page whose
 * `bo-` classes actually resolve. That gap is exactly where an adopter is
 * lost, and it is the one place this project had no evidence — the whole
 * reason the owner picked adoption/DX.
 *
 * It packs and installs the LOCAL build rather than the registry on purpose.
 * The registry tells you whether 0.5.0 worked; this tells you whether the
 * thing about to be published works, which is the only version anyone can
 * still fix.
 *
 * The screen it renders is a real markup fragment from the screen kit, so this
 * also proves the kit's central promise — "paste it and the classes resolve" —
 * rather than a hand-written snippet that only ever appears in this file.
 */
import { mkdtemp, writeFile, readFile, rm, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createServer } from 'node:http';
import { launchDocsBrowser } from './browser-harness.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const FRAGMENT = join(ROOT, 'apps', 'docs', 'dist', 'suite', 'markup', 'p2p', 'purchase-orders.txt');

const fail = (msg, detail = '') => {
  console.error(`quickstart check FAILED — ${msg}`);
  if (detail) console.error(`  ${detail}`);
  process.exit(1);
};

const dir = await mkdtemp(join(tmpdir(), 'bo-quickstart-'));
let browser;
try {
  /* ---- step 1: an empty directory ---- */
  execFileSync('npm', ['init', '-y'], { cwd: dir, stdio: 'pipe' });

  /* ---- step 2: npm i @busy-office/ui (the local build) ---- */
  const packed = execFileSync('npm', ['pack', '-w', '@busy-office/ui', '--pack-destination', dir], {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'], // npm pack narrates to stderr
  })
    .trim()
    .split('\n')
    .pop();
  execFileSync('npm', ['i', join(dir, packed)], { cwd: dir, stdio: 'pipe' });

  /* ---- step 3: every documented entry point resolves ---- */
  const pkgDir = join(dir, 'node_modules', '@busy-office', 'ui');
  const entries = ['css', 'css/reset', 'css/tokens', 'css/components/data-table'];
  const resolved = [];
  for (const e of entries) {
    try {
      const out = execFileSync(
        process.execPath,
        ['-e', `process.stdout.write(require.resolve(${JSON.stringify('@busy-office/ui/' + e)}))`],
        { cwd: dir, encoding: 'utf8' },
      );
      resolved.push(e);
      if (!out.trim()) fail(`the documented import "@busy-office/ui/${e}" resolved to nothing`);
    } catch (err) {
      fail(`the documented import "@busy-office/ui/${e}" does not resolve from a fresh install`,
           String(err.stderr ?? err).split('\n')[0]);
    }
  }

  /* ---- step 4: the documented skeleton, with a REAL screen from the kit ---- */
  const fragment = await readFile(FRAGMENT, 'utf8').catch(() =>
    fail('no screen-kit fragment to paste — run `npm run build -w docs` first'),
  );
  await mkdir(join(dir, 'site'), { recursive: true });
  await writeFile(
    join(dir, 'site', 'index.html'),
    `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Quickstart</title>
<link rel="stylesheet" href="/bo.css">
</head>
<body>
<div class="bo-app-shell">
  <main class="bo-app-shell__main">
${fragment}
  </main>
</div>
</body>
</html>
`,
  );
  const css = await readFile(join(pkgDir, 'dist', 'css', 'index.css'), 'utf8');
  await writeFile(join(dir, 'site', 'bo.css'), css);

  /* ---- step 5: does it actually RENDER? ---- */
  const server = createServer(async (req, res) => {
    const p = req.url === '/' ? '/index.html' : req.url.split('?')[0];
    try {
      const body = await readFile(join(dir, 'site', p));
      res.writeHead(200, { 'content-type': p.endsWith('.css') ? 'text/css' : 'text/html' });
      res.end(body);
    } catch {
      res.writeHead(404).end();
    }
  });
  await new Promise((r) => server.listen(0, r));
  const port = server.address().port;

  browser = await launchDocsBrowser();
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const consoleErrors = [];
  page.on('pageerror', (e) => consoleErrors.push(String(e)));
  await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle0', timeout: 20000 });

  const seen = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const table = document.querySelector('.bo-data-table');
    const btn = document.querySelector('.bo-btn');
    return {
      token: root.getPropertyValue('--bo-color-accent').trim(),
      tableCollapse: table ? getComputedStyle(table).borderCollapse : null,
      btnCursor: btn ? getComputedStyle(btn).cursor : null,
      btnPadding: btn ? getComputedStyle(btn).paddingInlineStart : null,
      rows: document.querySelectorAll('tbody tr').length,
      boClasses: new Set([...document.querySelectorAll('[class*="bo-"]')]).size,
    };
  });
  server.close();

  /* Each of these would still be true of an UNSTYLED page but for the token and
     the computed values — which is the point. A fragment renders as text with
     no CSS at all and looks "fine" in a screenshot at a glance. */
  if (!seen.token) fail('the framework CSS did not apply — no --bo-color-accent on :root', JSON.stringify(seen));
  if (seen.tableCollapse !== 'collapse') fail('.bo-data-table is unstyled', JSON.stringify(seen));
  if (seen.btnCursor !== 'pointer') fail('.bo-btn is unstyled', JSON.stringify(seen));
  if (seen.rows === 0) fail('the pasted screen rendered no rows', JSON.stringify(seen));
  if (consoleErrors.length) fail('the page threw', consoleErrors[0]);

  /* ---- step 6: the documented final step, npx bo-check-markup ---- */
  try {
    execFileSync('npx', ['bo-check-markup', 'site'], { cwd: dir, stdio: 'pipe' });
  } catch (err) {
    fail('the documented `npx bo-check-markup` step fails on the pasted screen',
         String(err.stdout ?? err).split('\n').slice(0, 3).join(' '));
  }

  console.log(
    `quickstart check passed — empty dir → npm i → ${resolved.length} documented import(s) resolve → ` +
      `a kit screen renders (${seen.rows} rows, ${seen.boClasses} styled elements) → bo-check-markup clean`,
  );
} finally {
  if (browser) await browser.close();
  await rm(dir, { recursive: true, force: true });
}
