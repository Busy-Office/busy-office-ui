#!/usr/bin/env python3
"""Run the Standardize sweep's four lanes, and refuse to call one clean when it
printed nothing.

WHY (roadmap 337.1). The sweep IS four commands typed by hand, and two of the
ways to mistype them are byte-silent:

    npm run -s scan:dead-style -w @busy-office/docs   # rc=1, 0B stdout, 0B stderr
    npm run -s scan:no-such-lane -w docs              # rc=1, 0B stdout, 0B stderr

The workspace is named `docs`, not `@busy-office/docs`, and `-s` swallows npm's
own `No workspaces found` / `Missing script` error along with the banner. Empty
stdout is indistinguishable from a clean lane, so a lane that never ran gets
written up as clean and the sweep reports four green results having run three.
`LOOPS.md` §3 already spells all four commands correctly — the defect is that
nothing DETECTS a mistyped one, so the correct spelling is a thing a wake has to
get right rather than a thing it cannot get wrong. This script is where the
spelling lives now.

WHAT IT ASSERTS, and what it leaves to a human. Per lane, three exact clauses:

    rc == 0                       the command succeeded
    output non-empty              after npm's leading `> ...` banner is stripped
    output contains a digit       the lane printed *a figure*

All three are equality/emptiness tests on a child process's own bytes, so this
is `@exact` in `check:selftests`'s sense. It is NOT scanned by that gate — that
gate reads `check-*.mjs` in the two script dirs, and this is neither a gate nor
in those dirs — so the `--self-test` below is shipped on doctrine rather than on
enforcement, and it is the discriminating kind: it feeds the classifier the two
byte-silent npm forms above and asserts they come back NOT RUN.

THE MIDDLE CLAUSE CANNOT CHANGE A VERDICT, and that was found by red-proving
this file rather than by reading it. Disabling `output non-empty` left the
self-test GREEN: no output is a strict subset of no digit, so the third clause
catches everything the second does and the second only ever refines the REASON.
A clause that cannot be falsified is the decoration this repo refuses, so the
self-test now asserts the reason string as well as the verdict — which is what
makes the clause load-bearing for something and re-breaks the build when it is
removed. Kept, not dropped, because *"no output at all"* is the diagnosis for
the exact case 337.1 filed and *"carries no figure"* would send a wake looking
at the lane's prose instead of at its own command line.

What it CANNOT see, said plainly in the shape of `check:wrong-choice`: whether
the digit it found is *the lane's finding* rather than a version number in some
banner. It gates that a figure was printed and prints the line carrying it; what
that figure MEANS is the wake's judgement, and the write-up rule in `LOOPS.md`
§3 step 1 is what asks for it.

USAGE
    python3 scripts/loops/standardize_lanes.py            # run all four, full output
    python3 scripts/loops/standardize_lanes.py --quiet    # verdict + headline only
    python3 scripts/loops/standardize_lanes.py --self-test

Exit code is non-zero if any lane did NOT run, so a sweep cannot proceed on a
silent lane by accident.

RUN THIS AGAINST A SETTLED `apps/docs/dist`. Lanes 1 and 3 read it (lane 2 reads
`packages/core/src/css` and says so in its own header; lane 4 reads git), so
a sweep overlapping a build reads a half-written site and reports a plausible,
self-consistent, wrong figure — measured, not feared: lane 1 read **990** live
inline style attributes beside a running `docs:build` and **1365** twice once it
had finished. `ENVIRONMENT.md` §3's fail-open hazard reached from the other side.

Lane 1 drives a browser and needs `CHROME_PATH` exported in this container
(`ENVIRONMENT.md` §1c). That is deliberately NOT set here: a lane that cannot
run must fail loudly, and re-implementing the repo's chrome resolver in a third
place is exactly the duplication lane 2 of this sweep exists to catch.
"""

from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]

# The four lanes, spelled once, here. `-s` is deliberately absent: it is half of
# what makes the two failures above silent.
LANES = [
    (
        1,
        "scan:dead-style",
        ["npm", "run", "scan:dead-style", "-w", "docs"],
        "inline declarations that change no computed value",
    ),
    (
        2,
        "report:css-repeats",
        ["npm", "run", "report:css-repeats", "-w", "@busy-office/ui"],
        "rule bodies in the shipped CSS that appear more than once",
    ),
    (
        3,
        "report:prose",
        ["npm", "run", "report:prose", "-w", "docs"],
        "docs pages over 2x the corpus or family median",
    ),
    (
        4,
        "report_loop_prose",
        ["python3", "scripts/loops/report_loop_prose.py"],
        "the same question asked of the files the LOOP reads",
    ),
]

BANNER_PREFIX = "> "


def strip_npm_banner(out: str) -> str:
    """Drop npm's leading `> pkg script` / `> node script.mjs` block.

    Only the LEADING run is stripped, so a lane that legitimately prints a
    quoted line later keeps it.
    """
    lines = out.splitlines()
    i = 0
    while i < len(lines) and (not lines[i].strip() or lines[i].startswith(BANNER_PREFIX)):
        i += 1
    return "\n".join(lines[i:])


