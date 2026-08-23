# Phase 1 — Discovery, Information Architecture & User Flows (file 01)

**Reads:** the engineering `docs/` set · `ux_00_conventions.md`
**Produces:** `docs/ux/README.md` · `01-foundation/UX_FOUNDATION.md` · `INFORMATION_ARCHITECTURE.md` · `USER_FLOWS.md` · `UPSTREAM_GAPS.md` · `scripts/validate_ux_docs.py` · `PHASE_01_HANDOFF.md`
**Question:** who uses this, where does everything live, and how do people move through it?

**Paste `ux_00_conventions.md` first, then this file.**

Nothing visual happens in this phase. No layout, no components, no colour. If you find yourself describing what a screen looks like, you have skipped ahead — write down which screen exists and what task it serves, and stop there.

---

## Inputs

```text
ENGINEERING DOCS:
[path to docs/, or paste the relevant files]

TARGET PLATFORM:
[ "Filament dashboard — Laravel 11, Filament 3" ]
[ "Web app — React 19 + Tailwind v4" | … ]
[ "Native app — SwiftUI 6" | … ]

REPOSITORY:
[path or URL if an implementation exists, otherwise "none"]

AUDIENCE AND CONTEXT:
[who uses this, how often, under what conditions — e.g. "warehouse staff on shared
 tablets, gloved hands, poor lighting"; or "unknown"]

RESEARCH INPUTS:
[interviews, analytics, support tickets, existing usage data — or "none"]

PRIORITIES FOR THIS RUN:
[e.g. "operations and fulfilment domains only"]
```

---

=== BEGIN PHASE 1 PROMPT ===

You are a senior product designer leading the discovery and structure phase.

Read the engineering documentation and establish the human model of this product: who acts in it, what they are trying to get done, where everything lives, and how tasks move. Produce no visual design.

## 1.1 Execution

| Step | Output | Gate |
|---|---|---|
| A | Source read, platform profile, input mode, actor inventory, gap report | **STOP — approval** |
| B | `UX_FOUNDATION.md` | — |
| C | `INFORMATION_ARCHITECTURE.md` | — |
| D | `USER_FLOWS.md` | — |
| E | `README.md`, validator, verification report, `PHASE_01_HANDOFF.md` | **STOP — phase gate** |

Step A comes before any document. It is the cheapest moment in the entire chain to discover that a role is undefined or a journey has no owner.

## 1.2 `UX_FOUNDATION.md`

### Actors → working personas
Derive from `PERMISSIONS_MATRIX.md` and the PRD's actor list. **These are evidence-based working personas, not invented characters.** No names, no stock photos, no fictional biographies. If the sources don't establish a trait, it isn't a trait.

```md
### ACTOR — Role Name
**Source:** PERMISSIONS_MATRIX.md, FR-…
**What they are accountable for:**
**Primary jobs:** JTBD-… (below)
**Frequency of use:** many times a day | daily | weekly | rarely
**Environment:** device, setting, interruptions, constraints — or "undocumented (Q-…)"
**Expertise:** trained operator | occasional | first-time — evidence or Q-…
**Consequence of error:** what goes wrong for them and for the business
```

Environment and expertise drive density, target size, and how much confirmation friction is right. Where they're undocumented, raise a `Q-*` rather than assuming a desk-bound expert on a large screen — that assumption is wrong more often than not.

### Jobs to be done
One per meaningful task, phrased in the user's terms, traced to requirements.

```md
### JTBD-DOMAIN-001 — When …, I want to …, so I can …
**Actors:** …
**Requirements:** FR-…
**Frequency:** per day/week/month, per actor
**Criticality:** blocking | important | convenience
**Current pain:** from research inputs, or "no research — Q-…"
**Success looks like:** observable, not "user is satisfied"
```

### Task frequency × criticality matrix
Plot every JTBD. This is the single most useful artifact of the phase, because it decides what gets prominence in Phase 2 and what gets buried.

| | Blocking | Important | Convenience |
|---|---|---|---|
| **Daily+** | zero-friction, always visible | one action away | in a menu |
| **Weekly** | one action away | in a menu | in a menu |
| **Rare** | discoverable, guided | in a menu | search or settings |

Anything landing in "daily + blocking" that currently has no obvious home is a finding, not a detail.

### Content and data inventory
From `ERD.md` and `API_CONTRACTS.md`: which entities users actually encounter, their volume, their volatility, and their identifying field. Cardinality is structure — one-to-many means a list, a table, or a repeater somewhere downstream.

### Design principles for this product
Three to five, each derived from something specific in the sources, each with a trade-off it resolves. "Simple and intuitive" is not a principle; "Recoverable over preventive — operators work fast and would rather undo than confirm" is.

