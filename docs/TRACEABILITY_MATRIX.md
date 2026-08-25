# UberTib Traceability Matrix

**Phase:** 3 — Execution / Traceability  
**Baseline:** 2026-08-24  
**Operating mode:** Existing Repository  
**Product owner:** `docs/PRD.md`  
**Technical design:** `docs/SDD.md` and Phase 2 engineering documents  
**Cross-platform behavior owner:** `docs/domain/CROSS_PLATFORM_BEHAVIOR.md`  
**Testing owner:** `docs/TESTING_STRATEGY.md`  
**Implementation owner:** `docs/IMPLEMENTATION_PLAN.md` and `docs/implementation/*`  
**ID registry:** `docs/README.md`

## 1. Purpose

This document provides forward and backward traceability for the approved UberTib V1 requirement baseline.

For every confirmed requirement it records:

1. source / preserved SRS alias;
2. canonical design, API, data, state, or authorization owner;
3. Patient / Clinic / Admin impact;
4. cross-platform propagation where applicable;
5. concrete `TC-*` verification cases;
6. implementation `TASK-*` coverage;
7. current implementation state and unresolved production gate.

A feature is not complete because one interface implements its local side. Shared workflows must use one authoritative Laravel state and expose authorized projections/actions to Patient, Clinic, and Admin as defined by `docs/domain/CROSS_PLATFORM_BEHAVIOR.md`.

`Q-PLATFORM-001` remains a Blocker for claiming complete independent reconciliation against readable authoritative SRS v1.1 text. The matrix traces the approved `.spec/` baseline and preserved SRS aliases and does not imply the unreadable SRS was independently revalidated.

## 2. Status Semantics

- **Covered** — requirement has source, canonical design owner, implementation task coverage, and one or more concrete verification cases where applicable.
- **Blocked** — implementation selection cannot be completed until the named blocker is resolved.
- **Uncovered** — one or more required traceability links are absent.
- **Deprecated** — retained historical requirement superseded by another canonical requirement.

`Status` describes documentation traceability, not code completion. `Implementation State` separately uses Existing / Partial / Planned semantics. A Planned `TC-*` is a concrete executable acceptance target, not a claim that its test file already exists.

Clinical/legal/provider gates remain explicit even when a row is `Covered`.

## 3. Platform Impact Vocabulary

| Marker | Meaning |
|---|---|
| `Action` | Actor initiates or completes part of the workflow |
| `Read` | Platform consumes an authorized projection |
| `Oversight` | Admin/operations may inspect or act within scoped authority |
| `Indirect` | Platform is affected by authoritative state without owning the initiating action |
| `—` | No direct surface behavior established by the current requirement |

The columns describe functional impact, not UI layout.

## 4. Concrete Test Traceability Rule

`docs/TESTING_STRATEGY.md` now owns **82 append-only `TC-*` cases**. Every FR/NFR below references one or more of those cases. Cross-platform critical rows include a test that proves one authoritative mutation is reflected in the required Patient/Clinic/Admin projections and that notification/work failures do not become alternate business truth.

`TC-*` statuses remain owned by Testing Strategy. This matrix does not duplicate their full acceptance steps.

---

# 5. Functional Requirements

## 5.1 Identity and Access

| Requirement | Source | Design / Data / API | Patient | Clinic | Admin | Cross-Platform Behavior | Tests | Tasks | Implementation State | Gate / Open Item | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `FR-IDENTITY-001` — scoped staff permissions | `.spec FR.10.2.1` / SRS `FR-027` | SDD Identity; `PERMISSIONS_MATRIX`; scoped grants | Indirect | Action/Read | Action/Oversight | Access grant/revocation propagates immediately | `TC-IDENTITY-004`, `005`, `007` | `TASK-IDENTITY-001`, `002`, `004`; `TASK-PLATFORM-001`, `005` | Planned | Privileged provider choice partly `Q-PLATFORM-003` | Covered |
| `FR-IDENTITY-002` — patient account/contact verification | `.spec FR.11.1.1` / SRS `FR-001` | `API-IDENTITY-001`–`003`; verification challenges | Action/Read | — | Scoped support only | One verified patient identity outcome | `TC-IDENTITY-001`–`003` | `TASK-IDENTITY-005`, `006` | Planned | OTP delivery provider `Q-PLATFORM-003` | Covered |
| `FR-IDENTITY-003` — guardian/family grants | `.spec FR.11.1.2` / SRS `FR-032` | `API-IDENTITY-004`–`005`; `PERMISSIONS_MATRIX`; guardian grants | Action/Read | Indirect | Oversight | Create/revoke/expire grant; patient ownership preserved | `TC-IDENTITY-006`, `007` | `TASK-IDENTITY-007`, `TASK-IDENTITY-002` | Planned | — | Covered |

## 5.2 Catalog

