# Screen Specifications — Patient app (1 of 3)

**Phase:** UX 4 — Widget and Screen Specifications
**Platform:** Patient app · Profile C · React Native
**Schema:** `PHASE_04_IMPLEMENTATION_PLAN.md` section 6. **Widgets:** `WIDGET_SPECS.md`. **Map:** `SCREEN_SPEC_MAP.md`.

Every block carries the same thirteen sections in the same order. A section that does not apply says so and why.

---
### SCR-IDENTITY-001 — Patient entry

**Wireframe:** `WF-IDENTITY-001` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** detail · **Density:** `reading` · **Classification:** New
**Actors:** Public visitor — per `PERMISSIONS_MATRIX` section 5
**Flows:** `FLOW-IDENTITY-001`
**Requirements:** `FR-CATALOG-001`, `FR-IDENTITY-002`
**Data / action contract:** `API-CATALOG-001`

**Purpose.** Let a visitor understand what UberTib is for and reach either discovery or identity verification. Success is the visitor choosing one of those two routes with an accurate idea of what the product does. It exists as its own screen because discovery before identity is a deliberate product decision: the patient evaluates UberTib before committing a phone number.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | What UberTib does, stated without implying diagnosis, treatment, insurance or money custody. |
| Primary facts | The two routes: browse services, or verify a number. |
| Related history | Nothing. The screen carries no history and no secondary detail by design. |
| Action | One primary action and one secondary route, both always available. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-003` |
| Components | `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-CATALOG-001` | `200 application/json` with `data: ServiceGroup[]` and `meta.mode: "evaluation" \| "production"`. | No body. Catalog mode is server configuration, not a client-selectable query parameter. |

- `API-CATALOG-001` supplies only the visible service groups used to make the browse route meaningful. Nothing else on this screen is a read.
- Missing-data behaviour: if the catalog read fails, the browse route stays offered and its destination handles the failure. The entry screen never blocks on it.

**State**

- Lifecycle statuses visible: none
- Permission model: Public, pre-authentication. No subject exists yet, so `CMP-PLATFORM-003` is absent rather than empty and no scope-dependent action is offered.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Verify my number | primary | always; this surface has no precondition | never unavailable |
| Browse services | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011`
- No status this screen shows belongs to a governed lifecycle machine, so it binds no `TXT-STATE-*` rule. What the state section lists is descriptive condition, not a status chip drawn from a state machine.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-PLATFORM-003` | a rate-limited read issued repeatedly from this surface | `TXT-ERR-PLATFORM-003` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the status and identity region.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is purpose, routes, actions. The two routes are announced as links with destinations, not as generic buttons.
- Announcements: Nothing announces on this screen. There is no mutation and no live state.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- Both routes stay above the fold at `profile-c.size-class.compact`; at `profile-c.stack-threshold` the purpose text scrolls and the two routes stay together at the end of the reading column.

**Loading and failure**

| State | Behaviour on this screen |
|---|---|
| `loading-initial` | Skeleton at content height through `WGT-PLATFORM-001`. No empty state and no action is rendered while the first read is in flight. |
| `loading-refresh` | Content stays visible and interactive. A refresh never steals focus and never scrolls the surface. |
| `partial` | The region that loaded stays interactive; the region that failed names itself and offers retry in place. Never presented as complete. |
| `stale` | `CMP-PLATFORM-010` `stale` with the as-of time. Committing actions are withdrawn; read actions remain. |
| `error-fetch` | `CMP-PLATFORM-010` `fetch-failure`. Last known safe context preserved, retry in place, entered input untouched. |
| `success` | Content. |
| `offline / unstable` | Last known data with its as-of time, the condition stated per `TXT-PLATFORM-009`, and committing actions withdrawn unless the command is idempotent-resumable. |

Not applicable here: `empty-no-data` `empty-filtered` `error-permission`. There is no authenticated read, no list and no filter, so the empty, stale, permission and refresh states have nothing to describe here.

**Acceptance criteria**

1. No copy on this screen states or implies that UberTib diagnoses, treats, insures, or holds or moves money.
2. Browsing services is reachable without entering a phone number.
3. A failed catalog read does not prevent either route from being offered.
4. Both action targets meet `semantic.size.target-primary` at every text size.

**Traceability.** `SCR-IDENTITY-001` · `WF-IDENTITY-001` · flows `FLOW-IDENTITY-001` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-003` · components `CMP-PLATFORM-004` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-PLATFORM-003` `ERR-PLATFORM-004` · requirements `FR-CATALOG-001`, `FR-IDENTITY-002` · contract `API-CATALOG-001`

---

### SCR-IDENTITY-002 — Phone entry and code request

**Wireframe:** `WF-IDENTITY-002` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** form · **Density:** `reading` · **Classification:** New
**Actors:** Public pre-authentication actor
**Flows:** `FLOW-BOOKING-001` `FLOW-ELIG-005` `FLOW-IDENTITY-001`
**Requirements:** `FR-IDENTITY-002`
**Data / action contract:** `API-IDENTITY-001`

**Purpose.** Collect and normalize the patient contact number and request a verification challenge. Success is a challenge created and the patient moved to code entry. It is separate from code verification because the throttle window and the resend affordance belong to the request, not to the code.

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | The number field, with a persistent visible label. |
| Required input | What happens next, and the throttle window where one is in force. |
| Validation and consequence | The route back to whatever action gated the visitor. |
| Action | Request a code, with the resend window governing it. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-IDENTITY-001` `WGT-PLATFORM-001` `WGT-PLATFORM-003` `WGT-PLATFORM-010` |
| Components | `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-IDENTITY-001` | `202` with `data.challenge_id: string`, `data.expires_in_seconds: integer`, and safe resend timing metadata; never return the OTP. | `phone: string` required and normalized according to the approved contact policy. |

- `API-IDENTITY-001` takes the contact number and returns the challenge and its throttle metadata. Send throttling is three per fifteen minutes per phone, account and address combination.
- Missing-data behaviour: where the server supplies no retry window, the surface states that the code can be requested again shortly and shows no countdown. **A fabricated countdown is prohibited.**

**State**

- Lifecycle statuses visible: none
- Permission model: Public, pre-authentication. No subject exists yet, so `CMP-PLATFORM-003` is absent rather than empty and no scope-dependent action is offered.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Request a code | primary | a well-formed number is entered and no throttle window is in force | DISABLED while the throttle window runs, with the remaining wait bound to the control; the actor can act once the window elapses |
| Change the number | secondary | always | never unavailable |
| Go back | secondary | always; abandoning returns to the originating screen | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011`
- No status this screen shows belongs to a governed lifecycle machine, so it binds no `TXT-STATE-*` rule. What the state section lists is descriptive condition, not a status chip drawn from a state machine.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-003` | a verification-code resend inside the throttle window | `TXT-ERR-IDENTITY-003` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-029` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is field, consequence, action. The remaining wait is programmatically associated with the resend control.
- Announcements: The throttle window announces once when it begins and once when it ends. It does not announce per tick.
- Right-to-left and bidirectional: Interface direction is right-to-left; the number is bidirectionally isolated so it reads back exactly as entered, including any leading country code.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- Field, consequence and action stay within one screen height so the on-screen keyboard does not cover the action.

**Loading and failure**

| State | Behaviour on this screen |
|---|---|
| `loading-initial` | Skeleton at content height through `WGT-PLATFORM-001`. No empty state and no action is rendered while the first read is in flight. |
| `loading-refresh` | Content stays visible and interactive. A refresh never steals focus and never scrolls the surface. |
| `partial` | The region that loaded stays interactive; the region that failed names itself and offers retry in place. Never presented as complete. |
| `stale` | `CMP-PLATFORM-010` `stale` with the as-of time. Committing actions are withdrawn; read actions remain. |
| `error-fetch` | `CMP-PLATFORM-010` `fetch-failure`. Last known safe context preserved, retry in place, entered input untouched. |
| `success` | Content. |
| `offline / unstable` | Last known data with its as-of time, the condition stated per `TXT-PLATFORM-009`, and committing actions withdrawn unless the command is idempotent-resumable. |

Not applicable here: `empty-no-data` `empty-filtered` `error-permission`. No authenticated projection is read here, so there is no list, no filter, no prior good projection to go stale and no scope to be denied.

**Acceptance criteria**

1. No response distinguishes a number that belongs to an existing account from one that does not.
2. The remaining wait renders only when the server provided it.
3. The entered number survives a failed request.
4. Paste and platform autofill work in the number field.

**Traceability.** `SCR-IDENTITY-002` · `WF-IDENTITY-002` · flows `FLOW-BOOKING-001` `FLOW-ELIG-005` `FLOW-IDENTITY-001` · widgets `WGT-IDENTITY-001` `WGT-PLATFORM-001` `WGT-PLATFORM-003` `WGT-PLATFORM-010` · components `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-029` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-IDENTITY-003` `ERR-PLATFORM-001` `ERR-PLATFORM-004` · requirements `FR-IDENTITY-002` · contract `API-IDENTITY-001`

