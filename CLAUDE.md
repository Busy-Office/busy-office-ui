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
  # outcome: landed | released | logged | triaged | refused | reverted
  # "shipped" is rejected — it hid that nothing had reached npm (41.2)
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

## Claims that assert runtime behavior must be executable

If a page says the browser will do something — "Cancel reverts totals",
"this blocks interaction", "the skip link lands after the grid", "409
re-renders with a banner" — add a case to
`apps/docs/scripts/check-claims.mjs`. A dogfood spike (2026-08-17)
proved a confident, reviewed page flatly wrong: htmx discards non-2xx
responses, so the documented 409 pattern did nothing at all. Drive real
key/mouse events in those checks — a synthetic `keydown` on `document`
matches no delegated handler and reports a false failure.

## Red-proving a gate: verify the INJECTION, not just the red result

A gate is only trustworthy if you have watched it fail. Every trap below
produced a green "red test" — a detector that can never fail — and each
cost real time before it was caught. Confirm the injection took effect
(grep the BUILT output, or assert the computed style) before believing a
passing gate.

- An injected rule whose selector the page never uses (2026-08-17).
- `max-inline-size` on a table cell — table layout ignores it, so
  nothing clips (2026-08-17).
- An injected element that is **invisible**: an alt-less
  `<img src="/x.png">` 404s, renders 0x0, and axe skips it as not
  visible. It must be *rendered* to be caught (2026-08-18).
- An injection that **lands in a comment**. Two attempts at the axe gate
  inserted after the first `<main` in a built page — which is inside an
  HTML comment about skip links. The served HTML contained the markup
  while the DOM held zero matching elements. If the injection is real,
  the DOM shows it: assert that, not the file (2026-08-18).
- Grepping the **source spelling in minified output**:
  `print-color-adjust: exact` is emitted without the space, so the check
  found nothing while the gate was correctly red (2026-08-18).

The same discipline applies to measurement, not just injection: **measure
the box that carries the constraint.** A sidebar label that shrink-wraps
its text has `scrollWidth === clientWidth` always, so its own overflow can
never be non-zero — three consecutive measurements reported "not clipped"
while the label was spilling 15.7px past the rail. Only its right edge
against the RAIL's client edge showed it (2026-08-18).

## A heuristic gate must be able to demonstrate it can fail

Red-proving asks "does this gate go red on the bug?". This asks the question
underneath it: **could this detector go red on anything at all?**

Across Slices 39-41 the dominant failure was not a bug in the framework but a
detector that could not fail. Slice 39.2 alone produced **four in a row**, each
passing 18/18 while measuring nothing: `class="demo"` (every section has it),
the first `bo-*` after `<main` (the `<main>` tag itself matches), the first
non-chrome `bo-*` (the docs shell's own menu button — the same byte offset on
all eighteen pages, which is what finally gave it away), and any non-utility
`bo-*` (counted Related-footer badges as results). None was caught by review.
One was caught by a number that was too tidy to be true.

So every gate declares its signal in its header, and `check:selftests` enforces
that the declaration exists:

- **`@heuristic`** — the verdict rests on *recognising* something: a position, a
  pattern, whether a class is chrome or content. These can be fooled and have
  been. They ship `--self-test`, which runs the detector against inputs it must
  classify correctly and exits non-zero if it cannot tell them apart.
- **`@exact`** — the verdict rests on equality, membership, or a measurement
  taken in a real browser. Exempt, and the exemption is stated so nobody wraps
  ceremony around a `readdir`.

**The meta-gate itself failed this on its first run.** It looked for the string
`--self-test`, and every heuristic gate matched — because the tag text says
"Carries --self-test". The gate written to catch detectors that cannot fail was,
for one run, a detector that could not fail. It now requires the `process.argv`
branch that actually runs one. Assume this failure mode applies to your check
too, including the check you are writing to catch it.

## A bulk edit is verified against the RENDERED artefact

A regex over source is not a refactor. It is a bet that every match means the
same thing, and in these files it repeatedly did not — pattern pages mix live
markup with template literals a reader copies, and prose repeats the identifiers
the code uses.

Three failures in one session (2026-08-18), each caught late or by luck:

- `./serve-dist.mjs` became `./serve-DIST.mjs` in eight import specifiers.
  **Every gate passed locally** because APFS is case-insensitive; Linux CI
  failed with `ERR_MODULE_NOT_FOUND`.
- The same rename rewrote *prose*, including a user-facing gate message that
  started reporting "internal links verified against DIST".
- A third put an Astro **component call inside a copy-paste code sample**, and
  labelled rows with other rows' names (`LINE-1` as "Hydraulic pump"). The file
  was reverted rather than shipped.

Reading the source diff missed the third one **twice**. What caught it was
pairing each rendered row against its own content — the label on a Save button
against the value in that row's first cell. So:

**Verify a bulk edit against what it renders, not against the diff that made
it.** Compare the built output before and after, and assert the property that
matters (every row's label matches that row; every relative import resolves
case-exactly; no component call survives inside a `<pre>`). If the change is
supposed to be layout-neutral, measure that too — a 42px page growth traced to a
code sample gaining two lines is a fine answer; not knowing why is not.

When a file mixes live markup with samples, prefer editing by hand, one block at
a time. It is slower than a regex and faster than a revert.

## A gate that only runs in CI is not known to work

**CI's full checkout is the most permissive environment the build sees.**
Every file is present, the network is up, and nothing else is competing.
A gate verified only there has been proven to work in the easiest case
and nowhere else — that is not portability, it is one data point.

Verify a new gate in the **narrowest context that must run it**. Twice in
one session a gate was green in CI and wrong elsewhere: `check:rtl`'s
DESIGN.md assertion broke the po-app image build, because that context
copies only `packages/` and the file simply is not there; and the axe
sweep drifted red for a week unnoticed because it needed a hand-started
container, so nobody ran it.

Two consequences worth stating outright:

- **A gate that cannot run must fail loudly, never skip quietly.** If an
  input is legitimately absent, say so in the output — `check:rtl` warns
  that "DESIGN.md is not in this build context, so its flip-site count
  was NOT verified" rather than reporting a clean pass it did not earn.
- **A gate that needs a human to start something is not a gate.** If it
  depends on a container, a server, or a port, it must start that itself
  (see `serveDist` in `apps/docs/scripts/serve-dist.mjs`).

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
