# UberTib API Contracts

**Phase:** 2 — Conditional Engineering Documentation  
**Mode:** Existing Repository  
**Baseline:** 2026-08-24  
**Product source:** `docs/PRD.md`  
**Technical source:** `docs/SDD.md`  
**Architecture source:** `docs/architecture/SYSTEM_ARCHITECTURE.md`  
**Registry:** `docs/README.md`

## 1. Purpose and Contract Boundary

This document owns the external/mobile REST contract for UberTib V1. Filament workflows are in-process adapters to the same application actions and do not require internal HTTP endpoints unless a later requirement explicitly introduces one.

Only one API route is currently verified as implemented: `GET /api/v1/catalog/service-groups`. Every other route in this document is marked **Proposed** and represents the minimum contract needed by confirmed product requirements; proposed paths may change before implementation while preserving the owning requirement behavior.

`Q-PLATFORM-001` still blocks a claim of complete SRS reconciliation. `Q-PLATFORM-003` also blocks final selection of OTP/MFA, notification, malware-scanning, and private-evidence transfer providers. Production medical behavior remains governed by `Q-CATALOG-001` and `Q-ELIG-001`.

## 2. Contract Conventions

- Base prefix: `/api/v1`.
- JSON is the default request/response format except future evidence-binary transfer contracts.
- Current collection convention is `{ "data": [...], "meta": {...} }` as implemented by the catalog endpoint.
- Proposed single-resource contracts use `{ "data": {...} }`.
- IDs exposed to clients must be stable public identifiers; raw implementation IDs are not a required public contract.
- Arabic-first human-readable fields are required where the PRD exposes user-facing meaning.
- Internal `I`, credential secrets, reviewer evidence, private object paths, signed URLs, and protected health payloads outside an authorized case context must never appear in public responses.
- Sensitive mutation endpoints require idempotency where noted. Reusing the same key with a materially different payload is rejected by `ERR-AUDIT-001`.
- Authentication transport is intentionally not fixed here. Where an endpoint says **Authenticated**, the server must resolve an authenticated UberTib identity and apply the permission/scope model; bearer/session mechanics are an implementation decision not established by the current sources.
- Stable error definitions are owned by `docs/api/ERROR_CATALOG.md`. Error IDs referenced here are reserved for that file and are not redefined here.

## 3. Common Error References

The following error IDs are referenced by contracts below and are defined canonically in `ERROR_CATALOG.md`:

- `ERR-PLATFORM-001` — validation failed.
- `ERR-IDENTITY-001` — authentication required.
- `ERR-IDENTITY-002` — forbidden/out of authorized scope.
- `ERR-PLATFORM-002` — resource not found or intentionally undisclosed.
- `ERR-PLATFORM-003` — rate limited.
- `ERR-PLATFORM-004` — unexpected server/configuration failure.
- `ERR-AUDIT-001` — idempotency-key conflict.
- `ERR-IDENTITY-003` — OTP send throttled.
- `ERR-IDENTITY-004` — OTP invalid, expired, already used, or attempt limit exceeded.
- `ERR-ELIG-001` — provider/service/branch not currently eligible.
- `ERR-ELIG-002` — eligibility pending required evidence/evaluation.
- `ERR-BOOKING-001` — slot/capacity unavailable.
- `ERR-BOOKING-002` — booking action invalid for current state.
- `ERR-BOOKING-003` — booking/provider-response deadline expired.
- `ERR-CLINICAL-001` — treatment plan cannot be accepted in its current state.
- `ERR-FINANCE-001` — financial event invalid for the governing accepted terms/history.
- `ERR-REVIEWS-001` — review or appeal is not eligible.
- `ERR-CLAIMS-001` — claim/refund request is not eligible or is outside its policy window.
- `ERR-CLAIMS-002` — required claim evidence is incomplete or invalid.

## 4. Implemented Contract

### API-CATALOG-001 — List Visible Service Groups

**Requirements:** FR-CATALOG-001, FR-OPS-003, NFR-PLATFORM-005  
**Status:** **Implemented**  
**Method / Path:** `GET /api/v1/catalog/service-groups`  
**Actor / Auth:** Public; no authentication.  
**Request:** No body. Catalog mode is server configuration, not a client-selectable query parameter.  
**Response:** `200 application/json` with `data: ServiceGroup[]` and `meta.mode: "evaluation" | "production"`.

`ServiceGroup`:
- `code: string` — currently G01–G04.
- `name.ar: string`, `name.en: string`.
- `description_ar: string`.
- `services: Service[]`.

`Service`:
- `code: string` — current pattern `G0[1-4]-SNN`.
- `slug: string`.
- `name.ar: string`, `name.en: string`.
- `description_ar: string`.
- `definition: ServiceDefinitionSummary`.

`ServiceDefinitionSummary`:
- `version: integer >= 1`.
- `audience: "evaluation" | "production"`.
- `clinical_review_state: "pending" | "approved"`.
- `production_ready: boolean`.
- `protection.funded: false` in V1.

**Errors:** `ERR-PLATFORM-003`, `ERR-PLATFORM-004`. Current OpenAPI exposes `429` and a generic `500` message shape; stable error-code implementation is still required.  
**Business Rules:** Production mode returns only currently production-visible definitions. Evaluation-only definitions are never published in production mode. The highest applicable unready production version does not silently fall back to an older ready version.  
**Side Effects:** None.  
**Idempotency / Concurrency:** Read-only.  
**Caching:** Current route applies public cache headers with max age 60 seconds and ETag behavior.  
**Data Touched:** Service groups, services, visible service definition, launch readiness.  
**Existing Tests:** `UberTip-Backend/tests/Feature/Api/V1/Catalog/ListServiceGroupsTest.php`.  
**Source Evidence:** `routes/api.php`, catalog resources, current OpenAPI contract, feature tests.

