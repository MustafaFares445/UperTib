# Screen Specifications — Patient app (3 of 3)

**Phase:** UX 4 — Widget and Screen Specifications
**Platform:** Patient app · Profile C · React Native
**Schema:** `PHASE_04_IMPLEMENTATION_PLAN.md` section 6. **Widgets:** `WIDGET_SPECS.md`. **Map:** `SCREEN_SPEC_MAP.md`.

Every block carries the same thirteen sections in the same order. A section that does not apply says so and why.

---
### SCR-REVIEWS-003 — My review

**Wireframe:** `WF-REVIEWS-003` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** detail · **Density:** `reading` · **Classification:** New
**Actors:** Patient; Guardian within grant scope
**Flows:** `FLOW-CLINICAL-008` `FLOW-REVIEWS-001`
**Requirements:** `FR-REVIEWS-001`, `FR-REVIEWS-002`
**Data / action contract:** `API-REVIEWS-001`

**Purpose.** Show the patient their own review and its current state. Success is the patient understanding whether their review is active and, if it was retired, why. It exists because a retirement must be shown with its governed reason rather than as a silent disappearance.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The review, its state, and the experience it belongs to. |
| Primary facts | The rating and text as submitted. |
| Related history | Any retirement decision with its governed reason, and any appeal and its state. |
| Action | Appeal, where policy grants the patient that action. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-006` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`patient`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-006` (`reading-list`) `CMP-PLATFORM-008` (`record`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-013` (`decided-by-person`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-REVIEWS-001` | `201` with review ID, verified-experience linkage, and publication/moderation state. | Review rating/content fields defined by product policy; idempotency key required. |

- `API-REVIEWS-001` supplies the review and its state; appeal state comes with it.
- Missing-data behaviour: a retirement whose reason could not be read states that the reason is unavailable rather than rendering the retirement without one.

**State**

- Lifecycle statuses visible: `ACTIVE`, `RETIRED`; appeal `SUBMITTED`, `DECIDED`
- Permission model: Patient acting for themselves, or a guardian acting inside an active grant. Under representation both the acting and the subject identity are visible, and every request is re-evaluated server-side; switching subject grants nothing. Appeal additionally requires that policy grants the patient that action.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Appeal this decision | primary | policy grants the patient an appeal and the window is open | absent where policy grants the patient no appeal, and UNAVAILABLE with the window stated once it closes |
| Back to my experiences | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-REVIEWS-001` `TXT-STATE-REVIEWS-002`
- Lifecycle labels for every status above are owned by `TXT-STATE-REVIEWS-001` `TXT-STATE-REVIEWS-002` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-REVIEWS-001` | a review or appeal that is ineligible, already active, or outside its window | `TXT-ERR-REVIEWS-001` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the status and identity region.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is review state, content, decision and reason, appeal route.
- Announcements: A state change announces politely while the screen is open.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- One reading column; the retirement reason never truncates.

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

Not applicable here: `empty-filtered`. A single-record read has no list and no filter.

**Acceptance criteria**

1. A retirement is shown with its governed reason, never as a silent disappearance.
2. The appeal route is absent where policy grants the patient no appeal.
3. The review content is never edited from this screen.

**Traceability.** `SCR-REVIEWS-003` · `WF-REVIEWS-003` · flows `FLOW-CLINICAL-008` `FLOW-REVIEWS-001` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-006` · components `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-006` `CMP-PLATFORM-008` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-013` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-REVIEWS-001` `TXT-STATE-REVIEWS-002` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-AUDIT-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` `ERR-REVIEWS-001` · requirements `FR-REVIEWS-001`, `FR-REVIEWS-002` · contract `API-REVIEWS-001`

---

### SCR-REVIEWS-004 — Review appeal

**Wireframe:** `WF-REVIEWS-004` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** detail · **Density:** `reading` · **Classification:** New
**Actors:** Authoring patient; Guardian within grant scope — per `PERMISSIONS_MATRIX` section 12
**Flows:** `FLOW-REVIEWS-005` `FLOW-REVIEWS-006`
**Requirements:** `FR-REVIEWS-002`
**Data / action contract:** `API-REVIEWS-002`

**Purpose.** Let the authoring patient appeal a review decision, having first learned what an appeal can and cannot contest. Success is a submitted appeal that is within scope. It exists because a patient who simply disagrees with the outcome needs to learn the scope before investing effort, not after submitting.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The decision being appealed. |
| Primary facts | **The scope of an appeal, stated before the patient writes anything**: eligibility, verification and policy compliance are contestable; the rating and the review text are not. |
| Related history | That an independent reviewer who did not make the original decision will decide it. |
| Action | Submit the appeal. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`patient`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) `CMP-PLATFORM-013` (`decided-by-person`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-REVIEWS-002` | `201` with appeal ID/state and deadline metadata. | `grounds: string`, `evidence_ids: string[]\|null`; idempotency key required. |

- `API-REVIEWS-002` submits the appeal with an idempotency key.
- Missing-data behaviour: where the original decision cannot be read, the appeal form is withheld, because an appeal against an unread decision cannot be scoped.

**State**

- Lifecycle statuses visible: appeal `SUBMITTED`, `DECIDED`
- Permission model: Authoring patient, or guardian within the grant scope.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Submit the appeal | primary | the appeal window is open and the actor is the authoring patient | UNAVAILABLE outside the window, with the window stated |
| Back to my review | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-REVIEWS-002`
- Lifecycle labels for every status above are owned by `TXT-STATE-REVIEWS-002` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-REVIEWS-001` | a review or appeal that is ineligible, already active, or outside its window | `TXT-ERR-REVIEWS-001` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the status and identity region.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is the decision, the scope statement, the independence statement, the form, the action. The scope statement is read before the text field is reached.
- Announcements: The committed appeal announces and focus moves to the appeal state.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- The scope statement is never collapsed behind a disclosure at any text size.

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

Not applicable here: `empty-no-data` `empty-filtered`. A single-command surface has no list and no filter.

**Acceptance criteria**

1. The scope of an appeal is stated before the patient can write anything.
2. The screen states that an independent reviewer decides it.
3. An out-of-window or unauthorized appeal produces its recovery rather than a generic failure.
4. A retry after a failed submit reuses the original idempotency key.

**Traceability.** `SCR-REVIEWS-004` · `WF-REVIEWS-004` · flows `FLOW-REVIEWS-005` `FLOW-REVIEWS-006` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` · components `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` `CMP-PLATFORM-013` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-REVIEWS-002` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-AUDIT-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` `ERR-REVIEWS-001` · requirements `FR-REVIEWS-002` · contract `API-REVIEWS-002`

---

### SCR-CLAIMS-001 — My claims

**Wireframe:** `WF-CLAIMS-001` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** list-and-detail · **Density:** `reading` · **Classification:** New
**Actors:** Patient; Guardian within grant scope
**Flows:** `FLOW-CLAIMS-001` `FLOW-CLAIMS-002` `FLOW-CLAIMS-003` `FLOW-CLAIMS-009`
**Requirements:** `FR-CLAIMS-001`, `FR-CLAIMS-002`, `FR-CLAIMS-003`
**Data / action contract:** `API-CLAIMS-003`

**Purpose.** List every claim and refund request the patient holds, with deadlines visible in the list. Success is the patient reaching the claim that needs them before its deadline lapses. It exists because these deadlines are unrecoverable once expired.

**Hierarchy** — Phase 2 priority order, not reopened: context/filter > list > selected detail > state-aware action.

| Region | Contents |
|---|---|
| Context and filter | Which patient the claims belong to, and the state filter. |
| List | One row per claim with its state, missing-evidence count, deadline and appeal eligibility. |
| Selected detail | The selected claim. |
| State-aware action | Open a claim, or start a new refund request. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-006` (`reading-list`) `CMP-PLATFORM-007` (`discovery`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-CLAIMS-003` | `200` collection of scoped claim/refund summaries, states, deadlines, missing evidence counts, decision status, appeal eligibility, and external-execution status where applicable. | none — this surface issues no command against it |

- `API-CLAIMS-003` supplies scoped claim and refund summaries with states, deadlines, missing-evidence counts, decision status, appeal eligibility and external-execution state.
- **Refund requests and protection claims share this surface but have different entitlement rules**, which the row states rather than the reader inferring.
- Missing-data behaviour: a row whose deadline did not load says the remaining time is unavailable and never renders as having none.

**State**

- Lifecycle statuses visible: all five claim states; missing evidence counts; deadlines; appeal eligibility
- Permission model: Patient acting for themselves, or a guardian acting inside an active grant. Under representation both the acting and the subject identity are visible, and every request is re-evaluated server-side; switching subject grants nothing.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Open a claim | primary | a row exists | the list is replaced by the appropriate empty state |
| Request a refund | secondary | the entitlement and window permit it | UNAVAILABLE outside the window, with the window stated |
| Filter by state | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLAIMS-001` `TXT-STATE-CLAIMS-002`
- Lifecycle labels for every status above are owned by `TXT-STATE-CLAIMS-001` `TXT-STATE-CLAIMS-002` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.
- No copy on this screen promises or implies a monetary outcome, insurance, or a guaranteed result. An approved remedy records an obligation for the parties to execute externally and moves no money.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the filter or search control where one exists, otherwise the first row.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is subject context, filter, claim list. Each row announces its state, its remaining time and its missing-evidence count.
- Announcements: A deadline entering its approaching window announces politely.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- One claim per reading-column block with the remaining time adjacent to the state.

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

1. Remaining time is in the list, not only in detail, because these deadlines are unrecoverable.
2. Refund requests and protection claims are distinguishable in the list.
3. Filtered-empty and genuinely-empty read differently.
4. No copy on this screen promises or implies a monetary outcome, insurance, or a guaranteed result. An approved remedy records an obligation for the parties to execute externally and moves no money.

**Traceability.** `SCR-CLAIMS-001` · `WF-CLAIMS-001` · flows `FLOW-CLAIMS-001` `FLOW-CLAIMS-002` `FLOW-CLAIMS-003` `FLOW-CLAIMS-009` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-006` `CMP-PLATFORM-007` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLAIMS-001` `TXT-STATE-CLAIMS-002` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` · requirements `FR-CLAIMS-001`, `FR-CLAIMS-002`, `FR-CLAIMS-003` · contract `API-CLAIMS-003`

---

### SCR-CLAIMS-002 — Refund request

**Wireframe:** `WF-CLAIMS-002` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** form · **Density:** `reading` · **Classification:** New
**Actors:** Patient; Guardian with claim authority
**Flows:** `FLOW-CLAIMS-001`
**Requirements:** `FR-CLAIMS-001`, `FR-FINANCE-007`
**Data / action contract:** `API-CLAIMS-001`

**Purpose.** Let the patient request a refund against the accepted financial terms. Success is a submitted request with its response deadline visible. It exists because approval can record an amount due for external execution and never a platform payment, and the patient must know that at submission.

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | The case and the governing accepted terms snapshot. |
| Required input | The request fields and the evidence the policy requires. |
| Validation and consequence | **That an approval records an amount due for external execution, not a platform payment**, stated at submission rather than at decision. |
| Action | Submit the request. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) `CMP-PLATFORM-014` (`irreversible`) |
| Patterns | `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-CLAIMS-001` | `201` with request/claim ID, initial state, governing terms/policy snapshot IDs, and response deadline metadata. | `requested_amount: decimal`, `currency: string`, `reason: string`, `occurrence_context: string\|null`, `evidence_ids: string[]`; idempotency key required. |

