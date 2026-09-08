# UberTib Patient UI — All-Screens UI/UX Remediation Plan

Date: 2026-09-08

Source review: ALL_SCREENS_CODEX_SOL_HIGH_UI_UX_REVIEW.md

Scope: tools/patient-ui-preview only. This plan does not authorize production application changes, new product behavior, new routes, or changes to canonical requirements.

Goal: close the current approval findings with targeted shared-system and screen-composition work while preserving the Patient preview’s domain correctness, Arabic-first RTL direction, and existing visual language.

---

## 1. Executive Plan

The preview does not need a redesign. It needs three approval repairs, four bounded quality improvements, and a repeatable evidence gate.

### Approval sequence

1. Repair the compact comparison layout.
2. Repair shared accessibility structure and form-error relationships.
3. Normalize Patient hit areas.
4. load and verify the canonical font.
5. Recompose only the longest high-load states.
6. Harden the all-screen visual/accessibility gate.
7. Complete native-device validation.

### Non-goals

- Do not change eligibility, booking, clinical, finance, review, claim, or representation behavior.
- Do not add a “best provider” score, ranking, or saved comparison.
- Do not turn external financial records into payments, balances, wallet, escrow, settlement, or platform refunds.
- Do not invent new screens to reduce scroll; use progressive disclosure inside canonical screens unless upstream authority approves a route.
- Do not change the five-point review scale or labels in PO-UX-19.
- Do not replace IBM Plex Sans Arabic, Heroicons, the palette, or the existing token architecture.
- Do not weaken axe, overflow, type, Storybook, or interaction assertions.

---

## 2. Current Baseline

| Baseline | Result |
|---|---|
| Implemented Patient screens | 38 |
| Screen-story states | 147 |
| Current rendered widths | 320 / 390 / 414 |
| Exhaustive screenshots | 441 |
| Render/page/console/horizontal-overflow errors | 0 |
| TypeScript / Storybook / E2E | PASS / PASS / 363 passed |
| Unfiltered axe | 294 violations across all 147 states |
| 320 px targets below 44 px | 135 instances across 10 screens |
| Targets below WCAG AA 24 px | 0 |
| Longest 390 px state | 2,737 px, about 3.2 viewports |
| Capture wrapper | FAIL on Windows Node with spawn EINVAL |

The plan must preserve the passing baseline while making the unfiltered accessibility, compact readability, typography, and native evidence gates green.

---

## 3. Design Principles

1. **Fix shared causes in shared components.** Screen, ValidationField, touch-target tokens, and the capture harness should carry system guarantees.
2. **Keep one authoritative object per screen.** Provider, booking, case, plan, terms snapshot, financial event, review, claim, grant, or dependent request.
3. **Show what matters now before history.** State, deadline, outstanding action, and current derived position precede long chronological detail.
4. **Disclose completed or explanatory detail, never controlling facts.** Amount, eligibility, deadline, changed terms, evidence still required, and consequence remain visible.
5. **Preserve Patient-safe semantics.** Visual simplification cannot remove provenance, version, historical policy, authority, or uncertainty.
6. **Compact visuals may have generous hit areas.** Do not enlarge every icon or label; enlarge the interactive box.
7. **Measure internal readability, not only document overflow.** A page can fit the viewport while content inside equal columns collides.
8. **No speculative style layer.** Use the current palette, type scale, spacing scale, radii, Heroicons, and state channel.

---

## 4. Priority Matrix

| Work package | Priority | Risk addressed | Primary owners | Dependency |
|---|---|---|---|---|
| WP-UX-01 Compact provider comparison | P1 | Wrong/unclear provider comparison at phone widths | Patient UI + design QA | None |
| WP-UX-02 Screen landmarks | P1 | All states fail structural landmark rules | Patient UI + accessibility | None |
| WP-UX-03 Form error relationships | P1 | Error not recoverably associated with input | Patient UI + accessibility | None |
| WP-UX-04 Patient touch targets | P2 | Mis-tap and canonical Profile C drift | Design system + Patient UI | WP-UX-01/03 patterns |
| WP-UX-05 Canonical font delivery | P2 | Screenshots validate fallback metrics | Design system + build | Asset/license confirmation |
| WP-UX-06 High-load composition | P2 | Excess scroll and flattened hierarchy | Patient UX + UI | WP-UX-04 |
| WP-UX-07 Capture and audit hardening | P2 | Green gate masks moderate violations/tool failure | QA/tooling | WP-UX-01–06 |
| WP-UX-08 Native validation | Approval gate | Web preview cannot prove native AT/layout | Mobile QA + accessibility | WP-UX-01–07 |

