import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

async function gotoStory(page: Page, id: string) {
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  await page.waitForFunction(() => (document.getElementById('storybook-root')?.childElementCount ?? 0) > 0, {
    timeout: 45_000,
  });
}

test('Storybook renders the React Native Web readiness story in RTL', async ({ page }, testInfo) => {
  await page.goto('/iframe.html?id=environment-readiness--default&viewMode=story');
  await expect(page.getByText('UberTib Patient UI Preview')).toBeVisible({ timeout: 15000 });
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  // @storybook/addon-a11y also runs its own axe pass inside this iframe (the `a11y.test` story
  // parameter). Retry once if it collides with ours ("Axe is already running").
  const accessibility = await new AxeBuilder({ page }).analyze().catch(async (error) => {
    if (!String(error).includes('Axe is already running')) throw error;
    await page.waitForTimeout(1000);
    return new AxeBuilder({ page }).analyze();
  });
  expect(accessibility.violations).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath('readiness.png'), fullPage: true });
});

test('Slice 1.6 closure keeps currency facts atomic at 320 and states the slot commit boundary', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await gotoStory(page, 'patient-screens-scr-elig-002-provider-results--default');

  const currencyRuns = page.getByTestId('price-currency-run');
  expect(await currencyRuns.count()).toBeGreaterThan(0);

  const runCount = await currencyRuns.count();
  for (let index = 0; index < runCount; index += 1) {
    const metrics = await currencyRuns.nth(index).evaluate((element) => {
      const textElement = element.querySelector<HTMLElement>('*') ?? (element as HTMLElement);
      const lineHeight = Number.parseFloat(getComputedStyle(textElement).lineHeight);
      return { height: element.getBoundingClientRect().height, lineHeight };
    });
    expect(Number.isFinite(metrics.lineHeight)).toBe(true);
    expect(metrics.height).toBeLessThanOrEqual(metrics.lineHeight * 1.35);
  }

  const overflows = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  expect(overflows).toBe(false);

  await gotoStory(page, 'patient-screens-scr-booking-001-slot-selection--default');
  await expect(
    page.getByText('اختر التاريخ أولًا، ثم وقتًا واحدًا. التوفر إرشادي الآن؛ لا يُحجز الوقت فعليًا إلا عند إرسال طلب الحجز وإعادة التحقق.'),
  ).toBeVisible();
});
