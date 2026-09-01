# Screen Specifications — Clinic / Doctor panel (1 of 3)

**Phase:** UX 4 — Widget and Screen Specifications
**Platform:** Clinic / Doctor panel · Profile A · Filament panel
**Schema:** `PHASE_04_IMPLEMENTATION_PLAN.md` section 6. **Widgets:** `WIDGET_SPECS.md`. **Map:** `SCREEN_SPEC_MAP.md`.

Every block carries the same thirteen sections in the same order. A section that does not apply says so and why.

---
### SCR-IDENTITY-009 — Join UberTib

**Wireframe:** `WF-IDENTITY-009` · **Platform:** Clinic / Doctor panel (Profile A) · **Runtime:** Filament panel
**Archetype:** detail · **Density:** `operational` · **Classification:** New
**Actors:** Public, unauthenticated
**Flows:** `FLOW-IDENTITY-005` `FLOW-IDENTITY-010` `FLOW-IDENTITY-020`
**Requirements:** `FR-IDENTITY-001`
**Data / action contract:** `SDC-IDENTITY-001`

**Purpose.** Tell a prospective provider what an UberTib application requires before they start, and let them begin or resume. Success is an applicant who starts with an accurate picture of the work and the outcome. It exists as a public view outside the panel because Filament supplies almost nothing here.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | What UberTib is for a provider, stated without implying that approval activates services or makes the provider bookable. |
| Primary facts | What the application requires: facts, branch details and evidence. |
| Related history | The route for a returning applicant to resume. |
| Action | Begin an application. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-003` |
| Components | `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-IDENTITY-001` | application ID, provider type, applicant source facts, primary branch source facts, evidence item statuses, validation issues, requested changes, current application status, last saved/submitted timestamps. | create draft; update permitted draft/requested-change fields; attach/remove draft evidence references; submit; resubmit after requested changes; withdraw before final decision where policy allows. |

- This surface reads nothing from `SDC-IDENTITY-001` until the applicant begins; it states the requirement set the contract defines.
- Missing-data behaviour: none applies. The requirement statement is static content, not a projection.

**State**

- Lifecycle statuses visible: none
- Permission model: Public, unauthenticated. No provider scope exists yet.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Begin an application | primary | always | never unavailable |
| Resume an application | secondary | always; the applicant verifies their contact to resume | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011`
- No status this screen shows belongs to a governed lifecycle machine, so it binds no `TXT-STATE-*` rule. What the state section lists is descriptive condition, not a status chip drawn from a state machine.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the status and identity region.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is purpose, requirements, resume route, action.
- Announcements: Nothing announces.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- A single reading column inside a custom public view; it does not use the panel shell and does not inherit its chrome.

**Loading and failure**

| State | Behaviour on this screen |
|---|---|
| `loading-initial` | Skeleton at content height through `WGT-PLATFORM-001`. No empty state and no action is rendered while the first read is in flight. |
| `loading-refresh` | Content stays visible and interactive. A refresh never steals focus and never scrolls the surface. |
| `partial` | The region that loaded stays interactive; the region that failed names itself and offers retry in place. Never presented as complete. |
| `stale` | `CMP-PLATFORM-010` `stale` with the as-of time. Committing actions are withdrawn; read actions remain. |
| `error-fetch` | `CMP-PLATFORM-010` `fetch-failure`. Last known safe context preserved, retry in place, entered input untouched. |
| `success` | Content. |

Not applicable here: `empty-no-data` `empty-filtered` `error-permission`. A public statement of requirements reads no scoped projection.

**Acceptance criteria**

1. The screen states what the application requires before the applicant starts.
2. **No copy implies that approval activates services or makes the provider bookable.**
3. A returning applicant can resume without creating a second application.

**Traceability.** `SCR-IDENTITY-009` · `WF-IDENTITY-009` · flows `FLOW-IDENTITY-005` `FLOW-IDENTITY-010` `FLOW-IDENTITY-020` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-003` · components `CMP-PLATFORM-004` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-IDENTITY-001` · contract `SDC-IDENTITY-001`

---

### SCR-IDENTITY-010 — Provider type

**Wireframe:** `WF-IDENTITY-010` · **Platform:** Clinic / Doctor panel (Profile A) · **Runtime:** Filament panel
**Archetype:** detail · **Density:** `operational` · **Classification:** New
**Actors:** Public, unauthenticated
**Flows:** `FLOW-IDENTITY-005`
**Requirements:** `FR-IDENTITY-001`
**Data / action contract:** `SDC-IDENTITY-001`

**Purpose.** Let the applicant choose their provider type, which determines which source facts and evidence the rest of the application requires. Success is a choice made with its consequences understood. It is a distinct step rather than a field because it changes the shape of everything after it.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The two provider types. |
| Primary facts | What each type will require in facts and evidence. |
| Related history | That the choice determines the rest of the application. |
| Action | Continue. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-003` |
| Components | `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-IDENTITY-001` | application ID, provider type, applicant source facts, primary branch source facts, evidence item statuses, validation issues, requested changes, current application status, last saved/submitted timestamps. | create draft; update permitted draft/requested-change fields; attach/remove draft evidence references; submit; resubmit after requested changes; withdraw before final decision where policy allows. |

- `SDC-IDENTITY-001` records the provider type on the draft application. **The two types are the only options the canonical decision establishes**, and no third is offered.
- Missing-data behaviour: none applies before a draft exists.

**State**

- Lifecycle statuses visible: none
- Permission model: Public, unauthenticated.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Continue with this type | primary | a type is selected | DISABLED until a type is selected, with the reason bound to the control |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011`
- No status this screen shows belongs to a governed lifecycle machine, so it binds no `TXT-STATE-*` rule. What the state section lists is descriptive condition, not a status chip drawn from a state machine.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the status and identity region.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is the two options, their consequences, the action. Each option announces with what it will require.
- Announcements: Nothing announces.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- The two options stack with their consequences at `profile-a.content-width.narrow` and sit side by side at `.wide`; the consequence text is never truncated to fit.

**Loading and failure**

| State | Behaviour on this screen |
|---|---|
| `loading-initial` | Skeleton at content height through `WGT-PLATFORM-001`. No empty state and no action is rendered while the first read is in flight. |
| `loading-refresh` | Content stays visible and interactive. A refresh never steals focus and never scrolls the surface. |
| `partial` | The region that loaded stays interactive; the region that failed names itself and offers retry in place. Never presented as complete. |
| `stale` | `CMP-PLATFORM-010` `stale` with the as-of time. Committing actions are withdrawn; read actions remain. |
| `error-fetch` | `CMP-PLATFORM-010` `fetch-failure`. Last known safe context preserved, retry in place, entered input untouched. |
| `success` | Content. |

Not applicable here: `empty-no-data` `empty-filtered` `error-permission`. A pre-draft choice reads no scoped projection.

**Acceptance criteria**

1. The consequences of each choice are evident before selecting.
2. Exactly two provider types are offered.
3. The choice determines the required facts and evidence in every later step.

**Traceability.** `SCR-IDENTITY-010` · `WF-IDENTITY-010` · flows `FLOW-IDENTITY-005` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-003` · components `CMP-PLATFORM-004` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-IDENTITY-001` · contract `SDC-IDENTITY-001`

---

### SCR-IDENTITY-011 — Applicant contact verification

**Wireframe:** `WF-IDENTITY-011` · **Platform:** Clinic / Doctor panel (Profile A) · **Runtime:** Filament panel
**Archetype:** form · **Density:** `operational` · **Classification:** New
**Actors:** Public pre-authentication applicant
**Flows:** `FLOW-IDENTITY-005`
**Requirements:** `FR-IDENTITY-001`
**Data / action contract:** `SDC-IDENTITY-001`

