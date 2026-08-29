#!/usr/bin/env python3
"""Report roadmap items whose BODY carries reopen-condition vocabulary.

@heuristic — the verdict rests on RECOGNISING a word, so this script reports a
SHAPE and never a meaning. `--self-test` is what earns its output.

WHY THIS EXISTS. Roadmap 193.2 asserted "42 reopen conditions live in item
bodies" and recorded its method as a COMMENT SKETCH rather than a command:

    # parse every item body in both files, bound at the next item marker or
    # the next `## ` heading, with the Accept block 186 read removed, then
    # search for  \\b(reopen|re-open|re-raise|revisit)\\b
    #   items parsed: 558   (raw grep total: 43 + 515 = 558)
    #   items with a body-level reopen condition: 42

Re-running that sketch is what this file is. 193.2 was closed by the other
dispatcher (`1c111d7f`) while this script was being written; its close stands as
the record, and this script exists because that close recorded one thing as
**unresolved**: the 558 denominator, which it could not reproduce at any commit
it tried (getting 561 and 563).

    python3 scripts/loops/report_reopen_conditions.py --rev a9470314
    # items parsed at a9470314: 558  (43 + 515)      <- exact, split and all

**a9470314 is the commit BEFORE the one that filed 193.2** — 13 minutes before,
though its naive timestamp reads 8 hours after it, because the two dispatchers
commit in different offsets (+0800 local, +0000 cloud; LOOPS.md §0c / 164.2).
The gap of 3 was the three items the filing commit itself added: 193.2 measured
its corpus and then wrote itself into it. No parser change was needed.

The HIT count is reading-dependent in a way the sketch does not pin down. Four
boundary readings at that same tree:

    whole body                       45
    minus the leading block          28
    minus the *Accept* block         43   <- this script
    minus a wider Accept match       41

193.2's close reaches 42 by a different route (its own parser's 44 raw hits,
minus 2 self-references) and its verdict is the one on the record. The point
kept here is narrower: the sketch alone does not determine the number, because
it never says which lines count as "the Accept block", and that one choice moves
the count 17 points. Roadmap 159's finding — a measurement recorded without its
command gets re-derived, and then two answers exist with nothing to adjudicate
them.

WHAT THE NUMBER IS NOT. It is a count of items containing reopen-ish WORDS, not
a count of reopen conditions. Hand-reading all 45 hits on 90b9e46 found many
that state no future trigger at all — narration of a condition someone else
executed, an anti-reopen note ("recorded so a future sweep does not re-open
it"), an item that PERFORMED a reopen, a metaphor ("would re-open the silent
rot"), the Ctrl/Cmd+Shift+T *browser shortcut* in 137.8, and 193.2's own
recorded needle matching itself (CLAUDE.md's "an assertion that trips on its own
explanation"). 193.2's close reached the same conclusion by its own route.

Deciding which is which is semantic, and 94.11 is the precedent: the shape is
checkable, the meaning is not. This script therefore stops at the shape, and
says so in its own output. The verdicts live in
`.roundtable/reopen-conditions-2026-08-29.md`.

NOT A GATE, and deliberately not named by any LOOPS.md cadence step — 193.2
refused that, measured. Stated outright because it is a cost, not a fix: this
repo's own hypothesis (execution tracks whether a playbook step names the thing)
predicts an unnamed script goes unread. 199.1 is what that costs when it happens.
"""
import re
import subprocess
import sys

FILES = ('ROADMAP.md', 'ROADMAP-archive.md')

MARKER = re.compile(r'^\s*(\d+)\. \[([ x])\] ')
HEADING = re.compile(r'^## ')
ACCEPT = re.compile(r'\*Accept\*', re.I)
NEEDLE = re.compile(r'\b(reopen|re-open|re-raise|revisit)\b', re.I)


def parse(text):
    """Item bodies, bounded at the next item marker OR the next '## ' heading."""
    lines = text.split('\n')
    marks = [i for i, l in enumerate(lines) if MARKER.match(l)]
    heads = [i for i, l in enumerate(lines) if HEADING.match(l)]
    out = []
    for n, start in enumerate(marks):
        nxt_marker = marks[n + 1] if n + 1 < len(marks) else len(lines)
        nxt_head = next((h for h in heads if h > start), len(lines))
        out.append((start + 1, lines[start:min(nxt_marker, nxt_head)]))
    return out


