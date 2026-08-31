# UberTib Interaction Patterns

**Phase:** UX 3 — Design System, Session 3 of 7
**Status:** Allocated. Sessions 5 to 7 bind copy and accessibility obligations to these identifiers.
**Owns:** how a repeated interaction behaves, independent of which component renders it.
**Does not own:** component anatomy (`COMPONENT_INVENTORY*.md`), token values
(`DESIGN_TOKENS.md`), final copy (Session 5), per-screen behaviour (Phase 4).

**Blocks live in:**

| File | Contents |
|---|---|
| `INTERACTION_PATTERNS.md` | this index, plus the 18 cross-cutting `IX-PLATFORM-*` blocks |
| `INTERACTION_PATTERNS_DOMAIN.md` | the 8 domain `IX-*` blocks |

---

## 1. What an `IX-*` is

An `IX-*` is **a behaviour derived from a canonical rule**, not from interface convention. Every one
below traces to a requirement, a state machine, an error definition or a Product Owner decision. A
pattern that would only be justified by "this is how apps usually work" is not here.

Each block carries the same fields in the same order:

user intent, trigger, preconditions, sequence, system feedback, loading, success, failure, recovery,
focus behaviour, keyboard behaviour, right-to-left implications, Patient versus desktop differences,
related `CMP-*`, related `WF-*`, related `FLOW-*`.

**Binding is not optional.** Every `IX-*` names at least one `CMP-*` and at least one `FLOW-*`. The
Phase 4 validator warns on a pattern never applied to a widget, so Phase 4 inherits a mapping rather
than reconstructing one.

### 1.1 The allocation rule

The same four-part test the components use, applied to behaviour: two genuinely distinct contexts,
the same behaviour in both, a documented harm if it goes wrong, and a rule that needs a home. A
behaviour that appears on one surface is that surface's behaviour and is specified in Phase 4.

Two additional rules that shaped this set:

- **A condition of use is not a pattern.** Weak connectivity is a documented condition, not an
  interaction. It produced four patterns — `IX-PLATFORM-002`, `-004`, `-005`, `-016` — and one
  component, and there is no `IX-*` called "weak network" for the same reason there is no component
  called "accessibility".
- **A pattern must not restate a component.** Reading a timeline is `CMP-PLATFORM-008`'s anatomy
  plus `IX-PLATFORM-008` and `IX-PLATFORM-016`. Allocating a timeline pattern would have described
  the component again under a second identifier.

---

## 2. Allocation registry — 26 patterns

### 2.1 Cross-cutting

| ID | Pattern | Derived from |
|---|---|---|
| `IX-PLATFORM-001` | Server-committed mutation | Principle 2; commit-is-truth; `FR-AUDIT-003` |
| `IX-PLATFORM-002` | Idempotent retry | `NFR-AUDIT-002`; `ERR-AUDIT-001` |
| `IX-PLATFORM-003` | Authoritative read refresh and staleness disclosure | cross-platform read refresh rules; `NFR-PLATFORM-006` |
| `IX-PLATFORM-004` | Resume and reconcile an unknown outcome | `SCR-PLATFORM-002`; `NFR-PLATFORM-006` |
| `IX-PLATFORM-005` | Draft save and resume without a submitted record | `NFR-PLATFORM-006`; applicant draft resumption |
| `IX-PLATFORM-006` | Resumable evidence transfer | `API-PLATFORM-001`; `PO-UX-17`; `ERR-PLATFORM-005` |
| `IX-PLATFORM-007` | Authorization loss and permission denial | `PERMISSIONS_MATRIX` sections 1 and 19; `NFR-IDENTITY-001` |
| `IX-PLATFORM-008` | Progressive disclosure | fixed by Phase 2 for all 165 wireframes |
| `IX-PLATFORM-009` | Long read with progress | `NFR-PLATFORM-001` |
| `IX-PLATFORM-010` | Bidirectional and mixed-direction content | `NFR-PLATFORM-005`; locale constraints |
| `IX-PLATFORM-011` | Text scaling and reflow | `NFR-PLATFORM-005`; the Phase 2 responsive rule |
| `IX-PLATFORM-012` | Input model per profile | platform profile constraints |
| `IX-PLATFORM-013` | Reduced-motion parity | `NFR-PLATFORM-005`; `motion.json` |
| `IX-PLATFORM-014` | Search, filter and filter persistence | `FR-ELIG-001`; `FR-OPS-001`; the two empty data states |
| `IX-PLATFORM-015` | List to detail and back | 29 list-and-detail wireframes; `ERR-PLATFORM-002` |
| `IX-PLATFORM-016` | Bounded reads over unbounded history | `NFR-AUDIT-001`; `NFR-PLATFORM-001`; append-only volume |
| `IX-PLATFORM-017` | Structural state resolution | the nine Phase 4 data states; `NFR-PLATFORM-006` |
| `IX-PLATFORM-018` | Field-bound validation and correction | `ERR-PLATFORM-001`; `NFR-PLATFORM-005` |

### 2.2 Domain

| ID | Pattern | Derived from |
|---|---|---|
| `IX-ELIG-001` | Revalidation at commit | `ERR-ELIG-001`; `ERR-ELIG-002`; `ERR-BOOKING-001` |
| `IX-BOOKING-001` | Deadline approach and expiry | `PO-UX-12`; `ERR-BOOKING-003`; copy obligation 1 |
| `IX-BOOKING-002` | Proposal without displacement | `FR-BOOKING-004`; reschedule and alternative semantics |
| `IX-CLINICAL-001` | Amendment disclosure and re-acceptance | `FR-CLINICAL-007`; `FR-CLINICAL-002` |
| `IX-POLICY-001` | Governed authoring, review gate and publication | `FR-POLICY-001`; `FR-CATALOG-002`; `FR-CATALOG-003`; `FR-OPS-003` |
| `IX-POLICY-002` | Version comparison and historical reproduction | `FR-POLICY-002`; `NFR-AUDIT-003` |
| `IX-OPS-001` | Flag against state in a work queue | `PO-UX-08`; `FR-OPS-001` |
| `IX-AUDIT-001` | Sensitive decision capture and irreversibility | `FR-AUDIT-001`; `FR-CLAIMS-004`; the action-naming rules |

**Total: 26.** The Phase 3 plan proposed 18. Eight were added because the behaviours they cover
repeat across the chain and had no home: search and filter, list to detail, paging, form validation,
governed publication, version comparison, proposal-without-displacement, and structural state
resolution. Each is justified in its own block.

---

## 3. Considered and not allocated

| Candidate | Disposition |
|---|---|
| **Filter persistence** | A required behaviour **inside** `IX-PLATFORM-014`, not a pattern of its own. Splitting it would let a surface implement filtering without persistence and still claim conformance. |
| **Retryable transfer failure** and **authoritative rejection** | Both **inside** `IX-PLATFORM-006`. Their whole point is that they are two exits from one machine; two patterns would re-open the gap the product closes. |
| **Weak network** | A condition of use, not an interaction. Answered by `IX-PLATFORM-002`, `-004`, `-005`, `-016` and `CMP-PLATFORM-011`. |
| **Stale data** | Inside `IX-PLATFORM-003`, because staleness is a property of the refresh contract rather than a separate behaviour. |
| **Destructive confirmation** | Inside `IX-AUDIT-001`. This product's confirmations are reason-capturing sensitive decisions, not generic "are you sure" dialogs, and a separate generic pattern would license the generic dialog. |
| **Irreversible versus reversible actions** | A classification carried by `IX-AUDIT-001` and `IX-BOOKING-001`, not a pattern. Principle 4 makes it a property of the action, and the action already has a home. |
| **Permission denial** | Inside `IX-PLATFORM-007`, together with authorization loss, because they are the same server truth reaching the interface at two different moments. |
| **Empty and recovery** | Component anatomy — `CMP-PLATFORM-009` and `-010` — plus `IX-PLATFORM-017`, which owns only the question of **which** structural state a surface resolves to and in what precedence. |
| **Timeline and history reading** | `CMP-PLATFORM-008` plus `IX-PLATFORM-008` and `IX-PLATFORM-016`. A pattern here would restate a component. |
| **Bulk operations** | Not allocated. One surface has a legitimate batch import; nine entities are immutable or append-only, so a general bulk pattern would license an affordance the product prohibits. The real risk is Filament shipping bulk actions by default, handled as a hard configuration rule on `CMP-PLATFORM-006`. |
| **Async refresh** as distinct from read refresh | One behaviour, one pattern: `IX-PLATFORM-003`. |
| **Optimistic UI** | Prohibited for clinical, financial and authorization outcomes by `IX-PLATFORM-001`. A pattern describing when it is allowed would be a pattern describing a filter, which is not a safety-critical interaction and does not need one. |

