/**
 * Computes WCAG contrast ratios for the framework's documented token-role
 * pairs, in BOTH themes, from the actual token values — and fails the build
 * if a pair drops below its threshold. The docs Colors page renders its
 * ratio tables FROM dist/contrast.json, so published ratios cannot drift
 * (site-proposal grill F3: never hand-typed accessibility claims).
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const css = await readFile(join(pkgRoot, 'src/css/tokens/color.css'), 'utf8');

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
function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(fg, bg) {
  const [l1, l2] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (l1 + 0.05) / (l2 + 0.05);
}

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
  ['--bo-color-accent-text', '--bo-color-accent-subtle', 4.5],
  ['--bo-color-danger-text', '--bo-color-danger-subtle', 4.5],
  ['--bo-color-warning-text', '--bo-color-warning-subtle', 4.5],
  ['--bo-color-success-text', '--bo-color-success-subtle', 4.5],
  ['--bo-color-accent', '--bo-color-bg-surface', 4.5], // links
  ['--bo-color-border-control', '--bo-color-bg-surface', 3],
  ['--bo-color-focus-ring', '--bo-color-bg-canvas', 3],
];

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

await mkdir(join(pkgRoot, 'dist'), { recursive: true });
await writeFile(join(pkgRoot, 'dist/contrast.json'), JSON.stringify(report, null, 2));

if (failures) {
  console.error(`\ncontrast check FAILED: ${failures} pair(s) below threshold`);
  process.exit(1);
}
console.log('contrast check passed — dist/contrast.json written');
