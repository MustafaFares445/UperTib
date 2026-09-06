# UberTib Patient UI Preview — Slice 4 Evidence

Date: 2026-09-06

Branch: `feat/patient-slice4-evidence`

Base: Slice 3 verified head `c481ba0db79025c2367912666ef79a04538432ae`

Writable/product scope: `tools/patient-ui-preview/**` only. This remains a non-production React Native Web / Storybook preview.

## Canonical derivation

This slice implements the next item in the Patient preview sequence after treatment/case reading: **evidence**.

Authority was read in the repository-defined order, including:

1. `docs/ux/PHASE_05_HANDOFF.md`
2. `docs/ux/05-build/IMPLEMENTATION_CONTRACTS.md`
3. Phase 3 system, content, interaction and token specifications
4. `API-CLINICAL-004` and the provider-neutral `API-PLATFORM-001` evidence-transfer contract
5. `docs/ux/04-specs/SCREEN_SPECS_PATIENT_02.md`
6. `docs/ux/04-specs/WIDGET_SPECS_DOMAIN.md`
7. `docs/ux/04-specs/WIDGET_SPECS_PLATFORM.md`
8. `.claude/skills/patient-ui-preview/SKILL.md`

No new clinical, authorization or evidence behavior was invented from the preview.

## Implemented canonical Patient screen

| SCR | Surface | Preview file |
|---|---|---|
| `SCR-CLINICAL-006` | Stage detail | `src/screens/StageDetailScreen.tsx` |

The stage detail is the Profile C read-only Patient projection of `WGT-CLINICAL-003`. It shows patient-safe stage state, coverage, requirement meaning, prior completion attribution and reopening history. It exposes no control that changes stage state.

## Implemented widgets and components

- `WGT-CLINICAL-003` Patient `patient` variant: `src/widgets/StageExecutionPanel.tsx`
- `WGT-PLATFORM-008` Patient evidence-transfer panel: `src/widgets/EvidenceTransferPanel.tsx`
- `CMP-PLATFORM-012` evidence-transfer item: `src/components/EvidenceTransferItem.tsx`
- canonical lifecycle rendering remains owned by `StateChip` and the Phase 3 token source.

The preview icon subset was extended only with governed Heroicons vocabulary required by canonical treatment-stage/evidence states: `ellipsis-horizontal-circle`, `arrow-up-tray`, `cloud-arrow-up`, and `shield-check`.

## Stage-reading behavior

`SCR-CLINICAL-006` follows the canonical hierarchy:

1. stage identity and state;
2. what the stage covers from the accepted snapshot;
3. requirement status in patient-safe language;
4. recorded completion attribution/time/basis where available;
5. reopening as an appended correction with its reason;
6. return to the case timeline.

A reopened stage keeps the previous completion readable. Reopening is explicitly explained as a later correction, not an erasure or reversal of history.

The Patient surface does not expose private clinical evidence, raw storage data, signed links, scanner internals, stage-completion actions or stage-reopening actions.

## Evidence-transfer behavior

The Patient evidence UI implements the eight fixed provider-neutral session states from `TXT-STATE-PLATFORM-001`:

- `SELECTED`
- `UPLOADING`
- `PAUSED`
- `FAILED_RETRYABLE`
- `UPLOADED`
- `VALIDATING_SCANNING`
- `ACCEPTED`
- `REJECTED`

### Safety-critical separation: transfer failure versus rejection

`FAILED_RETRYABLE` is rendered as a transport problem before review. The UI states explicitly that the file was **not rejected** and offers resume/retry of the same item.

`REJECTED` is rendered only as an authoritative validation/review outcome, names a correctable requirement reason, and offers replacement rather than transport retry.

These states use their different governed tone/icon/emphasis triples; they do not share a generic failure surface.

### Safety-critical separation: uploaded versus accepted

`UPLOADED` states that the file arrived but is **not accepted yet**. It remains pending scan/validation.

`ACCEPTED` is the separate successful evidence outcome. A transferred or quarantined item is never counted or described as accepted.

### Requirement-bound evidence only

The evidence panel renders upload/add affordance only under a governing evidence requirement. When no requirement applies, the Patient sees a plain no-requirement state and no free-upload control.

The binary storage/transfer vendor remains outside the preview and bounded by `Q-OPS-001`; no provider/vendor behavior is invented here.

## Flow integration

The existing `Patient/Flows/FLOW-CLINICAL-008 Care reading` journey now routes stage events from the append-only case timeline into `SCR-CLINICAL-006` and back to the timeline.

The two stage events remain distinct in history: prior completion first, reopening later. The stage-detail surface reads that same correction relationship rather than creating an alternative source of truth.

## Preserved boundaries

This slice does **not**:

- allow a Patient to complete or reopen a treatment stage;
- expose private clinical evidence, storage paths, object keys, raw/private filenames, signed URLs, scanner internals or vendor names;
- treat `FAILED_RETRYABLE` as `REJECTED`;
- treat `UPLOADED` or scanning as `ACCEPTED`;
- invent an ungoverned/free-upload evidence bucket;
- implement claims evidence screens ahead of the claims slice;
- create production API, persistence, upload-provider or malware-scanner code;
- claim native resumability, VoiceOver/TalkBack, native focus or real-device behavior from this web preview.

## Verification coverage

`playwright/slice4-evidence.spec.ts` covers:

- RTL, horizontal reflow and browser-level serious/critical axe checks on high-risk Slice 4 surfaces;
- reopened stage preserving the prior completion and showing the correction reason;
- read-only Patient stage behavior with no completion/reopen/upload/download controls;
- patient-safe stage requirement wording derived from the accepted snapshot;
- retryable transfer failure explicitly not being a rejection;
- authoritative rejection offering replacement rather than transport retry;
- `UPLOADED` and `ACCEPTED` remaining visibly separate;
- no free-upload control when no evidence requirement applies;
- `FLOW-CLINICAL-008` opening stage detail from the case timeline and returning.

`playwright/capture-slice4.spec.ts` provides opt-in deterministic screenshot evidence when run with `CAPTURE=1`.

`package.json` promotes the Slice 4 suite into `test:smoke` and `verify` alongside the previous readiness, Slice 2 and Slice 3 gates.

## Verification status

Pending the branch pull-request CI run. This section must be updated only from measured GitHub Actions evidence.

## Next slice after this one

The next canonical Patient preview slice is **external financial history**. It must retain the V1 boundary that UberTib records externally performed financial events and does not present a platform wallet, payment, settlement or refund system.
