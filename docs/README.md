# UberTib Engineering Documentation — Start Here

**Operating mode:** Existing Repository  
**Documentation baseline:** 2026-08-24  
**Canonical registry:** Append-only. Never renumber, reuse, or repurpose an allocated ID.

## Reading Order

1. `AGENTS.md` — repository-wide engineering/documentation rules.
2. `docs/PRD.md` — product behavior, business rules, NFRs, acceptance criteria, and open items.
3. `docs/SDD.md` — technical design for confirmed requirements.
4. Phase 2 engineering owners under `docs/architecture/`, `docs/api/`, `docs/database/`, `docs/domain/`, `docs/diagrams/`, and `docs/ops/`.
5. `docs/domain/CROSS_PLATFORM_BEHAVIOR.md` — canonical Patient/Clinic/Admin propagation, notification/work, edit/delete behavior.
6. `docs/TESTING_STRATEGY.md` — verification strategy and concrete `TC-*` registry.
7. `docs/IMPLEMENTATION_PLAN.md` — canonical cross-platform execution order; detailed platform plans live under `docs/implementation/`.
8. `docs/TRACEABILITY_MATRIX.md` — requirement/design/platform/test/task coverage and current implementation status.
9. `docs/scripts/validate_docs.py` — mechanical documentation validator; generated after registry/traceability synchronization.

## Role-Based Reading Paths

- **Implementer:** `AGENTS.md` → `docs/IMPLEMENTATION_PLAN.md` → owning platform plan → requirement in `docs/PRD.md` → `docs/SDD.md` → applicable API/data/state/permission/cross-platform docs.
- **Reviewer / QA:** `docs/TRACEABILITY_MATRIX.md` → `docs/TESTING_STRATEGY.md` → `docs/domain/CROSS_PLATFORM_BEHAVIOR.md` → open `Q-*` / `CONFLICT-*` index below.
- **UX pipeline:** `prompts/ux_00_conventions.md` → permissions/state/cross-platform behavior → PRD acceptance criteria → API/error/data contracts. Engineering docs do not define final screens/layouts.

## Design Sources

No Figma, XD, Sketch, brand-system, or business UI source is authoritative for this engineering run. Existing Filament framework code is implementation evidence, not design authority. Final navigation/layout/components/wireframes/tokens remain downstream UX work.

## Source Priority

1. `.spec/decisions/` — explicit Product Owner decisions.
2. `Docs/UberTib_SRS_Etkan_v1.1.pdf` — authoritative SRS v1.1.
3. Approved `.spec/` requirements and traceability artifacts.
4. Current verified backend behavior under `UberTip-Backend/`.
5. `UberTip-Backend/specs/` feature specifications/OpenAPI evidence.
6. Other project documents.
7. Clearly marked engineering inference.

The repository SRS v1.1 is not readable through the current GitHub connector. `Q-PLATFORM-001` therefore remains a Blocker only for claims of complete SRS reconciliation; work continues against the approved `.spec` baseline and verified repository evidence without inventing missing SRS facts.

## Source of Truth by Topic

| Topic | Canonical owner |
|---|---|
| Product behavior / acceptance | `docs/PRD.md` |
| Technical design | `docs/SDD.md` |
| Architecture | `docs/architecture/*` |
| API / stable errors | `docs/api/API_CONTRACTS.md`, `docs/api/ERROR_CATALOG.md` |
| Persistent data / movement | `docs/database/ERD.md`, `docs/database/DFD.md` |
| Lifecycle / authorization | `docs/domain/STATE_MACHINES.md`, `docs/domain/PERMISSIONS_MATRIX.md` |
| Cross-platform propagation / shared-record mutation rules | `docs/domain/CROSS_PLATFORM_BEHAVIOR.md` |
| Ordering-sensitive interaction | `docs/diagrams/SEQUENCE_DIAGRAMS.md` |
| Configuration / infrastructure / monitoring | `docs/ops/*` |
| Tests / `TC-*` | `docs/TESTING_STRATEGY.md` |
| Execution / `TASK-*` | `docs/IMPLEMENTATION_PLAN.md` plus `docs/implementation/*` |
| Requirement coverage/status | `docs/TRACEABILITY_MATRIX.md` |
| IDs / aliases / glossary | this file |

