# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and two advisory checks run from `record_iteration.py` — the charter
> check and `check:resume-slice-ids`. Both REPORT on stderr; neither fails a
> build (roadmap 175.3). **Neither fired this wake.**

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

---

## In flight: nothing

Last updated 2026-09-02 (**cloud** wake). Working tree clean at hand-off; two
commits — `044f2e0a` (the Polish round) and the bookkeeping commit carrying this
file — pushed.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 4 at hand-off, across 3 slices
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope + 236.2's lane
```

## ⚠ READ THIS FIRST: rule 4 is no longer empty — 240.1 is BROWSER-BLOCKED

**This is the change that matters this wake.** For the last several wakes rule 4
found three open items and all three were owner- or hardware-blocked, so every
wake fell through to rule 6. **240.1 is different: it is browser-blocked in the
screenshot sense, which LOOPS.md rule 4 says a LOCAL wake can take.**

So the next wake's rule 4 has real product work in it, and the answer depends on
where the wake is running:

- **A local wake (Podman available): take 240.1.** It is the oldest *dispatchable*
  item. Do not fall through to rule 6.
- **A cloud wake: 240.1 is still not takeable** — its evidence is a rendered
  image at 1440/390 in both themes. Say so and fall through to rule 6, which has
  **5** surfaces queued.

Do not re-report the open set as "all owner-blocked". That was true through
Slice 239 and is not true now. LOOPS.md rule 4 records that exactly this
mis-sort cost four consecutive wakes on 173.2.

## Dispatcher counters, read immediately after recording (Step 0b)

```
Standardize   1 / 4 Continue round   since 2026-09-01 12:05   ok
Objective     1 / 3 slice            since 2026-09-01 15:42   ok  [238]
Optimize      0 wake-date(s) newer   since 2026-09-02 01:46   ok  [newest pair: axe-violations]
```

**Rule 5 is `ok`, not STALE, and it was genuinely evaluated**: `axe-violations`
reads `0.0 → 0.0 → 0.0` across three consecutive runs. **Do not read
`bundle-gz-kb`** — it and eleven other names are 13+ days stale and its
`10.8 → 11.6 → 11.7` *looks* exactly like a rule-5 trigger. Not evaluable. The
one absolute size budget that IS live (`RF_BUDGET_KB = 40`) is asserted inside
`npm run build -w @busy-office/ui`, which passed.

**Polish rows do not advance the Standardize or Objective counters**, which is
correct — LOOPS.md rule 3 counts Continue and Standardize only.

**Do not read `grep -c 'RE-QUEUED' .roundtable/polish-state.md` as the queue
length** — the ledger's prose quotes the marker while narrating past rounds.
`polish_requeue.py --check` is the count; the grep is not. It read **5** at
hand-off (alerts, dashboard, icon, inline-editing, scan); run `--apply` first
regardless, per rule 6.

## The archive sweep signal: still Standardize's lane, at 1 / 4

`roadmap_scope.py` read closed-history share **560 / 2,222 = 25.2%** with targets
`[239, 238, 237]` and **no target named by a still-open item**, so 236.2's lane
is clear. Re-run it — this wake added Slice 240, so the denominator moved. Real
lane-4 signal, and it belongs to Standardize, whose counter reads **1 / 4**. Do
not self-dispatch it from rule 6; it arms on its own.

**The share went DOWN (27.0% → 25.2%) while the file grew, and that is not an
error**: Slice 240 adds 150 lines to the denominator while its own body counts as
OPEN rather than closed history. A sweep-scope number moves on both axes; read it
from the tool, never by subtracting.

## What landed this wake

**Polish, reconcile mode, dispatched by rule 6. One commit. NOT a no-op — a new
arm found the ledger's sixth recorded defect.**

- **The pick was measured, and two instruments disagree.** §3b's tie-break left
  three surfaces at `1/3`; `inline-editing` drops for 217.1's reason, **verified
  rather than assumed** (`dsa-scores.json` has no entry). calendar beat dashboard
  under **both** readings — 239's scored-date boundary (calendar 2 commits
  +18/-2, dashboard 0) and this wake's ledger-stamp reading (dashboard +7/-1 via
  `e034a6eb`, which lands after the stamp but before the boundary). Neither is
  wrong; ROADMAP 240 records both. **My first note this wake that 239's "0/0 did
  not reproduce" was itself wrong** — it was a different instrument, not a bad
  reading.
- **calendar's own six cites all hold**, checked at the source: both `font-size`
  declarations are `var()` tokens, no hex/rgb/hsl in the dir, the holiday dot is
  exactly three `em` numbers. The link `16ed66dd` added to
  `/components/form#dates` **resolves** (`id="dates"` present once on the built
  page) — a fragment the link checker does not verify.
