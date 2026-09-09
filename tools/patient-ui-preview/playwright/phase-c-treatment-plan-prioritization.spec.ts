import { expect, test, type Page } from '@playwright/test';

async function gotoStory(page: Page, id: string) {
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  await page.waitForFunction(() => (document.getElementById('storybook-root')?.childElementCount ?? 0) > 0, { timeout: 45_000 });
}

async function expectNoHorizontalOverflow(page: Page, label: string) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  expect(overflow, `${label} overflows horizontally`).toBe(false);
}

test('WP-UX-06 proposed treatment plan keeps changed and controlling facts ahead of non-controlling recap', async ({ page }, testInfo) => {
  const id = 'patient-screens-scr-clinical-003-treatment-plan--proposed-amendment';
  await gotoStory(page, id);
  await expectNoHorizontalOverflow(page, `${id} / ${testInfo.project.name}`);

  const amendment = page.getByText('ما الذي تغيّر؟', { exact: true });
  const total = page.getByText('إجمالي الخطة', { exact: true });
  const lines = page.getByText('بنود الخطة', { exact: true });
  const disclosure = page.getByRole('button', { name: 'عرض ما الذي تشمله الخطة؟' });

  await expect(page.getByText(/الخطة المقترحة متاحة للمراجعة حتى/)).toBeVisible();
  await expect(amendment).toBeVisible();
  await expect(page.getByText('خيار مادة إضافي', { exact: true })).toBeVisible();
  await expect(total).toBeVisible();
  await expect(page.getByText(/أي تغيير جوهري لاحقًا يحتاج نسخة جديدة وموافقة جديدة/)).toBeVisible();
  await expect(page.getByText(/لا تعني الخطة أن UberTib شخص الحالة أو نفّذ أي دفعة/)).toBeVisible();

  await expect(disclosure).toBeVisible();
  await expect(disclosure).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByText('العناصر المذكورة داخل كل بند فقط', { exact: true })).toHaveCount(0);
  await expect(page.getByText('أي خدمة أو مادة غير مذكورة صراحة في الخطة', { exact: true })).toHaveCount(0);

  const [amendmentBox, totalBox, linesBox] = await Promise.all([
    amendment.boundingBox(),
    total.boundingBox(),
    lines.boundingBox(),
  ]);
  expect(amendmentBox?.y).toBeLessThan(totalBox?.y ?? Number.POSITIVE_INFINITY);
  expect(totalBox?.y).toBeLessThan(linesBox?.y ?? Number.POSITIVE_INFINITY);

  await disclosure.click();
  await expect(page.getByRole('button', { name: 'إخفاء ما الذي تشمله الخطة؟' })).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByText('العناصر المذكورة داخل كل بند فقط', { exact: true })).toBeVisible();
  await expect(page.getByText('أي خدمة أو مادة غير مذكورة صراحة في الخطة', { exact: true })).toBeVisible();
});
