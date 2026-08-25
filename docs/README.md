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
9. `docs/scripts/validate_docs.py` — mechanical documentation validator used to verify registry, traceability, counts, line budgets, and cross-document consistency.

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
- **Omitted:** `docs/ux/SCREEN_INVENTORY.md` because no authoritative business UI exists yet. The UX chain therefore ran in Docs-Partial mode and derived its own screen model.
- **UX chain Phase 1 complete (2026-08-25):** `docs/ux/01-foundation/` defines 19 actors, 62 jobs, 155 screens and 94 flows across the Patient app, Clinic panel and Admin panel. Start at `docs/ux/README.md`.
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
| IDENTITY | 003 | 000 | 002 | 000 | 000 | 001 | 001 | 000 | 005 | 036 | 007 | 007 | 004 |
| CATALOG | 001 | 000 | 000 | 000 | 000 | 000 | 001 | 001 | 001 | 009 | 005 | 002 | 000 |
| ELIG | 017 | 000 | 000 | 000 | 000 | 001 | 001 | 000 | 004 | 020 | 010 | 011 | 002 |
| BOOKING | 003 | 000 | 000 | 000 | 000 | 000 | 003 | 001 | 005 | 015 | 008 | 010 | 003 |
| CLINICAL | 005 | 000 | 000 | 000 | 000 | 000 | 001 | 000 | 004 | 019 | 007 | 009 | 001 |
| FINANCE | 007 | 000 | 001 | 000 | 000 | 000 | 000 | 000 | 005 | 012 | 008 | 011 | 001 |
| REVIEWS | 002 | 000 | 000 | 000 | 000 | 000 | 001 | 000 | 002 | 009 | 004 | 003 | 001 |
| CLAIMS | 005 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 005 | 013 | 007 | 009 | 002 |
| OPS | 003 | 000 | 000 | 000 | 000 | 000 | 002 | 000 | 000 | 006 | 005 | 004 | 000 |
| POLICY | 002 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 004 | 004 | 001 | 000 |
| AUDIT | 003 | 000 | 003 | 000 | 000 | 000 | 000 | 000 | 000 | 004 | 005 | 003 | 001 |
| PLATFORM | 000 | 000 | 008 | 000 | 000 | 001 | 007 | 002 | 000 | 008 | 012 | 012 | 004 |

`SCR-*`, `ASM-*`, and the `Q-*` / `CONFLICT-*` increments above were allocated by UX chain Phase 1 on 2026-08-25. See `docs/ux/PHASE_01_HANDOFF.md`.

### UX Chain Registry — Highest Allocated Number

`FLOW-*` and `JTBD-*` are introduced by the UX chain and are append-only on the same terms as every other prefix.

| Domain | FLOW | JTBD | Domain | FLOW | JTBD |
|---|---:|---:|---|---:|---:|
| IDENTITY | 020 | 011 | FINANCE | 008 | 006 |
| ELIG | 014 | 008 | REVIEWS | 005 | 003 |
| BOOKING | 012 | 007 | CATALOG | 005 | 003 |
| CLINICAL | 010 | 007 | OPS | 004 | 003 |
| CLAIMS | 009 | 007 | PLATFORM | 003 | 003 |
| POLICY | 002 | 002 | AUDIT | 002 | 002 |

`WF-*` (Phase 2), `CMP-*`, `IX-*`, `TXT-*`, `A11Y-*` (Phase 3) and `WGT-*` (Phase 4) are not yet allocated.

`SDC-*` staff interaction contracts keep their own append-only registry in `docs/domain/STAFF_INTERACTION_CONTRACTS.md` section 9 — 17 allocated across 11 domains.

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

Three `ASM-*` are allocated, all by UX chain Phase 1: `ASM-PLATFORM-001` (patient attention surface is the primary re-entry path), `ASM-IDENTITY-001` (applicant contact verification precedes application content), `ASM-ELIG-001` (booking may proceed directly from a provider result row). Each is defined with what breaks if it is wrong in `docs/ux/01-foundation/UPSTREAM_GAPS.md` section 5, which is their canonical owner.

