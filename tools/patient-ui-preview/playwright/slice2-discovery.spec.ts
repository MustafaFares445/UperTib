import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page, type TestInfo } from '@playwright/test';

const PRIMARY_PROJECT = 'patient-390';

function onlyOnPrimaryProject(testInfo: TestInfo) {
  test.skip(testInfo.project.name !== PRIMARY_PROJECT, 'Functional assertion — runs once, not per viewport.');
}

async function gotoStory(page: Page, id: string) {
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  await page.waitForFunction(() => (document.getElementById('storybook-root')?.childElementCount ?? 0) > 0, {
    timeout: 45_000,
  });
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

test('provider search keeps service context explicit and one dominant search action', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-elig-001-provider-search--default');

  await expect(page.getByText('الخدمة التي تبحث عنها')).toBeVisible();
  await expect(page.getByText('حشوات الأسنان', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: /تغيير الخدمة المختارة/ })).toBeVisible();
  await expect(page.getByRole('button', { name: 'عرض الأطباء' })).toHaveCount(1);
  await expect(page.getByText('المنطقة داخل حلب (اختياري)')).toBeVisible();
});

test('area-filtered results expose the active filter and a direct clear action', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-elig-002-provider-results--area-filtered');

  await expect(page.getByText('المنطقة: حلب الجديدة')).toBeVisible();
  await expect(page.getByRole('button', { name: 'إزالة فلتر المنطقة حلب الجديدة' })).toBeVisible();
  await expect(page.getByText('خيار واحد', { exact: true })).toBeVisible();
});

test.describe('eligibility explanation stays patient-safe and responsive', () => {
  for (const story of ['eligible', 'pending-evaluation', 'not-eligible']) {
    test(story, async ({ page }, testInfo) => {
      await gotoStory(page, `patient-screens-scr-elig-004-eligibility-explanation--${story}`);
      await expectNoHorizontalOverflow(page, `eligibility explanation ${story}`);

      if (testInfo.project.name === PRIMARY_PROJECT) {
        await expect(page.getByText('ماذا تعني حالة هذا الخيار؟')).toBeVisible();
        await expect(page.getByText('حشوات الأسنان', { exact: true })).toBeVisible();
        await expect(page.getByText('عيادة الشهباء لطب الأسنان', { exact: true })).toBeVisible();
        await expect(page.getByText('آخر تقييم لهذه الخدمة في هذا الفرع')).toBeVisible();
        await expect(page.getByText(/درجات المخاطر الداخلية/)).toBeVisible();
        await expect(page.getByText(/ترتيبًا عامًا للطبيب/)).toBeVisible();
        await expectNoSeriousAccessibilityViolations(page, `eligibility explanation ${story}`);
      }
    });
  }
});

test('catalog does not expose orthodontics, which is outside the current product scope', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-catalog-001-service-groups--default');

  await expect(page.getByText('تقويم الأسنان', { exact: true })).toHaveCount(0);
  await expect(page.getByText('تجميل الأسنان', { exact: true })).toBeVisible();
});

test('provider decision sends explanation to a separate progressive-disclosure route', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-elig-003-provider-decision-card--default');

  await expect(page.getByText('لماذا هذا الخيار متاح؟')).toBeVisible();
  await expect(page.getByRole('link', { name: 'لماذا هذا الخيار متاح لهذه الخدمة في هذا الفرع؟' })).toBeVisible();
  await expect(page.getByText('ما معنى حالة التوفر؟')).toHaveCount(0);
});
