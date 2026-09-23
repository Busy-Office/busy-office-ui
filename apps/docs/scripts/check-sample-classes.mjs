/**
 * Gate: every `bo-*` class written in a copyable sample is a class this
 * framework ships (roadmap 375.4).
 *
 * WHY. `check-markup` validates the classes a built page RENDERS, and it strips
 * `<pre>`/`<code>` first, because a sample is escaped text rather than markup.
 * So a recipe a reader copies was validated by nothing: `bo-label` shipped in
 * the copyable form-field sample on `/concepts/accessibility/` for 33 days, and
 * `check-markup`'s input was byte-identical with and without it.
 *
 * BASE RATE, measured before this was written (94.11): 2,382 `bo-*` class
 * tokens in 261 `<pre>` blocks across 169 built HTML files; 0 unknown once that
 * sample was corrected, 1 with HEAD's `bo-label` put back into the built page —
 * which this gate reports and `check-markup` passes.
 *
 * The predicate is "a `bo-`-prefixed class `api.json` does not know", never
 * "every class" — samples legitimately carry an application's own classes.
 *
 * @heuristic — samples are found by regex over `<pre>` regions and class
 *   attributes are recognised in the decoded text, so it ships --self-test
 *   covering highlighter spans splitting the attribute, JSX `className`, a
 *   consumer class, and a `bo-` class outside any sample.
 *
 * WHAT IT DOES NOT CHECK: classes built in script (`classList.add('bo-…')`),
 * and inline `<code>` fragments, which name classes in prose rather than as
 * markup a reader pastes.
 */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { DIST, CORE_DIST } from './paths.mjs';
import { distPages } from './dist-pages.mjs';
import { gate, assertScanned, selfTest } from './gate-report.mjs';
import { textOf } from './pattern-extract.mjs';

const api = JSON.parse(await readFile(join(CORE_DIST, 'api.json'), 'utf8'));
// Same known set as packages/core/scripts/check-markup.mjs, CONVENTIONAL included.
const known = new Set(['bo-visually-hidden', 'bo-tabs']);
for (const s of ['components', 'primitives']) for (const c of Object.values(api[s])) for (const x of c.classes) known.add(x);
for (const x of api.utilities.classes) known.add(x);
for (const x of api.motion.classes) known.add(x);

const PRE = /<pre\b[^>]*>([\s\S]*?)<\/pre>/gi;
const CLASS_ATTR = /\bclass(?:Name)?\s*=\s*["']([^"']*)["']/g;

/** `bo-*` classes written in `<pre>` samples that the framework does not ship. */
export function unknownSampleClasses(html, isKnown = (c) => known.has(c)) {
  const out = [];
  for (const [, body] of html.matchAll(PRE)) {
    for (const [, list] of textOf(body).matchAll(CLASS_ATTR)) {
      for (const c of list.split(/\s+/)) if (c.startsWith('bo-') && !isKnown(c)) out.push(c);
    }
  }
  return out;
}

if (process.argv.includes('--self-test')) {
  const k = (c) => ['bo-btn', 'bo-form-field__label'].includes(c);
  selfTest([
    ['an unknown bo- class in a sample is reported',
      unknownSampleClasses('<pre>&lt;label class="bo-label"&gt;</pre>', k), ['bo-label']],
    ['a known class is not',
      unknownSampleClasses('<pre>&lt;label class="bo-form-field__label"&gt;</pre>', k), []],
    ['highlighter spans splitting the attribute do not hide it',
      unknownSampleClasses('<pre><span class="t">class</span>=<span class="s">&quot;bo-btn bo-btn--primary&quot;</span></pre>', k), ['bo-btn--primary']],
    ['JSX className is read too',
      unknownSampleClasses("<pre>&lt;div className='bo-card'&gt;</pre>", k), ['bo-card']],
    ["an application's own class is not ours to judge",
      unknownSampleClasses('<pre>&lt;div class="invoice-row bo-btn"&gt;</pre>', k), []],
    ['a bo- class in rendered markup outside a sample is check-markup\'s, not this gate\'s',
      unknownSampleClasses('<div class="bo-nope"></div><pre>plain</pre>', k), []],
  ]);
}

const pages = await distPages(DIST);
assertScanned(pages.length, 'built pages', 'did astro build run before this gate?');

const g = gate('sample-classes check', 'page(s)');
let samples = 0;
for (const page of pages) {
  samples += (page.html.match(PRE) ?? []).length;
  const bad = unknownSampleClasses(page.html);
  g.check(
    `${page.url}: every bo-* class in a copyable sample exists`,
    bad.length === 0,
    `sample uses ${[...new Set(bad)].join(', ')}, which api.json does not know — a reader who copies it gets an unstyled element`,
  );
}
assertScanned(samples, '<pre> samples', 'no code samples found — did the page markup change?');
g.report(`${samples} <pre> sample(s) on ${pages.length} built page(s)`);
