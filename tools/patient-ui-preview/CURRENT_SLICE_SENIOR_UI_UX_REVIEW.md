# UberTib Patient UI — Current Slice Senior UI/UX Review

Date: 2026-09-08

Reviewer role: independent Principal Healthcare Mobile UI/UX Designer

Review stage: post-implementation adversarial review before approval

Current branch reviewed: `main`

Current main head: `25e5a2444a8dc83feee9be59276f523a04f1051c`

Slice implementation head before merge: `ab7a4df0ccebe8443412c0191b56d7913db39f25`

Slice base: `b9cd86b37a72274e14501a923a51e2ed7684161a`

Slice: **12 — Guardian and Representation**

Final verdict: **FAIL — MAJOR RECOMPOSITION REQUIRED**

No product implementation files were changed during this review.

---

## 1. Executive verdict

Slice 12 gets the authorization model substantially right but does not yet meet the Patient visual-experience bar.

The strongest part of this slice is the product semantics. Adult consent and legal-basis representation remain separate, dependent submission does not self-authorize the guardian, unresolved scope fails closed, revocation remains unconditional, and represented-patient context preserves the distinction between the acting person and the subject Patient. Those are important healthcare trust properties and should not be weakened during remediation.

The current UI, however, still over-relies on headings, helper paragraphs, bordered information regions, repeated scope lists, and explanatory copy. At 390 px the two rendered failure screenshots inspected during this review visibly reproduce the earlier “newspaper” problem: the patient encounters large titles, multiple paragraphs, form fields, then full-width text controls with little application-object composition. The experience explains the authorization model repeatedly instead of letting the interaction model make it obvious.

Approval is also blocked objectively by the current main CI result. The `Patient UI Preview` run for `25e5a2444a8dc83feee9be59276f523a04f1051c` failed. Typecheck and Storybook build passed, but the readiness smoke step failed because Axe reported a **critical `aria-required-attr` violation**: rendered controls with `role="checkbox"` do not expose the required `aria-checked` state. This occurs on `SCR-IDENTITY-006` and `SCR-IDENTITY-037` in the current React Native Web output.

In addition, the required 320/390/414 visual review is incomplete on the current head. The committed Slice 12 capture suite is opt-in with `CAPTURE=1`, while the current failing CI artifact contains 390 px failure screenshots rather than a complete 320/390/414 visual set. Therefore a final cross-width visual PASS cannot honestly be claimed.

### Approval decision

**Do not approve Slice 12 as visually complete.**

The next iteration should preserve the canonical authorization rules while recomposing the Patient surfaces around recognizable objects and actions:

- person / represented-patient identity;
- permission summary;
- scope selection;
- verification request;
- evidence checklist;
- representation status;
- revoke-confirmation consequence.

The goal is not to remove governed information. The goal is to stop making the patient read the governance model as a document.

---

## 2. Scope reviewed

The slice delta from `b9cd86b37a72274e14501a923a51e2ed7684161a` to `ab7a4df0ccebe8443412c0191b56d7913db39f25` contains three commits and introduces the following Patient surfaces:

- `SCR-IDENTITY-005` — Family and representation
- `SCR-IDENTITY-006` — Create grant
- `SCR-IDENTITY-007` — Grant detail
- `SCR-IDENTITY-008` — Active patient context
- `SCR-IDENTITY-037` — Add dependent
- `WGT-IDENTITY-002` — Authorization grant panel
- `FLOW-IDENTITY-002` — Create representation grant
- `FLOW-IDENTITY-003` — Act as a represented Patient
- `FLOW-IDENTITY-004` — Revoke representation grant
- Patient side of `FLOW-IDENTITY-021` — Legal-basis representation request

Implementation and QA files inspected include:

- `tools/patient-ui-preview/SLICE_12_GUARDIAN_REPRESENTATION_IMPLEMENTATION.md`
- `tools/patient-ui-preview/src/screens/FamilyRepresentationScreen.tsx`
- `tools/patient-ui-preview/src/screens/CreateGrantScreen.tsx`
- `tools/patient-ui-preview/src/screens/GrantDetailScreen.tsx`
- `tools/patient-ui-preview/src/screens/ActivePatientContextScreen.tsx`
- `tools/patient-ui-preview/src/screens/AddDependentScreen.tsx`
- `tools/patient-ui-preview/src/widgets/AuthorizationGrantPanel.tsx`
- `tools/patient-ui-preview/src/components/SubjectContextHeader.tsx`
- `tools/patient-ui-preview/src/mocks/representation.ts`
- Slice 12 Storybook stories
- `tools/patient-ui-preview/playwright/slice12-representation.spec.ts`
- `tools/patient-ui-preview/playwright/capture-slice12.spec.ts`
- `tools/patient-ui-preview/package.json`

### Current CI evidence

GitHub Actions run:

`https://github.com/MustafaFares445/UperTib/actions/runs/34104740925`

Observed job result:

- dependency install: passed;
- dependency audit: passed;
- Chromium install: passed;
- typecheck: passed;
- Storybook build: passed;
- readiness smoke test: **failed**;
- Playwright/audit artifact upload: passed.

The current failure is not a subjective design disagreement. It is an automated accessibility failure on current rendered output.

---

## 3. Canonical sources consulted

Canonical authority was kept above screenshots, taste, and external references.

Primary repository sources consulted:

