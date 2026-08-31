# UberTib UX Documentation — Start Here

**Chain phase:** 2 of 5 complete — Grey-box Wireframes  
**Baseline:** 2026-08-26  
**Phase 1 baseline:** 19 UI-bearing actors · 69 JTBDs · 165 screens · 103 flows  
**Phase 2 baseline:** 165/165 screens mapped to `WF-*` wireframes — Patient 47 · Clinic 56 · Admin 62  
**Validator:** `python docs/ux/scripts/validate_ux_docs.py --phase 2`

## Authority chain

1. Canonical engineering/product behavior: `docs/PRD.md`, `docs/SDD.md`, `docs/domain/*`, `docs/api/*`, `docs/database/*`.
2. Product Owner decisions under `.spec/decisions/`, including the UX reconciliation and Syria catalog/pricing governance decisions.
3. Phase 1 UX owns actors, JTBDs, IA, screen inventory and flows.
4. Phase 2 UX owns grey-box structure, hierarchy and interaction shape.
5. Phase 3 will own design-system tokens/components/copy obligations; Phase 4 screen/widget specs; Phase 5 build handoff.

Figma is derived and never overrides canonical product behavior.

## Platform profiles

| Platform | Runtime | Profile | Screens / WF |
|---|---|---|---:|
| Patient app | React Native, `/api/v1` | C — native/mobile-first | 47 |
| Clinic / Doctor | Filament panel | A — admin panel | 56 |
| Admin | Filament panel | A — admin panel | 62 |

Patient UX is Arabic-first/RTL, smartphone-first and resilient to weak connectivity. Clinic/Admin are desktop-first operational panels. The three are not the same interface at different widths.

## Reading order

1. `PHASE_01_HANDOFF.md`
2. `01-foundation/UX_FOUNDATION.md`
3. `01-foundation/INFORMATION_ARCHITECTURE.md`
4. `01-foundation/USER_FLOWS.md`
5. `01-foundation/UPSTREAM_GAPS.md`
6. `02-wireframes/WIREFRAMES.md`
7. platform wireframe files under `02-wireframes/`
8. `02-wireframes/wireframe-manifest.json`
9. `PHASE_02_HANDOFF.md`
10. `03-system/PHASE_03_IMPLEMENTATION_PLAN.md`
11. `03-system/DESIGN_DIRECTION.md`
12. `03-system/DESIGN_TOKENS.md` and `03-system/design_tokens/`
13. `03-system/COMPONENT_INVENTORY.md`, then `_PLATFORM` and `_DOMAIN`
14. `03-system/WIREFRAME_COMPONENT_MAP.md`
15. `03-system/INTERACTION_PATTERNS.md`, then `_DOMAIN`

Coding agents must not treat Phase 2 as final UI styling or implementation contracts. Phase 5 remains the coding handoff owner.

## Phase status

| Phase | Artifacts | Status |
|---|---|---|
| 1 — Discovery, IA, Flows | `01-foundation/*` | Complete |
| 2 — Wireframes | `02-wireframes/*`, `PHASE_02_HANDOFF.md` | **Complete — awaiting gate approval** |
| 3 — Design System | `03-system/*` | **In progress — Session 4 of 7 complete.** Direction, tokens, the 22 `CMP-*` and the 26 `IX-*` are fixed, and all 165 `WF-*` are bound to components. Content (`TXT-*`) and accessibility (`A11Y-*`) not started. |
| 4 — Widget and Screen Specs | `04-specs/*` | Not started |
| 5 — Build and Handoff | `05-build/*` | Not started |

## Phase 2 coverage and IDs

`WF-*` is allocated one-to-one to the current `SCR-*` numeric suffixes across the same domain. Example: `SCR-CLINICAL-010` → `WF-CLINICAL-010`. This preserves traceability and avoids a second unrelated numbering scheme.

Current highest `WF-*` per domain therefore matches the current `SCR-*` registry:

| Domain | WF | Domain | WF |
|---|---:|---|---:|
| IDENTITY | 038 | FINANCE | 012 |
| ELIG | 023 | REVIEWS | 009 |
| CLINICAL | 019 | CATALOG | 011 |
| BOOKING | 017 | PLATFORM | 009 |
| CLAIMS | 013 | OPS | 006 |
| POLICY | 004 | AUDIT | 004 |

Total wireframes: **165**. No Phase 2-only screen was introduced.

## Phase 2 structural decisions

- Patient discovery uses understandable service families, not a flat professional procedure-code list.
- Internal `P`, `I`, calibration math and service-risk codes do not become Patient UI.
- Treatment-plan authoring keeps required structured lines while reducing repeated entry through search/recent choices, provider-price defaults, automatic unit/inclusion population, quantity defaults, duplicate/quick-add and progressive disclosure.
- Market-observation entry keeps required provenance while using a desktop grid, sticky defaults, source reuse, duplicate row, batch import and keyboard-oriented entry.
- Configurable catalog/pricing/clinical behavior is shown as governed/versioned data. Clinical publication retains licensed-review gates.
- Retryable evidence-transfer failure and authoritative evidence rejection are structurally distinct.
- Accepted treatment and financial snapshots remain historical/immutable.
- Eligibility suspension removes attendance/start/completion actions structurally; no UI override is designed.
- Guardian authorization revocation remains reachable regardless of booking state.
- A pending reschedule never replaces the original confirmed appointment before counterparty acceptance and revalidation.

## Open dependencies carried forward

- `Q-PLATFORM-003` — **Resolved** by `PO-UX-17` for the provider-neutral evidence-transfer interaction contract and eight session states.
- Concrete OTP/MFA, malware-scanning, private-storage, notification and related infrastructure vendor selection is tracked only by `Q-OPS-001` and is not a UX blocker.
- `Q-CATALOG-001` and `Q-ELIG-001` remain narrowed clinical-production dependencies requiring licensed dental review; they do not block wireframe structure.
- `Q-PLATFORM-002` remains legal/compliance work for final retention periods.
- `Q-PLATFORM-001` blocks only a claim of complete readable-SRS reconciliation.

No product behavior was invented to close the remaining clinical questions.

## Phase 3 carry-forward obligations

Phase 3 must preserve structure while defining final component taxonomy, tokens and copy. In particular:

- alternative expiry/decline must not sound like cancellation of a previously confirmed appointment;
- `ELIGIBILITY_REVIEW` requires neutral Patient wording;
- retryable upload/network failure must not look like evidence rejection;
- internal classification/calibration/risk vocabulary must be hidden or translated into practical Patient meaning.

## Verification

Run cumulative validation at the current gate:

```bash
python docs/scripts/validate_docs.py
python docs/ux/scripts/validate_ux_docs.py --phase 2
python docs/ux/scripts/validate_ux_tokens.py
python scripts/check_no_emoji.py
```

`docs/ux/scripts/build_component_tokens.py` regenerates `design_tokens/component.json` from the
Token mapping blocks in the component inventory, so the narrative and the token source cannot
drift. Run it after editing any component's token mapping.

The UX validator stays pinned at `--phase 2` until Phase 3 Session 7. Flipping it earlier would
turn known, expected, not-yet-authored Phase 3 obligations into a red build on every unrelated
documentation change.

The token gate is additive and passes now. It runs against
`docs/ux/03-system/design_tokens/`, **not** the repository-root `tokens/` directory: the design
kit's own token and contrast scripts hardcode that root path and would report a green result for
the kit's demonstration tokens rather than for this product.
