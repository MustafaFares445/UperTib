import { expect, test, type Page, type TestInfo } from '@playwright/test';

const PRIMARY_PROJECT = 'patient-390';

function onlyOnPrimaryProject(testInfo: TestInfo) {
  test.skip(testInfo.project.name !== PRIMARY_PROJECT, 'Cross-screen journey assertion — runs once.');
}

async function gotoStory(page: Page, id: string) {
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  await page.waitForFunction(() => (document.getElementById('storybook-root')?.childElementCount ?? 0) > 0, { timeout: 45_000 });
}

test('attention re-entry discards stale entry state in favor of authoritative booking state', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-flows-remaining-canonical-patient-journeys--attention-notification-reentry');

  const alternativeAttention = page.getByRole('button', { name: /^اختر ما إذا كان الموعد البديل يناسبك/ }).first();
  await expect(alternativeAttention).toBeVisible();
  await alternativeAttention.click();
  await expect(page.getByRole('heading', { name: 'تفاصيل الحجز' })).toBeVisible();
  await expect(page.getByText('الموعد مؤكَّد', { exact: true })).toBeVisible();
  await expect(page.getByText('عُرض موعد بديل', { exact: true })).toHaveCount(0);
});

test('notification-centre re-entry also opens the current authoritative record', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-flows-remaining-canonical-patient-journeys--attention-notification-reentry');

  await page.getByRole('button', { name: /مركز الإشعارات/ }).click();
  await expect(page.getByRole('heading', { name: 'مركز الإشعارات' })).toBeVisible();
  await page.getByText('موعدك المؤكد جاهز للمراجعة', { exact: true }).click();
  await expect(page.getByRole('heading', { name: 'تفاصيل الحجز' })).toBeVisible();
  await expect(page.getByText('الموعد مؤكَّد', { exact: true })).toBeVisible();
});

test('booking alternative journey passes through detail and dedicated decision screen', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-flows-remaining-canonical-patient-journeys--booking-alternative-cancellation-and-reschedule');

  await page.getByRole('button', { name: /عُرض موعد بديل/ }).click();
  await expect(page.getByRole('heading', { name: 'تفاصيل الحجز' })).toBeVisible();
  await page.getByRole('button', { name: 'مراجعة الموعد البديل' }).click();
  await expect(page.getByRole('heading', { name: 'القرار بشأن الموعد البديل' })).toBeVisible();
  await page.getByRole('button', { name: 'رفض الموعد البديل' }).click();
  await expect(page.getByRole('heading', { name: 'تفاصيل الحجز' })).toBeVisible();
  await expect(page.getByText('لم يُؤكَّد — تم رفض البديل', { exact: true })).toBeVisible();
  await expect(page.getByText('ALTERNATIVE_DECLINED', { exact: true })).toHaveCount(0);
});

test('confirmed cancellation routes through policy consequence before returning to authoritative detail', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-flows-remaining-canonical-patient-journeys--booking-alternative-cancellation-and-reschedule');

  await page.getByRole('button', { name: /مؤكَّد/ }).first().click();
  await expect(page.getByRole('heading', { name: 'تفاصيل الحجز' })).toBeVisible();
  await page.getByRole('button', { name: 'إلغاء الحجز' }).click();
  await expect(page.getByRole('heading', { name: 'إلغاء الحجز' })).toBeVisible();
  await expect(page.getByText('ما الذي سيحدث إذا ألغيت الآن؟', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'إلغاء الحجز' }).click();
  await expect(page.getByRole('heading', { name: 'تفاصيل الحجز' })).toBeVisible();
  await expect(page.getByText('تم إلغاء الحجز', { exact: true })).toBeVisible();
  await expect(page.getByText('PATIENT_CANCELLED_CONFIRMED', { exact: true })).toHaveCount(0);
});

test('reschedule journey creates a proposal while retaining the original confirmed appointment', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-flows-remaining-canonical-patient-journeys--booking-alternative-cancellation-and-reschedule');

  await page.getByRole('button', { name: /مؤكَّد/ }).first().click();
  await page.getByRole('button', { name: 'طلب تغيير الموعد' }).click();
  await expect(page.getByRole('heading', { name: 'طلب تغيير الموعد' })).toBeVisible();
  await expect(page.getByText('موعدك الحالي مؤكَّد', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'إرسال اقتراح تغيير الموعد' }).click();
  await expect(page.getByText('بانتظار الرد', { exact: true })).toBeVisible();
  await expect(page.getByText(/موعدك الحالي يبقى مؤكَّدًا/)).toBeVisible();
});

test('profile journey delegates representation to the existing representation surface', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-flows-remaining-canonical-patient-journeys--profile-to-representation');

  await page.getByRole('button', { name: /العائلة والتمثيل/ }).click();
  await expect(page.getByRole('heading', { name: 'الصلاحيات النشطة في مكان واحد' })).toBeVisible();
  await expect(page.getByText('الصلاحيات التي منحتها أنت', { exact: true })).toBeVisible();
  await expect(page.getByText('الصلاحيات التي لديك للآخرين', { exact: true })).toBeVisible();
});

test('follow-up journey opens the linked authoritative case rather than mutating provider-owned stage state', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-flows-remaining-canonical-patient-journeys--follow-up-to-case');

  await page.getByRole('button', { name: /متابعة مستحقة/ }).click();
  await expect(page.getByRole('heading', { name: 'حشوات الأسنان' })).toBeVisible();
  await expect(page.getByText('هذه الصفحة هي نقطة البداية لكل ما يخص هذه الحالة فقط.', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /إكمال المرحلة|إعادة فتح المرحلة/ })).toHaveCount(0);
});