| Requirement | Source | Design / Data / API | Patient | Clinic | Admin | Cross-Platform Behavior | Tests | Tasks | Implementation State | Gate / Open Item | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `FR-CATALOG-001` — understandable governed service catalog | `.spec FR.12.2.1` / SRS `FR-002` | `API-CATALOG-001`; ServiceDefinition lifecycle; ERD catalog | Read | Read / activation input | Action/Oversight | Draft → gates → publication → shared projections | `TC-CATALOG-001`–`005`, `TC-PLATFORM-012` | `TASK-CATALOG-001`, `002`; `TASK-OPS-001` | **Partial existing** | Clinical approval `Q-CATALOG-001` | Covered |

## 5.3 Eligibility, Classification, Provider Discovery

| Requirement | Source | Design / Data / API | Patient | Clinic | Admin | Cross-Platform Behavior | Tests | Tasks | Implementation State | Gate / Open Item | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `FR-ELIG-001` — eligible-provider search | `.spec FR.01.1.1` / SRS `FR-003` | `API-ELIG-001`; eligibility decisions | Action/Read | Indirect | Oversight | Effective eligibility controls discovery | `TC-ELIG-007`, `010` | `TASK-ELIG-010`, `TASK-ELIG-005` | Planned | Production results depend on approved policies | Covered |
| `FR-ELIG-002` — automatic service eligibility | `.spec FR.01.2.1` / SRS `FR-011` | evaluator; immutable decision/gates | Read | Read | Oversight | One computed decision, role-filtered projections | `TC-ELIG-002`, `005` | `TASK-ELIG-004`, `009` | Planned | `Q-ELIG-001` | Covered |
| `FR-ELIG-003` — automatic service suspension | `.spec FR.01.2.2` / SRS `FR-030` | recalculation/suspension; booking guard | Indirect/Read | Read | Oversight | Invalidation removes new discovery/booking and creates operational effect | `TC-ELIG-006`, `010` | `TASK-ELIG-005`, `009`; `TASK-BOOKING-001` | Planned | — | Covered |
| `FR-ELIG-004` — eligibility recalculation | `.spec FR.01.2.3` / SRS `FR-031` | dependency resolver; immutable decisions | Indirect | Read | Oversight | Influential change creates new decision | `TC-ELIG-006`, `009` | `TASK-ELIG-005` | Planned | — | Covered |
| `FR-ELIG-005` — most-restrictive eligibility gate | `.spec FR.01.2.4` / SRS `FR-038` | evaluator/gate results | Read safe result | Read safe result | Scoped detail | Same controlling decision shared | `TC-ELIG-005`, `007` | `TASK-ELIG-004` | Planned | `Q-ELIG-001` | Covered |
| `FR-ELIG-006` — periodic/event reevaluation | `.spec FR.01.2.5` / SRS `FR-039` | jobs + synchronous booking revalidation | Indirect | Read | Oversight | Recalculation updates search/booking/work | `TC-ELIG-006`, `010` | `TASK-ELIG-005`, `TASK-PLATFORM-004` | Planned | — | Covered |
| `FR-ELIG-007` — service activation evidence | `.spec FR.02.1.1` / SRS `FR-010` | activation/facts/evidence; optional `API-ELIG-003`/`004` | — | Action | Action/Oversight | Clinic factual submission → Admin verification → evaluation | `TC-ELIG-001`, `TC-PLATFORM-001`–`003` | `TASK-ELIG-001`, `002`, `007`, `008`; `TASK-PLATFORM-002`, `006` | Planned | Evidence provider `Q-PLATFORM-003` | Covered |
| `FR-ELIG-008` — pending evaluation for insufficient evidence | `.spec FR.02.2.1` / SRS `FR-012` | `ERR-ELIG-002`; evaluator state | Read safe status | Read blockers | Oversight | Missing evidence is PENDING, never grade F | `TC-ELIG-002`, `008` | `TASK-ELIG-004`, `009`, `011` | Planned | — | Covered |
| `FR-ELIG-009` — actual price as source input | `.spec FR.02.2.2` / SRS `FR-013` | provider prices + versioned P policy | Read safe price | Action | Oversight | Price is source fact; P computed prospectively | `TC-ELIG-003` | `TASK-ELIG-003`, `TASK-FINANCE-004` | Planned | `Q-ELIG-001` for bands | Covered |
| `FR-ELIG-010` — automatic protection selection | `.spec FR.02.2.3` / SRS `FR-014` | governed H policy + accepted snapshot | Read safe meaning | Read safe meaning | Oversight | Derived H can become historical entitlement context | `TC-ELIG-004`, `TC-CLAIMS-002` | `TASK-ELIG-003`, `004` | Planned | `Q-ELIG-001`; V1 non-funded | Covered |
| `FR-ELIG-011` — S score and immutable snapshot | `.spec FR.02.2.4` / SRS `FR-036` | eligibility snapshot | Safe explanation | Safe result | Scoped detail | One immutable decision underlies all views | `TC-ELIG-004`, `005` | `TASK-ELIG-003`, `004`, `006` | Planned | `Q-ELIG-001` | Covered |
| `FR-ELIG-012` — confidence and grade cap | `.spec FR.02.2.5` / SRS `FR-037` | versioned evaluator policy | Safe result | Safe result | Scoped detail | Derived outcome only; no manual override | `TC-ELIG-004` | `TASK-ELIG-003`, `004` | Planned | `Q-ELIG-001` | Covered |
| `FR-ELIG-013` — grade bands and F separation | `.spec FR.02.2.6` / SRS `FR-040` | scientific-grade policy | Safe result | Safe result | Scoped detail | Pending remains distinct from F on every projection | `TC-ELIG-002`, `004` | `TASK-ELIG-003`, `004` | Planned | `Q-ELIG-001` | Covered |
| `FR-ELIG-014` — automatic P from versioned price bands | `.spec FR.02.2.7` / SRS `FR-041` | price + versioned band policy | Safe meaning | Price action / safe derived read | Scoped detail | Clinic price → backend-derived P → patient-safe projection | `TC-ELIG-003` | `TASK-ELIG-003`, `004`; `TASK-FINANCE-004` | Planned | `Q-ELIG-001` | Covered |
| `FR-ELIG-015` — automatic H and I | `.spec FR.02.2.8` / SRS `FR-042` | versioned H/I policies + filtering | H safe; I hidden | H safe; I hidden | Scoped detail | Same decision with role-filtered fields | `TC-ELIG-004`, `008` | `TASK-ELIG-003`, `004`, `006` | Planned | `Q-ELIG-001` | Covered |
| `FR-ELIG-016` — provider decision card | `.spec FR.03.1.1` / SRS `FR-004` | `API-ELIG-001`; patient-safe read model | Read | Read own status | Oversight | Role-specific projection from same decision | `TC-ELIG-007`, `008` | `TASK-ELIG-006`, `009`, `010` | Planned | — | Covered |
| `FR-ELIG-017` — eligibility explanation | `.spec FR.03.1.2` / SRS `FR-005` | `API-ELIG-002`; provenance/reproduction | Read | Read | Oversight/detail | Same reason/provenance with privacy filtering | `TC-ELIG-008`, `009` | `TASK-ELIG-006`, `009`, `011` | Planned | — | Covered |

