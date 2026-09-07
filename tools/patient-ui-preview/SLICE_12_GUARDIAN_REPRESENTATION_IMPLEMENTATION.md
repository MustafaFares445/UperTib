# Slice 12 — Guardian and Representation

Status: implemented in the Patient UI Preview; final PR verification pending.

## Canonical derivation

Slice 12 is the `guardian/representation` item that follows claims in `tools/patient-ui-preview/README.md`. Its Patient scope is derived from the canonical Patient screen specs, `USER_FLOWS.md`, `WIDGET_SPECS_DOMAIN.md`, the identity API contracts and the representation rules already fixed by the UX handoffs.

Implemented surfaces:

- `SCR-IDENTITY-005` — Family and representation
- `SCR-IDENTITY-006` — Create grant
- `SCR-IDENTITY-007` — Grant detail
- `SCR-IDENTITY-008` — Active patient context
- `SCR-IDENTITY-037` — Add dependent
- `WGT-IDENTITY-002` — Authorization grant panel, Patient/family variant
- `FLOW-IDENTITY-002` — Create a representation grant
- `FLOW-IDENTITY-003` — Act as a represented patient
- `FLOW-IDENTITY-004` — Revoke a representation grant
- Patient side of `FLOW-IDENTITY-021` — Establish representation on a legal basis

The Admin decision screen and operational review work for `FLOW-IDENTITY-021` remain outside this Patient preview.

## Consent path and legal-basis path stay different

The implementation deliberately prevents the two representation paths from collapsing into the same mental model.

### Adult consent

`SCR-IDENTITY-006` is the path where the Patient grants another person a scope over the Patient's own record. Before the commit, the UI shows:

- subject Patient;
- grantee;
- permitted actions;
- data scope;
- purpose;
- effective period;
- consent/grant basis.

No scope dimension defaults to “all”. Open-ended duration must be chosen explicitly rather than becoming a silent default. A complete scope is rendered in the reading column before the create action.

### Dependent / legal-basis request

`SCR-IDENTITY-037` never reads as self-service authorization. The guardian supplies dependent identity facts, relationship, legal basis, requested actions, requested data scope, purpose and requirement-bound evidence. Submission creates a `SUBMITTED` verification request only.

Only a later accountable human approval can create a legal-basis grant. The submitted Patient projection therefore says explicitly that no grant exists yet. `CHANGES_REQUESTED`, `APPROVED` and `REJECTED` are separately readable historical/request states.

The Family screen does not invent an “Add dependent” dominant action that its canonical action table does not define. The legal-basis surface is implemented as its own governed flow and can be connected from the remaining Profile/account navigation slice when that route is canonically composed.

## Two directions on Family and representation

`SCR-IDENTITY-005` renders separate regions for:

1. permissions the Patient granted to others;
2. permissions the signed-in person holds to represent other Patients;
3. expired and revoked history.

The direction label is present on every grant card. Expired/revoked grants remain full-content history rather than disappearing. A grant whose scope cannot be read is shown as scope-unknown and exposes no open/use action; an unknown scope is never treated as full scope.

## `WGT-IDENTITY-002` family realization

`AuthorizationGrantPanel` renders the grant facts that must stay together:

- who may act;
- for whom;
- actions;
- data scope;
- purpose;
- effective period;
- basis;
- governed grant state;
- retained revocation/history attribution.

Grant lifecycle presentation uses the governed scoped-grant labels from `TXT-STATE-IDENTITY-002`: `فعّالة`, `منتهية الصلاحية`, and `أُلغيت`, backed by the existing `staff-invitation` semantic-state channel shared by scoped grants.

## Revocation is unconditional

`SCR-IDENTITY-007` and the prototype `revokeRepresentationGrant` projection preserve the non-negotiable rule that no booking, case or claim state may block revocation.

Revocation:

- takes effect for later protected actions immediately;
- is destructive in presentation and requires explicit confirmation;
- is idempotent when repeated;
- does not cancel or delete existing bookings, cases or claims;
- does not delete the grant record;
- does not rewrite historical actor attribution;
- does not surface a booking-domain error.

The helper accepts a `downstreamRecordState` only as a test seam and deliberately ignores it, making the boundary executable rather than documentary.

## Represented-patient context

`SCR-IDENTITY-008` renders only subjects backed by an active, scope-resolved held grant. Expired, revoked and unresolved grants cannot become selectable subjects.

Selecting a subject produces display context only. It does not create, extend or cache authority. The acting guardian identity remains visible beside the represented Patient identity via the subject-context pattern, and copy states that every protected read/command is re-evaluated against the active grant server-side.

The clickable `FLOW-IDENTITY-003` Storybook flow demonstrates the persistent two-identity context after switching.

## Governed evidence for dependent verification

The dependent flow reuses `WGT-PLATFORM-008` and `CMP-PLATFORM-012`; it does not add a second generic upload mechanism.

The eight transfer meanings remain intact. In particular:

- `FAILED_RETRYABLE` is a transport failure and is explicitly not rejection;
- `REJECTED` is an authoritative validation result and offers replacement;
- `UPLOADED` / `VALIDATING_SCANNING` do not satisfy the requirement;
- only `ACCEPTED` evidence satisfies request submission.

No storage path, object key, signed URL, scanner name or vendor detail is shown.

## Prototype projection rules

`src/mocks/representation.ts` provides executable projections for the preview:

- complete consent-grant creation with explicit scope and period;
- stable idempotency / payload conflict behavior;
- actor-is-grantor enforcement;
- unconditional idempotent revocation;
- display-only active-subject selection;
- dependent verification request submission that returns `SUBMITTED` and never a grant;
- accepted-evidence enforcement and distinct scanning/retryable/rejected fixtures.

These helpers are preview projections of the documented contracts, not a replacement backend implementation.

## Verification coverage

`playwright/slice12-representation.spec.ts` covers:

- Arabic RTL and horizontal reflow;
- serious/critical Axe checks on high-risk representation surfaces;
- unambiguous GIVEN vs HELD directions;
- retained expired/revoked history;
- scope-unknown fail-closed behavior;
- complete-scope-before-create hierarchy;
- named missing dimensions and no open-ended default;
- adult consent vs dependent verification distinction;
- unconditional/idempotent revocation with historical attribution retained;
- active resolved grants only in represented-patient selection;
- acting guardian identity retained after context switching;
- dependent evidence transfer semantics;
- dependent submission creating a verification request only;
- idempotency and authorization projection rules;
- clickable consent-create/revoke, representation-context and dependent-request flows.

`playwright/capture-slice12.spec.ts` is opt-in with `CAPTURE=1` and remains outside the normal CI smoke gate.

`package.json` promotes Slice 12 into both `test:smoke` and `verify`.

## Preserved boundaries

- No guardian self-authorizes a dependent.
- Switching subject grants nothing.
- No coarse role is presented as data access.
- No historical grant or actor attribution is deleted.
- No booking/case/claim state can block revocation.
- No Patient screen exposes sensitive authorization internals or raw internal IDs.
- No S/P/H/I/risk/calibration mechanics appear.
- No payment, wallet, settlement or money-movement behavior is introduced.

## Final verification

Pending the stacked pull-request `Patient UI Preview` workflow on the Slice 12 implementation head.
