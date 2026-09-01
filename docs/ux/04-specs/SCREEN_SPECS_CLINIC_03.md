# Screen Specifications — Clinic / Doctor panel (3 of 3)

**Phase:** UX 4 — Widget and Screen Specifications
**Platform:** Clinic / Doctor panel · Profile A · Filament panel
**Schema:** `PHASE_04_IMPLEMENTATION_PLAN.md` section 6. **Widgets:** `WIDGET_SPECS.md`. **Map:** `SCREEN_SPEC_MAP.md`.

Every block carries the same thirteen sections in the same order. A section that does not apply says so and why.

---
### SCR-CLINICAL-011 — Stages and pricing

**Wireframe:** `WF-CLINICAL-011` · **Platform:** Clinic / Doctor panel (Profile A) · **Runtime:** Filament panel
**Archetype:** workspace · **Density:** `dense` · **Classification:** New
**Actors:** Treating dentist for the exact case
**Flows:** `FLOW-CLINICAL-001` `FLOW-CLINICAL-003`
**Requirements:** `FR-CLINICAL-001`, `FR-FINANCE-001`
**Data / action contract:** `SDC-CLINICAL-001`

**Purpose.** Let the treating dentist group lines into stages and complete the commercial content, with completeness visible while authoring. Success is a draft that can be proposed and later accepted without failing. **Completeness must be visible while authoring rather than discovered at acceptance.**

**Hierarchy** — Phase 2 priority order, not reopened: case/context > authoring workspace > totals/readiness > action.

