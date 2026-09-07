import { test } from '@playwright/test';

const CAPTURE_ENABLED = process.env.CAPTURE === '1';

const stories = [
  ['refund-execution', 'patient-screens-scr-finance-005-report-refund-execution--default'],
  ['refund-execution-mismatch', 'patient-screens-scr-finance-005-report-refund-execution--decision-mismatch'],
  ['refund-execution-submitted', 'patient-screens-scr-finance-005-report-refund-execution--submitted'],
  ['refund-execution-no-decision', 'patient-screens-scr-finance-005-report-refund-execution--no-approved-decision'],
  ['finance-timeline-refund-action', 'patient-screens-scr-finance-002-financial-timeline--refund-execution-available'],
] as const;

test.describe('Slice 7 review evidence', () => {
  test.skip(!CAPTURE_ENABLED, 'Evidence capture — run with CAPTURE=1.');

  for (const [name, id] of stories) {
    test(name, async ({ page }, testInfo) => {
      await page.goto(`/iframe.html?id=${id}&viewMode=story`);
      await page.waitForFunction(() => (document.getElementById('storybook-root')?.childElementCount ?? 0) > 0, { timeout: 45_000 });
      await page.screenshot({
        path: testInfo.outputPath(`slice7-${name}-${testInfo.project.name}.png`),
        fullPage: true,
      });
    });
  }
});
