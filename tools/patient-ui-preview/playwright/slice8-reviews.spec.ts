import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page, type TestInfo } from '@playwright/test';
import {
  completedCleaningExperience,
  expiredReviewExperience,
  submitVerifiedReview,
  unverifiedReviewExperience,
} from '../src/mocks/reviews';

const PRIMARY_PROJECT = 'patient-390';

function onlyOnPrimaryProject(testInfo: TestInfo) {
  test.skip(testInfo.project.name !== PRIMARY_PROJECT, 'Functional assertion — runs once, not per viewport.');
}

async function gotoStory(page: Page, id: string) {
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  await page.waitForFunction(() => (document.getElementById('storybook-root')?.childElementCount ?? 0) > 0, { timeout: 45_000 });
}

async function expectNoHorizontalOverflow(page: Page, label: string) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  expect(overflow, `${label} overflows horizontally`).toBe(false);
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

const HIGH_RISK = [
  'patient-screens-scr-reviews-001-reviewable-experiences--default',
  'patient-screens-scr-reviews-001-reviewable-experiences--empty',
  'patient-screens-scr-reviews-002-submit-review--default',
  'patient-screens-scr-reviews-002-submit-review--window-expired',
  'patient-screens-scr-reviews-003-my-review--retired',
];

test.describe('Slice 8 verified-review surfaces remain RTL, readable and reflow-safe', () => {
  for (const id of HIGH_RISK) {
    test(id, async ({ page }, testInfo) => {
      await gotoStory(page, id);
      await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
      await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
      await expectNoHorizontalOverflow(page, `${id} / ${testInfo.project.name}`);
      if (testInfo.project.name === PRIMARY_PROJECT) await expectNoSeriousAccessibilityViolations(page, id);
    });
  }
});

test('reviewable experiences show verified completion and the remaining window before effort', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-reviews-001-reviewable-experiences--default');

  const completion = page.getByText(/اكتملت التجربة الموثّقة/).first();
  const deadline = page.getByText('مهلة كتابة التقييم', { exact: true }).first();
  const write = page.getByRole('button', { name: 'اكتب تقييمًا لتجربة تنظيف الأسنان' });
  await expect(completion).toBeVisible();
  await expect(deadline).toBeVisible();
  await expect(write).toBeVisible();
  const [deadlineBox, writeBox] = await Promise.all([deadline.boundingBox(), write.boundingBox()]);
  expect(deadlineBox?.y).toBeLessThan(writeBox?.y ?? Number.POSITIVE_INFINITY);
  // These invalid candidates are intentionally present in the story input and must be filtered by the screen.
  await expect(page.getByText(expiredReviewExperience.serviceLabel, { exact: true })).toHaveCount(0);
  await expect(page.getByText(unverifiedReviewExperience.serviceLabel, { exact: true })).toHaveCount(0);
});

test('an existing active review removes the duplicate write opportunity at the screen boundary', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-reviews-001-reviewable-experiences--existing-reviews');

  await expect(page.getByRole('button', { name: 'اكتب تقييمًا لتجربة تنظيف الأسنان' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'اكتب تقييمًا لتجربة فحص أسنان دوري' })).toHaveCount(0);
  await expect(page.getByText('تقييماتي السابقة', { exact: true })).toBeVisible();
});

test('empty reviewability is a no-data state rather than a failure or disabled fake opportunity', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-reviews-001-reviewable-experiences--empty');

  await expect(page.getByText('لا توجد تجربة متاحة للتقييم الآن.', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /اكتب تقييمًا/ })).toHaveCount(0);
  await expect(page.getByText(/تعذر تحميل|حدث خطأ/)).toHaveCount(0);
});

test('submit review states verified linkage and classification independence without inventing a rating scale', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-reviews-002-submit-review--default');

  await expect(page.getByText(/مرتبط بتجربة علاجية مكتملة وموثّقة/)).toBeVisible();
  await expect(page.getByText(/مستقل عن أهلية الطبيب العلمية ولا يغيّرها/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'إرسال التقييم' })).toBeEnabled();
  await expect(page.getByText(/من 5|5 نجوم|خمس نجوم/)).toHaveCount(0);
  await expect(page.getByText(/\bS\b|\bP\b|\bH\b|\bI\b/)).toHaveCount(0);
  await expect(page.getByText(/هذه المعاينة|سياسة المنتج/)).toHaveCount(0);
});