**Purpose.** Verify the applicant's primary contact before the application can be submitted, and make draft resumption possible. Success is a verified contact bound to the draft. Verifying here rather than at submission is what makes a draft resumable by the same applicant.

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | The contact being verified. |
| Required input | The code field and the attempts remaining. |
| Validation and consequence | The resend window. |
| Action | Verify. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-IDENTITY-001` `WGT-PLATFORM-001` `WGT-PLATFORM-003` `WGT-PLATFORM-010` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-IDENTITY-001` | application ID, provider type, applicant source facts, primary branch source facts, evidence item statuses, validation issues, requested changes, current application status, last saved/submitted timestamps. | create draft; update permitted draft/requested-change fields; attach/remove draft evidence references; submit; resubmit after requested changes; withdraw before final decision where policy allows. |

- `SDC-IDENTITY-001` records the verified contact on the application. The same throttle and attempt semantics apply as on the patient path.
- Missing-data behaviour: where the server supplies no retry window, no countdown is shown.

**State**

- Lifecycle statuses visible: contact verification state
- Permission model: Public pre-authentication applicant. Privileged production access later requires a non-SMS second factor, which is a panel-access concern rather than an application concern.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Verify | primary | a code is entered and attempts remain | DISABLED while a verification is in flight; UNAVAILABLE with the route to a new code once attempts are exhausted or the code expired |
| Resend a code | secondary | no throttle window is in force | DISABLED while the throttle window runs, with the remaining wait bound to it |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011`
- No status this screen shows belongs to a governed lifecycle machine, so it binds no `TXT-STATE-*` rule. What the state section lists is descriptive condition, not a status chip drawn from a state machine.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-IDENTITY-003` | a verification-code resend inside the throttle window | `TXT-ERR-IDENTITY-003` |
| `ERR-IDENTITY-004` | a code that is invalid, expired, already used, or whose attempts are exhausted | `TXT-ERR-IDENTITY-004` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-029` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is contact, field, attempts, resend, action.
- Announcements: The throttle window announces at its start and end. A failed verification announces with attempts remaining.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- A single column form; the field, the action and the resend control stay together at every content width.

**Loading and failure**

| State | Behaviour on this screen |
|---|---|
| `loading-initial` | Skeleton at content height through `WGT-PLATFORM-001`. No empty state and no action is rendered while the first read is in flight. |
| `loading-refresh` | Content stays visible and interactive. A refresh never steals focus and never scrolls the surface. |
| `partial` | The region that loaded stays interactive; the region that failed names itself and offers retry in place. Never presented as complete. |
| `stale` | `CMP-PLATFORM-010` `stale` with the as-of time. Committing actions are withdrawn; read actions remain. |
| `error-fetch` | `CMP-PLATFORM-010` `fetch-failure`. Last known safe context preserved, retry in place, entered input untouched. |
| `success` | Content. |

Not applicable here: `empty-no-data` `empty-filtered` `error-permission`. Pre-authentication verification reads no scoped business projection.

**Acceptance criteria**

1. The primary contact is verified before final submission is possible.
2. A draft is resumable only by the same verified applicant.
3. Paste and password managers are never blocked in the code field.
4. A fabricated countdown never appears.

**Traceability.** `SCR-IDENTITY-011` · `WF-IDENTITY-011` · flows `FLOW-IDENTITY-005` · widgets `WGT-IDENTITY-001` `WGT-PLATFORM-001` `WGT-PLATFORM-003` `WGT-PLATFORM-010` · components `CMP-PLATFORM-001` `CMP-PLATFORM-004` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-029` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-AUDIT-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-IDENTITY-003` `ERR-IDENTITY-004` `ERR-PLATFORM-001` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-IDENTITY-001` · contract `SDC-IDENTITY-001`

---

### SCR-IDENTITY-012 — Application workspace

**Wireframe:** `WF-IDENTITY-012` · **Platform:** Clinic / Doctor panel (Profile A) · **Runtime:** Filament panel
**Archetype:** workspace · **Density:** `dense` · **Classification:** New
**Actors:** Verified applicant, own applications only
**Flows:** `FLOW-IDENTITY-005` `FLOW-IDENTITY-006` `FLOW-IDENTITY-007`
**Requirements:** `FR-IDENTITY-001`
**Data / action contract:** `SDC-IDENTITY-001`

**Purpose.** Be the resume point for the application and make the whole shape of the task visible. Success is an applicant who can see everything the application needs and complete it in any order. **A one-time applicant will never become fluent**, so the task is not hidden behind a linear wizard.

**Hierarchy** — Phase 2 priority order, not reopened: case/context > authoring workspace > totals/readiness > action.

| Region | Contents |
|---|---|
| Case and context | The application, its draft state and when it was last saved. |
| Authoring workspace | Each section with its completeness and its validation issues. |
| Totals and readiness | What submission will require. |
| Action | Open a section, or go to review and submit. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-010` `WGT-PLATFORM-011` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`provider-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-006` (`embedded`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-005` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-IDENTITY-001` | application ID, provider type, applicant source facts, primary branch source facts, evidence item statuses, validation issues, requested changes, current application status, last saved/submitted timestamps. | create draft; update permitted draft/requested-change fields; attach/remove draft evidence references; submit; resubmit after requested changes; withdraw before final decision where policy allows. |

- `SDC-IDENTITY-001` projects the application identifier, provider type, applicant and branch source facts, evidence item statuses, validation issues, requested changes, the current status and the last saved and submitted timestamps.
- Missing-data behaviour: a section whose completeness could not be computed says so, and submission is blocked naming it rather than allowed optimistically.

**State**

- Lifecycle statuses visible: `DRAFT`; per-section completeness; validation issues; last saved
- Permission model: Verified applicant, own applications only.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Open a section | primary | always | never unavailable |
| Review and submit | primary | always; the review surface states what remains | never unavailable, because it is the surface that explains the gap |
| Withdraw the application | destructive | policy allows withdrawal before a final decision | UNAVAILABLE once a final decision exists, stated as an explained absence |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-IDENTITY-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-028` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the authoring region, after the case context has been announced.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is application state, section list, submission requirement. Sections are a list with per-section completeness announced.
- Announcements: The draft status announces once when it changes from saving to saved, never per keystroke.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- Sections are a list at every content width; at `profile-a.content-width.narrow` each section stacks with its completeness beneath its name.

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

Not applicable here: `empty-filtered`. The section set is fixed by the provider type rather than filtered.

**Acceptance criteria**

1. Sections are independently completable in any order.
2. Only submission is gated on completeness, and what remains is named.
3. The draft is never described as submitted and is never visible to a reviewer.
4. An interrupted session resumes with every entered field intact.

