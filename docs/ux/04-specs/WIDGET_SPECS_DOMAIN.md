# Widget Specifications — Domain Widgets

**Phase:** UX 4 — Widget and Screen Specifications
**Index, allocation rule and refused candidates:** `WIDGET_SPECS.md`
**Cross-cutting blocks:** `WIDGET_SPECS_PLATFORM.md`
**Placement:** `SCREEN_SPEC_MAP.md` is authoritative.

The rules stated once at the head of `WIDGET_SPECS_PLATFORM.md` bind every block here too and are not
repeated: logical properties only, no Profile C hover, hidden is not disabled, read-only is not
disabled, semantic tokens only, the nine-state precedence belongs to `IX-PLATFORM-017`, and no canonical
`ERR-*` message is ever restated.

---

### WGT-IDENTITY-001 — Verification challenge form

**Purpose:** run a contact-verification challenge so that send throttling, attempt exhaustion and
expiry read as three different situations with three different recoveries, and so that verification is
never a cognitive test.

**Class:** form · **Platforms:** C, A · **Archetypes:** form, detail · **Reach:** 6 of 165
**User intent:** prove this number is mine and get on with what I came to do.
**Requirements:** `FR-IDENTITY-002`, `FR-IDENTITY-001`
**Data source:** `API-IDENTITY-001`, `API-IDENTITY-002` on Profile C; `SDC-IDENTITY-001`,
`SDC-IDENTITY-003`, `SDC-IDENTITY-004` on Profile A.

**Composes** — mandatory core `CMP-PLATFORM-011`; conditional `CMP-PLATFORM-005` `throttled` for the
resend window, `CMP-PLATFORM-004` for the submit and resend controls, `CMP-PLATFORM-010`
`authentication-required` where the challenge was reached from a gated action.
**Patterns:** `IX-PLATFORM-018`, `IX-PLATFORM-001`, `IX-PLATFORM-002`, `IX-PLATFORM-012`.
**Content:** `TXT-PLATFORM-003`, `TXT-PLATFORM-005`, `TXT-PLATFORM-011`, `TXT-ERR-IDENTITY-003`,
`TXT-ERR-IDENTITY-004`.
**Accessibility:** `A11Y-PLATFORM-029` (owner), `A11Y-PLATFORM-026`, `A11Y-PLATFORM-027`,
`A11Y-PLATFORM-011`, `A11Y-PLATFORM-013`, `A11Y-PLATFORM-019`.

**Anatomy**

```
[ what we are verifying ]                  the number or address, echoed, bidirectionally isolated
[ code entry ]                             one labelled field; paste and autofill are never blocked
[ submit ]
[ resend ][ remaining wait ]               the wait is a running window, not a static sentence
[ change the number ]                      always reachable; a wrong number is the common case
```

**Variants**

| Variant | Where | Difference |
|---|---|---|
| `request` | Number entry and challenge creation | No code field yet; the throttle window governs the send control |
| `verify` | Code entry | Attempts remaining is a fact the actor needs before their last one, not after |
| `panel-signin` | Clinic and Admin sign-in | Framework login, extended. Privileged production roles additionally require a non-SMS second factor |

**Data states**

| State | Behaviour |
|---|---|
| `loading-initial` | The challenge context loads before the field is offered, so the actor never types into a field for an expired challenge |
| `loading-refresh` | A resend replaces the prior code and says so; accumulated failures are not reset by it |
| `empty-no-data` | n/a. A challenge form always has a subject |
| `empty-filtered` | n/a |
| `partial` | If the throttle window is unknown, the resend control states that rather than showing a fabricated countdown |
| `stale` | An expired challenge is stated as expired with the route to a new one; it is never left looking valid |
| `error-fetch` | The entered code is preserved and retry is offered |
| `error-permission` | An identity with no active grant is denied with the reason, never shown an empty panel |
| `success` | Verified; the actor returns to the surface that gated them, with its context restored |
| Offline / unstable | The submit control states the condition. A code is never treated as verified locally |

**Right-to-left:** the code field accepts digits in logical order and the entered value is
bidirectionally isolated so it reads back exactly as typed. The echoed phone number is isolated.
**Long content and text scaling:** the remaining-wait line wraps; the number never truncates. At the
largest text size the field, submit and resend stack in that order.
**Responsive:** Profile C keeps field, submit and resend within one screen height so the on-screen
keyboard does not hide the resend control. Profile A uses the framework login layout unchanged.

**Focus, keyboard and screen reader:** focus enters on the code field. The remaining wait is announced
politely when it starts and when it ends, not on every tick. Attempts remaining is announced with the
failure. **Paste, password managers and platform autofill are never blocked**, and no step asks the
actor to transcribe, calculate or recognise anything.

**Realization**

| Profile | Realization |
|---|---|
| C — Patient | `Native` — a single code field with platform autofill enabled |
| A — Clinic, Admin | `Extended` — Filament's stock login, extended with the throttle window, the attempts-remaining statement and, for privileged production roles, the non-SMS second factor |

**Prohibited:** revealing whether a number belongs to an existing account; a fabricated countdown;
blocking paste or autofill; a puzzle, transcription or memory test as any part of authentication;
resetting accumulated failures on resend; treating an SMS factor as sufficient for a privileged
production role.

**Placed on:** 6 screens — `SCR-IDENTITY-002`, `SCR-IDENTITY-003`, `SCR-IDENTITY-011`,
`SCR-IDENTITY-019`, `SCR-IDENTITY-025`, `SCR-PLATFORM-005`.

**Acceptance criteria**

1. Throttled send, invalid code, expired code and exhausted attempts each produce a distinct recovery.
2. The remaining wait is shown only when the server provided it.
3. Paste and platform autofill work in the code field on both profiles.
4. Resend invalidates the prior code and does not reset accumulated failures.
5. No response distinguishes an existing account from a new one.

---

### WGT-IDENTITY-002 — Authorization grant panel

**Purpose:** make the exact scope being granted legible **before** it is granted, and keep revocation
reachable regardless of what else is happening to the subject's records. An over-broad grant is an
authorization breach across every interface, and a revocation that a booking can block is not a
revocation.

**Class:** panel · **Platforms:** C, A · **Archetypes:** detail, form · **Reach:** 13 of 165
**User intent:** know precisely who can act for whom, on what, until when, and stop it immediately.
**Requirements:** `FR-IDENTITY-003`, `FR-IDENTITY-001`, `FR-AUDIT-001`
**Data source:** `API-IDENTITY-003`, `API-IDENTITY-004`, `API-IDENTITY-005`, `API-IDENTITY-006` on
Profile C; `SDC-IDENTITY-003`, `SDC-IDENTITY-004`, `SDC-IDENTITY-005` on Profile A.

**Composes** — mandatory core `CMP-PLATFORM-003`, `CMP-PLATFORM-004`; conditional `CMP-PLATFORM-006`
`embedded` for the grant and invitation list, `CMP-PLATFORM-005` for an effective period,
`CMP-PLATFORM-014` `destructive` for revocation, `CMP-PLATFORM-013` for the approving authority,
`CMP-PLATFORM-001` per grant state.
**Patterns:** `IX-PLATFORM-007` (owner), `IX-AUDIT-001`, `IX-PLATFORM-001`, `IX-PLATFORM-018`.
**Content:** `TXT-PLATFORM-012`, `TXT-PLATFORM-016`, `TXT-PLATFORM-017`, `TXT-STATE-IDENTITY-002`.
**Accessibility:** `A11Y-PLATFORM-014`, `A11Y-PLATFORM-016`, `A11Y-PLATFORM-012`, `A11Y-PLATFORM-027`,
`A11Y-PLATFORM-011`, `A11Y-AUDIT-001`.

**Anatomy**

```
[ who may act ][ for whom ][ on what ]     the three facts that define a grant, always together
[ effective from ][ until ]                a period, not a switch
[ basis ]                                  guardian, legal-basis approval, or delegated staff scope
[ revoke ]                                 always reachable while the grant is active
[ history ]                                expired and revoked grants stay visible; attribution is
                                           never deleted
```

**Variants**

| Variant | Where | Difference |
|---|---|---|
| `family` | Patient family and representation | Two directions on one surface: the patient is both grantor and potential grantee, and the distinction is never ambiguous |
| `staff` | Clinic people and grants, invitations | The inviter may only offer capabilities and branches they themselves hold. That is a constraint on what the surface can present, not a validation message |
| `oversight` | Admin guardian and staff grant oversight | Read and audit. Administrative revocation only where the governing legal-basis workflow authorizes it |

**Data states**

| State | Behaviour |
|---|---|
| `loading-initial` | The grant set loads before any control; a revoke control over an unknown grant is not offered |
| `loading-refresh` | Grant states refresh; a grant that changed while open states the change rather than swapping silently |
| `empty-no-data` | No grants: stated plainly, with the one action that creates the first one where the actor may |
| `empty-filtered` | Where the surface filters by state, the applied filter is named as the cause |
| `partial` | A grant whose scope did not load is shown as scope-unknown and offers no action, because an unknown scope must never read as full scope |
| `stale` | Grant states carry their as-of time; no grant is acted on against a stale read |
| `error-fetch` | The known set is preserved with retry |
| `error-permission` | Delegation authority lost: creation and revocation are removed structurally and the remaining view is read-only |
| `success` | The grant set with its history |
| Offline / unstable | Read-only. Revocation is a security action and is never queued optimistically |

**Right-to-left:** the three grant facts sit in logical order. Grantee identifiers and effective dates
are bidirectionally isolated.
**Long content and text scaling:** a capability list wraps in full; a scope is never truncated, because
a truncated scope is an unread scope. At the largest text size each grant stacks with scope directly
beneath the parties.
**Responsive:** Profile C stacks the grant facts in the reading column. Profile A keeps the grant list
as a table at `profile-a.content-width.wide` and degrades to `reading-list` at `narrow`, because a
truncated scope column is exactly the failure this widget exists to prevent.

**Focus, keyboard and screen reader:** the scope is part of each grant's accessible name, not a
hover-only detail. Revocation is separated from any adjacent primary action and uses the destructive
role in both the trigger and the confirmation. After revocation, focus moves to the updated grant list
and the change is announced. On Profile A the whole panel is keyboard operable.

**Realization**

| Profile | Realization |
|---|---|
| C — Patient | `Native` — grantor and grantee views on one surface, with revocation reachable from the grant detail |
| A — Clinic, Admin | `Extended` — a Filament resource over grants and invitations, with the delegable-scope constraint applied to the form's option set rather than validated after the fact |

**Prohibited:** a revocation that any booking, case or downstream state can block; a guardian
self-authorizing a dependent's grant; offering a capability the inviter does not hold; deleting an
expired or revoked grant from history; presenting a coarse role as if it granted data access; an
administrator self-granting a scope to bypass a policy that requires another accountable reviewer;
implying that switching context creates authority.

**Placed on:** 13 screens — `SCR-IDENTITY-005`, `SCR-IDENTITY-006`, `SCR-IDENTITY-007`,
`SCR-IDENTITY-008`, `SCR-IDENTITY-022`, `SCR-IDENTITY-023`, `SCR-IDENTITY-024`, `SCR-IDENTITY-026`,
`SCR-IDENTITY-033`, `SCR-IDENTITY-034`, `SCR-IDENTITY-035`, `SCR-IDENTITY-037`, `SCR-IDENTITY-038`.

