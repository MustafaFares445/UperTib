# UberTib Slice 1.6 Patient UX visual review

Date: 2026-09-05

Reviewer role: independent Principal Mobile UI/UX Designer

Review stage: adversarial pre-implementation baseline and recomposition brief

Decision: **FAIL**

The current rendered Patient experience is semantically careful and technically coherent, but it
does not satisfy the Slice 1.6 visual-composition brief. One BLOCKER and seven MAJOR findings remain.
The clearest failure is `SCR-ELIG-005`: it is still card-after-card, so the patient must remember the
first provider while reading the second. The other target screens still depend too heavily on
headings, paragraphs, labels, bordered surfaces, and buttons. `REQUESTED` also gives routine waiting
the emotional weight of a warning.

This is a visual and interaction review, not evidence that native accessibility, production
performance, server authorization, or real booking behavior passed.

## 1. Authority and evidence

The attached Slice 1.6 prompt was treated as the current presentation brief. It does not override
canonical product meaning. The review preserved these non-negotiable facts:

- one provider option is one provider, one service, and one branch;
- comparison is transient, same-service, two or three options, with no ranking or winner;
- price remains in its governed display mode and never implies quality;
- availability is advisory until booking commit;
- `REQUESTED` is not `CONFIRMED`;
- an alternative does not become the appointment before acceptance and revalidation;
- `ELIGIBILITY_REVIEW` is not attendable and is not automatic cancellation;
- no internal S/P/H/I, raw risk, money movement, or fabricated provider image appears;
- Arabic-first RTL, Western ASCII digits, Heroicons, canonical tokens, and light-only V1 remain in
  force.

The review read and used:

- root `AGENTS.md` and `CLAUDE.md`;
- `.claude/skills/patient-ui-preview/SKILL.md`;
- `.claude/skills/design-review/SKILL.md` and its `workflows/design-review.md` rubric;
- `accessibility/wcag-checklist.md` and `taste/design-taste.md`;
- `docs/ux/PHASE_05_HANDOFF.md`;
- the target sections of `docs/ux/04-specs/SCREEN_SPECS_PATIENT_01.md`;
- the `WGT-ELIG-001`, `WGT-BOOKING-001`, and `WGT-BOOKING-002` implementation contracts;
- the booking state machine and state-content/token mappings;
- the current target screen and shared-component implementation;
- `UX_RESEARCH_FINDINGS.md`;
- all current target screenshots in `artifacts/final` at 320, 390, and 414 pixels, plus all
  available Booking Detail lifecycle renders at 390 pixels.

No `NO_SHOW` or `COMPLETED` Booking Detail screenshot exists in `artifacts/final`; those states are
therefore not visually approved or scored here.

## 2. Executive findings register

| ID | Severity | Screen | Finding | Required resolution |
|---|---|---|---|---|
| B-01 | BLOCKER | `SCR-ELIG-005` | The comparison is two full provider cards stacked in sequence. It is not attribute-to-attribute and requires recall. At 320 pixels it is 1425 pixels tall before the patient can act. | Replace provider cards with stable attribute groups. Each group must show all selected providers' values together, including explicit unavailable values. Do not use horizontal page scroll. |
| M-01 | MAJOR | `SCR-ELIG-002` | Provider identity is text-only, the cards repeat a database-like fact pattern, and comparison progress is only visible after the complete list. The screen still reads like results documentation. | Add a reusable non-photographic provider identity anchor, compress practical facts into a glanceable band, make selected comparison state unmistakable, and expose a non-obscuring selection summary as soon as selection begins. |
| M-02 | MAJOR | `SCR-ELIG-003` | The detail screen is a longer copy of a result card. Provider identity, availability, rating, and price do not form a clear decision composition. | Use provider identity as the anchor, a short practical-facts group, in-content disclosures for secondary explanations, and one dominant booking action. |
| M-03 | MAJOR | `SCR-BOOKING-001` | Slot selection is still a series of day headings and time boxes. There is no explicit active-date state, so it feels like reading availability rather than scheduling. | Introduce an accessible date selector followed by a time grid for the active date, strong selected feedback, and a compact selected-appointment summary. |
| M-04 | MAJOR | `SCR-BOOKING-002` | The appointment is split across a date surface, provider text, price text, consequence paragraph, and two equal footer edit buttons. It is not one reviewable appointment object. | Compose one request receipt with dominant date/time, provider, branch/service, and price. Keep request-not-confirmation copy close to it. Move edit controls beside the facts they change. |
| M-05 | MAJOR | `SCR-BOOKING-004 REQUESTED` | A large amber surface makes normal waiting look abnormal even though the copy says no action is required. This fails the required emotional-state test. | Use a calm state hero and a separate compact deadline row. Preserve the canonical `REQUESTED` label and status semantics; do not promote the whole hero to warning emphasis. |
| M-06 | MAJOR | `SCR-BOOKING-004 ALTERNATIVE_PROPOSED` | The original and proposed times are separated by prose and unrelated surfaces, not perceived as one explicit change. Warning styling dominates the whole state. | Build one original-to-proposed appointment-change composition, keep the original first and authoritative, attach the deadline to the proposal, and keep accept dominant over decline. |
| M-07 | MAJOR | `SCR-BOOKING-004 CONFIRMED` | Success is stated, but the date/time is not an appointment ticket and the destructive cancellation action has nearly the same weight as rescheduling. | Lead with restrained reassurance, render a strong appointment ticket, subordinate reschedule, spatially separate cancellation, and keep cancellation confirmation. |
| M-08 | MAJOR | Journey | The shared visual vocabulary remains primarily header, helper paragraph, bordered or tinted rectangle, labels and values, then action bar. Correct tokens do not compensate for weak interaction composition. | Establish and reuse `ProviderIdentity`, `DecisionFacts`, `CompareTray`, `ComparisonAttributeGroup`, `DateSelector`, `TimeSlotGrid`, `AppointmentReceipt`, `StatusHero`, `AppointmentChange`, and `AppointmentTicket` patterns from existing canonical data. |