---

## 5. Work Packages

## WP-UX-01 — Compact Provider Comparison

### Problem

SCR-ELIG-005 renders every comparison attribute as an unconditional multi-column flex row. At 320 px, the price range visibly crosses into neighboring provider columns even though the document itself has no horizontal overflow.

### Patient impact

The Patient can associate an amount with the wrong provider or abandon the comparison because its densest decision surface is not reliably scannable.

### Screens affected

- SCR-ELIG-005 Provider comparison.

### Existing components affected

- ProviderComparisonScreen, AttributeGroup, and OptionValue.
- PriceDisplay only if post-stacking tests reveal an atomic-run problem; its formatting rules otherwise remain unchanged.

### Canonical constraints

- Compact Profile C layouts below 600 px stack comparison values.
- Provider order, patient-safe eligibility, verified-review meaning, and the single primary booking action do not change.
- Price, eligibility, nearest appointment, and selection state remain visible.

### Recommended UI composition

- Compact: one attribute group at a time, with provider-labeled values stacked vertically in stable provider order.
- Medium/expanded: two or three aligned provider columns may remain side by side.
- Largest supported text: force the stacked composition.
- Keep provider selection above comparison facts and the sticky primary action below them.

### Interaction behavior

Preserve the radiogroup model, keyboard behavior, remove/select actions, and action-bar update. Layout mode changes presentation only.

### Copy changes

No product-copy change. Reuse the current attribute and provider labels; do not introduce rankings or “best provider” language.

### RTL/accessibility considerations

Screen-reader order must repeat attribute → provider → value predictably. Arabic amounts, dates, and mixed names remain isolated and must not be truncated.

### Tokens/components to reuse

Reuse Profile C breakpoints, existing spacing/radius/type tokens, ProviderIdentity, PriceDisplay, SelectionControl, and ActionBar.

### Upstream gaps if any

None identified. Compact stacking is already specified; implementation only needs to consume it.

### Validation

- Add Playwright intersection assertions for price/value bounding boxes.
- Capture Two Options and Three Options at 320/390/414 and at 600+.
- Recheck keyboard radio interaction, aria-checked, Arabic price ranges, provider names, and mixed dates.

### Acceptance criteria

1. At 320, 390, and 414 px, no two providers share one compact value row.
2. No amount, currency, date, or label overlaps or enters another provider’s region.
3. At 600 px and above, column layout remains aligned when used.
4. At the largest supported text size, values stack without truncation.
5. Choosing or removing an option still updates the one primary booking action.

### Risk

Stacking increases page length. Control it with compact provider labels and stable attribute order, never by hiding decision-critical facts.

### Priority

P1 — Major UX failure. Implement first; it is the only current screen-specific responsive correctness defect.

---

## WP-UX-02 — Structural Landmarks in the Shared Screen Shell

### Problem

Every one of 147 states lacks a main landmark and reports content outside landmarks. The current E2E severity filter allows these moderate structural violations to coexist with a green suite.

### Patient impact

Screen-reader users cannot move directly to primary content or understand the screen’s high-level regions reliably.

### Screens affected

- All 38 implemented Patient screens and all 147 current story states.

### Existing components affected

- Shared Screen shell, its scrolling content, and its footer.
- Storybook preview decorator only if it prevents correct role projection.

### Canonical constraints

- Each isolated Patient screen needs one clear page title and one primary content region.
- Native semantics must remain valid; Storybook-only markup must not become product behavior.

### Recommended UI composition

Emit exactly one top-level main landmark per rendered Patient screen and keep all visible content within an appropriate landmark. Keep sticky actions in the screen context without adding redundant regions.

### Interaction behavior

No workflow behavior changes. Landmark navigation must arrive at the page title/content and leave footer actions discoverable.

### Copy changes

None, except a concise accessible label if the final region implementation requires one.

