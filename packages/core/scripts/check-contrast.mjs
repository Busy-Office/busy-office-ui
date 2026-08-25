/**
 * Computes WCAG contrast ratios for the framework's documented token-role
 * pairs, in BOTH themes, from the actual token values — and fails the build
 * if a pair drops below its threshold. The docs Colors page renders its
 * ratio tables FROM dist/contrast.json, so published ratios cannot drift
 * (site-proposal grill F3: never hand-typed accessibility claims).
  *
 * @exact — computes contrast ratios. Exempt from --self-test: there is no
 * judgement to get wrong, and ceremony around a lookup is noise.
*/
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { contrastRatio } from './wcag.mjs';

const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
// The raw palette steps live in the generated scales.css since Slice 22;
// color.css holds the semantic tier that aliases them — the scan needs
// BOTH to resolve var chains (reading only color.css silently dropped
// every pair whose token aliases a scale step).
const css =
  (await readFile(join(pkgRoot, 'src/css/tokens/scales.css'), 'utf8')) +
  (await readFile(join(pkgRoot, 'src/css/tokens/color.css'), 'utf8'));

// Parse `--bo-x: value;` declarations per scope (light :root vs dark block).
function parseScope(block) {
  const vars = {};
  for (const m of block.matchAll(/(--bo-[a-z0-9-]+)\s*:\s*([^;]+);/g)) vars[m[1]] = m[2].trim();
  return vars;
}
const darkStart = css.indexOf('[data-theme="dark"]');
const light = parseScope(css.slice(0, darkStart));
const dark = { ...light, ...parseScope(css.slice(darkStart)) };

function resolve(vars, value, depth = 0) {
  if (depth > 10) return null;
  const m = value.match(/^var\(\s*(--bo-[a-z0-9-]+)\s*\)$/);
  if (m) return vars[m[1]] ? resolve(vars, vars[m[1]], depth + 1) : null;
  return value;
}

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
}
/* The arithmetic lives in wcag.mjs — this gate, check-claims and (necessarily,
   from inside a page) check-search all needed it, and one formula stored three
   times is how the source-skip list and the outcome vocabulary drifted before.
   Proved equivalent on five vectors to 1e-12 before merging. */
const ratio = (fgHex, bgHex) => contrastRatio(hexToRgb(fgHex), hexToRgb(bgHex));

