/**
 * The consumer-facing markup validator command, in ONE place.
 *
 * It used to be spelled out in three: the scaffolder's generated `check`
 * script, the pasteable assistant instructions, and llms.txt. Three copies of
 * a command is three chances to rename the binary and leave two of them
 * telling a consumer — or a coding assistant — to run something that no longer
 * exists.
 *
 * The TARGET genuinely differs by context and must keep differing:
 *
 *   built     a docs or app build validates its BUILT html, which lives in
 *             `dist` — the source is Astro, not HTML, so the question is only
 *             well posed on the rendered artifact.
 *   scaffold  a generated project has no build step at all: its own directory
 *             IS the output, so `.` is correct there and `dist` would name a
 *             folder that never appears.
 *
 * Sharing the construction is not the same as flattening the behaviour, so the
 * targets are named here rather than unified.
 *
 * Lives in `create-ui` and ships inside its tarball. An installed scaffolder
 * must never import a sibling workspace path: outside this monorepo that path
 * is simply absent, and the failure would be at a consumer's first command.
 */

/** The published bin name. Both packages' manifests must agree with this. */
export const MARKUP_VALIDATOR = 'bo-check-markup';

/** Where each execution context points the validator. */
export const VALIDATE_TARGETS = {
  built: 'dist',
  scaffold: '.',
};

/**
 * @param {string} target one of VALIDATE_TARGETS
 * @param {{ npx?: boolean }} [opts] prefix with `npx` — for someone who has
 *   not installed the bin yet, which is the docs/instructions case. A
 *   generated project lists the dependency, so its own script does not need it.
 */
export function validateCommand(target, { npx = false } = {}) {
  return `${npx ? 'npx ' : ''}${MARKUP_VALIDATOR} ${target}`;
}