## Document Set Status

- **Phase 1 complete:** `docs/PRD.md`, `docs/SDD.md`.
- **Phase 2 complete:** `SYSTEM_ARCHITECTURE`, `COMPONENT_DESIGN`, `API_CONTRACTS`, `ERROR_CATALOG`, `ERD`, `DFD`, `STATE_MACHINES`, `PERMISSIONS_MATRIX`, `SEQUENCE_DIAGRAMS`, `CONFIGURATION`, `INFRASTRUCTURE`, `MONITORING`.
- **Phase 3 complete:** `TESTING_STRATEGY`, three platform implementation plans, master `IMPLEMENTATION_PLAN`, `CROSS_PLATFORM_BEHAVIOR`, `TRACEABILITY_MATRIX`, and `docs/scripts/validate_docs.py`.
- **Phase 4 verification in progress:** the mechanical validator is currently clean with 0 failures / 0 warnings; manual evidence and consistency review is still in progress.
- **Omitted:** `docs/ux/SCREEN_INVENTORY.md` because no authoritative business UI exists yet.
- **Omitted currently:** `docs/integrations/INTEGRATION_CONTRACTS.md` because no concrete third-party provider contract is approved; V1 has no payment/custody integration.

## Canonical Domains

| Domain | Ownership |
|---|---|
| `IDENTITY` | Accounts, verification, guardian/family access, staff/provider identity and grants |
| `CATALOG` | Dental service catalog, definitions, publication |
| `ELIG` | Provider/service/branch eligibility, S/P/H/I, confidence, gates |
| `BOOKING` | Availability, booking lifecycle, provider response, cancellation/no-show |
| `CLINICAL` | Cases, clinician-authored plans, accepted snapshots, stages, evidence, follow-up |
| `FINANCE` | External financial records/confirmations/disputes/refund assertions; never money movement in V1 |
| `REVIEWS` | Verified reviews and review appeals |
| `CLAIMS` | Refund/protection claims, evidence, human decisions, appeals |
| `OPS` | Work queues, reporting, launch readiness |
| `POLICY` | Versioned/effective policies and historical reproduction |
| `AUDIT` | Provenance, audit, immutable history, integrity, idempotency |
| `PLATFORM` | Performance, availability, files/privacy, RTL/accessibility, resilience, maintainability, observability |

## Identifier Rules

Canonical forms are `FR-*`, `BR-*`, `NFR-*`, `DR-*`, `TD-*`, `ASM-*`, `Q-*`, `CONFLICT-*`, `API-*`, `TC-*`, `TASK-*`, and `ERR-*` using `PREFIX-DOMAIN-###`. `SCR-*` remains reserved for the UX pipeline. Existing dotted IDs/SRS aliases are permanent. `000` means no allocation.

## ID Registry — Highest Allocated Number

| Domain | FR | BR | NFR | DR | TD | ASM | Q | CONFLICT | API | SCR | TC | TASK | ERR |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| IDENTITY | 003 | 000 | 002 | 000 | 000 | 000 | 000 | 000 | 005 | 000 | 007 | 007 | 004 |
| CATALOG | 001 | 000 | 000 | 000 | 000 | 000 | 001 | 001 | 001 | 000 | 005 | 002 | 000 |
| ELIG | 017 | 000 | 000 | 000 | 000 | 000 | 001 | 000 | 004 | 000 | 010 | 011 | 002 |
| BOOKING | 003 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 005 | 000 | 008 | 010 | 003 |
| CLINICAL | 005 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 004 | 000 | 007 | 009 | 001 |
| FINANCE | 007 | 000 | 001 | 000 | 000 | 000 | 000 | 000 | 005 | 000 | 008 | 011 | 001 |
| REVIEWS | 002 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 002 | 000 | 004 | 003 | 001 |
| CLAIMS | 005 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 005 | 000 | 007 | 009 | 002 |
| OPS | 003 | 000 | 000 | 000 | 000 | 000 | 001 | 000 | 000 | 000 | 005 | 004 | 000 |
| POLICY | 002 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 004 | 001 | 000 |
| AUDIT | 003 | 000 | 003 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 005 | 003 | 001 |
| PLATFORM | 000 | 000 | 008 | 000 | 000 | 000 | 004 | 002 | 000 | 000 | 012 | 012 | 004 |

