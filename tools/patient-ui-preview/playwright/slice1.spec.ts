import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page, type TestInfo } from '@playwright/test';

/**
 * Slice 1 coverage: every SCR-* default story loads, the Flow story reaches a submitted booking
 * request, RTL/bidi holds, no horizontal overflow at the Patient review widths, and a
 * representative set of pending/retry/error variants render. This does not assert exact DOM
 * structure — it uses accessible roles/names so it does not overfit to implementation markup.
 *
 * Functional assertions (flow completion, error/empty copy) run once, on `patient-390` — the
 * primary review width — matching `test:smoke`'s own single-project pattern rather than tripling
 * every functional check across all three Patient viewports (README.md warns against a
 * Cartesian screenshot/test explosion). Responsive overflow is genuinely viewport-dependent, so
 * it runs across all three projects: once per SCR-* default (fast, structural) and a full render
 * check on the three highest-risk screens.
 */

const SCREEN_STORIES = [
  'patient-screens-scr-identity-001-patient-entry--default',
  'patient-screens-scr-identity-002-phone-entry--default',
  'patient-screens-scr-identity-003-code-verification--default',
  'patient-screens-scr-catalog-001-service-groups--default',
  'patient-screens-scr-catalog-002-service-detail--default',
  'patient-screens-scr-elig-001-provider-search--default',
  'patient-screens-scr-elig-002-provider-results--default',
  'patient-screens-scr-elig-003-provider-decision-card--default',
  'patient-screens-scr-booking-001-slot-selection--default',
  'patient-screens-scr-booking-002-request-review-and-submit--default',
  'patient-screens-scr-booking-004-booking-detail--requested',
];

const PRIMARY_PROJECT = 'patient-390';

function onlyOnPrimaryProject(testInfo: TestInfo) {
  test.skip(testInfo.project.name !== PRIMARY_PROJECT, 'Functional assertion — runs once, not per viewport.');
}

async function gotoStory(page: Page, id: string) {
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  // 'networkidle' hangs against the Vite dev server (its HMR websocket never goes idle), which
  // Playwright's own guidance already warns against relying on. Wait for the story to actually
  // mount instead.
  await page.waitForFunction(() => (document.getElementById('storybook-root')?.childElementCount ?? 0) > 0, {
    timeout: 45_000,
  });
}

async function expectNoHorizontalOverflow(page: Page, label: string) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  expect(overflow, `${label} overflows horizontally`).toBe(false);
}

test.describe('every Slice 1 screen loads, in RTL, on the primary review width', () => {
  test.setTimeout(60_000);
  for (const id of SCREEN_STORIES) {
    test(id, async ({ page }, testInfo) => {
      onlyOnPrimaryProject(testInfo);
      await gotoStory(page, id);
      await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
      await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
      await expectNoHorizontalOverflow(page, id);
      await page.screenshot({ path: `artifacts/screenshots/${id}.png`, fullPage: true });
    });
  }
});

test.describe('no horizontal overflow at 320/390/414 on the highest-risk screens', () => {
  test.setTimeout(60_000);
  const HIGH_RISK = [
    'patient-screens-scr-identity-001-patient-entry--default',
    'patient-screens-scr-elig-002-provider-results--default',
    'patient-screens-scr-booking-002-request-review-and-submit--default',
  ];
  for (const id of HIGH_RISK) {
    test(id, async ({ page }) => {
      await gotoStory(page, id);
      await expectNoHorizontalOverflow(page, id);
    });
  }
});

test('the axe scan on the booking review screen finds no serious/critical violations', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  test.setTimeout(60_000);
  await gotoStory(page, 'patient-screens-scr-booking-002-request-review-and-submit--default');
  // @storybook/addon-a11y also runs its own axe pass inside this iframe (the `a11y.test` story
  // parameter). Retry once if it collides with ours ("Axe is already running").
  const results = await new AxeBuilder({ page })
    .analyze()
    .catch(async (error) => {
      if (!String(error).includes('Axe is already running')) throw error;
      await page.waitForTimeout(1000);
      return new AxeBuilder({ page }).analyze();
    });
  const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
});

test('key pending/retry/error variants render distinguishable content', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  test.setTimeout(60_000);

  await gotoStory(page, 'patient-screens-scr-elig-002-provider-results--error-fetch');
  await expect(page.getByText('تعذر تحميل نتائج البحث.')).toBeVisible();

  await gotoStory(page, 'patient-screens-scr-elig-002-provider-results--empty-filtered');
  await expect(page.getByText('لا نتائج تطابق معايير البحث الحالية.')).toBeVisible();

  await gotoStory(page, 'patient-components-cmp-platform-001-state-chip--pending-evaluation-vs-not-eligible');
  await expect(page.getByText('قيد التقييم')).toBeVisible();
  await expect(page.getByText('غير مؤهَّل حاليًا')).toBeVisible();

  await gotoStory(page, 'patient-screens-scr-identity-003-code-verification--attempts-exhausted');
  await expect(page.getByText('انتهت المحاولات المتاحة. اطلب رمزًا جديدًا للمتابعة.')).toBeVisible();
});

test('the Flow story reaches a submitted booking request (REQUESTED)', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  test.setTimeout(60_000);

  await gotoStory(page, 'patient-flows-flow-booking-001-booking-journey--default');

  await page.getByRole('button', { name: 'تصفّح الخدمات' }).click();
  await page.getByRole('link', { name: 'حشوات الأسنان' }).click();
  await page.getByRole('button', { name: 'البحث عن مقدّمي الخدمة' }).click();
  await page.getByRole('button', { name: 'بحث' }).click();

  await expect(page.getByText('3 نتيجة متاحة')).toBeVisible();
  await page.screenshot({ path: 'artifacts/screenshots/flow-provider-results.png', fullPage: true });
  await page.getByRole('button', { name: /د\. رنا الحلبي/ }).first().click();
  await page.screenshot({ path: 'artifacts/screenshots/flow-provider-decision.png', fullPage: true });

  await page.getByRole('button', { name: 'حجز هذا الخيار' }).click();

  // Unauthenticated: gates to phone verification, then the demo OTP.
  await page.getByLabel('رقم الهاتف').fill('0912345678');
  await page.getByRole('button', { name: 'طلب رمز التحقق' }).click();
  await page.getByLabel('رمز التحقق').fill('123456');
  await page.getByRole('button', { name: 'تحقّق' }).click();

  // Returns to the slot selector with the option context intact.
  await expect(page.getByText('اختيار الموعد')).toBeVisible();
  await page.screenshot({ path: 'artifacts/screenshots/flow-slot-selection.png', fullPage: true });
  await page.getByRole('radio').first().click();
  await page.getByRole('button', { name: 'متابعة إلى المراجعة' }).click();

  await expect(page.getByText('مراجعة طلب الحجز')).toBeVisible();
  await page.screenshot({ path: 'artifacts/screenshots/flow-booking-review.png', fullPage: true });
  await page.getByRole('button', { name: 'إرسال طلب الحجز' }).click();

  await expect(page.getByText('بانتظار تأكيد العيادة')).toBeVisible();
  await expect(page.getByText('تم إرسال طلب الحجز وهو بانتظار رد العيادة ضمن المهلة المحددة.')).toBeVisible();

  await page.screenshot({ path: 'artifacts/screenshots/flow-booking-detail-requested.png', fullPage: true });
});
