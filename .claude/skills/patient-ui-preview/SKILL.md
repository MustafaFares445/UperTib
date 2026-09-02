---
name: patient-ui-preview
description: Build and visually verify the non-production UberTib Patient UI using React Native components rendered through React Native Web Storybook, with Playwright screenshots, flows, RTL checks, and browser-level QA.
---

# Skill: UberTib Patient UI Preview

This skill orchestrates the repository's existing design skills for the Patient visual prototype.

## Scope

Work primarily in:

```text
tools/patient-ui-preview/**
```

Rendered-QA documentation may be updated only after actual rendered QA. Do not touch production Laravel, Filament, API, migration, or future Patient app code.

## Authority

Read in this order before changing UI:

1. `docs/ux/PHASE_05_HANDOFF.md`
2. `docs/ux/05-build/IMPLEMENTATION_CONTRACTS.md`
3. `docs/ux/03-system/**`
4. canonical Profile C `API-*` contracts
5. relevant `docs/ux/04-specs/SCREEN_SPECS_PATIENT_*.md`
6. `docs/ux/04-specs/SCREEN_SPEC_MAP.md`
7. preview code

Never infer product behavior from Storybook, screenshots, UI UX Pro Max, or aesthetic preference.

## Required skill sequence

For each vertical slice:

1. `prototype` — confirm the approved journey and edge-state coverage; do not redesign it.
2. `design-code` — generate React Native component/screen code using the existing UberTib token system.
3. `design-component` — implement and inspect reusable component states.
4. `design-qa` — run rendered, responsive, state, and visual checks.
5. `a11y-audit` — browser-level checks are Tier B evidence only.
6. `design-review` — perform visual hierarchy/usability critique after the render exists.

`ui-ux-pro-max`, when installed, is reviewer/advisor only. It may flag healthcare/mobile hierarchy, density, trust, and anti-patterns. It may not select a new palette, typography system, component system, navigation pattern, status semantics, or product behavior.

## Runtime model

- Author reusable UI with React Native primitives where practical.
- Render through `@storybook/react-native-web-vite`.
- Use mock canonical API projections; no real backend calls.
- Storybook stories are the visual catalog.
- A Flow story may use local React state to simulate navigation. Do not choose a production navigation/state library here.
- Playwright owns screenshots, viewport checks, RTL browser checks, and prototype flow automation.

## Patient rules

- Arabic-first, RTL-first.
- Smartphone-first.
- Light-only V1.
- Western ASCII digits.
- No hover-only behavior.
- Weak-connectivity/error/offline states remain visible where specified.
- No optimistic clinical, financial, or authorization outcomes.
- Internal S/P/H/I, calibration, weights, confidence, risk codes, and clinical scoring remain hidden.
- `PENDING_EVALUATION` is not `NOT_ELIGIBLE`.
- `FAILED_RETRYABLE` is not evidence `REJECTED`.
- `UPLOADED` is not `ACCEPTED`.
- A pending booking alternative never visually replaces the confirmed booking.
- External financial history must never look like a platform wallet/payment/settlement system.
- Read-only historical data stays full contrast; read-only is not disabled.
- Guardian/representation revocation remains reachable.
- Heroicons is the governed icon vocabulary. Do not silently adopt Lucide or another icon set because a generic skill recommends it.
- The concrete Patient icon package remains a production-stack decision.

## Token rule

Consume the canonical DTCG files directly from:

```text
docs/ux/03-system/design_tokens/
```

Do not duplicate or fork them. Build a preview adapter that resolves primitive -> semantic -> component aliases into React Native values. If a needed value is absent, report the upstream token gap instead of hardcoding a replacement.

The initial Environment/Readiness story is a technical scaffold and is exempt from design fidelity. Substantive Patient UI is not.

## Story taxonomy

Use stable titles:

```text
Patient/Foundations/...
Patient/Components/CMP-...
Patient/Widgets/WGT-...
Patient/Screens/SCR-...
Patient/Flows/FLOW-...
```

A screen story renders the complete mobile screen, not a detached card.

Do not create nine screen stories merely because nine structural states exist. Put reusable state coverage at CMP/WGT level and add screen-specific state stories only when composition or safety meaning changes.

## Slice 1 stop gate

Implement only:

1. visual/token foundation;
2. identity and verification;
3. service discovery;
4. eligibility;
5. provider selection;
6. booking;
7. booking confirmation.

Then run QA and STOP for human visual approval before generating the remaining Patient screens.

## Required verification

From `tools/patient-ui-preview`:

```bash
npm run typecheck
npm run storybook:build
npm run test:e2e
```

Use Playwright at 320, 390, and 414 widths.

For every changed slice, inspect real screenshots. Automated axe/contrast/state checks do not prove visual quality.

Report actual output only. Do not claim VoiceOver, TalkBack, native focus, real device font scaling, native keyboard behavior, or server authorization as passed from the web preview.

## Stop conditions

STOP and name the upstream owner if rendering requires:

- a new screen/flow;
- a new WGT/CMP/IX/TXT/A11Y contract;
- a new lifecycle state;
- a new field or API behavior;
- a new clinical/pricing/permission rule;
- a final brand palette decision;
- a production navigation/state/icon package decision that the canonical implementation plan still leaves open.
