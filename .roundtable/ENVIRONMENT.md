# Environment — the traps, and the toolchain that works

**Read this at Step 0 alongside `.roundtable/RESUME.md`.** `LOOPS.md`'s Step 0
names both files, so this is a step the dispatcher executes, not a cross
reference it may skip.

This file exists because of **roadmap 169.3, decided 2026-08-28**. Everything
below lived in `RESUME.md` — the handover that is rewritten wholesale every wake
— against that file's own charter, which admits only *uncommitted work* and *a
decision not yet written down*. The measurements that decided it, and the
argument for refusing that was weighed and lost, are in ROADMAP 169.3.

**This file is durable. Edit it when a trap changes; do not re-copy it.** A
correction here shows up as a small `git diff` on a stable file, which is the
whole point: the same correction inside `RESUME.md` was invisible in a 111-line
rewrite, and that is exactly how 169.1's wrong sentence survived 166.1 fixing it.

---

## 1. `git checkout main` — the container starts DETACHED

```
git fetch origin main && git checkout -B main origin/main
```

`git ls-remote --heads origin` is the authority on what is pushed; the local
`origin/main` ref is not, until a fetch. `origin/main` frequently arrives as a
**forced update** (a rebase — Step 0c's collision mechanic, visible), so the
local ref is not merely behind: 2026-08-28 saw `17b3ba6...12e97c6`, and the tip
the previous handover named no longer existed at all.

A container may have **no local `main` whatsoever**, which is harder than the
stale-ref case. `git rev-parse main HEAD` is what answers it: a missing branch
gives `fatal: ambiguous argument 'main'` / `unknown revision`.

**Do NOT use `git rev-parse --short main HEAD` as that test — it exits 128 on
every container, `main` present or not** (measured 2026-08-29, git 2.43.0;
roadmap 189 §D1). `--short` takes a single revision, so two arguments always
produce `fatal: Needed a single revision`, and this file used to attribute that
message to the missing branch. A wake following it would "fix" a `main` that was
never broken — the previous hand-off recorded exactly that as trap 1 "exercised
for real".

```
git rev-parse --verify main       # main exists
git rev-parse --short main HEAD   # fatal: Needed a single revision   rc=128
git rev-parse --short=8 main HEAD # fatal: Needed a single revision   rc=128
git rev-parse main HEAD           # both shas                         rc=0
```

**THE TRAP DOES NOT BITE AT STEP 0. IT BITES AT `git push`, and the usual Step 0
check gives false comfort** (2026-08-28, Slice 170 — that wake's first push was
rejected after three commits were already made).

On a detached HEAD the local `main` ref still exists and is **stale** — it sat
at the pre-rebase `17b3ba67` while work was committed onto a detached
`6dfb8709`. `git push -u origin main` pushes *that ref*, not `HEAD`, so it
reports the confusing `a pushed branch tip is behind its remote counterpart`
even though the work is strictly ahead.

The check that missed it is the one that looks most reassuring:

```
git rev-list --left-right --count origin/main...HEAD    # 0  3   ← compares HEAD
git branch --show-current                               # EMPTY ← the actual answer
git rev-parse --short main HEAD                         # 17b3ba67 vs 6dfb8709
```

`--left-right ... HEAD` compares the wrong ref. **Run `git branch
--show-current` before the first commit; an empty answer means fix it now.**
The recovery once commits already exist is safe and is a fast-forward — verify
first, never force:

```
git merge-base --is-ancestor origin/main HEAD && git checkout -B main HEAD
git push -u origin main
```

## 1b. THE BASH WORKING DIRECTORY PERSISTS BETWEEN TOOL CALLS

**Anchor every command with an absolute `cd`, or none at all.** A `cd apps/docs`
to run one gate leaves the NEXT command there.

## 1c. `CHROME_PATH` DOES NOT PERSIST EITHER

```
export CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome && npm run docs:build
```

Export it in the SAME command as the build, every time. It is needed by
`docs:build` (`check-boost.mjs`), `check:layout` and `test:axe`.

## 2. THE CLONE IS SHALLOW — any history measurement is silently 50x wrong

```
git rev-parse --is-shallow-repository     # -> true, on a fresh container
git fetch --unshallow origin              # usually ~25s — but see 2b
git rev-parse --is-shallow-repository     # -> the ONLY check that it worked
```

`report_loop_prose.py` **refuses to report** on a shallow clone rather than
printing wrong figures; that guard was red-proved against a real
`git clone --depth 1`. Nothing else refuses, so any wake whose finding is a
history measurement must unshallow first.

**`--unshallow` does NOT bring the tags, and `git tag` then answers EMPTY rather
than erroring** (measured 2026-09-03, Slice 256). A fresh container returns
nothing at all for `git tag --sort=v:refname`, so a claim of the form "the tag
list starts at vX" reads as an absence instead of a disagreement — the silent
kind of wrong this file exists for. `git fetch --tags origin` first; it took
under a second here and returned all seven.

## 2b. A TIMED-OUT UNSHALLOW LEAVES `.git/shallow.lock`, AND EVERY LATER FETCH THEN FAILS QUIETLY

Bit for real on 2026-08-30 (Slice 216, cloud wake) and cost three attempts. The
"~25s" above is not a floor: that wake's first `git fetch --unshallow origin`
was **killed by a 300s tool timeout** — long enough to have created the lock,
not long enough to finish.

```
ls -la .git/shallow.lock       # 0 bytes, timestamped at the moment of the timeout
```

From then on **every** deepening fetch — `--unshallow` and `--deepen=1500`
alike — refused, and `git rev-parse --is-shallow-repository` kept reading
`true` at **50 commits**. The recovery is one line:

```
rm -f .git/shallow.lock && git fetch --unshallow origin    # -> 1,554 commits
```

**What made it take three attempts is this file's own recipe.** Git's refusal
names the lock file in its FIRST line; the tail of the message is only
*"…may have crashed in this repository earlier: / remove the file manually to
continue."*, which names nothing. Running the fetch through `| tail -2` — the
obvious way to keep its output short — cuts off exactly the line that says what
to delete, and what survives reads like an unrelated warning scrolling past a
command that appeared to succeed.

So: **the fetch's own output is not the check.** Run `git rev-parse
--is-shallow-repository` after it every time, and if it still reads `true`,
re-run the fetch with no `tail` and read the FIRST line.

## 3. `astro build` does not clear `dist`

`rm -rf apps/docs/dist` first. Skipping it has produced a real failure rather
than a stale number once — `report:prose` died with `ENOENT … apps/docs/dist`
before the build — but that is luck, not a guard.

## 4. `npx prettier` IS NOT THIS REPO'S FORMATTER

No prettier config and no prettier dependency exists here. The style enforcers
are `stylelint` and the gates in `check:repo`.

## 5. `loops.db` IS GIT-IGNORED, SO A FRESH CONTAINER HAS NO MIRROR

**Guarded since 167.3, so this is a shape to know rather than a live trap** —
but other derived mirrors have it too. `record_iteration.py` regenerates the
tracked `STATUS.md` from `loops.db`, and on a fresh clone that db holds only the
row the current wake just inserted. `STATUS.md`'s "Last 10 iterations" was once
rendered from **2 rows against the log's 1,020**, which would have committed
nine rows of history away, silently. `generate_status.py` now counts the raw
rows in `loop-log.md`, announces the disagreement and rebuilds. **If you touch
another mirror here, assert its count against the file first.**

## 6. A BACKGROUND TASK'S OUTPUT FILE IS NOT A COMPLETION SIGNAL

A worked example of "an instrument's first output is not evidence", and the
wrong diagnosis got committed before the right one. The first version of this
trap accused the GitHub run-level endpoints of serving a stale snapshot. **That
accusation is withdrawn — it was wrong**, and the real cause was the wake's own
waiting.

To wait for CI, four `sleep 150`–`sleep 240` commands were launched with
`run_in_background`, and after each the output file was read. It came back
empty, the harness rendered that as *"(Bash completed with no output)"*, and
that was read as **the task finished**. It means the opposite: the file is empty
because the task is **still running**. So every "wait" was about three seconds.

Measured, not reasoned — `date; sleep 20; date` launched at **06:56:55**:

```
06:56:58  file holds "start 06:56:55"          ← 3s in, reads as "no output"
06:57:11  file holds "start 06:56:55"          ← 16s in, still nothing new
06:57:29  file holds "start … / end 06:57:15 / [exited with code 0]"
```

The sleep itself is fine and elapses correctly. **The completion marker is the
literal `[exited with code 0]` line**, and it was absent from every mid-flight
read. Wait for the task-completion notification, or use `Monitor` with an
until-loop; foreground `sleep` is blocked in this environment. Never infer
completion from an empty file.

**What it cost.** Five CI polls fired inside ~4 minutes of wall clock while the
wake believed ~20 minutes had passed, so a **normal three-minute run** (565:
started 06:50:44, last job done 06:53:48, all six `success`) looked hung at 7x
its norm. That false alarm was sent to the owner, then a second notification
"corrected" it with a diagnosis that was also wrong. Two reported numbers, both
the instrument's fault. Container wall clock is the check that settles it —
`date -u` against `git log --format=%cd`.

`get_workflow_job` on a specific job id **is** still the most direct route to a
definite per-job answer, and job ids come from `list_workflow_jobs`. But the
run-level readings were most likely correct when taken: `updated_at` on a run
does not tick per step, so a frozen value there is normal and is not evidence
of staleness.

## 6b. `check:claims`'s "3 NOT VERIFIED" IS NOT A REGRESSION — IT IS THE CONTAINER

The three `.bo-btn` press claims (mouse press, keyboard Space, reduced motion)
run live only where the browser reports `(hover: hover) and (pointer: fine)`.
That has now been measured **both ways within two days**, on the same repo:

```
2026-08-29, Chrome 151  ->  pointerIsFine true   -> 154 live, 0 NOT VERIFIED
2026-08-29, this cont.  ->  pointerIsFine false  -> 158 live, 3 NOT VERIFIED
```

204.1's gate branches on the live read, so both are correct output and neither
needs a fix. **Do not "restore" the zero** — an environment fact here is a
property of the container, not of the date. Read the count beside it: the
corpus grows, so 154 → 158 is prose landing, not claims being skipped.

## 6c. EVERY DOCS CONTENT-COLUMN WIDTH MEASURED HERE IS 15px NARROWER THAN ON THE OWNER'S MACHINE

Measured 2026-09-03 (Objective grill of 254, Slice 256 finding C) while
re-deriving a local session's live reading. The local wake measured
`.bo-data-table-container` on `/patterns/list-report/` at **928** × 384; the same
built page in this container reads **913** × 384. Nothing changed — the 15px is a
scrollbar, and it is deterministic:

```
main.bo-app-shell__main  overflow-y: auto
  offsetWidth 1216 − clientWidth 1201 = 15    ← reserved classic scrollbar
docs-main    = 1201 − 48 padding             = 1153
docs-content = 1153 − 208 (13rem rail) − 32 (gap) = 913     (928 with a 0px scrollbar)
```

**The usual check finds nothing, which is what makes this a trap.** The docs
shell scrolls `main`, not the document, so
`window.innerWidth - document.documentElement.clientWidth` reads **0** on every
docs page. Linux headless Chrome reserves a 15px classic scrollbar inside that
scroller; macOS overlay scrollbars reserve 0. Two hypotheses were tried and
refuted before this one — a page scrollbar (0, above) and font-metric-driven rail
sizing (dead: `.docs-main` is `grid-template-columns: minmax(0, 1fr) 13rem`, a
FIXED rail, `Gallery.astro:801`).

So: a width you measure here will not match a width the owner measured, by
exactly 15px, and the difference looks like a layout regression. Measure the box
that carries the constraint — `main`'s own `offsetWidth − clientWidth` — before
filing one. Heights, row counts and overflow booleans are unaffected: the same
probe reproduced 14 rows, 384px and 9 rows fully inside exactly.

## 7. A BARE `wc -w` UNDERCOUNTS THIS REPO BY 2.4-4.5%

No locale is set in this container, and GNU `wc` in the C locale swallows an em
dash, which this repo's prose is full of:

```
printf 'alpha — beta\n' | wc -w                 # 2   ← wrong
printf 'alpha — beta\n' | LC_ALL=C.UTF-8 wc -w  # 3
```

`LC_ALL=C.UTF-8 wc -w` and Python's `str.split()` agree exactly on all five
loop-machinery files. Any ad-hoc word count taken here is low unless the locale
is pinned. Full figures in ROADMAP 167.1.

---

## Cloud-wake toolchain — what works, in order

```
npm ci                                                    # no node_modules at start
export CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
rm -rf apps/docs/dist
```

Then, all runnable in a cloud wake without anything hand-started — they bring
up their own server via `serve-dist.mjs` (or, for `check:po-app`, boot the app
as a child process on a free port), which is why those exist.

**This list is derived from `ci.yml`, not curated.** It used to name seven
commands while CI ran nineteen, and the gap is not academic: `check:formatting`
reached CI unrun on 2026-08-29 and turned `main` red, and the wake that did it
recorded *"`ENVIRONMENT.md`'s cloud-toolchain list does not name it and that
list is what the wake used"*. Re-derive rather than trust this snapshot —
`grep -oE 'npm run [A-Za-z0-9:@/._-]+( -w [A-Za-z0-9@/._-]+)?' .github/workflows/ci.yml | sort -u`
— and if a command appears there that is missing here, run it and add it.

**But this list holds ENTRY POINTS and `ci.yml` holds STEPS, so the two do not
match one-for-one** (roadmap 209, which cost a round finding this out). Since
226.1 moved `check:po-app` into the list below, the re-derivation and this list
both read **17** — and that agreement is a coincidence, not a correspondence.
Two entries differ in opposite directions and happen to cancel:
`check:ci-ignores` is in `ci.yml` and not here, because it is a sub-check of
**`check:repo`** — run here by `docs:build` — so it is covered rather than
missing; and `npm run test -w @busy-office/ui` is here and not in the grep,
because `ci.yml` spells that step `npx vitest run --root packages/core`.
**Do not read the two 17s as a match** — compare the sets, not the counts.
Before adding a command the grep turns up, check
`node -e "console.log(require('./apps/docs/package.json').scripts['check:repo'])"`
for it. `check:formatting`, the command that reached CI unrun on 2026-08-29, is
NOT in `check:repo`, which is exactly why nothing caught it and why it is listed
below in its own right.

```
npm run build -w @busy-office/ui
npm run test -w @busy-office/ui          # == CI's `npx vitest run --root packages/core`
npm run lint:css -w @busy-office/ui
npm run docs:build                       # == CI's `npm run build -w docs`; runs check:repo itself
npm run check:claims -w docs
npm run check:formatting -w docs
npm run check:scroll -w docs
npm run check:layout -w docs
npm run check:forced-colors -w docs
npm run test:axe -w docs
npm run check:target-size -w docs
npm run check:search -w docs
npm run check:pseudo -w docs
npm run check:quickstart -w docs
npm run check:po-app -w docs             # does its OWN tarball-consumer install; needs the registry at gate-run time
npm run check -w @busy-office/create-ui
npm run suite                            # needs CHROME_PATH — suite:audit drives a browser
```

Sixteen of the seventeen were run green in this container on 2026-08-29
(`eceffbc` + a markdown-only diff); `check:po-app` — the seventeenth, and until
2026-08-30 the second entry in the exceptions block below — was run green here
on 2026-08-30, which is why it now sits in the list above. **One CI command is
NOT in that list:**

- **`docker build -f apps/docs/Containerfile`** — the `docker` *binary* exists
  at `/usr/bin/docker`, which is a trap worth naming, but there is no daemon:
  `docker info` returns *"dial unix /var/run/docker.sock: no such file or
  directory"*. Finding the binary is not evidence the daemon runs.

**`check:po-app` cleared this block on 2026-08-30 (roadmap 226.1), by
measurement rather than by the inference that had stood in for one.** Two
consecutive runs in a cloud container, both `po-app smoke check passed — 19
behaviours verified end to end`, exit 0. What makes that more than a green tick:
**the precondition that broke it still reproduces here.**

```
ls -d node_modules/htmx.org            # No such file or directory
ls -d apps/docs/node_modules/htmx.org  # exists — still nested, never hoisted
ls examples/po-app/node_modules        # @busy-office  htmx.org   ← the gate's own install
node -e "console.log(require('./examples/po-app/node_modules/htmx.org/package.json').version)"  # 4.0.0
```

So the hoisting the old gate relied on is as absent in a cloud container as it
was on CI, and the gate passes anyway because 222.1's `npm pack -w
@busy-office/ui` + `npm install --omit=dev` fetched both dependencies from the
registry **at gate-run time** — the exact network path that was inferred to work
and had never been measured. Three stacked histories preceded this (unpkg CDN
block, 208.3 → 211.1's local vendoring introducing an eager
`require.resolve` → 223's htmx-4 migration making it load-bearing and turning
`main` red for several commits); ROADMAP 222.1 and 226.1 carry them, and this
entry no longer needs to.

`sqlite3` is NOT installed in this container. Query the `loops.db` mirror with
Python's `sqlite3` module — `python3 -c "import sqlite3; ..."`.

**What a cloud wake CANNOT do:** there is no Podman and no `localhost:8081`, so
the live-verify step every other rule assumes — screenshots at 1440px and 390px
in both themes — cannot run. An item that genuinely needs one is left OPEN with
the reason recorded, per the standing instruction; it is never described as
verified.

**"No screenshots" is not "no browser", and reading it as one cost a dispatch**
(roadmap 189 §D2, 2026-08-29). A cloud wake has a real headless Chrome —
`browser-harness.mjs` + `serve-dist.mjs`, the same pair `check:claims`,
`check:layout` and `test:axe` drive here every wake — and a throwaway probe can
import both by absolute path from the scratchpad and drive the built site
directly. So:

- **Cannot run:** anything whose evidence is a *rendered image* a human
  compares — theme and viewport screenshots, "does this look right".
- **Can run:** any measurement expressible as a DOM, computed-style,
  layout-geometry or accessibility-tree assertion — element heights, whether a
  box overflows its container, whether the container can scroll to it, what
  `page.accessibility.snapshot()` computes as an accessible description, and a
  red-proof by injecting a rule and re-measuring.

`173.2` was classified **browser-blocked, "no cloud wake can take it"**, on an
Accept that asked for a row-height measurement red-proved by reverting the flow
message. That is entirely the second list, and a cloud wake performed exactly it
while grilling the slice afterwards. n = 1 dispatch declined on this reading —
a wording correction with a small measured cost, not a claim the loop has been
broadly wrong. When declining an item, say which of the two lists it needs.

---

## Traps worth carrying forward (measurement discipline, not slice history)

- **A browser-driven gate whose subject loads anything from the public internet
  reports a DOWNSTREAM symptom in an egress-restricted container, and that
  symptom looks identical to an app defect.** Read the page console before
  believing the assertion's own diagnosis — `page.on('console')` and
  `page.on('pageerror')` cost one line each, and were what four runs (208.3)
  were missing before this was understood the first time. Carried up here when
  226.1 cleared `check:po-app` out of the exceptions block: the shape outlives
  the specific trap that taught it.
- **An `import` added AFTER a non-import statement in Astro frontmatter
  silently corrupts the file.** `@astrojs/compiler` hoists imports by rewriting
  text, and on 8 of 11 pages wired in Slice 260 it turned
  `const cssHref = base + '/assets/rf-essentials.min.css';` into
  `…'/assets/rf-essentials.min` + newline + `astro';`. esbuild then reports
  *"Unterminated string literal"* at a line and column **inside an unrelated CSS
  comment**, because the location is in the COMPILED output. The source reads
  fine; `c.transform(src, {filename})` from `@astrojs/compiler` and printing the
  generated code is what shows it. Put a new import with the other imports —
  and note the sibling trap: "the last line starting with `import`" may be
  inside a template literal that ships to users (`index.astro`'s
  `pilotSnippet`), which is the third time an import has landed in one here.
- **`git stash` is not a way to A/B one file in a dirty tree.** It reverts the
  data along with the script, so two parsers get compared against two different
  logs. Extract the old version to a probe file *in the same directory*, run
  both against the one live log, then delete the probe.
- **Parse `git log --name-only` with `--format=%x00%H` and NUL-split records.**
  31 pathnames in this repo are exactly 40 characters, so "any 40-char line is a
  sha" overcounts commits by 8%.
- **A parser change that reports MORE is not self-evidently a fix.** 166.5's
  first draft would have read `4-tick sweep` as slice 4 across 18 rows.
- **A figure describing a commit is read from THAT COMMIT, never from the
  working tree, `HEAD`, or the prose beside it.** Size `git show <sha>:<file> | wc -l`;
  delta `git show --numstat --format='' <sha> -- <file>`; for a figure going
  into the message of a commit that does not exist yet, the index —
  `git show :<file> | wc -l`, which tracks what is staged, not the tree
  (red-proved by discrimination: index 3 while the tree read 5). **This bullet
  named only the after-figure form until 229.5, and the commit that ADDED it
  broke it in its own subject** — `d701e61` says `3,794 -> 1,473` where the
  commit holds **1,626** — while the hand-off beside it made the uncovered
  delta form: *"129 insertions − 2,328 deletions = −2,199 matches 3,794 → 1,595
  to the line"*, against a numstat of **158 / 2,326 = −2,168 → 1,626**. The
  tell is never arithmetic — those four numbers are self-consistent
  (3,794 − 2,199 = 1,595), which is exactly why a working-tree reading survives
  review. A commit's own numbers always reconcile: 3,197 − 1,476 = **1,721** at
  `e29c7c18` too, against 214.1's stated `3,197 → 1,650` (roadmap 208, 228.1,
  229.5).

  **`HEAD` was added to that first line by 275.3 (2026-09-05), because naming
  only the working tree read as clearance for the other pre-commit state.** Two
  consecutive wakes broke this from that side, and neither touched the tree:
  273.1 read the polish ledger at `HEAD` and published **16** where its own
  commit makes it **17**; 274.1 ran a script that reads `HEAD` by construction
  and published a verdict that is already the opposite one at the commit
  carrying it. **When your own commit changes the file, `HEAD` is the pre-change
  state and is exactly as wrong as the tree, in the opposite direction.** Both
  were harmless in their conclusions and wrong in the audit trail a later wake
  re-runs, which is the expensive half.

  **And when a SCRIPT produces the figure, `git show :<file>` is not available**
  — the script walks revisions and the index is not one. Two things work: name
  the revision the reading describes (274.1 did exactly this for its region
  table and not for its Accept, in one commit), or re-run after committing and
  correct the number. A figure with no revision beside it is read as current.
- **A presence probe is not a fidelity probe.** Asking whether a heading still
  appears in 53 revisions answers whether it was deleted, not whether what sits
  under it decayed. 169.3's first pass read "zero shrinks" off a subset of
  sections with a deduplicated display; the honest count on the full set was
  three (roadmap 169.3).

---

## Standing owner instruction (2026-08-27, resolved 2026-08-28)

**No external product is named in any document in this repo** — describe the
mechanism instead, or cite the standard when a finding is normative. The owner's
line: **scrub UX-precedent mentions only.** Design-system citations, interop
hazards (the product name is the reader's search term) and licence attributions
are KEPT, with the reasons in `check-vendor-names.mjs`'s header. The gate is a
denylist and catches regrowth, not every conceivable name, so the judgement is
still yours.
