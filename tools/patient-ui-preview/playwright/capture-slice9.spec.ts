import { test } from '@playwright/test';

const CAPTURE_ENABLED = process.env.CAPTURE === '1';

const stories = [
  ['appeal-default', 'patient-screens-scr-reviews-004-review-appeal--default'],
  ['appeal-retryable', 'patient-screens-scr-reviews-004-review-appeal--retryable-failure'],
  ['appeal-expired', 'patient-screens-scr-reviews-004-review-appeal--window-expired'],
  ['appeal-submitted', 'patient-screens-scr-reviews-004-review-appeal--submitted'],
  ['appeal-decided', 'patient-screens-scr-reviews-004-review-appeal--decided'],
] as const;

test.describe('Slice 9 review-appeal evidence', () => {
  test.skip(!CAPTURE_ENABLED, 'Evidence capture — run with CAPTURE=1.');

  for (const [name, id] of stories) {
    test(name, async ({ page }, testInfo) => {
      await page.goto(`/iframe.html?id=${id}&viewMode=story`);
      await page.waitForFunction(() => (document.getElementById('storybook-root')?.childElementCount ?? 0) > 0, { timeout: 45_000 });
      await page.screenshot({
        path: testInfo.outputPath(`slice9-${name}-${testInfo.project.name}.png`),
        fullPage: true,
      });
    });
  }
});
