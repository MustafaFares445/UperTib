## FR.01.1.1: Eligible Provider Search

## Requirement

**ID:** FR.01.1.1  
**Authoritative SRS ID:** FR-003  
**Title:** Eligible Provider Search  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall search doctors and branches by service, Aleppo area, and appointment time while returning only currently eligible provider-service-branch combinations.

## Traceability

| Traces To | ID | Description |
|---|---|---|
| Customer Need | CN.01.1 | Patients need to know doctors and branches currently eligible for the requested service. |
| Customer Problem | CP.01 | Patients must not be offered providers who are ineligible for the requested service and branch. |
| Authoritative SRS | FR-003 | Preserved requirement identity from UberTib SRS v1.1 |

## Acceptance Criteria

- [ ] Every returned result has current service, branch, facility, and regulatory eligibility at query time.
- [ ] Search filters by the requested service and supports configured area and availability criteria.
- [ ] A provider-service-branch combination that fails any mandatory gate is absent from bookable results and retains a reason for authorized review.

## Implementation Notes

Construction details belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*