test('expired, unverified and duplicate-review conditions have distinct structural recovery', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);

  await gotoStory(page, 'patient-screens-scr-reviews-002-submit-review--window-expired');
  await expect(page.getByText('انتهت مهلة كتابة هذا التقييم.', { exact: true })).toBeVisible();
  await expect(page.getByText(/إعادة المحاولة لا تعيد فتح نافذة التقييم/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'إرسال التقييم' })).toHaveCount(0);

  await gotoStory(page, 'patient-screens-scr-reviews-002-submit-review--not-verified');
  await expect(page.getByText('هذه التجربة ليست متاحة للتقييم الآن.', { exact: true })).toBeVisible();
  await expect(page.getByText('يلزم أن تكون التجربة مكتملة وموثّقة قبل أن يقبل النظام تقييمًا مرتبطًا بها.', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'إرسال التقييم' })).toHaveCount(0);

  await gotoStory(page, 'patient-screens-scr-reviews-002-submit-review--active-review-exists');
  await expect(page.getByText('يوجد تقييم نشط لهذه التجربة بالفعل.', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'عرض تقييمي الموجود' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'إرسال التقييم' })).toHaveCount(0);
});

test('review projection enforces verified completion, window, uniqueness and identical-retry idempotency', async ({}, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  const draft = { ratingValue: '4', content: 'كانت التجربة واضحة ومنظمة.' };

  const first = submitVerifiedReview(completedCleaningExperience, [], draft);
  expect(first.blockedBy).toBeUndefined();
  expect(first.review?.state).toBe('ACTIVE');
  expect(first.review?.experienceId).toBe(completedCleaningExperience.id);
  expect(first.reviews).toHaveLength(1);

  const identicalRetry = submitVerifiedReview(completedCleaningExperience, first.reviews, draft);
  expect(identicalRetry.reused).toBe(true);
  expect(identicalRetry.reviews).toHaveLength(1);

  const changedSecond = submitVerifiedReview(completedCleaningExperience, first.reviews, {
    ...draft,
    content: 'نص مختلف لتقييم ثانٍ.',
  });
  expect(changedSecond.blockedBy).toBe('ACTIVE_REVIEW_EXISTS');
  expect(changedSecond.reviews).toHaveLength(1);

  const expired = submitVerifiedReview(expiredReviewExperience, [], draft);
  expect(expired.blockedBy).toBe('WINDOW_EXPIRED');

  const unverified = submitVerifiedReview(unverifiedReviewExperience, [], draft);
  expect(unverified.blockedBy).toBe('NOT_VERIFIED_COMPLETE');
});

test('retired review remains readable with its governed reason and cannot be edited or deleted', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-reviews-003-my-review--retired');

  await expect(page.getByText('مؤرشَف', { exact: true })).toBeVisible();
  await expect(page.getByText(/تمت أرشفة التقييم بعد قرار نزاهة مسجّل/)).toBeVisible();
  await expect(page.getByText('مراجع نزاهة مخوّل', { exact: false })).toBeVisible();
  await expect(page.getByRole('button', { name: /تعديل|حذف/ })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'الاعتراض على قرار الأرشفة' })).toBeVisible();
});

test('appeal action is absent when policy grants no patient appeal', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-reviews-003-my-review--retired-no-appeal');
  await expect(page.getByText('مؤرشَف', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /اعتراض/ })).toHaveCount(0);
});

test('an already submitted appeal suppresses a duplicate appeal action', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-reviews-003-my-review--appeal-submitted');
  await expect(page.getByText('مُقدَّم', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'الاعتراض على قرار الأرشفة' })).toHaveCount(0);
  await expect(page.getByText('مهلة الاعتراض', { exact: true })).toHaveCount(0);
});

test('verified review flow creates one active review and removes the second-write opportunity', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  test.setTimeout(60_000);
  await gotoStory(page, 'patient-flows-flow-reviews-001-verified-review--default');

  await page.getByRole('button', { name: 'اكتب تقييمًا لتجربة تنظيف الأسنان' }).click();
  await expect(page.getByText('اكتب تقييمك عن هذه التجربة', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'إرسال التقييم' }).click();
  await expect(page.getByText('منشور', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'العودة إلى تجاربي' }).click();
  await expect(page.getByRole('button', { name: 'اكتب تقييمًا لتجربة تنظيف الأسنان' })).toHaveCount(0);
  await expect(page.getByText('تقييماتي السابقة', { exact: true })).toBeVisible();
});

test('care-reading flow reaches verified review submission from the eligible case', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  test.setTimeout(60_000);
  await gotoStory(page, 'patient-flows-flow-clinical-008-care-reading--default');

  await page.getByRole('button', { name: /تنظيف الأسنان.*مركز الأمل/ }).click();
  await expect(page.getByRole('button', { name: 'تقييم التجربة' })).toBeVisible();
  await page.getByRole('button', { name: 'تقييم التجربة' }).click();
  await page.getByRole('button', { name: 'اكتب تقييمًا لتجربة تنظيف الأسنان' }).click();
  await page.getByRole('button', { name: 'إرسال التقييم' }).click();
  await expect(page.getByText('منشور', { exact: true })).toBeVisible();
  await expect(page.getByText('كانت التجربة واضحة، وتم شرح خطوات الزيارة بشكل جيد.', { exact: true })).toBeVisible();
});
