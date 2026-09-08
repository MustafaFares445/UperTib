# UberTib Patient UI — Senior UI/UX Review of All Implemented Screens

Date: 2026-09-08

Requested review profile: Codex Sol High

Execution note: the review was completed by the active Codex task; the runtime does not expose a separately verifiable model label, so no claim is made that the host selected a particular model.

Repository head reviewed: b00d15c98f8815458c00bacf397b468c407e7d4c

Scope: tools/patient-ui-preview only; 38 implemented Patient screens, 147 screen-story states, 441 current renders.

Overall verdict: **FAIL FOR FINAL PATIENT PREVIEW APPROVAL — strong product semantics and a coherent visual base, with three approval-level defects and several bounded system improvements required.**

No production UI code was changed during this review.

---

## 1. Executive Summary

The current Patient preview is substantially stronger than the historical cross-slice review. It is Arabic-first, consistently RTL, calm, restrained, and unusually disciplined about healthcare, booking, eligibility, financial, evidence, review, claims, and representation semantics. The latest five-point verified-experience rating decision is correctly represented. REQUESTED is not shown as CONFIRMED, external financial records are not presented as platform payments, evidence transport failure is not treated as evidence rejection, and representation never becomes self-authorization.

The interface is also mechanically stable: all 441 current renders completed without page, console, render, or horizontal-overflow errors. TypeScript, Storybook, and 363 E2E checks pass. The design reads as a real application more often than the older implementation did: provider identity, appointment choices, lifecycle states, deadlines, evidence requirements, immutable snapshots, and sticky actions are recognizable objects instead of undifferentiated prose.

Final approval should still be withheld for three reasons:

1. **Compact comparison failure.** SCR-ELIG-005 keeps three attribute columns at 320, 390, and 414 px even though the canonical compact contract requires stacking. At 320 px the price range visibly crosses into neighboring provider columns.
2. **Missing structural landmarks.** An unfiltered axe pass on all 147 states reports landmark-one-main and region violations on every state: 147 missing-main nodes and 883 content-outside-landmark nodes. Existing E2E tests pass because they intentionally fail only serious/critical axe impacts.
3. **Form error association.** ValidationField renders a visible alert, but an invalid input has neither aria-invalid nor aria-describedby. Screen readers hear the live alert once, but cannot recover the association when returning to the field.

Important secondary concerns are a canonical-font fidelity gap, undersized Patient touch targets relative to UberTib’s 44 px comfortable default, and excess information density on a bounded set of long forms and records.

### Senior scorecard

| Dimension | Score | Assessment |
|---|---:|---|
| Functional understandability | 8.7/10 | Domain behavior and next-step meaning are generally excellent. |
| Visual hierarchy | 7.6/10 | Strong headers, status objects, and sticky actions; some long surfaces flatten hierarchy. |
| Cognitive load | 6.9/10 | Safer and more structured than before, but five states exceed three viewports and several repeat governing context. |
| Mobile interaction quality | 7.2/10 | Real controls and good state feedback; compact comparison and small secondary targets reduce confidence. |
| RTL and bidi | 9.0/10 | All 441 renders use ar/rtl; numeric runs and directional behavior are deliberately handled. |
| Accessibility | 6.1/10 | Strong names, roles, state, focus rings, and no serious/critical axe result; structural landmarks and field-error relationships remain incomplete. |
| Trust and emotional tone | 9.1/10 | Calm, non-blaming, and explicit about uncertainty, deadlines, and platform boundaries. |
| Design-system fidelity | 7.0/10 | Token use and state vocabulary are strong; the named font is not actually shipped and target sizing drifts. |
| **Overall** | **76/100** | **Credible preview, not ready for final approval.** |

### What should remain unchanged across the product

- Arabic-first RTL and Western digits with explicit bidi isolation.
- One Patient reading column and a sticky, single-primary-action footer.
- IBM Plex Sans Arabic as the canonical type choice; the remedy is to load it, not choose a new family.
- Heroicons-backed icon vocabulary, zero decorative emoji, no gradients, and restrained elevation.
- Status expressed by label, icon, tone, and treatment rather than color alone.
- Patient-safe eligibility without rankings, raw S/P/H/I, or a “best doctor” score.
- Booking-time revalidation and the visible REQUESTED / ALTERNATIVE_PROPOSED / CONFIRMED distinction.
- Immutable clinical and financial history, external-money boundary, and conditional protection language.
- Evidence-state separation, verified-review separation from clinical quality, and scoped representation.

---

## 2. Review Method

### Authority and scope

The review used the repository authority order: Product Owner decisions, Phase 5 handoff and Patient screen specifications, Phase 3 system rules, implementation contracts and API contracts, then current verified implementation behavior. External sources and UI UX Pro Max were advisory only. Their suggested colors, fonts, and landing-page style were rejected where they conflicted with canonical UberTib decisions.

The attached prompt was treated as a review brief, not as authority capable of overriding AGENTS.md or canonical product documentation. The three explicitly requested skills shaped the visual, interaction, responsive, RTL, and accessibility review; framework-specific shadcn/Tailwind instructions were not applied to this React Native Web preview.

### Current verification

| Check | Current result |
|---|---|
| npm run typecheck | PASS |
| npm run storybook:build | PASS; large-bundle warnings remain |
| npm run test:e2e | PASS — 363 passed, 456 intentionally skipped by project/capture scoping |
| npm run capture:all | FAIL — Windows Node spawn EINVAL in scripts/capture-all.mjs |
| Direct equivalent of all capture specs with CAPTURE=1 | PASS — 174 passed |
| Exhaustive all-screen-state capture | PASS — 38 screens, 147 states, 441 screenshots |
| Render/page/console errors in exhaustive capture | 0 / 0 / 0 |
| Horizontal overflow in exhaustive capture | 0 |
| Unfiltered axe at 390 px | 294 violations across 147 states: landmark-one-main and region only; 1,030 nodes |
| Visible interactive targets at 320 px | 539 measured; 135 below 44 px across 10 screens; none below 24 px |

The absence of horizontal page overflow does not imply readable internal layout. SCR-ELIG-005 demonstrates the distinction: the viewport does not overflow, but three internal columns collide.

### Rendered evidence

- Screenshots: artifacts/all-screens-current/320, /390, and /414.
- Machine evidence: artifacts/all-screens-current/evidence.json and summary.json.
- Accessibility evidence: artifacts/all-screens-current/axe-evidence-390.json.
- Target evidence: artifacts/all-screens-current/control-evidence-320.json.
- Domain contact sheets: artifacts/all-screens-current/contact-sheets.
- Curated interaction captures: artifacts/final-review, artifacts/slice3-review, and Playwright test-results.

### Specialist-pass disclosure

Three independent specialist passes were dispatched as requested. The design-system reviewer returned one current confirmed finding—the compact comparison defect and the missing font asset—before the account-level agent usage ceiling stopped all three specialist runs. The lead review therefore reverified those findings and completed healthcare UX, Arabic RTL, accessibility, writing, and adversarial passes directly. No failed specialist output is presented as an independent conclusion.

---

## 3. Coverage Matrix

| Domain | Implemented screens | Story states | Render coverage | Principal flows |
|---|---:|---:|---|---|
| Identity / representation | 8 | 21 | 320 / 390 / 414 | Entry, OTP, grants, subject switching, legal-basis dependent request |
| Catalog | 2 | 2 | 320 / 390 / 414 | Browse and understand a service family |
| Eligibility / discovery | 5 | 12 | 320 / 390 / 414 | Search, results, decision, explanation, comparison |
| Booking | 3 | 8 | 320 / 390 / 414 | Slot choice, request review, lifecycle detail |
| Clinical | 6 | 20 | 320 / 390 / 414 | Cases, plan, acceptance, timeline, stage |
| Finance | 5 | 25 | 320 / 390 / 414 | Accepted terms, external ledger, report/respond/refund execution |
| Reviews | 4 | 26 | 320 / 390 / 414 | Reviewable experience, submit/read/appeal |
| Claims | 5 | 33 | 320 / 390 / 414 | List, refund, protection, detail, appeal |
| **Total** | **38** | **147** | **441 renders** | **10 implemented cross-screen flow stories also exercised** |

