# Widget Specifications — Cross-Cutting Widgets

**Phase:** UX 4 — Widget and Screen Specifications
**Index, allocation rule and refused candidates:** `WIDGET_SPECS.md`
**Placement:** `SCREEN_SPEC_MAP.md` is authoritative. The reach figures and screen lists here are
computed from it.

Rules stated once and binding every block below, not repeated per block:

- **Every anatomy is defined in `start` and `end` terms.** Logical properties only.
- **No hover interaction is ever part of a Profile C sequence.** Each block states its Profile C
  behaviour explicitly rather than leaving the absence to be inferred.
- **Disabled is not an authorization control.** Hidden, unavailable and disabled are three different
  accessibility-tree outcomes under `A11Y-PLATFORM-016`.
- **Read-only is not disabled.** The nine immutable or append-only entities render at full contrast.
- **Every value resolves to a semantic token.** No widget names a colour, a size or a duration.
- **The nine-state precedence is never restated.** `IX-PLATFORM-017` owns it.
- **No canonical `ERR-*` message is restated.** `docs/api/ERROR_CATALOG.md` owns the string; these
  blocks own what the actor does next.

---

### WGT-PLATFORM-001 — Structural state region

**Purpose:** resolve which of the nine data states a surface is in, render exactly that one, and make
the two systemic failures structurally impossible — an empty state shown while a read is in flight,
which is a false statement, and a failed read shown as an empty set, which tells the actor nothing is
wrong.

**Class:** region · **Platforms:** C, A · **Archetypes:** all five · **Reach:** 165 of 165
**User intent:** understand what I am looking at when there is nothing to look at.
**Requirements:** `FR-PLATFORM-001`, `NFR-PLATFORM-006`
**Data source:** the owning surface's own contract — `API-PLATFORM-002` on the Patient attention and
notification path, `SDC-OPS-001` on the panel work path, and the screen's own contract elsewhere. The
region reads no data of its own; it renders the outcome of the surface's read.

**Composes** — mandatory core `CMP-PLATFORM-009`, `CMP-PLATFORM-010`; conditional `CMP-PLATFORM-011`
where the surface has an in-flight mutation, `CMP-PLATFORM-003` to preserve safe context under failure.
**Patterns:** `IX-PLATFORM-017` (owner), `IX-PLATFORM-003`, `IX-PLATFORM-007`, `IX-PLATFORM-013`.
**Content:** `TXT-PLATFORM-007`, `TXT-PLATFORM-008`, `TXT-PLATFORM-009`, `TXT-PLATFORM-016`,
`TXT-PLATFORM-019`.
**Accessibility:** `A11Y-PLATFORM-033` (owner), `A11Y-PLATFORM-006`, `A11Y-PLATFORM-011`,
`A11Y-PLATFORM-015`, `A11Y-PLATFORM-024`.

**Anatomy**

```
[ surface content ]                      rendered only in success, partial or loading-refresh
        or
[ icon ][ headline            ]          start to end, in reading order
        [ explanation          ]         what happened, in the actor's terms
        [ as-of time           ]         stale only
        [ recovery action      ]         one action; absent in loading-* by design
```

The region has exactly one visible outcome at a time. A surface that renders a skeleton and an empty
state together has bypassed the precedence.

**Variants**

| Variant | Resolves to | Note |
|---|---|---|
| `content` | success | The region is transparent |
| `skeleton` | `loading-initial` | Skeleton at content height, so completion causes no layout shift |
| `overlay` | `loading-refresh` | Content stays visible and interactive |
| `empty` | `empty-no-data`, `empty-filtered` | The two are different wording and different recovery |
| `recovery` | `error-fetch`, `error-permission`, `stale` | `CMP-PLATFORM-010` in the variant the precedence selected |
| `partial` | `partial` | The loaded part stays interactive; the failed part names itself |

**Data states**

| State | Behaviour |
|---|---|
| `loading-initial` | `skeleton`. No empty state, no error state, no recovery action. The region is marked busy once, not narrated cell by cell |
| `loading-refresh` | `overlay`. Existing content stays fully visible and interactive; focus is never stolen |
| `empty-no-data` | `CMP-PLATFORM-009` `no-data`, with the one action that creates a first record. Announced only when it replaces a previously populated set |
| `empty-filtered` | `CMP-PLATFORM-009` `filtered-empty`, applied filter still visible, distinct wording from the row above, recovery is relax or clear |
| `partial` | The loaded region renders; the failed region names which part failed and offers retry in place. Never presented as complete |
| `stale` | `CMP-PLATFORM-010` `stale`. Previous good projection, marked with its as-of time, plus retry. Preferred over `error-fetch` whenever a prior projection exists |
| `error-fetch` | `CMP-PLATFORM-010` `fetch-failure`. Last known safe context preserved, retry in place |
| `error-permission` | `CMP-PLATFORM-010` `permission-denied`. Wins over every other state. No retry. Stale actions removed, not disabled |
| `success` | `content` |
| Offline / unstable | Treated as `stale` with a client-side cause: last known data, as-of time, and a clear statement of the condition per `TXT-PLATFORM-009`. Resumes without requiring the actor to notice |

**Right-to-left:** blocks are start-aligned or centred by logical property and mirror without change.
An as-of time inside Arabic text is bidirectionally isolated.
**Long content and text scaling:** headline and explanation wrap; neither truncates. At the largest
supported text size the recovery action stays reachable without horizontal scrolling.
**Responsive:** Profile C occupies the reading column at every size class. Profile A occupies the
content region it replaced, so replacing a table does not collapse the page grid.

**Focus, keyboard and screen reader:** when a structural state **replaces** content the actor was
reading, focus moves to the new block and it is announced; a silent replacement leaves a screen-reader
user acting on a surface that is no longer there. The recovery action is the first control inside the
block, reachable without traversing it. `error-fetch` and `error-permission` announce assertively;
`stale`, `empty-*` and `partial` announce politely; `loading-*` do not announce.

**Realization**

| Profile | Realization |
|---|---|
| C — Patient | `Native` — one region component per surface, driven by the resolved state |
| A — Clinic, Admin | `Extended` — Filament placeholder and empty-state blocks for `empty-*` and `loading-*`; a custom block for `permission-denied` and `unknown-outcome`, which Filament does not ship |

**Prohibited:** an empty state during a read; an error rendered as an empty set; a spinner as the only
feedback for a mutation; a permission failure rendered as a quiet empty queue; a partial read presented
as complete; a retry control on `permission-denied` or on a `not-retryable` failure.

**Placed on:** all 165 screens, all 165 `WF-*`.

**Acceptance criteria**

1. Given a read in flight and no prior content, the surface renders `skeleton` and no empty state.
2. Given a read that fails with a prior good projection available, the surface renders `stale` with its
   as-of time, not `error-fetch`.
3. Given a scope failure and an empty result set, the surface renders `error-permission`.
4. Given a partial read, the failed region is named and the loaded region stays interactive.
5. Given a structural state replacing read content, focus moves into the block and it is announced.
6. No surface renders two structural states at once.

---

### WGT-PLATFORM-002 — Subject context bar

**Purpose:** state whose record this is, which provider and branch it belongs to, and on whose authority
the current actor is acting — and handle the moment that authority is withdrawn while the surface is
open. Acting on the wrong person's case is a named consequence of error for two actors, so this is a
safety composition rather than chrome.

**Class:** region · **Platforms:** C, A · **Archetypes:** all five · **Reach:** 156 of 165
**User intent:** know, without looking for it, who I am acting for and under what authority.
**Requirements:** `FR-IDENTITY-003`, `FR-AUDIT-001`, `NFR-IDENTITY-001`
**Data source:** `API-IDENTITY-003` on Profile C; `SDC-IDENTITY-004` on Profile A.

**Composes** — mandatory core `CMP-PLATFORM-003`; conditional `CMP-PLATFORM-001` where the subject
carries a lifecycle status, `CMP-PLATFORM-013` where the authority was granted by a named person.
**Patterns:** `IX-PLATFORM-007` (owner), `IX-PLATFORM-010`, `IX-PLATFORM-015`.
**Content:** `TXT-PLATFORM-016`, `TXT-PLATFORM-017`, `TXT-PLATFORM-020`.
**Accessibility:** `A11Y-PLATFORM-009`, `A11Y-PLATFORM-016`, `A11Y-PLATFORM-030`, `A11Y-PLATFORM-032`,
`A11Y-PLATFORM-023`.

**Anatomy**

```
[ subject identity ][ scope ]            start to end
        |               |
        |               +-- provider and branch on Profile A; absent on a self-acting Patient surface
        +------------------ the person the record belongs to

[ authority ]                            present ONLY under representation or a staff grant;
                                         absent, not empty, when the actor acts for themselves
```

**Variants** — the five `CMP-PLATFORM-003` variants, unchanged: `self`, `representation`,
`provider-scope`, `case-subject`, `staff-scope`. The bar never invents a sixth.

**Data states**

| State | Behaviour |
|---|---|
| `loading-initial` | The bar renders before the surface body, because context is what makes the body safe to read. Identity resolves first; scope may resolve after |
| `loading-refresh` | Context stays visible; a scope re-read never blanks it |
| `empty-no-data` | n/a for the bar itself. A pre-authentication surface has no subject and the bar is absent, which is why nine screens do not carry it |
| `empty-filtered` | n/a. The bar is not a filtered projection |
| `partial` | Subject known, scope not yet resolved: the scope slot states that rather than rendering as unscoped, because an unscoped panel reads as full authority |
| `stale` | Context is never rendered stale without saying so. A stale grant is a security statement, not a caching detail |
| `error-fetch` | The surface keeps the last known safe context and offers retry; no action that depends on scope is offered while scope is unknown |
| `error-permission` | Authorization loss. The bar states the loss, the surface removes stale actions structurally, and the route to a scope the actor does hold is the first control |
| `success` | The resolved bar |
| Offline / unstable | Context persists from the last good read with its as-of time. No mutation is offered against an unverifiable scope |

