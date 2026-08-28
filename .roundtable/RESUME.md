# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and `check:resume-charter` REPORTS — on stderr, from
> `record_iteration.py`, advisory by design since 169.4 — if this pointer goes
> missing or if the durable sections grow back here. It does not fail a build;
> it left `check:repo` because `.roundtable/**` is CI-ignored (roadmap 175.3).

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

Ordinary state — what is queued, what is done — lives in `ROADMAP.md` and
`.roundtable/loop-log.md`. Environment knowledge lives in `ENVIRONMENT.md`. Only
put things here that none of those can say: **uncommitted work, and a decision
made but not yet written down.**

---

## In flight: nothing

Last updated 2026-08-28 (cloud wake, scheduled routine — **rule 1 → Continue,
bug mode, Slice 180**). Working tree clean at hand-off; the wake's commits went
out as one push.

No collision. `git branch --show-current` answered EMPTY at Step 0 (detached
container, ENVIRONMENT.md trap 1), fixed with `git checkout -B main origin/main`
before the first commit; `origin/main` arrived as a forced update
(`17b3ba6...f7c2070`). The mandated pre-commit `git fetch origin main` found it
unmoved at `f7c20708`, confirmed against `git ls-remote --heads origin`, which is
the authority.

**Reconcile this file against `ROADMAP.md` before trusting its open set** — it
goes stale between wakes. Trust the `N. [ ]` checkboxes, not this section.

## ⚠ THE BRANCH WAS RED WHEN THIS WAKE STARTED, AND NOTHING HAD NOTICED

**Rule 1 fired on a P0 the wake found itself.** There was no report and no open
issue; `npm run docs:build` — run as ordinary Step 0 environment setup on a
clean checkout of `origin/main` at `f7c2070` — exited 1. Then the API, not an
assumption: CI run `33213989733` and Deploy-docs-to-Pages run `33213989703` were
both `failure` on that same sha, created `21:46:17Z`, all **5** CI jobs dying in
`docs build` → `check:repo`. **The docs site had not deployed for 47 minutes.**

`check:slice-refs` had read the loop-name tally `Meta 12 · Continue 4 ·
Roadmap 2 · Polish 2 · Standardize 1` in Slice 179's own grill report as a
citation to a `## Slice 2` that has never existed. Fixed in Slice 180, green,
pushed.

**The lesson for the NEXT wake is procedural, and it is the one thing worth
carrying forward from this:** the previous wake pushed prose it never built.
Nothing in `.roundtable/` renders, so it *felt* unnecessary — and CI's
`paths-ignore` excludes `.roundtable/**` from *triggering* a run, which reads
like permission. It is not: the directory is still **scanned** by a gate that
runs first in `check:repo`. **Run `npm run check:repo -w docs` before pushing a
commit that touches `.roundtable/` at all.** It takes seconds and it is the
whole failure mode.

## What landed this wake (2026-08-28, cloud, rule 1 → Slice 180)

- **180.1 — the extractor no longer reads a loop-name tally as a citation**,
  and the gate is retagged `@heuristic`, which the extraction arm always was;
  only the `^## Slice N` resolution arm is exact. Skip predicate: a match with a
  ` · `-joined `Word Number` neighbour on either side. **Base rate measured on
  the unedited tree before shipping: 1 of 461 matches** — the one false
  positive.
- **Case was tried first and refused, measured**: of 461 matches, `roadmap` 434
  · `ROADMAP` 15 · `Roadmap` 12, and **11 of those 12 Title-case matches are
  genuine sentence-initial citations**. A case rule would have broken eleven
  real citations to fix one tally.
- **Red-proved in both directions**, injections confirmed to have landed first:
  `roadmap 999.9` → new gate RED naming it; a differently-worded tally
  (`Objective 3 · Roadmap 7 · Explore 1`) → new gate GREEN (exit 0) while the
  **old** extractor, run from a probe copy in the same directory, goes RED
  naming that tally's own number, exit 1. That second row is the discriminating
  one. *(Written that way on purpose: spelling the failure line verbatim puts a
  citation-shaped string pointing nowhere into a scanned file, and this gate
  correctly fails on it — which is how this paragraph was caught. Describe the
  number; do not spell it.)* The
  10-case `--self-test` was itself red-proved by stubbing the classifier: 4 of
  10 WRONG, exit 1.
