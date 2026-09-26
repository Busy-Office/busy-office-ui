#!/usr/bin/env python3
"""Generate STATUS.md — the human's ten-second "now" view (roadmap 110.5).

STATUS.md is a DERIVED MIRROR, same doctrine as loops.db (see CLAUDE.md's
storage doctrine): it is regenerated wholesale from three sources that are
already the record —

  - ROADMAP.md        open items (`N. [ ] **NN.N — Title.**`), scanned fresh
  - .roundtable/loop-log.md   last 10 iterations (via loops.db, the mirror
                              already built from that log)
  - dispatch_status.py        the existing counter-overdue report, run as a
                              subprocess and embedded verbatim — no duplicate
                              counting logic

Nothing here is hand-authored data. If a number looks wrong, the fix is in
ROADMAP.md, loop-log.md, or dispatch_status.py — never in this file or its
output.

Usage:
    python3 scripts/loops/generate_status.py            # writes STATUS.md
    python3 scripts/loops/generate_status.py --check     # exit 1 if stale

Rebuildable: `rm STATUS.md && python3 scripts/loops/generate_status.py` must
reproduce the file byte-for-byte (the only changing input is the "generated
at" timestamp, which --check tolerates — see below).
"""
import argparse
import datetime
import re
import subprocess
import sys

import rebuild_from_log
from _common import ROOT, LOG, SCHEMA, connect, parse_log_line

import os

ROADMAP = os.path.join(ROOT, "ROADMAP.md")
STATUS = os.path.join(ROOT, "STATUS.md")
ARCHIVE = os.path.join(ROOT, "ROADMAP-archive.md")

# Matches the roadmap's open-item convention: "N. [ ] **NN.N[a-z] — Title.**"
# The numeric id is OPTIONAL. It was mandatory until 2026-08-25, and that
# silently hid two of nine open items — including the one titled "OWNER CALL —
# direction", a stated release blocker, from the very section that exists to
# surface owner decisions. The old code even wrote the wrong assumption down:
# "bare 'N.' list markers without a NN.N id aren't roadmap items". They are;
# some items are named rather than numbered.
#
# A `TAG · ` prefix before the id is allowed (roadmap 393.3): 377.5 and 377.6
# are written `**OWNER · 377.5 — …**` and six closed items `**P0 · 375.10 —
# …**`. Without it they parsed as un-numbered items — no id to rank, and no
# id for an `After:` line to resolve against.
PREFIX = r"(?:[A-Z][A-Z0-9]*\s*·\s*)?"
ITEM = re.compile(
    r"^\d+\.\s*\[ \]\s*\*\*" + PREFIX + r"(?:(\d+)(\.\d+[a-z]?)?\s*(?:—|-)\s*)?([^*]+?)\*\*",
    re.M,
)

# Every open checkbox, however its title is written. Used ONLY to reconcile
# against what ITEM parsed: a mirror that under-reports what is open is worse
# than no mirror, because the number gets quoted while steering priorities.
ANY_OPEN = re.compile(r"^\d+\.\s*\[ \]", re.M)

# Every item, open or closed — the boundaries of an item's body. Only open
# items bounded a body until 393.3, so an open item followed by a closed one
# read the closed one's text as its own.
ANY_ITEM = re.compile(r"^\d+\.\s*\[[ xX]\]", re.M)
ITEM_ID = re.compile(r"^\d+\.\s*\[([ xX])\]\s*\*\*" + PREFIX + r"(\d+\.\d+[a-z]?)\b", re.M)
# A body also ends at any heading or horizontal rule: text under a `### `
# note or after `---` belongs to no item, so a marker there must refuse the
# write rather than hold whichever item happens to sit above it.
BODY_END = re.compile(r"^(?:#{1,6} |---[ \t]*$)", re.M)

# An item is owner-blocked when it SAYS so. Matching the bare word "owner" was
# wrong in both directions and wrong in a way that costs work: 145.4 reads
# "DECIDED 2026-08-25, owner: FINISH THEM" — an item the owner had just
# AUTHORISED — and it was filed under "needs an owner decision", telling the
# loop to leave it alone. These are the markers the roadmap uses.
#
# Read against the body with its whitespace collapsed, because a marker wraps
# like any other prose ("OWNER\n       CALL" hid 373.8), and with code spans
# removed, because an item that DESCRIBES a marker (393.3's own Accept quotes
# `OWNER ·`) is not blocked by it. `Route: owner` also counts, so the route
# and the prose cannot disagree (roadmap 393.3). Bare `BLOCKED` is a whole
# capitalised word: `UNBLOCKED` and `OWNER-BLOCKED` are not it.
OWNER_MARK = re.compile(
    r"BLOCKED ON|OWNER CALL|OWNER OR [A-Z0-9][\w-]*(?: [A-Z0-9][\w-]*)* CALL"
    r"|OWNER\s*·|NEEDS-RUNTIME|(?<![A-Za-z-])BLOCKED\b"
)
# Browser-blocked in LOOPS.md rule 4's sense: needs Podman and screenshots,
# which a local wake can take and a cloud wake cannot. Parallel to
# NEEDS-RUNTIME, which is the owner's hardware and so owner-blocked.
BROWSER_MARK = re.compile(r"NEEDS-BROWSER")

# The own-line markers (roadmap 393.3). Each sits on its own, INDENTED line
# inside an item. RAW is deliberately looser than the parsers — any case, any
# indentation, behind a bullet, bold or quote — so a line that looks like a
# marker but does not parse (`after: 1.2`, `- After: 1.2`, `After : 1.2`,
# `Phase: 5`, a marker at column 0, in a code fence or outside any item) is
# counted by RAW and missed by the parser, and the difference refuses the
# write instead of dropping the marker silently. RAW matched exactly the
# strict lines on 2026-09-25 (130 = 130), so it adds no false refusals.
MARKER_KINDS = ("After", "Parked", "Milestone", "Route", "Track")
_H = r"[^\S\n]"
MARKER_RAW = re.compile(
    rf"^(?:{_H}|[>*_\-])*(after|parked|milestone|route|track)\**{_H}*:", re.M | re.I
)
MARKER_PARSE = {
    "After": re.compile(r"^[ \t]+After: (\d+\.\d+[a-z]?(?:, \d+\.\d+[a-z]?)*)[ \t]*$"),
    "Parked": re.compile(r"^[ \t]+Parked: (M\d+) — \S.*$"),
    "Milestone": re.compile(r"^[ \t]+Milestone: (M\d+) · Phase: ([0-3])[ \t]*$"),
    "Route": re.compile(r"^[ \t]+Route: ([a-z][a-z0-9-]*)[ \t]*$"),
    "Track": re.compile(r"^[ \t]+Track: (defect)[ \t]*$"),
}
FENCE = re.compile(r"^[ \t]*(`{3,}|~{3,})")