**Right-to-left:** subject, scope and authority sit in logical order and mirror. Latin clinic legal
names, branch codes and grant identifiers inside Arabic text are bidirectionally isolated; a reordered
identifier is a wrong identifier.
**Long content and text scaling:** a long Arabic clinic legal name wraps; the subject identity never
truncates. At the largest supported text size the three slots stack in the same order.
**Responsive:** Profile C keeps the bar in persistent chrome, not on one screen, because a wrong-subject
action is a clinical and authorization failure. Profile A keeps provider and branch scope panel-global
for the same reason, which is a deliberate deviation from stock Filament.

**Focus, keyboard and screen reader:** the bar is the first landmark in the reading order and is
announced before the surface body. It is not a focus stop unless it hosts a switch control. On
authorization loss, focus moves to the denial block assertively. The scope switcher, where present, is
reachable by keyboard on Profile A and by an explicit control on Profile C.

**Realization**

| Profile | Realization |
|---|---|
| C — Patient | `Native` — persistent chrome plus a per-surface header echo |
| A — Clinic, Admin | `Custom` — a panel-global context region. Filament ships no equivalent, and per-page duplication would let two pages disagree about scope |

**Prohibited:** an empty authority slot rendered as no authority; a scope switch that appears to grant
authority (every request re-evaluates server-side); masquerading as the represented subject; hiding the
representation context anywhere the actor can commit; any implication that switching context changes
what the actor is allowed to do.

**Placed on:** 156 screens. Absent from the nine pre-authentication surfaces, which have no subject:
`SCR-IDENTITY-001`, `SCR-IDENTITY-002`, `SCR-IDENTITY-003`, `SCR-IDENTITY-009`, `SCR-IDENTITY-010`,
`SCR-IDENTITY-011`, `SCR-IDENTITY-019`, `SCR-IDENTITY-025` and `SCR-PLATFORM-005`.

**Acceptance criteria**

1. Given representation, both the acting identity and the subject identity are visible on every surface
   where the actor can commit.
2. Given a grant revoked mid-session, the surface removes the affected actions structurally and
   announces the loss assertively.
3. Given an unresolved scope, no scope-dependent action is offered.
4. A Latin identifier inside the bar keeps its character order in both directions.
5. Switching subject or scope issues no authority; every subsequent request is re-evaluated server-side.

---

### WGT-PLATFORM-003 — State-gated action region

**Purpose:** present exactly the actions available on this record, to this actor, in this lifecycle
state, and resolve every unavailable action into hidden, unavailable or disabled — never into a dead
control that implies an override exists. It is also where the commit contract becomes visible: issuing
is not committing.

**Class:** region · **Platforms:** C, A · **Archetypes:** all five · **Reach:** 161 of 165
**User intent:** do the one thing this record needs, and understand immediately when I cannot.
**Requirements:** `FR-AUDIT-003`, `FR-BOOKING-003`, `NFR-AUDIT-002`
**Data source:** the owning record's contract. `API-BOOKING-003` and `API-CLINICAL-001` are
representative on Profile C; `SDC-CLINICAL-001` and `SDC-BOOKING-001` on Profile A. Permitted next
actions are **read from the server projection**, never inferred client-side from the status label.

**Composes** — mandatory core `CMP-PLATFORM-004`; conditional `CMP-PLATFORM-011` for the in-flight
state, `CMP-PLATFORM-014` where the action is sensitive (the confirmation itself is
`WGT-PLATFORM-007`), `CMP-PLATFORM-005` where an action is deadline-bearing.
**Patterns:** `IX-PLATFORM-001` (owner), `IX-PLATFORM-002`, `IX-PLATFORM-007`, `IX-PLATFORM-004`,
`IX-ELIG-001`.
**Content:** `TXT-PLATFORM-002`, `TXT-PLATFORM-011`, `TXT-PLATFORM-012`, `TXT-PLATFORM-016`,
`TXT-PLATFORM-018`.
**Accessibility:** `A11Y-PLATFORM-013`, `A11Y-PLATFORM-014`, `A11Y-PLATFORM-016`, `A11Y-PLATFORM-006`,
`A11Y-PLATFORM-011`, `A11Y-PLATFORM-004`.

**Anatomy**

```
[ primary action ][ secondary ][ secondary ]        start to end, one primary only
                                          [ destructive ]   separated, at the end, never adjacent
                                                            to the primary without separation

[ explained absence ]                     one line per removed action, stating why and what would
                                          restore it. Absent actions are explained, not hidden silently
[ submission state ]                      CMP-PLATFORM-011 inline, during and after a commit
```

**Variants** — the four `CMP-PLATFORM-004` variants: `page`, `row`, `sticky` (Profile C, where the
primary action stays reachable), `readonly` (over one of the nine immutable entities: reads and exports
only).

**Availability resolution** — every action declares one:

| Outcome | When | Accessibility-tree consequence |
|---|---|---|
| HIDDEN | The actor is outside the scope that would make the action meaningful | Absent |
| UNAVAILABLE | The action exists for this actor but the lifecycle forecloses it | Present as an explained absence, not as a control |
| DISABLED | The same actor on the same record will be able to act once they complete something visible here | Present, disabled, with the reason bound to it |

**Data states**

| State | Behaviour |
|---|---|
| `loading-initial` | No action is offered until permitted next actions are known. An action rendered before the projection resolves is a guess |
| `loading-refresh` | Actions stay usable; a refresh that changes the permitted set replaces the region and announces |
| `empty-no-data` | The region carries only the one creating action, matching `CMP-PLATFORM-009`'s recovery |
| `empty-filtered` | n/a for a page region; on a `row` variant the region does not render because there is no row |
| `partial` | Actions whose preconditions did not load are unavailable with the reason stated, never offered optimistically |
| `stale` | Read actions stay; **committing actions are withdrawn** while the projection is known stale, because committing against a stale precondition is how a double booking happens |
| `error-fetch` | Committing actions withdrawn; retry offered by `WGT-PLATFORM-001`, not duplicated here |
| `error-permission` | All affected actions removed structurally. Never disabled, because disabled implies an override |
| `success` | The permitted set |
| Offline / unstable | An idempotent-resumable command may be queued and shown pending by `CMP-PLATFORM-011`; any other command is withdrawn with the condition stated |

**Right-to-left:** the primary action sits at the logical `start` of the group in both directions.
Directional icons mirror; status icons do not.
**Long content and text scaling:** action labels wrap rather than truncate; at the largest supported
text size the group stacks with the primary first. A verb is never abbreviated to fit.
**Responsive:** Profile C uses the `sticky` variant where the surface scrolls, and the primary action
never falls below the comfortable target floor at any density. Profile A keeps the region visible
without obscuring a focused element; at `profile-a.content-width.narrow` secondary actions collapse into
an overflow while the primary and any destructive action stay visible.

**Focus, keyboard and screen reader:** every action is reachable by keyboard on Profile A and completes
without a pointer. After a commit, focus moves to the changed state summary, not back to the action.
An action's disabled reason is programmatically associated with it. Destructive and primary actions are
separated so an adjacent mis-click is not a destructive one.

**Realization**

| Profile | Realization |
|---|---|
| C — Patient | `Native` — an action group with a sticky variant; no hover state is emitted |
| A — Clinic, Admin | `Extended` — Filament page and table actions, configured so that an unauthorized action is not registered at all rather than registered and hidden by a visibility callback |

**Prohibited:** more than one primary action; a destructive action styled as primary; the same
destructive action reading as different roles in the trigger and its confirmation; a disabled control
standing in for an authorization denial; an optimistic success state; a new command offered while a
prior outcome is unknown; a generic edit or delete affordance over any of the nine immutable entities.

**Placed on:** 161 screens. Absent from exactly the four that bind no action component:
`SCR-CATALOG-001` and `SCR-CATALOG-002`, which are pre-identity reading surfaces whose only affordance
is navigation; `SCR-AUDIT-002`, an immutable audit fact with no command; and `SCR-PLATFORM-008`, a
signal board whose every route is navigation into an owning surface.

**Acceptance criteria**

1. Every action on every screen resolves to exactly one of HIDDEN, UNAVAILABLE or DISABLED when not
   available, and the screen spec names which.
2. No authorization denial is expressed as a disabled control anywhere in the product.
3. Given a commit in flight, no second identical command can be issued, and the retry reuses the
   original idempotency key.
4. Given an unknown outcome, no new command is offered until the outcome is reconciled.
5. Given a stale projection, committing actions are withdrawn and read actions remain.
6. After a successful commit, focus moves to the changed state and the change is announced.

---

### WGT-PLATFORM-004 — Filter and result toolbar

**Purpose:** narrow a projection and keep the narrowing visible, so that a filtered-empty result and a
genuinely empty set are two different answers with two different recoveries. Filter persistence lives
inside this widget rather than beside it, because a toolbar that filters without persisting still claims
conformance.

**Class:** toolbar · **Platforms:** C, A · **Archetypes:** list-and-detail, detail, workspace ·
**Reach:** 39 of 165
**User intent:** find the few records I care about, and come back to them later without rebuilding the
query.
**Requirements:** `FR-ELIG-001`, `FR-OPS-001`, `FR-AUDIT-002`
**Data source:** `API-ELIG-001` on the Patient discovery path; `SDC-OPS-001`, `SDC-AUDIT-001` and the
owning management contract on Profile A.

