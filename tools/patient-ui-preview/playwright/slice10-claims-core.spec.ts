import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page, type TestInfo } from '@playwright/test';
import {
  defaultRefundEntitlement,
  expiredRefundEntitlement,
  incompleteRefundEntitlement,
  ineligibleRefundEntitlement,
  submitRefundRequest,
  unavailableSnapshotRefundEntitlement,
} from '../src/mocks/claims';

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
  'patient-screens-scr-claims-001-my-claims--default',
  'patient-screens-scr-claims-002-refund-request--default',
  'patient-screens-scr-claims-002-refund-request--evidence-incomplete',
  'patient-screens-scr-claims-002-refund-request--window-expired',
  'patient-screens-scr-claims-004-claim-detail--evidence-incomplete',
  'patient-screens-scr-claims-004-claim-detail--decided-refund',
  'patient-screens-scr-claims-004-claim-detail--all-evidence-states',
];

test.describe('Slice 10 claims core surfaces remain RTL, readable and reflow-safe', () => {
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

test('claim list exposes deadline, type, missing evidence and appeal eligibility before detail', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-claims-001-my-claims--default');

  await expect(page.getByText('طلب استرداد', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('مطالبة حماية', { exact: true })).toBeVisible();
  await expect(page.getByText(/المهلة الفعّالة:/).first()).toBeVisible();
  await expect(page.getByText('متطلبات تحتاج منك إجراء: 1', { exact: true })).toBeVisible();
  await expect(page.getByText('الاعتراض متاح لهذا القرار ضمن نافذته الحاكمة.', { exact: true })).toBeVisible();
});

test('filtered-empty is distinct from a genuinely empty claims list', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-claims-001-my-claims--default');
  await page.getByRole('button', { name: 'تصفية المطالبات: مغلق' }).click();
  await expect(page.getByText('لا توجد نتائج ضمن هذا الفلتر.', { exact: true })).toBeVisible();
  await expect(page.getByText(/الفلتر الحالي أخفاها/)).toBeVisible();

  await gotoStory(page, 'patient-screens-scr-claims-001-my-claims--empty');
  await expect(page.getByText('لا توجد مطالبات أو طلبات استرداد بعد.', { exact: true })).toBeVisible();
});

test('refund request states the external-execution boundary and never becomes a platform payment surface', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-claims-002-refund-request--default');

  await expect(page.getByText('ماذا تعني الموافقة إن صدرت؟', { exact: true })).toBeVisible();
  await expect(page.getByText(/UberTib لا يدفع المبلغ، ولا يحتفظ به، ولا ينفذ الاسترداد داخل المنصة/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'تقديم طلب الاسترداد' })).toBeEnabled();
  await expect(page.getByRole('button', { name: /ادفع|دفع الآن|محفظة|Checkout|تسوية/ })).toHaveCount(0);
});

test('governing snapshot unavailable, ineligible and expired conditions withhold refund authoring distinctly', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);

  await gotoStory(page, 'patient-screens-scr-claims-002-refund-request--governing-snapshot-unavailable');
  await expect(page.getByText('لا يمكن عرض الشروط الحاكمة الآن.', { exact: true })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'المبلغ المطلوب' })).toHaveCount(0);

  await gotoStory(page, 'patient-screens-scr-claims-002-refund-request--ineligible');
  await expect(page.getByText('هذه الحالة غير مؤهلة لطلب استرداد جديد.', { exact: true })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'المبلغ المطلوب' })).toHaveCount(0);

  await gotoStory(page, 'patient-screens-scr-claims-002-refund-request--window-expired');
  await expect(page.getByText('انتهت مهلة طلب الاسترداد.', { exact: true })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'المبلغ المطلوب' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /إعادة إرسال الطلب/ })).toHaveCount(0);
});

test('incomplete evidence names the missing requirement before submit and keeps the command unavailable', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-claims-002-refund-request--evidence-incomplete');

  await expect(page.getByText('مستند داعم مطلوب حسب السياسة', { exact: true })).toBeVisible();
  await expect(page.getByText('ما زال مطلوبًا قبل الإرسال', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'تقديم طلب الاسترداد' })).toBeDisabled();
  await expect(page.getByText(/أكمل المتطلب: مستند داعم مطلوب حسب السياسة/)).toBeVisible();
});

test('retryable refund submission failure preserves entered values and keeps one resumable intent', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-claims-002-refund-request--retryable-failure');

  await expect(page.getByText('تعذّر تأكيد إرسال الطلب.', { exact: true })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'المبلغ المطلوب' })).toHaveValue('50000');
  await expect(page.getByRole('textbox', { name: 'سبب الطلب' })).toHaveValue('أطلب مراجعة استرداد مرتبط بالزيارة المسجلة في هذه الحالة.');
  await expect(page.getByText(/تستخدم محاولة الإرسال نفسها بدل إنشاء طلب جديد/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'إعادة إرسال الطلب' })).toBeVisible();
});

