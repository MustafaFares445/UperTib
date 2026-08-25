#!/usr/bin/env python3
"""Mechanical integrity validator for the UberTib engineering documentation.

Run from any directory inside a repository checkout:

    python docs/scripts/validate_docs.py

This script validates only facts that can be established mechanically from the
repository. It does not claim clinical, legal, UX, or source-reconciliation
correctness that requires accountable human review.

Exit codes:
    0  no failures
    1  one or more documentation failures
    2  validator could not locate/read the documentation root
"""

from __future__ import annotations

import re
import sys
from collections import defaultdict
from dataclasses import dataclass
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
DOCS = REPO / "docs"

PREFIXES = (
    "FR", "BR", "NFR", "DR", "TD", "ASM", "Q", "CONFLICT",
    "API", "SCR", "TC", "TASK", "ERR",
)
DOMAINS = (
    "IDENTITY", "CATALOG", "ELIG", "BOOKING", "CLINICAL", "FINANCE",
    "REVIEWS", "CLAIMS", "OPS", "POLICY", "AUDIT", "PLATFORM",
)

ID_RE = re.compile(
    r"\b(" + "|".join(re.escape(p) for p in PREFIXES)
    + r")-([A-Z]{3,10})-(\d{3})\b"
)
CANONICAL_ID_RE = re.compile(
    r"\b(?:" + "|".join(re.escape(p) for p in PREFIXES)
    + r")-[A-Z]{3,10}-\d{3}\b"
)
HEADING_ID_RE = re.compile(
    r"^#{2,6}\s+((?:" + "|".join(re.escape(p) for p in PREFIXES)
    + r")-[A-Z]{3,10}-\d{3})\b",
    re.M,
)
TABLE_FIRST_ID_RE = re.compile(
    r"^\|\s*`?((?:" + "|".join(re.escape(p) for p in PREFIXES)
    + r")-[A-Z]{3,10}-\d{3})`?\s*\|",
    re.M,
)

REQUIRED_FILES = (
    "AGENTS.md",
    "docs/README.md",
    "docs/PRD.md",
    "docs/SDD.md",
    "docs/architecture/SYSTEM_ARCHITECTURE.md",
    "docs/architecture/COMPONENT_DESIGN.md",
    "docs/api/API_CONTRACTS.md",
    "docs/api/ERROR_CATALOG.md",
    "docs/database/ERD.md",
    "docs/database/DFD.md",
    "docs/domain/STATE_MACHINES.md",
    "docs/domain/PERMISSIONS_MATRIX.md",
    "docs/domain/CROSS_PLATFORM_BEHAVIOR.md",
    "docs/diagrams/SEQUENCE_DIAGRAMS.md",
    "docs/ops/CONFIGURATION.md",
    "docs/ops/INFRASTRUCTURE.md",
    "docs/ops/MONITORING.md",
    "docs/TESTING_STRATEGY.md",
    "docs/implementation/ADMIN_IMPLEMENTATION_PLAN.md",
    "docs/implementation/CLINIC_IMPLEMENTATION_PLAN.md",
    "docs/implementation/USER_IMPLEMENTATION_PLAN.md",
    "docs/IMPLEMENTATION_PLAN.md",
    "docs/TRACEABILITY_MATRIX.md",
    "docs/scripts/validate_docs.py",
)

# Explicit omissions for the current engineering baseline. If an approved
# source later introduces either artifact, update README and this validator in
# the same documentation change.
#
# 2026-08-25: the UX chain introduced the SCR owner as
# docs/ux/01-foundation/INFORMATION_ARCHITECTURE.md rather than SCREEN_INVENTORY.md,
# because Phase 1 ran in Docs-Partial mode and derived its own screen model.
# OWNER_FILES["SCR"] was repointed accordingly. SCREEN_INVENTORY.md remains
# genuinely omitted and stays in the list below.
CURRENTLY_OMITTED_FILES = (
    "docs/ux/SCREEN_INVENTORY.md",
    "docs/integrations/INTEGRATION_CONTRACTS.md",
)

