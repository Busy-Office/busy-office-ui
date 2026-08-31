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
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 3 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
```

**The open set went 4 → 3, and the dispatchable set is now EMPTY.** `229.5` was
the last item no owner and no hardware was blocking; it landed this wake.

## What landed this wake

**Slice 229.5 — LANDED**, dispatcher rule 4 (Continue, build mode). The diff is
`.roundtable/ENVIRONMENT.md` (**16 / 9**) and `ROADMAP.md` (**77 / 1**) — two
markdown files. No code changed and no gate was added.

229.5 offered two arms — generalise `ENVIRONMENT.md`'s git-blob bullet, or
record the generalisation as refused prose growth. **The first arm was taken,
and the deciding evidence is something the item did not know.**

- **The premise re-checks exactly**, which is why the rest is worth believing:
  `git show --numstat --format='' d701e61 -- ROADMAP.md` → **158 2326**; the
  parent holds **3,794** and the commit **1,626**; 3,794 − 2,168 = 1,626. The
  quoted hand-off sentence was located verbatim rather than paraphrased —
  `d701e61:.roundtable/RESUME.md` **line 87**, surviving into `7be5e4ae`.
- **The hand-off's four figures are INTERNALLY SELF-CONSISTENT** (129 − 2,328 =
  −2,199; 3,794 − 2,199 = 1,595). That is the finding 229.5 was missing: it is
  not an arithmetic slip a re-read catches, it is a **provenance** error in
  which every number agrees with every other and none describes the commit.
- **229.5's own premise "the defect is confined to the ephemeral hand-off" is
  FALSE.** `d701e61` is the commit that **added** the bullet
  (`git show d701e61 -- .roundtable/ENVIRONMENT.md` → `9 0`), and its own
  **subject** reads *"ROADMAP.md 3,794 -> 1,473 lines"* where the commit holds
  **1,626** — a 153-line gap, and an instance of the *after-figure* form the
  bullet was being written to name. **The narrow form failed at zero distance**,
  which is the base rate a generalisation is supposed to move, and is why the
  refusal arm lost on measurement rather than on preference.
- **Third repo-wide instance of an instruction naming an instance rather than
  the property, and the first in `ENVIRONMENT.md`:**
  `grep -n "name the property" LOOPS.md CLAUDE.md .roundtable/ENVIRONMENT.md`
  → `LOOPS.md:738`, `LOOPS.md:773`, and **0** in `ENVIRONMENT.md`.

**A limit of the general form was found while writing it and is carried rather
than papered over:** a figure going into the *message* of a commit cannot be
read from that commit, because it does not exist yet — exactly the case
`d701e61`'s subject got wrong. The bullet therefore names the **index** as a
third reading, `git show :<file> | wc -l`, **red-proved by discrimination**
rather than asserted: staged a 3-line file, grew the working tree to 5, the
index kept reading **3** while the tree read **5**, and re-adding moved it to 5.
Probe removed; `git status --short` empty afterwards.

**The rule was applied to its own commit.** The message's `9 → 16` came from
`git diff --cached --numstat` on the index, and the landed commit's numstat
reads **16 9** — they match. Three of those lines are a **cut**: the one-cycle
regrowth consequence ("2,144 lines over ~34 hours" vs "+2,073 over 22 commits in
16h03m") is the *effect* of the error rather than the rule, and survives at
`ROADMAP.md:975-977` under Slice 228, which the bullet still cites.

**All required gates green, exit 0 each**, run against the final tree: core
`build`, core `test` (152 in 27 files), `docs:build` (which runs `check:repo`),
`check:claims`, `check:layout` (**127** pages), `test:axe` (**127** pages × 2
widths, zero violations), `check:repo` (`check:slice-refs` **457** citations),
`check:formatting`.

`check:claims` reads **158 verified live · 3 NOT VERIFIED**. That is
`ENVIRONMENT.md` §6b — this container reports `(pointer: fine) = false`, so the
three `.bo-btn` press claims cannot discriminate — **not** a regression. Do not
"restore" the zero.

**Not verified, said plainly:** no Podman and no `localhost:8081` here, so the
1440/390 light-and-dark screenshot lane could not run. The item needed neither —
nothing in it rests on a rendered image and no code changed.

## Dispatcher state at hand-off

```
python3 scripts/loops/dispatch_status.py
```

```
Standardize   3 / 4 Continue rounds  since 2026-08-30 18:45   ok
Objective     1 / 3 slice            since 2026-08-31 02:50   ok  [229]
Optimize      0 wake-date(s) newer   since 2026-08-31 08:41   ok  [newest pair: axe-violations]
```

**This is the Step 0b comparison — the counter read immediately after recording
— and both moved as predicted.** Rule 2 went **2 → 3** because a `Continue` row
is a Continue round. Rule 3 stayed **1 / 3 `[229]`** because 229.5 sits in slice
229, which the counter had already counted. No starved counter; re-run it rather
than trusting this snapshot.

**How rules 1-4 were answered, so the next wake need not re-derive them:**

| rule | reading |
|---|---|
| 1 P0 | none open — `grep -n 'P0' ROADMAP.md` returns only closed slice headings; GitHub intake `list_issues` OPEN → `totalCount: 0` |
| 2 Standardize | **2 / 4 — ok** at Step 0b; no new drift flagged this wake |
| 3 Objective | **1 / 3 — ok** at Step 0b, `[229]` |
| 4 build item | **dispatched — `229.5`**, the oldest *dispatchable* item |

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

## ⚠ Rule 2 can no longer advance on its own — read this before dispatching

**Measured, not inferred:** `dispatch_status.py:249` counts rule 2 with
`sum(1 for r in after if r["loop"] == "Continue")` — **only `Continue` rows**.
Continue is reachable only through rule 1 (a P0) or rule 4 (a dispatchable
item), and **rule 4's dispatchable set is now empty**. So rule 2 sits at
**3 / 4** and no wake that falls through to Polish can move it. That is the
same silent-starvation shape `LOOPS.md` Step 0b records three times.

**The escape is real and already loaded, not a proposal:** rule 2's *other*
trigger is **"or drift flagged"**, and a drift has been carried unactioned for
three wakes — **`cascade.astro` parses `Z_TOKENS` from the shipped z-index
tokens with no assertion**, so a zero-parse renders an empty stacking section
rather than a wrong number (milder than 227.3's: silence, not a false figure,
and squarely CLAUDE.md's "a mirror must reconcile against its source"). Two
prior wakes read it, declined to treat it as flagging rule 2, and queued it for
when the counter fired. **The counter can no longer fire.** So the next wake
should either dispatch **Standardize on the flagged drift** — which also
discharges lanes 1-4 — or record why it still declines, but it should not leave
the question implicit a fourth time.

## Direction

**No new input arrived**: no open GitHub issues (`list_issues` OPEN →
`totalCount: 0`), and no owner message since the last wake. Step 1 had nothing
to triage, so no `Roadmap · plan` row exists.

**The loop has now run out of work no human is blocking.** All three remaining
items need the owner (112.3's briefs and four answers, 112.4's dependency on
that verdict) or the owner's hardware (AT runtime evidence). Nothing any wake of
any kind can do advances them — this is the state `RESUME.md`'s Direction block
exists to make visible, and it is the first wake where it is the *whole* open
set rather than most of it.

**No sweep is due, and the share was RE-MEASURED this wake rather than carried
forward.** `ROADMAP.md` is at **2,155** lines, up from 2,079, but the figure
that decides a sweep is the **closed-history share**, which the seventh sweep
triggered on at **62.4%**. Measured here on 208's definition (resident-closed
body lines ÷ live lines):

```
2,155 lines, 215 `## ` sections
  preamble 7 · doctrine 388 (4) · open-carrying 250 (2)
  pointer stubs 828 (207) · resident-closed 682 (2)
