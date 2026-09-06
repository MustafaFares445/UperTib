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
  'patient-screens-scr-finance-003-report-external-payment--default',
  'patient-screens-scr-finance-003-report-external-payment--terms-mismatch',
  'patient-screens-scr-finance-004-financial-event-response--ready-for-dispute',
  'patient-screens-scr-finance-004-financial-event-response--disputed',
  'patient-screens-scr-finance-002-financial-timeline--response-required',
];

test.describe('Slice 6 financial action surfaces remain RTL, readable and reflow-safe', () => {
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

test('report screen records an external fact and never asks the Patient to identify the payer', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-finance-003-report-external-payment--default');

  await expect(page.getByText('سجّل ما دفعته خارج UberTib', { exact: true })).toBeVisible();
  await expect(page.getByText(/هذه الخطوة لا تدفع أي مبلغ/)).toBeVisible();
  await expect(page.getByLabel('المبلغ الذي دفعته خارج المنصة')).toHaveValue('20000');
  await expect(page.getByLabel('العملة')).toHaveValue('SYP');
  await expect(page.getByLabel('طريقة السداد خارج المنصة')).toHaveValue('نقدًا خارج المنصة');
  await expect(page.getByRole('textbox', { name: /اسم الدافع|هوية الدافع/ })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /ادفع الآن|سداد الآن|تحويل داخل المنصة|محفظة/ })).toHaveCount(0);
});

test('governing-terms mismatch is not described as a failed payment and preserves entered fields', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-finance-003-report-external-payment--terms-mismatch');

  await expect(page.getByText('لا يمكن تسجيل هذا الحدث المالي وفق الشروط والسجل الحاليين للحالة.', { exact: true })).toBeVisible();
  await expect(page.getByText(/لم تتم محاولة دفع داخل UberTib/)).toBeVisible();
  await expect(page.getByLabel('المبلغ الذي دفعته خارج المنصة')).toHaveValue('20000');
  await expect(page.getByLabel('العملة')).toHaveValue('USD');
  await expect(page.getByText(/فشل الدفع|تعذر الدفع|تم رفض الدفع/i)).toHaveCount(0);
});

test('successful external report becomes reported-unconfirmed rather than paid or settled', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-finance-003-report-external-payment--submitted');

  await expect(page.getByText('مُبلَّغ عنه — غير مؤكَّد', { exact: true })).toBeVisible();
  await expect(page.getByText('تمت إضافة سجل واحد لهذه المحاولة.', { exact: true })).toBeVisible();
  await expect(page.getByText(/لا يعني ذلك أن UberTib قبض المبلغ أو حوّله أو سوّاه/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'عرض السجل المالي' })).toBeVisible();
});

test('dispute requires a reason while confirmation remains independently available', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-finance-004-financial-event-response--ready');

  await expect(page.getByText('الواقعة الأصلية', { exact: true })).toBeVisible();
  await expect(page.getByText('مُبلَّغ عنه — غير مؤكَّد', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'تأكيد دقة الواقعة' })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'الاعتراض على الواقعة' })).toBeDisabled();
  await expect(page.getByText(/الاعتراض يضيف ردًا.*مسار المراجعة المالية/)).toBeVisible();

  await page.getByLabel('سبب الاعتراض').fill('المبلغ المسجّل لا يطابق ما دفعته للعيادة.');
  await expect(page.getByRole('button', { name: 'الاعتراض على الواقعة' })).toBeEnabled();
});

test('a dispute appends a response while the original assertion remains readable', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-finance-004-financial-event-response--disputed');

  await expect(page.getByText('الواقعة الأصلية', { exact: true })).toBeVisible();
  await expect(page.getByText('مُبلَّغ عنه — غير مؤكَّد', { exact: true })).toBeVisible();
  await expect(page.getByText('الرد المضاف لاحقًا', { exact: true })).toBeVisible();
  await expect(page.getByText('محل اعتراض', { exact: true })).toBeVisible();
  await expect(page.getByText(/سبب الاعتراض: المبلغ المسجّل لا يطابق ما دفعته للعيادة/)).toBeVisible();
  await expect(page.getByRole('button', { name: /تعديل|حذف/ })).toHaveCount(0);
});

test('timeline prioritizes the pending counterparty response as the one primary financial action', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-finance-002-financial-timeline--response-required');

  await expect(page.getByRole('button', { name: 'مراجعة الواقعة والرد' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'تسجيل دفعة تمت خارج المنصة' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'عرض الشروط المقبولة' })).toBeVisible();
});

test('care-reading flow responds append-only, then exposes external payment reporting', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  test.setTimeout(60_000);
  await gotoStory(page, 'patient-flows-flow-clinical-008-care-reading--default');

  await page.getByRole('button', { name: /تنظيف الأسنان.*مركز الأمل/ }).click();
  await page.getByRole('button', { name: 'الشروط المالية المسجّلة' }).click();
  await page.getByRole('button', { name: 'فتح السجل المالي' }).click();

  await page.getByRole('button', { name: 'مراجعة الواقعة والرد' }).click();
  await expect(page.getByText('هل هذه الواقعة دقيقة؟', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'تأكيد دقة الواقعة' }).click();
  await expect(page.getByText('الرد المضاف لاحقًا', { exact: true })).toBeVisible();
  await expect(page.getByText('مؤكَّد', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'العودة إلى السجل المالي' }).click();

  await expect(page.getByRole('button', { name: 'تسجيل دفعة تمت خارج المنصة' })).toBeVisible();
  await page.getByRole('button', { name: 'تسجيل دفعة تمت خارج المنصة' }).click();
  await expect(page.getByText('سجّل ما دفعته خارج UberTib', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'تسجيل هذه الواقعة' }).click();
  await expect(page.getByText('تم تسجيل الواقعة', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'عرض السجل المالي' }).click();
  await expect(page.getByText('أبلغ المريض عن مبلغ دفعه للعيادة خارج UberTib.', { exact: true })).toBeVisible();
});
