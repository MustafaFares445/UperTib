# UberTib Patient UI — Independent Senior UI/UX Review of Slices 1–12

Date: 2026-09-08

Reviewer role: independent Principal Healthcare Mobile UI/UX Designer

Review stage: adversarial cross-slice review before Patient preview approval

Repository branch: `main`

Repository head at review start: `9524b5151bf4fdd777a951ab7d7801cca2b83aa5`

Product implementation merge head: `25e5a2444a8dc83feee9be59276f523a04f1051c`

Scope: **all implemented Patient UI Preview slices, Slice 1 through Slice 12**

Overall verdict: **FAIL — CROSS-SLICE UI/UX REMEDIATION REQUIRED BEFORE PATIENT PREVIEW APPROVAL**

No product implementation files were changed during this review.

---

## 1. Executive verdict

The Patient preview is not one uniformly weak design. It contains two visibly different quality levels.

**Slice 1 is the reference-quality direction.** Its post-remediation provider-discovery and booking journey has actual 320/390/414 visual evidence, uses recognizable provider and appointment objects, gives the patient obvious interactions, distinguishes lifecycle emotions, and no longer reads like a sequence of documents inside cards.

Several later slices preserve the product semantics well but regress toward a documentation-first composition: `ScreenHeader` + explanatory paragraph + subject/context text + bordered record + helper paragraph + another bordered record + form + consequence paragraph. That pattern is especially pronounced in financial terms, review appeals, claims, protection claims, and guardian/representation. The application explains its policy model repeatedly instead of making the interaction model carry more of the meaning.

The current branch also has an objective release blocker. The latest Patient UI Preview workflow on the product merge head fails its smoke gate because Slice 12 custom checkbox-role controls render without the required checked-state ARIA attribute in React Native Web. TypeScript and Storybook build pass, but the critical accessibility failure means the complete preview cannot be approved.

A second approval blocker is evidence completeness. Slice 1 has independent 320/390/414 visual evidence. Most later `capture-slice*.spec.ts` suites are opt-in with `CAPTURE=1`; they are not part of the normal CI smoke gate. The current main CI artifact therefore does not provide a complete independent 320/390/414 screenshot set for Slices 2–12. Passing automated reflow/Axe assertions is useful Tier B evidence but does not prove that those screens are visually good.

### What should be preserved

The business and safety semantics are mostly disciplined and should not be weakened while remediating presentation:

- Patient-safe eligibility stays separate from ranking and internal S/P/H/I mechanics.
- Booking request, alternative, and confirmation meanings remain distinct.
- Accepted treatment and financial snapshots remain immutable historical records.
- Evidence transfer failure is not rejection; uploaded is not accepted.
- Financial activity remains external to UberTib V1 and is not presented as a wallet/payment engine.
- Reviews stay attached to verified experiences and do not alter scientific eligibility.
- Claims use historical governing terms/deadlines rather than current configuration.
- Representation consent, legal-basis verification, context switching, and revocation remain separate concepts.

The problem is mainly **visual composition, cognitive load, interaction representation, and cross-slice consistency**, not the domain model.

---

## 2. Evidence and review method

This review follows the repository's Patient preview authority and design-review approach:

1. canonical Phase 5 handoff and implementation contracts;
2. Phase 3 system/tokens/content rules;
3. relevant Patient screen specs and API contracts;
4. Slice implementation reports and current implementation code;
5. Storybook/Playwright coverage and measured GitHub Actions evidence;
6. existing independent Slice 1 post-implementation visual review;
7. current Slice 12 CI artifact/failure screenshots;
8. external mobile/accessibility/healthcare guidance as advisory evidence only.

Repository skills used as the review framework:

- `patient-ui-preview`
- `design-review`
- `redesign` in Scan/Diagnose/Direct mode only
- `design-qa`
- `a11y-audit`
- `prototype`
- `design-component`
- `design-tokens`
- `ux-writing`

`ui-ux-pro-max` was **not available in this execution environment**, so no new UI UX Pro Max result is claimed. The previously committed Slice 1 review contains historical UI UX Pro Max output and is treated only as prior review evidence.

### Evidence tiers in this report

- **Visual-verified:** actual rendered screenshots independently inspected at the stated widths.
- **Rendered/automated:** Storybook/Playwright/CI evidence exists, but independent current screenshots were not available for all widths/states.
- **Code/spec reviewed:** composition can be evaluated from implementation and canonical contracts, but this is not a substitute for looking at final pixels.
- **Native verification required:** VoiceOver, TalkBack, Dynamic Type, real-device safe area, keyboard behavior, and production performance.

