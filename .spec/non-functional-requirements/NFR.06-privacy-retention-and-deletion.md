## NFR.06: Privacy, Retention, and Deletion

## Requirement

**ID:** NFR.06  
**Source:** SRS §§15–18 and PO-2026-08-23  
**Title:** Privacy, Retention, and Deletion  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall apply a versioned, legally reviewable retention and deletion matrix by data purpose, subject age, case state, dispute state, and legal hold.

## Traceability

| Traces To | IDs | Description |
|---|---|---|
| Customer Needs | CN.11.1, CN.11.2, CN.13.2 | Approved outcomes requiring this quality constraint. |
| Source Baseline | SRS §§15–18 and PO-2026-08-23 | UberTib SRS v1.1 plus confirmed provisional defaults where identified. |

## Acceptance Criteria

- [ ] The provisional clinical benchmark retains adult case records for 11 years after closure and child case records until the 25th birthday, or 26th birthday when treatment ended at age 17, unless approved Syrian legal policy supersedes it prospectively.
- [ ] OTP hash and metadata are retained no longer than 24 hours; unverified accounts, draft evidence, and abandoned uploads no longer than 90 days; and orphan temporary uploads no longer than 24 hours unless a documented hold applies.
- [ ] Deletion is blocked by an active legal hold, and completed destruction creates a non-sensitive audit record without retaining the destroyed payload.

## Implementation Notes

Construction details and test fixtures belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*

