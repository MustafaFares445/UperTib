# Phase 1 Handoff

**Phase:** UX 1 — Discovery, Information Architecture and User Flows
**Baseline:** 2026-08-25
**Status:** Complete, awaiting the Phase 1 gate

**Platform profile:** Patient = **C** (React Native) · Clinic/Doctor = **A** (Filament 5, panel `clinic`) · Admin = **A** (Filament 5, panel `admin`)
**Input mode:** **Docs-Partial** — the behavioral engineering doc set is complete; no screen inventory existed to inherit, so all 155 screens are derived and classified `New`
**Accessibility target:** WCAG 2.2 AA, from `NFR-PLATFORM-005`

## Files Produced

Line counts below are measured, not estimated — `wc -l` over the produced files.

| Path | Lines | Contents |
|---|---:|---|
| `docs/ux/01-foundation/UX_FOUNDATION.md` | 1022 | 19 actors, 62 jobs, frequency-by-criticality plot, 46-entity content inventory, 5 design principles, 9 constraint areas |
| `docs/ux/01-foundation/INFORMATION_ARCHITECTURE.md` | 3121 | 155 screens, 4 sitemaps, 3 navigation models, depth tables, labelling taxonomy, role sweep, 62-status lifecycle sweep |
| `docs/ux/01-foundation/USER_FLOWS.md` | 3438 | 94 flows with failure, abandon and re-entry paths and a diagram each; cross-flow checks; friction budget |
| `docs/ux/01-foundation/UPSTREAM_GAPS.md` | 268 | 17 gaps, 8 new `Q-*`, 1 new `CONFLICT-*`, 3 `ASM-*` |
| `docs/ux/README.md` | 139 | Index, authority chain, ownership split, phase status, registry additions |
| `docs/ux/scripts/validate_ux_docs.py` | 166 | Phase-aware validator, `ux_01` Appendix A verbatim |
| `docs/ux/PHASE_01_HANDOFF.md` | 184 | Handoff and verification report |

Total: 8338 lines.

Two files outside `docs/ux/**` were changed, both append-only or corrective, and both required:

| Path | Change |
|---|---|
| `docs/README.md` | Appended this phase's `SCR-*`, `FLOW-*`, `JTBD-*`, `Q-*`, `CONFLICT-*` and `ASM-*` allocations to the canonical registry, plus the nine new open items. No existing entry altered. |
| `docs/scripts/validate_docs.py` | Repointed `OWNER_FILES["SCR"]` from `docs/ux/SCREEN_INVENTORY.md` to `docs/ux/01-foundation/INFORMATION_ARCHITECTURE.md`, and added the UX gap file to the `ASM` owner list. The validator's own comment prescribes this: *"If an approved source later introduces either artifact, update README and this validator in the same documentation change."* Both changes **strengthen** the checks — `SCR` and `ASM` previously ran over empty sets and passed vacuously; they now verify 155 and 3 real IDs against their actual owners. No check was relaxed, no threshold lowered. |

No production application code was modified.


## IDs Allocated This Phase

**`SCR-*` — 155 screens**
`SCR-IDENTITY-001..036` · `SCR-ELIG-001..020` · `SCR-CLINICAL-001..019` · `SCR-BOOKING-001..015` · `SCR-CLAIMS-001..013` · `SCR-FINANCE-001..012` · `SCR-REVIEWS-001..009` · `SCR-CATALOG-001..009` · `SCR-PLATFORM-001..008` · `SCR-OPS-001..006` · `SCR-POLICY-001..004` · `SCR-AUDIT-001..004`

**`FLOW-*` — 94 flows**
`FLOW-IDENTITY-001..020` · `FLOW-ELIG-001..014` · `FLOW-BOOKING-001..012` · `FLOW-CLINICAL-001..010` · `FLOW-CLAIMS-001..009` · `FLOW-FINANCE-001..008` · `FLOW-REVIEWS-001..005` · `FLOW-CATALOG-001..005` · `FLOW-OPS-001..004` · `FLOW-PLATFORM-001..003` · `FLOW-POLICY-001..002` · `FLOW-AUDIT-001..002`