### External advisory references checked

- Apple HIG Accessibility: https://developer.apple.com/design/human-interface-guidelines/accessibility
- Apple HIG Right to left: https://developer.apple.com/design/human-interface-guidelines/right-to-left
- W3C WCAG 2.2 updates: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
- NHS family and carer access: https://www.nhs.uk/nhs-app/help/profile/family-and-carer-access/
- NHS App step-by-step family/carer access: https://digital.nhs.uk/services/nhs-app/toolkit/step-by-step-guide

Apple's current accessibility guidance explicitly recommends minimizing complexity, removing noncritical UI, and breaking multistep workflows so a person can focus on a single interaction. The NHS proxy-access pattern also demonstrates that persistent representation context can be communicated compactly with an `Acting for` banner and profile identity instead of repeatedly restating the full authorization model on each screen. These patterns are advisory; UberTib's own authorization semantics remain authoritative.

---

## 3. Cross-slice verdict matrix

| Slice | Domain / journey | Review verdict | Primary UX concern | Evidence confidence |
|---|---|---|---|---|
| 1 | Identity → discovery → provider decision → booking | **PASS WITH MINOR POLISH** | Narrow-width currency wrapping remains | High: actual 320/390/414 visual review |
| 2 | Discovery/provider-decision follow-up | **PASS WITH MINOR POLISH** | Some defensive/ranking explanation can become quieter contextual copy | Medium-high: inherited Slice 1 composition + automated coverage |
| 3 | Treatment/case reading | **REQUIRES UI/UX REMEDIATION** | Plan acceptance and treatment reading lean back toward policy/document panels | Medium: code/spec + measured green CI |
| 4 | Stage detail and evidence | **PASS WITH MINOR POLISH** | Some helper copy can be compressed; otherwise good state/object composition | Medium-high: code/spec + measured green CI |
| 5 | Accepted financial terms + financial timeline | **REQUIRES UI/UX REMEDIATION** | Accepted terms is a long stack of cards/labels/policy text rather than one financial snapshot object | Medium: code/spec + measured historical verification |
| 6 | External financial reporting/responding | **REQUIRES UI/UX REMEDIATION** | Correct semantics are repeated through disclaimer-heavy form composition | Medium: code/spec + stacked automated coverage |
| 7 | External refund-execution record | **PASS WITH MINOR POLISH** | Form language remains somewhat compliance-heavy, but action hierarchy is disciplined | Medium-high: measured green Slice 2–7 run |
| 8 | Verified reviews | **REQUIRES UI/UX REMEDIATION + UPSTREAM PRODUCT DECISION** | Rating interaction cannot be polished while the rating scale is canonically undefined | Medium: code/spec + automated coverage |
| 9 | Review appeal | **REQUIRES UI/UX REMEDIATION** | Decision, scope, reviewer, deadline, blocks and form are presented as sequential reading cards | Medium: code/spec + automated coverage |
| 10 | Claims core/refund request | **REQUIRES UI/UX REMEDIATION** | Safe but long policy-first form with too many equal-weight explanatory regions | Medium-high: full green Slice 2–10 run |
| 11 | Protection claims + claim appeals | **FAIL — MAJOR RECOMPOSITION REQUIRED** | Highest cognitive load: entitlement, deadline, evidence, forms, blocked states and consequence all stack in one reading column | Medium: code/spec + automated coverage, visual evidence incomplete |
| 12 | Guardian/representation | **FAIL — MAJOR RECOMPOSITION REQUIRED** | Current critical a11y failure plus document-like permission forms and over-expanded grant/context content | High for blocker; medium for visual quality |

The whole preview inherits the lowest blocking condition: **full Patient UI approval is FAIL until the Slice 12 accessibility defect is fixed and the high-risk later slices are recomposed and visually re-verified.**

---

## 4. Cross-slice prioritized findings

