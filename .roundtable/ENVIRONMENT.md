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

## 1c. `CHROME_PATH` DOES NOT PERSIST EITHER — **in the Linux container**

```
export CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome && npm run <gate>
```

Export it in the SAME command as the gate, every time.

**⚠ THIS WHOLE SECTION IS ABOUT THE CLOUD CONTAINER, AND USED TO READ AS
UNIVERSAL** (Objective grill, Slice 298). `resolve-chrome.mjs` tries
`process.env.CHROME_PATH` first and then a candidate list that ends with
`/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`. So **on a Mac
with Chrome installed, no gate needs this variable at all** — measured, not
inferred: `env -u CHROME_PATH npm run scan:dead-style -w docs` exits **0** and
reports its usual 1,433 declarations.

That matters because the failure below is the section's own evidence. A local
wake reading it, finding every gate green without the export, could reasonably
conclude the section is stale and stop exporting it — and then lose a cloud
wake to the trap it correctly describes. **The variable is required where the
resolver's candidates are absent (the container), and is inert where a
candidate resolves (this Mac).** Name the environment before quoting the
measurement.

**WHICH gates need it is DERIVED, never listed here** (roadmap 293.1,
2026-09-06). This section named three — `docs:build` "(`check-boost.mjs`)",
`check:layout`, `test:axe` — and **both halves of the first were wrong**:
`check-boost.mjs` was deleted on 2026-08-30 by `f1be2485`, and `docs:build`
passes with the variable **unset** (measured, exit 0). Meanwhile
`scan:dead-style`, unnamed here, died on it at the top of that wake's
Standardize sweep — the sweep's own lane 1, blocked by this file. **Both of
those measurements were taken IN THE CONTAINER**; on a Mac neither reproduces,
for the reason the warning above gives.

Every consumer imports the resolver directly, so one grep is exact — measured,
**0** files reach it only transitively:

```
grep -rl 'browser-harness\.mjs\|resolve-chrome\.mjs' \
    apps/docs/scripts/*.mjs examples/erp-suite/*.mjs
  # RUN IT. No value is pinned here any more — see below for why the last
  # three (14, 15, 17) each went stale within a day or two of being written.
```

Re-run it; the count is the reconciliation, not the list.

**It read 15 here and returned 17 on 2026-09-08** (roadmap 332.1). The 15
reproduces exactly at `605829ca`, the commit it described, so the entry was
right and drifted — which is the third consecutive time (14 → 15 → 17), and the
reason no number is pinned above. The two arrivals are **one of each kind**, and
only one of them changes what a wake must do:

- **`measure-stress.mjs`** — a new **npm-script entry point** (`measure:stress`),
  so the gate list grew. It is **not** in `ci.yml`, so it is a run-by-hand
  consumer that needs the export in this container.
- **`po-app-harness.mjs`** — **a false positive of this grep**. It matches only
  because a prose comment on its line 4 names `browser-harness.mjs`; it imports
  no browser module and launches nothing.

**And the grep/closure equality that licenses the one-level shortcut is no
longer a SET equality, though the counts still agree** — believe the closure, as
this section already says:

```
one-level grep : 17
reach closure  : 17
closure-only   : resolve-chrome.mjs   # the resolver itself: 0 self-mentions,
                                      # so this grep can never list it
grep-only      : po-app-harness.mjs   # the comment match above
```

Two opposite errors cancelling into a coincidental `17 = 17` — the same shape
the toolchain section below warns about with its own two 17s. **Compare the
sets, not the counts**, in both places.

**The count moved within a day of being written, and the comment stayed at 14
for one more wake** (roadmap 299.2). 293.1's **14** was exact at its own commit
— reconstructed by re-running the grep against `649ca8ef`'s tree. Slice 295
(`605829ca`, hours later) added `gen-og-card.mjs`, a direct
`browser-harness.mjs` importer that is **not** an npm script, so the
arithmetic above stopped summing. Slice 298's grill *reported* the move and
left the comment reading 14; the number is corrected here, which is the point
of the mechanism rather than an addition to it.

