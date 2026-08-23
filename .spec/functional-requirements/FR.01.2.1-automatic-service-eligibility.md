## FR.01.2.1: Automatic Service Eligibility

## Requirement

**ID:** FR.01.2.1  
**Authoritative SRS ID:** FR-011  
**Title:** Automatic Service Eligibility  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall determine a doctor’s eligibility for a specific service, branch, and policy period automatically from approved facts and the effective versioned S/P/H/I policy, without permitting a user to enter the final eligibility result.

## Traceability

| Traces To | ID | Description |
|---|---|---|
| Customer Need | CN.01.2 | The UberTib operations team needs the platform to control each doctor’s eligibility for a specific service and branch whenever an influential fact changes and before every booking is finalized. |
| Customer Problem | CP.01 | See the approved customer-problem baseline. |
| Authoritative SRS | FR-011 | Preserved requirement identity from UberTib SRS v1.1 |

## Acceptance Criteria

- [ ] The decision is scoped to exactly one doctor, service, branch, and effective policy period.
- [ ] The decision records the effective policy version, input facts, component results, final result, reasons, and evaluation time.
- [ ] No user-facing or administrative workflow can directly set or override the computed final eligibility result.

## Implementation Notes

Construction details belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*

