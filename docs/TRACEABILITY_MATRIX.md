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

It answers four questions for every confirmed requirement:

1. where the requirement came from;
2. which canonical design/API/data/state/authorization artifacts define it;
3. which implementation tasks and verification areas cover it;
4. which of the Patient, Clinic, and Admin platforms are affected when the requirement crosses platform boundaries.

The matrix deliberately includes platform-impact columns because a feature is not complete when only one interface implements its side of a shared workflow. For example, a patient booking submission is incomplete if the same authoritative booking does not become visible/actionable to the owning Clinic and observable to authorized Admin operations as defined by `CROSS_PLATFORM_BEHAVIOR.md`.

`Q-PLATFORM-001` remains a Blocker for claiming complete end-to-end reconciliation against readable authoritative SRS v1.1 text. The rows below trace the approved `.spec/` baseline and preserved SRS aliases; they do not claim that unreadable SRS text was independently revalidated.

## 2. Status Semantics

`Status` uses the canonical vocabulary:

- **Covered** — product requirement, technical design, implementation task, and verification method are all defined where applicable.
- **Blocked** — a correct implementation plan cannot be selected until the referenced blocker is resolved.
- **Uncovered** — one or more required traceability links are missing.
- **Deprecated** — retained historical requirement superseded by another canonical requirement.

`Coverage Status` is documentation readiness, not runtime completion. The `Implementation State` column separately distinguishes existing, partial, and planned implementation.

No requirement is marked production clinically ready merely because it is `Covered`. Clinical/legal/provider readiness gates remain explicit in the `Gate / Open Item` column.

## 3. Platform Impact Vocabulary

| Marker | Meaning |
|---|---|
| `Action` | Actor on this platform initiates or completes part of the workflow |
| `Read` | Platform consumes an authorized projection of the authoritative backend state |
| `Oversight` | Admin/operations can inspect or act only within scoped governance/operations authority |
| `Indirect` | Platform is affected by the resulting authoritative state but does not own the initiating action |
| `—` | No required direct surface behavior established by the current requirement |

The platform columns do not define UI layout or screens. They only prove that cross-platform effects have not been lost during implementation planning.

## 4. Test Traceability Note

`docs/TESTING_STRATEGY.md` currently defines concrete verification scenarios by domain but intentionally has not yet allocated executable `TC-*` identifiers. Therefore the `Tests` column references the canonical verification section/scenario family rather than pretending that nonexistent test-case IDs already exist.

Before Phase 4 can produce a clean mechanical validation report, the testing registry must allocate concrete `TC-*` IDs and synchronize them into `docs/README.md`. Until that registry pass is complete, the future validator is expected to flag TC-specific coverage checks even though the verification scenarios are already defined.

---

# 5. Functional Requirements

## 5.1 Identity and Access

| Requirement | Source | Design / Data / API | Patient | Clinic | Admin | Cross-Platform Behavior | Tests | Tasks | Implementation State | Gate / Open Item | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `FR-IDENTITY-001` — scoped staff permissions | `.spec FR.10.2.1` / SRS `FR-027` | SDD Identity; `PERMISSIONS_MATRIX`; ERD staff scopes | Indirect | Action/Read | Action/Oversight | Access grant/revocation propagation | Testing Strategy — Identity & Authorization | `TASK-IDENTITY-001`, `002`, `004`; `TASK-PLATFORM-001`, `005` | Planned | Privileged provider choice partly `Q-PLATFORM-003` | Covered |
| `FR-IDENTITY-002` — patient account/contact verification | `.spec FR.11.1.1` / SRS `FR-001` | `API-IDENTITY-001`–`003`; ERD verification challenges | Action/Read | — | Scoped support only | Patient identity activation | Testing Strategy — OTP / Identity | `TASK-IDENTITY-005`, `006` | Planned | Delivery provider `Q-PLATFORM-003` | Covered |
| `FR-IDENTITY-003` — guardian/family grants | `.spec FR.11.1.2` / SRS `FR-032` | `API-IDENTITY-004`–`005`; `PERMISSIONS_MATRIX`; ERD guardian grants | Action/Read | Indirect | Oversight | Guardian grant create/revoke/expiry | Testing Strategy — Guardian grants | `TASK-IDENTITY-007`, `TASK-IDENTITY-002` | Planned | — | Covered |

## 5.2 Catalog

| Requirement | Source | Design / Data / API | Patient | Clinic | Admin | Cross-Platform Behavior | Tests | Tasks | Implementation State | Gate / Open Item | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `FR-CATALOG-001` — understandable governed service catalog | `.spec FR.12.2.1` / SRS `FR-002` | `API-CATALOG-001`; ServiceDefinition lifecycle; ERD catalog | Read | Read/Activation input | Action/Oversight | Draft → gates → publication → all projections | Testing Strategy — Catalog & Launch Governance | `TASK-CATALOG-001`, `002`; `TASK-OPS-001` | **Partial existing** | Clinical approval `Q-CATALOG-001` | Covered |

