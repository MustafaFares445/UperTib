## FR.02.2.6: Grade Bands and F Separation

## Requirement

**ID:** FR.02.2.6  
**Source Requirement ID:** FR-040  
**Title:** Grade Bands and F Separation  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall map the scientifically computed S result to versioned grade bands and shall keep grade F distinct from PENDING_EVALUATION.

## Traceability

| Traces To | ID | Description |
|---|---|---|
| Customer Need | CN.02.2 | Doctors, reviewers, and UberTib management need the platform to show the computed result, its reasons, confidence, and policy after facts are approved. |
| Customer Problem | CP.02 | See the approved customer-problem baseline. |
| Authoritative SRS | FR-040 | Preserved requirement identity from UberTib SRS v1.1 |

## Acceptance Criteria

- [ ] Each service policy version defines non-overlapping, complete grade bands for evaluable S results.
- [ ] Grade F is produced only by an evaluable result that falls within its approved band or by an explicit clinically approved disqualifying rule.
- [ ] Missing or insufficient evidence never produces F and is displayed as PENDING_EVALUATION with blockers.

## Implementation Notes

Construction details belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*

