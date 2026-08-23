/**
 * One definition of "a built docs page", for the gates that sweep them.
 *
 * Four gates each walked `dist` with their own copy of this, and the copies had
 * drifted into DIFFERENT ANSWERS — each holding half of the correct exclusion
 * set (Standardize sweep, 2026-08-18):
 *
 *   axe-audit      skipped the 8 redirect stubs, but not `/v/`
 *   check-layout   skipped `/v/`, but swept all 8 redirect stubs
 *   forced-colors  skipped `/v/`, and read the stubs looking for classes
 *
 * So "how many pages does this project have?" had two answers, 82 and 90,
 * depending on which gate you asked — and the most expensive sweep in CI was
 * spending ~9% of its time on pages whose entire content is a meta refresh.
 * Coverage divergence between gates is the kind of thing nobody notices until
 * a gate is quietly not checking something.
 *
 * Two exclusions, both deliberate:
 *
 *  - **Redirect stubs** (`http-equiv="refresh"`). There is no layout, no
 *    contrast and no accessible content to check on a page that exists to
 *    bounce the browser somewhere else.
 *  - **`/v/` frozen version snapshots.** These are previously-shipped docs;
 *    they must not be re-judged against today's rules. Note this exclusion is
 *    currently INERT and kept on purpose: the Pages workflow adds the snapshots
 *    at a step AFTER the docs build that runs these gates, so `/v/` does not
 *    exist while they run. It is here so that the intent survives if that
 *    ordering ever changes, not because it matches something today.
 *
 * **It regrew (Standardize sweep, 2026-08-21).** Three more gates were walking
 * `dist` themselves — `check-boost`, `check-links`, and `check-live-regions`,
 * the last written the same day — and the project again had four answers to
 * the page count: 101, 93, 91, 89. `check-boost` had even hand-copied HALF the
 * exclusion set (a `/v/` skip, no redirect skip), which is the precise shape
 * this file exists to prevent.
 *
 * All three now call `distPages`. `check-links` passes
 * `{ skipRedirects: false }` because its documented job includes redirect-stub
 * DESTINATIONS — the option exists so a legitimate exception stays inside the
 * chokepoint instead of forking it. Semantic equivalence was checked per gate
 * before and after: links reported the identical 8902 internal links,
 * live-regions the identical 2 unhidden / 2 hidden, boost the identical 0
 * failures and 4 probes; only the page counts converged, 101 -> 93.
 *
 * The lesson worth keeping: extracting a chokepoint does not hold on its own.
 * Nothing stopped a new gate from writing its own walker, and nothing noticed
 * for a day. If this regrows a third time, the fix is a gate over the gates —
 * a check that no `scripts/check-*.mjs` calls `readdir` on `dist` directly.
 *
 * Returns the page URL, its file path, and its HTML — the HTML has to be read
 * to detect a redirect stub anyway, so handing it back saves every caller a
 * second read (forced-colors caches exactly this).
 */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const SKIP_DIRS = ['_astro', 'pagefind', 'v'];

async function* walk(dir, rel = '') {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (SKIP_DIRS.includes(e.name)) continue;
      yield* walk(join(dir, e.name), `${rel}/${e.name}`);
    } else if (e.name === 'index.html') {
      yield { url: `${rel}/`, file: join(dir, e.name) };
    }
  }
}

/**
 * @param {string} dist  absolute path to the built docs
 * @param {{ skipRedirects?: boolean }} [opts]
 * @returns {Promise<Array<{ url: string, file: string, html: string }>>}
 */
export async function distPages(dist, { skipRedirects = true } = {}) {
  const out = [];
  for await (const p of walk(dist)) {
    const html = await readFile(p.file, 'utf8');
    if (skipRedirects && html.includes('http-equiv="refresh"')) continue;
    out.push({ ...p, html });
  }
  // Stable order: gates print page lists, and a readdir-order diff is noise.
  out.sort((a, b) => a.url.localeCompare(b.url));

  /* Zero pages is never a legitimate answer, so it throws here rather than
     being returned for each caller to not-check.

     This is the one chokepoint: axe-audit, check-layout and check-forced-colors
     all derive their entire workload from this call, and each reports a pass
     phrased as a count — "85 pages x 2 widths", "N pages scanned". With an empty
     result every one of them prints a cheerful zero and exits 0, which is the
     fail-open mode a gate must not have (CLAUDE.md: a gate that cannot run must
     fail loudly, never skip quietly). Guarding it in three callers would leave
     the fourth to be written without it; guarding it here cannot be forgotten. */
  if (!out.length) {
    throw new Error(
      `distPages: no built pages under ${dist} — the gate that called this would ` +
        'otherwise "pass" having examined nothing. Run the docs build first.',
    );
  }
  return out;
}

