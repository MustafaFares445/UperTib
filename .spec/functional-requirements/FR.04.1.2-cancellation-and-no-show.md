## FR.04.1.2: Cancellation and No-Show

## Requirement

**ID:** FR.04.1.2  
**Authoritative SRS ID:** FR-033  
**Title:** Cancellation and No-Show  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall handle appointment cancellation and no-show outcomes using versioned policy deadlines, reasons, actor permissions, and required downstream case actions.

## Traceability

| Traces To | ID | Description |
|---|---|---|
| Customer Need | CN.04.1 | Patients, doctors, and clinics need UberTib to control appointment state from request through completion or cancellation while preventing conflicts and revalidating eligibility and availability. |
| Customer Problem | CP.04 | See the approved customer-problem baseline. |
| Authoritative SRS | FR-033 | Preserved requirement identity from UberTib SRS v1.1 |

## Acceptance Criteria

- [ ] Cancellation validates actor authorization and records initiator, reason, time, previous state, and applicable policy snapshot.
- [ ] A no-show can be recorded only after the appointment’s policy-defined threshold and by an authorized party.
- [ ] Any financial, review-eligibility, or operational consequence is derived transparently and does not move money or rewrite earlier events.

## Implementation Notes

Construction details belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*