## 3. Six-dimension design-review score

These are rubric ratings based on the current screenshots and code inspection, not automated
conformance metrics.

| Dimension | Weight | Score | Evidence |
|---|---:|---:|---|
| Visual hierarchy | 20% | 4.2/10 | Clear headings and CTAs exist, but the target screens lack strong visual objects and repeat equal-weight text. |
| Consistency | 20% | 7.2/10 | Tokens, typography, surfaces, and action roles are consistent; the repeated vocabulary is consistently weak rather than purpose-specific. |
| Accessibility | 20% | 6.5/10 | Roles, labels, bidi isolation, focus helpers, and target tokens are present in code. Native screen-reader, maximum text scaling, focus-obscuration, and interaction-state evidence were not run in this review. |
| Usability | 20% | 4.8/10 | Primary actions are usually findable, but comparison requires recall and scheduling/review/status tasks still demand excess reading. |
| Responsiveness | 10% | 7.0/10 | The inspected 320/390/414 renders reflow without visible horizontal clipping. Long cards and action bars still create excessive vertical travel. |
| Performance | 10% | 5.0/10 | No production performance or current runtime timing was measured in this review. The preview contains no provider photography, but this is insufficient for a higher score. |
| Weighted overall | 100% | 5.7/10 | Below approval standard. B-01 alone fails the design regardless of the average. |

## 4. Twelve-dimension screen scores

Scale: 1 is materially obstructive; 10 is reference-quality. `PD` means progressive disclosure,
`RTL` means Arabic/RTL quality, and `HC` means healthcare appropriateness.

| Screen/state | VH | Glance | Task | Load | Mobile | Trust | Feedback | PD | RTL | Consistency | A11y | HC | Status |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `SCR-ELIG-002` Results | 4 | 4 | 6 | 4 | 6 | 6 | 4 | 4 | 8 | 7 | 7 | 6 | FAIL |
| `SCR-ELIG-003` Provider detail | 5 | 5 | 7 | 5 | 7 | 7 | 4 | 7 | 8 | 8 | 7 | 6 | FAIL |
| `SCR-ELIG-005` Comparison | 2 | 2 | 5 | 2 | 4 | 6 | 4 | 3 | 8 | 7 | 7 | 5 | FAIL |
| `SCR-BOOKING-001` Slot | 5 | 5 | 6 | 5 | 6 | 6 | 5 | 5 | 8 | 7 | 7 | 6 | FAIL |
| `SCR-BOOKING-002` Review | 5 | 5 | 7 | 6 | 7 | 7 | 5 | 6 | 8 | 7 | 7 | 6 | FAIL |
| `SCR-BOOKING-004 REQUESTED` | 4 | 4 | 7 | 5 | 6 | 6 | 4 | 7 | 8 | 7 | 7 | 4 | FAIL |
| `SCR-BOOKING-004 ALTERNATIVE_PROPOSED` | 4 | 3 | 7 | 4 | 6 | 6 | 4 | 7 | 8 | 7 | 7 | 4 | FAIL |
| `SCR-BOOKING-004 CONFIRMED` | 4 | 4 | 6 | 5 | 6 | 7 | 5 | 7 | 8 | 7 | 7 | 5 | FAIL |
| `SCR-BOOKING-004 ELIGIBILITY_REVIEW` | 4 | 4 | 7 | 5 | 6 | 6 | 4 | 7 | 8 | 7 | 7 | 5 | FAIL |
| `SCR-BOOKING-004 REJECTED` | 5 | 5 | 7 | 6 | 7 | 6 | 6 | 7 | 8 | 7 | 7 | 6 | FAIL |
| `SCR-BOOKING-004 CANCELLED` | 5 | 5 | 7 | 6 | 7 | 6 | 6 | 7 | 8 | 7 | 7 | 6 | FAIL |

The terminal states score better emotionally, but they remain part of the same text-and-surface
composition and are not independently approved.