## 5.4 Booking

| Requirement | Source | Design / Data / API | Patient | Clinic | Admin | Cross-Platform Behavior | Tests | Tasks | Implementation State | Gate / Open Item | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `FR-BOOKING-001` — booking request and safety revalidation | `.spec FR.04.1.1` / SRS `FR-006` | `API-BOOKING-001`–`003`; booking state machine; slots/bookings | Action/Read | Action/Read | Oversight | Patient request → Clinic work → authoritative confirmation visible everywhere | `TC-BOOKING-001`, `TC-BOOKING-002`, `TC-BOOKING-004`, `TC-BOOKING-005`, `TC-BOOKING-007`, `TC-BOOKING-008`; `TC-ELIG-010` | `TASK-BOOKING-001`, `003`–`005`, `007`, `008` | Planned | — | Covered |
| `FR-BOOKING-002` — cancellation and no-show | `.spec FR.04.1.2` / SRS `FR-033` | `API-BOOKING-005`; booking events/state | Action/Read | Action/Read | Oversight | Transition propagates; record is not hard-deleted | `TC-BOOKING-006`, `008` | `TASK-BOOKING-002`, `006`, `010` | Planned | Policy values versioned | Covered |
| `FR-BOOKING-003` — provider response/alternative/deadline | `.spec FR.04.2.1` / SRS `FR-007` | `API-BOOKING-004`; shared provider response actions | Action/Read | Action | Oversight | Clinic response → Patient/Admin projection + post-commit notification | `TC-BOOKING-003`–`005`, `008` | `TASK-BOOKING-004`, `005`, `008`, `009` | Planned | — | Covered |
| `FR-BOOKING-004` — governed booking reschedule | decision `PO-UX-15` | `API-BOOKING-006`, `API-BOOKING-007`, `SDC-BOOKING-002`; reschedule proposal machine | Action/Read | Action/Read | Oversight | Proposal is a separate record; original booking stays `CONFIRMED` until the counterparty accepts | `TC-BOOKING-009` | `TASK-BOOKING-011` | Planned | — | Covered |

## 5.5 Clinical Case and Treatment