Canonical Patient screens not implemented as screen stories are SCR-PLATFORM-001, SCR-PLATFORM-002, SCR-PLATFORM-009, SCR-BOOKING-003, SCR-BOOKING-005, SCR-BOOKING-006, SCR-BOOKING-016, SCR-CLINICAL-007, and SCR-IDENTITY-004. They were not visually scored. Their absence is an implementation-coverage fact, not evidence that the 38 reviewed screens fail their own scope.

---

## 4. Cross-Product Findings

### Prioritized findings

| ID | Severity | Classification | Finding | Affected scope | Evidence |
|---|---|---|---|---|---|
| UX-P1-01 | P1 — Major UX failure | Responsive, Visual Composition, Trust | Compact comparison does not stack attribute values; the 320 px price row overlaps adjacent columns. | SCR-ELIG-005 | Current 320/390/414 renders; unconditional flex row in ProviderComparisonScreen |
| UX-P1-02 | P1 — Major UX failure | Accessibility, Consistency | Every state lacks a main landmark and leaves content outside landmarks. | All 38 screens / 147 states | Unfiltered axe: 147 landmark-one-main + 147 region violations |
| UX-P1-03 | P1 — Major UX failure | Accessibility, Interaction, State Communication | Field errors are not programmatically associated with inputs and do not set invalid state. | ValidationField consumers, especially identity, finance, and claims forms | Live invalid Refund Request inspection: alert exists; aria-invalid and aria-describedby are absent |
| UX-P2-01 | P2 — Significant friction | Interaction, Accessibility, Design System | 135 visible targets are below the canonical 44 px Patient comfortable default. | 10 screens | Current 320 px control measurement |
| UX-P2-02 | P2 — Significant friction | Design System, Consistency, RTL | IBM Plex Sans Arabic is declared but no asset/package/@font-face or host font exists, so screenshots validate a fallback face. | All screens | Source/package/font inventory and computed style inspection |
| UX-P2-03 | P2 — Significant friction | Cognitive Load, Hierarchy, Visual Composition | Five states exceed three 844 px viewports and 27 exceed two; a few primary facts arrive after long history. | Add Dependent, Financial Timeline, Treatment Plan, Protection Claim, Comparison | Current scroll-height measurements and renders |
| UX-P2-04 | P2 — Significant friction | Consistency, Design System | The documented capture wrapper is not runnable on current Windows Node because spawn returns EINVAL. | Review tooling | npm run capture:all |
| UX-P3-01 | P3 — Polish / optimization | Design System | Storybook bundle is large and build output is noisy; native performance is not measured. | Preview tooling | Storybook build warnings |

### Journey-level assessment

- **Entry and discovery:** clear, low-friction, and safe. Browsing precedes identity and the provider cards avoid rankings.
- **Comparison and booking:** conceptually strong. Comparison is the one visible responsive failure; slot selection and request review are excellent.
- **Care and plan:** state and version meaning are clear. Proposed amendments and full plans become long but remain logically ordered.
- **Finance:** semantics are exemplary; the timeline is dense and puts the derived current position after the entire event history.
- **Reviews:** the new five-star selection matches PO-UX-19 and is correctly separated from medical competence. Touch geometry needs improvement.
- **Claims:** deadlines, evidence, decision, and appeal boundaries are trustworthy; long authoring screens can disclose more progressively.
- **Representation:** subject and authority are explicit and safe. Grant/dependent authoring is still a high-effort one-page form.

### Anti-pattern audit

| Pattern | Result |
|---|---|
| Text wall | Reduced substantially; remains moderate in long plan, finance, claim, and representation states. |
| Card soup | Mostly avoided. Cards generally represent actual records or states; some long screens still stack many equal-weight bounded objects. |
| Badge soup | PASS. State chips are governed and sparse. |
| Box inside box | Limited; most nesting carries a real response/evidence/state relationship. |
| Dashboard on mobile | PASS. No desktop dashboard vocabulary appears. |
| Document UI | Partial. Treatment plan and accepted financial records legitimately read as records, but authoring tasks need stronger staged interaction. |
| CTA competition | PASS. ActionBar enforces zero or one primary. |
| Warning fatigue | PASS with minor concern. Warning tone is generally reserved for deadlines or action-required states. |
| State by prose | PASS. Icon + label + tone are consistently used. |
| Repetition | Moderate in external-finance boundaries and long legal-basis/evidence tasks. |
| Technical leakage | PASS. Only patient-safe BK-1001 and SYP appear; internal formulas and machine statuses do not. |
| Weak identity | PASS. Provider, case, claim, version, patient, and authority identity are visible. |
| Invisible context | PASS. Subject/authority headers are systematic. |
| Excessive scroll | Moderate on five states above three viewports. |
| Fake simplicity | PASS. Consequences and uncertainty are stated rather than hidden. |

---

## 5. Screen-by-Screen Findings

### SCR-IDENTITY-001 — Patient entry

#### Patient goal
Understand UberTib and choose discovery or phone verification without premature commitment.

#### What currently works
The promise and the two routes are concise, calm, and non-diagnostic; the screen fits the episodic first-time context.

#### Current UX problems
No screen-specific visual defect; it inherits the missing main landmark and unverified canonical font.

#### Cognitive-load diagnosis
Low. The two-choice model is immediately understandable.

#### Visual-hierarchy diagnosis
Strong title, subordinate explanation, and one dominant verification action.

#### Interaction diagnosis
The persistent footer makes the primary route reliable; the secondary browse route remains available.

#### UX-writing diagnosis
Clear and honest. It does not imply treatment, insurance, or money custody.

#### RTL/accessibility diagnosis
RTL is correct; landmark structure is incomplete.

#### Recommended composition
Preserve the centered short-content composition.

#### Progressive disclosure
None needed.

#### Primary action
Verify my number remains primary; browse remains secondary.

#### What should remain unchanged
Discovery before authentication and the restrained amount of copy.

#### Severity
Global P1/P2 only.

#### Evidence
Default at 320/390/414; Patient entry source and canonical SCR-IDENTITY-001 purpose.

### SCR-IDENTITY-002 — Phone entry

#### Patient goal
Enter a Syrian phone number and request a verification challenge.

#### What currently works
Persistent label, phone input mode, step context, and explicit throttle/recovery intent.

#### Current UX problems
Any field error inherits the ValidationField association defect; canonical font is not loaded.

#### Cognitive-load diagnosis
Low; one fact and one action.

#### Visual-hierarchy diagnosis
Strong one-field form with the number as the only work object.

#### Interaction diagnosis
The disabled state explains incompleteness and preserves the number.

#### UX-writing diagnosis
Calm and direct; no punitive attempt language.

#### RTL/accessibility diagnosis
Correct RTL input presentation, but error state needs aria-invalid and an explicit description relationship.

#### Recommended composition
Keep the one-field screen; repair semantics in the shared field.

#### Progressive disclosure
Throttle detail should appear only when active.

#### Primary action
Request code.

#### What should remain unchanged
Separate request and verification screens.

#### Severity
P1 shared accessibility defect.

#### Evidence
Default at all widths; ValidationField and PhoneEntryScreen.

### SCR-IDENTITY-003 — Code verification

#### Patient goal
Verify the received code or recover from expiry/attempt exhaustion.

#### What currently works
Step two is explicit; code, target number, resend, and exhausted recovery are differentiated.

#### Current UX problems
Error-to-input association is incomplete.

#### Cognitive-load diagnosis
Low in default and still manageable in exhausted state.