**Composes** — mandatory core `CMP-PLATFORM-007`, `CMP-PLATFORM-009`; conditional `CMP-PLATFORM-001`
where a status is a filter facet, `CMP-PLATFORM-005` where a deadline is.
**Patterns:** `IX-PLATFORM-014` (owner), `IX-PLATFORM-016`, `IX-PLATFORM-012`, `IX-PLATFORM-015`.
**Content:** `TXT-PLATFORM-003`, `TXT-PLATFORM-004`, `TXT-PLATFORM-007`, `TXT-PLATFORM-019`.
**Accessibility:** `A11Y-PLATFORM-009`, `A11Y-PLATFORM-026`, `A11Y-PLATFORM-011`, `A11Y-PLATFORM-012`,
`A11Y-PLATFORM-013`, `A11Y-PLATFORM-019`.

**Anatomy**

```
[ search ]  [ facet ][ facet ][ facet ]           start to end
[ applied: facet x  facet x ]  [ clear all ]      the applied set, always visible, never a hidden drawer
[ result count ]                                  the count is part of the answer, not decoration
```

**Variants** — the five `CMP-PLATFORM-007` variants: `discovery`, `queue`, `management`, `history`
(never reorders history), `authoring` (procedure search inside plan authoring).

**Data states**

| State | Behaviour |
|---|---|
| `loading-initial` | The toolbar renders and is usable before results arrive; a filter is not blocked on the result set |
| `loading-refresh` | The applied set stays visible and editable while the new result set loads |
| `empty-no-data` | Only when **no filter is applied**. Wording and recovery are about creating a first record |
| `empty-filtered` | The applied set stays visible, the wording names the filter as the cause, and the recovery relaxes or clears it. This is the distinction the widget exists to hold |
| `partial` | A facet whose option set failed to load renders unavailable with its reason; the rest of the toolbar stays usable |
| `stale` | Results marked stale with their as-of time; the applied set is not cleared by a failed refresh |
| `error-fetch` | The applied set survives the failure so retry does not mean re-entering the query |
| `error-permission` | A facet outside the actor's scope is not offered; a scope failure on the result set renders as denial, never as `empty-filtered` |
| `success` | Results, with the count |
| Offline / unstable | The last result set stays readable with its as-of time; a new query states that it cannot run yet rather than returning zero |

**Right-to-left:** facets flow start to end and mirror. A search term containing Latin characters is
bidirectionally isolated in the applied-set chip so the actor can see exactly what they searched for.
**Long content and text scaling:** a long Arabic facet label wraps within its chip; the applied set
wraps to multiple rows rather than scrolling sideways. At the largest supported text size the toolbar
stacks above the results.
**Responsive:** Profile C keeps a small persistent filter set in the reading column, never a hidden
drawer, because the filter that caused an empty result must be visibly present. Profile A keeps facets
inline at `profile-a.content-width.wide` and collapses them into a labelled disclosure at `narrow`,
with the applied set remaining visible outside the disclosure.

**Focus, keyboard and screen reader:** the result count is announced politely when it changes. Focus
stays in the control the actor used; it never jumps to the results and never jumps to an empty region.
Each facet has a persistent visible label. On Profile A the whole toolbar is operable by keyboard and
clearing the last facet does not move focus.

**Realization**

| Profile | Realization |
|---|---|
| C — Patient | `Native` — a compact persistent filter set above the reading column |
| A — Clinic, Admin | `Stock` — Filament table filters and search, configured to persist per actor and surface, with the applied-filter summary and count rendered rather than left to the default |

**Prohibited:** a filtered-empty result worded as an empty data set; a hidden filter drawer on Profile C;
a filter that silently persists without being visible; reordering an append-only projection through a
filter; a facet that exposes a scope the actor does not hold.

**Placed on:** 39 screens, 39 `WF-*`.

**Acceptance criteria**

1. Given an applied filter and no results, the surface renders `empty-filtered` with the filter visible.
2. Given no filter and no results, the surface renders `empty-no-data`.
3. A filter set survives navigation away and back, and survives a failed refresh.
4. The result count is announced when it changes and is present in the accessibility tree.
5. On a `history` variant, no filter changes the order of events.

---

### WGT-PLATFORM-005 — Lifecycle record list

**Purpose:** render rows over a governed projection so that a row's lifecycle status, its independent
flags and its permitted actions are all legible without opening it — and so that no generic edit or
delete affordance ever appears over one of the nine immutable or append-only entities.

**Class:** list · **Platforms:** C, A · **Archetypes:** list-and-detail, detail, dashboard, workspace ·
**Reach:** 85 of 165
**User intent:** see which of these records needs me, and reach it.
**Requirements:** `FR-BOOKING-001`, `FR-CLAIMS-003`, `FR-OPS-001`, `NFR-PLATFORM-001`
**Data source:** the owning projection. `API-BOOKING-002`, `API-CLAIMS-003` and `API-CLINICAL-004` are
representative on Profile C; `SDC-OPS-001`, `SDC-BOOKING-001`, `SDC-CLINICAL-001` and `SDC-FINANCE-001`
on Profile A.

**Composes** — mandatory core `CMP-PLATFORM-006`; conditional `CMP-PLATFORM-001` per row where the
record carries a lifecycle status, `CMP-PLATFORM-005` where a row is deadline-bearing,
`CMP-PLATFORM-004` in the `row` variant, `CMP-ELIG-002` where a row carries an amount.
**Patterns:** `IX-PLATFORM-015` (owner), `IX-PLATFORM-016`, `IX-PLATFORM-011`, `IX-PLATFORM-012`,
`IX-PLATFORM-010`, `IX-PLATFORM-003`.
**Content:** `TXT-PLATFORM-003`, `TXT-PLATFORM-007`, `TXT-PLATFORM-019`, `TXT-PLATFORM-020`.
**Accessibility:** `A11Y-PLATFORM-012`, `A11Y-PLATFORM-008`, `A11Y-PLATFORM-013`, `A11Y-PLATFORM-015`,
`A11Y-PLATFORM-023`, `A11Y-PLATFORM-030`, `A11Y-PLATFORM-036`.

**Anatomy**

```
[ header row ]                            table variant only; sortable where the projection supports it
[ status ][ subject ][ facts ][ when ]    start to end
[ flag ][ flag ]                          escalated and overdue, in their own slot, never recolouring
                                          the status chip
[ row actions ]                           row variant of CMP-PLATFORM-004, same availability rules
```

**Variants** — the five `CMP-PLATFORM-006` variants: `reading-list` (Profile C, whole row is the
target), `table` (Profile A), `embedded` (a list inside a detail surface), `immutable` (read and export
only, no create, edit, delete or bulk action), `selectable` (comparison candidates, assignment targets).

**Data states**

| State | Behaviour |
|---|---|
| `loading-initial` | Row skeletons at row height, so completion causes no shift. Row count is not implied by the skeleton count |
| `loading-refresh` | Rows stay visible and interactive; a refresh never scrolls the list |
| `empty-no-data` | The list is replaced by `CMP-PLATFORM-009` `no-data` with the one creating action |
| `empty-filtered` | Replaced by `filtered-empty`, with the applied filter still visible in `WGT-PLATFORM-004` |
| `partial` | A row whose secondary projection failed renders with that field named as unavailable rather than blank. A deadline that did not load is never rendered as no deadline |
| `stale` | Rows shown with the list's as-of time; row actions that commit are withdrawn |
| `error-fetch` | Last known rows preserved where they exist, retry in place |
| `error-permission` | The list is replaced by the denial block. A scope failure never renders as an empty list |
| `success` | Rows |
| Offline / unstable | Last known rows with their as-of time; row actions that commit are withdrawn unless idempotent-resumable |

**Right-to-left:** column order mirrors. Numeric columns align by logical property, never by physical
side. Amounts, codes, dates and identifiers are bidirectionally isolated per cell.
**Long content and text scaling:** a long Arabic subject name wraps or the row stacks; a status label, a
deadline, an amount and a controlling reason never truncate. At the largest text sizes the `table`
variant degrades to `reading-list` rather than relying on horizontal scroll indefinitely.
**Responsive:** Profile C is always `reading-list`. Profile A keeps `table` at
`profile-a.content-width.wide`; at `narrow` a table either keeps a **bounded internal horizontal
scroll**, which `A11Y-PLATFORM-036` permits for a data table, or degrades to `reading-list` — each
screen spec states which, and the page itself never scrolls horizontally.

**Focus, keyboard and screen reader:** the list exposes native list or table semantics, with row count
and column headers where the variant has them. Returning from a detail restores focus to the row that
was opened. On Profile A every row action is keyboard reachable and sorting is operable without a
pointer. Row flags are announced as part of the row, distinct from the status.

**Realization**

| Profile | Realization |
|---|---|
| C — Patient | `Native` — a virtualized reading list; the whole row is the tap target and no hover state is emitted |
| A — Clinic, Admin | `Extended` — Filament table with **bulk actions removed by default**, delete actions not registered over immutable entities, and status rendered from the state triple rather than a colour-only badge |

**Prohibited:** a generic edit or delete affordance over an immutable or append-only entity; a bulk
action registered by framework default; a flag rendered by recolouring the status chip; a status
rendered as a colour with no icon and no label; a filtered-empty result worded as an empty set; a page
that scrolls horizontally because a table did.

**Placed on:** 85 screens, 85 `WF-*`.

**Acceptance criteria**

