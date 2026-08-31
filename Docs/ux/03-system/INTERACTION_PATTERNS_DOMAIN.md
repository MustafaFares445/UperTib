# Interaction Patterns — Domain

**Phase:** UX 3 — Design System, Session 3 of 7
**Index, allocation rule and dispositions:** `INTERACTION_PATTERNS.md`
**Components:** `COMPONENT_INVENTORY_PLATFORM.md`, `COMPONENT_INVENTORY_DOMAIN.md`

Eight patterns. Each carries a **non-negotiable behaviour** the chain has already fixed, and each is
the place that behaviour becomes structural rather than remembered. The eight rules in section 4 of
the index bind every block here and are not repeated.

---

### IX-ELIG-001 — Revalidation at commit

**User intent:** act on what I saw, and be told honestly if it has changed since.

**Trigger:** the actor commits an action whose validity depends on one of the two
highest-volatility records — an eligibility decision or an appointment slot.

**Preconditions:** `eligibility_decisions` and `appointment_slots` can change between a screen
loading and the actor acting on it. Every surface built on them needs a staleness answer and a
revalidation-failure path; this is why `ERR-ELIG-001`, `ERR-ELIG-002` and `ERR-BOOKING-001` exist.

**Sequence**

1. The surface renders the option with its assessment time, so the actor knows the read is a
   point-in-time fact rather than a promise.
2. The actor commits.
3. **The server revalidates at commit.** The client never treats its own earlier read as sufficient.
4. Either the commit proceeds, or revalidation fails and the actor is told what changed.

**System feedback:** on the read side, the assessment time through `CMP-PLATFORM-002` and
`CMP-ELIG-001`. On the commit side, `CMP-PLATFORM-011`.

**Loading:** the commit shows its committing state. Revalidation is part of the commit, not a
separate visible step, because a two-stage progress display invites the actor to think the first
stage succeeded.

**Success:** the commit, plus the surface re-reading authoritative state.

**Failure:** three distinct failures with three distinct treatments, and collapsing them is the
error this pattern prevents.

- `ERR-ELIG-001` — the provider, service and branch is no longer eligible. Retry does not help. The
  actor is told the option is no longer available and offered the alternatives that are, through
  `CMP-ELIG-003`. This is not a fault of the actor and is not worded as one.
- `ERR-ELIG-002` — eligibility is pending evaluation or required evidence. **No immediate retry**,
  because retry cannot advance an evaluation waiting on evidence. Pending is stated as pending, never
  as a refusal.
- `ERR-BOOKING-001` — the slot or its capacity is gone. Retry does not help; another slot does. The
  capacity guarantee in `NFR-PLATFORM-001` is why a booking can fail at the last step, so **this path
  is designed rather than treated as an anomaly**.

**Recovery:** choose another option, refresh availability, or wait for the evaluation to progress —
matched to which of the three failures occurred, never a generic retry.

**Focus behaviour:** focus moves to the explanation, then to the alternatives. Focus does not return
to a commit control that will fail again for the same reason.

**Keyboard behaviour:** the alternatives are reachable from the failure region without returning to
the list.

**Right-to-left implications:** the assessment time and the slot time are bidirectionally isolated.

**Patient versus desktop:** on Profile C this is the most consequential failure in the discovery and
booking path, and the wording must not imply the patient did something wrong. On Profile A the same
revalidation binds the clinic responding to a request and the admin resolving a held booking; the
Clinic panel additionally sees the controlling blocker through `CMP-ELIG-003`'s `provider` variant,
while the Patient sees only practical meaning.

**Related `CMP-*`:** `CMP-ELIG-001`, `CMP-ELIG-003`, `CMP-PLATFORM-002`, `CMP-PLATFORM-010`,
`CMP-PLATFORM-011`, `CMP-PLATFORM-004`.

**Related `WF-*`:** `WF-ELIG-002`, `WF-ELIG-003`, `WF-ELIG-004`, `WF-ELIG-005`, `WF-ELIG-011`,
`WF-ELIG-021`, `WF-ELIG-022`, `WF-BOOKING-001`, `WF-BOOKING-002`, `WF-BOOKING-009`,
`WF-BOOKING-014`.

**Related `FLOW-*`:** `FLOW-ELIG-005`, `FLOW-ELIG-011`, `FLOW-ELIG-014`, `FLOW-ELIG-015`,
`FLOW-BOOKING-001`, `FLOW-BOOKING-003`.

