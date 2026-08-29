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
  and a second pass moved 44 more (→ 1,094). Splitting a markdown file is not
  what the database rule forbids — the archive is still markdown, still
  reviewed, still diffed. `check:slice-refs` keeps the 148 citations pointing
  into it resolvable.
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
  irreconcilably. **148 slice numbers are cited from shipped CSS comments**, and
  `roadmap 130.3` has to resolve to something a person opens with no tooling.

## Autonomous loops

Work runs as loops (`LOOPS.md`): Continue / Standardize / Optimize / Explore /
Roadmap / Objective, chosen per wake by the router (P0 bug > build > tidy > explore
> grill). **Every iteration, after the commit, record it:**

```
python3 scripts/loops/record_iteration.py --loop <Loop> --mode <mode> \
    --item "<what>" --outcome <outcome>
  # outcome: landed | released | logged | triaged | refused | reverted
  # "shipped" is rejected — it hid that nothing had reached npm (41.2)
  # a refusal decided INSIDE this item, whatever the item's own outcome:
  #   --also-refused "<what was refused, one line>"   (repeatable; 51.1/62.1)
python3 scripts/loops/record_metric.py --name <metric> --value <n> --unit <u>   # when measured
```

This keeps `.roundtable/loop-log.md` (human) and `.roundtable/loops.db` (queryable)
in sync, and regenerates `STATUS.md` and `.roundtable/INDEX.md`. Query the mirror
to steer prioritization.

**Before grilling something, check `.roundtable/INDEX.md`** — 131 findings live
there and browsing them previously required knowing a filename in advance. The
index is generated, lists every finding with its date and whether anything cites
it, and prints the count of **repeated subjects**: the same question grilled
twice is the signature of a directory that has outgrown retrieval, so it is
measured on every run rather than asserted. It read 3 when written, all
deliberate follow-ups.

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

## A green red-proof is a defect in the INJECTION until proven otherwise

The rule above it — *verify the injection, not just the red result* — is
written, worked through five examples, and was violated **five times in two
slices** by an agent that had read it (Objective grill, 2026-08-28). Every one
failed the same way: the detector was fine, the injection never landed, and the
gate correctly reported "nothing is broken" about a change that had not been
made.

- Three in a row on one gate: a directory prefix whose leading `.` is a regex
  wildcard; flattened workspace script maps, so the root's `build` overrode the
  docs one; a bare `npm run X` resolved against the root instead of the
  workspace it sits in.
- One where **two copies of the rule existed** and the injection hit the demo
  rather than the copyable block.
- One where the assertion tripped on **its own explanation** — the sample's
  comment named the value the assertion was searching for.

So state it as an observation rather than an intention, which is the form this
file's other rules take and the form that actually gets acted on:

**A red-proof that comes back green is a defect in the injection until proven
otherwise** — the same grammar as *a 0%, a 100%, or an identical value across
many inputs is a defect until proven otherwise*.

Confirm the injection changed the thing the gate reads: grep the BUILT output,
assert the DOM, count the matches before replacing (two copies is common), and
prefer an assertion that fails loudly over a replace that silently matches
nothing. When the red-proof is of a self-test, the same applies one level up —
the first attempt at one here removed comment-stripping, which could not
possibly affect the case it targeted.

## An instrument's first output is not evidence

Six new or reworked measuring instruments landed in one window and **none was
correct on its first run** (Slices 37/38/44 grill). A seventh went wrong while
writing the grill that counted the six. Two earlier grills recorded this as a
discipline problem and it changed nothing, so treat it as a **base rate**: the
first thing a new detector, script or query tells you is wrong until checked.

That is not pessimism, it is scheduling. The adversarial check goes **before**
the number is used, not after it looks wrong:

- **Ask what would make this wrong, and try that first.** Every dead detector
  died to one question — *is this signal present in things I am not counting?*
  `class="demo"` is on every section; `<main class="bo-app-shell__main">`
  matches `bo-`; the docs shell's own menu button is a real `.bo-btn`.
