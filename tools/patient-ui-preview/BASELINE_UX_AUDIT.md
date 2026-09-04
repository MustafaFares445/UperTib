# Slice 1 Patient UI baseline UX audit

Date: 2026-09-04

Baseline branch: `main`

Baseline SHA: `55653c85282da7a8f1da8003feed0adbbd0619d9`

Review widths: `320 x 780`, `390 x 844`, `414 x 896`

This audit was completed against the rendered Storybook preview before remediation code was
changed. Scores use a five-point scale: 1 = materially obstructive, 3 = usable but visibly weak,
5 = clear, calm, coherent, and ready for human visual approval.

## Journey-level baseline

| Dimension | Score | Evidence |
|---|---:|---|
| hierarchy and task focus | 2.5 | Short forms strand content at the top while actions sit far below; booking detail gives provider history equal or greater weight than current state and next step. |
| scanability and density | 2.5 | Provider results repeat full card anatomy and long inline metadata; booking review repeats nearly the full decision card. |
| consistency | 3 | Tokens and typography are centralized, but context, action order, disclosure behavior, and surface treatment vary by screen. |
| accessibility and RTL | 4 | Arabic-first RTL, persistent labels, focus rings, Western digits, and no default horizontal overflow are present. Disclosure semantics, list semantics, and state summaries need strengthening. |
| product semantics | 4 | REQUESTED is not CONFIRMED; no money movement or S/P/H/I is shown. Canonical provider comparison is absent and cancelled/rejected next steps are underspecified. |
| visual restraint | 3 | The palette is low-chroma overall, but dense bordered cards and a saturated deadline bar overstate secondary information. |

Baseline journey score: **63 / 100**.

## Screen-by-screen baseline

| Screen | Score | Baseline finding | Remediation target |
|---|---:|---|---|
| `SCR-IDENTITY-001` Patient entry | 3.5 | Clear promise and boundary, but the centered block still leaves an overlarge visual void and gives two footer actions near-equal weight. | Compact, welcoming entry hierarchy; one unmistakable next step with browse as a quiet alternative. |
| `SCR-IDENTITY-002` Phone entry | 3 | Form is understandable, but content and footer are visually disconnected; the disabled CTA plus repeated footer reason produces avoidable noise. | Bring instructions, field, validation, and next step into one compact task sequence. |
| `SCR-IDENTITY-003` Code verification | 3 | Clear OTP target, but retry/change-number actions compete with verification and the remaining-attempts text lacks contextual hierarchy. | Make verification primary, recovery secondary and progressive, with concise attempt/expiry context. |
| `SCR-CATALOG-001` Service groups | 3 | Flat rows follow the no-card rule, but long unfiltered content becomes an undifferentiated text stream. | Add a compact persistent service search and stronger group rhythm without new categories. |
| `SCR-CATALOG-002` Service detail | 3 | Calm and plain-language, but sparse composition creates dead space and does not surface the practical next decision strongly enough. | Use an intentional summary block and clearer transition into provider discovery. |
| `SCR-ELIG-001` Provider search | 3 | Service scope is preserved, but the screen is mostly a single optional field with little orientation. | Make service context explicit and area filtering clearly optional; keep search service-scoped. |
| `SCR-ELIG-002` Provider results | 2 | Three full bordered cards create card soup; key comparison facts are buried in prose; no canonical 2–3 option comparison selection exists. | Use compact scan rows, explicit compare selection, a transient tray, and a clear single-option route. |
| `SCR-ELIG-003` Provider decision | 2.5 | The repeated full card is dense and the explanation control competes in the sticky action area. | Establish provider identity, practical facts, and price hierarchy; move explanation into an in-content disclosure. |
| `SCR-BOOKING-001` Slot selection | 3 | Chosen context is quieter than before, but option details and footer actions still compete with the slot task. | Preserve a compact chosen summary, improve radio selection clarity, and keep change/details subordinate. |
| `SCR-BOOKING-002` Booking review | 2.5 | Repeats nearly all provider data, obscuring the exact appointment being submitted; edit actions crowd the footer. | Lead with appointment and request semantics, collapse provider details, and make edit routes quiet. |
| `SCR-BOOKING-004` Booking detail | 1.5 | Current state is a chip plus paragraph, deadline is a saturated full-width bar, provider card dominates, history is always expanded, and `تم` gives no meaningful next step. | State-first summary, explicit next step per lifecycle state, appropriately weighted deadline, compact appointment facts, and collapsed accessible history. |

