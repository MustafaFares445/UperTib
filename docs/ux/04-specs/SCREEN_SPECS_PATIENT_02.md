# Screen Specifications — Patient app (2 of 3)

**Phase:** UX 4 — Widget and Screen Specifications
**Platform:** Patient app · Profile C · React Native
**Schema:** `PHASE_04_IMPLEMENTATION_PLAN.md` section 6. **Widgets:** `WIDGET_SPECS.md`. **Map:** `SCREEN_SPEC_MAP.md`.

Every block carries the same thirteen sections in the same order. A section that does not apply says so and why.

---
### SCR-BOOKING-005 — Alternative appointment decision

**Wireframe:** `WF-BOOKING-005` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** form · **Density:** `reading` · **Classification:** New
**Actors:** Patient; Guardian with booking authority
**Flows:** `FLOW-BOOKING-006` `FLOW-BOOKING-007`
**Requirements:** `FR-BOOKING-003`
**Data / action contract:** `API-BOOKING-004`

**Purpose.** Let the patient accept or decline a provider alternative. Success is a confirmed appointment or a clean decline. It exists because declining and expiry both close an unconfirmed request, and the wording of that closure is the whole point of the screen.

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | The original request and the proposed alternative, with the original first. |
| Required input | The decision deadline. |
| Validation and consequence | What declining does, stated before the action. |
| Action | Accept or decline. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-BOOKING-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-010` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) |
| Patterns | `IX-BOOKING-001` `IX-BOOKING-002` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-BOOKING-004` | `200` with resulting booking state and confirmed/proposed slot metadata. | `proposal_id: string`; idempotency key required. |

- `API-BOOKING-004` takes the proposal identifier and an idempotency key, and **revalidates deadline, slot capacity and current eligibility before confirming**.
- Missing-data behaviour: if the original request could not be read, no decision control is offered, because the patient would be deciding without knowing what they hold.

**State**

- Lifecycle statuses visible: `ALTERNATIVE_PROPOSED`; `CONFIRMED` on success
- Permission model: Patient, or guardian with booking authority.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Accept the alternative | primary | the proposal is pending and its deadline has not lapsed | UNAVAILABLE after the deadline, with the closure explained |
| Decline | secondary | the proposal is pending | **Offered without a second confirmation** — declining an unwanted proposal is not destructive. UNAVAILABLE after the deadline |
| Request a new appointment | secondary | the request has closed | absent while the proposal is still pending |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-BOOKING-001` `TXT-STATE-BOOKING-002`
- Lifecycle labels for every status above are owned by `TXT-STATE-BOOKING-001` `TXT-STATE-BOOKING-002` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-BOOKING-001` | a commit that resolves slot capacity atomically and finds none | `TXT-ERR-BOOKING-001` |
| `ERR-BOOKING-002` | a booking command that the record's current state does not permit | `TXT-ERR-BOOKING-002` |
| `ERR-BOOKING-003` | a booking or provider-response command issued after its deadline lapsed | `TXT-ERR-BOOKING-003` |
| `ERR-ELIG-001` | a commit that revalidates provider, service or branch eligibility and finds it not currently passing | `TXT-ERR-ELIG-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is original request, proposed alternative, deadline, consequence, actions. The pair announces as original then proposal, each labelled.
- Announcements: Acceptance announces the resulting state and moves focus to the updated booking summary. Expiry announces and replaces the decision controls with the fresh-request route.
- Right-to-left and bidirectional: The original occupies the logical start position in both directions. Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- The pair stacks with the original first at every size class; the deadline stays adjacent to the proposal it governs.

**Loading and failure**

| State | Behaviour on this screen |
|---|---|
| `loading-initial` | Skeleton at content height through `WGT-PLATFORM-001`. No empty state and no action is rendered while the first read is in flight. |
| `loading-refresh` | Content stays visible and interactive. A refresh never steals focus and never scrolls the surface. |
| `partial` | The region that loaded stays interactive; the region that failed names itself and offers retry in place. Never presented as complete. |
| `stale` | `CMP-PLATFORM-010` `stale` with the as-of time. Committing actions are withdrawn; read actions remain. |
| `error-fetch` | `CMP-PLATFORM-010` `fetch-failure`. Last known safe context preserved, retry in place, entered input untouched. |
| `error-permission` | `CMP-PLATFORM-010` `permission-denied`. Wins over every other state, no retry, affected actions removed structurally rather than disabled. |
| `success` | Content. |
| `offline / unstable` | Last known data with its as-of time, the condition stated per `TXT-PLATFORM-009`, and committing actions withdrawn unless the command is idempotent-resumable. |

Not applicable here: `empty-no-data` `empty-filtered`. A decision surface over one proposal has no list and no filter.

**Acceptance criteria**

1. On decline or expiry the screen reads as the appointment not being confirmed and offers a fresh request.
2. **No punitive cancellation language appears anywhere on this screen.**
3. Declining requires no second confirmation.
4. Acceptance revalidates deadline, capacity and eligibility, and a late acceptance produces the deadline recovery rather than a generic failure.
5. A retry after a failed acceptance reuses the original idempotency key.

**Traceability.** `SCR-BOOKING-005` · `WF-BOOKING-005` · flows `FLOW-BOOKING-006` `FLOW-BOOKING-007` · widgets `WGT-BOOKING-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-010` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` · patterns `IX-BOOKING-001` `IX-BOOKING-002` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-BOOKING-001` `TXT-STATE-BOOKING-002` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-AUDIT-001` `ERR-BOOKING-001` `ERR-BOOKING-002` `ERR-BOOKING-003` `ERR-ELIG-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` · requirements `FR-BOOKING-003` · contract `API-BOOKING-004`

---

### SCR-BOOKING-006 — Cancel booking

**Wireframe:** `WF-BOOKING-006` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** form · **Density:** `reading` · **Classification:** New
**Actors:** Patient; Guardian with cancellation authority
**Flows:** `FLOW-BOOKING-008` `FLOW-BOOKING-012`
**Requirements:** `FR-BOOKING-002`
**Data / action contract:** `API-BOOKING-005`

**Purpose.** Let the patient cancel a booking having understood the consequence. Success is a cancelled booking with the policy-derived consequence already known to the patient. It exists because that consequence must be stated before confirming, not after.

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | Which booking is being cancelled. |
| Required input | The policy-derived downstream consequence, stated before the action. |
| Validation and consequence | The reason capture where the policy requires it. |
| Action | Confirm the cancellation. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) `CMP-PLATFORM-014` (`irreversible`) |
| Patterns | `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-BOOKING-005` | `200` with resulting state and policy-derived downstream consequence summary. | `reason: string`; idempotency key required. |

- `API-BOOKING-005` takes the cancellation with an idempotency key. The consequence shown is the policy-derived one attached to this booking, not a generic statement.
- Missing-data behaviour: if the governing policy consequence cannot be read, the cancellation is withheld and the screen says why. Cancelling without stating the consequence would be the failure this screen exists to prevent.

**State**