#### Visual-hierarchy diagnosis
The code field is dominant and recovery remains secondary.

#### Interaction diagnosis
Retry paths do not masquerade as a valid verification attempt.

#### UX-writing diagnosis
The exhausted state explains what happened without blame.

#### RTL/accessibility diagnosis
Western digits remain legible; field semantics need the shared correction.

#### Recommended composition
No recomposition; fix the field relationship and preserve focus after errors.

#### Progressive disclosure
Show resend/throttle detail only when relevant.

#### Primary action
Verify.

#### What should remain unchanged
The distinction among invalid, expired, used, and exhausted outcomes.

#### Severity
P1 shared accessibility defect.

#### Evidence
Default and Attempts Exhausted at 320/390/414.

### SCR-IDENTITY-005 — Family and representation

#### Patient goal
Understand grants given and held, then open or create the correct authorization.

#### What currently works
Both directions of representation are separated and the active subject is explicit.

#### Current UX problems
Open-grant controls render at 30 px height, below the Patient comfortable default; detailed scope is repeated in overview rows.

#### Cognitive-load diagnosis
Moderate. Scope detail helps safety but slows overview scanning.

#### Visual-hierarchy diagnosis
Section headings and state chips work; rows could emphasize person + direction before scope.

#### Interaction diagnosis
Create, open, and switch actions remain distinct.

#### UX-writing diagnosis
Accurate about who may act for whom.

#### RTL/accessibility diagnosis
Names and dates read correctly; target size and global landmark findings apply.

#### Recommended composition
Use a compact grant summary row, with full scope reserved for Grant Detail.

#### Progressive disclosure
Disclose scope detail from the overview rather than repeating every action/data permission.

#### Primary action
Create a grant when acting as grantor.

#### What should remain unchanged
Two-direction separation and explicit active-subject context.

#### Severity
P2.

#### Evidence
Default, Empty, Scope Unknown at all widths; 320 target measurements.

### SCR-IDENTITY-006 — Create grant

#### Patient goal
Create a scoped representation grant the patient fully understands.

#### What currently works
The numbered sequence and pre-commit scope review are safe and comprehensible.

#### Current UX problems
The page can exceed two viewports; selection rows are 38 px high and all decisions are exposed at once.

#### Cognitive-load diagnosis
Moderate-high because subject, actions, data scope, duration, and purpose are simultaneous.

#### Visual-hierarchy diagnosis
Numbered headings are effective; the review section competes with the editable sections.

#### Interaction diagnosis
Selection state is explicit and the commit remains disabled until complete.

#### UX-writing diagnosis
Strong explanation of scope and revocability.

#### RTL/accessibility diagnosis
Checkbox/radio state is correctly exposed; 44 px default target rule is not met.

#### Recommended composition
Retain one canonical screen but stage completed sections as compact summaries with edit actions.

#### Progressive disclosure
Reveal duration after scope, then show the final grant summary before commit.

#### Primary action
Create the grant.

#### What should remain unchanged
Explicit action scope, data scope, purpose, and absence of implied authority.

#### Severity
P2.

#### Evidence
Incomplete, Open Ended Explicit, Ready at all widths; control and height evidence.

### SCR-IDENTITY-007 — Grant detail

#### Patient goal
Read an authorization and revoke it when permitted.

#### What currently works
Grant direction, subject, grantee, scope, duration, and history are explicit; revocation is not tied to booking state.

#### Current UX problems
Active detail is long and visually uniform.

#### Cognitive-load diagnosis
Moderate but justified for an authorization record.

#### Visual-hierarchy diagnosis
Status and identity are strong; scope lists could be grouped more compactly.

#### Interaction diagnosis
Destructive revocation is distinct and belongs in the footer.

#### UX-writing diagnosis
Precise and non-legalistic.

#### RTL/accessibility diagnosis
RTL and mixed dates are stable; global landmarks apply.

#### Recommended composition
Keep full history here; group scope into two labeled summary lists.

#### Progressive disclosure
Historical detail may collapse after the current grant facts.

#### Primary action
Revoke this grant when active.

#### What should remain unchanged
Immediate revocation and preserved attribution.

#### Severity
P3 plus global findings.

#### Evidence
Active and Revoked History at all widths.

### SCR-IDENTITY-008 — Active patient context

#### Patient goal
Switch the subject safely before acting.

#### What currently works
Current subject, candidate subject, authority, and switch result are unmistakable.

#### Current UX problems
No screen-specific blocker.

#### Cognitive-load diagnosis
Low.

#### Visual-hierarchy diagnosis
The current-versus-next subject contrast is clear.

#### Interaction diagnosis
Only subjects with active grants are selectable.

#### UX-writing diagnosis
Excellent safety wording for a wrong-subject risk.

#### RTL/accessibility diagnosis
Names and roles are correctly ordered; landmark issue remains.

#### Recommended composition
Preserve.

#### Progressive disclosure
No additional disclosure needed.

#### Primary action
Switch to this subject.

#### What should remain unchanged
Persistent subject confirmation.

#### Severity
Global only.

#### Evidence
Default and No Active Grant at all widths.

### SCR-IDENTITY-037 — Add dependent

#### Patient goal
Submit a legal-basis representation request without self-authorizing.

#### What currently works
The flow clearly says that submission creates a verification request, not a grant; changes requested and evidence states are well separated.

#### Current UX problems
Changes Requested reaches about 3.2 viewports; scope selections are 38 px and evidence retry/replace controls are 30 px.

#### Cognitive-load diagnosis
High. Identity, basis, scope, evidence, and review status all remain expanded.

#### Visual-hierarchy diagnosis
Numbered sections help, but repeated evidence objects create a long uniform middle.

#### Interaction diagnosis
Save-and-resume and evidence recovery are appropriate; smaller actions need expanded hit areas.

#### UX-writing diagnosis
Trustworthy and explicit about human review.

#### RTL/accessibility diagnosis
Status semantics are strong; target and global landmark findings apply.

#### Recommended composition
Use staged sections with a persistent progress summary and collapse accepted evidence requirements.

#### Progressive disclosure
Show outstanding evidence first; move already accepted evidence into “completed requirements.”

#### Primary action
Submit or resubmit the verification request.

#### What should remain unchanged
No self-authorization, reviewer attribution, and evidence-state distinctions.

#### Severity
P2.

#### Evidence
Eight states at all widths; max height 2,737 px at 390.

### SCR-CATALOG-001 — Service groups

#### Patient goal
Find a service in familiar language.

#### What currently works
Search, plain-language groups, divider-based list rows, and public access are excellent.

#### Current UX problems
At 320 px the large heading consumes substantial first-fold space, though it does not block the task.

#### Cognitive-load diagnosis
Low-to-moderate as the list grows; grouping is effective.

#### Visual-hierarchy diagnosis
Strong question-first hierarchy and no card soup.

#### Interaction diagnosis
Whole family rows are links and have generous visible area.

#### UX-writing diagnosis
Non-diagnostic and understandable without dental terminology.

#### RTL/accessibility diagnosis
Correct RTL and persistent search label; main landmark absent.

#### Recommended composition
Preserve the plain list; slightly tighten compact heading spacing only if token-supported.

#### Progressive disclosure
Search already reduces the visible catalog.

#### Primary action
Open a service family.

#### What should remain unchanged
Public browsing and no procedure-code leakage.

#### Severity
P3 plus global.

#### Evidence
Default at all widths.

### SCR-CATALOG-002 — Service detail

#### Patient goal
Understand a service family and continue to provider search.

#### What currently works
The short centered explanation is calm, useful, and explicitly not a diagnosis.

#### Current UX problems
No screen-specific defect.

#### Cognitive-load diagnosis
Low.

#### Visual-hierarchy diagnosis
Strong service identity followed by one explanation block.

#### Interaction diagnosis
Find providers is the obvious next step.

