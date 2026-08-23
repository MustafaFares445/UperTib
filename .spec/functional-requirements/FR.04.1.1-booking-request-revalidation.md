## FR.04.1.1: Booking Request and Revalidation

## Requirement

**ID:** FR.04.1.1  
**Authoritative SRS ID:** FR-006  
**Title:** Booking Request and Revalidation  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall accept a booking request only after revalidating provider-service-branch eligibility and slot capacity at submission and shall revalidate them again before confirmation.

## Traceability

| Traces To | ID | Description |
|---|---|---|
| Customer Need | CN.04.1 | Patients, doctors, and clinics need booking state controlled from request through completion or cancellation. |
| Customer Problem | CP.04 | All appointment parties need a reliable shared lifecycle that prevents invalid or conflicting bookings. |
| Authoritative SRS | FR-006 | Preserved requirement identity from UberTib SRS v1.1 |

## Acceptance Criteria

- [ ] A request is rejected when eligibility, branch readiness, service publication, or slot capacity is no longer valid.
- [ ] Concurrent requests cannot confirm beyond the configured slot capacity.
- [ ] A stale or repeated command obeys the approved idempotency and workflow-state rules.

## Implementation Notes

Construction details belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*