- `API-CLAIMS-001` validates the request against the accepted financial terms snapshot and the deadline policy, with an idempotency key.
- Missing-data behaviour: where the governing snapshot cannot be read, submission is withheld and the screen says why.

**State**

- Lifecycle statuses visible: `SUBMITTED`; response deadline
- Permission model: Patient, or guardian with claim authority.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Submit the request | primary | the entitlement and window permit it and no commit is in flight | UNAVAILABLE outside the policy window, with the window stated |
| Cancel | secondary | always before commit | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLAIMS-001` `TXT-STATE-CLAIMS-002`
- Lifecycle labels for every status above are owned by `TXT-STATE-CLAIMS-001` `TXT-STATE-CLAIMS-002` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.
- No copy on this screen promises or implies a monetary outcome, insurance, or a guaranteed result. An approved remedy records an obligation for the parties to execute externally and moves no money.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-CLAIMS-001` | a claim, refund request or appeal that is ineligible or outside its policy window | `TXT-ERR-CLAIMS-001` |
| `ERR-CLAIMS-002` | a claim submission or response whose required evidence is incomplete or invalid | `TXT-ERR-CLAIMS-002` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is case and terms context, fields, the external-execution statement, the action.
- Announcements: The committed request announces and focus moves to the resulting claim.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- The external-execution statement is never collapsed behind a disclosure.

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

