## NFR.05: Private File and Evidence Security

## Requirement

**ID:** NFR.05  
**Source:** SRS §§15–18 and PO-2026-08-23  
**Title:** Private File and Evidence Security  
**Priority:** Must Have  
**Status:** Approved

### Statement

The UberTib system shall store all clinical, credential, identity, claim, and financial evidence privately and release it only after fresh authorization.

## Traceability

| Traces To | IDs | Description |
|---|---|---|
| Customer Needs | CN.02.1, CN.07.1, CN.09.2, CN.11.1 | Approved outcomes requiring this quality constraint. |
| Source Baseline | SRS §§15–18 and PO-2026-08-23 | UberTib SRS v1.1 plus confirmed provisional defaults where identified. |

## Acceptance Criteria

- [ ] The initial allowlist is PDF, JPEG, and PNG, limited to 10 MB per image, 25 MB per PDF, and 10 files per action.
- [ ] Every upload passes extension, magic-byte, MIME, and decode validation; uses an opaque UUID object name; records an immutable SHA-256 hash; and remains quarantined until malware scanning succeeds.
- [ ] Authorized downloads use a freshly generated link valid for no more than 60 seconds, and every download is audited.

## Implementation Notes

Construction details and test fixtures belong in the corresponding design and implementation-plan artifacts.

## Test Cases

QA test-case references are added during implementation and verification.

---
*Created: 2026-08-23*  
*Last Updated: 2026-08-23*  
*Author: UberTib Requirements Team*

