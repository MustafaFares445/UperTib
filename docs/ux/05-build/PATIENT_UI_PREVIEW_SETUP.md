# Patient UI Preview — Storybook + Playwright Setup

**Purpose:** prepare a free, visible, clickable Patient UI renderer without starting the production Patient application.

## Decision

The approved preview architecture is:

```text
Phase 1–5 UX sources
        ↓
React Native UI components
        ↓
React Native Web
        ↓
Storybook
        ↓
Playwright
```

The preview lives at `tools/patient-ui-preview/` and is intentionally outside production application paths.

## Package baseline

The setup pins a reproducible preparation baseline rather than floating `latest` tags:

| Package | Version | Purpose |
|---|---:|---|
| React | 19.2.8 | component runtime |
| React DOM | 19.2.8 | web renderer dependency |
| React Native | 0.87.1 | Patient-compatible component primitives |
| React Native Web | 0.21.2 | browser renderer |
| Storybook | 10.5.10 | component/screen workshop |
| @storybook/react-native-web-vite | 10.5.10 | maintained RN Web framework |
| @storybook/addon-a11y | 10.5.10 | axe-backed Storybook accessibility panel |
| Vite | 8.2.2 | Storybook web build |
| Playwright Test | 1.62.1 | browser flows/screenshots |
| @axe-core/playwright | 4.13.0 | browser accessibility smoke checks |
| TypeScript | 7.0.2 | preview type checking |

These are preview dependencies, not a selection of the future production Patient app's navigation, state, form, networking, persistence, or icon libraries.

## Repository skills

Primary skills already installed:

- `.claude/skills/prototype/SKILL.md`
- `.claude/skills/design-code/SKILL.md`
- `.claude/skills/design-component/SKILL.md`
- `.claude/skills/design-qa/SKILL.md`
- `.claude/skills/a11y-audit/SKILL.md`
- `.claude/skills/design-review/SKILL.md`
- `.claude/skills/design-tokens/SKILL.md`

Project orchestration:

- `.claude/skills/patient-ui-preview/SKILL.md`

UI UX Pro Max remains optional and advisory. It is intentionally not vendored into the repo because the UberTib Phase 3 system is already authoritative.

## Setup

On a developer machine:

```bash
cd tools/patient-ui-preview
npm install
npm run playwright:install
npm run verify
npm run storybook
```

The first `npm install` creates `package-lock.json`. Commit that lockfile before substantive UI generation.

## Canonical token integration

The preview does not own a token copy. Storybook resolves `@ux-tokens` directly to `docs/ux/03-system/design_tokens/`.

`src/theme/tokenSources.ts` proves the canonical files are importable. Substantive UI must add a token resolver/adapter instead of scattering raw DTCG access through components.

## Prepared browser-review sizes

Playwright includes 320px, 390px, and 414px Patient projects. They are review viewports, not a new canonical breakpoint scale.

## Initial smoke story

`Environment/Readiness` exists only to prove React Native Web rendering, canonical token access, Arabic/RTL document setup, Playwright access, axe execution, and screenshot creation. It is not approved product UI.

## Next implementation gate

After environment verification, use the `patient-ui-preview` Claude skill for Slice 1:

```text
foundation
→ identity / verification
→ service discovery
→ eligibility
→ provider selection
→ booking
→ confirmation
```

Stop after that slice for visual approval before generating the rest of the 47 Patient screens.

## Deferred intentionally

The setup does not choose production navigation, state management, form library, query/cache library, offline storage, a concrete Patient Heroicons package, production testing stack, or API client implementation.