1. `CLAUDE.md`
2. `.claude/skills/patient-ui-preview/SKILL.md`
3. `docs/ux/PHASE_05_HANDOFF.md`
4. `docs/ux/05-build/IMPLEMENTATION_CONTRACTS.md`
5. `docs/ux/03-system/**`
6. `docs/ux/04-specs/SCREEN_SPECS_PATIENT_03.md`
7. `docs/ux/04-specs/SCREEN_SPEC_MAP.md`
8. `docs/ux/04-specs/WIDGET_SPECS_DOMAIN.md`
9. `docs/ux/01-foundation/USER_FLOWS.md`
10. `docs/domain/PERMISSIONS_MATRIX.md`
11. `docs/api/API_CONTRACTS.md`
12. `tools/patient-ui-preview/SLICE_12_GUARDIAN_REPRESENTATION_IMPLEMENTATION.md`
13. historical Patient UX reviews and research reports under `tools/patient-ui-preview/`

Key canonical constraints preserved in this review:

- Patient UI is Arabic-first, RTL-first, smartphone-first and light-only V1.
- Internal authorization mechanics and unrelated clinical/financial internals must not leak into Patient UI.
- A dependent verification request is not a grant.
- A guardian does not self-authorize.
- Switching display context does not create or expand authority.
- The acting person and subject Patient remain distinguishable under representation.
- Revocation stays reachable and does not delete historical attribution.
- Unknown scope is never interpreted as full scope.
- All governed scope dimensions remain explicit before an adult-consent grant is committed.

---

## 4. Repository skills used as review lenses

The review applied the repository guidance from:

- `patient-ui-preview` — scope, Patient safety semantics, RTL and visual-evidence requirements;
- `design-review` — weighted design review and Nielsen heuristics;
- `redesign` — Scan / Diagnose / Direct only; no implementation application;
- `design-qa` — rendered QA, accessibility and visual-regression expectations;
- `a11y-audit` — WCAG 2.2 and role/name/state checks;
- `prototype` — journey, decision path and edge-state coverage;
- `design-component` — component state, interaction and render-and-look review;
- `design-tokens` — token-source and no-ad-hoc-system review;
- `ux-writing` — concise, contextual and state-appropriate copy review.

The requested specialist lenses were executed independently during analysis and then reconciled adversarially: healthcare UX, visual/interaction design, Arabic RTL/accessibility, external benchmark research, and final challenge review. This execution environment does not expose a separate subagent runtime, so no claim is made that autonomous subagent processes were launched.

---

## 5. UI UX Pro Max advisory pass

`ui-ux-pro-max` was searched for in the available execution environment and was **not installed / not available**. It therefore was not run and no generated recommendation from that skill is claimed.

Disposition:

- UI UX Pro Max output: **NOT AVAILABLE**
- Canonical UberTib sources: used
- repository design skills: used
- current rendered CI evidence: used
- external authoritative references: used as advisory evidence only

No missing advisory skill was allowed to change or weaken the final verdict.

---

## 6. External research used

External evidence was used only to assess presentation and interaction patterns. It does not redefine UberTib authorization rules.

### Apple — Right to left

`https://developer.apple.com/design/human-interface-guidelines/right-to-left`

Relevant guidance: RTL interfaces should adapt to the script direction, direction-sensitive navigation controls should mirror, and mixed Latin/RTL content needs careful visual balancing.

UberTib adaptation: retain the current Arabic-first RTL model; verify directional icons and mixed date/time or identifier runs in actual 320/390/414 captures.

### Apple — Accessibility

`https://developer.apple.com/design/human-interface-guidelines/accessibility`

Relevant guidance: controls should be comfortably sized and spaced; Apple lists 44 x 44 pt as its default iOS control size and 28 x 28 pt as its minimum.

UberTib adaptation: current rendered failed DOM shows `min-height: 24px` on the custom checkbox controls. That is not declared here as a native WCAG failure, but it is a mobile-ergonomics risk and should be verified on native targets rather than treated as complete because the web minimum exists.

### W3C WCAG 2.2

`https://www.w3.org/TR/WCAG22/`

Relevant guidance: role/name/value and state semantics, Focus Not Obscured, and Target Size remain applicable review concerns.

UberTib adaptation: the current Axe failure is directly relevant to WCAG 4.1.2 because checkbox-role elements lack the required programmatic checked state in the rendered web preview.

### NHS App — Family and carer access

`https://www.nhs.uk/nhs-app/help/profile/family-and-carer-access/`

`https://digital.nhs.uk/services/nhs-app/toolkit/step-by-step-guide`

Relevant pattern: when acting for another person, the NHS App keeps the proxy user in their own account, shows a persistent “acting for” context with the represented person’s name, and provides an explicit route back to the proxy’s own profile.

UberTib adaptation: this supports the canonical UberTib actor-versus-subject distinction. It also supports a **compact persistent representation-context object** rather than repeating the same identity-safety explanation in multiple paragraphs on every switching surface. The NHS color and visual treatment should not be copied.

### NHS — Proxy access setup and human review

`https://www.nhs.uk/nhs-services/gps/health-services-for-someone-else-family-carer-access/how-to-get-family-carer-access-adults/`

Relevant pattern: access may require identity proof, consent where applicable, and a practice decision about what access is appropriate.

