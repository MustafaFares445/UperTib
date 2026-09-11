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
  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical');
  expect(serious, `${label}: ${JSON.stringify(serious, null, 2)}`).toEqual([]);
}

const NEW_SCREEN_HIGH_RISK = [
  'patient-screens-scr-platform-001-needs-attention--multiple-attention-items',
  'patient-screens-scr-platform-002-pending-submissions--mixed-outstanding',
  'patient-screens-scr-platform-009-notification-centre--chronological-record',
  'patient-screens-scr-booking-003-my-bookings--all-booking-states',
  'patient-screens-scr-booking-005-alternative-appointment-decision--pending-decision',
  'patient-screens-scr-booking-006-cancel-booking--policy-requires-reason',
  'patient-screens-scr-booking-016-reschedule-request--clinic-originated-pending-needs-patient',
  'patient-screens-scr-clinical-007-follow-ups--due-upcoming-and-history',
  'patient-screens-scr-identity-004-patient-profile--acting-for-another-patient',
];

test.describe('remaining canonical Patient screens stay RTL and reflow-safe', () => {
  for (const id of NEW_SCREEN_HIGH_RISK) {
    test(id, async ({ page }, testInfo) => {
      await gotoStory(page, id);
      await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
      await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
      await expectNoHorizontalOverflow(page, `${id} / ${testInfo.project.name}`);
      if (testInfo.project.name === PRIMARY_PROJECT) await expectNoSeriousAccessibilityViolations(page, id);
    });
  }
});

test('attention correctness does not depend on external notification transport', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-platform-001-needs-attention--multiple-attention-items');

  await expect(page.getByText('اختر ما إذا كان الموعد البديل يناسبك', { exact: true })).toBeVisible();
  await expect(page.getByText('أكمل الأدلة المطلوبة للمطالبة', { exact: true })).toBeVisible();
  await expect(page.getByText(/فتح أي عنصر يقرأ سجله الحالي من جديد/)).toBeVisible();
});

test('unknown submission outcome remains unresolved and blocks duplicate retry', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-platform-002-pending-submissions--timeout-still-unknown');

  await expect(page.getByText('لم نتأكد بعد مما إذا كان الطلب قد التزم.', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'التحقق من النتيجة' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'إعادة المحاولة بأمان' })).toHaveCount(0);
});

test('safe idempotent retry appears only after authoritative not-committed reconciliation', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-platform-002-pending-submissions--safe-idempotent-retry-available');

  await expect(page.getByText('أكدت القراءة الموثوقة أن الطلب لم يلتزم.', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'إعادة المحاولة بأمان' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'حذف هذه المحاولة المحلية' })).toBeVisible();
});

test('materially different retry is rejected instead of silently becoming a new command', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-platform-002-pending-submissions--materially-different-retry-rejected');

  await expect(page.getByText('تعذر تكرار الطلب لأن مفتاح إعادة المحاولة استُخدم لطلب مختلف.', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'إعادة المحاولة بأمان' })).toHaveCount(0);
});

test('notification centre remains a durable utility record and re-read entry point', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-platform-009-notification-centre--durable-entry-despite-transport-failure');

  await expect(page.getByText(/الرسائل النصية والتنبيهات الخارجية وسائل مساعدة فقط/)).toBeVisible();
  await expect(page.getByText(/فتح أي إشعار يقرأ السجل المرتبط من جديد/)).toBeVisible();
  await expect(page.getByText('اختر ما إذا كان الموعد البديل يناسبك', { exact: true })).toBeVisible();
});

test('booking list exposes action-required state and deadline before opening detail', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-booking-003-my-bookings--action-required-first');

  await expect(page.getByText('اتخذ قرارًا بشأن الموعد البديل', { exact: true })).toBeVisible();
  await expect(page.getByText('عُرض موعد بديل', { exact: true })).toBeVisible();
  await expect(page.getByText(/مهلة/).first()).toBeVisible();
});

