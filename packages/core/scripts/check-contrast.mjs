/**
 * Computes WCAG contrast ratios for the framework's documented token-role
 * pairs, in BOTH themes, from the actual token values — and fails the build
 * if a pair drops below its threshold. The docs Colors page renders its
 * ratio tables FROM dist/contrast.json, so published ratios cannot drift
 * (site-proposal grill F3: never hand-typed accessibility claims).
  *
 * @heuristic — RETAGGED 374.7. The ratio half is still equality and the
 * literal-colour report still contributes nothing to the exit code, but the
 * EDGE coverage half added by 374.7 rests on RECOGNISING that a declaration
 * paints a boundary, from its property name. That can be fooled and was:
 * reading the first `var()` took `--bo-border-width`, a LENGTH, as the edge
 * colour on 22 of 33 sites, and reading a use site took the local
 * `--bo-btn-border` as a token, inventing a pairing no element holds. Carries
 * --self-test, which drives `edgePairOf` against inputs it must tell apart.
*/
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { contrastRatio } from './wcag.mjs';

const EDGE_PROP = /^(border(-(block|inline)(-(start|end))?)?(-color)?|outline(-color)?)$/;
const LOCAL_EDGE = /^--bo-[a-z-]*-border$/;
const LOCAL_BG = /^--bo-[a-z-]*-bg$/;
/* A container's edge is not what identifies it — its fill, its position and
   its contents are, and the hairline only separates it from what it sits on.
   One shared reason because it is genuinely one decision, applied per site
   below so each remains a named entry rather than a token-wide waiver. */

/* The recognition this gate rests on, in one place so `--self-test` can drive
   it directly rather than through the filesystem. */