| ID | Severity | Scope | Problem | Patient impact | Recommended correction |
|---|---|---|---|---|---|
| ALL-B01 | BLOCKER | Slice 12 / whole verification gate | Current main product merge fails the Patient UI smoke gate: checkbox-role controls in Create Grant and Add Dependent do not expose the required checked state to Axe/ARIA. | Assistive-technology semantics are incomplete and the repository's own merge-quality gate is red. | Fix the React Native Web checkbox-state output using the governed component pattern, then rerun the same gate without weakening Axe assertions. |
| ALL-B02 | BLOCKER (approval evidence) | Slices 2–12 | Current-head independent 320/390/414 screenshots are not available for every high-risk screen/state because later capture suites are opt-in. | Automated success can hide visibly poor density, clipping, hierarchy or footer problems. | Run a dedicated all-slices visual capture pass at 320/390/414 and inspect the screenshots manually before final approval. |
| ALL-M01 | MAJOR | Slices 3,5,6,8,9,10,11,12 | The Slice 1 application-object vocabulary was not consistently carried forward. Later screens revert to heading + prose + cards + helper copy. | Patients must read the interface rather than recognize and manipulate a case, snapshot, claim, appeal or permission object. | Recompose around the domain object first, then primary fact/action, then progressive disclosure. Reuse existing governed components where possible; if a genuinely new shared visual contract is required, raise it to the design-system owner rather than hardcoding one-off patterns. |
| ALL-M02 | MAJOR | Finance, claims, reviews, representation | Safety/business boundaries are repeated as prose multiple times in the same task. | Correctness is preserved, but cognitive load and visual length increase; the key action becomes harder to find. | State the controlling boundary once at the decision point, make the UI structure reinforce it, and move explanatory detail behind explicit disclosure where canonical requirements permit. |
| ALL-M03 | MAJOR | Slices 3,8,9,10,11,12 | `reading` density has often been interpreted as a long reading page even for multistep/high-effort tasks. | High-stress actions ask patients to process too many rules before interacting. | Keep one screen when the canonical screen must remain one screen, but use staged sections/progressive reveal inside it so only the next required decision is visually dominant. Do not invent new routes unless canonical UX authority approves them. |
| ALL-M04 | MAJOR | Slices 8–12 | Blocked/error/expired states are often added as another card inside an already long form shell. | The patient sees both the unavailable task and the explanation, increasing confusion and dead-looking UI. | When authoring is structurally unavailable, replace the authoring composition with one clear status/recovery object while keeping required historical context. |
| ALL-M05 | MAJOR | Slices 5,9,10,11,12 | Too many bordered surfaces are used as information architecture. | Every region appears equally important; vertical scanning is slow and the product looks template-generated. | Reserve bordered/elevated surfaces for meaningful objects or states. Use typography, spacing, icons, lists and grouped facts for ordinary structure. |
| ALL-M06 | MAJOR | Slice 8 | Product policy does not define the rating scale, so the preview uses a generic text field for `ratingValue`. | A core review interaction is ambiguous and cannot feel like a mature consumer-health review experience. | **UPSTREAM PRODUCT DECISION REQUIRED:** define the rating scale/labels/allowed values first; then implement a governed accessible selection control. Do not invent 1–5 stars in the preview. |
| ALL-M07 | MAJOR | Slice 12 | Family/representation overview expands too much scope/detail, Create Grant repeats scope in form + review block, Add Dependent repeats non-self-authorization warnings, Active Patient Context repeats full grant scope before each switch action. | Authorization feels more complex than it is; patient selection and granting are slower than necessary. | Use concise permission summaries in overview/context selection and one explicit scope review immediately before commit. Keep full historical grant detail in Grant Detail. |
| ALL-N01 | MINOR | Slice 1 | Price/currency run may wrap awkwardly at 320. | Reduced polish and scan speed. | Keep amount + currency abbreviation together while allowing qualifiers to wrap. |
| ALL-N02 | MINOR | Cross-slice | Literal selected check glyph appears in Slice 12 controls instead of governed icon vocabulary. | Visual-system inconsistency and potential platform rendering variation. | Use the governed Heroicons-backed selection treatment/component. |
| ALL-N03 | MINOR | Cross-slice | Some shared foundations still include small hardcoded layout values, e.g. a literal border width in `SubjectContextHeader`. | Token drift risk. | Route the value through canonical token aliases. |

---

## 5. Cross-slice newspaper test

Question: **Does the slice primarily feel like using an application, or reading a document?**

