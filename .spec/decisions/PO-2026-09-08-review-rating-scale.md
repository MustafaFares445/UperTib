# Product Owner Decision — Verified Patient Experience Rating

**Date:** 2026-09-08  
**Status:** Approved / authoritative  
**Scope:** Verified Patient reviews, Patient review authoring/read surfaces, and Patient-safe verified-review aggregates  
**Clarifies:** `FR.08.1.1` / `FR-REVIEWS-001`, SRS `FR-025`, `PO-UX-04`, and the product-policy-owned fields of `API-REVIEWS-001`

This decision closes the previously unresolved Slice 8 rating-scale question. The UX and implementation layers must treat the behavior below as confirmed product behavior and must not reopen the scale as an unanswered product-policy item unless a later explicit Product Owner decision changes it.

## PO-UX-19 — Five-point verified Patient-experience rating

### Rating meaning

UberTib uses one **overall Patient experience rating** for a verified completed care experience.

The Patient-facing question is:

> **كيف كانت تجربتك في هذه الزيارة؟**

The rating measures the Patient's experience of the visit. It is **not** a score of medical competence, diagnosis accuracy, treatment outcome, scientific eligibility, or clinical quality.

The review rating must remain separate from scientific eligibility/classification. A low or high review rating must not modify `S`, `P`, `H`, internal `I`, eligibility state, grade, or any scientific decision.

### Allowed scale

The submitted rating is required and accepts **whole-number values only**:

| Value | Arabic label |
|---:|---|
| 1 | سيئة جدًا |
| 2 | سيئة |
| 3 | مقبولة |
| 4 | جيدة |
| 5 | ممتازة |

Rules:

- one overall rating only in V1;
- allowed values are integers `1..5`;
- no half-star, decimal, emoji/smiley, or multi-dimension rating input in V1;
- written feedback is optional;
- only a verified completed eligible experience inside its review window may be reviewed;
- one eligible experience may have at most one active review under the existing review lifecycle;
- existing idempotency, retirement/history, and appeal behavior remain unchanged.

### Patient UI

The input uses a five-star single-selection control.

Accessibility requirements:

- expose the group as one `radiogroup`;
- expose five `radio` options;
- each option exposes explicit checked/selected state;
- each option has a full text label such as `4 من 5، جيدة`;
- keyboard/touch/assistive-technology interaction must not depend on the star glyph alone;
- the selected rating remains understandable without color.

The written comment field is labelled as optional and must not block submission when a valid rating is selected.

### Read/display form

A submitted review displays the preserved whole-star value and its descriptive label. The original review remains immutable according to the existing review lifecycle.

Where a Patient-safe provider surface already exposes the verified review aggregate, the compact display is:

`★ 4.7 · 126 تقييمًا`

The accessible name must state the numeric meaning in words, for example `متوسط تقييم التجربة 4.7 من 5، بناءً على 126 تقييمًا موثّقًا`.

### Minimum aggregate sample

UberTib does not display a public aggregate rating until there are at least **5 active verified reviews** in the applicable aggregate scope.

- `count < 5` → aggregate rating is withheld and the UI shows no numeric/star average;
- `count >= 5` → the average may be displayed to one decimal place with the verified review count;
- retired/non-published reviews do not contribute to the public aggregate;
- this threshold affects public aggregate display only; it does not prevent an eligible Patient from submitting an individual review.

### References used for the product decision

The decision was made after comparison with established healthcare-review patterns, including Zocdoc's five-star Patient ratings, Practo's separation of Patient feedback from medical/diagnostic judgment, Healthgrades' separation of Patient experience from professional qualifications, and the WAI-ARIA Authoring Practices five-star radio-group pattern.

External references inform the interaction choice only. The authoritative UberTib behavior is this Product Owner decision.