export function edgePairOf(rule) {
  let edge, ground;
  const semantic = (v) => [...v.matchAll(/var\((--bo-(?:color|state)-[a-z0-9-]+)/g)].map((x) => x[1]);
  rule.walkDecls((d) => {
    if (LOCAL_EDGE.test(d.prop)) { edge = edge ?? semantic(d.value)[0]; return; }
    if (LOCAL_BG.test(d.prop)) { ground = ground ?? semantic(d.value)[0]; return; }
    if (EDGE_PROP.test(d.prop)) { edge = edge ?? semantic(d.value)[0]; return; }
    if (/^background(-color)?$/.test(d.prop)) { ground = ground ?? semantic(d.value)[0]; }
  });
  return { edge, ground };
}

/* --self-test: drive `edgePairOf` against inputs it must classify correctly,
   and exit non-zero if it cannot tell them apart. Every case below is one the
   detector ACTUALLY got wrong while being built, plus the two it must keep
   getting right, so this is a regression net rather than ceremony. */
if (process.argv.includes('--self-test')) {
  const { default: pc } = await import('postcss');
  const one = (css) => { let out = null; pc.parse(css).walkRules((r) => { out = out ?? edgePairOf(r); }); return out; };
  const cases = [
    ['a LENGTH first in the shorthand is not the edge colour',
      '.x{background:var(--bo-color-bg-surface);border:var(--bo-border-width) solid var(--bo-color-border-strong)}',
      { edge: '--bo-color-border-strong', ground: '--bo-color-bg-surface' }],
    ['a LOCAL prop at its USE site resolves to nothing — no phantom pairing',
      '.x{background:var(--bo-color-accent-solid);border:1px solid var(--bo-btn-border)}',
      { edge: undefined, ground: '--bo-color-accent-solid' }],
    ['a LOCAL prop at its ASSIGNMENT contributes the token it is given',
      '.x{--bo-btn-border:var(--bo-color-border-strong);--bo-btn-bg:var(--bo-color-bg-surface)}',
      { edge: '--bo-color-border-strong', ground: '--bo-color-bg-surface' }],
    ['a text colour is not an edge',
      '.x{color:var(--bo-color-text-primary);background:var(--bo-color-bg-surface)}',
      { edge: undefined, ground: '--bo-color-bg-surface' }],
    ['outline counts as an edge',
      '.x{background:var(--bo-color-bg-muted);outline:2px solid var(--bo-color-focus-ring)}',
      { edge: '--bo-color-focus-ring', ground: '--bo-color-bg-muted' }],
    ['a logical border longhand counts as an edge',
      '.x{background:var(--bo-color-bg-surface);border-inline-start:1px solid var(--bo-color-border-default)}',
      { edge: '--bo-color-border-default', ground: '--bo-color-bg-surface' }],
  ];
  let bad = 0;
  for (const [name, css, want] of cases) {
    const got = one(css);
    const ok = got.edge === want.edge && got.ground === want.ground;
    if (!ok) { bad++; console.error(`  FAIL ${name}\n       want ${JSON.stringify(want)}\n       got  ${JSON.stringify(got)}`); }
  }
  if (bad) { console.error(`contrast --self-test FAILED — ${bad} of ${cases.length} case(s)`); process.exit(1); }
  console.log(`contrast --self-test passed — ${cases.length} cases covering edge recognition, including the two the detector got wrong while being built`);
  process.exit(0);
}


const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
// The raw palette steps live in the generated scales.css since Slice 22;
// color.css holds the semantic tier that aliases them — the scan needs
// BOTH to resolve var chains (reading only color.css silently dropped
// every pair whose token aliases a scale step).
const css =
  (await readFile(join(pkgRoot, 'src/css/tokens/scales.css'), 'utf8')) +
  (await readFile(join(pkgRoot, 'src/css/tokens/color.css'), 'utf8'));

// Parse `--bo-x: value;` declarations per scope (light :root vs dark block).
function parseScope(block) {
  const vars = {};
  for (const m of block.matchAll(/(--bo-[a-z0-9-]+)\s*:\s*([^;]+);/g)) vars[m[1]] = m[2].trim();
  return vars;
}
const darkStart = css.indexOf('[data-theme="dark"]');
const light = parseScope(css.slice(0, darkStart));
const dark = { ...light, ...parseScope(css.slice(darkStart)) };

function resolve(vars, value, depth = 0) {
  if (depth > 10) return null;
  const m = value.match(/^var\(\s*(--bo-[a-z0-9-]+)\s*\)$/);
  if (m) return vars[m[1]] ? resolve(vars, vars[m[1]], depth + 1) : null;
  return value;
}

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
}
/* The arithmetic lives in wcag.mjs — this gate, check-claims and (necessarily,
   from inside a page) check-search all needed it, and one formula stored three
   times is how the source-skip list and the outcome vocabulary drifted before.
   Proved equivalent on five vectors to 1e-12 before merging. */
const ratio = (fgHex, bgHex) => contrastRatio(hexToRgb(fgHex), hexToRgb(bgHex));

