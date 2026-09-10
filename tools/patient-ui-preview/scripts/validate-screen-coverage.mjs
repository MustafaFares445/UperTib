import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const STORY_SUFFIX_RE = /\.stories\.(?:[cm]?[jt]sx?)$/i;
const SCREEN_ID_RE = /SCR-[A-Z]+-\d{3}/g;
const TITLE_RE = /\btitle\s*:\s*(['"`])([^\n'"`]+)\1/;
const PATIENT_STORY_PREFIX = 'Patient/Screens/';

export function canonicalPatientScreenIds(manifest) {
  if (!manifest || !Array.isArray(manifest.frames)) {
    throw new TypeError('wireframe-manifest.json must contain a frames array.');
  }

  const ids = manifest.frames
    .filter((frame) => frame?.p === 'Patient')
    .map((frame) => frame?.screen)
    .filter((screen) => typeof screen === 'string');

  return [...new Set(ids)].sort();
}

export function extractStoryScreenRecord(filePath, source) {
  const titleMatch = source.match(TITLE_RE);
  const title = titleMatch?.[2]?.trim() ?? null;

  if (!title || !title.startsWith(PATIENT_STORY_PREFIX)) {
    return {
      file: filePath,
      title,
      screenId: null,
      validTitle: false,
      reason: title ? `expected title to start with ${PATIENT_STORY_PREFIX}` : 'missing static Storybook title',
    };
  }

  const ids = [...new Set(title.match(SCREEN_ID_RE) ?? [])];
  if (ids.length !== 1) {
    return {
      file: filePath,
      title,
      screenId: null,
      validTitle: false,
      reason: `expected exactly one canonical SCR-* id in title, found ${ids.length}`,
    };
  }

  const [screenId] = ids;
  const expectedPrefix = `${PATIENT_STORY_PREFIX}${screenId}`;
  if (!title.startsWith(expectedPrefix)) {
    return {
      file: filePath,
      title,
      screenId,
      validTitle: false,
      reason: `screen id must immediately follow ${PATIENT_STORY_PREFIX}`,
    };
  }

  return { file: filePath, title, screenId, validTitle: true, reason: null };
}

export function auditScreenCoverage({ manifest, storyFiles }) {
  const canonicalIds = canonicalPatientScreenIds(manifest);
  const canonicalSet = new Set(canonicalIds);
  const records = storyFiles.map(({ file, source }) => extractStoryScreenRecord(file, source));
  const validRecords = records.filter((record) => record.validTitle && record.screenId);
  const invalidTitles = records.filter((record) => !record.validTitle);

  const occurrences = new Map();
  for (const record of validRecords) {
    const current = occurrences.get(record.screenId) ?? [];
    current.push(record.file);
    occurrences.set(record.screenId, current);
  }

  const unknown = [...occurrences.keys()].filter((id) => !canonicalSet.has(id)).sort();
  const duplicates = [...occurrences.entries()]
    .filter(([, files]) => files.length > 1)
    .map(([screenId, files]) => ({ screenId, files: [...files].sort() }))
    .sort((a, b) => a.screenId.localeCompare(b.screenId));

  const implementedCanonicalIds = [...occurrences.keys()]
    .filter((id) => canonicalSet.has(id))
    .sort();
  const implementedSet = new Set(implementedCanonicalIds);
  const missing = canonicalIds.filter((id) => !implementedSet.has(id));

  return {
    canonicalCount: canonicalIds.length,
    implementedCount: implementedCanonicalIds.length,
    storyCount: records.length,
    canonicalIds,
    implementedCanonicalIds,
    missing,
    duplicates,
    unknown,
    invalidTitles,
  };
}

export function shouldFailCoverage(report, { enforceMissing = false } = {}) {
  return (
    report.duplicates.length > 0 ||
    report.unknown.length > 0 ||
    report.invalidTitles.length > 0 ||
    (enforceMissing && report.missing.length > 0)
  );
}

async function collectStoryFiles(screenDirectory) {
  const entries = await readdir(screenDirectory, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && STORY_SUFFIX_RE.test(entry.name))
    .map((entry) => path.join(screenDirectory, entry.name))
    .sort();

  return Promise.all(
    files.map(async (file) => ({
      file: path.relative(process.cwd(), file).replaceAll(path.sep, '/'),
      source: await readFile(file, 'utf8'),
    })),
  );
}

function printList(label, values) {
  console.log(`${label}: ${values.length}`);
  for (const value of values) {
    console.log(`  - ${value}`);
  }
}

function printReport(report, { enforceMissing }) {
  console.log('Patient canonical screen coverage');
  console.log(`Canonical Patient screens: ${report.canonicalCount}`);
  console.log(`Implemented canonical screen titles: ${report.implementedCount}`);
  console.log(`Screen story files inspected: ${report.storyCount}`);
  console.log(`Mode: ${enforceMissing ? 'enforced' : 'diagnostic (missing screens are non-blocking)'}`);
  printList('Missing canonical Patient screen IDs', report.missing);
  printList('Unknown Patient screen IDs', report.unknown);

  console.log(`Duplicate canonical screen IDs: ${report.duplicates.length}`);
  for (const duplicate of report.duplicates) {
    console.log(`  - ${duplicate.screenId}: ${duplicate.files.join(', ')}`);
  }

  console.log(`Invalid screen story titles: ${report.invalidTitles.length}`);
  for (const invalid of report.invalidTitles) {
    console.log(`  - ${invalid.file}: ${invalid.reason}${invalid.title ? ` (${invalid.title})` : ''}`);
  }
}

async function main() {
  const enforceMissing = process.argv.includes('--enforce');
  const jsonOutput = process.argv.includes('--json');
  const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
  const previewRoot = path.resolve(scriptDirectory, '..');
  const repositoryRoot = path.resolve(previewRoot, '..', '..');
  const manifestPath = path.join(repositoryRoot, 'docs', 'ux', '02-wireframes', 'wireframe-manifest.json');
  const screenDirectory = path.join(previewRoot, 'src', 'screens');

  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const storyFiles = await collectStoryFiles(screenDirectory);
  const report = auditScreenCoverage({ manifest, storyFiles });

  if (jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printReport(report, { enforceMissing });
  }

  if (shouldFailCoverage(report, { enforceMissing })) {
    process.exitCode = 1;
  }
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : null;
if (invokedPath === import.meta.url) {
  await main();
}