**Acceptance criteria**

1. Revocation is reachable and succeeds regardless of booking, case or claim state, and no
   booking-domain error can appear on a revocation surface.
2. The full scope of a grant is legible before it is created or accepted, without truncation.
3. An inviter is offered only capabilities and branches they hold.
4. Revoked and expired grants remain visible, and historical attribution is unchanged.
5. Revocation takes effect for subsequent actions immediately, including from an already-open page.

---

### WGT-ELIG-001 — Provider option set

**Purpose:** render one provider, service and branch option with the attribute set `PO-UX-04` fixes, in
whichever of four arrangements the surface needs — and make a composite ranking structurally impossible
by never assembling one.

**Class:** list · **Platforms:** C · **Archetypes:** detail, form · **Reach:** 5 of 165
**User intent:** choose who to see, on facts I can check, without being ranked at.
**Requirements:** `FR-ELIG-001`, `FR-ELIG-005`, `FR-ELIG-018`, `FR-ELIG-006`
**Data source:** `API-ELIG-001`. The option set is exactly what that contract returns and nothing
assembled beside it.

**Composes** — mandatory core `CMP-ELIG-001`; conditional `CMP-ELIG-002` for the governed price display,
`CMP-PLATFORM-001` for the availability state, `CMP-PLATFORM-002` where the surface explains a state,
`CMP-PLATFORM-004` for the choose action.
**Patterns:** `IX-ELIG-001`, `IX-PLATFORM-014`, `IX-PLATFORM-015`, `IX-PLATFORM-008`.
**Content:** `TXT-PLATFORM-013`, `TXT-PLATFORM-017`, `TXT-PLATFORM-018`, `TXT-STATE-ELIG-001`.
**Accessibility:** `A11Y-PLATFORM-012`, `A11Y-PLATFORM-013`, `A11Y-PLATFORM-015`, `A11Y-FINANCE-001`,
`A11Y-PLATFORM-023`, `A11Y-PLATFORM-035`.

**Anatomy**

```
[ provider ][ exact branch and area ]      one option is one doctor, one service, one branch
[ selected service ]                       the option is scoped to it; there is no provider profile
[ practical availability ][ assessed ]     what it means, and when it was assessed
[ price, in its governed display mode ]    free, fixed, from, range, or requires-a-plan
[ protection meaning ]                     what it means, never insurance and never a guarantee
[ verified rating and count ]              where available; independent of eligibility
[ nearest appointment ]                    where available
[ choose ]
```

**Variants** — the four `CMP-ELIG-001` variants: `row` (results), `card` (decision card), `column`
(two or three options side by side, attributes aligned across columns, **no column marked best**),
`chosen` (read-only echo on slot selection and request review).

**Data states**

| State | Behaviour |
|---|---|
| `loading-initial` | Option skeletons at row height. No partial option is rendered: an option missing its price or its availability is not an option yet |
| `loading-refresh` | Options stay; an option that stopped being eligible is marked unavailable and **loses its choose action** rather than silently remaining bookable |
| `empty-no-data` | No eligible option for this service: stated as no currently available provider for this service, never as no dentistry existing |
| `empty-filtered` | An area or availability filter excluded everything: the filter is named as the cause and relaxing it is the recovery |
| `partial` | A rating or nearest-appointment that did not load is absent and stated as unavailable, never rendered as zero or as none |
| `stale` | Options carry their assessment time. A stale assessment is itself information the patient needs |
| `error-fetch` | The query is preserved so retry does not mean re-entering the service and area |
| `error-permission` | n/a in the public case. Where a grant scopes the search, a scope loss renders as denial rather than as no results |
| `success` | Options |
| Offline / unstable | Last result set with its as-of time; choosing states that it needs a connection, because booking revalidates server-side |

**Right-to-left:** attributes flow start to end and mirror. Amounts with currency, branch codes and
service codes are bidirectionally isolated. In the `column` variant the columns mirror as a group so the
comparison reads in the same order.
**Long content and text scaling:** a long Arabic clinic name wraps; the price, the availability meaning
and the assessment time never truncate. At the largest text size the `column` variant collapses to
stacked options in the same order, because a three-column comparison in one reading column is unreadable
rather than merely tight.
**Responsive:** Profile C only. `compact` shows one option per reading-column block; `medium` and
`expanded` may place two or three comparison columns side by side for the `column` variant only, and
task order is identical at every size class.

**Focus, keyboard and screen reader:** each option announces as a single unit with its attributes in
the fixed order, so two options are comparable without sight. Selecting an option for comparison
announces the selection count against the cap. The choose action is the last element in the option.

**Realization**

| Profile | Realization |
|---|---|
| C — Patient | `Native` — one option component with four arrangements |
| A — Clinic, Admin | `n/a` — provider discovery is a patient activity |

**Prohibited:** any composite or best-doctor score; a ranking presented as quality; exposing internal
`I`, `K` or `EU`, a service risk level, a comparison value, a sample count or a confidence figure;
labelling any price a market average, a city average, a tariff or a recommended price; presenting a
from-amount or a range as a quoted total; a free service rendered as missing data; implying that price
or reviews affect scientific eligibility; a cross-service comparison; more than three comparison
options; a saved or favourited comparison, which V1 does not have.

**Placed on:** 5 screens — `SCR-ELIG-002`, `SCR-ELIG-003`, `SCR-ELIG-005`, `SCR-BOOKING-001`,
`SCR-BOOKING-002`.

**Acceptance criteria**

1. The four arrangements render the same attribute set in the same order.
2. No surface renders a composite score, a rank, or any internal classification symbol.
3. A price renders in its governed display mode, and a from-amount or range reads as a starting point
   or span.
4. An option that stops being eligible loses its choose action within the same session.
5. Comparison is capped at three options of one service, and no option is marked best.
6. Booking from any arrangement enters the ordinary path and revalidates at commit.

---

### WGT-ELIG-002 — Eligibility decision block

**Purpose:** state the controlling reason a provider, service and branch combination is or is not
currently available, in the audience's terms, with **pending evaluation visibly distinct from a negative
outcome** and no internal symbol reachable outside the one explicitly authorized projection.

**Class:** panel · **Platforms:** C, A · **Archetypes:** detail, form, list-and-detail ·
**Reach:** 13 of 165
**User intent:** understand why this is or is not available, and what would change it.
**Requirements:** `FR-ELIG-016`, `FR-ELIG-017`, `FR-ELIG-007`, `FR-ELIG-013`
**Data source:** `API-ELIG-002` on Profile C; `SDC-ELIG-002`, `SDC-ELIG-003`, `SDC-ELIG-004` on
Profile A.

**Composes** — mandatory core `CMP-ELIG-003`; conditional `CMP-PLATFORM-002` for the state summary,
`CMP-PLATFORM-001` per scope, `CMP-PLATFORM-013` `computed-by-system` where the system evaluated,
`CMP-PLATFORM-006` `embedded` for the blocker list, `CMP-POLICY-001` for the governing policy version on
the reviewer variant.
**Patterns:** `IX-ELIG-001` (owner), `IX-PLATFORM-007`, `IX-PLATFORM-008`, `IX-PLATFORM-003`.
**Content:** `TXT-PLATFORM-010`, `TXT-PLATFORM-017`, `TXT-PLATFORM-018`, `TXT-STATE-ELIG-001`,
`TXT-ERR-ELIG-001`, `TXT-ERR-ELIG-002`.
**Accessibility:** `A11Y-PLATFORM-015`, `A11Y-PLATFORM-009`, `A11Y-PLATFORM-011`, `A11Y-PLATFORM-023`,
`A11Y-PLATFORM-012`, `A11Y-PLATFORM-016`.

**Anatomy**

```
[ scope ]                                  the exact provider, service and branch. There is no single
                                           provider status
[ outcome ]                                the state, as a tone-icon-label triple
[ controlling reason ]                     in the audience's terms
[ assessed at ]                            a stale assessment is information
[ what would change it ]                   provider and reviewer variants only; each blocker links to
                                           the action that resolves it
[ reevaluation state ]                     so nobody resubmits something already queued
```

**Variants** — the four `CMP-ELIG-003` variants: `patient` (practical meaning; whether to wait or
choose someone else; no gate list, no internal value, no policy version), `provider` (the controlling
blocker and the remediation the provider owns), `reviewer` (every evaluated gate result, the controlling
gate, the evaluation time and the governing policy version, to explicitly authorized roles within
scope), `suspension` (a suspended scope with its invalid dependency, its recalculation state, and the
bookings it holds).

**Data states**

| State | Behaviour |
|---|---|
| `loading-initial` | No outcome is rendered until the scope and the decision resolve together. An outcome without its scope is a wrong outcome |
| `loading-refresh` | A decision that changes while the actor is viewing it is announced; if it blocks the actor's current intent, focus moves to this block |
| `empty-no-data` | No activation request or decision exists for this scope yet: stated as not yet assessed, which is not a negative outcome |
| `empty-filtered` | Where scopes are filtered, the filter is named as the cause and the unfiltered scope count stays visible |
| `partial` | Some scopes resolved and some did not; an unresolved scope is not rendered as eligible or as failing |
| `stale` | The assessment time is always shown, so staleness is visible by construction rather than as an exception |
| `error-fetch` | The last known decision is preserved with its as-of time and retry |
| `error-permission` | The `reviewer` projection is offered only to explicitly authorized roles; a denial states the scope limit and never degrades silently to a shorter explanation |
| `success` | The decision, with its controlling reason |
| Offline / unstable | Last known decision with as-of time. No action that depends on current eligibility is offered |

**Right-to-left:** scope, outcome and reason sit in logical order. Service codes, branch identifiers,
policy version identifiers and timestamps are bidirectionally isolated.
**Long content and text scaling:** the controlling reason is never truncated at any size, on any
variant. A blocker's description wraps in full.
**Responsive:** Profile C stacks scope, outcome, reason and assessment time in the reading column.
Profile A keeps the block in the primary region; at `profile-a.content-width.narrow` the blocker list
stacks beneath the outcome and each blocker's resolving action stays with it.

**Focus, keyboard and screen reader:** the outcome announces as a triple, never as a colour. A change
that blocks the actor's current intent announces assertively and moves focus here; a change that does
not announces politely without moving focus. Each blocker is a keyboard-reachable link to its resolving
action on Profile A.

**Realization**

| Profile | Realization |
|---|---|
| C — Patient | `Native` — the `patient` variant only. No other variant is reachable from a Patient surface |
| A — Clinic, Admin | `Custom` — the audience projection is a field-filtering obligation, so one component with a server-filtered projection rather than three components that could drift apart |

**Prohibited:** rendering `PENDING_EVALUATION` as a negative outcome or as grade `F`; exposing raw
internal `I`, `K`, `EU`, the uncapped result or the applied-cap reason anywhere except the one
explicitly authorized reviewer projection; any control that selects, edits or overrides an outcome, at
any role; a single provider-wide eligibility status; presenting a suspension as affecting scopes it does
not affect; asserting a held booking's outcome from this block, which belongs to the governed review.