---

### SCR-IDENTITY-003 — Code verification

**Wireframe:** `WF-IDENTITY-003` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** form · **Density:** `reading` · **Classification:** New
**Actors:** Challenge holder
**Flows:** `FLOW-IDENTITY-001`
**Requirements:** `FR-IDENTITY-002`
**Data / action contract:** `API-IDENTITY-002`

**Purpose.** Verify the challenge code and activate or resume the patient identity. Success is a verified identity and a return to whatever the patient was trying to do. It is separate from the request screen because expiry, attempts and single use are properties of the code, and each needs its own recovery.

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | The code field, with a persistent visible label. |
| Required input | Which number the code was sent to, and the attempts remaining. |
| Validation and consequence | Resend, and the route back to change the number. |
| Action | Verify, with the submission state inline. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-IDENTITY-001` `WGT-PLATFORM-001` `WGT-PLATFORM-003` `WGT-PLATFORM-010` |
| Components | `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-IDENTITY-002` | `200` with authenticated identity/session bootstrap data; exact transport token/session shape remains implementation-specific. | `challenge_id: string` required; `code: string` exactly six digits; optional idempotency key required when account activation may occur. |

- `API-IDENTITY-002` verifies the code and activates or resumes the identity. Five-minute expiry, five verification attempts, single use.
- Missing-data behaviour: attempts remaining is shown when the server supplies it and is never estimated. The actor learns their attempts are limited before the last one, not after it.

**State**

- Lifecycle statuses visible: none
- Permission model: Public, pre-authentication. No subject exists yet, so `CMP-PLATFORM-003` is absent rather than empty and no scope-dependent action is offered.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Verify | primary | a code is entered and attempts remain | DISABLED while a verification is in flight; UNAVAILABLE with the route to a new code once attempts are exhausted or the code expired |
| Resend a code | secondary | no throttle window is in force | DISABLED while the throttle window runs, with the remaining wait bound to it |
| Change the number | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011`
- No status this screen shows belongs to a governed lifecycle machine, so it binds no `TXT-STATE-*` rule. What the state section lists is descriptive condition, not a status chip drawn from a state machine.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-IDENTITY-004` | a code that is invalid, expired, already used, or whose attempts are exhausted | `TXT-ERR-IDENTITY-004` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-029` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is field, context, actions. The attempts-remaining statement is part of the failure message, not a separate live region.
- Announcements: A failed verification announces politely with the attempts remaining. Success announces and moves focus to the restored destination.
- Right-to-left and bidirectional: Interface direction is right-to-left; the code reads back in the order it was typed.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- Field and verify action stay above the on-screen keyboard; resend stays reachable without dismissing it.

**Loading and failure**

| State | Behaviour on this screen |
|---|---|
| `loading-initial` | Skeleton at content height through `WGT-PLATFORM-001`. No empty state and no action is rendered while the first read is in flight. |
| `loading-refresh` | Content stays visible and interactive. A refresh never steals focus and never scrolls the surface. |
| `partial` | The region that loaded stays interactive; the region that failed names itself and offers retry in place. Never presented as complete. |
| `stale` | `CMP-PLATFORM-010` `stale` with the as-of time. Committing actions are withdrawn; read actions remain. |
| `error-fetch` | `CMP-PLATFORM-010` `fetch-failure`. Last known safe context preserved, retry in place, entered input untouched. |
| `success` | Content. |
| `offline / unstable` | Last known data with its as-of time, the condition stated per `TXT-PLATFORM-009`, and committing actions withdrawn unless the command is idempotent-resumable. |

Not applicable here: `empty-no-data` `empty-filtered` `error-permission`. No authenticated projection is read here.

**Acceptance criteria**

1. Invalid, expired, already-used and attempts-exhausted each produce a distinct recovery from one error family.
2. Resend invalidates the prior code and does not reset accumulated failures.
3. Repeated successful activation creates no duplicate active identity.
4. On success the patient returns to the screen that gated them, with its context restored.
5. No step of verification asks the actor to transcribe, calculate or recognise anything.

**Traceability.** `SCR-IDENTITY-003` · `WF-IDENTITY-003` · flows `FLOW-IDENTITY-001` · widgets `WGT-IDENTITY-001` `WGT-PLATFORM-001` `WGT-PLATFORM-003` `WGT-PLATFORM-010` · components `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-029` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-AUDIT-001` `ERR-IDENTITY-004` `ERR-PLATFORM-001` `ERR-PLATFORM-004` · requirements `FR-IDENTITY-002` · contract `API-IDENTITY-002`

---

### SCR-PLATFORM-001 — Needs attention

**Wireframe:** `WF-PLATFORM-001` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** dashboard · **Density:** `reading` · **Classification:** New
**Actors:** Patient; Guardian within grant scope
**Flows:** `FLOW-BOOKING-006` `FLOW-CLAIMS-003` `FLOW-CLINICAL-002` `FLOW-CLINICAL-007` `FLOW-FINANCE-004` `FLOW-IDENTITY-001` `FLOW-IDENTITY-019` `FLOW-PLATFORM-004`
**Requirements:** `FR-PLATFORM-001`, `FR-CLINICAL-005`, `FR-BOOKING-003`, `FR-CLINICAL-002`, `FR-CLINICAL-004`, `FR-CLAIMS-003`, `FR-FINANCE-003`
**Data / action contract:** `API-PLATFORM-002`, `API-BOOKING-002`, `API-CLINICAL-001`, `API-CLAIMS-003`, `API-FINANCE-005`

**Purpose.** Show the patient what their care needs from them right now, and nothing else. Success is the patient reaching the one thing that needs them, or seeing plainly that nothing does. It exists because Principle 3 requires prominence to follow the journey rather than the data model, and `PO-UX-09` confirmed it as the attention surface.

**Hierarchy** — Phase 2 priority order, not reopened: context > urgent attention > primary work > supporting status.

| Region | Contents |
|---|---|
| Context | Which patient this is for, when a guardian is acting. |
| Urgent attention | Items that need the patient now, ordered by what the case needs, each with its remaining time where a deadline runs. |
| Primary work | Everything else the patient can reach, one navigation away. |
| Supporting status | Each item carries its own route; the screen itself has no primary action. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-009` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`patient`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-006` (`reading-list`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-015` (`attention`) |
| Patterns | `IX-BOOKING-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-PLATFORM-002` | `200` with durable entries carrying safe title/summary, linked authoritative resource reference, timestamp, read/unread, action-required indication, and applicable due time; plus an unread count in `meta`. | List — optional `unread_only: boolean`, `cursor: string`. Mark read — no body. |
| `API-BOOKING-002` | `200` collection of booking summaries with stable state, provider/service/branch summary, times, deadlines, and next permitted action metadata. | Optional state/date filters; pagination only if/when required by implementation volume. |
| `API-CLINICAL-001` | `200` with safe case status, service/provider/branch summary, current accepted-plan version if any, next follow-up, missing patient-action items, and links/IDs for authorized subresources. | none — this surface issues no command against it |
| `API-CLAIMS-003` | `200` collection of scoped claim/refund summaries, states, deadlines, missing evidence counts, decision status, appeal eligibility, and external-execution status where applicable. | none — this surface issues no command against it |
| `API-FINANCE-005` | `200` ordered financial events plus derived amounts/statuses distinguishing agreed, reported, confirmed, disputed, refunded, and pending-external-execution values. | none — this surface issues no command against it |

