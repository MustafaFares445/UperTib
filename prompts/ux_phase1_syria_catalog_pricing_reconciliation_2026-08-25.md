# Claude Directive — Reconcile Syria Catalog/Pricing Decisions Before UX Phase 2

The Product Owner has approved a new Syria-market catalog/pricing governance baseline.

Before doing any UX Phase 2 work, read in this order:

1. `.spec/decisions/PO-2026-08-25-syria-catalog-pricing-governance.md`
2. `docs/domain/CATALOG_PRICING_GOVERNANCE.md`
3. existing canonical owners: `docs/PRD.md`, `docs/SDD.md`, `docs/database/ERD.md`, `docs/database/DFD.md`, `docs/domain/PERMISSIONS_MATRIX.md`, `docs/domain/STAFF_INTERACTION_CONTRACTS.md`, `docs/domain/CROSS_PLATFORM_BEHAVIOR.md`, `docs/api/API_CONTRACTS.md`, `docs/api/ERROR_CATALOG.md`, `docs/TESTING_STRATEGY.md`, `docs/TRACEABILITY_MATRIX.md`, platform implementation plans, and UX Phase 1 artifacts.

Treat the new Product Owner decision as authoritative over conflicting lower-priority catalog/pricing assumptions.

## Key implementation principle

Catalog, price, market-band, risk, inclusion/exclusion, evidence/follow-up, modifier, display-mode and related operational values must be **data-driven and versioned wherever practical**.

Do not hard-code ordinary operational policy into:

- controllers;
- application actions;
- Filament resources/pages;
- React Native UI;
- seeders as production truth;
- `.env`;
- condition chains that require code deployment for routine Admin changes.

At the same time, do not turn safety/product invariants into Admin toggles. Keep the fixed invariants listed in `PO-SYRIA-15` enforced.

## Required product reconciliation

### Catalog

Model and document:

- G01–G04 broad groups;
- patient-facing service families;
- detailed procedure items;
- versioned mappings between them;
- Admin-managed labels/order/visibility;
- clinical approval before production use of clinically meaningful changes.

The current 26 services remain evaluation candidates; do not silently promote them to permanent production identities.

The customer Excel's ~100 rows are candidate detailed-procedure data; do not hard-code or auto-publish them.

### Pricing

Preserve:

`provider actual price -> versioned market/price policy -> internal P`

Do not allow a provider to choose P or A/B/C/D/F as a pricing menu.

Reject the Excel fixed multipliers as production logic.

Document/configure price modes equivalent to:

- FREE
- FIXED
- FROM
- RANGE
- REQUIRES_PLAN

Do not require every valid production service to have a positive fixed price.

### Market calibration

Document a governed data model for market observations and a versioned price-band policy with locality, service/procedure, sample/confidence, effective date, provenance, and approved statistical boundaries.

Do not label the Excel numbers as Aleppo market average.

Do not hard-code a minimum sample of 30 clinics.

### Currency

Patient-facing agreed Syrian V1 amounts use the applicable Syrian local currency by default.

Do not make USD canonical merely because the Excel uses it.

Do not hard-code an unofficial FX source or a universal 24-hour FX lock.

If normalization is needed, source/rate/time/rounding/policy must be governed data.

### Treatment plans and billing integrity

Add structured detailed treatment lines and document:

- procedure;
- quantity/unit;
- price;
- included content;
- approved modifier/material upgrade;
- third-party cost;
- additional clinical service;
- amendment/supersession.

Adopt the commercial integrity principles from `PO-SYRIA-11`.

Do not automatically make every procedure-specific Excel inclusion rule canonical. Those require approved procedure-definition content.

Do not hard-code the Excel ten add-ons. Use governed categories:

- additional clinical service;
- material/option upgrade;
- third-party cost;
- quantity change.

### Risk/eligibility

Use `service_risk_level` or equivalent, never plain `R`.

Do not use `R0 -> F` as an automatic rule.

Service risk, minimum/allowed scientific grade, required evidence/equipment/credentials and other clinical gates are versioned data requiring licensed clinical approval before production activation.

### Payments

Keep V1 zero-money-movement.

`payment inside the platform` means record/track external payment, not collect/hold/settle/refund money.

Payment-method categories may be data-driven but must not activate a payment integration implicitly.

## Admin configurability sweep

For every relevant requirement/data model/screen/flow, explicitly verify whether an ordinary future change can be made through a governed Admin workflow without code deployment.

At minimum cover:

- add/retire/rename/reorder service family;
- add/retire detailed procedure;
- family/procedure mapping;
- provider actual-price/effective period;
- price display mode;
- market observation/source;
- price band/confidence threshold;
- risk metadata;
- clinical eligibility prerequisite;
- evidence/follow-up/completion rule;
- allowed modifier/third-party category;
- proposal expiry/effective dates.

Where a value should remain a code/domain invariant, state why and reference `PO-SYRIA-15`.

## Files to reconcile

Update at minimum:

- `docs/PRD.md`
- `docs/SDD.md`
- `docs/database/ERD.md`
- `docs/database/DFD.md`
- `docs/domain/PERMISSIONS_MATRIX.md`
- `docs/domain/STAFF_INTERACTION_CONTRACTS.md`
- `docs/domain/CROSS_PLATFORM_BEHAVIOR.md`
- `docs/api/API_CONTRACTS.md`
- `docs/api/ERROR_CATALOG.md`
- `docs/diagrams/SEQUENCE_DIAGRAMS.md` where ordering changes
- `docs/ops/CONFIGURATION.md` where hard-coded policy assumptions exist
- `docs/TESTING_STRATEGY.md`
- `docs/TRACEABILITY_MATRIX.md`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/implementation/USER_IMPLEMENTATION_PLAN.md`
- `docs/implementation/CLINIC_IMPLEMENTATION_PLAN.md`
- `docs/implementation/ADMIN_IMPLEMENTATION_PLAN.md`
- `docs/ux/01-foundation/UX_FOUNDATION.md`
- `docs/ux/01-foundation/INFORMATION_ARCHITECTURE.md`
- `docs/ux/01-foundation/USER_FLOWS.md`
- `docs/ux/01-foundation/UPSTREAM_GAPS.md`
- `docs/ux/PHASE_01_HANDOFF.md`
- `docs/README.md` registry/glossary/status as needed.

Also remove stale statements in implementation plans that still describe already-resolved booking questions as unresolved.

## ID and traceability rules

- Preserve all existing IDs.
- Do not reuse resolved Q/CONFLICT/ASM identifiers.
- Allocate new FR/API/ERR/SDC/TASK/TC/SCR/FLOW/JTBD IDs only if genuinely necessary.
- Prefer extending an existing requirement where this decision clarifies it, but create a new requirement when the product behavior is genuinely new and independently testable.
- Update traceability and registries for every new ID.

## Validation

After reconciliation:

1. run `python docs/scripts/validate_docs.py` using the available interpreter;
2. run `python docs/ux/scripts/validate_ux_docs.py --phase 1`;
3. report exact counts and failures/warnings;
4. verify that no ordinary catalog/pricing value named above is documented as a hard-coded production constant;
5. verify accepted historical snapshots remain immutable under later Admin changes;
6. verify no Patient screen exposes P/raw service-risk/internal Excel multipliers as quality meaning;
7. verify V1 still contains zero money-movement behavior.

STOP at the updated Phase 1 gate. Do not start wireframes until the reconciliation is complete and validators are clean.
