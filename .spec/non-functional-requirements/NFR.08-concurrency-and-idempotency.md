## NFR.08: Concurrency and Idempotency

## Requirement

**ID:** NFR.08  
**Source:** SRS FR-045 and §18  
**Title:** Concurrency and Idempotency  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall make retry-prone and contention-sensitive commands atomic, idempotent, and safe under concurrent execution.

## Traceability

| Traces To | IDs | Description |
|---|---|---|
| Customer Needs | CN.04.1, CN.06.1, CN.12.1 | Approved outcomes requiring this quality constraint. |
| Source Baseline | SRS FR-045 and §18 | UberTib SRS v1.1 plus confirmed provisional defaults where identified. |

## Acceptance Criteria

- [ ] Same actor, operation, scope, key, and payload return the original committed response without a duplicate side effect.
- [ ] The same idempotency key with a different payload is rejected deterministically.
- [ ] Database constraints and transactional locking prevent overbooking, duplicate acceptances, duplicate financial events, and partially committed sensitive workflows.

## Implementation Notes

Construction details and test fixtures belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*

