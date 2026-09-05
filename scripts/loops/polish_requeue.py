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
is read from `api.json`'s generated `pageSlug` map, reversed.

THE SET USED TO STOP AT CSS, AND THAT MADE IT BLIND TO EVERY BEHAVIOR CHANGE
(roadmap 276.1, 2026-09-05). A component's source is its CSS *and* the behavior
modules that drive it, and until now only the first was hashed -- so a module
could be rewritten and the surface documenting it never re-queued. Measured
over the whole history, per ledger surface, counting commits that touched a
serving module and none of the surface's own paths:

    data-table 19/30 · inline-editing 10/11 · table-toolbar 10/10 ·
    scan 5/6 · pagination 3/4 · stepper 2/3 · tree-table 1/3 ·
    alerts 1/4 · dashboard 0/2                       -- 51 blind in total

CORRECTED 2026-09-05 (roadmap 280.1). This block read "31 blind in total"
across SEVEN rows, and the two it dropped are `inline-editing` and
`table-toolbar` -- the two PAGE_ONLY_BEHAVIORS surfaces named forty lines
below, i.e. the ones this very change made reachable. So the header
contradicted its own docstring, and the sentence in the ledger that went with
it ("the other fourteen ledger surfaces have no serving module") is twelve.
The figures are read at `29a9062b`, the commit that measured them; the
re-runnable probe is in ROADMAP 276.1 beside the corrected table.

`scan` is the hand-checked row: 5 of the 6 commits to `scan-input.ts` touched
neither `scan.astro` nor `css/components/scan/`; `inline-editing`'s 10/11 and
`table-toolbar`'s 10/10 were hand-checked the same way when the correction
landed. This is structural blindness, not 51 demonstrated missed re-queues --
most rows carry the RE-QUEUED marker
for some other reason at any given moment, and that is stated rather than
rounded up. The DSA `interaction` dimension is the one this costs most
directly: `dashboard`'s round 2 found `interaction: na` on a component that
ships `initCollapsibleCards`, which is exactly a behavior-side decay.

The mapping is read, never guessed, on the same rule as `pageSlug` above:
`behaviors.json`'s `byComponent` (Slice 264's `@serves` declaration, which
`check-js-serves` re-derives from the BUILT pages and fails on disagreement)
gives component -> export names, and `behaviors.behaviors[<export>].module`
gives the module file.

A surface with no CSS directory at all documents a behavior that ships on
ANOTHER component, so `byComponent` -- keyed by component -- cannot reach it:
`row-edit.ts` declares `@serves data-table`, not `inline-editing`. Those two
surfaces are named in PAGE_ONLY_BEHAVIORS below, each with its reason, on the
`COMPONENT_NAV_EXTRAS` precedent, and each entry is RECONCILED against the
page's own `@busy-office/ui/js` import rather than trusted -- a hand map that
cannot notice the page moved out from under it is the thing this script exists
to replace.

Deriving these two from page imports INSTEAD of the hand map was measured and
refused: the import list is over-broad on `button` (imports `initDropdowns` for
one demo) and `richtext` (`initDialogs`), and under-reports `stepper`, which
`byComponent` serves with `initWizard` and whose page imports nothing.

Patterns are deliberately unchanged: a pattern screen composes many components,
so every behavior in the framework would qualify and the predicate would be
uniformly true -- the dead-detector shape CLAUDE.md 94.11 refuses.

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
LEDGERS = {
    "polish": ROOT / ".roundtable" / "polish-state.md",   # components and patterns
    "suite": ROOT / ".roundtable" / "suite-score.md",     # ERP-suite screens (145.3)
}
LEDGER = LEDGERS["polish"]  # rebound from --ledger in main()
API = ROOT / "packages" / "core" / "dist" / "api.json"
BEHAVIORS = ROOT / "packages" / "core" / "dist" / "behaviors.json"

DOCS_PAGES = ROOT / "apps" / "docs" / "src" / "pages"
CSS_COMPONENTS = ROOT / "packages" / "core" / "src" / "css" / "components"
JS_BEHAVIORS = ROOT / "packages" / "core" / "src" / "js"