**`JTBD-*` — 62 jobs**
`JTBD-IDENTITY-001..011` · `JTBD-ELIG-001..008` · `JTBD-CLINICAL-001..007` · `JTBD-BOOKING-001..007` · `JTBD-CLAIMS-001..007` · `JTBD-FINANCE-001..006` · `JTBD-CATALOG-001..003` · `JTBD-OPS-001..003` · `JTBD-REVIEWS-001..003` · `JTBD-PLATFORM-001..003` · `JTBD-POLICY-001..002` · `JTBD-AUDIT-001..002`

**Shared register** — `Q-OPS-002`, `Q-PLATFORM-005`, `Q-PLATFORM-006`, `Q-PLATFORM-007`, `Q-IDENTITY-001`, `Q-REVIEWS-001`, `Q-BOOKING-003`, `Q-CLINICAL-001`, `CONFLICT-BOOKING-001`, `ASM-PLATFORM-001`, `ASM-IDENTITY-001`, `ASM-ELIG-001`

No existing ID was renumbered, reused or repurposed. `docs/README.md` requires an append-only registry update for the `SCR`, `Q`, `CONFLICT` and `ASM` columns.

---

# Phase 1 Verification

## Mechanical

```
$ python docs/ux/scripts/validate_ux_docs.py --phase 1
phase 1 | 155 screens, 94 flows, 0 wireframes, 0 components, 0 widgets

0 failure(s), 0 warning(s)
```

Exit code **0**. Note: `python3` is not on this machine's PATH; the working interpreter is `C:\laragon\bin\python\python-3.13\python.exe` (Python 3.13.0).

The engineering-docs validator was re-run after the registry update and the owner-path corrections: `python Docs/scripts/validate_docs.py` → **0 failures, 0 warnings**, exit 0, over 30 markdown files (23 before this phase, plus the 7 produced here), 51 `FR-*`, 14 `NFR-*`, 31 `API-*`, 19 `ERR-*`. It now also verifies all 155 `SCR-*` and 3 `ASM-*` allocations against their owning documents, which it could not do before because both sets were empty.

## Coverage

- **Actors:** 19 UI-bearing, plus system automation and 2 explicit non-roles. With environment documented: **0/19** — missing for all 19, raised once as `Q-PLATFORM-006` rather than assumed.
- **JTBD:** 62 — traced to ≥1 `FR-*`: **62/62**. Untraced: none.
- **JTBD served by ≥1 screen:** **62/62**. Orphans: none.
- **JTBD appearing in ≥1 flow:** **62/62**. Orphans: none.
- **Screens:** 155 — serving ≥1 JTBD: **155/155**. Orphans: none.
- **Screens referencing ≥1 requirement:** **155/155**.
- **Screens naming a data or action contract:** **155/155** — `API-*` for Patient, `SDC-*` for Clinic and Admin, per `PO-UX-05`.
- **User-visible FRs reachable from a screen:** **37/37**. Unreachable: none. The PRD marks the other 14 of 51 as background or system behavior — `FR-IDENTITY-001`, `FR-ELIG-002` to `006`, `FR-ELIG-011` to `015`, `FR-FINANCE-005`, `FR-FINANCE-007`, `FR-AUDIT-003` — and all 14 are nonetheless referenced by screens that display their resulting state.
- **Flows:** 94 — with failure paths: **94/94**; with abandon paths: **94/94**; with re-entry: **94/94**; with a friction count: **94/94**; with a diagram: **94/94**. Missing: none.
- **`ERR-*` with a UX destination:** **19/19**. Without: none.
- **`SDC-*` referenced:** **17/17**.
- **`API-*` referenced:** **29/31**. Deliberately unreferenced: `API-ELIG-003` and `API-ELIG-004`. `API_CONTRACTS.md` section 6 states that if the doctor experience is Filament-only at implementation time these use cases run in-process and the external endpoints may be omitted. The Clinic panel is Profile A, so `SDC-ELIG-001` is the correct contract for `SCR-ELIG-007` and `SCR-ELIG-008`. Referencing the optional REST variants as well would imply a non-Filament provider client that no approved source establishes.

## Sweeps

