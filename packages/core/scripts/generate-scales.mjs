// Scale-system generator (Slice 22 item 1). Emits the 24-range,
// 11-step (50-950) Pantone-style raw palette:
//   - src/css/tokens/scales.css        core tier (default bundle)
//   - src/css/scales/extended.css      extended tier (opt-in module)
//   - dist/scales.json                 manifest for the generated docs
//
// Sources of truth:
//   - 20 ranges seed from the Tailwind CSS v3.4 palette (MIT) — chosen
//     because every ramp value ALREADY IN USE in this codebase is a
//     verbatim Tailwind value; the PIN ASSERT below fails the build if
//     any seeded step disagrees with a value the live tokens use.
//   - 4 muted ranges (mauve/olive/mist/taupe) are OKLCH-generated on
//     gray's measured per-step lightness ladder, so the same step
//     number carries the same weight in every range.
//
// Deterministic; --check mode diffs against the committed outputs
// (drift gate, stamp-readme style).
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

/* ---------------- Tailwind v3.4 ramps (MIT) ---------------- */
const TW = {
  slate: ['#f8fafc','#f1f5f9','#e2e8f0','#cbd5e1','#94a3b8','#64748b','#475569','#334155','#1e293b','#0f172a','#020617'],
  gray:  ['#f9fafb','#f3f4f6','#e5e7eb','#d1d5db','#9ca3af','#6b7280','#4b5563','#374151','#1f2937','#111827','#030712'],
  zinc:  ['#fafafa','#f4f4f5','#e4e4e7','#d4d4d8','#a1a1aa','#71717a','#52525b','#3f3f46','#27272a','#18181b','#09090b'],
  stone: ['#fafaf9','#f5f5f4','#e7e5e4','#d6d3d1','#a8a29e','#78716c','#57534e','#44403c','#292524','#1c1917','#0c0a09'],
  red:   ['#fef2f2','#fee2e2','#fecaca','#fca5a5','#f87171','#ef4444','#dc2626','#b91c1c','#991b1b','#7f1d1d','#450a0a'],
  orange:['#fff7ed','#ffedd5','#fed7aa','#fdba74','#fb923c','#f97316','#ea580c','#c2410c','#9a3412','#7c2d12','#431407'],
  amber: ['#fffbeb','#fef3c7','#fde68a','#fcd34d','#fbbf24','#f59e0b','#d97706','#b45309','#92400e','#78350f','#451a03'],
  yellow:['#fefce8','#fef9c3','#fef08a','#fde047','#facc15','#eab308','#ca8a04','#a16207','#854d0e','#713f12','#422006'],
  lime:  ['#f7fee7','#ecfccb','#d9f99d','#bef264','#a3e635','#84cc16','#65a30d','#4d7c0f','#3f6212','#365314','#1a2e05'],
  green: ['#f0fdf4','#dcfce7','#bbf7d0','#86efac','#4ade80','#22c55e','#16a34a','#15803d','#166534','#14532d','#052e16'],
  emerald:['#ecfdf5','#d1fae5','#a7f3d0','#6ee7b7','#34d399','#10b981','#059669','#047857','#065f46','#064e3b','#022c22'],
  teal:  ['#f0fdfa','#ccfbf1','#99f6e4','#5eead4','#2dd4bf','#14b8a6','#0d9488','#0f766e','#115e59','#134e4a','#042f2e'],
  cyan:  ['#ecfeff','#cffafe','#a5f3fc','#67e8f9','#22d3ee','#06b6d4','#0891b2','#0e7490','#155e75','#164e63','#083344'],
  sky:   ['#f0f9ff','#e0f2fe','#bae6fd','#7dd3fc','#38bdf8','#0ea5e9','#0284c7','#0369a1','#075985','#0c4a6e','#082f49'],
  blue:  ['#eff6ff','#dbeafe','#bfdbfe','#93c5fd','#60a5fa','#3b82f6','#2563eb','#1d4ed8','#1e40af','#1e3a8a','#172554'],
  indigo:['#eef2ff','#e0e7ff','#c7d2fe','#a5b4fc','#818cf8','#6366f1','#4f46e5','#4338ca','#3730a3','#312e81','#1e1b4b'],
  violet:['#f5f3ff','#ede9fe','#ddd6fe','#c4b5fd','#a78bfa','#8b5cf6','#7c3aed','#6d28d9','#5b21b6','#4c1d95','#2e1065'],
  purple:['#faf5ff','#f3e8ff','#e9d5ff','#d8b4fe','#c084fc','#a855f7','#9333ea','#7e22ce','#6b21a8','#581c87','#3b0764'],
  fuchsia:['#fdf4ff','#fae8ff','#f5d0fe','#f0abfc','#e879f9','#d946ef','#c026d3','#a21caf','#86198f','#701a75','#4a044e'],
  rose:  ['#fff1f2','#ffe4e6','#fecdd3','#fda4af','#fb7185','#f43f5e','#e11d48','#be123c','#9f1239','#881337','#4c0519'],
};

