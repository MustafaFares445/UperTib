## FR.08.1.1: Single Verified Review

## Requirement

**ID:** FR.08.1.1  
**Authoritative SRS ID:** FR-025  
**Title:** Single Verified Review  
**Priority:** Must Have  
**Status:** Approved  
**Clarified by:** `.spec/decisions/PO-2026-09-08-review-rating-scale.md` (`PO-UX-19`)

### Statement

The UberTib system shall permit one review per eligible patient experience only after verified completion and within the applicable review window.

The review shall contain one required whole-number Patient-experience rating from `1` to `5`. Written feedback is optional. The rating represents the Patient's experience of the visit and shall remain independent from medical competence, diagnosis accuracy, treatment outcome, scientific eligibility, and classification.

## Traceability

| Traces To | ID | Description |
|---|---|---|
| Customer Need | CN.08.1 | Patients need UberTib to create one review for a completed, verified experience within the policy deadline. |
| Customer Problem | CP.08 | See the approved customer-problem baseline. |
| Authoritative SRS | FR-025 | Preserved requirement identity from UberTib SRS v1.1 |
| Product Owner decision | PO-UX-19 | Fixes the V1 rating scale as one required whole-number 1–5 Patient-experience rating, with optional written feedback and no scientific-eligibility effect. |

## Acceptance Criteria

- [ ] A review is accepted only from the patient identity linked to the completed case or an active authorized guardian grant.
- [ ] A second active review for the same eligible experience is rejected.
- [ ] The review retains its verified-experience link and keeps patient experience rating R separate from scientific classification components.
- [ ] The submitted rating is required and accepts only integer values `1`, `2`, `3`, `4`, or `5`.
- [ ] Half-star, decimal, out-of-range, missing, or otherwise invalid rating values are rejected.
- [ ] Written feedback is optional; a valid rating can be submitted without review text.
- [ ] Patient-facing rating copy describes the visit experience and does not frame the rating as medical competence, diagnosis accuracy, treatment outcome, or scientific eligibility.
- [ ] Review rating does not modify `S`, `P`, `H`, internal `I`, eligibility state, grade, or any scientific decision.
- [ ] Public verified-review aggregates are withheld below 5 active verified reviews; at 5 or more, an average may be shown to one decimal place with the verified review count.
- [ ] Retired/non-published reviews do not contribute to the public aggregate.

## Implementation Notes

Construction details belong in the corresponding design and implementation-plan artifacts. The approved Patient interaction uses a five-option accessible radio group with visible star affordance; the star glyph is not the only carrier of the selected value.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-09-08*  
*Author: UberTib Requirements Team*

