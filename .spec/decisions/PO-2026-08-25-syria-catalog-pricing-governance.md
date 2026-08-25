# Product Owner Decision — Syria Catalog, Pricing, and Billing Governance

**Date:** 2026-08-25  
**Status:** Approved / authoritative  
**Scope:** Patient App, Clinic/Doctor Dashboard, Admin Dashboard, catalog, eligibility, treatment planning, pricing, financial records, and UX Phase 1 reconciliation  
**Market:** Aleppo, Syria — V1  
**Companion decisions:** all previously approved Product Owner decisions remain in force unless this file explicitly supersedes a conflicting lower-priority interpretation.  
**Source treatment:** the customer-supplied dental services/pricing Excel is a useful candidate input, **not** an authoritative production pricing or clinical policy source.

This decision records the Product Owner resolution after reviewing the customer Excel against the current UberTib product model and the Syrian-market direction. It is deliberately data-driven: catalog content, prices, market bands, display rules, clinical service definitions, and other policy values must be editable through governed Admin workflows wherever safe, instead of being embedded as hard-coded constants in application code.

## PO-SYRIA-01 — Configuration-over-code principle

The default implementation principle for catalog, pricing, service definitions, and commercial policy is:

> **Behavior that is expected to change operationally must be stored as governed data or versioned policy, not hard-coded in controllers, UI components, mobile code, Filament resources, seeders, or `.env`.**

This applies in particular to:

- service groups, patient-facing service families, and detailed procedure items;
- Arabic/English labels, descriptions, ordering, visibility, and mapping between patient-facing and professional catalog layers;
- service inclusions, exclusions, follow-up rules, evidence requirements, completion rules, and clinical risk metadata;
- allowed scientific grades / minimum eligibility requirements for a detailed procedure;
- clinic/provider actual price facts and their effective periods;
- price display mode (`FREE`, `FIXED`, `FROM`, `RANGE`, `REQUIRES_PLAN` or future approved equivalent);
- market observations, reference ranges, confidence, sample thresholds, locality, effective period, and price-band policy used to derive internal `P`;
- currency-normalization rules, approved exchange-rate source if normalization is used, and rounding/display policy;
- treatment-plan proposal validity, price-policy effective dates, and other commercial deadlines;
- allowed material upgrades, quantity changes, third-party-cost categories, and additional clinical-service rules;
- patient-safe copy attached to configurable states where operationally appropriate.

Changes to active policy are prospective. Historical accepted plans, price snapshots, eligibility decisions, financial records, and audit records remain immutable.

## PO-SYRIA-02 — Admin-editable does not mean ungoverned

The platform must allow authorized Admin users to maintain the above configuration without ordinary code changes, but sensitive changes remain gated by role and review.

### Catalog / Product Admin may

- create draft service groups, service families, and detailed procedure items;
- edit draft names, descriptions, order, visibility, mappings, and commercial presentation;
- retire/supersede catalog items prospectively;
- manage draft price-policy and market-observation configuration.

### Licensed Clinical Reviewer must approve before production activation when a change affects

- clinical service boundaries;
- risk level;
- required credentials or scientific-grade eligibility;
- clinical inclusions/exclusions;
- evidence requirements;
- follow-up/completion rules;
- patient-safety gates or treatment restrictions.

### Commercial / Policy Admin may approve according to separation-of-duties rules when a change affects

- market-price observations and confidence;
- price-band boundaries used for internal `P`;
- price display configuration;
- commercial inclusion and surcharge rules that do not redefine clinical care;
- effective dates and approved currency-normalization policy.

No generic `super admin` action may directly edit historical decisions or bypass required medical review simply because the value is configurable.

## PO-SYRIA-03 — Two-layer service catalog

UberTib uses two related catalog layers.

### A. Patient-facing service families

Used for discovery, comparison, booking, and understandable navigation. They use plain Arabic names and do not require the patient to understand professional procedure coding.

The existing 26 seeded services are **candidate evaluation content only**. They may be reused, merged, renamed, split, retired, or remapped after Product and Clinical review. They are not hard-coded production truth.

### B. Detailed procedure items

Used by clinicians and authorized staff for treatment plans, quantities, pricing, evidence, follow-up, billing integrity, and detailed reporting.

The approximately 100 rows in the customer Excel are accepted as a **candidate detailed-procedure dataset**, not as automatically approved production identities. They must be imported/reviewed as data, mapped to patient-facing families, versioned, and clinically approved before production use.

The Patient App must not present a flat list of 100 technical procedure codes as the primary discovery experience.

