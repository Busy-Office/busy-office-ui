# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and two advisory checks run from `record_iteration.py` — the charter
> check and `check:resume-slice-ids`. Both REPORT on stderr; neither fails a
> build (roadmap 175.3). **`check:resume-slice-ids` fired this wake, correctly**
> — it named `240.1`, which this wake closed while the file still called it
> open. That is the check doing its job at the moment of the rewrite.

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

---

## In flight: nothing

Last updated 2026-09-02 (**cloud** wake). Working tree clean at hand-off; two
commits — `e20b2b78` (the 240.1 closure) and the bookkeeping commit carrying
this file — pushed.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 4 at hand-off, across 3 slices
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope + 236.2's lane
```

## ⚠ READ THIS FIRST: rule 4 has a CLOUD-dispatchable item — 241.2

**This is the change that matters this wake.** The last hand-off said a cloud
wake had to fall through to rule 6. It does not any more. `241.2` needs no
Podman, no owner and no second agent: it is a decision about one gate, and its
Accept explicitly permits closing it as *"stays ungated, here is why"*.

- **Any wake, cloud or local: take `241.2`.** It is the oldest *dispatchable*
  item. Do not fall through to rule 6.
- The other three are unchanged and genuinely blocked — see the Direction table.

**And read the correction this wake had to make, because the same shape will
recur.** The previous hand-off classified `240.1` browser-blocked. It was not:
its Accept criterion 1 is a **disjunction**, and only branch 1 (convert the
chevron) needs a screenshot. Branch 2 — record why the mask technique is wrong —
is a DOM/pixel measurement, squarely inside `ENVIRONMENT.md`'s "can run" list.
**When declining an item as browser-blocked, check every branch of its Accept,
not the headline.** `LOOPS.md` rule 4 records the item-level version of this
mistake costing four wakes on 173.2; this was the branch-level version, and it
cost one.

## Dispatcher counters, read immediately after recording (Step 0b)

```
Standardize   2 / 4 Continue rounds  since 2026-09-01 12:05   ok
Objective     2 / 3 slices           since 2026-09-01 15:42   ok  [238, 241]
Optimize      0 wake-date(s) newer   since 2026-09-02 01:46   ok  [newest pair: axe-violations]
```

**Both counters advanced this wake** — the Continue row naming Slice 241 moved
Standardize 1 → 2 and Objective 1 → 2. Objective arms at **3**, so it is one
slice away; expect it to preempt rule 4 next wake or the one after.

**Rule 5 is `ok`, not STALE, and it was genuinely evaluated**: `axe-violations`
reads `0.0 → 0.0 → 0.0` across three consecutive runs. **Do not read
`bundle-gz-kb`** — it and eleven other names are 13+ days stale and its
`10.8 → 11.6 → 11.7` *looks* exactly like a rule-5 trigger. Not evaluable. The
one absolute size budget that IS live (`RF_BUDGET_KB = 40`) is asserted inside
`npm run build -w @busy-office/ui`, which passed.

## The archive sweep signal: still Standardize's lane, now at 2 / 4

`roadmap_scope.py` read closed-history share **715 / 2,328 = 30.7%** with targets
`[240, 239, 238, 237]` and **no target named by a still-open item**, so 236.2's
lane is clear. Re-run it — the denominator moves every wake.

**The share jumped 25.2% → 30.7% and that is this wake's own doing, not drift**:
closing `240.1` moved all of Slice 240's 155 lines from OPEN to closed history
while Slice 241 added to both sides. Read it from the tool, never by subtracting.
Real lane-4 signal, and it belongs to Standardize at **2 / 4**. Do not
self-dispatch it; it arms on its own.

## What landed this wake

**Continue, build mode, dispatched by rule 4 — the first wake in five not to
fall through to rule 6.** One commit. `240.1` closed on its own second branch.

- **Four routes to a tokenised select chevron, measured in headless Chrome, all
  refuted**, each against a control that must paint:
  `stroke='currentColor'` → **0 red px, 6 px BLACK** against a pure-red host;
  `stroke='var(…)'` → **0 px at all**; `mask-image` on `.bo-select` →
  **1010 → 22** painted px on a 240×36 control (border, surface and option text
  erased); a mask on `.bo-select::before` → **0 px**, `<select>` generating no
  pseudo box, against **1080** for the identical rule on a `<div>`.
- **Two facts underneath them**: an SVG in a `data:` URI is a separate document,
  and `icon.css`'s technique needs an element whose whole box IS the glyph. The
  only route left is a wrapper element around every select — refused as widening
  the public API. Disclosed in `select.css`'s comment (stripped from
  `index.min.css`, so it ships nothing) and in the `form · colour` cite.
- **The instrument's first output was wrong, exactly as the base rate says.**
  The first clip caught the control's border, whose shipped colour is *also*
  `#6b7280`, so chevron and border were one indistinguishable count of 44-50 px
  and the reading that mattered — *is any pixel red?* — was buried. Forcing the
  border green and insetting the clip by 2px separated them at 6 px exactly.
- **The tree-side hex count was protected before the edit, not after.** The
  disclosure comment deliberately contains no `%23`, because the cite's claim is
  checked with `grep -c "%23" select.css`; it read **2** before and **2** after.

