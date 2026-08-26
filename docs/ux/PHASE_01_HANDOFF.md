# Phase 1 Handoff

**Phase:** UX 1 — Discovery, Information Architecture and User Flows
**Baseline:** 2026-08-25 · reconciled 2026-08-25 against `PO-2026-08-25-ux-phase1-reconciliation`, then against `PO-2026-08-25-syria-catalog-pricing-governance`
**Status:** Complete, awaiting the Phase 1 gate

**Platform profile:** Patient = **C** (React Native) · Clinic/Doctor = **A** (Filament 5, panel `clinic`) · Admin = **A** (Filament 5, panel `admin`)
**Input mode:** **Docs-Partial** — the behavioral engineering doc set is complete; no screen inventory existed to inherit, so all 165 screens are derived and classified `New`
**Accessibility target:** WCAG 2.2 AA, from `NFR-PLATFORM-005`

## What Changed In The Reconciliation

Phase 1 originally shipped 155 screens and 94 flows with two deliberately bounded branches and seventeen recorded gaps. `PO-2026-08-25-ux-phase1-reconciliation` (`PO-UX-07`–`18`) resolved twelve of those gaps plus one assumption. The effect on the model was structural rather than cosmetic:

| Added | Count |
|---|---:|
| Screens | 7 — `SCR-PLATFORM-009`, `SCR-BOOKING-016`, `SCR-BOOKING-017`, `SCR-IDENTITY-037`, `SCR-IDENTITY-038`, `SCR-ELIG-021`, `SCR-ELIG-022` |
| Flows | 6 — `FLOW-IDENTITY-021`, `FLOW-ELIG-015`, `FLOW-BOOKING-013`, `FLOW-BOOKING-014`, `FLOW-REVIEWS-006`, `FLOW-PLATFORM-004` |
| Jobs | 4 — `JTBD-IDENTITY-012`, `JTBD-BOOKING-008`, `JTBD-REVIEWS-004`, `JTBD-PLATFORM-004` |
| Lifecycle machines entering the sweep | 3 — reschedule proposal, operational work item, evidence transfer session |
| Bounded incomplete branches remaining | 0, down from 2 |

That is the measure of how much of the model those questions were holding open: whole journeys, not labelling.

### The Syria catalog and pricing reconciliation

`.spec/decisions/PO-2026-08-25-syria-catalog-pricing-governance.md` then moved catalog, pricing and billing values out of code and into governed data. It is a different kind of change from the one above: it altered **who may change what**, not how many journeys exist.

| Added | Count |
|---|---:|
| Screens | 3 — `SCR-CATALOG-010`, `SCR-CATALOG-011`, `SCR-ELIG-023`, all Admin |
| Flows | 3 — `FLOW-CATALOG-006`, `FLOW-CATALOG-007`, `FLOW-ELIG-016` |
| Jobs | 3 — `JTBD-CATALOG-004`, `JTBD-CATALOG-005`, `JTBD-ELIG-009` |
| Lifecycle machines entering the sweep | **0** — three candidates each resolved into an existing mechanism |
| New `API-*` | **0** — four existing patient contracts extended additively; every new workflow is a staff `SDC-*` |
| Open questions closed | **0.** `Q-CATALOG-001` and `Q-ELIG-001` were **narrowed**, not resolved |

The screen count was held down deliberately. Governed price display modes, structured plan lines and disclosed amendments were folded into `SCR-ELIG-010`, `SCR-CLINICAL-003`, `SCR-CLINICAL-004`, `SCR-CLINICAL-011`, `SCR-CLINICAL-012`, `SCR-ELIG-002`, `SCR-ELIG-003`, `SCR-ELIG-005` and `SCR-FINANCE-001` rather than given surfaces of their own, because the actor's task did not change — only what the task is made of. The three new screens exist because their actors and authority are genuinely new: a catalog administrator maintaining the procedure layer, a commercial administrator maintaining selectable options, and the market-calibration surface that must never be visible anywhere else.

## Files Produced

Line counts are measured with `wc -l`, not estimated.