**Placed on:** 13 screens — `SCR-ELIG-004`, `SCR-ELIG-007`, `SCR-ELIG-008`, `SCR-ELIG-011`,
`SCR-ELIG-012`, `SCR-ELIG-013`, `SCR-ELIG-014`, `SCR-ELIG-015`, `SCR-ELIG-018`, `SCR-ELIG-020`,
`SCR-ELIG-021`, `SCR-ELIG-022`, `SCR-BOOKING-014`.

**Acceptance criteria**

1. Pending evaluation and a negative outcome differ in tone, icon, label and recovery on every variant.
2. No Patient or Clinic surface can reach a raw internal classification component.
3. No control anywhere sets, edits or overrides an eligibility outcome.
4. Every blocker on the provider variant names the item and links to the action that resolves it.
5. The assessment time is present on every rendering of an outcome.
6. A suspension names exactly the affected scopes and states which are unaffected.

---

### WGT-BOOKING-001 — Slot and capacity selector

**Purpose:** offer a time from advisory availability while making it structurally clear that capacity is
resolved atomically at commit — so a slot disappearing between display and submit is a designed path,
not an anomaly the interface has to apologise for.

**Class:** panel · **Platforms:** C, A · **Archetypes:** detail, form, list-and-detail ·
**Reach:** 4 of 165
**User intent:** pick a time that will actually hold.
**Requirements:** `FR-BOOKING-001`, `FR-BOOKING-004`, `FR-ELIG-006`
**Data source:** `API-ELIG-001` and `API-BOOKING-001` on Profile C; `SDC-BOOKING-001`,
`SDC-BOOKING-002` on Profile A.

**Composes** — mandatory core `CMP-PLATFORM-001`; conditional `CMP-PLATFORM-006` `selectable` where
slots are listed, `CMP-PLATFORM-005` where a response or proposal deadline runs, `CMP-PLATFORM-004` for
the choose or propose action, `CMP-ELIG-001` `chosen` for the option echo.
**Patterns:** `IX-ELIG-001` (owner), `IX-PLATFORM-001`, `IX-PLATFORM-012`, `IX-PLATFORM-003`.
**Content:** `TXT-PLATFORM-004`, `TXT-PLATFORM-008`, `TXT-PLATFORM-020`, `TXT-ERR-BOOKING-001`.
**Accessibility:** `A11Y-PLATFORM-013`, `A11Y-PLATFORM-012`, `A11Y-PLATFORM-003`, `A11Y-PLATFORM-015`,
`A11Y-PLATFORM-019`, `A11Y-PLATFORM-030`.

**Anatomy**

```
[ chosen option ]                          read-only echo, so the actor confirms what they picked
[ day ]                                    a grouping, not a calendar widget requiring gestures
   [ slot ][ availability ]                one selectable unit per slot
[ advisory notice ]                        availability is advisory; the time is held at commit
```

**Variants**

| Variant | Where | Difference |
|---|---|---|
| `choose` | Patient slot selection | Selection only; commit happens on the review surface |
| `configure` | Clinic availability and slots | Capacity is authored here, and reducing it below existing confirmed bookings requires an explicit answer rather than silent acceptance |
| `propose` | Clinic propose alternative, Patient reschedule proposal | A proposed slot, carried alongside the original rather than replacing it |

**Data states**

| State | Behaviour |
|---|---|
| `loading-initial` | Slot skeletons per day group; no day is rendered as having no slots until its read completes |
| `loading-refresh` | Slots refresh without moving the actor's current selection; a selected slot that disappeared is marked unavailable in place |
| `empty-no-data` | No availability published for this scope: stated as no times currently offered, with the route to the provider's other branches where they exist |
| `empty-filtered` | A date-range filter excluded everything: the range is named as the cause |
| `partial` | Some day groups loaded and some did not; an unloaded day says so rather than appearing empty |
| `stale` | Availability carries its as-of time. This surface is the clearest case where stale-and-labelled beats blank |
| `error-fetch` | The chosen option and any selection are preserved; retry in place |
| `error-permission` | On the `configure` variant, branch scope loss removes authoring controls structurally |
| `success` | Slots, with the advisory notice |
| Offline / unstable | Last known availability with as-of time; selecting is allowed, committing states that it needs a connection |

**Right-to-left:** day groups and slots flow start to end and mirror. Times, dates and durations are
bidirectionally isolated; Arabic-Indic or Western digits follow the numeral rule in
`TXT-PLATFORM-020` and never mix within one value.
**Long content and text scaling:** a slot label never truncates. At the largest text size slots stack
one per row rather than shrinking below the target floor.
**Responsive:** Profile C groups slots by day within the reading column; a grid that requires horizontal
scrolling is not used, because the target floor and one reading column together forbid it. Profile A
keeps a day-by-slot layout at `profile-a.content-width.wide` and stacks by day at `narrow`.

**Focus, keyboard and screen reader:** slots are a selectable list, not a canvas. Each slot announces
its day, time and availability. Selection is announced. On Profile A every slot is keyboard reachable
and the `configure` variant is fully operable without a pointer. No gesture is required anywhere; every
gesture has a control equivalent.

**Realization**

| Profile | Realization |
|---|---|
| C — Patient | `Native` — a grouped selectable list, never a custom calendar canvas |
| A — Clinic, Admin | `Extended` — a Filament form section over the availability projection, with the capacity-reduction question rendered as an explicit decision |

**Prohibited:** presenting advisory availability as a held reservation; treating a lost slot as an error
the patient caused; reducing capacity below existing confirmed bookings without an explicit answer;
a gesture-only slot picker; a slot control below the target floor at any density; mixing numeral systems
within one time value.

**Placed on:** 4 screens — `SCR-BOOKING-001`, `SCR-BOOKING-007`, `SCR-BOOKING-010`, `SCR-BOOKING-016`.

**Acceptance criteria**

1. The surface states that availability is advisory and capacity is resolved at commit.
2. A slot that becomes unavailable is marked in place and loses its selection, without discarding the
   rest of the actor's context.
3. Every slot is reachable by keyboard on Profile A and by a control, not only a gesture, on Profile C.
4. Reducing configured capacity below existing confirmed bookings requires an explicit answer.
5. No slot control falls below the target floor at any density.

---

### WGT-BOOKING-002 — Proposal without displacement

**Purpose:** keep the original confirmed appointment authoritative while a proposal is pending. Showing
the proposed time as though it were the appointment is the specific failure this widget exists to
prevent, and it is a failure that sends a patient to a clinic on the wrong day.

**Class:** panel · **Platforms:** C, A · **Archetypes:** form, list-and-detail · **Reach:** 4 of 165
**User intent:** understand which appointment currently holds, and decide about the other one.
**Requirements:** `FR-BOOKING-003`, `FR-BOOKING-004`, `FR-BOOKING-002`
**Data source:** `API-BOOKING-003`, `API-BOOKING-004`, `API-BOOKING-006`, `API-BOOKING-007` on
Profile C; `SDC-BOOKING-001`, `SDC-BOOKING-002` on Profile A.

**Composes** — mandatory core `CMP-PLATFORM-001`, `CMP-PLATFORM-005`; conditional `CMP-PLATFORM-002`
for the booking's own state summary, `CMP-PLATFORM-004` for accept and decline, `CMP-PLATFORM-006`
`embedded` where several proposals are listed, `CMP-PLATFORM-011` for the commit state.
**Patterns:** `IX-BOOKING-002` (owner), `IX-BOOKING-001`, `IX-ELIG-001`, `IX-PLATFORM-001`.
**Content:** `TXT-PLATFORM-010`, `TXT-PLATFORM-011`, `TXT-PLATFORM-018`, `TXT-STATE-BOOKING-001`,
`TXT-STATE-BOOKING-002`, `TXT-ERR-BOOKING-003`.
**Accessibility:** `A11Y-PLATFORM-015`, `A11Y-PLATFORM-011`, `A11Y-PLATFORM-006`, `A11Y-PLATFORM-014`,
`A11Y-PLATFORM-023`, `A11Y-PLATFORM-030`.

**Anatomy**

```
[ your appointment ]                       the ORIGINAL, first, labelled as the one that currently holds
   [ state ][ when ][ where ]
[ proposed instead ]                       second, labelled as a proposal
   [ when ][ who proposed ][ decide by ]
[ accept ][ decline ]                      counterparty only. A party cannot respond to its own proposal
```

The order is fixed. The original is always first and always labelled as authoritative, at every size
class and in both directions.

**Variants**

| Variant | Where | Difference |
|---|---|---|
| `alternative` | Provider alternative to a request that was never confirmed | There is no original appointment to protect: the booking is a request, and expiry or decline closes it as an unconfirmed request, never as a penalized cancellation |
| `reschedule` | A proposal against a confirmed appointment | The original holds until acceptance commits and revalidation succeeds |
| `awaiting` | The proposing party's own view | Response controls are absent, and the surface states that the proposer is waiting, so the same request is not worked twice |

**Data states**

| State | Behaviour |
|---|---|
| `loading-initial` | Neither side renders until both resolve. A proposal shown without its original is the failure mode itself |
| `loading-refresh` | An accepted or expired proposal refreshes into the new authoritative pair and announces |
| `empty-no-data` | No proposal outstanding: only the appointment renders, with no proposal region at all |
| `empty-filtered` | On the clinic list, a state filter that excludes everything names itself as the cause |
| `partial` | If the proposal loaded and the original did not, **no decision control is offered** and the surface says the current appointment could not be read |
| `stale` | Both sides carry the as-of time; accept is withdrawn against a stale read because acceptance revalidates capacity and eligibility |
| `error-fetch` | Both sides preserved from the last good read, retry in place |
| `error-permission` | Booking scope lost: decision controls removed structurally |
| `success` | The pair, with the deadline running |
| Offline / unstable | Both sides readable with as-of time. Accept and decline are withdrawn, because both revalidate server-side |

**Right-to-left:** the original occupies the logical `start` position in both directions. Times, dates
and durations are bidirectionally isolated.
**Long content and text scaling:** neither appointment's time, date or location truncates. At the
largest text size the two blocks stack with the original first and their labels intact.
**Responsive:** Profile C stacks the pair in the reading column, original first, at every size class.
Profile A may place them side by side at `profile-a.content-width.wide` with the original at the logical
start, and stacks at `narrow`. Front-desk work is interruption-heavy, so on the clinic list the pending
proposal, its deadline and the still-authoritative original are all readable without opening anything.

**Focus, keyboard and screen reader:** the pair announces as original-then-proposal with each labelled.
Accepting moves focus to the updated booking state summary and announces which appointment now holds.
Declining is a single action with no second confirmation, because declining an unwanted proposal is not
destructive. The deadline is announced when it enters its approaching window.

**Realization**

| Profile | Realization |
|---|---|
| C — Patient | `Native` — a stacked pair with the original labelled as current |
| A — Clinic, Admin | `Custom` — Filament has no two-record comparison with an authoritative-side rule; a stock table of proposals would lose exactly the property that matters |

**Prohibited:** displaying the proposal as the appointment; replacing the original before acceptance
commits; a generic edit of date, provider or service anywhere on these surfaces; a party responding to
its own proposal; punitive cancellation language on an alternative that expired or was declined; a
second confirmation on decline; offering accept without revalidation.

