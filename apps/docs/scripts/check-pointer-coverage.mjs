/**
 * Gate (roadmap 377.4): every behaviour that listens for POINTER input has a
 * `check-claims` case that drives TRUSTED pointer input into it, or an EXEMPT
 * entry below that says why not.
 *
 * Why this exists. A synthetic click (`el.click()` or `dispatchEvent` inside
 * `page.evaluate`) is not what a user's mouse sends: it skips pointerdown,
 * mousedown, focus moves and the trusted flag. 375.10 (a real press on a
 * combobox option did nothing) and 377.1 (a real right-click closed its own
 * menu on release) were both paths that passed synthetic checks and broke under
 * real input. When 377.4 was filed, 16 of the 26 behaviours listened for
 * pointer input, and trusted events reached 8 of them. About 1 in 9
 * synthetic-only paths had turned out broken under real input.
 *
 * HOW IT DECIDES:
 * - A behaviour "listens for pointer input" when its file registers a listener
 *   for a POINTER event: click, dblclick, auxclick, contextmenu, the pointer*
 *   and mouse* events, touch*, or drag/drop. It registers either with a string
 *   literal, or through a `for (const type of [...])` literal array that feeds
 *   `addEventListener(type, …)`.
 * - A behaviour is "covered" when `check-claims.mjs` carries a
 *   `// @pointer: <behaviour>[, <behaviour>]` annotation, and the block after
 *   it contains a TRUSTED input call. The block runs to the next annotation, or
 *   to BLOCK_LINES lines, whichever comes first. Trusted calls:
 *   - `page.mouse.*`;
 *   - `locator(…).click/dblclick/hover/tap/dragTo`;
 *   - `page.click/dblclick/hover/tap/dragAndDrop`;
 *   - CDP `Input.dispatchMouseEvent`, `Input.dispatchDragEvent` or
 *     `Input.dispatchTouchEvent`.
 *
 *   An annotation whose block holds no trusted call is a MISLABEL and fails.
 *   So does one naming a behaviour with no pointer listener.
 * - What it cannot see is whether the case's trusted event actually reaches
 *   that behaviour's handler. That is the annotator's judgement, made once,
 *   with the evidence in 377.4's DONE note.
 *
 * @heuristic — it recognises listeners and input calls in source text.
 */
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { REPO_ROOT } from './paths.mjs';
import { assertScanned, selfTest } from './gate-report.mjs';

const BEHAVIOURS = join(REPO_ROOT, 'packages/core/src/js/behaviors');
const CLAIMS = join(REPO_ROOT, 'apps/docs/scripts/check-claims.mjs');
const BLOCK_LINES = 150;