Current route and current OpenAPI evidence align on this single public route. `CONFLICT-CATALOG-001` is retained only as a permanently allocated **Resolved (2026-08-24)** historical ID. Broader feature-spec behavior remains Planned and is not evidence that additional routes are currently implemented.

## 5. Identity and Patient Access

### API-IDENTITY-001 — Request Patient OTP

**Requirements:** FR-IDENTITY-002, NFR-IDENTITY-002  
**Status:** **Proposed**  
**Method / Path:** `POST /api/v1/auth/patient/otp/request`  
**Actor / Auth:** Public pre-authentication flow.  
**Request:** `phone: string` required and normalized according to the approved contact policy.  
**Response:** `202` with `data.challenge_id: string`, `data.expires_in_seconds: integer`, and safe resend timing metadata; never return the OTP.  
**Validation:** Six-digit OTP generation, five-minute expiry, hash-only storage, max five verification attempts, max three sends per 15 minutes per phone/account/IP combination.  
**Errors:** `ERR-PLATFORM-001`, `ERR-IDENTITY-003`, `ERR-PLATFORM-004`.  
**Side Effects:** Creates/replaces a verification challenge and queues provider delivery. Resend invalidates the previous OTP without resetting accumulated failure counts.  
**Idempotency / Concurrency:** Rate-limit identity must prevent parallel-send bypass. No business-account activation occurs here.  
**Data Touched:** OTP challenge metadata, candidate contact identity, audit/rate-limit state.  
**Tests:** Required coverage includes send limit, expiry metadata, no OTP leakage, and resend invalidation.

### API-IDENTITY-002 — Verify Patient OTP and Activate Identity

**Requirements:** FR-IDENTITY-002, NFR-IDENTITY-002, NFR-AUDIT-002  
**Status:** **Proposed**  
**Method / Path:** `POST /api/v1/auth/patient/otp/verify`  
**Actor / Auth:** Public challenge holder.  
**Request:** `challenge_id: string` required; `code: string` exactly six digits; optional idempotency key required when account activation may occur.  
**Response:** `200` with authenticated identity/session bootstrap data; exact transport token/session shape remains implementation-specific.  
**Errors:** `ERR-PLATFORM-001`, `ERR-IDENTITY-004`, `ERR-AUDIT-001`, `ERR-PLATFORM-004`.  
**Business Rules:** A patient account cannot become active until verification succeeds; repeated activation for the same verified identity must not create duplicate active patient identities.  
**Side Effects:** Marks challenge consumed; activates or links patient identity; audits the event.  
**Idempotency / Concurrency:** Concurrent successful verification attempts produce at most one active identity outcome.  
**Data Touched:** Patient identity, contact verification, OTP challenge, audit/idempotency record.  
**Tests:** Required coverage includes valid/expired/used/wrong OTP, attempt boundary, duplicate activation, and concurrent verification.

### API-IDENTITY-003 — Get Current Patient Identity

**Requirements:** FR-IDENTITY-002, NFR-IDENTITY-001  
**Status:** **Proposed**  
**Method / Path:** `GET /api/v1/me`  
**Actor / Auth:** Authenticated patient/guardian identity.  
**Request:** None.  
**Response:** `200` with safe identity/profile fields and active representation context if one is explicitly selected; sensitive authorization internals are not exposed.  
**Errors:** `ERR-IDENTITY-001`, `ERR-PLATFORM-004`.  
**Side Effects:** None except ordinary access audit where policy requires it.  
**Idempotency / Concurrency:** Read-only.  
**Data Touched:** Identity and active grants.  
**Tests:** Required authorization and scope coverage.

### API-IDENTITY-004 — Create Guardian/Family Grant

**Requirements:** FR-IDENTITY-003, NFR-IDENTITY-001, NFR-AUDIT-001  
**Status:** **Proposed**  
**Method / Path:** `POST /api/v1/guardian-grants`  
**Actor / Auth:** Authenticated authorized grantor or authorized legal-basis workflow.  
**Request:** `subject_patient_id: string`, `grantee_identity_id: string`, `actions: string[]`, `data_scope: string[]`, `purpose: string`, `effective_from: datetime`, `effective_until: datetime|null`, `legal_or_grant_basis: string`.  
**Response:** `201` with the created grant and explicit effective status.  
**Errors:** `ERR-PLATFORM-001`, `ERR-IDENTITY-001`, `ERR-IDENTITY-002`, `ERR-AUDIT-001`.  
**Side Effects:** Creates an auditable scoped grant.  
**Idempotency / Concurrency:** Required to prevent duplicate equivalent grants.  
**Data Touched:** Guardian/family grant, patient/grantee identities, audit/idempotency.  
**Tests:** Required coverage includes grant scope, invalid relationship/basis, duplicate, and authorization cases.

### API-IDENTITY-005 — Revoke Guardian/Family Grant

**Requirements:** FR-IDENTITY-003, NFR-IDENTITY-001, NFR-AUDIT-001  
**Status:** **Proposed**  
**Method / Path:** `DELETE /api/v1/guardian-grants/{grant}`  
**Actor / Auth:** Authenticated authorized grantor/administrator according to governing policy.  
**Request:** Optional required-by-policy `reason: string`.  
**Response:** `204`.  
**Errors:** `ERR-IDENTITY-001`, `ERR-IDENTITY-002`, `ERR-PLATFORM-002`, `ERR-BOOKING-002` only if policy forbids revocation in a specific protected transition; otherwise revocation is immediate.  
**Side Effects:** Ends authorization immediately while retaining historical grant/audit records.  
**Idempotency / Concurrency:** Repeated revocation is safe and creates no duplicate effect.  
**Data Touched:** Grant lifecycle/audit.  
**Tests:** Required coverage includes immediate denial after revocation and repeated-action safety.