## 5.3 Eligibility, Classification, Provider Discovery

| Requirement | Source | Design / Data / API | Patient | Clinic | Admin | Cross-Platform Behavior | Tests | Tasks | Implementation State | Gate / Open Item | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `FR-ELIG-001` — eligible-provider search | `.spec FR.01.1.1` / SRS `FR-003` | `API-ELIG-001`; ERD eligibility decisions | Action/Read | Indirect | Oversight | Eligibility decision controls patient discovery | Testing Strategy — Eligibility/Search | `TASK-ELIG-010`, `TASK-ELIG-005` | Planned | Production results depend on approved policies | Covered |
| `FR-ELIG-002` — automatic service eligibility | `.spec FR.01.2.1` / SRS `FR-011` | Eligibility evaluator; `STATE_MACHINES`; ERD decisions/gates | Read | Read | Oversight | One computed decision projected to all surfaces | Testing Strategy — Eligibility | `TASK-ELIG-004`, `009` | Planned | `Q-ELIG-001` for production formulas | Covered |
| `FR-ELIG-003` — automatic service suspension | `.spec FR.01.2.2` / SRS `FR-030` | Eligibility recalculation/suspension; booking guard | Indirect/Read | Read | Oversight | Invalidation removes discovery/booking and creates operations impact | Testing Strategy — Eligibility suspension | `TASK-ELIG-005`, `009`; `TASK-BOOKING-001` | Planned | — | Covered |
| `FR-ELIG-004` — eligibility recalculation | `.spec FR.01.2.3` / SRS `FR-031` | Dependency resolver; immutable decisions | Indirect | Read | Oversight | Fact/policy change creates new decision, never rewrite | Testing Strategy — Eligibility recalculation | `TASK-ELIG-005` | Planned | — | Covered |
| `FR-ELIG-005` — most-restrictive eligibility gate | `.spec FR.01.2.4` / SRS `FR-038` | Eligibility evaluator/gate results | Read safe result | Read safe result | Oversight/detail by scope | Shared decision result | Testing Strategy — Eligibility gates | `TASK-ELIG-004` | Planned | `Q-ELIG-001` for approved production thresholds | Covered |
| `FR-ELIG-006` — periodic/event reevaluation | `.spec FR.01.2.5` / SRS `FR-039` | Jobs + synchronous booking revalidation | Indirect | Read | Oversight | Recalculation affects search/booking/work queues | Testing Strategy — Eligibility/recalculation | `TASK-ELIG-005`, `TASK-PLATFORM-004` | Planned | — | Covered |
| `FR-ELIG-007` — service activation evidence | `.spec FR.02.1.1` / SRS `FR-010` | `API-ELIG-003`/`004` if external; ERD activation/evidence | — | Action | Action/Oversight verification | Clinic submission → Admin verification → evaluator | Testing Strategy — Evidence/Eligibility | `TASK-ELIG-001`, `002`, `007`, `008`; `TASK-PLATFORM-002`, `006` | Planned | Evidence provider `Q-PLATFORM-003` | Covered |
| `FR-ELIG-008` — pending evaluation for insufficient evidence | `.spec FR.02.2.1` / SRS `FR-012` | `ERR-ELIG-002`; evaluator state; safe explanation | Read safe status | Read blockers | Oversight | Missing evidence propagates PENDING, never `F` | Testing Strategy — pending-vs-F | `TASK-ELIG-004`, `009`, `011` | Planned | — | Covered |
| `FR-ELIG-009` — actual price as source input | `.spec FR.02.2.2` / SRS `FR-013` | ERD provider prices; eligibility policy resolver | Read safe price | Action | Oversight | Clinic price change → future P/evaluation, not historical rewrite | Testing Strategy — Pricing/Eligibility | `TASK-ELIG-003`, `TASK-FINANCE-004` | Planned | `Q-ELIG-001` for production bands | Covered |
| `FR-ELIG-010` — automatic protection selection | `.spec FR.02.2.3` / SRS `FR-014` | Eligibility H policy; accepted snapshots | Read safe meaning | Read safe meaning | Oversight | System-derived protection flows into accepted snapshot/claims | Testing Strategy — Eligibility/Protection | `TASK-ELIG-003`, `004` | Planned | `Q-ELIG-001`; V1 non-funded | Covered |
| `FR-ELIG-011` — S score and immutable snapshot | `.spec FR.02.2.4` / SRS `FR-036` | Eligibility decision snapshot | Safe explanation only | Safe result | Scoped detail | Same immutable decision underlies all projections | Testing Strategy — S/P/H/I | `TASK-ELIG-003`, `004`, `006` | Planned | `Q-ELIG-001` | Covered |
| `FR-ELIG-012` — confidence and grade cap | `.spec FR.02.2.5` / SRS `FR-037` | Versioned evaluator policy | Safe result | Safe result | Scoped detail | Derived outcome only; no platform override | Testing Strategy — formula boundaries | `TASK-ELIG-003`, `004` | Planned | `Q-ELIG-001` | Covered |
| `FR-ELIG-013` — grade bands and F separation | `.spec FR.02.2.6` / SRS `FR-040` | Versioned scientific-grade policy | Safe result | Safe result | Scoped detail | `PENDING_EVALUATION` remains separate across all projections | Testing Strategy — grade boundaries | `TASK-ELIG-003`, `004` | Planned | `Q-ELIG-001` | Covered |
| `FR-ELIG-014` — automatic P from versioned price bands | `.spec FR.02.2.7` / SRS `FR-041` | price source + versioned P policy | Safe price meaning | Action price / Read P-safe | Scoped detail | Clinic price input → backend-derived P → patient-safe projection | Testing Strategy — P boundaries | `TASK-ELIG-003`, `004`; `TASK-FINANCE-004` | Planned | `Q-ELIG-001` | Covered |
| `FR-ELIG-015` — automatic H and I | `.spec FR.02.2.8` / SRS `FR-042` | versioned H/I policies; field filtering | H-safe meaning; I hidden | H-safe meaning; I hidden | Scoped detail | Same derived decision with role-filtered fields | Testing Strategy — H/I + privacy | `TASK-ELIG-003`, `004`, `006` | Planned | `Q-ELIG-001` | Covered |
| `FR-ELIG-016` — provider decision card | `.spec FR.03.1.1` / SRS `FR-004` | `API-ELIG-001`; patient-safe read model | Read | Read own status | Oversight | Shared decision produces role-specific cards/projections | Testing Strategy — Patient-safe eligibility | `TASK-ELIG-006`, `009`, `010` | Planned | — | Covered |
| `FR-ELIG-017` — eligibility explanation | `.spec FR.03.1.2` / SRS `FR-005` | `API-ELIG-002`; audit/reproduction | Read | Read | Oversight/detail | Same reason/provenance with field filtering | Testing Strategy — Explanation/privacy | `TASK-ELIG-006`, `009`, `011` | Planned | — | Covered |

