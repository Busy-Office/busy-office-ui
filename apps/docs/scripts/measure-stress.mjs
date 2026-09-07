/**
 * Re-measure the `/stress` numbers `/components/data-table` publishes.
 *
 * NOT a gate — nothing in CI runs this, and it asserts no budget. It is the
 * missing half of the stress harness (roadmap 309.5): the rows were kept, the
 * measurement was not, so both re-runs to date had to invent a method and their
 * numbers cannot be compared to each other or to the published table.
 *
 *   npm run measure:stress -w docs
 *   npm run measure:stress -w docs -- --rows 1000,5000,20000 --repeat 7
 *   npm run measure:stress -w docs -- --rows 5000 --throttle 4
 *   npm run measure:stress -w docs -- --json > run.json
 *
 * That command works **from a clean clone**, which is the other half of 309.5.
 * Slice 307 recorded its re-run as `node examples/po-app/server.mjs`; that
 * exits MODULE_NOT_FOUND on a fresh checkout, because `examples/po-app` is not
 * a workspace and nothing installs its dependencies until the tarball install
 * in `po-app-harness.mjs` runs. This drives that harness, so there is no
 * precondition to remember. (`--no-install` skips it for a fast re-run once
 * `examples/po-app/node_modules` exists.)
 *
 * ## Three things this deliberately does, each because a previous run did not
 *
 * **1. It carries its own control, and exits non-zero when the control fails.**
 * Slice 307 published select-all at 3 ms / 1k and 7 ms / 5k and concluded "not
 * slower". It was timing a select-all that selected nothing: a trailing comment
 * had swallowed `initDataTables()` in the reference app's shared template from
 * 2026-08-23 to 2026-09-07, so the header checkbox toggled itself and no row
 * followed. A plausible millisecond with no control beside it is unfalsifiable
 * — it looks identical whether the work happened or not. So every row here
 * reports `rows` (checkboxes rendered) and `checked` (checkboxes actually
 * checked afterwards), and a run where those disagree, or where either is
 * zero, FAILS rather than printing a number.
 *
 * **2. It says where the style flush is.** The published table scores the
 * "post-bulk-check style flush" as its own column, and Slice 309 recorded two
 * fixed-tree readings that could not be compared to it because they had the
 * flush folded in. `update()` in `data-table.ts` only writes to the DOM — it
 * reads no geometry — so the selected-row tint recalculation happens at the
 * next paint, BESIDE the select-all number rather than inside it. This probe
 * measures the two separately and labels which is which, so a later reading is
 * comparable by construction instead of by luck.
 *
 * **3. It records the machine.** `/components/data-table` says outright that
 * its own figures are one machine's milliseconds and the machine is not
 * recorded. Every run here prints CPU model, core count, memory, platform,
 * Node and Chrome versions, and the CPU throttle factor, so the figure it
 * produces does not repeat that.
 *
 * Timings are medians over `--repeat` runs, with min/max beside them. A single
 * sample is not a reading: `LOOPS.md` rule 5 already records this project
 * declaring a CI regression on one 290 s sample that the next two runs (267 s,
 * 265 s) refuted.
 *
 * ## How each number is defined (so two runs mean the same thing)
 *
 *   render-dcl    domContentLoadedEventEnd - responseEnd. Parse and DOM
 *                 construction for N rows. Server and network excluded, so
 *                 this is the client cost the table is about.
 *   render-load   loadEventEnd - responseEnd. The same window through load.
 *   select-all    The full synchronous `change` dispatch: bracketed by a
 *                 capture-phase listener on `document` (before the container's
 *                 delegated handler) and a bubble-phase listener on `window`
 *                 (after it). Style/layout NOT included — see 2 above.
 *   style-flush   A forced style+layout read (`documentElement.offsetHeight`)
 *                 taken at the END of that dispatch, in the same task, so it
 *                 is the first flush that pays for the mutation.
 *
 * **`render-dcl` and `render-load` are comparable across runs of THIS probe
 * and NOT to the 2026-08-15 "Initial render" column**, which is said plainly
 * rather than glossed: that column's method was never recorded, and these two
 * windows include the reference app's own subresources (htmx is a deferred
 * script inside them). Comparing them to it would repeat the error Slice 309
 * corrected — publishing a number whose definition nobody can check.
 *
 * The `change` event is what is bracketed, not `click`: `data-table.ts` binds
 * `change` on the container, and for a checkbox the activation behaviour fires
 * `change` after the `click` dispatch has already finished. The click itself is
 * driven with `page.click` — a trusted dispatch — per ENVIRONMENT.md's rule
 * about `el.click()` and listener ordering.
 */
