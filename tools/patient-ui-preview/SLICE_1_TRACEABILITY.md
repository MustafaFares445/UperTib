# Slice 1 implementation map — Patient booking journey

Derived mechanically from `docs/ux/01-foundation/USER_FLOWS.md` → `docs/ux/04-specs/SCREEN_SPEC_MAP.md`
→ `docs/ux/04-specs/SCREEN_SPECS_PATIENT_01.md` → `docs/ux/04-specs/WIDGET_SPECS*.md` →
`docs/ux/05-build/IMPLEMENTATION_CONTRACTS.md` / `DESIGN_TRACEABILITY.md`. Not re-derived from this
prompt's conceptual six-stage list.

## Flows implemented

`FLOW-IDENTITY-001` → `FLOW-CATALOG-001` → `FLOW-ELIG-001` → `FLOW-BOOKING-001` (mandatory chain).

## Screens implemented (11)

| SCR | Screen file | Story |
|---|---|---|
| `SCR-IDENTITY-001` | `src/screens/IdentityEntryScreen.tsx` | `Patient/Screens/SCR-IDENTITY-001 Patient entry` |
| `SCR-IDENTITY-002` | `src/screens/PhoneEntryScreen.tsx` | `Patient/Screens/SCR-IDENTITY-002 Phone entry` |
| `SCR-IDENTITY-003` | `src/screens/CodeVerificationScreen.tsx` | `Patient/Screens/SCR-IDENTITY-003 Code verification` |
| `SCR-CATALOG-001` | `src/screens/ServiceGroupsScreen.tsx` | `Patient/Screens/SCR-CATALOG-001 Service groups` |
| `SCR-CATALOG-002` | `src/screens/ServiceDetailScreen.tsx` | `Patient/Screens/SCR-CATALOG-002 Service detail` |
| `SCR-ELIG-001` | `src/screens/ProviderSearchScreen.tsx` | `Patient/Screens/SCR-ELIG-001 Provider search` |
| `SCR-ELIG-002` | `src/screens/ProviderResultsScreen.tsx` | `Patient/Screens/SCR-ELIG-002 Provider results` |
| `SCR-ELIG-003` | `src/screens/ProviderDecisionScreen.tsx` | `Patient/Screens/SCR-ELIG-003 Provider decision card` |
| `SCR-BOOKING-001` | `src/screens/SlotSelectionScreen.tsx` | `Patient/Screens/SCR-BOOKING-001 Slot selection` |
| `SCR-BOOKING-002` | `src/screens/BookingReviewScreen.tsx` | `Patient/Screens/SCR-BOOKING-002 Request review and submit` |
| `SCR-BOOKING-004` | `src/screens/BookingDetailScreen.tsx` | `Patient/Screens/SCR-BOOKING-004 Booking detail` |

## Widgets implemented

| WGT | File | Used by |
|---|---|---|
| `WGT-IDENTITY-001` (verification challenge form) | inline in `PhoneEntryScreen.tsx` / `CodeVerificationScreen.tsx` | `SCR-IDENTITY-002/003` |
| `WGT-ELIG-001` (provider option set) | `src/widgets/ProviderOptionSet.tsx` | `SCR-ELIG-002` |
| `WGT-BOOKING-001` (slot/capacity selector) | `src/widgets/SlotSelector.tsx` | `SCR-BOOKING-001` |

## Components implemented

`CMP-PLATFORM-001` StateChip · `CMP-PLATFORM-003` SubjectContextHeader · `CMP-PLATFORM-004` ActionBar
· `CMP-PLATFORM-005` DeadlineIndicator · `CMP-PLATFORM-007` FilterSearchBar · `CMP-PLATFORM-008`
EventTimeline · `CMP-PLATFORM-009` EmptyState · `CMP-PLATFORM-010` RecoveryState ·
`CMP-PLATFORM-011` SubmissionStateIndicator · `CMP-ELIG-001` ProviderDecisionCard · `CMP-ELIG-002`
PriceDisplay · (WGT-PLATFORM-010 realized as) ValidationField.

## Deferred beyond Slice 1 (documented scope decisions, not gaps)

- `SCR-ELIG-004` (eligibility explanation) and `SCR-ELIG-005` (provider comparison) — real,
  documented screens reachable as optional branches from `SCR-ELIG-002/003`, not part of the
  mandatory `FLOW-BOOKING-001` chain. `SCR-ELIG-003`'s "why is this available" affordance is
  composed inline (the same `TXT-STATE-ELIG-001` practical-meaning copy) instead of a dedicated
  screen, to avoid a screen build that duplicates existing widget-level state coverage.
- `WGT-ELIG-002` (eligibility decision block) — its only binding is `SCR-ELIG-004`; not required by
  the core chain.
- `WGT-BOOKING-002` (proposal without displacement), `SCR-BOOKING-005`, `SCR-PLATFORM-001` — these
  belong to `FLOW-BOOKING-006/007` (patient responding to a clinic-proposed alternative), which is
  gated on a Clinic-platform action (`FLOW-BOOKING-003/004/005`) not simulated in this Patient-only
  preview.
- `SCR-BOOKING-004`'s CONFIRMED state is real product behaviour but is reached only after the
  clinic accepts the request; the Slice 1 flow correctly stops at `REQUESTED`.

## Known gap surfaced, not resolved

`CONTENT_GUIDE.md` states no Patient surface renders `TXT-STATE-CATALOG-001` (service-definition
governance chip), yet `SCREEN_SPEC_MAP.md` binds it to `SCR-CATALOG-001`. Not resolved here; the
implemented `ServiceGroupsScreen` renders only `active`-mode catalog content and never that chip,
consistent with the content guide.
