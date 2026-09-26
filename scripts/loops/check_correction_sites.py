#!/usr/bin/env python3
"""check_correction_sites.py — did a correction to ROADMAP.md land everywhere? (roadmap 346.1)

@heuristic — the verdict rests on RECOGNISING a superseded number in a diff, so it
ships a --self-test.

A commit that corrects a number in ROADMAP.md often fixes the site it was
looking at and leaves another copy standing. 346.1 measured it over the record:
among the 231 commits that add a line naming a correction, at least 59 strike
or supersede a number, and 13 of those left a stale copy (18 sites after Slice
381's grill found one more; `.roundtable/measure-346.1-2026-09-24.md` carries
the commands and lists). Only 2 were hidden by a line wrap; the rest sat in a
heading, a DONE line or another slice. So the cheap fix is not a normaliser, it
is being SHOWN the other copies. Replayed on the 17 sites 346.1 first counted,
this lists 10 on the superseded number itself (11 counting one listed through
a neighbouring figure) from the diff alone, and 16 with --old.

Its PRECISION is too low to run unasked, so nothing does (roadmap 381.1).
record_iteration.py ran it on every recording until 381.1 measured it against a
10% floor stated first. Over the 150 ROADMAP commits before f8856986 it printed
234 site lines, and it still prints 84 after the re-tune below. A blind judge
found 4 of those 84 real (4.8%), and those 4 are the known sites in that
window. Most false lines are the same number counting the same kind of thing
in a different claim, which no token rule can tell apart. So it is run on
purpose, before a correcting commit, and with --old: on the 18 known sites the
diff alone lists 12, and naming the old spelling lists 17. It reads
ROADMAP.md only, so a copy that has moved to ROADMAP-archive.md is not listed.
Searching the archive too was measured and not adopted: it adds 132 lines on
the same window.

What it reads (default: the HEAD commit's change to ROADMAP.md):
  - a number replaced by a different number in the same hunk;
  - a number inside newly struck `~~...~~` text;
  - a number quoted inside an added line that names a correction
    (`[Corrected by …: "32-36px" was …]`);
  - a number after "not" in an added line or the commit message ("7, not 2",
    "five commits, not three"), which is how annotation-style corrections that
    keep the original are written;
  - anything named with --old "<spelling>".
For each, it lists every OTHER unstruck occurrence of that number in the file at
that revision, outside the lines the commit wrote, whitespace-normalised. Small
or word numbers ("5", "three") match everywhere, so for those only occurrences
followed by the same UNIT are listed: what the number counts, meaning the
content words in the three tokens after it, before any punctuation ("five
write-ups", "31 commits", "4 of 15 sweeps"). A small number with no unit
("7, against a control") lists nothing. The count of the rest is printed rather
than hidden. The unit rule replaced "shares any word with the correction",
which printed 234 lines where this prints 84, and listed no known site the
unit rule misses.

It REPORTS (exit 1 when it lists anything). It cannot tell a quotation or a
different claim from a stale copy — a reader can. Not a gate (346.1 decided).

Usage:
  check_correction_sites.py [--commit SHA | --worktree] [--old "<spelling>"]... [--file ROADMAP.md]
  check_correction_sites.py --self-test
"""
import contextlib
import difflib
import io
import os
import re
import subprocess
import sys
import tempfile

NUMWORDS = {'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight',
            'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen',
            'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'}