ROOT_LINE_BUDGETS = {
    "AGENTS.md": 150,
    "docs/README.md": 200,
}

OWNER_FILES = {
    "FR": ("docs/PRD.md",),
    "BR": ("docs/PRD.md",),
    "NFR": ("docs/PRD.md",),
    "DR": ("docs/PRD.md", "docs/SDD.md"),
    "TD": ("docs/SDD.md",),
    "ASM": (
        "docs/README.md",
        "docs/PRD.md",
        "docs/SDD.md",
        "docs/ux/01-foundation/UPSTREAM_GAPS.md",
    ),
    "Q": ("docs/README.md",),
    "CONFLICT": ("docs/README.md",),
    "API": ("docs/api/API_CONTRACTS.md",),
    "SCR": ("docs/ux/01-foundation/INFORMATION_ARCHITECTURE.md",),
    "TC": ("docs/TESTING_STRATEGY.md",),
    "TASK": (
        "docs/implementation/ADMIN_IMPLEMENTATION_PLAN.md",
        "docs/implementation/CLINIC_IMPLEMENTATION_PLAN.md",
        "docs/implementation/USER_IMPLEMENTATION_PLAN.md",
    ),
    "ERR": ("docs/api/ERROR_CATALOG.md",),
}


@dataclass(frozen=True)
class Finding:
    code: str
    message: str


class Validation:
    def __init__(self) -> None:
        self.failures: list[Finding] = []
        self.warnings: list[Finding] = []
        self.metrics: dict[str, int] = {}

    def fail(self, code: str, message: str) -> None:
        self.failures.append(Finding(code, message))

    def warn(self, code: str, message: str) -> None:
        self.warnings.append(Finding(code, message))


def relative(path: Path) -> str:
    try:
        return path.relative_to(REPO).as_posix()
    except ValueError:
        return path.as_posix()


def safe_read(path: Path, validation: Validation) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except FileNotFoundError:
        validation.fail("FILE_MISSING", f"missing file: {relative(path)}")
    except UnicodeDecodeError as exc:
        validation.fail("UTF8_ERROR", f"{relative(path)} is not UTF-8: {exc}")
    except OSError as exc:
        validation.fail("FILE_READ_ERROR", f"cannot read {relative(path)}: {exc}")
    return ""


def load_markdown(validation: Validation) -> dict[Path, str]:
    files: dict[Path, str] = {}
    root_agents = REPO / "AGENTS.md"
    if root_agents.exists():
        files[root_agents] = safe_read(root_agents, validation)

    if not DOCS.exists():
        validation.fail("DOCS_MISSING", "docs/ directory does not exist")
        return files

    for path in sorted(DOCS.rglob("*.md")):
        files[path] = safe_read(path, validation)
    return files


def validate_required_files(validation: Validation) -> None:
    for name in REQUIRED_FILES:
        if not (REPO / name).is_file():
            validation.fail("FILE_MISSING", f"missing required file: {name}")

    for name in CURRENTLY_OMITTED_FILES:
        if (REPO / name).exists():
            validation.fail(
                "OMITTED_FILE_PRESENT",
                f"{name} exists although README marks it omitted for this baseline",
            )


def heading_blocks(text: str, prefixes: tuple[str, ...]):
    """Yield (canonical_id, block, start_line) for canonical-ID headings."""
    heading_re = re.compile(r"^(#{1,6})\s+(.+?)\s*$", re.M)
    headings = list(heading_re.finditer(text))
    for index, match in enumerate(headings):
        item = CANONICAL_ID_RE.search(match.group(2))
        if not item or not item.group(0).startswith(tuple(p + "-" for p in prefixes)):
            continue
        level = len(match.group(1))
        end = len(text)
        for later in headings[index + 1:]:
            if len(later.group(1)) <= level:
                end = later.start()
                break
        start_line = text.count("\n", 0, match.start()) + 1
        yield item.group(0), text[match.start():end].rstrip(), start_line