## 5.4 Booking

| Requirement | Source | Design / Data / API | Patient | Clinic | Admin | Cross-Platform Behavior | Tests | Tasks | Implementation State | Gate / Open Item | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `FR-BOOKING-001` — booking request and safety revalidation | `.spec FR.04.1.1` / SRS `FR-006` | `API-BOOKING-001`–`003`; booking state machine; ERD slots/bookings | Action/Read | Action/Read | Oversight | Patient request → Clinic work → confirmation visible everywhere | Testing Strategy — Booking + 100-way concurrency | `TASK-BOOKING-001`, `003`–`005`, `007`, `008` | Planned | — | Covered |
| `FR-BOOKING-002` — cancellation and no-show | `.spec FR.04.1.2` / SRS `FR-033` | `API-BOOKING-005`; booking events/state machine | Action/Read | Action/Read | Oversight | Cancellation/no-show transition propagates; no hard delete | Testing Strategy — cancellation/no-show | `TASK-BOOKING-002`, `006`, `010` | Planned | Policy values versioned | Covered |
| `FR-BOOKING-003` — provider response/alternative/deadline | `.spec FR.04.2.1` / SRS `FR-007` | `API-BOOKING-004`; Clinic in-process actions | Action/Read | Action | Oversight | Clinic accept/reject/alternative → patient/Admin projections + notification | Testing Strategy — provider response/deadlines | `TASK-BOOKING-004`, `005`, `008`, `009` | Planned | — | Covered |

## 5.5 Clinical Case and Treatment