| Path | Lines | Contents |
|---|---:|---|
| `docs/ux/01-foundation/UX_FOUNDATION.md` | 1094 | 19 actors with confirmed usage contexts, 69 jobs, frequency-by-criticality plot, 55-entity content inventory, 5 design principles, 9 constraint areas |
| `docs/ux/01-foundation/INFORMATION_ARCHITECTURE.md` | 3377 | 165 screens, 4 sitemaps, 3 navigation models, depth tables, labelling taxonomy, role sweep, 82-status lifecycle sweep across 18 machines |
| `docs/ux/01-foundation/USER_FLOWS.md` | 3808 | 103 flows with failure, abandon and re-entry paths and a diagram each; cross-flow checks; friction budget |
| `docs/ux/01-foundation/UPSTREAM_GAPS.md` | 334 | 17 gaps of which 12 are stamped resolved and 1 narrowed, 3 `ASM-*` of which 1 is resolved, registry additions, halt check, repository observations |
| `docs/ux/README.md` | 135 | Index, authority chain, ownership split, phase status, registry additions |
| `docs/ux/scripts/validate_ux_docs.py` | 166 | Phase-aware validator, `ux_01` Appendix A verbatim — written once in Phase 1, not rewritten |
| `docs/ux/PHASE_01_HANDOFF.md` | this file | Handoff and verification report |

## Repository Correction

The Phase 1 commit recorded all seven artifacts under `Docs/ux/**` while `docs/README.md`, `prompts/**` and both validators reference `docs/ux/**`. On Windows the two collapse to one directory, so the mismatch was invisible locally and would have produced a split tree on a case-sensitive checkout.

Fixed by normalizing the on-disk directory to lowercase and re-recording the seven files through an intermediate rename — seven pure renames, zero content change. **Verified on a genuinely case-sensitive path**: the `docs` and `Docs` trees were extracted onto a directory with `fsutil file setCaseSensitiveInfo` enabled and the UX validator re-run there, returning 0 failures. `Docs/*.pdf` intentionally keeps its casing, because the six source PDFs are referenced as `Docs/...` from `AGENTS.md`, `docs/PRD.md` and `docs/README.md`.

## Canonical Documents Reconciled

Fourteen files outside `docs/ux/**` were changed — thirteen modified plus the new decision record. Every change is traceable to a numbered decision in the PO file. The last table row bundles five files whose change is the same kind of bookkeeping.

| Path | Change |
|---|---|
| `.spec/decisions/PO-2026-08-25-ux-phase1-reconciliation.md` | **New.** `PO-UX-07`–`18`, the authoritative record for everything below. |
| `AGENTS.md` | Replaced the superseded "Do not begin `ux_00`, `ux_01`, or later UX phases" line, which would have misdirected the next agent now that the UX pipeline is active. Line count unchanged at 149 against a 150 budget. |
| `docs/domain/STATE_MACHINES.md` | Booking gains `ELIGIBILITY_REVIEW` and defined alternative-closure reasons; new section 8.3 reschedule proposal; treatment plan gains `EXPIRED`; new section 20 work-item lifecycle; new section 21.1 evidence transfer session; review-appeal appellants in 13.1. Old sections 20 and 21 renumbered to 21 and 22. |
| `docs/domain/PERMISSIONS_MATRIX.md` | Consent versus legal-basis grant paths, unconditional revocation, eligibility-review denials including the no-override rule, reschedule proposal actors, patient review-appeal authority, work-item lifecycle actions. |
| `docs/domain/CROSS_PLATFORM_BEHAVIOR.md` | Existing-booking safety rule made concrete with a three-platform projection table; booking modification rule; durable notification entries; work-item states; three new work-item source events; open dependencies. |
| `docs/domain/STAFF_INTERACTION_CONTRACTS.md` | `SDC-OPS-001` gains the state vocabulary and the flag-versus-state rule; three new contracts; `SDC-REVIEWS-001` retitled to cover both appellants. |
| `docs/api/API_CONTRACTS.md` | `ERR-BOOKING-002` removed from `API-IDENTITY-005`; five new contracts; section 12 changed from "Blocked Detail" to two real platform contracts. |
| `docs/api/ERROR_CATALOG.md` | `ERR-BOOKING-002` scoped to booking only; `ERR-BOOKING-003` state rule resolved; `ERR-CLINICAL-001` covers expiry and staleness; `ERR-REVIEWS-001` covers both appellants; new `ERR-PLATFORM-005`. |
| `docs/PRD.md` | Two new requirements — `FR-BOOKING-004`, `FR-PLATFORM-001`. Acceptance criteria extended on `FR-ELIG-003`, `FR-BOOKING-003`, `FR-CLINICAL-001`, `FR-IDENTITY-003`, `FR-REVIEWS-002`, `FR-OPS-001`. |
| `docs/TRACEABILITY_MATRIX.md`, `docs/TESTING_STRATEGY.md`, `docs/implementation/USER_IMPLEMENTATION_PLAN.md`, `docs/IMPLEMENTATION_PLAN.md`, `docs/README.md` | Traceability rows, `TC-BOOKING-009`, `TC-PLATFORM-013`, `TASK-BOOKING-011`, `TASK-PLATFORM-013`, and the registry. |