1. The external-execution boundary is stated at submission, not at decision.
2. Ineligibility, an expired window and incomplete evidence produce three distinct recoveries.
3. A retry after a failed submit reuses the original idempotency key.
4. No copy on this screen promises or implies a monetary outcome, insurance, or a guaranteed result. An approved remedy records an obligation for the parties to execute externally and moves no money.

**Traceability.** `SCR-CLAIMS-002` · `WF-CLAIMS-002` · flows `FLOW-CLAIMS-001` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` `CMP-PLATFORM-014` · patterns `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLAIMS-001` `TXT-STATE-CLAIMS-002` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-AUDIT-001` `ERR-CLAIMS-001` `ERR-CLAIMS-002` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` · requirements `FR-CLAIMS-001`, `FR-FINANCE-007` · contract `API-CLAIMS-001`

---

### SCR-CLAIMS-003 — Protection claim

**Wireframe:** `WF-CLAIMS-003` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** detail · **Density:** `reading` · **Classification:** New
**Actors:** Patient; Guardian with claim authority
**Flows:** `FLOW-CLAIMS-002`
**Requirements:** `FR-CLAIMS-002`, `FR-ELIG-010`
**Data / action contract:** `API-CLAIMS-002`

**Purpose.** Let the patient raise a protection claim where the immutable accepted terms contain applicable active protection. Success is a submitted claim with its evidence requirements visible. **Entitlement gates entry** rather than failing at submission.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The case and the applicable active protection from the accepted terms. |
| Primary facts | The evidence requirements and their per-item states. |
| Related history | The deadlines that govern the claim. |
| Action | Submit the claim. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-CLAIMS-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-008` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`patient`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-006` (`reading-list`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) `CMP-PLATFORM-012` (`intake`) |
| Patterns | `IX-BOOKING-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-006` `IX-PLATFORM-007` `IX-PLATFORM-009` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-CLAIMS-002` | `201` with claim ID, state, governing protection/policy snapshot reference, evidence status, and deadlines. | `claim_type: string`, `requested_remedy: string`, `narrative: string`, `evidence_ids: string[]`; idempotency key required. |

- `API-CLAIMS-002` submits the claim; `API-PLATFORM-001` carries the evidence transfer.
- **Evidence supply is bounded by the vendor decision in `Q-OPS-001`**; this screen defines the requirement, the per-item status and the recovery, and stops at the transfer boundary.
- Missing-data behaviour: a requirement whose state did not load is never counted as satisfied, and submission stays unavailable naming it.

**State**

- Lifecycle statuses visible: `SUBMITTED`; evidence status; deadlines
- Permission model: Patient, or guardian with claim authority. **Reachable only when applicable active protection exists in the immutable accepted terms.**

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Submit the claim | primary | entitlement exists and the required evidence is complete | UNAVAILABLE with the outstanding requirement named while evidence is incomplete |
| Supply evidence | primary | a requirement is outstanding | absent once every requirement is satisfied |
| Cancel | secondary | always before commit | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLAIMS-001` `TXT-STATE-CLAIMS-002` `TXT-STATE-PLATFORM-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-CLAIMS-001` `TXT-STATE-CLAIMS-002` `TXT-STATE-PLATFORM-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.
- No copy on this screen promises or implies a monetary outcome, insurance, or a guaranteed result. An approved remedy records an obligation for the parties to execute externally and moves no money.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-CLAIMS-001` | a claim, refund request or appeal that is ineligible or outside its policy window | `TXT-ERR-CLAIMS-001` |
| `ERR-CLAIMS-002` | a claim submission or response whose required evidence is incomplete or invalid | `TXT-ERR-CLAIMS-002` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-034` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the status and identity region.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is protection entitlement, requirements, deadlines, action. Each requirement announces its state and its reason.
- Announcements: Evidence progress announces at intervals, not continuously. A retryable transfer failure announces politely and distinctly from a rejection.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- Requirements stack in the reading column with each state adjacent to its next action.

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

Not applicable here: `empty-filtered`. The requirement set is governed rather than filtered.

**Acceptance criteria**

1. The screen is unreachable without applicable active protection in the accepted terms.
2. A retryable transfer failure and an authoritative rejection are distinct in wording, next action and focus destination.
3. A quarantined item never satisfies a requirement.
4. No copy on this screen promises or implies a monetary outcome, insurance, or a guaranteed result. An approved remedy records an obligation for the parties to execute externally and moves no money.

**Traceability.** `SCR-CLAIMS-003` · `WF-CLAIMS-003` · flows `FLOW-CLAIMS-002` · widgets `WGT-CLAIMS-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-008` · components `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-006` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` `CMP-PLATFORM-012` · patterns `IX-BOOKING-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-006` `IX-PLATFORM-007` `IX-PLATFORM-009` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLAIMS-001` `TXT-STATE-CLAIMS-002` `TXT-STATE-PLATFORM-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-034` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-AUDIT-001` `ERR-CLAIMS-001` `ERR-CLAIMS-002` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` · requirements `FR-CLAIMS-002`, `FR-ELIG-010` · contract `API-CLAIMS-002`

---

### SCR-CLAIMS-004 — Claim detail

**Wireframe:** `WF-CLAIMS-004` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** detail · **Density:** `reading` · **Classification:** New
**Actors:** Patient; Guardian within grant scope
**Flows:** `FLOW-CLAIMS-001` `FLOW-CLAIMS-002` `FLOW-CLAIMS-003` `FLOW-CLAIMS-007` `FLOW-CLINICAL-008` `FLOW-FINANCE-006` `FLOW-PLATFORM-001`
**Requirements:** `FR-CLAIMS-003`, `FR-CLAIMS-004`, `FR-CLAIMS-005`
**Data / action contract:** `API-CLAIMS-004`

