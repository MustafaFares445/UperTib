import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page, type TestInfo } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

/**
 * Slice 1 coverage: every SCR-* default story loads, the Flow story reaches a submitted booking
 * request, RTL/bidi holds, no serious/critical accessibility finding remains, no horizontal
 * overflow exists at the Patient review widths, and representative pending/retry/error variants
 * render. This does not assert exact DOM
 * structure — it uses accessible roles/names so it does not overfit to implementation markup.
 *
 * Functional assertions (flow completion, error/empty copy) run once, on `patient-390` — the
 * primary review width — matching `test:smoke`'s own single-project pattern rather than tripling
 * every functional check across all three Patient viewports (README.md warns against a
 * Cartesian screenshot/test explosion). Responsive overflow is genuinely viewport-dependent, so
 * it runs across all three projects: once per SCR-* default (fast, structural) and a full render
 * check on the highest-risk screens.
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
  'patient-screens-scr-elig-005-provider-comparison--two-options',
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

/**
 * Every governed Icon must stay decorative to assistive technology (A11Y-PLATFORM-010): the
 * adjacent label already carries the meaning.
 *
 * Scoped to `#storybook-root` on purpose. A document-wide `svg` query also matches Storybook's own
 * `#storybook-a11y-vision-filters` <defs> element, which the a11y addon injects into <body>
 * asynchronously and which is not Patient UI. Asserting against the whole document therefore makes
 * this check both wrong (it fails on preview tooling) and timing-dependent (it passes or fails on
 * whether the addon has injected yet). The count assertion keeps the check from passing vacuously
 * on a render that happens to contain no icons at all.
 */
async function expectDecorativeIconsAreHidden(page: Page, label: string) {
  const icons = await page.evaluate(() => {
    const root = document.getElementById('storybook-root');
    return {
      total: root?.querySelectorAll('svg').length ?? 0,
      exposed: root?.querySelectorAll('svg:not([aria-hidden="true"])').length ?? 0,
    };
  });
  expect(icons.total, `${label} renders no icon, so the decorative-icon rule is untested here`).toBeGreaterThan(0);
  expect(icons.exposed, `${label} exposes a decorative icon to the accessibility tree`).toBe(0);
}

async function expectNoSeriousAccessibilityViolations(page: Page, label: string) {
  const results = await new AxeBuilder({ page })
    .analyze()
    .catch(async (error) => {
      if (!String(error).includes('Axe is already running')) throw error;
      await page.waitForTimeout(1000);
      return new AxeBuilder({ page }).analyze();
    });
  const serious = results.violations.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical');
  expect(serious, `${label}: ${JSON.stringify(serious, null, 2)}`).toEqual([]);
}

async function captureRecomposed(page: Page, id: string, project: string) {
  await mkdir('artifacts/recomposed', { recursive: true });
  const path = `artifacts/recomposed/${id}-${project}.png`;
  try {
    await page.screenshot({ path, fullPage: true });
  } catch (error) {
    if (!String(error).includes('Unable to capture screenshot')) throw error;
    await page.waitForTimeout(250);
    await page.screenshot({ path, fullPage: true });
  }
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
      await expectNoSeriousAccessibilityViolations(page, id);
      await page.screenshot({ path: `artifacts/screenshots/${id}.png`, fullPage: true });
    });
  }
});