const POINTER_EVENT = /^(click|dblclick|auxclick|contextmenu|pointer(down|up|move|over|out|enter|leave|cancel)|mouse(down|up|move|over|out|enter|leave)|touch(start|end|move|cancel)|drag(start|end|over|enter|leave)?|drop)$/;
const LITERAL_LISTENER = /addEventListener\(\s*['"]([a-z]+)['"]/g;
const TYPE_LOOP = /for\s*\(\s*const\s+(\w+)\s+of\s+\[([^\]]*)\]\s*(?:as\s+const\s*)?\)\s*\{?[\s\S]{0,200}?addEventListener\(\s*\1\b/g;
const TRUSTED = /page\.mouse\.|\.mouse\.(click|down|up|move|dblclick|wheel)\(|locator\([^)]*\)(\.[a-zA-Z]+\([^)]*\))*\.(click|dblclick|hover|tap|dragTo)\(|\bpage\.(click|dblclick|hover|tap|dragAndDrop)\(|Input\.dispatch(Mouse|Drag|Touch)Event/;
const ANNOTATION = /\/\/\s*@pointer:\s*([a-z0-9-]+(?:\s*,\s*[a-z0-9-]+)*)/;

/** The pointer events a behaviour's source registers, sorted. */
export function pointerEvents(src) {
  const found = new Set();
  for (const m of src.matchAll(LITERAL_LISTENER)) if (POINTER_EVENT.test(m[1])) found.add(m[1]);
  for (const m of src.matchAll(TYPE_LOOP)) {
    for (const t of m[2].matchAll(/['"]([a-z]+)['"]/g)) if (POINTER_EVENT.test(t[1])) found.add(t[1]);
  }
  return [...found].sort();
}

/** True when a line drives trusted input. A line inside `evaluate(` is synthetic. */
export function isTrusted(line) {
  return TRUSTED.test(line) && !/\bevaluate\(/.test(line);
}

/** [{behaviours, line, trusted}] for every @pointer annotation in `src`. */
export function annotations(src) {
  const lines = src.split('\n');
  const out = [];
  lines.forEach((l, i) => {
    const m = l.match(ANNOTATION);
    if (!m) return;
    let trusted = null;
    for (let j = i + 1; j < Math.min(lines.length, i + 1 + BLOCK_LINES); j++) {
      if (ANNOTATION.test(lines[j])) break;
      if (isTrusted(lines[j])) { trusted = j + 1; break; }
    }
    out.push({ behaviours: m[1].split(',').map((s) => s.trim()), line: i + 1, trusted });
  });
  return out;
}

/* Behaviours with a pointer listener and no trusted case, each with WHY. Delete
   a line when its case lands; the list only shrinks. An entry for a behaviour
   that has since gained a case, or lost its listener, fails the gate, so this
   list cannot rot silently. */
const EXEMPT = new Map([
  // filled from 377.4's mapping
]);

if (process.argv.includes('--self-test')) {
  selfTest([
    ['a click literal is a pointer listener', pointerEvents(`el.addEventListener('click', f)`), ['click']],
    ['a keydown literal is not', pointerEvents(`el.addEventListener('keydown', f)`), []],
    ['a type loop is read', pointerEvents(`for (const type of ['pointerdown', 'keydown']) {\n  d.addEventListener(type, f)`), ['pointerdown']],
    ['a type loop of non-pointer events is not', pointerEvents(`for (const type of ['input', 'change'] as const) {\n  document.addEventListener(type, (e) => {`), []],
    ['drag and drop count', pointerEvents(`z.addEventListener('dragover', a); z.addEventListener('drop', b)`), ['dragover', 'drop']],
    ['page.mouse is trusted', isTrusted(`  await page.mouse.click(x, y);`), true],
    ['locator().click() is trusted', isTrusted(`  await page.locator('#go').click();`), true],
    ['a chained locator click is trusted', isTrusted(`  await page.locator('.x').first().click({ delay: 50 });`), true],
    ['CDP mouse dispatch is trusted', isTrusted(`  await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed' });`), true],
    ['el.click() in evaluate is synthetic', isTrusted(`  await page.evaluate(() => document.querySelector('#go').click());`), false],
    ['dispatchEvent is synthetic', isTrusted(`  el.dispatchEvent(new MouseEvent('click'));`), false],
    ['an annotation over a trusted call is covered', annotations(`// @pointer: tabs\nawait page.mouse.click(1, 2);`).map((a) => a.trusted), [2]],
    ['an annotation over synthetic only is a mislabel', annotations(`// @pointer: tabs\nawait page.evaluate(() => b.click());`).map((a) => a.trusted), [null]],
    ['the next annotation ends a block', annotations(`// @pointer: tabs\n// @pointer: dialog\nawait page.mouse.click(1, 2);`).map((a) => a.trusted), [null, 3]],
  ]);
}

const files = (await readdir(BEHAVIOURS)).filter((f) => f.endsWith('.ts'));
assertScanned(files.length, 'behaviour files', `looked in ${BEHAVIOURS}`);
const pointer = new Map();
for (const f of files) {
  const evs = pointerEvents(await readFile(join(BEHAVIOURS, f), 'utf8'));
  if (evs.length) pointer.set(f.replace(/\.ts$/, ''), evs);
}
assertScanned(pointer.size, 'behaviours with a pointer listener', 'the listener detector matched nothing — it is broken, not the behaviours');

const notes = annotations(await readFile(CLAIMS, 'utf8'));
const covered = new Map();
const problems = [];
for (const a of notes) {
  if (a.trusted == null) {
    problems.push(`check-claims.mjs:${a.line} — @pointer: ${a.behaviours.join(', ')} has no trusted input call in the next ${BLOCK_LINES} lines (a synthetic click is not a real press)`);
    continue;
  }
  for (const b of a.behaviours) {
    if (!pointer.has(b)) problems.push(`check-claims.mjs:${a.line} — @pointer names "${b}", which has no pointer listener in ${BEHAVIOURS}`);
    else (covered.get(b) ?? covered.set(b, []).get(b)).push(a.trusted);
  }
}
for (const [b, evs] of pointer) {
  if (covered.has(b) && EXEMPT.has(b)) problems.push(`${b}: EXEMPT, but check-claims.mjs now covers it (line ${covered.get(b)[0]}) — delete its EXEMPT line`);
  else if (!covered.has(b) && !EXEMPT.has(b)) problems.push(`${b}: listens for ${evs.join(', ')} and no check-claims case drives trusted pointer input into it. Add one with a // @pointer: ${b} annotation, or an EXEMPT entry with the reason`);
}
for (const b of EXEMPT.keys()) if (!pointer.has(b)) problems.push(`${b}: EXEMPT, but it no longer has a pointer listener — delete its EXEMPT line`);

if (problems.length) {
  console.error(`pointer-coverage check FAILED — ${problems.length} problem(s):`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log(`pointer-coverage check passed — ${pointer.size} behaviour(s) with a pointer listener: ${covered.size} driven by a trusted case, ${EXEMPT.size} exempt with a reason`);
