# Resume state — read this at Step 0 of every wake

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

Ordinary state — what is queued, what is done — lives in `ROADMAP.md` and
`.roundtable/loop-log.md`. Only put things here that those two cannot say:
uncommitted work, and a decision made but not yet written down.

**169.3 (OPEN) says this file is not honouring that header** — 164 of its 261
lines were durable content, kept alive only by each wake re-copying it. The
trap block below is exactly that content. It stays until 169.3 is decided;
moving it is that item's job, not a passing tidy.

---

## In flight: nothing

Last updated 2026-08-28 (cloud wake, scheduled routine — **rule 4 → Continue,
168.1**). Working tree clean at hand-off; the wake's commits were pushed as one
batch.

**Reconcile this file against `ROADMAP.md` before trusting its open set** — it
goes stale between wakes. The handover this one replaces was correct: it named
**168.1** then **169.3**; 168.1 closed this wake, 169.3 is still open. Trust the
`N. [ ]` checkboxes, not this section.

## Direction — the owner's pick, and whether THIS wake advanced it

**Standing section, added by 168.1 (2026-08-28). Answer all four every wake,
from the sources named — never by copying the answers above you.** Rule 4 always
has an oldest open item, so the loop never stalls and never halts; a *direction*
that nobody can advance is therefore invisible underneath maintenance that looks
healthy. This block is the only place the loop says so out loud. Four answers,
not a rule, not a gate and not a ratio — the three things 168.1 refused.

- **Direction:** (a) adoption/DX — finish it by publishing
  `@busy-office/create-ui`. Source: the `DECISION (owner, 2026-08-28)` block in
  `ROADMAP.md`'s Slice 164.3. **Read it there**; this line is a pointer, and a
  pointer that disagrees with its source loses to the source.
- **Remaining step, and who it waits on:** `npm publish -w
  @busy-office/create-ui` — **owner-only**, by CLAUDE.md's standing policy
  ("Publishing remains owner-triggered"). Do not trust the previous wake's
  answer here; ask the registry, which is the authority and this file is not.
- **Did this wake advance it?** **No.** The remaining step is owner-only, and no
  cloud wake can run it. This wake ran rule 4 → Continue on 168.1 itself.
- **Work rows since the direction was decided that did not advance it:**
  **12 of 13** on 2026-08-28 — the commands below printed `13` and `1`, and that
  `1` is 164.3, the deciding row itself. Re-derive rather than increment; a
  copied number is 169.1's exact failure mode.

```
npm view @busy-office/create-ui version     # E404 → unpublished → still blocked
npm view @busy-office/ui version            # 0.5.0 on 2026-08-28

# fb15cdc is the commit carrying the owner's decision. UNSHALLOW FIRST (trap 2)
# or these resolve nothing and the rate is silently missing, not wrong.
git diff fb15cdc..HEAD -- .roundtable/loop-log.md | grep '^+- ' | grep -vc ' · Meta · '
git diff fb15cdc..HEAD -- .roundtable/loop-log.md | grep '^+- ' | grep -v ' · Meta · ' | grep -c create-ui
```

**When that number climbs and the registry still 404s, say so to the owner** —
that is the whole finding, and on a scheduled routine the push notification is
the only channel it has. No threshold is attached and no gate is proposed:
168.1's Accept names a line in the handover, and a threshold here would be the
ratio that item refused by name.

**`create-ui` is the only name in these commands that will age.** When the owner
picks a direction that is not "publish the front door", the two `npm view` lines
and the `grep -c` needle change with it — and `fb15cdc` becomes whichever commit
carries the new decision. Rewrite them; do not reinterpret them.

## ⚠ READ FIRST IF THIS IS A CLOUD WAKE — THE GIT/BUILD TRAPS

**Exercised for real this wake (2026-08-28, 168.1): 1, 1c, 2, 3.** Said one by
one rather than carried forward as "all confirmed":

