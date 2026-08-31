# UberTib Content Guide — Error Recovery Copy

**Phase:** 3 — Design System, Session 4 (Content)
**Owns:** what the user does next for every `ERR-*`, on both profiles, in Arabic. **Does not own and
never restates** the canonical Arabic client-facing message — that belongs to
`docs/api/ERROR_CATALOG.md` by construction, referenced here, never forked. Two copies of one string is
two sources of truth, and `docs/api/ERROR_CATALOG.md` wins.

**Coverage measured, not assumed:** every `ERR-*` matching the canonical pattern anywhere under `docs/`
was re-collected fresh for this session, not taken from the implementation plan's own count. **21
distinct IDs found, 21 covered below, 0 missing** — `ERR-AUDIT-001`, `ERR-BOOKING-001..003`,
`ERR-CLAIMS-001..002`, `ERR-CLINICAL-001..002`, `ERR-ELIG-001..002`, `ERR-FINANCE-001`,
`ERR-IDENTITY-001..004`, `ERR-PLATFORM-001..005`, `ERR-REVIEWS-001`. This matches
`docs/api/ERROR_CATALOG.md` §16's own allocation list and `docs/README.md`'s registry snapshot line
exactly.

## Never-invented ground rule

Every recovery action and every escalation route below traces to an already-documented mechanism —
a component's content rule, an interaction pattern's recovery step, or a named lifecycle machine. Where
no canonical recovery or escalation exists, this file says so explicitly rather than inventing one.
Two rows below carry no escalation route at all, and that absence is stated, not papered over.

## Panel-native surface vocabulary — closes the Phase 1 gap recorded in plan section 8.4

`docs/api/ERROR_CATALOG.md` section 3 defines five presentation surfaces in client/API terms only. Every
`ERR-*` below is assigned one or two of the five — never all five, and never invented beyond what the
catalog assigns. The table below is the one-time mapping from each catalog surface to its Profile A
(Filament) realization, per `CMP-PLATFORM-010`'s realization row (`Extended` — Filament notification and
page-level state, plus a custom block for the `permission-denied` and `unknown-outcome` variants). Every
error row references this table by name instead of restating it 21 times.

| Catalog surface (Profile C and API-general) | Profile A realization |
|---|---|
| Inline field validation | Filament form field validation state — same content rule, framework-native rendering. |
| Action banner/toast | Filament `Notification::make()`, held in the notification centre in addition to the toast — `CMP-PLATFORM-015`'s duplication rule for anything deadline-bearing. |
| Full-page/auth gate | Filament's session-expired redirect to sign-in, returning to the original panel context afterwards — `IX-PLATFORM-007`. |
| Unavailable-state message | A page-level Filament Placeholder/empty-state block, or the custom `CMP-PLATFORM-010` block for `permission-denied` and `unknown-outcome`, which Filament does not ship natively. |
| Silent-log-only detail | Not user-facing on either profile. Operational telemetry only, per `docs/api/ERROR_CATALOG.md` section 14. |

## CMP-PLATFORM-010 variant reference

Where a row below names a `CMP-PLATFORM-010` variant, that is the recovery-state component's own
vocabulary — `fetch-failure`, `stale`, `permission-denied`, `authentication-required`, `unknown-outcome`,
`not-retryable` — fixed by `COMPONENT_INVENTORY_PLATFORM.md`, not invented here. Field-level validation
errors (`ERR-PLATFORM-001` and comparable authoring-time codes) render through inline field validation
under `IX-PLATFORM-018` instead, which is not one of the six variants and is noted as such.

---

## TXT-ERR-PLATFORM-001 — ERR-PLATFORM-001 · Validation failed

