# UX Phase 5 Handoff — Build and Implementation Contract

**Phase:** UX 5 — Build and Handoff  
**Status:** Candidate complete — remote Phase 5 CI execution pending.  
**Scope completed in this run:** all remaining non-rendered, non-production implementation-handoff work.  
**Scope deliberately not performed:** actual Figma rendering/visual review and runtime accessibility QA.

## 1. Authority rule

The final implementation chain is:

canonical product/engineering sources
→ Phase 1 actors/jobs/flows/screens
→ Phase 2 wireframes
→ Phase 3 tokens/CMP/IX/TXT/A11Y
→ Phase 4 WGT and screen specifications
→ Phase 5 build manifest and implementation contracts.

Figma is derived visual evidence only. If a Figma render conflicts with `IMPLEMENTATION_CONTRACTS.md`, the implementation contract wins. If an implementation contract conflicts with a canonical requirement/API/SDC/domain rule, the canonical source wins.

## 2. Final measured baseline

| Family | Count |
|---|---:|
| FR | 60 |
| JTBD | 69 |
| FLOW | 103 |
| SCR | 165 |
| WF | 165 |
| CMP | 22 |
| IX | 26 |
| TXT | 60 |
| A11Y | 40 |
| ERR | 21 |
| WGT | 30 |
| Implementation contracts | 30 |
| Manifest frames | 509 |

Platform screens remain Patient 47, Clinic 56 and Admin 62.

## 3. Phase 5 artifacts

- `05-build/PHASE_05_IMPLEMENTATION_PLAN.md`
- `05-build/figma/BUILD_MANIFEST.json`
- `05-build/figma/NAMING.md`
- `05-build/IMPLEMENTATION_CONTRACTS.md`
- `05-build/DESIGN_TRACEABILITY.md`
- `05-build/FULL_CHAIN_VERIFICATION.md`

The manifest contains 137 component frames, 190 widget frames and 182 screen frames. It is ready for a separate Figma/design-agent execution; no actual Figma file is claimed to exist.

## 4. Implementation contract result

All 30 allocated WGT have exactly one contract and a unique build order.

Build order 1–14 covers platform widgets. Build order 15–30 covers:

15 `WGT-POLICY-001`  
16 `WGT-ELIG-002`  
17 `WGT-IDENTITY-002`  
18 `WGT-OPS-001`  
19 `WGT-CLINICAL-002`  
20 `WGT-IDENTITY-001`  
21 `WGT-ELIG-001`  
22 `WGT-FINANCE-001`  
23 `WGT-OPS-002`  
24 `WGT-BOOKING-001`  
25 `WGT-BOOKING-002`  
26 `WGT-CATALOG-001`  
27 `WGT-CLAIMS-001`  
28 `WGT-CLINICAL-003`  
29 `WGT-CLINICAL-001`  
30 `WGT-POLICY-002`.

Each contract carries the same 29-section implementation schema, canonical API/SDC ownership, target-path status, permission boundary, idempotency/correlation classification, data prerequisites, state rendering, tokens/content/A11Y/RTL obligations, immutability rules, framework defaults/prohibitions, definition of done and verification tiers.

## 5. Runtime ownership

### Patient

- Runtime target: React Native / `/api/v1`.
- Repository/path/scripts are still unverified under `TASK-PLATFORM-008`.
- Every Patient target remains `Proposed, path unverified`.
- No package, navigation, state, form or test command was invented.

### Clinic/Admin

- Runtime target: Filament.
- Existing Admin panel provider remains the verified panel anchor.
- Clinic panel and business Filament resource/page/widget areas remain Proposed until their implementation tasks create them.
- Stock/Extended/Custom realization follows Phase 4 and is not reclassified for implementation convenience.

## 6. Data and persistence baseline

Current ERD baseline: 54 business tables — 6 Existing and 48 Proposed.

Implementation translation surfaced three important facts:

1. Stage completion/reopening must preserve append-only transition history. Current `case_treatment_stages` fields do not by themselves represent repeated transition history, so the clinical implementation/data owner must resolve the persistence representation before stage mutation code.
2. No generic drafts table is required. Treatment-plan authoring uses the owning `treatment_plan_versions` DRAFT state; domain drafts remain owned by their aggregate/version model.
3. `TASK-PLATFORM-013` owns the durable Patient attention/notification entry model. `notification_intents` remain provider-neutral delivery intents and must not become the durable business/attention truth.