| ID | Severity | Status / decision needed |
|---|---|---|
| `Q-PLATFORM-001` | Blocker | Obtain readable authoritative SRS v1.1 before claiming complete SRS reconciliation. |
| `Q-CATALOG-001` | Major | Licensed clinical approval required before the 26 provisional records become production medical content. |
| `Q-ELIG-001` | Major | Production S/P/H/I formulas, weights, thresholds, deadlines, and defaults require licensed clinical approval. |
| `Q-BOOKING-001` | Major | Define the canonical booking outcome when an `ALTERNATIVE_PROPOSED` appointment expires or the patient declines it; current sources define the deadline/acceptance requirement but not the resulting lifecycle state. |
| `Q-BOOKING-002` | Major | Define the existing-booking review workflow triggered when eligibility is suspended: responsible actor, booking-state effect, allowed outcomes, deadlines, and required notifications/work items remain unspecified. |
| `Q-PLATFORM-002` | Major | Final retention/deletion periods require legal/compliance validation. |
| `Q-OPS-001` | Major | Production hosting/deployment topology/provider remains unresolved. |
| `Q-PLATFORM-003` | Major | Concrete OTP/MFA, malware/private-evidence, notification, and other external providers remain unresolved. |
| `Q-PLATFORM-004` | Minor | Low-thousands launch expectation vs 10,000-user NFR is treated as expected load versus engineering headroom unless superseded. |
| `CONFLICT-PLATFORM-001` | Major | Historical stack assumptions differ from verified current Laravel/PHP/package stack; current repository facts govern implementation. |
| `CONFLICT-PLATFORM-002` | Major | Some `.spec` architecture-quality statements require final NFR vs DR/TD classification after SRS reconciliation. |
| `Q-OPS-002` | Major | Enumerate the operational work-item state vocabulary. `FR-OPS-001` requires work-item state to be visible to authorized staff and `SDC-OPS-001` names its commands, but `STATE_MACHINES.md` section 20 declines to finalize the states. Raised by UX Phase 1. |
| `Q-PLATFORM-005` | Major | Confirm whether a patient-facing notification or attention surface exists in V1. Twelve notification intents address the patient, no transport is assumed, and no `FR-*` establishes a patient inbox. Raised by UX Phase 1. |
| `Q-PLATFORM-006` | Major | Document device, setting, interruption pattern and product expertise for the actor categories. Undocumented for all 19 UI-bearing actors, and these drive density, target size and confirmation friction. Raised by UX Phase 1. |
| `Q-PLATFORM-007` | Major | No research input of any kind exists — no interviews, analytics or support tickets. The task frequency-by-criticality model rests on documented responsibility rather than observed behavior. Raised by UX Phase 1. |
| `Q-IDENTITY-001` | Major | Define the authorized legal-basis representation-grant workflow: which actor establishes a grant that the patient cannot consent to, on what evidence, and through which surface. Referenced by `PERMISSIONS_MATRIX.md` section 6 and `API-IDENTITY-004` but never defined. Raised by UX Phase 1. |
| `Q-REVIEWS-001` | Major | State whether a patient may appeal a review eligibility or publication decision. `TRACEABILITY_MATRIX.md` records the patient impact of `FR-REVIEWS-002` as conditional on an undefined policy. Raised by UX Phase 1. |
| `Q-BOOKING-003` | Minor | Decide whether V1 needs a governed reschedule for a confirmed booking. `CROSS_PLATFORM_BEHAVIOR.md` section 10.2 leaves rescheduling to separate specification, so the only path is cancel and rebook. Raised by UX Phase 1. |
| `Q-CLINICAL-001` | Minor | Decide whether a `PROPOSED` treatment plan expires, and whether a later price change invalidates an unaccepted proposal. `STATE_MACHINES.md` section 9 defines no deadline. Raised by UX Phase 1. |
| `CONFLICT-BOOKING-001` | Major | `API-IDENTITY-005` references `ERR-BOOKING-002` for a policy-blocked guardian-grant revocation, which would surface a booking-domain error and recovery path on a representation surface. `ERROR_CATALOG.md` section 8 already flags the reference for confirmation. Raised by UX Phase 1. |

### Resolved Allocated Conflict

`CONFLICT-CATALOG-001` remains permanently allocated but is **Resolved (2026-08-24)**: the currently verified `GET /api/v1/catalog/service-groups` route and current OpenAPI contract align. Broader feature-spec aspirations remain Planned rather than being treated as implemented route evidence.

## Status Vocabulary

- Engineering implementation: `Existing`, `Partial`, `Planned`, `Blocked`, or `Production Governance` as appropriate to the owning document.
- Test cases: `Existing`, `Partial`, or `Planned`; allocation never implies executable implementation.
- Traceability: `Covered` means design + implementation task + verification plan are present under the approved `.spec` baseline; implementation status is reported separately.
- `Q-PLATFORM-001` blocks a claim of complete authoritative-SRS reconciliation, not continued engineering documentation against approved available sources.