### RTL/accessibility considerations

Landmark order must match Arabic reading and focus order. Do not fix the issue by excluding the preview root from axe or by adding duplicate main elements.

### Tokens/components to reuse

Reuse Screen, ScreenHeader, the existing heading hierarchy, and the current sticky ActionBar composition.

### Upstream gaps if any

Potential integration question only: the native application shell may own the main region. Escalate if shared Screen ownership would create a duplicate in the integrated shell.

### Validation

- Run exhaustive unfiltered axe at 390 px and structural checks at 320/414.
- Capture DOM/role snapshots for one short, one long, and one sticky-action screen.
- Manually test web landmark navigation; complete native VoiceOver/TalkBack checks in WP-UX-08.

### Acceptance criteria

1. Unfiltered axe reports zero landmark-one-main and region violations on all current states.
2. Exactly one main exists in each isolated screen story.
3. Each screen preserves one h1-equivalent title and logical heading order.
4. Footer actions remain associated with and discoverable from their screen.
5. Native accessibility roles remain valid.

### Risk

A shared main role can duplicate a future application-shell landmark. Test both isolated preview and integrated shell ownership.

### Priority

P1 — Major UX failure. Can proceed in parallel with WP-UX-01 and WP-UX-03.

---

## WP-UX-03 — Field Error Association and Recovery

### Problem

ValidationField shows a visible role=alert error, but invalid inputs expose neither aria-invalid nor aria-describedby. In the external-payment and refund-execution screens, attempted field errors are unreachable while the commit action is disabled before its handler can run.

### Patient impact

Assistive-technology users may hear an error once but cannot recover its field relationship later. Sighted users may need to scan a long form to discover why the footer action is disabled.

### Screens affected

- SCR-IDENTITY-002 and SCR-IDENTITY-003.
- SCR-FINANCE-003 and SCR-FINANCE-005.
- SCR-CLAIMS-002 and every other current or future ValidationField consumer.

### Existing components affected

- Shared ValidationField.
- ReportExternalPaymentScreen and ReportRefundExecutionScreen validation timing.
- ActionBar disabled-reason behavior and optional multi-field error summary.

### Canonical constraints

- Labels and helper text remain visible; entered data is preserved.
- Client validation, retryable server failure, and evidence rejection remain distinct states.
- A disabled reason supplements rather than replaces field-level errors.

### Recommended UI composition

Keep the error adjacent to its persistent label, helper, and field. Use a top summary only for multi-field submit failures, linked to or focused on the first invalid field.

### Interaction behavior

Allocate stable helper/error IDs, expose invalid state only while invalid, and reference the IDs that exist. Validate on explicit submit/continue or after blur; do not depend on a disabled button’s onPress. Preserve entered values and move focus predictably after a failed commit.

### Copy changes

Retain current specific, corrective messages. Add no generic “something went wrong” replacement and do not blame the Patient.

### RTL/accessibility considerations

Web needs recoverable field relationships and one intentional live announcement. Native needs the equivalent relationship and announcement without duplicate speech; focus order follows Arabic form order.

### Tokens/components to reuse

Reuse ValidationField, Helper, Label, ActionBar, current danger tone, focus ring, and spacing tokens.

### Upstream gaps if any

None identified. The accessibility relationship is already required; implementation must resolve the React Native Web/native projection.

### Validation

- Add DOM assertions for aria-invalid and aria-describedby plus unit coverage for stable ID combinations.
- Test keyboard focus after invalid submit and axe on invalid-state stories.
- Manually read invalid amount, phone/code, occurrence time, and retryable server states with NVDA, VoiceOver, and TalkBack.

### Acceptance criteria

1. Every invalid field exposes a programmatic invalid state and references its visible error.
2. Helper and error remain visible together and entered input remains unchanged.
3. A failed multi-field commit focuses the summary or first invalid field predictably.
4. A disabled commit action has a visible reason but is not the only error mechanism.
5. Retryable server failures remain distinct from validation and evidence rejection.

### Risk

Live-region plus description wiring can announce an error twice. Test both initial announcement and later field recovery with real assistive technology.

### Priority

P1 — Major UX failure. Repair in the shared component before screen-specific form polish.

---

## WP-UX-04 — Patient Comfortable Touch Targets

