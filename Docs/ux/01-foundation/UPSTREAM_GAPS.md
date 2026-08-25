# UberTib UX Upstream Gaps

**Phase:** UX 1 — Discovery, Information Architecture and User Flows
**Baseline:** 2026-08-25
**Gaps recorded:** 17 — 0 new Blockers · 8 Major · 9 Minor
**New IDs allocated:** 8 `Q-*` · 1 `CONFLICT-*` · 3 `ASM-*`

## 1. Purpose

Designing the structure is the most thorough audit the requirements will ever get. This file records every gap that surfaced while deriving 155 screens and 94 flows across three platforms.

A gap here is an upstream problem, not a design task. Suggested resolutions are labelled as suggestions and decide nothing.

## 2. Resolved Inputs — No Gap Raised

Four items raised at the Phase 1 inventory gate are now confirmed product behavior under `.spec/decisions/PO-2026-08-25-ux-gap-resolution.md` and `docs/domain/STAFF_INTERACTION_CONTRACTS.md`. **They are implemented in this phase and are not gaps.** They are listed here only so a later reader does not mistake their absence from the gap register for an oversight.

| Former gap | Resolution | Where implemented |
|---|---|---|
| Clinic and Admin widgets had no declarable data contract | `PO-UX-05` — Patient uses `API-*`, Clinic and Admin use `SDC-*` in-process contracts. 17 `SDC-*` allocated across 11 domains. No internal REST endpoint is invented for Filament. | Every Clinic and Admin `SCR-*` names its `SDC-*`; all 17 are referenced. `INFORMATION_ARCHITECTURE.md` section 1.4 |
| Provider and clinic onboarding had no documented entry point | `PO-UX-02` — approval-based onboarding is confirmed V1 behavior with states `DRAFT`, `SUBMITTED`, `CHANGES_REQUESTED`, `RESUBMITTED`, `APPROVED`, `REJECTED`, and `PO-UX-03` for invite-and-scope staff onboarding | 18 screens `SCR-IDENTITY-009` to `SCR-IDENTITY-026` plus 10 Admin screens; 16 flows `FLOW-IDENTITY-005` to `FLOW-IDENTITY-020` |
| Doctor comparison had no requirement | `PO-UX-04` — comparison of 2 or 3 eligible options from the same requested service is confirmed V1 behavior, derived from `API-ELIG-001` | `SCR-ELIG-005`, `FLOW-ELIG-004`, `FLOW-ELIG-005` |
| Run scope was recommended as evaluation-catalog only | `PO-UX-01` — full three-platform scope; the earlier recommendation in `CLAUDE_UI_UX_HANDOFF.md` is explicitly superseded | All three platforms modelled in full |

One documentation-synchronization observation follows from the onboarding decision and is recorded as `GAP-014`. It is a doc-placement note, not a reopening of the decision.

## 3. Gaps Carried Forward From Canonical Documentation

These pre-existed this phase. They are restated with their concrete UX consequence, and their IDs are not reallocated.

### GAP-001 — Booking state after an alternative expires or is declined is undefined
**Found while:** mapping `FLOW-BOOKING-007` and `FLOW-BOOKING-012`
**Type:** Missing behavior
**Detail:** `STATE_MACHINES.md` section 8 marks the transition from `ALTERNATIVE_PROPOSED` on deadline expiry or explicit patient decline as unresolved, and `ERROR_CATALOG.md` section 8 states that `ERR-BOOKING-003` does not define the resulting state and that clients must not infer `REJECTED`, `CANCELLED` or a return to `REQUESTED`. No canonical outcome exists.
**UX consequence:** `FLOW-BOOKING-007` can model the deadline passing and acceptance becoming impossible, but cannot draw a terminal node. `SCR-BOOKING-005` disables acceptance and shows the authoritative current state with no outcome asserted. The patient is left in a state the product cannot name, which is the honest rendering of an undefined rule but is not a good end state for a person who was waiting on an appointment.
**Affects:** `SCR-BOOKING-004`, `SCR-BOOKING-005`, `SCR-BOOKING-008`, `SCR-BOOKING-011`, `SCR-BOOKING-014`, `FLOW-BOOKING-006`, `FLOW-BOOKING-007`, `FLOW-BOOKING-012`, FR-BOOKING-003
**Severity:** Major
**Raised as:** `Q-BOOKING-001` — pre-existing
**Suggested resolution (suggestion only):** define whether expiry returns the booking to `REQUESTED` for a further provider response, moves it to a terminal state, or introduces a distinct `PROPOSAL_LAPSED` state. Whichever is chosen, the patient needs a named next action.

