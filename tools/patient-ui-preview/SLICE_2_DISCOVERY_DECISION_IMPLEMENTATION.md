# Requested Slice 2 — Discovery and Provider Decision UX Follow-up

Date: 2026-09-06

Branch: `fix/patient-slice2-discovery-decision-ux`

Writable scope: `tools/patient-ui-preview/**`

## 1. Scope reconciliation

The requested Slice 2 prompt described discovery → search → provider decision → appointment selection.
The repository's canonical preview sequence already placed service discovery, eligibility, provider
selection and booking inside Slice 1. This implementation therefore does **not** create a competing
slice taxonomy or duplicate those screens. It treats the request as a focused discovery/decision UX
follow-up over the existing canonical flow.

Authority remains:

`PHASE_05_HANDOFF.md` → `IMPLEMENTATION_CONTRACTS.md` → Phase 3 tokens/components → canonical Profile C
API contracts → Phase 4 Patient screen specifications → preview code.

## 2. What changed

### A — Guided provider search (`SCR-ELIG-001`)

Before:
- the optional area field visually looked like the whole task;
- service change competed with search in the sticky action bar.

After:
- the screen asks the patient where they prefer the clinic to be while explicitly keeping area optional;
- the chosen service is visible before the area input;
- changing service is now contextual to the chosen-service block;
- the sticky action area has one dominant action: `عرض الأطباء`.

Why:
- the patient has already chosen a service because `API-ELIG-001` requires `service_code`;
- the UI should not turn an optional within-Aleppo refinement into a technical filter form.

### B — Results context and filter recovery (`SCR-ELIG-002`)

Before:
- results were scannable, but an active area constraint was not surfaced as a directly removable
  decision context.

After:
- the results surface shows the option count and current geographic scope;
- an active area has a direct `إزالة فلتر المنطقة` action;
- the header explicitly states that UberTib does not rank or recommend a universal best doctor;
- existing comparison and provider-card semantics remain unchanged.

### C — Canonical patient-safe eligibility explanation (`SCR-ELIG-004`)

Before:
- `SCR-ELIG-004` was documented but deferred;
- `SCR-ELIG-003` expanded a generic explanation inline.

After:
- canonical `SCR-ELIG-004` is implemented as `EligibilityExplanationScreen.tsx`;
- canonical `WGT-ELIG-002` Patient variant is implemented as
  `EligibilityDecisionBlock.tsx`;
- `SCR-ELIG-003` now links to the explanation instead of expanding another paragraph;
- the booking journey preserves the exact provider/service/branch context while opening and closing
  the explanation.

The explanation contains only:
- exact provider, branch, area and service context;
- practical eligibility state;
- patient-safe controlling meaning;
- what the patient can do next;
- assessment timestamp.

It deliberately excludes:
- raw `I`;
- S/P/H mechanics;
- internal formulas, confidence, gate lists or policy versions;
- reviewer-only evidence;
- any composite or universal provider score.

### D — Catalog business-rule correction

The preview mock incorrectly exposed `تقويم الأسنان`, although the current product scope explicitly
places orthodontics outside MVP. The mock entry was removed and the remaining cosmetic group is now
labelled `تجميل الأسنان`.

This is a mock/projection correction only. No production catalog or API behavior is changed here.

## 3. Screen mapping after the follow-up

| Canonical screen | Preview implementation | Change |
|---|---|---|
| `SCR-CATALOG-001` | `ServiceGroupsScreen.tsx` | out-of-scope orthodontics removed from deterministic mock |
| `SCR-ELIG-001` | `ProviderSearchScreen.tsx` | guided search hierarchy and single dominant CTA |
| `SCR-ELIG-002` | `ProviderResultsScreen.tsx` | active area context + direct clear action |
| `SCR-ELIG-003` | `ProviderDecisionScreen.tsx` | explanation moved to progressive-disclosure route |
| `SCR-ELIG-004` | `EligibilityExplanationScreen.tsx` | implemented |
| `SCR-ELIG-005` | `ProviderComparisonScreen.tsx` | unchanged; already attribute-first and non-ranked |
| `SCR-BOOKING-001` | `SlotSelectionScreen.tsx` | unchanged; appointment selection behavior preserved |

