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
  'patient-screens-scr-clinical-006-stage-detail--reopened',
  'patient-widgets-wgt-platform-008-evidence-transfer-panel--retryable-failure',
  'patient-components-cmp-platform-012-evidence-transfer-item--failed-retryable',
  'patient-components-cmp-platform-012-evidence-transfer-item--rejected',
  'patient-widgets-wgt-platform-008-evidence-transfer-panel--uploaded-versus-accepted',
];

test.describe('Slice 4 evidence surfaces remain RTL, readable and reflow-safe', () => {
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

test('stage reopening is a recorded correction and preserves the prior completion', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-clinical-006-stage-detail--reopened');

  await expect(page.getByText('أُعيد فتحها', { exact: true })).toBeVisible();
  await expect(page.getByText('الإكمال المسجَّل سابقًا', { exact: true })).toBeVisible();
  await expect(page.getByText(/إعادة الفتح تصحيح مسجَّل/)).toBeVisible();
  await expect(page.getByText('احتاجت المرحلة إلى متابعة إضافية قبل اعتبارها منتهية.', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'العودة إلى سجل الحالة' })).toBeVisible();
  await expect(page.getByRole('button', { name: /إكمال|إعادة فتح|رفع|تنزيل/ })).toHaveCount(0);
});

test('stage requirements are patient-safe facts resolved from the accepted snapshot', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-clinical-006-stage-detail--reopened');

  await expect(page.getByText(/مأخوذة من الخطة المقبولة لهذه الحالة/)).toBeVisible();
  await expect(page.getByText('مستوفى', { exact: true })).toBeVisible();
  await expect(page.getByText('ما زال مطلوبًا', { exact: true })).toBeVisible();
  await expect(page.getByText(/storage|signed|scanner|مسار التخزين|رابط موقّع/i)).toHaveCount(0);
});

test('retryable transfer failure is explicitly not an evidence rejection', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-components-cmp-platform-012-evidence-transfer-item--failed-retryable');

  await expect(page.getByText('تعذّر الرفع — أعد المحاولة', { exact: true })).toBeVisible();
  await expect(page.getByText('الملف لم يُرفض.', { exact: true })).toBeVisible();
  await expect(page.getByText(/المشكلة حدثت أثناء النقل قبل أن تتم مراجعة الملف/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'استئناف الرفع' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'استبدال الملف' })).toHaveCount(0);
});

test('authoritative rejection names the correction and offers replacement rather than transport retry', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-components-cmp-platform-012-evidence-transfer-item--rejected');

  await expect(page.getByText('مرفوض — يلزم استبدال الملف', { exact: true })).toBeVisible();
  await expect(page.getByText('نوع الملف لا يطابق الصيغة المطلوبة لهذا المتطلب.', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'استبدال الملف' })).toBeVisible();
  await expect(page.getByRole('button', { name: /استئناف الرفع|إعادة المحاولة/ })).toHaveCount(0);
});

test('uploaded and accepted remain separate patient-visible states', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-widgets-wgt-platform-008-evidence-transfer-panel--uploaded-versus-accepted');

  await expect(page.getByText('تم الرفع — بانتظار الفحص', { exact: true })).toBeVisible();
  await expect(page.getByText('وصل الملف، لكنه ليس مقبولًا بعد.', { exact: true })).toBeVisible();
  await expect(page.getByText('مقبول', { exact: true })).toBeVisible();
});

test('evidence cannot be added as a free upload when no requirement applies', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-widgets-wgt-platform-008-evidence-transfer-panel--no-requirement');

  await expect(page.getByText('لا يوجد مستند مطلوب الآن.', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /إضافة ملف|رفع/ })).toHaveCount(0);
});

test('care-reading flow opens patient-safe stage detail from the append-only timeline and returns', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  test.setTimeout(60_000);
  await gotoStory(page, 'patient-flows-flow-clinical-008-care-reading--default');

  await page.getByRole('button', { name: /حشوات الأسنان.*مطلوب منك/ }).click();
  await page.getByRole('button', { name: 'سجل الحالة' }).click();
  const stageLinks = page.getByRole('button', { name: 'فتح تفاصيل المرحلة' });
  await expect(stageLinks).toHaveCount(2);
  await stageLinks.last().click();
  await expect(page.getByText('أين وصلت هذه المرحلة؟', { exact: true })).toBeVisible();
  await expect(page.getByText('أُعيد فتحها', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'العودة إلى سجل الحالة' }).click();
  await expect(page.getByText('ما الذي حدث في هذه الحالة؟', { exact: true })).toBeVisible();
});