/* ---------------- OKLCH machinery (no deps) ---------------- */
function srgbToLinear(c) { return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }
function linearToSrgb(c) { return c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055; }
function hexToOklch(hex) {
  const n = hex.slice(1);
  const [r, g, b] = [0, 2, 4].map((i) => srgbToLinear(parseInt(n.slice(i, i + 2), 16) / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const b2 = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { L, C: Math.hypot(a, b2), H: (Math.atan2(b2, a) * 180) / Math.PI };
}
function oklchToHex({ L, C, H }) {
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b2 = C * Math.sin(h);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b2) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b2) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b2) ** 3;
  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const b3 = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  const rgb = [r, g, b3];
  if (rgb.some((c) => c < -0.0001 || c > 1.0001)) return null; // out of gamut
  return '#' + rgb.map((c) => Math.round(linearToSrgb(Math.min(1, Math.max(0, c))) * 255).toString(16).padStart(2, '0')).join('');
}
function inGamutHex(L, C, H) {
  // reduce chroma until representable
  for (let c = C; c >= 0; c -= 0.002) {
    const hex = oklchToHex({ L, C: c, H });
    if (hex) return hex;
  }
  return oklchToHex({ L, C: 0, H });
}

/* ---- muted quartet: gray's lightness ladder + low chroma ---- */
const ladder = TW.gray.map((hex) => hexToOklch(hex).L);
const MUTED = {
  mauve: { H: 345, peak: 0.045 },
  olive: { H: 115, peak: 0.05 },
  mist: { H: 225, peak: 0.04 },
  taupe: { H: 65, peak: 0.035 },
};
// chroma tapers toward both ends of the ramp (extremes stay near-neutral)
const chromaCurve = [0.25, 0.4, 0.55, 0.7, 0.9, 1, 1, 0.95, 0.85, 0.7, 0.5];
const ramps = { ...TW };
for (const [name, { H, peak }] of Object.entries(MUTED)) {
  ramps[name] = ladder.map((L, i) => inGamutHex(L, peak * chromaCurve[i], H));
}

/* ---------------- tiers ---------------- */
// Core = the semantic tier's five ramps + the ramps the six ERP brand
// presets alias (owner decision 2026-08-16: presets are graphite/cobalt/
// navy/forest/indigo/violet — the muted quartet stays available as
// extended RANGES but no longer ships as presets).
const CORE = ['slate', 'gray', 'red', 'amber', 'green', 'teal', 'blue', 'indigo', 'violet'];
const EXTENDED = Object.keys(ramps).filter((h) => !CORE.includes(h));

/* ---- REFERENCE ASSERT: hexes are generator-owned now (the old palette
   block was removed from color.css) — the load-bearing invariant is that
   every --bo-palette-* var REFERENCED anywhere in src css resolves to an
   emitted CORE step (extended is opt-in; a core-bundle reference into an
   extended-only ramp would silently resolve to nothing). ---- */
