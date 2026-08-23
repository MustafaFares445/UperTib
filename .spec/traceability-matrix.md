# UberTib Requirements Traceability Matrix

**Date:** 2026-08-23  
**Direction:** Customer problem → customer need → functional requirement → quality constraint → implementation/test evidence

| Problem | Customer Need | Intended Outcome | Functional Requirements | Quality Requirements |
|---|---|---|---|---|
| CP.01 | CN.01.1 | Eligible provider discovery | [FR.01.1.1](functional-requirements/FR.01.1.1-eligible-provider-search.md) | [NFR.01](non-functional-requirements/NFR.01-performance-and-scale.md) |
| CP.01 | CN.01.2 | Provider-service-branch eligibility control | [FR.01.2.1](functional-requirements/FR.01.2.1-automatic-service-eligibility.md), [FR.01.2.2](functional-requirements/FR.01.2.2-automatic-service-suspension.md), [FR.01.2.3](functional-requirements/FR.01.2.3-eligibility-recalculation.md), [FR.01.2.4](functional-requirements/FR.01.2.4-most-restrictive-eligibility-gate.md), [FR.01.2.5](functional-requirements/FR.01.2.5-periodic-and-event-reevaluation.md) | — |
| CP.02 | CN.02.1 | Source facts and evidence without manual outcomes | [FR.02.1.1](functional-requirements/FR.02.1.1-service-activation-evidence.md) | [NFR.05](non-functional-requirements/NFR.05-private-file-and-evidence-security.md) |
| CP.02 | CN.02.2 | Computed outcomes, reasons, confidence, and policy | [FR.02.2.1](functional-requirements/FR.02.2.1-pending-evaluation-insufficient-evidence.md), [FR.02.2.2](functional-requirements/FR.02.2.2-actual-price-and-internal-p.md), [FR.02.2.3](functional-requirements/FR.02.2.3-automatic-protection-selection.md), [FR.02.2.4](functional-requirements/FR.02.2.4-s-score-and-snapshot.md), [FR.02.2.5](functional-requirements/FR.02.2.5-confidence-and-grade-cap.md), [FR.02.2.6](functional-requirements/FR.02.2.6-grade-bands-and-f-separation.md), [FR.02.2.7](functional-requirements/FR.02.2.7-automatic-p-versioned-price-bands.md), [FR.02.2.8](functional-requirements/FR.02.2.8-automatic-h-and-i.md) | — |
| CP.03 | CN.03.1 | Understandable patient decision information | [FR.03.1.1](functional-requirements/FR.03.1.1-provider-decision-card.md), [FR.03.1.2](functional-requirements/FR.03.1.2-eligibility-explanation.md) | [NFR.09](non-functional-requirements/NFR.09-arabic-rtl-and-accessibility.md) |
| CP.04 | CN.04.1 | Safe appointment lifecycle | [FR.04.1.1](functional-requirements/FR.04.1.1-booking-request-revalidation.md), [FR.04.1.2](functional-requirements/FR.04.1.2-cancellation-and-no-show.md) | [NFR.01](non-functional-requirements/NFR.01-performance-and-scale.md), [NFR.02](non-functional-requirements/NFR.02-availability-backup-and-recovery.md), [NFR.08](non-functional-requirements/NFR.08-concurrency-and-idempotency.md) |
| CP.04 | CN.04.2 | Appointment responses, deadlines, and exceptions | [FR.04.2.1](functional-requirements/FR.04.2.1-provider-booking-response.md) | — |
| CP.05 | CN.05.1 | Mutually accepted treatment and financial agreement | [FR.05.1.1](functional-requirements/FR.05.1.1-treatment-plan-stages-price.md) | — |
| CP.05 | CN.05.2 | Immutable historical agreement and policy | [FR.05.2.1](functional-requirements/FR.05.2.1-accepted-terms-snapshot.md), [FR.05.2.2](functional-requirements/FR.05.2.2-financial-snapshot-acceptance-amendment.md) | [NFR.14](non-functional-requirements/NFR.14-immutable-snapshot-and-event-integrity.md) |
| CP.06 | CN.06.1 | External payment/refund assertions and confirmation | [FR.06.1.1](functional-requirements/FR.06.1.1-external-payment-reporting.md), [FR.06.1.2](functional-requirements/FR.06.1.2-payment-confirmation-or-dispute.md), [FR.06.1.3](functional-requirements/FR.06.1.3-external-refund-confirmation.md), [FR.06.1.4](functional-requirements/FR.06.1.4-append-only-financial-events.md) | [NFR.08](non-functional-requirements/NFR.08-concurrency-and-idempotency.md), [NFR.13](non-functional-requirements/NFR.13-zero-money-movement-safety.md), [NFR.14](non-functional-requirements/NFR.14-immutable-snapshot-and-event-integrity.md) |
| CP.06 | CN.06.2 | Shared external financial truth | [FR.06.2.1](functional-requirements/FR.06.2.1-financial-case-timeline.md), [FR.06.2.2](functional-requirements/FR.06.2.2-explicit-external-money-boundary.md) | [NFR.13](non-functional-requirements/NFR.13-zero-money-movement-safety.md) |
| CP.07 | CN.07.1 | Linked treatment stages and evidence | [FR.07.1.1](functional-requirements/FR.07.1.1-treatment-stage-evidence.md) | [NFR.05](non-functional-requirements/NFR.05-private-file-and-evidence-security.md) |
| CP.07 | CN.07.2 | Complete case and follow-up timeline | [FR.07.2.1](functional-requirements/FR.07.2.1-follow-up-reminders.md), [FR.07.2.2](functional-requirements/FR.07.2.2-unified-patient-case-timeline.md) | [NFR.02](non-functional-requirements/NFR.02-availability-backup-and-recovery.md) |
| CP.08 | CN.08.1 | One verified review per completed experience | [FR.08.1.1](functional-requirements/FR.08.1.1-single-verified-review.md) | — |
| CP.08 | CN.08.2 | Review integrity and appeal | [FR.08.2.1](functional-requirements/FR.08.2.1-review-appeal.md) | — |
| CP.09 | CN.09.1 | Issue routing to the correct case workflow | [FR.09.1.1](functional-requirements/FR.09.1.1-refund-request.md), [FR.09.1.2](functional-requirements/FR.09.1.2-protection-claim-submission.md) | — |
| CP.09 | CN.09.2 | Evidence, deadlines, decisions, and appeals | [FR.09.2.1](functional-requirements/FR.09.2.1-claim-evidence-and-deadlines.md), [FR.09.2.2](functional-requirements/FR.09.2.2-sensitive-human-review.md), [FR.09.2.3](functional-requirements/FR.09.2.3-claim-appeal.md) | [NFR.05](non-functional-requirements/NFR.05-private-file-and-evidence-security.md), [NFR.13](non-functional-requirements/NFR.13-zero-money-movement-safety.md) |
| CP.10 | CN.10.1 | Prioritized operational queues | [FR.10.1.1](functional-requirements/FR.10.1.1-operational-work-queues.md) | [NFR.01](non-functional-requirements/NFR.01-performance-and-scale.md), [NFR.12](non-functional-requirements/NFR.12-observability-and-queue-operations.md) |
| CP.10 | CN.10.2 | Scoped permissions and separation of duties | [FR.10.2.1](functional-requirements/FR.10.2.1-scoped-staff-permissions.md) | [NFR.03](non-functional-requirements/NFR.03-authorization-and-tenant-isolation.md) |
| CP.11 | CN.11.1 | Least-privilege sensitive-data access | [FR.11.1.1](functional-requirements/FR.11.1.1-patient-account-contact-verification.md), [FR.11.1.2](functional-requirements/FR.11.1.2-guardian-and-family-grants.md) | [NFR.03](non-functional-requirements/NFR.03-authorization-and-tenant-isolation.md), [NFR.04](non-functional-requirements/NFR.04-authentication-mfa-and-otp.md), [NFR.05](non-functional-requirements/NFR.05-private-file-and-evidence-security.md), [NFR.06](non-functional-requirements/NFR.06-privacy-retention-and-deletion.md) |
| CP.11 | CN.11.2 | Sensitive activity and decision audit | [FR.11.2.1](functional-requirements/FR.11.2.1-sensitive-decision-audit.md), [FR.11.2.2](functional-requirements/FR.11.2.2-classification-financial-audit.md) | [NFR.03](non-functional-requirements/NFR.03-authorization-and-tenant-isolation.md), [NFR.06](non-functional-requirements/NFR.06-privacy-retention-and-deletion.md), [NFR.07](non-functional-requirements/NFR.07-audit-and-provenance-integrity.md) |
| CP.12 | CN.12.1 | Safe drafts, uploads, and retries | [FR.12.1.1](functional-requirements/FR.12.1.1-idempotent-sensitive-commands.md) | [NFR.04](non-functional-requirements/NFR.04-authentication-mfa-and-otp.md), [NFR.08](non-functional-requirements/NFR.08-concurrency-and-idempotency.md), [NFR.10](non-functional-requirements/NFR.10-weak-connectivity-resilience.md), [NFR.11](non-functional-requirements/NFR.11-maintainability-and-contract-versioning.md) |
| CP.12 | CN.12.2 | Arabic RTL accessible experience | [FR.12.2.1](functional-requirements/FR.12.2.1-understandable-service-catalog.md) | [NFR.09](non-functional-requirements/NFR.09-arabic-rtl-and-accessibility.md), [NFR.10](non-functional-requirements/NFR.10-weak-connectivity-resilience.md) |
| CP.13 | CN.13.1 | Versioned policy lifecycle | [FR.13.1.1](functional-requirements/FR.13.1.1-policy-version-lifecycle.md) | [NFR.11](non-functional-requirements/NFR.11-maintainability-and-contract-versioning.md) |
| CP.13 | CN.13.2 | Historical decision reproducibility | [FR.13.2.1](functional-requirements/FR.13.2.1-historical-decision-reproduction.md) | [NFR.02](non-functional-requirements/NFR.02-availability-backup-and-recovery.md), [NFR.06](non-functional-requirements/NFR.06-privacy-retention-and-deletion.md), [NFR.07](non-functional-requirements/NFR.07-audit-and-provenance-integrity.md), [NFR.14](non-functional-requirements/NFR.14-immutable-snapshot-and-event-integrity.md) |
| CP.14 | CN.14.1 | Operational visibility and metrics | [FR.14.1.1](functional-requirements/FR.14.1.1-operational-reporting.md) | [NFR.01](non-functional-requirements/NFR.01-performance-and-scale.md), [NFR.12](non-functional-requirements/NFR.12-observability-and-queue-operations.md) |
| CP.14 | CN.14.2 | Controlled launch readiness | [FR.14.2.1](functional-requirements/FR.14.2.1-launch-readiness-gate.md) | [NFR.02](non-functional-requirements/NFR.02-availability-backup-and-recovery.md), [NFR.11](non-functional-requirements/NFR.11-maintainability-and-contract-versioning.md), [NFR.12](non-functional-requirements/NFR.12-observability-and-queue-operations.md) |