1. No list over any of the nine immutable entities exposes create, edit, delete or bulk actions.
2. Every row status renders as tone, icon and label together; removing colour loses no meaning.
3. Escalated and overdue render in their own slot and can both be true while the status is a third thing.
4. Returning from a row detail restores focus to that row.
5. At the narrow verification widths the page does not scroll horizontally, whether or not a table does.
6. A row whose deadline failed to load says so and is not rendered as having none.

---

### WGT-PLATFORM-006 — Decision-bearing event timeline

**Purpose:** render append-only history in order, with who decided and on what basis where a person
decided, and with **no edit affordance reachable from it, by construction**. Five of the nine immutable
entities are event or decision logs, and this is what renders them.

**Class:** list · **Platforms:** C, A · **Archetypes:** detail, list-and-detail, workspace ·
**Reach:** 33 of 165
**User intent:** understand how this record reached its current state, and who is accountable for each
step.
**Requirements:** `FR-AUDIT-001`, `FR-CLINICAL-005`, `FR-FINANCE-004`, `NFR-AUDIT-001`
**Data source:** `API-CLINICAL-004` and `API-FINANCE-005` on Profile C; `SDC-AUDIT-001`,
`SDC-FINANCE-001` and `SDC-CLINICAL-001` on Profile A.

**Composes** — mandatory core `CMP-PLATFORM-008`; conditional `CMP-PLATFORM-001` per event,
`CMP-PLATFORM-013` where an event has a decider, `CMP-ELIG-002` where an event carries an amount.
**Patterns:** `IX-PLATFORM-016` (owner), `IX-PLATFORM-008`, `IX-PLATFORM-010`, `IX-PLATFORM-003`.
**Content:** `TXT-PLATFORM-013`, `TXT-PLATFORM-014`, `TXT-PLATFORM-017`, `TXT-PLATFORM-020`.
**Accessibility:** `A11Y-PLATFORM-012`, `A11Y-PLATFORM-023`, `A11Y-PLATFORM-030`, `A11Y-PLATFORM-015`,
`A11Y-AUDIT-001`.

**Anatomy**

```
[ when ][ what happened ][ status ]        one event per row, ordered, start to end
   [ who decided, and on what basis ]      CMP-PLATFORM-013, only where a person decided
   [ detail ]                              progressive disclosure; never a second screen
[ load older ]                             bounded read; the boundary is explicit, not infinite scroll
```

**Variants** — the five `CMP-PLATFORM-008` variants: `case`, `record`, `financial`, `governance`,
`audit` (correlation identifiers bidirectionally isolated).

**Data states**

| State | Behaviour |
|---|---|
| `loading-initial` | Event skeletons; the count is not implied |
| `loading-refresh` | Existing events stay; a new event appends and is announced politely if the actor is viewing the record |
| `empty-no-data` | A record with no events yet says so plainly. It is not an error and offers no action |
| `empty-filtered` | Where the surface filters history, the filter is named as the cause and history order is never changed by it |
| `partial` | A bounded page loaded and the next did not: the boundary states that older events exist and could not be read, never that history ends here |
| `stale` | Timeline shown with its as-of time. A financial or clinical timeline read as current when it is stale is a correctness failure |
| `error-fetch` | Loaded events preserved, retry at the boundary |
| `error-permission` | Events outside the actor's purpose scope are not returned, and the surface says the view is scope-limited rather than showing a shorter history as if complete |
| `success` | Events in order |
| Offline / unstable | Last read events with as-of time; the boundary control states that older events need a connection |

**Right-to-left:** the timeline runs top to bottom in both directions; the ordering axis is vertical, so
no reversal applies. Correlation identifiers, amounts and timestamps are bidirectionally isolated.
**Long content and text scaling:** an eleven-word Arabic reason wraps and never truncates. A decider's
name and the basis of the decision never truncate.
**Responsive:** Profile C keeps one event per reading-column block. Profile A keeps the timeline in the
primary region; at `profile-a.content-width.narrow` the who-and-basis line stacks beneath the event
rather than moving into a tooltip.

**Focus, keyboard and screen reader:** exposed as a list, not as a table, because events are ordered
rather than tabular. Disclosure of an event's detail keeps focus on the event. The load-older control is
the last item and returning from it restores focus to the boundary, not to the top.

**Realization**

| Profile | Realization |
|---|---|
| C — Patient | `Native` — a bounded list with in-place disclosure |
| A — Clinic, Admin | `Custom` — Filament ships no append-only timeline with an attribution slot; a stock table would offer sort and row actions that this component prohibits |

**Prohibited:** any edit or delete affordance reachable from an event; a correction rendered by
modifying an earlier event; infinite scroll with no stated boundary; a computed outcome rendered as a
human judgement; a truncated reason.

**Placed on:** 33 screens, 33 `WF-*`.

**Acceptance criteria**

1. No control reachable from the timeline mutates an existing event.
2. A correction appears as a later event and the earlier event is still readable.
3. Where a person decided, the decider and the basis are shown; where the system evaluated, it is
   labelled as computed.
4. The read boundary is explicit and states that older events exist.
5. A scope-limited history says it is scope-limited rather than appearing complete.

---

### WGT-PLATFORM-007 — Sensitive decision confirmation

**Purpose:** capture the mandatory reason, state the effect, state whether it can be undone, and keep
**one action role reading the same way in the trigger and in its own confirmation**. This product's
confirmations are reason-capturing sensitive decisions, not generic acknowledgements, which is why no
generic confirmation pattern exists.

**Class:** overlay · **Platforms:** C, A · **Archetypes:** form, detail, list-and-detail, workspace ·
**Reach:** 38 of 165
**User intent:** commit something consequential having understood exactly what it does and whether it
can be reversed.
**Requirements:** `FR-AUDIT-001`, `FR-CLAIMS-004`, `FR-BOOKING-002`
**Data source:** the owning command's contract. `API-BOOKING-005`, `API-CLINICAL-003`,
`API-IDENTITY-005` and `API-CLAIMS-005` are representative on Profile C; `SDC-CLAIMS-001`,
`SDC-IDENTITY-002`, `SDC-POLICY-001` and `SDC-BOOKING-001` on Profile A.

**Composes** — mandatory core `CMP-PLATFORM-014`, `CMP-PLATFORM-004`; conditional `CMP-PLATFORM-011`
for the commit state, `CMP-PLATFORM-013` where the decision becomes a recorded human basis,
`CMP-CLINICAL-002` where the effect is a change set.
**Patterns:** `IX-AUDIT-001` (owner), `IX-PLATFORM-001`, `IX-PLATFORM-002`, `IX-PLATFORM-018`.
**Content:** `TXT-PLATFORM-002`, `TXT-PLATFORM-011`, `TXT-PLATFORM-012`, `TXT-PLATFORM-015`,
`TXT-PLATFORM-018`.
**Accessibility:** `A11Y-PLATFORM-002`, `A11Y-PLATFORM-007`, `A11Y-PLATFORM-014`, `A11Y-PLATFORM-027`,
`A11Y-PLATFORM-006`, `A11Y-AUDIT-001`.

**Anatomy**

```
[ what this action does ]                  the effect, in the actor's terms, before anything else
[ what it affects ]                        named records and scopes, not a count
[ can this be undone ]                     stated in words. Never implied by tone or colour
[ reason ]                                 required for irreversible, destructive and authoritative
                                           decisions; optional only for reversible ones
[ cancel ][ confirm ]                      confirm carries the SAME action role as the trigger
```

**Variants** — the four `CMP-PLATFORM-014` variants: `reversible`, `irreversible`, `destructive` (uses
the destructive action role in both trigger and confirmation), `authoritative-decision` (the reason
becomes the recorded basis in `CMP-PLATFORM-013`).

**Data states**

| State | Behaviour |
|---|---|
| `loading-initial` | The confirmation does not open until the effect is known. An effect statement assembled client-side from a guess is the failure this prevents |
| `loading-refresh` | If the underlying record changes while the confirmation is open, the confirmation closes and the surface re-reads rather than committing against a changed record |
| `empty-no-data` | n/a. A confirmation always concerns a specific record |
| `empty-filtered` | n/a. A confirmation is not a projection |
| `partial` | If any part of the effect statement failed to load, the confirmation does not open and the trigger reports that it cannot state the effect yet |
| `stale` | The confirm control is withdrawn against a stale record; the surface re-reads first |
| `error-fetch` | The confirmation closes and the surface offers retry; the reason text the actor typed is preserved |
| `error-permission` | The confirmation closes, the action is removed structurally, and the denial is announced assertively |
| `success` | The confirmation closes, the surface re-reads authoritative state, and the outcome is announced |
| Offline / unstable | Confirm is withdrawn unless the command is idempotent-resumable; a queued command shows as pending and never as done |

**Right-to-left:** cancel and confirm sit in logical order and mirror; the confirm control is not
positioned by physical side. A record identifier inside the effect statement is bidirectionally
isolated.
**Long content and text scaling:** the effect statement wraps in full. It is never truncated, never
collapsed behind a disclosure, and never shortened at large text sizes; the dialog scrolls instead.
**Responsive:** Profile C presents the confirmation as a full-height sheet in the reading column, with
confirm reachable without scrolling past the reason field. Profile A uses the framework modal, sized so
the effect statement is visible without scrolling at `profile-a.content-width.wide`.

**Focus, keyboard and screen reader:** focus moves into the dialog on open, lands on the first
descriptive element and **not** on confirm, so an in-flight keystroke cannot commit. Focus is trapped
while open, Escape closes it as a cancel, and focus returns to the trigger on close. The reason field
carries a persistent visible label and its validation error is bound to it. Destructive and cancel are
separated. The outcome is announced after the surface re-reads.

**Realization**

