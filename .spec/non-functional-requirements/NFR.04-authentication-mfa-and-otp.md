## NFR.04: Authentication, MFA, and OTP Safety

## Requirement

**ID:** NFR.04  
**Source:** SRS §15 and PO-2026-08-23  
**Title:** Authentication, MFA, and OTP Safety  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall provide secure contact verification and authentication controls appropriate to patient and privileged-user risk.

## Traceability

| Traces To | IDs | Description |
|---|---|---|
| Customer Needs | CN.11.1, CN.12.1 | Approved outcomes requiring this quality constraint. |
| Source Baseline | SRS §15 and PO-2026-08-23 | UberTib SRS v1.1 plus confirmed provisional defaults where identified. |

## Acceptance Criteria

- [ ] Patient OTP codes contain six digits, expire after five minutes, are single-use, are stored only as hashes, allow at most five verification attempts, and allow at most three sends per 15 minutes per phone/account/IP combination.
- [ ] Resending invalidates the prior OTP without resetting accumulated failure counts.
- [ ] Doctor, clinic, reviewer, finance, policy-owner, operations, and administrator accounts require a non-SMS second factor before production access.

## Implementation Notes

Construction details and test fixtures belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*