UberTib adaptation: this is consistent with keeping adult consent and legal-basis/dependent review as different paths. It does not define UberTib policy.

### Nielsen Norman Group — Progressive disclosure and cognitive load

`https://www.nngroup.com/articles/progressive-disclosure/`

`https://www.nngroup.com/articles/4-principles-reduce-cognitive-load/`

Relevant guidance: primary tasks and common choices should remain immediately visible while secondary or advanced detail can be disclosed when needed; long complex forms can be made more manageable by staging or progressive disclosure.

UberTib adaptation: keep all legally controlling scope visible before the commit, but do not show every explanation and historical detail with equal weight throughout every earlier step.

---

## 7. Rendered evidence inspected

### Actual current-head evidence available

The current main GitHub Actions artifact was downloaded and inspected.

Rendered failure screenshots inspected:

- `SCR-IDENTITY-006 Create grant — Ready`, `patient-390`
- `SCR-IDENTITY-037 Add dependent — Ready for verification`, `patient-390`
- `SCR-IDENTITY-037 Add dependent — Evidence rejected`, `patient-390`

Associated Playwright error contexts and traces were also inspected.

### What the 390 px renders show

`SCR-IDENTITY-006` above the fold is dominated by:

- eyebrow;
- large two-line task title;
- explanatory consent paragraph;
- subject label and name;
- another authorization warning/helper paragraph;
- grantee input and helper;
- large section heading;
- explanatory helper;
- stacked full-width checkbox-like rows;
- another large heading and another stacked list.

The task is understandable, but the screen visually behaves as a long explanatory form rather than as a permission-building interaction.

`SCR-IDENTITY-037` above the fold is dominated by:

- eyebrow;
- large two-line title;
- long paragraph explaining that submission does not grant access;
- a large inset information block repeating that this is not a grant;
- multiple labels, input fields and helper paragraphs.

The safety semantics are correct. Their presentation is unnecessarily repetitive and document-like.

### Evidence gap

A complete current-head 320/390/414 screenshot set was **not** available in the CI artifact. `capture-slice12.spec.ts` is explicitly opt-in with `CAPTURE=1` and therefore does not satisfy the mandatory visual-evidence requirement during the normal verification job.

Consequently:

- 390 visual evidence: inspected;
- 320 visual evidence: **not verified on current head**;
- 414 visual evidence: **not verified on current head**;
- horizontal overflow assertions at other widths are not a substitute for looking at the pixels.

This evidence gap blocks final visual approval even if the accessibility failure is fixed.

---

## 8. Per-screen review

### SCR-IDENTITY-005 — Family and representation

**States reviewed:** Default, ScopeUnknown, Empty from story/code; no current-head screenshot available in the downloaded CI artifact.

**Primary user goal:** understand who can act for whom, open a permission, create a permission, or switch represented Patient.

**Dominant visual object:** currently repeated full `AuthorizationGrantPanel` records.

**Primary action:** create grant when available; switching context is secondary.

**Three-second comprehension:** **PARTIALLY CLEAR**. The two directions are named clearly, but the default mock renders four large grant records across three sections. The patient must scan extensive scope content before the page becomes a manageable overview.

**Newspaper test:** **FAIL — high-confidence structural finding, pending rendered confirmation.** The composition is heading + helper + full record card, repeated three times; each record itself contains several labels, bullet lists, dates, basis, history and helper copy.

**Visual hierarchy:** the direction split is good, but overview and detail are collapsed into the same surface.

**Glanceability:** weak for a list surface because every grant exposes full scope detail.

**Cognitive load:** high in the default fixture: active given grant, active held grant, expired grant and revoked grant all render with near-complete record detail.

**Progressive disclosure:** insufficient. History and detailed scope are all expanded by default.

**Interaction feedback:** clear open-action affordance where scope is resolved; unresolved scope correctly removes the open action.

**Emotional fit:** neutral and safe.

**RTL:** source uses governed Patient layout; current-head visual confirmation at 320/414 remains missing.

**Accessibility:** the grant panel has an accessible label and fail-closed unresolved-scope state; full screen needs actual cross-width and assistive-device verification.

**Cross-screen consistency:** the same grant widget provides reliable semantics across Family and Grant Detail, but the list surface is too detailed for its job.

**Top issue:** Family acts like a stack of permission documents rather than a family/representation overview.

**Recommended direction:** keep the two directions explicit, but use a compact grant-summary object on the overview: counterpart identity, direction, governed state, concise scope summary, effective period, and a clear details action. Keep the complete scope in Grant Detail. If `WGT-IDENTITY-002` canonically requires all scope facts fully expanded on `SCR-IDENTITY-005`, this compaction requires an upstream widget/spec clarification rather than a silent implementation change.

---

### SCR-IDENTITY-006 — Create grant

**States reviewed:** Ready rendered at 390; Incomplete and OpenEndedExplicit inspected from stories/code.

**Primary user goal:** grant a specific person a specific scope over the Patient’s own record with informed consent.

**Dominant visual object:** currently a long form with stacked text choices.

**Primary action:** `إنشاء الصلاحية بهذا النطاق`.

**Three-second comprehension:** **PARTIALLY CLEAR**. The title says what the screen is for, but the action is far below the fold and the patient initially encounters explanations rather than a compact scope-building model.

**Newspaper test:** **FAIL**.

