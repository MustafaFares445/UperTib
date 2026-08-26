# UberTib Catalog and Pricing Governance

**Status:** Canonical domain guidance derived from `.spec/decisions/PO-2026-08-25-syria-catalog-pricing-governance.md`  
**Reconciled:** 2026-08-25 into the canonical document set; the owner documents listed in section 13 now carry the detail  
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

### 2.2.1 Naming and terminology

The reconciliation fixed two names that were ambiguous in this document's first draft:

- **`service_risk_level`** is the clinical risk concept. Never `R`, which is the verified patient-experience rating. `PERMISSIONS_MATRIX.md` section 18 places raw risk codes in restricted-internal exposure.
- **Patient-facing service family** is the existing `services` table, not a new concept. `ERD.md` section 4.3 states this explicitly so implementation does not build a parallel catalog.

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

Final enum/storage naming may be refined during implementation, but the meanings must remain data-driven. Reconciliation resolved this into governed `commercial_options` rows of the price-mode category rather than a PHP enum (`ERD.md` section 6.13), with the behavior owned by `FR-ELIG-018`.

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

Internal `P` is derived from a versioned price policy, never chosen manually by the provider. Reconciliation added the explicit calibration qualifier `pricing_class_state` on the eligibility decision — `FINAL`, `CALIBRATING`, `PROVISIONAL`, `NOT_APPLICABLE` — so a non-final state is recorded honestly instead of a fabricated class (`STATE_MACHINES.md` section 7.1).

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

Reconciliation mapped these layers onto concrete owners: the family layer is the existing `services` table, the procedure layer is `procedure_items` plus `procedure_item_versions`, and the join is `service_family_procedure_maps` (`ERD.md` sections 4.3, 6.9–6.11). The behavior is owned by `FR-CATALOG-002` and `FR-CATALOG-003`.

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

Reconciliation made this enforceable rather than advisory: `treatment_line_modifiers.commercial_option_id` is NOT NULL and `reason_text_ar` is required, so the schema has **no path** for an uncategorized or free-text surcharge (`ERD.md` section 8.8), and `ERR-CLINICAL-002` is the stable rejection for a line that breaks a governed integrity rule.

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

## 13. Reconciliation status and owner map

The reconciliation completed on 2026-08-25. This document remains the readable overview of the decision; the canonical detail now lives with each owner, and where they differ the owner governs.

| Topic | Canonical owner |
|---|---|
| Requirement behavior and acceptance criteria | `docs/PRD.md` — `FR-CATALOG-002`, `FR-CATALOG-003`, `FR-ELIG-018`, `FR-ELIG-019`, `FR-CLINICAL-006`, `FR-CLINICAL-007`, `FR-POLICY-003` |
| Design shape and the configuration-over-code rule | `docs/SDD.md` sections 9, 10, 13, 18, 31 |
| Tables, columns, constraints, catalog transition strategy | `docs/database/ERD.md` sections 4.3, 6.4, 6.9–6.13, 8.2, 8.7–8.8, 9.3, 14, 15.1 |
| Information movement and calibration flow | `docs/database/DFD.md` sections 4, 7, 9, 13 |
| Catalog, clinical, and commercial authority split | `docs/domain/PERMISSIONS_MATRIX.md` sections 4, 7, 8, 10, 17, 18 |
| Staff workspaces | `docs/domain/STAFF_INTERACTION_CONTRACTS.md` — `SDC-CATALOG-001`–`003`, `SDC-ELIG-005`, `SDC-POLICY-002`, `SDC-CLINICAL-001` |
| Propagation and historical safety | `docs/domain/CROSS_PLATFORM_BEHAVIOR.md` sections 7, 7.1, 9.3, 11.2, 19, 28 |
| Lifecycle and the calibration qualifier | `docs/domain/STATE_MACHINES.md` sections 3, 6, 6.1, 7.1, 9, 16 |
| Patient projections | `docs/api/API_CONTRACTS.md` — `API-CATALOG-001`, `API-ELIG-001`, `API-CLINICAL-002`, `API-FINANCE-001` |
| Commercial-integrity rejection | `docs/api/ERROR_CATALOG.md` — `ERR-CLINICAL-002` |
| Configurability verification | `docs/TESTING_STRATEGY.md` section 30 |
| Environment-versus-policy boundary | `docs/ops/CONFIGURATION.md` sections 6.3, 23 |
| Coverage and status | `docs/TRACEABILITY_MATRIX.md`; the three platform implementation plans |
| Screens, flows, and copy obligations | `docs/ux/01-foundation/*` and `docs/ux/PHASE_01_HANDOFF.md` |

What remains open is not documentation: licensed clinical approval of production catalog and procedure content (`Q-CATALOG-001`) and of production S/H/I and calibration thresholds (`Q-ELIG-001`).
