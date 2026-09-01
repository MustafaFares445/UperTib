# Screen Specifications — Admin panel (4 of 4)

**Phase:** UX 4 — Widget and Screen Specifications
**Platform:** Admin panel · Profile A · Filament panel
**Schema:** `PHASE_04_IMPLEMENTATION_PLAN.md` section 6. **Widgets:** `WIDGET_SPECS.md`. **Map:** `SCREEN_SPEC_MAP.md`.

Every block carries the same thirteen sections in the same order. A section that does not apply says so and why.

---
### SCR-POLICY-001 — Policy versions

**Wireframe:** `WF-POLICY-001` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** list-and-detail · **Density:** `operational` · **Classification:** New
**Actors:** Policy owner and reviewers within owned domain
**Flows:** `FLOW-CATALOG-007` `FLOW-POLICY-001` `FLOW-POLICY-002`
**Requirements:** `FR-POLICY-001`
**Data / action contract:** `SDC-POLICY-001`

**Purpose.** List the governed policy versions across classification, eligibility, deadline, evidence, financial and launch policies. Success is an owner who can see what is effective when. It exists because **an effective-period overlap must be surfaced, not silently ordered**.

**Hierarchy** — Phase 2 priority order, not reopened: context/filter > list > selected detail > state-aware action.

| Region | Contents |
|---|---|
| Context and filter | The policy domain scope and the filter. |
| List | One row per version with its state and effective period. |
| Selected detail | **Overlaps, surfaced explicitly.** |
| State-aware action | Open the editor, the review and scheduling surface, or the historical reproduction. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` `WGT-PLATFORM-014` `WGT-POLICY-001` |
| Components | `CMP-CLINICAL-002` (`version`) `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-006` (`table`) `CMP-PLATFORM-007` (`queue`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-013` (`decided-by-person`) `CMP-POLICY-001` (`policy`) |
| Patterns | `IX-CLINICAL-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` `IX-POLICY-001` `IX-POLICY-002` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-POLICY-001` | policy key/scope/version, draft content, review state, effective dates, approvals, conflicts/overlaps, historical references. | edit draft; submit for review; approve/reject; schedule; retire/supersede; reproduce historical result through authorized action. |

- `SDC-POLICY-001` projects the versions with their effective periods.
- **At most one version is effective per key, scope and instant unless explicit precedence resolves an overlap.**
- Missing-data behaviour: an overlap that could not be resolved is surfaced as an overlap rather than silently ordered.

**State**

- Lifecycle statuses visible: `draft`, `reviewed`, `scheduled`, `active`, `retired`, `superseded`; effective periods
- Permission model: Policy owner and reviewers within owned domain. Scoped to the actor's active grants, assigned work and subject-matter competence, enforced server-side. **A coarse role is not the authorization model** and no administrator bypass exists. A scope revoked mid-shift removes the affected actions structurally and states the change; it never renders as a quiet empty queue.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Open the version editor | primary | the version is a draft and the actor is the policy owner | HIDDEN on any non-draft version |
| Open historical reproduction | secondary | the actor holds the audit scope | HIDDEN without it |
| Filter by domain or state | secondary | always | never unavailable |

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
- Screen-reader hierarchy: Landmark order is scope and filter, version list, overlap statement. Each version announces its key, state and effective period.
- Announcements: An activation announces politely and any resulting overlap is announced with it.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- A table at `.wide` degrading to the reading-list shape at `.narrow`; effective periods never truncate.

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

1. **Effective-period overlaps are surfaced rather than silently ordered.**
2. At most one version is effective per key, scope and instant unless explicit precedence resolves it.
3. Only a draft exposes an editor.
4. Filtered-empty and genuinely-empty read differently.

**Traceability.** `SCR-POLICY-001` · `WF-POLICY-001` · flows `FLOW-CATALOG-007` `FLOW-POLICY-001` `FLOW-POLICY-002` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` `WGT-PLATFORM-014` `WGT-POLICY-001` · components `CMP-CLINICAL-002` `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-006` `CMP-PLATFORM-007` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-013` `CMP-POLICY-001` · patterns `IX-CLINICAL-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` `IX-POLICY-001` `IX-POLICY-002` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-014` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CATALOG-001` `TXT-STATE-POLICY-001` `TXT-STATE-REVIEWS-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-POLICY-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-POLICY-001` · contract `SDC-POLICY-001`

---

### SCR-POLICY-002 — Version editor

**Wireframe:** `WF-POLICY-002` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** form · **Density:** `operational` · **Classification:** New
**Actors:** Policy owner within owned domain
**Flows:** `FLOW-ELIG-016` `FLOW-POLICY-001`
**Requirements:** `FR-POLICY-001`
**Data / action contract:** `SDC-POLICY-001`

**Purpose.** Let the policy owner author a draft policy version. Success is a draft whose prospective effect the author understood. It exists because **a policy change silently alters future outcomes**, so the editor makes the prospective-only effect and the scope of the change explicit before submission.

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | The policy key, scope and draft version bar. |
| Required input | The versioned inputs. |
| Validation and consequence | **The prospective-only effect and the scope of what changes**, stated before submission. |
| Action | Save the draft, or send it to review. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` `WGT-PLATFORM-011` `WGT-POLICY-001` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) `CMP-PLATFORM-013` (`decided-by-person`) `CMP-PLATFORM-014` (`irreversible`) `CMP-POLICY-001` (`policy`) |
| Patterns | `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-005` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` `IX-POLICY-001` `IX-POLICY-002` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-POLICY-001` | policy key/scope/version, draft content, review state, effective dates, approvals, conflicts/overlaps, historical references. | edit draft; submit for review; approve/reject; schedule; retire/supersede; reproduce historical result through authorized action. |

- `SDC-POLICY-001` accepts the draft. **Activated and historical versions are immutable.**
- Missing-data behaviour: where the prior effective version could not be read, the scope-of-change statement cannot be computed and submission is withheld.

**State**

- Lifecycle statuses visible: `draft`
- Permission model: Policy owner within owned domain. No control on this screen overrides a computed decision, forces a state, or edits a historical record. Where a correction is needed it is a new governed fact or a new appended event, never an in-place change.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Save the draft | primary | the version is a draft | **HIDDEN on any activated or historical version, which is immutable** |
| Send to review and scheduling | primary | the draft is complete | UNAVAILABLE with the outstanding items named |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-014` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-POLICY-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-POLICY-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-028` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-POLICY-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is version bar, inputs, prospective-effect statement, actions. The prospective-effect statement is read before the submit control is reached.
- Announcements: A save announces once. Completeness announces when it changes state.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- Inputs stack at `.narrow`; the prospective-effect statement is never collapsed behind a disclosure.

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

