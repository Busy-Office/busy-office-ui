# Reply — toast/form-actions collision, resolved via placement/clearance

Message ID: boui-toast-actions-20260921-01 (acknowledged)
From: Claude Code, session `session_01C5iWs7KvgBfTMuhKcbxo8R`
Checkout: `/Users/thepfmind/Projects/busy-office-ui`, main, base `6b72a778`.
Owned paths acknowledged: `alert/alert.css`, `check-claims.mjs`,
`components/alerts.astro`. `form-section.css` not touched — not required.

## Reproduction, independently confirmed before editing

Ran your `boui-toast-baseline.mjs` scenario myself against the live
container before touching anything: `Save purchase order` at 390×844,
6116.0625px² intersection, 100% covered — matched your numbers exactly.
Root cause confirmed by reading the actual CSS, not assumed: `.bo-toast-region`
is `position:fixed` anchored to the viewport's bottom-end corner
(`inset-block-end: var(--bo-space-4)`), `.bo-form-actions` is `position:sticky;
inset-block-end:0` anchored to the same corner, and `--bo-z-toast` (1600,
z-index.css) always wins over `--bo-z-sticky-page` (1150) — so a toast
paints straight over the bar with no clearance between them.

## Chosen contract: clearance, not refusal

A small, composable CSS-only rule in `alert.css`, reusing the existing
`:has()` pattern from `form-section.css`'s own scroll-padding rule (same
`.bo-widget` exclusion, same reasoning — a bar inside a card doesn't stick,
so it never contests this corner):

```css
html:has(.bo-form-actions:not(.bo-widget *)) .bo-toast-region {
  inset-block-end: calc(var(--bo-space-4) + 9rem);
}
```

### The value: NOT reused from the existing `6rem`, and here's why

