# Slice 11 — Protection Claims and Claim Appeals

## Scope

Slice 11 completes the high-risk Patient claims authoring path that Slice 10 intentionally deferred.

Implemented canonical surfaces and flows:

- `SCR-CLAIMS-003` — Protection claim
- `SCR-CLAIMS-005` — Claim appeal
- `FLOW-CLAIMS-002` — Submit a protection claim
- `FLOW-CLAIMS-007` — Submit a claim appeal
- Patient continuity for `FLOW-CLAIMS-009`
- `WGT-CLAIMS-001` — reused for Patient evidence/deadline reading
- `WGT-PLATFORM-008` / `CMP-PLATFORM-012` — reused for governed evidence-transfer states

This slice remains inside `tools/patient-ui-preview/**`; it does not add production persistence or a new backend contract.

## Protection claim — historical entitlement first

`SCR-CLAIMS-003` is reachable only when the immutable accepted terms contain applicable active protection. The Patient does not choose an internal protection level or discover eligibility by submitting a form and receiving an error.

The screen shows, in order:

1. the applicable protection from the accepted terms;
2. the historical claim window;
3. the evidence requirements and their per-item states;
4. the Patient narrative/requested remedy;
5. the submission action.

A defensive direct render without readable/active entitlement shows a non-authoring recovery, but the clickable flow structurally removes the protection-claim entry when the entitlement does not exist.

Protection copy stays conditional. It is never described as insurance, compensation, or a guaranteed outcome.

## Evidence is requirement-bound

The slice reuses the Slice 4 evidence-transfer model instead of inventing another upload system.

Evidence remains bound to a governed requirement. There is no generic upload bucket, storage path, object key, signed URL, scanner implementation, or vendor name exposed to the Patient.

The following distinctions remain structural:

- `FAILED_RETRYABLE` is a transport problem before authoritative review; the file is explicitly **not rejected** and the same transfer can resume/retry.
- `REJECTED` is an authoritative evidence outcome with a reason and replacement action.
- `UPLOADED` and `VALIDATING_SCANNING` do not satisfy a requirement.
- only `ACCEPTED` satisfies the submission gate.

While a file is uploading/uploaded/scanning, the screen does not offer a misleading generic “supply evidence” primary action. It waits for the transfer/validation state to resolve while keeping claim submission unavailable.

## Protection-claim projection invariants

The prototype `submitProtectionClaim` mirrors `API-CLAIMS-002` semantics without pretending to be production persistence:

- `claim_type`, requested remedy, narrative and evidence references are governed inputs;
- the governing protection/policy snapshot stays attached to the resulting claim;
- submission is rejected when the accepted snapshot cannot be read, entitlement is absent, the historical window has lapsed, or evidence is not accepted;
- a successful submission creates only a `SUBMITTED` protection claim;
- no amount, wallet, payment, refund, settlement, or custody fact is created;
- identical committed retries reuse the same result even if the historical submission window closes afterward;
- materially different payload under the same idempotency key is refused.

## Claim appeal — historical policy, append-only decision

`SCR-CLAIMS-005` reads the original claim decision before the Patient can write appeal grounds.

The screen then shows the historical policy snapshot and the appeal window derived from that governing snapshot. Current policy/configuration is never substituted for the version that governed the original decision.

The original decision remains visible and immutable throughout. Submitting an appeal creates a separate append-only appeal record; it does not rewrite the claim decision, its reason, its evidence history, or any external financial record.

Claim-appeal states remain distinct:

- `SUBMITTED` — مُقدَّم
- `UNDER_REVIEW` — قيد المراجعة
- `DECIDED` — صدر القرار

A decided appeal carries its outcome meaning in the reasoned decision, not in a success/failure color.

## Claim-appeal projection invariants

The prototype `submitClaimAppeal` demonstrates `API-CLAIMS-005` behavior:

- original decision must be readable;
- actor authorization and policy eligibility are distinct checks;
- the historical appeal window is authoritative;
- an expired window is not retryable for a new intent;
- an existing appeal suppresses duplicate authoring;
- identical committed retry resolves before the current deadline check, covering a response-lost-near-deadline case;
- materially different payload with the same key returns an idempotency conflict;
- supporting evidence references can be reused without introducing a second generic upload surface.

## Money and outcome boundaries

Neither a protection claim nor an appeal moves money.

No Slice 11 surface:

- collects or holds money;
- executes a payment or refund;
- creates a wallet/balance/escrow concept;
- promises financial compensation;
- describes protection as insurance;
- presents an approved remedy as already executed.

Where a later decision creates an obligation, execution remains external between the parties and is represented separately by the existing external-financial-event model.

## Privacy and Patient-safe projection

The Patient never sees:

- reviewer-only findings;
- S/P/H/I or other internal classification mechanics;
- risk/calibration internals;
- storage paths or signed links;
- scanner/vendor internals;
- unnecessary reviewer identity before a human decision is actually attributable in the Patient projection.

## UX behavior

- Arabic-first and RTL-first.
- One primary reading column.
- Governing context appears before effort.
- One dominant primary action at a time.
- Unrecoverable expiry is explained before authoring and is never styled as a retryable transport error.
- Evidence transport failure and evidence rejection lead to different next actions.
- Existing appeals remove duplicate commit affordances structurally.

## Storybook coverage

`SCR-CLAIMS-003` includes:

- default accepted-evidence state;
- retryable transfer failure;
- authoritative rejection;
- validation/scanning;
- retryable submit failure;
- expired claim window;
- defensive entitlement-unavailable state.

`SCR-CLAIMS-005` includes:

- default authoring;
- empty grounds;
- retryable submit failure;
- existing supporting evidence;
- expired historical window;
- unauthorized actor;
- policy-ineligible actor;
- unread decision;
- submitted, under-review and decided appeal states.

Clickable Storybook flows cover `FLOW-CLAIMS-002` and `FLOW-CLAIMS-007`.

## Playwright coverage

`playwright/slice11-protection-appeal.spec.ts` covers:

- RTL, reflow and serious/critical Axe checks for high-risk states;
- conditional-protection wording and entitlement gating;
- transport retry vs authoritative rejection;
- scanning evidence never satisfying a requirement;
- protection-claim idempotency, entitlement, window and evidence gates;
- no monetary fields on a successful protection claim;
- original decision + historical policy context before claim-appeal authoring;
- expired appeal windows as non-retryable;
- reuse of existing evidence references without a generic upload surface;
- appeal authorization, policy, duplicate and idempotency boundaries;
- integrated `FLOW-CLAIMS-002` and `FLOW-CLAIMS-007` paths.

`playwright/capture-slice11.spec.ts` is opt-in with `CAPTURE=1` and remains outside the automated CI gate.

## Deferred

The slice does not implement Clinic/Admin claim work or change claim-review authority. Remaining Patient roadmap work should move next into guardian/representation and remaining profile/account flows unless another canonical Patient claim surface is explicitly promoted into scope.

## Verification

Pending the pull-request `Patient UI Preview` workflow on the Slice 11 implementation head.