## 6. Eligibility and Provider Discovery

### API-ELIG-001 — Search Currently Eligible Providers

**Requirements:** FR-ELIG-001, FR-ELIG-005, FR-ELIG-006, NFR-PLATFORM-001  
**Status:** **Proposed**  
**Method / Path:** `GET /api/v1/providers`  
**Actor / Auth:** Public or authenticated patient; private fields never vary into public exposure.  
**Query:** `service_code: string` required; `area: string|null`; appointment availability/date filters as supported by implemented booking availability.  
**Response:** `200` collection of provider-service-branch decision cards with stable provider/branch IDs, practical eligibility state, expected/actual price presentation, funded-protection availability, verified-experience rating where available, branch/location summary, nearest available appointment where available, and assessment timestamp.  
**Errors:** `ERR-PLATFORM-001`, `ERR-PLATFORM-003`, `ERR-PLATFORM-004`.  
**Business Rules:** Return only currently passing provider-service-branch combinations. Do not expose raw `I`; do not present `P` as a scientific grade.  
**Side Effects:** None.  
**Idempotency / Concurrency:** Read-only; booking must revalidate rather than trust this result.  
**Data Touched:** Catalog, provider/branch facts, current eligibility decision, price, verified-review aggregate, appointment availability.  
**Tests:** Required coverage includes search filtering, exclusion of failing gates, privacy fields, and p95 provider-search verification.

### API-ELIG-002 — Get Provider Eligibility Explanation

**Requirements:** FR-ELIG-016, FR-ELIG-017  
**Status:** **Proposed**  
**Method / Path:** `GET /api/v1/providers/{provider}/services/{service}/branches/{branch}/eligibility`  
**Actor / Auth:** Public/patient-safe explanation.  
**Request:** Path IDs only.  
**Response:** `200` with exact service/branch, practical eligibility state, last assessment time, patient-safe reason summary, and pending blockers when applicable. Raw `I`, protected evidence, and reviewer-only detail are excluded.  
**Errors:** `ERR-PLATFORM-002`, `ERR-ELIG-002`, `ERR-PLATFORM-004`.  
**Side Effects:** None.  
**Idempotency / Concurrency:** Read-only.  
**Data Touched:** Current eligibility snapshot and safe reason projection.  
**Tests:** Required coverage includes pending-vs-F, confidential-field exclusion, and exact-scope cases.

### API-ELIG-003 — Submit Service Activation Request

**Requirements:** FR-ELIG-007, FR-ELIG-008, NFR-PLATFORM-003, NFR-AUDIT-002  
**Status:** **Proposed**  
**Method / Path:** `POST /api/v1/provider/service-activation-requests`  
**Actor / Auth:** Authenticated dentist/provider identity. If the doctor experience is Filament-only at implementation time, this use case is invoked in-process and this external endpoint may be omitted.  
**Request:** `service_code: string`, `branch_id: string`, `service_definition_version: integer`, `answers: object`, `evidence_ids: string[]`; no field may accept final A/B/C/D/F/P/H/I outcomes.  
**Response:** `201` with request ID, state, missing/invalid evidence summary, and evaluation status.  
**Errors:** `ERR-PLATFORM-001`, `ERR-IDENTITY-001`, `ERR-IDENTITY-002`, `ERR-ELIG-002`, `ERR-AUDIT-001`.  
**Side Effects:** Creates source-fact/evidence request and queues governed verification/evaluation work as appropriate.  
**Idempotency / Concurrency:** Required. Identical retry returns original request; different payload on same key is rejected.  
**Data Touched:** Activation request, questionnaire facts, evidence references, service definition, audit/idempotency.  
**Tests:** Required coverage includes no manual-outcome field, missing evidence, duplicate submission, and scope enforcement.

### API-ELIG-004 — Get Service Activation Request

**Requirements:** FR-ELIG-007, FR-ELIG-008  
**Status:** **Proposed**  
**Method / Path:** `GET /api/v1/provider/service-activation-requests/{request}`  
**Actor / Auth:** Authenticated scoped dentist/provider representative.  
**Response:** `200` with request state, source-fact/evidence status, blockers, latest evaluation state, and patient-invisible internal details only if the actor is authorized for them.  
**Errors:** `ERR-IDENTITY-001`, `ERR-IDENTITY-002`, `ERR-PLATFORM-002`.  
**Side Effects:** None.  
**Idempotency / Concurrency:** Read-only.  
**Data Touched:** Activation request, evidence status, current decision summary.  
**Tests:** Required ownership/scope and blocker-state coverage.

## 7. Booking

### API-BOOKING-001 — Create Booking Request

**Requirements:** FR-BOOKING-001, FR-ELIG-006, NFR-AUDIT-002  
**Status:** **Proposed**  
**Method / Path:** `POST /api/v1/bookings`  
**Actor / Auth:** Authenticated patient or authorized guardian acting in explicit scope.  
**Request:** `patient_id: string` only when acting under an authorized grant, otherwise implicit current patient; `provider_id: string`, `branch_id: string`, `service_code: string`, `slot_id: string`; idempotency key required.  
**Response:** `201` with booking ID, state, requested slot, eligibility assessment timestamp, response deadline metadata, and next permitted actions.  
**Errors:** `ERR-PLATFORM-001`, `ERR-IDENTITY-001`, `ERR-IDENTITY-002`, `ERR-ELIG-001`, `ERR-ELIG-002`, `ERR-BOOKING-001`, `ERR-AUDIT-001`.  
**Business Rules:** Revalidate service publication, provider/service/branch eligibility, branch readiness, and slot capacity during the transaction.  
**Side Effects:** Creates booking request, audit entry, provider work/notification after commit.  
**Idempotency / Concurrency:** Mandatory. Capacity protection must prevent overbooking under concurrent requests.  
**Data Touched:** Booking, slot/capacity, eligibility snapshot reference, case/actor identity, audit/idempotency.  
**Tests:** Required coverage includes happy path, ineligible provider, full slot, duplicate key, conflicting payload, and the 100-concurrent-attempt capacity case.