---

## 4. Rules binding every pattern

Stated once. Not repeated in every block.

1. **No optimistic rendering of a clinical, financial or authorization outcome.** `IX-PLATFORM-001`
   is the general form; every other pattern respects it.
2. **No hover interaction is ever part of a Profile C sequence.** Press, long-press and swipe
   replace it. `IX-PLATFORM-012`.
3. **Every Profile A sequence is completable by keyboard alone**, and a focused element is never
   obscured by the panel's sticky chrome.
4. **Every motion in a sequence has a reduced-motion equivalent that preserves the feedback.**
   `IX-PLATFORM-013`.
5. **Sequences are described in `start` and `end` terms.** No step depends on physical left or
   right.
6. **No sequence relies on push, SMS, email or a real-time transport for correctness.** There is no
   assumed real-time transport; every platform refreshes authoritative state itself.
7. **A failure never destroys the actor's input.**
8. **Where a pattern surfaces an `ERR-*`, the canonical Arabic message is referenced, never
   restated.** `docs/api/ERROR_CATALOG.md` owns it; Phase 3 owns what the user does next.

---

### IX-PLATFORM-001 — Server-committed mutation

**User intent:** commit something and know whether it actually happened.

**Trigger:** the actor invokes any of the named mutations — a booking request, a provider response,
a plan proposal or acceptance, a stage completion, a financial event, a review, a claim, an appeal,
a grant, a governance transition.

**Preconditions:** the actor is authenticated, within scope, and the record is in a state that
admits the action. An idempotency key is fixed at first submission.

**Sequence**

1. The action is invoked from `CMP-PLATFORM-004`.
2. Where the action is sensitive or irreversible, `CMP-PLATFORM-014` intervenes first.
3. The request is sent with its idempotency key. The interface renders **submitting**, not
   **submitted**.
4. The same intent cannot be re-submitted while in flight.
5. On a committed response, the surface **re-reads authoritative state** and renders what the server
   now says — not what the client predicted.
6. On any other outcome, `IX-PLATFORM-004` or the failure path below applies.

**System feedback:** `CMP-PLATFORM-011` throughout. The state names itself — pending, failed,
retrying, completed. An unlabelled spinner as the only feedback for a mutation is prohibited.

**Loading:** the invoked control shows its committing state; the surface stays readable and its
context is preserved. No layout shift, because the outcome region reserves its height.

**Success:** the committed state is read back and rendered through `CMP-PLATFORM-001` and
`CMP-PLATFORM-002`. **A committed state is never presented as pending because a notification did not
arrive**, and a notification that fails to deliver never reverses a committed state.

**Failure:** the failure is attributed to the action, the actor's input survives, and the offered
recovery is the one the retry matrix supports for that `ERR-*` rather than a uniform retry. A
validation failure routes to `IX-PLATFORM-018`; a precondition failure routes to the domain pattern
that owns it; an unknown outcome routes to `IX-PLATFORM-004`.

**Recovery:** retry under `IX-PLATFORM-002` where retry can help; otherwise the interface states
what must change and who can change it, and offers no retry control.

**Focus behaviour:** focus stays on the invoked control while in flight. On failure focus moves to
the failure message; on success focus moves to the region that changed, so a keyboard or screen
reader user is not left at a control whose meaning has changed under them.

**Keyboard behaviour:** the action is invoked by the platform's activation keys; re-activation while
in flight is a no-op rather than a second submission.

**Right-to-left implications:** none specific beyond the general rule. Correlation identifiers shown
on Admin failures are bidirectionally isolated.

**Patient versus desktop:** on Profile C the committing state is the most load-bearing part of the
pattern, because a weak connection makes the in-flight window long and the actor is likely to be
interrupted; the state survives leaving the surface and is listed on the pending-submissions
surface. On Profile A the in-flight window is short and the framework's action state carries it, but
double submission must still be structurally impossible.

**Related `CMP-*`:** `CMP-PLATFORM-004`, `CMP-PLATFORM-011`, `CMP-PLATFORM-014`,
`CMP-PLATFORM-002`, `CMP-PLATFORM-010`.

**Related `WF-*`:** every wireframe bound to `CMP-PLATFORM-011` — 68 of 165. Highest consequence:
`WF-BOOKING-002`, `WF-CLINICAL-004`, `WF-CLINICAL-012`, `WF-CLAIMS-012`, `WF-FINANCE-007`,
`WF-CATALOG-008`.

**Related `FLOW-*`:** `FLOW-BOOKING-001`, `FLOW-CLINICAL-002`, `FLOW-CLAIMS-006`,
`FLOW-FINANCE-002`, `FLOW-CATALOG-004`, `FLOW-PLATFORM-002`.

---

### IX-PLATFORM-002 — Idempotent retry

**User intent:** try again without risking a duplicate.

**Trigger:** a retryable failure on a mutation, or the actor explicitly retrying a failed
submission.

**Preconditions:** the original submission carried an idempotency key, and the failure is one the
retry matrix says retry can address.

**Sequence**

1. The failure is rendered with a retry that is explicitly a retry, not a new submission.
2. Retry reuses **the original key**.
3. The server either replays the original outcome or commits once.
4. The surface re-reads authoritative state.

**A new key is a new intent and is never issued automatically.** If the actor genuinely wants to
submit a second, different thing, that is a new action they take deliberately, from the action bar.

**System feedback:** `CMP-PLATFORM-011` shows **retrying**, distinguishable from **pending**. The
wording names the same submission; it never reads as a second attempt.

**Loading:** the retry control shows its own committing state. Attempt counts are not presented as a
penalty.

**Success:** exactly one committed record. A network retry of an already committed command creates
**zero** duplicate bookings, evidence, claims or financial events. Where the server replays a prior
outcome, the interface says the submission had already been received rather than implying the retry
caused it.

**Failure:** `ERR-AUDIT-001` is a key conflict — the same key used for a different intent. Its
recovery is not another retry: it is resolving the misuse, which means the interface must not have
reused a key across intents in the first place. A repeated retryable failure states how many times
it has been tried and stops offering an unbounded loop.

**Recovery:** where retry cannot help, `IX-PLATFORM-004` reconciles. Where the failure is not
retryable at all, `CMP-PLATFORM-010`'s `not-retryable` variant states what must change.

**Focus behaviour:** focus stays on or returns to the retry control between attempts, so repeated
retry does not require re-navigation.

**Keyboard behaviour:** retry is a real control reachable in the failure region's tab order.

**Right-to-left implications:** none specific.