**Registry snapshot:** 31 allocated `API-*` contracts, 19 `ERR-*` definitions, 82 `TASK-*` implementation tasks, and 82 concrete `TC-*` cases. Counts describe allocations, not completed code/tests.

## Functional Requirement Alias Map

- `IDENTITY`: `FR-IDENTITY-001↔FR.10.2.1↔FR-027`; `002↔FR.11.1.1↔FR-001`; `003↔FR.11.1.2↔FR-032`.
- `CATALOG`: `FR-CATALOG-001↔FR.12.2.1↔FR-002`.
- `ELIG`: `001↔FR.01.1.1↔FR-003`; `002↔FR.01.2.1↔FR-011`; `003↔FR.01.2.2↔FR-030`; `004↔FR.01.2.3↔FR-031`; `005↔FR.01.2.4↔FR-038`; `006↔FR.01.2.5↔FR-039`; `007↔FR.02.1.1↔FR-010`; `008↔FR.02.2.1↔FR-012`; `009↔FR.02.2.2↔FR-013`; `010↔FR.02.2.3↔FR-014`; `011↔FR.02.2.4↔FR-036`; `012↔FR.02.2.5↔FR-037`; `013↔FR.02.2.6↔FR-040`; `014↔FR.02.2.7↔FR-041`; `015↔FR.02.2.8↔FR-042`; `016↔FR.03.1.1↔FR-004`; `017↔FR.03.1.2↔FR-005`.
- `BOOKING`: `001↔FR.04.1.1↔FR-006`; `002↔FR.04.1.2↔FR-033`; `003↔FR.04.2.1↔FR-007`.
- `CLINICAL`: `001↔FR.05.1.1↔FR-008`; `002↔FR.05.2.1↔FR-009`; `003↔FR.07.1.1↔FR-023`; `004↔FR.07.2.1↔FR-024`; `005↔FR.07.2.2↔FR-034`.
- `FINANCE`: `001↔FR.05.2.2↔FR-043`; `002↔FR.06.1.1↔FR-015`; `003↔FR.06.1.2↔FR-016`; `004↔FR.06.1.3↔FR-019`; `005↔FR.06.1.4↔FR-044`; `006↔FR.06.2.1↔FR-017`; `007↔FR.06.2.2↔FR-047`.
- `REVIEWS`: `001↔FR.08.1.1↔FR-025`; `002↔FR.08.2.1↔FR-026`.
- `CLAIMS`: `001↔FR.09.1.1↔FR-018`; `002↔FR.09.1.2↔FR-020`; `003↔FR.09.2.1↔FR-021`; `004↔FR.09.2.2↔FR-022`; `005↔FR.09.2.3↔FR-026`.
- `OPS`: `001↔FR.10.1.1↔FR-029`; `002↔FR.14.1.1↔FR-035`; `003↔FR.14.2.1↔PO-2026-08-23`.
- `AUDIT`: `001↔FR.11.2.1↔FR-028`; `002↔FR.11.2.2↔FR-046`; `003↔FR.12.1.1↔FR-045`.
- `POLICY`: `001↔FR.13.1.1↔PO-2026-08-23`; `002↔FR.13.2.1↔PO-2026-08-23`.

## NFR Alias Map