| Profile | Realization |
|---|---|
| C — Patient | `Native` — a sheet with a trapped focus scope; no hover state is emitted |
| A — Clinic, Admin | `Extended` — Filament action modal with a required reason field and a rendered effect statement; the framework's default confirmation text is replaced, never merely relabelled |

**Prohibited:** a generic "are you sure"; irreversibility conveyed by tone or colour instead of words;
a confirm control whose action role differs from its trigger; focus landing on confirm; a reason field
that is optional on an irreversible action; an effect stated as a count instead of named records; any
implication of money movement.

**Placed on:** 38 screens, 38 `WF-*`.

**Acceptance criteria**

1. For every irreversible, destructive and authoritative action, a reason is required and the dialog
   says in words that it cannot be undone.
2. The trigger and the confirm control carry the same action role on every surface, in every domain.
3. Focus enters the dialog on a descriptive element, is trapped, and returns to the trigger on close.
4. Escape cancels without committing, on both profiles.
5. A commit whose outcome is unknown leaves the surface offering reconciliation, not a second confirm.
6. The typed reason survives a failed commit.

---

### WGT-PLATFORM-008 — Evidence transfer panel

**Purpose:** render evidence items across the eight fixed session states and keep **retryable transfer
failure structurally separate from authoritative rejection** — a network failure that reads as a
rejection tells a provider their document was refused when it was not. Low reach, very high
consequence.

**Class:** panel · **Platforms:** C, A · **Archetypes:** detail, form · **Reach:** 9 of 165
**User intent:** supply what was asked for, know whether it arrived, and know whether it was accepted.
**Requirements:** `FR-CLAIMS-002`, `FR-ELIG-008`, `FR-IDENTITY-001`, `NFR-PLATFORM-003`
**Data source:** `API-PLATFORM-001` on Profile C; `SDC-IDENTITY-001`, `SDC-ELIG-001`, `SDC-ELIG-002`,
`SDC-CLAIMS-001` and `SDC-AUDIT-001` on Profile A.

**Composes** — mandatory core `CMP-PLATFORM-012`; conditional `CMP-PLATFORM-006` `embedded` for the
requirement list, `CMP-PLATFORM-005` where an item has an expiry, `CMP-PLATFORM-013` where a reviewer
accepted or rejected it.
**Patterns:** `IX-PLATFORM-006` (owner), `IX-PLATFORM-009`, `IX-PLATFORM-002`, `IX-PLATFORM-018`.
**Content:** `TXT-PLATFORM-009`, `TXT-PLATFORM-010`, `TXT-PLATFORM-011`, `TXT-ERR-PLATFORM-005`,
`TXT-STATE-PLATFORM-001`.
**Accessibility:** `A11Y-PLATFORM-034` (owner), `A11Y-PLATFORM-011`, `A11Y-PLATFORM-027`,
`A11Y-PLATFORM-015`, `A11Y-PLATFORM-013`.

**Anatomy**

```
[ requirement ]                            what is needed and why, from the governing definition
   [ item ][ state ][ progress ]           one row per item, state from the eight-state machine
   [ what to do next ]                     differs per exit: resume, retry, or correct and resupply
[ add item ]                               subject to the requirement, not a free upload
```

**Variants** — the three `CMP-PLATFORM-012` variants: `intake` (the actor supplies), `review` (an
authorised reviewer verifies or rejects), `access-log` (state plus access and download events).

**The two exits, which are the point of the widget**

| Exit | State | What the actor does | Tone and icon |
|---|---|---|---|
| Transfer failed, recoverable | `FAILED_RETRYABLE` | Resume or retry the same item. Nothing about the document is wrong | Distinct tone and distinct icon from rejection |
| Rejected authoritatively | `REJECTED` | Correct the stated requirement and supply a different item | Distinct tone and distinct icon from transfer failure |

`UPLOADED` is not `ACCEPTED`. An item that transferred successfully is still quarantined until the
required scan succeeds and still unverified until a reviewer accepts it. Three separate facts, three
separate states, never collapsed.

**Data states**

| State | Behaviour |
|---|---|
| `loading-initial` | The requirement list loads before any item control is offered, because a free upload with no requirement is not a thing this product has |
| `loading-refresh` | Item states refresh without interrupting an in-flight transfer |
| `empty-no-data` | No requirement applies: stated plainly, with no add control |
| `empty-filtered` | n/a. The requirement set is governed, not filtered |
| `partial` | Some item states resolved and some did not; an unresolved item is never rendered as satisfied |
| `stale` | Item states shown with their as-of time; acceptance is never inferred from a stale read |
| `error-fetch` | Requirement list preserved; retry in place; an in-flight transfer is not cancelled by a failed status read |
| `error-permission` | Viewing or downloading requires fresh authorization for the exact purpose; a denial states that rather than showing an empty item set |
| `success` | Items with their current states |
| Offline / unstable | The load-bearing condition. A transfer resumes from the point of interruption rather than restarting, and the panel says the connection is unavailable rather than reporting a failure |

**Right-to-left:** progress runs from the logical `start`. Filenames, content hashes and item
identifiers are bidirectionally isolated. Directional icons mirror; state icons do not.
**Long content and text scaling:** a requirement description and a rejection reason wrap in full and
never truncate; a filename may elide in the middle provided the full value is reachable on the same
surface without a network read.
**Responsive:** Profile C stacks item rows in the reading column with the state and the next action
always together. Profile A keeps requirement and items in one region; at
`profile-a.content-width.narrow` each item's state and next action stack rather than moving off-screen.

**Focus, keyboard and screen reader:** progress is announced at intervals, never continuously.
`UPLOADED` announces once. `FAILED_RETRYABLE` announces politely — it is a recoverable expected
condition and an alarming announcement would itself misstate severity — and moves focus to the item's
resume control. `REJECTED` announces politely with distinct wording and moves focus to the stated
correctable requirement, not to a retry control. The file control is keyboard operable on Profile A.

**Realization**

| Profile | Realization |
|---|---|
| C — Patient | `Native` — resumable transfer with the session state rendered per item |
| A — Clinic, Admin | `Extended` — Filament file field configured against the requirement set, with the eight-state machine and the two exits rendered as a custom item row; the framework's own upload states do not distinguish the two exits |

**Prohibited:** collapsing transfer success into evidence acceptance; a single failure state covering
both exits; exposing storage paths, opaque filenames, signed links or scanner internals; treating a
quarantined item as satisfying a requirement; a public or long-lived link to any evidence; naming a
transfer vendor. **The binary transfer mechanism is bounded by `Q-OPS-001` and this widget specifies
behaviour up to that boundary and stops.**

**Placed on:** 9 screens — `SCR-IDENTITY-015`, `SCR-IDENTITY-029`, `SCR-ELIG-009`, `SCR-ELIG-017`,
`SCR-CLINICAL-014`, `SCR-CLAIMS-003`, `SCR-CLAIMS-007`, `SCR-CLAIMS-011`, `SCR-PLATFORM-006`.

**Acceptance criteria**

1. `FAILED_RETRYABLE` and `REJECTED` differ in tone, icon, wording, next action and focus destination.
2. `UPLOADED` never renders as accepted, and a quarantined item never satisfies a requirement.
3. An interrupted transfer resumes from its interruption point rather than restarting.
4. No surface exposes a storage path, a raw filename, a signed link or a scanner internal.
5. Progress announces at intervals, not continuously.
6. Every viewing or download action requires fresh purpose-bound authorization and is audited.

---

### WGT-PLATFORM-009 — Attention and notification feed

**Purpose:** render the durable, deadline-bearing things that need the actor, on **both** the attention
surface and the notification centre. That duplication is exactly what makes push, SMS and email optional
adapters rather than load-bearing infrastructure.

**Class:** list · **Platforms:** C, A · **Archetypes:** dashboard, detail · **Reach:** 4 of 165
**User intent:** find out what needs me now, without hunting.
**Requirements:** `FR-PLATFORM-001`, `FR-BOOKING-003`, `FR-CLINICAL-005`
**Data source:** `API-PLATFORM-002` on Profile C; `SDC-OPS-001` on Profile A.

**Composes** — mandatory core `CMP-PLATFORM-015`, `CMP-PLATFORM-001`; conditional `CMP-PLATFORM-005`
where the item carries a deadline, `CMP-PLATFORM-006` for the list frame.
**Patterns:** `IX-BOOKING-001`, `IX-PLATFORM-003`, `IX-PLATFORM-015`, `IX-PLATFORM-013`.
**Content:** `TXT-PLATFORM-001`, `TXT-PLATFORM-007`, `TXT-PLATFORM-010`, `TXT-PLATFORM-019`.
**Accessibility:** `A11Y-PLATFORM-012`, `A11Y-PLATFORM-013`, `A11Y-PLATFORM-011`, `A11Y-PLATFORM-015`,
`A11Y-PLATFORM-024`.

**Anatomy**

```
[ what needs you ][ status ][ remaining time ]      start to end
[ which record ]                                    the link is to the authoritative record, always
```

**Variants** — the three `CMP-PLATFORM-015` variants: `attention` (ordered by what the case needs now),
`notification` (chronological, with read state, owning no business status), `panel-attention`
(Profile A dashboards, scoped by `WGT-PLATFORM-002` rather than filtered).

**Data states**