# Surfaces with no CSS directory of their own: the page documents a behavior
# that ships on ANOTHER component, so `byComponent` cannot reach it. Named
# here with the reason, and reconciled against the page's own import below --
# never trusted on its own.
PAGE_ONLY_BEHAVIORS = {
    # `row-edit.ts` declares `@serves data-table`; this page is the one that
    # documents it, and its own <script> imports exactly this export.
    "component/inline-editing": ["initRowEdit"],
    # `table-toolbar.ts` and `data-grid.ts`. Both are taken from this ledger's
    # own 2026-08-23 note, which settled what these two pages document —
    # "`initRowEdit`; `initTableToolbar`/`initDataGrid`" — rather than from a
    # fresh reading of the page. The page ALSO imports `initDataTables`, which
    # that note does not name; it stands the demo table up rather than being
    # the subject, so it is excluded. That exclusion is the one judgement in
    # this map, and it is named as one.
    "component/table-toolbar": ["initTableToolbar", "initDataGrid"],
}


def git(*args: str, tree: str | None = None) -> str:
    return subprocess.run(
        ["git", *args], cwd=ROOT, capture_output=True, text=True, check=True
    ).stdout


def slug_to_css_dirs() -> dict[str, list[str]]:
    """Reverse api.json's generated pageSlug map. Never guess this."""
    if not API.exists():
        # LOOPS.md rule 6 mandates running this BEFORE evaluating the rule, and a
        # cloud container starts with no `dist/` at all -- so this is the FIRST
        # thing a fresh wake runs, and it used to answer with a bare
        # FileNotFoundError traceback naming a path but not the command. Same
        # shape as ENVIRONMENT.md trap 2b, where git's refusal names the lock
        # file and the recipe that truncated the output dropped that line.
        sys.exit(
            f"polish_requeue: {API.relative_to(ROOT)} is missing, so the "
            "slug -> css-dir map cannot be read (it is generated, never "
            "guessed).\n  Run `npm run build -w @busy-office/ui` first, then "
            "re-run this command."
        )
    api = json.loads(API.read_text())
    page_slug = api.get("pageSlug", {})
    out: dict[str, list[str]] = {}
    for component in api["components"]:
        slug = page_slug.get(component, component)
        out.setdefault(slug, []).append(component)
    return out


SUITE = ROOT / "examples" / "erp-suite"


def _behaviors() -> dict:
    """behaviors.json, or the same actionable refusal api.json gets."""
    if not BEHAVIORS.exists():
        sys.exit(
            f"polish_requeue: {BEHAVIORS.relative_to(ROOT)} is missing, so the "
            "component -> behavior-module map cannot be read (it is generated "
            "from each module's @serves, never guessed).\n  Run "
            "`npm run build -w @busy-office/ui` first, then re-run this command."
        )
    return json.loads(BEHAVIORS.read_text())


def _module_file(export: str, beh: dict) -> str:
    """Repo-relative .ts path for a behavior export. Fails loudly, never skips.

    A map that quietly drops an export it cannot resolve is the derived
    artefact that decides for itself what it failed to see -- so an unknown
    export or a module file that is not on disk stops the run instead.
    """
    rec = beh["behaviors"].get(export)
    if rec is None:
        sys.exit(
            f"polish_requeue: behaviors.json names no export {export!r}. The "
            "map is generated from @serves; regenerate it or fix the caller."
        )
    path = JS_BEHAVIORS / f"{rec['module']}.ts"
    if not path.is_file():
        sys.exit(
            f"polish_requeue: behaviors.json points {export!r} at "
            f"{path.relative_to(ROOT)}, which is not on disk."
        )
    return str(path.relative_to(ROOT))


def behavior_paths(surface: str, css_dirs: list[str]) -> list[str]:
    """Behavior-module files that drive a component surface.

    Read from `byComponent` for a surface that owns CSS; from the reconciled
    PAGE_ONLY_BEHAVIORS map for the two that do not. See the module docstring
    for why the page's own import list is not the input for either.
    """
    beh = _behaviors()
    if css_dirs:
        exports = sorted({
            e for d in css_dirs for e in beh.get("byComponent", {}).get(d, [])
        })
    else:
        exports = PAGE_ONLY_BEHAVIORS.get(surface, [])
        # Reconcile the hand map against the page it describes, every run: an
        # entry naming an export the page no longer imports is stale, and the
        # whole point of naming it here was that nothing else can see it.
        if exports:
            page = DOCS_PAGES / "components" / f"{surface.split('/', 1)[1]}.astro"
            src = page.read_text() if page.is_file() else ""
            imported = set(re.findall(r"\binit[A-Za-z]+\b", src))
            missing = [e for e in exports if e not in imported]
            if missing:
                sys.exit(
                    f"polish_requeue: PAGE_ONLY_BEHAVIORS names {missing} for "
                    f"{surface}, but {page.relative_to(ROOT)} does not import "
                    "it. Update the map (with a reason) or the page."
                )
    return [_module_file(e, beh) for e in exports]