- Lifecycle statuses visible: `CANCELLED`
- Permission model: Patient, or guardian with cancellation authority.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Cancel the booking | destructive | the state and policy permit cancellation | UNAVAILABLE where state or policy forbid it, stated as an explained absence with the reason |
| Keep the booking | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-BOOKING-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-BOOKING-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-BOOKING-002` | a booking command that the record's current state does not permit | `TXT-ERR-BOOKING-002` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is booking identity, consequence, reason, action. The consequence is read before the confirm control is reached.
- Announcements: The committed cancellation announces and focus returns to the booking detail with its new state.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- The consequence statement is never collapsed behind a disclosure at any size; the sheet scrolls instead.

**Loading and failure**

| State | Behaviour on this screen |
|---|---|
| `loading-initial` | Skeleton at content height through `WGT-PLATFORM-001`. No empty state and no action is rendered while the first read is in flight. |
| `loading-refresh` | Content stays visible and interactive. A refresh never steals focus and never scrolls the surface. |
| `partial` | The region that loaded stays interactive; the region that failed names itself and offers retry in place. Never presented as complete. |
| `stale` | `CMP-PLATFORM-010` `stale` with the as-of time. Committing actions are withdrawn; read actions remain. |
| `error-fetch` | `CMP-PLATFORM-010` `fetch-failure`. Last known safe context preserved, retry in place, entered input untouched. |
| `error-permission` | `CMP-PLATFORM-010` `permission-denied`. Wins over every other state, no retry, affected actions removed structurally rather than disabled. |
| `success` | Content. |
| `offline / unstable` | Last known data with its as-of time, the condition stated per `TXT-PLATFORM-009`, and committing actions withdrawn unless the command is idempotent-resumable. |

Not applicable here: `empty-no-data` `empty-filtered`. A single-record confirmation has no list, no filter and no independent projection to go stale beyond the booking itself.

**Acceptance criteria**

1. The policy-derived consequence is stated before the confirm control is reachable.
2. No copy implies a charge or that money moves.
3. Repeated cancellation creates no duplicate consequence.
4. The confirm control carries the same destructive role as its trigger.
5. Focus enters the confirmation on the consequence statement, never on the confirm control.

**Traceability.** `SCR-BOOKING-006` · `WF-BOOKING-006` · flows `FLOW-BOOKING-008` `FLOW-BOOKING-012` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` `CMP-PLATFORM-014` · patterns `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-BOOKING-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-AUDIT-001` `ERR-BOOKING-002` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` · requirements `FR-BOOKING-002` · contract `API-BOOKING-005`

---

### SCR-CLINICAL-001 — My cases

**Wireframe:** `WF-CLINICAL-001` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** list-and-detail · **Density:** `reading` · **Classification:** New
**Actors:** Patient; Guardian within grant scope
**Flows:** `FLOW-CLINICAL-008`
**Requirements:** `FR-CLINICAL-005`
**Data / action contract:** `API-CLINICAL-001`

**Purpose.** List the patient's cases as the container for plans, timeline, finance, reviews and claims. Success is the patient reaching the case they mean. It exists because every one of those five is case-scoped in the data model, so the case is the navigation container.

**Hierarchy** — Phase 2 priority order, not reopened: context/filter > list > selected detail > state-aware action.

| Region | Contents |
|---|---|
| Context and filter | Which patient the cases belong to. |
| List | One row per case with its status, provider and outstanding patient action. |
| Selected detail | Whether an accepted plan exists. |
| State-aware action | Open a case. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-006` (`reading-list`) `CMP-PLATFORM-007` (`discovery`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-CLINICAL-001` | `200` with safe case status, service/provider/branch summary, current accepted-plan version if any, next follow-up, missing patient-action items, and links/IDs for authorized subresources. | none — this surface issues no command against it |

- `API-CLINICAL-001` supplies the safe case status, the provider, service and branch summary, the current accepted-plan version where one exists, the next follow-up and any missing patient-action items.
- Missing-data behaviour: a case whose outstanding-action count did not load says so rather than rendering as having none, because none is the state a patient acts on.

**State**

- Lifecycle statuses visible: case status; accepted plan presence; outstanding patient action
- Permission model: Patient acting for themselves, or a guardian acting inside an active grant. Under representation both the acting and the subject identity are visible, and every request is re-evaluated server-side; switching subject grants nothing.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Open a case | primary | a case exists | the list is replaced by the empty state, which guides toward discovery rather than showing an empty list |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLINICAL-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-CLINICAL-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the filter or search control where one exists, otherwise the first row.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is subject context, case list. Each row announces case status, provider and whether an action is outstanding.
- Announcements: A case that gains an outstanding patient action while the list is open announces politely.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- One case per reading-column block.

**Loading and failure**

| State | Behaviour on this screen |
|---|---|
| `loading-initial` | Skeleton at content height through `WGT-PLATFORM-001`. No empty state and no action is rendered while the first read is in flight. |
| `loading-refresh` | Content stays visible and interactive. A refresh never steals focus and never scrolls the surface. |
| `empty-no-data` | `CMP-PLATFORM-009` `no-data` with the one action that changes it. |
| `empty-filtered` | `CMP-PLATFORM-009` `filtered-empty`. The applied filter stays visible and is named as the cause; the recovery relaxes or clears it. |
| `partial` | The region that loaded stays interactive; the region that failed names itself and offers retry in place. Never presented as complete. |
| `stale` | `CMP-PLATFORM-010` `stale` with the as-of time. Committing actions are withdrawn; read actions remain. |
| `error-fetch` | `CMP-PLATFORM-010` `fetch-failure`. Last known safe context preserved, retry in place, entered input untouched. |
| `error-permission` | `CMP-PLATFORM-010` `permission-denied`. Wins over every other state, no retry, affected actions removed structurally rather than disabled. |
| `success` | Content. |
| `offline / unstable` | Last known data with its as-of time, the condition stated per `TXT-PLATFORM-009`, and committing actions withdrawn unless the command is idempotent-resumable. |

**Acceptance criteria**

1. With no cases the empty state guides toward discovery rather than showing an empty list.
2. A case outside the active grant is not returned.
3. Outstanding patient action is visible in the list, not only in the case.
4. Returning from a case restores focus to its row.

**Traceability.** `SCR-CLINICAL-001` · `WF-CLINICAL-001` · flows `FLOW-CLINICAL-008` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-006` `CMP-PLATFORM-007` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLINICAL-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` · requirements `FR-CLINICAL-005` · contract `API-CLINICAL-001`

---

### SCR-CLINICAL-002 — Case summary

**Wireframe:** `WF-CLINICAL-002` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** detail · **Density:** `reading` · **Classification:** New
**Actors:** Patient; Guardian within grant scope
**Flows:** `FLOW-CLINICAL-002` `FLOW-CLINICAL-008` `FLOW-FINANCE-001` `FLOW-REVIEWS-001`
**Requirements:** `FR-CLINICAL-005`, `FR-CLINICAL-001`, `FR-CLINICAL-002`
**Data / action contract:** `API-CLINICAL-001`

**Purpose.** Be the hub for every case-scoped patient job. Success is the patient reaching the plan, the timeline, the finances, the reviews or the claims for this case. It exists because those five destinations are all case-scoped and need one authoritative starting point.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The case status, the provider, the branch and the treating dentist. |
| Primary facts | The current accepted plan version and the next follow-up. |
| Related history | Outstanding patient actions, and the routes to timeline, finance, reviews and claims. |
| Action | The one action the case currently needs. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-006` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`patient`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-006` (`reading-list`) `CMP-PLATFORM-008` (`record`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-CLINICAL-001` | `200` with safe case status, service/provider/branch summary, current accepted-plan version if any, next follow-up, missing patient-action items, and links/IDs for authorized subresources. | none — this surface issues no command against it |

- `API-CLINICAL-001` supplies the case summary. Every route from here is to a surface with its own contract.
- Missing-data behaviour: a route whose target does not yet exist is absent rather than offered and then failing.

**State**

- Lifecycle statuses visible: case status; current accepted plan version; next follow-up; outstanding patient actions
- Permission model: Patient acting for themselves, or a guardian acting inside an active grant. Under representation both the acting and the subject identity are visible, and every request is re-evaluated server-side; switching subject grants nothing. **Role-safe fields only**: the projection excludes anything outside the patient audience.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Act on the outstanding item | primary | an outstanding patient action exists | absent when nothing is outstanding; the screen then reads as up to date |
| Open the treatment plan | secondary | a plan version exists | absent until one does |
| Open the timeline | secondary | always | never unavailable |
| Open the financial terms | secondary | an accepted snapshot exists | absent until acceptance creates one |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLINICAL-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-CLINICAL-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the status and identity region.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is case status, plan and follow-up, outstanding actions, routes.
- Announcements: A new outstanding action announces politely when the case is open.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- One reading column with the status summary first and the outstanding action directly beneath it.

**Loading and failure**

| State | Behaviour on this screen |
|---|---|
| `loading-initial` | Skeleton at content height through `WGT-PLATFORM-001`. No empty state and no action is rendered while the first read is in flight. |
| `loading-refresh` | Content stays visible and interactive. A refresh never steals focus and never scrolls the surface. |
| `empty-no-data` | `CMP-PLATFORM-009` `no-data` with the one action that changes it. |
| `partial` | The region that loaded stays interactive; the region that failed names itself and offers retry in place. Never presented as complete. |
| `stale` | `CMP-PLATFORM-010` `stale` with the as-of time. Committing actions are withdrawn; read actions remain. |
| `error-fetch` | `CMP-PLATFORM-010` `fetch-failure`. Last known safe context preserved, retry in place, entered input untouched. |
| `error-permission` | `CMP-PLATFORM-010` `permission-denied`. Wins over every other state, no retry, affected actions removed structurally rather than disabled. |
| `success` | Content. |
| `offline / unstable` | Last known data with its as-of time, the condition stated per `TXT-PLATFORM-009`, and committing actions withdrawn unless the command is idempotent-resumable. |

Not applicable here: `empty-filtered`. A single-record hub has no list-level filter.

**Acceptance criteria**

1. Every destination reachable from here is case-scoped.
2. No field outside the patient audience is present in the projection.
3. A route to a surface that does not yet exist is absent rather than offered.
4. The outstanding action is the most prominent thing on the screen when one exists.

**Traceability.** `SCR-CLINICAL-002` · `WF-CLINICAL-002` · flows `FLOW-CLINICAL-002` `FLOW-CLINICAL-008` `FLOW-FINANCE-001` `FLOW-REVIEWS-001` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-006` · components `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-006` `CMP-PLATFORM-008` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLINICAL-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` · requirements `FR-CLINICAL-005`, `FR-CLINICAL-001`, `FR-CLINICAL-002` · contract `API-CLINICAL-001`

---

### SCR-CLINICAL-003 — Treatment plan

**Wireframe:** `WF-CLINICAL-003` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** detail · **Density:** `reading` · **Classification:** New
**Actors:** Patient; Guardian within grant scope
**Flows:** `FLOW-CLINICAL-002` `FLOW-CLINICAL-003` `FLOW-CLINICAL-010`
**Requirements:** `FR-CLINICAL-001`, `FR-CLINICAL-002`, `FR-FINANCE-001`
**Data / action contract:** `API-CLINICAL-002`

**Purpose.** Let the patient read a treatment plan as structured lines they can understand, in both its proposed and accepted states. Success is the patient understanding what is proposed and what each amount is for. One screen serves both states because the content and the contract are identical and only the available action differs.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The plan state, its version, and the treating dentist who authored it. |
| Primary facts | The treatment lines, each in plain language with its quantity, unit, amounts, inclusions and exclusions. |
| Related history | The delta against the version this one supersedes, where one exists. |
| Action | Accept, where the plan is proposed. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-CLINICAL-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-014` |
| Components | `CMP-CLINICAL-001` (`review`) `CMP-CLINICAL-002` (`amendment`) `CMP-ELIG-002` (`governed display mode from the provider price fact`) `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`patient`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-013` (`decided-by-person`) |
| Patterns | `IX-CLINICAL-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-POLICY-002` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-CLINICAL-002` | `200` with clinician-authored plan version, service family, stages, currency, total, inclusions/exclusions, applicable terms, protection state, `expires_at` where the version is proposed, and whether the version is proposed or accepted. It must identify the clinician as author and must not imply platform diagnosis. | none — this surface issues no command against it |

- `API-CLINICAL-002` supplies the plan version, its state, its lines and the amendment delta where one exists.
- Each line carries what the procedure is in plain language, quantity and unit, unit and line amount, what the line includes and excludes, and any material upgrade, third-party cost or quantity change as its own identified item with a reason.
- Missing-data behaviour: if any line or the terms failed to load, **no total is rendered** and the screen names the missing part. A total over an incomplete line set is a wrong number.

**State**

- Lifecycle statuses visible: `PROPOSED`, `ACCEPTED`
- Permission model: Patient acting for themselves, or a guardian acting inside an active grant. Under representation both the acting and the subject identity are visible, and every request is re-evaluated server-side; switching subject grants nothing. Acceptance additionally requires acceptance authority within the grant.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Accept this plan | primary | the plan is proposed and the actor holds acceptance authority | absent on an accepted version, which carries no action of any kind |
| See what changed | secondary | this version supersedes an earlier one | absent on a first version |
| Open the financial terms | secondary | the plan is accepted | absent while proposed |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-013` `TXT-PLATFORM-014` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLINICAL-001` `TXT-STATE-PLATFORM-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-CLINICAL-001` `TXT-STATE-PLATFORM-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-FINANCE-001` `A11Y-CLINICAL-001` `A11Y-POLICY-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the status and identity region.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is plan state and author, lines, delta, action. Each line announces its description, quantity and unit, amount with currency, and its category where a modifier exists.
- Announcements: An amendment becoming available announces politely and focus moves to the change set, never onto the accept control.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- One line per reading-column block with the amount adjacent to what it covers. No amount truncates at any text size.

**Loading and failure**

| State | Behaviour on this screen |
|---|---|
| `loading-initial` | Skeleton at content height through `WGT-PLATFORM-001`. No empty state and no action is rendered while the first read is in flight. |
| `loading-refresh` | Content stays visible and interactive. A refresh never steals focus and never scrolls the surface. |
| `partial` | The region that loaded stays interactive; the region that failed names itself and offers retry in place. Never presented as complete. |
| `stale` | `CMP-PLATFORM-010` `stale` with the as-of time. Committing actions are withdrawn; read actions remain. |
| `error-fetch` | `CMP-PLATFORM-010` `fetch-failure`. Last known safe context preserved, retry in place, entered input untouched. |
| `error-permission` | `CMP-PLATFORM-010` `permission-denied`. Wins over every other state, no retry, affected actions removed structurally rather than disabled. |
| `success` | Content. |
| `offline / unstable` | Last known data with its as-of time, the condition stated per `TXT-PLATFORM-009`, and committing actions withdrawn unless the command is idempotent-resumable. |

Not applicable here: `empty-no-data` `empty-filtered`. A single-version read has no list-level filter and no independent scope.

**Acceptance criteria**

1. Every line reads as a meaning; a line the patient cannot read a meaning for is a defect.
2. No line is an unexplained surcharge and no included component appears twice.
3. An accepted version carries no edit affordance of any kind.
4. Where this version supersedes an earlier one, the delta and the price difference are part of the reading rather than a footnote.
5. The treating dentist is identified as the author, and no copy implies platform diagnosis.

**Traceability.** `SCR-CLINICAL-003` · `WF-CLINICAL-003` · flows `FLOW-CLINICAL-002` `FLOW-CLINICAL-003` `FLOW-CLINICAL-010` · widgets `WGT-CLINICAL-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-014` · components `CMP-CLINICAL-001` `CMP-CLINICAL-002` `CMP-ELIG-002` `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-013` · patterns `IX-CLINICAL-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-POLICY-002` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-013` `TXT-PLATFORM-014` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLINICAL-001` `TXT-STATE-PLATFORM-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-FINANCE-001` `A11Y-CLINICAL-001` `A11Y-POLICY-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` · requirements `FR-CLINICAL-001`, `FR-CLINICAL-002`, `FR-FINANCE-001` · contract `API-CLINICAL-002`

---

### SCR-CLINICAL-004 — Plan acceptance

**Wireframe:** `WF-CLINICAL-004` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** detail · **Density:** `reading` · **Classification:** New
**Actors:** Patient; Guardian with acceptance authority
**Flows:** `FLOW-CLINICAL-002` `FLOW-CLINICAL-003` `FLOW-CLINICAL-010`
**Requirements:** `FR-CLINICAL-002`, `FR-FINANCE-001`
**Data / action contract:** `API-CLINICAL-003`

**Purpose.** Let the patient accept a treatment plan, with the permanence of what they are accepting evident before the action. Success is one accepted plan and its atomically created clinical and financial snapshots. It is the highest-consequence patient action in the product.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The version being accepted and, where it supersedes one, what changed. |
| Primary facts | What acceptance creates, and that it is permanent. |
| Related history | The prior accepted snapshot, which stays visible and immutable. |
| Action | Accept. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-CLINICAL-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-014` |
| Components | `CMP-CLINICAL-001` (`review`) `CMP-CLINICAL-002` (`amendment`) `CMP-ELIG-002` (`governed display mode from the provider price fact`) `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`patient`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) `CMP-PLATFORM-013` (`decided-by-person`) `CMP-PLATFORM-014` (`irreversible`) |
| Patterns | `IX-AUDIT-001` `IX-CLINICAL-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-POLICY-002` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-CLINICAL-003` | `200` with immutable accepted plan/financial snapshot IDs and acceptance timestamp. | `plan_version_id: string`; explicit acceptance acknowledgment/version if required by policy; idempotency key required. |

- `API-CLINICAL-003` accepts the version with an idempotency key and **atomically creates the accepted clinical and financial snapshots**.
- Missing-data behaviour: a failed acceptance creates no partial snapshot. Where the version is stale or incomplete, the screen says the plan needs updating by the clinic and offers no workaround.

**State**

- Lifecycle statuses visible: `ACCEPTED`
- Permission model: Patient, or guardian with acceptance authority. Concurrent acceptance cannot produce two accepted outcomes.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Accept | primary | the version is current, complete and the actor holds acceptance authority | UNAVAILABLE against a stale or incomplete version, presented as **the plan needing updating, not as patient error** |
| Review the plan again | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-013` `TXT-PLATFORM-014` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLINICAL-001` `TXT-STATE-PLATFORM-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-CLINICAL-001` `TXT-STATE-PLATFORM-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-CLINICAL-001` | an acceptance against a version that is stale or missing required information | `TXT-ERR-CLINICAL-001` |
| `ERR-CLINICAL-002` | a treatment line whose commercial option is uncategorized, retired or not selectable | `TXT-ERR-CLINICAL-002` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-FINANCE-001` `A11Y-CLINICAL-001` `A11Y-POLICY-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the status and identity region.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is the change set where one exists, then the permanence statement, then the action. The change set is disclosed before acceptance is possible.
- Announcements: The committed acceptance announces and focus moves to the accepted state. Focus never lands on the accept control as a side effect of disclosure.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- The permanence statement is never collapsed behind a disclosure at any text size.

**Loading and failure**

| State | Behaviour on this screen |
|---|---|
| `loading-initial` | Skeleton at content height through `WGT-PLATFORM-001`. No empty state and no action is rendered while the first read is in flight. |
| `loading-refresh` | Content stays visible and interactive. A refresh never steals focus and never scrolls the surface. |
| `partial` | The region that loaded stays interactive; the region that failed names itself and offers retry in place. Never presented as complete. |
| `stale` | `CMP-PLATFORM-010` `stale` with the as-of time. Committing actions are withdrawn; read actions remain. |
| `error-fetch` | `CMP-PLATFORM-010` `fetch-failure`. Last known safe context preserved, retry in place, entered input untouched. |
| `error-permission` | `CMP-PLATFORM-010` `permission-denied`. Wins over every other state, no retry, affected actions removed structurally rather than disabled. |
| `success` | Content. |
| `offline / unstable` | Last known data with its as-of time, the condition stated per `TXT-PLATFORM-009`, and committing actions withdrawn unless the command is idempotent-resumable. |

Not applicable here: `empty-no-data` `empty-filtered`. An acceptance surface has no list and no filter.

**Acceptance criteria**

1. What is being accepted, and that it is permanent, is evident before the action rather than explained after it.
2. Accepting an amendment requires the stated delta and the price difference to be visible first.
3. A stale or incomplete version presents as the plan needing updating, not as patient error.
4. A line whose commercial option is uncategorized, retired or unselectable presents as the plan needing correction by the clinic.
5. Concurrent acceptance produces exactly one accepted outcome, and a failed acceptance creates no partial snapshot.

**Traceability.** `SCR-CLINICAL-004` · `WF-CLINICAL-004` · flows `FLOW-CLINICAL-002` `FLOW-CLINICAL-003` `FLOW-CLINICAL-010` · widgets `WGT-CLINICAL-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-014` · components `CMP-CLINICAL-001` `CMP-CLINICAL-002` `CMP-ELIG-002` `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` `CMP-PLATFORM-013` `CMP-PLATFORM-014` · patterns `IX-AUDIT-001` `IX-CLINICAL-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-POLICY-002` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-013` `TXT-PLATFORM-014` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLINICAL-001` `TXT-STATE-PLATFORM-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-FINANCE-001` `A11Y-CLINICAL-001` `A11Y-POLICY-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-AUDIT-001` `ERR-CLINICAL-001` `ERR-CLINICAL-002` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` · requirements `FR-CLINICAL-002`, `FR-FINANCE-001` · contract `API-CLINICAL-003`

---

### SCR-CLINICAL-005 — Case timeline

**Wireframe:** `WF-CLINICAL-005` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** list-and-detail · **Density:** `reading` · **Classification:** New
**Actors:** Patient; Guardian within grant scope
**Flows:** `FLOW-CLINICAL-008`
**Requirements:** `FR-CLINICAL-005`
**Data / action contract:** `API-CLINICAL-004`

**Purpose.** Give the patient the whole case as one ordered history. Success is the patient finding the event they are looking for among dozens. It exists because booking, stages, evidence, follow-ups, reviews, claims and external financial records are one story and reading them separately loses the sequence.

**Hierarchy** — Phase 2 priority order, not reopened: context/filter > list > selected detail > state-aware action.

| Region | Contents |
|---|---|
| Context and filter | Which case and which patient. |
| List | Events in order, spanning booking, accepted terms, stages, evidence status, follow-ups, reviews, claims and external financial records. |
| Selected detail | Each event's detail, disclosed in place. |
| State-aware action | Routes to the owning record for any event. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` `WGT-PLATFORM-006` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-006` (`reading-list`) `CMP-PLATFORM-007` (`discovery`) `CMP-PLATFORM-008` (`record`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-CLINICAL-004` | `200` ordered timeline events with event type, occurred/recorded time, actor-safe attribution, state/result summary, source domain, and links to authorized details. Corrections/reversals appear as later events. | none — this surface issues no command against it |

- `API-CLINICAL-004` supplies the unified ordered event set. **Dozens of events is the realistic volume**, so the read is bounded and the boundary is explicit.
- Missing-data behaviour: a bounded page that failed to load states that older events exist and could not be read. It never renders as the beginning of history.

**State**

- Lifecycle statuses visible: booking, stage, follow-up, financial, review and claim events
- Permission model: Patient acting for themselves, or a guardian acting inside an active grant. Under representation both the acting and the subject identity are visible, and every request is re-evaluated server-side; switching subject grants nothing. **Role-based field filtering applies**: events carry only what the patient audience may see.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Open an event's record | primary | the event has an owning record | absent for an event that is a fact rather than a record |
| Load older events | secondary | the read boundary has more behind it | absent at the start of history, where the boundary states that this is the beginning |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLINICAL-002`
- Lifecycle labels for every status above are owned by `TXT-STATE-CLINICAL-002` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the filter or search control where one exists, otherwise the first row.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is case context, event list, boundary. The timeline is exposed as a list, not as a table, because events are ordered rather than tabular.
- Announcements: A new event appends and announces politely while the patient is viewing the case.
- Right-to-left and bidirectional: The timeline runs top to bottom in both directions, so no ordering reversal applies. Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- One event per reading-column block; the who-and-basis line stacks beneath the event rather than moving into a tooltip.

**Loading and failure**

| State | Behaviour on this screen |
|---|---|
| `loading-initial` | Skeleton at content height through `WGT-PLATFORM-001`. No empty state and no action is rendered while the first read is in flight. |
| `loading-refresh` | Content stays visible and interactive. A refresh never steals focus and never scrolls the surface. |
| `empty-no-data` | `CMP-PLATFORM-009` `no-data` with the one action that changes it. |
| `empty-filtered` | `CMP-PLATFORM-009` `filtered-empty`. The applied filter stays visible and is named as the cause; the recovery relaxes or clears it. |
| `partial` | The region that loaded stays interactive; the region that failed names itself and offers retry in place. Never presented as complete. |
| `stale` | `CMP-PLATFORM-010` `stale` with the as-of time. Committing actions are withdrawn; read actions remain. |
| `error-fetch` | `CMP-PLATFORM-010` `fetch-failure`. Last known safe context preserved, retry in place, entered input untouched. |
| `error-permission` | `CMP-PLATFORM-010` `permission-denied`. Wins over every other state, no retry, affected actions removed structurally rather than disabled. |
| `success` | Content. |
| `offline / unstable` | Last known data with its as-of time, the condition stated per `TXT-PLATFORM-009`, and committing actions withdrawn unless the command is idempotent-resumable. |

**Acceptance criteria**

1. Corrections and reversals appear as later events and never erase earlier ones.
2. No control reachable from the timeline mutates an existing event.
3. The read boundary is explicit and states that older events exist.
4. A scope-limited history says it is scope-limited rather than appearing complete.

**Traceability.** `SCR-CLINICAL-005` · `WF-CLINICAL-005` · flows `FLOW-CLINICAL-008` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` `WGT-PLATFORM-006` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-006` `CMP-PLATFORM-007` `CMP-PLATFORM-008` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLINICAL-002` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` · requirements `FR-CLINICAL-005` · contract `API-CLINICAL-004`

---

### SCR-CLINICAL-006 — Stage detail

**Wireframe:** `WF-CLINICAL-006` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** detail · **Density:** `reading` · **Classification:** New
**Actors:** Patient; Guardian within grant scope
**Flows:** `FLOW-CLINICAL-008`
**Requirements:** `FR-CLINICAL-003`
**Data / action contract:** `API-CLINICAL-004`

**Purpose.** Show one treatment stage in patient-safe terms. Success is the patient understanding where the stage stands. It exists because a reopening must read as a recorded correction with its reason rather than as an error or a reversal of history.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The stage and its state. |
| Primary facts | What the stage covers, from the accepted snapshot. |
| Related history | Who completed it and when, and any reopening with its reason. |
| Action | Return to the timeline. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-CLINICAL-003` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`patient`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-006` (`reading-list`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-013` (`decided-by-person`) |
| Patterns | `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-006` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-CLINICAL-004` | `200` ordered timeline events with event type, occurred/recorded time, actor-safe attribution, state/result summary, source domain, and links to authorized details. Corrections/reversals appear as later events. | none — this surface issues no command against it |

- `API-CLINICAL-004` supplies the stage state and its patient-safe detail.
- Missing-data behaviour: a reopening whose reason did not load states that the reason is unavailable rather than rendering the reopening without one, because a reopening with no reason reads as an error.

**State**

- Lifecycle statuses visible: `INCOMPLETE`, `COMPLETED`, `REOPENED`
- Permission model: Patient acting for themselves, or a guardian acting inside an active grant. Under representation both the acting and the subject identity are visible, and every request is re-evaluated server-side; switching subject grants nothing. **Patient-safe status only.** Private clinical evidence, storage paths and signed links are not in this projection.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Back to the timeline | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLINICAL-002`
- Lifecycle labels for every status above are owned by `TXT-STATE-CLINICAL-002` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-CLINICAL-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the status and identity region.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is stage identity and state, coverage, attribution and reopening history.
- Announcements: A stage state change announces politely while the screen is open.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- One reading column; the reopening reason never truncates.

**Loading and failure**

| State | Behaviour on this screen |
|---|---|
| `loading-initial` | Skeleton at content height through `WGT-PLATFORM-001`. No empty state and no action is rendered while the first read is in flight. |
| `loading-refresh` | Content stays visible and interactive. A refresh never steals focus and never scrolls the surface. |
| `empty-no-data` | `CMP-PLATFORM-009` `no-data` with the one action that changes it. |
| `partial` | The region that loaded stays interactive; the region that failed names itself and offers retry in place. Never presented as complete. |
| `stale` | `CMP-PLATFORM-010` `stale` with the as-of time. Committing actions are withdrawn; read actions remain. |
| `error-fetch` | `CMP-PLATFORM-010` `fetch-failure`. Last known safe context preserved, retry in place, entered input untouched. |
| `error-permission` | `CMP-PLATFORM-010` `permission-denied`. Wins over every other state, no retry, affected actions removed structurally rather than disabled. |
| `success` | Content. |
| `offline / unstable` | Last known data with its as-of time, the condition stated per `TXT-PLATFORM-009`, and committing actions withdrawn unless the command is idempotent-resumable. |

Not applicable here: `empty-filtered`. A single-stage read has no list-level filter and no committing action of its own.

**Acceptance criteria**

1. No private clinical evidence, storage path or signed link is reachable.
2. A reopening reads as a recorded correction with its reason.
3. The prior completion remains readable after a reopening.
4. The screen offers no action that changes stage state.

**Traceability.** `SCR-CLINICAL-006` · `WF-CLINICAL-006` · flows `FLOW-CLINICAL-008` · widgets `WGT-CLINICAL-003` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` · components `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-006` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-013` · patterns `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-006` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLINICAL-002` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-CLINICAL-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` · requirements `FR-CLINICAL-003` · contract `API-CLINICAL-004`

---

### SCR-CLINICAL-007 — Follow-ups

**Wireframe:** `WF-CLINICAL-007` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** list-and-detail · **Density:** `reading` · **Classification:** New
**Actors:** Patient; Guardian within grant scope
**Flows:** `FLOW-CLINICAL-007`
**Requirements:** `FR-CLINICAL-004`
**Data / action contract:** `API-CLINICAL-001`, `API-CLINICAL-004`

**Purpose.** Show the patient their follow-ups and their due state. Success is the patient booking or attending the follow-up that is due. It exists because the due state is authoritative whether or not any notification arrived.

**Hierarchy** — Phase 2 priority order, not reopened: context/filter > list > selected detail > state-aware action.

| Region | Contents |
|---|---|
| Context and filter | Which patient and which case. |
| List | One row per follow-up with its due state. |
| Selected detail | What the follow-up is derived from. |
| State-aware action | Book an appointment for a due follow-up. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-006` (`reading-list`) `CMP-PLATFORM-007` (`discovery`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-CLINICAL-001` | `200` with safe case status, service/provider/branch summary, current accepted-plan version if any, next follow-up, missing patient-action items, and links/IDs for authorized subresources. | none — this surface issues no command against it |
| `API-CLINICAL-004` | `200` ordered timeline events with event type, occurred/recorded time, actor-safe attribution, state/result summary, source domain, and links to authorized details. Corrections/reversals appear as later events. | none — this surface issues no command against it |

- `API-CLINICAL-001` and `API-CLINICAL-004` supply the follow-up set and its due state, derived from the accepted plan and the effective communication policy.
- Missing-data behaviour: **a failed delivery neither duplicates nor cancels the obligation**, and the due state renders from the plan rather than from any delivery record.

**State**

- Lifecycle statuses visible: follow-up due state
- Permission model: Patient acting for themselves, or a guardian acting inside an active grant. Under representation both the acting and the subject identity are visible, and every request is re-evaluated server-side; switching subject grants nothing.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Book for this follow-up | primary | the follow-up is due and needs a new booking | absent where the follow-up is already scheduled or not yet due |
| Open the case | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011`
- No status this screen shows belongs to a governed lifecycle machine, so it binds no `TXT-STATE-*` rule. What the state section lists is descriptive condition, not a status chip drawn from a state machine.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the filter or search control where one exists, otherwise the first row.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is subject and case context, follow-up list. Each row announces its due state.
- Announcements: A follow-up becoming due announces politely while the list is open.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- One follow-up per reading-column block with its due state adjacent.

**Loading and failure**

| State | Behaviour on this screen |
|---|---|
| `loading-initial` | Skeleton at content height through `WGT-PLATFORM-001`. No empty state and no action is rendered while the first read is in flight. |
| `loading-refresh` | Content stays visible and interactive. A refresh never steals focus and never scrolls the surface. |
| `empty-no-data` | `CMP-PLATFORM-009` `no-data` with the one action that changes it. |
| `empty-filtered` | `CMP-PLATFORM-009` `filtered-empty`. The applied filter stays visible and is named as the cause; the recovery relaxes or clears it. |
| `partial` | The region that loaded stays interactive; the region that failed names itself and offers retry in place. Never presented as complete. |
| `stale` | `CMP-PLATFORM-010` `stale` with the as-of time. Committing actions are withdrawn; read actions remain. |
| `error-fetch` | `CMP-PLATFORM-010` `fetch-failure`. Last known safe context preserved, retry in place, entered input untouched. |
| `error-permission` | `CMP-PLATFORM-010` `permission-denied`. Wins over every other state, no retry, affected actions removed structurally rather than disabled. |
| `success` | Content. |
| `offline / unstable` | Last known data with its as-of time, the condition stated per `TXT-PLATFORM-009`, and committing actions withdrawn unless the command is idempotent-resumable. |

**Acceptance criteria**

1. The due state is authoritative regardless of whether any notification arrived.
2. A failed delivery does not duplicate or discharge the obligation.
3. Booking from a due follow-up enters the ordinary booking path.
4. An empty follow-up set reads as nothing due rather than as a failure.

**Traceability.** `SCR-CLINICAL-007` · `WF-CLINICAL-007` · flows `FLOW-CLINICAL-007` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-006` `CMP-PLATFORM-007` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` · requirements `FR-CLINICAL-004` · contract `API-CLINICAL-001`, `API-CLINICAL-004`

---

### SCR-FINANCE-001 — Accepted financial terms

**Wireframe:** `WF-FINANCE-001` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** detail · **Density:** `reading` · **Classification:** New
**Actors:** Patient; Guardian within grant scope
**Flows:** `FLOW-CLINICAL-002` `FLOW-CLINICAL-010` `FLOW-FINANCE-001` `FLOW-FINANCE-008`
**Requirements:** `FR-FINANCE-001`
**Data / action contract:** `API-FINANCE-001`

**Purpose.** Show the patient the immutable accepted financial terms that govern their case. Success is the patient knowing exactly what was agreed and in which currency. It exists because the snapshot governs the events that occurred under it, permanently.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The snapshot version and its protection state. |
| Primary facts | Service, stages, accepted lines and their amounts, in the agreed currency. |
| Related history | Due structure, cancellation and refund terms, protection terms, and the governing policy versions. |
| Action | Open the financial timeline. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-CLINICAL-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` |
| Components | `CMP-CLINICAL-001` (`review`) `CMP-ELIG-002` (`governed display mode from the provider price fact`) `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`patient`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-006` (`reading-list`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-CLINICAL-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-FINANCE-001` | `200` with immutable accepted snapshot version, service/stages, the accepted lines and their modifiers, amounts, the currency the amount was agreed in, due structure, cancellation/refund terms, protection terms/state, superseded-snapshot reference where an amendment exists, and governing policy versions. The agreed currency is the one captured at acceptance; the response never re-expresses a historical amount at a later exchange rate. | none — this surface issues no command against it |

- `API-FINANCE-001` supplies the accepted snapshot: service, stages, accepted lines and their amounts, currency, due structure, cancellation and refund terms, protection terms and the governing policy versions.
- **The amount is shown in the currency that was agreed.** A later exchange-rate, rounding or currency-policy change never recomputes it; a converted figure, where one is shown at all, is labelled as an indication alongside the agreed amount rather than replacing it.
- Missing-data behaviour: if any line or the terms failed to load, no total renders and the missing part is named.

**State**

- Lifecycle statuses visible: snapshot version; protection state
- Permission model: Patient acting for themselves, or a guardian acting inside an active grant. Under representation both the acting and the subject identity are visible, and every request is re-evaluated server-side; switching subject grants nothing.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Open the financial timeline | primary | always | never unavailable |
| Open an earlier snapshot | secondary | an amendment has superseded this one | absent where this is the only accepted version |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-013` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011`
- No status this screen shows belongs to a governed lifecycle machine, so it binds no `TXT-STATE-*` rule. What the state section lists is descriptive condition, not a status chip drawn from a state machine.
- No copy, control or affordance on this screen implies that UberTib collects, holds, transfers, captures, settles or refunds money. UberTib V1 performs no direct money movement and every amount here is a record of what the parties agreed or asserted between themselves.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-FINANCE-001` `A11Y-CLINICAL-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the status and identity region.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is snapshot identity, lines, terms. Each amount announces with its currency and its category; the snapshot announces as historical.
- Announcements: Nothing announces. The snapshot is immutable and does not change.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- One line per reading-column block. No amount, currency or total truncates at any text size.

**Loading and failure**

| State | Behaviour on this screen |
|---|---|
| `loading-initial` | Skeleton at content height through `WGT-PLATFORM-001`. No empty state and no action is rendered while the first read is in flight. |
| `loading-refresh` | Content stays visible and interactive. A refresh never steals focus and never scrolls the surface. |
| `empty-no-data` | `CMP-PLATFORM-009` `no-data` with the one action that changes it. |
| `partial` | The region that loaded stays interactive; the region that failed names itself and offers retry in place. Never presented as complete. |
| `stale` | `CMP-PLATFORM-010` `stale` with the as-of time. Committing actions are withdrawn; read actions remain. |
| `error-fetch` | `CMP-PLATFORM-010` `fetch-failure`. Last known safe context preserved, retry in place, entered input untouched. |
| `error-permission` | `CMP-PLATFORM-010` `permission-denied`. Wins over every other state, no retry, affected actions removed structurally rather than disabled. |
| `success` | Content. |
| `offline / unstable` | Last known data with its as-of time, the condition stated per `TXT-PLATFORM-009`, and committing actions withdrawn unless the command is idempotent-resumable. |

Not applicable here: `empty-filtered`. An immutable snapshot has no list-level filter and never goes stale in the sense a live projection does; a failed read still renders the last known snapshot with its as-of time.

**Acceptance criteria**

1. The snapshot renders at full contrast and carries no edit affordance of any kind.
2. The agreed amount stays in its agreed currency and is never recomputed.
3. A superseded snapshot remains reachable because it governs earlier events.
4. No copy, control or affordance on this screen implies that UberTib collects, holds, transfers, captures, settles or refunds money. UberTib V1 performs no direct money movement and every amount here is a record of what the parties agreed or asserted between themselves.

**Traceability.** `SCR-FINANCE-001` · `WF-FINANCE-001` · flows `FLOW-CLINICAL-002` `FLOW-CLINICAL-010` `FLOW-FINANCE-001` `FLOW-FINANCE-008` · widgets `WGT-CLINICAL-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` · components `CMP-CLINICAL-001` `CMP-ELIG-002` `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-006` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-CLINICAL-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-013` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-FINANCE-001` `A11Y-CLINICAL-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` · requirements `FR-FINANCE-001` · contract `API-FINANCE-001`

---

### SCR-FINANCE-002 — Financial timeline

**Wireframe:** `WF-FINANCE-002` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** list-and-detail · **Density:** `reading` · **Classification:** New
**Actors:** Patient; Guardian within grant scope
**Flows:** `FLOW-CLAIMS-001` `FLOW-CLINICAL-008` `FLOW-FINANCE-001` `FLOW-FINANCE-002` `FLOW-FINANCE-004` `FLOW-FINANCE-006` `FLOW-FINANCE-007`
**Requirements:** `FR-FINANCE-006`, `FR-FINANCE-005`
**Data / action contract:** `API-FINANCE-005`

**Purpose.** Show every financial event on the case in order, with agreed, reported, confirmed, disputed, refunded and pending-external-execution visibly distinct. Success is the patient knowing what is settled and what is only asserted. It exists because an unconfirmed assertion must never read as a settled fact.

**Hierarchy** — Phase 2 priority order, not reopened: context/filter > list > selected detail > state-aware action.

| Region | Contents |
|---|---|
| Context and filter | The case and the agreed position from the immutable snapshot. |
| List | Events in order, each with what was asserted, by whom, when, its amount and its state. |
| Selected detail | The derived current position, shown as derived. |
| State-aware action | Report a payment, respond to an event, or report a refund execution. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-FINANCE-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` `WGT-PLATFORM-006` |
| Components | `CMP-ELIG-002` (`governed display mode from the provider price fact`) `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-006` (`reading-list`) `CMP-PLATFORM-007` (`discovery`) `CMP-PLATFORM-008` (`record`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-FINANCE-005` | `200` ordered financial events plus derived amounts/statuses distinguishing agreed, reported, confirmed, disputed, refunded, and pending-external-execution values. | none — this surface issues no command against it |

- `API-FINANCE-005` supplies the ordered events plus the derived amounts and statuses distinguishing agreed, reported, confirmed, disputed, refunded and pending external execution.
- **Every amount derives from the immutable snapshot plus ordered events**, never from an independent figure.
- Missing-data behaviour: if any event failed to load, **no derived position is rendered** and the gap is named.

**State**

- Lifecycle statuses visible: `REPORTED_UNCONFIRMED`, `CONFIRMED`, `DISPUTED`; agreed, refunded and pending-external-execution values
- Permission model: Patient acting for themselves, or a guardian acting inside an active grant. Under representation both the acting and the subject identity are visible, and every request is re-evaluated server-side; switching subject grants nothing. Financial actions additionally require financial-action authority within the grant.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Report a payment | primary | the governing terms permit it | UNAVAILABLE where the terms do not, with the reason stated |
| Respond to an event | primary | an event awaits this patient as counterparty | absent where no event awaits a response |
| Report a refund execution | secondary | an approved refund decision exists | absent until one does |
| Request a refund | secondary | the claim window permits it | UNAVAILABLE outside the window, with the window stated |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-013` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-FINANCE-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-FINANCE-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.
- No copy, control or affordance on this screen implies that UberTib collects, holds, transfers, captures, settles or refunds money. UberTib V1 performs no direct money movement and every amount here is a record of what the parties agreed or asserted between themselves.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-FINANCE-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the filter or search control where one exists, otherwise the first row.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is agreed position, event list, derived position, actions. Each amount announces with its currency and its state, so an unconfirmed assertion is never heard as settled.
- Announcements: A new event appends and announces politely; the derived position recomputes and announces once.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- One event per reading-column block with the amount adjacent to its state.

**Loading and failure**

| State | Behaviour on this screen |
|---|---|
| `loading-initial` | Skeleton at content height through `WGT-PLATFORM-001`. No empty state and no action is rendered while the first read is in flight. |
| `loading-refresh` | Content stays visible and interactive. A refresh never steals focus and never scrolls the surface. |
| `empty-no-data` | `CMP-PLATFORM-009` `no-data` with the one action that changes it. |
| `empty-filtered` | `CMP-PLATFORM-009` `filtered-empty`. The applied filter stays visible and is named as the cause; the recovery relaxes or clears it. |
| `partial` | The region that loaded stays interactive; the region that failed names itself and offers retry in place. Never presented as complete. |
| `stale` | `CMP-PLATFORM-010` `stale` with the as-of time. Committing actions are withdrawn; read actions remain. |
| `error-fetch` | `CMP-PLATFORM-010` `fetch-failure`. Last known safe context preserved, retry in place, entered input untouched. |
| `error-permission` | `CMP-PLATFORM-010` `permission-denied`. Wins over every other state, no retry, affected actions removed structurally rather than disabled. |
| `success` | Content. |
| `offline / unstable` | Last known data with its as-of time, the condition stated per `TXT-PLATFORM-009`, and committing actions withdrawn unless the command is idempotent-resumable. |

**Acceptance criteria**

1. Agreed, reported, confirmed, disputed, refunded and pending external execution are six visibly and audibly distinct states.
2. A partial event read renders no derived position and names the gap.
3. No event is editable or deletable from this surface.
4. No copy, control or affordance on this screen implies that UberTib collects, holds, transfers, captures, settles or refunds money. UberTib V1 performs no direct money movement and every amount here is a record of what the parties agreed or asserted between themselves.

**Traceability.** `SCR-FINANCE-002` · `WF-FINANCE-002` · flows `FLOW-CLAIMS-001` `FLOW-CLINICAL-008` `FLOW-FINANCE-001` `FLOW-FINANCE-002` `FLOW-FINANCE-004` `FLOW-FINANCE-006` `FLOW-FINANCE-007` · widgets `WGT-FINANCE-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` `WGT-PLATFORM-006` · components `CMP-ELIG-002` `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-006` `CMP-PLATFORM-007` `CMP-PLATFORM-008` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-013` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-FINANCE-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-FINANCE-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` · requirements `FR-FINANCE-006`, `FR-FINANCE-005` · contract `API-FINANCE-005`

---

### SCR-FINANCE-003 — Report external payment

**Wireframe:** `WF-FINANCE-003` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** form · **Density:** `reading` · **Classification:** New
**Actors:** Patient; Guardian with financial action authority
**Flows:** `FLOW-FINANCE-002`
**Requirements:** `FR-FINANCE-002`, `FR-FINANCE-005`
**Data / action contract:** `API-FINANCE-002`

**Purpose.** Let the patient record that they paid the clinic outside the platform. Success is exactly one appended event in `REPORTED_UNCONFIRMED`. It exists because the platform records what the parties did; it does not do it for them.

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | The case and the governing terms snapshot. |
| Required input | Amount, currency, external method category and occurrence time. |
| Validation and consequence | That this is a report the clinic will confirm or dispute, not a payment. |
| Action | Record the payment. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-010` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-FINANCE-002` | `201` with event ID and `status: "reported_unconfirmed"` or equivalent canonical state from `STATE_MACHINES.md`. | `financial_terms_snapshot_id: string`, `amount: decimal`, `currency: string`, `external_method_category: string`, `occurred_at: datetime`, `evidence_ids: string[]\|null`; payer identity is derived from authenticated context; idempotency key required. |

- `API-FINANCE-002` records the terms snapshot, amount, currency, external method category and occurrence time, with an idempotency key. Exactly one event per identical command.
- Evidence attachment on this surface is **bounded by the vendor decision in `Q-OPS-001`**; this screen defines the requirement and stops at the transfer boundary.
- Missing-data behaviour: where the governing terms cannot be read, recording is withheld and the screen says why, because an event with no governing snapshot cannot be validated.

**State**

- Lifecycle statuses visible: `REPORTED_UNCONFIRMED`
- Permission model: Patient, or guardian with financial-action authority. **Payer identity derives from the authenticated context, not from a field.**

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Record this payment | primary | the fields are complete and no commit is in flight | DISABLED while a commit is in flight, with the submission state bound to the control |
| Cancel | secondary | always before commit | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-FINANCE-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-FINANCE-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.
- No copy, control or affordance on this screen implies that UberTib collects, holds, transfers, captures, settles or refunds money. UberTib V1 performs no direct money movement and every amount here is a record of what the parties agreed or asserted between themselves.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-FINANCE-001` | a financial event that conflicts with the governing terms or the existing event history | `TXT-ERR-FINANCE-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is case and terms context, fields, consequence, action. Each field carries a persistent visible label.
- Announcements: The committed event announces and focus moves to the appended event in the timeline.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- Fields stack in the reading column; the amount field and its currency stay adjacent at every text size.

**Loading and failure**

| State | Behaviour on this screen |
|---|---|
| `loading-initial` | Skeleton at content height through `WGT-PLATFORM-001`. No empty state and no action is rendered while the first read is in flight. |
| `loading-refresh` | Content stays visible and interactive. A refresh never steals focus and never scrolls the surface. |
| `partial` | The region that loaded stays interactive; the region that failed names itself and offers retry in place. Never presented as complete. |
| `stale` | `CMP-PLATFORM-010` `stale` with the as-of time. Committing actions are withdrawn; read actions remain. |
| `error-fetch` | `CMP-PLATFORM-010` `fetch-failure`. Last known safe context preserved, retry in place, entered input untouched. |
| `error-permission` | `CMP-PLATFORM-010` `permission-denied`. Wins over every other state, no retry, affected actions removed structurally rather than disabled. |
| `success` | Content. |
| `offline / unstable` | Last known data with its as-of time, the condition stated per `TXT-PLATFORM-009`, and committing actions withdrawn unless the command is idempotent-resumable. |

Not applicable here: `empty-no-data` `empty-filtered`. A single-command form has no list, no filter and no independent scope surface.

**Acceptance criteria**

1. A mismatch against the governing terms reads as a mismatch, **never as a failed payment**, because no payment was attempted.
2. Exactly one event is created per identical command.
3. Payer identity is never a field.
4. No copy, control or affordance on this screen implies that UberTib collects, holds, transfers, captures, settles or refunds money. UberTib V1 performs no direct money movement and every amount here is a record of what the parties agreed or asserted between themselves.

**Traceability.** `SCR-FINANCE-003` · `WF-FINANCE-003` · flows `FLOW-FINANCE-002` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-010` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-FINANCE-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-AUDIT-001` `ERR-FINANCE-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` · requirements `FR-FINANCE-002`, `FR-FINANCE-005` · contract `API-FINANCE-002`

---

### SCR-FINANCE-004 — Financial event response

**Wireframe:** `WF-FINANCE-004` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** form · **Density:** `reading` · **Classification:** New
**Actors:** Patient as authorized counterparty; Guardian with financial action authority
**Flows:** `FLOW-FINANCE-004`
**Requirements:** `FR-FINANCE-003`, `FR-FINANCE-005`
**Data / action contract:** `API-FINANCE-003`

**Purpose.** Let the patient confirm or dispute a financial event the clinic asserted. Success is an appended response event. It exists because a response appends and never edits the original assertion.

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | The asserted event: what, by whom, when, how much. |
| Required input | Confirm or dispute, with the reason required on dispute. |
| Validation and consequence | That disputing routes to finance review. |
| Action | Commit the response. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) `CMP-PLATFORM-014` (`irreversible`) |
| Patterns | `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-FINANCE-003` | `200` with original event ID plus newly appended response event and derived status. | `decision: "confirm" \| "dispute"`, `reason: string\|null` required for dispute, `evidence_ids: string[]\|null`; idempotency key required. |

- `API-FINANCE-003` appends the response with an idempotency key. It **never edits the original assertion**. It also handles refund-execution responses.
- Missing-data behaviour: where the original assertion could not be read, no response control is offered.

**State**

- Lifecycle statuses visible: `REPORTED_UNCONFIRMED` before, `CONFIRMED` or `DISPUTED` after
- Permission model: Patient as authorized counterparty, or guardian with financial-action authority.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Confirm this event | primary | the event awaits this patient as counterparty | absent once a response has been appended |
| Dispute this event | destructive | the event awaits this patient as counterparty | absent once a response has been appended. A reason is required |
| Back to the timeline | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-FINANCE-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-FINANCE-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.
- No copy, control or affordance on this screen implies that UberTib collects, holds, transfers, captures, settles or refunds money. UberTib V1 performs no direct money movement and every amount here is a record of what the parties agreed or asserted between themselves.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-FINANCE-001` | a financial event that conflicts with the governing terms or the existing event history | `TXT-ERR-FINANCE-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is the asserted event, the two responses, the consequence of disputing, the action. The dispute reason field carries a persistent visible label.
- Announcements: The appended response announces and focus moves to the updated event.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- The asserted event and the response controls stay in one reading column with the consequence statement between them.

**Loading and failure**

| State | Behaviour on this screen |
|---|---|
| `loading-initial` | Skeleton at content height through `WGT-PLATFORM-001`. No empty state and no action is rendered while the first read is in flight. |
| `loading-refresh` | Content stays visible and interactive. A refresh never steals focus and never scrolls the surface. |
| `partial` | The region that loaded stays interactive; the region that failed names itself and offers retry in place. Never presented as complete. |
| `stale` | `CMP-PLATFORM-010` `stale` with the as-of time. Committing actions are withdrawn; read actions remain. |
| `error-fetch` | `CMP-PLATFORM-010` `fetch-failure`. Last known safe context preserved, retry in place, entered input untouched. |
| `error-permission` | `CMP-PLATFORM-010` `permission-denied`. Wins over every other state, no retry, affected actions removed structurally rather than disabled. |
| `success` | Content. |
| `offline / unstable` | Last known data with its as-of time, the condition stated per `TXT-PLATFORM-009`, and committing actions withdrawn unless the command is idempotent-resumable. |

Not applicable here: `empty-no-data` `empty-filtered`. A single-event response has no list and no filter.

**Acceptance criteria**

1. The consequence of disputing is evident before the action commits.
2. A dispute requires a reason and appends rather than editing.
3. The original assertion remains readable after any response.
4. No copy, control or affordance on this screen implies that UberTib collects, holds, transfers, captures, settles or refunds money. UberTib V1 performs no direct money movement and every amount here is a record of what the parties agreed or asserted between themselves.

**Traceability.** `SCR-FINANCE-004` · `WF-FINANCE-004` · flows `FLOW-FINANCE-004` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` `CMP-PLATFORM-014` · patterns `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-FINANCE-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-AUDIT-001` `ERR-FINANCE-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` `ERR-PLATFORM-002` · requirements `FR-FINANCE-003`, `FR-FINANCE-005` · contract `API-FINANCE-003`

---

### SCR-FINANCE-005 — Report refund execution

**Wireframe:** `WF-FINANCE-005` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** form · **Density:** `reading` · **Classification:** New
**Actors:** Patient as authorized asserting party; Guardian with financial action authority
**Flows:** `FLOW-FINANCE-006` `FLOW-FINANCE-008`
**Requirements:** `FR-FINANCE-004`, `FR-FINANCE-007`
**Data / action contract:** `API-FINANCE-004`

**Purpose.** Let the patient assert that an approved refund was executed outside the platform. Success is an appended assertion awaiting the counterparty. It exists because entitlement, decision and execution are three separate things and only the parties can perform the third.

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | The approved refund decision this references, with its exact amount and currency. |
| Required input | The assertion fields. |
| Validation and consequence | That this remains an assertion until the counterparty responds. |
| Action | Record the execution. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) `CMP-PLATFORM-014` (`irreversible`) |
| Patterns | `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-FINANCE-004` | `201` with unconfirmed external execution event. | `approved_refund_decision_id: string`, `amount: decimal`, `currency: string`, `occurred_at: datetime`, `evidence_ids: string[]`; idempotency key required. |

- `API-FINANCE-004` references the approved refund decision with its exact amount and currency, and requires an idempotency key.
- Missing-data behaviour: where the approved decision cannot be read, the assertion is withheld, because an execution with no entitlement behind it is not recordable.

**State**

- Lifecycle statuses visible: `REPORTED_UNCONFIRMED`
- Permission model: Patient as authorized asserting party, or guardian with financial-action authority.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Record the refund execution | primary | an approved refund decision exists and no commit is in flight | absent where no approved decision exists |
| Cancel | secondary | always before commit | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-FINANCE-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-FINANCE-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.
- No copy, control or affordance on this screen implies that UberTib collects, holds, transfers, captures, settles or refunds money. UberTib V1 performs no direct money movement and every amount here is a record of what the parties agreed or asserted between themselves.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-FINANCE-001` | a financial event that conflicts with the governing terms or the existing event history | `TXT-ERR-FINANCE-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is the referenced decision, the assertion fields, the consequence, the action.
- Announcements: The appended assertion announces and focus moves to it in the timeline.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- One reading column with the referenced amount adjacent to the asserted one.

**Loading and failure**

| State | Behaviour on this screen |
|---|---|
| `loading-initial` | Skeleton at content height through `WGT-PLATFORM-001`. No empty state and no action is rendered while the first read is in flight. |
| `loading-refresh` | Content stays visible and interactive. A refresh never steals focus and never scrolls the surface. |
| `partial` | The region that loaded stays interactive; the region that failed names itself and offers retry in place. Never presented as complete. |
| `stale` | `CMP-PLATFORM-010` `stale` with the as-of time. Committing actions are withdrawn; read actions remain. |
| `error-fetch` | `CMP-PLATFORM-010` `fetch-failure`. Last known safe context preserved, retry in place, entered input untouched. |
| `error-permission` | `CMP-PLATFORM-010` `permission-denied`. Wins over every other state, no retry, affected actions removed structurally rather than disabled. |
| `success` | Content. |
| `offline / unstable` | Last known data with its as-of time, the condition stated per `TXT-PLATFORM-009`, and committing actions withdrawn unless the command is idempotent-resumable. |

Not applicable here: `empty-no-data` `empty-filtered`. A single-command form has no list and no filter.

**Acceptance criteria**

1. The assertion references an approved refund decision with its exact amount and currency.
2. It remains an assertion until the counterparty responds, and the screen says so.
3. **No platform refund is executed and no copy suggests otherwise.**
4. No copy, control or affordance on this screen implies that UberTib collects, holds, transfers, captures, settles or refunds money. UberTib V1 performs no direct money movement and every amount here is a record of what the parties agreed or asserted between themselves.

**Traceability.** `SCR-FINANCE-005` · `WF-FINANCE-005` · flows `FLOW-FINANCE-006` `FLOW-FINANCE-008` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` `CMP-PLATFORM-014` · patterns `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-FINANCE-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-AUDIT-001` `ERR-FINANCE-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` · requirements `FR-FINANCE-004`, `FR-FINANCE-007` · contract `API-FINANCE-004`

---

### SCR-REVIEWS-001 — Reviewable experiences

**Wireframe:** `WF-REVIEWS-001` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** detail · **Density:** `reading` · **Classification:** New
**Actors:** Patient; Guardian with review authority
**Flows:** `FLOW-REVIEWS-001` `FLOW-REVIEWS-005`
**Requirements:** `FR-REVIEWS-001`
**Data / action contract:** `API-CLINICAL-001`

**Purpose.** List the verified completed experiences the patient may review. Success is the patient reaching the review form for the right experience. It exists because listing only reviewable experiences **structurally prevents a second active review** rather than relying on a validation message.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | Which patient the experiences belong to. |
| Primary facts | One entry per verified completed experience with no active review, and its remaining review window. |
| Related history | Where a review already exists, the route to it. |
| Action | Write a review. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`patient`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-CLINICAL-001` | `200` with safe case status, service/provider/branch summary, current accepted-plan version if any, next follow-up, missing patient-action items, and links/IDs for authorized subresources. | none — this surface issues no command against it |

- `API-CLINICAL-001` supplies the completed experiences; review eligibility and the remaining window come with them.
- Missing-data behaviour: an experience whose window could not be read is not offered for review, because offering a review that will be refused wastes the patient's effort.

**State**

- Lifecycle statuses visible: eligibility for review; review window
- Permission model: Patient, or guardian with review authority.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Write a review | primary | the experience is verified, complete and has no active review | the entry is absent from this list entirely when it is not reviewable |
| Open my existing review | secondary | a review exists for that experience | absent where none does |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-REVIEWS-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-REVIEWS-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the status and identity region.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is subject context, reviewable list. Each entry announces its experience and its remaining window.
- Announcements: A window entering its approaching state announces politely.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- One experience per reading-column block with the remaining window adjacent.

**Loading and failure**

| State | Behaviour on this screen |
|---|---|
| `loading-initial` | Skeleton at content height through `WGT-PLATFORM-001`. No empty state and no action is rendered while the first read is in flight. |
| `loading-refresh` | Content stays visible and interactive. A refresh never steals focus and never scrolls the surface. |
| `partial` | The region that loaded stays interactive; the region that failed names itself and offers retry in place. Never presented as complete. |
| `stale` | `CMP-PLATFORM-010` `stale` with the as-of time. Committing actions are withdrawn; read actions remain. |
| `error-fetch` | `CMP-PLATFORM-010` `fetch-failure`. Last known safe context preserved, retry in place, entered input untouched. |
| `error-permission` | `CMP-PLATFORM-010` `permission-denied`. Wins over every other state, no retry, affected actions removed structurally rather than disabled. |
| `success` | Content. |
| `offline / unstable` | Last known data with its as-of time, the condition stated per `TXT-PLATFORM-009`, and committing actions withdrawn unless the command is idempotent-resumable. |

Not applicable here: `empty-no-data` `empty-filtered`. The reviewable set is scoped rather than filtered.

**Acceptance criteria**

1. Only verified completed experiences with no active review appear here.
2. The remaining review window is visible before the patient invests effort.
3. An empty list reads as nothing to review rather than as a failure.

**Traceability.** `SCR-REVIEWS-001` · `WF-REVIEWS-001` · flows `FLOW-REVIEWS-001` `FLOW-REVIEWS-005` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` · components `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-REVIEWS-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` · requirements `FR-REVIEWS-001` · contract `API-CLINICAL-001`

---

### SCR-REVIEWS-002 — Submit review

**Wireframe:** `WF-REVIEWS-002` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** form · **Density:** `reading` · **Classification:** New
**Actors:** Patient; Guardian with review authority
**Flows:** `FLOW-REVIEWS-001`
**Requirements:** `FR-REVIEWS-001`
**Data / action contract:** `API-REVIEWS-001`

**Purpose.** Let the patient submit a verified review. Success is one active review tied to a verified experience. It exists so the patient understands that the review is tied to a verified experience and that the rating is independent of scientific eligibility.

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | Which experience is being reviewed. |
| Required input | The rating and the text. |
| Validation and consequence | That the review is tied to a verified experience and is independent of eligibility. |
| Action | Submit. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) `CMP-PLATFORM-014` (`irreversible`) |
| Patterns | `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-REVIEWS-001` | `201` with review ID, verified-experience linkage, and publication/moderation state. | Review rating/content fields defined by product policy; idempotency key required. |

- `API-REVIEWS-001` submits the review with an idempotency key.
- Missing-data behaviour: where the experience context cannot be read, submission is withheld rather than sent and refused.

**State**

- Lifecycle statuses visible: `ACTIVE` on success
- Permission model: Patient, or guardian with review authority.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Submit the review | primary | the experience is eligible and no commit is in flight | DISABLED while a commit is in flight |
| Cancel | secondary | always before commit | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-REVIEWS-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-REVIEWS-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-REVIEWS-001` | a review or appeal that is ineligible, already active, or outside its window | `TXT-ERR-REVIEWS-001` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is experience context, rating, text, consequence, action. Rating and text each carry a persistent visible label.
- Announcements: The committed review announces and focus moves to the resulting review.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- Rating and text stack in the reading column; the submit control stays reachable above the on-screen keyboard.

**Loading and failure**

| State | Behaviour on this screen |
|---|---|
| `loading-initial` | Skeleton at content height through `WGT-PLATFORM-001`. No empty state and no action is rendered while the first read is in flight. |
| `loading-refresh` | Content stays visible and interactive. A refresh never steals focus and never scrolls the surface. |
| `partial` | The region that loaded stays interactive; the region that failed names itself and offers retry in place. Never presented as complete. |
| `stale` | `CMP-PLATFORM-010` `stale` with the as-of time. Committing actions are withdrawn; read actions remain. |
| `error-fetch` | `CMP-PLATFORM-010` `fetch-failure`. Last known safe context preserved, retry in place, entered input untouched. |
| `error-permission` | `CMP-PLATFORM-010` `permission-denied`. Wins over every other state, no retry, affected actions removed structurally rather than disabled. |
| `success` | Content. |
| `offline / unstable` | Last known data with its as-of time, the condition stated per `TXT-PLATFORM-009`, and committing actions withdrawn unless the command is idempotent-resumable. |

Not applicable here: `empty-no-data` `empty-filtered`. A single-command form has no list and no filter.

**Acceptance criteria**

1. The screen conveys that the review is tied to a verified experience.
2. The screen conveys that the rating is independent of scientific eligibility.
3. Ineligible experience, an existing active review and an expired window each produce a distinct recovery from one error family.
4. A retry after a failed submit reuses the original idempotency key.

**Traceability.** `SCR-REVIEWS-002` · `WF-REVIEWS-002` · flows `FLOW-REVIEWS-001` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` `CMP-PLATFORM-014` · patterns `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-REVIEWS-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-AUDIT-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` `ERR-REVIEWS-001` · requirements `FR-REVIEWS-001` · contract `API-REVIEWS-001`

---