**Audiences / platforms:** every actor submitting any form, on both profiles — the most common error
family in the product.
**Canonical Arabic message (referenced, `docs/api/ERROR_CATALOG.md` §4):**
`تعذر إكمال الطلب. يرجى مراجعة البيانات المدخلة.`
**Supporting message (`TXT`-owned):** field-bound. Each field carries its own message naming what is
wrong and how to fix it — `IX-PLATFORM-018`. The catalog's generic sentence above is shown only when
the failure cannot be attributed to one field; it is never the only thing the actor sees when a field
is at fault.
**Recovery action:** correct the named field(s) and submit again. This is a fresh submission the actor
takes deliberately, not an automatic retry.
**Retry allowed:** No — correct first. (`docs/api/ERROR_CATALOG.md` §13 retry matrix.)
**Escalation route:** none canonical; this is user-correctable within the form.
**Technical detail hidden from user:** which internal validation rule, regex, or server-side constraint
fired; any field name outside the public schema.
**Relevant TXT rule:** `TXT-PLATFORM-005` (Validation copy formula); surface is inline field validation,
not a `CMP-PLATFORM-010` variant.
**Surfaces:** Inline field validation on both profiles; action banner only when not field-attributable.

---

## TXT-ERR-PLATFORM-002 — ERR-PLATFORM-002 · Resource not found or intentionally undisclosed

**Audiences / platforms:** every actor, both profiles.
**Canonical Arabic message:** `تعذر العثور على المورد المطلوب.`
**Supporting message:** none additional. This code is also used to avoid disclosing a protected
cross-scope resource, so the supporting copy must never hint at which case applies — a resource that
exists but is forbidden must read identically to one that genuinely does not exist.
**Recovery action:** return to a list or search, or refresh only where the actor legitimately expects
the item to reappear (a known synchronization delay). No "request access" affordance is offered here,
because offering one would itself disclose that the resource exists.
**Retry allowed:** No, unless a legitimate refresh applies.
**Escalation route:** none canonical.
**Technical detail hidden from user:** whether the true cause is "does not exist" or "exists but
forbidden" — this distinction is structurally hidden by design, not merely by omission.
**Relevant TXT rule:** `TXT-PLATFORM-016` (Permissions); `CMP-PLATFORM-010` `not-retryable` variant, or
`fetch-failure` where a legitimate refresh applies.
**Surfaces:** Unavailable-state message / full-page not-found state, both profiles.

---

## TXT-ERR-PLATFORM-003 — ERR-PLATFORM-003 · Rate limited

**Audiences / platforms:** every actor, both profiles, on public/API rate-limited endpoints.
**Canonical Arabic message:** `تم إرسال طلبات كثيرة خلال فترة قصيرة. يرجى المحاولة لاحقًا.`
**Supporting message:** the remaining wait time where the server provides `retry_after_seconds`; where
it does not, a general "again shortly" framing without a fabricated countdown.
**Recovery action:** wait for the window to elapse, then the original action becomes available again
without any change to what was submitted.
**Retry allowed:** Yes, after the server-provided retry window.
**Escalation route:** none canonical — this resolves by waiting.
**Technical detail hidden from user:** internal rate-limit thresholds and keys.
**Relevant TXT rule:** `TXT-PLATFORM-008` (Loading and wait states); `CMP-PLATFORM-010` `fetch-failure`
variant.
**Surfaces:** Action banner/toast, both profiles, preserving current context.

---

## TXT-ERR-PLATFORM-004 — ERR-PLATFORM-004 · Unexpected server or configuration failure

**Audiences / platforms:** every actor, both profiles — the generic fallback for a truly unexpected
failure with no more specific code.
**Canonical Arabic message:** `حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى لاحقًا.`
**Supporting message:** frames the fault as the system's, never the user's, per the voice principle
"never blame the user" — but adds nothing that alters or duplicates the canonical sentence.
**Recovery action:** for a read, retry in place. For a mutation, retry reuses the same idempotency key
under `IX-PLATFORM-002` — never a new submission merely because a response was lost.
**Retry allowed:** Conditional/backoff. Reads may retry with backoff; mutations retry only with the same
idempotency key.
**Escalation route:** **none defined in the current documentation baseline.** No support-contact flow is
specified anywhere in the canonical sources for this code. This file does not invent one; a persistent
`ERR-PLATFORM-004` across repeated correctly-keyed retries is an engineering defect to be caught by the
correlation-safe telemetry `docs/api/ERROR_CATALOG.md` §14 requires, not a user-facing escalation path.
**Technical detail hidden from user:** stack traces, SQL errors, internal class names, provider
credentials — explicitly prohibited by §14. A safe correlation identifier may be shown for support use
without exposing what it points to.
**Relevant TXT rule:** `TXT-PLATFORM-006` (System error copy); `IX-PLATFORM-002`, `IX-PLATFORM-004`;
`CMP-PLATFORM-010` `fetch-failure` or `not-retryable` depending on whether the specific failure is one
the retry matrix says retry can address.
**Surfaces:** Action banner/full-page generic error; diagnostic detail is silent-log-only on both
profiles.

