/**
 * Gate: the ERP suite example is an INSTRUMENT, and stays one.
 *
 * Its whole value is that it cannot paper over a gap. The moment a screen is
 * allowed one little `<style>` block, every missing component becomes a local
 * fix nobody records, and the example stops telling us anything.
 *
 * Three assertions:
 *   1. no CSS of its own — no .css file, no <style> block, no style= carrying
 *      anything but a documented framework custom property;
 *   2. every class exists in the shipped framework (delegated to the
 *      framework's own check-markup, run by the caller);
 *   3. every internal link resolves to a screen that exists — a suite whose
 *      job is navigation must actually navigate.
 *
 * @exact — string and filesystem facts, no recognition. Exempt from
 * --self-test: there is no judgement to get wrong.
 */
import { readdir, readFile } from 'node:fs/promises';
import { suitePages } from './pages.mjs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const DIST = join(here, 'dist');

/* Inline style is allowed ONLY to set a documented framework custom property
   (--bo-widget-min sizes a widget grid; the docs' own pattern pages do this).
   Anything else is the example inventing design, which is the thing this gate
   exists to prevent. */
const ALLOWED_INLINE = /^(--bo-[a-z-]+:[^;]+;?\s*|max-inline-size:\s*\d+(\.\d+)?rem;?\s*)+$/;

const failures = [];

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const sourceFiles = (await walk(here)).filter((f) => !f.startsWith(DIST));
for (const f of sourceFiles) {
  if (f.endsWith('.css')) failures.push(`${f}: the example ships its own CSS — that is a gap being papered over, not a screen`);
}

/* The shared enumerator, not this file's general file walker: that one exists
   for the stray-CSS sweep over SOURCE and returns every file. Two walks of the
   dist tree written independently is what pages.mjs consolidates. */
const built = (await suitePages(DIST)).map((p) => p.file);
if (built.length === 0) failures.push('no screens built — run build.mjs first');

const screens = new Set(built.map((f) => '/' + f.slice(DIST.length + 1)));

for (const f of built) {
  const html = await readFile(f, 'utf8');
  const rel = f.slice(DIST.length + 1);

  if (/<style[\s>]/i.test(html)) failures.push(`${rel}: contains a <style> block`);

  for (const m of html.matchAll(/style="([^"]*)"/g)) {
    if (!ALLOWED_INLINE.test(m[1].trim())) {
      failures.push(`${rel}: inline style "${m[1]}" is not a framework custom property`);
    }
  }

  for (const m of html.matchAll(/href="(\/[^"#]*)"/g)) {
    const href = m[1];
    if (href.startsWith('/bo/')) continue; // the framework stylesheet
    if (!screens.has(href)) failures.push(`${rel}: link to ${href}, which is not a screen in this suite`);
  }
}

if (failures.length) {
  console.error(`erp-suite check FAILED (${failures.length}):`);
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log(
  `erp-suite check passed — ${built.length} screen(s), zero CSS of its own, every internal link resolves`,
);
