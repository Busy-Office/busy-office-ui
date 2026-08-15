// Generate dist/keymap.json from @keymap JSDoc blocks in behavior source.
// Not gated for parity like events (a behavior may legitimately have zero
// documented keys — most are pointer/delegation-only) but every @keymap
// name must resolve to a real exported init function, so a renamed/removed
// behavior can't leave a stale keymap block behind.
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const srcDir = join(root, 'src/js/behaviors');

const behaviors = [];
const errors = [];

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
    const keys = [...block.matchAll(/@key\s+(.+?)\s+—\s+(.+?)(?=\n@|$)/gs)].map((k) => ({
      key: k[1].trim(),
      does: k[2].replace(/\s+/g, ' ').trim(),
    }));
    behaviors.push({ name, file: f, keys });
  }
}

if (errors.length) {
  console.error('keymap gate FAILED:\n  ' + errors.join('\n  '));
  process.exit(1);
}

behaviors.sort((a, b) => a.name.localeCompare(b.name));
mkdirSync(join(root, 'dist'), { recursive: true });
writeFileSync(
  join(root, 'dist/keymap.json'),
  JSON.stringify({ generated: 'extract-keymap.mjs — do not hand-edit', behaviors }, null, 2) + '\n',
);
console.log(`keymap.json generated — ${behaviors.length} behaviors with documented keyboard support`);
