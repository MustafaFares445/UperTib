import { test } from '@playwright/test';

const CAPTURE_ENABLED = process.env.CAPTURE === '1';

const stories = [
  ['reviewable-default', 'patient-screens-scr-reviews-001-reviewable-experiences--default'],
  ['submit-default', 'patient-screens-scr-reviews-002-submit-review--default'],
  ['submit-expired', 'patient-screens-scr-reviews-002-submit-review--window-expired'],
  ['my-review-active', 'patient-screens-scr-reviews-003-my-review--active'],
  ['my-review-retired', 'patient-screens-scr-reviews-003-my-review--retired'],
] as const;

test.describe('Slice 8 review evidence', () => {
  test.skip(!CAPTURE_ENABLED, 'Evidence capture — run with CAPTURE=1.');

  for (const [name, id] of stories) {
    test(name, async ({ page }, testInfo) => {
      await page.goto(`/iframe.html?id=${id}&viewMode=story`);
      await page.waitForFunction(() => (document.getElementById('storybook-root')?.childElementCount ?? 0) > 0, { timeout: 45_000 });
      await page.screenshot({
        path: testInfo.outputPath(`slice8-${name}-${testInfo.project.name}.png`),
        fullPage: true,
      });
    });
  }
});
