/**
 * Serves the built screens plus the framework's own stylesheet at /bo/.
 *
 * Starts itself — a check that needs a human to run a server first is not a
 * check (CLAUDE.md). Exported so the audit script can start and stop it.
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const DIST = join(here, 'dist');
const CSS = join(here, '../../packages/core/dist/css');

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8' };

export async function serveSuite() {
  const server = createServer(async (req, res) => {
    let path = new URL(req.url, 'http://x').pathname;
    if (path.endsWith('/')) path += 'index.html';
    const file = path.startsWith('/bo/')
      ? join(CSS, normalize(path.slice(4)))
      : join(DIST, normalize(path));
    try {
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404, { 'content-type': 'text/plain' });
      res.end('not found');
    }
  });
  await new Promise((r) => server.listen(0, r));
  return { server, port: server.address().port };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { port } = await serveSuite();
  console.log(`erp-suite serving on http://localhost:${port}/index.html`);
}