## PO-SYRIA-04 — Catalog identities and content must evolve without rewriting history

Once a stable catalog item has been used in accepted or historical records:

- its stable identity is not silently repurposed;
- changed meaning is represented by a new version or a successor item according to the owning catalog model;
- visibility may be retired prospectively without deleting history;
- accepted treatment/financial snapshots preserve the exact catalog/version references used at acceptance time.

Admin changes should normally create draft/versioned data rather than mutating published historical meaning.

## PO-SYRIA-05 — Provider actual price remains the primary patient price input

A clinic/provider records the actual price it intends to offer for the exact service/procedure and branch context.

Rules:

- the provider does **not** select internal `P`;
- the provider does **not** select A/B/C/D/F as a price menu;
- the Patient sees practical price information, not a pricing class;
- the provider price is effective-dated and superseded rather than silently overwritten when history depends on it;
- Admin can correct/verify governed price facts through an attributable workflow, but should not silently change a clinic's historical price assertion.

This preserves the current `actual price -> versioned price policy -> internal P` direction.

## PO-SYRIA-06 — Reject fixed A/B/C/D/F price multipliers

The Excel multipliers such as `A = 2C`, `B = 1.5C`, `D = 0.75C`, and `F = 0.5C` are **not** adopted as production pricing logic.

They may remain as source-document observations for audit only.

Internal `P` must instead be derived from an effective, versioned, service/locality-specific market-price policy built from actual observations and approved policy rules.

No fixed A/B/C/D/F multiplier is hard-coded in application logic.

## PO-SYRIA-07 — Market price is calibration data, not a mandatory tariff

UberTib V1 does not claim that the Excel values are the `Aleppo market average`.

Market-price policy must support configurable data such as:

- locality;
- service/procedure;
- observation source;
- observation date/effective period;
- sample count;
- distribution measures such as median/percentile/range where approved;
- confidence/calibration state;
- material/laboratory distinctions when materially relevant;
- provenance and reviewer approval.

If the evidence is insufficient, the system may keep internal market classification in `CALIBRATION`, `PROVISIONAL`, or another approved non-final state rather than manufacturing false precision.

The number of providers required for confidence is policy data, not a hard-coded constant such as `30`.

## PO-SYRIA-08 — Patient price modes are configurable

A service/provider price may be presented using a governed mode such as:

- `FREE` — explicitly zero-cost;
- `FIXED` — one stated amount;
- `FROM` — lower-bound estimate where clinically honest;
- `RANGE` — approved expected range;
- `REQUIRES_PLAN` — final price requires clinical examination/treatment planning.

The implementation must not require every production service definition to have a positive fixed price. A valid free service is allowed when the provider/policy explicitly defines it.

The Clinic/Admin interfaces manage these values as data. Patient copy uses understandable labels rather than enum names.

## PO-SYRIA-09 — Syrian currency presentation and FX

For Syrian V1 operations, the patient-facing agreed amount is denominated in the currently applicable Syrian local currency unless an approved future policy explicitly establishes another lawful display/contract mode.

Rules:

- USD is not the default canonical patient obligation merely because the Excel uses it as a reference;
- an unofficial public exchange-rate website is not an automatic production authority;
- if UberTib needs cross-currency normalization for internal analysis, the approved rate source, rate, timestamp, source currency, target currency, rounding method, and policy version are stored;
- exchange-rate source and normalization behavior must be replaceable through approved policy/configuration rather than code changes;
- accepted financial snapshots are not rewritten because an exchange rate later changes.

There is **no universal hard-coded 24-hour FX lock**.

## PO-SYRIA-10 — Treatment-plan acceptance is the commercial lock point

The patient must understand the planned treatment and price before acceptance.

The governing model remains:

1. discovery may show provider price, `FROM`, range, or `REQUIRES_PLAN` according to configured price mode;
2. after examination, the treating clinician creates the treatment plan with detailed lines and prices;
3. patient acceptance creates immutable treatment and financial snapshots;
4. later material treatment/price change requires a new amendment/version and patient acceptance before it governs future work, except only where an independently documented emergency rule explicitly applies;
5. accepted historical terms never change because Admin later edits current prices, catalog definitions, price bands, FX source, or policy.

Proposal expiration remains versioned policy data. The current V1 default of seven calendar days is not hard-coded and may be changed prospectively by authorized policy administration.

## PO-SYRIA-11 — Billing-integrity principles are adopted; clinical bundling examples are not automatically final

The following commercial integrity rules are approved:

- no hidden or off-plan charge may be treated as agreed;
- a component defined by the effective service/procedure version as `included` cannot be billed again as an unexplained duplicate charge;
- a material price increase or new charge must be disclosed before it governs treatment and must follow the amendment/acceptance workflow;
- third-party costs must be identifiable and attributable;
- quantity changes must be explicit;
- vague free-text surcharges such as `other extra fee` are not allowed as a substitute for a defined reason/category;
- complexity-based price changes require a documented reason and the applicable configured rule;
- billing corrections preserve history instead of rewriting accepted terms.

However, individual Excel statements such as whether a specific X-ray, suture, temporary restoration, laboratory step, or follow-up is *always* included are **candidate clinical/commercial definition content**. They become binding only when included in the approved versioned procedure definition.

## PO-SYRIA-12 — Do not hard-code the Excel ten add-ons

The ten Excel add-ons are not adopted as a single permanent hard-coded list.

The platform models additional cost through configurable governed categories:

1. **Additional clinical service** — a defined approved procedure item;
2. **Material / option upgrade** — an approved modifier with explicit price difference;
3. **Third-party cost** — attributable laboratory/hospital/pathology/other external cost;
4. **Quantity change** — explicit additional unit/site/tooth/other quantity according to the procedure unit.

Admin may manage the approved catalog of modifiers/categories and their applicability prospectively. Clinical additions that constitute a new treatment procedure remain subject to clinical approval.

Unknown free-text surcharge categories are not an approved production shortcut.

## PO-SYRIA-13 — Service risk is separate from patient rating and is not a sole booking rule

The Excel `R0–R3` values are candidate **service clinical risk metadata** only.

Technical/product terminology must use a name such as `service_risk_level` or `risk_tier_code`, not plain `R`, because `R` is already reserved for verified patient-experience rating.

Rules:

- risk level alone does not decide whether a doctor can perform a service;
- the Excel rule `R0 -> F allowed; R1/R2/R3 -> F forbidden` is **not** adopted as automatic production logic;
- eligibility is determined by the combined governed service/branch/provider requirements, scientific grade, credentials, facility/equipment, evidence, and effective policy;
- detailed procedure definitions may specify allowed/minimum scientific grade and other gates, but those values require licensed clinical approval before production activation;
- patient-facing UX presents practical eligibility and safety meaning, not raw risk codes.

These values must be editable as versioned service-definition data through the governed Admin + Clinical Review workflow, not code constants.

## PO-SYRIA-14 — Payment execution remains outside UberTib V1

The customer Excel phrase that can be read as `payment inside the platform` is interpreted for V1 as **recording the agreed charge/payment inside UberTib**, not executing or holding the money.

V1 continues to prohibit:

- payment capture;
- wallet/balance;
- escrow/custody;
- settlement/payout;
- platform-executed refund.

UberTib may record an externally executed payment/refund and its method category, then allow confirm/dispute/correction according to the existing append-only financial workflow.

External method categories may be Admin-managed data where useful, but enabling a new label must never implicitly create a money-movement integration.

The zero-money-movement V1 boundary is a product invariant, **not** an Admin toggle.

## PO-SYRIA-15 — What must remain hard product invariants

The goal is to avoid unnecessary hard-coding, not to make safety/integrity optional. The following remain enforced product rules and are not ordinary Admin toggles:

- no direct manual editing of final S/P/H/I or final eligibility outcome;
- no raw internal `I` exposure to ordinary users;
- no autonomous AI diagnosis or treatment-plan authorship;
- no production service publication without required clinical/readiness approval;
- no hidden financial charge being treated as accepted;
- no silent rewriting of accepted treatment/financial snapshots or historical decisions;
- no platform money movement in V1;
- no bypass of required authorization, separation of duties, or clinical review;
- no treating provisional evaluation data as production-approved clinical truth.

Everything else that is expected to evolve — especially service catalog content, price data, price policies, mappings, display modes, risk metadata, clinical requirements, follow-up rules, and permitted modifiers — should be modeled as governed data/versioned policy wherever practical.

## PO-SYRIA-16 — Admin UX requirements created by this decision

The Admin Dashboard must ultimately provide governed workspaces for:

- patient-service-family management;
- detailed procedure catalog management;
- family-to-procedure mapping;
- service-definition versioning and activation;
- market price observations and confidence/calibration management;
- price-band policy drafts/approval/effective dates;
- price-display rule management;
- material/option modifier and third-party-cost category management;
- service-risk and eligibility-requirement drafts with clinical approval;
- inclusions/exclusions/follow-up/evidence/completion-rule versioning;
- effective-date scheduling, retirement/supersession, provenance, and audit history.

