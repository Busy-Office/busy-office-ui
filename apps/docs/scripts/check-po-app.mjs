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
import { WIDTHS, DESKTOP_WIDTH } from './viewports.mjs';
import { REPO_ROOT } from './paths.mjs';

const repoRoot = REPO_ROOT;
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

  // /patterns/detail-form: "422 → the SAME form re-rendered with aria-invalid
  // + messages, values preserved". /pos/new used to be a dead link (roadmap
  // Explore, po-create spike) — nothing exercised it until now.
  const badNewPo = await fetch(`${base}/pos/new`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams([['vendor', ''], ['cc', 'CC-9999'], ['amount', '100']]).toString(),
  });
  const badNewPoBody = await badNewPo.text();
  check(
    'creating a PO with a bad cost centre returns 422, keeps entered values, marks only the bad fields',
    badNewPo.status === 422 &&
      /id="new-cc" name="cc"[^>]*value="CC-9999"[^>]*aria-invalid="true"/.test(badNewPoBody) &&
      /id="new-amount" name="amount"[^>]*value="100"/.test(badNewPoBody) &&
      !/id="new-amount"[^>]*aria-invalid/.test(badNewPoBody),
    JSON.stringify({ status: badNewPo.status }),
  );

  // Same pattern, the success path: creates the record and redirects to it —
  // /patterns/detail-form's own contract ("POST /po/:id → redirect to the
  // record on success"). Checking the list page's ROW COUNT here would
  // never catch a missing add: /pos only renders page 1 (PAGE_SIZE=10),
  // capped regardless of how many records exist — caught before trusting
  // it, an early version of this check compared before/after counts and
  // both were 10 no matter what. Check the new id actually appears on
  // page 1 instead — it's unshift()ed to the front, so it must.
  const goodNewPo = await fetch(`${base}/pos/new`, {
    method: 'POST',
    redirect: 'manual',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams([['vendor', 'Gate Test Vendor'], ['cc', 'CC-2205'], ['amount', '42.50']]).toString(),
  });
  const location = goodNewPo.headers.get('location') || '';
  const created = location ? await fetch(base + location).then(text) : '';
  const newId = location.replace('/pos/', '');
  const listAfter = await fetch(`${base}/pos`).then(text);
  check(
    'creating a valid PO redirects to the new record and it appears in the list',
    goodNewPo.status === 302 &&
      /Gate Test Vendor/.test(created) &&
      /CC-2205/.test(created) &&
      newId.length > 0 &&
      listAfter.includes(`row-${newId}`),
    JSON.stringify({ status: goodNewPo.status, location, foundInList: listAfter.includes(`row-${newId}`) }),
  );

  // roadmap Explore, value-help spike: the shared cost-centre picker's
  // server-side search actually narrows, from the real endpoint both
  // /pos/new and mass-change's dialog point at.
  const ccSearch = await fetch(`${base}/cost-centers?q=log`).then(text);
  check(
    'the cost-centre picker search endpoint narrows server-side',
    /CC-2205/.test(ccSearch) && !/CC-4021/.test(ccSearch),
    JSON.stringify({ hasLogistics: /CC-2205/.test(ccSearch), hasFacilities: /CC-4021/.test(ccSearch) }),
  );

  // roadmap Explore, po-edit spike: before this, po-app had NO way to fix a
  // mistake on a record — only approve/reject/mass-recost existed. Field-
  // editor's own contract: 422 keeps values and marks only the bad field.
  const badEdit = await post('/pos/PO-88213/edit', [['vendor', ''], ['cc', 'CC-2205'], ['amount', '99']]);
  const badEditBody = await badEdit.text();
  check(
    'editing a PO with a missing vendor returns 422 and marks only that field',
    badEdit.status === 422 &&
      /id="edit-vendor"[^>]*aria-invalid="true"/.test(badEditBody) &&
      !/id="edit-cc"[^>]*aria-invalid/.test(badEditBody),
    JSON.stringify({ status: badEdit.status }),
  );

  // The success path: field really changes, and shows up on a fresh GET —
  // not just in the redirect target's own response. redirect: 'manual' is
  // load-bearing here: `post()`'s plain fetch() follows redirects by
  // default, so a first version of this check read the FOLLOWED response's
  // 200 as the edit's own status — caught immediately (this exact mistake
  // was already avoided in the /pos/new checks above, missed here first).
  const goodEdit = await fetch(`${base}/pos/PO-88213/edit`, {
    method: 'POST',
    redirect: 'manual',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams([['vendor', 'Gate Edit Vendor'], ['cc', 'CC-2205'], ['amount', '77.25']]).toString(),
  });
  const afterEdit = await fetch(`${base}/pos/PO-88213`).then(text);
  check(
    'editing a Pending PO with valid values actually changes the record',
    goodEdit.status === 302 && /Gate Edit Vendor/.test(afterEdit),
    JSON.stringify({ status: goodEdit.status, vendorChanged: /Gate Edit Vendor/.test(afterEdit) }),
  );

  // /patterns/staging's "already decided needs a reversal" rule, applied to
  // single-record edit too — checked server-side, not just hidden by the
  // client (the edit form only renders for Pending records, but a request
  // can still arrive after someone else decided it in the meantime).
  const decidedEdit = await post('/pos/PO-88211/edit', [['vendor', 'Should Not Apply'], ['cc', 'CC-4021'], ['amount', '1']]);
  const afterDecidedEdit = await fetch(`${base}/pos/PO-88211`).then(text);
  check(
    'editing an already-decided PO is refused (409) and changes nothing',
    decidedEdit.status === 409 && !/Should Not Apply/.test(afterDecidedEdit),
    JSON.stringify({ status: decidedEdit.status }),
  );

  // roadmap 116.2 spike: /inbox's under-threshold row expands in place with
  // approval's OWN dialog wired to its OWN endpoint — not a second copy —
  // while an over-threshold row stays a plain link-out with no preview.
  //
  // Fresh records, not the seeded PO-8821x fixtures: an earlier check above
  // edits PO-88213's amount to $77.25 and another bulk-approves PO-88214,
  // so by this point in the suite neither is at its seeded value — asserting
  // against them here would test THIS FILE's own side effects, not the
  // feature (found on the first run: a false "escalation broken" red that
  // was actually a stale fixture assumption, not a real bug).
  const mkPo = (vendor, amount) =>
    fetch(`${base}/pos/new`, {
      method: 'POST',
      redirect: 'manual',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams([['vendor', vendor], ['cc', 'CC-2205'], ['amount', String(amount)]]).toString(),
    }).then((r) => (r.headers.get('location') || '').replace('/pos/', ''));
  const routineId = await mkPo('Gate Inbox Routine', 500);
  const escalatedId = await mkPo('Gate Inbox Escalated', 25000);

  const inboxBody = await fetch(`${base}/inbox`).then(text);
  check(
    'inbox expands an under-threshold Pending PO in place, dialog targeting its own endpoint',
    inboxBody.includes(`id="inb-detail-${routineId}"`) &&
      inboxBody.includes(`id="approve-dlg-${routineId}"`) &&
      inboxBody.includes(`hx-post="/pos/${routineId}/approve"`) &&
      inboxBody.includes(`hx-post="/pos/${routineId}/reject"`),
    JSON.stringify({ hasDetail: inboxBody.includes(`id="inb-detail-${routineId}"`), routineId }),
  );
  check(
    'inbox links an escalated (over-threshold) Pending PO out instead, no inline preview',
    inboxBody.includes(`href="/pos/${escalatedId}"`) &&
      !inboxBody.includes(`id="inb-detail-${escalatedId}"`),
    JSON.stringify({
      hasLink: inboxBody.includes(`href="/pos/${escalatedId}"`),
      hasDetail: inboxBody.includes(`id="inb-detail-${escalatedId}"`),
      escalatedId,
    }),
  );

  // The reused endpoint actually resolves the row, not just renders a dialog
  // that looks wired — approving through it (the exact params its own
  // hx-vals sends) is real, previously-untested coverage of POST
  // /pos/:id/approve, plus the inbox contract's own "row disappears on the
  // next fetch" promise.
  const inboxApprove = await post(`/pos/${routineId}/approve`, [['note', 'Gate: approved from inbox preview']]);
  const inboxAfter = await fetch(`${base}/inbox`).then(text);
  // Scoped to the row markup itself, not the whole page: approving fires
  // notify() (roadmap 116's own earlier notification dogfood), so the
  // navbar bell's recent-activity list — rendered in the shared shell on
  // every page, including /inbox — now legitimately mentions this PO too.
  // A bare page-wide substring check would read that cross-feature mention
  // as "still listed" — a false red, caught by checking curl output by hand
  // before trusting the assertion.
  check(
    'approving from the inbox preview resolves the row and it leaves the list on the next fetch',
    inboxApprove.status === 200 && !inboxAfter.includes(`id="inb-detail-${routineId}"`),
    JSON.stringify({ status: inboxApprove.status, stillListed: inboxAfter.includes(`id="inb-detail-${routineId}"`) }),
  );

  /* ---- windowed list (roadmap 30.4b): the Accept's own red-proof ----
     Scroll deep, scroll back: no scroll jump, no lost selection. During
     development this instrument caught four real bugs before any of these
     assertions first passed (early-exited chunks exempt from eviction; the
     rem density token read as px, spacers 16x short; IntersectionObserver
     root:null clipped by the app shell's inner scroll container; the
     horizontal-scroll table container matched as the vertical scroll root)
     — so it has demonstrated it can fail. */
  const browser = await launchDocsBrowser();
  const page = await browser.newPage();
  await page.setViewport({ width: DESKTOP_WIDTH, height: 900 });
  await page.goto(`${base}/movements`, { waitUntil: 'networkidle0', timeout: 20000 });
  /* PRECONDITION, and it is the whole reason this block reads a `check()`
     rather than an assumption. Every windowed-list assertion below is
     downstream of htmx: chunks past the first two arrive through
     `htmx.ajax`, so with htmx absent the list never grows past its two
     initial chunks, never exceeds the 3-chunk resident budget, and never
     evicts anything. The gate then reports `chunk0Evicted: false` — which
     reads as "eviction is broken" and is not what happened.
     That is not hypothetical: roadmap 208.3 spent four runs across two
     cloud containers on exactly that misreading. The app loads htmx from a
     CDN (`server.mjs`'s `<script src="https://unpkg.com/...">`), an
     egress-restricted container refuses the host with
     `ERR_TUNNEL_CONNECTION_FAILED`, and the payload was byte-identical
     every time. Naming the missing input is this repo's own rule — a gate
     that cannot run must fail loudly, never skip quietly, and a derived
     artefact may not decide on its own what it failed to see. */
  check(
    'windowed list: htmx loaded, so the assertions below are testing the app and not a blocked CDN',
    (await page.evaluate(() => typeof window.htmx)) !== 'undefined',
    JSON.stringify({
      htmx: await page.evaluate(() => typeof window.htmx),
      hint: 'the app loads htmx from a CDN; an egress-restricted environment blocks it, and every windowed-list result below is then vacuous',
    }),
  );
  const win = await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const main = document.querySelector('.bo-app-shell__main');
    const table = document.getElementById('mv-table');
    const out = {};
    out.rowcount = table.getAttribute('aria-rowcount');
    /* The row the shipped fallback samples. No longer the basis of any
       assertion — kept in the payload because when the spacer check fails, the
       gap between this x 100 and the chunk's real height is the diagnosis. */
    out.sampledRowH = table.querySelector('tr[data-row-id]').getBoundingClientRect().height;
    /* Chunk 0's OWN rendered height, taken before anything evicts it.
       roadmap 213: the old spacer assertion compared the spacer against
       `realRowHeight * 100`, and the shipped code computed the spacer from that
       same sampled row — so it compared 3250 against 3250 and passed while
       every chunk was 49px short. An assertion whose expectation is derived
       from the value under test cannot fail. This is the independent quantity:
       what the chunk actually occupies, which no sampling can misrepresent. */
    out.chunk0RenderedH = +table
      .querySelector('tbody[data-chunk-offset="0"]').getBoundingClientRect().height.toFixed(2);
    const firstBox = table.querySelector('tbody[data-chunk-offset="0"] .bo-data-table__row-select');
    const rowId = firstBox.closest('[data-row-id]').dataset.rowId;
    firstBox.click();
    for (let i = 0; i < 10; i++) { main.scrollTop = main.scrollHeight; await sleep(350); }
    const c0 = table.querySelector('tbody[data-chunk-offset="0"]');
    out.chunk0Evicted = c0?.dataset.evicted === 'true';
    const spacerH = parseFloat(c0?.querySelector('.bo-data-table__spacer')?.style.blockSize ?? '0');
    out.spacerH = spacerH;
    /* Sub-pixel tolerance only. The spacer stands in for the chunk, so any
       slack here is a scroll jump the user sees: at the old one-row tolerance
       (32.5px) a real 49px error passed. */
    out.spacerMatchesReal = Math.abs(spacerH - out.chunk0RenderedH) <= 1;
    out.renderedBounded = table.querySelectorAll('tr[data-row-id]').length <= 400;
    out.hiddenInputSurvives = !!document.querySelector(
      `[data-windowed-selection-host] input[value="${rowId}"]`,
    );
    // Park the evicted chunk just above the viewport: its re-swap changes
    // content height ABOVE the visible rows — the case that jumps if the
    // spacer height is wrong.
    main.scrollTop = spacerH + 300;
    await sleep(150);
    const anchorRow = [...table.querySelectorAll('tr[data-row-id]')].find(
      (tr) => tr.getBoundingClientRect().top > 100,
    );
    const anchorBefore = anchorRow.getBoundingClientRect().top;
    const scrollBefore = main.scrollTop;
    await sleep(900);
    out.chunk0Reloaded =
      table.querySelector('tbody[data-chunk-offset="0"]')?.dataset.evicted !== 'true';
    out.anchorShift = anchorRow.isConnected
      ? Math.abs(anchorRow.getBoundingClientRect().top - anchorBefore)
      : -1;
    out.scrollShift = Math.abs(main.scrollTop - scrollBefore);
    out.checkboxRechecked = !!table.querySelector(
      `[data-row-id="${rowId}"] .bo-data-table__row-select`,
    )?.checked;
    out.countAtEnd = document.querySelector('.bo-data-table__selection-count')?.textContent;
    const mid = [...table.querySelectorAll('tbody[data-chunk-offset]')].find(
      (t) => t.dataset.evicted !== 'true' && Number(t.dataset.chunkOffset) > 0,
    );
    out.midRowIndexOk =
      Number(mid?.querySelector('tr')?.getAttribute('aria-rowindex')) ===
      Number(mid?.dataset.chunkOffset) + 2;
    return out;
  });
  check(
    'windowed list: deep scroll evicts to height-true spacers and keeps the DOM bounded',
    win.chunk0Evicted && win.spacerMatchesReal && win.renderedBounded && win.rowcount === '50001',
    JSON.stringify(win),
  );
  check(
    'windowed list: scrolling back re-loads the chunk with NO scroll jump and NO lost selection',
    win.chunk0Reloaded && win.anchorShift >= 0 && win.anchorShift <= 2 && win.scrollShift <= 2 &&
      win.checkboxRechecked && win.hiddenInputSurvives && win.countAtEnd === '1 selected' &&
      win.midRowIndexOk,
    JSON.stringify(win),
  );

  /* ---- accessibility over the app's own routes ---- */
  await page.evaluateOnNewDocument(AXE);
  // escalatedId is deliberately left Pending (never approved above), so the
  // axe sweep keeps scanning a real Pending detail page.
  const ROUTES = ['/', '/pos', '/pos/new', '/import', '/spend', '/receive', `/pos/${escalatedId}`, '/inbox', '/movements'];
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
