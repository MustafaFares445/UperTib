## FR.01.2.4: Final Eligibility from the Most Restrictive Gate

## Requirement

**ID:** FR.01.2.4  
**Authoritative SRS ID:** FR-038  
**Title:** Final Eligibility from the Most Restrictive Gate  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall derive final service eligibility from the most restrictive applicable regulatory, credential, service, branch, scientific, price, protection, evidence, and launch-readiness gate.

## Traceability

| Traces To | ID | Description |
|---|---|---|
| Customer Need | CN.01.2 | The UberTib operations team needs the platform to control each doctor’s eligibility for a specific service and branch whenever an influential fact changes and before every booking is finalized. |
| Customer Problem | CP.01 | See the approved customer-problem baseline. |
| Authoritative SRS | FR-038 | Preserved requirement identity from UberTib SRS v1.1 |

## Acceptance Criteria

- [ ] Every applicable gate returns a machine-readable state and reason for the exact provider-service-branch context.
- [ ] A failing or pending mandatory gate cannot be overridden by a more favorable component score.
- [ ] The final decision records the controlling gate and all evaluated gate outcomes.

## Implementation Notes

Construction details belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*

