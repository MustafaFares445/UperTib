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

1. `.spec/decisions/` explicit Product Owner decisions → 2. `Docs/UberTib_SRS_Etkan_v1.1.pdf` authoritative SRS v1.1 → 3. approved `.spec/` requirements and traceability artifacts → 4. current verified backend behavior under `UberTip-Backend/` → 5. `UberTip-Backend/specs/` feature specifications and OpenAPI evidence → 6. other project documents → 7. clearly marked engineering inference. A customer-supplied spreadsheet or reference document is candidate input at tier 6, never production policy.

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
| Catalog/pricing governance overview and owner map | `docs/domain/CATALOG_PRICING_GOVERNANCE.md` |
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
- **Omitted:** `docs/ux/SCREEN_INVENTORY.md` because no authoritative business UI exists yet, so the UX chain ran in Docs-Partial mode and derived its own screen model; and `docs/integrations/INTEGRATION_CONTRACTS.md` because no concrete third-party provider contract is approved and V1 has no payment/custody integration.
- **UX chain Phase 1 complete (2026-08-25):** `docs/ux/01-foundation/` defines 19 actors, 69 jobs, 165 screens and 103 flows across the Patient app, Clinic panel and Admin panel. Start at `docs/ux/README.md`.
- **Syria catalog/pricing reconciliation complete (2026-08-25):** `.spec/decisions/PO-2026-08-25-syria-catalog-pricing-governance.md` is reconciled across the canonical set; `docs/domain/CATALOG_PRICING_GOVERNANCE.md` section 13 is the owner map.

## Canonical Domains

| Domain | Ownership |
|---|---|
| `IDENTITY` | Accounts, verification, guardian/family access, staff/provider identity and grants |
| `CATALOG` | Service groups, patient-facing families, detailed procedures, mapping, definitions, commercial options, publication |
| `ELIG` | Provider/service/branch eligibility, provider price facts, market calibration, S/P/H/I, confidence, gates |
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
| IDENTITY | 003 | 000 | 002 | 000 | 000 | 001 | 001 | 000 | 006 | 038 | 007 | 007 | 004 |
| CATALOG | 003 | 000 | 000 | 000 | 000 | 000 | 001 | 001 | 001 | 011 | 007 | 004 | 000 |
| ELIG | 019 | 000 | 000 | 000 | 000 | 001 | 001 | 000 | 004 | 023 | 012 | 012 | 002 |
| BOOKING | 004 | 000 | 000 | 000 | 000 | 000 | 003 | 001 | 007 | 017 | 009 | 011 | 003 |
| CLINICAL | 007 | 000 | 000 | 000 | 000 | 000 | 001 | 000 | 004 | 019 | 009 | 012 | 002 |
| FINANCE | 007 | 000 | 001 | 000 | 000 | 000 | 000 | 000 | 005 | 012 | 008 | 012 | 001 |
| REVIEWS | 002 | 000 | 000 | 000 | 000 | 000 | 001 | 000 | 002 | 009 | 004 | 003 | 001 |
| CLAIMS | 005 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 005 | 013 | 007 | 009 | 002 |
| OPS | 003 | 000 | 000 | 000 | 000 | 000 | 002 | 000 | 000 | 006 | 005 | 004 | 000 |
| POLICY | 003 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 000 | 004 | 005 | 002 | 000 |
| AUDIT | 003 | 000 | 003 | 000 | 000 | 000 | 000 | 000 | 000 | 004 | 005 | 003 | 001 |
| PLATFORM | 001 | 000 | 008 | 000 | 000 | 001 | 008 | 002 | 002 | 009 | 013 | 013 | 005 |

`SCR-*`, `ASM-*` and the `Q-*` / `CONFLICT-*` increments above were allocated by the UX chain on 2026-08-25; see `docs/ux/PHASE_01_HANDOFF.md`. `FLOW-*` and `JTBD-*` are introduced by the UX chain and are append-only on the same terms as every other prefix.

### UX Chain Registry — Highest Allocated Number

| Domain | FLOW | JTBD | Domain | FLOW | JTBD |
|---|---:|---:|---|---:|---:|
| IDENTITY | 021 | 012 | FINANCE | 008 | 006 |
| ELIG | 016 | 009 | REVIEWS | 006 | 004 |
| BOOKING | 014 | 008 | CATALOG | 007 | 005 |
| CLINICAL | 010 | 007 | OPS | 004 | 003 |
| CLAIMS | 009 | 007 | PLATFORM | 004 | 004 |
| POLICY | 002 | 002 | AUDIT | 002 | 002 |