// The documented role pairs. threshold: 4.5 text, 3 non-text.
const PAIRS = [
  ['--bo-color-text-primary', '--bo-color-bg-surface', 4.5],
  ['--bo-color-text-primary', '--bo-color-bg-canvas', 4.5],
  ['--bo-color-text-secondary', '--bo-color-bg-surface', 4.5],
  ['--bo-color-text-secondary', '--bo-color-bg-muted', 4.5],
  ['--bo-color-text-muted', '--bo-color-bg-surface', 4.5],
  ['--bo-color-text-muted', '--bo-color-bg-muted', 4.5],
  ['--bo-color-text-inverse', '--bo-color-accent-solid', 4.5],
  ['--bo-color-text-inverse', '--bo-color-danger-solid', 4.5],
  ['--bo-color-bg-surface', '--bo-color-text-primary', 4.5], // inverted type chip

  ['--bo-color-accent-text', '--bo-color-accent-subtle', 4.5],
  ['--bo-color-danger-text', '--bo-color-danger-subtle', 4.5],
  ['--bo-color-warning-text', '--bo-color-warning-subtle', 4.5],
  ['--bo-color-success-text', '--bo-color-success-subtle', 4.5],
  // Amount negative/positive ink sits on plain surfaces (cards, table cells),
  // not just the tinted *-subtle backgrounds — verify it stays readable there.
  ['--bo-color-danger-text', '--bo-color-bg-surface', 4.5],
  ['--bo-color-danger-text', '--bo-color-bg-canvas', 4.5],
  ['--bo-color-success-text', '--bo-color-bg-surface', 4.5],
  ['--bo-color-success-text', '--bo-color-bg-canvas', 4.5],
  ['--bo-color-accent', '--bo-color-bg-surface', 4.5], // links
  ['--bo-color-text-primary', '--bo-color-bg-hover', 4.5], // table hover rows
  ['--bo-color-text-primary', '--bo-color-bg-selected', 4.5], // selected rows
  // A dropzone under a drag repaints to bg-selected and its constraint hint
  // rides along — the one line the user most needs to read at that moment.
  // Adding this pair is what found that the hint's resting text-muted lands
  // at 3.59-4.31 on the four DARK brand presets, so the hint steps up to
  // text-secondary while dragging (roadmap 373.1). The coverage scan cannot
  // see this pair at all: fg and bg are set in two different rules, and it
  // pairs only within one rule.
  ['--bo-color-text-secondary', '--bo-color-bg-selected', 4.5],
  ['--bo-color-accent-text', '--bo-color-bg-selected', 4.5], // aria-pressed buttons
  ['--bo-color-text-primary', '--bo-color-bg-surface-raised', 4.5], // dialog/menu
  ['--bo-color-text-secondary', '--bo-color-bg-canvas', 4.5], // muted-on-canvas
  ['--bo-color-border-control', '--bo-color-bg-surface', 3],
  /* Edge pairings surfaced by the 374.7 coverage extension. Each identifies a
     STATE rather than bounding a container, so each is gated at 3:1 rather
     than exempted: the calendar's selected day, an invalid field inside a
     data-table, and an active filter chip. */
  ['--bo-color-accent', '--bo-color-bg-selected', 3],
  ['--bo-state-error-color', '--bo-color-bg-surface', 3],
  ['--bo-color-accent', '--bo-color-accent-subtle', 3],
  // Seamless (WYSIWYG) cells: on a hovered/striped row the revealed
  // border is the ONLY editability affordance (grill 2026-08-16).
  ['--bo-color-border-control', '--bo-color-bg-hover', 3],
  ['--bo-color-border-control', '--bo-color-bg-muted', 3],
  ['--bo-color-focus-ring', '--bo-color-bg-canvas', 3],
  // .bo-progress fill on its track — non-text UI component (WCAG 1.4.11, 3:1)
  ['--bo-color-accent', '--bo-color-bg-muted', 3],
  ['--bo-color-warning-strong', '--bo-color-bg-muted', 3],
  // The external-visibility edge on a composer/entry: a non-text UI indicator
  // (SC 1.4.11) sitting on the surface a thread is drawn on, not on muted.
  ['--bo-color-warning-strong', '--bo-color-bg-surface', 3],
  ['--bo-color-danger', '--bo-color-bg-muted', 3],
  // Slice 20 code-highlighting palette sits on bg-muted — every slot is
  // TEXT, so every pair gates at 4.5 (the pre-existing 3:1 entries for
  // accent/warning-strong/danger on muted were non-text fills).
  ['--bo-color-text-primary', '--bo-color-bg-muted', 4.5],
  ['--bo-color-success-text', '--bo-color-bg-muted', 4.5],
  ['--bo-color-accent', '--bo-color-bg-muted', 4.5],
  ['--bo-color-warning-strong', '--bo-color-bg-muted', 4.5],
  ['--bo-color-danger-text', '--bo-color-bg-muted', 4.5],
];
const PAIR_KEY = (fg, bg) => `${fg}|${bg}`;
const KNOWN = new Set(PAIRS.map(([f, b]) => PAIR_KEY(f, b)));

const report = { generated: 'by scripts/check-contrast.mjs — do not edit', themes: {} };
let failures = 0;

