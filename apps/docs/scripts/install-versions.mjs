/**
 * Install the frozen version snapshots into the built site (owner report,
 * 2026-09-26: "Navigate the version on doc site doesn't working. Got 404").
 *
 * `apps/docs/versions/<ver>/` are committed at release time, built with
 * DOCS_BASE=/busy-office-ui/v/<ver>, and the header's version switcher offers
 * `/v/<ver>/`. Until this script, only `pages.yml` copied them in, as a step
 * after the build, so the local container and `serveDist` served no `/v/` at
 * all. Every snapshot option 404'd there, and no gate could see it: the
 * switcher's options are `<option value>`s, which the link checker never reads.
 * Now the build installs them, so Pages, the container and every browser gate
 * serve the same site, and `check:claims` drives the switcher.
 *
 * A snapshot's own switcher is frozen at the moment it was built, and the
 * moment was wrong for every one of them: 0.4.0's lists neither itself nor any
 * later version, selects nothing, and so shows "v0.4.0 · latest" on an option
 * that goes to the CURRENT docs. Selecting it fires no change, so the dropdown
 * could not take a reader back. Install rewrites each switcher's options from
 * versions.json and the current package version, with the snapshot's own
 * version selected, keeping its site root and its scoped attributes.
 *
 * It runs LAST in the docs build. Every dist walker skips `v/`
 * (`dist-pages.mjs`), and `check-markup` and pagefind have already run, so the
 * old snapshots are served, not re-gated. That is the arrangement `pages.yml`
 * relied on.
 *
 * @exact — a copy and a rewrite, each reconciled against the source: every
 * snapshot in versions.json has an index.html, and every snapshot page carrying
 * a switcher (counted in the raw HTML) was rewritten to select its own version.
 */
import { access, cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { DOCS_ROOT, REPO_ROOT } from './paths.mjs';

const src = join(DOCS_ROOT, 'versions');
const dest = join(DOCS_ROOT, 'dist', 'v');
const { snapshots } = JSON.parse(await readFile(join(DOCS_ROOT, 'versions.json'), 'utf8'));
const { version: latest } = JSON.parse(await readFile(join(REPO_ROOT, 'packages/core/package.json'), 'utf8'));

const SELECT = /(<select\b[^>]*\bid="version"[^>]*>)([\s\S]*?)(<\/select>)/;
const FIRST_OPTION = /<option\b([^>]*)>/;

/** The switcher's options for a page of snapshot `ver`, or null when `html` has no switcher. */
export function rewriteSwitcher(html, ver) {
  const m = html.match(SELECT);
  if (!m) return null;
  const first = m[2].match(FIRST_OPTION);
  if (!first) throw new Error(`a version switcher with no options (snapshot ${ver})`);
  const value = first[1].match(/\bvalue="([^"]*)"/)?.[1];
  // The first option is always "latest", whose value is the site root + '/'.
  if (value == null || /\/v\/[^/]+\/$/.test(value)) throw new Error(`the first switcher option is not "latest" (snapshot ${ver}): ${value}`);
  const siteRoot = value.replace(/\/$/, '');
  const attrs = first[1].replace(/\s*\bvalue="[^"]*"/, '').replace(/\s*\bselected\b(="[^"]*")?/, '');
  const opt = (v, label, sel) => `<option value="${v}"${sel ? ' selected' : ''}${attrs}>${label}</option>`;
  const options = [opt(`${siteRoot}/`, `v${latest} · latest`, false),
    ...snapshots.map((s) => opt(`${siteRoot}/v/${s}/`, `v${s}`, s === ver))].join('');
  return html.replace(SELECT, `$1 ${options} $3`);
}

async function* htmlFiles(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* htmlFiles(p);
    else if (e.name.endsWith('.html')) yield p;
  }
}

await mkdir(dest, { recursive: true });
await cp(src, dest, { recursive: true });

const problems = [];
let rewritten = 0;
for (const v of snapshots) {
  try {
    await access(join(dest, v, 'index.html'));
  } catch {
    problems.push(`dist/v/${v}/index.html is missing, so the switcher would offer a version that 404s`);
    continue;
  }
  let raw = 0;
  let done = 0;
  for await (const f of htmlFiles(join(dest, v))) {
    const html = await readFile(f, 'utf8');
    if (html.includes('id="version"')) raw++;
    const out = rewriteSwitcher(html, v);
    if (out == null) continue;
    const selected = out.match(SELECT)[2].match(/\bselected\b/g) ?? [];
    if (selected.length !== 1 || !out.includes(`/v/${v}/" selected`)) {
      problems.push(`${f}: the rewritten switcher does not select exactly v${v}`);
      continue;
    }
    await writeFile(f, out);
    done++;
  }
  if (done !== raw) problems.push(`snapshot ${v}: ${raw} page(s) carry id="version" and ${done} switcher(s) were rewritten`);
  rewritten += done;
}
if (!snapshots.length) problems.push('versions.json lists no snapshots');
if (problems.length) {
  console.error(`install-versions FAILED — ${problems.length} problem(s):`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log(`install-versions: ${snapshots.length} snapshot(s) served at /v/ (${snapshots.join(', ')}), ` +
  `${rewritten} snapshot switcher(s) rewritten to list latest v${latest} and every snapshot`);
