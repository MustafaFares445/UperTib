import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page, type TestInfo } from '@playwright/test';

const PRIMARY_PROJECT = 'patient-390';

function onlyOnPrimaryProject(testInfo: TestInfo) {
  test.skip(testInfo.project.name !== PRIMARY_PROJECT, 'Shared accessibility/validation assertion runs once.');
}

async function gotoStory(page: Page, id: string) {
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  await page.waitForFunction(() => (document.getElementById('storybook-root')?.childElementCount ?? 0) > 0, {
    timeout: 45_000,
  });
}

async function describedFieldState(page: Page, label: string) {
  return page.getByLabel(label).evaluate((element) => {
    const describedBy = (element.getAttribute('aria-describedby') ?? '').trim().split(/\s+/).filter(Boolean);
    return {
      invalid: element.getAttribute('aria-invalid'),
      describedBy,
      descriptions: describedBy.map((id) => document.getElementById(id)?.textContent?.trim() ?? ''),
    };
  });
}

test('SCR-ELIG-005 stacks provider values at Patient phone widths without internal collision', async ({ page }) => {
  await gotoStory(page, 'patient-screens-scr-elig-005-provider-comparison--three-options');

  const boxes = await page.locator('[data-testid^="comparison-price-"]').evaluateAll((elements) =>
    elements.map((element) => {
      const rect = element.getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right };
    }),
  );

  expect(boxes).toHaveLength(3);
  for (let index = 1; index < boxes.length; index += 1) {
    expect(boxes[index].top, `provider value ${index + 1} must start below the prior provider value`).toBeGreaterThanOrEqual(boxes[index - 1].bottom - 1);
  }
});

test('shared Patient Screen emits one main landmark and clears structural axe findings', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  const representativeStories = [
    'patient-screens-scr-identity-001-patient-entry--default',
    'patient-screens-scr-elig-005-provider-comparison--three-options',
    'patient-screens-scr-booking-004-booking-detail--requested',
    'patient-screens-scr-finance-003-report-external-payment--default',
    'patient-screens-scr-claims-002-refund-request--default',
  ];

  for (const id of representativeStories) {
    await gotoStory(page, id);
    await expect(page.getByRole('main')).toHaveCount(1);
    const results = await new AxeBuilder({ page }).analyze();
    const structural = results.violations.filter((violation) => violation.id === 'landmark-one-main' || violation.id === 'region');
    expect(structural, `${id}: ${JSON.stringify(structural, null, 2)}`).toEqual([]);
  }
});

test('invalid fields expose recoverable error relationships after explicit submit', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);

  await gotoStory(page, 'patient-screens-scr-identity-002-phone-entry--default');
  await page.getByLabel('رقم الهاتف').fill('09123');
  await page.getByRole('button', { name: 'طلب رمز التحقق' }).click();

  const phoneState = await describedFieldState(page, 'رقم الهاتف');
  expect(phoneState.invalid).toBe('true');
  expect(phoneState.describedBy).toHaveLength(2);
  expect(phoneState.descriptions).toContain('استخدم رقمًا سوريًا يبدأ بـ 09.');
  expect(phoneState.descriptions).toContain('أدخل رقم هاتف سوري صالحًا يبدأ بـ 09 ويتكوّن من 10 أرقام.');

  await gotoStory(page, 'patient-screens-scr-finance-003-report-external-payment--empty-fields');
  await page.getByRole('button', { name: 'تسجيل هذه الواقعة' }).click();

  const amountState = await describedFieldState(page, 'المبلغ الذي دفعته خارج المنصة');
  expect(amountState.invalid).toBe('true');
  expect(amountState.describedBy).toHaveLength(2);
  expect(amountState.descriptions).toContain('أدخل قيمة الواقعة كما حدثت فعليًا.');
  expect(amountState.descriptions).toContain('أدخل مبلغًا أكبر من صفر.');
});
