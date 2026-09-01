# Screen Specifications — Admin panel (1 of 4)

**Phase:** UX 4 — Widget and Screen Specifications
**Platform:** Admin panel · Profile A · Filament panel
**Schema:** `PHASE_04_IMPLEMENTATION_PLAN.md` section 6. **Widgets:** `WIDGET_SPECS.md`. **Map:** `SCREEN_SPEC_MAP.md`.

Every block carries the same thirteen sections in the same order. A section that does not apply says so and why.

---
### SCR-PLATFORM-005 — Privileged sign-in

**Wireframe:** `WF-PLATFORM-005` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** form · **Density:** `operational` · **Classification:** New
**Actors:** Any staff identity with an active grant
**Flows:** `FLOW-IDENTITY-018`
**Requirements:** `FR-IDENTITY-001`
**Data / action contract:** `SDC-IDENTITY-004`

**Purpose.** Sign a staff identity into the Admin panel. Success is an authenticated session scoped to the grants the identity actually holds. It exists because **privileged production roles require a non-SMS second factor** and an SMS-only factor is denied for them.

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | The sign-in form. |
| Required input | The second factor, where the role requires one. |
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

- `SDC-IDENTITY-004` bootstraps panel access and context. Filament supplies the login form and this surface extends it.
- **Concrete second-factor provider selection is bounded by the vendor decision in `Q-OPS-001`**; this screen specifies the requirement and stops at that boundary.
- Missing-data behaviour: where the grant set cannot be read, access is denied rather than granted with an empty scope.

**State**

- Lifecycle statuses visible: none
- Permission model: Any staff identity with an active grant. **An identity with no active grant is denied with the reason**, never shown an empty panel. An SMS-only factor is denied for a privileged production role.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Sign in | primary | credentials are entered and no attempt is in flight | DISABLED while an attempt is in flight |
| Complete the second factor | primary | the role requires one | absent for a role that does not |

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
- Screen-reader hierarchy: Landmark order is the form, the second factor, the action. Every field carries a persistent visible label.
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

1. A privileged production role cannot complete sign-in with an SMS-only factor.
2. An identity with no active grant is denied with the reason.
3. Paste, password managers and platform autofill are never blocked.
4. No step of authentication is a cognitive test.

**Traceability.** `SCR-PLATFORM-005` · `WF-PLATFORM-005` · flows `FLOW-IDENTITY-018` · widgets `WGT-IDENTITY-001` `WGT-PLATFORM-001` `WGT-PLATFORM-003` `WGT-PLATFORM-010` · components `CMP-PLATFORM-004` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-029` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-AUDIT-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-IDENTITY-001` · contract `SDC-IDENTITY-004`

---

### SCR-PLATFORM-004 — Admin dashboard

**Wireframe:** `WF-PLATFORM-004` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** dashboard · **Density:** `operational` · **Classification:** New
**Actors:** All eleven Admin role categories plus the authorized auditor
**Flows:** `FLOW-AUDIT-001` `FLOW-BOOKING-011` `FLOW-CATALOG-007` `FLOW-CLINICAL-009` `FLOW-IDENTITY-017` `FLOW-IDENTITY-018` `FLOW-OPS-001` `FLOW-OPS-003` `FLOW-OPS-004` `FLOW-PLATFORM-003`
**Requirements:** `FR-OPS-001`, `FR-OPS-002`
**Data / action contract:** `SDC-OPS-001`, `SDC-OPS-002`

**Purpose.** Give every Admin role one landing surface, filtered by their active grants. Success is a staff actor reaching their own queue. **One dashboard for eleven roles**: eleven near-duplicate role landings were rejected because navigation visibility already follows grants.

**Hierarchy** — Phase 2 priority order, not reopened: context > urgent attention > primary work > supporting status.

