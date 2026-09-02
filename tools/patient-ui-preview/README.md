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

## Requirements

Use Node 24 where possible. From this directory:

```bash
npm install
npm run playwright:install
npm run verify
npm run storybook
```

Storybook runs at:

```text
http://127.0.0.1:6006
```

After the first successful `npm install`, commit the generated `package-lock.json` before substantive Patient UI work so CI and other agents use the same dependency graph.

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

Every Patient screen gets a canonical/default smoke render. Add visual-regression baselines for high-risk states, unusual responsive behavior, and safety-critical errors rather than producing a Cartesian screenshot explosion.

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

Run the setup commands above, confirm the readiness story passes, then give Claude the Slice 1 implementation command using the `patient-ui-preview` skill.