**Placed on:** 4 screens — `SCR-BOOKING-005`, `SCR-BOOKING-010`, `SCR-BOOKING-016`, `SCR-BOOKING-017`.

**Acceptance criteria**

1. The original appointment is rendered first, labelled as the one that currently holds, in both
   directions and at every size class.
2. No decision control is offered when the original could not be read.
3. Acceptance revalidates deadline, capacity and eligibility before committing.
4. An expired or declined alternative reads as an unconfirmed request and offers a fresh request.
5. The proposing party sees no response control on its own proposal.

---

### WGT-CLINICAL-001 — Treatment plan authoring section

**Purpose:** let a treating dentist author structured treatment lines quickly while keeping every
required structure intact — and hold the rule that there is **no free-text surcharge field**, so an
uncategorized charge cannot be created rather than being rejected later.

**Class:** form · **Platforms:** A · **Archetypes:** workspace · **Reach:** 2 of 165
**User intent:** compose an accurate plan without retyping what the system already knows.
**Requirements:** `FR-CLINICAL-001`, `FR-CLINICAL-006`, `FR-CLINICAL-002`, `FR-CATALOG-002`
**Data source:** `SDC-CLINICAL-001`, with the governed option set from `SDC-POLICY-002` and the
procedure catalog from `SDC-CATALOG-002`.

**Composes** — mandatory core `CMP-CLINICAL-001` `authoring`, `CMP-ELIG-002`, `CMP-PLATFORM-007`
`authoring`; conditional `CMP-PLATFORM-006` `embedded` for the line set, `CMP-PLATFORM-011` for the save
and propose states, `CMP-PLATFORM-001` for the draft status.
**Patterns:** `IX-PLATFORM-005`, `IX-PLATFORM-008`, `IX-PLATFORM-018`, `IX-PLATFORM-011`,
`IX-PLATFORM-012`, `IX-CLINICAL-001`.
**Content:** `TXT-PLATFORM-003`, `TXT-PLATFORM-005`, `TXT-PLATFORM-013`, `TXT-PLATFORM-018`,
`TXT-ERR-CLINICAL-002`.
**Accessibility:** `A11Y-CLINICAL-001`, `A11Y-FINANCE-001`, `A11Y-PLATFORM-001`, `A11Y-PLATFORM-026`,
`A11Y-PLATFORM-027`, `A11Y-PLATFORM-012`, `A11Y-PLATFORM-023`.

**Anatomy**

```
[ procedure search ]                       CMP-PLATFORM-007 authoring; recent and common first
[ line ]
   [ procedure and its active definition version ]
   [ quantity ][ unit ]                    the unit comes from the procedure item; it is never typed
   [ unit amount ][ line amount ]          provider price default, editable within governed rules
   [ includes ][ excludes ]                populated from the definition; a charge for an included
                                           component is refused
   [ modifier ]                            chosen from the four governed categories, with a reason.
                                           There is no fifth category and no way to add one
   [ duplicate ][ remove ]
[ quick add ]                              from recent and common choices
[ derived total ]                          derived from lines. Never independently editable
[ completeness ]                           what is still missing, visible while authoring
```

**Variants**

| Variant | Where | Difference |
|---|---|---|
| `lines` | Plan authoring | Procedure lines and their modifiers |
| `stages` | Stages and pricing | Lines grouped into stages, with per-section completeness and the terms that acceptance will snapshot |

**Data states**

| State | Behaviour |
|---|---|
| `loading-initial` | The procedure catalog and the governed option set load before any line control is offered. A modifier picker with an unloaded option set would be a free-text field in disguise |
| `loading-refresh` | A catalog version change while authoring is stated; an active version is never swapped under an authored line silently |
| `empty-no-data` | A plan with no lines yet: stated, with procedure search as the one action |
| `empty-filtered` | Procedure search with no match: the search term is named as the cause, and no line can be created from a non-match |
| `partial` | If the governed option set failed to load, modifiers are unavailable with the reason and proposal is blocked. Authoring lines continues |
| `stale` | The draft carries its last-saved time; proposal is withdrawn against a stale catalog read |
| `error-fetch` | Every authored line is preserved. Nothing is cleared |
| `error-permission` | Only a treating dentist for the exact case may author; loss of that relationship removes authoring controls structurally and leaves the draft readable |
| `success` | The line set with its derived total and completeness |
| Offline / unstable | Rare on this profile; edits are held and the last-saved state is stated honestly rather than shown as saved |

**Right-to-left:** the line reads start to end in logical order. Procedure codes, quantities, units and
amounts are bidirectionally isolated. A numeric column aligns by logical property.
**Long content and text scaling:** an inclusion or exclusion list wraps in full; an amount, a quantity
and a unit never truncate. At the largest text size a line stacks with its amount directly beneath its
procedure, and the workspace leaves `dense` for `operational` spacing rather than shrinking type.
**Responsive:** Profile A only. `dense` at `profile-a.content-width.wide`, where repeated structured
entry earns the density. At `narrow` each line stacks and the derived total stays visible.

**Focus, keyboard and screen reader:** the whole section is keyboard operable, including procedure
search, quantity, modifier selection, duplicate and remove. Adding a line moves focus into the new
line's first field. Duplicating a line announces and focuses the copy. The derived total is announced
when it changes, once per change, not per keystroke. Each amount announces with its currency and its
category.

**Realization**

| Profile | Realization |
|---|---|
| C — Patient | `n/a` — the platform does not generate or suggest a plan, and a patient never authors one |
| A — Clinic, Admin | `Custom` — a Filament repeater alone cannot hold the inclusion, unit and governed-category rules; the section is a custom form component over the framework's field primitives |

**Prohibited:** a free-text surcharge, extra, adjustment or other field; a modifier with no governed
category; a charge for a component the governing definition marks as included; a typed unit; an
independently editable total; editing an accepted version or any of its lines; a platform-generated
diagnosis or plan suggestion; proposing a superseding version without its change summary; a duplicate
included component.

**Placed on:** 2 screens — `SCR-CLINICAL-010`, `SCR-CLINICAL-011`. Two contexts, one anatomy: line
authoring and stage-and-pricing authoring are the same composition at two levels of the same draft.

**Acceptance criteria**

1. No field anywhere in the section accepts an uncategorized charge, under any label.
2. Every modifier is one of the four governed categories and carries a reason.
3. A charge for an included component is refused at authoring time and names the inclusion.
4. The total is derived from lines and cannot be edited directly.
5. Completeness is visible while authoring, not discovered at acceptance.
6. The whole section is operable by keyboard, including duplicate and quick add.

---

### WGT-CLINICAL-002 — Treatment plan reader

**Purpose:** render an authored or accepted plan so that **every amount names its category, its reason
and what it covers**, in four audiences, and so that a historical snapshot reads at full contrast rather
than being dimmed for being unchangeable.

**Class:** panel · **Platforms:** C, A · **Archetypes:** detail, workspace · **Reach:** 7 of 165
**User intent:** understand exactly what is proposed or agreed, and what each amount is for.
**Requirements:** `FR-CLINICAL-002`, `FR-CLINICAL-006`, `FR-FINANCE-001`, `FR-POLICY-003`
**Data source:** `API-CLINICAL-002`, `API-FINANCE-001` on Profile C; `SDC-CLINICAL-001`,
`SDC-FINANCE-001`, `SDC-CLAIMS-001` on Profile A.

**Composes** — mandatory core `CMP-CLINICAL-001`; conditional `CMP-ELIG-002` per amount,
`CMP-PLATFORM-001` for the plan state, `CMP-PLATFORM-002` for the state summary, `CMP-CLINICAL-002`
where an amendment exists, `CMP-PLATFORM-013` for the authoring dentist.
**Patterns:** `IX-PLATFORM-008`, `IX-CLINICAL-001`, `IX-PLATFORM-016`, `IX-PLATFORM-003`.
**Content:** `TXT-PLATFORM-013`, `TXT-PLATFORM-014`, `TXT-PLATFORM-017`, `TXT-PLATFORM-018`,
`TXT-STATE-CLINICAL-001`.
**Accessibility:** `A11Y-CLINICAL-001`, `A11Y-FINANCE-001`, `A11Y-PLATFORM-012`, `A11Y-PLATFORM-023`,
`A11Y-PLATFORM-030`, `A11Y-PLATFORM-015`.

**Anatomy**

```
[ plan state ][ version ][ authored by ]   who authored it is a named dentist, never the platform
[ line ]
   [ what it is, in plain language ]
   [ quantity and unit ]
   [ line amount, in its currency ]
   [ what it includes ][ what it excludes ]
   [ modifier, its category and its reason ]
[ total ]                                  derived, with its currency
[ terms ]                                  due structure, cancellation, refund, protection, and the
                                           governing policy versions
```

**Variants** — the four `CMP-CLINICAL-001` variants: `review` (patient, plain language, amount and
coverage prominent), `oversight` (admin, with the governing procedure version reachable), `snapshot`
(inside an accepted treatment or financial terms snapshot: immutable, read-only at **full contrast**,
with its own version identity), and `authoring` where a reader sits beside the authoring section.

**Data states**

| State | Behaviour |
|---|---|
| `loading-initial` | The plan loads whole. A partially rendered plan with some lines missing would be a different plan |
| `loading-refresh` | A newer version arriving states that rather than replacing the version being read |
| `empty-no-data` | No plan proposed yet: stated as awaiting the dentist, which is not an error and offers the patient no action |
| `empty-filtered` | n/a. A plan is not a filtered projection |
| `partial` | If any line or the terms failed to load, the surface says so and **does not render a total**, because a total over an incomplete line set is a wrong number |
| `stale` | The plan carries its as-of time; acceptance is withdrawn against a stale read |
| `error-fetch` | Retry in place; no partial plan is presented as whole |
| `error-permission` | Role-based field filtering applies; a scope-limited projection says it is scope-limited |
| `success` | The plan |
| Offline / unstable | Last read plan with as-of time; acceptance withdrawn |

**Right-to-left:** the line reads start to end in logical order. Amounts with currency, quantities,
units, procedure identifiers and version identifiers are bidirectionally isolated. An amount is never
reordered, because a reordered amount is a wrong amount.
**Long content and text scaling:** the plain-language description, the inclusions, the exclusions and
the modifier reason all wrap in full. **No amount, total, currency or category ever truncates.** At the
largest text size each line stacks with its amount adjacent to its description.
**Responsive:** Profile C is one line per reading-column block, with the amount and what it covers
adjacent. Profile A keeps a line table at `profile-a.content-width.wide` and degrades to `reading-list`
at `narrow`, never truncating an amount to keep a column.

**Focus, keyboard and screen reader:** each line announces as description, quantity and unit, amount
with currency, and category where a modifier exists — so the amount is never heard without its reason.
The total announces with its currency and as derived. A historical snapshot announces as historical.
Disclosure of inclusions keeps focus on the line.

**Realization**

| Profile | Realization |
|---|---|
| C — Patient | `Native` — stacked lines with plain-language descriptions |
| A — Clinic, Admin | `Extended` — a Filament infolist over the plan projection, with the immutable variant rendered at full contrast and carrying no edit affordance of any kind |