- **Three stale snapshots removed** from that gate: "148 slice numbers are
  cited", twice, plus the reduced-build-context message that told a reader "the
  148 slice citations were NOT verified here" — while the run line read 362. The
  gate prints its own count; the header now names the property (177's rule).
- **Two deliberate non-changes, both with the measurement behind them.** The
  grill report's tally line is left exactly as written — rewording it restores
  green and fixes nothing, and left in the tree it is a live fixture. And the
  gate still scans `.roundtable/`, because **42** distinct refs are cited from
  there and **16 from nowhere else**.

## ⚠ THIS WAS A CLOUD WAKE — WHAT WAS NOT LOOKED AT

No Podman, no `localhost:8081`, no screenshots at 1440px/390px in light and dark.

**Nothing in this wake renders, so nothing visual went unverified.**
`git diff --stat` names `ROADMAP.md`, `.roundtable/`, and one docs *script*
(`apps/docs/scripts/check-slice-refs.mjs`) — no `.css`, no `.astro`, nothing
under `packages/core/src`. That is checkable from the diff rather than asserted.

Gates run, all green: core `build` + `test` (146), `docs:build`, `check:repo`
(re-run after the last prose edit), `check:claims` (141 behaviours),
`check:layout` (127 pages), `test:axe`.

**The carried-forward visual items have now waited SEVEN wakes.** None is
dispatchable here; all need a local wake with a browser:

- `DsaScore.astro` and `concepts/which-pattern.astro` each gained
  `<span class="bo-badge">generated</span>` inside an existing `<h2>`.
  `DsaScore` renders on **39** pages, so if the badge wraps badly it wraps in 39
  places. First local wake: glance at one component page's "Design-system
  alignment" heading at 390px — make it `/components/scan`, which also settles
  the next item.

  **⚠ Do NOT "correct" that 39 to 40 from `check:dsa-scores`.** The gate reports
  *"40 requested by a page"*, which counts component ENTRIES, not pages:
  `state-patterns.astro` renders `<DsaScore` twice. 39 pages request 40 entries.
  A `grep -rlE "<DsaScore|DsaScore "` also reads 40, and that second alternative
  matches a *comment* in `concepts/which-pattern.astro:16` — an assertion
  tripping on prose about itself. Count `<DsaScore` files, or count built pages
  carrying "Design-system alignment": both read **39**.
- `/components/scan`'s DSA table at 390px — new in 176.1, never seen.
- The `#markers` table on `/components/data-table` at 390px, both themes.
- `/concepts/scale`'s first decision table — 178.3 changed one `<td>`'s text and
  could not look at it.

**Traps exercised for real this wake:** 1 (detached HEAD — `git branch
--show-current` EMPTY, caught before the first commit), 1b, 1c, 2 (unshallowed:
`--is-shallow-repository` read `true`, now 1,558 commits — load-bearing for the
Direction derivation below), 3, 6 (a background build's empty output file read
as "still running", not as done). Not exercised: 4, 5, 7.

## Rule 1 fired this wake — what rules 2-8 read on the way past

Dispatcher, in the order `LOOPS.md` states them. Rule 1 was reached *twice*: it
was clear at Step 1 (no open P0 in `ROADMAP.md`; GitHub intake **0 open
issues**, asked via the API, not assumed), and then the wake's own build
produced one, which is what it was triaged and dispatched as.

The counters were read before the P0 surfaced and are recorded because they cost
nothing: rule 2 `Standardize 0 / 4 ok`, rule 3 `Objective 0 / 3 ok`. Rules 4-8
were not reached. Had the P0 not existed, rule 4 would have found nothing (all
six open items owner-blocked: `112.3`, `112.4`, `173.2`, `175.4`, `176.3`,
`15.12`), rule 5 nothing (no metric with two consecutive readings; `rf-essentials`
measured **36.4 kB against a 40 kB** budget this wake), and **rule 6 → Polish**
would have taken the wake, with `polish_requeue.py --check` re-queueing the same
ten `content: 3` surfaces at `1/3`.

**`polish_requeue.py` needs `packages/core/dist/api.json`** and dies with a
traceback on a fresh container before `npm run build -w @busy-office/ui`. Build
core first; this is ordering, not a defect.

## Direction — the owner's pick, and whether THIS wake advanced it

**Standing section, added by 168.1 (2026-08-28). Answer all four every wake,
from the sources named — never by copying the answers above you.**

- **Direction:** (a) adoption/DX — finish it by publishing
  `@busy-office/create-ui`. Source: the `DECISION (owner, 2026-08-28)` block in
  Slice 164.3, which lives in **`ROADMAP-archive.md`**, not `ROADMAP.md` — 164
  was swept by 177.1. Read it there; this line is a pointer, and a pointer that
  disagrees with its source loses to the source.
- **Remaining step, and who it waits on:** `npm publish -w
  @busy-office/create-ui` — **owner-only**, by CLAUDE.md's standing policy
  ("Publishing remains owner-triggered"). Asked the registry this wake, which is
  the authority: **still E404**.
- **Did this wake advance it?** **No.** The remaining step is owner-only, and no
  cloud wake can run it. This wake ran rule 1 → Continue, bug mode, on Slice 180.
- **Work rows since the direction was decided that did not advance it:** derive
  it, do not increment — a copied number is 169.1's exact failure mode. This
  wake: **39** non-Meta work rows since `fb15cdc`, of which the needle matches
  **2**; reading them, only **164.3** advances the direction and **168.1** merely
  narrates it. So **38 of 39** did not. *(Measured at `615eeb31`, before this
  wake's own log rows were committed — re-running it after this commit reads
  higher. The point is that it is re-run: last wake's honest read was 37 of 38.)*

  **⚠ The `grep create-ui` needle over-counts.** Read the matched rows; do not
  `-c` them:

  ```
  git diff fb15cdc..HEAD -- .roundtable/loop-log.md | grep '^+- ' \
    | grep -v ' · Meta · ' | grep create-ui        # print them, don't -c them
  ```

  Left as a two-line read rather than a smarter regex on purpose: any needle
  that tries to separate "advanced" from "mentioned" is guessing at intent from
  prose, which is the semantic-vs-shape line CLAUDE.md draws (94.11).
- **Is that ratio a PROBLEM? No — the owner was shown it and decided otherwise
  (2026-08-28).** Asked directly whether to pause the hourly routine until the
  publish, the owner chose **keep it running hourly**. So a wake finding this
  block's answers unchanged is looking at an **accepted state, not a fault**: do
  not re-triage it, do not raise it as a new finding, and do not slow or pause
  the routine on your own judgement. What WOULD be new information: the registry
  answering something other than E404, or the owner picking a different
  direction.

```
npm view @busy-office/create-ui version     # E404 → unpublished → still blocked
npm view @busy-office/ui version            # 0.5.0 on 2026-08-28

# fb15cdc is the commit carrying the owner's decision. UNSHALLOW FIRST
# (ENVIRONMENT.md trap 2) or these resolve nothing and the rate is silently
# missing, not wrong.
git diff fb15cdc..HEAD -- .roundtable/loop-log.md | grep '^+- ' | grep -vc ' · Meta · '
```

**`create-ui` is the only name in these commands that will age.** When the owner
picks a direction that is not "publish the front door", the two `npm view` lines
and the needle change with it — and `fb15cdc` becomes whichever commit carries
the new decision. Rewrite them; do not reinterpret them.

## Counters after this wake

Run `python3 scripts/loops/dispatch_status.py` and read it **immediately after
`record_iteration.py`**, per 166.5's lesson — that comparison has found two of
the parser's five blindings and nothing else ever has.

**Prediction written down first, then checked, which is the point of the
exercise.** Before recording: `Standardize 0/4 ok`, `Objective 0/3 ok`, parser
1,078 against a raw `grep -c "^- "` of 1,078. One Roadmap triage row plus one
Continue row should read **1,080**; rule 2 should move to **1/4**, because a
Continue row IS a Continue round; and rule 3 should move to **1/3**, because
Continue closes a slice and Slice 180 is one.

After recording: **`Standardize 1/4 ok`, `Objective 1/3 ok`**, parser **1,080**
against a raw `grep -c "^- "` of **1,080**. **Prediction confirmed on all four
numbers.**

## What the next wake should expect

Rule 2 at 1/4 and rule 3 at 1/3 — neither armed. So the next wake falls to
**rule 4**, which still has nothing to give: all six open items are the
owner-blocked set above, and Slice 180 opened no new one. That routes it to
**rule 5** (nothing — see above) and then **rule 6 → Polish**, which is where
the last clear-backlog wake landed (176.1).

Run `python3 scripts/loops/polish_requeue.py --apply` first, per rule 6's own
text, and build core before that or it dies on a missing `api.json`. Read §3b's
guidance on what a round on a `content: 3` surface is for — it reconciles the
published artefact against the ledger, and **a round that finds nothing is a
no-op recorded in one line, not a manufactured fix**.

**Do not re-raise Slice 179's refusal as a new finding.** A gate for
`check:selftests`' blind spot over `scripts/loops/*.py` was refused, measured:
2 of 9 scripts carry a tag, both are honest, and zero defects sit behind the gap,
so a gate would be ceremony on a predicate nothing has broken.
