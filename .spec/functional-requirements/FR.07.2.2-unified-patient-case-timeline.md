## FR.07.2.2: Unified Patient Case Timeline

## Requirement

**ID:** FR.07.2.2  
**Authoritative SRS ID:** FR-034  
**Title:** Unified Patient Case Timeline  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall present an authorized unified case timeline for booking, accepted terms, treatment stages, evidence, follow-ups, reviews, issues, and external financial records.

## Traceability

| Traces To | ID | Description |
|---|---|---|
| Customer Need | CN.07.2 | Patients, doctors, and medical reviewers need UberTib to show the complete treatment timeline, missing evidence, next follow-up, and final status. |
| Customer Problem | CP.07 | See the approved customer-problem baseline. |
| Authoritative SRS | FR-034 | Preserved requirement identity from UberTib SRS v1.1 |

## Acceptance Criteria

- [ ] Timeline events are ordered consistently, identify their source, and link to the governing snapshot or decision where applicable.
- [ ] Each role sees only permitted event metadata and payload fields.
- [ ] Corrections and reversals appear as later events and never erase the historical event being corrected.

## Implementation Notes

Construction details belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*

