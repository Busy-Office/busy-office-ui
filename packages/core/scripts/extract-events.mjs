// Generate dist/events.json from @event JSDoc blocks in behavior source.
// Two-way gate (same doctrine as behaviors-vs-.d.ts): every `bo:*` event
// DISPATCHED in code must carry an @event block, and every @event block must
// match a real dispatch — the intent-event contract cannot silently drift.
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const srcDir = join(root, 'src/js/behaviors');

const events = [];
const dispatched = new Map(); // name -> file

for (const f of readdirSync(srcDir).filter((f) => f.endsWith('.ts'))) {
  const src = readFileSync(join(srcDir, f), 'utf8');

  for (const m of src.matchAll(/new CustomEvent\(\s*'(bo:[a-z-]+)'/g))
    dispatched.set(m[1], f);

  for (const m of src.matchAll(/\/\*\*([\s\S]*?)\*\//g)) {
    const block = m[1].replace(/^\s*\* ?/gm, '');
    const name = block.match(/@event\s+(bo:[a-z-]+)/)?.[1];
    if (!name) continue;
    const grab = (tag) =>
      block
        .match(new RegExp(`@${tag}\\s+([\\s\\S]*?)(?=\\n@|$)`))?.[1]
        .replace(/\s+/g, ' ')
        .trim() ?? '';
    const detail = [...block.matchAll(/@detail\s+(\S+)\s+\{([^}]+)\}\s+([\s\S]*?)(?=\n@|\n\/|$)/g)].map(
      (d) => ({ name: d[1], type: d[2], desc: d[3].replace(/\s+/g, ' ').trim() }),
    );
    const noPayload = /@detail\s+—/.test(block);
    events.push({ name, file: f, target: grab('target'), when: grab('when'), detail, noPayload });
  }
}

const documented = new Set(events.map((e) => e.name));
const errors = [];
for (const [name, file] of dispatched)
  if (!documented.has(name)) errors.push(`dispatched but undocumented: ${name} (${file}) — add an @event block`);
for (const e of events)
  if (!dispatched.has(e.name)) errors.push(`documented but never dispatched: ${e.name} (${e.file}) — stale @event block`);
if (errors.length) {
  console.error('events gate FAILED:\n  ' + errors.join('\n  '));
  process.exit(1);
}

events.sort((a, b) => a.name.localeCompare(b.name));
mkdirSync(join(root, 'dist'), { recursive: true });
writeFileSync(
  join(root, 'dist/events.json'),
  JSON.stringify({ generated: 'extract-events.mjs — do not hand-edit', count: events.length, events }, null, 2) + '\n',
);
console.log(`events.json generated — ${events.length} intent events, dispatch/doc parity verified`);