**Prohibited:** an amount without its category and reason; an unexplained surcharge; a component charged
twice; dimming an immutable snapshot; any edit affordance on an accepted version; implying that UberTib
diagnoses, treats, insures, or collects or holds the money; recomputing an agreed amount from a later
exchange rate, rounding rule or currency policy; presenting an unaccepted amendment as governing
anything.

**Placed on:** 7 screens — `SCR-CLINICAL-003`, `SCR-CLINICAL-004`, `SCR-CLINICAL-013`,
`SCR-CLINICAL-019`, `SCR-FINANCE-001`, `SCR-FINANCE-006`, `SCR-CLAIMS-010`.

**Acceptance criteria**

1. Every amount renders with its category, its reason and what it covers.
2. An immutable snapshot renders at full contrast and carries no edit affordance.
3. A partial read renders no total and says which part is missing.
4. The agreed amount stays in its agreed currency; any conversion is labelled as an indication beside
   it and never replaces it.
5. Each line announces its amount together with its reason.

---

### WGT-CLINICAL-003 — Stage execution panel

**Purpose:** render one treatment stage with the requirements that resolve **from the accepted
snapshot** rather than from a generic template, and make a reopening read as a recorded correction with
its reason rather than as an erasure of history.

**Class:** panel · **Platforms:** C, A · **Archetypes:** detail, form · **Reach:** 4 of 165
**User intent:** know what this stage still needs, or what happened in it.
**Requirements:** `FR-CLINICAL-003`, `FR-CLINICAL-004`, `FR-CLINICAL-005`
**Data source:** `API-CLINICAL-004` on Profile C; `SDC-CLINICAL-001` on Profile A.

**Composes** — mandatory core `CMP-PLATFORM-001`; conditional `CMP-PLATFORM-002` for the stage state
summary, `CMP-PLATFORM-012` `intake` for stage evidence, `CMP-PLATFORM-006` `embedded` for the
requirement set, `CMP-PLATFORM-013` for who completed or reopened it, `CMP-PLATFORM-014` for completion
and reopening, `CMP-PLATFORM-004` for the actions.
**Patterns:** `IX-PLATFORM-006`, `IX-PLATFORM-001`, `IX-PLATFORM-008`, `IX-AUDIT-001`,
`IX-PLATFORM-018`.
**Content:** `TXT-PLATFORM-010`, `TXT-PLATFORM-011`, `TXT-PLATFORM-014`, `TXT-STATE-CLINICAL-002`.
**Accessibility:** `A11Y-CLINICAL-001`, `A11Y-PLATFORM-034`, `A11Y-PLATFORM-012`, `A11Y-PLATFORM-011`,
`A11Y-PLATFORM-015`, `A11Y-PLATFORM-006`.

**Anatomy**

```
[ stage ][ state ]                         from the accepted snapshot, not from a template
[ what this stage requires ]               fields, acknowledgments and evidence, resolved per case
   [ requirement ][ satisfied or not ]
[ completed by, when, on what basis ]      CMP-PLATFORM-013 once complete
[ reopening history ]                      appended. The prior completion stays readable
[ complete ][ reopen ]                     each unavailable, with what remains named, until it applies
```

**Variants**

| Variant | Where | Difference |
|---|---|---|
| `patient` | Patient stage detail | Patient-safe status only. Never private clinical evidence, never a storage path, never a signed link |
| `execution` | Clinic stage execution and evidence | The full requirement set with evidence intake |
| `decision` | Stage completion and reopening | The commit surfaces; each requires its own reason or context |

**Data states**

| State | Behaviour |
|---|---|
| `loading-initial` | Requirements resolve from the accepted snapshot before any completion control is offered |
| `loading-refresh` | A requirement satisfied elsewhere refreshes into the set and announces |
| `empty-no-data` | A stage with no requirements: stated, so an empty requirement list is not read as an unloaded one |
| `empty-filtered` | n/a. The requirement set is governed, not filtered |
| `partial` | An unresolved requirement is never counted as satisfied, and completion stays unavailable naming it |
| `stale` | Requirement states carry the as-of time; completion is withdrawn against a stale read, because completion is authoritative or it did not happen |
| `error-fetch` | The known requirement set is preserved with retry |
| `error-permission` | Only a treating dentist for the exact case and stage may complete; loss removes the control structurally and leaves the stage readable |
| `success` | The stage with its requirements and history |
| Offline / unstable | Readable. Completion is withdrawn: it is never local-only |

**Right-to-left:** requirements flow start to end. Stage identifiers, dates and evidence identifiers are
bidirectionally isolated.
**Long content and text scaling:** a requirement description and a reopening reason wrap in full and
never truncate.
**Responsive:** Profile C stacks stage, state, requirements and history in the reading column. Profile A
keeps the requirement set in the primary region; at `profile-a.content-width.narrow` each requirement
stacks with its state.

**Focus, keyboard and screen reader:** the requirement set is exposed as a list with satisfied and
outstanding announced per item. Completion announces the resulting state and moves focus to the state
summary. A reopening announces as a correction, with its reason, and never as a reversal of history.

**Realization**

| Profile | Realization |
|---|---|
| C — Patient | `Native` — the `patient` variant only, read-only |
| A — Clinic, Admin | `Extended` — a Filament infolist and action set over the stage projection, with the requirement set resolved per case rather than declared statically |

**Prohibited:** a generic requirement set not resolved from the accepted snapshot; completion while a
mandatory field, acknowledgment or evidence item is absent or invalid; local-only completion; erasing a
prior completion on reopening; exposing private clinical evidence, storage paths or signed links to a
patient; a reopening reason that is not safe to surface to the patient who will see the state.

**Placed on:** 4 screens — `SCR-CLINICAL-006`, `SCR-CLINICAL-014`, `SCR-CLINICAL-015`,
`SCR-CLINICAL-016`.

**Acceptance criteria**

1. Requirements resolve from the accepted snapshot and differ per case.
2. Completion is unavailable, with what remains named, while any mandatory item is outstanding.
3. A reopening appends and the prior completion stays readable.
4. No patient surface can reach private clinical evidence, a storage path or a signed link.
5. Completion is authoritative before it renders as complete.

---

### WGT-CATALOG-001 — Launch gate panel

**Purpose:** render the four accountable launch gates so that each owner sees only their own gate as
actionable, and so that **`expired` reads as a lapse needing re-approval rather than as a decision
against the content** — conflating the two wastes the rarest actors' time and fails production readiness
in the wrong direction.

**Class:** panel · **Platforms:** A · **Archetypes:** detail, form · **Reach:** 4 of 165
**User intent:** see what still blocks this from being publishable, and record my own decision.
**Requirements:** `FR-CATALOG-003`, `FR-CATALOG-001`, `FR-OPS-003`, `FR-AUDIT-001`
**Data source:** `SDC-CATALOG-001`, `SDC-CATALOG-003`.

**Composes** — mandatory core `CMP-POLICY-001` `launch-gate`; conditional `CMP-PLATFORM-013` for the
accountable owner, `CMP-PLATFORM-005` for gate and credential expiry, `CMP-PLATFORM-014`
`authoritative-decision` for recording a decision, `CMP-PLATFORM-008` `governance` for the appended
decision history, `CMP-PLATFORM-001` per gate state.
**Patterns:** `IX-POLICY-001` (owner), `IX-AUDIT-001`, `IX-PLATFORM-001`, `IX-PLATFORM-008`.
**Content:** `TXT-PLATFORM-010`, `TXT-PLATFORM-012`, `TXT-PLATFORM-014`, `TXT-STATE-CATALOG-002`,
`TXT-STATE-CLINICAL-003`.
**Accessibility:** `A11Y-POLICY-001`, `A11Y-AUDIT-001`, `A11Y-PLATFORM-015`, `A11Y-PLATFORM-012`,
`A11Y-PLATFORM-016`, `A11Y-PLATFORM-011`.

**Anatomy**

```
[ gate ][ accountable role ][ state ]      four gate types: medical, legal, operational, technical
   [ decision ][ evidence ][ expiry ]      appended, never edited
   [ credential ]                          medical gate only: a current verified dental credential
[ what this blocks ]                       publication and discoverability, stated per gate
[ record decision ]                        available only to that gate's accountable owner
```

**Variants**

| Variant | Where | Difference |
|---|---|---|
| `set` | Launch gates for one definition | All four gates with their states and blocking effect |
| `decision` | Record gate decision | One gate, bound to the exact content hash, with reason, evidence and expiry required |
| `credential` | Reviewer credentials | Immutable credential snapshots; renewal creates a new snapshot rather than editing |

**Data states**

| State | Behaviour |
|---|---|
| `loading-initial` | All four gates resolve before publication readiness is stated. Readiness computed from three of four gates is a wrong readiness |
| `loading-refresh` | A gate decided elsewhere refreshes in and the blocking statement recomputes |
| `empty-no-data` | No gate decisions yet: all four render as pending, which is a real state and not an absence |
| `empty-filtered` | n/a. The gate set is fixed at four |
| `partial` | A gate whose state did not load blocks readiness and says so. **Readiness fails closed** |
| `stale` | Gate states carry their as-of time; a decision is not recorded against a stale content hash |
| `error-fetch` | Known gate states preserved with retry; the readiness statement is withheld rather than guessed |
| `error-permission` | An owner sees other gates read-only and their own as actionable; a non-owner sees the set read-only |
| `success` | Four gates with their states and the readiness statement |
| Offline / unstable | Rare on this profile; read-only, and no decision is queued |

**Right-to-left:** gates flow start to end. Content hashes, version identifiers and expiry dates are
bidirectionally isolated.
**Long content and text scaling:** a decision reason and an evidence reference wrap in full. An expiry
date never truncates.
**Responsive:** Profile A only. Four gate rows at `profile-a.content-width.wide`; at `narrow` each gate
stacks with its state, owner and expiry, and the blocking statement stays above them.

**Focus, keyboard and screen reader:** each gate announces as gate type, state, owner and expiry, so
`expired` and `rejected` are distinguishable without sight or colour. A gate the actor does not own is
present and read-only rather than hidden, because an owner needs to see the whole set. Recording a
decision announces the recomputed readiness.

**Realization**

| Profile | Realization |
|---|---|
| C — Patient | `n/a` — governance is never reachable from a Patient surface |
| A — Clinic, Admin | `Custom` — an append-only decision set with a per-owner actionability rule and a fail-closed readiness computation, which no framework primitive supplies |

**Prohibited:** `expired` styled or worded the same as `rejected`; readiness asserted while any gate is
unknown; a clinical credential used on a non-medical gate; an expired or revoked credential supporting a
medical approval; editing a prior decision; a decision not bound to the exact content hash; direct
activation bypassing gates.

**Placed on:** 4 screens — `SCR-CATALOG-006`, `SCR-CATALOG-007`, `SCR-CATALOG-008`, `SCR-CATALOG-009`.
**Not placed on** `SCR-OPS-006`: the readiness overview is a cross-scope roll-up rather than one
version's gate set, and Phase 3 binds no governed version header there. It renders gate state through
`WGT-PLATFORM-005` and `WGT-OPS-002` instead.