**Purpose.** Show one claim authoritatively, including its decision, its evidence and its deadline history. Success is the patient understanding where the claim stands and what remains. The decision is a section rather than a separate screen because the contract returns it that way.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The claim state, the case and the governing terms. |
| Primary facts | Evidence items, individually distinguishable as missing, rejected, expired or accepted, each with its reason. |
| Related history | The effective deadline and its history, plus the decision with its accountable reviewer. |
| Action | Appeal, or report a refund execution after an approved refund. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-CLAIMS-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-006` |
| Components | `CMP-ELIG-002` (`governed display mode from the provider price fact`) `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`patient`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-006` (`reading-list`) `CMP-PLATFORM-008` (`record`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-013` (`decided-by-person`) |
| Patterns | `IX-BOOKING-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-006` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-CLAIMS-004` | `200` with claim/refund type, narrative, requested remedy/amount where applicable, evidence states, deadlines and extensions, reasoned decision when visible, appeal status, and external-action status. Sensitive reviewer-only findings remain filtered. | none — this surface issues no command against it |

- `API-CLAIMS-004` supplies the claim detail with its decision as a section, the evidence item states, the original and effective deadlines, and the appeal status.
- **Pauses and extensions append rather than replace**, so both the original and the effective deadline are shown.
- Missing-data behaviour: an evidence item whose state did not load is not counted as accepted, and the outstanding count says it is provisional.

**State**

- Lifecycle statuses visible: all five claim states; evidence item states; original and effective deadlines; decision; appeal status
- Permission model: Patient acting for themselves, or a guardian acting inside an active grant. Under representation both the acting and the subject identity are visible, and every request is re-evaluated server-side; switching subject grants nothing. **Reviewer-only findings are filtered out of this projection**, server-side.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Appeal the decision | primary | a decision exists and the appeal window is open | UNAVAILABLE outside the window; **an expired appeal window is not retryable** |
| Report a refund execution | primary | an approved refund decision exists | absent until one does |
| Supply outstanding evidence | secondary | a requirement is outstanding and the deadline has not lapsed | UNAVAILABLE once the deadline lapses |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-013` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLAIMS-001` `TXT-STATE-CLAIMS-002`
- Lifecycle labels for every status above are owned by `TXT-STATE-CLAIMS-001` `TXT-STATE-CLAIMS-002` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.
- No copy on this screen promises or implies a monetary outcome, insurance, or a guaranteed result. An approved remedy records an obligation for the parties to execute externally and moves no money.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-FINANCE-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the status and identity region.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is claim state, evidence, deadlines and decision, actions. The deadline pair announces as original and effective.
- Announcements: A decision arriving announces politely. A deadline entering its approaching window announces.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- The deadline pair sits above the evidence list in the reading column; neither deadline truncates.

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

Not applicable here: `empty-filtered`. A single-claim detail has no list-level filter.

**Acceptance criteria**

1. Missing, rejected, expired and accepted evidence are individually distinguishable with reasons.
2. Both the original and the effective deadline are visible, with the events that moved it.
3. A decision names the accountable human reviewer and any external action due.
4. Reviewer-only findings are absent from the projection.
5. No copy on this screen promises or implies a monetary outcome, insurance, or a guaranteed result. An approved remedy records an obligation for the parties to execute externally and moves no money.

**Traceability.** `SCR-CLAIMS-004` · `WF-CLAIMS-004` · flows `FLOW-CLAIMS-001` `FLOW-CLAIMS-002` `FLOW-CLAIMS-003` `FLOW-CLAIMS-007` `FLOW-CLINICAL-008` `FLOW-FINANCE-006` `FLOW-PLATFORM-001` · widgets `WGT-CLAIMS-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-006` · components `CMP-ELIG-002` `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-006` `CMP-PLATFORM-008` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-013` · patterns `IX-BOOKING-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-006` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-013` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLAIMS-001` `TXT-STATE-CLAIMS-002` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-FINANCE-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` · requirements `FR-CLAIMS-003`, `FR-CLAIMS-004`, `FR-CLAIMS-005` · contract `API-CLAIMS-004`

---

### SCR-CLAIMS-005 — Claim appeal

**Wireframe:** `WF-CLAIMS-005` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** detail · **Density:** `reading` · **Classification:** New
**Actors:** Patient; Guardian with claim authority
**Flows:** `FLOW-CLAIMS-007` `FLOW-CLAIMS-009`
**Requirements:** `FR-CLAIMS-005`
**Data / action contract:** `API-CLAIMS-005`

**Purpose.** Let the patient appeal a claim decision under the policy snapshot that governed the original decision. Success is a submitted appeal within the historical window. It exists because the window is historical rather than current, and the original decision stays intact and visible.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The original decision, which remains intact and visible. |
| Primary facts | The governing policy snapshot and the historical appeal window it defines. |
| Related history | The appeal fields. |
| Action | Submit the appeal. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`patient`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) `CMP-PLATFORM-013` (`decided-by-person`) `CMP-PLATFORM-014` (`irreversible`) |
| Patterns | `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-CLAIMS-005` | `201` with appeal ID/state, governing original decision/policy snapshot, assigned review scope (without exposing unnecessary reviewer identity), and deadline metadata. | `grounds: string`, `evidence_ids: string[]\|null`; idempotency key required. |

- `API-CLAIMS-005` submits the appeal with an idempotency key, against the policy snapshot that governed the original decision.
- Missing-data behaviour: where the governing snapshot cannot be read, the window cannot be computed and the appeal form is withheld with that reason.

**State**

- Lifecycle statuses visible: appeal `SUBMITTED`, `UNDER_REVIEW`, `DECIDED`
- Permission model: Patient, or guardian with claim authority.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Submit the appeal | primary | the historical appeal window is open | UNAVAILABLE once the window has expired, and **not retryable** |
| Back to the claim | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLAIMS-001` `TXT-STATE-CLAIMS-002` `TXT-STATE-REVIEWS-002`
- Lifecycle labels for every status above are owned by `TXT-STATE-CLAIMS-001` `TXT-STATE-CLAIMS-002` `TXT-STATE-REVIEWS-002` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.
- No copy on this screen promises or implies a monetary outcome, insurance, or a guaranteed result. An approved remedy records an obligation for the parties to execute externally and moves no money.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-CLAIMS-001` | a claim, refund request or appeal that is ineligible or outside its policy window | `TXT-ERR-CLAIMS-001` |
| `ERR-CLAIMS-002` | a claim submission or response whose required evidence is incomplete or invalid | `TXT-ERR-CLAIMS-002` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the status and identity region.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is the original decision, the governing window, the form, the action.
- Announcements: The committed appeal announces and focus moves to the appeal state.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- The original decision stays readable above the form in the reading column.

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

Not applicable here: `empty-no-data` `empty-filtered`. A single-command surface has no list and no filter.

**Acceptance criteria**

1. The appeal window comes from the policy snapshot governing the original decision, not from current configuration.
2. The original decision remains intact and visible throughout.
3. An expired appeal window presents as not retryable.
4. No copy on this screen promises or implies a monetary outcome, insurance, or a guaranteed result. An approved remedy records an obligation for the parties to execute externally and moves no money.

**Traceability.** `SCR-CLAIMS-005` · `WF-CLAIMS-005` · flows `FLOW-CLAIMS-007` `FLOW-CLAIMS-009` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` · components `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` `CMP-PLATFORM-013` `CMP-PLATFORM-014` · patterns `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLAIMS-001` `TXT-STATE-CLAIMS-002` `TXT-STATE-REVIEWS-002` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-AUDIT-001` `ERR-CLAIMS-001` `ERR-CLAIMS-002` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` `ERR-PLATFORM-002` · requirements `FR-CLAIMS-005` · contract `API-CLAIMS-005`