### Problem

At 320 px, 135 visible controls across 10 screens measure below 44 px. None is below the WCAG 2.2 AA 24 px floor, but Profile C reading density is supposed to render all interactive elements above the comfortable default.

### Patient impact

Small secondary controls increase mis-tap risk and make high-consequence evidence, scope, timeline, and rating actions harder to operate confidently.

### Screens affected

- SCR-ELIG-001 change-service link.
- SCR-ELIG-002 compare and clear-filter controls.
- SCR-ELIG-005 full-detail and remove actions.
- SCR-CLINICAL-005 disclosure and record actions.
- SCR-REVIEWS-002 five rating radios.
- SCR-CLAIMS-001 filter chips.
- SCR-CLAIMS-003 evidence retry/replace.
- SCR-IDENTITY-005 grant detail actions.
- SCR-IDENTITY-006 scope/duration choices.
- SCR-IDENTITY-037 scope and evidence actions.

### Existing components affected

Inline text actions, filter chips, comparison actions, disclosure controls, evidence actions, representation choices, and the five-star rating radios.

### Canonical constraints

- Profile C uses the 44 px comfortable target behavior; WCAG’s 24 px floor is not the product target.
- Visual icon and text sizes may stay compact.
- Adjacent targets keep governed spacing and destructive actions remain distinct.

### Recommended UI composition

Keep the visible typography/icon scale compact. Increase minHeight, minWidth, padding, or transparent hit slop to at least 44 × 44 for Profile C.

### Interaction behavior

- Add a shared Patient inline-action/choice variant that consumes target-primary or an expanded hit area.
- Replace literal 38/40 heights and direct target-floor use where Profile C expects comfortable targets.
- Preserve 8 px or governed spacing between adjacent targets.
- Avoid converting every link into a heavy filled button.

### Copy changes

None. Preserve the current concise labels and accessible names.

### RTL/accessibility considerations

The enlarged interactive box must follow the visible RTL order, avoid overlap with adjacent targets, and retain clear focus indication. Rating stars keep one coherent radio-group order.

### Tokens/components to reuse

Reuse target-primary/target-comfortable sizing, current spacing tokens, focus rings, Heroicons, Pressable patterns, filter chips, and rating controls.

### Upstream gaps if any

None identified. The target behavior already exists in the system rules; current controls need to consume it consistently.

### Acceptance criteria

1. Every visible Patient target measures at least 44 × 44 at 320/390/414, or documents a canonical exception.
2. Rating stars retain their 24 px visual star while the radio box reaches at least 44 px.
3. Adjacent destructive/primary actions retain governed separation.
4. No new wrapping, overflow, or footer growth obscures content.

### Validation

- Exhaustive role-based geometry audit at 320/390/414.
- Screenshot comparison for filters, stars, timeline, evidence, and grant controls.
- One-hand/tremor-oriented manual tap test on a physical phone.

### Risk

Transparent hit areas can overlap neighboring controls or make dense rows ambiguous. Verify geometry and activation boundaries, not only CSS dimensions.

### Priority

P2 — Significant friction. Apply after the P1 layout and field patterns establish their final control geometry.

---

## WP-UX-05 — Canonical Font Delivery and Typography Proof

### Problem

The preview declares IBM Plex Sans Arabic in computed styles but includes no font file, package, @font-face, or host installation. Current captures therefore use an environment fallback and do not prove canonical line height, Arabic diacritics, Arabic/Latin metrics, or amount/date wrapping.

### Patient impact

Fallback metrics can change wrapping, density, diacritic clearance, and mixed Arabic/Latin alignment, making visual approval nondeterministic across reviewer machines.

### Screens affected

All 38 Patient screens.

### Existing components affected

The typography/token loader, Text foundations, Storybook bootstrap, and screenshot readiness logic.

### Canonical constraints

- IBM Plex Sans Arabic / IBM Plex Sans remains the approved family.
- Preserve the current type scale, loose Arabic leading, zero letter spacing, Western digits, and tabular figures.
- Font licensing and asset delivery must be confirmed before bundling.

### Recommended UI composition

No visual redesign. Render the existing type scale using the already approved IBM Plex Sans Arabic / IBM Plex Sans family.

### Interaction behavior