STOP = set('''a an the and or of to in on for at by is are was were be been it its this
that these those with as from not no into than then so but if when which who what
all any each every one two three four five six seven eight nine ten per vs via
only also still now same other more most less least before after over under'''.split())
TOKEN = re.compile(r'[-+−]?\d[\d,]*(?:\.\d+)?%?|[A-Za-z][A-Za-z_-]*')
# A strike never crosses a blank line (GFM). Unbounded, the one paragraph with
# an odd `~~` count (of 23 markers) masked about 10,700 lines of
# ROADMAP-archive.md, 39,366-50,080, and hid real copies (346.1's own red run).
STRUCK = re.compile(r'~~(?:(?!~~)(?!\n[ \t]*\n).)+?~~', re.S)
CORRECTION = re.compile(r'(?i)correct|supersed|withdrawn|is wrong|first read')
_NUMRX = r'(?:[-+−]?\d[\d,]*(?:\.\d+)?%?|' + '|'.join(sorted(NUMWORDS)) + r')'
M_NOT_N = re.compile(r'(?i)\b(' + _NUMRX + r')\b[^.;]{0,40},\s*not\s+(?:the\s+)?' + _NUMRX + r'\b')
QUOTED = re.compile(r'["“]([^"”\n]{1,80}?\d[^"”\n]{0,80}?)["”]')
NOT_N = re.compile(r'\bnot\s+(?:the\s+|a\s+|published\s+|just\s+)?["“]?'
                   r'([-+−]?\d[\d,]*(?:\.\d+)?%?|' + '|'.join(sorted(NUMWORDS)) + r')\b', re.I)


# Printed per number, strongest matches first. On the 346.1 replay a cap of 8
# kept every miss an uncapped listing caught (11 of 17) and held the worst
# report on the last 150 ROADMAP commits to 24 lines instead of 69.
CAP = 8


def git(*args, repo='.'):
    # Raises on failure: a bad sha or a cwd outside the repo used to read as
    # "supersedes no number" and exit 0 — a check that cannot run must say so.
    r = subprocess.run(['git', '-C', repo, *args], capture_output=True, text=True,
                       errors='replace')
    if r.returncode != 0:
        print(f'check_correction_sites: could not run `git {" ".join(args)}`: '
              f'{r.stderr.strip()}', file=sys.stderr)
        sys.exit(2)
    return r.stdout


# The repository this script lives in, not the caller's cwd.
REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))


def clean(s):
    s = re.sub(r'(?m)^\s*(>\s*)+', ' ', s)
    return s.replace('`', '').replace('*', '')


def canon(tok):
    # a leading '+' is a sign, not a different figure: "5" -> "+5" in a delta
    # column superseded nothing, and printed 14 lines in the 381.1 window
    t = tok.lower().strip('.,;:').lstrip('+')
    return t.replace('−', '-')


def is_num(tok):
    t = canon(tok)
    return bool(re.fullmatch(r'[-+]?\d[\d,]*(\.\d+)?%?', t)) or t in NUMWORDS


WORD_OF = {w: str(i) for i, w in enumerate(['zero', 'one', 'two', 'three', 'four', 'five',
            'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen',
            'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'])}
DIGIT_OF = {v: k for k, v in WORD_OF.items()}


def spellings(num):
    """A number and its other spelling: 'six' <-> '6' (0-20 only)."""
    t = canon(num)
    other = WORD_OF.get(t) or DIGIT_OF.get(t)
    return [t, other] if other else [t]


def distinctive(num):
    """Specific enough to list every occurrence. A bare integer under 1,000 is
    not: in this file it is usually a slice id or a small count."""
    t = canon(num)
    if t in NUMWORDS:
        return False
    return len(re.sub(r'\D', '', t)) >= 4 or bool(re.search(r'[,.%]', t))


def stem(w):
    w = canon(w)
    return w[:-1] if len(w) > 3 and w.endswith('s') and not w.endswith('ss') else w


PUNCT = re.compile(r'[,.;:!?()\[\]{}—–"“”|\n]')


def unit_after(text):
    """What a number counts: the content words among the three tokens that
    follow it, before any punctuation ("five write-ups", "31 commits", "4 of
    15 sweeps"; "7, against a control" has none). A stale copy of a small
    number restates it WITH its unit; a word shared anywhere nearby is how 225
    of 234 printed lines were false alarms (roadmap 381.1)."""
    head = PUNCT.split(text[:80], 1)[0]
    return {stem(w) for w in TOKEN.findall(head)[:3]
            if not is_num(w) and canon(w) not in STOP and len(w) > 1}


def m_unit(text, m):
    """In "M <unit>, not N" the unit of N is written after M, not after N. The
    match must end at this N: the first one in the window can be the clause
    before ("51 commits, not 31. Five lists …, not six")."""
    w0 = max(0, m.start() - 60)
    for mm in M_NOT_N.finditer(text[w0:m.end() + 5]):
        if w0 + mm.end() == m.end():
            return unit_after(mm.string[mm.end(1):mm.end()])
    return set()