- **A 0%, a 100%, or an identical value across many inputs is a defect until
  proven otherwise.** All three have occurred here: zero usage for every
  component (a `find` over a path that did not exist), 16-of-16 pages flagged (a
  slug-to-class assumption), and the same byte offset on all 18 pages (the
  shell's markup).
- **Reconcile against something independent before quoting.** `bo-data-table` is
  obviously in every pattern page; that is what exposed the zero. The
  prose-drift sweep was believed only once it reproduced, unprompted, the two
  pages a human had found by hand.
- **Derive names from the generated source, never from a convention.** Page
  slugs are not class names: `alerts` → `bo-alert`, `button` → `bo-btn`,
  `dashboard` → `bo-widget`. `api.json` knows; a guess does not.
- **A context-window regex is secretly a POSITION filter, and it fails
  silently.** `grep -oE ".{50}(saved view).{80}"` reads as "show the match with
  context"; it means *"match only when 50 characters precede it on the same
  line"*. `aria-label="Saved views"` sits near a line start, so it returned
  **zero** while plain `grep -c` found it instantly (2026-08-27). This is worse
  than a dead detector — a dead one looks unremarkable, whereas this reported a
  confident ABSENCE. It put a wrong claim into ROADMAP ("the single biggest
  thing in the screenshot the framework has no answer for") for a mechanism
  `/patterns/list-report` already shipped, and shipped *more completely* than
  the proposal. **Grep with a plain fixed string first; add context only after
  you know the count.** And when one claim from a session dies this way,
  **re-verify its siblings** — they came from the same instrument, on the same
  day, in the same frame of mind.

Applies to ad-hoc measurement, not to a gate that has already been red-proved —
that one has earned its output by construction.

## An Accept criterion names the PROPERTY to verify, never the value it will have

A criterion is the checkable definition of done that a later wake — with less
context than you have now — reads and executes. When it embeds a *forecast*,
satisfying it literally produces a wrong artefact.

Twice in one window (Objective grill, 2026-08-28), a criterion predicted what a
gate would say and was wrong both times:

- 154.1 required "the CHANGELOG carries a **Breaking** entry". It was not
  breaking — `row-edit.ts` guards the badge with `if (badge)`, so consumer
  markup kept working. Following the criterion would have shipped a Breaking
  entry for a compatible change.
- 157.2 required that "DESIGN.md's flip-site **count moves** in the same
  commit". It did not move — six stayed six, because the row stripe is still a
  flip site; only what that site *covers* changed. Following the criterion
  would have edited a correct number into a wrong one.

Both were caught by believing the measurement over the criterion, which is the
right order — but that is a judgement the next wake may not make.

So write the property, not the prediction:

- ✗ "DESIGN.md's flip-site count moves" → ✓ "DESIGN.md's count agrees with
  what `check:rtl` reports"
- ✗ "the CHANGELOG carries a Breaking entry" → ✓ "the CHANGELOG entry matches
  the actual compatibility, with the reasoning"

The second form is satisfiable by measuring. The first is satisfiable only by
having been right in advance, which is not what a criterion is for. This is a
writing rule with nothing mechanical behind it — the same grill refused a gate
for its sibling finding on base rate, and inventing one here would be the same
ceremony.

**And when the item's PREMISE is itself a measurement from an earlier wake,
re-checking it is part of the criterion, not a courtesy** (added by the next
grill, 2026-08-28, rather than given its own section — 158.2 has the loop's
prose growth open, and a second section restating a neighbouring idea is what
that item is about). Two rounds in one window were spent refuting a premise the
plan had asserted as fact: 151.1's *"`grep` finds no saved-view concept on any
of the 39 pattern pages"* (the mechanism ships in full on
`/patterns/list-report`) and 153.2's *"21 of 27 suite screens render a date as a
plain string like `'01 Oct'`"* (they render `<td class="bo-u-tabular">01 Oct</td>`,
the prescribed replacement, and `bo-date` is deprecated). Neither recorded the
command that produced it, so neither could be re-run — only re-derived.

