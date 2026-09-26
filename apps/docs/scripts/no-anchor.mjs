/**
 * Make a page behave like a browser WITHOUT CSS anchor positioning (roadmap 387.1).
 *
 * The framework's declared browser floor (floor.json, derived from the shipped
 * CSS) predates `position-area` in all three engines: the compat data
 * (`@mdn/browser-compat-data`, css.properties.position-area) puts it well above
 * the floor. So a whole band of supported browsers takes data-table.css's
 * `@supports not (position-area: block-end)` branch, which no gate exercised:
 * the docs' own Chrome always takes the anchored one. `anchor-name` arrived
 * in Chrome 125, four majors before `position-area`, and the feature test names
 * the latter, so those Chromes take the fallback too.
 *
 * Every stylesheet response is rewritten so the `position-area: block-end`
 * feature test names a property that does not exist. `@supports (…)` is then
 * false and `@supports not (…)` true, exactly as in such a browser, and nothing
 * else in the CSS changes. It is a SIMULATION in one engine (layout and hit
 * testing are Chrome's), not a run in Firefox or Safari; it cannot show how
 * those two place a statically positioned box.
 *
 * `extraCss` is appended to every sheet, unlayered, for a counterfactual.
 *
 * The rewrite refetches each sheet from Node, without the page's own request
 * headers or cookies, which is fine for a static `dist` but is not the browser's
 * response. A sheet that cannot be refetched is served unchanged, and the
 * simulation then silently does not apply to it, so the returned counters say
 * how many sheets were rewritten and how many fell through: a caller that
 * reports a result from this page must check `passedThrough === 0`.
 */
export async function simulateNoAnchor(page, { extraCss = '' } = {}) {
  const stats = { rewritten: 0, passedThrough: 0 };
  await page.setRequestInterception(true);
  page.on('request', async (req) => {
    if (req.resourceType() !== 'stylesheet') return req.continue();
    try {
      const res = await fetch(req.url());
      const text = (await res.text()).replace(/position-area\s*:\s*block-end/g, 'position-area-off: block-end');
      stats.rewritten++;
      return req.respond({ status: res.status, contentType: 'text/css', body: text + (extraCss ? '\n' + extraCss : '') });
    } catch { stats.passedThrough++; return req.continue(); }
  });
  return stats;
}
