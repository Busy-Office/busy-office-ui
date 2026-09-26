# busy-office-ui — project instructions

A CSS-first ERP UI framework: semantic components, density-aware tokens, modern
CSS, generated-and-verified docs. Read `DESIGN.md` for architecture, `ROADMAP.md`
for the plan, `LOOPS.md` for autonomous-work orchestration.

## Storage doctrine — markdown is source of truth, SQLite is a derived mirror

- **Narrative + contract → markdown, in git.** `ROADMAP.md`, `ROADMAP-archive.md`,
  `LOOPS.md`, `DESIGN.md`, `.roundtable/*.md`, and the loop log are the source of
  truth. They are reviewed and diffed; never move them into a database.
  `ROADMAP.md` holds what is OPEN; `ROADMAP-archive.md` holds closed slices
  verbatim, with a one-line pointer left behind. This is a **recurring sweep**:
  110.4 moved 83 slices, the live file grew back to 9,824 lines in three days,
  and a second pass moved 44 more (→ 1,094). **It regrows every few days,
  so read `roadmap_scope.py` rather than this sentence. 249.12 is the open item for its
  trigger.**
  Splitting a markdown file is not
  what the database rule forbids — the archive is still markdown, still
  reviewed, still diffed. `check:slice-refs` keeps the citations pointing into it
  resolvable (the gate prints the live count).
- **Anything you SORT, FILTER or COUNT → a SQLite *mirror*.** `loops.db` (loop
  telemetry, and the roadmap backlog) and graphify's `graph.db` are **derived,
  rebuildable, and git-ignored**. Never the primary record.

  Widened from "structured + time-series" on 2026-08-25, because that wording
  was read as "telemetry only" and left the backlog unqueryable: dispatcher
  rule 4 wants *the oldest still-open item*, which is an `ORDER BY`, and it was
  answered by scanning a 9,824-line file every wake. A backlog is structured
  and is not a time series; it still deserves a mirror.
