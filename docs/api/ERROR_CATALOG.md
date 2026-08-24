# UberTib API Error Catalog

**Phase:** 2 — Conditional Engineering Documentation  
**Mode:** Existing Repository  
**Baseline:** 2026-08-24  
**Product source:** `docs/PRD.md`  
**Technical source:** `docs/SDD.md`  
**API source:** `docs/api/API_CONTRACTS.md`  
**Registry:** `docs/README.md`

## 1. Purpose and Status

This document owns stable client/API error semantics for UberTib V1. It defines the `ERR-*` identifiers reserved by `API_CONTRACTS.md`, their machine codes, HTTP statuses, safe client-facing messages, triggering conditions, retry behavior, and expected presentation surface.

Only `API-CATALOG-001` is currently verified as implemented. Its current route/OpenAPI expose `429` and generic `500` behavior, but the stable `ERR-*` machine-code envelope below is **not yet verified as implemented**. The remaining error definitions are required contracts for the proposed V1 APIs and must be implemented without weakening the higher-priority product requirements.

`Q-PLATFORM-001` still blocks a claim of complete SRS reconciliation. `Q-PLATFORM-003` remains relevant to OTP and evidence-provider failure handling. No error wording may imply that UberTib diagnoses, insures, holds funds, or executes payments/refunds.

## 2. Target Error Envelope

