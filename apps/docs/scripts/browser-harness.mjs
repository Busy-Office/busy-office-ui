/**
 * One canonical headless-Chrome launch for every browser-driven gate.
 *
 * Ten gates each had their own `puppeteer.launch({...})`, and the copies had
 * drifted into three different `protocolTimeout` values (60000, 120000, and two
 * scripts on puppeteer's 180000 default) with nothing recording why any of them
 * differed (Standardize sweep, 2026-08-18). That is a real inconsistency, not a
 * cosmetic one: a slow CI runner fails check-claims at 60s while axe-audit is
 * still happily waiting, so which gate reports the problem depends on which
 * copy the author happened to paste.
 *
 * Two things this deliberately does NOT do, both checked rather than assumed:
 *
 *  - **No try/finally wrapper.** The obvious-looking finding here is "9 of 10
 *    gates never close the browser on a throw, so CI leaks Chrome." Measured on
 *    puppeteer-core 25.7: it registers its own process-exit hook, and a gate
 *    that throws mid-run leaves zero Chrome processes behind (before=0,
 *    after=0). There is no leak to fix, so there is no wrapper here.
 *  - **No `headless: 'new'`.** Nine copies used the `'new'` spelling, one used
 *    `true`. Since puppeteer 22 these select the same renderer and `'new'` is
 *    the deprecated alias — so the majority spelling was the wrong one, and the
 *    visual-regression outlier was already correct. Worth stating because
 *    "9 agree, 1 differs" reads like the 1 is the bug.
 */
import puppeteer from 'puppeteer-core';
import { resolveChrome, chromeArgs } from './resolve-chrome.mjs';

/**
 * The ceiling for a single CDP round-trip. 120s is the highest value any gate
 * had chosen for itself: the slowest real operations are full-page screenshots
 * and axe runs on the biggest pages, and picking the shortest of the three
 * observed values would have made those flaky on a loaded runner.
 */
export const PROTOCOL_TIMEOUT = 120_000;

/** Launch the browser every docs gate uses. Callers still own `close()`. */
export function launchDocsBrowser(overrides = {}) {
  return puppeteer.launch({
    executablePath: resolveChrome(),
    args: chromeArgs(),
    headless: true,
    protocolTimeout: PROTOCOL_TIMEOUT,
    ...overrides,
  });
}
