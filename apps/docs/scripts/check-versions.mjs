// Gate (Slice 21 grill E4): every versions.json entry must have a
// committed snapshot with an index.html — the likeliest release slip
// (entry without snapshot) previously shipped a live 404 in the
// switcher that nothing caught. Runs in every docs build (local + CI).
//
// @exact — compares version strings. Exempt from --self-test: there is no
// judgement to get wrong, and ceremony around a lookup is noise.
import { readFile, access } from 'node:fs/promises';
import { join } from 'node:path';
import { DOCS_ROOT } from './paths.mjs';

/* Was `new URL('..', import.meta.url).pathname` — percent-ENCODED, so every
   readFile under it fails with ENOENT on a checkout whose path contains a
   space. paths.mjs exists to hold the one correct spelling; this script was
   left behind by that sweep (Standardize, 2026-08-19). */
const docsRoot = DOCS_ROOT;
const { snapshots } = JSON.parse(await readFile(join(docsRoot, 'versions.json'), 'utf8'));
const missing = [];
for (const v of snapshots) {
  try {
    await access(join(docsRoot, 'versions', v, 'index.html'));
  } catch {
    missing.push(v);
  }
}
if (missing.length) {
  console.error(`check-versions: versions.json lists snapshot(s) with no committed versions/<v>/index.html: ${missing.join(', ')} — the switcher would serve a live 404`);
  process.exit(1);
}
console.log(`check-versions: ${snapshots.length} snapshot(s) verified against committed dirs`);