---

### SCR-IDENTITY-004 — Patient profile

**Wireframe:** `WF-IDENTITY-004` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** detail · **Density:** `reading` · **Classification:** New
**Actors:** Patient; Guardian
**Flows:** `FLOW-IDENTITY-002`
**Requirements:** `FR-IDENTITY-002`, `FR-IDENTITY-003`
**Data / action contract:** `API-IDENTITY-003`

**Purpose.** Show the patient their own safe identity fields and the representation context in force. Success is the patient confirming who they are in the system. It exists because an active representation context must be evident here as well as in global chrome.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The patient identity and the verified contact state. |
| Primary facts | The active representation context where one is in force. |
| Related history | Routes to family and representation, and to pending submissions. |
| Action | No committing action; this surface reads. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`patient`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-IDENTITY-003` | `200` with safe identity/profile fields and active representation context if one is explicitly selected; sensitive authorization internals are not exposed. | None. |

- `API-IDENTITY-003` supplies the current patient identity and the active representation context.
- Missing-data behaviour: an unresolved representation context renders as unknown rather than as absent, because absent reads as acting for oneself.

**State**

- Lifecycle statuses visible: verified contact state; active representation context
- Permission model: Patient, or guardian. **Safe identity fields only** — no authorization internals are in this projection.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Open family and representation | primary | always | never unavailable |
| Open pending submissions | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011`
- No status this screen shows belongs to a governed lifecycle machine, so it binds no `TXT-STATE-*` rule. What the state section lists is descriptive condition, not a status chip drawn from a state machine.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the status and identity region.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is identity, representation context, routes.
- Announcements: A representation context change announces politely.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- One reading column; the representation context stays adjacent to the identity.

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

Not applicable here: `empty-no-data` `empty-filtered`. A single-record read has no list and no filter.

**Acceptance criteria**

1. No authorization internal appears in the projection or on the screen.
2. An active representation context is evident here and in global chrome.
3. An unresolved context renders as unknown rather than as absent.

