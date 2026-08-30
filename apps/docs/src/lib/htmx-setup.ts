// Exposes the imported module as the global `htmx` — pattern demo pages on
// this site reference the bare global, not the module.
import htmx from 'htmx.org';

(window as unknown as { htmx: typeof htmx }).htmx = htmx;

export default htmx;
