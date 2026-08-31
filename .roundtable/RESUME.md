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
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 4 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
```

**The open set went 5 → 4.** One of the two dispatchable items remains
(`229.5`); the other (`229.4`) closed this wake as a landed finding.

## What landed this wake

**Slice 229.4 — LANDED**, dispatcher rule 4 (Continue, build mode). The diff is
**`ROADMAP.md` alone** — no code changed, and no gate was added.

**Rule 4 was reported the way `LOOPS.md` demands, naming which kind of
blocked.** The OLDEST open item is `112.3` and it is **owner-blocked**; `112.4`
is owner-blocked on 112.3's verdict; AT runtime evidence is
**hardware-blocked**. The oldest **dispatchable** item was `229.4`.

**229.4 asked whether 227.2's base rate — "30 files … 50 numeric literals … the
unrestricted form returns 308" — can be re-derived, since the probe that
produced it lived in a scratchpad and was never committed. The answer splits,
and both halves of the Accept were taken.**

- **The file half reduces to a command, and it refutes the 30.** Run against
  **`96bd852a` itself** (the commit that published the number), seven
  defensible scopes span **18 · 23 · 25 · 32 · 33 · 34 · 36** and **none is
  30**. The seven shell lines are recorded in ROADMAP 229.4 and read
  identically at `HEAD`. The three choices the prose leaves open are named
  there: prose files that merely *name* `readFileSync` (32 vs 25 — seven
  markdown files match, `ROADMAP.md` among them), whether a generated `*.json`
  import is a sixth signal or a gloss on the five, and whether `examples/` and
  `packages/core/tests/` are in scope. **229.4's own premise named 18, 23 and
  34 with no command; all three are reachable** and are the 1st, 2nd and 6th
  lines, so its spread holds and now has its commands.
- **The literal half cannot be reduced to a command at all**, which is a deeper
  finding than a lost probe: it needs a **taint implementation** and prose
  cannot pin one. Three defensible versions give **22 / 33 / 61** on one file
  set at one commit; the operator definition and the file set move it over
  **22 … 173** restricted and **324 … 785** unrestricted. **50 is produced by
  none of them, and 308 is below every unrestricted reading taken here.**
- **Which of the three taint versions is right is not a judgement call**, and
  that is what makes the spread evidence rather than hand-waving: 227.2 names
  `primitives.astro:24`, `tokens.astro:81` and `ai-assistants.astro:30` as
  sites of the pattern, and the first two versions score all three **zero** —
  the chain is `readFileSync` → `src` → `primitivesCss` → `KNOBS` →
  `knobs.length < 4`, three hops with the read on a **continuation line**.
- **One driver of the spread is concrete, not mysterious:**
  `examples/po-app/server.mjs` alone contributes **112 of 167** in the widest
  scope — one demo server whose whole body is taint-reachable.

**The sharpest thing this wake produced, and it belongs in the next wake's
hands: a reconstruction that reproduces the target number is a defect in the
reconstruction until proven otherwise.** An early scope here returned **exactly
30**. It was wrong: the generated-json arm used `[^\n]*` in an **ERE**, where a
bracket expression makes that *"any character except backslash or the letter
n"*. `import patterns from '…/patterns.json'` contains an `n` in `patterns`, so
three real importers (`Gallery.astro`, `which-pattern.astro`,
`patterns/index.astro`) were silently dropped and the count landed on the number
being sought. Believing it would have closed this item as "reproduced" on a
broken instrument. **The tell was not the number — it was that the three
missing files were nameable.**

**The probe was red-proved twice by injection before any figure above was
quoted**, both confirmed present by `grep` before the run and reverted after,
with `git status` clean:

```
const probeRatio = iconBytes / 7;      in icon.astro FRONTMATTER (line 41)
   -> restricted 7 -> 8, whole-file 7 -> 8            (the detector is live)
<!-- probe {iconBytes / 7} -->         in the TEMPLATE half (line 122; fence 121)
   -> restricted stayed 7, whole-file 7 -> 8          (the restriction discriminates)