// The documented role pairs. threshold: 4.5 text, 3 non-text.
const PAIRS = [
  ['--bo-color-text-primary', '--bo-color-bg-surface', 4.5],
  ['--bo-color-text-primary', '--bo-color-bg-canvas', 4.5],
  ['--bo-color-text-secondary', '--bo-color-bg-surface', 4.5],
  ['--bo-color-text-secondary', '--bo-color-bg-muted', 4.5],
  ['--bo-color-text-muted', '--bo-color-bg-surface', 4.5],
  ['--bo-color-text-muted', '--bo-color-bg-muted', 4.5],
  ['--bo-color-text-inverse', '--bo-color-accent-solid', 4.5],
  ['--bo-color-text-inverse', '--bo-color-danger-solid', 4.5],
  ['--bo-color-bg-surface', '--bo-color-text-primary', 4.5], // inverted type chip

  ['--bo-color-accent-text', '--bo-color-accent-subtle', 4.5],
  ['--bo-color-danger-text', '--bo-color-danger-subtle', 4.5],
  ['--bo-color-warning-text', '--bo-color-warning-subtle', 4.5],
  ['--bo-color-success-text', '--bo-color-success-subtle', 4.5],
  // Amount negative/positive ink sits on plain surfaces (cards, table cells),
  // not just the tinted *-subtle backgrounds — verify it stays readable there.
  ['--bo-color-danger-text', '--bo-color-bg-surface', 4.5],
  ['--bo-color-danger-text', '--bo-color-bg-canvas', 4.5],
  ['--bo-color-success-text', '--bo-color-bg-surface', 4.5],
  ['--bo-color-success-text', '--bo-color-bg-canvas', 4.5],
  ['--bo-color-accent', '--bo-color-bg-surface', 4.5], // links
  ['--bo-color-text-primary', '--bo-color-bg-hover', 4.5], // table hover rows
  ['--bo-color-text-primary', '--bo-color-bg-selected', 4.5], // selected rows
  ['--bo-color-accent-text', '--bo-color-bg-selected', 4.5], // aria-pressed buttons
  ['--bo-color-text-primary', '--bo-color-bg-surface-raised', 4.5], // dialog/menu
  ['--bo-color-text-secondary', '--bo-color-bg-canvas', 4.5], // muted-on-canvas
  ['--bo-color-border-control', '--bo-color-bg-surface', 3],
  // Seamless (WYSIWYG) cells: on a hovered/striped row the revealed
  // border is the ONLY editability affordance (grill 2026-08-16).
  ['--bo-color-border-control', '--bo-color-bg-hover', 3],
  ['--bo-color-border-control', '--bo-color-bg-muted', 3],
  ['--bo-color-focus-ring', '--bo-color-bg-canvas', 3],
  // .bo-progress fill on its track — non-text UI component (WCAG 1.4.11, 3:1)
  ['--bo-color-accent', '--bo-color-bg-muted', 3],
  ['--bo-color-warning-strong', '--bo-color-bg-muted', 3],
  // The external-visibility edge on a composer/entry: a non-text UI indicator
  // (SC 1.4.11) sitting on the surface a thread is drawn on, not on muted.
  ['--bo-color-warning-strong', '--bo-color-bg-surface', 3],
  ['--bo-color-danger', '--bo-color-bg-muted', 3],
  // Slice 20 code-highlighting palette sits on bg-muted — every slot is
  // TEXT, so every pair gates at 4.5 (the pre-existing 3:1 entries for
  // accent/warning-strong/danger on muted were non-text fills).
  ['--bo-color-text-primary', '--bo-color-bg-muted', 4.5],
  ['--bo-color-success-text', '--bo-color-bg-muted', 4.5],
  ['--bo-color-accent', '--bo-color-bg-muted', 4.5],
  ['--bo-color-warning-strong', '--bo-color-bg-muted', 4.5],
  ['--bo-color-danger-text', '--bo-color-bg-muted', 4.5],
];
const PAIR_KEY = (fg, bg) => `${fg}|${bg}`;
const KNOWN = new Set(PAIRS.map(([f, b]) => PAIR_KEY(f, b)));

const report = { generated: 'by scripts/check-contrast.mjs — do not edit', themes: {} };
let failures = 0;

for (const [theme, vars] of [['light', light], ['dark', dark]]) {
  report.themes[theme] = [];
  for (const [fgTok, bgTok, threshold] of PAIRS) {
    const fg = resolve(vars, vars[fgTok] ?? '');
    const bg = resolve(vars, vars[bgTok] ?? '');
    if (!fg?.startsWith('#') || !bg?.startsWith('#')) {
      report.themes[theme].push({ fg: fgTok, bg: bgTok, skipped: `unresolvable (${fg} / ${bg})` });
      continue;
    }
    const r = Math.round(ratio(fg, bg) * 100) / 100;
    const pass = r >= threshold;
    if (!pass) failures++;
    report.themes[theme].push({ fg: fgTok, bg: bgTok, fgValue: fg, bgValue: bg, ratio: r, threshold, pass });
    console.log(`${pass ? '  ok ' : 'FAIL '}[${theme}] ${fgTok} on ${bgTok}: ${r} (>= ${threshold})`);
  }
}