def after_n(text, m):
    """The unit written after N itself ("not three commits")."""
    return unit_after(text[m.end():])


def content_words(text):
    return {canon(w) for w in TOKEN.findall(text)
            if not is_num(w) and canon(w) not in STOP and len(w) > 1}


def parse_hunks(diff):
    """Yield (removed_lines, added_lines, new_start, new_count) per -U0 hunk."""
    cur = None
    for line in diff.split('\n'):
        m = re.match(r'@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@', line)
        if m:
            if cur:
                yield cur
            cur = ([], [], int(m.group(1)), int(m.group(2) or 1))
        elif cur is not None and line.startswith('-') and not line.startswith('---'):
            cur[0].append(line[1:])
        elif cur is not None and line.startswith('+') and not line.startswith('+++'):
            cur[1].append(line[1:])
    if cur:
        yield cur


def superseded(diff, message=''):
    """[(number, context_text, how, line, unit)] — numbers the change superseded.
    The commit message is read too: "five commits, not three" is often said
    only in the subject."""
    out = []
    for m in NOT_N.finditer(message if M_NOT_N.search(message) else ''):
        ctx = ' '.join(TOKEN.findall(message[max(0, m.start() - 80):m.start()])[-4:]
                       + TOKEN.findall(message[m.end():m.end() + 80])[:4])
        unit = after_n(message, m) | m_unit(message, m)
        out.append((canon(m.group(1)), ctx, '"not N" in the commit message', 0, unit))
    for rem, add, start, count in parse_hunks(diff):
        R, A = clean('\n'.join(rem)), clean('\n'.join(add))
        # 1. replaced numbers
        rwm = list(TOKEN.finditer(R))
        rw, aw = [t.group(0) for t in rwm], TOKEN.findall(A)
        rk, ak = [canon(w) for w in rw], [canon(w) for w in aw]
        sm = difflib.SequenceMatcher(None, rk, ak, autojunk=False)
        for tag, i1, i2, j1, j2 in sm.get_opcodes():
            # a short run swapped for a different number INSIDE an unchanged
            # frame: the word after the run is the same on both sides, so this
            # is the same sentence restating a figure, not a rewritten one
            if tag != 'replace' or i2 - i1 > 3 or j2 - j1 > 3:
                continue
            if i2 >= len(rk) or j2 >= len(ak) or rk[i2] != ak[j2]:
                continue
            new = [ak[j] for j in range(j1, j2) if is_num(ak[j])]
            for i in range(i1, i2):
                if is_num(rk[i]) and new and rk[i] not in new:
                    ctx = ' '.join(rw[max(0, i - 4):i + 5])
                    out.append((rk[i], ctx, f'replaced by {new[0]}', start, unit_after(R[rwm[i].end():])))
        # 2. newly struck numbers
        for m in STRUCK.finditer(A):
            if m.group(0) in R:
                continue
            raw = m.group(0)[2:-2]
            inner = list(TOKEN.finditer(raw))
            words = [t.group(0) for t in inner]
            for k, t in enumerate(inner):
                if is_num(t.group(0)):
                    out.append((canon(t.group(0)), ' '.join(words[max(0, k - 4):k + 5]), 'struck',
                                start, unit_after(raw[t.end():])))
        # 3. a quoted number inside an added correction — `[Corrected by …:
        #    "32-36px" was one read …]` is this file's commonest idiom, and a
        #    token diff pairs the removed copy with the quote and sees nothing
        for line in add:
            if not CORRECTION.search(line):
                continue
            for q in QUOTED.findall(clean(line)):
                if re.search(r'["“]' + re.escape(q) + r'["”]', R):
                    continue            # the quote was already there; not new
                qt = list(TOKEN.finditer(q))
                for t in qt:
                    if is_num(t.group(0)):
                        out.append((canon(t.group(0)), ' '.join(x.group(0) for x in qt),
                                    'quoted in a correction', start, unit_after(q[t.end():])))
                        break
        # 4. "not N" in an added line that names a correction, or says
        #    "M …, not N" with a number on both sides; bare "not 3 of them"
        #    in new narrative is not a correction of anything
        flat = re.sub(r'\s+', ' ', A)            # the idiom wraps as often as not
        for m in NOT_N.finditer(flat):
            if m.group(0).lower() in R.lower():
                continue
            near = flat[max(0, m.start() - 200):m.end() + 20]
            if not (CORRECTION.search(near) or M_NOT_N.search(flat[max(0, m.start() - 60):m.end() + 5])):
                continue
            ctx = ' '.join(TOKEN.findall(flat[max(0, m.start() - 80):m.start()])[-4:]
                           + TOKEN.findall(flat[m.end():m.end() + 80])[:4])
            unit = after_n(flat, m) | m_unit(flat, m)
            out.append((canon(m.group(1)), ctx, '"not N" annotation', start, unit))
    # one row per number, contexts merged: the same number can be superseded
    # at one site and merely mentioned at another, and keeping only the first
    # context lost the one that matched (a red run on the replay, 346.1)
    merged = {}
    for num, ctx, how, line, unit in out:
        if num in merged:
            m = merged[num]
            merged[num] = (num, m[1] + ' | ' + ctx, m[2] if how in m[2] else m[2] + ', ' + how,
                           m[3], m[4] | unit)
        else:
            merged[num] = (num, ctx, how, line, unit)
    return list(merged.values())