## 5. Screen review and recomposition brief

### 5.1 `SCR-ELIG-002` Provider results

| Field | Review |
|---|---|
| Primary task | Scan currently eligible options, open one, or select two to three same-service options for comparison. |
| Required visual anchor | Provider identity, repeated consistently but clearly distinguished per option. |
| Current strengths | Service scope and no-ranking copy are clear. Price, verified rating, nearest appointment, practical eligibility, and branch are present. Selection semantics and a three-option cap exist in code. No fake photo or composite score appears. |
| BLOCKER | None. |
| MAJOR | M-01 and M-08. Identity is only a name. Key facts remain labels and values with similar weight. The comparison summary is after all results, so it fails to provide immediate global feedback after selection. |
| MINOR | Missing data is clear but visually heavy. The introductory description is longer than necessary once the comparison controls explain themselves. |
| POLISH | Add restrained pressed feedback and a subtle selected transition that fully disappears under reduced motion. |
| External references | [Zocdoc search principles](https://www.zocdoc.com/about/how-search-works/), [NN/g comparison tables](https://www.nngroup.com/articles/comparison-tables/), [Apple accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility/). |
| UI UX Pro Max | Accepted: mobile-first composition, 44-pixel target guidance, 8-pixel target spacing, visible state, and predictable back behavior. Rejected: new cyan/green palette, new font pairing, haptics, and horizontal-scroll journey. |
| Required changes | Add a governed neutral provider glyph or deterministic initials treatment; compact facts into a consistent decision band; make the row's selected state use surface, border, icon, text, and accessibility state; expose selected identities and count immediately without covering content; keep price and eligibility meanings separate. |
| Final status | FAIL until M-01 and M-08 are removed in rendered review. |

Implementation acceptance:

1. Within three seconds the patient can identify provider, branch/area, practical eligibility,
   governed price, verified rating, and nearest availability without reading a paragraph.
2. The provider anchor is not a fabricated portrait and does not imply quality or gender.
3. Selecting the first comparison option produces visible global feedback before the patient reads
   to the end of the list. It remains non-floating or reserves its complete layout space so it never
   obscures content or focus.
4. The canonical two-to-three, same-service, transient limit remains unchanged.

The current Phase 4 responsive text places the comparison tray at the end of the reading column,
while the Slice 1.6 brief requires feedback as soon as selection begins. The Lead must record the
presentation reconciliation. A floating overlay that hides content is not an acceptable shortcut.

### 5.2 `SCR-ELIG-003` Provider detail

| Field | Review |
|---|---|
| Primary task | Decide whether to book this exact provider, service, and branch option. |
| Required visual anchor | Provider identity paired with the practical choice facts. |
| Current strengths | Book is the dominant action. Back is secondary. Eligibility explanation is an in-content accessible disclosure. The option is correctly scoped and price/protection qualifiers are preserved. |
| BLOCKER | None. |
| MAJOR | M-02 and M-08. The same dense card anatomy from Results is enlarged rather than recomposed. The provider has no visual identity anchor, and the patient must parse several lines to understand the decision. |
| MINOR | The page header repeats context already inside the card. The assessment time is visually remote from its availability meaning. |
| POLISH | Give the book action a concise selected-context label only if it wraps safely at 320 pixels. |
| External references | [NN/g progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/), [Apple accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility/). |
| UI UX Pro Max | Accepted: one primary action, clear content priority, state clarity, and secondary information one interaction away. Rejected: new typography, dark mode, and a generic provider profile pattern that spans services. |
| Required changes | Build a provider identity header, a fixed-order practical-facts cluster, a distinct price treatment, and clearly labelled disclosures for price qualification, protection meaning, assessment time, and patient-safe eligibility explanation. Keep Book as the only dominant sticky action. |
| Final status | FAIL until the screen is visibly a provider decision, not a long result card. |

### 5.3 `SCR-ELIG-005` Provider comparison

| Field | Review |
|---|---|
| Primary task | Compare two or three same-service options on the same practical attributes and choose one. |
| Required visual anchor | The compared provider identities held stable while attributes are read together. |
| Current strengths | The no-ranking statement is explicit. Selection is a radio group. Missing values and governed price qualifiers remain visible. The layout has no visible horizontal page overflow. |
| BLOCKER | B-01. The screen compares card to card, not attribute to attribute. At all three widths the patient must retain provider A's price, rating, availability, and branch while scrolling through provider B. |
| MAJOR | The repeated full-detail links and full cards add vertical travel before any decision. The sticky booking action is disabled until a card is selected, but the comparison itself has not helped the patient reach that selection. |
| MINOR | Generic labels `الخيار 1` and `الخيار 2` are weaker than the existing provider identities. |
| POLISH | Highlight differing values through hierarchy only; do not declare a winner or use quality color. |
| External references | [NN/g comparison tables](https://www.nngroup.com/articles/comparison-tables/), [NN/g mobile tables](https://www.nngroup.com/articles/mobile-tables/), [NN/g explicit differences](https://www.nngroup.com/articles/explicit-differences/). |
| UI UX Pro Max | Accepted: recognition over recall, no horizontal page scroll, mobile-first reduction, touch-sized controls. Rejected: generic horizontally scrolling table/card guidance because it conflicts with the Patient one-column and gesture constraints. |
| Required changes | Replace `ProviderDecisionCard` instances with `ComparisonAttributeGroup` rows. Show service once. Keep provider identities stable. Use a fixed order: price, verified rating/count, nearest appointment, branch/area, practical eligibility, protection meaning, assessment time. Render unavailable explicitly. |
| Final status | FAIL. This is the release BLOCKER. |

Compact-width requirement:

- At 320 pixels, each attribute group may stack one short provider-value row per provider while all
  values remain inside the same labelled attribute group. This preserves attribute-to-attribute
  comparison without forcing three unreadably narrow columns.
- At 390 and 414 pixels, two or three value columns may be used only when Arabic labels and mixed
  values remain readable. Falling back to grouped value rows is preferable to truncation.
- Full provider cards, one-provider tabs, swipe-only comparison, and horizontal page scrolling do
  not resolve B-01.

### 5.4 `SCR-BOOKING-001` Slot selection

| Field | Review |
|---|---|
| Primary task | Choose an available day and time for the selected option. |
| Required visual anchor | The active date and its available time choices. |
| Current strengths | Provider context is compressed. Times are real controls with radio semantics, minimum target tokens, explicit unavailable text, and bidi isolation. The copy correctly says availability is advisory. |
| BLOCKER | None. |
| MAJOR | M-03 and M-08. Day headings are passive text, not selectable date states. The screen asks the patient to scan every day at once, so it remains a list rather than a scheduling interaction. |
| MINOR | Full provider details and change option are equal-weight footer buttons. Selected appointment context is not visible in the default footer. |
| POLISH | Use short, localized date labels with one dominant number and a restrained day label. Do not introduce decorative motion. |
| External references | [Material Design time pickers](https://m3.material.io/components/time-pickers/), [Apple accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility/), [W3C target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum). |
| UI UX Pro Max | Accepted: locale-aware dates, explicit selected state, touch targets, mobile-first reflow, reduced-motion support. Rejected: arbitrary dial/input time picker, haptics, and horizontal swipe-only date carousel. |
| Required changes | Present available dates as an explicit radiogroup; reveal the active date's time grid beneath it; retain unavailable slots in place; add selected surface, border, icon/text, and checked state; show a compact selected appointment above the Continue action. |
| Final status | FAIL until choosing a slot feels like scheduling at 320, 390, and 414 pixels. |

The widget must continue to select only server-projected discrete slots. No free-form calendar,
invented availability, held-slot language, or morning/afternoon grouping may be added unless the
existing data and canonical localization rule support it.

### 5.5 `SCR-BOOKING-002` Booking review

| Field | Review |
|---|---|
| Primary task | Verify the exact request and submit it, understanding that submission creates `REQUESTED`, not `CONFIRMED`. |
| Required visual anchor | One appointment request receipt with dominant date and time. |
| Current strengths | Date/time is stronger than in the old full provider card. The heading and CTA consistently say request. Submission state is inline, and the two edit routes remain available before commit. |
| BLOCKER | None. |
| MAJOR | M-04 and M-08. Appointment, provider, price, consequence, and edit actions are fragmented. The two edit buttons compete in the footer and make the action region look like a form toolbar. |
| MINOR | The large empty middle at 390/414 weakens confidence and continuity. Consequence copy reads as a paragraph rather than the single fact needed before submit. |
| POLISH | Use a light appointment-object surface with a stronger numeric/date hierarchy and restrained functional icons. |
| External references | [NHS confirmation-page pattern](https://service-manual.nhs.uk/design-system/patterns/confirmation-page), [W3C status messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages). |
| UI UX Pro Max | Accepted: one primary CTA, explicit submit feedback, concise consequence, and readable mobile hierarchy. Rejected: success styling before commit, payment summary, and generic confirmation checkmarks. |
| Required changes | Compose `AppointmentReceipt` from the exact slot, provider, branch, service, and governed price. Put `Change time` beside date/time and `Change option` beside provider context as quiet controls. Keep only `Send booking request` dominant in the action bar. |
| Final status | FAIL until the screen can be verified as one appointment request object within three seconds. |

### 5.6 `SCR-BOOKING-004` Booking detail

| Field | Review |
|---|---|
| Primary task | Understand the authoritative state, current appointment/request, next step, deadline if relevant, and only allowed actions. |
| Required visual anchor | State-specific hero followed by the current appointment object. |
| Current strengths | Labels and copy preserve lifecycle meaning. History is collapsed. Deadlines are separate. Allowed actions are server-projected in the real contract and intent roles are differentiated in the preview. Cancellation has confirmation. |
| BLOCKER | None in the rendered states; no screenshot evidence exists for `NO_SHOW` or `COMPLETED`. |
| MAJOR | M-05, M-06, M-07, and M-08. State meaning is still mostly prose inside a tinted rectangle, appointment facts are a plain text stack, and the visual object does not change enough with lifecycle meaning. |
| MINOR | Booking ID competes with orientation copy and is not visibly bidi-isolated. History disclosure uses a generic plus icon rather than a directional disclosure cue, though its label is clear. |
| POLISH | State transitions may use a short opacity change, but the state must remain fully understandable with reduced motion. |
| External references | [NHS confirmation-page pattern](https://service-manual.nhs.uk/design-system/patterns/confirmation-page), [NHS App appointment management](https://www.nhs.uk/nhs-app/help/appointments/managing-gp-appointments/), [W3C status messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages), [W3C focus not obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum). |
| UI UX Pro Max | Accepted: state clarity, one primary action, non-color status, compact deadlines, reduced motion, and safe sticky actions. Rejected: generic linear success stepper, autoplay animation, toast-only state, and invented calendar/directions actions. |
| Required changes | Replace the all-purpose `StateSummary` presentation with state-specific `StatusHero` composition and reuse `AppointmentTicket`; use `AppointmentChange` for alternatives; keep history collapsed; separate destructive action from routine management. |
| Final status | FAIL until the three required lifecycle states pass the emotional and newspaper tests. |

#### `REQUESTED`

- Keep the label `بانتظار تأكيد العيادة` and state meaning that the request arrived but is not
  confirmed.
- Use a calm neutral/information hero for the overall composition: one status icon, one short
  heading, one sentence, and `لا يلزمك إجراء الآن`.
- Keep the deadline as a separate compact row. Warning emphasis is appropriate only if canonical
  policy projects an approaching window.
- The canonical state-token file currently maps `REQUESTED` to warning/subtle. Do not silently
  rewrite that source in preview code. The practical resolution is to keep the governed status chip
  triple while removing warning color from the whole hero surface. Any change to the status token
  itself requires upstream UX-system reconciliation.

#### `ALTERNATIVE_PROPOSED`

- Present the original requested appointment first.
- Use one labelled direction/change cue, mirrored in RTL but given a textual accessible name.
- Present the proposed appointment immediately after it with stronger emphasis but not success
  styling.
- Keep the response deadline adjacent to the proposed time.
- Keep Accept as primary. Decline remains secondary and must use the canonical no-penalty closure
  wording. Do not add a second decline confirmation.

#### `CONFIRMED`

- Use a restrained success hero with the confirmation label and one reassurance sentence.
- Follow it with an appointment ticket whose dominant facts are date and time, then provider,
  branch, and service.
- Keep reschedule secondary. Move cancellation into a clearly separated destructive region and
  retain confirmation before cancellation.
- Do not add directions, add-to-calendar, or other unsupported actions.

#### Other rendered states

- `ELIGIBILITY_REVIEW`: warning emphasis is appropriate because attendance is blocked. Keep the
  current neutral, non-accusatory meaning and make `do not attend` the immediate fact. Do not offer
  reschedule or attendance actions.
- `REJECTED`: danger can identify the clinic refusal, but the screen must promptly offer the
  canonical route to another eligible option and must not imply patient fault.
- `CANCELLED`: restricted/neutral treatment is correct. Keep no-penalty wording where the reason
  supports it and avoid red punitive styling.

## 6. Newspaper test

Question: Does the screen still feel like reading a page rather than using an application?

| Screen/state | Answer | Why |
|---|---|---|
| Results | YES, FAIL | Repeated name, metadata, price, labels, values, and compare text with no visual identity anchor or immediate selection object. |
| Provider detail | YES, FAIL | A long bordered information card plus explanatory disclosure; the decision is not visually composed. |
| Comparison | YES, FAIL | Two complete records are read one after another. This is the clearest newspaper failure. |
| Slot | YES, FAIL | Day headings and time boxes form a readable list, not an active date-to-time scheduling control. |
| Review | YES, FAIL | Appointment facts and consequences are separate text blocks with form-like footer controls. |
| Requested | YES, FAIL | Status, meaning, next step, appointment, deadline, and history are stacked textual sections. |
| Alternative proposed | YES, FAIL | Original and proposal are separated descriptions, not one visual change. |
| Confirmed | YES, FAIL | Success is a paragraph card and the appointment is a text stack, not a returnable ticket. |

## 7. Emotional-state test

| Meaning | Current treatment | Result | Required emotional treatment |
|---|---|---|---|
| Routine waiting | Large amber panel with warning border | FAIL, MAJOR | Calm, informative, no-action-needed; warning only for a policy-projected approaching deadline. |
| Alternative proposed | Large amber panel plus separate pale proposal block | FAIL, MAJOR | Attention without failure; one clear original-to-proposed change with a response choice. |
| Confirmed | Green panel but weak appointment object and prominent cancellation | FAIL, MAJOR | Reassurance first, concrete ticket second, management actions subordinate, destructive action separated. |
| Eligibility review | Amber warning panel and `do not attend` copy | PASS emotionally | Caution is warranted; keep neutral and non-accusatory. Composition still needs the shared state/appointment object. |
| Rejected | Red refusal panel | PASS emotionally | Preserve factual refusal and direct recovery without blame. |
| Cancelled/unconfirmed closure | Restricted grey panel | PASS emotionally | Preserve non-punitive closure and no-penalty wording by reason. |
| Eligibility in provider discovery | Green practical availability chip | PASS emotionally | Keep it separate from rating, price, and any quality implication. |

## 8. Progressive-disclosure matrix

Every item below already exists in canonical Patient-safe data or state projection. Placement is a
presentation decision only.

| Screen | A: immediately visible | B: one interaction away | C: detailed |
|---|---|---|---|
| Results | Provider identity; branch/area; practical eligibility; governed price; verified rating/count; nearest appointment; comparison selected state | Price inclusion/extra-cost summary; protection meaning; more availability if already projected | Assessment timestamp and full patient-safe eligibility explanation |
| Provider detail | Provider identity; selected service and exact branch; practical eligibility; governed price; verified rating/count; nearest appointment; Book | Price qualification; protection meaning; assessment time | Full patient-safe eligibility explanation and deeper qualification evidence that the canonical contract permits |
| Comparison | Compared identities; aligned price; rating/count; nearest appointment; branch/area; practical eligibility; choose state | Protection meaning; price qualification | Assessment timestamps and full option detail/explanation |
| Slot | Chosen provider/service context; available-date selector; active date; times for active date; unavailable state; selected appointment; Continue | Change option; compact provider details | Full Patient-safe option detail and eligibility explanation |
| Review | Exact requested day/date/time; provider; branch/service; governed price; request-not-confirmation consequence; Submit | Change time beside time; change option beside provider | Price/protection detail and longer policy explanation only when required |
| Booking detail REQUESTED | Calm state hero; requested appointment object; no-action-needed next step; response deadline; allowed action | Provider detail; history count | Full append-only history and longer reason text |
| Booking detail ALTERNATIVE_PROPOSED | State hero; original appointment; proposed appointment; response deadline; Accept and Decline | Provider detail; history count | Full proposal and booking history |
| Booking detail CONFIRMED | Success hero; confirmed appointment ticket; permitted next action | Provider detail; reschedule; history count | Full history; separated cancellation flow |
| Booking detail ELIGIBILITY_REVIEW | Review state; do-not-attend instruction; preserved appointment; next step | Provider detail; history count | Safe reason/history details |
| Booking detail terminal | Closure/refusal meaning; requested appointment reference; recovery action | Provider detail; history count | Full reason and append-only history |

## 9. Cross-screen implementation requirements

The implementation agent must satisfy all items below before a new senior review.

### IR-01 Provider identity

- Implement one reusable non-photographic provider identity treatment across Results, Detail,
  Comparison, Slot, Review, and Booking Detail.
- Use a governed neutral provider glyph or deterministic initials. Do not infer appearance, gender,
  specialty quality, or trust from avatar color.
- Keep the full provider name visible. Long Arabic names wrap and are never truncated.

### IR-02 Decision facts

- Establish one fixed Patient decision order: price, verified rating/count, nearest appointment,
  branch/area, practical eligibility, protection meaning, assessment time.
- Vary density by context without changing meaning: compact Results, full Detail,
  attribute-group Comparison, short chosen context, receipt, and ticket.
- No composite score, winner treatment, or price-as-quality signal.

### IR-03 Comparison selection feedback

- Selection must show a non-color triple: selected surface/border, icon or text, and checked state.
- Announce selection count politely.
- After the first selection, show selected identities and count without making the user reach the
  end of all results and without obscuring focused content.
- Preserve the two-to-three cap and allow removal.

### IR-04 Attribute comparison

- Remove full `ProviderDecisionCard` rendering from `SCR-ELIG-005`.
- Use identical attribute groups with all provider values adjacent within each group.
- Show the common service once, unavailable values explicitly, and assessment time where required.
- At 320 pixels use grouped provider-value rows if columns cannot remain legible. Never revert to
  full cards or horizontal page scroll.

### IR-05 Scheduling interaction

- Implement date selection as a radiogroup and time selection as a second radiogroup for the active
  date, or an equally explicit accessible single-selection model.
- Date and time selection must be independently visible and announced.
- Selected time uses fill, border, text/icon, and semantic state; unavailable remains in place with
  its reason.
- Continue remains disabled with an associated reason until a slot is selected.
- Availability remains advisory and no language implies the slot is held.

### IR-06 Appointment object family

- Reuse one data mapping for `AppointmentReceipt`, `AppointmentSummary`, and `AppointmentTicket`.
- Review emphasizes that it is a request; Confirmed emphasizes that it is an appointment. The two
  must not share success styling.
- Date/time is the dominant visual fact; provider, branch/service, and governed price follow.
- All mixed-direction date, time, amount, currency, and record IDs are isolated.

### IR-07 State composition

- Keep canonical state label, meaning, allowed actions, and tone/icon ownership.
- Use a short `StatusHero` rather than a paragraph card. The hero contains state icon, label, one
  sentence, and next step.
- `REQUESTED` overall composition is calm. If the canonical warning chip remains, do not spread its
  warning surface over the entire hero.
- `ALTERNATIVE_PROPOSED` uses original-to-proposed composition and never displaces the original.
- `CONFIRMED` uses reassurance and an appointment ticket.
- `ELIGIBILITY_REVIEW`, `REJECTED`, and `CANCELLED` preserve their distinct emotional meanings.

### IR-08 Action hierarchy

- One dominant action per screen.
- Move edit/detail actions beside the facts they affect or into quiet disclosures instead of
  repeating equal footer buttons.
- Keep destructive actions visually and spatially separated from routine actions.
- Long Arabic labels may wrap or stack at 320 pixels; they may not truncate or reduce targets.

### IR-09 Accessibility and RTL

- Use React Native semantic controls with name, role, value/state, and visible focus.
- Selectable controls expose both native `accessibilityState` and the React Native Web state needed
  by the preview; do not rely on color.
- Live comparison counts, slot changes, submit state, and booking-state changes are polite status
  announcements without stealing focus.
- Directional arrows/chevrons mirror in RTL; state icons do not. Provider identity remains at the
  logical start. Date, time, amount, currency, rating numbers, IDs, and Latin text remain isolated.
- Sticky or persistent actions reserve enough space that focused content is not obscured.

### IR-10 Rendered acceptance gate

- Re-render each target screen at 320, 390, and 414 pixels.
- Re-render `REQUESTED`, `ALTERNATIVE_PROPOSED`, and `CONFIRMED` at 390 and at 320 where action or
  text wrapping is risky.
- Inspect all remaining supported Booking Detail states; add missing `NO_SHOW` and `COMPLETED`
  evidence if those states are represented by this preview contract.
- Verify selection states after interaction, not only default screenshots.
- Run the repository's current typecheck, Storybook build, Playwright checks, token validation,
  accessibility checks, and `git diff --check`. Report actual results only.
- Native VoiceOver, TalkBack, Dynamic Type, real-device safe areas, and production performance stay
  unverified until native device testing.

## 10. Nielsen heuristic assessment

| Heuristic | Result | Evidence |
|---|---|---|
| H1 Visibility of system status | FAIL | Selection feedback is local to each result while global comparison count sits after the list; lifecycle states are visible but over-rely on prose and tinted containers. |
| H2 Match with the real world | FAIL | Slot selection does not resemble choosing a date then a time; Review does not read as one appointment request object. |
| H3 User control and freedom | PARTIAL | Back, edit, decline, reschedule, and cancellation routes exist. Comparison removal is not available inside the current comparison screen. |
| H4 Consistency and standards | PARTIAL | Tokens and action roles are consistent, but one generic card/surface vocabulary is reused where task-specific patterns are needed. |
| H5 Error prevention | PASS WITH LIMITS | Disabled submit/continue, explicit unavailable slots, and cancellation confirmation exist. Browser and native runtime behavior were not executed here. |
| H6 Recognition over recall | FAIL | Card-to-card comparison requires the exact recall that the screen exists to eliminate. |
| H7 Flexibility and efficiency | PARTIAL | Direct option opening and change routes exist; long mobile comparison and repeated detail slow experienced users. |
| H8 Aesthetic and minimalist design | FAIL | Copy was shortened, but target screens still contain too many equal-weight labels and explanatory sentences. |
| H9 Error recognition and recovery | PARTIAL | Canonical recovery wording exists in shared components, but error-state screenshots were not part of the final target set inspected. |
| H10 Help and documentation | PASS WITH LIMITS | Eligibility and history disclosures are reachable, but the interface still explains routine behavior too heavily on primary screens. |

## 11. UI UX Pro Max evidence

Python was verified as `Python 3.14.5`. The following commands were run in this independent review,
with the required design-system query first:

```text
python search.py "Arabic RTL patient healthcare provider discovery comparison appointment booking calm trustworthy mobile" --design-system -p "UberTib Patient Slice 1.6" -f markdown
python search.py "doctor provider result cards identity rating price availability trust scanability mobile healthcare" --domain ux -n 12
python search.py "provider comparison attribute to attribute recognition over recall mobile no horizontal scroll healthcare" --domain ux -n 12
python search.py "appointment date selector time slot selected state mobile healthcare scheduling cognitive load" --domain ux -n 12
python search.py "pending appointment alternative proposed confirmed status hero calm waiting warning semantics healthcare" --domain ux -n 15
python search.py "progressive disclosure primary action sticky footer focus not obscured healthcare mobile" --domain ux -n 15
python search.py "Arabic RTL dates times mixed direction comparison calendar chevrons healthcare mobile" --domain web -n 15
python search.py "accessible selectable cards radio slots RTL focus mobile lists" --stack react-native -n 15
```

Useful findings applied:

- mobile-first composition and no unintended horizontal page overflow;
- one primary action and visible secondary hierarchy;
- 44-pixel mobile targets and at least 8 pixels between adjacent targets as an advisory design
  baseline, while the canonical target tokens remain authoritative;
- clear selected/disabled/focus states that do not rely on color;
- fixed/sticky regions must not obscure content;
- locale-aware date/time presentation;
- reduced-motion support;
- predictable back behavior and state preservation.

Rejected or constrained findings:

- `Horizontal Scroll Journey`, floating CTA, cyan/green palette, and Noto font pairing from the
  generated design system: they conflict with the canonical one-column layout, tokens, and type.
- The generic mobile-table recommendation to use horizontal scrolling: rejected for this Patient
  surface.
- Haptics, `expo-image`, a new navigation library, and performance libraries: unsupported by the
  preview contract and unnecessary to resolve the visual failures.
- The React Native `FlatList` result: relevant only if real list scale reaches the virtualization
  threshold; it does not repair the current visual hierarchy.
- The targeted Arabic RTL web query returned zero matches. External Apple and W3C sources control
  the RTL guidance instead of inventing a CLI result.
- The lifecycle query returned only generic submit/loading feedback. It did not provide healthcare
  state semantics, so canonical booking rules and external accessibility/healthcare sources control.

## 12. Current internet sources and applied guidance

The following pages were checked live on 2026-09-05:

- [Apple Human Interface Guidelines: Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility/): sufficiently sized and spaced controls, alternatives to gestures, familiar interactions, and lower cognitive complexity.
- [Apple Human Interface Guidelines: Right to left](https://developer.apple.com/design/human-interface-guidelines/right-to-left): mirror direction-sensitive controls and progress while preserving semantic glyph meaning.
- [W3C: Understanding WCAG 2.2](https://www.w3.org/WAI/WCAG22/understanding/): reflow, focus, name/role/value, target size, and status-message obligations.
- [W3C: Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum): a persistent author-created footer or tray must not hide the focused control.
- [W3C: Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum): 24 by 24 CSS pixels is the Level AA minimum or spacing exception; the app's larger target tokens remain the preferred Patient baseline.
- [W3C: Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages): dynamic selection, loading, and state updates need programmatic announcement without unnecessary focus movement.
- [W3C: Inline bidi markup](https://www.w3.org/International/articles/inline-bidi-markup/index.en): tightly isolate opposite-direction values and use automatic isolation for unknown runtime text.
- [React Native: Accessibility](https://reactnative.dev/docs/accessibility.html): interactive elements require meaningful labels and state; native iOS and Android behavior still requires native testing.
- [React Native: I18nManager](https://reactnative.dev/docs/i18nmanager): use runtime RTL direction only for direction-sensitive layout and animation; forcing RTL is for testing, not production behavior.
- [NN/g: Comparison Tables](https://www.nngroup.com/articles/comparison-tables/): compare offerings on consistent, meaningful attributes and let users control the compared set.
- [NN/g: Mobile Tables](https://www.nngroup.com/articles/mobile-tables/): narrow displays usually cannot legibly show more than two complex product columns, so reduce and restructure rather than shrink.
- [NN/g: Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/): keep common tasks and essential facts visible and defer secondary detail, especially on mobile.
- [NHS digital service manual: Confirmation Page](https://service-manual.nhs.uk/design-system/patterns/confirmation-page): acknowledge completion, show what happens next, and present submitted details without overwhelming the patient. UberTib must not apply confirmation styling before a booking is actually confirmed.
- [NHS App: Managing GP appointments](https://www.nhs.uk/nhs-app/help/appointments/managing-gp-appointments/): appointment management centers the concrete appointment and permitted management actions.
- [Zocdoc: How search works](https://www.zocdoc.com/about/how-search-works/): provider discovery should remain patient-directed. UberTib does not copy its ranking, insurance, instant-booking, or provider-photo behavior.

## 13. Approval conditions

The implementation stage may proceed from this brief. A later independent reviewer must not issue
PASS unless:

1. B-01 is eliminated by an actual attribute-to-attribute rendered comparison.
2. M-01 through M-08 are absent in the new screenshots.
3. Every target screen answers where the patient is, what matters now, and what to do next without
   reading several paragraphs.
4. Results have a strong provider anchor and visible comparison feedback.
5. Slot selection visibly moves from date to time and makes the selection unmistakable.
6. Review is one appointment request receipt, not a confirmation.
7. `REQUESTED` is calm, `ALTERNATIVE_PROPOSED` is a clear change awaiting a choice, and
   `CONFIRMED` is reassuring with a concrete appointment ticket.
8. No canonical business, clinical, financial, eligibility, or booking meaning changes.
9. The 320, 390, and 414 renders and interaction states are inspected, not merely generated.
10. Accessibility, RTL, token, build, and test evidence is reported exactly as executed.

Current senior reviewer decision: **FAIL**.