| Slice | Result | Reason |
|---|---|---|
| 1 | PASS | Provider identities, comparison rows, slot controls, appointment receipt/tickets and lifecycle heroes dominate. |
| 2 | PASS | Search/filter/decision interactions remain task-led; progressive disclosure was improved. |
| 3 | PARTIAL FAIL | Case navigation is task-led, but plan acceptance returns to warning panel + explanatory copy + plan facts. |
| 4 | PASS | Stage state, coverage, requirement rows and evidence states behave as recognizable objects. |
| 5 | FAIL | Accepted terms is version block + line cards + total block + four policy blocks + governing-reference list. |
| 6 | PARTIAL FAIL | Forms are actionable but carry repeated financial-boundary explanations and consequence prose. |
| 7 | PASS WITH POLISH | One specific record task with disciplined primary/secondary action hierarchy. |
| 8 | PARTIAL FAIL | Verified-experience context is useful, but rating/content form and repeated scientific-eligibility disclaimers remain text-led. |
| 9 | FAIL | Decision card, appeal-scope card, reviewer card, deadline, blocked cards and grounds form create sequential policy reading. |
| 10 | FAIL | Refund request stacks snapshot context, status, deadline, fields, evidence requirements and consequence card at similar weight. |
| 11 | FAIL | Protection claim is the clearest example of the newspaper pattern: entitlement + deadline + deadline panel + evidence panel + block + claim type + fields + retry + consequence. |
| 12 | FAIL | Permission and dependent flows repeatedly explain authorization semantics in prose and expand full scope details on overview/selection surfaces. |

---

## 6. Three-second comprehension review

This is a qualitative expert test, not a measured user-study timer.

| Slice | Where am I? | What matters now? | What next? | Result |
|---|---|---|---|---|
| 1 | Clear | Clear | Clear | PASS |
| 2 | Clear | Clear | Clear | PASS |
| 3 | Clear | Partly clear on acceptance | Clear after reading | PARTIAL |
| 4 | Clear | Clear | Clear/read-only | PASS |
| 5 | Clear | Weak on Accepted Terms because many facts compete | Clear only from footer | PARTIAL |
| 6 | Clear | Usually clear | Clear | PASS/PARTIAL |
| 7 | Clear | Clear | Clear | PASS |
| 8 | Clear | Rating interaction itself is ambiguous without policy-defined scale | Clear submit once fields are understood | PARTIAL |
| 9 | Clear | Too many prerequisite explanations compete | Grounds form appears late | FAIL |
| 10 | Clear | Eligibility/deadline/evidence/form all compete | Submit is visible but cognitively late | PARTIAL/FAIL |
| 11 | Clear | Too many simultaneous governing objects | Next action varies after long scan | FAIL |
| 12 | Clear | Grant/dependent semantics dominate over immediate task | Often clear only after reading | FAIL |

---

## 7. Slice-by-slice review

### Slice 1 — Patient booking journey

**Scope.** Identity entry/verification, catalog, provider search/results/detail/explanation/comparison, slot selection, booking review and booking detail.

**Verdict: PASS WITH MINOR POLISH.**

This slice remains the visual benchmark for the rest of the Patient app. The independent Slice 1.6 re-review inspected real 320/390/414 renders and found the previous “newspaper vocabulary” corrected: provider identity became a visual anchor, comparison became attribute-to-attribute, slot selection became an actual scheduling interaction, booking review became one appointment receipt, and REQUESTED/ALTERNATIVE_PROPOSED/CONFIRMED became emotionally distinct appointment states.

Preserve these patterns as the cross-slice design language:

- recognizable task/domain object;
- one dominant action;
- strong selected/disabled feedback;
- concise secondary explanation;
- lifecycle meaning shown visually rather than repeated as prose.

Remaining polish: keep SYP amount/currency runs intact at 320.

### Slice 2 — Discovery and provider decision follow-up

**Verdict: PASS WITH MINOR POLISH.**

The follow-up improves rather than weakens Slice 1: provider search has one dominant task, selected service is contextual, optional geographic filtering no longer looks mandatory, active area filtering is recoverable, and deeper eligibility reasoning moves to a dedicated patient-safe explanation surface.

Minor recommendation: the defensive statement that UberTib does not rank/recommend a universal best doctor should remain available but visually subordinate to actual result context. It should not become the strongest text in routine discovery.

### Slice 3 — Treatment and case reading

**Screens.** My Cases, Case Summary, Treatment Plan, Plan Acceptance, Case Timeline.

**Verdict: REQUIRES UI/UX REMEDIATION.**

The case-list and case-hub direction is good: cases behave as navigation containers and outstanding patient action is surfaced. The weak point is treatment-plan acceptance. In current code the ordinary `ready` state gives strong visual weight to a warning-toned “what happens when you accept?” panel before a relatively plain “version you will accept” block.

