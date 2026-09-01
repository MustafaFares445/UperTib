# UberTib UX Documentation — Start Here

**Chain phase:** 4 of 5 complete — Widget and Screen Specifications  
**Baseline:** 2026-09-01  
**Phase 1 baseline:** 19 UI-bearing actors · 69 JTBDs · 165 screens · 103 flows  
**Phase 2 baseline:** 165/165 screens mapped to `WF-*` wireframes — Patient 47 · Clinic 56 · Admin 62  
**Phase 3 baseline:** 22 `CMP-*` · 26 `IX-*` · 60 `TXT-*` · 40 `A11Y-*` · 18 lifecycle machines / 82 statuses · 21/21 `ERR-*`  
**Phase 4 baseline:** 30 `WGT-*` · 165/165 screens specified · every `CMP-*`, `IX-*`, `TXT-*` and `A11Y-*` placed  
**Validator:** `python docs/ux/scripts/validate_ux_docs.py --phase 4`

## Authority chain

1. Canonical engineering/product behavior: `docs/PRD.md`, `docs/SDD.md`, `docs/domain/*`, `docs/api/*`, `docs/database/*`.
2. Product Owner decisions under `.spec/decisions/`, including the UX reconciliation and Syria catalog/pricing governance decisions.
3. Phase 1 UX owns actors, JTBDs, IA, screen inventory and flows.
4. Phase 2 UX owns grey-box structure, hierarchy and interaction shape.
5. Phase 3 owns design-system direction, tokens, components, interaction patterns, content rules, lifecycle status semantics and accessibility obligations; Phase 4 owns widget composition and per-screen specifications; Phase 5 owns build handoff.

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
16. `03-system/CONTENT_GUIDE.md`
17. `03-system/CONTENT_GUIDE_STATES.md`
18. `03-system/CONTENT_GUIDE_ERRORS.md`
19. `03-system/ACCESSIBILITY.md`
20. `03-system/TRACEABILITY_AUDIT.md`
21. `PHASE_03_HANDOFF.md`
22. `04-specs/PHASE_04_IMPLEMENTATION_PLAN.md`
23. `04-specs/WIDGET_SPECS.md`, then `_PLATFORM` and `_DOMAIN`
24. `04-specs/SCREEN_SPEC_MAP.md`
25. platform screen-spec files under `04-specs/`
26. `PHASE_04_HANDOFF.md`

Coding agents must not treat Phase 3 as screen specifications or implementation contracts. Phase 3 defines the system; Phase 4 places it on screens; Phase 5 remains the coding handoff owner. A Phase 4 specification says what a screen must do and what it must never do — it is not an implementation contract and carries no framework decision.

## Phase status

| Phase | Artifacts | Status |
|---|---|---|
| 1 — Discovery, IA, Flows | `01-foundation/*` | Complete |
| 2 — Wireframes | `02-wireframes/*`, `PHASE_02_HANDOFF.md` | **Complete — awaiting gate approval** |
| 3 — Design System | `03-system/*`, `PHASE_03_HANDOFF.md` | **Complete — final gate passed.** Architecture, direction, tokens, the 22 `CMP-*`, the 26 `IX-*`, all 165 `WF-*` component bindings, the 60 `TXT-*` content system, 18 lifecycle-status families / 82 statuses, 21/21 `ERR-*` recovery families, the 40 `A11Y-*` accessibility / RTL / data-state obligations, the integration and traceability audit (`TRACEABILITY_AUDIT.md`), and the Session 7 senior product/architecture gate are all complete. Every local gate is green, CI is promoted to `--phase 3`, and the promoted job passed on the gate commit (`749785c`, Documentation Validation run 59, UX Phase 3 validator exit `0`). See `PHASE_03_HANDOFF.md`. |
| 4 — Widget and Screen Specs | `04-specs/*`, `PHASE_04_HANDOFF.md` | **Complete — final gate passed.** 30 `WGT-*` allocated across 14 platform-level and 16 domain-level widgets; all 165 `SCR-*` specified against the same thirteen-section schema; every `CMP-*`, `IX-*`, `TXT-*` and `A11Y-*` placed on a widget or screen with none unplaced; all 21 `ERR-*` surfaced with their `TXT-ERR-*` copy rule; all 18 lifecycle machines bound to the screens that render them; every declared data source resolved to a canonical `API-*` or `SDC-*` owner. Every local gate is green, each new Phase 4 check was negative-tested, CI is promoted to `--phase 4`, and the promoted job passed on the gate commit (`f3f52cc`, Documentation Validation run 61, UX Phase 4 validator exit `0`). See `PHASE_04_HANDOFF.md`. |
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