MILESTONE_HEAD = re.compile(r"^## Milestone (M\d+)\b", re.M)


def _strip_code(s):
    """The body with fenced blocks and inline code spans removed.

    Fences may be indented — list items indent theirs, and ROADMAP.md has 11
    such fences inside items. Inline spans pair CommonMark's way: a run of N
    backticks closes only at the next run of exactly N, and an unmatched run
    stays literal. Pairing single backticks naively let an unstripped fence's
    last backtick swallow the prose up to the next span, hiding a real marker
    (393.3's verification, 2026-09-25). A span never crosses a blank line."""
    out_lines, fence = [], None
    for line in s.split("\n"):
        f = FENCE.match(line)
        if fence:
            if f and f.group(1)[0] == fence[0] and len(f.group(1)) >= len(fence):
                fence = None
            continue
        if f:
            fence = f.group(1)
            continue
        out_lines.append(line)
    paras = re.split(r"\n[ \t]*\n", "\n".join(out_lines))
    kept = []
    for p in paras:
        runs = list(re.finditer(r"`+", p))
        pieces, pos, j = [], 0, 0
        while j < len(runs):
            n = len(runs[j].group())
            close = next((k for k in range(j + 1, len(runs)) if len(runs[k].group()) == n), None)
            if close is None:
                j += 1
                continue
            pieces.append(p[pos:runs[j].start()] + " ")
            pos, j = runs[close].end(), close + 1
        pieces.append(p[pos:])
        kept.append("".join(pieces))
    return "\n\n".join(kept)


def milestone_status(text):
    """{'M1': 'DRAFT'|'ACTIVE'|'CLOSED'|…} from each `## Milestone Mn` section's
    first fenced block. milestone.py (393.4) owns the full field parse; this
    reads only `Status:`, which is all `Parked:` needs."""
    out = {}
    for m in MILESTONE_HEAD.finditer(text):
        rest = text[m.end():]
        stop = re.search(r"^## ", rest, re.M)
        sect = rest[: stop.start()] if stop else rest
        fence = re.search(r"^```\n(.*?)^```", sect, re.M | re.S)
        st = re.search(r"^Status:\s*(\w+)", fence.group(1), re.M) if fence else None
        if not st:
            raise SystemExit(
                f"generate_status: `## Milestone {m.group(1)}` has no `Status:` in "
                "its first fenced block, so a `Parked:` marker cannot be decided."
            )
        out[m.group(1)] = st.group(1).upper()
    return out


def item_spans(text):
    """[(start, end)] of every item's body, open or closed: to the next item,
    heading or horizontal rule, whichever comes first."""
    starts = [m.start() for m in ANY_ITEM.finditer(text)]
    spans = []
    for i, s in enumerate(starts):
        end = starts[i + 1] if i + 1 < len(starts) else len(text)
        h = BODY_END.search(text, s + 1)
        if h:
            end = min(end, h.start())
        spans.append((s, end))
    return spans


def parse_markers(body):
    """{kind: [match, …]} for the own-line markers in one item's body. Lines
    inside a code fence are examples, not markers, so they are skipped here —
    RAW still counts them, and the difference refuses."""
    found = {k: [] for k in MARKER_KINDS}
    fence = None
    for line in body.splitlines():
        f = FENCE.match(line)
        if fence:
            if f and f.group(1)[0] == fence[0] and len(f.group(1)) >= len(fence):
                fence = None
            continue
        if f:
            fence = f.group(1)
            continue
        for k, rx in MARKER_PARSE.items():
            mm = rx.match(line)
            if mm:
                found[k].append(mm)
    return found


def all_item_ids(text):
    """{id: 'open'|'closed'} for every numbered item in a roadmap text."""
    ids = {}
    for m in ITEM_ID.finditer(text):
        state = "open" if m.group(1) == " " else "closed"
        if ids.get(m.group(2)) != "open":
            ids[m.group(2)] = state
    return ids


def _after_cycles(items):
    """Open items whose `After:` chain comes back to themselves — each would
    be held forever, silently."""
    graph = {it["id"]: it["after_open"] for it in items if it["id"]}
    bad = []
    for start in graph:
        seen, stack = set(), list(graph[start])
        while stack:
            n = stack.pop()
            if n == start:
                bad.append(start)
                break
            if n in seen:
                continue
            seen.add(n)
            stack.extend(graph.get(n, []))
    return bad