**Patient versus desktop:** on Profile C retry is offered both in place and from the
pending-submissions surface, because the actor may have left the originating screen. On Profile A
retry is offered on the action and in the notification.

**Related `CMP-*`:** `CMP-PLATFORM-011`, `CMP-PLATFORM-010`, `CMP-PLATFORM-004`.

**Related `WF-*`:** `WF-PLATFORM-002`, `WF-BOOKING-002`, `WF-CLAIMS-002`, `WF-CLINICAL-004`,
`WF-FINANCE-003`, `WF-AUDIT-004`.

**Related `FLOW-*`:** `FLOW-PLATFORM-002`, `FLOW-AUDIT-002`, `FLOW-BOOKING-001`,
`FLOW-CLAIMS-001`.

---

### IX-PLATFORM-003 — Authoritative read refresh and staleness disclosure

**User intent:** trust that what is on the screen is current, or know that it is not.

**Trigger:** four moments, all four required — entry to the surface, refocus after the surface was
backgrounded, an explicit refresh by the actor, and completion of the surface's own mutation.

**Preconditions:** none. This applies to every surface with authoritative state.

**Sequence**

1. On entry, read authoritative state before rendering anything that could be acted on.
2. On refocus, re-read. There is **no assumed real-time transport**, so the interface cannot have
   been told what changed.
3. On explicit refresh, re-read and say when the read succeeded.
4. After the surface's own mutation, re-read rather than patching local state.

**System feedback:** a surface showing data older than its own last successful read marks itself
stale and states as-of when. Staleness is a state, not a silence.

**Loading:** initial load renders skeletons; a refresh keeps the existing content visible and marks
it refreshing. Content the actor was reading does not disappear to make room for a spinner.

**Success:** content is replaced and the as-of statement updates. Where nothing changed, the surface
says the read succeeded rather than appearing not to have run.

**Failure:** the last good projection is retained, marked stale with its as-of time, and retry is
offered — `CMP-PLATFORM-010`'s `stale` variant. **Stale and labelled beats blank**, because a
patient on a weak connection who can still read their confirmed appointment time is better served
than one shown an error page.

**Recovery:** retry. Where the failure is authorization rather than connectivity,
`IX-PLATFORM-007` takes over and the actions are removed.

**Focus behaviour:** a refresh does not move focus. Content replaced under a focused element must
keep that element focused or, if it no longer exists, move focus to its container and announce the
change — never drop focus to the document.

**Keyboard behaviour:** explicit refresh is a real control, not only a gesture, so Profile A can
reach it by keyboard.

**Right-to-left implications:** the as-of timestamp is bidirectionally isolated.

**Patient versus desktop:** Profile C adds pull-to-refresh **in addition to** a reachable refresh
control, and treats returning to the app as a refocus. Profile A relies on entry, explicit refresh
and post-mutation re-read; a long-lived panel tab is exactly the case where a stale projection is
dangerous, so refocus is not optional there either.

**Related `CMP-*`:** `CMP-PLATFORM-010`, `CMP-PLATFORM-002`, `CMP-PLATFORM-006`,
`CMP-PLATFORM-015`.

**Related `WF-*`:** all 165 in principle; highest consequence on `WF-BOOKING-004`,
`WF-ELIG-002`, `WF-ELIG-011`, `WF-OPS-002`, `WF-PLATFORM-001`, `WF-CLAIMS-004`.

**Related `FLOW-*`:** `FLOW-PLATFORM-004`, `FLOW-ELIG-014`, `FLOW-BOOKING-012`,
`FLOW-IDENTITY-019`.

---

### IX-PLATFORM-004 — Resume and reconcile an unknown outcome

**User intent:** find out what happened to something I submitted, before doing anything else.

**Trigger:** a mutation whose result is unknown — the connection dropped after the request left, the
app was killed mid-submission, or the response never arrived.

**Preconditions:** the submission is recorded locally with its idempotency key and its intent.

**Sequence**

1. The surface renders `CMP-PLATFORM-010`'s `unknown-outcome` variant.
2. **No new command of the same intent is offered.** Not a retry labelled as a new submission, not
   the original action re-enabled.
3. Reconciliation reads authoritative state for the affected record.
4. The outcome is one of three: it committed, it did not, or it is still unknown. Each is stated
   plainly.
5. Only once the outcome is known does the surface restore its normal action set.

**System feedback:** `CMP-PLATFORM-011` shows the submission as outstanding, with reconciliation in
progress rather than success or failure.

**Loading:** reconciliation shows its own progress. If it cannot complete, the submission stays
outstanding and visible rather than being quietly dropped.

**Success:** the true outcome is rendered. If it committed, the record's state is shown and the
submission moves to completed. If it did not, retry under `IX-PLATFORM-002` becomes available with
the original key.

**Failure:** reconciliation itself failed. The submission stays outstanding, the surface says the
outcome is still unknown, and no new command is offered. Guessing is worse than waiting.

**Recovery:** the pending-submissions surface is the durable home for every outstanding submission,
so recovery does not depend on the actor returning to the originating screen.

**Focus behaviour:** focus moves to the unknown-outcome block when it replaces the action region,
because leaving focus on a control that no longer acts is how a keyboard user submits twice.

**Keyboard behaviour:** reconcile is a reachable control. The suppressed original action is
**absent**, not present and inert, so it cannot be reached and activated.

**Right-to-left implications:** none specific.

**Patient versus desktop:** this pattern is load-bearing on Profile C, where the condition is
common. On Profile A it is rarer but not absent, and the panel must not silently retry on the
actor's behalf.

**Related `CMP-*`:** `CMP-PLATFORM-010`, `CMP-PLATFORM-011`, `CMP-PLATFORM-004`.

**Related `WF-*`:** `WF-PLATFORM-002`, `WF-BOOKING-002`, `WF-CLINICAL-004`, `WF-CLAIMS-002`,
`WF-FINANCE-003`, `WF-REVIEWS-002`.

**Related `FLOW-*`:** `FLOW-PLATFORM-002`, `FLOW-BOOKING-001`, `FLOW-CLAIMS-001`.

---

### IX-PLATFORM-005 — Draft save and resume without a submitted record

**User intent:** stop partway through something long and come back to it, without having submitted
anything.

**Trigger:** the actor leaves a multi-part authoring surface, or the surface autosaves.

**Preconditions:** the surface is one whose in-progress data is recoverable — a provider
application, a treatment plan, a market-observation batch, a claim, a policy version.

**Sequence**

1. In-progress data is saved as a draft, with its last-saved time visible.
2. **The draft creates no submitted business record.** `DRAFT` is a real lifecycle status in six of
   the eighteen machines and it is not a submission.
3. On return, the draft is offered with what it contains and when it was saved.
4. Submission is a separate, deliberate act with its own confirmation where the action is sensitive.

**System feedback:** the draft status through `CMP-PLATFORM-001`, plus a visible last-saved time.
Per-section completeness is shown where the surface has sections, so the actor knows what remains
rather than discovering it at submission.

**Loading:** resuming a draft loads its content before offering submission. A partially loaded draft
is never submittable.

**Success:** the draft persists across sessions, devices where the account allows it, and app
restarts.

**Failure:** if the draft cannot be saved, the actor is told **while they can still act**, not on
return. A save failure never silently discards input.

**Recovery:** the most recent successfully saved draft, with its as-of time stated so the actor
knows what they will lose.

**Focus behaviour:** on resume, focus lands on the first incomplete required field, not at the top
of the form. On a long workspace, focus returns to the section the actor left.

**Keyboard behaviour:** save-and-close is a reachable control, not only an implicit behaviour, so a
Profile A actor can commit a draft deliberately.

**Right-to-left implications:** the last-saved timestamp is bidirectionally isolated.