---

## TXT-ERR-PLATFORM-005 — ERR-PLATFORM-005 · Evidence rejected or failed validation

**Audiences / platforms:** the actor transferring evidence — Patient or Clinic-authoring — and the
reviewer who sees the resulting state.
**Canonical Arabic message:** `تعذر قبول الملف المرفوع. يرجى مراجعة نوع الملف وحجمه ثم إعادة المحاولة.`
**Supporting message:** **this is copy obligation 3 in its sharpest form.** This code fires only from
the evidence-transfer session's `REJECTED` exit — never from `FAILED_RETRYABLE`. The supporting copy
must therefore never be reachable from a dropped connection or an interrupted transfer; see
`TXT-STATE-PLATFORM-001` for the full eight-state structural separation this depends on. Where the
system knows the specific failed check (type, size, or scan outcome), the supporting text names it
instead of repeating the generic canonical sentence alone.
**Recovery action:** replace the file with one that meets the named requirement. The same file is never
resubmitted as-is.
**Retry allowed:** No, for the same file as submitted. A transient transfer failure is a different code
entirely (`FAILED_RETRYABLE`, not this one) and is never routed here.
**Escalation route:** none canonical.
**Technical detail hidden from user:** malware-scanner internals and vendor identity, private storage
paths, signed URLs. Detailed scan output is silent-log-only.
**Relevant TXT rule:** `TXT-STATE-PLATFORM-001` (Evidence transfer session); `IX-PLATFORM-006`;
`CMP-PLATFORM-012`'s `REJECTED` state; copy obligation 3.
**Surfaces:** Inline field validation on the evidence item, both profiles, with the safe actionable
reason attached directly to the item.

---

## TXT-ERR-IDENTITY-001 — ERR-IDENTITY-001 · Authentication required

**Audiences / platforms:** every actor attempting a protected action without a valid session, both
profiles.
**Canonical Arabic message:** `يلزم تسجيل الدخول للمتابعة.`
**Supporting message:** states that the original destination is preserved and will be returned to once
authentication succeeds — this is not a dead end, it is a detour.
**Recovery action:** authenticate (or recover the session), which routes back to the original protected
context automatically.
**Retry allowed:** Yes, after successful authentication/session recovery.
**Escalation route:** none — self-service by design.
**Technical detail hidden from user:** any authorization scope detail before authentication completes.
**Relevant TXT rule:** `CMP-PLATFORM-010` `authentication-required` variant; `IX-PLATFORM-007`.
**Surfaces:** Full-page/auth gate on both profiles.

---

## TXT-ERR-IDENTITY-002 — ERR-IDENTITY-002 · Forbidden or outside authorized scope

**Audiences / platforms:** every authenticated actor attempting an action outside their current role,
organization, branch, case relationship, guardian grant, or separation-of-duties scope.
**Canonical Arabic message:** `لا تملك صلاحية تنفيذ هذا الإجراء.`
**Supporting message:** states what scope the actor **does** hold and, where a legitimate path exists,
how to obtain the needed one — never names an internal permission key and never implies an override
exists, per `IX-PLATFORM-007`.
**Recovery action:** navigate to a scope the actor already holds. For Clinic staff, the canonical path
to a **different** scope is requesting a new grant from an authorized clinic owner or representative —
`TXT-STATE-IDENTITY-002` (Staff invitation and scoped grant), not an appeal of this decision. For Patient
representation, scope is governed by the guardian-grant mechanism, which is its own flow, not an
escalation of this error.
**Retry allowed:** No, until authorization context changes.
**Escalation route:** requesting a new/wider grant through the canonical invitation mechanism where the
actor is Clinic staff (see Recovery action above); **none for Patient-side forbidden actions** — this
file does not invent a support-contact path where the documentation names none.
**Technical detail hidden from user:** internal permission or role keys; whether the resource exists at
all — where disclosure would leak existence, `ERR-PLATFORM-002` is used instead of this code, per the
catalog's own security rule.
**Relevant TXT rule:** `TXT-PLATFORM-016` (Permissions); `CMP-PLATFORM-010` `permission-denied` variant;
`CMP-PLATFORM-004`'s absent-action-explained rule; `CMP-PLATFORM-003`.
**Surfaces:** Unavailable-state/permission-denied message on both profiles.

