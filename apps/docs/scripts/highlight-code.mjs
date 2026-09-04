// Post-build syntax highlighting (Slice 20 item 1). Walks every dist
// index.html and replaces bare <pre><code>…</code></pre> blocks (the shape
// every Demo/Markup block renders) with Shiki-highlighted markup — ONE
// mechanism for all pages, zero per-page edits, no client JS, CSP-safe.
//
// Colors: github-light's palette is remapped wholesale to --bo-code-*
// custom properties (colorReplacements), which Gallery.astro defines from
// existing contrast-gated core tokens for BOTH themes — so highlighting is
// theme-aware through the same data-theme contract as everything else,
// and AA falls out of the token pairs the core gate already checks.
// Drift gate: any color the theme emits that this map doesn't cover fails
// the build (an unmapped hex would bypass the token/contrast story).
import { writeFile } from 'node:fs/promises';
import { codeToHtml } from 'shiki';
import { DIST } from './paths.mjs';
import { distPages } from './dist-pages.mjs';
import { decodeEntities } from './html-entities.mjs';


// github-light hexes → semantic slots (many→few on purpose; the docs need
// legible, token-driven code, not a 40-color rainbow).
const COLOR_MAP = {
  '#24292e': 'var(--bo-code-fg)',        // default fg
  '#6a737d': 'var(--bo-code-comment)',   // comments
  '#d73a49': 'var(--bo-code-keyword)',   // keywords / html brackets
  '#22863a': 'var(--bo-code-tag)',       // tags / strings (green)
  '#032f62': 'var(--bo-code-string)',    // strings / attr values
  '#005cc5': 'var(--bo-code-constant)',  // numbers / constants / attr names
  '#6f42c1': 'var(--bo-code-function)',  // function names
  '#e36209': 'var(--bo-code-constant)',  // css units etc.
  '#b31d28': 'var(--bo-code-keyword)',
  '#735c0f': 'var(--bo-code-constant)',
  '#ffffff': 'transparent',              // theme bg — ours comes from CSS
  '#fff': 'transparent',
};

function detectLang(code) {
  const t = code.trimStart();
  if (t.startsWith('<') || /<\/[a-z]/i.test(t)) return 'html';
  if (/^(@import|@layer|:root|\.[a-z-]+\s*\{)/m.test(t) || /;\s*\}\s*$/.test(t.trim())) return 'css';
  if (/\b(import|const|let|function|=>|document\.)\b/.test(t)) return 'js';
  return 'text';
}

/* The local `unescapeHtml()` that used to sit here is now `decodeEntities` in
   html-entities.mjs — one of three copies, and the only one whose comment
   named the double-decode hazard. Its fix (ampersand forms last) is correct
   for `&#38;amp;` and wrong for `&amp;#38;`; the shared one-pass decoder is
   right on both. Measurements and the reproduction command are in that file's
   header (Standardize sweep, roadmap 263.1). */

/* distPages, not a local walker (Standardize, 2026-08-21). This was the sixth
   script walking dist with its own copy; the chokepoint exists precisely so
   "which pages count" has one answer. The second pass below re-calls it, which
   re-reads from disk — that is required, since the first pass rewrites them. */

// Attributed pres included (grill E1: the zero-attribute shape silently
// skipped six hand-written landing blocks + theming's two). Our own
// output (class contains code-hl) is excluded for idempotency.
const BLOCK = /<pre((?![^>]*\bcode-hl\b)[^>]*)><code[^>]*>([\s\S]*?)<\/code><\/pre>/g;

/* Merge a matched pre's original attributes into the highlighted pre:
   its class joins code-hl; everything else (tabindex, data-astro-cid-*)
   is carried over verbatim. */
function mergeAttrs(attrs) {
  const cls = attrs.match(/\sclass="([^"]*)"/);
  const rest = attrs.replace(/\sclass="[^"]*"/, '');
  return { classes: cls ? ' ' + cls[1] : '', rest };
}
let blocks = 0;
let files = 0;
const unmapped = new Set();

for (const page of await distPages(DIST)) {
  const file = page.file;
  let html = page.html;
  if (!BLOCK.test(html)) continue;
  BLOCK.lastIndex = 0;
  let changed = false;
  let out = '';
  let last = 0;
  for (const m of html.matchAll(BLOCK)) {
    const { classes, rest } = mergeAttrs(m[1]);
    const code = decodeEntities(m[2]);
    const lang = detectLang(code);
    let hl = await codeToHtml(code, {
      lang,
      theme: 'github-light',
      colorReplacements: COLOR_MAP,
    });
    // our CSS owns the pre's box (bg, padding, radius, overflow) — strip
    // shiki's inline style, merging the source pre's own attributes back
    // in. The strip must actually strip (grill E1: a silent no-op would
    // leak shiki's inline box styles while every gate stayed green).
    const stripped = hl.replace(
      /^<pre class="shiki[^"]*" style="[^"]*"/,
      `<pre class="code-hl${classes}"${rest}`,
    );
    if (stripped === hl) {
      console.error(`highlight-code: strip failed — shiki's <pre> shape changed:\n${hl.slice(0, 120)}`);
      process.exit(1);
    }
    hl = stripped;
    for (const hex of hl.matchAll(/(?:color|background-color):(#[0-9a-fA-F]{3,6})/g)) unmapped.add(hex[1]);
    out += html.slice(last, m.index) + hl;
    last = m.index + m[0].length;
    blocks++;
    changed = true;
  }
  if (changed) {
    out += html.slice(last);
    await writeFile(file, out);
    files++;
  }
}

if (unmapped.size) {
  console.error(`highlight-code: unmapped theme colors (add to COLOR_MAP): ${[...unmapped].join(', ')}`);
  process.exit(1);
}

// None-left-behind gate (Slice 21 grill E1): the success counter above is
// structurally unable to report blocks the matcher SKIPPED — so re-scan
// the whole dist for any surviving un-highlighted <pre><code> and fail
// loudly, listing where. Zero blocks total is equally a failure.
const leftovers = [];
for (const page of await distPages(DIST)) {
  const file = page.file;
  const html = page.html;
  for (const m of html.matchAll(/<pre(?![^>]*\bcode-hl\b)[^>]*><code[\s>]/g)) {
    leftovers.push(`${file.replace(DIST, '')} @${m.index}`);
  }
}
if (leftovers.length || blocks === 0) {
  console.error(
    blocks === 0
      ? 'highlight-code: matched ZERO blocks — the matcher or the page shapes drifted'
      : `highlight-code: ${leftovers.length} un-highlighted block(s) left behind:\n  ${leftovers.join('\n  ')}`,
  );
  process.exit(1);
}
console.log(`highlight-code: ${blocks} block(s) highlighted across ${files} page(s) — all colors token-mapped, none left behind`);
