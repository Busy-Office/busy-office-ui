#!/usr/bin/env python3
"""Report the archive-sweep scope: which closed slices still carry body lines in
the LIVE `ROADMAP.md`, and what share of the file rule 4 walks is closed history.

@heuristic — the verdict rests on RECOGNISING two things, and both have been got
wrong here before: which H2 a body line belongs to, and whether a slice is open.
`--self-test` is what earns its output; it fails the script if either
recognition stops discriminating.

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

WHAT IT MEASURES, and the two recognitions it can get wrong:

  1. **Attribution.** A body line is charged to the nearest preceding H2 **of any
     kind**, not to the nearest `## Slice`. Getting this wrong is 165.1's own
     bug: the four non-slice sections (`## Objective`, `## CI strategy`,
     `## Sequence`, `## STATE`) get charged to whichever slice precedes them, and
     Slice 29 read as 78 lines when it is a correct 3-line pointer.
  2. **Openness.** A slice is OPEN if its body carries an `N. [ ]` checkbox. This
     is DERIVED, never hardcoded — hardcoding it is 165's other bug.

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


def scan(text):
    """Body-line counts per slice, the open set, the attributed box counts, and
    every checkbox that belongs to NO slice.

    One pass, so the readings cannot drift apart. `cur` is None while the current
    H2 is not a slice heading — that is recognition 1, and it is what keeps
    `## Objective`'s body off the slice that precedes it. `splitlines()`, not
    `split('\\n')`: the latter yields a phantom empty line for the file's
    trailing newline and charges it to the last slice.
    """
    body, opened, boxes, stray = {}, set(), [0, 0], []
    cur, head = None, '(before any heading)'
    for n, line in enumerate(text.splitlines(), 1):
        if HEADING.match(line):
            m = SLICE.match(line)
            cur = int(m.group(1)) if m else None
            head = line.strip()
            if cur is not None:
                body.setdefault(cur, 0)
            continue
        is_open, is_done = bool(OPEN_BOX.match(line)), bool(DONE_BOX.match(line))
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
    return body, opened, boxes, stray


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
    body, opened, boxes, stray = scan(live_text)
    reconcile(LIVE, live_text, boxes, stray)
    arch, _, _, _ = scan(read(ARCHIVE))

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
    """
    closed = ('## Slice 1 — a\n'
              '1. [x] **1.1 — done.**\n'
              '       body line\n'
              '## Slice 2 — b\n'
              '2. [x] **2.1 — done.**\n'
              '       body line\n'
              '       body line\n')
    body, opened, boxes, stray = scan(closed)
    if opened or boxes != [0, 2] or body != {1: 2, 2: 3} or stray:
        sys.exit(f'SELF-TEST FAILED (baseline): open={opened} boxes={boxes} '
                 f'body={body} stray={stray}')

    # A — openness discriminates.
    reopened = closed.replace('2. [x] **2.1 — done.**', '2. [ ] **2.1 — open.**')
    if '2. [ ]' not in reopened:
        sys.exit('SELF-TEST FAILED: case A injection did not land.')
    _, opened_a, boxes_a, _ = scan(reopened)
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
    body_b, _, _, _ = scan(wedged)
    if body_b != body:
        sys.exit(f'SELF-TEST FAILED (B): a non-slice H2 moved the body counts '
                 f'{body} -> {body_b}. Its lines are being charged to a slice — '
                 f'this is 165.1\'s bug.')

    # C — an OPEN item under a non-slice H2 is caught, flagged, and reconciles.
    stated = closed + ('## STATE — not a slice\n'
                       '3. [ ] **OWNER CALL — a decision nobody has taken.**\n')
    if '3. [ ]' not in stated:
        sys.exit('SELF-TEST FAILED: case C injection did not land.')
    body_c, opened_c, boxes_c, stray_c = scan(stated)
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

    print('self-test OK — openness discriminates (A), a non-slice H2 is charged '
          'to nobody (B),\n  an open item outside every slice is caught and '
          'flagged (C), and the\n  reconciliation refuses when a lane stops '
          'accounting for a marker (D).')


def main():
    if '--self-test' in sys.argv:
        return self_test()
    rev = sys.argv[sys.argv.index('--rev') + 1] if '--rev' in sys.argv else None
    min_lines = int(sys.argv[sys.argv.index('--min-lines') + 1]) if '--min-lines' in sys.argv else 6
    report(from_rev(rev) if rev else from_disk, min_lines, rev)


if __name__ == '__main__':
    main()
