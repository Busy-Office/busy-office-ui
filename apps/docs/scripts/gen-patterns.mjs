/**
 * Generates `src/data/patterns.json` — per-pattern group, opener,
 * complexity, components-used, States rows, Data-contract rows, and the
 * wrong-choice clause (text + alternative link) — by reading it back out
 * of each pattern page's own source (roadmap 112.1).
 *
 * The pages stay the single source of truth (docs doctrine); this is
 * extraction, never authored metadata (refused in the Slice 112 grill,
 * settled Q8 — a second, hand-maintained interpretation of the pattern
 * system is exactly what the doctrine forbids). Opener extraction reuses
 * `wrong-choice-rule.mjs`'s `opener()`; complexity/components extraction
 * reuses `pattern-extract.mjs` — the ONE place both this file and
 * `gen-patterns-index.mjs` share them (Standardize sweep #6 pulled these
 * out of two byte-identical copies, per that file's own header — a third
 * divergent copy is the exact defect it exists to prevent).
 *
 * Anatomy is deliberately OUT of scope (112.1) — its
 * `<li><strong>Region</strong>` convention fuses component links into
 * prose with parenthetical asides a naive extractor would swallow
 * (approval's own entries). Extract it only after a page-side convention
 * tightening earns it.
 *
 * Never hand-edit the output — same rule as api.json/patterns-index.json.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { PATTERN_GROUPS } from '../src/data/pattern-groups.mjs';
import { opener as extractOpener } from './wrong-choice-rule.mjs';
import { extractComplexity, extractComponents, stripTags } from './pattern-extract.mjs';

const patternsDir = new URL('../src/pages/patterns/', import.meta.url);

const WRONG_CHOICE_RE = /<strong>\s*((?:Not|Never|Do not|Don'?t)\b[\s\S]*?)<\/strong>([\s\S]*?)(?:<\/p>|$)/;
const LINK_RE = /href=\{base \+ '([^']+)'\}/;
const SECTION_RE = (heading) => new RegExp(`<h2>${heading}<\\/h2>[\\s\\S]*?<tbody>([\\s\\S]*?)<\\/tbody>`);
const ROW_RE = /<tr>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<\/tr>/g;


function extractRows(src, heading) {
  const m = SECTION_RE(heading).exec(src);
  if (!m) return null; // page has no such section — legitimate for a few (staging has no filtered States, etc.)
  return [...m[1].matchAll(ROW_RE)].map(([, a, b]) => [stripTags(a), stripTags(b)]);
}

function extractWrongChoice(src) {
  const op = extractOpener(src);
  const m = WRONG_CHOICE_RE.exec(op);
  if (!m) return null;
  const clause = stripTags(m[1]);
  const rest = m[2] ?? '';
  const link = LINK_RE.exec(rest)?.[1] ?? null;
  return { clause, alternative: link };
}

/* @heuristic — the row/clause extraction rests on recognising a table shape
   and a prose pattern, both of which have been fooled before elsewhere in
   this codebase (see CLAUDE.md's "heuristic gate" section). Self-tested
   against synthetic pages covering: a normal two-row table, a page with NO
   States section (must return null, not throw or return []), a wrong-choice
   clause with no alternative link, and a Data-contract cell containing a
   literal `<code>` tag nested inside `<td>` (must not swallow or misparse
   the row). */
if (process.argv.includes('--self-test')) {
  const cases = [
    ['extracts a normal 2-row States table',
      JSON.stringify(extractRows('<h2>States</h2><table><tbody><tr><td>Empty</td><td>shows a message</td></tr><tr><td>Error</td><td>shows a banner</td></tr></tbody></table>', 'States')),
      JSON.stringify([['Empty', 'shows a message'], ['Error', 'shows a banner']])],
    ['a page with no States section returns null, not []',
      extractRows('<h2>Anatomy</h2><p>no states here</p>', 'States'),
      null],
    ['wrong-choice clause with no alternative link',
      JSON.stringify(extractWrongChoice('<p class="demo-note"><strong>Not for bulk edits</strong> — use something else, no link here.</p>')),
      JSON.stringify({ clause: 'Not for bulk edits', alternative: null })],
    ['wrong-choice clause WITH an alternative link',
      JSON.stringify(extractWrongChoice('<p class="demo-note"><strong>Not for X</strong> — see <a href={base + \'/patterns/y\'}>Y</a> instead.</p>')),
      JSON.stringify({ clause: 'Not for X', alternative: '/patterns/y' })],
    ['a nested <code> tag inside a Data-contract cell does not break the row',
      JSON.stringify(extractRows('<h2>Data contract</h2><table><tbody><tr><td class="bo-data-table__col--code">POST <code>/x</code></td><td>the <code>&lt;tbody&gt;</code> swap</td></tr></tbody></table>', 'Data contract')),
      JSON.stringify([['POST /x', 'the &lt;tbody&gt; swap']])],
    ['a page with no opener/wrong-choice clause returns null',
      extractWrongChoice('<p class="demo-note">Just an opener, no strong clause.</p>'),
      null],
  ];
  let fails = 0;
  for (const [name, got, want] of cases) {
    const ok = got === want;
    console.log(`  self-test: ${name.padEnd(58)} ${ok ? 'ok' : 'FAIL'}`);
    if (!ok) { console.log(`    got:  ${got}\n    want: ${want}`); fails++; }
  }
  if (fails) { console.error(`self-test FAILED — ${fails} case(s)`); process.exit(1); }
  console.log(`self-test passed — ${cases.length} cases`);
  process.exit(0);
}

const groups = [];
for (const { label, items } of PATTERN_GROUPS) {
  const tiles = [];
  for (const { href, label: title } of items) {
    const slug = href.replace('/patterns/', '');
    const src = await readFile(new URL(`${slug}.astro`, patternsDir), 'utf8');

    const opener = stripTags(extractOpener(src));
    const complexity = extractComplexity(src, slug);
    const components = extractComponents(src);

    const states = extractRows(src, 'States');
    const dataContract = extractRows(src, 'Data contract');
    const wrongChoice = extractWrongChoice(src);

    tiles.push({
      href, title, group: label, opener, complexity, components,
      states, dataContract, wrongChoice,
    });
  }
  groups.push({ label, tiles });
}

const count = groups.reduce((n, g) => n + g.tiles.length, 0);
const withStates = groups.reduce((n, g) => n + g.tiles.filter((t) => t.states).length, 0);
const withContract = groups.reduce((n, g) => n + g.tiles.filter((t) => t.dataContract).length, 0);
const withWrongChoice = groups.reduce((n, g) => n + g.tiles.filter((t) => t.wrongChoice).length, 0);

await writeFile(
  new URL('../src/data/patterns.json', import.meta.url),
  JSON.stringify(
    {
      $comment: 'GENERATED by scripts/gen-patterns.mjs from src/pages/patterns/*.astro — never hand-edit.',
      count,
      groups,
    },
    null,
    2,
  ) + '\n',
);
console.log(
  `patterns.json generated — ${count} pattern(s): ` +
  `${withStates} with States rows, ${withContract} with Data-contract rows, ${withWrongChoice} with a wrong-choice clause`,
);
