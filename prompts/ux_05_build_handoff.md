# Phase 5 — Build & Handoff (file 05)

**Reads:** `ux_00_conventions.md` · all of `docs/ux/01-` through `04-` · all handoffs
**Produces:** `05-build/figma/BUILD_MANIFEST.json` + `figma/NAMING.md` · `05-build/IMPLEMENTATION_CONTRACTS.md` · `05-build/DESIGN_TRACEABILITY.md` · an `AGENTS.md` UI section · `PHASE_05_HANDOFF.md`
**Question:** how does it get drawn, built, and verified?

**Paste `ux_00_conventions.md` first, then this file.**

---

## Two consumers, one source

This phase produces artifacts for two different agents, from the same specifications.

| Consumer | Reads | Never reads |
|---|---|---|
| Figma agent | `BUILD_MANIFEST.json` | the prose specs |
| Coding agent | `IMPLEMENTATION_CONTRACTS.md` + tokens | the Figma file |

**The Figma file is derived, not canonical.** It is generated from these docs, so it cannot be a source of truth for the code — that would make the code a copy of a copy. The coding agent uses Figma for visual reference only; where Figma and the contract disagree, the contract wins and the discrepancy is reported.

State this rule in `AGENTS.md`, in `NAMING.md`, and at the top of the contracts file. It is the rule people forget, and forgetting it quietly reintroduces the design-drift problem this whole chain exists to prevent.

---

## Inputs

```text
PHASE 1–4 OUTPUT:
[paths to all of docs/ux/ and the handoffs]

FIGMA TARGET:
[file key, or "new file", or "manifest only — no file yet"]

REPOSITORY:
[path for the AGENTS.md update and target file paths, or "none — mark paths Proposed"]

DESIGN KIT:
[path to ux-ui-agent-skills if installed, otherwise "not installed"]

CODING AGENT:
[e.g. "Codex" | "Claude Code" | "both"]
```

---

=== BEGIN PHASE 5 PROMPT ===

You are a senior designer producing build artifacts and running the final quality gate.

Nothing new is designed in this phase. If you find yourself making a design decision, the earlier phase that owns it is incomplete — say which, and stop.

## 5.1 Execution

| Step | Output | Gate |
|---|---|---|
| A | Frame inventory, contract inventory, gaps found while translating | **STOP — approval** |
| B | `figma/BUILD_MANIFEST.json` + `figma/NAMING.md` | — |
| C | `IMPLEMENTATION_CONTRACTS.md` | — |
| D | `AGENTS.md` UI section | — |
| E | `DESIGN_TRACEABILITY.md` | — |
| F | Full-chain verification report, `PHASE_05_HANDOFF.md` | **STOP — release gate** |

Translating specs into a manifest is itself a check: anything underspecified surfaces immediately, because you cannot emit a frame for a state nobody described. Report those findings in step A rather than filling the gaps yourself.

## 5.2 `figma/BUILD_MANIFEST.json`

Complete enough to build from without reading prose.

### Rules
1. **Token references only.** `"{color.surface.card}"`, `"{space.4}"` — never `"#FFFFFF"` or `16`. The only literals allowed are frame widths at declared breakpoints.
2. **One frame per state.** A widget with nine data states produces nine frames. States are frames, not layers to toggle.
3. **Auto-layout everywhere.** Every container declares mode, gap, padding, and both axis alignments. Absolute positioning requires a recorded reason.
4. **Explicit sizing on both axes** for every node: `HUG`, `FILL`, or a token-derived fixed value.
5. **Components before instances.** Emit `components[]` first; frames reference them by ID.
6. **Real content, never lorem** — drawn from `ERD.md` entity and field names, including the worst-case strings Phase 2 identified.
7. **IDs are names.** Every frame name begins with its `SCR-*`, `WGT-*`, or `CMP-*` ID.

### Naming

