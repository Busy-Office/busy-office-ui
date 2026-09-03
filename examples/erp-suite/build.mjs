/**
 * Renders the suite's screens to static HTML.
 *
 * A build step at all, for screens with no data? Yes — the chrome (rail,
 * breadcrumbs, navbar) is identical on every screen, and hand-copying it into
 * twenty files is the exact bulk-edit hazard CLAUDE.md warns about. Screen
 * BODIES stay hand-authored, one per file, because that is where the variety
 * lives and variety is what finds gaps: a generated grid of identical screens
 * would hide precisely what this example exists to expose.
 */
import { mkdir, writeFile, readdir, rm } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MODULES, page } from './_shell.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, 'dist');

/* Clean first. Without this, dist keeps pages from previous shapes — the
   generated "not part of the pilot" stubs for modules since built, and any
   screen renamed along the way — and the gates then audit files no source
   produces. It masked a real failure on 2026-08-24: `npm run suite` passed
   locally over 25 stale pages while CI, starting clean at 22, failed on a
   toolbar that overflowed at 390px. A gate that inspects leftovers is a gate
   that can pass while the thing it guards is broken. */
await rm(OUT, { recursive: true, force: true });

const BUILT_MODULES = ['home', 'o2c', 'p2p', 'crm', 'fin', 'inv', 'prod'];

const screens = [];
for (const dir of ['.', 'o2c', 'p2p', 'crm', 'fin', 'inv', 'prod']) {
  const abs = join(here, dir);
  for (const f of await readdir(abs)) {
    if (!f.endsWith('.screen.mjs')) continue;
    const mod = await import(join(abs, f));
    screens.push({ path: join(dir, f.replace('.screen.mjs', '.html')), html: mod.render() });
  }
}

/* Every module on the rail must LAND somewhere — a suite whose point is
   navigation cannot have five dead entries, and greying them out would
   misrepresent a real deployment where all six exist. The modules outside the
   pilot get an honest empty state saying so. Generated, not hand-authored,
   precisely because they are identical: the hand-authored variety belongs in
   the screens that are meant to differ. */
for (const m of MODULES.filter((x) => !BUILT_MODULES.includes(x.id))) {
  screens.push({
    path: join(m.id, 'index.html'),
    html: page({
      title: m.label,
      /* Generated, like the body beside it, and distinct because it names the
         module. This loop yields ZERO pages today — BUILT_MODULES covers all
         seven entries of MODULES — so it is the one call site the suite build
         cannot currently exercise. It still carries a description rather than
         relying on that: page() throws without one, and a module dropped from
         BUILT_MODULES would otherwise break the build here for a reason a
         reader would have to work out. */
      description: `${m.label} is outside the Busy Office ERP pilot; this screen says so and points at the module that was built first.`,
      moduleId: m.id,
      trail: [{ label: 'Home', href: '/index.html' }, { label: m.label }],
      body: `
    <div class="bo-state">
      <h1 class="bo-state__title">${m.label} is not part of the pilot</h1>
      <p class="bo-state__description">Procure to pay was built first to find out
      what the framework is missing before five more modules repeat the same
      gaps. What it found is in <code>.roundtable/erp-suite-gaps.md</code>.</p>
      <p class="bo-state__actions"><a class="bo-btn" href="/p2p/purchase-orders.html">Open Procure to pay</a></p>
    </div>
`,
    }),
  });
}

/* SUITE_BASE lets the suite be served from a sub-path — it exists so 28 built
   screens can sit under the docs site instead of only on a developer's disk
   (roadmap 147.1). The screens write absolute links (`/p2p/purchase-orders.html`,
   `/bo/index.css`) because that is what an app does; rewriting them once here
   beats threading a prefix through 28 files, and it cannot miss one.

   Safe as a bulk rewrite precisely because it was checked first: the suite has
   ZERO <pre>/<code> blocks, so there is no copy-paste sample whose text would
   be corrupted — the trap this repo has recorded twice. Anchors (`href="#"`)
   and absolute URLs do not start with a single `/` and are untouched. */
const BASE = (process.env.SUITE_BASE ?? '').replace(/\/$/, '');
const rebase = (html) =>
  BASE ? html.replace(/\s(href|src)="\/(?!\/)/g, ` $1="${BASE}/`) : html;

for (const s of screens) {
  const target = join(OUT, s.path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, rebase(s.html));
}
console.log(
  `erp-suite: ${screens.length} screen(s) rendered to ${relative(process.cwd(), OUT)}` +
    (BASE ? ` (base ${BASE})` : ''),
);