**Traceability.** `SCR-IDENTITY-004` · `WF-IDENTITY-004` · flows `FLOW-IDENTITY-002` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` · components `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-IDENTITY-001` `ERR-PLATFORM-004` · requirements `FR-IDENTITY-002`, `FR-IDENTITY-003` · contract `API-IDENTITY-003`

---

### SCR-IDENTITY-005 — Family and representation

**Wireframe:** `WF-IDENTITY-005` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** detail · **Density:** `reading` · **Classification:** New
**Actors:** Patient as grantor; Guardian as grantee
**Flows:** `FLOW-IDENTITY-002` `FLOW-IDENTITY-004` `FLOW-IDENTITY-021`
**Requirements:** `FR-IDENTITY-003`
**Data / action contract:** `API-IDENTITY-003`

**Purpose.** Show both directions of representation on one screen: the grants the patient gave, and the grants the patient holds over others. Success is the patient knowing exactly who can act for whom. Two directions on one screen because the patient is both grantor and potential grantee and the distinction must never be ambiguous.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | Which patient this is, and which direction each group represents. |
| Primary facts | Grants given, and grants held, as two clearly separated groups. |
| Related history | Expired and revoked grants, which remain visible as history. |
| Action | Create a grant, or open one. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-IDENTITY-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`patient`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-006` (`reading-list`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-IDENTITY-003` | `200` with safe identity/profile fields and active representation context if one is explicitly selected; sensitive authorization internals are not exposed. | None. |

- `API-IDENTITY-003` supplies both directions of representation with each grant's effective state.
- Missing-data behaviour: a grant whose scope did not load is shown as scope-unknown and offers no action, because an unknown scope must never read as full scope.

**State**

- Lifecycle statuses visible: grant active, expired, revoked
- Permission model: Patient as grantor, guardian as grantee. The two directions are separate groups and never merged.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Create a grant | primary | the actor is the grantor | HIDDEN for a grantee, who cannot create a grant over themselves |
| Open a grant | secondary | a grant exists | the group is replaced by its empty state |
| Switch active patient | secondary | the actor holds at least one active grant | absent where none is held |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-002`
- Lifecycle labels for every status above are owned by `TXT-STATE-IDENTITY-002` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the status and identity region.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is subject, grants given, grants held, history. Each group is a labelled list; a grant announces with its three facts and its effective period.
- Announcements: A revocation elsewhere announces politely and the grant moves to history.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- The two directions stack as separate labelled sections; a scope never truncates.

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

Not applicable here: `empty-filtered`. The grant set is scoped by subject rather than filtered.

**Acceptance criteria**

1. The two directions are unambiguous at every text size.
2. Expired and revoked grants remain visible as history.
3. A grant with an unresolved scope offers no action.
4. Historical attribution is never deleted.

**Traceability.** `SCR-IDENTITY-005` · `WF-IDENTITY-005` · flows `FLOW-IDENTITY-002` `FLOW-IDENTITY-004` `FLOW-IDENTITY-021` · widgets `WGT-IDENTITY-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` · components `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-006` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-002` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-IDENTITY-001` `ERR-PLATFORM-004` · requirements `FR-IDENTITY-003` · contract `API-IDENTITY-003`

---

### SCR-IDENTITY-006 — Create grant

**Wireframe:** `WF-IDENTITY-006` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** form · **Density:** `reading` · **Classification:** New
**Actors:** Patient as grantor; authorized legal-basis workflow
**Flows:** `FLOW-IDENTITY-002`
**Requirements:** `FR-IDENTITY-003`
**Data / action contract:** `API-IDENTITY-004`

**Purpose.** Let the patient create a representation grant with its scope fully legible before it is created. Success is one grant whose scope the grantor understood. It exists because an over-broad grant is an authorization breach across every interface.

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | Who the grant is over and who receives it. |
| Required input | The actions, the data scope, the purpose and the effective period. |
| Validation and consequence | The legal or grant basis. |
| Action | Create the grant. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-IDENTITY-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-010` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) |
| Patterns | `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-IDENTITY-004` | `201` with the created grant and explicit effective status. | `subject_patient_id: string`, `grantee_identity_id: string`, `actions: string[]`, `data_scope: string[]`, `purpose: string`, `effective_from: datetime`, `effective_until: datetime\|null`, `legal_or_grant_basis: string`. |

- `API-IDENTITY-004` captures the subject patient, the grantee, the actions, the data scope, the purpose, the effective period and the legal or grant basis, with an idempotency key to prevent duplicate equivalent grants.
- Missing-data behaviour: where the selectable action or scope set cannot be read, creation is withheld, because a grant created with an unknown scope set is an unbounded grant.

**State**

- Lifecycle statuses visible: grant effective status on creation
- Permission model: Patient as grantor. The **legal-basis path is not self-service**: it routes through Admin verification, so a guardian can never self-authorize a dependent's grant.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Create the grant | primary | the actor is the grantor and every scope field is set | DISABLED until the scope is complete, with what remains named |
| Cancel | secondary | always before commit | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-002`
- Lifecycle labels for every status above are owned by `TXT-STATE-IDENTITY-002` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is parties, scope, basis, action. The full scope is part of the confirm statement, not a hover detail.
- Announcements: The committed grant announces and focus moves to the created grant.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- Scope fields stack in the reading column; the scope summary is never truncated before the confirm control.

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

1. The full scope is legible before the grant is created.
2. A guardian cannot self-authorize a dependent's grant from this screen.
3. Duplicate equivalent grants are prevented by the idempotency key.
4. Creation is unavailable while any scope field is unset, with what remains named.

**Traceability.** `SCR-IDENTITY-006` · `WF-IDENTITY-006` · flows `FLOW-IDENTITY-002` · widgets `WGT-IDENTITY-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-010` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` · patterns `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-002` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-AUDIT-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` · requirements `FR-IDENTITY-003` · contract `API-IDENTITY-004`

---

### SCR-IDENTITY-007 — Grant detail

**Wireframe:** `WF-IDENTITY-007` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** form · **Density:** `reading` · **Classification:** New
**Actors:** Grantor; actor authorized by the governing legal-basis workflow
**Flows:** `FLOW-IDENTITY-002` `FLOW-IDENTITY-004` `FLOW-IDENTITY-019`
**Requirements:** `FR-IDENTITY-003`
**Data / action contract:** `API-IDENTITY-005`

**Purpose.** Show one grant and let the grantor revoke it. Success is a revoked grant with historical attribution preserved. It exists because **revocation is unconditional**: no booking or case state may block it.

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | The grant: who may act, for whom, on what, and until when. |
| Required input | The basis and the effective period. |
| Validation and consequence | What revocation does and does not do. |
| Action | Revoke. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-IDENTITY-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) `CMP-PLATFORM-014` (`irreversible`) |
| Patterns | `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-IDENTITY-005` | `204`. | Optional required-by-policy `reason: string`. |

- `API-IDENTITY-005` revokes the grant. Revocation takes effect immediately for future actions while historical attribution is preserved.
- **No booking-domain error appears on this screen.** Revoking does not cancel or delete the patient's existing bookings or case; where continuity of care needs follow-up, the system raises an operational work item rather than refusing the patient.
- Missing-data behaviour: where the grant cannot be read, revocation is withheld and the screen says why, because revoking an unread grant could revoke the wrong one.

**State**

- Lifecycle statuses visible: grant active, expired, revoked
- Permission model: Grantor, or an actor authorized by the governing legal-basis workflow.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Revoke this grant | destructive | the grant is active and the actor is the grantor or is authorized by the governing legal-basis workflow | **No booking, case or claim state may make this unavailable.** It is unavailable only where the grant is already revoked or expired |
| Back to family and representation | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-002`
- Lifecycle labels for every status above are owned by `TXT-STATE-IDENTITY-002` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is grant identity and scope, basis, consequence, action. The consequence states what revocation does not do as well as what it does.
- Announcements: The committed revocation announces and focus returns to the grant list with the grant in history.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- The consequence statement is never collapsed behind a disclosure.

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

Not applicable here: `empty-no-data` `empty-filtered`. A single-record surface has no list and no filter.

**Acceptance criteria**

1. Revocation is reachable and succeeds regardless of any booking, case or claim state.
2. No booking-domain error can appear on this screen.
3. Repeated revocation is safe and creates no duplicate effect.
4. Historical attribution is preserved and no past action is deleted.
5. The confirm control carries the same destructive role as its trigger.

**Traceability.** `SCR-IDENTITY-007` · `WF-IDENTITY-007` · flows `FLOW-IDENTITY-002` `FLOW-IDENTITY-004` `FLOW-IDENTITY-019` · widgets `WGT-IDENTITY-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` `CMP-PLATFORM-014` · patterns `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-002` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` · requirements `FR-IDENTITY-003` · contract `API-IDENTITY-005`

---

### SCR-IDENTITY-008 — Active patient context

**Wireframe:** `WF-IDENTITY-008` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** detail · **Density:** `reading` · **Classification:** New
**Actors:** Guardian holding one or more active grants
**Flows:** `FLOW-IDENTITY-003`
**Requirements:** `FR-IDENTITY-003`
**Data / action contract:** `API-IDENTITY-003`

**Purpose.** Let a guardian switch which patient they are acting for. Success is the correct active subject in force everywhere. It exists because a wrong-subject action is a clinical and authorization failure, so the active subject belongs in persistent chrome and this screen is where it is chosen.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The acting guardian identity, which does not change. |
| Primary facts | The selectable subjects, being only those with an active grant. |
| Related history | The grant behind each selectable subject. |
| Action | Switch, returning to the prior screen with the new context applied. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-IDENTITY-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`patient`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-006` (`reading-list`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-IDENTITY-003` | `200` with safe identity/profile fields and active representation context if one is explicitly selected; sensitive authorization internals are not exposed. | None. |

