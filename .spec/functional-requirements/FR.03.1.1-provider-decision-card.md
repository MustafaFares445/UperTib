## FR.03.1.1: Provider Decision Card

## Requirement

**ID:** FR.03.1.1  
**Authoritative SRS ID:** FR-004  
**Title:** Provider Decision Card  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall provide a simplified provider card containing service-specific eligibility, actual or expected price, funded-protection availability, verified-experience rating, branch, and nearest available appointment.

## Traceability

| Traces To | ID | Description |
|---|---|---|
| Customer Need | CN.03.1 | Patients need practical eligibility, price, protection availability, rating, location, and appointment information. |
| Customer Problem | CP.03 | Patients need understandable information rather than unexplained internal scores when choosing care. |
| Authoritative SRS | FR-004 | Preserved requirement identity from UberTib SRS v1.1 |

## Acceptance Criteria

- [ ] The card is scoped to one doctor, service, and branch rather than a universal doctor profile.
- [ ] When funded protection is disabled, the card states that funded protection is not activated and shows no protected amount or promise.
- [ ] Internal risk values and raw I are not exposed as patient-facing ratings.

## Implementation Notes

Construction details belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*