def classify(rc: int, stdout: str) -> tuple[bool, str, str]:
    """-> (ran, reason, headline). The three exact clauses, in order."""
    body = strip_npm_banner(stdout)
    if rc != 0:
        return False, f"exit code {rc}", ""
    if not body.strip():
        return False, "no output at all (the byte-silent case 337.1 filed)", ""
    headline = ""
    for line in body.splitlines():
        if any(ch.isdigit() for ch in line):
            headline = line.strip()
            break
    if not headline:
        return False, "output carries no figure — nothing to quote", ""
    return True, "ran", headline


def run_lane(argv: list[str]) -> tuple[int, str, str]:
    proc = subprocess.run(
        argv, cwd=REPO_ROOT, capture_output=True, text=True, check=False
    )
    return proc.returncode, proc.stdout, proc.stderr


def sweep(quiet: bool) -> int:
    results = []
    for num, name, argv, note in LANES:
        rc, stdout, stderr = run_lane(argv)
        ran, reason, headline = classify(rc, stdout)
        results.append((num, name, ran, reason, headline))

        print(f"\n=== Lane {num} of 4 — {name} — {note}")
        print(f"    $ {' '.join(argv)}")
        if not quiet:
            body = strip_npm_banner(stdout)
            if body.strip():
                print(body)
        if not ran:
            print(f"    !! NOT RUN — {reason}")
            tail = [ln for ln in stderr.splitlines() if ln.strip()][-6:]
            if tail:
                print("    stderr tail:")
                for ln in tail:
                    print(f"      {ln}")
            else:
                print("    stderr was EMPTY too — this is why the lane looked clean.")

    print("\n--- sweep verdict: quote a figure the lane itself printed ---")
    silent = 0
    for num, name, ran, reason, headline in results:
        if ran:
            print(f"  lane {num}  RAN      {name}: {headline}")
        else:
            silent += 1
            print(f"  lane {num}  NOT RUN  {name}: {reason}")

    if silent:
        print(
            f"\n{silent} of {len(LANES)} lane(s) produced no figure. A lane that did not "
            "run may NOT be written up as clean (roadmap 337.1)."
        )
        return 1
    print(f"\nall {len(LANES)} lane(s) printed a figure — each write-up quotes its own.")
    return 0


# Each case is (argv, expect_ran, expect_reason, why). The first three are the
# exact invocations roadmap 337.1 filed; they must come back NOT RUN or this
# classifier is the thing it was written to replace.
#
# `expect_reason` is a substring of the reason, and it is not garnish: it is the
# only thing that can falsify the emptiness clause, which is otherwise subsumed
# by the digit clause (see the header). Each of the three clauses is named by at
# least one case that goes red when that clause alone is disabled — verified by
# injection, one clause at a time, not by reading this list.
SELF_TEST_CASES = [
    (["npm", "run", "-s", "report:css-repeats", "-w", "@busy-office/docs"], False, "exit code",
     "wrong workspace name with -s — the filed case, 0B stdout AND 0B stderr"),
    (["npm", "run", "report:css-repeats", "-w", "@busy-office/docs"], False, "exit code",
     "wrong workspace name without -s"),
    (["npm", "run", "-s", "no-such-lane-337", "-w", "docs"], False, "exit code",
     "missing script with -s — the second byte-silent form"),
    ([sys.executable, "-c", "print('report - 7 thing(s) found')"], True, "ran",
     "a lane that printed a figure"),
    ([sys.executable, "-c", "print('all clean, nothing to consolidate')"], False, "no figure",
     "output with no digit — nothing quotable"),
    ([sys.executable, "-c", ""], False, "no output at all",
     "exit 0 with no output at all — the reason, not just the verdict"),
    ([sys.executable, "-c", "print('found 3'); raise SystemExit(1)"], False, "exit code",
     "a figure printed by a command that then failed"),
]


def self_test() -> int:
    failures = []
    for argv, expect_ran, expect_reason, why in SELF_TEST_CASES:
        rc, stdout, _stderr = run_lane(argv)
        ran, reason, headline = classify(rc, stdout)
        ok = ran == expect_ran and expect_reason in reason
        mark = "ok  " if ok else "FAIL"
        got = f"RAN ({headline})" if ran else f"NOT RUN ({reason})"
        print(f"  {mark} expect {'RAN' if expect_ran else 'NOT RUN':<7} got {got:<58} {why}")
        if not ok:
            failures.append(why)

    print(f"\nself-test: {len(SELF_TEST_CASES)} case(s), {len(failures)} failure(s)")
    if failures:
        for why in failures:
            print(f"  FAILED: {why}")
        return 1
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--quiet", action="store_true",
                    help="print each lane's verdict and headline only, not its full output")
    ap.add_argument("--self-test", action="store_true",
                    help="prove the classifier separates a silent lane from a clean one")
    args = ap.parse_args()
    return self_test() if args.self_test else sweep(args.quiet)


if __name__ == "__main__":
    raise SystemExit(main())