test('refund submission projection keeps success submitted, idempotent and policy-bound', async ({}, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  const draft = {
    requestedAmount: '50000',
    reason: 'أطلب مراجعة استرداد مرتبط بالزيارة المسجلة في هذه الحالة.',
    occurrenceContext: 'واقعة مرتبطة بالزيارة.',
    evidenceIds: ['refund-evidence-visit'],
  };
  const key = 'refund-idempotency-test';

  const first = submitRefundRequest(defaultRefundEntitlement, draft, { idempotencyKey: key });
  expect(first.blockedBy).toBeUndefined();
  expect(first.claim?.state).toBe('SUBMITTED');
  expect(first.claim?.decision).toBeUndefined();

  const retry = submitRefundRequest(defaultRefundEntitlement, draft, {
    idempotencyKey: key,
    existingClaim: first.claim,
  });
  expect(retry.reused).toBe(true);
  expect(retry.claim?.id).toBe(first.claim?.id);

  const retryAfterWindow = submitRefundRequest(defaultRefundEntitlement, draft, {
    idempotencyKey: key,
    existingClaim: first.claim,
    nowIso: '2026-09-20T08:00:00+03:00',
  });
  expect(retryAfterWindow.reused).toBe(true);

  const conflict = submitRefundRequest(defaultRefundEntitlement, { ...draft, reason: 'سبب مختلف ماديًا.' }, {
    idempotencyKey: key,
    existingClaim: first.claim,
  });
  expect(conflict.blockedBy).toBe('IDEMPOTENCY_CONFLICT');

  expect(submitRefundRequest(unavailableSnapshotRefundEntitlement, draft, { idempotencyKey: 'no-snapshot' }).blockedBy)
    .toBe('GOVERNING_SNAPSHOT_UNAVAILABLE');
  expect(submitRefundRequest(ineligibleRefundEntitlement, draft, { idempotencyKey: 'ineligible' }).blockedBy)
    .toBe('INELIGIBLE');
  expect(submitRefundRequest(expiredRefundEntitlement, draft, { idempotencyKey: 'expired' }).blockedBy)
    .toBe('WINDOW_EXPIRED');
  expect(submitRefundRequest(incompleteRefundEntitlement, draft, { idempotencyKey: 'evidence' }).blockedBy)
    .toBe('EVIDENCE_INCOMPLETE');
});

test('claim detail preserves original and effective deadlines plus appended movement history', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-claims-004-claim-detail--evidence-incomplete');

  await expect(page.getByText('المهلة الأصلية', { exact: true })).toBeVisible();
  await expect(page.getByText('المهلة الفعّالة الآن', { exact: true })).toBeVisible();
  await expect(page.getByText('تمديد مسجّل', { exact: true })).toBeVisible();
  await expect(page.getByText(/تُضاف إلى السجل ولا تستبدل المهلة الأصلية/)).toBeVisible();
});

test('claim detail distinguishes missing, rejected, expired and accepted evidence with reasons', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-claims-004-claim-detail--all-evidence-states');

  await expect(page.getByText('مقبول', { exact: true })).toBeVisible();
  await expect(page.getByText('ناقص', { exact: true })).toBeVisible();
  await expect(page.getByText('مرفوض', { exact: true })).toBeVisible();
  await expect(page.getByText('منتهي الصلاحية', { exact: true })).toBeVisible();
  await expect(page.getByText(/لم يصل هذا المستند بعد/)).toBeVisible();
  await expect(page.getByText(/تم رفض هذا المستند لعدم وضوحه/)).toBeVisible();
  await expect(page.getByText(/انتهت صلاحية هذا التوثيق/)).toBeVisible();
});

test('unknown effective deadline fails closed for evidence authoring instead of being treated as unlimited time', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-claims-004-claim-detail--deadline-unavailable');

  await expect(page.getByText('المهلة الفعّالة غير متاحة حاليًا.', { exact: true })).toBeVisible();
  await expect(page.getByText(/غياب الموعد لا يعني أن الطلب بلا مهلة/)).toBeVisible();
  await expect(page.getByRole('button', { name: /استكمال:/ })).toHaveCount(0);
});

test('decided refund names the accountable reviewer and stays an external obligation rather than a platform refund', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-claims-004-claim-detail--decided-refund');

  await expect(page.getByText('مراجع مطالبات مخوّل', { exact: false })).toBeVisible();
  await expect(page.getByText(/مبلغ مستحق للتنفيذ الخارجي بين الأطراف/)).toBeVisible();
  await expect(page.getByText(/القرار لا يعني أن UberTib دفع أو احتفظ أو أعاد أي مبلغ/)).toBeVisible();
  await expect(page.getByText('التنفيذ الخارجي لم يُسجّل بعد.', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'تسجيل تنفيذ الاسترداد خارج UberTib' })).toBeVisible();
  await expect(page.getByText(/governingSnapshotId|reviewer-only|S\/P\/H\/I/)).toHaveCount(0);
});

test('FLOW-CLAIMS-001 submits a refund request and returns the new submitted claim to the list', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  test.setTimeout(60_000);
  await gotoStory(page, 'patient-flows-flow-claims-001-refund-request--default');

  await page.getByRole('button', { name: 'طلب استرداد جديد' }).click();
  await expect(page.getByText('راجع الشروط أولًا، ثم اكتب طلبك', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'تقديم طلب الاسترداد' }).click();
  await expect(page.getByText('أين وصل هذا الطلب؟', { exact: true })).toBeVisible();
  await expect(page.getByText('مُقدَّم', { exact: true })).toBeVisible();
  await expect(page.getByText('تنظيف الأسنان', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'العودة إلى المطالبات' }).click();
  await expect(page.getByText('ما الذي يحتاج متابعتك؟', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'فتح طلب الاسترداد — تنظيف الأسنان' })).toBeVisible();
});
