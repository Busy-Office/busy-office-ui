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
- Keep the six build gates green: named `@container`, contrast threshold **+ coverage**,
  behaviors-vs-`.d.ts`, dist link resolution, stylelint naming, behavior tests.
- Every documented surface is **generated** from the shipped artifact, not hand-written.
- Every state signal is two-channel (visible non-color cue + programmatic).
- Small & general over specific — compose existing primitives; one component, many
  settings.
- Adversarially grill a slice before sign-off; record findings in `.roundtable/`.

## How to document a component (the recipe)

Docs are **generated from the shipped CSS**, then wrapped in a fixed page skeleton.
Never hand-write API/contrast tables. To add or document a component:

1. **Source of truth = the CSS.** `packages/core/src/css/components/<name>/<name>.css`,
   one `@layer bo-components` block: `.bo-<name>`, `__part`, `--modifier`. Add its
   `@import` to `src/css/index.css`. The build globs the dir, so no other registration
   is needed for `api.json` / per-file dist.
2. **Docs page** = `apps/docs/src/pages/components/<name>.astro`, always this skeleton:
   ```
   <Gallery title="Name">
     <p class="demo-note"> one line: what it is + when to use </p>
     <ClassRef component="<name>" />            {/* generated quick-ref table */}
     <section class="demo"><h2>…</h2><Demo code={oneString} /><p class="bo-u-text-muted">…</p></section>
     …one demo section per setting/variant…
     <section class="demo"><h2>Markup</h2><pre><code>{canonical}</code></pre></section>
     <ApiTable component="<name>" notes={[…]} />  {/* generated API + AA contrast */}
     <Related links={[["/components/x","X"], …]} />
   </Gallery>
   ```
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

Write for a first-time user: plain verbs, one component / many settings, and note the
two-channel cue wherever colour carries meaning.

## Don't

- Don't hand-edit generated docs (api.json, contrast.json, behaviors.json, class
  index, llms.txt) — change the source and regenerate.
- Don't commit derived mirrors (`loops.db`, `graph.db`) — they're git-ignored.
- Don't publish to npm — owner-gated until "perfect".