## Phase 3 carry-forward obligations — discharged

The four obligations Phase 2 carried forward are implemented and were re-verified by the Session 7 gate:

- alternative expiry/decline reads as an unconfirmed booking request, never a penalized cancellation — `TXT-STATE-BOOKING-001`, `IX-BOOKING-001`;
- `ELIGIBILITY_REVIEW` carries mandatory neutral wording on every surface including the clinic panel — `TXT-PLATFORM-010`, copy obligation 2;
- retryable transfer failure is structurally separate from authoritative rejection, in different tone, icon and reachable path — `TXT-STATE-PLATFORM-001`, `IX-PLATFORM-006`;
- internal `S`/`P`/`H`/`I`, calibration mechanics and risk codes are hidden structurally and translated to practical meaning — `TXT-PLATFORM-017`, `TXT-PLATFORM-018`.

Phase 4's own must-not-re-decide list is in `PHASE_03_HANDOFF.md` section 17.

## Verification

Run cumulative validation at the current gate:

```bash
python docs/scripts/validate_docs.py
python docs/ux/scripts/validate_ux_docs.py --phase 4
python docs/ux/scripts/validate_ux_tokens.py
python scripts/check_no_emoji.py
python scripts/check_no_emoji.py docs
```

The emoji gate takes an explicit path because its default scan set excludes `docs/`; both
invocations are run at every gate.

`docs/ux/scripts/build_component_tokens.py` regenerates `design_tokens/component.json` from the
Token mapping blocks in the component inventory, so the narrative and the token source cannot
drift. Run it after editing any component's token mapping.

The UX validator was pinned at `--phase 2` until Phase 3 Session 7, so that known, expected,
not-yet-authored Phase 3 obligations could not turn every unrelated documentation change into a red
build. Session 7 promoted it to `--phase 3` once the final gate passed, and the Phase 3 gate now also
asserts that every required Phase 3 artifact exists at its canonical lowercase path, that no `A11Y-*`,
`TXT-*`, `IX-*` or `CMP-*` obligation is defined twice, and that no `A11Y-*`, `IX-*` or `TXT-*`
reference resolves to nothing.

The token gate is additive and passes now. It runs against
`docs/ux/03-system/design_tokens/`, **not** the repository-root `tokens/` directory: the design
kit's own token and contrast scripts hardcode that root path and would report a green result for
the kit's demonstration tokens rather than for this product.

The Phase 4 gate additionally asserts that every documented screen has exactly one specification and
every specification is a documented screen; that each screen names the wireframe Phase 2 documents
*for that screen*; that each screen and each widget declares a data source resolving to a canonical
`API-*` or `SDC-*` owner; that each screen addresses all nine data states; that every `WGT-*`,
`CMP-*` and `FLOW-*` a screen names is defined; and that no `IX-*`, `TXT-*`, `A11Y-*` or `CMP-*` is
defined by Phase 3 and then placed nowhere. Every one of those checks was negative-tested — broken
deliberately, confirmed to fail with the expected message, and restored — because a check that never
fires proves nothing. The results are in `PHASE_04_HANDOFF.md` section 13.
