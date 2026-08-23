## FR.06.1.1: External Payment Reporting

## Requirement

**ID:** FR.06.1.1  
**Authoritative SRS ID:** FR-015  
**Title:** External Payment Reporting  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall allow an authorized party to report a payment performed outside the platform against a specific accepted case and financial-terms snapshot.

## Traceability

| Traces To | ID | Description |
|---|---|---|
| Customer Need | CN.06.1 | The doctor or clinic staff and patient need UberTib to create and confirm or dispute a record of every payment, refund, or compensation performed outside the platform. |
| Customer Problem | CP.06 | See the approved customer-problem baseline. |
| Authoritative SRS | FR-015 | Preserved requirement identity from UberTib SRS v1.1 |

## Acceptance Criteria

- [ ] A report includes case, immutable terms snapshot, amount, currency, external method category, payer assertion, occurrence time, and supporting evidence when required.
- [ ] The platform records the report as an unconfirmed financial event and does not initiate or settle money movement.
- [ ] Duplicate submission of the same idempotency key returns the original result and creates no additional financial event.

## Implementation Notes

Construction details belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*

