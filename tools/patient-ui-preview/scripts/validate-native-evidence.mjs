import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const REQUIRED_SCENARIOS = [
  'WP-UX-08-01',
  'WP-UX-08-02',
  'WP-UX-08-03',
  'WP-UX-08-04',
  'WP-UX-08-05',
  'WP-UX-08-06',
  'WP-UX-08-07',
  'WP-UX-08-08',
  'WP-UX-08-09',
  'WP-UX-08-10',
];

export const REQUIRED_CRITERIA = [
  'AC-01',
  'AC-02',
  'AC-03',
  'AC-04',
  'AC-05',
  'AC-06',
  'AC-07',
  'AC-08',
];

const REQUIRED_DEVICE_COVERAGE = [
  'largeText',
  'safeArea',
  'keyboard',
  'reducedMotion',
  'weakNetwork',
  'physicalTouch',
];

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isRealText(value) {
  return typeof value === 'string'
    && value.trim().length > 0
    && !value.includes('REPLACE_WITH');
}

function isIsoTimestamp(value) {
  return isRealText(value)
    && value.includes('T')
    && Number.isFinite(Date.parse(value));
}

function duplicates(values) {
  const seen = new Set();
  const repeated = new Set();
  for (const value of values) {
    if (seen.has(value)) repeated.add(value);
    seen.add(value);
  }
  return [...repeated];
}