- `IDENTITY`: `NFR-IDENTITY-001↔NFR.03 Authorization/Tenant Isolation`; `002↔NFR.04 Authentication/MFA/OTP`.
- `FINANCE`: `NFR-FINANCE-001↔NFR.13 Zero Money Movement`.
- `AUDIT`: `NFR-AUDIT-001↔NFR.07 Audit/Provenance`; `002↔NFR.08 Concurrency/Idempotency`; `003↔NFR.14 Immutable Snapshot/Event Integrity`.
- `PLATFORM`: `001↔NFR.01 Performance/Scale`; `002↔NFR.02 Availability/Backup/Recovery`; `003↔NFR.05 Private Files/Evidence`; `004↔NFR.06 Privacy/Retention/Deletion`; `005↔NFR.09 Arabic/RTL/Accessibility`; `006↔NFR.10 Weak Connectivity`; `007↔NFR.11 Maintainability/Contract Versioning`; `008↔NFR.12 Observability/Queues`.

## Canonical Glossary

| Term | Meaning |
|---|---|
| Evaluation Catalog | Provisional 26-record evaluation baseline; not clinical production approval |
| Production Ready | Governed readiness after applicable gates; not implied by record existence |
| Scientific Grade / `S` | `A/B/C/D/F`; `PENDING_EVALUATION` is separate |
| Pricing Class / `P` | Internal versioned price-band classification; not a charge |
| Protection Level / `H` | Versioned non-funded V1 protection classification |
| Risk Profile / `I` | Internal versioned provider risk classification |
| External Financial Event | Record/assertion of money activity performed outside UberTib |
| Financial Terms Snapshot | Immutable accepted financial terms/policy context |
| Policy Version | Immutable/effective rule set used to reproduce historical decisions |

## Open ASM / Q / CONFLICT Index

No `ASM-*` is allocated.

| ID | Severity | Status / decision needed |
|---|---|---|
| `Q-PLATFORM-001` | Blocker | Obtain readable authoritative SRS v1.1 before claiming complete SRS reconciliation. |
| `Q-CATALOG-001` | Major | Licensed clinical approval required before the 26 provisional records become production medical content. |
| `Q-ELIG-001` | Major | Production S/P/H/I formulas, weights, thresholds, deadlines, and defaults require licensed clinical approval. |
| `Q-PLATFORM-002` | Major | Final retention/deletion periods require legal/compliance validation. |
| `Q-OPS-001` | Major | Production hosting/deployment topology/provider remains unresolved. |
| `Q-PLATFORM-003` | Major | Concrete OTP/MFA, malware/private-evidence, notification, and other external providers remain unresolved. |
| `Q-PLATFORM-004` | Minor | Low-thousands launch expectation vs 10,000-user NFR is treated as expected load versus engineering headroom unless superseded. |
| `CONFLICT-PLATFORM-001` | Major | Historical stack assumptions differ from verified current Laravel/PHP/package stack; current repository facts govern implementation. |
| `CONFLICT-PLATFORM-002` | Major | Some `.spec` architecture-quality statements require final NFR vs DR/TD classification after SRS reconciliation. |

### Resolved Allocated Conflict

`CONFLICT-CATALOG-001` remains permanently allocated but is **Resolved (2026-08-24)**: the currently verified `GET /api/v1/catalog/service-groups` route and current OpenAPI contract align. Broader feature-spec aspirations remain Planned rather than being treated as implemented route evidence.

## Status Vocabulary

- Engineering implementation: `Existing`, `Partial`, `Planned`, `Blocked`, or `Production Governance` as appropriate to the owning document.
- Test cases: `Existing`, `Partial`, or `Planned`; allocation never implies executable implementation.
- Traceability: `Covered` means design + implementation task + verification plan are present under the approved `.spec` baseline; implementation status is reported separately.
- `Q-PLATFORM-001` blocks a claim of complete authoritative-SRS reconciliation, not continued engineering documentation against approved available sources.
