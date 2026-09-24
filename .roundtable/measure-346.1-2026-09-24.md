# 346.1 — the correction base rate: commands and lists (2026-09-24)

Roadmap 346.1's Accept asked for the count **with the command beside it**. The
closure (`f8856986`) published the figures without committing either; the Slice
381 grill found that, and this file is the fix. Everything below re-runs from
the repository.

## 1. The population — 231 commits (reproduces at `04e08b9b`)

Non-merge commits touching `ROADMAP.md` whose diff adds a line naming a
correction. Pinned to `04e08b9b`, the revision it was taken at; later commits
add correction lines of their own.

```python
import re, subprocess, sys
rev = sys.argv[1] if len(sys.argv) > 1 else '04e08b9b'
cs = subprocess.run(['git', 'log', '--no-merges', '--format=%h', rev, '--', 'ROADMAP.md'], capture_output=True, text=True).stdout.split()
pat = re.compile(r'(?i)corrected by|\bcorrected\b|corrected in place|superseded by|\bcorrection\b')
hits = []
for c in cs:
    d = subprocess.run(['git', 'diff', '-U0', '--no-color', c + '^', c, '--', 'ROADMAP.md'], capture_output=True, text=True, errors='replace').stdout
    if any(pat.search(l[1:]) for l in d.split('\n') if l.startswith('+') and not l.startswith('+++')):
        hits.append(c)
print(len(cs), 'commits touch ROADMAP.md at', rev, ';', len(hits), 'add a correction line')
print(' '.join(hits))
```

`python3 select231.py 04e08b9b` → *1062 commits touch ROADMAP.md at 04e08b9b ;
231 add a correction line*. The list:

```
2fad3cc7 456f9966 faf331b4 85e8c6f5 a1bc5663 0edae5c7 e41fddfb 2c1de813 9339d098 1816d366
a2fda796 42c4e4b0 28c6387e c5780113 5ce62916 9a5faeca fed40de9 f1e84a77 9307c6aa 2bb15e7d
54636e74 919d55d5 78e96150 b1da20c7 95d4aca9 1310b81a 6cfe380c a5c2ef0a cdfcb129 0d8cc85f
e4742fd4 0ba54bab 49467ad5 422601c4 534b097a 19fc0045 623c98d9 0879ec3d ac0fc752 e1f5a12f
ccb7d3ce cbd8419d 7dacd80b 6e5724bb 0c24d13e 066d9878 024445f5 26d464fe 11503760 ea70ab50
9840a252 384e6a8b ed0c0650 0e52b565 66cd85da 649ca8ef 331ca0f9 04073028 7ad1aca6 d257b9b8
0b9e5601 89455547 21573efb f8a93fdf 6cb26268 71b44721 632bfc46 5abdce3c 0272ed30 e4d7493c
8848ed55 60ea801d d8c9b5d1 d33c1efe 51244205 a783a089 8962c09a 62fec2ae c77bf05e 87fbc697
96dc1829 93ad43ad 50964eea 49d2c901 0362ba15 ba527917 b1e3d161 a9ba847a 7813b1dc 856ede33
b1370408 8f6c1011 4fcf971b b0b70f96 ba2a6ae1 044f2e0a 61074ca7 411a6663 7e861867 ede706af
a5f5007a 574a8634 258856b4 606edf88 255ceb8f ef27a35a b7317ff9 534c4593 c870a4f2 5754ea02
d701e619 1498b4c1 bcd1d49c f1be2485 13f0cbca 5e5ede6d 89bb937e bb258764 72e7021f c1dfe973
702a6408 84031507 e721c20b 97b3da4b a4a3ffb5 d3835d17 31bec938 3d35a79e a6bd4c37 9fefeaef
d3d76a28 0f2579e4 a07d5830 c75d721e 9198e43f 3ea80243 1a808d2e f7fa464b 26556406 6c4cfae6
07afdcd3 9cbd0d1c 74d8c2b8 8d51e8b3 4eb97e92 0c8a05f5 c88a3217 5670fca9 f52f2597 12e97c62
7aadb524 fe2de12f 87bf0f54 75aba882 0aab35cf 15ab347b 69cadcbb fde0e230 a0c57386 7d46218d
9d1ecbe2 6e25b0e1 c750ed6a 434c58be fcec7936 b09e2e31 8ae9507e 3c5badac 20d56098 ee826a4b
b1877795 75e86158 36035078 2b6b9d15 16ed66dd ee8ed6a8 60fda1dd 4591ccda b2117e31 bd44050f
16ef2bb8 04fdf23e c5d21fb4 4d6fbf3d 39785a98 8d0c2e3f 6075380b 577cd6f8 31cd25d9 fc52b6e6
7845c78e daa7a24d 39f5ac2b 9a2a6a0a 65b5c702 a85db1a1 790e643e ff1f4b53 c05167ae dc65e968
93290db7 a5fc5b82 50a32ba6 32b069d1 29c00460 443348e2 bb8ea845 3f57e3bf f7e43a7a 2c751083
cdf3e63a d38a64d4 e07763d1 109f8595 5026e875 88cfc92a e043aa69 f7003d9a 564c0b35 7357708a
c6f77905 942716ef 99293481 b40298fe 61655dce b3bec485 857bfa3b 21fe63dc 3f347f4b 961fd043
8ed24ac8
```

## 2. Which of them supersede a number — at least 59

Read one by one (workflow `wf_b0aaa4ba-d7e`: five readers, five adversarial
verifiers; the judgement is semantic, so no command reproduces it). **A lower
bound:** the verifiers' 24 spot-checks of 'no supersede' calls found 8 more. Two
of those 8 (`534c4593`, `411a6663`) left a stale copy while filing the
correction as an open item rather than applying it, so "none with a stale copy",
as the closure first said, is false for them (Slice 381).