def table_rows(text: str, prefix: str) -> dict[str, str]:
    result: dict[str, str] = {}
    for line in text.splitlines():
        match = TABLE_FIRST_ID_RE.match(line)
        if match and match.group(1).startswith(prefix + "-"):
            result[match.group(1)] = line
    return result


def parse_registry(readme: str, validation: Validation) -> dict[str, dict[str, int]]:
    lines = readme.splitlines()
    header_index: int | None = None
    headers: list[str] = []

    for index, line in enumerate(lines):
        if line.startswith("| Domain |") and "| FR |" in line and "| ERR |" in line:
            header_index = index
            headers = [c.strip() for c in line.strip().strip("|").split("|")]
            break

    if header_index is None:
        validation.fail("REGISTRY_MISSING", "README has no ID Registry table")
        return {}

    missing = [p for p in PREFIXES if p not in headers]
    if missing:
        validation.fail("REGISTRY_COLUMNS", "registry missing columns: " + ", ".join(missing))

    registry: dict[str, dict[str, int]] = {}
    for line in lines[header_index + 2:]:
        if not line.startswith("|"):
            break
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) != len(headers):
            validation.fail("REGISTRY_ROW", f"malformed registry row: {line}")
            continue
        domain = cells[0]
        if domain not in DOMAINS:
            validation.fail("REGISTRY_DOMAIN", f"unexpected registry domain {domain}")
            continue
        row: dict[str, int] = {}
        for prefix, value in zip(headers[1:], cells[1:]):
            if not re.fullmatch(r"\d{3}", value):
                validation.fail(
                    "REGISTRY_VALUE",
                    f"{domain}/{prefix} must be three digits; got {value!r}",
                )
                continue
            row[prefix] = int(value)
        registry[domain] = row

    for domain in DOMAINS:
        if domain not in registry:
            validation.fail("REGISTRY_DOMAIN_MISSING", f"registry missing {domain}")
    return registry


def expected_ids(registry: dict[str, dict[str, int]]) -> dict[str, set[str]]:
    expected: dict[str, set[str]] = defaultdict(set)
    for domain, row in registry.items():
        for prefix, maximum in row.items():
            for number in range(1, maximum + 1):
                expected[prefix].add(f"{prefix}-{domain}-{number:03d}")
    return expected


def owner_definitions(
    files: dict[Path, str], prefix: str
) -> tuple[set[str], dict[str, list[str]]]:
    found: set[str] = set()
    locations: dict[str, list[str]] = defaultdict(list)

    for owner_name in OWNER_FILES[prefix]:
        owner = REPO / owner_name
        text = files.get(owner, "")
        if not text:
            continue

        for match in HEADING_ID_RE.finditer(text):
            item_id = match.group(1)
            if item_id.startswith(prefix + "-"):
                found.add(item_id)
                line = text.count("\n", 0, match.start()) + 1
                locations[item_id].append(f"{owner_name}:{line}")

        if prefix == "TC":
            for item_id in table_rows(text, "TC"):
                found.add(item_id)
                locations[item_id].append(owner_name)

        if prefix in {"Q", "CONFLICT"}:
            # README is the canonical open/resolved register. A resolved conflict
            # may intentionally be prose instead of a table row.
            for match in ID_RE.finditer(text):
                if match.group(1) == prefix:
                    found.add(match.group(0))

    return found, locations


