# UX Chain — Shared Conventions (file 00)

The kernel every phase prompt depends on. **Paste this file first, then the phase prompt.** It exists so the rules live in one place and cannot drift between phases.

## The chain

| # | Phase | Question it answers | Prompt file |
|---|---|---|---|
| — | Engineering docs | What does the product do? | `ai_project_docs_generation_prompt_v4.md` |
| 1 | Discovery, IA & Flows | Who uses this, where does everything live, how do people move through it? | `ux_01_discovery_ia_flows.md` |
| 2 | Wireframes | What is on each screen, and what matters most? | `ux_02_wireframes.md` |
| 3 | Design System | What is everything made of? | `ux_03_design_system.md` |
| 4 | Widget & Screen Specs | Exactly how does each piece behave? | `ux_04_widget_screen_specs.md` |
| 5 | Build & Handoff | How does it get drawn, built, and verified? | `ux_05_build_handoff.md` |

Each phase reads the previous phase's outputs plus a `PHASE_0N_HANDOFF.md`. **Every phase ends at a human gate.** Skipping a gate to save time moves the cost downstream at a worse exchange rate: a wrong flow costs an afternoon at Phase 1 and three weeks at Phase 5.

Architecture and system design in the engineering sense — services, data model, API design — belong to the master prompt's `SDD.md`, not to this chain. "System design" here means the *design system*: tokens, components, patterns.

## Output tree

```text
docs/ux/
├── README.md                          index, maintained from Phase 1 onward
├── PHASE_01_HANDOFF.md … PHASE_05_HANDOFF.md
├── 01-foundation/   UX_FOUNDATION.md · INFORMATION_ARCHITECTURE.md · USER_FLOWS.md · UPSTREAM_GAPS.md
├── 02-wireframes/   WIREFRAMES.md · wireframe-manifest.json
├── 03-system/       DESIGN_TOKENS.md · tokens/*.json · COMPONENT_INVENTORY.md ·
│                    INTERACTION_PATTERNS.md · CONTENT_GUIDE.md · ACCESSIBILITY.md
├── 04-specs/        WIDGET_SPECS.md · SCREEN_SPECS.md · RESPONSIVE.md
├── 05-build/        figma/BUILD_MANIFEST.json · figma/NAMING.md ·
│                    IMPLEMENTATION_CONTRACTS.md · DESIGN_TRACEABILITY.md
└── scripts/validate_ux_docs.py        written in Phase 1, rerun at every gate
```

---

=== BEGIN CONVENTIONS ===

## C1. Prime Directive

**You may not invent product behavior.** The engineering docs define what the product does. You define how it is structured, presented, and experienced.

| Situation | What you produce |
|---|---|
| Missing product behavior | `Q-<DOMAIN>-###` with severity |
| Two sources imply different UI truth | `CONFLICT-<DOMAIN>-###` |
| A presentation choice the docs are silent on, carrying no product meaning | A recorded design decision — allowed |
| A temporary interpretation you needed to proceed | `ASM-<DOMAIN>-###` |

Adding an export button because dashboards usually have one is inventing product behavior. Deciding where that button sits is design. Stay on the right side of the line, in every phase.

## C2. Authority chain

1. **Engineering docs** — canonical for behavior, data, permissions, errors
2. **This chain's outputs** — canonical for structure, presentation, interaction
3. **Tokens** — canonical for style
4. **Figma** — *derived*. Generated from Phase 5's manifest. Authoritative over nothing.

A human edit made directly in Figma is back-ported into these docs or lost at the next regeneration. Coding agents read the contracts, never the Figma file, for behavior.

## C3. Platform profile

Declared once in Phase 1, carried in every handoff, and never re-litigated downstream.

- **Profile A — Admin panel framework** (Filament, Nova, Django Admin, Retool). Most UI is framework-imposed. Specify configuration and targeted custom views, not free-form layout. Classify each unit **Stock / Extended / Custom**. Verify framework API names against the installed version before writing them into a spec. Never design what the framework won't let you change — record the cost and raise it as a decision.
- **Profile B — Web framework** (React, Vue, Next, Svelte…). Full layout, component, and responsive authority.
- **Profile C — Native or cross-platform app** (SwiftUI, Flutter, Compose, RN). **No hover state — emit no hover rows.** Press, long-press, swipe instead. Platform navigation paradigms, platform touch minimums, platform text scaling, safe areas. Extra states: offline, background-refresh, pull-to-refresh, permission-prompt.

Emitting a specification that does not apply to the declared profile is a defect, caught at every verification gate.

## C4. Identifiers

Inherited from the engineering docs, never reassigned: `FR-*` `BR-*` `NFR-*` `API-*` `ERR-*` `SCR-*` and the domain list.

| Artifact | ID | Introduced |
|---|---|---|
| Task flow | `FLOW-<DOMAIN>-###` | Phase 1 |
| Screen (when deriving) | `SCR-<DOMAIN>-###` | Phase 1 |
| Wireframe | `WF-<DOMAIN>-###` | Phase 2 |
| Component | `CMP-<DOMAIN\|GLOBAL>-###` | Phase 3 |
| Interaction pattern | `IX-###` | Phase 3 |
| Content string | `TXT-<DOMAIN>-###` | Phase 3 |
| Accessibility requirement | `A11Y-###` | Phase 3 |
| Widget | `WGT-<DOMAIN>-###` | Phase 4 |

