import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

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