def source_paths(surface: str) -> list[str]:
    """Repo-relative paths that DEFINE a surface.

    An ERP-suite screen is `screen/<module>/<name>` and its whole definition is
    one `.screen.mjs` file — the suite carries no CSS of its own by gate, so
    there is nothing else to hash. Components and patterns are their docs page
    plus, for a component, the CSS directories that page documents and the
    behavior modules that drive it.
    """
    kind, slug = surface.split("/", 1)
    if kind == "screen":
        return [str((SUITE / f"{slug}.screen.mjs").relative_to(ROOT))]
    folder = "components" if kind == "component" else "patterns"
    paths = [str((DOCS_PAGES / folder / f"{slug}.astro").relative_to(ROOT))]
    if kind == "component":
        css_dirs = [
            d for d in slug_to_css_dirs().get(slug, [])
            if (CSS_COMPONENTS / d).is_dir()
        ]
        paths += [str((CSS_COMPONENTS / d).relative_to(ROOT)) for d in css_dirs]
        paths += behavior_paths(surface, css_dirs)
    return paths


def digest(surface: str, tree: str | None = None) -> str:
    """Short digest of the blob SHAs defining a surface. '-' if it has none."""
    return digest_paths(source_paths(surface), tree)


def digest_paths(paths: list[str], tree: str | None = None) -> str:
    """The digest, over an EXPLICIT path list.

    Split out of `digest()` so `stamp_provenance` below can ask the same
    question of the path set as it was BEFORE 276.1 widened it. Nothing else
    changed.
    """
    if tree:
        lines = [
            ln for p in paths
            for ln in git("ls-tree", "-r", tree, "--", p).splitlines()
        ]
        blobs = sorted(ln.split()[2] for ln in lines if ln.strip())
    else:
        # WORKING TREE, not the index. `git ls-files -s` reports the STAGED
        # blob, so an edit that has not been `git add`ed is invisible — a wake
        # that changed a screen and had not yet committed would be told nothing
        # moved. Found by the Accept test for 145.3: touching a .screen.mjs
        # produced no re-entry at all. hash-object hashes what is on disk.
        listed = [
            ln for p in paths
            for ln in git("ls-files", "--", p).splitlines()
            if ln.strip()
        ]
        blobs = sorted(
            git("hash-object", "--", f).strip() for f in listed
        )
    if not blobs:
        return "-"
    return subprocess.run(
        ["git", "hash-object", "--stdin"], cwd=ROOT, input="\n".join(blobs),
        capture_output=True, text=True, check=True,
    ).stdout.strip()[:8]


def _parent(rev: str) -> str:
    """The short sha of `rev`'s first parent, or "" for a root commit.

    `git()` runs with check=True, and `rev-parse <root>^` exits 128 — which is
    a normal answer here, not a failure, and it aborted the first --audit-stamps
    run on the repo's own root commit.
    """
    done = subprocess.run(
        ["git", "rev-parse", "--verify", "--short", f"{rev}^"],
        cwd=ROOT, capture_output=True, text=True,
    )
    return done.stdout.strip() if done.returncode == 0 else ""