test.describe('no horizontal overflow at 320/390/414 on the highest-risk screens', () => {
  test.setTimeout(60_000);
  const HIGH_RISK = [
    'patient-screens-scr-identity-001-patient-entry--default',
    'patient-screens-scr-elig-002-provider-results--default',
    'patient-screens-scr-elig-003-provider-decision-card--default',
    'patient-screens-scr-elig-005-provider-comparison--two-options',
    'patient-screens-scr-booking-001-slot-selection--default',
    'patient-screens-scr-booking-002-request-review-and-submit--default',
    'patient-screens-scr-booking-004-booking-detail--requested',
    'patient-screens-scr-booking-004-booking-detail--alternative-proposed',
    'patient-screens-scr-booking-004-booking-detail--confirmed',
  ];
  for (const id of HIGH_RISK) {
    test(id, async ({ page }, testInfo) => {
      await gotoStory(page, id);
      await expectNoHorizontalOverflow(page, id);
      await captureRecomposed(page, id, testInfo.project.name);

      if (id.includes('provider-results')) {
        const firstComparisonChoice = page.getByRole('checkbox').first();
        await firstComparisonChoice.click();
        await expect(firstComparisonChoice).toHaveAttribute('aria-checked', 'true');
        await expect(page.getByLabel(/تم اختيار 1 من .* للمقارنة/)).toBeVisible();
        await expectNoHorizontalOverflow(page, `${id} with one selected option`);
        await captureRecomposed(page, `${id}--one-selected`, testInfo.project.name);
      }
      if (id.includes('provider-comparison')) {
        await page.getByRole('radio').first().click();
        await expectNoHorizontalOverflow(page, `${id} with a booking option selected`);
        await captureRecomposed(page, `${id}--selected`, testInfo.project.name);
      }
      if (id.includes('slot-selection')) {
        await page.getByRole('radiogroup', { name: 'اختر التاريخ' }).getByRole('radio').first().click();
        await page.getByRole('radiogroup', { name: /اختر الوقت في/ }).getByRole('radio').first().click();
        await expect(page.getByText('الموعد المختار', { exact: true })).toBeVisible();
        await expectNoHorizontalOverflow(page, `${id} with a selected appointment`);
        await captureRecomposed(page, `${id}--selected`, testInfo.project.name);
      }
    });
  }
});

test('comparison is attribute-oriented and exposes an explicit selected option', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-elig-005-provider-comparison--two-options');

  await expect(page.getByText('تفاصيل المقارنة')).toBeVisible();
  for (const label of ['السعر', 'ما يشمله السعر', 'التقييم الموثّق', 'أقرب موعد']) {
    await expect(page.getByText(label, { exact: true })).toBeVisible();
  }
  const firstOption = page.getByRole('radio').first();
  await firstOption.click();
  await expect(firstOption).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByRole('button', { name: 'متابعة لحجز الخيار المحدد' })).toBeEnabled();
});

test('provider results expose a visible provider-details affordance', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-elig-002-provider-results--default');
  await expect(page.getByText('عرض تفاصيل الطبيب', { exact: true })).toHaveCount(3);
});

test('changing the active date clears the previously selected time', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-booking-001-slot-selection--default');

  const dates = page.getByRole('radiogroup', { name: 'اختر التاريخ' }).getByRole('radio');
  await dates.nth(0).click();
  const selectedTime = page.getByRole('radiogroup', { name: /اختر الوقت في/ }).getByRole('radio').first();
  await selectedTime.click();
  await expect(selectedTime).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByText('الموعد المختار', { exact: true })).toBeVisible();

  await dates.nth(1).click();
  await expect(page.getByText('الموعد المختار', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'متابعة إلى المراجعة' })).toBeDisabled();
});