**Acceptance criteria**

1. `expired`, `rejected`, `revoked`, `approved` and `pending` are five distinguishable states without
   colour.
2. Publication readiness fails closed on any gate that is missing, expired, revoked, rejected or
   unknown.
3. Only the accountable owner of a gate can act on it, and the control is absent for everyone else.
4. A medical approval requires a current verified credential and is refused otherwise.
5. Every decision is appended, bound to the content hash, and never edited.

---

### WGT-POLICY-001 — Governed version and lifecycle bar

**Purpose:** state which version this is, when it is effective, what review it has passed, and that its
history stays readable — so that "configurable" never reads as "instant and unreviewed".

**Class:** region · **Platforms:** A · **Archetypes:** detail, form, list-and-detail ·
**Reach:** 16 of 165
**User intent:** know what is in force, what is coming, and what governed the thing I am looking at.
**Requirements:** `FR-POLICY-001`, `FR-POLICY-002`, `FR-CATALOG-002`, `FR-CATALOG-003`
**Data source:** `SDC-POLICY-001`, `SDC-POLICY-002`, `SDC-CATALOG-001`, `SDC-CATALOG-002`,
`SDC-ELIG-002`.

**Composes** — mandatory core `CMP-POLICY-001`; conditional `CMP-PLATFORM-001` for the version state,
`CMP-PLATFORM-005` for an effective-date window, `CMP-PLATFORM-013` for the approving authority,
`CMP-CLINICAL-002` `version` where a comparison is reachable, `CMP-PLATFORM-008` `governance` for the
decision history.
**Patterns:** `IX-POLICY-001` (owner), `IX-POLICY-002`, `IX-PLATFORM-003`, `IX-PLATFORM-008`.
**Content:** `TXT-PLATFORM-014`, `TXT-PLATFORM-010`, `TXT-STATE-POLICY-001`, `TXT-STATE-CATALOG-001`.
**Accessibility:** `A11Y-POLICY-001` (owner), `A11Y-PLATFORM-012`, `A11Y-PLATFORM-015`,
`A11Y-PLATFORM-016`, `A11Y-PLATFORM-030`.

**Anatomy**

```
[ version ][ state ][ audience ]           evaluation or production audience is never ambiguous
[ effective from ][ until ]
[ review gate ][ approved by ]             what it passed, and who is accountable
[ history ]                                prior versions remain readable and reachable
[ prospective-effect notice ]              a change applies from its effective date forward; historical
                                           records keep the version they were decided under
```

**Variants** — the five `CMP-POLICY-001` variants: `definition` (service definitions and procedure item
versions), `policy` (price bands, market calibration, commercial options, proposal validity, currency
normalisation), `launch-gate`, `credential`, `calibration` (the calibration **state** as a governance
state; the calibration output itself stays internal).

**Data states**

| State | Behaviour |
|---|---|
| `loading-initial` | Version identity and state resolve before any content beneath the bar renders, because content read without its version is content read without its meaning |
| `loading-refresh` | A newly activated version states the change rather than swapping the version being read |
| `empty-no-data` | No version exists for this key and scope yet: stated, with what creating the first draft would do |
| `empty-filtered` | On a version list, a state or audience filter names itself as the cause |
| `partial` | If the effective period or the review state did not load, the bar says so and any publication action is unavailable |
| `stale` | The bar carries its as-of time; publication is withdrawn against a stale read |
| `error-fetch` | Known version identity preserved with retry |
| `error-permission` | A version outside the actor's owned domain is read-only; authoring and publication controls are absent, not disabled |
| `success` | The version bar |
| Offline / unstable | Read-only; publication is never queued |

**Right-to-left:** the bar mirrors. Version identifiers, effective dates and policy keys are
bidirectionally isolated.
**Long content and text scaling:** the audience label, the review state and the effective period never
truncate, because those three are what a reader most easily misreads.
**Responsive:** Profile A only. One row at `profile-a.content-width.wide`; at `narrow` version and state
stay on the first line and the effective period and review state stack beneath.

**Focus, keyboard and screen reader:** the bar is the first landmark of the surface and announces
version, state, audience and effective period as one unit. An activation or retirement announces and the
surface re-reads. Historical versions are keyboard reachable from the bar.

**Realization**

| Profile | Realization |
|---|---|
| C — Patient | `n/a` — never reachable from a Patient surface |
| A — Clinic, Admin | `Custom` — a header region over the governed version projection. A stock Filament header would not carry the audience boundary or the prospective-effect statement |

**Prohibited:** editing an activated, retired or superseded version; a change presented as retroactive; a
draft that can become production by toggling visibility, activation or an effective date; evaluation
content presented as production content; an overlap of effective periods resolved silently rather than
surfaced; a clinically meaningful change activating on the drafter's authority alone; the drafter
approving their own draft; exposing a calibration output.

**Placed on:** 16 screens — `SCR-CATALOG-003`, `SCR-CATALOG-004`, `SCR-CATALOG-005`, `SCR-CATALOG-006`,
`SCR-CATALOG-007`, `SCR-CATALOG-008`, `SCR-CATALOG-009`, `SCR-CATALOG-010`, `SCR-CATALOG-011`,
`SCR-ELIG-018`, `SCR-ELIG-019`, `SCR-ELIG-023`, `SCR-POLICY-001`, `SCR-POLICY-002`, `SCR-POLICY-003`,
`SCR-POLICY-004`.

**Acceptance criteria**

1. Every governed surface states its version, state, audience and effective period before its content.
2. Evaluation and production audience are unmistakable on every surface that carries both.
3. No activated or historical version exposes an edit affordance.
4. An effective-period overlap is surfaced rather than silently ordered.
5. A clinically meaningful change cannot activate without the licensed reviewer, and the drafter cannot
   be that reviewer.

---

### WGT-POLICY-002 — Market observation entry grid

**Purpose:** record price observations at speed while keeping **every provenance field** — because an
unattributed number cannot be judged later — and keep the calibration state internal on every surface
and in every export.

**Class:** form · **Platforms:** A · **Archetypes:** list-and-detail · **Reach:** 1 of 165

Allocated under the second clause of criterion 1: **one context, high consequence, substantial
complexity.** It is a keyboard-oriented append-only grid with sticky defaults, source reuse, row
duplication, batch import and a suppression rule that changes what other surfaces may show. Phase 3
deferred it here by name.

**User intent:** enter many observations quickly without losing the attribution that makes them usable.
**Requirements:** `FR-ELIG-019`, `FR-POLICY-001`, `FR-POLICY-002`
**Data source:** `SDC-POLICY-002`.

