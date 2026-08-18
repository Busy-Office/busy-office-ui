# Resume state — read this at Step 0 of every wake

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

Ordinary state — what is queued, what is done — lives in `ROADMAP.md` and
`.roundtable/loop-log.md`. Only put things here that those two cannot say:
uncommitted work, and a decision made but not yet written down.

---

## In flight: nothing

Last updated 2026-08-18 after 37.1 landed.

## Owner-blocked (re-stated each grill, not re-queued)

- **`npm publish -w @busy-office/ui`** — 0.2.0 is tagged, `npm pack`-verified and
  CI-green; the registry still serves **0.1.1**. npm in this environment is
  unauthenticated (E401), so publishing is owner-triggered and cannot be done
  from a wake. Everything from Slice 24 onward is in the repo and in nobody's
  `node_modules`.
- **30.4b** — scope for the windowed list (the 50,000-record ask) is an owner
  call; the framework half is specified, the server-chunking half is not.

## Open questions awaiting the owner

- **30.0** — the "advanced editable table with different data types" half is
  still ambiguous. (The "horizontal tabs" half was answered 2026-08-18: it meant
  **vertical** tabs, shipped as 36.1.)
- **37.1 rubric — awaiting owner sign-off before 37.2 scores anything.**
  `.roundtable/surface-review-rubric.md` is committed; the open questions are the
  weights and the outcome set. Correcting it after 55 rows are scored means
  scoring them twice, so 37.2 should not start until this is answered — or until
  the owner says to proceed on the rubric as written.