---

## TXT-ERR-IDENTITY-003 — ERR-IDENTITY-003 · OTP send throttled

**Audiences / platforms:** any actor requesting an OTP resend, Patient-facing primarily (`API-IDENTITY-001`).
**Canonical Arabic message:** `تم طلب رمز تحقق عدة مرات. يرجى الانتظار قبل طلب رمز جديد.`
**Supporting message:** the remaining wait time before a new code may be requested.
**Recovery action:** wait for the throttle window, then request a new code.
**Retry allowed:** Yes, after the throttle window.
**Escalation route:** none canonical.
**Technical detail hidden from user:** whether the destination phone number belongs to another
protected account — enumeration protection is structural, never disclosed in the supporting copy.
**Relevant TXT rule:** `TXT-PLATFORM-005`, `TXT-PLATFORM-008`.
**Surfaces:** Inline/action-level message anchored to the resend control, both profiles.

---

## TXT-ERR-IDENTITY-004 — ERR-IDENTITY-004 · OTP invalid, expired, used, or attempts exhausted

**Audiences / platforms:** the actor mid-verification, Patient-facing primarily (`API-IDENTITY-002`).
**Canonical Arabic message:** `رمز التحقق غير صالح أو انتهت صلاحيته. يرجى التحقق من الرمز أو طلب رمز جديد عند الحاجة.`
**Supporting message:** **one code, four distinct next actions** — the plan's own hardest case for this
family. The supporting copy branches on which sub-case applies:
- **Wrong code, attempts remain:** invites re-entry and states how many attempts remain.
- **Expired:** invites requesting a new code, subject to `ERR-IDENTITY-003` throttling.
- **Already consumed** (invalidated by a resend): invites requesting a new code.
- **Attempts exhausted:** blocks immediate re-entry and invites requesting a new code instead.
**Recovery action:** re-enter the code where attempts remain and the challenge is still valid; otherwise
request a new challenge.
**Retry allowed:** Conditional — another attempt only while the challenge is valid and attempts remain;
otherwise a new challenge, itself subject to send throttling.
**Escalation route:** none canonical.
**Technical detail hidden from user:** the expected OTP or its hash; exact internal attempt-tracking
beyond a safe "attempts remaining" count.
**Relevant TXT rule:** `TXT-PLATFORM-005`; plan section 11.3's own flag on this code.
**Surfaces:** Inline OTP validation plus the branched recovery guidance above, Patient-facing.

---

## TXT-ERR-AUDIT-001 — ERR-AUDIT-001 · Idempotency key conflict

**Audiences / platforms:** any actor whose client reused a retry key for a materially different
request, both profiles.
**Canonical Arabic message:** `تعذر تكرار الطلب لأن مفتاح إعادة المحاولة استُخدم لطلب مختلف.`
**Supporting message:** this is not a user-recoverable retry — per `IX-PLATFORM-002`/`IX-AUDIT-001`,
another confirm or another retry does not resolve it, because the conflict is a client-side key-reuse
condition, not a transient failure. The supporting copy directs the actor to refresh and confirm current
state before deciding whether the original action is still needed.
**Recovery action:** refresh the surface, confirm authoritative state, and — only if the original intent
still stands — submit again as a deliberate new action from the action bar. No automatic retry is
offered under this error.
**Retry allowed:** No, with the same key/payload mismatch.
**Escalation route:** none — a recurring instance across otherwise-correct client behavior is an
engineering defect (the interface reused a key across intents), not a user-facing escalation.
**Technical detail hidden from user:** the idempotency key value; internal conflict-detection mechanics.
**Relevant TXT rule:** `IX-PLATFORM-002`, `IX-AUDIT-001`; `CMP-PLATFORM-010` `not-retryable` variant.
**Surfaces:** Action banner on both profiles; automatic retries stop here.

