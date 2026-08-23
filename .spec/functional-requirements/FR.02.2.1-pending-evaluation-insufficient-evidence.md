## FR.02.2.1: Pending Evaluation on Insufficient Evidence

## Requirement

**ID:** FR.02.2.1  
**Authoritative SRS ID:** FR-012  
**Title:** Pending Evaluation on Insufficient Evidence  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall assign PENDING_EVALUATION when required evidence or approved facts are insufficient to compute a service-specific result and shall keep that state distinct from grade F.

## Traceability

| Traces To | ID | Description |
|---|---|---|
| Customer Need | CN.02.2 | Doctors, reviewers, and UberTib management need the platform to show the computed result, its reasons, confidence, and policy after facts are approved. |
| Customer Problem | CP.02 | See the approved customer-problem baseline. |
| Authoritative SRS | FR-012 | Preserved requirement identity from UberTib SRS v1.1 |

## Acceptance Criteria

- [ ] A missing required fact or expired required evidence produces PENDING_EVALUATION rather than a scientific grade.
- [ ] The result identifies every blocking fact or evidence requirement in actionable form.
- [ ] Supplying and approving the missing inputs schedules or performs a new evaluation without rewriting the earlier decision record.

## Implementation Notes

Construction details belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*