| Requirement | Source | Design / Data / API | Patient | Clinic | Admin | Cross-Platform Behavior | Tests | Tasks | Implementation State | Gate / Open Item | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `FR-CLINICAL-001` — clinician-authored treatment plan/stages/price | `.spec FR.05.1.1` / SRS `FR-008` | `API-CLINICAL-001`/`002`; ERD plan versions/stages | Read | Action | Oversight | Dentist proposes exact version → Patient can review | Testing Strategy — Clinical plan authorship | `TASK-CLINICAL-001`–`003`, `007`; `TASK-FINANCE-005` | Planned | No autonomous diagnosis/treatment plan | Covered |
| `FR-CLINICAL-002` — accepted terms snapshot/amendment | `.spec FR.05.2.1` / SRS `FR-009` | `API-CLINICAL-003`; immutable accepted snapshots | Action/Read | Read/propose amendment | Oversight | Patient acceptance creates immutable shared snapshot; amendment is new version | Testing Strategy — acceptance/immutability | `TASK-CLINICAL-003`, `004`, `008`; `TASK-FINANCE-001`, `005` | Planned | — | Covered |
| `FR-CLINICAL-003` — treatment-stage evidence | `.spec FR.07.1.1` / SRS `FR-023` | stage state machine; ERD evidence bindings | Read | Action | Oversight | Clinic stage/evidence update → patient timeline/Admin oversight | Testing Strategy — stage evidence | `TASK-CLINICAL-005`, `009`; `TASK-PLATFORM-006` | Planned | Evidence provider `Q-PLATFORM-003` | Covered |
| `FR-CLINICAL-004` — follow-up reminders | `.spec FR.07.2.1` / SRS `FR-024` | follow-up state/read model; notification intents | Read | Action/Read | Oversight | Follow-up due state shared; delivery failure does not change clinical state | Testing Strategy — Follow-up | `TASK-CLINICAL-006`, `009`; `TASK-OPS-004` | Planned | Notification provider `Q-PLATFORM-003` | Covered |
| `FR-CLINICAL-005` — unified patient case timeline | `.spec FR.07.2.2` / SRS `FR-034` | `API-CLINICAL-004`; case read model | Read | Read/Action where scoped | Oversight | One case truth with role-filtered timeline projections | Testing Strategy — Case/timeline access | `TASK-CLINICAL-001`, `002`, `006`, `007`, `009` | Planned | — | Covered |

## 5.6 Financial Records — External Activity Only

| Requirement | Source | Design / Data / API | Patient | Clinic | Admin | Cross-Platform Behavior | Tests | Tasks | Implementation State | Gate / Open Item | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `FR-FINANCE-001` — financial snapshot on acceptance/amendment | `.spec FR.05.2.2` / SRS `FR-043` | `API-FINANCE-001`; financial terms snapshot | Read/Accept-linked | Action proposal/Read | Oversight | Proposal → patient acceptance → immutable shared financial snapshot | Testing Strategy — Financial snapshots | `TASK-FINANCE-001`, `004`, `005`, `008`; `TASK-CLINICAL-004`, `008` | Planned | Zero-money boundary | Covered |
| `FR-FINANCE-002` — external payment reporting | `.spec FR.06.1.1` / SRS `FR-015` | `API-FINANCE-002`; append-only events | Action when party | Action when party | Oversight | Reporter creates one assertion visible to counterparties | Testing Strategy — External finance | `TASK-FINANCE-001`, `006`, `009` | Planned | No payment execution | Covered |
| `FR-FINANCE-003` — payment confirmation/dispute | `.spec FR.06.1.2` / SRS `FR-016` | `API-FINANCE-003`; append-only response | Action when counterparty | Action when counterparty | Scoped finance review | Confirmation/dispute appends event; original stays immutable | Testing Strategy — Finance confirm/dispute | `TASK-FINANCE-002`, `006`, `010` | Planned | — | Covered |
| `FR-FINANCE-004` — external refund confirmation | `.spec FR.06.1.3` / SRS `FR-019` | `API-FINANCE-004`; claim decision + finance event | Action when authorized | Action when authorized | Oversight | External execution reported after off-platform action; never platform refund | Testing Strategy — Refund execution | `TASK-FINANCE-003`, `007`, `011` | Planned | No money movement | Covered |
| `FR-FINANCE-005` — append-only financial events | `.spec FR.06.1.4` / SRS `FR-044` | ERD financial events; event-derived state | Read/Action | Read/Action | Oversight | All platforms read same event chain; corrections append | Testing Strategy — Event immutability/idempotency | `TASK-FINANCE-001`, `002`, `006`, `009`–`011` | Planned | — | Covered |
| `FR-FINANCE-006` — financial case timeline | `.spec FR.06.2.1` / SRS `FR-017` | `API-FINANCE-005`; case timeline | Read | Read | Oversight | Shared event chain projected with role filtering | Testing Strategy — Finance timeline | `TASK-FINANCE-001`, `006`, `008` | Planned | — | Covered |
| `FR-FINANCE-007` — explicit external-money boundary | `.spec FR.06.2.2` / SRS `FR-047` | SDD finance boundary; architecture tests | Read wording | Read/action external facts only | Oversight | No adapter may introduce capture/wallet/escrow/settlement/refund execution | Testing Strategy — Zero money movement | `TASK-FINANCE-001`–`003`, `006`–`011`; `TASK-PLATFORM-004`, `007`, `012` | Planned | Hard V1 boundary | Covered |

## 5.7 Reviews

