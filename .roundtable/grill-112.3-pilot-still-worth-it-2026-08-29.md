# Grill + roundtable — is the 112.3 pattern-fit pilot still worth its briefs? (2026-08-29)

Owner asked for this directly: *"112.3 — grill & roundtable to discuss."*
Checked `.roundtable/INDEX.md` first as required: one prior grill exists
(`grill-112-pattern-fit-proposal.md`, 2026-08-22) and settled 11 questions.
**This is not a re-grill of those.** They are treated as decided; what is
grilled here is whether the pilot's *premises* still hold seven days and ~70
slices later, because the only thing standing between it and a run is a scarce
owner resource.

Evidence gate as usual: ≥2 independent instances for **Evidence**, one for
**Hypothesis**; every finding carries its counter-evidence.

---

## A. Every precondition the pilot set for itself is now met — **Evidence**

The 2026-08-22 grill gated the pilot behind four things. All four have landed,
which means the briefs are the *only* remaining input:

| gate | set by | state 2026-08-29 |
|---|---|---|
| substrate built | 112.1/112.2, "unconditionally" | **complete** — `patterns.json` carries 39 patterns, and **39/39** have `states`, `dataContract`, `wrongChoice`, plus `components`, `complexity`, `opener` |
| llms.txt coverage fixed FIRST | Q10 | **present** — 83 `patterns/` references for 39 pattern pages |
| sequencing behind 110.4 and 109.3 | Q5 | both landed long ago |
| wrong-choice debt folded in | Q9 | `check:wrong-choice` reports **1 outstanding**, and that one (`date`) is deprecated and deliberately skipped |

```
node -e "const p=require('./apps/docs/src/data/patterns.json');
const a=p.groups.flatMap(g=>g.tiles); console.log(a.length,
a.filter(x=>x.states).length, a.filter(x=>x.dataContract).length,
a.filter(x=>x.wrongChoice).length)"     # 39 39 39 39
grep -c 'patterns/' apps/docs/dist/llms.txt                    # 83
```

**Counter-evidence, and it matters for the recommendation**: "preconditions met"
is an argument for *running* the pilot, not for it being *valuable*. Findings B
and C are about the second question.

---

## B. Part of the superstructure the pilot was meant to admit has already shipped without it — **Evidence**

Q7 decided the *"Which Pattern Should I Use?"* page would be **(b) bundled,
written after the verdict from the same canonical source**.

`apps/docs/src/pages/concepts/which-pattern.astro` exists. It was committed as
**112.5**, *"Which pattern should I use? — generated from patterns.json"*.

So half of Q7 was honoured and half was not. **From the same canonical source:
yes** — it is 2,325 words of which 2,015 (87%) are generated. **After the
verdict: no** — there is no verdict, and there is no run.

**Counter-evidence, and it is strong enough to stop this being an indictment.**
The 2026-08-22 final decision evidence-gated exactly one thing: *"keep every
superstructure evidence-gated (**112.4** admitted only by the pilot's
pre-registered bar)"*. It named 112.4, the Screen Contract layer — not the docs
page. And the refusals list already extracted the IA work as 112.5, i.e. as its
own item rather than as pilot output. So the page shipping early is a
**deviation from Q7's wording, not from the decision that had teeth**.

What it does establish is narrower and still worth saying: **the pilot's verdict
is no longer a gate on anything that a wake can build.** The one thing it still
gates is 112.4, which is itself owner-blocked on 112.3. That is a closed loop
with the owner on both ends.

---

## C. The suite has been answering a neighbouring question for free, and the pilot cannot see it — **Evidence**

112.3's own realignment (2026-08-24) recorded it: the ERP suite built screens
from these patterns and **GAP-17 found `list-report`'s Anatomy omitted a whole
region (the create action), an omission that propagated into 6 of 7 list
screens.** The suite is now 28 screens.

Two questions are in play and they are not the same one:

- **The pilot's question**: given a brief, does an agent reading only `llms.txt`
  *pick* the right pattern? Measures **discovery**.
