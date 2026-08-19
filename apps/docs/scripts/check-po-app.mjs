/**
 * Gate: the reference app still does what the docs say it does.
 *
 * `examples/po-app` is the "Devi test" consumer, it is what 24.R1 requires new
 * work to be exercised in, and four docs pages cite it as the working
 * implementation of query tokens, staging, the document-level strip and mass
 * change. Until now **nothing tested it** (Objective grill, 2026-08-17): its
 * behaviours were verified by hand once per wake and never again, and its
 * accessibility had never been checked at all.
 *
 * Lives in apps/docs/scripts because the browser harness it needs —
 * resolve-chrome, the axe-core dependency — already lives here, and a second
 * copy in examples/ would be exactly the duplication a Standardize sweep would
 * come back for. It boots the app as a child process on a free port, so it
 * collides with nothing and needs no container.
  *
 * @exact — boots the reference app and asserts responses. Exempt from --self-test: there is no
 * judgement to get wrong, and ceremony around a lookup is noise.
*/
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gate } from './gate-report.mjs';
import { launchDocsBrowser } from './browser-harness.mjs';
import { WIDTHS } from './viewports.mjs';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const AXE = readFileSync(join(repoRoot, 'node_modules/axe-core/axe.min.js'), 'utf8');

const freePort = () =>
  new Promise((res) => {
    const s = createServer();
    s.listen(0, () => {
      const { port } = s.address();
      s.close(() => res(port));
    });
  });

const PORT = await freePort();
const app = spawn(process.execPath, [join(repoRoot, 'examples/po-app/server.mjs')], {
  env: { ...process.env, PORT: String(PORT) },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let appErr = '';
app.stderr.on('data', (d) => { appErr += d; });

const base = `http://localhost:${PORT}`;
// Wait for the listener rather than sleeping a guessed amount.
await new Promise((res, rej) => {
  const t = setTimeout(() => rej(new Error(`po-app did not start in 20s\n${appErr}`)), 20000);
  app.stdout.on('data', (d) => { if (String(d).includes('po-app on')) { clearTimeout(t); res(); } });
  app.on('exit', (code) => { clearTimeout(t); rej(new Error(`po-app exited (${code})\n${appErr}`)); });
});

const g = gate('po-app smoke check', 'behaviours');
const check = g.check;
const post = (path, pairs) =>
  fetch(base + path, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(pairs).toString(),
  });
const text = (r) => r.text();

try {
  /* ---- documented behaviours the docs assert and nothing repeated ---- */

  // /patterns/invoice-list: "each chip's remove control is a plain <a href>
  // carrying q minus that token — removing a filter needs no JavaScript".
  const twoTokens = await fetch(`${base}/pos?q=status%3APending+vendor%3AStark`).then(text);
  const rowsWithBoth = (twoTokens.match(/<tr id="row-/g) || []).length;
  const removeHref = /class="bo-chip__remove" href="([^"]+)"/.exec(twoTokens)?.[1];
  const afterRemoval = removeHref
    ? await fetch(base + removeHref.replace(/&amp;/g, '&')).then(text)
    : '';
  const rowsAfter = (afterRemoval.match(/<tr id="row-/g) || []).length;
  check(
    'a filter chip is removable by following its href alone (no JS), and widens the result',
    !!removeHref && rowsWithBoth > 0 && rowsAfter > rowsWithBoth,
    JSON.stringify({ removeHref, rowsWithBoth, rowsAfter }),
  );

  // /concepts/i18n + the list page: unknown token keys stay FREE TEXT rather
  // than becoming a token that matches nothing.
  const unknownKey = await fetch(`${base}/pos?q=ref%3A99`).then(text);
  check(
    'an unknown token key is treated as free text, not a token',
    !/bo-chip__remove/.test(unknownKey),
    `chips rendered: ${/bo-chip__remove/.test(unknownKey)}`,
  );

  // /patterns/staging: "an invalid value changes nothing at all" — 422, and the
  // record is untouched.
  const before = await fetch(`${base}/pos?q=cc%3A1180`).then(text);
  const beforeCount = (before.match(/<tr id="row-/g) || []).length;
  const bad = await post('/pos/mass-change', [['cc', 'nonsense'], ['id', 'PO-88212']]);
  const afterBad = await fetch(`${base}/pos?q=cc%3A1180`).then(text);
  check(
    'an invalid mass-change target returns 422 and changes nothing',
    bad.status === 422 && (afterBad.match(/<tr id="row-/g) || []).length === beforeCount,
    JSON.stringify({ status: bad.status, beforeCount, afterCount: (afterBad.match(/<tr id="row-/g) || []).length }),
  );

  // /patterns/staging: the apply button is DISABLED when nothing is applicable,
  // which is the one place disabled beats absent.
  const allBad = await post('/import', [
    ['action', 'validate'],
    ['csv', 'Nobody Ltd, CC-99, notanumber'],
  ]).then(text);
  check(
    'staging disables Apply when no row is applicable',
    /value="apply"[^>]*disabled|disabled[^>]*value="apply"/.test(allBad),
    `has disabled apply: ${/value="apply"[^>]*disabled|disabled[^>]*value="apply"/.test(allBad)}`,
  );

  // /patterns/staging: apply lands the valid rows and LEAVES the rest listed.
  const applied = await post('/import', [
    ['action', 'apply'],
    ['csv', 'Acme Supply Co., CC-4021, 1200\nNobody Ltd, CC-1180, 900'],
  ]).then(text);
  check(
    'staging applies valid rows and keeps un-appliable ones on screen',
    /1 imported/.test(applied) && /data-row-state="error"/.test(applied),
    JSON.stringify({ imported: /1 imported/.test(applied), errorRowKept: /data-row-state="error"/.test(applied) }),
  );

  // /patterns/bulk-actions: partial failure reports BOTH counts and puts the
  // reason on the row.
  const bulk = await post('/pos/bulk-approve', [['id', 'PO-88214'], ['id', 'PO-88212']]).then(text);
  check(
    'bulk approve reports both counts and carries per-row reasons',
    /could not be/.test(bulk) && /data-row-state="error"/.test(bulk),
    JSON.stringify({ bothCounts: /could not be/.test(bulk), rowReason: /data-row-state="error"/.test(bulk) }),
  );

  /* ---- accessibility over the app's own routes ---- */
  const browser = await launchDocsBrowser();
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(AXE);
  const ROUTES = ['/', '/pos', '/import', '/spend', '/receive', '/pos/PO-88210'];
  const violations = [];
  for (const route of ROUTES) {
    for (const width of WIDTHS) {
      await page.setViewport({ width, height: 900 });
      const res = await page.goto(base + route, { waitUntil: 'networkidle0', timeout: 20000 });
      if (!res || res.status() >= 400) { violations.push(`${route}@${width}: HTTP ${res && res.status()}`); continue; }
      const v = await page.evaluate(async () =>
        (await window.axe.run(document, { resultTypes: ['violations'] })).violations
          .map((x) => `${x.id} (${x.impact}) ${x.nodes[0]?.target?.join(' ')?.slice(0, 50)}`));
      for (const one of v) violations.push(`${route}@${width}: ${one}`);
    }
  }
  await browser.close();
  check(
    `the reference app is axe-clean across ${ROUTES.length} routes x 2 widths`,
    violations.length === 0,
    violations.slice(0, 8).join(' | '),
  );
} finally {
  app.kill();
}

g.report('verified end to end');
