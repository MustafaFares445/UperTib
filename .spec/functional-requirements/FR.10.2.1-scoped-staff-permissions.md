## FR.10.2.1: Scoped Staff Permissions

## Requirement

**ID:** FR.10.2.1  
**Authoritative SRS ID:** FR-027  
**Title:** Scoped Staff Permissions  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall enforce least-privilege staff permissions by role, organization, branch, workflow responsibility, and subject-matter scope on every administrative and API access path.

## Traceability

| Traces To | ID | Description |
|---|---|---|
| Customer Need | CN.10.2 | System administrators need UberTib to control permissions and separation of duties so each employee approves facts within their competence without altering computed outcomes. |
| Customer Problem | CP.10 | See the approved customer-problem baseline. |
| Authoritative SRS | FR-027 | Preserved requirement identity from UberTib SRS v1.1 |

## Acceptance Criteria

- [ ] Access is denied by default unless an explicit active grant covers the action and resource scope.
- [ ] Changing a client request, route, or interface cannot bypass organization or branch isolation.
- [ ] Permission changes are audited and take effect consistently across Filament panels, REST endpoints, files, queues, and exports.

## Implementation Notes

Construction details belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*