- `API-IDENTITY-003` supplies the selectable subjects and the active grant behind each.
- Missing-data behaviour: a subject whose grant state could not be read is not selectable, because selecting an unverified grant would present as authority.

**State**

- Lifecycle statuses visible: active grant per selectable subject
- Permission model: Guardian holding one or more active grants. **Switching changes what is displayed and grants nothing**; every request re-evaluates the grant server-side. The acting identity remains the guardian and masquerading as the patient is denied.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Switch to this subject | primary | the subject has an active grant | a subject without an active grant is not selectable and is absent from the list |
| Cancel | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-002`
- Lifecycle labels for every status above are owned by `TXT-STATE-IDENTITY-002` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the status and identity region.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is acting identity, selectable subjects, action. Each subject announces with its grant scope.
- Announcements: The switch announces the new active subject and returns focus to the prior screen.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- One subject per reading-column block.

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

Not applicable here: `empty-filtered`. The selectable set is scoped rather than filtered, and this surface commits no domain mutation.

**Acceptance criteria**

1. Only subjects with an active grant are selectable.
2. Switching grants no authority; every request is re-evaluated server-side.
3. The acting identity remains the guardian and is visible after the switch.
4. The active subject appears in persistent chrome, not only on this screen.

**Traceability.** `SCR-IDENTITY-008` · `WF-IDENTITY-008` · flows `FLOW-IDENTITY-003` · widgets `WGT-IDENTITY-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` · components `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-006` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-002` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-IDENTITY-001` `ERR-PLATFORM-004` · requirements `FR-IDENTITY-003` · contract `API-IDENTITY-003`

---

### SCR-PLATFORM-009 — Notification centre

**Wireframe:** `WF-PLATFORM-009` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** detail · **Density:** `reading` · **Classification:** New
**Actors:** Patient; Guardian filtered to active grant scope
**Flows:** `FLOW-BOOKING-014` `FLOW-ELIG-015` `FLOW-PLATFORM-004`
**Requirements:** `FR-PLATFORM-001`
**Data / action contract:** `API-PLATFORM-002`

**Purpose.** Give the patient a chronological record of everything the system has told them, each entry linking to the authoritative resource. Success is the patient reaching the record an entry refers to and seeing its current state. It exists as a utility destination rather than a fifth primary tab, and its duplication of deadline-bearing items is what makes push, SMS and email optional.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | Which patient the entries are scoped to. |
| Primary facts | Entries in chronological order with read and action-required indication. |
| Related history | The authoritative record behind each entry. |
| Action | Mark read, which changes no business state. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` `WGT-PLATFORM-009` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`patient`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-006` (`reading-list`) `CMP-PLATFORM-007` (`discovery`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-015` (`attention`) |
| Patterns | `IX-BOOKING-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-PLATFORM-002` | `200` with durable entries carrying safe title/summary, linked authoritative resource reference, timestamp, read/unread, action-required indication, and applicable due time; plus an unread count in `meta`. | List — optional `unread_only: boolean`, `cursor: string`. Mark read — no body. |

- `API-PLATFORM-002` supplies durable entries with a safe title and summary, the linked resource reference, timestamp, read state and action-required indication. **The entry owns no business status**; the status shown belongs to the referenced record.
- Missing-data behaviour: an entry written hours ago cannot be trusted to describe a current deadline, so opening one re-reads the authoritative resource before rendering its state.

**State**

- Lifecycle statuses visible: per-entry read/unread and action-required; no business status is owned here
- Permission model: Patient acting for themselves, or a guardian acting inside an active grant. Under representation both the acting and the subject identity are visible, and every request is re-evaluated server-side; switching subject grants nothing. Entries are filtered to the active grant scope.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Open the linked record | primary | always for any entry | never unavailable; the destination handles its own failure |
| Mark read | secondary | always | never unavailable. It changes no business state and no control here may read as accepting or acknowledging anything |
| Filter to unread | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011`
- No status this screen shows belongs to a governed lifecycle machine, so it binds no `TXT-STATE-*` rule. What the state section lists is descriptive condition, not a status chip drawn from a state machine.

| Error | Raised by | Copy rule |
|---|---|---|

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the status and identity region.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is subject context, filter, entry list. Entries are a list with a count; read state is part of each entry name.
- Announcements: Marking read announces nothing. A newly arrived entry does not announce merely for arriving.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- One entry per reading-column block; the unread filter stays visible above the list rather than in a hidden drawer.

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

1. No control on this screen accepts, acknowledges or decides anything.
2. Opening an entry re-reads the authoritative resource.
3. Every deadline-bearing entry also appears on the attention surface.
4. The unread filter is visible whenever it is applied, and its empty result reads differently from a genuinely empty centre.

**Traceability.** `SCR-PLATFORM-009` · `WF-PLATFORM-009` · flows `FLOW-BOOKING-014` `FLOW-ELIG-015` `FLOW-PLATFORM-004` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` `WGT-PLATFORM-009` · components `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-006` `CMP-PLATFORM-007` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-015` · patterns `IX-BOOKING-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors  · requirements `FR-PLATFORM-001` · contract `API-PLATFORM-002`

---

### SCR-BOOKING-016 — Reschedule request

**Wireframe:** `WF-BOOKING-016` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** list-and-detail · **Density:** `reading` · **Classification:** New
**Actors:** Patient; Guardian where the grant covers booking actions — per `PERMISSIONS_MATRIX` section 9
**Flows:** `FLOW-BOOKING-013` `FLOW-BOOKING-014`
**Requirements:** `FR-BOOKING-004`
**Data / action contract:** `API-BOOKING-006`, `API-BOOKING-007`

**Purpose.** Let the patient propose a new time, or respond to a clinic proposal, while the original appointment keeps standing. Success is either party knowing which appointment currently holds. It exists because showing the proposed time as though it were the appointment is the specific failure this surface prevents.

**Hierarchy** — Phase 2 priority order, not reopened: context/filter > list > selected detail > state-aware action.