- Add the approved open-licensed font assets through the preview’s existing build strategy.
- Load only required weights.
- Make font readiness part of screenshot setup.
- Define a deterministic fallback chain for failure, but make missing primary font visible to tests.

### Copy changes

None.

### RTL/accessibility considerations

Verify Arabic diacritics, Arabic/Latin runs, SYP amounts, dates, and provider names at large text. Font loading must not cause hidden text or a permanently blocked screen.

### Tokens/components to reuse

Reuse primitive.type.json, semantic typography roles, Text foundations, numeric/identifier styles, and the existing fallback stack.

### Upstream gaps if any

Confirm the approved font asset’s legal and technical bundling path. If it cannot be bundled, record an upstream decision instead of silently choosing a substitute family.

### Acceptance criteria

1. Browser font APIs and network/build evidence prove the primary Arabic face loaded.
2. Screenshots wait for document.fonts.ready.
3. Arabic diacritics do not clip at heading/body line heights.
4. Arabic and Latin mixed runs align acceptably.
5. Price/date/identifier geometry remains stable at all widths.
6. No new font family or type-scale values are introduced.

### Validation

- Font-load assertion in Playwright.
- Representative Arabic diacritic, Western digit, SYP, BK-1001, and mixed provider-name stories.
- Bundle-size review after adding font assets.

### Risk

Assets can increase bundle size or introduce a flash of fallback text. Load only used weights and require deterministic readiness in visual tests.

### Priority

P2 — Significant friction and a prerequisite for final visual approval.

---

## WP-UX-06 — High-Load Screen Recomposition

### Problem

Five states exceed three 844 px viewports and 27 exceed two. Length alone is not failure; the issue is simultaneous exposure of completed evidence, detailed history, policy explanation, and the next action at equal visual weight.

### Patient impact

Patients must hold too much non-actionable context in memory before reaching the current state, outstanding requirement, or next action.

### Screens affected

- SCR-IDENTITY-037 Add dependent.
- SCR-FINANCE-002 Financial timeline.
- SCR-CLINICAL-003 Treatment plan.
- SCR-CLAIMS-003 Protection claim.
- SCR-ELIG-005 Provider comparison, after WP-UX-01.
- Secondary: SCR-CLAIMS-004 Claim detail, SCR-IDENTITY-006 Create grant, SCR-REVIEWS-004 Review appeal, SCR-CLAIMS-005 Claim appeal.

### Existing components affected

EvidenceTransferPanel and claim evidence-requirement rows, financial event/history cards, treatment-plan lines, claim/appeal guidance, representation step summaries, DisclosureSection, Screen, and ActionBar.

### Canonical constraints

- Controlling amount, deadline, state, changed term, outstanding evidence, consequence, provenance, version, and authority remain visible.
- The canonical screen count and navigation do not change.
- Partial history must not produce a false derived financial position.

### Recommended UI composition

#### Outstanding evidence versus completed evidence

- Lead with progress and the outstanding requirement.
- Collapse accepted/completed requirements into a labeled completed section.
- Keep rejected or retryable evidence expanded because it requires action.

#### Current position versus history

- In Financial Timeline, show agreed terms then a compact current derived position before chronological events.
- Never show the derived position when history is partial.
- Keep each event’s amount, state, actor, and time visible; disclose responded detail.

#### Changed versus unchanged plan

- Keep amendment delta and total visible.
- Keep changed lines expanded.
- Allow unchanged inclusions/exclusions to disclose per line.

#### Appeal scope versus process detail

- Place the allowed-scope checklist immediately before grounds.
- Move reviewer/process and full policy-reference detail after the authoring task or behind disclosure.

#### Grant/dependent scope

- Show completed steps as summaries with edit actions.
- Preserve one explicit final scope review before commit.

### Interaction behavior

Default open/closed states follow urgency: action-required, rejected, retryable, or changed content stays expanded; completed and explanatory detail may collapse. Disclosures must be keyboard/AT operable and preserve focus.

### Copy changes

Use existing governed labels. Shorten repeated explanatory boundaries only where the owning rule remains visible once in the relevant context; do not weaken conditional protection or external-money wording.

### RTL/accessibility considerations