**Traceability.** `SCR-IDENTITY-012` · `WF-IDENTITY-012` · flows `FLOW-IDENTITY-005` `FLOW-IDENTITY-006` `FLOW-IDENTITY-007` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-010` `WGT-PLATFORM-011` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-006` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-005` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-028` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-AUDIT-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-IDENTITY-001` · contract `SDC-IDENTITY-001`

---

### SCR-IDENTITY-013 — Applicant and provider facts

**Wireframe:** `WF-IDENTITY-013` · **Platform:** Clinic / Doctor panel (Profile A) · **Runtime:** Filament panel
**Archetype:** form · **Density:** `operational` · **Classification:** New
**Actors:** Verified applicant, own application only
**Flows:** `FLOW-IDENTITY-006` `FLOW-IDENTITY-010`
**Requirements:** `FR-IDENTITY-001`
**Data / action contract:** `SDC-IDENTITY-001`

**Purpose.** Capture the applicant and provider source facts. Success is a complete, valid fact set. It is **facts only**: no control anywhere on this screen selects an eligibility outcome, and no service-specific questionnaire appears here.

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | Which application and which section. |
| Required input | Applicant full and legal name, verified contact, provider type, professional, licence and registration identifiers, clinic or centre legal and display name where applicable, and the applicant relationship to the provider. |
| Validation and consequence | Per-field validation issues and any requested-change items. |
| Action | Save and return to the workspace. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-010` `WGT-PLATFORM-011` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`provider-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-005` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-IDENTITY-001` | application ID, provider type, applicant source facts, primary branch source facts, evidence item statuses, validation issues, requested changes, current application status, last saved/submitted timestamps. | create draft; update permitted draft/requested-change fields; attach/remove draft evidence references; submit; resubmit after requested changes; withdraw before final decision where policy allows. |

- `SDC-IDENTITY-001` accepts the fact set. **Service activation is a separate post-approval workflow** and no service-specific eligibility questionnaire is part of this projection.
- Missing-data behaviour: a field whose governed option set failed to load is unavailable with the reason, and the section cannot be marked complete while it is.

**State**

- Lifecycle statuses visible: section completeness; per-field validation issues; requested-change items
- Permission model: Verified applicant, own application only. No control on this screen selects, sets or edits a scientific grade, an internal classification component or a final eligibility outcome. That absence is the enforcement, not a validation message.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Save the section | primary | the form has changes | DISABLED while a save is in flight |
| Back to the workspace | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011`
- No status this screen shows belongs to a governed lifecycle machine, so it binds no `TXT-STATE-*` rule. What the state section lists is descriptive condition, not a status chip drawn from a state machine.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-028` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is section context, fields, validation, action. Every field carries a persistent visible label.
- Announcements: A save announces once when it lands. Validation failures announce the error count once and move focus to the first field in error.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- A two-column form at `profile-a.content-width.wide` collapsing to one at `.narrow`, with the field order unchanged.

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

Not applicable here: `empty-no-data` `empty-filtered`. A section form reads one scoped draft and has no list or filter.

**Acceptance criteria**

1. **No control selects a scientific grade, an internal classification component or service eligibility.**
2. No service-specific eligibility questionnaire appears on this screen.
3. A validation failure clears no entered value.
4. Focus moves to the first field in error on failure.

**Traceability.** `SCR-IDENTITY-013` · `WF-IDENTITY-013` · flows `FLOW-IDENTITY-006` `FLOW-IDENTITY-010` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-010` `WGT-PLATFORM-011` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-005` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-028` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-AUDIT-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-IDENTITY-001` · contract `SDC-IDENTITY-001`

---

### SCR-IDENTITY-014 — Primary branch facts

**Wireframe:** `WF-IDENTITY-014` · **Platform:** Clinic / Doctor panel (Profile A) · **Runtime:** Filament panel
**Archetype:** form · **Density:** `operational` · **Classification:** New
**Actors:** Verified applicant, own application only
**Flows:** `FLOW-IDENTITY-006` `FLOW-IDENTITY-010`
**Requirements:** `FR-IDENTITY-001`
**Data / action contract:** `SDC-IDENTITY-001`

**Purpose.** Capture the primary branch facts. Success is one valid Aleppo branch recorded. It is a separate section because one primary branch is required for the application and additional branches are post-approval work.

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | Which application and which section. |
| Required input | The branch facts, with area as a within-city value. |
| Validation and consequence | Validation issues and requested-change items. |
| Action | Save and return to the workspace. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-010` `WGT-PLATFORM-011` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`provider-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-005` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-IDENTITY-001` | application ID, provider type, applicant source facts, primary branch source facts, evidence item statuses, validation issues, requested changes, current application status, last saved/submitted timestamps. | create draft; update permitted draft/requested-change fields; attach/remove draft evidence references; submit; resubmit after requested changes; withdraw before final decision where policy allows. |

- `SDC-IDENTITY-001` accepts the branch facts. **Aleppo only**, so area is a within-city value and never a city selector; no canonical source supplies a second city.
- **Additional branches are not part of the application** and no control here creates one.
- Missing-data behaviour: if the area list fails to load, the section cannot be completed and says why, because an unvalidated area would be an unverifiable fact.

**State**

- Lifecycle statuses visible: section completeness; validation issues; requested-change items
- Permission model: Verified applicant, own application only.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Save the section | primary | the form has changes | DISABLED while a save is in flight |
| Back to the workspace | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011`
- No status this screen shows belongs to a governed lifecycle machine, so it binds no `TXT-STATE-*` rule. What the state section lists is descriptive condition, not a status chip drawn from a state machine.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-028` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is section context, branch fields, validation, action.
- Announcements: A save announces once when it lands.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- One column at `profile-a.content-width.narrow`; the branch legal name wraps and never truncates.

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

Not applicable here: `empty-no-data` `empty-filtered`. A section form reads one scoped draft and has no list or filter.

**Acceptance criteria**

1. Exactly one primary branch is required and recorded.
2. Area never presents as a city selector.
3. No control on this screen creates an additional branch.
4. On approval this branch becomes the primary branch context.

**Traceability.** `SCR-IDENTITY-014` · `WF-IDENTITY-014` · flows `FLOW-IDENTITY-006` `FLOW-IDENTITY-010` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-010` `WGT-PLATFORM-011` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-005` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-028` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-AUDIT-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-IDENTITY-001` · contract `SDC-IDENTITY-001`

---

### SCR-IDENTITY-015 — Application evidence

**Wireframe:** `WF-IDENTITY-015` · **Platform:** Clinic / Doctor panel (Profile A) · **Runtime:** Filament panel
**Archetype:** detail · **Density:** `operational` · **Classification:** New
**Actors:** Verified applicant, own application only
**Flows:** `FLOW-IDENTITY-006` `FLOW-IDENTITY-010` `FLOW-PLATFORM-001`
**Requirements:** `FR-IDENTITY-001`
**Data / action contract:** `SDC-IDENTITY-001`

**Purpose.** Show which evidence items the chosen provider type requires and their per-item state. Success is every required item supplied and past its scan. It exists because **a quarantined item does not satisfy a requirement** and the applicant must be able to see that.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | Which application and which provider type determines the requirements. |
| Primary facts | One row per required item with its state, including quarantined-until-scan. |
| Related history | Validation issues and requested-change items. |
| Action | Supply an item, or return to the workspace. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-008` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`operator`) `CMP-PLATFORM-003` (`provider-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-006` (`embedded`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-012` (`intake`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-006` `IX-PLATFORM-007` `IX-PLATFORM-009` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-IDENTITY-001` | application ID, provider type, applicant source facts, primary branch source facts, evidence item statuses, validation issues, requested changes, current application status, last saved/submitted timestamps. | create draft; update permitted draft/requested-change fields; attach/remove draft evidence references; submit; resubmit after requested changes; withdraw before final decision where policy allows. |

- `SDC-IDENTITY-001` projects the evidence item statuses. **Which items are required depends on the provider type chosen earlier.**
- **The binary transfer mechanism is bounded by the vendor decision in `Q-OPS-001`.** This screen defines the requirement, the per-item status and the recovery, and stops at the transfer boundary. `Q-OPS-001` is not reopened here.
- Missing-data behaviour: an item whose scan result is not yet known stays quarantined and is never counted as satisfying its requirement.

**State**

- Lifecycle statuses visible: per-item evidence status including quarantined-until-scan; validation issues; requested-change items
- Permission model: Verified applicant, own application only.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Supply an item | primary | a requirement is outstanding | absent once every requirement is satisfied |
| Replace an item | secondary | the item was rejected or expired | absent on an accepted item |
| Back to the workspace | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-PLATFORM-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-PLATFORM-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-034` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the status and identity region.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is provider type context, requirement list, validation, action. Each item announces its requirement, its state and its next action.
- Announcements: Transfer progress announces at intervals, not continuously. A retryable transfer failure announces politely and distinctly from a rejection.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- Requirements are a list at every content width; at `.narrow` each item stacks with its state above its next action.

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

Not applicable here: `empty-filtered`. The requirement set is governed by the provider type rather than filtered.

**Acceptance criteria**

1. A retryable transfer failure and an authoritative rejection differ in wording, next action and focus destination.
2. **A quarantined item never satisfies a requirement.**
3. No storage path, opaque filename, signed link or scanner internal is exposed.
4. The required item set follows the chosen provider type.

**Traceability.** `SCR-IDENTITY-015` · `WF-IDENTITY-015` · flows `FLOW-IDENTITY-006` `FLOW-IDENTITY-010` `FLOW-PLATFORM-001` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-008` · components `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-006` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-012` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-006` `IX-PLATFORM-007` `IX-PLATFORM-009` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-PLATFORM-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-034` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-IDENTITY-001` · contract `SDC-IDENTITY-001`

---

### SCR-IDENTITY-016 — Review and submit

**Wireframe:** `WF-IDENTITY-016` · **Platform:** Clinic / Doctor panel (Profile A) · **Runtime:** Filament panel
**Archetype:** form · **Density:** `operational` · **Classification:** New
**Actors:** Verified applicant, own application only
**Flows:** `FLOW-IDENTITY-006` `FLOW-IDENTITY-007`
**Requirements:** `FR-IDENTITY-001`, `FR-AUDIT-001`
**Data / action contract:** `SDC-IDENTITY-001`

**Purpose.** Let the applicant see exactly what remains and submit. Success is a submitted application and a created verification work item. It exists because submission being unavailable must be **a designed state showing exactly what remains**, not a validation error on attempt.

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | The application and its current draft state. |
| Required input | Everything outstanding: required facts, the verified contact, and required evidence. |
| Validation and consequence | That the applicant cannot edit after submission. |
| Action | Submit. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`provider-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) `CMP-PLATFORM-014` (`irreversible`) |
| Patterns | `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-IDENTITY-001` | application ID, provider type, applicant source facts, primary branch source facts, evidence item statuses, validation issues, requested changes, current application status, last saved/submitted timestamps. | create draft; update permitted draft/requested-change fields; attach/remove draft evidence references; submit; resubmit after requested changes; withdraw before final decision where policy allows. |

- `SDC-IDENTITY-001` submits the application. Submission **creates the verification work item**.
- Missing-data behaviour: an outstanding item whose state could not be read blocks submission and is named, because submitting against an unread requirement risks an incomplete application.

**State**

- Lifecycle statuses visible: `DRAFT` before, `SUBMITTED` after
- Permission model: Verified applicant, own application only.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Submit the application | primary | every required fact, the verified contact and every required evidence item are present and valid | UNAVAILABLE with the outstanding items named. **This is a designed state, not a validation error on attempt** |
| Back to the workspace | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-IDENTITY-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is application state, outstanding items, the no-edit-after-submission statement, the action. The outstanding list is announced with its count.
- Announcements: The committed submission announces and focus moves to the status surface.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- The outstanding list is never collapsed behind a disclosure; the page scrolls instead.

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

Not applicable here: `empty-no-data` `empty-filtered`. A submission surface has no list-level filter.

**Acceptance criteria**

1. Submission is unavailable with the outstanding items named, never a validation error on attempt.
2. That the applicant cannot edit after submission is evident before committing.
3. Submission creates the verification work item.
4. A retry after a failed submission reuses the original idempotency key.

**Traceability.** `SCR-IDENTITY-016` · `WF-IDENTITY-016` · flows `FLOW-IDENTITY-006` `FLOW-IDENTITY-007` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` `CMP-PLATFORM-014` · patterns `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-AUDIT-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-IDENTITY-001`, `FR-AUDIT-001` · contract `SDC-IDENTITY-001`

---

### SCR-IDENTITY-017 — Status and requested changes

**Wireframe:** `WF-IDENTITY-017` · **Platform:** Clinic / Doctor panel (Profile A) · **Runtime:** Filament panel
**Archetype:** form · **Density:** `operational` · **Classification:** New
**Actors:** Verified applicant, own application only
**Flows:** `FLOW-IDENTITY-007` `FLOW-IDENTITY-009` `FLOW-IDENTITY-010` `FLOW-IDENTITY-020`
**Requirements:** `FR-IDENTITY-001`
**Data / action contract:** `SDC-IDENTITY-001`

**Purpose.** Show the application status and, in requested-changes, let the applicant correct only what was asked. Success is a resubmission that addresses every flagged item. It exists because **itemised corrections are what stop the applicant redoing the form**.

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | The application status. |
| Required input | The reviewer's itemised requests against what was submitted, each with its reason. |
| Validation and consequence | Everything else, visibly locked. |
| Action | Resubmit. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-006` `WGT-PLATFORM-010` `WGT-PLATFORM-011` `WGT-PLATFORM-014` |
| Components | `CMP-CLINICAL-002` (`version`) `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`provider-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-008` (`record`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) |
| Patterns | `IX-CLINICAL-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-005` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-016` `IX-PLATFORM-017` `IX-PLATFORM-018` `IX-POLICY-002` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-IDENTITY-001` | application ID, provider type, applicant source facts, primary branch source facts, evidence item statuses, validation issues, requested changes, current application status, last saved/submitted timestamps. | create draft; update permitted draft/requested-change fields; attach/remove draft evidence references; submit; resubmit after requested changes; withdraw before final decision where policy allows. |

- `SDC-IDENTITY-001` projects the requested-change items with their reasons, alongside what was submitted.
- Missing-data behaviour: a flagged item whose reason could not be read is still flagged and says the reason is unavailable, because an unexplained flag is worse than a delayed one.

**State**

- Lifecycle statuses visible: `SUBMITTED`, `CHANGES_REQUESTED`, `RESUBMITTED`
- Permission model: Verified applicant, own application only. **Only the itemised sections are editable**; everything else is visibly locked.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Open a flagged section | primary | the application is in requested-changes | HIDDEN in submitted and resubmitted, where nothing is editable |
| Resubmit | primary | every flagged item has been addressed | UNAVAILABLE with the outstanding flagged items named |
| Open the outcome | secondary | a decision exists | absent until one does |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-014` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-IDENTITY-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-028` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-POLICY-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is status, requested changes with reasons, locked content, action. Each requested change announces as item, submitted value, requested change and reason.
- Announcements: A status change announces politely and the editable set is recomputed.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- The requested and submitted values stack per item at `profile-a.content-width.narrow` with each pair kept adjacent.

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

Not applicable here: `empty-filtered`. The requested-change set is governed by the review rather than filtered.

**Acceptance criteria**

1. Only the itemised sections are editable; everything else is visibly locked.
2. Each requested change carries its reviewer reason.
3. Resubmission is available only when every flagged item has been addressed.
4. The applicant is never required to redo the whole form.

**Traceability.** `SCR-IDENTITY-017` · `WF-IDENTITY-017` · flows `FLOW-IDENTITY-007` `FLOW-IDENTITY-009` `FLOW-IDENTITY-010` `FLOW-IDENTITY-020` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-006` `WGT-PLATFORM-010` `WGT-PLATFORM-011` `WGT-PLATFORM-014` · components `CMP-CLINICAL-002` `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-008` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` · patterns `IX-CLINICAL-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-005` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-016` `IX-PLATFORM-017` `IX-PLATFORM-018` `IX-POLICY-002` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-014` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-028` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-POLICY-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-AUDIT-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-IDENTITY-001` · contract `SDC-IDENTITY-001`

---

### SCR-IDENTITY-018 — Application outcome

**Wireframe:** `WF-IDENTITY-018` · **Platform:** Clinic / Doctor panel (Profile A) · **Runtime:** Filament panel
**Archetype:** detail · **Density:** `operational` · **Classification:** New
**Actors:** Verified applicant, own application only
**Flows:** `FLOW-IDENTITY-011` `FLOW-IDENTITY-012` `FLOW-IDENTITY-020`
**Requirements:** `FR-IDENTITY-001`
**Data / action contract:** `SDC-IDENTITY-001`

**Purpose.** State the application outcome and, on approval, **exactly what approval does and does not do**. Success is an applicant who knows they are in the system but not yet bookable. An applicant who misreads this will wait for patients who cannot arrive.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The outcome. |
| Primary facts | On approval: the provider and clinic record, the applicant identity, the primary branch context, the scoped provider-representative capability, Clinic-panel access and the onboarding checklist. |
| Related history | **What approval does not do**: it activates no dental service, assigns no scientific grade, sets no internal classification component, makes the provider neither publicly discoverable nor production-ready. On rejection: the reason, and whether a new application is possible. |
| Action | Sign in, or start a new application. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`operator`) `CMP-PLATFORM-003` (`provider-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-013` (`decided-by-person`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-IDENTITY-001` | application ID, provider type, applicant source facts, primary branch source facts, evidence item statuses, validation issues, requested changes, current application status, last saved/submitted timestamps. | create draft; update permitted draft/requested-change fields; attach/remove draft evidence references; submit; resubmit after requested changes; withdraw before final decision where policy allows. |

- `SDC-IDENTITY-001` projects the outcome. The approval effects listed are the canonical ones and none is added here.
- Missing-data behaviour: an outcome that cannot be read renders as the last known status with its as-of time rather than as a decision.

**State**

- Lifecycle statuses visible: `APPROVED`, `REJECTED`
- Permission model: Verified applicant, own application only.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Sign in to the panel | primary | the application was approved | absent on rejection |
| Start a new application | primary | the application was rejected and no compliance restriction exists | absent on approval, and UNAVAILABLE where a compliance restriction exists, with that stated |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-001` `TXT-STATE-PLATFORM-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-IDENTITY-001` `TXT-STATE-PLATFORM-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the status and identity region.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is outcome, what approval grants, what approval does not do, action. The does-not-do statement is not a footnote in the reading order.
- Announcements: A decision arriving announces politely.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- The boundary statement is never collapsed behind a disclosure at any content width.

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

Not applicable here: `empty-no-data` `empty-filtered`. An outcome surface has no list and no filter.

**Acceptance criteria**

1. **The approval boundary is stated as prominently as the approval itself.**
2. Approval never reads as activating a service, assigning a grade, publishing the provider or making it production-ready.
3. A rejection states its reason and whether a new application is possible.

**Traceability.** `SCR-IDENTITY-018` · `WF-IDENTITY-018` · flows `FLOW-IDENTITY-011` `FLOW-IDENTITY-012` `FLOW-IDENTITY-020` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` · components `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-013` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-001` `TXT-STATE-PLATFORM-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-IDENTITY-001` · contract `SDC-IDENTITY-001`

---

### SCR-IDENTITY-019 — Clinic sign-in

**Wireframe:** `WF-IDENTITY-019` · **Platform:** Clinic / Doctor panel (Profile A) · **Runtime:** Filament panel
**Archetype:** form · **Density:** `operational` · **Classification:** New
**Actors:** Any identity holding an active clinic grant
**Flows:** `FLOW-IDENTITY-011` `FLOW-IDENTITY-015` `FLOW-IDENTITY-018`
**Requirements:** `FR-IDENTITY-001`
**Data / action contract:** `SDC-IDENTITY-004`

**Purpose.** Sign a clinic user into the panel. Success is an authenticated session scoped to the grants the user actually holds. It exists as its own screen because **a user with no active grant is denied rather than shown an empty panel**.

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | The sign-in form. |
| Required input | The verification challenge where the flow requires one. |
| Validation and consequence | Nothing else; this surface has no history and no secondary content. |
| Action | Sign in. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-IDENTITY-001` `WGT-PLATFORM-001` `WGT-PLATFORM-003` `WGT-PLATFORM-010` |
| Components | `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-IDENTITY-004` | current identity, accessible provider/clinic contexts, accessible branches, effective capabilities, pending onboarding checklist/work counts. | switch active authorized provider/branch context; no authorization is created by switching. |

- `SDC-IDENTITY-004` bootstraps clinic access and context. Filament supplies the login form and this surface configures it.
- Missing-data behaviour: where the grant set cannot be read, access is denied rather than granted with an empty scope, because an empty scope must never read as full authority.

**State**

- Lifecycle statuses visible: none
- Permission model: Any identity holding an active clinic grant. **An identity with no active grant is denied with the reason**, never shown an empty panel.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Sign in | primary | credentials are entered and no attempt is in flight | DISABLED while an attempt is in flight |
| Recover access | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011`
- No status this screen shows belongs to a governed lifecycle machine, so it binds no `TXT-STATE-*` rule. What the state section lists is descriptive condition, not a status chip drawn from a state machine.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-029` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is the form and the action. Every field carries a persistent visible label.
- Announcements: A failed attempt announces politely without disclosing which credential was wrong.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- A single centred column at every content width.

**Loading and failure**

| State | Behaviour on this screen |
|---|---|
| `loading-initial` | Skeleton at content height through `WGT-PLATFORM-001`. No empty state and no action is rendered while the first read is in flight. |
| `loading-refresh` | Content stays visible and interactive. A refresh never steals focus and never scrolls the surface. |
| `partial` | The region that loaded stays interactive; the region that failed names itself and offers retry in place. Never presented as complete. |
| `stale` | `CMP-PLATFORM-010` `stale` with the as-of time. Committing actions are withdrawn; read actions remain. |
| `error-fetch` | `CMP-PLATFORM-010` `fetch-failure`. Last known safe context preserved, retry in place, entered input untouched. |
| `success` | Content. |

Not applicable here: `empty-no-data` `empty-filtered` `error-permission`. A pre-session surface reads no scoped business projection.

**Acceptance criteria**

1. A user with no active grant is denied with the reason, not shown an empty panel.
2. Paste, password managers and platform autofill are never blocked.
3. No step of authentication is a cognitive test.
4. A failed attempt does not disclose which credential was wrong.

**Traceability.** `SCR-IDENTITY-019` · `WF-IDENTITY-019` · flows `FLOW-IDENTITY-011` `FLOW-IDENTITY-015` `FLOW-IDENTITY-018` · widgets `WGT-IDENTITY-001` `WGT-PLATFORM-001` `WGT-PLATFORM-003` `WGT-PLATFORM-010` · components `CMP-PLATFORM-004` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-029` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-AUDIT-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-IDENTITY-001` · contract `SDC-IDENTITY-004`

---

### SCR-PLATFORM-003 — Clinic dashboard

**Wireframe:** `WF-PLATFORM-003` · **Platform:** Clinic / Doctor panel (Profile A) · **Runtime:** Filament panel
**Archetype:** dashboard · **Density:** `operational` · **Classification:** New
**Actors:** Clinic / provider representative; Treating dentist; Invited staff within grant
**Flows:** `FLOW-BOOKING-002` `FLOW-BOOKING-003` `FLOW-IDENTITY-011` `FLOW-IDENTITY-013` `FLOW-IDENTITY-015` `FLOW-IDENTITY-018` `FLOW-IDENTITY-019` `FLOW-IDENTITY-020` `FLOW-OPS-002` `FLOW-REVIEWS-002`
**Requirements:** `FR-OPS-001`, `FR-IDENTITY-001`
**Data / action contract:** `SDC-IDENTITY-004`, `SDC-OPS-001`

**Purpose.** Give the clinic what needs doing today, scoped to the actor's grants. Success is the actor reaching the booking request whose deadline is closest. It exists because **responding to a booking request is daily, blocking and under a hard deadline**, so the response deadline is the sharpest thing on the screen.

**Hierarchy** — Phase 2 priority order, not reopened: context > urgent attention > primary work > supporting status.

| Region | Contents |
|---|---|
| Context | Which provider and branch context the actor is in. |
| Urgent attention | Booking requests awaiting response with their remaining time, first. |
| Primary work | The onboarding checklist while incomplete, eligibility blockers, and overdue follow-ups. |
| Supporting status | Routes into the owning surfaces. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-OPS-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-009` |
| Components | `CMP-OPS-001` (`feed`) `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`operator`) `CMP-PLATFORM-003` (`provider-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-006` (`embedded`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-015` (`panel-attention`) |
| Patterns | `IX-BOOKING-001` `IX-OPS-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-IDENTITY-004` | current identity, accessible provider/clinic contexts, accessible branches, effective capabilities, pending onboarding checklist/work counts. | switch active authorized provider/branch context; no authorization is created by switching. |
| `SDC-OPS-001` | work item ID/type, linked resource/case, lifecycle state, escalated flag, overdue flag, priority, due time, responsibility scope, blocking reason, assignment, safe summary. | claim/assign where allowed; start; move to waiting with a named blocking reason; resume; complete with outcome; escalate; reopen where policy permits. |

- `SDC-IDENTITY-004` supplies the context and `SDC-OPS-001` the scoped work projection.
- Missing-data behaviour: a region whose read failed names itself and offers retry in place; the rest of the dashboard stays usable. **A dashboard that loaded its list but not its status summary says so.**

**State**

- Lifecycle statuses visible: pending onboarding checklist count; booking requests awaiting response with remaining time; eligibility blockers; overdue follow-ups
- Permission model: Scoped to the actor's active provider and branch grants, enforced server-side. A scope revoked mid-shift removes the affected actions structurally and states the scope change; it never renders as an empty surface. Content differs between a treating dentist and a representative because grants differ, not because the screen differs.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Respond to a booking request | primary | a request awaits response | the region is replaced by its empty state when none does |
| Open the onboarding checklist | secondary | the checklist is incomplete | absent once complete |
| Open the work feed | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-001` `TXT-STATE-OPS-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-IDENTITY-001` `TXT-STATE-OPS-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the first item in the urgent-attention region.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is context, deadline-bearing requests, checklist and blockers, follow-ups. Each region is a labelled landmark.
- Announcements: A request entering its approaching-deadline window announces politely. A request that expires announces and the row moves out of the awaiting-response region.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- Regions reflow across the content grid; at `profile-a.content-width.narrow` they stack in the same order with the deadline region first.

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

Not applicable here: `empty-filtered`. A dashboard is scoped by context rather than filtered.

**Acceptance criteria**

1. The response deadline is the most prominent thing on the screen and never relies on colour.
2. Content is filtered to the actor's active grants, server-side.
3. The onboarding checklist stays prominent until it is complete.
4. A partially loaded dashboard names the region that failed and is not presented as complete.

**Traceability.** `SCR-PLATFORM-003` · `WF-PLATFORM-003` · flows `FLOW-BOOKING-002` `FLOW-BOOKING-003` `FLOW-IDENTITY-011` `FLOW-IDENTITY-013` `FLOW-IDENTITY-015` `FLOW-IDENTITY-018` `FLOW-IDENTITY-019` `FLOW-IDENTITY-020` `FLOW-OPS-002` `FLOW-REVIEWS-002` · widgets `WGT-OPS-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-009` · components `CMP-OPS-001` `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-006` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-015` · patterns `IX-BOOKING-001` `IX-OPS-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-001` `TXT-STATE-OPS-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-OPS-001`, `FR-IDENTITY-001` · contract `SDC-IDENTITY-004`, `SDC-OPS-001`

---

### SCR-IDENTITY-020 — Provider and branch context

**Wireframe:** `WF-IDENTITY-020` · **Platform:** Clinic / Doctor panel (Profile A) · **Runtime:** Filament panel
**Archetype:** detail · **Density:** `operational` · **Classification:** New
**Actors:** Any clinic user with more than one granted context
**Flows:** none recorded in the Phase 1 flow set
**Requirements:** `FR-IDENTITY-001`
**Data / action contract:** `SDC-IDENTITY-004`

**Purpose.** Let a clinic user switch which provider and branch context they are working in. Success is the correct context in force panel-wide. It is panel-global rather than per-screen because **a wrong-branch action is an authorization failure**.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The acting identity, which does not change. |
| Primary facts | The selectable contexts, being only those the actor is granted. |
| Related history | The effective capabilities in each context. |
| Action | Switch, returning to the prior screen with the new context applied. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`operator`) `CMP-PLATFORM-003` (`provider-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-IDENTITY-004` | current identity, accessible provider/clinic contexts, accessible branches, effective capabilities, pending onboarding checklist/work counts. | switch active authorized provider/branch context; no authorization is created by switching. |

- `SDC-IDENTITY-004` supplies the granted contexts and the effective capabilities in each.
- Missing-data behaviour: a context whose capability set could not be read is not selectable, because selecting an unknown capability set would present as full authority.

**State**

- Lifecycle statuses visible: effective capabilities per selectable context
- Permission model: Any clinic user with more than one granted context. **Switching creates no authority**; only granted contexts are selectable and every request is re-evaluated server-side.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Switch to this context | primary | the actor holds a grant over it | a context the actor does not hold is not selectable and is absent |
| Cancel | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011`
- No status this screen shows belongs to a governed lifecycle machine, so it binds no `TXT-STATE-*` rule. What the state section lists is descriptive condition, not a status chip drawn from a state machine.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the status and identity region.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is acting identity, selectable contexts, action. Each context announces with its effective capabilities.
- Announcements: The switch announces the new context and returns focus to the prior screen.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- Contexts are a list at every content width; the capability summary never truncates.

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

Not applicable here: `empty-no-data` `empty-filtered`. The context set is the actor's grant set rather than a filtered projection, and this surface commits no domain mutation.

**Acceptance criteria**

1. Only granted contexts are selectable.
2. Switching creates no authority; every request is re-evaluated server-side.
3. The active context is visible in persistent panel chrome, not only on this screen.
4. A context with an unresolved capability set is not selectable.

**Traceability.** `SCR-IDENTITY-020` · `WF-IDENTITY-020` · flows none · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` · components `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-IDENTITY-001` · contract `SDC-IDENTITY-004`

---

### SCR-IDENTITY-021 — Onboarding checklist

**Wireframe:** `WF-IDENTITY-021` · **Platform:** Clinic / Doctor panel (Profile A) · **Runtime:** Filament panel
**Archetype:** list-and-detail · **Density:** `operational` · **Classification:** New
**Actors:** Clinic / provider representative
**Flows:** `FLOW-BOOKING-002` `FLOW-ELIG-006` `FLOW-IDENTITY-011` `FLOW-IDENTITY-013` `FLOW-IDENTITY-020`
**Requirements:** `FR-IDENTITY-001`, `FR-ELIG-007`
**Data / action contract:** `SDC-IDENTITY-004`

**Purpose.** Show the newly approved provider the remaining path to being bookable. Success is a clinic that completes activation rather than waiting for patients who cannot arrive. It exists because **this is where the approval boundary becomes actionable**.

**Hierarchy** — Phase 2 priority order, not reopened: context/filter > list > selected detail > state-aware action.

| Region | Contents |
|---|---|
| Context and filter | The provider and branch context. |
| List | One row per checklist item, derived from work items: branch facts, staff invitations, service activation, prices, evidence and availability. |
| Selected detail | What each item unblocks. |
| State-aware action | Open the surface that resolves an item. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-OPS-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` |
| Components | `CMP-OPS-001` (`feed`) `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`provider-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-006` (`table`) `CMP-PLATFORM-007` (`queue`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-OPS-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-IDENTITY-004` | current identity, accessible provider/clinic contexts, accessible branches, effective capabilities, pending onboarding checklist/work counts. | switch active authorized provider/branch context; no authorization is created by switching. |

- `SDC-IDENTITY-004` projects the checklist, whose items are **derived from work items** rather than owned by this surface.
- Missing-data behaviour: an item whose state could not be read is shown as unknown and is never counted as complete.

**State**

- Lifecycle statuses visible: per-item checklist state derived from work items
- Permission model: Clinic or provider representative. Scoped to the actor's active provider and branch grants, enforced server-side. A scope revoked mid-shift removes the affected actions structurally and states the scope change; it never renders as an empty surface.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Open an item | primary | an item is incomplete | the list is replaced by its complete state when nothing remains |
| Invite a staff member | secondary | the actor holds delegation authority | HIDDEN for an actor without delegation authority |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011`
- No status this screen shows belongs to a governed lifecycle machine, so it binds no `TXT-STATE-*` rule. What the state section lists is descriptive condition, not a status chip drawn from a state machine.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the filter or search control where one exists, otherwise the first row.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is context, checklist. Each item announces its state and what it unblocks.
- Announcements: An item completing elsewhere announces politely and the list recomputes.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- The checklist is a list at every content width; at `.narrow` each item stacks with its state above what it unblocks.

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

**Acceptance criteria**

1. The checklist names the remaining path: branch facts, staff invitations, service activation, prices, evidence and availability.
2. **No copy implies that completing the checklist guarantees eligibility**, which is computed from verified facts and effective policy.
3. Item state is derived from work items and is never owned by this surface.

**Traceability.** `SCR-IDENTITY-021` · `WF-IDENTITY-021` · flows `FLOW-BOOKING-002` `FLOW-ELIG-006` `FLOW-IDENTITY-011` `FLOW-IDENTITY-013` `FLOW-IDENTITY-020` · widgets `WGT-OPS-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` · components `CMP-OPS-001` `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-006` `CMP-PLATFORM-007` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-OPS-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-IDENTITY-001`, `FR-ELIG-007` · contract `SDC-IDENTITY-004`

---

### SCR-IDENTITY-022 — People and grants

**Wireframe:** `WF-IDENTITY-022` · **Platform:** Clinic / Doctor panel (Profile A) · **Runtime:** Filament panel
**Archetype:** form · **Density:** `operational` · **Classification:** New
**Actors:** Clinic owner / provider representative with delegation authority
**Flows:** `FLOW-IDENTITY-014` `FLOW-IDENTITY-016`
**Requirements:** `FR-IDENTITY-001`, `FR-AUDIT-001`
**Data / action contract:** `SDC-IDENTITY-003`

**Purpose.** Show every active grant and outstanding invitation in one place. Success is a representative who knows exactly who can act for the provider. One surface because they are the same question from the representative's point of view.

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | The provider and branch context. |
| Required input | Active grants and outstanding invitations, each with its scope and effective period. |
| Validation and consequence | Revoked and expired entries, which remain visible as history. |
| Action | Invite someone, or open a grant or invitation. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-IDENTITY-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-010` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`provider-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-006` (`embedded`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) |
| Patterns | `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-IDENTITY-003` | invitation status, invited identity/contact, provider, branches, delegated capabilities, effective period, accepted/revoked timestamps. | create invitation; resend/replace expired invitation; accept after identity verification; revoke active grant. |

- `SDC-IDENTITY-003` projects invitations and scoped grants with their states and effective periods.
- Missing-data behaviour: an entry whose scope did not load is shown as scope-unknown and offers no action.

**State**

- Lifecycle statuses visible: invitation `PENDING`, `ACCEPTED`, `EXPIRED`, `REVOKED`; grant effective period
- Permission model: Clinic owner or provider representative with delegation authority. Scoped to the actor's active provider and branch grants, enforced server-side. A scope revoked mid-shift removes the affected actions structurally and states the scope change; it never renders as an empty surface.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Invite a staff member | primary | the actor holds delegation authority | HIDDEN without delegation authority |
| Open a grant | secondary | a grant exists | the group is replaced by its empty state |
| Open an invitation | secondary | an invitation exists | the group is replaced by its empty state |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-002` `TXT-STATE-PLATFORM-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-IDENTITY-002` `TXT-STATE-PLATFORM-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is context, grants, invitations, history. Each entry announces its parties, its scope and its effective period.
- Announcements: An invitation accepted or expired elsewhere announces politely and the entry moves group.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- Grants and invitations are two labelled tables at `profile-a.content-width.wide` and degrade to reading lists at `.narrow`, because **a truncated scope column is the failure this surface must not have**.

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

Not applicable here: `empty-filtered`. The grant set is scoped rather than filtered.

**Acceptance criteria**

1. Grants and invitations appear on one surface without being merged into one list.
2. Revoked and expired entries remain visible as history.
3. A scope is never truncated at any content width.
4. Historical actor attribution is never deleted.

**Traceability.** `SCR-IDENTITY-022` · `WF-IDENTITY-022` · flows `FLOW-IDENTITY-014` `FLOW-IDENTITY-016` · widgets `WGT-IDENTITY-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-010` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-006` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` · patterns `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-002` `TXT-STATE-PLATFORM-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-AUDIT-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-IDENTITY-001`, `FR-AUDIT-001` · contract `SDC-IDENTITY-003`

---

### SCR-IDENTITY-023 — Create invitation

**Wireframe:** `WF-IDENTITY-023` · **Platform:** Clinic / Doctor panel (Profile A) · **Runtime:** Filament panel
**Archetype:** form · **Density:** `operational` · **Classification:** New
**Actors:** Clinic owner / provider representative with delegation authority
**Flows:** `FLOW-IDENTITY-013` `FLOW-IDENTITY-014`
**Requirements:** `FR-IDENTITY-001`
**Data / action contract:** `SDC-IDENTITY-003`

**Purpose.** Create a staff invitation whose exact scope the inviter can see. Success is an invitation that grants only what was intended. It exists because **the inviter can only offer capabilities and branches they themselves hold** — a constraint on what the surface presents, not a validation message.

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | The provider context the invitation is for. |
| Required input | The invited identity or contact, the allowed branches, the capability or role, and any required effective period. |
| Validation and consequence | What the invitation does and does not confer. |
| Action | Send the invitation. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-IDENTITY-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-010` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`provider-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) |
| Patterns | `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-IDENTITY-003` | invitation status, invited identity/contact, provider, branches, delegated capabilities, effective period, accepted/revoked timestamps. | create invitation; resend/replace expired invitation; accept after identity verification; revoke active grant. |

- `SDC-IDENTITY-003` creates the invitation. **Staff do not self-attach by searching for a clinic**; the invitation is the only path.
- Missing-data behaviour: where the delegable capability set cannot be read, creation is withheld, because an unbounded option set would allow an unbounded grant.

**State**

- Lifecycle statuses visible: `PENDING` on creation
- Permission model: Clinic owner or provider representative with delegation authority. **The option set is constrained to what the inviter holds**, so an over-broad grant cannot be composed here.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Send the invitation | primary | the scope is complete and within what the inviter holds | DISABLED until the scope is complete, with what remains named |
| Cancel | secondary | always before commit | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-002`
- Lifecycle labels for every status above are owned by `TXT-STATE-IDENTITY-002` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is provider context, scope fields, what it confers, action. The full scope is part of the confirm statement.
- Announcements: The created invitation announces and focus moves to it.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- Scope fields stack at `.narrow`; the scope summary is never truncated before the confirm control.

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

Not applicable here: `empty-no-data` `empty-filtered`. A single-command form has no list and no filter.

**Acceptance criteria**

1. The inviter is offered only capabilities and branches they themselves hold.
2. **Inviting someone as a treating dentist does not confer clinical authoring authority**, and the screen says so: professional verification and a case relationship still apply.
3. Staff cannot self-attach to a clinic from any surface.
4. The full scope is legible before the invitation is sent.

**Traceability.** `SCR-IDENTITY-023` · `WF-IDENTITY-023` · flows `FLOW-IDENTITY-013` `FLOW-IDENTITY-014` · widgets `WGT-IDENTITY-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-010` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` · patterns `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-002` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-AUDIT-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-IDENTITY-001` · contract `SDC-IDENTITY-003`

---

### SCR-IDENTITY-024 — Invitation detail

**Wireframe:** `WF-IDENTITY-024` · **Platform:** Clinic / Doctor panel (Profile A) · **Runtime:** Filament panel
**Archetype:** form · **Density:** `operational` · **Classification:** New
**Actors:** Clinic owner / provider representative with delegation authority
**Flows:** `FLOW-IDENTITY-014`
**Requirements:** `FR-IDENTITY-001`
**Data / action contract:** `SDC-IDENTITY-003`

**Purpose.** Show one invitation and its state, and let the representative resend or replace it. Success is an accurate picture of whether the invitation can still be accepted. It exists because **an expired invitation cannot be revived** and that must be stated rather than implied by a disabled control.

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | The provider context. |
| Required input | The invitation: who, what scope, which branches, until when. |
| Validation and consequence | Its state, and what each state permits. |
| Action | Resend, replace, or revoke. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-IDENTITY-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-010` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`provider-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) |
| Patterns | `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-IDENTITY-003` | invitation status, invited identity/contact, provider, branches, delegated capabilities, effective period, accepted/revoked timestamps. | create invitation; resend/replace expired invitation; accept after identity verification; revoke active grant. |