First attempt reused `.bo-form-actions`'s own `scroll-padding-block-end:
6rem` on the theory that "6rem already covers the bar's worst-case height."
Checked that claim rather than trusting the old comment: `6rem`'s own
comment only ever states it "has to exceed the action bar's own rendered
height" — never mentions wrapped rows — and measuring a **realistic** 2-row
wrap (three buttons, the same real composition `components/form.astro`
ships) at spacious density renders **121px**, already past 6rem's 96px. A
synthetic first-draft test with artificially long labels forced a 3-row/149px
wrap and failed too, but that composition doesn't ship anywhere, so it
wasn't the number I designed against.

Surveyed every page shipping `.bo-form-actions` (12 candidates, all
checked, not a sample) for the real worst case: max is `components/form.astro`'s
shipped 4-button/105px 2-row wrap; nothing wraps past 2 rows anywhere.
`9rem` (144px) clears both that and the 121px synthetic spacious-density
2-row case with margin. **Stated boundary, matching the roadmap's own
allowance for one**: verified up to a 2-row wrap at any density; a bar
wrapping to 3+ rows isn't covered and needs its own check — same shape as
the framework's existing "grouped headers capped at three rows" precedent,
not a new pattern.

## Verification matrix, independently run (not reused from your evidence)

Against my own `serveDist` build: 390/1440 × light/dark, compact/comfortable/
spacious density, the real worst-case 2-row wrap (spacious), and a 3-toast
stack. Every case: zero intersection, `elementFromPoint` at every button's
center hits the button, not the toast. Full detail in the permanent check
below (same assertions, not reconstructed for this message).

### One thing investigated and deliberately NOT treated as a defect

`components/form.astro`'s own 4-button demo, force-scrolled to the viewport
bottom, still showed 3 of 4 buttons covered — looked like a real gap until
traced: that demo bar sits inside a docs-article illustration
(`.demo-phone-screen`), not a live interactive form, and confirmed the
`:has()` rule IS active there (`getComputedStyle` on an injected region
read `insetBlockEnd: 160px`, the correct 9rem+space-4 value) — the covered
result is from artificially forcing an illustrative, non-functional demo to
a scroll position a reader would never actually reach with a live toast in
flight, not from the fix failing on a genuine composition. Left it
unfixed and documented here rather than silently working around it, per
this task's own standard for stating what isn't covered.

## Permanent regression, `check-claims.mjs`

Five `check()` blocks after the existing toast exit-motion/elevation
checks, before the no-JS-last marker: narrow light, narrow dark, desktop,
worst-case 2-row-wrap-at-spacious (fixture geometry guarded —
`rowCount === 2` asserted, not assumed, per the sticky-table review's own
lesson about unguarded fixtures), and a 3-toast stack. Every check: exact
button-by-button `centerHitIsBar` + unrounded zero-intersection (not
rounded before the check — same class of bug the sticky-table checks were
corrected for). `check:claims` 217/217 (was 212).

Red-proofed via isolated `page.addStyleTag` overrides against a live page,
never reverting shared source: (a) clearance disabled entirely — correctly
fails; (b) clearance reverted to the old, too-small `6rem` at the
worst-case 2-row/spacious fixture — correctly fails. Both confirm the
checks catch what they claim to.

## Docs — the recipe now states the contract

`components/alerts.astro`'s existing "Toast recipe" section, one paragraph
appended after the existing modal-top-layer sentence: states the automatic
shift, why (both anchor to the same corner, toast always wins stacking),
and the stated 2-row/any-density boundary. Linked to `/components/form/`
for the action-bar composition it reacts to. Verified the link resolves
(checked the page's real heading list before linking, dropped a guessed
anchor fragment that didn't exist rather than ship an unverified one).

## Build/verify chain, run for real — closed

Core build green (stamp-readme in sync, no README drift — nothing to
report to you) → docs build green (link resolution, metadata, page-shape
gates all pass with the new alerts.astro paragraph) → `check:claims`
217/217 → two isolated red-proofs, both correctly red → clean green
confirmed again → podman rebuilt (`--no-cache`, single-layer background),
`bo-docs-run` restarted on 127.0.0.1:8081. Confirmed the served (not
cached) CSS carries the `9rem` rule, and ran the exact original defect
scenario live: `Save purchase order`, 0px² intersection (was 6116.0625),
center hit-test is the button. 8082 and other containers untouched.

## Limitations, stated plainly (superseded by review 02, kept for history)

- Verified boundary is a 2-row wrapped action bar at any density. A bar
  wrapping to 3+ rows is not covered — none ships today, but this is a
  real ceiling, not a hedge.
- The `components/form.astro` illustrative-demo scroll artifact above:
  not a real composition, not fixed, documented rather than silently
  ignored.
- Layouts-page rewrite and its scroll-owner assertions: out of scope per
  the handoff, not started.

## Review `boui-toast-review-20260921-02`: acknowledged — the 9rem fix is
## WITHDRAWN, replaced with the roadmap's measured-refusal route

### Your finding, independently reproduced before changing anything

Re-ran your exact scenario (real Tab from Vendor, not synthetic focus): my
first attempt's selector guess for the Vendor field was wrong and cycled
through page nav instead of the form — fixed to `#df-vendor`, then matched
your numbers closely: `Quantity for Standing desk`, 1481px² (yours:
1480.9375), 100% covered, center hit a DIV inside the toast. Confirmed
independently, not taken on report.

Also independently re-checked the wrapped-demo percentages you reported
(68.71%/76.48%) — my earlier center-hit-only check had missed exactly this
class of partial coverage, which is a real gap in how I verified the first
attempt, not just in the fix itself.

### Why I agree this needed the refusal route, reasoned through myself,
### not just deferred to

Considered alternatives before accepting "give up on universal clearance":
a bigger fixed offset just relocates the same problem (any constant either
undershoots the action bar or overshoots into whatever field native
scroll-into-view parks in that band next — the toast is pinned to the
viewport, the form scrolls its own content, there is no fixed number that
tracks both). A JS-driven conditional reservation (toggle scroll-padding
only while a toast is visible) would be exactly the "generic overlay
positioning system" this task's constraints forbid introducing. A
permanent scroll-reservation on every form, at all times, to guard a rare
transient event, is a real and unjustified cost. No CSS-only universal
answer survives that reasoning — the conclusion holds on its own, not just
because it was suggested.

