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
# Required Phase 4 artifacts, at their canonical lowercase paths. Asserted explicitly for the same
# reason Phase 3 asserts its own: every other Phase 4 check is conditional on content being *found*,
# so a deleted or mis-cased artifact would otherwise leave this gate green.
PHASE_4_REQUIRED = [
    "04-specs/PHASE_04_IMPLEMENTATION_PLAN.md", "04-specs/WIDGET_SPECS.md",
    "04-specs/WIDGET_SPECS_PLATFORM.md", "04-specs/WIDGET_SPECS_DOMAIN.md",
    "04-specs/SCREEN_SPEC_MAP.md",
]

def canonical_sources():
    """Every contract identifier a widget may legitimately declare as its data source.

    Patient/mobile external contracts are `API-*` and are owned by docs/api/API_CONTRACTS.md.
    Clinic/Admin Filament surfaces are in-process adapters whose contracts are `SDC-*`, owned by
    docs/domain/STAFF_INTERACTION_CONTRACTS.md - which exists specifically so that a staff surface
    never has an internal REST endpoint invented for it, and which instructs this pipeline to
    reference those IDs in Phase 4 specs. Accepting only `API-*` would therefore force either an
    invented endpoint or a false declaration on every staff widget.
    """
    out = set()
    for rel, level in (("api/API_CONTRACTS.md", 3),
                       ("domain/STAFF_INTERACTION_CONTRACTS.md", 2)):
        path = DOCS / rel
        if path.is_file():
            out |= set(re.findall(rf'^#{{{level}}}\s+((?:API|SDC)-{ID})',
                                  path.read_text(encoding="utf-8"), flags=re.M))
    return out

if PHASE >= 4:
    for rel in PHASE_4_REQUIRED:
        if not (UX / rel).is_file():
            fail.append(f"P4 required artifact missing at canonical path: docs/ux/{rel}")

    # Every SCR-* is specified. The gate already warned when a widget was placed nowhere; without
    # this, 164 of 165 screens could be unspecified and the gate would stay green. Referential,
    # not a hardcoded 165 - the screen set is measured from its Phase 1 owner.
    spec_blocks = blocks(specs, "SCR")
    for sid in sorted(screens):
        if sid not in spec_blocks:
            fail.append(f"P4 {sid} has no screen specification")
    for sid in sorted(set(spec_blocks) - set(screens)):
        fail.append(f"P4 {sid} is specified but is not a documented screen")

    sources = canonical_sources()

    # Per-screen invariants. Presence of a block proves nothing on its own: without these, a
    # block could name the wrong wireframe, invent a contract, or silently drop the states the
    # whole phase exists to specify. Every check below is referential - it resolves an identifier
    # against the phase that owns it - so none of them encodes a count that append-only growth
    # would falsify.
    for sid, b in sorted(spec_blocks.items()):
        low = b.lower()

        # The wireframe the spec claims to realize must exist, and Phase 2 must agree that it
        # belongs to this screen. Catches a copy-pasted block pointing at a neighbour's wireframe.
        declared_wf = re.findall(r'\*\*Wireframe:\*\*\s+`(WF-' + ID + r')`', b)
        if not declared_wf:
            fail.append(f"P4 {sid} names no wireframe")
        for wid in declared_wf:
            if wid not in wfs:
                fail.append(f"P4 {sid} names wireframe {wid}, which Phase 2 does not document")
            elif sid not in wfs[wid]:
                fail.append(f"P4 {sid} claims wireframe {wid}, "
                            f"which Phase 2 documents for a different screen")

        # Same rule the widgets are held to, applied where the data actually lands. This is the
        # "do not invent data" invariant: a staff surface may not acquire a REST endpoint and a
        # patient surface may not acquire an in-process command by being written down here.
        declared_src = set(re.findall(rf'\b(?:API|SDC)-{ID}\b', b))
        if not declared_src:
            fail.append(f"P4 {sid} declares no data or action contract")
        for src in sorted(declared_src - sources):
            fail.append(f"P4 {sid} declares data source {src}, "
                        f"which no canonical contract owner defines")

        # A screen specification that does not say what the screen shows while loading, empty,
        # stale or denied is not a specification of that screen.
        miss = [s for s in DATA_STATES if s not in low]
        if miss:
            fail.append(f"P4 {sid} missing data state(s): {', '.join(miss)}")

        if not re.search(r'\bWGT-' + ID + r'\b', b):
            fail.append(f"P4 {sid} composes no widget")
        for wgt in sorted(set(re.findall(r'\bWGT-' + ID + r'\b', b))):
            if wgt not in widgets:
                fail.append(f"P4 {sid} composes {wgt}, which no widget specification defines")
        for cid in sorted(set(re.findall(r'\bCMP-' + ID + r'\b', b))):
            if cid not in comps:
                fail.append(f"P4 {sid} binds {cid}, which the component inventory does not define")
        for fid in sorted(set(re.findall(r'\bFLOW-' + ID + r'\b', b))):
            if fid not in flows:
                fail.append(f"P4 {sid} serves {fid}, which Phase 1 does not document")

    for wid, b in widgets.items():
        low = b.lower()
        if not re.search(r'\bFR-[A-Z]{3,10}-\d{3}\b', b):
            fail.append(f"P4 {wid} references no requirement")
        declared = set(re.findall(rf'\b(?:API|SDC)-{ID}\b', b))
        if not declared:
            fail.append(f"P4 {wid} declares no data source")
        for src in sorted(declared - sources):
            fail.append(f"P4 {wid} declares data source {src}, "
                        f"which no canonical contract owner defines")
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
    # Placement is the whole point of Phase 4: Phase 3 defines the system, Phase 4 puts it on
    # screens. An obligation that reaches neither a widget nor a screen has been authored and
    # then abandoned, and no later phase will look for it. Checked against the definitions
    # measured from each family's Phase 3 owner, so append-only growth in any family is caught
    # rather than silently tolerated, and no count is written down here.
    placed = joined("WIDGET_SPECS") + "\n" + specs
    for prefix, needles in (("IX", ("INTERACTION_PATTERNS",)),
                            ("TXT", ("CONTENT_GUIDE",)),
                            ("A11Y", ("ACCESSIBILITY",)),
                            ("CMP", ("COMPONENT_INVENTORY",))):
        for rid in sorted(definitions(prefix, *needles)):
            if not re.search(rf'\b{rid}\b', placed):
                fail.append(f"P4 {rid} is defined by phase 3 but placed on no widget or screen")