`WF-*` (Phase 2), `CMP-*`, `IX-*`, `TXT-*`, `A11Y-*` (Phase 3) and `WGT-*` (Phase 4) are not yet allocated. `SDC-*` staff interaction contracts keep their own append-only registry in `docs/domain/STAFF_INTERACTION_CONTRACTS.md` section 9 — 24 allocated across 11 domains.

**Registry snapshot:** 36 allocated `API-*` contracts, 21 `ERR-*` definitions, 92 `TASK-*` implementation tasks, and 91 concrete `TC-*` cases. Counts describe allocations, not completed code/tests.

## Functional Requirement Alias Map

- `IDENTITY`: `FR-IDENTITY-001↔FR.10.2.1↔FR-027`; `002↔FR.11.1.1↔FR-001`; `003↔FR.11.1.2↔FR-032`.
- `CATALOG`: `FR-CATALOG-001↔FR.12.2.1↔FR-002`; `002↔PO-2026-08-25-syria PO-SYRIA-03/04`; `003↔PO-2026-08-25-syria PO-SYRIA-02/13`.
- `ELIG`: `001↔FR.01.1.1↔FR-003`; `002↔FR.01.2.1↔FR-011`; `003↔FR.01.2.2↔FR-030`; `004↔FR.01.2.3↔FR-031`; `005↔FR.01.2.4↔FR-038`; `006↔FR.01.2.5↔FR-039`; `007↔FR.02.1.1↔FR-010`; `008↔FR.02.2.1↔FR-012`; `009↔FR.02.2.2↔FR-013`; `010↔FR.02.2.3↔FR-014`; `011↔FR.02.2.4↔FR-036`; `012↔FR.02.2.5↔FR-037`; `013↔FR.02.2.6↔FR-040`; `014↔FR.02.2.7↔FR-041`; `015↔FR.02.2.8↔FR-042`; `016↔FR.03.1.1↔FR-004`; `017↔FR.03.1.2↔FR-005`; `018↔PO-2026-08-25-syria PO-SYRIA-05/08`; `019↔PO-2026-08-25-syria PO-SYRIA-06/07`.
- `BOOKING`: `001↔FR.04.1.1↔FR-006`; `002↔FR.04.1.2↔FR-033`; `003↔FR.04.2.1↔FR-007`.
- `CLINICAL`: `001↔FR.05.1.1↔FR-008`; `002↔FR.05.2.1↔FR-009`; `003↔FR.07.1.1↔FR-023`; `004↔FR.07.2.1↔FR-024`; `005↔FR.07.2.2↔FR-034`; `006↔PO-2026-08-25-syria PO-SYRIA-11/12`; `007↔PO-2026-08-25-syria PO-SYRIA-10/11`.
- `FINANCE`: `001↔FR.05.2.2↔FR-043`; `002↔FR.06.1.1↔FR-015`; `003↔FR.06.1.2↔FR-016`; `004↔FR.06.1.3↔FR-019`; `005↔FR.06.1.4↔FR-044`; `006↔FR.06.2.1↔FR-017`; `007↔FR.06.2.2↔FR-047`.
- `REVIEWS`: `001↔FR.08.1.1↔FR-025`; `002↔FR.08.2.1↔FR-026`.
- `CLAIMS`: `001↔FR.09.1.1↔FR-018`; `002↔FR.09.1.2↔FR-020`; `003↔FR.09.2.1↔FR-021`; `004↔FR.09.2.2↔FR-022`; `005↔FR.09.2.3↔FR-026`.
- `OPS`: `001↔FR.10.1.1↔FR-029`; `002↔FR.14.1.1↔FR-035`; `003↔FR.14.2.1↔PO-2026-08-23`.
- `AUDIT`: `001↔FR.11.2.1↔FR-028`; `002↔FR.11.2.2↔FR-046`; `003↔FR.12.1.1↔FR-045`.
- `POLICY`: `001↔FR.13.1.1↔PO-2026-08-23`; `002↔FR.13.2.1↔PO-2026-08-23`; `003↔PO-2026-08-25-syria PO-SYRIA-09`.

## NFR Alias Map