**No production application code was modified.** The two validator edits made during the original phase — repointing `OWNER_FILES["SCR"]` and adding the gap file as an `ASM` owner — still stand and still **strengthen** the checks rather than relaxing them. No check was weakened and no threshold lowered in this reconciliation either.

The Syria catalog and pricing reconciliation changed twenty-four further files outside `docs/ux/**` plus the new decision record, and changed no validator and no application code. Its scope is summarized in `docs/domain/CATALOG_PRICING_GOVERNANCE.md`, whose section 13 is the owner map for every configurable area and every retained invariant. Three live hard-codings in `app/Domain/Catalog/ServiceDefinitionPayload.php` — the positive-reference-price requirement, the pinned currency literal and the pinned risk-tier set — are recorded in `docs/PRD.md` as implementation gaps to close, **not** as product rules, and were deliberately left in place because this was a documentation task.

## IDs Allocated

**`SCR-*` — 165 screens**
`SCR-IDENTITY-001..038` · `SCR-ELIG-001..023` · `SCR-CLINICAL-001..019` · `SCR-BOOKING-001..017` · `SCR-CLAIMS-001..013` · `SCR-FINANCE-001..012` · `SCR-REVIEWS-001..009` · `SCR-CATALOG-001..011` · `SCR-PLATFORM-001..009` · `SCR-OPS-001..006` · `SCR-POLICY-001..004` · `SCR-AUDIT-001..004`

**`FLOW-*` — 103 flows**
`FLOW-IDENTITY-001..021` · `FLOW-ELIG-001..016` · `FLOW-BOOKING-001..014` · `FLOW-CLINICAL-001..010` · `FLOW-CLAIMS-001..009` · `FLOW-FINANCE-001..008` · `FLOW-REVIEWS-001..006` · `FLOW-CATALOG-001..007` · `FLOW-OPS-001..004` · `FLOW-PLATFORM-001..004` · `FLOW-POLICY-001..002` · `FLOW-AUDIT-001..002`

**`JTBD-*` — 69 jobs**
`JTBD-IDENTITY-001..012` · `JTBD-ELIG-001..009` · `JTBD-BOOKING-001..008` · `JTBD-CLINICAL-001..007` · `JTBD-CLAIMS-001..007` · `JTBD-FINANCE-001..006` · `JTBD-REVIEWS-001..004` · `JTBD-PLATFORM-001..004` · `JTBD-CATALOG-001..005` · `JTBD-OPS-001..003` · `JTBD-POLICY-001..002` · `JTBD-AUDIT-001..002`

**Canonical additions, phase-1 reconciliation** — `FR-BOOKING-004`, `FR-PLATFORM-001`, `API-IDENTITY-006`, `API-BOOKING-006`, `API-BOOKING-007`, `API-PLATFORM-001`, `API-PLATFORM-002`, `ERR-PLATFORM-005`, `SDC-IDENTITY-005`, `SDC-BOOKING-002`, `SDC-ELIG-004`, `TASK-BOOKING-011`, `TASK-PLATFORM-013`, `TC-BOOKING-009`, `TC-PLATFORM-013`