| State | Behaviour |
|---|---|
| `loading-initial` | Item skeletons; no count implied |
| `loading-refresh` | Items stay; a new item appends. On the Patient surface, returning to the app is a refresh trigger |
| `empty-no-data` | `CMP-PLATFORM-009` `between-cases` on Profile C: near-empty, says so plainly, and never manufactures activity |
| `empty-filtered` | n/a on `attention`, which is scoped rather than filtered. Applies on `notification` where a read filter is offered |
| `partial` | An item whose deadline did not load is shown without a fabricated one and says the remaining time is unavailable |
| `stale` | The feed carries its as-of time. An entry written hours ago cannot be trusted about a deadline, so opening one re-reads the authoritative record |
| `error-fetch` | Last known items preserved with retry |
| `error-permission` | Items outside a revoked grant disappear with the scope change stated; never rendered as a quiet empty feed |
| `success` | Items in the variant's order |
| Offline / unstable | Last known items with as-of time. Opening an item states that the authoritative re-read needs a connection rather than showing the cached entry as current |

**Right-to-left:** items flow start to end and mirror. Remaining time and record identifiers are
bidirectionally isolated.
**Long content and text scaling:** the item description wraps; remaining time never truncates. At the
largest text size the remaining time stacks under the description rather than being dropped.
**Responsive:** Profile C is one item per reading-column block. Profile A places the feed as a dashboard
region that keeps its full item text at `profile-a.content-width.narrow` rather than compressing to an
icon and a count.

**Focus, keyboard and screen reader:** exposed as a list. A newly arrived item is not announced merely
for arriving; an item that changes what the actor can currently do is. Marking read announces nothing
and changes no business state. Opening an item and returning restores focus to it.

**Realization**

| Profile | Realization |
|---|---|
| C — Patient | `Native` — the landing feed and the notification centre share one item component |
| A — Clinic, Admin | `Extended` — a Filament dashboard widget over the scoped work projection; Filament's notification centre holds the duplicate entry for anything deadline-bearing |

**Prohibited:** a control here that reads as accepting, acknowledging or deciding anything; a business
status owned by the feed rather than by the referenced record; a deadline rendered by colour alone; a
fabricated remaining time; manufacturing activity on an empty attention surface; treating delivery as
the mechanism the deadline depends on.

**Placed on:** 4 screens — `SCR-PLATFORM-001`, `SCR-PLATFORM-003`, `SCR-PLATFORM-004`,
`SCR-PLATFORM-009`.

**Acceptance criteria**

1. Every deadline-bearing item appears on both the attention surface and the notification centre.
2. Marking an entry read changes no business state and no control here implies otherwise.
3. Opening an entry re-reads the authoritative record before rendering its state.
4. Remaining time is legible without colour.
5. With nothing pending, the Patient surface is near-empty and says so.

---

### WGT-PLATFORM-010 — Validation and correction region

**Purpose:** tell the actor exactly what is wrong with what they entered and let them fix only that,
with validation that is server-authoritative and input that survives every failure.

**Class:** region · **Platforms:** C, A · **Archetypes:** form, workspace · **Reach:** 62 of 165
**User intent:** find out precisely what is wrong and correct it without redoing my work.
**Requirements:** `FR-IDENTITY-001`, `FR-CLINICAL-006`, `FR-CLAIMS-001`, `NFR-PLATFORM-006`
**Data source:** the owning command's contract. `API-BOOKING-001`, `API-FINANCE-002`, `API-CLAIMS-001`
and `API-REVIEWS-001` are representative on Profile C; `SDC-IDENTITY-001`, `SDC-ELIG-001`,
`SDC-CLINICAL-001` and `SDC-CLAIMS-001` on Profile A.

**Composes** — mandatory core `CMP-PLATFORM-011`; conditional `CMP-PLATFORM-004` for the submit
control, `CMP-CLINICAL-002` `requested-changes` where a reviewer returned an itemised set,
`CMP-PLATFORM-010` where the failure is not field-attributable.
**Patterns:** `IX-PLATFORM-018` (owner), `IX-PLATFORM-001`, `IX-PLATFORM-002`, `IX-PLATFORM-005`.
**Content:** `TXT-PLATFORM-003`, `TXT-PLATFORM-004`, `TXT-PLATFORM-005`, `TXT-PLATFORM-006`,
`TXT-ERR-PLATFORM-001`.
**Accessibility:** `A11Y-PLATFORM-027` (owner), `A11Y-PLATFORM-026`, `A11Y-PLATFORM-006`,
`A11Y-PLATFORM-019`, `A11Y-PLATFORM-021`, `A11Y-PLATFORM-011`, `A11Y-PLATFORM-015`.

**Anatomy**

```
[ summary ]                                long forms only; counts the errors and links to each field
[ field ][ label ][ value ]
   [ message ]                             what is wrong AND how to fix it, bound to this field
[ submit ][ submission state ]             CMP-PLATFORM-011 inline; never an optimistic success
```

**Variants**

| Variant | Where | Difference |
|---|---|---|
| `inline` | Short forms | Field-bound messages only; no summary |
| `summary` | Long forms and workspaces | A summary that counts and links, in addition to field-bound messages |
| `itemised` | Requested changes | Only the flagged items are editable; everything else is visibly locked, so the actor does not redo the form |

**Data states**

| State | Behaviour |
|---|---|
| `loading-initial` | Fields render with their governed option sets loaded; a select whose options have not loaded is not offered as empty |
| `loading-refresh` | A re-read that changes a governed option set states the change rather than silently replacing a chosen value |
| `empty-no-data` | n/a for the form itself; applies to an embedded governed list that has no options, which states that rather than rendering an empty select |
| `empty-filtered` | n/a. A form is not a filtered projection |
| `partial` | A field whose governed options failed to load is unavailable with the reason, and submission is blocked with that reason named |
| `stale` | Submission is withdrawn against a stale precondition; the form re-reads first and the actor's input is preserved across the re-read |
| `error-fetch` | Input preserved entirely. Retry offered. Nothing is cleared |
| `error-permission` | The form is replaced by the denial block and the input is not silently discarded where the actor could still use it elsewhere |
| `success` | The commit proceeds under `IX-PLATFORM-001` and the surface re-reads authoritative state |
| Offline / unstable | The submit control states the condition; where the command is idempotent-resumable it queues and shows pending, never done |

**Right-to-left:** the message sits below its field in the block direction, which is direction-neutral.
A rejected value containing a Latin code is echoed back bidirectionally isolated, so the actor sees
exactly what was rejected.
**Long content and text scaling:** messages wrap in full. At 200 percent text scaling no field label,
no message and no submit control is lost, and the text-spacing overrides do not clip any of them.
**Responsive:** Profile C keeps the message visible without scrolling away from the field and the
on-screen keyboard must not cover it. Profile A uses the summary as the primary navigation between
errors on a long form; at `profile-a.content-width.narrow` a two-column form collapses to one and the
field order is unchanged.

**Focus, keyboard and screen reader:** on failure, focus moves to the **first field in error**, not to
the summary and not to the top of the form. Each summary entry is a link that moves focus to its field.
Correcting the last error does not move focus to submit. Every message is programmatically associated
with its field. Every field has a persistent visible label; a placeholder is never the label. The error
count is announced once, not per field.

**Realization**

| Profile | Realization |
|---|---|
| C — Patient | `Native` — field-bound messages with a summary only where the form is long |
| A — Clinic, Admin | `Stock` — Filament validation display configured rather than replaced, with the summary and the first-error focus behaviour added |

**Prohibited:** client-side validation treated as the contract; clearing any input on failure; a generic
message where a field is at fault; an error indicated by colour alone; a placeholder used as a label; a
domain precondition failure worded as invalid input; a retry that mints a new idempotency key when the
actor's intent has not changed.

**Placed on:** 62 screens, 62 `WF-*`.

**Acceptance criteria**

1. Every validation error is bound to a field where a field is at fault, and to the action where none is.
2. No failure clears any input, on either profile.
3. Focus moves to the first field in error on failure.
4. Correcting a field clears its own error without resubmitting.
5. At 200 percent text scaling and with text-spacing overrides applied, no label, message or control is
   lost.
6. A correction retry reuses the original idempotency key.

---

### WGT-PLATFORM-011 — Draft continuity bar

**Purpose:** make a resumable draft legible as a draft — saved, not submitted, invisible to the
counterparty, and resumable by the same actor — on the surfaces where abandoning would cost real work.

**Class:** region · **Platforms:** A · **Archetypes:** form, workspace · **Reach:** 10 of 165
**User intent:** stop in the middle and come back without losing anything or accidentally committing.
**Requirements:** `FR-IDENTITY-001`, `FR-CLINICAL-001`, `FR-CATALOG-003`, `NFR-PLATFORM-006`
**Data source:** `SDC-IDENTITY-001`, `SDC-ELIG-001`, `SDC-CLINICAL-001`, `SDC-CLAIMS-001`,
`SDC-CATALOG-001` and `SDC-POLICY-001`. On the Patient side the equivalent obligation is carried by
`API-PLATFORM-002` reconciliation rather than by a draft, so this widget is Profile A only.

**Composes** — mandatory core `CMP-PLATFORM-011`; conditional `CMP-PLATFORM-001` for the draft status,
`CMP-PLATFORM-006` `embedded` for section completeness, `CMP-PLATFORM-013` where the draft is owned by a
named person.
**Patterns:** `IX-PLATFORM-005` (owner), `IX-PLATFORM-008`, `IX-PLATFORM-001`.
**Content:** `TXT-PLATFORM-008`, `TXT-PLATFORM-010`, `TXT-PLATFORM-014`, `TXT-PLATFORM-019`.
**Accessibility:** `A11Y-PLATFORM-028` (owner), `A11Y-PLATFORM-011`, `A11Y-PLATFORM-009`,
`A11Y-PLATFORM-005`.

**Anatomy**

```
[ draft status ][ last saved ]             start to end; last saved is a time, never "saving..."
                                           left standing after it finished
[ section completeness ]                   what remains, per section, in any order
[ submit ]                                 unavailable, with what remains named, until complete
```

**Variants**