def occurrences(text, num, skip_lines, phrase=None):
    """Unstruck, whitespace-normalised occurrences of a number token ->
    [(line, display context, match window)]. The match window is the three
    words either side of the number, so a word from a neighbouring sentence
    does not vouch for an unrelated hit. With a phrase, each hit also says
    whether an occurrence of the phrase SPANS it: matched against the display
    context instead, "3 things" was listed because "at least three wakes'
    work" sat on the next line (381.1's self-test)."""
    masked = STRUCK.sub(lambda m: re.sub(r'[^\n]', ' ', m.group(0)), text)
    chars, lines = [], []
    for ln, line in enumerate(masked.split('\n'), 1):
        for ch in clean(line) + ' ':
            chars.append(ch)
            lines.append(ln)
    norm, where, prev = [], [], False
    for ch, ln in zip(chars, lines):
        sp = ch.isspace()
        if sp and prev:
            continue
        norm.append(' ' if sp else ch.lower())
        where.append(ln)
        prev = sp
    s = ''.join(norm)
    rx = re.compile(r'(?<![\w.,−-])' + re.escape(num.lower()) + r'(?![\w%]|[.,]\d)')
    spans = [(p.start(), p.end()) for p in re.finditer(re.escape(phrase), s)] if phrase else []
    hits = []
    for m in rx.finditer(s):
        ln = where[m.start()]
        if ln in skip_lines:
            continue
        before = TOKEN.findall(s[max(0, m.start() - 200):m.start()])[-3:]
        after = TOKEN.findall(s[m.end():m.end() + 200])[:3]
        hits.append((ln, s[max(0, m.start() - 90):m.end() + 90].strip(),
                     ' '.join(before + after), unit_after(s[m.end():]),
                     any(a <= m.start() and m.end() <= b for a, b in spans)))
    return hits