**Filed, not built: `241.2`.** The chevron reads **4.83:1** light and
**11.46:1** dark — both clear WCAG 1.4.11's 3:1 — but **0 of the 36 gated
pairings per theme** covers it, because `check:contrast` takes two token names
and this colour is a literal inside a URI. **The argument against the gate is
recorded in the item with it** (2 literals in 1 file, both passing with margin
since the initial commit, which is thin under 94.11), so the next wake weighs it
rather than rediscovering it. That is the seventh gate refusal in this run of
slices — but note it is a *deferral for a decision*, not a refusal on base rate
like the six before it.

## Gates

**All 17 CI entry points ran green against the committed tree, exit 0 each** —
`build`, `test` (**27 files / 152 tests**), `lint:css`, `docs:build`,
`check:repo` (slice-refs **692 / 223**, ci-ignores **130 / 128**, paths **260**,
vendor-names **559**), `check:claims`, `check:formatting`, `check:scroll`
(**910 containers / 118 pages**), `check:layout` (**127 pages**),
`check:forced-colors`, `test:axe` (**127 × 2, zero violations**),
`check:target-size`, `check:search`, `check:pseudo`, `check:quickstart`,
`check:po-app` (**19 behaviours**), `check -w @busy-office/create-ui`, and
`suite` (**28 screens × 2 widths**).

That is the full list `ENVIRONMENT.md` derives from `ci.yml` — unlike the last
hand-off, which ran 10 and said so. It was worth running all of them here
because the diff touches **shipped CSS**, even though only as a comment.

`check:slice-refs` moving **690 → 692** citations and **222 → 223** headings is
the reconciliation for this wake's one added slice, not a coincidence.

`check:claims` reads **162 verified live · 3 NOT VERIFIED** — ENVIRONMENT §6b,
`(pointer: fine) = false` in this container, and the gate names that cause itself
on each of the three. **Not a regression; do not "restore" the zero.**

## Step 0c: ZERO collisions this wake

`origin/main` stayed at `ba2a6ae1` across both `git fetch origin main` calls —
Step 0 and once immediately before the first commit.

**ENVIRONMENT traps 1 and 2 both bit at Step 0, as usual.** The container started
**DETACHED** (`git branch --show-current` empty — the check that file names as
the actual answer), and `origin/main` arrived as a **forced update**
(`+ 17b3ba6...ba2a6ae`) with the local `main` ref stale at `17b3ba6`, the same
sha as the last two wakes. `git checkout -B main origin/main` fixed it before any
commit existed. Trap 2's `--unshallow` ran clean in one attempt, no
`.git/shallow.lock`, `is-shallow-repository` → `false`, **1,794** commits.

## Direction

**No new input arrived**: GitHub intake `list_issues` OPEN → `totalCount: 0`, and
no owner message. Step 1 had nothing to triage, so this wake recorded no
`Roadmap · plan` row.

**The open set is 4 items across 3 slices, and one is dispatchable by ANY wake:**

| item | kind of blocked |
|---|---|
| AT runtime evidence (Slice 15) | **hardware-blocked** — owner hardware; needs a human listening to a screen reader |
| `112.3` pattern-fit pilot | **owner-blocked** — 5 briefs; `.roundtable/pilot-112/briefs.md` is still the 16-line scaffold, its only commit `e58ea3ca` on **2026-08-23**, never modified since (read from `git log`, not mtime — mtime here is clone time) |
| `112.4` Screen Contract layer | **owner-blocked** — on 112.3's verdict |
| `241.2` chevron contrast gate | **NOT BLOCKED** — decide and close; no browser, no owner, no second agent |

**What is owed to the owner:** unchanged, and now **eight wakes old**. Slice 112's
pilot has been waiting on five briefs since 2026-08-22, and Slice 15's AT evidence
on owner hardware. **Nothing this loop can do closes either.**

What did change: the last several wakes were all the loop's own bookkeeping and
self-measurement, and this one reached **shipped CSS** — `select.css` now
discloses why its two literals cannot be tokenised, backed by four measurements
rather than by an assertion. The disclosure is a comment, so nothing shipped
changed size or rendering; what changed is that the next wake to look at that
file will not re-derive a refutation, and `240.1` will not be re-filed as work a
local wake still owes.

**Not verified, said plainly:** no Podman and no `localhost:8081` here, so the
1440/390 light-and-dark screenshot lane could not run. This wake changed **no
rendering** — the CSS edit is a comment (confirmed absent from
`index.min.css`) and the cite is text — so nothing in it rests on a rendered
image. The one change that DOES reach a rendered page (the longer cite on
`/components/form`) was confirmed present in the built HTML and swept by
`check:layout` (127 pages, no overflow at 390 or 150% zoom) and `test:axe`
(127 × 2, zero violations) executing in this container.

**And the honest limit of the closure:** branch 1 of `240.1` — actually
converting the chevron — was never attempted, and remains impossible for the
reasons measured. If a future wake disbelieves the refusal, the probe is
reproducible in about a minute; the four readings and their controls are in
ROADMAP 241.1.