### GAP-002 — Existing bookings have no defined review workflow after eligibility suspension
**Found while:** mapping `FLOW-ELIG-012` and `FLOW-ELIG-014`
**Type:** Missing behavior
**Detail:** `STATE_MACHINES.md` section 7 and `CROSS_PLATFORM_BEHAVIOR.md` section 9.2 both state that existing bookings enter a configured review workflow when a scope becomes `SUSPENDED`, and that its actor, booking-state effect, deadlines and allowed outcomes are unresolved. Both explicitly forbid inferring automatic cancellation, automatic confirmation or any other terminal outcome.
**UX consequence:** the most damaging gap for the cross-platform model. `FLOW-ELIG-012` completes the suspension, notification and remediation path but stops where existing bookings are concerned. `SCR-ELIG-013`, `SCR-ELIG-020`, `SCR-BOOKING-014` and `SCR-BOOKING-015` display authoritative booking state and offer no outcome. A patient holding a confirmed appointment with a newly suspended provider sees an unchanged booking that the product cannot tell them anything about.
**Affects:** `SCR-ELIG-013`, `SCR-ELIG-020`, `SCR-BOOKING-014`, `SCR-BOOKING-015`, `FLOW-ELIG-012`, `FLOW-ELIG-014`, `FLOW-BOOKING-011`, FR-ELIG-003, FR-BOOKING-001
**Severity:** Major
**Raised as:** `Q-BOOKING-002` — pre-existing
**Suggested resolution (suggestion only):** name the responsible actor, the effect on booking state, the deadline, the allowed outcomes and the required notifications. The patient-facing question needing an answer first is whether a confirmed appointment in a suspended scope remains attendable.

### GAP-003 — No private-evidence transfer contract exists
**Found while:** mapping `FLOW-PLATFORM-001`, and six flows that require evidence
**Type:** Missing behavior
**Detail:** `API_CONTRACTS.md` section 12 explicitly declines to invent a presigned, multipart, chunked or resumable upload endpoint while storage and scanning providers remain unresolved, and no `API-PLATFORM-*` is allocated. Domain write contracts accept `evidence_ids` only after an evidence record exists.
**UX consequence:** every upload step across six flows is defined up to the transfer boundary and no further. `SCR-IDENTITY-015`, `SCR-ELIG-009`, `SCR-CLINICAL-014`, `SCR-CLAIMS-004` and `SCR-CLAIMS-007` can specify the requirement, the per-item state including quarantine, and the recovery — but not the transfer interaction, its progress behavior, its resumability on a weak connection, or its failure modes. Given that weak connectivity is an established condition of use, the unspecified part is exactly the part most likely to fail.
**Affects:** `SCR-IDENTITY-015`, `SCR-IDENTITY-029`, `SCR-ELIG-009`, `SCR-ELIG-017`, `SCR-CLINICAL-014`, `SCR-CLAIMS-004`, `SCR-CLAIMS-007`, `SCR-PLATFORM-006`, `FLOW-PLATFORM-001`, `FLOW-IDENTITY-006`, `FLOW-ELIG-007`, `FLOW-CLINICAL-004`, `FLOW-CLAIMS-003`, `FLOW-CLAIMS-004`, NFR-PLATFORM-003, NFR-PLATFORM-006
**Severity:** Major
**Raised as:** `Q-PLATFORM-003` — pre-existing
**Suggested resolution (suggestion only):** select the storage and scanning approach, then allocate the `API-PLATFORM-*` transfer contract. Resumability on an interrupted connection should be treated as a requirement rather than an optimisation, given the target environment.

### GAP-004 — Production clinical content and classification policy remain ungated
**Found while:** mapping `FLOW-CATALOG-001`, `FLOW-CATALOG-003`, `FLOW-ELIG-010` and `FLOW-OPS-004`
**Type:** Ambiguous rule
**Detail:** the 26 dental service records are provisional evaluation records awaiting licensed clinical approval, and production `S`, `P`, `H` and `I` formulas, weights, thresholds and defaults likewise await it.
**UX consequence:** constrains content rather than structure. `SCR-CATALOG-003`, `SCR-CATALOG-004`, `SCR-ELIG-019` and `SCR-OPS-006` must state that current values are provisional evaluation configuration, and no patient surface may present provisional catalog data as clinically approved. Evaluation context must never render as a real-patient production experience.
**Affects:** `SCR-CATALOG-001` to `SCR-CATALOG-005`, `SCR-ELIG-018`, `SCR-ELIG-019`, `SCR-OPS-006`, FR-CATALOG-001, FR-ELIG-011 to FR-ELIG-015, FR-OPS-003
**Severity:** Major
**Raised as:** `Q-CATALOG-001`, `Q-ELIG-001` — pre-existing
**Suggested resolution (suggestion only):** none proposed. This requires licensed clinical approval, not a design or engineering decision.