- **Roles with a landing screen:** **19/19**. Missing: none.
- **Permitted actions with no screen:** **none.** All `Allow` and `Conditional` rows across `PERMISSIONS_MATRIX.md` sections 6 to 15 were checked against the screen model; 83 action rows map to reachable screens.
- **Denied actions visible where they should not be:** **none.** 21 `Deny` categories checked, including direct `S`/`P`/`H`/`I` entry, raw `I` exposure, composite scoring, money movement, Admin clinical authoring, non-treating plan authorship, immutable-record editing, audit mutation, forced booking confirmation, premature no-show, duplicate active review, unentitled protection claim, prohibited self-approval, clinical credential misuse, administrator scope bypass, guardian masquerade, and deletion under legal hold.
- **Lifecycle statuses never displayed:** **none.** **62/62** statuses across 15 machines have a screen, and every action valid from each is reachable. Two branches are bounded rather than missing: `ALTERNATIVE_PROPOSED` on expiry (`Q-BOOKING-001`) and existing bookings after suspension (`Q-BOOKING-002`).
- **Daily-blocking JTBD deeper than 2 levels:** **3** — `JTBD-CLINICAL-001`, `JTBD-CLINICAL-003`, `JTBD-CLAIMS-005`. All three reach their working screen at depth 2 from the work queue; the queue is the depth-reduction mechanism, which is why it is the staff landing surface rather than a report. `JTBD-IDENTITY-003` shows depth 3 for `SCR-IDENTITY-008`, but the active-subject indicator is global chrome and that screen exists only for switching.
- **Flows over friction budget for their frequency:** **3** — `FLOW-BOOKING-003` (daily-blocking, deadline-bound, 3 screens), `FLOW-OPS-001` (daily-blocking, 3–4 screens, structurally inherent to work items referencing rather than replacing source records), and `FLOW-CLINICAL-001` (5 screens, over budget on raw count but deliberate friction on an irreversible patient-visible act). The first two are carried to Phase 2 as compression targets.
- **Algorithm-hiding sweep:** **10/10 internal concepts pass.** Zero patient screens require the patient to understand or manipulate `S`, `P`, `H`, `I`, `K`, `EU`, a grade cap, a gate result, a policy version or a composite score; zero patient screens contain a control that selects one. The same check was applied to the Clinic panel, since `FR-ELIG-007` extends the prohibition there: `SCR-ELIG-008` captures facts and answers only, and `SCR-ELIG-011` and `SCR-ELIG-012` show computed status and actionable blockers with no override control and no raw `I`.
- **Cross-platform sweep:** 8 dedicated cross-platform lifecycle flows cover booking, treatment plan, eligibility change, review, claim, external financial event, access revocation and clinic onboarding. Each distinguishes user action, automatic system action and human review, and each names what the other platforms observe and when.

## Scope Discipline

- **Screens or actions with no requirement source:** **none.** Every screen names at least one `FR-*` and at least one contract. Four candidate screens were rejected during derivation as state variants or owned regions, and the reasoning is recorded in `INFORMATION_ARCHITECTURE.md` section 1.2.
- **Visual or layout decisions made in this phase:** **none.** No layout, region, component, token, colour, type, icon, copy string, widget or data-state behavior appears in any Phase 1 file. Confirmed mechanically: the validator's raw-value and colour-word scan over `01-foundation/**` returns clean, and an independent scan of all four foundation files for hex values, pixel and millisecond literals, and colour words returns zero matches.
- **Product behavior invented:** **none.** Two flow branches stop where their destination is undefined upstream rather than being completed by inference.

## Gaps Raised

**Blockers: 0 new** · **Major: 8 new, 5 carried** · **Minor: 2 new IDs, 3 unnumbered notes, 4 carried**

`Q-PLATFORM-001` remains a carried Blocker against the *completeness claim* only — the authoritative SRS is not machine-readable, so this phase covers the approved `.spec` baseline and the canonical `docs/` set rather than a certified full reconciliation. It blocked no artifact.

**Halt check:** 0 of 155 screens blocked; 2 of 94 flows carry a bounded incomplete branch (2%), far under the ~30% threshold. No Blocker touches the role model, the data model or navigation structure. **Phase 1 completes.**

---

## Decisions Made — Do Not Re-Open Downstream

