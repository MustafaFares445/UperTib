## FR.11.2.1: Sensitive Decision Audit

## Requirement

**ID:** FR.11.2.1  
**Authoritative SRS ID:** FR-028  
**Title:** Sensitive Decision Audit  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall create a tamper-evident audit record for sensitive reads, downloads, writes, approvals, decisions, permission changes, and exceptional administrative actions.

## Traceability

| Traces To | ID | Description |
|---|---|---|
| Customer Need | CN.11.2 | Auditors and authorized users need UberTib to know who read, downloaded, created, changed, or decided about sensitive data, when, and why. |
| Customer Problem | CP.11 | See the approved customer-problem baseline. |
| Authoritative SRS | FR-028 | Preserved requirement identity from UberTib SRS v1.1 |

## Acceptance Criteria

- [ ] Each audit record includes actor, effective role and scope, action, resource, time, outcome, request correlation, and reason where required.
- [ ] Authorized auditors can search events without gaining access to protected payloads outside their own permission scope.
- [ ] Application users cannot edit or delete audit records through operational workflows.

## Implementation Notes

Construction details belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*