| Requirement | Source | Design / Data / API | Patient | Clinic | Admin | Cross-Platform Behavior | Tests | Tasks | Implementation State | Gate / Open Item | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `FR-REVIEWS-001` — one verified review per completed experience | `.spec FR.08.1.1` / SRS `FR-025` | `API-REVIEWS-001`; ERD reviews | Action/Read | Read | Oversight | Patient review becomes shared verified review; R stays independent | Testing Strategy — Reviews | `TASK-REVIEWS-001`, `002`, `003` | Planned | — | Covered |
| `FR-REVIEWS-002` — review appeal/integrity | `.spec FR.08.2.1` / SRS `FR-026` | `API-REVIEWS-002` where external; review appeals | Action if policy permits | Action if affected party | Action/Oversight decision | Appeal is separate record; rating not rewritten | Testing Strategy — Review appeals | `TASK-REVIEWS-001`, `002` | Planned | Patient surface only if policy grants action | Covered |

## 5.8 Claims, Refund Requests, Sensitive Decisions, Appeals

| Requirement | Source | Design / Data / API | Patient | Clinic | Admin | Cross-Platform Behavior | Tests | Tasks | Implementation State | Gate / Open Item | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `FR-CLAIMS-001` — refund request | `.spec FR.09.1.1` / SRS `FR-018` | `API-CLAIMS-001`, `003`, `004`; ERD claims | Action/Read | Read/respond where relevant | Action/Oversight | Patient claim → Clinic relevant view → Admin review work | Testing Strategy — Claims/refunds | `TASK-CLAIMS-001`, `005`, `007`, `008`; `TASK-FINANCE-003` | Planned | No refund execution in platform | Covered |
| `FR-CLAIMS-002` — protection claim submission | `.spec FR.09.1.2` / SRS `FR-020` | `API-CLAIMS-002`–`004`; accepted H snapshot | Action/Read | Read/respond | Action/Oversight | Claim uses historical entitlement; shared workflow | Testing Strategy — Protection claims | `TASK-CLAIMS-001`, `005`, `007`, `008` | Planned | Protection remains non-funded V1 | Covered |
| `FR-CLAIMS-003` — evidence and deadlines | `.spec FR.09.2.1` / SRS `FR-021` | claim deadline events; evidence bindings; `ERR-CLAIMS-002` | Action/Read | Action/Read | Action/Oversight | Evidence/deadline state shared; extension appends event | Testing Strategy — Claim evidence/deadlines | `TASK-CLAIMS-002`, `005`, `007`, `008`; `TASK-PLATFORM-002`, `006` | Planned | Evidence provider `Q-PLATFORM-003` | Covered |
| `FR-CLAIMS-004` — sensitive human review | `.spec FR.09.2.2` / SRS `FR-022` | claim decisions; `PERMISSIONS_MATRIX`; SoD | Read decision | Read/respond; cannot self-adjudicate | **Action** scoped human decision | Human Admin decision becomes immutable shared result | Testing Strategy — Human review/SoD | `TASK-CLAIMS-003`, `005`, `008`, `009` | Planned | Human reviewer required | Covered |
| `FR-CLAIMS-005` — claim appeal | `.spec FR.09.2.3` / SRS `FR-026` | `API-CLAIMS-005`; claim appeals state machine | Action/Read | Action if eligible affected party | Action/Oversight independent review | Appeal creates separate history; original decision preserved | Testing Strategy — Claim appeals | `TASK-CLAIMS-004`, `006`, `008`, `009` | Planned | — | Covered |

## 5.9 Operations

| Requirement | Source | Design / Data / API | Patient | Clinic | Admin | Cross-Platform Behavior | Tests | Tasks | Implementation State | Gate / Open Item | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `FR-OPS-001` — operational work queues | `.spec FR.10.1.1` / SRS `FR-029` | ERD work items; monitoring; cross-platform work rules | Indirect | Read/Action scoped work | Action/Oversight | Work references source record; closing work never rewrites domain truth | Testing Strategy — Operations queues | `TASK-OPS-002`, `004`; domain tasks that emit work | Planned | — | Covered |
| `FR-OPS-002` — operational reporting | `.spec FR.14.1.1` / SRS `FR-035` | reporting read models; monitoring | — | Limited scoped data if approved | Action/Read | Reports derive from authoritative records, not duplicate truth | Testing Strategy — Reporting/metrics | `TASK-OPS-003`, `TASK-PLATFORM-004` | Planned | — | Covered |
| `FR-OPS-003` — launch readiness gate | `.spec FR.14.2.1` / PO-2026-08-23 | existing launch gates/publication; Admin governance | Indirect catalog result | Indirect activation availability | Action | Publication/readiness change propagates to catalog/Clinic availability | Testing Strategy — Launch gates | `TASK-OPS-001`, `TASK-CATALOG-001` | **Partial existing** | `Q-CATALOG-001` for clinical production approval | Covered |

## 5.10 Policy

