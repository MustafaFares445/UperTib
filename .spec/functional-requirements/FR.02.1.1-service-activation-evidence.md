## FR.02.1.1: Service Activation Request and Evidence

## Requirement

**ID:** FR.02.1.1  
**Authoritative SRS ID:** FR-010  
**Title:** Service Activation Request and Evidence  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall allow a doctor to request activation of a specific service at a specific branch by answering the versioned service questionnaire and submitting required evidence.

## Traceability

| Traces To | ID | Description |
|---|---|---|
| Customer Need | CN.02.1 | Doctors, verifiers, and reviewers need source-specific facts and evidence without manually entering S/P/H/I. |
| Customer Problem | CP.02 | UberTib must prevent manual selection or manipulation of computed classification and commercial outcomes. |
| Authoritative SRS | FR-010 | Preserved requirement identity from UberTib SRS v1.1 |

## Acceptance Criteria

- [ ] The request is bound to one doctor, service definition version, and branch.
- [ ] The request captures facts and evidence only and provides no control for selecting A/B/C/D/F, P, H, or I.
- [ ] Missing, rejected, expired, or conflicting evidence is returned as a reasoned requirement for correction or review.

## Implementation Notes

Construction details belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*