149.1 is the control, same window, same shape of error: its count was right and
its interpretation wrong for three of four screens, and it cost nothing because
its criterion read *"each of the four either uses `bo-progress` **or** records a
one-line reason it should not"*. So:

- **Write the command next to the claim.** A count or an absence about this
  repo is re-runnable in seconds; without the command the next wake re-derives
  it, and re-deriving is where the second, different mistake comes from.
- **Write the criterion so finding the premise FALSE is a satisfying outcome**,
  not an off-plan one. "The screens change, not the component" assumes the
  premise; "each either changes or records why not" does not.

## A number you report is load-bearing — red-prove it like a gate

Thirteen detectors across three slices could not fail (Slices 39/42/43 grill).
Twelve cost time. **One cost accuracy**: "only 1 of 18 learning-path pages shows
anything working" went into a summary to the owner, and the real figure is
**16 of 18** — the detector had counted uses of the `Demo` *component*, not
pages that show anything.

That is a different kind of failure. A dead gate wastes a wake and the next
wake finds it. A dead measurement quoted in a summary **misinforms the person
deciding what to build**, and they cannot check it without redoing the work.

So before a measured claim goes into a summary, it gets the gate treatment:

- **Ask what would make it wrong**, and try that first. The four dead detectors
  in 39.2 all died to the same question: *is this signal present in things I am
  not counting?* (`class="demo"` is on every section; `<main class="bo-app-shell__main">`
  matches `bo-`; the shell's own menu button is a real `.bo-btn`.)
- **Treat a suspiciously tidy number as a defect in the instrument** until shown
  otherwise. A plain zero, a round fraction, or *the identical value across many
  different inputs* — an identical byte offset on all 18 pages is what finally
  exposed one of them.
- **Reconcile against an independent count** before quoting it. `bo-data-table`
  appearing in 16 of 16 pattern pages is what proved a usage script that had
  reported zero for everything.
- **Say what the number does not cover.** "16 of 18 render something" is not
  "16 of 18 are good pages"; the measurement was of one specific property.

None of this applies to a number a gate already asserts — that one has been
red-proved by construction. It applies to the ad-hoc measurement written to
answer a question, which is exactly the kind that ends up in a summary.

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

## Measure a predicate's base rate before you ship it as a gate

A detector whose predicate is already true of everything cannot fail, and it
will look exactly like a passing gate while doing so. Check the base rate
first — if the property holds for 100% of the tree today, the gate is
ceremony no matter how carefully it is written.

Worked example (roadmap 94.11). The proposal was to gate "every intrinsic
dimension literal carries its reason", with a rule allowing ONE comment to
cover a group of sibling rules — `tree-table`'s eleven-level indent ladder
should not need eleven copies of the same explanation. Expressed as *the
nearest preceding comment covers the literal*, it was precise, and it scored
**zero false positives** across all 43 component stylesheets.

It was still worthless, and the red-proof is what showed it: injecting
`letter-spacing: 7px` — a literal nothing in the file explains — into a rule
that merely follows an unrelated comment, the detector still reported **0
unexplained**. Measuring the base rate says why: **155 of 155 literals in the
framework already have some comment somewhere above them.** The predicate is
uniformly true, so it distinguishes nothing.

The gap is not fixable by a better regex. **"A comment precedes this literal"
is checkable; "a comment explains this literal" is semantic.** Where a
property depends on what prose MEANS, a gate can enforce the *shape* that
carries it — `check:wrong-choice` requires a `<strong>Not …</strong>` clause
and says outright that what the clause says is a human call — but it cannot
judge the content. Choose the shape, or keep the property in a rubric a human
scores, and say which you did.

## A bulk edit is verified against the RENDERED artefact

A regex over source is not a refactor. It is a bet that every match means the
same thing, and in these files it repeatedly did not — pattern pages mix live
markup with template literals a reader copies, and prose repeats the identifiers
the code uses.

Three failures in one session (2026-08-18), each caught late or by luck:

- `./serve-dist.mjs` became `./serve-DIST.mjs` in eight import specifiers.
  **Every gate passed locally** because APFS is case-insensitive; Linux CI
  failed with `ERR_MODULE_NOT_FOUND`.
- **CREATING a file is the same trap, and it destroys instead of breaking**
  (2026-08-25). Writing `ROADMAP-ARCHIVE.md` while `ROADMAP-archive.md` was
  already tracked is ONE file on APFS: 7,307 lines of archived history were
  silently overwritten, and nothing errored. `git status` showing it as
  **modified rather than added** was the only tell. So before creating a file,
  check `git ls-files` for a case-insensitive match — a "new" file that shows
  up as modified is not new, it is a file you just replaced. The same write
  also poisoned a measurement taken minutes later: a base-rate count read 58
  where the truth was 2, because it was counting against content that no
  longer existed.
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

**And when something DOWNSTREAM can rewrite the artefact, its output is the
artefact — not what you handed it.** Everything above assumes we do the
rendering, so our built output is the last word. A registry, CDN, bundler or
minifier breaks that assumption, and the tell is that you are inspecting an
*input* to the thing that decides. Verify at the last point the artefact passes
through before a user sees it; asking that system is usually one command.
Worked example (2026-08-29, roadmap 185): `npm publish` warned
*"`bin[create-ui]` script name index.mjs was invalid and removed"*, so the
scaffolder was reported as shipping with no executable. The tarball was
unpacked **twice** to confirm it — but `npm pack` and `npm publish` normalise
differently, and the published manifest read `{"create-ui":"index.mjs"}`: npm
had *normalised* the `./`, not dropped the key. `npm view <pkg> bin` was the
whole check. The same slice read the registry's **read** path twice and called
a 404 an unpublish, while its **write** path had already answered
`E403 cannot publish over the previously published versions` — a new scoped
package is knowable before it is servable.

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
walkthrough, print behaviour, scaling notes. `/patterns/list-report`
is the exemplar.

**A pattern is NAMED and FRAMED for its SHAPE; the domain appears only as
demo data** (owner rule, 2026-08-22, Slice 109). `object-page` demoing
PO-88213 is the model: generic name, generic anatomy, realistic PO as the
demo so the screen looks credible. Never name a pattern for its sample
domain (`invoice-list` was the one violation — renamed `list-report`), and
never add per-domain demo variants ("the same pattern as an invoice") —
that is re-photographing, which the coverage doctrine refuses.

Write for a first-time user: plain verbs, one component / many settings, and note the
two-channel cue wherever colour carries meaning.

## Verifying a removal: assert on structure, never on raw text

Three edits in one session (Slices 49, 50, 53.1) asserted
`'the-removed-string' not in source` — and each failed, because **the comment
written by that same edit legitimately names the thing removed**. One of the
three silently skipped its import insertion and another landed an import inside
a template literal that ships to users.

When verifying that something is gone, check the **parsed or structural form**:
the attribute (`data-foo(?=[\s>=])` on tags), the identifier in
comment-stripped code, the computed style, the built artifact's DOM — never a
substring of the raw file. The prose explaining a removal is supposed to
mention it; an assertion that can be tripped by its own explanation is a
detector that cannot pass.

## Don't

- Don't hand-edit generated docs (api.json, contrast.json, behaviors.json, class
  index, llms.txt) — change the source and regenerate.
- Don't commit derived mirrors (`loops.db`, `graph.db`) — they're git-ignored.
- npm publishing: `@busy-office/ui` is LIVE (0.1.0, published 2026-08-15 by the owner). Every release from here is a real version bump with a CHANGELOG entry — contract-shape changes to stable behaviors are Breaking entries per the freeze-audit correction. Publishing remains owner-triggered.