## Shared-component baseline

| Component | Baseline finding | Required correction |
|---|---|---|
| `Screen` | Sticky footer is useful, but it exaggerates empty space on compact tasks and provides no page-header convention. | Support tighter task composition while preserving one reading column and reflow. |
| `ActionBar` | All visible actions share one wrapping row; destructive and secondary actions can sit beside the primary task, and absent reasons are detached. | Order by intent, allow quiet/link actions, separate destructive ceremony, and keep reasons associated. |
| `ProviderDecisionCard` | Long metadata sentence and repeated full anatomy cause density; `row`, `card`, and `chosen` are insufficiently distinct. | Create truly distinct compact, detail, comparison, and chosen presentations with fixed fact order. |
| `PriceDisplay` | Semantics are correct, but qualifier hierarchy varies and consumes two lines in every repeated row. | Provide compact/detail treatments while preserving governed modes. |
| `StateChip` | Correct triple and contrast, but screens rely on the chip as if it were a state summary. | Keep chip compact and add a separate state-summary composition where decisions depend on it. |
| `DeadlineIndicator` | Every live deadline is solid warning, regardless of urgency. | Render running windows as calm information, approaching as warning, and closed as restricted. Include absolute and remaining time. |
| `SubjectContextHeader` | Self-context redundantly renders `لحسابك` under the title. | Suppress self-authority noise; preserve both names only for representation. |
| `EventTimeline` | Items are flat but always visible and lack native disclosure/list semantics. | Add an accessible collapsed history disclosure with count and list semantics. |
| `SlotSelector` | Target sizes and radio state are sound, but selected state is too subtle and day groups lack group semantics. | Strengthen selected structure, keep unavailable slots explicit, and improve grouping. |
| `ValidationField` | Persistent labels and bound errors are sound; helper disappears on error and default autofocus makes static screenshots read as error/focus-heavy. | Preserve useful helper copy with errors and improve error/state association. |
| `FilterSearchBar` | Accessible label is present; it does not expose clear/reset behavior for discovery. | Add optional clear action and result-count context where used. |
| `SubmissionStateIndicator` | Copy distinguishes outcome states, but no icon or border distinguishes them without reading the full sentence. | Use the governed tone/icon/text triple and announce state changes politely. |

## Confirmed gaps and boundaries

- Direct provider search remains unresolved as an independent entry because `API-ELIG-001` requires
  `service_code`. This remediation keeps provider search service-scoped and does not invent an
  unscoped endpoint or cross-service ranking.
- `SCR-ELIG-005` provider comparison is confirmed by `PO-UX-04` and the approved screen map. It is
  therefore a missing Slice 1 implementation, not a future product idea. The remediation will add
  an ephemeral two-to-three-option comparison route using only existing provider projection fields.
- No payment, wallet, escrow, money movement, diagnosis, or internal S/P/H/I content will be added.
- No Slice 2 treatment, evidence, claims, guardian, or account surface is in scope.

## Baseline gate evidence

- `npm ci`: passed; 417 packages installed; 0 vulnerabilities reported by install audit.
- `npm audit --omit=dev --audit-level=high`: passed; 0 vulnerabilities.
- `npm run typecheck`: passed.
- `npm run storybook:build`: passed; bundle-size advisory only.
- `npm run test:e2e`: 25 passed, 28 intentionally skipped, 1 failed because Chromium could not
  capture one service-groups screenshot after the page/RTL/overflow assertions had passed. The gate
  remains unverified until a clean rerun succeeds.

Baseline screenshots are local QA artifacts under `artifacts/baseline/` and are intentionally not
product assets.
