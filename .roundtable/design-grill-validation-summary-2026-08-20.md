# Design grill — /patterns/validation-summary (2026-08-20)

Batch 5 of the /design-grill sweep (roadmap 58.1) — final batch. Measured
live, bind-mounted container, both themes.

## Step 1 — the decision

**Was missing.** The opener led with the mechanism ("On submit, if the form
is invalid: list every problem field up top...") without naming who needs
this or what done looks like. Reworded: *"Who uses it: anyone filling a
form with more than a couple of required fields — worth it the moment a
reader could miss which field failed. What 'done' looks like: every
problem named in one place AND on its field, with nothing to hunt for."*

## Findings

**None.** Every Anatomy claim is already proven, not just asserted — this
page's own `check-claims.mjs` coverage is unusually thorough for a single
pattern:

- **Summary alert reveals on invalid submit** — verified live (real click,
  not a synthetic event).
- **Focus moves to the summary first** — verified.
- **Each entry links to and focuses its exact field** — verified.

This matches the exact discipline CLAUDE.md states for runtime claims
("Claims that assert runtime behavior must be executable") — the page
doesn't just say "try it," it's backed by a real check.

## What's already strong

- **"Document-level messages" section draws a sharp, testable line** — *"Can
  the user fix it by changing a value on this screen?"* decides field-error
  vs. document-strip, with a genuinely counter-intuitive example ("Vendor
  is blocked" is a FIELD error even though only the server could know it) —
  the kind of edge case that reveals the rule was actually load-bearing,
  not decorative.
- **"Deliberately not a message centre" names what the framework refuses to
  build and why** — a collected inbox is "what a screen grows when errors
  sit far from where the user is looking," which is Objective §3
  (composability over accumulation) argued from a specific failure mode.
- **The htmx `hx-boost` gotcha is dated and attributed to real dogfooding**
  ("found live while building this demo"), not presented as generic advice
  — this project's own build surfaced the bug the note now warns readers
  about.
- **The out-of-band swap example cites a real regression it prevents**:
  *"without the out-of-band swap the success response replaced the dialog
  body with a timeline and the real timeline never changed."*

## Verdict per element

| element | verdict | why |
|---|---|---|
| Opener | **fixed** | added Who/What-done framing |
| Summary reveal / focus-move / per-entry field-focus | **keep** | all three verified by check-claims.mjs with real clicks |
| Document-level messages test | **keep** | a sharp, testable rule with a genuinely counter-intuitive example |
| "Deliberately not a message centre" | **keep** | names a refused feature with the specific reason |
| `hx-boost` gotcha | **keep** | dated, attributed to real dogfooding |
| Out-of-band swap example | **keep** | cites a real regression it prevents |

## Recommendation

One opener fix for sweep consistency. Otherwise all-keep — this page's
claims are backed by the most thorough executable-claims coverage found in
the sweep.