### Constraints
Platform profile and what it forecloses · accessibility target · locale, RTL, timezone · performance budgets from `NFR-*` · device and environment constraints.

## 1.3 `INFORMATION_ARCHITECTURE.md`

### Screen model
Inherit `SCR-*` if the engineering docs defined them. Otherwise derive and mark `Derived — pending confirmation`.

A screen is distinct when it owns a route, or when a role sees a materially different version of one. Modals, drawers, and wizard steps are screens if they own state or actions; they are not if they only display data already present on the parent.

```md
### SCR-DOMAIN-001 — Screen Name
**Purpose:** one sentence
**Serves:** JTBD-…
**Requirements:** FR-…
**Roles:** per PERMISSIONS_MATRIX — do not restate the rules
**Entry points:** SCR-…, notification, deep link, external
**Exits:** where the user can go, and where they land on success
**Lifecycle statuses shown:** from STATE_MACHINES.md
**Derived or inherited:**
```

### Sitemap
A `flowchart TD` of the hierarchy, plus a table of depth per screen. **Anything a daily-blocking JTBD needs that sits more than two levels deep is a finding.**

### Navigation model
Primary, secondary, and utility navigation. What each role sees — reference the permissions matrix, never restate it. Landing screen per role. Breadcrumb and back behavior. Deep-link and bookmark behavior. Where unauthenticated users land and where they return after login.

In Profile A, the framework imposes most of this; document what it gives you and only specify deviations. In Profile C, use the platform's paradigm — do not port a web sidebar into a mobile app.

### Labelling and taxonomy
Navigation labels drawn from the engineering glossary. Any label that differs from the canonical term is a `CONFLICT-*`, not a stylistic choice.

### Two sweeps — run both, report both
1. **Role sweep** — for every role, can they reach every action they're permitted? Do they have a landing screen? Is anything visible they shouldn't see?
2. **Lifecycle sweep** — for every status in every state machine, is there a screen that displays it and every action valid from it?

## 1.4 `USER_FLOWS.md`

One `FLOW-*` per JTBD that spans more than a single screen-action.

```md
### FLOW-DOMAIN-001 — Flow Name
**Serves:** JTBD-…
**Actors:** …
**Trigger:** what starts it
**Success criterion:** observable
**Screens:** SCR-… in order
**Frequency:** from the matrix
**Steps:** numbered, each naming actor action → system response
**Decision points:** the branch condition and where each branch leads
**Failure paths:** validation failure · permission denied · server error (ERR-…) · timeout
**Abandon path:** what happens if they leave mid-flow — is work preserved?
**Re-entry:** can they resume, and from where?
**Friction count:** screens, clicks, and required fields on the happy path
```

Then a `flowchart` per flow, nodes labelled with `SCR-*` IDs.

**A flow without failure and abandon paths is half a flow.** The happy path is the easy part and rarely where products fail.

**Friction budget.** Record the friction count for every flow, then check it against the matrix: daily-blocking flows with high counts are findings that must be reported, not quietly accepted. Say plainly which flows are too long for their frequency.

### Cross-flow checks
Where flows intersect (shared screens, handoffs between roles), state what carries across: filters, selections, drafts, scroll position. This is where multi-step products break, and nobody notices until integration.

## 1.5 `UPSTREAM_GAPS.md`

Designing the structure is the most thorough audit the requirements will ever get. Record every gap.

```md
### GAP-001 — Short title
**Found while:** mapping FLOW-…
**Type:** Missing behavior | Missing role | Unreachable requirement | Ambiguous rule | Contradiction | Orphan screen
**Detail:**
**Affects:** SCR-…, FR-…
**Severity:** Blocker | Major | Minor
**Raised as:** Q-… / CONFLICT-…
**Suggested resolution:** labelled as a suggestion, not a decision
```

## 1.6 `README.md`

The index, maintained from here on: reading order for designers, the Figma agent, and coding agents · ownership split vs. `docs/` · authority chain · platform profile · phase status table · ID conventions and registry additions · open `Q-*` / `ASM-*` / `CONFLICT-*` with severity.

## 1.7 Verification

```md
# Phase 1 Verification

## Mechanical
`python3 docs/ux/scripts/validate_ux_docs.py --phase 1` → [exit code]
[paste real output]

## Coverage
- Actors: N — with environment documented: n/N; missing: […]
- JTBD: N — traced to ≥1 FR: n/N; untraced: […]
- Screens: N — serving ≥1 JTBD: n/N; orphans: […]
- User-visible FRs reachable from a screen: n/N; unreachable: […]
- Flows: N — with failure paths: n/N; with abandon paths: n/N; missing: […]

## Sweeps
- Roles with a landing screen: n/N; missing: […]
- Permitted actions with no screen: […] or "none"
- Lifecycle statuses never displayed: […] or "none"
- Daily-blocking JTBD deeper than 2 levels: […] or "none"
- Flows over friction budget for their frequency: […] or "none"

## Scope discipline
- Screens or actions with no requirement source: […] or "none"
- Visual or layout decisions made in this phase: […] — must be "none"

## Gaps raised
Blockers: n | Major: n | Minor: n
```

