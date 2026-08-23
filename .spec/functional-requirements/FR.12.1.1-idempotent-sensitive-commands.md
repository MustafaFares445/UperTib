## FR.12.1.1: Idempotent Sensitive Commands

## Requirement

**ID:** FR.12.1.1  
**Source Requirement ID:** FR-045  
**Title:** Idempotent Sensitive Commands  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall require idempotent processing for sensitive or retry-prone commands, including bookings, acceptances, evidence uploads, financial events, claims, and decisions.

## Traceability

| Traces To | ID | Description |
|---|---|---|
| Customer Need | CN.12.1 | Mobile and web users need UberTib to control drafts, uploads, and safe retries during weak connectivity without duplicating an action. |
| Customer Problem | CP.12 | See the approved customer-problem baseline. |
| Authoritative SRS | FR-045 | Preserved requirement identity from UberTib SRS v1.1 |

## Acceptance Criteria

- [ ] Repeating an identical command with the same actor, scope, and idempotency key returns the original successful response.
- [ ] Reusing a key with a materially different request is rejected and creates no side effect.
- [ ] Concurrent duplicate submissions create at most one committed business outcome.

## Implementation Notes

Construction details belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*