### API-BOOKING-002 — List My Bookings

**Requirements:** FR-BOOKING-001–003, FR-CLINICAL-005  
**Status:** **Proposed**  
**Method / Path:** `GET /api/v1/bookings`  
**Actor / Auth:** Authenticated patient/guardian in authorized scope.  
**Query:** Optional state/date filters; pagination only if/when required by implementation volume.  
**Response:** `200` collection of booking summaries with stable state, provider/service/branch summary, times, deadlines, and next permitted action metadata.  
**Errors:** `ERR-IDENTITY-001`, `ERR-IDENTITY-002`.  
**Side Effects:** None.  
**Idempotency / Concurrency:** Read-only.  
**Data Touched:** Scoped bookings and safe projections.  
**Tests:** Required owner/guardian isolation and state-filter coverage.

### API-BOOKING-003 — Get Booking

**Requirements:** FR-BOOKING-001–003  
**Status:** **Proposed**  
**Method / Path:** `GET /api/v1/bookings/{booking}`  
**Actor / Auth:** Authenticated case party/guardian within scope.  
**Response:** `200` with booking details, state, provider response or alternative proposal if present, relevant deadlines, cancellation/no-show history summary, and allowed next actions.  
**Errors:** `ERR-IDENTITY-001`, `ERR-IDENTITY-002`, `ERR-PLATFORM-002`.  
**Side Effects:** None.  
**Idempotency / Concurrency:** Read-only.  
**Data Touched:** Booking lifecycle and scoped case data.  
**Tests:** Required scope and state-projection coverage.

### API-BOOKING-004 — Accept Provider Alternative

**Requirements:** FR-BOOKING-003, NFR-AUDIT-002  
**Status:** **Proposed**  
**Method / Path:** `POST /api/v1/bookings/{booking}/alternative-acceptance`  
**Actor / Auth:** Authenticated booking patient/authorized guardian.  
**Request:** `proposal_id: string`; idempotency key required.  
**Response:** `200` with resulting booking state and confirmed/proposed slot metadata.  
**Errors:** `ERR-IDENTITY-001`, `ERR-IDENTITY-002`, `ERR-PLATFORM-002`, `ERR-BOOKING-001`, `ERR-BOOKING-002`, `ERR-BOOKING-003`, `ERR-ELIG-001`, `ERR-AUDIT-001`.  
**Business Rules:** Revalidate deadline, slot capacity, and current eligibility before confirmation. An expired or otherwise non-actionable alternative must be rejected; the canonical resulting booking state after alternative expiry or explicit patient decline remains unresolved under `Q-BOOKING-001` and must not be inferred by this API or its clients.  
**Side Effects:** Confirms accepted alternative when valid; releases superseded provisional capacity if modeled; queues notifications.  
**Idempotency / Concurrency:** Mandatory; one committed acceptance outcome.  
**Data Touched:** Booking/proposal, slot capacity, eligibility, audit/idempotency.  
**Tests:** Required coverage includes expired proposal rejection without inventing a terminal state, full alternative slot, revalidation failure, and repeated acceptance.

### API-BOOKING-005 — Cancel Booking

**Requirements:** FR-BOOKING-002, NFR-AUDIT-002  
**Status:** **Proposed**  
**Method / Path:** `POST /api/v1/bookings/{booking}/cancel`  
**Actor / Auth:** Authenticated actor authorized by booking state/policy.  
**Request:** `reason: string`; idempotency key required.  
**Response:** `200` with resulting state and policy-derived downstream consequence summary.  
**Errors:** `ERR-IDENTITY-001`, `ERR-IDENTITY-002`, `ERR-PLATFORM-002`, `ERR-BOOKING-002`, `ERR-AUDIT-001`.  
**Side Effects:** Audited cancellation transition, capacity release, operational/review/financial consequence records where required; never moves money.  
**Idempotency / Concurrency:** Mandatory; repeated cancellation does not create duplicate consequences.  
**Data Touched:** Booking lifecycle, capacity, policy snapshot reference, audit/derived work.  
**Tests:** Required coverage includes allowed/forbidden states, deadline boundary, duplicate request, and no-money-movement assertion.

Provider accept/reject/alternative response is a confirmed use case under FR-BOOKING-003. Because the current product architecture assigns doctor/clinic operations to Filament, no external REST contract is mandated here; Filament should call the shared application action directly. If a non-Filament provider client is later approved, allocate a separate `API-BOOKING-*` contract rather than exposing an internal route implicitly.

`Q-BOOKING-002` also remains authoritative for the unresolved review workflow applied to existing bookings when a previously eligible provider/service/branch becomes suspended. Booking read contracts must expose the current authoritative state; they must not manufacture automatic cancellation, confirmation, or another outcome while that workflow remains unresolved.

## 8. Clinical Case

### API-CLINICAL-001 — Get Case Summary