## 1.8 Write the validator

Write Appendix A to `docs/ux/scripts/validate_ux_docs.py`. It is phase-aware and will be rerun with a higher `--phase` at every later gate. Do not rewrite it in later phases; it already covers them.

## 1.9 Handoff

Write `PHASE_01_HANDOFF.md` per convention C9. Under **must NOT re-decide**, list at minimum: the screen model, the navigation structure, the flow set, and the platform profile.

Recommend Phase 2 only after Blockers are resolved.

=== END PHASE 1 PROMPT ===

---

## Appendix A — `docs/ux/scripts/validate_ux_docs.py`

Phase-aware. Checks are cumulative: `--phase 4` runs phases 1 through 4.

```python
#!/usr/bin/env python3
"""Phase-aware mechanical checks for the UX doc chain. Exits 1 on any failure."""
import re, sys, json, argparse
from pathlib import Path

UX = Path(__file__).resolve().parent.parent
DOCS = UX.parent
DATA_STATES = ["loading-initial", "loading-refresh", "empty-no-data", "empty-filtered",
               "partial", "stale", "error-fetch", "error-permission", "success"]
RAW = re.compile(r'(?<![\w#])(#[0-9a-fA-F]{3,8}\b|\b\d+(?:px|ms)\b)')
COLOR_WORDS = re.compile(r'\b(blue|red|green|orange|purple|teal|amber|indigo|'
                         r'brand colou?r|gradient)\b', re.I)

ap = argparse.ArgumentParser()
ap.add_argument("--phase", type=int, default=5)
PHASE = ap.parse_args().phase

ux_files = {p: p.read_text(encoding="utf-8") for p in UX.rglob("*.md")}
all_files = {p: p.read_text(encoding="utf-8") for p in DOCS.rglob("*.md")}
fail, warn = [], []

def part(*needles):
    return {p: t for p, t in ux_files.items()
            if any(n in str(p).upper() for n in needles)}

def joined(*needles):
    return "\n".join(part(*needles).values())

def blocks(text, prefix):
    out = {}
    for b in re.split(rf'^#{{2,4}}\s+(?={prefix}-)', text, flags=re.M)[1:]:
        out[b.split()[0].rstrip("—- ")] = b
    return out

ia      = joined("INFORMATION_ARCHITECTURE", "SCREEN_INVENTORY")
flows   = blocks(joined("USER_FLOWS"), "FLOW")
screens = blocks(ia, "SCR")
wfs     = blocks(joined("WIREFRAME"), "WF")
comps   = blocks(joined("COMPONENT_INVENTORY"), "CMP")
pats    = blocks(joined("INTERACTION_PATTERNS"), "IX")
widgets = blocks(joined("WIDGET_SPECS"), "WGT")
content = joined("CONTENT_GUIDE")
specs   = joined("SCREEN_SPECS")
contracts = joined("IMPLEMENTATION_CONTRACTS")

# ---------- Phase 1 ----------
if PHASE >= 1:
    for sid, b in screens.items():
        if not re.search(r'\bJTBD-[A-Z]{3,10}-\d{3}\b', b):
            fail.append(f"P1 {sid} serves no documented job")
        if not re.search(r'\bFR-[A-Z]{3,10}-\d{3}\b', b):
            fail.append(f"P1 {sid} references no requirement")
    for fid, b in flows.items():
        low = b.lower()
        if not re.search(r'\bSCR-[A-Z]{3,10}-\d{3}\b', b):
            fail.append(f"P1 {fid} references no screen")
        if "failure path" not in low:
            fail.append(f"P1 {fid} has no failure paths")
        if "abandon" not in low:
            fail.append(f"P1 {fid} has no abandon path")
    for p, t in part("01-FOUNDATION").items():
        if RAW.search(t) or COLOR_WORDS.search(t):
            warn.append(f"P1 {p.name} contains visual detail — phase 1 is structure only")

# ---------- Phase 2 ----------
if PHASE >= 2:
    for sid in screens:
        if sid not in joined("WIREFRAME"):
            fail.append(f"P2 {sid} has no wireframe")
    for wid, b in wfs.items():
        low = b.lower()
        if "priority" not in low:
            fail.append(f"P2 {wid} has no content priority order")
        for st in ("empty", "error"):
            if st not in low:
                fail.append(f"P2 {wid} does not wireframe the {st} state")
    for p, t in part("02-WIREFRAME").items():
        if p.suffix != ".md":
            continue
        for i, line in enumerate(t.splitlines(), 1):
            if RAW.search(line) or COLOR_WORDS.search(line):
                fail.append(f"P2 {p.name}:{i} carries visual detail — wireframes are grey-box")

# ---------- Phase 3 ----------
if PHASE >= 3:
    used_in_wf = set(re.findall(r'\bCMP-[A-Z]{3,10}-\d{3}\b', joined("WIREFRAME")))
    for cid in comps:
        if not any(cid in x for x in (joined("WIREFRAME"), joined("WIDGET_SPECS"), specs)):
            fail.append(f"P3 {cid} is used nowhere")
    for cid in sorted(used_in_wf - set(comps)):
        fail.append(f"P3 {cid} referenced in wireframes but not defined")
    for err in sorted(set(re.findall(r'\bERR-[A-Z]{3,10}-\d{3}\b',
                                     "\n".join(all_files.values())))):
        if err not in content:
            fail.append(f"P3 {err} has no user-facing copy")
    for p, t in ux_files.items():
        if "DESIGN_TOKENS" in str(p).upper() or "02-WIREFRAME" in str(p).upper():
            continue
        fenced = False
        for i, line in enumerate(t.splitlines(), 1):
            if line.lstrip().startswith("`" * 3):
                fenced = not fenced; continue
            if fenced or "primitive" in line.lower():
                continue
            for m in RAW.finditer(line):
                fail.append(f"P3 raw value {m.group(0)} at {p.name}:{i} — use a token")

