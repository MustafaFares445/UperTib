import assert from 'node:assert/strict';
import test from 'node:test';

import {
  auditScreenCoverage,
  canonicalPatientScreenIds,
  extractStoryScreenRecord,
  shouldFailCoverage,
} from './validate-screen-coverage.mjs';

const manifest = {
  frames: [
    { id: 'WF-PLATFORM-001', screen: 'SCR-PLATFORM-001', p: 'Patient' },
    { id: 'WF-BOOKING-003', screen: 'SCR-BOOKING-003', p: 'Patient' },
    { id: 'WF-IDENTITY-009', screen: 'SCR-IDENTITY-009', p: 'Clinic' },
  ],
};

const story = (screenId, label = 'Example') => ({
  file: `src/screens/${screenId}.stories.tsx`,
  source: `const meta = { title: 'Patient/Screens/${screenId} ${label}' };`,
});

test('canonical inventory is derived from Patient manifest frames only', () => {
  assert.deepEqual(canonicalPatientScreenIds(manifest), ['SCR-BOOKING-003', 'SCR-PLATFORM-001']);
});

test('diagnostic mode reports missing screens without failing the gate', () => {
  const report = auditScreenCoverage({
    manifest,
    storyFiles: [story('SCR-PLATFORM-001')],
  });

  assert.equal(report.canonicalCount, 2);
  assert.equal(report.implementedCount, 1);
  assert.deepEqual(report.missing, ['SCR-BOOKING-003']);
  assert.equal(shouldFailCoverage(report), false);
  assert.equal(shouldFailCoverage(report, { enforceMissing: true }), true);
});

test('duplicates, unknown ids, and invalid screen titles remain blocking', () => {
  const report = auditScreenCoverage({
    manifest,
    storyFiles: [
      story('SCR-PLATFORM-001', 'First'),
      { ...story('SCR-PLATFORM-001', 'Second'), file: 'src/screens/Duplicate.stories.tsx' },
      story('SCR-PLATFORM-999', 'Unknown'),
      {
        file: 'src/screens/Invalid.stories.tsx',
        source: `const meta = { title: 'Patient/Components/SCR-BOOKING-003 Wrong taxonomy' };`,
      },
    ],
  });

  assert.deepEqual(report.unknown, ['SCR-PLATFORM-999']);
  assert.deepEqual(report.duplicates, [
    {
      screenId: 'SCR-PLATFORM-001',
      files: ['src/screens/Duplicate.stories.tsx', 'src/screens/SCR-PLATFORM-001.stories.tsx'],
    },
  ]);
  assert.equal(report.invalidTitles.length, 1);
  assert.equal(shouldFailCoverage(report), true);
});

test('screen story titles must map to exactly one SCR id', () => {
  assert.deepEqual(
    extractStoryScreenRecord(
      'src/screens/Bad.stories.tsx',
      `const meta = { title: 'Patient/Screens/SCR-PLATFORM-001 SCR-BOOKING-003 Conflicting' };`,
    ),
    {
      file: 'src/screens/Bad.stories.tsx',
      title: 'Patient/Screens/SCR-PLATFORM-001 SCR-BOOKING-003 Conflicting',
      screenId: null,
      validTitle: false,
      reason: 'expected exactly one canonical SCR-* id in title, found 2',
    },
  );
});
