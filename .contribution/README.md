# The owner-supplied upstream contribution, landed for READING only

This folder exists so `294.2` can be worked at all. It is **not** a merge and
**nothing here is adopted** — that is the item's own first clause, *"adopt none
on arrival"*.

## Why it is here

`294.2` sat as the oldest cloud-takeable item through **eleven hand-offs**
before Slice 316 diagnosed it: the six proposals live in an owner-supplied
`busyofficeui_Design_System.zip` that no wake in this repo could read, so
ranking them would have meant inventing verdicts. The blocker was the material
being unreadable, not the work being hard.

That is the same defect `321.1` filed against the gauntlet artifact: a verdict
whose evidence lives in a session scratchpad is a verdict nobody can check.
Landing the folder on a branch fixes the class, not just this instance.

## What this branch is, and is not

- **It is** the zip's `upstream-contribution/` tree, byte-for-byte, so every
  verdict in `294.2` cites a path a later reader can open.
- **It is not** on `main`, and must not be merged there as-is. The proposals
  are ranked in ROADMAP `294.2`; anything adopted lands as its own change,
  through the normal gates, in the repo's real paths.
- **No secrets**: scanned before committing. The only `token` matches are
  `semantic token tier` in prose — design tokens, not credentials.

## What the contribution itself says

Its own `CLAUDE.md` orders the six proposals for independent revertability and
names its own blocked PR as blocked, which Slice 294's triage verified and did
not dispute. Its React wrappers were deliberately excluded by its author: *"the
design tool needed them; the product does not."*