**Patient versus desktop:** on Profile C draft survival is a resilience requirement, because the app
may be backgrounded or killed at any point. On Profile A it serves the interruption rate `PO-UX-07`
records: a front-desk actor is interrupted mid-form routinely, and losing the form is the cost.

**Related `CMP-*`:** `CMP-PLATFORM-001`, `CMP-PLATFORM-011`, `CMP-PLATFORM-004`,
`CMP-CLINICAL-001`, `CMP-PLATFORM-006`.

**Related `WF-*`:** `WF-IDENTITY-012`, `WF-IDENTITY-013`, `WF-IDENTITY-014`, `WF-IDENTITY-016`,
`WF-CLINICAL-010`, `WF-CLINICAL-011`, `WF-ELIG-023`, `WF-CATALOG-005`, `WF-POLICY-002`,
`WF-CLAIMS-002`.

**Related `FLOW-*`:** `FLOW-IDENTITY-006`, `FLOW-CLINICAL-001`, `FLOW-ELIG-016`,
`FLOW-CATALOG-002`, `FLOW-POLICY-001`, `FLOW-PLATFORM-002`.

---

### IX-PLATFORM-006 — Resumable evidence transfer

**User intent:** get a document to the other side, and know whether it was accepted.

**Trigger:** the actor selects one or more files to attach to an action — an application, an
activation request, a stage completion, a claim, a claim response.

**Preconditions:** the actor is within scope for the owning record. The transfer is
provider-neutral; the concrete storage and malware-scanning vendor is unresolved under `Q-OPS-001`
and does not change this contract.

**Sequence** — the eight fixed session states, in order, with two exits:

1. `SELECTED` — chosen, not moving.
2. `UPLOADING` — moving, with determinate progress.
3. `PAUSED` — held; resume offered. Reached deliberately or by losing connectivity.
4. `FAILED_RETRYABLE` — **transfer failed. Retry offered. Not a rejection.**
5. `UPLOADED` — transferred and **not yet usable**.
6. `VALIDATING_SCANNING` — undergoing the required safety check.
7. `ACCEPTED` — cleared for use. **First exit.**
8. `REJECTED` — refused by validation or by a reviewer, with the specific correctable requirement
   named. **Second exit.**

**The structural separation is the whole pattern.** `FAILED_RETRYABLE` is reachable only from
transfer; `REJECTED` only from validation or review. A dropped connection can never route to
`ERR-PLATFORM-005`, and `ERR-PLATFORM-005` guidance can never be reachable from a transfer failure.

**System feedback:** `CMP-PLATFORM-012` per item, with each state's triple. Progress is determinate
while transferring; `VALIDATING_SCANNING` is explicitly indeterminate **with a reason**, never a
bare spinner.

**Loading:** `UPLOADING` and `VALIDATING_SCANNING`. The owning action is not submittable while any
required item is short of `ACCEPTED`, and the surface says which item is holding it.

**Success:** `ACCEPTED`, bound to the owning record. `UPLOADED` is not success: evidence stays
quarantined until scanning and validation pass, and the two states carry different tones and
different icons so the difference is visible rather than documented.

**Failure:** two entirely different failures with two entirely different treatments.
`FAILED_RETRYABLE` says the transfer did not complete and offers resume or retry — the most likely
evidence failure in this product's conditions. `REJECTED` says the document does not meet a named
requirement and offers replacement. **Conflating them tells a patient on a weak connection that
their document was refused when the network merely dropped.**

**Recovery:** resume from where the transfer stopped where the session supports it; otherwise retry
the item without re-entering the rest of the form. A rejection is recovered by correcting the named
requirement, not by retrying the same file.

**Focus behaviour:** focus stays in the evidence region across state changes. On rejection, focus
moves to the rejected item's reason, because that is the only place the actor can act.

**Keyboard behaviour:** file selection, resume, retry, replace and remove are all reachable by
keyboard. Drag-and-drop is never the only way to attach a file.

**Right-to-left implications:** progress fills from `start` to `end` in both directions. A file name
truncates in the middle so the extension stays visible, and the name is bidirectionally isolated
because a Latin file name inside an Arabic interface must not reorder.

**Patient versus desktop:** on Profile C resumability is the requirement — a transfer interrupted by
a tunnel or a handover resumes rather than restarting. On Profile A a reviewer sees the same eight
states but takes the review actions instead of the transfer actions, and the `access-log` variant
offers neither.

**Related `CMP-*`:** `CMP-PLATFORM-012`, `CMP-PLATFORM-011`, `CMP-PLATFORM-010`,
`CMP-PLATFORM-006`, `CMP-PLATFORM-004`.

**Related `WF-*`:** `WF-IDENTITY-015`, `WF-IDENTITY-029`, `WF-ELIG-009`, `WF-ELIG-017`,
`WF-CLINICAL-014`, `WF-CLAIMS-003`, `WF-CLAIMS-007`, `WF-CLAIMS-011`, `WF-PLATFORM-006`.

**Related `FLOW-*`:** `FLOW-PLATFORM-001`, `FLOW-CLAIMS-003`, `FLOW-ELIG-007`,
`FLOW-CLINICAL-004`, `FLOW-IDENTITY-007`.

---

### IX-PLATFORM-007 — Authorization loss and permission denial

**User intent:** understand that I cannot do this, and what I can do instead.

**Trigger:** two moments of the same server truth — the actor opens a surface they are not
authorised for, or a grant is revoked or narrowed **while** the surface is already open.

**Preconditions:** authorization is enforced server-side, on every REST endpoint, both panels,
evidence paths, queued jobs, work queues, reports, exports and notifications. Hiding an action is
never an authorization control.

**Sequence**

1. The next protected read or action after the change fails.
2. The surface renders `CMP-PLATFORM-010`'s `permission-denied` variant.
3. **Stale actions are removed**, not disabled. A stale session is not a valid authorization
   context.
4. The actor is told what scope they do hold and how to obtain the right one.
5. `CMP-PLATFORM-003` reflects the changed scope, because the header is the safety context.

**System feedback:** no retry is offered, because retry cannot change authorization. The denial
names no internal permission key and never implies an override exists.

**Loading:** none specific. A protected read in flight when the grant changes resolves as denied
rather than as a fetch failure, so the actor is not sent to retry something that will never succeed.

**Success:** not applicable. The successful outcome of this pattern is that no mutation happened
under a revoked grant.

**Failure:** the failure this pattern exists to prevent is an open page continuing to mutate after
its grant was revoked. A revoked grant must stop it.

**Recovery:** navigate to a scope the actor does hold. Where the loss is authentication rather than
authorization, `CMP-PLATFORM-010`'s `authentication-required` variant routes back through
authentication and returns to this context afterwards.

**Focus behaviour:** focus moves to the denial block when it replaces the content, and the route to
a permitted scope is the first control within it.

**Keyboard behaviour:** the removed actions are absent from the tab order entirely. A disabled
control left in the tab order both implies an override and wastes a keyboard user's time.

**Right-to-left implications:** none specific.

**Patient versus desktop:** on Profile C the common case is a guardian grant revoked or expired
while the app is open, and the represented subject must disappear from the context switcher as well
as from the surface. On Profile A the common case is a staff scope grant revoked mid-shift, and the
panel's own navigation must stop offering the resources that grant reached.

**Related `CMP-*`:** `CMP-PLATFORM-010`, `CMP-PLATFORM-003`, `CMP-PLATFORM-004`,
`CMP-PLATFORM-006`.

