// Copy the shipped framework CSS into public/ so pages can link it as a
// plain file — used by the troubleshooting interop demo's iframes (they are
// isolated documents and can't reach the bundled/hashed _astro asset), and
// by the RF-scanner demo (roadmap 59.4), which must load ONLY the
// rf-essentials profile — not the main bundle — to actually demonstrate the
// lower-floor build target rather than just the framework working as usual.
import { copyFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DOCS_ROOT } from './paths.mjs';

const here = join(DOCS_ROOT, 'scripts');
const require = createRequire(import.meta.url);
const outDir = join(here, '../public/assets');
mkdirSync(outDir, { recursive: true });

for (const [exportPath, outName] of [
  ['@busy-office/ui/css/min', 'busy-office-ui.min.css'],
  ['@busy-office/ui/css/rf-essentials.min', 'rf-essentials.min.css'],
]) {
  copyFileSync(require.resolve(exportPath), join(outDir, outName));
  console.log(`framework css copied to public/assets/${outName}`);
}