span reconcile 2,155 vs 2,155 OK   ·   box reconcile open 3/3, closed 12/12 OK
closed-history share = 682 / 2,155 = 31.6%
```

**Nowhere near 62.4%, and the reason is structural rather than lucky:** only
**two** sections are resident-closed, and **529 of those 682 lines are Slice 229
itself**, which closed this wake. The live file is almost all pointer stubs
(828 lines over 207 sections). What a sweep removes is barely there yet.

**The instrument reconciles both ways and was red-proved on both axes before
the number was quoted**, per CLAUDE.md's base rate — the classifier keys on (a)
whether a section carries an `N. [ ]` box and (b) whether a slice section is
longer than 4 lines:

- flipping one `[x]` to `[ ]` inside Slice 229 (injection confirmed present:
  open boxes 3 → 4) moved 229 out of resident-closed — **682 → 153 lines,
  31.6% → 7.1%**;
- padding Slice 227's pointer stub with 40 filler lines (confirmed present)
  moved it into resident-closed — **828 → 824 stubs, 682 → 726, 31.6% → 33.1%**.

Both reconciliations stayed OK under both injections.

**Two caveats, said plainly rather than buried.** The previous hand-off carried
**11.2%**; this reads **31.6%** and the gap is *not* explained here — most
likely a different definition, since that figure was inherited without a
command. And **the probe is a scratchpad throwaway and was not committed**,
which is precisely the failure 229.4 filed against 227.2. It is re-derivable
from the four classification rules stated above, which is the mitigation, not a
substitute: **if the next wake needs this share it should re-derive it, and if
it needs it a third time that is the signal to commit the script.**
