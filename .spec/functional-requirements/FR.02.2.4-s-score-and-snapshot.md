## FR.02.2.4: S Score and Snapshot

## Requirement

**ID:** FR.02.2.4  
**Authoritative SRS ID:** FR-036  
**Title:** S Score and Snapshot  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall compute the service-specific scientific S score from versioned, clinically approved weighted criteria and persist an immutable snapshot of the inputs, weights, calculation, result, and policy.

## Traceability

| Traces To | ID | Description |
|---|---|---|
| Customer Need | CN.02.2 | Doctors, reviewers, and UberTib management need the platform to show the computed result, its reasons, confidence, and policy after facts are approved. |
| Customer Problem | CP.02 | See the approved customer-problem baseline. |
| Authoritative SRS | FR-036 | Preserved requirement identity from UberTib SRS v1.1 |

## Acceptance Criteria

- [ ] Only clinically approved active criteria and weights for the exact service domain and policy period participate in S.
- [ ] The persisted calculation can be reproduced deterministically from its snapshot.
- [ ] A weight or formula change creates a new policy version and never changes an existing S decision.

## Implementation Notes

Construction details belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*

