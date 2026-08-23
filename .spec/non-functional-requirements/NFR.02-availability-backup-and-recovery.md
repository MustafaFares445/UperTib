## NFR.02: Availability, Backup, and Recovery

## Requirement

**ID:** NFR.02  
**Source:** SRS §18 and PO-2026-08-23  
**Title:** Availability, Backup, and Recovery  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib production service shall target 99.5% monthly availability excluding approved maintenance, with RPO ≤ 15 minutes and RTO ≤ 4 hours.

## Traceability

| Traces To | IDs | Description |
|---|---|---|
| Customer Needs | CN.04.1, CN.07.2, CN.13.2, CN.14.2 | Approved outcomes requiring this quality constraint. |
| Source Baseline | SRS §18 and PO-2026-08-23 | UberTib SRS v1.1 plus confirmed provisional defaults where identified. |

## Acceptance Criteria

- [ ] Production recovery supports MySQL point-in-time recovery and equivalent versioned recovery for private object evidence.
- [ ] A quarterly full restore exercise demonstrates recovery of database state, object evidence, scan and quarantine metadata, deletion tombstones, and legal holds within the RTO.
- [ ] Availability, backup completion, replication lag, and restore-test results are monitored and retained for operational review.

## Implementation Notes

Construction details and test fixtures belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*