def parse_roadmap(text, archive_text=""):
    """Every open item as a dict, reconciled against the raw text.

    Keys: slice, id, title, owner, owner_quoted, browser, after (all targets),
    after_open (the targets still open), parked, parked_held, milestone,
    phase, route, track. Raises SystemExit — refusing the write — when a raw
    count disagrees with what was parsed, an `After:` target resolves nowhere,
    or `After:` lines form a cycle.
    """
    ms = milestone_status(text)
    ids = all_item_ids(archive_text)
    for k, v in all_item_ids(text).items():
        if ids.get(k) != "open":
            ids[k] = v

    heads = {m.start(): m for m in ITEM.finditer(text)}
    parsed_markers = {k: 0 for k in MARKER_KINDS}
    items, problems = [], []
    for s, e in item_spans(text):
        body = text[s:e]
        mk = parse_markers(body)
        for k in MARKER_KINDS:
            parsed_markers[k] += len(mk[k])
        m = heads.get(s)
        if m is None:
            continue  # a closed item: its markers count, its body is not listed
        major, minor = m.group(1), m.group(2) or ""
        title = " ".join(m.group(3).split())
        if major is None:
            major, minor = "—", ""
        iid = f"{major}{minor}" if major != "—" else ""
        label = iid or title[:40]
        for k in ("Parked", "Milestone", "Route", "Track"):
            if len(mk[k]) > 1:
                problems.append(f"{label} has {len(mk[k])} `{k}:` lines; one is allowed")
        prose = " ".join(_strip_code(body).split())
        route = mk["Route"][0].group(1) if mk["Route"] else ""
        owner = bool(OWNER_MARK.search(prose)) or route == "owner"
        quoted = not owner and bool(OWNER_MARK.search(" ".join(body.split())))
        after = [t for mm in mk["After"] for t in mm.group(1).split(", ")]
        for t in after:
            if t not in ids:
                problems.append(f"{label} is `After: {t}`, and {t} is no item in ROADMAP.md or ROADMAP-archive.md")
        parked = mk["Parked"][0].group(1) if mk["Parked"] else ""
        if parked and parked not in ms:
            problems.append(f"{label} is `Parked: {parked}`, and ROADMAP.md has no `## Milestone {parked}`")
        items.append({
            "slice": major, "id": iid, "title": title, "body": body,
            "owner": owner, "owner_quoted": quoted,
            "browser": bool(BROWSER_MARK.search(prose)),
            "after": after, "after_open": [t for t in after if ids.get(t) == "open"],
            "parked": parked, "parked_held": bool(parked) and ms.get(parked) == "ACTIVE",
            "milestone": mk["Milestone"][0].group(1) if mk["Milestone"] else "",
            "phase": mk["Milestone"][0].group(2) if mk["Milestone"] else "",
            "route": route,
            "track": mk["Track"][0].group(1) if mk["Track"] else "",
        })

    raw = len(ANY_OPEN.findall(text))
    if raw != len(items):
        raise SystemExit(
            f"generate_status: ROADMAP.md has {raw} open checkbox(es) but only "
            f"{len(items)} parsed. STATUS.md would under-report what is open, "
            "which is exactly the failure this check exists to stop. Fix ITEM "
            "or the roadmap's formatting before regenerating."
        )
    reconcile_markers(text, parsed_markers)
    for c in _after_cycles(items):
        problems.append(f"{c}'s `After:` chain comes back to {c}, so it would be held forever")
    if problems:
        raise SystemExit("generate_status: refusing to write —\n  " + "\n  ".join(problems))
    return items


def reconcile_markers(text, parsed):
    """Count the raw marker lines in the SOURCE and compare with what the item
    parse attributed. Never compared with the caller's list — a reconcile that
    cannot see past its own argument cannot fail (CLAUDE.md storage doctrine)."""
    raw = {k: 0 for k in MARKER_KINDS}
    for m in MARKER_RAW.finditer(text):
        raw[m.group(1).capitalize()] += 1
    bad = [f"{k}: {raw[k]} line(s) in ROADMAP.md, {parsed[k]} parsed inside items"
           for k in MARKER_KINDS if raw[k] != parsed[k]]
    if bad:
        raise SystemExit(
            "generate_status: the own-line markers do not reconcile —\n  "
            + "\n  ".join(bad)
            + "\nA marker line is malformed, unindented, fenced, or sits outside "
            "any item. Fix it in ROADMAP.md; a marker the mirror drops is a hold "
            "nobody sees."
        )


def raw_open_after_targets(text):
    """How many `After:` target ids sit inside OPEN items, counted by walking
    the SOURCE's lines — a second, simpler reading than item_spans, used to
    reconcile the mirror's after column (393.3's verification: a mirror that
    wrote an empty after column for every row was refused by nothing)."""
    n, state, fence = 0, None, None
    for line in text.split("\n"):
        f = FENCE.match(line)
        if fence:
            if f and f.group(1)[0] == fence[0] and len(f.group(1)) >= len(fence):
                fence = None
            continue
        if f:
            fence = f.group(1)
            continue
        item = re.match(r"^\d+\.\s*\[([ xX])\]", line)
        if item:
            state = "open" if item.group(1) == " " else "closed"
        elif re.match(r"^(?:#{1,6} |---[ \t]*$)", line):
            state = None
        elif state == "open":
            a = re.match(r"^[ \t]+After: (.*)$", line)
            if a:
                n += len(re.findall(r"\d+\.\d+[a-z]?", a.group(1)))
    return n


def milestone_progress(text, archive_text=""):
    """{mid: (status line, {phase: (open, closed)})} counted from the markers of
    every item, open or closed, in ROADMAP.md AND ROADMAP-archive.md — a swept
    slice's items are closed, and dropping them would make a phase vanish or
    shrink (393.8's verification). The spans and marker parser are the ones the
    reconcile uses for ROADMAP.md."""
    heads = re.finditer(r"^## Milestone (M\d+)\b", text, re.M)
    status = {}
    for h in heads:
        st = re.search(r"^Status:\s*(.+?)\s*(?:#.*)?$", text[h.end():], re.M)
        status[h.group(1)] = st.group(1) if st else "?"
    out = {mid: (st, {}) for mid, st in status.items()}
    for src in (text, archive_text):
      for s, e in item_spans(src):
        body = src[s:e]
        mk = parse_markers(body)
        if not mk["Milestone"]:
            continue
        mid, ph = mk["Milestone"][0].group(1), mk["Milestone"][0].group(2)
        is_open = bool(ANY_OPEN.match(body)) and src is text
        o, c = out.setdefault(mid, ("?", {}))[1].get(ph, (0, 0))
        out[mid][1][ph] = (o + is_open, c + (not is_open))
    return out


def blocked_kind(it):
    """Why an open item cannot be dispatched, or '' when it can. Browser-blocked
    is listed but not a hold: the one dispatcher (O1) is a local wake."""
    if it["owner"]:
        return "owner"
    if it["after_open"]:
        return "dependency"
    if it["parked_held"]:
        return "parked"
    return ""


def _id_key(iid):
    m = re.match(r"(\d+)(?:\.(\d+))?([a-z]?)", iid)
    return (int(m.group(1)), int(m.group(2) or 0), m.group(3))