- **1** — exercised, and **this container had NO local `main` at all**, which is
  a harder failure than the stale-ref case the trap documents and shows up one
  command earlier: `git rev-parse --short main HEAD` exited **128**, `fatal:
  Needed a single revision`. `git branch --show-current` was empty, as the trap
  says it would be. Fixed with `git checkout -B main origin/main` **before the
  first commit**, so trap 1 did not bite at push this time — the corrected
  advice worked as written. Also confirmed again: `origin/main` arrived as a
  **forced update** (`17b3ba6...12e97c6`), and the tip the previous handover
  named (`fe2de12`) no longer exists — Step 0c's rebase mechanic, visible.
- **1c** — needed by `docs:build`, `check:layout` and `test:axe`, exported in
  the same command each time.
- **2** — shallow again on a fresh container; `git fetch --unshallow` brought it
  to **1,495 commits**. Needed, because this wake's finding is a rate measured
  across `git diff fb15cdc..HEAD`.
- **3** — `rm -rf apps/docs/dist` before `docs:build`, as always.
- **1b, 4, 6, 7** — not exercised: no `cd` was issued, no formatter was run, no
  background task was launched, and no word count was taken at all.

### 1. `git checkout main` — the container starts DETACHED

Confirmed again. This wake `origin/main` came back as a **forced update**
(`17b3ba6...fe2de12`) — a rebase — so the local ref was not merely behind.

```
git fetch origin main && git checkout -B main origin/main
```

`git ls-remote --heads origin` is the authority on what is pushed; the local
`origin/main` ref is not, until a fetch.

**THE TRAP DOES NOT BITE AT STEP 0. IT BITES AT `git push`, and the usual Step 0
check gives false comfort** (2026-08-28, Slice 170 — the first push of that wake
was rejected after three commits were already made).

On a detached HEAD the local `main` ref still exists and is **stale** — here it
sat at the pre-rebase `17b3ba67` while work was committed onto a detached
`6dfb8709`. `git push -u origin main` pushes *that ref*, not `HEAD`, so it
reports the confusing `a pushed branch tip is behind its remote counterpart`
even though your work is strictly ahead.

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

### 1b. THE BASH WORKING DIRECTORY PERSISTS BETWEEN TOOL CALLS

**Anchor every command with an absolute `cd`, or none at all.** A `cd apps/docs`
to run one gate leaves the NEXT command there.

### 1c. `CHROME_PATH` DOES NOT PERSIST EITHER

```
export CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome && npm run docs:build
```

Export it in the SAME command as the build, every time. Confirmed again this
wake: it is needed by `docs:build` (`check-boost.mjs`), `check:layout` and
`test:axe`.

### 2. THE CLONE IS SHALLOW — any history measurement is silently 50x wrong

```
git rev-parse --is-shallow-repository     # -> true, on a fresh container
git fetch --unshallow origin              # ~25s; brought this wake to 1,481 commits
```

Needed again this wake — 167.1 is entirely history measurement.
`report_loop_prose.py` now **refuses to report** on a shallow clone rather than
printing wrong figures; that guard was red-proved against a real
`git clone --depth 1`.

### 3. `astro build` does not clear `dist`

`rm -rf apps/docs/dist` first — this wake did. Exercised for real: `report:prose`
died with `ENOENT … apps/docs/dist` before the build, which is the honest failure
rather than a stale number.

### 4. `npx prettier` IS NOT THIS REPO'S FORMATTER

No prettier config and no prettier dependency exists here. The style enforcers
are `stylelint` and the gates in `check:repo`.

### 5. NEW — `loops.db` IS GIT-IGNORED, SO A FRESH CONTAINER HAS NO MIRROR

**Fixed this wake (167.3), so this is now a note rather than a trap** — but know
the shape, because other derived mirrors have it too. `record_iteration.py`
regenerates the tracked `STATUS.md` from `loops.db`, and on a fresh clone that db
holds only the row this wake just inserted. `STATUS.md`'s "Last 10 iterations"
was rendered from **2 rows against the log's 1,020**, which would have committed
nine rows of history away, silently. `generate_status.py` now counts the raw rows
in `loop-log.md`, announces the disagreement and rebuilds. If you touch another
mirror here, assert its count against the file first.