**Non-negotiable behaviour carried:** **eligibility fail-closed.** `ELIGIBILITY_REVIEW` removes
attendance, start and completion actions **structurally** while the owning eligibility scope remains
suspended. No override control is designed, on any surface, for any role. There is no interface path
that proceeds past a suspended scope.

---

### IX-BOOKING-001 — Deadline approach and expiry

**User intent:** know a window is running while I can still use it, and know what happened when it
closes.

**Trigger:** a policy-governed window opens on a record the actor is responsible for — an
alternative proposal, a provider response deadline, a claim evidence deadline, an appeal window, a
review window, an eligibility-review due time, a code resend throttle, a plan proposal validity, an
invitation, a launch-gate expiry, a credential expiry.

**Preconditions:** the window's duration and the point at which it becomes approaching are
**policy data** from the effective policy version, not styling and not a token.

**Sequence**

1. The window opens and the deadline is visible **immediately**, wherever the obligation appears.
2. It becomes approaching at the policy-defined point, changing tone, icon and wording together.
3. It closes.
4. The outcome is stated in terms of what the closure means, not in terms of the timer.

**System feedback:** `CMP-PLATFORM-005` on the record, plus `CMP-PLATFORM-015` on the attention
surface **and** the notification centre. The duplication is deliberate: no delivery transport may be
relied on for correctness, so the obligation must be discoverable without a message arriving.

**Loading:** the indicator is absent until the deadline is known. A placeholder that could be read
as remaining time is prohibited.

**Success:** the actor acted inside the window. The deadline disappears and the record's own state
carries the outcome.

**Failure — and this is where the pattern earns its allocation.** Principle 4 distinguishes a
recoverable lapse from an unrecoverable one, and the interface must reflect that rather than
smoothing it.

- **Recoverable lapse.** The window closed and the outcome is still reachable another way. The
  alternative is named, concretely.
- **Unrecoverable lapse.** An expired claim window, an expired appeal window, a lapsed provider
  response deadline. What was lost is stated plainly and **no retry is offered**, because
  `ERR-BOOKING-003` and `ERR-CLAIMS-001` make retry futile and offering it would be dishonest.

**Recovery:** whatever genuinely exists, and nothing more.

**Focus behaviour:** on closure while the surface is open, the dependent actions are **removed** and
focus moves to the statement of what happened. Leaving focus on an action that will now fail is how
an actor discovers a lapse by being refused.

**Keyboard behaviour:** the deadline is text and reachable. It is not conveyed only by a live
counter, which a screen reader user would be chasing.

**Right-to-left implications:** remaining time and absolute end time are bidirectionally isolated,
in Western digits with tabular lining figures so the value does not reflow as it counts down.

**Patient versus desktop:** on Profile C the patient did not choose most of these windows, which is
why the approach signal is the one accessibility failure the palette correction in
`DESIGN_TOKENS.md` section 2.1 existed to fix. On Profile A the provider response deadline is the
one that matters, `PO-UX-07` records these actors as working against it, and the clinic dashboard
and booking inbox both carry remaining time per item.

**Related `CMP-*`:** `CMP-PLATFORM-005`, `CMP-PLATFORM-015`, `CMP-PLATFORM-001`,
`CMP-PLATFORM-002`, `CMP-PLATFORM-004`, `CMP-CLINICAL-002`.

**Related `WF-*`:** the 58 wireframes bound to `CMP-PLATFORM-005`. Highest consequence:
`WF-BOOKING-005`, `WF-BOOKING-009`, `WF-CLAIMS-003`, `WF-CLAIMS-011`, `WF-REVIEWS-004`,
`WF-IDENTITY-003`, `WF-ELIG-022`, `WF-CATALOG-006`.

**Related `FLOW-*`:** `FLOW-BOOKING-006`, `FLOW-BOOKING-007`, `FLOW-CLAIMS-003`,
`FLOW-REVIEWS-002`, `FLOW-IDENTITY-001`, `FLOW-CATALOG-003`.

**Non-negotiable behaviour carried:** **a non-confirmation is never a punitive cancellation.** A
booking closed because an alternative was declined or expired reads as an appointment that was not
confirmed. It carries no penalty language, because there is no penalty — and booking `CANCELLED`
itself resolves to `tone.restricted` rather than `tone.danger`, because three of its reason codes
carry no patient penalty at all and the tone must not assert an outcome the reason may not support.

---

### IX-BOOKING-002 — Proposal without displacement

