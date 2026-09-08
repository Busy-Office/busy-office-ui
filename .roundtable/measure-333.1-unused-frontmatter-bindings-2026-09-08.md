# Measurement — roadmap `333.1`: never-used frontmatter bindings in `.astro` files

Taken 2026-09-08, cloud wake, Slice 362. Every figure in ROADMAP Slice 362 is
produced by something on this page. Figures are snapshots; re-run them.

Base commit: the wake's Step 0 tip was `954ae4a3`; the readings below were taken
on a working tree identical to it except where a section says otherwise.

## 1. The premise re-check

```
git ls-files '*tsconfig*'
  packages/core/tsconfig.json
  tsconfig.base.json
cat tsconfig.base.json          # "strict": true, no noUnusedLocals
cat packages/core/tsconfig.json # "include": ["src/js/**/*.ts"]
ls apps/docs/tsconfig.json      # No such file or directory
grep -rn 'astro check\|@astrojs/check' --include=package.json --include='*.yml' . --exclude-dir=node_modules
  # (no output)
grep -rn '"typescript"' --include=package.json . --exclude-dir=node_modules
  ./packages/core/package.json:111:    "typescript": "^5.6.3",
node -e "console.log(require('typescript/package.json').version)"   # 5.9.3
```

## 2. The base rate

```
node scan-unused-frontmatter-bindings.mjs
  scanned 152 tracked .astro file(s); frontmatter bindings: const 600, import 518, total 1118
  never-used: 1
    [import] apps/docs/src/pages/concepts/js-behaviors.astro  eventsManifest
```

After this slice deletes that import, the same command reads
`const 600, import 517, total 1117` / `never-used: 0`.

Split by whether the frontmatter contains an import at all — the population
`noUnusedLocals` treats as module-local rather than global:

```
files: 152 | no frontmatter: 0 | frontmatter WITH import: 135 | frontmatter WITHOUT import: 17
const bindings in frontmatter WITH an import: 555   (556 with the injection below)
const bindings in frontmatter WITHOUT an import: 45
```

All 17 import-less frontmatters are components, not pages.

## 3. How old the one hit is

```
git log --format='%h %ad %s' --date=short -S'eventsManifest' \
    -- apps/docs/src/pages/concepts/js-behaviors.astro
  bb4ece7c 2026-08-17 Slice 23 item 6: split data-table and js-behaviors — SLICE 23 COMPLETE
  9bb801ea 2026-08-15 Slice 14 item 2: bo:* intent events are now generated, semver-governed API

git show 9bb801ea:...js-behaviors.astro | grep -c eventsManifest    # 2  (import + use)
git show bb4ece7c~1:...js-behaviors.astro | grep -c eventsManifest  # 2
git show bb4ece7c:...js-behaviors.astro | grep -c eventsManifest    # 1  (the use left)
```

2026-08-17 → 2026-09-08 = **22 days**.

## 4. The red-proof by injection

Injected into a real page, not a fixture, and the injection was confirmed
structurally before the green result was believed:

```
needle "const classes = api.motion.classes;\n" asserted to occur exactly once
inserted:  const savingMarkup = '<span class="bo-spinner"></span>';
landed at line 7; the frontmatter runs lines 1-66  -> not inside a comment
binding count moved 600 -> 601
scan reported exactly one hit: [const] apps/docs/src/pages/base/motion.astro savingMarkup
reverted; git hash-object -> 526f9b2437c69bc467c3a0b694b35c5d8a7b2795 (unchanged)
```

`motion.astro` was chosen because it names `savingMarkup` in three prose
comments — the scan flagged it anyway, which is what the comment-stripping is
for.

## 5. The tsconfig spike

Throwaway `apps/docs/tsconfig.json`, `@astrojs/check` installed `--no-save`,
both removed afterwards (`git status` clean, `package-lock.json` untouched).

```
{ "extends": "astro/tsconfigs/base",
  "compilerOptions": { "noUnusedLocals": true, "resolveJsonModule": true },
  "include": ["src/**/*", ".astro/types.d.ts"], "exclude": ["dist"] }
```

**First run, `packages/core/dist` ABSENT — this reading is wrong and is kept
here as the worked example:**

```
Result (164 files): 101 errors, 0 warnings, 29 hints
  ts(2307) 76   "Cannot find module '@busy-office/ui/api' or its corresponding type declarations"
```

**Second run, after `npm run build -w @busy-office/ui`:**

```
Result (164 files): 23 errors, 0 warnings, 27 hints      [17s wall]
  ts(2339) 20 · ts(7044) 16 · ts(6387) 7 · ts(6133) 2 · ts(7043)/ts(6385)/ts(2551)/ts(2322) 1 each
  ts(2307) 0
```

The two `ts(6133)`:

