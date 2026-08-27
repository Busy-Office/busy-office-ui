# Resume state — read this at Step 0 of every wake

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

Ordinary state — what is queued, what is done — lives in `ROADMAP.md` and
`.roundtable/loop-log.md`. Only put things here that those two cannot say:
uncommitted work, and a decision made but not yet written down.

---

## In flight: nothing

Last updated 2026-08-27 21:55 UTC. Working tree clean; two commits landed and
were pushed as one batch.

## ⚠ READ FIRST IF THIS IS A CLOUD WAKE — THREE GIT/BUILD TRAPS, ALL MEASURED

### 1. `git checkout main` — the container starts DETACHED

**The container starts on a DETACHED HEAD at the pushed tip, while the local
`main` ref is STALE.** Confirmed again this wake: `HEAD` was `5231ba7` (the
pushed tip) while `refs/heads/main` sat at `17b3ba6`, five commits behind.

```
git fetch origin main && git checkout -B main origin/main
```

`git ls-remote --heads origin` is the authority on what is actually pushed; the
local `origin/main` ref is not, until a fetch. Also note `git checkout <file>`
discards an UNCOMMITTED fix; save a copy or commit before injecting a red-proof.

### 2. THE CLONE IS SHALLOW — any history measurement is silently 50x wrong

**New this wake, and it nearly put a false claim into ROADMAP.md.** The cloud
checkout is a shallow clone with a graft boundary, so the oldest commit it holds
has **no parents** and appears to ADD every file in the repo.

```
git rev-parse --is-shallow-repository     # -> true, on a fresh container
git fetch --unshallow origin              # 31 seconds, 50 commits -> 1,443
```

Before the unshallow, a 24-hour `git log --numstat` over `apps/docs/src/pages`
reported **+23,926/-39**; the truth is **+482/-90**. Nothing errors. The tell
was a root commit dated one day ago whose subject was an ordinary refactor.
**Unshallow before measuring anything from history**, including churn, blame,
"in the last N days", or a file's age. (Checked and NOT a problem:
`polish_requeue.py` uses `git ls-tree`/`hash-object` on the working tree, never
a historical commit, so rule 6 is shallow-safe.)

### 3. `astro build` does not clear `dist`, and `git checkout <sha> -- <dir>`
does not DELETE

Both bit while building the nine-day series for 158.2, and both fail silently:

- An older source tree built over a newer `dist` left 36 stale pages behind and
  reported 127 pages for 91 sources. The tell was the *identical* page count
  across eight different days. `rm -rf apps/docs/dist` first.
- `git checkout <sha> -- apps/docs/src` only adds and updates; files the old
  tree lacks stay on disk. Correct form is `rm -rf <dir> && git checkout <sha>
  -- <dir>`, and afterwards `git reset -- <paths>` for files the old tree had
  and HEAD does not, or they linger staged as added-then-deleted.

## Cloud-wake toolchain — what works, in order

```
npm ci                                                    # no node_modules at start
export CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
```

**`CHROME_PATH` does not persist between shell invocations** — each `Bash` call
is a fresh shell, and `npm run docs:build` fails partway (after Astro renders,
in a browser gate) without it. Export it in the SAME command as the build.
Everything ran green from there this wake: `build -w @busy-office/ui`,
`test -w @busy-office/ui` (137), `docs:build`, `check:claims` (139),
`check:repo`, `check:layout` (127 pages), `test:axe` (127 x 2).

## ⚠ THIS WAS A CLOUD WAKE — WHAT WAS NOT LOOKED AT

No Podman, no `localhost:8081`, no screenshots at 1440px/390px in light and
dark. **Nothing in this wake's diff is visual** — it is `ROADMAP.md` and
`LOOPS.md` only, no CSS, no docs page, no script — so the risk from THIS wake is
structurally zero.

**Still unlooked-at by a human, carried forward:**

- `DsaScore.astro` and `concepts/which-pattern.astro` each gained
  `<span class="bo-badge">generated</span>` inside an existing `<h2>` last wake.
  `DsaScore` renders on 38 pages, so if the badge wraps badly it wraps in 38
  places. First local wake: glance at one component page's "Design-system
  alignment" heading at 390px.
- The `#markers` table on `/components/data-table` at 390px, both themes —
  now four wakes back.

## Counters after this wake — Standardize is OVERDUE, measured not predicted

```
python3 scripts/loops/dispatch_status.py
  Standardize   4 / 4 Continue rounds since 2026-08-27 18:57   OVERDUE
  Objective     2 / 3 slices          since 2026-08-27 19:43   ok  [158, 159]
```

