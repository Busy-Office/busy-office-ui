# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and two advisory checks run from `record_iteration.py` — the charter
> check and `check:resume-slice-ids`. Both REPORT on stderr; neither fails a
> build (roadmap 175.3).

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

---

## In flight: nothing

Last updated 2026-08-29 (cloud wake, scheduled routine — **rule 4 → Continue,
build, 192.1**). Working tree clean at hand-off; the wake's one commit went out
as one push.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md                # 5 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs       # names the closed ids
```

**No collision this wake.** `git fetch origin main` at Step 0 and again
immediately before the first commit both returned `12711a8` unmoved.

## What landed this wake (2026-08-29, cloud, rule 4 → 192.1)

**192.1 closed on Accept branch (a)** — one paragraph into `CLAUDE.md`'s
existing `## A number you report is load-bearing` section, recording where the
defect lands when one change ships a measured claim beside asserted ones.

**Branch (b) was tested first and failed, which is why (a) was taken rather
than by preference.** Each candidate rule's own stated trigger was applied to
the 173.2 facts; **1 of the 3 defects** is covered by an existing rule (190.2,
by the runtime-claims section) and the placement observation by **none**. The
nearest miss is *"re-verify its siblings"*, whose trigger is *"when one claim
from a session **dies**"* — nothing died here; the measured claim was correct.
The table is in the item.

**n = 2, and instance 2 was found by re-checking this item's own premise** —
which is the rule arriving before it was written, and is the part of this wake
worth carrying forward:

- **173.2** measured a row height live and red-proved it (correct), and
  asserted `18ch` / `3.5rem` beside it. Confirmed from the shipped artefact
  rather than prose about it: `data-table.css:477` and `:495` now record in
  their own comments that both were *"fitted to the single 21-character string
  this framework's own demo carries"*.
- **Slice 193 finding D** re-measured the DOM walk with a red-proof by
  injection (correct) and asserted beside it that *"no enumeration of the built
  site returns its stated 138"*. **It does.**
  `find apps/docs/dist -name 'index.html' | wc -l` returns exactly **138** =
  `distPages({ skipRedirects: false })` **137** + `dist/suite/index.html`,
  established by **set difference on the file lists** (one element), not by
  comparing totals. D's three figures (127 / 137 / 165) reproduce
  character-for-character here, so it was working from an identical build and
  the disagreement is entirely in which enumerations it tried. **The defect is
  D's, not 190.1's.** Corrected in place in `ROADMAP.md` above finding D.

**Counter-evidence kept in both documents.** (i) The tempting stronger claim —
"the reproduced numerator 9 already pinned the denominator to 138" — is
**false**: 9 pages contain both classes under all three of the 127-, 137- and
138-page corpora, so the numerator discriminates between none of them; the
reconciliation rests on the set difference alone. (ii) 190's cross-cut records
185/188 and 187.1 as **clean controls** — neither shipped an asserted claim
beside its mechanism — so the rule fires only on a change carrying both kinds
and is not a claim that every change rots.

