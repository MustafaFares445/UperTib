## FR.05.2.1: Accepted Terms Snapshot

## Requirement

**ID:** FR.05.2.1  
**Authoritative SRS ID:** FR-009  
**Title:** Accepted Terms Snapshot  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall create an immutable snapshot of the treatment and financial terms when the patient accepts a plan.

## Traceability

| Traces To | ID | Description |
|---|---|---|
| Customer Need | CN.05.2 | Patient, doctor, and reviewer need the unchanging historical agreement and policy version. |
| Customer Problem | CP.05 | Treatment and commercial terms must remain explicit, accepted, and historically stable. |
| Authoritative SRS | FR-009 | Preserved requirement identity from UberTib SRS v1.1 |

## Acceptance Criteria

- [ ] The snapshot identifies the accepted plan version, parties, service, branch, price, stages, cancellation and refund terms, protection state, and policy version.
- [ ] Future policy or catalog changes do not change the accepted snapshot.
- [ ] Any later amendment creates a new accepted version and preserves the previous version.

## Implementation Notes

Construction details belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*
