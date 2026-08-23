## FR.06.2.1: Financial Case Timeline

## Requirement

**ID:** FR.06.2.1  
**Authoritative SRS ID:** FR-017  
**Title:** Financial Case Timeline  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall present an authorized, case-scoped financial timeline that distinguishes agreed, reported, confirmed, disputed, refunded, and pending-external-execution amounts.

## Traceability

| Traces To | ID | Description |
|---|---|---|
| Customer Need | CN.06.2 | The finance team and case parties need UberTib to show amounts agreed, confirmed, disputed, or awaiting external execution for every case. |
| Customer Problem | CP.06 | See the approved customer-problem baseline. |
| Authoritative SRS | FR-017 | Preserved requirement identity from UberTib SRS v1.1 |

## Acceptance Criteria

- [ ] Every displayed balance or amount is derived from an immutable terms snapshot and append-only financial events.
- [ ] The timeline visibly distinguishes assertions from mutually confirmed or reviewer-resolved facts.
- [ ] Users see only cases and financial fields permitted by their role, organization scope, and case relationship.

## Implementation Notes

Construction details belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*

