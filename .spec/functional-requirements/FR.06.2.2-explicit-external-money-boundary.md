## FR.06.2.2: Explicit External Money Boundary

## Requirement

**ID:** FR.06.2.2  
**Source Requirement ID:** FR-047  
**Title:** Explicit External Money Boundary  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall operate as a financial-management ledger only and shall not provide a payment gateway, wallet, escrow, card or bank credential storage, automated settlement, or platform custody of funds.

## Traceability

| Traces To | ID | Description |
|---|---|---|
| Customer Need | CN.06.2 | The finance team and case parties need UberTib to show amounts agreed, confirmed, disputed, or awaiting external execution for every case. |
| Customer Problem | CP.06 | See the approved customer-problem baseline. |
| Authoritative SRS | FR-047 | Preserved requirement identity from UberTib SRS v1.1 |

## Acceptance Criteria

- [ ] No API, user interface, scheduled job, or integration can initiate, authorize, capture, hold, transfer, or settle money.
- [ ] Financial workflow language identifies human-executed external actions and distinguishes them from recorded platform events.
- [ ] Approved amounts awaiting action remain explicitly marked pending external execution until reported and confirmed.

## Implementation Notes

Construction details belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*