def validate_registry_and_ids(
    files: dict[Path, str],
    registry: dict[str, dict[str, int]],
    validation: Validation,
) -> None:
    allocations = expected_ids(registry)

    for path, text in files.items():
        for match in ID_RE.finditer(text):
            prefix, domain, number_text = match.groups()
            item_id = match.group(0)
            number = int(number_text)
            if domain not in DOMAINS:
                validation.fail(
                    "ID_DOMAIN",
                    f"{item_id} in {relative(path)} uses undeclared domain {domain}",
                )
                continue
            maximum = registry.get(domain, {}).get(prefix)
            if maximum is None or number == 0 or number > maximum:
                shown = "missing" if maximum is None else f"{maximum:03d}"
                validation.fail(
                    "ID_UNREGISTERED",
                    f"{item_id} in {relative(path)} exceeds registry maximum {shown}",
                )

    for prefix in PREFIXES:
        defined, locations = owner_definitions(files, prefix)
        expected = allocations.get(prefix, set())

        if prefix not in {"Q", "CONFLICT"}:
            for item_id, locs in sorted(locations.items()):
                if len(locs) > 1:
                    validation.fail(
                        "DUPLICATE_DEFINITION",
                        f"{item_id} has multiple canonical definitions: {', '.join(locs)}",
                    )

        for item_id in sorted(expected - defined):
            validation.fail(
                "ALLOCATED_ID_UNDEFINED",
                f"{item_id} allocated in README but absent from owner "
                + ", ".join(OWNER_FILES[prefix]),
            )
        for item_id in sorted(defined - expected):
            validation.fail(
                "DEFINED_ID_UNREGISTERED",
                f"{item_id} defined by canonical owner but not allocated in README",
            )
        validation.metrics[f"ids:{prefix}"] = len(defined)


def validate_line_budgets(files: dict[Path, str], validation: Validation) -> None:
    for name, limit in ROOT_LINE_BUDGETS.items():
        text = files.get(REPO / name, "")
        if not text:
            continue
        count = len(text.splitlines())
        validation.metrics[f"lines:{name}"] = count
        if count > limit:
            validation.fail("SIZE_BUDGET", f"{name}: {count} lines; budget <= {limit}")

    prd = files.get(REPO / "docs/PRD.md", "")
    for item_id, block, line in heading_blocks(prd, ("FR", "BR", "NFR", "DR")):
        count = len(block.splitlines())
        if count > 25:
            validation.fail(
                "PRD_BLOCK_BUDGET",
                f"{item_id} at docs/PRD.md:{line}: {count} lines; budget <= 25",
            )

    sdd = files.get(REPO / "docs/SDD.md", "")
    section_re = re.compile(r"^##\s+(.+?)\s*$", re.M)
    sections = list(section_re.finditer(sdd))
    for index, match in enumerate(sections):
        end = sections[index + 1].start() if index + 1 < len(sections) else len(sdd)
        block = sdd[match.start():end].rstrip()
        if "**Implements:**" not in block:
            continue
        count = len(block.splitlines())
        if count > 40:
            line = sdd.count("\n", 0, match.start()) + 1
            validation.fail(
                "SDD_FEATURE_BUDGET",
                f"SDD section {match.group(1)!r} at line {line}: {count} lines; budget <= 40",
            )

    for name in OWNER_FILES["TASK"]:
        text = files.get(REPO / name, "")
        for item_id, block, line in heading_blocks(text, ("TASK",)):
            count = len(block.splitlines())
            if count > 30:
                validation.fail(
                    "TASK_BLOCK_BUDGET",
                    f"{item_id} at {name}:{line}: {count} lines; budget <= 30",
                )


def validate_requirement_blocks(
    files: dict[Path, str], validation: Validation
) -> set[str]:
    prd = files.get(REPO / "docs/PRD.md", "")
    requirements: set[str] = set()

    for item_id, block, line in heading_blocks(prd, ("FR", "BR", "NFR", "DR")):
        requirements.add(item_id)
        if "**Source:**" not in block:
            validation.fail("REQ_SOURCE", f"{item_id} at docs/PRD.md:{line} has no Source")

        if item_id.startswith("NFR-"):
            for marker in ("**Metric / Threshold:**", "**Measurement Method:**"):
                if marker not in block:
                    validation.fail(
                        "REQ_NFR_ACCEPTANCE",
                        f"{item_id} at docs/PRD.md:{line} missing {marker}",
                    )
        else:
            if "**Acceptance Criteria:**" not in block:
                validation.fail(
                    "REQ_ACCEPTANCE",
                    f"{item_id} at docs/PRD.md:{line} has no Acceptance Criteria",
                )
            elif not re.search(r"(?im)^-\s+Given\b", block):
                validation.fail(
                    "REQ_ACCEPTANCE_GIVEN",
                    f"{item_id} at docs/PRD.md:{line} has no Given acceptance case",
                )

    validation.metrics["requirements:total"] = len(requirements)
    for prefix in ("FR", "BR", "NFR", "DR"):
        validation.metrics[f"requirements:{prefix}"] = sum(
            item.startswith(prefix + "-") for item in requirements
        )
    return requirements