### 6. NEW — A BACKGROUND TASK'S OUTPUT FILE IS NOT A COMPLETION SIGNAL

**This wake's own worked example of "an instrument's first output is not
evidence", and the wrong diagnosis got committed before the right one.** The
first version of this trap accused the GitHub run-level endpoints of serving a
stale snapshot. **That accusation is withdrawn — it was wrong**, and the real
cause was the wake's own waiting.

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

**What it cost, and why it is filed here rather than shrugged off.** Five CI
polls fired inside ~4 minutes of wall clock while the wake believed ~20 minutes
had passed, so a **normal three-minute run** (565: started 06:50:44, last job
done 06:53:48, all six `success`) looked hung at 7x its norm. That false alarm
was sent to the owner, then a second notification "corrected" it with a
diagnosis that was also wrong. Two reported numbers, both the instrument's
fault. Container wall clock is the check that settles it — `date -u` against
`git log --format=%cd`; the whole wake spans 06:47→06:57.

`get_workflow_job` on a specific job id **is** still the most direct route to a
definite per-job answer, and job ids come from `list_workflow_jobs`. But the
run-level readings were most likely correct when taken: `updated_at` on a run
does not tick per step, so a frozen value there is normal and is not evidence
of staleness.

### 7. NEW — A BARE `wc -w` UNDERCOUNTS THIS REPO BY 2.4-4.5%

No locale is set in this container, and GNU `wc` in the C locale swallows an em
dash, which this repo's prose is full of:

```
printf 'alpha — beta\n' | wc -w                 # 2   ← wrong
printf 'alpha — beta\n' | LC_ALL=C.UTF-8 wc -w  # 3
```

`LC_ALL=C.UTF-8 wc -w` and Python's `str.split()` agree exactly on all five
loop-machinery files. Any ad-hoc word count taken here is low unless the locale
is pinned. Full figures in ROADMAP 167.1.

## Cloud-wake toolchain — what works, in order

```
npm ci                                                    # no node_modules at start
export CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
rm -rf apps/docs/dist
```

Green again this wake (2026-08-28, 168.1): `build -w @busy-office/ui`,
`test -w @busy-office/ui` (137 tests, 26 files), `docs:build`, `check:repo`
(9 gates — 288 imports, 42 self-test classifications, 185 slice citations, 530
files against the vendor denylist), `check:claims` (139 behaviours),
`check:layout` (127 pages), `test:axe` (127 × 2, zero violations). Figures
unmoved from the previous wake, which is expected: no input to any of them
changed.

`sqlite3` is NOT installed in this container. Query the mirror with Python's
`sqlite3` module — `python3 -c "import sqlite3; ..."`.

## ⚠ THIS WAS A CLOUD WAKE — WHAT WAS NOT LOOKED AT

No Podman, no `localhost:8081`, no screenshots at 1440px/390px in light and dark.

**Nothing visual exists to look at from this wake.** `git diff --stat` lists
exactly three files: `ROADMAP.md`, `LOOPS.md`, `.roundtable/RESUME.md`. **No
executable file was touched at all** — no script, no CSS, no Astro page, nothing
under `apps/docs/src` or `packages/core/src` — which is a stronger statement than
a screenshot. `check:layout` (127 pages) and `test:axe` (127 × 2) swept every
page at both widths anyway and were green. **No visual debt was added; nothing
visual was looked at.**

**The two carried-forward visual items have waited another wake** — both need a
local wake with a browser, and neither is dispatchable here:

- `DsaScore.astro` and `concepts/which-pattern.astro` each gained
  `<span class="bo-badge">generated</span>` inside an existing `<h2>`.
  `DsaScore` renders on 38 pages, so if the badge wraps badly it wraps in 38
  places. First local wake: glance at one component page's "Design-system
  alignment" heading at 390px.
- The `#markers` table on `/components/data-table` at 390px, both themes.

## What landed this wake (2026-08-28, cloud, rule 4 → Continue 168.1)

