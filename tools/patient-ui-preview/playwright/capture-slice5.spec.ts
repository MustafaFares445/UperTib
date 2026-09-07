import { test } from '@playwright/test';

const CAPTURE_ENABLED = process.env.CAPTURE === '1';

const stories = [
  ['accepted-terms', 'patient-screens-scr-finance-001-accepted-financial-terms--default'],
  ['accepted-terms-partial', 'patient-screens-scr-finance-001-accepted-financial-terms--partial-lines'],
  ['financial-timeline', 'patient-screens-scr-finance-002-financial-timeline--default'],
  ['financial-timeline-partial', 'patient-screens-scr-finance-002-financial-timeline--partial-history'],
  ['financial-timeline-empty', 'patient-screens-scr-finance-002-financial-timeline--no-events-yet'],
] as const;

test.describe('Slice 5 review evidence', () => {
  test.skip(!CAPTURE_ENABLED, 'Evidence capture — run with CAPTURE=1.');

  for (const [name, id] of stories) {
    test(name, async ({ page }, testInfo) => {
      await page.goto(`/iframe.html?id=${id}&viewMode=story`);
      await page.waitForFunction(() => (document.getElementById('storybook-root')?.childElementCount ?? 0) > 0, { timeout: 45_000 });
      await page.screenshot({
        path: testInfo.outputPath(`slice5-${name}-${testInfo.project.name}.png`),
        fullPage: true,
      });
    });
  }
});