**Visual hierarchy:** headings are strong but almost every section has similar weight. The patient sees “who”, “what can they do”, “what data”, “purpose”, “duration”, and then a full repeated review block; the screen reads serially rather than as one permission object being constructed.

**Glanceability:** moderate-to-low. Selected values are visible, but the literal tick character, repeated bold labels and bordered rows dominate the visual language.

**Cognitive load:** high because selections are repeated again in the full “review scope” block and multiple helper paragraphs restate the no-broad-default rule.

**Progressive disclosure:** the final governed scope must remain fully readable before commit, but explanatory helper text and duplicated summaries can be reduced or relocated.

**Interaction feedback:** selection appears visually, but current web semantics fail the accessibility state gate.

**Emotional fit:** neutral, appropriately serious.

**RTL:** visually correct in the inspected 390 screenshot. 320/414 are not visually verified.

**Accessibility:** **BLOCKED**. Current Axe run reports critical missing `aria-checked` for every rendered checkbox-role option, including duration choices.

**Cross-screen consistency:** action/data-scope labels match the representation model, but selection control presentation must use the governed Patient icon/control vocabulary rather than a text tick glyph.

**Top issue:** a correct consent model is being presented as a long policy form.

**Recommended direction:** recompose into a permission builder without changing the contract: strong grantee identity block; compact action selector; compact data-scope selector; purpose and duration; then one clear final scope receipt immediately before the create action. Keep required controlling information but remove repeated tutorial copy from the default reading path.

---

### SCR-IDENTITY-007 — Grant detail

**States reviewed:** Active and RevokedHistory from code/stories; no current-head visual screenshot in the downloaded artifact.

**Primary user goal:** read one permission and, when active, revoke it safely.

**Dominant visual object:** complete AuthorizationGrantPanel plus a second explanatory revoke panel.

**Primary action:** revoke permission when active.

**Three-second comprehension:** **PARTIALLY CLEAR**. The screen title and destructive action are understandable, but the actual decision is surrounded by repeated prose explaining revocation invariants.

**Newspaper test:** **FAIL — structural, pending rendered confirmation**.

**Visual hierarchy:** the detailed grant and the “what revocation means” block both carry substantial visual weight before confirmation.

**Glanceability:** the grant scope is complete but not concise.

**Cognitive load:** moderate-to-high for a destructive decision because the consequences appear as several sentences plus helper text.

**Progressive disclosure:** the full grant is appropriate here; the revoke consequences can be condensed into a short consequence summary and expanded explanation if needed.

**Interaction feedback:** two-stage revoke behavior exists. Confirmation content appears after the first destructive press.

**Emotional fit:** destructive role is appropriately separated from normal read state, but the consequence block is verbose.

**RTL:** source structure is compatible; visual verification incomplete.

**Accessibility:** explicit confirmation is present; focus behavior and sticky-footer focus visibility are not verified on current head.

**Cross-screen consistency:** this is the right location for the full grant scope that is currently over-repeated on the Family overview.

**Top issue:** too much explanation surrounds a simple high-stakes decision.

**Recommended direction:** preserve the full grant record, then summarize revoke consequences in three patient-readable facts: future authority stops now; existing care/claims are not deleted; historical actions remain attributed. Confirmation should restate the exact action and represented parties.

---

### SCR-IDENTITY-008 — Active patient context

**States reviewed:** Default and NoActiveGrant from code/stories; no current-head visual screenshot in the downloaded artifact.

**Primary user goal:** choose which Patient the signed-in guardian will represent.

**Dominant visual object:** currently explanatory identity blocks plus full-scope Patient option cards.

**Primary action:** switch to a represented Patient.

**Three-second comprehension:** **PARTIALLY CLEAR**. The title says “choose the record”, but the patient options arrive after a long description, subject-context block, and another paragraph explaining attribution.

**Newspaper test:** **FAIL — structural, pending rendered confirmation**.

**Visual hierarchy:** the safety explanation competes with the actual person-selection task.

**Glanceability:** each Patient option repeats actions and data-scope bullets before its switch button.

**Cognitive load:** unnecessarily high for a selection screen.

**Progressive disclosure:** the user needs to know the represented Patient and enough scope to avoid choosing the wrong context, but full action/data lists need not dominate every option if a concise governed scope summary can represent them safely.

**Interaction feedback:** button labels are specific to each Patient.

**Emotional fit:** calm and neutral.

**RTL:** source structure is compatible; visual verification incomplete.

**Accessibility:** specific button names are a positive. Native focus/announcement behavior after switching requires device verification.

**Cross-screen consistency:** the acting-vs-subject model is correct. External NHS proxy patterns reinforce the value of keeping this identity context as a persistent compact banner after switching rather than repeatedly explaining the rule as prose.

**Top issue:** the selection task is buried under authorization explanation.

**Recommended direction:** lead with “you are acting as X” context, then show represented Patient options as identity-first objects with concise allowed-scope summary and the switch action. Move extended authorization explanation behind a “How representation works” disclosure while keeping the two identities persistent after switching.

---

### SCR-IDENTITY-037 — Add dependent / legal-basis representation request

**States reviewed:** ReadyForVerification rendered at 390; EvidenceRejected rendered at 390; EvidenceScanning, EvidenceRetryableFailure, Submitted, ChangesRequested, Approved and Rejected inspected from stories/code.

**Primary user goal:** submit a representation request with required evidence for accountable human review.

