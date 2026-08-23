## FR.11.1.2: Guardian and Family Grants

## Requirement

**ID:** FR.11.1.2  
**Authoritative SRS ID:** FR-032  
**Title:** Guardian and Family Grants  
**Priority:** Should Have  
**Status:** Approved

### Statement

The UberTib system should support explicit, revocable, purpose-limited guardian or family access grants for a patient while preserving the patient as the owner of each case record.

## Traceability

| Traces To | ID | Description |
|---|---|---|
| Customer Need | CN.11.1 | Data owners and UberTib management need the platform to control access to identity, licensing, medical evidence, and financial records according to least privilege and legitimate purpose. |
| Customer Problem | CP.11 | See the approved customer-problem baseline. |
| Authoritative SRS | FR-032 | Preserved requirement identity from UberTib SRS v1.1 |

## Acceptance Criteria

- [ ] A grant identifies grantor or legal basis, subject patient, grantee, permitted actions, data scope, effective period, and purpose.
- [ ] Expired or revoked grants stop authorizing access immediately and remain in audit history.
- [ ] A guardian action is attributed to the guardian identity and never masquerades as an action by the patient.

## Implementation Notes

Construction details belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*

