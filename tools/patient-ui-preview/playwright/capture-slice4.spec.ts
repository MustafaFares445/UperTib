import { test } from '@playwright/test';

const CAPTURE_ENABLED = process.env.CAPTURE === '1';

const stories = [
  ['stage-reopened', 'patient-screens-scr-clinical-006-stage-detail--reopened'],
  ['evidence-retryable', 'patient-components-cmp-platform-012-evidence-transfer-item--failed-retryable'],
  ['evidence-rejected', 'patient-components-cmp-platform-012-evidence-transfer-item--rejected'],
  ['evidence-uploaded-accepted', 'patient-widgets-wgt-platform-008-evidence-transfer-panel--uploaded-versus-accepted'],
] as const;

test.describe('Slice 4 review evidence', () => {
  test.skip(!CAPTURE_ENABLED, 'Evidence capture — run with CAPTURE=1.');

  for (const [name, id] of stories) {
    test(name, async ({ page }, testInfo) => {
      await page.goto(`/iframe.html?id=${id}&viewMode=story`);
      await page.waitForFunction(() => (document.getElementById('storybook-root')?.childElementCount ?? 0) > 0, { timeout: 45_000 });
      await page.screenshot({
        path: testInfo.outputPath(`slice4-${name}-${testInfo.project.name}.png`),
        fullPage: true,
      });
    });
  }
});