| Region | Contents |
|---|---|
| Case and context | The case, the patient and the draft version. |
| Authoring workspace | Stages, their lines, and each line's modifiers chosen from the four governed categories with a reason. |
| Totals and readiness | Per-section completeness and the derived total. |
| Action | Save, or continue to propose. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-CLINICAL-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` `WGT-PLATFORM-010` `WGT-PLATFORM-011` |
| Components | `CMP-CLINICAL-001` (`authoring`) `CMP-ELIG-002` (`governed display mode from the provider price fact`) `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`provider-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-006` (`embedded`) `CMP-PLATFORM-007` (`authoring`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-005` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-CLINICAL-001` | authorized case summary/timeline, treating relationship, plan versions, accepted snapshot, stages, required evidence/acknowledgements, follow-up state. | dentist creates/revises/proposes plan; authorized clinician records stage progress/evidence/completion; create amendment proposal; permitted staff record non-clinical case facts. |

- `SDC-CLINICAL-001` accepts the stage and pricing content. Every modifier belongs to exactly one of the four governed categories and carries a reason.
- **Charging a component the governing definition marks as included is refused at authoring time**, and so is a modifier with no governed category.
- Missing-data behaviour: missing required service, stage, price, terms or policy information blocks proposal and later acceptance, so the outstanding set is named while authoring.

**State**

- Lifecycle statuses visible: `DRAFT`; per-section completeness
- Permission model: Treating dentist for the exact case.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Add a stage | primary | the actor is the treating dentist for this case | HIDDEN for any other actor |
| Attach a modifier to a line | primary | the governed option set is loaded | UNAVAILABLE while it is not, with the reason named. **There is no free-text alternative** |
| Continue to propose | primary | the draft is complete | UNAVAILABLE with the outstanding items named |
| Remove a stage | destructive | the draft is not yet proposed | HIDDEN on an accepted version |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-013` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLINICAL-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-CLINICAL-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-CLINICAL-001` | an acceptance against a version that is stale or missing required information | `TXT-ERR-CLINICAL-001` |
| `ERR-CLINICAL-002` | a treatment line whose commercial option is uncategorized, retired or not selectable | `TXT-ERR-CLINICAL-002` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-028` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-FINANCE-001` `A11Y-CLINICAL-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the authoring region, after the case context has been announced.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is case context, stages and lines, completeness and total, actions. Each modifier announces its category and its reason.
- Announcements: Completeness announces when it changes state, once. The derived total announces once per change.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- `dense` at `.wide`; at `.narrow` stages stack and each line keeps its amount adjacent to its description.

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

1. **There is no free-text surcharge field anywhere on this screen.**
2. An uncategorized, retired or unselectable option fails here rather than reaching the patient.
3. Charging a component already inside a line's inclusions is refused.
4. Completeness is visible while authoring, not discovered at acceptance.
5. What the patient will see is evident to the author.

**Traceability.** `SCR-CLINICAL-011` · `WF-CLINICAL-011` · flows `FLOW-CLINICAL-001` `FLOW-CLINICAL-003` · widgets `WGT-CLINICAL-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` `WGT-PLATFORM-010` `WGT-PLATFORM-011` · components `CMP-CLINICAL-001` `CMP-ELIG-002` `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-006` `CMP-PLATFORM-007` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-005` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-013` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLINICAL-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-028` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-FINANCE-001` `A11Y-CLINICAL-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-AUDIT-001` `ERR-CLINICAL-001` `ERR-CLINICAL-002` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-CLINICAL-001`, `FR-FINANCE-001` · contract `SDC-CLINICAL-001`

---

### SCR-CLINICAL-012 — Propose plan

**Wireframe:** `WF-CLINICAL-012` · **Platform:** Clinic / Doctor panel (Profile A) · **Runtime:** Filament panel
**Archetype:** form · **Density:** `operational` · **Classification:** New
**Actors:** Treating dentist for the exact case
**Flows:** `FLOW-CLINICAL-001` `FLOW-CLINICAL-003`
**Requirements:** `FR-CLINICAL-001`
**Data / action contract:** `SDC-CLINICAL-001`

**Purpose.** Let the treating dentist propose the plan, making it patient-visible and starting the acceptance path. Success is a proposed version the patient can decide on. It is the deepest Clinic screen deliberately: proposing is consequential.

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | The case, the patient and the version being proposed. |
| Required input | What proposing does: the plan becomes patient-visible and the acceptance path starts. |
| Validation and consequence | Where this version supersedes an accepted one, the amendment summary that must accompany it, presented as the confirmation's stated effect. |
| Action | Propose. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`provider-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) `CMP-PLATFORM-013` (`decided-by-person`) `CMP-PLATFORM-014` (`irreversible`) |
| Patterns | `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` |
| Screen-only | The amendment summary is rendered here as the sensitive confirmation's stated effect. Phase 3 binds the change-disclosure component to the version-history surface rather than to this one, and Phase 4 does not extend that binding. |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-CLINICAL-001` | authorized case summary/timeline, treating relationship, plan versions, accepted snapshot, stages, required evidence/acknowledgements, follow-up state. | dentist creates/revises/proposes plan; authorized clinician records stage progress/evidence/completion; create amendment proposal; permitted staff record non-clinical case facts. |

- `SDC-CLINICAL-001` proposes the version. **Proposing a superseding version without its change summary is refused.**
- Missing-data behaviour: where the accepted snapshot cannot be read, a superseding proposal is withheld, because the change summary could not be verified as complete.

**State**

- Lifecycle statuses visible: `DRAFT` before, `PROPOSED` after
- Permission model: Treating dentist for the exact case.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Propose the plan | primary | the draft is complete and, where it supersedes an accepted version, its change summary exists | **UNAVAILABLE while required information is absent**, with the outstanding items named. Also unavailable without the change summary on a superseding version |
| Back to stages and pricing | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLINICAL-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-CLINICAL-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-CLINICAL-001` | an acceptance against a version that is stale or missing required information | `TXT-ERR-CLINICAL-001` |
| `ERR-CLINICAL-002` | a treatment line whose commercial option is uncategorized, retired or not selectable | `TXT-ERR-CLINICAL-002` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is version context, what proposing does, the stated effect including the change summary, the action. Focus enters on the effect statement, never on the propose control.
- Announcements: The committed proposal announces and focus moves to the resulting version state.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- The effect statement is never collapsed behind a disclosure at any content width.

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

1. Proposal is unavailable while required information is absent, with what remains named.
2. **A proposed version the patient has viewed is never silently replaced**; a change is a new version.
3. A superseding proposal requires its change summary, stating what changed, why, which lines and the price difference.
4. The author sees that they are composing a disclosure the patient must re-accept, not editing a plan.

**Traceability.** `SCR-CLINICAL-012` · `WF-CLINICAL-012` · flows `FLOW-CLINICAL-001` `FLOW-CLINICAL-003` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` `CMP-PLATFORM-013` `CMP-PLATFORM-014` · patterns `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLINICAL-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-AUDIT-001` `ERR-CLINICAL-001` `ERR-CLINICAL-002` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-CLINICAL-001` · contract `SDC-CLINICAL-001`

---

### SCR-CLINICAL-013 — Plan version history

**Wireframe:** `WF-CLINICAL-013` · **Platform:** Clinic / Doctor panel (Profile A) · **Runtime:** Filament panel
**Archetype:** detail · **Density:** `operational` · **Classification:** New
**Actors:** Treating dentist; authorized clinic staff read-only
**Flows:** `FLOW-CLINICAL-001` `FLOW-CLINICAL-003` `FLOW-CLINICAL-010`
**Requirements:** `FR-CLINICAL-002`
**Data / action contract:** `SDC-CLINICAL-001`

**Purpose.** Show the plan version chain so amendment history stays readable. Success is a reader who can see which version governed which events. It exists because **an accepted snapshot governs the events that occurred under it even after a newer version is accepted**.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The case and the patient. |
| Primary facts | The version chain with each version's state. |
| Related history | The comparison between any two versions, with unchanged elements stated as unchanged. |
| Action | Create an amendment. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-CLINICAL-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-006` `WGT-PLATFORM-014` |
| Components | `CMP-CLINICAL-001` (`oversight`) `CMP-CLINICAL-002` (`version`) `CMP-ELIG-002` (`governed display mode from the provider price fact`) `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`operator`) `CMP-PLATFORM-003` (`provider-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-006` (`embedded`) `CMP-PLATFORM-008` (`record`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-013` (`decided-by-person`) |
| Patterns | `IX-CLINICAL-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` `IX-POLICY-002` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-CLINICAL-001` | authorized case summary/timeline, treating relationship, plan versions, accepted snapshot, stages, required evidence/acknowledgements, follow-up state. | dentist creates/revises/proposes plan; authorized clinician records stage progress/evidence/completion; create amendment proposal; permitted staff record non-clinical case facts. |

- `SDC-CLINICAL-001` projects the version chain and the accepted snapshots.
- **Accepted versions carry no edit affordance.**
- Missing-data behaviour: if one side of a comparison failed to load, **no diff renders** and the missing side is named.

**State**

- Lifecycle statuses visible: `DRAFT`, `PROPOSED`, `ACCEPTED` per version
- Permission model: Treating dentist; authorized clinic staff read-only. Scoped to the actor's active provider and branch grants, enforced server-side. A scope revoked mid-shift removes the affected actions structurally and states the scope change; it never renders as an empty surface.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Create an amendment | primary | the actor is the treating dentist for this case | HIDDEN for read-only staff |
| Compare two versions | secondary | two versions exist | absent on a single version |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-013` `TXT-PLATFORM-014` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLINICAL-001` `TXT-STATE-PLATFORM-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-CLINICAL-001` `TXT-STATE-PLATFORM-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-FINANCE-001` `A11Y-CLINICAL-001` `A11Y-POLICY-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the status and identity region.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is case context, version chain, comparison. Each changed element announces as element, prior value, new value.
- Announcements: A newly accepted version announces politely and the chain recomputes.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- Two comparison columns at `.wide` with the prior version at the logical start; per-row stacking at `.narrow` keeping each pair adjacent.

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

Not applicable here: `empty-filtered`. The version chain is scoped to one plan rather than filtered.

**Acceptance criteria**

1. Accepted versions carry no edit affordance of any kind.
2. The version chain makes amendment history readable.
3. A partial comparison renders no diff and names the missing side.
4. Unchanged elements are stated as unchanged rather than omitted.

**Traceability.** `SCR-CLINICAL-013` · `WF-CLINICAL-013` · flows `FLOW-CLINICAL-001` `FLOW-CLINICAL-003` `FLOW-CLINICAL-010` · widgets `WGT-CLINICAL-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-006` `WGT-PLATFORM-014` · components `CMP-CLINICAL-001` `CMP-CLINICAL-002` `CMP-ELIG-002` `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-006` `CMP-PLATFORM-008` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-013` · patterns `IX-CLINICAL-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` `IX-POLICY-002` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-013` `TXT-PLATFORM-014` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLINICAL-001` `TXT-STATE-PLATFORM-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-FINANCE-001` `A11Y-CLINICAL-001` `A11Y-POLICY-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-CLINICAL-002` · contract `SDC-CLINICAL-001`

---

### SCR-CLINICAL-014 — Stage execution and evidence

**Wireframe:** `WF-CLINICAL-014` · **Platform:** Clinic / Doctor panel (Profile A) · **Runtime:** Filament panel
**Archetype:** detail · **Density:** `operational` · **Classification:** New
**Actors:** Treating dentist; authorized clinic staff per exact action
**Flows:** `FLOW-CLINICAL-004` `FLOW-CLINICAL-005` `FLOW-CLINICAL-006` `FLOW-OPS-002` `FLOW-PLATFORM-001`
**Requirements:** `FR-CLINICAL-003`
**Data / action contract:** `SDC-CLINICAL-001`

**Purpose.** Show one stage's requirements as they resolve from the accepted snapshot, and let the clinic supply what it needs. Success is a stage whose requirements are all satisfied. **Requirements differ per case** and are shown per stage rather than generically.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The case, the patient and the stage. |
| Primary facts | The requirement set resolved from the accepted snapshot, with per-item evidence state. |
| Related history | The stage history including any reopening. |
| Action | Supply evidence, complete, or reopen. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-CLINICAL-003` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-008` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`operator`) `CMP-PLATFORM-003` (`provider-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-006` (`embedded`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-012` (`intake`) |
| Patterns | `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-006` `IX-PLATFORM-007` `IX-PLATFORM-009` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-CLINICAL-001` | authorized case summary/timeline, treating relationship, plan versions, accepted snapshot, stages, required evidence/acknowledgements, follow-up state. | dentist creates/revises/proposes plan; authorized clinician records stage progress/evidence/completion; create amendment proposal; permitted staff record non-clinical case facts. |

- `SDC-CLINICAL-001` projects the stage, its requirements and its evidence states.
- **Evidence is private and never a public link.** Transfer is bounded by the vendor decision in `Q-OPS-001`.
- Missing-data behaviour: a requirement whose state did not load is never counted as satisfied and completion stays unavailable naming it.

**State**

- Lifecycle statuses visible: `INCOMPLETE`, `COMPLETED`, `REOPENED`; per-item evidence state
- Permission model: Treating dentist; authorized clinic staff per exact action. Action availability differs by relationship: a treating dentist authors clinical content, other authorized staff record non-clinical facts only. That distinction is enforced server-side and is legible here, so staff are not offered actions they cannot complete.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Supply evidence | primary | a requirement is outstanding | absent once every requirement is satisfied |
| Complete the stage | primary | every mandatory field, acknowledgment and evidence item is present and valid | **UNAVAILABLE with exactly what remains named** — a designed state, not a validation message |
| Reopen the stage | destructive | the stage is complete and the actor is authorized | HIDDEN where the actor is not authorized to reopen |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLINICAL-002` `TXT-STATE-PLATFORM-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-CLINICAL-002` `TXT-STATE-PLATFORM-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |
| `ERR-PLATFORM-005` | an evidence item that failed validation or was rejected authoritatively | `TXT-ERR-PLATFORM-005` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-034` `A11Y-CLINICAL-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the status and identity region.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is case and stage context, requirements, history, actions. Each requirement announces its state and its remedy.
- Announcements: Evidence progress announces at intervals. A completion announces the resulting state.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- Requirements are a list at every content width; at `.narrow` each stacks with its state above its next action.

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

1. Requirements resolve from the accepted snapshot and differ per case.
2. A quarantined item never satisfies a requirement.
3. Evidence is never exposed as a public or long-lived link.
4. A retryable transfer failure and an authoritative rejection are structurally distinct.

**Traceability.** `SCR-CLINICAL-014` · `WF-CLINICAL-014` · flows `FLOW-CLINICAL-004` `FLOW-CLINICAL-005` `FLOW-CLINICAL-006` `FLOW-OPS-002` `FLOW-PLATFORM-001` · widgets `WGT-CLINICAL-003` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-008` · components `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-006` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-012` · patterns `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-006` `IX-PLATFORM-007` `IX-PLATFORM-009` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLINICAL-002` `TXT-STATE-PLATFORM-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-034` `A11Y-CLINICAL-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` `ERR-PLATFORM-005` · requirements `FR-CLINICAL-003` · contract `SDC-CLINICAL-001`

---

### SCR-CLINICAL-015 — Stage completion

**Wireframe:** `WF-CLINICAL-015` · **Platform:** Clinic / Doctor panel (Profile A) · **Runtime:** Filament panel
**Archetype:** form · **Density:** `operational` · **Classification:** New
**Actors:** Treating dentist for the exact case and stage
**Flows:** `FLOW-CLINICAL-005`
**Requirements:** `FR-CLINICAL-003`
**Data / action contract:** `SDC-CLINICAL-001`

**Purpose.** Let the treating dentist complete a stage, with everything the completion records made explicit. Success is an authoritative completion. It exists because **completion is never local-only: it is authoritative or it did not happen.**

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | The case, the patient and the stage. |
| Required input | What is still outstanding, if anything. |
| Validation and consequence | What the completion records: actor, time, reason or context, and the evidence set evaluated. |
| Action | Complete the stage. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-CLINICAL-003` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`provider-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) `CMP-PLATFORM-013` (`decided-by-person`) `CMP-PLATFORM-014` (`irreversible`) |
| Patterns | `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-006` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-CLINICAL-001` | authorized case summary/timeline, treating relationship, plan versions, accepted snapshot, stages, required evidence/acknowledgements, follow-up state. | dentist creates/revises/proposes plan; authorized clinician records stage progress/evidence/completion; create amendment proposal; permitted staff record non-clinical case facts. |

- `SDC-CLINICAL-001` records the completion with the actor, the time, the reason or context and the evidence set evaluated.
- Missing-data behaviour: where the evidence set could not be read, completion is withheld, because the recorded evaluation would be incomplete.

**State**

- Lifecycle statuses visible: `COMPLETED`
- Permission model: Treating dentist for the exact case and stage.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Complete the stage | primary | nothing mandatory is outstanding | **UNAVAILABLE naming exactly what remains** while any mandatory field, acknowledgment or evidence item is absent or invalid |
| Back to the stage | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLINICAL-002`
- Lifecycle labels for every status above are owned by `TXT-STATE-CLINICAL-002` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-CLINICAL-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is stage context, outstanding items, what is recorded, action. The outstanding list is programmatically associated with the action.
- Announcements: The committed completion announces the resulting state and moves focus to it.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- The outstanding list is never collapsed behind a disclosure.

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