def markdown_cells(line: str) -> list[str]:
    line = line.strip()
    if not line.startswith("|") or not line.endswith("|"):
        return []
    return [cell.strip() for cell in line.strip("|").split("|")]


def trace_rows(matrix: str) -> dict[str, list[str]]:
    rows: dict[str, list[str]] = {}
    for line in matrix.splitlines():
        cells = markdown_cells(line)
        if not cells:
            continue
        match = CANONICAL_ID_RE.search(cells[0])
        if not match:
            continue
        item_id = match.group(0)
        if item_id.startswith(("FR-", "BR-", "NFR-", "DR-")):
            rows[item_id] = cells
    return rows


def validate_traceability(
    files: dict[Path, str], requirements: set[str], validation: Validation
) -> None:
    matrix = files.get(REPO / "docs/TRACEABILITY_MATRIX.md", "")
    rows = trace_rows(matrix)

    for item_id in sorted(requirements - set(rows)):
        validation.fail("TRACE_REQ_MISSING", f"{item_id} has no traceability row")
    for item_id in sorted(set(rows) - requirements):
        validation.fail("TRACE_REQ_UNKNOWN", f"{item_id} trace row is not defined in PRD")

    task_mapped = 0
    tc_mapped = 0
    for item_id in sorted(requirements):
        cells = rows.get(item_id)
        if not cells:
            continue
        row_text = " | ".join(cells)
        if re.search(r"\bTASK-[A-Z]{3,10}-\d{3}\b", row_text):
            task_mapped += 1
        else:
            validation.fail("TRACE_NO_TASK", f"{item_id} maps to no TASK-*")
        if re.search(r"\bTC-[A-Z]{3,10}-\d{3}\b", row_text):
            tc_mapped += 1
        else:
            validation.fail("TRACE_NO_TC", f"{item_id} maps to no TC-*")

        if item_id.startswith(("FR-", "BR-", "DR-")):
            if len(cells) < 12:
                validation.fail(
                    "TRACE_FR_COLUMNS",
                    f"{item_id} row has {len(cells)} columns; expected >= 12",
                )
            else:
                for label, value in (
                    ("Patient", cells[3]),
                    ("Clinic", cells[4]),
                    ("Admin", cells[5]),
                    ("Cross-Platform Behavior", cells[6]),
                ):
                    if not value:
                        validation.fail(
                            "TRACE_PLATFORM_EMPTY",
                            f"{item_id} has empty {label} cell",
                        )
        elif item_id.startswith("NFR-"):
            if len(cells) < 11:
                validation.fail(
                    "TRACE_NFR_COLUMNS",
                    f"{item_id} row has {len(cells)} columns; expected >= 11",
                )
            else:
                for label, value in (
                    ("Patient", cells[3]),
                    ("Clinic", cells[4]),
                    ("Admin", cells[5]),
                ):
                    if not value:
                        validation.fail(
                            "TRACE_PLATFORM_EMPTY",
                            f"{item_id} has empty {label} impact cell",
                        )

    validation.metrics["trace:task_mapped"] = task_mapped
    validation.metrics["trace:tc_mapped"] = tc_mapped