for (const [theme, vars] of [['light', light], ['dark', dark]]) {
  report.themes[theme] = [];
  for (const [fgTok, bgTok, threshold] of PAIRS) {
    const fg = resolve(vars, vars[fgTok] ?? '');
    const bg = resolve(vars, vars[bgTok] ?? '');
    if (!fg?.startsWith('#') || !bg?.startsWith('#')) {
      report.themes[theme].push({ fg: fgTok, bg: bgTok, skipped: `unresolvable (${fg} / ${bg})` });
      continue;
    }
    const r = Math.round(ratio(fg, bg) * 100) / 100;
    const pass = r >= threshold;
    if (!pass) failures++;
    report.themes[theme].push({ fg: fgTok, bg: bgTok, fgValue: fg, bgValue: bg, ratio: r, threshold, pass });
    console.log(`${pass ? '  ok ' : 'FAIL '}[${theme}] ${fgTok} on ${bgTok}: ${r} (>= ${threshold})`);
  }
}

// Brand presets (src/css/brand/*.css) re-skin the accent family via an
// unlayered override — validate each one the SAME way as the base theme:
// merge its declared tokens over the base light/dark vars, then re-run
// every PAIR. A brand file that doesn't touch a given pair just reproduces
// the already-passing base result, so re-checking all of them is cheap and
// correct rather than trying to guess which pairs a given file touches.
report.brands = {};
const brandVars = {}; // theme-merged vars per brand key, for the readings below (377.8)
try {
  const brandDir = join(pkgRoot, 'src/css/brand');
  const brandFiles = (await readdir(brandDir)).filter((f) => f.endsWith('.css'));
  for (const file of brandFiles) {
    const name = file.replace(/\.css$/, '');
    const brandCss = await readFile(join(brandDir, file), 'utf8');
    const brandDarkStart = brandCss.indexOf('[data-theme="dark"]');
    const brandLight = parseScope(brandDarkStart === -1 ? brandCss : brandCss.slice(0, brandDarkStart));
    const brandDark =
      brandDarkStart === -1 ? {} : parseScope(brandCss.slice(brandDarkStart));

    for (const [theme, base, override] of [
      ['light', light, brandLight],
      ['dark', dark, brandDark],
    ]) {
      const vars = { ...base, ...override };
      const key = `${name}-${theme}`;
      brandVars[key] = vars;
      report.brands[key] = [];
      for (const [fgTok, bgTok, threshold] of PAIRS) {
        const fg = resolve(vars, vars[fgTok] ?? '');
        const bg = resolve(vars, vars[bgTok] ?? '');
        if (!fg?.startsWith('#') || !bg?.startsWith('#')) continue;
        const r = Math.round(ratio(fg, bg) * 100) / 100;
        const pass = r >= threshold;
        if (!pass) failures++;
        report.brands[key].push({ fg: fgTok, bg: bgTok, fgValue: fg, bgValue: bg, ratio: r, threshold, pass });
        if (!pass) console.log(`FAIL [brand:${key}] ${fgTok} on ${bgTok}: ${r} (>= ${threshold})`);
      }
      console.log(`  ok [brand:${key}] ${report.brands[key].length} pairs checked`);
    }
  }
} catch (e) {
  if (e.code !== 'ENOENT') throw e; // no src/css/brand dir yet is fine
}