```

**No gate added — a fifth refusal in this family.** The semantic leg was not
shown wrong and is untouched: *"a literal is an operand" is checkable; "a
literal duplicates a fact something else can read" is not.* Every reading here
is **higher** than 30, which 229.4 named in advance as a satisfying outcome that
still refuses. The probe was deliberately **not committed** — it is the
throwaway 227.2 describes, and committing it would add the machinery this item
exists to refuse.

**All required gates green, exit 0 each**, run against the final tree: core
`build`, core `test` (152 in 27 files), `docs:build` (which runs `check:repo` →
`check:slice-refs` **456** citations, `check-markup` 165 files, `check-ci-ignores`),
`check:claims`, `check:formatting`, `check:layout` (**127** pages), `test:axe`
(**127** pages × 2 widths, zero violations), `check:repo`.

`check:claims` reads **158 verified live · 3 NOT VERIFIED**. That is
`ENVIRONMENT.md` §6b — this container reports `(pointer: fine) = false`, so the
three `.bo-btn` press claims cannot discriminate — **not** a regression. Do not
"restore" the zero.

**Not verified, said plainly:** no Podman and no `localhost:8081` here, so the
1440/390 light-and-dark screenshot lane could not run. The item needed neither
— nothing in it rests on a rendered image, and the diff is `ROADMAP.md` plus
the loop-log files.

## Dispatcher state at hand-off

```
python3 scripts/loops/dispatch_status.py
```

```
Standardize   2 / 4 Continue rounds  since 2026-08-30 18:45   ok
Objective     1 / 3 slice            since 2026-08-31 02:50   ok  [229]
Optimize      0 wake-date(s) newer   since 2026-08-31 08:41   ok  [newest pair: axe-violations]
```

**This is the Step 0b comparison — the counter read immediately after recording
— and both moved as predicted.** Rule 2 went **1 → 2** because a `Continue` row
is a Continue round. Rule 3 stayed **1 / 3 `[229]`** because 229.4 sits in slice
229, which the counter had already counted — a same-slice item does not re-arm
it. No starved counter; re-run it rather than trusting this snapshot.

**Rule 5 is no longer STALE, and the pair is real rather than manufactured.**
`test:axe` ran here and reported zero violations, so `axe-violations = 0` was
recorded from a gate that actually executed — pairing with 2026-08-30's `0`.
**No regression: 0 → 0.** This is the first wake in three that could evaluate
rule 5 at all. Note the shape for next time: the way out of STALE was to record
a name **already sampled**, not to invent one — a name sampled once can never
satisfy "two consecutive runs", which is 184.1's defect exactly.

**How rules 1-4 were answered, so the next wake need not re-derive them:**

| rule | reading |
|---|---|
| 1 P0 | none open — `grep -n 'P0' ROADMAP.md` returns only closed slice headings; GitHub intake `list_issues` OPEN → `totalCount: 0` |
| 2 Standardize | **1 / 4 — ok** at Step 0b; no drift flagged |
| 3 Objective | **1 / 3 — ok** at Step 0b, `[229]` |
| 4 build item | **dispatched — `229.4`**, the oldest *dispatchable* item |

**The open set is 4, and ONE is dispatchable** (rule 4's kind-of-blocked
distinction, which `LOOPS.md` keeps in the durable playbook precisely because it
did not survive a rewrite of this file):

| item | kind of blocked |
|---|---|
| `112.3` pattern-fit pilot (oldest open) | owner-blocked — briefs + four answers |
| `112.4` Screen Contract layer | owner-blocked — on 112.3's verdict |
| AT runtime evidence | hardware-blocked — owner hardware |
| **229.5** the diff-stat form of the git-blob rule | **NOT blocked** — one `ENVIRONMENT.md` edit, or a recorded refusal |

**Next wake's rule 4 target is `229.5`**, unless a counter fires above it. It is
written so that **refusing is a satisfying outcome** — it may be refused as
prose growth on 158.2's argument, and should not be built just because it is
open.

**229.3 and 229.4 are now two live data points for how 229.5 should be taken,
and they point the same way**: both stated decision procedures (weigh base rate
against precedent) would have produced worse-argued outcomes than building the
throwaway and measuring. 229.4 additionally shows the failure mode to watch for
while doing it — the reconstruction that agrees with the claim.

**After 229.5 the dispatchable set is empty**, and rule 4 will report all three
remaining items owner- or hardware-blocked. That is worth knowing one wake
ahead: rules 2 and 3 are the counters that will carry the loop, and rule 2 is at
2/4.

## Direction

**No new input arrived**: no open GitHub issues (`list_issues` OPEN →
`totalCount: 0`), and no owner message since the last wake. Step 1 had nothing
to triage, so no `Roadmap · plan` row exists.

**The standing three are unchanged** (112.3, 112.4, AT runtime) and still need
the owner; no wake of any kind can advance them. With 229.4 closed, the loop is
**one item away** from running on counters alone.

**No sweep is due, and this was measured rather than inferred from the line
count.** `ROADMAP.md` is at **2,079** lines, up from 1,964 at the last hand-off,
but the figure that decides a sweep is the **closed-history share**, which the
seventh sweep triggered on at **62.4%**. Re-run 177's scope instrument verbatim
(it is in `ROADMAP-archive.md`, Slice 177) rather than carrying a number
forward; the previous hand-off read **11.2%**, and this wake added 116 lines to
one OPEN slice, which moves the share *down*, not up. Nowhere near.

**`cascade.astro`'s missing parse assertion is still open as an observation**
(carried unchanged, not re-derived this wake): it parses `Z_TOKENS` from the
shipped z-index tokens with no assertion, so a zero-parse renders an empty
stacking section rather than a wrong number. Milder than 227.3's — silence, not
a false figure. A Standardize sweep is the right home for it, and rule 2 is at
2/4.