- `SDC-IDENTITY-003` projects the invitation state and permits resend, replacement and revocation according to that state.
- Missing-data behaviour: an invitation whose state could not be read offers no action and says why.

**State**

- Lifecycle statuses visible: `PENDING`, `ACCEPTED`, `EXPIRED`, `REVOKED`
- Permission model: Clinic owner or provider representative with delegation authority.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Resend the invitation | primary | the invitation is pending | UNAVAILABLE once expired, with the statement that a new invitation is required |
| Replace with a new invitation | primary | the invitation has expired | absent while pending |
| Revoke the invitation | destructive | the invitation is pending | UNAVAILABLE once accepted, expired or revoked |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-002` `TXT-STATE-PLATFORM-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-IDENTITY-002` `TXT-STATE-PLATFORM-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is context, invitation, state, actions. The state and what it permits are announced together.
- Announcements: A state change announces politely and the action set recomputes.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- One column at `.narrow`; the scope never truncates.

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

Not applicable here: `empty-no-data` `empty-filtered`. A single-record surface has no list and no filter.

**Acceptance criteria**

1. **An expired invitation is stated as requiring a new one**, never left as a disabled accept.
2. Revocation is available while the invitation is pending and absent afterwards.
3. The scope is legible at every content width.

**Traceability.** `SCR-IDENTITY-024` · `WF-IDENTITY-024` · flows `FLOW-IDENTITY-014` · widgets `WGT-IDENTITY-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-010` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` · patterns `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-002` `TXT-STATE-PLATFORM-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-AUDIT-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-IDENTITY-001` · contract `SDC-IDENTITY-003`

---

### SCR-IDENTITY-025 — Invitation acceptance

**Wireframe:** `WF-IDENTITY-025` · **Platform:** Clinic / Doctor panel (Profile A) · **Runtime:** Filament panel
**Archetype:** form · **Density:** `operational` · **Classification:** New
**Actors:** Invited staff member, pre-authentication then authenticated
**Flows:** `FLOW-IDENTITY-015`
**Requirements:** `FR-IDENTITY-001`
**Data / action contract:** `SDC-IDENTITY-003`

**Purpose.** Let an invited staff member see exactly what they are accepting, and accept it. Success is a grant of exactly that scope and nothing more. It exists because **acceptance creates the grant**, so the scope must be visible before accepting.

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | The invitation and the provider it is for. |
| Required input | The exact scope: provider, branches, capability, effective period. |
| Validation and consequence | That acceptance creates the grant and that access is deny-by-default outside it. |
| Action | Accept. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-IDENTITY-001` `WGT-PLATFORM-001` `WGT-PLATFORM-003` `WGT-PLATFORM-010` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-IDENTITY-003` | invitation status, invited identity/contact, provider, branches, delegated capabilities, effective period, accepted/revoked timestamps. | create invitation; resend/replace expired invitation; accept after identity verification; revoke active grant. |

- `SDC-IDENTITY-003` accepts the invitation and creates the grant.
- Missing-data behaviour: where the scope cannot be read, acceptance is withheld, because accepting an unread scope is accepting an unknown grant.

**State**

- Lifecycle statuses visible: `PENDING` before, `ACCEPTED` after, `EXPIRED` when the window has passed
- Permission model: Invited staff member, pre-authentication then authenticated. **Identity and contact verification precede acceptance.**

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Accept the invitation | primary | identity and contact are verified and the invitation is pending | UNAVAILABLE once expired or revoked, with the statement that a new invitation is required |
| Decline | secondary | the invitation is pending | absent once resolved |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-002` `TXT-STATE-PLATFORM-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-IDENTITY-002` `TXT-STATE-PLATFORM-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-029` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is invitation, scope, consequence, action. The full scope is announced before the accept control is reached.
- Announcements: Acceptance announces the created grant and routes to sign-in.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- The scope statement is never collapsed behind a disclosure at any content width.