**Related `WF-*`:** `WF-IDENTITY-007`, `WF-IDENTITY-008`, `WF-IDENTITY-022`, `WF-IDENTITY-026`,
`WF-IDENTITY-034`, `WF-IDENTITY-035`, `WF-ELIG-013`, `WF-OPS-002`, `WF-PLATFORM-006`.

**Related `FLOW-*`:** `FLOW-IDENTITY-004`, `FLOW-IDENTITY-016`, `FLOW-IDENTITY-019`,
`FLOW-IDENTITY-017`, `FLOW-ELIG-012`.

---

### IX-PLATFORM-008 — Progressive disclosure

**User intent:** do the task without reading everything about it.

**Trigger:** entry to any surface. Fixed by Phase 2 for all 165 wireframes: task first, history and
advanced detail on demand.

**Preconditions:** none.

**Sequence**

1. The surface renders the authoritative state, the controlling reason and the available action.
2. History, full evaluation detail, provenance and advanced options are behind an explicit
   disclosure.
3. Opening a disclosure never moves what the actor was already reading.
4. Disclosure state is not remembered across surfaces, so a reader never returns to a surface
   configured by a decision they made elsewhere.

**System feedback:** each disclosure states what it contains before it is opened. "More" is not a
label.

**Loading:** content behind a disclosure may load on open, with its own loading state inside the
disclosure rather than blocking the surface.

**Success:** the disclosure opens in place using `motion.transition.disclosure`.

**Failure:** a disclosure whose content fails to load says so inside itself and offers retry there.
The surface's primary content is unaffected.

**Recovery:** retry inside the disclosure.

**Focus behaviour:** the disclosure control keeps focus on open; focus does not jump into the
revealed content. The revealed content is the next stop in the tab order, which is what makes the
behaviour predictable for both keyboard and screen reader users.

**Keyboard behaviour:** the control declares its expanded state and toggles on the platform's
activation keys.

**Right-to-left implications:** the disclosure indicator sits at the `end` and mirrors. The reveal
animates in the block direction, not the inline direction, so it is direction-neutral.

**Patient versus desktop:** on Profile C disclosure is the main mechanism that keeps one reading
column usable, and a disclosure is never a hover-revealed tooltip. On Profile A disclosure keeps
the twelve-column content grid legible at `operational` density and must not hide an action the
actor needs on every visit — `PO-UX-07`'s interruption rate makes a buried frequent action a real
cost.

**Related `CMP-*`:** `CMP-PLATFORM-002`, `CMP-PLATFORM-008`, `CMP-ELIG-002`, `CMP-ELIG-003`,
`CMP-CLINICAL-001`, `CMP-CLINICAL-002`, `CMP-POLICY-001`.

**Related `WF-*`:** all 165, fixed by Phase 2. Highest consequence on `WF-ELIG-018`,
`WF-CLINICAL-003`, `WF-CLAIMS-010`, `WF-CATALOG-004`.

**Related `FLOW-*`:** `FLOW-ELIG-002`, `FLOW-ELIG-010`, `FLOW-CLINICAL-002`,
`FLOW-CLINICAL-008`, `FLOW-AUDIT-001`.

---

### IX-PLATFORM-009 — Long read with progress

**User intent:** know that the system is still working, and roughly how far it has got.

**Trigger:** a read whose latency budget is loose enough that the actor will notice — provider
search above all, plus operational reports, audit queries and decision inspection.

**Preconditions:** `NFR-PLATFORM-001` sets ordinary reads at the 95th percentile within half a
second, writes within eight-tenths, and provider search within one second. **Provider search sits on
the loosest budget and the most important discovery job.**

**Sequence**

1. The read starts and the surface immediately shows that it started.
2. Where partial results are meaningful, they render as they arrive and the surface says more are
   coming.
3. Where they are not, a skeleton of the expected shape holds the layout.
4. On completion the surface states the result count.

**System feedback:** progress, not a bare spinner. Direction rule 3.9 prohibits an indeterminate
spinner as the only feedback for a mutation, and the same reasoning applies to a read the actor is
waiting on.

**Loading:** skeletons at the real content's height, so completion does not shift the layout. The
filter bar stays interactive during a search, because changing the query is the most likely thing a
waiting actor wants to do.

**Success:** results with their count. A search that returns nothing resolves to
`filtered-empty`, not to an error — see `IX-PLATFORM-017`.

**Failure:** `CMP-PLATFORM-010`'s `fetch-failure`, with the query preserved so retry does not mean
re-entering it. `ERR-PLATFORM-003` rate limiting states when the next attempt is possible rather
than inviting an immediate retry.

**Recovery:** retry with the same query; or narrow the query, which is offered explicitly because a
narrower query is often the faster path.

**Focus behaviour:** focus stays in the query input while results load, so the actor can keep
typing. When results arrive focus does not move; the count change is announced instead.

**Keyboard behaviour:** submitting the query and cancelling a running read are both reachable.

**Right-to-left implications:** the result count is bidirectionally isolated.

**Patient versus desktop:** on Profile C provider search is the case that matters, and it must show
progress rather than appearing stalled on a slow connection. On Profile A the equivalent is a report
or audit query over a large set, where `IX-PLATFORM-016` also applies and the surface must say what
bound it applied.

**Related `CMP-*`:** `CMP-PLATFORM-007`, `CMP-PLATFORM-006`, `CMP-ELIG-001`,
`CMP-PLATFORM-010`, `CMP-PLATFORM-009`.

**Related `WF-*`:** `WF-ELIG-001`, `WF-ELIG-002`, `WF-ELIG-005`, `WF-AUDIT-001`, `WF-OPS-004`,
`WF-OPS-005`, `WF-ELIG-018`.

**Related `FLOW-*`:** `FLOW-ELIG-001`, `FLOW-ELIG-004`, `FLOW-OPS-003`, `FLOW-AUDIT-001`.

---

### IX-PLATFORM-010 — Bidirectional and mixed-direction content

**User intent:** read a code, an amount, a date or a Latin name inside Arabic text and get it right.

**Trigger:** any surface rendering mixed-direction content. That is most of them.

**Preconditions:** production patient and staff journeys are Arabic-first and right-to-left. Western
digits with tabular lining figures throughout, decided in `DESIGN_TOKENS.md` section 4.4.

**Sequence**

1. Every mixed-direction run is **isolated** at render time, not styled after the fact.
2. Service codes, procedure codes, version identifiers, amounts with currency, dates, times,
   durations, correlation identifiers and Latin clinic and doctor names are each isolated.
3. Numeric columns keep their own internal direction and are aligned logically.
4. Directional icons mirror; non-directional icons do not.

**Why this is a correctness pattern and not a layout one:** a reordered code is a **wrong** code and
a reordered amount is a **wrong** amount. `UX_FOUNDATION.md` section 5.1 names mixed Arabic and
Latin codes inside right-to-left text as a sized-for case, not an edge case.

**System feedback:** none. The pattern is invisible when it works, which is why it needs a
mechanical check rather than review.

**Loading:** none specific.

**Success:** the run reads in its own direction inside text that reads in the other, at every text
size and in both light and dark.

**Failure:** silent, and that is the danger. A reordered identifier produces no error; it produces a
reader who acts on the wrong record.

**Recovery:** none available at the interface layer. This is prevented, not recovered.

**Focus behaviour:** focus order follows logical reading order, not visual position, so a mixed-
direction row does not produce a tab order that jumps.

**Keyboard behaviour:** an input containing a Latin code inside an Arabic interface keeps caret
movement consistent with the run the caret is in.

**Right-to-left implications:** this pattern **is** the right-to-left implication. Every component
anatomy in the system is defined in `start` and `end` terms so that no layout depends on physical
direction, and there is no start-edge accent strip anywhere for the same reason.