// Brand presets (src/css/brand/*.css) re-skin the accent family via an
// unlayered override — validate each one the SAME way as the base theme:
// merge its declared tokens over the base light/dark vars, then re-run
// every PAIR. A brand file that doesn't touch a given pair just reproduces
// the already-passing base result, so re-checking all of them is cheap and
// correct rather than trying to guess which pairs a given file touches.
report.brands = {};
try {
  const brandDir = join(pkgRoot, 'src/css/brand');
  const brandFiles = (await readdir(brandDir)).filter((f) => f.endsWith('.css'));
  for (const file of brandFiles) {
    const name = file.replace(/\.css$/, '');
    const brandCss = await readFile(join(brandDir, file), 'utf8');
    const brandDarkStart = brandCss.indexOf('[data-theme="dark"]');
    const brandLight = parseScope(brandDarkStart === -1 ? brandCss : brandCss.slice(0, brandDarkStart));
    const brandDark =
      brandDarkStart === -1 ? {} : parseScope(brandCss.slice(brandDarkStart));

    for (const [theme, base, override] of [
      ['light', light, brandLight],
      ['dark', dark, brandDark],
    ]) {
      const vars = { ...base, ...override };
      const key = `${name}-${theme}`;
      report.brands[key] = [];
      for (const [fgTok, bgTok, threshold] of PAIRS) {
        const fg = resolve(vars, vars[fgTok] ?? '');
        const bg = resolve(vars, vars[bgTok] ?? '');
        if (!fg?.startsWith('#') || !bg?.startsWith('#')) continue;
        const r = Math.round(ratio(fg, bg) * 100) / 100;
        const pass = r >= threshold;
        if (!pass) failures++;
        report.brands[key].push({ fg: fgTok, bg: bgTok, fgValue: fg, bgValue: bg, ratio: r, threshold, pass });
        if (!pass) console.log(`FAIL [brand:${key}] ${fgTok} on ${bgTok}: ${r} (>= ${threshold})`);
      }
      console.log(`  ok [brand:${key}] ${report.brands[key].length} pairs checked`);
    }
  }
} catch (e) {
  if (e.code !== 'ENOENT') throw e; // no src/css/brand dir yet is fine
}

// Coverage guard (site-grill S-4): a component that pairs a text token on a
// background token the PAIRS list doesn't cover is a silent contrast gap.
// Scan component + primitive CSS for `color:` and `background*:` token usage
// within the same rule and assert each fg/bg combination is a KNOWN pair.
import { readdir } from 'node:fs/promises';
import postcss from 'postcss';
const IGNORE_BG = new Set([
  '--bo-color-bg-muted', // header cells carry secondary text, covered
]);
async function* cssFiles(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* cssFiles(p);
    else if (e.name.endsWith('.css')) yield p;
  }
}
const uncovered = new Set();
// Row/surface backgrounds are often applied by CUSTOM-PROPERTY INDIRECTION
// (e.g. --bo-cell-bg: var(--bo-color-bg-selected) on a <tr>, text inherited) —
// those pairs never co-occur in one rule, so also require body text (text-
// primary) coverage for any surface token assigned to a *-bg custom property.
const INDIRECT_BG_PROP = /--bo-[a-z-]*(?:cell-)?bg[a-z-]*$/;
for (const dir of ['components', 'primitives']) {
  for await (const f of cssFiles(join(pkgRoot, 'src/css', dir))) {
    const rel = f.replace(pkgRoot + '/', '');
    const root = postcss.parse(await readFile(f, 'utf8'));
    root.walkRules((rule) => {
      let fg, bg;
      rule.walkDecls((d) => {
        const m = d.value.match(/var\((--bo-color-[a-z0-9-]+)/);
        if (!m) return;
        if (d.prop === 'color') fg = m[1];
        else if (/^background/.test(d.prop)) bg = m[1];
        // indirection: a bg-ish custom prop assigned a surface token
        else if (INDIRECT_BG_PROP.test(d.prop) && /bg-/.test(m[1]) && !IGNORE_BG.has(m[1])) {
          if (!KNOWN.has(PAIR_KEY('--bo-color-text-primary', m[1])))
            uncovered.add(`--bo-color-text-primary on ${m[1]} [via ${d.prop}] (${rel})`);
        }
      });
      if (fg && bg && /text|accent|danger|warning|success/.test(fg) && /bg-/.test(bg) && !IGNORE_BG.has(bg)) {
        if (!KNOWN.has(PAIR_KEY(fg, bg))) uncovered.add(`${fg} on ${bg} (${rel})`);
      }
    });
  }
}

await mkdir(join(pkgRoot, 'dist'), { recursive: true });
await writeFile(join(pkgRoot, 'dist/contrast.json'), JSON.stringify(report, null, 2));

if (uncovered.size) {
  console.error(`\ncontrast COVERAGE gap: ${uncovered.size} token pair(s) used in CSS but not in the checked PAIRS list:`);
  for (const u of uncovered) console.error('  ' + u);
  process.exit(1);
}
if (failures) {
  console.error(`\ncontrast check FAILED: ${failures} pair(s) below threshold`);
  process.exit(1);
}
console.log(`contrast check passed — ${PAIRS.length} pairs x 2 themes, coverage verified against component CSS`);
