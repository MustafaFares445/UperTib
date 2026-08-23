# UberTib Engineering Documentation — Start Here

**Operating mode:** Existing Repository  
**Documentation baseline:** 2026-08-23  
**Canonical registry status:** Append-only. Never renumber, reuse, or repurpose an allocated ID.

## Reading Order

1. `AGENTS.md` — repository-wide documentation and engineering rules.
2. `docs/PRD.md` — confirmed product behavior, business rules, NFRs, acceptance criteria, and open items.
3. `docs/SDD.md` — technical design for the confirmed requirements.
4. Conditional engineering documents under `docs/architecture/`, `docs/api/`, `docs/database/`, `docs/domain/`, `docs/diagrams/`, and `docs/ops/`.
5. `docs/TESTING_STRATEGY.md` — verification design and `TC-*` registry.
6. `docs/IMPLEMENTATION_PLAN.md` — dependency-ordered `TASK-*` work.
7. `docs/TRACEABILITY_MATRIX.md` — evidence-based coverage and status.
8. `docs/scripts/validate_docs.py` — mechanical integrity validator.

## Role-Based Reading Paths

- **Implementing agent:** `AGENTS.md` → `docs/IMPLEMENTATION_PLAN.md` → the task's `FR-*`/`BR-*` in `docs/PRD.md` → `docs/SDD.md` → applicable API/data/state/permission documents.
- **Designer / UX pipeline:** `prompts/ux_00_conventions.md` → `docs/domain/PERMISSIONS_MATRIX.md` → `docs/domain/STATE_MACHINES.md` → acceptance criteria in `docs/PRD.md` → `docs/api/ERROR_CATALOG.md` → `docs/api/API_CONTRACTS.md` → `docs/database/ERD.md`.
- **Reviewer:** `docs/TRACEABILITY_MATRIX.md` → open `ASM-*`, `Q-*`, and `CONFLICT-*` index below → owning canonical documents.

## Design Sources

No Figma, XD, Sketch, brand-system, or business UI design source is authoritative for this engineering run. Existing Filament framework code is implementation evidence, not a design authority. Screen design, navigation, layout, components, wireframes, tokens, and user-flow design belong to the later UX pipeline.

## Source Priority

1. `.spec/decisions/` — explicit Product Owner decisions.
2. `Docs/UberTib_SRS_Etkan_v1.1.pdf` — authoritative SRS v1.1.
3. Approved `.spec/` requirements and traceability artifacts.
4. Current verified backend behavior under `UberTip-Backend/`.
5. `UberTip-Backend/specs/` feature specifications and OpenAPI evidence.
6. Other project documents.
7. Clearly marked engineering inference.

The SRS file is present in the repository, but the current GitHub connector did not return readable PDF text. `Q-PLATFORM-001` remains a Blocker for claims of full SRS reconciliation; Phase 0 continuation was explicitly approved by the Product Owner. Lower-priority material must not silently override the SRS.

## Source of Truth by Topic

| Topic | Canonical owner |
|---|---|
| Product behavior, BRs, NFRs, acceptance criteria | `docs/PRD.md` |
| Technical design and `TD-*` decisions | `docs/SDD.md` |
| Architecture/module boundaries | `docs/architecture/*` |
| API contracts | `docs/api/API_CONTRACTS.md` |
| Stable client/API errors | `docs/api/ERROR_CATALOG.md` |
| Persistent data | `docs/database/ERD.md` |
| Data movement | `docs/database/DFD.md` |
| Lifecycle transitions | `docs/domain/STATE_MACHINES.md` |
| Authorization | `docs/domain/PERMISSIONS_MATRIX.md` |
| Tests | `docs/TESTING_STRATEGY.md` |
| Implementation order | `docs/IMPLEMENTATION_PLAN.md` |
| Requirement coverage/status | `docs/TRACEABILITY_MATRIX.md` |
| ID registry, aliases, glossary | this file |

## Document Set

