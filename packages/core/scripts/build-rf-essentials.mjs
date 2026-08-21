/**
 * `rf-essentials` — a derived, lower-floor build profile of the existing
 * source (roadmap 59.2), not a fork. Same source tree as the main dist, one
 * more build target: the RF-relevant component subset, autoprefixed against
 * Chrome/WebView 108 instead of the main bundle's 119+ (RF Enterprise
 * Browsers — Zebra, Honeywell, Ivanti Velocity — render through the
 * device's Android System WebView; see the floor study,
 * `.roundtable/rf-scanner-floor-study-2026-08-19.md`, and 59.1's published
 * number on /getting-started/installation).
 *
 * Scope: tokens, reset, button, form/*, quantity, badge, alert, data-table,
 * state, kv, primitives/visually-hidden — the subset `/patterns/goods-receipt`
 * and a receiving screen actually compose. Two source-level @supports
 * fallbacks (badge's color-mix() border, kv's subgrid row layout) already
 * degrade this subset cleanly below 108 — this build target inherits them
 * for free rather than duplicating the logic here.
 *
 * visually-hidden was missing from the first version of this list — found
 * building 59.4's actual RF demo page, whose scan-status live region (the
 * same markup `/patterns/goods-receipt` itself ships) uses
 * `.bo-visually-hidden` and silently rendered it AS a visible paragraph
 * without this. A profile is only as complete as something real that
 * exercises it.
 *
 * Verification is 59.3's job (a floor-verification gate reusing
 * derive-floor.mjs's technique in reverse) — this script only builds.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import postcssImport from 'postcss-import';
import postcssNesting from 'postcss-nesting';
import postcssCustomMedia from 'postcss-custom-media';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcCss = join(pkgRoot, 'src/css');
const outCss = join(pkgRoot, 'dist/css');

// The RF floor, not the main bundle's floor — the whole point of a
// SEPARATE build target. and_chr tracks WebView's version directly.
const RF_TARGET = ['chrome >= 108', 'and_chr >= 108'];
import { RF_COMPONENTS } from './rf-components.mjs';

const rfAutoprefixer = autoprefixer({ overrideBrowserslist: RF_TARGET });

const base = [postcssImport(), postcssNesting(), postcssCustomMedia(), rfAutoprefixer];
const pipeline = postcss(base);
const pipelineMin = postcss([...base, cssnano({ preset: 'default' })]);



const layers = `@import "${srcCss}/layers.css";\n`;
const imports = [
  `@import "${srcCss}/tokens/index.css";`,
  `@import "${srcCss}/reset/index.css";`,
  `@import "${srcCss}/primitives/visually-hidden.css";`,
  ...RF_COMPONENTS.map((c) => `@import "${srcCss}/components/${c}.css";`),
];
const entrySource = layers + imports.join('\n') + '\n';
const from = join(srcCss, 'index.css');
const to = join(outCss, 'rf-essentials.css');

console.log(`Building rf-essentials.css (target: ${RF_TARGET.join(', ')})…`);

const [pretty, min] = await Promise.all([
  pipeline.process(entrySource, { from, to }),
  pipelineMin.process(entrySource, { from, to: to.replace(/\.css$/, '.min.css') }),
]);

await mkdir(dirname(to), { recursive: true });
await writeFile(to, pretty.css);
await writeFile(to.replace(/\.css$/, '.min.css'), min.css);

console.log(
  `  ${to.replace(pkgRoot + '/', '')} (${(pretty.css.length / 1024).toFixed(1)} kB / min ${(min.css.length / 1024).toFixed(1)} kB)`,
);
console.log(`  components: ${RF_COMPONENTS.length} (${RF_COMPONENTS.join(', ')})`);
console.log('rf-essentials build complete.');