def oldest_dispatchable(items, exclude_milestones=()):
    """Dispatcher rule 4's pick: the oldest open NUMBERED item nothing holds.
    A named item has no age to rank by; render() lists any free one beside
    the pick rather than dropping it silently. While a milestone is ACTIVE its
    items are rule M's, not rule 4's (the prompt's §4, rule 6)."""
    free = [it for it in items if it["id"] and not blocked_kind(it)
            and it["milestone"] not in exclude_milestones]
    return min(free, key=lambda it: _id_key(it["id"])) if free else None


def _read(path):
    return open(path, encoding="utf-8").read() if os.path.exists(path) else ""


def roadmap_items(path=ROADMAP):
    if not os.path.exists(path):
        raise SystemExit(f"generate_status: {path} does not exist — nothing to mirror, so nothing is written.")
    return parse_roadmap(_read(path), _read(ARCHIVE))


def open_items(path=ROADMAP):
    """[(slice_num, item_id, title, owner_blocked)] scanned fresh from ROADMAP.md."""
    return [(it["slice"], it["id"], it["title"], it["owner"]) for it in roadmap_items(path)]


def by_slice(items):
    groups = {}
    for major, item_id, title, _ in items:
        groups.setdefault(major, []).append((item_id, title))
    return dict(sorted(groups.items(), key=lambda kv: (kv[0] == "—", int(kv[0]) if kv[0] != "—" else 0)))


def dispatch_counters():
    """Run dispatch_status.py and return its stdout verbatim — no re-derivation."""
    script = os.path.join(os.path.dirname(__file__), "dispatch_status.py")
    out = subprocess.run(
        [sys.executable, script], capture_output=True, text=True, cwd=ROOT
    )
    text = out.stdout.strip() or "(dispatch_status.py produced no output)"
    if out.returncode != 0:
        # A refusal is part of the status: embedding only stdout used to write
        # STATUS.md as if nothing were wrong (393.4's verification).
        text += f"\n(dispatch_status.py exited {out.returncode})"
        if out.stderr.strip():
            text += "\n" + out.stderr.strip()
    return text


def log_row_count():
    """How many iteration rows the LOG holds — the raw thing, counted in the source."""
    with open(LOG, encoding="utf-8") as f:
        return sum(1 for line in f if parse_log_line(line))


def last_iterations(n=10):
    """Last n rows from loops.db (the mirror), most recent last.

    RECONCILED AGAINST THE LOG BEFORE IT IS READ. The open-items half of this
    generator has carried that assertion since 2026-08-25; this half did not,
    and the gap cost real content the first time a wake ran where the mirror
    was not already warm.

    `loops.db` is git-ignored — correctly, it is derived — so a FRESH CLONE HAS
    NO MIRROR AT ALL. On a cloud wake the container clones, `record_iteration.py`
    creates the db and inserts its own one row, and this function then rendered
    "Last 10 iterations" from a table holding 1, while `loop-log.md` held 1,020.
    STATUS.md is committed, so that would have deleted nine rows of history from
    a tracked file and reported nothing (measured 2026-08-28, roadmap 167.1).

    Exactly CLAUDE.md's rule — *a derived artefact may not decide, on its own,
    what it failed to see* — and the same shape as the STATUS.md defect that
    wrote the rule: a mirror that under-reports, whose number then gets quoted.

    Self-healing rather than fatal, because the mirror is rebuildable BY
    DEFINITION and a hard exit here would fire after the log row was already
    appended, leaving the two records further apart than it found them. The
    rebuild is announced, never silent, and a disagreement that SURVIVES a
    rebuild is a parser bug and does exit.
    """
    want = log_row_count()
    conn = connect()
    have = conn.execute("SELECT count(*) FROM iterations").fetchone()[0]
    if have != want:
        print(
            f"generate_status: loops.db holds {have} iteration(s), "
            f"loop-log.md holds {want} — rebuilding the mirror from the log."
        )
        conn.close()
        rebuild_from_log.main()
        conn = connect()
        have = conn.execute("SELECT count(*) FROM iterations").fetchone()[0]
        if have != want:
            conn.close()
            raise SystemExit(
                f"generate_status: loops.db still holds {have} of {want} log "
                "row(s) after a rebuild. That is a parser bug, not a cold "
                "mirror — STATUS.md would under-report history. Fix "
                "parse_log_line before regenerating."
            )
    rows = conn.execute(
        "SELECT ts, loop, mode, item, outcome, commit_sha FROM iterations "
        "ORDER BY id DESC LIMIT ?",
        (n,),
    ).fetchall()
    conn.close()
    return list(reversed(rows))


MIRROR_COLS = ["item_id", "slice", "title", "blocked", "after", "after_open", "parked",
               "parked_held", "browser", "milestone", "phase", "route", "track", "synced"]