**Generated:** `AGENTS.md`, `docs/README.md`.  
**Phase 1 remaining:** `docs/PRD.md`, `docs/SDD.md`.  
**Applicable Phase 2:** `SYSTEM_ARCHITECTURE.md`, `COMPONENT_DESIGN.md`, `API_CONTRACTS.md`, `ERROR_CATALOG.md`, `ERD.md`, `DFD.md`, `STATE_MACHINES.md`, `PERMISSIONS_MATRIX.md`, `SEQUENCE_DIAGRAMS.md`, `CONFIGURATION.md`, `INFRASTRUCTURE.md`, `MONITORING.md`.  
**Phase 3:** `TESTING_STRATEGY.md`, `IMPLEMENTATION_PLAN.md`, `TRACEABILITY_MATRIX.md`, `docs/scripts/validate_docs.py`.  
**Omitted:** `docs/ux/SCREEN_INVENTORY.md` — no implemented business UI establishes authoritative screens and the Product Owner assigned screens/flows/navigation/layout/components to the UX pipeline.  
**Omitted currently:** `docs/integrations/INTEGRATION_CONTRACTS.md` — no concrete third-party provider contract is established; V1 explicitly forbids payment/custody integrations and current external-provider choices remain unresolved.

## Canonical Domains

| Domain | Ownership |
|---|---|
| `IDENTITY` | Accounts, authentication, verification, guardianship/family access, staff permission identity |
| `CATALOG` | Dental service catalog, service definitions, publication |
| `ELIG` | Provider/service/facility eligibility, S/P/H/I, confidence, grade caps |
| `BOOKING` | Booking lifecycle, revalidation, cancellation/no-show, provider response |
| `CLINICAL` | Treatment plans, accepted clinical terms, stages, evidence, follow-up, case timeline |
| `FINANCE` | External financial-event records, confirmations, disputes, refund assertions; never money movement in V1 |
| `REVIEWS` | Verified reviews and review appeals |
| `CLAIMS` | Refund/protection claims, evidence, human review, appeals |
| `OPS` | Operational queues, reporting, launch readiness |
| `POLICY` | Versioned policies/configuration and historical decision reproduction |
| `AUDIT` | Provenance, sensitive-decision audit, immutable history, idempotency |
| `PLATFORM` | Cross-cutting performance, availability, security, privacy, accessibility, resilience, maintainability, observability |

## Identifier Rules

Canonical forms are `FR-*`, `BR-*`, `NFR-*`, `DR-*`, `TD-*`, `ASM-*`, `Q-*`, `CONFLICT-*`, `API-*`, `TC-*`, `TASK-*`, and `ERR-*` using `PREFIX-DOMAIN-###`. `SCR-*` is reserved for the UX pipeline and is not allocated by this engineering run. Existing dotted IDs and SRS IDs remain permanent source aliases. Numbers are append-only within each prefix/domain; `000` means no allocation yet.

## ID Registry — Highest Allocated Number

| Domain | FR | BR | NFR | DR | TD | ASM | Q | CONFLICT | API | SCR | TC | TASK | ERR |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| IDENTITY | 003 | 000 | 002 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 000 |
| CATALOG | 001 | 000 | 000 | 000 | 000 | 000 | 001 | 001 | 000 | 000 | 000 | 000 | 000 |
| ELIG | 017 | 000 | 000 | 000 | 000 | 000 | 001 | 000 | 000 | 000 | 000 | 000 | 000 |
| BOOKING | 003 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 000 |
| CLINICAL | 005 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 000 |
| FINANCE | 007 | 000 | 001 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 000 |
| REVIEWS | 002 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 000 |
| CLAIMS | 005 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 000 |
| OPS | 003 | 000 | 000 | 000 | 000 | 000 | 001 | 000 | 000 | 000 | 000 | 000 | 000 |
| POLICY | 002 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 000 |
| AUDIT | 003 | 000 | 003 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 000 |
| PLATFORM | 000 | 000 | 008 | 000 | 000 | 000 | 004 | 002 | 000 | 000 | 000 | 000 | 000 |

## Functional Requirement Alias Migration