test('alternative decision keeps original request before proposal and decline is one step', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-booking-005-alternative-appointment-decision--pending-decision');

  const original = page.getByRole('heading', { name: 'طلبك الأصلي' });
  const proposal = page.getByRole('heading', { name: 'الموعد الذي اقترحته العيادة' });
  await expect(original).toBeVisible();
  await expect(proposal).toBeVisible();
  const originalBeforeProposal = await original.evaluate(
    (node, other) => Boolean(node.compareDocumentPosition(other as Node) & Node.DOCUMENT_POSITION_FOLLOWING),
    await proposal.elementHandle(),
  );
  expect(originalBeforeProposal).toBe(true);
  await expect(page.getByText(/الرفض لا يحتاج تأكيدًا ثانيًا/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'رفض الموعد البديل' })).toBeVisible();
});

test('confirmed-booking cancellation shows policy consequence and requires reason only when governed', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-booking-006-cancel-booking--policy-requires-reason');

  await expect(page.getByText('ما الذي سيحدث إذا ألغيت الآن؟', { exact: true })).toBeVisible();
  await expect(page.getByText(/يجب تسجيل سبب الإلغاء قبل إنهاء الموعد/).first()).toBeVisible();
  const reason = page.getByRole('textbox', { name: 'سبب الإلغاء' });
  const cancel = page.getByRole('button', { name: 'إلغاء الحجز' });
  await expect(reason).toBeVisible();
  await expect(cancel).toBeDisabled();
  await reason.fill('لم يعد الموعد مناسبًا.');
  await expect(cancel).toBeEnabled();
});

test('missing cancellation consequence structurally withholds destructive commit', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-booking-006-cancel-booking--policy-consequence-unavailable');

  await expect(page.getByText('تعذر قراءة نتيجة سياسة الإلغاء لهذا الحجز.', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'إلغاء الحجز' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'إعادة قراءة السياسة' })).toBeVisible();
});

test('pending reschedule proposal never replaces the original confirmed appointment', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-booking-016-reschedule-request--clinic-originated-pending-needs-patient');

  await expect(page.getByText('موعدك الحالي مؤكَّد', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'موعدك المؤكد الحالي' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'اقتراح تغيير الموعد' })).toBeVisible();
  await expect(page.getByText(/موعدك الحالي يبقى مؤكَّدًا حتى تقبل الاقتراح/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'قبول الموعد المقترح' })).toBeVisible();
});

test('accepted reschedule is the only variant that presents the proposed slot as confirmed', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-booking-016-reschedule-request--accepted-moves-booking');

  await expect(page.getByText('الموعد الجديد مؤكَّد', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'الموعد السابق' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'موعدك المؤكد الجديد' })).toBeVisible();
});

test('follow-up screen puts due work first without exposing provider-owned controls', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-clinical-007-follow-ups--due-upcoming-and-history');

  const due = page.getByRole('heading', { name: 'تحتاجك الآن' });
  const history = page.getByRole('heading', { name: 'السجل المكتمل' });
  await expect(due).toBeVisible();
  await expect(history).toBeVisible();
  const dueBeforeHistory = await due.evaluate(
    (node, other) => Boolean(node.compareDocumentPosition(other as Node) & Node.DOCUMENT_POSITION_FOLLOWING),
    await history.elementHandle(),
  );
  expect(dueBeforeHistory).toBe(true);
  await expect(page.getByText(/فتح أي متابعة يعيدك إلى الحالة أو المرحلة الموثوقة/)).toBeVisible();
  await expect(page.getByRole('button', { name: /إكمال المرحلة|إعادة فتح المرحلة/ })).toHaveCount(0);
});

test('represented profile keeps acting and subject identities visible without granting capability', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-identity-004-patient-profile--acting-for-another-patient');

  await expect(page.getByText(/السجل الحالي:/)).toBeVisible();
  await expect(page.getByText(/يتصرف بصفته المستخدم المسجل/)).toBeVisible();
  await expect(page.getByRole('button', { name: /العائلة والتمثيل/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /الطلبات المعلّقة/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /مركز الإشعارات/ })).toBeVisible();
  await expect(page.getByText(/ليست تبويبًا رئيسيًا خامسًا/)).toBeVisible();
});