```
src/pages/concepts/js-behaviors.astro:5:1   'eventsManifest' is declared but its value is never read.   (error)
src/pages/patterns/comparison.astro:134:33  'i' is declared but its value is never read.                (warning)
```

The 23 errors by file: `value-help` 9, `Gallery` 6, `htmx` 3, `js-behaviors` 1,
`ScheduleScreen` 1, `palettes` 1, `cascade` 1, `detail-form` 1. Every one except
`js-behaviors` is DOM narrowing inside an inline `<script>`.

Discrimination control for `noUnusedLocals` itself, run against plain `tsc`:

```
mod.ts (has an import)   -> TS6133 'unusedThing' is declared but its value is never read
script.ts (no imports)   -> no diagnostic; top-level consts are globals, not locals
```

## 6. The render-neutrality proof for the deletion

```
rm -rf apps/docs/dist && npm run docs:build     # never a bare `astro build` (ENVIRONMENT.md §3)
before: md5 a8e5762c946cf70dde4187b4698bd8e1  89,440 bytes  529 files in dist
after : md5 a8e5762c946cf70dde4187b4698bd8e1  89,440 bytes  529 files in dist
cmp before-js-behaviors.html  <after>  -> identical
cmp before-motion.html        <after>  -> DIFFERS   ← the control; the comparison discriminates
```

## 7. The instrument

Saved verbatim so the base rate is re-runnable rather than re-derived. Resolve
`typescript` by absolute path — it is not hoisted to a place a scratch file can
`import 'typescript'` from.

```javascript
// Base-rate probe for roadmap 333.1 — a never-used frontmatter BINDING (a
// top-level `const` or an `import`) in an .astro file.
//
// Signal: a top-level binding in the frontmatter whose identifier is
// referenced ZERO times anywhere else in the file (frontmatter AST references,
// or the template body after comments are stripped).
//
// Comments are stripped from BOTH halves on purpose: a const whose only other
// occurrence is the comment explaining it is unused, and counting that mention
// as a use is exactly CLAUDE.md's "an assertion tripped on its own explanation"
// pointing the other way.
//
// --self-test runs eight fixtures the detector must classify correctly.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const ROOT = '/home/user/busy-office-ui';
const ts = (await import(`${ROOT}/node_modules/typescript/lib/typescript.js`)).default;

function splitAstro(src) {
  if (!src.startsWith('---')) return { fm: '', body: src, fmOffset: 0 };
  const end = src.indexOf('\n---', 3);
  if (end === -1) return { fm: '', body: src, fmOffset: 0 };
  const fmStart = src.indexOf('\n') + 1;
  return { fm: src.slice(fmStart, end + 1), body: src.slice(end + 4), fmOffset: fmStart };
}

// Strip HTML comments, then JS line/block comments, from template text.
function stripComments(text) {
  let t = text.replace(/<!--[\s\S]*?-->/g, ' ');
  // block comments (also covers CSS /* */)
  t = t.replace(/\/\*[\s\S]*?\*\//g, ' ');
  // line comments, but not inside a URL (`//` after `:`), a crude but
  // conservative guard: only strip when `//` starts a line (optionally indented)
  t = t.replace(/^[ \t]*\/\/.*$/gm, ' ');
  return t;
}

