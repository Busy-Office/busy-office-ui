// Shared static server for the browser gates, with BASE-PATH awareness.
//
// CI builds the docs with DOCS_BASE=/busy-office-ui, so every link and
// asset URL carries that prefix while the dist tree does not. A naive
// server 404s them — which broke check-boost's clicks outright and,
// worse, would have let check-overflow load pages with NO CSS and
// report "no overflow" (fail-open). Detect the prefix from a built
// page's own asset URL and strip it when resolving files.
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { createServer } from 'node:http';

export async function detectBase(dist) {
  const html = await readFile(join(dist, 'index.html'), 'utf8');
  const m = html.match(/href="([^"]*)\/_astro\//);
  return m?.[1] ?? '';
}

// The version snapshots under dist/v/<ver>/ (install-versions.mjs) were
// built for the Pages base, so their asset URLs, and their switcher's
// "latest", carry that prefix even when this build has none. Detect it from
// a snapshot's own asset URL, as detectBase does for the build itself.
// nginx.conf maps the same prefix for the container.
export async function detectSnapshotBase(dist) {
  let vers;
  try { vers = (await readdir(join(dist, 'v'))).sort(); } catch { return ''; }
  for (const ver of vers) {
    try {
      const html = await readFile(join(dist, 'v', ver, 'index.html'), 'utf8');
      const m = html.match(/(?:href|src)="([^"]*)\/v\/[^/"]+\/_astro\//);
      if (m) return m[1];
    } catch { /* not a snapshot dir */ }
  }
  return '';
}

export async function serveDist(dist) {
  const base = await detectBase(dist);
  const snapBase = await detectSnapshotBase(dist);
  const server = createServer(async (req, res) => {
    let url = req.url.split('?')[0];
    if (snapBase && snapBase !== base && url.startsWith(snapBase + '/')) url = url.slice(snapBase.length);
    if (base && url.startsWith(base)) url = url.slice(base.length) || '/';
    const candidates = url.endsWith('/')
      ? [join(dist, url, 'index.html')]
      : [join(dist, url), join(dist, url, 'index.html')];
    for (const path of candidates) {
      try {
        const body = await readFile(path);
        res.writeHead(200, {
          'content-type': path.endsWith('.css') ? 'text/css'
            : path.endsWith('.js') ? 'text/javascript'
            : path.endsWith('.json') ? 'application/json'
            : path.endsWith('.svg') ? 'image/svg+xml'
            : 'text/html',
        });
        return res.end(body);
      } catch { /* try next */ }
    }
    res.writeHead(404);
    res.end('not found');
  });
  await new Promise((r) => server.listen(0, r));
  return { server, port: server.address().port, base };
}
