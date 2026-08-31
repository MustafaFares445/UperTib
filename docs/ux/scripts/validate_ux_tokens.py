#!/usr/bin/env python3
"""Mechanical gate for the UberTib UX token source. Exits 1 on any failure.

WHY THIS EXISTS. The design kit ships scripts/validate_tokens.py and
scripts/validate_contrast.py, and both hardcode the repository-root tokens/ directory with no
argument. Run against this product they report a green result for the KIT DEMONSTRATION
TOKENS, not for UberTib. That is a false pass of exactly the kind the verification protocol
exists to prevent, so the UberTib token source lives inside the phase that owns it and this
gate runs the same checks - and several the kit does not have - against that path.

Checks:
  1. Every token file parses as JSON.
  2. Every {alias} resolves to a defined token.
  3. Literal values appear only in primitive.* files.
  4. A component token resolves to the semantic layer, never straight to a primitive.
  5. Every required contrast pair meets WCAG 2.2 AA in V1 light mode and every declared compatibility override map.
  6. Every lifecycle status carries a complete tone-icon-emphasis triple, with a defined tone,
     a governed emphasis and a governed icon. A status may not resolve to a colour alone.
  7. No machine reuses one icon for two of its own statuses.
  8. Every semantic colour token has a dark compatibility override.
  9. The state channel covers the documented 18 machines and 82 statuses.
 10. Every governed icon exists in the installed Heroicons package, when it is installed.

Usage:
  python docs/ux/scripts/validate_ux_tokens.py
  python docs/ux/scripts/validate_ux_tokens.py --verbose   # print every measured pair
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

UX = Path(__file__).resolve().parent.parent
TOKENS = UX / "03-system" / "design_tokens"
REPO = UX.parent.parent
HEROICONS = REPO / "UberTip-Backend" / "vendor" / "blade-ui-kit" / "blade-heroicons" / "resources" / "svg"

ALIAS = re.compile(r"^\{([^}]+)\}$")
LITERAL = re.compile(r"^(#[0-9a-fA-F]{3,8}|-?\d+(\.\d+)?(px|ms|s|rem|em)?)$")
TONES = ("neutral", "info", "success", "warning", "danger", "restricted")
EMPHASES = ("muted", "subtle", "outline", "solid")
SURFACES = ("canvas", "default", "subtle")

# Documented scale, from INFORMATION_ARCHITECTURE.md section 10.16.
EXPECTED_MACHINES = 18
EXPECTED_STATUSES = 82

# Semantic colour tokens that intentionally carry no dark override.
DARK_EXEMPT: set[str] = set()

failures: list[str] = []
notes: list[str] = []


def fail(message: str) -> None:
    failures.append(message)


# --- loading ------------------------------------------------------------------------------
def flatten(node, prefix="") -> dict[str, object]:
    out: dict[str, object] = {}
    if isinstance(node, dict):
        if "$value" in node:
            out[prefix] = node["$value"]
            return out
        for key, value in node.items():
            if key.startswith("$"):
                continue
            out.update(flatten(value, f"{prefix}.{key}" if prefix else key))
    return out


def load() -> tuple[dict[str, dict], dict[str, str]]:
    files: dict[str, dict] = {}
    for path in sorted(TOKENS.glob("*.json")):
        try:
            files[path.name] = json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as error:
            fail(f"{path.name}: invalid JSON - {error}")
    values: dict[str, str] = {}
    for name, data in files.items():
        for path, value in flatten(data).items():
            if path in values:
                fail(f"duplicate token path {path} redefined by {name}")
            values[path] = value
    return files, values


def resolve(values: dict[str, object], path: str, overrides: dict[str, object] | None = None,
            depth: int = 0) -> object | None:
    """Follow an alias chain to a final literal, honouring a dark override map."""
    if depth > 12:
        return None
    if overrides is not None and path.startswith("semantic.color."):
        key = "dark." + path[len("semantic.color."):]
        if key in overrides:
            return _follow(values, overrides[key], overrides, depth + 1)
    if path not in values:
        return None
    return _follow(values, values[path], overrides, depth + 1)


def _follow(values: dict[str, object], value: object, overrides, depth: int) -> object | None:
    if depth > 12:
        return None
    if isinstance(value, str):
        match = ALIAS.match(value.strip())
        if match:
            target = match.group(1).strip()
            if overrides is not None and target.startswith("semantic.color."):
                dark_key = "dark." + target[len("semantic.color."):]
                if dark_key in values:
                    return _follow(values, values[dark_key], overrides, depth + 1)
            if target not in values:
                return None
            return _follow(values, values[target], overrides, depth + 1)
    return value


# --- colour maths -------------------------------------------------------------------------
def _channel(component: float) -> float:
    return component / 12.92 if component <= 0.03928 else ((component + 0.055) / 1.055) ** 2.4


def luminance(value: str) -> float:
    digits = value.lstrip("#")
    parts = [_channel(int(digits[i:i + 2], 16) / 255) for i in (0, 2, 4)]
    return 0.2126 * parts[0] + 0.7152 * parts[1] + 0.0722 * parts[2]


def ratio(foreground: str, background: str) -> float:
    first, second = luminance(foreground), luminance(background)
    high, low = max(first, second), min(first, second)
    return (high + 0.05) / (low + 0.05)


# --- checks -------------------------------------------------------------------------------
def check_aliases(files: dict[str, dict], values: dict[str, object]) -> None:
    for name, data in files.items():
        for path, value in flatten(data).items():
            targets: list[str] = []
            if isinstance(value, str):
                targets += re.findall(r"\{([^}]+)\}", value)
            elif isinstance(value, dict):
                for inner in value.values():
                    if isinstance(inner, str):
                        targets += re.findall(r"\{([^}]+)\}", inner)
            elif isinstance(value, list):
                for item in value:
                    if isinstance(item, dict):
                        for inner in item.values():
                            if isinstance(inner, str):
                                targets += re.findall(r"\{([^}]+)\}", inner)
            for target in targets:
                if target.strip() not in values:
                    fail(f"{name}: {path} references undefined token {{{target.strip()}}}")


def check_layering(files: dict[str, dict], values: dict[str, object]) -> None:
    """Literals live in primitive files; component tokens stop at the semantic layer."""
    for name, data in files.items():
        primitive = name.startswith("primitive.")
        for path, value in flatten(data).items():
            if not isinstance(value, str):
                continue
            if ALIAS.match(value.strip()):
                if name == "component.json" and path.startswith("component."):
                    target = ALIAS.match(value.strip()).group(1).strip()
                    if not target.startswith("semantic."):
                        fail(f"component.json: {path} reaches {target} directly; "
                             "a component token must resolve to the semantic layer")
                continue
            if primitive or "primitive" in path.split("."):
                continue
            if not LITERAL.match(value.strip()):
                continue
            fail(f"{name}: {path} carries the literal value {value!r}; a literal belongs in a "
                 "primitive.* file or under a group named primitive")


def check_dark_coverage(values: dict[str, object]) -> None:
    light = {p for p in values if p.startswith("semantic.color.")}
    for path in sorted(light):
        if path in DARK_EXEMPT:
            continue
        if "dark." + path[len("semantic.color."):] not in values:
            fail(f"{path} has no dark override; a semantic colour must be defined in every "
                 "declared dark compatibility mode")


def pairs(values: dict[str, object]) -> list[tuple[str, str, str, float]]:
    """(label, foreground path, background path, minimum ratio)."""
    out: list[tuple[str, str, str, float]] = []
    surfaces = [(s, f"semantic.color.surface.{s}") for s in SURFACES]

    for role in ("primary", "secondary", "link"):
        for name, surface in surfaces:
            out.append((f"text.{role} on surface.{name}",
                        f"semantic.color.text.{role}", surface, 4.5))
    out.append(("text.placeholder on surface.default",
                "semantic.color.text.placeholder", "semantic.color.surface.default", 4.5))

    for name, surface in surfaces:
        out.append((f"border.strong on surface.{name}",
                    "semantic.color.border.strong", surface, 3.0))
        out.append((f"action.primary boundary on surface.{name}",
                    "semantic.color.action.primary", surface, 3.0))
        out.append((f"action.destructive boundary on surface.{name}",
                    "semantic.color.action.destructive", surface, 3.0))
        out.append((f"action.secondary-border on surface.{name}",
                    "semantic.color.action.secondary-border", surface, 3.0))

    for variant in ("primary", "primary-hover", "primary-active",
                    "destructive", "destructive-hover", "destructive-active"):
        out.append((f"text.on-action on action.{variant}",
                    "semantic.color.text.on-action", f"semantic.color.action.{variant}", 4.5))
    out.append(("action.secondary-text on action.secondary-surface",
                "semantic.color.action.secondary-text",
                "semantic.color.action.secondary-surface", 4.5))
    out.append(("text.primary on action.primary-subtle",
                "semantic.color.text.primary", "semantic.color.action.primary-subtle", 4.5))
    out.append(("action.primary on action.primary-subtle",
                "semantic.color.action.primary", "semantic.color.action.primary-subtle", 4.5))
    out.append(("text.on-inverse on surface.inverse",
                "semantic.color.text.on-inverse", "semantic.color.surface.inverse", 4.5))

    for tone in TONES:
        base = f"semantic.color.tone.{tone}"
        for name, surface in surfaces:
            out.append((f"tone.{tone}.text on surface.{name}", f"{base}.text", surface, 4.5))
            out.append((f"tone.{tone}.border on surface.{name}", f"{base}.border", surface, 3.0))
            out.append((f"tone.{tone}.emphasis-border on surface.{name}",
                        f"{base}.emphasis-border", surface, 3.0))
        out.append((f"tone.{tone}.text on tone.{tone}.fill", f"{base}.text", f"{base}.fill", 4.5))
        out.append((f"tone.{tone}.on-emphasis on tone.{tone}.emphasis",
                    f"{base}.on-emphasis", f"{base}.emphasis", 4.5))

    out.append(("state.readonly.text on state.readonly.surface",
                "semantic.color.state.readonly.text",
                "semantic.color.state.readonly.surface", 4.5))
    out.append(("state.selected.text on state.selected.surface",
                "semantic.color.state.selected.text",
                "semantic.color.state.selected.surface", 4.5))
    for name, surface in surfaces:
        out.append((f"state.selected.border on surface.{name}",
                    "semantic.color.state.selected.border", surface, 3.0))
    return out


def focus_backgrounds() -> list[tuple[str, str]]:
    out = [(f"surface.{s}", f"semantic.color.surface.{s}") for s in SURFACES]
    out.append(("action.primary", "semantic.color.action.primary"))
    out.append(("action.destructive", "semantic.color.action.destructive"))
    for tone in TONES:
        out.append((f"tone.{tone}.emphasis", f"semantic.color.tone.{tone}.emphasis"))
    return out


ADVISORY = [
    ("border.subtle on surface.default", "semantic.color.border.subtle",
     "semantic.color.surface.default", 3.0),
    ("border.default on surface.default", "semantic.color.border.default",
     "semantic.color.surface.default", 3.0),
    ("text.disabled on state.disabled.surface", "semantic.color.text.disabled",
     "semantic.color.state.disabled.surface", 4.5),
]


def check_contrast(values: dict[str, object], verbose: bool) -> None:
    modes: list[tuple[str, dict | None]] = [("LIGHT", None)]
    dark = {p: v for p, v in values.items() if p.startswith("dark.")}
    if dark:
        modes.append(("DARK COMPATIBILITY OVERRIDES", dark))

    for mode, overrides in modes:
        print(f"\n=== {mode} - required pairs ===")
        checked = passed = 0
        for label, fg_path, bg_path, minimum in pairs(values):
            foreground = resolve(values, fg_path, overrides)
            background = resolve(values, bg_path, overrides)
            if not isinstance(foreground, str) or not isinstance(background, str):
                fail(f"{mode}: {label} - token missing ({fg_path}, {bg_path})")
                continue
            measured = ratio(foreground, background)
            checked += 1
            ok = measured >= minimum
            passed += ok
            if not ok:
                fail(f"{mode}: {label} is {measured:.2f}:1, below {minimum}"
                     f" [{foreground} on {background}]")
            if verbose or not ok:
                print(f"  {'PASS' if ok else 'FAIL'} {label:<52} {measured:5.2f}:1 "
                      f"(need {minimum})  {foreground} on {background}")

        for label, background_path in focus_backgrounds():
            background = resolve(values, background_path, overrides)
            ring = resolve(values, "semantic.color.focus.ring", overrides)
            contrast_ring = resolve(values, "semantic.color.focus.ring-contrast", overrides)
            if not all(isinstance(v, str) for v in (background, ring, contrast_ring)):
                fail(f"{mode}: focus ring tokens missing for {label}")
                continue
            best = max(ratio(ring, background), ratio(contrast_ring, background))
            checked += 1
            ok = best >= 3.0
            passed += ok
            if not ok:
                fail(f"{mode}: focus ring over {label} is {best:.2f}:1, below 3.0 on both bands")
            if verbose or not ok:
                print(f"  {'PASS' if ok else 'FAIL'} focus ring over {label:<44} "
                      f"{best:5.2f}:1 (need 3.0, best of the two bands)")
        print(f"  {passed}/{checked} required pairs pass")

        print(f"--- {mode} - advisory, reported and never failed ---")
        for label, fg_path, bg_path, minimum in ADVISORY:
            foreground = resolve(values, fg_path, overrides)
            background = resolve(values, bg_path, overrides)
            if isinstance(foreground, str) and isinstance(background, str):
                measured = ratio(foreground, background)
                print(f"  {'ok  ' if measured >= minimum else 'note'} {label:<52} "
                      f"{measured:5.2f}:1")


def check_state_channel(files: dict[str, dict], values: dict[str, object]) -> None:
    data = files.get("semantic.state.json")
    if not data:
        fail("semantic.state.json is missing; the state channel is mandatory")
        return
    vocabulary = set(data.get("icon-vocabulary", {})) - {"$description"}
    machines = {k: v for k, v in data.get("state", {}).items() if not k.startswith("$")}
    total = 0

    for machine, statuses in machines.items():
        seen_icons: dict[str, str] = {}
        for name, triple in statuses.items():
            if name.startswith("$"):
                continue
            total += 1
            for channel in ("tone", "icon", "emphasis"):
                if channel not in triple:
                    fail(f"state.{machine}.{name} has no {channel}; a status must resolve to a "
                         "tone, an icon and an emphasis, never to a colour alone")
            tone = triple.get("tone", {}).get("$value")
            icon = triple.get("icon", {}).get("$value")
            emphasis = triple.get("emphasis", {}).get("$value")
            if tone not in TONES:
                fail(f"state.{machine}.{name} names undefined tone {tone!r}")
            elif f"semantic.color.tone.{tone}.text" not in values:
                fail(f"state.{machine}.{name} tone {tone!r} has no semantic tone group")
            if emphasis not in EMPHASES:
                fail(f"state.{machine}.{name} names undefined emphasis {emphasis!r}")
            if icon not in vocabulary:
                fail(f"state.{machine}.{name} names icon {icon!r}, which is not in the "
                     "governed icon vocabulary")
            elif icon in seen_icons:
                fail(f"state.{machine} uses icon {icon!r} for both {seen_icons[icon]} and "
                     f"{name}; one machine may not reuse an icon")
            else:
                seen_icons[icon] = name

    if len(machines) != EXPECTED_MACHINES:
        fail(f"state channel covers {len(machines)} machines; the documented lifecycle sweep "
             f"has {EXPECTED_MACHINES}")
    if total != EXPECTED_STATUSES:
        fail(f"state channel covers {total} statuses; the documented lifecycle sweep has "
             f"{EXPECTED_STATUSES}")

    if HEROICONS.is_dir():
        missing = sorted(n for n in vocabulary if not (HEROICONS / f"o-{n}.svg").is_file())
        if missing:
            fail("icons absent from the installed Heroicons package: " + ", ".join(missing))
        else:
            notes.append(f"icon existence verified against {len(vocabulary)} names in the "
                         "installed Heroicons package")
    else:
        notes.append("icon existence NOT verified: the Heroicons package is not installed at "
                     f"{HEROICONS}")

    print(f"\n=== state channel ===\n  {len(machines)} machines, {total} statuses, "
          f"{len(vocabulary)} governed icons, every status a complete triple")


def main(argv: list[str]) -> int:
    verbose = "--verbose" in argv
    if not TOKENS.is_dir():
        print(f"ERROR: {TOKENS} not found")
        return 1

    files, values = load()
    print("UberTib UX token gate")
    print("=" * 21)
    print(f"Source: {TOKENS}")
    print(f"Files: {len(files)}   Tokens: {len(values)}")

    check_aliases(files, values)
    check_layering(files, values)
    check_dark_coverage(values)
    check_state_channel(files, values)
    check_contrast(values, verbose)

    print()
    for note in notes:
        print("note: " + note)
    if failures:
        print(f"\n{len(failures)} failure(s):")
        for line in failures:
            print("  x " + line)
        return 1
    print("\nOK: 0 failures. Token source parses, every alias resolves, the layering holds, "
          "every status is a complete triple, and every required contrast pair meets WCAG 2.2 "
          "AA in V1 light mode and every declared compatibility override map.")
    print("This gate proves token-level correctness only. It does not prove that a rendered "
          "screen is accessible, and no conformance claim follows from it.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