For proposed APIs, and when normalizing the existing catalog endpoint, API errors should use the following stable shape unless a later explicit contract version supersedes it:

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "تعذر إكمال الطلب. يرجى مراجعة البيانات المدخلة.",
    "details": {},
    "correlation_id": "safe-correlation-id"
  }
}
```

Rules:

- `code` is stable and machine-readable; clients must not branch on translated text.
- `message` is Arabic-first and safe for the intended audience.
- `details` is optional and must contain only information the actor is authorized to know.
- `correlation_id` is optional in the payload but should be available for support/operations when safe.
- Validation details may identify safe field names and field-level messages.
- Authorization/not-found errors must not disclose protected resource existence.
- Internal exception text, SQL details, stack traces, private file paths, OTP values, credentials, policy secrets, reviewer-only evidence, and protected clinical payloads must never be returned.
- For retry-prone mutations, clients retry with the **same idempotency key** after transient failures; they must not create a new key merely because a response was lost.

## 3. Presentation Surface Vocabulary

This catalog describes UX impact without defining screens or layout:

- **Inline field validation** — attached to one or more submitted fields.
- **Action banner/toast** — action-level feedback while keeping the current context.
- **Full-page/auth gate** — the requested protected context cannot be shown until authentication/recovery.
- **Unavailable-state message** — the requested business action/resource is currently unavailable and the user needs an alternative or later retry.
- **Silent-log-only detail** — detailed diagnostics are operational only; the client receives a safe generic message.

The later UX pipeline decides visual treatment and component choice.

## 4. Platform Errors

### ERR-PLATFORM-001 — Validation Failed

**Stable code:** `VALIDATION_FAILED`  
**HTTP status:** `422 Unprocessable Entity`  
**Requirements:** FR-IDENTITY-002–003, FR-ELIG-001, FR-ELIG-007–008, FR-BOOKING-001–003, FR-CLINICAL-002, FR-FINANCE-002–005, FR-REVIEWS-001–002, FR-CLAIMS-001–005  
**Client-facing message:** `تعذر إكمال الطلب. يرجى مراجعة البيانات المدخلة.`  
**When raised:** Request syntax is parseable but required fields, formats, enumerations, field combinations, or safe business-input constraints are invalid before a more specific domain precondition error applies.  
**APIs:** API-IDENTITY-001, API-IDENTITY-002, API-IDENTITY-004, API-ELIG-001, API-ELIG-003, API-BOOKING-001, API-FINANCE-002, API-FINANCE-003, API-FINANCE-004, API-REVIEWS-001, API-REVIEWS-002, API-CLAIMS-001, API-CLAIMS-002, API-CLAIMS-005.  
**Retryable:** No; correct the request first.  
**Surface:** Inline field validation when field-specific; otherwise action banner.  
**Safe details:** Field-keyed validation messages only; never protected server state.

### ERR-PLATFORM-002 — Resource Not Found or Intentionally Undisclosed

**Stable code:** `RESOURCE_NOT_FOUND`  
**HTTP status:** `404 Not Found`  
**Requirements:** NFR-IDENTITY-001 plus the owning resource requirement of each API  
**Client-facing message:** `تعذر العثور على المورد المطلوب.`  
**When raised:** The resource does not exist, is no longer addressable, or policy intentionally uses not-found behavior to avoid disclosing a protected cross-scope resource.  
**APIs:** API-IDENTITY-005, API-ELIG-002, API-ELIG-004, API-BOOKING-003, API-BOOKING-004, API-BOOKING-005, API-CLINICAL-001, API-CLINICAL-002, API-CLINICAL-003, API-CLINICAL-004, API-FINANCE-001, API-FINANCE-003, API-FINANCE-005, API-CLAIMS-003, API-CLAIMS-004, API-CLAIMS-005.  
**Retryable:** No, unless the caller intentionally refreshes after known synchronization delay.  
**Surface:** Unavailable-state message or full-page resource-not-found state.  
**Security rule:** Do not distinguish “exists but forbidden” from “does not exist” where disclosure would violate scope isolation.

### ERR-PLATFORM-003 — Rate Limited

**Stable code:** `RATE_LIMITED`  
**HTTP status:** `429 Too Many Requests`  
**Requirements:** NFR-PLATFORM-001, NFR-IDENTITY-002  
**Client-facing message:** `تم إرسال طلبات كثيرة خلال فترة قصيرة. يرجى المحاولة لاحقًا.`  
**When raised:** A public/API rate limit is exceeded. OTP-specific send throttling uses `ERR-IDENTITY-003` when the product needs OTP resend semantics.  
**APIs:** API-CATALOG-001, API-ELIG-001.  
**Retryable:** Yes, after the server-provided retry window.  
**Surface:** Action banner/toast; preserve current context.  
**Safe details:** `retry_after_seconds` or standard `Retry-After` metadata where available.

### ERR-PLATFORM-004 — Unexpected Server or Configuration Failure

**Stable code:** `SERVER_ERROR`  
**HTTP status:** `500 Internal Server Error`  
**Requirements:** NFR-PLATFORM-008, NFR-AUDIT-001  
**Client-facing message:** `حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى لاحقًا.`  
**When raised:** An unexpected application/configuration failure prevents a safe response and no more specific stable error applies.  
**APIs:** API-CATALOG-001, API-IDENTITY-001, API-IDENTITY-002, API-IDENTITY-003, API-ELIG-001, API-ELIG-002. Other proposed APIs must use this generic failure behavior for truly unexpected exceptions even where the current contract section does not enumerate it explicitly.  
**Retryable:** Conditional. Reads may be retried with backoff. Mutations may be retried only with the same idempotency key when the contract requires one.  
**Surface:** Action banner/full-page generic error; diagnostic detail is silent-log-only.  
**Operational rule:** Emit correlation-safe logs/metrics without protected payloads.

## 5. Identity Errors

### ERR-IDENTITY-001 — Authentication Required

**Stable code:** `AUTHENTICATION_REQUIRED`  
**HTTP status:** `401 Unauthorized`  
**Requirements:** FR-IDENTITY-002, NFR-IDENTITY-001–002  
**Client-facing message:** `يلزم تسجيل الدخول للمتابعة.`  
**When raised:** A protected API has no valid authenticated UberTib identity/session context.  
**APIs:** All authenticated proposed APIs in IDENTITY, ELIG, BOOKING, CLINICAL, FINANCE, REVIEWS, and CLAIMS; specifically API-IDENTITY-003–005, API-ELIG-003–004, API-BOOKING-001–005, API-CLINICAL-001–004, API-FINANCE-001–005, API-REVIEWS-001–002, API-CLAIMS-001–005.  
**Retryable:** Yes after successful authentication/session recovery.  
**Surface:** Full-page/auth gate or authentication recovery flow.  
**Security rule:** Do not include authorization scope details before authentication.

### ERR-IDENTITY-002 — Forbidden or Outside Authorized Scope

**Stable code:** `FORBIDDEN`  
**HTTP status:** `403 Forbidden` unless the resource must be intentionally undisclosed with `ERR-PLATFORM-002`.  
**Requirements:** FR-IDENTITY-001, FR-IDENTITY-003, NFR-IDENTITY-001  
**Client-facing message:** `لا تملك صلاحية تنفيذ هذا الإجراء.`  
**When raised:** The actor is authenticated but lacks the active role, organization/clinic/branch, case relationship, guardian grant, workflow responsibility, purpose, or separation-of-duties scope required for the action.  
**APIs:** API-IDENTITY-004–005, API-ELIG-003–004, API-BOOKING-001–005, API-CLINICAL-001–004, API-FINANCE-001–005, API-REVIEWS-001–002, API-CLAIMS-001–005.  
**Retryable:** No until authorization context changes.  
**Surface:** Permission-denied/unavailable-state message.  
**Security rule:** Use `ERR-PLATFORM-002` instead where acknowledging the protected resource would leak existence.

### ERR-IDENTITY-003 — OTP Send Throttled

**Stable code:** `OTP_SEND_THROTTLED`  
**HTTP status:** `429 Too Many Requests`  
**Requirements:** FR-IDENTITY-002, NFR-IDENTITY-002  
**Client-facing message:** `تم طلب رمز تحقق عدة مرات. يرجى الانتظار قبل طلب رمز جديد.`  
**When raised:** OTP send/resend exceeds the approved maximum of three sends per 15 minutes for the applicable phone/account/IP combination.  
**APIs:** API-IDENTITY-001.  
**Retryable:** Yes after the throttle window.  
**Surface:** Inline/action-level message near the resend action.  
**Safe details:** Remaining wait time; never expose whether a phone number belongs to another protected account when enumeration protection applies.

### ERR-IDENTITY-004 — OTP Invalid, Expired, Used, or Attempts Exhausted

**Stable code:** `OTP_VERIFICATION_FAILED`  
**HTTP status:** `422 Unprocessable Entity`  
**Requirements:** FR-IDENTITY-002, NFR-IDENTITY-002  
**Client-facing message:** `رمز التحقق غير صالح أو انتهت صلاحيته. يرجى التحقق من الرمز أو طلب رمز جديد عند الحاجة.`  
**When raised:** The challenge/code pair is incorrect, expired, already consumed, invalidated by resend, or cannot be accepted because the verification-attempt limit was reached.  
**APIs:** API-IDENTITY-002.  
**Retryable:** Conditional. Another code attempt is allowed only while the challenge remains valid and attempts remain; otherwise request a new challenge subject to send throttling.  
**Surface:** Inline OTP validation plus recovery guidance.  
**Security rule:** Never return the expected OTP/hash or sensitive attempt internals.

## 6. Audit and Idempotency Error

### ERR-AUDIT-001 — Idempotency Key Conflict

**Stable code:** `IDEMPOTENCY_KEY_CONFLICT`  
**HTTP status:** `409 Conflict`  
**Requirements:** FR-AUDIT-003, NFR-AUDIT-002  
**Client-facing message:** `تعذر تكرار الطلب لأن مفتاح إعادة المحاولة استُخدم لطلب مختلف.`  
**When raised:** The same actor/operation/scope idempotency key is reused with a materially different request payload.  
**APIs:** API-IDENTITY-002, API-IDENTITY-004, API-ELIG-003, API-BOOKING-001, API-BOOKING-004, API-BOOKING-005, API-CLINICAL-003, API-FINANCE-002, API-FINANCE-003, API-FINANCE-004, API-REVIEWS-001, API-REVIEWS-002, API-CLAIMS-001, API-CLAIMS-002, API-CLAIMS-005.  
**Retryable:** No with the same key/payload mismatch. A new key is valid only for a genuinely new user intent, not as an automatic retry workaround.  
**Surface:** Action banner; client should stop automatic retries.  
**Integrity rule:** The conflict must create no new business side effect.

## 7. Eligibility Errors

### ERR-ELIG-001 — Provider/Service/Branch Not Currently Eligible

**Stable code:** `PROVIDER_SERVICE_NOT_ELIGIBLE`  
**HTTP status:** `409 Conflict`  
**Requirements:** FR-ELIG-001–006, FR-BOOKING-001  
**Client-facing message:** `لم تعد الخدمة متاحة للحجز لدى هذا الطبيب والفرع حاليًا. يرجى اختيار خيار آخر.`  
**When raised:** A safety-critical booking/reconfirmation check finds a failed mandatory eligibility, publication, branch, facility, credential, or launch-readiness gate.  
**APIs:** API-BOOKING-001, API-BOOKING-004.  
**Retryable:** No immediate blind retry. The user may refresh discovery after the underlying state changes.  
**Surface:** Unavailable-state/action banner with a path back to eligible alternatives.  
**Privacy rule:** Patient output contains practical safe reasoning only; reviewer-only evidence and internal `I` remain hidden.

### ERR-ELIG-002 — Eligibility Pending Evaluation or Required Evidence

**Stable code:** `ELIGIBILITY_PENDING_EVALUATION`  
**HTTP status:** `409 Conflict`  
**Requirements:** FR-ELIG-006–008, FR-BOOKING-001  
**Client-facing message:** `لا يمكن تأكيد الأهلية حاليًا لوجود معلومات أو أدلة ما تزال قيد التقييم.`  
**When raised:** Required facts/evidence are missing, expired, rejected, pending verification, or the current decision cannot be safely finalized. This state is not grade `F`.  
**APIs:** API-ELIG-002, API-ELIG-003, API-BOOKING-001.  
**Retryable:** Conditional after required evidence/evaluation progresses; not an immediate automatic retry.  
**Surface:** Unavailable/pending-state message with actionable missing-item guidance only when the actor is authorized to see it.

## 8. Booking Errors

### ERR-BOOKING-001 — Slot or Capacity Unavailable

**Stable code:** `BOOKING_SLOT_UNAVAILABLE`  
**HTTP status:** `409 Conflict`  
**Requirements:** FR-BOOKING-001, FR-BOOKING-003, NFR-AUDIT-002  
**Client-facing message:** `الموعد المطلوب لم يعد متاحًا. يرجى اختيار موعد آخر.`  
**When raised:** Slot capacity is exhausted or the proposed/alternative slot cannot be atomically reserved/confirmed.  
**APIs:** API-BOOKING-001, API-BOOKING-004.  
**Retryable:** No for the same unavailable slot; refresh/select another slot.  
**Surface:** Unavailable-state/action message while preserving booking context.  
**Concurrency rule:** Never report success if capacity was not durably committed.

### ERR-BOOKING-002 — Booking Action Invalid for Current State

**Stable code:** `BOOKING_ACTION_NOT_ALLOWED`  
**HTTP status:** `409 Conflict`  
**Requirements:** FR-BOOKING-002–003  
**Client-facing message:** `لا يمكن تنفيذ هذا الإجراء في الحالة الحالية.`  
**When raised:** The requested booking transition is not allowed from the authoritative current lifecycle state or applicable policy.  
**APIs:** API-BOOKING-004, API-BOOKING-005; API-IDENTITY-005 currently references this conditionally if a protected transition policy blocks revocation.  
**Retryable:** No until authoritative state/policy changes.  
**Surface:** Action banner/unavailable-state message.  
**Contract note:** The cross-domain reference from API-IDENTITY-005 is retained because it exists in the current `API_CONTRACTS.md`; `STATE_MACHINES.md` should confirm whether that reference remains valid or should later be replaced by an identity-specific error without reusing this ID.

### ERR-BOOKING-003 — Booking or Provider-Response Deadline Expired

**Stable code:** `BOOKING_DEADLINE_EXPIRED`  
**HTTP status:** `409 Conflict`  
**Requirements:** FR-BOOKING-003  
**Client-facing message:** `انتهت المهلة المتاحة لهذا الإجراء.`  
**When raised:** The provider response/alternative acceptance or other documented booking action occurs after its policy-governed deadline.  
**APIs:** API-BOOKING-004.  
**Retryable:** No for the expired action; follow the current authoritative booking state/next available action.  
**Surface:** Unavailable-state message with current booking status.  
**State rule:** For alternative expiry or explicit patient decline, this error does not define the resulting booking state. That outcome remains unresolved under `Q-BOOKING-001`; clients must not infer `REJECTED`, `CANCELLED`, or return-to-`REQUESTED` from this error alone.

## 9. Clinical Error

### ERR-CLINICAL-001 — Treatment Plan Cannot Be Accepted

**Stable code:** `TREATMENT_PLAN_NOT_ACCEPTABLE`  
**HTTP status:** `409 Conflict`  
**Requirements:** FR-CLINICAL-001–002, FR-FINANCE-001, NFR-AUDIT-003  
**Client-facing message:** `لا يمكن قبول الخطة العلاجية بصيغتها الحالية. يرجى مراجعة البيانات أو انتظار تحديث الخطة.`  
**When raised:** The plan/version is stale, not in an acceptable state, or lacks required service, stage, price, terms, protection-state, or governing policy information.  
**APIs:** API-CLINICAL-003.  
**Retryable:** No until a valid plan/version exists.  
**Surface:** Unavailable-state/action banner; do not imply that UberTib authored the treatment decision.  
**Integrity rule:** A failed acceptance creates no accepted clinical or financial snapshot.

## 10. Financial Record Error

### ERR-FINANCE-001 — Financial Event Invalid for Governing Terms or History

**Stable code:** `FINANCIAL_EVENT_NOT_ALLOWED`  
**HTTP status:** `409 Conflict`  
**Requirements:** FR-FINANCE-001–007, NFR-FINANCE-001, NFR-AUDIT-003  
**Client-facing message:** `لا يمكن تسجيل هذا الحدث المالي وفق الشروط والسجل الحاليين للحالة.`  
**When raised:** The proposed external payment/refund/confirmation/dispute event conflicts with the immutable accepted terms, currency/amount rules, original event relationship, approved refund decision, or append-only event-state rules.  
**APIs:** API-FINANCE-002, API-FINANCE-003, API-FINANCE-004.  
**Retryable:** No until the submitted facts or governing workflow state is valid.  
**Surface:** Inline field feedback when safely attributable to amount/currency/reference; otherwise action banner.  
**Financial boundary:** This error concerns recording external financial facts only. It must never imply failure of a platform payment, settlement, escrow, wallet transfer, or platform-executed refund because those capabilities do not exist in V1.

## 11. Review Error

### ERR-REVIEWS-001 — Review or Appeal Not Eligible

**Stable code:** `REVIEW_NOT_ELIGIBLE`  
**HTTP status:** `409 Conflict`  
**Requirements:** FR-REVIEWS-001–002  
**Client-facing message:** `لا يمكن تنفيذ إجراء التقييم هذا للحالة الحالية أو ضمن المهلة الحالية.`  
**When raised:** The experience is not a verified completed eligible experience, an active review already exists where only one is allowed, or the appeal/action is outside the applicable policy eligibility/window.  
**APIs:** API-REVIEWS-001, API-REVIEWS-002.  
**Retryable:** No until eligibility/state changes; deadline expiry is not solved by blind retry.  
**Surface:** Unavailable-state/action banner.  
**Integrity rule:** `R` remains separate from S/P/H/I and this error never changes scientific classification.

## 12. Claim and Refund-Request Errors

### ERR-CLAIMS-001 — Claim/Refund Request Not Eligible or Outside Policy Window

**Stable code:** `CLAIM_NOT_ELIGIBLE`  
**HTTP status:** `409 Conflict`  
**Requirements:** FR-CLAIMS-001–005, FR-FINANCE-007  
**Client-facing message:** `لا يمكن تقديم هذا الطلب أو الاعتراض وفق شروط الحالة أو المهلة الحالية.`  
**When raised:** A refund request, protection claim, or appeal is not permitted by the governing immutable terms/policy snapshot, lacks applicable protection entitlement, or falls outside its policy deadline.  
**APIs:** API-CLAIMS-001, API-CLAIMS-002, API-CLAIMS-005.  
**Retryable:** No until the authoritative eligibility state changes; an expired policy window is not retryable.  
**Surface:** Unavailable-state/action banner with safe reason summary where policy allows.

### ERR-CLAIMS-002 — Required Claim Evidence Incomplete or Invalid

**Stable code:** `CLAIM_EVIDENCE_INCOMPLETE`  
**HTTP status:** `422 Unprocessable Entity`  
**Requirements:** FR-CLAIMS-001–005, NFR-PLATFORM-003  
**Client-facing message:** `الأدلة المطلوبة غير مكتملة أو غير صالحة. يرجى مراجعة المتطلبات.`  
**When raised:** Required claim/refund/appeal evidence is missing, rejected, expired, invalid for the claim type, or otherwise does not satisfy the governing versioned evidence rules.  
**APIs:** API-CLAIMS-001, API-CLAIMS-002, API-CLAIMS-005.  
**Retryable:** No until evidence is corrected/approved.  
**Surface:** Inline evidence requirement state plus action-level summary.  
**Privacy rule:** Return only evidence requirements/statuses the actor is allowed to know; never private storage paths or malware-scanner internals.

## 13. Retry and Recovery Matrix

| Error | Automatic retry | User/data change required |
|---|---|---|
| ERR-PLATFORM-001 | No | Correct request |
| ERR-PLATFORM-002 | No | Refresh only when context may legitimately change |
| ERR-PLATFORM-003 | After retry window | No |
| ERR-PLATFORM-004 | Conditional/backoff | Mutation retry uses same idempotency key |
| ERR-IDENTITY-001 | After authentication | Authenticate/recover session |
| ERR-IDENTITY-002 | No | Authorization/context must change |
| ERR-IDENTITY-003 | After throttle window | Wait |
| ERR-IDENTITY-004 | Conditional | Correct code or request new challenge |
| ERR-AUDIT-001 | No | Resolve client idempotency misuse/new intent |
| ERR-ELIG-001 | No | Underlying eligibility must change or choose another option |
| ERR-ELIG-002 | No immediate retry | Evidence/evaluation must progress |
| ERR-BOOKING-001 | No | Choose another slot/refresh availability |
| ERR-BOOKING-002 | No | Booking/state/policy must change |
| ERR-BOOKING-003 | No | Follow current booking state |
| ERR-CLINICAL-001 | No | Plan/version must be corrected |
| ERR-FINANCE-001 | No | Submitted fact/workflow state must be corrected |
| ERR-REVIEWS-001 | No | Eligibility/window must permit action |
| ERR-CLAIMS-001 | No | Eligibility/window must permit action |
| ERR-CLAIMS-002 | No | Required evidence must be corrected |

## 14. Logging and Audit Rules

- Expected validation/business rejections are not application crashes.
- Unexpected `ERR-PLATFORM-004` failures must emit privacy-safe operational telemetry with a correlation identifier.
- Sensitive authorization decisions and business decisions are audited when required by FR-AUDIT-001–002 and NFR-AUDIT-001.
- OTPs, secrets, signed/private URLs, health payloads, private filenames, raw evidence, and unnecessary identity/financial data must not be written to ordinary logs or error payloads.
- A client-visible error must never expose stack traces, SQL errors, internal class names, or provider credentials.

## 15. Current Implementation Gap

`API-CATALOG-001` currently uses framework/OpenAPI error behavior for `429` and a generic `500` message. The canonical stable error codes `RATE_LIMITED` and `SERVER_ERROR` defined here therefore represent **required normalization**, not verified current behavior.

All remaining `ERR-*` entries belong to proposed APIs and must be verified against actual handlers/tests once implementation exists. Their HTTP status and semantic meaning are fixed by this documentation baseline unless an approved upstream requirement or contract version supersedes them.

## 16. Registry Allocation Status

This file canonically defines the `ERR-*` IDs reserved by `API_CONTRACTS.md`:

- `ERR-PLATFORM-001`–`ERR-PLATFORM-004`
- `ERR-IDENTITY-001`–`ERR-IDENTITY-004`
- `ERR-AUDIT-001`
- `ERR-ELIG-001`–`ERR-ELIG-002`
- `ERR-BOOKING-001`–`ERR-BOOKING-003`
- `ERR-CLINICAL-001`
- `ERR-FINANCE-001`
- `ERR-REVIEWS-001`
- `ERR-CLAIMS-001`–`ERR-CLAIMS-002`

These allocations are append-only and are synchronized in the highest-ID registry in `docs/README.md`. Future allocations must update that registry without renumbering, reusing, or repurposing existing IDs.