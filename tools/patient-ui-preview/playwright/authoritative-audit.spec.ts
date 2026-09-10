import AxeBuilder from '@axe-core/playwright';
import { expect, test, type ConsoleMessage, type Page } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const AUDIT_ENABLED = process.env.AUTHORITATIVE_AUDIT === '1';
const PRIMARY_PROJECT = 'patient-390';
const OUTPUT_ROOT = 'artifacts/final-approval';

interface StorybookIndexEntry {
  id: string;
  name: string;
  title: string;
  type: string;
}

interface TargetFinding {
  label: string;
  role: string;
  width: number;
  height: number;
}

interface AxeFinding {
  id: string;
  impact: string | null;
  help: string;
  nodes: number;
}

interface StateAuditRecord {
  id: string;
  title: string;
  name: string;
  rendered: boolean;
  captured: boolean;
  fontsReady: boolean;
  overflow: boolean;
  undersizedTargets: TargetFinding[];
  comparisonCollisions: string[];
  consoleErrors: string[];
  pageErrors: string[];
  axeViolations: AxeFinding[];
}

async function analyzeAxe(page: Page) {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await new AxeBuilder({ page }).analyze();
    } catch (error) {
      lastError = error;
      if (!String(error).includes('Axe is already running')) throw error;
      await page.waitForTimeout(1000);
    }
  }
  throw lastError;
}

async function waitForRenderedStoryAndFonts(page: Page) {
  await page.waitForFunction(
    () => (document.getElementById('storybook-root')?.childElementCount ?? 0) > 0,
    { timeout: 45_000 },
  );
  await page.waitForFunction(
    async () => {
      if ('fonts' in document) await document.fonts.ready;
      return document.documentElement.dataset.ubertibFontsReady === 'true'
        && (!('fonts' in document) || document.fonts.status === 'loaded');
    },
    { timeout: 45_000 },
  );
}

async function collectUndersizedTargets(page: Page): Promise<TargetFinding[]> {
  return page.evaluate(() => {
    const root = document.getElementById('storybook-root');
    if (!root) return [{ label: 'storybook-root missing', role: 'root', width: 0, height: 0 }];

    const candidates = Array.from(root.querySelectorAll<HTMLElement>(
      '[role="button"], [role="link"], [role="checkbox"], [role="radio"], input, textarea, select, button, a[href]',
    ));

    return candidates.flatMap((element) => {
      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      const visible = style.display !== 'none'
        && style.visibility !== 'hidden'
        && Number.parseFloat(style.opacity || '1') > 0
        && rect.width > 0
        && rect.height > 0;
      if (!visible || (rect.width >= 43.5 && rect.height >= 43.5)) return [];
      return [{
        label: element.getAttribute('aria-label')
          || element.textContent?.replace(/\s+/g, ' ').trim().slice(0, 100)
          || element.tagName.toLowerCase(),
        role: element.getAttribute('role') || element.tagName.toLowerCase(),
        width: Math.round(rect.width * 10) / 10,
        height: Math.round(rect.height * 10) / 10,
      }];
    });
  });
}

async function collectComparisonCollisions(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const groups = Array.from(document.querySelectorAll<HTMLElement>('[data-testid^="comparison-"]'))
      .filter((group) => !group.parentElement?.closest('[data-testid^="comparison-"]'));
    const failures: string[] = [];

    for (const group of groups) {
      const groupTestId = group.dataset.testid;
      if (!groupTestId) continue;

      const values = Array.from(group.querySelectorAll<HTMLElement>(`[data-testid^="${groupTestId}-"]`))
        .map((element) => ({ id: element.dataset.testid ?? 'comparison-value', rect: element.getBoundingClientRect() }))
        .filter(({ rect }) => rect.width > 0 && rect.height > 0)
        .sort((left, right) => left.rect.top - right.rect.top);

      for (let index = 1; index < values.length; index += 1) {
        const prior = values[index - 1];
        const current = values[index];
        if (current.rect.top < prior.rect.bottom - 1) {
          failures.push(`${prior.id} overlaps ${current.id}`);
        }
      }
    }

    return failures;
  });
}

function onConsoleError(target: string[]) {
  return (message: ConsoleMessage) => {
    if (message.type() === 'error') target.push(message.text());
  };
}

