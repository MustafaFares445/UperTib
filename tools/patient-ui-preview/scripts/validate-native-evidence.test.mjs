import assert from 'node:assert/strict';
import test from 'node:test';
import {
  REQUIRED_CRITERIA,
  REQUIRED_SCENARIOS,
  validateNativeEvidence,
} from './validate-native-evidence.mjs';

function resultFor(deviceId) {
  return {
    deviceId,
    status: 'PASS',
    evidence: [`evidence://${deviceId}/screen-recording`],
    criteria: REQUIRED_CRITERIA.map((id) => ({ id, status: 'PASS' })),
  };
}

function validEvidence() {
  const devices = [
    {
      id: 'ios-primary',
      physical: true,
      platform: 'ios',
      model: 'iPhone test device',
      osVersion: 'current-supported-ios',
      assistiveTechnology: 'VoiceOver',
      tester: 'Native QA',
      testedAt: '2026-09-10T18:00:00+03:00',
      coverage: {
        largeText: true,
        safeArea: true,
        keyboard: true,
        reducedMotion: true,
        weakNetwork: true,
        physicalTouch: true,
      },
    },
    {
      id: 'android-primary',
      physical: true,
      platform: 'android',
      model: 'Android test device',
      osVersion: 'current-supported-android',
      assistiveTechnology: 'TalkBack',
      tester: 'Native QA',
      testedAt: '2026-09-10T18:30:00+03:00',
      coverage: {
        largeText: true,
        safeArea: true,
        keyboard: true,
        reducedMotion: true,
        weakNetwork: true,
        physicalTouch: true,
      },
    },
  ];

  return {
    schemaVersion: 1,
    build: {
      repository: 'MustafaFares445/UperTib',
      commitSha: '0123456789abcdef0123456789abcdef01234567',
      applicationVersion: '1.0.0-test',
      buildId: 'native-test-build',
      environment: 'staging',
    },
    devices,
    scenarios: REQUIRED_SCENARIOS.map((id) => ({
      id,
      name: id,
      results: devices.map((device) => resultFor(device.id)),
    })),
    approval: {
      status: 'PASS',
      approvedBy: 'Native QA reviewer',
      approvedAt: '2026-09-10T19:00:00+03:00',
      notes: 'Fixture only; validator unit test.',
    },
  };
}

test('accepts a complete two-platform physical-device evidence set', () => {
  assert.deepEqual(validateNativeEvidence(validEvidence()), []);
});

test('rejects missing native platform coverage and unexecuted device checks', () => {
  const evidence = validEvidence();
  evidence.devices = [evidence.devices[0]];
  evidence.devices[0].coverage.largeText = false;
  evidence.scenarios = evidence.scenarios.map((scenario) => ({
    ...scenario,
    results: scenario.results.filter((result) => result.deviceId === 'ios-primary'),
  }));

  const errors = validateNativeEvidence(evidence);
  assert(errors.some((error) => error.includes('At least two physical devices')));
  assert(errors.some((error) => error.includes('coverage.largeText')));
  assert(errors.some((error) => error.includes('physical Android TalkBack')));
});

test('rejects incomplete scenario evidence and unjustified N/A criteria', () => {
  const evidence = validEvidence();
  evidence.scenarios[0].results[0].status = 'NOT_RUN';
  evidence.scenarios[0].results[0].evidence = [];
  evidence.scenarios[0].results[0].criteria = evidence.scenarios[0].results[0].criteria
    .filter((criterion) => criterion.id !== 'AC-08')
    .map((criterion) => criterion.id === 'AC-03' ? { ...criterion, status: 'N/A' } : criterion);
  evidence.approval.status = 'NOT_RUN';

  const errors = validateNativeEvidence(evidence);
  assert(errors.some((error) => error.includes('status must be PASS before native approval')));
  assert(errors.some((error) => error.includes('evidence must contain at least one concrete evidence reference')));
  assert(errors.some((error) => error.includes('is missing AC-08')));
  assert(errors.some((error) => error.includes('AC-03 requires a concrete note')));
  assert(errors.some((error) => error.includes('approval.status must be PASS')));
});
