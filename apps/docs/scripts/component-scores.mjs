/**
 * The MEASURED half of the component NEED/COST rubric
 * (`.roundtable/component-need-cost-rubric-2026-08-19.md`).
 *
 * @exact — reads api.json, behaviors.json and per-component dist bytes, and
 * bins them. Exempt from --self-test: it counts and compares, with no judgement
 * about what something IS. The four JUDGED axes (N2 correctness absorbed,
 * N3 effort saved, N4 consistency, C1 composable) are deliberately NOT here —
 * they require a written citation and a human, and auto-filling them would be a
 * detector that cannot fail.
 *
 * Owner ask (2026-08-19): grill each component on why we should and should not
 * have it, and benchmark the score to decide what to do next. A value-only
 * rubric can only ever say "keep".
 *
 * Demand is blind to SHELL components by construction: navbar, sidebar-nav and
 * breadcrumb appear on all 18 docs pages but zero times inside a demo region —
 * they are the frame, not the content. They score `—`, not 0, because 0 would
 * be an artifact rather than a finding.
 *
 *   node scripts/component-scores.mjs
 */
import fs from 'node:fs';
import { join } from 'node:path';
import { CORE_DIST, DIST } from './paths.mjs';
import { distPages, demoRegion } from './dist-pages.mjs';
import { rendersBlock } from './renders-block.mjs';
const api = JSON.parse(fs.readFileSync(join(CORE_DIST,'api.json'),'utf8'));
const beh = JSON.parse(fs.readFileSync(join(CORE_DIST,'behaviors.json'),'utf8'));
const behByBlock = {};
for (const [n,v] of Object.entries(beh.behaviors)) for (const h of (v.hooks||[])) (behByBlock[h] ??= new Set()).add(n);
// Through the chokepoint, not a private readdirSync — this script regrew its
// own dist walk within days of the 103.1 consolidation (2026-08-21 sweep).
const demos = (await distPages(DIST))
  .filter((p) => p.url.startsWith('/patterns/'))
  .map((p) => demoRegion(p.html));
const SHELL = new Set(['navbar','sidebar-nav','breadcrumb']);   // demand axis is blind to these
const rows = [];
for (const [name,c] of Object.entries(api.components)) {
  const f = join(CORE_DIST,'css/components',`${name}.min.css`);
  const bytes = fs.existsSync(f) ? fs.statSync(f).size : 0;
  const blocks = c.blocks?.length ? c.blocks : ['bo-'+name];
  // Shared self-tested detector — the inline regex copy here lacked the
  // escaping rendersBlock carries (2026-08-21 sweep).
  const screens = demos.filter(p => blocks.some(b => rendersBlock(p, b))).length;
  const behs = new Set(); for (const b of blocks) if (behByBlock[b]) behByBlock[b].forEach(x=>behs.add(x));
  const surface = c.classes.length + c.variants.length;
  // MEASURABLE axes only
  const N1 = SHELL.has(name) ? null : screens>=7?3 : screens>=3?2 : screens>=1?1 : 0;
  const C2 = bytes>3000?3 : bytes>1500?2 : bytes>600?1 : 0;
  const C3 = behs.size>=3?3 : behs.size===2?2 : behs.size===1?1 : 0;
  const C4 = surface>15?3 : surface>9?2 : surface>4?1 : 0;
  rows.push({name, screens, bytes, surface, behs:behs.size, N1, C2, C3, C4, measuredCost:C2+C3+C4});
}
rows.sort((a,b)=> (b.measuredCost - (b.N1??0)*1) - (a.measuredCost - (a.N1??0)*1));
console.log('component'.padEnd(19),'scr','N1','|','B','R','S','= measCost','  (bytes/surface/behs)');
for (const r of rows) console.log(
  r.name.padEnd(19), String(r.screens).padStart(3), String(r.N1??'—').padStart(2), '|',
  r.C2, r.C3, r.C4, '=', String(r.measuredCost).padStart(2),
  '      ', `${r.bytes}b/${r.surface}/${r.behs}`);
