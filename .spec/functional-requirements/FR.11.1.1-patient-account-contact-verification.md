## FR.11.1.1: Patient Account and Contact Verification

## Requirement

**ID:** FR.11.1.1  
**Authoritative SRS ID:** FR-001  
**Title:** Patient Account and Contact Verification  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall create a patient account only after verifying the required contact details and shall associate the patient’s cases with that authenticated identity.

## Traceability

| Traces To | ID | Description |
|---|---|---|
| Customer Need | CN.11.1 | Data owners and UberTib need access to identity, medical, and financial data controlled by least privilege and legitimate purpose. |
| Customer Problem | CP.11 | UberTib must protect sensitive identity, medical, licensing, and financial data. |
| Authoritative SRS | FR-001 | Preserved requirement identity from UberTib SRS v1.1 |

## Acceptance Criteria

- [ ] An account cannot become active until the configured contact-verification challenge succeeds.
- [ ] A patient can access only their own records unless an active scoped grant authorizes access to another patient.
- [ ] Repeated submissions with the same verified identity do not create duplicate active patient identities.

## Implementation Notes

Construction details belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*