**Canonical additions, Syria catalog and pricing reconciliation** — `FR-CATALOG-002`, `FR-CATALOG-003`, `FR-ELIG-018`, `FR-ELIG-019`, `FR-CLINICAL-006`, `FR-CLINICAL-007`, `FR-POLICY-003`, `ERR-CLINICAL-002`, `SDC-CATALOG-002`, `SDC-CATALOG-003`, `SDC-ELIG-005`, `SDC-POLICY-002`, `TASK-CATALOG-003`, `TASK-CATALOG-004`, `TASK-ELIG-012`, `TASK-FINANCE-012`, `TASK-POLICY-002`, `TASK-CLINICAL-010`, `TASK-CLINICAL-011`, `TASK-CLINICAL-012`, `TC-CATALOG-006`, `TC-CATALOG-007`, `TC-ELIG-011`, `TC-ELIG-012`, `TC-CLINICAL-008`, `TC-CLINICAL-009`, `TC-POLICY-005`. **No `API-*`** — see the note above.

No existing ID was renumbered, reused or repurposed. Resolved `Q-*`, `CONFLICT-*` and `ASM-*` IDs remain permanently allocated and are marked Resolved rather than deleted.

---

# Phase 1 Verification

## Mechanical

```
$ python docs/ux/scripts/validate_ux_docs.py --phase 1
phase 1 | 165 screens, 103 flows, 0 wireframes, 0 components, 0 widgets

0 failure(s), 0 warning(s)
```

```
$ python docs/scripts/validate_docs.py
Result: 0 failure(s), 0 warning(s)
```

Both exit **0**. `python3` is not on this machine's PATH; the working interpreter is `C:\laragon\bin\python\python-3.13\python.exe`.

The engineering validator now reports 74 requirements (60 `FR-*`, 14 `NFR-*`), 36 `API-*`, 21 `ERR-*`, 92 `TASK-*`, 91 `TC-*`, 74/74 requirement rows with both `TASK-*` and `TC-*` coverage, `AGENTS.md` at 149 lines against a 150 budget, and `docs/README.md` at 200 against a 200 budget.

## Coverage — Measured

- **Actors:** 19 UI-bearing, plus system automation and 2 explicit non-roles. **With environment and expertise documented: 19/19**, from the six confirmed role classes in `PO-UX-07`.
- **Jobs:** 69 — traced to at least one requirement **69/69**; served by at least one screen **69/69**; appearing in at least one flow **69/69**. Orphans: none.
- **Screens:** 165 — serving at least one job **165/165**; naming at least one requirement **165/165**; naming a data or action contract **165/165** (`API-*` for Patient, `SDC-*` for Clinic and Admin, per `PO-UX-05`).
- **Flows:** 103 — with failure paths **103/103**; abandon paths **103/103**; re-entry **103/103**; a friction count **103/103**; a diagram **103/103**; naming at least one screen **103/103**.
- **`ERR-*` with a UX destination:** **21/21**.
- **`SDC-*` referenced:** **24/24**.
- **`API-*` referenced:** **34/36**. Deliberately unreferenced: `API-ELIG-003` and `API-ELIG-004`. `API_CONTRACTS.md` section 6 states that where the doctor experience is Filament-only these use cases run in-process; the Clinic panel is Profile A, so `SDC-ELIG-001` is the correct contract for `SCR-ELIG-007` and `SCR-ELIG-008`. Referencing the optional REST variants would imply a non-Filament provider client that no approved source establishes.
- **`FR-*` referenced across the UX set:** **60/60**.

## Sweeps

