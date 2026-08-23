## FR.09.1.2: Protection Claim Submission

## Requirement

**ID:** FR.09.1.2  
**Authoritative SRS ID:** FR-020  
**Title:** Protection Claim Submission  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall allow an eligible case party to submit a protection claim only when the immutable accepted terms snapshot includes an active applicable protection policy.

## Traceability

| Traces To | ID | Description |
|---|---|---|
| Customer Need | CN.09.1 | Patients and doctors need UberTib to open a booking-related issue and route it to complaint, dispute, refund, or protection-claim handling according to its type. |
| Customer Problem | CP.09 | See the approved customer-problem baseline. |
| Authoritative SRS | FR-020 | Preserved requirement identity from UberTib SRS v1.1 |

## Acceptance Criteria

- [ ] A claim cannot be submitted when the case snapshot contains no applicable protection entitlement.
- [ ] The claim records type, requested remedy, narrative, evidence, claimant, case, policy version, and submission time.
- [ ] Submission produces a reviewable claim state and does not promise or execute a monetary outcome.

## Implementation Notes

Construction details belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*