| Requirement | Source | Design / Data / API | Patient | Clinic | Admin | Cross-Platform Behavior | Tests | Tasks | Implementation State | Gate / Open Item | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `FR-CLINICAL-001` — clinician-authored treatment plan/stages/price | `.spec FR.05.1.1` / SRS `FR-008` | `API-CLINICAL-001`/`002`; plan versions/stages | Read | Action | Oversight | Dentist proposes exact version → Patient reviews same version | `TC-CLINICAL-001`–`003` | `TASK-CLINICAL-001`–`003`, `007`; `TASK-FINANCE-005` | Planned | No autonomous diagnosis/treatment plan | Covered |
| `FR-CLINICAL-002` — accepted terms snapshot/amendment | `.spec FR.05.2.1` / SRS `FR-009` | `API-CLINICAL-003`; immutable snapshots | Action/Read | Read / propose amendment | Oversight | Patient acceptance creates immutable shared snapshot; amendment is new version | `TC-CLINICAL-003`–`005` | `TASK-CLINICAL-003`, `004`, `008`; `TASK-FINANCE-001`, `005` | Planned | — | Covered |
| `FR-CLINICAL-003` — treatment-stage evidence | `.spec FR.07.1.1` / SRS `FR-023` | stage state; evidence bindings | Read | Action | Oversight | Clinic completion/evidence → Patient timeline/Admin projection | `TC-CLINICAL-006`, `007`; `TC-PLATFORM-001`–`003` | `TASK-CLINICAL-005`, `009`; `TASK-PLATFORM-006` | Planned | Evidence provider `Q-PLATFORM-003` | Covered |
| `FR-CLINICAL-004` — follow-up reminders | `.spec FR.07.2.1` / SRS `FR-024` | follow-up state; notification intent | Read | Action/Read | Oversight | Due state shared; delivery failure does not complete/revert clinical state | `TC-CLINICAL-007`, `TC-PLATFORM-010` | `TASK-CLINICAL-006`, `009`; `TASK-OPS-004` | Planned | Notification provider `Q-PLATFORM-003` | Covered |
| `FR-CLINICAL-005` — unified patient case timeline | `.spec FR.07.2.2` / SRS `FR-034` | `API-CLINICAL-004`; role-filtered case read model | Read | Read/Action where scoped | Oversight | One case truth with authorized projections | `TC-CLINICAL-007`, `TC-CLAIMS-004`, `TC-FINANCE-005` | `TASK-CLINICAL-001`, `002`, `006`, `007`, `009` | Planned | — | Covered |

## 5.6 Financial Records — External Activity Only

| Requirement | Source | Design / Data / API | Patient | Clinic | Admin | Cross-Platform Behavior | Tests | Tasks | Implementation State | Gate / Open Item | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `FR-FINANCE-001` — financial snapshot on acceptance/amendment | `.spec FR.05.2.2` / SRS `FR-043` | `API-FINANCE-001`; terms snapshot | Read / acceptance-linked | Proposal/Read | Oversight | Proposal → acceptance → immutable shared financial snapshot | `TC-FINANCE-001`, `TC-CLINICAL-003`–`005` | `TASK-FINANCE-001`, `004`, `005`, `008`; `TASK-CLINICAL-004`, `008` | Planned | Zero-money boundary | Covered |
| `FR-FINANCE-002` — external payment reporting | `.spec FR.06.1.1` / SRS `FR-015` | `API-FINANCE-002`; append-only events | Action when party | Action when party | Oversight | Reporter creates one unconfirmed assertion | `TC-FINANCE-002`, `006`, `007` | `TASK-FINANCE-001`, `006`, `009` | Planned | No payment execution | Covered |
| `FR-FINANCE-003` — payment confirmation/dispute | `.spec FR.06.1.2` / SRS `FR-016` | `API-FINANCE-003`; append-only response | Action when counterparty | Action when counterparty | Scoped review | Response appends; original assertion remains | `TC-FINANCE-003`, `006` | `TASK-FINANCE-002`, `006`, `010` | Planned | — | Covered |
| `FR-FINANCE-004` — external refund confirmation | `.spec FR.06.1.3` / SRS `FR-019` | `API-FINANCE-004`; claim decision + event | Action when authorized | Action when authorized | Oversight | Off-platform execution may be recorded, never executed by UberTib | `TC-FINANCE-004`, `006`, `007` | `TASK-FINANCE-003`, `007`, `011` | Planned | No money movement | Covered |
| `FR-FINANCE-005` — append-only financial events | `.spec FR.06.1.4` / SRS `FR-044` | financial event chain | Read/Action | Read/Action | Oversight | All platforms derive from ordered history | `TC-FINANCE-002`–`006` | `TASK-FINANCE-001`, `002`, `006`, `009`–`011` | Planned | — | Covered |
| `FR-FINANCE-006` — financial case timeline | `.spec FR.06.2.1` / SRS `FR-017` | `API-FINANCE-005`; timeline projection | Read | Read | Oversight | Same chain projected with role filtering | `TC-FINANCE-005`, `008` | `TASK-FINANCE-001`, `006`, `008` | Planned | — | Covered |
| `FR-FINANCE-007` — explicit external-money boundary | `.spec FR.06.2.2` / SRS `FR-047` | SDD finance boundary; architecture controls | Read wording | External-fact actions only | Oversight | No adapter introduces payment/custody/settlement/refund execution | `TC-FINANCE-004`, `007`, `008` | `TASK-FINANCE-001`–`003`, `006`–`011`; `TASK-PLATFORM-004`, `007`, `012` | Planned | Hard V1 boundary | Covered |

## 5.7 Reviews

| Requirement | Source | Design / Data / API | Patient | Clinic | Admin | Cross-Platform Behavior | Tests | Tasks | Implementation State | Gate / Open Item | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `FR-REVIEWS-001` — one verified review per completed experience | `.spec FR.08.1.1` / SRS `FR-025` | `API-REVIEWS-001`; reviews | Action/Read | Read | Oversight | Shared verified review; R independent of eligibility | `TC-REVIEWS-001`–`003` | `TASK-REVIEWS-001`, `002`, `003` | Planned | — | Covered |
| `FR-REVIEWS-002` — review appeal/integrity | `.spec FR.08.2.1` / SRS `FR-026` | `API-REVIEWS-002` where external; appeals | Action if policy permits | Action if affected | Action/Oversight decision | Appeal is separate record; original rating/history preserved | `TC-REVIEWS-003`, `004` | `TASK-REVIEWS-001`, `002` | Planned | Patient surface only if policy grants action | Covered |