export function validateNativeEvidence(evidence) {
  const errors = [];

  if (!isObject(evidence)) return ['Evidence root must be a JSON object.'];
  if (evidence.schemaVersion !== 1) errors.push('schemaVersion must equal 1.');

  const build = evidence.build;
  if (!isObject(build)) {
    errors.push('build must be an object.');
  } else {
    if (!isRealText(build.repository)) errors.push('build.repository is required.');
    if (!/^[0-9a-f]{40}$/i.test(build.commitSha ?? '')) errors.push('build.commitSha must be a full 40-character Git commit SHA.');
    if (!isRealText(build.applicationVersion)) errors.push('build.applicationVersion is required.');
    if (!isRealText(build.buildId)) errors.push('build.buildId is required.');
    if (!isRealText(build.environment)) errors.push('build.environment is required.');
  }

  const devices = Array.isArray(evidence.devices) ? evidence.devices : [];
  if (devices.length < 2) errors.push('At least two physical devices are required.');

  const deviceIds = devices.map((device) => device?.id).filter(Boolean);
  for (const duplicate of duplicates(deviceIds)) errors.push(`Duplicate device id: ${duplicate}.`);

  for (const [index, device] of devices.entries()) {
    const prefix = `devices[${index}]`;
    if (!isObject(device)) {
      errors.push(`${prefix} must be an object.`);
      continue;
    }
    if (!isRealText(device.id)) errors.push(`${prefix}.id is required.`);
    if (device.physical !== true) errors.push(`${prefix}.physical must be true; simulator/browser-only evidence is not accepted.`);
    if (!['ios', 'android'].includes(device.platform)) errors.push(`${prefix}.platform must be ios or android.`);
    if (!isRealText(device.model)) errors.push(`${prefix}.model is required.`);
    if (!isRealText(device.osVersion)) errors.push(`${prefix}.osVersion is required.`);
    if (!isRealText(device.tester)) errors.push(`${prefix}.tester is required.`);
    if (!isIsoTimestamp(device.testedAt)) errors.push(`${prefix}.testedAt must be an ISO-8601 timestamp.`);

    if (device.platform === 'ios' && device.assistiveTechnology !== 'VoiceOver') {
      errors.push(`${prefix}.assistiveTechnology must be VoiceOver for iOS.`);
    }
    if (device.platform === 'android' && device.assistiveTechnology !== 'TalkBack') {
      errors.push(`${prefix}.assistiveTechnology must be TalkBack for Android.`);
    }

    if (!isObject(device.coverage)) {
      errors.push(`${prefix}.coverage must be an object.`);
    } else {
      for (const key of REQUIRED_DEVICE_COVERAGE) {
        if (device.coverage[key] !== true) errors.push(`${prefix}.coverage.${key} must be true after execution.`);
      }
    }
  }

  if (!devices.some((device) => device?.physical === true && device?.platform === 'ios' && device?.assistiveTechnology === 'VoiceOver')) {
    errors.push('A physical iOS VoiceOver device result is required.');
  }
  if (!devices.some((device) => device?.physical === true && device?.platform === 'android' && device?.assistiveTechnology === 'TalkBack')) {
    errors.push('A physical Android TalkBack device result is required.');
  }

  const scenarios = Array.isArray(evidence.scenarios) ? evidence.scenarios : [];
  const scenarioIds = scenarios.map((scenario) => scenario?.id).filter(Boolean);
  for (const duplicate of duplicates(scenarioIds)) errors.push(`Duplicate scenario id: ${duplicate}.`);

  for (const requiredScenario of REQUIRED_SCENARIOS) {
    if (!scenarioIds.includes(requiredScenario)) errors.push(`Missing required scenario: ${requiredScenario}.`);
  }

  for (const scenario of scenarios) {
    if (!isObject(scenario) || !REQUIRED_SCENARIOS.includes(scenario.id)) continue;
    const results = Array.isArray(scenario.results) ? scenario.results : [];

    for (const deviceId of deviceIds) {
      const matchingResults = results.filter((result) => result?.deviceId === deviceId);
      if (matchingResults.length !== 1) {
        errors.push(`${scenario.id} must contain exactly one result for device ${deviceId}.`);
      }
    }

    for (const [resultIndex, result] of results.entries()) {
      const prefix = `${scenario.id}.results[${resultIndex}]`;
      if (!isObject(result)) {
        errors.push(`${prefix} must be an object.`);
        continue;
      }
      if (!deviceIds.includes(result.deviceId)) errors.push(`${prefix}.deviceId must reference a declared device.`);
      if (result.status !== 'PASS') errors.push(`${prefix}.status must be PASS before native approval.`);

      const evidenceRefs = Array.isArray(result.evidence) ? result.evidence : [];
      if (evidenceRefs.length === 0 || evidenceRefs.some((reference) => !isRealText(reference))) {
        errors.push(`${prefix}.evidence must contain at least one concrete evidence reference.`);
      }

      const criteria = Array.isArray(result.criteria) ? result.criteria : [];
      const criterionIds = criteria.map((criterion) => criterion?.id).filter(Boolean);
      for (const duplicate of duplicates(criterionIds)) errors.push(`${prefix} has duplicate criterion ${duplicate}.`);
      for (const requiredCriterion of REQUIRED_CRITERIA) {
        if (!criterionIds.includes(requiredCriterion)) errors.push(`${prefix} is missing ${requiredCriterion}.`);
      }

      for (const criterion of criteria) {
        if (!isObject(criterion) || !REQUIRED_CRITERIA.includes(criterion.id)) continue;
        if (!['PASS', 'N/A'].includes(criterion.status)) {
          errors.push(`${prefix}.${criterion.id}.status must be PASS or N/A.`);
        }
        if (criterion.status === 'N/A' && !isRealText(criterion.note)) {
          errors.push(`${prefix}.${criterion.id} requires a concrete note when status is N/A.`);
        }
      }
    }
  }

  const approval = evidence.approval;
  if (!isObject(approval)) {
    errors.push('approval must be an object.');
  } else {
    if (approval.status !== 'PASS') errors.push('approval.status must be PASS.');
    if (!isRealText(approval.approvedBy)) errors.push('approval.approvedBy is required.');
    if (!isIsoTimestamp(approval.approvedAt)) errors.push('approval.approvedAt must be an ISO-8601 timestamp.');
  }

  return errors;
}

async function main() {
  const inputPath = resolve(process.cwd(), process.argv[2] ?? 'native-validation/evidence.json');
  let evidence;
  try {
    evidence = JSON.parse(await readFile(inputPath, 'utf8'));
  } catch (error) {
    console.error(`Unable to read native evidence from ${inputPath}: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
    return;
  }

  const errors = validateNativeEvidence(evidence);
  if (errors.length > 0) {
    console.error(`WP-UX-08 native evidence is not approval-ready (${errors.length} issue${errors.length === 1 ? '' : 's'}):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }

  console.log(`WP-UX-08 native evidence PASS: ${evidence.devices.length} physical devices × ${REQUIRED_SCENARIOS.length} required scenarios.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
