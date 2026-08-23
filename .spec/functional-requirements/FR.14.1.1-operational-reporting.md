## FR.14.1.1: Operational Reporting

## Requirement

**ID:** FR.14.1.1  
**Authoritative SRS ID:** FR-035  
**Title:** Operational Reporting  
**Priority:** Should Have  
**Status:** Approved

### Statement

The UberTib system should provide scoped operational reports and metrics for queues, deadlines, exceptions, eligibility, evidence completeness, bookings, treatment progress, and external financial cases.

## Traceability

| Traces To | ID | Description |
|---|---|---|
| Customer Need | CN.14.1 | Operations managers and product owners need UberTib to show queue volumes, deadlines, exceptions, eligibility quality, documentation quality, and financial-case status periodically. |
| Customer Problem | CP.14 | See the approved customer-problem baseline. |
| Authoritative SRS | FR-035 | Preserved requirement identity from UberTib SRS v1.1 |

## Acceptance Criteria

- [ ] Every metric defines its population, time window, status rules, and last-refreshed time.
- [ ] Reports distinguish provisional or disputed data from confirmed operational facts.
- [ ] Exports and drill-downs enforce the same authorization, tenant isolation, and audit rules as interactive views.

## Implementation Notes

Construction details belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*