| Region | Contents |
|---|---|
| Context and filter | The booking and which patient it belongs to. |
| List | The original appointment, labelled as the one that currently holds, then the proposal. |
| Selected detail | The proposal history and its deadline. |
| State-aware action | Propose, or accept and decline as the counterparty. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-BOOKING-001` `WGT-BOOKING-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-006` (`reading-list`) `CMP-PLATFORM-007` (`discovery`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) |
| Patterns | `IX-BOOKING-001` `IX-BOOKING-002` `IX-ELIG-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-BOOKING-006` | `201` with proposal ID, state `PENDING`, response deadline, and the **unchanged** current booking state. | `proposed_slot_id: string`, `reason: string\|null`; idempotency key required. |
| `API-BOOKING-007` | `200` with resulting proposal state and the resulting authoritative booking state/slot. | `decision: "accept"\|"decline"`, `reason: string\|null`; idempotency key required. |

- `API-BOOKING-006` creates a proposal and `API-BOOKING-007` responds to one; both require an idempotency key.
- **The original confirmed appointment remains authoritative** until acceptance commits and revalidation succeeds.
- Missing-data behaviour: if the original could not be read, no decision control is offered and the screen says the current appointment could not be read.

**State**

- Lifecycle statuses visible: proposal `PENDING`, `ACCEPTED`, `DECLINED`, `EXPIRED`, `WITHDRAWN`; the booking's own `CONFIRMED` state alongside
- Permission model: Patient, or guardian where the grant covers booking actions.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Propose a new time | primary | the booking is confirmed and no proposal is pending | UNAVAILABLE against a booking in eligibility review, and while a proposal is already pending |
| Accept the proposal | primary | a clinic proposal is pending and the patient is the counterparty | HIDDEN on the patient's own proposal, because a party cannot respond to its own |
| Decline the proposal | secondary | a clinic proposal is pending | HIDDEN on the patient's own proposal |
| Withdraw my proposal | secondary | the patient's own proposal is pending | HIDDEN on the counterparty's proposal |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-BOOKING-001` `TXT-STATE-BOOKING-002` `TXT-STATE-PLATFORM-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-BOOKING-001` `TXT-STATE-BOOKING-002` `TXT-STATE-PLATFORM-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-BOOKING-002` | a booking command that the record's current state does not permit | `TXT-ERR-BOOKING-002` |
| `ERR-BOOKING-003` | a booking or provider-response command issued after its deadline lapsed | `TXT-ERR-BOOKING-003` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the filter or search control where one exists, otherwise the first row.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is booking context, original appointment, proposal, deadline, actions. Each appointment announces with its label.
- Announcements: Acceptance announces which appointment now holds and moves focus to the updated state.
- Right-to-left and bidirectional: The original occupies the logical start position in both directions. Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- The pair stacks with the original first at every size class.

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

1. The original appointment is labelled as the one that currently holds while a proposal is pending.
2. A party is never offered a response control on its own proposal.
3. The surface is unavailable against a booking in eligibility review, with the controlling dependency named.
4. Acceptance revalidates before committing, and the original stands until it does.

**Traceability.** `SCR-BOOKING-016` · `WF-BOOKING-016` · flows `FLOW-BOOKING-013` `FLOW-BOOKING-014` · widgets `WGT-BOOKING-001` `WGT-BOOKING-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-006` `CMP-PLATFORM-007` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` · patterns `IX-BOOKING-001` `IX-BOOKING-002` `IX-ELIG-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-BOOKING-001` `TXT-STATE-BOOKING-002` `TXT-STATE-PLATFORM-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-BOOKING-002` `ERR-BOOKING-003` · requirements `FR-BOOKING-004` · contract `API-BOOKING-006`, `API-BOOKING-007`

---

### SCR-IDENTITY-037 — Add dependent

**Wireframe:** `WF-IDENTITY-037` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** form · **Density:** `reading` · **Classification:** New
**Actors:** Authenticated guardian applicant — per `PERMISSIONS_MATRIX` section 6
**Flows:** `FLOW-IDENTITY-021`
**Requirements:** `FR-IDENTITY-003`
**Data / action contract:** `API-IDENTITY-006`

**Purpose.** Let an authenticated guardian request representation over a dependent. Success is a submitted request under verification. It exists because **the guardian cannot self-authorize** by entering a dependent: submission creates a request, not a grant.

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | The guardian making the request. |
| Required input | The dependent's facts and the required evidence items. |
| Validation and consequence | **That submission creates a request under verification and grants nothing.** |
| Action | Submit the request. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-IDENTITY-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-010` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) |
| Patterns | `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-IDENTITY-006` | `201` with request ID and review state. | `subject_identification: object`, `relationship: string`, `legal_basis: string`, `requested_actions: string[]`, `requested_data_scope: string[]`, `purpose: string`, `evidence_ids: string[]`; idempotency key required. |

- `API-IDENTITY-006` submits the legal-basis representation request. Evidence items use the canonical transfer states, so a rejected file shows a safe actionable reason rather than a generic failure.
- Missing-data behaviour: a requirement whose state did not load is never counted as satisfied and submission stays unavailable naming it.

**State**

- Lifecycle statuses visible: request draft, submitted, changes requested, approved, rejected
- Permission model: Authenticated guardian applicant. **A guardian cannot self-authorize a dependent's grant**; that denial is a permission rule, not a UI choice.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Submit the request | primary | the required facts and evidence are complete | UNAVAILABLE with the outstanding item named while anything required is missing |
| Supply evidence | primary | a requirement is outstanding | absent once every requirement is satisfied |
| Save and continue later | secondary | a draft exists | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-IDENTITY-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is guardian identity, dependent facts, evidence, the grants-nothing statement, the action.
- Announcements: Evidence progress announces at intervals. The committed request announces as submitted for verification, never as approved.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- Requirements stack in the reading column with each state adjacent to its next action.

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

Not applicable here: `empty-no-data` `empty-filtered`. The requirement set is governed rather than filtered.

**Acceptance criteria**

1. **The screen never reads as granting access.**
2. Submission creates a request under verification and says so.
3. A rejected evidence item shows a safe actionable reason.
4. A retryable transfer failure is distinct from an authoritative rejection.
5. The guardian cannot approve their own request from any surface.

**Traceability.** `SCR-IDENTITY-037` · `WF-IDENTITY-037` · flows `FLOW-IDENTITY-021` · widgets `WGT-IDENTITY-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-010` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` · patterns `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors  · requirements `FR-IDENTITY-003` · contract `API-IDENTITY-006`

---
