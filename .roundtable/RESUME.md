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

Last updated 2026-08-31 (**cloud** wake). Working tree clean at hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 3 at hand-off, unchanged
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
```

The open set is **unchanged at 3** — this wake closed a *new* slice rather than
one of them. All three remain undispatchable; the table is below.

## What landed this wake

**Slice 230.1 — LANDED**, dispatcher rule 2 (Standardize), on the **"or drift
flagged"** trigger rather than the counter. The diff is
`apps/docs/src/pages/concepts/cascade.astro` (**41 / 0**) and `ROADMAP.md`
(**136 / 0**), read from the index rather than the working tree.

`concepts/cascade.astro` regex-parsed the z-index scale out of
`tokens/z-index.css` into a `<tbody>` with no assertion, so a zero-match parse
renders an **empty table** — silence, not a wrong figure, which is why three
wakes read past it.

- **The base rate is what classified it.** Of the 6 docs pages that regex-parse
  a source file at build time, **5 already throw** on a bad parse
  (`palettes`, `primitives`, `icon`, `ai-assistants`, `tokens`). `cascade` was
  the sole one-off — a consolidation, not a new idea. `scale.astro` and
  `index.astro` match the `readFileSync` needle but take only a byte/gzip
  length, so they are outside the population.
- **Reconciled against the shipped `tokens.min`, not a hand-typed floor** — two
  independent derivations of one fact, `icon.astro`'s shape. `z-index.css`'s
  rationale comment NAMES four of the five tokens in prose, so a raw source
  count would trip on its own explanation; `tokens.min.css` carries **0**
  comment openers (measured), so no stripping step was invented.
- **Red-proved twice, injection confirmed present each time.** Zero-match
  (prefix renamed in source only; 5 renamed, 0 remaining) → exit 1. **Value
  drift** (`--bo-z-toast` 1600 → 1700, source only) → exit 1 **at 5 against
  5** — the discriminating case, which a `length < 5` floor would have passed.
- **Refused, measured:** a gate over "a parsing page asserts its parse". The
  re-scan found `lib/semantic-css.ts` already carries a *"parsed zero"* throw,
  so the population is now **6 of 6** — uniformly true, and therefore ceremony
  on roadmap 94.11's own test.

**The four standing lanes — `4 of 4`, all clean:** `scan:dead-style` 0 dead /
1,433 live; `report:css-repeats` **8** groups, the standing eight with no delta;
`report:prose` union of **8** outliers, every one resolving against 158.1's
twelve and 161.1's three **by set membership** (228.1 already recorded the cite
grep as a dead detector); `report_loop_prose.py` with no file changing
accumulate class. Lane 4 needed `git fetch --unshallow origin` first — the
script **refused to report** while shallow, exactly as ENVIRONMENT trap 2 says.
No `.git/shallow.lock` was present, and `is-shallow-repository` read `false`
afterwards, which is the only check that it worked.

**All gates green, exit 0 each**, against the final tree: core `build`, core
`test` (152 in 27 files), `lint:css`, `docs:build`, `check:claims`,
`check:formatting`, `check:layout` (**127** pages), `test:axe` (**127** × 2
widths, zero violations), `check:repo` (`check:slice-refs` **457** citations,
**212** slice numbers).

`check:claims` reads **158 verified live · 3 NOT VERIFIED** — `ENVIRONMENT.md`
§6b, this container's `(pointer: fine) = false`. **Not** a regression; do not
"restore" the zero.

**Not verified, said plainly:** no Podman and no `localhost:8081` here, so the
1440/390 light-and-dark screenshot lane could not run. The change adds a
build-time assertion and emits no new markup — the rendered table still carries
all five rows, asserted by re-reading the built HTML — so nothing in it rests on
a rendered image.

## Dispatcher state at hand-off

```
python3 scripts/loops/dispatch_status.py
```

```
Standardize   0 / 4 Continue rounds  since 2026-08-31 13:03   ok
Objective     2 / 3 slices           since 2026-08-31 02:50   ok  [229, 230]
Optimize      0 wake-date(s) newer   since 2026-08-31 08:41   ok  [newest pair: axe-violations]
```

**This is the Step 0b comparison — the counter read immediately after recording
— and both moved as predicted.** Rule 2 reset **3 → 0** because a `Standardize`
row discharges it. Rule 3 went **1 → 2 `[229, 230]`** because Standardize closes
a slice (161.4's decision, and this is that rule paying out). No starved
counter; re-run it rather than trusting this snapshot.

**How rules 1-4 were answered, so the next wake need not re-derive them:**

| rule | reading |
|---|---|
| 1 P0 | none open — the 3 open items are owner- or hardware-blocked; GitHub intake `list_issues` OPEN → `totalCount: 0` |
| 2 Standardize | counter **3 / 4 — did not fire**; **dispatched on "or drift flagged"** |
| 3 Objective | **1 / 3 — ok**, `[229]` at Step 0b |
| 4 build item | not reached |

**The open set is 3, and NONE is dispatchable** (rule 4's kind-of-blocked
distinction, which `LOOPS.md` keeps in the durable playbook precisely because it
did not survive a rewrite of this file):

| item | kind of blocked |
|---|---|
| `112.3` pattern-fit pilot (oldest open) | owner-blocked — briefs + four answers |
| `112.4` Screen Contract layer | owner-blocked — on 112.3's verdict |
| AT runtime evidence | hardware-blocked — owner hardware |

**None is browser-blocked**, so this is not the mis-sort `LOOPS.md` rule 4 warns
about: a local wake has nothing here a cloud wake lacks.

## ⚠ The drift flag that unblocked this wake is now SPENT — read before dispatching

The previous hand-off recorded that rule 2 can no longer advance on its own:
`dispatch_status.py:249` counts it with
`sum(1 for r in after if r["loop"] == "Continue")`, Continue is reachable only
through rule 1 or rule 4, and **rule 4's dispatchable set is empty**. That is
still true, and the counter has just reset to **0 / 4**.

**What changed is that the escape is used up.** Rule 2's other trigger — "or
drift flagged" — fired this wake on the `cascade.astro` drift that had been
carried unactioned for three wakes. That drift is now fixed, the re-scan for its
shape came back clean, and **no drift is flagged at hand-off**. So unless a wake
spots a new one, rules 1-4 are all unreachable and the next wake falls through
to **rule 6, Polish** — whose predicate is true of 19 of 19 surfaces and always
has been (176.2). Run `python3 scripts/loops/polish_requeue.py --apply` before
evaluating it, per the playbook.

Rule 3 sits at **2 / 3**: one more closed slice arms an Objective grill, and
only Continue or Standardize can close one.

## Direction

**No new input arrived**: no open GitHub issues (`list_issues` OPEN →
`totalCount: 0`), and no owner message since the last wake. Step 1 had nothing
to triage, so no `Roadmap · plan` row exists.

**The loop is still out of work no human is blocking, and this wake does not
change that** — it found one more piece of self-maintenance, which is what
Standardize is for. All three open items need the owner (112.3's briefs and four
answers, 112.4's dependency on that verdict) or the owner's hardware (AT runtime
evidence). This is the second consecutive wake where the *whole* open set is
owner- or hardware-blocked.

**No sweep is due, and the share was NOT re-measured this wake.** `ROADMAP.md` is
at **2,291** lines, up from 2,155 — the growth is Slice 230 itself. The previous
hand-off measured the closed-history share at **31.6%** against the 62.4% that
triggered the seventh sweep, and noted that **529 of its 682** resident-closed
lines were Slice 229 alone, with the live file otherwise almost all pointer
stubs. Adding one open-then-closed slice does not move that structure toward a
sweep, so re-deriving it here would spend a round to confirm the same answer.

**That is a deferral, not a measurement — say so rather than quoting 31.6% as
current.** The previous hand-off already flagged that its probe was a scratchpad
throwaway and was not committed, which is the failure 229.4 filed against 227.2,
and it named the trigger: **if a wake needs this share a third time, that is the
signal to commit the script** rather than re-derive it from the four
classification rules a fourth time. This wake is the second pass on that
counter.