def validate_artifact_contracts(files: dict[Path, str], validation: Validation) -> None:
    api_name = "docs/api/API_CONTRACTS.md"
    api = files.get(REPO / api_name, "")
    for item_id, block, line in heading_blocks(api, ("API",)):
        for marker in (
            "**Requirements:**", "**Status:**", "**Method / Path:**",
            "**Actor / Auth:**", "**Errors:**",
        ):
            if marker not in block:
                validation.fail("API_FIELD", f"{item_id} at {api_name}:{line} missing {marker}")
        if not re.search(r"\*\*(?:Existing )?Tests:\*\*", block):
            validation.fail("API_TESTS", f"{item_id} at {api_name}:{line} has no Tests field")
        if not re.search(r"\b(?:FR|NFR)-[A-Z]{3,10}-\d{3}\b", block):
            validation.fail("API_REQUIREMENT", f"{item_id} references no FR/NFR")

    err_name = "docs/api/ERROR_CATALOG.md"
    errors = files.get(REPO / err_name, "")
    for item_id, block, line in heading_blocks(errors, ("ERR",)):
        for marker in (
            "**Stable code:**", "**HTTP status:**", "**Requirements:**",
            "**Client-facing message:**", "**When raised:**", "**APIs:**",
            "**Retryable:**", "**Surface:**",
        ):
            if marker not in block:
                validation.fail("ERR_FIELD", f"{item_id} at {err_name}:{line} missing {marker}")
        if not re.search(r"\b(?:FR|NFR)-[A-Z]{3,10}-\d{3}\b", block):
            validation.fail("ERR_REQUIREMENT", f"{item_id} references no FR/NFR")

    for task_name in OWNER_FILES["TASK"]:
        text = files.get(REPO / task_name, "")
        for item_id, block, line in heading_blocks(text, ("TASK",)):
            if "**Implements:**" not in block:
                validation.fail(
                    "TASK_REQUIREMENT_FIELD",
                    f"{item_id} at {task_name}:{line} missing **Implements:**",
                )
            elif not re.search(r"\b(?:FR|NFR)-[A-Z]{3,10}-\d{3}\b", block):
                validation.fail("TASK_REQUIREMENT", f"{item_id} references no FR/NFR")
            for marker, code in (
                ("**Tests Required:**", "TASK_TESTS"),
                ("**Verification:**", "TASK_VERIFY"),
                ("**Definition of Done:**", "TASK_DOD"),
            ):
                if marker not in block:
                    validation.fail(code, f"{item_id} at {task_name}:{line} missing {marker}")

    testing = files.get(REPO / "docs/TESTING_STRATEGY.md", "")
    for item_id, row in sorted(table_rows(testing, "TC").items()):
        if not re.search(r"\b(?:FR|NFR)-[A-Z]{3,10}-\d{3}\b", row):
            validation.fail("TC_REQUIREMENT", f"{item_id} references no FR/NFR")
        if not re.search(r"\|\s*(?:Existing|Partial|Planned)\s*\|", row):
            validation.fail("TC_STATUS", f"{item_id} has no Existing/Partial/Planned status")


def validate_cross_platform(files: dict[Path, str], validation: Validation) -> None:
    name = "docs/domain/CROSS_PLATFORM_BEHAVIOR.md"
    text = files.get(REPO / name, "")
    lower = text.lower()
    for phrase in (
        "one authoritative business state",
        "notifications are post-commit side effects",
        "work items are operational projections, not business truth",
        "default delete rule",
        "booking",
        "treatment",
        "financial",
        "review",
        "claim",
        "eligibility",
    ):
        if phrase.lower() not in lower:
            validation.fail(
                "CROSS_PLATFORM_CONTRACT",
                f"{name} missing required concept/section {phrase!r}",
            )

    required_tcs = (
        "TC-IDENTITY-007", "TC-CATALOG-005", "TC-ELIG-006",
        "TC-BOOKING-002", "TC-BOOKING-004", "TC-BOOKING-006", "TC-BOOKING-008",
        "TC-CLINICAL-003", "TC-CLINICAL-004", "TC-CLINICAL-007",
        "TC-FINANCE-003", "TC-REVIEWS-004", "TC-CLAIMS-004", "TC-CLAIMS-007",
        "TC-OPS-005", "TC-PLATFORM-010",
    )
    testing = files.get(REPO / "docs/TESTING_STRATEGY.md", "")
    matrix = files.get(REPO / "docs/TRACEABILITY_MATRIX.md", "")
    for tc in required_tcs:
        if tc not in testing:
            validation.fail("CROSS_PLATFORM_TC", f"{tc} missing from TESTING_STRATEGY.md")
        if tc not in matrix:
            validation.fail("CROSS_PLATFORM_TRACE", f"{tc} missing from TRACEABILITY_MATRIX.md")