**User intent:** consider a different time without losing the one I already have.

**Trigger:** a counterparty proposes an alternative appointment or a reschedule — clinic to patient,
or patient to clinic.

**Preconditions:** the original appointment is `CONFIRMED`. The proposal is a governed record with
its own lifecycle, distinct from the booking's.

**Sequence**

1. The proposal is created and enters `PENDING` with its own deadline.
2. **The original confirmed appointment remains the authoritative one** and is displayed as such.
   The proposal is displayed **alongside** it, never in its place.
3. The counterparty accepts, declines, lets it expire, or the proposer withdraws it.
4. On acceptance, **revalidation runs** under `IX-ELIG-001`.
5. Only on successful revalidation does the booking move. Until then, nothing has moved.

**System feedback:** two `CMP-PLATFORM-001` chips — the booking's state and the proposal's state —
never merged into one. `CMP-PLATFORM-002` summarises both, with the confirmed appointment first.
`CMP-PLATFORM-005` carries the proposal's deadline.

**Loading:** acceptance shows its committing state through `CMP-PLATFORM-011`. The original
appointment stays visible throughout, because the actor may need to know what they still have if the
acceptance fails.

**Success:** the booking moves to the proposed time and the proposal is `ACCEPTED`. The prior time
appears in the booking's append-only history through `CMP-PLATFORM-008`.

**Failure:**

- **Revalidation fails at acceptance.** The proposal is not accepted, **the original appointment
  remains confirmed and unchanged**, and the actor is told which revalidation failed. This is the
  failure the pattern exists to make safe: an acceptance that half-succeeded would leave the actor
  with neither appointment.
- **The proposal expires or is declined.** The original appointment is unaffected where it still
  exists. Where the proposal was the only route to a confirmation, `IX-BOOKING-001`'s
  non-confirmation wording applies and no cancellation is asserted.
- **The proposer withdraws.** Stated as a withdrawal by the named party, not as a change of state
  that happened on its own.

**Recovery:** the original appointment, or a new proposal, or a new request. Each is offered
explicitly rather than left to be inferred.

**Focus behaviour:** on arriving at the decision surface, focus lands on the comparison of the two
times, not on accept. On failure, focus moves to the failure statement with the original appointment
still visible above it.

**Keyboard behaviour:** accept and decline are separate reachable controls. Decline is never only a
dismissal, because dismissing a proposal and declining it are different acts with different records.

**Right-to-left implications:** the original time sits at `start` and the proposed time at `end` in
both directions, so the pairing reads as before-and-after in reading order rather than by physical
position.

**Patient versus desktop:** on Profile C the two times are stacked, original first, because a
side-by-side comparison of two datetimes in one reading column is a false economy. On Profile A the
clinic sees its outstanding proposals as a queue and must be able to withdraw one, and the admin
oversight surface sees the proposal's full append-only history.

**Related `CMP-*`:** `CMP-PLATFORM-001`, `CMP-PLATFORM-002`, `CMP-PLATFORM-005`,
`CMP-PLATFORM-008`, `CMP-PLATFORM-014`, `CMP-PLATFORM-011`, `CMP-CLINICAL-002`.

**Related `WF-*`:** `WF-BOOKING-005`, `WF-BOOKING-010`, `WF-BOOKING-016`, `WF-BOOKING-017`,
`WF-BOOKING-004`, `WF-BOOKING-014`, `WF-BOOKING-015`.

**Related `FLOW-*`:** `FLOW-BOOKING-005`, `FLOW-BOOKING-006`, `FLOW-BOOKING-007`,
`FLOW-BOOKING-013`, `FLOW-BOOKING-014`, `FLOW-BOOKING-012`.

**Non-negotiable behaviour carried:** **pending reschedule semantics.** A pending reschedule
proposal never displaces the original confirmed appointment before counterparty acceptance **and**
successful revalidation. The proposal's state never substitutes for the booking's state, and the two
are rendered as two.

---

### IX-CLINICAL-001 — Amendment disclosure and re-acceptance

**User intent:** see exactly what changed before I agree again.

**Trigger:** a clinician proposes an amendment to a plan the patient has already accepted.

**Preconditions:** an accepted plan exists with an **immutable** accepted treatment snapshot and an
immutable financial terms snapshot behind it.

**Sequence**

1. The clinician authors a new plan version and proposes it. The prior accepted version is
   untouched.