1. **Three platforms, three information architectures.** Attention-driven prominence for the Patient app; stable learnable navigation for both panels. Clinic and Admin are separate panels with separate IA, not one governance console.
2. **Patient primary navigation is four destinations** — Home, Discover, My care, Profile. Finance, reviews and claims are case-scoped and reached through their case, because every one of them is case-scoped in the data model.
3. **The staff work queue is the landing surface, not a report.** It is the home for six roles and the depth-reduction mechanism that brings three daily-blocking jobs from depth 3 to depth 2.
4. **One Admin dashboard for eleven roles**, with content filtered by active grants. Eleven near-duplicate role landing screens were rejected.
5. **The onboarding portal sits outside the authenticated Clinic panel.** `SCR-IDENTITY-009` to `SCR-IDENTITY-018` are pre-authentication; `SCR-IDENTITY-025` is reachable by invitation only.
6. **Applicant contact verification precedes application content**, which is what makes draft save and resume possible (`ASM-IDENTITY-001`).
7. **Provider and branch context is panel-global chrome** on the Clinic panel, not a per-form field — a deviation from stock Filament justified by `JTBD-IDENTITY-011` being daily-and-blocking.
8. **The comparison tray is a region of `SCR-ELIG-002`**, not a screen. The comparison itself is `SCR-ELIG-005`.
9. **Booking may proceed directly from a result row** (`ASM-ELIG-001`), which reduces the shortest booking path from seven hops to four.
10. **`SCR-PLATFORM-001` is the patient's re-entry surface** for every deadline-bound item, pending `Q-PLATFORM-005` (`ASM-PLATFORM-001`).
11. **Four candidates were rejected as screens** — booking-submitted confirmation, accepted-plan read-only view, comparison tray, and claim decision view — with reasons recorded.
12. **State meanings, not state labels.** Every status records what must be communicated to which actor; the final Arabic string is a Phase 3 `TXT-*` allocation.

## Assumptions In Force

| ID | Assumption | What breaks if wrong |
|---|---|---|
| `ASM-PLATFORM-001` | The attention surface on `SCR-PLATFORM-001` is the patient's primary re-entry path | If a notification inbox is later established, the attention feed's role changes from load-bearing to supplementary. If no attention surface is wanted, `FLOW-BOOKING-006`, `FLOW-CLAIMS-003`, `FLOW-CLINICAL-007` and `FLOW-FINANCE-004` lose their only delivery-independent re-entry path. |
| `ASM-IDENTITY-001` | Applicant contact verification precedes application content | If verification belongs at submission, draft resume needs a different identification mechanism and `FLOW-IDENTITY-005` and `FLOW-IDENTITY-006` reorder. |
| `ASM-ELIG-001` | `SCR-ELIG-003` is an optional deepening, not a mandatory booking step | If the decision card must be viewed before booking, every booking path gains a screen and `FLOW-BOOKING-001` and `FLOW-ELIG-005` lengthen. |

## Blockers Carried Forward

| ID | Severity | Effect on Phase 2 |
|---|---|---|
| `Q-PLATFORM-001` | Blocker (completeness claim only) | None on wireframes. Limits what may be claimed about SRS coverage. |
| `Q-BOOKING-001` | Major | `SCR-BOOKING-005` cannot wireframe a terminal outcome state for an expired alternative. Wireframe the disabled-acceptance state only. |
| `Q-BOOKING-002` | Major | `SCR-ELIG-013`, `SCR-BOOKING-014` and `SCR-BOOKING-015` cannot wireframe an outcome for existing bookings in a suspended scope. |
| `Q-PLATFORM-003` | Major | Five evidence screens cannot wireframe the transfer interaction, its progress or its resumability. Wireframe the requirement, per-item state and recovery. |
| `Q-OPS-002` | Major | `SCR-OPS-001`, `SCR-OPS-002` and `SCR-OPS-003` cannot wireframe state chips, state filters or state-based grouping. |
| `Q-PLATFORM-005` | Major | Affects whether a notification-history screen exists at all. Do not wireframe one. |
| `Q-PLATFORM-006` | Major | **Directly limits Phase 2.** Density, target size and confirmation friction are the three things wireframes decide, and the environment driving them is undocumented for all 19 actors. |
| `Q-PLATFORM-007` | Major | Prominence rests on documented responsibility rather than observed behavior. |
| `Q-IDENTITY-001` | Major | The dependent-who-cannot-self-grant path has no screen to wireframe. |
| `Q-REVIEWS-001` | Major | Determines whether `SCR-REVIEWS-004` exists for patients. |
| `CONFLICT-BOOKING-001` | Major | Affects the error surface on `SCR-IDENTITY-007`. |
| `Q-CATALOG-001`, `Q-ELIG-001` | Major | Constrain content, not structure. |
| `Q-BOOKING-003`, `Q-CLINICAL-001`, `Q-PLATFORM-002`, `Q-OPS-001`, `Q-PLATFORM-004` | Minor | No effect on wireframe structure. |