**Dominant visual object:** currently a long explanatory form.

**Primary action:** `إرسال طلب التحقق` or resubmit after requested changes.

**Three-second comprehension:** **PARTIALLY CLEAR**. The patient understands that this is not immediate authorization, but that distinction is repeated so strongly that it overshadows the actual job of identifying the dependent, choosing requested scope, and supplying evidence.

**Newspaper test:** **FAIL**.

**Visual hierarchy:** large title, explanatory paragraph, large inset “this is not a grant” block, labels, helpers, scope lists, evidence, and a final “what happens next” numbered document create too many equal reading layers.

**Glanceability:** low at the top of the form. The request itself is not yet represented as a recognizable verification-request object.

**Cognitive load:** high. The same safety meaning appears in the header description, dedicated information block, post-submit explanation and final next-steps block.

**Progressive disclosure:** the controlling consequence “submission does not grant authority” should remain visible once and near the commit action. Longer process explanation can be secondary.

**Interaction feedback:** evidence states are semantically strong: scanning, retryable transfer failure, authoritative rejection, accepted evidence and submission remain distinct.

**Emotional fit:** the wording is safe but over-defensive. The normal legal-basis application should feel like a calm verification process, not a repeated warning.

**RTL:** correct in the inspected 390 screenshots. 320/414 are not visually verified.

**Accessibility:** **BLOCKED** by the same critical missing `aria-checked` state on custom checkbox-role controls. Evidence state semantics themselves are well differentiated in test coverage.

**Cross-screen consistency:** consent and legal-basis flows are correctly separated. The visual system should also make them different objects: “permission I am granting now” versus “verification request I am submitting for review”.

**Top issue:** correct safety rules are expressed as repeated prose rather than through the structure of a verification-request flow.

**Recommended direction:** create a clear verification-request composition: dependent identity; relationship/basis; requested permissions; required evidence checklist; concise review/submit object. State once, immediately before submit, that submission creates a review request and not authority. After submission, replace form prose with a strong request-status object and next expected step.

---

## 9. Newspaper test summary

| Screen / state | Result | Reason |
|---|---|---|
| `SCR-IDENTITY-005` Family default | FAIL, rendered confirmation pending | Three text-led regions containing repeated full record panels; overview and detail are not separated. |
| `SCR-IDENTITY-006` Ready at 390 | **FAIL** | Large heading, several helper paragraphs, stacked text controls and repeated scope review make the screen read like a policy form. |
| `SCR-IDENTITY-007` Active | FAIL, rendered confirmation pending | Full record plus multi-paragraph consequence explanation before a destructive action. |
| `SCR-IDENTITY-008` Default | FAIL, rendered confirmation pending | Selection task follows repeated identity/authorization explanation and full-scope bullet lists. |
| `SCR-IDENTITY-037` Ready at 390 | **FAIL** | Header explanation + large explanatory card + helper-heavy fields + further process explanation. |
| `SCR-IDENTITY-037` Evidence rejected at 390 | **FAIL** | Evidence semantics are correct, but the surrounding screen retains the same document-heavy composition. |
| `SCR-IDENTITY-037` Submitted | PARTIAL, rendered confirmation pending | State semantics are concise compared with the form, but current evidence is not enough for a visual PASS. |

The systemic issue is not “too many words” in isolation. It is that explanatory text, primary decision data, safety semantics and interactive choices share too much of the same visual vocabulary.

---

## 10. Three-second comprehension summary

This is a qualitative expert check, not a timed user study.

| Screen | Where am I? | What matters now? | What next? | Result |
|---|---|---|---|---|
| Family / representation | Clear | Partially clear due to record density | Partially clear | PARTIALLY CLEAR |
| Create grant | Clear | Partially clear; scope builder is long | Primary action is below fold | PARTIALLY CLEAR |
| Grant detail | Clear | Partially clear; scope and revoke explanation compete | Revoke/back available | PARTIALLY CLEAR |
| Active patient context | Clear | Partially clear; selection comes after explanation | Select represented Patient | PARTIALLY CLEAR |
| Add dependent | Clear | Partially clear; safety warning dominates | Form completion then submit | PARTIALLY CLEAR |
| Submitted dependent request | Clear from state labels | Clear | Wait for review | CLEAR semantically; visual evidence incomplete |

---

## 11. Cognitive-load review

### Keep visible

- acting person and subject Patient where representation applies;
- direction of each permission: given vs held;
- governed state;
- the scope that controls the action being committed;
- explicit “request, not grant” consequence at dependent-request commit;
- evidence requirement state and authoritative rejection reason;
- revocation consequence;
- destructive confirmation.

### Summarize

- full grant scope in Family list rows;
- full action/data lists on represented-Patient selection cards;
- historical attribution copy on overview surfaces;
- general explanation of what representation means after the identity context already makes it visible.

### Visualize as application objects

- Permission summary
- Represented Patient identity
- Verification request
- Evidence checklist
- Request status
- Scope receipt before commit
- Revocation consequence summary

### Move near action

- “submission does not create authority” on `SCR-IDENTITY-037`;
- final scope consequence on `SCR-IDENTITY-006`;
- revoke consequence on `SCR-IDENTITY-007`.

### Progressively disclose

- longer explanations of representation mechanics;
- complete historical attribution explanation on list surfaces;
- secondary process details such as the full description of the human-review path;
- full scope from a Family overview if the widget/spec permits a compact list variant.

