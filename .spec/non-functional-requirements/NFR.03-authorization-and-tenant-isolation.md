## NFR.03: Authorization and Tenant Isolation

## Requirement

**ID:** NFR.03  
**Source:** SRS §§15–18  
**Title:** Authorization and Tenant Isolation  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall enforce deny-by-default authorization and organization, clinic, branch, case, and purpose isolation consistently across every access path.

## Traceability

| Traces To | IDs | Description |
|---|---|---|
| Customer Needs | CN.10.2, CN.11.1, CN.11.2 | Approved outcomes requiring this quality constraint. |
| Source Baseline | SRS §§15–18 | UberTib SRS v1.1 plus confirmed provisional defaults where identified. |

## Acceptance Criteria

- [ ] REST endpoints, Filament panels, background jobs, files, exports, search, and notifications apply equivalent server-side authorization.
- [ ] Cross-scope object identifiers do not disclose protected resource existence and return the approved not-found or forbidden behavior without data leakage.
- [ ] Automated allow and deny tests cover every sensitive action for patient, doctor, clinic staff, reviewer, finance, operations, policy owner, and administrator roles.

## Implementation Notes

Construction details and test fixtures belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*

