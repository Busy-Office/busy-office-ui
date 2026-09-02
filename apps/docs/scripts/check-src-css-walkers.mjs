/**
 * Gate over the gates: no script under `packages/core/scripts` may roll its own
 * recursive walk of the AUTHORED stylesheet tree — `src-css-files.mjs` is the
 * one chokepoint (roadmap 244.2, gated by 244.4).
 *
 * WHY A GATE AND NOT A CONVENTION. The identical convention was tried twice on
 * the docs side and regrew twice: dist-pages.mjs was extracted 2026-08-18 to
 * end four forked walkers with two different page counts; three days later
 * there were six forks and four counts (103.1); and within days of THAT
 * consolidation, component-scores.mjs regrew a private walker (2026-08-21).
 * Nothing noticed either regrowth for days. On this side the disagreement was
 * already present when 244.2 looked: three byte-identical `cssFiles` copies
 * (md5 c091aeb7…) plus a fourth in generate-scales.mjs with a different
 * exclusion set.
 *
 * WHY IT LIVES IN apps/docs/scripts. It reads core's scripts as TEXT; it does
 * not import them. A gate wired into core's own build chain could not import
 * this directory at all — `examples/po-app/Dockerfile` runs
 * `npm run build -w @busy-office/ui` in a context holding `packages` and
 * `apps/docs/package.json` only, which is exactly how `check:rtl`'s DESIGN.md
 * assertion broke that image build. `check-selftests.mjs` is the precedent:
 * a repo-wide gate here that scans `['apps/docs/scripts', 'packages/core/scripts']`
 * by source text via REPO_ROOT.
 *
 * WHAT THE BASE RATE ACTUALLY IS, and it corrects 244.4's own premise. That
 * item says the predicate is "true of every core script but one". That holds
 * for the predicate below and NOT for the one its first criterion words
 * ("enumerates `src/css` itself"), which is a different and much wider
 * question. Measured over the 26 scripts in packages/core/scripts:
 *
 *   defines its own RECURSIVE .css walker over src/css   2  (both exempt below)
 *   names src/css and lists a directory at all           7
 *
 * The seven include build-component-css.mjs, extract-api.mjs, extract-acr.mjs
 * and extract-keymap.mjs, which enumerate `src/css/components` as a DIRECTORY
 * STRUCTURE — one entry per component dir, then the files inside it. A flat
 * file stream cannot express that, so `srcCssFiles` is not what they should be
 * calling and gating them would mean exempting six of twenty-six scripts:
 * exempting the tree rather than gating it. This gate takes the narrow
 * predicate, which is the shape that actually drifted and actually regrew.
 *
 * So what this buys is a RATCHET, not a discovery: it is green on the tree it
 * landed against, exactly as check-dist-walkers.mjs was on 2026-08-22.
 *
 * @heuristic — recognises "rolls its own recursive .css walk" from source
 *   text: a named function that lists a directory, calls ITSELF, and filters
 *   `.css`, in a file that names src/css. Recursion is the signal that
 *   separates this from a single-level `readdir(componentsDir)`, and a
 *   function that is merely long could in principle be misread, so it ships
 *   --self-test — including the two discriminations that matter: a
 *   single-level component-dir listing is NOT flagged, and dist-css.mjs's
 *   recursive .css walker over a DIFFERENT tree is NOT flagged.
 */
import { join } from 'node:path';
import { REPO_ROOT } from './paths.mjs';
import { selfTest } from './gate-report.mjs';
import { blankComments, namedFunctions, callsItself, chokepointGate } from './gate-source-scan.mjs';

/* The chokepoint itself, and the one honest copy. Reasons live in the Map so
   they cannot drift away from the entry that grants them. */
const EXEMPT = new Map([
  ['src-css-files.mjs', 'the chokepoint itself'],
  [
    'generate-scales.mjs',
    'excludes /scales/ and scales* so it never reads its own generated output back as input — a third tree rule, kept as an honest copy per dist-css.mjs 2026-08-17',
  ],
]);

/* dist-css.mjs is deliberately NOT exempted. It is a recursive .css walker,
   but over packages/core/dist/css, so the tree test below already excludes it.
   Excluding it by TREE rather than by NAME is the stronger arrangement: if it
   were ever repointed at src/css, an exemption would hide that and the
   predicate catches it. */