### GAP-005 — Retention periods, hosting topology and load envelope remain open
**Found while:** mapping `FLOW-PLATFORM-003`, and while fixing platform constraints
**Type:** Ambiguous rule
**Detail:** final retention and deletion periods await legal validation; production hosting topology and provider are unselected, so no base URL or environment can be fixed; and the expected low-thousands population versus the 10,000-identity engineering envelope remains a clarification.
**UX consequence:** limited. `SCR-PLATFORM-007` must present retention values as provisional policy. No screen path or environment can be finalized, which is already reflected in every path being `(Proposed)`. The load question affects volume assumptions in later phases rather than structure.
**Affects:** `SCR-PLATFORM-007`, `SCR-PLATFORM-008`, `FLOW-PLATFORM-003`, NFR-PLATFORM-001, NFR-PLATFORM-002, NFR-PLATFORM-004
**Severity:** Major for retention and hosting; Minor for the load envelope
**Raised as:** `Q-PLATFORM-002`, `Q-OPS-001`, `Q-PLATFORM-004` — pre-existing
**Suggested resolution (suggestion only):** none proposed for retention, which requires legal validation. Hosting selection is an engineering decision outside this chain.

### GAP-006 — Authoritative SRS is not machine-readable
**Found while:** establishing source authority for the whole phase
**Type:** Missing behavior
**Detail:** `Docs/UberTib_SRS_Etkan_v1.1.pdf` exists in the repository but its full text is not available, so complete reconciliation against the authoritative source cannot be certified.
**UX consequence:** none on any artifact — every screen and flow derives from the approved `.spec` baseline, the canonical `docs/` set and the Product Owner decisions, all of which are sufficient. The consequence is a limit on what may be *claimed*: this phase covers the approved baseline, not a certified complete reconciliation with the SRS.
**Affects:** the coverage claim for all 155 screens and 94 flows
**Severity:** Blocker for the completeness claim; not a blocker for any artifact
**Raised as:** `Q-PLATFORM-001` — pre-existing
**Suggested resolution (suggestion only):** obtain readable SRS text, then re-run the requirement sweep against it. Until then, journey coverage should be described as against the approved baseline.

## 4. New Gaps Raised By This Phase

### GAP-007 — Work-item state vocabulary is user-visible but deliberately unfinalized
**Found while:** deriving `SCR-OPS-002`, `SCR-OPS-003` and `SCR-OPS-001`, and mapping `FLOW-OPS-001` and `FLOW-OPS-002`
**Type:** Missing behavior
**Detail:** a direct collision between two canonical documents. `FR-OPS-001` requires a work item's "type, case, state, priority, due time, responsibility scope, and blocking reason" to be visible to authorized staff, and requires assignment, escalation, completion, reopening and deadline breach to be auditable transitions. `SDC-OPS-001` repeats `state` in its projection and names claim, assign, start, complete, escalate and reopen as commands. But `STATE_MACHINES.md` section 20 explicitly declines to finalize "detailed operational work-item states" and instructs that implementation must not invent them as product truth. The states are named as commands and required to be visible, yet never enumerated as a vocabulary.
**UX consequence:** the queue is the landing surface for six staff roles and the depth-reduction mechanism for both panels, which makes this structural rather than cosmetic. `SCR-OPS-002`, `SCR-OPS-003` and `SCR-OPS-001` are defined structurally — the item, its scope, its due time, its blocking reason and its available commands — but their state labels, state filters and any state-based grouping or sorting are deferred. Phase 3 cannot allocate `TXT-*` for states that do not exist, and Phase 4 cannot specify a filter over an unenumerated set.
**Affects:** `SCR-OPS-001`, `SCR-OPS-002`, `SCR-OPS-003`, `FLOW-OPS-001`, `FLOW-OPS-002`, and every flow that routes through a work item — 21 flows in total
**Severity:** Major
**Raised as:** `Q-OPS-002`
**Suggested resolution (suggestion only):** enumerate the work-item state vocabulary in `STATE_MACHINES.md`. The commands already named in `SDC-OPS-001` imply a minimal set, but deriving states from command names is exactly the invention that section 20 forbids, so this needs an owner rather than an inference.