1. Completion is unavailable while anything mandatory is outstanding, and names exactly what remains.
2. Actor, time, reason or context and the evaluated evidence set are all recorded.
3. **Completion is authoritative before it renders as complete.**

**Traceability.** `SCR-CLINICAL-015` · `WF-CLINICAL-015` · flows `FLOW-CLINICAL-005` · widgets `WGT-CLINICAL-003` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` `CMP-PLATFORM-013` `CMP-PLATFORM-014` · patterns `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-006` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLINICAL-002` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-CLINICAL-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-AUDIT-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-CLINICAL-003` · contract `SDC-CLINICAL-001`

---

### SCR-CLINICAL-016 — Stage reopening

**Wireframe:** `WF-CLINICAL-016` · **Platform:** Clinic / Doctor panel (Profile A) · **Runtime:** Filament panel
**Archetype:** form · **Density:** `operational` · **Classification:** New
**Actors:** Authorized treating dentist or governed reopening workflow
**Flows:** `FLOW-CLINICAL-006`
**Requirements:** `FR-CLINICAL-003`
**Data / action contract:** `SDC-CLINICAL-001`

**Purpose.** Let an authorized actor reopen a completed stage with a reason. Success is a recorded correction that leaves the prior completion intact. It exists because **the patient sees the reopened state**, so the reason must be safe to surface.

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | The case, the patient and the stage. |
| Required input | The prior completion, which remains historical. |
| Validation and consequence | The reason, which is required and which the patient will see. |
| Action | Reopen. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-CLINICAL-003` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`provider-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) `CMP-PLATFORM-013` (`decided-by-person`) `CMP-PLATFORM-014` (`irreversible`) |
| Patterns | `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-006` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-CLINICAL-001` | authorized case summary/timeline, treating relationship, plan versions, accepted snapshot, stages, required evidence/acknowledgements, follow-up state. | dentist creates/revises/proposes plan; authorized clinician records stage progress/evidence/completion; create amendment proposal; permitted staff record non-clinical case facts. |

- `SDC-CLINICAL-001` appends the reopening. **The prior completion remains historical and is never erased.**
- Missing-data behaviour: where the prior completion cannot be read, reopening is withheld, because the appended history would have no anchor.

**State**

- Lifecycle statuses visible: `REOPENED`
- Permission model: Authorized treating dentist, or the governed reopening workflow.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Reopen the stage | destructive | the actor is authorized and a reason is given | HIDDEN where the actor is not authorized to reopen |
| Back to the stage | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLINICAL-002`
- Lifecycle labels for every status above are owned by `TXT-STATE-CLINICAL-002` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-CLINICAL-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is stage context, prior completion, reason, action. The reason field carries a persistent visible label.
- Announcements: The committed reopening announces as a correction, with its reason, never as a reversal of history.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- The prior completion stays readable above the reason field at every content width.

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

1. A reason is required and is safe to surface to the patient.
2. The reopening appends and the prior completion remains readable.
3. The reopened state is presented as a recorded correction, not as an error.

**Traceability.** `SCR-CLINICAL-016` · `WF-CLINICAL-016` · flows `FLOW-CLINICAL-006` · widgets `WGT-CLINICAL-003` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` `CMP-PLATFORM-013` `CMP-PLATFORM-014` · patterns `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-006` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLINICAL-002` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-CLINICAL-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-AUDIT-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-CLINICAL-003` · contract `SDC-CLINICAL-001`

---

### SCR-CLINICAL-017 — Clinic follow-ups

**Wireframe:** `WF-CLINICAL-017` · **Platform:** Clinic / Doctor panel (Profile A) · **Runtime:** Filament panel
**Archetype:** list-and-detail · **Density:** `operational` · **Classification:** New
**Actors:** Treating dentist; authorized clinic staff; operations within scope
**Flows:** `FLOW-CLINICAL-007` `FLOW-OPS-002`
**Requirements:** `FR-CLINICAL-004`
**Data / action contract:** `SDC-CLINICAL-001`, `SDC-OPS-001`

**Purpose.** Show the clinic its due and overdue follow-ups. Success is a clinic that acts on the follow-ups that are due. It exists because **a failed delivery does not duplicate or discharge the obligation** and the clinical state is unaffected by delivery outcome.

**Hierarchy** — Phase 2 priority order, not reopened: context/filter > list > selected detail > state-aware action.

