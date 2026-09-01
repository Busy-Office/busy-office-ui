#!/usr/bin/env python3
"""Report the archive-sweep scope: which closed slices still carry body lines in
the LIVE `ROADMAP.md`, and what share of the file rule 4 walks is closed history.

@heuristic — the verdict rests on RECOGNISING three things, and the first two
have been got wrong here before: which H2 a body line belongs to, whether a
slice is open, and which target slices a still-open item names. `--self-test` is
what earns its output; it fails the script if any recognition stops
discriminating.

WHY THIS EXISTS. This instrument has been run by five wakes and has never had a
file. Its only source is a fenced code block inside an ARCHIVED roadmap entry:

    grep -c "closed slices carrying" ROADMAP.md ROADMAP-archive.md
    #   ROADMAP.md:1   ROADMAP-archive.md:4          -> five runs on the record
    grep -rln 'OPEN=set(); cur=None' --include='*.md' --include='*.py' .
    #   ./ROADMAP-archive.md                          -> one copy of the source

So three separate wakes wrote a pointer of the form *"the command is in
ROADMAP-archive.md, Slice 177, verbatim"* — into the file `LOOPS.md` rule 4
says is "for looking a reason UP", from which "a dispatch decision never comes".
`.roundtable/RESUME.md` recorded the trigger for fixing that and it fired:
*"if a wake needs this share a third time, commit the script"*, after four
consecutive hand-offs deferred re-measuring the share.

WHAT IT MEASURES, and the three recognitions it can get wrong:

  1. **Attribution.** A body line is charged to the nearest preceding H2 **of any
     kind**, not to the nearest `## Slice`. Getting this wrong is 165.1's own
     bug: the four non-slice sections (`## Objective`, `## CI strategy`,
     `## Sequence`, `## STATE`) get charged to whichever slice precedes them, and
     Slice 29 read as 78 lines when it is a correct 3-line pointer.
  2. **Openness.** A slice is OPEN if its body carries an `N. [ ]` checkbox. This
     is DERIVED, never hardcoded — hardcoding it is 165's other bug.
  3. **Dependency (236.2).** Which target slices a still-open item NAMES. A
     citation is charged to an item only while that item is the open one being
     accumulated — a closed item citing the same slice must not fire, or the
     report is true of everything and distinguishes nothing (94.11's base-rate
     test, which this file's own `targets` line already passes).

WHY RECOGNITION 3 EXISTS (roadmap 236.2). The eighth sweep moved Slice 229 while
`234.1` was open and naming 229.3's `RECURRENCE HISTORY` as a thing to AMEND.
All five of that sweep's Accept criteria passed, and none could see it: every one
is a property of the MOVE (byte identity, two-way line accounting, citation
resolution, a raw checkbox count, target derivation at move time). Even
`check:slice-refs` cannot answer it — it asks whether a citation RESOLVES, and
`229.3` resolves fine from the archive. Resolving is the wrong question when the
criterion says amend.

**This is a REPORT, not a gate, and 236.2 measured why before proposing it.** The
predicate a gate would need — *"does an open item's Accept require amending a
section this sweep is about to move?"* — turns on the difference between a slice
cited as a REASON and one cited as a TARGET, which is semantic (94.11's
checkable-shape-vs-content line, the one `check:wrong-choice` lives on). The
shape that IS checkable fires on healthy states too, so a gate over it would be
red on a correct tree. The wake running the sweep reads these and judges.

**It errs toward OVER-reporting, deliberately.** A citation is any `N.M` or
`Slice N` inside an open item's text, intersected with the target set; a decimal
that merely looks like a slice number will be named. Over-reporting costs the
sweeping wake one look; under-reporting is what 236.2 exists to prevent.

RECONCILIATION. Per CLAUDE.md, a mirror must reconcile against the SOURCE, not
against its own parse: this script counts the raw `N. [ ]` and `N. [x]` markers
in the file with a flat scan, and `attributed + unattributed` must equal it or
the script refuses to print a verdict.

**The unattributed ones are REPORTED, never dropped** — and its first run found
two, so this is not a hypothetical. `## STATE — no dispatchable work; two owner
calls` carries `1. [x] OWNER CALL — 0.2.0 release` and `2. [x] OWNER CALL —
(a) adoption/DX` under a non-slice H2, so a slice-keyed pass cannot see them.
Both are closed today and nothing is currently lost, said plainly. But an OPEN
item there would be invisible to a scope pass while `LOOPS.md` rule 4 is asking
for *"the OLDEST still-open item"* — which is exactly the defect CLAUDE.md's
storage doctrine records `STATUS.md` shipping for weeks, where "OWNER CALL —
direction" was a stated release blocker that the parser's numeric-id requirement
made invisible. So an unattributed OPEN item is flagged in the output as
`⚠ OPEN and unattributed`, and the counts are asserted, not just the content.

WHAT THE NUMBER IS NOT. `targets` is a list of slices whose text is eligible to
MOVE, not a list of slices that should move — the move itself is hand-checked,
one slice at a time, per 177.1 and CLAUDE.md's bulk-edit rule. The `>6 lines`
floor is a heuristic that excludes slices already reduced to their standing
three-line pointer; it is labelled as one and is adjustable with `--min-lines`.

NOT A GATE. Every figure here is legitimately non-zero on a healthy day — a
sweep is a cadence, not an invariant — so a gate would fail the build on a
correct state. `LOOPS.md` rule 4 and the Standardize playbook's lane 4 are what
keep it from rotting.
"""
import re
import subprocess
import sys