import { cpus, totalmem, platform, arch, release } from 'node:os';
import { launchDocsBrowser } from './browser-harness.mjs';
import { startPoApp } from './po-app-harness.mjs';
import { DESKTOP_WIDTH } from './viewports.mjs';

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : argv[i + 1];
};
const has = (name) => argv.includes(`--${name}`);

/* Every numeric flag is validated rather than coerced. `--repeat` with no value
   coerces to NaN, `i < NaN` is false, and the run then prints an empty table
   with no control failures and exit 0 — a silently-wrong reading, which is the
   one output this probe exists to make impossible. */
const num = (name, fallback) => {
  if (!argv.includes(`--${name}`)) return fallback;
  const raw = flag(name, undefined);
  if (raw === undefined || String(raw).startsWith('--')) {
    console.error(`measure-stress: --${name} was given with no value`);
    process.exit(2);
  }
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) {
    console.error(`measure-stress: --${name} needs a positive number, got ${JSON.stringify(raw)}`);
    process.exit(2);
  }
  return n;
};

const rowsRaw = String(flag('rows', '1000,5000')).split(',').map((s) => s.trim());
const ROWS = rowsRaw.map(Number);
const REPEAT = Math.round(num('repeat', 5));
const THROTTLE = num('throttle', 1);
const AS_JSON = has('json');
const WIDTH = Math.round(num('width', DESKTOP_WIDTH));

if (!ROWS.length || ROWS.some((n) => !Number.isFinite(n) || n <= 0)) {
  console.error(`measure-stress: --rows must be positive row counts, got ${JSON.stringify(rowsRaw)}`);
  process.exit(2);
}

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const round = (n) => Math.round(n * 10) / 10;
const stat = (xs) => ({ median: round(median(xs)), min: round(Math.min(...xs)), max: round(Math.max(...xs)) });

const machine = {
  cpu: cpus()[0]?.model?.replace(/\s+/g, ' ').trim() ?? 'unknown',
  cores: cpus().length,
  memoryGB: round(totalmem() / 1024 ** 3),
  platform: `${platform()} ${arch()} ${release()}`,
  node: process.version,
  cpuThrottle: THROTTLE,
  viewportWidth: WIDTH,
  takenAt: new Date().toISOString(),
};

const { base, stop } = await startPoApp({ install: !has('no-install') });
const browser = await launchDocsBrowser();
machine.chrome = await browser.version();

const results = [];
const controlFailures = [];