function collectConsts(fm) {
  const sf = ts.createSourceFile('fm.ts', fm, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS);
  const decls = []; // { name, node }
  const declNameNodes = new Set();
  for (const stmt of sf.statements) {
    if (ts.isImportDeclaration(stmt) && stmt.importClause) {
      const c = stmt.importClause;
      if (c.name) {
        decls.push({ name: c.name.text, kind: 'import' });
        declNameNodes.add(c.name);
      }
      if (c.namedBindings) {
        if (ts.isNamespaceImport(c.namedBindings)) {
          decls.push({ name: c.namedBindings.name.text, kind: 'import' });
          declNameNodes.add(c.namedBindings.name);
        } else {
          for (const el of c.namedBindings.elements) {
            decls.push({ name: el.name.text, kind: 'import' });
            declNameNodes.add(el.name);
          }
        }
      }
      continue;
    }
    if (!ts.isVariableStatement(stmt)) continue;
    const list = stmt.declarationList;
    if (!(list.flags & ts.NodeFlags.Const)) continue;
    for (const d of list.declarations) {
      const walkBinding = (nameNode) => {
        if (ts.isIdentifier(nameNode)) {
          decls.push({ name: nameNode.text, kind: 'const' });
          declNameNodes.add(nameNode);
        } else if (ts.isObjectBindingPattern(nameNode) || ts.isArrayBindingPattern(nameNode)) {
          for (const el of nameNode.elements) {
            if (ts.isBindingElement(el)) walkBinding(el.name);
          }
        }
      };
      walkBinding(d.name);
    }
  }
  // reference count inside the frontmatter, excluding the declaration name nodes
  const refs = new Map();
  const visit = (node) => {
    if (ts.isIdentifier(node) && !declNameNodes.has(node)) {
      // skip property names in `{ a: 1 }` and member access `.a`
      const p = node.parent;
      const isPropName = p && ts.isPropertyAssignment(p) && p.name === node;
      const isMemberName = p && ts.isPropertyAccessExpression(p) && p.name === node;
      const isBindingProp = p && ts.isBindingElement(p) && p.propertyName === node;
      if (!isPropName && !isMemberName && !isBindingProp) {
        refs.set(node.text, (refs.get(node.text) || 0) + 1);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return { decls, refs, syntaxErrors: sf.parseDiagnostics ? sf.parseDiagnostics.length : 0 };
}

function scanFile(abs, rel) {
  const src = fs.readFileSync(abs, 'utf8');
  const { fm, body } = splitAstro(src);
  if (!fm.trim()) return [];
  const { decls, refs } = collectConsts(fm);
  if (!decls.length) return [];
  const bodyClean = stripComments(body);
  const out = [];
  for (const d of decls) {
    const inFm = refs.get(d.name) || 0;
    const re = new RegExp(`\\b${d.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
    const inBody = (bodyClean.match(re) || []).length;
    if (inFm + inBody === 0) out.push({ file: rel, name: d.name, kind: d.kind });
  }
  return out;
}

function trackedAstro() {
  return execFileSync('git', ['ls-files', '*.astro'], { cwd: ROOT, encoding: 'utf8' })
    .split('\n')
    .filter(Boolean);
}

function selfTest() {
  const cases = [
    {
      label: 'unused default import -> MUST flag',
      src: "---\nimport foo from './foo';\n---\n<p>hi</p>\n",
      expect: ['foo'],
    },
    {
      label: 'used named import -> MUST NOT flag',
      src: "---\nimport { bar } from './bar';\n---\n<p>{bar}</p>\n",
      expect: [],
    },
    {
      label: 'import used only as a COMPONENT tag -> MUST NOT flag',
      src: "---\nimport Gallery from './G.astro';\n---\n<Gallery title=\"x\" />\n",
      expect: [],
    },
    {
      label: 'unused const -> MUST flag',
      src: '---\nconst unusedThing = 1;\n---\n<p>hi</p>\n',
      expect: ['unusedThing'],
    },
    {
      label: 'const used in template -> MUST NOT flag',
      src: '---\nconst usedThing = 1;\n---\n<p>{usedThing}</p>\n',
      expect: [],
    },
    {
      label: 'const named only in an HTML comment -> MUST flag',
      src: '---\nconst commentOnly = 1;\n---\n<!-- commentOnly explains the swap -->\n<p>hi</p>\n',
      expect: ['commentOnly'],
    },
    {
      label: 'const used only inside frontmatter -> MUST NOT flag',
      src: '---\nconst a = 1;\nconst b = a + 1;\n---\n<p>{b}</p>\n',
      expect: [],
    },
    {
      label: 'destructured, one half unused -> MUST flag that half only',
      src: '---\nconst { keep, drop } = Astro.props;\n---\n<p>{keep}</p>\n',
      expect: ['drop'],
    },
  ];
  let bad = 0;
  const tmp = fs.mkdtempSync('/tmp/uc-selftest-');
  for (const c of cases) {
    const f = path.join(tmp, 'x.astro');
    fs.writeFileSync(f, c.src);
    const got = scanFile(f, 'x.astro').map((r) => r.name).sort();
    const want = [...c.expect].sort();
    const ok = JSON.stringify(got) === JSON.stringify(want);
    if (!ok) bad++;
    console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${c.label}  got=[${got}] want=[${want}]`);
  }
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(bad === 0 ? 'self-test: all cases discriminate' : `self-test: ${bad} case(s) FAILED`);
  process.exit(bad === 0 ? 0 : 1);
}

if (process.argv.includes('--self-test')) selfTest();

const files = trackedAstro();
let total = 0;
const hits = [];
const bindingCounts = {};
for (const rel of files) {
  const abs = path.join(ROOT, rel);
  const src = fs.readFileSync(abs, 'utf8');
  const { fm } = splitAstro(src);
  if (fm.trim()) {
    for (const d of collectConsts(fm).decls) bindingCounts[d.kind] = (bindingCounts[d.kind] || 0) + 1;
  }
  const r = scanFile(abs, rel);
  total += r.length;
  hits.push(...r);
}
console.log(`scanned ${files.length} tracked .astro file(s); frontmatter bindings: const ${bindingCounts.const || 0}, import ${bindingCounts.import || 0}, total ${(bindingCounts.const||0)+(bindingCounts.import||0)}`);
console.log(`never-used: ${total}`);
for (const h of hits) console.log(`  [${h.kind}] ${h.file}  ${h.name}`);
```

`--self-test` prints eight cases; all eight discriminate.
