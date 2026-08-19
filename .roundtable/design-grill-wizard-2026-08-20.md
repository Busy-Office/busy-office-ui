# Design grill — /patterns/wizard (2026-08-20)

Batch 5 of the /design-grill sweep (roadmap 58.1) — final batch. Measured
live, bind-mounted container, both themes, plus reading `wizard.ts` directly
to settle a claim source-checking alone couldn't confirm.

## Step 1 — the decision

**Was missing.** The opener explained the mechanism (one panel at a time,
Back/Next) and contrasted it with `detail-form`, but never who's filling it
out or what a completed wizard looks like. Reworded: *"Who uses it: whoever
is creating something too long for one screen, guided rather than dropped
into a form — most often a first-time or occasional flow. What 'done' looks
like: every step completed or explicitly skippable, submitted once, and
resumable if abandoned partway."*

## Findings

**Anatomy claimed a capability `initWizard()` does not implement.** Item 1
said *"completed steps are navigable."* Checked `wizard.ts` directly rather
than trusting the docs prose: the only click handler wired is for
`[data-wizard-next]`/`[data-wizard-back]` — there is no handler for
clicking a completed step's marker, and the markup contract itself uses
plain `<span>` markers, not buttons, so even a future click handler
couldn't make them keyboard-reachable without a markup change too. This
isn't a demo/prose mismatch like the rest of the sweep's findings — it's a
claim about the shipped framework's actual capability, and the capability
doesn't exist. Reworded to say plainly what IS true (a completed step
shows its done state) and name exactly what isn't wired (click-to-jump,
`initWizard()` only handles Back/Next today) rather than removing the
Anatomy item outright — a reader planning a wizard needs to know this is a
real gap to build around, not that the anatomy element itself is wrong.

**Not implemented here.** Click-to-jump-to-a-completed-step is a reasonable
feature (common in checkout-style wizards), but it needs a markup contract
change (markers become buttons) plus the same accessibility care every
other interactive element here gets — a considered addition, not a
same-wake patch to close out a docs-only finding. Not queued as a build
item: unlike 58.3/58.4, this is a missing feature, not a bug in something
already shipped, and this batch's Accept criteria are documentation
accuracy, not new framework surface.

## What's already strong

- **The stepper/panel sync is genuinely proven, not just claimed**:
  `check-claims.mjs`'s wizard check drives real Next/Back clicks and
  asserts the stepper mark, the visible panel, AND focus all move together
  — not eyeballed from a screenshot.
- **The States table's "Cross-step validation" row names the exact failure
  mode**: *"if step 3 invalidates step 1, say WHICH step and link back to
  it"* — a specific, non-obvious requirement most wizard docs skip.
- **"Partial persistence" is stated as a design commitment with its own
  reasoning**: each step posts as it completes, "so a closed tab loses at
  most one step" — not just "save progress," but why per-step beats a
  single final save.

## Verdict per element

| element | verdict | why |
|---|---|---|
| Opener | **fixed** | added Who/What-done framing |
| Anatomy "completed steps are navigable" | **fixed** | claimed a capability `wizard.ts` doesn't implement; reworded to name the real gap |
| Stepper/panel sync | **keep** | proven by check-claims.mjs, not just described |
| Cross-step validation States row | **keep** | names a specific, non-obvious requirement |
| Partial persistence | **keep** | design commitment with its own stated reasoning |

## Recommendation

Opener fixed; one real capability-overclaim fixed by reading the source
behavior directly rather than trusting the docs. No new framework surface
built this wake — a real click-to-jump feature is a separate, considered
addition if the project wants it.