| Region | Contents |
|---|---|
| Context | The acting staff identity and the coarse capability set in force. |
| Urgent attention | Scoped queue counts, deadline breaches and readiness exceptions. |
| Primary work | Every metric's population, window and last-refreshed time. |
| Supporting status | Routes to each group root the actor is granted. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-OPS-001` `WGT-OPS-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-009` |
| Components | `CMP-OPS-001` (`queue`) `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`reviewer`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-006` (`embedded`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-015` (`panel-attention`) |
| Patterns | `IX-BOOKING-001` `IX-OPS-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-009` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-OPS-001` | work item ID/type, linked resource/case, lifecycle state, escalated flag, overdue flag, priority, due time, responsibility scope, blocking reason, assignment, safe summary. | claim/assign where allowed; start; move to waiting with a named blocking reason; resume; complete with outcome; escalate; reopen where policy permits. |
| `SDC-OPS-002` | scoped metrics with population definition, time window, state rules, confirmed-vs-provisional distinction, last-refreshed time, permitted drill-down references. | filter/drill down/export only when corresponding permission/audit requirements pass. |

- `SDC-OPS-001` supplies the scoped work counts and `SDC-OPS-002` the operational reporting projection.
- **Provisional and disputed figures must be visibly distinct from confirmed facts**, and **every metric declares its population, window and last-refreshed time**.
- Missing-data behaviour: a metric whose contributing source failed is not rendered and the missing source is named. A figure computed over fewer sources is a wrong figure.

**State**

- Lifecycle statuses visible: scoped queue counts; deadline breaches; readiness exceptions
- Permission model: Scoped to the actor's active grants, assigned work and subject-matter competence, enforced server-side. **A coarse role is not the authorization model** and no administrator bypass exists. A scope revoked mid-shift removes the affected actions structurally and states the change; it never renders as a quiet empty queue.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Open my queue | primary | the actor holds queue work | the region is replaced by its empty state when none is held |
| Open a group root | secondary | the actor is granted that group | HIDDEN where the actor is not granted it, because navigation visibility follows grants |

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
- Focus entry: the first item in the urgent-attention region.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is staff context, queue counts, deadline breaches, readiness exceptions. Each figure announces with its population, window and freshness.
- Announcements: A deadline breach appearing announces politely.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- Tiles reflow across the content grid; at `profile-a.content-width.narrow` they stack one per row and any series renders as its table.

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

Not applicable here: `empty-filtered`. A dashboard is scoped by grant rather than filtered.

**Acceptance criteria**

1. **Every metric declares its population, window, status rules and last-refreshed time.**
2. Provisional and disputed values are distinguishable from confirmed values without colour.
3. Content is filtered to the actor's active grants, server-side.
4. A figure whose source set is incomplete does not render, and the missing source is named.

**Traceability.** `SCR-PLATFORM-004` · `WF-PLATFORM-004` · flows `FLOW-AUDIT-001` `FLOW-BOOKING-011` `FLOW-CATALOG-007` `FLOW-CLINICAL-009` `FLOW-IDENTITY-017` `FLOW-IDENTITY-018` `FLOW-OPS-001` `FLOW-OPS-003` `FLOW-OPS-004` `FLOW-PLATFORM-003` · widgets `WGT-OPS-001` `WGT-OPS-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-009` · components `CMP-OPS-001` `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-006` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-015` · patterns `IX-BOOKING-001` `IX-OPS-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-009` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-OPS-001`, `FR-OPS-002` · contract `SDC-OPS-001`, `SDC-OPS-002`

---

### SCR-IDENTITY-027 — Application queue

**Wireframe:** `WF-IDENTITY-027` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** list-and-detail · **Density:** `operational` · **Classification:** New
**Actors:** Verification staff within assigned onboarding scope
**Flows:** `FLOW-IDENTITY-008` `FLOW-IDENTITY-009` `FLOW-IDENTITY-012` `FLOW-IDENTITY-020`
**Requirements:** `FR-IDENTITY-001`
**Data / action contract:** `SDC-IDENTITY-002`, `SDC-OPS-001`

**Purpose.** Give verification staff the onboarding applications awaiting them. Success is a reviewer starting the right application. It exists because **a resubmitted application is a different task from a first submission** and must be distinguishable.

**Hierarchy** — Phase 2 priority order, not reopened: context/filter > list > selected detail > state-aware action.

| Region | Contents |
|---|---|
| Context and filter | The reviewer's scope and the state filter. |
| List | One row per application with its state, distinguishing resubmitted from first submissions. |
| Selected detail | The selected application. |
| State-aware action | Open the review. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-006` (`table`) `CMP-PLATFORM-007` (`queue`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-IDENTITY-002` | submitted source facts, evidence verification state, duplicate/matching provider candidates, branch facts, applicant relationship evidence, review history, outstanding corrections. | claim/assign review if work-queue policy requires; verify/reject individual facts/evidence; request changes with itemized reasons; approve application; reject with reason. |
| `SDC-OPS-001` | work item ID/type, linked resource/case, lifecycle state, escalated flag, overdue flag, priority, due time, responsibility scope, blocking reason, assignment, safe summary. | claim/assign where allowed; start; move to waiting with a named blocking reason; resume; complete with outcome; escalate; reopen where policy permits. |

- `SDC-IDENTITY-002` projects the applications and `SDC-OPS-001` the assigned work.
- Missing-data behaviour: an application whose state could not be read is shown as unknown and offers no review action.

**State**

- Lifecycle statuses visible: `SUBMITTED`, `CHANGES_REQUESTED`, `RESUBMITTED`
- Permission model: Verification staff within assigned onboarding scope. Scoped to the actor's active grants, assigned work and subject-matter competence, enforced server-side. **A coarse role is not the authorization model** and no administrator bypass exists. A scope revoked mid-shift removes the affected actions structurally and states the change; it never renders as a quiet empty queue.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Open the review | primary | the application is in the actor's assigned or authorized scope | the list is replaced by the appropriate empty state |
| Filter by state | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-IDENTITY-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

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
- Screen-reader hierarchy: Landmark order is scope, filter, application list. Each row announces its state, including whether it is a resubmission.
- Announcements: A new submission arriving announces politely.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- A table at `.wide` degrading to the reading-list shape at `.narrow`.

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

1. Resubmitted applications are distinguishable from first submissions.
2. The list is scoped to assigned or authorized onboarding work only.
3. Filtered-empty and genuinely-empty read differently.
4. A permission failure never renders as an empty queue.

**Traceability.** `SCR-IDENTITY-027` · `WF-IDENTITY-027` · flows `FLOW-IDENTITY-008` `FLOW-IDENTITY-009` `FLOW-IDENTITY-012` `FLOW-IDENTITY-020` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-006` `CMP-PLATFORM-007` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-IDENTITY-001` · contract `SDC-IDENTITY-002`, `SDC-OPS-001`

---

### SCR-IDENTITY-028 — Application review

**Wireframe:** `WF-IDENTITY-028` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** detail · **Density:** `operational` · **Classification:** New
**Actors:** Verification staff within assigned scope
**Flows:** `FLOW-IDENTITY-008` `FLOW-IDENTITY-009` `FLOW-IDENTITY-011` `FLOW-IDENTITY-012`
**Requirements:** `FR-IDENTITY-001`, `FR-AUDIT-001`
**Data / action contract:** `SDC-IDENTITY-002`

**Purpose.** Give the reviewer everything the decision needs in one place. Success is a reviewer who can approve, reject or request changes on evidence rather than impression. It exists because **approval creates or links a provider organization, and linking the wrong one is hard to undo**.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The application, its state and the applicant. |
| Primary facts | Submitted source facts, evidence verification state, branch facts and applicant relationship evidence. |
| Related history | **Duplicate or matching provider candidates**, the review history and outstanding corrections. |
| Action | Verify items, request changes, approve or reject. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-006` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`reviewer`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-008` (`record`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-013` (`decided-by-person`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-016` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-IDENTITY-002` | submitted source facts, evidence verification state, duplicate/matching provider candidates, branch facts, applicant relationship evidence, review history, outstanding corrections. | claim/assign review if work-queue policy requires; verify/reject individual facts/evidence; request changes with itemized reasons; approve application; reject with reason. |

- `SDC-IDENTITY-002` projects the submitted source facts, the evidence verification state, duplicate or matching provider candidates, branch facts, applicant relationship evidence, review history and outstanding corrections.
- Missing-data behaviour: where the duplicate-candidate read failed, approval is withheld and says why, because linking the wrong provider organization is hard to undo.

**State**

- Lifecycle statuses visible: `SUBMITTED`, `CHANGES_REQUESTED`, `RESUBMITTED`, `APPROVED`, `REJECTED`
- Permission model: Verification staff within assigned scope. Scoped to the actor's active grants, assigned work and subject-matter competence, enforced server-side. **A coarse role is not the authorization model** and no administrator bypass exists. A scope revoked mid-shift removes the affected actions structurally and states the change; it never renders as a quiet empty queue.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Claim or assign this review | primary | work-queue policy requires it and the actor may take it | absent where policy does not require a claim |
| Verify facts and evidence | primary | the actor holds competence and assignment | HIDDEN without them |
| Request changes | secondary | the application is under review | UNAVAILABLE once a final decision exists |
| Approve | primary | every required item is verified | UNAVAILABLE with the outstanding items named |
| Reject | destructive | the actor holds the scope and a reason is given | UNAVAILABLE once a final decision exists |

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

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the status and identity region.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is application state, submitted facts, evidence, duplicate candidates, review history, actions. Duplicate candidates are a labelled list, not a footnote.
- Announcements: A verification outcome recorded elsewhere announces politely and the outstanding count recomputes.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- Facts and evidence occupy the primary region with review history in a supporting rail at `.wide`; the rail moves below at `.narrow`.

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

Not applicable here: `empty-filtered`. A single-application review has no list-level filter of its own.

**Acceptance criteria**

1. Duplicate or matching provider candidates are surfaced before approval is possible.
2. Approval is unavailable while any required item is unverified, with what remains named.
3. The review history is readable without leaving the surface.
4. A claim or assignment happens here where work-queue policy requires it.

**Traceability.** `SCR-IDENTITY-028` · `WF-IDENTITY-028` · flows `FLOW-IDENTITY-008` `FLOW-IDENTITY-009` `FLOW-IDENTITY-011` `FLOW-IDENTITY-012` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-006` · components `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-008` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-013` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-016` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-001` `TXT-STATE-PLATFORM-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-IDENTITY-001`, `FR-AUDIT-001` · contract `SDC-IDENTITY-002`

---

### SCR-IDENTITY-029 — Fact and evidence verification

**Wireframe:** `WF-IDENTITY-029` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** form · **Density:** `operational` · **Classification:** New
**Actors:** Verification staff within competence and assigned scope
**Flows:** `FLOW-IDENTITY-008` `FLOW-PLATFORM-001`
**Requirements:** `FR-IDENTITY-001`, `FR-AUDIT-001`
**Data / action contract:** `SDC-IDENTITY-002`

**Purpose.** Let the reviewer record a verification outcome **per item, with provenance**. Success is a decision that is the sum of verified facts rather than one global judgement. It exists because that itemisation is what lets the applicant later correct only what was asked.

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | The application and the reviewer's scope. |
| Required input | One row per fact and evidence item with its submitted value, its provenance and its outcome. |
| Validation and consequence | The reason, required on any negative outcome, which becomes the applicant's text. |
| Action | Record the outcomes. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-008` `WGT-PLATFORM-010` `WGT-PLATFORM-013` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-006` (`embedded`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) `CMP-PLATFORM-012` (`intake`) `CMP-PLATFORM-013` (`decided-by-person`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-006` `IX-PLATFORM-007` `IX-PLATFORM-009` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-IDENTITY-002` | submitted source facts, evidence verification state, duplicate/matching provider candidates, branch facts, applicant relationship evidence, review history, outstanding corrections. | claim/assign review if work-queue policy requires; verify/reject individual facts/evidence; request changes with itemized reasons; approve application; reject with reason. |

- `SDC-IDENTITY-002` records per-item outcomes with provenance.
- **Evidence cannot be used before the required scan succeeds.** Viewing or downloading requires fresh authorization for the exact purpose and is audited.
- Missing-data behaviour: an item whose provenance did not load cannot be approved, and the surface says why.

**State**

- Lifecycle statuses visible: per-item verification outcome and provenance; evidence quarantine state
- Permission model: Verification staff within competence and assigned scope. Scoped to the actor's active grants, assigned work and subject-matter competence, enforced server-side. **A coarse role is not the authorization model** and no administrator bypass exists. A scope revoked mid-shift removes the affected actions structurally and states the change; it never renders as a quiet empty queue.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Verify an item | primary | the actor holds competence and assignment for it | HIDDEN for an item outside the actor's competence |
| Reject an item | destructive | a reason is given | DISABLED until a reason is entered, with the requirement bound to the control |
| Open an evidence item | secondary | fresh purpose-bound authorization is granted | **UNAVAILABLE without fresh authorization for the exact purpose**, and every view is audited |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-PLATFORM-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-PLATFORM-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |
| `ERR-PLATFORM-005` | an evidence item that failed validation or was rejected authoritatively | `TXT-ERR-PLATFORM-005` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-034` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is application context, item list, reason field, actions. Provenance is part of each item's accessible name.
- Announcements: Recording an outcome keeps focus on the item and announces the outstanding count.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- A table at `.wide`; at `.narrow` each item stacks with its submitted value directly above its outcome. **The submitted value never truncates**, because a reviewer comparing a truncated value is comparing the wrong thing.

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

Not applicable here: `empty-filtered`. The item set is the application's own rather than a filtered projection.

**Acceptance criteria**

1. **No bulk approve or bulk reject control exists.**
2. Every outcome carries its provenance, and every negative outcome carries a reason.
3. Evidence cannot be marked usable before its required scan succeeds.
4. **No storage path, opaque filename or scanner internal is exposed.**
5. Every evidence view requires fresh purpose-bound authorization and is audited.

**Traceability.** `SCR-IDENTITY-029` · `WF-IDENTITY-029` · flows `FLOW-IDENTITY-008` `FLOW-PLATFORM-001` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-008` `WGT-PLATFORM-010` `WGT-PLATFORM-013` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-006` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` `CMP-PLATFORM-012` `CMP-PLATFORM-013` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-006` `IX-PLATFORM-007` `IX-PLATFORM-009` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-PLATFORM-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-034` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-AUDIT-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` `ERR-PLATFORM-002` `ERR-PLATFORM-004` `ERR-PLATFORM-005` · requirements `FR-IDENTITY-001`, `FR-AUDIT-001` · contract `SDC-IDENTITY-002`

---

### SCR-IDENTITY-030 — Request changes

**Wireframe:** `WF-IDENTITY-030` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** form · **Density:** `operational` · **Classification:** New
**Actors:** Verification staff within assigned scope
**Flows:** `FLOW-IDENTITY-009`
**Requirements:** `FR-IDENTITY-001`
**Data / action contract:** `SDC-IDENTITY-002`

**Purpose.** Let the reviewer request changes as an itemised set, each with a reason. Success is an applicant who corrects exactly what was asked. **A vague global request would force the applicant to redo the form**, which the canonical decision explicitly avoids.

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | The application and its current state. |
| Required input | One row per section or item to be corrected, each with its reason. |
| Validation and consequence | That the reviewer work item stays open. |
| Action | Send the requested changes. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` `WGT-PLATFORM-013` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) `CMP-PLATFORM-013` (`decided-by-person`) `CMP-PLATFORM-014` (`irreversible`) |
| Patterns | `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-IDENTITY-002` | submitted source facts, evidence verification state, duplicate/matching provider candidates, branch facts, applicant relationship evidence, review history, outstanding corrections. | claim/assign review if work-queue policy requires; verify/reject individual facts/evidence; request changes with itemized reasons; approve application; reject with reason. |

- `SDC-IDENTITY-002` records the itemised requests. **The reviewer work item stays open.**
- Missing-data behaviour: an item whose current submitted value could not be read cannot be flagged, because the applicant would not know what was being questioned.

**State**

- Lifecycle statuses visible: `CHANGES_REQUESTED`
- Permission model: Verification staff within assigned scope. Scoped to the actor's active grants, assigned work and subject-matter competence, enforced server-side. **A coarse role is not the authorization model** and no administrator bypass exists. A scope revoked mid-shift removes the affected actions structurally and states the change; it never renders as a quiet empty queue.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Send the requested changes | primary | at least one item is flagged and each carries a reason | DISABLED until every flagged item has a reason |
| Cancel | secondary | always before commit | never unavailable |

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
- Screen-reader hierarchy: Landmark order is application context, flagged items with reasons, consequence, action. Each flagged item announces as item, submitted value and requested change.
- Announcements: The committed request announces and focus returns to the queue.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- Each flagged item stacks with its reason at `.narrow`; no reason is truncated.

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

Not applicable here: `empty-no-data` `empty-filtered`. A single-command surface has no list-level filter.

**Acceptance criteria**

1. Corrections are itemised per section or item with a reason each.
2. **No global change request with no itemisation is possible.**
3. The reviewer work item stays open after the request is sent.
4. The applicant surface locks everything that was not flagged.

**Traceability.** `SCR-IDENTITY-030` · `WF-IDENTITY-030` · flows `FLOW-IDENTITY-009` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` `WGT-PLATFORM-013` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` `CMP-PLATFORM-013` `CMP-PLATFORM-014` · patterns `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-AUDIT-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-IDENTITY-001` · contract `SDC-IDENTITY-002`

---

### SCR-IDENTITY-031 — Approve application

**Wireframe:** `WF-IDENTITY-031` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** detail · **Density:** `operational` · **Classification:** New
**Actors:** Verification staff within assigned scope
**Flows:** `FLOW-IDENTITY-011`
**Requirements:** `FR-IDENTITY-001`, `FR-AUDIT-001`
**Data / action contract:** `SDC-IDENTITY-002`

**Purpose.** Let the reviewer approve an application, with **what approval does and does not do** stated in the confirmation. Success is an approval whose effects the reviewer understood. A reviewer who believes approval publishes a provider will approve differently.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The application and its verified state. |
| Primary facts | What approval atomically creates: the provider organization link, the applicant identity, the primary branch context, the scoped provider-representative capability, Clinic-panel access and the onboarding checklist work items. |
| Related history | **What approval does not do**: it activates no service, assigns no scientific grade, sets no internal classification component, publishes the provider neither publicly nor as production-ready. |
| Action | Approve. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`reviewer`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-013` (`decided-by-person`) `CMP-PLATFORM-014` (`irreversible`) |
| Patterns | `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-IDENTITY-002` | submitted source facts, evidence verification state, duplicate/matching provider candidates, branch facts, applicant relationship evidence, review history, outstanding corrections. | claim/assign review if work-queue policy requires; verify/reject individual facts/evidence; request changes with itemized reasons; approve application; reject with reason. |

- `SDC-IDENTITY-002` performs the approval atomically.
- **Approved applications become immutable except for later audit or correction events.**
- Missing-data behaviour: where the duplicate-candidate resolution is unread, approval is withheld.

**State**

- Lifecycle statuses visible: `APPROVED`
- Permission model: Verification staff within assigned scope. No control on this screen selects, sets or edits a scientific grade, an internal classification component or a final eligibility outcome. That absence is the enforcement, not a validation message.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Approve the application | primary | every required item is verified and the actor holds the scope | UNAVAILABLE with the outstanding items named |
| Back to the review | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-IDENTITY-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the status and identity region.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is application state, what approval creates, what approval does not do, action. Focus enters the confirmation on the effect statement, never on the approve control.
- Announcements: The committed approval announces and focus moves to the created provider record.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- Both halves of the effect statement are never collapsed behind a disclosure.

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

Not applicable here: `empty-no-data` `empty-filtered`. A single-command surface has no list and no filter.

**Acceptance criteria**

1. **The confirmation states both what approval does and what it does not do.**
2. Approval activates no service, assigns no grade, sets no internal classification component and publishes nothing.
3. Approval is atomic; a failure creates no partial provider record.
4. Approved applications become immutable except for later audit or correction events.

**Traceability.** `SCR-IDENTITY-031` · `WF-IDENTITY-031` · flows `FLOW-IDENTITY-011` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` · components `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-013` `CMP-PLATFORM-014` · patterns `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-IDENTITY-001`, `FR-AUDIT-001` · contract `SDC-IDENTITY-002`

---

### SCR-IDENTITY-032 — Reject application

**Wireframe:** `WF-IDENTITY-032` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** detail · **Density:** `operational` · **Classification:** New
**Actors:** Verification staff within assigned scope
**Flows:** `FLOW-IDENTITY-012` `FLOW-IDENTITY-020`
**Requirements:** `FR-IDENTITY-001`, `FR-AUDIT-001`
**Data / action contract:** `SDC-IDENTITY-002`

**Purpose.** Let the reviewer reject an application with a reason the applicant will see. Success is a rejection whose consequence the reviewer understood. It exists because **rejection closes this application but does not bar a later one** unless an explicit compliance restriction exists.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The application and its state. |
| Primary facts | The reason, which is required and reaches the applicant. |
| Related history | Whether a compliance restriction bars a later application. |
| Action | Reject. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`reviewer`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-013` (`decided-by-person`) `CMP-PLATFORM-014` (`irreversible`) |
| Patterns | `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-IDENTITY-002` | submitted source facts, evidence verification state, duplicate/matching provider candidates, branch facts, applicant relationship evidence, review history, outstanding corrections. | claim/assign review if work-queue policy requires; verify/reject individual facts/evidence; request changes with itemized reasons; approve application; reject with reason. |

- `SDC-IDENTITY-002` records the rejection with its reason.
- Missing-data behaviour: where the compliance-restriction state cannot be read, the confirmation says the restriction status is unknown rather than implying a new application is possible.

**State**

- Lifecycle statuses visible: `REJECTED`
- Permission model: Verification staff within assigned scope.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Reject the application | primary | a reason is given and the actor holds the scope | DISABLED until a reason is entered |
| Back to the review | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-001` `TXT-STATE-PLATFORM-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-IDENTITY-001` `TXT-STATE-PLATFORM-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the status and identity region.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is application, reason, restriction consequence, action.
- Announcements: The committed rejection announces and focus returns to the queue.
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

Not applicable here: `empty-no-data` `empty-filtered`. A single-command surface has no list and no filter.

**Acceptance criteria**

1. A reason is required and reaches the applicant.
2. The confirmation states whether a later new application is possible.
3. The reviewer knows which case they are creating before committing.

**Traceability.** `SCR-IDENTITY-032` · `WF-IDENTITY-032` · flows `FLOW-IDENTITY-012` `FLOW-IDENTITY-020` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` · components `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-013` `CMP-PLATFORM-014` · patterns `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-001` `TXT-STATE-PLATFORM-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-IDENTITY-001`, `FR-AUDIT-001` · contract `SDC-IDENTITY-002`

---

### SCR-IDENTITY-033 — Staff accounts and roles

**Wireframe:** `WF-IDENTITY-033` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** detail · **Density:** `operational` · **Classification:** New
**Actors:** System administrator
**Flows:** `FLOW-IDENTITY-017`
**Requirements:** `FR-IDENTITY-001`, `FR-AUDIT-001`
**Data / action contract:** `SDC-IDENTITY-004`

**Purpose.** Show staff accounts and their coarse capabilities. Success is an administrator who understands that **a coarse role is not the authorization model**: assigning one grants no business data access on its own.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The administrator's own scope. |
| Primary facts | One row per staff account with its state and assigned coarse capabilities. |
| Related history | That a coarse role grants no business data access on its own. |
| Action | Open the scope grants for an account. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-IDENTITY-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`reviewer`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-006` (`embedded`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-IDENTITY-004` | current identity, accessible provider/clinic contexts, accessible branches, effective capabilities, pending onboarding checklist/work counts. | switch active authorized provider/branch context; no authorization is created by switching. |

- `SDC-IDENTITY-004` projects the accounts and their coarse capabilities. Changes are audited.
- Missing-data behaviour: an account whose capability set could not be read is shown as unknown and offers no change control.

**State**

- Lifecycle statuses visible: account state; assigned coarse capabilities
- Permission model: System administrator. **No administrator bypass exists.**

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Open scope grants | primary | the actor is a system administrator | HIDDEN for any other actor |
| Change a coarse capability | secondary | the actor is a system administrator | HIDDEN otherwise. **The change is audited** |

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
- Focus entry: the status and identity region.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is scope, account list, the role-is-not-authorization statement. Each row announces its account state and its coarse capabilities.
- Announcements: A capability change announces and the row recomputes.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- A table at `.wide` degrading to the reading-list shape at `.narrow`.

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

Not applicable here: `empty-filtered`. The account set is scoped rather than filtered.

**Acceptance criteria**

1. **The screen never reads as if a coarse role granted business data access.**
2. Every change is audited.
3. No bypass capability exists or is offered.

**Traceability.** `SCR-IDENTITY-033` · `WF-IDENTITY-033` · flows `FLOW-IDENTITY-017` · widgets `WGT-IDENTITY-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` · components `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-006` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-IDENTITY-001`, `FR-AUDIT-001` · contract `SDC-IDENTITY-004`

---

### SCR-IDENTITY-034 — Staff scope grant

**Wireframe:** `WF-IDENTITY-034` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** form · **Density:** `operational` · **Classification:** New
**Actors:** System administrator or authorized access administrator
**Flows:** `FLOW-IDENTITY-017` `FLOW-IDENTITY-019`
**Requirements:** `FR-IDENTITY-001`
**Data / action contract:** `SDC-IDENTITY-004`

**Purpose.** Let an administrator grant a staff scope with every dimension explicit. Success is a grant whose scope was legible before it was committed. It exists because **an over-broad grant is a direct authorization breach across every interface**.

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | The account receiving the grant. |
| Required input | Organization, branch, capability, subject-matter scope, purpose and effective period, each captured explicitly. |
| Validation and consequence | What the grant permits, stated as a whole. |
| Action | Create the grant. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-IDENTITY-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) `CMP-PLATFORM-013` (`decided-by-person`) `CMP-PLATFORM-014` (`irreversible`) |
| Patterns | `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-IDENTITY-004` | current identity, accessible provider/clinic contexts, accessible branches, effective capabilities, pending onboarding checklist/work counts. | switch active authorized provider/branch context; no authorization is created by switching. |

- `SDC-IDENTITY-004` captures the organization, branch, capability, subject-matter scope, purpose and effective period explicitly.
- Missing-data behaviour: where the delegable capability set cannot be read, creation is withheld, because an unbounded option set allows an unbounded grant.

**State**

- Lifecycle statuses visible: grant effective period; revocation state
- Permission model: System administrator or authorized access administrator. **An administrator cannot self-grant a scope to bypass a policy requiring another accountable reviewer.**

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Create the grant | primary | every scope dimension is set and the actor may delegate it | DISABLED until every dimension is set, with what remains named |
| Revoke an existing grant | destructive | the grant is active | UNAVAILABLE once already revoked |

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
- Screen-reader hierarchy: Landmark order is account, scope dimensions, what it permits, action. The full scope is part of the confirm statement.
- Announcements: The committed grant announces and focus moves to the account.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- Scope dimensions stack at `.narrow`; the scope summary is never truncated before the confirm control.

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

Not applicable here: `empty-no-data` `empty-filtered`. A grant form has no list-level filter.

**Acceptance criteria**

1. Every scope dimension is captured explicitly rather than defaulted.
2. The scope being granted is legible before committing.
3. **Self-granting to bypass a policy requiring another accountable reviewer is denied.**
4. Revocation is reachable from the same surface.

**Traceability.** `SCR-IDENTITY-034` · `WF-IDENTITY-034` · flows `FLOW-IDENTITY-017` `FLOW-IDENTITY-019` · widgets `WGT-IDENTITY-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` `CMP-PLATFORM-013` `CMP-PLATFORM-014` · patterns `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-002` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-AUDIT-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-IDENTITY-001` · contract `SDC-IDENTITY-004`

---

### SCR-IDENTITY-035 — Guardian grant oversight

**Wireframe:** `WF-IDENTITY-035` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** form · **Density:** `operational` · **Classification:** New
**Actors:** Authorized staff within an explicit purpose and scope
**Flows:** `FLOW-IDENTITY-019`
**Requirements:** `FR-IDENTITY-003`, `FR-AUDIT-001`
**Data / action contract:** `SDC-IDENTITY-004`, `SDC-AUDIT-001`

**Purpose.** Let authorized staff inspect guardian grants for oversight and audit. Success is an auditor who can see the grant and its history. It exists because **administrative revocation is permitted only where the governing legal-basis workflow authorizes it** — this is not a general administrative power.

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | The purpose and scope under which the actor is looking. |
| Required input | The grant: parties, actions, data scope, purpose, effective period and basis. |
| Validation and consequence | The grant history and the audit trail. |
| Action | Revoke, only where the governing workflow authorizes it. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-IDENTITY-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) `CMP-PLATFORM-013` (`decided-by-person`) `CMP-PLATFORM-014` (`irreversible`) |
| Patterns | `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-IDENTITY-004` | current identity, accessible provider/clinic contexts, accessible branches, effective capabilities, pending onboarding checklist/work counts. | switch active authorized provider/branch context; no authorization is created by switching. |
| `SDC-AUDIT-001` | attributable audit metadata, resource/action/time/outcome/correlation, policy/snapshot/evidence references allowed by purpose, historical reproduction result/integrity state. | scoped search; inspect permitted event detail; request/export permitted audit output; invoke historical reproduction. |

- `SDC-IDENTITY-004` and `SDC-AUDIT-001` project the grant and its audit trail.
- **Guardian actions remain attributed to the guardian throughout history.**
- Missing-data behaviour: where the governing workflow authorization cannot be read, no revocation control is offered.

**State**

- Lifecycle statuses visible: grant active, expired, revoked
- Permission model: Authorized staff within an explicit purpose and scope. Access requires a legitimate operational, clinical, legal, financial, support or audit purpose, not merely holding an Admin account. Every sensitive read is audited.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Revoke this grant | destructive | **the governing legal-basis workflow authorizes administrative revocation for this grant** | HIDDEN where it does not. This is not a general administrative power |
| Open the audit event | secondary | always | never unavailable |

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
- Screen-reader hierarchy: Landmark order is purpose and scope, grant, history, actions. The revocation authority basis is announced with the control where one exists.
- Announcements: A revocation announces and the grant moves to history.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- The grant scope and its history stack at `.narrow`; the scope never truncates.

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

Not applicable here: `empty-no-data` `empty-filtered`. A single-grant oversight surface has no list-level filter.

**Acceptance criteria**

1. Administrative revocation appears only where the governing legal-basis workflow authorizes it.
2. Guardian actions remain attributed to the guardian throughout history.
3. Every sensitive read on this surface is audited.

**Traceability.** `SCR-IDENTITY-035` · `WF-IDENTITY-035` · flows `FLOW-IDENTITY-019` · widgets `WGT-IDENTITY-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` `CMP-PLATFORM-013` `CMP-PLATFORM-014` · patterns `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-002` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-AUDIT-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-IDENTITY-003`, `FR-AUDIT-001` · contract `SDC-IDENTITY-004`, `SDC-AUDIT-001`

---

### SCR-IDENTITY-036 — Providers and branches

**Wireframe:** `WF-IDENTITY-036` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** list-and-detail · **Density:** `operational` · **Classification:** New
**Actors:** Authorized staff within scope
**Flows:** `FLOW-IDENTITY-011` `FLOW-IDENTITY-020`
**Requirements:** `FR-IDENTITY-001`
**Data / action contract:** `SDC-IDENTITY-002`

**Purpose.** List the provider and branch records onboarding approval created. Success is an administrator who does not mistake this for a directory of live providers. **Existence here does not mean eligible, discoverable or production-ready**, and that distinction must be legible.

**Hierarchy** — Phase 2 priority order, not reopened: context/filter > list > selected detail > state-aware action.

| Region | Contents |
|---|---|
| Context and filter | The actor's scope and the filter. |
| List | One row per provider and branch with its approved-fact provenance. |
| Selected detail | **That existence here is not eligibility, discoverability or production readiness.** |
| State-aware action | Open the verification workbench for a provider. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-006` (`table`) `CMP-PLATFORM-007` (`queue`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-IDENTITY-002` | submitted source facts, evidence verification state, duplicate/matching provider candidates, branch facts, applicant relationship evidence, review history, outstanding corrections. | claim/assign review if work-queue policy requires; verify/reject individual facts/evidence; request changes with itemized reasons; approve application; reject with reason. |

- `SDC-IDENTITY-002` projects the provider and branch records with approved-fact provenance.
- Missing-data behaviour: a record whose provenance could not be read is shown as unknown rather than as approved.

**State**

- Lifecycle statuses visible: provider and branch existence; approved-fact provenance
- Permission model: Authorized staff within scope. Scoped to the actor's active grants, assigned work and subject-matter competence, enforced server-side. **A coarse role is not the authorization model** and no administrator bypass exists. A scope revoked mid-shift removes the affected actions structurally and states the change; it never renders as a quiet empty queue.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Open the verification workbench | primary | the actor holds the scope | HIDDEN without it |
| Filter by provider or branch | secondary | always | never unavailable |

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
- Screen-reader hierarchy: Landmark order is scope, filter, registry, the existence-is-not-eligibility statement. Each row announces the provider, the branch and the provenance of its approved facts.
- Announcements: A newly approved provider appearing announces politely.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- A table at `.wide` degrading to the reading-list shape at `.narrow`; provider legal names wrap and never truncate.

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

1. **The screen states that existence here is not eligibility, discoverability or production readiness.**
2. Every record shows its approved-fact provenance.
3. Filtered-empty and genuinely-empty read differently.

**Traceability.** `SCR-IDENTITY-036` · `WF-IDENTITY-036` · flows `FLOW-IDENTITY-011` `FLOW-IDENTITY-020` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-006` `CMP-PLATFORM-007` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-IDENTITY-001` · contract `SDC-IDENTITY-002`

---

### SCR-CATALOG-003 — Groups and services

**Wireframe:** `WF-CATALOG-003` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** list-and-detail · **Density:** `operational` · **Classification:** New
**Actors:** Policy owner and reviewers within owned domain
**Flows:** `FLOW-CATALOG-002` `FLOW-CATALOG-006`
**Requirements:** `FR-CATALOG-001`
**Data / action contract:** `SDC-CATALOG-001`

**Purpose.** Show the three governed catalog layers together: service groups, the patient-facing families beneath them, and how many detailed procedure items map into each family. Success is an administrator who can see which layer a change lands on. It exists because reasoning about a catalog change without that is guesswork.

**Hierarchy** — Phase 2 priority order, not reopened: context/filter > list > selected detail > state-aware action.

| Region | Contents |
|---|---|
| Context and filter | The catalog scope and the filter. |
| List | Groups, the families beneath them, and the procedure-item count mapped into each family. |
| Selected detail | Whether an active definition exists, and the audience of the seeded records. |
| State-aware action | Open a family's definition versions. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` `WGT-POLICY-001` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-006` (`table`) `CMP-PLATFORM-007` (`queue`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-POLICY-001` (`policy`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` `IX-POLICY-001` `IX-POLICY-002` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-CATALOG-001` | service groups, patient-facing service families, definition versions, audience/publication state, required launch gates, review status, effective dates, and per-family counts of mapped procedure items and their review state. | create a family; edit permitted draft content, labels, description, order and visibility; retire or supersede a family prospectively; submit/review/schedule/retire according to policy; invoke governed publication action after gates pass. |

- `SDC-CATALOG-001` projects the three layers with the mapped procedure-item counts.
- **The current record count is governed data and is never stated as a design constant**; the screen reads correctly whether a group holds one family or thirty.
- **Evaluation-audience content is provisional and is never equivalent to clinically approved production content.** The audience boundary is unmistakable on this surface and cannot be crossed by toggling visibility, activation or an effective date. Production medical content still requires licensed clinical approval under `Q-CATALOG-001`.
- Missing-data behaviour: a family whose active-definition presence could not be read is shown as unknown rather than as having none.

**State**

- Lifecycle statuses visible: service existence; active definition presence
- Permission model: Policy owner and reviewers within owned domain. Scoped to the actor's active grants, assigned work and subject-matter competence, enforced server-side. **A coarse role is not the authorization model** and no administrator bypass exists. A scope revoked mid-shift removes the affected actions structurally and states the change; it never renders as a quiet empty queue.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Open definition versions | primary | the actor holds the owned catalog scope | HIDDEN without it |
| Rename, regroup or retire | secondary | the actor is the policy owner for that domain | HIDDEN otherwise. **A referenced identity is superseded rather than repurposed** |
| Filter by group or audience | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-014` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011`
- No status this screen shows belongs to a governed lifecycle machine, so it binds no `TXT-STATE-*` rule. What the state section lists is descriptive condition, not a status chip drawn from a state machine.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-POLICY-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the filter or search control where one exists, otherwise the first row.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is scope, filter, the three layers as nested lists, audience statement. Each family announces its group, its mapped item count and whether an active definition exists.
- Announcements: A publication elsewhere announces politely and the active-definition state recomputes.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- Nested lists at every content width; at `.narrow` each family stacks with its counts beneath its name.

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

1. All three governed layers are visible and distinguishable.
2. No count on this screen is presented as a fixed design constant.
3. **The screen states that the seeded records are provisional evaluation content.**
4. A referenced identity is superseded rather than repurposed, so history keeps resolving.

**Traceability.** `SCR-CATALOG-003` · `WF-CATALOG-003` · flows `FLOW-CATALOG-002` `FLOW-CATALOG-006` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` `WGT-POLICY-001` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-006` `CMP-PLATFORM-007` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-POLICY-001` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` `IX-POLICY-001` `IX-POLICY-002` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-014` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-POLICY-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-CATALOG-001` · contract `SDC-CATALOG-001`

---

### SCR-CATALOG-004 — Definition versions

**Wireframe:** `WF-CATALOG-004` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** list-and-detail · **Density:** `operational` · **Classification:** New
**Actors:** Policy owner and reviewers within owned domain
**Flows:** `FLOW-CATALOG-002` `FLOW-CATALOG-004` `FLOW-CATALOG-005` `FLOW-CATALOG-006`
**Requirements:** `FR-CATALOG-001`, `FR-POLICY-001`
**Data / action contract:** `SDC-CATALOG-001`

**Purpose.** Show the version chain for one service definition. Success is an administrator who can see what is active, what is coming and what is historical. **Only a draft is deletable**; activated, retired and superseded content is immutable.

**Hierarchy** — Phase 2 priority order, not reopened: context/filter > list > selected detail > state-aware action.

| Region | Contents |
|---|---|
| Context and filter | The service and the governed version bar. |
| List | One row per version with its state, its audience and its effective period. |
| Selected detail | The comparison between any two versions. |
| State-aware action | Open the editor, or open the launch gates. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` `WGT-PLATFORM-014` `WGT-POLICY-001` |
| Components | `CMP-CLINICAL-002` (`version`) `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-006` (`table`) `CMP-PLATFORM-007` (`queue`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-POLICY-001` (`policy`) |
| Patterns | `IX-CLINICAL-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` `IX-POLICY-001` `IX-POLICY-002` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-CATALOG-001` | service groups, patient-facing service families, definition versions, audience/publication state, required launch gates, review status, effective dates, and per-family counts of mapped procedure items and their review state. | create a family; edit permitted draft content, labels, description, order and visibility; retire or supersede a family prospectively; submit/review/schedule/retire according to policy; invoke governed publication action after gates pass. |

- `SDC-CATALOG-001` projects the version chain with each version's state and audience.
- Activated, retired and superseded content is immutable; only a draft is editable. A change applies prospectively from its effective date and never mutates a historical case or decision, which keeps the version it was decided under.
- **Evaluation-audience content is provisional and is never equivalent to clinically approved production content.** The audience boundary is unmistakable on this surface and cannot be crossed by toggling visibility, activation or an effective date. Production medical content still requires licensed clinical approval under `Q-CATALOG-001`.
- Missing-data behaviour: where one side of a comparison failed to load, **no diff renders** and the missing side is named.

**State**

- Lifecycle statuses visible: `draft`, `reviewed`, `scheduled`, `active`, `retired`, `superseded`; audience
- Permission model: Policy owner and reviewers within owned domain. Scoped to the actor's active grants, assigned work and subject-matter competence, enforced server-side. **A coarse role is not the authorization model** and no administrator bypass exists. A scope revoked mid-shift removes the affected actions structurally and states the change; it never renders as a quiet empty queue.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Open the definition editor | primary | the version is a draft and the actor is the policy owner | HIDDEN on any non-draft version, which is immutable |
| Open the launch gates | primary | the version is not yet active | absent otherwise |
| Delete a draft | destructive | the version is a draft | **HIDDEN on every non-draft version** |
| Compare two versions | secondary | two versions exist | absent on a single version |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-014` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CATALOG-001` `TXT-STATE-POLICY-001` `TXT-STATE-REVIEWS-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-CATALOG-001` `TXT-STATE-POLICY-001` `TXT-STATE-REVIEWS-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-POLICY-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the filter or search control where one exists, otherwise the first row.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is version bar, version list, comparison. Each version announces its state, its audience and its effective period.
- Announcements: An activation announces politely and the chain recomputes.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- A table at `.wide`; comparison columns keep the prior version at the logical start and stack per row at `.narrow`.

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

1. Only a draft is deletable; every other state is immutable.
2. **Evaluation and production audience are unmistakable on every row.**
3. Historical cases keep their captured version regardless of what is active.
4. A partial comparison renders no diff and names the missing side.

**Traceability.** `SCR-CATALOG-004` · `WF-CATALOG-004` · flows `FLOW-CATALOG-002` `FLOW-CATALOG-004` `FLOW-CATALOG-005` `FLOW-CATALOG-006` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` `WGT-PLATFORM-014` `WGT-POLICY-001` · components `CMP-CLINICAL-002` `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-006` `CMP-PLATFORM-007` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-POLICY-001` · patterns `IX-CLINICAL-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` `IX-POLICY-001` `IX-POLICY-002` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-014` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CATALOG-001` `TXT-STATE-POLICY-001` `TXT-STATE-REVIEWS-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-POLICY-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-CATALOG-001`, `FR-POLICY-001` · contract `SDC-CATALOG-001`

---

### SCR-CATALOG-005 — Definition editor

**Wireframe:** `WF-CATALOG-005` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** form · **Density:** `operational` · **Classification:** New
**Actors:** Policy owner within owned catalog scope
**Flows:** `FLOW-CATALOG-002` `FLOW-CATALOG-006`
**Requirements:** `FR-CATALOG-001`, `FR-POLICY-001`
**Data / action contract:** `SDC-CATALOG-001`

**Purpose.** Let the policy owner author a draft service definition, with completeness visible while editing. Success is a draft that can pass its gates. It exists because **a clinically meaningful change cannot activate on the drafter's authority alone** and the drafter cannot approve their own draft.

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | The service and the draft version bar. |
| Required input | The definition content, including the clinically governed fields. |
| Validation and consequence | Required-card completeness, and that a clinically meaningful change needs the licensed reviewer. |
| Action | Save the draft, or send it to the gates. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-010` `WGT-PLATFORM-011` `WGT-POLICY-001` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) `CMP-PLATFORM-013` (`decided-by-person`) `CMP-POLICY-001` (`policy`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-005` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` `IX-POLICY-001` `IX-POLICY-002` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-CATALOG-001` | service groups, patient-facing service families, definition versions, audience/publication state, required launch gates, review status, effective dates, and per-family counts of mapped procedure items and their review state. | create a family; edit permitted draft content, labels, description, order and visibility; retire or supersede a family prospectively; submit/review/schedule/retire according to policy; invoke governed publication action after gates pass. |

- `SDC-CATALOG-001` accepts the draft. The clinically governed fields are the clinical scope, the internal service risk level, the minimum practitioner qualification, the required equipment, the evidence expectations, the inclusions and exclusions, and the follow-up, completion and escalation rules.
- **The internal risk field never reaches a patient surface**, and it is never named with the symbol that already means the verified patient review rating.
- Patient-facing content must be understandable **without any internal classification symbol**.
- Missing-data behaviour: an incomplete production card blocks publication, so completeness is visible while editing rather than discovered at publish.

**State**

- Lifecycle statuses visible: `draft`; required-card completeness
- Permission model: Policy owner within owned catalog scope; licensed clinical reviewer for the clinical fields. No control on this screen selects, sets or edits a scientific grade, an internal classification component or a final eligibility outcome. That absence is the enforcement, not a validation message.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Save the draft | primary | the version is a draft | **HIDDEN on any non-draft version** |
| Send to the launch gates | primary | the production card is complete | UNAVAILABLE with the outstanding cards named |
| Approve the clinical content | primary | the actor is the licensed clinical reviewer and is not the drafter | **HIDDEN for the drafter of this version** — the drafter cannot approve their own draft |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-014` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CATALOG-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-CATALOG-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-028` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-POLICY-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is version bar, content sections, completeness, actions. Completeness is a labelled list, not a progress figure alone.
- Announcements: A save announces once. Completeness announces when it changes state.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- A two-column form at `.wide` collapsing to one at `.narrow`, field order unchanged.

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

Not applicable here: `empty-no-data` `empty-filtered`. A draft editor has no list-level filter.

**Acceptance criteria**

1. Only a draft is editable on this surface.
2. Patient-facing content is understandable without any internal classification symbol.
3. **A clinically meaningful change cannot activate on the drafter's authority alone.**
4. **The drafter cannot approve their own draft.**
5. The internal risk field never reaches a patient surface and is never confused with the verified review rating.

**Traceability.** `SCR-CATALOG-005` · `WF-CATALOG-005` · flows `FLOW-CATALOG-002` `FLOW-CATALOG-006` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-010` `WGT-PLATFORM-011` `WGT-POLICY-001` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` `CMP-PLATFORM-013` `CMP-POLICY-001` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-005` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` `IX-POLICY-001` `IX-POLICY-002` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-014` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CATALOG-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-028` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-POLICY-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-AUDIT-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-CATALOG-001`, `FR-POLICY-001` · contract `SDC-CATALOG-001`

---

### SCR-CATALOG-006 — Launch gates

**Wireframe:** `WF-CATALOG-006` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** detail · **Density:** `operational` · **Classification:** New
**Actors:** Licensed clinical reviewer; Legal, Product and operations, and Technical accountable owners; authorized staff read-only
**Flows:** `FLOW-CATALOG-003` `FLOW-CATALOG-004` `FLOW-CATALOG-006` `FLOW-OPS-004`
**Requirements:** `FR-OPS-003`
**Data / action contract:** `SDC-CATALOG-001`

**Purpose.** Show the four accountable launch gates for one definition and what each blocks. Success is each accountable owner seeing their own gate as actionable. It exists because **`expired` must be visibly distinct from `rejected`**: one is a lapse needing re-approval, the other is a decision against the content.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The definition and its governed version bar. |
| Primary facts | The four gates: medical, legal, operational and technical, each with its accountable role, decision, evidence, expiry and current effective state. |
| Related history | What each gate blocks, and the medical gate's credential requirement. |
| Action | Record a decision, only for the gate the actor owns. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-CATALOG-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-006` `WGT-POLICY-001` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`reviewer`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-006` (`embedded`) `CMP-PLATFORM-008` (`record`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-013` (`decided-by-person`) `CMP-POLICY-001` (`policy`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` `IX-POLICY-001` `IX-POLICY-002` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-CATALOG-001` | service groups, patient-facing service families, definition versions, audience/publication state, required launch gates, review status, effective dates, and per-family counts of mapped procedure items and their review state. | create a family; edit permitted draft content, labels, description, order and visibility; retire or supersede a family prospectively; submit/review/schedule/retire according to policy; invoke governed publication action after gates pass. |

- `SDC-CATALOG-001` and `SDC-CATALOG-003` project the gate set and the credential state.
- **The medical gate additionally requires a current verified dental credential.**
- Missing-data behaviour: a gate whose state did not load blocks readiness and says so. **Readiness fails closed.**

**State**

- Lifecycle statuses visible: `pending`, `approved`, `rejected`, `revoked`, `expired` per gate; expiry dates
- Permission model: Licensed clinical reviewer; legal, product-and-operations, and technical accountable owners; authorized staff read-only. Each owner acts only on their own gate.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Record a decision | primary | the actor is the accountable owner for that exact gate | **HIDDEN on every gate the actor does not own**, which stays visible and read-only |
| Open reviewer credentials | secondary | always | never unavailable |
| Open publication | secondary | every required gate is satisfied | UNAVAILABLE with the outstanding gate named |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-014` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CATALOG-002` `TXT-STATE-PLATFORM-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-CATALOG-002` `TXT-STATE-PLATFORM-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-POLICY-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the status and identity region.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is version bar, the four gates, blocking statement, actions. Each gate announces its type, state, owner and expiry so `expired` and `rejected` are distinguishable without colour.
- Announcements: A decision recorded elsewhere announces politely and the blocking statement recomputes.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- Four gate rows at `.wide`; at `.narrow` each gate stacks with its state, owner and expiry, and the blocking statement stays above them.

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

Not applicable here: `empty-filtered`. The gate set is fixed at four and is never filtered.

**Acceptance criteria**

1. **`expired` reads as a lapse needing re-approval and is never conflated with `rejected`.**
2. Each accountable owner sees only their own gate as actionable; the rest stay visible and read-only.
3. The medical gate requires a current verified dental credential.
4. Readiness fails closed on any gate that is missing, expired, revoked, rejected or unknown.

**Traceability.** `SCR-CATALOG-006` · `WF-CATALOG-006` · flows `FLOW-CATALOG-003` `FLOW-CATALOG-004` `FLOW-CATALOG-006` `FLOW-OPS-004` · widgets `WGT-CATALOG-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-006` `WGT-POLICY-001` · components `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-006` `CMP-PLATFORM-008` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-013` `CMP-POLICY-001` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` `IX-POLICY-001` `IX-POLICY-002` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-014` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CATALOG-002` `TXT-STATE-PLATFORM-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-POLICY-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-OPS-003` · contract `SDC-CATALOG-001`

---