## 5.8 Claims, Refund Requests, Sensitive Decisions, Appeals

| Requirement | Source | Design / Data / API | Patient | Clinic | Admin | Cross-Platform Behavior | Tests | Tasks | Implementation State | Gate / Open Item | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `FR-CLAIMS-001` — refund request | `.spec FR.09.1.1` / SRS `FR-018` | `API-CLAIMS-001`, `003`, `004`; claims | Action/Read | Read/respond where relevant | Action/Oversight | Patient claim → Clinic participation → Admin review work | `TC-CLAIMS-001`, `004`, `006` | `TASK-CLAIMS-001`, `005`, `007`, `008`; `TASK-FINANCE-003` | Planned | No refund execution in platform | Covered |
| `FR-CLAIMS-002` — protection claim submission | `.spec FR.09.1.2` / SRS `FR-020` | `API-CLAIMS-002`–`004`; accepted H snapshot | Action/Read | Read/respond | Action/Oversight | Historical entitlement controls shared claim | `TC-CLAIMS-002`, `004` | `TASK-CLAIMS-001`, `005`, `007`, `008` | Planned | Protection non-funded V1 | Covered |
| `FR-CLAIMS-003` — evidence and deadlines | `.spec FR.09.2.1` / SRS `FR-021` | deadline events; evidence; `ERR-CLAIMS-002` | Action/Read | Action/Read | Action/Oversight | Evidence/deadline changes append and propagate | `TC-CLAIMS-003`, `004`; `TC-PLATFORM-001`–`003` | `TASK-CLAIMS-002`, `005`, `007`, `008`; `TASK-PLATFORM-002`, `006` | Planned | Evidence provider `Q-PLATFORM-003` | Covered |
| `FR-CLAIMS-004` — sensitive human review | `.spec FR.09.2.2` / SRS `FR-022` | decisions; `PERMISSIONS_MATRIX`; SoD | Read decision | Respond/Read; cannot self-adjudicate | **Action** scoped human decision | Immutable human decision projected to authorized parties | `TC-CLAIMS-005`, `006` | `TASK-CLAIMS-003`, `005`, `008`, `009` | Planned | Human reviewer required | Covered |
| `FR-CLAIMS-005` — claim appeal | `.spec FR.09.2.3` / SRS `FR-026` | `API-CLAIMS-005`; appeal lifecycle | Action/Read | Action if eligible affected party | Action/Oversight independent review | Separate appeal preserves original decision | `TC-CLAIMS-007` | `TASK-CLAIMS-004`, `006`, `008`, `009` | Planned | — | Covered |

## 5.9 Operations

| Requirement | Source | Design / Data / API | Patient | Clinic | Admin | Cross-Platform Behavior | Tests | Tasks | Implementation State | Gate / Open Item | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `FR-OPS-001` — operational work queues | `.spec FR.10.1.1` / SRS `FR-029` | work items; monitoring; cross-platform work rules | Indirect | Read/Action scoped | Action/Oversight | Work references but never replaces source record | `TC-OPS-001`, `TC-OPS-002`, `TC-OPS-005`; `TC-BOOKING-002`, `TC-CLAIMS-004` | `TASK-OPS-002`, `004`; emitting domain tasks | Planned | — | Covered |
| `FR-OPS-002` — operational reporting | `.spec FR.14.1.1` / SRS `FR-035` | reporting read models; monitoring | — | Scoped if approved | Action/Read | Reports derive from authoritative data | `TC-OPS-003`, `005` | `TASK-OPS-003`, `TASK-PLATFORM-004` | Planned | — | Covered |
| `FR-OPS-003` — launch readiness gate | `.spec FR.14.2.1` / PO-2026-08-23 | existing launch gates/publication | Indirect catalog result | Indirect activation availability | Action | Publication/readiness propagates to catalog/Clinic availability | `TC-OPS-004`, `TC-CATALOG-004`, `005` | `TASK-OPS-001`, `TASK-CATALOG-001` | **Partial existing** | `Q-CATALOG-001` | Covered |

## 5.10 Policy

| Requirement | Source | Design / Data / API | Patient | Clinic | Admin | Cross-Platform Behavior | Tests | Tasks | Implementation State | Gate / Open Item | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `FR-POLICY-001` — versioned policy lifecycle | `.spec FR.13.1.1` / PO-2026-08-23 | `STATE_MACHINES`; policy versions | Indirect | Indirect | Action | Prospective replacement; historical snapshots stay bound | `TC-POLICY-001`, `002`, `004`; `TC-CATALOG-003`–`005` | `TASK-POLICY-001`, `TASK-CATALOG-001` | **Partial pattern existing** | — | Covered |
| `FR-POLICY-002` — historical decision reproduction | `.spec FR.13.2.1` / PO-2026-08-23 | snapshots; reproduction; integrity exceptions | Indirect | Read safe history | Action/Oversight | Reproduction cannot rewrite original | `TC-POLICY-003`, `004`; `TC-ELIG-009`; `TC-AUDIT-004` | `TASK-POLICY-001`, `TASK-ELIG-006`, `TASK-AUDIT-002` | Planned | — | Covered |