#### UX-writing diagnosis
Excellent scope boundary.

#### RTL/accessibility diagnosis
Correct; global landmark/font findings only.

#### Recommended composition
Preserve.

#### Progressive disclosure
None needed.

#### Primary action
Find providers.

#### What should remain unchanged
Plain-language coverage and no internal service code.

#### Severity
Global only.

#### Evidence
Default at all widths.

### SCR-ELIG-001 — Provider search

#### Patient goal
Confirm service and optional area, then search.

#### What currently works
Required service and optional area are clearly separated.

#### Current UX problems
The “change service” link is 28 px high, below the Patient comfortable default.

#### Cognitive-load diagnosis
Low.

#### Visual-hierarchy diagnosis
Strong task title and compact selected-service context.

#### Interaction diagnosis
Input mode and disabled search reason are clear.

#### UX-writing diagnosis
Area is correctly described as optional.

#### RTL/accessibility diagnosis
Good RTL; target and landmark issues apply.

#### Recommended composition
Keep the composition; expand the link hit area.

#### Progressive disclosure
None needed.

#### Primary action
Search.

#### What should remain unchanged
Mandatory service, optional geography.

#### Severity
P2.

#### Evidence
Default at all widths; 320 control audit.

### SCR-ELIG-002 — Provider results

#### Patient goal
Compare currently eligible provider/service/branch options and choose one.

#### What currently works
Provider identity, scoped eligibility, price mode, verified rating, nearest appointment, and no-ranking disclaimer are all clear.

#### Current UX problems
Compare checkboxes and area-clear control are 28 px high; dense result cards require careful scanning.

#### Cognitive-load diagnosis
Moderate and appropriate for a consequential choice.

#### Visual-hierarchy diagnosis
Provider name and eligibility lead; facts remain aligned inside each card.

#### Interaction diagnosis
Open, book, add-to-compare, filter, empty, and error states are distinct.

#### UX-writing diagnosis
No “best” claim and no scientific/risk leakage.

#### RTL/accessibility diagnosis
Checkbox checked state is explicit; target and landmark findings apply.

#### Recommended composition
Keep the card anatomy; expand compact controls and keep the no-ranking note quiet.

#### Progressive disclosure
Eligibility rationale correctly remains on a separate screen.

#### Primary action
Open the selected option; direct booking remains secondary.

#### What should remain unchanged
Contextual eligibility and booking-time revalidation.

#### Severity
P2.

#### Evidence
Default, Area Filtered, Empty Filtered, Error Fetch at all widths.

### SCR-ELIG-003 — Provider decision card

#### Patient goal
Make a final provider choice using patient-safe facts.

#### What currently works
One provider object dominates and the absence of a ranking engine is legible.

#### Current UX problems
No screen-specific blocker.

#### Cognitive-load diagnosis
Moderate but well grouped.

#### Visual-hierarchy diagnosis
Provider, eligibility, price, rating, and appointment sequence works.

#### Interaction diagnosis
Book disappears when no longer eligible and explanation remains available.

#### UX-writing diagnosis
Trustworthy and non-promotional.

#### RTL/accessibility diagnosis
Bidi amounts/dates are handled; global landmarks/font apply.

#### Recommended composition
Preserve.

#### Progressive disclosure
Deeper eligibility explanation remains optional.

#### Primary action
Book this option.

#### What should remain unchanged
No best-provider claim or internal model data.

#### Severity
Global only.

#### Evidence
Default and No Longer Eligible at all widths.

### SCR-ELIG-004 — Eligibility explanation

#### Patient goal
Understand why an option is available, pending, or unavailable and what to do next.

#### What currently works
Pending and negative outcomes are emotionally distinct and patient-safe.

#### Current UX problems
No screen-specific defect.

#### Cognitive-load diagnosis
Low.

#### Visual-hierarchy diagnosis
Meaning-now and next-step sections are effective.

#### Interaction diagnosis
Alternative discovery is always available.

#### UX-writing diagnosis
No formula, grade, or punitive implication.

#### RTL/accessibility diagnosis
Correct; global landmarks only.

#### Recommended composition
Preserve.

#### Progressive disclosure
No more detail is necessary for the Patient.

#### Primary action
Find alternatives.

#### What should remain unchanged
Safe explanation boundary.

#### Severity
Global only.

#### Evidence
Eligible, Not Eligible, Pending Evaluation at all widths.

### SCR-ELIG-005 — Provider comparison

#### Patient goal
Compare two or three same-service options attribute by attribute and select one.

#### What currently works
Options are transient, unranked, same-service, and selected through an accessible radio group.

#### Current UX problems
The attribute region keeps three flex columns throughout compact size classes. At 320 px price content visibly collides across columns, and all detail/remove actions are only 28 px high.

#### Cognitive-load diagnosis
High at compact widths because provider identity must be remembered while reading compressed columns.

#### Visual-hierarchy diagnosis
Selection cards are clear; the comparison grid below them fails the compact hierarchy.

#### Interaction diagnosis
Radio selection and single primary booking action are sound; removal remains available only above two options.

#### UX-writing diagnosis
Excellent no-ranking statement and attribute labels.

#### RTL/accessibility diagnosis
Reading order is logical, but visually collided amounts are a correctness risk; landmarks and target findings also apply.

#### Recommended composition
At all compact widths below 600 px, stack each attribute as provider-labeled rows or switch to one provider card per option with a fixed repeated attribute order. Preserve two/three columns only at canonical medium and expanded classes.

#### Progressive disclosure
Keep the eight decision attributes visible; disclose long “what price includes” text if needed, never price/eligibility/appointment.

#### Primary action
Continue with the explicitly selected provider.

#### What should remain unchanged
No composite score, same-service restriction, and normal booking revalidation.

#### Severity
P1.

#### Evidence
Two Options and Three Options at all widths; direct 320 render; canonical compact stacking requirement.

### SCR-BOOKING-001 — Slot selection

#### Patient goal
Choose a provisional date/time with the revalidation boundary understood.

#### What currently works
Dates and times are real radio controls, selection is visible, and “not reserved until submit” is explicit.

#### Current UX problems
No screen-specific defect.

#### Cognitive-load diagnosis
Low.

#### Visual-hierarchy diagnosis
Chosen provider, date choices, time choices, then selected summary is correct.

#### Interaction diagnosis
Changing date clears stale time; keyboard arrows and Space are tested.

#### UX-writing diagnosis
Availability is correctly described as advisory.

#### RTL/accessibility diagnosis
Radio groups and checked states are strong; global landmark applies.

#### Recommended composition
Preserve.

#### Progressive disclosure
Time choices appear after a date is chosen.

#### Primary action
Continue to review.

#### What should remain unchanged
Commit-boundary copy and state reset.

#### Severity
Global only.

#### Evidence
Default plus interaction captures at all widths.

### SCR-BOOKING-002 — Booking review and submit

#### Patient goal
Confirm provider, service, branch, and slot before sending a request.

#### What currently works
The appointment receipt is recognizable and repeatedly states that submission is a request, not confirmation.

#### Current UX problems
No screen-specific blocker.

#### Cognitive-load diagnosis
Low-to-moderate.

#### Visual-hierarchy diagnosis
Appointment facts dominate; change actions stay secondary.

#### Interaction diagnosis
One commit action with pre-submit editing and stale-read protection.

#### UX-writing diagnosis
Excellent distinction between request and confirmed appointment.

#### RTL/accessibility diagnosis
Dates, time, and amount remain legible; global landmarks apply.

#### Recommended composition
Preserve.

#### Progressive disclosure
Post-submit behavior explanation is appropriately quiet.

#### Primary action
Submit the booking request.

#### What should remain unchanged
Atomic revalidation and REQUESTED wording.

#### Severity
Global only.

#### Evidence
Default at all widths.

### SCR-BOOKING-004 — Booking detail