## Authoritative SRS Coverage

| SRS Range | Derivative Coverage |
|---|---|
| FR-001–FR-025 | Preserved one-to-one as dotted functional requirements. |
| FR-026 | Split into independent review-appeal and claim-appeal requirements while preserving the source alias. |
| FR-027–FR-047 | Preserved one-to-one as dotted functional requirements. |
| SRS §§5.1, 17.3, 18, 19 and PO-2026-08-23 | Policy lifecycle, historical reproduction, launch gating, and measurable NFRs. |

## ZigZag Validation Rules

- Forward: every CP has at least one CN; every CN has at least one FR; every scoped quality constraint traces to one or more CNs.
- Backward: every FR and NFR identifies an approved CN and source baseline.
- Authoritative: all SRS FR-001 through FR-047 remain visible as source aliases.
- Evidence: implementation tasks and automated/manual tests must add their references without editing the approved requirement statement.

## Current Implementation Evidence

The first slice is an SRS-derived provisional evaluation baseline authorized by the independent [PO-2026-08-23 decision record](decisions/PO-2026-08-23-confirmed-defaults.md). Implementation status does not change the approved requirement statements.

| Requirement | Slice Status | Implementation and Verification Evidence | Remaining Scope |
|---|---|---|---|
| [FR.12.2.1](functional-requirements/FR.12.2.1-understandable-service-catalog.md) | Partial | [Seeder](../UberTip-Backend/database/seeders/ServiceSeeder.php), [API resources](../UberTip-Backend/app/Http/Resources/Api/V1/Catalog), [contract tests](../UberTip-Backend/tests/Feature/Api/V1/Catalog/ListServiceGroupsTest.php) | React Native RTL/accessibility and real availability states |
| [FR.13.1.1](functional-requirements/FR.13.1.1-policy-version-lifecycle.md) | Partial | [publication action](../UberTip-Backend/app/Actions/Catalog/PublishServiceDefinition.php), [definition model](../UberTip-Backend/app/Models/ServiceDefinition.php), [lifecycle tests](../UberTip-Backend/tests/Feature/Models/ServiceDefinitionTest.php) | Authenticated policy-owner workflow and non-catalog policies |
| [FR.14.2.1](functional-requirements/FR.14.2.1-launch-readiness-gate.md) | Partial | [approval action](../UberTip-Backend/app/Actions/Catalog/RecordServiceLaunchGateApproval.php), [credential model](../UberTip-Backend/app/Models/ClinicalReviewerCredential.php), [safety tests](../UberTip-Backend/tests/Feature/Models/ClinicalApprovalIntegrityTest.php) | Staff RBAC, private evidence workflow, provider/geographic scopes |
