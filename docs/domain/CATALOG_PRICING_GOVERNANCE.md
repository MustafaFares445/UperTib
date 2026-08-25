# UberTib Catalog and Pricing Governance

**Status:** Canonical domain guidance derived from `.spec/decisions/PO-2026-08-25-syria-catalog-pricing-governance.md`  
**Scope:** Aleppo/Syria V1 catalog, provider pricing, market calibration, treatment commercial terms, Admin governance  
**Principle:** configurable/versioned where behavior is expected to evolve; hard invariants remain explicit and non-bypassable.

## 1. Purpose

This document defines the implementation-neutral shape of the catalog and pricing model after the Syria-market reconciliation.

The goal is to avoid future code changes for ordinary operational changes such as:

- adding or retiring a treatment item;
- changing patient-facing labels or grouping;
- adjusting price bands or market calibration;
- changing a provider price or price-display mode;
- updating inclusion/exclusion rules;
- changing a service risk level or evidence/follow-up requirement after proper review;
- introducing an approved modifier or third-party-cost category.

The goal is **not** to create an unrestricted rules engine or allow Admin users to bypass clinical, authorization, historical-integrity, or V1 financial boundaries.

## 2. Configuration classes

### 2.1 Catalog data

Admin-managed, versioned/governed data should cover:

- service groups;
- patient-facing service families;
- detailed procedure items;
- Arabic/English labels and descriptions;
- sort order and visibility;
- family-to-procedure mappings;
- billing unit / quantity semantics;
- patient-safe description of what exact price requires examination.

Stable identities used historically are never silently repurposed.

### 2.2 Clinical service-definition data

Drafts may be maintained through Admin, but production activation requires the configured clinical approval gate when the change affects:

- clinical scope;
- `service_risk_level`;
- minimum/allowed scientific grade;
- provider credential requirement;
- branch/equipment requirement;
- evidence requirement;
- inclusions/exclusions that carry clinical meaning;
- completion/follow-up/escalation rule.

These values are not constants in PHP, mobile code, Filament resources, or seeders.

### 2.3 Provider price facts

A provider/clinic price fact is scoped at minimum to:

- provider;
- branch;
- patient-facing family and/or detailed procedure according to the approved catalog model;
- price-display mode;
- amount/range when applicable;
- currency;
- effective period;
- provenance;
- superseded price reference when replaced.

Supported product meaning includes:

- `FREE`;
- `FIXED`;
- `FROM`;
- `RANGE`;
- `REQUIRES_PLAN`.

Final enum/storage naming may be refined during implementation, but the meanings must remain data-driven.

### 2.4 Market-price observations

Market calibration is independent from a clinic's own price fact.

An observation or imported evidence should retain enough information to support:

- service/procedure;
- locality;
- observed amount/currency;
- observation date/effective period;
- source type/reference;
- material/laboratory distinction when material;
- verification state;
- confidence/provenance.

The customer Excel prices may be loaded as candidate/pilot observations if useful, but they are not production market truth.

### 2.5 Price-band policy

Internal `P` is derived from a versioned price policy, never chosen manually by the provider.

The policy may contain approved values such as:

- locality scope;
- service/procedure scope;
- currency/normalization requirements;
- sample-confidence rules;
- median/percentile/range boundaries;
- calibration/provisional handling;
- effective dates;
- source/provenance requirements.

The rejected Excel A/B/C/D/F multipliers must not be embedded as default code behavior.

### 2.6 Currency normalization

If the product later needs currency normalization for analytics:

- approved source and rate are stored;
- source/target currency are stored;
- effective timestamp and policy version are stored;
- rounding behavior is policy data;
- accepted historical terms are not recomputed later.

A concrete FX provider or unofficial public index is not hard-coded into domain behavior.

## 3. Two-layer catalog

```text
G01–G04 broad groups
    -> patient-facing service families
        -> detailed procedure items
```

### Patient-facing service family

Purpose:

- discovery;
- provider comparison;
- understandable booking entry;
- simple Arabic presentation.

The current 26 seeded services are evaluation candidates only. Admin/Product/Clinical governance may change their future production grouping and mapping.

### Detailed procedure item

Purpose:

- clinician-authored treatment plan;
- quantities/units;
- detailed prices;
- evidence/follow-up rules;
- billing integrity;
- reporting and audit.

The customer Excel's roughly 100 rows are candidate data for this layer and require review before production publication.

## 4. Treatment-plan commercial model

Treatment plans must support structured, auditable detail rather than one undifferentiated total.

A plan may contain lines representing:

- detailed clinical procedure;
- quantity/unit;
- actual agreed unit/line price;
- included elements from the governing procedure definition;
- approved material/option modifier;
- approved third-party cost;
- reason/reference for an added clinical procedure;
- price-change/amendment history.

### Additional cost categories

Do not hard-code the ten Excel add-ons as one fixed list. Use governed categories:

1. additional clinical service;
2. material/option upgrade;
3. third-party cost;
4. quantity change.

Admin may maintain approved options/categories prospectively. Clinical additions still obey clinical review and clinician authorship boundaries.

## 5. Commercial integrity

The following are product invariants:

- no hidden charge can become accepted merely because the provider recorded it later;
- a component explicitly included by the governing procedure definition is not separately charged again without a valid new reason/change in treatment;
- material price changes require a governed amendment and patient acceptance before governing future treatment;
- third-party costs are attributable;
- quantity changes are explicit;
- unknown generic surcharges are not a supported production shortcut;
- accepted snapshots remain immutable;
- correction creates a later version/event rather than rewriting history.

Procedure-specific definitions of what is included remain governed data and require the appropriate clinical/commercial review.

## 6. Risk and eligibility

Use explicit terminology such as `service_risk_level`; do not use raw `R` because `R` belongs to patient-experience rating.

Rules:

- risk metadata is versioned service-definition data;
- risk alone never determines booking eligibility;
- the Excel `R0 -> F` shortcut is not product logic;
- allowed/minimum scientific grade is configured per applicable service/procedure definition and requires clinical approval;
- final eligibility continues to combine provider, branch, service, credentials, evidence, facility/equipment, scientific grade, and effective policy;
- patient UX receives practical eligibility meaning rather than raw risk codes.

## 7. Admin workspaces required

The Admin implementation plan should provide governed management for:

### Catalog

- service groups;
- patient-facing families;
- detailed procedures;
- mappings;
- draft/version lifecycle;
- visibility/order;
- retirement/supersession.

### Clinical service policy

- risk level;
- evidence;
- eligibility prerequisites;
- inclusions/exclusions;
- completion/follow-up/escalation;
- approval state and reviewer evidence.

### Commercial policy

- market observations;
- confidence/calibration;
- price bands;
- display modes;
- modifiers/categories;
- effective dates;
- currency-normalization source/policy if used.

### Governance

- draft/review/approve/schedule/retire;
- reason/provenance;
- version comparison;
- historical references;
- audit.

Admin UI visibility alone is never authorization.

## 8. Clinic workspaces required

Authorized clinic/provider actors should be able to manage:

- actual prices for their authorized branch/service scope;
- approved price-display modes;
- effective period;
- treatment-plan line items and quantities;
- approved modifiers/third-party costs;
- treatment amendments and price changes.

They must not be given controls to choose final `P`, scientific grade, `H`, `I`, final eligibility, or global market bands.

## 9. Patient projection

The Patient App should receive only the data needed for a clear decision:

- understandable service family;
- provider/branch;
- practical eligibility;
- actual price or clear price mode;
- what is included where relevant;
- what may require additional cost;
- treatment-plan details after examination;
- amendment explanation and new amount before acceptance.

Do not expose:

- internal `P`;
- raw `service_risk_level` code;
- Excel price multipliers;
- an `Aleppo average` claim while market evidence is insufficient;
- technical procedure-code complexity as the primary discovery UI.

## 10. V1 financial boundary

Configurable payment-method labels do not change the financial boundary.

UberTib V1 may record external payment/refund facts, but does not:

- capture money;
- hold balance;
- operate wallet/escrow;
- settle/payout;
- electronically execute a refund.

This boundary remains code/domain enforced and is not an Admin feature toggle.

## 11. Historical behavior under Admin changes

When an Admin changes catalog/pricing/policy data:

- new effective data applies prospectively according to its effective date;
- new discovery results use the current applicable version;
- a not-yet-accepted stale plan must be reissued when a material governing fact changed;
- already accepted treatment and financial snapshots continue to use their captured version/amount/rules;
- prior eligibility decisions remain reproducible;
- prior financial events remain append-only;
- audit/provenance records identify the actor, version, reason, and effective time.

This rule is mandatory to make frequent operational configuration safe.

## 12. Implementation anti-hardcoding checklist

Before considering catalog/pricing implementation complete, verify that ordinary business changes do **not** require editing code for:

- adding a service family or detailed procedure;
- renaming/reordering/hiding catalog content;
- mapping a procedure to a patient family;
- changing provider actual price/effective date;
- changing a price display mode;
- changing a market band;
- changing a market-confidence threshold;
- changing proposal expiry via approved policy;
- changing allowed modifiers/additional-cost categories;
- changing service risk metadata;
- changing evidence/follow-up/completion requirements;
- changing clinical eligibility prerequisites after required approval.

It is acceptable for genuinely new behavior/workflows to require code changes. Do not build a generic scripting/rules language solely to avoid every future development change.

## 13. Required reconciliation

Until the lower-level documents are reconciled, the Product Owner decision remains the higher-priority source.

Affected owners include:

- `docs/PRD.md`;
- `docs/SDD.md`;
- `docs/database/ERD.md`;
- `docs/database/DFD.md`;
- `docs/domain/PERMISSIONS_MATRIX.md`;
- `docs/domain/STAFF_INTERACTION_CONTRACTS.md`;
- `docs/domain/CROSS_PLATFORM_BEHAVIOR.md`;
- `docs/api/API_CONTRACTS.md`;
- `docs/api/ERROR_CATALOG.md`;
- `docs/TESTING_STRATEGY.md`;
- `docs/TRACEABILITY_MATRIX.md`;
- the three platform implementation plans;
- `docs/ux/01-foundation/*` and Phase 1 handoff.
