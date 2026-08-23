## FR.02.2.3: Automatic Protection Selection

## Requirement

**ID:** FR.02.2.3  
**Authoritative SRS ID:** FR-014  
**Title:** Automatic Protection Selection  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall select the applicable protection level automatically from the effective service policy and computed eligibility context, with funded monetary protection disabled unless a separately approved policy explicitly enables it.

## Traceability

| Traces To | ID | Description |
|---|---|---|
| Customer Need | CN.02.2 | Doctors, reviewers, and UberTib management need the platform to show the computed result, its reasons, confidence, and policy after facts are approved. |
| Customer Problem | CP.02 | See the approved customer-problem baseline. |
| Authoritative SRS | FR-014 | Preserved requirement identity from UberTib SRS v1.1 |

## Acceptance Criteria

- [ ] The selected protection is scoped to the service, provider, branch, policy version, and decision time.
- [ ] The decision records a machine-readable reason and an understandable explanation.
- [ ] No workflow promises reimbursement, escrow, insurance, or platform-funded protection while the corresponding approved policy is disabled.

## Implementation Notes

Construction details belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*