def validate_local_links(files: dict[Path, str], validation: Validation) -> None:
    link_re = re.compile(r"!?\[[^\]]*\]\(([^)]+)\)")
    for path, text in files.items():
        for match in link_re.finditer(text):
            raw = match.group(1).strip()
            if not raw or raw.startswith(("#", "http://", "https://", "mailto:", "tel:", "data:")):
                continue
            target = raw.split(' "', 1)[0].split(" '", 1)[0].split("#", 1)[0].strip()
            if not target or target.startswith("sandbox:"):
                continue
            candidate = (path.parent / target).resolve()
            try:
                candidate.relative_to(REPO.resolve())
            except ValueError:
                validation.warn(
                    "LINK_OUTSIDE_REPO",
                    f"{relative(path)} contains link outside repository: {raw}",
                )
                continue
            if not candidate.exists():
                line = text.count("\n", 0, match.start()) + 1
                validation.fail(
                    "BROKEN_LINK",
                    f"{relative(path)}:{line} references missing path {target}",
                )


def validate_mermaid(files: dict[Path, str], validation: Validation) -> None:
    fence_re = re.compile(r"```mermaid\s*\n(.*?)```", re.S | re.I)
    allowed = ("erDiagram", "sequenceDiagram", "stateDiagram-v2", "flowchart TD", "flowchart LR")
    prohibited = ("<br", "classDef ", "style ", "%%{")

    for path, text in files.items():
        for match in fence_re.finditer(text):
            body = match.group(1).strip()
            line = text.count("\n", 0, match.start()) + 1
            if not body:
                validation.fail("MERMAID_EMPTY", f"{relative(path)}:{line} empty Mermaid fence")
                continue
            first = body.splitlines()[0].strip()
            if not any(first.startswith(kind) for kind in allowed):
                validation.fail(
                    "MERMAID_KIND",
                    f"{relative(path)}:{line} unsupported Mermaid start {first!r}",
                )
            for token in prohibited:
                if token.lower() in body.lower():
                    validation.fail(
                        "MERMAID_UNSAFE",
                        f"{relative(path)}:{line} Mermaid contains prohibited token {token!r}",
                    )


