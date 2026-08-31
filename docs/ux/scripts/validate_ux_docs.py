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

ID = r'[A-Z]{3,10}(?:-[A-Z]{3,10})?-\d{3}'

def definitions(prefix, *needles):
    """Every ID of `prefix` defined as its own heading, and how many times."""
    counts = {}
    for text in part(*needles).values():
        for m in re.finditer(rf'^#{{2,4}}\s+`?({prefix}-{ID})', text, flags=re.M):
            counts[m.group(1)] = counts.get(m.group(1), 0) + 1
    return counts

def references(prefix):
    """Every ID of `prefix` mentioned anywhere under docs/ux, mapped to its files."""
    out = {}
    for path, text in ux_files.items():
        for rid in set(re.findall(rf'\b{prefix}-{ID}\b', text)):
            out.setdefault(rid, set()).add(path.name)
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
# Required Phase 3 artifacts, at their canonical lowercase paths. Existence is asserted
# explicitly because every other Phase 3 check is conditional on content being *found*:
# a deleted or mis-cased artifact would otherwise leave this gate green. Session 7 caught
# exactly that - two files tracked under `Docs/` that resolve only on a case-insensitive
# filesystem and would be absent from `docs/ux/**` on a case-sensitive CI checkout.
PHASE_3_REQUIRED = [
    "03-system/PHASE_03_IMPLEMENTATION_PLAN.md", "03-system/DESIGN_DIRECTION.md",
    "03-system/DESIGN_TOKENS.md", "03-system/COMPONENT_INVENTORY.md",
    "03-system/COMPONENT_INVENTORY_PLATFORM.md", "03-system/COMPONENT_INVENTORY_DOMAIN.md",
    "03-system/WIREFRAME_COMPONENT_MAP.md", "03-system/INTERACTION_PATTERNS.md",
    "03-system/INTERACTION_PATTERNS_DOMAIN.md", "03-system/CONTENT_GUIDE.md",
    "03-system/CONTENT_GUIDE_STATES.md", "03-system/CONTENT_GUIDE_ERRORS.md",
    "03-system/ACCESSIBILITY.md", "03-system/TRACEABILITY_AUDIT.md",
    "03-system/design_tokens/component.json", "03-system/design_tokens/semantic.state.json",
    "PHASE_03_HANDOFF.md",
]
if PHASE >= 3:
    for rel in PHASE_3_REQUIRED:
        if not (UX / rel).is_file():
            fail.append(f"P3 required artifact missing at canonical path: docs/ux/{rel}")

    # One obligation, one definition. A duplicated heading silently forks a rule into two
    # sources of truth. Referential integrity is checked rather than any count, because
    # every family here is append-only and its current size is not a canonical invariant.
    for prefix, needles in (("A11Y", ("ACCESSIBILITY",)),
                            ("TXT", ("CONTENT_GUIDE",)),
                            ("IX", ("INTERACTION_PATTERNS",)),
                            ("CMP", ("COMPONENT_INVENTORY",))):
        defined = definitions(prefix, *needles)
        for rid, n in sorted(defined.items()):
            if n > 1:
                fail.append(f"P3 {rid} is defined {n} times - one obligation, one definition")
        # `CMP-*` is exempt from the reference check: `COMPONENT_INVENTORY.md` section 8
        # deliberately names the candidates it rejected, and the wireframe-direction check
        # below already covers the binding that actually matters.
        if prefix == "CMP":
            continue
        for rid, where in sorted(references(prefix).items()):
            if rid not in defined:
                fail.append(f"P3 {rid} referenced in "
                            f"{', '.join(sorted(where))} but defined nowhere")

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