- **The suite's question**: once the right pattern is picked, is its documented
  anatomy *sufficient* to build the screen? Measures **completeness**.

The suite answers the second continuously, at no cost in owner time, and has
already produced one propagated defect. The pilot answers the first, once, and
costs 5-8 owner-authored briefs plus sealed picks.

**Counter-evidence, and it is decisive against merging them.** The pilot's bar
is deliberately about *sealed owner picks* — the whole design is that a human
who knows the domain commits to an answer before seeing the agent's. The suite
cannot produce that: its screens were built by the loop, which had repo access
and could see everything. Substituting suite evidence for pilot evidence would
be exactly the "marking its own homework" failure §3b step 4 exists to prevent.
**So C is not an argument for cancelling the pilot. It is an argument that the
pilot's cost should be weighed against what it uniquely buys, which is
discovery evidence and nothing else.**

---

## D. "Briefs are burn-once" is asserted, not established — **Hypothesis**

Q10 called briefs *"the scarce burn-once resource"*, and that framing is doing a
lot of work: it is why the pilot must wait for llms.txt coverage, why it gets
one run per brief, and why it has never run.

The contamination argument is real for the *loop*: once a brief is in the repo,
every later wake can read it. But the pilot agent is specified as
**llms.txt-only, no repo access** (Q2). A fresh session with no repo access
cannot see a brief that lives in the repo, whatever the loop has read.

If that holds, briefs are re-runnable against a *changed* llms.txt, which turns
the pilot from a one-shot into a regression test — the thing this project
otherwise insists on.

**Counter-evidence**: Q11 already decided **(c) one run per brief; a failing
brief re-runs twice, counts only at ≥2 of 3**, so re-running is contemplated
*within* a pilot. What is untested is re-running across *time*. And the honest
risk is that "no repo access" is a property of how the run is launched, not
something enforced — an unenforced isolation claim is exactly the kind this
file's own history keeps finding holes in. **Marked Hypothesis, not Evidence:
one instance, and the isolation is unverified.**

---

## The roundtable — four questions for the owner

Recommendations given, but every one of these is the owner's call.

**Q1 — Is the pilot still worth 5-8 briefs?**
➡️ **Yes, but only as the admission gate for 112.4.** Its preconditions are all
met (A), so the cost is now purely the briefs. What it buys is the one thing
nothing else produces: discovery evidence measured against a human's sealed
picks. What it no longer buys is permission to build the docs page — that
already shipped (B).

**Q2 — How many briefs, given the bar is "≥2 with confirmed wrong picks"?**
➡️ **Five, not eight.** The bar is an absolute count, not a rate, so eight
briefs do not raise the evidentiary standard — they raise the chance of hitting
it, at 60% more owner time. If five produce zero wrong picks, that is itself a
strong result about `llms.txt`, and more briefs can follow.

**Q3 — Should suite evidence (GAP-17-style anatomy gaps) count toward the bar?**
➡️ **No.** It measures completeness, not discovery, and it was produced by an
agent with repo access — counting it would be self-approval (C). Record it
separately as what it is: continuous, free, and already paying.

**Q4 — Are briefs really burn-once?**
➡️ **Test it before believing it, and the test is nearly free**: run one brief,
then re-run the same brief in a fresh no-repo session and compare. If the
answers are independent, the pilot becomes a re-runnable regression test rather
than a one-shot, and the "scarce resource" framing that has blocked it for
weeks dissolves (D). If they are not, nothing is lost but one run.

---

## Fed back to triage

1. Q1-Q4 above are owner decisions; **112.3 stays blocked until they are
   answered**, and the block is now precisely "briefs + these four answers",
   not "briefs" alone.
2. **Finding B is recorded, not actioned.** The which-pattern page shipping
   ahead of Q7's wording did not breach the decision that had teeth, and
   un-shipping a generated docs page to satisfy a sequencing clause would be
   ceremony.
3. No gate proposed. Nothing here is mechanically checkable — this is a
   cost/benefit call on an owner's scarce time, which is the category this
   file's own doctrine says to leave to a human rather than wrap in a detector.
