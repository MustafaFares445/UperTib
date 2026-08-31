#!/usr/bin/env python3
"""Derive the UberTib primitive colour ramps and write design_tokens/primitive.color.json.

The documented UberTib role values (v2.1 reference section 15.1) plus the one measured
accessibility correction are ANCHORS. Every anchor is reproduced bit-exact; this script fails
if any anchor drifts. Unanchored steps are interpolated in OKLCH and clipped into the sRGB
gamut, which is the colour space both runtime targets actually render in.

Ramp shape - the darkness curve, the relative-chroma curve and the hue drift per step - is a
measured reference shape recorded inline below. Shape is borrowed; every value the product
actually documented is preserved exactly.

Usage:
  python docs/ux/scripts/derive_primitive_ramps.py            # verify only, print the ramps
  python docs/ux/scripts/derive_primitive_ramps.py --write    # rewrite primitive.color.json
Exit 0 = every anchor reproduced bit-exact; 1 = an anchor drifted.
"""
from __future__ import annotations

import json
import math
import sys
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "03-system" / "design_tokens" / "primitive.color.json"

STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
IDX = {s: i for i, s in enumerate(STEPS)}

# --- OKLCH <-> sRGB -----------------------------------------------------------------------
M1 = ((0.4122214708, 0.5363325363, 0.0514459929),
      (0.2119034982, 0.6806995451, 0.1073969566),
      (0.0883024619, 0.2817188376, 0.6299787005))
M2 = ((0.2104542553, 0.7936177850, -0.0040720468),
      (1.9779984951, -2.4285922050, 0.4505937099),
      (0.0259040371, 0.7827717662, -0.8086757660))
M1I = ((4.0767416621, -3.3077115913, 0.2309699292),
       (-1.2684380046, 2.6097574011, -0.3413193965),
       (-0.0041960863, -0.7034186147, 1.7076147010))
M2I = ((1.0, 0.3963377774, 0.2158037573),
       (1.0, -0.1055613458, -0.0638541728),
       (1.0, -0.0894841775, -1.2914855480))


def _mv(matrix: tuple, vector: list[float]) -> list[float]:
    return [sum(matrix[i][j] * vector[j] for j in range(3)) for i in range(3)]


def _to_linear(channel: float) -> float:
    return channel / 12.92 if channel <= 0.04045 else ((channel + 0.055) / 1.055) ** 2.4


def _to_srgb(channel: float) -> float:
    return 12.92 * channel if channel <= 0.0031308 else 1.055 * (channel ** (1 / 2.4)) - 0.055


def hex_to_oklch(value: str) -> tuple[float, float, float]:
    digits = value.lstrip("#")
    linear = [_to_linear(int(digits[i:i + 2], 16) / 255) for i in (0, 2, 4)]
    lms = [math.copysign(abs(c) ** (1 / 3), c) for c in _mv(M1, linear)]
    lightness, a, b = _mv(M2, lms)
    return lightness, math.hypot(a, b), math.degrees(math.atan2(b, a)) % 360


def _linear_rgb(lightness: float, chroma: float, hue: float) -> list[float]:
    a = chroma * math.cos(math.radians(hue))
    b = chroma * math.sin(math.radians(hue))
    return _mv(M1I, [c ** 3 for c in _mv(M2I, [lightness, a, b])])


def oklch_to_hex(lightness: float, chroma: float, hue: float) -> str:
    channels = [min(1.0, max(0.0, _to_srgb(c))) for c in _linear_rgb(lightness, chroma, hue)]
    return "#{:02X}{:02X}{:02X}".format(*(round(c * 255) for c in channels))


def _in_gamut(lightness: float, chroma: float, hue: float) -> bool:
    return all(-1e-4 <= c <= 1 + 1e-4 for c in _linear_rgb(lightness, chroma, hue))


def fit_chroma(lightness: float, chroma: float, hue: float) -> float:
    """Largest chroma at this lightness and hue that still lands inside sRGB."""
    if _in_gamut(lightness, chroma, hue):
        return chroma
    low, high = 0.0, chroma
    for _ in range(40):
        mid = (low + high) / 2
        if _in_gamut(lightness, mid, hue):
            low = mid
        else:
            high = mid
    return low