def check(repo, path, commit=None, worktree=False, olds=()):
    if worktree:
        diff = git('diff', '-U0', '--no-color', 'HEAD', '--', path, repo=repo)
        text = open(os.path.join(repo, path), encoding='utf-8', errors='replace').read()
        rev, message = 'working tree', ''
    else:
        diff = git('diff', '-U0', '--no-color', f'{commit}^', commit, '--', path, repo=repo)
        text = git('show', f'{commit}:{path}', repo=repo)
        rev, message = commit, git('log', '-1', '--format=%B', commit, repo=repo)
    written = set()
    for _, add, start, count in parse_hunks(diff):
        written.update(range(start, start + count))
    rows = superseded(diff, message)
    for o in olds:
        nums = [canon(w) for w in TOKEN.findall(o) if is_num(w)]
        rows += [(n, o, '--old', 0, set()) for n in nums[:1]]
    report = []
    for num, ctx, how, _, unit in rows:
        phrase = re.sub(r'\s+', ' ', clean(ctx)).lower().strip() if how == '--old' else None
        hits = [h for n in spellings(num) for h in occurrences(text, n, written, phrase)]
        if not hits:
            continue
        if how == '--old':
            # the wake named this spelling itself: every occurrence of the whole
            # phrase is listed, plus the number where it shares a word with it
            want = content_words(ctx)
            shown = [h for h in hits if h[4] or want & content_words(h[2])]
            report.append((num, f'--old "{ctx}"', shown, len(hits) - len(shown))) if shown else None
            continue
        if distinctive(num):
            shown, hidden = hits, 0
        elif unit:
            # a small number is listed only where it counts the same thing
            want = content_words(ctx)
            scored = sorted(((len(want & content_words(h[2])), h) for h in hits
                             if unit & h[3]), key=lambda t: -t[0])
            shown = [h for _, h in scored]
            hidden = len(hits) - len(shown)
        else:
            # a small number with no unit ("7, against …", "not 2.") cannot be
            # told from the file's other uses of it: count only. The old rule,
            # one shared word in six, printed 67 of 151 lines on the 381.1
            # window and listed none of the known sites there
            shown, hidden = [], len(hits)
        if shown:
            report.append((num, how, shown, hidden))
    return rev, rows, report


def main(argv):
    if '--self-test' in argv:
        return self_test()
    path = argv[argv.index('--file') + 1] if '--file' in argv else 'ROADMAP.md'
    commit = argv[argv.index('--commit') + 1] if '--commit' in argv else 'HEAD'
    olds = [argv[i + 1] for i, a in enumerate(argv) if a == '--old']
    repo = argv[argv.index('--repo') + 1] if '--repo' in argv else REPO     # the self-test's
    rev, rows, report = check(repo, path, commit, '--worktree' in argv, olds)
    if not rows:
        print(f'check_correction_sites: {rev} supersedes no number in {path}')
        return 0
    if not report:
        print(f'check_correction_sites: {rev} superseded {len(rows)} number(s) in {path}; '
              'no other copy found')
        return 0
    print(f'check_correction_sites: {rev} superseded {len(rows)} number(s) in {path}; '
          f'{len(report)} still appear elsewhere. Read each: a quotation or a different '
          'claim is fine, a restatement of the old value is a missed site.')
    for num, how, shown, hidden in report:
        more = f' (+{hidden} bare occurrence(s) counting something else, not listed)' if hidden else ''
        print(f'  "{num}" ({how}): {len(shown)} other site(s){more}')
        for ln, ctx, *_ in shown[:CAP]:
            print(f'    L{ln}: …{ctx}…')
        if len(shown) > CAP:
            print(f'    … {len(shown) - CAP} more, sharing fewer words with the correction')
    return 1


