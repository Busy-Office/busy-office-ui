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

Last updated 2026-08-29 (**cloud** wake — rule 4 → Continue, build mode:
**209.2**, which closed the last open item in Slice 209). Working tree clean at
hand-off; one push.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md                # 4 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs       # names the closed ids
```

`check:resume-slice-ids` will report `209.2`, `209.1`, `208.1`, `208.2` and
`201.4` as closed ids named here — **historical references** (this wake's
subject matter and its neighbours), not claims that they are open. `208.3` is
the only id named here that genuinely is open.

**No collision on this wake.** `origin/main` was at `6ca2327` at Step 0 and
still at `6ca2327` at the mandated re-fetch before the first commit.

**Trap 1 fired for real again**, fourth wake running. Container started detached
(`git branch --show-current` empty) with local `main` stale at `17b3ba6` and
`origin/main` arriving as a forced update (`+ 17b3ba6...6ca2327`). Recovered at
Step 0 with `git checkout -B main origin/main`, before any commit. The clone is
shallow and was left shallow — no finding this wake was a history measurement.

## What landed this wake

**`209.2` FIXED by shipping the filter**, which is the first of the two outcomes
its Accept allows. `check-rf-floor.mjs`'s `earliestChrome()` now applies
`!e.prefix || emitsPrefixed(e.prefix)` — `derive-floor.mjs`'s rule — and takes
the predicate rather than the sibling's bare boolean, because one at-rule name
can carry several prefixed entries. Whether the profile emits a prefixed form is
read **off the parse**: postcss names `@-webkit-keyframes` as an at-rule of its
own, so the presence of the prefixed name in the same walk is the answer.

**The premise was re-checked, not taken from the item**, and it reproduced
exactly: `@keyframes` is the only one of the six at-rules carrying a `prefix`
entry, and the built profile emits **no prefixed at-rule at all**. The Accept's
criterion — pass line agrees with a fresh BCD read — is met: `@container 105,
@keyframes 43, @layer 99, @media 1, @starting-style 117, @supports 28`, `1 above
108`, with `@keyframes` the only number that moved.

**Blast radius re-measured rather than trusted.** All four `FEATURES` probes are
single unprefixed support objects (`:user-invalid` 119, `color-mix()` 111,
`subgrid` 117, `:has()` 105), so the filter has no `prefix` key to act on there
and no verdict moves. The defect was in what the gate **publishes**, and in
nothing it decides.

**Red-proved both ways, and `--self-test` now carries it standing** — a
synthetic prefixed support array expecting `43` unemitted and `1` emitted,
itself red-proved against two degenerate implementations (`usable = entries`
reports `1 1`; `entries.filter((e) => !e.prefix)` reports `43 43`), so no single
direction can satisfy it alone.

**The first red-proof came back green and the injection was the defect**, which
is the base rate CLAUDE.md names: a `sed` whose replacement contained `||` broke
on the `s|…|…|` delimiter, wrote an empty probe, and the empty file exited 0.
The pre-flight `grep -c` on the replaced line read **0** and caught it. Redone
in Python with an explicit `assert count == 1`.

**`LOOPS.md`'s "Also settled" paragraph was rewritten, not left**, because it
stated the divergence in the present tense and would have read as current.
Refused inside this item: consolidating the two helpers — in scope as an option,
refused on that section's own "not the same table" ground.

**NOT VERIFIED and named as such:** no Podman, no `localhost:8081`, **no
screenshots at 1440px or 390px in either theme**. It costs nothing here — zero
lines changed under `packages/core/src/` or `apps/docs/src/`; the diff is one
build script plus markdown. Green in this container: core build (incl.
`check:rf-floor` + `--self-test`), core `npm run test` 151/151, `lint:css`,
`docs:build` rc=0 (incl. `check:repo` 9/9 and `check:slice-refs` 421 citations),
`check:claims` 158 live + 3 NOT VERIFIED (ENVIRONMENT.md §6b — the container's
pointer capability, not a regression), `check:formatting`, `check:scroll` 910
containers, `check:layout` 127 pages, `check:forced-colors`, `test:axe` 127
pages × 2 widths zero violations, `check:target-size`, `check:search`,
`check:pseudo`, `check:quickstart`, `check:selftests` 46 gates / 16 heuristic,
`create-ui` check, `suite` audit 28 screens. `check:po-app` NOT run — known RED
here per 208.3.

**`ci.yml` re-derived rather than trusted** (ENVIRONMENT.md says to): 17 entry
points, unchanged, and the one not in the cloud list is still `check:ci-ignores`
inside `check:repo`. Nothing to add.

## Dispatcher state at hand-off

Read **after** recording, which is the comparison `LOOPS.md` says has caught two
of that counter's five historical failures — re-run it rather than trusting this
snapshot:

```
python3 scripts/loops/dispatch_status.py
```

This wake's row is a `Continue` row and it closed Slice 209, so rule 2 advances
to `2 / 4` and rule 3 to `2 / 3 [200, 209]`. Neither fires next wake. Rule 5's
line reads `ok`, not STALE, so that rule is evaluable and reports nothing
regressed.

**When rule 4 is reached, four open checkboxes — and NONE is cloud-takeable.**
That is a change from the last three hand-offs, so say the kind of blocked
rather than "all blocked":

| item | what | kind of blocked |
|---|---|---|
| `208.3` | `check:po-app` red in cloud, green on CI; deterministic across two cloud containers | **browser-blocked in the narrow sense: a DIFFERENT ENVIRONMENT, not a rendered image.** Its Accept asks for a third environment, and a cloud container is another instance of the class that is already red. **A local wake takes this; it is the oldest such item.** |
| `112.3` | pattern-fit pilot | owner-blocked (briefs) |
| `112.4` | Screen Contract layer | owner-blocked (on 112.3) |
| AT runtime evidence | combobox behaviour on real AT | owner-blocked (owner hardware) |

**So a cloud wake next falls THROUGH rule 4** — report it as "one item is
environment-blocked and wants a local wake, three are owner-blocked", not as an
empty backlog — then rule 5 (`ok`, no dispatch) to **rule 6, Polish**.
`python3 scripts/loops/polish_requeue.py --check` reads **10 surfaces** whose
source moved — `alerts`, `calendar`, `dashboard`, `data-table`, `icon`,
`inline-editing`, `scan`, `sidebar-nav`, `stepper`, `tree-table` (`date` is
SKIPPED and correctly not re-queued) — so rule 6 has real input. The COUNT
matches the ten 176.1 refused a fix on; whether it is the same ten was not
checked, so do not read it as unchanged. Re-run it rather than trusting this
snapshot. Run `--apply` first, per the rule. **Read §3b's
`content: 3` paragraph before starting**: every re-queued surface scores 3 and
has no rankable weakness, so the round is a reconciliation of the published
artefact against the ledger — and **a no-op is a legitimate outcome, recorded in
one line**, not a licence to manufacture a fix.

## Direction

Nothing blocked on the owner that a wake could advance; the three owner-blocked
items above are the standing set and are unchanged by this wake.

**One thing for an owner's eye, and it is a change of state rather than another
instance of the last three hand-offs' theme.** The cloud lane has now run out of
build work: `208.3` is the only open non-owner item, and it is precisely the one
a cloud container cannot settle, because the container IS the environment under
suspicion. Cloud wakes from here will be Polish rounds on `content: 3` surfaces
— which §3b itself says are often no-ops. That is the loop working as specified,
not a fault, but it is the point at which **a local wake is worth more than
another cloud wake**: one local run takes `208.3` and answers a divergence that
has been open across two containers. Nothing to decide, and no gate proposed —
recorded so the asymmetry is visible rather than inferred from a run of quiet
hand-offs.