- Every item traces to a requirement-backed read. Nothing on this screen is assembled from a source that is not one of the five contracts above.
- Missing-data behaviour: an item whose deadline did not load is shown without a fabricated remaining time and states that it is unavailable. **A deadline that failed to load is never rendered as no deadline.**

**State**

- Lifecycle statuses visible: `ALTERNATIVE_PROPOSED`, `PROPOSED`, `EVIDENCE_INCOMPLETE`, `REPORTED_UNCONFIRMED`, follow-up due
- Permission model: Patient acting for themselves, or a guardian acting inside an active grant. Under representation both the acting and the subject identity are visible, and every request is re-evaluated server-side; switching subject grants nothing.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Open an attention item | primary | an item exists | the region is replaced by the between-cases empty state when nothing is pending |
| Refresh | secondary | always; app resume is also a refresh trigger | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-BOOKING-001` `TXT-STATE-BOOKING-002` `TXT-STATE-CLAIMS-001` `TXT-STATE-CLINICAL-001` `TXT-STATE-FINANCE-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-BOOKING-001` `TXT-STATE-BOOKING-002` `TXT-STATE-CLAIMS-001` `TXT-STATE-CLINICAL-001` `TXT-STATE-FINANCE-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the first item in the urgent-attention region.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is subject context, attention list, navigation. The list is exposed as a list with its item count.
- Announcements: An item that changes what the patient can currently do announces politely. Items that merely arrive in the background do not announce.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- One item per reading-column block at every size class. Remaining time stacks beneath the item description at `profile-c.stack-threshold` rather than being dropped.

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

Not applicable here: `empty-filtered`. The surface is scoped by the active subject rather than filtered, so there is no filtered-empty state.

**Acceptance criteria**

1. With no active case the screen is near-empty and says so plainly; it never manufactures activity.
2. Every deadline-bearing item shows its remaining time without relying on colour.
3. Every item here also appears in the notification centre, so delivery is optional.
4. An item whose deadline failed to load says so and is not shown as having none.
5. Opening an item re-reads the authoritative record before rendering its state.

**Traceability.** `SCR-PLATFORM-001` · `WF-PLATFORM-001` · flows `FLOW-BOOKING-006` `FLOW-CLAIMS-003` `FLOW-CLINICAL-002` `FLOW-CLINICAL-007` `FLOW-FINANCE-004` `FLOW-IDENTITY-001` `FLOW-IDENTITY-019` `FLOW-PLATFORM-004` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-009` · components `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-006` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-015` · patterns `IX-BOOKING-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-BOOKING-001` `TXT-STATE-BOOKING-002` `TXT-STATE-CLAIMS-001` `TXT-STATE-CLINICAL-001` `TXT-STATE-FINANCE-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` · requirements `FR-PLATFORM-001`, `FR-CLINICAL-005`, `FR-BOOKING-003`, `FR-CLINICAL-002`, `FR-CLINICAL-004`, `FR-CLAIMS-003`, `FR-FINANCE-003` · contract `API-PLATFORM-002`, `API-BOOKING-002`, `API-CLINICAL-001`, `API-CLAIMS-003`, `API-FINANCE-005`

---

### SCR-PLATFORM-002 — Pending submissions

**Wireframe:** `WF-PLATFORM-002` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** detail · **Density:** `reading` · **Classification:** New
**Actors:** Patient; Guardian within grant scope
**Flows:** `FLOW-BOOKING-001` `FLOW-FINANCE-002` `FLOW-PLATFORM-002`
**Requirements:** `FR-AUDIT-003`
**Data / action contract:** `API-BOOKING-002`, `API-CLAIMS-003`, `API-FINANCE-005`