def stamp_provenance(surface: str, stamp: str) -> tuple[str, str]:
    """Can a re-queued surface's stamp be REPRODUCED from a commit?

    @exact -- every verdict here is an equality between two digests. There is
    no recognising, so there is nothing to fool.

    WHY THIS EXISTS (roadmap 283.1, measured 2026-09-05). A re-queue means
    "this surface's source moved since it was last polished", and that reading
    is only true while the recorded stamp and today's digest were computed the
    same way. 276.1 widened the path set to include behavior modules and did
    NOT re-stamp the rows that had been computed without them -- so for those
    rows the two digests can never agree again, whatever the source does. The
    re-queue became a constant, and a constant reported as a measurement is the
    dead-detector shape CLAUDE.md refuses. It landed in the round whose whole
    subject was this script's blindness, which is why it went unnoticed.

    Measured over the 21-row polish ledger at `7079c94`: 7 rows current, 7
    genuinely moved, and **7 whose stamp no revision of their own paths
    reproduces** -- so the predicate discriminates at a third of the file and
    is not the always-true kind 94.11 refuses. Of the 7: five (`alerts`,
    `dashboard`, `stepper`, `table-toolbar`, `tree-table`) reproduce EXACTLY
    under the pre-276.1 narrow set at the commit that recorded them, and two
    (`data-table`, `pagination`) reproduce under neither.

    Two instruments agree on that split, which is why it is stated: an
    exhaustive walk of every commit touching each surface's paths (183 revs for
    `data-table`), and the cheap two-revision test this function performs.
    Both return the same seven. The cheap one is what ships, because this runs
    at Polish step 0 every wake.

    The verdicts, and what each does NOT say:

    - ``reproducible`` -- the stamp is the digest at the commit that recorded
      it (or its parent, since a round records the row and the source edit in
      one commit). The re-queue means what it says.
    - ``narrow`` -- the stamp reproduces only WITHOUT the behavior modules.
      Certain: it was taken under the pre-276.1 formula, and this surface will
      re-queue on every run until something re-stamps it.
    - ``orphan`` -- reproduces under neither set **at the commit that recorded
      it or that commit's parent**. Say it that narrowly: this test looks at
      exactly two revisions, and a stamp may legitimately describe an OLDER
      tree than the commit carrying it -- `--backfill` seeds every row from a
      historical tree and does precisely that. `component/date` is the live
      example and it is why this wording is not "reproducible nowhere": its
      stamp reads `orphan` here and `--audit-stamps` finds it exactly at
      `3909b80a`, a day before the row was written. For `data-table` and
      `pagination` the exhaustive walk agrees with the cheap verdict (183 and
      33 revisions tested, no match); for `date` it refutes it. So the cheap
      test's `orphan` is a SUPERSET of the real thing, deliberately: it is what
      can be afforded at step 0 every wake, and `--audit-stamps` settles any
      row it names.
    - ``unknown`` -- the digest appears in no commit of the ledger, so there is
      nothing to compare against. A shallow clone reaches this; so does a
      hand-edited row.

    Both `narrow` and `orphan` mean the same thing operationally: the re-queue
    carries no information about source movement. Neither is suppressed --
    a surface may have moved as well, and a wake that stops polishing a surface
    because this line printed would be trading a false signal for a false
    silence.
    """
    intro = git(
        "log", "--reverse", "--format=%h", "-S", stamp, "--", str(LEDGER)
    ).split()
    if not intro:
        return "unknown", "no commit in the ledger's history records this digest"
    rev = intro[0]
    parent = _parent(rev)
    revs = [r for r in (rev, parent) if r]

    wide = source_paths(surface)
    for r in revs:
        if digest_paths(wide, r) == stamp:
            return "reproducible", f"the digest at {r}"

    narrow = [p for p in wide if "/js/behaviors/" not in p]
    if narrow != wide:
        for r in revs:
            if digest_paths(narrow, r) == stamp:
                return (
                    "narrow",
                    f"the PRE-276.1 digest at {r} — behavior modules excluded",
                )
    return "orphan", f"not the digest at {rev} or its parent — run --audit-stamps"


