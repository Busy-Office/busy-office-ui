# Objective grill — Slices 31-40 (2026-08-19)

Dispatched by rule 3 after the dispatcher was fixed: **ten slices** had closed
since the last grill (27, 30, 32-34, 36-40), because Objective sat below "build
item queued", which is always true. That starvation is itself the first finding.

Evidence gate: ≥2 independent sources for `Evidence`, else `Hypothesis`.
Everything below is measured against git, `api.json` and the loop log.

---

## H1 — The framework grew, and every addition was forced or paid for itself
**Seat: Chair · WORKING · HIGH · Evidence**

Across ten slices: **+401 / −25 lines** of framework CSS+JS, ending at **248
public classes across 39 components**.

What that number hides is the direction of travel:

| slice | what shipped | net effect on the bundle |
|---|---|---|
| 40.1 | `--bo-icon-src` instead of an icon catalogue | **75 → 71 kB** |
| 40.3 | `.bo-calendar` | 71 → 73 kB |
| 36.1 | `.bo-tabs--vertical` | 73 → 75 kB |
| 40.4 | advanced filter panel | **0 new CSS** |

The icon decision is the clearest evidence the charter is doing work rather than
being quoted: asked for "the full list", the answer was arithmetic — 12 glyphs
are 10.3% of the framework, 200 would add ~129 kB, roughly twice everything else
— and the mechanism that replaced the catalogue made the bundle **smaller**. Nine
entries now sit in DESIGN.md's deliberately-absent table.

Two of the four owner asks in Slice 40 were answered by **refusing the thing
asked for and shipping the smaller thing underneath it** (icon catalogue →
`--bo-icon-src`; date picker → calendar). Neither refusal was a no; both
delivered the capability the ask was reaching for.

---

## H2 — The verification discipline is now catching my own instruments
**Seat: Skeptic (Rex) · process · HIGH · Evidence**

Counted from the log across the last 22 iterations: **3 wrong measurements, 2
red-proofs that could never fail, 1 stale artifact, 3 defects found only by
rendering.**

The important shift from the Slice 29-30 grill: those findings were about
*mechanical edits* damaging content. These are about **the instruments lying** —

- `surface-signals` reported **zero usage for every component**, because a
  `find` over a path that does not exist poisoned the file list. Caught only
  because `bo-data-table` is obviously used.
- The **first `--bo-icon-src` verdict was "the mechanism does not work"**, from
  three probes run against a **cached container image** serving old CSS.
- Two red-proofs passed against deliberately broken input: the filter-panel one
  injected the wrong attribute, and the notes gate's first hoisting detector was
  **structurally incapable of firing** (hoisting is parse-time; the built file
  still reads `<li>…<a>…</li>`).

None reached a user. All were caught by the same move: **compare the artifact
against an independent count or hash before believing it.** That habit is now
routine — container freshness is checked by diffing served vs built CSS hashes,
and `81 imports / 211 files` before-and-after was what proved a refactor
behaviour-preserving.

**The class fix already exists and is being applied.** No new rule is proposed;
what this grill adds is the observation that the *failure has moved up a level*
— from the work to the tools that measure the work — and that red-proving must
therefore include "could this detector fail at all?"

---

## H3 — Rendering a thing is the single highest-yield check
**Seat: Consumer (Devi) · FUNCTION · HIGH · Evidence**

Three defects in ten slices were invisible to every static gate and obvious the
moment something was rendered:

1. **The documented filter-bar markup produced a vertical stack.** Shipped and
   documented for months; four docs pages were quietly compensating with an
   inline `style` on every control.
2. **`/patterns/field-editor` had a Save button 228px from its field**, in an
   actions column taking 37% of the table.
3. **A tutorial with 10 code blocks and 0 live demos** — the page whose job was
   the first impression.

All three were found by the owner or by putting a screenshot on the screen, not
by 21 gate scripts. That is not an argument against the gates; it is the
boundary of what they check. **A gate proves a claim; only rendering proves the
thing is any good.**

Acted on: `/getting-started/first-screen` now opens with the live screen, and
39.2 will gate "a rendered demo precedes the first `<pre>`" so this cannot
recur silently.

---

## H4 — Nothing has reached a user, for the FOURTH grill running
**Seat: Consumer (Devi) · FUNCTION · HIGH · Evidence · owner-blocked**

`npm view @busy-office/ui version` → **0.1.1**. The repo is at **0.2.0**, tagged,
`npm pack`-verified, CI-green.

The Slice 29-30 grill recorded this. So did 28, and 26-27 one level down about
the published site. Everything in this grill — the icon mechanism, the calendar,
the filter panel, the vertical tabs, the derived browser floor, four new gates —
is in the repository and in **nobody's `node_modules`**.

Recording it a fourth time rather than dropping it, and stating the consequence
plainly: **every "shipped" in the log above means shipped to git.** The
distinction has stopped being visible in the loop log's language, which is
itself worth fixing.

---

## H5 — The dispatcher keeps failing the same way, and keeps being patched late
**Seat: Skeptic (Rex) · process · MEDIUM · Evidence**

Three separate rules have now starved because a rule that is *always true* sat
above a *counter*:

| when | starved rule | starved by | noticed after |
|---|---|---|---|
| 2026-08-18 | Objective (rule 5) | backlog-empty | 2 slices, twice |
| 2026-08-18 | Standardize (rule 2) | queued build item | unknown |
| 2026-08-19 | Objective (rule 3) | queued build item | **10 slices** |

Each was fixed by moving one rule and writing a paragraph about why. The
paragraph under the old rule 5 literally said *"diagnosing it once and working
around it is not fixing it"* — and it was then worked around for ten slices.

**The pattern is structural, not incidental:** any counter placed below an
always-true condition is dead. There are now two counters in the list
(Standardize at 2, Objective at 3) and both sit above the queued build item, so
the specific instances are closed. What is NOT closed is that nothing detects
this — it was found by hand, twice.

→ **Fed back as a queued item:** a check that reports, per wake, how long each
counter-triggered rule has gone unfired. Cheap, and it turns a recurring
discovery into a number.

---

## Feeding back into triage

- **H5** → one queued item (below): make dispatcher starvation measurable.
- **H4** → re-stated, not re-queued; owner-blocked. Recommend the loop log stop
  saying "shipped" for work that is only committed.
- **H2, H3** → recorded as held-up; the disciplines are working and already
  routine. No new rule.
- **H1** → recorded as held-up. The charter is deciding outcomes, not decorating
  them.
