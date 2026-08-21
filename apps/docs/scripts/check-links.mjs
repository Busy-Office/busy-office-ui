/**
 * Verifies every internal link in the BUILT site resolves to a built file —
 * including redirect-stub destinations. Run against a DOCS_BASE build in CI:
 * both live 404s the site grill found (base-blind redirects, a generated slug
 * with no page) were link-rot in build output nothing re-read (S-1/S-2/S-7).
  *
 * @exact — resolves each link to a file on disk. Exempt from --self-test: there is no
 *   judgement to get wrong, and ceremony around a lookup is noise.
*/
import { readFile, stat } from 'node:fs/promises';
import { assertScanned } from './gate-report.mjs';
import { join, dirname } from 'node:path';
import { DIST } from './paths.mjs';

import { distPages } from './dist-pages.mjs';

const base = (process.env.DOCS_BASE ?? '').replace(/\/$/, '');

/** Resolve a URL path to the built file that serves it, or null. */
async function resolveFile(urlPath) {
  const clean = urlPath.replace(/[#?].*$/, '').replace(/\/$/, '');
  const rel = clean === '' ? 'index.html' : clean.replace(/^\//, '');
  for (const candidate of [rel, `${rel}/index.html`, `${rel}.html`]) {
    try {
      /* stat, not access: `access` succeeds on a DIRECTORY, so `/components`
         resolved to the directory itself and the link counted as good even if
         no index.html was ever emitted inside it. Harmless while this returned
         a boolean; a crash (EISDIR) the moment the file was actually read for
         its anchors — which is how the looseness came to light. */
      const s = await stat(join(DIST, candidate));
      if (s.isFile()) return join(DIST, candidate);
    } catch {}
  }
  return null;
}

async function exists(urlPath) {
  return (await resolveFile(urlPath)) !== null;
}

/* Fragments were STRIPPED and never checked, so `…/installation#anchor-that-
   does-not-exist` counted as a verified link — the page resolves, the anchor
   silently doesn't, and the reader lands at the top of a long page wondering
   what they were meant to see. Found by writing exactly that link into the
   troubleshooting page and then checking by hand (roadmap 33.2); 30 distinct
   cross-page fragment links were riding on an unverified assumption.

   Ids are read once per target page and cached — the same handful of pages are
   linked from everywhere, and re-reading per link made this gate the slowest
   in the chain. */
const idCache = new Map();
async function idsOf(file) {
  if (!idCache.has(file)) {
    const html = await readFile(file, 'utf8');
    idCache.set(
      file,
      new Set([
        ...[...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]),
        // <a name> is still a valid anchor target in HTML5 parsing.
        ...[...html.matchAll(/<a[^>]+name="([^"]+)"/g)].map((m) => m[1]),
      ]),
    );
  }
  return idCache.get(file);
}

let checked = 0;
const failures = [];
/* skipRedirects:false, deliberately: this gate's whole point includes
   redirect-stub DESTINATIONS — two live 404s came from base-blind redirects
   (header above). Every other dist-walking gate takes the default. */
for (const page of await distPages(DIST, { skipRedirects: false })) {
  const file = page.file;
  const html = page.html;
  // Relative hrefs resolve against the page URL — the site grill's A-5 found
  // four broken ./ and ../ links the absolute-only check missed.
  const pageDir = '/' + dirname(file.replace(DIST + '/', '')).replace(/^\.$/, '');
  const resolveRel = (u) =>
    new URL(u, `http://x${pageDir.endsWith('/') ? pageDir : pageDir + '/'}`).pathname;
  const targets = [
    ...[...html.matchAll(/href="(\/[^"]*)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/href="(\.[^"]*)"/g)].map((m) => resolveRel(m[1])),
    ...[...html.matchAll(/content="0;url=([^"]+)"/g)].map((m) => m[1]),
  ].filter((u) => !u.startsWith('//'));

  /* Same-page anchors, which the target list above cannot see: it matches
     hrefs starting with "/" or ".", and these start with "#". They are the
     COMMONER place for a dead anchor — skip links, in-page tables of contents,
     "back to top" — and they were as unchecked as the cross-page ones. */
  const ownIds = await idsOf(file);
  for (const m of new Set([...html.matchAll(/href="#([^"]+)"/g)].map((x) => x[1]))) {
    checked++;
    const frag = decodeURIComponent(m);
    if (frag !== 'top' && !ownIds.has(frag)) {
      failures.push(`${file.replace(DIST, '')}: link to missing anchor #${frag} on this page`);
    }
  }
  for (const t of new Set(targets)) {
    checked++;
    if (base && !t.startsWith(base + '/') && t !== base) {
      // Sanctioned exception (Slice 21 item 4): a snapshot build's base
      // carries a /v/<ver> suffix, and its frozen-docs banner DELIBERATELY
      // links to the site root outside its own base — that escape link is
      // the feature. Only that exact target is allowed; everything else
      // outside base is still a failure.
      const siteRoot = base.replace(/\/v\/[^/]+$/, '');
      if (siteRoot !== base && t === siteRoot + '/') continue;
      failures.push(`${file.replace(DIST, '')}: link outside base path: ${t}`);
      continue;
    }
    const pathInSite = base ? t.slice(base.length) : t;
    const target = await resolveFile(pathInSite);
    if (!target) {
      failures.push(`${file.replace(DIST, '')}: broken internal link: ${t}`);
      continue;
    }
    const frag = decodeURIComponent(pathInSite.split('#')[1] ?? '');
    if (frag && !(await idsOf(target)).has(frag)) {
      failures.push(`${file.replace(DIST, '')}: link to missing anchor #${frag} on ${t.split('#')[0]}`);
    }
  }
}

if (failures.length) {
  console.error(`link check FAILED (${failures.length}):`);
  for (const f of [...new Set(failures)]) console.error('  ' + f);
  process.exit(1);
}
assertScanned(checked, 'internal links', 'dist has no pages — run the docs build first');
console.log(`link check passed: ${checked} internal links verified against dist`);
