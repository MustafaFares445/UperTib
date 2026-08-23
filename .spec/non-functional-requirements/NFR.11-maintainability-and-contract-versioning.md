## NFR.11: Maintainability and Contract Versioning

## Requirement

**ID:** NFR.11  
**Source:** Approved architecture constraint PO-2026-08-23  
**Title:** Maintainability and Contract Versioning  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall keep domain behavior independently testable and expose explicitly versioned external contracts that can evolve without silent breaking changes.

## Traceability

| Traces To | IDs | Description |
|---|---|---|
| Customer Needs | CN.12.1, CN.13.1, CN.14.2 | Approved outcomes requiring this quality constraint. |
| Source Baseline | Approved architecture constraint PO-2026-08-23 | UberTib SRS v1.1 plus confirmed provisional defaults where identified. |

## Acceptance Criteria

- [ ] React Native and Filament adapters invoke the same tested application actions and domain policies, with Filament using in-process actions rather than internal HTTP.
- [ ] REST contracts are versioned and documented, and breaking changes require an explicit new contract version or approved migration window.
- [ ] Classification, eligibility, evidence, deadline, and financial policies are not hard-coded into presentation components.

## Implementation Notes

Construction details and test fixtures belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*