### Remove as duplicate

Without changing legal meaning, remove repeated copies of the same safety statement when the same point is already visible next to the committing action.

The most obvious case is `SCR-IDENTITY-037`, where “this does not create a grant” is restated in the header, an information block, later process copy and submitted-state explanations.

---

## 12. Emotional-state review

| Meaning | Current review | Recommendation |
|---|---|---|
| Adult consent grant | Appropriate seriousness, too much instructional prose | Calm permission-builder tone; explicit final scope receipt before commit. |
| Legal-basis request draft | Over-defensive | Calm application/verification tone; one clear safety consequence near submit. |
| Evidence scanning | Correctly distinct from rejection | Preserve. |
| Retryable evidence transfer failure | Correctly not presented as authoritative rejection | Preserve. |
| Evidence rejected | Correctly authoritative and replacement-oriented | Preserve semantics; strengthen visual object treatment. |
| Submitted request | Correctly not success/grant | Present as a calm “under review” request object. |
| Approved request | Correctly explains that an approved grant now exists | Link visually to the resulting permission record. |
| Revocation | Correctly destructive | Condense consequence explanation and keep explicit confirmation. |
| Represented context | Correctly preserves actor identity | Make the active context persist visually throughout represented actions. |

No finding recommends changing lifecycle or authorization semantics.

---

## 13. Progressive-disclosure review

The current implementation is safer than an under-explained authorization UI, but it frequently solves safety by leaving all explanation expanded at once.

The correct target is **not** to hide controlling scope or consequences. It is to separate three layers:

### Primary layer

- who is acting;
- for whom;
- current state;
- requested/granted actions;
- requested/granted data scope;
- the one current task.

### Secondary layer

- purpose;
- effective period;
- concise explanation of why the state exists;
- historical status detail.

### Advanced / explanatory layer

- why switching context grants nothing;
- full historical attribution explanation;
- detailed process explanation for legal-basis review;
- policy-like explanations that are useful for reassurance but not needed to execute the current step.

On the final commit step, the complete governed scope must return to the primary layer so informed consent is not weakened.

---

## 14. Six-dimension design review

The repository rubric requires six dimensions. Numbers below are expert review judgments based on current evidence; they are not WCAG or performance measurements.

| Dimension | Weight | Review | Evidence |
|---|---:|---|---|
| Visual Hierarchy | 20% | 4.5 / 10 | Rendered Create Grant and Add Dependent surfaces remain text-led with many equal-weight headings/helpers/rows. |
| Consistency | 20% | 6.5 / 10 | Strong token/system reuse and consistent semantics; literal tick glyph and list/detail overuse weaken governed component consistency. |
| Accessibility | 20% | 2.5 / 10 | Current CI has a critical Axe WCAG 4.1.2 failure on checkbox-role controls. Native accessibility is not verified. |
| Usability | 20% | 5.0 / 10 | Core tasks and safety meaning are understandable, but cognitive load and repetition bury the primary action. |
| Responsiveness | 10% | 5.0 / 10 | 390 screenshot reflows; complete 320/414 visual evidence is missing on current head, so approval is incomplete. |
| Performance | 10% | **Not verified** | Build completion is not a performance measurement. No current render/jank/performance evidence was inspected. |
| Weighted overall | 100% | **Not reportable without inventing a Performance score** | The current verdict already fails on objective accessibility and required visual-evidence gates. |

This deliberately avoids fabricating a performance number solely to produce an overall score.

---

## 15. Nielsen heuristic review

| Heuristic | Result | Evidence |
|---|---|---|
| H1 Visibility of system status | PASS semantically | Grant/request/evidence states are explicit and authoritative-vs-transport states are distinct. |
| H2 Match between system and real world | PARTIAL | The authorization model is correct, but the patient sees legal/governance explanation more than familiar permission/request objects. |
| H3 User control and freedom | PASS semantically | Cancel, switch, back and unconditional revoke routes exist. |
| H4 Consistency and standards | FAIL currently | Rendered checkbox role lacks its required programmatic state; text tick glyph violates the governed UI rule. |
| H5 Error prevention | STRONG | No implicit “all” scope, open-ended duration must be explicit, dependent request cannot self-authorize. |
| H6 Recognition rather than recall | PARTIAL | Choices remain visible, but overview screens present too much full-detail content instead of concise recognizable objects. |
| H7 Flexibility and efficiency | PARTIAL | Rare high-stakes flows favor safety correctly, but repeated explanation makes returning users re-read the same material. |
| H8 Aesthetic and minimalist design | FAIL | Excessive prose, helper copy, repeated record panels and equal-weight sections produce the newspaper effect. |
| H9 Help users recognize/recover from errors | PASS semantically | Evidence scanning, retryable failure, rejection and replacement paths are meaningfully distinct. |
| H10 Help and documentation | OVER-SUPPLIED IN CORE FLOW | Guidance is present, but too much of it is embedded directly in the primary task rather than being contextual/progressive. |

---

## 16. Prioritized findings