---

## TXT-ERR-ELIG-001 — ERR-ELIG-001 · Provider, service, or branch not currently eligible

**Audiences / platforms:** Patient (discovery/booking), Clinic (responding to a request), Admin
(resolving a held booking).
**Canonical Arabic message:** `لم تعد الخدمة متاحة للحجز لدى هذا الطبيب والفرع حاليًا. يرجى اختيار خيار آخر.`
**Supporting message:** states plainly that the option is no longer available and is **never worded as a
fault of the actor** — per `IX-ELIG-001`. Patient sees only the practical meaning; Clinic additionally
sees the controlling reason through `CMP-ELIG-003`'s `provider` variant where authorized.
**Recovery action:** choose one of the eligible alternatives offered through `CMP-ELIG-003`, or refresh
discovery once the underlying state may have changed.
**Retry allowed:** No immediate blind retry.
**Escalation route:** none — this is a live eligibility fact re-checked at the moment of commit, not an
appealable decision. (Contrast `TXT-ERR-REVIEWS-001` and `TXT-ERR-CLAIMS-001`, which do have an appeal
route, because those are decisions, not point-in-time facts.)
**Technical detail hidden from user:** internal risk profile (`I`), calibration internals, reviewer-only
evidence.
**Relevant TXT rule:** `CMP-ELIG-003`, `IX-ELIG-001`; `CMP-PLATFORM-010` `not-retryable` variant.
**Surfaces:** Unavailable-state/action banner with a path to eligible alternatives, both profiles.

---

## TXT-ERR-ELIG-002 — ERR-ELIG-002 · Eligibility pending evaluation or required evidence

**Audiences / platforms:** Patient, Clinic, Admin.
**Canonical Arabic message:** `لا يمكن تأكيد الأهلية حاليًا لوجود معلومات أو أدلة ما تزال قيد التقييم.`
**Supporting message:** **copy obligation 2 applies directly.** Pending is stated as pending, never as a
refusal, and never as a provider accusation. Where the actor is authorized to see what is outstanding, a
specific missing item is named; otherwise the copy states plainly that evaluation is in progress and no
action is currently available. This state is explicitly **not** the clinical grade `F` and must never be
worded as if it were.
**Recovery action:** none immediate — evaluation must progress, or missing evidence must be supplied
through its own governed flow.
**Retry allowed:** Conditional — only as evaluation genuinely progresses, never an immediate blind retry.
**Escalation route:** none formal — this is `CMP-ELIG-003`'s `PENDING_EVALUATION` state, distinct in
tone and icon from `NOT_ELIGIBLE`, and it resolves by evaluation, not by appeal.
**Technical detail hidden from user:** internal `P`/`I`/calibration values, reviewer-only evidence.
**Relevant TXT rule:** `CMP-ELIG-003`, `IX-ELIG-001`; `TXT-STATE-ELIG-001`; copy obligation 2.
**Surfaces:** Unavailable/pending-state message with actionable missing-item guidance only where
authorized, both profiles.

---

## TXT-ERR-BOOKING-001 — ERR-BOOKING-001 · Slot or capacity unavailable

**Audiences / platforms:** Patient, Clinic, Admin, wherever a slot is committed.
**Canonical Arabic message:** `الموعد المطلوب لم يعد متاحًا. يرجى اختيار موعد آخر.`
**Supporting message:** reassures that nothing was booked or charged — this is a capacity race at the
moment of commit, designed for and expected under `NFR-PLATFORM-001`'s capacity guarantee, not a fault
on either side.
**Recovery action:** choose another slot from refreshed availability.
**Retry allowed:** No, for the same unavailable slot; select a different one.
**Escalation route:** none canonical.
**Technical detail hidden from user:** internal capacity-locking and concurrency mechanics.
**Relevant TXT rule:** `IX-ELIG-001`; `CMP-PLATFORM-010` `not-retryable` variant.
**Surfaces:** Unavailable-state/action message while preserving booking context, both profiles.

