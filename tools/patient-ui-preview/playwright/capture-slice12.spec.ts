import { test } from '@playwright/test';

const CAPTURE_ENABLED = process.env.CAPTURE === '1';

const stories = [
  ['family-directions', 'patient-screens-scr-identity-005-family-and-representation--default'],
  ['grant-scope-review', 'patient-screens-scr-identity-006-create-grant--ready'],
  ['grant-revocation', 'patient-screens-scr-identity-007-grant-detail--active'],
  ['active-patient-context', 'patient-screens-scr-identity-008-active-patient-context--default'],
  ['dependent-ready', 'patient-screens-scr-identity-037-add-dependent--ready-for-verification'],
  ['dependent-evidence-rejected', 'patient-screens-scr-identity-037-add-dependent--evidence-rejected'],
  ['dependent-submitted', 'patient-screens-scr-identity-037-add-dependent--submitted'],
  ['dependent-changes-requested', 'patient-screens-scr-identity-037-add-dependent--changes-requested'],
] as const;

test.describe('Slice 12 guardian/representation visual evidence', () => {
  test.skip(!CAPTURE_ENABLED, 'Evidence capture — run with CAPTURE=1.');

  for (const [name, id] of stories) {
    test(name, async ({ page }, testInfo) => {
      await page.goto(`/iframe.html?id=${id}&viewMode=story`);
      await page.waitForFunction(() => (document.getElementById('storybook-root')?.childElementCount ?? 0) > 0, { timeout: 45_000 });
      await page.screenshot({
        path: testInfo.outputPath(`slice12-${name}-${testInfo.project.name}.png`),
        fullPage: true,
      });
    });
  }
});
