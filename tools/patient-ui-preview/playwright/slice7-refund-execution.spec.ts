import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page, type TestInfo } from '@playwright/test';
import {
  appendPatientRefundExecution,
  approvedRefundDecision,
  financialLedger,
  refundExecutionEvidenceIds,
} from '../src/mocks/finance';

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
  'patient-screens-scr-finance-005-report-refund-execution--default',
  'patient-screens-scr-finance-005-report-refund-execution--decision-mismatch',
  'patient-screens-scr-finance-005-report-refund-execution--no-approved-decision',
  'patient-screens-scr-finance-002-financial-timeline--refund-execution-available',
];

test.describe('Slice 7 refund-execution surfaces remain RTL, readable and reflow-safe', () => {
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

test('refund execution shows the approved decision amount and currency before recording', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-finance-005-report-refund-execution--default');

  await expect(page.getByText('قرار الاسترداد المعتمد', { exact: true })).toBeVisible();
  await expect(page.getByText(/20,000/)).toBeVisible();
  await expect(page.getByText('العملة المعتمدة: SYP.', { exact: true })).toBeVisible();
  await expect(page.getByLabel('مبلغ الاسترداد المنفّذ خارج المنصة')).toHaveValue('20000');
  await expect(page.getByLabel('عملة الاسترداد')).toHaveValue('SYP');
  await expect(page.getByRole('button', { name: 'تسجيل تنفيذ الاسترداد الخارجي' })).toBeEnabled();
  await expect(page.getByText(/UberTib لا ينفّذ الاسترداد/)).toBeVisible();
  await expect(page.getByRole('button', { name: /استرداد الآن|إرسال الأموال|محفظة|تحويل/ })).toHaveCount(0);
});

test('amount or currency mismatch is a record-validation failure, never a partial or failed refund', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-finance-005-report-refund-execution--decision-mismatch');

  await expect(page.getByLabel('مبلغ الاسترداد المنفّذ خارج المنصة')).toHaveValue('15000');
  await expect(page.getByLabel('عملة الاسترداد')).toHaveValue('USD');
  await expect(page.getByRole('button', { name: 'تسجيل تنفيذ الاسترداد الخارجي' })).toBeDisabled();
  await expect(page.getByText('لا يمكن تسجيل هذا الحدث المالي وفق الشروط والسجل الحاليين للحالة.', { exact: true })).toBeVisible();
  await expect(page.getByText(/لا يُعامل كتنفيذ جزئي/)).toBeVisible();
  await expect(page.getByText(/فشل الاسترداد|تعذر الاسترداد|رفض الاسترداد/i)).toHaveCount(0);
});

test('without an approved refund decision the record action is structurally absent', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-finance-005-report-refund-execution--no-approved-decision');

  await expect(page.getByText('لا يوجد قرار استرداد معتمد يمكن تسجيل تنفيذ له.', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'تسجيل تنفيذ الاسترداد الخارجي' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'العودة إلى السجل المالي' })).toBeVisible();
});

test('submitted refund execution remains an unconfirmed external assertion', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-finance-005-report-refund-execution--submitted');

  await expect(page.getByText('مُبلَّغ عنه — غير مؤكَّد', { exact: true })).toBeVisible();
  await expect(page.getByText(/يبقى تنفيذ الاسترداد واقعة مُبلَّغًا عنها/)).toBeVisible();
  await expect(page.getByText(/لا يعني هذا أن UberTib نفّذ الاسترداد أو حوّل الأموال/)).toBeVisible();
});

test('refund projection requires exact decision matching and records one execution assertion per approved decision', async ({}, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  const draft = {
    amount: approvedRefundDecision.amount,
    currency: approvedRefundDecision.currency,
    occurredAtIso: '2026-09-06T18:50:00+03:00',
    evidenceIds: refundExecutionEvidenceIds,
  };

  const mismatchAmount = appendPatientRefundExecution(financialLedger, approvedRefundDecision, { ...draft, amount: draft.amount - 1 });
  const mismatchCurrency = appendPatientRefundExecution(financialLedger, approvedRefundDecision, { ...draft, currency: 'USD' });
  expect(mismatchAmount).toEqual(financialLedger);
  expect(mismatchCurrency).toEqual(financialLedger);

  const once = appendPatientRefundExecution(financialLedger, approvedRefundDecision, draft);
  expect(once.events).toHaveLength(financialLedger.events.length + 1);
  expect(once.events.at(-1)?.status).toBe('REPORTED_UNCONFIRMED');
  expect(once.events.at(-1)?.approvedRefundDecisionId).toBe(approvedRefundDecision.id);
  expect(once.position.refunded).toBe(financialLedger.position.refunded + approvedRefundDecision.amount);
  expect(once.position.pendingExternalExecution).toBe(0);

  const identicalRetry = appendPatientRefundExecution(once, approvedRefundDecision, draft);
  const secondExecutionSameDecision = appendPatientRefundExecution(once, approvedRefundDecision, {
    ...draft,
    occurredAtIso: '2026-09-06T19:05:00+03:00',
  });
  expect(identicalRetry).toEqual(once);
  expect(secondExecutionSameDecision).toEqual(once);
});

test('financial timeline keeps payment as the dominant action and refund execution as supporting action', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-finance-002-financial-timeline--refund-execution-available');

  const buttons = page.getByRole('button');
  await expect(page.getByRole('button', { name: 'تسجيل دفعة تمت خارج المنصة' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'تسجيل تنفيذ استرداد خارجي' })).toBeVisible();
  await expect(buttons.first()).toHaveText('تسجيل دفعة تمت خارج المنصة');
});

test('care-reading flow records refund execution outside UberTib and returns to the ledger', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  test.setTimeout(60_000);
  await gotoStory(page, 'patient-flows-flow-clinical-008-care-reading--default');

  await page.getByRole('button', { name: /تنظيف الأسنان.*مركز الأمل/ }).click();
  await page.getByRole('button', { name: 'الشروط المالية المسجّلة' }).click();
  await page.getByRole('button', { name: 'فتح السجل المالي' }).click();

  await expect(page.getByRole('button', { name: 'تسجيل تنفيذ استرداد خارجي' })).toBeVisible();
  await page.getByRole('button', { name: 'تسجيل تنفيذ استرداد خارجي' }).click();
  await expect(page.getByText('سجّل أن الاسترداد المعتمد نُفّذ خارج UberTib', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'تسجيل تنفيذ الاسترداد الخارجي' }).click();
  await expect(page.getByText('تم تسجيل واقعة التنفيذ', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'عرض السجل المالي' }).click();
  await expect(page.getByText('أُبلغ عن تنفيذ استرداد خارج المنصة', { exact: true })).toBeVisible();
  await expect(page.getByText(/تبقى هذه واقعة غير مؤكدة حتى يرد الطرف الآخر/)).toBeVisible();
});