**Purpose.** Show every command the patient issued whose outcome is not yet known, reconcile each against authoritative state, and let a retry finish safely. Success is every outstanding command resolved to a real record. It exists because a timeout on a weak connection must never become a duplicate booking.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | Which patient the outstanding commands belong to. |
| Primary facts | One row per outstanding command: what was asked for, when, and its reconciled state. |
| Related history | The authoritative record each command resolved to. |
| Action | Retry, reusing the original idempotency key. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-012` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`patient`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-006` (`reading-list`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-004` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-BOOKING-002` | `200` collection of booking summaries with stable state, provider/service/branch summary, times, deadlines, and next permitted action metadata. | Optional state/date filters; pagination only if/when required by implementation volume. |
| `API-CLAIMS-003` | `200` collection of scoped claim/refund summaries, states, deadlines, missing evidence counts, decision status, appeal eligibility, and external-execution status where applicable. | none — this surface issues no command against it |
| `API-FINANCE-005` | `200` ordered financial events plus derived amounts/statuses distinguishing agreed, reported, confirmed, disputed, refunded, and pending-external-execution values. | none — this surface issues no command against it |

- The panel holds no authoritative state of its own. Each entry reconciles against `API-BOOKING-002`, `API-CLAIMS-003` or `API-FINANCE-005`.
- Missing-data behaviour: an entry whose reconciliation read failed stays unknown with its as-of time. **Unknown is a designed state, not an absence of information, and it is never reported as failed.**

**State**

- Lifecycle statuses visible: pending, failed, retrying, completed per `NFR-PLATFORM-006`
- Permission model: Patient acting for themselves, or a guardian acting inside an active grant. Under representation both the acting and the subject identity are visible, and every request is re-evaluated server-side; switching subject grants nothing.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Retry | primary | the outcome is known to have not reached the server | UNAVAILABLE while the outcome is unknown; the surface reconciles first and offers no new command |
| Open the resolved record | secondary | reconciliation resolved to a record | absent until it resolves |
| Discard this attempt | destructive | the command is known not to have committed | HIDDEN while the outcome is unknown, because discarding an unknown outcome would hide a committed record |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011`
- No status this screen shows belongs to a governed lifecycle machine, so it binds no `TXT-STATE-*` rule. What the state section lists is descriptive condition, not a status chip drawn from a state machine.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the status and identity region.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is subject context, outstanding list, per-entry outcome. Each entry announces what was asked for and its state.
- Announcements: A reconciled outcome announces politely and focus moves to the resolved entry. An unknown outcome announces as unknown.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- One entry per reading-column block; the retry control never falls below `semantic.size.target-primary`.

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

Not applicable here: `empty-filtered`. The list is scoped rather than filtered.

**Acceptance criteria**

1. A retry carries the original idempotency key; only a changed intent carries a new one.
2. No new command is offered against a record whose prior outcome is unknown.
3. Outstanding entries survive an app restart and reconcile on reconnection.
4. No outcome is reported from the local queue without an authoritative read.
5. Unknown, failed and completed are three distinct announced states.

**Traceability.** `SCR-PLATFORM-002` · `WF-PLATFORM-002` · flows `FLOW-BOOKING-001` `FLOW-FINANCE-002` `FLOW-PLATFORM-002` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-012` · components `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-006` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-004` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` · requirements `FR-AUDIT-003` · contract `API-BOOKING-002`, `API-CLAIMS-003`, `API-FINANCE-005`

---

### SCR-CATALOG-001 — Service groups

**Wireframe:** `WF-CATALOG-001` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** detail · **Density:** `reading` · **Classification:** New
**Actors:** Public visitor; Patient; Guardian
**Flows:** `FLOW-CATALOG-001`
**Requirements:** `FR-CATALOG-001`
**Data / action contract:** `API-CATALOG-001`

**Purpose.** Let anyone browse the four service groups and the patient-facing service families under them. Success is the visitor reaching a family that matches what they think they need. It exists so that discovery requires no professional vocabulary at all.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The four service groups. |
| Primary facts | The patient-facing families under each group, in plain language. |
| Related history | A direct route to provider search for a chosen family. |
| Action | Choosing a family, which carries its service code forward. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`patient`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-CATALOG-001` | `200 application/json` with `data: ServiceGroup[]` and `meta.mode: "evaluation" \| "production"`. | No body. Catalog mode is server configuration, not a client-selectable query parameter. |

- `API-CATALOG-001` supplies the visible groups and families. **The number of families is governed catalog data, not a design constant**, so the layout survives families being added, renamed, merged or retired.
- Detailed professional procedure items are **not available to this surface and must not be requested**: the patient meets procedure detail only inside a clinician-authored plan after examination.
- Missing-data behaviour: an empty production catalog is a real state meaning services are not available yet. It must never read as no dentistry existing in Aleppo.

**State**

- Lifecycle statuses visible: production-visible definitions only
- Permission model: Public visitor, patient or guardian. Identical projection for all three: no field varies by authentication on this surface.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Open a service family | primary | the production catalog has visible content | the region is replaced by the empty state when production content is absent |
| Search providers directly | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CATALOG-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-CATALOG-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-PLATFORM-003` | a rate-limited read issued repeatedly from this surface | `TXT-ERR-PLATFORM-003` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the status and identity region.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is groups, then families within a group. Groups and families are exposed as nested lists, not as headings alone.
- Announcements: Nothing announces. This surface has no mutation and no live state.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- One group per reading-column section with its families stacked beneath. Long Arabic family names wrap; none truncates.

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

Not applicable here: `empty-no-data` `empty-filtered`. This surface is a public read with no filter, no scope and no mutation.

**Acceptance criteria**

1. No screen content requires knowledge of any internal classification symbol, procedure code or professional term.
2. The layout is correct whether a group holds one family or thirty.
3. Evaluation-audience content never renders as production content.
4. An empty production catalog states that services are not available yet.

**Traceability.** `SCR-CATALOG-001` · `WF-CATALOG-001` · flows `FLOW-CATALOG-001` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` · components `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CATALOG-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-PLATFORM-003` `ERR-PLATFORM-004` · requirements `FR-CATALOG-001` · contract `API-CATALOG-001`

---

### SCR-CATALOG-002 — Service detail

**Wireframe:** `WF-CATALOG-002` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** detail · **Density:** `reading` · **Classification:** New
**Actors:** Public visitor; Patient; Guardian
**Flows:** `FLOW-CATALOG-001`
**Requirements:** `FR-CATALOG-001`
**Data / action contract:** `API-CATALOG-001`

**Purpose.** Describe one service family in plain, non-diagnostic language and carry its service code into provider search. Success is the visitor understanding what the family covers well enough to search for it. It exists because `API-ELIG-001` requires a service code and the patient must choose one meaningfully.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The family name and what it is for, in non-diagnostic language. |
| Primary facts | What the family typically covers, in plain language. |
| Related history | Where clinical review state affects what availability means. |
| Action | Find providers for this service. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` |
| Components | `CMP-ELIG-002` (`governed display mode from the provider price fact`) `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`patient`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-CATALOG-001` | `200 application/json` with `data: ServiceGroup[]` and `meta.mode: "evaluation" \| "production"`. | No body. Catalog mode is server configuration, not a client-selectable query parameter. |

- `API-CATALOG-001` supplies the family description and its `service_code`, which `API-ELIG-001` requires.
- The family's mapped procedure items are **not presented as a selectable or priced list**, because only a clinician decides which procedure applies.
- Missing-data behaviour: where a description is absent the screen states that detail is not yet published rather than rendering an empty section.

**State**

- Lifecycle statuses visible: clinical review state where it affects availability meaning
- Permission model: Public visitor, patient or guardian. Identical projection for all three.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Find providers | primary | always; the service code is carried forward | never unavailable |
| Back to groups | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-013` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011`
- No status this screen shows belongs to a governed lifecycle machine, so it binds no `TXT-STATE-*` rule. What the state section lists is descriptive condition, not a status chip drawn from a state machine.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-PLATFORM-003` | a rate-limited read issued repeatedly from this surface | `TXT-ERR-PLATFORM-003` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-FINANCE-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the status and identity region.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is family identity, description, action. The description is prose, not a list of procedures.
- Announcements: Nothing announces.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- One reading column; the service code is never displayed to the patient, only carried.

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

Not applicable here: `empty-no-data` `empty-filtered`. This surface is a public read with no filter, no scope and no mutation.

**Acceptance criteria**

1. No copy recommends treatment or implies a clinical opinion.
2. No procedure item appears as a selectable or priced option.
3. The service code is carried into provider search without being shown as a code.
4. Clinical review state is surfaced only where it changes what availability means.

**Traceability.** `SCR-CATALOG-002` · `WF-CATALOG-002` · flows `FLOW-CATALOG-001` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` · components `CMP-ELIG-002` `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-013` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-FINANCE-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-PLATFORM-003` `ERR-PLATFORM-004` · requirements `FR-CATALOG-001` · contract `API-CATALOG-001`

---

### SCR-ELIG-001 — Provider search

**Wireframe:** `WF-ELIG-001` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** detail · **Density:** `reading` · **Classification:** New
**Actors:** Public visitor; Patient; Guardian
**Flows:** `FLOW-CATALOG-001` `FLOW-ELIG-001` `FLOW-PLATFORM-004`
**Requirements:** `FR-ELIG-001`, `FR-ELIG-006`
**Data / action contract:** `API-ELIG-001`

**Purpose.** Let the patient state what they need and where, and reach results. Success is a search that returns options the patient can act on. It exists because a service code is mandatory for provider search: the patient cannot search without naming a service.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The chosen service, carried in or selected here. |
| Primary facts | Area, as a within-city filter. |
| Related history | Availability filters where the booking implementation supports them. |
| Action | Search. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` |
| Components | `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-007` (`discovery`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-ELIG-001` | `200` collection of provider-service-branch decision cards with stable provider/branch IDs, practical eligibility state, the provider's price presentation as `{ mode, amount?, amount_min?, amount_max?, currency }` per `FR-ELIG-018`, an optional patient-safe summary of what the price includes and what may cost extra, funded-protection availability, verified-experience rating where available, branch/location summary, nearest available appointment where available, and assessment timestamp. | `service_code: string` required; `area: string\|null`; appointment availability/date filters as supported by implemented booking availability. |

- `API-ELIG-001` requires `service_code`; area and availability filters are optional.
- **Aleppo only**, so area is a within-city value and never a city selector. No canonical source supplies a second city, and none is offered.
- Missing-data behaviour: if the area list fails to load, search proceeds without an area filter and the surface says the area filter is unavailable rather than showing an empty selector.

**State**

- Lifecycle statuses visible: none
- Permission model: Public visitor, patient or guardian.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Search | primary | a service is named | DISABLED until a service is chosen, with the reason bound to the control |
| Change the service | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011`
- No status this screen shows belongs to a governed lifecycle machine, so it binds no `TXT-STATE-*` rule. What the state section lists is descriptive condition, not a status chip drawn from a state machine.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-PLATFORM-003` | a rate-limited read issued repeatedly from this surface | `TXT-ERR-PLATFORM-003` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the status and identity region.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is service, filters, action. Each filter carries a persistent visible label.
- Announcements: Nothing announces before results exist.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- Filters stay visible in the reading column rather than behind a drawer, so the filter that caused an empty result is always present on the results screen.

**Loading and failure**

| State | Behaviour on this screen |
|---|---|
| `loading-initial` | Skeleton at content height through `WGT-PLATFORM-001`. No empty state and no action is rendered while the first read is in flight. |
| `loading-refresh` | Content stays visible and interactive. A refresh never steals focus and never scrolls the surface. |
| `empty-filtered` | `CMP-PLATFORM-009` `filtered-empty`. The applied filter stays visible and is named as the cause; the recovery relaxes or clears it. |
| `partial` | The region that loaded stays interactive; the region that failed names itself and offers retry in place. Never presented as complete. |
| `stale` | `CMP-PLATFORM-010` `stale` with the as-of time. Committing actions are withdrawn; read actions remain. |
| `error-fetch` | `CMP-PLATFORM-010` `fetch-failure`. Last known safe context preserved, retry in place, entered input untouched. |
| `error-permission` | `CMP-PLATFORM-010` `permission-denied`. Wins over every other state, no retry, affected actions removed structurally rather than disabled. |
| `success` | Content. |
| `offline / unstable` | Last known data with its as-of time, the condition stated per `TXT-PLATFORM-009`, and committing actions withdrawn unless the command is idempotent-resumable. |

Not applicable here: `empty-no-data`. This surface issues no command and holds no result set of its own.

**Acceptance criteria**

1. Search is unavailable until a service is named, and the reason is stated.
2. Area never presents as a city selector.
3. The applied filter set persists and is visible on the results surface.

**Traceability.** `SCR-ELIG-001` · `WF-ELIG-001` · flows `FLOW-CATALOG-001` `FLOW-ELIG-001` `FLOW-PLATFORM-004` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` · components `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-007` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-PLATFORM-001` `ERR-PLATFORM-003` `ERR-PLATFORM-004` · requirements `FR-ELIG-001`, `FR-ELIG-006` · contract `API-ELIG-001`

---

### SCR-ELIG-002 — Provider results

**Wireframe:** `WF-ELIG-002` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** detail · **Density:** `reading` · **Classification:** New
**Actors:** Public visitor; Patient; Guardian
**Flows:** `FLOW-BOOKING-001` `FLOW-ELIG-001` `FLOW-ELIG-002` `FLOW-ELIG-004` `FLOW-ELIG-014`
**Requirements:** `FR-ELIG-001`, `FR-ELIG-005`, `FR-ELIG-016`
**Data / action contract:** `API-ELIG-001`

**Purpose.** Show every currently eligible provider, service and branch combination for the requested service, each as a full decision card. Success is the patient choosing one option or selecting up to three to compare. It exists because eligibility is contextual per service and branch, so a result row is a scoped decision rather than a directory entry.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The applied service and area, always visible. |
| Primary facts | One row per eligible option, carrying the full attribute set. |
| Related history | The comparison tray, capped at three, as a region of this screen rather than a separate screen. |
| Action | Choose an option, or compare the selected ones. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-ELIG-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` |
| Components | `CMP-ELIG-001` (`card`) `CMP-ELIG-002` (`governed display mode from the provider price fact`) `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`patient`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-ELIG-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-ELIG-001` | `200` collection of provider-service-branch decision cards with stable provider/branch IDs, practical eligibility state, the provider's price presentation as `{ mode, amount?, amount_min?, amount_max?, currency }` per `FR-ELIG-018`, an optional patient-safe summary of what the price includes and what may cost extra, funded-protection availability, verified-experience rating where available, branch/location summary, nearest available appointment where available, and assessment timestamp. | `service_code: string` required; `area: string\|null`; appointment availability/date filters as supported by implemented booking availability. |

- `API-ELIG-001` supplies the attribute set fixed by `PO-UX-04`. **The response carries no internal classification value, no service risk level, no comparison value, no sample count, no confidence figure and no market-average label**, and this screen requests none.
- Missing-data behaviour: a rating or a nearest appointment that is absent renders as unavailable, never as zero and never as none. A price renders in its governed display mode and a free service reads as free, not as missing data.

**State**

- Lifecycle statuses visible: `ELIGIBLE` only — failing and pending scopes are absent from bookable results
- Permission model: Public visitor, patient or guardian. The projection does not vary with authentication.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Open an option | primary | a result exists | the region is replaced by the appropriate empty state |
| Book directly from a row | secondary | the option is currently eligible | UNAVAILABLE on an option that stopped being eligible, which is marked unavailable and loses its booking action |
| Add to comparison | secondary | fewer than three options are selected | DISABLED at three, with the cap stated |
| Compare | secondary | two or three options of the same service are selected | DISABLED below two, with the reason stated |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-013` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-ELIG-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-ELIG-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-PLATFORM-003` | a rate-limited read issued repeatedly from this surface | `TXT-ERR-PLATFORM-003` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-FINANCE-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the status and identity region.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is applied query, result list, comparison tray. Each row announces as one unit with its attributes in the fixed order, so two rows are comparable without sight.
- Announcements: The result count announces when it changes. Adding to comparison announces the selection count against the cap.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- One row per reading-column block. The comparison tray is a persistent region at the end of the column, never a floating overlay that could obscure a focused row.

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

Not applicable here: `empty-no-data` `empty-filtered`. No state is omitted on this surface.

**Acceptance criteria**

1. No row shows a composite score, a rank, or any internal classification symbol.
2. No row labels a price a market or city average.
3. A from-amount or a range reads as a starting point or a span, never as a quoted total.
4. Empty-filtered and empty-no-data are distinct states with different recovery.
5. Comparison selection is capped at three options of one service.

**Traceability.** `SCR-ELIG-002` · `WF-ELIG-002` · flows `FLOW-BOOKING-001` `FLOW-ELIG-001` `FLOW-ELIG-002` `FLOW-ELIG-004` `FLOW-ELIG-014` · widgets `WGT-ELIG-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` · components `CMP-ELIG-001` `CMP-ELIG-002` `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-ELIG-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-013` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-ELIG-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-FINANCE-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-PLATFORM-001` `ERR-PLATFORM-003` `ERR-PLATFORM-004` · requirements `FR-ELIG-001`, `FR-ELIG-005`, `FR-ELIG-016` · contract `API-ELIG-001`

---

### SCR-ELIG-003 — Provider decision card

**Wireframe:** `WF-ELIG-003` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** form · **Density:** `reading` · **Classification:** New
**Actors:** Public visitor; Patient; Guardian
**Flows:** `FLOW-BOOKING-001` `FLOW-ELIG-002` `FLOW-ELIG-003`
**Requirements:** `FR-ELIG-016`, `FR-ELIG-009`, `FR-ELIG-010`
**Data / action contract:** `API-ELIG-001`

**Purpose.** Give the patient the full decision card for one provider, service and branch combination so they can commit to it. Success is the patient booking, or deciding not to. It is optional in the booking path because a result row already carries this data: this screen deepens rather than gates.

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | The exact provider, service and branch this card is scoped to. |
| Required input | The full attribute set with the assessment time prominent. |
| Validation and consequence | The eligibility explanation, one navigation away. |
| Action | Book this option. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-ELIG-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` |
| Components | `CMP-ELIG-001` (`card`) `CMP-ELIG-002` (`governed display mode from the provider price fact`) `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-ELIG-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-ELIG-001` | `200` collection of provider-service-branch decision cards with stable provider/branch IDs, practical eligibility state, the provider's price presentation as `{ mode, amount?, amount_min?, amount_max?, currency }` per `FR-ELIG-018`, an optional patient-safe summary of what the price includes and what may cost extra, funded-protection availability, verified-experience rating where available, branch/location summary, nearest available appointment where available, and assessment timestamp. | `service_code: string` required; `area: string\|null`; appointment availability/date filters as supported by implemented booking availability. |

- `API-ELIG-001` supplies the same attribute set as the result row. The price is the provider's own recorded price in its governed display mode.
- **Protection is presented as its meaning with funded protection disabled**, never as insurance and never as a guarantee.
- Missing-data behaviour: an absent nearest appointment renders as unavailable and does not block booking, because availability is resolved at commit anyway.

**State**

- Lifecycle statuses visible: practical eligibility meaning; assessment time
- Permission model: Public visitor, patient or guardian. Booking gates to verification and returns with the option context intact.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Book this option | primary | the option is currently eligible | UNAVAILABLE if the option stopped being eligible, with the explanation route offered instead |
| Why is this available | secondary | always | never unavailable |
| Back to results | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-013` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-ELIG-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-ELIG-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-PLATFORM-003` | a rate-limited read issued repeatedly from this surface | `TXT-ERR-PLATFORM-003` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-FINANCE-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is scope, attributes, explanation route, action. The card announces as one unit.
- Announcements: An eligibility change while the card is open announces politely; if it removes the booking action, it announces and focus moves to the explanation.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- One reading column; the assessment time stays adjacent to the availability meaning at every text size.

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

Not applicable here: `empty-no-data` `empty-filtered`. The card is a single scoped read with no list and no filter.

**Acceptance criteria**

1. The card is scoped to one doctor, service and branch, never to a provider profile spanning services.
2. The price is never presented as a quality grade and never as a claimed market average.
3. A legitimately free service reads as free rather than as missing data.
4. Requires-a-plan reads as a price only an examination can settle.
5. Protection never reads as insurance or as a guaranteed outcome.

**Traceability.** `SCR-ELIG-003` · `WF-ELIG-003` · flows `FLOW-BOOKING-001` `FLOW-ELIG-002` `FLOW-ELIG-003` · widgets `WGT-ELIG-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` · components `CMP-ELIG-001` `CMP-ELIG-002` `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-ELIG-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-013` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-ELIG-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-FINANCE-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-PLATFORM-001` `ERR-PLATFORM-003` `ERR-PLATFORM-004` · requirements `FR-ELIG-016`, `FR-ELIG-009`, `FR-ELIG-010` · contract `API-ELIG-001`

---

### SCR-ELIG-004 — Eligibility explanation

**Wireframe:** `WF-ELIG-004` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** detail · **Density:** `reading` · **Classification:** New
**Actors:** Public visitor; Patient; Guardian
**Flows:** `FLOW-ELIG-002` `FLOW-ELIG-003`
**Requirements:** `FR-ELIG-017`, `FR-ELIG-008`
**Data / action contract:** `API-ELIG-002`

**Purpose.** Explain, in the patient's terms, why a provider, service and branch combination is or is not currently available. Success is the patient knowing whether to wait or choose someone else. It is the most sensitive patient explanation in the product.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The exact service and branch the explanation applies to. |
| Primary facts | The practical meaning of the current state, with still-being-assessed visibly distinct from assessed-and-failed. |
| Related history | The assessment date, because a stale assessment is itself information. |
| Action | Find alternatives, or return to the card. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-ELIG-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` |
| Components | `CMP-ELIG-003` (`patient`) `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`patient`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-013` (`decided-by-person`) |
| Patterns | `IX-ELIG-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-ELIG-002` | `200` with exact service/branch, practical eligibility state, last assessment time, patient-safe reason summary, and pending blockers when applicable. Raw `I`, protected evidence, and reviewer-only detail are excluded. | Path IDs only. |

- `API-ELIG-002` supplies the exact service and branch, the practical eligibility state, the last assessment time, a patient-safe reason summary, and pending blockers where they apply.
- **Confidential evidence, reviewer detail and raw internal values are excluded from the contract itself**, not filtered by the client.
- Missing-data behaviour: where no assessment exists the screen states that assessment has not happened yet, which is different again from pending and from failed.

**State**

- Lifecycle statuses visible: `ELIGIBLE`, `PENDING_EVALUATION`, `SUSPENDED`, `NOT_ELIGIBLE` — as practical meanings, never as enum values
- Permission model: Public visitor, patient or guardian. The patient projection is the only one reachable here.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Find alternatives | primary | always | never unavailable |
| Back to the card | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-ELIG-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-ELIG-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-ELIG-002` | a read or commit against a scope still pending evaluation or missing required evidence | `TXT-ERR-ELIG-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the status and identity region.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is scope, outcome, reason, assessment time. The outcome announces as a triple, never as a colour.
- Announcements: A change from pending to a decided outcome, or the reverse, announces politely.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- One reading column; the controlling reason never truncates at any text size.

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

Not applicable here: `empty-no-data` `empty-filtered`. A single scoped read with no list, no filter and no mutation.

**Acceptance criteria**

1. Still-being-assessed is visibly and audibly distinct from assessed-and-failed.
2. No internal classification symbol, gate list or policy version is reachable from this screen.
3. The exact service, branch and assessment date are always stated.
4. The screen offers no action that could change an outcome.

**Traceability.** `SCR-ELIG-004` · `WF-ELIG-004` · flows `FLOW-ELIG-002` `FLOW-ELIG-003` · widgets `WGT-ELIG-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` · components `CMP-ELIG-003` `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-013` · patterns `IX-ELIG-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-ELIG-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-ELIG-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-ELIG-017`, `FR-ELIG-008` · contract `API-ELIG-002`

---

### SCR-ELIG-005 — Provider comparison

**Wireframe:** `WF-ELIG-005` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** detail · **Density:** `reading` · **Classification:** New
**Actors:** Public visitor; Patient; Guardian
**Flows:** `FLOW-BOOKING-001` `FLOW-ELIG-002` `FLOW-ELIG-003` `FLOW-ELIG-004` `FLOW-ELIG-005` `FLOW-ELIG-014`
**Requirements:** `FR-ELIG-016`, `FR-ELIG-017`
**Data / action contract:** `API-ELIG-001`

**Purpose.** Let the patient compare two or three options for the same requested service, side by side, on the same attributes. Success is a confident choice. It exists because comparing is a real patient job and doing it in the head across screens is where a wrong choice gets made.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The requested service, identical across all columns. |
| Primary facts | One column per option, with attributes aligned across columns so they compare honestly. |
| Related history | The eligibility explanation for any column. |
| Action | Book the chosen option. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-ELIG-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` |
| Components | `CMP-ELIG-001` (`card`) `CMP-ELIG-002` (`governed display mode from the provider price fact`) `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`patient`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-ELIG-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-ELIG-001` | `200` collection of provider-service-branch decision cards with stable provider/branch IDs, practical eligibility state, the provider's price presentation as `{ mode, amount?, amount_min?, amount_max?, currency }` per `FR-ELIG-018`, an optional patient-safe summary of what the price includes and what may cost extra, funded-protection availability, verified-experience rating where available, branch/location summary, nearest available appointment where available, and assessment timestamp. | `service_code: string` required; `area: string\|null`; appointment availability/date filters as supported by implemented booking availability. |

- `API-ELIG-001` supplies every compared attribute. The comparison is **transient session state**: no saved or favourited comparison exists in V1 and none is offered.
- A **cross-service comparison is not possible**: all columns carry the same requested service context.
- Missing-data behaviour: an attribute absent for one option renders as unavailable in that column and the row is still shown, so the reader can see that the comparison is uneven.

**State**

- Lifecycle statuses visible: practical eligibility and availability meaning per option; assessment time per option
- Permission model: Public visitor, patient or guardian.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Book this option | primary | the column is currently eligible | UNAVAILABLE on a column that stopped being eligible, which is marked unavailable and loses its booking action |
| Open one option in full | secondary | always | never unavailable |
| Remove an option | secondary | more than two remain | DISABLED at two, with the minimum stated |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-013` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-ELIG-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-ELIG-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-PLATFORM-003` | a rate-limited read issued repeatedly from this surface | `TXT-ERR-PLATFORM-003` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-FINANCE-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the status and identity region.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is requested service, then one group per option with attributes in the same fixed order, so the comparison survives without the visual grid.
- Announcements: An option that stops being eligible announces politely and its booking action is removed.
- Right-to-left and bidirectional: Columns mirror as a group, so the reading order of the comparison is unchanged. Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- At `profile-c.size-class.compact` the columns stack in selection order with attributes in the same sequence; at `.medium` and `.expanded` two or three columns may sit side by side. At `profile-c.stack-threshold` they always stack.

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

Not applicable here: `empty-no-data` `empty-filtered`. A transient comparison of already-loaded options has no filter and no independent scope.

**Acceptance criteria**

1. No column is marked best and no composite score is computed or displayed anywhere.
2. All columns carry the same requested service; a cross-service comparison is impossible.
3. An option that stops being eligible loses its booking action within the same session.
4. Booking from a column enters the ordinary path and performs the normal booking-time revalidation.
5. No comparison is saved or favourited.

**Traceability.** `SCR-ELIG-005` · `WF-ELIG-005` · flows `FLOW-BOOKING-001` `FLOW-ELIG-002` `FLOW-ELIG-003` `FLOW-ELIG-004` `FLOW-ELIG-005` `FLOW-ELIG-014` · widgets `WGT-ELIG-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` · components `CMP-ELIG-001` `CMP-ELIG-002` `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-ELIG-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-013` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-ELIG-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-FINANCE-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-PLATFORM-001` `ERR-PLATFORM-003` `ERR-PLATFORM-004` · requirements `FR-ELIG-016`, `FR-ELIG-017` · contract `API-ELIG-001`

---

### SCR-BOOKING-001 — Slot selection

**Wireframe:** `WF-BOOKING-001` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** detail · **Density:** `reading` · **Classification:** New
**Actors:** Patient; Guardian with booking authority
**Flows:** `FLOW-BOOKING-001` `FLOW-BOOKING-012` `FLOW-ELIG-002` `FLOW-ELIG-004` `FLOW-ELIG-005`
**Requirements:** `FR-BOOKING-001`
**Data / action contract:** `API-ELIG-001`

**Purpose.** Let the patient choose a time for the option they picked. Success is a selected slot carried into the request review. It exists as its own step because availability here is advisory and the patient needs to understand that before they commit, not after.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The chosen option, echoed read-only so the patient confirms what they are booking. |
| Primary facts | Times grouped by day, each selectable, with availability shown per slot. |
| Related history | The statement that availability is advisory and the time is held at commit. |
| Action | Continue to review. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-BOOKING-001` `WGT-ELIG-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` |
| Components | `CMP-ELIG-001` (`card`) `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`patient`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-ELIG-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-ELIG-001` | `200` collection of provider-service-branch decision cards with stable provider/branch IDs, practical eligibility state, the provider's price presentation as `{ mode, amount?, amount_min?, amount_max?, currency }` per `FR-ELIG-018`, an optional patient-safe summary of what the price includes and what may cost extra, funded-protection availability, verified-experience rating where available, branch/location summary, nearest available appointment where available, and assessment timestamp. | `service_code: string` required; `area: string\|null`; appointment availability/date filters as supported by implemented booking availability. |

- `API-ELIG-001` supplies the nearest available appointment and the option context; slot capacity itself is resolved atomically at submission by `API-BOOKING-001`.
- Missing-data behaviour: a day whose availability did not load says so rather than appearing to have no times. **Availability here is advisory**, so a slot can disappear between display and submit and that is a designed path.

**State**

- Lifecycle statuses visible: slot availability
- Permission model: Patient, or guardian with booking authority. An unauthenticated patient reaching this point gates to verification and returns with the slot context intact.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Continue | primary | a slot is selected | DISABLED until a slot is selected, with the reason bound to the control |
| Change the option | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011`
- No status this screen shows belongs to a governed lifecycle machine, so it binds no `TXT-STATE-*` rule. What the state section lists is descriptive condition, not a status chip drawn from a state machine.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-PLATFORM-003` | a rate-limited read issued repeatedly from this surface | `TXT-ERR-PLATFORM-003` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the status and identity region.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is chosen option, day groups, advisory statement, action. Each slot announces its day, time and availability.
- Announcements: Selecting a slot announces the selection. A slot that becomes unavailable while the screen is open announces politely and is marked in place.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- Slots are a grouped selectable list in the reading column, never a grid requiring horizontal scrolling. Every slot control meets the target floor at every text size.

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

Not applicable here: `empty-no-data` `empty-filtered`. Slot availability is a scoped read with no filter and no independent permission surface.

**Acceptance criteria**

1. The surface states that availability is advisory and the time is held at commit.
2. Every slot is reachable by a control, not only by a gesture.
3. A slot that becomes unavailable is marked in place without discarding the rest of the context.
4. An unauthenticated patient returns here with the slot context intact after verifying.

**Traceability.** `SCR-BOOKING-001` · `WF-BOOKING-001` · flows `FLOW-BOOKING-001` `FLOW-BOOKING-012` `FLOW-ELIG-002` `FLOW-ELIG-004` `FLOW-ELIG-005` · widgets `WGT-BOOKING-001` `WGT-ELIG-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` · components `CMP-ELIG-001` `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-ELIG-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-PLATFORM-001` `ERR-PLATFORM-003` `ERR-PLATFORM-004` · requirements `FR-BOOKING-001` · contract `API-ELIG-001`

---

### SCR-BOOKING-002 — Request review and submit

**Wireframe:** `WF-BOOKING-002` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** form · **Density:** `reading` · **Classification:** New
**Actors:** Patient; Guardian with booking authority
**Flows:** `FLOW-BOOKING-001` `FLOW-ELIG-005`
**Requirements:** `FR-BOOKING-001`, `FR-AUDIT-003`
**Data / action contract:** `API-BOOKING-001`

**Purpose.** Let the patient confirm exactly what they are requesting and submit it. Success is a committed booking request in `REQUESTED` with its response deadline visible. It exists because the commit revalidates publication, eligibility, branch readiness and slot capacity, and each of those can legitimately fail with a different recovery.

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | Who the request is for, and under whose authority when a guardian is acting. |
| Required input | The option, the slot and the price presentation, all read-only. |
| Validation and consequence | What happens after submission, including the provider response deadline. |
| Action | Submit the request, with the submission state inline. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-ELIG-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-010` |
| Components | `CMP-ELIG-001` (`card`) `CMP-ELIG-002` (`governed display mode from the provider price fact`) `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) |
| Patterns | `IX-ELIG-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-BOOKING-001` | `201` with booking ID, state, requested slot, eligibility assessment timestamp, response deadline metadata, and next permitted actions. | `patient_id: string` only when acting under an authorized grant, otherwise implicit current patient; `provider_id: string`, `branch_id: string`, `service_code: string`, `slot_id: string`; idempotency key required. |

- `API-BOOKING-001` takes the provider, branch, service and slot, plus the patient identity only when acting under a grant, and requires an idempotency key.
- **Revalidation happens inside the transaction**, so publication, eligibility, branch readiness and capacity are all re-checked at commit rather than trusted from the read.
- Missing-data behaviour: the price presentation shown here is the same governed display mode as the option card and is never recomputed on this screen.

**State**

- Lifecycle statuses visible: `REQUESTED` on success; the response deadline
- Permission model: Patient, or guardian with booking authority. **When acting as guardian, the acting and subject identities are both evident on this screen**, because this is a committing surface.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Submit the request | primary | the option and slot are still selected and no commit is in flight | DISABLED while a commit is in flight; UNAVAILABLE against a stale read, which is re-read first |
| Change the time | secondary | always before commit | HIDDEN once the request has committed, because this surface then shows an outcome rather than a draft |
| Change the option | secondary | always before commit | HIDDEN after commit |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-013` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-BOOKING-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-BOOKING-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-BOOKING-001` | a commit that resolves slot capacity atomically and finds none | `TXT-ERR-BOOKING-001` |
| `ERR-ELIG-001` | a commit that revalidates provider, service or branch eligibility and finds it not currently passing | `TXT-ERR-ELIG-001` |
| `ERR-ELIG-002` | a read or commit against a scope still pending evaluation or missing required evidence | `TXT-ERR-ELIG-002` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-FINANCE-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is subject context, request summary, consequence, action. The submission state is programmatically associated with the submit control.
- Announcements: The committed outcome announces politely and focus moves to the resulting state. Submitting is not announced as submitted before the server commits.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- The request summary and the submit action stay in one reading column; success is a state of this screen rather than a separate screen, so no navigation is required to see the outcome.

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

Not applicable here: `empty-no-data` `empty-filtered`. A confirmation surface has no list and no filter.

**Acceptance criteria**

1. The request is never shown as submitted before the server commits.
2. A retry after a failed submit reuses the original idempotency key.
3. Eligibility failure, pending evaluation and capacity failure each produce a distinct recovery.
4. Under representation, both the acting and the subject identity are visible before submit.
5. Success renders on this screen with the response deadline visible.

**Traceability.** `SCR-BOOKING-002` · `WF-BOOKING-002` · flows `FLOW-BOOKING-001` `FLOW-ELIG-005` · widgets `WGT-ELIG-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-010` · components `CMP-ELIG-001` `CMP-ELIG-002` `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` · patterns `IX-ELIG-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-013` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-BOOKING-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-FINANCE-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-AUDIT-001` `ERR-BOOKING-001` `ERR-ELIG-001` `ERR-ELIG-002` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` · requirements `FR-BOOKING-001`, `FR-AUDIT-003` · contract `API-BOOKING-001`

---

### SCR-BOOKING-003 — My bookings

**Wireframe:** `WF-BOOKING-003` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** list-and-detail · **Density:** `reading` · **Classification:** New
**Actors:** Patient; Guardian within grant scope
**Flows:** `FLOW-BOOKING-006`
**Requirements:** `FR-BOOKING-001`, `FR-BOOKING-002`, `FR-BOOKING-003`
**Data / action contract:** `API-BOOKING-002`

**Purpose.** Give the patient every booking they hold, in every state, with remaining time visible in the list. Success is the patient reaching the booking that needs them. It exists because deadline-bearing states must surface remaining time before the patient opens anything.

**Hierarchy** — Phase 2 priority order, not reopened: context/filter > list > selected detail > state-aware action.

| Region | Contents |
|---|---|
| Context and filter | Which patient the bookings belong to, and the state filter. |
| List | One row per booking with its state, provider, branch, time and remaining time. |
| Selected detail | The selected booking. |
| State-aware action | Row-level routes into the booking detail. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-006` (`reading-list`) `CMP-PLATFORM-007` (`discovery`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-BOOKING-002` | `200` collection of booking summaries with stable state, provider/service/branch summary, times, deadlines, and next permitted action metadata. | Optional state/date filters; pagination only if/when required by implementation volume. |

- `API-BOOKING-002` supplies booking summaries with stable state, provider, service and branch summary, times, deadlines and next permitted action metadata.
- Missing-data behaviour: a row whose deadline did not load says the remaining time is unavailable. It is never rendered as having no deadline.

**State**

- Lifecycle statuses visible: all seven booking states
- Permission model: Patient acting for themselves, or a guardian acting inside an active grant. Under representation both the acting and the subject identity are visible, and every request is re-evaluated server-side; switching subject grants nothing. **Guardian scope isolation is a correctness requirement here, not a filter convenience**: a booking outside the grant is not returned at all.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Open a booking | primary | a row exists | the list is replaced by the appropriate empty state |
| Filter by state | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-BOOKING-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-BOOKING-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the filter or search control where one exists, otherwise the first row.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is subject context, filter, list. The list is exposed with its row count; each row announces state, provider, time and remaining time.
- Announcements: The result count announces when the filter changes it. A booking whose state changes while the list is open announces politely.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- One booking per reading-column block. Remaining time stacks beneath the booking identity at `profile-c.stack-threshold` rather than being dropped.

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

1. Remaining time is visible in the list, not only in detail.
2. A booking outside the active grant is not returned and not rendered.
3. Filtered-empty and genuinely-empty read differently and recover differently.
4. Returning from a booking detail restores focus to its row.

**Traceability.** `SCR-BOOKING-003` · `WF-BOOKING-003` · flows `FLOW-BOOKING-006` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-006` `CMP-PLATFORM-007` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-BOOKING-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` · requirements `FR-BOOKING-001`, `FR-BOOKING-002`, `FR-BOOKING-003` · contract `API-BOOKING-002`

---

### SCR-BOOKING-004 — Booking detail

**Wireframe:** `WF-BOOKING-004` · **Platform:** Patient app (Profile C) · **Runtime:** React Native
**Archetype:** detail · **Density:** `reading` · **Classification:** New
**Actors:** Patient; Guardian within grant scope
**Flows:** `FLOW-BOOKING-001` `FLOW-BOOKING-006` `FLOW-BOOKING-007` `FLOW-BOOKING-008` `FLOW-BOOKING-013` `FLOW-BOOKING-014` `FLOW-ELIG-005` `FLOW-ELIG-015`
**Requirements:** `FR-BOOKING-001`, `FR-BOOKING-002`, `FR-BOOKING-003`
**Data / action contract:** `API-BOOKING-003`

**Purpose.** Show one booking authoritatively and offer only the actions its current state and policy permit. Success is the patient understanding where the booking stands and acting on it. It re-fetches on entry because a deep link that arrived hours ago cannot be trusted about a deadline.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The booking state, the provider, the branch and the appointment time. |
| Primary facts | The alternative proposal where one exists, and the deadline that governs it. |
| Related history | Cancellation and no-show history, and the route to the case. |
| Action | Only the actions the current state permits. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-006` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`patient`) `CMP-PLATFORM-003` (`self`) `CMP-PLATFORM-004` (`sticky`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-006` (`reading-list`) `CMP-PLATFORM-008` (`record`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `API-BOOKING-003` | `200` with booking details, state, provider response or alternative proposal if present, relevant deadlines, cancellation/no-show history summary, and allowed next actions. | none — this surface issues no command against it |

- `API-BOOKING-003` supplies the booking detail, its state, the provider response or alternative proposal, relevant deadlines, cancellation and no-show history, and the **allowed next actions**, which this screen reads rather than infers from the status.
- Missing-data behaviour: the screen re-fetches authoritative state on entry. If that read fails, the last known state renders as stale with its as-of time and every committing action is withdrawn.

**State**

- Lifecycle statuses visible: all seven booking states; alternative proposal; cancellation and no-show history
- Permission model: Patient acting for themselves, or a guardian acting inside an active grant. Under representation both the acting and the subject identity are visible, and every request is re-evaluated server-side; switching subject grants nothing.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Respond to the alternative | primary | an alternative proposal is pending and its deadline has not lapsed | UNAVAILABLE once the deadline lapses, with the closure explained as an unconfirmed request rather than a penalty |
| Cancel the booking | destructive | the state and policy permit cancellation | UNAVAILABLE in states that forbid it, stated as an explained absence |
| Open the case | secondary | a case exists | absent until one does |
| Request a reschedule | secondary | the booking is confirmed and not in eligibility review | UNAVAILABLE against a booking in eligibility review, with the controlling dependency named |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-BOOKING-001` `TXT-STATE-BOOKING-002`
- Lifecycle labels for every status above are owned by `TXT-STATE-BOOKING-001` `TXT-STATE-BOOKING-002` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022`
- Focus entry: the status and identity region.
- Keyboard: No keyboard model. Profile C is touch and assistive-gesture only, every gesture has a control equivalent per `A11Y-PLATFORM-003`, and no hover state is emitted.
- Screen-reader hierarchy: Landmark order is state summary, proposal, history, actions. The state announces as a triple.
- Announcements: A state change while the screen is open announces politely and focus moves to the state summary. A lapsing deadline announces when it enters its approaching window.
- Right-to-left and bidirectional: Interface direction is right-to-left. Amounts with currency, dates, times, service and procedure codes, record identifiers and Latin clinic names are bidirectionally isolated per `A11Y-PLATFORM-030`; directional icons mirror and status icons do not.

**Responsive**

- One primary reading column at `profile-c.size-class.compact`, `.medium` and `.expanded`, capped at `profile-c.reading-column-max`; a wider class produces whitespace, not a second pane. At `profile-c.stack-threshold` critical regions stack rather than truncate, and the primary action stays reachable and understandable. Verified for horizontal overflow at every `primitive.verification-width`.
- One reading column with the state summary first; the action bar uses the sticky variant so the permitted action stays reachable while the history scrolls.

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

Not applicable here: `empty-filtered`. A single-record detail has no list-level filter of its own.

**Acceptance criteria**

1. The screen re-fetches authoritative state on entry, including from a deep link.
2. Only actions the server reports as permitted are rendered.
3. An action forbidden by state is an explained absence, never a disabled control.
4. A pending alternative never replaces the original request in the reading order.
5. No cancellation copy implies a charge or a penalty.

**Traceability.** `SCR-BOOKING-004` · `WF-BOOKING-004` · flows `FLOW-BOOKING-001` `FLOW-BOOKING-006` `FLOW-BOOKING-007` `FLOW-BOOKING-008` `FLOW-BOOKING-013` `FLOW-BOOKING-014` `FLOW-ELIG-005` `FLOW-ELIG-015` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-006` · components `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-006` `CMP-PLATFORM-008` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-009` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-BOOKING-001` `TXT-STATE-BOOKING-002` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-003` `A11Y-PLATFORM-013` `A11Y-PLATFORM-035` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` `A11Y-PLATFORM-022` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` · requirements `FR-BOOKING-001`, `FR-BOOKING-002`, `FR-BOOKING-003` · contract `API-BOOKING-003`

---
