# `npm create @busy-office/ui`

Scaffold one **runnable ERP screen** built from
[`@busy-office/ui`](https://www.npmjs.com/package/@busy-office/ui) — a CSS-first
ERP UI framework.

```sh
npm create @busy-office/ui my-erp
cd my-erp && npm install && npm run dev
```

That gives you a purchase-order screen on `localhost:5173`: a sortable data
table, real density tokens, light and dark themes, and no build step.

## What you get

```
my-erp/
  index.html     the screen — one stylesheet link, no build
  server.mjs     a 19-line dev server (node:http, nothing installed)
  package.json   one dependency: @busy-office/ui
  README.md      how to run it and where to go next
```

**Zero dependencies beyond the framework itself.** The dev server is written
into your project rather than installed, so `npm run dev` works on a plane.

## Why one screen and no options

There are no prompts and no flags, and that is a decision rather than an
omission: every question a scaffolder could ask is one you cannot answer before
you have seen a screen work. Run it, look at the result, then reach for the
[screen kit](https://busy-office.github.io/busy-office-ui/) when you want a
different shape.

The starter screen is **not hand-written** — it is snapshotted from the ERP
suite that the framework gates on every commit, so the first page you see is
one that is checked continuously rather than one nobody looks at.

## Links

- [Documentation](https://busy-office.github.io/busy-office-ui/)
- [`@busy-office/ui` on npm](https://www.npmjs.com/package/@busy-office/ui)
- [Source](https://github.com/Busy-Office/busy-office-ui)

Apache-2.0 — see the LICENSE file in this package.
