# UberTib Design Tokens — source of truth

DTCG-format token source for all three platforms. **This directory is the only place a literal
design value may live.** Narrative, rationale and measured results are in
`../DESIGN_TOKENS.md`; the visual direction these tokens serve is in `../DESIGN_DIRECTION.md`.

## Why the tokens live here and not in the repository-root `tokens/`

The design kit at the repository root ships `scripts/validate_tokens.py` and
`scripts/validate_contrast.py`, and both hardcode the root `tokens/` directory with no argument.
Run against this product, they report a green result for the **kit's demonstration tokens**, not
for UberTib. Anyone quoting their output as evidence about UberTib is quoting the wrong file.

So the UberTib source lives inside the phase that owns it, and Phase 3 ships its own gate that
runs the same checks — and several the kit does not have — against this path:

```bash
python docs/ux/scripts/validate_ux_tokens.py
```

The root `tokens/` directory stays as the kit's reference material and is never presented as
this product's.

## Layers

```
primitive.*.json   ramps and scales. The only files carrying literal values.
                   Never referenced by a component.
semantic.json      purpose aliases: surface, text, border, action, focus, tone, state,
                   plus type, space, size, radius, elevation and opacity roles.
                   Plus the dark compatibility override map. It is retained for future compatibility and is not a V1 shipping-mode commitment.
semantic.state.json  the state channel: every lifecycle status as a tone/icon/emphasis triple.
component.json     component-scoped tokens. 22 allocated component groups, Phase 4 complete.
```

A literal value outside a `primitive.*` file or a group named `primitive` fails the gate. A
component token that reaches a primitive directly fails the gate.

## Files

| File | Holds |
|---|---|
| `primitive.color.json` | Six 11-step ramps plus the off-ramp brand tint and the absolutes. Generated. |
| `primitive.type.json` | Family stacks, size scale, weights, line heights, the single tracking value, measure. |
| `primitive.space.json` | Space, control and target sizes, icon sizes, radii, border widths, elevation, opacity. |
| `semantic.json` | Every purpose alias, light, plus the `dark` override map. |
| `semantic.state.json` | 18 machines, 82 statuses, 36 governed icons, four emphasis treatments, two work-item flags. |
| `component.json` | The component-tier contract. 22 allocated component groups, Phase 4 complete. |
| `motion.json` | Duration and easing primitives, six transition presets, the reduced-motion strategy. |
| `density.json` | Three density modes and the two floors no mode may cross. |
| `breakpoints.json` | Two separate responsive scales — Profile C size classes, Profile A content grid. |

## Regenerating the colour primitives

`primitive.color.json` is generated, not hand-edited:

```bash
python docs/ux/scripts/derive_primitive_ramps.py --write
```

Every documented brand value is an anchor and is reproduced bit-exact; the script exits non-zero
if any anchor drifts. To change a brand colour, change its anchor in that script and regenerate —
editing the JSON by hand puts the two out of step silently.

## Changing a token

1. Change it at the **lowest layer that is actually wrong**. A colour that is wrong everywhere is
   a primitive change; a colour that is wrong in one role is a semantic change.
2. Run the gate. It fails on an unresolved alias, a literal in the wrong layer, a missing dark
   override, an incomplete status triple, an icon outside the governed set, and any required
   contrast pair below WCAG 2.2 AA in either mode.
3. If you added a semantic colour, add its dark override in the same commit. The gate requires it.

## What the gate does and does not prove

It proves token-level correctness: the source parses, every alias resolves, the layering holds,
every one of the 82 statuses carries a complete triple, and every required contrast pair meets
WCAG 2.2 AA in the V1 light mode and in the retained dark compatibility override map.

It does **not** prove that a rendered screen is accessible. Screen-reader announcement, focus
order, keyboard completeness, forced-colours survival and whether two statuses are genuinely
distinguishable without colour all need a running interface, and are verified in Phase 5. No
conformance claim follows from a green gate here.