**Refused: a gate, and a new `##` section.** A writing rule has no mechanical
form (94.11's line), and `193.1` has *"should CLAUDE.md's eight detector
sections fold"* open — answering 192.1 with a ninth would have argued against
that item while it is unresolved. Cost named in the item instead:
`## A number you report is load-bearing` grows **306 → 508** words, the file
**5,248 → 5,450**, measured with `re.split(r'(?m)^(## .*)$')` + `str.split()`
against `12711a8` (`ENVIRONMENT.md` trap 7 — a bare `wc -w` undercounts this
prose by 2.4-4.5%).

**That one cost figure was wrong twice before it was right, in the write-up of
the rule about it, and both wrong values are kept in the item rather than
patched away.** First `461`, asserted from drafting beside a paragraph whose
every other figure was measured — wrong by 47. Then `501`, measured but taken
**before the last edit to the paragraph**, which reflowed two clauses onto em
dashes — wrong by 7. **The second is the sharper lesson: measuring is not
enough if the measurement predates the final edit.**

## ⚠ THIS WAS A CLOUD WAKE — WHAT WAS NOT LOOKED AT

No Podman, no `localhost:8081`, **no screenshots at 1440px/390px in light and
dark**. Nothing was visually verified and nothing is described as if it were.

**Nothing this wake needed one.** `git diff --stat` names exactly two files,
`CLAUDE.md` and `ROADMAP.md` — no `.css`, no `.astro`. That neither is read by
the docs build was **checked, not assumed**: `gen-llms.mjs` reads `DESIGN.md`,
and `getting-started/ai-assistants.astro` names `CLAUDE.md` only as literal
prose inside a `<code>` tag. So `dist` is unchanged by this diff and the
browser gates below apply to it.

Gates green on `c75d721e`: core `build` + `test` (**146** passed), `docs:build`,
`check:repo` (selftests **45 gates, 16 heuristic all self-tested**; slice-refs
**394** citations / **176** slice numbers; dist-walkers 63 scripts),
`check:claims` **144**, `check:layout` **127** pages, `test:axe` **127 pages ×
2 widths, zero violations**.

No `verifier` agent is available in this session, so the staged diff was read by
hand — said plainly rather than logged as a verifier pass.

**Traps exercised for real this wake:** 1 (the container started **detached** —
`git branch --show-current` was empty and `git rev-parse --verify main` resolved
to the stale pre-rebase `17b3ba67`; repaired with `git checkout -B main
origin/main` **before** the first commit, which is what trap 1 says the check is
for), 1c (`CHROME_PATH` exported in the same command as every browser gate),
2 (unshallowed before any history figure: **1,614** commits), 6 (a background
gate chain's output file sat at **0 bytes** for its whole run — read as
*still running*, per the trap, and the three gates were then re-run in the
foreground to get definite output).

## Counters after this wake

Verified after recording: **1122** iterations by the parser against a raw
`grep -c "^- "` of **1122**.

```
Standardize   1 / 4 Continue round   ok
Objective     3 / 3 slices           OVERDUE  [190, 191, 192]
Optimize      0 wake-date(s) newer   ok   [newest pair: axe-violations]
```

**Rule 5's instrument is NOT stale this wake** — `0 wake-date(s) newer`, which
is the first non-stale reading recorded here. It reports clear, so rule 5 was
answerable and found nothing.

**No metric recorded**, deliberately: every figure this wake is a one-off
characterisation (a section word count, a corpus enumeration), not a repeatable
sample under an existing name, and a single-sample name pads the store rule 5
reads (184's discipline).

## What the next wake should expect

**Rule 3 fires — `Objective 3 / 3 OVERDUE [190, 191, 192]`** — so the next wake
grills that window, not rule 4. Note for that grill: **this wake's own item was
192.1, so 192 is both in the arming set and the slice this wake closed**; and
finding D of 193 was corrected today, so re-measure it rather than quoting
either version.

Checkboxes at hand-off — re-count rather than copying:

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md      # 5
```

| item | blocked on | which list does it need? |
|---|---|---|
| `15.12` | **owner-blocked** (owner hardware, AT runtime) | neither; no wake can take it |
| `112.3`, `112.4` | **owner-blocked** (briefs; `112.4` waits on `112.3`) | neither |
| `193.1` | nothing | cloud-takeable — execute 167.1's reopen on `CLAUDE.md`; **folding nothing closes it** |
| `193.2` | nothing | cloud-takeable — one measurement and a decision; **refusing a mechanism is the expected outcome** |

Oldest still-open is `15.12`, then `112.3`/`112.4`, all owner-blocked — so the
oldest *dispatchable* one is **`193.1`**, should rule 4 be reached. Say **which
kind** of blocked when reporting rule 4 as finding nothing (`LOOPS.md` rule 4:
owner-blocked / browser-blocked / agent-blocked), and for a browser-blocked one
name which of `ENVIRONMENT.md`'s two lists it needs.

**`193.1` got harder to answer honestly this wake, and that is worth knowing
before dispatching it.** It asks whether `CLAUDE.md`'s eight detector-facing
`##` sections should fold. This wake **grew one of them by 202 words** while
deliberately not adding a ninth. The section count is unchanged at **17 `##`
sections**; the argument for folding is stronger by exactly this paragraph.

**Both remaining dispatchable items are still "decide whether accumulated prose
folds"** — `193.1` and `193.2`, i.e. 2 of the 5 open and 2 of the 2 takeable.
The last hand-off counted three (`191.3`, `192.1`, `193.1`) of its eight open;
`191.3` and now `192.1` have closed, and `192.1` closed by *adding* prose with
the cost named, which is a data point for `193.1` rather than a precedent for it.

**Two blind re-scores are still owed and neither can be done in a cloud wake**
(§3b step 4 needs a second agent): `scan`'s three fixed dimensions, and
`skeleton · colour`. Unchanged by this wake.

**Do not re-raise Slice 179's or 182.2's refusals, 176.3, or the retired
product-vs-machinery ratio**, which the owner or a prior grill closed. Re-measure
before reopening anything.

**Adjudicated at hand-off, which is the step `check:resume-slice-ids` exists to
prompt.** The ids this file names in backticks that `ROADMAP.md` records `[x]`
closed are **six** — `192.1`, `190.1`, `190.2`, `191.3`, `173.2`, `185.1` (down
from the previous hand-off's 10) — and every one is a **historical reference**,
none a claim that any is open: `192.1` is what landed, `190.1`/`173.2` are the
worked examples the new paragraph cites, `190.2` is the one defect an existing
rule already covered, `191.3` is named only as an item that closed since the
last hand-off, and `185.1` is quoted in the Direction read. (`164.3` and `168.1`
are named too and are archived, which the check reports separately and does not
treat as a finding.) The genuinely open ids — `15.12`, `112.3`, `112.4`, `193.1`, `193.2` —
are in the table above and are **not** among them, which is the check agreeing
with the table.

## Direction — the owner's pick, and whether THIS wake advanced it

**Standing section, added by 168.1 (2026-08-28). Answer all four every wake,
from the sources named — never by copying the answers above you.**

- **Direction:** (a) adoption/DX — finish it by publishing
  `@busy-office/create-ui`. Source: the `DECISION (owner, 2026-08-28)` block in
  Slice 164.3, which lives in **`ROADMAP-archive.md`**, not `ROADMAP.md`. Read it
  there; a pointer that disagrees with its source loses.
- **Remaining step, and who it waits on.** The publish is done (`npm view
  @busy-office/create-ui version` → `0.1.0`) and the release workflow ships it.
  What is left is **one thing this loop cannot check from here: whether
  `@busy-office/create-ui` has a Trusted Publisher configured on npmjs.com.**
  **Stated as unknown, not as done.** If it is not set, the first release
  publishes core and then fails on create-ui's publish step; the workflow's
  comments carry the recovery. A release cannot even be *attempted* today
  without a version bump — `check-publishable.mjs` exits 1 on both packages, by
  design.
- **Did this wake advance it?** **No.** Rule 4 dispatched a documentation item
  about measurement discipline; nothing in the diff touches either package.
- **Work rows since the direction was decided that did not advance it:** derive
  it, do not increment. **Derived this wake, after this wake's row was
  committed: 68 non-Meta work rows since `fb15cdc`; the needle matches 6;
  reading them, `164.3`, the `0.1.0` release and `185.1` advance the direction,
  while `168.1`, the `173.2`/`185` triage and `186` narrate or detect it — so
  65 of 68 did not.** *(Last honest reads: 61 of 64, 56 of 59, 55 of 58, 52 of
  55, 49 of 52, 46 of 47, 43 of 44, 41 of 42, 38 of 39.)*

  ```
  # `git diff fb15cdc..HEAD` MISSES the current wake's rows until they are
  # committed; drop the `..HEAD` to diff the working tree instead.
  git diff fb15cdc -- .roundtable/loop-log.md | grep '^+- ' \
    | grep -v ' · Meta · ' | grep create-ui        # print them, don't -c them
  ```

  Left as a two-line read rather than a smarter regex on purpose: any needle
  that tries to separate "advanced" from "mentioned" is guessing at intent from
  prose, which is the semantic-vs-shape line CLAUDE.md draws (94.11).
- **Is that ratio a PROBLEM? No — the owner was shown it and decided otherwise
  (2026-08-28)**, choosing to keep the routine running hourly. Do not re-triage
  it and do not slow the routine on your own judgement.

```
npm view @busy-office/create-ui version     # 0.1.0
npm view @busy-office/ui version            # 0.5.0
node packages/core/scripts/check-publishable.mjs packages/core packages/create-ui
  # exits 1 today: both versions are already on the registry. That is the gate
  # working, not a fault — a release needs a bump first.

# fb15cdc is the commit carrying the owner's decision. UNSHALLOW FIRST
# (ENVIRONMENT.md trap 2) or these resolve nothing and the rate is silently
# missing, not wrong.
```

**These commands are about to age, and the next owner decision is what ages
them.** The `npm view` lines no longer test a blockage — they confirm a publish —
and the direction's last open question is a setting on npmjs.com rather than
anything in this tree. When the owner picks a direction beyond "wire the front
door into the release", rewrite them; do not reinterpret them.