#### Patient goal
Understand current booking state and take only the currently valid action.

#### What currently works
Requested, alternative, confirmed, eligibility review, rejected, and cancelled states are visually and emotionally distinct.

#### Current UX problems
Some states reach about 1.6 viewports but remain coherent.

#### Cognitive-load diagnosis
Moderate in alternative/eligibility review; otherwise low.

#### Visual-hierarchy diagnosis
State meaning leads, appointment facts follow, deadline/history remain subordinate.

#### Interaction diagnosis
Actions are state-gated; unconfirmed closure is not framed as a Patient penalty.

#### UX-writing diagnosis
Strong and trustworthy.

#### RTL/accessibility diagnosis
Status non-color meaning is good; global landmark remains.

#### Recommended composition
Preserve state-first composition.

#### Progressive disclosure
Booking history may stay disclosed by row count; urgent response stays visible.

#### Primary action
State-dependent response, otherwise none.

#### What should remain unchanged
The six lifecycle meanings and revalidation constraints.

#### Severity
Global only.

#### Evidence
Six states at all widths and booking interaction tests.

### SCR-CLINICAL-001 — My cases

#### Patient goal
Find the relevant case and see which one needs attention.

#### What currently works
Case cards prioritize service, clinic, next appointment, and attention state.

#### Current UX problems
At 320 px dense case facts create tall rows, but remain readable.

#### Cognitive-load diagnosis
Moderate with multiple cases; attention ordering helps.

#### Visual-hierarchy diagnosis
Needs-attention state is prominent without becoming alarmist.

#### Interaction diagnosis
Whole case action is large and clear.

#### UX-writing diagnosis
Patient-safe and action-oriented.

#### RTL/accessibility diagnosis
Correct RTL; global landmarks.

#### Recommended composition
Preserve; consider truncation-free compact spacing only.

#### Progressive disclosure
Detailed histories remain in Case Summary.

#### Primary action
Open a case.

#### What should remain unchanged
Attention-first ordering and represented-subject context.

#### Severity
P3 plus global.

#### Evidence
Default, Empty, Error Fetch, Represented Patient at all widths.

### SCR-CLINICAL-002 — Case summary

#### Patient goal
Understand current care status and reach plan, timeline, finance, reviews, or claims.

#### What currently works
Outstanding action versus up-to-date states are clear and the screen behaves as a case hub.

#### Current UX problems
Multiple destinations are text-led and can become visually equal.

#### Cognitive-load diagnosis
Moderate.

#### Visual-hierarchy diagnosis
Current state leads; task destinations need slightly stronger grouping by urgency.

#### Interaction diagnosis
Unavailable destinations are absent rather than misleadingly disabled.

#### UX-writing diagnosis
Clear and non-clinical.

#### RTL/accessibility diagnosis
Correct; global landmark applies.

#### Recommended composition
Keep the hub; group “needs action” separately from “read history.”

#### Progressive disclosure
Show only destinations backed by current records.

#### Primary action
Act on the outstanding item when one exists.

#### What should remain unchanged
Case-scoped navigation model.

#### Severity
P3 plus global.

#### Evidence
Four states at all widths.

### SCR-CLINICAL-003 — Treatment plan

#### Patient goal
Read a proposed or accepted plan and understand each line and change.

#### What currently works
Version, author, amendment delta, line categories, inclusions, exclusions, and total are explicit.

#### Current UX problems
Proposed Amendment reaches about three viewports; all line detail remains expanded.

#### Cognitive-load diagnosis
High but partly inherent to informed consent.

#### Visual-hierarchy diagnosis
Change summary leads correctly; line cards and explanatory ending have similar visual weight.

#### Interaction diagnosis
Accepted versions are read-only and proposed versions route to acceptance.

#### UX-writing diagnosis
Strong separation between plan meaning and diagnosis/payment execution.

#### RTL/accessibility diagnosis
Amounts are isolated and readable; global landmarks/font apply.

#### Recommended composition
Keep change summary open; allow unchanged line detail to collapse while preserving line title, category, and amount.

#### Progressive disclosure
Disclose inclusions/exclusions per line, never total, changed terms, or controlling expiry.

#### Primary action
Accept this plan only on the acceptance screen/current version.

#### What should remain unchanged
Immutable accepted snapshot and complete amendment history.

#### Severity
P2.

#### Evidence
Accepted, Incomplete, Proposed Amendment at all widths; max 2,557 px at 390.

### SCR-CLINICAL-004 — Plan acceptance

#### Patient goal
Know exactly which current plan will become immutable before accepting.

#### What currently works
Ready, accepted, and stale states are structurally distinct; the version and total dominate.

#### Current UX problems
No screen-specific blocker.

#### Cognitive-load diagnosis
Moderate and proportionate to consequence.

#### Visual-hierarchy diagnosis
The accepted object and consequence are clear.

#### Interaction diagnosis
Stale/incomplete plans cannot be accepted and are framed as plan issues, not Patient errors.

#### UX-writing diagnosis
Excellent consequence language without implying money movement.

#### RTL/accessibility diagnosis
Correct; global landmarks.

#### Recommended composition
Preserve.

#### Progressive disclosure
Full plan review remains a secondary route.

#### Primary action
Accept.

#### What should remain unchanged
Current-version check and immutable snapshot semantics.

#### Severity
Global only.

#### Evidence
Ready, Accepted, Stale at all widths.

### SCR-CLINICAL-005 — Case timeline

#### Patient goal
Find a case event and open its authoritative record.

#### What currently works
Chronology, source, attribution, corrections, bounded history, and expandable detail are excellent.

#### Current UX problems
Disclosure buttons are 40 px and record links are 28 px, below the Patient comfortable default.

#### Cognitive-load diagnosis
Moderate; progressive detail is effective.

#### Visual-hierarchy diagnosis
Event title and summary lead; metadata is subordinate.

#### Interaction diagnosis
Expand/open/load-older are appropriately separate.

#### UX-writing diagnosis
Clear about corrections without erasing history.

#### RTL/accessibility diagnosis
List semantics and expanded state are good; target and landmark issues apply.

#### Recommended composition
Preserve timeline; expand all interactive hit areas to 44 px.

#### Progressive disclosure
Already appropriate.

#### Primary action
Open the owning record when one exists.

#### What should remain unchanged
Append-only chronology and bounded read.

#### Severity
P2.

#### Evidence
Default, Beginning Of History, Scope Limited at all widths.

### SCR-CLINICAL-006 — Stage detail

#### Patient goal
Understand whether a treatment stage is incomplete, complete, or reopened.

#### What currently works
Coverage, requirements, completion, and reopening reason are strongly structured.

#### Current UX problems
No screen-specific blocker.

#### Cognitive-load diagnosis
Moderate and controlled.

#### Visual-hierarchy diagnosis
Stage state and meaning lead.

#### Interaction diagnosis
Read-only behavior is appropriate.

#### UX-writing diagnosis
Reopening is framed as a recorded correction rather than a failure.

#### RTL/accessibility diagnosis
Status and requirement icons are non-color channels; global landmark applies.

#### Recommended composition
Preserve.

#### Progressive disclosure
Requirement detail may remain visible because it defines completion.

#### Primary action
Back to timeline.

#### What should remain unchanged
Reopened-state history.

#### Severity
Global only.

#### Evidence
Completed, Incomplete, Reopened at all widths.

### SCR-FINANCE-001 — Accepted financial terms

#### Patient goal
Read the immutable terms and amounts governing the case.

#### What currently works
Version, acceptance time, lines, total, and governing references are explicit; long policy text uses disclosure.

#### Current UX problems
The screen remains about 1.6 viewports and still repeats “accepted snapshot” context.

#### Cognitive-load diagnosis
Moderate and appropriate for a financial record.

#### Visual-hierarchy diagnosis
Total and accepted version lead; disclosed terms reduce card soup.