**Loading and failure**

| State | Behaviour on this screen |
|---|---|
| `loading-initial` | Skeleton at content height through `WGT-PLATFORM-001`. No empty state and no action is rendered while the first read is in flight. |
| `loading-refresh` | Content stays visible and interactive. A refresh never steals focus and never scrolls the surface. |
| `partial` | The region that loaded stays interactive; the region that failed names itself and offers retry in place. Never presented as complete. |
| `stale` | `CMP-PLATFORM-010` `stale` with the as-of time. Committing actions are withdrawn; read actions remain. |
| `error-fetch` | `CMP-PLATFORM-010` `fetch-failure`. Last known safe context preserved, retry in place, entered input untouched. |
| `success` | Content. |

Not applicable here: `empty-no-data` `empty-filtered` `error-permission`. A pre-session acceptance reads only the invitation projection.

**Acceptance criteria**

1. The exact scope being accepted is visible before accepting.
2. Acceptance grants exactly that scope and nothing more.
3. An expired or revoked invitation grants nothing and states that a new one is required.
4. Identity and contact verification precede acceptance.

**Traceability.** `SCR-IDENTITY-025` · `WF-IDENTITY-025` · flows `FLOW-IDENTITY-015` · widgets `WGT-IDENTITY-001` `WGT-PLATFORM-001` `WGT-PLATFORM-003` `WGT-PLATFORM-010` · components `CMP-PLATFORM-001` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-002` `TXT-STATE-PLATFORM-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-029` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-AUDIT-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-IDENTITY-001` · contract `SDC-IDENTITY-003`

