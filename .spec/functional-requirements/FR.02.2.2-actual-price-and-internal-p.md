## FR.02.2.2: Actual Price Recording and Internal P

## Requirement

**ID:** FR.02.2.2  
**Authoritative SRS ID:** FR-013  
**Title:** Actual Price Recording and Internal P  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall record actual provider prices as source facts and compute the internal P component from the effective versioned price-band policy without exposing P as a patient-facing scientific grade.

## Traceability

| Traces To | ID | Description |
|---|---|---|
| Customer Need | CN.02.2 | Doctors, reviewers, and UberTib management need the platform to show the computed result, its reasons, confidence, and policy after facts are approved. |
| Customer Problem | CP.02 | See the approved customer-problem baseline. |
| Authoritative SRS | FR-013 | Preserved requirement identity from UberTib SRS v1.1 |

## Acceptance Criteria

- [ ] Every actual price fact records service, doctor or clinic source, branch, currency, amount, effective period, and provenance.
- [ ] The computed P references the exact price-band policy version and the source price fact used.
- [ ] Patient-facing outputs present an understandable expected price or range and never label P as a quality or scientific grade.

## Implementation Notes

Construction details belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*

