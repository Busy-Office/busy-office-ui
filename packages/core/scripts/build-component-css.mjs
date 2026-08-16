/**
 * Builds the dist CSS:
 *  - dist/css/index.css + index.min.css        (full bundle, tokens once)
 *  - dist/css/{tokens,reset,primitives}.css    (+ .min) — one layer each
 *  - dist/css/components/<name>.css            (+ .min) — component layer only
 *  - dist/css/htmx.css                         (+ .min)
 *  - dist/css/motion.css                       (+ .min)
 *
 * À-la-carte files deliberately do NOT embed the token layer (that cost more
 * than the full bundle after ~3 imports). Import order contract, documented
 * on the docs homepage:
 *   tokens → reset → [primitives] → components...
 * Every file re-declares the @layer order statement (idempotent no-op), so
 * any import order still yields the same cascade.
 */
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
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

const base = [postcssImport(), postcssNesting(), postcssCustomMedia(), autoprefixer()];
const pipeline = postcss(base);
const pipelineMin = postcss([...base, cssnano({ preset: 'default' })]);

// Build rule (slice-3 grill): every @container query must be NAMED — bare
// queries resolve against surprise ancestor containers (or the viewport)
// and have caused the only bug class to recur across reviews.
function assertNamedContainers(css, file) {
  const bare = css.match(/@container\s*\(/);
  if (bare) {
    throw new Error(
      `Unnamed @container query in ${file} — name the container (build rule, see .roundtable/grill-2026-08-12-slice3.md)`,
    );
  }
}

async function build(entrySource, from, to) {
  const [pretty, min] = await Promise.all([
    pipeline.process(entrySource, { from, to }),
    pipelineMin.process(entrySource, { from, to: to.replace(/\.css$/, '.min.css') }),
  ]);
  assertNamedContainers(pretty.css, to);
  await mkdir(dirname(to), { recursive: true });
  await writeFile(to, pretty.css);
  await writeFile(to.replace(/\.css$/, '.min.css'), min.css);
  console.log(
    `  ${to.replace(pkgRoot + '/', '')} (${(pretty.css.length / 1024).toFixed(1)} kB / min ${(min.css.length / 1024).toFixed(1)} kB)`,
  );
}

const layers = `@import "${srcCss}/layers.css";\n`;
const from = join(srcCss, 'index.css');

console.log('Building CSS dist…');

// 1. Full bundle
const indexSource = await readFile(join(srcCss, 'index.css'), 'utf8');
await build(indexSource, from, join(outCss, 'index.css'));

// 2. Foundation standalone files — each carries the layer statement + its own
//    layer only. tokens.css is the one consumers must import first.
await build(`${layers}@import "${srcCss}/tokens/index.css";\n`, from, join(outCss, 'tokens.css'));
await build(`${layers}@import "${srcCss}/reset/index.css";\n`, from, join(outCss, 'reset.css'));
await build(`${layers}@import "${srcCss}/primitives/index.css";\n`, from, join(outCss, 'primitives.css'));

// 3. Per-component standalone files (skip slice-2 stubs with no rules)
const componentsDir = join(srcCss, 'components');
for (const dir of (await readdir(componentsDir, { withFileTypes: true })).filter((d) => d.isDirectory())) {
  const files = (await readdir(join(componentsDir, dir.name))).filter((f) => f.endsWith('.css'));
  const imports = [];
  for (const f of files) {
    const content = await readFile(join(componentsDir, dir.name, f), 'utf8');
    if (content.includes('@layer')) imports.push(`@import "${join(componentsDir, dir.name, f)}";`);
  }
  if (!imports.length) continue;
  await build(layers + imports.join('\n') + '\n', from, join(outCss, 'components', `${dir.name}.css`));
}

// 4. HTMX integration
await build(`${layers}@import "${srcCss}/integrations/htmx.css";\n`, from, join(outCss, 'htmx.css'));

// 5. Motion module (opt-in)
await build(`${layers}@import "${srcCss}/motion/motion.css";\n`, from, join(outCss, 'motion.css'));
await build(`@import "${srcCss}/scales/extended.css";\n`, from, join(outCss, 'scales.css'));

// 6. Brand presets (opt-in, one file per preset) — deliberately UNLAYERED
// content (no @layer wrapper in the source), so it wins the cascade
// contract over layered component styles per /concepts/theming.
for (const f of await readdir(join(srcCss, 'brand')).catch(() => [])) {
  if (!f.endsWith('.css')) continue;
  await build(`${layers}@import "${srcCss}/brand/${f}";\n`, from, join(outCss, f));
}

console.log('CSS dist complete.');
