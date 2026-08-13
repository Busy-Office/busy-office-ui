#!/usr/bin/env node
/**
 * Scaffolds a new component: the CSS file + its @import, the docs page
 * skeleton + sidebar entry, and (with --behavior) a stub behavior test.
 * Stamps the CLAUDE.md "how to document a component" recipe so a new page
 * starts in the shape check-page-shape.mjs checks for — turning the
 * documented convention into something that can't be gotten wrong.
 */
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const coreRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = join(coreRoot, '..', '..');
const docsRoot = join(repoRoot, 'apps/docs');

const [, , rawName, ...flags] = process.argv;
const behavior = flags.includes('--behavior');
const labelFlag = flags.find((f) => f.startsWith('--label='));

if (!rawName || !/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(rawName)) {
  console.error(
    'Usage: npm run new:component -w @busy-office/ui -- <kebab-case-name> [--behavior] [--label="Human Label"]',
  );
  process.exit(1);
}
const name = rawName;
const pascal = name.replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase());
const label = labelFlag ? labelFlag.slice('--label='.length) : pascal.replace(/([a-z])([A-Z])/g, '$1 $2');

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

const cssDir = join(coreRoot, 'src/css/components', name);
const cssFile = join(cssDir, `${name}.css`);
const pagePath = join(docsRoot, 'src/pages/components', `${name}.astro`);

if ((await exists(cssDir)) || (await exists(pagePath))) {
  console.error(`"${name}" already exists (${(await exists(cssDir)) ? cssFile : pagePath}).`);
  process.exit(1);
}

// 1. CSS file
await mkdir(cssDir, { recursive: true });
await writeFile(
  cssFile,
  `@layer bo-components {
  /* Block */
  .bo-${name} {
    /* TODO: base styles */
  }

  /* Parts */
  /* .bo-${name}__part { } */

  /* Variants */
  /* .bo-${name}--variant { } */
}
`,
);

// 2. @import in index.css, appended after the last component import (matches
// the existing add-at-the-bottom convention — imports aren't alphabetical).
const indexPath = join(coreRoot, 'src/css/index.css');
const indexCss = await readFile(indexPath, 'utf8');
const importLine = `@import "./components/${name}/${name}.css";`;
const lines = indexCss.split('\n');
const lastComponentImportLine = lines
  .map((l, i) => [l, i])
  .filter(([l]) => l.startsWith('@import "./components/'))
  .pop();
if (!lastComponentImportLine) throw new Error('No existing component imports found in index.css');
lines.splice(lastComponentImportLine[1] + 1, 0, importLine);
await writeFile(indexPath, lines.join('\n'));

// 3. Docs page skeleton — the fixed shape from CLAUDE.md's "how to document a
// component" recipe: opener, ClassRef, >=1 demo section, Markup, ApiTable,
// Related. The gate checks for exactly these pieces.
await mkdir(dirname(pagePath), { recursive: true });
await writeFile(
  pagePath,
  `---
import Gallery from '../../layouts/Gallery.astro';
import ClassRef from '../../components/ClassRef.astro';
import Related from '../../components/Related.astro';
import ApiTable from '../../components/ApiTable.astro';
import Demo from '../../components/Demo.astro';
const example = \`<div class="bo-${name}">TODO</div>\`;
const canonical = \`<div class="bo-${name}">
  <!-- TODO -->
</div>\`;
---
<Gallery title="${label}">
  <p class="demo-note">
    TODO: one line — what it is + when to use.
  </p>
  <ClassRef component="${name}" />
  <section class="demo">
    <h2>TODO</h2>
    <Demo code={example} />
  </section>
  <section class="demo">
    <h2>Markup</h2>
    <pre><code>{canonical}</code></pre>
  </section>
  <ApiTable component="${name}" notes={[]} />
  <Related links={[["/reference/classes", "Class index"]]} />
</Gallery>
`,
);

// 4. Sidebar entry
const galleryPath = join(docsRoot, 'src/layouts/Gallery.astro');
let gallery = await readFile(galleryPath, 'utf8');
const marker = "label: 'Components',\n    items: [";
const markerIndex = gallery.indexOf(marker);
if (markerIndex === -1) throw new Error("Couldn't find the Components section in Gallery.astro");
const insertAt = markerIndex + marker.length;
const entry = `\n      { href: '/components/${name}', label: '${label}' },`;
gallery = gallery.slice(0, insertAt) + entry + gallery.slice(insertAt);
await writeFile(galleryPath, gallery);

// 5. Stub behavior test — only interactive components get one; there's no
// per-component test file, all behaviors live in one describe-block file.
if (behavior) {
  const testPath = join(coreRoot, 'tests/behaviors.test.ts');
  const test = await readFile(testPath, 'utf8');
  await writeFile(
    testPath,
    test.trimEnd() +
      `

describe('init${pascal}', () => {
  it.todo('TODO: behavior contract for ${name}');
});
`,
  );
}

console.log(`Scaffolded "${name}":
  ${cssFile.replace(repoRoot + '/', '')}
  ${pagePath.replace(repoRoot + '/', '')}
  sidebar entry in apps/docs/src/layouts/Gallery.astro${
    behavior ? '\n  stub test in packages/core/tests/behaviors.test.ts' : ''
  }

Next: fill in the CSS, write real demo markup, replace the placeholder
Related link with real cross-references, then run \`npm run build\` (core) and
\`npm run docs:build\` — that regenerates api.json/contrast.json and runs the
page-shape gate against what you wrote. New colour pairing? add it to PAIRS
in check-contrast.mjs.`);