**When the count disagrees, the question is which KIND of consumer arrived**,
because only one kind changes what a wake must export:

- a new **npm-script entry point** — the gate list grew; export the variable
  for it (where the resolver has no candidate, i.e. the container).
- a new **non-script consumer**, like this one — nothing a gate runs changed;
  the file needs the variable only when a human runs it directly.
- a **transitive-only** consumer — the grep is now under-reporting and the
  one-level shortcut has expired. Still **0** today, re-measured rather than
  carried: a relative-import graph over both directories, closed under
  reachability from `browser-harness.mjs`/`resolve-chrome.mjs`, returns a
  closure of **15** against the grep's **15** — equal sets, so nothing reaches
  the resolver only through another module. That equality is what licenses a
  one-level grep to stand in for a real closure; if the two ever disagree,
  believe the closure.

Which one it is takes one command:
`grep -rn '<basename>' --include='package.json' . --exclude-dir=node_modules`
— no hit means it is not an npm script.

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

**WHETHER `--unshallow` BRINGS THE TAGS VARIES BY CONTAINER, SO MEASURE IT —
never assume either way.** The durable fact is the failure mode, not the
behaviour: `git tag` answers **EMPTY rather than erroring** when they are
absent, so a claim of the form "the tag list starts at vX" reads as an absence
instead of a disagreement — the silent kind of wrong this file exists for.

```
git fetch --unshallow origin
git tag | wc -l                 # THE check — run it; 0 means fetch them
git fetch --tags origin         # idempotent, under a second, safe to always run
```

This bullet used to assert flatly that `--unshallow` does **not** bring them
(measured 2026-09-03, Slice 256, and true in that container). **It has now been
contradicted on five consecutive wakes** — the four hand-offs at `e914399`,
`77e475c`, `a24ed45` and `4567bed`, each recording that the unshallow again
arrived with the tags, and this wake, where `git fetch --unshallow origin`
printed `* [new tag] v0.5.0 / v0.6.0 / v0.7.0` and the follow-up
`git fetch --tags origin` then added **nothing**, `git tag | wc -l` reading
**7**. Four hand-offs said "keep verifying rather than trusting either reading"
and the durable file went on stating the value; correcting it here is the split
this file exists for (169.3), and it is written as the property — *run the
count* — rather than as the new value, per CLAUDE.md's criterion rule. A sixth
container reading `0` is not a new bug; it is the reason the count is the check.
**The inline `# 7 here` was removed on 2026-09-08 (Slice 360), because that wake
counted 8** — the value drifts with every release, so pinning it here converts a
normal reading into an apparent disagreement, which is the failure this bullet
already describes one level up.

## 2b. A TIMED-OUT UNSHALLOW LEAVES `.git/shallow.lock`, AND EVERY LATER FETCH THEN FAILS QUIETLY

**Bit again on 2026-09-08 (Slice 360, cloud wake)**, so this is not a one-off:
the first `--unshallow` was killed by a **280s** tool timeout, left the 0-byte
lock, and the next `git rev-parse --is-shallow-repository` still read `true` at
50 commits. `rm -f .git/shallow.lock` then a plain re-run gave **2,087** commits.
Recovery took one attempt because this section was read first, which is the only
evidence a durable file earns.

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

## 3. `astro build` CLEARS `dist` — and the hazard runs the other way

**This section said the opposite until 2026-09-08, and the old claim is dead**
(roadmap 332.1, which audited every section here for exactly this). Superseded
text and the reasoning are in `LOOPS-archive.md`. Measured, isolated to a bare
`astro build` rather than to the 30-step chain around it:

```
echo x > apps/docs/dist/__sent-A.txt
mkdir -p apps/docs/dist/__sentdir && echo x > apps/docs/dist/__sentdir/__sent-B.txt
npx astro build                 # in apps/docs
  -> both the stray FILE and the stray DIRECTORY are REMOVED
npx astro --version -> astro v5.18.2
```