**Rule 2 fires on the next wake: dispatch Standardize.** Last wake's handover
predicted this and was wrong — it read 3/4 and reasoned that the *next* round
would make it 4. The rule is evaluated against the count that exists at dispatch
time, so 3 meant rule 2 did not fire and rule 4 dispatched Continue. It is 4
now, and `dispatch_status.py` says `OVERDUE` rather than `ok`, which is the only
form of this claim worth trusting. Run the command; do not carry the forecast.

Standardize's step 1 now wants **two** sweeps, neither of them a CI gate:
`npm run scan:dead-style -w docs`, and — new, from 158.2 —
`npm run report:prose -w docs`, recording a verdict for any page over 2x its
FAMILY median that has none. **Three are waiting on day one**, which is the
base-rate check that says the mechanism is not ceremony: `/base/motion/`,
`/concepts/js-behaviors/`, `/concepts/design-language/`. 158.1 verdicted the
twelve over the CORPUS median; these three the family split adds and nobody has
read.

After Standardize, rule 4's oldest still-open item is **159.1**.

## What landed this wake

**Continue (rule 4), 158.2 — the loop's own prose discipline, decided.**
Dispatch went to rule 4 because rules 2 and 3 measured 3/4 and 2/3.

- **The premise reproduces exactly** (+482/-90 over `apps/docs/src/pages`,
  +283/-51 on `concepts/layouts`, in the 24h window ending at the commit that
  wrote it) — and the command is now recorded next to it, which it lacked.
- **Lines were the wrong unit, and the hypothesis was wrong.** The expectation
  was that layouts' +283 lines were markup and in-file data, since
  `report:prose` drops `<pre>` whole. Measured: that page went **808 → 1,488
  reader-facing words**, and the +589/-130 line delta across six pages produced
  **+2,020 words**. Lines under-report here.
- **Nine daily builds, same instrument each time.** On the **89 pages present
  throughout**, prose went **51,051 → 77,080 words (+51%)** and the **minimum
  8-day delta across all 89 is exactly 0** — 71 grew, 18 flat, 0 shrank, at
  every threshold tried. Pages *do* shrink day to day (12 in one window, worst
  −52 on `/components/prose/`), so the comparator can report negative; the net
  never is. Reconciled independently against `report:prose`'s own totals
  (104,606 over 127 dist pages here vs 104,408 over 118 there — exactly the 9
  excluded artefact pages).
- **Decision: refuse the budget again, adopt a cadence.** A budget would have
  fired on 71 of 89 pages. `report:prose` joins `scan:dead-style` in
  Standardize's step 1 — existing instrument, existing hook, no new gate, no new
  file, no new ledger. Per CLAUDE.md 94.11 this is deliberately the rubric a
  human scores rather than a gate, and it says so.
- **Three instruments were wrong before any of that was true** — the three traps
  at the top of this file. That is the base rate holding at 3-for-3 in one wake.

**Noticed, not chased.** `dispatch_status.py` reports 973 iterations where
`rebuild_from_log` reports more — its `ROW` regex requires `\w+` for both loop
and mode, so six legacy rows do not match. Does not affect either counter's
verdict. Left alone deliberately, third wake running.

## Still open, and why

- **159.1** — `report-reach` prints the verdict where one exists. The verdicts
  already exist in `.roundtable/grill-objective-149-152-2026-08-27.md`; do not
  re-derive them, and do not make them a third exemption bucket.
- **160.1** — OWNER CALL on named products (below).
- **112.3** — the pattern-fit pilot. BLOCKED ON OWNER: needs 5–8 owner-written
  screen briefs with sealed picks; scaffold ready at `.roundtable/pilot-112/`.
- **112.4** — Screen Contract layer, gated on 112.3's verdict.
- **AT runtime evidence** — needs a human listening to a screen reader.

**One decision waiting, not a roadmap item.** `@busy-office/create-ui` is built,
gated and committed but **NOT published**, so `npm create @busy-office/ui` works
only from this repo. Publishing is owner-triggered, as every release is.

## Standing owner instruction (2026-08-27)

**No external product is named in any document in this repo.** Describe the
mechanism instead ("a high-traffic market-data site", "an open-source ERP
desk"), or cite the standard when a finding is normative. Enforced by
`check:vendor-names` in `check:repo` — it is a denylist and therefore catches
regrowth, not every conceivable name, so the judgement is still yours. **Slice
160 measures exactly how far past the denylist this reaches and asks the owner
where the line is; until that is answered, do not scrub design-system
citations.**
