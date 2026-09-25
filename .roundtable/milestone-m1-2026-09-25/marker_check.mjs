// Prototype of the proposed bo-check-markup extension (NOT repo code).
// Question it answers: can the per-instance opt-in rule be enforced with the
// same tag-level regex style check-markup already uses, and can each branch
// be shown to FAIL (red-proof) as well as pass?
//
// Rule under test, per page:
//  R1 a tag carrying an experimental BLOCK class (bo-x or bo-x--variant, not a
//     __part) must carry data-bo-experimental="x" on the SAME tag
//  R2 a __part of experimental x is legal only if the page holds >=1 marked
//     root for x (regex cannot see nesting; page-level is the honest limit)
//  R3 data-bo-experimental naming a STABLE component fails ("graduated")
//  R4 data-bo-experimental naming nothing known fails ("removed or misspelled")
//  R5 counts are reconciled against the RAW source: every occurrence of the
//     marker string must have been parsed as a tag attribute

const api = {
  components: { button: { classes: ['bo-btn', 'bo-btn--primary'] }, 'check-matrix-old': { classes: [] } },
  experimental: { 'check-matrix': { classes: ['bo-check-matrix', 'bo-check-matrix--dense', 'bo-check-matrix__cell'] } },
  graduated: { button: '0.1.0' }, // stands in for "name is in api.components"
};

const TAG_RE = /<([a-z][a-z0-9-]*)\b([^>]*)>/gi;
const attr = (attrs, name) => (new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`, 'i').exec(attrs) || [])[1];

export function check(html) {
  const problems = [];
  const expByClass = new Map();
  for (const [name, c] of Object.entries(api.experimental)) for (const cls of c.classes) expByClass.set(cls, name);
  const markedRoots = new Map();
  const partsSeen = [];
  let parsedMarkers = 0;
  for (const m of html.matchAll(TAG_RE)) {
    const attrs = m[2];
    const classes = (attr(attrs, 'class') || '').split(/\s+/).filter(Boolean);
    const marker = attr(attrs, 'data-bo-experimental');
    if (marker !== undefined) {
      parsedMarkers++;
      if (api.components[marker]) problems.push(`R3 stale marker: "${marker}" is stable now — remove data-bo-experimental`);
      else if (!api.experimental[marker]) problems.push(`R4 unknown marker: "${marker}" is not an experimental component (removed? see CHANGELOG ### Experimental)`);
    }
    for (const cls of classes) {
      const name = expByClass.get(cls);
      if (!name) continue;
      if (cls.includes('__')) { partsSeen.push([cls, name]); continue; }
      if (marker === name) markedRoots.set(name, (markedRoots.get(name) || 0) + 1);
      else problems.push(`R1 "${cls}" is EXPERIMENTAL (not API, may change or vanish): import @busy-office/ui/css/experimental/${name} and add data-bo-experimental="${name}" to this element`);
    }
  }
  for (const [cls, name] of partsSeen) if (!markedRoots.get(name)) problems.push(`R2 part "${cls}" used with no marked ${name} root on this page`);
  const raw = (html.match(/data-bo-experimental\s*=/gi) || []).length;
  if (parsedMarkers < raw) problems.push(`R5 reconciliation: source has ${raw} marker(s), parser saw ${parsedMarkers}`);
  return problems;
}

const cases = [
  ['marked root + part passes', '<table class="bo-check-matrix" data-bo-experimental="check-matrix"><td class="bo-check-matrix__cell">', 0],
  ['marker BEFORE class attr still passes', '<table data-bo-experimental="check-matrix" class="bo-check-matrix bo-check-matrix--dense">', 0],
  ['R1 unmarked root fails', '<table class="bo-check-matrix">', 1],
  ['R1 variant-only root unmarked fails', '<table class="bo-check-matrix--dense">', 1],
  ['R1 wrong-name marker on root fails', '<table class="bo-check-matrix" data-bo-experimental="button">', 2], // R3 + R1
  ['R2 orphan part fails', '<td class="bo-check-matrix__cell">', 1],
  ['R3 stale marker (graduated) fails', '<button class="bo-btn" data-bo-experimental="button">', 1],
  ['R4 unknown marker (removed) fails', '<div data-bo-experimental="nested-list">', 1],
  ['stable markup alone is untouched', '<button class="bo-btn bo-btn--primary">', 0],
  // R5 red-proof: a marker the tag regex cannot see (inside a comment-like broken tag)
  ['R5 marker the parser missed fails reconciliation', '<!-- data-bo-experimental="check-matrix" -->', 1],
];
let bad = 0;
for (const [name, html, want] of cases) {
  const got = check(html).length;
  const ok = got === want;
  if (!ok) bad++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}: ${got} problem(s), expected ${want}`);
}
console.log(bad ? `\n${bad} case(s) wrong` : `\nall ${cases.length} cases behave as specified`);
process.exit(bad ? 1 : 0);
