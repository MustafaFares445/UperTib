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
    page.getByText('التوفر إرشادي الآن؛ لا يُحجز الوقت فعليًا إلا عند إرسال طلب الحجز وإعادة التحقق.'),
  ).toBeVisible();
});

test('the price range separator stays between the two amounts in RTL', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await gotoStory(page, 'patient-components-cmp-elig-002-price-display--all-governed-modes');

  // Regression guard. `formatCurrency` emits an RTL-marked string, so concatenating the en dash
  // into either amount hands it to bidi resolution and it resolves to the far edge of the row —
  // rendering `40,000 ل.س. 80,000 ل.س. –`, where the separator no longer separates anything.
  // Atomic-run and overflow checks both pass while that is broken, so assert the geometry: in an
  // RTL row the minimum sits rightmost, then the dash, then the maximum.
  //
  // Located structurally rather than by accessible name: the formatted amounts carry invisible
  // bidi control characters, which makes any literal name string in this file unreadable and
  // fragile.
  const order = await page.evaluate(() => {
    const rows = [...document.querySelectorAll('#storybook-root *')].filter(
      (element) => element.querySelectorAll('[data-testid="price-currency-run"]').length === 2,
    );
    const row = rows[rows.length - 1];
    if (!row) return null;

    const centre = (element: Element) => {
      const box = element.getBoundingClientRect();
      return box.left + box.width / 2;
    };
    const runs = [...row.querySelectorAll('[data-testid="price-currency-run"]')];
    // The dash may be nested in a no-wrap group with the lower amount, so search the subtree and
    // take the deepest element whose whole text is the separator.
    const dash = [...row.querySelectorAll('*')]
      .filter((element) => element.textContent?.trim() === '–')
      .pop();
    return {
      label: row.getAttribute('aria-label'),
      hasDash: Boolean(dash),
      minCentre: centre(runs[0]!),
      dashCentre: dash ? centre(dash) : null,
      maxCentre: centre(runs[1]!),
    };
  });

  expect(order).not.toBeNull();
  expect(order!.hasDash).toBe(true);
  // The dash alone does not say "to", so the row announces the relation in words.
  expect(order!.label).toContain('من');
  expect(order!.label).toContain('إلى');
  // Right-to-left reading order: minimum, separator, maximum.
  expect(order!.minCentre).toBeGreaterThan(order!.dashCentre!);
  expect(order!.dashCentre!).toBeGreaterThan(order!.maxCentre);
});