// Coverage guard (site-grill S-4): a component that pairs a text token on a
// background token the PAIRS list doesn't cover is a silent contrast gap.
// Scan component + primitive CSS for `color:` and `background*:` token usage
// within the same rule and assert each fg/bg combination is a KNOWN pair.
import { readdir } from 'node:fs/promises';
import postcss from 'postcss';
import { srcCssFiles } from './src-css-files.mjs';
/* EDGE COVERAGE (roadmap 374.7). The guard below this reconciles TEXT pairs
   against the CSS. It could not see an EDGE at all: it binds `fg` only when
   `d.prop === 'color'`, so `border-color:` matched none of its branches and
   the three `--bo-color-border-control` rows were hand-maintained with nothing
   noticing a fourth. Measured: 30 edge pairings ship, 11 distinct, and exactly
   one of them was in PAIRS.

   WHAT THIS CAN AND CANNOT DECIDE. WCAG 1.4.11 asks 3:1 of the visual
   information REQUIRED TO IDENTIFY a control. Whether an edge is required is a
   question about the whole rendered element — its fill, its label, its icon,
   its neighbours — and no regex over CSS answers it. `--bo-color-border-strong`
   at 1.34:1 is `.bo-kbd`'s decorative keycap AND `.bo-btn--secondary`'s control
   boundary: same token, same ratio, opposite verdicts. So the enforceable
   property is a SHAPE, exactly `check:wrong-choice`'s bargain — every edge
   pairing is in PAIRS at 3:1, or in EDGE_EXEMPT with a reason NAMING the other
   channel that identifies the thing, or in EDGE_TODO as debt. What the reason
   SAYS is a human call this gate does not pretend to make; whether one is
   there is not.

   TWO THINGS THE PROBE FOR THIS GOT WRONG FIRST, kept as the reason the
   parsing is shaped the way it is. Taking the first `var()` read
   `--bo-border-width` — a LENGTH — as the edge colour on 22 of 33 sites. And
   taking a use site's token read `--bo-btn-border`, a local property, as the
   edge, inventing `--bo-btn-border on accent-solid`: a pairing no element
   holds, because `.bo-btn` sets the fill and `--secondary` sets the edge. So:
   only semantic `--bo-color-*` / `--bo-state-*` tokens count, an assignment
   contributes its VALUE, and a use site contributes only when it names a
   semantic token directly. */
const DIVIDER = 'container hairline: the box is identified by its fill, position and contents; the edge only separates it';
const EDGE_EXEMPT = new Map([
  ['badge:--bo-color-border-default|--bo-color-bg-muted', DIVIDER],
  ['dashboard:--bo-color-border-default|--bo-color-bg-surface', DIVIDER],
  ['dashboard:--bo-color-border-default|--bo-color-bg-muted', DIVIDER],
  ['data-table:--bo-color-border-default|--bo-color-bg-surface', DIVIDER],
  ['dialog:--bo-color-border-default|--bo-color-bg-muted', DIVIDER],
  ['dropdown:--bo-color-border-default|--bo-color-bg-surface-raised', DIVIDER],
  ['combobox:--bo-color-border-default|--bo-color-bg-surface-raised', DIVIDER],
  ['filters:--bo-color-border-default|--bo-color-bg-surface', DIVIDER],
  ['form:--bo-color-border-default|--bo-color-bg-surface', DIVIDER],
  ['form:--bo-color-border-default|--bo-color-bg-canvas', DIVIDER],
  ['navbar:--bo-color-border-default|--bo-color-bg-surface', DIVIDER],
  ['richtext:--bo-color-border-default|--bo-color-bg-muted', DIVIDER],
  ['sidebar-nav:--bo-color-border-default|--bo-color-bg-surface', DIVIDER],
  ['kbd:--bo-color-border-strong|--bo-color-bg-muted',
    'decorative keycap: the glyph inside is the content and the fill carries the key shape; nothing is operated here'],
  ['segmented:--bo-color-border-default|--bo-color-bg-muted',
    'track, not control: the options inside carry the selected state (fill + weight + aria-checked); the track edge only bounds them'],
  ['scan:--bo-color-text-primary|--bo-color-success', 'transient scan-flash frame, composited at <=0.3 opacity for ~700ms, so a token pair is not what renders; its visibility against the wash is asserted in RENDERED pixels by check:claims (389.4), and the verdict also reaches the live region'],
  ['scan:--bo-color-text-primary|--bo-color-danger', 'transient scan-flash frame, composited at <=0.3 opacity for ~700ms, so a token pair is not what renders; its visibility against the wash is asserted in RENDERED pixels by check:claims (389.4), and the verdict also reaches the live region'],
]);
/* Debt, not a decision — an edge that SHOULD meet 3:1 and does not yet. Kept
   apart from EDGE_EXEMPT for the reason check:wrong-choice keeps its TODO
   apart: one list is where reasoned choices live and the other is where
   unfinished work lives, and merging them is how an exemption map becomes a
   place to hide reds. Every entry here is an interactive control boundary
   where the fill does not identify the control (all measured 1.00-1.17:1
   against their surroundings), so the edge is the only non-text channel.
   Tracked as roadmap 374.4; this list shrinks as that lands. */
