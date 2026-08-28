"""Report: how the loop's OWN prose is growing, and whether it accumulates.

Roadmap 167.1. `report:prose` (docs workspace) measures the prose users read.
Nothing measured the prose the LOOP reads — the files every wake opens at Step 0
through rule 4 — and 167.1's finding was that those grew two to five times
faster over the same nine days.

@heuristic — the word counts are exact (git blobs, consecutive comparison), but
  since 179.1 this script also RECOGNISES which files `LOOPS.md`'s dispatcher
  region names, by reading prose. That is a judgement, so it ships `--self-test`
  (see apps/docs/scripts/check-selftests.mjs for the rule; that meta-gate reads
  only `check-*.mjs` under apps/docs/scripts and packages/core/scripts, so
  nothing enforces the tag here — it is honoured, not checked).

THE RECONCILIATION USED TO RUN IN ONLY ONE DIRECTION, AND IT WAS THE DIRECTION
THAT HAS NEVER FAILED (roadmap 179.1). Until then this script asked, of every
path in FILES, "is it on disk?" — a listed file that vanishes. That has happened
zero times. The failure that HAS happened, twice, is the opposite: a new durable
loop file is created, `LOOPS.md` starts telling every wake to read it, and this
list is not updated, so the file is measured by nothing at all.

  167.2  LOOPS-archive.md      — row added in the same commit, caught
  169.3  ENVIRONMENT.md        — row NOT added; found by hand one day later
                                 (178.1), after 1,467 words were scored as a
                                 shrink in RESUME.md and 1,666 words went
                                 unmeasured at the destination

178.1 red-proved its fix by breaking a listed path to `ENVIRONMENTT.md` and
watching the report exit 1. That proves the direction that has never failed.
Replayed over every commit where both this script and LOOPS.md parse, the
reverse assertion below is red on **9 of 15** — one defect episode, nine commits
wide, opening exactly at `f52f2597` (169.3) and closing at `e409a0fe` (178.1).
So the predicate distinguishes rather than decorating (94.11's test), and it
goes red at the moment the real defect was introduced rather than a day later.

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
import re
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


# Named in the dispatcher region and deliberately NOT measured. A reason per
# entry, because an exemption without one is how a list quietly becomes a
# denylist of whatever was inconvenient (the shape check:wrong-choice's EXEMPT
# map takes, for the same reason).
EXEMPT = {
    "STATUS.md": "generated by scripts/loops/generate_status.py — counting it measures a generator",
    ".roundtable/INDEX.md": "generated by generate_roundtable_index.py — same",
    ".roundtable/loop-log.md": "appended by record_iteration.py — same",
}

# A bare basename in the prose means the file in .roundtable/. Listed rather
# than inferred: `RESUME.md` and `ENVIRONMENT.md` do not exist at the repo root,
# so resolving a bare name by trying the root first would silently pick nothing.
ALIAS = {
    "RESUME.md": ".roundtable/RESUME.md",
    "ENVIRONMENT.md": ".roundtable/ENVIRONMENT.md",
    "loop-log.md": ".roundtable/loop-log.md",
    "INDEX.md": ".roundtable/INDEX.md",
}

# A dated snapshot is CITED from the region, never read every wake — the
# grill reports and explore write-ups. Structural: the filename carries a date.
DATED = re.compile(r"\d{4}-\d{2}-\d{2}")
MD_IN_PROSE = re.compile(r"[`(]([A-Za-z0-9_./-]+\.md)")

# The region this script's FILES list claims to cover: "Step 0 through rule 4".
REGION_START = re.compile(r"^## Dispatcher\b")
REGION_END = re.compile(r"^5\. \*\*")


def dispatcher_md_paths(loops_text):
    """The .md files LOOPS.md's dispatcher region tells a wake to read.

    Returns (paths, None) or (None, why-it-could-not-be-read). Never an empty
    set standing in for a failed parse: a region that cannot be located is
    reported, not skipped, per LOOPS.md's own "a gate that cannot run must fail
    loudly, never skip quietly".
    """
    lines = loops_text.split("\n")
    start = next((i for i, l in enumerate(lines) if REGION_START.match(l)), None)
    if start is None:
        return None, "LOOPS.md has no `## Dispatcher` heading — the region anchor moved"
    end = next((i for i, l in enumerate(lines) if i > start and REGION_END.match(l)), None)
    if end is None:
        return None, "LOOPS.md has no `5. **` rule after `## Dispatcher` — the region anchor moved"
    found = set()
    for raw in MD_IN_PROSE.findall("\n".join(lines[start:end])):
        if DATED.search(raw):
            continue
        found.add(ALIAS.get(raw, raw))
    return found, None


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


# Inputs the region parser must classify DIFFERENTLY. A self-test made only of
# cases it already passes cannot fail — dispatch_status.py's header names that
# trap and this list is built against it: every case below is paired with its
# near-twin, so a parser that stopped discriminating fails at least one.
SELF_TEST = [
    # (region text, expected set)
    ("## Dispatcher\nRead `ROADMAP.md` first.\n5. **rule five**\n", {"ROADMAP.md"}),
    # the 169.3 case: a real file named in the region
    ("## Dispatcher\nAlso read `.roundtable/ENVIRONMENT.md`.\n5. **x**\n",
     {".roundtable/ENVIRONMENT.md"}),
    # its near-twin: the same file by bare name must resolve to the same path
    ("## Dispatcher\nAlso read `ENVIRONMENT.md`.\n5. **x**\n",
     {".roundtable/ENVIRONMENT.md"}),
    # a dated snapshot is cited, not read every wake — must NOT be collected
    ("## Dispatcher\nSee `.roundtable/grill-objective-164-167-169-2026-08-28.md`.\n5. **x**\n",
     set()),
    # its near-twin: the same shape WITHOUT a date must be collected
    ("## Dispatcher\nSee `.roundtable/grill-objective.md`.\n5. **x**\n",
     {".roundtable/grill-objective.md"}),
    # scope: a path named BELOW rule 5 is outside the region this list covers
    ("## Dispatcher\nnothing here\n5. **rule five**\nRead `.roundtable/polish-state.md`.\n",
     set()),
]


def self_test():
    bad = []
    for text, expected in SELF_TEST:
        got, why = dispatcher_md_paths(text)
        if why or got != expected:
            bad.append(f"    {text.splitlines()[1]!r}\n      expected {sorted(expected)}, got "
                       f"{sorted(got) if got is not None else why}")
    # A region that cannot be located must REPORT, never return an empty set.
    got, why = dispatcher_md_paths("no anchors here at all\n")
    if got is not None or not why:
        bad.append("    a missing `## Dispatcher` anchor returned a set instead of a reason")
    if bad:
        print("report_loop_prose --self-test FAILED:", file=sys.stderr)
        print("\n".join(bad), file=sys.stderr)
        return 1
    print(f"report_loop_prose --self-test: {len(SELF_TEST) + 1} cases classified correctly")
    return 0


def main():
    if "--self-test" in sys.argv:
        return self_test()
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

    # THE OTHER DIRECTION (179.1): a file the dispatcher is told to read that
    # this list does not measure. See the header for why this is the half that
    # has actually failed.
    named, why = dispatcher_md_paths(open(os.path.join(ROOT, "LOOPS.md"), encoding="utf-8").read())
    if why:
        fatal.append(f"cannot read LOOPS.md's dispatcher region — {why}")
    else:
        listed = {p for p, _ in FILES}
        for path in sorted(named - listed - set(EXEMPT)):
            fatal.append(f"{path}: named in LOOPS.md's dispatcher region, measured by nothing here")
        print(f"\n  dispatcher region names {len(named)} .md file(s): "
              f"{len(named & listed)} measured, {len(named & set(EXEMPT))} exempt (generated)")

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
    sys.exit(main() or 0)