# ---------- Phase 5 ----------
PHASE_5_REQUIRED = [
    "05-build/PHASE_05_IMPLEMENTATION_PLAN.md",
    "05-build/figma/BUILD_MANIFEST.json",
    "05-build/figma/NAMING.md",
    "05-build/IMPLEMENTATION_CONTRACTS.md",
    "05-build/DESIGN_TRACEABILITY.md",
    "05-build/FULL_CHAIN_VERIFICATION.md",
    "PHASE_05_HANDOFF.md",
]
if PHASE >= 5:
    for rel in PHASE_5_REQUIRED:
        if not (UX / rel).is_file():
            fail.append(f"P5 required artifact missing at canonical path: docs/ux/{rel}")
    known = set(screens) | set(widgets) | set(comps)
    mani = UX / "05-build" / "figma" / "BUILD_MANIFEST.json"
    if mani.exists():
        data = json.loads(mani.read_text(encoding="utf-8"))
        declared = {c["id"] for c in data.get("components", [])}
        manifest_widgets = {w["id"] for w in data.get("widgets", [])}
        widget_mandatory = {w["id"]: w.get("mandatoryComponents", []) for w in data.get("widgets", [])}
        if declared != set(comps):
            for cid in sorted(set(comps) - declared):
                fail.append(f"P5 manifest omits allocated component {cid}")
            for cid in sorted(declared - set(comps)):
                fail.append(f"P5 manifest declares unallocated component {cid}")
        if manifest_widgets != set(widgets):
            for wid in sorted(set(widgets) - manifest_widgets):
                fail.append(f"P5 manifest omits allocated widget {wid}")
            for wid in sorted(manifest_widgets - set(widgets)):
                fail.append(f"P5 manifest declares unallocated widget {wid}")
        def walk(node, frame):
            for k, v in node.items():
                if isinstance(v, str) and RAW.search(v) and not v.startswith("{"):
                    fail.append(f"P5 manifest {frame}: non-token value {v!r} in '{k}'")
                if k == "componentId" and v not in declared:
                    fail.append(f"P5 manifest {frame}: unknown componentId {v}")
                if isinstance(v, str) and re.search(r'\bdark\b', v, re.I):
                    fail.append(f"P5 manifest {frame}: dark-mode tag {v!r} in '{k}' — V1 is light-only")
            for c in node.get("children", []):
                walk(c, frame)
        frame_keys = []
        frame_ids = set()
        for page in data.get("pages", []):
            for f in page.get("frames", []):
                fid = f.get("id", "?")
                frame_ids.add(fid)
                if fid not in known:
                    fail.append(f"P5 manifest frame {fid} matches no documented ID")
                if not f.get("layout"):
                    fail.append(f"P5 manifest frame {fid} has no auto-layout")
                fkey = f.get("frameKey")
                if not fkey:
                    fail.append(f"P5 manifest frame {fid} has no frameKey")
                else:
                    frame_keys.append(fkey)
                name = f.get("name", "")
                if not name.startswith(fid):
                    fail.append(f"P5 manifest frame {fid}: name {name!r} does not begin with its own id")
                if not f.get("direction"):
                    fail.append(f"P5 manifest frame {fid} ({fkey}) declares no direction")
                if page.get("name") == "04 · Screens":
                    if not f.get("profile"):
                        fail.append(f"P5 manifest frame {fid} ({fkey}) declares no profile")
                    elif f["profile"] == "C" and not f.get("sizeClass"):
                        fail.append(f"P5 manifest frame {fid} ({fkey}) is profile C but declares no sizeClass")
                    elif f["profile"] == "A" and not f.get("contentWidth"):
                        fail.append(f"P5 manifest frame {fid} ({fkey}) is profile A but declares no contentWidth")
                walk(f, fid)
        for cid in sorted(set(comps) - frame_ids):
            fail.append(f"P5 manifest has no frame for allocated component {cid}")
        for wid in sorted(set(widgets) - frame_ids):
            fail.append(f"P5 manifest has no frame for allocated widget {wid}")
        for sid in sorted(set(screens) - frame_ids):
            fail.append(f"P5 manifest has no frame for documented screen {sid}")
        dupes = {k for k in frame_keys if frame_keys.count(k) > 1}
        for k in sorted(dupes):
            fail.append(f"P5 manifest frameKey {k!r} is not unique")
        for wid, mand in widget_mandatory.items():
            for cid in mand:
                if cid not in declared:
                    fail.append(f"P5 manifest {wid}: mandatoryComponents references unknown component {cid}")
    else:
        fail.append("P5 no 05-build/figma/BUILD_MANIFEST.json")

    # Contract-level invariants (Session 3). A contract is identified by its own canonical heading,
    # never by a bare ID mention elsewhere in the file - WGT-PLATFORM-002's own contract legitimately
    # names WGT-PLATFORM-009 and WGT-OPS-001 as out-of-scope cross-references, and a substring check
    # would misread that mention as "has a contract". Splitting on the heading is what tells the two
    # apart, and is also what makes "defined twice" and "not an allocated widget" checkable at all.
    CONTRACT_HEAD = re.compile(r'^###\s+(WGT-' + ID + r')\s+—\s+Implementation Contract', re.M)
    contract_map, contract_counts = {}, {}
    _heads = list(CONTRACT_HEAD.finditer(contracts))
    for i, m in enumerate(_heads):
        wid = m.group(1)
        contract_counts[wid] = contract_counts.get(wid, 0) + 1
        start = m.start()
        end = _heads[i + 1].start() if i + 1 < len(_heads) else len(contracts)
        contract_map.setdefault(wid, []).append(contracts[start:end])

    for wid, n in sorted(contract_counts.items()):
        if n > 1:
            fail.append(f"P5 {wid} implementation contract is defined {n} times "
                        f"- one contract, one definition")
        if wid not in widgets:
            fail.append(f"P5 contract heading {wid} is not an allocated WGT-* "
                        f"- Phase 4 does not define it")

    FORBIDDEN_CMD = re.compile(
        r'\bnpm (test|run|start|install)\b|\bnpx \b|\byarn (test|start)\b|'
        r'\bexpo (start|run)\b|\breact-native run-', re.I)

    for wid in widgets:
        if wid not in contract_map:
            fail.append(f"P5 {wid} has no implementation contract")
            continue
        b = contract_map[wid][0]  # first occurrence; duplicates already flagged above

        # [ \t]* rather than \s* between the label and its value: \s also matches a newline, which
        # would let these match across a blank field into the following bullet's own content and
        # silently pass an empty field - caught by this session's own negative test for Runtime.
        if not re.search(r'^-[ \t]+\*\*Build order:\*\*[ \t]*\d+[ \t]*$', b, flags=re.M):
            fail.append(f"P5 {wid} contract declares no numeric build order")

        if not re.search(r'^-[ \t]+\*\*Runtime:\*\*[ \t]+\S', b, flags=re.M):
            fail.append(f"P5 {wid} contract declares no runtime")

        if not re.search(r'-\s+\*\*Phase 4 realization:\*\*.*Profile A\s+`(Stock|Extended|Custom|n/a)`',
                          b):
            fail.append(f"P5 {wid} contract declares no valid Profile A realization "
                        f"(Stock/Extended/Custom/n/a)")

        tf_m = re.search(r'####\s+12\. Target files\n(.*?)(?=\n####\s+13\.)', b, flags=re.S)
        if not tf_m:
            fail.append(f"P5 {wid} contract has no section 12 Target files")
        else:
            rows = [r for r in tf_m.group(1).splitlines()
                    if r.strip().startswith('|') and '---' not in r]
            for row in rows[1:]:  # skip the header row
                cells = [c.strip() for c in row.strip().strip('|').split('|')]
                status = cells[-1] if cells else ""
                if status not in ("Existing", "Proposed", "Proposed, path unverified"):
                    fail.append(f"P5 {wid} contract target-file row has an invalid path "
                                f"status: {status!r}")

        cd_m = re.search(r'####\s+5\. Component dependencies\n(.*?)(?=\n####\s+6\.)', b, flags=re.S)
        if cd_m:
            for cid in sorted(set(re.findall(r'`(CMP-[A-Z]{3,10}-\d{3})`', cd_m.group(1)))):
                if cid not in comps:
                    fail.append(f"P5 {wid} contract references undefined component {cid}")

        ver_m = re.search(r'####\s+29\. Verification\n(.*)', b, flags=re.S)
        if not ver_m:
            fail.append(f"P5 {wid} contract has no section 29 Verification")
        else:
            vt = ver_m.group(1)
            positions = {t: vt.find(t) for t in ("Tier A", "Tier B", "Tier C")}
            for t, pos in positions.items():
                if pos == -1:
                    fail.append(f"P5 {wid} contract verification section is missing {t}")
            if -1 not in positions.values() and not (
                    positions["Tier A"] < positions["Tier B"] < positions["Tier C"]):
                fail.append(f"P5 {wid} contract verification tiers are out of order")

        cmd_m = FORBIDDEN_CMD.search(b)
        if cmd_m:
            fail.append(f"P5 {wid} contract appears to document an unverified Patient "
                        f"command as if it existed: {cmd_m.group(0)!r}")

        section_nums = [int(x) for x in re.findall(r'^####\s+(\d+)\.', b, flags=re.M)]
        expected_sections = list(range(1, 30))
        if sorted(section_nums) != expected_sections:
            missing = [n for n in expected_sections if n not in section_nums]
            dupes_sec = sorted({n for n in section_nums if section_nums.count(n) > 1})
            extra = [n for n in section_nums if n not in expected_sections]
            fail.append(f"P5 {wid} contract section schema mismatch "
                        f"(missing={missing}, duplicate={dupes_sec}, extra={extra})")
        impl_m = re.search(r'####\s+2\. Implements\n(.*?)(?=\n####\s+3\.)', b, flags=re.S)
        if not impl_m or not re.search(r'\b(?:FR|NFR)-[A-Z]{3,10}-\d{3}\b', impl_m.group(1)):
            fail.append(f"P5 {wid} contract Implements section resolves no FR/NFR")

    # Build order is a total order across every contract actually authored so far - duplicated only
    # when two different widgets claim the same slot, which a later session appending more contracts
    # would otherwise be free to do by accident.
    build_orders = {}
    for wid, blocks_ in contract_map.items():
        m = re.search(r'^-[ \t]+\*\*Build order:\*\*[ \t]*(\d+)[ \t]*$', blocks_[0], flags=re.M)
        if m:
            build_orders.setdefault(int(m.group(1)), []).append(wid)
    for order, wids in sorted(build_orders.items()):
        if len(wids) > 1:
            fail.append(f"P5 build order {order} is claimed by more than one contract: "
                        f"{', '.join(sorted(wids))}")

    if set(contract_map) == set(widgets):
        expected_orders = set(range(1, len(widgets) + 1))
        actual_orders = set(build_orders)
        if actual_orders != expected_orders:
            fail.append(f"P5 build orders are not a total 1..{len(widgets)} sequence "
                        f"(missing={sorted(expected_orders - actual_orders)}, "
                        f"extra={sorted(actual_orders - expected_orders)})")

print(f"phase {PHASE} | {len(screens)} screens, {len(flows)} flows, {len(wfs)} wireframes, "
      f"{len(comps)} components, {len(widgets)} widgets")
for w in warn: print("WARN:", w)
for f in fail: print("FAIL:", f)
print(f"\n{len(fail)} failure(s), {len(warn)} warning(s)")
sys.exit(1 if fail else 0)