`Q-*`, `ASM-*`, `CONFLICT-*` use the **shared** register and the shared registry in `docs/README.md`. Allocate from `max + 1` per domain. **Numbering is append-only across all phases and all runs.** Never renumber, reuse, or repurpose.

## C5. Severity

| Severity | Test | Behavior |
|---|---|---|
| **Blocker** | The artifact cannot be produced without an answer | Don't produce it. Mark `Blocked`. Raise at the phase gate. |
| **Major** | Producible, but another answer changes structure | Proceed under a documented `ASM-*`; flag what it affects. |
| **Minor** | Wording or a reversible detail | Proceed under `ASM-*`; note and move on. |

**Halt** at the current gate if more than ~30% of the phase's artifacts are Blocked, or if any Blocker touches the role model, the data model, or navigation structure.

## C6. Execution protocol

1. **One file per response.** If it won't fit, end with `--- CONTINUED ---` and resume. Never truncate, abbreviate, or write "the rest follow the same pattern."
2. Announce the file path and phase before writing.
3. Never write a downstream artifact before its upstream source exists.
4. Stop at a file boundary if you run out of room and report exactly what remains.
5. End every phase with the handoff block (C9) and the verification report (C8).

**Size budgets.** Exceeding one means the content belongs at a different level, not that the budget should stretch.

| Item | Budget |
|---|---|
| `docs/ux/README.md` | ≤ 150 lines |
| Each flow | ≤ 40 lines + diagram |
| Each wireframe | ≤ 50 lines |
| Each `CMP-*` | ≤ 30 lines |
| Each `IX-*` | ≤ 20 lines |
| Each `WGT-*` | ≤ 90 lines |
| Each screen spec | ≤ 60 lines |

## C7. Token discipline

From Phase 3 onward, every colour, space, radius, duration, and type size is a **semantic token reference**. A raw hex, px, or ms value in any document is a defect — the sole exception is the primitive tier inside `DESIGN_TOKENS.md` and `tokens/*.json`, where raw values are the point.

Three tiers: primitive (raw palette) → semantic (purpose) → component (scoped). Dark mode swaps semantic tokens; primitives do not change.

**Phase 2 is the inverse:** wireframes carry *no* colour, type, or brand at all. Grey-box only. Fidelity discipline runs both directions.

## C8. Verification — evidence, not assertions

Every phase ends with a report that gives counts and **names every failing item**. "All checks passed" without numbers is not an acceptable answer. Run the validator and paste real output; if it could not run, say so and why.

```
python3 docs/ux/scripts/validate_ux_docs.py --phase N
```

The validator is written once in Phase 1 (Appendix A) and rerun with a higher `--phase` at every subsequent gate, so earlier phases stay verified as later work lands.

## C9. Handoff block

Every phase writes `docs/ux/PHASE_0N_HANDOFF.md` and repeats it in the final response.

```md
# Phase N Handoff
**Platform profile:** A | B | C
**Input mode:** Docs-Complete | Docs-Partial | Existing-UI
**Files produced:** …
**IDs allocated this phase:** FLOW-ORD-001..006, SCR-ORD-001..004
**Decisions made (do not re-open downstream):** …
**Assumptions in force:** ASM-… — what breaks if wrong
**Blockers carried forward:** Q-… / CONFLICT-… with severity
**Phase N+1 must read:** …
**Phase N+1 must NOT re-decide:** …
```

The last line matters most. It is what stops Phase 4 from quietly redrawing Phase 2's layout.

## C10. Input mode

Declared in Phase 1, carried throughout.

- **Docs-Complete** — full `docs/` including a screen inventory. Inherit `SCR-*` unchanged; a needed split is a `Q-*`.
- **Docs-Partial** — derive from evidence in this order: `PERMISSIONS_MATRIX.md` → `STATE_MACHINES.md` → `FR-*` acceptance criteria → `API_CONTRACTS.md` → `ERD.md`. Mark everything `Derived — pending confirmation`.
- **Existing-UI** — inventory the implementation before proposing anything. In Profile A, the framework's resource, form, and table definitions *are* the inventory; read them rather than re-deriving. Classify Existing / Change required / New with a reason. Existing conventions win unless a requirement or the accessibility target overrides them.
- **Docs-Absent** — **stop.** Design built on undocumented behavior encodes guesses as specifications. Recommend the master prompt first.

## C11. Mermaid

Only `flowchart TD`, `flowchart LR`, `stateDiagram-v2`, `journey`. Alphanumeric node IDs with underscores; display text in quoted labels: `SCR_ORD_001["Order list"]`. No HTML, no `<br>`, no styling directives. One diagram per fence.

## C12. Design kit integration

If ux-ui-agent-skills is installed, read its `CLAUDE.md` router and `CONTEXT.md` vocabulary and match its formats so its validators accept the output. Verify script names against the installed version rather than assuming.

| Phase | Kit skill |
|---|---|
| 2 | `/prototype` — fidelity ladder guidance |
| 3 | `/apply-aesthetic`, `/design-tokens`, `/design-component`, `/ux-writing` |
| 4 | `/design-component` at organism tier |
| 5 | `/a11y-audit`, `/design-review`, optionally `/design-code` for a reference implementation |

Use the kit's gates rather than inventing parallel checks: token validity, contrast in light and dark, component-spec completeness, no-hardcoded-values. If the kit is absent, keep the discipline manually and say which checks were unautomated.

=== END CONVENTIONS ===