## 5.11 Audit and Retry Safety

| Requirement | Source | Design / Data / API | Patient | Clinic | Admin | Cross-Platform Behavior | Tests | Tasks | Implementation State | Gate / Open Item | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `FR-AUDIT-001` — sensitive decision/activity audit | `.spec FR.11.2.1` / SRS `FR-028` | audit events; permissions; monitoring | Indirect | Indirect | Read scoped audit | Actual initiating actor preserved across adapters | `TC-AUDIT-001`, `002`, `005` | `TASK-AUDIT-001`; all sensitive domain tasks | Planned | — | Covered |
| `FR-AUDIT-002` — classification/financial audit | `.spec FR.11.2.2` / SRS `FR-046` | eligibility snapshots + finance events | Read safe history | Read safe history | Scoped detail | All projections derive from immutable history | `TC-AUDIT-002`, `004`; `TC-ELIG-009`; `TC-FINANCE-005` | `TASK-AUDIT-001`, `TASK-ELIG-006`, `TASK-FINANCE-001` | Planned | — | Covered |
| `FR-AUDIT-003` — idempotent sensitive commands | `.spec FR.12.1.1` / SRS `FR-045` | idempotency records; `ERR-AUDIT-001` | Action | Action | Action | Retry cannot duplicate state; timeout reconciles from source truth | `TC-AUDIT-003`, `005`; `TC-PLATFORM-009`, `010` | `TASK-AUDIT-002`, `003`; mutation tasks across platforms | Planned | — | Covered |

## 5.12 Patient Attention and Notification

| Requirement | Source | Design / Data / API | Patient | Clinic | Admin | Cross-Platform Behavior | Tests | Tasks | Implementation State | Gate / Open Item | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `FR-PLATFORM-001` — patient notification and attention center | decision `PO-UX-09` | `API-PLATFORM-002`; notification intent matrix; durable entries | Read/Action | Indirect | Oversight | Durable entry is a post-commit projection; reading changes no business state and delivery failure never changes obligation | `TC-PLATFORM-013` | `TASK-PLATFORM-013` | Planned | — | Covered |

---

# 6. Non-Functional Requirements