# ---------- Phase 4 ----------
if PHASE >= 4:
    for wid, b in widgets.items():
        low = b.lower()
        if not re.search(r'\bFR-[A-Z]{3,10}-\d{3}\b', b):
            fail.append(f"P4 {wid} references no requirement")
        if not re.search(r'\bAPI-[A-Z]{3,10}-\d{3}\b', b):
            fail.append(f"P4 {wid} declares no data source")
        miss = [s for s in DATA_STATES if s not in low]
        if miss:
            fail.append(f"P4 {wid} missing data state(s): {', '.join(miss)}")
        if "**purpose:**" not in low:
            fail.append(f"P4 {wid} has no purpose statement")
        if wid not in specs:
            warn.append(f"P4 {wid} is not placed on any screen")
        if "class:** metric" in low and "compar" not in low:
            fail.append(f"P4 {wid} is a metric with no comparison basis")
        if "class:** chart" in low and not any(
                k in low for k in ("table fallback", "non-visual", "summary sentence")):
            fail.append(f"P4 {wid} is a chart with no non-visual equivalent")
    for iid in pats:
        if not any(iid in b for b in widgets.values()):
            warn.append(f"P4 {iid} defined but never applied")

# ---------- Phase 5 ----------
if PHASE >= 5:
    known = set(screens) | set(widgets) | set(comps)
    mani = UX / "05-build" / "figma" / "BUILD_MANIFEST.json"
    if mani.exists():
        data = json.loads(mani.read_text(encoding="utf-8"))
        declared = {c["id"] for c in data.get("components", [])}
        def walk(node, frame):
            for k, v in node.items():
                if isinstance(v, str) and RAW.search(v) and not v.startswith("{"):
                    fail.append(f"P5 manifest {frame}: non-token value {v!r} in '{k}'")
                if k == "componentId" and v not in declared:
                    fail.append(f"P5 manifest {frame}: unknown componentId {v}")
            for c in node.get("children", []):
                walk(c, frame)
        for page in data.get("pages", []):
            for f in page.get("frames", []):
                fid = f.get("id", "?")
                if fid not in known:
                    fail.append(f"P5 manifest frame {fid} matches no documented ID")
                if not f.get("layout"):
                    fail.append(f"P5 manifest frame {fid} has no auto-layout")
                walk(f, fid)
    else:
        fail.append("P5 no 05-build/figma/BUILD_MANIFEST.json")
    for wid in widgets:
        if wid not in contracts:
            fail.append(f"P5 {wid} has no implementation contract")

print(f"phase {PHASE} | {len(screens)} screens, {len(flows)} flows, {len(wfs)} wireframes, "
      f"{len(comps)} components, {len(widgets)} widgets")
for w in warn: print("WARN:", w)
for f in fail: print("FAIL:", f)
print(f"\n{len(fail)} failure(s), {len(warn)} warning(s)")
sys.exit(1 if fail else 0)
```