1. Only a draft is editable; activated and historical versions are immutable.
2. **The prospective-only effect and the scope of what changes are explicit before submission.**
3. No control here changes an outcome for any existing record.

**Traceability.** `SCR-POLICY-002` · `WF-POLICY-002` · flows `FLOW-ELIG-016` `FLOW-POLICY-001` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` `WGT-PLATFORM-011` `WGT-POLICY-001` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` `CMP-PLATFORM-013` `CMP-PLATFORM-014` `CMP-POLICY-001` · patterns `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-005` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` `IX-POLICY-001` `IX-POLICY-002` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-014` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-POLICY-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-028` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-POLICY-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-AUDIT-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-POLICY-001` · contract `SDC-POLICY-001`

---

### SCR-POLICY-003 — Review and scheduling

**Wireframe:** `WF-POLICY-003` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** detail · **Density:** `operational` · **Classification:** New
**Actors:** Authorized policy reviewers for that domain
**Flows:** `FLOW-POLICY-001`
**Requirements:** `FR-POLICY-001`
**Data / action contract:** `SDC-POLICY-001`

**Purpose.** Show the outstanding approvals for a policy version and let authorized reviewers schedule it. Success is a version activated through its required review. **Direct activation bypassing required review does not exist.**

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The version and its governed version bar. |
| Primary facts | The outstanding approvals, per domain requirement. |
| Related history | The effective dates and any overlap conflict. |
| Action | Approve, schedule, or retire. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-006` `WGT-PLATFORM-007` `WGT-PLATFORM-014` `WGT-POLICY-001` |
| Components | `CMP-CLINICAL-002` (`version`) `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`reviewer`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-006` (`embedded`) `CMP-PLATFORM-008` (`record`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-013` (`decided-by-person`) `CMP-PLATFORM-014` (`irreversible`) `CMP-POLICY-001` (`policy`) |
| Patterns | `IX-AUDIT-001` `IX-CLINICAL-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` `IX-POLICY-001` `IX-POLICY-002` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-POLICY-001` | policy key/scope/version, draft content, review state, effective dates, approvals, conflicts/overlaps, historical references. | edit draft; submit for review; approve/reject; schedule; retire/supersede; reproduce historical result through authorized action. |

- `SDC-POLICY-001` records the approvals and the schedule.
- **Activation and retirement never mutate historical cases or decisions.**
- Missing-data behaviour: an approval whose state could not be read blocks scheduling and is named.

**State**

- Lifecycle statuses visible: `reviewed`, `scheduled`, `active`, `retired`, `superseded`; effective dates; overlap conflicts
- Permission model: Authorized policy reviewers for that domain. No control on this screen overrides a computed decision, forces a state, or edits a historical record. Where a correction is needed it is a new governed fact or a new appended event, never an in-place change.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Record an approval | primary | the actor is an authorized reviewer for that domain requirement | HIDDEN for every other actor |
| Schedule activation | primary | every required approval is recorded and no unresolved overlap exists | **UNAVAILABLE naming the outstanding approval or the unresolved overlap** |
| Retire a version | destructive | the actor is the policy owner | HIDDEN otherwise. **Retirement never mutates historical cases or decisions** |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-014` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-POLICY-001` `TXT-STATE-REVIEWS-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-POLICY-001` `TXT-STATE-REVIEWS-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-POLICY-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the status and identity region.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is version bar, outstanding approvals, effective dates and overlaps, actions. Each outstanding approval announces its domain requirement and its owner.
- Announcements: An approval recorded elsewhere announces politely and the schedule readiness recomputes.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- Approvals are a list at every content width; effective dates never truncate.

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

Not applicable here: `empty-filtered`. A single-version surface has no list-level filter.

**Acceptance criteria**

1. **Direct activation bypassing required review does not exist.**
2. The outstanding approvals are visible per domain requirement.
3. Activation and retirement never mutate historical cases or decisions.
4. An unresolved overlap blocks scheduling and is named.

**Traceability.** `SCR-POLICY-003` · `WF-POLICY-003` · flows `FLOW-POLICY-001` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-006` `WGT-PLATFORM-007` `WGT-PLATFORM-014` `WGT-POLICY-001` · components `CMP-CLINICAL-002` `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-006` `CMP-PLATFORM-008` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-013` `CMP-PLATFORM-014` `CMP-POLICY-001` · patterns `IX-AUDIT-001` `IX-CLINICAL-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` `IX-POLICY-001` `IX-POLICY-002` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-014` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-POLICY-001` `TXT-STATE-REVIEWS-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-POLICY-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-POLICY-001` · contract `SDC-POLICY-001`

---

### SCR-POLICY-004 — Historical reproduction

**Wireframe:** `WF-POLICY-004` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** detail · **Density:** `operational` · **Classification:** New
**Actors:** Authorized auditor; Policy owner within scope
**Flows:** `FLOW-AUDIT-001` `FLOW-AUDIT-002` `FLOW-ELIG-010` `FLOW-POLICY-002`
**Requirements:** `FR-POLICY-002`, `FR-AUDIT-002`
**Data / action contract:** `SDC-POLICY-001`, `SDC-AUDIT-001`