- **Rule of thumb:** if a human should read or review it, it's a markdown file; if
  you want to *query* it, add a mirror row. Every mirror must be rebuildable from
  the files (`scripts/loops/rebuild_from_log.py`, graphify's `json_to_sqlite`).
- **A mirror must RECONCILE against its source and fail loudly when it cannot.**
  This is the rule the doctrine was missing, and it cost something real:
  `STATUS.md` silently listed **7 of 9** open items for weeks — its parser
  required a numeric id, so "OWNER CALL — direction", a stated release blocker,
  was invisible in the section that exists to surface owner decisions. A mirror
  that under-reports is worse than no mirror, because its number gets quoted
  while steering priorities. Every generator now counts the raw thing in the
  source (`N. [ ]` checkboxes) and refuses to write if fewer were parsed.

  The general form: **a derived artefact may not decide, on its own, what it
  failed to see.** Assert the count, not just the content.

  **And reconcile against the SOURCE, not against the argument** — the same
  day this rule was written, the first mirror built under it compared its row
  count to *the list it had just been handed*. That is self-consistent by
  construction: hand it a short list and it agrees with itself. Red-proving it
  by dropping an item produced a **pass**. A reconciliation that cannot see
  past its own caller is a detector that cannot fail, and the tell is that
  nothing in the check re-reads the file. Count the raw thing in the markdown.
- **Why the record itself stays markdown**, restated because it gets asked: the
  roadmap is prose that is argued with — accept/refuse tests, measurements,
  realignments — and `git diff` on that IS the review. A `.db` is a binary blob:
  no diff, no merge, no PR review, and two wakes editing it conflict
  irreconcilably. **slice numbers are cited from shipped CSS comments**, and
  `roadmap 130.3` has to resolve to something a person opens with no tooling.

## Autonomous loops

Work runs as loops (`LOOPS.md`; the names are the `loop:` comment in the block
below, which `check:loop-vocab` holds to the recorder's set), chosen per wake by the dispatcher's rules in `LOOPS.md` Step 2 (not restated
here: restatements drift). `Meta` labels refusal rows. **Every
iteration, after the commit, record it:**

```
python3 scripts/loops/record_iteration.py --loop <Loop> --mode <mode> \
    --item "<what>" --outcome <outcome>
  # loop: Continue | Standardize | Polish | Research | Optimize | Explore | Objective | Gauntlet | Roadmap | Meta
  # outcome: landed | released | logged | triaged | refused | reverted
  # "shipped" is rejected — it hid that nothing had reached npm (41.2)
  # a refusal decided INSIDE this item, whatever the item's own outcome:
  #   --also-refused "<what was refused, one line>"   (repeatable; 51.1/62.1)
  # milestone work: --milestone M1; defect-track work: --track defect (393.5)
  # who did it: --route <routes.json id> --model --agent --skill --first-try (393.6)
python3 scripts/loops/record_metric.py --name <metric> --value <n> --unit <u>   # when measured
```

This keeps `.roundtable/loop-log.md` (human) and `.roundtable/loops.db` (queryable)
in sync, and regenerates `STATUS.md` and `.roundtable/INDEX.md`. Query the mirror
to steer prioritization.

**Before grilling something, check `.roundtable/INDEX.md`** — every finding lives
there and browsing them previously required knowing a filename in advance. The
index is generated, lists every finding with its date and whether anything cites
it, and prints the count of **repeated subjects**: the same question grilled
twice is the signature of a directory that has outgrown retrieval, so it is
measured on every run rather than asserted. It read 3 when written, all
deliberate follow-ups.

## Jev — typed second opinion at two points (rubrics: `.roundtable/jev-rubrics.md`)

Jev (`jev-ai.pro`, MCP tools `jev_evaluate` / `jev_route`) answers typed
`noul`/`choice`/`score` questions with probabilities. Use it at exactly two
points: **deciding between drafted alternatives**, and **reviewing whether
evidence supports a completion claim**. Batch questions that share one evidence
state into one call. Do not call it per action, per file, or for anything the
code can answer — read the code instead. It is a different service from `kev`;
never substitute one for the other.

**It is advisory and it is not a gate.** PASS needs the required checks to pass
AND the criteria to be supported; a failed check is FAIL whatever Jev says; and
a Jev outage is **UNVERIFIED, never PASS**. `noul` is a probability, not a
confidence, and a `score` is a weighted mean over levels — not a confidence
either. Thresholds (≥0.85 supports, ≤0.35 does not, between = unverified) are
**provisional at n=5**; the rubric file carries the validation set to re-run.

**Agents consult it too, at the same two points** (owner, 2026-09-26). A
subagent or workflow agent reaches Jev through the session's MCP server
(ToolSearch, then `mcp__jev__jev_evaluate`). A sandboxed script calling the API
directly reads `JEV_AI_API_KEY` from its environment, which the git-ignored
`.claude/settings.local.json` supplies (owner's request; `jev-rubrics.md` has
the handling rules). Credit is not the limit; the two points are. An agent that
consults it:
- **forms its own verdict first**, then asks, and reports both. A disagreement
  is surfaced as a finding, never settled by Jev;
- sends **raw evidence** (the command and its output, the diff, the rendered
  value), never its own summary or conclusion, or Jev grades the summary;
- makes one call per evidence state and records the reading and the
  response's `model` string;
- reads an outage as UNVERIFIED, and never lets a reading decide a gate or a
  PASS.

**A blind scorer or critic never consults it** (LOOPS §3b step 4, the
Gauntlet critic). A reading seen before its own verdict is the prior its
independence exists to exclude.

## Quality bar (every change meets it)

- Verify **live** before committing — the docs run in a Podman container on `:8081`
  (`podman build -f apps/docs/Containerfile -t bo-docs . && podman run …`); screenshot
  at 1440px **and** 390px, in **both** light and dark themes. Podman can serve a
  **stale image from cache** — confirm the served CSS actually contains your change
  (`curl …/_astro/*.css | grep <new-class>`) and rebuild with `--no-cache` if not,
  before trusting a screenshot.
  - The `chrome-devtools-mcp` plugin drives this end-to-end against the running
    `:8081` container: `new_page` → `navigate_page` to the component page,
    `emulate` for each of the 4 viewport/theme combinations, `take_screenshot`
    for the actual verification, and `evaluate_script` / `list_network_requests`
    in place of the `curl … | grep` stale-cache check. Its `a11y-debugging` and
    `debug-optimize-lcp` skills also cover the contrast/ARIA and CWV checks this
    bar requires.
  - The `modern-web-guidance` plugin auto-triggers on HTML/CSS/client-JS work
    (container queries, `:has()`, view transitions, forms, CWV) — no manual
    invocation, it just keeps suggestions current instead of relying on stale
    training-data patterns.
- Keep the build gates green. `npm run build -w @busy-office/ui` and `npm run
  docs:build` run them all — 58 today, 25 of them `@heuristic` detectors that each
  ship a `--self-test` (`check:selftests` prints the live split; the READMEs are
  stamped from it, so the number cannot drift silently). The ones most often hit:
  named `@container`, contrast threshold **+ coverage**, behaviors-vs-`.d.ts`, dist
  link resolution, stylelint naming, page-shape (every component docs page has its
  opener/`ClassRef`/demo/`ApiTable`/`Related`/sidebar entry).
  **Behavior tests are NOT part of either build** — `npm test -w @busy-office/ui`
  runs vitest, and CI runs it as its own step. A green build says nothing about
  behaviour regressions; run the tests too.
- Every documented surface is **generated** from the shipped artifact, not hand-written.
- Every state signal is two-channel (visible non-color cue + programmatic).
- Small & general over specific — compose existing primitives; one component, many
  settings. Every add/remove passes the **Objective** at the top of
  `ROADMAP.md` (simplicity / less-for-more / reusability, with explicit
  accept/refuse/rethink tests) — refusing is a valid outcome.
- Adversarially grill a slice before sign-off; record findings in `.roundtable/`.

## How to document a component (the recipe)

Docs are **generated from the shipped CSS**, then wrapped in a fixed page skeleton.
Never hand-write API/contrast tables. `npm run new:component -w @busy-office/ui -- <name>
--group="<category>" --tagline="<one sentence>"` stamps steps 1-2 below (CSS file with its
header + `@import`, docs page) in one shot; the page-shape gate (build gate 7) then fails
the build if the result drifts from this shape. To add or document a component manually:

1. **Source of truth = the CSS.** `packages/core/src/css/components/<name>/<name>.css`,
   one `@layer bo-components` block: `.bo-<name>`, `__part`, `--modifier`. Add its
   `@import` to `src/css/index.css`. The build globs the dir, so no other registration
   is needed for `api.json` / per-file dist.

   **The file's header carries the component's registration** (roadmap 249.8), as
   `@directive` lines at the start of a line inside a comment:

   ```css
   /* @tagline A short status chip for approval states and document statuses.
      @category Display
      @label Keyboard key      ← only when the dir name does not title-case into it
      @order 40 */             ← only to rank it; omitting appends to the group
   ```

   `@tagline` (30-120 characters, one plain sentence) and `@category` (one of the
   eight in `extract-api.mjs`'s `CATEGORIES`) are **required — the core build throws
   naming the file without them**. `extract-api.mjs` lifts them into `api.json`, and
   the docs sidebar, the homepage "Find it by task" tiles and `llms.txt` are all
   generated from there. Two components sharing a docs page (skeleton + state) must
   declare the same `@category`/`@label`/`@order`; disagreeing fails the build.
2. **Docs page** = `apps/docs/src/pages/components/<name>.astro`, always this skeleton:
   ```
   <Gallery title="Name" description="one sentence, 40-160 chars — the meta description">
     <p class="demo-note"> one line: what it is + when to use </p>
     <section class="demo"><h2>…</h2><Demo code={oneString} /><p class="bo-u-text-muted">…</p></section>
     …one demo section per setting/variant…
     <section class="demo"><h2>Markup</h2><pre><code>{canonical}</code></pre></section>
     <ClassRef component="<name>" />            {/* generated quick-ref table */}
     <ApiTable component="<name>" notes={[…]} />  {/* generated API + AA contrast */}
     <Related links={[["/components/x","X"], …]} />
   </Gallery>
   ```
   **`description` is required and is NOT the opener** (249.2). It becomes
   `<meta name="description">` — the sentence a search result and a shared link
   show, which the opener's markup, entities and 200-400 characters cannot be.
   Three layers enforce it, each seeing something the others cannot:
   `Gallery.astro` throws (the Gallery callers), `check-page-shape` fails naming
   the file (all 127 source pages, including the 11 that build their own
   `<head>`), and `check-metadata.mjs` asserts it on the BUILT page, where it
   can also see length and **uniqueness** — a copy-paste passes a presence check
   in full.

   **The opener must say when NOT to use it.** One bolded clause —
   `<strong>Not for …</strong>` / `Not when …` — naming a context where this
   component is the wrong choice and linking the alternative. This is a
   requirement, not a nicety: the DSA rubric's `content` dimension asks for
   exactly this, and when two families were measured against it **10 of 11
   pages had nothing** (roadmap 94.10) — a missing step in the recipe, not a
   run of oversights. `check:wrong-choice` enforces the clause's presence;
   what it *says* is your judgement. A component with genuinely no wrong
   context goes in that gate's `EXEMPT` map **with a reason** — forcing a
   sentence where none is true produces filler, which is worse than silence.

   **Demo-first, spec-last** (2026-08-16, docs-IA comparison against Tailwind/
   shadcn/Bootstrap/DaisyUI): `ClassRef` and `ApiTable` sit together at the
   END, right before `Related` — a first-time visitor sees what the thing
   looks like before the full class/API surface. Every well-regarded
   framework docs site studied does this with zero exceptions; leading with
   the spec table was the single highest-leverage structural fix found.
   `Demo` renders a preview **and** its copyable code from ONE string — never write the
   preview and code twice. Keep captions short and user-facing (say what it does).
3. **Sidebar**: nothing to do — it is generated from step 1's `@category`/`@order`
   (roadmap 249.8; `apps/docs/src/data/component-nav.mjs` is the one module that
   builds it, and `Gallery.astro` spreads it). The page slug must equal the CSS dir
   name, or add a `PAGE_SLUG` alias in `extract-api.mjs` (see `alert`→`alerts`).
   A docs page with **no CSS directory at all** (`inline-editing`, `table-toolbar`)
   or an anchor into another component's page (`form#dates`) has no header to carry
   its metadata, so it goes in that module's `COMPONENT_NAV_EXTRAS` — four entries,
   each with a reason. `check-page-shape` walks the **pages** and fails on any that
   no entry reaches; before 249.8 it walked the CSS dirs instead, so those two
   page-only entries had never been reachability-checked at all.
4. **New colour pairing?** Add it to `PAIRS` in `packages/core/scripts/check-contrast.mjs` so the gate
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

## Verification discipline (worked examples: `.roundtable/verification-discipline.md`)

The nine rules below were each paid for. The dated incidents, counts and
failed red-proofs behind them are in that file; these are the rules.

**Red-proving a gate.** A gate is only trustworthy once you have watched it
fail — and **a red-proof that comes back green is a defect in the INJECTION
until proven otherwise.** Confirm the injection changed the thing the gate
READS before believing a pass: grep the BUILT output, assert the DOM, assert
the computed style, count the matches before replacing (two copies is common),
and prefer an assertion that fails loudly over a replace that silently matches
nothing. Ten recorded cases; five of them happened after this rule was written
down, to an agent that had read it.

**Measure the box that carries the constraint.** A sidebar label that
shrink-wraps its text has `scrollWidth === clientWidth` always, so its own
overflow can never be non-zero — only its right edge against the RAIL's client
edge showed the 15.7px spill.

**An instrument's first output is not evidence.** Six new measuring instruments
landed in one window and none was correct on its first run, so treat it as a
base rate rather than a discipline problem. The adversarial check goes BEFORE
the number is used: ask what would make this wrong and try that first; **a 0%,
a 100%, or an identical value across many inputs is a defect until proven
otherwise**; reconcile against something independent before quoting; derive
names from the generated source, never from a convention; and **grep with a
plain fixed string first** — a context-window regex is secretly a POSITION
filter and reports a confident ABSENCE. When one claim from a session dies this
way, re-verify its siblings.

**An Accept criterion names the PROPERTY to verify, never the value it will
have.** ✗ "the CHANGELOG carries a Breaking entry" → ✓ "the entry matches the
actual compatibility, with the reasoning". The second is satisfiable by
measuring; the first only by having been right in advance. **When an item's
premise is itself an earlier wake's measurement, re-checking it is part of the
criterion** — write the command next to the claim, and write the criterion so
finding the premise FALSE is a satisfying outcome.

**A number you report is load-bearing — red-prove it like a gate.** A dead gate
wastes a wake; a dead measurement quoted in a summary misinforms the person
deciding what to build. Say what the number does NOT cover. And **the defect
lands in what shipped BESIDE the number**: this treatment is expensive, so it
is spent on the one claim that motivated the work while everything else in the
change goes out on credibility it has not earned. List the other claims a
change carries and name the instrument for each — *"I read it off the code"* is
the answer that predicts the defect.

**A heuristic gate must be able to demonstrate it can fail.** Every gate
declares its signal in its header and `check:selftests` enforces the
declaration: `@heuristic` when the verdict rests on RECOGNISING something (it
ships `--self-test`), `@exact` when it rests on equality, membership, or a
measurement taken in a real browser. The meta-gate itself failed this on its
first run, so assume the failure mode applies to your check too.

**Measure a predicate's base rate before you ship it as a gate.** A property
already true of 100% of the tree cannot fail, however carefully it is written.
And where a property depends on what prose MEANS, a gate can enforce the SHAPE
that carries it but cannot judge the content — choose the shape, or keep the
property in a rubric a human scores, and say which you did.

**A bulk edit is verified against the RENDERED artefact**, not the diff that
made it. A regex over source is a bet that every match means the same thing,
and in these files it repeatedly did not. Before CREATING a file, check
`git ls-files` for a case-insensitive match — a "new" file that shows up as
MODIFIED is not new, it is one you just replaced. When a file mixes live markup
with copyable samples, edit by hand, one block at a time. **And when something
DOWNSTREAM can rewrite the artefact — a registry, CDN, bundler or minifier —
its output is the artefact, not what you handed it.**

**A gate that only runs in CI is not known to work.** CI's full checkout is the
most permissive environment the build sees. Verify a new gate in the NARROWEST
context that must run it. A gate that cannot run must fail loudly, never skip
quietly; a gate that needs a human to start a container or a port is not a gate
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
walkthrough, print behaviour, scaling notes. `/patterns/list-report`
is the exemplar.

**Every name the framework publishes names a SHAPE; the domain appears only
as demo data and as search words** (owner rule 2026-08-22, Slice 109; widened
by the owner on 2026-09-25 from patterns to every published name, milestone
decision O4). `object-page` demoing PO-88213 is the model: generic name,
generic anatomy, realistic PO as the demo so the screen looks credible.
- **What counts as a published name:** classes, parts, modifiers, tokens,
  behaviours, component directories, `@category` values, pattern ids,
  `data-bo-*` values, package and export names, and docs slugs under
  `/patterns/`, `/components/` and `/concepts/`. None of them contains a
  module, department, process-area or industry word (Finance, Sales,
  Distribution, o2c, AP…).
- **The swap test:** a job word is shape vocabulary only if it names one
  distinct interaction AND stays true when the demo data moves to another
  module. `goods-receipt` passes; `invoice-list` failed and was renamed
  `list-report` — and a month later still had 162 references in 94 files,
  which is what a published name costs to take back.
- **Module words live in three places and nowhere else:** demo data in
  `examples/erp-suite/<module>/` (the reference app — free to design, outside
  semver); the generated job index (job → other words people use → module
  facets → pattern id → worked screen); and the consumer's own app names. A
  "module layout" is a generated view of those, never a namespace. Never add
  per-domain demo variants — that is re-photographing, which the coverage
  doctrine refuses.
- **A layout a module needs that no pattern covers is a new SHAPE.** It is
  born with its final shape name and a pre-stable `@status` (the word is owner
  decision O7, pending), and is promoted by deleting that line — no rename, no
  path change — once it survives Objective §3's ≥2 independent compositions,
  counted by code as distinct job-and-pattern pairs, never by module label.

Write for a first-time user: plain verbs, one component / many settings, and note the
two-channel cue wherever colour carries meaning.

## Verifying a removal: assert on structure, never on raw text

The comment written by a removal legitimately names the thing removed, so
`'the-removed-string' not in source` is a detector that cannot pass — it
happened three times in one session. Check the PARSED or structural form: the
attribute on tags, the identifier in comment-stripped code, the computed style,
the built artifact's DOM. Worked examples: `.roundtable/verification-discipline.md`.

## Don't

- Don't hand-edit generated docs (api.json, contrast.json, behaviors.json, class
  index, llms.txt) — change the source and regenerate.
- Don't commit derived mirrors (`loops.db`, `graph.db`) — they're git-ignored.
- npm publishing: `@busy-office/ui` is LIVE (first published 2026-08-15 by the owner; the current version is in
  `packages/core/package.json`). Every release from here is a real version bump with a CHANGELOG entry — contract-shape changes to stable behaviors are Breaking entries per the freeze-audit correction. Publishing remains owner-triggered.
