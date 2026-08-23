## FR.02.2.8: Automatic H and I

## Requirement

**ID:** FR.02.2.8  
**Source Requirement ID:** FR-042  
**Title:** Automatic H and I  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall compute protection component H and internal operational indicator I automatically from versioned rules, keeping I internal and preventing direct manual outcome entry.

## Traceability

| Traces To | ID | Description |
|---|---|---|
| Customer Need | CN.02.2 | Doctors, reviewers, and UberTib management need the platform to show the computed result, its reasons, confidence, and policy after facts are approved. |
| Customer Problem | CP.02 | See the approved customer-problem baseline. |
| Authoritative SRS | FR-042 | Preserved requirement identity from UberTib SRS v1.1 |

## Acceptance Criteria

- [ ] H records the applicable protection rule and never implies funded coverage when funded protection is disabled.
- [ ] I is visible only to authorized internal roles and is excluded from patient-facing scientific grade displays.
- [ ] Users may approve or correct source facts through governed workflows but cannot directly enter H, I, or their final outcomes.

## Implementation Notes

Construction details belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*