def sync_mirror(items, now_str, db=None, roadmap_text=None):
    """Rebuild the roadmap_items mirror from what was just parsed.

    Wholesale, not incremental: the markdown is the record, so the mirror is
    whatever the record currently says and a stale row is a bug rather than
    history. Rebuildable by construction — delete loops.db and the next run
    restores this table exactly (storage doctrine, CLAUDE.md).

    Exists so "the oldest still-open item" — dispatcher rule 4 — is an ORDER BY
    rather than a scan of a file that had reached 9,824 lines. Since 393.3 it
    also carries each item's own-line markers, so "what is held, and by what"
    is a WHERE clause too.
    """
    conn = connect(db) if db else connect()
    try:
        have = [r[1] for r in conn.execute("PRAGMA table_info(roadmap_items)")]
        if have != MIRROR_COLS:
            # An older mirror: derived, so drop it and let the schema rebuild it.
            conn.execute("DROP TABLE IF EXISTS roadmap_items")
            with open(SCHEMA, encoding="utf-8") as f:
                conn.executescript(f.read())
        conn.execute("DELETE FROM roadmap_items")
        conn.executemany(
            f"INSERT INTO roadmap_items ({', '.join(MIRROR_COLS)}) "
            f"VALUES ({', '.join('?' * len(MIRROR_COLS))})",
            [
                (it["id"] or it["title"], None if it["slice"] == "\u2014" else it["slice"],
                 it["title"], int(it["owner"]), ", ".join(it["after"]), ", ".join(it["after_open"]), it["parked"],
                 int(it["parked_held"]), int(it["browser"]), it["milestone"], it["phase"],
                 it["route"], it["track"], now_str)
                for it in items
            ],
        )
        conn.commit()
        n = conn.execute("SELECT COUNT(*) FROM roadmap_items").fetchone()[0]
        mirrored_after = sum(
            len(a.split(", ")) for (a,) in conn.execute("SELECT after FROM roadmap_items WHERE after != ''")
        )
    finally:
        conn.close()
    # Reconcile against the SOURCE, not against the argument.
    #
    # The first version of this compared `n` to `len(items)` — the list it had
    # just been handed. That is self-consistent by construction: hand it a
    # short list and it happily agrees with itself. Red-proving it by dropping
    # an item produced a PASS, which is the whole "detector that cannot fail"
    # failure mode, committed one hour after writing "a mirror must reconcile
    # against its source" into CLAUDE.md.
    #
    # The source is the markdown. Count its raw checkboxes and compare.
    text = roadmap_text if roadmap_text is not None else open(ROADMAP, encoding="utf-8").read()
    raw = len(ANY_OPEN.findall(text))
    if n != raw:
        raise SystemExit(
            f"generate_status: ROADMAP.md has {raw} open checkbox(es) but the "
            f"mirror holds {n}. A mirror that under-reports gets quoted while "
            "steering priorities — refusing to leave it in that state."
        )
    # The same for the holds: the `After:` targets under open items, counted
    # by walking the source's lines, against what the mirror now carries.
    raw_after = raw_open_after_targets(text)
    if mirrored_after != raw_after:
        raise SystemExit(
            f"generate_status: ROADMAP.md's open items carry {raw_after} `After:` "
            f"target(s) but the mirror holds {mirrored_after}. A dropped target is "
            "a hold nobody sees — refusing to leave the mirror in that state."
        )
    return n


def render(now_str):
    rich = roadmap_items()
    sync_mirror(rich, now_str)
    items = [(it["slice"], it["id"], it["title"], it["owner"]) for it in rich]
    slices = by_slice(items)
    owner_blocked = [(iid, title) for _, iid, title, blocked in items if blocked]
    dependent = [it for it in rich if it["after_open"]]
    quoted = [it for it in rich if it["owner_quoted"]]
    unranked = [it for it in rich if not it["id"] and not blocked_kind(it)]
    parked_all = [it for it in rich if it["parked"]]
    browser = [it for it in rich if it["browser"]]
    active = [k for k, v in milestone_status(_read(ROADMAP)).items() if v == "ACTIVE"]
    oldest = oldest_dispatchable(rich, exclude_milestones=active)
    for it in quoted:
        # Said aloud, never silent: a marker seen only inside code is not
        # counted, and a wrong call here would hide an owner decision. It is
        # also listed in STATUS.md, because record_iteration.py (the only
        # automatic caller) captures this output.
        print(f"generate_status: {it['id'] or it['title'][:40]} names an owner "
              "marker only inside code, so it is not counted as owner-blocked.")
    iterations = last_iterations(10)
    counters = dispatch_counters()

    out = []
    out.append("# STATUS")
    out.append("")
    out.append(
        "Generated — do not hand-edit. Regenerate with "
        "`python3 scripts/loops/generate_status.py` (also runs automatically "
        "after `record_iteration.py`). Source of truth for every number here "
        "is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a "
        "derived mirror — rebuildable from ROADMAP.md and the loop log, so never edit "
        "it by hand. Unlike `loops.db` it is COMMITTED: CLAUDE.md's rule is that a "
        "queryable binary stays git-ignored while a file a human reads and reviews "
        "stays in git, and this one is read."
    )
    out.append("")
    out.append(f"Generated at: {now_str}")
    out.append("")
    out.append(
        f"oldest dispatchable: {oldest['id']} — {oldest['title']}" if oldest
        else "oldest dispatchable: none — every open item is held (see the blocked lists)"
    )
    out.append("")
    out.append(
        "Dispatcher rule 4's pick, computed: the oldest open item that no owner "
        "marker, open `After:` target or held `Parked:` line holds — and, while a "
        "milestone is ACTIVE, that the milestone does not tag (rule M dispatches "
        "those; `dispatch_status.py` prints its pick). No GOAL overrides it: the "
        "owner's M0 bootstrap (O3), the one exception there was, ended with 398.5. "
        "A named item without a number has no age to rank by; any that nothing "
        "holds is listed here instead of being dropped."
    )
    out.append("")
    for it in unranked:
        out.append(f"- unranked and free: {it['title']}")
    if unranked:
        out.append("")

    out.append("## Open items by slice")
    out.append("")
    if slices:
        for major, its in slices.items():
            out.append(f"- **Slice {major}** ({len(its)} open)")
            for iid, title in its:
                out.append(f"  - {iid} — {title}" if iid else f"  - {title}")
    else:
        out.append("(no open items found)")
    out.append("")

    out.append("## Dispatch counters")
    out.append("")
    out.append("```")
    out.append(counters)
    out.append("```")
    out.append("")

    out.append("## Milestone progress")
    out.append("")
    out.append(
        "Generated from the `Milestone: Mn · Phase: n` markers on every item, open or "
        "closed (roadmap 393.8). The milestone's own status is its `Status:` field."
    )
    out.append("")
    prog = milestone_progress(_read(ROADMAP), _read(ARCHIVE))
    if prog:
        for mid, (status, phases) in prog.items():
            out.append(f"- **{mid}** — {status}")
            for ph in sorted(phases):
                o, c = phases[ph]
                bar = "done" if o == 0 else f"{c} of {o + c} closed"
                out.append(f"  - Phase {ph}: {bar}")
    else:
        out.append("(no milestone)")
    out.append("")

    out.append("## Owner-blocked")
    out.append("")
    out.append(
        "Open items carrying an owner marker (`BLOCKED ON`, `OWNER CALL`, "
        "`OWNER OR <X> CALL`, `OWNER ·`, `NEEDS-RUNTIME`, or `Route: owner`) — "
        "needs an owner decision, trigger, or hardware a wake cannot supply on "
        "its own."
    )
    out.append("")
    if owner_blocked:
        for iid, title in owner_blocked:
            out.append(f"- {iid} — {title}" if iid else f"- {title}")
    else:
        out.append("(none)")
    out.append("")

    out.append("## Dependency-blocked")
    out.append("")
    out.append(
        "Open items with an `After:` target still open. Each releases when its "
        "last target closes. An item that is also owner-blocked says so: its "
        "dependency outlasts the owner's answer."
    )
    out.append("")
    if dependent:
        for it in dependent:
            also = " (also owner-blocked)" if it["owner"] else ""
            out.append(f"- {it['id'] or it['title']} — after {', '.join(it['after_open'])}{also}")
    else:
        out.append("(none)")
    out.append("")

    out.append("## Parked")
    out.append("")
    out.append("Open items with a `Parked:` line. Held only while that milestone is ACTIVE.")
    out.append("")
    if parked_all:
        for it in parked_all:
            state = "held" if it["parked_held"] else "not held"
            out.append(f"- {it['id'] or it['title']} — {it['parked']}, {state}")
    else:
        out.append("(none)")
    out.append("")

    out.append("## Browser-blocked")
    out.append("")
    out.append(
        "Open items marked `NEEDS-BROWSER`: they need Podman and screenshots, "
        "so a local wake can take them and a cloud wake cannot (LOOPS.md rule "
        "4). Listed, not held — the one dispatcher is local."
    )
    out.append("")
    if browser:
        for it in browser:
            out.append(f"- {it['id'] or it['title']} — {it['title']}")
    else:
        out.append("(none)")
    out.append("")

    out.append("## Owner markers quoted only in code")
    out.append("")
    out.append(
        "Open items whose only owner marker sits inside a code span or fence, so "
        "they are NOT counted as owner-blocked. Usually an item describing the "
        "markers; if one is really blocked, write its marker in prose."
    )
    out.append("")
    if quoted:
        for it in quoted:
            out.append(f"- {it['id'] or it['title']} — {it['title']}")
    else:
        out.append("(none)")
    out.append("")

    out.append("## Last 10 iterations")
    out.append("")
    if iterations:
        for ts, loop, mode, item, outcome, commit in iterations:
            mode_s = mode or "-"
            commit_s = commit or "-"
            out.append(f"- {ts} · {loop} · {mode_s} · {item} · {outcome} · {commit_s}")
    else:
        out.append("(loops.db has no rows — run scripts/loops/rebuild_from_log.py)")
    out.append("")

    out.append("## Sunset test")
    out.append("")
    out.append(
        "This file exists so the owner can get the ten-second \"now\" view "
        "without asking for a chat summary. **If, in practice, the owner keeps "
        "asking for or reading chat summaries instead of this file, delete "
        "STATUS.md and its generator** — that is proof it is ceremony, not a "
        "read habit, and the wake budget belongs elsewhere. Nothing else "
        "depends on this file: ROADMAP.md and loop-log.md remain the source "
        "of truth with or without it."
    )
    out.append("")
    return "\n".join(out)