---

## TXT-ERR-BOOKING-002 — ERR-BOOKING-002 · Booking action invalid for current state

**Audiences / platforms:** Patient, Clinic, Admin.
**Canonical Arabic message:** `لا يمكن تنفيذ هذا الإجراء في الحالة الحالية.`
**Supporting message:** states the booking's actual current status through `CMP-PLATFORM-001`/`-002`
alongside this message, so "current state" is never left abstract. **This code is booking-domain only —
`docs/api/ERROR_CATALOG.md` §8's contract note is binding: a guardian-grant revocation is always
immediate and never blocked by booking state, so this error may never surface on an identity or
representation surface, and its recovery guidance may never be generalized enough to be reused there.**
**Recovery action:** view the booking's current state and the actions actually available from it; there
is no generic retry of the attempted action.
**Retry allowed:** No, until the authoritative state or policy changes.
**Escalation route:** none canonical.
**Technical detail hidden from user:** internal workflow/policy-engine mechanics.
**Relevant TXT rule:** `TXT-STATE-BOOKING-001`; `docs/api/ERROR_CATALOG.md` §8 contract note.
**Surfaces:** Action banner/unavailable-state message, both profiles.

---

## TXT-ERR-BOOKING-003 — ERR-BOOKING-003 · Booking or provider-response deadline expired

**Audiences / platforms:** Patient, Clinic, Admin.
**Canonical Arabic message:** `انتهت المهلة المتاحة لهذا الإجراء.`
**Supporting message:** **copy obligation 1 in full.** Where the underlying reason is
`ALTERNATIVE_EXPIRED` or `ALTERNATIVE_DECLINED`, this reads as "the window to respond closed and the
appointment was not confirmed" — never as a cancellation, and never with penalty language, because there
is no penalty. A late acceptance attempt after this point receives this error precisely because the
authoritative state already moved to `CANCELLED` under `TXT-STATE-BOOKING-001`.
**Recovery action:** start a new booking request. The prior unconfirmed request cannot be revived, and a
late acceptance is rejected rather than silently honored.
**Retry allowed:** No, for the expired action; follow the current authoritative booking state instead.
**Escalation route:** none — this is `IX-BOOKING-001`'s unrecoverable-lapse case, and offering a retry
here would be dishonest given what actually happened.
**Technical detail hidden from user:** none beyond standard internal workflow-timing detail.
**Relevant TXT rule:** `CMP-PLATFORM-005`, `IX-BOOKING-001`; `TXT-STATE-BOOKING-001`; copy obligation 1.
**Surfaces:** Unavailable-state message with the current booking status shown alongside, both profiles.

---

## TXT-ERR-CLINICAL-001 — ERR-CLINICAL-001 · Treatment plan cannot be accepted

**Audiences / platforms:** Patient (acceptance attempt), Clinic (authoring a replacement).
**Canonical Arabic message:** `لا يمكن قبول الخطة العلاجية بصيغتها الحالية. يرجى مراجعة البيانات أو انتظار تحديث الخطة.`
**Supporting message:** frames the plan as needing an update from the clinician — **never implies that
UberTib authored or judged the treatment decision itself**, per the catalog's own Surface rule. A
proposal may be refused because its policy-governed validity window passed (seven calendar days by
default, `PO-UX-16`) or because a material governing fact changed underneath it.
**Recovery action:** Patient — wait for the clinician to issue a corrected or new plan version; no action
is available on the expired proposal itself. Clinic — issue a new plan version; the same expired proposal
can never be resubmitted successfully.
**Retry allowed:** No. A new version is required, never a retry of the same proposal.
**Escalation route:** none beyond the clinician re-authoring a new version.
**Technical detail hidden from user:** the internal governance-policy expiry mechanics themselves, beyond
the stated validity window.
**Relevant TXT rule:** `CMP-CLINICAL-002`, `IX-CLINICAL-001`; `TXT-STATE-CLINICAL-001`.
**Surfaces:** Unavailable-state/action banner, both profiles.