That reverses the desired object hierarchy. The treatment-plan snapshot/version should be the dominant object; immutability and no-money-movement meaning should be a concise consequence near the accept action. Warning treatment should be reserved for actual attention or risk states, not routine informed acceptance.

Recommended direction:

1. dominant plan/version summary object;
2. amendment delta when applicable;
3. compact permanence/consequence statement;
4. one primary accept action;
5. stale/incomplete state replaces normal acceptance emphasis rather than adding another equal-weight block.

No clinical or financial semantics need to change.

### Slice 4 — Stage detail and evidence

**Verdict: PASS WITH MINOR POLISH.**

This is one of the stronger later slices. Stage identity/state is a clear object, coverage is scannable, requirement rows pair icon + label + state + meaning, previous completion remains visible, and reopening becomes a distinct correction object. Evidence states preserve the safety-critical distinctions between transport failure/rejection and uploaded/accepted.

Polish recommendation: shorten helpers that restate provenance already communicated by screen context, and ensure the same evidence-state visual vocabulary is reused unchanged in Claims and Representation.

### Slice 5 — External financial history

**Screens.** Accepted Financial Terms and Financial Timeline.

**Verdict: REQUIRES UI/UX REMEDIATION.**

The financial semantics are excellent: immutable agreed terms, append-only external events, partial-history safety, and no wallet/payment fiction. The Accepted Financial Terms composition is not yet at the same quality level.

Current structure is effectively:

- header explanation;
- subject context;
- accepted-version card;
- list of bordered line cards;
- total card;
- four separate policy/term blocks;
- governing-reference bullet list;
- footer action.

This is a financial document rendered on mobile rather than a patient-friendly accepted-terms object.

Recommended direction: compose one recognizable accepted-terms snapshot/receipt with amount/version/date and the service lines; show the small number of controlling patient-facing terms directly; move governing references and longer explanations behind an explicit details/history disclosure if canonical requirements permit. Do not hide a controlling cancellation/refund/protection limitation.

Financial Timeline is stronger because it already centers an ordered ledger and state-aware single primary action.

### Slice 6 — External financial actions

**Screens.** Report External Payment, Financial Event Response, state-aware actions on Financial Timeline.

**Verdict: REQUIRES UI/UX REMEDIATION.**

The action model is correct and notably avoids dangerous payment semantics. The primary issue is cross-slice repetition: the UI repeatedly has to say that UberTib is recording an external fact rather than executing money movement.

That boundary must remain unmistakable, but repetition should not dominate every task. A compact, consistent “external record” context treatment can carry that meaning while the event being reported/responded to becomes the main object.

For response, the original assertion should remain the dominant record, with Patient response immediately attached as the next interaction/history fact. Avoid surrounding it with multiple disclaimer cards.

### Slice 7 — External refund-execution record

**Verdict: PASS WITH MINOR POLISH.**

The flow is narrow and appropriately constrained: approved decision context appears first, amount/currency must match exactly, missing approval removes authoring structurally, successful submission remains `REPORTED_UNCONFIRMED`, and refund-execution reporting stays secondary on the timeline.

The main polish item is copy density. Keep one concise statement that the event records external execution, then let the approved decision + exact amount/currency + occurrence time communicate the rest.

### Slice 8 — Verified reviews

**Verdict: REQUIRES UI/UX REMEDIATION + UPSTREAM PRODUCT DECISION REQUIRED.**

The verified-experience linkage and one-review rule are good. The UI cannot, however, reach a polished consumer review interaction while the canonical contract leaves the concrete rating scale undefined.

The current preview correctly refuses to invent a 1–5-star system, but the consequence is a generic text field labeled `التقييم`. That is semantically faithful but not a finished rating experience.

**UPSTREAM PRODUCT DECISION REQUIRED:** define the allowed rating values/scale and associated Patient wording. Only then should design choose a governed accessible selector. Do not solve this visually by assuming stars.

Separately, the screen repeats the scientific-eligibility separation in header/helper/consequence copy. State it once clearly; do not make the patient learn internal separation concepts repeatedly during a simple review task.

### Slice 9 — Review appeal

**Verdict: REQUIRES UI/UX REMEDIATION.**

The information order is legally/safely defensible but visually over-expanded. Current implementation presents a decision card, a full scope card with several allowed/prohibited rows, a separate independent-reviewer card, deadline, several possible blocked cards, and finally appeal grounds.

The patient should not need to read a mini policy document before reaching the interaction.

Recommended direction within the same canonical screen:

- one compact decision summary;
- a concise “you can appeal these issues / you cannot edit the review here” scope block;
- deadline adjacent to that scope;
- grounds field;
- independent-review explanation as secondary disclosure/supporting note;
- submitted/decided appeal becomes one status/history object replacing authoring.

### Slice 10 — Claims core

**Screens.** My Claims, Refund Request, Claim Detail.

**Verdict: REQUIRES UI/UX REMEDIATION.**

Deadline-first claim list is the correct recognition pattern. Claim Detail also benefits from append-only history. Refund Request is the weak composition: accepted-snapshot context, deadline, eligibility/error status, amount/reason/context fields, evidence requirements, external-execution consequence, and footer actions all coexist as similarly weighted regions.

Recommended direction:

- entitlement/request summary object first;
- deadline as the one urgency object;
- required fields;
- evidence completion as compact readiness state;
- one short consequence line immediately above the primary action;
- structurally blocked states replace authoring rather than stacking alongside it.

Do not change the accepted-snapshot or external-execution business rules.

### Slice 11 — Protection claims and claim appeals

**Verdict: FAIL — MAJOR RECOMPOSITION REQUIRED.**

This slice has the highest non-representation cognitive load. ProtectionClaimScreen currently stacks:

- protection/entitlement explanation;
- active protection card;
- deadline indicator;
- a second claim-evidence/deadline panel;
- evidence transfer panel;
- an outstanding-state block;
- claim-type block;
- requested-remedy field;
- narrative field;
- retry block when applicable;
- final “what happens if accepted?” block.

All of these meanings matter, but presenting all of them as sequential reading is not a usable high-stress Patient experience.

The remediation should turn the screen into a clearly staged task while staying in the same canonical route: **entitlement → evidence readiness → request → submit**. At any moment only the current stage should carry primary visual weight. Existing evidence-transfer states are good and should be reused, not redesigned.

Claim appeal should follow the same correction pattern as Slice 9: one original-decision object, one historical policy/deadline context, one grounds task, one append-only appeal status object.

### Slice 12 — Guardian and representation

**Verdict: FAIL — MAJOR RECOMPOSITION REQUIRED.**

The separate Slice 12 review remains applicable and is incorporated here.

Current objective blocker:

- checkbox-role controls in Create Grant and Add Dependent fail the current Axe gate because required checked-state semantics are absent in rendered output.

Major visual issues:

- Family & Representation expands complete authorization detail in overview lists rather than providing concise direction/status summaries.
- Create Grant asks the patient to work through multiple choice lists and helper paragraphs, then repeats much of the same scope again in a large review block.
- Add Dependent repeats “this does not create permission / human verification is required” in multiple separate blocks before and after the task.
- Active Patient Context makes the switch action compete with repeated full action/data-scope lists for each represented patient.
- selected choices use a literal check glyph rather than the governed icon vocabulary.

The NHS proxy-access pattern reinforces a useful presentation principle: once access exists, acting context should be persistently and compactly obvious. UberTib still needs its stricter scope semantics, but the acting person + represented patient relationship can be made persistent without reproducing the grant contract on every selection surface.

Recommended direction:

- Family overview: concise cards with person, direction, status, short scope summary, open-details action.
- Create Grant: progressive scope builder; one clear scope summary immediately before commit.
- Add Dependent: one persistent “verification request, not permission yet” treatment, then the actual identity/evidence task.
- Active Patient Context: represented person as the primary object; small scope summary; full grant detail one interaction away.
- Grant Detail remains the place for full scope/history and unconditional revoke consequence.

---

## 8. Cognitive-load and progressive-disclosure decisions

Across Slices 3–12, use the following decision rule for each information region:

| Information type | Default treatment |
|---|---|
| The object the patient is acting on | KEEP VISIBLE and make dominant |
| Immediate deadline | KEEP VISIBLE near the object/action |
| Required limitation that changes whether the action is safe/legal | KEEP VISIBLE but concise |
| Repeated explanation of a limitation already visually encoded | SUMMARIZE or REMOVE AS DUPLICATE |
| Historical provenance/audit detail | PROGRESSIVELY DISCLOSE unless canonical spec makes it primary |
| Long policy explanation | PROGRESSIVELY DISCLOSE |
| Current state/readiness | VISUALIZE with governed state object + text |
| Error/blocked reason | REPLACE the unavailable authoring region with a recovery/status object |
| Next required user step | MOVE NEAR ACTION and visually prioritize |

