import { test } from '@playwright/test';

const CAPTURE_ENABLED = process.env.CAPTURE === '1';

const stories = [
  ['finance-report', 'patient-screens-scr-finance-003-report-external-payment--default'],
  ['finance-report-mismatch', 'patient-screens-scr-finance-003-report-external-payment--terms-mismatch'],
  ['finance-response-ready', 'patient-screens-scr-finance-004-financial-event-response--ready-for-dispute'],
  ['finance-response-disputed', 'patient-screens-scr-finance-004-financial-event-response--disputed'],
  ['finance-timeline-response', 'patient-screens-scr-finance-002-financial-timeline--response-required'],
] as const;

test.describe('Slice 6 review evidence', () => {
  test.skip(!CAPTURE_ENABLED, 'Evidence capture — run with CAPTURE=1.');

  for (const [name, id] of stories) {
    test(name, async ({ page }, testInfo) => {
      await page.goto(`/iframe.html?id=${id}&viewMode=story`);
      await page.waitForFunction(() => (document.getElementById('storybook-root')?.childElementCount ?? 0) > 0, { timeout: 45_000 });
      await page.screenshot({
        path: testInfo.outputPath(`slice6-${name}-${testInfo.project.name}.png`),
        fullPage: true,
      });
    });
  }
});