### GAP-008 — No patient-facing notification or attention surface is established
**Found while:** mapping `FLOW-BOOKING-006`, `FLOW-CLINICAL-007`, `FLOW-CLAIMS-003` and `FLOW-FINANCE-004`
**Type:** Missing behavior
**Detail:** `CROSS_PLATFORM_BEHAVIOR.md` section 17.2 requires 24 notification intents, twelve of them addressed to the patient or acting guardian, and `notification_intents` exists in the data model. Section 3.7 establishes that no real-time transport is assumed and that no feature correctness may depend on delivery. The Clinic panel has a Work Feed established by `FR-OPS-001` and `SDC-OPS-001`. **The Patient app has no equivalent requirement** — no notification centre, no inbox, no attention surface is established by any `FR-*`.
**UX consequence:** without a re-entry surface, several patient flows depend on the patient happening to open the app. Three are deadline-bound: `FLOW-BOOKING-006` alternative acceptance, on a deadline the patient did not choose; `FLOW-CLAIMS-003` evidence supply, where an expired window is unrecoverable; and `FLOW-FINANCE-004` counterparty response, which leaves a case financially ambiguous while unanswered. `SCR-PLATFORM-001` was derived as the attention surface for exactly this reason — every item on it traces to a requirement-backed read — but the *decision* that a patient attention surface exists is a product decision this chain made structurally and cannot make behaviourally.
**Affects:** `SCR-PLATFORM-001`, `FLOW-BOOKING-006`, `FLOW-CLINICAL-007`, `FLOW-CLAIMS-003`, `FLOW-FINANCE-004`, `FLOW-REVIEWS-001`, FR-BOOKING-003, FR-CLAIMS-003, FR-FINANCE-003, FR-CLINICAL-004
**Severity:** Major
**Raised as:** `Q-PLATFORM-005`
**Suggested resolution (suggestion only):** confirm whether an in-app notification history is in V1 scope, or whether the derived attention surface on `SCR-PLATFORM-001` is the intended mechanism. If the latter, that is a satisfactory answer and worth recording explicitly, because it makes the attention feed load-bearing rather than convenient. See `ASM-PLATFORM-001`.

### GAP-009 — Environment and expertise are undocumented for every actor
**Found while:** building all 19 actor personas in `UX_FOUNDATION.md` section 2
**Type:** Missing behavior
**Detail:** no source establishes the device, physical setting, interruption pattern, lighting, shared-device usage or product expertise of any actor. What the sources do establish is Aleppo, Arabic-first, right-to-left, weak and intermittent connectivity, and low thousands of users.
**UX consequence:** environment and expertise are the two inputs that most strongly drive density, target size and confirmation friction, and they are undocumented for all 19 roles. Rather than assume the statistically common default of a trained expert at a desk on a large monitor — which is wrong more often than not — every persona records `undocumented`. Specific consequences: whether clinic front-desk staff work on a shared device under interruption changes how much confirmation friction `FLOW-BOOKING-003` needs; whether a treating dentist uses a tablet chairside changes target sizing on `SCR-CLINICAL-014`; whether the applicant on `SCR-IDENTITY-015` has a desktop with document scanning available changes the entire evidence interaction.
**Affects:** all 19 actors, and density, target-size and confirmation decisions in UX Phases 2 and 3
**Severity:** Major
**Raised as:** `Q-PLATFORM-006`
**Suggested resolution (suggestion only):** answer for the three highest-frequency roles first — clinic representative, treating dentist and operations staff — since those drive the most screens. The patient's mobile context is partially established by the connectivity and Arabic-first requirements.