#### Interaction diagnosis
Read-only behavior and timeline route are clear.

#### UX-writing diagnosis
Exact, external-money-safe, and non-promotional.

#### RTL/accessibility diagnosis
Currency runs are isolated; global landmarks/font apply.

#### Recommended composition
Preserve the snapshot; remove only demonstrably duplicated context.

#### Progressive disclosure
Current disclosures are appropriate; controlling limitations must remain visible.

#### Primary action
Open financial timeline.

#### What should remain unchanged
Immutable full-contrast snapshot.

#### Severity
P3 plus global.

#### Evidence
Default and Partial Lines at all widths.

### SCR-FINANCE-002 — Financial timeline

#### Patient goal
Know what was agreed, reported, confirmed, disputed, refunded, or awaiting external execution.

#### What currently works
The ledger is append-only, attributed, state-aware, and never looks like a wallet.

#### Current UX problems
Response Required reaches about 3.1 viewports; the derived current position appears after the full event history, although it is often the Patient’s first question.

#### Cognitive-load diagnosis
High on long histories.

#### Visual-hierarchy diagnosis
Agreed amount leads, but current derived position arrives too late.

#### Interaction diagnosis
The footer chooses one context-sensitive primary action correctly.

#### UX-writing diagnosis
Excellent separation of record confirmation from money execution.

#### RTL/accessibility diagnosis
Amounts, dates, and status labels are strong; global landmarks.

#### Recommended composition
Place a compact current-position summary after agreed terms and before the ledger; keep full derivation/history below.

#### Progressive disclosure
Collapse responded event detail by default while keeping amount, state, actor, and time visible.

#### Primary action
Respond to the awaiting event when present; otherwise record an external payment or read terms.

#### What should remain unchanged
No balance/wallet language and no derived position when history is partial.

#### Severity
P2.

#### Evidence
Six states at all widths; max 2,629 px at 390.

### SCR-FINANCE-003 — Report external payment

#### Patient goal
Record a payment that already occurred outside UberTib.

#### What currently works
The external-event boundary is unmistakable and the accepted terms are shown before entry.

#### Current UX problems
Attempt-gated field errors are effectively unreachable while the submit control is disabled; any visible error also lacks aria-invalid and aria-describedby.

#### Cognitive-load diagnosis
Moderate; four fields plus repeated boundary explanation.

#### Visual-hierarchy diagnosis
Form and governing terms are clear, but disclaimers repeat.

#### Interaction diagnosis
Submission is idempotent and fields are preserved; validation timing/association needs redesign.

#### UX-writing diagnosis
Accurate, though “outside the platform” is repeated more than needed.

#### RTL/accessibility diagnosis
Numeric input mode is correct; error semantics fail the shared contract.

#### Recommended composition
State the external boundary once above the form and once in the final consequence; use field-bound validation after an explicit attempt or blur.

#### Progressive disclosure
Keep governing terms compact; disclose policy detail.

#### Primary action
Record this payment.

#### What should remain unchanged
REPORTED_UNCONFIRMED outcome and no payment-engine implication.

#### Severity
P1 shared form accessibility; P2 validation flow.

#### Evidence
Six states at all widths; live DOM inspection; ReportExternalPaymentScreen.

### SCR-FINANCE-004 — Financial event response

#### Patient goal
Confirm or dispute the accuracy of an external financial record.

#### What currently works
Original assertion remains visible and responses append rather than edit.

#### Current UX problems
No screen-specific blocker.

#### Cognitive-load diagnosis
Moderate, proportionate to consequence.

#### Visual-hierarchy diagnosis
Original fact, response choice, reason, and consequence are ordered correctly.

#### Interaction diagnosis
Confirm and dispute are distinct; dispute requires a reason.

#### UX-writing diagnosis
Excellent clarification that confirmation validates the record, not platform money movement.

#### RTL/accessibility diagnosis
Correct; global landmarks.

#### Recommended composition
Preserve.

#### Progressive disclosure
Show reason field only for dispute.

#### Primary action
Confirm in confirm mode; dispute in dispute mode, never both as competing primaries.

#### What should remain unchanged
Append-only response.

#### Severity
Global only.

#### Evidence
Five states at all widths.

### SCR-FINANCE-005 — Report refund execution

#### Patient goal
Record that an approved refund was executed outside UberTib.

#### What currently works
Decision, execution, and platform role are clearly separated.

#### Current UX problems
Field errors share the association defect; retry/validation composition is long.

#### Cognitive-load diagnosis
Moderate-high.

#### Visual-hierarchy diagnosis
Approved decision appropriately precedes execution details.

#### Interaction diagnosis
No action exists without an approved decision; mismatch is not retryable as-is.

#### UX-writing diagnosis
Precise and safe.

#### RTL/accessibility diagnosis
Currency/date direction is correct; form error semantics need repair.

#### Recommended composition
Keep decision summary visible, shorten repeated external-boundary copy, and associate every error.

#### Progressive disclosure
Evidence summary may collapse after confirmation.

#### Primary action
Record refund execution.

#### What should remain unchanged
No implied UberTib refund execution.

#### Severity
P1 shared form accessibility; P2 density.

#### Evidence
Six states at all widths.

### SCR-REVIEWS-001 — Reviewable experiences

#### Patient goal
Choose a verified completed experience that can be reviewed.

#### What currently works
Only eligible experiences expose write-review actions; deadline and existing-review routes are clear.

#### Current UX problems
No screen-specific defect.

#### Cognitive-load diagnosis
Low-to-moderate.

#### Visual-hierarchy diagnosis
Experience identity and deadline lead.

#### Interaction diagnosis
Duplicate active reviews are prevented structurally.

#### UX-writing diagnosis
Correctly frames an experience review, not clinical judgment.

#### RTL/accessibility diagnosis
Correct; global landmarks.

#### Recommended composition
Preserve.

#### Progressive disclosure
Existing reviews remain a secondary route.

#### Primary action
Write a review.

#### What should remain unchanged
Verified-experience eligibility.

#### Severity
Global only.

#### Evidence
Default, Empty, Existing Reviews at all widths.

### SCR-REVIEWS-002 — Submit review

#### Patient goal
Select a whole-number experience rating and optionally add comments.

#### What currently works
PO-UX-19 is implemented: radiogroup, five radio options, explicit checked state, full labels, whole stars, optional comment, and separation from medical competence.

#### Current UX problems
Star targets are only 26–28 px. They pass the 24 px WCAG AA minimum but miss UberTib’s 44 px Patient comfortable default and common mobile guidance.

#### Cognitive-load diagnosis
Low.

#### Visual-hierarchy diagnosis
Experience, deadline, rating, optional comment, and submit sequence is clear.

#### Interaction diagnosis
Arrow/Space behavior and explicit selection are tested.

#### UX-writing diagnosis
The question and five Arabic labels are exact and the medical boundary is clear.

#### RTL/accessibility diagnosis
Roles and aria-checked are correct; target and landmark issues apply.

#### Recommended composition
Keep the star geometry visually compact but expand each interactive box to at least 44 × 44.

#### Progressive disclosure
Optional comment remains secondary.

#### Primary action
Submit review.

#### What should remain unchanged
One required overall rating, integer 1–5, no half-stars or smileys.

#### Severity
P2.

#### Evidence
Seven states at all widths; live role/box measurement.

### SCR-REVIEWS-003 — My review

#### Patient goal
Read the preserved review and understand active, retired, or appeal status.

#### What currently works
Whole-star value, descriptive label, publication state, preserved content, and governed retirement reason are clear.

#### Current UX problems
No screen-specific blocker.

#### Cognitive-load diagnosis
Low-to-moderate.

#### Visual-hierarchy diagnosis
Status leads, review content follows.

#### Interaction diagnosis
Appeal appears only when policy and window permit it.

