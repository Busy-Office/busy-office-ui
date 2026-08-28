"""Report: how the loop's OWN prose is growing, and whether it accumulates.

Roadmap 167.1. `report:prose` (docs workspace) measures the prose users read.
Nothing measured the prose the LOOP reads — the files every wake opens at Step 0
through rule 4 — and 167.1's finding was that those grew two to five times
faster over the same nine days.

@exact — word counts from git blobs and a comparison of consecutive counts.
  There is no judgement to get wrong, so no --self-test (see
  apps/docs/scripts/check-selftests.mjs for the rule). What it prints instead is
  the reconciliation below, which CAN disagree and hard-exits when it does.

WHAT THE `accumulate` COLUMN IS FOR, AND WHY IT IS THE LOAD-BEARING NUMBER.
158.2 installed a cadence over docs prose on one specific measurement: across
nine daily builds, of the 89 pages present throughout, **not one ended shorter
than it started**. That is what makes a growing word count a signal there — the
corpus only ratchets, so nothing but a periodic read ever asks the other
question.

That premise is a property of a file, not a law, and it does not hold for all
five files here. Snapshot, 2026-08-28 — re-run it, do not quote it:

    python3 scripts/loops/report_loop_prose.py --since 2026-08-19

    RESUME.md   27 up / 13 down   — rewritten each wake, min 314, max 2,980
    ROADMAP.md 376 up / 12 down   — the 12 downs are the archive sweeps, and
                                    they dominate: 110,061 peak -> 12,150 now
    LOOPS.md    25 up /  0 down
    CLAUDE.md   10 up /  0 down
    DESIGN.md    6 up /  0 down /  1 flat

So the predicate distinguishes — 3 of 5 files show 158.2's signature and 2 do
not — which is the base-rate check roadmap 94.11 asks for before a detector is
worth having. A word count over a file that shrinks by design measures which
wake wrote it, not accumulation.

ROADMAP-archive.md is listed because leaving it out is how 167.1's own headline
figure went wrong: it quoted ROADMAP **plus** archive at +107.9% while the file
rule 4 actually reads went **-85.9%** over the identical window. The archive is
where the live file is emptied to; summing the two measures a quantity no wake
reads. It is printed with `(archive)` beside it for that reason.

DO NOT MEASURE THESE FILES WITH A BARE `wc -w` IN A CONTAINER WITH NO LOCALE
SET. This repo's prose is em-dash-heavy and GNU wc in the C locale swallows the
separator: `printf 'alpha — beta\\n' | wc -w` prints **2**, and
`LC_ALL=C.UTF-8 ... | wc -w` prints 3. On the five files that is a 2.4-4.5%
undercount, silently. Python's str.split() agrees with C.UTF-8 exactly on all
five, which is why this script does the counting.

Usage:
    python3 scripts/loops/report_loop_prose.py                # since 2026-08-20
    python3 scripts/loops/report_loop_prose.py --since 2026-08-24
"""
import argparse
import os
import subprocess
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

# The files a wake opens, in the order the dispatcher opens them.
# (path, when it is read)
FILES = [
    (".roundtable/RESUME.md", "Step 0 — the handover"),
    # Added with 169.3's split, for the identical reason the LOOPS-archive.md row
    # below was added one slice earlier — and it was MISSED at the time, which is
    # how a rule stated in a comment gets broken by the next commit that should
    # have obeyed it. 169.3 moved 1,467 words out of RESUME.md into this file
    # (3,150 -> 1,683 at f52f2597); that is the LARGEST single down step in
    # RESUME.md's 65-step series, and it is a relocation, not a shrink. The
    # destination went unmeasured entirely, while Step 0 instructs every wake to
    # read it and its own header says it is DURABLE ("edit it when a trap
    # changes") — so 158.2's ratchet premise applies to it, unlike the handover
    # it was cut from.
    #
    # What belongs in this list: AUTHORED prose the dispatcher is instructed to
    # read. Not the generated mirrors a wake also opens — STATUS.md,
    # .roundtable/INDEX.md and the loop log are written by scripts/loops/*.py,
    # so a word count over them measures a generator, not anyone's writing.
    (".roundtable/ENVIRONMENT.md", "Step 0 — the traps (split from RESUME.md, 169.3)"),
    ("LOOPS.md", "Steps 0b-2 — the rules themselves"),
    # Added with 167.2's split. WITHOUT this row the move would read as LOOPS.md
    # losing 717 words, which is a shrink that never happened — the prose was
    # relocated, not deleted. An instrument that can be improved by moving text
    # out of its own scope measures filing, not size.
    ("LOOPS-archive.md", "Incident narratives split out of LOOPS.md (167.2)"),
    ("ROADMAP.md", "rule 4 — the queue"),
    ("ROADMAP-archive.md", "(archive) — looked up, never dispatched from"),
    ("CLAUDE.md", "every wake — the doctrine"),
    ("DESIGN.md", "when the product's architecture is in play"),
]


