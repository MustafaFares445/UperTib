# Phase 2 Handoff

**Phase:** UX 2 — Grey-box Wireframes  
**Baseline:** 2026-08-26  
**Status:** Complete — awaiting Phase 2 gate; Phase 3 not started  
**Coverage:** 165/165 screens wireframed · Patient 47 · Clinic 56 · Admin 62

## 1. Must NOT re-decide downstream

- Platform split and Phase 1 navigation.
- Patient one-primary-reading-column intent and Panel twelve-column conceptual content grid.
- Archetypes: dashboard, list-and-detail, form, workspace, detail.
- Region vocabulary and each `WF-*` priority order.
- Structural fail-closed treatment of eligibility hold, guardian revocation and pending reschedule.
- Patient-safe hiding of internal `P`, `I`, calibration math, risk codes and professional discovery codes.
- Two-layer catalog: patient families over detailed procedure items.
- Governance pattern for configurable catalog, clinical and pricing policy.
- Structural distinction between retryable file-transfer failure and evidence rejection.
- Original-versus-amended treatment terms and immutable accepted history.

## 2. Phase 2 decisions

### Treatment-plan compression
Required structure was retained while repeated clinician entry was reduced through procedure search, recent/common procedures, provider-price defaults, automatic unit/inclusion population, quantity defaults, duplicate-line, quick-add, progressive detail and draft continuity. No arbitrary surcharge field exists.

### Market observation compression
All required provenance remains. Entry speed comes from a desktop grid, sticky defaults, recent-source reuse, duplicate row, batch import and keyboard-oriented movement. Calibration output remains internal.

### Admin configurability
Operationally variable catalog/pricing values are visibly governed data, not code constants. Clinical changes show a review gate; commercial changes use version/effective-date governance. Historical versions remain inspectable.

## 3. Candidate components for Phase 3

| Candidate | Approximate occurrence | Why it repeats |
|---|---:|---|
| Status summary | 100+ | Every lifecycle-aware detail or work surface. |
| Filter/search bar | 45+ | Discovery, queues and management lists. |
| Record list/table | 55+ | Clinic/Admin operations and patient histories. |
| Context header | 120+ | Active patient/provider/branch/case context. |
| Action bar | 90+ | State-aware mutations. |
| Evidence transfer item | 8 | Shared upload session states and recovery. |
| Timeline/history | 25+ | Booking, case, finance, review, claim and audit history. |
| Treatment line | 6+ | Clinician authoring, patient review, amendments and oversight. |
| Governed version header | 15+ | Catalog, policy, treatment and pricing governance. |
| Before/after delta | 5+ | Treatment amendments and governed changes. |
| Work-item row | 10+ | Clinic/Admin operational queues. |
| Empty/recovery block | 165 | Required structural state on every screen. |

These are observations, not yet `CMP-*` allocations. Phase 3 owns component taxonomy and tokens.

## 4. Copy obligations carried forward

- Alternative expiry/decline must not imply that a confirmed appointment was cancelled.
- `ELIGIBILITY_REVIEW` requires neutral Patient language.
- Retryable transfer failure must not read like evidence rejection.
- Internal classification, calibration and service-risk vocabulary need patient-safe translations or must remain hidden.

## 5. Remaining upstream items

Clinical production approval remains required under narrowed `Q-CATALOG-001` and `Q-ELIG-001`. That blocks production content activation, not wireframe structure. `Q-OPS-001` owns concrete infrastructure/vendor selection. `Q-PLATFORM-003` is resolved for the provider-neutral evidence-transfer interaction.

## 6. Verification target

The repository Phase 2 validator must report all 165 `SCR-*` covered by `WF-*`, each with priority plus empty and error structure, with no Phase 2 visual-detail violations. Engineering documentation validation must remain clean.

## 7. Phase gate

STOP here. Do not begin Phase 3 Design System until this handoff is reviewed.
