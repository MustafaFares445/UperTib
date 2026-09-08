import { expect, test, type Page, type TestInfo } from '@playwright/test';

const PRIMARY_PROJECT = 'patient-390';

function onlyOnPrimaryProject(testInfo: TestInfo) {
  test.skip(testInfo.project.name !== PRIMARY_PROJECT, 'Functional disclosure assertion runs once.');
}

async function gotoStory(page: Page, id: string) {
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  await page.waitForFunction(() => (document.getElementById('storybook-root')?.childElementCount ?? 0) > 0, {
    timeout: 45_000,
  });
}

test('WP-UX-06 places the current financial position before chronology at every Patient width', async ({ page }) => {
  await gotoStory(page, 'patient-screens-scr-finance-002-financial-timeline--default');

  const currentHeading = page.getByText('الوضع الحالي المشتق', { exact: true });
  const historyHeading = page.getByText('الوقائع المسجَّلة', { exact: true });
  await expect(currentHeading).toBeVisible();
  await expect(historyHeading).toBeVisible();

  const [currentBox, historyBox] = await Promise.all([currentHeading.boundingBox(), historyHeading.boundingBox()]);
  expect(currentBox).not.toBeNull();
  expect(historyBox).not.toBeNull();
  expect(currentBox!.y, 'current position must precede long chronology').toBeLessThan(historyBox!.y);
});

test('WP-UX-06 keeps unresolved financial facts visible and collapses only confirmed completed history', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-finance-002-financial-timeline--default');

  await expect(page.getByText('سجّلت العيادة واقعة مالية إضافية مرتبطة بهذه الحالة.', { exact: true })).toBeVisible();
  await expect(page.getByText('سُجّلت واقعة استرداد خارجية مرتبطة بهذه الحالة وبقي تنفيذها خارج UberTib.', { exact: true })).toBeVisible();

  const confirmedSummary = page.getByText('أبلغ المريض عن مبلغ دُفع للعيادة خارج UberTib.', { exact: true });
  await expect(confirmedSummary).toHaveCount(0);

  const disclosure = page.getByRole('button', { name: 'عرض السجل المؤكَّد السابق' });
  await expect(disclosure).toBeVisible();
  await disclosure.click();

  await expect(page.getByRole('button', { name: 'إخفاء السجل المؤكَّد السابق' })).toBeVisible();
  await expect(confirmedSummary).toBeVisible();
});

test('WP-UX-06 never manufactures a current position from partial history', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-finance-002-financial-timeline--partial-history');

  await expect(page.getByText('السجل غير مكتمل.', { exact: true })).toBeVisible();
  await expect(page.getByText('الوضع الحالي المشتق', { exact: true })).toHaveCount(0);
});

test('WP-UX-06 leaves a Patient-response financial fact outside collapsed history', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-finance-002-financial-timeline--response-required');

  await expect(page.getByText('واقعة مالية أبلغت عنها العيادة', { exact: true })).toBeVisible();
  await expect(page.getByText(/يحتاج السجل إلى ردك على دقة هذه الواقعة/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'مراجعة الواقعة والرد' })).toBeVisible();
});
