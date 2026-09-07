import { expect, test, type Page, type TestInfo } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';

/**
 * Reproducible Patient discovery/booking review-evidence capture.
 *
 * It does NOT run in the normal suite — evidence generation is not a quality gate. Run explicitly:
 *
 *     CAPTURE=1 npx playwright test playwright/capture.spec.ts
 *
 * Output: `artifacts/final-review/<viewport>/<name>.png`, full-page, one directory per project
 * viewport (320 / 390 / 414).
 */

const CAPTURE_ENABLED = process.env.CAPTURE === '1';

const OUTPUT_ROOT = 'artifacts/final-review';

async function gotoStory(page: Page, id: string) {
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  await page.waitForFunction(() => (document.getElementById('storybook-root')?.childElementCount ?? 0) > 0, {
    timeout: 45_000,
  });
  await page.waitForTimeout(400);
}

async function capture(page: Page, testInfo: TestInfo, name: string) {
  const path = join(OUTPUT_ROOT, testInfo.project.name.replace('patient-', ''), `${name}.png`);
  await mkdir(dirname(path), { recursive: true });
  await page.screenshot({ path, fullPage: true });
}

test.describe('Patient review evidence', () => {
  test.skip(!CAPTURE_ENABLED, 'Evidence capture — run with CAPTURE=1.');

  test('discovery and comparison', async ({ page }, testInfo) => {
    await gotoStory(page, 'patient-screens-scr-elig-001-provider-search--default');
    await capture(page, testInfo, 'elig-001-search--default');

    await gotoStory(page, 'patient-screens-scr-elig-002-provider-results--default');
    await capture(page, testInfo, 'elig-002-results--default');

    const comparisonChoice = page.getByRole('checkbox').first();
    await comparisonChoice.click();
    await expect(comparisonChoice).toHaveAttribute('aria-checked', 'true');
    await capture(page, testInfo, 'elig-002-results--one-selected');

    await gotoStory(page, 'patient-screens-scr-elig-002-provider-results--area-filtered');
    await capture(page, testInfo, 'elig-002-results--area-filtered');

    await gotoStory(page, 'patient-screens-scr-elig-003-provider-decision-card--default');
    await capture(page, testInfo, 'elig-003-provider-detail--default');

    await gotoStory(page, 'patient-screens-scr-elig-004-eligibility-explanation--eligible');
    await capture(page, testInfo, 'elig-004-explanation--eligible');

    await gotoStory(page, 'patient-screens-scr-elig-004-eligibility-explanation--pending-evaluation');
    await capture(page, testInfo, 'elig-004-explanation--pending');

    await gotoStory(page, 'patient-screens-scr-elig-005-provider-comparison--two-options');
    await capture(page, testInfo, 'elig-005-comparison--default');

    const bookingChoice = page
      .getByRole('radiogroup', { name: 'اختيار مقدم الخدمة للحجز' })
      .getByRole('radio')
      .first();
    await bookingChoice.click();
    await expect(bookingChoice).toHaveAttribute('aria-checked', 'true');
    await capture(page, testInfo, 'elig-005-comparison--selected');
  });

  test('scheduling and request review', async ({ page }, testInfo) => {
    await gotoStory(page, 'patient-screens-scr-booking-001-slot-selection--default');
    await capture(page, testInfo, 'booking-001-slot--default');

    const date = page.getByRole('radiogroup', { name: 'اختر التاريخ' }).getByRole('radio').first();
    await date.click();
    const time = page.getByRole('radiogroup', { name: /اختر الوقت في/ }).getByRole('radio').first();
    await time.click();
    await expect(time).toHaveAttribute('aria-checked', 'true');
    await capture(page, testInfo, 'booking-001-slot--selected');

    await gotoStory(page, 'patient-screens-scr-booking-002-request-review-and-submit--default');
    await capture(page, testInfo, 'booking-002-review--default');
  });

  test('booking lifecycle states', async ({ page }, testInfo) => {
    const states = ['requested', 'alternative-proposed', 'confirmed'] as const;
    for (const state of states) {
      await gotoStory(page, `patient-screens-scr-booking-004-booking-detail--${state}`);
      await capture(page, testInfo, `booking-004-detail--${state}`);
    }
  });

  test('price modes at the narrow width', async ({ page }, testInfo) => {
    await gotoStory(page, 'patient-components-cmp-elig-002-price-display--all-governed-modes');
    await capture(page, testInfo, 'cmp-elig-002-price--all-modes');
  });
});