Dispatcher: rule 1 clear (no open P0; GitHub intake **0 open issues**, asked via
the API, not assumed), rule 2 read `Standardize 1 / 4 ok`, rule 3 read
`Objective 1 / 3 ok [170]` — neither fired. Rule 4 took the oldest still-open
item: 112.3/112.4 are owner-blocked and the AT-runtime item needs hardware, so
**168.1**, exactly as the previous handover predicted.

- **168.1 closed — implemented, not refused.** `RESUME.md` now carries a
  standing `## Direction` block: four answers a wake fills from named sources,
  two of them backed by a recorded command. No dispatcher rule, no gate, no
  ratio — the three things the item refused by name.
- **The item's own refusal argument died on a fact of this wake.** "Refusing is
  valid … the owner already sees it in conversation" assumes a conversation.
  This wake is the hourly cloud routine; nobody was reading, and its only
  channel to the owner is one push notification composed from this handover.
- **The premise was re-checked and half of it was wrong.** *"The loop has
  advanced it zero times since"* — `fb15cdc`, the commit carrying the owner's
  decision, **is** 164.3 fixing three publish blockers. The honest figure is a
  rate, not a state: **13 work rows since it, 1 names `create-ui`, and that one
  is 164.3 itself → 12 of 13 did not advance it.** A rate re-derives next wake;
  "zero" cannot. Both commands are in the block.
- **Asked the registry rather than re-reading the roadmap**: `npm view
  @busy-office/create-ui version` → **E404**, `@busy-office/ui` → **0.5.0**. The
  direction is still blocked, verified against the authority.
- **One sentence added to `LOOPS.md` Step 0** so the block is answered at
  hand-off rather than read and left. Not a rule; the item forbade one.
- **169.3's tension is named, not smuggled.** This adds ~40 durable lines to a
  file 169.3 (open) finds is 63% durable already. The answers are per-wake and
  belong here; the template and the two commands travel with the traps if 169.3
  decides to move them. That call stays 169.3's.

**Re-run, do not quote** — every figure above has its command in ROADMAP 168.1
or in the `## Direction` block.

## Counters after this wake

Run `python3 scripts/loops/dispatch_status.py` and read it **immediately after
`record_iteration.py`**, per 166.5's lesson — that comparison has found two of
the parser's five blindings and nothing else ever has.

Read at Step 0b this wake, before any commit: **Standardize 1/4 ok, Objective
1/3 ok [170]**, parser at 1,030 iterations. Re-read after
`record_iteration.py` and reconcile against a raw `grep -c "^- "` — that
agreement is what the check exists for.

**NEXT WAKE: re-derive it, but expect rule 4 → 169.3.** Rule 4's oldest
dispatchable open items are now **169.3**, then **170.2**, then **170.3**;
112.3/112.4 and the AT-runtime item are older but blocked on the owner or on
hardware. All three need no browser and are dispatchable in a cloud wake.
**169.3 is a direction call**, not a mechanical move — it decides where the trap
block above lives, and 168.1 has just made that block bigger, which is an
argument for it, not against.

## Traps worth carrying forward (not slice history)

- **`git stash` is not a way to A/B one file in a dirty tree.** It reverts the
  data along with the script, so two parsers get compared against two different
  logs. Extract the old version to a probe file *in the same directory*, run
  both against the one live log, then delete the probe. Used again this wake to
  red-prove `report_loop_prose.py`'s fatal path.
- **Parse `git log --name-only` with `--format=%x00%H` and NUL-split records.**
  31 pathnames in this repo are exactly 40 characters, so "any 40-char line is a
  sha" overcounts commits by 8%.
- **A parser change that reports MORE is not self-evidently a fix.** 166.5's
  first draft would have read `4-tick sweep` as slice 4 across 18 rows.

## Standing owner instruction (2026-08-27, resolved 2026-08-28)

**No external product is named in any document in this repo** — describe the
mechanism instead, or cite the standard when a finding is normative. The owner's
line: **scrub UX-precedent mentions only.** Design-system citations, interop
hazards (the product name is the reader's search term) and licence attributions
are KEPT, with the reasons in `check-vendor-names.mjs`'s header. The gate is a
denylist and catches regrowth, not every conceivable name, so the judgement is
still yours.