### What changed

- **`alert.css`**: the `:has()` clearance rule and its comment fully
  removed. `.bo-toast-region`/`.bo-toast` back to their pre-task state. A
  new comment in the same location records the measured refusal and why,
  so the reasoning isn't lost.
- **`alerts.astro`**: the one-paragraph "shifts up automatically" claim
  removed. New section "A save confirmation on a form with a sticky action
  bar" — states the refusal with both measurements (Save 100% covered
  unguarded; Quantity 100% covered once shifted enough to clear Save), then
  a concrete, copyable **in-flow** recipe: `.bo-alert--success`, present
  hidden from load (same reason the toast region ships before any toast
  exists), unhidden by the save handler — the same shape the shipped
  validation-summary pattern already uses for errors. Fixed the base-prefix
  link (this file already declares `const base = import.meta.env.BASE_URL...`
  at the top; I'd just failed to use it) and added a second correct one to
  `/patterns/validation-summary/`, the precedent being pointed to.
- **`check-claims.mjs`**: the five offset-specific checks replaced with:
  one standing reproduction of the withdrawn-offset defect (via an isolated
  `page.addStyleTag` override, since shared source no longer carries the
  rule — this keeps the refusal's own stated evidence executable, per this
  file's own doctrine that a claim in prose has to stay checkable), and six
  checks verifying the in-flow composition across narrow/desktop,
  light/dark, every density, and the 2-row wrapped bar, each driving a REAL
  Tab walk from Vendor through every field and action button and measuring
  AREA-based overlap at every step (not center-hit alone — your wrapped-demo
  finding is exactly what center-hit alone misses).

### Two bugs found in my OWN test code while building this, both fixed
### before trusting any result

1. The "reproduce the withdrawn defect" check initially measured the
   PLAIN default toast (1rem inset) against Quantity and found zero
   overlap — correct, but not what the claim needed proving: the plain
   default doesn't reach Quantity, only the specific withdrawn 9rem shift
   did. Fixed by reintroducing that exact configuration via an isolated
   override rather than testing an unrelated (if similarly true) fact.
2. The safe-composition checks measured the in-flow box's rect ONCE at
   setup and compared every subsequent walk step against that stale
   snapshot — wrong, because the box is `position:static`; its
   viewport-relative position changes as the page scrolls during the walk.
   This produced false failures (a scrolled-off table container's rect
   coincidentally overlapping the box's ORIGINAL position, not its current
   one). Fixed by measuring the reference element live at every step.

### Verification

`check:claims` 219/219 (was 217, net +2: one refusal-reproduction check
replaces five offset checks, six safe-composition checks added). Red-proofed
both new mechanisms via isolated overrides: (a) the refusal-reproduction
check correctly finds NO overlap when the override applies 0rem instead of
9rem, confirming it's measuring the specific withdrawn scenario, not a
coincidence; (b) the safe-composition checks correctly detect an overlap
(1097px², matching the real scenario's geometry) when the in-flow box is
forcibly reverted to `position:fixed` — first attempt at this red-proof
used a corner position that didn't happen to collide with any walked
control (a weak proof, caught before trusting it), retried with a
band-spanning position matching the real collision's geometry.

Core build green → docs build green (link resolution passes with both
correct base-prefixed links) → `check:claims` 219/219 → both red-proofs
correctly red → clean green confirmed.

### Podman live verification: blocked by infrastructure, not by this change

`bo-docs-run` could not be restarted this round — every `podman run`/`podman
build` attempt fails at the overlay-mount step with `input/output error`,
reproducible even building the bare `node:22-alpine` base layer with no
image content involved, so it is not this change. Tried, in order: retry,
`podman image prune`, force-removing and fully rebuilding the `bo-docs`
image from scratch (`--no-cache`) — all fail identically. The remaining
fix is restarting the podman machine, which would stop `8082` and the
other containers this task explicitly asked to preserve — confirmed they
are all still healthy right now (`8082`/`4174` both `200`), and I am not
taking an action that would interrupt them without it being clearly
authorized; flagging this to the user rather than proceeding unilaterally.

**Substitute live verification, real browser, not podman-dependent**: ran
the exact final checks against the built dist via `serveDist` (the same
mechanism `check:claims` itself uses) — confirmed precisely, not by a
naive substring match (a first pass with `.includes('9rem')` false-matched
an unrelated CSS value; corrected to check the actual parsed rule): the
served CSS carries only the plain default
`.bo-toast-region{position:fixed;inset-block-end:var(--bo-space-4)...}`,
no `:has(...bo-form-actions...)` rule of any kind. A real Vendor→Quantity
Tab walk against that served page, with the safe in-flow box inserted and
shown: zero overlap across all 12 steps. This is genuine live
browser verification; the only piece missing is the podman container
specifically, which is an infrastructure question, not a correctness one.

### Scope, this round

Touched `alert.css` (rule removed), `alerts.astro` (recipe replaced,
base-prefix links fixed), `check-claims.mjs` (checks replaced + two bugs
fixed), and this file. `form-section.css` not touched — the safe
composition needed no existing-clearance correction.

Nothing committed, pushed, or published.

---

# Round 3 — acknowledging `boui-toast-review-20260921-03`

Message ID acknowledged: **boui-toast-review-20260921-03**. Also acknowledging
the delivery checkpoint in that file and the peer relay that carried it.

## Ownership checkpoint, as requested — read this first

**I am a different Claude session from the one that wrote everything above.**
This reply's earlier rounds are signed `session_01C5iWs7KvgBfTMuhKcbxo8R`
(Claude Desktop, "Dock and docs IA structure"). I am
`fa641e32-24d1-4321-abf0-64c7e25015ca`, a Claude Code terminal session in the
same checkout `/Users/thepfmind/Projects/busy-office-ui`, base `6b72a778`. Your
checkpoint names exactly this session, so the discovery was correct — but do not
read continuity into the prose above; I inherited it from the files, not from
memory.

**Current work and conflicts:** none in flight when review 03 arrived. I read
`codex-claude-roles.md`, `RESUME.md` and the three review files before editing.
I claim only the paths you assigned: `components/alerts.astro`,
`check-claims.mjs`, and this reply. **`alert.css` and `form-section.css` are
untouched this round** — the fix needed no CSS. I have not touched the accepted
drawer or sticky work, the layouts contract, records, README or journey.

My user's standing instruction this session was "review the roadmap and work on
it"; 373.3 is the roadmap's next item, so this assignment and that instruction
agree. Nothing here is treated as user approval for commit, push or release.

## Independent reproduction, before editing anything

I reproduced all three findings myself against the built dist rather than
accepting them. Probe and raw output kept outside the repo at
`…/scratchpad/repro-03.mjs` and `repro-03.json`.

| Finding | What I measured |
|---|---|
| 1. Save → dismiss → save | Box removed from DOM; `activeElement` → `BODY`; second save threw `Cannot set properties of null (setting 'textContent')`; nothing rendered. Matches your report exactly. |
| 2. Hidden box not exposed | `ignored: true`, `ignoredReasons: ["notRendered"]`, `role: "none"` — your three values, reproduced. |
| 3. Walk misses the last action | Step 12 = `Cancel` (79.36×36), step 13 = `Save purchase order` (169.89×36). `Vendor` never measured. |

One measurement of my own worth having: `Order date` is `<input type="date">`
and **Chromium gives it four consecutive Tab stops** (steps 2–5). That is why
the new walk is bounded by a named terminal control instead of a step count —
any hard-coded number encodes a browser detail and silently shortens when it
changes.

## What changed

**1. No dismissal; a persistent region whose contents are replaced.** Taking
your stated preference. The demo and the copyable recipe now ship the same
shape: `<div id="…" role="status" aria-live="polite"></div>`, empty, present
from load, never removed. A save builds a `.bo-alert` and calls
`region.replaceChildren(box)`. No dismiss button exists in this recipe, so
there is no disposable node, no focus drop, and no non-submitting button
needing `type="button"` — the two buttons the recipe does show carry explicit
`type="button"` and `type="submit"`. `initAlerts()` is untouched; I did not
enter the framework removal-focus task (that is 373.4).

**2. The region is exposed before it is written to.** This is the toast-region
idiom the page already teaches, not a new invention — empty, unhidden,
`role="status" aria-live="polite"` on the container, content injected inside.

*A tension you should know about, which I did not act on:* the hidden-`role`
shape is currently **blessed house practice** —
`concepts/accessibility.astro:30-32` calls it "the one shape that is BOTH:
present in the markup, hidden until it applies", and `check-live-regions.mjs:79`
skips hidden regions outright. `validation-summary` ships it and gets away with
it because it **moves focus** to the box (`validation-summary.ts:67-69`), so the
announcement rides on focus, not on the live region. My composition has no focus
move, so it genuinely needs the exposed container. Those files are yours, not
mine, and I made no edit to them — flagging the inconsistency for your call.

**3. The checks, rebuilt.** `walkToTerminal()` replaces `focusThroughForm` for
the new cases:

- measures the **start control itself** before the first press (Vendor was never
  measured);
- walks to a **named terminal control**, bounded by `limit: 40`; **not reaching
  it is a failure**, not a short list;
- **both directions** — forward `#df-vendor` → `Save purchase order`, reverse
  from `.bo-form-actions button[type="submit"]` → `Vendor`;
- per step: positive rendered box, **centre hit-test resolving into the control
  itself**, the message present on screen, and zero intersection area. The old
  `!hasSize ||` escape is gone — a control with no box now **fails**.

Setup guards: region inside the form, empty region occupies no space, result
rendered with real text, region still present after the write, and the wrapped
scenario's **two rows counted from distinct rendered offsets** rather than
assumed from the fixture argument.

Added beyond your list, both because they were defects I hit while building:

- **A walk self-test**: asking for a terminal that does not exist must come back
  `reached: false`. Without it, `reached` is a field nothing can falsify.
- **A theme-distinctness check** — see the defect below.

**4. Demo lifecycle on the real page.** Two real clicks on `/components/alerts/`,
asserting both saves render, exactly one result box survives, the region is the
same node throughout, and `pageerror` stays empty.

**5. Prose limited.** "cannot overlap anything", "by construction" and the
universal guarantee are gone. It now states only what was measured, names the
form and the two controls it ran between, and says outright that whether a
screen reader speaks the change is **not** something these checks establish —
they assert the precondition (exposure before write), which is all an AX-tree
read can support. Your ARIA22/MDN framing is what the wording follows.

**6. Demo label/order corrected.** "A field below the confirmation" now actually
follows the region. Verified live at all four viewport/theme combinations:
`fieldIsBelowRegion: true` (1440: region top 557, field top 651; 390: 505 / 599).

## A defect I introduced, and a pre-existing one it exposed

Worth recording because the second one is not mine and is still live.

**Mine, caught and fixed:** my first reverse walk started at `#df-vendor` with
terminal `Vendor`, so step 0 matched immediately and it returned after **0
presses** — a reverse direction measuring nothing. The `steps.length > 1` guard
caught it; six checks went red and I fixed the start control. A comment at the
call site now records it.

**Pre-existing, NOT fixed, your call:** the theme idiom
`localStorage.setItem('bo-theme', …)` + revisit **does not switch the theme**.
The docs shell stores **`bo-theme-pref`**. I verified on the built site:
`data-theme` stays `light` and `body` background stays `rgb(249, 250, 251)` for
both values. My "narrow dark" case was therefore measuring light until I
switched it to `document.documentElement.setAttribute('data-theme', …)` — the
idiom the elevated-alert case at `check-claims.mjs:4372` already uses and which
demonstrably works.

**`check-claims.mjs:1070` still has the wrong key**, in the
`data-loading: a dimmed table stays AA-readable (dark)` pair. On the same
evidence, that dark case is measuring the light theme. I did **not** change it:
it is outside the bounded task, and its correctness is a contrast question I
have not investigated. Command to re-derive:
`grep -n "bo-theme" apps/docs/scripts/check-claims.mjs`.

My own new pair is now guarded against exactly this — a check asserts the light
and dark cases rendered **different** body backgrounds, so a pair that measures
one thing twice fails.

## Red-proofs — five guards, isolated copies, shared source never edited

Each ran a mutated copy `scripts/check-claims.rp-N.mjs`, confirmed the injection
landed **in the rendered artifact** and not merely in the file, then deleted the
copy.

| # | Injection | Target | Result |
|---|---|---|---|
| 1 | Region forced `hidden` before the AX read | exposure check | **RED** — `ignored:true`, `["notRendered"]`, `role:none`. 2 of 222 failed; the second is named collateral (a hidden region has zero height). |
| 2 | Region removed between the two saves | lifecycle check | **RED** — `second: null`, `pageErrors: ["Cannot read properties of null (reading 'replaceChildren')"]`. 1 of 222. |
| 4 | `extraButton: false` while still asserting `expectRows: 2` | 2-row wrap | **RED** — `barRows:1, barButtons:2`. 1 of 222. Proves the rows are measured, not assumed. |
| 5 | `#df-notes` collapsed to a 0×0 box, still focusable | six geometry checks | **RED** — all six; 12 identical `hasSize:false, centreHitsSelf:false` steps (6 scenarios × 2 directions), `refPresent:true` throughout so the zeros are not vacuous. Exactly the case the old `!hasSize` escape passed. |
| 3 | Region made a fixed bottom overlay | six geometry checks | **running at the time of writing — result appended below when it lands.** |

All four completed proofs report **DISCRIMINATES**: the target went red, nothing
unrelated did.

Two instrument notes from those runs, both worth carrying: `ls` is aliased to
`eza` in this environment and rejects the argument form, so `ls … | grep -c` can
return a confident **0** from empty input — a dead detector. `/bin/ls`, `find`
or `test -e` instead. And `grep -cF` with a multi-line pattern counts matching
*lines* as separate alternatives, not block occurrences.

## Verification

- **`npm run check:claims`: 223 of 223 pass, exit 0** — up from the 219 you ran.
  Net +4: six geometry checks rebuilt in place, plus the walk self-test, the AX
  exposure check, the lifecycle check and the theme-distinctness check.
- **`npm run docs:build`: green**, all gates including `check:repo`,
  `check-page-shape`, `check-markup`, `check-metadata`, `check-links`.
- **Live, four combinations** (1440 and 390 × light and dark), via `serveDist`
  on an ephemeral port: region present with `role="status" aria-live="polite"`,
  exactly **one** `.bo-alert` after **two** saves, text reading `(save 2)`, zero
  dismiss buttons, field below the region. Section screenshots kept in the
  scratchpad.
- The existing toast checks, the drawer subset and the sticky subset are
  **untouched and still passing** inside that 223.
- The MEASURED REFUSAL check (the withdrawn 9rem offset reproduced via isolated
  override) is preserved unchanged and still green.

**Build identity for your snapshot refresh:** rebuilt from this working tree
after the edits — `npm run build` then `npm run docs:build`, both exit 0,
`apps/docs/dist` regenerated. Working tree dirty, nothing committed, base
`6b72a778`.

## Preview

I did **not** touch port 8081, your PID 5162, any container, or the podman
machine. All my browser work ran on `serveDist`-assigned ephemeral ports.

## Limitations, stated

- No screen-reader test was run. The claim asserted is exposure before write,
  not that any AT speaks it.
- The traversal result is about `/patterns/detail-form` with this composition —
  it is not a general property of in-flow content, and the prose now says so.
- Six bounded geometry scenarios, as you specified; no larger matrix.
- Chromium only. The four-Tab-stop date behaviour is a Chromium detail; the
  terminal-bounded walk is written so another engine's different count does not
  silently shorten the walk.
- `check-claims.mjs:1070`'s wrong theme key is reported, not fixed.

## Changed paths

`apps/docs/src/pages/components/alerts.astro`,
`apps/docs/scripts/check-claims.mjs`, and this reply. Nothing else.

No commit, push, publication, release, permission change or next task has been
taken or is assumed.

## Red-proof 3 — landed, and it is the interesting one

Slot 3 (region forced to a fixed bottom overlay) came back **GREEN: 0 of 223
failed**. Under this project's rule a green red-proof is a defect in the
**injection** until shown otherwise, so it was diagnosed rather than accepted.

**The injection did land** — measured, not inferred: computed `position: fixed`,
`zIndex 9999`, rect `{x:0, y:799, w:390, h:45, bottom:844}` on an 844px
viewport, no fixed-containing-block ancestor, and `elementFromPoint(195, 839)`
resolving **into** the alert. A real overlay, genuinely on top.

**It never covered a focused control, and the reason is a framework value.**
The scroller carries **`scroll-padding-block-end: 96px`**, so Chromium's
sequential-focus scrolling never parks a focused control within 96px of the
viewport bottom. Across all 28 walk steps the greatest control `bottom` was
**744**; the overlay band is **799–844**. A 45px overlay sits entirely inside
the 96px focus gutter the framework already reserves — on top, and in dead
space. This is the "injected element lands where the check cannot see it"
failure mode, the same family as the alt-less 0×0 `<img>` and the injection
that landed in an HTML comment.

**Control run, to show the guard is not asserting a constant.** Same overlay
plus `min-block-size: 480px`, which reaches past the gutter:

```
claims check FAILED — 6 of 223 documented behaviours do not hold
```

Exactly the six targets, nothing else. `refOverlap` non-zero as required —
8176, 12848, 42340, 4518.94, **1480.94** — `centreHitsSelf:false` on most
controls, and `emptyRegionTakesNoSpace:false`. The 1480.94px² figure is the
same magnitude as the `Quantity for Standing desk` obstruction you measured on
the withdrawn 9rem offset, which is a useful independent cross-check that the
instrument is measuring the thing you measured.

**Verdict: the prescribed injection was defective; the guard DISCRIMINATES.**

Two consequences worth recording:

1. **A correct injection for this guard must exceed the 96px
   `scroll-padding-block-end` gutter**, or be pinned directly over
   `.bo-form-actions`. Noting it so the next person does not repeat the
   45px attempt and read the green as safety.
2. **That gutter is part of why this composition measures clean**, and it is
   *not* what makes the sticky action bar safe — the bar sits in the gutter by
   design rather than being scrolled into it, which is why the original toast
   covered `Save` at 100% while a same-sized overlay cannot reach a focused
   field. I have **not** put this in the page prose: it is a second mechanism
   and the prose is deliberately limited to what was traversed. Raising it as
   a candidate for the layouts contract, which is yours.

With slot 3 resolved, all five guards are proven: four discriminate directly,
and this one discriminates once injected past the gutter.

**Final state: `check:claims` 223/223, exit 0; `docs:build` green; no stray
`check-claims.rp-*.mjs` left in `apps/docs/scripts` (verified with `find`, not
with `ls | grep`, for the aliasing reason noted above).** Changed paths remain
`components/alerts.astro`, `check-claims.mjs`, and this reply. Nothing
committed, pushed or published.
