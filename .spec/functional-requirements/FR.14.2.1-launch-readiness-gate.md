## FR.14.2.1: Launch Readiness Gate

## Requirement

**ID:** FR.14.2.1  
**Source Requirement ID:** PO-2026-08-23  
**Title:** Launch Readiness Gate  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall prevent production activation of a service, provider scope, or geographic expansion until its required medical, legal, operational, and technical readiness approvals are current.

## Traceability

| Traces To | ID | Description |
|---|---|---|
| Customer Need | CN.14.2 | Product owners need UberTib to control activation of a service or scope based on completion of medical, legal, operational, and technical readiness gates. |
| Customer Problem | CP.14 | See the approved customer-problem baseline. |
| Approved supplemental decision | PO-2026-08-23 | Product-owner confirmation interpreting SRS sections 5.1, 17.3, 18, and 19 |

## Acceptance Criteria

- [ ] Each launch scope shows every required gate, responsible role, evidence, decision, expiry if applicable, and current state.
- [ ] A missing, expired, revoked, or rejected mandatory approval blocks public discoverability and new bookings for the affected scope.
- [ ] Initial provisional service definitions can be configured for evaluation, but production activation requires approval by a licensed dental reviewer and all other mandatory gates.

## Implementation Notes

Implementation status is partial. The service-scope backend core now blocks publication using complete-card validation, four append-only evidence-bound decisions, content-hash binding, accountable role labels, expiry checks, and a current independently verified dental credential. Authenticated role enforcement, private evidence records, Filament workflow, provider scope, and geographic expansion remain deferred.

## Test Cases

- Publication/readiness behavior: [`ServiceDefinitionTest.php`](../../UberTip-Backend/tests/Feature/Models/ServiceDefinitionTest.php)
- Credential and append-only integrity: [`ClinicalApprovalIntegrityTest.php`](../../UberTip-Backend/tests/Feature/Models/ClinicalApprovalIntegrityTest.php)
- Production visibility and no-fallback contract: [`ListServiceGroupsTest.php`](../../UberTip-Backend/tests/Feature/Api/V1/Catalog/ListServiceGroupsTest.php)

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*