2. The patient is shown **what changed**, itemised, through `CMP-CLINICAL-002`'s `amendment`
   variant — not two complete plans to compare by eye.
3. **Acceptance is not available until the change set has been disclosed.** This is the narrow
   legitimate use of a blocked control: the same actor becomes able to act by doing something
   visible on this surface.
4. On acceptance, a **new** snapshot is created. The prior one remains readable and immutable.
5. The prior accepted terms stay reachable from the case for the life of the record.

**System feedback:** `CMP-CLINICAL-002` for the change set, `CMP-CLINICAL-001` per changed line,
`CMP-ELIG-002` for each amount with its own mode, and `CMP-PLATFORM-013` naming the clinician who
proposed it.

**Loading:** **both sides of the change set load together.** A one-sided render is prohibited,
because a change set with the prior side missing reads as the whole truth.

**Success:** the new version is `ACCEPTED`, a new financial terms snapshot exists, and both the prior
and the new snapshot are readable.

**Failure:**

- **Either side of the comparison cannot be read.** No accept action is offered at all. Accepting
  terms you were not shown is exactly the failure this pattern prevents.
- `ERR-CLINICAL-001` — the plan cannot be accepted. The reason is bound to what must change and to
  who can change it, and the prior accepted version remains in force meanwhile.
- **Commit fails.** The prior accepted version remains in force, unambiguously. There is no
  intermediate state in which the patient has accepted something that did not commit.

**Recovery:** re-read, retry under `IX-PLATFORM-002`, or decline and raise the question with the
clinician. The prior terms are never lost.

**Focus behaviour:** focus lands on the change set, not on accept. After disclosure, accept becomes
available but focus is not moved onto it — moving focus onto a newly enabled irreversible control is
how it gets activated by a keystroke already in flight.

**Keyboard behaviour:** the change set is traversable item by item; accept and decline are separate
reachable controls; the confirmation is focus-trapped under `CMP-PLATFORM-014`.

**Right-to-left implications:** prior at `start`, amended at `end`, or stacked prior-first on
Profile C. Amounts, version identifiers and procedure references are bidirectionally isolated.

**Patient versus desktop:** on Profile C this is one of the highest-consequence surfaces in the
product and the change set is stacked with the prior version first. On Profile A the clinician
authors the amendment and must see what they are changing before proposing it, and the admin
oversight surface reads the same comparison without either authoring or accepting.

**Related `CMP-*`:** `CMP-CLINICAL-002`, `CMP-CLINICAL-001`, `CMP-ELIG-002`,
`CMP-PLATFORM-013`, `CMP-PLATFORM-014`, `CMP-PLATFORM-008`, `CMP-PLATFORM-011`.

**Related `WF-*`:** `WF-CLINICAL-003`, `WF-CLINICAL-004`, `WF-CLINICAL-012`, `WF-CLINICAL-013`,
`WF-CLINICAL-019`, `WF-FINANCE-001`.

**Related `FLOW-*`:** `FLOW-CLINICAL-003`, `FLOW-CLINICAL-002`, `FLOW-CLINICAL-010`,
`FLOW-FINANCE-001`, `FLOW-CLINICAL-009`.

**Non-negotiable behaviour carried:** **immutable accepted snapshots.** Accepted treatment and
financial terms snapshots are visibly historical and immutable. No interface presents a generic edit
or delete affordance for them; a correction is a new version, and the prior version stays readable
at **full contrast** rather than dimmed.

---

### IX-POLICY-001 — Governed authoring, review gate and publication

**User intent:** change operational behaviour without a code release, and without anything going
live unreviewed.

**Trigger:** an authorised admin authors or transitions a governed record — a service definition, a
procedure item version, a family mapping, a commercial option, a policy version, a launch gate.

**Preconditions:** the record is governed data with its own versioning, effective dates and review
gates. **Configurable does not mean instant or unreviewed.**

**Sequence**

1. A new version is authored as `draft` — see `IX-PLATFORM-005`; a draft is not a publication.
2. It is submitted for review and becomes `reviewed` when an accountable reviewer records a
   decision. **Clinical content additionally requires a licensed clinical review**, whose
   credential state is itself governed.
3. Launch gates are recorded as **append-only decisions**. A gate can be `pending`, `approved`,
   `rejected`, `revoked` or `expired`, and each decision is appended rather than edited.
4. The version becomes `scheduled` with an effective date, then `active` at that date. The prior
   active version becomes `superseded` and stays readable.
