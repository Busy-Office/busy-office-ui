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