| Requirement | Source | Design / Data / API | Patient | Clinic | Admin | Cross-Platform Behavior | Tests | Tasks | Implementation State | Gate / Open Item | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `FR-POLICY-001` — versioned policy lifecycle | `.spec FR.13.1.1` / PO-2026-08-23 | `STATE_MACHINES`; ERD policy versions | Indirect | Indirect | Action | Activated policy changes prospectively; historical snapshots remain bound | Testing Strategy — Policy lifecycle | `TASK-POLICY-001`, `TASK-CATALOG-001` | **Partial pattern existing** | — | Covered |
| `FR-POLICY-002` — historical decision reproduction | `.spec FR.13.2.1` / PO-2026-08-23 | policy snapshots; eligibility reproduction; integrity exceptions | Indirect | Read safe history | Action/Oversight | Reproduction never rewrites original result | Testing Strategy — Reproduction/integrity | `TASK-POLICY-001`, `TASK-ELIG-006`, `TASK-AUDIT-002` | Planned | — | Covered |

## 5.11 Audit and Retry Safety

| Requirement | Source | Design / Data / API | Patient | Clinic | Admin | Cross-Platform Behavior | Tests | Tasks | Implementation State | Gate / Open Item | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `FR-AUDIT-001` — sensitive decision/activity audit | `.spec FR.11.2.1` / SRS `FR-028` | ERD audit events; permissions; monitoring | Indirect | Indirect | Read scoped audit | Same authoritative mutation records actual actor across adapters | Testing Strategy — Audit/provenance | `TASK-AUDIT-001`; all sensitive domain tasks | Planned | — | Covered |
| `FR-AUDIT-002` — classification/financial audit | `.spec FR.11.2.2` / SRS `FR-046` | eligibility snapshots + finance events | Read safe history | Read safe history | Scoped audit/detail | Cross-platform projections derive from same immutable history | Testing Strategy — Eligibility/Finance audit | `TASK-AUDIT-001`, `TASK-ELIG-006`, `TASK-FINANCE-001` | Planned | — | Covered |
| `FR-AUDIT-003` — idempotent sensitive commands | `.spec FR.12.1.1` / SRS `FR-045` | idempotency records; API error `ERR-AUDIT-001` | Action | Action | Action | Retry cannot duplicate state; timeout reconciles from source truth | Testing Strategy — Idempotency/Concurrency | `TASK-AUDIT-002`, `003`; mutation tasks across all platforms | Planned | — | Covered |

---

# 6. Non-Functional Requirements

| Requirement | Source | Verification / Design Owners | Patient Impact | Clinic Impact | Admin Impact | Primary Tasks | Implementation State | Gate / Open Item | Status |
|---|---|---|---|---|---|---|---|---|---|
| `NFR-PLATFORM-001` — performance and scale | `.spec NFR.01` | Testing Strategy performance/concurrency; Infrastructure/Monitoring | API/search latency | scoped query performance | operational/report performance | `TASK-PLATFORM-004`, `007`, `012`; booking/search tasks | Planned | — | Covered |
| `NFR-PLATFORM-002` — availability, backup, recovery | `.spec NFR.02` | Infrastructure; Monitoring; recovery exercises | service availability | Filament availability | operations/recovery oversight | `TASK-PLATFORM-004`, `007`, `012` | Planned | Hosting `Q-OPS-001` | Covered |
| `NFR-IDENTITY-001` — authorization and tenant/scope isolation | `.spec NFR.03` | `PERMISSIONS_MATRIX`; auth tests | patient/guardian isolation | clinic/branch/case isolation | staff scope/SoD | `TASK-IDENTITY-001`, `002`, `004`, `006`, `007`; platform gates | Planned | — | Covered |
| `NFR-IDENTITY-002` — authentication/MFA/OTP safety | `.spec NFR.04` | Testing Strategy OTP/MFA; Configuration | OTP/session | privileged Clinic access where applicable | privileged Admin access | `TASK-IDENTITY-003`, `005`, `006` | Planned | Provider `Q-PLATFORM-003` | Covered |
| `NFR-PLATFORM-003` — private file/evidence security | `.spec NFR.05` | ERD evidence; Infrastructure; Permissions | authorized future evidence access | upload/read own scoped evidence | review/oversight evidence | `TASK-PLATFORM-002`, `006`, `012` | Planned | Provider/transport `Q-PLATFORM-003` | Covered |
| `NFR-PLATFORM-004` — privacy, retention, deletion | `.spec NFR.06` | ERD legal holds; Policy; Admin privacy ops | privacy semantics | scoped data lifecycle | retention/legal hold operations | `TASK-PLATFORM-003`, `012` | Planned | Legal validation `Q-PLATFORM-002` | Covered |
| `NFR-AUDIT-001` — audit/provenance integrity | `.spec NFR.07` | Audit design; Monitoring | actor-attributed patient actions | actor-attributed provider actions | reviewer/admin actions | `TASK-AUDIT-001`, `003` | Planned | — | Covered |
| `NFR-AUDIT-002` — concurrency and idempotency | `.spec NFR.08` | Booking/finance/claim tests; MySQL concurrency | safe retries | safe provider actions | safe operational actions | `TASK-AUDIT-002`, `003`; booking/finance/claim tasks | Planned | — | Covered |
| `NFR-PLATFORM-005` — Arabic, RTL, accessibility | `.spec NFR.09` | Testing Strategy accessibility/localization | Primary | Filament Arabic/RTL compatibility | Admin Arabic/RTL compatibility where required | `TASK-PLATFORM-011`, `007` | Planned | UX pipeline owns final presentation | Covered |
| `NFR-PLATFORM-006` — weak-connectivity resilience | `.spec NFR.10` | Mobile network/cache rules; API idempotency | Primary | browser retry semantics where relevant | operational retry semantics | `TASK-PLATFORM-009`, `010`, `012` | Planned | — | Covered |
| `NFR-PLATFORM-007` — maintainability/contract versioning | `.spec NFR.11` | Architecture/API contracts; Composer quality gates | stable `/api/v1` | shared actions, separate panel | shared actions, Admin panel | `TASK-PLATFORM-001`, `005`, `008`, `012` | Partial foundation existing | `CONFLICT-PLATFORM-001` resolved by verified stack usage | Covered |
| `NFR-PLATFORM-008` — observability/queue operations | `.spec NFR.12` | Monitoring; work queues; correlation IDs | safe correlation/error | work/notification visibility | operational monitoring | `TASK-PLATFORM-004`, `007`, `012`; `TASK-OPS-002`, `004` | Planned | Provider-specific delivery unresolved | Covered |
| `NFR-FINANCE-001` — zero money movement | `.spec NFR.13` | SDD finance boundary; architecture/tests | no payment/custody | no gateway/refund execution | no settlement/payout controls | all `TASK-FINANCE-*`; platform release gates | Planned | Hard V1 boundary | Covered |
| `NFR-AUDIT-003` — immutable snapshot/event integrity | `.spec NFR.14` | ERD/state machines/policy reproduction | accepted history read | append/version actions | oversight/reproduction | `TASK-AUDIT-001`, `002`; eligibility/clinical/finance/claim tasks | Planned | — | Covered |

