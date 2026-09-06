# UberTib Slice 1.6 Patient UX research findings

Date: 2026-09-05

Role: independent Senior Healthcare UX Researcher

Scope: research and recommendation only. This report does not authorize or implement production,
backend, clinical, financial, eligibility, ranking, or booking-lifecycle changes.

## Executive finding

The current preview preserves important product meaning, but the six target screens still ask the
patient to read too much text at nearly equal visual weight. Provider identity is weak, comparison
is still option-after-option rather than attribute-against-attribute, slot selection is a grouped
list rather than a scheduling interaction, and the three booking states rely too heavily on prose.
The most serious emotional mismatch is `REQUESTED`: normal waiting is presented in a large warning
surface even though no attention or abnormal condition exists.

The recomposition should keep the approved one-column, Arabic-first, light-only system and its
tokens, while changing the visual vocabulary to provider identity, decision facts, date and time
controls, appointment objects, state heroes, compact deadlines, and progressively disclosed
detail. It must not introduce provider ranking, fake images, instant-confirmation semantics, a new
palette, a new type family, or a platform-held payment model.

## Sources and authority used

The recommendations below were checked in this order:

1. Product Owner decisions, especially `PO-UX-04`, `PO-UX-07`, `PO-UX-12`, `PO-UX-13`, and
   `PO-UX-15`.
2. `docs/ux/04-specs/SCREEN_SPECS_PATIENT_01.md`, the state machines, Phase 5 implementation
   contracts, Phase 3 system guidance, and Patient preview traceability.
3. Current rendered Storybook screens and current preview code.
4. UI UX Pro Max as an advisory source.
5. Current external platform, accessibility, usability, and mature healthcare references.

The attached Slice 1.6 prompt is a requested design brief, not an independent product authority.
Its presentation direction is used only where it preserves the canonical data, state, permission,
and token contracts.

## Current rendered-screen audit

The current Storybook build was generated successfully with `npm run storybook:build`. The
following current renders were inspected visually:

| Screen | Screenshot | Observed anti-pattern |
|---|---|---|
| `SCR-ELIG-002` Provider results | `artifacts/screenshots/patient-screens-scr-elig-002-provider-results--default.png` | Repeated text-led rows; no visual provider identity; rating, price, and availability require line-by-line reading; comparison feedback appears after the long list. |
| `SCR-ELIG-003` Provider decision | `artifacts/screenshots/patient-screens-scr-elig-003-provider-decision-card--default.png` | A longer version of the result item; provider identity and practical choice remain weaker than the bordered information block. |
| `SCR-ELIG-005` Provider comparison | `artifacts/screenshots/patient-screens-scr-elig-005-provider-comparison--two-options.png` | Two complete option blocks are stacked; the patient must remember the first option while reading the second, so comparison is not attribute-to-attribute. |
| `SCR-BOOKING-001` Slot selection | `artifacts/screenshots/patient-screens-scr-booking-001-slot-selection--default.png` | Date labels and time buttons are readable but do not create a clear choose-date-then-choose-time scheduling model. The selected appointment is not yet the dominant object. |
| `SCR-BOOKING-002` Booking review | `artifacts/screenshots/patient-screens-scr-booking-002-request-review-and-submit--default.png` | The appointment is fragmented into headings and values rather than composed as one receipt or ticket. Two edit actions compete in the footer. |
| `SCR-BOOKING-004` Requested | `artifacts/screenshots/patient-screens-scr-booking-004-booking-detail--requested.png` | A large amber state surface makes normal waiting feel abnormal. The appointment is a text section rather than a reassuring object. |
| `SCR-BOOKING-004` Alternative proposed | `artifacts/research/booking-detail-alternative-proposed-390.png` | The warning surface dominates; original and proposed appointments are separated vertically instead of being perceived as one explicit change. |
| `SCR-BOOKING-004` Confirmed | `artifacts/research/booking-detail-confirmed-390.png` | Success is stated, but the confirmed date and time are not a strong appointment ticket; destructive and reschedule actions dominate the lower composition. |

