import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page, type TestInfo } from '@playwright/test';

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
  'patient-screens-scr-clinical-001-my-cases--default',
  'patient-screens-scr-clinical-002-case-summary--outstanding-action',
  'patient-screens-scr-clinical-003-treatment-plan--proposed-amendment',
  'patient-screens-scr-clinical-004-plan-acceptance--ready',
  'patient-screens-scr-clinical-005-case-timeline--default',
];

test.describe('Slice 3 care-reading screens stay within the Patient reading column', () => {
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

test('case list surfaces an outstanding patient action before opening the case', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-clinical-001-my-cases--default');
  await expect(page.getByText('مطلوب منك الآن', { exact: true })).toBeVisible();
  await expect(page.getByText(/راجع الخطة المقترحة/)).toBeVisible();
  await expect(page.getByText('لا يوجد إجراء مطلوب منك الآن.', { exact: true })).toBeVisible();
});

test('empty cases guides back to discovery instead of rendering an empty list', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-clinical-001-my-cases--empty-no-data');
  await expect(page.getByText('لا توجد لديك حالة علاجية بعد.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'تصفح الخدمات' })).toBeVisible();
});

test('case summary makes the outstanding action primary and does not invent unavailable routes', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-clinical-002-case-summary--outstanding-action');
  await expect(page.getByRole('button', { name: 'تنفيذ الإجراء المطلوب' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'الخطة العلاجية' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'سجل الحالة' })).toBeVisible();
  await expect(page.getByText('الشروط المالية المسجّلة', { exact: true })).toHaveCount(0);
});

test('proposed amendment discloses the prior version, changed amount, and clinician authorship before acceptance', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-clinical-003-treatment-plan--proposed-amendment');
  const delta = page.getByText('ما الذي تغيّر؟', { exact: true });
  const action = page.getByRole('button', { name: 'مراجعة الموافقة على الخطة' });
  await expect(delta).toBeVisible();
  await expect(page.getByText('كتب هذه الخطة', { exact: true })).toBeVisible();
  await expect(page.getByText('د. رنا الحلبي', { exact: true })).toBeVisible();
  await expect(page.getByText(/النسخة المقبولة سابقًا تبقى محفوظة/)).toBeVisible();
  const [deltaBox, actionBox] = await Promise.all([delta.boundingBox(), action.boundingBox()]);
  expect(deltaBox?.y).toBeLessThan(actionBox?.y ?? Number.POSITIVE_INFINITY);
});

test('partial treatment plan never renders a potentially wrong total', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-clinical-003-treatment-plan--incomplete');
  await expect(page.getByText('الخطة غير مكتملة للعرض')).toBeVisible();
  await expect(page.getByText('إجمالي الخطة', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'مراجعة الموافقة على الخطة' })).toBeDisabled();
});

test('accepted plan is full-contrast history and has no acceptance action', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-clinical-003-treatment-plan--accepted');
  await expect(page.getByText('خطة مقبولة', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'مراجعة الموافقة على الخطة' })).toHaveCount(0);
});

test('acceptance states permanence before the irreversible action and stale versions cannot be accepted', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-clinical-004-plan-acceptance--ready');
  const permanence = page.getByText(/تُسجَّل هذه النسخة كسجل علاجي ومالي مقبول/);
  const accept = page.getByRole('button', { name: 'أوافق على هذه الخطة' });
  await expect(permanence).toBeVisible();
  const [permanenceBox, acceptBox] = await Promise.all([permanence.boundingBox(), accept.boundingBox()]);
  expect(permanenceBox?.y).toBeLessThan(acceptBox?.y ?? Number.POSITIVE_INFINITY);

  await gotoStory(page, 'patient-screens-scr-clinical-004-plan-acceptance--stale');
  await expect(page.getByText('تحتاج الخطة إلى تحديث من العيادة.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'أوافق على هذه الخطة' })).toBeDisabled();
});

test('timeline preserves corrections as later events and states its read boundary explicitly', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-clinical-005-case-timeline--default');
  const completed = page.getByText('سُجّل إكمال مرحلة علاجية', { exact: true });
  const reopened = page.getByText('أُعيد فتح المرحلة كتعديل مسجّل', { exact: true });
  const [completedBox, reopenedBox] = await Promise.all([completed.boundingBox(), reopened.boundingBox()]);
  expect(completedBox?.y).toBeLessThan(reopenedBox?.y ?? 0);
  await expect(page.getByText(/الحدث السابق لم يُحذف/)).toBeVisible();
  await expect(page.getByText('توجد أحداث أقدم من المعروضة هنا.')).toBeVisible();
  await expect(page.getByRole('button', { name: /حذف|تعديل/ })).toHaveCount(0);
});

test('scope-limited timeline says it is not a complete history', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-clinical-005-case-timeline--scope-limited');
  await expect(page.getByText(/نطاق الصلاحية الحالي فقط/)).toBeVisible();
});

test('care-reading flow reaches an accepted immutable plan only after explicit acceptance', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  test.setTimeout(60_000);
  await gotoStory(page, 'patient-flows-flow-clinical-008-care-reading--default');

  await page.getByRole('button', { name: /حشوات الأسنان.*مطلوب منك/ }).click();
  await expect(page.getByText('مطلوب منك الآن', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'تنفيذ الإجراء المطلوب' }).click();
  await expect(page.getByText('راجع ما اقترحه طبيبك')).toBeVisible();
  await page.getByRole('button', { name: 'مراجعة الموافقة على الخطة' }).click();
  await expect(page.getByText('تأكد مما ستوافق عليه')).toBeVisible();
  await page.getByRole('button', { name: 'أوافق على هذه الخطة' }).click();
  await expect(page.getByText('الخطة المقبولة', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'مراجعة الموافقة على الخطة' })).toHaveCount(0);
});
