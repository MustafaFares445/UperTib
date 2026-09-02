import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('Storybook renders the React Native Web readiness story in RTL', async ({ page }, testInfo) => {
  await page.goto('/iframe.html?id=environment-readiness--default&viewMode=story');
  await expect(page.getByText('UberTib Patient UI Preview')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath('readiness.png'), fullPage: true });
});