**Requirements:** FR-CLINICAL-001–005  
**Status:** **Proposed**  
**Method / Path:** `GET /api/v1/cases/{case}`  
**Actor / Auth:** Authenticated authorized case party/guardian.  
**Response:** `200` with safe case status, service/provider/branch summary, current accepted-plan version if any, next follow-up, missing patient-action items, and links/IDs for authorized subresources.  
**Errors:** `ERR-IDENTITY-001`, `ERR-IDENTITY-002`, `ERR-PLATFORM-002`.  
**Side Effects:** None except access audit where required.  
**Idempotency / Concurrency:** Read-only.  
**Data Touched:** Case/booking/current accepted clinical snapshot/read projection.  
**Tests:** Required scope and sensitive-field filtering coverage.

### API-CLINICAL-002 — Get Proposed/Accepted Treatment Plan

**Requirements:** FR-CLINICAL-001, FR-CLINICAL-002, FR-FINANCE-001  
**Status:** **Proposed**  
**Method / Path:** `GET /api/v1/cases/{case}/treatment-plan`  
**Actor / Auth:** Authenticated authorized case party.  
**Response:** `200` with clinician-authored plan version, service, stages, stage prices, currency, inclusions/exclusions, applicable terms, protection state, and whether the version is proposed or accepted. It must identify the clinician as author and must not imply platform diagnosis.  
**Errors:** `ERR-IDENTITY-001`, `ERR-IDENTITY-002`, `ERR-PLATFORM-002`.  
**Side Effects:** None.  
**Idempotency / Concurrency:** Read-only.  
**Data Touched:** Treatment plan/version and linked financial-term proposal/snapshot.  
**Tests:** Required authorship, immutable accepted-version projection, and scope coverage.

### API-CLINICAL-003 — Accept Treatment Plan

**Requirements:** FR-CLINICAL-002, FR-FINANCE-001, NFR-AUDIT-003  
**Status:** **Proposed**  
**Method / Path:** `POST /api/v1/cases/{case}/treatment-plan/accept`  
**Actor / Auth:** Authenticated patient/authorized guardian with acceptance authority.  
**Request:** `plan_version_id: string`; explicit acceptance acknowledgment/version if required by policy; idempotency key required.  
**Response:** `200` with immutable accepted plan/financial snapshot IDs and acceptance timestamp.  
**Errors:** `ERR-IDENTITY-001`, `ERR-IDENTITY-002`, `ERR-PLATFORM-002`, `ERR-CLINICAL-001`, `ERR-AUDIT-001`.  
**Business Rules:** Missing required service/stage/price/policy information blocks acceptance. Future changes create new versions and do not mutate the accepted snapshot.  
**Side Effects:** Creates immutable accepted treatment and financial terms snapshots atomically and audits acceptance.  
**Idempotency / Concurrency:** Mandatory; concurrent acceptance cannot create multiple accepted outcomes for the same plan version.  
**Data Touched:** Treatment plan version, accepted clinical snapshot, FinancialTermsSnapshot, audit/idempotency.  
**Tests:** Required coverage includes incomplete plan, stale version, duplicate acceptance, and immutability.

### API-CLINICAL-004 — Get Unified Case Timeline

**Requirements:** FR-CLINICAL-005, FR-FINANCE-006, FR-AUDIT-002  
**Status:** **Proposed**  
**Method / Path:** `GET /api/v1/cases/{case}/timeline`  
**Actor / Auth:** Authenticated authorized case party; fields filtered by role/scope.  
**Response:** `200` ordered timeline events with event type, occurred/recorded time, actor-safe attribution, state/result summary, source domain, and links to authorized details. Corrections/reversals appear as later events.  
**Errors:** `ERR-IDENTITY-001`, `ERR-IDENTITY-002`, `ERR-PLATFORM-002`.  
**Side Effects:** None.  
**Idempotency / Concurrency:** Read-only projection.  
**Data Touched:** Booking, accepted terms, treatment stages, follow-ups, reviews, claims/issues, external financial-event projections.  
**Tests:** Required ordering, role filtering, and correction-history coverage.

Clinician plan authoring, treatment-stage completion, and staff follow-up administration are currently expected to be Filament/in-process workflows. They must share the same application/domain rules and do not require artificial internal REST endpoints.

## 9. External Financial Records

All contracts in this section are record-only. No request or response represents UberTib as authorizing, capturing, holding, transferring, settling, or refunding money.

### API-FINANCE-001 — Get Accepted Financial Terms

**Requirements:** FR-FINANCE-001, FR-CLINICAL-002, NFR-AUDIT-003  
**Status:** **Proposed**  
**Method / Path:** `GET /api/v1/cases/{case}/financial-terms`  
**Actor / Auth:** Authenticated authorized case party.  
**Response:** `200` with immutable accepted snapshot version, service/stages, amounts/currency, due structure, cancellation/refund terms, protection terms/state, and governing policy versions.  
**Errors:** `ERR-IDENTITY-001`, `ERR-IDENTITY-002`, `ERR-PLATFORM-002`.  
**Side Effects:** None.  
**Idempotency / Concurrency:** Read-only.  
**Data Touched:** FinancialTermsSnapshot.  
**Tests:** Required immutable historical-version and access coverage.

### API-FINANCE-002 — Report External Payment