| Requirement | Source | Verification / Design Owners | Patient Impact | Clinic Impact | Admin Impact | Tests | Primary Tasks | Implementation State | Gate / Open Item | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| `NFR-PLATFORM-001` — performance and scale | `.spec NFR.01` | Testing Strategy; Infrastructure; Monitoring | API/search latency | scoped query performance | operations/report performance | `TC-PLATFORM-005`, `006`; `TC-BOOKING-007` | `TASK-PLATFORM-004`, `007`, `012`; booking/search tasks | Planned | — | Covered |
| `NFR-PLATFORM-002` — availability, backup, recovery | `.spec NFR.02` | Infrastructure; Monitoring; recovery | service availability | Filament availability | recovery oversight | `TC-PLATFORM-007` | `TASK-PLATFORM-004`, `007`, `012` | Planned | Hosting `Q-OPS-001` | Covered |
| `NFR-IDENTITY-001` — authorization and scope isolation | `.spec NFR.03` | `PERMISSIONS_MATRIX`; authorization tests | patient/guardian isolation | clinic/branch/case isolation | staff scope/SoD | `TC-IDENTITY-004`, `006`, `007`; `TC-PLATFORM-003` | `TASK-IDENTITY-001`, `002`, `004`, `006`, `007`; release gates | Planned | — | Covered |
| `NFR-IDENTITY-002` — authentication/MFA/OTP safety | `.spec NFR.04` | OTP/MFA strategy; Configuration | OTP/session | privileged Clinic access | privileged Admin access | `TC-IDENTITY-001`–`005` | `TASK-IDENTITY-003`, `005`, `006` | Planned | Provider `Q-PLATFORM-003` | Covered |
| `NFR-PLATFORM-003` — private file/evidence security | `.spec NFR.05` | `API-PLATFORM-001`; evidence session machine; ERD evidence; Infrastructure; Permissions | authorized evidence access | scoped upload/read | review/oversight | `TC-PLATFORM-001`–`003` | `TASK-PLATFORM-002`, `006`, `012` | Planned | Interaction fixed by `PO-UX-17`; vendor selection `Q-OPS-001` | Covered |
| `NFR-PLATFORM-004` — privacy, retention, deletion | `.spec NFR.06` | ERD legal holds; Policy; privacy ops | privacy semantics | scoped lifecycle | retention/legal hold operations | `TC-PLATFORM-004` | `TASK-PLATFORM-003`, `012` | Planned | Legal validation `Q-PLATFORM-002` | Covered |
| `NFR-AUDIT-001` — audit/provenance integrity | `.spec NFR.07` | Audit design; Monitoring | attributed patient action | attributed provider action | reviewer/admin action | `TC-AUDIT-001`, `002`, `004`, `005` | `TASK-AUDIT-001`, `003` | Planned | — | Covered |
| `NFR-AUDIT-002` — concurrency and idempotency | `.spec NFR.08` | booking/finance/claim tests; MySQL | safe retries | safe provider actions | safe operations | `TC-AUDIT-003`; `TC-BOOKING-007`; `TC-FINANCE-006`; `TC-PLATFORM-009` | `TASK-AUDIT-002`, `003`; booking/finance/claim tasks | Planned | — | Covered |
| `NFR-PLATFORM-005` — Arabic, RTL, accessibility | `.spec NFR.09` | localization/accessibility verification | Primary | Filament compatibility | Admin compatibility | `TC-PLATFORM-012`, `TC-CATALOG-001` | `TASK-PLATFORM-011`, `007` | Planned | UX pipeline owns final presentation proof | Covered |
| `NFR-PLATFORM-006` — weak-connectivity resilience | `.spec NFR.10` | mobile network/cache; idempotency | Primary | browser retry semantics | operational retry semantics | `TC-PLATFORM-009`, `010`; `TC-BOOKING-008` | `TASK-PLATFORM-009`, `010`, `012` | Planned | — | Covered |
| `NFR-PLATFORM-007` — maintainability/contract versioning | `.spec NFR.11` | Architecture/API; Composer quality gates | stable `/api/v1` | shared actions/separate panel | shared actions/Admin panel | `TC-PLATFORM-011` | `TASK-PLATFORM-001`, `005`, `008`, `012` | Partial foundation existing | Historical stack conflict handled by verified current stack | Covered |
| `NFR-PLATFORM-008` — observability/queue operations | `.spec NFR.12` | Monitoring; work queues; correlation | safe support context | work/notification visibility | operations monitoring | `TC-PLATFORM-008`, `010`; `TC-AUDIT-005`; `TC-OPS-002` | `TASK-PLATFORM-004`, `007`, `012`; `TASK-OPS-002`, `004` | Planned | Provider-specific delivery unresolved | Covered |
| `NFR-FINANCE-001` — zero money movement | `.spec NFR.13` | SDD finance boundary; architecture/security | no payment/custody | no gateway/refund execution | no settlement/payout controls | `TC-FINANCE-004`, `007`, `008`; `TC-CLAIMS-006` | `TASK-FINANCE-001`–`011`; `TASK-PLATFORM-012` | Planned | Hard V1 boundary | Covered |
| `NFR-AUDIT-003` — immutable snapshot/event integrity | `.spec NFR.14` | ERD/state/policy reproduction | accepted history | append/version actions | oversight/reproduction | `TC-AUDIT-004`; `TC-POLICY-003`; `TC-ELIG-005`, `009`; `TC-CLINICAL-004`–`006`; `TC-FINANCE-001`, `003`–`006`; `TC-CLAIMS-006`, `007` | `TASK-AUDIT-001`, `002`; eligibility/clinical/finance/claim tasks | Planned | — | Covered |

---

# 7. Cross-Platform Completeness Checks

| Capability | Initiating / Governing Surface | Required Other-Surface Effect | Concrete Cross-Platform Tests |
|---|---|---|---|
| Service publication | Admin | Patient catalog + Clinic activation availability use same published definition | `TC-CATALOG-005` |
| Provider facts/evidence | Clinic | Admin verification work; Patient discovery changes only after decision | `TC-ELIG-001`, `006` |
| Eligibility suspension | System / governed inputs | Patient discovery/booking blocked; Clinic status; Admin work | `TC-ELIG-006`, `010` |
| Booking creation | Patient | Clinic actionable request; Admin oversight; one booking | `TC-BOOKING-001`, `002` |
| Booking provider response | Clinic | Patient current state/action; Admin oversight | `TC-BOOKING-003`–`005` |
| Booking cancellation/no-show | Patient or Clinic | Same transition visible on all scoped surfaces | `TC-BOOKING-006` |
| Booking notification failure | Delivery layer | No rollback; refresh returns committed state | `TC-BOOKING-008`, `TC-PLATFORM-010` |
| Treatment-plan proposal | Clinic | Patient gets exact version; Admin scoped oversight | `TC-CLINICAL-003` |
| Treatment-plan acceptance | Patient/Guardian | Clinic accepted state; Admin immutable snapshot | `TC-CLINICAL-004`, `005` |
| Stage completion/follow-up | Clinic | Patient timeline + Admin scoped projection | `TC-CLINICAL-006`, `007` |
| External financial report | Patient or Clinic | Counterparty response action + Admin oversight on same event | `TC-FINANCE-002`, `003` |
| Financial correction/status | Authorized party | All surfaces derive from same append-only chain | `TC-FINANCE-003`, `005`, `006` |
| Verified review | Patient | Clinic authorized view + Admin integrity oversight | `TC-REVIEWS-001`–`003` |
| Review appeal | Affected party | Admin integrity review; original review unchanged | `TC-REVIEWS-004` |
| Refund/protection claim | Patient | Clinic participation + Admin review work on same claim | `TC-CLAIMS-001`, `002`, `004` |
| Claim evidence/deadline | Patient/Clinic/Admin | Same evidence/deadline history | `TC-CLAIMS-003`, `004` |
| Sensitive claim decision | Admin human reviewer | Authorized Patient/Clinic result projection | `TC-CLAIMS-005`, `006` |
| Claim appeal | Patient or eligible Clinic party | Admin independent review on same appeal record | `TC-CLAIMS-007` |
| Permission/grant revocation | Authorized grantor/Admin/system | Access denied on next request across affected adapters | `TC-IDENTITY-007` |
| Work-item mutation | Admin/Clinic operations | Source Booking/Case/Claim/etc. remains unchanged unless domain action runs | `TC-OPS-001`, `TC-OPS-005` |
| Delayed/failed notification | Delivery infrastructure | Business state remains committed and authoritative refresh converges surfaces | `TC-PLATFORM-010` |