def self_test():
    """One case per path the published figures rest on (381.1: 12 of 19
    mutations survived the two cases this used to have)."""
    d = tempfile.mkdtemp()
    g = lambda *a: subprocess.run(['git', '-C', d, *a], check=True, capture_output=True)
    g('init', '-q')
    g('config', 'user.email', 't@t')
    g('config', 'user.name', 't')
    f = os.path.join(d, 'R.md')
    base = ('## Slice 9 — the sweep took the file to 4,676 lines, and 31 commits went unseen\n\n'
            'Body: the file went from 6,839 lines to 4,676 in one move.\n\n'
            'It came from five source lines, measured.\n\n'
            'Later: 41 converted from five\n       source lines, 11 refused.\n\n'
            'Unrelated: five pages render a toolbar.\n'
            'Note: 6 lists have no way to filter.\n'
            'Scope: the file is 9,301 lines long.\n'
            'Syntax: a lone ~~ marker opens here.\n\n'
            'Tail: the heading said 4,676 lines too.\n'
            'Closing: another ~~ marker.\n\n'
            'Gates: 7 gates ran green.\n'
            'Pages: 7 pages were read.\n'
            'Wakes: it took 12 wakes.\n'
            'Summary: one 12-wake run in all.\n'
            'Other: 12 pages moved.\n'
            'Struck: ~~4,676 lines~~ is gone.\n'
            'Delta: 5 new rows.\n'
            'Items: 3 things were open.\n'
            'Rows: 5 new rows arrived.\n'
            'Seen: 3 pages loaded.\n'
            "Phrase: at least three wakes' work went here.\n")
    at = lambda prefix: next(i for i, l in enumerate(open(f).read().split('\n'), 1)
                             if l.startswith(prefix))

    def commit(text, msg):
        open(f, 'w').write(text)
        g('add', '.')
        g('commit', '-qm', msg)
        return text

    def listed(**kw):
        return {n: sorted(h[0] for h in shown) for n, _, shown, _ in check(d, 'R.md', 'HEAD', **kw)[2]}

    def code(*argv):
        with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
            try:
                return main(['--repo', d, '--file', 'R.md', *argv])
            except SystemExit as e:
                return e.code

    results = []
    t = commit(base, 'a')
    # replaced: the heading copy, the copy past two stray `~~` markers (an
    # unbounded strike masks it), not the struck copy; a small number by its
    # unit through a line wrap, and not "five pages"
    t = commit(t.replace('6,839 lines to 4,676 in', '6,839 lines to 4,738 in')
                .replace('from five source lines, measured', 'from four source lines, measured'),
               'correct the body only')
    results.append(('replaced + masking + unit', listed(), {'4,676': [1, 15], 'five': [7]}))
    # annotation "M unit, not N" (the unit is after M, in the clause ending at
    # THIS N); word <-> digit; a quoted number in a correction
    t = commit(t + '\n[Corrected: 51 commits, not 31. Five lists got a filter, not six.]\n'
                   '[Corrected by X: "9,301 lines" was read from a working copy.]\n', 'annotate')
    results.append(('annotation + spelling + quoted', listed(), {'31': [1], 'six': [11], '9,301': [12]}))
    # the commit message alone carries "8 gates, not 7"
    t = commit(t + 'Gates now: eight of them.\n', 'fix: 8 gates, not 7')
    results.append(('commit message', listed(), {'7': [at('Gates: 7')]}))
    results.append(('exit 1 when it lists', code(), 1))
    # a newly struck number, by its unit
    t = commit(t.replace('it took 12 wakes.', 'it took ~~12 wakes~~ 14 wakes.'), 'strike')
    results.append(('struck', listed(), {'12': [at('Summary:')]}))
    # a sign is not a new figure ("Rows: 5 new rows" is no stale copy); a
    # small number with no unit lists nothing, and a unit stops at punctuation
    # ("4, against pages, not 3" does not count pages)
    t = commit(t.replace('Delta: 5 new rows.', 'Delta: +5 new rows.')
               + '[Corrected: open is 4, against pages, not 3.]\n', 'sign and a unitless not-N')
    results.append(('sign + no unit', listed(), {}))
    results.append(('exit 0 when nothing', code(), 0))
    # --old: the phrase the wake names
    results.append(('--old', listed(olds=["at least three wakes' work"]), {'three': [at('Phrase:')]}))
    results.append(('exit 2 on a bad sha', code('--commit', 'deadbeef'), 2))
    r = subprocess.run([sys.executable, os.path.abspath(__file__), '--commit'], capture_output=True)
    results.append(('exit 2 on a crash', r.returncode, 2))
    bad = [(name, got, want) for name, got, want in results if got != want]
    for name, got, want in bad:
        print(f'  FAIL {name}: got {got}, want {want}')
    print('self-test', 'FAIL' if bad else 'PASS', f'({len(results) - len(bad)} of {len(results)} cases)')
    return 1 if bad else 0


if __name__ == '__main__':
    # An uncaught exception exits 1, which is this script's "listed something"
    # — a crash read as a report (381.1's first re-tune printed 30 reports of 0
    # lines that way). A check that cannot run exits 2.
    try:
        sys.exit(main(sys.argv[1:]))
    except Exception as e:                      # noqa: BLE001 — any crash is "could not run"
        import traceback
        traceback.print_exc()
        print(f'check_correction_sites: could not run: {e!r}', file=sys.stderr)
        sys.exit(2)