### GAP-010 — No research inputs exist for any actor
**Found while:** writing the `Current pain` field on all 62 jobs
**Type:** Missing behavior
**Detail:** no interviews, analytics, support tickets or usage data exist for this product. The `Current pain` field on all 62 jobs is therefore recorded once as unresearched rather than filled with fabricated insight.
**UX consequence:** every job's pain statement is absent rather than invented, which is the correct handling but leaves the frequency-by-criticality plot resting on documented responsibility and error consequence rather than on observed behavior. The plot's conclusions are defensible from the requirements; they are not validated against users. Two placements are most exposed to being wrong: whether patients actually treat comparison as convenience rather than blocking, and whether the booking response deadline is experienced as manageable or as constant pressure.
**Affects:** all 62 `JTBD-*`, the frequency-by-criticality plot, and prominence decisions in UX Phase 2
**Severity:** Major
**Raised as:** `Q-PLATFORM-007`
**Suggested resolution (suggestion only):** five usability sessions with clinic staff would validate or overturn the plot's daily-and-blocking placements at low cost. `workflows/prototyping.md` in the design kit carries a usability-testing script.

### GAP-011 — The legal-basis representation grant workflow has no actor, screen or contract
**Found while:** mapping `FLOW-IDENTITY-002`
**Type:** Missing role
**Detail:** `PERMISSIONS_MATRIX.md` section 6 permits creating a representation grant by "Patient / authorized legal-basis workflow", and `API-IDENTITY-004` accepts a `legal_or_grant_basis` field with the actor described as "authenticated authorized grantor or authorized legal-basis workflow". **That second path is never defined** — no actor category, no screen, no contract, no workflow.
**UX consequence:** `FLOW-IDENTITY-002` covers only the patient-as-grantor case. For a dependent who cannot self-grant — a child, or an adult without capacity — there is no documented route into the product at all. The guardian cannot create their own authority, and no staff-side surface exists to establish it. `FR-IDENTITY-003` and the family and dependent journeys therefore have a real hole for exactly the population most likely to need representation.
**Affects:** `SCR-IDENTITY-005`, `SCR-IDENTITY-006`, `SCR-IDENTITY-035`, `FLOW-IDENTITY-002`, `FLOW-IDENTITY-003`, FR-IDENTITY-003, API-IDENTITY-004
**Severity:** Major
**Raised as:** `Q-IDENTITY-001`
**Suggested resolution (suggestion only):** define who may establish a grant on a legal basis rather than by patient consent, what evidence that requires, and which surface performs it. An Admin-side guardian establishment workflow adjacent to `SCR-IDENTITY-035` would fit the existing model, but the legal basis is not a design question.

### GAP-012 — Patient review-appeal authority is conditional on an undefined policy
**Found while:** deriving `SCR-REVIEWS-004` and mapping `FLOW-REVIEWS-001`
**Type:** Ambiguous rule
**Detail:** `TRACEABILITY_MATRIX.md` records the patient impact of `FR-REVIEWS-002` as "Action if policy permits" and notes "Patient surface only if policy grants action". `PERMISSIONS_MATRIX.md` section 12 permits an appeal by an "Authorized affected party" without stating whether a patient is one. The governing policy is not defined anywhere.
**UX consequence:** whether `SCR-REVIEWS-004` exists at all for patients is undetermined. The screen is modelled with its role condition stated, and `FLOW-REVIEWS-001` notes the dependency, but a policy answer either activates a patient screen and flow or removes them. That is a structural difference, not a detail.
**Affects:** `SCR-REVIEWS-003`, `SCR-REVIEWS-004`, `FLOW-REVIEWS-001`, `FLOW-REVIEWS-005`, FR-REVIEWS-002, API-REVIEWS-002
**Severity:** Major
**Raised as:** `Q-REVIEWS-001`
**Suggested resolution (suggestion only):** state whether a patient may appeal a decision that retired or unpublished their own review. If not, `SCR-REVIEWS-004` becomes clinic-only and the patient sees the outcome without recourse, which is a defensible position but should be a decision rather than an omission.

### GAP-013 — `ERR-BOOKING-002` is reused across domains on an identity surface
**Found while:** deriving `SCR-IDENTITY-007` and mapping `FLOW-IDENTITY-004`
**Type:** Contradiction
**Detail:** `ERR-BOOKING-002` is defined as "Booking action invalid for current state" with the machine code `BOOKING_ACTION_NOT_ALLOWED`. `API-IDENTITY-005`, which revokes a guardian grant, references it as the failure when a protected transition policy blocks revocation. `ERROR_CATALOG.md` section 8 already flags this reference, noting that `STATE_MACHINES.md` should confirm whether it remains valid or should be replaced by an identity-specific error.
**UX consequence:** surfacing a booking-domain error and its booking-domain recovery path on a representation-management screen is a defect — wrong domain, wrong mental model, wrong next action. A user trying to end someone's access to their medical records would be told a booking action is not allowed. Phase 3 would also be forced to write one copy string serving two unrelated situations.
**Affects:** `SCR-IDENTITY-007`, `FLOW-IDENTITY-004`, `FLOW-IDENTITY-019`, API-IDENTITY-005, ERR-BOOKING-002
**Severity:** Major
**Raised as:** `CONFLICT-BOOKING-001`
**Suggested resolution (suggestion only):** allocate an identity-domain error for a policy-blocked revocation rather than reusing the booking error. Existing `ERR-*` IDs are append-only and must not be repurposed, so this is a new allocation.