**Requirements:** FR-FINANCE-002, FR-FINANCE-005, NFR-FINANCE-001, NFR-AUDIT-002  
**Status:** **Proposed**  
**Method / Path:** `POST /api/v1/cases/{case}/financial-events/payments`  
**Actor / Auth:** Authenticated authorized case party.  
**Request:** `financial_terms_snapshot_id: string`, `amount: decimal`, `currency: string`, `external_method_category: string`, `occurred_at: datetime`, `evidence_ids: string[]|null`; payer identity is derived from authenticated context; idempotency key required.  
**Response:** `201` with event ID and `status: "reported_unconfirmed"` or equivalent canonical state from `STATE_MACHINES.md`.  
**Errors:** `ERR-PLATFORM-001`, `ERR-IDENTITY-001`, `ERR-IDENTITY-002`, `ERR-FINANCE-001`, `ERR-AUDIT-001`.  
**Side Effects:** Appends a financial assertion event and notifies/queues counterparty review; does not move money.  
**Idempotency / Concurrency:** Mandatory; exactly one event per identical idempotent command.  
**Data Touched:** FinancialTermsSnapshot, append-only financial event, evidence references, audit/idempotency.  
**Tests:** Required coverage includes valid report, wrong snapshot/currency, duplicate, conflicting key, and an architecture assertion that no money-movement integration is called.

### API-FINANCE-003 — Confirm or Dispute External Financial Event

**Requirements:** FR-FINANCE-003, FR-FINANCE-005, NFR-AUDIT-003  
**Status:** **Proposed**  
**Method / Path:** `POST /api/v1/financial-events/{event}/response`  
**Actor / Auth:** Authenticated authorized counterparty; scoped finance reviewer only where policy explicitly allows.  
**Request:** `decision: "confirm" | "dispute"`, `reason: string|null` required for dispute, `evidence_ids: string[]|null`; idempotency key required.  
**Response:** `200` with original event ID plus newly appended response event and derived status.  
**Errors:** `ERR-PLATFORM-001`, `ERR-IDENTITY-001`, `ERR-IDENTITY-002`, `ERR-PLATFORM-002`, `ERR-FINANCE-001`, `ERR-AUDIT-001`.  
**Side Effects:** Appends confirmation/dispute event; never edits original assertion.  
**Idempotency / Concurrency:** Mandatory; concurrent contradictory responses follow state/policy rules and cannot rewrite history.  
**Data Touched:** Append-only financial event stream, audit/idempotency.  
**Tests:** Required confirm/dispute branch, authorization, duplicate, and history-immutability coverage.

### API-FINANCE-004 — Report External Refund Execution

**Requirements:** FR-FINANCE-004, FR-FINANCE-005, NFR-FINANCE-001  
**Status:** **Proposed**  
**Method / Path:** `POST /api/v1/cases/{case}/financial-events/refund-executions`  
**Actor / Auth:** Authenticated party authorized to assert external execution.  
**Request:** `approved_refund_decision_id: string`, `amount: decimal`, `currency: string`, `occurred_at: datetime`, `evidence_ids: string[]`; idempotency key required.  
**Response:** `201` with unconfirmed external execution event.  
**Errors:** `ERR-PLATFORM-001`, `ERR-IDENTITY-001`, `ERR-IDENTITY-002`, `ERR-FINANCE-001`, `ERR-AUDIT-001`.  
**Side Effects:** Appends execution assertion; routes counterparty confirmation/dispute. No platform refund is executed.  
**Idempotency / Concurrency:** Mandatory.  
**Data Touched:** Approved refund decision, financial event stream, evidence, audit/idempotency.  
**Tests:** Required approved-decision, amount-mismatch, duplicate, and no-money-movement coverage.

### API-FINANCE-005 — Get Case Financial Timeline

**Requirements:** FR-FINANCE-006, FR-FINANCE-007  
**Status:** **Proposed**  
**Method / Path:** `GET /api/v1/cases/{case}/financial-timeline`  
**Actor / Auth:** Authenticated authorized case party; role/scope field filtering required.  
**Response:** `200` ordered financial events plus derived amounts/statuses distinguishing agreed, reported, confirmed, disputed, refunded, and pending-external-execution values.  
**Errors:** `ERR-IDENTITY-001`, `ERR-IDENTITY-002`, `ERR-PLATFORM-002`.  
**Business Rules:** Every displayed amount derives from immutable terms and append-only events; wording must not imply platform custody or settlement.  
**Side Effects:** None.  
**Idempotency / Concurrency:** Read-only projection.  
**Data Touched:** FinancialTermsSnapshot and financial event stream.  
**Tests:** Required event-order derivation, disputed-vs-confirmed distinction, access, and wording-boundary coverage.

## 10. Reviews

### API-REVIEWS-001 — Submit Verified Review

**Requirements:** FR-REVIEWS-001, NFR-AUDIT-002  
**Status:** **Proposed**  
**Method / Path:** `POST /api/v1/cases/{case}/review`  
**Actor / Auth:** Authenticated patient linked to the verified completed experience or authorized guardian grant.  
**Request:** Review rating/content fields defined by product policy; idempotency key required.  
**Response:** `201` with review ID, verified-experience linkage, and publication/moderation state.  
**Errors:** `ERR-PLATFORM-001`, `ERR-IDENTITY-001`, `ERR-IDENTITY-002`, `ERR-REVIEWS-001`, `ERR-AUDIT-001`.  
**Business Rules:** One active review per eligible completed experience; `R` remains separate from S/P/H/I.  
**Side Effects:** Creates verified review and may update derived review aggregate asynchronously/transactionally as designed.  
**Idempotency / Concurrency:** Mandatory; uniqueness constraint/application rule prevents duplicate active review.  
**Data Touched:** Completed case/experience, review, audit/idempotency.  
**Tests:** Required eligible/ineligible, duplicate, guardian authorization, and R-separation coverage.

### API-REVIEWS-002 — Appeal Review Decision

