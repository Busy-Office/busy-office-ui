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

Last updated 2026-08-26 23:10, HEAD `a5ffae3`. Working tree clean, main pushed,
CI and Pages green. npm serves **0.5.0**.

**Three owner-blocked items are the ENTIRE backlog** — the dispatcher reaches
its halt rule immediately. Do not try to work around them:

- **112.3** — the pattern-fit pilot. Needs 5–8 owner-written screen briefs with
  sealed picks; scaffold ready at `.roundtable/pilot-112/`. An external review
  independently made this its P1.
- **112.4** — Screen Contract layer, gated on 112.3's verdict.
- **AT runtime evidence** — needs a human listening to a screen reader.

**One decision waiting, and it is not a roadmap item.**
`@busy-office/create-ui` was built, gated and committed on 2026-08-26 but is
**NOT published**. `npm create @busy-office/ui` therefore works only from this
repo. Publishing is owner-triggered, as every release is.

**What landed 2026-08-26** (a long session; `.roundtable/loop-log.md` has each
iteration): Slice 145 closed the screen-scoring system; Slice 146 fixed the
object-page sticky bar twice and found the Pages deploy had been failing for a
week on a README stamp, not the HTTP 503 the roadmap had blamed for six days;
Slice 147 gave the ERP suite a front door (`/getting-started/screen-kit`, 28
screens served at `/suite/`); Slice 148 triaged an external review — tests split
into 25 files, the scaffolder, and a measured refusal to reorganise the build
chain.

**Two things a fresh wake should know that the files state but are easy to
miss.** `check:quickstart` and the docs container both now depend on
`examples/erp-suite`; the container broke twice on 2026-08-26 for that reason,
so **run `podman build -f apps/docs/Containerfile` before pushing anything that
changes what the docs build reads**. And the Standardize counter cannot fire
while the backlog is empty — it counts Continue rounds, and Continue needs an
unblocked build item. That is a known dispatcher flaw, recorded, not fixed.

