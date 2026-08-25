#!/usr/bin/env python3
"""Polish re-entry: the rule that nothing executed.

`.roundtable/polish-state.md` has always said a surface re-enters the queue
"only when its SOURCE changes -- never on a timer". Nothing in `scripts/loops/`
mentioned polish at all, so that sentence was a rule a human had to notice and
apply. It was not applied: `component/sidebar-nav` sits at 1/3 rounds, its docs
page changed twice on 2026-08-25, and the ledger still read QUEUE DRY. The loop
would have fallen through rule 6 to Research for as long as that lasted.

This is the missing mechanism. It is EXACT, not heuristic: a surface's source
state is the set of git blob SHAs of the files that define it, and "changed"
means that set differs from the one recorded when the surface was last polished.
No timestamps (clock skew, rebases), no diffing prose, no guessing.

DERIVING THE SOURCE SET. Page slugs are NOT component directory names --
`alerts` documents `alert/`, and `state-patterns` documents BOTH `skeleton/` and
`state/`. Guessing that mapping is the documented way to get this wrong, so it
is read from `api.json`'s generated `pageSlug` map, reversed. A surface with no
CSS directory at all (`inline-editing`, `table-toolbar` document behaviors on
data-table) is legitimate and scores on its docs page alone.

USAGE
  polish_requeue.py --check    report surfaces whose source moved; exit 1 if any
  polish_requeue.py --apply    write the re-queue into the ledger
  polish_requeue.py --stamp component/sidebar-nav
                               record the CURRENT source state, i.e. "this
                               surface has just been polished"; call it at the
                               END of a Polish round, never at the start
  polish_requeue.py --backfill SHA
                               one-off: seed digests from a historical tree, so
                               existing rows do not all read "changed" merely
                               because the column is new
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
LEDGER = ROOT / ".roundtable" / "polish-state.md"
API = ROOT / "packages" / "core" / "dist" / "api.json"

DOCS_PAGES = ROOT / "apps" / "docs" / "src" / "pages"
CSS_COMPONENTS = ROOT / "packages" / "core" / "src" / "css" / "components"


def git(*args: str, tree: str | None = None) -> str:
    return subprocess.run(
        ["git", *args], cwd=ROOT, capture_output=True, text=True, check=True
    ).stdout


def slug_to_css_dirs() -> dict[str, list[str]]:
    """Reverse api.json's generated pageSlug map. Never guess this."""
    api = json.loads(API.read_text())
    page_slug = api.get("pageSlug", {})
    out: dict[str, list[str]] = {}
    for component in api["components"]:
        slug = page_slug.get(component, component)
        out.setdefault(slug, []).append(component)
    return out


SUITE = ROOT / "examples" / "erp-suite"


def source_paths(surface: str) -> list[str]:
    """Repo-relative paths that DEFINE a surface.

    An ERP-suite screen is `screen/<module>/<name>` and its whole definition is
    one `.screen.mjs` file — the suite carries no CSS of its own by gate, so
    there is nothing else to hash. Components and patterns are their docs page
    plus, for a component, the CSS directories that page documents.
    """
    kind, slug = surface.split("/", 1)
    if kind == "screen":
        return [str((SUITE / f"{slug}.screen.mjs").relative_to(ROOT))]
    folder = "components" if kind == "component" else "patterns"
    paths = [str((DOCS_PAGES / folder / f"{slug}.astro").relative_to(ROOT))]
    if kind == "component":
        for d in slug_to_css_dirs().get(slug, []):
            p = CSS_COMPONENTS / d
            if p.is_dir():
                paths.append(str(p.relative_to(ROOT)))
    return paths


def digest(surface: str, tree: str | None = None) -> str:
    """Short digest of the blob SHAs defining a surface. '-' if it has none."""
    paths = source_paths(surface)
    if tree:
        lines = [
            ln for p in paths
            for ln in git("ls-tree", "-r", tree, "--", p).splitlines()
        ]
        blobs = sorted(ln.split()[2] for ln in lines if ln.strip())
    else:
        lines = [
            ln for p in paths
            for ln in git("ls-files", "-s", "--", p).splitlines()
        ]
        blobs = sorted(ln.split()[1] for ln in lines if ln.strip())
    if not blobs:
        return "-"
    return subprocess.run(
        ["git", "hash-object", "--stdin"], cwd=ROOT, input="\n".join(blobs),
        capture_output=True, text=True, check=True,
    ).stdout.strip()[:8]


ROW = re.compile(r"^\|\s*(component|pattern|screen)/([a-z0-9-]+(?:/[a-z0-9-]+)?)\s*\|(.*)\|\s*$")


