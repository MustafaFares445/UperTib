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

const READY_STATES = [
  {
    id: 'patient-screens-scr-claims-003-protection-claim--default',
    hiddenCompletedEvidence: 'مستند داعم للحالة',
    currentControlLabel: 'المعالجة التي تطلب مراجعتها',
  },
  {
    id: 'patient-screens-scr-identity-037-add-dependent--ready-for-verification',
    hiddenCompletedEvidence: 'مستند العلاقة أو الأساس القانوني',
    currentControlLabel: 'إرسال طلب التحقق',
  },
] as const;

test.describe('WP-UX-06 completed evidence becomes recoverable history at phone widths', () => {
  for (const state of READY_STATES) {
    test(`${state.id} keeps completed evidence behind an accessible disclosure`, async ({ page }, testInfo) => {
      await gotoStory(page, state.id);
      await expectNoHorizontalOverflow(page, `${state.id} / ${testInfo.project.name}`);

      const disclosure = page.getByRole('button', { name: 'عرض الأدلة المقبولة المكتملة' });
      await expect(disclosure).toBeVisible();
      await expect(disclosure).toHaveAttribute('aria-expanded', 'false');
      await expect(page.getByText(state.hiddenCompletedEvidence, { exact: true })).toHaveCount(0);

      if (state.currentControlLabel === 'إرسال طلب التحقق') {
        await expect(page.getByRole('button', { name: state.currentControlLabel })).toBeEnabled();
      } else {
        await expect(page.getByRole('textbox', { name: state.currentControlLabel })).toBeVisible();
      }

      await disclosure.click();
      await expect(page.getByText(state.hiddenCompletedEvidence, { exact: true })).toBeVisible();
      await expect(page.getByRole('button', { name: 'إخفاء الأدلة المقبولة المكتملة' })).toBeVisible();
    });
  }
});

test('retryable protection evidence stays expanded before completed evidence history', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-claims-003-protection-claim--evidence-retryable-failure');

  const outstanding = page.getByTestId('evidence-requirement-protection-requirement-support');
  const disclosure = page.getByRole('button', { name: 'عرض الأدلة المقبولة المكتملة' });
  await expect(outstanding).toBeVisible();
  await expect(outstanding.getByText('تعذّر الرفع — أعد المحاولة', { exact: true })).toBeVisible();
  await expect(page.getByText('المطلوب الآن: مستند يدعم ما حدث', { exact: true })).toBeVisible();
  await expect(page.getByText('مرجع الزيارة', { exact: true })).toHaveCount(0);
  await expect(disclosure).toBeVisible();

  const disclosureHandle = await disclosure.elementHandle();
  expect(disclosureHandle).not.toBeNull();
  const outstandingComesFirst = await outstanding.evaluate(
    (node, laterNode) => Boolean(node.compareDocumentPosition(laterNode as Node) & Node.DOCUMENT_POSITION_FOLLOWING),
    disclosureHandle,
  );
  expect(outstandingComesFirst).toBe(true);
});

test('rejected dependent evidence stays expanded while an accepted requirement is collapsed', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-identity-037-add-dependent--evidence-rejected');

  await expect(page.getByText('المطلوب الآن: إثبات العلاقة أو الأساس القانوني.', { exact: false })).toBeVisible();
  await expect(page.getByText('مرفوض — يلزم استبدال الملف', { exact: true })).toBeVisible();
  await expect(page.getByText('المستند الحالي لا يوضح العلاقة أو الأساس القانوني المطلوب للتحقق.', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'استبدال الملف' })).toBeVisible();
  await expect(page.getByText('إثبات هوية التابع', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'عرض الأدلة المقبولة المكتملة' })).toBeVisible();
});

test('scanning dependent evidence remains current and never moves into completed history', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-identity-037-add-dependent--evidence-scanning');

  await expect(page.getByText('جارٍ الفحص', { exact: true })).toBeVisible();
  await expect(page.getByText(/قيد الفحص لا يحقق المتطلب قبل أن يصبح مقبولًا/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'إرسال طلب التحقق' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'عرض الأدلة المقبولة المكتملة' })).toBeVisible();
});

test('generic evidence panel preserves outstanding content when completed history is toggled', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-widgets-wgt-platform-008-evidence-transfer-panel--outstanding-first-with-completed-history');

  await expect(page.getByText('المستند المطلوب الآن', { exact: true })).toBeVisible();
  await expect(page.getByText('تعذّر الرفع — أعد المحاولة', { exact: true })).toBeVisible();
  await expect(page.getByText('مرجع مكتمل سابقًا', { exact: true })).toHaveCount(0);

  await page.getByRole('button', { name: 'عرض الأدلة المقبولة المكتملة' }).click();
  await expect(page.getByText('مرجع مكتمل سابقًا', { exact: true })).toBeVisible();
  await expect(page.getByText('المستند المطلوب الآن', { exact: true })).toBeVisible();
});