| Canonical ID | Existing dotted alias | SRS / decision alias |
|---|---|---|
| FR-ELIG-001 | FR.01.1.1 | FR-003 |
| FR-ELIG-002 | FR.01.2.1 | FR-011 |
| FR-ELIG-003 | FR.01.2.2 | FR-030 |
| FR-ELIG-004 | FR.01.2.3 | FR-031 |
| FR-ELIG-005 | FR.01.2.4 | FR-038 |
| FR-ELIG-006 | FR.01.2.5 | FR-039 |
| FR-ELIG-007 | FR.02.1.1 | FR-010 |
| FR-ELIG-008 | FR.02.2.1 | FR-012 |
| FR-ELIG-009 | FR.02.2.2 | FR-013 |
| FR-ELIG-010 | FR.02.2.3 | FR-014 |
| FR-ELIG-011 | FR.02.2.4 | FR-036 |
| FR-ELIG-012 | FR.02.2.5 | FR-037 |
| FR-ELIG-013 | FR.02.2.6 | FR-040 |
| FR-ELIG-014 | FR.02.2.7 | FR-041 |
| FR-ELIG-015 | FR.02.2.8 | FR-042 |
| FR-ELIG-016 | FR.03.1.1 | FR-004 |
| FR-ELIG-017 | FR.03.1.2 | FR-005 |
| FR-BOOKING-001 | FR.04.1.1 | FR-006 |
| FR-BOOKING-002 | FR.04.1.2 | FR-033 |
| FR-BOOKING-003 | FR.04.2.1 | FR-007 |
| FR-CLINICAL-001 | FR.05.1.1 | FR-008 |
| FR-CLINICAL-002 | FR.05.2.1 | FR-009 |
| FR-FINANCE-001 | FR.05.2.2 | FR-043 |
| FR-FINANCE-002 | FR.06.1.1 | FR-015 |
| FR-FINANCE-003 | FR.06.1.2 | FR-016 |
| FR-FINANCE-004 | FR.06.1.3 | FR-019 |
| FR-FINANCE-005 | FR.06.1.4 | FR-044 |
| FR-FINANCE-006 | FR.06.2.1 | FR-017 |
| FR-FINANCE-007 | FR.06.2.2 | FR-047 |
| FR-CLINICAL-003 | FR.07.1.1 | FR-023 |
| FR-CLINICAL-004 | FR.07.2.1 | FR-024 |
| FR-CLINICAL-005 | FR.07.2.2 | FR-034 |
| FR-REVIEWS-001 | FR.08.1.1 | FR-025 |
| FR-REVIEWS-002 | FR.08.2.1 | FR-026 |
| FR-CLAIMS-001 | FR.09.1.1 | FR-018 |
| FR-CLAIMS-002 | FR.09.1.2 | FR-020 |
| FR-CLAIMS-003 | FR.09.2.1 | FR-021 |
| FR-CLAIMS-004 | FR.09.2.2 | FR-022 |
| FR-CLAIMS-005 | FR.09.2.3 | FR-026 |
| FR-OPS-001 | FR.10.1.1 | FR-029 |
| FR-IDENTITY-001 | FR.10.2.1 | FR-027 |
| FR-IDENTITY-002 | FR.11.1.1 | FR-001 |
| FR-IDENTITY-003 | FR.11.1.2 | FR-032 |
| FR-AUDIT-001 | FR.11.2.1 | FR-028 |
| FR-AUDIT-002 | FR.11.2.2 | FR-046 |
| FR-AUDIT-003 | FR.12.1.1 | FR-045 |
| FR-CATALOG-001 | FR.12.2.1 | FR-002 |
| FR-POLICY-001 | FR.13.1.1 | PO-2026-08-23 |
| FR-POLICY-002 | FR.13.2.1 | PO-2026-08-23 |
| FR-OPS-002 | FR.14.1.1 | FR-035 |
| FR-OPS-003 | FR.14.2.1 | PO-2026-08-23 |

## NFR Alias Migration

