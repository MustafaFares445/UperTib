# -*- coding: utf-8 -*-
"""Build design_tokens/component.json from the Token mapping fences in the two
COMPONENT_INVENTORY block files, so the narrative and the token source cannot drift.

Tone-parameterised roles cannot be concrete aliases: <tone> is resolved at render time from
the status triple. Those lines become one state-triple-binding entry listing the semantic tone
roles the component consumes, which is what the component contract's required-groups asks for.
"""
import collections
import json
import re
from pathlib import Path

BASE = Path(r"C:\laragon\www\UberTip\docs\ux\03-system")
FILES = ["COMPONENT_INVENTORY_PLATFORM.md", "COMPONENT_INVENTORY_DOMAIN.md"]
TARGET = BASE / "design_tokens" / "component.json"

TYPE_BY_PREFIX = [
    ("semantic.color.", "color"),
    ("semantic.type.", "typography"),
    ("semantic.space.", "dimension"),
    ("semantic.size.", "dimension"),
    ("semantic.radius.", "dimension"),
    ("semantic.border.", "dimension"),
    ("semantic.focus.", "dimension"),
    ("semantic.elevation.", "shadow"),
    ("semantic.opacity.", "number"),
    ("semantic.motion.", "transition"),
]


def dtcg_type(target):
    for prefix, kind in TYPE_BY_PREFIX:
        if target.startswith(prefix):
            return kind
    raise AssertionError("no $type for " + target)


names = {}
groups = collections.OrderedDict()

for fname in FILES:
    text = (BASE / fname).read_text(encoding="utf-8")
    parts = re.split(r"(?m)^### (CMP-[A-Z]+-\d+) . (.+?)$", text)
    i = 1
    while i < len(parts):
        cid, title, body = parts[i], parts[i + 1].strip(), parts[i + 2]
        slug = cid[len("CMP-"):].lower()
        names[cid] = (title, fname)
        m = re.search(r"\*\*Token mapping\*\*\s*\n\s*```(.*?)```", body, re.S)
        assert m, cid
        concrete = collections.OrderedDict()
        tone_roles = []
        for line in m.group(1).strip().splitlines():
            line = line.strip()
            if not line:
                continue
            path, value = line.split(None, 1)
            value = value.strip()
            assert path.startswith("component." + slug + "."), (cid, path)
            assert value.startswith("{") and value.endswith("}"), (cid, line)
            prop = path[len("component." + slug + "."):]
            target = value[1:-1]
            if "<tone>" in target:
                tone_roles.append(target[len("semantic.color."):].replace("<tone>", "*"))
                continue
            assert target.startswith("semantic."), (cid, target)
            concrete[prop] = (target, value)
        groups[cid] = (slug, concrete, tone_roles)
        i += 3

existing = json.loads(TARGET.read_text(encoding="utf-8"),
                      object_pairs_hook=collections.OrderedDict)

doc = collections.OrderedDict()
doc["$schema"] = "https://design-tokens.github.io/community-group/format/"
doc["$description"] = (
    "UberTib COMPONENT layer. One group per allocated CMP-*, written in Session 3 alongside "
    "COMPONENT_INVENTORY.md so a component and its tokens are never allocated apart. Every value "
    "is transcribed from that component's own Token mapping block by "
    "docs/ux/scripts/build_component_tokens.py, so the narrative and the source cannot drift. "
    "A component token resolves to the semantic layer and nothing else; the gate fails one that "
    "reaches a primitive directly."
)
doc["contract"] = existing["contract"]

comp = collections.OrderedDict()
comp["$description"] = (
    "22 allocated groups. Framework-owned controls - button, input, select, checkbox, radio, "
    "toggle, date picker, modal shell, drawer, popover, toast, banner, notification, avatar, "
    "badge, tag, tabs, breadcrumb, card and navigation chrome - deliberately have NO group here. "
    "Profile A takes them from Filament as shipped and Profile C from React Native primitives; "
    "both are bound by the semantic layer, the eight required states and the accessibility "
    "obligations. Defining bespoke tokens for them would be phase bleed into implementation."
)

for cid, (slug, concrete, tone_roles) in groups.items():
    title, fname = names[cid]
    g = collections.OrderedDict()
    g["$description"] = "%s - %s. Contract block: %s." % (cid, title, fname)
    for prop, (target, value) in concrete.items():
        g[prop] = collections.OrderedDict([("$type", dtcg_type(target)), ("$value", value)])
    if tone_roles:
        g["state-triple-binding"] = collections.OrderedDict([
            ("$type", "string"),
            ("$value", ",".join(sorted(set(tone_roles)))),
            ("$description",
             "Tone-parameterised roles. The tone is resolved at render time from "
             "state.<machine>.<STATUS>.tone, one of the six governed tones, and the component "
             "consumes the triple WHOLE: a component that takes a tone without also taking the "
             "icon and the emphasis is a defect, because the state channel exists so that a "
             "colour-only status is structurally impossible."),
        ])
    comp[slug] = g

doc["component"] = comp
TARGET.write_text(json.dumps(doc, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

n_concrete = sum(len(v[1]) for v in groups.values())
n_tone = sum(1 for v in groups.values() if v[2])
print("groups: %d   concrete tokens: %d   tone-bound groups: %d"
      % (len(groups), n_concrete, n_tone))
