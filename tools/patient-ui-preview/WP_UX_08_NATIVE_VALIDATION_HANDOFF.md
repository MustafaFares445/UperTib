# WP-UX-08 — Native Validation Handoff

Date: 2026-09-10

Status: **repository-side preparation complete; physical native validation not yet executed**

Scope: Patient application native approval only. This document does not claim that React Native Web, Storybook, browser Axe, or the Patient preview can substitute for an installed iOS/Android application.

## Why this remains separate

The repository currently contains the non-production Patient UI preview, but it does not contain an integrated Patient React Native application with iOS/Android build projects. Therefore WP-UX-08 cannot truthfully be closed from this repository alone. The remaining approval step requires an identified native build installed on real devices.

The purpose of this handoff is to make that final step deterministic, reviewable, and machine-checkable once the native build exists.

## Required device matrix

Use at least two physical devices:

| Device | Required platform coverage | Assistive technology | Text / display coverage |
|---|---|---|---|
| iOS device | Current supported iOS release on a real iPhone | VoiceOver | Large Accessibility text / largest supported application text |
| Android device | Current supported Android release on a compact real device | TalkBack | Large font and display size |

For each device, record:

- model and OS version;
- installed application version/build identifier;
- source commit SHA used to produce the build;
- tester and test timestamp;
- assistive technology enabled during the run;
- large-text/display-size coverage;
- safe-area coverage;
- keyboard coverage;
- reduced-motion coverage;
- weak/intermittent-network coverage;
- physical-touch coverage.

Do not record `PASS` from a simulator-only or browser-only run.

## Required critical scenarios

The native run must cover all ten WP-UX-08 scenarios:

1. `WP-UX-08-01` — Phone request and code error recovery.
2. `WP-UX-08-02` — Provider comparison and selected provider.
3. `WP-UX-08-03` — Slot/date/time selection and booking request.
4. `WP-UX-08-04` — Alternative proposal and eligibility review.
5. `WP-UX-08-05` — Plan acceptance and stale plan.
6. `WP-UX-08-06` — Financial event report/response.
7. `WP-UX-08-07` — Five-star review input.
8. `WP-UX-08-08` — Evidence retry/rejection.
9. `WP-UX-08-09` — Claim deadline and appeal.
10. `WP-UX-08-10` — Active subject switching, grant creation/revocation, and Add Dependent.

## Acceptance criteria to record per scenario/device

Each scenario result must explicitly record every criterion below as `PASS` or `N/A`. `N/A` is allowed only with a concrete rationale; it is not a shortcut for an untested behavior.

| Criterion ID | Required evidence |
|---|---|
| `AC-01` | Screen title, state, subject, and primary action are announced in logical order. |
| `AC-02` | Sticky actions remain reachable and are not obscured by safe areas, zoom/text scaling, or keyboard. |
| `AC-03` | Invalid/replacement focus moves predictably and returns predictably when the scenario contains validation/replacement. |
| `AC-04` | Radio/checkbox controls announce group, label, checked state, and disabled reason where present. |
| `AC-05` | No controlling amount, deadline, provider, or subject truncates at the tested large-text setting. |
| `AC-06` | Touch targets are comfortably operable on the physical device. |
| `AC-07` | Reduced motion preserves equivalent state feedback where motion is present. |
| `AC-08` | Weak/intermittent network does not transform retryable transfer/network state into rejection or another semantic state. |

## Evidence format

Copy:

```text
native-validation/evidence.template.json
```

to an untracked or review-specific file, for example:

```text
native-validation/evidence.json
```

Fill it only from real-device execution. Keep screenshots, screen recordings, accessibility readback notes, and build references in a stable team-accessible location and reference them from the JSON `evidence` arrays.

The validator intentionally rejects placeholder or `NOT_RUN` evidence.

Run:

```bash
npm run approval:native-evidence -- native-validation/evidence.json
```

The command exits non-zero unless:

- both required physical-device platform profiles are present;
- iOS uses VoiceOver and Android uses TalkBack;
- device-level large text, safe area, keyboard, reduced motion, weak network, and physical touch checks are recorded as executed;
- all ten scenarios are present;
- each scenario has one result for every recorded device;
- every scenario/device result is `PASS`;
- every required acceptance criterion is `PASS` or justified `N/A`;
- every result contains at least one evidence reference;
- final approval is explicitly signed off as `PASS`.

## Failure handling

If a native finding appears:

1. Record the exact build SHA, device, OS, assistive technology, text/display setting, and scenario.
2. Reproduce it on the identified native build before changing shared behavior.
3. Classify whether the issue belongs to the integrated application shell, shared Patient component behavior, platform-specific projection, or business/API state.
4. Fix only the verified native defect; do not weaken the approved Patient semantics or replace it with preview-only behavior.
5. Re-run the affected scenario on both device classes when the change touches shared foundations.
6. Keep the final evidence file failing until the defect is actually re-tested and passes.

## Completion rule

WP-UX-08 is complete only after a real Patient native build exists and the filled evidence file passes the validator with final human sign-off. Until then the repository may truthfully claim **web-preview approval complete** and **native approval pending**, but not full native accessibility/device approval.