- **The six standing arms reproduce exactly**: 156/80, 360/40, line-number cites
  1 of 40 (re-read *at* `badge.css:42`), content quotes 20/20, css literals
  81/81, bare counts 8/8 → **9/9** with the row added this round.
- **Arm 7 is new — absence claims**, the class arms 4-6 are blind to by
  construction: each verifies that something a cite NAMES is present, and an
  absence claim names nothing. 111 of 240 cites carry an absence word;
  hand-classified to **43 checkable claims across 27 components**. 42 exact.

**The defect: `form · colour` claimed "zero raw hex" and `select.css` has two.**
Wrong **when written**, not decayed — both were present on the 2026-08-23 scoring
date and date to the initial commit. What makes it a defect rather than a wording
preference is that **six sibling components with raw hex all disclose it** and
say why (print-only ×4, mask alpha, masked-and-never-painted); all seven score
`colour: 3`, and form was the only one claiming zero. **Form's two are also the
only PAINTED ones** — `select.css:12` is `background-image`, `icon.css` is
`mask-image` + `currentcolor` — and `check:contrast` cannot see inside a `data:`
URI. Cite corrected; **the CSS fix is 240.1, left open.**

**Arm 7's limitation is stated, not discovered later.** It derives its set from
the cites, so fixing a false claim by rewording removes it from the checked set:
arm 7 read **42/43 before** the fix and **42/42 after**. The delta is the
finding, not the ratio. That is why the corrected claim was moved into arm 6's
fixed `CLAIMS` table, which reports `CITE NO LONGER MATCHES` instead.

**Red-proved four times total**, each injection confirmed present in the copy and
absent from the real tree before the run: arm 7 tree-side (`41/43`), cite-side
(`42/44`, claim count *rising*), cite-shape (43 claims → 42), and arm 6's new row
(`8/9` "cite says two, tree reads 3"; clean control `9/9`).

**No gate proposed — the sixth refusal**, on 94.11's base-rate test: 42/43 before
and 42/42 after is uniformly true, and the check needs a per-phrasing rule (three
today) only a human reading the cite can extend.

**One round this wake, deliberately.** §3b step 1 is one round per surface per
pass, and the arms are **corpus-wide** — running a second round on `alerts` would
re-execute the identical seven arms across the same 40 components and find the
same thing. That is the busywork §3b's own text refuses. Polish's Exit
("every surface dry or budget-spent") has never been satisfiable and the owner
closed that as no-change (176.3); do not re-raise it.

## Gates

**Ten entry points run green against the committed tree, exit 0 each** —
`build`, `test` (**27 files / 152 tests**), `lint:css`, `docs:build`,
`check:repo` (slice-refs **690 / 222**, ci-ignores **130 / 128**, paths **260**,
vendor-names **559**), `check:claims`, `check:formatting`, `check:layout`
(**127 pages**), `test:axe` (**127 × 2, zero violations**), plus
`check:wrong-choice` and `check:dsa-scores` as arms 1 and 2.

`check:slice-refs` moving **687 → 690** citations and **221 → 222** headings is
the reconciliation for this wake's one added slice, not a coincidence.