# --- Ramp shape ---------------------------------------------------------------------------
# darkness d(step), normalised 0 at step 50 to 1 at step 950; relative chroma c(step) as a
# fraction of the family maximum; hue drift dh(step) in degrees relative to step 600. Measured
# from a published, perceptually tuned reference scale after gamut-fitting each step into sRGB.
SHAPE: dict[str, tuple[list[float], list[float], list[float]]] = {
    "neutral": ([0.000, 0.019, 0.064, 0.135, 0.327, 0.503, 0.629, 0.716, 0.825, 0.908, 1.000],
                [0.065, 0.152, 0.283, 0.478, 0.870, 1.000, 0.935, 0.957, 0.891, 0.913, 0.913],
                [-9.4, -9.4, -1.8, -4.4, -0.5, 0.1, 0.0, 0.0, 2.8, 8.5, 7.4]),
    "teal":    ([0.000, 0.044, 0.105, 0.182, 0.293, 0.396, 0.543, 0.669, 0.774, 0.846, 1.000],
                [0.101, 0.366, 0.689, 0.991, 1.000, 0.903, 0.761, 0.643, 0.546, 0.452, 0.330],
                [-4.0, -3.9, -4.3, -3.6, -2.8, -2.2, 0.0, 1.7, 3.5, 3.7, 7.8]),
    "green":   ([0.000, 0.028, 0.080, 0.155, 0.265, 0.362, 0.496, 0.635, 0.746, 0.823, 1.000],
                [0.086, 0.211, 0.402, 0.718, 1.000, 0.963, 0.842, 0.694, 0.569, 0.455, 0.311],
                [6.6, 7.5, 6.8, 5.2, 2.5, 0.4, 0.0, 0.9, 2.1, 3.3, 3.7]),
    "amber":   ([0.000, 0.035, 0.089, 0.153, 0.225, 0.308, 0.453, 0.610, 0.726, 0.809, 1.000],
                [0.125, 0.347, 0.706, 0.976, 1.000, 0.980, 0.936, 0.877, 0.781, 0.659, 0.453],
                [37.0, 37.3, 37.4, 33.3, 26.1, 11.8, 0.0, -9.3, -12.1, -12.4, -12.7]),
    "red":     ([0.000, 0.049, 0.121, 0.229, 0.374, 0.468, 0.553, 0.654, 0.739, 0.806, 1.000],
                [0.055, 0.135, 0.256, 0.461, 0.792, 1.000, 0.994, 0.870, 0.747, 0.595, 0.388],
                [-9.9, -9.6, -9.0, -7.8, -5.1, -2.0, 0.0, 0.2, -0.4, -1.6, -1.3]),
    "blue":    ([0.000, 0.055, 0.128, 0.234, 0.382, 0.504, 0.616, 0.701, 0.794, 0.859, 1.000],
                [0.057, 0.131, 0.240, 0.404, 0.636, 0.832, 1.000, 0.992, 0.812, 0.596, 0.371],
                [-8.3, -7.3, -8.8, -11.1, -8.3, -3.1, 0.0, 1.5, 2.8, 2.6, 5.1]),
}

# Documented anchors. "primary" sets the scale extent and the family chroma maximum.
FAMILIES: dict[str, dict] = {
    "neutral": {"primary": 900, "anchors": {500: "#64748B", 900: "#0F172A"}, "l50": 0.9840},
    "teal":    {"primary": 700, "anchors": {700: "#0F766E"},                 "l50": 0.9840},
    "green":   {"primary": 700, "anchors": {700: "#15803D"},                 "l50": 0.9820},
    "amber":   {"primary": 500, "anchors": {500: "#F59E0B", 700: "#B45309"}, "l50": 0.9870},
    "red":     {"primary": 600, "anchors": {600: "#DC2626"},                 "l50": 0.9710},
    "blue":    {"primary": 600, "anchors": {600: "#2563EB"},                 "l50": 0.9700},
}

PROVENANCE: dict[str, str] = {
    "neutral.500": "v2.1 section 15.1 Muted; retained for borders, prohibited for text",
    "neutral.900": "v2.1 section 15.1 Text",
    "teal.700": "v2.1 section 15.1 Primary",
    "green.700": "v2.1 section 15.1 Success",
    "amber.500": "v2.1 section 15.1 Warning; large-area fill only",
    "amber.700": "measured accessibility correction carrying every warning text, icon and border",
    "red.600": "v2.1 section 15.1 Danger",
    "blue.600": "v2.1 section 15.1 Info",
}