def git(*args):
    return subprocess.run(
        ["git", "-C", ROOT, *args], capture_output=True, text=True
    )


def words_at(rev, path):
    """Word count of `path` at `rev`, or None if the file is absent there."""
    r = git("show", f"{rev}:{path}")
    return None if r.returncode else len(r.stdout.split())


def series(path, since):
    """(day, sha, words) for every commit touching `path` since `since`, oldest first."""
    out = git(
        "log", "--format=%x00%H %ad", "--date=format:%Y-%m-%d",
        f"--since={since}", "--reverse", "--", path,
    ).stdout
    rows = []
    for rec in (r.strip() for r in out.split("\x00")):
        if not rec:
            continue
        sha, day = rec.split()[0], rec.split()[1]
        w = words_at(sha, path)
        if w is not None:
            rows.append((day, sha, w))
    return rows


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--since", default="2026-08-20",
                    help="base day, YYYY-MM-DD (default 2026-08-20, 158.2's window)")
    args = ap.parse_args()

    if git("rev-parse", "--is-shallow-repository").stdout.strip() == "true":
        sys.exit(
            "REFUSING TO REPORT: this clone is SHALLOW, so every history figure "
            "below would be silently wrong.\n  git fetch --unshallow origin"
        )

    base = git("rev-list", "-1", f"--before={args.since}T23:59:59", "HEAD").stdout.strip()
    if not base:
        sys.exit(f"no commit at or before {args.since}")

    print(f"loop-prose report — base {base[:8]} ({args.since}) -> HEAD "
          f"({git('rev-parse', '--short', 'HEAD').stdout.strip()})")
    print(f"  {'file':26}{'base':>9}{'now':>9}{'delta':>10}   accumulate            read at")

    fatal = []   # the report cannot be trusted at all
    stale = []   # one row's `now` is HEAD's, and disk has moved on

    for path, read_at in FILES:
        # RECONCILE against the working tree, not just the git object store —
        # two independent sources for the same number. A path that is listed
        # here but absent, or untracked, would otherwise report a plain 0 that
        # reads exactly like a real count (CLAUDE.md: "a find over a path that
        # did not exist"). That is fatal. An uncommitted edit is not: the row is
        # simply HEAD's, off by the uncommitted delta, and both numbers print.
        disk = os.path.join(ROOT, path)
        now = words_at("HEAD", path)
        if not os.path.exists(disk):
            fatal.append(f"{path}: listed here but not on disk")
            continue
        if now is None:
            fatal.append(f"{path}: not tracked at HEAD — a zero here would look like a real count")
            continue
        on_disk = len(open(disk, encoding="utf-8").read().split())
        if now != on_disk:
            stale.append(f"{path}: HEAD {now:,} words, working tree {on_disk:,} "
                         f"({on_disk - now:+,} uncommitted)")

        was = words_at(base, path)
        s = series(path, args.since)
        up = sum(1 for a, b in zip(s, s[1:]) if b[2] > a[2])
        dn = sum(1 for a, b in zip(s, s[1:]) if b[2] < a[2])
        fl = sum(1 for a, b in zip(s, s[1:]) if b[2] == a[2])
        delta = f"{(now - was) / was * 100:+.1f}%" if was else "n/a"
        sig = f"{up:3} up /{dn:3} down" + (f" /{fl:2} flat" if fl else "")
        print(f"  {path:26}{(f'{was:,}' if was else '—'):>9}{now:>9,}{delta:>10}   "
              f"{sig:26}{read_at}")

    if stale:
        print("\n  UNCOMMITTED — the `now` column is HEAD's, and disk has moved on:")
        for s in stale:
            print(f"    {s}")

    if fatal:
        print("\n  RECONCILIATION FAILED — the numbers above are not trustworthy:")
        for f in fatal:
            print(f"    {f}")
        sys.exit(1)

    print("\n  a file that shrinks is not covered by 158.2's premise (see this "
          "script's header).\n  The verdicts are in ROADMAP 167.1; this prints the "
          "signature, not a judgement.")


if __name__ == "__main__":
    main()