A capability above is not implementation-complete if only the initiating platform passes while an expected other-surface projection/action is missing.

# 8. Edit / Delete Traceability for Shared Records

| Shared record | Required change model | Verification |
|---|---|---|
| Booking | state transition/event; no normal hard delete | `TC-BOOKING-006` |
| Treatment plan | draft edit; accepted amendment is new version | `TC-CLINICAL-004`, `005` |
| Eligibility decision | new immutable decision | `TC-ELIG-005`, `006`, `009` |
| Financial event | append confirmation/dispute/correction/execution | `TC-FINANCE-003`–`006` |
| Claim decision | immutable decision + separate appeal | `TC-CLAIMS-006`, `007` |
| Review | governed active/integrity workflow, no direct Clinic/Admin rating rewrite | `TC-REVIEWS-003`, `004` |
| Guardian/staff grant | revoke/expire, preserve actor history | `TC-IDENTITY-007` |
| Evidence | governed lifecycle/retention/legal hold | `TC-PLATFORM-002`–`004` |
| Work item | operational state only | `TC-OPS-001`, `TC-OPS-005` |
| Notification intent | delivery/retry state only | `TC-BOOKING-008`, `TC-PLATFORM-010` |

# 9. Coverage Summary

Under the approved `.spec` continuation baseline:

- Functional requirements traced: **53 / 53**.
- Non-functional requirements traced: **14 / 14**.
- Total FR/NFR rows: **67**.
- Concrete test cases allocated in Testing Strategy: **84**.
- Implementation tasks allocated: **84**.
- API contracts allocated: **36**.
- Stable error IDs allocated: **20**.
- Requirement rows with `TASK-*` coverage: **67 / 67**.
- Requirement rows with concrete `TC-*` coverage: **67 / 67**.
- Rows marked `Uncovered`: **0**.
- Rows marked `Deprecated`: **0**.
- Requirement rows marked `Blocked`: **0** under the explicitly approved `.spec` continuation baseline.
- Full independent authoritative SRS v1.1 reconciliation: **Blocked by `Q-PLATFORM-001`**.
- Production clinical catalog readiness remains governed by `Q-CATALOG-001`.
- Production S/P/H/I medical policy readiness remains governed by `Q-ELIG-001`.
- Retention-period legal acceptance remains governed by `Q-PLATFORM-002`.
- Infrastructure/provider finalization remains governed by `Q-OPS-001` / `Q-PLATFORM-003`.

These are documentation coverage counts. They do not state that 82 planned test cases or 82 implementation tasks already exist in production code.

`CONFLICT-CATALOG-001` remains allocated historically but is **Resolved**: the currently verified route and current OpenAPI agree for the implemented `API-CATALOG-001` slice.

# 10. Forward / Backward Traceability Rules

Future changes must preserve all of the following:

- every new confirmed `FR-*` / `NFR-*` gets source, canonical design owner, task, and concrete test mapping;
- every cross-platform requirement identifies Patient/Clinic/Admin effects or explicitly marks a platform not applicable;
- every new `TASK-*` references at least one owning requirement;
- every `API-*` and `ERR-*` references owning requirements;
- every `TC-*` references the requirement(s) it proves;
- adding an ID updates `docs/README.md` highest allocated value without renumbering existing IDs;
- shared business records are not duplicated into platform-specific sources of truth;
- lifecycle transitions remain owned by `STATE_MACHINES.md`;
- authorization remains owned by `PERMISSIONS_MATRIX.md`;
- cross-platform propagation remains owned by `CROSS_PLATFORM_BEHAVIOR.md`;
- test acceptance details remain owned by `TESTING_STRATEGY.md`;
- execution ordering remains owned by `IMPLEMENTATION_PLAN.md`;
- this matrix records links/status and does not invent new product behavior.

# 11. Phase 4 Verification

Phase 3 artifact generation is complete. `docs/scripts/validate_docs.py` now performs the mechanical integrity checks and is executed by the repository documentation-validation workflow.

Phase 4 must continue until the validator reports zero failures. The final verification report must record exact requirement/API/error/task/test counts, generated and intentionally omitted artifacts, unresolved `Q-*` / `CONFLICT-*` items, and engineering-to-UX readiness without claiming clinical or SRS reconciliation that remains blocked.