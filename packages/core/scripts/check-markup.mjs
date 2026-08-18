#!/usr/bin/env node
//
// @heuristic — parses HTML with regex; the bare-text rule once caught 5 of 6 injected cases because it consumed the trailing "<".
// OWES a --self-test (roadmap 42.3): a detector this easy to fool must prove it can fail.
/**
 * Validate HTML against the framework's GENERATED surface.
 *
 *   npx @busy-office/ui check-markup "src/**\/*.html"
 *
 * Two checks, both answered from `dist/api.json`, which is extracted from the
 * shipped CSS and therefore cannot drift from what actually exists:
 *
 *   1. every `bo-*` class is a class this framework ships
 *   2. every framework `data-*` attribute carries a value the CSS switches on
 *
 * WHY THIS EXISTS. A class name that does not exist fails silently — the
 * element renders unstyled and looks like a CSS bug. An attribute VALUE that
 * does not exist fails even more quietly: the attribute is there, it is spelled
 * correctly, and nothing happens. Both are ordinary typos, and both are what a
 * language model produces when it guesses a plausible name from a pattern —
 * `.bo-card`, `.bo-modal`, `data-row-state="selected"`. This tool was written
 * after that last one shipped into this repo's own docs (roadmap 32.2).
 *
 * WHAT IT DELIBERATELY DOES NOT CHECK: unknown `data-*` attributes. The item
 * asked for it and it turns out to be unanswerable — `data-row-id`,
 * `data-line-remove` and `data-sum-of` are an application's own hooks, and
 * nothing distinguishes them from a misspelled framework one. Flagging them
 * would make the tool noisy enough to be ignored, which is worse than not
 * checking. Values ARE checkable, because the attribute being known is what
 * makes its value knowable.
 */
import { readFile, readdir } from 'node:fs/promises';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const api = JSON.parse(await readFile(join(here, '..', 'dist', 'api.json'), 'utf8'));

const known = new Set();
for (const section of ['components', 'primitives']) {
  for (const c of Object.values(api[section])) for (const cls of c.classes) known.add(cls);
}
for (const cls of api.utilities.classes) known.add(cls);
for (const cls of api.motion.classes) known.add(cls);
const values = api.dataAttrValues ?? {};

/* Class names the framework ships as documented conventions rather than as CSS
   rules — they have no styles of their own, so the extractor never sees them. */
const CONVENTIONAL = new Set([
  'bo-visually-hidden',
  /* The tabs BLOCK is required by the documented markup contract and carries no
     styles of its own — every rule targets its parts. Real, just invisible to a
     walk over the CSS. */
  'bo-tabs',
]);

/* Shared by the gate AND its --self-test, so breaking one breaks the other.
   The first version of the self-test held a COPY, and reintroducing the real
   consumed-`<` bug left it happily passing. */