- **Roles with a landing screen:** **19/19**.
- **Permitted actions with no screen:** **none.** All `Allow` and `Conditional` rows across `PERMISSIONS_MATRIX.md` sections 6 to 16 map to reachable screens, including the fourteen rows added by this reconciliation.
- **Denied actions visible where they should not be:** **none.** The `Deny` categories now include the two added by `PO-UX-13` — starting or completing a visit in `ELIGIBILITY_REVIEW`, and any attendance override at any role — plus the `PO-UX-11` rule that no state may block a revocation and the `PO-UX-15` prohibition on generic booking editing.
- **Lifecycle statuses never displayed:** **none. 82/82** statuses across 18 machines have a screen and every action valid from each is reachable. **No bounded branch remains.**
- **Algorithm-hiding sweep:** **15/15 internal concepts pass.** Zero patient screens require the patient to understand or manipulate `S`, `P`, `H`, `I`, `K`, `EU`, a grade cap, a gate result, a policy version, a composite score, `pricing_class_state`, the market-observation corpus, a procedure code or billing unit, `service_risk_level`, or a currency-normalization rate; zero contain a control that selects one. Re-checked against all ten screens added since the original phase. The five concepts added by the catalog and pricing reconciliation also pass the **Clinic** boundary, which matters more than the patient one here: a provider who could see where their price sits in the market distribution could price against it and corrupt the evidence the classification rests on, so no Clinic projection carries the corpus, the sample or the calibration state.
- **Cross-platform sweep:** 9 dedicated cross-platform lifecycle flows now cover booking, treatment plan, eligibility change, review, claim, external financial event, access revocation, clinic onboarding and eligibility review. Each distinguishes user action, automatic system action and human review.
- **Visual-detail violations:** **0.** An independent scan of all `docs/ux/*.md` for hex values, pixel, millisecond and rem literals and colour words returns zero matches.
- **Emoji and pictographs:** **0** across `docs/ux/**` and the new decision file, arrows and typographic dashes excluded as permitted.

## Fail-Closed Rules Verified In The Model

Three rules from this reconciliation are safety-critical, so they were checked structurally rather than accepted as prose:

1. **No attendance override.** `SCR-ELIG-021` omits start and complete rather than disabling them; `SCR-ELIG-022` offers exactly two outcomes; `SCR-BOOKING-014` states no override exists; `PERMISSIONS_MATRIX` carries an explicit `Deny` row at every role.
2. **Revocation is never blocked.** No booking-domain error is reachable from `SCR-IDENTITY-007`, and `FLOW-IDENTITY-005` has no blocked branch.
3. **A pending reschedule never moves the appointment.** `SCR-BOOKING-016`, `SCR-BOOKING-017`, `FLOW-BOOKING-013`, `FLOW-BOOKING-014` and the section 10.4 sweep all state that the original slot stays authoritative until acceptance commits.

## Gaps

**Blockers: 0 new** · **Resolved this reconciliation: 12 gaps plus 1 assumption**

Still carried, none constraining Phase 2 structure:

| ID | Severity | Effect on Phase 2 |
|---|---|---|
| `Q-PLATFORM-001` | Blocker (completeness claim only) | None on wireframes. Limits what may be claimed about SRS coverage. |
| `Q-CATALOG-001`, `Q-ELIG-001` | Major, **narrowed 2026-08-25 to their clinical residue** | Constrain content, not structure. The catalog shape, its governance and the authority split are settled; what remains is licensed clinical approval of production content and of production formulas, thresholds, grade bands and calibration minimums. Neither is closed and neither is claimed closed. |
| `Q-PLATFORM-002` | Major | Retention periods await legal validation. |
| `Q-OPS-001` | Major | Hosting topology, plus the storage, scanner, OTP and notification vendor selection folded in from `Q-PLATFORM-003`. **Does not block the evidence wireframes** — the eight session states are fixed and vendor-independent. |
| `Q-PLATFORM-004` | Minor | Expected population versus engineering envelope. |
| `ASM-IDENTITY-001`, `ASM-ELIG-001` | Assumption | Both recorded with what breaks if wrong. |

**Halt check:** 0 of 165 screens blocked; 0 of 103 flows carry a bounded incomplete branch. No Blocker touches the role model, the data model or navigation structure. **Phase 1 completes.**

---

## Decisions Made — Do Not Re-Open Downstream

