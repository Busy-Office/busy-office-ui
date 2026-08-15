// Copy the shipped framework CSS into public/ so pages can link it as a
// plain file — used by the troubleshooting interop demo's iframes (they are
// isolated documents and can't reach the bundled/hashed _astro asset).
import { copyFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const src = require.resolve('@busy-office/ui/css/min');
const outDir = join(here, '../public/assets');
mkdirSync(outDir, { recursive: true });
copyFileSync(src, join(outDir, 'busy-office-ui.min.css'));
console.log('framework css copied to public/assets/busy-office-ui.min.css');