export const BARE_TEXT_RE = /<(tr|tbody|thead|tfoot|table)\b[^>]*>([^<]+)(?=<)/g;
export const TABLIST_RE = /<[^>]*role="tablist"[^>]*>([\s\S]*?)<\/(?:div|nav|ul)>/g;
export const TAB_CONTROLS_RE = /role="tab"[^>]*aria-controls="([^"]+)"|aria-controls="([^"]+)"[^>]*role="tab"/g;

if (process.argv.includes('--self-test')) {
  /* Two rules here are pure pattern-matching over HTML text, and BOTH have been
     wrong in production:
       - bare text inside table structure once reported 5 of 6 injected rows,
         because the regex consumed the trailing "<" and adjacent matches were
         skipped. That is the case this test exists for.
       - shared aria-controls across a tablist shipped as a P0: nine tabs, one
         panel, worked exactly once. */
  const bareText = (html) =>
    [...html.matchAll(BARE_TEXT_RE)]
      .filter((m) => m[2].trim()).length;
  const sharedPanels = (html) => {
    let dupes = 0;
    for (const list of html.matchAll(TABLIST_RE)) {
      const c = [...list[1].matchAll(TAB_CONTROLS_RE)]
        .map((m) => m[1] ?? m[2]);
      dupes += c.filter((x, i) => c.indexOf(x) !== i).length;
    }
    return dupes;
  };
  /* TRULY adjacent: the first row's stray text ends exactly at the "<" that
     opens the second row. That is the only shape the consumed-"<" bug loses —
     an earlier fixture put a <th> between them, so both matched even with the
     bug reintroduced, and the test passed while proving nothing. */
  const adjacent = '<tbody><tr>a<tr>b<th>x</th></tbody>';
  const clean = '<table><tr><th>x</th></tr><tr><th>y</th></tr></table>';
  const shared = '<div role="tablist"><button role="tab" aria-controls="p"></button>' +
    '<button role="tab" aria-controls="p"></button></div>';
  const distinct = '<div role="tablist"><button role="tab" aria-controls="p1"></button>' +
    '<button role="tab" aria-controls="p2"></button></div>';
  const results = [
    ['two ADJACENT bare-text rows are both reported', bareText(adjacent), 2],
    ['a clean table reports none', bareText(clean), 0],
    ['two tabs sharing a panel are reported', sharedPanels(shared), 1],
    ['two tabs with their own panels are not', sharedPanels(distinct), 0],
  ];
  let ok = true;
  for (const [what, got, want] of results) {
    ok &&= got === want;
    console.log(`self-test: ${what.padEnd(46)} ${got} (want ${want}) ${got === want ? 'ok' : 'WRONG'}`);
  }
  if (!ok) { console.error('  the detector misses cases it is supposed to catch'); process.exit(1); }
  console.log('self-test passed — the detector can fail');
  process.exit(0);
}

const roots = process.argv.slice(2);
if (!roots.length) {
  console.error('usage: check-markup <dir-or-file> [...]   (HTML files)');
  process.exit(2);
}

async function* htmlFiles(path) {
  let entries;
  try {
    entries = await readdir(path, { withFileTypes: true });
  } catch {
    if (path.endsWith('.html')) yield path;
    return;
  }
  for (const e of entries) {
    const p = join(path, e.name);
    if (e.isDirectory()) yield* htmlFiles(p);
    else if (e.name.endsWith('.html')) yield p;
  }
}

const findings = [];
let files = 0;
let classesSeen = 0;

for (const root of roots) {
  for await (const file of htmlFiles(root)) {
    files += 1;
    const raw = await readFile(file, 'utf8');
    /* Strip code samples first. A page that DOCUMENTS an attribute prints
       `data-tree-level="1..12"` inside <code>, and a naive scan reads that as
       markup and reports the documentation as a defect (found on this repo's
       own tree-table page). Samples are escaped in <pre>, but <code> spans in
       prose are not always. */
    const html = raw.replace(/<pre[\s\S]*?<\/pre>/g, '').replace(/<code[\s\S]*?<\/code>/g, '');
    const where = relative(process.cwd(), file);

    // 1. unknown bo-* classes
    for (const m of html.matchAll(/\sclass="([^"]*)"/g)) {
      for (const cls of m[1].split(/\s+/)) {
        if (!cls.startsWith('bo-')) continue;
        classesSeen += 1;
        if (known.has(cls) || CONVENTIONAL.has(cls)) continue;
        findings.push({ where, what: `unknown class "${cls}"`, hint: nearest(cls) });
      }
    }

    /* 3. Contracts a BEHAVIOR depends on, which look fine in markup and fail at
       runtime. First member, and the reason this check exists: within one
       tablist every tab must control its OWN panel. initTabs() loops the tabs
       setting `panel.hidden = !selected`, so if several tabs name the same
       panel the last one in DOM order decides, and the panel disappears on the
       second click. It works exactly once — which is how it shipped past a
       review, a build and an axe run (owner report, 2026-08-18).

       Neither of the checks above could see it: every class was real and every
       attribute value was legal. axe cannot see it either — the ARIA is
       individually valid, and only the RELATIONSHIP between tabs is wrong. */
    for (const list of html.matchAll(TABLIST_RE)) {
      const controls = [...list[1].matchAll(TAB_CONTROLS_RE)]
        .map((m) => m[1] ?? m[2]);
      if (controls.length < 2) continue;
      const dupes = controls.filter((c, i) => controls.indexOf(c) !== i);
      if (dupes.length) {
        findings.push({
          where,
          what: `${controls.length} tabs in one tablist share ${new Set(dupes).size} panel id(s): ${[...new Set(dupes)].join(', ')}`,
          hint: 'each tab needs its own [role=tabpanel]; sharing one means initTabs() hides it on the second click',
        });
      }
    }

    /* 4. Text sitting directly inside table structure. `<tr>foo<th>…` is invalid
       in a way the HTML parser silently repairs: it HOISTS the text out of the
       table and renders it above, so the defect appears somewhere the markup
       never mentioned. Nothing else catches it — the classes are real, the
       attributes are legal, and axe sees a table that parsed fine.

       Found by looking at a rendered screenshot after an edit that removed a
       column left each row id duplicated as a bare text node (2026-08-18):
       six field keys printed above the header. That is the exact failure the
       Slice 29-30 grill named — a bulk edit verified against the source diff
       rather than the rendered artefact — so it gets a check rather than a
       promise to be more careful. */
    /* Lookahead rather than consuming the `<`: consuming it makes the next match
       start after that bracket, so two offending tags in a row report as one.
       Caught by counting — six injected rows reported five. */
    for (const m of html.matchAll(BARE_TEXT_RE)) {
      const text = m[2].trim();
      if (!text) continue;
      findings.push({
        where,
        what: `bare text "${text.slice(0, 40)}" directly inside <${m[1]}>`,
        hint: 'the parser hoists this out of the table and renders it above — wrap it in a cell or delete it',
      });
    }

    // 2. framework data-* attributes carrying a value the CSS never switches on
    for (const m of html.matchAll(/\s(data-[a-z-]+)="([^"]*)"/g)) {
      const legal = values[m[1]];
      if (!legal || !m[2]) continue;
      if (legal.includes(m[2])) continue;
      findings.push({ where, what: `${m[1]}="${m[2]}" is not a value this framework defines`, hint: `expected one of: ${legal.join(', ')}` });
    }
  }
}

