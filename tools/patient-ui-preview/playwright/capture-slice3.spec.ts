import { test, type Page, type TestInfo } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const CAPTURE_ENABLED = process.env.CAPTURE === '1';
const OUTPUT_ROOT = 'artifacts/slice3-review';

async function gotoStory(page: Page, id: string) {
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  await page.waitForFunction(() => (document.getElementById('storybook-root')?.childElementCount ?? 0) > 0, { timeout: 45_000 });
  await page.waitForTimeout(350);
}

async function capture(page: Page, testInfo: TestInfo, name: string) {
  const path = join(OUTPUT_ROOT, testInfo.project.name.replace('patient-', ''), `${name}.png`);
  await mkdir(dirname(path), { recursive: true });
  await page.screenshot({ path, fullPage: true });
}

test.describe('Slice 3 care-reading review evidence', () => {
  test.skip(!CAPTURE_ENABLED, 'Evidence capture — run with CAPTURE=1.');

  const stories = [
    ['patient-screens-scr-clinical-001-my-cases--default', 'clinical-001-cases'],
    ['patient-screens-scr-clinical-002-case-summary--outstanding-action', 'clinical-002-case-summary'],
    ['patient-screens-scr-clinical-003-treatment-plan--proposed-amendment', 'clinical-003-plan-proposed'],
    ['patient-screens-scr-clinical-003-treatment-plan--accepted', 'clinical-003-plan-accepted'],
    ['patient-screens-scr-clinical-004-plan-acceptance--ready', 'clinical-004-acceptance'],
    ['patient-screens-scr-clinical-005-case-timeline--default', 'clinical-005-timeline'],
  ] as const;

  for (const [id, name] of stories) {
    test(name, async ({ page }, testInfo) => {
      await gotoStory(page, id);
      await capture(page, testInfo, name);
    });
  }
});