**Composes** — mandatory core `CMP-PLATFORM-006` `table` in `dense`, `CMP-POLICY-001` `calibration`;
conditional `CMP-ELIG-002` per observed amount, `CMP-PLATFORM-007` `management` for scope and locality
filtering, `CMP-PLATFORM-001` per observation verification state, `CMP-PLATFORM-004` for entry actions.
**Patterns:** `IX-PLATFORM-012` (owner for this surface's keyboard-first entry), `IX-PLATFORM-005`,
`IX-PLATFORM-014`, `IX-PLATFORM-018`, `IX-POLICY-001`, `IX-PLATFORM-016`.
**Content:** `TXT-PLATFORM-013`, `TXT-PLATFORM-018`, `TXT-PLATFORM-014`, `TXT-STATE-POLICY-001`.
**Accessibility:** `A11Y-PLATFORM-001`, `A11Y-PLATFORM-012`, `A11Y-PLATFORM-026`, `A11Y-PLATFORM-027`,
`A11Y-FINANCE-001`, `A11Y-PLATFORM-036`, `A11Y-PLATFORM-023`.

**Anatomy**

```
[ sticky defaults ]                        catalog scope, locality, currency, source type: set once
[ row ]
   [ catalog scope ][ locality ][ amount ][ currency ]
   [ observed on ][ source type ][ source reference ]
   [ material or laboratory cost included ]
   [ verification state ][ confidence ]
   [ duplicate row ]
[ batch import ]                           the same fields, validated per row before any row commits
[ calibration state ]                      FINAL, CALIBRATING, PROVISIONAL or NOT_APPLICABLE, per
                                           locality and scope, against the effective policy's window,
                                           locality scope, minimum sample and confidence rules
```

**Data states**

| State | Behaviour |
|---|---|
| `loading-initial` | The effective policy's window, locality scope, minimum sample and confidence rules load before the grid, because the calibration statement is meaningless without them |
| `loading-refresh` | A newly effective policy version restates the calibration against the same sample rather than silently changing the verdict |
| `empty-no-data` | No observations for this scope: stated, with the sample count against the minimum, so the reader sees why no class is produced |
| `empty-filtered` | A scope or locality filter excluded everything: named as the cause, with the unfiltered count visible |
| `partial` | Some scopes' calibration resolved and some did not; an unresolved scope reads as unknown, never as `FINAL` |
| `stale` | The calibration carries its as-of time |
| `error-fetch` | Entered rows are preserved; nothing typed is lost to a failed read |
| `error-permission` | Only the commercial and pricing administrator within owned scope may enter; policy and audit staff are read-only, and the entry controls are absent for them |
| `success` | The grid with its honest calibration statement per scope |
| Offline / unstable | Rare on this profile. Rows are held and the grid states plainly that they have not committed |

**Right-to-left:** columns mirror. Amounts, currencies, dates, source references and scope identifiers
are bidirectionally isolated per cell; a reordered amount is a wrong amount and this is the surface where
that would corrupt a classification basis.
**Long content and text scaling:** a source reference wraps or elides with the full value reachable on
the same surface; an amount, a currency, a date and a verification state never truncate. At the largest
text sizes the grid degrades to `reading-list` rather than relying on horizontal scroll indefinitely.
**Responsive:** Profile A only, `dense`, at `profile-a.content-width.wide` and above. At `narrow` the
grid keeps a **bounded internal horizontal scroll** — permitted for a data table by
`A11Y-PLATFORM-036` — while the page itself never scrolls horizontally.

**Focus, keyboard and screen reader:** entry is keyboard-first. Moving between cells, committing a row,
duplicating a row and applying sticky defaults are all keyboard operations, and none requires a pointer.
A committed row announces once. The sample count against the minimum is announced when it crosses the
threshold. Each cell has a persistent visible column label exposed to assistive technology.

**Realization**

| Profile | Realization |
|---|---|
| C — Patient | `n/a` — internal only, on every surface and in every export |
| A — Clinic, Admin | `Custom` — a dense keyboard-first grid with append-only semantics and per-row commit. A Filament table with row actions would offer edit and delete, which this surface prohibits outright |

**Prohibited:** an in-place edit of an observation — a correction is a new observation superseding the
earlier one with a reason; dropping any provenance field to speed entry; labelling anything here a market
average, a city average or a tariff; showing a provider where their price sits relative to the corpus;
producing a class from a sample below the effective minimum; suppressing or altering a provider's own
price for any calibration reason; letting a threshold or window change take effect other than as a
versioned prospective policy change. **Production calibration minimums require licensed clinical
approval under `Q-ELIG-001`, so current values are provisional and the surface says so.**

**Placed on:** `SCR-ELIG-023`, `WF-ELIG-023`.

**Acceptance criteria**

1. Every observation carries scope, locality, amount, currency, observed date, source type, source
   reference, cost-inclusion flag, verification state and confidence.
2. No control edits or deletes an existing observation; a correction appends and supersedes with a
   reason.
3. A scope below the effective minimum sample reads as still calibrating and produces no class.
4. A non-final calibration suppresses the internal class and changes nothing the patient sees.
5. Entry, duplication and batch import are completable by keyboard alone.
6. Nothing on this surface or in any export reaches a patient or a provider.

---

### WGT-OPS-001 — Work queue row and list

**Purpose:** render operational work items with their five states **and their two independent flags**,
because the row a supervisor most needs to find is simultaneously in progress, escalated and overdue,
and collapsing that into one status column loses exactly that row.

**Class:** list · **Platforms:** A · **Archetypes:** dashboard, list-and-detail, detail, form ·
**Reach:** 8 of 165
**User intent:** find what I should work on next, and see what is slipping.
**Requirements:** `FR-OPS-001`, `FR-OPS-002`, `FR-AUDIT-001`
**Data source:** `SDC-OPS-001`.

**Composes** — mandatory core `CMP-OPS-001`; conditional `CMP-PLATFORM-001` for the item state,
`CMP-PLATFORM-005` for the due time, `CMP-PLATFORM-007` `queue` for the persisted filter,
`CMP-PLATFORM-008` for escalation history on the detail variant, `CMP-PLATFORM-013` for assignment.
**Patterns:** `IX-OPS-001` (owner), `IX-PLATFORM-014`, `IX-PLATFORM-015`, `IX-PLATFORM-001`,
`IX-PLATFORM-016`.
**Content:** `TXT-PLATFORM-007`, `TXT-PLATFORM-010`, `TXT-PLATFORM-016`, `TXT-STATE-OPS-001`.
**Accessibility:** `A11Y-PLATFORM-012`, `A11Y-PLATFORM-015`, `A11Y-PLATFORM-001`, `A11Y-PLATFORM-011`,
`A11Y-PLATFORM-008`, `A11Y-PLATFORM-036`.

**Anatomy**

```
[ type ][ linked resource ][ state ]       five states: OPEN, ASSIGNED, IN_PROGRESS, WAITING, COMPLETED
[ escalated ][ overdue ]                   two independent flags, in their own slot. Both can be true
                                           while the state is a third thing
[ priority ][ due ][ blocking reason ]
[ assignee ]                               ownership without a decision is CMP-PLATFORM-013
                                           assigned-to-person, never decided-by-person
```

**Variants** — the five `CMP-OPS-001` variants: `feed` (clinic, scoped to provider and branch context,
ordered by what needs doing), `queue` (admin, adds responsibility scope and blocking reason, filterable
and persistent), `detail` (the full item plus escalation history), `checklist` (onboarding items
projected as a checklist, because that surface derives its state from work items rather than owning its
own), `embedded` (beside the record the work concerns; compact, no reassignment control unless the actor
holds it).

**Data states**

| State | Behaviour |
|---|---|
| `loading-initial` | Row skeletons; the queue count is not implied by them |
| `loading-refresh` | Rows stay; an item reassigned away from the current actor announces on the surface viewing it and does not force navigation |
| `empty-no-data` | Nothing in scope: stated plainly. On the clinic feed this is a real and welcome state |
| `empty-filtered` | The persisted filter excluded everything: named as the cause, with the filter visible and clearable |
| `partial` | An item whose due time or blocking reason did not load says so; an unloaded due time is never rendered as no deadline |
| `stale` | The queue carries its as-of time; claim and completion are withdrawn against a stale read to avoid two actors claiming one item |
| `error-fetch` | Known rows preserved with retry |
| `error-permission` | A scope revoked mid-shift removes the affected items and states the scope change. **A permission failure must never read as a quiet day** |
| `success` | Rows in the variant's order |
| Offline / unstable | Rare on this profile; the same rule applies. Claim and completion are withdrawn |

**Right-to-left:** columns mirror. Resource identifiers, due times and priorities are bidirectionally
isolated.
**Long content and text scaling:** a blocking reason wraps in full; the due time and the state never
truncate. At the largest text sizes the queue degrades to `reading-list`.
**Responsive:** Profile A only. `table` at `profile-a.content-width.wide`; at `narrow` either a bounded
internal horizontal scroll or degradation to `reading-list`, stated per screen, with the page never
scrolling horizontally.

**Focus, keyboard and screen reader:** state, escalation and overdue are announced as three separate
facts, never merged. The queue is keyboard operable including claim, assign and complete where the actor
holds them. Returning from an item restores focus to its row. An assignment conflict states the conflict
rather than showing an optimistic owner the server did not accept.

**Realization**

| Profile | Realization |
|---|---|
| C — Patient | `n/a` — work items are an operational projection, never patient-facing |
| A — Clinic, Admin | `Extended` — a Filament table over the scoped work projection, with state, escalation and overdue as three separately filterable dimensions rather than one column |

**Prohibited:** collapsing escalated or overdue into the state column; a flag rendered by recolouring
the state chip; completing a work item changing the source domain record; work assignment granting
source-data access; a permission failure rendered as an empty queue; an optimistic assignment.

**Placed on:** 8 screens — `SCR-PLATFORM-003`, `SCR-PLATFORM-004`, `SCR-IDENTITY-021`, `SCR-OPS-001`,
`SCR-OPS-002`, `SCR-OPS-003`, `SCR-ELIG-014`, `SCR-ELIG-022`.

**Acceptance criteria**

1. State, escalated and overdue are filterable independently and announced separately.
2. A row can be `IN_PROGRESS`, escalated and overdue simultaneously and remain legible.
3. Completing a work item changes no source domain record.
4. Source-resource authorization is enforced independently of assignment.
5. A revoked scope removes items with the scope change stated, never as an empty queue.

---

### WGT-OPS-002 — Operational metric and reporting block

**Purpose:** render an operational figure that **declares its population, its window, its status rules
and when it was last refreshed**, carries a comparison basis, keeps provisional and disputed data
visibly distinct from confirmed fact, and always has a non-visual equivalent.

**Class:** metric · **Platforms:** A · **Archetypes:** dashboard, detail · **Reach:** 5 of 165
**User intent:** see how the operation is doing, and be able to trust the number enough to act on it.
**Requirements:** `FR-OPS-002`, `FR-OPS-001`, `FR-AUDIT-002`
**Data source:** `SDC-OPS-002`, with drill-down into `SDC-OPS-001` and the owning domain contract.

**Composes** — mandatory core `CMP-PLATFORM-006`, which is the **table fallback** and the non-visual
equivalent rather than an afterthought; conditional `CMP-PLATFORM-002` for freshness and provisional
status, `CMP-PLATFORM-001` for a threshold state, `CMP-PLATFORM-007` for the window and scope filter,
`CMP-PLATFORM-013` `computed-by-system` so a computed figure is never dressed as a judgement.
**Patterns:** `IX-PLATFORM-009`, `IX-PLATFORM-014`, `IX-PLATFORM-016`, `IX-PLATFORM-003`,
`IX-PLATFORM-015`.
**Content:** `TXT-PLATFORM-008`, `TXT-PLATFORM-010`, `TXT-PLATFORM-013`, `TXT-PLATFORM-018`,
`TXT-PLATFORM-019`.
**Accessibility:** `A11Y-PLATFORM-015`, `A11Y-PLATFORM-012`, `A11Y-PLATFORM-009`, `A11Y-PLATFORM-023`,
`A11Y-PLATFORM-036`, `A11Y-FINANCE-001`.

**Anatomy**

```
[ figure ][ unit ]
[ population ][ window ]                   what is counted, over what period. Never implicit
[ comparison basis ]                       against the prior window, against the threshold, or against
                                           the target. A figure with nothing to compare against is not
                                           a metric and does not render as one
[ status rules ]                           which states are counted, so two people reading it agree
[ last refreshed ]
[ provisional or confirmed ]               provisional and disputed are visibly distinct from confirmed
[ table ]                                  the same data as rows. Always present, never a fallback that
                                           only appears when something fails
```

**Variants**

| Variant | Where | Difference |
|---|---|---|
| `tile` | Dashboards | One figure with its comparison basis and freshness |
| `series` | Operational reports | A trend over the declared window, with the table rendered beside it, not behind a toggle |
| `signal` | Operational health | A threshold state per signal, where the threshold is declared and no signal relies on colour alone |
| `drill` | Drill-down and export | The rows behind a figure, preserving the filter and window so the numbers stay reconcilable |

**Data states**

| State | Behaviour |
|---|---|
| `loading-initial` | Skeleton at figure height. No figure is rendered before its population and window resolve, because a number without its definition is not usable |
| `loading-refresh` | The figure stays with its previous last-refreshed time until the new read lands |
| `empty-no-data` | A genuinely zero population: stated as zero of a declared population, never as a blank tile |
| `empty-filtered` | The window or scope filter excluded everything: named as the cause |
| `partial` | A figure whose contributing source failed is **not rendered**; the block says which source is missing. A metric silently computed over fewer sources is a wrong metric |
| `stale` | The last-refreshed time is always present, so staleness is visible by construction. A figure past its freshness expectation says so |
| `error-fetch` | Last figure preserved with its as-of time and retry |
| `error-permission` | Drill-down and export carry the same or stricter authorization as the source data; a denial states that rather than returning fewer rows |
| `success` | The figure with its full declaration |
| Offline / unstable | Rare on this profile; last figure with as-of time |

**Right-to-left:** the figure, its unit and its comparison sit in logical order. Figures, percentages,
dates and windows are bidirectionally isolated.
**Long content and text scaling:** the population and window statements wrap in full. The figure and its
unit never truncate. At the largest text sizes a `series` degrades to its table.
**Responsive:** Profile A only. Tiles reflow across the content grid; at
`profile-a.content-width.narrow` tiles stack one per row and a `series` renders as its table rather than
compressing to an unreadable chart.

**Focus, keyboard and screen reader:** the figure announces with its unit, population, window,
comparison basis and freshness — the whole declaration, not the bare number. The table equivalent is in
the accessibility tree at all times and is not gated behind a control. A `signal` announces its
threshold state as a label, never as a colour. Drill-down is keyboard reachable and returns focus to the
figure.

**Realization**

| Profile | Realization |
|---|---|
| C — Patient | `n/a` — operational reporting is never patient-facing |
| A — Clinic, Admin | `Extended` — Filament stat and chart widgets configured so that the population, window, comparison basis and freshness are rendered rather than left implicit, with the table equivalent always present |

**Prohibited:** a figure with no comparison basis; a chart with no table equivalent; a threshold state
by colour alone; provisional or disputed data presented as confirmed; a metric computed over a partial
source set; delayed background work presented as a completed business outcome; a drill-down or export
that widens the actor's effective scope; an unaudited sensitive export.

**Placed on:** 5 screens — `SCR-PLATFORM-004`, `SCR-PLATFORM-008`, `SCR-OPS-004`, `SCR-OPS-005`,
`SCR-OPS-006`.

**Acceptance criteria**

1. Every figure declares its population, window, status rules, comparison basis and last-refreshed time.
2. Every chart has a table equivalent present in the accessibility tree without a control being used.
3. Provisional and disputed values are distinguishable from confirmed values without colour.
4. A figure whose source set is incomplete does not render, and the missing source is named.
5. Drill-down and export carry the same or stricter authorization as the source data and are audited.

---

### WGT-FINANCE-001 — External financial event ledger

**Purpose:** render the append-only external financial record so that agreed, reported, confirmed,
disputed, refunded and pending-external-execution are six visibly distinct things — and so that **no
wording anywhere implies UberTib holds, moves, captures or settles money**, which it does not.

**Class:** list · **Platforms:** C, A · **Archetypes:** detail, list-and-detail, workspace ·
**Reach:** 5 of 165
**User intent:** see what was agreed, what has been reported, and what is actually settled between the
parties.
**Requirements:** `FR-FINANCE-002`, `FR-FINANCE-003`, `FR-FINANCE-004`, `FR-FINANCE-007`
**Data source:** `API-FINANCE-005`, `API-FINANCE-001` on Profile C; `SDC-FINANCE-001` on Profile A.

**Composes** — mandatory core `CMP-PLATFORM-008` `financial`, `CMP-ELIG-002`; conditional
`CMP-PLATFORM-001` per event state, `CMP-PLATFORM-002` for the current position, `CMP-CLINICAL-002`
`resolution` where a dispute has been resolved, `CMP-PLATFORM-013` for the deciding reviewer,
`CMP-PLATFORM-004` for confirm, dispute and report actions.
**Patterns:** `IX-PLATFORM-016`, `IX-PLATFORM-010`, `IX-PLATFORM-001`, `IX-PLATFORM-008`,
`IX-AUDIT-001`.
**Content:** `TXT-PLATFORM-013`, `TXT-PLATFORM-015`, `TXT-PLATFORM-018`, `TXT-STATE-FINANCE-001`,
`TXT-ERR-FINANCE-001`.
**Accessibility:** `A11Y-FINANCE-001` (owner), `A11Y-PLATFORM-012`, `A11Y-PLATFORM-015`,
`A11Y-PLATFORM-030`, `A11Y-PLATFORM-023`, `A11Y-PLATFORM-011`.

**Anatomy**

```
[ agreed, from the immutable snapshot ]    the governing terms, in the currency that was agreed
[ event ]
   [ what was asserted ][ by whom ][ when ][ amount ][ state ]
   [ response ]                            confirm or dispute, appended, never editing the assertion
[ current position ]                       derived from the snapshot plus ordered events, and shown as
                                           derived
[ pending external execution ]             an obligation recorded for the parties to execute. The
                                           platform never executes it
```

**Variants**

| Variant | Where | Difference |
|---|---|---|
| `patient` | Patient financial timeline | The patient's own view, with report and respond actions where authorized |
| `case` | Clinic case financial workspace | The clinic side of the same events. No duplicate record exists |
| `operations` | Admin records operations, dispute review, external execution tracking | Both parties' assertions and the resolution, appended |

**Data states**

| State | Behaviour |
|---|---|
| `loading-initial` | The snapshot and the events load together. A position computed from events without the snapshot is a wrong position |
| `loading-refresh` | A new event appends and announces; the position recomputes and is announced once |
| `empty-no-data` | Terms agreed but no events yet: the agreed position renders and the event list states plainly that nothing has been reported |
| `empty-filtered` | Where events are filtered, the filter is named as the cause and history order is unchanged |
| `partial` | If any event failed to load, **the derived position is not rendered** and the block says so. A position over a partial event set is a wrong number |
| `stale` | The ledger carries its as-of time. An unconfirmed assertion read as settled is the failure this guards against |
| `error-fetch` | Known events preserved with retry |
| `error-permission` | A party sees only what they are authorized to see; a scope limit is stated rather than shown as a shorter history |
| `success` | The ledger and the derived position |
| Offline / unstable | Readable with as-of time. Reporting and responding are withdrawn |

**Right-to-left:** events run top to bottom; amounts, currencies, dates and event identifiers are
bidirectionally isolated per cell. An amount is never reordered.
**Long content and text scaling:** a dispute reason wraps in full. **No amount, currency, state or date
truncates at any size.** At the largest text sizes each event stacks with its amount adjacent to its
state.
**Responsive:** Profile C stacks one event per reading-column block, amount and state together. Profile
A keeps the ledger in the primary region and degrades to `reading-list` at
`profile-a.content-width.narrow` rather than truncating an amount column.

**Focus, keyboard and screen reader:** every amount announces with its currency and its state, so an
unconfirmed assertion is never heard as a settled fact. The derived position announces as derived. A
confirm or dispute announces the resulting state and moves focus to the appended response.

**Realization**

| Profile | Realization |
|---|---|
| C — Patient | `Native` — a stacked ledger with the agreed position first |
| A — Clinic, Admin | `Extended` — a Filament infolist and append-only table over the financial projection, with no edit or delete registered on any event |

**Prohibited:** any pay, wallet, balance, transfer, capture, settle or platform-refund affordance;
wording that implies custody, collection, holding, settlement or execution by the platform; an
unconfirmed assertion presented as a settled fact; editing or deleting any event; a resolution that
overwrites rather than appends; recomputing an agreed amount from a later exchange rate or currency
policy; presenting an entitlement decision as an execution.

**Placed on:** 5 screens — `SCR-FINANCE-002`, `SCR-FINANCE-006`, `SCR-FINANCE-010`, `SCR-FINANCE-011`,
`SCR-FINANCE-012`.

**Acceptance criteria**

1. Agreed, reported, confirmed, disputed, refunded and pending-external-execution are six visibly and
   audibly distinct states.
2. No surface exposes any affordance that would move, hold or settle money.
3. A partial event read renders no derived position and names the gap.
4. Every event is append-only; a resolution appends and the disputed record stays readable.
5. Every amount announces with its currency and its state.

---

### WGT-CLAIMS-001 — Claim evidence and deadline panel

**Purpose:** show which claim requirements are satisfied and which are not, with a reason per item, and
render an **effective deadline whose history is appended rather than replaced** — because a pause or an
extension that silently overwrites the original destroys the record of why the window moved.

**Class:** panel · **Platforms:** C, A · **Archetypes:** detail, form · **Reach:** 4 of 165
**User intent:** know what this claim still needs from me and by when.
**Requirements:** `FR-CLAIMS-002`, `FR-CLAIMS-003`, `FR-CLAIMS-004`
**Data source:** `API-CLAIMS-002`, `API-CLAIMS-004` on Profile C; `SDC-CLAIMS-001` on Profile A.

**Composes** — mandatory core `CMP-PLATFORM-005`, `CMP-PLATFORM-006` `embedded`; conditional
`CMP-PLATFORM-012` where the requirement is evidence, `CMP-CLINICAL-002` `deadline-history` for the
original against the effective deadline, `CMP-PLATFORM-001` per requirement state, `CMP-PLATFORM-013`
for the deciding reviewer, `CMP-PLATFORM-008` for the appended events.
**Patterns:** `IX-PLATFORM-006`, `IX-BOOKING-001`, `IX-AUDIT-001`, `IX-PLATFORM-018`,
`IX-PLATFORM-008`.
**Content:** `TXT-PLATFORM-011`, `TXT-PLATFORM-015`, `TXT-PLATFORM-018`, `TXT-STATE-CLAIMS-001`,
`TXT-ERR-CLAIMS-002`.
**Accessibility:** `A11Y-PLATFORM-034`, `A11Y-PLATFORM-012`, `A11Y-PLATFORM-015`, `A11Y-PLATFORM-011`,
`A11Y-PLATFORM-023`, `A11Y-AUDIT-001`.

**Anatomy**

```
[ original deadline ][ effective deadline ]     both, always. Never only the effective one
   [ what moved it ]                            appended pause and extension events with reasons
[ requirement ]
   [ state ][ reason ]                          missing, rejected, expired and accepted are four
                                                individually distinguishable states with reasons
[ what remains ]                                the count and the list, so the actor knows when done
```

**Variants**

| Variant | Where | Difference |
|---|---|---|
| `patient` | Patient protection claim and claim detail | The patient's own requirements only |
| `clinic` | Clinic claim response and evidence | Only requirements assigned to the clinic. **Never the patient's private evidence** |
| `reviewer` | Admin evidence and deadlines | Both parties' requirements within the reviewer's authorization, with the deadline history complete |

**Data states**

| State | Behaviour |
|---|---|
| `loading-initial` | Requirements resolve from the versioned policy snapshot governing this claim, not from current configuration |
| `loading-refresh` | A requirement satisfied by the counterparty refreshes in and announces |
| `empty-no-data` | No outstanding requirement: stated as complete, with the deadline still visible because it still governs |
| `empty-filtered` | Where requirements are filtered by party, the filter is named as the cause |
| `partial` | An unresolved requirement is never counted as satisfied and the remaining count says it is provisional |
| `stale` | Requirement states and the effective deadline carry the as-of time. A deadline read as further away than it is, is the worst failure on this surface |
| `error-fetch` | Known requirements preserved with retry; the deadline stays visible |
| `error-permission` | A party sees only their own assigned requirements; the boundary is stated rather than shown as a shorter list |
| `success` | Requirements, states and both deadlines |
| Offline / unstable | Readable with as-of time; supplying evidence resumes from its interruption point under `WGT-PLATFORM-008` |

**Right-to-left:** requirements flow start to end. Deadlines, claim identifiers and evidence identifiers
are bidirectionally isolated.
**Long content and text scaling:** a rejection reason wraps in full and never truncates, because it is
what the actor must act on. Both deadlines and the remaining time never truncate.
**Responsive:** Profile C stacks the deadline pair above the requirement list in the reading column.
Profile A keeps them together in the primary region; at `profile-a.content-width.narrow` each
requirement stacks with its state and reason.

**Focus, keyboard and screen reader:** the deadline pair announces as original and effective, with what
moved it available without a hover. Each requirement announces as requirement, state and reason. An
approaching unrecoverable deadline announces when it enters its approaching window, not when it lapses.

**Realization**

| Profile | Realization |
|---|---|
| C — Patient | `Native` — the deadline pair and the requirement list stacked |
| A — Clinic, Admin | `Extended` — a Filament infolist over the claim projection, with the deadline history as an appended event list and party-scoped requirement filtering applied server-side |

**Prohibited:** showing only the effective deadline; replacing an original deadline; a silent deadline
change; a generic incomplete-evidence message where a per-item reason exists; a clinic surface showing
the patient's private evidence; promising or implying a monetary outcome, insurance or a guaranteed
result; an approved remedy presented as a payment.

**Placed on:** 4 screens — `SCR-CLAIMS-003`, `SCR-CLAIMS-004`, `SCR-CLAIMS-007`, `SCR-CLAIMS-011`.

**Acceptance criteria**

1. Both the original and the effective deadline are visible, with the appended events that moved it.
2. Missing, rejected, expired and accepted requirements are four distinguishable states, each with a
   reason.
3. A clinic surface never renders the patient's private evidence, and the reverse holds.
4. An unrecoverable deadline announces as approaching before it lapses.
5. Requirements resolve from the governing policy snapshot, not from current configuration.