### GAP-014 — Onboarding and invitation state machines live outside `STATE_MACHINES.md`
**Found while:** building the lifecycle sweep in `INFORMATION_ARCHITECTURE.md` section 10
**Type:** Ambiguous rule
**Detail:** the onboarding application states `DRAFT`, `SUBMITTED`, `CHANGES_REQUESTED`, `RESUBMITTED`, `APPROVED`, `REJECTED` are authoritative through `SDC-IDENTITY-001` and `PO-UX-02`. The staff invitation states are derivable from `SDC-IDENTITY-003` and `PO-UX-03`. Neither appears in `STATE_MACHINES.md`, which section 2 presents as the canonical status classification for all entities with controlled state changes.
**UX consequence:** none on any artifact — the states are authoritative and the lifecycle sweep covers all 62 statuses across 15 machines, two of which are sourced from the decision and contract documents. This is a documentation-placement observation so that a later reader consulting only `STATE_MACHINES.md` does not conclude these machines are unspecified. **This does not reopen `PO-UX-02` or `PO-UX-03`, and no `Q-*` is raised.**
**Affects:** `INFORMATION_ARCHITECTURE.md` sections 10.1 and 10.2; the canonical ownership claim in `STATE_MACHINES.md` section 2
**Severity:** Minor
**Raised as:** no ID — documentation synchronization note
**Suggested resolution (suggestion only):** add both machines to `STATE_MACHINES.md`, sourced to `SDC-IDENTITY-001`, `SDC-IDENTITY-003` and the decision record, so the canonical lifecycle document is complete. The invitation machine would benefit from an explicit state enumeration, since this chain derived its states from commands and behavior rather than from a stated list.

### GAP-015 — No reschedule action exists for a confirmed booking
**Found while:** mapping `FLOW-BOOKING-008` and `FLOW-BOOKING-009`
**Type:** Missing behavior
**Detail:** `CROSS_PLATFORM_BEHAVIOR.md` section 10.2 states that changes to a confirmed booking use "alternative proposal plus patient acceptance", "cancellation plus new request where applicable", or "governed future rescheduling behavior if separately specified". Rescheduling is not separately specified.
**UX consequence:** a patient who needs a different time for a confirmed appointment must cancel and rebook, losing their slot to whoever takes it first and incurring any policy consequence of cancellation. The provider-side alternative proposal only exists while the booking is `REQUESTED`, not after confirmation. For a product whose core conversion is booking, the absence of rescheduling is a notable friction that the interface cannot design around — `SCR-BOOKING-004` can only offer cancel.
**Affects:** `SCR-BOOKING-004`, `SCR-BOOKING-006`, `SCR-BOOKING-011`, `SCR-BOOKING-012`, `FLOW-BOOKING-008`, `FLOW-BOOKING-009`, FR-BOOKING-002
**Severity:** Minor — the workaround exists and is safe, though costly to the patient
**Raised as:** `Q-BOOKING-003`
**Suggested resolution (suggestion only):** decide whether V1 needs a governed reschedule that preserves the booking identity, or whether cancel-and-rebook is accepted. If accepted, the cancellation copy should make the loss of slot explicit.

