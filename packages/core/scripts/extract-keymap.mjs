// Generate dist/keymap.json from @keymap JSDoc blocks in behavior source.
// Not gated for parity like events (a behavior may legitimately have zero
// documented keys — most are pointer/delegation-only) but every @keymap
// name must resolve to a real exported init function, so a renamed/removed
// behavior can't leave a stale keymap block behind.
//
// ALSO scans CSS components (137.4). Some keyboard support is real, is
// documented, and belongs in the keymap while being implemented by NOBODY
// here: `.bo-richtext`'s Ctrl/Cmd+B is native contenteditable, shipped by
// the browser, with zero framework JS behind it. Before this, the keymap
// could only describe keys the framework itself implemented, so the field
// with the most-used shortcuts in the whole library was the one surface it
// could not document. A CSS block declares them the same way a behavior
// does, and gets the same staleness check: the @keymap name must appear as
// a real selector in the same file.
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const srcDir = join(root, 'src/js/behaviors');
const cssDir = join(root, 'src/css/components');

const behaviors = [];
const components = [];
const errors = [];

// The lookahead tolerates leading whitespace before the next @tag. JSDoc
// blocks lose their `* ` prefix in the caller and land at column 0, but a
// CSS comment has no per-line prefix to strip, so its @key lines stay
// indented — with a bare /\n@/ the FIRST @key swallowed all six that
// followed it and the extractor reported one key where seven were written.
// A too-tidy number from a new instrument, caught before it was quoted.
const parseKeys = (block) =>
  [...block.matchAll(/@key\s+(.+?)\s+—\s+(.+?)(?=\n\s*@|$)/gs)].map((k) => ({
    key: k[1].trim(),
    does: k[2].replace(/\s+/g, ' ').trim(),
  }));

for (const f of readdirSync(srcDir).filter((f) => f.endsWith('.ts'))) {
  const src = readFileSync(join(srcDir, f), 'utf8');
  const exported = new Set([...src.matchAll(/export function (init\w+)/g)].map((m) => m[1]));

  for (const m of src.matchAll(/\/\*\*([\s\S]*?)\*\//g)) {
    const block = m[1].replace(/^\s*\* ?/gm, '');
    const name = block.match(/@keymap\s+(init\w+)/)?.[1];
    if (!name) continue;
    if (!exported.has(name)) {
      errors.push(`@keymap ${name} (${f}) does not match any exported init function`);
      continue;
    }
    behaviors.push({ name, file: f, keys: parseKeys(block) });
  }
}

// CSS components: keyboard support the browser provides, declared where the
// component is defined. Same staleness rule as behaviors, expressed against
// the artefact that exists here — a selector rather than an export.
for (const dir of readdirSync(cssDir, { withFileTypes: true }).filter((d) => d.isDirectory())) {
  for (const f of readdirSync(join(cssDir, dir.name)).filter((f) => f.endsWith('.css'))) {
    const src = readFileSync(join(cssDir, dir.name, f), 'utf8');
    for (const m of src.matchAll(/\/\*([\s\S]*?)\*\//g)) {
      const block = m[1].replace(/^\s*\* ?/gm, '');
      const name = block.match(/@keymap\s+([\w-]+)/)?.[1];
      if (!name) continue;
      if (!new RegExp(`\\.${name}(?![\\w-])`).test(src)) {
        errors.push(`@keymap ${name} (${dir.name}/${f}) does not match any selector in that file`);
        continue;
      }
      components.push({ name, file: `${dir.name}/${f}`, keys: parseKeys(block) });
    }
  }
}

if (errors.length) {
  console.error('keymap gate FAILED:\n  ' + errors.join('\n  '));
  process.exit(1);
}

behaviors.sort((a, b) => a.name.localeCompare(b.name));
components.sort((a, b) => a.name.localeCompare(b.name));
mkdirSync(join(root, 'dist'), { recursive: true });
writeFileSync(
  join(root, 'dist/keymap.json'),
  JSON.stringify(
    { generated: 'extract-keymap.mjs — do not hand-edit', behaviors, components },
    null,
    2,
  ) + '\n',
);
console.log(
  `keymap.json generated — ${behaviors.length} behaviors and ${components.length} CSS components with documented keyboard support`,
);
