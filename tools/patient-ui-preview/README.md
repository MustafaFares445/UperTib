# UberTib Patient UI Preview

This directory is a **non-production** UI renderer for the Patient application.

It exists to make the approved Phase 1–5 UX specification visible and clickable before the real React Native application is implemented.

## What this is

- React Native component code rendered through React Native Web.
- Storybook for isolated components, widgets, full screens, and flow prototypes.
- Playwright for screenshots, responsive coverage, RTL checks, flow checks, and browser-level accessibility checks.
- Mock canonical data only.
- A visual/prototyping environment, not the Patient application's production repository.

## What this is not

Do not put Laravel/API implementation, production authentication, real eligibility calculation, real capacity booking, production navigation, or business persistence here.

The Phase 5 contracts remain authoritative.

## Current measured approval status

The final browser closeout on 2026-09-12 records:

| Measure | Current result |
|---|---:|
| Canonical Patient screens | 47 |
| Implemented Patient screen titles | 47 |
| Storybook Patient states | 230 |
| Browser approval | **PASS** |
| Native approval | **PENDING** |
| WP-UX-08 | **PENDING** |

The authoritative audit rendered and captured all 230 states at 320, 390, and 414px (690 screenshots) with zero audit failures and zero unfiltered axe violations at 390px. See [`FINAL_PATIENT_UI_BROWSER_APPROVAL.md`](FINAL_PATIENT_UI_BROWSER_APPROVAL.md) for the measured commands, CI run, rendered review, and native boundary.

Historical review documents that report 38 screens / 147 states remain historical evidence; do not reuse those counts as the current inventory.

## Requirements

Use Node 24 where possible. From this directory:

```bash
npm ci
npm run playwright:install
npm run verify
npm run storybook
```

Storybook runs at:

```text
http://127.0.0.1:6006
```

The committed `package-lock.json` is authoritative for this preview scaffold. Use `npm ci` locally and in CI.

## Canonical design inputs

Do not copy token files into this project. Storybook is configured to read directly from:

```text
docs/ux/03-system/design_tokens/
```

The implementation/read order is:

1. `docs/ux/PHASE_05_HANDOFF.md`
2. `docs/ux/05-build/IMPLEMENTATION_CONTRACTS.md`
3. Phase 3 design tokens and component system
4. canonical API contracts for Profile C
5. relevant Phase 4 Patient screen specification
6. this preview implementation

Figma and this preview are both derivative.

## Patient UI build sequence

Do not generate all 47 Patient screens in one uncontrolled pass.

### Slice 1

1. Patient visual foundation and reusable primitives.
2. Identity / verification.
3. Service discovery.
4. Eligibility.
5. Provider selection.
6. Booking.
7. Confirmation.
8. Stop for visual approval.

### Later slices

- treatment and case reading;
- evidence;
- external financial history;
- claims;
- guardian/representation;
- remaining profile/account flows.

## Storybook taxonomy

Keep stories under:

```text
Patient/
  Foundations/
  Components/
  Widgets/
  Screens/
  Flows/
```

Every complete Patient `SCR-*` eventually receives a full-screen story and a stable Storybook permalink.

Use widget/component stories for semantic states instead of multiplying every screen by every possible state.

## Playwright strategy

Use three Patient browser-review widths:

- 320px
- 390px
- 414px

These are review viewports, not a replacement for the canonical Profile C size classes in `breakpoints.json`.

Normal development E2E remains focused: every Patient screen gets a canonical/default smoke render, and high-risk states get direct behavioral coverage. The **final approval audit is intentionally exhaustive** and is separate from that fast feedback loop.

Run the authoritative gate with:

```bash
npm run approval:audit
```

That command typechecks, builds Storybook, then reads the generated Storybook index at runtime and audits every current `Patient/Screens/*` story state at 320 / 390 / 414. The audit does not rely on a hard-coded screen/state list.

For every indexed state it requires:

- a rendered Storybook root;
- canonical font readiness before measurement or screenshot;
- no page error or console error;
- no horizontal overflow;
- no visible Patient control below the 44 × 44 comfortable target;
- no compact provider-comparison internal collision when that screen is under review;
- a full-page screenshot at each review width.

At the primary 390px width it additionally runs **unfiltered Axe** and fails on any remaining accessibility violation rather than filtering by severity.

Machine-readable evidence is written under:

```text
artifacts/final-approval/
  audit-patient-320.json
  audit-patient-390.json
  audit-patient-414.json
  320/*.png
  390/*.png
  414/*.png
```

The JSON records both the Storybook-indexed screen/state counts and the successfully captured counts. The two counts must match. CI runs the same Node-based launcher directly, avoiding the old Windows `npx.cmd` spawn path that could fail with `EINVAL` / `UV_HANDLE_CLOSING`.

This browser gate is final **web-preview evidence only**. It does not replace the native VoiceOver/TalkBack, Dynamic Type, safe-area, keyboard, reduced-motion, weak-network, and physical-touch checks required by WP-UX-08.

## Native approval handoff

The repository does not currently contain an integrated Patient React Native iOS/Android application, so WP-UX-08 cannot be truthfully completed from this preview alone.

The repository-side handoff for that final approval gate is documented in:

```text
WP_UX_08_NATIVE_VALIDATION_HANDOFF.md
```

When an identified native build is available, copy:

```text
native-validation/evidence.template.json
```

to a working evidence file, execute the required VoiceOver/TalkBack physical-device matrix, and validate the completed record with:

```bash
npm run approval:native-evidence -- native-validation/evidence.json
```

The validator rejects simulator/browser-only evidence, placeholder metadata, missing iOS/Android assistive-technology coverage, unexecuted device checks, missing scenarios, missing acceptance criteria, non-passing scenario results, and unsigned final approval.

CI runs `npm run test:native-evidence-validator` to verify the validator itself. A green CI run **does not** claim that native-device evidence has been executed; only a filled real-device evidence file that passes `approval:native-evidence` can close WP-UX-08.

## RTL and content rules

- Arabic-first and RTL-first.
- Western ASCII digits throughout.
- Mixed-direction values are isolated.
- No hover-only behavior.
- V1 is light-only.
- Internal S/P/H/I, calibration and risk mechanics never appear on Patient surfaces.
- Heroicons is the approved icon vocabulary; do not silently introduce another icon set.
- The concrete Patient icon package remains an implementation-stack decision and must not be selected merely for preview convenience.

## Skills

The repo already includes the primary skills needed for this work:

- `prototype`
- `design-code`
- `design-component`
- `design-qa`
- `a11y-audit`
- `design-review`
- `design-tokens`

The project-specific orchestrator is:

```text
.claude/skills/patient-ui-preview/SKILL.md
```

### UI UX Pro Max

UI UX Pro Max is optional and should be used only as a critique/advisory layer. It must not replace the approved UberTib palette, typography, tokens, components, flows, navigation, lifecycle semantics, or product behavior.

If you install it for Claude Code, use its current official CLI/plugin instructions rather than vendoring it into this repository. Keep it outside the authority chain.

## Next step

The web-preview approval gate is complete and remains reproducible through `npm run approval:audit`. Full native approval must wait for the real Patient React Native build, then execute the WP-UX-08 device matrix and pass `npm run approval:native-evidence` with real physical-device evidence.
