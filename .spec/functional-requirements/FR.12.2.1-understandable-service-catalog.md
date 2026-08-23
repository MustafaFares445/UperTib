## FR.12.2.1: Understandable Service Catalog

## Requirement

**ID:** FR.12.2.1  
**Authoritative SRS ID:** FR-002  
**Title:** Understandable Service Catalog  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall present the available dental groups and services in understandable Arabic without requiring patients to interpret internal classification symbols.

## Traceability

| Traces To | ID | Description |
|---|---|---|
| Customer Need | CN.12.2 | Users need Arabic, RTL, accessible content and states that do not rely on color alone. |
| Customer Problem | CP.12 | Users need dependable and understandable mobile and web journeys under Aleppo connectivity conditions. |
| Authoritative SRS | FR-002 | Preserved requirement identity from UberTib SRS v1.1 |

## Acceptance Criteria

- [ ] Each active service has a patient-facing Arabic name, description, owning group, and practical purpose.
- [ ] The service catalog does not require knowledge of S, P, H, I, K, EU, or internal risk codes to choose a need.
- [ ] Service state and availability are communicated through text and accessible semantics rather than color alone.

## Implementation Notes

Implementation status is partial. The backend evaluation slice provides the provisional G01–G04 Arabic catalog, practical non-diagnostic purpose copy, stable ordering, and text clinical/readiness states. React Native RTL rendering, accessibility semantics, and real availability belong to later slices.

## Test Cases

- Backend contract and complete ordered baseline: [`ListServiceGroupsTest.php`](../../UberTip-Backend/tests/Feature/Api/V1/Catalog/ListServiceGroupsTest.php)
- Patient-facing Arabic purpose source: [`ServiceSeeder.php`](../../UberTip-Backend/database/seeders/ServiceSeeder.php)
- Feature plan and deferred scope: [`spec.md`](../../UberTip-Backend/specs/001-service-catalog-launch-readiness/spec.md)

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*
