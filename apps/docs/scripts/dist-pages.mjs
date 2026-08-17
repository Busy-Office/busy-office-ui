/**
 * One definition of "a built docs page", for the gates that sweep them.
 *
 * Four gates each walked `dist` with their own copy of this, and the copies had
 * drifted into DIFFERENT ANSWERS — each holding half of the correct exclusion
 * set (Standardize sweep, 2026-08-18):
 *
 *   axe-audit      skipped the 8 redirect stubs, but not `/v/`
 *   check-layout   skipped `/v/`, but swept all 8 redirect stubs
 *   forced-colors  skipped `/v/`, and read the stubs looking for classes
 *
 * So "how many pages does this project have?" had two answers, 82 and 90,
 * depending on which gate you asked — and the most expensive sweep in CI was
 * spending ~9% of its time on pages whose entire content is a meta refresh.
 * Coverage divergence between gates is the kind of thing nobody notices until
 * a gate is quietly not checking something.
 *
 * Two exclusions, both deliberate:
 *
 *  - **Redirect stubs** (`http-equiv="refresh"`). There is no layout, no
 *    contrast and no accessible content to check on a page that exists to
 *    bounce the browser somewhere else.
 *  - **`/v/` frozen version snapshots.** These are previously-shipped docs;
 *    they must not be re-judged against today's rules. Note this exclusion is
 *    currently INERT and kept on purpose: the Pages workflow adds the snapshots
 *    at a step AFTER the docs build that runs these gates, so `/v/` does not
 *    exist while they run. It is here so that the intent survives if that
 *    ordering ever changes, not because it matches something today.
 *
 * Returns the page URL, its file path, and its HTML — the HTML has to be read
 * to detect a redirect stub anyway, so handing it back saves every caller a
 * second read (forced-colors caches exactly this).
 */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const SKIP_DIRS = ['_astro', 'pagefind', 'v'];

async function* walk(dir, rel = '') {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (SKIP_DIRS.includes(e.name)) continue;
      yield* walk(join(dir, e.name), `${rel}/${e.name}`);
    } else if (e.name === 'index.html') {
      yield { url: `${rel}/`, file: join(dir, e.name) };
    }
  }
}

/**
 * @param {string} dist  absolute path to the built docs
 * @param {{ skipRedirects?: boolean }} [opts]
 * @returns {Promise<Array<{ url: string, file: string, html: string }>>}
 */
export async function distPages(dist, { skipRedirects = true } = {}) {
  const out = [];
  for await (const p of walk(dist)) {
    const html = await readFile(p.file, 'utf8');
    if (skipRedirects && html.includes('http-equiv="refresh"')) continue;
    out.push({ ...p, html });
  }
  // Stable order: gates print page lists, and a readdir-order diff is noise.
  out.sort((a, b) => a.url.localeCompare(b.url));
  return out;
}