5. Retirement moves it to `retired`, still readable.

**System feedback:** `CMP-POLICY-001` throughout — the version identity, its lifecycle state, its
effective period, its gate states and their expiries, and the accountable reviewer through
`CMP-PLATFORM-013`. Gate decisions appear in `CMP-PLATFORM-008`'s `governance` variant.

**Loading:** **a surface must not render governed content without stating which version produced
it.** That is how provisional content gets read as approved, so the version header loads before the
content it frames.

**Success:** the intended version is effective at the intended time, its predecessor is readable,
and past cases are unaffected by the change.

**Failure:**

- **A gate is expired.** Production readiness **fails closed**. `expired` is the status most likely
  to be misread as still approved, which is why it carries `solid` emphasis, and the header states
  it rather than letting an absent gate look like an approved one.
- **A reviewer credential is `revoked` or `expired`.** The review it would support is not valid, and
  the surface says which credential and whose.
- **Effective periods overlap.** Reported as a conflict on the scheduling surface, before
  activation, naming both versions.
- **The transition is not permitted for this actor.** `IX-PLATFORM-007`; the control is absent with
  its reason, and the gate is shown as pending with its owner named.

**Recovery:** correct the draft, obtain the missing gate or credential, or reschedule. Nothing is
recovered by publishing anyway; there is no path that does.

**Focus behaviour:** on a gate or scheduling failure, focus moves to the specific gate or the
conflicting period, not to a summary.

**Keyboard behaviour:** every transition is a reachable action with a confirmation under
`IX-AUDIT-001`. The version selector and the history list are keyboard reachable from the header.

**Right-to-left implications:** version identifiers and effective dates are bidirectionally
isolated. A version identifier is Latin-with-digits and must not render its digits in one system and
its letters in another.

**Patient versus desktop:** **no Patient surface participates in this pattern at all.** The patient
reads the consequence of a governed version through `CMP-PLATFORM-002` and `CMP-ELIG-002`, never the
version record. `CMP-POLICY-001` is `n/a` on Profile C by design, and that exclusion is part of the
pattern rather than an omission from it.

**Related `CMP-*`:** `CMP-POLICY-001`, `CMP-PLATFORM-013`, `CMP-PLATFORM-014`,
`CMP-PLATFORM-008`, `CMP-CLINICAL-002`, `CMP-PLATFORM-006`, `CMP-PLATFORM-001`.

**Related `WF-*`:** `WF-CATALOG-004`, `WF-CATALOG-005`, `WF-CATALOG-006`, `WF-CATALOG-007`,
`WF-CATALOG-008`, `WF-CATALOG-009`, `WF-CATALOG-010`, `WF-CATALOG-011`, `WF-POLICY-001`,
`WF-POLICY-002`, `WF-POLICY-003`, `WF-ELIG-019`, `WF-ELIG-023`, `WF-OPS-006`.

**Related `FLOW-*`:** `FLOW-CATALOG-002`, `FLOW-CATALOG-003`, `FLOW-CATALOG-004`,
`FLOW-CATALOG-005`, `FLOW-CATALOG-006`, `FLOW-CATALOG-007`, `FLOW-POLICY-001`, `FLOW-OPS-004`,
`FLOW-ELIG-016`.

**Non-negotiable behaviour carried:** **governed versions.** Admin-editable clinical and commercial
behaviour is versioned governed data with review gates and effective dates. Clinical publication
retains its licensed-review gate. Historical versions remain inspectable. **No surface presents
provisional catalog data as clinically production-approved** while `Q-CATALOG-001` or `Q-ELIG-001`
still gates it. And **market-observation compression keeps all required provenance while the
calibration output stays internal**: the calibration *state* is a governance state on the version
header, and the calibrated values are never rendered as a market or city average anywhere.

---

### IX-POLICY-002 — Version comparison and historical reproduction

**User intent:** see what a version changed, or check that a past decision still reproduces.

**Trigger:** the actor compares two versions of a governed record, or reproduces a historical
decision under the policy that was effective at the time.

**Preconditions:** versions are readable indefinitely; append-only decisions and immutable snapshots
retain what was in force.

**Sequence**

1. The actor selects a version, and either its predecessor or a chosen comparand.
2. The change set is rendered through `CMP-CLINICAL-002`'s `version` variant — itemised, both sides
   labelled, with each side's effective period and gate state.
3. For a reproduction, the recorded decision is re-evaluated under its **then-effective** policy
   version, and the reproduced outcome is compared against the recorded one.