**Patient versus desktop:** identical obligations. The difference is only where the content appears:
Profile C shows service codes and amounts inside a reading column; Profile A additionally shows
correlation identifiers, content hashes and version numbers in the mono identifier style, which is
never reachable from a Patient surface.

**Related `CMP-*`:** every component. Named explicitly: `CMP-ELIG-002`, `CMP-CLINICAL-001`,
`CMP-POLICY-001`, `CMP-PLATFORM-005`, `CMP-PLATFORM-006`, `CMP-PLATFORM-008`.

**Related `WF-*`:** all 165.

**Related `FLOW-*`:** `FLOW-CATALOG-001`, `FLOW-CLINICAL-002`, `FLOW-FINANCE-001`,
`FLOW-AUDIT-001`.

---

### IX-PLATFORM-011 — Text scaling and reflow

**User intent:** read the interface at the size I need.

**Trigger:** the actor's platform text size setting, or browser zoom on Profile A.

**Preconditions:** text scales to twice its default without loss of content or function. Arabic body
leading is set for diacritics rather than inherited from a Latin scale, and letter spacing has
exactly one value, zero.

**Sequence**

1. At each step of text size, layout reflows rather than clipping.
2. **At the largest supported size, critical regions stack rather than truncate.** This is a
   threshold, not a width — Profile C applies it at every size class.
3. A table degrades to a single-column list rather than scrolling horizontally.
4. No content becomes unreachable and no action becomes unreachable.

**System feedback:** none.

**Loading:** skeletons scale with the text, so a completed load does not shift the layout at large
sizes when it did not at default.

**Success:** the page body never scrolls horizontally. Wide content — a table, a diagram, a code
block — scrolls inside its own container.

**Failure:** clipped text, a truncated amount, an unreachable action, or a horizontally scrolling
page. Each is a defect, and truncating an amount, a deadline, a controlling reason or an attribution
is a **correctness** failure rather than a cosmetic one.

**Recovery:** none at the interface layer. Prevented, not recovered.

**Focus behaviour:** a focused element scrolls into view within its own container and is never
obscured by sticky chrome at any text size. Both panels use a framework shell with sticky chrome, so
this is a real risk rather than a theoretical one.

**Keyboard behaviour:** unchanged by text size. A control that becomes reachable only by scrolling a
container is still reachable by keyboard.

**Right-to-left implications:** reflow uses logical properties, so it behaves identically in both
directions rather than being verified in one and assumed in the other.

**Patient versus desktop:** Profile C honours the platform's own maximum text size, keeps one
reading column at every size class, and respects safe areas; a wider device produces whitespace, not
a second pane. Profile A honours browser zoom and the framework's own responsive behaviour, and
tablet is a supported layout rather than a degraded one, so `dense` mode may not assume a mouse.

**Related `CMP-*`:** every component; each block states its long-content and stacking behaviour.

**Related `WF-*`:** all 165. The Phase 2 responsive rule is stated on every block.

**Related `FLOW-*`:** `FLOW-CATALOG-001`, `FLOW-BOOKING-001`, `FLOW-CLINICAL-002`,
`FLOW-OPS-001`.

---

### IX-PLATFORM-012 — Input model per profile

**User intent:** operate the interface with the input my platform actually has.

**Trigger:** any interaction. This is a standing constraint rather than an event.

**Preconditions:** Profile C is React Native and has **no hover state**. Profile A is a Filament
panel used on desktop and on tablet.

**Sequence** — two models, not one model with a fallback:

**Profile C.** Press, long-press and swipe. **No hover state is ever emitted.** No behaviour is
revealed only by hovering, because nothing can hover. No tooltip carries information, because a
tooltip is unreachable by touch and transient for a screen reader. A long-press or swipe action has
a reachable equivalent, because a gesture is a shortcut and never the only route. Targets clear
`semantic.size.target-primary` for a primary action and `semantic.size.target-floor` for everything
else.

**Profile A.** Keyboard-complete. Every sequence is completable by keyboard alone; hover is an
enhancement and never the only way to reveal a row action; a focused element is never obscured by
the sticky shell; tablet is supported, so `dense` mode may not assume a mouse and hit areas are
expanded rather than shrunk to the visual box.

**System feedback:** press feedback on Profile C uses `semantic.opacity.pressed`; hover and focus
treatments on Profile A come from the action tokens and the focus tokens respectively. Focus is
never merged into hover: a focus ring that only appears on hover is invisible to a keyboard user.

**Loading, success, failure, recovery:** inherited from the pattern the interaction belongs to. This
pattern governs the input channel, not the outcome.

**Focus behaviour:** focus is visible in **both** profiles. Profile C is not exempt: an external
keyboard on a tablet is a supported input, and the focus tokens are not derived from the action
colour precisely so the ring survives on top of an action, a destructive control and every status
emphasis fill.

**Keyboard behaviour:** the whole point of the Profile A half.

**Right-to-left implications:** a swipe's direction is defined logically, so a swipe-to-act gesture
means the same thing in both directions rather than reversing meaning for an Arabic reader.

**Patient versus desktop:** this pattern **is** the difference. Emitting a specification that does
not apply to the declared profile is a defect caught at every verification gate, and in particular
no hover row may ever be emitted for the Patient app.

**Related `CMP-*`:** every component; each block declares `hover: n/a (Profile C)` explicitly rather
than leaving it to be inferred.

**Related `WF-*`:** all 165 — 47 Patient, 118 panel.

**Related `FLOW-*`:** `FLOW-BOOKING-003`, `FLOW-OPS-001`, `FLOW-CLINICAL-001`,
`FLOW-IDENTITY-018`.

---

### IX-PLATFORM-013 — Reduced-motion parity

**User intent:** use the interface without motion, and lose no information.

**Trigger:** the actor's reduced-motion preference.

**Preconditions:** motion is tokenised — durations, easings and six transition presets — and the
motion source declares a reduced-motion strategy of preserving feedback and removing travel.

**Sequence**

1. Every transition has a reduced-motion equivalent, defined rather than derived.
2. Travel is removed; the **feedback** is preserved. A disclosure still confirms it opened, a commit
   still confirms it committed.
3. Where a transition carried meaning — this replaced that, this came from there — the meaning moves
   into wording or position, not into a faster version of the same animation.
4. Nothing becomes instantaneous in a way that hides that it happened.

**System feedback:** unchanged in substance. A state change that was announced with motion is still
announced.

**Loading:** determinate progress remains a progress indicator; it does not become a static
placeholder. Indeterminate progress states its reason in words, which it must do anyway.

**Success and failure:** identical outcomes with identical feedback.

**Recovery:** not applicable.

**Focus behaviour:** unchanged. Focus movement is not motion in the sense this preference concerns,
and a reduced-motion setting never suppresses a focus move that a pattern requires.

**Keyboard behaviour:** unchanged.

**Right-to-left implications:** none — removing travel removes the only direction-dependent part of
a transition.

**Patient versus desktop:** identical obligation. Profile C has the additional constraint that the
runtime and the network already argue against choreography, so the reduced-motion variant and the
default are close together by design.

**Related `CMP-*`:** `CMP-PLATFORM-014` (overlay enter and exit), `CMP-PLATFORM-011` (progress),
`CMP-PLATFORM-002` and `CMP-PLATFORM-008` (disclosure), `CMP-PLATFORM-005` (value change).

**Related `WF-*`:** all 165.

**Related `FLOW-*`:** `FLOW-PLATFORM-004`, `FLOW-CLINICAL-008`, `FLOW-BOOKING-001`.

---

### IX-PLATFORM-014 — Search, filter and filter persistence

**User intent:** narrow a set to what I am looking for, and not have to do it again next time.

