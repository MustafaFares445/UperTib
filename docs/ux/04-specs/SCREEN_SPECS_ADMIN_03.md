# Screen Specifications — Admin panel (3 of 4)

**Phase:** UX 4 — Widget and Screen Specifications
**Platform:** Admin panel · Profile A · Filament panel
**Schema:** `PHASE_04_IMPLEMENTATION_PLAN.md` section 6. **Widgets:** `WIDGET_SPECS.md`. **Map:** `SCREEN_SPEC_MAP.md`.

Every block carries the same thirteen sections in the same order. A section that does not apply says so and why.

---
### SCR-FINANCE-010 — Records operations

**Wireframe:** `WF-FINANCE-010` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** list-and-detail · **Density:** `operational` · **Classification:** New
**Actors:** Finance reviewer; Operations staff within scope
**Flows:** `FLOW-CLINICAL-009` `FLOW-FINANCE-005` `FLOW-FINANCE-007` `FLOW-FINANCE-008`
**Requirements:** `FR-FINANCE-005`, `FR-FINANCE-006`
**Data / action contract:** `SDC-FINANCE-001`

**Purpose.** Give finance and operations the external financial records across cases. Success is a reviewer who can find the record they need. **No command here moves money**, and unconfirmed assertions are visibly distinct from confirmed facts.

**Hierarchy** — Phase 2 priority order, not reopened: context/filter > list > selected detail > state-aware action.

| Region | Contents |
|---|---|
| Context and filter | The finance scope and the filter. |
| List | One row per record with its state and its amounts, derived from immutable terms plus ordered events. |
| Selected detail | Pending external execution. |
| State-aware action | Open the dispute review, or the external execution tracking. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-FINANCE-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` `WGT-PLATFORM-006` |
| Components | `CMP-ELIG-002` (`governed display mode from the provider price fact`) `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-006` (`table`) `CMP-PLATFORM-007` (`queue`) `CMP-PLATFORM-008` (`record`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-FINANCE-001` | immutable financial terms snapshot, ordered external financial events, derived confirmed/disputed/pending states, evidence metadata, related work items. | report external payment/refund/compensation event; confirm/dispute when actor is authorized; create correction/reversal event; finance reviewer resolves assigned record-review work. |

- `SDC-FINANCE-001` projects the records. **Every displayed amount derives from immutable terms plus ordered events.**
- **No command on this surface authorizes, captures, holds, transfers, settles or refunds money, and no wording may imply otherwise.** An approved remedy records an obligation for external execution and nothing more.
- Missing-data behaviour: a record whose event set is incomplete renders **no derived amount** and names the gap.

**State**