## Phase 2 Must Read

1. `PHASE_01_HANDOFF.md` — this file, especially the next section.
2. `01-foundation/INFORMATION_ARCHITECTURE.md` — the screen model is the wireframe scope; section 10's lifecycle sweep names which states each screen must show.
3. `01-foundation/USER_FLOWS.md` — every wireframe must serve at least one flow; the failure and abandon paths are the layout-changing states.
4. `01-foundation/UX_FOUNDATION.md` sections 4 and 5 — the frequency-by-criticality plot decides prominence; the content inventory supplies worst-case content for sizing.
5. `01-foundation/UPSTREAM_GAPS.md` — what cannot be wireframed and why.
6. `docs/database/ERD.md` — real entity and field names for placeholder content. Never lorem ipsum.
7. `docs/domain/STAFF_INTERACTION_CONTRACTS.md` — the `SDC-*` projections bound what each staff screen may display.

## Phase 2 Must NOT Re-Decide

- **The screen model.** All 155 screens, their IDs, their platform assignment and their classification. A needed split is a `Q-*`, not a wireframe decision.
- **The navigation structure.** Primary, secondary and utility navigation on all three platforms; the four Patient destinations; both panels' navigation groups and their ordering; every landing screen.
- **The flow set.** All 94 flows, their screen sequences, their failure and abandon paths and their re-entry behavior.
- **The platform profiles.** Patient = C, Clinic = A, Admin = A. In particular: no hover state may be emitted for the Patient app, and both panels specify framework configuration rather than free-form layout.
- **The three-platform separation.** Do not converge the panels or port a panel pattern into the Patient app.
- **Depth and the queue's role.** The work queue as staff landing surface, and the depth reductions recorded in `INFORMATION_ARCHITECTURE.md` section 7.4.
- **The twelve decisions** listed above, and the three `ASM-*`.
- **The labelling taxonomy** in `INFORMATION_ARCHITECTURE.md` section 8, including every audience translation of an internal term. A deviation is a `CONFLICT-*`.
- **The algorithm-hiding boundary.** No wireframe may introduce a control that selects `S`, `P`, `H`, `I`, `K`, `EU`, a grade or a final eligibility value, on any platform. No wireframe may show a composite score or raw `I`.
- **The financial boundary.** No wireframe may contain a pay, wallet, balance, top-up, withdraw or platform-refund affordance.
- **The two bounded branches.** Do not complete `FLOW-BOOKING-007` or the existing-booking branch of `FLOW-ELIG-012` with an invented outcome.

## Recommendation

Phase 1 is mechanically clean and structurally complete: 0 failures, 0 warnings, 155 of 155 screens and 94 of 94 flows passing every check, 62 of 62 lifecycle statuses mapped, 19 of 19 roles with a landing screen, and no permitted action without a screen.

**Before Phase 2 begins, `Q-PLATFORM-006` should be answered.** Environment and expertise are undocumented for all 19 actors, and density, target size and confirmation friction — the three things wireframes exist to decide — depend on them. Answering it for the three highest-frequency roles (clinic representative, treating dentist, operations staff) would cover most of the 111 panel screens.

The four remaining Phase-2-relevant Majors — `Q-OPS-002`, `Q-PLATFORM-005`, `Q-REVIEWS-001` and `Q-PLATFORM-003` — each remove a specific region or screen from wireframe scope rather than blocking the phase. Phase 2 can proceed without them provided those regions are left explicitly deferred rather than filled in.

`Q-PLATFORM-007` will not be resolved by a decision. Five usability sessions with clinic staff would validate the frequency-by-criticality plot's daily-and-blocking placements at low cost, and that plot drives every prominence decision Phase 2 makes.