| Variant | Where | Difference |
|---|---|---|
| `sectioned` | Application and authoring workspaces | Section completeness is the primary content; sections complete in any order |
| `single` | One-form drafts | Last saved and the outstanding items only |

**Data states**

| State | Behaviour |
|---|---|
| `loading-initial` | The draft loads before any editable field is offered, so the actor never types into a form that is about to be replaced |
| `loading-refresh` | A save in flight shows as saving and resolves to a saved time; it never shows saved before the server confirms |
| `empty-no-data` | No draft exists yet: the bar states that starting creates one, and that a draft is not a submission |
| `empty-filtered` | n/a |
| `partial` | A section whose completeness could not be computed says so; submission is blocked with that named rather than allowed optimistically |
| `stale` | A draft edited elsewhere is detected on re-read; the actor is told rather than having one version silently win |
| `error-fetch` | Local edits are preserved and the bar states that the last save did not land. Nothing is discarded |
| `error-permission` | Authority to edit this draft was lost: editing is removed structurally and the actor is told what scope they now hold |
| `success` | Saved, with its time |
| Offline / unstable | Edits are held and the bar states plainly that the last save has not landed. It never shows a saved time it did not receive |

**Right-to-left:** the bar mirrors. The saved timestamp is bidirectionally isolated.
**Long content and text scaling:** section names wrap; the outstanding-items list never truncates. At
the largest text size the bar stacks above the form rather than becoming an icon.
**Responsive:** Profile A keeps the bar visible while the actor scrolls the form, without obscuring a
focused element. At `profile-a.content-width.narrow` the section completeness collapses into a labelled
disclosure while the draft status and last-saved time remain visible.

**Focus, keyboard and screen reader:** the draft status is announced when it changes from saving to
saved, once, politely. It is not announced on every keystroke. Section completeness is exposed as a
list and each section is reachable by keyboard. The submit control's unavailability reason is
programmatically associated with it. Focus is never moved by an autosave.

**Realization**

| Profile | Realization |
|---|---|
| C — Patient | `n/a` — no Patient surface carries a multi-section draft; interrupted Patient work is reconciled by `WGT-PLATFORM-012` instead |
| A — Clinic, Admin | `Custom` — Filament ships no draft-continuity contract with section completeness and a not-yet-submitted guarantee |

**Prohibited:** showing a draft as saved before the server confirms; a draft visible to the
counterparty; a submit control that is available while required items are outstanding; a linear wizard
that hides the shape of the task; an autosave that moves focus or steals a keystroke; presenting a
draft as a submitted record anywhere.

**Placed on:** 10 screens — `SCR-IDENTITY-012`, `SCR-IDENTITY-013`, `SCR-IDENTITY-014`,
`SCR-IDENTITY-017`, `SCR-ELIG-008`, `SCR-CLINICAL-010`, `SCR-CLINICAL-011`, `SCR-CLAIMS-007`,
`SCR-CATALOG-005`, `SCR-POLICY-002`.

**Acceptance criteria**

1. A draft is never visible to the counterparty and is never described as submitted.
2. Saved state is shown only after the server confirms.
3. Sections complete in any order; only submission is gated on completeness, and what remains is named.
4. An interrupted session resumes with every field intact.
5. Autosave never moves focus and never announces per keystroke.

---

### WGT-PLATFORM-012 — Submission reconciliation panel

**Purpose:** make the idempotency contract visible: every command the actor issued whose outcome is not
yet known, reconciled against authoritative state before any new command is offered. This is why a
timeout never becomes a duplicate booking.

**Class:** panel · **Platforms:** C · **Archetypes:** detail · **Reach:** 1 of 165

Allocated under the second clause of criterion 1: **one context, high consequence, substantial
complexity.** It composes four components, implements two interaction patterns end to end, spans three
domains, and encodes the rule that a retry reuses its original key while a new intent does not. Left
unspecified it would be re-derived per domain, which is how the duplicate this product exists to prevent
gets created.

**User intent:** find out whether the thing I tried actually happened, and finish it safely.
**Requirements:** `FR-PLATFORM-001`, `FR-BOOKING-001`, `FR-FINANCE-002`, `NFR-AUDIT-002`
**Data source:** `API-BOOKING-002`, `API-CLAIMS-003` and `API-FINANCE-005` — the authoritative reads
the panel reconciles against. It has no contract of its own, deliberately: a client-side queue that was
its own source of truth would be a second source of truth.

**Composes** — mandatory core `CMP-PLATFORM-011`, `CMP-PLATFORM-006`; conditional `CMP-PLATFORM-001` per
reconciled record, `CMP-PLATFORM-010` `unknown-outcome`, `CMP-PLATFORM-002` for the reconciled state.
**Patterns:** `IX-PLATFORM-004` (owner), `IX-PLATFORM-002`, `IX-PLATFORM-001`, `IX-PLATFORM-003`.
**Content:** `TXT-PLATFORM-008`, `TXT-PLATFORM-009`, `TXT-PLATFORM-010`, `TXT-ERR-AUDIT-001`.
**Accessibility:** `A11Y-PLATFORM-011`, `A11Y-PLATFORM-006`, `A11Y-PLATFORM-012`, `A11Y-PLATFORM-015`.

**Anatomy**

```
[ what you asked for ][ when ][ state ]     one row per outstanding command
   [ reconciled outcome ]                   the authoritative record, once the read resolves
   [ retry ]                                reuses the ORIGINAL idempotency key. A new key would be a
                                            new intent, and correcting nothing is not a new intent
```

**Variants** — the `queue` variant of `CMP-PLATFORM-011`, which is what this panel is. No second
variant exists: the `inline` and `banner` variants belong to `WGT-PLATFORM-003`.

**Data states**

| State | Behaviour |
|---|---|
| `loading-initial` | The panel reads authoritative state before rendering any outcome. It never reports from its local queue alone |
| `loading-refresh` | Reconciliation in progress is shown as in progress, not as unknown and not as failed |
| `empty-no-data` | Nothing outstanding: stated plainly. This is the normal case and is not an error |
| `empty-filtered` | n/a. The panel is not filtered |
| `partial` | Some commands reconciled and some did not; the unreconciled ones stay unknown and offer no new command |
| `stale` | A reconciliation read that failed leaves the command unknown with its as-of time. Unknown is a designed state, not an absence of information |
| `error-fetch` | Retry the reconciliation read, not the command. The distinction is the whole point |
| `error-permission` | Scope lost since the command was issued: the panel states that and offers no retry |
| `success` | The authoritative record, reachable, with the local entry cleared |
| Offline / unstable | The load-bearing condition. Outstanding commands persist across app restarts and reconcile on reconnection without the actor having to remember |

**Right-to-left:** rows mirror. Timestamps and record identifiers are bidirectionally isolated.
**Long content and text scaling:** the description of what was asked for wraps in full. The outcome is
never truncated.
**Responsive:** Profile C only, one row per reading-column block; the retry control never falls below the
comfortable target floor.

**Focus, keyboard and screen reader:** a reconciled outcome is announced politely and focus moves to the
resolved row. An unknown outcome is announced as unknown, never as failed. The panel is exposed as a
list.

**Realization**

| Profile | Realization |
|---|---|
| C — Patient | `Native` — a durable outstanding-command store reconciled against authoritative reads on resume |
| A — Clinic, Admin | `n/a` — the panel's condition is weak connectivity on a mobile device. Profile A reconciles in place through `WGT-PLATFORM-003` |

**Prohibited:** offering a new command while an outcome is unknown; a retry that mints a new idempotency
key; reporting an outcome from the local queue without an authoritative read; presenting an unknown
outcome as a failure; clearing an entry that has not reconciled.

**Placed on:** `SCR-PLATFORM-002`, `WF-PLATFORM-002`.

**Acceptance criteria**

1. No new command is offered against a record whose prior outcome is unknown.
2. A retry carries the original idempotency key; a changed intent carries a new one.
3. Outstanding entries survive an app restart and reconcile on reconnection.
4. An outcome is reported only after an authoritative read, never from the local queue.
5. Unknown, failed and completed are three distinct announced states.

---

### WGT-PLATFORM-013 — Itemized verification list

**Purpose:** let a reviewer verify, reject or request a change **per item, with provenance**, so an
approval is the sum of verified items rather than one global judgement — and so the applicant later
corrects only what was named.

**Class:** list · **Platforms:** A · **Archetypes:** form · **Reach:** 6 of 165
**User intent:** work through exactly what needs checking, record why for each, and leave a record the
next person can follow.
**Requirements:** `FR-IDENTITY-001`, `FR-ELIG-007`, `FR-AUDIT-001`
**Data source:** `SDC-IDENTITY-002`, `SDC-IDENTITY-005`, `SDC-ELIG-002`.

**Composes** — mandatory core `CMP-PLATFORM-013`; conditional `CMP-PLATFORM-006` `embedded` for the item
set, `CMP-PLATFORM-012` `review` where the item is evidence, `CMP-PLATFORM-014` where the item decision
is authoritative, `CMP-PLATFORM-001` per item state.
**Patterns:** `IX-PLATFORM-018`, `IX-PLATFORM-008`, `IX-PLATFORM-001`, `IX-AUDIT-001`.
**Content:** `TXT-PLATFORM-005`, `TXT-PLATFORM-010`, `TXT-PLATFORM-011`, `TXT-PLATFORM-016`.
**Accessibility:** `A11Y-PLATFORM-001`, `A11Y-PLATFORM-012`, `A11Y-PLATFORM-027`, `A11Y-PLATFORM-011`,
`A11Y-PLATFORM-015`, `A11Y-AUDIT-001`.

**Anatomy**