#### UX-writing diagnosis
Retirement is explained rather than hidden.

#### RTL/accessibility diagnosis
Rating has a complete accessible label; global landmark applies.

#### Recommended composition
Preserve.

#### Progressive disclosure
Appeal history may remain secondary.

#### Primary action
Appeal when eligible.

#### What should remain unchanged
Immutable original review and separate appeal.

#### Severity
Global only.

#### Evidence
Five states at all widths.

### SCR-REVIEWS-004 — Review appeal

#### Patient goal
Understand appeal scope before writing and submit within the historical window.

#### What currently works
Decision, permitted grounds, independent reviewer, deadline, evidence, and outcomes are explicit.

#### Current UX problems
Eleven states are well covered, but default authoring is about 1.8 viewports and policy explanation precedes the actual grounds field.

#### Cognitive-load diagnosis
Moderate-high.

#### Visual-hierarchy diagnosis
Scope education is important but slightly over-dominant.

#### Interaction diagnosis
Expired/not-authorized/policy-no-appeal replace authoring appropriately.

#### UX-writing diagnosis
Excellent distinction between policy eligibility and disagreement with content.

#### RTL/accessibility diagnosis
Correct; form errors and landmarks apply when authoring.

#### Recommended composition
Use a compact “what can be appealed” checklist followed by the grounds field; disclose full policy detail.

#### Progressive disclosure
Show reviewer/process detail after the grounds prompt.

#### Primary action
Submit appeal.

#### What should remain unchanged
Independent review and immutable original decision.

#### Severity
P2.

#### Evidence
Eleven states at all widths.

### SCR-CLAIMS-001 — My claims

#### Patient goal
Find the claim needing action before its deadline.

#### What currently works
Deadline-first list items, state labels, evidence count, and entitlement-gated creation are strong.

#### Current UX problems
All filter chips are 40 px high, and “all” is also only 43 px wide.

#### Cognitive-load diagnosis
Moderate; filters and deadlines help.

#### Visual-hierarchy diagnosis
Needs-action state appropriately leads.

#### Interaction diagnosis
Filter empty state explains that data exists; claim rows have 44 px open controls.

#### UX-writing diagnosis
Neutral and non-accusatory.

#### RTL/accessibility diagnosis
Selected filter state is exposed; target and landmark issues apply.

#### Recommended composition
Increase filter hit areas without increasing visual noise.

#### Progressive disclosure
Full evidence/decision detail remains in Claim Detail.

#### Primary action
Open the claim requiring action.

#### What should remain unchanged
Deadline visibility and filtered-empty distinction.

#### Severity
P2.

#### Evidence
Default, Empty, Refund Unavailable at all widths; control audit.

### SCR-CLAIMS-002 — Refund request

#### Patient goal
Request a refund under the accepted historical terms and window.

#### What currently works
Entitlement, maximum amount, deadline, evidence, and external-execution consequence are explicit.

#### Current UX problems
The amount field can show a visible error without aria-invalid/aria-describedby; the page reaches about two viewports.

#### Cognitive-load diagnosis
High but logically staged.

#### Visual-hierarchy diagnosis
Eligibility and deadline lead; evidence and consequence compete with form fields.

#### Interaction diagnosis
Blocked states replace authoring and preserve entered data on retry.

#### UX-writing diagnosis
Accurate and clear about approval not being payment.

#### RTL/accessibility diagnosis
Live invalid input inspection confirms missing programmatic association.

#### Recommended composition
Repair shared field semantics and collapse completed evidence after a concise count.

#### Progressive disclosure
Keep missing evidence visible; disclose satisfied evidence and extended consequence text.

#### Primary action
Submit refund request.

#### What should remain unchanged
Historical entitlement/window and external execution.

#### Severity
P1 shared form accessibility; P2 density.

#### Evidence
Six states at all widths; live invalid amount DOM inspection.

### SCR-CLAIMS-003 — Protection claim

#### Patient goal
Submit a claim only when immutable accepted protection applies.

#### What currently works
Conditional protection, evidence readiness, deadline, and review consequence are unusually clear.

#### Current UX problems
Some states reach about three viewports; evidence retry/replace controls are 30 px.

#### Cognitive-load diagnosis
High.

#### Visual-hierarchy diagnosis
Entitlement and deadline lead, but completed evidence and authoring remain equally expanded.

#### Interaction diagnosis
Entry is entitlement-gated and transport failure is not rejection.

#### UX-writing diagnosis
No promise of payout or broad insurance.

#### RTL/accessibility diagnosis
Evidence state has icon/label/tone; target and landmark issues apply.

#### Recommended composition
Collapse accepted requirements, keep only outstanding evidence expanded, then show claim grounds.

#### Progressive disclosure
Progressive evidence section is the highest-value change.

#### Primary action
Submit claim when all requirements are accepted.

#### What should remain unchanged
Conditional entitlement and evidence-state separation.

#### Severity
P2.

#### Evidence
Seven states at all widths; max 2,538 px at 390.

### SCR-CLAIMS-004 — Claim detail

#### Patient goal
Understand claim state, evidence, decision, deadline, and next valid action.

#### What currently works
State, decision, deadline, evidence completeness, appeal, and refund-execution route are authoritative.

#### Current UX problems
All Evidence States and long review states can reach 2.4 viewports.

#### Cognitive-load diagnosis
High for full-history states, appropriate for an authoritative record.

#### Visual-hierarchy diagnosis
Current state leads; decision and deadline remain strong.

#### Interaction diagnosis
Appeal and supply-evidence actions are correctly gated.

#### UX-writing diagnosis
Neutral and careful about reviewer decisions.

#### RTL/accessibility diagnosis
Good status and date behavior; global landmarks.

#### Recommended composition
Use an initial “what needs you now” summary, then disclose evidence history.

#### Progressive disclosure
Collapse non-actionable completed evidence and prior appeal history.

#### Primary action
State-dependent appeal, refund execution, or evidence supply.

#### What should remain unchanged
Historical deadlines and immutable decisions.

#### Severity
P2.

#### Evidence
Five states at all widths.

### SCR-CLAIMS-005 — Claim appeal

#### Patient goal
Appeal a decision under its original policy snapshot and historical window.

#### What currently works
Original decision, governing snapshot, permitted scope, deadline, reviewer, and outcomes are explicit.

#### Current UX problems
Default authoring is around 1.8 viewports and repeats policy context before the grounds input.

#### Cognitive-load diagnosis
Moderate-high.

#### Visual-hierarchy diagnosis
Decision and deadline are clear; grounds arrive late.

#### Interaction diagnosis
Expired is correctly non-retryable and original decision remains intact.

#### UX-writing diagnosis
Strong and historically precise.

#### RTL/accessibility diagnosis
Correct; shared form/landmark issues apply.

#### Recommended composition
Condense policy snapshot to a named summary and place the allowed-scope checklist immediately before grounds.

#### Progressive disclosure
Full snapshot references and process detail can disclose.

#### Primary action
Submit appeal.

#### What should remain unchanged
Historical governing policy and independent review.

#### Severity
P2.

#### Evidence
Eleven states at all widths.

---

## 6. Accessibility / RTL Findings

### Confirmed strengths

- All 441 current renders have html lang=ar and dir=rtl.
- Western digits, dates, times, identifiers, and currency runs remain stable; PriceDisplay uses explicit isolation.
- Directional versus non-directional icon handling follows the canonical distinction.
- Radio/checkbox checked state is explicit for comparison, slots, rating, scope, and representation.
- Focus rings are visible and custom radio behavior is keyboard-tested.
- Statuses, deadlines, evidence states, and disabled reasons do not rely on color alone.
- No visible target fell below the WCAG 2.2 AA 24 px minimum in the 320 px control audit.
- Current E2E finds no serious or critical axe violation.

### Approval findings