**Purpose.** Reproduce a historical decision from its snapshots and compare the result with what was recorded. Success is a verified match, or a raised integrity exception. **A mismatch raises an auditable integrity exception rather than being silently corrected.**

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The decision being reproduced and the actor's audit scope. |
| Primary facts | The historical snapshots the reproduction uses. |
| Related history | The reproduced outcome against the recorded one, with match or mismatch as the verdict. |
| Action | Raise the integrity exception on a mismatch. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-006` `WGT-PLATFORM-014` `WGT-POLICY-001` |
| Components | `CMP-CLINICAL-002` (`version`) `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`reviewer`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-006` (`embedded`) `CMP-PLATFORM-008` (`record`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-013` (`decided-by-person`) `CMP-POLICY-001` (`policy`) |
| Patterns | `IX-CLINICAL-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` `IX-POLICY-001` `IX-POLICY-002` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-POLICY-001` | policy key/scope/version, draft content, review state, effective dates, approvals, conflicts/overlaps, historical references. | edit draft; submit for review; approve/reject; schedule; retire/supersede; reproduce historical result through authorized action. |
| `SDC-AUDIT-001` | attributable audit metadata, resource/action/time/outcome/correlation, policy/snapshot/evidence references allowed by purpose, historical reproduction result/integrity state. | scoped search; inspect permitted event detail; request/export permitted audit output; invoke historical reproduction. |

- `SDC-POLICY-001` and `SDC-AUDIT-001` supply the historical snapshots and the recorded outcome. **Reproduction uses historical snapshots rather than current configuration.**
- **Reproduction never rewrites the original decision.**
- Missing-data behaviour: where either side could not be read, **no verdict is rendered** and the missing side is named. A one-sided reproduction is not a verdict.

**State**

- Lifecycle statuses visible: reproduction result; integrity match or mismatch
- Permission model: Authorized auditor; policy owner within scope. **Protected payload remains purpose and scope restricted.** No control on this screen overrides a computed decision, forces a state, or edits a historical record. Where a correction is needed it is a new governed fact or a new appended event, never an in-place change.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Run the reproduction | primary | the actor holds the audit or policy scope | HIDDEN without it |
| Raise the integrity exception | primary | the verdict is a mismatch | **absent on a match. A mismatch is never silently corrected** |

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
- Focus entry: the status and identity region.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is decision context, snapshots used, the comparison and its verdict, action. The verdict announces as match or mismatch, never as a colour.
- Announcements: The verdict announces once when the reproduction completes.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- The two sides stack at `.narrow` with the recorded outcome at the logical start.

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

Not applicable here: `empty-filtered`. A reproduction surface has no list-level filter.

**Acceptance criteria**

1. Reproduction uses historical snapshots rather than current configuration.
2. **A mismatch raises an auditable integrity exception rather than being silently corrected.**
3. Reproduction never rewrites the original decision.
4. A partial read renders no verdict and names the missing side.
5. Protected payload stays purpose and scope restricted.

**Traceability.** `SCR-POLICY-004` · `WF-POLICY-004` · flows `FLOW-AUDIT-001` `FLOW-AUDIT-002` `FLOW-ELIG-010` `FLOW-POLICY-002` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-006` `WGT-PLATFORM-014` `WGT-POLICY-001` · components `CMP-CLINICAL-002` `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-006` `CMP-PLATFORM-008` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-013` `CMP-POLICY-001` · patterns `IX-CLINICAL-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` `IX-POLICY-001` `IX-POLICY-002` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-014` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-POLICY-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-POLICY-002`, `FR-AUDIT-002` · contract `SDC-POLICY-001`, `SDC-AUDIT-001`

---

### SCR-AUDIT-001 — Audit explorer

**Wireframe:** `WF-AUDIT-001` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** list-and-detail · **Density:** `operational` · **Classification:** New
**Actors:** Authorized auditor or compliance actor with an explicit purpose
**Flows:** `FLOW-AUDIT-001` `FLOW-AUDIT-002`
**Requirements:** `FR-AUDIT-001`, `FR-AUDIT-002`
**Data / action contract:** `SDC-AUDIT-001`

**Purpose.** Let an authorized auditor find the audit events their purpose covers. Success is an auditor who finds what they need without prior familiarity. **Audit search must not become a way to read unrelated protected payload**: scope and purpose bound the results.

**Hierarchy** — Phase 2 priority order, not reopened: context/filter > list > selected detail > state-aware action.

| Region | Contents |
|---|---|
| Context and filter | The declared purpose and scope, and the search and filter set. |
| List | Matching audit events, in order. |
| Selected detail | That the search is bounded by purpose and scope. |
| State-aware action | Open an event, or open the integrity exceptions. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` `WGT-PLATFORM-006` |
| Components | `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-006` (`table`) `CMP-PLATFORM-007` (`queue`) `CMP-PLATFORM-008` (`record`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-AUDIT-001` | attributable audit metadata, resource/action/time/outcome/correlation, policy/snapshot/evidence references allowed by purpose, historical reproduction result/integrity state. | scoped search; inspect permitted event detail; request/export permitted audit output; invoke historical reproduction. |

- `SDC-AUDIT-001` projects the purpose-bounded audit events.
- Missing-data behaviour: a scope-limited result set states that it is scope-limited rather than appearing complete.

**State**

- Lifecycle statuses visible: none — audit events are facts, not lifecycles
- Permission model: Authorized auditor or compliance actor with an explicit purpose. **Audit records cannot be edited or deleted by anyone.** Access requires a legitimate operational, clinical, legal, financial, support or audit purpose, not merely holding an Admin account. Every sensitive read is audited.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Open an audit event | primary | the event is within the actor's purpose and scope | HIDDEN where it is not |
| Open integrity exceptions | secondary | the actor holds the scope | HIDDEN without it |
| Search and filter | secondary | always | never unavailable, and **the filter never widens the actor's effective scope** |

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

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the filter or search control where one exists, otherwise the first row.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is purpose and scope, search and filter, event list. The search is effective without prior familiarity: every filter carries a persistent visible label.
- Announcements: The result count announces when it changes.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- A table at `.wide` with a bounded internal horizontal scroll permitted; the page never scrolls horizontally. Correlation identifiers are bidirectionally isolated per cell.

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

1. **The filter never widens the actor's effective scope.**
2. A scope-limited result set says it is scope-limited rather than appearing complete.
3. **No control edits or deletes an audit record.**
4. Search is effective without prior familiarity, because this work is rare and urgent.

**Traceability.** `SCR-AUDIT-001` · `WF-AUDIT-001` · flows `FLOW-AUDIT-001` `FLOW-AUDIT-002` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` `WGT-PLATFORM-006` · components `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-006` `CMP-PLATFORM-007` `CMP-PLATFORM-008` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-AUDIT-001`, `FR-AUDIT-002` · contract `SDC-AUDIT-001`

---

### SCR-AUDIT-002 — Audit event detail

**Wireframe:** `WF-AUDIT-002` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** detail · **Density:** `operational` · **Classification:** New
**Actors:** Authorized auditor within purpose and target scope
**Flows:** `FLOW-AUDIT-001` `FLOW-BOOKING-011` `FLOW-CLINICAL-009` `FLOW-PLATFORM-003`
**Requirements:** `FR-AUDIT-001`, `FR-AUDIT-002`
**Data / action contract:** `SDC-AUDIT-001`

**Purpose.** Show one audit event with everything the record holds and nothing it must not expose. Success is an auditor who can trace an outcome back to its inputs. **It never exposes protected payload, credentials, one-time codes, private filenames or signed links.**

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The actor, their effective role and scope, and the actor's own purpose scope. |
| Primary facts | The action, the resource, the time, the outcome, the correlation identifier and the required reason. |
| Related history | Where the patient and the acting guardian differ, both are distinguished. |
| Action | Trace to the decision inspector or the historical reproduction. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-005` `WGT-PLATFORM-006` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`reviewer`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-006` (`embedded`) `CMP-PLATFORM-008` (`record`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-013` (`decided-by-person`) |
| Patterns | `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-AUDIT-001` | attributable audit metadata, resource/action/time/outcome/correlation, policy/snapshot/evidence references allowed by purpose, historical reproduction result/integrity state. | scoped search; inspect permitted event detail; request/export permitted audit output; invoke historical reproduction. |

- `SDC-AUDIT-001` projects the event. It **traces classification and financial outcomes back to their inputs, snapshots and policy versions**.
- **Protected payload, credentials, one-time codes, private filenames and signed links are excluded from the projection**, not filtered by the client.
- Missing-data behaviour: a field the actor is not authorized to see is absent, and the surface says the view is scope-limited.

**State**

- Lifecycle statuses visible: recorded outcome — success, rejected, failed
- Permission model: Authorized auditor within purpose and target scope. Access requires a legitimate operational, clinical, legal, financial, support or audit purpose, not merely holding an Admin account. Every sensitive read is audited.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Open the decision inspector | secondary | the actor is explicitly authorized for the internal projection | HIDDEN for every other actor |
| Open historical reproduction | secondary | the actor holds the audit scope | HIDDEN without it |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011`
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
- Screen-reader hierarchy: Landmark order is actor and effective scope, action and resource, outcome and correlation, trace routes. The patient and the acting guardian are announced distinctly where they differ.
- Announcements: Nothing announces. The record is immutable.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- Fields stack at `.narrow`; the correlation identifier is bidirectionally isolated and never truncated.

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

Not applicable here: `empty-filtered`. An immutable event record has no list, no filter and no command.

**Acceptance criteria**

1. **No protected payload, credential, one-time code, private filename or signed link appears.**
2. The patient and the acting guardian are distinguished where they differ.
3. Classification and financial outcomes trace back to their inputs, snapshots and policy versions.
4. The record is immutable and no control changes it.

**Traceability.** `SCR-AUDIT-002` · `WF-AUDIT-002` · flows `FLOW-AUDIT-001` `FLOW-BOOKING-011` `FLOW-CLINICAL-009` `FLOW-PLATFORM-003` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-005` `WGT-PLATFORM-006` · components `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-006` `CMP-PLATFORM-008` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-013` · patterns `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-AUDIT-001`, `FR-AUDIT-002` · contract `SDC-AUDIT-001`

---

### SCR-AUDIT-003 — Integrity exceptions

**Wireframe:** `WF-AUDIT-003` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** detail · **Density:** `operational` · **Classification:** New
**Actors:** Authorized policy, audit or technical owner within scope
**Flows:** `FLOW-AUDIT-002` `FLOW-ELIG-016` `FLOW-POLICY-002`
**Requirements:** `FR-AUDIT-003`, `FR-POLICY-002`
**Data / action contract:** `SDC-AUDIT-001`

**Purpose.** Show integrity exceptions and let an authorized owner assign and work them. Success is an exception resolved by a later auditable action. **An inconsistent stored history is reported rather than repaired in place.**

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The actor's scope and the exception set. |
| Primary facts | One row per exception with its state and the affected record and policy references. |
| Related history | That resolution is a later auditable action, never a silent change to history. |
| Action | Assign, or record a resolution. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-006` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`reviewer`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-006` (`embedded`) `CMP-PLATFORM-008` (`record`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-013` (`decided-by-person`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-AUDIT-001` | attributable audit metadata, resource/action/time/outcome/correlation, policy/snapshot/evidence references allowed by purpose, historical reproduction result/integrity state. | scoped search; inspect permitted event detail; request/export permitted audit output; invoke historical reproduction. |

- `SDC-AUDIT-001` projects the exceptions with their affected record and policy references.
- **Resolution is a later auditable action, never a silent change to history.**
- Missing-data behaviour: an exception whose affected record could not be read is still shown and says so; it is never dropped from the list.

**State**

- Lifecycle statuses visible: exception state; affected record and policy references
- Permission model: Authorized policy, audit or technical owner within scope. **Requires explicit workflow assignment and subject scope.**

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Assign the exception | primary | the actor holds the workflow assignment scope | HIDDEN without it |
| Record a resolution | primary | the actor holds the subject scope | **A later auditable action. No control edits the affected historical record** |
| Open the idempotency conflicts | secondary | always | never unavailable |

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
- Screen-reader hierarchy: Landmark order is scope, exception list, the report-not-repair statement, actions. Each exception announces its state and its affected references.
- Announcements: A newly raised exception announces politely.
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

Not applicable here: `empty-filtered`. The exception set is scoped rather than filtered.

**Acceptance criteria**

1. **An inconsistent stored history is reported rather than repaired in place.**
2. Resolution is a later auditable action.
3. Explicit workflow assignment and subject scope are required.
4. An exception whose affected record could not be read is never dropped from the list.

**Traceability.** `SCR-AUDIT-003` · `WF-AUDIT-003` · flows `FLOW-AUDIT-002` `FLOW-ELIG-016` `FLOW-POLICY-002` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-006` · components `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-006` `CMP-PLATFORM-008` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-013` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-AUDIT-003`, `FR-POLICY-002` · contract `SDC-AUDIT-001`

---

### SCR-AUDIT-004 — Idempotency conflicts

**Wireframe:** `WF-AUDIT-004` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** detail · **Density:** `operational` · **Classification:** New
**Actors:** Technical accountable owner; Operations staff within scope
**Flows:** `FLOW-AUDIT-002`
**Requirements:** `FR-AUDIT-003`
**Data / action contract:** `SDC-AUDIT-001`

**Purpose.** Show idempotency conflicts and confirm that each created no business side effect. Success is a technical owner who can see that the contract held. **A conflict creates no business side effect, which is the point: this screen confirms that rather than offering a fix.**

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The actor's scope. |
| Primary facts | One row per conflict with the operation, the actor and the scope. |
| Related history | That the conflict created no business side effect. |
| Action | Open the audit event. **No corrective control exists.** |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-006` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`reviewer`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-006` (`embedded`) `CMP-PLATFORM-008` (`record`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-AUDIT-001` | attributable audit metadata, resource/action/time/outcome/correlation, policy/snapshot/evidence references allowed by purpose, historical reproduction result/integrity state. | scoped search; inspect permitted event detail; request/export permitted audit output; invoke historical reproduction. |

- `SDC-AUDIT-001` projects the conflicts **without exposing protected request payload**.
- Missing-data behaviour: a conflict whose operation could not be identified is still listed and says so.

**State**

- Lifecycle statuses visible: conflict occurrence; affected operation and scope
- Permission model: Technical accountable owner; operations staff within scope. No control on this screen overrides a computed decision, forces a state, or edits a historical record. Where a correction is needed it is a new governed fact or a new appended event, never an in-place change.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Open the audit event | primary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011`
- No status this screen shows belongs to a governed lifecycle machine, so it binds no `TXT-STATE-*` rule. What the state section lists is descriptive condition, not a status chip drawn from a state machine.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the status and identity region.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is scope, conflict list, the no-side-effect statement. Each conflict announces its operation, actor and scope.
- Announcements: A new conflict appearing announces politely.
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

Not applicable here: `empty-filtered`. This surface renders facts rather than lifecycles and issues no domain command.

**Acceptance criteria**

1. **The screen confirms that a conflict created no business side effect rather than offering a fix.**
2. **No protected request payload is exposed.**
3. The client-facing counterpart error is referenced rather than restated.

**Traceability.** `SCR-AUDIT-004` · `WF-AUDIT-004` · flows `FLOW-AUDIT-002` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-006` · components `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-006` `CMP-PLATFORM-008` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-AUDIT-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-AUDIT-003` · contract `SDC-AUDIT-001`

---

### SCR-PLATFORM-006 — Evidence access log

**Wireframe:** `WF-PLATFORM-006` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** detail · **Density:** `operational` · **Classification:** New
**Actors:** Authorized audit, compliance or privacy actor within purpose scope
**Flows:** `FLOW-AUDIT-001` `FLOW-PLATFORM-001`
**Requirements:** `FR-AUDIT-001`
**Data / action contract:** `SDC-AUDIT-001`

**Purpose.** Show the evidence access log: state plus every access and download event. Success is a compliance actor who can see who read what and why. **Every download is audited and access requires fresh authorization for the exact evidence, resource and purpose.**

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The declared purpose and scope, and the filter. |
| Primary facts | One row per evidence item with its state: quarantine, accepted, rejected or expired. |
| Related history | The access and download events against each item. |
| Action | Open the audit event or the audit explorer. **No download control exists here.** |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-006` `WGT-PLATFORM-008` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`reviewer`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-006` (`embedded`) `CMP-PLATFORM-008` (`record`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-012` (`intake`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-006` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-009` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-AUDIT-001` | attributable audit metadata, resource/action/time/outcome/correlation, policy/snapshot/evidence references allowed by purpose, historical reproduction result/integrity state. | scoped search; inspect permitted event detail; request/export permitted audit output; invoke historical reproduction. |

- `SDC-AUDIT-001` projects the evidence states and the access and download events.
- **Short-lived authorization cannot be reused after expiry.**
- Missing-data behaviour: an access event whose purpose could not be read is still listed and says so, because an unattributed access is exactly what this log exists to surface.

**State**

- Lifecycle statuses visible: evidence quarantine, accepted, rejected, expired; access and download events
- Permission model: Authorized audit, compliance or privacy actor within purpose scope. **Storage administration is not a business authorization.** Access requires a legitimate operational, clinical, legal, financial, support or audit purpose, not merely holding an Admin account. Every sensitive read is audited.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Open the audit event | primary | always | never unavailable |
| Open the audit explorer | secondary | always | never unavailable |
| Filter by item state or actor | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-PLATFORM-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-PLATFORM-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |
| `ERR-PLATFORM-005` | an evidence item that failed validation or was rejected authoritatively | `TXT-ERR-PLATFORM-005` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-034` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the status and identity region.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is purpose and scope, filter, item list with access events. Each item announces its state and its access count.
- Announcements: A new access event appearing announces politely.
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
| `partial` | The region that loaded stays interactive; the region that failed names itself and offers retry in place. Never presented as complete. |
| `stale` | `CMP-PLATFORM-010` `stale` with the as-of time. Committing actions are withdrawn; read actions remain. |
| `error-fetch` | `CMP-PLATFORM-010` `fetch-failure`. Last known safe context preserved, retry in place, entered input untouched. |
| `error-permission` | `CMP-PLATFORM-010` `permission-denied`. Wins over every other state, no retry, affected actions removed structurally rather than disabled. |
| `success` | Content. |

Not applicable here: `empty-filtered`. This surface renders an append-only log and issues no domain command of its own.

**Acceptance criteria**

1. **No raw storage path, opaque filename or scanner internal is exposed.**
2. Every download is represented as an audited event.
3. Short-lived authorization cannot be reused after expiry.
4. **Storage administration is not treated as a business authorization.**

**Traceability.** `SCR-PLATFORM-006` · `WF-PLATFORM-006` · flows `FLOW-AUDIT-001` `FLOW-PLATFORM-001` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-006` `WGT-PLATFORM-008` · components `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-006` `CMP-PLATFORM-008` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-012` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-006` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-009` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-PLATFORM-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-034` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` `ERR-PLATFORM-005` · requirements `FR-AUDIT-001` · contract `SDC-AUDIT-001`

---

### SCR-PLATFORM-007 — Retention and legal hold

**Wireframe:** `WF-PLATFORM-007` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** detail · **Density:** `operational` · **Classification:** New
**Actors:** Authorized privacy or compliance actor
**Flows:** `FLOW-PLATFORM-003`
**Requirements:** `FR-AUDIT-001`
**Data / action contract:** `SDC-AUDIT-001`

**Purpose.** Show retention eligibility and legal holds, and let an authorized actor act within them. Success is a compliance actor who can see what is eligible and what is held. **No deletion occurs while an active legal hold exists: the action is blocked with its reason, not merely validated.**

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The actor's privacy or compliance scope. |
| Primary facts | Retention eligibility per record class, and active legal holds. |
| Related history | **That current retention and deletion periods are provisional pending legal validation.** |
| Action | Place or lift a hold; record a destruction where eligible. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-007` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`reviewer`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-006` (`embedded`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-013` (`decided-by-person`) `CMP-PLATFORM-014` (`irreversible`) |
| Patterns | `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-AUDIT-001` | attributable audit metadata, resource/action/time/outcome/correlation, policy/snapshot/evidence references allowed by purpose, historical reproduction result/integrity state. | scoped search; inspect permitted event detail; request/export permitted audit output; invoke historical reproduction. |

- `SDC-AUDIT-001` projects retention eligibility, legal-hold state and destruction outcomes.
- **Every destruction is audited and failures surface as operational exceptions.**
- **Final retention and deletion periods await legal validation under `Q-PLATFORM-002`**, so current values are provisional policy and the screen says so.
- Missing-data behaviour: where the legal-hold state could not be read, destruction is blocked, because destroying under an unread hold is unrecoverable.

**State**

- Lifecycle statuses visible: retention eligibility; legal hold active; destruction outcome
- Permission model: Authorized privacy or compliance actor. Access requires a legitimate operational, clinical, legal, financial, support or audit purpose, not merely holding an Admin account. Every sensitive read is audited.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Place a legal hold | primary | the actor holds the privacy or compliance scope | HIDDEN without it |
| Lift a legal hold | destructive | the actor holds the scope and a reason is given | DISABLED until a reason is entered |
| Record a destruction | destructive | the record is retention-eligible and no active legal hold exists | **UNAVAILABLE while an active legal hold exists, blocked with its reason** |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011`
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
- Screen-reader hierarchy: Landmark order is scope, retention eligibility, legal holds, the provisional statement, actions. A blocked destruction announces its blocking reason with the control.
- Announcements: A destruction failure announces as an operational exception, not as a completed action.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- Eligibility and holds are two labelled lists at every content width; the provisional statement is never collapsed behind a disclosure.

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

Not applicable here: `empty-filtered`. The retention set is scoped rather than filtered.

**Acceptance criteria**

1. **No deletion occurs while an active legal hold exists, and the action is blocked with its reason.**
2. Every destruction is audited and failures surface as operational exceptions.
3. **The screen states that current retention and deletion periods are provisional pending legal validation.**
4. An unread legal-hold state blocks destruction.

**Traceability.** `SCR-PLATFORM-007` · `WF-PLATFORM-007` · flows `FLOW-PLATFORM-003` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-007` · components `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-006` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-013` `CMP-PLATFORM-014` · patterns `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-AUDIT-001` · contract `SDC-AUDIT-001`

---

### SCR-PLATFORM-008 — Operational health

**Wireframe:** `WF-PLATFORM-008` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** dashboard · **Density:** `operational` · **Classification:** New
**Actors:** Technical accountable owner; Operations staff within scope
**Flows:** `FLOW-ELIG-013`
**Requirements:** `FR-OPS-002`
**Data / action contract:** `SDC-OPS-002`

**Purpose.** Show the operational signals: queue age, retry and failure counts, deadline breaches, scan backlog, notification failures, eligibility recalculation delay and backup status. Success is a technical owner who sees a problem before it becomes a business failure. **Delayed background work is never presented as a completed business outcome.**

**Hierarchy** — Phase 2 priority order, not reopened: context > urgent attention > primary work > supporting status.

| Region | Contents |
|---|---|
| Context | The technical scope. |
| Urgent attention | One block per signal with its threshold state and its defined threshold. |
| Primary work | The table equivalent of every signal. |
| Supporting status | Open the work queue, or the suspension operations. **No signal is acknowledged or silenced here.** |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-OPS-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-005` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`reviewer`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-006` (`embedded`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-009` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-OPS-002` | scoped metrics with population definition, time window, state rules, confirmed-vs-provisional distinction, last-refreshed time, permitted drill-down references. | filter/drill down/export only when corresponding permission/audit requirements pass. |

- `SDC-OPS-002` projects the signals. **Each signal carries a defined threshold.**
- **Delayed background work must never be presented as a completed business outcome.**
- Missing-data behaviour: a signal whose value could not be read is shown as unknown, never as within threshold.

**State**

- Lifecycle statuses visible: per-signal threshold state
- Permission model: Technical accountable owner; operations staff within scope. Scoped to the actor's active grants, assigned work and subject-matter competence, enforced server-side. **A coarse role is not the authorization model** and no administrator bypass exists. A scope revoked mid-shift removes the affected actions structurally and states the change; it never renders as a quiet empty queue.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Open the work queue | primary | always | never unavailable |
| Open suspension operations | secondary | a recalculation signal is in a threshold state | absent otherwise |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011`
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
- Screen-reader hierarchy: Landmark order is scope, signal blocks. Each signal announces its value, its defined threshold and its threshold state as a label; **the table equivalent is in the accessibility tree at all times**.
- Announcements: A signal crossing its threshold announces politely.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- Signal blocks reflow across the content grid; at `.narrow` they stack one per row and each renders as its table rather than compressing to an unreadable chart.

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

Not applicable here: `empty-filtered`. A signal board is scoped rather than filtered, and it issues no domain command.

**Acceptance criteria**

1. **No signal relies on colour alone**; each carries its threshold state as a label.
2. Each signal carries a defined threshold, stated on the surface.
3. **Delayed background work is never presented as a completed business outcome.**
4. A signal whose value could not be read is shown as unknown, never as within threshold.
5. Every signal has a table equivalent present without a control being used.

**Traceability.** `SCR-PLATFORM-008` · `WF-PLATFORM-008` · flows `FLOW-ELIG-013` · widgets `WGT-OPS-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-005` · components `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-006` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-009` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-OPS-002` · contract `SDC-OPS-002`

---

### SCR-IDENTITY-038 — Legal representation verification

**Wireframe:** `WF-IDENTITY-038` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** form · **Density:** `operational` · **Classification:** New
**Actors:** Authorized verification staff or admin within assigned review scope — per `PERMISSIONS_MATRIX` section 6
**Flows:** `FLOW-IDENTITY-021`
**Requirements:** `FR-IDENTITY-003`, `FR-AUDIT-001`
**Data / action contract:** `SDC-IDENTITY-005`

**Purpose.** Let authorized staff verify a legal-basis representation request and, on approval, write an explicit grant. Success is a grant whose record names the approving reviewer. It exists because **the reviewer is part of the record, not an implicit actor**.

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | The request and the reviewer's assigned scope. |
| Required input | The requested representation: patient, grantee, actions, data scope, purpose and effective period, with the supporting evidence. |
| Validation and consequence | The itemised outcomes and the reasons that reach the requester. |
| Action | Approve, request changes, or reject. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-IDENTITY-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` `WGT-PLATFORM-013` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) `CMP-PLATFORM-013` (`decided-by-person`) `CMP-PLATFORM-014` (`irreversible`) |
| Patterns | `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-IDENTITY-005` | request ID and state, subject patient identification, guardian applicant identity, declared relationship and legal basis, requested actions/data scope/purpose, submitted evidence references and their validation state, review history. | open request; assess evidence; request changes with itemised reasons; approve, creating the `LEGAL_BASIS` grant with explicit patient, grantee, actions, data scope, purpose, effective period, evidence and approving reviewer; reject with a required reason; revoke an existing legal-basis grant through the authorized workflow. |

- `SDC-IDENTITY-005` projects the request and, on approval, **writes an explicit grant recording the patient, the grantee, the actions, the data scope, the purpose, the effective period, the evidence and the approving reviewer**.
- Missing-data behaviour: an unresolved evidence item is never counted as satisfied and approval stays unavailable naming it.

**State**

- Lifecycle statuses visible: request submitted, changes requested, approved, rejected; resulting grant effective period
- Permission model: Authorized verification staff or administrator within assigned review scope.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Approve the request | primary | every required item is verified and the actor holds the scope | UNAVAILABLE with the outstanding items named |
| Request changes | secondary | the request is under review | UNAVAILABLE once a final decision exists. **Only the named items are returned** |
| Reject the request | destructive | a stated reason is given | DISABLED until a reason is entered |
| Open an evidence item | secondary | fresh purpose-bound authorization is granted | UNAVAILABLE without it; **evidence is read under the quarantine rules, never as a public or signed URL** |

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
| `ERR-PLATFORM-005` | an evidence item that failed validation or was rejected authoritatively | `TXT-ERR-PLATFORM-005` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is request context, requested scope, evidence and outcomes, actions. The resulting grant scope is part of the approval confirmation.
- Announcements: Recording an item outcome announces the outstanding count. The approval announces the created grant.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- The requested scope and the evidence list stack at `.narrow`; the scope never truncates.

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

Not applicable here: `empty-no-data` `empty-filtered`. The request's item set is its own rather than a filtered projection.

**Acceptance criteria**

1. The approving reviewer is recorded as part of the grant, not as an implicit actor.
2. A changes request returns only the named items.
3. Rejection requires a stated reason.
4. **Evidence is read under the quarantine rules and never as a public or signed URL.**
5. The resulting grant scope is legible before approval commits.

**Traceability.** `SCR-IDENTITY-038` · `WF-IDENTITY-038` · flows `FLOW-IDENTITY-021` · widgets `WGT-IDENTITY-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` `WGT-PLATFORM-013` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` `CMP-PLATFORM-013` `CMP-PLATFORM-014` · patterns `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-IDENTITY-002` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-AUDIT-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` `ERR-PLATFORM-002` `ERR-PLATFORM-004` `ERR-PLATFORM-005` · requirements `FR-IDENTITY-003`, `FR-AUDIT-001` · contract `SDC-IDENTITY-005`

---

### SCR-ELIG-022 — Booking eligibility review

**Wireframe:** `WF-ELIG-022` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** detail · **Density:** `operational` · **Classification:** New
**Actors:** Authorized verification/operations staff; licensed clinical reviewer where the suspension reason requires clinical judgment
**Flows:** `FLOW-ELIG-015`
**Requirements:** `FR-ELIG-003`, `FR-BOOKING-002`, `FR-OPS-001`
**Data / action contract:** `SDC-ELIG-004`, `SDC-OPS-001`

**Purpose.** Let an authorized reviewer resolve a booking held in eligibility review to exactly one of two outcomes. Success is a decided booking before its review due time. **It offers exactly two outcomes and no attendance override** — the fail-closed rule is structural here, not a validation message.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The booking, its held state, and the owning suspended scope. |
| Primary facts | The review due time, which the surface sorts by and which may be immediately due. |
| Related history | **Whether a licensed clinical reviewer is required**, which is a property of the suspension reason and is stated rather than left to judgement. |
| Action | Confirm, or cancel with the governed reason. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-ELIG-002` `WGT-OPS-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` |
| Components | `CMP-ELIG-003` (`reviewer`) `CMP-OPS-001` (`queue`) `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`reviewer`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-013` (`decided-by-person`) |
| Patterns | `IX-ELIG-001` `IX-OPS-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-ELIG-004` | affected bookings in `ELIGIBILITY_REVIEW`, controlling suspension reason and owning eligibility scope, review due time, appointment time, whether clinical judgment is required, remediation progress, patient/clinic notification state. | record verification remediation; request the clinical reviewer's assessment; record the outcome once a new authoritative eligibility evaluation exists. |
| `SDC-OPS-001` | work item ID/type, linked resource/case, lifecycle state, escalated flag, overdue flag, priority, due time, responsibility scope, blocking reason, assignment, safe summary. | claim/assign where allowed; start; move to waiting with a named blocking reason; resume; complete with outcome; escalate; reopen where policy permits. |

- `SDC-ELIG-004` and `SDC-OPS-001` project the held booking, the review due time and the work item lifecycle with escalated and overdue as separate flags.
- Missing-data behaviour: where the suspension reason could not be read, neither outcome is offered, because the required competence cannot be determined.

**State**

- Lifecycle statuses visible: booking `ELIGIBILITY_REVIEW`, then `CONFIRMED` or `CANCELLED` reason `PROVIDER_ELIGIBILITY_SUSPENDED`; work item lifecycle state with escalated and overdue as separate flags
- Permission model: Authorized verification or operations staff; licensed clinical reviewer where the suspension reason requires clinical judgement. **No attendance override exists at any role.**

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Confirm the booking | primary | the actor holds the required competence for this suspension reason | HIDDEN where the reason requires a licensed clinical reviewer and the actor is not one |
| Cancel with the governed reason | destructive | the actor holds the required competence | HIDDEN where the actor does not hold it |
| Open the suspension operations | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-ELIG-001` `TXT-STATE-OPS-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-ELIG-001` `TXT-STATE-OPS-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-BOOKING-002` | a booking command that the record's current state does not permit | `TXT-ERR-BOOKING-002` |
| `ERR-ELIG-001` | a commit that revalidates provider, service or branch eligibility and finds it not currently passing | `TXT-ERR-ELIG-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the status and identity region.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is booking and suspension, review due time, competence requirement, the two outcomes. The competence requirement is announced with the action set.
- Announcements: A review due time entering its approaching window announces politely; the decision announces the resulting booking state.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- The due time and the competence requirement stay above the action set at every content width and never truncate.

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

Not applicable here: `empty-no-data` `empty-filtered`. A single held booking has no list-level filter of its own.

**Acceptance criteria**

1. **Exactly two outcomes are offered and no attendance override exists.**
2. Whether a licensed clinical reviewer is required is stated by the screen, not judged by the reviewer.
3. The surface sorts by review due time, which may be immediately due.
4. State, escalated and overdue are rendered as three separate facts.

**Traceability.** `SCR-ELIG-022` · `WF-ELIG-022` · flows `FLOW-ELIG-015` · widgets `WGT-ELIG-002` `WGT-OPS-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` · components `CMP-ELIG-003` `CMP-OPS-001` `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-013` · patterns `IX-ELIG-001` `IX-OPS-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-ELIG-001` `TXT-STATE-OPS-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-BOOKING-002` `ERR-ELIG-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-ELIG-003`, `FR-BOOKING-002`, `FR-OPS-001` · contract `SDC-ELIG-004`, `SDC-OPS-001`

---

### SCR-ELIG-023 — Market observations and calibration

**Wireframe:** `WF-ELIG-023` · **Platform:** Admin panel (Profile A) · **Runtime:** Filament panel
**Archetype:** list-and-detail · **Density:** `operational` · **Classification:** New
**Actors:** Commercial / pricing administrator within owned scope; authorized policy and audit staff read-only
**Flows:** `FLOW-ELIG-016` `FLOW-PLATFORM-004`
**Requirements:** `FR-ELIG-019`, `FR-ELIG-014`
**Data / action contract:** `SDC-POLICY-002`

**Purpose.** Record market price observations at speed while keeping every provenance field, and show the calibration state honestly against the effective policy. Success is a corpus a later reader can judge. **Internal only, on every surface and in every export.**

**Hierarchy** — Phase 2 priority order, not reopened: context/filter > list > selected detail > state-aware action.

| Region | Contents |
|---|---|
| Context and filter | The catalog scope, locality filter and the governed calibration version bar. |
| List | The observation grid with sticky defaults, source reuse, duplicate row and batch import. |
| Selected detail | The effective policy window, locality scope, minimum sample and confidence rules against the actual sample. |
| State-aware action | Record an observation, or open the policy editor. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` `WGT-POLICY-001` `WGT-POLICY-002` |
| Components | `CMP-ELIG-002` (`governed display mode from the provider price fact`) `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`staff-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-006` (`table`) `CMP-PLATFORM-007` (`management`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-POLICY-001` (`calibration`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` `IX-POLICY-001` `IX-POLICY-002` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-POLICY-002` | market observations by locality and catalog scope with amount, currency, observation date, source type and reference, material or laboratory variant, verification state, confidence and provenance; the effective price policy's observation window, minimum sample threshold, confidence rules and approved distribution boundaries; the current sample size and resulting calibration state per scope, including which scopes are non-final and why; draft, scheduled and active price-policy versions with effective periods; the commercial-option catalog by category with lifecycle and approvals; and the currency policy's approved rate source, rounding rule and effective period. | record an observation; verify or reject an observation with a reason; supersede an observation to correct it; draft a price-policy version and its thresholds; submit for the required independent approval; schedule and activate prospectively; retire a version; manage price-display modes, material and option upgrades, third-party-cost categories, quantity rules and external financial method labels; draft and activate currency presentation, approved rate source and rounding policy. |

- `SDC-POLICY-002` records the observations. Each carries **the catalog scope it prices, its locality, amount and currency, the date observed, the source type and reference, whether material or laboratory cost is included, its verification state and its confidence** — because an unattributed number cannot be judged later.
- **Observations are append-only.** A silently edited basis rewrites past classifications.
- **A calibration state that is not final suppresses the internal class and never suppresses or alters the provider's own price**, which the patient continues to see in its governed display mode.
- **Production calibration minimums require licensed clinical approval under `Q-ELIG-001`**, so current values are provisional and the screen says so.
- Missing-data behaviour: a scope below the effective minimum sample reads honestly as still calibrating and produces no class rather than a weak one.

**State**

- Lifecycle statuses visible: observation verification state and confidence; calibration state `FINAL`, `CALIBRATING`, `PROVISIONAL` or `NOT_APPLICABLE` per locality and scope; policy version and effective period
- Permission model: Commercial or pricing administrator within owned scope; authorized policy and audit staff read-only.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Record an observation | primary | the actor is the commercial or pricing administrator within owned scope | HIDDEN for policy and audit staff, who are read-only |
| Duplicate a row | secondary | a row exists | absent on an empty grid |
| Batch import | secondary | the actor holds the owned scope | HIDDEN otherwise. Every row is validated before any row commits |
| Supersede an observation | secondary | the actor holds the owned scope | **A correction is a new observation superseding the earlier one with a reason. There is no in-place edit and no delete** |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-013` `TXT-PLATFORM-014` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-POLICY-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-POLICY-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-FINANCE-001` `A11Y-POLICY-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the filter or search control where one exists, otherwise the first row.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is scope and version bar, grid, calibration statement. Each cell has a persistent visible column label exposed to assistive technology; the sample count against the minimum is announced when it crosses the threshold.
- Announcements: A committed row announces once. A calibration state change announces politely.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- `dense` at `.wide` with a bounded internal horizontal scroll permitted for the grid; at the largest text sizes it degrades to the reading-list shape. **The page itself never scrolls horizontally.**

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

1. Every observation carries all ten provenance fields.
2. **No control edits or deletes an observation; a correction appends and supersedes with a reason.**
3. A scope below the effective minimum sample reads as still calibrating and produces no class.
4. **Nothing here is labelled a market average, a city average or a tariff.**
5. **A provider is never shown where their price sits relative to the corpus.**
6. Entry, duplication and batch import are completable by keyboard alone.
7. Nothing on this surface or in any export reaches a patient or a provider.

**Traceability.** `SCR-ELIG-023` · `WF-ELIG-023` · flows `FLOW-ELIG-016` `FLOW-PLATFORM-004` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` `WGT-POLICY-001` `WGT-POLICY-002` · components `CMP-ELIG-002` `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-006` `CMP-PLATFORM-007` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-POLICY-001` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` `IX-POLICY-001` `IX-POLICY-002` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-013` `TXT-PLATFORM-014` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-POLICY-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-FINANCE-001` `A11Y-POLICY-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-ELIG-019`, `FR-ELIG-014` · contract `SDC-POLICY-002`

---