- Lifecycle statuses visible: `REPORTED_UNCONFIRMED`, `CONFIRMED`, `DISPUTED`; pending external execution
- Permission model: Finance reviewer; operations staff within scope. Scoped to the actor's active grants, assigned work and subject-matter competence, enforced server-side. **A coarse role is not the authorization model** and no administrator bypass exists. A scope revoked mid-shift removes the affected actions structurally and states the change; it never renders as a quiet empty queue.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Open the dispute review | primary | the record is disputed and the actor holds the scope | HIDDEN without the scope |
| Open external execution tracking | secondary | an obligation exists | absent where none does |
| Filter by state | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-013` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-FINANCE-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-FINANCE-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.
- **No command on this surface authorizes, captures, holds, transfers, settles or refunds money, and no wording may imply otherwise.** An approved remedy records an obligation for external execution and nothing more.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-FINANCE-001` | a financial event that conflicts with the governing terms or the existing event history | `TXT-ERR-FINANCE-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-FINANCE-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the filter or search control where one exists, otherwise the first row.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is scope and filter, record list. Every amount announces with its currency and its state.
- Announcements: A new event appearing announces politely.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- A table at `.wide` degrading to the reading-list shape at `.narrow`; **no amount column is truncated to keep a table**.

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

1. **No command on this surface authorizes, captures, holds, transfers, settles or refunds money, and no wording may imply otherwise.** An approved remedy records an obligation for external execution and nothing more.
2. Unconfirmed assertions are visibly distinct from confirmed facts.
3. Every amount derives from immutable terms plus ordered events.
4. An incomplete event set renders no derived amount and names the gap.

**Traceability.** `SCR-FINANCE-010` · `WF-FINANCE-010` · flows `FLOW-CLINICAL-009` `FLOW-FINANCE-005` `FLOW-FINANCE-007` `FLOW-FINANCE-008` · widgets `WGT-FINANCE-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` `WGT-PLATFORM-006` · components `CMP-ELIG-002` `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-006` `CMP-PLATFORM-007` `CMP-PLATFORM-008` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-013` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-FINANCE-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-FINANCE-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-FINANCE-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-FINANCE-005`, `FR-FINANCE-006` · contract `SDC-FINANCE-001`

---

### SCR-FINANCE-011 — Dispute review

**Wireframe:** `WF-FINANCE-011` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** detail · **Density:** `operational` · **Classification:** New
**Actors:** Finance reviewer within explicit case or work-item scope
**Flows:** `FLOW-FINANCE-005`
**Requirements:** `FR-FINANCE-003`, `FR-FINANCE-005`
**Data / action contract:** `SDC-FINANCE-001`, `SDC-OPS-001`

**Purpose.** Let a finance reviewer resolve a dispute by appending a reasoned event. Success is a resolution that leaves both assertions readable. **No earlier record is edited or deleted, and no funds move.**

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The disputed record and the reviewer's case or work-item scope. |
| Primary facts | Both parties' assertions and the evidence the reviewer is authorized to see. |
| Related history | The disputed record against the projection after the appended resolution. |
| Action | Record the resolution. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-FINANCE-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-006` `WGT-PLATFORM-014` |
| Components | `CMP-CLINICAL-002` (`version`) `CMP-ELIG-002` (`governed display mode from the provider price fact`) `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`reviewer`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-006` (`embedded`) `CMP-PLATFORM-008` (`record`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-013` (`decided-by-person`) |
| Patterns | `IX-CLINICAL-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` `IX-POLICY-002` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-FINANCE-001` | immutable financial terms snapshot, ordered external financial events, derived confirmed/disputed/pending states, evidence metadata, related work items. | report external payment/refund/compensation event; confirm/dispute when actor is authorized; create correction/reversal event; finance reviewer resolves assigned record-review work. |
| `SDC-OPS-001` | work item ID/type, linked resource/case, lifecycle state, escalated flag, overdue flag, priority, due time, responsibility scope, blocking reason, assignment, safe summary. | claim/assign where allowed; start; move to waiting with a named blocking reason; resume; complete with outcome; escalate; reopen where policy permits. |

- `SDC-FINANCE-001` appends the reasoned resolution event.
- Records here are append-only. A resolution, correction or reopening is a later event; no earlier record is edited or deleted. **No command on this surface authorizes, captures, holds, transfers, settles or refunds money, and no wording may imply otherwise.** An approved remedy records an obligation for external execution and nothing more.
- Missing-data behaviour: where either assertion could not be read, no resolution is offered, because resolving against one side is resolving the wrong dispute.

**State**

- Lifecycle statuses visible: `DISPUTED` before; derived projection after the appended resolution
- Permission model: Finance reviewer within explicit case or work-item scope. No control on this screen overrides a computed decision, forces a state, or edits a historical record. Where a correction is needed it is a new governed fact or a new appended event, never an in-place change.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Record the resolution | primary | the actor holds the explicit case or work-item scope and a reason is given | DISABLED until a reason is entered |
| Back to records operations | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-013` `TXT-PLATFORM-014` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-FINANCE-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-FINANCE-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.
- **No command on this surface authorizes, captures, holds, transfers, settles or refunds money, and no wording may imply otherwise.** An approved remedy records an obligation for external execution and nothing more.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-FINANCE-001` | a financial event that conflicts with the governing terms or the existing event history | `TXT-ERR-FINANCE-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-FINANCE-001` `A11Y-POLICY-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the status and identity region.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is disputed record, both assertions, the before-and-after comparison, action. The comparison announces each changed element as element, prior value, new value.
- Announcements: The appended resolution announces and the derived projection recomputes.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- The two assertions stack at `.narrow` with the disputed record at the logical start.

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

Not applicable here: `empty-filtered`. A single-dispute surface has no list-level filter.

**Acceptance criteria**

1. **No earlier record is edited or deleted; the resolution appends.**
2. **No funds move.**
3. The reviewer sees both parties' assertions and only the evidence they are authorized to see.
4. A partial read renders no comparison and names the missing side.

**Traceability.** `SCR-FINANCE-011` · `WF-FINANCE-011` · flows `FLOW-FINANCE-005` · widgets `WGT-FINANCE-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-006` `WGT-PLATFORM-014` · components `CMP-CLINICAL-002` `CMP-ELIG-002` `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-006` `CMP-PLATFORM-008` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-013` · patterns `IX-CLINICAL-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` `IX-POLICY-002` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-013` `TXT-PLATFORM-014` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-FINANCE-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-FINANCE-001` `A11Y-POLICY-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-FINANCE-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-FINANCE-003`, `FR-FINANCE-005` · contract `SDC-FINANCE-001`, `SDC-OPS-001`

---

### SCR-FINANCE-012 — External execution tracking

**Wireframe:** `WF-FINANCE-012` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** detail · **Density:** `operational` · **Classification:** New
**Actors:** Finance reviewer; Operations staff within scope
**Flows:** `FLOW-CLAIMS-006` `FLOW-CLAIMS-009` `FLOW-FINANCE-008`
**Requirements:** `FR-FINANCE-004`, `FR-CLAIMS-001`, `FR-FINANCE-007`
**Data / action contract:** `SDC-FINANCE-001`

**Purpose.** Track obligations recorded for external execution, keeping entitlement, decision and execution visibly separate. Success is a reviewer who can tell those three apart. **An approved remedy creates an obligation and nothing more; the platform never executes it.**

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The finance scope and the filter. |
| Primary facts | One row per obligation with its recorded, asserted and confirmed-or-disputed states as distinct states and times. |
| Related history | The decision that created the obligation. |
| Action | Open the record. **No execution control exists.** |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-FINANCE-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-006` |
| Components | `CMP-ELIG-002` (`governed display mode from the provider price fact`) `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`reviewer`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-006` (`embedded`) `CMP-PLATFORM-008` (`record`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-013` (`decided-by-person`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-FINANCE-001` | immutable financial terms snapshot, ordered external financial events, derived confirmed/disputed/pending states, evidence metadata, related work items. | report external payment/refund/compensation event; confirm/dispute when actor is authorized; create correction/reversal event; finance reviewer resolves assigned record-review work. |

- `SDC-FINANCE-001` projects the obligations with their distinct states and times.
- **Entitlement and decision remain visibly separate from execution, as distinct states and distinct times.**
- **No command on this surface authorizes, captures, holds, transfers, settles or refunds money, and no wording may imply otherwise.** An approved remedy records an obligation for external execution and nothing more.
- Missing-data behaviour: an obligation whose execution state could not be read is shown as unknown and never as executed.

**State**

- Lifecycle statuses visible: obligation recorded; execution asserted; execution confirmed or disputed
- Permission model: Finance reviewer; operations staff within scope. No control on this screen overrides a computed decision, forces a state, or edits a historical record. Where a correction is needed it is a new governed fact or a new appended event, never an in-place change.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Open the financial record | primary | always | never unavailable |
| Filter by execution state | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-013` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011`
- No status this screen shows belongs to a governed lifecycle machine, so it binds no `TXT-STATE-*` rule. What the state section lists is descriptive condition, not a status chip drawn from a state machine.
- **No command on this surface authorizes, captures, holds, transfers, settles or refunds money, and no wording may imply otherwise.** An approved remedy records an obligation for external execution and nothing more.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-FINANCE-001` | a financial event that conflicts with the governing terms or the existing event history | `TXT-ERR-FINANCE-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-FINANCE-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the status and identity region.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is scope and filter, obligation list, originating decision. Each obligation announces its three states with their times.
- Announcements: An execution assertion appearing announces politely.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- A table at `.wide` degrading to the reading-list shape at `.narrow`; amounts never truncate.

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

Not applicable here: `empty-filtered`. No state is omitted on this surface.

**Acceptance criteria**

1. **The platform never executes an obligation and no control here suggests it does.**
2. Entitlement, decision and execution are three distinct states with distinct times.
3. An unknown execution state is never rendered as executed.
4. **No command on this surface authorizes, captures, holds, transfers, settles or refunds money, and no wording may imply otherwise.** An approved remedy records an obligation for external execution and nothing more.

**Traceability.** `SCR-FINANCE-012` · `WF-FINANCE-012` · flows `FLOW-CLAIMS-006` `FLOW-CLAIMS-009` `FLOW-FINANCE-008` · widgets `WGT-FINANCE-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-006` · components `CMP-ELIG-002` `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-006` `CMP-PLATFORM-008` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-013` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-013` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-FINANCE-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-FINANCE-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-FINANCE-004`, `FR-CLAIMS-001`, `FR-FINANCE-007` · contract `SDC-FINANCE-001`

---

### SCR-REVIEWS-007 — Integrity queue

**Wireframe:** `WF-REVIEWS-007` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** list-and-detail · **Density:** `operational` · **Classification:** New
**Actors:** Review integrity reviewer within assigned scope
**Flows:** `FLOW-REVIEWS-003` `FLOW-REVIEWS-004` `FLOW-REVIEWS-005`
**Requirements:** `FR-REVIEWS-001`, `FR-REVIEWS-002`
**Data / action contract:** `SDC-REVIEWS-001`, `SDC-OPS-001`

**Purpose.** Give the review integrity reviewer their assigned work, distinguishing reviews needing an eligibility decision from appeals needing a decision. Success is the reviewer starting the right task. **They are different tasks and must be distinguishable.**

**Hierarchy** — Phase 2 priority order, not reopened: context/filter > list > selected detail > state-aware action.

| Region | Contents |
|---|---|
| Context and filter | The reviewer's assigned scope and the filter. |
| List | One row per item, distinguishing a review decision from an appeal decision. |
| Selected detail | The selected item. |
| State-aware action | Open the integrity decision, or the appeal decision. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-006` (`table`) `CMP-PLATFORM-007` (`queue`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-013` (`decided-by-person`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-REVIEWS-001` | eligible review summary, verified-experience linkage, publication/moderation state, appeal window/status, safe evidence metadata, reviewer work state. | provider submits eligible appeal; reviewer processes assigned integrity/appeal work with reasons. |
| `SDC-OPS-001` | work item ID/type, linked resource/case, lifecycle state, escalated flag, overdue flag, priority, due time, responsibility scope, blocking reason, assignment, safe summary. | claim/assign where allowed; start; move to waiting with a named blocking reason; resume; complete with outcome; escalate; reopen where policy permits. |

- `SDC-REVIEWS-001` and `SDC-OPS-001` project the assigned integrity work.
- Missing-data behaviour: an item whose task type could not be read is not routed to either decision surface, because misrouting is worse than delay.

**State**

- Lifecycle statuses visible: review `ACTIVE`, `RETIRED`; appeal `SUBMITTED`, `DECIDED`
- Permission model: Review integrity reviewer within assigned scope. Scoped to the actor's active grants, assigned work and subject-matter competence, enforced server-side. **A coarse role is not the authorization model** and no administrator bypass exists. A scope revoked mid-shift removes the affected actions structurally and states the change; it never renders as a quiet empty queue.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Open the integrity decision | primary | the item is a review needing an eligibility decision | absent on an appeal item |
| Open the appeal decision | primary | the item is an appeal needing a decision | absent on a review item |
| Filter by task type | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-REVIEWS-001` `TXT-STATE-REVIEWS-002`
- Lifecycle labels for every status above are owned by `TXT-STATE-REVIEWS-001` `TXT-STATE-REVIEWS-002` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |
| `ERR-REVIEWS-001` | a review or appeal that is ineligible, already active, or outside its window | `TXT-ERR-REVIEWS-001` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the filter or search control where one exists, otherwise the first row.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is scope and filter, work list. Each row announces its task type and its state.
- Announcements: A newly assigned item announces politely.
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

1. Reviews needing an eligibility decision and appeals needing a decision are distinguishable.
2. The queue is scoped to assigned integrity work.
3. A permission failure never renders as an empty queue.

**Traceability.** `SCR-REVIEWS-007` · `WF-REVIEWS-007` · flows `FLOW-REVIEWS-003` `FLOW-REVIEWS-004` `FLOW-REVIEWS-005` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-006` `CMP-PLATFORM-007` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-013` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-REVIEWS-001` `TXT-STATE-REVIEWS-002` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` `ERR-REVIEWS-001` · requirements `FR-REVIEWS-001`, `FR-REVIEWS-002` · contract `SDC-REVIEWS-001`, `SDC-OPS-001`

---

### SCR-REVIEWS-008 — Integrity decision

**Wireframe:** `WF-REVIEWS-008` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** form · **Density:** `operational` · **Classification:** New
**Actors:** Review integrity reviewer within assigned scope
**Flows:** `FLOW-REVIEWS-003` `FLOW-REVIEWS-004` `FLOW-REVIEWS-006`
**Requirements:** `FR-REVIEWS-001`, `FR-REVIEWS-002`
**Data / action contract:** `SDC-REVIEWS-001`

**Purpose.** Let the integrity reviewer decide eligibility and policy compliance for a review. Success is a recorded decision with findings and a reason. **It cannot edit rating content, and the verified rating never feeds any classification component.**

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | The review and the reviewer's assigned scope. |
| Required input | The rating and text, read-only. |
| Validation and consequence | The findings and the reason, both required. |
| Action | Record the decision. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) `CMP-PLATFORM-013` (`decided-by-person`) `CMP-PLATFORM-014` (`irreversible`) |
| Patterns | `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-REVIEWS-001` | eligible review summary, verified-experience linkage, publication/moderation state, appeal window/status, safe evidence metadata, reviewer work state. | provider submits eligible appeal; reviewer processes assigned integrity/appeal work with reasons. |

- `SDC-REVIEWS-001` records the decision with its findings and reason.
- **The decision covers eligibility and policy compliance only. It cannot edit rating content, and the verified rating never feeds any internal classification component.**
- Missing-data behaviour: where the governing policy could not be read, no decision is offered, because the compliance basis would be unattributable.

**State**

- Lifecycle statuses visible: review `ACTIVE`, `RETIRED`; recorded findings
- Permission model: Review integrity reviewer within assigned scope. No control on this screen overrides a computed decision, forces a state, or edits a historical record. Where a correction is needed it is a new governed fact or a new appended event, never an in-place change.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Record the decision | primary | findings and a reason are given and separation of duties is satisfied | DISABLED until findings and a reason are entered; HIDDEN where separation of duties excludes this actor |
| Open the appeal decision | secondary | an appeal exists | absent where none does |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-REVIEWS-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-REVIEWS-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |
| `ERR-REVIEWS-001` | a review or appeal that is ineligible, already active, or outside its window | `TXT-ERR-REVIEWS-001` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is review content, findings, reason, action. The scope boundary is announced with the action set.
- Announcements: The recorded decision announces and focus moves to the resulting state.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- Findings and reason stack beneath the read-only review content at `.narrow`.

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

Not applicable here: `empty-no-data` `empty-filtered`. A single-decision surface has no list and no filter.

**Acceptance criteria**

1. **No control edits rating content.**
2. **No affordance suggests a classification consequence**: the verified rating never feeds any internal classification component.
3. Findings and a reason are both required.
4. Separation of duties applies where the governing policy requires it.

**Traceability.** `SCR-REVIEWS-008` · `WF-REVIEWS-008` · flows `FLOW-REVIEWS-003` `FLOW-REVIEWS-004` `FLOW-REVIEWS-006` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` `CMP-PLATFORM-013` `CMP-PLATFORM-014` · patterns `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-REVIEWS-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-AUDIT-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` `ERR-PLATFORM-002` `ERR-PLATFORM-004` `ERR-REVIEWS-001` · requirements `FR-REVIEWS-001`, `FR-REVIEWS-002` · contract `SDC-REVIEWS-001`

---

### SCR-REVIEWS-009 — Appeal decision

**Wireframe:** `WF-REVIEWS-009` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** form · **Density:** `operational` · **Classification:** New
**Actors:** Review integrity reviewer within assigned scope, subject to separation of duties
**Flows:** `FLOW-REVIEWS-004` `FLOW-REVIEWS-005`
**Requirements:** `FR-REVIEWS-002`
**Data / action contract:** `SDC-REVIEWS-001`

**Purpose.** Let an independent integrity reviewer decide a review appeal. Success is a recorded appeal decision that both parties can see safely. **The original review record is not directly rewritten by the appeal.**

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | The appeal, the original decision and the reviewer's independence. |
| Required input | The appellant's policy-grounded reason and evidence. |
| Validation and consequence | The reasoned decision. |
| Action | Record the appeal decision. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) `CMP-PLATFORM-013` (`decided-by-person`) `CMP-PLATFORM-014` (`irreversible`) |
| Patterns | `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-REVIEWS-001` | eligible review summary, verified-experience linkage, publication/moderation state, appeal window/status, safe evidence metadata, reviewer work state. | provider submits eligible appeal; reviewer processes assigned integrity/appeal work with reasons. |

- `SDC-REVIEWS-001` records the appeal decision.
- **The original review record is not directly rewritten by the appeal**; the decision is recorded alongside it.
- Missing-data behaviour: where the original decision could not be read, no appeal decision is offered.

**State**

- Lifecycle statuses visible: appeal `SUBMITTED` before, `DECIDED` after
- Permission model: Review integrity reviewer within assigned scope, subject to separation of duties.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Record the appeal decision | primary | the actor satisfies separation of duties and a reason is given | **HIDDEN for the reviewer who made the original decision** |
| Back to the integrity queue | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-REVIEWS-002`
- Lifecycle labels for every status above are owned by `TXT-STATE-REVIEWS-002` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |
| `ERR-REVIEWS-001` | a review or appeal that is ineligible, already active, or outside its window | `TXT-ERR-REVIEWS-001` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is appeal, original decision, reasoned decision, action. The independence requirement is announced with the action.
- Announcements: The recorded decision announces and both parties' safe result is stated.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- The original decision stays readable above the decision form at every content width.

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

Not applicable here: `empty-no-data` `empty-filtered`. A single-decision surface has no list and no filter.

**Acceptance criteria**

1. The original decision-maker cannot decide the appeal.
2. **The original review record is not directly rewritten.**
3. Both parties see a safe result.

**Traceability.** `SCR-REVIEWS-009` · `WF-REVIEWS-009` · flows `FLOW-REVIEWS-004` `FLOW-REVIEWS-005` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` `CMP-PLATFORM-013` `CMP-PLATFORM-014` · patterns `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-REVIEWS-002` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-AUDIT-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` `ERR-PLATFORM-002` `ERR-PLATFORM-004` `ERR-REVIEWS-001` · requirements `FR-REVIEWS-002` · contract `SDC-REVIEWS-001`

---

### SCR-CLAIMS-009 — Claims queue

**Wireframe:** `WF-CLAIMS-009` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** list-and-detail · **Density:** `operational` · **Classification:** New
**Actors:** Claim or dispute reviewer; Operations staff within scope
**Flows:** `FLOW-CLAIMS-005` `FLOW-CLAIMS-006` `FLOW-CLAIMS-008` `FLOW-CLAIMS-009` `FLOW-PLATFORM-004`
**Requirements:** `FR-CLAIMS-001`, `FR-CLAIMS-002`, `FR-OPS-001`
**Data / action contract:** `SDC-CLAIMS-001`, `SDC-OPS-001`

**Purpose.** Give claim and dispute reviewers their assigned work, distinguishing claims that need a medically sensitive decision. Success is the right reviewer on the right claim, because **deciding one without the required clinical competence is denied**.

**Hierarchy** — Phase 2 priority order, not reopened: context/filter > list > selected detail > state-aware action.

| Region | Contents |
|---|---|
| Context and filter | The reviewer's scope and competence, and the filter. |
| List | One row per claim with its state, its deadlines, its missing-evidence count and its appeal state. |
| Selected detail | Whether the claim needs a medically sensitive decision. |
| State-aware action | Open the claim review, or the appeal decision. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-006` (`table`) `CMP-PLATFORM-007` (`queue`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-CLAIMS-001` | claim/refund type, case linkage, governing snapshots, evidence states, deadlines/extensions, party responses, decision/appeal history, external-execution state where applicable. | clinic submits allowed evidence/response/appeal; reviewer requests evidence, records reasoned decision, handles eligible appeal according to separation of duties. |
| `SDC-OPS-001` | work item ID/type, linked resource/case, lifecycle state, escalated flag, overdue flag, priority, due time, responsibility scope, blocking reason, assignment, safe summary. | claim/assign where allowed; start; move to waiting with a named blocking reason; resume; complete with outcome; escalate; reopen where policy permits. |

- `SDC-CLAIMS-001` and `SDC-OPS-001` project the assigned claim work.
- Missing-data behaviour: a claim whose competence requirement could not be read is not offered to a reviewer without clinical competence.

**State**

- Lifecycle statuses visible: all five claim states; appeal states; deadlines; missing evidence counts
- Permission model: Claim or dispute reviewer; operations staff within scope. Scoped to the actor's active grants, assigned work and subject-matter competence, enforced server-side. **A coarse role is not the authorization model** and no administrator bypass exists. A scope revoked mid-shift removes the affected actions structurally and states the change; it never renders as a quiet empty queue.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Open the claim review | primary | the claim is within the actor's assigned and subject-matter scope | HIDDEN where it is not |
| Open the appeal decision | primary | an appeal awaits a decision and the actor satisfies separation of duties | HIDDEN otherwise |
| Filter by competence requirement | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLAIMS-001` `TXT-STATE-CLAIMS-002`
- Lifecycle labels for every status above are owned by `TXT-STATE-CLAIMS-001` `TXT-STATE-CLAIMS-002` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-CLAIMS-001` | a claim, refund request or appeal that is ineligible or outside its policy window | `TXT-ERR-CLAIMS-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the filter or search control where one exists, otherwise the first row.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is scope and filter, claim list. Each row announces its state, its deadline, its missing-evidence count and its competence requirement.
- Announcements: A deadline entering its approaching window announces politely.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- A table at `.wide` degrading to the reading-list shape at `.narrow`; deadlines never truncate.

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

1. **Claims needing a medically sensitive decision are distinguishable in the list.**
2. The queue is scoped to assigned work and subject-matter competence.
3. Deadlines and missing-evidence counts are visible in the list.
4. A permission failure never renders as an empty queue.

**Traceability.** `SCR-CLAIMS-009` · `WF-CLAIMS-009` · flows `FLOW-CLAIMS-005` `FLOW-CLAIMS-006` `FLOW-CLAIMS-008` `FLOW-CLAIMS-009` `FLOW-PLATFORM-004` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-006` `CMP-PLATFORM-007` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLAIMS-001` `TXT-STATE-CLAIMS-002` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-CLAIMS-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-CLAIMS-001`, `FR-CLAIMS-002`, `FR-OPS-001` · contract `SDC-CLAIMS-001`, `SDC-OPS-001`

---

### SCR-CLAIMS-010 — Claim review

**Wireframe:** `WF-CLAIMS-010` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** detail · **Density:** `operational` · **Classification:** New
**Actors:** Claim or dispute reviewer within assigned and subject-matter scope
**Flows:** `FLOW-CLAIMS-005` `FLOW-CLAIMS-006`
**Requirements:** `FR-CLAIMS-003`, `FR-CLAIMS-004`
**Data / action contract:** `SDC-CLAIMS-001`

**Purpose.** Give the reviewer the governing snapshots, both parties' responses and the evidence they are authorized to see. Success is a decision made against **the historical entitlement, not current configuration**.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The claim, its state and the reviewer's scope. |
| Primary facts | The governing accepted terms and policy snapshot, and the treatment content read-only. |
| Related history | Both parties' responses, the evidence states and the deadline history. |
| Action | Open the evidence and deadlines, record the decision, or open the case oversight. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-CLINICAL-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` `WGT-PLATFORM-006` |
| Components | `CMP-CLINICAL-001` (`oversight`) `CMP-ELIG-002` (`governed display mode from the provider price fact`) `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`reviewer`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-006` (`embedded`) `CMP-PLATFORM-007` (`management`) `CMP-PLATFORM-008` (`record`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-013` (`decided-by-person`) |
| Patterns | `IX-CLINICAL-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-CLAIMS-001` | claim/refund type, case linkage, governing snapshots, evidence states, deadlines/extensions, party responses, decision/appeal history, external-execution state where applicable. | clinic submits allowed evidence/response/appeal; reviewer requests evidence, records reasoned decision, handles eligible appeal according to separation of duties. |

- `SDC-CLAIMS-001` projects the governing accepted terms and policy snapshot, both parties' responses, the evidence states and the deadline history.
- **The governing snapshot is the historical entitlement, not current configuration.**
- Missing-data behaviour: where the governing snapshot could not be read, no decision is offered, because the entitlement basis would be unknown.

**State**

- Lifecycle statuses visible: all five claim states; governing snapshots; evidence states; deadline history; party responses
- Permission model: Claim or dispute reviewer within assigned and subject-matter scope. **Reviewer-only findings stay filtered from party-visible projections.** Access requires a legitimate operational, clinical, legal, financial, support or audit purpose, not merely holding an Admin account. Every sensitive read is audited.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Open evidence and deadlines | primary | the actor holds the scope | HIDDEN without it |
| Record the sensitive decision | primary | the actor holds the required role, organization and subject-matter scope | HIDDEN without them |
| Open the case oversight detail | secondary | the actor holds the purpose scope | HIDDEN without it |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-013` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLAIMS-001` `TXT-STATE-PLATFORM-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-CLAIMS-001` `TXT-STATE-PLATFORM-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-CLAIMS-001` | a claim, refund request or appeal that is ineligible or outside its policy window | `TXT-ERR-CLAIMS-001` |
| `ERR-CLAIMS-002` | a claim submission or response whose required evidence is incomplete or invalid | `TXT-ERR-CLAIMS-002` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-FINANCE-001` `A11Y-CLINICAL-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the status and identity region.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is claim state, governing snapshots, party responses and evidence, deadline history, actions. Amounts announce with their currency and category.
- Announcements: A party response arriving announces politely.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- The governing snapshot occupies the primary region with the deadline history in a supporting rail at `.wide`, moving below at `.narrow`.

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

1. The governing accepted terms and policy snapshot are the historical ones, not current configuration.
2. Reviewer-only findings stay filtered from party-visible projections.
3. Both parties' responses are visible to the reviewer.
4. Treatment amounts render read-only with their category and reason.

**Traceability.** `SCR-CLAIMS-010` · `WF-CLAIMS-010` · flows `FLOW-CLAIMS-005` `FLOW-CLAIMS-006` · widgets `WGT-CLINICAL-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` `WGT-PLATFORM-006` · components `CMP-CLINICAL-001` `CMP-ELIG-002` `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-006` `CMP-PLATFORM-007` `CMP-PLATFORM-008` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-013` · patterns `IX-CLINICAL-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-013` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLAIMS-001` `TXT-STATE-PLATFORM-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-FINANCE-001` `A11Y-CLINICAL-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-CLAIMS-001` `ERR-CLAIMS-002` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-CLAIMS-003`, `FR-CLAIMS-004` · contract `SDC-CLAIMS-001`

---

### SCR-CLAIMS-011 — Evidence and deadlines

**Wireframe:** `WF-CLAIMS-011` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** detail · **Density:** `operational` · **Classification:** New
**Actors:** Verification or claim staff within assigned scope
**Flows:** `FLOW-CLAIMS-005`
**Requirements:** `FR-CLAIMS-003`
**Data / action contract:** `SDC-CLAIMS-001`

**Purpose.** Show the claim's required evidence and its deadline history. Success is a reviewer who can see both the original and the effective deadline. **An authorized pause or extension appends a reasoned event and never replaces the original**; silently replacing a deadline is denied.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The claim and the reviewer's scope. |
| Primary facts | One row per required item, individually distinguishable as missing, rejected, expired or accepted, each with its reason. |
| Related history | **The original deadline against the effective one**, with the appended events that moved it. |
| Action | Record a pause or extension, which appends. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-CLAIMS-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-006` `WGT-PLATFORM-008` `WGT-PLATFORM-014` |
| Components | `CMP-CLINICAL-002` (`version`) `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`reviewer`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-006` (`embedded`) `CMP-PLATFORM-008` (`record`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-012` (`intake`) |
| Patterns | `IX-BOOKING-001` `IX-CLINICAL-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-006` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-009` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` `IX-POLICY-002` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-CLAIMS-001` | claim/refund type, case linkage, governing snapshots, evidence states, deadlines/extensions, party responses, decision/appeal history, external-execution state where applicable. | clinic submits allowed evidence/response/appeal; reviewer requests evidence, records reasoned decision, handles eligible appeal according to separation of duties. |

- `SDC-CLAIMS-001` projects the requirements and deadlines, which **resolve from the versioned policy snapshot**.
- Records here are append-only. A resolution, correction or reopening is a later event; no earlier record is edited or deleted.
- Missing-data behaviour: a requirement whose state did not load is never counted as accepted and the outstanding count says it is provisional.

**State**

- Lifecycle statuses visible: `EVIDENCE_INCOMPLETE`; per-item evidence state; original and effective deadlines
- Permission model: Verification or claim staff within assigned scope. Access requires a legitimate operational, clinical, legal, financial, support or audit purpose, not merely holding an Admin account. Every sensitive read is audited.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Record a pause or extension | primary | the actor holds the assigned scope and a reason is given | **Appends a reasoned event. Silently replacing the original is denied and no control offers it** |
| Open an evidence item | secondary | fresh purpose-bound authorization is granted | UNAVAILABLE without it; every view is audited |
| Back to the claim review | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-014` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLAIMS-001` `TXT-STATE-PLATFORM-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-CLAIMS-001` `TXT-STATE-PLATFORM-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-CLAIMS-002` | a claim submission or response whose required evidence is incomplete or invalid | `TXT-ERR-CLAIMS-002` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |
| `ERR-PLATFORM-005` | an evidence item that failed validation or was rejected authoritatively | `TXT-ERR-PLATFORM-005` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-034` `A11Y-POLICY-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the status and identity region.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is claim context, deadline pair with its history, requirement list, actions. The deadline pair announces as original and effective.
- Announcements: A deadline event announces politely and the pair recomputes.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- The deadline pair sits above the requirement list at every content width; at `.narrow` each requirement stacks with its state and reason.

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

Not applicable here: `empty-filtered`. The requirement set is governed rather than filtered.

**Acceptance criteria**

1. **Both the original and the effective deadline are visible, with the appended events that moved it.**
2. Missing, rejected, expired and accepted are four individually distinguishable states with reasons.
3. **Silently replacing a deadline is denied and no control offers it.**
4. Requirements resolve from the versioned policy snapshot.

**Traceability.** `SCR-CLAIMS-011` · `WF-CLAIMS-011` · flows `FLOW-CLAIMS-005` · widgets `WGT-CLAIMS-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-006` `WGT-PLATFORM-008` `WGT-PLATFORM-014` · components `CMP-CLINICAL-002` `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-006` `CMP-PLATFORM-008` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-012` · patterns `IX-BOOKING-001` `IX-CLINICAL-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-006` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-009` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` `IX-POLICY-002` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-014` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLAIMS-001` `TXT-STATE-PLATFORM-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-034` `A11Y-POLICY-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-CLAIMS-002` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` `ERR-PLATFORM-005` · requirements `FR-CLAIMS-003` · contract `SDC-CLAIMS-001`

---

### SCR-CLAIMS-012 — Sensitive decision

**Wireframe:** `WF-CLAIMS-012` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** form · **Density:** `operational` · **Classification:** New
**Actors:** Claim or dispute reviewer with the required role, organization and subject-matter scope; Licensed clinical reviewer for medically sensitive claims
**Flows:** `FLOW-CLAIMS-006`
**Requirements:** `FR-CLAIMS-004`
**Data / action contract:** `SDC-CLAIMS-001`

**Purpose.** Let an authorized human reviewer decide a claim. Success is an immutable decision with its findings, reasons, evidence references, policy, actor, time and any required external action. **Reserved for humans by requirement: system automation cannot close a sensitive claim.**

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | The claim, the governing snapshot and the reviewer's competence. |
| Required input | The findings, the reasons and the evidence references. |
| Validation and consequence | **That the decision is immutable and only an appeal follows it**, and that an approved monetary remedy records an obligation for external execution and moves no money. |
| Action | Record the decision. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) `CMP-PLATFORM-013` (`decided-by-person`) `CMP-PLATFORM-014` (`irreversible`) |
| Patterns | `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-CLAIMS-001` | claim/refund type, case linkage, governing snapshots, evidence states, deadlines/extensions, party responses, decision/appeal history, external-execution state where applicable. | clinic submits allowed evidence/response/appeal; reviewer requests evidence, records reasoned decision, handles eligible appeal according to separation of duties. |

- `SDC-CLAIMS-001` records the decision, retaining the findings, reasons, evidence references, policy, actor, time and required external actions.
- **No command on this surface authorizes, captures, holds, transfers, settles or refunds money, and no wording may imply otherwise.** An approved remedy records an obligation for external execution and nothing more.
- Missing-data behaviour: where the governing policy snapshot could not be read, no decision is offered.

**State**

- Lifecycle statuses visible: `UNDER_REVIEW` before, `DECIDED` after
- Permission model: Claim or dispute reviewer with the required role, organization and subject-matter scope; licensed clinical reviewer for medically sensitive claims. **Self-approval is denied under separation of duties.**

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Record the decision | primary | the actor holds the required role, organization and subject-matter scope, and clinical competence where the claim is medically sensitive | **HIDDEN without the required competence. Prohibited self-approval is denied under separation of duties** |
| Back to the claim review | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLAIMS-001` `TXT-STATE-CLAIMS-002`
- Lifecycle labels for every status above are owned by `TXT-STATE-CLAIMS-001` `TXT-STATE-CLAIMS-002` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.
- **No command on this surface authorizes, captures, holds, transfers, settles or refunds money, and no wording may imply otherwise.** An approved remedy records an obligation for external execution and nothing more.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-CLAIMS-001` | a claim, refund request or appeal that is ineligible or outside its policy window | `TXT-ERR-CLAIMS-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is claim and governing snapshot, findings and reasons, the immutability and external-execution statements, action. Focus enters the confirmation on the effect statement, never on the record control.
- Announcements: The recorded decision announces and focus moves to the resulting state.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- The immutability and external-execution statements are never collapsed behind a disclosure.

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

Not applicable here: `empty-no-data` `empty-filtered`. A single-decision surface has no list and no filter.

**Acceptance criteria**

1. **System automation cannot close a sensitive claim; the decision is reserved for a human by requirement.**
2. A medically sensitive decision without the required clinical competence is denied.
3. Prohibited self-approval is denied under separation of duties.
4. **The decision is immutable, only an appeal follows it, and the reviewer knows that before committing.**
5. An approved monetary remedy records an obligation for external execution and moves no money.

**Traceability.** `SCR-CLAIMS-012` · `WF-CLAIMS-012` · flows `FLOW-CLAIMS-006` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` `CMP-PLATFORM-013` `CMP-PLATFORM-014` · patterns `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLAIMS-001` `TXT-STATE-CLAIMS-002` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-AUDIT-001` `ERR-CLAIMS-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-CLAIMS-004` · contract `SDC-CLAIMS-001`

---

### SCR-CLAIMS-013 — Appeal decision

**Wireframe:** `WF-CLAIMS-013` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** form · **Density:** `operational` · **Classification:** New
**Actors:** Independent claim or dispute reviewer satisfying separation of duties
**Flows:** `FLOW-CLAIMS-008` `FLOW-CLAIMS-009`
**Requirements:** `FR-CLAIMS-005`, `FR-CLAIMS-004`
**Data / action contract:** `SDC-CLAIMS-001`

**Purpose.** Let an independent reviewer decide a claim appeal under the policy snapshot that governed the original decision. Success is an appended appeal decision. **The original decision is preserved and never rewritten.**

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | The appeal, the original decision and the independence requirement. |
| Required input | The governing policy snapshot and the historical window. |
| Validation and consequence | The appeal decision. |
| Action | Record the appeal decision. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) `CMP-PLATFORM-013` (`decided-by-person`) `CMP-PLATFORM-014` (`irreversible`) |
| Patterns | `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-CLAIMS-001` | claim/refund type, case linkage, governing snapshots, evidence states, deadlines/extensions, party responses, decision/appeal history, external-execution state where applicable. | clinic submits allowed evidence/response/appeal; reviewer requests evidence, records reasoned decision, handles eligible appeal according to separation of duties. |

- `SDC-CLAIMS-001` appends the appeal decision, using the policy snapshot governing the original decision.
- Records here are append-only. A resolution, correction or reopening is a later event; no earlier record is edited or deleted.
- Missing-data behaviour: where the governing snapshot could not be read, no appeal decision is offered.

**State**

- Lifecycle statuses visible: appeal `SUBMITTED`, `UNDER_REVIEW`, `DECIDED`
- Permission model: Independent claim or dispute reviewer satisfying separation of duties.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Record the appeal decision | primary | the actor satisfies separation of duties | **HIDDEN for the original decision-maker** |
| Back to the claims queue | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLAIMS-001` `TXT-STATE-CLAIMS-002` `TXT-STATE-REVIEWS-002`
- Lifecycle labels for every status above are owned by `TXT-STATE-CLAIMS-001` `TXT-STATE-CLAIMS-002` `TXT-STATE-REVIEWS-002` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-CLAIMS-001` | a claim, refund request or appeal that is ineligible or outside its policy window | `TXT-ERR-CLAIMS-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is appeal, original decision, governing snapshot, action. The independence requirement is announced with the action.
- Announcements: The recorded decision announces and focus moves to the resulting state.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- The original decision stays readable above the decision form at every content width.

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

Not applicable here: `empty-no-data` `empty-filtered`. A single-decision surface has no list and no filter.

**Acceptance criteria**

1. **Assignment satisfies separation of duties: the original decision-maker cannot decide the appeal.**
2. The policy snapshot governing the original decision is used, not current configuration.
3. **The original decision is preserved and never rewritten**; the appeal decision is appended.

**Traceability.** `SCR-CLAIMS-013` · `WF-CLAIMS-013` · flows `FLOW-CLAIMS-008` `FLOW-CLAIMS-009` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` `CMP-PLATFORM-013` `CMP-PLATFORM-014` · patterns `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLAIMS-001` `TXT-STATE-CLAIMS-002` `TXT-STATE-REVIEWS-002` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-AUDIT-001` `ERR-CLAIMS-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-CLAIMS-005`, `FR-CLAIMS-004` · contract `SDC-CLAIMS-001`

---

### SCR-OPS-002 — Work queue

**Wireframe:** `WF-OPS-002` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** list-and-detail · **Density:** `operational` · **Classification:** New
**Actors:** Operations, verification, finance, claim, integrity and policy staff within active grants
**Flows:** `FLOW-BOOKING-011` `FLOW-ELIG-013` `FLOW-FINANCE-005` `FLOW-OPS-001` `FLOW-PLATFORM-004`
**Requirements:** `FR-OPS-001`
**Data / action contract:** `SDC-OPS-001`

**Purpose.** Be the home screen for six staff roles and the depth-reduction mechanism for the panel's highest-frequency work. Success is a staff actor working the right item. **State, escalation and deadline breach are filterable separately**, because escalated and overdue are independent flags.

**Hierarchy** — Phase 2 priority order, not reopened: context/filter > list > selected detail > state-aware action.

| Region | Contents |
|---|---|
| Context and filter | The actor's role, organization, branch, subject-matter and workflow scope, and the persisted filter. |
| List | One row per work item with its type, linked resource, state, priority, due time, responsibility scope and blocking reason. |
| Selected detail | Escalated and overdue as two independent flags. |
| State-aware action | Open the work item. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-OPS-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` |
| Components | `CMP-OPS-001` (`queue`) `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-006` (`table`) `CMP-PLATFORM-007` (`queue`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-OPS-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-OPS-001` | work item ID/type, linked resource/case, lifecycle state, escalated flag, overdue flag, priority, due time, responsibility scope, blocking reason, assignment, safe summary. | claim/assign where allowed; start; move to waiting with a named blocking reason; resume; complete with outcome; escalate; reopen where policy permits. |

- `SDC-OPS-001` projects the scoped work items with the five-state vocabulary and the two independent flags.
- Missing-data behaviour: an item whose due time or blocking reason did not load says so and is never rendered as having no deadline.

**State**

- Lifecycle statuses visible: work item type, linked resource, priority, due time, responsibility scope, blocking reason
- Permission model: Operations, verification, finance, claim, integrity and policy staff within active grants. **Work assignment never grants source-data access.** Scoped to the actor's active grants, assigned work and subject-matter competence, enforced server-side. **A coarse role is not the authorization model** and no administrator bypass exists. A scope revoked mid-shift removes the affected actions structurally and states the change; it never renders as a quiet empty queue.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Open the work item | primary | the item is within the actor's scope | HIDDEN where it is not |
| Claim an item | secondary | the item is open and the actor may take it | UNAVAILABLE against a stale read; the queue re-reads first |
| Filter by state, escalation or deadline breach | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-OPS-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-OPS-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

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
- Screen-reader hierarchy: Landmark order is scope and filter, work list. State, escalation and overdue announce as three separate facts.
- Announcements: An item reassigned away from the actor announces politely without forcing navigation.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- A table at `.wide` with a bounded internal horizontal scroll permitted; degrading to the reading-list shape at the largest text sizes. The page never scrolls horizontally.

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

1. **State, escalation and deadline breach are filterable separately.**
2. A row can be in progress, escalated and overdue simultaneously and stay legible.
3. **Work assignment never grants source-data access.**
4. A permission failure never renders as a quiet day.

**Traceability.** `SCR-OPS-002` · `WF-OPS-002` · flows `FLOW-BOOKING-011` `FLOW-ELIG-013` `FLOW-FINANCE-005` `FLOW-OPS-001` `FLOW-PLATFORM-004` · widgets `WGT-OPS-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` · components `CMP-OPS-001` `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-006` `CMP-PLATFORM-007` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-OPS-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-OPS-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-OPS-001` · contract `SDC-OPS-001`

---

### SCR-OPS-003 — Work item detail

**Wireframe:** `WF-OPS-003` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** detail · **Density:** `operational` · **Classification:** New
**Actors:** Authorized operations or queue actor; supervisors for reassignment and escalation
**Flows:** `FLOW-AUDIT-002` `FLOW-CLAIMS-005` `FLOW-CLAIMS-008` `FLOW-ELIG-013` `FLOW-OPS-001`
**Requirements:** `FR-OPS-001`, `FR-AUDIT-001`
**Data / action contract:** `SDC-OPS-001`

**Purpose.** Show one work item with its assignment, priority, due time, blocking reason and escalation history. Success is an actor who knows what the item needs. **Completing a work item does not change the source domain record**, and this screen must not imply otherwise.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The work item and the actor's scope. |
| Primary facts | Assignment, priority, due time and blocking reason. |
| Related history | The escalation history as an append-only timeline. |
| Action | Open the source resource, reassign, escalate, complete or reopen. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-OPS-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-006` |
| Components | `CMP-OPS-001` (`queue`) `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`reviewer`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-008` (`record`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-OPS-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-016` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-OPS-001` | work item ID/type, linked resource/case, lifecycle state, escalated flag, overdue flag, priority, due time, responsibility scope, blocking reason, assignment, safe summary. | claim/assign where allowed; start; move to waiting with a named blocking reason; resume; complete with outcome; escalate; reopen where policy permits. |

- `SDC-OPS-001` projects the item and its escalation history. **Assignment, escalation, completion, reopening and deadline breach are audited transitions.**
- Missing-data behaviour: an item whose blocking reason could not be read says so rather than appearing unblocked.

**State**

- Lifecycle statuses visible: assignment, priority, due time, blocking reason, escalation history
- Permission model: Authorized operations or queue actor; supervisors for reassignment and escalation. **Source-resource authorization is enforced independently of the assignment.**

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Open the source resource | primary | the actor holds authorization over it | **HIDDEN where the actor is assigned the item but not authorized over its source** |
| Reassign | secondary | the actor is a supervisor for this queue | HIDDEN otherwise |
| Escalate | secondary | the actor holds the scope | HIDDEN otherwise |
| Complete the item | primary | the actor holds the assignment | **Completing changes no source domain record**; UNAVAILABLE against a stale read |

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
- Screen-reader hierarchy: Landmark order is item context, assignment and due time, escalation history, actions. Assignment announces as ownership without a decision.
- Announcements: A reassignment announces politely and the action set recomputes. An assignment conflict states the conflict rather than showing an optimistic owner.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- The escalation history sits in a supporting rail at `.wide` and moves below at `.narrow`.

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

Not applicable here: `empty-filtered`. A single work item has no list-level filter of its own.

**Acceptance criteria**

1. **Completing a work item changes no source domain record, and the screen does not imply otherwise.**
2. Source-resource authorization is enforced independently of the assignment.
3. Assignment, escalation, completion, reopening and deadline breach are audited transitions.
4. An assignment conflict states the conflict rather than showing an optimistic owner.

**Traceability.** `SCR-OPS-003` · `WF-OPS-003` · flows `FLOW-AUDIT-002` `FLOW-CLAIMS-005` `FLOW-CLAIMS-008` `FLOW-ELIG-013` `FLOW-OPS-001` · widgets `WGT-OPS-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-006` · components `CMP-OPS-001` `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-008` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-OPS-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-016` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-OPS-001`, `FR-AUDIT-001` · contract `SDC-OPS-001`

---

### SCR-OPS-004 — Operational reports

**Wireframe:** `WF-OPS-004` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** detail · **Density:** `operational` · **Classification:** New
**Actors:** Product and operations owner; Operations staff within scope
**Flows:** `FLOW-OPS-003` `FLOW-PLATFORM-004`
**Requirements:** `FR-OPS-002`
**Data / action contract:** `SDC-OPS-002`

**Purpose.** Report on queues, deadlines, exceptions, eligibility, evidence completeness, bookings, treatment progress and external financial cases. Success is a figure a reader can act on. **Every metric declares its population, time window, status rules and last-refreshed time.**

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The reporting scope, the window and the filter. |
| Primary facts | One block per metric with its figure, its comparison basis and its table equivalent. |
| Related history | **Provisional and disputed data, visibly distinct from confirmed facts.** |
| Action | Drill down into the rows behind a figure. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-OPS-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`reviewer`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-006` (`embedded`) `CMP-PLATFORM-007` (`management`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-009` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-OPS-002` | scoped metrics with population definition, time window, state rules, confirmed-vs-provisional distinction, last-refreshed time, permitted drill-down references. | filter/drill down/export only when corresponding permission/audit requirements pass. |

- `SDC-OPS-002` projects the operational metrics.
- **Provisional and disputed data must be visibly distinct from confirmed facts; this is a requirement, not a presentation nicety.**
- Missing-data behaviour: a figure whose contributing source failed is **not rendered** and the missing source is named. A metric computed over fewer sources is a wrong metric.

**State**

- Lifecycle statuses visible: metric freshness; provisional versus confirmed distinction
- Permission model: Product and operations owner; operations staff within scope. Scoped to the actor's active grants, assigned work and subject-matter competence, enforced server-side. **A coarse role is not the authorization model** and no administrator bypass exists. A scope revoked mid-shift removes the affected actions structurally and states the change; it never renders as a quiet empty queue.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Drill down | primary | the actor holds the source-data scope | **HIDDEN where the actor does not hold it; a report is not a way around row-level scope** |
| Change the window | secondary | always | never unavailable |

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
- Screen-reader hierarchy: Landmark order is scope and window, metric blocks, provisional statement. Each figure announces with its population, window, comparison basis and freshness; **the table equivalent is in the accessibility tree at all times**.
- Announcements: A refresh completing announces the new last-refreshed time once.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- Metric blocks reflow across the content grid; at `.narrow` they stack one per row and a series renders as its table.

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

1. **Every metric declares its population, time window, status rules and last-refreshed time.**
2. **Every chart has a table equivalent present without a control being used.**
3. Provisional and disputed values are distinguishable from confirmed values without colour.
4. A figure whose source set is incomplete does not render, and the missing source is named.
5. No metric renders without a comparison basis.

**Traceability.** `SCR-OPS-004` · `WF-OPS-004` · flows `FLOW-OPS-003` `FLOW-PLATFORM-004` · widgets `WGT-OPS-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` · components `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-006` `CMP-PLATFORM-007` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-009` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-OPS-002` · contract `SDC-OPS-002`

---

### SCR-OPS-005 — Drill-down and export

**Wireframe:** `WF-OPS-005` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** detail · **Density:** `operational` · **Classification:** New
**Actors:** Authorized reporting actor within source-data scope
**Flows:** `FLOW-OPS-003`
**Requirements:** `FR-OPS-002`, `FR-AUDIT-001`
**Data / action contract:** `SDC-OPS-002`

**Purpose.** Let an authorized actor reach the rows behind a figure and export them. Success is numbers that reconcile. **Drill-down and export carry the same or stricter authorization as the source data**: a report is not a way around row-level scope.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The preserved filter and time window from the originating figure. |
| Primary facts | The rows behind the figure. |
| Related history | That the export is attributable and audited. |
| Action | Export, or open the drilled record. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-OPS-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` `WGT-PLATFORM-007` |
| Components | `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-006` (`embedded`) `CMP-PLATFORM-007` (`management`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-014` (`irreversible`) |
| Patterns | `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-009` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-OPS-002` | scoped metrics with population definition, time window, state rules, confirmed-vs-provisional distinction, last-refreshed time, permitted drill-down references. | filter/drill down/export only when corresponding permission/audit requirements pass. |

- `SDC-OPS-002` projects the drilled rows. **Drill-down preserves the filter and the time window so the numbers stay reconcilable.**
- Missing-data behaviour: a partial row set is never exported as complete; the export states the gap or is withheld.

**State**

- Lifecycle statuses visible: none
- Permission model: Authorized reporting actor within source-data scope. Access requires a legitimate operational, clinical, legal, financial, support or audit purpose, not merely holding an Admin account. Every sensitive read is audited.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Open the drilled record | primary | the actor holds the source-data scope | HIDDEN where they do not |
| Export | primary | the actor holds the source-data scope | **HIDDEN otherwise. Sensitive exports are audited and the export itself is attributable** |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011`
- No status this screen shows belongs to a governed lifecycle machine, so it binds no `TXT-STATE-*` rule. What the state section lists is descriptive condition, not a status chip drawn from a state machine.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the status and identity region.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is preserved filter and window, row list, export statement. The preserved window is announced so the reader knows what the rows reconcile to.
- Announcements: An export starting announces once; its attribution is stated.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- A table at `.wide` with a bounded internal horizontal scroll permitted; the page never scrolls horizontally.

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

1. **Drill-down and export carry the same or stricter authorization as the source data.**
2. The filter and time window are preserved so the numbers reconcile.
3. Sensitive exports are audited and the export is attributable.
4. A partial row set is never exported as complete.

**Traceability.** `SCR-OPS-005` · `WF-OPS-005` · flows `FLOW-OPS-003` · widgets `WGT-OPS-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` `WGT-PLATFORM-007` · components `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-006` `CMP-PLATFORM-007` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-014` · patterns `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-009` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-OPS-002`, `FR-AUDIT-001` · contract `SDC-OPS-002`

---

### SCR-OPS-006 — Launch readiness overview

**Wireframe:** `WF-OPS-006` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** dashboard · **Density:** `operational` · **Classification:** New
**Actors:** Product and operations owner; accountable owners for their own gate; authorized staff read-only
**Flows:** `FLOW-OPS-004`
**Requirements:** `FR-OPS-003`
**Data / action contract:** `SDC-CATALOG-001`

**Purpose.** Show launch readiness across scopes: each required gate with its accountable role, decision, evidence, expiry and current effective state. Success is a reader who knows what is blocked and why. **`expired` reads as a lapse needing re-approval rather than a rejection.**

**Hierarchy** — Phase 2 priority order, not reopened: context > urgent attention > primary work > supporting status.

| Region | Contents |
|---|---|
| Context | The readiness scope. |
| Urgent attention | Per-gate effective state across scopes, with credential expiry and blocked scopes. |
| Primary work | What each missing, expired, revoked or rejected approval blocks. |
| Supporting status | Open the launch gates, or the reviewer credentials. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-OPS-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`reviewer`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-006` (`embedded`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-013` (`decided-by-person`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-009` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` |
| Screen-only | Gate state renders through the lifecycle record list and the operational metric block rather than through the governed version header, because this is a cross-scope roll-up rather than one version's gate set, and Phase 3 binds no version header here. |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-CATALOG-001` | service groups, patient-facing service families, definition versions, audience/publication state, required launch gates, review status, effective dates, and per-family counts of mapped procedure items and their review state. | create a family; edit permitted draft content, labels, description, order and visibility; retire or supersede a family prospectively; submit/review/schedule/retire according to policy; invoke governed publication action after gates pass. |

- `SDC-CATALOG-001` projects the readiness roll-up.
- **A missing, expired, revoked or rejected mandatory approval blocks public discoverability and new bookings for that scope.**
- **Provisional evaluation data is never equivalent to production medical approval under `Q-CATALOG-001`.**
- Missing-data behaviour: a gate whose state could not be read blocks readiness and is named. Readiness fails closed.

**State**

- Lifecycle statuses visible: per-gate effective state; credential expiry; blocked scopes
- Permission model: Product and operations owner; accountable owners for their own gate; authorized staff read-only.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Open the launch gates for a scope | primary | always | never unavailable |
| Open reviewer credentials | secondary | always | never unavailable |

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
- Screen-reader hierarchy: Landmark order is scope, per-gate state, blocking statement, routes. Each gate announces its type, state, owner and expiry so `expired` and `rejected` are distinguishable without colour.
- Announcements: A gate expiring announces politely and the blocked-scope set recomputes.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- Gate rows reflow across the content grid; at `.narrow` each scope stacks with its gates and the blocking statement stays above them.

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

Not applicable here: `empty-filtered`. A readiness roll-up is scoped rather than filtered.

**Acceptance criteria**

1. **`expired` reads as a lapse needing re-approval rather than a rejection.**
2. Each required gate shows its accountable role, decision, evidence, expiry and effective state.
3. Readiness fails closed on any gate that is missing, expired, revoked, rejected or unknown.
4. **Provisional evaluation data is never presented as production medical approval.**
5. The surface is discoverable rather than memorised, because this work is rare and blocking.

**Traceability.** `SCR-OPS-006` · `WF-OPS-006` · flows `FLOW-OPS-004` · widgets `WGT-OPS-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` · components `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-006` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-013` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-009` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-OPS-003` · contract `SDC-CATALOG-001`

---