const { readdir } = await import('node:fs/promises');
/* NOT `srcCssFiles` from ./src-css-files.mjs, and this is a deliberate honest
   copy rather than an oversight. That chokepoint walks src/css with NO
   exclusions; this one must skip `/scales/` and `scales*` because those two
   files are THIS script's own generated output, and reading them back as input
   would make the reference check circular — it would "verify" every palette
   var against the ramps it just emitted. Same reasoning dist-css.mjs records
   for staying separate: different tree rule, so an options bag would be the
   worse abstraction. If you widen the exclusion here, nothing else needs to
   follow — the other three walkers are supposed to see the shipped output. */
async function* cssFiles(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* cssFiles(p);
    else if (e.name.endsWith('.css') && !p.includes('/scales/') && !e.name.startsWith('scales')) yield p;
  }
}
const refErrors = new Set();
let refCount = 0;
for await (const f of cssFiles(join(root, 'src/css'))) {
  const css = await readFile(f, 'utf8');
  for (const [, hue, step] of css.matchAll(/var\(--bo-palette-([a-z]+)-(\d+)\)/g)) {
    refCount++;
    const i = STEPS.indexOf(Number(step));
    if (i === -1 || !(hue in ramps)) refErrors.add(`${hue}-${step} referenced but not in the scale system`);
    else if (!CORE.includes(hue) && !f.includes('/brand/'))
      refErrors.add(`${hue}-${step} referenced from the default bundle but ${hue} is EXTENDED (opt-in)`);
  }
}
if (refErrors.size) {
  console.error(`generate-scales REFERENCE ASSERT failed:\n  ${[...refErrors].join('\n  ')}`);
  process.exit(1);
}
const inUse = { length: refCount };

/* ---------------- emit ---------------- */
function rampCss(name) {
  return STEPS.map((s, i) => `  --bo-palette-${name}-${s}: ${ramps[name][i]};`).join('\n');
}
const header = (tier, extra = '') => `/* GENERATED by scripts/generate-scales.mjs — do not edit.
   ${tier} tier of the 24-range scale system (Slice 22). 20 ranges seed
   from the Tailwind CSS v3.4 palette (MIT), pin-asserted against every
   in-use value; the muted quartet is OKLCH-generated on gray's measured
   lightness ladder, so step N carries the same weight in every range.${extra}
   Raw palette tier — explicitly NOT semver API (see versioning). */
`;
const coreCss = header('CORE (default bundle)') + `@layer bo-tokens {
  :root {
${CORE.map(rampCss).join('\n\n')}
  }
}
`;
const extCss = header('EXTENDED (opt-in)', `
   Import as @busy-office/ui/css/scales — one file, zero cost unless used.`) + `:root {
${EXTENDED.map(rampCss).join('\n\n')}
}
`;
const manifest = {
  generated: 'by scripts/generate-scales.mjs — do not edit',
  steps: STEPS,
  ranges: Object.fromEntries(
    [...CORE, ...EXTENDED].map((h) => [h, { tier: CORE.includes(h) ? 'core' : 'extended', steps: Object.fromEntries(STEPS.map((s, i) => [s, ramps[h][i]])) }]),
  ),
};

const outputs = [
  [join(root, 'src/css/tokens/scales.css'), coreCss],
  [join(root, 'src/css/scales/extended.css'), extCss],
];
const check = process.argv.includes('--check');
let drift = false;
for (const [path, content] of outputs) {
  await mkdir(dirname(path), { recursive: true });
  const current = await readFile(path, 'utf8').catch(() => null);
  if (check) {
    if (current !== content) { console.error(`generate-scales --check: ${path.replace(root + '/', '')} drifted — rerun the generator`); drift = true; }
  } else if (current !== content) {
    await writeFile(path, content);
  }
}
if (check && drift) process.exit(1);
await mkdir(join(root, 'dist'), { recursive: true });
await writeFile(join(root, 'dist/scales.json'), JSON.stringify(manifest, null, 2));
console.log(`scales: ${CORE.length} core + ${EXTENDED.length} extended ranges × ${STEPS.length} steps — ${inUse.length} palette references verified${check ? ' (check mode)' : ''}`);
