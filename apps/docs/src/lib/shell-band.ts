// The ONE band the stylesheet declares for the app shell, PARSED from the
// source CSS at build — the single reader, as `semantic-css.ts` is for the
// colour tier. `.bo-app-shell` names the container `bo-shell`
// (primitives/sidebar-layout.css); `sidebar-nav.css` is the only rule that
// queries it. Every docs page that states the band prints these constants:
// four pages used to type the number by hand (roadmap 377.14), and nothing
// compared them to the stylesheet, so a CSS change would have moved the
// framework and left the prose quietly stale. `check-floor` fails the build
// on a literal restatement. Frontmatter-only — never ships to the client.
const navFiles = import.meta.glob<string>('../../../../packages/core/src/css/components/sidebar-nav/sidebar-nav.css', {
  query: '?raw', import: 'default', eager: true,
});
const navCssSrc = Object.values(navFiles)[0];
if (!navCssSrc)
  throw new Error('shell-band: components/sidebar-nav/sidebar-nav.css did not resolve — the glob path is wrong, not the band.');

const bands = [...navCssSrc.matchAll(/@container bo-shell \(max-width:\s*([\d.]+)rem\)/g)].map((m) => Number(m[1]));
if (bands.length !== 1)
  throw new Error(
    `shell-band: expected exactly ONE '@container bo-shell (max-width: …rem)' in sidebar-nav.css, found ${bands.length} ` +
      `[${bands.join(', ')}]. Every page that prints the band assumes a single one; add the new one here deliberately.`,
  );

/** The shell band as the stylesheet spells it, in rem. */
export const SHELL_BAND_REM = bands[0];
/** The same band in CSS px at the default 16px root. */
export const SHELL_BAND_PX = SHELL_BAND_REM * 16;