test('custom selection controls support Space and keep the focused primary action unobscured', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);

  await gotoStory(page, 'patient-screens-scr-elig-002-provider-results--default');
  const comparisonChoice = page.getByRole('checkbox').first();
  await comparisonChoice.focus();
  await page.keyboard.press('Space');
  await expect(comparisonChoice).toHaveAttribute('aria-checked', 'true');

  await gotoStory(page, 'patient-screens-scr-elig-005-provider-comparison--two-options');
  const comparisonGroup = page.getByRole('radiogroup', { name: 'اختيار مقدم الخدمة للحجز' });
  await expect(comparisonGroup.locator('[role="radio"][tabindex="0"]')).toHaveCount(1);
  const bookingChoice = comparisonGroup.getByRole('radio').first();
  await bookingChoice.focus();
  await page.keyboard.press('Space');
  await expect(bookingChoice).toHaveAttribute('aria-checked', 'true');
  const nextBookingChoice = comparisonGroup.getByRole('radio').nth(1);
  await page.keyboard.press('ArrowDown');
  await expect(nextBookingChoice).toBeFocused();
  await expect(nextBookingChoice).toHaveAttribute('aria-checked', 'true');

  await gotoStory(page, 'patient-screens-scr-booking-001-slot-selection--default');

  const dateGroup = page.getByRole('radiogroup', { name: 'اختر التاريخ' });
  await expect(dateGroup.locator('[role="radio"][tabindex="0"]')).toHaveCount(1);
  const date = dateGroup.getByRole('radio').first();
  await date.focus();
  await page.keyboard.press('Space');
  await expect(date).toHaveAttribute('aria-checked', 'true');

  const nextDate = dateGroup.getByRole('radio').nth(1);
  await page.keyboard.press('ArrowRight');
  await expect(nextDate).toBeFocused();
  await expect(nextDate).toHaveAttribute('aria-checked', 'true');

  const time = page.getByRole('radiogroup', { name: /اختر الوقت في/ }).getByRole('radio').first();
  await time.focus();
  await page.keyboard.press('Space');
  await expect(time).toHaveAttribute('aria-checked', 'true');

  const continueAction = page.getByRole('button', { name: 'متابعة إلى المراجعة' });
  await continueAction.focus();
  await expect(continueAction).toBeFocused();
  const [actionBox, viewportHeight] = await Promise.all([
    continueAction.boundingBox(),
    page.evaluate(() => window.innerHeight),
  ]);
  expect((actionBox?.y ?? viewportHeight) + (actionBox?.height ?? 0)).toBeLessThanOrEqual(viewportHeight);
});

test('screen headings are navigable and decorative icons stay out of the accessibility tree', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-booking-002-request-review-and-submit--default');

  await expect(page.getByRole('heading', { level: 1, name: 'راجع طلب الحجز' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2 })).toBeVisible();
  await expectDecorativeIconsAreHidden(page, 'request review');

  // The governed Icon vocabulary is exercised far more heavily on the lifecycle and discovery
  // surfaces, so assert the rule where the icons actually are — not only where one happens to render.
  await gotoStory(page, 'patient-screens-scr-booking-004-booking-detail--requested');
  await expectDecorativeIconsAreHidden(page, 'booking detail requested');

  await gotoStory(page, 'patient-screens-scr-elig-002-provider-results--default');
  await expectDecorativeIconsAreHidden(page, 'provider results');
});

test('expanded booking history keeps valid list semantics and accessibility', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-booking-004-booking-detail--requested');

  await page.getByRole('button', { name: /عرض سجل الحجز/ }).click();
  await expect(page.getByRole('listitem')).toHaveCount(1);
  await expectNoSeriousAccessibilityViolations(page, 'expanded booking history');
});

test('review keeps edits adjacent to the appointment and has one submit action', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-booking-002-request-review-and-submit--default');

  await expect(page.getByLabel(/الموعد الذي ستطلبه/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'تعديل الموعد' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'تغيير الطبيب' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'إرسال طلب الحجز' })).toHaveCount(1);
});