4. The verdict is **match or mismatch**, stated explicitly.

**System feedback:** `CMP-POLICY-001` for each side's identity and gate state,
`CMP-CLINICAL-002` for the change set, `CMP-PLATFORM-013` for who changed or decided,
`CMP-PLATFORM-008` for the appended decisions in between.

**Loading:** both sides together. A reproduction shows its own progress and does not present a
partial re-evaluation as a verdict.

**Success:** the change set, or a stated match.

**Failure:**

- **A mismatch.** This is a **result, not an error.** It is stated as an integrity mismatch with
  both outcomes shown, and it routes to the integrity-exception surface rather than to a retry.
  Treating a mismatch as a failed read would hide exactly what the reproduction exists to find.
- **Either version cannot be read.** No comparison and no verdict is offered.
  `CMP-PLATFORM-010`.
- **The then-effective policy cannot be determined.** The reproduction does not run, and the surface
  says why rather than reproducing under the current policy — which would produce a confident wrong
  answer.

**Recovery:** retry the read. A mismatch is not recovered by re-running; it is escalated as an
integrity exception with its affected record and policy references.

**Focus behaviour:** focus moves to the verdict, then to the change set. On a mismatch, focus moves
to the differing values.

**Keyboard behaviour:** the version selector, the comparand selector and the change set are all
keyboard traversable; each changed item is a stop rather than the whole set being one region.

**Right-to-left implications:** prior at `start`, later at `end`; version identifiers, effective
dates and content hashes bidirectionally isolated, with hashes in the mono identifier style on Admin
surfaces only.

**Patient versus desktop:** **Admin only.** No Patient or Clinic surface reproduces a decision. The
Clinic panel sees the *consequence* of a version change through `CMP-ELIG-003` and
`CMP-CLINICAL-001`, and the patient sees neither.

**Related `CMP-*`:** `CMP-CLINICAL-002`, `CMP-POLICY-001`, `CMP-PLATFORM-013`,
`CMP-PLATFORM-008`, `CMP-PLATFORM-006`, `CMP-PLATFORM-010`.

**Related `WF-*`:** `WF-POLICY-001`, `WF-POLICY-003`, `WF-POLICY-004`, `WF-CATALOG-004`,
`WF-CATALOG-008`, `WF-CATALOG-010`, `WF-ELIG-018`, `WF-AUDIT-003`, `WF-CLINICAL-013`.

**Related `FLOW-*`:** `FLOW-POLICY-002`, `FLOW-POLICY-001`, `FLOW-AUDIT-001`,
`FLOW-AUDIT-002`, `FLOW-ELIG-010`, `FLOW-CATALOG-005`.

---

### IX-OPS-001 — Flag against state in a work queue

**User intent:** find the work that is actually in trouble, not just the work that is open.

**Trigger:** the actor opens a work queue or feed, or a work item is escalated or becomes overdue.

**Preconditions:** a work item has one lifecycle state out of five, and **two independent flags**.
Both flags can apply at once, and either can apply in any state.

**Sequence**

1. Each row renders its state through `CMP-PLATFORM-001` and its flags **in a separate slot**.
2. Filtering and sorting can address state and flags **independently**, because "in progress and
   overdue" is a real query and the most useful one a supervisor makes.
3. Assignment, escalation and completion each transition the state or set a flag, and each is
   visible in the item's own history.

**A flag never replaces or recolours the status.** `state-flag.escalated` and `state-flag.overdue`
live in a separate token group from the tones, so a flag structurally cannot restyle a status chip.
The row a supervisor most needs to find is simultaneously `IN_PROGRESS`, escalated and overdue, and
it must show all three.

**System feedback:** `CMP-OPS-001` per row, with `CMP-PLATFORM-005` carrying the due time and
`CMP-PLATFORM-013` the owner. Escalation history appears in `CMP-PLATFORM-008` on the detail
surface.

**Loading:** row skeletons; a refresh keeps rows in place and does not reorder under the actor's
cursor or focus.

**Success:** the queue reflects authoritative state and the flags are current.

**Failure:**

- **A claim or assignment conflict.** Two actors claimed the same item. The row keeps its prior
  owner and states the conflict; it never shows an optimistic owner that the server did not accept.
- **The actor's scope no longer covers the item.** `IX-PLATFORM-007`; the item leaves the projection
  and the actions go with it.