FIXTURE = """# Roadmap

## Milestone M1 — fixture

```
Status: ACTIVE
```

## Slice 2 — fixture

1. [ ] **2.1 — depends on 2.2.**
       After: 2.2
2. [ ] **2.2 — the target.**
3. [ ] **2.3 — parked.**
       Parked: M1 — a reason — revisit: later
4. [ ] **2.4 — a wrapped marker.** It waits on an OWNER
       CALL about the token.
5. [ ] **OWNER · 2.5 — a prefixed marker.**
6. [ ] **2.6 — a wrapped variant.** An OWNER OR
       ARCHITECTURE CALL.
7. [ ] **2.7 — describes a marker.** It adds `OWNER CALL` to the parser.
8. [ ] **2.8 — routed to the owner.**
       Route: owner
9. [ ] **2.9 — needs screenshots.** NEEDS-BROWSER
10. [x] **2.10 — closed, with markers.**
       Milestone: M1 · Phase: 0
       Route: owner
11. [ ] **P0 · 2.11 — a tagged id.**
12. [ ] **2.12 — a multi-word variant.** An OWNER OR DESIGN-SYSTEM CALL.
13. [ ] **2.13 — not a marker.** Now UNBLOCKED: 2.2 landed, build it.
14. [ ] **2.14 — a fence before the marker.**
       ```
       example
       ```
       Which one ships is an OWNER CALL, per `the note`.
15. [ ] **2.15 — a double-backtick span before the marker.** See ``a ` b``.
       Which one ships is an OWNER CALL, per `the note`.
"""

# The pick fixture: every hold kind sits OLDER than the one free item, so a
# pick that ignores any of them moves off 3.4 (393.3's verification found the
# first fixture let the pick ignore owner and Parked holds with all cases green).
PICK = """# Roadmap

## Milestone M1 — fixture

```
Status: ACTIVE
```

## Slice 3 — pick

1. [ ] **3.1 — parked.**
       Parked: M1 — a reason — revisit: later
2. [ ] **3.2 — owner.** It needs an OWNER CALL.
3. [ ] **3.3 — depends.**
       After: 3.10
4. [ ] **3.4 — free.**
5. [ ] **3.10 — free, and younger than 3.4 as a number.**
"""