---

# 7. Cross-Platform Completeness Checks

The following requirements are considered **cross-platform critical** because one platform initiates or governs a change that another platform must observe or act on:

| Capability | Initiating / Governing Surface | Required Other-Surface Effect | Canonical Behavior Reference |
|---|---|---|---|
| Service publication | Admin | Patient catalog + Clinic activation availability update from same published definition | `CROSS_PLATFORM_BEHAVIOR.md` — Catalog/Policy |
| Provider fact/evidence submission | Clinic | Admin verification work; eligibility reevaluation; Patient discovery changes only after authoritative decision | Eligibility/Activation |
| Eligibility suspension | System/Admin-governed inputs | Patient search/booking blocked; Clinic status updated; Admin work/oversight updated | Eligibility/Suspension |
| Booking creation | Patient | Clinic actionable request; Admin oversight | Booking |
| Booking provider response | Clinic | Patient booking state/actions update; Admin oversight | Booking |
| Booking cancellation/no-show | Patient or Clinic | Same authoritative transition visible to all scoped surfaces | Booking |
| Treatment-plan proposal | Clinic | Patient gets exact version for review; Admin scoped oversight | Clinical |
| Treatment-plan acceptance | Patient/Guardian | Clinic sees accepted state; Admin can inspect immutable snapshot | Clinical |
| Stage completion/follow-up | Clinic | Patient timeline updates; Admin scoped operations update | Clinical |
| External financial report | Patient or Clinic | Counterparty sees response action; Admin finance oversight sees same event | Finance |
| Financial confirm/dispute | Authorized counterparty | Both parties and Admin derive state from same event chain | Finance |
| Verified review | Patient | Clinic sees applicable review; Admin integrity workflow can inspect | Reviews |
| Review appeal | Affected party | Admin integrity workflow receives appeal; original review remains unchanged | Reviews |
| Refund/protection claim | Patient | Clinic sees relevant participation; Admin receives governed review work | Claims |
| Claim evidence response | Patient/Clinic | Admin review state updates from same evidence bindings | Claims/Evidence |
| Sensitive claim decision | Admin human reviewer | Patient and relevant Clinic see authorized decision projection | Claims/Decision |
| Claim appeal | Patient or eligible Clinic party | Admin independent appeal review receives same appeal record | Claims/Appeal |
| Permission/grant revocation | Authorized Admin/grantor/system | Access disappears on next protected request across affected adapters | Identity/Access |
| Notification failure | Delivery infrastructure | **No business state rollback**; state remains discoverable by authoritative refresh | Notifications |

A feature is not implementation-complete if its row above works only on the initiating platform.

# 8. Delete / Edit Traceability for Shared Records

The following implementation invariants must be enforced by the tasks associated with the owning requirements:

| Shared record | Required change model | Cross-platform consequence |
|---|---|---|
| Booking | State transition/event; no normal hard delete | Cannot disappear from Clinic/Admin when patient cancels; it becomes cancelled |
| Treatment plan | Draft edit; accepted amendment creates new version | Patient/Clinic/Admin retain accepted historical version |
| Eligibility decision | New immutable decision | Search/Clinic/Admin move to new effective decision without rewriting history |
| Financial event | Append confirmation/dispute/correction/execution event | All surfaces derive from ordered history |
| Claim decision | Immutable decision + separate appeal | Patient/Clinic see later appeal outcome without original rewrite |
| Review | Governed active/retired/integrity workflow | Clinic/Admin cannot directly overwrite patient rating |
| Guardian/staff grant | Revoke/expire | New access denied everywhere; past actor attribution retained |
| Evidence | Governed lifecycle/retention | Removing availability cannot erase historical decision provenance improperly |
| Work item | Operational state only | Closing work never deletes/mutates source booking/claim/case by itself |
| Notification intent | Delivery/retry state only | Notification cleanup/failure never changes source domain state |

# 9. Implementation Coverage Summary

Under the approved `.spec` baseline:

- Functional requirements traced: **51 / 51**.
- Non-functional requirements traced: **14 / 14**.
- Business-rule IDs: **0 allocated**; explicit business behavior remains embedded in approved FR acceptance criteria and canonical domain documents rather than inventing new `BR-*` IDs during this pass.
- Total confirmed FR/NFR rows in this matrix: **65**.
- Rows with implementation task coverage: **65 / 65**.
- Rows with a defined verification method/scenario family: **65 / 65**.
- Rows marked `Uncovered`: **0**.
- Rows marked `Deprecated`: **0**.
- Rows marked requirement-level `Blocked`: **0** under the explicitly approved `.spec` continuation baseline.
- Full authoritative SRS v1.1 reconciliation: **Blocked by `Q-PLATFORM-001`** until readable authoritative content is available.
- Production clinical catalog readiness: governed by `Q-CATALOG-001`.
- Production S/P/H/I numerical/clinical policy readiness: governed by `Q-ELIG-001`.

These counts describe documentation traceability. They do **not** state that the planned V1 code has already been implemented.

# 10. Known Traceability Maintenance Required Before Phase 4

Phase 3 is not mechanically closed yet. Before a clean Phase 4 verification run, perform these registry-maintenance actions without renumbering existing IDs:

1. allocate concrete `TC-*` IDs in `docs/TESTING_STRATEGY.md` for the executable scenario families already defined there;
2. update this matrix's `Tests` cells to reference those concrete `TC-*` IDs;
3. synchronize `TASK-*`, `API-*`, `ERR-*`, and new `TC-*` highest allocated values into `docs/README.md`;
4. retain `CONFLICT-CATALOG-001` as an allocated historical ID but update its status to resolved because the currently verified route and current OpenAPI agree on `API-CATALOG-001`;
5. keep `Q-PLATFORM-001`, `Q-CATALOG-001`, `Q-ELIG-001`, `Q-PLATFORM-002`, `Q-OPS-001`, and `Q-PLATFORM-003` visible with their current severity/meaning;
6. run the generated validator only after the registry/test-ID synchronization, otherwise TC and stale-registry failures are expected rather than informative.

# 11. Forward / Backward Traceability Rules

Future implementation and documentation changes must preserve all of the following:

- every new confirmed `FR-*` or `NFR-*` receives a source, design owner, task, and test mapping;
- every cross-platform requirement identifies affected Patient/Clinic/Admin behavior or explicitly marks a platform not applicable;
- every new `TASK-*` references at least one owning requirement;
- every new `API-*` and `ERR-*` references at least one requirement;
- every executable `TC-*` references the requirement(s) it verifies;
- shared records are never duplicated into platform-specific sources of truth;
- state transitions remain owned by `STATE_MACHINES.md`;
- authorization remains owned by `PERMISSIONS_MATRIX.md`;
- cross-platform propagation remains owned by `CROSS_PLATFORM_BEHAVIOR.md`;
- implementation order remains owned by `IMPLEMENTATION_PLAN.md`;
- this file records coverage, not new product behavior.

## 12. Phase 3 Continuation

The originally planned next artifact is `docs/scripts/validate_docs.py`, but generating it **before** concrete `TC-*` allocation and registry synchronization would knowingly produce avoidable failures.

The safe remaining Phase 3 sequence is therefore:

1. update `docs/TESTING_STRATEGY.md` with concrete append-only `TC-*` definitions;
2. synchronize `docs/README.md` ID registry and resolved conflict status;
3. update this matrix to replace scenario-family test references with concrete `TC-*` IDs;
4. generate `docs/scripts/validate_docs.py`;
5. run Phase 4 mechanical verification and repair any remaining inconsistencies.