---

### SCR-IDENTITY-026 — Staff grant detail

**Wireframe:** `WF-IDENTITY-026` · **Platform:** Clinic / Doctor panel (Profile A) · **Runtime:** Filament panel
**Archetype:** form · **Density:** `operational` · **Classification:** New
**Actors:** Clinic owner / provider representative with delegation authority
**Flows:** `FLOW-IDENTITY-016` `FLOW-IDENTITY-019`
**Requirements:** `FR-IDENTITY-001`, `FR-AUDIT-001`
**Data / action contract:** `SDC-IDENTITY-003`

**Purpose.** Show one staff grant and let the representative revoke it. Success is access stopped immediately with attribution preserved. It exists because **revocation is urgent when it happens** and must be reachable without hunting.

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | The provider context. |
| Required input | The grant: who, what scope, which branches, effective period. |
| Validation and consequence | What revocation does and does not do. |
| Action | Revoke. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-IDENTITY-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`provider-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) `CMP-PLATFORM-014` (`irreversible`) |
| Patterns | `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-IDENTITY-003` | invitation status, invited identity/contact, provider, branches, delegated capabilities, effective period, accepted/revoked timestamps. | create invitation; resend/replace expired invitation; accept after identity verification; revoke active grant. |

- `SDC-IDENTITY-003` revokes the grant. **Revocation stops subsequent access immediately, including from a page that user already has open.**
- Missing-data behaviour: where the grant cannot be read, revocation is withheld, because revoking an unread grant could revoke the wrong one.

**State**

- Lifecycle statuses visible: grant active or revoked; effective period
- Permission model: Clinic owner or provider representative with delegation authority.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Revoke this grant | destructive | the grant is active and the actor holds delegation authority | UNAVAILABLE once already revoked |
| Back to people and grants | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-002`
- Lifecycle labels for every status above are owned by `TXT-STATE-IDENTITY-002` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is context, grant scope, consequence, action.
- Announcements: The committed revocation announces and the grant moves to history.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
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

Not applicable here: `empty-no-data` `empty-filtered`. A single-record surface has no list and no filter.

**Acceptance criteria**

1. Revocation is reachable in one step from the people and grants surface.
2. Access stops immediately, including from an already-open page.
3. Historical attribution is preserved and no action they performed is deleted.
4. The confirm control carries the same destructive role as its trigger.

**Traceability.** `SCR-IDENTITY-026` · `WF-IDENTITY-026` · flows `FLOW-IDENTITY-016` `FLOW-IDENTITY-019` · widgets `WGT-IDENTITY-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` `CMP-PLATFORM-014` · patterns `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-002` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-AUDIT-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-IDENTITY-001`, `FR-AUDIT-001` · contract `SDC-IDENTITY-003`

---
