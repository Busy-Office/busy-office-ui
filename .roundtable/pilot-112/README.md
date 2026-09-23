# 112.3 pattern-fit pilot — owner briefs

The protocol is pre-registered in ROADMAP 112.3 and the owner confirmed it
on 2026-08-23. This directory is the scaffold; **the loop wrote this README
and the template only — every brief and every pick must be the owner's.**

## How to fill this in (~30 minutes)

1. Write **5–8 briefs** into `briefs.md`, one block each, from your own ERP
   memory. Two or three sentences per brief is enough: who the user is,
   what they are trying to get done, roughly how much data. Do NOT name a
   pattern, a component, or any `bo-*` class in the brief — the brief
   describes the JOB; picking the screen is exactly what the pilot tests.
2. Put your own pattern pick for each brief into `SEALED-PICKS.md` —
   one line per brief (`BRIEF-1: reconciliation`). **The loop will not
   open that file** until every pilot run is recorded; the pilot agents
   never see it at all.
3. Say "briefs ready" in chat. The loop then runs the pre-registered
   protocol: one fresh agent per brief, given ONLY the brief text plus
   `llms.txt` (one control brief re-run with nothing but the npm README),
   failing briefs re-run twice with the ≥2-of-3 variance guard, the full
   failure taxonomy scored, and the verdict applied — wrong-pattern picks
   vs your sealed answers on ≥2 briefs admits the Screen Contract layer
   (112.4); below that bar it is refused and recorded.

## Why the loop cannot help write the briefs

If the loop authored a brief, it would later grade agents against a
scenario it framed itself — marking its own homework, the exact failure
the pilot exists to detect one level up. The briefs' value IS that they
come from outside the docs' own vocabulary. (Decided when the owner's
challenge to a loop-drafted example — "shouldn't a duplicate check handle
that?" — showed exactly the kind of scrutiny the briefs need built in.)


## Pending instrument change — 373.7 (2026-09-21)

The accepted owner-directed AI composition work now assigns a bounded change to
llms.txt and the pasteable instructions: point to the existing shells/router,
state shell → pattern → components → verify, and name the existing consumer
validator from one shared command source. This changes the pilot's input;
it is not a pilot result and does not admit 112.4. Briefs and sealed picks remain
owner-only and were not read or authored for this work.

Baseline accepted build: `2026-09-21T12:44:38.784Z`, base `6b72a778`, dirty=true.
**Re-reproduced 2026-09-23 against current HEAD**, because that base is now
three slices stale and a delta quoted from a moved baseline is not a delta:
reverting only 373.7's five files and rebuilding gives 49,982, restoring them
gives 50,538. **+556 either way**, so the figure below stands on today's tree
rather than on the build it was first taken from.
`apps/docs/dist/llms.txt`: **49,982 bytes**, SHA-256
`507fff7ea26e75c2ea23ebf838733cb8d8a12db39544827342842c3fcfdedfbc`.
Assignment: `.roundtable/exchange/from-codex/boui-agent-composition-20260921-01.md`.
The changed instrument was **pending** when this was written and the review it
awaited never happened — the two-agent arrangement it belonged to was retired
(`history-two-agent-2026-09.md`). No run or verdict is claimed.


### Instrument change accepted locally — 2026-09-21

The bounded 373.7 change is now independently accepted in build
`2026-09-21T13:25:38.091Z`, base `6b72a778`, dirty=true. llms.txt is
**50,538 bytes (+556)**, SHA-256
`e9c1ef20aa50ba8d57270c372c2b0c374dfb50ed5b336270835b76cd418e9689`.
The 49,982-byte baseline is an unchanged prefix; only the composition-order
section, three existing page references and validator command/context were
appended. Any later pilot must record the actual instrument it receives;
results against an older input cannot silently stand for this one.

Codex verified packaged execution, valid/invalid markup and four rendered
viewport/theme cases. This records a changed input, **not** a pilot run, outcome,
or authorization for 112.4. Owner-only briefs and sealed picks remain untouched.
Evidence: `.roundtable/exchange/from-codex/boui-agent-composition-acceptance-20260921-01.md`.