Progressive disclosure must never hide a controlling deadline, irreversible consequence, eligibility restriction, required evidence condition, exact financial amount/currency, or authorization scope needed to make the current decision safely.

---

## 9. Emotional-state review

### Strong patterns

- Slice 1 REQUESTED is calm rather than alarming.
- Slice 1 ALTERNATIVE_PROPOSED uses attention without failure semantics.
- Slice 1 CONFIRMED uses restrained success.
- Slice 4 differentiates transfer failure, review rejection, uploaded, scanning and accepted.
- Review/claim appeal `DECIDED` is correctly neutral; outcome belongs in reasoned text, not automatic success/error color.

### Patterns to correct

- Slice 3 uses a warning-toned consequence panel for routine plan acceptance; attention treatment should be reserved for a true caution condition.
- Claims/representation blocked states should not all look like generic alert cards. Expired, not eligible, unreadable data, retryable failure and permission denial have different meanings and recovery.
- Financial-record forms should not look like payment-failure/success flows; current semantic wording is good, but visual treatments must remain record-oriented.

---

## 10. Accessibility and RTL review

### Current measured blocker

The current main product merge does **not** pass the repository's own accessibility gate due to Slice 12 checkbox-state semantics.

### Previously measured positive evidence

- Slice 4 previously caught and fixed an unnamed determinate progressbar; the same serious/critical Axe gate later passed.
- Slice 7 recorded a green run covering Slice 2–7.
- Slice 10 implementation head recorded a full green run covering Slice 2–10.

Those historical green runs are valuable evidence for those exact heads. They are not a substitute for the current all-slices head being green.

### RTL

The repository consistently targets Arabic-first RTL, Western ASCII digits, bidirectional isolation for dates/times/currency, and no horizontal page scroll. Apple HIG supports mirroring directional navigation while preserving semantic direction for real-world directional icons.

Current review did not identify a new cross-slice RTL business error, but final visual approval still requires real screenshots at 320/390/414 because mixed Arabic, dates, currency and long CTA labels can fail visually without producing horizontal overflow.

### Native evidence still missing

Requires native-device verification:

- VoiceOver;
- TalkBack;
- native Dynamic Type/font scaling;
- real safe-area/footer interaction;
- native keyboard behavior;
- real device focus/assistive gesture behavior;
- production performance/jank.

---

## 11. Six-dimension design review

The repository rubric requires Visual Hierarchy, Consistency, Accessibility, Usability, Responsiveness and Performance. This review will not invent a performance score without runtime measurement.

Expert rubric scores below are design-review judgments based on the evidence available, not objective performance/WCAG measurements.

| Dimension | Weight | Expert score | Evidence |
|---|---:|---:|---|
| Visual Hierarchy | 20% | 6.2/10 | Strong Slice 1/4; substantial later card/prose regression |
| Consistency | 20% | 6.3/10 | Tokens/components are consistent, but composition language diverges after Slice 1 |
| Accessibility | 20% | 5.0/10 | Current critical Slice 12 gate failure; several historical green slices |
| Usability | 20% | 6.0/10 | Semantics/action rules strong; cognitive load high in Slices 9–12 |
| Responsiveness | 10% | 6.5/10 | Automated no-overflow coverage exists, but current all-slices visual evidence is incomplete |
| Performance | 10% | **Not verified** | No current performance measurement suitable for an honest score |
| Weighted overall | 100% | **Not computed** | Computing it would require inventing a performance score |

The missing weighted score is deliberate evidence discipline, not an omission.

---

## 12. Nielsen heuristic review

| Heuristic | Overall result | Cross-slice evidence |
|---|---|---|
| H1 Visibility of system status | PASS / strong | Governed StateChip/deadline/evidence states are widely used. |
| H2 Match between system and real world | PARTIAL | Appointment UX is strong; later authorization/claims surfaces expose too much policy structure. |
| H3 User control and freedom | PASS / strong | Back/cancel/revoke/appeal paths are generally explicit and constrained correctly. |
| H4 Consistency and standards | PARTIAL | Token/component consistency is good; composition consistency with Slice 1 is weak. |
| H5 Error prevention | PASS / strong | Fail-closed unknown scope/deadline, missing snapshot, evidence gates and exact financial matching are disciplined. |
| H6 Recognition rather than recall | PARTIAL/FAIL | Slice 1 comparison succeeds; later long policy/form flows require remembering earlier explanations. |
| H7 Flexibility and efficiency | PARTIAL | State-aware actions help; long forms and expanded history slow routine tasks. |
| H8 Aesthetic and minimalist design | FAIL overall | Excess explanatory copy/cards in Slices 5,9,10,11,12. |
| H9 Error recognition/recovery | PASS / strong | Retryable vs terminal states are semantically separated; recovery actions are usually specific. |
| H10 Help and documentation | OVER-SUPPLIED | Help exists, but several screens effectively embed documentation into the primary task. |

