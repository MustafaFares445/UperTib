## NFR.01: Performance and Scale

## Requirement

**ID:** NFR.01  
**Source:** SRS §18 and PO-2026-08-23  
**Title:** Performance and Scale  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall meet the approved Aleppo V1 performance envelope while supporting at least 10,000 registered identities, 3,000 monthly active users, 500 daily active users, and 100 concurrent authenticated sessions.

## Traceability

| Traces To | IDs | Description |
|---|---|---|
| Customer Needs | CN.01.1, CN.04.1, CN.10.1, CN.14.1 | Approved outcomes requiring this quality constraint. |
| Source Baseline | SRS §18 and PO-2026-08-23 | UberTib SRS v1.1 plus confirmed provisional defaults where identified. |

## Acceptance Criteria

- [ ] At the approved planning load, ordinary API reads complete at p95 ≤ 500 ms, ordinary writes at p95 ≤ 800 ms, and provider search at p95 ≤ 1 second, excluding file-transfer and external-provider latency.
- [ ] A 30-minute test with 100 authenticated sessions completes with an application error rate below 1%.
- [ ] A 75-request-per-second burst completes within the approved latency and error thresholds, and 100 concurrent booking attempts for one slot never exceed slot capacity.

## Implementation Notes

Construction details and test fixtures belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*