- **A failed read.** `IX-PLATFORM-017`, with `error-permission` taking precedence over an empty
  queue — because a permission failure rendered as an empty queue looks like a quiet day.

**Recovery:** refresh, or work a different item. A blocked item states its **blocking reason**,
because a work item nobody can progress is the item most likely to age silently.

**Focus behaviour:** focus stays on the row after an in-place action. Returning from the item detail
returns focus to the row — `IX-PLATFORM-015`.

**Keyboard behaviour:** rows and their actions are reachable without a hover-revealed menu. Claim,
assign and complete are keyboard reachable, because these actors work these queues all day.

**Right-to-left implications:** type and status at `start`, owner and due at `end`; due times in
tabular lining figures, bidirectionally isolated, aligned logically.

**Patient versus desktop:** **no Patient surface.** The patient's equivalent is
`CMP-PLATFORM-015`, which states an obligation rather than an assignment, and a patient never sees a
work item, a queue, an assignee or an escalation. On Profile A the `dense` queue table is one of the
few places density is earned — and `PO-UX-07` records these actors as interruption-prone on desktop
and tablet, so targets are not shaved to the floor merely because the mode allows it.

**Related `CMP-*`:** `CMP-OPS-001`, `CMP-PLATFORM-001`, `CMP-PLATFORM-005`,
`CMP-PLATFORM-006`, `CMP-PLATFORM-007`, `CMP-PLATFORM-013`, `CMP-PLATFORM-008`.

**Related `WF-*`:** `WF-OPS-001`, `WF-OPS-002`, `WF-OPS-003`, `WF-IDENTITY-021`,
`WF-ELIG-014`, `WF-ELIG-022`, `WF-PLATFORM-003`, `WF-PLATFORM-004`.

**Related `FLOW-*`:** `FLOW-OPS-001`, `FLOW-OPS-002`, `FLOW-IDENTITY-013`,
`FLOW-ELIG-009`, `FLOW-ELIG-015`, `FLOW-BOOKING-011`.

---

### IX-AUDIT-001 — Sensitive decision capture and irreversibility

**User intent:** make a decision that will be questioned later, and have it recorded properly.

**Trigger:** the actor invokes a sensitive, destructive or irreversible command — an application
approval or rejection, a requested-change set, a grant or a revocation, a claim or appeal decision,
an integrity decision, a suspension action, a launch-gate decision, a publication, a no-show record,
a provider cancellation, an export of personal data, a retention or destruction action.

**Preconditions:** the command is one the audit requirement covers. An idempotency key is fixed at
first submission.

**Sequence**

1. `CMP-PLATFORM-014` intervenes before the command reaches the server.
2. It states **what this action is** — using the trigger's own label — **what it will do**, **whether
   it can be undone**, and **what it affects**.
3. A **reason is required** for every irreversible, destructive and authoritative-decision variant.
4. Confirm uses **the same action role** as the trigger. A destructive trigger produces a destructive
   confirm.
5. On commit, the decision, its reason, its actor and its time are recorded, and the reason becomes
   the recorded **basis** shown by `CMP-PLATFORM-013`.

**System feedback:** the committing state on confirm; `CMP-PLATFORM-011` for the outcome; the
resulting attribution on the record afterwards.

**Loading:** the confirmation stays open while committing, keeps the entered reason, and blocks a
second submission of the same intent.

**Success:** the decision is committed once, attributed, and appears in the record's append-only
history.

**Failure:** the confirmation stays open with the reason intact and reports the failure against the
action. `ERR-AUDIT-001` is a key conflict and is **not** resolved by another confirm — it means the
key was reused for a different intent, which the interface must not have done.

**Recovery:** retry under `IX-PLATFORM-002` with the same key, or correct and re-decide where the
failure was a precondition. **An irreversible decision that committed is not recovered at all**, and
the confirmation said so before it was taken.

**Focus behaviour:** focus is trapped in the confirmation, lands on the **first meaningful element
and never on confirm**, and returns to the trigger on cancel or close. Focus never moves onto confirm
as a side effect of the reason field becoming valid.

**Keyboard behaviour:** the confirmation is dismissible by the platform's cancel key; cancel and
confirm are both reachable; the required reason has a visible persistent label and its validation
error is bound to the field.

**Right-to-left implications:** cancel at `start`, confirm at `end`, in both directions, so the
irreversible choice never sits where the eye lands first.

