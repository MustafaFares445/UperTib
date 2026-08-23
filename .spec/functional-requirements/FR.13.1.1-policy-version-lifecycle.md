## FR.13.1.1: Policy Version Lifecycle

## Requirement

**ID:** FR.13.1.1  
**Source Requirement ID:** PO-2026-08-23  
**Title:** Policy Version Lifecycle  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall manage classification, eligibility, deadline, evidence, financial, and launch policies through draft, reviewed, scheduled, active, retired, and superseded version states.

## Traceability

| Traces To | ID | Description |
|---|---|---|
| Customer Need | CN.13.1 | Policy owners need UberTib to control creation, review, scheduling, activation, and retirement of a policy without changing prior transactions. |
| Customer Problem | CP.13 | See the approved customer-problem baseline. |
| Approved supplemental decision | PO-2026-08-23 | Product-owner confirmation interpreting SRS sections 5.1, 17.3, 18, and 19 |

## Acceptance Criteria

- [ ] Only authorized policy owners and required reviewers can advance a version through its configured approval workflow.
- [ ] At most one policy version is effective for the same policy key, scope, and instant unless an explicit precedence rule resolves the overlap.
- [ ] Activating or retiring a version never mutates historical decisions, agreements, or cases governed by an earlier snapshot.

## Implementation Notes

Implementation status is partial. Service definitions implement version identity, controlled lifecycle transitions, atomic production supersession, effective periods, content hashing, and active/terminal immutability. Authorized policy-owner workflow and non-catalog policy domains remain deferred.

## Test Cases

- Lifecycle, supersession, immutability, and version uniqueness: [`ServiceDefinitionTest.php`](../../UberTip-Backend/tests/Feature/Models/ServiceDefinitionTest.php)
- Highest-version selection without fallback: [`ListServiceGroupsTest.php`](../../UberTip-Backend/tests/Feature/Api/V1/Catalog/ListServiceGroupsTest.php)

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*
