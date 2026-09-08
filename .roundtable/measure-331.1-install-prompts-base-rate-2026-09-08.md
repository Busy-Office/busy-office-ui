# 331.1 — base rate: how much of `install-prompts.md` is derivable from `api.json`?

Measured 2026-09-08, cloud wake, Slice 360, at `ROADMAP.md` tip `614ce99e`.
The verdict and its argument are in ROADMAP Slice 360; this file is the raw
output and the two scripts that produced it, so a later wake re-runs rather than
re-derives (`321.1`'s lesson: evidence in a session scratchpad is unreproducible).

**Inputs.** The contribution file is not on `main`:

```
git show origin/contribution/upstream-2026-09-06:.contribution/install-prompts.md > /tmp/p.md
npm run build -w @busy-office/ui      # writes packages/core/dist/api.json
```

## Script 1 — parse, map, compose

```
blocks parsed: 53
raw '## ' headings: 53
raw fence lines:    106  (=> 53 fenced regions)

headings whose slug IS an api.json key: 33 / 53
headings with NO api.json key of that name: 20
  ButtonGroup(->button-group), FormField(->form-field), Input(->input), Select(->select), Choice(->choice), FormSection(->form-section), FormActions(->form-actions), MoneyInput(->money-input), FilterBar(->filter-bar), Chip(->chip), KeyValue(->key-value), Toast(->toast), StateBlock(->state-block), AppShell(->app-shell), WidgetGrid(->widget-grid), Widget(->widget), Stat(->stat), Timeline(->timeline), AuditTrail(->audit-trail), ScanInput(->scan-input)

api.json records (40 components + 5 primitives) = 45
records a heading DOES name: 33
records NO heading names:    12
  approval-workflow, dashboard, date, filters, form, kv, money, richtext, scan, sidebar-layout, state, visually-hidden

  control: meta.tagline of 'alert' compared with itself -> identical  (expected identical)

description line vs api.json meta.tagline
  identical:                 0
  differ:                    30
  no tagline in api.json:    23
   - Button
       prompt : The framework action control, in solid, secondary, ghost and danger settings.
       api    : The framework's action control, in solid, secondary, ghost and danger settings.
   - Icon
       prompt : A CSS mask icon that takes currentColor and scales with the surrounding font size.
       api    : CSS-rendered mask icons that take currentColor and scale with font size.
   - Kbd
       prompt : A single key or chord in a keyboard shortcut.
       api    : A keycap chip for rendering a keyboard shortcut inline.
   - Combobox
       prompt : Type-ahead picker over a coded ERP list — code, name and a meta column per row.
       api    : An editable text field with list autocomplete, following the ARIA combobox pattern.
   - TagInput
       prompt : Free-text chips in one field — cost-center lists, approver sets, keywords.
       api    : Multi-value entry that looks like one input and commits each value as a tag.
   - Quantity
       prompt : A quantity with stepper buttons and a unit of measure.
       api    : A count field with increment and decrement buttons around a real number input.

composition over all 53 blocks (non-blank fenced lines)
  total lines:  749
  markup lines: 378  (50.5%)
  non-markup:   371  (49.5%)
  markup lines that appear verbatim anywhere in api.json: 0
    control: 'bo-btn--secondary' in api.json -> True  (expected True)
    control: 'bo-data-table__row-select' in api.json -> True  (expected True)
    control: 'bo-not-a-real-class-xyz' in api.json -> False  (expected False)

  word-level similarity of the 30 differing taglines: min 0.00 (Progress), max 0.93 (SidebarNav), median 0.24
  differing by more than punctuation (similarity < 0.90): 27 of 30
  markup lines that appear verbatim in the docs component/base pages: 168 / 378 (44.4%)
    of those 168 hits, 107 are under 25 chars (closing tags and the like, which match almost any HTML):
      31x '</div>'; 8x '</span>'; 7x '</li>'; 5x '</button>'; 5x '</ol>'; 4x '</label>'
    substantive markup lines (>= 25 chars): 61 / 263 (23.2%) appear verbatim in the docs pages
    control: a line the docs must NOT contain -> False (expected False)
    control: a line the docs MUST contain (taken from the hits) -> True (expected True); sample: '<button class="bo-btn bo-btn--secondary" type="button">Cancel</button>'

  every distinct key anywhere in api.json (368):
  substrings in api.json that look like an HTML start tag: 0
```

The `every distinct key anywhere in api.json (368)` line printed the full key
list; it is elided here because it is `api.json` itself and re-printing it adds
nothing a rebuild does not. The load-bearing half is the line under it: **0**
substrings in the whole file match `/<[a-z]+[ >]/`.

## Script 2 — prototype the generator, and count the repetition

```
prototype emitted 45 blocks x 8 parts = 360 slots
  slots api.json CANNOT fill: 66 (18.3%)
    NO TAGLINE      5 block(s)
    NO MARKUP       45 block(s)
    BEHAVIOUR CALL  16 block(s)

hand-written file: 53 blocks
  non-markup non-blank lines: 371, DISTINCT: 171
  markup     non-blank lines: 378, DISTINCT: 298
  most-repeated non-markup lines:
     53x  1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/s
     53x  2. Use this markup exactly — do not restyle it, do not wrap it in a React component:
     53x  5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour al
     37x  3. No JavaScript required.
      3x  4. Values: components/dashboard/dashboard.css. Semantic tokens only (--bo-color-*, --bo-
      2x  4. Values: components/button/button.css. Semantic tokens only (--bo-color-*, --bo-space-
  control: raw grep for the top line -> 53 occurrence(s) in the file (counter said 53)  OK
```

## What is NOT here, said plainly

**Two attempts to attribute a prompt block to an `api.json` record by its CSS
classes both failed a discrimination control, and neither figure is used
anywhere.** Recorded so a later wake does not re-attempt them as if new:

- *most-frequently-owned class* put `Alert`, `Dialog`, `Offcanvas` and
  `OrderedList` under `button` — their markup is full of `bo-btn*`.
- *first owned class in the markup* put `Dialog` under `button` (its markup opens
  with the trigger button) and `ScanInput` under `data-table`.

The control was seven headings that must land on themselves (`Alert`->`alert`,
`Dialog`->`dialog`, `Button`->`button`, `DataTable`->`data-table`,
`Offcanvas`->`offcanvas`, `OrderedList`->`ordered-list`, `ScanInput`->`scan`).
Both attempts failed it, so both were discarded. Every figure in Slice 360 uses
only exact heading-slug equality against `api.json`'s keys plus its `pageSlug`
aliases.

That failure is itself the finding it looks like a gap in: **the record-to-block
mapping a generator would need is not recoverable even in reverse, from finished
markup.**

## The scripts

Both lived in the session scratchpad and are reproduced verbatim below rather
than committed as tooling — they answer one question once, and a script in
`scripts/` implies a gate this slice explicitly refuses.

### `measure_prompts.py`

```python
#!/usr/bin/env python3
"""Base rate for roadmap 331.1: how much of install-prompts.md is derivable from api.json?

Reads the contribution file and packages/core/dist/api.json. Prints counts only;
every number here is re-derivable by re-running it.
"""
import json, re, sys, subprocess

SRC = sys.argv[1] if len(sys.argv) > 1 else "/tmp/prompts.md"
API = "packages/core/dist/api.json"

text = open(SRC, encoding="utf-8").read()
api = json.load(open(API, encoding="utf-8"))
comps, prims = api["components"], api["primitives"]

# ---- parse blocks -------------------------------------------------------
lines = text.split("\n")
blocks, cur, in_fence = [], None, False
for ln in lines:
    if ln.startswith("## "):
        cur = {"name": ln[3:].strip(), "body": [], "fenced": []}
        blocks.append(cur)
        in_fence = False
        continue
    if cur is None:
        continue
    if ln.startswith("```"):
        in_fence = not in_fence
        continue
    cur["body"].append(ln)
    if in_fence:
        cur["fenced"].append(ln)

print(f"blocks parsed: {len(blocks)}")
print(f"raw '## ' headings: {sum(1 for l in lines if l.startswith('## '))}")
print(f"raw fence lines:    {sum(1 for l in lines if l.startswith('```'))}"
      f"  (=> {sum(1 for l in lines if l.startswith('```'))//2} fenced regions)")
assert len(blocks) == sum(1 for l in lines if l.startswith("## ")), "block parse lost a heading"

# ---- map heading -> api.json record -------------------------------------
def slug(name):
    s = re.sub(r"(?<=[a-z0-9])(?=[A-Z])", "-", name).lower()
    return s

# every candidate spelling api.json offers for a record
index = {}
for k in comps:
    index.setdefault(k, ("component", k))
for k in prims:
    index.setdefault(k, ("primitive", k))
for k, v in api["pageSlug"].items():
    index.setdefault(v, ("component", k))

matched, unmatched = [], []
for b in blocks:
    s = slug(b["name"])
    hit = index.get(s)
    if hit:
        b["src"] = hit
        matched.append((b["name"], s, hit))
    else:
        b["src"] = None
        unmatched.append((b["name"], s))

print(f"\nheadings whose slug IS an api.json key: {len(matched)} / {len(blocks)}")
print(f"headings with NO api.json key of that name: {len(unmatched)}")
print("  " + ", ".join(f"{n}(->{s})" for n, s in unmatched))

covered = {h for _, _, h in matched}          # tuples, same shape as allrecs
allrecs = {("component", k) for k in comps} | {("primitive", k) for k in prims}
assert covered <= allrecs, f"mapping produced records api.json does not have: {covered - allrecs}"
print(f"\napi.json records ({len(comps)} components + {len(prims)} primitives) = {len(allrecs)}")
print(f"records a heading DOES name: {len(covered)}")
print(f"records NO heading names:    {len(allrecs - covered)}")
print("  " + ", ".join(sorted(k for _, k in (allrecs - covered))))

# ---- tagline derivability ----------------------------------------------
# block body line 2 (after "Add the ... to this project.") is the description
tag_exact = tag_diff = tag_nosource = 0
diffs = []
for b in blocks:
    f = [l for l in b["fenced"] if l.strip()]
    if len(f) < 2:
        continue
    desc = f[1].strip()
    src = b["src"]
    if not src or src[0] != "component":
        tag_nosource += 1
        continue
    meta = comps[src[1]].get("meta") or {}
    tl = (meta.get("tagline") or "").strip()
    if not tl:
        tag_nosource += 1
    elif tl == desc:
        tag_exact += 1
    else:
        tag_diff += 1
        diffs.append((b["name"], desc, tl))

# CONTROL for the zero below: the same equality test must say "identical" when
# handed a tagline against itself, or a 0 means nothing.
_ctl = [k for k in comps if (comps[k].get("meta") or {}).get("tagline")][0]
_t = comps[_ctl]["meta"]["tagline"].strip()
print(f"\n  control: meta.tagline of {_ctl!r} compared with itself -> "
      f"{'identical' if _t == _t.strip() else 'DIFFER'}  (expected identical)")

print(f"\ndescription line vs api.json meta.tagline")
print(f"  identical:                 {tag_exact}")
print(f"  differ:                    {tag_diff}")
print(f"  no tagline in api.json:    {tag_nosource}")
for n, d, t in diffs[:6]:
    print(f"   - {n}\n       prompt : {d}\n       api    : {t}")

# ---- composition: how much of a block is markup? ------------------------
tot_all = tot_markup = 0
for b in blocks:
    body = b["fenced"]
    # markup region = between the "2. Use this markup exactly" line and the "3." line
    start = end = None
    for i, l in enumerate(body):
        if start is None and re.match(r"^2\. ", l):
            start = i + 1
        elif start is not None and re.match(r"^3\. ", l):
            end = i
            break
    if start is None or end is None:
        print("  !! no markup region in", b["name"])
        continue
    seg = [l for l in body[start:end] if l.strip()]
    nonblank = [l for l in body if l.strip()]
    b["markup"] = seg
    tot_all += len(nonblank)
    tot_markup += len(seg)

print(f"\ncomposition over all {len(blocks)} blocks (non-blank fenced lines)")
print(f"  total lines:  {tot_all}")
print(f"  markup lines: {tot_markup}  ({100*tot_markup/tot_all:.1f}%)")
print(f"  non-markup:   {tot_all-tot_markup}  ({100*(tot_all-tot_markup)/tot_all:.1f}%)")

# ---- are the markup lines present anywhere in api.json? -----------------
apitext = json.dumps(api)
present = sum(1 for b in blocks for l in b.get("markup", []) if l.strip() in apitext)
print(f"  markup lines that appear verbatim anywhere in api.json: {present}")
# CONTROL for that zero: the same `in apitext` test on strings api.json must hold,
# and on one it must not. A test that cannot say yes cannot mean no.
for probe, want in [("bo-btn--secondary", True), ("bo-data-table__row-select", True),
                    ("bo-not-a-real-class-xyz", False)]:
    got = probe in apitext
    print(f"    control: {probe!r} in api.json -> {got}  (expected {want})"
          f"{'' if got == want else '   *** CONTROL FAILED ***'}")

# ---- how close are the taglines, normalised? ----------------------------
import difflib
def norm(s):
    return re.sub(r"[^a-z0-9 ]", "", s.lower()).split()
ratios = []
for n, d, t in diffs:
    ratios.append((difflib.SequenceMatcher(None, norm(d), norm(t)).ratio(), n))
ratios.sort()
if ratios:
    print(f"\n  word-level similarity of the {len(ratios)} differing taglines:"
          f" min {ratios[0][0]:.2f} ({ratios[0][1]}), max {ratios[-1][0]:.2f} ({ratios[-1][1]}),"
          f" median {ratios[len(ratios)//2][0]:.2f}")
    print(f"  differing by more than punctuation (similarity < 0.90): "
          f"{sum(1 for r, _ in ratios if r < 0.90)} of {len(ratios)}")

# ---- and in the docs pages? --------------------------------------------
docs = subprocess.run(
    ["bash", "-c", "cat apps/docs/src/pages/components/*.astro apps/docs/src/pages/base/*.astro 2>/dev/null"],
    capture_output=True, text=True).stdout
present_docs = sum(1 for b in blocks for l in b.get("markup", []) if l.strip() and l.strip() in docs)
print(f"  markup lines that appear verbatim in the docs component/base pages: "
      f"{present_docs} / {tot_markup} ({100*present_docs/tot_markup:.1f}%)")
hits = [l.strip() for b in blocks for l in b.get("markup", []) if l.strip() and l.strip() in docs]
short = [h for h in hits if len(h) < 25]
print(f"    of those {len(hits)} hits, {len(short)} are under 25 chars "
      f"(closing tags and the like, which match almost any HTML):")
from collections import Counter as _C
print("      " + "; ".join(f"{n}x {l!r}" for l, n in _C(short).most_common(6)))
long_all = [l.strip() for b in blocks for l in b.get("markup", []) if len(l.strip()) >= 25]
long_hit = [h for h in hits if len(h) >= 25]
print(f"    substantive markup lines (>= 25 chars): {len(long_hit)} / {len(long_all)} "
      f"({100*len(long_hit)/len(long_all):.1f}%) appear verbatim in the docs pages")
_neg = '<button class="bo-not-a-real-class">zzz</button>'
print(f"    control: a line the docs must NOT contain -> {_neg in docs} (expected False)")
print(f"    control: a line the docs MUST contain (taken from the hits) -> "
      f"{long_hit[0] in docs if long_hit else 'n/a'} (expected True); sample: {long_hit[0][:70]!r}")

# ---- does api.json hold ANY field that could carry markup? --------------
keys = set()
def walk(o):
    if isinstance(o, dict):
        for k, v in o.items():
            keys.add(k); walk(v)
    elif isinstance(o, list):
        for v in o: walk(v)
walk(api)
print(f"\n  every distinct key anywhere in api.json ({len(keys)}):")
print("   " + " ".join(sorted(keys)))
angle = sum(1 for m in re.finditer(r"<[a-z]+[ >]", apitext))
print(f"  substrings in api.json that look like an HTML start tag: {angle}")
```

### `gen_prototype.py`

```python
#!/usr/bin/env python3
"""Prototype the generator 331.1 asks for, then diff it against the hand-written file.

Emits, for every api.json record, the block shape the contribution uses, filling
each of its seven parts from api.json where api.json has the material. Nothing is
shipped — this exists to answer the Accept's "measure the base rate first".
"""
import json, re, sys, difflib

SRC = sys.argv[1]
api = json.load(open("packages/core/dist/api.json", encoding="utf-8"))
comps, prims = api["components"], api["primitives"]

# ---- what a generator keyed on api.json can emit, part by part ----------
def emit(key, rec, kind):
    meta = rec.get("meta") or {}
    label = meta.get("label") or key.replace("-", " ").title()
    tagline = meta.get("tagline")
    css = f"components/{key}/{key}.css" if kind == "component" else f"primitives/{key}.css"
    out = [f"Add the busy-office-ui {label} to this project."]
    out.append(tagline if tagline else "<<NO TAGLINE IN api.json>>")
    out.append("1. Link the framework stylesheet once: <link rel=\"stylesheet\" "
               "href=\"styles/busy-office/styles.css\"> (source: styles.css).")
    out.append("2. Use this markup exactly — do not restyle it, do not wrap it in a "
               "React component:")
    out.append("<<NO MARKUP IN api.json — classes only: " + " ".join(rec["classes"]) + ">>")
    out.append("3. No JavaScript required." if not rec.get("dataAttrs")
               else "<<BEHAVIOUR CALL NOT IN api.json>>")
    out.append(f"4. Values: {css}. Semantic tokens only (--bo-color-*, --bo-space-*, "
               "--bo-density-*), never --bo-palette-*.")
    out.append("5. Every state signal needs a word or glyph AND an ARIA/data attribute "
               "— never colour alone.")
    return out

gen = {}
for k, v in comps.items():
    gen[k] = emit(k, v, "component")
for k, v in prims.items():
    gen[k] = emit(k, v, "primitive")

placeholders = sum(1 for b in gen.values() for l in b if l.startswith("<<"))
slots = len(gen) * 8
print(f"prototype emitted {len(gen)} blocks x 8 parts = {slots} slots")
print(f"  slots api.json CANNOT fill: {placeholders} ({100*placeholders/slots:.1f}%)")
for tag in ("NO TAGLINE", "NO MARKUP", "BEHAVIOUR CALL"):
    n = sum(1 for b in gen.values() for l in b if l.startswith("<<" + tag))
    print(f"    {tag:<15} {n} block(s)")

# ---- duplication across the hand-written blocks -------------------------
text = open(SRC, encoding="utf-8").read()
lines = text.split("\n")
blocks, cur, fence = [], None, False
for ln in lines:
    if ln.startswith("## "):
        cur = {"name": ln[3:].strip(), "f": []}
        blocks.append(cur); fence = False; continue
    if cur is None: continue
    if ln.startswith("```"): fence = not fence; continue
    if fence: cur["f"].append(ln)

nonmarkup = []
markup = []
for b in blocks:
    body = b["f"]
    s = e = None
    for i, l in enumerate(body):
        if s is None and re.match(r"^2\. ", l): s = i + 1
        elif s is not None and re.match(r"^3\. ", l): e = i; break
    for i, l in enumerate(body):
        if not l.strip(): continue
        (markup if (s is not None and e is not None and s <= i < e) else nonmarkup).append(l.strip())

print(f"\nhand-written file: {len(blocks)} blocks")
print(f"  non-markup non-blank lines: {len(nonmarkup)}, DISTINCT: {len(set(nonmarkup))}")
print(f"  markup     non-blank lines: {len(markup)}, DISTINCT: {len(set(markup))}")
from collections import Counter
top = Counter(nonmarkup).most_common(6)
print("  most-repeated non-markup lines:")
for l, n in top:
    print(f"    {n:>3}x  {l[:88]}")

# CONTROL: a line that occurs once must report once, and the counter must not
# collapse two different lines. Both are checkable against the raw file.
probe = top[0][0]
raw = sum(1 for l in lines if l.strip() == probe)
print(f"  control: raw grep for the top line -> {raw} occurrence(s) in the file "
      f"(counter said {top[0][1]}){'  OK' if raw == top[0][1] else '  *** MISMATCH ***'}")
```