LIVE = 'ROADMAP.md'
ARCHIVE = 'ROADMAP-archive.md'

HEADING = re.compile(r'^## ')
SLICE = re.compile(r'^## Slice (\d+)\b')
OPEN_BOX = re.compile(r'^\s*\d+\. \[ \]')
DONE_BOX = re.compile(r'^\s*\d+\. \[x\]')
# Recognition 3. Both citation shapes this repo actually writes: `232.2` /
# `234.1's` for an item, `Slice 229` for a whole slice. Intersected with the
# target set afterwards, so a stray decimal only matters if it collides with a
# target number — the over-reporting this file's header accepts on purpose.
CITE = re.compile(r'\bSlice (\d+)\b|\b(\d+)\.\d+\b')


def cites(lines):
    """Slice numbers named anywhere in an item's text."""
    found = set()
    for line in lines:
        for whole, dotted in CITE.findall(line):
            found.add(int(whole or dotted))
    return found


def scan(text):
    """Body-line counts per slice, the open set, the attributed box counts,
    every checkbox that belongs to NO slice, and each still-open item's text.

    One pass, so the readings cannot drift apart. `cur` is None while the current
    H2 is not a slice heading — that is recognition 1, and it is what keeps
    `## Objective`'s body off the slice that precedes it. `splitlines()`, not
    `split('\\n')`: the latter yields a phantom empty line for the file's
    trailing newline and charges it to the last slice.

    `item` is the open item currently accumulating, and it is cleared by the next
    checkbox of EITHER kind and by any heading — that is recognition 3. Without
    the clear-on-`[x]`, a closed item's citations would be charged to whichever
    open item preceded it, and the dependency report would fire on healthy
    states.
    """
    body, opened, boxes, stray = {}, set(), [0, 0], []
    open_items = []
    cur, head, item = None, '(before any heading)', None
    for n, line in enumerate(text.splitlines(), 1):
        if HEADING.match(line):
            m = SLICE.match(line)
            cur = int(m.group(1)) if m else None
            head, item = line.strip(), None
            if cur is not None:
                body.setdefault(cur, 0)
            continue
        is_open, is_done = bool(OPEN_BOX.match(line)), bool(DONE_BOX.match(line))
        if is_open:
            item = {'slice': cur, 'line': n, 'label': line.strip(), 'text': [line]}
            open_items.append(item)
        elif is_done:
            item = None
        elif item is not None:
            item['text'].append(line)
        if cur is None:
            if is_open or is_done:
                stray.append((n, head, is_open, line.strip()))
            continue
        body[cur] += 1
        if is_open:
            opened.add(cur)
            boxes[0] += 1
        elif is_done:
            boxes[1] += 1
    return body, opened, boxes, stray, open_items


