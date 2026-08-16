// Evaluated BEFORE head-support (module dependency order): the extension
// file references the bare global `htmx` at evaluation time, so the
// global must exist first. A same-module `window.htmx = htmx` after a
// static ext import gets hoisted-under (proven: "htmx is not defined"
// pageerror), and a dynamic import leaves an async gap where a fast
// boosted click swaps WITHOUT a head merge (owner root-cause doc:
// registration race). Importing this module, then the ext, is
// synchronous and race-free.
import htmx from 'htmx.org';

(window as unknown as { htmx: typeof htmx }).htmx = htmx;

export default htmx;
