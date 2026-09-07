import { test } from '@playwright/test';

const CAPTURE_ENABLED = process.env.CAPTURE === '1';

const stories = [
  ['protection-default', 'patient-screens-scr-claims-003-protection-claim--default'],
  ['protection-retryable-evidence', 'patient-screens-scr-claims-003-protection-claim--evidence-retryable-failure'],
  ['protection-scanning', 'patient-screens-scr-claims-003-protection-claim--evidence-scanning'],
  ['claim-appeal', 'patient-screens-scr-claims-005-claim-appeal--default'],
  ['claim-appeal-expired', 'patient-screens-scr-claims-005-claim-appeal--window-expired'],
  ['claim-appeal-decided', 'patient-screens-scr-claims-005-claim-appeal--decided'],
] as const;

test.describe('Slice 11 protection and claim-appeal evidence', () => {
  test.skip(!CAPTURE_ENABLED, 'Evidence capture — run with CAPTURE=1.');

  for (const [name, id] of stories) {
    test(name, async ({ page }, testInfo) => {
      await page.goto(`/iframe.html?id=${id}&viewMode=story`);
      await page.waitForFunction(() => (document.getElementById('storybook-root')?.childElementCount ?? 0) > 0, { timeout: 45_000 });
      await page.screenshot({
        path: testInfo.outputPath(`slice11-${name}-${testInfo.project.name}.png`),
        fullPage: true,
      });
    });
  }
});