| Region | Contents |
|---|---|
| Context and filter | The provider and branch context, and the due filter. |
| List | One row per follow-up with its due or overdue state. |
| Selected detail | The case each follow-up belongs to. |
| State-aware action | Open the case. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`provider-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-006` (`table`) `CMP-PLATFORM-007` (`queue`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-CLINICAL-001` | authorized case summary/timeline, treating relationship, plan versions, accepted snapshot, stages, required evidence/acknowledgements, follow-up state. | dentist creates/revises/proposes plan; authorized clinician records stage progress/evidence/completion; create amendment proposal; permitted staff record non-clinical case facts. |
| `SDC-OPS-001` | work item ID/type, linked resource/case, lifecycle state, escalated flag, overdue flag, priority, due time, responsibility scope, blocking reason, assignment, safe summary. | claim/assign where allowed; start; move to waiting with a named blocking reason; resume; complete with outcome; escalate; reopen where policy permits. |

- `SDC-CLINICAL-001` and `SDC-OPS-001` project the follow-up set with its due state, derived from the accepted plan and the effective policy.
- Missing-data behaviour: a follow-up whose due state could not be computed is shown as unknown and never as not due.

**State**

- Lifecycle statuses visible: follow-up due and overdue state
- Permission model: Treating dentist; authorized clinic staff; operations within scope. Scoped to the actor's active provider and branch grants, enforced server-side. A scope revoked mid-shift removes the affected actions structurally and states the scope change; it never renders as an empty surface.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Open the case | primary | always | never unavailable |
| Filter by due state | secondary | always | never unavailable |

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
- Screen-reader hierarchy: Landmark order is context, filter, follow-up list. Each row announces its due state and its case.
- Announcements: A follow-up becoming overdue announces politely.
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

1. The due state derives from the accepted plan and the effective policy.
2. A failed delivery does not duplicate or discharge the obligation.
3. Overdue items may create operational work; the clinical state is unaffected by delivery outcome.
4. Filtered-empty and genuinely-empty read differently.

**Traceability.** `SCR-CLINICAL-017` · `WF-CLINICAL-017` · flows `FLOW-CLINICAL-007` `FLOW-OPS-002` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-006` `CMP-PLATFORM-007` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-CLINICAL-004` · contract `SDC-CLINICAL-001`, `SDC-OPS-001`

---

### SCR-FINANCE-006 — Case financial workspace

**Wireframe:** `WF-FINANCE-006` · **Platform:** Clinic / Doctor panel (Profile A) · **Runtime:** Filament panel
**Archetype:** workspace · **Density:** `dense` · **Classification:** New
**Actors:** Authorized clinic case party
**Flows:** `FLOW-FINANCE-001` `FLOW-FINANCE-003` `FLOW-FINANCE-004` `FLOW-FINANCE-007` `FLOW-FINANCE-008`
**Requirements:** `FR-FINANCE-001`, `FR-FINANCE-006`, `FR-FINANCE-005`
**Data / action contract:** `SDC-FINANCE-001`

**Purpose.** Give the clinic the case's financial position: the immutable snapshot plus append-only events. Success is a clinic that can see what was agreed and what has been asserted. **No edit or delete exists on any event.**

**Hierarchy** — Phase 2 priority order, not reopened: case/context > authoring workspace > totals/readiness > action.

| Region | Contents |
|---|---|
| Case and context | The case, the patient and the agreed position from the immutable snapshot. |
| Authoring workspace | Events in order with what was asserted, by whom, when, its amount and its state. |
| Totals and readiness | The derived current position, shown as derived. |
| Action | Report a payment, respond to an event, or report a refund execution. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-CLINICAL-002` `WGT-FINANCE-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-006` `WGT-PLATFORM-010` |
| Components | `CMP-CLINICAL-001` (`authoring`) `CMP-ELIG-002` (`governed display mode from the provider price fact`) `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`provider-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-006` (`embedded`) `CMP-PLATFORM-008` (`record`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) |
| Patterns | `IX-CLINICAL-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-FINANCE-001` | immutable financial terms snapshot, ordered external financial events, derived confirmed/disputed/pending states, evidence metadata, related work items. | report external payment/refund/compensation event; confirm/dispute when actor is authorized; create correction/reversal event; finance reviewer resolves assigned record-review work. |

- `SDC-FINANCE-001` projects the immutable snapshot plus the append-only events and the derived position.
- Missing-data behaviour: if any event failed to load, **no derived position renders** and the gap is named.

**State**

- Lifecycle statuses visible: `REPORTED_UNCONFIRMED`, `CONFIRMED`, `DISPUTED`; agreed, refunded and pending-external-execution values
- Permission model: Authorized clinic case party. Scoped to the actor's active provider and branch grants, enforced server-side. A scope revoked mid-shift removes the affected actions structurally and states the scope change; it never renders as an empty surface.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Report a payment | primary | the actor is an authorized case party | HIDDEN otherwise |
| Respond to an event | primary | an event awaits the clinic as counterparty | absent where none does |
| Report a refund execution | secondary | an approved refund decision exists | absent until one does |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-013` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-FINANCE-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-FINANCE-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.
- No pay, wallet, balance, transfer or platform-refund affordance exists on this surface, and no wording suggests UberTib holds or moves money. Recording a financial fact is an assertion between the parties, not a settlement.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-FINANCE-001` `A11Y-CLINICAL-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the authoring region, after the case context has been announced.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is agreed position, event list, derived position, actions. Every amount announces with its currency and its state.
- Announcements: A new event appends and announces politely; the derived position announces once.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- `dense` at `.wide`; at `.narrow` each event stacks with its amount adjacent to its state, and no amount column is truncated.

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

Not applicable here: `empty-filtered`. The event set is scoped to one case rather than filtered.

**Acceptance criteria**

1. **No edit or delete affordance exists on any event.**
2. A partial event read renders no derived position and names the gap.
3. Agreed, reported, confirmed, disputed, refunded and pending external execution are six visibly distinct states.
4. No pay, wallet, balance, transfer or platform-refund affordance exists on this surface, and no wording suggests UberTib holds or moves money. Recording a financial fact is an assertion between the parties, not a settlement.

**Traceability.** `SCR-FINANCE-006` · `WF-FINANCE-006` · flows `FLOW-FINANCE-001` `FLOW-FINANCE-003` `FLOW-FINANCE-004` `FLOW-FINANCE-007` `FLOW-FINANCE-008` · widgets `WGT-CLINICAL-002` `WGT-FINANCE-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-006` `WGT-PLATFORM-010` · components `CMP-CLINICAL-001` `CMP-ELIG-002` `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-006` `CMP-PLATFORM-008` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` · patterns `IX-CLINICAL-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-013` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-FINANCE-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-FINANCE-001` `A11Y-CLINICAL-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-AUDIT-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-FINANCE-001`, `FR-FINANCE-006`, `FR-FINANCE-005` · contract `SDC-FINANCE-001`

---

### SCR-FINANCE-007 — Report payment

**Wireframe:** `WF-FINANCE-007` · **Platform:** Clinic / Doctor panel (Profile A) · **Runtime:** Filament panel
**Archetype:** form · **Density:** `operational` · **Classification:** New
**Actors:** Authorized clinic case party
**Flows:** `FLOW-FINANCE-003`
**Requirements:** `FR-FINANCE-002`, `FR-FINANCE-005`
**Data / action contract:** `SDC-FINANCE-001`

**Purpose.** Let the clinic record a payment it received outside the platform. Success is one appended assertion the patient will confirm or dispute. It exists so the clinic understands that **recording is an assertion, not a settled fact**.

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | The case and the governing terms snapshot. |
| Required input | Amount, currency, external method category and occurrence time. |
| Validation and consequence | That the patient becomes the counterparty who confirms or disputes. |
| Action | Record the payment. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-010` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`provider-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-FINANCE-001` | immutable financial terms snapshot, ordered external financial events, derived confirmed/disputed/pending states, evidence metadata, related work items. | report external payment/refund/compensation event; confirm/dispute when actor is authorized; create correction/reversal event; finance reviewer resolves assigned record-review work. |

- `SDC-FINANCE-001` records the event with idempotency. Exactly one event per identical command.
- Missing-data behaviour: where the governing terms cannot be read, recording is withheld and the screen says why.

**State**

- Lifecycle statuses visible: `REPORTED_UNCONFIRMED`
- Permission model: Authorized clinic case party.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Record the payment | primary | the fields are complete and no commit is in flight | DISABLED while a commit is in flight |
| Cancel | secondary | always before commit | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-FINANCE-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-FINANCE-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.
- No pay, wallet, balance, transfer or platform-refund affordance exists on this surface, and no wording suggests UberTib holds or moves money. Recording a financial fact is an assertion between the parties, not a settlement.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-FINANCE-001` | a financial event that conflicts with the governing terms or the existing event history | `TXT-ERR-FINANCE-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is case and terms context, fields, consequence, action.
- Announcements: The committed event announces and focus moves to it in the ledger.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- Amount and currency stay adjacent at every content width.

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

1. A conflict with the governing terms reads as a conflict, **never as a failed payment**.
2. Exactly one event is created per identical command.
3. The screen states that the patient confirms or disputes what is recorded.
4. No pay, wallet, balance, transfer or platform-refund affordance exists on this surface, and no wording suggests UberTib holds or moves money. Recording a financial fact is an assertion between the parties, not a settlement.

**Traceability.** `SCR-FINANCE-007` · `WF-FINANCE-007` · flows `FLOW-FINANCE-003` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-010` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-FINANCE-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-AUDIT-001` `ERR-FINANCE-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-FINANCE-002`, `FR-FINANCE-005` · contract `SDC-FINANCE-001`

---

### SCR-FINANCE-008 — Event response

**Wireframe:** `WF-FINANCE-008` · **Platform:** Clinic / Doctor panel (Profile A) · **Runtime:** Filament panel
**Archetype:** form · **Density:** `operational` · **Classification:** New
**Actors:** Authorized clinic counterparty
**Flows:** `FLOW-FINANCE-004`
**Requirements:** `FR-FINANCE-003`, `FR-FINANCE-005`
**Data / action contract:** `SDC-FINANCE-001`

**Purpose.** Let the clinic confirm or dispute a financial event the patient asserted. Success is an appended response. It exists because **a response appends and never edits the original**.

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | The asserted event. |
| Required input | Confirm or dispute, with the reason required on dispute. |
| Validation and consequence | That disputing routes to finance review. |
| Action | Commit the response. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`provider-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) `CMP-PLATFORM-014` (`irreversible`) |
| Patterns | `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-FINANCE-001` | immutable financial terms snapshot, ordered external financial events, derived confirmed/disputed/pending states, evidence metadata, related work items. | report external payment/refund/compensation event; confirm/dispute when actor is authorized; create correction/reversal event; finance reviewer resolves assigned record-review work. |

- `SDC-FINANCE-001` appends the response with idempotency. It also handles refund-execution responses.
- Missing-data behaviour: where the original assertion could not be read, no response control is offered.

**State**

- Lifecycle statuses visible: `CONFIRMED` or `DISPUTED` after
- Permission model: Authorized clinic counterparty.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Confirm this event | primary | the event awaits the clinic as counterparty | absent once a response has been appended |
| Dispute this event | destructive | the event awaits the clinic as counterparty | absent once a response has been appended. A reason is required |
| Back to the workspace | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-FINANCE-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-FINANCE-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.
- No pay, wallet, balance, transfer or platform-refund affordance exists on this surface, and no wording suggests UberTib holds or moves money. Recording a financial fact is an assertion between the parties, not a settlement.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-FINANCE-001` | a financial event that conflicts with the governing terms or the existing event history | `TXT-ERR-FINANCE-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is the asserted event, the two responses, the consequence, the action.
- Announcements: The appended response announces and focus moves to the updated event.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- One column at `.narrow` with the consequence between the event and the actions.

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

Not applicable here: `empty-no-data` `empty-filtered`. A single-event response has no list and no filter.

