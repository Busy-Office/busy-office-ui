# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and two advisory checks run from `record_iteration.py` — the charter
> check and `check:resume-slice-ids`. Both REPORT on stderr; neither fails a
> build (roadmap 175.3).

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

---

## In flight: nothing

Last updated 2026-08-29 (**cloud** wake — rule 2 → Standardize, two rounds:
`208.1` and `208.2`, plus `208.3` filed OPEN). Working tree clean at hand-off;
one push.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md                # 6 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs       # names the closed ids
```

`check:resume-slice-ids` will report `208.1` and `208.2` as closed ids named
here — **historical references** (the "what landed" section), not claims that
they are open. `208.3` genuinely is open.

**No collision on this item.** `origin/main` was at `eceffbc` at Step 0 and
still at `eceffbc` at the mandated re-fetch before the first commit.

**Trap 1 fired for real this wake.** The container started on a detached HEAD
(`git branch --show-current` empty) with a *stale-by-force-update* `origin/main`
(`+ 17b3ba6...eceffbc (forced update)`). Recovered at Step 0 with
`git checkout -B main origin/main`, before any commit — which is the whole point
of running the check there rather than at push time.

## What landed this wake

**208.1 — Standardize sweep.** Lanes 1-3 clean for the fifth consecutive time
(0 dead of 1,433 inline declarations; 8 css-repeat groups matching the standing
table of eight exactly; 14 flagged prose pages, all already verdicted).

**Lane 4 — `report_loop_prose.py` — carried the finding, and no sweep since 191
had read it.** Its ratchet block read `ROADMAP.md 66 up, last cut 2ae54a4a`, and
the live file was **67.5% closed history**: 32 closed slices carrying 4,336 of
6,424 lines.

**Fifth archive sweep executed:** `ROADMAP.md` **6,424 → 2,184**,
`ROADMAP-archive.md` 21,264 → 25,633; 32 slices (173, 175-199, 202-207) moved
verbatim behind the standing one-line pointer. Proved a **lossless move**, not
an edit, against the `HEAD` blobs: archive old content is a byte-exact prefix
(`True`), **0 of 4,272** lost live lines missing from the archive gain, and the
live file gained *only* its 32 pointer lines. `check:slice-refs` reads an
identical **415 citations / 228 cited / 189 headings** on both sides.

**The meta-finding, and the fix.** Every Standardize sweep since 191 — 194, 197,
202, 206, the complete list — ran 3 of the playbook's 4 lanes; 206's own text
says *"all three standing lanes"*. `LOOPS.md` step 1 now numbers them
`Lane 1 of 4` … `Lane 4 of 4` and asks the write-up to say `n of 4`. A gate was
**refused** on 94.11's base-rate ground (the property is semantic — naming the
script while skipping it satisfies any text check).

**Measurement corrected mid-write, twice.** A first `awk` range parser bled
across section boundaries and returned three different non-zero lane-4 counts;
re-derived per-section in Python it is 0 of 4. And the `/concepts/scale/` prose
verdict is **Slice 178**, not 196 as first written.

**Round 2 — `208.2`, the same drift shape one level up.**
`ENVIRONMENT.md`'s cloud-wake toolchain named **7** commands while `ci.yml`
runs **19**, and the previous wake's own commit message records
`check:formatting` reaching CI unrun *because that list did not name it*. Every
unnamed command was RUN rather than assumed: **16 green**, and the list is now
derived from `ci.yml` with the re-derivation command beside it. Two are not
runnable here — `docker build` (the binary is at `/usr/bin/docker`, the daemon
is absent, and `command -v` succeeding is not evidence) and `check:po-app`.

**`208.3` filed OPEN — `check:po-app` is RED here on a commit CI reports
green** (run 656 on `eceffbc`, `success`). One behaviour of 18, byte-identical
payload across three runs: only `chunk0Evicted` is false. **The timing
hypothesis is refuted** — a throwaway probe with the eviction loop at 40
iterations instead of 10 gave a byte-identical payload. Which environment is
right is NOT established, and the item says so; it is not a P0 (main is green,
nothing shipped changed, and it is the reference app).

**NOT VERIFIED and named as such:** no Podman, no `localhost:8081`, **no
screenshots at 1440px or 390px in either theme**. It costs nothing here —
**zero lines changed under `packages/` or `apps/docs/src/`**; the whole diff is
markdown.

## Dispatcher state at hand-off

Re-run `python3 scripts/loops/dispatch_status.py` rather than trusting a
snapshot taken before this wake's row was recorded.

**Next wake: rule 4, oldest open non-blocked item.** Six open checkboxes across
five slices:

| item | what | notes |
|---|---|---|
| `200.7` | lint check for hand-written durations outside the token scale | **oldest non-blocked — rule 4 picks this**; read 201.4 first |
| `201.4` | 200.7's proposed gate mostly duplicates `check:motion` already shipped | either outcome closes it |
| `208.3` | `check:po-app` red in cloud, green on CI; cause unestablished | newest; **wants a LOCAL wake** — its Accept asks for a third environment |

200.7 and 201.4 are cloud-takeable (a script, and a measurement plus a written
verdict); neither needs a rendered image. 208.3 is not blocked on the owner or
on a screenshot — it is blocked on an environment this container is not.

Owner-blocked, unchanged: **112.3** (pilot briefs), **112.4** (blocked on
112.3), **AT runtime evidence** (owner hardware).

## Direction

Nothing blocked on the owner that a wake could advance; the three owner-blocked
items above are the standing set and are unchanged by this wake.

One judgement worth an owner's eye, not a blocker: the archive sweep is now on
its **fifth** run in eight days, and the interval is not lengthening — the live
file regrew from 2,030 lines (`2ae54a4a`, 2026-08-28 18:41:42Z) to 6,424 at this
wake's HEAD (2026-08-29 17:17:16Z): **+4,394 lines in 22h35m**.
This wake fixed the *detection* gap (lane 4 was going unread) but not the
*regrowth rate*, which is a property of how much prose each slice writes into
`ROADMAP.md`. If the owner would rather slices were terser, that is a writing
rule for `CLAUDE.md`, not another sweep.