```
066d9878 0ba54bab 0c8a05f5 0d8cc85f 0e52b565 11503760 19fc0045 21573efb 26d464fe 29c00460
2bb15e7d 2c751083 2fad3cc7 31bec938 3d35a79e 49467ad5 4d6fbf3d 50964eea 574a8634 5ce62916
6075380b 60ea801d 61074ca7 623c98d9 632bfc46 6cfe380c 6e5724bb 71b44721 7aadb524 7ad1aca6
7d46218d 7dacd80b 89455547 8f6c1011 9307c6aa 942716ef 96dc1829 97b3da4b 9a5faeca a4a3ffb5
b1370408 b1da20c7 b40298fe b7317ff9 ba527917 c5780113 c750ed6a c75d721e c77bf05e c88a3217
ccb7d3ce d257b9b8 e721c20b ede706af ee826a4b ef27a35a faf331b4 fcec7936 fed40de9
```

## 3. The stale copies — 18 sites in 13 commits

Each was judged a restatement of the superseded value, left standing, at the
commit that corrected it. Check any one with the helper in §4:
`python3 phrase_at.py <commit> "<old spelling>"`.

| commit | line at that commit | old spelling | wrap-only |
|---|---|---|---|
| ccb7d3ce | 812 | five write-ups | no |
| 71b44721 | 1470 | 31 commits | no |
| ba527917 | 428 | 50 checked | no |
| ef27a35a | 1332 | two false positives | no |
| 623c98d9 | 5274 | THREE rows lack a qualifying terminal page | yes |
| b7317ff9 | 444 | 231.2 twice and landed once | no |
| b7317ff9 | 458 | at least three wakes' work (the 18th; found by the Slice 381 grill) | no |
| 26d464fe | 699 | 3 ms / 7 ms | no |
| 26d464fe | 671 | select-all 3 ms (aligned with runs of spaces in a code block) | no |
| 3d35a79e | 318 | three commits | no |
| 11503760 | 612 | 4,676 | no |
| 11503760 | 536 | 7.2% | no |
| 5ce62916 | 5428 | 4 of 15 | no |
| a4a3ffb5 | 541 | 2,184 | no |
| a4a3ffb5 | 543 | 4,272 | no |
| a4a3ffb5 | 543 | 32 pointer lines | yes |
| 7d46218d | 1410 | 4,429 | no |
| ee826a4b | 342 | 6 lists | no |

17 of the 18 still stood at HEAD on 2026-09-24 (the 4,429 had been rewritten),
and all 17 now carry a `Corrected by 346.1` note; the 18th's was added by Slice
381.

## 4. The helper — a strike-aware, whitespace-normalised count at a commit

```python
#!/usr/bin/env python3
"""phrase_at.py <commit> "<phrase>" [--file ROADMAP.md]

Occurrences of <phrase> in the file AT <commit>, whitespace-normalised (newlines,
indentation and leading `>` quote markers collapse to one space; `*` and backticks
dropped; case-insensitive), with struck `~~...~~` spans excluded. Prints the
normalised count, the per-line (raw grep) count, and every normalised hit with
its line number and ~160 chars of context, so a reader can judge each one.
"""
import re, subprocess, sys

a = sys.argv[1:]
path = a[a.index('--file') + 1] if '--file' in a else 'ROADMAP.md'
c, phrase = a[0], a[1]
text = subprocess.run(['git', 'show', f'{c}:{path}'], capture_output=True, text=True,
                      errors='replace').stdout
struck = re.compile(r'~~(?:(?!~~)(?!\n[ \t]*\n).)+?~~', re.S)
buf, lines_of = [], []
masked = struck.sub(lambda m: re.sub(r'[^\n]', ' ', m.group(0)), text)
for ln, line in enumerate(masked.split('\n'), 1):
    line = re.sub(r'^\s*(>\s*)+', ' ', line).replace('`', '').replace('*', '')
    for ch in line + ' ':
        buf.append(ch); lines_of.append(ln)
norm, keep = [], []
prev_space = False
for ch, ln in zip(buf, lines_of):
    sp = ch.isspace()
    if sp and prev_space:
        continue
    norm.append(' ' if sp else ch.lower()); keep.append(ln); prev_space = sp
s = ''.join(norm)
p = re.sub(r'\s+', ' ', phrase.replace('`', '').replace('*', '')).lower().strip()
rx = re.compile(r'(?<![\w])' + re.escape(p) + r'(?![\w])')
hits = list(rx.finditer(s))
raw = 0
for line in masked.split('\n'):
    l = re.sub(r'\s+', ' ', re.sub(r'^\s*(>\s*)+', ' ', line).replace('`', '').replace('*', '')).lower()
    raw += len(rx.findall(l))
print(f'{c} {path}: normalised {len(hits)}, per-line {raw}  (struck spans excluded)')
for m in hits:
    st = max(0, m.start() - 80)
    print(f'  L{keep[m.start()]}: …{s[st:m.end() + 80]}…')
```

## 5. The check's replay, recall and precision

`scripts/loops/check_correction_sites.py --commit <sha>` on each of the 13 commits
lists 10 of the first 17 sites by their own superseded number (11 counting
`b7317ff9` L444, listed through a neighbouring "three"); adding `--old "<old
spelling>"` lists 16. Out of sample it listed 1 of 3 (`b7317ff9` L458, and not
`534c4593` L1110 or `411a6663` L592). Over the last 150 `ROADMAP.md` commits
before `f8856986` it reported on 36 and printed 234 site lines, about 4 of them
real stale copies. Roadmap 381.1 owns that precision.