**Acceptance criteria**

1. The consequence of disputing is evident before committing.
2. A dispute requires a reason and appends rather than editing.
3. The original assertion remains readable after any response.
4. No pay, wallet, balance, transfer or platform-refund affordance exists on this surface, and no wording suggests UberTib holds or moves money. Recording a financial fact is an assertion between the parties, not a settlement.

**Traceability.** `SCR-FINANCE-008` · `WF-FINANCE-008` · flows `FLOW-FINANCE-004` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` `CMP-PLATFORM-014` · patterns `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-FINANCE-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-AUDIT-001` `ERR-FINANCE-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-FINANCE-003`, `FR-FINANCE-005` · contract `SDC-FINANCE-001`

---

### SCR-FINANCE-009 — Report refund execution

**Wireframe:** `WF-FINANCE-009` · **Platform:** Clinic / Doctor panel (Profile A) · **Runtime:** Filament panel
**Archetype:** form · **Density:** `operational` · **Classification:** New
**Actors:** Authorized clinic asserting party
**Flows:** `FLOW-FINANCE-006` `FLOW-FINANCE-008`
**Requirements:** `FR-FINANCE-004`, `FR-FINANCE-007`
**Data / action contract:** `SDC-FINANCE-001`

**Purpose.** Let the clinic assert that an approved refund was executed outside the platform. Success is an appended assertion awaiting the counterparty. **No platform refund exists** and the copy must not imply the platform executed anything.

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | The approved refund decision, with its exact amount and currency. |
| Required input | The assertion fields. |
| Validation and consequence | That this remains an assertion until the counterparty responds. |
| Action | Record the execution. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`provider-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) `CMP-PLATFORM-014` (`irreversible`) |
| Patterns | `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-FINANCE-001` | immutable financial terms snapshot, ordered external financial events, derived confirmed/disputed/pending states, evidence metadata, related work items. | report external payment/refund/compensation event; confirm/dispute when actor is authorized; create correction/reversal event; finance reviewer resolves assigned record-review work. |

- `SDC-FINANCE-001` records the assertion against the approved refund decision with idempotency.
- Missing-data behaviour: where the approved decision cannot be read, the assertion is withheld.

**State**

- Lifecycle statuses visible: `REPORTED_UNCONFIRMED`
- Permission model: Authorized clinic asserting party.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Record the refund execution | primary | an approved refund decision exists | absent where none does |
| Cancel | secondary | always before commit | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-FINANCE-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-FINANCE-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.
- No pay, wallet, balance, transfer or platform-refund affordance exists on this surface, and no wording suggests UberTib holds or moves money. Recording a financial fact is an assertion between the parties, not a settlement.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-FINANCE-001` | a financial event that conflicts with the governing terms or the existing event history | `TXT-ERR-FINANCE-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is referenced decision, assertion fields, consequence, action.
- Announcements: The appended assertion announces and focus moves to it.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- The referenced amount and the asserted amount stay adjacent at every content width.

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

1. The assertion references an approved refund decision with its exact amount and currency.
2. It remains an assertion until the counterparty responds.
3. **No platform refund is executed and no copy implies otherwise.**
4. No pay, wallet, balance, transfer or platform-refund affordance exists on this surface, and no wording suggests UberTib holds or moves money. Recording a financial fact is an assertion between the parties, not a settlement.