---

## 13. Recommended remediation sequence

### Gate 0 — restore objective correctness

1. Fix Slice 12 checkbox checked-state accessibility without weakening tests.
2. Replace literal selection glyphs with governed icon/component treatment.
3. Rerun current full `npm run verify` equivalent / Patient UI Preview workflow.

### Gate 1 — establish a shared cross-slice Patient composition language

Use Slice 1 as the reference:

- person/provider identity object;
- appointment/treatment/financial/claim/grant object;
- compact decision facts;
- one dominant CTA;
- state visible without paragraph reading;
- secondary explanation deferred;
- destructive actions spatially subordinate until confirmation.

Do not change domain behavior while doing this.

### Gate 2 — recompose highest-risk slices

Order:

1. Slice 11 — protection claims / claim appeals
2. Slice 12 — representation/dependent flows
3. Slice 10 — refund request/claim detail composition
4. Slice 9 — review appeal
5. Slice 8 — after rating-policy decision
6. Slice 5 — accepted financial terms
7. Slice 3 — plan acceptance
8. Slice 6 — financial-action consistency

### Gate 3 — consistency polish

Recheck Slices 1,2,4,7 against the same shared patterns so that later remediation does not create a new visual split.

### Gate 4 — visual evidence

Capture and inspect high-risk/default states at:

- 320 px;
- 390 px;
- 414 px.

The visual pass must explicitly inspect long Arabic copy, mixed-direction dates/times/currency, persistent footers, selected/disabled states, destructive confirmations, loading/blocked/error states, and whether the screen still feels like a document.

---

## 14. Upstream product/design decisions required

### Required product decision

**Slice 8 rating scale.** The canonical contract does not define the concrete rating scale/allowed values. A production-quality rating control cannot be chosen safely until this is decided.

### Possible design-system decision

If the recomposition proves that existing components cannot express a reusable compact `record summary / governed object` pattern for treatment, finance, claims and representation, create or promote that component through the repository governance/design-component process. Do not introduce several unrelated one-off cards with hardcoded styling.

No other major UX finding in this report requires changing clinical, financial, eligibility, lifecycle, authorization or API semantics.

---

## 15. Final approval questions

### A. Is the implementation functionally understandable?

**Mostly yes.** Domain semantics are unusually careful and generally understandable after reading.

### B. Is it visually professional across all slices?

**No.** Slice 1 demonstrates the target quality, but later high-risk slices do not consistently reach it.

### C. Does the entire preview feel like a native mobile product rather than a responsive document?

**No.** Slices 5,9,10,11 and 12 in particular retain a responsive-document pattern.

### D. Is cognitive load acceptable for a Patient across all slices?

**No.** Claims, appeals and representation over-explain safety/business semantics inside the primary task.

### E. Is hierarchy clear without reading every line?

**Not consistently.** It is strong in Slice 1 and several state-led Slice 4/7 surfaces; weak in the high-risk later forms.

### F. Is the next action obvious?

**Usually, but not quickly enough on the densest screens.** ActionBar rules are good; preceding content can delay comprehension.

### G. Are lifecycle states emotionally appropriate?

**Mostly yes.** This is one of the stronger parts of the design system, with the notable caution that routine plan acceptance should not be visually warning-dominant.

### H. Does the complete Patient preview deserve approval now?

**No.** Current accessibility failure + incomplete all-slices visual evidence + major cognitive/composition debt in high-risk slices prevents approval.

---

## 16. Final recommendation

**FAIL — CROSS-SLICE UI/UX REMEDIATION REQUIRED BEFORE PATIENT PREVIEW APPROVAL.**

Do not discard the current work. The architecture, state semantics, safety boundaries, and several reusable patterns are strong. Use the visually successful Slice 1 journey and the state-oriented Slice 4 evidence experience as the reference language, then recompose later domains so the Patient recognizes objects, decisions and next actions without reading policy documentation line by line.

After remediation, run one independent all-slices rendered review at 320/390/414 rather than approving slices only from code/spec assertions.

No product implementation files were changed during this review.