**Said plainly: that is 10 of the 17 entry points `ENVIRONMENT.md` derives from
`ci.yml`, and the other 7 were NOT run this wake** — `check:scroll`,
`check:forced-colors`, `check:target-size`, `check:search`, `check:pseudo`,
`check:quickstart`, `check:po-app`, `check -w @busy-office/create-ui` and
`suite`. The diff is one cite string in `dsa-scores.json`, `ROADMAP.md` and
`.roundtable/**`; no CSS, no page markup, no behaviour. **Do not carry "all
seventeen green" forward from any hand-off** — that described a different tree.

`check:claims` reads **162 verified live · 3 NOT VERIFIED** — ENVIRONMENT §6b,
`(pointer: fine) = false` in this container, and the gate names that cause itself
on each of the three. **Not a regression; do not "restore" the zero.**

## Step 0c: ZERO collisions this wake

`origin/main` stayed at `e4eae6d6` across both `git fetch origin main` calls —
Step 0 and once immediately before the first commit.

**ENVIRONMENT traps 1 and 2 both bit at Step 0, as usual.** The container started
**DETACHED** (`git branch --show-current` empty — the check that file names as
the actual answer), and `origin/main` arrived as a **forced update**
(`+ 17b3ba6...e4eae6d`) with the local `main` ref stale at `17b3ba6`.
`git checkout -B main origin/main` fixed it before any commit existed. Trap 2's
`--unshallow` ran clean in one attempt, no `.git/shallow.lock`,
`is-shallow-repository` → `false`, **1,792** commits.

**239.3's guard fired and worked.** `polish_requeue.py --apply` is the first loop
script a cloud wake runs, and it exited naming `npm run build -w @busy-office/ui`
instead of a bare `FileNotFoundError` on the missing `dist/api.json`. That fix
landed last wake for exactly this moment.

## Direction

**No new input arrived**: GitHub intake `list_issues` OPEN → `totalCount: 0`, and
no owner message. Step 1 had nothing to triage, so this wake recorded no
`Roadmap · plan` row.

**The open set is 4 items across 3 slices, and one is now dispatchable by a local
wake:**

| item | kind of blocked |
|---|---|
| `112.3` pattern-fit pilot | **owner-blocked** — 5 briefs; `.roundtable/pilot-112/briefs.md` is still the 16-line scaffold, its only commit `e58ea3ca` on **2026-08-23**, never modified since (read from `git log`, not mtime — mtime here is clone time) |
| `112.4` Screen Contract layer | **owner-blocked** — on 112.3's verdict |
| AT runtime evidence (Slice 15) | **hardware-blocked** — owner hardware |
| `240.1` select-chevron raw hex | **browser-blocked** — needs 1440/390 screenshots in both themes; **a local wake can take this** |

**What is owed to the owner:** unchanged, and now **seven wakes old**. Slice 112's
pilot has been waiting on five briefs since 2026-08-22, and Slice 15's AT evidence
on owner hardware. **Nothing this loop can do closes either.**

But the honest shape of the last several wakes has changed slightly this wake, and
it is worth saying precisely. Everything built recently has been the loop's own
bookkeeping and self-measurement. This round is still self-measurement — **but it
produced the first item in weeks that is real product work on shipped CSS**, and
it is blocked only on a screenshot, not on the owner. A local wake can close it
without any owner input. That is a smaller gap than "owner-blocked", and it is the
first one in a while.

**Not verified, said plainly:** no Podman and no `localhost:8081` here, so the
1440/390 light-and-dark screenshot lane could not run. This wake changed **no CSS
and no page markup** — the diff is one cite string, `ROADMAP.md` and
`.roundtable/**`, and the docs site renders the cite as text — so nothing in it
rests on a rendered image. The one change that DOES reach a rendered page (the
cite on `/components/form`) was verified by `check:layout` (127 pages, no
overflow at 390 or 150% zoom) and `test:axe` (127 × 2, zero violations) executing
in this container, and confirmed present in the built HTML. **240.1 was
deliberately not attempted for exactly this reason.**