def reconcile(path, text, boxes, stray):
    """Count the raw thing in the source, not in the parse (CLAUDE.md).

    A flat scan of every line in the file, independent of the attribution pass
    above. Attributed plus unattributed must equal raw; anything else means a
    marker shape exists that neither pass classified, and the script refuses
    rather than under-reporting.
    """
    lines = text.splitlines()
    raw = [sum(1 for l in lines if OPEN_BOX.match(l)),
           sum(1 for l in lines if DONE_BOX.match(l))]
    seen = [boxes[0] + sum(1 for s in stray if s[2]),
            boxes[1] + sum(1 for s in stray if not s[2])]
    if raw != seen:
        sys.exit(f'REFUSING to report: {path} has {raw[0]} open / {raw[1]} closed '
                 f'raw checkbox markers, but the parse accounted for '
                 f'{seen[0]} / {seen[1]}. A marker shape is going unseen.')


def from_disk(path):
    with open(path, encoding='utf-8') as fh:
        return fh.read()


def from_rev(rev):
    def read(path):
        return subprocess.run(['git', 'show', f'{rev}:{path}'],
                              capture_output=True, text=True, check=True).stdout
    return read


def report(read, min_lines, rev):
    live_text = read(LIVE)
    body, opened, boxes, stray, open_items = scan(live_text)
    reconcile(LIVE, live_text, boxes, stray)
    arch = scan(read(ARCHIVE))[0]

    targets = {s: n for s, n in body.items() if s not in opened and n > min_lines}
    carried = sum(targets.values())
    total = len(live_text.splitlines())
    where = f' at {rev}' if rev else ''

    print(f'roadmap scope{where} — {LIVE} is {total} lines, '
          f'{len(body)} slice section(s), {boxes[0]} open / {boxes[1]} closed item(s)')
    print(f'  OPEN: {sorted(opened)}')
    print(f'  {len(targets)} closed slice(s) carrying {carried} lines here; '
          f'{sum(1 for s in targets if s in arch)} already in the archive')
    if total:
        print(f'  closed-history share: {carried}/{total} = {carried / total:.1%} '
              f'(208.1\'s definition — body lines of closed slices over live lines)')
    print(f'  targets (newest first, over {min_lines} lines): '
          f'{sorted(targets, reverse=True)}')
    print('  targets are ELIGIBLE to move, not a plan — the move is hand-checked,')
    print('  one slice at a time (177.1, and CLAUDE.md\'s bulk-edit rule).')

    # Recognition 3 (236.2): a target named by a still-open item may be text that
    # item's Accept says to AMEND, which the move puts out of the live file.
    # Reported for the sweeping wake to judge; never a gate — see the header.
    named = [(t, it) for it in open_items for t in sorted(cites(it['text']) & set(targets))]
    if named:
        print(f'  ⚠ {len(named)} target(s) NAMED by a still-open item — read each '
              f'before moving it (236.2):')
        for target, it in named:
            where = f'Slice {it["slice"]}' if it['slice'] is not None else 'no slice'
            print(f'    Slice {target} is named by the open item at '
                  f'{LIVE}:{it["line"]} ({where})')
            print(f'      {it["label"][:96]}')
    else:
        print('  no target slice is named by a still-open item (236.2).')

    # Reported, never dropped: a slice-keyed pass cannot see these, and an OPEN
    # one would be invisible to rule 4's "oldest still-open item" the same way
    # STATUS.md's owner call was (CLAUDE.md, storage doctrine).
    print(f'  {len(stray)} item(s) under a non-slice heading, outside every '
          f'figure above:')
    for line_no, head, is_open, text in stray:
        flag = ' ⚠ OPEN and unattributed' if is_open else ''
        print(f'    {LIVE}:{line_no}  {head[:60]}{flag}')
        print(f'      {text[:96]}')
    return targets


