import { test } from '@playwright/test';

const CAPTURE_ENABLED = process.env.CAPTURE === '1';

const stories = [
  ['claims-list', 'patient-screens-scr-claims-001-my-claims--default'],
  ['refund-request', 'patient-screens-scr-claims-002-refund-request--default'],
  ['refund-evidence-incomplete', 'patient-screens-scr-claims-002-refund-request--evidence-incomplete'],
  ['claim-evidence-incomplete', 'patient-screens-scr-claims-004-claim-detail--evidence-incomplete'],
  ['claim-decided-refund', 'patient-screens-scr-claims-004-claim-detail--decided-refund'],
] as const;

test.describe('Slice 10 claims-core evidence', () => {
  test.skip(!CAPTURE_ENABLED, 'Evidence capture — run with CAPTURE=1.');

  for (const [name, id] of stories) {
    test(name, async ({ page }, testInfo) => {
      await page.goto(`/iframe.html?id=${id}&viewMode=story`);
      await page.waitForFunction(() => (document.getElementById('storybook-root')?.childElementCount ?? 0) > 0, { timeout: 45_000 });
      await page.screenshot({
        path: testInfo.outputPath(`slice10-${name}-${testInfo.project.name}.png`),
        fullPage: true,
      });
    });
  }
});