No `rm -rf`/`rimraf` exists in any docs script and `astro.config.mjs` sets no
`outDir` or clean option, so it is astro doing it. **The declared range never
moved** — `^5.1.0` is the only value the file has ever carried, so if this
behaviour changed it changed under the repo via a floating minor, with no commit
to point at. The property is the claim; **run the count rather than reading one
here** (roadmap 364, which found the pinned `40` unreproducible at any revision
— every instrument tried returns **67**, at Slice 361's own commit and at HEAD
alike):

```
git log --format=%H -- apps/docs/package.json | while read c; do \
    git show $c:apps/docs/package.json \
    | python3 -c "import json,sys;d=json.load(sys.stdin);print(d.get('dependencies',{}).get('astro') or d.get('devDependencies',{}).get('astro'))"; \
  done | sort | uniq -c        # one line, or the range moved
```

Re-measure rather than trusting this paragraph; that is how it came to be wrong.

`rm -rf apps/docs/dist` first is still harmless and still in the toolchain
block below — it is simply no longer load-bearing.

**The live hazard is the inverse: never run a bare `astro build` to iterate.**
Because it empties `dist`, it silently discards everything the chain adds
*after* it — `copy-suite`, `highlight-code`, `scope-search-index`,
`pagefind --site dist`, `gen-llms`, `stamp-build-id`. Measured immediately after
one on 2026-09-08:

```
files in dist   224     (a full `npm run docs:build` leaves 529)
pagefind          0
llms.txt          0
```

A dist-reading gate or probe then measures an **incomplete site that looks
built** — fail-open, which is the failure `serve-dist.mjs`'s own header says it
exists to prevent. If you have run a bare `astro build`, run the full
`npm run docs:build` before believing any dist reading.

## 3b. THE HAND-OFF IS GATED CONTENT, AND THE WAKE'S OWN ORDER LEAVES IT UNGATED

Bit for real on 2026-09-07 (Slice 311, cloud wake): `main` went red on
`check:floor` for a label hand-typed **in `RESUME.md`**, one commit after the
same gate had passed on 580 files. Nothing regressed between the two runs — the
gate ran *before* the file existed.

The wake's normal order is: run the gate suite → commit the slice → write the
hand-off → commit → push. Everything after step 1 is unverified, and several
gates in `docs:build` read `.roundtable/**`.

**This list was wrong in both directions until 2026-09-07, and it is now the
output of an instrument rather than a reading** (roadmap 313). Every node
process in the CI-runnable suite was run under an fs spy that logs each access
under the path, and each gate named was then driven red by an injection into
`.roundtable/`:

```
check:floor          # a hand-typed browser floor — ROADMAP.md is exempt, .roundtable/** is NOT (256.2)
check:slice-refs     # every `roadmap NNN` citation must resolve — TRACKED files only, it reads `git ls-files`
check:vendor-names   # the standing owner instruction on product names
check:imports        # walks the whole repo for .mjs/.js/.ts — a CASE-mismatched relative import, not a missing one
```

`check:loop-vocab` **was in this list and does not belong**: it reads
`CLAUDE.md`, `LOOPS.md` and `scripts/loops/record_iteration.py`, and nothing
else. Zero accesses in the spy trace, green under all seven injections.
`check:imports` was missing and does walk it.

**`.roundtable/**` IS NO LONGER IN CI's `paths-ignore` — there is no
`paths-ignore` at all** (roadmap 312.2, removed *because* of the reads above).
So a `.roundtable`-only push now runs the full suite: this section stops being
a subtlety about pushes that carry something else, and becomes the ordinary
case. The older warning still holds for the same reason it always did — when
CI runs, the gates walk the whole repo, hand-off included.

So: **re-run `npm run docs:build` AFTER writing `RESUME.md`, before pushing.**
Not the whole 17-command list — the four gates above all live inside that one
command. The advisory `check-resume-*` scripts are not a substitute: they check
the charter and stale slice ids, and neither of them reads for any of the four.

