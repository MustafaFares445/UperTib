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
  'patient-screens-scr-finance-001-accepted-financial-terms--default',
  'patient-screens-scr-finance-002-financial-timeline--default',
  'patient-widgets-wgt-finance-001-external-financial-event-ledger--partial-history',
];

test.describe('Slice 5 finance surfaces remain RTL, readable and reflow-safe', () => {
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

test('accepted financial terms preserve the agreed currency and do not become a payment surface', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-finance-001-accepted-financial-terms--default');

  await expect(page.getByText('الإجمالي المقبول', { exact: true })).toBeVisible();
  await expect(page.getByText(/150,000/)).toBeVisible();
  await expect(page.getByText(/لا يُعاد احتسابه بسعر صرف لاحق/)).toBeVisible();
  await expect(page.getByText(/السداد يتم خارج UberTib مباشرة/)).toBeVisible();
  await expect(page.getByRole('button', { name: /ادفع|سداد الآن|محفظة|تحويل داخل المنصة|استرداد الآن/ })).toHaveCount(0);
});

test('partial accepted terms suppress the total instead of presenting a wrong amount', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-finance-001-accepted-financial-terms--partial-lines');

  await expect(page.getByText('لن نعرض إجماليًا ناقصًا.', { exact: true })).toBeVisible();
  await expect(page.getByText(/تعذّر تحميل أحد البنود المقبولة/)).toBeVisible();
  await expect(page.getByText('الإجمالي المقبول', { exact: true })).toHaveCount(0);
});

test('financial timeline distinguishes all six required financial meanings without implying custody', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-finance-002-financial-timeline--default');

  for (const label of [
    'المتفق عليه',
    'مُبلَّغ عنه خارجيًا',
    'مؤكَّد كسجل',
    'محل اعتراض',
    'استرداد خارجي مسجَّل',
    'بانتظار تنفيذ خارجي',
  ]) {
    // A lifecycle chip and a derived-position fact may intentionally share the same governed label
    // (for example "محل اعتراض"). The assertion verifies the meaning is present without requiring
    // the DOM to contain only one semantic occurrence.
    await expect(page.getByText(label, { exact: true }).first()).toBeVisible();
  }

  await expect(page.getByText('مُبلَّغ عنه — غير مؤكَّد', { exact: true })).toBeVisible();
  await expect(page.getByText('مؤكَّد', { exact: true })).toBeVisible();
  await expect(page.getByText('محل اعتراض', { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/ليس محفظة، ولا ينفّذ دفعًا أو استردادًا/)).toBeVisible();
  await expect(page.getByRole('button', { name: /ادفع|سداد الآن|محفظة|تحويل|استرداد الآن/ })).toHaveCount(0);
});

test('partial financial history hides the derived position until the event set is complete', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-widgets-wgt-finance-001-external-financial-event-ledger--partial-history');

  await expect(page.getByText('السجل غير مكتمل.', { exact: true })).toBeVisible();
  await expect(page.getByText(/الوضع المشتق مخفي حتى يكتمل السجل/)).toBeVisible();
  await expect(page.getByText('الوضع الحالي المشتق', { exact: true })).toHaveCount(0);
  await expect(page.getByText('المتفق عليه في الشروط المقبولة', { exact: true })).toBeVisible();
});

test('empty financial history still shows the immutable agreed position and explains that no events exist', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-finance-002-financial-timeline--no-events-yet');

  await expect(page.getByText('لا توجد وقائع مالية مسجَّلة بعد.', { exact: true })).toBeVisible();
  await expect(page.getByText('المتفق عليه في الشروط المقبولة', { exact: true })).toBeVisible();
  await expect(page.getByText('الوضع الحالي المشتق', { exact: true })).toBeVisible();
});

test('care-reading flow reaches financial terms and timeline only for a case with a financial snapshot', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  test.setTimeout(60_000);
  await gotoStory(page, 'patient-flows-flow-clinical-008-care-reading--default');

  await page.getByRole('button', { name: /تنظيف الأسنان.*مركز الأمل/ }).click();
  await expect(page.getByRole('button', { name: 'الشروط المالية المسجّلة' })).toBeVisible();
  await page.getByRole('button', { name: 'الشروط المالية المسجّلة' }).click();

  await expect(page.getByText('الشروط المالية المقبولة', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'فتح السجل المالي' }).click();
  await expect(page.getByText('السجل المالي', { exact: true })).toBeVisible();
  await expect(page.getByText('الوضع الحالي المشتق', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'عرض الشروط المقبولة' }).click();
  await expect(page.getByText('البنود المقبولة', { exact: true })).toBeVisible();
});
