## FR.07.1.1: Treatment Stage Evidence

## Requirement

**ID:** FR.07.1.1  
**Authoritative SRS ID:** FR-023  
**Title:** Treatment Stage Evidence  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall require the configured evidence and clinical stage facts before an authorized doctor can declare a treatment stage or case complete.

## Traceability

| Traces To | ID | Description |
|---|---|---|
| Customer Need | CN.07.1 | Doctors need UberTib to create interconnected treatment plans, stages, evidence, and follow-ups according to service requirements before declaring completion. |
| Customer Problem | CP.07 | See the approved customer-problem baseline. |
| Authoritative SRS | FR-023 | Preserved requirement identity from UberTib SRS v1.1 |

## Acceptance Criteria

- [ ] Required evidence is resolved from the accepted service and policy snapshot rather than a mutable current default.
- [ ] Completion is rejected while any mandatory stage, field, acknowledgment, or evidence item is absent or invalid.
- [ ] Every completion or reopening event records actor, time, reason, and the evidence set evaluated.

## Implementation Notes

Construction details belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*