/** Cheap "did you mean" — same block, or a one-edit-away name. */
function nearest(cls) {
  const block = cls.split('__')[0].split('--')[0];
  const sameBlock = [...known].filter((k) => k.startsWith(`${block}__`) || k.startsWith(`${block}--`) || k === block);
  if (sameBlock.length) return `did you mean: ${sameBlock.slice(0, 3).join(', ')}`;
  const close = [...known].filter((k) => Math.abs(k.length - cls.length) <= 2 && k.slice(0, 6) === cls.slice(0, 6));
  return close.length ? `did you mean: ${close.slice(0, 3).join(', ')}` : 'no such block in this framework';
}

/* Finding nothing to check is a FAILURE, not a pass.
 *
 * `check-markup dist` over an empty or wrong directory used to print
 * "passed — 0 file(s)" and exit 0. That is the fail-open mode a gate must not
 * have, and this is the gate most exposed to it: it is the one that ships to
 * consumers, and 33.2 now tells them to wire it into CI. The two ways to get
 * here are both ordinary — the directory is named `build` or `public` rather
 * than `dist`, or the check ran before the build — and both produce a green CI
 * that has validated nothing. Silence reads as approval, so it must not be
 * available. See "a gate that cannot run must fail loudly" in CLAUDE.md. */
if (!files) {
  console.error(`check-markup FAILED — no HTML files found in: ${roots.join(', ')}`);
  console.error('  It reads BUILT html, so it must run after your build, and the path must');
  console.error('  be the directory your build wrote (dist, build, public, out, _site…).');
  console.error('  Exiting non-zero rather than reporting a pass it did not earn.');
  process.exit(1);
}

const unique = [...new Map(findings.map((f) => [`${f.where}|${f.what}`, f])).values()];

if (unique.length) {
  console.error(`check-markup FAILED — ${unique.length} problem(s) across ${files} file(s):`);
  for (const f of unique.slice(0, 40)) {
    console.error(`  ${f.where}\n     ${f.what}\n     ${f.hint}`);
  }
  if (unique.length > 40) console.error(`  … and ${unique.length - 40} more`);
  process.exit(1);
}
console.log(`check-markup passed — ${files} file(s), ${classesSeen} bo-* class use(s), every class and framework attribute value exists`);