The current provider photos question is resolved conservatively: the Patient-safe provider
projection supplies identity text but no verified portrait field. Use a non-photographic initials
avatar or a governed neutral provider glyph. Do not use stock imagery, infer appearance, or add a
photo field.

## Research findings

Each finding uses the exact requested handoff dimensions.

### 1. Provider discovery cards and provider trust

| Research area | Source | Observed pattern | Why it works | UberTib relevance | Recommended adaptation | Risks | What should not be copied |
|---|---|---|---|---|---|---|---|
| Provider search cards | [Zocdoc: How search works](https://www.zocdoc.com/about/how-search-works/) | Search results center the patient-entered need and expose practical choice factors such as location and availability. | It turns provider discovery into a decision task rather than a directory-reading task. | `API-ELIG-001` already exposes service scope, branch/location, price, rating, practical eligibility, and nearest appointment. | Lead each row with a strong non-photographic provider identity, then one compact decision-fact band: governed price, verified rating, nearest appointment, and practical eligibility. Keep service and branch context quieter. | A visually prominent fact can be mistaken for a rank signal. Maintain neutral ordering and never label a provider as best, recommended, or higher quality. | Zocdoc ranking, insurance language, instant booking, sponsored placement, photos, brand colors, and any claim that external availability equals UberTib commit-time capacity. |
| Provider trust | [Zocdoc: verified reviews](https://www.zocdoc.com/about/question/how-are-zocdocs-reviews-different/) | Review provenance is made explicit rather than relying on a star alone. | Patients can distinguish a verified-experience signal from an unqualified popularity number. | UberTib exposes a verified-experience rating and review count where available. | Pair the rating value and count in one glanceable unit labelled as verified experience. Keep practical eligibility separate; neither signal changes scientific eligibility. | A badge can imply broad credentialing or clinical endorsement. | Zocdoc's proprietary verification claims, quality implications, and any visual badge that exceeds UberTib's exact verified-experience meaning. |
| Provider identity | Apple accessibility guidance and UberTib canonical provider projection | Familiar, stable visual identity helps scanning, but identity must remain perceivable without relying on an image. | A repeated avatar shape plus name creates a fast anchor across results, detail, comparison, slot, review, and booking detail. | No verified provider-photo field is present. | Derive initials from the displayed provider name; keep the full name as text; use the same avatar treatment throughout the journey. | Initial extraction can be linguistically wrong for compound Arabic names if improvised. Keep it deterministic and verify with the mock names. | Fake stock clinicians, inferred gender, inferred appearance, decorative medical photos, or avatar color as a trust grade. |

### 2. Comparison selection and comparison composition

| Research area | Source | Observed pattern | Why it works | UberTib relevance | Recommended adaptation | Risks | What should not be copied |
|---|---|---|---|---|---|---|---|
| Comparison selection | [Nielsen Norman Group: Comparison Tables](https://www.nngroup.com/articles/comparison-tables/) | Dynamic comparison lets the user choose a small set and clearly communicates the limit and removal controls. | Selection is visible, reversible, and bounded before the user leaves results. | `PO-UX-04` allows transient selection of 2 or 3 same-service options only. | Give every provider row a selected surface, icon, and accessible checked state. After the first selection, expose a compact comparison summary with provider initials and a count. Keep it non-obscuring and reserve layout space. | The Phase 4 responsive contract places the comparison tray at the end of the reading column and prohibits a floating overlay. The Lead must preserve that non-obscuring requirement when satisfying the newer brief's visibility goal. | Persistent favorites, saved comparisons, cross-service choices, hidden selection limits, or a floating tray that obscures focused content. |
| Attribute comparison | [Nielsen Norman Group: Comparison Tables](https://www.nngroup.com/articles/comparison-tables/) | Offerings are columns and meaningful attributes are rows; consistent facts and order are essential. | It removes the need to remember one option while inspecting another. | UberTib has a fixed Patient-safe attribute set and specifically prohibits composite ranking. | Recompose `SCR-ELIG-005` as repeated comparison rows: attribute label, provider A value, provider B value, and provider C where space allows. Keep identities pinned as the comparison anchor and put price, rating, availability, branch, protection meaning, and assessment time in stable order. | The existing compact screen spec describes stacked option columns. An attribute-row compact presentation is a requested presentation change and should be explicitly reconciled by the Lead rather than silently claiming the old pattern. | Best-value highlighting, winner labels, synthetic scoring, missing-value omission, price-as-quality, or exposing internal S/P/H/I and classification math. |
| Mobile comparison | [Baymard: comparison features](https://baymard.com/blog/provide-comparison-features) | Mobile comparison panels can obscure a large portion of the viewport, and wide tables force horizontal memory-heavy navigation. | It identifies why a desktop grid cannot simply shrink onto a phone. | UberTib must work at 320, 390, and 414 with no horizontal page scroll. | At 320, show two provider values directly in each attribute row; if a third provider is selected, use an explicit provider switch while keeping one reference provider fixed, or vertically stack values within the same attribute row. Validate the final choice visually. | A third-provider switch can reduce direct comparability. The simplest acceptable fallback is to make the 320 layout two-provider-first and preserve the canonical three-option data without horizontal scrolling. | Horizontal page scroll, one full provider card at a time, a comparison panel that covers results, tiny checkboxes, or interaction based only on swiping. |

### 3. Provider detail and progressive disclosure

| Research area | Source | Observed pattern | Why it works | UberTib relevance | Recommended adaptation | Risks | What should not be copied |
|---|---|---|---|---|---|---|---|
| Decision detail | [Nielsen Norman Group: Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/) | Primary content and common actions remain visible; secondary explanations are deferred behind explicit disclosure. | It lowers initial cognitive load without deleting required information. | The provider-detail screen is optional and exists to deepen the result, not gate the journey. | Make provider identity, practical eligibility, governed price, rating, nearest availability, branch, and service the immediate decision layer. Place price qualifications, protection explanation, assessment time, and eligibility explanation in clearly labelled disclosures. | Hiding a controlling limitation or required price qualifier would create unsafe confidence. | Hover-only explanations, unexplained icons, long prose inside the sticky action area, or removing required qualifiers instead of moving them one interaction away. |
| Primary action hierarchy | Apple Human Interface Guidelines and UI UX Pro Max | One dominant affirmative action is visually separated from secondary navigation. | The patient can answer what to do next without scanning several equal buttons. | `Book this option` is the primary action; explanation and back are secondary. | Keep booking dominant in the reserved action region. Move `Why is this available?` into the content, and present back as a quiet navigation control. | A dominant booking action must disappear when the option is no longer eligible; disabled styling is not a substitute for canonical absent-and-explained behavior. | Multiple equal filled actions, a sticky disclosure control, or leaving a stale booking action visible. |

### 4. Date and time selection

| Research area | Source | Observed pattern | Why it works | UberTib relevance | Recommended adaptation | Risks | What should not be copied |
|---|---|---|---|---|---|---|---|
| Appointment date selection | [Material Design 3: Time pickers](https://m3.material.io/components/time-pickers/) and Doctolib public booking patterns | Scheduling controls present available time as a direct selection task with a clearly indicated selected value. | The interface feels like choosing an appointment, not reading a list of timestamps. | UberTib already has day labels, slot times, availability, and an advisory-until-commit rule. | Use a two-stage composition on one screen: selectable date controls first, then a time grid for the active date. Retain an accessible route to every available day and announce the selected date. | A horizontally scrolling date carousel would conflict with the no-horizontal-page-scroll and gesture-alternative requirements. A wrapped or bounded date selector is safer at 320. | A free-form calendar, invented dates, hidden unavailable slots, swipe-only navigation, or the Material dial picker; UberTib selects discrete server-projected slots, not an arbitrary time. |
| Time slot selection | UI UX Pro Max accessibility search and [Apple accessibility guidance](https://developer.apple.com/design/human-interface-guidelines/accessibility/) | Large controls, adequate spacing, visible selected state, and familiar tap behavior reduce errors. | Patients can confidently select one time on a small screen. | The current radio semantics are useful but the state needs stronger visual composition. | Group times into patient-meaningful sections only when the available data supports it; otherwise use a compact grid under the chosen date. Selected state uses fill, border, icon, and announced checked state. Unavailable stays in place with text. | Labels such as morning or afternoon must be derived deterministically from the actual time and localized; do not add them if no canonical convention is available. | Tiny chips, color-only selection, removing an unavailable slot without explanation, or suggesting the displayed slot is already held. |
| Selected appointment feedback | W3C [Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages) | A state change can be announced without moving focus or interrupting the task. | The patient receives immediate confirmation while continuing the selection flow. | Slot selection already uses a radio group and a disabled Continue action. | After selection, expose a compact sticky-but-reserved appointment summary and update the CTA with date/time context only if the label still wraps safely. Announce selection politely. | Repeating the entire provider card in the footer will reduce available space and can obscure focus. | Toast-only confirmation, focus theft, misleading reservation language, or a CTA that truncates the selected datetime. |

### 5. Booking review as an appointment object

| Research area | Source | Observed pattern | Why it works | UberTib relevance | Recommended adaptation | Risks | What should not be copied |
|---|---|---|---|---|---|---|---|
| Review and submit | [NHS confirmation-page pattern](https://service-manual.nhs.uk/design-system/patterns/confirmation-page) and Doctolib public booking material | A concise appointment summary groups location, date, and time as one recognizable object, followed by what happens next. | The user can verify the exact transaction before committing. | `SCR-BOOKING-002` must show option, slot, governed price, subject context, and that submission creates `REQUESTED`. | Compose a receipt with a dominant date/time block, provider identity, branch/service, and governed price. Put the request consequence directly below it. Keep one full-width `Send booking request` action; move time/option edits to quiet links adjacent to the facts they change. | A confirmation-looking receipt before submit can imply that the appointment is already confirmed. The heading and CTA must repeatedly use request language. | NHS green completed-state styling before commit, confirmation checkmarks, instant-booking semantics, payment details, or ungoverned add-to-calendar behavior. |

### 6. `REQUESTED`: calm waiting, not warning

| Research area | Source | Observed pattern | Why it works | UberTib relevance | Recommended adaptation | Risks | What should not be copied |
|---|---|---|---|---|---|---|---|
| Pending booking status | [Zocdoc appointment-status glossary](https://api-docs.zocdoc.com/guides/glossary) and [W3C Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages) | Pending booking is explicitly different from confirmed, and status updates are communicated without unnecessary interruption. | It reduces false certainty while avoiding an alarming error treatment. | UberTib `REQUESTED` means received but not confirmed, normally requiring no patient action. | Use a calm information state hero with a request-sent icon, short label, one-sentence meaning, and `No action needed now`. Present the response deadline as a separate compact information row. Reserve warning treatment for an actual approaching deadline or attention condition. | A linear progress stepper can imply that confirmation is guaranteed and ignore alternative/rejection branches. If used, it must communicate current process position without promising the next outcome. | Amber warning as the default pending surface, success styling, countdown anxiety, or wording that calls the request an appointment. |
| Booking history | [Nielsen Norman Group: Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/) | Secondary history is available through explicit disclosure rather than always expanded. | The current state stays dominant while provenance remains reachable. | Canonical Booking Detail requires append-only history and a collapsed accessible disclosure is already supported. | Keep history collapsed by default with a count; announce expanded state; preserve event order and full text. | A collapsed history cannot hide an active action or controlling deadline. | Technical event logs, infinite scroll, reordered events, or an unlabeled chevron-only disclosure. |

### 7. `ALTERNATIVE_PROPOSED`: visualize the change

| Research area | Source | Observed pattern | Why it works | UberTib relevance | Recommended adaptation | Risks | What should not be copied |
|---|---|---|---|---|---|---|---|
| Alternative appointment | UberTib `PO-UX-12`, booking state machine, and Zocdoc's distinction between pending reschedule and confirmed | Original and proposed appointment contexts remain distinct until acceptance. | Patients see exactly what would change and retain the correct reference appointment. | The original requested slot remains the reference; accepting the alternative revalidates capacity and eligibility. | Use one `Appointment change` composition: original appointment first, a directional change cue, then the proposed appointment with stronger emphasis. Put the proposal deadline close to the proposed time. Make accept primary and decline secondary, with canonical consequences. | The visual arrow is directional and must mirror appropriately in RTL; its accessible label must express change. The proposal must not look committed. | Replacing the original time, success styling on the proposal, hiding the response deadline, or copying reschedule behavior that automatically preserves a confirmed booking where UberTib's request-state rules differ. |

### 8. `CONFIRMED`: appointment ticket and reassurance

| Research area | Source | Observed pattern | Why it works | UberTib relevance | Recommended adaptation | Risks | What should not be copied |
|---|---|---|---|---|---|---|---|
| Confirmed appointment | [NHS confirmation-page pattern](https://service-manual.nhs.uk/design-system/patterns/confirmation-page) and [NHS App appointment management](https://www.nhs.uk/nhs-app/help/appointments/managing-gp-appointments/) | Completion is acknowledged first, then concrete appointment details and the next relevant management actions are shown. | It provides reassurance and creates a screen patients can return to for the appointment facts. | `CONFIRMED` is the first state where the selected date/time is a fixed appointment, subject to later governed actions. | Use a restrained success hero followed by an appointment ticket with dominant date/time, provider, branch, and service. Keep history collapsed. Present reschedule as secondary and cancellation as separated destructive action with confirmation. | Do not overstate success if the record is stale or in `ELIGIBILITY_REVIEW`; re-fetch and render the authoritative state. | NHS-specific services, add-to-calendar or directions unless supported, instant reschedule, or destructive action at equal weight with the appointment object. |

### 9. Sticky mobile actions, accessibility, and Arabic RTL

| Research area | Source | Observed pattern | Why it works | UberTib relevance | Recommended adaptation | Risks | What should not be copied |
|---|---|---|---|---|---|---|---|
| Sticky actions | W3C [Focus Not Obscured](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/) | Sticky content must not entirely hide the focused component. | Keyboard and assistive-technology users can see the item they are operating. | UberTib uses a sticky Patient action bar and must work on short viewports. | Reserve content inset equal to the actual action region plus safe area. Keep one dominant action; stack long labels at constrained widths; test focus near the end of every long screen. | A growing comparison tray or wrapped two-row footer can cover content if the inset remains fixed. | Floating overlays with no reserved space, auto-hiding primary actions, or content that ends behind the footer. |
| Target size and selection state | [WCAG 2.2 Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum) and [Apple accessibility guidance](https://developer.apple.com/design/human-interface-guidelines/accessibility/) | WCAG defines a minimum target or spacing exception; Apple recommends larger platform controls and adequate spacing. | Larger, separated controls reduce accidental activation and support limited dexterity. | Dates, times, comparison toggles, disclosures, and footer actions are high-frequency Patient controls. | Continue using UberTib target tokens and verify the rendered hit areas. Pair selected/disabled state with text or icon and semantics, never color alone. | Do not report a ratio, size, or WCAG pass until measured in the final render. | Tiny inline controls, closely packed icons, color-only state, or disabled and read-only sharing the same presentation. |
| Arabic RTL | [Apple right-to-left guidance](https://developer.apple.com/design/human-interface-guidelines/right-to-left) and [W3C inline bidi guidance](https://www.w3.org/International/articles/inline-bidi-markup/Overview.en.php) | The interface mirrors where direction has meaning, while mixed-direction phrases are tightly isolated. | Arabic reading order remains natural and numbers, dates, currencies, and Latin names do not reorder. | UberTib is Arabic-first, uses Western ASCII digits, and already includes a `Bdi` foundation. | Design the hierarchy in RTL from the outset. Keep provider identity at logical start, actions in logical order, directional arrows mirrored, status icons unmirrored, and every mixed-direction value isolated. | Visually correct direction can still have the wrong accessibility reading order. | Physical left/right styling, mirroring a calendar or status glyph without semantic reason, Arabic letter spacing, or embedding uncontrolled direction characters in copy. |
| React Native semantics | [React Native accessibility](https://reactnative.dev/docs/accessibility.html) and [React Native I18nManager](https://reactnative.dev/docs/i18nmanager) | Interactive controls expose name, role, and state; RTL layout can be detected for direction-sensitive behavior. | Native and web adapters receive semantic state rather than inferring it from appearance. | Comparison and slot controls are selectable; state changes and disclosures need selected/expanded/live semantics. | Preserve semantic `Pressable` roles, selected or checked state, `accessibilityLabel`, logical focus order, and polite state announcements. Use RTL detection only for direction-sensitive visuals or motion. | React Native Web browser evidence does not prove native VoiceOver or TalkBack behavior. | Forcing RTL in production, generic Views as controls, icon-only labels, or claiming native screen-reader success from Storybook. |

## Progressive-disclosure recommendation

| Screen | A: immediately visible | B: one interaction away | C: detailed |
|---|---|---|---|
| Results | Provider identity, practical eligibility, governed price, verified rating, nearest appointment, branch/area, comparison state | Price inclusion, protection meaning, more availability | Assessment detail and full eligibility explanation |
| Provider detail | Provider identity, service/branch, practical eligibility, price, rating, nearest appointment, primary booking action | Price qualification, protection meaning, assessment time | Full patient-safe eligibility explanation |
| Comparison | Provider identities and aligned price, rating, nearest appointment, branch, practical eligibility | Protection details and price qualifications | Full option detail and patient-safe explanation |
| Slot | Chosen provider/service context, date selector, times for active date, selected appointment, Continue | Full provider detail | Deeper eligibility explanation |
| Review | Exact requested appointment, provider/branch/service, governed price, request-not-confirmation consequence, Submit | Change time and change option | Price/protection detail |
| Booking detail | State hero, current appointment object, next step, relevant deadline, allowed primary action | Provider detail and history count | Full append-only history and longer reason text |

## UI UX Pro Max queries and decisions

Python availability was verified as `Python 3.14.5`. The required design-system search was run
first, followed by focused searches:

```text
python C:\Users\Mustafa_M_Fares\.codex\skills\ui-ux-pro-max\scripts\search.py "patient healthcare provider discovery appointment booking calm trustworthy Arabic RTL mobile" --design-system -p "UberTib Patient Slice 1.6" -f markdown
python C:\Users\Mustafa_M_Fares\.codex\skills\ui-ux-pro-max\scripts\search.py "doctor provider search cards trust rating price availability compare selection healthcare mobile" --domain ux -n 12
python C:\Users\Mustafa_M_Fares\.codex\skills\ui-ux-pro-max\scripts\search.py "doctor comparison attribute rows scanability mobile healthcare progressive disclosure cognitive load" --domain ux -n 12
python C:\Users\Mustafa_M_Fares\.codex\skills\ui-ux-pro-max\scripts\search.py "appointment date selector time slot chips review pending alternative proposed confirmed lifecycle sticky action" --domain ux -n 15
python C:\Users\Mustafa_M_Fares\.codex\skills\ui-ux-pro-max\scripts\search.py "Arabic RTL healthcare date time mixed direction calendar chevrons mobile" --domain web -n 15
python C:\Users\Mustafa_M_Fares\.codex\skills\ui-ux-pro-max\scripts\search.py "healthcare accessibility touch targets focus selected states non color dynamic text reduced motion" --domain ux -n 15
python C:\Users\Mustafa_M_Fares\.codex\skills\ui-ux-pro-max\scripts\search.py "React Native healthcare list cards accessibility labels selectable slots RTL performance" --stack react-native -n 15
```

The Arabic RTL `web` search returned no matches. The external RTL sources above supplied the
missing guidance; the absence of CLI results is retained as evidence rather than hidden.

### Accepted UI UX Pro Max findings

| Finding | Application |
|---|---|
| Accessible and ethical visual direction | Reinforces calm healthcare hierarchy, visible focus, restrained motion, and semantic controls. |
| Mobile-first composition | Recompose and inspect at 320, 390, and 414 before approval. |
| Strong focus and non-color state | Apply to comparison, dates, slots, disclosures, and lifecycle state changes. |
| Large touch targets with spacing | Apply through existing UberTib target and spacing tokens. |
| Reduced-motion support | Any selection or state transition remains understandable without motion. |
| Predictable back behavior and state preservation | Returning from detail or comparison must preserve search and transient comparison state. |
| Locale-aware date formatting | Preserve the repository's canonical Arabic wording, Western digits, and bidi isolation. |
| React Native accessibility roles and labels | Apply to every Pressable and selectable control. |

### Rejected or constrained UI UX Pro Max findings

| Finding | Decision and reason |
|---|---|
| Horizontal-scroll journey | Rejected. It conflicts with the one-column Patient contract, system gestures, and no-horizontal-scroll requirement. |
| Suggested cyan/green palette | Rejected. Canonical UberTib semantic tokens own all color. |
| Noto Naskh Arabic plus Noto Sans Arabic pairing | Rejected. Canonical typography tokens own the type family and scale. |
| Dark-mode pairing | Out of scope. UberTib V1 Patient preview is explicitly light-only. |
| Lucide or Phosphor icon defaults | Rejected. Heroicons is the governed UberTib icon vocabulary. |
| Generic autoplay, haptics, or Reanimated dependency | Rejected or deferred. No new dependency or native behavior is justified by the preview contract. |
| Generic React Navigation adoption | Rejected for this prototype. The repository intentionally uses local Flow state and leaves production navigation as a later decision. |
| Generic autocomplete | Rejected for this slice. No canonical suggestion contract exists. |
| Generic arbitrary time picker | Rejected. Patients choose only discrete server-projected slots. |
| Generic toast timing | Constrained. Important booking status cannot depend on a transient message and must remain visible. |

## Internet references

Authoritative platform and accessibility sources:

- [Apple Human Interface Guidelines: Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility/)
- [Apple Human Interface Guidelines: Right to left](https://developer.apple.com/design/human-interface-guidelines/right-to-left)
- [Apple Human Interface Guidelines: Layout](https://developer.apple.com/design/human-interface-guidelines/layout)
- [Material Design 3: Time pickers](https://m3.material.io/components/time-pickers/)
- [W3C: WCAG 2.2 Understanding documents](https://www.w3.org/WAI/WCAG22/understanding/)
- [W3C: Focus Not Obscured and Target Size in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
- [W3C: Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages)
- [W3C: Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)
- [W3C: Inline markup and bidirectional text](https://www.w3.org/International/articles/inline-bidi-markup/Overview.en.php)
- [React Native: Accessibility](https://reactnative.dev/docs/accessibility.html)
- [React Native: I18nManager](https://reactnative.dev/docs/i18nmanager)

Usability research and public mature-healthcare patterns:

- [Nielsen Norman Group: Comparison Tables](https://www.nngroup.com/articles/comparison-tables/)
- [Nielsen Norman Group: Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/)
- [Baymard: Product Comparison UX](https://baymard.com/blog/provide-comparison-features)
- [Zocdoc: How Search Works](https://www.zocdoc.com/about/how-search-works/)
- [Zocdoc: Verified Reviews](https://www.zocdoc.com/about/question/how-are-zocdocs-reviews-different/)
- [Zocdoc API: Appointment Status Glossary](https://api-docs.zocdoc.com/guides/glossary)
- [Zocdoc: Cancel or Reschedule an Appointment](https://www.zocdoc.com/patient-help/en/articles/8724732-how-do-i-reschedule-or-cancel-my-appointment)
- [NHS App: Managing GP Appointments](https://www.nhs.uk/nhs-app/help/appointments/managing-gp-appointments/)
- [NHS digital service manual: Confirmation Page](https://service-manual.nhs.uk/design-system/patterns/confirmation-page)
- [Doctolib: public video-appointment journey](https://www.doctolib.fr/sante/consultation-video/)

External products were studied for interaction patterns only. Their brands, colors, typography,
commercial rules, instant-booking behavior, payment behavior, and provider-ranking logic are not
recommendations for UberTib.

## Repository skills used

| Skill | How it influenced this research | Limitation |
|---|---|---|
| `.claude/skills/patient-ui-preview/SKILL.md` | Enforced authority order, Patient scope, direct canonical token use, Arabic-first/light-only constraints, and honest limits of web preview evidence. | None for this research role. |
| `.claude/skills/prototype/SKILL.md` | Kept recommendations at the current high-fidelity/code-prototype stage and mapped task, decision, and edge states before proposing composition changes. | Its referenced `workflows/prototyping.md` is absent from this checkout. |
| `.claude/skills/design-review/SKILL.md` | Applied an adversarial hierarchy/usability lens and the explicit newspaper test to current screenshots. | Its referenced workflow, accessibility checklist, and taste files are absent from this checkout; no scored final review is claimed here. |
| `.claude/skills/a11y-audit/SKILL.md` | Required name/role/state, target sizing, focus visibility, no color-only state, status announcement, and focus-not-obscured considerations. | Its referenced workflow files are absent; contrast and native screen-reader behavior were not measured in this research stage. |
| `.claude/skills/ux-writing/SKILL.md` | Drove task-focused, emotional-state-aware copy recommendations and separation of request, pending, proposed, and confirmed meanings. | Its referenced `content/voice-tone.md` is absent; final Arabic copy still needs the implementation and review gates. |
| `C:/Users/Mustafa_M_Fares/.codex/skills/ui-ux-pro-max/SKILL.md` | Supplied the required initial design-system search and focused mobile, accessibility, RTL, appointment, comparison, and React Native advisory searches. | Domain matching was broad and the focused RTL search returned no result, so primary sources and canonical docs control the gaps. |

## Patterns accepted

- Non-photographic provider identity anchor reused throughout the journey.
- Compact provider decision facts with a stable order and progressive detail.
- Visible, reversible 2-to-3 comparison selection without saving or ranking.
- Attribute-first provider comparison with missing values shown explicitly.
- Date-first, then time selection using only actual projected slots.
- Selected appointment feedback that remains visible and is announced politely.
- Appointment receipt for review, explicitly still a request before submit.
- Calm informational `REQUESTED` hero with deadline separated from state emotion.
- Original-versus-proposed appointment comparison for `ALTERNATIVE_PROPOSED`.
- Restrained success hero plus appointment ticket for `CONFIRMED`.
- Collapsed accessible history and in-content secondary disclosures.
- Reserved sticky-action space, one dominant action, and separated destructive action.
- Arabic-first logical order, bidi isolation, mirrored directional icons, and unmirrored status icons.

## Patterns rejected

- Provider ranking, best-doctor labels, composite scores, and price-as-quality signals.
- Fake provider photography, stock clinicians, inferred gender, or inferred appearance.
- Full provider cards repeated at every step.
- Card-to-card mobile comparison and horizontal page scrolling.
- A floating comparison overlay that obscures content or focus.
- Arbitrary calendar/time input instead of server-projected slots.
- Showing advisory availability as held or confirmed.
- Confirmation styling on the pre-submit review screen.
- Warning styling for routine waiting.
- A linear lifecycle stepper that promises confirmation or hides alternative and rejection branches.
- Treating a proposed time as committed before the patient accepts and revalidation succeeds.
- Platform-payment, wallet, insurance, funded-guarantee, or instant-booking metaphors.
- New palette, typography, icon family, dark mode, navigation framework, or animation dependency.
- Color-only states, swipe-only interaction, hover-only detail, and icon-only controls.

## Implementation handoff priorities

1. Recompose `SCR-ELIG-005` first as attribute-to-attribute comparison; this is the clearest test of
   whether the newspaper UI has actually been removed.
2. Establish reusable `ProviderIdentity`, `DecisionFacts`, `AppointmentSummary`, `StatusHero`, and
   `AppointmentChange` patterns from existing canonical data before editing individual screens.
3. Recompose slot selection into date then time, then propagate the selected appointment object to
   Review and Booking Detail.
4. Replace routine-warning `REQUESTED` treatment and visually differentiate alternative and
   confirmed states without changing their transitions or allowed actions.
5. Render every target screen at 320, 390, and 414. Inspect the three lifecycle states at 390 and
   any risky narrow layout at 320. Run the repository typecheck, Storybook build, Playwright suite,
   token validator, axe checks, and final independent review. Do not infer native VoiceOver,
   TalkBack, Dynamic Type, or real-device results from the web preview.