Disclosure labels announce expanded state and preserve logical Arabic reading order. Collapsed summaries must identify what is hidden without forcing screen-reader exploration.

### Tokens/components to reuse

Reuse DisclosureSection, StateSummary, EvidenceTransferPanel, record cards, spacing/type roles, sticky ActionBar, and existing status channels.

### Upstream gaps if any

None for the proposed in-screen disclosure. Any new route or changed workflow requires upstream approval and is outside this plan.

### Acceptance criteria

1. Every affected screen answers “what needs me now?” in the first viewport.
2. No controlling amount, deadline, state, changed term, outstanding evidence, or consequence is hidden.
3. Completed/non-actionable detail can collapse without losing screen-reader access.
4. Sticky action labels and disabled reasons remain visible.
5. The canonical screen count and navigation do not change.
6. All 147 existing stories remain behaviorally valid; new disclosure states are added where useful.

### Validation

- Three-second comprehension review by a reviewer not involved in implementation.
- 320/390/414 screenshots for the longest state of each screen.
- Keyboard and assistive-technology disclosure checks.
- Scroll-height comparison used as a diagnostic, not a pass/fail quota.

### Risk

Over-compression can hide a controlling fact or flatten provenance. Require a fact-by-fact disclosure rationale and review against the owning screen spec.

### Priority

P2 — Significant friction. Start after WP-UX-01 and shared target geometry stabilize.

---

## WP-UX-07 — All-Screen Capture and Audit Hardening

### Problem

npm run capture:all fails on current Windows Node with spawn EINVAL. The standard E2E gate also filters axe to serious/critical, allowing 294 moderate structural violations to coexist with a green result.

### Patient impact

A nondeterministic approval gate can miss regressions that affect every screen-reader user or make compact decision content unreadable.

### Screens affected

All implemented Patient screens through the review harness; no production workflow changes.

### Existing components affected

- scripts/capture-all.mjs.
- Playwright configuration and all-screen audit harness.
- CI/local review documentation.

### Canonical constraints

- The final approval gate covers every current Patient screen state at 320/390/414.
- A passing focused or severity-filtered suite cannot substitute for the authoritative gate.
- Artifact generation remains deterministic and separate from production application behavior.

### Recommended UI composition

No UI composition change. Provide one documented review workflow that builds Storybook, starts it portably, captures all states, runs unfiltered axe, records target/font/internal-collision evidence, and exits non-zero on a configured failure.

### Interaction behavior

- Replace the Windows-incompatible spawn usage with a portable process launcher or direct Node import.
- Read Storybook’s generated index so screen/story coverage cannot silently drift.
- Wait for rendered root and loaded fonts.
- Record render, console, page, overflow, target, and axe results in machine-readable JSON.
- Add an internal-collision geometry test for comparison.
- Keep opt-in visual artifacts separate from ordinary E2E if CI cost requires, but make the final approval command authoritative and documented.

### Copy changes

Update only review-tooling documentation and command descriptions required to identify the authoritative gate and its outputs.

### RTL/accessibility considerations

Keep Arabic/RTL as the captured locale/direction, run unfiltered axe at the primary width, and record screen/state/viewport identity in each artifact.

### Tokens/components to reuse

Reuse the existing Storybook index, Playwright configuration, capture specs, axe integration, and artifact schema where possible.

### Upstream gaps if any

Confirm the repository-supported Node runtime if the EINVAL behavior differs across versions. Do not declare a compatibility range without manifest/CI evidence.

### Acceptance criteria

1. The wrapper runs on Windows PowerShell with the repository’s supported Node runtime.
2. Captured screen count equals the unique Patient/Screens titles in Storybook.
3. State count equals the current Storybook index and cannot be hard-coded stale.
4. Every state captures at all three widths.
5. Any render/page/console/overflow error fails.
6. Unfiltered axe fails on any remaining violation unless an explicit, documented rule exception exists.
7. Target geometry and font-load assertions are included.
8. The command terminates cleanly without UV_HANDLE_CLOSING or orphan server processes.

### Validation

- Run twice locally on Windows.
- Run once in CI.
- Confirm output count, process exit code, and clean server shutdown.

### Risk

An authoritative gate can become too slow for every PR. A faster PR subset may coexist, but it must never be reported as final approval evidence.

### Priority