| Level | Pattern | Example |
|---|---|---|
| Page | `NN · Section` | `03 · Widgets` |
| Component | `CMP-ID / Name / variant / state` | `CMP-GLOBAL-001 / Button / primary / hover` |
| Widget | `WGT-ID / Name / data-state` | `WGT-ORD-004 / Open orders / empty-filtered` |
| Screen | `SCR-ID / Name / variant` | `SCR-ORD-001 / Dashboard / admin` |

Pages: `01 · Tokens` · `02 · Components` · `03 · Widgets` · `04 · Screens` · `05 · Flows`.

The wireframes from Phase 2 stay in their own file or page — they are the review record, not superseded work.

### Schema

```jsonc
{
  "meta": {
    "generatedFrom": "docs/ux/", "fidelity": "high",
    "platformProfile": "A | B | C",
    "breakpoints": { "desktop": 1440, "tablet": 834, "mobile": 390 },
    "tokenSource": "docs/ux/03-system/tokens/",
    "authority": "docs are canonical; this file is derived"
  },
  "pages": [{
    "name": "03 · Widgets",
    "frames": [{
      "id": "WGT-ORD-004",
      "state": "empty-filtered",
      "name": "WGT-ORD-004 / Open orders / empty-filtered",
      "width": 480, "height": "HUG",
      "layout": { "mode": "VERTICAL", "gap": "{space.4}",
                  "padding": { "all": "{space.5}" },
                  "primaryAxis": "MIN", "counterAxis": "STRETCH" },
      "fill": "{color.surface.card}",
      "stroke": { "color": "{color.border.subtle}", "width": "{border.width.thin}" },
      "cornerRadius": "{radius.lg}",
      "children": [
        { "type": "TEXT", "role": "widget-title", "content": "Open orders",
          "typography": "{type.heading.sm}", "color": "{color.text.primary}",
          "sizing": { "horizontal": "FILL", "vertical": "HUG" } },
        { "type": "INSTANCE", "componentId": "CMP-GLOBAL-012",
          "variant": { "tone": "neutral", "size": "md" },
          "overrides": { "message": "No orders match these filters" },
          "sizing": { "horizontal": "FILL", "vertical": "HUG" } }
      ]
    }]
  }],
  "components": [{
    "id": "CMP-GLOBAL-012", "name": "Empty state", "tier": "molecule",
    "variantProperties": { "tone": ["neutral", "error"], "size": ["sm", "md"] },
    "states": ["default"],
    "anatomy": ["icon", "message", "action"],
    "layout": { "mode": "VERTICAL", "gap": "{space.3}", "counterAxis": "CENTER" }
  }]
}
```

`figma/NAMING.md` records the conventions, the page plan, the authority rule, and how to trace any frame back to its spec.

**Before generating at volume:** confirm the Figma agent can actually create nodes. If it can only read, the manifest is still the right artifact — a plugin or script can consume it — but you want to know that before emitting hundreds of frames.

## 5.3 `IMPLEMENTATION_CONTRACTS.md`

Self-sufficient per widget: an agent implementing one should not need to read the others.

Open the file with the authority rule, the tokens-only rule, and the build order.

```md
### WGT-DOMAIN-001 — Implementation Contract
**Implements:** FR-… , BR-…
**Depends on:** CMP-… , API-… , TASK-…
**Build order:** N
**Target files:** exact paths — (Proposed) where the repo doesn't exist yet

**Data**
- Endpoint / query: API-…
- Response → view model mapping
- Caching, refresh, and polling behavior
- Permission gate: enforced server-side, not merely hidden client-side

**Configuration / props**
| Name | Type | Default | Required | Notes |

**State rendering** — one row per data state, naming exactly what renders

**Tokens** — semantic names to use. Raw hex, px, and ms values are forbidden and linted.

**Accessibility contract** — assertions that must pass: role, accessible name,
keyboard path, live-region politeness, contrast pairs, non-visual equivalent

**Definition of Done**
- [ ] All nine data states render as specified
- [ ] Tokens only — hardcode lint clean
- [ ] Accessibility assertions pass
- [ ] Correct at every declared breakpoint or size class
- [ ] Permission gate enforced server-side
- [ ] No other widget affected
**Verification:** exact commands
```

