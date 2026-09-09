# 332.1 — does every `ENVIRONMENT.md` section still describe a trap that can bite TODAY?

Cloud wake, 2026-09-08. Tip at Step 0: `731beff2`. Every figure below was
produced by the command printed beside it, in this container, this wake.

`332.1`'s Accept: *"each section either still describes a trap that can bite a
wake TODAY, or moves to `LOOPS-archive.md` with a pointer. **Finding that all 18
still bite is a satisfying outcome** and closes this … Measure before cutting: a
section whose trap is fixed in the toolchain is the only safe cut."*

**Verdict: 17 of 18 live, 1 dead.** The dead one is **§3**, and it is exactly
the kind the Accept names — a trap fixed in the toolchain, not an untidy
section. It is corrected in place rather than deleted, because a **live hazard
pointing the opposite way** occupies the same ground and nothing else describes
it.

---

## Part 0 — the premise, re-checked before it was used

`332.1`'s premise is a measurement taken by an earlier wake, so re-checking it
is part of the criterion (CLAUDE.md), not a courtesy. The item claims
**391 → 731 lines, 3,130 → 6,316 words, 14 → 17 sections since the last cut**.

```
# walk every revision of the file and size it AT that revision
git log --format=%H --follow -- .roundtable/ENVIRONMENT.md
git show <sha>:.roundtable/ENVIRONMENT.md   | wc -l / split() / grep -c '^## '
```

