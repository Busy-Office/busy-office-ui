# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and two advisory checks run from `record_iteration.py` — the charter
> check and `check:resume-slice-ids`. Both REPORT on stderr; neither fails a
> build (roadmap 175.3). Run both against the file as it now stands rather
> than trusting a stale reading.

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

**Citation practice for this file: cite by slice number only, never by raw
`ROADMAP.md:NN`.** A slice number survives every rewrite; a line number
survives none.

---

## In flight: nothing

Last updated 2026-09-03 (**cloud** wake, scheduled routine). Working tree clean
at hand-off. Two commits this wake, both pushed: Slice 249.8 and this hand-off.

**`check:resume-slice-ids` will name `249.3` and `249.8` as closed — both are
deliberate.** Neither appears below as open, blocked or queued: `249.8` only as
*what this wake closed*, `249.3` only as the dependency that is no longer
blocking `249.9`.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## Direction

Nothing new from the owner this wake, and nothing owner-facing is newly
blocked. The two standing owner blocks are unchanged: Slice 15's `AT runtime
evidence` (owner hardware) and `112.3`/`112.4` (owner briefs, then 112.3's
verdict).

**One thing the owner may want to weigh, not blocking.** 249.8 moved each
component's sidebar label, group and rank into its own CSS header, so the
docs IA is now editable one component at a time rather than in one array. The
taxonomy itself — the eight categories in `extract-api.mjs`'s `CATEGORIES` —
is unchanged and is still the 2026-08-16 docs-IA pass's grouping. If that
grouping is ever revisited, it is now a one-line edit per component plus the
list, not a re-sort of a 43-entry array.

## Dispatch counters at hand-off

Read `dispatch_status.py` yourself — the sets below are snapshots.

- **Rule 2 (Standardize)** read `2 / 4` at wake start; **`3 / 4`** after this
  wake's Continue row. One more Continue round arms it.
- **Rule 3 (Objective)** read `1 / 3 [249]` at wake start and **unchanged** —
  249.8 closed an ITEM, and 249 was already counted; the counter is per slice.
- **Rule 5 (Optimize)** read `ok` (not STALE). **No sample was recorded this
  wake, deliberately:** `check:size` reports the shipped payload unchanged in
  every budget bucket, because the four new header comments per component are
  stripped by cssnano — no `.min.css` in `dist` differs by a byte (measured, in
  249.8's entry). A `bundle-gz-kb` reading could only reproduce the existing
  value.

## Next wake

Rules 1-3 are clear, so expect **rule 4** again. Open set `OPEN: [15, 112, 249,
256]`, **12** open items (was 13).

The oldest two are unchanged and both are still open on purpose — read their
ROADMAP entries before re-dispatching either:

- **`249.6` is browser-blocked in the SCREENSHOT sense** (`LOOPS.md` 186.2's
  vocabulary) — a LOCAL wake can take it, a cloud wake should not. It costs
  three rendered screens plus a new block on the landing page.
- **`249.7` is open as a COST question, not as unstarted work.** Its Accept's
  first clause has been executed: 4 of the 5 seed rows do not reproduce. Do not
  re-run that grep — the table is in the item. Settling it before the owner
  answers `249.10` would decide it on the thinnest possible input.

**`249.9` is newly unblocked** — both its dependencies are now closed (`249.8`
this wake, `249.3` earlier the same day). It is the next item in age order after
those two, and it is **browser-blocked in the screenshot sense**: it builds a
new `/components/` catalogue page whose whole point is rendered miniature
previews. A LOCAL wake should take it. Its Accept's second half — *"the
miniature-rendering build-time cost is measured and stated before this closes"*
— is measurable anywhere, so a cloud wake could usefully measure and record that
number without building the page.

**So the cheapest genuinely cloud-dispatchable item is `256.2`**: a five-line
allow-list decision on `check:floor`'s stated exemption, plus a two-sided
red-proof, no browser.

- Slice 15's `AT runtime evidence` and `112.3`/`112.4` are **owner-blocked**.
- `249.10`, `249.11`, `249.13` are owner calls; `249.12` is owner-or-
  architecture, low urgency.
- **`249.15` is browser-blocked in the screenshot sense** (a static OG image) —
  a cloud wake should NOT pick it up.

## The archive sweep: not due, do not re-raise

`roadmap_scope.py` reads closed-history share **714 / 3,334 = 21.4%** at
hand-off — well under the **55.1%** at which 252.1 dispatched the tenth sweep on
2026-09-03. It read 22.1% at wake start; the share FELL again for the same
arithmetic reason as the last two wakes: this wake's ~96 new ROADMAP lines went
into the live denominator while Slice 249 stays open, so none of them counts as
closed history. That is arithmetic, not progress. Eligible targets
`[255, 254, 253, 252, 237]`, of which 253 and 237 are named by the open Slice
249 and stay per 236.2. Re-run the script; these are snapshots.

## What landed this wake

**One commit of substance, dispatched by rule 4.** Rule 1 clear (no open P0;
GitHub intake `totalCount: 0`); Step 1 triaged and committed nothing — no new
input. Rules 2 (2/4), 3 (1/3) and 5 (`ok`, no regression) did not fire.

### Slice 249.8 — the sidebar and the homepage tiles are generated now

`@tagline`/`@category` (required) and `@label`/`@order` (optional) live in each
component's CSS header; `extract-api.mjs` lifts them into `api.json` and
**throws naming the file** without the required two. The 43-entry sidebar array
and the five tile strings are gone; `apps/docs/src/data/component-nav.mjs` is
the one module that builds both, with 4 documented extras. `new:component`
stamps the header and edits no shared file.

**Four findings worth carrying, none of them the headline:**

1. **The item's premise was half wrong, in its own favour.** Only the sidebar
   was policed, one-way. The tile prose was policed by nothing at all, and had
   already drifted (its "Actions" tile listed Combobox, a Data-input component).
   The commands are in the ROADMAP entry.

2. **A red-proof came back green and found a PRE-EXISTING blind spot.**
   `check-page-shape`'s sidebar arm looped over `src/css/components/*`, so
   `inline-editing` and `table-toolbar` — the two docs pages with no CSS
   directory — had never been reachability-checked. The arm walks the pages
   now (41). This is CLAUDE.md's "a green red-proof is a defect in the
   injection until proven otherwise" landing the *other* way: the injection was
   fine and the gate really could not see it.

3. **My first red-proof harness was broken, and it manufactured two reds.**
   `git checkout -- <file>` restores the *committed* file, which did not carry
   the new header yet — so two "gate went red" results were red because the
   header had vanished, not because of the injection. Redone against a real
   `cp` backup. Worth naming: reverting with git inside a wake that is ADDING
   content to a file is not a revert, it is a deletion.

4. **A measurement of mine was a dead detector and is discarded.** The tile
   probe reported "zero prose overflow" before and after; a `<p>` shrink-wraps,
   so 400 unbreakable characters (injection confirmed) still read **0**. The
   card-height numbers from the same probe ARE live (they moved). Overflow is
   covered by `check:layout` and `check:scroll` instead.

**Not verified, and named rather than implied:** cloud wake, so the 1440/390
light-and-dark screenshot lane could not run. **137 of 138 built HTML pages are
byte-identical to the pre-change build**, so nothing on them can have moved; the
one that differs is `index.html`, and its tile cards were measured live in
headless Chrome at both widths (grid height 281 -> 281 at 1440, 854 -> 854 at
390). All **17** CI entry points, re-derived from `ci.yml`, ran green here.
