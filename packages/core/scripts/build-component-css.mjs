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

/* COMMENTS ARE A SOURCE PRACTICE, NOT PAYLOAD (roadmap 374.5). This repo
   writes the reasoning next to the rule, and `src/css` keeps every word of it —
   that doctrine is untouched. What changed is that the reasoning was also being
   SHIPPED: `./css`, the default export, is the unminified bundle, so every
   consumer downloaded it.

   Measured 2026-09-23 before the change: index.css was 99.5 kB gz against
   index.min.css at 15.4. Stripping comments alone takes it to 17.1 — so
   comments were **80.5 kB gz, 98% of the gap**, and minification only 1.6.
   A consumer on the default export was paying 6.4x for prose they cannot see.

   Stripped from dist rather than pointing `./css` at the minified file: the
   path keeps resolving to readable, formatted CSS that someone can open in
   devtools and diff, which is most of why a non-minified build is exported at
   all. Nothing reads comments out of `dist` — `extract-api.mjs` takes the
   `@tagline`/`@category` headers from `src/css`, which this does not touch.

   NOT a blanket strip, and the first attempt at one was wrong. A bang comment
   is the CSS convention for "preserve this", and some comments in `dist` are
   USER-FACING CONTRACT rather than internal reasoning: icon.css's four
   DEPRECATED blocks tell a consumer reading the shipped file which glyph to
   stop using, and `check:deprecated-icons` reads them back out of the shipped
   artifact on purpose. A blanket strip removed them and that gate correctly
   refused to report a pass it had not earned. So: ordinary comments go, bang
   comments stay, and anything that must survive into dist says so with a
   bang. */
const BANNER = '/*! @busy-office/ui — generated; reasoning lives in src/css, not here. */\n';
function stripComments(root) {
  root.walkComments((c) => { if (!c.text.startsWith('!')) c.remove(); });
}

async function build(entrySource, from, to) {
  const [pretty, min] = await Promise.all([
    pipeline.process(entrySource, { from, to }),
    pipelineMin.process(entrySource, { from, to: to.replace(/\.css$/, '.min.css') }),
  ]);
  assertNamedContainers(pretty.css, to);
  stripComments(pretty.root);
  const prettyOut = BANNER + pretty.root.toString().replace(/\n{2,}/g, '\n');
  await mkdir(dirname(to), { recursive: true });
  await writeFile(to, prettyOut);
  await writeFile(to.replace(/\.css$/, '.min.css'), min.css);
  console.log(
    `  ${to.replace(pkgRoot + '/', '')} (${(prettyOut.length / 1024).toFixed(1)} kB / min ${(min.css.length / 1024).toFixed(1)} kB)`,
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
