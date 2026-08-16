# busy-office-ui — project instructions

A CSS-first ERP UI framework: semantic components, density-aware tokens, modern
CSS, generated-and-verified docs. Read `DESIGN.md` for architecture, `ROADMAP.md`
for the plan, `LOOPS.md` for autonomous-work orchestration.

## Storage doctrine — markdown is source of truth, SQLite is a derived mirror

- **Narrative + contract → markdown, in git.** `ROADMAP.md`, `LOOPS.md`,
  `DESIGN.md`, `.roundtable/*.md`, and the loop log are the source of truth. They
  are reviewed and diffed; never move them into a database.
- **Structured + time-series → a SQLite *mirror*.** `loops.db` (loop telemetry) and
  graphify's `graph.db` are **derived, rebuildable, and git-ignored**. Use them to
  query — trends, counts, "give me a number" — never as the primary record.
- **Rule of thumb:** if a human should read or review it, it's a markdown file; if
  you want to *query* it, add a mirror row. Every mirror must be rebuildable from
  the files (`scripts/loops/rebuild_from_log.py`, graphify's `json_to_sqlite`).

## Autonomous loops

Work runs as loops (`LOOPS.md`): Continue / Standardize / Optimize / Explore /
Roadmap / Objective, chosen per wake by the router (P0 bug > build > tidy > explore
> grill). **Every iteration, after the commit, record it:**

```
python3 scripts/loops/record_iteration.py --loop <Loop> --mode <mode> \
    --item "<what>" --outcome <outcome>
python3 scripts/loops/record_metric.py --name <metric> --value <n> --unit <u>   # when measured
```

This keeps `.roundtable/loop-log.md` (human) and `.roundtable/loops.db` (queryable)
in sync. Query the mirror to steer prioritization.

## Quality bar (every change meets it)

- Verify **live** before committing — the docs run in a Podman container on `:8081`
  (`podman build -f apps/docs/Containerfile -t bo-docs . && podman run …`); screenshot
  at 1440px **and** 390px, in **both** light and dark themes. Podman can serve a
  **stale image from cache** — confirm the served CSS actually contains your change
  (`curl …/_astro/*.css | grep <new-class>`) and rebuild with `--no-cache` if not,
  before trusting a screenshot.
- Keep the seven build gates green: named `@container`, contrast threshold **+ coverage**,
  behaviors-vs-`.d.ts`, dist link resolution, stylelint naming, behavior tests, page-shape
  (every component docs page has its opener/`ClassRef`/demo/`ApiTable`/`Related`/sidebar entry).
- Every documented surface is **generated** from the shipped artifact, not hand-written.
- Every state signal is two-channel (visible non-color cue + programmatic).
- Small & general over specific — compose existing primitives; one component, many
  settings. Every add/remove passes the **Objective** at the top of
  `ROADMAP.md` (simplicity / less-for-more / reusability, with explicit
  accept/refuse/rethink tests) — refusing is a valid outcome.
- Adversarially grill a slice before sign-off; record findings in `.roundtable/`.

## How to document a component (the recipe)

Docs are **generated from the shipped CSS**, then wrapped in a fixed page skeleton.
Never hand-write API/contrast tables. `npm run new:component -w @busy-office/ui -- <name>`
stamps steps 1-3 below (CSS file + import, docs page, sidebar entry) in one shot; the
page-shape gate (build gate 7) then fails the build if the result drifts from this shape.
To add or document a component manually:

1. **Source of truth = the CSS.** `packages/core/src/css/components/<name>/<name>.css`,
   one `@layer bo-components` block: `.bo-<name>`, `__part`, `--modifier`. Add its
   `@import` to `src/css/index.css`. The build globs the dir, so no other registration
   is needed for `api.json` / per-file dist.
2. **Docs page** = `apps/docs/src/pages/components/<name>.astro`, always this skeleton:
   ```
   <Gallery title="Name">
     <p class="demo-note"> one line: what it is + when to use </p>
     <section class="demo"><h2>…</h2><Demo code={oneString} /><p class="bo-u-text-muted">…</p></section>
     …one demo section per setting/variant…
     <section class="demo"><h2>Markup</h2><pre><code>{canonical}</code></pre></section>
     <ClassRef component="<name>" />            {/* generated quick-ref table */}
     <ApiTable component="<name>" notes={[…]} />  {/* generated API + AA contrast */}
     <Related links={[["/components/x","X"], …]} />
   </Gallery>
   ```
   **Demo-first, spec-last** (2026-08-16, docs-IA comparison against Tailwind/
   shadcn/Bootstrap/DaisyUI): `ClassRef` and `ApiTable` sit together at the
   END, right before `Related` — a first-time visitor sees what the thing
   looks like before the full class/API surface. Every well-regarded
   framework docs site studied does this with zero exceptions; leading with
   the spec table was the single highest-leverage structural fix found.
   `Demo` renders a preview **and** its copyable code from ONE string — never write the
   preview and code twice. Keep captions short and user-facing (say what it does).
3. **Sidebar**: add `{ href: '/components/<name>', label: '…' }` to the Components group
   in `apps/docs/src/layouts/Gallery.astro`. The page slug must equal the CSS dir name,
   or add a `PAGE_SLUG` alias in `extract-api.mjs` (see `alert`→`alerts`).
4. **New colour pairing?** Add it to `PAIRS` in `scripts/check-contrast.mjs` so the gate
   validates it in both themes (e.g. the Amount field added danger/success-text on
   surface + canvas).
5. **Rebuild** — `api.json` / `contrast.json` / `llms.txt` regenerate; the link checker
   and slug assertion gate the result. Concept/guide pages are plain `.astro` in
   `concepts/` `base/` `getting-started/` + a sidebar entry; same "simple for users" bar.

## How to document a PATTERN (the second recipe)

A pattern page documents a SCREEN, not a component — ten of thirteen
used to stop at "live demo + one caption" (owner docs review,
2026-08-16). Build-gated shape (`check-page-shape.mjs`, pattern half):

1. Opener: **who uses it, how often, what "done" looks like**.
2. The live screen.
3. **Anatomy** — an ordered list mapping each region to the component
   that provides it, linked.
4. **Data contract** — the request/response/swap-target boundary. What
   the server must return, and what a 4xx returns. The HTMX story is
   meaningless without this.
5. **States** — a table. Loading, empty (and the DIFFERENT empty when
   filters exclude everything), error, partial failure, permission,
   conflict. Screens spend most of their life in these.
6. **Components used** — linked badges + a complexity badge (1-4).

Not gated but expected where they have something to say: keyboard
walkthrough, print behaviour, scaling notes. `/patterns/invoice-list`
is the exemplar.

Write for a first-time user: plain verbs, one component / many settings, and note the
two-channel cue wherever colour carries meaning.

## Don't

- Don't hand-edit generated docs (api.json, contrast.json, behaviors.json, class
  index, llms.txt) — change the source and regenerate.
- Don't commit derived mirrors (`loops.db`, `graph.db`) — they're git-ignored.
- npm publishing: `@busy-office/ui` is LIVE (0.1.0, published 2026-08-15 by the owner). Every release from here is a real version bump with a CHANGELOG entry — contract-shape changes to stable behaviors are Breaking entries per the freeze-audit correction. Publishing remains owner-triggered.