**Requirements:** FR-REVIEWS-002  
**Status:** **Proposed**  
**Method / Path:** `POST /api/v1/reviews/{review}/appeals`  
**Actor / Auth:** Authenticated actor allowed by review-appeal policy.  
**Request:** `grounds: string`, `evidence_ids: string[]|null`; idempotency key required.  
**Response:** `201` with appeal ID/state and deadline metadata.  
**Errors:** `ERR-PLATFORM-001`, `ERR-IDENTITY-001`, `ERR-IDENTITY-002`, `ERR-REVIEWS-001`, `ERR-AUDIT-001`.  
**Side Effects:** Creates appeal/work item; does not directly rewrite the original review or scientific classification.  
**Idempotency / Concurrency:** Mandatory.  
**Data Touched:** Review, appeal, evidence refs, work queue, audit/idempotency.  
**Tests:** Required eligibility/window, duplicate, and no-direct-rewrite coverage.

## 11. Claims and Refund Requests

### API-CLAIMS-001 — Submit Refund Request

**Requirements:** FR-CLAIMS-001, FR-FINANCE-007, NFR-AUDIT-002  
**Status:** **Proposed**  
**Method / Path:** `POST /api/v1/cases/{case}/refund-requests`  
**Actor / Auth:** Authenticated authorized case party.  
**Request:** `requested_amount: decimal`, `currency: string`, `reason: string`, `occurrence_context: string|null`, `evidence_ids: string[]`; idempotency key required.  
**Response:** `201` with request/claim ID, initial state, governing terms/policy snapshot IDs, and response deadline metadata.  
**Errors:** `ERR-PLATFORM-001`, `ERR-IDENTITY-001`, `ERR-IDENTITY-002`, `ERR-CLAIMS-001`, `ERR-CLAIMS-002`, `ERR-AUDIT-001`.  
**Business Rules:** Validate against accepted FinancialTermsSnapshot and deadline policy. Approval can create an externally executable amount due but cannot move money.  
**Side Effects:** Creates reviewable refund case and operational work item.  
**Idempotency / Concurrency:** Mandatory.  
**Data Touched:** Case, accepted terms snapshot, refund request/claim, evidence refs, work queue, audit/idempotency.  
**Tests:** Required valid/late request, currency/amount mismatch, duplicate, evidence-rule, and zero-money-movement coverage.

### API-CLAIMS-002 — Submit Protection Claim

**Requirements:** FR-CLAIMS-002, FR-ELIG-010, NFR-FINANCE-001  
**Status:** **Proposed**  
**Method / Path:** `POST /api/v1/cases/{case}/protection-claims`  
**Actor / Auth:** Authenticated eligible case party.  
**Request:** `claim_type: string`, `requested_remedy: string`, `narrative: string`, `evidence_ids: string[]`; idempotency key required.  
**Response:** `201` with claim ID, state, governing protection/policy snapshot reference, evidence status, and deadlines.  
**Errors:** `ERR-PLATFORM-001`, `ERR-IDENTITY-001`, `ERR-IDENTITY-002`, `ERR-CLAIMS-001`, `ERR-CLAIMS-002`, `ERR-AUDIT-001`.  
**Business Rules:** Submission is allowed only when the immutable accepted terms contain applicable active protection. It never promises or executes a monetary outcome.  
**Side Effects:** Creates claim/work item and evidence-deadline workflow.  
**Idempotency / Concurrency:** Mandatory.  
**Data Touched:** Case, accepted protection snapshot, claim, evidence refs, work queue, audit/idempotency.  
**Tests:** Required no-protection denial, evidence validation, duplicate, and wording/no-money-movement coverage.

### API-CLAIMS-003 — List Case Claims/Refund Requests

**Requirements:** FR-CLAIMS-001–005, FR-CLINICAL-005  
**Status:** **Proposed**  
**Method / Path:** `GET /api/v1/cases/{case}/claims`  
**Actor / Auth:** Authenticated authorized case party.  
**Response:** `200` collection of scoped claim/refund summaries, states, deadlines, missing evidence counts, decision status, appeal eligibility, and external-execution status where applicable.  
**Errors:** `ERR-IDENTITY-001`, `ERR-IDENTITY-002`, `ERR-PLATFORM-002`.  
**Side Effects:** None.  
**Idempotency / Concurrency:** Read-only.  
**Data Touched:** Claims/refund requests and safe derived state.  
**Tests:** Required scope and state/deadline projection coverage.

### API-CLAIMS-004 — Get Claim/Refund Request Detail

**Requirements:** FR-CLAIMS-001–005  
**Status:** **Proposed**  
**Method / Path:** `GET /api/v1/claims/{claim}`  
**Actor / Auth:** Authenticated authorized case party.  
**Response:** `200` with claim/refund type, narrative, requested remedy/amount where applicable, evidence states, deadlines and extensions, reasoned decision when visible, appeal status, and external-action status. Sensitive reviewer-only findings remain filtered.  
**Errors:** `ERR-IDENTITY-001`, `ERR-IDENTITY-002`, `ERR-PLATFORM-002`.  
**Side Effects:** None.  
**Idempotency / Concurrency:** Read-only.  
**Data Touched:** Claim/refund workflow, evidence metadata, decision/appeal projection.  
**Tests:** Required role-filtering and deadline/history coverage.

### API-CLAIMS-005 — Appeal Claim/Dispute Decision

