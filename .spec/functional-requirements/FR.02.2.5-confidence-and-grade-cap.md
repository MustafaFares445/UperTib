## FR.02.2.5: Confidence K/EU and Grade Cap

## Requirement

**ID:** FR.02.2.5  
**Authoritative SRS ID:** FR-037  
**Title:** Confidence K/EU and Grade Cap  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall compute confidence measures K and EU from evidence coverage and verification state and shall apply the effective confidence-based cap to the resulting scientific grade.

## Traceability

| Traces To | ID | Description |
|---|---|---|
| Customer Need | CN.02.2 | Doctors, reviewers, and UberTib management need the platform to show the computed result, its reasons, confidence, and policy after facts are approved. |
| Customer Problem | CP.02 | See the approved customer-problem baseline. |
| Authoritative SRS | FR-037 | Preserved requirement identity from UberTib SRS v1.1 |

## Acceptance Criteria

- [ ] Confidence inputs and their provenance are included in the immutable decision snapshot.
- [ ] Insufficient mandatory evidence yields PENDING_EVALUATION rather than being hidden by a grade cap.
- [ ] The result shows both the uncapped calculation and the applied cap reason to authorized reviewers.

## Implementation Notes

Construction details belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*