**Trigger:** the actor types a query, applies a filter, or returns to a surface they had filtered.

**Preconditions:** the surface has a result set. Filtering is server-side, because a row the actor
may not see must not be filtered out on the client — its existence can itself be information.

**Sequence**

1. The query or filter is applied and the result set is replaced.
2. **The applied filter stays visible**, always, in `CMP-PLATFORM-007`'s active summary.
3. The result count states shown against total where a total is knowable.
4. On return to the surface, a `queue` or `management` filter is **restored**; a `discovery` query is
   not, because a stale search is a worse default than an empty one.
5. Clearing is a single reachable control, not only per-chip removal.

**System feedback:** the count and the active summary together. An unexplained short result is
indistinguishable from no data, which is why the summary is not optional.

**Loading:** the bar stays interactive; `IX-PLATFORM-009` governs the progress treatment; the
previous result set stays visible while the new one loads rather than blanking.

**Success:** the narrowed set, with the filter and the count both stated.

**Failure:** a rejected filter value is reported against that control in place, keeping the previous
valid value — `IX-PLATFORM-018`. A failed read keeps the query so retry does not mean re-entering
it.

**Recovery:** relax the filter, clear it, or retry. **A filtered-empty result offers relaxation; a
genuinely empty set offers the first action.** They are different states with different copy and
different actions, and `IX-PLATFORM-017` fixes which one applies.

**Focus behaviour:** focus stays in the control the actor used. It never jumps to the results, which
would prevent refining a query.

**Keyboard behaviour:** the input is early in the tab order on a list surface; filters are reachable
without entering a hover-revealed menu; clear-all is reachable.

**Right-to-left implications:** the input's own text direction follows its content, so a Latin code
typed into an Arabic interface does not reverse. Clear sits at the input's `end`. The active summary
wraps rather than scrolling horizontally.

**Patient versus desktop:** Profile C keeps a small set of filters visible rather than behind a
drawer, because the discovery path is the patient's most important job and a hidden filter is a
hidden result. Patient discovery is entered through **service families**, never a flat list of
professional procedure codes, and **no Patient filter selects an internal classification, grade,
confidence or risk value.** Profile A uses framework filters with persistence declared per surface,
and a queue's scope filter is expected to survive because a staff actor works the same scope every
day.

**Related `CMP-*`:** `CMP-PLATFORM-007`, `CMP-PLATFORM-006`, `CMP-PLATFORM-009`,
`CMP-PLATFORM-010`, `CMP-ELIG-001`, `CMP-OPS-001`.

**Related `WF-*`:** the 39 wireframes bound to `CMP-PLATFORM-007`. Highest consequence:
`WF-ELIG-001`, `WF-ELIG-002`, `WF-OPS-002`, `WF-AUDIT-001`, `WF-CLAIMS-009`, `WF-CLINICAL-010`.

**Related `FLOW-*`:** `FLOW-ELIG-001`, `FLOW-OPS-001`, `FLOW-OPS-002`, `FLOW-AUDIT-001`,
`FLOW-CLINICAL-001`.

---

### IX-PLATFORM-015 — List to detail and back

**User intent:** open one record from a set, act on it, and get back to where I was.

**Trigger:** the actor selects a row, or arrives at a detail surface by link or deep link.

**Preconditions:** the actor is within scope for the record. 29 wireframes are `list-and-detail` and
many more embed a list.

**Sequence**

1. The row is selected and the detail surface is entered.
2. The detail surface reads **authoritative state for that record**, not the row's projection. A row
   is a summary and may be stale; acting on a summary is how the wrong state gets acted on.
3. Returning restores the list's **filter, sort, scroll position and selection** — the state the
   actor built, not a default view.
4. A change made in the detail surface is reflected in the list on return, by re-reading rather than
   by patching the row.

**System feedback:** the selected row is marked selected while the detail is open on Profile A,
where both are visible. `CMP-PLATFORM-003` states the subject on the detail surface, because the
list's context does not travel with the actor.

**Loading:** the detail surface shows its own loading state; it does not render the row's projection
as if it were the full record.

**Success:** the detail surface, with the record's own authoritative state.

**Failure:** a record that cannot be read renders `CMP-PLATFORM-010` and the return route stays
available. `ERR-PLATFORM-002` covers not-found and intentionally-undisclosed as one code, so the
detail surface must not distinguish them in a way that reveals existence, and its recovery routes
back to the list rather than inviting retry.

**Recovery:** return to the list with its state intact. A deep link to a record the actor cannot see
resolves to the denial or not-found state, never to a blank surface.

**Focus behaviour:** on entering the detail, focus moves to the detail's heading or its state
summary, not to the first control. On returning, **focus returns to the row the actor came from**,
which is the single most commonly missed half of this pattern and the one that makes a queue usable
by keyboard.

**Keyboard behaviour:** rows are reachable and activated by the platform's activation keys; the
return route is a real control as well as a browser or platform back gesture.

**Right-to-left implications:** the row's disclosure chevron sits at the `end` and mirrors. A
master-detail split on Profile A places the list at `start`.

**Patient versus desktop:** Profile C pushes the detail as a new screen and returns by the platform
back gesture, with list state restored; a swipe-back must not lose the filter. Profile A may show
list and detail together at wider content widths, in which case selection is visible and the return
route is a deselect rather than a navigation — but the list's state obligations are identical.

**Related `CMP-*`:** `CMP-PLATFORM-006`, `CMP-PLATFORM-007`, `CMP-PLATFORM-002`,
`CMP-PLATFORM-003`, `CMP-PLATFORM-010`, `CMP-OPS-001`.

**Related `WF-*`:** the 29 `list-and-detail` wireframes and the detail surfaces they reach.
Highest consequence: `WF-OPS-002` to `WF-OPS-003`, `WF-CLAIMS-009` to `WF-CLAIMS-010`,
`WF-BOOKING-003` to `WF-BOOKING-004`, `WF-IDENTITY-027` to `WF-IDENTITY-028`.

**Related `FLOW-*`:** `FLOW-OPS-001`, `FLOW-CLAIMS-005`, `FLOW-BOOKING-012`,
`FLOW-IDENTITY-008`, `FLOW-CLINICAL-009`.

---

### IX-PLATFORM-016 — Bounded reads over unbounded history

**User intent:** read a long history without waiting for all of it, and know whether I am seeing all
of it.

**Trigger:** any read over a set with no natural bound — audit events, work items, booking events,
financial events, case timelines, claim deadline events, notification entries.

**Preconditions:** several entities are append-only with very high volume. `NFR-PLATFORM-001` bounds
what the interface may ask for.

**Sequence**

1. The first page is read and rendered.
2. **The bound is stated.** Where a page size, a top-N, a date window or a sampling rule was
   applied, the surface says so. A silent cap reads as complete coverage.
3. Further pages are requested explicitly, or incrementally on Profile C.
4. **Ordering is stable across pages**, because it is a property of the record rather than of the
   view. An unstable sort over append-only history misrepresents the order of events, which for an
   audit or financial log is a correctness failure.

**System feedback:** the count shown, whether more exist, and what bound is in force.

**Loading:** appending a page does not move what the actor has already read and does not reset
scroll position. The append region has its own loading state.

**Success:** the next page appended in order.

**Failure:** the loaded pages stay, the surface states that older entries could not be read, and
retry is offered for that page. **A truncated history is never rendered as complete.**

**Recovery:** retry the page; narrow the window; or, on Admin surfaces, export where the actor is
authorised — and an export is itself a sensitive action under `IX-AUDIT-001` when it carries
personal data.

**Focus behaviour:** focus stays where it was after an append. The load-more control, once used,
either stays focused or moves focus to the first newly appended entry — chosen per surface and
stated, not left to chance.