---

## TXT-ERR-CLINICAL-002 — ERR-CLINICAL-002 · Treatment line violates a commercial integrity rule

**Audiences / platforms:** Clinic (authoring, the primary surface), Patient (rare — only if surfaced at
acceptance).
**Canonical Arabic message:** `لا يمكن إضافة هذا البند بصيغته الحالية. كل تكلفة إضافية يجب أن تكون ضمن نوع معتمد مع سبب واضح.`
**Supporting message:** reported **against the offending field** — category, reason, or the represented
treatment — and says specifically which rule it broke, per `CMP-CLINICAL-001`'s content rule. Where this
ever reaches a Patient-facing acceptance surface, the wording describes a plan that needs correcting and
never accuses the patient or the clinic, per the catalog's own Surface note.
**Recovery action:** Clinic — correct the line's category or reason, or represent the addition as its
own approved procedure line rather than an uncategorized surcharge. There is no fallback path that
records an "other" or "adjustment" category.
**Retry allowed:** No. The line must be corrected; there is no retry of the same invalid line.
**Escalation route:** none canonical.
**Technical detail hidden from user:** internal commercial-option/category identifiers beyond the safe
category name.
**Relevant TXT rule:** `CMP-CLINICAL-001`; `IX-PLATFORM-018`; copy obligation 7.
**Surfaces:** Inline field validation on the offending line during authoring; action-level rejection on
acceptance.

---

## TXT-ERR-FINANCE-001 — ERR-FINANCE-001 · Financial event invalid for governing terms or history

**Audiences / platforms:** Clinic, Admin (recording external financial facts against a case).
**Canonical Arabic message:** `لا يمكن تسجيل هذا الحدث المالي وفق الشروط والسجل الحاليين للحالة.`
**Supporting message:** **the financial boundary rule is absolute here** — this error concerns
**recording** an external financial fact, never a platform payment, settlement, escrow, wallet, or
platform-executed refund, because none of those capabilities exist in V1. The supporting copy frames the
conflict as "the entered fact does not match the accepted terms or history for this case," never as a
payment failure.
**Recovery action:** review and correct the submitted amount, currency, or reference against the
accepted terms snapshot, or check the case's current financial history before resubmitting.
**Retry allowed:** No, until the submitted fact or governing workflow state is valid.
**Escalation route:** none defined for this record-keeping error itself; a genuinely contested financial
fact is pursued through `TXT-STATE-CLAIMS-001`/`-002` (claim/refund request and its appeal), not through
retrying this recording action.
**Technical detail hidden from user:** internal ledger/reconciliation mechanics.
**Relevant TXT rule:** `TXT-STATE-FINANCE-001`; copy obligation 9.
**Surfaces:** Inline field feedback when attributable to amount/currency/reference; otherwise action
banner.

---

## TXT-ERR-REVIEWS-001 — ERR-REVIEWS-001 · Review or appeal not eligible

**Audiences / platforms:** Patient/guardian (review author), Clinic (subject provider, as an authorized
appellant per `PO-UX-10`), Admin.
**Canonical Arabic message:** `لا يمكن تنفيذ إجراء التقييم هذا للحالة الحالية أو ضمن المهلة الحالية.`
**Supporting message:** states which condition applies where the actor is authorized to know it — the
experience is not a verified completed eligible one, an active review already exists where only one is
allowed, the actor is not an authorized appellant, or the window has closed. An appeal that attempts to
edit rating content rather than contest eligibility, verification, or policy compliance receives this
error and the supporting copy says plainly that content edits are not what an appeal does.
**Recovery action:** where still inside the applicable window and eligible, correct the underlying
condition and retry the original action; where the window has closed, no action remains for this
specific attempt.
**Retry allowed:** No, until eligibility or state changes; a closed deadline window is not solved by
retry.
**Escalation route:** **the Review Appeal lifecycle is the canonical route** —
`TXT-STATE-REVIEWS-002` (`SUBMITTED` → `DECIDED`) — available to the authoring patient/guardian **or**
the affected provider/clinic, per `PO-UX-10`'s both-sides rule, but only to contest eligibility,
verification, or policy compliance, never to edit the rating's content.
**Technical detail hidden from user:** internal review-integrity signals.
**Relevant TXT rule:** `TXT-STATE-REVIEWS-002`; `IX-AUDIT-001` for the appeal's own sensitive-decision
capture.
**Surfaces:** Unavailable-state/action banner, both profiles.