1. **Three platforms, three information architectures.** Attention-driven prominence for the Patient app; stable learnable navigation for both panels. Clinic and Admin are separate panels with separate IA, not one governance console.
2. **Patient primary navigation is four destinations** — Home, Discover, My care, Profile. Confirmed by `PO-UX-09`, which explicitly declined a fifth tab for notifications. The notification centre is a utility destination from the app chrome.
3. **The staff work queue is the landing surface, not a report.** Home for six roles and the depth-reduction mechanism bringing three daily-blocking jobs from depth 3 to depth 2.
4. **One Admin dashboard for eleven roles**, content filtered by active grants. Eleven near-duplicate role landing screens were rejected.
5. **The onboarding portal sits outside the authenticated Clinic panel.** `SCR-IDENTITY-009` to `SCR-IDENTITY-018` are pre-authentication; `SCR-IDENTITY-025` is invitation-only.
6. **Applicant contact verification precedes application content**, which is what makes draft save and resume possible (`ASM-IDENTITY-001`).
7. **Provider and branch context is panel-global chrome** on the Clinic panel, not a per-form field — a deviation from stock Filament justified by `JTBD-IDENTITY-011` being daily-and-blocking.
8. **The comparison tray is a region of `SCR-ELIG-002`**, not a screen. The comparison itself is `SCR-ELIG-005`.
9. **Booking may proceed directly from a result row** (`ASM-ELIG-001`), reducing the shortest booking path from seven hops to four.
10. **`SCR-PLATFORM-001` is the patient's attention surface and `SCR-PLATFORM-009` is the durable record.** Both exist; deadline-bearing items appear on both, which is what makes push, SMS and email optional adapters rather than load-bearing infrastructure.
11. **Two representation paths, kept separate.** `FLOW-IDENTITY-004` is consent, `FLOW-IDENTITY-021` is legal-basis with Admin verification. Merging them would either over-burden the consenting patient or under-verify the dependent case.
12. **Rescheduling is a governed proposal, never an edit.** The original slot stays authoritative while a proposal is pending, on every platform.
13. **Four candidates were rejected as screens** — booking-submitted confirmation, accepted-plan read-only view, comparison tray, and claim decision view — with reasons recorded.
14. **State meanings, not state labels.** Every status records what must be communicated to which actor; the final Arabic string is a Phase 3 `TXT-*` allocation.

## Copy Obligations Carried To Phase 3

Three states have an engineering label whose plain reading would tell the user something false. These are `TXT-*` obligations, not suggestions:

1. **`CANCELLED` with reason `ALTERNATIVE_DECLINED` or `ALTERNATIVE_EXPIRED`** must read as "the appointment was not confirmed". Punitive cancellation language would assert a penalty that does not exist.
2. **`ELIGIBILITY_REVIEW`** must read as a hold pending a check — never a provider accusation, never an instruction to attend.
3. **`FAILED_RETRYABLE` versus `REJECTED`** on evidence must stay distinct. Conflating them tells a patient on a weak connection that their document was refused when the network merely dropped, which is the most likely evidence failure in this product's conditions.

The Syria catalog and pricing reconciliation adds four more, all of the same kind — a literal rendering would assert something untrue:

4. **A `FROM` or `RANGE` price** must read as a starting point or a span, never as a quoted total, and a `FREE` price must read as genuinely free rather than as missing data. `REQUIRES_PLAN` must read as a price only an examination can settle — not as a refusal to disclose.
5. **No price string may say market average, city average, tariff or recommended price**, on any platform. The product asserts the provider's own price and nothing else. Internal `P` and the calibration state behind it have no patient or Clinic wording at all, because they have no patient or Clinic surface.
6. **`service_risk_level` never appears as `R`** in any string, label or export, because `R` already means the verified patient review rating. The level itself is internal; only its practical consequences are ever worded.
7. **Every plan-line amount names its category, its reason and what it covers.** There is no surcharge, extra, adjustment or other. A patient who cannot read why an amount exists is looking at a defect, and Phase 3 must not paper over it with a generic noun.

## Phase 2 Must Read