The general shape, which is why this is here and not in a slice: **a gate you
ran is a statement about the tree at the moment it ran.** Any file written after
it — a hand-off, a grill report, an amended ROADMAP entry — is ungated until
something re-runs. `check:formatting` reaching CI unrun on 2026-08-29 is the
same failure by a different route (a list that did not name it); this one is a
list that named it and an ORDER that ran it too early.

## 4. `npx prettier` IS NOT THIS REPO'S FORMATTER

No prettier config and no prettier dependency exists here. The style enforcers
are `stylelint` and the gates in `check:repo`.

## 4b. AMENDING THE SLICE COMMIT **AFTER** `record_iteration.py` STRANDS THE SHA IN EVERY ROW IT JUST WROTE

Found 2026-09-09 (Slice 371). `record_iteration.py` stamps each row it appends
with the current `HEAD`. A `git commit --amend` afterwards — to fold in one more
edit before pushing — **rewrites that sha**, and the rows keep pointing at an
object that exists only in this container's reflog. It will never exist on the
remote.

**Nothing catches this.** `git cat-file -e <old sha>` still answers *yes*
locally, so the obvious check passes while the published record is already
broken. This is the mechanism behind `LOOPS.md` §0c's *"five whose sha no longer
exists, rebased away"* — that section records the symptom and names blame as the
durable alternative; this is how the shas get stranded in the first place.

Either **do not amend after recording**, or correct the rows before pushing:

```
grep -c '<old sha>' .roundtable/loop-log.md      # assert the count FIRST
#   ... replace with the post-amend sha, then rebuild the mirrors:
python3 scripts/loops/rebuild_from_log.py
python3 scripts/loops/generate_status.py && python3 scripts/loops/generate_roundtable_index.py
grep -c '^- ' .roundtable/loop-log.md            # must equal the rebuild's row count
```

Slice 371 hit it with **3** rows (one Continue + two `--also-refused`), asserted
the count before replacing per CLAUDE.md's bulk-edit rule, and reconciled the
rebuild at **1710 = 1710**. **No item is filed** — this is a sequencing rule, not
something a gate can see, and the loop already refuses gates on that shape.

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
filing one.

**It is NOT a 1440-only trap, and this section read as one until 2026-09-06**
(roadmap 286.2). The same reservation is present at **390px** — the width every
density and wrap measurement in this repo is taken at:

```
390px viewport:  main.bo-app-shell__main  offsetWidth 390 - clientWidth 375 = 15
```

**And "heights are unaffected" holds only for rows that do not WRAP.** That
sentence stood on a probe of rows whose height was already fixed, and those
readings still reproduce exactly (14 rows, 384px, 9 rows fully inside). But a row
whose cells wrap takes its height FROM the width, so the 15px feeds straight into
it: on `/patterns/detail-form` at 390px the one auto-density table measures
**260px** against its three `data-density="compact"` siblings' 310px, and its
first row already wraps at **87px** before any mutation. A cross-environment
comparison of a wrap-sensitive row height is therefore confounded by exactly the
amount this section names — the likeliest true cause of the decay roadmap 281.1
attributed to a commit that never touched the table (286.1). Row counts and
overflow booleans are still unaffected.

## 6d. `actions/runs?head_sha=` NEEDS THE **FULL** SHA, AND A SHORT ONE ANSWERS `200` WITH AN EMPTY LIST

Every hand-off carries *"CHECK CI AFTER PUSHING"*, so every wake runs this. Cost
a wake 20 minutes on 2026-09-08 (Slice 347): a poll loop filtered on a 9-character
prefix, matched nothing, and had no branch for the empty case — so it polled 40
times and reported a **timeout** while both workflows had in fact finished
`success` in 3m19s.

**This is trap 2's shape a third time** (after `git tag` and §8's `/discussions`):
an empty answer that reads as *"nothing yet"* when it means *"wrong query"*. The
control is one line and settles it:

```
R=https://api.github.com/repos/Busy-Office/busy-office-ui
H="Authorization: bearer $GITHUB_TOKEN"
curl -sS -H "$H" "$R/actions/runs?branch=main&head_sha=c6385371c" | ...  # runs: 0   ← 9 chars
curl -sS -H "$H" "$R/actions/runs?branch=main&per_page=6"                # every run, with its sha
```

Two rules, both cheap:

- **Prefer the plain `?branch=main&per_page=N` listing and match the sha
  yourself.** It cannot silently filter to nothing, and it shows the neighbouring
  runs, which is what tells you a run was never created at all.
- **A poll loop must emit on the empty case too.** *"Zero runs match"* and *"the
  runs are still going"* are different states and a loop that only breaks on
  completion cannot tell them apart — CLAUDE.md's *could this detector go red on
  anything at all?* applied to a wait rather than to a gate.
- **Take the full sha from `git rev-parse HEAD`, never by extending a short one
  you already have on screen.** Both rules above were followed on 2026-09-08
  (Slice 355) and the poll still matched nothing for 40 iterations, because the
  sha it filtered on was *assembled*: the new commit's short prefix
  `81fc42cb` concatenated with the **previous** commit's tail
  (`b1da20c` **75c6baf0ac2882c1c18a618c33bd19083**), producing
  `81fc42cb75c6…` against a real `81fc42cbe8b6…`. Two adjacent shas share a
  screen, share nothing else, and the fabrication is invisible at a glance
  because the prefix is right. **The emit-on-empty rule is what contained it** —
  the loop printed *"ZERO runs match this sha — not the same as still running"*
  forty times instead of reporting a timeout, so the diagnosis took one command
  rather than a second false alarm to the owner. It still cost 20 minutes: the
  runs had both finished `success` about three minutes after the push. So the
  empty branch is the containment and `git rev-parse HEAD` is the fix.

`updated_at` on the run is the completion time to read (`06:56:57Z → 07:00:16Z`
here); §6's warning about it not ticking per step is about mid-flight polling,
not about a completed run.

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

## 8. `LOOPS.md` STEP 1's TWO INTAKE COMMANDS BOTH FAIL IN A CLOUD WAKE — AND THE SECOND FAILS SILENTLY IN THE WORST WAY

Step 1 mandates reading **issues AND Discussions** every wake, and spells both
as `gh` invocations. **There is no `gh` in this container** (`command -v gh` →
nothing), and the GraphQL endpoint the Discussions command needs is refused for
this session outright:

```
This GraphQL query is not enabled for this session — only the pinned set of
PR-review operations is served. Use REST via `gh api repos/{owner}/{repo}/...`
```

The issues half has an MCP tool (`mcp__github__list_issues`), so it merely
looks different. **The Discussions half has none**, and the previous hand-off
(2026-09-06) recorded the honest consequence: *"Discussions were **not**
checked this wake."* A mandated intake that no wake can execute is the shape
this repo already refuses in `LOOPS.md`'s own gate rule — *a gate that cannot
run must fail loudly, never skip quietly*.

**What works, measured 2026-09-06 (cloud wake, roadmap 302.1):** the REST
route, with the `GITHUB_TOKEN` already in the container's environment.

```
curl -sS -H "Authorization: bearer $GITHUB_TOKEN" \
     -H "Accept: application/vnd.github+json" \
     https://api.github.com/repos/Busy-Office/busy-office-ui/discussions
```

**Read the empty answer carefully — this is trap 2's shape one API over.** An
empty `[]` is what "no open discussions" looks like AND what a route that does
not serve this resource would look like, so the reading needs a control. Both
run in one command:

```
.../discussions          -> HTTP 200, len 0     the reading
.../not-a-real-route     -> HTTP 404            an unserved route does NOT answer 200 []
.../issues?state=open    -> HTTP 200, len 1     a list route with known content
```

The 404 control is what makes the 200 mean *served*, and the issues control is
what makes `len` mean *how many*. `has_discussions` on the repo object reads
`true`, so the feature is on and the zero is a real zero. Note
`/discussions/categories` 404s — it is not a route; its own
`documentation_url` (`rest/repos/discussions#get-a-discussion`) is nonetheless
what identifies the `/discussions` family as **repository** discussions rather
than the org/team endpoint of the same name.