---

## TXT-ERR-CLAIMS-001 — ERR-CLAIMS-001 · Claim/refund request not eligible or outside policy window

**Audiences / platforms:** Patient (claimant), Clinic (where affected), Admin.
**Canonical Arabic message:** `لا يمكن تقديم هذا الطلب أو الاعتراض وفق شروط الحالة أو المهلة الحالية.`
**Supporting message:** states the safe reason summary where policy allows — no applicable protection
entitlement, or the window has closed. **Never worded as insurance, reimbursement, or a guaranteed
result** — copy obligation 10; protection is always stated as its documented conditional meaning.
**Recovery action:** where still within window and entitled, correct and resubmit; where the window or
entitlement genuinely does not apply, no action remains for this specific claim.
**Retry allowed:** No, until the authoritative eligibility state changes; an expired policy window is not
retryable.
**Escalation route:** **the Claim Appeal lifecycle is the canonical route** —
`TXT-STATE-CLAIMS-002` (`SUBMITTED` → `UNDER_REVIEW` → `DECIDED`) — for contesting the claim/refund
decision itself, distinct from the original filing-eligibility gate this error represents.
**Technical detail hidden from user:** internal protection-level (`H`) classification internals.
**Relevant TXT rule:** `TXT-STATE-CLAIMS-001`, `TXT-STATE-CLAIMS-002`; copy obligation 10.
**Surfaces:** Unavailable-state/action banner with a safe reason summary where policy allows, both
profiles.

---

## TXT-ERR-CLAIMS-002 — ERR-CLAIMS-002 · Required claim evidence incomplete or invalid

**Audiences / platforms:** Patient (claimant), Clinic (where responding), Admin (reviewing).
**Canonical Arabic message:** `الأدلة المطلوبة غير مكتملة أو غير صالحة. يرجى مراجعة المتطلبات.`
**Supporting message:** names which required evidence item is missing or invalid where the actor is
authorized to know it, per `TXT-STATE-CLAIMS-001`'s `EVIDENCE_INCOMPLETE` row. **Copy obligation 3
applies here directly**, because claims evidence uses the same evidence-transfer session machine as
every other evidence surface: a transient transfer failure (`FAILED_RETRYABLE`) must never be presented
under this error, which fires only from an actual rejection or an incomplete requirement set.
**Recovery action:** add or replace the named evidence item(s) and resubmit within the claim's own
deadline.
**Retry allowed:** No, until evidence is corrected or approved.
**Escalation route:** none beyond correcting and resubmitting within the claim's own workflow —
`EVIDENCE_INCOMPLETE` is itself the holding state, not an escalation-free dead end, since the deadline
and the missing item are both stated.
**Technical detail hidden from user:** private storage paths, malware-scanner internals.
**Relevant TXT rule:** `CMP-PLATFORM-012`; `TXT-STATE-CLAIMS-001`; `TXT-STATE-PLATFORM-001`; copy
obligation 3.
**Surfaces:** Inline evidence requirement state plus an action-level summary, both profiles.

---

## Coverage summary

| Check | Result |
|---|---|
| `ERR-*` found anywhere under `docs/` | **21** |
| `ERR-*` covered above | **21** |
| Missing | **0** |
| Escalation route stated as "none defined" rather than invented | `ERR-PLATFORM-004`, `ERR-IDENTITY-002` (Patient side) — both explicit, not silent |
| Recovery action traced to a documented mechanism for every row | Yes — no row invents a path absent from `docs/domain/STATE_MACHINES.md`, a `CMP-*` content rule, or an `IX-*` recovery step |
