## FR.01.2.2: Automatic Service Suspension

## Requirement

**ID:** FR.01.2.2  
**Authoritative SRS ID:** FR-030  
**Title:** Automatic Service Suspension  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall automatically suspend a doctor’s eligibility for an affected service and branch when a required credential, approved fact, policy condition, or evidence item becomes invalid, expired, revoked, or unavailable.

## Traceability

| Traces To | ID | Description |
|---|---|---|
| Customer Need | CN.01.2 | The UberTib operations team needs the platform to control each doctor’s eligibility for a specific service and branch whenever an influential fact changes and before every booking is finalized. |
| Customer Problem | CP.01 | See the approved customer-problem baseline. |
| Authoritative SRS | FR-030 | Preserved requirement identity from UberTib SRS v1.1 |

## Acceptance Criteria

- [ ] Suspension affects only the provider-service-branch scopes dependent on the invalid condition.
- [ ] The suspension records trigger, effective time, policy version, impacted scopes, and understandable reason.
- [ ] New bookings are blocked immediately after the suspension becomes effective, while existing bookings enter the configured review workflow.

## Implementation Notes

Construction details belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*

