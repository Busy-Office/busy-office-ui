/**
 * Gate: the PUBLISHED site is the site we just built.
 *
 * Every other gate in this repo judges `dist/` — the artefact on this machine.
 * None of them could tell you whether that artefact ever reached a reader. It
 * did not, for four commits: `actions/deploy-pages` returned 503 five times
 * running while CI stayed green, and the staleness was found by accident
 * (Objective grill F5, 2026-08-18). A project this careful about whether a gate
 * can run in the narrowest context had no measurement of its own delivery.
 *
 * WHERE THIS RUNS MATTERS. It cannot go in the CI build: during CI for commit
 * X the published site is still X-1 by definition, so it would fail always. It
 * belongs AFTER the deploy step, which is the only moment "published == HEAD"
 * is supposed to be true. It is also useful by hand — `node
 * scripts/check-published.mjs` answers "is the site stale?" directly.
 *
 * Two outcomes are deliberately NOT the same thing:
 *
 *   STALE        the site answers, and is serving a different commit.
 *                A real regression. Exit 1.
 *   UNREACHABLE  the site does not answer at all, or answers non-2xx.
 *                Exit 0 with a loud line. A DNS blip or a CDN hiccup is not
 *                evidence that the deploy failed, and a gate that reds the
 *                build on someone else's network is a gate people learn to
 *                ignore — which is worse than not having it.
 *
 * The retries exist because Pages serves through a CDN: right after a deploy
 * the edge can still hold the previous build for a few seconds, so a single
 * immediate fetch would produce a false STALE.
 */
const SITE = process.env.PUBLISHED_URL || 'https://busy-office.github.io/busy-office-ui/';
const EXPECTED = process.env.EXPECTED_SHA || process.env.GITHUB_SHA;
const ATTEMPTS = Number(process.env.PUBLISHED_ATTEMPTS || 6);
const GAP_MS = Number(process.env.PUBLISHED_GAP_MS || 10000);

if (!EXPECTED) {
  console.error('published check: no EXPECTED_SHA/GITHUB_SHA to compare against — refusing to guess');
  process.exit(1);
}

const url = new URL('build-id.json', SITE).href;
const short = (s) => (s || '').slice(0, 7);

let lastErr = null;
let served = null;
/* A 404 is NOT "unreachable", and conflating them was this script's own first
   bug — found by running it against the real site rather than only against the
   local harness, where every failure was a dead port. A site that answers with
   404 is up; it is simply not serving the marker. Since this only runs AFTER a
   deploy, that means the deploy did not land, which is exactly the staleness
   the gate exists to catch. Other non-2xx (a 5xx from the CDN) stays transient. */
let missingMarker = false;

for (let i = 1; i <= ATTEMPTS; i += 1) {
  try {
    // cache-bust: we are asking what the EDGE holds right now, and a 304 from
    // an intermediary would answer a question we did not ask.
    const res = await fetch(`${url}?t=${Date.now()}`, { cache: 'no-store' });
    missingMarker = res.status === 404;
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    served = await res.json();
    if (served.sha === EXPECTED) {
      console.log(`published check passed — ${SITE} is serving ${short(EXPECTED)}, built ${served.builtAt}`);
      process.exit(0);
    }
    console.log(`  attempt ${i}/${ATTEMPTS}: edge still serving ${short(served.sha)}, want ${short(EXPECTED)}`);
  } catch (err) {
    lastErr = err;
    console.log(`  attempt ${i}/${ATTEMPTS}: ${err.message}`);
  }
  if (i < ATTEMPTS) await new Promise((r) => setTimeout(r, GAP_MS));
}

if (!served && missingMarker) {
  console.error(
    `published check FAILED — ${SITE} answered, but is serving no build marker (404 on build-id.json).\n` +
      `  expected: ${EXPECTED}\n` +
      'The site is up and does not have this build. Re-run the deploy workflow.',
  );
  process.exit(1);
}

if (!served) {
  // Never got an answer at all. Say so loudly, and do NOT red the run: an
  // unreachable site is not proof of a stale one.
  console.error(
    `published check NOT VERIFIED — ${url} was unreachable after ${ATTEMPTS} attempts (${lastErr?.message}). ` +
      'This is not a pass: nothing was checked.',
  );
  process.exit(0);
}

console.error(
  `published check FAILED — ${SITE} is STALE.\n` +
    `  serving : ${served.sha} (built ${served.builtAt})\n` +
    `  expected: ${EXPECTED}\n` +
    'The build succeeded but readers are not getting it. Re-run the deploy workflow.',
);
process.exit(1);