| ID | Severity | Screen / State | Width | Problem | Patient impact | Evidence | Recommended correction | Authority |
|---|---|---|---:|---|---|---|---|---|
| S12-B01 | **BLOCKER** | `SCR-IDENTITY-006`, `SCR-IDENTITY-037` checkbox selections | 390 rendered web | `role="checkbox"` elements lack required rendered `aria-checked`; Axe reports critical `aria-required-attr` / WCAG 4.1.2. | Assistive technology does not receive required selected-state semantics; current CI fails. | Main Actions run 34104740925 Playwright error contexts. | Fix the RN Web adapter/component so rendered checkbox controls expose programmatic checked state. Add DOM-level assertions for checked/unchecked state and rerun Axe. Do not rely on source `accessibilityState` if the current adapter drops it. | `a11y-audit`, WCAG 4.1.2, current CI. |
| S12-B02 | **BLOCKER — APPROVAL EVIDENCE** | Entire Slice 12 | 320 / 414 | Mandatory visual widths were not actually captured/inspected on the current head; capture suite is opt-in. | Visual clipping, hierarchy or RTL defects can survive automated overflow checks. | `capture-slice12.spec.ts`; current artifact contains 390 failure evidence only. | Run `CAPTURE=1` visual capture at 320/390/414 for every material state, then inspect the PNGs before approving. | `patient-ui-preview`, review prompt. |
| S12-M01 | **MAJOR** | `SCR-IDENTITY-006 Ready` | 390 observed | Long document-like form; explanatory copy, scope controls and final scope review repeat the same model. | Patient must read sequentially rather than construct and recognize one permission object. | Current 390 screenshot + source. | Recompose as permission builder with one strong final scope receipt. Keep all controlling scope before commit, reduce duplicate tutorial copy. | Canonical scope + progressive-disclosure guidance. |
| S12-M02 | **MAJOR** | `SCR-IDENTITY-037 Ready` | 390 observed | “Request, not grant” meaning is repeated in several large text regions. | Safety explanation dominates the actual task and increases stress/cognitive load. | Current 390 screenshot + source. | Use a verification-request object and state the no-authority consequence once near submit; defer longer process explanation. | Canonical legal-basis semantics + UX writing. |
| S12-M03 | **MAJOR** | `SCR-IDENTITY-005 Default` | Visual capture missing; source structural evidence | Family overview renders complete grant details repeatedly across given/held/history sections. | The overview becomes a stack of records rather than a scannable family/representation surface. | `FamilyRepresentationScreen.tsx`, `AuthorizationGrantPanel.tsx`, default fixtures. | Create/reuse a compact grant-summary presentation for list context; full scope lives in detail. If current widget contract forbids this, escalate for upstream spec clarification. | Canonical direction separation; progressive disclosure. |
| S12-M04 | **MAJOR** | `SCR-IDENTITY-008 Default` | Visual capture missing; source structural evidence | Actual Patient-selection task is preceded by multiple paragraphs about authority; each option repeats full scope bullets. | Switching context takes more reading than necessary and the person identity is less dominant than policy explanation. | `ActivePatientContextScreen.tsx`. | Lead with acting/subject identity and person options; use concise scope summaries and persistent represented-context treatment. | Canonical actor/subject distinction; NHS proxy pattern advisory. |
| S12-M05 | **MAJOR — DESIGN SYSTEM** | Create Grant / Add Dependent choice controls | 390 observed | Selected labels embed a literal U+2713 tick character in text. The repo’s current design rules explicitly prohibit decorative dingbat/tick glyphs and Patient icon vocabulary is governed. | Selection looks improvised and bypasses the component/icon system; it also does not solve programmatic state. | `CreateGrantScreen.tsx`, `AddDependentScreen.tsx`, `CLAUDE.md`. | Replace text glyph with the governed Patient icon/control implementation and keep the accessible checked state independent of the visual icon. | Repository design-system rule + Patient skill. |
| S12-N01 | MINOR | `SCR-IDENTITY-007 Active` | Not visually captured on current head | Revocation consequence is explained in several sentences and repeated helper copy. | High-stakes action requires more reading than necessary. | `GrantDetailScreen.tsx`. | Condense to three consequence facts and keep explicit confirmation. | UX writing / progressive disclosure. |
| S12-N02 | MINOR — VERIFY | choice controls | 390 rendered web | Failed DOM shows `min-height: 24px` on checkbox-role controls. This is at the WCAG CSS minimum but below Apple’s normal mobile-control recommendation and needs native verification. | Potential tap comfort issue, especially for motor accessibility. | Axe error DOM fragment + Apple HIG advisory. | Use an appropriate governed mobile target-size token if the component contract permits; verify on native iOS/Android. | Apple advisory + Patient smartphone-first requirement. |
| S12-N03 | MINOR — EVIDENCE GAP | sticky footer screens | all | Focus-not-obscured behavior under sticky actions was not verified in the evidence inspected. | Keyboard/switch users on the web preview can potentially lose visual focus behind footer content. | Current CI failure prevented complete review. | Add explicit focus-not-obscured coverage after S12-B01 is fixed. | WCAG 2.4.11 + `a11y-audit`. |

---

## 17. Recommended remediation direction

The remediation should be a **presentation recomposition**, not a business redesign.

### Direction A — Make representation context a persistent identity object

Use one consistent Patient context treatment that always answers:

- who is signed in / acting;
- whose record is active;
- whether representation is active;
- how to return to the actor’s own context.

Do not repeat a paragraph explaining this relationship on each screen when the context object already conveys it.

### Direction B — Separate overview from record detail