**Not red-proved, said plainly**: nothing has ever been filed in this repo's
Discussions, so the route has never been observed returning a non-empty list.
The controls above are the strongest evidence available without filing one.
The day a discussion exists, re-run this and confirm it appears — until then
the reading is *"a served route reports zero"*, not *"a route known to report
correctly reports zero"*.

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
- **Can run, and is a THIRD thing that is neither of the two: what reaches
  PAPER.** `page.pdf({ printBackground: false })` — the print dialog's default
  — is available here, and the PDF is the artefact. Inflate every
  `stream`/`endstream` pair with `zlib.inflateSync` and parse the fill
  operators `/(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s+rg/`.

  **Use it for any printed ratio, because `emulateMediaType('print')` + computed
  style is an INPUT to a system that rewrites it** (roadmap 369, 2026-09-09).
  `print-color-adjust: economy`, the default, does not merely drop backgrounds:
  it darkens light text when it drops them, so a dark-theme rgb(249,250,251)
  is painted rgb(166,166,167) — 1.05:1 by computed style, **2.43:1** in fact —
  and rgb(45,212,191) is painted rgb(27,128,115), which PASSES at 4.79:1 while
  its computed value fails at 1.86:1. Computed style is still right for the
  structural question (does this element's own colour survive the print reset);
  it is wrong for the number. Two traps in the parsing, both of which cost a
  round: Chrome writes **leading-dot floats** (`.0784 .1882 .1137 rg`), so a
  regex built from `(n/255).toFixed(2)` matches nothing and every case reads
  "absent" identically; and `printBackground: true` is the control that proves
  the parser works at all.

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
- **`import.meta.url` in Astro frontmatter is the COMPILED module, not the
  `.astro` source — and the repo's own `../../../../../` idiom hides it.** At
  build time the frontmatter executes as
  `apps/docs/dist/pages/<…>/<page>.astro.mjs`, so a page reading *itself* reads
  generated JS. The existing relative-path reads (`tokens.astro`,
  `primitives.astro`, `ai-assistants.astro`) all resolve correctly from either
  location only because `src/` and `dist/` sit at the **same depth** under
  `apps/docs/` — a coincidence, not a guarantee, and one that makes the wrong
  reading look proven. To read a source file, name its repo-relative path
  through that same idiom rather than passing `import.meta.url` bare; a rename
  then fails with ENOENT, which is the safe direction. Measured 2026-09-06
  (roadmap 292.4): a self-scan parsed `15 hand-written + 4 interpolated` against
  `24` raw occurrences and failed loudly — **the count reconciliation is the only
  reason it was not shipped silently reading the wrong artifact**.
- **`git stash` is not a way to A/B one file in a dirty tree.** It reverts the
  data along with the script, so two parsers get compared against two different
  logs. Extract the old version to a probe file *in the same directory*, run
  both against the one live log, then delete the probe.
- **Parse `git log --name-only` with `--format=%x00%H` and NUL-split records.**
  Enough pathnames in this repo are exactly 40 characters that "any 40-char line
  is a sha" overcounts commits by several percent — `git ls-files | awk
  'length($0)==40' | wc -l` is the count, and **run it rather than quoting one**:
  this bullet said 31 and returned **30** on 2026-09-08 (roadmap 332.1). The
  trap is the parse, not the number.
- **A parser change that reports MORE is not self-evidently a fix.** 166.5's
  first draft would have read `4-tick sweep` as slice 4 across 18 rows.
- **An enumeration of `## Slice` sections across `ROADMAP.md` +
  `ROADMAP-archive.md` meets a ONE-LINE POINTER for every closed slice, and
  deduping by slice number can silently pick the stub over the body.** A closed
  slice keeps its full heading in `ROADMAP.md` with only
  *"Closed — archived verbatim in `ROADMAP-archive.md`."* underneath; the text
  is in the archive. So an instrument that walks both files and keeps the FIRST
  hit per slice — the ordinary reading order — matches the right headings and
  then reads empty bodies for exactly the closed ones. It does not error, it
  does not report a miss: it reports a smaller number, which is the silent kind
  of wrong this file exists for. Measured 2026-09-09 (roadmap 368): a count of
  the 15 `Standardize sweep, 4 of 4 lanes` sections returned **4** where the
  answer is **5**, because **7 of the 15** resolved to a pointer and the one
  carrying the sought marker (Slice 274) was among them. Keep the LONGEST body
  per slice, or read the archive first, and **assert how many matched sections
  resolved to a pointer** — that number is the reconciliation. The tell, when
  something looks thin, is that the sections coming back empty are precisely the
  closed ones.

  **No gate over this** — the shape *"a matched section whose body is only the
  pointer"* is true of 7 of 15 on a correct tree, so a gate is red on a healthy
  repo (roadmap `94.11`'s base-rate rule). This bullet is the mechanism, because
  it is read before such an instrument is written.

  **And an injection placed inside the population cannot find it.** The slice
  that published the 4 red-proved its instrument by mutating a section it was
  already reading, which tests the detector and says nothing about what was
  never opened. When a red-proof and a population question meet, the population
  needs its own control: count the raw thing (here, sections matched vs bodies
  actually read).
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
- **A probe that drives a control with `el.click()` is measuring the UNTRUSTED
  dispatch path, and for anything timing-sensitive that path behaves
  differently from a real click.** A microtask checkpoint runs whenever the JS
  stack empties. Under `el.click()` the whole event dispatch sits inside one JS
  frame, so a `queueMicrotask` queued by a listener runs after ALL listeners;
  under a real (trusted) click the browser drives the dispatch from native code,
  the stack is empty *between* listeners, and the same microtask runs in the
  middle of it. Measured both ways on one build, roadmap 278.4: a probe using
  `el.click()` reported `table` → `container` → `microtask`, and the shipped
  code built on that reading left every row unsynced under `page.click`. The
  instrument agreed with the hypothesis because it exercised the one path where
  the hypothesis is true. **Drive the real thing — `page.click` /
  `page.keyboard` — whenever the answer depends on listener or task ordering**,
  and prefer `setTimeout(…, 0)` over `queueMicrotask` when the point is to run
  after another listener: a task cannot run until the dispatch completes, on
  either path.
- **A red-proof that goes red TOO BROADLY certifies nothing either.** The same
  slice's first live injection deleted the whole false branch of a minified
  ternary, left `cond?l(t)` behind, and the module stopped parsing — four gate
  cases went red instead of the one under test, which reads exactly like a
  working red-proof if you only check that the gate failed. Replace with
  something well-formed (`void 0` for a dropped branch), assert the replacement
  count is exactly 1, and re-read the artifact afterwards.
- **`waitUntil: 'load'` is not settled enough for a COMPUTED-STYLE reading in
  this harness, and the unsettled answer looks like a cascade finding.**
  Measured 2026-09-07 (roadmap 310.1) over the built erp-suite: a probe reading
  `getComputedStyle(button).backgroundColor` on the suite's seven
  `.bo-btn--ghost` Refresh buttons reported a 4/3 split — some `rgba(0, 0, 0, 0)`
  as the variant defines, some `rgb(239, 239, 239)`, which is Chrome's UA
  `buttonface`. That reads exactly like "the ghost variant loses somewhere", the
  kind of thing worth filing. It is the probe: **two runs under `load` disagreed
  with each other about WHICH pages**, and two runs under
  `waitUntil: 'networkidle0'` plus `await two nested requestAnimationFrame`s
  agreed exactly (7 transparent, 3 white-with-border). Geometry was stable
  either way — 36x36 in every run that recorded it, three of the four, the
  fourth having printed only colours — so the tell is that only the *painted*
  values moved. Use `networkidle0` + 2 rAF whenever the reading is a computed
  colour, and run it twice before believing a split.
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