const LIST_CALL = /\b(?:readdir(?:Sync)?|opendir(?:Sync)?|glob(?:Sync)?)\s*\(/;
/** The authored tree, in every spelling used here: a quoted path containing
 *  `src/css`, the `srcCss`/`srcCssRoot` bindings, or join()'s `'src', 'css'`. */
const NAMES_SRC_CSS = /['"`][^'"`]*src\/css[^'"`]*['"`]|\bsrcCss(?:Root)?\b|['"`]src['"`]\s*,\s*['"`]css['"`]/;

/** Does this source roll its own recursive walk of src/css? */
export function walksSrcCss(src) {
  const code = blankComments(src);
  if (!NAMES_SRC_CSS.test(code)) return false;
  for (const { name, body } of namedFunctions(code)) {
    if (!LIST_CALL.test(body)) continue;
    if (!callsItself(name, body)) continue;
    if (!/\.css['"`]/.test(body)) continue;
    return true;
  }
  return false;
}

if (process.argv.includes('--self-test')) {
  /* The body 244.2 removed from check-contrast.mjs, check-sticky-layers.mjs and
     report-css-repeats.mjs, verbatim from `git show 71a61679`, plus the call
     site that is the only place the tree is named. */
  const removed = `
    async function* cssFiles(dir) {
      for (const e of await readdir(dir, { withFileTypes: true })) {
        const p = join(dir, e.name);
        if (e.isDirectory()) yield* cssFiles(p);
        else if (e.name.endsWith('.css')) yield p;
      }
    }
    for await (const f of cssFiles(join(pkgRoot, 'src/css', dir))) { use(f); }`;
  /* extract-api.mjs's real shape: one level of component dirs, then the files
     inside each. No recursion — and a flat file stream cannot express it. */
  const singleLevel = `
    const componentsDir = join(srcCss, 'components');
    for (const dir of (await readdir(componentsDir, { withFileTypes: true })).filter((d) => d.isDirectory())) {
      const files = (await readdir(join(componentsDir, dir.name))).filter((f) => f.endsWith('.css'));
      use(files);
    }`;
  /* dist-css.mjs: the same recursive shape over a DIFFERENT tree. */
  const otherTree = `
    export const distCssRoot = join(here, '..', 'dist', 'css');
    export async function* distCssFiles(dir = distCssRoot) {
      for (const e of await readdir(dir, { withFileTypes: true })) {
        const p = join(dir, e.name);
        if (e.isDirectory()) yield* distCssFiles(p);
        else if (e.name.endsWith('.css') && !e.name.endsWith('.min.css')) yield p;
      }
    }`;
  /* check-token-refs.mjs: recursive, over src/css, but not stylesheets. */
  const otherExtension = `
    const root = join(pkgRoot, 'src/css');
    async function* jsFiles(dir) {
      for (const e of await readdir(dir, { withFileTypes: true })) {
        if (e.isDirectory()) yield* jsFiles(join(dir, e.name));
        else if (e.name.endsWith('.js')) yield join(dir, e.name);
      }
    }`;
  /* The evasion the brace-matched scan exists to close. */
  const asArrow = `
    const srcCss = join(root, 'src/css');
    const cssFiles = async (dir) => {
      const out = [];
      for (const e of await readdir(dir, { withFileTypes: true })) {
        if (e.isDirectory()) out.push(...await cssFiles(join(dir, e.name)));
        else if (e.name.endsWith('.css')) out.push(e.name);
      }
      return out;
    };`;

  selfTest([
    ['the walker 244.2 removed is flagged', walksSrcCss(removed), true],
    ['the same walker written as an arrow is flagged', walksSrcCss(asArrow), true],
    ['calling the chokepoint is NOT flagged',
      walksSrcCss("for await (const f of srcCssFiles(join(pkgRoot, 'src/css', dir))) use(f);"), false],
    ['a single-level component-dir listing is NOT flagged', walksSrcCss(singleLevel), false],
    ["dist-css.mjs's recursive walker over another tree is NOT flagged", walksSrcCss(otherTree), false],
    ['a recursive walker over .js under src/css is NOT flagged', walksSrcCss(otherExtension), false],
    ['a walker named only in a comment is NOT flagged',
      walksSrcCss(`// async function* cssFiles(dir) { readdir(dir); cssFiles(d); '.css' }\nconst x = "src/css";`), false],
  ]);
}

await chokepointGate({
  label: 'src-css-walkers',
  scriptDir: join(REPO_ROOT, 'packages', 'core', 'scripts'),
  tree: 'src/css',
  chokepoint: 'src-css-files.mjs',
  exempt: EXEMPT,
  detect: walksSrcCss,
  hint:
    'route it through srcCssFiles() in src-css-files.mjs;\n' +
    '    a private walker works until its hand-copied exclusion set drifts (244.2: three identical copies, a fourth that differed)',
});