def self_test():
    """The fixture red-proofs 393.3 names, each confirmed in the parsed MIRROR
    (a scratch loops.db), not only in the parse. Exit 1 naming each failure."""
    import sqlite3
    import tempfile
    bad, ran = [], [0]

    def expect(name, ok):
        ran[0] += 1
        if not ok:
            bad.append(name)

    def refuses(name, text, why, archive=""):
        # The refusal must be the RIGHT one: a fixture that refuses for some
        # other reason would pass here while proving nothing.
        ran[0] += 1
        try:
            parse_roadmap(text, archive)
        except SystemExit as e:
            if why not in str(e):
                bad.append(f"{name} (it refused, but for another reason: {e})")
            return
        bad.append(name + " (it was accepted)")

    def mirror(text, archive="", label="a positive fixture"):
        try:
            items = parse_roadmap(text, archive)
        except SystemExit as e:
            raise SystemExit(f"generate_status --self-test: {label} was refused: {e}")
        with tempfile.TemporaryDirectory() as d:
            db = os.path.join(d, "loops.db")
            sync_mirror(items, "now", db=db, roadmap_text=text)
            conn = connect(db)
            rows = {r[0]: r for r in conn.execute(
                "SELECT item_id, blocked, after_open, parked, parked_held, browser, route, milestone "
                "FROM roadmap_items")}
            conn.close()
        return items, rows

    items, rows = mirror(FIXTURE, label="FIXTURE")
    by = {it["id"]: it for it in items}
    expect("an open After: target holds its item", rows["2.1"][2] == "2.2" and blocked_kind(by["2.1"]) == "dependency")
    _, rows_c = mirror(FIXTURE.replace("2. [ ] **2.2", "2. [x] **2.2"), label="FIXTURE with 2.2 closed")
    expect("a closed After: target releases it", rows_c["2.1"][2] == "")
    expect("Parked holds under ACTIVE", rows["2.3"][3] == "M1" and rows["2.3"][4] == 1
           and blocked_kind(by["2.3"]) == "parked")
    for st in ("CLOSED", "DRAFT"):
        it2, r = mirror(FIXTURE.replace("Status: ACTIVE", f"Status: {st}"), label=f"FIXTURE under {st}")
        expect(f"Parked releases under {st}", r["2.3"][4] == 0
               and blocked_kind({i["id"]: i for i in it2}["2.3"]) == "")
    expect("a wrapped OWNER CALL is flagged", rows["2.4"][1] == 1 and blocked_kind(by["2.4"]) == "owner")
    expect("an OWNER · prefix parses its id and is flagged", "2.5" in rows and rows["2.5"][1] == 1)
    expect("a wrapped OWNER OR <X> CALL is flagged", rows["2.6"][1] == 1)
    expect("a multi-word OWNER OR <X Y> CALL is flagged", rows["2.12"][1] == 1)
    expect("a marker quoted in code is not flagged, and is reported", rows["2.7"][1] == 0 and by["2.7"]["owner_quoted"])
    expect("Route: owner is owner-blocked", rows["2.8"][1] == 1 and rows["2.8"][6] == "owner")
    expect("NEEDS-BROWSER is browser-blocked and not held", rows["2.9"][5] == 1 and not blocked_kind(by["2.9"]))
    expect("a closed item's markers stay out of the open item above it",
           rows["2.9"][6] == "" and rows["2.9"][7] == "" and rows["2.9"][1] == 0)
    expect("a P0 · prefix parses its id", "2.11" in rows and rows["2.11"][1] == 0)
    expect("UNBLOCKED is not a marker", rows["2.13"][1] == 0)
    expect("an indented fence does not swallow a later prose marker", rows["2.14"][1] == 1)
    expect("a double-backtick span does not swallow a later prose marker", rows["2.15"][1] == 1)

    pick_items, _ = mirror(PICK, label="PICK")
    old = oldest_dispatchable(pick_items)
    expect("the pick skips owner, After: and Parked holds, and orders 3.4 before 3.10",
           old is not None and old["id"] == "3.4")
    closed_items, _ = mirror(PICK.replace("Status: ACTIVE", "Status: CLOSED"), label="PICK under CLOSED")
    old_c = oldest_dispatchable(closed_items)
    expect("under CLOSED the Parked item becomes the pick", old_c is not None and old_c["id"] == "3.1")
    act_pick = PICK.replace("5. [ ] **3.10 — free, and younger than 3.4 as a number.**",
                            "5. [ ] **3.10 — free, and younger than 3.4 as a number.**\n"
                            "6. [ ] **3.0 — the oldest, tagged M1.**\n       Milestone: M1 · Phase: 1\n       Route: build")
    a_items = parse_roadmap(act_pick)
    a_old = oldest_dispatchable(a_items, exclude_milestones=["M1"])
    expect("while M1 is ACTIVE rule 4 passes over its items (rule M's), so the pick stays 3.4",
           a_old is not None and a_old["id"] == "3.4" and oldest_dispatchable(a_items)["id"] == "3.0")
    und = PICK.replace("4. [ ] **3.4 — free.**", "4. [ ] **3 — an undotted id.**\n6. [ ] **3.4 — free.**")
    und_items = parse_roadmap(und)
    try:
        u = oldest_dispatchable(und_items)
        expect("an undotted id ranks without crashing", u is not None and u["id"] == "3")
    except Exception as e:  # noqa: BLE001
        bad.append(f"an undotted id crashed the pick: {e!r}")

    # The reconcile reads the SOURCE: a parse that lost one After: target
    # reaches the mirror and is refused there, although the text is unchanged.
    ran[0] += 1
    lost = parse_roadmap(FIXTURE)
    for it in lost:
        if it["id"] == "2.1":
            it["after"], it["after_open"] = [], []
    with tempfile.TemporaryDirectory() as d:
        try:
            sync_mirror(lost, "now", db=os.path.join(d, "loops.db"), roadmap_text=FIXTURE)
            bad.append("deleting one After: target from the parse fails the mirror's reconcile (it passed)")
        except SystemExit as e:
            if "carry 1 `After:` target(s) but the mirror holds 0" not in str(e):
                bad.append(f"the mirror refused, but not over the After: target: {e}")
    ran[0] += 1
    try:
        reconcile_markers(FIXTURE, {"After": 0, "Parked": 1, "Milestone": 1, "Route": 2, "Track": 0})
        bad.append("a parse that dropped one After: line passes the marker reconcile")
    except SystemExit as e:
        if "After: 1 line(s) in ROADMAP.md, 0 parsed" not in str(e):
            bad.append(f"the marker reconcile refused, but not over the After: line: {e}")

    after_miss = "After: 1 line(s) in ROADMAP.md, 0 parsed"
    for name, old_s, new_s in (
        ("a malformed `After :` line", "After: 2.2", "After : 2.2"),
        ("a lowercase `after:` line", "After: 2.2", "after: 2.2"),
        ("a bulleted `- After:` line", "       After: 2.2", "       - After: 2.2"),
        ("a bold `**After:**` line", "       After: 2.2", "       **After:** 2.2"),
        ("an unindented After: line", "       After: 2.2", "After: 2.2"),
        ("an After: line inside a code fence", "       After: 2.2", "       ```\n       After: 2.2\n       ```"),
    ):
        refuses(f"{name} refuses the write", FIXTURE.replace(old_s, new_s), after_miss)
    refuses("an After: line outside any item refuses the write",
            FIXTURE.replace("## Slice 2 — fixture\n", "## Slice 2 — fixture\n\n       After: 2.2\n"),
            "After: 2 line(s) in ROADMAP.md, 1 parsed")
    refuses("an After: line under a ### heading after the last item refuses the write",
            FIXTURE + "\n### Notes\n\n       After: 2.2\n", "After: 2 line(s) in ROADMAP.md, 1 parsed")
    refuses("an After: line after a --- rule refuses the write",
            FIXTURE + "\n---\n\n       After: 2.2\n", "After: 2 line(s) in ROADMAP.md, 1 parsed")
    refuses("an unresolved After: target refuses the write",
            FIXTURE.replace("After: 2.2", "After: 9.9"), "2.1 is `After: 9.9`")
    refuses("an After: cycle refuses the write",
            FIXTURE.replace("2. [ ] **2.2 — the target.**", "2. [ ] **2.2 — the target.**\n       After: 2.1"),
            "chain comes back to")
    refuses("a Phase outside 0-3 refuses the write",
            FIXTURE.replace("Phase: 0", "Phase: 5"), "Milestone: 1 line(s) in ROADMAP.md, 0 parsed")
    refuses("a second Parked: line refuses the write",
            FIXTURE.replace("revisit: later\n", "revisit: later\n       Parked: M1 — another — revisit: never\n"),
            "has 2 `Parked:` lines")
    arch = "## Slice 1 — archived\n\n1. [x] **1.1 — an archived item.**\n"
    refuses("an archived After: target resolves only through the archive",
            FIXTURE.replace("After: 2.2", "After: 1.1"), "2.1 is `After: 1.1`")
    a_items, a_rows = mirror(FIXTURE.replace("After: 2.2", "After: 1.1"), arch, label="FIXTURE with an archived target")
    expect("an archived After: target resolves as closed and releases", a_rows["2.1"][2] == "")

    # 393.8: milestone progress is counted from the markers, open and closed.
    prog = milestone_progress(FIXTURE)
    expect("milestone progress counts a closed marker item", prog.get("M1") == ("ACTIVE", {"0": (0, 1)}))
    prog = milestone_progress(FIXTURE.replace("10. [x] **2.10", "10. [ ] **2.10"))
    expect("and an open one", prog.get("M1") == ("ACTIVE", {"0": (1, 0)}))
    arch = "## Slice 1 — archived\n\n1. [x] **1.1 — archived.**\n       Milestone: M1 · Phase: 3\n"
    prog = milestone_progress(FIXTURE, arch)
    expect("an archived item's marker still counts, as closed",
           prog.get("M1") == ("ACTIVE", {"0": (0, 1), "3": (0, 1)}))

    # An older mirror's table is dropped and rebuilt, not half-written.
    with tempfile.TemporaryDirectory() as d:
        db = os.path.join(d, "loops.db")
        c = sqlite3.connect(db)
        c.execute("CREATE TABLE roadmap_items (item_id TEXT PRIMARY KEY, slice TEXT, title TEXT NOT NULL, "
                  "blocked INTEGER NOT NULL DEFAULT 0, synced TEXT NOT NULL)")
        c.commit(); c.close()
        sync_mirror(parse_roadmap(FIXTURE), "now", db=db, roadmap_text=FIXTURE)
        c = sqlite3.connect(db)
        cols = [r[1] for r in c.execute("PRAGMA table_info(roadmap_items)")]
        c.close()
        expect("an older mirror table is rebuilt with the marker columns", cols == MIRROR_COLS)

    n = ran[0]
    if bad:
        print("generate_status --self-test FAILED:\n  " + "\n  ".join(bad), file=sys.stderr)
        return 1
    print(f"generate_status --self-test: {n} cases behave (holds and releases per marker, "
          "owner-marker forms, code spans, the pick, the source and mirror reconciles, "
          "the refusals, the mirror rebuild)")
    return 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument(
        "--check", action="store_true",
        help="exit 1 if STATUS.md is missing or stale (ignoring the timestamp line)",
    )
    ap.add_argument("--self-test", action="store_true", help="run the marker fixtures and exit")
    args = ap.parse_args()
    if args.self_test:
        return self_test()

    # UTC, and it says so (roadmap 164.2). This was a naive `now()`, and it is
    # the one such site in the loop scripts that is NOT latent: two dispatchers
    # write this file — the owner's machine at +0800, the cloud container at
    # +0000 — so a cloud regeneration stamped an hour EIGHT HOURS EARLIER than
    # the local one before it (13:15 -> 05:31, observed). A freshness stamp on a
    # derived mirror that runs backwards tells a reader the mirror is stale when
    # it was just rebuilt. Nothing parses this line: `--check` strips it.
    #
    # The log ROWS deliberately keep their naive local stamp — that decision,
    # its cost and the two refusals are in LOOPS.md Step 0c.
    now_str = datetime.datetime.now(datetime.timezone.utc).strftime(
        "%Y-%m-%d %H:%M UTC"
    )
    content = render(now_str)

    if args.check:
        if not os.path.exists(STATUS):
            print("STATUS.md is missing", file=sys.stderr)
            return 1
        current = open(STATUS, encoding="utf-8").read()
        strip_ts = lambda s: re.sub(r"^Generated at: .*$", "", s, flags=re.M)
        if strip_ts(current) != strip_ts(content):
            print("STATUS.md is stale — regenerate it", file=sys.stderr)
            return 1
        print("STATUS.md is current")
        return 0

    with open(STATUS, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"wrote {STATUS}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
