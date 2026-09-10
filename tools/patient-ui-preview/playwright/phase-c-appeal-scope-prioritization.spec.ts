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

test('WP-UX-06 review appeal keeps deadline and scope ahead of grounds while process detail follows authoring', async ({ page }, testInfo) => {
  const id = 'patient-screens-scr-reviews-004-review-appeal--default';
  await gotoStory(page, id);
  await expectNoHorizontalOverflow(page, `${id} / ${testInfo.project.name}`);

  const decision = page.getByText('القرار الذي تعترض عليه', { exact: true });
  const deadline = page.getByText('مهلة تقديم الاعتراض', { exact: true });
  const scope = page.getByText('ما الذي يمكن لهذا الاعتراض مراجعته؟', { exact: true });
  const grounds = page.getByText('أساس اعتراضك', { exact: true });
  const process = page.getByText('مراجعة مستقلة', { exact: true });

  await expect(decision).toBeVisible();
  await expect(deadline).toBeVisible();
  await expect(scope).toBeVisible();
  await expect(page.getByText('الأهلية', { exact: true })).toBeVisible();
  await expect(page.getByText('التحقق', { exact: true })).toBeVisible();
  await expect(page.getByText('الالتزام بالسياسة', { exact: true })).toBeVisible();
  await expect(page.getByText('لا يغيّر قيمة التقييم أو نصه', { exact: true })).toBeVisible();
  await expect(grounds).toBeVisible();
  await expect(process).toBeVisible();

  const [decisionBox, deadlineBox, scopeBox, groundsBox, processBox] = await Promise.all([
    decision.boundingBox(),
    deadline.boundingBox(),
    scope.boundingBox(),
    grounds.boundingBox(),
    process.boundingBox(),
  ]);
  expect(decisionBox?.y).toBeLessThan(deadlineBox?.y ?? Number.POSITIVE_INFINITY);
  expect(deadlineBox?.y).toBeLessThan(scopeBox?.y ?? Number.POSITIVE_INFINITY);
  expect(scopeBox?.y).toBeLessThan(groundsBox?.y ?? Number.POSITIVE_INFINITY);
  expect(groundsBox?.y).toBeLessThan(processBox?.y ?? Number.POSITIVE_INFINITY);
});

test('WP-UX-06 claim appeal keeps original decision, historical window, scope and financial boundary controlling', async ({ page }, testInfo) => {
  const id = 'patient-screens-scr-claims-005-claim-appeal--default';
  await gotoStory(page, id);
  await expectNoHorizontalOverflow(page, `${id} / ${testInfo.project.name}`);

  const originalDecision = page.getByText('القرار الأصلي — يبقى محفوظًا', { exact: true });
  const policyDisclosure = page.getByRole('button', { name: 'عرض لقطة السياسة الحاكمة للاعتراض' });
  const deadline = page.getByText('مهلة الاعتراض على هذا القرار', { exact: true });
  const scope = page.getByText('نطاق هذا الاعتراض', { exact: true });
  const grounds = page.getByText('أساس الاعتراض', { exact: true }).first();
  const boundary = page.getByText('قبل الإرسال', { exact: true });

  await expect(originalDecision).toBeVisible();
  await expect(policyDisclosure).toBeVisible();
  await expect(policyDisclosure).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByText('لقطة سياسة الحماية الحاكمة عند قبول الشروط — الإصدار 2', { exact: true })).toBeVisible();
  await expect(deadline).toBeVisible();
  await expect(scope).toBeVisible();
  await expect(page.getByText('مراجعة تطبيق الوقائع والسياسة التي حكمت القرار', { exact: true })).toBeVisible();
  await expect(page.getByText('لا يمحو القرار الأصلي', { exact: true })).toBeVisible();
  await expect(grounds).toBeVisible();
  await expect(boundary).toBeVisible();
  await expect(page.getByText(/لا يضمن نتيجة أو مبلغًا ماليًا/)).toBeVisible();
  await expect(page.getByText(/لا ينفذ حركة أموال داخل UberTib/)).toBeVisible();

  const [originalBox, policyBox, deadlineBox, scopeBox, groundsBox, boundaryBox] = await Promise.all([
    originalDecision.boundingBox(),
    policyDisclosure.boundingBox(),
    deadline.boundingBox(),
    scope.boundingBox(),
    grounds.boundingBox(),
    boundary.boundingBox(),
  ]);
  expect(originalBox?.y).toBeLessThan(policyBox?.y ?? Number.POSITIVE_INFINITY);
  expect(policyBox?.y).toBeLessThan(deadlineBox?.y ?? Number.POSITIVE_INFINITY);
  expect(deadlineBox?.y).toBeLessThan(scopeBox?.y ?? Number.POSITIVE_INFINITY);
  expect(scopeBox?.y).toBeLessThan(groundsBox?.y ?? Number.POSITIVE_INFINITY);
  expect(groundsBox?.y).toBeLessThan(boundaryBox?.y ?? Number.POSITIVE_INFINITY);
});

test('claim appeal policy explanation remains recoverable without hiding provenance or deadline', async ({ page }, testInfo) => {
  onlyOnPrimaryProject(testInfo);
  await gotoStory(page, 'patient-screens-scr-claims-005-claim-appeal--default');

  const disclosure = page.getByRole('button', { name: 'عرض لقطة السياسة الحاكمة للاعتراض' });
  const snapshot = page.getByText('لقطة سياسة الحماية الحاكمة عند قبول الشروط — الإصدار 2', { exact: true });
  const deadline = page.getByText('مهلة الاعتراض على هذا القرار', { exact: true });

  await expect(snapshot).toBeVisible();
  await expect(deadline).toBeVisible();
  await expect(page.getByText('النافذة والشروط تأتي من النسخة التاريخية التي حكمت القرار.', { exact: true })).toHaveCount(0);

  await disclosure.click();
  await expect(page.getByRole('button', { name: 'إخفاء لقطة السياسة الحاكمة للاعتراض' })).toHaveAttribute('aria-expanded', 'true');
  await expect(snapshot).toBeVisible();
  await expect(deadline).toBeVisible();
  await expect(page.getByText('النافذة والشروط تأتي من النسخة التاريخية التي حكمت القرار.', { exact: true })).toBeVisible();
});
