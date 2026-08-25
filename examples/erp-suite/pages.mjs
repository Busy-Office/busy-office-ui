/**
 * The one enumeration of built suite pages.
 *
 * There were three: `audit.mjs` walked the tree returning URL paths,
 * `check-erp-suite.mjs` walked it again returning absolute file paths and
 * filtered `.html` afterwards, and `score.mjs` drove off a hand-written map.
 * Three walks of one directory is the shape the Standardize playbook names
 * outright — "the same lookup table hand-copied into multiple scripts".
 *
 * It is consolidated because it demonstrably costs, not because three copies
 * are untidy. A fourth ad-hoc walk written on 2026-08-26 to answer "how many
 * screens are there" reported **21 when there were 22**: it iterated module
 * directories and never looked at the root, so `index.html` — the suite's own
 * home screen — was invisible. That number then went into a comparison against
 * the gate's count of 22 and had to be chased down. One enumerator, used
 * everywhere, is one place for that bug to not exist.
 *
 * Returns both forms because both are genuinely needed: `url` to fetch a page
 * from the server, `file` to read it off disk.
 */
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * @param {string} dist  absolute path to the built suite
 * @returns {Promise<Array<{ url: string, file: string }>>} sorted by url
 */
export async function suitePages(dist) {
  const out = [];
  async function walk(dir, prefix) {
    for (const e of await readdir(dir, { withFileTypes: true })) {
      if (e.isDirectory()) await walk(join(dir, e.name), `${prefix}/${e.name}`);
      else if (e.name.endsWith('.html')) out.push({ url: `${prefix}/${e.name}`, file: join(dir, e.name) });
    }
  }
  await walk(dist, '');
  out.sort((a, b) => a.url.localeCompare(b.url));
  return out;
}
