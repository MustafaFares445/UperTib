## FR.09.1.1: Refund Request

## Requirement

**ID:** FR.09.1.1  
**Authoritative SRS ID:** FR-018  
**Title:** Refund Request  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall allow an authorized case party to request a refund related to a booking or treatment case and route it for operational review and external execution.

## Traceability

| Traces To | ID | Description |
|---|---|---|
| Customer Need | CN.09.1 | Patients and doctors need UberTib to open a booking-related issue and route it to complaint, dispute, refund, or protection-claim handling according to its type. |
| Customer Problem | CP.09 | See the approved customer-problem baseline. |
| Authoritative SRS | FR-018 | Preserved requirement identity from UberTib SRS v1.1 |

## Acceptance Criteria

- [ ] The request records the case, requested amount and currency, reason, claimant, occurrence context, evidence, and submission time.
- [ ] The platform validates the request against the accepted financial-terms snapshot and applicable deadline policy.
- [ ] Approval creates an amount due for external execution and never moves money within UberTib.

## Implementation Notes

Construction details belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*