def without_accept(body):
    """Remove the Accept block 186 read: from '*Accept*' to the next blank line.

    This is the boundary the 193.2 sketch names, read narrowly. It is the
    load-bearing choice in the whole script: recognising one more line as
    "Accept" moves the 2026-08-29 count 45 -> 43 and the sketch's own tree
    43 -> 41. See the table in this file's header.
    """
    a = next((k for k, l in enumerate(body) if ACCEPT.search(l)), None)
    if a is None:
        return body
    end = next((k for k in range(a + 1, len(body)) if body[k].strip() == ''), len(body))
    return body[:a] + body[end:]


def scan(read):
    items, hits = [], []
    for path in FILES:
        text = read(path)
        # RECONCILE against the raw file, not against the parse: CLAUDE.md's
        # "a mirror must reconcile against the SOURCE, not against the
        # argument". A parser that only agrees with itself cannot fail.
        raw = len([l for l in text.split('\n') if MARKER.match(l)])
        parsed = parse(text)
        if raw != len(parsed):
            sys.exit(f'REFUSING to report: {path} has {raw} raw item markers '
                     f'but the parser produced {len(parsed)} bodies.')
        for line, body in parsed:
            items.append((path, line, body))
            if NEEDLE.search('\n'.join(without_accept(body))):
                hits.append((path, line, body))
    return items, hits


def from_disk(path):
    with open(path, encoding='utf-8') as fh:
        return fh.read()


def from_rev(rev):
    def read(path):
        return subprocess.run(['git', 'show', f'{rev}:{path}'],
                              capture_output=True, text=True, check=True).stdout
    return read


def self_test():
    """Prove the detector can fail: it must separate an item that states a
    reopen trigger from one that does not, and must MOVE when one is added.

    Red-proved by injection rather than by reading: the fixture below is fed
    through the same `scan()` the real run uses.
    """
    base = ('## Slice 1 — x\n'
            '1. [x] **1.1 — a decision with no future trigger.**\n'
            '       It was refused because the numbers said so.\n'
            '\n'
            '2. [x] **1.2 — another.**\n'
            '       Nothing here either.\n')
    added = base + ('\n3. [x] **1.3 — refused.**\n'
                    '       What would reopen it: a third component.\n')
    global FILES
    keep = FILES
    try:
        FILES = ('f',)
        n0 = len(scan(lambda _p: base)[1])
        n1 = len(scan(lambda _p: added)[1])
    finally:
        FILES = keep
    if n0 != 0:
        sys.exit(f'SELF-TEST FAILED: clean fixture reported {n0} hits, want 0.')
    if n1 != 1:
        sys.exit(f'SELF-TEST FAILED: injecting one reopen condition gave {n1} '
                 f'hits, want 1 — the detector did not move.')
    print(f'self-test OK — {n0} hits clean, {n1} after injecting one condition.')


def main():
    if '--self-test' in sys.argv:
        return self_test()
    rev = None
    if '--rev' in sys.argv:
        rev = sys.argv[sys.argv.index('--rev') + 1]
    items, hits = scan(from_rev(rev) if rev else from_disk)
    per = {p: sum(1 for x in items if x[0] == p) for p in FILES}
    where = f' at {rev}' if rev else ''
    print(f'items parsed{where}: {len(items)}  '
          f'({" + ".join(str(per[p]) for p in FILES)})')
    print(f'items whose body carries reopen vocabulary: {len(hits)}')
    print('  (a SHAPE, not a count of reopen conditions — see this file\'s '
          'header and\n   .roundtable/reopen-conditions-2026-08-29.md for the '
          'hand-read verdicts)')
    if '--list' in sys.argv:
        for path, line, body in hits:
            print(f'  {path}:{line}  {body[0].strip()[:96]}')


if __name__ == '__main__':
    main()