P2 — Significant verification risk. Complete after UI repairs so the new baseline is meaningful.

---

## WP-UX-08 — Native Accessibility and Device Validation

### Problem

React Native Web and Storybook prove useful semantics and layout, but they cannot prove native accessibility focus, VoiceOver/TalkBack announcements, Dynamic Type, safe areas, keyboard behavior, or physical touch quality.

### Patient impact

Web-only approval can miss native barriers that prevent a Patient from completing identity, booking, financial, evidence, review, claim, or representation tasks.

### Screens affected

All Patient screens, with the ten critical scenarios below as the minimum native sample.

### Existing components affected

The integrated mobile shell, navigation/focus handling, Screen, ActionBar, ValidationField, radio/checkbox patterns, evidence controls, and responsive text/layout behavior.

### Canonical constraints

- Business meaning, governed copy, RTL, Western digits, safe state distinctions, and the one-primary-action model remain unchanged.
- Native findings must be reproduced on an identified build/device before changing shared behavior.

### Recommended UI composition

Use the remediated web composition as the native candidate, then adjust only safe-area, keyboard, large-text, or platform accessibility projection defects confirmed on device.

### Interaction behavior

Verify focus movement, announcements, control grouping/state, keyboard avoidance, retry behavior, and safe-area handling for each critical scenario.

### Copy changes

None by default. Change accessible labels or hints only when native readback proves ambiguity, preserving the visible governed copy.

### RTL/accessibility considerations

- Test one current iPhone with VoiceOver and large accessibility text.
- Test one compact Android device with TalkBack and large font/display size.
- Include weak/intermittent network simulation and reduced motion.

### Tokens/components to reuse

Reuse the remediated shared foundations and system tokens; do not create device-specific visual themes.

### Upstream gaps if any

The current preview does not identify a validated native build/device matrix. Record build and device identifiers during execution; escalate only if the application shell contradicts the preview contract.

### Validation

1. Phone request and code error recovery.
2. Provider comparison and selected provider.
3. Slot/date/time selection and booking request.
4. Alternative proposal and eligibility review.
5. Plan acceptance and stale plan.
6. Financial event report/response.
7. Five-star review input.
8. Evidence retry/rejection.
9. Claim deadline and appeal.
10. Active subject switching, grant creation/revocation, Add Dependent.

### Acceptance criteria

1. Screen title, state, subject, and primary action are announced in logical order.
2. Sticky actions are not obscured by safe areas, zoom, or keyboard.
3. Focus moves to the first invalid field or replacement state and returns predictably.
4. Radio/checkbox controls announce group, label, checked state, and disabled reason.
5. No amount, deadline, provider, or subject truncates at largest supported text.
6. All touch targets are comfortably operable with one hand.
7. Reduced motion preserves equivalent state feedback.
8. Network interruption never turns retryable transfer into rejection.

### Risk

Platform-specific fixes can diverge semantics or visuals. Keep changes in shared foundations unless a verified native platform constraint requires a bounded exception.

### Priority

Approval gate — required after WP-UX-01 through WP-UX-07; it cannot be replaced by Storybook evidence.

---

## 6. Screen Disposition Matrix

| Disposition | Screens |
|---|---|
| Preserve composition; shared fixes only | SCR-IDENTITY-001/002/003/008, SCR-CATALOG-002, SCR-ELIG-003/004, SCR-BOOKING-001/002/004, SCR-CLINICAL-004/006, SCR-FINANCE-004, SCR-REVIEWS-001/003 |
| Shared target/accessibility repair | SCR-IDENTITY-005/006/037, SCR-ELIG-001/002, SCR-CLINICAL-005, SCR-REVIEWS-002, SCR-CLAIMS-001/002/003, SCR-FINANCE-003/005 |
| Targeted composition polish | SCR-CATALOG-001, SCR-CLINICAL-001/002/003, SCR-FINANCE-001/002, SCR-REVIEWS-004, SCR-CLAIMS-004/005 |
| Major screen-specific correction | SCR-ELIG-005 |

“Preserve” never means skip WP-UX-02/WP-UX-05/WP-UX-07/WP-UX-08; those are system-wide.

---

## 7. Delivery Sequence

### Phase A — Objective correctness