| Canonical ID | Existing alias | Title |
|---|---|---|
| NFR-PLATFORM-001 | NFR.01 | Performance and Scale |
| NFR-PLATFORM-002 | NFR.02 | Availability, Backup, and Recovery |
| NFR-IDENTITY-001 | NFR.03 | Authorization and Tenant Isolation |
| NFR-IDENTITY-002 | NFR.04 | Authentication, MFA, and OTP Safety |
| NFR-PLATFORM-003 | NFR.05 | Private File and Evidence Security |
| NFR-PLATFORM-004 | NFR.06 | Privacy, Retention, and Deletion |
| NFR-AUDIT-001 | NFR.07 | Audit and Provenance Integrity |
| NFR-AUDIT-002 | NFR.08 | Concurrency and Idempotency |
| NFR-PLATFORM-005 | NFR.09 | Arabic, RTL, and Accessibility |
| NFR-PLATFORM-006 | NFR.10 | Weak-Connectivity Resilience |
| NFR-PLATFORM-007 | NFR.11 | Maintainability and Contract Versioning |
| NFR-PLATFORM-008 | NFR.12 | Observability and Queue Operations |
| NFR-FINANCE-001 | NFR.13 | Zero-Money-Movement Safety |
| NFR-AUDIT-003 | NFR.14 | Immutable Snapshot and Event Integrity |

## Canonical Glossary

| Canonical term | Meaning | Aliases / notes |
|---|---|---|
| Evaluation Catalog | Provisional service baseline used for evaluation before production clinical approval | 26 provisional records |
| Production Ready | Governed state after all applicable readiness conditions; not implied by catalog existence | launch-ready |
| Scientific Grade | `A/B/C/D/F`; `PENDING_EVALUATION` is a separate state | S |
| Pricing Class | Internal/versioned price-band classification; not an electronic charge | P |
| Protection Level | Versioned protection classification; V1 protection is non-funded | H |
| Risk Profile | Versioned doctor/provider risk classification | I |
| External Financial Event | Record of money activity performed outside UberTib | payment/refund assertion, confirmation, dispute |
| Financial Terms Snapshot | Immutable accepted financial terms and policy context | snapshot |
| Policy Version | Immutable/versioned rule set used to reproduce a historical decision | policy snapshot |

## Open ASM / Q / CONFLICT Index

No `ASM-*` has been allocated yet.

| ID | Severity | Status / decision needed |
|---|---|---|
| Q-PLATFORM-001 | Blocker | Obtain readable authoritative SRS v1.1 content before claiming complete SRS reconciliation. |
| CONFLICT-PLATFORM-001 | Major | Historical feature-plan stack differs from verified current Laravel/PHP/package constraints; canonical docs use verified repository facts and retain historical plan as evidence only. |
| CONFLICT-CATALOG-001 | Major | Feature/OpenAPI material is broader than the currently verified route/implementation surface; contract and implementation must remain separately classified. |
| Q-CATALOG-001 | Major | Licensed clinical approval of the 26 provisional records is still required before production medical readiness. |
| Q-ELIG-001 | Major | Production S/P/H/I formulas, weights, thresholds, deadlines, and defaults require licensed clinical approval. |
| Q-PLATFORM-002 | Major | Final retention/deletion periods require applicable legal/compliance validation. |
| Q-OPS-001 | Major | Production hosting/deployment topology/provider is not established. |
| Q-PLATFORM-003 | Major | Concrete OTP, malware-scanning/private-evidence, and other external providers are not selected. |
| Q-PLATFORM-004 | Minor | Treat low-thousands launch scope and the 10,000-user NFR envelope as expected population versus engineering headroom unless superseded. |
| CONFLICT-PLATFORM-002 | Major | Some `.spec` architecture-quality statements need final classification as NFR versus DR/TD after authoritative SRS reconciliation. |

## Status Vocabulary

Use `Implemented`, `Partially Implemented`, `Planned`, `Blocked`, or `Production Governance` when describing engineering state. `Covered` in the final traceability matrix is stricter: implementation and applicable test evidence must genuinely exist.