test.describe('WP-UX-07 authoritative Patient approval audit', () => {
  test.skip(!AUDIT_ENABLED, 'Final approval audit — run through scripts/capture-all.mjs.');

  test('discovers and audits every Patient screen state from the Storybook index', async ({ page, request }, testInfo) => {
    test.setTimeout(20 * 60_000);

    const indexResponse = await request.get('/index.json');
    expect(indexResponse.ok(), 'Storybook index must be readable').toBe(true);
    const storybookIndex = await indexResponse.json() as { entries?: Record<string, StorybookIndexEntry> };
    const entries = Object.values(storybookIndex.entries ?? {})
      .filter((entry) => entry.type === 'story' && entry.title?.startsWith('Patient/Screens/'))
      .sort((left, right) => left.id.localeCompare(right.id));

    expect(entries.length, 'Storybook must expose Patient/Screens story states').toBeGreaterThan(0);

    const indexedScreenTitles = new Set(entries.map((entry) => entry.title));
    const capturedIds = new Set<string>();
    const capturedScreenTitles = new Set<string>();
    const records: StateAuditRecord[] = [];
    const width = testInfo.project.name.replace('patient-', '');

    for (const entry of entries) {
      const consoleErrors: string[] = [];
      const pageErrors: string[] = [];
      const consoleListener = onConsoleError(consoleErrors);
      const pageErrorListener = (error: Error) => pageErrors.push(error.message);
      page.on('console', consoleListener);
      page.on('pageerror', pageErrorListener);

      const record: StateAuditRecord = {
        id: entry.id,
        title: entry.title,
        name: entry.name,
        rendered: false,
        captured: false,
        fontsReady: false,
        overflow: false,
        undersizedTargets: [],
        comparisonCollisions: [],
        consoleErrors,
        pageErrors,
        axeViolations: [],
      };

      try {
        await page.goto(`/iframe.html?id=${entry.id}&viewMode=story`, { waitUntil: 'domcontentloaded' });
        await waitForRenderedStoryAndFonts(page);
        record.rendered = true;
        record.fontsReady = true;

        record.overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        );
        record.undersizedTargets = await collectUndersizedTargets(page);

        if (entry.title.includes('SCR-ELIG-005')) {
          record.comparisonCollisions = await collectComparisonCollisions(page);
        }

        if (testInfo.project.name === PRIMARY_PROJECT) {
          const axe = await analyzeAxe(page);
          record.axeViolations = axe.violations.map((violation) => ({
            id: violation.id,
            impact: violation.impact ?? null,
            help: violation.help,
            nodes: violation.nodes.length,
          }));
        }

        const screenshotDirectory = join(OUTPUT_ROOT, width);
        await mkdir(screenshotDirectory, { recursive: true });
        await page.screenshot({ path: join(screenshotDirectory, `${entry.id}.png`), fullPage: true });
        record.captured = true;
        capturedIds.add(entry.id);
        capturedScreenTitles.add(entry.title);
      } catch (error) {
        record.pageErrors.push(`audit harness: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        page.off('console', consoleListener);
        page.off('pageerror', pageErrorListener);
      }

      records.push(record);
    }

    const failures = records.filter((record) => !record.rendered
      || !record.captured
      || !record.fontsReady
      || record.overflow
      || record.undersizedTargets.length > 0
      || record.comparisonCollisions.length > 0
      || record.consoleErrors.length > 0
      || record.pageErrors.length > 0
      || record.axeViolations.length > 0);

    const auditDirectory = OUTPUT_ROOT;
    await mkdir(auditDirectory, { recursive: true });
    await writeFile(
      join(auditDirectory, `audit-${testInfo.project.name}.json`),
      `${JSON.stringify({
        project: testInfo.project.name,
        viewport: testInfo.project.use.viewport,
        indexed: {
          screenCount: indexedScreenTitles.size,
          stateCount: entries.length,
        },
        captured: {
          screenCount: capturedScreenTitles.size,
          stateCount: capturedIds.size,
        },
        unfilteredAxe: testInfo.project.name === PRIMARY_PROJECT,
        records,
      }, null, 2)}\n`,
      'utf8',
    );

    expect(capturedIds.size, 'captured state count must equal the live Storybook Patient/Screens index').toBe(entries.length);
    expect(capturedScreenTitles.size, 'captured screen count must equal unique indexed Patient/Screens titles').toBe(indexedScreenTitles.size);
    expect(
      failures,
      `Authoritative audit failures for ${testInfo.project.name}: ${JSON.stringify(failures, null, 2)}`,
    ).toEqual([]);
  });
});