- `IDENTITY`: `NFR-IDENTITY-001↔NFR.03 Authorization/Tenant Isolation`; `002↔NFR.04 Authentication/MFA/OTP`. `FINANCE`: `NFR-FINANCE-001↔NFR.13 Zero Money Movement`.
- `AUDIT`: `NFR-AUDIT-001↔NFR.07 Audit/Provenance`; `002↔NFR.08 Concurrency/Idempotency`; `003↔NFR.14 Immutable Snapshot/Event Integrity`.
- `PLATFORM`: `001↔NFR.01 Performance/Scale`; `002↔NFR.02 Availability/Backup/Recovery`; `003↔NFR.05 Private Files/Evidence`; `004↔NFR.06 Privacy/Retention/Deletion`; `005↔NFR.09 Arabic/RTL/Accessibility`; `006↔NFR.10 Weak Connectivity`; `007↔NFR.11 Maintainability/Contract Versioning`; `008↔NFR.12 Observability/Queues`.

## Canonical Glossary

| Term | Meaning |
|---|---|
| Evaluation Catalog | Provisional seeded evaluation baseline; candidate content, not clinical production approval, and its record count is not a product constant |
| Service Family | Patient-facing discovery/booking catalog layer; the existing `services` table |
| Procedure Item | Detailed clinician/billing catalog layer with its own billing unit and versioned clinical definition |
| Price Display Mode | Governed presentation of a provider price: free, fixed, from, range, or requires-plan |
| Market Observation | Governed evidence of a locality's prices; never a tariff and never a claimed average |
| Calibration State | Whether the effective price policy could classify at all; non-final states suppress `P`, never the provider's own price |
| Service Risk Level | Clinical risk metadata on a procedure definition; never `R`, and never a sole eligibility rule |
| Production Ready | Governed readiness after applicable gates; not implied by record existence |
| Scientific Grade / `S` | `A/B/C/D/F`; `PENDING_EVALUATION` is separate |
| Pricing Class / `P` | Internal versioned price-band classification; not a charge |
| Protection Level / `H` | Versioned non-funded V1 protection classification |
| Risk Profile / `I` | Internal versioned provider risk classification |
| External Financial Event | Record/assertion of money activity performed outside UberTib |
| Financial Terms Snapshot | Immutable accepted financial terms/policy context |
| Policy Version | Immutable/effective rule set used to reproduce historical decisions |

## Open ASM / Q / CONFLICT Index

Three `ASM-*` are allocated, all by UX chain Phase 1. `ASM-IDENTITY-001` (applicant contact verification precedes application content) and `ASM-ELIG-001` (booking may proceed directly from a provider result row) remain open assumptions; `ASM-PLATFORM-001` was resolved on 2026-08-25. Each is defined with what breaks if it is wrong in `docs/ux/01-foundation/UPSTREAM_GAPS.md` section 5, which is their canonical owner.

| ID | Severity | Status / decision needed |
|---|---|---|
| `Q-PLATFORM-001` | Blocker | Obtain readable authoritative SRS v1.1 before claiming complete SRS reconciliation. |
| `Q-CATALOG-001` | Major | Narrowed 2026-08-25. Catalog shape, governance and authority split are settled; licensed clinical approval is still required before provisional or imported candidate content becomes production medical content. |
| `Q-ELIG-001` | Major | Narrowed 2026-08-25. The `P` derivation shape is settled; production S/H/I formulas, weights, thresholds, grade bands and market-calibration thresholds require licensed clinical approval. |
| `Q-PLATFORM-002` | Major | Final retention/deletion periods require legal/compliance validation. |
| `Q-OPS-001` | Major | Production hosting/deployment topology/provider remains unresolved, now including the concrete storage, malware-scanning, OTP and notification-delivery vendors deferred from `Q-PLATFORM-003`. |
| `Q-PLATFORM-004` | Minor | Low-thousands launch expectation vs 10,000-user NFR is treated as expected load versus engineering headroom unless superseded. |
| `Q-PLATFORM-008` | Minor | Ratify or decline section 15.1 of the v2.1 UX reference as the UberTib brand palette. Design Sources above states no brand-system source is authoritative, yet it is the only documented UberTib visual decision. UX Phase 3 proceeds on it with two measured WCAG corrections; if declined, only the primitive colour layer changes. See `docs/ux/03-system/DESIGN_DIRECTION.md`. |
| `CONFLICT-PLATFORM-001` | Major | Historical stack assumptions differ from verified current Laravel/PHP/package stack; current repository facts govern implementation. |
| `CONFLICT-PLATFORM-002` | Major | Some `.spec` architecture-quality statements require final NFR vs DR/TD classification after SRS reconciliation. |