These are implementation/data prerequisites, not UX redesign requests.

## 7. Frozen product/UX boundaries

Implementation must not reopen:

- IA/navigation/SCR/FLOW/WF inventories;
- 22 CMP, 26 IX, 60 TXT, 40 A11Y and 30 WGT taxonomies;
- lifecycle meanings and status semantics;
- Patient hiding of internal S/P/H/I/calibration/risk mechanics;
- PENDING_EVALUATION vs NOT_ELIGIBLE;
- FAILED_RETRYABLE transfer vs REJECTED evidence;
- UPLOADED vs ACCEPTED;
- immutable accepted treatment/financial history;
- pending booking alternative vs confirmed appointment;
- guardian/representation revocation reachability;
- eligibility fail-closed behavior;
- governed/versioned configuration;
- zero-money-movement V1 boundary;
- light-only V1 shipping scope.

## 8. Open Q classification

Seven questions remain open and were not silently closed:

- `Q-PLATFORM-001`: blocks only the complete readable-SRS reconciliation claim.
- `Q-PLATFORM-002`: legal/compliance retention values.
- `Q-PLATFORM-004`: production capacity/headroom detail.
- `Q-PLATFORM-008`: final visual-brand palette ratification.
- `Q-CATALOG-001`: licensed clinical catalog/content approval.
- `Q-ELIG-001`: licensed clinical formula/threshold approval.
- `Q-OPS-001`: concrete infrastructure/provider selection.

The documentation/implementation handoff may proceed without inventing those values. Production/clinical/legal activation remains gated by the applicable authority.

## 9. Coding-agent reading order

1. repository `AGENTS.md`;
2. this handoff;
3. `05-build/IMPLEMENTATION_CONTRACTS.md`;
4. relevant design-token source;
5. canonical API or SDC owner;
6. relevant Phase 4 screen specification;
7. owning implementation task and database/domain sources.

A coding agent does not derive business behavior from Figma.

## 10. Design-agent reading order

A Figma/design agent reads:

1. `05-build/figma/BUILD_MANIFEST.json`;
2. `05-build/figma/NAMING.md`;
3. Phase 3 token source.

If the manifest is insufficient to build an approved frame without inventing behavior, report a manifest defect rather than making a product decision.

## 11. Accessibility and rendered QA status

Documentation binding is complete, but rendered/runtime evidence is deliberately separate.

**Tier B — rendered visual QA:** deferred to a Claude/design-agent or human review after a render exists. It must verify rendered contrast, hierarchy, Arabic glyph behavior, responsive composition, state distinction and token use.

**Tier C — runtime QA:** deferred until implementation. It must verify Arabic VoiceOver/TalkBack output, keyboard/focus, focus trap/return, target behavior, text scaling/reflow, reduced motion, real permission enforcement, error/status announcements and real device/browser behavior.

No Tier B or Tier C item is reported as passed by this handoff.

## 12. Traceability

`DESIGN_TRACEABILITY.md` records forward and reverse requirement-to-build joins. Every FR has at least one documented screen; every documented screen has its WF and Phase 4 WGT composition; every allocated WGT has a Phase 5 implementation contract.

`FR-CLINICAL-007` and `FR-POLICY-003` are intentionally carried through their owning disclosure/reader widgets rather than repeated mechanically in every screen block.

## 13. Maintenance rule

Any change to an earlier phase invalidates downstream evidence until rechecked:

- Phase 1 change → recheck 2, 3, 4, 5.
- Phase 2 change → recheck 3, 4, 5.
- Phase 3 change → recheck 4, 5.
- Phase 4 change → recheck 5.

## 14. Validation gate

The Phase 5 candidate commit promotes CI from UX `--phase 4` to `--phase 5` and keeps earlier mechanical gates active. It also runs the UX token, emoji and generated-component-token consistency checks in CI.

The final status becomes **Complete** only after the actual promoted workflow run passes. Until that run is measured, this handoff remains Candidate complete.

## 15. Production code

No Laravel, Filament, React Native, API, migration, model, policy, controller, service, resource/page/widget or production test implementation is part of this UX completion run.

## 16. STOP

Stop after this documentation/build-handoff gate.

The next work is either:

- derived Figma/render generation and visual review, or
- production implementation from the contracts.

Neither is started by Phase 5 itself.
