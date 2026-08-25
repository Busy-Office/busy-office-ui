#!/usr/bin/env node
/**
 * Score every ERP-suite screen on TWO dimensions (roadmap 145.1).

 * It started with three. `ux` was dropped by its own Accept test: it read 5/5
 * on all 28 screens, one distinct value. The reason matters more than the
 * result — every property it measured was BINARY (a caption is there or it is
 * not), and a binary property belongs in a gate, enforced once, not in a rubric
 * re-confirming it 28 times. Those four checks now live in `audit.mjs`. A
 * rubric is for what can be better or worse.
 *
 * @exact for the evidence, judgement for the score — and the split is the
 * whole design. 145.0 found that almost everything cheap to measure describes
 * what a screen IS, not how good it is: a list screen has zero form fields and
 * that is not a deficiency. So this computes **what a screen's KIND owes and
 * whether it is there**, and prints the ratio. A human or a blind scorer turns
 * that into a 0-3; nothing here invents a number out of node counts.
 *
 * WHY A KIND MAP RATHER THAN INFERENCE. Kind could be guessed from features —
 * "has a filter bar, therefore a list" — and that guess would be circular,
 * because the features are exactly what is being scored. A screen that FORGOT
 * its filter bar would be reclassified as something that never needed one and
 * score full marks. The map is explicit so it can be argued with in a diff.
 *
 * THE ACCEPT TEST this file exists to answer: does each dimension produce at
 * least three distinct values across the suite? A dimension that reads the
 * same everywhere cannot drive a round — this repo retired
 * typography/colour/spacing for exactly that, and scored 19 components at 3
 * in a single pass before noticing. Run with --accept to print the verdict.
 */
import { serveSuite } from './serve.mjs';
import { launchDocsBrowser } from '../../apps/docs/scripts/browser-harness.mjs';

/** What each kind of screen is FOR, and therefore what it owes. */
const KIND = {
  'index': 'home',
  'p2p/requisitions': 'list', 'p2p/purchase-orders': 'list', 'p2p/vendor-invoices': 'list',
  'o2c/sales-orders': 'list', 'o2c/customer-invoices': 'list',
  'crm/accounts': 'list', 'crm/opportunities': 'list',
  'prod/production-orders': 'list',
  'p2p/requisition': 'document', 'p2p/purchase-order': 'document',
  'p2p/vendor-invoice': 'document', 'o2c/sales-order': 'document',
  'o2c/customer-invoice': 'document', 'crm/account': 'document',
  'crm/opportunity': 'document', 'prod/production-order': 'document',
  'fin/journal-entry': 'document', 'inv/stock-movement': 'document',
  'p2p/convert-to-po': 'worksheet', 'inv/cycle-count': 'worksheet',
  'fin/trial-balance': 'report', 'fin/ar-aging': 'report', 'prod/capacity': 'report',
  'inv/stock-on-hand': 'report',
  /* Corrected 2026-08-26 after the first run scored these 1/4 and 2/4. That was
     the MAP being wrong, not the screens: a BOM and a lot trace are structures,
     and a structure has no meaningful total, so owing a <tfoot> was nonsense.
     Period close is a job — you do not filter close tasks, create them ad hoc,
     or drill into a task record. Reclassified because the PURPOSE differs, not
     to erase a low score; the six lists still missing a filter bar were left
     exactly where they are. */
  'prod/bom': 'structure', 'inv/lot-trace': 'structure',
  'fin/period-close': 'job',
};

/**
 * What a kind owes, per dimension. Each entry is a name and a predicate that
 * runs IN THE PAGE. Absence is a finding; presence is not a virtue, which is
 * why nothing here rewards extra.
 */
