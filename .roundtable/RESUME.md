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

Last updated 2026-08-30 (**cloud** wake). Working tree clean at hand-off; one
push, two commits (`1498b4c1` the round, plus the loop-log row).

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 4 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
```

`227.1` is named below as **what landed**, not as open work. The four genuinely
open are **`112.3`, `112.4`, AT runtime, and the new `227.2`** — and 227.2 is
the first dispatchable one in weeks.

## What landed this wake

**Slice 227 — Polish round 2 on `component/icon`, dispatcher rule 6.** Rules
1-5 were each answered by measurement, not waved past; the readings are in
"Dispatcher state" below.

- **The finding: `fit` cited "12 ERP glyphs"; the framework ships 26.** All ten
  revisions of `icon.css` were walked, so the decay is dated rather than
  estimated — 12 held 2026-08-15 → 08-21, went to 23 on 08-24 (137.1's toolbar
  set), 24, then 26 on 08-27. The entry is stamped `"scored": "2026-08-23"`, so
  the count was **exact when taken and wrong the next day**.
- **A third class of cite decay.** `sidebar-nav` and `breadcrumb` were falsified
  by a *different* tree (po-app; the pattern corpus). This one was falsified
  **inside the very file the cite describes** — the catchable kind, uncaught for
  six days.
- **The cite was concealing a live defect.** The same 12 was hard-coded in
  `icon.astro` as the **divisor** of a byte count read fresh from the shipped
  stylesheet, so `/components/icon` published *"a 200-icon catalogue would add
  roughly 148 kB"* where the shipped per-glyph rate says **68**. That number is
  the published arithmetic behind roadmap 40.1's refusal of an icon catalogue —
  the framework was **overstating the case for its own decision by 2.17x**.
- **The comment three lines above it already warned about this.** It said the
  size argument is computed from the shipped artifact because a hand-typed
  10.3% had drifted to 6.0%. That fix made the numerator live and left the
  denominator hand-typed. **A wrong share misinforms; a wrong divisor scales.**
- **192.1 arrived on cue.** *"more than everything else we ship"* was true at
  148 kB and **false** at 68 (everything-but-icons is 83.9 kB), so correcting
  the number alone would have shipped a fresh falsehood.
- **Red-proved by injection, injection confirmed twice** — a 27th glyph rule
  appended to the min CSS the page resolves showed in the file *and* moved the
  **rendered** page `26 → 27` / `9.6% → 9.7%`. The hard-coded 12 could not have
  moved. Reverted; `redproof` appears nowhere in either dist.
- **Verified against the RENDERED artefact.** Seven stale strings → **0 files**
  in `apps/docs/dist`. `12 glyphs here` survives in **4** dist files, all of
  them the unminified shipped CSS carrying **this slice's own quotation** of
  what it removed — confirmed structurally, which is the "assertion tripped on
  its own explanation" trap.
- **Every live copy fixed, quantity removed rather than refreshed** (217.2/220.1
  precedent): `icon.css` ×2 — shipped to consumers in the npm package —
  `icon.astro` ×4 plus its hard-coded deprecated badge and caption, `DESIGN.md`'s
  refusal row, `app-launch.astro`'s rhetorical "twelve glyphs". Historical
  records untouched: they are quotations of what was true when written.

**All 17 CI entry points were run green in this container**, plus a
`DOCS_BASE=/busy-office-ui` build. `check:claims` reported **3 NOT VERIFIED** —
that is `ENVIRONMENT.md` §6b, this container's pointer capability, **not** a
regression; do not "restore" the zero.

**Not verified, said plainly:** no Podman and no `localhost:8081` here, so the
1440/390 light-and-dark screenshot lane could not run. **Nothing in this wake
rests on a rendered image** — every change is prose or a computed number, and
the numbers were read out of the built HTML and out of the DOM after injection.
`check:layout` (127 pages, 390 + 150% zoom) and `test:axe` (127 × 2 widths) are
the whole-tree evidence that the page did not break.

## Dispatcher state at hand-off

```
python3 scripts/loops/dispatch_status.py
```

```
Standardize   3 / 4 Continue rounds   ok
Objective     2 / 3 slices            ok   [222, 226]
Optimize      0 wake-date(s) newer    ok
```

**Both counters are UNCHANGED by this wake, and that is correct, not a miss.**
A `Polish` row advances neither: rule 2 counts Continue rounds, and 161.4
excludes Polish from the slices rule 3 counts. So Slice 227 exists and arms
nothing. That was the Step 0b comparison — read the counter right after
recording — and it agreed with what was expected.

**How rules 1-5 were answered, so the next wake need not re-derive them:**

| rule | reading |
|---|---|
| 1 P0 | none open; no open GitHub issues (`list_issues` OPEN → `totalCount: 0`) |
| 2 Standardize | 3/4, not met |
| 3 Objective | 2/3, not met |
| 4 build item | the three standing items are owner/hardware-blocked (below) |
| 5 Optimize | instrument **fresh** (0 wake-dates newer). Newest comparable pair is `axe-violations` 0 → 0. The only two-consecutive-rise sequence is `bundle-gz-kb` 10.8 → 11.6 → 11.7, whose newest sample is **2026-08-17**, 13 days stale. Size budget **not** breached, measured rather than assumed: `rf-essentials` built at **38.0 kB min against a 40 kB budget** |

**The open set, and the kind of blocked matters (rule 4):**

| item | kind of blocked |
|---|---|
| `112.3` pattern-fit pilot (oldest open) | owner-blocked — briefs + four answers |
| `112.4` Screen Contract layer | owner-blocked — on 112.3's verdict |
| AT runtime evidence | hardware-blocked — owner hardware |
| **`227.2` divisor-class gate** | **NOT blocked — any wake can take it** |

**Next wake almost certainly reaches rule 4 and takes `227.2`**, which is the
first dispatchable build item the backlog has carried in weeks. Read its entry
before starting: **the honest first outcome may be a refusal.** It would be the
fourth gate refused in this family (216.2/217.2/220.2), and it is only worth
opening because its predicate is genuinely different — a hand-typed literal used
in arithmetic whose other operands come from a live read, which has a shape a
detector can see, unlike a decaying cite. **Step one is the base rate.** If the
property holds for essentially everything, or the class is 1-of-1, it is 94.11
ceremony and should be refused with the measurement recorded.

## Direction

**This block is genuinely empty of new asks.** No new input arrived: no open
GitHub issues, and no owner message since the last wake.

**Standing three unchanged** (112.3, 112.4, AT runtime). All three need the
owner; no wake of any kind can advance them.

**Still unacted, now twelve wakes older:** 177's observation that a grill's
roadmap slice pays for its text twice — 1,192 of 1,943 swept lines were five
Objective-grill slices that each also have a full report in `.roundtable/`.
**Deliberately not filed as an item**, and re-checked this wake rather than
repeated: 177's own text calls it *"a direction call about how the loop records
its own work, and this loop does not take those"*, recorded so the owner can
decide it. It is a standing owner question, not a dropped follow-up.