# Documented values that do not sit on a tuned scale step and are kept off-ramp verbatim.
OFF_RAMP: dict[str, tuple[str, str]] = {
    "brand.surface-tint": ("#E7F4F3",
                           "v2.1 section 15.1 Primary Light; supporting backgrounds. Deliberately "
                           "lower chroma than the teal ramp at any step, so it is kept off-ramp "
                           "rather than distorting the ramp to swallow it."),
}

ABSOLUTE: dict[str, str] = {"white": "#FFFFFF", "black": "#000000"}


def build(family: str) -> dict[int, str]:
    darkness, rel_chroma, hue_drift = SHAPE[family]
    config = FAMILIES[family]
    anchors = {step: hex_to_oklch(value) for step, value in config["anchors"].items()}
    anchor_idx = sorted(IDX[s] for s in anchors)
    hue_at = {IDX[s]: anchors[s][2] for s in anchors}
    primary = IDX[config["primary"]]
    l_top = config["l50"]
    l_anchor, c_anchor, _ = anchors[config["primary"]]
    l_bottom = l_top - (l_top - l_anchor) / darkness[primary]
    c_max = c_anchor / rel_chroma[primary]

    ramp: dict[int, str] = {}
    for step in STEPS:
        i = IDX[step]
        if step in anchors:
            lightness, chroma, hue = anchors[step]
        else:
            lightness = l_top - darkness[i] * (l_top - l_bottom)
            below = [j for j in anchor_idx if j < i]
            above = [j for j in anchor_idx if j > i]
            if below and above:
                low, high = below[-1], above[0]
                ratio = (i - low) / (high - low)
                hue = (hue_at[low] + ratio * (hue_at[high] - hue_at[low])) % 360
            else:
                near = below[-1] if below else above[0]
                hue = (hue_at[near] + (hue_drift[i] - hue_drift[near])) % 360
            chroma = fit_chroma(lightness, c_max * rel_chroma[i], hue)
        ramp[step] = oklch_to_hex(lightness, chroma, hue)
    return ramp


def main(argv: list[str]) -> int:
    ramps = {family: build(family) for family in FAMILIES}

    print("UberTib primitive colour ramps - documented anchor reproduction")
    print("=" * 62)
    drift: list[str] = []
    for family, config in FAMILIES.items():
        for step, documented in sorted(config["anchors"].items()):
            produced = ramps[family][step]
            exact = produced.upper() == documented.upper()
            if not exact:
                drift.append(f"{family}.{step}: documented {documented}, produced {produced}")
            print(f"  {'exact' if exact else 'DRIFT':<5} {family}.{step:<4} {documented}"
                  f"  <- {PROVENANCE[f'{family}.{step}']}")
    for name, (value, source) in OFF_RAMP.items():
        print(f"  exact {name:<12} {value}  <- off-ramp, kept verbatim")

    print()
    for family in FAMILIES:
        print(f"  {family:<8}" + " ".join(f"{s}:{ramps[family][s]}" for s in STEPS))

    if drift:
        print("\nFAIL: a documented anchor was not reproduced:")
        for line in drift:
            print("  x " + line)
        return 1
    print("\nOK: every documented anchor reproduced bit-exact.")

    if "--write" in argv:
        colors: dict = {}
        for family in FAMILIES:
            group: dict = {
                "$description": f"{family} ramp, sRGB, derived in OKLCH from the documented anchors",
            }
            for step in STEPS:
                token = {"$type": "color", "$value": ramps[family][step]}
                key = f"{family}.{step}"
                if key in PROVENANCE:
                    token["$description"] = PROVENANCE[key]
                group[str(step)] = token
            colors[family] = group
        for name, (value, source) in OFF_RAMP.items():
            head, leaf = name.split(".")
            colors.setdefault(head, {})[leaf] = {
                "$type": "color", "$value": value, "$description": source}
        for name, value in ABSOLUTE.items():
            colors[name] = {"$type": "color", "$value": value,
                            "$description": "absolute value; never referenced by a component"}
        document = {
            "$description": (
                "UberTib PRIMITIVE colour. Literal colour values live only in this file. A "
                "component never references a primitive; it goes through the semantic layer. "
                "Regenerate with docs/ux/scripts/derive_primitive_ramps.py --write."),
            "color": colors,
        }
        OUT.write_text(json.dumps(document, indent=2) + "\n", encoding="utf-8")
        print(f"wrote {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
