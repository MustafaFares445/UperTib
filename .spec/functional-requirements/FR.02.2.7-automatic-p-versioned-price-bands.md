## FR.02.2.7: Automatic P from Versioned Price Bands

## Requirement

**ID:** FR.02.2.7  
**Source Requirement ID:** FR-041  
**Title:** Automatic P from Versioned Price Bands  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall compute P automatically by comparing the applicable actual price fact with versioned, service-specific price bands and shall retain the calculation snapshot.

## Traceability

| Traces To | ID | Description |
|---|---|---|
| Customer Need | CN.02.2 | Doctors, reviewers, and UberTib management need the platform to show the computed result, its reasons, confidence, and policy after facts are approved. |
| Customer Problem | CP.02 | See the approved customer-problem baseline. |
| Authoritative SRS | FR-041 | Preserved requirement identity from UberTib SRS v1.1 |

## Acceptance Criteria

- [ ] Price bands identify service, locality or market scope, currency, effective period, source provenance, and approved version.
- [ ] Currency or scope mismatch prevents calculation and produces an explicit pending or invalid-input reason.
- [ ] The decision snapshot preserves the price, normalized comparison value if any, selected band, result, and policy version.

## Implementation Notes

Construction details belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*