1. `PHASE_01_HANDOFF.md` — this file, especially the next section.
2. `01-foundation/INFORMATION_ARCHITECTURE.md` — the screen model is the wireframe scope; section 10's sweep names which states each screen must show.
3. `01-foundation/USER_FLOWS.md` — every wireframe must serve at least one flow; the failure and abandon paths are the layout-changing states.
4. `01-foundation/UX_FOUNDATION.md` sections 2, 4 and 5 — the confirmed usage contexts drive density and target size; the frequency-by-criticality plot decides prominence; the content inventory supplies worst-case content for sizing.
5. `01-foundation/UPSTREAM_GAPS.md` — what is resolved, what remains, and what breaks if the two assumptions are wrong.
6. `.spec/decisions/PO-2026-08-25-ux-phase1-reconciliation.md` — the authority for everything the reconciliation changed.
7. `docs/database/ERD.md` — real entity and field names for placeholder content. Never lorem ipsum.
8. `docs/domain/STAFF_INTERACTION_CONTRACTS.md` — the `SDC-*` projections bound what each staff screen may display.

## Phase 2 Must NOT Re-Decide

- **The screen model.** All 165 screens, their IDs, platform assignment and classification. A needed split is a `Q-*`, not a wireframe decision.
- **The navigation structure.** Primary, secondary and utility navigation on all three platforms; the four Patient destinations and the decision not to add a fifth; both panels' navigation groups and ordering; every landing screen.
- **The flow set.** All 103 flows, their screen sequences, failure and abandon paths, and re-entry behavior.
- **The platform profiles.** Patient = C, Clinic = A, Admin = A. No hover state may be emitted for the Patient app; both panels specify framework configuration rather than free-form layout.
- **The three-platform separation.** Do not converge the panels or port a panel pattern into the Patient app.
- **The confirmed usage contexts.** `PO-UX-07` is settled. Density, target size and confirmation friction follow from it and are not re-argued per screen.
- **Depth and the queue's role.** The work queue as staff landing surface, and the depth reductions in `INFORMATION_ARCHITECTURE.md` section 7.4.
- **The fourteen decisions** above, and the two remaining `ASM-*`.
- **The labelling taxonomy** in `INFORMATION_ARCHITECTURE.md` section 8, including every audience translation of an internal term. A deviation is a `CONFLICT-*`.
- **The algorithm-hiding boundary.** No wireframe may introduce a control that selects `S`, `P`, `H`, `I`, `K`, `EU`, a grade or a final eligibility value, on any platform, nor show a composite score or raw `I`.
- **The financial boundary.** No wireframe may contain a pay, wallet, balance, top-up, withdraw or platform-refund affordance.
- **The three fail-closed rules.** No attendance override for `ELIGIBILITY_REVIEW`; no state may block a guardian revocation; a pending reschedule never displaces the original appointment.
- **Escalated and overdue are flags, not states.** The work queue must render them independently of the lifecycle state.

## Recommendation

Phase 1 is mechanically clean and structurally complete: 0 failures and 0 warnings from both validators, 165 of 165 screens and 103 of 103 flows passing every check, 82 of 82 lifecycle statuses mapped across 18 machines, 69 of 69 jobs traced and served, 19 of 19 roles with a landing screen, no permitted action without a screen, and no bounded incomplete branch.

**The blocker that previously stood in front of Phase 2 is gone.** `Q-PLATFORM-006` was the one open item that directly limited wireframing, because density, target size and confirmation friction are exactly what wireframes decide and the environment driving them was undocumented for all 19 actors. `PO-UX-07` answered it for every role class.

**Phase 2 can proceed on the full 165-screen scope.** No remaining open item removes a screen or a region from wireframe scope. In particular the five evidence-bearing screens are now fully wireframable: `PO-UX-17` fixed the eight session states without naming a vendor, so the storage and scanner decision under `Q-OPS-001` does not touch the interaction.

Two things worth carrying into Phase 2 as deliberate work rather than assumptions. The **three copy obligations** above are places where a literal rendering of the engineering state would misinform the user, and they need to be caught at wireframe stage where the state is placed, not discovered at Phase 3 when the string is written. And **`Q-PLATFORM-007` will not be resolved by a decision** — `PO-UX-18` accepted it. Five usability sessions with clinic staff would validate the frequency-by-criticality plot's daily-and-blocking placements at low cost, and that plot drives every prominence decision Phase 2 makes.
