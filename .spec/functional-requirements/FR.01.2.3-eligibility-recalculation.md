## FR.01.2.3: Eligibility Recalculation

## Requirement

**ID:** FR.01.2.3  
**Authoritative SRS ID:** FR-031  
**Title:** Eligibility Recalculation  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall recalculate affected eligibility decisions after an influential approved fact, evidence status, service rule, branch relationship, or policy version changes.

## Traceability

| Traces To | ID | Description |
|---|---|---|
| Customer Need | CN.01.2 | The UberTib operations team needs the platform to control each doctor’s eligibility for a specific service and branch whenever an influential fact changes and before every booking is finalized. |
| Customer Problem | CP.01 | See the approved customer-problem baseline. |
| Authoritative SRS | FR-031 | Preserved requirement identity from UberTib SRS v1.1 |

## Acceptance Criteria

- [ ] The recalculation scope is derived from explicit dependencies and does not reevaluate unrelated providers or services.
- [ ] A recalculation creates a new decision record and preserves all previous decisions.
- [ ] Material eligibility changes generate the configured operational notifications and booking-impact review items.

## Implementation Notes

Construction details belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*