const EDGE_TODO = new Map([
  ['button:--bo-color-border-strong|--bo-color-bg-surface', '.bo-btn--secondary at 1.47:1 light / 1.70 dark — 374.4'],
  ['file-upload:--bo-color-border-strong|--bo-color-bg-surface', '::file-selector-button, same recipe as btn--secondary — 374.4'],
  ['file-upload:--bo-color-border-strong|--bo-color-bg-muted', '.bo-file-dropzone dashed edge at 1.34/1.45 — its own comment says the border is what makes the box droppable — 374.4'],
  ['filters:--bo-color-border-strong|--bo-color-bg-muted', '.bo-chip at 1.34/1.45; partial — the label helps, the edge still carries the affordance'],
  ['file-upload:--bo-color-accent-solid|--bo-color-bg-selected', 'dragover edge reads 1.82-2.36 in DARK across all six presets; light passes. Three-channel cue (dashed->solid, fill, edge), so a 1.4.11 miss on one channel'],
]);
const edgeUncovered = new Set();
const edgeSeen = new Set();

const IGNORE_BG = new Set([
  '--bo-color-bg-muted', // header cells carry secondary text, covered
]);
const uncovered = new Set();
// What this scan STRUCTURALLY CANNOT SEE, counted and reported rather than
// left to the pass line's imagination (roadmap 241.2). Every branch below
// keys off `var(--bo-color-*)`, so a raw colour value — a hex, an rgb()/hsl(),
// a named colour, or a hex inside a `data:` URI — matches nothing and is
// skipped in silence. The gate then printed "coverage verified against
// component CSS", which is a claim about a set it never enumerated:
// CLAUDE.md's "a derived artefact may not decide, on its own, what it failed
// to see. Assert the count, not just the content." Same treatment as
// check:rtl warning that DESIGN.md's flip-site count was NOT verified rather
// than reporting a clean pass it did not earn.
//
// REPORT, not gate, and deliberately: 26 of the 46 are icon.css glyph URIs
// consumed by `mask-image`, so adding an icon legitimately grows this number
// and a ratchet over it would go red on a correct tree (236.2's reasoning).
// It contributes nothing to the exit code, which is why the @exact tag above
// still holds — the verdict is still ratios and token pairs.
//
// Every colour form, not just hex: counting hex alone would under-report, and
// under-reporting is the exact defect this line exists to fix. Measured
// 2026-09-02 — components + primitives carry 46 such declarations, all of them
// hex or %23-hex, with zero rgb()/hsl()/oklch()/named-colour uses and zero
// `url(#fragment)` sites for the hex pattern to trip on.
const LITERAL_COLOUR =
  /(?:^|[^\w&])#[0-9a-fA-F]{3,8}\b|%23[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(|\b(?:oklch|oklab|lab|lch)\(|\b(?:white|black|red|green|blue|gray|grey|silver|maroon|yellow|olive|lime|aqua|teal|navy|fuchsia|purple|orange)\b/;
