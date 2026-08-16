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
import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { codeToHtml } from 'shiki';

const DIST = new URL('../dist', import.meta.url).pathname;

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

function unescapeHtml(s) {
  return s
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&#x27;', "'")
    .replaceAll('&#38;', '&')
    .replaceAll('&amp;', '&'); // last — it guards double-escapes
}

async function* htmlFiles(dir) {
  for (const e of await readdir(dir)) {
    const p = join(dir, e);
    if ((await stat(p)).isDirectory()) yield* htmlFiles(p);
    else if (e === 'index.html') yield p;
  }
}

const BLOCK = /<pre><code>([\s\S]*?)<\/code><\/pre>/g;
let blocks = 0;
let files = 0;
const unmapped = new Set();

for await (const file of htmlFiles(DIST)) {
  const html = await readFile(file, 'utf8');
  if (!BLOCK.test(html)) continue;
  BLOCK.lastIndex = 0;
  let changed = false;
  let out = '';
  let last = 0;
  for (const m of html.matchAll(BLOCK)) {
    const code = unescapeHtml(m[1]);
    const lang = detectLang(code);
    let hl = await codeToHtml(code, {
      lang,
      theme: 'github-light',
      colorReplacements: COLOR_MAP,
    });
    // our CSS owns the pre's box (bg, padding, radius, overflow) — strip
    // shiki's inline style; keep tabindex (keyboard-reachable scroll).
    hl = hl.replace(/^<pre class="shiki[^"]*" style="[^"]*"/, '<pre class="code-hl"');
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
console.log(`highlight-code: ${blocks} block(s) highlighted across ${files} page(s) — all colors token-mapped`);
