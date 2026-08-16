// Find a Chrome/Chromium binary across dev machines and CI runners.
//
// Hardcoding the macOS path in check-boost.mjs turned CI red for three
// commits before anyone noticed (2026-08-16) — the gate passed locally
// and could not even start in Actions. Resolving from a candidate list
// fixes that; failing LOUDLY when nothing is found keeps it from
// silently skipping (a gate that can't run must not report success).
import { existsSync } from 'node:fs';

const CANDIDATES = [
  process.env.CHROME_PATH,
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
].filter(Boolean);

// Chrome refuses to start as root without --no-sandbox, which is exactly the
// container-image build (2026-08-17). Gate that on the uid rather than passing
// it everywhere: dropping the sandbox on a dev machine or a CI runner — neither
// of which runs as root — would be a real weakening for no benefit.
export function chromeArgs() {
  return process.getuid?.() === 0 ? ['--no-sandbox'] : [];
}

export function resolveChrome() {
  const found = CANDIDATES.find((p) => existsSync(p));
  if (!found) {
    console.error(
      'No Chrome/Chromium found. Set CHROME_PATH, or install Chrome.\nTried:\n  ' +
        CANDIDATES.join('\n  '),
    );
    process.exit(1);
  }
  return found;
}