try {
  for (const n of ROWS) {
    const samples = { dcl: [], load: [], selectAll: [], flush: [] };
    let lastControl = null;

    for (let i = 0; i < REPEAT; i++) {
      const page = await browser.newPage();
      await page.setViewport({ width: WIDTH, height: 900 });
      if (THROTTLE > 1) await page.emulateCPUThrottling(THROTTLE);

      await page.goto(`${base}/stress?n=${n}`, { waitUntil: 'load', timeout: 120000 });

      const nav = await page.evaluate(() => {
        const t = performance.getEntriesByType('navigation')[0];
        return { responseEnd: t.responseEnd, dcl: t.domContentLoadedEventEnd, load: t.loadEventEnd };
      });

      /* The control's BEFORE half. A zero here means the route rendered no row
         checkboxes at all, which is a different failure from "the behaviour did
         not run" and is worth telling apart. */
      const boxesBefore = await page.$$eval('.bo-data-table__row-select', (e) => e.length);

      await page.evaluate(() => {
        window.__stressProbe = {};
        document.addEventListener(
          'change',
          () => { window.__stressProbe.t0 = performance.now(); },
          { capture: true, once: true },
        );
        window.addEventListener(
          'change',
          () => {
            /* Bubble phase on `window` runs after the container's delegated
               handler, so this is the end of the synchronous dispatch. The
               forced read happens HERE, in the same task, and not in a
               setTimeout: the event loop takes a rendering opportunity between
               tasks, so a flush measured from a later task finds the style
               recalculation already paid and reports ~0 at every row count.
               It did — 0.0/0.1/0.0 ms at 1k/5k/20k, an identical value across
               inputs that differ 20-fold, which is the tell. */
            const t1 = performance.now();
            window.__stressProbe.t1 = t1;
            void document.documentElement.offsetHeight;
            window.__stressProbe.flush = performance.now() - t1;
          },
          { once: true },
        );
      });

      await page.click('.bo-data-table__select-all');
      await page.waitForFunction(() => window.__stressProbe?.flush !== undefined, {
        timeout: 60000,
        polling: 'raf',
      });

      const probe = await page.evaluate(() => ({
        t0: window.__stressProbe.t0,
        t1: window.__stressProbe.t1,
        flush: window.__stressProbe.flush,
        checked: document.querySelectorAll('.bo-data-table__row-select:checked').length,
        countText: document.querySelector('.bo-data-table__selection-count')?.textContent?.trim() ?? '',
      }));
      await page.close();

      const control = {
        rows: boxesBefore,
        checked: probe.checked,
        countText: probe.countText,
        ok: boxesBefore === n && probe.checked === boxesBefore && boxesBefore > 0,
      };
      lastControl = control;
      if (!control.ok) {
        controlFailures.push(`n=${n} run ${i + 1}: ${JSON.stringify({ expected: n, ...control })}`);
        continue;
      }

      samples.dcl.push(nav.dcl - nav.responseEnd);
      samples.load.push(nav.load - nav.responseEnd);
      samples.selectAll.push(probe.t1 - probe.t0);
      samples.flush.push(probe.flush);
    }

    results.push({
      rows: n,
      runs: samples.selectAll.length,
      control: lastControl,
      renderDcl: samples.dcl.length ? stat(samples.dcl) : null,
      renderLoad: samples.load.length ? stat(samples.load) : null,
      selectAll: samples.selectAll.length ? stat(samples.selectAll) : null,
      styleFlush: samples.flush.length ? stat(samples.flush) : null,
    });
  }
} finally {
  await browser.close();
  stop();
}

const payload = { machine, repeat: REPEAT, results, controlFailures };

if (AS_JSON) {
  console.log(JSON.stringify(payload, null, 2));
} else {
  console.log('\n/stress re-measurement — medians over %d run(s) per row count\n', REPEAT);
  console.log('machine (recorded because a millisecond without one is not reproducible):');
  for (const [k, v] of Object.entries(machine)) console.log(`  ${k.padEnd(15)} ${v}`);
  console.log('');
  const head = ['rows', 'control', 'render-dcl', 'render-load', 'select-all', 'style-flush'];
  console.log(head.map((h, i) => h.padEnd(i === 1 ? 22 : 14)).join(''));
  for (const r of results) {
    const cell = (s) => (s ? `${s.median} ms` : '—');
    const ctl = r.control ? `${r.control.checked}/${r.control.rows} checked` : '—';
    console.log(
      String(r.rows).padEnd(14) +
        ctl.padEnd(22) +
        cell(r.renderDcl).padEnd(14) +
        cell(r.renderLoad).padEnd(14) +
        cell(r.selectAll).padEnd(14) +
        cell(r.styleFlush).padEnd(14),
    );
  }
  console.log('\n  select-all  = the synchronous `change` dispatch only; the style flush is NOT in it.');
  console.log('  style-flush = the first forced style+layout after that dispatch, i.e. what the');
  console.log('                selected-row tint costs. Reported BESIDE select-all, never folded in.');
  for (const r of results) {
    if (!r.selectAll) continue;
    console.log(
      `\n  n=${r.rows} spread — select-all ${r.selectAll.min}–${r.selectAll.max} ms, ` +
        `style-flush ${r.styleFlush.min}–${r.styleFlush.max} ms over ${r.runs} run(s)`,
    );
  }
}

if (controlFailures.length) {
  console.error(
    `\nmeasure-stress FAILED its own control on ${controlFailures.length} run(s) — ` +
      'the select-all did not select the rows, so no timing here is evidence of anything:',
  );
  for (const f of controlFailures) console.error(`  ${f}`);
  process.exit(1);
}
console.log('');