**Keyboard behaviour:** load-more is a real control. Infinite scrolling without a reachable
load-more control is prohibited on Profile A, because it makes the end of a list unreachable by
keyboard.

**Right-to-left implications:** counts and page indicators are bidirectionally isolated.

**Patient versus desktop:** Profile C loads incrementally as the actor reads, with a reachable
load-more control as well; a case timeline with dozens of events is the sized-for case. Profile A
uses the framework paginator with an explicit page size, and the audit explorer must state its
bound because it is the surface where an unstated bound would most mislead.

**Related `CMP-*`:** `CMP-PLATFORM-008`, `CMP-PLATFORM-006`, `CMP-PLATFORM-007`,
`CMP-PLATFORM-010`, `CMP-OPS-001`.

**Related `WF-*`:** the 33 wireframes bound to `CMP-PLATFORM-008` plus the 29 `list-and-detail`.
Highest consequence: `WF-AUDIT-001`, `WF-AUDIT-002`, `WF-CLINICAL-005`, `WF-FINANCE-002`,
`WF-BOOKING-015`, `WF-PLATFORM-006`.

**Related `FLOW-*`:** `FLOW-AUDIT-001`, `FLOW-CLINICAL-008`, `FLOW-FINANCE-007`,
`FLOW-OPS-003`, `FLOW-PLATFORM-003`.

---

### IX-PLATFORM-017 — Structural state resolution

**User intent:** understand what I am looking at when there is nothing to look at.

**Trigger:** any read completing, failing, or completing with nothing.

**Preconditions:** Phase 4 requires nine data states per widget — loading-initial, loading-refresh,
empty-no-data, empty-filtered, partial, stale, error-fetch, error-permission, success. This pattern
fixes which one a surface resolves to and in what precedence, so Phase 4 inherits the decision
rather than making it 165 times.

**Sequence** — the precedence is fixed and is not a per-surface choice:

1. **error-permission** wins over everything. An actor outside scope is told that, not that the set
   is empty. `IX-PLATFORM-007`.
2. **error-fetch** next, unless a previous good projection exists, in which case **stale** is
   preferred — labelled, with its as-of time. Stale and labelled beats blank.
3. **loading-initial** while no content exists; **loading-refresh** while content does.
4. **empty-filtered** where a filter is applied; **empty-no-data** only where none is.
5. **partial** where some of the surface loaded and some did not, naming which part failed.
6. **success**.

**System feedback:** each state names itself. The two failure modes this pattern exists to prevent
are an empty state shown during loading, which is a false statement, and an error shown as an empty
state, which tells the actor nothing is wrong.

**Loading:** `loading-initial` renders skeletons at the content's height. `loading-refresh` keeps
content visible. Neither ever renders `CMP-PLATFORM-009`.

**Success:** content.

**Failure:** `CMP-PLATFORM-010`, in the variant the precedence selected. **A partial read is never
presented as complete** — a surface that loaded its list but not its status summary says so, because
an actor who sees no pending status concludes nothing is pending.

**Recovery:** the recovery belongs to the resolved state: relax a filter, take a first action, retry,
reconcile, or change scope.

**Focus behaviour:** when a structural state replaces content the actor was reading, focus moves to
the new state's block and it is announced. A silent replacement leaves a screen reader user acting on
a surface that is no longer there.

**Keyboard behaviour:** each structural state's action is reachable without traversing the whole
block.

**Right-to-left implications:** the blocks are centred or start-aligned by logical property and
mirror without change.

**Patient versus desktop:** on Profile C the **stale** preference matters most, because a patient on
a weak connection who can still read their confirmed appointment is better served than one shown an
error page. On Profile A **error-permission** matters most, because a staff actor's scope changes
during a shift and a permission failure rendered as an empty queue looks like a quiet day.

**Related `CMP-*`:** `CMP-PLATFORM-009`, `CMP-PLATFORM-010`, `CMP-PLATFORM-006`,
`CMP-PLATFORM-007`, `CMP-PLATFORM-002`, `CMP-PLATFORM-011`.

**Related `WF-*`:** all 165. Every wireframe is bound to both structural-state components.

**Related `FLOW-*`:** `FLOW-PLATFORM-002`, `FLOW-PLATFORM-004`, `FLOW-ELIG-001`,
`FLOW-OPS-001`, `FLOW-IDENTITY-019`.

---

### IX-PLATFORM-018 — Field-bound validation and correction

**User intent:** find out exactly what is wrong with what I entered, and fix only that.

**Trigger:** a submission rejected on validation, or a reviewer returning an itemised set of
requested changes.

**Preconditions:** 58 wireframes are the `form` archetype. `ERR-PLATFORM-001` is raised when the
request parses but fields, formats, enumerations, combinations or safe business-input constraints
are invalid.

**Sequence**

1. Validation is server-authoritative. Client-side checks are a courtesy and never the contract.
2. **Every error is bound to the field it concerns**, not collected only in a summary.
3. A summary additionally lists the errors and links to each field, for a long form.
4. Each message says what is wrong **and how to fix it**.
5. The actor's input survives entirely. Nothing is cleared.
6. Correcting a field clears its own error without re-submitting the form.

**System feedback:** the field's error treatment plus its message, and the summary count. Colour is
never the only indicator: an error carries its message and its icon as well as its border.

**Loading:** the submit control shows its committing state; fields stay editable where the platform
allows, so the actor can start correcting.

**Success:** the submission proceeds under `IX-PLATFORM-001`.

**Failure:** where the failure is a domain precondition rather than field validity — a plan that
cannot be accepted, a line violating a commercial integrity rule, a claim outside its window — the
message is bound to the **responsible field** where one exists and to the action where none does,
and it names the rule that was broken rather than saying the input is invalid. `ERR-CLINICAL-002` is
the clearest case: the offending element is a category, a reason or a represented treatment, and the
message says which.

**Recovery:** correct and re-submit. The retry carries the same idempotency key if the original
submission never reached the server, and a new key only if the actor's intent changed — which
correcting a field does not.

**Focus behaviour:** on failure, focus moves to the **first field in error**, not to the summary and
not to the top of the form. On correcting the last error, focus stays where the actor is; it does
not jump to submit.

**Keyboard behaviour:** each summary entry is a link that moves focus to its field. The form is
completable and correctable by keyboard alone on Profile A.

**Right-to-left implications:** the error message sits below its field in the block direction, which
is direction-neutral. A rejected value containing a Latin code is echoed back bidirectionally
isolated, so the actor can see exactly what was rejected.

**Patient versus desktop:** on Profile C the error must be visible without hovering or scrolling
away from the field, and the keyboard must not cover it. On Profile A a long form uses the summary
as the primary navigation between errors, and the framework's own validation display is configured
rather than replaced.

**Related `CMP-*`:** `CMP-PLATFORM-004`, `CMP-PLATFORM-011`, `CMP-PLATFORM-010`,
`CMP-CLINICAL-001`, `CMP-CLINICAL-002`, `CMP-PLATFORM-012`.

**Related `WF-*`:** the 58 `form` wireframes and the 5 `workspace` wireframes. Highest
consequence: `WF-IDENTITY-013`, `WF-IDENTITY-016`, `WF-CLINICAL-011`, `WF-CLINICAL-012`,
`WF-ELIG-010`, `WF-CLAIMS-002`, `WF-FINANCE-007`.

**Related `FLOW-*`:** `FLOW-IDENTITY-006`, `FLOW-IDENTITY-010`, `FLOW-CLINICAL-001`,
`FLOW-ELIG-008`, `FLOW-CLAIMS-001`, `FLOW-FINANCE-002`.