def validate_counts_and_open_items(
    files: dict[Path, str],
    registry: dict[str, dict[str, int]],
    requirements: set[str],
    validation: Validation,
) -> None:
    readme = files.get(REPO / "docs/README.md", "")
    matrix = files.get(REPO / "docs/TRACEABILITY_MATRIX.md", "")
    totals = {prefix: sum(row.get(prefix, 0) for row in registry.values()) for prefix in PREFIXES}

    stated = {
        "API": r"(\d+)\s+allocated `API-\*` contracts",
        "ERR": r"(\d+)\s+`ERR-\*` definitions",
        "TASK": r"(\d+)\s+`TASK-\*` implementation tasks",
        "TC": r"(\d+)\s+concrete `TC-\*` cases",
    }
    for prefix, pattern in stated.items():
        match = re.search(pattern, readme)
        if not match:
            validation.fail("REGISTRY_SNAPSHOT", f"README snapshot does not state {prefix} count")
        elif int(match.group(1)) != totals[prefix]:
            validation.fail(
                "REGISTRY_SNAPSHOT_COUNT",
                f"README states {match.group(1)} {prefix}; registry sums to {totals[prefix]}",
            )

    for label, prefix in (
        ("Functional requirements traced", "FR"),
        ("Non-functional requirements traced", "NFR"),
    ):
        count = sum(item.startswith(prefix + "-") for item in requirements)
        match = re.search(re.escape(label) + r":\s*\*\*(\d+)\s*/\s*(\d+)\*\*", matrix)
        if not match:
            validation.fail("TRACE_SUMMARY", f"missing summary line: {label}")
        elif (int(match.group(1)), int(match.group(2))) != (count, count):
            validation.fail(
                "TRACE_SUMMARY_COUNT",
                f"{label} is {match.group(1)}/{match.group(2)}; expected {count}/{count}",
            )

    if "CONFLICT-CATALOG-001" not in readme or "Resolved (2026-08-24)" not in readme:
        validation.fail(
            "RESOLVED_CONFLICT",
            "README must retain CONFLICT-CATALOG-001 as Resolved (2026-08-24)",
        )

    for item in (
        "Q-PLATFORM-001", "Q-CATALOG-001", "Q-ELIG-001",
        "Q-PLATFORM-002", "Q-OPS-001", "Q-PLATFORM-003",
    ):
        if item not in readme:
            validation.fail("OPEN_ITEM_MISSING", f"README no longer surfaces {item}")


def print_report(validation: Validation, files: dict[Path, str]) -> None:
    print("UberTib documentation validation")
    print("=" * 32)
    print(f"Repository: {REPO}")
    print(f"Markdown files inspected: {len(files)}")

    print("\nMetrics")
    print("-------")
    preferred = (
        "requirements:total", "requirements:FR", "requirements:BR",
        "requirements:NFR", "requirements:DR", "ids:API", "ids:ERR",
        "ids:TASK", "ids:TC", "trace:task_mapped", "trace:tc_mapped",
        "lines:AGENTS.md", "lines:docs/README.md",
    )
    printed: set[str] = set()
    for key in preferred:
        if key in validation.metrics:
            print(f"{key}: {validation.metrics[key]}")
            printed.add(key)
    for key in sorted(validation.metrics):
        if key not in printed and not key.startswith("ids:"):
            print(f"{key}: {validation.metrics[key]}")

    print("\nWarnings")
    print("--------")
    if not validation.warnings:
        print("none")
    else:
        for finding in sorted(validation.warnings, key=lambda f: (f.code, f.message)):
            print(f"WARN [{finding.code}] {finding.message}")

    print("\nFailures")
    print("--------")
    if not validation.failures:
        print("none")
    else:
        for finding in sorted(validation.failures, key=lambda f: (f.code, f.message)):
            print(f"FAIL [{finding.code}] {finding.message}")

    print(f"\nResult: {len(validation.failures)} failure(s), {len(validation.warnings)} warning(s)")


def main() -> int:
    if not REPO.exists() or not DOCS.exists():
        print(f"Cannot locate repository/docs from {__file__}", file=sys.stderr)
        return 2

    validation = Validation()
    validate_required_files(validation)
    files = load_markdown(validation)

    readme = files.get(REPO / "docs/README.md", "")
    registry = parse_registry(readme, validation) if readme else {}

    validate_line_budgets(files, validation)
    if registry:
        validate_registry_and_ids(files, registry, validation)

    requirements = validate_requirement_blocks(files, validation)
    validate_traceability(files, requirements, validation)
    validate_artifact_contracts(files, validation)
    validate_cross_platform(files, validation)
    validate_local_links(files, validation)
    validate_mermaid(files, validation)

    if registry:
        validate_counts_and_open_items(files, registry, requirements, validation)

    print_report(validation, files)
    return 1 if validation.failures else 0


if __name__ == "__main__":
    raise SystemExit(main())