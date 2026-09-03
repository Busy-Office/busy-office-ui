/**
 * The install command per package manager, in ONE place.
 *
 * `getting-started/installation.astro` SHOWS these and `check:quickstart` RUNS
 * them, so a restated list is a list that drifts — the same reason
 * MARKUP_RULES is shared rather than copied into gen-llms.mjs.
 *
 * `tarballArgv` is how the gate installs the LOCAL build instead of the
 * registry, for check-quickstart.mjs's own stated reason: the registry tells
 * you whether 0.7.0 worked, this tells you whether the thing about to be
 * published works. It is NOT what the page shows — the page shows `command`,
 * which is what a reader types.
 *
 * yarn's argv differs because yarn 1 needs the `file:` protocol for a local
 * tarball; `yarn add @busy-office/ui` from the registry needs no such thing,
 * which is why the two fields are separate rather than derived from each other.
 */
export const PACKAGE_MANAGERS = [
  { name: 'npm', command: 'npm i @busy-office/ui', tarballArgv: (t) => ['i', t] },
  { name: 'pnpm', command: 'pnpm add @busy-office/ui', tarballArgv: (t) => ['add', t] },
  { name: 'yarn', command: 'yarn add @busy-office/ui', tarballArgv: (t) => ['add', `file:${t}`] },
  { name: 'bun', command: 'bun add @busy-office/ui', tarballArgv: (t) => ['add', t] },
];

export const NPM = PACKAGE_MANAGERS.find((p) => p.name === 'npm');
export const OTHER_PACKAGE_MANAGERS = PACKAGE_MANAGERS.filter((p) => p.name !== 'npm');