The Admin experience should allow operational change without code deployment **only when the requested change fits the pre-defined governed data model**. A fundamentally new behavior or workflow can still require a code change; the product should not attempt to build an unrestricted rules engine merely to avoid all future development.

## PO-SYRIA-17 — Clinic UX requirements created by this decision

The Clinic/Doctor Dashboard must support, according to actor permission:

- recording actual prices by branch and relevant service/procedure scope;
- price mode selection from Admin-approved options;
- effective dates and superseding price facts;
- treatment-plan detailed lines, quantities, inclusions, defined modifiers/additional services, and price changes;
- clear amendment workflow instead of editing accepted historical terms;
- seeing only patient/provider-safe eligibility meaning rather than choosing internal classification outcomes.

Clinic actors cannot edit system market bands, final P, final scientific grade, or clinical policy unless they separately hold the authorized governance role.

## PO-SYRIA-18 — Patient UX requirements created by this decision

Patient-facing UX must prioritize:

- understandable service families rather than raw technical procedure codes;
- provider actual price, clear `free/fixed/from/range/requires plan` meaning;
- what is included, what may be additional, and when exact price requires examination;
- transparent treatment-plan line items after examination;
- clear explanation and acceptance of any material amendment before it governs future treatment;
- no presentation of internal P, raw service-risk codes, or price class as a quality grade;
- no misleading `Aleppo average` label while calibration evidence is insufficient.

## Excel input disposition

| Excel concept | Product decision |
|---|---|
| G01–G04 | Keep as the broad dental grouping baseline, subject to normal governed catalog management. |
| Approx. 100 detailed rows | Candidate detailed procedure data; import/review, do not hard-code or auto-publish. |
| Current 26 seeded services | Candidate evaluation patient-family content; not automatically promoted to permanent production truth. |
| A/B/C/D/F price multipliers | Rejected as production pricing logic. |
| Current numerical prices | Source observations / pilot reference only, not mandatory tariff or Aleppo market average. |
| `30 clinics` confidence rule | Not a hard requirement; confidence threshold belongs to versioned market policy. |
| USD canonical pricing | Rejected as the default patient obligation in Syrian V1. |
| Unofficial FX source / fixed rate | Rejected as automatic authority. |
| 24-hour FX lock | Rejected as universal behavior. |
| Free consultation as global rule | Rejected; price mode is provider/policy data. |
| R0–R3 | Candidate `service_risk_level`; clinically reviewed, versioned, not sole eligibility rule. |
| R0 -> F / higher risk -> no F | Rejected as automatic production rule. |
| 20 billing rules | Integrity principles partly adopted; procedure-specific inclusion examples require approved service-definition content. |
| 10 allowed add-ons | Reframed into governed additional-service/modifier/third-party/quantity categories. |
| `payment inside platform` | Means record/track the external payment in V1, not execute it. |

## Required reconciliation before further implementation or Phase 2 wireframes

This decision must be reconciled into the canonical documentation before implementation work relies on the older catalog/pricing assumptions.

At minimum update:

1. `docs/PRD.md` — catalog layers, actual-price behavior, configurable price modes, market calibration, treatment amendment and billing-integrity acceptance criteria;
2. `docs/SDD.md` — data-driven/versioned catalog-pricing design and separation between stable invariants and Admin-managed policy;
3. `docs/database/ERD.md` and `docs/database/DFD.md` — detailed procedures, mappings, price observations/policies, price modes, treatment-plan line items/modifiers/third-party costs, historical snapshots;
4. `docs/domain/PERMISSIONS_MATRIX.md` — Catalog/Commercial Admin versus Licensed Clinical Reviewer authority;
5. `docs/domain/STAFF_INTERACTION_CONTRACTS.md` — Admin catalog/pricing governance and Clinic price/treatment-line workflows;
6. `docs/domain/CROSS_PLATFORM_BEHAVIOR.md` — propagation of catalog/price changes and treatment amendments;
7. `docs/api/API_CONTRACTS.md` and `docs/api/ERROR_CATALOG.md` — patient-friendly price projection and treatment-line/amendment rules;
8. `docs/TESTING_STRATEGY.md`, `docs/TRACEABILITY_MATRIX.md`, and implementation plans — data-driven configuration tests and tasks;
9. `docs/ux/01-foundation/*` and `docs/ux/PHASE_01_HANDOFF.md` — reconcile affected catalog/pricing/treatment/admin screens and flows before Phase 2.

Do **not** start Phase 2 wireframes from stale assumptions. Do **not** change production application code merely to import the customer Excel before the canonical model is reconciled and the candidate data has passed the appropriate review gates.