**Requirements:** FR-CLAIMS-005, FR-CLAIMS-004  
**Status:** **Proposed**  
**Method / Path:** `POST /api/v1/claims/{claim}/appeals`  
**Actor / Auth:** Authenticated authorized case party.  
**Request:** `grounds: string`, `evidence_ids: string[]|null`; idempotency key required.  
**Response:** `201` with appeal ID/state, governing original decision/policy snapshot, assigned review scope (without exposing unnecessary reviewer identity), and deadline metadata.  
**Errors:** `ERR-PLATFORM-001`, `ERR-IDENTITY-001`, `ERR-IDENTITY-002`, `ERR-PLATFORM-002`, `ERR-CLAIMS-001`, `ERR-CLAIMS-002`, `ERR-AUDIT-001`.  
**Business Rules:** Use the policy snapshot governing the original decision. Separation of duties applies to reviewer assignment. Original decision remains immutable.  
**Side Effects:** Creates appeal and review work item.  
**Idempotency / Concurrency:** Mandatory.  
**Data Touched:** Original decision, appeal, evidence refs, work queue, audit/idempotency.  
**Tests:** Required appeal-window boundary, separation-of-duties, duplicate, and original-decision immutability coverage.

## 12. Evidence Transfer Contract — Blocked Detail

The product requires private clinical, credential, claim, identity, and financial evidence. However the exact binary-transfer mechanism must support weak connectivity, quarantine, malware scanning, size/type limits, SHA-256 integrity, fresh authorization, and provider-neutral storage while concrete storage/scanning providers remain unresolved under `Q-PLATFORM-003` and infrastructure placement remains governed by `Q-OPS-001`.

Therefore this document does **not** invent a presigned-upload, multipart-upload, chunking, or resumable-upload endpoint. Proposed domain write contracts use `evidence_ids` only after an evidence record has been safely created through the eventual private-evidence transfer contract. That contract must be allocated as `API-PLATFORM-*` only after the transfer strategy is approved. This prevents a speculative provider-specific API from becoming an accidental product contract.

## 13. Operations, Policy, Audit, and Provider Workflows

Confirmed staff workflows under OPS, POLICY, AUDIT, provider booking response, clinician plan authoring, treatment-stage completion, verification, launch approval, financial review, and sensitive claim decisions are expected to run through Filament calling shared Laravel application actions in-process.

No internal REST endpoints are created merely to make Filament behave like an external client. If a future external staff/doctor client is approved, its routes must receive new `API-*` IDs and explicit auth/contract documentation rather than reusing hidden/internal endpoints.

## 14. Versioning and Compatibility

- `/api/v1` is the verified current version prefix.
- Additive optional response fields may be introduced only when clients tolerate them and the contract remains backward compatible.
- Removing/renaming fields, changing semantics, making optional fields required, narrowing accepted values, or changing state meaning requires an explicit migration window or a new API version.
- State values exposed by APIs must come from canonical state-machine definitions, not UI labels.
- User-facing Arabic text may evolve, but stable machine-readable codes/IDs must not silently change meaning.

## 15. Security and Privacy Rules

All authenticated contracts must enforce authorization server-side regardless of client visibility. Cross-scope identifiers must not leak protected-resource existence when policy requires not-found behavior. Private evidence is never returned as raw storage paths. Short-lived download authorization belongs to the future evidence contract, not general resource payloads.

Sensitive API logs must omit OTPs, credentials, signed links, protected clinical payloads, private filenames, and unnecessary financial/identity details. Correlation IDs and safe audit metadata remain available for operational tracing.

## 16. Idempotency Rules

Every contract marked **idempotency key required** follows FR-AUDIT-003 and NFR-AUDIT-002:

1. key scope includes authenticated actor, operation, and relevant resource scope;
2. same key + materially identical request returns the original committed result;
3. same key + materially different request returns `ERR-AUDIT-001` with no side effect;
4. concurrent duplicates produce at most one committed business outcome;
5. the idempotency record must not expose protected request payloads unnecessarily.

The exact HTTP header name is intentionally not fixed by current source material; implementation may standardize one before the first proposed mutation API is released.

## 17. API Coverage Summary

| Domain | Implemented | Proposed | Main requirement coverage |
|---|---:|---:|---|
| CATALOG | 1 | 0 | FR-CATALOG-001, FR-OPS-003 |
| IDENTITY | 0 | 5 | FR-IDENTITY-002–003, NFR-IDENTITY-001–002 |
| ELIG | 0 | 4 | FR-ELIG-001, 007–008, 016–017 and dependent eligibility rules |
| BOOKING | 0 | 5 | FR-BOOKING-001–003 |
| CLINICAL | 0 | 4 | FR-CLINICAL-001–005 |
| FINANCE | 0 | 5 | FR-FINANCE-001–007 |
| REVIEWS | 0 | 2 | FR-REVIEWS-001–002 |
| CLAIMS | 0 | 5 | FR-CLAIMS-001–005 |
| PLATFORM evidence transfer | 0 | Blocked | NFR-PLATFORM-003, NFR-PLATFORM-006 |

Total defined contracts: **31** (`1 Implemented`, `30 Proposed`). Staff-only/in-process Filament use cases are intentionally not counted as REST contracts.

## 18. Registry Allocation Status

The following API ranges are synchronized in the canonical `docs/README.md` registry. Allocations are append-only; future additions must update the registry without renumbering or repurposing existing IDs:

- `API-CATALOG-001`
- `API-IDENTITY-001`–`API-IDENTITY-005`
- `API-ELIG-001`–`API-ELIG-004`
- `API-BOOKING-001`–`API-BOOKING-005`
- `API-CLINICAL-001`–`API-CLINICAL-004`
- `API-FINANCE-001`–`API-FINANCE-005`
- `API-REVIEWS-001`–`API-REVIEWS-002`
- `API-CLAIMS-001`–`API-CLAIMS-005`

The `ERR-*` references listed in Section 3 are defined by the current `docs/api/ERROR_CATALOG.md` and synchronized in the registry. No `API-PLATFORM-*` is allocated until the private-evidence transfer strategy is approved.