`SCR-IDENTITY-005` is an overview. `SCR-IDENTITY-007` is the detail.

The overview should optimize scan speed. The detail should hold the complete permission record.

If canonical `WGT-IDENTITY-002` currently forces the same full record presentation in both contexts, introduce a governed family-summary variant only after confirming/updating the widget contract.

### Direction C — Turn Create Grant into a permission builder

Keep one page if the canonical flow requires one page, but visually group it as one evolving permission:

1. person;
2. allowed actions;
3. data scope;
4. purpose/period;
5. complete scope receipt;
6. create.

The scope receipt is the safety gate. It should be visually strongest just before the commit, not one more card after several similar sections.

### Direction D — Turn Add Dependent into a verification request

Use the visual model:

1. dependent identity;
2. relationship/legal basis;
3. requested access;
4. evidence requirements;
5. review request;
6. under-review state.

State the key consequence once: submission sends a request for human review and does not create authority.

### Direction E — Preserve strong evidence-state semantics

Do not merge:

- scanning;
- retryable transfer failure;
- authoritative rejection;
- accepted evidence;
- submitted request;
- approved grant.

These are among the strongest parts of the current implementation.

### Direction F — Fix accessibility in the shared selection primitive first

Do not patch each screen independently. Both Create Grant and Add Dependent implement nearly identical custom checkbox controls. Extract or repair one governed representation-scope choice primitive that provides:

- correct programmatic selected state;
- governed visual selected icon;
- focus state;
- touch target;
- pressed state;
- disabled state where applicable;
- RTL-safe layout;
- web and native semantics.

Then rerun both screens against the same component.

---

## 18. Upstream product/spec decisions required

Most remediation can happen within existing presentation authority.

One potential upstream decision requires care:

### UPR-S12-01 — Compact Family grant summary

The current `AuthorizationGrantPanel` renders the complete scope, and the Slice implementation intentionally reuses it on Family and Grant Detail. A better overview needs a compact but unambiguous summary.

Before changing the governed widget contract, determine whether `WGT-IDENTITY-002` already permits a compact `family-summary` presentation that keeps direction, counterpart, state and sufficient scope meaning visible while the full record is one tap away.

If not, mark:

`UPSTREAM PRODUCT DECISION REQUIRED`

and update the widget/screen contract before implementing a new summary variant.

No upstream decision is needed to:

- fix `aria-checked`;
- replace the forbidden tick glyph with governed iconography;
- reduce duplicate helper copy;
- improve spacing/hierarchy;
- make request/grant objects more recognizable;
- preserve actor/subject context more strongly;
- run the missing visual evidence.

---

## 19. Native-device evidence still missing

The React Native Web / Storybook preview does **not** prove:

- VoiceOver behavior;
- TalkBack behavior;
- native focus traversal;
- native Dynamic Type / font scaling;
- native safe-area behavior;
- native keyboard behavior;
- native touch-target geometry;
- native bidi behavior for every OS text renderer;
- real-device performance/jank;
- production authorization enforcement.

These remain:

**Requires native-device verification.**

The current web accessibility blocker must still be fixed first; native testing is not a substitute for a failing web preview gate.

---

## 20. Final approval recommendation

### A. Is the implementation functionally understandable?

**Yes, mostly.** The business/authorization meaning is unusually careful and the state distinctions are strong.

### B. Is it visually professional?

**Not yet.** The two current 390 renders inspected still look like long explanatory forms rather than refined healthcare mobile interactions.

### C. Does it feel like a native mobile product rather than a responsive document?

**No, not consistently.** Create Grant and Add Dependent visibly retain the responsive-document/newspaper pattern.

### D. Is cognitive load acceptable for a Patient?

**Not yet.** Too much repeated authorization explanation is shown at primary visual weight.

### E. Is hierarchy clear without reading every line?

**No.** The patient often has to read headings and helper text serially to understand the same distinction that should be apparent from the object/state composition.

### F. Is the next action obvious?

**Partially.** Titles are clear, but primary actions on long forms are below extensive content and supporting explanation.

### G. Are lifecycle and authorization states emotionally appropriate?

**Mostly yes.** Evidence and request states are semantically good. The draft legal-basis flow is too defensive in tone and presentation rather than calm and procedural.

### H. Does the slice deserve approval before continuing implementation?

**No.**

Approval is blocked by:

1. a current critical rendered accessibility failure;
2. missing complete current-head 320/390/414 visual evidence;
3. major cognitive-load and newspaper-pattern problems on core authorization forms;
4. list/detail hierarchy problems in the representation overview;
5. a governed design-system violation in the selected-choice presentation.

### Required closeout gate

Before Slice 12 can move to PASS:

1. fix the shared checkbox selected-state semantics and rerun Axe successfully;
2. remove the literal tick glyph and use the governed Patient control/icon system;
3. recompose Create Grant and Add Dependent around permission/request objects rather than repeated prose;
4. reduce Family and Active Patient Context density without weakening scope/identity safety;
5. capture and manually inspect all material states at 320, 390 and 414;
6. verify sticky-footer focus visibility and high-risk interaction states;
7. rerun typecheck, Storybook build, Slice 12 Playwright, and full Patient smoke gate;
8. perform native-device accessibility validation later at the production/native gate.

Until those gates pass, the appropriate verdict remains:

# FAIL — MAJOR RECOMPOSITION REQUIRED