```
[ item ][ submitted value ][ provenance ][ outcome ]      one row per fact or evidence item
   [ reason ]                                             required on reject and on request-change;
                                                          it becomes the applicant's blocker text
[ outstanding count ]                                     what remains, so the reviewer knows when done
```

**Variants**

| Variant | Where | Difference |
|---|---|---|
| `facts` | Source-fact verification | Approving creates or activates governed truth with provenance |
| `evidence` | Evidence verification | Composes `CMP-PLATFORM-012` `review`; purpose-bound access, every view audited |
| `changes` | Request changes | Composes the itemised set the applicant will see, one reason per item |

**Data states**

| State | Behaviour |
|---|---|
| `loading-initial` | The item set and its provenance load together; an item with unknown provenance is not offered for approval |
| `loading-refresh` | Item outcomes refresh without losing an in-progress reason |
| `empty-no-data` | Nothing assigned: stated plainly, with no decision control |
| `empty-filtered` | Where the reviewer filters by competence or outcome, the filter is named as the cause |
| `partial` | Some item states loaded and some did not; an unloaded item is never counted as verified and the completion count says so |
| `stale` | Item outcomes with their as-of time; a decision is not committed against a stale item set |
| `error-fetch` | Reviewer input preserved; retry in place |
| `error-permission` | Items outside the reviewer's competence or assignment are not offered, and a scope loss removes decision controls structurally |
| `success` | Item outcomes, with the outstanding count |
| Offline / unstable | Rare on this profile; the same rule applies rather than a degraded one. Decision controls are withdrawn |

**Right-to-left:** columns mirror. Submitted values containing Latin identifiers, licence numbers and
registration codes are bidirectionally isolated; a reordered licence number is a wrong licence number.
**Long content and text scaling:** the submitted value and the reason wrap in full. Neither truncates,
because a reviewer comparing a truncated value is comparing the wrong thing.
**Responsive:** Profile A only. At `profile-a.content-width.wide` the item, value, provenance and
outcome sit in one row; at `narrow` each item stacks with its value directly above its outcome, and the
table's own bounded scroll is permitted while the page's is not.

**Focus, keyboard and screen reader:** the whole list is operable by keyboard, item by item, without a
pointer. Recording an outcome keeps focus on the item and announces the outstanding count politely.
The reason field carries a persistent visible label and its error is bound to it. An item's provenance
is part of its accessible name, not a hover-only detail.

**Realization**

| Profile | Realization |
|---|---|
| C — Patient | `n/a` — verification is a staff activity |
| A — Clinic, Admin | `Extended` — a Filament repeater or table with a per-row outcome and a required reason, plus a custom provenance slot. The framework's own bulk approve is not registered |

**Prohibited:** a bulk approve or bulk reject; a global reject with no itemisation, which forces the
applicant to redo the whole form; approving an item whose provenance did not load; using evidence before
its required scan succeeds; exposing storage paths, filenames or scanner internals; a rejection reason
that does not say what the counterparty must do.

**Placed on:** 6 screens — `SCR-IDENTITY-029`, `SCR-IDENTITY-030`, `SCR-IDENTITY-038`, `SCR-ELIG-015`,
`SCR-ELIG-016`, `SCR-ELIG-017`.

**Acceptance criteria**

1. Every outcome is recorded per item with its provenance and a reason where the outcome is negative.
2. No bulk approve or bulk reject control exists on any of the six surfaces.
3. A requested change is itemised, and the applicant surface locks everything that was not flagged.
4. Evidence cannot be marked usable before its required scan succeeds.
5. The outstanding count is accurate under a partial read and says so when it is not.

---

### WGT-PLATFORM-014 — Before-and-after disclosure block

**Purpose:** show what changed, from what to what, why, and on whose authority — for a patient deciding
whether to re-accept, and for an administrator inspecting a governed change. Two audiences, one
composition, because two would be two places for the disclosure obligation to be got wrong.

**Class:** panel · **Platforms:** C, A · **Archetypes:** detail, form, list-and-detail ·
**Reach:** 15 of 165
**User intent:** see exactly what is different before I accept it or rely on it.
**Requirements:** `FR-CLINICAL-007`, `FR-POLICY-002`, `FR-CATALOG-002`, `NFR-AUDIT-003`
**Data source:** `API-CLINICAL-002` on Profile C; `SDC-CLINICAL-001`, `SDC-POLICY-001`,
`SDC-CATALOG-001`, `SDC-CLAIMS-001`, `SDC-FINANCE-001`, `SDC-IDENTITY-001` and `SDC-AUDIT-001` on
Profile A.

**Composes** — mandatory core `CMP-CLINICAL-002`; conditional `CMP-PLATFORM-001` per version,
`CMP-PLATFORM-013` for who changed it, `CMP-CLINICAL-001` where the changed unit is a treatment line,
`CMP-ELIG-002` where the change moves an amount, `CMP-POLICY-001` where the change is a governed
version.
**Patterns:** `IX-CLINICAL-001`, `IX-POLICY-002`, `IX-PLATFORM-008`, `IX-PLATFORM-016`.
**Content:** `TXT-PLATFORM-013`, `TXT-PLATFORM-014`, `TXT-PLATFORM-018`, `TXT-STATE-CLINICAL-001`,
`TXT-STATE-POLICY-001`.
**Accessibility:** `A11Y-CLINICAL-001`, `A11Y-POLICY-001`, `A11Y-PLATFORM-012`, `A11Y-PLATFORM-015`,
`A11Y-FINANCE-001`, `A11Y-PLATFORM-030`.

**Anatomy**

```
[ what changed, in one sentence ]           the summary, before the detail, always
[ prior ][ new ]                            aligned rows, one per changed element, in logical order
[ unchanged, stated as unchanged ]          so absence of a row is not read as absence of a change
[ why, and on whose authority ]             CMP-PLATFORM-013
[ effect ]                                  what this governs, from when, and what it does not govern
```

**Variants** — the six `CMP-CLINICAL-002` variants, unchanged: `amendment` (patient-facing, disclosed
before acceptance is possible), `version` (governed catalog, procedure, commercial option and policy),
`requested-changes` (a reviewer's itemised requests against what was submitted), `deadline-history`
(original against effective, with the appended events that moved it), `resolution` (the disputed record
against the projection after the appended resolution), `reproduction` (reproduced outcome against
recorded, verdict is match or mismatch).

**Data states**

| State | Behaviour |
|---|---|
| `loading-initial` | Both sides load before either renders. A one-sided diff is a misleading diff |
| `loading-refresh` | A newer version arriving while the block is open states that rather than swapping the comparison underneath the reader |
| `empty-no-data` | No change exists: stated plainly. On the `amendment` variant this means the current version is the accepted one |
| `empty-filtered` | n/a. A comparison is not filtered |
| `partial` | If one side failed to load, the block does **not** render a diff. It states which side is missing, because a partial diff reads as a complete one |
| `stale` | Comparison carries its as-of time; acceptance is never offered against a stale comparison |
| `error-fetch` | Retry in place; neither side is rendered alone |
| `error-permission` | A version outside the actor's purpose scope is not returned and the block says the comparison is scope-limited |
| `success` | The aligned comparison |
| Offline / unstable | Last read comparison with as-of time; acceptance is withdrawn |

**Right-to-left:** prior and new sit in logical order and mirror together, so the reader's before is
always at the logical `start`. Version identifiers, content hashes, amounts and effective dates are
bidirectionally isolated.
**Long content and text scaling:** a changed value never truncates on either side. At the largest text
size the two sides stack, prior first, with each row's pair kept adjacent so the comparison survives.
**Responsive:** Profile C stacks prior and new vertically per changed element at every size class; a
side-by-side diff does not fit a reading column and splitting it would break the pairing. Profile A
keeps two columns at `profile-a.content-width.wide` and stacks per row at `narrow`.

**Focus, keyboard and screen reader:** each changed element is announced as a pair — element, prior
value, new value — so the association survives without the visual layout. On the `amendment` variant,
focus moves to the change set when the amendment first becomes viewable and **deliberately not onto the
accept control**, so an in-flight keystroke cannot commit an irreversible acceptance. On Profile A the
comparison is keyboard traversable row by row.

**Realization**

| Profile | Realization |
|---|---|
| C — Patient | `Native` — a stacked pairwise comparison with the summary first |
| A — Clinic, Admin | `Custom` — Filament ships no aligned before-and-after with an authority slot and an unchanged-is-stated rule |

**Prohibited:** rendering a diff when one side did not load; presenting an unaccepted amendment as
governing anything; a change disclosed only after acceptance is possible; overwriting the prior version
anywhere in the rendering; a mismatch on the `reproduction` variant treated as a correction rather than
as an integrity exception; a colour-only diff.

**Placed on:** 15 screens — `SCR-CLINICAL-003`, `SCR-CLINICAL-004`, `SCR-CLINICAL-013`,
`SCR-CLINICAL-019`, `SCR-IDENTITY-017`, `SCR-CLAIMS-007`, `SCR-CLAIMS-011`, `SCR-CATALOG-004`,
`SCR-CATALOG-008`, `SCR-CATALOG-010`, `SCR-ELIG-019`, `SCR-FINANCE-011`, `SCR-POLICY-001`,
`SCR-POLICY-003`, `SCR-POLICY-004`.

**Acceptance criteria**

1. On the `amendment` variant, the change set is disclosed and reachable before acceptance is offered.
2. A partial read renders no diff and names the missing side.
3. Unchanged elements are stated as unchanged rather than omitted.
4. Each changed element announces as element, prior value, new value.
5. Focus never lands on the accept control as a side effect of disclosure.
6. A reproduction mismatch raises an integrity exception and changes no stored history.