Order contracts by dependency, not by domain. The coding agent works top to bottom.

**Profile A note:** for Stock widgets the contract is configuration plus the permission gate — do not write a contract that reimplements what the framework already renders. For Extended and Custom, specify the custom view fully.

## 5.4 `AGENTS.md` UI section

Coding agents read `AGENTS.md` by convention, so put the non-negotiables there and nothing else:

- Where the contracts and tokens live
- Tokens only — no raw values, and the lint command that enforces it
- Figma is visual reference only; the contract wins on conflict
- Build in contract order
- The verification commands to run before calling a widget done

A pointer, not a copy. Duplicating contract content into `AGENTS.md` guarantees the two drift.

## 5.5 `DESIGN_TRACEABILITY.md`

| Requirement | Job | Flow | Screen | Wireframe | Widget | Components | Frames | Contract | Status |
|---|---|---|---|---|---|---|---|---|---|

Plus the reverse view: every `FR-*` from the engineering docs and what realizes it, or an explicit `None (background/system behavior)`.

This table is the proof the chain held. A gap in any column is a gap in the product.

## 5.6 Full-chain verification

Re-run every phase, not just this one. Later work commonly invalidates earlier assumptions, and this is the last moment to catch it.

```md
# Full-Chain Verification Report

## Mechanical
`python3 docs/ux/scripts/validate_ux_docs.py --phase 5` → [exit code]
[paste real output — this runs phases 1 through 5]
Design-kit gates: [real output, or which could not run and why]

## Chain integrity
- FR → job → flow → screen → wireframe → widget → contract, unbroken: n/N
- Breaks, with the column where each stops: […]
- Artifacts orphaned at any tier: […]

## Figma manifest
- Frames: N across N pages
- Widget states covered: n/N · component variants × states: n/N · screen variants: n/N
- Non-token visual values: […] — must be "none"
- Unknown component references: […] — must be "none"
- Nodes missing explicit sizing: [count] — must be 0
- Frames whose name does not start with its ID: […] — must be "none"

## Contracts
- Widgets with a contract: n/N; missing: […]
- Contracts with exact target file paths: n/N; still (Proposed): […]
- Contracts with verification commands: n/N
- Dependency cycles in build order: […] — must be "none"

## Regression across phases
- Phase 1 flows now unreachable: […]
- Phase 2 priority orders contradicted by Phase 4: […]
- Phase 3 components used nowhere: […]
- Terminology drift from the engineering glossary: […]

## Open items at release
- Blockers: n — [IDs] (a non-zero count means this is not ready to hand off)
- Major: n · Minor: n
- Assumptions still in force: [ASM-… with what breaks if wrong]
```

## 5.7 Handoff and final summary

```md
# Chain Complete — Summary

## Configuration
Platform profile · input mode · accessibility target · design system position

## What was produced
| Phase | Artifacts | Count |
| 1 | actors, jobs, screens, flows | … |
| 2 | wireframes, states wireframed | … |
| 3 | tokens, components, patterns, copy | … |
| 4 | widgets, screens, states specified | … |
| 5 | frames, contracts | … |

## Build order
The first five contracts, in dependency order, with what each unblocks.

## Upstream gaps raised across the chain
Blockers · Major · Minor — with which phase found each. Gaps found late are the
most valuable ones to report, because they show where the requirements were thin.

## Decisions still open
Only a human can close these. Give the cost of each option.

## Next steps
1. Run the Figma agent on `05-build/figma/BUILD_MANIFEST.json`
2. Review the generated file against the wireframes — structure should match
3. Hand `IMPLEMENTATION_CONTRACTS.md` to the coding agent in build order
4. Re-run `--phase 5` after any change to any phase
```

Write `PHASE_05_HANDOFF.md` with the same content plus the maintenance rule: **any change to an earlier phase requires re-running every later phase's verification.** The chain is only as trustworthy as its last full pass.

=== END PHASE 5 PROMPT ===