test('alternative proposal preserves original-first reading order and no-penalty decline copy', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-booking-004-booking-detail--alternative-proposed');

  const original = page.getByLabel(/الموعد المطلوب/);
  const proposed = page.getByLabel(/الموعد البديل المقترح/);
  await expect(original).toBeVisible();
  await expect(proposed).toBeVisible();
  const [originalBox, proposedBox] = await Promise.all([original.boundingBox(), proposed.boundingBox()]);
  expect(originalBox?.y).toBeLessThan(proposedBox?.y ?? 0);
  // Declining closes the request — IMPLEMENTATION_CONTRACTS prohibits a second confirmation on
  // decline, so the outcome has to be stated in the copy, and stated without penalty language.
  await expect(page.getByText(/الرفض ينهي هذا الطلب دون أي عقوبة/)).toBeVisible();
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

const BOOKING_STATE_STORIES = [
  ['requested', 'بانتظار تأكيد العيادة', 'إلغاء الطلب'],
  ['alternative-proposed', 'عرضت العيادة موعدًا بديلًا', 'قبول الموعد البديل'],
  ['confirmed', 'الموعد مؤكَّد', 'طلب تغيير الموعد'],
  ['eligibility-review', 'الموعد قيد مراجعة الأهلية', 'العودة إلى الخدمات'],
  ['rejected', 'لم توافق العيادة على الطلب', 'البحث عن خيار آخر'],
  ['cancelled', 'تم إلغاء الحجز', 'البحث عن خيار آخر'],
] as const;

test.describe('Booking Detail projects the meaning, next step, and allowed action for every Slice 1 state', () => {
  for (const [story, label, action] of BOOKING_STATE_STORIES) {
    test(story, async ({ page }, testInfo) => {
      onlyOnPrimaryProject(testInfo);
      await gotoStory(page, `patient-screens-scr-booking-004-booking-detail--${story}`);
      await expect(page.getByText(label)).toBeVisible();
      await expect(page.getByText('الخطوة التالية')).toBeVisible();
      await expect(page.getByRole('button', { name: action })).toBeVisible();
    });
  }
});

test('the Flow story reaches a submitted booking request (REQUESTED)', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  test.setTimeout(60_000);

  await gotoStory(page, 'patient-flows-flow-booking-001-booking-journey--default');

  await page.getByRole('button', { name: 'تصفّح الخدمات' }).click();
  await page.getByRole('link', { name: 'حشوات الأسنان' }).click();
  await page.getByRole('button', { name: 'البحث عن مقدّمي الخدمة' }).click();
  await page.getByRole('button', { name: 'عرض الأطباء' }).click();

  await expect(page.getByText('3 نتائج متاحة')).toBeVisible();
  await page.screenshot({ path: 'artifacts/screenshots/flow-provider-results.png', fullPage: true });
  await page.getByRole('checkbox').nth(0).click();
  await page.getByRole('checkbox').nth(1).click();
  await page.getByRole('button', { name: 'مقارنة الخيارات' }).click();
  await expect(page.getByText('قارن كل معلومة جنبًا إلى جنب')).toBeVisible();
  await page.screenshot({ path: 'artifacts/screenshots/flow-provider-comparison.png', fullPage: true });
  await page.getByRole('radio').first().click();
  await page.getByRole('button', { name: 'متابعة لحجز الخيار المحدد' }).click();

  // Unauthenticated: gates to phone verification, then the demo OTP.
  await page.getByLabel('رقم الهاتف').fill('0912345678');
  await page.getByRole('button', { name: 'طلب رمز التحقق' }).click();
  await page.getByLabel('رمز التحقق').fill('123456');
  await page.getByRole('button', { name: 'تحقّق' }).click();

  // Returns to the slot selector with the option context intact.
  await expect(page.getByText('اختر التاريخ والوقت')).toBeVisible();
  await page.screenshot({ path: 'artifacts/screenshots/flow-slot-selection.png', fullPage: true });
  await page.getByRole('radiogroup', { name: 'اختر التاريخ' }).getByRole('radio').first().click();
  await page.getByRole('radiogroup', { name: /اختر الوقت في/ }).getByRole('radio').first().click();
  await page.getByRole('button', { name: 'متابعة إلى المراجعة' }).click();

  await expect(page.getByText('راجع طلب الحجز')).toBeVisible();
  await page.screenshot({ path: 'artifacts/screenshots/flow-booking-review.png', fullPage: true });
  await page.getByRole('button', { name: 'إرسال طلب الحجز' }).click();

  await expect(page.getByText('بانتظار تأكيد العيادة')).toBeVisible();
  await expect(page.getByText('وصل طلبك إلى العيادة، لكنه ليس موعدًا مؤكَّدًا بعد.')).toBeVisible();

  await page.screenshot({ path: 'artifacts/screenshots/flow-booking-detail-requested.png', fullPage: true });
});