const literalFiles = new Map();
let literalDecls = 0;
// Row/surface backgrounds are often applied by CUSTOM-PROPERTY INDIRECTION
// (e.g. --bo-cell-bg: var(--bo-color-bg-selected) on a <tr>, text inherited) —
// those pairs never co-occur in one rule, so also require body text (text-
// primary) coverage for any surface token assigned to a *-bg custom property.
const INDIRECT_BG_PROP = /--bo-[a-z-]*(?:cell-)?bg[a-z-]*$/;
for (const dir of ['components', 'primitives']) {
  for await (const f of srcCssFiles(join(pkgRoot, 'src/css', dir))) {
    const rel = f.replace(pkgRoot + '/', '');
    const root = postcss.parse(await readFile(f, 'utf8'));
    root.walkDecls((d) => {
      if (!LITERAL_COLOUR.test(d.value)) return;
      literalDecls++;
      literalFiles.set(rel, (literalFiles.get(rel) ?? 0) + 1);
    });
    root.walkRules((rule) => {
      let fg, bg;
      rule.walkDecls((d) => {
        const m = d.value.match(/var\((--bo-color-[a-z0-9-]+)/);
        if (!m) return;
        if (d.prop === 'color') fg = m[1];
        else if (/^background/.test(d.prop)) bg = m[1];
        // indirection: a bg-ish custom prop assigned a surface token
        else if (INDIRECT_BG_PROP.test(d.prop) && /bg-/.test(m[1]) && !IGNORE_BG.has(m[1])) {
          if (!KNOWN.has(PAIR_KEY('--bo-color-text-primary', m[1])))
            uncovered.add(`--bo-color-text-primary on ${m[1]} [via ${d.prop}] (${rel})`);
        }
      });
      if (fg && bg && /text|accent|danger|warning|success/.test(fg) && /bg-/.test(bg) && !IGNORE_BG.has(bg)) {
        if (!KNOWN.has(PAIR_KEY(fg, bg))) uncovered.add(`${fg} on ${bg} (${rel})`);
      }

      /* EDGE side. Same rule node, so the edge and the ground it sits on are
         the ones an element actually holds together — no cross-rule
         resolution, which is where the phantom pairing came from. */
      const { edge, ground } = edgePairOf(rule);
      // An edge painted in its own fill is mass, not a boundary — exact, not a judgement.
      if (!edge || !ground || edge === ground) return;
      const comp = rel.replace(/^src\/css\/[a-z]+\//, '').replace(/\/[^/]+$/, '');
      const siteKey = `${comp}:${edge}|${ground}`;
      edgeSeen.add(siteKey);
      if (KNOWN.has(PAIR_KEY(edge, ground))) return;
      if (EDGE_EXEMPT.has(siteKey) || EDGE_TODO.has(siteKey)) return;
      edgeUncovered.add(`${edge} on ${ground} (${rel}) [site key: ${siteKey}]`);
    });
  }
}

/* PUBLISHED READINGS for what this gate adjudicates but does not gate (roadmap
   377.8). The ACR's 1.4.11 and 2.4.7 remarks were hand-typed literals — "1.34-
   1.70:1", "2.99:1 on bg-muted under forest", "cannot see a border-color at all"
   — and the last was already false when 374.7 added the edge half above. So the
   verdicts and the measured ratios are written here, from the same token
   values and the same edge scan, and extract-acr.mjs builds both rows from
   them. Change a token and the published remark moves with it. */
const ratioIn = (vars, fgTok, bgTok) => {
  const fg = resolve(vars, vars[fgTok] ?? '');
  const bg = resolve(vars, vars[bgTok] ?? '');
  return fg?.startsWith('#') && bg?.startsWith('#') ? Math.round(ratio(fg, bg) * 100) / 100 : null;
};
const everywhere = (fgTok, bgTok) =>
  [['light', light], ['dark', dark], ...Object.entries(brandVars)]
    .map(([where, vars]) => ({ where, ratio: ratioIn(vars, fgTok, bgTok) }))
    .filter((r) => r.ratio != null);
const pairOfSite = (site) => site.split(':')[1].split('|');
report.edges = {
  seen: edgeSeen.size,
  gated: [...edgeSeen].filter((k) => KNOWN.has(PAIR_KEY(...pairOfSite(k)))).length,
  exempt: EDGE_EXEMPT.size,
  todo: [...EDGE_TODO].map(([site, why]) => {
    const [fg, bg] = pairOfSite(site);
    return { site, component: site.split(':')[0], fg, bg, why, readings: everywhere(fg, bg) };
  }),
};
/* The ring is an `outline` with an offset, so it paints on whatever sits behind
   the control. These are the grounds a focusable control sits on in the shipped
   CSS; the gate FAILS only on the PAIRS rows, and reports the rest here. */
const RING = '--bo-color-focus-ring';
const RING_GROUNDS = ['--bo-color-bg-canvas', '--bo-color-bg-surface', '--bo-color-bg-surface-raised', '--bo-color-bg-muted', '--bo-color-bg-selected'];
report.focusRing = {
  token: RING,
  gatedOn: PAIRS.filter(([f]) => f === RING).map(([, b]) => b),
  grounds: RING_GROUNDS,
  readings: RING_GROUNDS.flatMap((ground) => everywhere(RING, ground).map((r) => ({ ground, ...r }))),
};
if (!report.focusRing.readings.length || report.edges.todo.some((t) => !t.readings.length)) {
  console.error('contrast: a published reading resolved to nothing — the ACR would quote an empty set');
  process.exit(1);
}

await mkdir(join(pkgRoot, 'dist'), { recursive: true });
await writeFile(join(pkgRoot, 'dist/contrast.json'), JSON.stringify(report, null, 2));

/* A stale entry is as bad as a missing one: an exemption whose site no longer
   paints that pairing is a decision about nothing, and it would quietly widen
   the gate. Same rung as check-wrong-choice's staleness check. */
const staleEdge = [...EDGE_EXEMPT.keys(), ...EDGE_TODO.keys()].filter((k) => !edgeSeen.has(k));
if (staleEdge.length) {
  console.error(`\ncontrast EDGE list is stale: ${staleEdge.length} entr(y/ies) name a pairing that is no longer painted:`);
  for (const k of staleEdge) console.error('  ' + k);
  process.exit(1);
}
const emptyReason = [...EDGE_EXEMPT, ...EDGE_TODO].filter(([, why]) => !why || !why.trim());
if (emptyReason.length) {
  console.error(`\ncontrast EDGE entr(y/ies) carry no reason: ${emptyReason.map(([k]) => k).join(', ')}`);
  process.exit(1);
}
if (edgeUncovered.size) {
  console.error(`\ncontrast EDGE coverage gap: ${edgeUncovered.size} edge pairing(s) in CSS that are neither gated, exempt, nor tracked as debt:`);
  for (const u of edgeUncovered) console.error('  ' + u);
  console.error('  Add a PAIRS row at 3 if the edge identifies the control, or an EDGE_EXEMPT');
  console.error('  entry naming the other channel that does, or an EDGE_TODO entry if it should');
  console.error('  meet 3:1 and does not yet. What the reason says is yours; that one exists is not.');
  process.exit(1);
}
if (uncovered.size) {
  console.error(`\ncontrast COVERAGE gap: ${uncovered.size} token pair(s) used in CSS but not in the checked PAIRS list:`);
  for (const u of uncovered) console.error('  ' + u);
  process.exit(1);
}
if (failures) {
  console.error(`\ncontrast check FAILED: ${failures} pair(s) below threshold`);
  process.exit(1);
}
console.log(
  `contrast check passed — ${PAIRS.length} pairs x 2 themes, TOKEN-PAIR coverage verified against component CSS;\n  ${edgeSeen.size} edge pairing(s) adjudicated: ${EDGE_EXEMPT.size} exempt with a stated reason, ${EDGE_TODO.size} tracked as debt (roadmap 374.4), the rest gated`
);
console.log(
  `  NOT covered by that scan: ${literalDecls} declaration(s) in ${literalFiles.size} file(s) ` +
    `carry a raw colour value instead of a var(--bo-color-*), so the coverage guard cannot see them ` +
    `(reported, not gated — roadmap 241.2):`
);
for (const [rel, n] of [...literalFiles].sort((a, b) => b[1] - a[1]))
  console.log(`    ${String(n).padStart(3)}  ${rel}`);
