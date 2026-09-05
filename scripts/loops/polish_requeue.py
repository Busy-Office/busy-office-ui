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
  polish_requeue.py --restamp component/alerts --at 4beb4b86
                               migrate one row after a PATH-SET change: recompute
                               its digest over the current set at that revision,
                               and record the revision beside it
  polish_requeue.py --verify-stamps
                               does every stamp describe a real tree? Run AFTER
                               the round's commit -- advisory, from
                               record_iteration.py
  polish_requeue.py --audit-stamps
                               exhaustive form of the same question

THE `src` CELL IS `<digest>` OR `<digest>@<revision>` (roadmap 283.2). See
`parse_stamp` for why the revision is an OPTIONAL suffix rather than always
present: `--stamp` runs before its own round's commit, so the revision its
digest describes does not exist yet and cannot be guaranteed. 18 of 18 stamps
reproduce at the commit that CARRIES them; the claim that 0 reproduce at that
commit's parent was WRONG -- it is 16 of 18 (roadmap 285.1). The decision
stands on construction, not on that base rate; see `parse_stamp`.
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


STAMP_RE = re.compile(r"^([0-9a-f]{8})(?:@([0-9a-f]{7,40}))?$")


def parse_stamp(cell: str) -> tuple[str, str | None]:
    """Split a ledger `src` cell into (digest, revision-or-None).

    THE REVISION IS AN OPTIONAL SUFFIX, AND THAT IS THE WHOLE DESIGN
    (roadmap 283.2, 2026-09-05). The item proposed that every stamp carry the
    revision it was taken against. It cannot: `--stamp` runs at the END of a
    Polish round, which is BEFORE that round's commit, so the revision the
    digest describes does not exist yet.

    THE ARGUMENT IS BY CONSTRUCTION, NOT BY BASE RATE, AND THE FIGURE THAT USED
    TO STAND HERE WAS WRONG (roadmap 285.1, the Objective grill of 281/283/284,
    2026-09-05). This docstring said that at the carrier's parent -- HEAD as
    `--stamp` saw it -- **0 of 18** stamps reproduce, and concluded that a
    `@rev` from `--stamp` "would record the one revision the measurement rules
    out, on every row". Re-measured over the same 21-row ledger at `fc79ea85`:
    18 of 18 reproduce at the commit that CARRIES them (that half stands), and
    **16 of those 18 also reproduce at that commit's parent** -- because 16 of
    the carrier commits never touched the surface's own source. A round that is
    a NO-OP on its surface commits only the ledger and the roadmap, so HEAD's
    source is the tree `--stamp` digested. `component/progress` is the plain
    case: `a940c8f3` changed `polish-state.md`, `ROADMAP.md` and this script,
    and its digest is identical at the parent.

    So a mandatory `@HEAD` would have been RIGHT on 16 of 18 rows and wrong on
    2 (`byline`, `icon` -- the rounds that edited their own surface in the same
    commit). It is still refused, on the ground that survives measurement:
    `--stamp` cannot know, at the moment it runs, whether the round will go on
    to commit a source change, so it cannot write a revision it can guarantee.
    A WRONG suffix is worse than an absent one, because a suffixed stamp is
    verified by ONE equality at the named revision and skips the search that
    would otherwise recover the right commit -- so the 2 bad rows would read as
    confident and be unrecoverable, where a bare stamp is merely searched for.
    The reconciliation that settles it: reproduces-at-parent holds for exactly
    those rows whose carrier did not touch the surface source, 18 of 18 in
    agreement. Commands in `.roundtable/grill-objective-281-283-284-2026-09-05.md`.

    So the suffix is written exactly where the revision is known BY
    CONSTRUCTION -- `--restamp --at REV` and `--backfill SHA`, both of which
    compute the digest at a named tree -- and omitted for a working-tree stamp,
    whose revision is recovered by the search below (exact on 18 of 18).

    That asymmetry is the point rather than a shortcut. A migrated stamp is the
    case the search CANNOT resolve: it is introduced by the migration commit,
    where its own digest is not the tree's, so it would read `orphan` forever.
    283.1 refused the migration for exactly that reason. The suffix is what
    makes the migration possible, and it is needed nowhere else.
    """
    m = STAMP_RE.match(cell.strip())
    if not m:
        return cell.strip(), None
    return m.group(1), m.group(2)


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
    stamp, at = parse_stamp(stamp)
    wide = source_paths(surface)

    if at:
        # The lookup the search cannot do. A stamp carrying its revision is
        # verified by ONE equality at that revision -- no history walk, and no
        # dependence on which commit happens to introduce the digest, which is
        # what breaks for a migrated row.
        if digest_paths(wide, at) == stamp:
            return "reproducible", f"the digest at {at}, read from the stamp"
        narrow_at = [p for p in wide if "/js/behaviors/" not in p]
        if narrow_at != wide and digest_paths(narrow_at, at) == stamp:
            return (
                "narrow",
                f"the PRE-276.1 digest at {at}, read from the stamp — "
                "behavior modules excluded",
            )
        # An exact, immediate diagnosis of a path-set change: the stamp names
        # its own tree, so a disagreement there cannot be "the source moved".
        return (
            "path-set",
            f"the stamp names {at}, and the digest there matches under NO "
            "current path set — the set this surface is computed over has "
            "changed since the stamp was written",
        )

    intro = git(
        "log", "--reverse", "--format=%h", "-S", stamp, "--", str(LEDGER)
    ).split()
    if not intro:
        return "unknown", "no commit in the ledger's history records this digest"
    rev = intro[0]
    parent = _parent(rev)
    revs = [r for r in (rev, parent) if r]

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
    # Say WHICH orphan this is. Measured 2026-09-05 (roadmap 283.2) on the two
    # live cases: when the introducing commit touched the surface's own source,
    # every committed blob combination was enumerated -- 2 trees for
    # `data-table`, 4 for `pagination` -- and NONE reproduced the stamp. The
    # only tree left is one that was never committed, i.e. `--stamp` ran and the
    # round then edited the source again before committing. That is a different
    # fault from a formula change and it wants a different fix (stamp last, and
    # `--verify-stamps` after the commit), so the verdict names it.
    #
    # `git diff-tree`, never `git log -1 <rev> -- <paths>`: the log form walks
    # BACK from rev and answers with the newest touching commit at or before it,
    # so it is non-empty almost always and reads as "yes" for nearly every row.
    # The first version of this check used it and claimed `f57570f4` touched
    # `component/date`'s source; diff-tree shows it touched none of it, and for
    # `6cb26268` the log form answered `a098cf85` — a different commit.
    if git("diff-tree", "--no-commit-id", "--name-only", "-r", rev, "--", *wide).strip():
        return "orphan", (
            f"not the digest at {rev} or its parent, and {rev} DID touch this "
            "surface's own source — the stamp was taken mid-round and then "
            "invalidated by a later edit in the same commit; re-stamp it at "
            f"`--restamp {surface} --at {rev}` (run --audit-stamps to confirm)"
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
    stamp, at = parse_stamp(stamp)
    wide = source_paths(surface)
    narrow = [p for p in wide if "/js/behaviors/" not in p]
    if at:
        # A stamp that names its revision is settled by that revision or not at
        # all. Falling back to the walk would let a row pass on some OTHER
        # commit that happens to collide, which is the searching behaviour this
        # suffix exists to remove.
        if digest_paths(wide, at) == stamp:
            return True, f"reproducible at {at}, read from the stamp (no search)"
        if narrow != wide and digest_paths(narrow, at) == stamp:
            return True, (
                f"reproducible at {at} under the PRE-276.1 path set, read from "
                "the stamp (no search)"
            )
        return False, (
            f"the stamp names {at} and does not reproduce there under any "
            "current path set — the path set has changed since it was written"
        )
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
        "--restamp", metavar="SURFACE",
        help="migrate one row: recompute its digest over the CURRENT path set "
             "at the revision given by --at, and record that revision beside "
             "it. This is the mechanical migration after a path-set change.",
    )
    ap.add_argument(
        "--at", metavar="REV",
        help="the revision --restamp computes the digest at; required with it",
    )
    ap.add_argument(
        "--verify-stamps", action="store_true",
        help="cheap: does every stamp describe a real tree? Run AFTER a round's "
             "commit — a stamp taken mid-round and then invalidated by a later "
             "edit in the same commit is only visible once that commit exists.",
    )
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
        # Record the revision: a backfilled digest is computed at a named tree
        # by construction, so it is exactly the case the search cannot resolve.
        # `component/date` is the live proof — seeded from a historical tree, it
        # reads `orphan` under the search and is perfectly fine.
        at = git("rev-parse", "--short", args.backfill).strip()
        seed = {
            s: (f"{d}@{at}" if d != "-" else "-")
            for _, s, _ in rows(text)
            for d in [digest(s, tree=args.backfill)]
        }
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

    if args.restamp:
        if not args.at:
            print("--restamp needs --at REV (the revision to compute at)", file=sys.stderr)
            return 2
        if args.restamp not in recorded:
            print(f"no such surface in the ledger: {args.restamp}", file=sys.stderr)
            return 2
        try:
            at = git("rev-parse", "--short", args.at).strip()
        except subprocess.CalledProcessError:
            print(f"--at {args.at!r} is not a revision in this repository", file=sys.stderr)
            return 2
        new = digest(args.restamp, tree=at)
        if new == "-":
            print(
                f"{args.restamp} has no source blobs at {at} — refusing to "
                "record a '-' over a real stamp", file=sys.stderr,
            )
            return 2
        old = recorded[args.restamp]
        lines = text.splitlines()
        for i, s, cells in rows(text):
            if s == args.restamp:
                parts = lines[i].rstrip().rstrip("|").split("|")
                parts[-2] = f" {new}@{at} "
                lines[i] = "|".join(parts) + "|"
        LEDGER.write_text("\n".join(lines) + "\n")
        today = digest(args.restamp)
        print(f"restamped {args.restamp}: {old} -> {new}@{at}")
        print(
            "  this row now "
            + ("does NOT re-queue — its source is unmoved since that revision"
               if new == today else
               f"STILL re-queues ({new} -> {today}) — its source genuinely "
               "moved since that revision, which is the re-queue meaning what "
               "it says")
        )
        return 0

    if args.verify_stamps:
        # Every row, not just the re-queued ones: a stamp can describe no tree
        # at all while still differing from today's digest, which is precisely
        # how `data-table` and `pagination` went unnoticed for a day.
        broken = []
        for _, s, _ in rows(text):
            was = recorded[s]
            d, _at = parse_stamp(was)
            if was == "-" or not STAMP_RE.match(was):
                continue
            if digest(s) == d:
                continue
            kind, why = stamp_provenance(s, was)
            if kind != "reproducible":
                broken.append((s, kind, why))
        if not broken:
            print(
                f"stamp verification: {len(recorded)} row(s), every stamp "
                "describes a real tree"
            )
            return 0
        print(
            f"stamp verification: {len(broken)} of {len(recorded)} stamp(s) "
            "describe no tree any commit carries, so their re-queue cannot "
            "mean 'the source moved':"
        )
        for s, kind, why in broken:
            print(f"  {s:34s} {kind}: {why}")
        return 1

    if args.audit_stamps:
        bad = []
        for _, s, _ in rows(text):
            was = recorded[s]
            d, at = parse_stamp(was)
            if was == "-" or not STAMP_RE.match(was):
                print(f"  {s:34s} {was!r:12s} no digest to audit")
                continue
            if digest(s) == d:
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
        # NO REVISION SUFFIX HERE, DELIBERATELY -- see `parse_stamp`. This
        # digest is of the WORKING TREE, which becomes the round's next commit;
        # that commit does not exist yet, and HEAD is an answer this call cannot
        # GUARANTEE -- right whenever the round is a no-op on its own surface
        # (16 of 18 measured), wrong exactly when it is not, and unrecoverable
        # when wrong because a suffix is trusted instead of searched for.
        # (The "0 of 18 reproduce at HEAD" that used to justify this line was
        # wrong; roadmap 285.1 re-measured it at 16 of 18.)
        new = digest(args.stamp)
        lines = text.splitlines()
        for i, s, cells in rows(text):
            if s == args.stamp:
                parts = lines[i].rstrip().rstrip("|").split("|")
                parts[-2] = f" {new} "
                lines[i] = "|".join(parts) + "|"
        LEDGER.write_text("\n".join(lines) + "\n")
        print(f"stamped {args.stamp} at {new}")
        # The one failure this cannot see: an edit made AFTER this call and
        # before the commit orphans the stamp permanently. `data-table` and
        # `pagination` both died that way on 2026-09-05 (roadmap 283.2), so say
        # so here rather than only in a playbook nobody re-reads mid-round.
        print(
            "  stamp LAST — any edit to this surface's source after this call "
            "and before the commit orphans it.\n"
            "  `--verify-stamps` (advisory, runs from record_iteration.py) is "
            "what catches it once the commit exists."
        )
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
        # Compare on the DIGEST, but carry the whole cell: `stamp_provenance`
        # needs the revision suffix, and stripping it here made every migrated
        # row report `unknown` — the search being handed a stamp whose whole
        # point is that the search cannot resolve it.
        cell = recorded[s]
        was, now = parse_stamp(cell)[0], digest(s)
        if was == now or was == "-":
            continue
        status, dry = cells[-1], cells[-3]
        if "SKIPPED" in status:
            excluded.append((s, "SKIPPED in the ledger"))
        elif dry not in ("0", "—", "-", ""):
            excluded.append((s, f"marked dry ({dry})"))
        else:
            changed.append((s, cell, now))

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