1. Implement WP-UX-01, WP-UX-02, and WP-UX-03 on one coherent branch.
2. Add failing tests first for internal comparison collision, landmarks, and field relationships.
3. Rerun typecheck, Storybook, focused tests, full E2E, and unfiltered axe.

Exit condition: zero P1 findings and no regression in product semantics.

### Phase B — Shared quality

1. Implement WP-UX-04 target normalization.
2. Implement WP-UX-05 font delivery.
3. Regenerate representative contact sheets.

Exit condition: zero unexplained targets below 44 px and deterministic font proof.

### Phase C — Bounded composition

1. Implement WP-UX-06 one problem theme at a time: evidence, current-vs-history, changed-vs-unchanged, appeal scope, representation steps.
2. Do not mix unrelated screen redesigns into one change.
3. For every disclosure, document why the hidden fact is non-controlling.

Exit condition: first viewport identifies state, subject, deadline/action, and no controlling fact is hidden.

### Phase D — Evidence and native approval

1. Implement WP-UX-07.
2. Produce the complete current 441-image set and machine reports.
3. Conduct WP-UX-08 native validation.
4. Perform one independent final senior review.

Exit condition: all objective gates green and independent reviewer approves visual/cognitive quality.

---

## 8. Verification Gate

The final approval run must include:

1. npm run typecheck.
2. npm run storybook:build.
3. npm run test:e2e.
4. Repaired npm run capture:all or its documented authoritative replacement.
5. 38 unique screen titles and the current Storybook state count at 320/390/414.
6. Zero render, page, console, and horizontal-overflow errors.
7. Zero unfiltered axe violations or narrowly documented canonical exceptions.
8. Zero unexplained Patient targets below 44 px.
9. Font-load proof.
10. Comparison internal-collision proof.
11. docs/scripts/validate_docs.py.
12. git diff --check.
13. Manual visual inspection of all domain contact sheets.
14. Native VoiceOver/TalkBack/Dynamic Type evidence.

Passing Storybook build output is not enough if the process exits non-zero. Passing focused suites is not enough if the authoritative final gate is not run.

---

## 9. Risks and Controls

| Risk | Control |
|---|---|
| Stacking comparison makes the page longer | Prefer readable, correctly associated values; use compact provider labels and preserve attribute order. |
| Landmark fix creates duplicate main in a future app shell | Make ownership explicit and test isolated preview plus integrated shell. |
| Validation changes announce errors twice | Separate live announcement from description relationship and test with real AT. |
| Larger hit areas make the UI look heavy | Expand invisible/transparent hit area; keep existing visual size where appropriate. |
| Font assets increase bundle size | Load only used weights and inspect build chunks. |
| Disclosure hides a controlling fact | Require a per-fact rationale and explicit acceptance checklist. |
| New audit command becomes too slow | Separate fast PR gate from authoritative approval gate, but never substitute the fast gate for approval. |
| Composition work changes business meaning | Review every change against the owning screen spec and current Product Owner decisions. |

---

## 10. Upstream Decisions

No new Product Owner decision is required for the identified remediation:

- compact stacking is already specified;
- one main landmark and field-bound error relationships are already required;
- the 44 px Patient target behavior already exists in the token/system rules;
- IBM Plex Sans Arabic is already selected;
- the five-star rating scale is already resolved by PO-UX-19;
- progressive disclosure is already an approved interaction pattern.

Escalate only if implementation discovers a genuine contradiction between the integrated native shell and the shared Screen landmark owner, or if the approved font asset cannot be legally or technically bundled under the current build. Record any such issue without inventing a substitute.

---

## 11. Definition of Ready for Final Approval

The Patient preview is ready for final approval only when:

- no P1 finding remains;
- the compact comparison is readable and correctly associated;
- all 147 current states pass unfiltered accessibility checks;
- field errors remain recoverable after announcement;
- Patient targets meet the comfortable default;
- the canonical typeface is actually rendered;
- long screens surface the next required action before non-actionable detail;
- the Windows all-screen evidence command is repeatable;
- native AT, large text, safe area, and touch behavior are verified;
- an independent reviewer confirms that the interface remains calm, trustworthy, and patient-safe.

The expected outcome is a targeted hardening of a good system, not a new aesthetic direction.
