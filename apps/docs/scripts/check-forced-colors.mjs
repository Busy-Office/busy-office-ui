/**
 * Gate: every @media (forced-colors: active) rule the framework ships is
 * still live, and still does something.
 *
 * /concepts/accessibility promises Windows High Contrast support and now
 * renders the component list from api.json rather than hand-maintaining it
 * (it had drifted to 10 of 15 while claiming to be exhaustive). This gate
 * covers the half a generated list cannot: that each rule's SELECTOR still
 * matches real markup, and that switching forced-colors on actually changes
 * the declared properties.
 *
 * Honest about its own limits: under forced-colors the UA repaints colours
 * everywhere, so a rule that only sets a COLOUR would "differ" even if the
 * rule were deleted. Those are reported as weak rather than proven, and the
 * strong signal is the dead-selector check — which is what catches a rule
 * left behind by a rename or a component split.
 *
 * Cost: one page per rule, loaded twice (control + emulated), pooled. Kept
 * deliberately small because CI budget is tracked (see ROADMAP).
 */
import { readFile, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import { serveDist } from './serve-dist.mjs';
import { launchDocsBrowser } from './browser-harness.mjs';

const docsRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(docsRoot, 'dist');
const coreCss = join(docsRoot, '..', '..', 'packages/core/dist/css/index.css');

/* ---- 1. every forced-colors rule the framework ships ---- */
const rules = [];
postcss.parse(await readFile(coreCss, 'utf8')).walkAtRules('media', (at) => {
  if (!/forced-colors\s*:\s*active/.test(at.params)) return;
  at.walkRules((r) => {
    const props = [];
    r.walkDecls((d) => props.push(d.prop));
    for (const sel of r.selector.split(',').map((s) => s.trim())) rules.push({ sel, props });
  });
});

/* ---- 2. one built page per rule, picked by string-matching its classes ---- */
async function* pages(dir, rel = '') {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (['_astro', 'pagefind', 'v'].includes(e.name)) continue;
      yield* pages(join(dir, e.name), `${rel}/${e.name}`);
    } else if (e.name === 'index.html') yield [`${rel}/`, join(dir, e.name)];
  }
}
const built = [];
for await (const p of pages(dist)) built.push(p);

const CLASS_RE = /\.(bo-[a-z0-9-]+)/g;

// Read each built page once, then pick the first page whose markup mentions
// every class in a rule's selector — good enough to locate a live example,
// and far cheaper than driving a browser over the whole site.
const htmlCache = new Map();
for (const [path, file] of built) htmlCache.set(path, await readFile(file, 'utf8'));

for (const rule of rules) {
  const classes = [...rule.sel.matchAll(CLASS_RE)].map((m) => m[1]);
  // Attribute selectors narrow the candidates far better than a class does
  // — every table page mentions .bo-data-table, but only a handful render a
  // row in the error state.
  const attrs = [...rule.sel.matchAll(/\[([a-z-]+)=["']([^"']+)["']\]/g)].map((m) => `${m[1]}="${m[2]}"`);
  // CANDIDATES, not one guess: a class name appears in prose and code
  // samples as often as in live markup, so the first page that merely
  // mentions it frequently has no element matching the selector. The
  // browser pass below settles it by actually querying.
  rule.attrs = attrs;
  const needles = [...classes, ...attrs];
  rule.candidates = needles.length
    ? [...htmlCache].filter(([, html]) => needles.every((n) => html.includes(n))).map(([path]) => path)
    : [];
  if (!rule.candidates.length && classes.length) {
    rule.candidates = [...htmlCache]
      .filter(([, html]) => classes.every((c) => html.includes(c)))
      .map(([path]) => path);
  }
  rule.page = null;
}

/* ---- 3. control vs emulated ---- */
const { server, port, base } = await serveDist(dist);
const browser = await launchDocsBrowser();

async function measure(forced) {
  const page = await browser.newPage();
  if (forced) {
    const cdp = await page.createCDPSession();
    await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'forced-colors', value: 'active' }] });
  }
  const seen = new Map();
  for (const rule of rules) {
    // On the control pass, walk candidates until one really matches and
    // remember it; the emulated pass reuses that exact page.
    const tryPages = rule.page ? [rule.page] : rule.candidates.slice(0, 20);
    for (const path of tryPages) {
      await page.goto(`http://localhost:${port}${base}${path}`, { waitUntil: 'networkidle0', timeout: 20000 });
      const got = await page.evaluate((sel, props, attrs) => {
        let el = document.querySelector(sel);
        // Runtime-only states never appear in static HTML: data-row-state
        // ="dirty" is set by initRowEdit() when a row has unsaved edits, so
        // no built page can contain one. Synthesise it — the rule targets an
        // attribute the APP sets, and setting it is a faithful stand-in.
        if (!el && attrs.length) {
          const bare = sel.replace(/\[[a-z-]+=["'][^"']+["']\]/g, '');
          const host = document.querySelector(bare.split('>')[0].trim());
          if (host) {
            for (const a of attrs) {
              const [name, value] = a.split('=');
              host.setAttribute(name, value.replace(/"/g, ''));
            }
            el = document.querySelector(sel);
          }
        }
        if (!el) return null;
        const cs = getComputedStyle(el);
        return Object.fromEntries(props.map((p) => [p, cs.getPropertyValue(p)]));
      }, rule.sel, rule.props, rule.attrs ?? []);
      if (got) { rule.page = path; seen.set(rule.sel, got); break; }
    }
  }
  await page.close();
  return seen;
}

const control = await measure(false);
const forced = await measure(true);
await browser.close();
server.close();

const dead = [];
const weak = [];
let proven = 0;
for (const rule of rules) {
  if (!rule.page) { dead.push(`${rule.sel} — no built page has an element matching it`); continue; }
  const a = control.get(rule.sel);
  const b = forced.get(rule.sel);
  if (!a || !b) { dead.push(`${rule.sel} — selector matches nothing on ${rule.page}`); continue; }
  const changed = rule.props.filter((p) => a[p] !== b[p]);
  if (!changed.length) dead.push(`${rule.sel} on ${rule.page} — forced-colors changed none of: ${rule.props.join(', ')}`);
  else if (changed.every((p) => /color|background$|shadow/.test(p))) weak.push(`${rule.sel} (colour-only: ${changed.join(', ')})`);
  else proven++;
}

if (dead.length) {
  console.error(`forced-colors check FAILED (${dead.length}):`);
  for (const d of dead) console.error('  ' + d);
  process.exit(1);
}
console.log(
  `forced-colors check passed — ${rules.length} rule(s) live: ${proven} change a structural property under emulation, ` +
    `${weak.length} are colour-only (the UA repaints those regardless, so they are not independently provable here)`,
);