/**
 * What a page actually RENDERS: everything from the first hand-authored
 * `<section class="demo">`, with copyable code samples stripped.
 *
 * Both halves are load-bearing and both have been got wrong here:
 *
 * - **Start at the first demo section.** Before that point is the docs' own
 *   chrome, which is built from framework classes — a whole-page count reported
 *   `offcanvas` in 17 of 17 screens when the real figure is 1, because the
 *   shell's mobile nav IS a `.bo-offcanvas` (roadmap 45.5).
 * - **Strip `<pre>`.** Markup a reader COPIES is not markup the screen renders,
 *   and counting it would let a page claim any component by printing it
 *   (roadmap 46.2).
 *
 * `check-components-used` and `component-scores` both need exactly this and had
 * each spelled it out separately (Standardize sweep, 2026-08-19).
 * `check-learning-path` deliberately does NOT use it: that gate judges whether a
 * result appears before code, so it needs the region WITH the `<pre>` blocks in
 * place.
 */
export function demoRegion(html) {
  const start = html.indexOf('<section class="demo"');
  if (start < 0) return '';
  return html.slice(start).replace(/<pre[\s\S]*?<\/pre>/g, ' ');
}

/**
 * The demo region PLUS the demo of every same-origin page it EMBEDS.
 *
 * The RF pattern pages show their screen inside an `<iframe>` — an isolated
 * document proving the `rf-essentials` profile is sufficient on its own. A
 * gate that reads only the outer page therefore sees a screen with no
 * components in it. That was tolerable while each of those pages ALSO
 * rendered an inline copy; roadmap 131.1 removed the copies (owner: the two
 * were redundant), and `check-components-used` immediately went red on 11
 * true claims — the components are rendered, one document down.
 *
 * Following the embed is the same call `axe-audit` already makes: a
 * same-origin iframe's content is part of what the page shows. This can only
 * ADD rendered evidence, never remove it, so it cannot turn a red claim
 * green by accident — a component neither document renders still fails.
 *
 * Two details that are load-bearing:
 *
 * - **Match the src by LONGEST suffix.** CI builds with
 *   `DOCS_BASE=/busy-office-ui`, so the iframe's src carries a prefix that
 *   `distPages` urls do not. A `===` here would silently find nothing and
 *   quietly restore the blindness this exists to fix — on CI only, which is
 *   the worst place to learn it. But a *first* suffix match is worse than
 *   either: `/` is the home page's url and is a suffix of every src, so the
 *   first version of this pulled the entire landing page in as the RF
 *   screen's evidence. It reported the right verdict for three components and
 *   the wrong one for four, and what exposed it was the byte count — 13,900
 *   characters embedded from a 4,537-byte page.
 * - **An embedded page has no `<section class="demo">`** — it is the demo. So
 *   take its `<body>` and strip `<pre>`, rather than calling `demoRegion` and
 *   getting an empty string.
 *
 * @param {string} html                 the outer page
 * @param {Map<string,string>} byUrl    every built page's url -> html
 */
export function demoRegionWithEmbeds(html, byUrl) {
  const own = demoRegion(html);
  const urls = [...byUrl.keys()].sort((a, b) => b.length - a.length);
  const embedded = [...own.matchAll(/<iframe[^>]*\ssrc="([^"]+)"/g)]
    .map(([, src]) => urls.find((u) => src.endsWith(u)))
    .filter(Boolean)
    .map((u) => {
      const body = byUrl.get(u).indexOf('<body');
      return body < 0 ? '' : byUrl.get(u).slice(body).replace(/<pre[\s\S]*?<\/pre>/g, ' ');
    });
  return [own, ...embedded].join('\n');
}