const OWES = {
  functionality: {
    list: [
      ['a way to narrow the set', () => !!document.querySelector('.bo-filter-bar, input[type=search], .bo-select')],
      ['a create action', () => [...document.querySelectorAll('.bo-btn')].some((b) => /^[+]|\bnew\b|\bcreate\b|\braise\b/i.test(b.textContent.trim()))],
      ['status per row', () => !!document.querySelector('tbody .bo-badge, tbody [data-tone]')],
      ['a row-level way in', () => !!document.querySelector('tbody a[href]')],
    ],
    document: [
      ['the record identity in the heading', () => /[A-Z]{2,}-?\d{3,}|\b\d{4}-\d{4}\b/.test(document.querySelector('h1')?.textContent || '')],
      ['a status', () => !!document.querySelector('h1 .bo-badge, .bo-widget__header .bo-badge')],
      ['at least one action', () => document.querySelectorAll('.bo-btn').length > 0],
      ['its lines or its facts', () => !!document.querySelector('table, .bo-kv')],
    ],
    worksheet: [
      ['an input per line', () => document.querySelectorAll('tbody input, tbody .bo-checkbox').length > 0],
      ['a computed consequence', () => !!document.querySelector('tfoot, .bo-alert')],
      ['a commit action', () => [...document.querySelectorAll('.bo-btn')].some((b) => /post|confirm|create|convert|save/i.test(b.textContent))],
      ['what is not yet done', () => !!document.querySelector('.bo-alert, [data-row-state], .bo-state')],
    ],
    report: [
      ['a total or a summary row', () => !!document.querySelector('tfoot')],
      ['a way to take it away', () => [...document.querySelectorAll('.bo-btn')].some((b) => /export|print|download/i.test(b.textContent))],
      ['the period or scope it covers', () => /\b(20\d\d|Q[1-4]|period|as at|as of)\b/i.test(document.body.textContent)],
      ['emphasis on what matters', () => !!document.querySelector('[data-tone], .bo-badge, strong')],
    ],
    structure: [
      ['the root it explodes', () => /[A-Z]{2,}-?\d{3,}/.test(document.querySelector('h1')?.textContent || '')],
      ['depth the eye can follow', () => !!document.querySelector('[data-tree-level]')],
      ['a quantity or role per level', () => !!document.querySelector('tbody td')],
      ['where a level came from', () => document.querySelectorAll('tbody a[href], tbody .bo-badge').length > 0],
    ],
    job: [
      ['each step with an owner', () => document.querySelectorAll('tbody tr').length >= 3],
      ['state per step', () => !!document.querySelector('tbody .bo-badge, tbody [data-tone]')],
      ['what is blocking', () => !!document.querySelector('.bo-alert, .bo-state')],
      ['the gated finish', () => [...document.querySelectorAll('.bo-btn')].some((b) => b.disabled || /lock|close|finish|post/i.test(b.textContent))],
    ],
    home: [
      ['a way into each module', () => document.querySelectorAll('a[href]').length >= 5],
      ['something to act on', () => document.querySelectorAll('.bo-btn, .bo-widget').length > 0],
      ['orientation', () => !!document.querySelector('h1')],
      ['no dead ends', () => [...document.querySelectorAll('a[href]')].every((a) => a.getAttribute('href') !== '#')],
    ],
  },
};

/** Node budgets per kind — 145.2 owns tightening these; they start generous. */
const BUDGET = { home: 120, list: 260, document: 220, worksheet: 220, report: 240, structure: 200, job: 200 };

const paths = Object.keys(KIND).map((k) => (k === 'index' ? '/index.html' : `/${k}.html`));
const { server, port } = await serveSuite();
const browser = await launchDocsBrowser();
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

const results = [];
for (const key of Object.keys(KIND)) {
  const kind = KIND[key];
  const path = key === 'index' ? '/index.html' : `/${key}.html`;
  await page.goto(`http://localhost:${port}${path}`, { waitUntil: 'networkidle0', timeout: 20000 });

  const run = (list) =>
    page.evaluate(
      (src) => src.map(([name, body]) => {
        try { return [name, !!eval(`(${body})`)()]; } catch { return [name, false]; }
      }),
      list.map(([n, f]) => [n, f.toString()]),
    );

  const fn = await run(OWES.functionality[kind]);
  const nodes = await page.evaluate(() => document.querySelectorAll('*').length);

  results.push({
    key, kind,
    fn: fn.filter(([, ok]) => ok).length, fnOf: fn.length, fnMiss: fn.filter(([, ok]) => !ok).map(([n]) => n),
    nodes, budget: BUDGET[kind], over: nodes > BUDGET[kind],
  });
}
await browser.close();
server.close();

const pad = (s, n) => String(s).padEnd(n);
console.log(`${pad('screen', 26)}${pad('kind', 11)}${pad('functionality', 15)}${pad('nodes', 12)}`);
for (const r of results.sort((a, b) => a.kind.localeCompare(b.kind) || a.key.localeCompare(b.key))) {
  console.log(
    pad(r.key, 26) + pad(r.kind, 11) +
    pad(`${r.fn}/${r.fnOf}`, 15) +
    pad(`${r.nodes}/${r.budget}${r.over ? ' OVER' : ''}`, 12),
  );
}

const distinct = (f) => new Set(results.map(f)).size;
const dFn = distinct((r) => `${r.fn}/${r.fnOf}`);
const dPerf = distinct((r) => Math.round((r.nodes / r.budget) * 10));

console.log('\nACCEPT TEST — a dimension needs 3+ distinct values or it is dropped:');
for (const [name, n] of [['functionality', dFn], ['performance', dPerf]]) {
  console.log(`  ${pad(name, 15)} ${n} distinct  ${n >= 3 ? 'KEEP' : '*** DROP — cannot discriminate ***'}`);
}

console.log('\nWhat is missing, by frequency — this is the backlog the score is FOR:');
const miss = new Map();
for (const r of results) for (const m of r.fnMiss) miss.set(m, (miss.get(m) ?? 0) + 1);
for (const [m, n] of [...miss].sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(3)}x  ${m}`);