def rows(text: str):
    """Yield (line_index, surface, cells) for every ledger table row."""
    for i, line in enumerate(text.splitlines()):
        m = ROW.match(line)
        if m:
            yield i, f"{m.group(1)}/{m.group(2)}", [c.strip() for c in m.group(3).split("|")]


def has_src_column(text: str) -> bool:
    return "| src |" in text


def add_src_column(text: str, seed: dict[str, str]) -> str:
    lines = text.splitlines()
    for i, line in enumerate(lines):
        if line.startswith("| surface | dimension |"):
            lines[i] = line.replace("| status |", "| src | status |")
            # Rebuild the separator from the header's OWN column count rather
            # than patching it. The first version hand-spliced it and produced
            # a 6-cell separator under a 7-cell header — a malformed table that
            # renders as plain text, caught only by counting the cells.
            cols = len(lines[i].strip().strip("|").split("|"))
            lines[i + 1] = "|" + "---|" * cols
    out = []
    for line in lines:
        m = ROW.match(line)
        if not m:
            out.append(line)
            continue
        surface = f"{m.group(1)}/{m.group(2)}"
        cells = line.rstrip().rstrip("|").split("|")
        status = cells[-1]
        out.append("|".join(cells[:-1]) + f"| {seed.get(surface, '-')} |{status}|")
    return "\n".join(out) + "\n"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--stamp", metavar="SURFACE")
    ap.add_argument("--backfill", metavar="SHA")
    args = ap.parse_args()

    text = LEDGER.read_text()

    if args.backfill:
        seed = {s: digest(s, tree=args.backfill) for _, s, _ in rows(text)}
        if has_src_column(text):
            print("ledger already has a src column — nothing to backfill")
            return 0
        LEDGER.write_text(add_src_column(text, seed))
        print(f"backfilled {len(seed)} surface digest(s) from {args.backfill[:8]}")
        return 0

    if not has_src_column(text):
        print("ledger has no src column yet — run --backfill SHA first", file=sys.stderr)
        return 2

    recorded = {s: c[-2] for _, s, c in rows(text)}

    if args.stamp:
        if args.stamp not in recorded:
            print(f"no such surface in the ledger: {args.stamp}", file=sys.stderr)
            return 2
        new = digest(args.stamp)
        lines = text.splitlines()
        for i, s, cells in rows(text):
            if s == args.stamp:
                parts = lines[i].rstrip().rstrip("|").split("|")
                parts[-2] = f" {new} "
                lines[i] = "|".join(parts) + "|"
        LEDGER.write_text("\n".join(lines) + "\n")
        print(f"stamped {args.stamp} at {new}")
        return 0

    # A surface the ledger has taken OUT of play does not come back because a
    # file moved. `component/date` is the live case: deprecated, and its own row
    # says "it is skipped so no future wake re-picks it" — a detector that
    # overrode that would send wakes to polish a component being removed. Dry
    # surfaces have likewise forfeited their budget by rule. Both are reported
    # rather than dropped silently, so the exclusion is visible in the output
    # instead of being a quiet behaviour nobody can see.
    excluded = []
    changed = []
    for _, s, cells in rows(text):
        was, now = recorded[s], digest(s)
        if was == now or was == "-":
            continue
        status, dry = cells[-1], cells[-3]
        if "SKIPPED" in status:
            excluded.append((s, "SKIPPED in the ledger"))
        elif dry not in ("0", "—", "-", ""):
            excluded.append((s, f"marked dry ({dry})"))
        else:
            changed.append((s, was, now))

    def report_excluded():
        for s, why in excluded:
            print(f"  (not re-queued: {s} — {why})")

    if not changed:
        print(f"polish re-entry: {len(recorded)} surface(s) checked, none re-enters the queue")
        report_excluded()
        return 0

    print(f"polish re-entry: {len(changed)} surface(s) whose SOURCE moved since their last round")
    for s, was, now in changed:
        print(f"  {s:34s} {was} -> {now}")
        for p in source_paths(s):
            print(f"      {p}")

    report_excluded()

    if args.apply:
        lines = text.splitlines()
        names = {s for s, _, _ in changed}
        for i, s, cells in rows(text):
            if s in names:
                parts = lines[i].rstrip().rstrip("|").split("|")
                if "re-queued" not in parts[-1]:
                    parts[-1] = parts[-1].rstrip() + " · **RE-QUEUED — source changed**"
                lines[i] = "|".join(parts) + "|"
        LEDGER.write_text("\n".join(lines) + "\n")
        print(f"\nledger updated — {len(names)} surface(s) marked for re-score")
    else:
        print("\n(--apply writes this into the ledger; --check only reports)")

    return 1 if args.check else 0


if __name__ == "__main__":
    sys.exit(main())