**Traceability.** `SCR-FINANCE-009` · `WF-FINANCE-009` · flows `FLOW-FINANCE-006` `FLOW-FINANCE-008` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-007` `WGT-PLATFORM-010` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` `CMP-PLATFORM-014` · patterns `IX-AUDIT-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` `IX-PLATFORM-018` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-012` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-FINANCE-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-002` `A11Y-PLATFORM-007` `A11Y-PLATFORM-014` `A11Y-AUDIT-001` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-AUDIT-001` `ERR-FINANCE-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-FINANCE-004`, `FR-FINANCE-007` · contract `SDC-FINANCE-001`

---

### SCR-REVIEWS-005 — Provider reviews

**Wireframe:** `WF-REVIEWS-005` · **Platform:** Clinic / Doctor panel (Profile A) · **Runtime:** Filament panel
**Archetype:** list-and-detail · **Density:** `operational` · **Classification:** New
**Actors:** Clinic / provider representative; Treating dentist within scope
**Flows:** `FLOW-REVIEWS-002` `FLOW-REVIEWS-005`
**Requirements:** `FR-REVIEWS-001`
**Data / action contract:** `SDC-REVIEWS-001`

**Purpose.** Show the provider its verified reviews, read-only, with appeal windows visible before they close. Success is a provider that appeals in time where policy allows. It exists to convey that **the verified rating is independent of scientific eligibility**, so a poor review does not read as an eligibility threat.

**Hierarchy** — Phase 2 priority order, not reopened: context/filter > list > selected detail > state-aware action.

| Region | Contents |
|---|---|
| Context and filter | The provider and branch context, and the state filter. |
| List | One row per review with its state and its appeal window. |
| Selected detail | That the rating is independent of scientific eligibility. |
| State-aware action | Appeal, where the window permits. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` `WGT-PLATFORM-006` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`provider-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-006` (`table`) `CMP-PLATFORM-007` (`queue`) `CMP-PLATFORM-008` (`record`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-REVIEWS-001` | eligible review summary, verified-experience linkage, publication/moderation state, appeal window/status, safe evidence metadata, reviewer work state. | provider submits eligible appeal; reviewer processes assigned integrity/appeal work with reasons. |

- `SDC-REVIEWS-001` projects the reviews with their states and appeal windows.
- Missing-data behaviour: a review whose appeal window could not be read shows the window as unavailable rather than as closed.

**State**

- Lifecycle statuses visible: review `ACTIVE`, `RETIRED`; appeal window and status
- Permission model: Clinic or provider representative; treating dentist within scope. **Read-only: the clinic cannot edit a rating or its text.**

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Appeal a review | primary | the appeal window is open | UNAVAILABLE once the window closes, with the window stated |
| Filter by state | secondary | always | never unavailable |

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
- Screen-reader hierarchy: Landmark order is context, filter, review list. Each row announces its state and its remaining appeal window.
- Announcements: An appeal window entering its approaching state announces politely.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- A table at `.wide` degrading to the reading-list shape at `.narrow`; the review text wraps and never truncates.

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

1. **The clinic cannot edit a rating or its text from any control on this screen.**
2. The screen conveys that the verified rating is independent of scientific eligibility.
3. Appeal windows are visible before they close.
4. Filtered-empty and genuinely-empty read differently.

**Traceability.** `SCR-REVIEWS-005` · `WF-REVIEWS-005` · flows `FLOW-REVIEWS-002` `FLOW-REVIEWS-005` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` `WGT-PLATFORM-006` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-006` `CMP-PLATFORM-007` `CMP-PLATFORM-008` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-REVIEWS-001` `TXT-STATE-REVIEWS-002` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` `ERR-REVIEWS-001` · requirements `FR-REVIEWS-001` · contract `SDC-REVIEWS-001`

---

### SCR-REVIEWS-006 — Review appeal

**Wireframe:** `WF-REVIEWS-006` · **Platform:** Clinic / Doctor panel (Profile A) · **Runtime:** Filament panel
**Archetype:** detail · **Density:** `operational` · **Classification:** New
**Actors:** Authorized clinic / provider appellant
**Flows:** `FLOW-REVIEWS-002` `FLOW-REVIEWS-005`
**Requirements:** `FR-REVIEWS-002`
**Data / action contract:** `SDC-REVIEWS-001`

**Purpose.** Let the provider appeal a review on eligibility and policy-compliance grounds only. Success is an appeal written inside its scope. It exists because **the appeal cannot change rating content**, and the form must make that boundary obvious so it is not written as a rebuttal of the opinion.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The review being appealed. |
| Primary facts | **The scope of an appeal, stated before anything is written**: eligibility and policy compliance only. |
| Related history | The policy-grounded reason and any evidence. |
| Action | Submit the appeal. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`operator`) `CMP-PLATFORM-003` (`provider-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-013` (`decided-by-person`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-REVIEWS-001` | eligible review summary, verified-experience linkage, publication/moderation state, appeal window/status, safe evidence metadata, reviewer work state. | provider submits eligible appeal; reviewer processes assigned integrity/appeal work with reasons. |

- `SDC-REVIEWS-001` records the appellant, the review, the policy-grounded reason, the evidence and the time.
- Missing-data behaviour: where the review or its governing window cannot be read, the form is withheld.

**State**

- Lifecycle statuses visible: appeal `SUBMITTED`, `DECIDED`
- Permission model: Authorized clinic or provider appellant.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Submit the appeal | primary | the appeal window is open and a policy-grounded reason is given | UNAVAILABLE outside the window, with the window stated |
| Back to provider reviews | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-REVIEWS-002`
- Lifecycle labels for every status above are owned by `TXT-STATE-REVIEWS-002` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |
| `ERR-REVIEWS-001` | a review or appeal that is ineligible, already active, or outside its window | `TXT-ERR-REVIEWS-001` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the status and identity region.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is the review, the scope statement, the form, the action. The scope statement is read before the reason field is reached.
- Announcements: The committed appeal announces and focus moves to the appeal state.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- The scope statement is never collapsed behind a disclosure.

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

1. The scope boundary is obvious before the appellant writes anything.
2. **The appeal cannot change rating content and the form says so.**
3. Appellant, review, reason, evidence and time are all recorded.

**Traceability.** `SCR-REVIEWS-006` · `WF-REVIEWS-006` · flows `FLOW-REVIEWS-002` `FLOW-REVIEWS-005` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` · components `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-013` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-REVIEWS-002` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` `ERR-REVIEWS-001` · requirements `FR-REVIEWS-002` · contract `SDC-REVIEWS-001`

---

### SCR-CLAIMS-006 — Clinic claims

**Wireframe:** `WF-CLAIMS-006` · **Platform:** Clinic / Doctor panel (Profile A) · **Runtime:** Filament panel
**Archetype:** list-and-detail · **Density:** `operational` · **Classification:** New
**Actors:** Authorized clinic case party
**Flows:** `FLOW-CLAIMS-004` `FLOW-CLAIMS-009`
**Requirements:** `FR-CLAIMS-001`, `FR-CLAIMS-002`
**Data / action contract:** `SDC-CLAIMS-001`

**Purpose.** Show the clinic the claims it is genuinely a party to. Success is a clinic that responds before the deadline. It exists because **this is the same claim the patient and Admin see**: no duplicate clinic-side record exists.

**Hierarchy** — Phase 2 priority order, not reopened: context/filter > list > selected detail > state-aware action.

| Region | Contents |
|---|---|
| Context and filter | The provider and branch context, and the state filter. |
| List | One row per claim with its state, its deadlines and the items assigned to the clinic. |
| Selected detail | The selected claim. |
| State-aware action | Respond. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`provider-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-006` (`table`) `CMP-PLATFORM-007` (`queue`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-CLAIMS-001` | claim/refund type, case linkage, governing snapshots, evidence states, deadlines/extensions, party responses, decision/appeal history, external-execution state where applicable. | clinic submits allowed evidence/response/appeal; reviewer requests evidence, records reasoned decision, handles eligible appeal according to separation of duties. |

- `SDC-CLAIMS-001` projects the claims scoped to the clinic's participation, with the items assigned to it.
- Missing-data behaviour: a claim whose effective deadline did not load says so and is never rendered as having none.

**State**

- Lifecycle statuses visible: claim state; deadlines; items assigned to the clinic
- Permission model: Authorized clinic case party. Scoped to claims where the clinic is genuinely a party.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Respond to a claim | primary | the claim awaits the clinic and its deadline has not lapsed | UNAVAILABLE once the effective deadline lapses |
| Filter by state | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLAIMS-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-CLAIMS-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

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
- Screen-reader hierarchy: Landmark order is context, filter, claim list. Each row announces its state, its deadline and its outstanding items.
- Announcements: A deadline entering its approaching window announces politely.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- A table at `.wide` degrading to the reading-list shape at `.narrow`; the deadline never truncates.

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

1. **No duplicate clinic-side claim record exists**; this is the same claim the other parties see.
2. The list is scoped to claims where the clinic is genuinely a party.
3. Deadlines are visible in the list.
4. Filtered-empty and genuinely-empty read differently.

**Traceability.** `SCR-CLAIMS-006` · `WF-CLAIMS-006` · flows `FLOW-CLAIMS-004` `FLOW-CLAIMS-009` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-006` `CMP-PLATFORM-007` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLAIMS-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-CLAIMS-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-CLAIMS-001`, `FR-CLAIMS-002` · contract `SDC-CLAIMS-001`

---

### SCR-CLAIMS-007 — Claim response and evidence

**Wireframe:** `WF-CLAIMS-007` · **Platform:** Clinic / Doctor panel (Profile A) · **Runtime:** Filament panel
**Archetype:** form · **Density:** `operational` · **Classification:** New
**Actors:** Authorized clinic case party
**Flows:** `FLOW-CLAIMS-004` `FLOW-CLAIMS-007` `FLOW-FINANCE-006` `FLOW-OPS-002` `FLOW-PLATFORM-001`
**Requirements:** `FR-CLAIMS-003`
**Data / action contract:** `SDC-CLAIMS-001`

**Purpose.** Let the clinic respond to a claim and supply only the requirements assigned to it. Success is a complete clinic response before the effective deadline. It exists because **the clinic never sees the patient's private evidence**, and deadline pauses and extensions append rather than replace.

**Hierarchy** — Phase 2 priority order, not reopened: context > required input > validation/consequence > action.

| Region | Contents |
|---|---|
| Context | The claim, the case and the provider context. |
| Required input | The requirements assigned to the clinic, each with its state and reason. |
| Validation and consequence | The original and the effective deadline, with the appended events that moved it. |
| Action | Supply evidence, or submit the response. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-CLAIMS-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-006` `WGT-PLATFORM-008` `WGT-PLATFORM-010` `WGT-PLATFORM-011` `WGT-PLATFORM-014` |
| Components | `CMP-CLINICAL-002` (`version`) `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`provider-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-006` (`embedded`) `CMP-PLATFORM-008` (`record`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-011` (`inline`) `CMP-PLATFORM-012` (`intake`) |
| Patterns | `IX-BOOKING-001` `IX-CLINICAL-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-005` `IX-PLATFORM-006` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-009` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` `IX-PLATFORM-018` `IX-POLICY-002` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-CLAIMS-001` | claim/refund type, case linkage, governing snapshots, evidence states, deadlines/extensions, party responses, decision/appeal history, external-execution state where applicable. | clinic submits allowed evidence/response/appeal; reviewer requests evidence, records reasoned decision, handles eligible appeal according to separation of duties. |

- `SDC-CLAIMS-001` projects the clinic-assigned requirements, the deadline history and the claim state. **Appends to the same claim.**
- **Transfer is bounded by the vendor decision in `Q-OPS-001`.**
- Missing-data behaviour: a requirement whose state did not load is never counted as satisfied and submission stays unavailable naming it.

**State**

- Lifecycle statuses visible: claim state; per-item evidence state; effective deadline and its history
- Permission model: Authorized clinic case party. **Only requirements assigned to the clinic are projected**; the patient's private evidence is not in this projection at all.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Supply evidence | primary | a requirement assigned to the clinic is outstanding | absent once every assigned requirement is satisfied |
| Submit the response | primary | the assigned requirements are satisfied and the effective deadline has not lapsed | UNAVAILABLE once the deadline lapses |
| Save and continue later | secondary | a draft response exists | never unavailable |
| Appeal the decision | secondary | a decision exists and the appeal window is open | absent until a decision exists |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-014` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLAIMS-001` `TXT-STATE-PLATFORM-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-CLAIMS-001` `TXT-STATE-PLATFORM-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-AUDIT-001` | a retry that reuses an idempotency key with a materially different payload | `TXT-ERR-AUDIT-001` |
| `ERR-CLAIMS-001` | a claim, refund request or appeal that is ineligible or outside its policy window | `TXT-ERR-CLAIMS-001` |
| `ERR-CLAIMS-002` | a claim submission or response whose required evidence is incomplete or invalid | `TXT-ERR-CLAIMS-002` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-001` | any command this screen issues, when the payload fails field, format, enumeration or safe business-input validation | `TXT-ERR-PLATFORM-001` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |
| `ERR-PLATFORM-005` | an evidence item that failed validation or was rejected authoritatively | `TXT-ERR-PLATFORM-005` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-028` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-034` `A11Y-POLICY-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the first input in the required-input region, after the context region has been announced.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is claim context, deadline pair, assigned requirements, actions. The deadline pair announces as original and effective.
- Announcements: Evidence progress announces at intervals. A deadline event announces politely and the pair recomputes.
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

Not applicable here: `empty-filtered`. The requirement set is governed and party-scoped rather than filtered.

**Acceptance criteria**

1. **The clinic surface never renders the patient's private evidence.**
2. Both the original and the effective deadline are visible, with the appended events that moved it.
3. Responses append to the same claim; no duplicate record is created.
4. A retryable transfer failure and an authoritative rejection are structurally distinct.

**Traceability.** `SCR-CLAIMS-007` · `WF-CLAIMS-007` · flows `FLOW-CLAIMS-004` `FLOW-CLAIMS-007` `FLOW-FINANCE-006` `FLOW-OPS-002` `FLOW-PLATFORM-001` · widgets `WGT-CLAIMS-001` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-005` `WGT-PLATFORM-006` `WGT-PLATFORM-008` `WGT-PLATFORM-010` `WGT-PLATFORM-011` `WGT-PLATFORM-014` · components `CMP-CLINICAL-002` `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-006` `CMP-PLATFORM-008` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-011` `CMP-PLATFORM-012` · patterns `IX-BOOKING-001` `IX-CLINICAL-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-005` `IX-PLATFORM-006` `IX-PLATFORM-007` `IX-PLATFORM-008` `IX-PLATFORM-009` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-015` `IX-PLATFORM-016` `IX-PLATFORM-017` `IX-PLATFORM-018` `IX-POLICY-002` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-003` `TXT-PLATFORM-004` `TXT-PLATFORM-005` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-014` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLAIMS-001` `TXT-STATE-PLATFORM-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-026` `A11Y-PLATFORM-027` `A11Y-PLATFORM-019` `A11Y-PLATFORM-021` `A11Y-PLATFORM-028` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-006` `A11Y-PLATFORM-011` `A11Y-PLATFORM-034` `A11Y-POLICY-001` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-AUDIT-001` `ERR-CLAIMS-001` `ERR-CLAIMS-002` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-001` `ERR-PLATFORM-002` `ERR-PLATFORM-004` `ERR-PLATFORM-005` · requirements `FR-CLAIMS-003` · contract `SDC-CLAIMS-001`

---

### SCR-CLAIMS-008 — Clinic claim appeal

**Wireframe:** `WF-CLAIMS-008` · **Platform:** Clinic / Doctor panel (Profile A) · **Runtime:** Filament panel
**Archetype:** detail · **Density:** `operational` · **Classification:** New
**Actors:** Authorized clinic case party where the appeal window permits
**Flows:** `FLOW-CLAIMS-007` `FLOW-CLAIMS-009`
**Requirements:** `FR-CLAIMS-005`
**Data / action contract:** `SDC-CLAIMS-001`

**Purpose.** Let the clinic appeal a claim decision under the policy snapshot that governed it. Success is a submitted appeal within the historical window. It exists because **separation of duties governs who reviews it and the clinic cannot self-adjudicate**.

**Hierarchy** — Phase 2 priority order, not reopened: status/identity > primary facts > related history > action.

| Region | Contents |
|---|---|
| Status and identity | The original decision, which remains intact. |
| Primary facts | The governing policy snapshot and the historical appeal window. |
| Related history | That an independent reviewer decides it under separation of duties. |
| Action | Submit the appeal. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-002` (`operator`) `CMP-PLATFORM-003` (`provider-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) `CMP-PLATFORM-013` (`decided-by-person`) |
| Patterns | `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-CLAIMS-001` | claim/refund type, case linkage, governing snapshots, evidence states, deadlines/extensions, party responses, decision/appeal history, external-execution state where applicable. | clinic submits allowed evidence/response/appeal; reviewer requests evidence, records reasoned decision, handles eligible appeal according to separation of duties. |

- `SDC-CLAIMS-001` submits the appeal against the policy snapshot that governed the original decision.
- Missing-data behaviour: where the governing snapshot cannot be read, the window cannot be computed and the form is withheld.

**State**

- Lifecycle statuses visible: appeal `SUBMITTED`, `UNDER_REVIEW`, `DECIDED`
- Permission model: Authorized clinic case party where the appeal window permits. **The clinic cannot self-adjudicate.**

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Submit the appeal | primary | the historical appeal window is open | UNAVAILABLE once the window has expired |
| Back to the claim | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLAIMS-001` `TXT-STATE-CLAIMS-002` `TXT-STATE-REVIEWS-002`
- Lifecycle labels for every status above are owned by `TXT-STATE-CLAIMS-001` `TXT-STATE-CLAIMS-002` `TXT-STATE-REVIEWS-002` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-CLAIMS-001` | a claim, refund request or appeal that is ineligible or outside its policy window | `TXT-ERR-CLAIMS-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the status and identity region.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is the original decision, the governing window, the independence statement, the form, the action.
- Announcements: The committed appeal announces and focus moves to the appeal state.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- The original decision stays readable above the form at every content width.

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

1. The appeal window comes from the policy snapshot governing the original decision.
2. The original decision remains intact throughout.
3. **Separation of duties governs who reviews it, and the clinic cannot self-adjudicate.**

**Traceability.** `SCR-CLAIMS-008` · `WF-CLAIMS-008` · flows `FLOW-CLAIMS-007` `FLOW-CLAIMS-009` · widgets `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` · components `CMP-PLATFORM-001` `CMP-PLATFORM-002` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-009` `CMP-PLATFORM-010` `CMP-PLATFORM-013` · patterns `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-CLAIMS-001` `TXT-STATE-CLAIMS-002` `TXT-STATE-REVIEWS-002` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-CLAIMS-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-CLAIMS-005` · contract `SDC-CLAIMS-001`

---

### SCR-BOOKING-017 — Reschedule proposals

**Wireframe:** `WF-BOOKING-017` · **Platform:** Clinic / Doctor panel (Profile A) · **Runtime:** Filament panel
**Archetype:** list-and-detail · **Density:** `operational` · **Classification:** New
**Actors:** Authorized clinic/provider representative within exact provider and branch scope — per `PERMISSIONS_MATRIX` section 9
**Flows:** `FLOW-BOOKING-013` `FLOW-BOOKING-014`
**Requirements:** `FR-BOOKING-004`
**Data / action contract:** `SDC-BOOKING-002`

**Purpose.** Show the clinic every reschedule proposal on its bookings, with the still-authoritative original readable without opening anything. Success is a front desk that never tells a patient the wrong time. **Front-desk work is interruption-heavy**, which is why the original, the proposal and the deadline are all in the row.

**Hierarchy** — Phase 2 priority order, not reopened: context/filter > list > selected detail > state-aware action.

| Region | Contents |
|---|---|
| Context and filter | The provider and branch context, and the state filter. |
| List | One row per proposal showing the original slot as the appointment and the proposed slot as a proposal, with the deadline. |
| Selected detail | The selected proposal. |
| State-aware action | Accept or decline as the counterparty; withdraw the clinic's own. |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-BOOKING-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` |
| Components | `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`provider-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-006` (`table`) `CMP-PLATFORM-007` (`queue`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-BOOKING-001` `IX-BOOKING-002` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-BOOKING-002` | confirmed bookings eligible for reschedule, any existing `PENDING` proposal with its initiator/proposed slot/response deadline, the **unchanged** current booking slot, available target slots, reschedule history. | propose a reschedule; respond to a patient-initiated proposal by accepting or declining; withdraw the clinic's own pending proposal. |

- `SDC-BOOKING-002` projects the proposals alongside the still-authoritative booking state.
- **The original slot stays presented as the appointment until acceptance commits.**
- Missing-data behaviour: a row whose original slot could not be read offers no decision control and says the current appointment could not be read.

**State**

- Lifecycle statuses visible: proposal `PENDING`, `ACCEPTED`, `DECLINED`, `EXPIRED`, `WITHDRAWN`; booking `CONFIRMED`
- Permission model: Authorized clinic or provider representative within the exact provider and branch scope.

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Accept the proposal | primary | the proposal is the patient's and is pending | HIDDEN on the clinic's own proposal, because **a clinic party cannot accept its own** |
| Decline the proposal | secondary | the proposal is the patient's and is pending | HIDDEN on the clinic's own proposal |
| Withdraw our proposal | secondary | the clinic's own proposal is pending | HIDDEN on the patient's proposal |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-BOOKING-001` `TXT-STATE-BOOKING-002` `TXT-STATE-PLATFORM-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-BOOKING-001` `TXT-STATE-BOOKING-002` `TXT-STATE-PLATFORM-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-BOOKING-002` | a booking command that the record's current state does not permit | `TXT-ERR-BOOKING-002` |
| `ERR-BOOKING-003` | a booking or provider-response command issued after its deadline lapsed | `TXT-ERR-BOOKING-003` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the filter or search control where one exists, otherwise the first row.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is context, filter, proposal list. Each row announces original slot, proposed slot and deadline, each labelled.
- Announcements: An acceptance elsewhere announces politely and the row recomputes to the new authoritative pair.
- Right-to-left and bidirectional: The original occupies the logical start position in both directions. Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- At `.wide` the pair sits side by side with the original at the logical start; at `.narrow` the row stacks with the original first. Neither slot truncates.

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

1. The pending proposal, its deadline and the still-authoritative original are all readable without opening anything further.
2. **No generic edit of date, provider or service is offered anywhere on this screen.**
3. A clinic party cannot accept its own proposal.
4. The original stays presented as the appointment until acceptance commits.

**Traceability.** `SCR-BOOKING-017` · `WF-BOOKING-017` · flows `FLOW-BOOKING-013` `FLOW-BOOKING-014` · widgets `WGT-BOOKING-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` · components `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-006` `CMP-PLATFORM-007` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-BOOKING-001` `IX-BOOKING-002` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-BOOKING-001` `TXT-STATE-BOOKING-002` `TXT-STATE-PLATFORM-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-BOOKING-002` `ERR-BOOKING-003` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-BOOKING-004` · contract `SDC-BOOKING-002`

---

### SCR-ELIG-021 — Bookings on eligibility hold

**Wireframe:** `WF-ELIG-021` · **Platform:** Clinic / Doctor panel (Profile A) · **Runtime:** Filament panel
**Archetype:** list-and-detail · **Density:** `operational` · **Classification:** New
**Actors:** Authorized clinic/provider representative within provider and branch scope
**Flows:** `FLOW-ELIG-015`
**Requirements:** `FR-ELIG-003`, `FR-BOOKING-002`
**Data / action contract:** `SDC-ELIG-003`, `SDC-BOOKING-001`

**Purpose.** Show the clinic which of its bookings are held by an eligibility suspension, and route to the cause. Success is a clinic acting on the cause rather than the symptom. **Start and complete are absent, not disabled**: the appointment is not attendable while the suspension stands.

**Hierarchy** — Phase 2 priority order, not reopened: context/filter > list > selected detail > state-aware action.

| Region | Contents |
|---|---|
| Context and filter | The provider and branch context, and the owning suspended scope. |
| List | One row per held booking with its review due time. |
| Selected detail | The controlling dependency. |
| State-aware action | Resolve the dependency. **No attendance action of any kind is offered.** |

**Composition**

| Kind | Binding |
|---|---|
| Widgets | `WGT-ELIG-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` |
| Components | `CMP-ELIG-003` (`provider`) `CMP-PLATFORM-001` (`emphasis resolved from the state channel; no surface picks one`) `CMP-PLATFORM-003` (`provider-scope`) `CMP-PLATFORM-004` (`page`) `CMP-PLATFORM-005` (`window state resolved from the deadline itself`) `CMP-PLATFORM-006` (`table`) `CMP-PLATFORM-007` (`queue`) `CMP-PLATFORM-009` (`no-data`) `CMP-PLATFORM-010` (`fetch-failure`) |
| Patterns | `IX-ELIG-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` |

**Data**

| Contract | Read projection | Write payload |
|---|---|---|
| `SDC-ELIG-003` | service + branch scope, current practical eligibility state, safe scientific-grade meaning where allowed, price/protection meaning, last evaluation time, actionable blockers, evidence/fact items requiring provider action, reevaluation/work status. Raw internal `I` is excluded. | navigate to source-fact/evidence correction actions only; no outcome override. |
| `SDC-BOOKING-001` | scoped booking requests, service, patient-safe identity/context, branch, requested slot, response deadline, current booking state, alternative proposal if any, capacity/readiness summary. | accept; reject with reason; propose alternative; cancel when policy/state permits; record no-show after threshold. |

- `SDC-ELIG-003` and `SDC-BOOKING-001` project the held bookings with the owning suspended scope and the review due time.
- Missing-data behaviour: a booking whose review due time did not load says so and is never rendered as having none, because that time is never later than a fixed window before the appointment.

**State**

- Lifecycle statuses visible: booking `ELIGIBILITY_REVIEW`; the owning eligibility scope's `SUSPENDED` state
- Permission model: Scoped to the actor's active provider and branch grants, enforced server-side. A scope revoked mid-shift removes the affected actions structurally and states the scope change; it never renders as an empty surface. **The surface offers no override, because none exists at any role.**

**Actions**

| Action | Role | Available when | When not available |
|---|---|---|---|
| Open the controlling blocker | primary | the dependency has an owning action | absent where the dependency is resolved elsewhere |
| Open the booking | secondary | always | never unavailable |

**Content**

- Rules bound here: `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-BOOKING-001` `TXT-STATE-ELIG-001`
- Lifecycle labels for every status above are owned by `TXT-STATE-BOOKING-001` `TXT-STATE-ELIG-001` in `CONTENT_GUIDE_STATES.md`, for the audience of this surface. This screen selects no label of its own and never renders a raw enum value.

| Error | Raised by | Copy rule |
|---|---|---|
| `ERR-BOOKING-002` | a booking command that the record's current state does not permit | `TXT-ERR-BOOKING-002` |
| `ERR-ELIG-001` | a commit that revalidates provider, service or branch eligibility and finds it not currently passing | `TXT-ERR-ELIG-001` |
| `ERR-IDENTITY-001` | any protected read or command without a valid session | `TXT-ERR-IDENTITY-001` |
| `ERR-IDENTITY-002` | any read or command outside the actor's current role, organization, branch or subject-matter scope | `TXT-ERR-IDENTITY-002` |
| `ERR-PLATFORM-002` | a read for a record that does not exist, or that exists outside the actor's scope and is deliberately undisclosed | `TXT-ERR-PLATFORM-002` |
| `ERR-PLATFORM-004` | any read or command, as the generic unexpected-failure fallback | `TXT-ERR-PLATFORM-004` |

**Accessibility**

- Obligations bound here: `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032`
- Focus entry: the filter or search control where one exists, otherwise the first row.
- Keyboard: Complete keyboard operability per `A11Y-PLATFORM-001`. Tab order follows the region order above; the panel shell chrome never obscures a focused element per `A11Y-PLATFORM-005`.
- Screen-reader hierarchy: Landmark order is context and suspension, held bookings, controlling dependency. Each row announces the booking, its state and its review due time.
- Announcements: A booking leaving eligibility review announces politely and the row is removed.
- Right-to-left and bidirectional: Interface direction is right-to-left. Column order mirrors. Licence and registration identifiers, amounts with currency, dates, times, record identifiers and Latin legal names are bidirectionally isolated per `A11Y-PLATFORM-030`; a reordered identifier is a wrong identifier. Directional icons mirror and status icons do not.

**Responsive**

- Twelve-column content grid measured on the content area. Full behaviour at `profile-a.content-width.wide`; a supporting rail resolves at `.medium`; at `.narrow` the grid collapses to one column and the rail moves below the primary content. Content stops widening at `.maximum`. The page never scrolls horizontally at any width.
- A table at `.wide` degrading to the reading-list shape at `.narrow`; the review due time never truncates.

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

1. **Start and complete are absent, not disabled with an error on submit.**
2. The screen names the controlling dependency and the review due time.
3. It offers no override at any role.
4. It asserts no outcome for a held booking.

**Traceability.** `SCR-ELIG-021` · `WF-ELIG-021` · flows `FLOW-ELIG-015` · widgets `WGT-ELIG-002` `WGT-PLATFORM-001` `WGT-PLATFORM-002` `WGT-PLATFORM-003` `WGT-PLATFORM-004` `WGT-PLATFORM-005` · components `CMP-ELIG-003` `CMP-PLATFORM-001` `CMP-PLATFORM-003` `CMP-PLATFORM-004` `CMP-PLATFORM-005` `CMP-PLATFORM-006` `CMP-PLATFORM-007` `CMP-PLATFORM-009` `CMP-PLATFORM-010` · patterns `IX-ELIG-001` `IX-PLATFORM-001` `IX-PLATFORM-002` `IX-PLATFORM-003` `IX-PLATFORM-007` `IX-PLATFORM-010` `IX-PLATFORM-011` `IX-PLATFORM-012` `IX-PLATFORM-013` `IX-PLATFORM-014` `IX-PLATFORM-015` `IX-PLATFORM-017` · content `TXT-PLATFORM-001` `TXT-PLATFORM-019` `TXT-PLATFORM-018` `TXT-PLATFORM-002` `TXT-PLATFORM-007` `TXT-PLATFORM-008` `TXT-PLATFORM-010` `TXT-PLATFORM-016` `TXT-PLATFORM-017` `TXT-PLATFORM-020` `TXT-PLATFORM-021` `TXT-PLATFORM-006` `TXT-PLATFORM-011` `TXT-STATE-BOOKING-001` `TXT-STATE-ELIG-001` · accessibility `A11Y-PLATFORM-004` `A11Y-PLATFORM-009` `A11Y-PLATFORM-010` `A11Y-PLATFORM-015` `A11Y-PLATFORM-017` `A11Y-PLATFORM-020` `A11Y-PLATFORM-023` `A11Y-PLATFORM-025` `A11Y-PLATFORM-033` `A11Y-PLATFORM-001` `A11Y-PLATFORM-005` `A11Y-PLATFORM-018` `A11Y-PLATFORM-036` `A11Y-PLATFORM-012` `A11Y-PLATFORM-008` `A11Y-PLATFORM-030` `A11Y-PLATFORM-031` `A11Y-PLATFORM-032` · errors `ERR-BOOKING-002` `ERR-ELIG-001` `ERR-IDENTITY-001` `ERR-IDENTITY-002` `ERR-PLATFORM-002` `ERR-PLATFORM-004` · requirements `FR-ELIG-003`, `FR-BOOKING-002` · contract `SDC-ELIG-003`, `SDC-BOOKING-001`

---