## 4. Benchmark principles applied

The existing repository research plus a fresh review of common discovery patterns support four
principles used here:

| Principle | Adaptation in UberTib |
|---|---|
| Search starts from the patient's stated need, not an opaque provider score | service remains the required search context; no universal provider ranking was introduced |
| Progressive disclosure reduces decision-screen overload | eligibility reasoning moved to `SCR-ELIG-004` one navigation away |
| Comparison should align the same attributes instead of declaring a winner | existing `SCR-ELIG-005` was preserved rather than replaced with a recommendation score |
| Active filters need visible state and easy recovery | area scope is shown on results with a direct clear action |

No external product branding, color system or business logic was copied.

## 5. Explicitly not implemented

The prompt proposed several consumer-health patterns that the current canonical contracts do not
support as independent surfaces. They were not invented:

- **Universal doctor profile:** the canonical decision unit is one provider + one service + one branch.
- **Service-less doctor search:** `API-ELIG-001` requires `service_code`.
- **Raw scientific/price/protection/risk symbols on Patient UI:** current Phase 5 rules hide internal
  S/P/H/I mechanics from Patient surfaces.
- **Public provider-review feed:** the current discovery projection exposes verified-experience rating
  where available, but the repository does not define a public review-list contract for this route.
- **New branch-detail API or equipment audit screen:** discovery uses the patient-safe branch/location
  summary already defined by the contract.
- **New financial behavior:** no payment, wallet, escrow, money custody or settlement behavior was
  added. The V1 zero-money-movement boundary remains untouched.
- **New ranking/recommendation algorithm:** none added.

## 6. Business-rule verification

| Rule | Result |
|---|---|
| eligibility remains provider + service + branch scoped | preserved |
| `PENDING_EVALUATION` remains distinct from `NOT_ELIGIBLE` | preserved and covered by explanation stories/tests |
| result ordering is not re-sorted by an internal score | preserved |
| raw `I` is not public | preserved |
| S/P/H mechanics are not exposed on Patient surfaces | preserved |
| verified rating remains independent of eligibility | preserved |
| booking still revalidates at commit | preserved in copy and existing flow |
| authentication is still gated at booking commit | preserved |
| orthodontics is outside current MVP | corrected in preview mock |
| no V1 money movement | unchanged |

## 7. Accessibility / RTL review

The implementation continues to use:
- Arabic-first RTL composition;
- existing governed typography, spacing, state and action tokens;
- existing `ActionBar`, `StateChip`, `ProviderIdentity`, focus-ring and form primitives;
- semantic button/link roles;
- direct accessibility labels for filter removal and service-change actions;
- no color-only state meaning;
- no new icon set.

New Playwright coverage checks 320/390/414 horizontal reflow for eligibility explanation states and
runs axe serious/critical checks at the primary review width.

## 8. Test and evidence changes

Added/updated:
- `playwright/slice2-discovery.spec.ts`;
- existing booking journey assertion for the clearer search CTA;
- deterministic screenshot capture for provider search, filtered results and eligibility explanation;
- `SCR-ELIG-004` screen stories;
- `WGT-ELIG-002` semantic state stories;
- a filtered-results story;
- explicit regression test that orthodontics is not exposed by the current mock catalog.

Expected repository gate remains:

```bash
npm ci
npm run verify
```

plus the repository documentation/token validation workflow.

## 9. Review verdict before CI

### Product / business review

PASS at code/spec review level: no eligibility, booking, finance or ranking semantics were changed;
one existing mock violated the current scope and was corrected.

### UI/UX review

PASS at composition/code-review level: search has one dominant task, active filters are visible,
and eligibility explanation is progressively disclosed instead of adding more text to the provider
decision screen.

### Flutter / production-client review

Not applicable to this repository surface. The current Patient artifact is explicitly a non-production
React Native Web preview; no production Flutter or React Native application path is verified here.

### Rendered/browser review

Pending the branch CI and deterministic Storybook/Playwright render. Do not convert this section to a
final visual PASS unless those gates complete successfully.
