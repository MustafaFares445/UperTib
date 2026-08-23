## FR.05.2.2: Financial Terms Snapshot on Acceptance or Amendment

## Requirement

**ID:** FR.05.2.2  
**Source Requirement ID:** FR-043  
**Title:** Financial Terms Snapshot on Acceptance or Amendment  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall create an immutable FinancialTermsSnapshot whenever treatment terms are mutually accepted and whenever an amendment is subsequently accepted.

## Traceability

| Traces To | ID | Description |
|---|---|---|
| Customer Need | CN.05.2 | Patients, doctors, and reviewers need UberTib to show the immutable historical version of the agreement and policy that governed it at any time. |
| Customer Problem | CP.05 | See the approved customer-problem baseline. |
| Authoritative SRS | FR-043 | Preserved requirement identity from UberTib SRS v1.1 |

## Acceptance Criteria

- [ ] The snapshot includes service, stages, price, currency, due structure, cancellation rules, refund rules, protection terms, and governing policy versions.
- [ ] No operational workflow can mutate an existing accepted snapshot.
- [ ] An amendment creates a new linked snapshot and preserves the prior snapshot as the governing record for earlier events.

## Implementation Notes

Construction details belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*