| revision | date | lines | words | `^## ` |
|---|---|---|---|---|
| `f52f2597` (the 169.3 split) | 2026-08-28 | 229 | 1,666 | 12 |
| `1005d1db` (the "last cut") | 2026-08-30 | **391** | **3,130** | **14** |
| `0879ec3d` (332.1's own reading) | 2026-09-07 | **731** | **6,316** | **17** |
| `731beff2` (this wake's Step 0) | 2026-09-08 | **789** | **6,861** | **18** |

**The premise reproduces exactly at both of its endpoints** — 391/3,130/14 and
731/6,316/17 — so it is confirmed rather than assumed, and it has kept moving:
**+58 lines, +545 words and +1 section in the one day since the item was
filed**. 28 revisions total; 229 → 789 lines is **3.4x in 11 days**.

The one section added since the item was filed is **§6d** (`c93ee1de`,
2026-09-08, Slice 347) — which is itself a trap that cost a wake 20 minutes,
i.e. the growth is the environment being hostile, not the file being untidy.

---

## Part 1 — the method, and the control that shows it can say DEAD

For each section: name a command whose result decides whether the trap's
**precondition is live in this container today**, run it, record the output.

A verdict of "17 of 18 live" is close enough to a 100% to be a defect until
proven otherwise, so the method was tested against claims already known to be
dead. **It returns DEAD for both:**

```
CONTROL A  ls apps/docs/scripts/check-boost.mjs      -> No such file (deleted f1be2485)
           §1c's superseded "docs:build (check-boost.mjs)" consumer -> DEAD
CONTROL B  check:repo includes 'resume-charter'?     -> false
           grep -n resume-charter .github/workflows/ci.yml -> 2 hits, BOTH comments
           "check:resume-charter fails your CI build" -> DEAD (169.4 demoted it)
CONTROL C  check:repo includes 'vendor-names'?       -> true, and it ran green -> LIVE
```

**Stated precisely, because the controls are weaker than the verdict:** they
discriminate at the level of a *claim inside* a section, not at the level of a
whole section — no whole section is known-dead, so no section-level control
exists. The section verdict is the OR over its claims.

The stronger evidence that the method is not a rubber stamp is that it produced
**three corrections inside sections it ruled live** (Part 3). A method that
could not fail would have found none of them.

---

## Part 2 — the 18 sections

`BIT` = the trap actually fired on this wake. `LIVE` = its precondition
reproduces on demand here. `DEAD` = fixed in the toolchain.

| # | section | verdict | the command, and what it returned |
|---|---|---|---|
| 1 | detached HEAD | **BIT** | `git branch --show-current` → **EMPTY** at Step 0; container arrived detached at `d8767657`. Fixed with `git fetch origin main && git checkout -B main origin/main`. |
| 2 | §1b bash cwd persists | **BIT** | call A `cd apps/docs && pwd` → `/home/user/busy-office-ui/apps/docs`; **call B, with no `cd` of its own, started there**. The harness printed its own "Primary working directory … (was …)" notice. |
| 3 | §1c `CHROME_PATH` | **LIVE** | **0 of 4** resolver candidates exist here (`/usr/bin/google-chrome`, `/usr/bin/chromium`, `/usr/bin/chromium-browser`, the macOS path). Every browser gate this wake was run with the export in the same command. **Count moved 15 → 17 — see Part 3.** |
| 4 | §2 shallow clone | **BIT** | `git rev-parse --is-shallow-repository` → `true` at **50** commits. After `--unshallow`: `false`, **2,089** commits, **8** tags. |
| 5 | §2b `shallow.lock` | **LIVE** (red-proved) | Did **not** bite this wake — the unshallow completed. Red-proved on a throwaway `git clone --depth 1`: inject a 0-byte `.git/shallow.lock` → `fatal: Unable to create … shallow.lock: File exists`, `is-shallow` still `true` at 1 commit; `rm -f` + re-run → `false`, **2,089**. The refusal names the lock in its **first** line, as the section warns. |
| 6 | §3 `astro build` does not clear `dist` | **DEAD** | **See Part 3.** Sentinel file *and* sentinel directory both **REMOVED** by a bare `npx astro build` (v5.18.2). |
| 7 | §3b hand-off is gated content | **LIVE** | `grep -E '^\s*paths-ignore\s*:'` → **0 active keys** in all three workflows (`ci.yml`, `pages.yml`, `publish.yml`). A `.roundtable`-only push runs the full suite, so the §3b re-run rule holds. |
| 8 | §4 prettier is not the formatter | **LIVE** | No `.prettierrc*`, no `prettier.config*`; `"prettier"` appears **0** times in the root, docs and core `package.json`. |
| 9 | §5 `loops.db` absent in a fresh container | **LIVE** | `ls .roundtable/loops.db` → No such file; `git check-ignore -v` → `.gitignore:13`. The mirror did not exist until this wake recorded. |
| 10 | §6 background output ≠ completion | **LIVE** | Launched `start/sleep 20/end` in background, read the file mid-flight: it held `start 22:32:37` and **no `[exited with code 0]` marker**. |
| 11 | §6b `3 NOT VERIFIED` is the container | **LIVE** | `check:claims` → **176 live · 3 NOT VERIFIED**, the gate naming `(hover: hover) and (pointer: fine) = false` itself. Identical to the documented reading. |
| 12 | §6c the 15px reservation | **LIVE** | Browser probe on `/patterns/list-report/`: `main.bo-app-shell__main` **1216 − 1201 = 15** at 1440 and **390 − 375 = 15** at 390; `window.innerWidth − documentElement.clientWidth` = **0** (the check that finds nothing); `.bo-data-table-container` **913 × 384** — the documented container figure, to the pixel. |
| 13 | §6d short sha answers `200` empty | **LIVE** | 9-char `731beff23` → HTTP **200**, `total_count` **0**. Full sha → **2** runs. |
| 14 | §7 bare `wc -w` undercounts | **LIVE** | `printf 'alpha — beta\n' \| wc -w` → **2**; with `LC_ALL=C.UTF-8` → **3**. `LC_ALL`/`LANG` both **unset** here. |
| 15 | §8 intake commands | **LIVE** | `command -v gh` → nothing. The REST substitute ran as this wake's Step 1: `200 len 1` / `200 len 0` / `404`. |
| 16 | Cloud-wake toolchain list | **LIVE** (operating instruction) | Re-derived from `ci.yml`: **17** vs the file's **17**, and the sets differ by exactly the two documented pairs — `build -w docs`/`docs:build` and `check:ci-ignores` (confirmed inside `check:repo`) / `test -w @busy-office/ui` (confirmed spelled `npx vitest run --root packages/core` at `ci.yml:122`). The section's own *"do not read the two 17s as a match"* is correct and still needed. |
| 17 | Traps worth carrying forward | **LIVE** | 11 bullets. Spot-checked: Astro **5.18.2** still the compiler (the frontmatter-hoisting bullets stand); the 40-char-pathname bullet's inline count is **stale — see Part 3**. |
| 18 | Standing owner instruction | **LIVE** | `check:vendor-names` is inside `check:repo`, which ran green in `docs:build` this wake. |

**16 live + 1 dead + 1 live-operating = 18**, asserted rather than left to the
reader.

---

## Part 3 — three corrections, all inside the audit's own scope

### A. §3 is DEAD as written, and a live hazard points the other way

The section says *"`astro build` does not clear `dist`. `rm -rf apps/docs/dist`
first."*

```
echo x > apps/docs/dist/__sent-A.txt
mkdir -p apps/docs/dist/__sentdir && echo x > apps/docs/dist/__sentdir/__sent-B.txt
npx astro build            # in apps/docs, ISOLATED from the 30-step chain
  -> dist/__sent-A.txt           REMOVED
  -> dist/__sentdir/__sent-B.txt REMOVED
npx astro --version -> astro v5.18.2
```

The removal was **isolated to `astro build` itself**, which matters: the docs
build is a 30-command chain, and attributing this to the wrong step would be the
defect. Checked directly — **no `rm -rf`/`rimraf`/`del` in any docs script**, and
**no `outDir` or clean setting in `astro.config.mjs`**.

**The declared dependency never moved**: `^5.1.0` is the only value across all
40 commits touching `apps/docs/package.json`, and the section was written on
2026-08-28. So if this behaviour changed, it changed **under the repo via a
floating minor**, with no commit to point at. Whether the claim was true when
written is **not established here** — that would need an old astro installed,
and it is not what the Accept asks.

> **CORRECTED by Slice 364 (2026-09-09):** the count above is **67**, not 40 —
> at this report's own commit `13545b20` as well as at HEAD, and identical under
> `--first-parent`, `--follow`, `--no-merges` and a distinct-blob count. The
> property the paragraph rests on ("`^5.1.0` is the only value") holds across
> all 67, so the argument is unaffected; only the denominator was wrong. It had
> been copied into `ENVIRONMENT.md` §3, where it is now the command instead.

**The live hazard the section does not describe, and it is the inverse.** Because
`astro build` empties `dist`, running one *by itself* silently discards
everything the chain adds afterwards — `copy-suite`, `highlight-code`,
`scope-search-index`, `pagefind --site dist`, `gen-llms`, `stamp-build-id`.
Measured on this wake's own dist immediately after the isolated run:

```
files in dist            224   (a full docs:build leaves 529)
pagefind artefacts         0
llms.txt                   0
```

A dist-reading gate or probe run in that state measures an **incomplete site
that looks built** — fail-open, the exact failure `serve-dist.mjs`'s own header
says it exists to prevent. So §3 is rewritten rather than removed, and the
superseded text goes to `LOOPS-archive.md` with a pointer, per the Accept.

*(Reconciliation: 530 files were counted with the sentinel present, 529 without
— the two readings agree exactly.)*

### B. §1c's consumer count is stale again: 15 → 17, and the sets now disagree

The section says *"Re-run it; the count is the reconciliation, not the list."*
Run this wake:

```
grep -rl 'browser-harness\.mjs\|resolve-chrome\.mjs' \
    apps/docs/scripts/*.mjs examples/erp-suite/*.mjs      # 17   (file says 15)
```

The file's **15 reproduces exactly at `605829ca`**, the commit it describes, so
the section was right and has drifted. Two consumers arrived since:

- **`measure-stress.mjs`** — a **new npm-script entry point** (`measure:stress`),
  which is the one kind the section says changes what a wake must export. It is
  **not** in `ci.yml`, so it is a run-by-hand consumer needing the export here.
- **`po-app-harness.mjs`** — **a false positive**. It matches only because a
  prose comment on line 4 names `browser-harness.mjs`; it imports no browser
  module and launches nothing.

**And the closure/grep equality the section rests on no longer holds as a set
equality**, though the counts agree:

```
one-level grep : 17
reach closure  : 17     (relative-import graph closed from the two seeds)
closure-only   : resolve-chrome.mjs   (the resolver itself — 0 self-mentions, the grep can never list it)
grep-only      : po-app-harness.mjs   (the comment match above)
```

Two opposite errors that cancel into a coincidental **17 = 17** — the same shape
the toolchain section already warns about with its own two 17s. Per the
section's own rule (*"if the two ever disagree, believe the closure"*), the real
consumer set is the closure.

### C. A carried trap pins a value that has drifted

*"31 pathnames in this repo are exactly 40 characters"* →
`git ls-files | awk 'length($0)==40' | wc -l` returns **30** today. The trap (a
40-char line is not necessarily a sha; NUL-split instead) is untouched and live;
only the pinned number is wrong. This is the same correction Slice 360 made to
§2's `git tag | wc -l  # 7 here`, and CLAUDE.md's criterion rule says to write
the property, not the value.

---

## Part 4 — this wake's own first outputs, both wrong

Recorded because CLAUDE.md treats a new instrument's first output as wrong until
checked, and both of these were:

1. **`grep -c 'paths-ignore' .github/workflows/ci.yml` returned 2**, which reads
   as *"paths-ignore is back"* and would have filed a false defect against §3b.
   Both hits are inside the comment block that explains its removal. The exact
   check is `grep -E '^\s*paths-ignore\s*:'` → **0**. A substring count answered
   a structural question — the repo's own *"assert on structure, never on raw
   text"* rule.
2. **The §6c probe crashed** (`Cannot navigate to invalid URL`) because
   `serveDist`'s return shape was guessed rather than read. It returns
   `{ server, port, base }`; the URL is `http://localhost:${port}${base}${path}`,
   as `check-layout.mjs:112` builds it.

The same suspicion was applied to Control B, whose `grep -c` also returned 2 —
both comments, checked rather than assumed, and the control holds.

## Part 5 — what this does NOT cover

- **No screenshots.** A cloud wake has no Podman. Nothing here rests on a
  rendered image; §6c is a DOM/geometry reading, which `ENVIRONMENT.md`'s own
  two-list split puts squarely in what a cloud wake *can* do.
- **The verdict is per section, not per sentence.** A live section can still
  carry a stale sentence — three were found, and there may be more.
- **Whether §3 was true when written is unresolved**, deliberately.
- **No section-level dead control exists**, only claim-level ones (Part 1).