### GAP-016 — A proposed treatment plan has no acceptance deadline
**Found while:** mapping `FLOW-CLINICAL-002` and `FLOW-CLINICAL-010`
**Type:** Missing behavior
**Detail:** `STATE_MACHINES.md` section 9 defines `PROPOSED` to `ACCEPTED` with no deadline, expiry or staleness rule. No source establishes how long a proposal remains acceptable.
**UX consequence:** a plan may sit `PROPOSED` indefinitely. Two practical problems follow. The clinic has no defined point at which to follow up or withdraw, so `SCR-CLINICAL-012` offers no expiry and the awaiting state is open-ended. And the plan's stage prices are source facts that may change through `FLOW-ELIG-008`, so a patient could accept a months-old proposal whose prices no longer reflect the provider's actual price — `ERR-CLINICAL-001` covers a stale version but the sources do not define what makes a version stale by age.
**Affects:** `SCR-CLINICAL-003`, `SCR-CLINICAL-004`, `SCR-CLINICAL-012`, `SCR-CLINICAL-013`, `FLOW-CLINICAL-002`, `FLOW-CLINICAL-010`, FR-CLINICAL-001, FR-CLINICAL-002, ERR-CLINICAL-001
**Severity:** Minor — no incorrect behavior results, but the open-ended state is a product decision by omission
**Raised as:** `Q-CLINICAL-001`
**Suggested resolution (suggestion only):** decide whether a proposal expires, whether a price change invalidates an unaccepted proposal, or whether indefinite validity is intended. The third is a legitimate answer and worth stating explicitly.

### GAP-017 — Staff-panel surfaces are absent from the error presentation vocabulary
**Found while:** mapping error destinations across all 94 flows
**Type:** Ambiguous rule
**Detail:** `ERROR_CATALOG.md` section 3 defines five presentation surfaces — inline field validation, action banner or toast, full-page or auth gate, unavailable-state message, and silent-log-only. All five are client and API oriented. `SDC-IDENTITY-004` establishes that `ERR-IDENTITY-001` and `ERR-IDENTITY-002` semantics apply in-process, so the error identifiers do reach the panels, but the catalog's surface vocabulary does not describe panel-native presentation.
**UX consequence:** minor and confined to UX Phase 3. All 19 `ERR-*` have a destination in this phase's flows, and no error was found without one. The gap is that Phase 3 will allocate `TXT-*` copy against surface descriptions that do not name the Filament-native equivalents, so the mapping from error to surface has to be established rather than inherited for the panels.
**Affects:** UX Phase 3 `CONTENT_GUIDE.md` allocation for Clinic and Admin surfaces; all 19 `ERR-*`
**Severity:** Minor
**Raised as:** no ID — recorded as a Phase 3 input rather than an upstream question, since `PO-UX-05` already resolved the contract model and the error identifiers are established
**Suggested resolution (suggestion only):** extend the presentation-surface vocabulary in `ERROR_CATALOG.md` with panel-native surfaces, or record the mapping in `CONTENT_GUIDE.md` during Phase 3.

## 5. Assumptions In Force

Three interpretations were needed to produce this phase. Each is recorded with what breaks if it is wrong.

### ASM-PLATFORM-001 — The patient attention surface is the primary re-entry path
**Assumption:** `SCR-PLATFORM-001` serves as the patient's re-entry point for every deadline-bound and action-required item, in the absence of an established notification surface.
**Why needed:** twelve notification intents address the patient, no transport is assumed, and no `FR-*` establishes a patient notification centre. Without an attention surface, four flows have no re-entry path other than the patient happening to open the app.
**What breaks if wrong:** if a notification history or inbox is later established, `SCR-PLATFORM-001`'s role changes from load-bearing to supplementary, and the attention-item ordering logic may move or duplicate. If instead no attention surface is wanted, `FLOW-BOOKING-006`, `FLOW-CLAIMS-003`, `FLOW-CLINICAL-007` and `FLOW-FINANCE-004` lose their re-entry path entirely and their deadlines become substantially more likely to be missed.
**Related:** `GAP-008`, `Q-PLATFORM-005`

### ASM-IDENTITY-001 — Applicant contact verification precedes application content
**Assumption:** `SCR-IDENTITY-011` verifies the applicant's primary contact before they enter any application content, rather than at submission.
**Why needed:** `PO-UX-02` requires verification "before final submission" and requires that a draft be resumable "by the same verified applicant". Resumption needs a verified identity to resume against, so verification must precede the draft.
**What breaks if wrong:** if verification is intended at submission, draft save and resume needs a different identification mechanism, and `FLOW-IDENTITY-005` and `FLOW-IDENTITY-006` reorder. The applicant would enter content before proving contact, which also changes what an abandoned draft means.
**Related:** `FLOW-IDENTITY-005`, `FLOW-IDENTITY-006`

