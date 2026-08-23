## FR.09.2.1: Claim Evidence and Deadlines

## Requirement

**ID:** FR.09.2.1  
**Authoritative SRS ID:** FR-021  
**Title:** Claim Evidence and Deadlines  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall validate protection-claim evidence and workflow deadlines against the effective policy snapshot and shall make missing items and remaining response time visible to authorized participants.

## Traceability

| Traces To | ID | Description |
|---|---|---|
| Customer Need | CN.09.2 | Reviewers and case parties need UberTib to control evidence, deadlines, decisions, appeals, and external execution until a case closes with a documented reason. |
| Customer Problem | CP.09 | See the approved customer-problem baseline. |
| Authoritative SRS | FR-021 | Preserved requirement identity from UberTib SRS v1.1 |

## Acceptance Criteria

- [ ] Each claim type resolves to versioned required-evidence rules and deadline rules captured for that claim.
- [ ] Missing, rejected, expired, and accepted evidence items are distinguishable with reasons.
- [ ] Deadline pauses or extensions require an authorized, reasoned, audited event and never silently replace the original deadline.

## Implementation Notes

Construction details belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*

