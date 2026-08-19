# Objective grill — Slices 45-50 (2026-08-19)

Dispatched by rule 3 at 3/3, the first Objective since 10:47 today.

Evidence gate: a conclusion needs **≥2 independent sources** to be `Evidence`,
else `Hypothesis`. Every claim carries its counter-evidence.

Window: 25 iterations — 12 Continue, 10 Standardize, 1 Roadmap triage,
1 Explore. Outcomes: 21 landed, 2 triaged, 2 logged.

---

## H1 — The surface has been flat for FOUR grills, and the number that said otherwise was wrong
**Seat: Chair · WORKING · HIGH · Evidence**

Counted identically at the last grill's commit and at HEAD, from committed
source:

```
1c217aa: classes=191  css_files=73  lines=5172
HEAD   : classes=191  css_files=73  lines=5185
```

**191 classes, 73 files, 39 components — unchanged.** Framework source grew by
**13 lines** across the whole window.

**A number nearly went into this report that was false.** The previous grill
recorded "248 classes"; my first count today said 229, which reads as a 19-class
*reduction* — the first time the surface would ever have shrunk. It is an
artifact of four different counting methods: 229 (api.json `classes`), 232
(api.json union of classes/blocks/parts/variants), 266 (the generated class-index
page, which includes primitives and utilities), and the older 248. Only counting
the same way at both commits answers the question, and the answer is *no change*.

**Counter-evidence:** flat is not stalling. This window deliberately deprecated a
component (`.bo-date`), added exactly one behavior (`initAnchorNav`), and refused
a `bo-object-page` component outright. That is the Objective working as designed
— "small & general over specific", with the growth going into *verification*
instead of surface.

---

## H2 — Effort is running about 10:1, instruments to framework
**Seat: Skeptic (Rex) · process · HIGH · Evidence**

Diffs since the last Objective commit:

| area | change |
|---|---|
| framework source (`packages/core/src`) | **+82 / −1**, 3 files |
| gates + instruments (`*/scripts`) | **+857 / −22**, 14 files |
| docs pages (`apps/docs/src`) | +440 / −27, 18 files |

Executable claims went from **36 call sites to 64** (72 assertions executed —
some run per width). That is the largest single category of work in the window.

**This is the thesis question for a framework at 0.x**: ten lines of measurement
per line of framework. The project's own quality bar demands it, and the
alternative has a body count — the `opacity: 0.6` WCAG failure shipped in the
initial commit and survived 43 slices and 31 axe sweeps.

**Counter-evidence, and it is strong.** The instruments earned their keep *in
this window*, not hypothetically:
- **50.2** caught a real framework defect — `initAnchorNav` coupled to a shell
  class name, so an object page scrolling in any other container would silently
  stop updating. Proved dead-vs-follows in a non-shell scroller.
- **49.3** caught the home page illustrating density with `.bo-badge`, which
  consumes no density token at all — the headline feature demonstrated by
  hand-faked padding.
- **46.2 / 45.2** caught documentation disagreeing with its own demo.
- `check-markup` failed a spike build for an invented class (`bo-sidebar-nav__list`),
  which is exactly the mistake a consumer would make.

**The uncomfortable half:** none of that reaches a user until something is
published. See H4.

---

## H3 — The loop's telemetry cannot see a refusal
**Seat: Consumer (Devi) · FUNCTION · MEDIUM · Evidence · actionable**

`ROADMAP.md` contains **41** mentions of refuse/Refuse. The loop log contains
**zero** rows with outcome `refused` — all day, across 49 iterations.

That is not because nothing was refused. **Slice 48 explicitly refused a
`bo-object-page` component** against the Objective's accept/refuse/rethink test,
and 50.3 refused two consolidations with reasons recorded. Both landed as
`landed`/`logged`, because the refusal happened *inside* an item whose outcome
was something else.

So a query against `loops.db` for "how often does this project refuse?" returns
**0**, which is false. The vocabulary was tightened in 41.2 precisely so outcomes
would be queryable; this is the same defect one level up — and it is exactly the
"a number you report is load-bearing" rule applied to the loop's own telemetry.

**Counter-evidence:** the refusals *are* recorded, in ROADMAP prose, which is the
source of truth by the storage doctrine. Only the queryable mirror is blind. That
caps the severity at MEDIUM — nothing is lost, it is just not countable.

→ **Fed back as 51.1.**

---

## H4 — npm serves 0.1.1. Eighth consecutive grill.
**Seat: Consumer (Devi) · FUNCTION · HIGH · Evidence · owner-blocked**

Verified from the registry this time, not from our own notes:

```
npm view @busy-office/ui version  ->  0.1.1
local packages/core/package.json  ->  0.2.0
```

Two independent sources agree the published package is behind. **It still
contains the `opacity: 0.6` WCAG failure fixed in 43.1** and gated in 44.2.

Everything in H2's counter-evidence — every claim, every gate, the WCAG fix
itself — is in the repository and in nobody's `node_modules`.

**Counter-evidence:** none. Publishing is owner-triggered; npm here is
unauthenticated (E401). This is not a finding the loop can act on, which is
precisely why it is being restated for the eighth time.

---

## H5 — The instrument base rate is holding, including inside this grill
**Seat: Skeptic (Rex) · process · HIGH · Evidence**

46.1 established that a first-draft instrument in this project is wrong
essentially always. This window did not contradict it. A partial list:

- a probe sampled a CSS slide-in mid-animation and produced an impossible
  *theme* difference (45.2);
- a selector spanned every combobox on the page (45.6);
- a red-proof "passed" because it renamed `data-state`, which the bundle never
  uses — it writes `dataset.state` (45.6);
- probes read the first of **four** wizard panels and the first of **three**
  filter bars, both reporting product bugs that did not exist (45.6);
- a claim asserted a row count that the demo's own consumer legitimately changes
  (45.6);
- `visual-regression` silently wrote missing baselines and reported a pass (47.2);
- a stack claim could not fail — `nav.top >= header.bottom` is true in ordinary
  document flow (48.2);
- `--only` matched by substring, so it narrowed nothing (48.2);
- an injection landed inside a template literal that teaches consumers which CSS
  to import (49.5);
- a red-proof grepped a bundle that does not exist, because Astro inlines that
  module into the page HTML (50.2).

**And three more happened while writing this grill**: the class-count method
mismatch in H1, a log-parsing regex that matched nothing, and an off-by-one
slice index that reported 0 iterations in a window containing 25.

**Counter-evidence, and it is the whole point:** every one was caught before its
number was used. The three in this grill were caught by the rules the earlier
ones produced — reconcile against an independent count, treat a tidy number as a
defect, verify the injection took effect. The base rate has not fallen; the catch
rate is what improved.

---

## Feeding back into triage

- **H3 → 51.1**: make a refusal visible in the queryable mirror.
- **H1, H2 → no new work.** Flat surface plus heavy verification is the Objective
  working, and inventing framework work to change the ratio would be the wrong
  response to a measurement.
- **H4 → restated, owner-blocked.** With the backlog otherwise empty of anything
  not owner-gated, **the highest-value action available to this project is not
  another slice — it is publishing 0.2.0**, and the loop cannot do it.