def audit_stamps(surface: str, stamp: str) -> tuple[bool, str]:
    """The exhaustive form of `stamp_provenance`: is this digest reproducible
    at ANY revision that touched the surface's own paths?

    @exact, and slow on purpose -- `data-table` has 95 touching commits and the
    walk tests 183 revisions. It is not run at step 0; it is what settles a row
    the cheap two-revision test names, and what the strong claim in roadmap 283
    was measured with, so that claim is re-runnable rather than re-derived.
    """
    wide = source_paths(surface)
    narrow = [p for p in wide if "/js/behaviors/" not in p]
    sets = [(wide, "current")]
    if narrow != wide:
        sets.append((narrow, "PRE-276.1"))
    tested = 0
    for paths, label in sets:
        touched = git("log", "--format=%h", "--", *paths).split()
        revs = set(touched)
        for t in touched:
            parent = _parent(t)
            if parent:
                revs.add(parent)
        tested += len(revs)
        for r in sorted(revs):
            if digest_paths(paths, r) == stamp:
                return True, f"reproducible under the {label} path set at {r}"
    return False, f"no revision of its own paths reproduces it ({tested} tested)"


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
    ap.add_argument(
        "--audit-stamps", action="store_true",
        help="exhaustive: for every row, is its stamp reproducible at ANY "
             "revision of its own paths? Slow; settles what --check's cheap "
             "two-revision test can only suspect.",
    )
    ap.add_argument(
        "--ledger", choices=sorted(LEDGERS), default="polish",
        help="which ledger to operate on; both share the shape and the src digest",
    )
    args = ap.parse_args()

    global LEDGER
    LEDGER = LEDGERS[args.ledger]
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

    if args.audit_stamps:
        bad = []
        for _, s, _ in rows(text):
            was = recorded[s]
            if was == "-" or not re.fullmatch(r"[0-9a-f]{8}", was):
                print(f"  {s:34s} {was!r:12s} no digest to audit")
                continue
            if digest(s) == was:
                print(f"  {s:34s} {was} CURRENT — equals today's digest")
                continue
            ok, why = audit_stamps(s, was)
            if not ok:
                bad.append(s)
            print(f"  {s:34s} {was} {'OK  ' if ok else 'DEAD'} {why}")
        print(
            f"\n{len(bad)} of {len(recorded)} stamp(s) name a source state no "
            "revision of their own paths carries."
        )
        for s in bad:
            print(f"    {s}")
        return 1 if bad else 0

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
        print(f"{args.ledger} re-entry: {len(recorded)} surface(s) checked, none re-enters the queue")
        report_excluded()
        return 0

    print(f"{args.ledger} re-entry: {len(changed)} surface(s) whose SOURCE moved since their last round")
    uninformative = []
    for s, was, now in changed:
        kind, why = stamp_provenance(s, was)
        if kind == "reproducible":
            note = ""
        else:
            uninformative.append((s, kind))
            note = f"   ⚠ stamp {kind}: {why}"
        print(f"  {s:34s} {was} -> {now}{note}")
        for p in source_paths(s):
            print(f"      {p}")

    report_excluded()

    if uninformative:
        # Say what the number does NOT cover: these surfaces may have moved too.
        # The claim is only that their re-queue cannot show it.
        print(
            f"\n⚠ {len(uninformative)} of {len(changed)} re-queue(s) carry NO information "
            "about source movement: the recorded stamp is not the digest at the\n"
            "  commit that recorded it, so it may never equal today's digest and the "
            "surface then re-queues on every run. They may have moved as\n"
            "  well; this cannot tell. `--audit-stamps` settles any row named here — "
            "a stamp seeded from an older tree reads this way and is fine.\n"
            "  Clearing one means a round that ends in `--stamp`, not a hand edit."
        )
        for s, kind in uninformative:
            print(f"    {s:34s} {kind}")

    if args.apply:
        lines = text.splitlines()
        names = {s for s, _, _ in changed}
        marked = []
        already = []
        for i, s, cells in rows(text):
            if s in names:
                parts = lines[i].rstrip().rstrip("|").split("|")
                if "re-queued" not in parts[-1].lower():
                    # Keep the row's spacing shape: the seeder writes "… |" with a
                    # space before the pipe, and appending without it produced rows
                    # a later regex silently skipped — eight of twenty-eight, caught
                    # only by counting what was updated.
                    parts[-1] = parts[-1].rstrip() + " · **RE-QUEUED — source changed** "
                    marked.append(s)
                else:
                    already.append(s)
                lines[i] = "|".join(parts) + "|"
        new_text = "\n".join(lines) + "\n"
        wrote = new_text != text
        if wrote:
            LEDGER.write_text(new_text)
        # Report what was WRITTEN, never the size of the argument. This line used
        # to read "ledger updated — {len(names)} surface(s) marked for re-score",
        # which is the re-queue set, not the rows that gained a marker. The marker
        # is STICKY — nothing removes it but a hand edit — so a steady-state wake
        # marks nothing at all and the old line still announced a write. Red-proved
        # by discrimination rather than by reading: with all 19 rows already
        # marked the file came back byte-identical, and with one marker stripped
        # exactly one row was rewritten; BOTH runs printed the same "19 surface(s)
        # marked". A message that cannot tell 0 written from 1 is reporting its
        # caller, which is the failure CLAUDE.md names as reconciling against the
        # argument instead of the source.
        print(
            f"\n{len(marked)} row(s) newly marked for re-score; "
            f"{len(already)} already carried the marker; "
            f"{len(names)} re-queued in total"
        )
        print(f"ledger {'updated' if wrote else 'UNCHANGED — nothing to write'}")
    else:
        print("\n(--apply writes this into the ledger; --check only reports)")

    return 1 if args.check else 0


if __name__ == "__main__":
    sys.exit(main())
