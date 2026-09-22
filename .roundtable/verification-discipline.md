# Verification discipline — the worked examples

Reference material, not instructions. `CLAUDE.md` carries the **rules**; this
file carries the **evidence** that produced them — the dated incidents, the
counts, the detectors that could not fail and the injections that never landed.

It lives here rather than in `CLAUDE.md` because `CLAUDE.md` is loaded into
every session and this is read when a rule is questioned or a new gate is being
written. Nothing was reworded on the way out: the sections below are verbatim,
so a rule's justification is checkable against what actually happened.

Every rule these examples support is stated in `CLAUDE.md` and several are
enforced in code — `check:selftests` requires the `@heuristic`/`@exact` tag,
`check:wrong-choice` requires the clause shape. If a rule here and a rule in
`CLAUDE.md` ever disagree, `CLAUDE.md` is the instruction and this is history.

## Red-proving a gate: a green red-proof is a defect in the INJECTION until proven otherwise

A gate is only trustworthy if you have watched it fail — and the thing that
actually fails is almost never the detector:

**A red-proof that comes back green is a defect in the injection until proven
otherwise** — the same grammar as *a 0%, a 100%, or an identical value across
many inputs is a defect until proven otherwise*.

That observation grammar is deliberate, and it is the form this file's other
rules take because it is the form that gets acted on. The intention form —
*verify the injection, not just the red result* — was what this section said
first; it was written, worked through the five 2026-08-17/18 examples below, and
then violated **five times in two slices** by an agent that had read it
(Objective grill, 2026-08-28). Every one failed the same way: the detector was
fine, the injection never landed, and the gate correctly reported "nothing is
broken" about a change that had not been made.

Confirm the injection changed the thing the gate reads, before believing a
passing gate: grep the BUILT output, assert the DOM, assert the computed style,
count the matches before replacing (two copies is common), and prefer an
assertion that fails loudly over a replace that silently matches nothing. When
the red-proof is of a self-test, the same applies one level up — the first
attempt at one here removed comment-stripping, which could not possibly affect
the case it targeted.

**Ten worked examples, each of which cost real time before it was caught.** Five
where the injection produced a green "red test" — a detector that can never
fail:

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

And five from the two slices in which this rule was already written down:

- Three in a row on one gate: a directory prefix whose leading `.` is a regex
  wildcard; flattened workspace script maps, so the root's `build` overrode the
  docs one; a bare `npm run X` resolved against the root instead of the
  workspace it sits in (2026-08-28).
- One where **two copies of the rule existed** and the injection hit the demo
  rather than the copyable block (2026-08-28).
- One where the assertion tripped on **its own explanation** — the sample's
  comment named the value the assertion was searching for (2026-08-28).

The same discipline applies to measurement, not just injection: **measure
the box that carries the constraint.** A sidebar label that shrink-wraps
its text has `scrollWidth === clientWidth` always, so its own overflow can
never be non-zero — three consecutive measurements reported "not clipped"
while the label was spilling 15.7px past the rail. Only its right edge
against the RAIL's client edge showed it (2026-08-18).
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

**And the defect lands in what shipped BESIDE the number, not in the number**
(roadmap 192.1). This treatment is expensive, so it gets spent on the one claim
that motivated the work — and every other claim in the same change goes out on
its credibility having earned none. Twice, the second inside the write-up of
the first. 173.2 measured a row height live and red-proved it: correct. The
three defects later filed against it (190.1, 190.2, 190.3) are every one of
them in something it asserted beside that — `18ch` and `3.5rem` fitted to the
single 21-character string the demo carries, which `data-table.css` now says in
its own comment. Then the grill recording *that* re-measured the DOM walk with
a red-proof by injection — correct — and asserted beside it that "no
enumeration of the built site returns its stated 138". The plainest walk there
is — `find apps/docs/dist -name 'index.html' | wc -l` — returns exactly **138**
(`distPages({ skipRedirects: false })` 137 + the excluded `suite/` app, by set
difference). So **list the other claims a change is carrying and name the
instrument for each.** *"None — I read it off the code"* is the answer that
predicts the defect.
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