### Resolved Allocated Items

Permanently allocated, never reused or renumbered. Thirteen were closed on 2026-08-25 by `.spec/decisions/PO-2026-08-25-ux-phase1-reconciliation.md`; canonical detail lives in that decision and in the owner documents named below.

| ID | Resolved | Resolution |
|---|---|---|
| `CONFLICT-CATALOG-001` | Resolved (2026-08-24) | The verified `GET /api/v1/catalog/service-groups` route and current OpenAPI contract align. Broader feature-spec aspirations remain Planned, not implemented route evidence. |
| `Q-PLATFORM-003` | Resolved (2026-08-25) | `PO-UX-17`: evidence-transfer interaction is fixed and provider-neutral (`API-PLATFORM-001`, `STATE_MACHINES.md` section 21.1); notification surface confirmed as `FR-PLATFORM-001`. Vendor selection moved to `Q-OPS-001`. |
| `Q-PLATFORM-005` | 2026-08-25 | `PO-UX-09`: patient notification/attention centre confirmed as `FR-PLATFORM-001` and `API-PLATFORM-002`; four primary tabs unchanged. |
| `Q-PLATFORM-006` | 2026-08-25 | `PO-UX-07`: device, setting, interruption pattern and expertise confirmed for all six role classes. |
| `Q-PLATFORM-007` | 2026-08-25 | `PO-UX-18`: accepted research limitation, not a blocker. Usability testing remains recommended, not prerequisite. |
| `Q-OPS-002` | 2026-08-25 | `PO-UX-08`: work-item states are `OPEN`/`ASSIGNED`/`IN_PROGRESS`/`WAITING`/`COMPLETED`; escalation and overdue are flags. `STATE_MACHINES.md` section 20. |
| `Q-IDENTITY-001` | 2026-08-25 | `PO-UX-14`: legal-basis grant requires Admin Verification approval; `API-IDENTITY-006` and `SDC-IDENTITY-005`. A guardian cannot self-authorize. |
| `Q-REVIEWS-001` | 2026-08-25 | `PO-UX-10`: both the authoring patient/guardian and the affected provider may appeal eligibility/policy decisions; decided by an independent Review Integrity Reviewer. |
| `Q-BOOKING-001` | 2026-08-25 | `PO-UX-12`: decline or expiry closes the booking as `CANCELLED` with reason `ALTERNATIVE_DECLINED` or `ALTERNATIVE_EXPIRED`, with no patient penalty. |
| `Q-BOOKING-002` | 2026-08-25 | `PO-UX-13`: new non-terminal booking state `ELIGIBILITY_REVIEW`; returns to `CONFIRMED` or closes as `CANCELLED` reason `PROVIDER_ELIGIBILITY_SUSPENDED`. No override may make it attendable. |
| `Q-BOOKING-003` | 2026-08-25 | `PO-UX-15`: governed `RescheduleProposal` workflow confirmed as `FR-BOOKING-004`; generic booking editing stays prohibited. |
| `Q-CLINICAL-001` | 2026-08-25 | `PO-UX-16`: proposal carries a policy-governed `expires_at`, V1 default 7 calendar days, and goes stale early when a material governing fact changes. |
| `CONFLICT-BOOKING-001` | 2026-08-25 | `PO-UX-11`: `ERR-BOOKING-002` removed from `API-IDENTITY-005`. Guardian revocation is always immediate and no booking state may block it. |
| `ASM-PLATFORM-001` | 2026-08-25 | `PO-UX-09` confirmed the attention surface as required product behavior, so `SCR-PLATFORM-001` no longer rests on an assumption. |

## Status Vocabulary

- Engineering implementation: `Existing`, `Partial`, `Planned`, `Blocked`, or `Production Governance` as appropriate to the owning document.
- Test cases: `Existing`, `Partial`, or `Planned`; allocation never implies executable implementation.
- Traceability: `Covered` means design + implementation task + verification plan are present under the approved `.spec` baseline; implementation status is reported separately. `Q-PLATFORM-001` blocks a claim of complete authoritative-SRS reconciliation, not continued engineering documentation against approved available sources.
