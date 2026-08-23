## FR.05.1.1: Treatment Plan with Stages and Price

## Requirement

**ID:** FR.05.1.1  
**Authoritative SRS ID:** FR-008  
**Title:** Treatment Plan with Stages and Price  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall allow the treating doctor to create a treatment plan containing the service, clinical stages, stage prices, inclusions, exclusions, and applicable terms.

## Traceability

| Traces To | ID | Description |
|---|---|---|
| Customer Need | CN.05.1 | Doctor and patient need an agreed treatment and financial arrangement before execution. |
| Customer Problem | CP.05 | Treatment and commercial terms must remain explicit, accepted, and historically stable. |
| Authoritative SRS | FR-008 | Preserved requirement identity from UberTib SRS v1.1 |

## Acceptance Criteria

- [ ] Only an authorized treating clinician can author the clinical plan and its stages.
- [ ] The system identifies the plan as the clinician’s proposal and never as an autonomous platform diagnosis or treatment decision.
- [ ] A plan cannot be accepted while required service, stage, price, or policy information is missing.

## Implementation Notes

Construction details belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*
