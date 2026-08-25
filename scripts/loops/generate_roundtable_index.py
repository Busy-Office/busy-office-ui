#!/usr/bin/env python3
"""Generate `.roundtable/INDEX.md` — a browsable list of every finding.

WHY ONLY AN INDEX, when the directory holds 131 files at 1.8 MB.

The obvious moves were measured and refused:

- **Splitting live from settled**, the way ROADMAP.md was swept. Refused:
  78 of the 86 cited files are cited *from ROADMAP-archive.md*, so moving them
  would break historical footnotes to fix a problem nobody has. The roadmap
  sweep paid for itself because a 9,824-line file was scanned every wake;
  nothing scans this directory.
- **Pruning uncited files.** Refused: every file here was last modified in
  2026-08. This is one month of work, not an archive with cruft, and deleting a
  three-week-old finding to save disk is not a trade.
- **A SQLite mirror.** Refused: the widened doctrine says mirror what you
  *routinely* sort, filter or count. Nobody counts grills. `grep` answers every
  question anyone has actually asked of this directory.

What was NOT refused is the cheap part: nothing here is browsable without
knowing a filename in advance. An index costs one generated file and moves
nothing.

**It is also the measurement point.** The claim "findings are written faster
than they can be found" was asserted before it was checked, and the check —
the same subject appearing twice — comes back essentially empty (two pairs,
both deliberate follow-ups). This index prints that count on every run, so the
day it stops being empty, the evidence exists rather than the assertion.
"""
from __future__ import annotations

import os
import re
import subprocess
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
RT = os.path.join(ROOT, ".roundtable")
INDEX = os.path.join(RT, "INDEX.md")

# Living ledgers: written to repeatedly, read by the loop, never a snapshot.
LIVING = {
    "loop-log.md": "every iteration, appended by record_iteration.py",
    "polish-state.md": "the Polish round ledger (LOOPS.md §3b)",
    "erp-suite-gaps.md": "the gap ledger the ERP suite exists to fill",
    "RESUME.md": "where a cold start picks up",
    "PANEL.md": "the standing review panel",
    "surface-baseline.md": "the scored-surface baseline",
    "surface-review-rubric.md": "how a surface is scored",
}

DATE = re.compile(r"(\d{4}-\d{2}-\d{2})")


def title_of(path: str) -> str:
    """First heading, else the first non-empty line."""
    with open(path, encoding="utf-8") as fh:
        for line in fh:
            t = line.strip()
            if t.startswith("#"):
                return t.lstrip("# ").strip()
            if t:
                return t[:90]
    return ""


def subject(name: str) -> str:
    """Filename with kind prefix and date stripped — the thing it is about."""
    s = re.sub(r"\.md$", "", name)
    s = DATE.sub("", s)
    s = re.sub(r"^(grill|design|explore|research|scorecard|adr)-", "", s)
    return s.strip("-") or s


def cited_files() -> set[str]:
    """Filenames referenced from anywhere outside .roundtable itself."""
    names = {f for f in os.listdir(RT) if f.endswith(".md")}
    hits: set[str] = set()
    tracked = subprocess.run(
        ["git", "ls-files"], cwd=ROOT, capture_output=True, text=True
    ).stdout.split()
    for rel in tracked:
        if rel.startswith(".roundtable/") or not rel.endswith(
            (".md", ".mjs", ".css", ".astro", ".py", ".json")
        ):
            continue
        try:
            with open(os.path.join(ROOT, rel), encoding="utf-8") as fh:
                body = fh.read()
        except (OSError, UnicodeDecodeError):
            continue
        for n in names:
            if n in body:
                hits.add(n)
    return hits


def main() -> int:
    files = sorted(f for f in os.listdir(RT) if f.endswith(".md") and f != "INDEX.md")
    cited = cited_files()

    subjects = Counter(subject(f) for f in files)
    repeats = {s: n for s, n in subjects.items() if n > 1 and s}

    rows = []
    for f in files:
        if f in LIVING:
            continue
        m = DATE.search(f)
        rows.append((m.group(1) if m else "—", f, title_of(os.path.join(RT, f)), f in cited))
    rows.sort(key=lambda r: (r[0] == "—", r[0]), reverse=True)

    out = [
        "# .roundtable index",
        "",
        "Generated — do not hand-edit. Regenerate with "
        "`python3 scripts/loops/generate_roundtable_index.py` (runs automatically "
        "after `record_iteration.py`). Derived from the files themselves, same "
        "doctrine as STATUS.md.",
        "",
        "**Nothing here was moved, split or deleted.** Splitting live from settled "
        "was refused because 78 of the 86 cited files are cited from "
        "`ROADMAP-archive.md`, so moving them breaks historical footnotes to solve "
        "a problem nobody has; pruning was refused because every file here was last "
        "modified in the same month this was written. See this script's header for "
        "the full reasoning.",
        "",
        "## Living ledgers — written to repeatedly, read by the loop",
        "",
    ]
    for name, what in sorted(LIVING.items()):
        mark = "" if os.path.exists(os.path.join(RT, name)) else "  **(missing)**"
        out.append(f"- [`{name}`]({name}) — {what}{mark}")

    out += [
        "",
        f"## Findings — {len(rows)} snapshots, newest first",
        "",
        "A **·** marks a file nothing outside `.roundtable/` links to. That is not "
        "a defect: a grill can settle a question without anything needing to cite "
        "it afterwards. It is here so the uncited set stays visible instead of "
        "growing unnoticed.",
        "",
        "| Date | Finding | Cited |",
        "|---|---|---|",
    ]
    for date, name, title, is_cited in rows:
        t = title.replace("|", "\\|")[:96]
        out.append(f"| {date} | [{t}]({name}) | {'✓' if is_cited else '·'} |")

    out += [
        "",
        "## Duplicate subjects",
        "",
        "The signature of a directory that has outgrown retrieval is the same "
        "subject investigated twice because the first one could not be found. "
        "This is the check for that, printed every run so the claim is measured "
        "rather than asserted.",
        "",
    ]
    if repeats:
        for s, n in sorted(repeats.items(), key=lambda kv: -kv[1]):
            out.append(f"- `{s}` — **{n}** files")
        out.append("")
        out.append(
            "Two files on one subject is usually a deliberate follow-up (a grill "
            "and its sign-off). Three is worth a look."
        )
    else:
        out.append("None.")

    uncited = sum(1 for *_, c in rows if not c)
    out += [
        "",
        f"— {len(files)} files, {len(cited)} cited from outside, {uncited} uncited "
        f"snapshots, {len(repeats)} repeated subject(s).",
        "",
    ]

    with open(INDEX, "w", encoding="utf-8") as fh:
        fh.write("\n".join(out))
    print(f"wrote {INDEX}  ({len(rows)} findings, {len(LIVING)} ledgers, {uncited} uncited)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