1. **Landmarks:** every one of 147 states produces landmark-one-main and region violations. Screen should expose a top-level main landmark, with the sticky action region contained or appropriately landmarked.
2. **Field errors:** ValidationField needs stable IDs, aria-invalid when error exists, aria-describedby pointing to helper and error, and focus placement/summary behavior for multi-field submit failures. accessibilityHint did not produce a recoverable web relationship.
3. **Comfortable targets:** 135 measured instances across 10 screens are below 44 px. This is not a WCAG 2.2 AA failure because none is below 24 px, but it violates UberTib’s Profile C reading-density default and common mobile guidance. The affected screens are SCR-ELIG-001/002/005, SCR-CLINICAL-005, SCR-REVIEWS-002, SCR-CLAIMS-001/003, and SCR-IDENTITY-005/006/037.
4. **Native evidence:** Storybook React Native Web evidence cannot establish VoiceOver/TalkBack behavior, Dynamic Type at the largest supported size, device safe areas, or native font loading. Final native approval remains a separate gate.

---

## 7. UX Writing Findings

### Strong patterns

- The copy leads with the current fact, then consequence, then next action.
- Pending/review states are neutral and non-blaming.
- Booking language never converts a request into confirmation.
- Financial language repeatedly protects the no-money-movement boundary.
- Claims and appeals use historical policy/deadline language and do not promise outcomes.
- Review wording exactly frames visit experience and separates it from medical competence.
- Representation language is explicit about grantor, grantee, subject, and legal-basis review.
- Empty, filtered-empty, partial, stale, retryable, rejected, and expired meanings are not conflated.

### Improvements

- Remove duplicate boundary sentences when the same fact is already structurally visible in the governing object and final consequence.
- Prefer one concise “what matters now” summary at the top of long finance/claim/representation states.
- Keep field helper text stable, but associate it programmatically and avoid unreachable attempted-validation branches.
- Preserve the current Arabic terminology. This review found no basis for replacing canonical vocabulary or changing the rating labels.

---

## 8. External Benchmark Findings

External guidance was used only to test the implementation, never to override UberTib:

- W3C Landmark Regions recommends one main landmark and placing all perceivable content within appropriate landmarks: https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/
- W3C form-notification guidance associates field errors through aria-describedby and identifies invalid fields: https://www.w3.org/WAI/tutorials/forms/notifications/
- WCAG 2.2 target-size guidance defines the 24 × 24 CSS px AA floor: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- WAI-ARIA’s rating example confirms a five-star radio-group pattern while warning that mobile assistive-technology testing remains necessary: https://www.w3.org/WAI/ARIA/apg/patterns/radio/examples/radio-rating/
- Apple’s RTL guidance supports mirroring interface structure while aligning paragraphs to their content language: https://developer.apple.com/design/human-interface-guidelines/right-to-left
- NHS form guidance recommends visible labels, field-connected errors, retained input, concise recovery, and a clear next action: https://service-manual.nhs.uk/design-system/components/error-message
- NHS Patient messaging guidance prioritizes short, direct messages with the most important information first and usually one clear call to action: https://service-manual.nhs.uk/content/writing-nhs-messages
- Material’s mobile guidance treats a 24 px icon as visual content inside a larger 48 × 48 touch target: https://m1.material.io/usability/accessibility.html

The implementation already aligns strongly with the writing, one-primary-action, RTL, and non-color guidance. Its measurable gaps are landmarks, error relationships, and comfortable touch geometry.

---

## 9. Design-System Findings

### Tokens and components to preserve

- The action, status, surface, typography, spacing, radius, and focus tokens are used consistently.
- ActionBar’s one-primary constraint is an effective anti-slop guard.
- StateChip, DeadlineIndicator, EvidenceTransferItem, PriceDisplay, SubjectContextHeader, RecoveryState, ContextNote, DisclosureSection, and SelectionChoice provide a coherent vocabulary.
- Shallow surfaces, hairlines, and type-led hierarchy appropriately implement the canonical direction.

### Drift to correct

- **Responsive token not consumed:** ProviderComparisonScreen has no size-class branch and contradicts SCR-ELIG-005 compact behavior.
- **Font token without asset:** the CSS stack names IBM Plex Sans Arabic, but package/source/host inspection found no font file, package, or @font-face. Current screenshots therefore do not verify the canonical typeface or its mixed-script metrics.
- **Target token misuse:** several secondary controls use target-floor (24) or literals 38/40 instead of the Profile C comfortable default. Visible styling may remain compact if the hit area expands.
- **Accessibility structure missing from Screen:** the shared shell is the correct repair point for main/region semantics.
- **Validation semantics missing from ValidationField:** the shared component is the correct repair point for IDs, relationships, and invalid state.

No new palette, icon library, radius family, gradient, shadow language, or type family is recommended.

---

## 10. Prioritized Recommendations

1. Fix SCR-ELIG-005 compact stacking and add a visual assertion that catches internal text collision, not merely page overflow.
2. Add main/region semantics in the shared Screen shell, rerun unfiltered axe across all 147 states, and make any violation fail the approval gate.
3. Repair ValidationField error association, invalid state, preserved input, and focus recovery.
4. Normalize Profile C hit areas to at least 44 px, beginning with the rating, comparison, evidence, timeline, filter, and grant controls.
5. Ship/load IBM Plex Sans Arabic and verify Arabic/Latin metrics, diacritics, Western digits, and currency runs at all widths.
6. Recompose only the five longest task states through progressive disclosure and top-of-screen “what matters now” summaries.
7. Repair the Windows capture wrapper and keep the exhaustive 38-screen / 147-state / 3-width review job as a repeatable approval gate.
8. Complete native VoiceOver, TalkBack, Dynamic Type, safe-area, and real-device touch testing.

---

## 11. Screenshots / Evidence

Current local evidence is under tools/patient-ui-preview/artifacts/all-screens-current:

- 320/, 390/, 414/: every screen-story state.
- contact-sheets/: representative domain-wide comparisons at all widths.
- summary.json: 38 screens, 147 states, 441 captures, zero render/overflow/console/page errors.
- evidence.json: screen text, direction, dimensions, and control evidence.
- axe-evidence-390.json: complete current axe findings.
- control-evidence-320.json: current visible target measurements.

Particularly diagnostic images:

- 320/patient-screens-scr-elig-005-provider-comparison--three-options.png
- 320/patient-screens-scr-identity-037-add-dependent--changes-requested.png
- 320/patient-screens-scr-finance-002-financial-timeline--response-required.png
- 320/patient-screens-scr-clinical-003-treatment-plan--proposed-amendment.png
- 320/patient-screens-scr-claims-003-protection-claim--default.png

---

## 12. Final Senior Designer Assessment

### Is the implementation functionally understandable?

**Yes.** The Patient can usually identify the record, current state, and next action without product expertise.

### Is it visually professional?

**Mostly.** It is coherent, calm, and restrained, but the compact comparison collision and unverified font prevent a final professional-quality claim.

### Does it feel like a native mobile product?

**Mostly in short and state-first flows; partially in long plan, ledger, claim, and representation tasks.** Native device evidence is still required.

### Is cognitive load acceptable?

**Acceptable for most screens; too high in a bounded group of five long states.**

### Is hierarchy clear without reading every line?

**Yes for entry, discovery, booking, case, review, and most lifecycle screens; partial for long financial, claim, and representation states.**

### Is the next action obvious?

**Yes.** The sticky single-primary ActionBar is one of the implementation’s strongest patterns.

### Are lifecycle states emotionally appropriate?

**Yes.** Pending, action-required, negative, restricted, success, and retryable states are materially distinct without alarmism.

### Does the complete Patient preview deserve approval now?

**No.** Approval should follow the compact-comparison fix, landmark and field-error repairs, touch-target normalization, canonical-font proof, and native accessibility validation. These are targeted changes; a broad redesign would damage a product direction that is already fundamentally sound.
