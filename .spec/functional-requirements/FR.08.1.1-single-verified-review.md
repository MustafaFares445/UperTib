## FR.08.1.1: Single Verified Review

## Requirement

**ID:** FR.08.1.1  
**Authoritative SRS ID:** FR-025  
**Title:** Single Verified Review  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall permit one review per eligible patient experience only after verified completion and within the applicable review window.

## Traceability

| Traces To | ID | Description |
|---|---|---|
| Customer Need | CN.08.1 | Patients need UberTib to create one review for a completed, verified experience within the policy deadline. |
| Customer Problem | CP.08 | See the approved customer-problem baseline. |
| Authoritative SRS | FR-025 | Preserved requirement identity from UberTib SRS v1.1 |

## Acceptance Criteria

- [ ] A review is accepted only from the patient identity linked to the completed case or an active authorized guardian grant.
- [ ] A second active review for the same eligible experience is rejected.
- [ ] The review retains its verified-experience link and keeps patient experience rating R separate from scientific classification components.

## Implementation Notes

Construction details belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*