**Patient versus desktop:** the patient's sensitive actions are few but real — accepting a plan,
cancelling a booking, revoking a representation grant, submitting a claim or a review — and they get
the same ceremony, at `reading` generosity, on a full screen or sheet. On Profile A the framework's
action modal is extended with the required reason field, and the stock confirm-only modal is
insufficient wherever a reason is mandatory. **Density never compresses a confirmation on either
profile.**

**Related `CMP-*`:** `CMP-PLATFORM-014`, `CMP-PLATFORM-004`, `CMP-PLATFORM-013`,
`CMP-PLATFORM-011`, `CMP-PLATFORM-008`, `CMP-PLATFORM-010`.

**Related `WF-*`:** the 38 wireframes bound to `CMP-PLATFORM-014`. Highest consequence:
`WF-CLAIMS-012`, `WF-CLAIMS-013`, `WF-IDENTITY-031`, `WF-IDENTITY-032`, `WF-ELIG-020`,
`WF-CATALOG-007`, `WF-CATALOG-008`, `WF-REVIEWS-008`, `WF-PLATFORM-007`, `WF-CLINICAL-004`,
`WF-IDENTITY-007`.

**Related `FLOW-*`:** `FLOW-CLAIMS-006`, `FLOW-CLAIMS-008`, `FLOW-IDENTITY-011`,
`FLOW-IDENTITY-012`, `FLOW-IDENTITY-004`, `FLOW-REVIEWS-003`, `FLOW-CATALOG-003`,
`FLOW-ELIG-012`, `FLOW-PLATFORM-003`, `FLOW-BOOKING-008`.

**Non-negotiable behaviour carried:** **one action role keeps one label across all three platforms,
including inside its own confirmation**; the same destructive action uses the **same** danger variant
in the trigger and in the confirm; **irreversibility is stated in words, not by tone alone**; and no
confirmation states or implies that money moved, was held, or was returned.

---

## Pattern to component closure

Every pattern names at least one `CMP-*`, at least one `WF-*` and at least one `FLOW-*`, and every
one of the 22 components is named by at least one pattern. Measured across both pattern files, from
their own `Related CMP-*` lines:

| Component | Patterns naming it |
|---|---:|
| `CMP-PLATFORM-001` | 5 |
| `CMP-PLATFORM-002` | 9 |
| `CMP-PLATFORM-003` | 2 |
| `CMP-PLATFORM-004` | 10 |
| `CMP-PLATFORM-005` | 5 |
| `CMP-PLATFORM-006` | 13 |
| `CMP-PLATFORM-007` | 6 |
| `CMP-PLATFORM-008` | 10 |
| `CMP-PLATFORM-009` | 3 |
| `CMP-PLATFORM-010` | 15 |
| `CMP-PLATFORM-011` | 12 |
| `CMP-PLATFORM-012` | 2 |
| `CMP-PLATFORM-013` | 5 |
| `CMP-PLATFORM-014` | 6 |
| `CMP-PLATFORM-015` | 2 |
| `CMP-ELIG-001` | 3 |
| `CMP-ELIG-002` | 3 |
| `CMP-ELIG-003` | 2 |
| `CMP-CLINICAL-001` | 5 |
| `CMP-CLINICAL-002` | 7 |
| `CMP-POLICY-001` | 4 |
| `CMP-OPS-001` | 4 |

26 patterns, 22 components, zero components named by no pattern and zero patterns naming a component
the inventory has not allocated.

Two readings of the shape are worth recording, because both were checked rather than assumed.

`CMP-PLATFORM-010` at 15 and `CMP-PLATFORM-011` at 12 are the highest, and that is the correct
shape: the recovery state and the submission state are what almost every behaviour resolves to when
it goes wrong, which is why they are two separate components and not one. `CMP-PLATFORM-006` at 13
follows, because a list is where most reads land.

`CMP-PLATFORM-003`, `-012`, `-015` and `CMP-ELIG-003` at 2 are the lowest, and each is bound by
exactly the patterns that should bind it — the subject header by authorization and list-to-detail,
the evidence item by transfer and validation, the attention item by deadlines and structural state,
the eligibility explanation by revalidation and fail-closed behaviour. A low count here means a
focused component, not an under-used one; the reach figures in `WIREFRAME_COMPONENT_MAP.md` section 4
are the measure of use.

This is the mapping Phase 4 inherits instead of reconstructing, and it pre-empts the Phase 4
validator's warning on an `IX-*` never applied to a widget rather than leaving it to be discovered
there.