def self_test():
    """Prove both recognitions can fail, by injection rather than by reading.

    Case A — openness: adding one `N. [ ]` to a closed slice must take it out of
    the target set. A detector that cannot do this reports a sweep target that a
    dispatcher would then move while it is still open.

    Case B — attribution: a non-slice H2 between two slices must be charged to
    NEITHER. This is 165.1's bug, and it is the one a plain "nearest preceding
    `## Slice`" parse gets wrong while looking entirely correct.

    Case C — the unattributed lane: a checkbox under a non-slice H2 must be
    CAUGHT and carried as stray, not silently dropped. This is the case the real
    file exercised on this script's first run (`## STATE`'s two owner calls), and
    the one CLAUDE.md's storage doctrine says costs an owner decision when it is
    missed.

    Case D — the reconciliation itself: it must refuse when the two lanes do not
    account for the raw count. Red-proved by breaking the stray lane rather than
    by reading it, because a reconciliation that only agrees with its own caller
    cannot fail — CLAUDE.md's named defect.

    Case E — the dependency lane (236.2) DISCRIMINATES. The same citation must be
    reported from an OPEN item and NOT from a closed one. Half a test would pass
    on a lane that charges every citation in the file to the nearest open item,
    which is the shape that would fire on healthy states and teach the sweeping
    wake to ignore the line.
    """
    closed = ('## Slice 1 — a\n'
              '1. [x] **1.1 — done.**\n'
              '       body line\n'
              '## Slice 2 — b\n'
              '2. [x] **2.1 — done.**\n'
              '       body line\n'
              '       body line\n')
    body, opened, boxes, stray, _ = scan(closed)
    if opened or boxes != [0, 2] or body != {1: 2, 2: 3} or stray:
        sys.exit(f'SELF-TEST FAILED (baseline): open={opened} boxes={boxes} '
                 f'body={body} stray={stray}')

    # A — openness discriminates.
    reopened = closed.replace('2. [x] **2.1 — done.**', '2. [ ] **2.1 — open.**')
    if '2. [ ]' not in reopened:
        sys.exit('SELF-TEST FAILED: case A injection did not land.')
    _, opened_a, boxes_a, _, _ = scan(reopened)
    if opened_a != {2} or boxes_a != [1, 1]:
        sys.exit(f'SELF-TEST FAILED (A): reopening Slice 2 gave open={opened_a} '
                 f'boxes={boxes_a}, want {{2}} and [1, 1] — openness does not '
                 f'discriminate.')

    # B — a non-slice H2's body is charged to nobody.
    wedged = closed.replace('## Slice 2 — b\n',
                            '## Objective — not a slice\n'
                            'a paragraph the sweep must not charge to Slice 1\n'
                            'another such line\n'
                            '## Slice 2 — b\n')
    if '## Objective' not in wedged:
        sys.exit('SELF-TEST FAILED: case B injection did not land.')
    body_b = scan(wedged)[0]
    if body_b != body:
        sys.exit(f'SELF-TEST FAILED (B): a non-slice H2 moved the body counts '
                 f'{body} -> {body_b}. Its lines are being charged to a slice — '
                 f'this is 165.1\'s bug.')

    # C — an OPEN item under a non-slice H2 is caught, flagged, and reconciles.
    stated = closed + ('## STATE — not a slice\n'
                       '3. [ ] **OWNER CALL — a decision nobody has taken.**\n')
    if '3. [ ]' not in stated:
        sys.exit('SELF-TEST FAILED: case C injection did not land.')
    body_c, opened_c, boxes_c, stray_c, _ = scan(stated)
    if body_c != body or opened_c or boxes_c != [0, 2]:
        sys.exit(f'SELF-TEST FAILED (C): the stray item leaked into the slice '
                 f'figures — body={body_c} open={opened_c} boxes={boxes_c}.')
    if len(stray_c) != 1 or not stray_c[0][2]:
        sys.exit(f'SELF-TEST FAILED (C): an OPEN item under a non-slice heading '
                 f'produced stray={stray_c}, want exactly one flagged open. It '
                 f'would be invisible to rule 4.')
    reconcile('fixture', stated, boxes_c, stray_c)

    # D — the reconciliation refuses when a lane stops accounting for a marker.
    try:
        reconcile('fixture', stated, boxes_c, [])
    except SystemExit as exc:
        if 'REFUSING to report' not in str(exc):
            sys.exit(f'SELF-TEST FAILED (D): wrong refusal message: {exc}')
    else:
        sys.exit('SELF-TEST FAILED (D): dropping the stray lane still reconciled '
                 '— the check agrees with its caller and cannot fail.')

    # E — the dependency lane discriminates OPEN from CLOSED. Slice 1's item is
    # closed and Slice 2's is open; both name Slice 9. Only the open one may be
    # charged, or the lane fires on healthy states and gets ignored.
    # The order is load-bearing: leakage flows from a closed item into whichever
    # OPEN item precedes it, so the open one must come first and the two must
    # cite DIFFERENT slices. A fixture where both cite the same slice, or where
    # the closed item comes first, passes on a lane with no clear-on-`[x]` at
    # all — a green red-proof is a defect in the injection (CLAUDE.md).
    cited = ('## Slice 3 — a\n'
             '1. [ ] **3.1 — open, and it names Slice 9 as a thing to amend.**\n'
             '       amend 9.4 in place\n'
             '2. [x] **3.2 — done, and it cites Slice 7 as a reason.**\n'
             '       see 7.3 for the argument\n')
    if '9.4' not in cited or '7.3' not in cited:
        sys.exit('SELF-TEST FAILED: case E injection did not land — the open and '
                 'closed items must carry DIFFERENT citations to discriminate.')
    _, _, _, _, items_e = scan(cited)
    charged = {it['label']: cites(it['text']) for it in items_e}
    if len(charged) != 1:
        sys.exit(f'SELF-TEST FAILED (E): {len(charged)} open item(s) accumulated, '
                 f'want exactly 1 — the closed item is being read as open.')
    (label, named), = charged.items()
    if '3.1' not in label:
        sys.exit(f'SELF-TEST FAILED (E): the accumulated item is {label!r}, not '
                 f'the open one.')
    if 9 not in named:
        sys.exit(f'SELF-TEST FAILED (E): the open item names Slice 9 and the lane '
                 f'charged it {sorted(named)} — it cannot see a citation at all.')
    if 7 in named:
        sys.exit(f'SELF-TEST FAILED (E): the CLOSED item\'s citation of Slice 7 '
                 f'leaked into the open one ({sorted(named)}). Every citation '
                 f'after an open item is being charged to it, so this lane would '
                 f'fire on a healthy state and mean nothing.')

    print('self-test OK — openness discriminates (A), a non-slice H2 is charged '
          'to nobody (B),\n  an open item outside every slice is caught and '
          'flagged (C), the\n  reconciliation refuses when a lane stops '
          'accounting for a marker (D), and\n  a citation is charged to an OPEN '
          'item and not to a closed one (E).')


def main():
    if '--self-test' in sys.argv:
        return self_test()
    rev = sys.argv[sys.argv.index('--rev') + 1] if '--rev' in sys.argv else None
    min_lines = int(sys.argv[sys.argv.index('--min-lines') + 1]) if '--min-lines' in sys.argv else 6
    report(from_rev(rev) if rev else from_disk, min_lines, rev)


if __name__ == '__main__':
    main()
