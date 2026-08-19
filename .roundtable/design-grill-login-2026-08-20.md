# Design grill — /patterns/login (2026-08-20)

Batch 4 of the /design-grill sweep (roadmap 58.1), alphabetical order.
Measured live, bind-mounted container, both themes.

## Step 1 — the decision

**Mild version of the sweep's recurring gap.** The opener explained the
screen's stakes clearly ("the one screen every ERP app has and the one
where getting the details wrong locks real users out") but didn't
literally name who or what done looks like — arguably near-tautological
for a login screen (everyone with an account, eventually), but reworded
anyway for consistency with the rest of the sweep: *"Who uses it: every
user, before anything else — the first screen and, for anyone who forgets
a password, a recurring one. What 'done' looks like: signed in, or told
exactly why not without leaking which part was wrong."*

## Findings

**None.** Checked every Anatomy claim against what's actually demonstrated:

- **"Brand block... the framework ships no logo component"** — the live
  demo has no brand block at all, but the claim explicitly says that's
  expected (BYO `<img>`), so its absence isn't a mismatch — it's the
  claim's own caveat holding.
- **"Secondary links... a cluster below the submit"** — the live demo has
  one link (Forgot password), not the two named as examples (reset
  password, SSO). Checked whether this is a real gap: the item names
  EXAMPLES of secondary links, not a required pair, and the structural
  claim (a cluster below submit) holds regardless of count. Not flagged.
- **Correct `autocomplete` tokens** — verified live: `username` on the
  email/username field, `current-password` on the password field, exactly
  as claimed.
- **Error region is server-rendered, not JS** — the demo can't prove a
  server round-trip, but the claim itself states the reason (survives a
  hard reload) rather than just asserting a mechanism.

## What's already strong

- **The security reasoning is specific, not generic advice**: "never which
  field was wrong (that's credential enumeration)," "no premature lockout
  messaging" with the exact reason (a rate-limit message needs a recovery
  path, not a dead end), "the password field never blocks paste" because
  paste-blocking breaks password managers. Each is a named failure mode,
  not a platitude.
- **States table separates "Invalid credentials" from "Account locked"
  explicitly**, warning against reusing the same copy for both — a subtle,
  correct distinction most login screens get wrong.
- **The markup sample's own comment explains a real CSS gotcha**:
  `.bo-widget` is a size container, so outside a `.bo-widget-grid` it needs
  an explicit width or `max-inline-size` alone collapses it — this is the
  kind of "why," not "what," comment CLAUDE.md's own commenting standard
  asks for.

## Verdict per element

| element | verdict | why |
|---|---|---|
| Opener | **fixed** | added Who/What-done framing for consistency, though the gap was mild |
| Brand block absence | **keep** | claim already caveats it as BYO |
| Secondary links (one shown vs two named) | **keep** | examples, not a required pair; structural claim still holds |
| `autocomplete` tokens | **keep** | verified live on both fields |
| Credential-enumeration / lockout / paste-blocking reasoning | **keep** | specific named failure modes, not generic advice |
| States: locked vs invalid-credentials separation | **keep** | a real, correct, non-obvious distinction |

## Recommendation

One consistency-only opener fix. No removal, no new surface. Genuinely a
near-all-keep page — the opener was the only thing worth touching.