### ASM-ELIG-001 — Booking may proceed directly from a result row
**Assumption:** `SCR-ELIG-003` is an optional deepening rather than a mandatory step, because `API-ELIG-001` already returns complete decision-card data per result.
**Why needed:** the canonical discovery path is seven hops from home to booking submission. This assumption plus a direct search affordance on the catalog root reduces the shortest path to four.
**What breaks if wrong:** if the decision card must be viewed before booking — for example if some patient-safe disclosure lives only there — every booking path gains one screen, and `FLOW-BOOKING-001` and `FLOW-ELIG-005` lengthen accordingly.
**Related:** `INFORMATION_ARCHITECTURE.md` section 7.4 finding 1, `FLOW-ELIG-001`, `FLOW-BOOKING-001`

## 6. Registry Additions

Append-only. Allocated from `max + 1` per domain against the registry in `docs/README.md`.

| ID | Type | Severity | Domain max before | Allocated |
|---|---|---|---:|---:|
| `Q-OPS-002` | Open question | Major | 001 | 002 |
| `Q-PLATFORM-005` | Open question | Major | 004 | 005 |
| `Q-PLATFORM-006` | Open question | Major | 004 | 006 |
| `Q-PLATFORM-007` | Open question | Major | 004 | 007 |
| `Q-IDENTITY-001` | Open question | Major | 000 | 001 |
| `Q-REVIEWS-001` | Open question | Major | 000 | 001 |
| `Q-BOOKING-003` | Open question | Minor | 002 | 003 |
| `Q-CLINICAL-001` | Open question | Minor | 000 | 001 |
| `CONFLICT-BOOKING-001` | Conflict | Major | 000 | 001 |
| `ASM-PLATFORM-001` | Assumption | — | 000 | 001 |
| `ASM-IDENTITY-001` | Assumption | — | 000 | 001 |
| `ASM-ELIG-001` | Assumption | — | 000 | 001 |

No existing ID was renumbered, reused or repurposed.

## 7. Severity Summary

| Severity | Count | IDs |
|---|---:|---|
| **Blocker** | 0 new | `Q-PLATFORM-001` carried forward — blocks the completeness claim, not any artifact |
| **Major** | 8 new · 5 carried | New: `Q-OPS-002`, `Q-PLATFORM-005`, `Q-PLATFORM-006`, `Q-PLATFORM-007`, `Q-IDENTITY-001`, `Q-REVIEWS-001`, `CONFLICT-BOOKING-001`, and the Major portion of `GAP-005`. Carried: `Q-BOOKING-001`, `Q-BOOKING-002`, `Q-PLATFORM-003`, `Q-CATALOG-001`, `Q-ELIG-001` |
| **Minor** | 2 new IDs · 3 unnumbered notes · 4 carried | New IDs: `Q-BOOKING-003`, `Q-CLINICAL-001`. Notes: `GAP-014`, `GAP-017`, and the repository path-casing observation in section 8. Carried: `Q-PLATFORM-002`, `Q-OPS-001`, `Q-PLATFORM-004`, `CONFLICT-PLATFORM-001` and `CONFLICT-PLATFORM-002` where UX-relevant |

**Halt check.** Convention C5 requires halting if more than roughly 30% of the phase's artifacts are Blocked, or if any Blocker touches the role model, the data model or navigation structure.

- Blocked artifacts: 0 of 155 screens. 2 of 94 flows carry a bounded incomplete branch — `FLOW-BOOKING-007` and `FLOW-ELIG-012` — which is 2%, and both are complete up to the point where their destination is undefined upstream.
- No Blocker touches the role model: 19 of 19 roles have a landing screen and every permitted action is reachable.
- No Blocker touches the data model or navigation structure.

**Phase 1 completes. Nothing is halted.**

## 8. Repository Observations

Two notes outside the requirement space, recorded because they affect the next agent rather than the product.

**Path casing.** The git index contains both `docs/` — 23 markdown files plus the validator — and `Docs/` — six PDFs including the authoritative SRS. This resolves on Windows and would break cross-references on a case-sensitive runner. This phase writes to lowercase `docs/ux/` to match the markdown convention and the paths used throughout `prompts/`.

**Standing instruction now superseded.** `AGENTS.md` closes with "Do not begin `ux_00`, `ux_01`, or later UX phases", scoped to the engineering-documentation completion run. That run is recorded as complete through Phase 3 in `docs/README.md` with a clean validator, and `PO-2026-08-25` plus `prompts/ux_phase1_gap_resolution_directive_2026-08-25.md` authorize this phase. The line will misdirect the next agent and warrants a one-line correction. `AGENTS.md` sits outside `docs/ux/**` and outside this phase's write scope, so it is flagged rather than edited.
